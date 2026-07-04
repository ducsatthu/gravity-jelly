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
 *  - [growVines]: cứ sau mỗi `growEveryN` lượt thả, mỗi gốc mọc thêm tối đa 1 đốt/lượt. Ưu tiên nối
 *    **tip** (mỗi lá của cây là một ngọn độc lập); tip bí thì **cành** đâm nhánh phụ, cuối cùng **rễ**
 *    phân nhánh mới. Rễ chỉ mọc **3 hướng** (tránh chiều trọng lực); thân/cành mọc **đủ 4 hướng**.
 *    Mỗi rễ nuôi tối đa `maxSprouts` mầm (mặc định [DEFAULT_VINE_MAX_SPROUTS]). Nhánh **độc lập** — 2 cành cùng rễ hay 2 rễ khác
 *    nhau không bao giờ ghép/tạo vòng.
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
 * Thứ tự mọc cho **RỄ**: 3 hướng, KHÔNG theo trọng lực — `[ngược-gravity, phải, trái]`.
 * Với gravity=DOWN → `[UP, RIGHT, LEFT]`. Rễ không bao giờ đâm mầm xuôi chiều rơi.
 */
private fun rootGrowOrder(gravity: Direction): List<Direction> =
    listOf(gravity.opposite(), gravity.rotateCCW(), gravity.rotateCW())

/**
 * Thứ tự mọc cho **THÂN/CÀNH**: đủ 4 hướng — `[ngược-gravity, phải, theo-gravity, trái]`.
 * Với gravity=DOWN → `[UP, RIGHT, DOWN, LEFT]`.
 */
private fun branchGrowOrder(gravity: Direction): List<Direction> =
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

/** Mặc định số MẦM (ngọn phát triển) tối đa mỗi rễ — cap độ rậm. Cấu hình/màn qua [EndlessTuning.vineMaxSprouts]. */
const val DEFAULT_VINE_MAX_SPROUTS = 4
/** Tối đa số đốt mọc thêm mỗi lượt cho 1 gốc (1 = mỗi rễ mỗi lượt chỉ đẻ 1 mầm). */
private const val MAX_GROW_PER_TURN = 1

/**
 * Mọc lan 1 bước cho mọi cây dây leo trên bàn. Mỗi cây (thành phần chứa 1 gốc) mọc tối đa
 * [MAX_GROW_PER_TURN] đốt/lượt. Xem [growFromRoot] cho luật ưu tiên tip→cành→rễ + cap mầm.
 * Deterministic (duyệt thành phần & candidate theo (y,x), BFS hướng cố định).
 */
fun growVines(grid: Grid, gravity: Direction, maxSprouts: Int = DEFAULT_VINE_MAX_SPROUTS): List<Vec> {
    val rootOrder = rootGrowOrder(gravity)
    val branchOrder = branchGrowOrder(gravity)
    val taken = HashSet<Vec>()
    val added = ArrayList<Pair<Vec, JellyColor?>>()
    for (comp in vineComponents(grid)) {
        val roots = comp.filter { grid.get(it.x, it.y)?.vineRoot == true }
        if (roots.isEmpty()) continue
        for (root in roots) growFromRoot(grid, root, rootOrder, branchOrder, maxSprouts, taken, added)
    }
    for ((v, color) in added) grid.set(v.x, v.y, Grid.Cell(CellType.VINE, color, vineRoot = false))
    return added.map { it.first }.sortedWith(compareBy({ it.y }, { it.x }))
}

/**
 * BFS cây dây leo từ [root]: trả (tập MỌI ô thuộc cây này, map cha→các con). Duyệt
 * [Direction.entries] cố định → deterministic. **Lá** (không con) = TIP độc lập; ô có con = CÀNH.
 * Mỗi lần một ô rẽ ≥2 con là một điểm tách nhánh — mỗi con là một luồng độc lập.
 */
private fun buildTree(grid: Grid, root: Vec): Pair<Set<Vec>, Map<Vec, List<Vec>>> {
    val member = LinkedHashSet<Vec>()
    val children = HashMap<Vec, MutableList<Vec>>()
    val q = ArrayDeque<Vec>()
    q.add(root); member.add(root)
    while (q.isNotEmpty()) {
        val c = q.removeFirst()
        for (d in Direction.entries) {
            val n = Vec(c.x + d.dx, c.y + d.dy)
            if (grid.inBounds(n.x, n.y) && isVine(grid, n.x, n.y) && member.add(n)) {
                children.getOrPut(c) { ArrayList() }.add(n)
                q.add(n)
            }
        }
    }
    return member to children
}

/**
 * Mọc lan 1 bước cho cây của [root]:
 *  - **Tip** (mọi lá — ô không có con) nối dài. Không tạo mầm mới → KHÔNG tính cap.
 *  - **Cành** (ô có con) đâm nhánh phụ **chỉ khi mọi tip bị chặn** → tạo mầm mới → tính cap.
 *  - **Rễ** phân nhánh mới (cuối cùng, khi tip+cành đều bí) → tạo mầm mới → tính cap.
 *  - Chỉ được tạo mầm mới khi số mầm hiện có < [maxSprouts].
 *  - Rễ dùng [rootOrder] (3 hướng, tránh trọng lực); tip/cành dùng [branchOrder] (đủ 4 hướng).
 *  - Đốt mới KHÔNG được kề ô vine ngoài cha/gốc, hay ô TRASH (chống loop/merge/revival).
 *  - Tối đa [MAX_GROW_PER_TURN] đốt/lượt. Deterministic (tip→cành→rễ, sắp (y,x)).
 */
private fun growFromRoot(
    grid: Grid, root: Vec, rootOrder: List<Direction>, branchOrder: List<Direction>,
    maxSprouts: Int, taken: MutableSet<Vec>, added: MutableList<Pair<Vec, JellyColor?>>
) {
    val (member, children) = buildTree(grid, root)

    // Lá = tip (ngọn phát triển độc lập); ô có con = cành. Rễ tách riêng.
    val tips = ArrayList<Vec>()
    val branches = ArrayList<Vec>()
    for (n in member) {
        if (n == root) continue
        if (children[n].isNullOrEmpty()) tips.add(n) else branches.add(n)
    }
    tips.sortWith(compareBy({ it.y }, { it.x }))
    branches.sortWith(compareBy({ it.y }, { it.x }))
    val sproutCount = tips.size

    // Ưu tiên tip (nối dài, không cap) → cành (fork, cap) → rễ (nhánh mới, cap).
    // Cờ thứ hai = có sinh MẦM MỚI không → phải kiểm cap.
    val candidates = ArrayList<Pair<Vec, Boolean>>()
    for (t in tips) candidates.add(t to false)
    for (b in branches) candidates.add(b to true)
    candidates.add(root to true)

    var grown = 0
    for ((cell, createsSprout) in candidates) {
        if (grown >= MAX_GROW_PER_TURN) break
        if (createsSprout && sproutCount >= maxSprouts) continue
        val color = grid.get(cell.x, cell.y)?.color
        val order = if (cell == root) rootOrder else branchOrder
        for (d in order) {
            if (grown >= MAX_GROW_PER_TURN) break
            val n = Vec(cell.x + d.dx, cell.y + d.dy)
            if (!grid.inBounds(n.x, n.y) || !grid.isEmpty(n.x, n.y) || n in taken) continue
            if (wouldLoopOrMerge(n, cell, member, grid)) continue
            taken.add(n)
            added.add(n to color)
            grown++
            if (cell != root) break // cành/tip: 1 mầm/ô; rễ: có thể thử nhiều hướng
        }
    }
}

/**
 * Ô mới tại [pos] (mọc từ [parent]) có tạo vòng tròn, ghép nhánh, hoặc "hồi sinh" rác không?
 * Ô mới **CHỈ được kề đúng ô cha [parent]**. Cấm kề:
 *  - ô TRASH (chống "hồi sinh" nhánh chết)
 *  - ô vine CÂY KHÁC (không trong [member] → chống merge giữa 2 rễ độc lập)
 *  - ô vine cùng cây nhưng KHÔNG phải cha — **kể cả GỐC** (chống loop / ghép cành / ô vuông 2×2
 *    quanh gốc). Ngọn thà đứng im giữ nguyên mầm còn hơn cuộn lại chạm gốc.
 * (Rễ mọc nhánh mới thì cha CHÍNH LÀ gốc, nên [pos] kề gốc vẫn hợp lệ qua nhánh `adj == parent`.)
 */
private fun wouldLoopOrMerge(
    pos: Vec, parent: Vec, member: Set<Vec>, grid: Grid
): Boolean {
    for (d in Direction.entries) {
        val adj = Vec(pos.x + d.dx, pos.y + d.dy)
        if (!grid.inBounds(adj.x, adj.y)) continue
        val adjCell = grid.get(adj.x, adj.y)
        if (adjCell?.type == CellType.TRASH) return true
        if (adj !in member) {
            if (adjCell?.type == CellType.VINE) return true
            continue
        }
        if (adj == parent) continue
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
