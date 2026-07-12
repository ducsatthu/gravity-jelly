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
     * COMBO-FRIENDLY: bốc-thường bốc CÓ TRỌNG SỐ nghiêng về mảnh nhỏ/linh hoạt (dễ lấp khe → dễ combo);
     * khối đặc biệt (pentomino/3×3/chéo) trọng số 0 ở bốc-thường, chỉ ra qua CHÈN ĐỊNH KỲ để vẫn gặp đủ
     * 24 loại. Vẫn ĐẢM BẢO ĐƯỜNG THOÁT khi bàn đầy. Deterministic qua [rng].
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
            val shape = weightedPick(pool, rng) { comboWeight(it, tier) }
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

    /**
     * Trọng số bốc-thường: khối [PieceLibrary.SPECIAL] = 0 (chỉ ra qua chèn định kỳ). Còn lại: mảnh
     * càng nhỏ càng cao (dễ lấp khe → dễ combo); bậc 🔴 (bàn rất đầy) ưu tiên nhỏ mạnh hơn.
     */
    private fun comboWeight(shape: Shape, tier: Tier): Int {
        if (shape in PieceLibrary.SPECIAL) return 0
        return when (shape.size) {
            1, 2 -> if (tier == Tier.RED) 8 else 5
            3 -> if (tier == Tier.RED) 6 else 4
            else -> if (tier == Tier.RED) 2 else 3   // size 4
        }
    }

    /** Bốc 1 hình theo trọng số [weightOf] (deterministic: 1 lần [Rng.nextInt]). Mọi trọng số 0 → uniform. */
    private inline fun weightedPick(pool: List<Shape>, rng: Rng, weightOf: (Shape) -> Int): Shape {
        var total = 0
        for (s in pool) total += weightOf(s)
        if (total <= 0) return rng.pick(pool)
        var r = rng.nextInt(total)
        for (s in pool) {
            r -= weightOf(s)
            if (r < 0) return s
        }
        return pool.last()
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
