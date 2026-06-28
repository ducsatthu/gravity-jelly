package com.gravityjelly.core

/**
 * Luật MERGE (sau khi xóa hàng/cột đầy = cơ chế tính điểm nền):
 *  - **3×3 cùng màu** → SIÊU KHỐI CẤP 1 ([MergeMove.Super] level 1) → khi bị cuốn vào xóa sẽ
 *    **quét sạch MỌI ô CÙNG MÀU trên toàn bàn**.
 *  - **3×3 ba màu, mỗi màu 1 cột HOẶC 1 hàng** → KHỐI CẦU VỒNG ([MergeMove.Rainbow]).
 *  - SIÊU KHỐI CẤP 2 (level 2) — hình thành theo MỘT trong hai cách: **(a)** ≥2 siêu-khối-1 CÙNG
 *    màu dính liền (hàng/cột/3×3); **(b)** một ô vuông **3×3 đồng MÀU có chứa ≥1 siêu-khối-1**
 *    (8 ô còn lại là khối thường cùng màu). Khi nổ: quét sạch MỌI ô cùng màu trên bàn **+ 5×5 quanh tâm**.
 * Box 3×3 dùng để merge: 9 ô đều BLOCK cùng màu, superLevel 0/1, không STONE/rainbow (cầu vồng vẫn
 * cần 9 ô THƯỜNG). Hàm thuần, duyệt cố định (y, x) → deterministic.
 */

/** Nguồn hình thành (giữ để tương thích event). */
enum class SuperSource { ROW, COLUMN, BOX, CLUSTER }

/** Một lần nổ siêu khối: [cells] = footprint bị quét (toàn ô cùng màu cho cấp 1; + 5×5 cho cấp 2). */
data class SuperDetonation(
    val center: Vec,
    val color: JellyColor,
    val level: Int,
    val cells: List<Vec>,
)

/** Kết quả xét merge: gom siêu khối (cấp 1/2) hoặc tạo khối cầu vồng. */
sealed interface MergeMove {
    data class Super(val center: Vec, val color: JellyColor, val cells: List<Vec>, val level: Int) : MergeMove
    data class Rainbow(val center: Vec, val cells: List<Vec>) : MergeMove
}

/** Bán kính vùng nổ phụ của siêu khối CẤP 2: 2 ⇒ vùng 5×5 quanh tâm (thêm sau khi quét cùng màu). */
const val SUPER_BLAST_RADIUS = 2

/**
 * Tìm nước merge đầu tiên (theo y,x): ưu tiên SIÊU KHỐI CẤP 2 (gộp super-1 dính liền), rồi xét từng
 * ô vuông 3×3: đồng màu THƯỜNG → super-1, đồng màu CÓ super-1 → super-2, ba-màu-sọc → cầu vồng.
 * null nếu không có.
 */
fun findMergeMove(grid: Grid): MergeMove? {
    findSuper2(grid)?.let { return it }

    val n = grid.size
    for (ty in 0..(n - 3)) {
        for (tx in 0..(n - 3)) {
            val center = Vec(tx + 1, ty + 1)
            // Box 3×3 đồng MÀU (cho phép có super-1): toàn khối thường → cấp 1; chứa ≥1 super-1 → cấp 2.
            val mono = box3x3MonoMergeable(grid, tx, ty)
            if (mono != null) {
                val level = if (box3x3HasSuper1(grid, tx, ty)) 2 else 1
                return MergeMove.Super(center, mono, box3x3Cells(tx, ty), level)
            }
            // Cầu vồng: cần 9 ô THƯỜNG ba màu sọc (dọc/ngang).
            if (box3x3AllNormal(grid, tx, ty) && box3x3RainbowStripes(grid, tx, ty)) {
                return MergeMove.Rainbow(center, box3x3Cells(tx, ty))
            }
        }
    }
    return null
}

/** ≥2 ô SIÊU KHỐI CẤP 1 cùng màu dính liền (4-kề) → gộp thành cấp 2 tại tâm. */
private fun findSuper2(grid: Grid): MergeMove.Super? {
    val n = grid.size
    val visited = Array(n) { BooleanArray(n) }
    for (y in 0 until n) {
        for (x in 0 until n) {
            if (visited[y][x]) continue
            val c = grid.get(x, y)
            if (c == null || c.superLevel != 1) { visited[y][x] = true; continue }
            val color = c.color
            val comp = ArrayList<Vec>()
            val queue = ArrayDeque<Vec>()
            queue.add(Vec(x, y)); visited[y][x] = true
            while (queue.isNotEmpty()) {
                val v = queue.removeFirst()
                comp.add(v)
                for (dir in Direction.entries) {
                    val nx = v.x + dir.dx
                    val ny = v.y + dir.dy
                    if (grid.inBounds(nx, ny) && !visited[ny][nx]) {
                        val nc = grid.get(nx, ny)
                        if (nc != null && nc.superLevel == 1 && nc.color == color) {
                            visited[ny][nx] = true; queue.add(Vec(nx, ny))
                        }
                    }
                }
            }
            if (comp.size >= 2 && color != null) {
                comp.sortWith(compareBy({ it.y }, { it.x }))
                return MergeMove.Super(clusterCenter(comp), color, comp, level = 2)
            }
        }
    }
    return null
}

private fun box3x3Cells(tx: Int, ty: Int): List<Vec> {
    val out = ArrayList<Vec>(9)
    for (dy in 0..2) for (dx in 0..2) out.add(Vec(tx + dx, ty + dy))
    return out
}

/** Mọi ô của box là BLOCK thường (superLevel 0, không STONE, không rainbow, có màu). */
private fun box3x3AllNormal(grid: Grid, tx: Int, ty: Int): Boolean {
    for (dy in 0..2) for (dx in 0..2) {
        val c = grid.get(tx + dx, ty + dy) ?: return false
        if (c.type != CellType.BLOCK || c.superLevel != 0 || c.rainbow || c.color == null) return false
    }
    return true
}

/**
 * Màu chung nếu cả 9 ô của box đều BLOCK CÙNG màu, superLevel 0/1 (cho phép có super-1), không
 * STONE/rainbow/super-2; null nếu không thoả. Dùng cho cả super-1 (toàn thường) lẫn super-2 (có super-1).
 */
private fun box3x3MonoMergeable(grid: Grid, tx: Int, ty: Int): JellyColor? {
    val color = grid.get(tx, ty)?.color ?: return null
    for (dy in 0..2) for (dx in 0..2) {
        val c = grid.get(tx + dx, ty + dy) ?: return null
        if (c.type != CellType.BLOCK || c.rainbow || c.color != color || c.superLevel > 1) return null
    }
    return color
}

/** Box (đã qua [box3x3MonoMergeable]) có chứa ít nhất 1 SIÊU KHỐI CẤP 1? */
private fun box3x3HasSuper1(grid: Grid, tx: Int, ty: Int): Boolean {
    for (dy in 0..2) for (dx in 0..2) if (grid.get(tx + dx, ty + dy)?.superLevel == 1) return true
    return false
}

/** Box là "ba màu mỗi màu 1 cột" HOẶC "ba màu mỗi màu 1 hàng" (3 màu phân biệt). */
private fun box3x3RainbowStripes(grid: Grid, tx: Int, ty: Int): Boolean {
    // sọc dọc: mỗi cột đồng màu, 3 cột khác nhau
    val c0 = lineColor(grid, tx, ty, vertical = true)
    val c1 = lineColor(grid, tx + 1, ty, vertical = true)
    val c2 = lineColor(grid, tx + 2, ty, vertical = true)
    if (c0 != null && c1 != null && c2 != null && c0 != c1 && c1 != c2 && c0 != c2) return true
    // sọc ngang: mỗi hàng đồng màu, 3 hàng khác nhau
    val r0 = lineColor(grid, tx, ty, vertical = false)
    val r1 = lineColor(grid, tx, ty + 1, vertical = false)
    val r2 = lineColor(grid, tx, ty + 2, vertical = false)
    if (r0 != null && r1 != null && r2 != null && r0 != r1 && r1 != r2 && r0 != r2) return true
    return false
}

/** Màu chung của 3 ô trên một cột ([vertical]=true, từ (x,ty)) hoặc một hàng (từ (tx,y)); null nếu khác. */
private fun lineColor(grid: Grid, x: Int, y: Int, vertical: Boolean): JellyColor? {
    val first = grid.get(x, y)?.color ?: return null
    for (k in 1..2) {
        val cc = if (vertical) grid.get(x, y + k) else grid.get(x + k, y)
        if (cc?.color != first) return null
    }
    return first
}

/** Ô gần TÂM HÌNH HỌC nhất của cụm (tie-break (y,x) nhờ [comp] đã sắp) — deterministic. */
private fun clusterCenter(comp: List<Vec>): Vec {
    var sx = 0
    var sy = 0
    for (v in comp) { sx += v.x; sy += v.y }
    val cxf = sx.toFloat() / comp.size
    val cyf = sy.toFloat() / comp.size
    var best = comp[0]
    var bestD = Float.MAX_VALUE
    for (v in comp) {
        val dx = v.x - cxf
        val dy = v.y - cyf
        val d = dx * dx + dy * dy
        if (d < bestD) { bestD = d; best = v }
    }
    return best
}

/** Thu [cells] về 1 siêu khối [level] màu [color] tại [center]; trả các ô bị làm trống (seed trọng lực). */
fun collapseToSuper(grid: Grid, center: Vec, color: JellyColor, cells: List<Vec>, level: Int): List<Vec> {
    val emptied = ArrayList<Vec>(cells.size - 1)
    for (v in cells) {
        grid.set(v.x, v.y, null)
        if (v != center) emptied.add(v)
    }
    grid.set(center.x, center.y, Grid.Cell(CellType.BLOCK, color, superLevel = level))
    return emptied
}

/** Thu [cells] về 1 KHỐI CẦU VỒNG tại [center]; trả các ô bị làm trống. */
fun collapseToRainbow(grid: Grid, center: Vec, cells: List<Vec>): List<Vec> {
    val emptied = ArrayList<Vec>(cells.size - 1)
    for (v in cells) {
        grid.set(v.x, v.y, null)
        if (v != center) emptied.add(v)
    }
    grid.set(center.x, center.y, Grid.Cell(CellType.BLOCK, color = null, rainbow = true))
    return emptied
}

/**
 * Từ tập ô sắp xóa [initial] (hàng/cột đầy), mở rộng dây chuyền nổ siêu khối:
 * **cấp 1 quét sạch MỌI ô cùng màu trên bàn**; **cấp 2 quét cùng màu + thêm vùng 5×5 quanh tâm**.
 * Nổ trúng siêu khối khác (kể cả khác màu, do dính vùng 5×5) → nổ tiếp. KHÔNG sửa [grid].
 * Trả (tập ô có-nội-dung sẽ bị xóa, danh sách lần nổ theo (y,x)).
 */
fun expandDetonations(grid: Grid, initial: Set<Vec>): Pair<Set<Vec>, List<SuperDetonation>> {
    val n = grid.size
    val toClear = HashSet(initial)
    val detonations = ArrayList<SuperDetonation>()
    val queued = HashSet<Vec>()
    val queue = ArrayDeque<Vec>()

    fun enqueueIfSuper(v: Vec) {
        val c = grid.get(v.x, v.y)
        if (c != null && c.isSuper && queued.add(v)) queue.add(v)
    }

    for (v in initial.sortedWith(compareBy({ it.y }, { it.x }))) enqueueIfSuper(v)

    while (queue.isNotEmpty()) {
        val s = queue.removeFirst()
        val cell = grid.get(s.x, s.y)!!
        val color = cell.color!!
        val footprint = ArrayList<Vec>()
        // MỌI cấp: quét sạch ô CÙNG MÀU trên toàn bàn (duyệt y,x → deterministic).
        for (y in 0 until n) for (x in 0 until n) if (grid.get(x, y)?.color == color) footprint.add(Vec(x, y))
        // CẤP ≥2: thêm vùng 5×5 quanh tâm (ô khác màu/ trống chưa có trong footprint).
        if (cell.superLevel >= 2) {
            for (dy in -SUPER_BLAST_RADIUS..SUPER_BLAST_RADIUS) {
                for (dx in -SUPER_BLAST_RADIUS..SUPER_BLAST_RADIUS) {
                    val nx = s.x + dx
                    val ny = s.y + dy
                    if (grid.inBounds(nx, ny) && grid.get(nx, ny)?.color != color) footprint.add(Vec(nx, ny))
                }
            }
        }
        detonations.add(SuperDetonation(s, color, cell.superLevel, footprint))
        for (v in footprint) {
            if (grid.get(v.x, v.y) != null) toClear.add(v)
            enqueueIfSuper(v)
        }
    }

    return toClear to detonations
}
