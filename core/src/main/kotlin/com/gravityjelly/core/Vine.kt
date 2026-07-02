package com.gravityjelly.core

/**
 * Cơ chế chữ ký World 2 · Rừng rậm — **DÂY LEO mọc lan** (Creeping Vine). Thuần/headless,
 * deterministic (bắt buộc cho solver/Daily). Xem `docs/levels/goal-system-v2.md §8`.
 *
 * Cấu trúc: mỗi dây = 1 thành phần liên thông 4-kề các ô [CellType.VINE], chứa 1 **gốc**
 * ([Grid.Cell.vineRoot]) + chuỗi **đốt**. Ô dây KHÔNG rơi theo trọng lực/xoay (xem `isJelly`
 * trong [ClusterPhysics]) — bám như rễ trong khi mọi thứ khác đổ.
 *
 * Ba luật (hàm thuần của state + hướng trọng lực → không phá deterministic):
 *  - [growVines]: cứ sau mỗi `growEveryN` lượt thả, mỗi dây mọc 1 đốt từ **đầu dây** (tip) sang ô
 *    trống kề, thứ tự hướng cố định `[ngược-gravity → phải → theo-gravity → trái]`.
 *  - [destroyVineOfRoot]: xoá dòng đi qua GỐC → cả dây tan (gốc + mọi đốt) — cách hoàn thành mục tiêu.
 *  - [wiltDisconnectedVines]: đốt mất kết nối với gốc → khô héo thành ô trống (thưởng cắt gần gốc).
 */

/** Ô có phải dây leo (gốc hoặc đốt)? */
private fun isVine(grid: Grid, x: Int, y: Int): Boolean =
    grid.get(x, y)?.type == CellType.VINE

/** Số gốc dây leo hiện trên bàn (dùng cho tiến độ mục tiêu CLEAR_TARGETS). */
fun countVineRoots(grid: Grid): Int {
    var n = 0
    for (y in 0 until grid.size) for (x in 0 until grid.size)
        if (grid.get(x, y)?.isVineRoot == true) n++
    return n
}

/** Có bất kỳ ô dây leo nào trên bàn không (gate nhịp mọc — bàn không dây thì bỏ qua). */
fun hasVines(grid: Grid): Boolean {
    for (y in 0 until grid.size) for (x in 0 until grid.size)
        if (isVine(grid, x, y)) return true
    return false
}

/** Hướng ngược lại (dùng cho thứ tự mọc "ngược hướng trọng lực" trước tiên). */
private fun Direction.opposite(): Direction = when (this) {
    Direction.DOWN -> Direction.UP
    Direction.UP -> Direction.DOWN
    Direction.LEFT -> Direction.RIGHT
    Direction.RIGHT -> Direction.LEFT
}

/**
 * Thứ tự 4 hướng mọc bám [gravity]: `[ngược-gravity, phải, theo-gravity, trái]`. "Phải/trái" suy từ
 * xoay: với gravity=DOWN → `[UP, RIGHT, DOWN, LEFT]` (đúng ví dụ spec, toạ độ trọng lực xuống).
 */
private fun growOrder(gravity: Direction): List<Direction> =
    listOf(gravity.opposite(), gravity.rotateCCW(), gravity, gravity.rotateCW())

/** Thành phần liên thông 4-kề các ô VINE chứa [start] (BFS), sắp theo (y,x) — deterministic. */
private fun vineComponent(grid: Grid, start: Vec): List<Vec> {
    val seen = HashSet<Vec>()
    val out = ArrayList<Vec>()
    val q = ArrayDeque<Vec>()
    q.add(start); seen.add(start)
    while (q.isNotEmpty()) {
        val c = q.removeFirst()
        out.add(c)
        for (d in Direction.entries) {
            val n = Vec(c.x + d.dx, c.y + d.dy)
            if (grid.inBounds(n.x, n.y) && n !in seen && isVine(grid, n.x, n.y)) {
                seen.add(n); q.add(n)
            }
        }
    }
    return out
}

/** Tất cả thành phần dây leo trên bàn, mỗi cái sắp theo (y,x); danh sách deterministic (duyệt (y,x)). */
private fun vineComponents(grid: Grid): List<List<Vec>> {
    val seen = HashSet<Vec>()
    val comps = ArrayList<List<Vec>>()
    for (y in 0 until grid.size) for (x in 0 until grid.size) {
        if (isVine(grid, x, y) && Vec(x, y) !in seen) {
            val comp = vineComponent(grid, Vec(x, y)).sortedWith(compareBy({ it.y }, { it.x }))
            seen.addAll(comp)
            comps.add(comp)
        }
    }
    return comps
}

/**
 * Mọc lan 1 bước: mỗi dây (thành phần chứa ≥1 gốc) mọc thêm **1 đốt** từ tip sang ô trống kề đầu
 * tiên theo [growOrder]. Tip = ô VINE xa gốc nhất (BFS đa nguồn từ mọi gốc); hoà → (y,x) nhỏ nhất.
 * Áp ĐỒNG THỜI (thu thập rồi set) + không hai dây mọc trùng ô (deterministic theo thứ tự thành phần).
 * Trả các ô vừa mọc (sắp (y,x)). Đốt mới KHÔNG phải gốc.
 */
fun growVines(grid: Grid, gravity: Direction): List<Vec> {
    val order = growOrder(gravity)
    val taken = HashSet<Vec>()
    val added = ArrayList<Pair<Vec, JellyColor?>>()
    for (comp in vineComponents(grid)) {
        val roots = comp.filter { grid.get(it.x, it.y)?.vineRoot == true }
        if (roots.isEmpty()) continue                 // thành phần không gốc (sẽ bị héo) → không mọc
        val tip = farthestFromRoots(grid, comp, roots)
        val color = grid.get(tip.x, tip.y)?.color
        for (d in order) {
            val n = Vec(tip.x + d.dx, tip.y + d.dy)
            if (grid.inBounds(n.x, n.y) && grid.isEmpty(n.x, n.y) && n !in taken) {
                taken.add(n)
                added.add(n to color)
                break
            }
        }
    }
    for ((v, color) in added) grid.set(v.x, v.y, Grid.Cell(CellType.VINE, color, vineRoot = false))
    return added.map { it.first }.sortedWith(compareBy({ it.y }, { it.x }))
}

/** Ô VINE trong [comp] xa [roots] nhất (BFS đa nguồn qua ô VINE); hoà → (y,x) nhỏ nhất. */
private fun farthestFromRoots(grid: Grid, comp: List<Vec>, roots: List<Vec>): Vec {
    val dist = HashMap<Vec, Int>()
    val q = ArrayDeque<Vec>()
    for (r in roots) { dist[r] = 0; q.add(r) }
    while (q.isNotEmpty()) {
        val c = q.removeFirst()
        val dc = dist[c]!!
        for (d in Direction.entries) {
            val n = Vec(c.x + d.dx, c.y + d.dy)
            if (grid.inBounds(n.x, n.y) && isVine(grid, n.x, n.y) && n !in dist) {
                dist[n] = dc + 1; q.add(n)
            }
        }
    }
    // Xa nhất; hoà theo (y,x) nhỏ nhất cho deterministic (comp đã sắp (y,x)).
    return comp.maxWithOrNull(
        compareBy<Vec>({ dist[it] ?: 0 }).thenByDescending { it.y }.thenByDescending { it.x },
    )!!
}

/**
 * Xoá cả dây chứa [root] (gốc + mọi đốt cùng thành phần) → ô trống. Gọi khi một dòng xoá đi qua gốc.
 * Trả các ô đã xoá.
 */
fun destroyVineOfRoot(grid: Grid, root: Vec): List<Vec> {
    if (!isVine(grid, root.x, root.y)) return emptyList()
    val comp = vineComponent(grid, root)
    for (v in comp) grid.set(v.x, v.y, null)
    return comp
}

/**
 * Khô héo mọi đốt MẤT kết nối với gốc: flood đa nguồn từ tất cả ô gốc qua ô VINE; ô VINE không tới
 * được gốc nào → set null. Gọi ở CUỐI lượt xoá (sau khi cắt dòng). Trả các ô đã héo (sắp (y,x)).
 */
fun wiltDisconnectedVines(grid: Grid): List<Vec> {
    val connected = HashSet<Vec>()
    val q = ArrayDeque<Vec>()
    for (y in 0 until grid.size) for (x in 0 until grid.size) {
        if (grid.get(x, y)?.isVineRoot == true) { val v = Vec(x, y); if (connected.add(v)) q.add(v) }
    }
    while (q.isNotEmpty()) {
        val c = q.removeFirst()
        for (d in Direction.entries) {
            val n = Vec(c.x + d.dx, c.y + d.dy)
            if (grid.inBounds(n.x, n.y) && isVine(grid, n.x, n.y) && connected.add(n)) q.add(n)
        }
    }
    val wilted = ArrayList<Vec>()
    for (y in 0 until grid.size) for (x in 0 until grid.size) {
        val v = Vec(x, y)
        if (isVine(grid, x, y) && v !in connected) { grid.set(x, y, null); wilted.add(v) }
    }
    return wilted.sortedWith(compareBy({ it.y }, { it.x }))
}
