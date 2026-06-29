package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ResolveTest {

    private fun b(color: JellyColor = JellyColor.YELLOW) =
        Grid.Cell(CellType.BLOCK, color)

    // Lấp đầy hàng/cột bằng màu XEN KẼ → KHÔNG đơn sắc, nên không kích hợp nhất siêu khối.
    // Lệch pha theo chỉ số hàng/cột (×2) để khi XẾP CHỒNG vẫn không tạo SỌC 3 màu (→ cầu vồng):
    // resolve giờ GHÉP trước khi xóa (Resolve PHA1) nên 3 hàng sọc cũ sẽ thành cầu vồng thay vì xóa.
    // (Hàng/cột ĐƠN SẮC tạo siêu khối — phủ riêng ở SuperBlockTest.)
    private val mixPalette = arrayOf(JellyColor.YELLOW, JellyColor.MINT, JellyColor.PINK, JellyColor.BLUE)

    private fun fillRow(g: Grid, row: Int) {
        for (x in 0 until g.size) g.set(x, row, b(mixPalette[(x + 2 * row) % 4]))
    }

    private fun fillCol(g: Grid, col: Int) {
        for (y in 0 until g.size) g.set(col, y, b(mixPalette[(y + 2 * col) % 4]))
    }

    private fun countOccupied(g: Grid): Int {
        var n = 0
        for (y in 0 until g.size) for (x in 0 until g.size)
            if (g.get(x, y) != null) n++
        return n
    }

    // ── no-op cases ──

    @Test
    fun emptyGrid_noEvents() {
        val r = resolve(Grid(), Direction.DOWN)
        assertTrue(r.events.isEmpty())
        assertEquals(0, r.totalScore)
        assertEquals(0, r.endCombo)
    }

    @Test
    fun noFullLines_noEvents() {
        val g = Grid()
        for (x in 0 until 8) g.set(x, 8, b())
        val r = resolve(g, Direction.DOWN)
        assertTrue(r.events.isEmpty())
        assertEquals(0, r.totalScore)
        assertEquals(0, r.endCombo)
    }

    // ── single clear, no cascade ──

    @Test
    fun singleRow_combo1() {
        val g = Grid()
        fillRow(g, 8)
        val r = resolve(g, Direction.DOWN)

        assertEquals(1, r.endCombo)
        assertEquals(9, r.totalScore) // 9 cells × 1 line × combo 1
        assertEquals(2, r.events.size)

        val clear = r.events[0] as ResolveEvent.LinesCleared
        assertEquals(listOf(8), clear.lines.rows)
        assertTrue(clear.lines.cols.isEmpty())
        assertEquals(9, clear.cellsCleared)
        assertEquals(1, clear.comboLevel)
        assertEquals(9, clear.score)

        val collapse = r.events[1] as ResolveEvent.ClustersCollapsed
        assertFalse(collapse.moved)

        assertEquals(0, countOccupied(g))
    }

    @Test
    fun singleCol_combo1() {
        val g = Grid()
        fillCol(g, 4)
        val r = resolve(g, Direction.DOWN)

        assertEquals(1, r.endCombo)
        assertEquals(9, r.totalScore)

        val clear = r.events[0] as ResolveEvent.LinesCleared
        assertTrue(clear.lines.rows.isEmpty())
        assertEquals(listOf(4), clear.lines.cols)
        assertEquals(9, clear.cellsCleared)
    }

    @Test
    fun rowAndCol_clearedTogether_combo2() {
        val g = Grid()
        fillRow(g, 3)
        fillCol(g, 5)
        val r = resolve(g, Direction.DOWN)

        // Xóa 2 line cùng lúc → combo cộng +2.
        assertEquals(2, r.endCombo)
        // 17 cells × 2 lines × 2 combo = 68
        assertEquals(68, r.totalScore)

        val clear = r.events[0] as ResolveEvent.LinesCleared
        assertEquals(listOf(3), clear.lines.rows)
        assertEquals(listOf(5), clear.lines.cols)
        assertEquals(17, clear.cellsCleared)
        assertEquals(2, clear.lines.count)
        assertEquals(2, clear.comboLevel)
    }

    // ── cascade: combo 2 ──

    @Test
    fun cascade_combo2_rowReforms() {
        val g = Grid()
        // (8,6) PINK: thả lửng rời — XÓA dồn CẢ BÀN nên cũng rơi xuống đáy.
        g.set(8, 6, b(JellyColor.PINK))
        // Row 7: 8 ô (cols 0-7) — rơi xuống row 8 sau khi xóa.
        for (x in 0 until 8) g.set(x, 7, b(JellyColor.MINT))
        // Row 8: full row — xóa trước.
        fillRow(g, 8)

        val r = resolve(g, Direction.DOWN)

        // Sụp toàn bàn: row 7 MINT (cols 0-7) rơi xuống row 8 cols 0-7 + (8,6) PINK rơi xuống
        // (8,8) → row 8 ĐẦY LẠI (9 ô) → REFORM xóa lần 2 (combo ×2). Bàn trống sau cùng.
        assertEquals(2, r.endCombo)
        assertEquals(27, r.totalScore) // 9 (lần 1, ×1) + 18 (reform, ×2)
        assertEquals(4, r.events.size) // clear, collapse, clear, collapse
        assertTrue((r.events[1] as ResolveEvent.ClustersCollapsed).moved)
        assertEquals(0, countOccupied(g))
    }

    @Test
    fun cascade_combo2_gravityUp() {
        val g = Grid()
        // Gravity UP: cells "fall" upward
        // Row 2: single cell at col 8
        g.set(8, 2, b(JellyColor.PINK))
        // Row 1: 8 cells (cols 0-7)
        for (x in 0 until 8) g.set(x, 1, b(JellyColor.MINT))
        // Row 0: full row — cleared first
        fillRow(g, 0)

        val r = resolve(g, Direction.UP)

        // Sụp toàn bàn lên row 0: row 1 MINT + (8,2) PINK đều dồn lên → row 0 đầy lại → reform ×2.
        assertEquals(2, r.endCombo)
        assertEquals(27, r.totalScore)
        assertEquals(0, countOccupied(g))
    }

    @Test
    fun cascade_combo2_gravityLeft() {
        val g = Grid()
        // Gravity LEFT: cells "fall" leftward
        // Col 2: single cell at row 8
        g.set(2, 8, b(JellyColor.PINK))
        // Col 1: 8 cells (rows 0-7)
        for (y in 0 until 8) g.set(1, y, b(JellyColor.MINT))
        // Col 0: full column — cleared first
        fillCol(g, 0)

        val r = resolve(g, Direction.LEFT)

        // Sụp toàn bàn sang col 0: col 1 MINT + (2,8) PINK đều dồn trái → col 0 đầy lại → reform ×2.
        assertEquals(2, r.endCombo)
        assertEquals(27, r.totalScore)
        assertEquals(0, countOccupied(g))
    }

    // ── golden tests ──

    /**
     * GOLDEN TEST — Xóa hàng + sụp CẢ BÀN (global) → reform.
     *
     * Board setup (gravity DOWN):
     *   Row 6: . . . . . . . . P      (8,6) = PINK — thả LỬNG RỜI
     *   Row 7: M M M M M M M M .      (0-7,7) = MINT
     *   Row 8: Y M P B Y M P B Y      full row (mix)
     *
     * Expected resolve:
     *   1. Clear row 8 (9 cells, 1 line, combo 1) → score 9
     *   2. Sụp CẢ BÀN: row 7 MINT rơi xuống row 8 (cols 0-7) + (8,6) PINK rơi xuống (8,8).
     *      → Row 8 đầy lại (9 ô) → REFORM.
     *   3. Clear row 8 lần 2 (9 cells, combo 2) → score 18. Bàn trống.
     *   Total: 27, endCombo 2, 4 sự kiện, bàn trống.
     */
    @Test
    fun golden_combo2_exactEvents() {
        val g = Grid()
        g.set(8, 6, b(JellyColor.PINK))
        for (x in 0 until 8) g.set(x, 7, b(JellyColor.MINT))
        fillRow(g, 8)

        val r = resolve(g, Direction.DOWN)

        assertEquals(4, r.events.size)
        assertEquals(27, r.totalScore)
        assertEquals(2, r.endCombo)

        // Event 0: xóa row 8 lần 1
        val e0 = r.events[0] as ResolveEvent.LinesCleared
        assertEquals(ClearedLines(rows = listOf(8), cols = emptyList()), e0.lines)
        assertEquals(9, e0.cellsCleared)
        assertEquals(1, e0.comboLevel)
        assertEquals(9, e0.score)

        // Event 1: sụp cả bàn (row 7 + PINK đều rơi)
        assertTrue((r.events[1] as ResolveEvent.ClustersCollapsed).moved)

        // Event 2: reform → xóa row 8 lần 2 (combo 2)
        val e2 = r.events[2] as ResolveEvent.LinesCleared
        assertEquals(ClearedLines(rows = listOf(8), cols = emptyList()), e2.lines)
        assertEquals(9, e2.cellsCleared)
        assertEquals(2, e2.comboLevel)
        assertEquals(18, e2.score)

        // Event 3: collapse cuối (bàn trống, không di chuyển)
        assertFalse((r.events[3] as ResolveEvent.ClustersCollapsed).moved)

        assertEquals(0, countOccupied(g))
    }

    /**
     * GOLDEN TEST — Deterministic: same input, same output.
     * Running resolve twice on identical boards produces identical results.
     */
    @Test
    fun golden_combo2_deterministic() {
        fun makeBoard(): Grid {
            val g = Grid()
            g.set(8, 6, b(JellyColor.PINK))
            for (x in 0 until 8) g.set(x, 7, b(JellyColor.MINT))
            fillRow(g, 8)
            return g
        }

        val r1 = resolve(makeBoard(), Direction.DOWN)
        val r2 = resolve(makeBoard(), Direction.DOWN)

        assertEquals(r1.totalScore, r2.totalScore)
        assertEquals(r1.endCombo, r2.endCombo)
        assertEquals(r1.events.size, r2.events.size)
        for (i in r1.events.indices) {
            assertEquals("event[$i]", r1.events[i], r2.events[i])
        }
    }

    /**
     * GOLDEN TEST — Trạng thái lưới sau xóa + sụp CẢ BÀN → reform.
     * Row 7 MINT + (8,6) PINK dồn xuống row 8 đầy lại rồi xóa lần 2 → bàn TRỐNG.
     */
    @Test
    fun golden_combo2_finalGridState() {
        val g = Grid()
        g.set(8, 6, b(JellyColor.PINK))
        for (x in 0 until 8) g.set(x, 7, b(JellyColor.MINT))
        fillRow(g, 8)

        resolve(g, Direction.DOWN)

        for (y in 0 until g.size) {
            for (x in 0 until g.size) {
                assertEquals("Cell ($x,$y)", null, g.get(x, y))
            }
        }
    }

    /**
     * GOLDEN TEST — Multi-row initial clear, then cascade.
     *
     * Board (gravity DOWN):
     *   Row 5: . . . . . . . . P      (8,5) = PINK
     *   Row 6: M M M M M M M M .      (0-7,6) = MINT
     *   Row 7: Y Y Y Y Y Y Y Y Y      full row YELLOW
     *   Row 8: B B B B B B B B B      full row BLUE
     *
     * Step 1: Clear rows 7 AND 8 → 18 cells, 2 lines → combo +2
     *   score = 18 × 2 × 2 = 72
     * Step 2: Sụp CẢ BÀN — row 6 MINT rơi xuống row 8 (cols 0-7) + (8,5) PINK rơi xuống (8,8).
     *   → Row 8 đầy lại (9 ô) → REFORM.
     * Step 3: Clear row 8 lần 2 (9 cells, combo 3) → score 9 × 1 × 3 = 27. Bàn trống.
     * Total: 99, endCombo 3.
     */
    @Test
    fun golden_multiRowThenCascade() {
        val g = Grid()
        g.set(8, 5, b(JellyColor.PINK))
        for (x in 0 until 8) g.set(x, 6, b(JellyColor.MINT))
        fillRow(g, 7)
        fillRow(g, 8)

        val r = resolve(g, Direction.DOWN)

        assertEquals(4, r.events.size)
        assertEquals(3, r.endCombo)
        assertEquals(99, r.totalScore)

        // 2 hàng xóa cùng lúc → combo 2
        val e0 = r.events[0] as ResolveEvent.LinesCleared
        assertEquals(listOf(7, 8), e0.lines.rows)
        assertEquals(18, e0.cellsCleared)
        assertEquals(2, e0.comboLevel)
        assertEquals(72, e0.score)

        assertTrue((r.events[1] as ResolveEvent.ClustersCollapsed).moved)

        // reform → xóa lần 2 (combo 3) rồi bàn trống.
        val e2 = r.events[2] as ResolveEvent.LinesCleared
        assertEquals(listOf(8), e2.lines.rows)
        assertEquals(9, e2.cellsCleared)
        assertEquals(3, e2.comboLevel)
        assertEquals(27, e2.score)
        assertEquals(0, countOccupied(g))
    }

    /**
     * GOLDEN TEST — Row + column cleared simultaneously.
     *
     * Board (gravity DOWN):
     *   Col 0: filled rows 0-8 with MINT (9 cells — full column!)
     *   Row 7: filled cols 1-8 with PINK + col 0 MINT = full row
     *   Row 8: filled with YELLOW + col 0 overridden by MINT at (0,8)
     *     → (0,8) is YELLOW from fillRow
     *
     * findFullLines detects: rows [7, 8] + col [0] = 3 lines → combo +3.
     * Cells cleared = 9+9+9 − 2 intersections = 25.
     * Score = 25 × 3 × 3 = 225.
     * Grid is empty after (all cells were in cleared lines).
     */
    @Test
    fun golden_rowAndColInteraction() {
        val g = Grid()
        // Col 0 rows 0-7
        for (y in 0 until 8) g.set(0, y, b(JellyColor.MINT))
        // Row 7 cols 1-8 (col 0 already set above)
        for (x in 1 until 9) g.set(x, 7, b(JellyColor.PINK))
        // Row 8 full — this also fills (0,8) making col 0 complete
        fillRow(g, 8)

        val r = resolve(g, Direction.DOWN)

        assertEquals(2, r.events.size)
        assertEquals(3, r.endCombo)
        assertEquals(225, r.totalScore)

        val clear = r.events[0] as ResolveEvent.LinesCleared
        assertEquals(listOf(7, 8), clear.lines.rows)
        assertEquals(listOf(0), clear.lines.cols)
        assertEquals(25, clear.cellsCleared)
        assertEquals(3, clear.lines.count)
        assertEquals(225, clear.score)

        val collapse = r.events[1] as ResolveEvent.ClustersCollapsed
        assertFalse(collapse.moved)

        assertEquals(0, countOccupied(g))
    }

    // ── integration with place + hardDrop ──

    @Test
    fun placeCompletesRow_resolveClearsIt() {
        val g = Grid()
        // Fill row 8 except col 4
        for (x in 0 until 9) {
            if (x != 4) g.set(x, 8, b())
        }
        // Drop DOT into col 4
        val p = Piece(PieceLibrary.DOT, JellyColor.PINK)
        val drop = hardDrop(g, p, 4, Direction.DOWN) as PlacementResult.Success
        place(g, p, drop.cells)

        val r = resolve(g, Direction.DOWN)
        assertEquals(1, r.endCombo)
        assertEquals(9, r.totalScore)
        assertEquals(0, countOccupied(g))
    }

    @Test
    fun placeTriggersCascade() {
        val g = Grid()
        // Set up cascade scenario:
        // Row 6: cell at col 8 (cascade filler)
        g.set(8, 6, b(JellyColor.BLUE))
        // Row 7: cells at cols 0-7 (cascade almost-full)
        for (x in 0 until 8) g.set(x, 7, b(JellyColor.MINT))
        // Row 8: fill all except col 4
        for (x in 0 until 9) {
            if (x != 4) g.set(x, 8, b())
        }

        // Simulate placing piece at (4,8) — completing row 8
        g.set(4, 8, b(JellyColor.PINK))

        val r = resolve(g, Direction.DOWN)
        // Sụp cả bàn: row 7 MINT + (8,6) BLUE đều rơi xuống row 8 → đầy lại → reform ×2 → trống.
        assertEquals(2, r.endCombo)
        assertEquals(27, r.totalScore)
        assertEquals(0, countOccupied(g))
    }

    // ── edge cases ──

    @Test
    fun clearAfterDown_floatingCellFallsToFloor() {
        val g = Grid()
        fillRow(g, 8)
        // Ô lửng trên cao — xóa dồn CẢ BÀN nên rơi xuống đáy (không còn treo).
        g.set(4, 0, b(JellyColor.BLUE))

        val r = resolve(g, Direction.DOWN)

        assertEquals(1, r.endCombo)
        // Sụp cả bàn: ô BLUE rơi từ (4,0) xuống đáy (4,8); không reform (chỉ 1 ô).
        assertTrue((r.events[1] as ResolveEvent.ClustersCollapsed).moved)
        assertEquals(b(JellyColor.BLUE), g.get(4, 8))
        assertEquals(1, countOccupied(g))
    }

    // ── combo cộng dồn qua nhiều nước (startCombo) ──

    @Test
    fun startCombo_carriesOver_singleRow() {
        val g = Grid()
        fillRow(g, 8)
        // Nước trước đã đạt combo 1 → nước này xóa 1 hàng nữa → combo 2 (×2).
        val r = resolve(g, Direction.DOWN, startCombo = 1)

        assertEquals(2, r.endCombo)
        assertEquals(18, r.totalScore) // 9 cells × 1 line × 2 combo
        assertTrue(r.cleared)
        assertEquals(2, (r.events[0] as ResolveEvent.LinesCleared).comboLevel)
    }

    @Test
    fun startCombo_notCleared_keepsComboUnchanged() {
        val g = Grid()
        for (x in 0 until 8) g.set(x, 8, b()) // hàng chưa đầy
        val r = resolve(g, Direction.DOWN, startCombo = 3)

        assertFalse(r.cleared)
        assertEquals(3, r.endCombo) // không xóa được gì → combo giữ nguyên
        assertEquals(0, r.totalScore)
        assertTrue(r.events.isEmpty())
    }

    @Test
    fun threeRowsSimultaneous_combo3() {
        val g = Grid()
        fillRow(g, 6)
        fillRow(g, 7)
        fillRow(g, 8)

        val r = resolve(g, Direction.DOWN)

        // 3 hàng xóa cùng lúc → combo +3.
        assertEquals(3, r.endCombo)
        // 27 cells × 3 lines × 3 = 243
        assertEquals(243, r.totalScore)

        val clear = r.events[0] as ResolveEvent.LinesCleared
        assertEquals(listOf(6, 7, 8), clear.lines.rows)
        assertEquals(27, clear.cellsCleared)
        assertEquals(3, clear.comboLevel)
    }
}
