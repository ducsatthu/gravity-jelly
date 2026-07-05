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
)

/**
 * Sinh MỘT đợt khay ([TrayGenerator.TRAY_SIZE] mảnh) có chống hạn. Thuần Kotlin/headless, deterministic
 * qua [Rng]. Không giữ state — bộ đếm hạn hán do [EndlessEngine] sở hữu (vào Snapshot). "Hữu ích" ở đây
 * = tạo được **line clear** (đường thoát phổ quát; xoá dòng KHÔNG theo màu — [findFullLines]). Merge siêu
 * khối là phần thưởng người chơi tự nhắm, không nằm trong lưới an toàn này.
 */
object WaveGenerator {

    enum class Tier { GREEN, YELLOW, RED }

    /** [pieces] = đợt khay; [hadHelpful] = đợt có ≥1 mảnh tạo clear trên bàn hiện tại; [tier] = bậc đã tính. */
    data class Wave(val pieces: List<Piece>, val hadHelpful: Boolean, val tier: Tier)

    /**
     * @param forceHelpful pity từ [EndlessEngine] (đủ [AntiDroughtConfig.pityWaves] đợt rủi ro không thoát).
     */
    fun deal(
        grid: Grid,
        pool: List<Shape>,
        colors: List<JellyColor>,
        rng: Rng,
        cfg: AntiDroughtConfig,
        forceHelpful: Boolean,
    ): Wave {
        val tier = tierFor(grid, cfg)
        val needHelpful = tier == Tier.RED || forceHelpful

        val pieces = ArrayList<Piece>(TrayGenerator.TRAY_SIZE)
        repeat(TrayGenerator.TRAY_SIZE) {
            val shape = pickShape(tier, pool, rng)
            val color = rng.pick(colors)
            pieces.add(ensurePlaceable(Piece(shape, color), grid, pool, cfg, rng))
        }

        var hadHelpful = pieces.any { isLineClearing(grid, it) }
        if (needHelpful && !hadHelpful) {
            val hp = findLineClearingPiece(grid, pool, colors, rng)
            if (hp != null) {
                pieces[rng.nextInt(pieces.size)] = hp
                hadHelpful = true
            }
        }
        return Wave(pieces, hadHelpful, tier)
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

    /** 🟢 RNG thuần (giữ đúng thứ tự rng cũ). 🟡/🔴 ưu tiên mảnh nhỏ ≤4 ô cho dễ lấp khe. */
    private fun pickShape(tier: Tier, pool: List<Shape>, rng: Rng): Shape {
        if (tier == Tier.GREEN) return rng.pick(pool)
        val small = pool.filter { it.size <= 4 }
        return rng.pick(if (small.isNotEmpty()) small else pool)
    }

    /** Đảm bảo mảnh đặt được đâu đó trên bàn; nếu không, resample hình (bounded) rồi fallback mảnh nhỏ nhất vừa. */
    private fun ensurePlaceable(
        piece: Piece, grid: Grid, pool: List<Shape>, cfg: AntiDroughtConfig, rng: Rng,
    ): Piece {
        if (canFreePlaceAnywhere(grid, piece)) return piece
        var tries = cfg.maxResample
        while (tries-- > 0) {
            val s = rng.pick(pool)
            val p = Piece(s, piece.color)
            if (canFreePlaceAnywhere(grid, p)) return p
        }
        val fit = pool.filter { canFreePlaceAnywhere(grid, Piece(it, piece.color)) }.minByOrNull { it.size }
        return Piece(fit ?: PieceLibrary.DOT, piece.color)
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
            if (isLineClearing(grid, Piece(shape, colors.first()))) return Piece(shape, rng.pick(colors))
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
