package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ClusterPhysicsTest {

    private fun b(color: JellyColor = JellyColor.YELLOW) =
        Grid.Cell(CellType.BLOCK, color)

    private fun setCell(g: Grid, x: Int, y: Int, color: JellyColor = JellyColor.YELLOW) {
        g.set(x, y, b(color))
    }

    // ── findClusters ──

    @Test
    fun findClusters_emptyGrid() {
        assertEquals(emptyList<List<Vec>>(), findClusters(Grid()))
    }

    @Test
    fun findClusters_singleCell() {
        val g = Grid()
        setCell(g, 4, 4)
        val c = findClusters(g)
        assertEquals(1, c.size)
        assertEquals(listOf(Vec(4, 4)), c[0])
    }

    @Test
    fun findClusters_twoSeparate() {
        val g = Grid()
        setCell(g, 0, 0)
        setCell(g, 5, 5)
        assertEquals(2, findClusters(g).size)
    }

    @Test
    fun findClusters_lShapeIsOneCluster() {
        val g = Grid()
        setCell(g, 0, 0); setCell(g, 0, 1); setCell(g, 1, 1)
        val c = findClusters(g)
        assertEquals(1, c.size)
        assertEquals(
            listOf(Vec(0, 0), Vec(0, 1), Vec(1, 1)),
            c[0],
        )
    }

    @Test
    fun findClusters_diagonalNotConnected() {
        val g = Grid()
        setCell(g, 0, 0); setCell(g, 1, 1)
        assertEquals(2, findClusters(g).size)
    }

    // ── applyClusterGravity: basic ──

    @Test
    fun emptyGrid_noMovement() {
        assertFalse(applyClusterGravity(Grid(), Direction.DOWN))
    }

    @Test
    fun alreadySettled_noMovement() {
        val g = Grid()
        setCell(g, 3, 8); setCell(g, 4, 8)
        assertFalse(applyClusterGravity(g, Direction.DOWN))
    }

    // ── all 4 directions ──

    @Test
    fun singleCell_down() {
        val g = Grid()
        setCell(g, 4, 0)
        assertTrue(applyClusterGravity(g, Direction.DOWN))
        assertNull(g.get(4, 0))
        assertEquals(b(), g.get(4, 8))
    }

    @Test
    fun singleCell_up() {
        val g = Grid()
        setCell(g, 4, 8)
        assertTrue(applyClusterGravity(g, Direction.UP))
        assertNull(g.get(4, 8))
        assertEquals(b(), g.get(4, 0))
    }

    @Test
    fun singleCell_left() {
        val g = Grid()
        setCell(g, 8, 4)
        assertTrue(applyClusterGravity(g, Direction.LEFT))
        assertNull(g.get(8, 4))
        assertEquals(b(), g.get(0, 4))
    }

    @Test
    fun singleCell_right() {
        val g = Grid()
        setCell(g, 0, 4)
        assertTrue(applyClusterGravity(g, Direction.RIGHT))
        assertNull(g.get(0, 4))
        assertEquals(b(), g.get(8, 4))
    }

    // ── rigid cluster ──

    @Test
    fun lShape_fallsRigid_leavesGap() {
        val g = Grid()
        // X .
        // X X
        setCell(g, 0, 0); setCell(g, 0, 1); setCell(g, 1, 1)

        applyClusterGravity(g, Direction.DOWN)

        // Row 7: X .
        // Row 8: X X
        assertEquals(b(), g.get(0, 7))
        assertEquals(b(), g.get(0, 8))
        assertEquals(b(), g.get(1, 8))
        assertNull(g.get(1, 7)) // gap preserved
    }

    @Test
    fun lShape_stopsOnObstacle_gapBelow() {
        val g = Grid()
        // L-shape
        setCell(g, 0, 0, JellyColor.YELLOW)
        setCell(g, 0, 1, JellyColor.YELLOW)
        setCell(g, 1, 1, JellyColor.YELLOW)
        // Obstacle at (1,8)
        setCell(g, 1, 8, JellyColor.BLUE)

        applyClusterGravity(g, Direction.DOWN)

        // L stops because (1,y+1) would hit obstacle:
        // Row 6: X .
        // Row 7: X X
        // Row 8: . X  (obstacle)
        assertEquals(b(JellyColor.YELLOW), g.get(0, 6))
        assertEquals(b(JellyColor.YELLOW), g.get(0, 7))
        assertEquals(b(JellyColor.YELLOW), g.get(1, 7))
        assertEquals(b(JellyColor.BLUE), g.get(1, 8))
        assertNull(g.get(0, 8)) // gap — rigid cluster can't bend
    }

    // ── independent clusters ──

    @Test
    fun twoClusters_fallIndependently_preserveColors() {
        val g = Grid()
        setCell(g, 1, 0, JellyColor.MINT)
        setCell(g, 5, 2, JellyColor.PINK)

        applyClusterGravity(g, Direction.DOWN)

        assertEquals(b(JellyColor.MINT), g.get(1, 8))
        assertEquals(b(JellyColor.PINK), g.get(5, 8))
    }

    @Test
    fun twoColumnsOfClusters_leaveColumnGap() {
        val g = Grid()
        // Col 0: pair, Col 2: pair, Col 1: empty
        setCell(g, 0, 0); setCell(g, 0, 1)
        setCell(g, 2, 0); setCell(g, 2, 1)

        applyClusterGravity(g, Direction.DOWN)

        assertEquals(b(), g.get(0, 7)); assertEquals(b(), g.get(0, 8))
        assertEquals(b(), g.get(2, 7)); assertEquals(b(), g.get(2, 8))
        assertNull(g.get(1, 7))
        assertNull(g.get(1, 8))
    }

    // ── no pass-through ──

    @Test
    fun clustersDoNotPassThrough_sameColumn() {
        val g = Grid()
        setCell(g, 0, 0, JellyColor.YELLOW) // upper
        setCell(g, 0, 3, JellyColor.BLUE)   // lower

        applyClusterGravity(g, Direction.DOWN)

        // lower at bottom, upper on top
        assertEquals(b(JellyColor.YELLOW), g.get(0, 7))
        assertEquals(b(JellyColor.BLUE), g.get(0, 8))
    }

    @Test
    fun clustersDoNotPassThrough_left() {
        val g = Grid()
        setCell(g, 8, 0, JellyColor.YELLOW)
        setCell(g, 5, 0, JellyColor.BLUE)

        applyClusterGravity(g, Direction.LEFT)

        assertEquals(b(JellyColor.BLUE), g.get(0, 0))
        assertEquals(b(JellyColor.YELLOW), g.get(1, 0))
    }

    // ── golden tests: deterministic ──

    private fun makeGoldenGrid(): Grid {
        val g = Grid()
        //   . . M .
        //   . P P .
        //   . . . .
        //   . . . . . B
        //   ... (rest empty)
        //   . . Y .           ← row 8, obstacle
        setCell(g, 2, 0, JellyColor.MINT)
        setCell(g, 1, 1, JellyColor.PINK)
        setCell(g, 2, 1, JellyColor.PINK)
        setCell(g, 5, 3, JellyColor.BLUE)
        setCell(g, 2, 8, JellyColor.YELLOW)
        return g
    }

    @Test
    fun golden_twoRunsIdentical() {
        val g1 = makeGoldenGrid()
        val g2 = makeGoldenGrid()
        applyClusterGravity(g1, Direction.DOWN)
        applyClusterGravity(g2, Direction.DOWN)
        for (y in 0 until Grid.SIZE) {
            for (x in 0 until Grid.SIZE) {
                assertEquals("($x,$y)", g1.get(x, y), g2.get(x, y))
            }
        }
    }

    @Test
    fun golden_exactFinalState() {
        val g = makeGoldenGrid()
        assertTrue(applyClusterGravity(g, Direction.DOWN))

        // L-cluster {(2,0)M,(1,1)P,(2,1)P} drops until (2,n+1) would hit obstacle at (2,8).
        // Cluster at n=6: cells (2,6),(1,7),(2,7). Next dest (2,8) blocked → stops.
        assertEquals(b(JellyColor.MINT), g.get(2, 6))
        assertEquals(b(JellyColor.PINK), g.get(1, 7))
        assertEquals(b(JellyColor.PINK), g.get(2, 7))

        // Obstacle remains
        assertEquals(b(JellyColor.YELLOW), g.get(2, 8))

        // Single cell (5,3) falls to (5,8)
        assertEquals(b(JellyColor.BLUE), g.get(5, 8))

        // Everything else empty
        var occupied = 0
        for (y in 0 until Grid.SIZE) {
            for (x in 0 until Grid.SIZE) {
                if (g.get(x, y) != null) occupied++
            }
        }
        assertEquals(5, occupied)
    }
}
