package com.gravityjelly.core

/**
 * Cấu hình CHỐNG HẠN khay (anti-drought) — bảo đảm mỗi đợt 3 mảnh có "đường thoát", không để người
 * chơi kẹt/chờ quá lâu mới ra mảnh dùng được. TẮT (null trong [EndlessTuning]) = RNG thuần như cũ.
 *
 * Ba bậc theo ĐỘ ĐẦY bàn (tỉ lệ ô đã chiếm):
 * - 🟢 dưới [yellowFill]: RNG thuần, giữ đa dạng (người chơi tự tính).
 * - 🟡 [yellowFill]..[redFill]: nghiêng về mảnh NHỎ (≤4 ô) cho dễ lấp khe.
 * - 🔴 ≥ [redFill] **hoặc** hạn hán chạm [pityWaves]: ÉP ≥1 mảnh tạo được clear (nếu bàn có dòng
 *   gần đầy nào lấp được). Người chơi VẪN phải tự chọn đặt ở đâu — chỉ bảo đảm *tồn tại* đường thoát.
 */
data class AntiDroughtConfig(
    val yellowFill: Double = 0.55,
    val redFill: Double = 0.72,
    /** Số đợt RỦI RO (bậc ≥🟡) liên tiếp KHÔNG có mảnh hữu ích thì ép đợt kế phải có. */
    val pityWaves: Int = 2,
    /** Trần số lần resample khi tìm mảnh đặt-được (chặn vòng lặp; deterministic). */
    val maxResample: Int = 24,
    /**
     * Cứ tối đa bấy nhiêu đợt KHÔNG có khối "đặc biệt" ([PieceLibrary.SPECIAL]: pentomino/3×3/chéo)
     * thì ép đợt kế chèn 1 khối đặc biệt (đặt-được) — bảo đảm gặp đủ 24 loại dù bốc-thường nghiêng về
     * mảnh nhỏ dễ combo. 0 = tắt (không bao giờ ép).
     */
    val specialEveryWaves: Int = 3,
)

/**
 * Sinh MỘT đợt khay ([TrayGenerator.TRAY_SIZE] mảnh) có chống hạn. Thuần Kotlin/headless, deterministic
 * qua [Rng]. Không giữ state — bộ đếm hạn hán do [EndlessEngine] sở hữu (vào Snapshot). "Hữu ích" ở đây
 * = tạo được **line clear** (đường thoát phổ quát; xoá dòng KHÔNG theo màu — [findFullLines]). Merge siêu
 * khối là phần thưởng người chơi tự nhắm, không nằm trong lưới an toàn này.
 */
object WaveGenerator {

    enum class Tier { GREEN, YELLOW, RED }

    /**
     * [pieces] = đợt khay; [hadHelpful] = có ≥1 mảnh lấp-kín-hàng trên bàn hiện tại; [hadSpecial] = có
     * ≥1 khối [PieceLibrary.SPECIAL]; [tier] = bậc độ đầy.
     */
    data class Wave(
        val pieces: List<Piece>,
        val hadHelpful: Boolean,
        val tier: Tier,
        val hadSpecial: Boolean,
    )

    /**
     * COMBO-FRIENDLY: bốc-thường bốc CÓ TRỌNG SỐ theo LỚP CỠ, nghiêng về mảnh nhỏ/linh hoạt (dễ lấp khe →
     * dễ combo); bàn càng đầy càng nghiêng nhỏ. Khối đặc biệt (pentomino/3×3/chéo) trọng số 0 ở bốc-thường,
     * chỉ ra qua CHÈN ĐỊNH KỲ để vẫn gặp đủ 24 loại. Vẫn ĐẢM BẢO ĐƯỜNG THOÁT khi bàn đầy. Deterministic qua [rng].
     *
     * @param forceHelpful pity từ [EndlessEngine] (đủ [AntiDroughtConfig.pityWaves] đợt rủi ro không thoát).
     * @param forceSpecial tới hạn [AntiDroughtConfig.specialEveryWaves] đợt không có khối đặc biệt → ép chèn 1.
     */
    fun deal(
        grid: Grid,
        pool: List<Shape>,
        colors: List<JellyColor>,
        rng: Rng,
        cfg: AntiDroughtConfig,
        forceHelpful: Boolean,
        forceSpecial: Boolean = false,
    ): Wave {
        val tier = tierFor(grid, cfg)
        val needHelpful = tier == Tier.RED || forceHelpful

        val pieces = ArrayList<Piece>(TrayGenerator.TRAY_SIZE)
        repeat(TrayGenerator.TRAY_SIZE) {
            val shape = pickByClass(pool, tier, rng)
            val color = rng.pick(colors)
            pieces.add(ensurePlaceable(PieceLibrary.dealt(shape, color), grid, pool, cfg, rng))
        }

        // CHÈN KHỐI ĐẶC BIỆT (đủ 24 loại) — nếu tới hạn và đợt chưa có khối đặc biệt nào đặt-được.
        var hadSpecial = pieces.any { it.shape in PieceLibrary.SPECIAL }
        if (forceSpecial && !hadSpecial) {
            val sp = findPlaceableSpecial(grid, pool, colors, rng)
            if (sp != null) {
                pieces[rng.nextInt(pieces.size)] = sp
                hadSpecial = true
            }
        }

        // ĐẢM BẢO ĐƯỜNG THOÁT: chèn mảnh lấp-kín-hàng vào slot KHÔNG-đặc-biệt (giữ lại khối đặc biệt vừa chèn).
        var hadHelpful = pieces.any { isLineClearing(grid, it) }
        if (needHelpful && !hadHelpful) {
            val hp = findLineClearingPiece(grid, pool, colors, rng)
            if (hp != null) {
                val idx = pieces.indices.firstOrNull { pieces[it].shape !in PieceLibrary.SPECIAL }
                    ?: rng.nextInt(pieces.size)
                pieces[idx] = hp
                hadHelpful = true
            }
        }
        return Wave(pieces, hadHelpful, tier, hadSpecial)
    }

    /** Lớp cỡ dùng cho bốc-thường (khối đặc biệt không thuộc lớp nào). */
    private enum class SizeClass { SMALL, MED, LARGE }

    /**
     * Lớp cỡ của [shape] cho bốc-thường; **null** nếu là khối [PieceLibrary.SPECIAL] (trọng số 0 — chỉ ra
     * qua chèn định kỳ). Đặc biệt (≥5 ô + chéo) đã loại nên nhánh `else` chỉ còn mảnh 4 ô.
     */
    private fun sizeClassOf(shape: Shape): SizeClass? {
        if (shape in PieceLibrary.SPECIAL) return null
        return when (shape.size) {
            1, 2 -> SizeClass.SMALL
            3 -> SizeClass.MED
            else -> SizeClass.LARGE
        }
    }

    /**
     * Trọng số theo LỚP CỠ (không theo từng hình) — bàn càng đầy càng nghiêng mảnh nhỏ để dễ lấp khe.
     * Vì bốc lớp trước rồi mới bốc đều 1 hình trong lớp, tỉ lệ ra mỗi cỡ ĐỘC LẬP với số biến thể của cỡ
     * đó (19 hình 4 ô không còn lấn át 3 hình ≤2 ô như bốc per-shape cũ).
     */
    private fun classWeight(cls: SizeClass, tier: Tier): Int = when (tier) {
        Tier.GREEN -> when (cls) { SizeClass.SMALL -> 40; SizeClass.MED -> 30; SizeClass.LARGE -> 30 }
        Tier.YELLOW -> when (cls) { SizeClass.SMALL -> 45; SizeClass.MED -> 32; SizeClass.LARGE -> 23 }
        Tier.RED -> when (cls) { SizeClass.SMALL -> 55; SizeClass.MED -> 30; SizeClass.LARGE -> 15 }
    }

    /**
     * Bốc-thường CHUẨN HOÁ THEO LỚP CỠ: bốc LỚP (SMALL/MED/LARGE) theo [classWeight] rồi bốc ĐỀU 1 hình
     * trong lớp. Nhờ vậy tỉ lệ ra mỗi cỡ đúng ý đồ, KHÔNG bị lệch vì số biến thể mỗi cỡ chênh nhau. Khối
     * đặc biệt (trọng số 0) không thuộc lớp nào — chỉ ra qua chèn định kỳ. Deterministic: tối đa 2 lần
     * [Rng.nextInt] (lớp, rồi hình); thứ tự duyệt cố định qua [SizeClass.entries] và thứ tự [pool].
     * Fallback [Rng.pick] nếu [pool] không có hình thường nào (chỉ toàn đặc biệt).
     */
    private fun pickByClass(pool: List<Shape>, tier: Tier, rng: Rng): Shape {
        val byClass = HashMap<SizeClass, MutableList<Shape>>()
        for (s in pool) sizeClassOf(s)?.let { byClass.getOrPut(it) { ArrayList() }.add(s) }
        val classes = SizeClass.entries.filter { byClass.containsKey(it) }
        if (classes.isEmpty()) return rng.pick(pool)
        var total = 0
        for (c in classes) total += classWeight(c, tier)
        var r = rng.nextInt(total)
        var chosen = classes.last()
        for (c in classes) {
            r -= classWeight(c, tier)
            if (r < 0) { chosen = c; break }
        }
        val bucket = byClass.getValue(chosen)
        return bucket[rng.nextInt(bucket.size)]
    }

    /**
     * 1 khối đặc biệt ĐẶT-ĐƯỢC, bốc CÔNG BẰNG theo KIỂU ([PieceLibrary.SPECIAL_KINDS]): lọc các kiểu còn
     * ≥1 hướng vừa [pool] & đặt-được, bốc 1 kiểu rồi 1 hướng trong kiểu → 3×3 (1 hướng) không bị pentomino
     * (nhiều hướng) lấn át. Null nếu không kiểu nào đặt-được. Màu qua [rng].
     */
    private fun findPlaceableSpecial(grid: Grid, pool: List<Shape>, colors: List<JellyColor>, rng: Rng): Piece? {
        val kinds = PieceLibrary.SPECIAL_KINDS.mapNotNull { kind ->
            kind.filter { it in pool && canFreePlaceAnywhere(grid, PieceLibrary.dealt(it, colors.first())) }
                .ifEmpty { null }
        }
        if (kinds.isEmpty()) return null
        val kind = kinds[rng.nextInt(kinds.size)]
        val shape = kind[rng.nextInt(kind.size)]
        return PieceLibrary.dealt(shape, rng.pick(colors))
    }

    private fun tierFor(grid: Grid, cfg: AntiDroughtConfig): Tier {
        val total = grid.size * grid.size
        var occ = 0
        for (y in 0 until grid.size) for (x in 0 until grid.size) if (!grid.isEmpty(x, y)) occ++
        val fill = occ.toDouble() / total
        return when {
            fill >= cfg.redFill -> Tier.RED
            fill >= cfg.yellowFill -> Tier.YELLOW
            else -> Tier.GREEN
        }
    }

    /** Đảm bảo mảnh đặt được đâu đó trên bàn; nếu không, resample hình (bounded) rồi fallback mảnh nhỏ nhất vừa. */
    private fun ensurePlaceable(
        piece: Piece, grid: Grid, pool: List<Shape>, cfg: AntiDroughtConfig, rng: Rng,
    ): Piece {
        if (canFreePlaceAnywhere(grid, piece)) return piece
        var tries = cfg.maxResample
        while (tries-- > 0) {
            val s = rng.pick(pool)
            val p = PieceLibrary.dealt(s, piece.color)
            if (canFreePlaceAnywhere(grid, p)) return p
        }
        val fit = pool.filter { canFreePlaceAnywhere(grid, PieceLibrary.dealt(it, piece.color)) }.minByOrNull { it.size }
        return PieceLibrary.dealt(fit ?: PieceLibrary.DOT, piece.color)
    }

    /**
     * Tìm 1 mảnh mà TỒN TẠI vị trí đặt-tự-do lấp đầy ≥1 hàng/cột (line clear). Quét pool từ một điểm
     * bắt đầu ngẫu-nhiên-deterministic để đa dạng hình; màu chọn qua [rng] (clear độc lập màu). Null nếu
     * bàn chưa có dòng nào một mảnh lấp kín được.
     */
    fun findLineClearingPiece(grid: Grid, pool: List<Shape>, colors: List<JellyColor>, rng: Rng): Piece? {
        if (pool.isEmpty()) return null
        val start = rng.nextInt(pool.size)
        for (k in pool.indices) {
            val shape = pool[(start + k) % pool.size]
            if (isLineClearing(grid, Piece(shape, colors.first()))) return PieceLibrary.dealt(shape, rng.pick(colors))
        }
        return null
    }

    /** Có tồn tại vị trí đặt-tự-do của [piece] lấp đầy ≥1 hàng/cột không (xoá dòng, độc lập màu). */
    fun isLineClearing(grid: Grid, piece: Piece): Boolean {
        val s = piece.shape
        val maxOx = grid.size - s.width
        val maxOy = grid.size - s.height
        if (maxOx < 0 || maxOy < 0) return false
        for (oy in 0..maxOy) for (ox in 0..maxOx) {
            val cells = s.at(ox, oy)
            if (cells.all { grid.isEmpty(it.x, it.y) } && completesALine(grid, cells)) return true
        }
        return false
    }

    /** Nếu thêm [cells] (đều đang trống) vào lưới thì có hàng/cột nào ĐẦY không. Chỉ xét dòng mảnh chạm tới. */
    private fun completesALine(grid: Grid, cells: List<Vec>): Boolean {
        val set = cells.toHashSet()
        for (y in cells.mapTo(HashSet()) { it.y }) {
            if ((0 until grid.size).all { x -> !grid.isEmpty(x, y) || Vec(x, y) in set }) return true
        }
        for (x in cells.mapTo(HashSet()) { it.x }) {
            if ((0 until grid.size).all { y -> !grid.isEmpty(x, y) || Vec(x, y) in set }) return true
        }
        return false
    }
}
