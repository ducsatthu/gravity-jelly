package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Luật MERGE (sau khi xóa hàng/cột đầy = tính điểm nền):
 *  - 3×3 CÙNG màu → SIÊU KHỐI cấp 1 (nổ = quét sạch mọi ô cùng màu trên bàn).
 *  - 3×3 ba màu (mỗi màu 1 cột HOẶC 1 hàng) → KHỐI CẦU VỒNG.
 *  - SIÊU KHỐI cấp 2 (nổ = cùng màu toàn bàn + 5×5 quanh tâm): (a) ≥2 super-1 cùng màu dính liền,
 *    HOẶC (b) 3×3 đồng màu có chứa ≥1 super-1.
 *  - 3×3 lộn xộn khác → KHÔNG làm gì (không cộng điểm).
 */
class SuperBlockTest {

    private fun b(color: JellyColor) = Grid.Cell(CellType.BLOCK, color)
    private fun sup(color: JellyColor, level: Int = 1) = Grid.Cell(CellType.BLOCK, color, superLevel = level)
    private fun rb() = Grid.Cell(CellType.BLOCK, color = null, rainbow = true)
    private fun rbSuper() = Grid.Cell(CellType.BLOCK, color = null, rainbow = true, superLevel = 2)
    private val palette = arrayOf(JellyColor.YELLOW, JellyColor.MINT, JellyColor.PINK, JellyColor.BLUE)

    private fun countOccupied(g: Grid): Int {
        var n = 0
        for (y in 0 until g.size) for (x in 0 until g.size) if (g.get(x, y) != null) n++
        return n
    }

    private fun countWhere(g: Grid, pred: (Grid.Cell) -> Boolean): Int {
        var n = 0
        for (y in 0 until g.size) for (x in 0 until g.size) g.get(x, y)?.let { if (pred(it)) n++ }
        return n
    }

    private fun fill3x3(g: Grid, col: Int, row: Int, colors: List<JellyColor>) {
        var i = 0
        for (dy in 0..2) for (dx in 0..2) { g.set(col + dx, row + dy, b(colors[i])); i++ }
    }

    private fun fill3x3Cols(g: Grid, col: Int, row: Int, c0: JellyColor, c1: JellyColor, c2: JellyColor) {
        for (dy in 0..2) {
            g.set(col, row + dy, b(c0)); g.set(col + 1, row + dy, b(c1)); g.set(col + 2, row + dy, b(c2))
        }
    }

    // ── findMergeMove (hàm thuần) ─────────────────────────────────────────────

    @Test
    fun mergeMove_3x3SameColor_isSuper1() {
        val g = Grid()
        fill3x3(g, 3, 3, List(9) { JellyColor.MINT })
        val m = findMergeMove(g) as MergeMove.Super
        assertEquals(1, m.level)
        assertEquals(Vec(4, 4), m.center)
        assertEquals(JellyColor.MINT, m.color)
        assertEquals(9, m.cells.size)
    }

    @Test
    fun mergeMove_3x3ThreeColorColumns_isRainbow() {
        val g = Grid()
        fill3x3Cols(g, 3, 3, JellyColor.MINT, JellyColor.PINK, JellyColor.BLUE)
        val m = findMergeMove(g)
        assertTrue(m is MergeMove.Rainbow)
        assertEquals(Vec(4, 4), (m as MergeMove.Rainbow).center)
    }

    @Test
    fun mergeMove_3x3ThreeColorRows_isRainbow() {
        val g = Grid()
        // mỗi HÀNG một màu
        for (dx in 0..2) {
            g.set(3 + dx, 3, b(JellyColor.MINT))
            g.set(3 + dx, 4, b(JellyColor.PINK))
            g.set(3 + dx, 5, b(JellyColor.BLUE))
        }
        assertTrue(findMergeMove(g) is MergeMove.Rainbow)
    }

    @Test
    fun mergeMove_3x3messyTwoColors_null() {
        // 3×3 hai màu lộn xộn (không mono, không sọc 3 màu) → KHÔNG merge
        val g = Grid()
        fill3x3(
            g, 3, 3,
            listOf(
                JellyColor.MINT, JellyColor.PINK, JellyColor.MINT,
                JellyColor.PINK, JellyColor.MINT, JellyColor.PINK,
                JellyColor.MINT, JellyColor.PINK, JellyColor.MINT,
            ),
        )
        assertNull(findMergeMove(g))
    }

    @Test
    fun mergeMove_sameColorButNot3x3_null() {
        // chữ L 9 ô cùng màu nhưng không phải ô vuông 3×3 → KHÔNG super
        val g = Grid()
        for (y in 0..4) g.set(0, y, b(JellyColor.MINT))
        for (x in 1..4) g.set(x, 4, b(JellyColor.MINT))
        assertNull(findMergeMove(g))
    }

    @Test
    fun mergeMove_twoAdjacentSuper1SameColor_isSuper2() {
        val g = Grid()
        g.set(3, 4, sup(JellyColor.MINT)); g.set(4, 4, sup(JellyColor.MINT))
        val m = findMergeMove(g) as MergeMove.Super
        assertEquals(2, m.level)
        assertEquals(JellyColor.MINT, m.color)
        assertEquals(2, m.cells.size)
    }

    @Test
    fun mergeMove_twoAdjacentSuper1DifferentColors_isRainbowSuper2() {
        // KHÁC màu → CẦU VỒNG SIÊU CẤP (cấp 2)
        val g = Grid()
        g.set(3, 4, sup(JellyColor.MINT)); g.set(4, 4, sup(JellyColor.PINK))
        val m = findMergeMove(g) as MergeMove.Rainbow
        assertEquals(2, m.level)
        assertEquals(2, m.cells.size)
    }

    @Test
    fun mergeMove_super1AdjacentRainbow_isRainbowSuper2() {
        // super-1 + cầu vồng thường dính liền → CẦU VỒNG SIÊU CẤP
        val g = Grid()
        g.set(3, 4, sup(JellyColor.MINT)); g.set(4, 4, rb())
        val m = findMergeMove(g) as MergeMove.Rainbow
        assertEquals(2, m.level)
    }

    @Test
    fun mergeMove_loneSuper1_notMerged() {
        val g = Grid()
        g.set(4, 4, sup(JellyColor.MINT))   // 1 mình, không kíp nổ kề
        assertNull(findMergeMove(g))
    }

    @Test
    fun mergeMove_diagonalSuper1_notMerged() {
        // chéo nhau KHÔNG phải 4-kề → không gộp
        val g = Grid()
        g.set(3, 3, sup(JellyColor.MINT)); g.set(4, 4, sup(JellyColor.PINK))
        assertNull(findMergeMove(g))
    }

    @Test
    fun mergeMove_3x3MonoWithOneSuper1_isSuper2() {
        // 3×3 toàn HỒNG, trong đó 1 ô (lệch tâm) là super-1 → gộp thành super-2
        val g = Grid()
        fill3x3(g, 3, 3, List(9) { JellyColor.PINK })
        g.set(3, 3, sup(JellyColor.PINK))     // 1 ô góc là super-1
        val m = findMergeMove(g) as MergeMove.Super
        assertEquals(2, m.level)
        assertEquals(JellyColor.PINK, m.color)
        assertEquals(Vec(4, 4), m.center)
        assertEquals(9, m.cells.size)
    }

    @Test
    fun mergeMove_3x3MonoWithSuper1AtCenter_isSuper2() {
        val g = Grid()
        fill3x3(g, 3, 3, List(9) { JellyColor.PINK })
        g.set(4, 4, sup(JellyColor.PINK))     // super-1 ngay tâm
        val m = findMergeMove(g) as MergeMove.Super
        assertEquals(2, m.level)
    }

    @Test
    fun mergeMove_3x3MonoMixedColorWithSuper1_notMerged() {
        // có super-1 nhưng box KHÔNG đồng màu → không merge
        val g = Grid()
        fill3x3(g, 3, 3, List(9) { JellyColor.PINK })
        g.set(3, 3, sup(JellyColor.PINK))
        g.set(5, 5, b(JellyColor.MINT))       // 1 ô khác màu
        assertNull(findMergeMove(g))
    }

    // ── qua resolve (tích hợp) ─────────────────────────────────────────────────

    @Test
    fun resolve_3x3SameColor_formsSuper1() {
        val g = Grid()
        fill3x3(g, 3, 3, List(9) { JellyColor.MINT })
        val r = resolve(g, Direction.DOWN)
        assertTrue(r.formedSuper)
        assertFalse(r.cleared)
        val sf = r.events.filterIsInstance<ResolveEvent.SuperFormed>().single()
        assertEquals(1, sf.level)
        assertEquals(1, countWhere(g) { it.superLevel == 1 })
        assertEquals(1, countOccupied(g))
    }

    @Test
    fun resolve_3x3ThreeColors_formsRainbow() {
        val g = Grid()
        fill3x3Cols(g, 3, 3, JellyColor.MINT, JellyColor.PINK, JellyColor.BLUE)
        val r = resolve(g, Direction.DOWN)
        assertTrue(r.events.any { it is ResolveEvent.RainbowFormed })
        assertEquals(1, countWhere(g) { it.isRainbow })
        assertEquals(1, countOccupied(g))
    }

    @Test
    fun resolve_fullMixedLine_clearsAsLine_notMerge() {
        val g = Grid()
        for (x in 0 until 9) g.set(x, 8, b(palette[x % 4]))
        val r = resolve(g, Direction.DOWN)
        assertTrue(r.cleared)
        assertFalse(r.formedSuper)
        assertTrue(r.events.none { it is ResolveEvent.SuperFormed || it is ResolveEvent.RainbowFormed })
        assertEquals(0, countOccupied(g))
    }

    // ── hàng/cột đơn sắc → siêu khối (PHA 0) ───────────────────────────────────

    @Test
    fun resolve_monoFullRow_formsSuper1WithDoubleScore() {
        val g = Grid()
        for (x in 0 until 9) g.set(x, 8, b(JellyColor.MINT))   // hàng 8 đầy, toàn MINT
        val r = resolve(g, Direction.DOWN)
        assertFalse(r.cleared)
        assertTrue(r.formedSuper)
        assertTrue(r.events.none { it is ResolveEvent.LinesCleared })   // KHÔNG xóa, ghép super
        val sf = r.events.filterIsInstance<ResolveEvent.SuperFormed>().single()
        assertEquals(1, sf.level)
        assertEquals(SuperSource.ROW, sf.source)
        assertEquals(Vec(4, 8), sf.at)
        assertEquals(18, r.totalScore)        // 9 ô × combo 1 × 2 (thưởng đơn sắc)
        assertEquals(1, r.endCombo)
        assertEquals(1, countOccupied(g))
    }

    @Test
    fun resolve_monoFullColumn_formsSuper() {
        val g = Grid()
        for (y in 0 until 9) g.set(0, y, b(JellyColor.BLUE))   // cột 0 đầy, toàn BLUE
        val r = resolve(g, Direction.DOWN)
        val sf = r.events.filterIsInstance<ResolveEvent.SuperFormed>().single()
        assertEquals(SuperSource.COLUMN, sf.source)
        assertEquals(Vec(0, 4), sf.at)
        assertEquals(18, r.totalScore)
    }

    @Test
    fun resolve_monoRowWithSuper1_formsSuper2() {
        val g = Grid()
        for (x in 0 until 9) g.set(x, 8, b(JellyColor.PINK))
        g.set(0, 8, sup(JellyColor.PINK))     // 1 ô trong hàng là super-1 → đường đơn sắc → cấp 2
        val r = resolve(g, Direction.DOWN)
        val sf = r.events.filterIsInstance<ResolveEvent.SuperFormed>().single()
        assertEquals(2, sf.level)
        assertEquals(18, r.totalScore)
    }

    @Test
    fun findMonoLineSuper_mixedRow_null() {
        val g = Grid()
        for (x in 0 until 9) g.set(x, 8, b(palette[x % 4]))   // hàng đầy nhưng nhiều màu
        assertNull(findMonoLineSuper(g))
    }

    // ── điểm + combo khi GHÉP (3×3 / cầu vồng) ─────────────────────────────────

    @Test
    fun resolve_3x3Merge_addsScoreAndCombo() {
        val g = Grid()
        fill3x3(g, 3, 3, List(9) { JellyColor.MINT })
        val r = resolve(g, Direction.DOWN)
        val sf = r.events.filterIsInstance<ResolveEvent.SuperFormed>().single()
        assertEquals(9, sf.score)             // 9 ô × combo 1 × 1
        assertEquals(1, sf.comboLevel)
        assertEquals(9, r.totalScore)
        assertEquals(1, r.endCombo)
    }

    @Test
    fun resolve_rainbowMerge_addsScoreAndCombo() {
        val g = Grid()
        fill3x3Cols(g, 3, 3, JellyColor.MINT, JellyColor.PINK, JellyColor.BLUE)
        val r = resolve(g, Direction.DOWN)
        val rf = r.events.filterIsInstance<ResolveEvent.RainbowFormed>().single()
        assertEquals(9, rf.score)
        assertEquals(1, rf.comboLevel)
        assertEquals(1, r.endCombo)
    }

    @Test
    fun resolve_twoSuper1_formSuper2() {
        val g = Grid()
        g.set(3, 4, sup(JellyColor.MINT)); g.set(4, 4, sup(JellyColor.MINT))
        val r = resolve(g, Direction.DOWN)
        val sf = r.events.filterIsInstance<ResolveEvent.SuperFormed>().single()
        assertEquals(2, sf.level)
        assertEquals(1, countWhere(g) { it.superLevel == 2 })
    }

    @Test
    fun resolve_3x3MonoWithSuper1_formsSuper2() {
        // bọc 1 super-1 hồng bằng 8 ô hồng thường (3×3) → super-2 (cách (b))
        val g = Grid()
        fill3x3(g, 3, 3, List(9) { JellyColor.PINK })
        g.set(3, 3, sup(JellyColor.PINK))
        val r = resolve(g, Direction.DOWN)
        assertTrue(r.formedSuper)
        val sf = r.events.filterIsInstance<ResolveEvent.SuperFormed>().single()
        assertEquals(2, sf.level)
        assertEquals(JellyColor.PINK, sf.color)
        assertEquals(1, countWhere(g) { it.superLevel == 2 })
        assertEquals(1, countOccupied(g))
    }

    @Test
    fun resolve_twoSuper1DifferentColors_formRainbowSuper2() {
        val g = Grid()
        g.set(3, 4, sup(JellyColor.MINT)); g.set(4, 4, sup(JellyColor.PINK))
        val r = resolve(g, Direction.DOWN)
        val rf = r.events.filterIsInstance<ResolveEvent.RainbowFormed>().single()
        assertEquals(2, rf.level)
        assertEquals(1, countWhere(g) { it.rainbow && it.superLevel == 2 })
        assertEquals(1, countOccupied(g))   // gộp 2 ô → 1 cầu vồng siêu cấp
    }

    // ── nổ ──────────────────────────────────────────────────────────────────────

    @Test
    fun expandDetonations_super1_clearsAllSameColorBoardWide() {
        val g = Grid()
        g.set(4, 4, sup(JellyColor.MINT))   // siêu khối cấp 1 (mint)
        g.set(0, 0, b(JellyColor.MINT))     // mint ở góc xa → bị quét
        g.set(8, 8, b(JellyColor.MINT))     // mint ở góc đối → bị quét
        g.set(1, 1, b(JellyColor.PINK))     // khác màu → GIỮ
        g.set(7, 2, b(JellyColor.BLUE))     // khác màu → GIỮ
        val (toClear, dets) = expandDetonations(g, setOf(Vec(4, 4)))
        assertEquals(1, dets.size)
        assertEquals(1, dets[0].level)
        assertTrue(Vec(4, 4) in toClear)
        assertTrue(Vec(0, 0) in toClear)
        assertTrue(Vec(8, 8) in toClear)
        assertFalse(Vec(1, 1) in toClear)
        assertFalse(Vec(7, 2) in toClear)
        // footprint chỉ gồm 3 ô mint
        assertEquals(3, dets[0].cells.size)
    }

    @Test
    fun resolve_clearLineThroughSuper1_clearsAllSameColor() {
        val g = Grid()
        g.set(4, 4, sup(JellyColor.MINT))
        g.set(0, 0, b(JellyColor.MINT))     // mint xa khỏi hàng xóa → vẫn bị quét
        // hàng 4 đầy (mixed, KHÔNG mint ngoài tâm) → kích nổ super-1 trong hàng
        for (x in 0 until 9) if (x != 4) g.set(x, 4, b(if (x % 2 == 0) JellyColor.PINK else JellyColor.BLUE))
        val r = resolve(g, Direction.DOWN)
        val det = r.events.filterIsInstance<ResolveEvent.SuperDetonated>().single()
        assertEquals(1, det.level)
        assertNull(g.get(0, 0))             // mint góc đã bị quét
        assertNull(g.get(4, 4))
    }

    @Test
    fun resolve_clearLineThroughRainbow_emitsRainbowDetonationEvent() {
        val g = Grid()
        g.set(4, 4, rb())                   // cầu vồng giữa hàng 4
        // hàng 4 đầy quanh cầu vồng (mixed, KHÔNG ghép được) → cuốn cầu vồng vào nổ
        for (x in 0 until 9) if (x != 4) g.set(x, 4, b(if (x % 2 == 0) JellyColor.PINK else JellyColor.BLUE))
        val r = resolve(g, Direction.DOWN)
        // event mang cờ isRainbow để lớp vỏ phân biệt nổ cầu vồng ↔ nổ siêu khối
        val det = r.events.filterIsInstance<ResolveEvent.SuperDetonated>().single { it.isRainbow }
        assertEquals(0, det.level)
    }

    @Test
    fun expandDetonations_super2_clearsSameColorPlus5x5() {
        val g = Grid()
        g.set(4, 4, sup(JellyColor.MINT, level = 2))
        g.set(8, 8, b(JellyColor.MINT))     // cùng màu xa → quét (luật cùng màu)
        g.set(3, 3, b(JellyColor.PINK))     // khác màu, trong 5×5 (4±2) → quét (vùng 5×5)
        g.set(6, 6, b(JellyColor.PINK))     // khác màu, mép 5×5 → quét
        g.set(0, 0, b(JellyColor.PINK))     // khác màu, ngoài 5×5 → GIỮ
        val (toClear, dets) = expandDetonations(g, setOf(Vec(4, 4)))
        assertEquals(2, dets[0].level)
        assertTrue(Vec(8, 8) in toClear)    // same-color far
        assertTrue(Vec(3, 3) in toClear)    // 5×5 other color
        assertTrue(Vec(6, 6) in toClear)
        assertFalse(Vec(0, 0) in toClear)   // far other color → giữ
    }

    @Test
    fun expandDetonations_rainbow_clearsAdjacentColorsOnly() {
        val g = Grid()
        g.set(4, 4, rb())                       // cầu vồng giữa
        g.set(4, 3, b(JellyColor.MINT))         // kề trên → MINT
        g.set(4, 5, b(JellyColor.PINK))         // kề dưới → PINK (kề trái/phải trống)
        g.set(0, 0, b(JellyColor.MINT))         // MINT xa → quét (cùng màu kề)
        g.set(8, 8, b(JellyColor.PINK))         // PINK xa → quét
        g.set(1, 1, b(JellyColor.BLUE))         // BLUE không kề → GIỮ
        val (toClear, dets) = expandDetonations(g, setOf(Vec(4, 4)))
        assertEquals(1, dets.size)
        assertTrue(dets[0].isRainbow)
        assertTrue(Vec(4, 4) in toClear)        // chính cầu vồng
        assertTrue(Vec(0, 0) in toClear)        // mint xa
        assertTrue(Vec(8, 8) in toClear)        // pink xa
        assertFalse(Vec(1, 1) in toClear)       // blue không kề → giữ
    }

    @Test
    fun expandDetonations_rainbowSuper2_clearsEntireBoard() {
        val g = Grid()
        g.set(4, 4, rbSuper())                  // cầu vồng siêu cấp (kỹ năng tối thượng)
        g.set(0, 0, b(JellyColor.MINT))
        g.set(8, 8, b(JellyColor.PINK))
        g.set(2, 6, b(JellyColor.BLUE))
        g.set(7, 1, Grid.Cell(CellType.STONE))  // kể cả đá cũng bị quét sạch
        val occupied = countOccupied(g)
        val (toClear, dets) = expandDetonations(g, setOf(Vec(4, 4)))
        assertTrue(dets.any { it.isRainbow && it.level == 2 })
        assertEquals(occupied, toClear.size)    // TOÀN BỘ ô có nội dung bị quét
        assertTrue(Vec(0, 0) in toClear)
        assertTrue(Vec(8, 8) in toClear)
        assertTrue(Vec(2, 6) in toClear)
        assertTrue(Vec(7, 1) in toClear)
        assertTrue(Vec(4, 4) in toClear)
    }

    @Test
    fun expandDetonations_rainbowNoColoredNeighbor_noSweep() {
        val g = Grid()
        g.set(4, 4, rb())                       // cầu vồng cô lập (không màu kề)
        g.set(0, 0, b(JellyColor.MINT))
        val (toClear, dets) = expandDetonations(g, setOf(Vec(4, 4)))
        assertTrue(dets.isEmpty())              // không màu kề → không quét
        assertFalse(Vec(0, 0) in toClear)
    }

    @Test
    fun expandDetonations_super1Alone_clearsOnlyItself() {
        val g = Grid()
        g.set(0, 0, sup(JellyColor.PINK))
        val (toClear, dets) = expandDetonations(g, setOf(Vec(0, 0)))
        assertEquals(1, dets.size)
        assertEquals(1, dets[0].cells.size)   // chỉ chính nó (không còn pink nào khác)
        assertTrue(Vec(0, 0) in toClear)
    }

    // ── combo khi NỔ (hiển thị ×N lúc flash) ─────────────────────────────────────

    /** Làm đầy hàng [y] để kích nổ detonator ở (4,y); các ô khác màu xen kẽ (tránh mono/cùng màu detonator). */
    private fun fillRowExcept(g: Grid, y: Int, skipX: Int) {
        for (x in 0 until 9) if (x != skipX) g.set(x, y, b(if (x % 2 == 0) JellyColor.PINK else JellyColor.BLUE))
    }

    @Test
    fun resolve_detonateSuper1_comboPlus2_cumulative() {
        val g = Grid()
        g.set(4, 4, sup(JellyColor.MINT)); fillRowExcept(g, 4, 4)
        val lc = resolve(g, Direction.DOWN, startCombo = 0).events
            .filterIsInstance<ResolveEvent.LinesCleared>().first()
        assertEquals(2, lc.comboLevel)                  // super-1 nổ = +2

        val g2 = Grid()
        g2.set(4, 4, sup(JellyColor.MINT)); fillRowExcept(g2, 4, 4)
        val lc2 = resolve(g2, Direction.DOWN, startCombo = 3).events
            .filterIsInstance<ResolveEvent.LinesCleared>().first()
        assertEquals(5, lc2.comboLevel)                 // cộng dồn 3 + 2
    }

    @Test
    fun resolve_detonateSuper2_comboPlus5() {
        val g = Grid()
        g.set(4, 4, sup(JellyColor.MINT, level = 2)); fillRowExcept(g, 4, 4)
        val lc = resolve(g, Direction.DOWN, startCombo = 0).events
            .filterIsInstance<ResolveEvent.LinesCleared>().first()
        assertEquals(5, lc.comboLevel)
    }

    @Test
    fun resolve_detonateRainbow_comboPlus2PerAdjacentColor() {
        val g = Grid()
        g.set(4, 4, rb())
        g.set(3, 4, b(JellyColor.MINT)); g.set(5, 4, b(JellyColor.PINK))    // kề trong hàng
        g.set(4, 3, b(JellyColor.BLUE)); g.set(4, 5, b(JellyColor.YELLOW))  // kề trên/dưới → 4 màu
        g.set(0, 4, b(JellyColor.MINT)); g.set(1, 4, b(JellyColor.PINK)); g.set(2, 4, b(JellyColor.BLUE))
        g.set(6, 4, b(JellyColor.YELLOW)); g.set(7, 4, b(JellyColor.MINT)); g.set(8, 4, b(JellyColor.PINK))
        val lc = resolve(g, Direction.DOWN, startCombo = 0).events
            .filterIsInstance<ResolveEvent.LinesCleared>().first()
        assertEquals(8, lc.comboLevel)                  // 4 màu kề × 2
    }

    @Test
    fun resolve_detonateRainbowSuper2_comboPlus9() {
        val g = Grid()
        g.set(4, 4, rbSuper()); fillRowExcept(g, 4, 4)
        g.set(0, 0, b(JellyColor.YELLOW))               // ô xa → vẫn bị xoá sạch (combo vẫn = 9)
        val lc = resolve(g, Direction.DOWN, startCombo = 1).events
            .filterIsInstance<ResolveEvent.LinesCleared>().first()
        assertEquals(10, lc.comboLevel)                 // cộng dồn 1 + 9
    }

    // ── deterministic ──────────────────────────────────────────────────────────

    @Test
    fun golden_super1FormThenDetonate_deterministic() {
        fun scenario(): Triple<Int, Int, List<ResolveEvent>> {
            val g = Grid()
            g.set(4, 4, sup(JellyColor.MINT))
            for (x in 0 until 9) if (x != 4) g.set(x, 4, b(palette[(x + 2) % 4]))
            val r = resolve(g, Direction.DOWN)
            return Triple(r.totalScore, r.endCombo, r.events)
        }
        val (s1, c1, e1) = scenario()
        val (s2, c2, e2) = scenario()
        assertEquals(s1, s2)
        assertEquals(c1, c2)
        assertEquals(e1.size, e2.size)
        for (i in e1.indices) assertEquals("event[$i]", e1[i], e2[i])
    }
}
