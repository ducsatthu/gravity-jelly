package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class GravityRotationTest {

    private fun b(color: JellyColor = JellyColor.YELLOW) =
        Grid.Cell(CellType.BLOCK, color)

    // Màu xen kẽ để dòng đầy KHÔNG đơn sắc (đơn sắc giờ tạo siêu khối, xem SuperBlockTest).
    private val palette = arrayOf(JellyColor.YELLOW, JellyColor.MINT, JellyColor.PINK, JellyColor.BLUE)

    private fun countOccupied(g: Grid): Int {
        var n = 0
        for (y in 0 until g.size) for (x in 0 until g.size)
            if (g.get(x, y) != null) n++
        return n
    }

    // ── direction changes ──

    @Test
    fun rotateCW_downToLeft() {
        val r = rotateGravity(Grid(), Direction.DOWN, cw = true, budget = 5)!!
        assertEquals(Direction.LEFT, r.newGravity)
    }

    @Test
    fun rotateCW_leftToUp() {
        val r = rotateGravity(Grid(), Direction.LEFT, cw = true, budget = 5)!!
        assertEquals(Direction.UP, r.newGravity)
    }

    @Test
    fun rotateCCW_downToRight() {
        val r = rotateGravity(Grid(), Direction.DOWN, cw = false, budget = 5)!!
        assertEquals(Direction.RIGHT, r.newGravity)
    }

    @Test
    fun rotateCCW_rightToUp() {
        val r = rotateGravity(Grid(), Direction.RIGHT, cw = false, budget = 5)!!
        assertEquals(Direction.UP, r.newGravity)
    }

    // ── budget management ──

    @Test
    fun budgetDecrementsBy1() {
        val r = rotateGravity(Grid(), Direction.DOWN, cw = true, budget = 5)!!
        assertEquals(4, r.budgetAfter)
    }

    @Test
    fun zeroBudget_returnsNull() {
        assertNull(rotateGravity(Grid(), Direction.DOWN, cw = true, budget = 0))
    }

    @Test
    fun negativeBudget_returnsNull() {
        assertNull(rotateGravity(Grid(), Direction.DOWN, cw = true, budget = -1))
    }

    @Test
    fun exhaustBudgetThen_returnsNull() {
        val g = Grid()
        var budget = 2
        var gravity = Direction.DOWN

        val r1 = rotateGravity(g, gravity, cw = true, budget = budget)!!
        budget = r1.budgetAfter; gravity = r1.newGravity
        assertEquals(1, budget)

        val r2 = rotateGravity(g, gravity, cw = true, budget = budget)!!
        budget = r2.budgetAfter; gravity = r2.newGravity
        assertEquals(0, budget)

        assertNull(rotateGravity(g, gravity, cw = true, budget = budget))
    }

    // ── 4× CW returns to original direction ──

    @Test
    fun fourCW_emptyGrid_backToOriginalDirection() {
        val g = Grid()
        var gravity = Direction.DOWN
        for (i in 0 until 4) {
            val r = rotateGravity(g, gravity, cw = true, budget = 10 - i)!!
            gravity = r.newGravity
        }
        assertEquals(Direction.DOWN, gravity)
    }

    @Test
    fun fourCCW_backToOriginalDirection() {
        val g = Grid()
        var gravity = Direction.DOWN
        for (i in 0 until 4) {
            val r = rotateGravity(g, gravity, cw = false, budget = 10 - i)!!
            gravity = r.newGravity
        }
        assertEquals(Direction.DOWN, gravity)
    }

    // ── settling ──

    @Test
    fun emptyGrid_noSettlement() {
        val r = rotateGravity(Grid(), Direction.DOWN, cw = true, budget = 1)!!
        assertFalse(r.settled)
        assertTrue(r.resolveResult.events.isEmpty())
    }

    @Test
    fun cellSettlesInNewDirection() {
        val g = Grid()
        g.set(4, 8, b()) // at bottom, middle column

        // Rotate DOWN → LEFT: cell falls to left wall
        val r = rotateGravity(g, Direction.DOWN, cw = true, budget = 1)!!

        assertTrue(r.settled)
        assertEquals(b(), g.get(0, 8))
        assertTrue(g.isEmpty(4, 8))
    }

    @Test
    fun cellAtWall_noMovementOnCompatibleRotation() {
        val g = Grid()
        g.set(0, 8, b()) // bottom-left corner

        // Rotate DOWN → LEFT: cell already at left wall → no movement
        val r = rotateGravity(g, Direction.DOWN, cw = true, budget = 1)!!
        assertFalse(r.settled)
        assertEquals(b(), g.get(0, 8))
    }

    @Test
    fun multipleClusterSettle_deterministic() {
        val g = Grid()
        g.set(3, 3, b(JellyColor.YELLOW))
        g.set(7, 5, b(JellyColor.MINT))
        g.set(1, 0, b(JellyColor.PINK))

        // DOWN → LEFT: all cells fall to col 0
        val r = rotateGravity(g, Direction.DOWN, cw = true, budget = 1)!!
        assertTrue(r.settled)

        assertEquals(b(JellyColor.YELLOW), g.get(0, 3))
        assertEquals(b(JellyColor.MINT), g.get(0, 5))
        assertEquals(b(JellyColor.PINK), g.get(0, 0))
    }

    // ── combo after rotation ──

    @Test
    fun rotationCreatesFullLine_combo1() {
        val g = Grid()
        // Diagonal: one cell per row, each in a different column
        // After LEFT gravity: all cells compress to col 0 → full column (mixed → xóa thường)
        for (i in 0 until 9) g.set(i, i, b(palette[i % 4]))

        val r = rotateGravity(g, Direction.DOWN, cw = true, budget = 3)!!

        assertTrue(r.settled)
        assertEquals(1, r.resolveResult.endCombo)
        assertEquals(9, r.resolveResult.totalScore) // 9 cells × 1 col × combo 1
        assertEquals(0, countOccupied(g))
        assertEquals(2, r.budgetAfter)
    }

    @Test
    fun rotationCreatesFullRow_gravityUp() {
        val g = Grid()
        // Scatter cells: one per column, at various rows
        // After UP gravity: all rise to row 0 → full row (mixed → xóa thường)
        for (x in 0 until 9) g.set(x, x, b(palette[x % 4]))

        val r = rotateGravity(g, Direction.RIGHT, cw = false, budget = 5)!!
        // RIGHT.rotateCCW() = UP

        assertEquals(Direction.UP, r.newGravity)
        assertTrue(r.settled)
        assertEquals(1, r.resolveResult.endCombo)
        assertEquals(9, r.resolveResult.totalScore)
        assertEquals(0, countOccupied(g))
    }

    // ── 4× CW with cells ──

    @Test
    fun fourCW_withCells_gridStaysValid() {
        val g = Grid()
        g.set(2, 7, b(JellyColor.YELLOW))
        g.set(5, 3, b(JellyColor.MINT))
        g.set(8, 8, b(JellyColor.PINK))

        var gravity = Direction.DOWN
        for (i in 0 until 4) {
            val r = rotateGravity(g, gravity, cw = true, budget = 10 - i)!!
            gravity = r.newGravity
        }

        assertEquals(Direction.DOWN, gravity)
        // 3 cells still exist (no full lines were formed)
        assertEquals(3, countOccupied(g))
        // All cells should have settled to their final positions
        // (settled for DOWN gravity after 4 rotations)
    }

    // ── deterministic ──

    @Test
    fun deterministic_sameInputSameOutput() {
        fun makeGrid(): Grid {
            val g = Grid()
            for (i in 0 until 9) g.set(i, i, b())
            return g
        }

        val g1 = makeGrid()
        val g2 = makeGrid()

        val r1 = rotateGravity(g1, Direction.DOWN, cw = true, budget = 5)!!
        val r2 = rotateGravity(g2, Direction.DOWN, cw = true, budget = 5)!!

        assertEquals(r1.newGravity, r2.newGravity)
        assertEquals(r1.settled, r2.settled)
        assertEquals(r1.budgetAfter, r2.budgetAfter)
        assertEquals(r1.resolveResult.totalScore, r2.resolveResult.totalScore)
        assertEquals(r1.resolveResult.endCombo, r2.resolveResult.endCombo)
        assertEquals(r1.resolveResult.events, r2.resolveResult.events)

        for (y in 0 until Grid.SIZE) {
            for (x in 0 until Grid.SIZE) {
                assertEquals("($x,$y)", g1.get(x, y), g2.get(x, y))
            }
        }
    }

    // ── golden test ──

    /**
     * GOLDEN TEST — Rotation cascade.
     *
     * Initial gravity: DOWN. Board (settled for DOWN):
     *   (0,8) Y  (1,8) Y  (2,8) Y  ...  (8,8) Y  — full row 8
     *   (0,7) M  — single cell col 0
     *
     * Rotate CW → new gravity LEFT.
     *
     * Step 1 — applyClusterGravity(LEFT):
     *   Row 8 cells (0-8) all in same row, packed left → already at wall → no movement.
     *   (0,7) already at x=0 → no movement.
     *   settled = false.
     *
     * Step 2 — resolve(grid, LEFT):
     *   Row 8 is full → clear (9 cells, 1 line, combo 1) → score = 9.
     *   Gravity LEFT: (0,7) already at wall → no movement.
     *   No more full lines.
     *
     * Result: newGravity=LEFT, settled=false, combo=1, score=9.
     * Final grid: only (0,7) remains.
     */
    @Test
    fun golden_rotationWithClear() {
        val g = Grid()
        for (x in 0 until 9) g.set(x, 8, b(palette[x % 4]))   // hàng đầy MIXED → xóa thường
        g.set(0, 7, b(JellyColor.MINT))

        val r = rotateGravity(g, Direction.DOWN, cw = true, budget = 3)!!

        assertEquals(Direction.LEFT, r.newGravity)
        assertFalse(r.settled)
        assertEquals(2, r.budgetAfter)

        assertEquals(1, r.resolveResult.endCombo)
        assertEquals(9, r.resolveResult.totalScore)

        val clear = r.resolveResult.events[0] as ResolveEvent.LinesCleared
        assertEquals(listOf(8), clear.lines.rows)
        assertEquals(9, clear.cellsCleared)
        assertEquals(1, clear.comboLevel)

        // Only the MINT cell remains at (0,7)
        assertEquals(1, countOccupied(g))
        assertEquals(b(JellyColor.MINT), g.get(0, 7))
    }

    /**
     * GOLDEN TEST — Rotation causes settling + clear with surviving cells.
     *
     * Initial gravity: DOWN. Board:
     *   Diagonal: (0,0), (1,1), ..., (8,8) — all YELLOW, 9 separate clusters
     *   Extra: (5,0) MINT, (6,0) PINK — rigid pair, NOT adjacent to diagonal
     *
     * Rotate CW → new gravity LEFT.
     *
     * Step 1 — applyClusterGravity(LEFT):
     *   Each diagonal cell independently falls to col 0: (0,0)→stays, (1,1)→(0,1), ...
     *   Extra pair {(5,0),(6,0)} falls left, blocked by (0,0) → settles at (1,0),(2,0).
     *   Col 0 = 9 cells (rows 0-8) → full!
     *
     * Step 2 — resolve(LEFT):
     *   Clear col 0 (9 cells, 1 col, combo 1) → score = 9.
     *   Gravity LEFT: pair at (1,0),(2,0) shifts to (0,0),(1,0).
     *   No more full lines.
     *
     * Result: score=9, combo=1. 2 cells remain at (0,0)=MINT, (1,0)=PINK.
     */
    @Test
    fun golden_rotationSettleThenClear() {
        val g = Grid()
        // Diagonal: each cell is an independent cluster (diagonal = not adjacent); MIXED → xóa thường
        for (i in 0 until 9) g.set(i, i, b(palette[i % 4]))
        // Extra pair far from (0,0) — not adjacent to any diagonal cell
        g.set(5, 0, b(JellyColor.MINT))
        g.set(6, 0, b(JellyColor.PINK))

        val r = rotateGravity(g, Direction.DOWN, cw = true, budget = 5)!!

        assertEquals(Direction.LEFT, r.newGravity)
        assertTrue(r.settled)
        assertEquals(4, r.budgetAfter)

        assertEquals(1, r.resolveResult.endCombo)
        assertEquals(9, r.resolveResult.totalScore)

        // 2 cells remain: pair shifted to (0,0) and (1,0)
        assertEquals(2, countOccupied(g))
        assertEquals(b(JellyColor.MINT), g.get(0, 0))
        assertEquals(b(JellyColor.PINK), g.get(1, 0))
    }
}
