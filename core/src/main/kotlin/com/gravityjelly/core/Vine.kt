package com.gravityjelly.core

/**
 * Cơ chế chữ ký World 2 · Rừng rậm — **DÂY LEO mọc lan** (Creeping Vine). Thuần/headless,
 * deterministic (bắt buộc cho solver/Daily). Xem `docs/02-thiet-ke-man/02-he-muc-tieu.md §8`.
 *
 * Cấu trúc: mỗi dây = 1 thành phần liên thông 4-kề các ô [CellType.VINE], chứa 1 **gốc**
 * ([Grid.Cell.vineRoot]) + chuỗi **đốt**. Ô dây KHÔNG rơi theo trọng lực/xoay (xem `isJelly`
 * trong [ClusterPhysics]) — bám như rễ trong khi mọi thứ khác đổ.
 *
 * Ba luật (hàm thuần của state + hướng trọng lực → không phá deterministic):
 *  - [growVines]: cứ sau mỗi `growEveryN` lượt thả, mỗi gốc mọc thêm tối đa 1 đốt/lượt ở **đầu ngọn**
 *    (tip-only). Nhánh **độc lập** — không ghép, không vòng tròn. Thứ tự `[ngược-gravity → phải → gravity → trái]`.
 *  - [destroyVineOfRoot]: xoá dòng đi qua GỐC → cả dây tan (gốc + mọi đốt) — cách hoàn thành mục tiêu.
 *  - [wiltDisconnectedVines]: đốt mất kết nối với gốc → khô héo thành ô trống (thưởng cắt gần gốc).
 */

/** Số lượt đếm ngược trước khi đốt bị cắt thành rác chết hoàn toàn. */
const val WILT_COUNTDOWN = 10

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

/** Tối đa số nhánh gốc có thể phân ra (cấu trúc). */
private const val MAX_BRANCHES_FROM_ROOT = 3
/** Tối đa số đốt mọc thêm mỗi lượt cho 1 gốc (1 = mỗi rễ mỗi lượt chỉ đẻ 1 mầm). */
private const val MAX_GROW_PER_TURN = 1

/**
 * Mọc lan 1 bước theo mô hình 5 phần (rễ / trồi / cành / cành-countdown / rác):
 *  - **Rễ** phân tối đa [MAX_BRANCHES_FROM_ROOT] nhánh (dần dần, mỗi lượt ≤1 mầm cho cả dây).
 *  - **Trồi** (tip mỗi nhánh) tìm ô trống kề gần nhất theo [growOrder] để nối dài.
 *  - **Cành** (ô thân) có thể mọc mầm phụ sang ô trống kề.
 *  - Đốt mới KHÔNG được kề ô vine nhánh khác hoặc ô TRASH (chống loop/merge/revival).
 *  - Tối đa [MAX_GROW_PER_TURN] đốt mới mỗi lượt. Deterministic (tip→cành→gốc, sắp (y,x)).
 */
fun growVines(grid: Grid, gravity: Direction): List<Vec> {
    val order = growOrder(gravity)
    val taken = HashSet<Vec>()
    val added = ArrayList<Pair<Vec, JellyColor?>>()
    for (comp in vineComponents(grid)) {
        val roots = comp.filter { grid.get(it.x, it.y)?.vineRoot == true }
        if (roots.isEmpty()) continue
        for (root in roots) growFromRoot(grid, root, order, taken, added)
    }
    for ((v, color) in added) grid.set(v.x, v.y, Grid.Cell(CellType.VINE, color, vineRoot = false))
    return added.map { it.first }.sortedWith(compareBy({ it.y }, { it.x }))
}

/**
 * Gán mỗi ô vine một "nhánh" (branch ID) bằng BFS từ [root]. Gốc = -1. Mỗi ô liền kề gốc
 * khởi tạo nhánh riêng (ID ≥ 0); hậu duệ kế thừa ID. Deterministic (BFS duyệt
 * [Direction.entries] cố định: DOWN→UP→LEFT→RIGHT). Trả cả khoảng cách.
 */
private fun assignBranches(grid: Grid, root: Vec): Pair<Map<Vec, Int>, Map<Vec, Int>> {
    val branchOf = HashMap<Vec, Int>()
    val dist = HashMap<Vec, Int>()
    branchOf[root] = -1
    dist[root] = 0
    val q = ArrayDeque<Vec>()
    q.add(root)
    var nextBid = 0
    while (q.isNotEmpty()) {
        val c = q.removeFirst()
        for (d in Direction.entries) {
            val n = Vec(c.x + d.dx, c.y + d.dy)
            if (grid.inBounds(n.x, n.y) && isVine(grid, n.x, n.y) && n !in branchOf) {
                branchOf[n] = if (branchOf[c] == -1) nextBid++ else branchOf[c]!!
                dist[n] = dist[c]!! + 1
                q.add(n)
            }
        }
    }
    return branchOf to dist
}

private fun growFromRoot(
    grid: Grid, root: Vec, order: List<Direction>,
    taken: MutableSet<Vec>, added: MutableList<Pair<Vec, JellyColor?>>
) {
    val (branchOf, dist) = assignBranches(grid, root)

    // Tip (trồi) = ô xa nhất mỗi nhánh (tie-break (y,x) nhỏ hơn)
    val branchTip = HashMap<Int, Vec>()
    for ((cell, bid) in branchOf) {
        if (bid < 0) continue
        val cur = branchTip[bid]
        if (cur == null
            || dist[cell]!! > dist[cur]!!
            || (dist[cell] == dist[cur] && (cell.y < cur.y || (cell.y == cur.y && cell.x < cur.x)))
        ) branchTip[bid] = cell
    }
    val tipSet = branchTip.values.toHashSet()
    val branchCount = branchTip.size

    // Ưu tiên: trồi (tip) → cành (thân, side shoot) → rễ (nhánh mới nếu < 3).
    val candidates = ArrayList<Vec>()
    val nonTips = ArrayList<Vec>()
    for ((cell, bid) in branchOf) {
        if (bid < 0) continue
        if (cell in tipSet) candidates.add(cell) else nonTips.add(cell)
    }
    candidates.sortWith(compareBy({ it.y }, { it.x }))
    nonTips.sortWith(compareBy({ it.y }, { it.x }))
    candidates.addAll(nonTips)
    // Rễ phân nhánh mới nếu chưa đạt giới hạn
    if (branchCount < MAX_BRANCHES_FROM_ROOT) candidates.add(root)

    // MỌI lượt (kể cả gốc trần) chỉ sinh tối đa [MAX_GROW_PER_TURN] mầm mới cho TOÀN dây của gốc này
    // — tính chung cả trồi (nối tip), cành (side shoot) lẫn rễ (phân nhánh mới). Không còn burst lượt đầu.
    val maxGrow = MAX_GROW_PER_TURN

    var grown = 0
    for (cell in candidates) {
        if (grown >= maxGrow) break
        val color = grid.get(cell.x, cell.y)?.color
        for (d in order) {
            if (grown >= maxGrow) break
            val n = Vec(cell.x + d.dx, cell.y + d.dy)
            if (!grid.inBounds(n.x, n.y) || !grid.isEmpty(n.x, n.y) || n in taken) continue
            if (wouldLoopOrMerge(n, cell, branchOf, root, grid)) continue
            taken.add(n)
            added.add(n to color)
            grown++
            if (cell != root) break // cành/trồi: 1 mầm/ô; gốc: phân nhiều nhánh
        }
    }
}

/**
 * Ô mới tại [pos] (mọc từ [parent]) có tạo vòng tròn, ghép nhánh, hoặc "hồi sinh" rác không?
 * Chỉ cho kề [parent] (ô cha) và [root] (gốc chung). Cấm kề:
 *  - ô TRASH (chống "hồi sinh" nhánh chết)
 *  - ô vine GỐC KHÁC (không trong [branchOf] → chống merge giữa 2 dây độc lập)
 *  - ô vine cùng gốc nhưng không phải cha/gốc (chống loop trong nhánh)
 */
private fun wouldLoopOrMerge(
    pos: Vec, parent: Vec, branchOf: Map<Vec, Int>, root: Vec, grid: Grid
): Boolean {
    for (d in Direction.entries) {
        val adj = Vec(pos.x + d.dx, pos.y + d.dy)
        if (!grid.inBounds(adj.x, adj.y)) continue
        val adjCell = grid.get(adj.x, adj.y)
        if (adjCell?.type == CellType.TRASH) return true
        if (branchOf[adj] == null) {
            if (adjCell?.type == CellType.VINE) return true
            continue
        }
        if (adj == parent) continue
        if (adj == root) continue
        return true
    }
    return false
}

/**
 * Phá GỐC dây leo: chỉ xoá ô [root] → ô trống. Các đốt nhánh vẫn còn trên bàn; gọi
 * [wiltDisconnectedVines] ngay sau để chúng chuyển sang TRASH với đếm ngược (không biến mất đột ngột).
 * Trả danh sách ô đã xoá (chỉ gốc).
 */
fun destroyVineOfRoot(grid: Grid, root: Vec): List<Vec> {
    if (!isVine(grid, root.x, root.y)) return emptyList()
    grid.set(root.x, root.y, null)
    return listOf(root)
}

/**
 * Khô héo mọi đốt MẤT kết nối với gốc: flood đa nguồn từ tất cả ô gốc qua ô VINE; ô VINE không tới
 * được gốc nào → biến thành RÁC ([CellType.TRASH]) với [Grid.Cell.trashCountdown] = [WILT_COUNTDOWN]
 * (đếm ngược trước khi hoá rác chết). Gọi ở CUỐI lượt xoá (sau khi cắt dòng).
 * Trả các ô đã hoá rác (sắp (y,x)).
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
        if (isVine(grid, x, y) && v !in connected) {
            grid.set(x, y, Grid.Cell(CellType.TRASH, trashCountdown = WILT_COUNTDOWN))
            wilted.add(v)
        }
    }
    return wilted.sortedWith(compareBy({ it.y }, { it.x }))
}

/**
 * Đếm ngược rác: mọi ô TRASH có [Grid.Cell.trashCountdown] > 0 giảm 1. Gọi mỗi lượt thả.
 * Trả các ô vừa hết đếm ngược (countdown 1→0, thành rác chết), sắp (y,x).
 */
fun tickTrashCountdown(grid: Grid): List<Vec> {
    val justDied = ArrayList<Vec>()
    for (y in 0 until grid.size) for (x in 0 until grid.size) {
        val c = grid.get(x, y) ?: continue
        if (c.type == CellType.TRASH && c.trashCountdown > 0) {
            val newCd = c.trashCountdown - 1
            grid.set(x, y, c.copy(trashCountdown = newCd))
            if (newCd == 0) justDied.add(Vec(x, y))
        }
    }
    return justDied.sortedWith(compareBy({ it.y }, { it.x }))
}
