package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class PlacementPreviewTest {

    private fun block(c: JellyColor) = Grid.Cell(CellType.BLOCK, c)
    private val dot = Piece(PieceLibrary.DOT, JellyColor.YELLOW)

    // ── xóa hàng/cột (PHA 2) ──

    @Test
    fun placingIntoMixedFullRow_previewsWholeRowClear() {
        val grid = Grid()
        // Hàng 0 MIXED (không đơn sắc → không thành siêu khối), chừa 1 ô ở (8,0).
        for (x in 0 until 8) grid.set(x, 0, block(if (x % 2 == 0) JellyColor.YELLOW else JellyColor.MINT))

        val o = previewPlacement(grid, dot, 8, 0)

        assertTrue(o.valid)
        assertTrue(o.willScore)
        assertEquals("cả hàng 0 sẽ xóa", 9, o.clearCells.size)
        assertTrue((0 until 9).all { Vec(it, 0) in o.clearCells })
        assertTrue("xóa thường không phải merge", o.mergeCells.isEmpty())
        assertNull(o.mergeCenter)
    }

    // ── merge 3×3 đơn sắc → siêu khối (PHA 1) ──

    @Test
    fun completingMonoSquare_previewsMergeCluster() {
        val grid = Grid()
        // 3×3 vàng thiếu đúng ô (2,2).
        for (y in 0..2) for (x in 0..2) if (!(x == 2 && y == 2)) grid.set(x, y, block(JellyColor.YELLOW))

        val o = previewPlacement(grid, dot, 2, 2)

        assertTrue(o.valid)
        assertTrue(o.willScore)
        assertEquals("9 ô gom vào siêu khối", 9, o.mergeCells.size)
        assertEquals(Vec(1, 1), o.mergeCenter)
        assertFalse(o.formsRainbow)
        assertTrue("merge chưa xóa hàng nào", o.clearCells.isEmpty())
    }

    // ── không ăn điểm ──

    @Test
    fun placingWithNoLineOrMerge_previewsNothing() {
        val grid = Grid()
        grid.set(0, 0, block(JellyColor.YELLOW))

        val o = previewPlacement(grid, dot, 5, 5)

        assertTrue(o.valid)
        assertFalse(o.willScore)
        assertTrue(o.clearCells.isEmpty())
        assertTrue(o.mergeCells.isEmpty())
    }

    // ── chỗ không hợp lệ ──

    @Test
    fun placingOntoOccupiedCell_returnsNone() {
        val grid = Grid()
        grid.set(3, 3, block(JellyColor.MINT))

        val o = previewPlacement(grid, dot, 3, 3)

        assertFalse(o.valid)
        assertEquals(PlacementOutcome.NONE, o)
    }

    // ── thuần: KHÔNG mutate grid thật ──

    @Test
    fun preview_doesNotMutateGrid() {
        val grid = Grid()
        for (x in 0 until 8) grid.set(x, 0, block(if (x % 2 == 0) JellyColor.YELLOW else JellyColor.MINT))

        previewPlacement(grid, dot, 8, 0)

        assertTrue("ô đích vẫn trống", grid.isEmpty(8, 0))
        assertFalse("các ô cũ còn nguyên", grid.isEmpty(0, 0))
        assertTrue(findFullLines(grid).isEmpty)
    }
}
