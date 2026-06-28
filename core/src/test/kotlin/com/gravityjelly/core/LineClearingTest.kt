package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class LineClearingTest {

    private fun fillRow(grid: Grid, row: Int) {
        for (x in 0 until grid.size)
            grid.set(x, row, Grid.Cell(CellType.BLOCK, JellyColor.YELLOW))
    }

    private fun fillCol(grid: Grid, col: Int) {
        for (y in 0 until grid.size)
            grid.set(col, y, Grid.Cell(CellType.BLOCK, JellyColor.MINT))
    }

    // ── findFullLines ──

    @Test
    fun emptyGrid_noFullLines() {
        val lines = findFullLines(Grid())
        assertTrue(lines.isEmpty)
        assertEquals(0, lines.count)
    }

    @Test
    fun singleFullRow() {
        val g = Grid()
        fillRow(g, 3)
        val lines = findFullLines(g)
        assertEquals(listOf(3), lines.rows)
        assertTrue(lines.cols.isEmpty())
        assertEquals(1, lines.count)
    }

    @Test
    fun singleFullCol() {
        val g = Grid()
        fillCol(g, 5)
        val lines = findFullLines(g)
        assertTrue(lines.rows.isEmpty())
        assertEquals(listOf(5), lines.cols)
        assertEquals(1, lines.count)
    }

    @Test
    fun multipleFullRows() {
        val g = Grid()
        fillRow(g, 0)
        fillRow(g, 4)
        fillRow(g, 8)
        val lines = findFullLines(g)
        assertEquals(listOf(0, 4, 8), lines.rows)
        assertTrue(lines.cols.isEmpty())
        assertEquals(3, lines.count)
    }

    @Test
    fun multipleFullCols() {
        val g = Grid()
        fillCol(g, 1)
        fillCol(g, 7)
        val lines = findFullLines(g)
        assertTrue(lines.rows.isEmpty())
        assertEquals(listOf(1, 7), lines.cols)
    }

    @Test
    fun rowAndCol_bothDetected() {
        val g = Grid()
        fillRow(g, 3)
        fillCol(g, 5)
        val lines = findFullLines(g)
        assertEquals(listOf(3), lines.rows)
        assertEquals(listOf(5), lines.cols)
        assertEquals(2, lines.count)
    }

    @Test
    fun almostFullRow_notDetected() {
        val g = Grid()
        for (x in 0 until 8) g.set(x, 0, Grid.Cell(CellType.BLOCK, JellyColor.PINK))
        assertTrue(findFullLines(g).isEmpty)
    }

    @Test
    fun almostFullCol_notDetected() {
        val g = Grid()
        for (y in 0 until 8) g.set(2, y, Grid.Cell(CellType.BLOCK, JellyColor.PINK))
        assertTrue(findFullLines(g).isEmpty)
    }

    // ── clearLines ──

    @Test
    fun clearSingleRow_9cells() {
        val g = Grid()
        fillRow(g, 3)
        val cleared = clearLines(g, findFullLines(g))
        assertEquals(9, cleared)
        for (x in 0 until 9) assertTrue(g.isEmpty(x, 3))
    }

    @Test
    fun clearSingleCol_9cells() {
        val g = Grid()
        fillCol(g, 5)
        val cleared = clearLines(g, findFullLines(g))
        assertEquals(9, cleared)
        for (y in 0 until 9) assertTrue(g.isEmpty(5, y))
    }

    @Test
    fun clearRowAndCol_intersectionCountedOnce() {
        val g = Grid()
        fillRow(g, 3)
        fillCol(g, 5)
        val cleared = clearLines(g, findFullLines(g))
        // 9 (row) + 9 (col) − 1 (intersection at 5,3) = 17
        assertEquals(17, cleared)
    }

    @Test
    fun clearTwoRowsTwoCols_fourIntersections() {
        val g = Grid()
        fillRow(g, 0)
        fillRow(g, 8)
        fillCol(g, 0)
        fillCol(g, 8)
        val lines = findFullLines(g)
        assertEquals(4, lines.count)
        val cleared = clearLines(g, lines)
        // 2×9 + 2×9 − 4 intersections = 32
        assertEquals(32, cleared)
    }

    @Test
    fun clearDoesNotAffectOtherCells() {
        val g = Grid()
        fillRow(g, 3)
        g.set(4, 5, Grid.Cell(CellType.BLOCK, JellyColor.BLUE))
        clearLines(g, findFullLines(g))
        assertFalse(g.isEmpty(4, 5))
    }

    @Test
    fun clearEmptyLines_noop() {
        val g = Grid()
        g.set(0, 0, Grid.Cell(CellType.BLOCK, JellyColor.PINK))
        val cleared = clearLines(g, ClearedLines(emptyList(), emptyList()))
        assertEquals(0, cleared)
        assertFalse(g.isEmpty(0, 0))
    }

    // ── Scoring ──

    @Test
    fun score_singleRow() {
        assertEquals(9, Scoring.clearScore(cellsCleared = 9, linesCleared = 1))
    }

    @Test
    fun score_twoRows() {
        assertEquals(36, Scoring.clearScore(cellsCleared = 18, linesCleared = 2))
    }

    @Test
    fun score_rowAndCol_17cells() {
        assertEquals(34, Scoring.clearScore(cellsCleared = 17, linesCleared = 2))
    }

    @Test
    fun score_comboMultiplier() {
        assertEquals(27, Scoring.clearScore(cellsCleared = 9, linesCleared = 1, comboLevel = 3))
    }

    @Test
    fun score_zeroCleared() {
        assertEquals(0, Scoring.clearScore(cellsCleared = 0, linesCleared = 0))
    }

    // ── Integration: place → detect → clear ──

    @Test
    fun placePieceCompletesRow_thenClear() {
        val g = Grid()
        // Fill row 8 except column 4
        for (x in 0 until 9) {
            if (x != 4) g.set(x, 8, Grid.Cell(CellType.BLOCK, JellyColor.YELLOW))
        }
        // Place DOT at col 4 via hard-drop (gravity DOWN)
        val p = Piece(PieceLibrary.DOT, JellyColor.PINK)
        val result = hardDrop(g, p, 4, Direction.DOWN) as PlacementResult.Success
        place(g, p, result.cells)

        // Now row 8 should be full
        val lines = findFullLines(g)
        assertEquals(listOf(8), lines.rows)

        val cleared = clearLines(g, lines)
        assertEquals(9, cleared)
        for (x in 0 until 9) assertTrue(g.isEmpty(x, 8))
    }
}
