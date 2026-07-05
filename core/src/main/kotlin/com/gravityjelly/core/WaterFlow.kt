package com.gravityjelly.core

/**
 * Cơ chế chữ ký World 3 · Sông & Thác — **Dòng chảy / Nguồn nước** (redesign v5, 05/07). Thuần/headless,
 * deterministic (cùng seed + input = cùng kết quả). Xem `docs/02-thiet-ke-man/07-world-3-nhip-nuoc.md`.
 *
 * Một [WaterSource] nằm ở **hàng trên cùng** và **luôn chảy XUỐNG** (cố định, độc lập trọng lực — kể cả
 * khi boss L30 đảo trọng lực). Mỗi lượt hợp lệ nguồn **mọc thêm đúng 1 ô** dòng chảy ([growWaterFlow]):
 * ưu tiên đi xuống; ô dưới bị chặn thì **rẽ ngang** (TRÁI trước, rồi phải) rồi lượt sau chảy xuống tiếp
 * → [flow] là một **đường gấp khúc** luồn quanh vật cản (mô hình `StreamPath` của design).
 *
 * Ô nguồn/dòng chảy là **lớp sàn** ([CellEffect]) dưới jelly. Jelly đứng trên nước bị **đẩy 1 ô** theo
 * dòng ([pushJellyByFlow]) kiểu **đoàn tàu** (sokoban): cụm dính bị **xé** — chỉ những khối nằm trên
 * kênh nước trôi, khối dính ngoài kênh ở lại; đầu đoàn bị chặn thì rẽ TRÁI trước rồi phải.
 *
 * Phá nguồn: **clear hàng/cột đi qua chính ô nguồn** ([WaterSource.pos]) → [breakSource] tắt cả chuỗi
 * (không còn "ô giọt" liên kết). KHÔNG dùng RNG — xác định hoàn toàn bởi state + input.
 */
data class WaterSource(
    val id: Int,
    /** Ô nguồn (cố định, ở hàng trên cùng). Mang [CellEffect.WATER_SOURCE]. */
    val pos: Vec,
    /** false khi đã phá (không mọc, không đẩy nữa). */
    val active: Boolean = true,
    /** true = nguồn khô (render nứt). */
    val broken: Boolean = false,
    /** Đường dòng chảy đã mọc (gấp khúc), thứ tự gốc → ngọn; KHÔNG gồm ô nguồn. */
    val flow: List<Vec> = emptyList(),
    /** (Vestigial — không còn dùng để dừng; dòng KẾT THÚC khi ngọn chạm hàng đáy). Giữ cho tương thích spec. */
    val maxLength: Int = DEFAULT_MAX_LENGTH,
) {
    companion object {
        const val DEFAULT_MAX_LENGTH = 8
    }
}

/** Hướng chảy CỐ ĐỊNH của mọi nguồn: xuống dưới (y tăng). */
private val FLOW_DIR = Vec(0, 1)

/** Hai hướng rẽ khi bị chặn, TRÁI trước rồi phải (vuông góc [FLOW_DIR]). */
private fun detourDirs(dir: Vec): List<Vec> = listOf(Vec(-dir.y, dir.x), Vec(dir.y, -dir.x))

/**
 * Kết quả 1 lượt mọc: nguồn đã cập nhật + ô vừa mọc (animation NEW_THIS_TURN) + các cặp (từ→tới) khối
 * bị **đẩy dồn** khi nước lấn tới (frontier push — cho animation trượt).
 */
data class GrowResult(
    val sources: List<WaterSource>,
    val newCells: List<Vec>,
    val pushes: List<Pair<Vec, Vec>> = emptyList(),
)

/** Kết quả mọc 1 nguồn: nguồn sau · ô vừa mọc (null nếu bí) · các khối bị dồn xuống. */
data class GrowStep(val source: WaterSource, val newCell: Vec?, val pushes: List<Pair<Vec, Vec>>)

/**
 * Mọc 1 ô cho **mỗi** nguồn active, theo thứ tự [WaterSource.id] tăng dần (deterministic).
 * Mỗi nguồn mọc **tối đa 1 ô/lượt**. Đặt sàn [CellEffect.WATER_FLOW] vào [grid] ngay (nguồn sau
 * thấy để không đè). Trả về [GrowResult] (gồm cả các khối bị dồn xuống khi nước lấn tới).
 */
fun growWaterFlow(grid: Grid, sources: List<WaterSource>): GrowResult {
    val newCells = mutableListOf<Vec>()
    val pushes = mutableListOf<Pair<Vec, Vec>>()
    val updated = sources.sortedBy { it.id }.map { src ->
        val step = growSource(grid, src)
        step.newCell?.let { newCells.add(it) }
        pushes.addAll(step.pushes)
        step.source
    }
    val byId = updated.associateBy { it.id }
    return GrowResult(sources.map { byId.getValue(it.id) }, newCells, pushes)
}

/**
 * Mọc 1 ô cho 1 nguồn — mô hình **CÂY nhiều nhánh** (như dây leo tách mầm). Mỗi lượt:
 * - Xét **mọi ô nước** (nguồn + [WaterSource.flow]) chưa ở hàng đáy; ô "đi được" = lấn/dồn được sang ít
 *   nhất một trong **[XUỐNG, TRÁI, PHẢI]** (dồn toa theo hướng đó).
 * - Chọn ô nước **THẤP NHẤT** còn đi được (max y, hoà thì x nhỏ) → mọc **1 ô** từ nó theo hướng khả thi
 *   đầu tiên (ưu tiên xuống; bí thì rẽ TRÁI trước, phải sau). Khi ngọn sâu nhất bị chặn hẳn, ô thấp kế
 *   sẽ **tách nhánh mới** — nước chảy không ngừng ở mọi nhánh tới khi bị chặn hết.
 * - Ô chạm **hàng đáy** = nhánh kết thúc (không mọc thêm từ đó). Không giới hạn tổng độ dài.
 * Đánh giá KHÔNG mutate; chỉ áp (setEffect + [shoveColumn]) cho ô thắng. Trả về [GrowStep].
 */
fun growSource(grid: Grid, source: WaterSource): GrowStep {
    if (!source.active || source.broken) return GrowStep(source, null, emptyList())

    var bestW: Vec? = null; var bestDir: Vec? = null
    for (w in listOf(source.pos) + source.flow) {
        if (w.y >= grid.size - 1) continue                // ô ở đáy = nhánh đã kết thúc
        val dir = growDirFrom(grid, w) ?: continue
        if (bestW == null || w.y > bestW.y || (w.y == bestW.y && w.x < bestW.x)) {
            bestW = w; bestDir = dir
        }
    }
    if (bestW == null || bestDir == null) return GrowStep(source, null, emptyList())

    val target = Vec(bestW.x + bestDir.x, bestW.y + bestDir.y)
    val pushes = if (canLayChannel(grid, target)) emptyList() else shoveColumn(grid, target, bestDir)
    grid.setEffect(target.x, target.y, CellEffect.WATER_FLOW)
    return GrowStep(source.copy(flow = source.flow + target), target, pushes)
}

/**
 * Hướng mọc của ô nước [w] (thuần): ưu tiên **XUỐNG**; nếu xuống bị chặn bởi **vật cản** (đá/jelly không
 * dồn được — KHÔNG phải nước của chính dòng) thì mới rẽ **TRÁI** rồi **phải** (route quanh cản). Nếu ô
 * dưới đã là NƯỚC (ô trong lòng dòng) → [w] KHÔNG rẽ ngang (tránh lan ngang vô tận). null = không mọc được.
 */
private fun growDirFrom(grid: Grid, w: Vec): Vec? {
    if (canGrowFrom(grid, w, FLOW_DIR)) return FLOW_DIR
    // xuống không mọc được: chỉ rẽ khi ô dưới là VẬT CẢN (không phải nước)
    if (grid.effect(w.x, w.y + FLOW_DIR.y) != CellEffect.NONE) return null   // ô dưới là nước → không rẽ
    return detourDirs(FLOW_DIR).firstOrNull { canGrowFrom(grid, w, it) }
}

/** Ô nước [w] có thể mọc/dồn sang [dir] không (thuần, KHÔNG mutate). */
private fun canGrowFrom(grid: Grid, w: Vec, dir: Vec): Boolean {
    val t = Vec(w.x + dir.x, w.y + dir.y)
    if (canLayChannel(grid, t)) return true
    return grid.inBounds(t.x, t.y) && grid.effect(t.x, t.y) == CellEffect.NONE &&
        grid.get(t.x, t.y)?.type == CellType.BLOCK && canShoveTrain(grid, t, dir)
}

/** Đoàn khối từ [start] theo [dir] có dồn được 1 ô không (ô sau đoàn trống & trong lưới) — thuần. */
private fun canShoveTrain(grid: Grid, start: Vec, dir: Vec): Boolean {
    var c = start
    while (grid.inBounds(c.x, c.y) && grid.effect(c.x, c.y) == CellEffect.NONE &&
        grid.get(c.x, c.y)?.type == CellType.BLOCK
    ) c = Vec(c.x + dir.x, c.y + dir.y)
    return grid.inBounds(c.x, c.y) && grid.effect(c.x, c.y) == CellEffect.NONE && grid.isEmpty(c.x, c.y)
}

/**
 * Dồn **đoàn khối** (dãy jelly `BLOCK` liên tiếp từ [start] theo [dir], không nằm trên sàn nước) **1 ô
 * theo [dir]** (giả định đã kiểm [canShoveTrain]). Trả về (từ→tới) mỗi khối đã dời. Xé khỏi cụm ngoài đoàn.
 */
private fun shoveColumn(grid: Grid, start: Vec, dir: Vec): List<Pair<Vec, Vec>> {
    val train = ArrayList<Vec>()
    var c = start
    while (grid.inBounds(c.x, c.y) && grid.effect(c.x, c.y) == CellEffect.NONE &&
        grid.get(c.x, c.y)?.type == CellType.BLOCK
    ) {
        train.add(c); c = Vec(c.x + dir.x, c.y + dir.y)
    }
    val beyond = c   // ô ngay sau đoàn
    if (!grid.inBounds(beyond.x, beyond.y) || grid.effect(beyond.x, beyond.y) != CellEffect.NONE ||
        !grid.isEmpty(beyond.x, beyond.y)
    ) return emptyList()   // đoàn chạm tường/đá/nước → không dồn được
    val moves = ArrayList<Pair<Vec, Vec>>(train.size)
    for (t in train.asReversed()) {   // dời từ cuối đoàn để nhường chỗ
        val to = Vec(t.x + dir.x, t.y + dir.y)
        grid.set(to.x, to.y, grid.get(t.x, t.y))
        grid.set(t.x, t.y, null)
        moves.add(t to to)
    }
    return moves
}

/** Ô có thể lấn dòng chảy vào: trong lưới, chưa có sàn nước, và trống occupant. */
private fun canLayChannel(grid: Grid, c: Vec): Boolean =
    grid.inBounds(c.x, c.y) && grid.effect(c.x, c.y) == CellEffect.NONE && grid.isEmpty(c.x, c.y)

/**
 * Đẩy jelly ĐANG ĐỨNG trên kênh nước 1 ô **theo dòng chảy cục bộ** (drift — khối "trôi theo current").
 * Khác [shoveColumn] (dồn ở frontier khi mọc): đây xử khối rơi/đặt lên kênh sẵn có.
 * - Hướng trôi tại mỗi ô = hướng tới **ô con** (ô nước mọc SAU, kề bên) → khối đi đúng đường nước (xuống,
 *   rẽ theo khúc). Ô ngọn (không con) → thử xuống. Ưu tiên con: xuống > trái > phải.
 * - Duyệt **xuôi dòng trước** (order lớn trước) để dải khối trôi cùng như đoàn tàu; đích bị chặn → đứng yên.
 * - Ô **nguồn** KHÔNG trôi nắp của nó (giữ cơ chế úp nắp phá cột). Sàn nước không dời.
 * Trả về (từ→tới) cho animation.
 */
fun pushJellyByFlow(grid: Grid, sources: List<WaterSource>): List<Pair<Vec, Vec>> {
    val moves = mutableListOf<Pair<Vec, Vec>>()
    for (s in sources.sortedBy { it.id }) {
        if (!s.active || s.flow.isEmpty()) continue
        val cells = ArrayList<Vec>(s.flow.size + 1)
        cells.add(s.pos); cells.addAll(s.flow)
        val order = HashMap<Int, Int>(cells.size * 2)
        for (i in cells.indices) order[cells[i].y * 100 + cells[i].x] = i
        // hướng tới ô con tại mỗi ô (ưu tiên xuống > trái > phải)
        val childDir = HashMap<Int, Vec>()
        for (i in 1 until cells.size) {
            val c = cells[i]
            val par = waterParent(cells, order, i) ?: continue
            val dir = Vec(c.x - par.x, c.y - par.y)
            val k = par.y * 100 + par.x
            val cur = childDir[k]
            if (cur == null || dirRank(dir) < dirRank(cur)) childDir[k] = dir
        }
        // xuôi dòng trước (order desc)
        for (c in cells.sortedByDescending { order.getValue(it.y * 100 + it.x) }) {
            val occ = grid.get(c.x, c.y) ?: continue
            if (occ.type != CellType.BLOCK) continue
            // Ô NGUỒN: chỉ **thạch nước (BLUE)** được úp nắp (đứng yên); màu khác cũng trôi theo dòng.
            if (c == s.pos && occ.color == JellyColor.BLUE) continue
            val dir = childDir[c.y * 100 + c.x] ?: FLOW_DIR
            val dest = Vec(c.x + dir.x, c.y + dir.y)
            if (!canDrift(grid, dest)) continue
            grid.set(dest.x, dest.y, occ)
            grid.set(c.x, c.y, null)
            moves.add(c to dest)
        }
    }
    return moves
}

/** Ô nước mọc TRƯỚC kề [cells]`[i]` (cha trên cây) — ô kề có order nhỏ hơn. */
private fun waterParent(cells: List<Vec>, order: HashMap<Int, Int>, i: Int): Vec? {
    val c = cells[i]
    for (nb in arrayOf(Vec(c.x, c.y - 1), Vec(c.x - 1, c.y), Vec(c.x + 1, c.y), Vec(c.x, c.y + 1))) {
        val j = order[nb.y * 100 + nb.x] ?: continue
        if (j < i) return nb
    }
    return null
}

/** Thứ tự ưu tiên hướng con khi drift: xuống(0) > trái(1) > phải(2) > khác(3). */
private fun dirRank(d: Vec): Int = when {
    d.x == 0 && d.y == 1 -> 0
    d.x == -1 && d.y == 0 -> 1
    d.x == 1 && d.y == 0 -> 2
    else -> 3
}

/** Ô jelly có thể trôi tới: trong lưới và trống occupant (đá/jelly khác chặn). */
private fun canDrift(grid: Grid, c: Vec): Boolean =
    grid.inBounds(c.x, c.y) && grid.isEmpty(c.x, c.y)

/**
 * Phá 1 nguồn: tắt cả chuỗi. Mọi ô [CellEffect.WATER_FLOW] của nguồn → NONE; ô nguồn giữ
 * [CellEffect.WATER_SOURCE] (render khô nhờ cờ [WaterSource.broken]). Trả về nguồn sau cập nhật
 * (active=false, broken=true, flow rỗng). Animation fade/splash do `:game` bắn từ event.
 */
fun breakSource(grid: Grid, source: WaterSource): WaterSource {
    for (f in source.flow) {
        if (grid.effect(f.x, f.y) == CellEffect.WATER_FLOW) grid.setEffect(f.x, f.y, CellEffect.NONE)
    }
    return source.copy(active = false, broken = true, flow = emptyList())
}
