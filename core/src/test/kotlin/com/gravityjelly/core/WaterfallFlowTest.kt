package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class WaterfallFlowTest {

    private fun block(color: JellyColor = JellyColor.YELLOW) = Grid.Cell(CellType.BLOCK, color)
    private fun drop() = Grid.Cell(CellType.TARGET, JellyColor.BLUE)

    @Test
    fun `nuoc chay thang xuong qua o trong`() {
        val g = Grid()
        val r = calculateWaterfallFlow(g, listOf(4), Direction.DOWN)
        assertTrue("cột 4 phải ngập", r.floodedCells.containsAll(
            (0..8).map { Vec(4, it) }
        ))
        assertEquals("không có giọt", emptyList<Vec>(), r.dropsHit)
    }

    @Test
    fun `khong nguon - khong ngap`() {
        val g = Grid()
        val r = calculateWaterfallFlow(g, emptyList(), Direction.DOWN)
        assertTrue(r.floodedCells.isEmpty())
    }

    @Test
    fun `nuoc tach khi gap vat can`() {
        val g = Grid()
        g.set(4, 5, block())
        val r = calculateWaterfallFlow(g, listOf(4), Direction.DOWN)
        assertTrue("(3,5) phải ngập sau tách", Vec(3, 5) in r.floodedCells)
        assertTrue("(5,5) phải ngập sau tách", Vec(5, 5) in r.floodedCells)
        assertTrue("(4,5) KHÔNG ngập (block)", Vec(4, 5) !in r.floodedCells)
    }

    @Test
    fun `nuoc pha giot (TARGET)`() {
        val g = Grid()
        g.set(4, 5, drop())
        val r = calculateWaterfallFlow(g, listOf(4), Direction.DOWN)
        assertEquals("1 giọt bị nước chạm", listOf(Vec(4, 5)), r.dropsHit)
        assertTrue("ô giọt cũng ngập", Vec(4, 5) in r.floodedCells)
    }

    @Test
    fun `gravity UP - nuoc chay nguoc`() {
        val g = Grid()
        val r = calculateWaterfallFlow(g, listOf(4), Direction.UP)
        assertTrue("(4,0) phải ngập", Vec(4, 0) in r.floodedCells)
        assertTrue("(4,8) phải ngập (nguồn)", Vec(4, 8) in r.floodedCells)
    }

    @Test
    fun `gravity LEFT - nuoc chay trai`() {
        val g = Grid()
        val r = calculateWaterfallFlow(g, listOf(4), Direction.LEFT)
        assertTrue("(0,4) phải ngập", Vec(0, 4) in r.floodedCells)
        assertTrue("nguồn ở cạnh phải (8,4)", Vec(8, 4) in r.floodedCells)
    }

    @Test
    fun `2 nguon - ngap rong`() {
        val g = Grid()
        val r = calculateWaterfallFlow(g, listOf(2, 6), Direction.DOWN)
        assertTrue("cột 2 ngập", Vec(2, 4) in r.floodedCells)
        assertTrue("cột 6 ngập", Vec(6, 4) in r.floodedCells)
        assertTrue("cột 3 KHÔNG ngập (ko có gì chặn)", Vec(3, 4) !in r.floodedCells)
    }

    @Test
    fun `da chan nuoc`() {
        val g = Grid()
        g.set(4, 3, Grid.Cell(CellType.STONE))
        val r = calculateWaterfallFlow(g, listOf(4), Direction.DOWN)
        assertTrue("(4,3) KHÔNG ngập (đá)", Vec(4, 3) !in r.floodedCells)
        assertTrue("nước tách sang (3,2)", Vec(3, 2) in r.floodedCells)
    }

    @Test
    fun `vine chan nuoc`() {
        val g = Grid()
        g.set(4, 5, Grid.Cell(CellType.VINE, JellyColor.MINT, vineRoot = true))
        val r = calculateWaterfallFlow(g, listOf(4), Direction.DOWN)
        assertTrue("(4,5) KHÔNG ngập (vine)", Vec(4, 5) !in r.floodedCells)
        assertTrue("nước tách", Vec(3, 4) in r.floodedCells || Vec(5, 4) in r.floodedCells)
    }
}
