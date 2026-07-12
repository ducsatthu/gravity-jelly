package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Bảo đảm [PieceLibrary] phủ ĐỦ 24 kiểu khối theo thiết kế
 * (design/Gravity Jelly Design System/03-components/03-tray/tray.card.html — hằng `GROUPS`),
 * và xác nhận hành vi "khối chéo tự tách" dưới trọng lực cụm là CỐ Ý (không phải bug).
 */
class PieceCatalogTest {

    /** Khoá bất biến theo quay: chuỗi cell của hướng "nhỏ nhất" trong 4 hướng CW. */
    private fun canonKey(shape: Shape): String {
        var cur = shape
        var best = key(cur.cells)
        repeat(3) {
            cur = cur.rotateCW()
            val k = key(cur.cells)
            if (k < best) best = k
        }
        return best
    }

    private fun key(cells: List<Vec>): String = cells.joinToString(";") { "${it.x},${it.y}" }

    private fun shape(vararg cells: Pair<Int, Int>) = Shape.of(*cells)

    /** 24 tile thiết kế, quy đổi cell [row,col] của design → (x=col, y=row). */
    private val designCatalog: List<Pair<String, Shape>> = listOf(
        // Nhóm 1 — thanh (9)
        "1×1" to shape(0 to 0),
        "1×2" to shape(0 to 0, 0 to 1),
        "2×1" to shape(0 to 0, 1 to 0),
        "1×3" to shape(0 to 0, 0 to 1, 0 to 2),
        "3×1" to shape(0 to 0, 1 to 0, 2 to 0),
        "1×4" to shape(0 to 0, 0 to 1, 0 to 2, 0 to 3),
        "4×1" to shape(0 to 0, 1 to 0, 2 to 0, 3 to 0),
        "1×5" to shape(0 to 0, 0 to 1, 0 to 2, 0 to 3, 0 to 4),
        "5×1" to shape(0 to 0, 1 to 0, 2 to 0, 3 to 0, 4 to 0),
        // Nhóm 2 — vuông (2)
        "Vuông 2×2" to shape(0 to 0, 1 to 0, 0 to 1, 1 to 1),
        "Vuông 3×3" to shape(0 to 0, 1 to 0, 2 to 0, 0 to 1, 1 to 1, 2 to 1, 0 to 2, 1 to 2, 2 to 2),
        // Nhóm 3 — L & J (4)
        "L nhỏ 3" to shape(0 to 0, 0 to 1, 1 to 1),
        "L 4" to shape(0 to 0, 0 to 1, 0 to 2, 1 to 2),
        "J 4" to shape(1 to 0, 1 to 1, 1 to 2, 0 to 2),
        "L lớn 5" to shape(0 to 0, 0 to 1, 0 to 2, 1 to 2, 2 to 2),
        // Nhóm 4 — T (2)
        "T nhỏ 4" to shape(0 to 0, 1 to 0, 2 to 0, 1 to 1),
        "T lớn 5" to shape(0 to 0, 1 to 0, 2 to 0, 1 to 1, 1 to 2),
        // Nhóm 5 — S & Z (2)
        "Z 4" to shape(0 to 0, 1 to 0, 1 to 1, 2 to 1),
        "S 4" to shape(1 to 0, 2 to 0, 0 to 1, 1 to 1),
        // Nhóm 6 — gập khúc đặc biệt (5)
        "Bậc thang 3" to shape(0 to 0, 0 to 1, 1 to 1),
        "Chữ U 5" to shape(0 to 0, 2 to 0, 0 to 1, 1 to 1, 2 to 1),
        "Chữ thập 5" to shape(1 to 0, 0 to 1, 1 to 1, 2 to 1, 1 to 2),
        "Chéo 2" to shape(0 to 0, 1 to 1),
        "Chéo 3" to shape(0 to 0, 1 to 1, 2 to 2),
    )

    @Test
    fun designCatalogHas24Tiles() {
        assertEquals(24, designCatalog.size)
    }

    @Test
    fun libraryCoversEveryDesignTile() {
        val pool = PieceLibrary.ALL.mapTo(HashSet()) { canonKey(it) }
        val missing = designCatalog.filter { canonKey(it.second) !in pool }.map { it.first }
        assertTrue("Kiểu khối thiết kế còn THIẾU trong PieceLibrary: $missing", missing.isEmpty())
    }

    @Test
    fun diagonalPieceSelfSeparatesUnderClusterGravity() {
        // Đặt khối chéo 3 ô ở góc trên; dưới trọng lực cụm mỗi ô là một cụm → rơi rời về đáy cột.
        val g = Grid()
        for (v in PieceLibrary.D3.at(0, 0)) g.set(v.x, v.y, Grid.Cell(CellType.BLOCK, JellyColor.PINK))
        assertEquals("Khối chéo 3 ô = 3 cụm rời", 3, findClusters(g).size)

        val moved = applyClusterGravity(g, Direction.DOWN)
        assertTrue("Khối chéo phải sụp (tự tách) khi có trọng lực", moved)

        val bottom = Grid.SIZE - 1
        for (x in 0..2) {
            assertEquals("Ô cột $x phải rơi xuống đáy", CellType.BLOCK, g.get(x, bottom)?.type)
        }
        // Đỉnh chéo cũ (1,1) và (2,2) không còn treo lửng.
        assertNull(g.get(1, 1))
        assertNull(g.get(2, 2))
    }

    // ── Vuông 3×3 hai màu (tránh nhầm cụm 9 ô cùng màu → Thạch Hoàng Gia) ──

    @Test
    fun square3x3IsDealtTwoTone() {
        val p = PieceLibrary.dealt(PieceLibrary.SQ9, JellyColor.YELLOW)
        assertNotNull("SQ9 phải có màu-theo-ô", p.cellColors)
        val cells = PieceLibrary.SQ9.cells
        val centerIdx = cells.indexOfFirst { it.x == 1 && it.y == 1 }
        for (i in cells.indices) {
            if (i == centerIdx) assertNotEquals("Tâm phải KHÁC màu vành", JellyColor.YELLOW, p.colorAt(i))
            else assertEquals("Vành ngoài = màu chủ đạo", JellyColor.YELLOW, p.colorAt(i))
        }
        // Hình khác vẫn đơn sắc.
        assertNull(PieceLibrary.dealt(PieceLibrary.O4, JellyColor.YELLOW).cellColors)
    }

    @Test
    fun twoTone3x3DoesNotAutoMergeButMonochromeDoes() {
        val cells = PieceLibrary.SQ9.at(0, 0)

        val g = Grid()
        place(g, PieceLibrary.dealt(PieceLibrary.SQ9, JellyColor.MINT), cells)
        assertNull("3×3 hai màu KHÔNG được tự merge thành siêu khối", findMergeMove(g))

        val g2 = Grid()
        place(g2, Piece(PieceLibrary.SQ9, JellyColor.MINT), cells)   // ép đơn sắc (bỏ qua factory)
        assertNotNull("3×3 đơn sắc PHẢI merge thành Thạch Hoàng Gia", findMergeMove(g2))
    }
}
