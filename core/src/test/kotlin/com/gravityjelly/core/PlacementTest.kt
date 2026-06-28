package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class PlacementTest {

    private fun piece(shape: Shape, color: JellyColor = JellyColor.YELLOW) =
        Piece(shape, color)

    private fun gridWith(vararg filled: Vec): Grid {
        val g = Grid()
        for (v in filled) g.set(v.x, v.y, Grid.Cell(CellType.BLOCK, JellyColor.BLUE))
        return g
    }

    // ── DOWN ──

    @Test
    fun downDrop_emptyGrid_fallsToBottom() {
        val r = hardDrop(Grid(), piece(PieceLibrary.DOT), 0, Direction.DOWN)
        assertEquals(PlacementResult.Success(listOf(Vec(0, 8))), r)
    }

    @Test
    fun downDrop_withObstacle_stopsAbove() {
        val r = hardDrop(gridWith(Vec(0, 7)), piece(PieceLibrary.DOT), 0, Direction.DOWN)
        assertEquals(PlacementResult.Success(listOf(Vec(0, 6))), r)
    }

    @Test
    fun downDrop_multiCellPiece_fallsToBottom() {
        val r = hardDrop(Grid(), piece(PieceLibrary.I2H), 3, Direction.DOWN)
        assertEquals(PlacementResult.Success(listOf(Vec(3, 8), Vec(4, 8))), r)
    }

    @Test
    fun downDrop_tallPiece() {
        val r = hardDrop(Grid(), piece(PieceLibrary.I5V), 0, Direction.DOWN)
        assertEquals(
            PlacementResult.Success(
                listOf(Vec(0, 4), Vec(0, 5), Vec(0, 6), Vec(0, 7), Vec(0, 8))
            ), r,
        )
    }

    @Test
    fun downDrop_lShape_stopsCorrectly() {
        // L3_0 cells: (0,0),(1,0),(0,1) — width 2, height 2
        val r = hardDrop(Grid(), piece(PieceLibrary.L3_0), 0, Direction.DOWN)
        assertEquals(
            PlacementResult.Success(listOf(Vec(0, 7), Vec(1, 7), Vec(0, 8))),
            r,
        )
    }

    @Test
    fun downDrop_multiCellStopsAtHighestObstacle() {
        // Obstacle at col 1, row 5 — domino must stop above it
        val g = gridWith(Vec(1, 5))
        val r = hardDrop(g, piece(PieceLibrary.I2H), 0, Direction.DOWN)
        assertEquals(PlacementResult.Success(listOf(Vec(0, 4), Vec(1, 4))), r)
    }

    // ── UP ──

    @Test
    fun upDrop_emptyGrid_risesToTop() {
        val r = hardDrop(Grid(), piece(PieceLibrary.DOT), 0, Direction.UP)
        assertEquals(PlacementResult.Success(listOf(Vec(0, 0))), r)
    }

    @Test
    fun upDrop_withObstacle_stopsBelow() {
        val r = hardDrop(gridWith(Vec(0, 2)), piece(PieceLibrary.DOT), 0, Direction.UP)
        assertEquals(PlacementResult.Success(listOf(Vec(0, 3))), r)
    }

    @Test
    fun upDrop_tallPiece() {
        val r = hardDrop(Grid(), piece(PieceLibrary.I5V), 0, Direction.UP)
        assertEquals(
            PlacementResult.Success(
                listOf(Vec(0, 0), Vec(0, 1), Vec(0, 2), Vec(0, 3), Vec(0, 4))
            ), r,
        )
    }

    // ── LEFT ──

    @Test
    fun leftDrop_emptyGrid_movesToLeft() {
        val r = hardDrop(Grid(), piece(PieceLibrary.DOT), 0, Direction.LEFT)
        assertEquals(PlacementResult.Success(listOf(Vec(0, 0))), r)
    }

    @Test
    fun leftDrop_withObstacle_stopsRight() {
        val r = hardDrop(gridWith(Vec(3, 0)), piece(PieceLibrary.DOT), 0, Direction.LEFT)
        assertEquals(PlacementResult.Success(listOf(Vec(4, 0))), r)
    }

    @Test
    fun leftDrop_widePiece() {
        val r = hardDrop(Grid(), piece(PieceLibrary.I5H), 0, Direction.LEFT)
        assertEquals(
            PlacementResult.Success(
                listOf(Vec(0, 0), Vec(1, 0), Vec(2, 0), Vec(3, 0), Vec(4, 0))
            ), r,
        )
    }

    // ── RIGHT ──

    @Test
    fun rightDrop_emptyGrid_movesToRight() {
        val r = hardDrop(Grid(), piece(PieceLibrary.DOT), 0, Direction.RIGHT)
        assertEquals(PlacementResult.Success(listOf(Vec(8, 0))), r)
    }

    @Test
    fun rightDrop_withObstacle_stopsLeft() {
        val r = hardDrop(gridWith(Vec(5, 0)), piece(PieceLibrary.DOT), 0, Direction.RIGHT)
        assertEquals(PlacementResult.Success(listOf(Vec(4, 0))), r)
    }

    @Test
    fun rightDrop_lShape() {
        // L3_0 cells: (0,0),(1,0),(0,1) — width 2, height 2
        val r = hardDrop(Grid(), piece(PieceLibrary.L3_0), 0, Direction.RIGHT)
        // farthest right: ox = 9 - 2 = 7 → (7,0),(8,0),(7,1)
        assertEquals(
            PlacementResult.Success(listOf(Vec(7, 0), Vec(8, 0), Vec(7, 1))),
            r,
        )
    }

    // ── No pass-through ──

    @Test
    fun noPassThroughGap_down() {
        // Obstacle at row 5, empty below — piece must NOT jump past it
        val r = hardDrop(gridWith(Vec(0, 5)), piece(PieceLibrary.DOT), 0, Direction.DOWN)
        assertEquals(PlacementResult.Success(listOf(Vec(0, 4))), r)
    }

    @Test
    fun noPassThroughGap_up() {
        val r = hardDrop(gridWith(Vec(0, 3)), piece(PieceLibrary.DOT), 0, Direction.UP)
        assertEquals(PlacementResult.Success(listOf(Vec(0, 4))), r)
    }

    @Test
    fun noPassThroughGap_left() {
        val r = hardDrop(gridWith(Vec(4, 0)), piece(PieceLibrary.DOT), 0, Direction.LEFT)
        assertEquals(PlacementResult.Success(listOf(Vec(5, 0))), r)
    }

    @Test
    fun noPassThroughGap_right() {
        val r = hardDrop(gridWith(Vec(4, 0)), piece(PieceLibrary.DOT), 0, Direction.RIGHT)
        assertEquals(PlacementResult.Success(listOf(Vec(3, 0))), r)
    }

    // ── Invalid cases ──

    @Test
    fun lateralOverhangRight_invalid() {
        val r = hardDrop(Grid(), piece(PieceLibrary.I2H), 8, Direction.DOWN)
        assertTrue(r is PlacementResult.Invalid)
    }

    @Test
    fun negativeLateral_invalid() {
        val r = hardDrop(Grid(), piece(PieceLibrary.DOT), -1, Direction.DOWN)
        assertTrue(r is PlacementResult.Invalid)
    }

    @Test
    fun entryBlocked_invalid() {
        // Top row blocked for DOWN gravity
        val g = gridWith(Vec(0, 0))
        val r = hardDrop(g, piece(PieceLibrary.DOT), 0, Direction.DOWN)
        assertTrue(r is PlacementResult.Invalid)
    }

    @Test
    fun entryBlockedForUp_invalid() {
        // Bottom row blocked for UP gravity
        val g = gridWith(Vec(0, 8))
        val r = hardDrop(g, piece(PieceLibrary.DOT), 0, Direction.UP)
        assertTrue(r is PlacementResult.Invalid)
    }

    @Test
    fun maxLateral_justFits() {
        // I2H width=2, lateralIndex=7 → cells at x=7,8 → should fit
        val r = hardDrop(Grid(), piece(PieceLibrary.I2H), 7, Direction.DOWN)
        assertTrue(r is PlacementResult.Success)
    }

    // ── canPlaceAnywhere ──

    @Test
    fun canPlaceAnywhere_emptyGrid_allDirections() {
        val p = piece(PieceLibrary.O4)
        for (dir in Direction.entries) {
            assertTrue("Should fit with gravity $dir", canPlaceAnywhere(Grid(), p, dir))
        }
    }

    @Test
    fun canPlaceAnywhere_fullGrid_false() {
        val g = Grid()
        for (x in 0 until 9) for (y in 0 until 9)
            g.set(x, y, Grid.Cell(CellType.BLOCK, JellyColor.MINT))
        assertFalse(canPlaceAnywhere(g, piece(PieceLibrary.DOT), Direction.DOWN))
    }

    @Test
    fun canPlaceAnywhere_oneSpotLeft() {
        val g = Grid()
        for (x in 0 until 9) for (y in 0 until 9)
            g.set(x, y, Grid.Cell(CellType.BLOCK, JellyColor.MINT))
        g.set(4, 0, null) // single empty cell at the entry edge for DOWN
        assertTrue(canPlaceAnywhere(g, piece(PieceLibrary.DOT), Direction.DOWN))
        // DOT can be placed at (4,0)
    }

    @Test
    fun canPlaceAnywhere_widePieceNoRoom() {
        // Fill all but one column — I5H (width 5) can't fit
        val g = Grid()
        for (x in 0 until 9) for (y in 0 until 9)
            g.set(x, y, Grid.Cell(CellType.BLOCK, JellyColor.MINT))
        // Clear columns 2-5 (4 columns — still not enough for width 5)
        for (x in 2..5) g.set(x, 0, null)
        assertFalse(canPlaceAnywhere(g, piece(PieceLibrary.I5H), Direction.DOWN))
    }

    // ── nearestFreePlacement (hít chỗ khít gần nhất khi kéo) ──

    private fun successOffset(r: PlacementResult): Pair<Int, Int> {
        val s = r as PlacementResult.Success
        return s.cells.minOf { it.x } to s.cells.minOf { it.y }
    }

    @Test
    fun nearest_exactSpotFree_returnsExact() {
        val r = nearestFreePlacement(Grid(), piece(PieceLibrary.DOT), 4, 4, 2)
        assertEquals(4 to 4, successOffset(r))
    }

    @Test
    fun nearest_blockedSpot_snapsToClosestEmpty() {
        // Ô (4,4) bị chặn; ô khít gần nhất trong bán kính phải được chọn (cách 1 ô).
        val g = gridWith(Vec(4, 4))
        val r = nearestFreePlacement(g, piece(PieceLibrary.DOT), 4, 4, 2)
        val (ox, oy) = successOffset(r)
        assertTrue("phải hít sang ô kề", (ox to oy) != (4 to 4))
        assertEquals("Chebyshev đúng 1 ô", 1, maxOf(kotlin.math.abs(ox - 4), kotlin.math.abs(oy - 4)))
    }

    @Test
    fun nearest_tieBreak_prefersVerticalShift() {
        // Chặn (4,4) và cả hàng ngang kề (3,4)&(5,4) → buộc hít theo trục dọc (lên/xuống).
        val g = gridWith(Vec(4, 4), Vec(3, 4), Vec(5, 4))
        val r = nearestFreePlacement(g, piece(PieceLibrary.DOT), 4, 4, 2)
        val (ox, oy) = successOffset(r)
        assertEquals(4, ox)
        assertTrue("dịch dọc 1 ô", oy == 3 || oy == 5)
    }

    @Test
    fun nearest_dragUp_snapsAbove() {
        val g = gridWith(Vec(4, 4))
        val r = nearestFreePlacement(g, piece(PieceLibrary.DOT), 4, 4, 2, dirX = 0, dirY = -1)
        assertEquals(4 to 3, successOffset(r))
    }

    @Test
    fun nearest_dragDown_snapsBelow() {
        val g = gridWith(Vec(4, 4))
        val r = nearestFreePlacement(g, piece(PieceLibrary.DOT), 4, 4, 2, dirX = 0, dirY = 1)
        assertEquals(4 to 5, successOffset(r))
    }

    @Test
    fun nearest_dragRight_snapsRight() {
        val g = gridWith(Vec(4, 4))
        val r = nearestFreePlacement(g, piece(PieceLibrary.DOT), 4, 4, 2, dirX = 1, dirY = 0)
        assertEquals(5 to 4, successOffset(r))
    }

    @Test
    fun nearest_dragLeft_snapsLeft() {
        val g = gridWith(Vec(4, 4))
        val r = nearestFreePlacement(g, piece(PieceLibrary.DOT), 4, 4, 2, dirX = -1, dirY = 0)
        assertEquals(3 to 4, successOffset(r))
    }

    @Test
    fun nearest_directionNeverBeatsCloser() {
        // Kéo lên nhưng ô ngay trên (4,3) bị chặn → ô kề CÙNG hàng (dist 1) vẫn thắng ô trên xa hơn
        // (dist 2). Hướng chỉ phá hoà khi CÙNG khoảng cách, không cho nhảy xa hơn theo hướng kéo.
        val g = gridWith(Vec(4, 4), Vec(4, 3))
        val r = nearestFreePlacement(g, piece(PieceLibrary.DOT), 4, 4, 2, dirX = 0, dirY = -1)
        val (ox, oy) = successOffset(r)
        assertEquals("ở lại hàng gần nhất (dist 1), không nhảy lên dist 2", 4, oy)
        assertTrue("hít sang ô kề ngang", ox == 3 || ox == 5)
    }

    @Test
    fun nearest_noRoomInRadius_invalid() {
        // Lấp cả lưới → không có chỗ nào trong bán kính.
        val g = Grid()
        for (x in 0 until 9) for (y in 0 until 9)
            g.set(x, y, Grid.Cell(CellType.BLOCK, JellyColor.MINT))
        assertTrue(nearestFreePlacement(g, piece(PieceLibrary.DOT), 4, 4, 2) is PlacementResult.Invalid)
    }

    @Test
    fun nearest_clampsDesiredOutsideBounds() {
        // desired ngoài lưới (-3,-3) nhưng góc (0,0) trống và trong bán kính → hít về góc.
        val r = nearestFreePlacement(Grid(), piece(PieceLibrary.DOT), -3, -3, 4)
        assertEquals(0 to 0, successOffset(r))
    }

    @Test
    fun nearest_widePieceRespectsBounds() {
        // I5H width=5 (maxOx=4); desired 5 sát mép phải → hít về ox=4, không tràn mép.
        val r = nearestFreePlacement(Grid(), piece(PieceLibrary.I5H), 5, 0, 2)
        val (ox, _) = successOffset(r)
        assertEquals(4, ox)
    }

    @Test
    fun nearest_deterministic_sameInputSameResult() {
        val g = gridWith(Vec(4, 4))
        val a = successOffset(nearestFreePlacement(g, piece(PieceLibrary.DOT), 4, 4, 2))
        val b = successOffset(nearestFreePlacement(g, piece(PieceLibrary.DOT), 4, 4, 2))
        assertEquals(a, b)
    }

    // ── place ──

    @Test
    fun placeWritesCellsWithCorrectColor() {
        val g = Grid()
        val p = piece(PieceLibrary.I2H, JellyColor.PINK)
        val cells = listOf(Vec(3, 8), Vec(4, 8))
        place(g, p, cells)

        assertEquals(Grid.Cell(CellType.BLOCK, JellyColor.PINK), g.get(3, 8))
        assertEquals(Grid.Cell(CellType.BLOCK, JellyColor.PINK), g.get(4, 8))
        assertTrue(g.isEmpty(2, 8))
        assertTrue(g.isEmpty(5, 8))
    }

    @Test
    fun placeAndDropIntegration() {
        val g = Grid()
        val p = piece(PieceLibrary.L3_0, JellyColor.MINT)
        val result = hardDrop(g, p, 0, Direction.DOWN) as PlacementResult.Success
        place(g, p, result.cells)

        // L3_0 at bottom-left: (0,7),(1,7),(0,8)
        assertFalse(g.isEmpty(0, 7))
        assertFalse(g.isEmpty(1, 7))
        assertFalse(g.isEmpty(0, 8))
        assertTrue(g.isEmpty(1, 8))

        // Second piece drops and stops on top of first
        val p2 = piece(PieceLibrary.DOT, JellyColor.YELLOW)
        val r2 = hardDrop(g, p2, 0, Direction.DOWN) as PlacementResult.Success
        assertEquals(PlacementResult.Success(listOf(Vec(0, 6))), r2)
    }
}
