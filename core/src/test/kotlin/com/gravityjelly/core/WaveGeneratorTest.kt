package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class WaveGeneratorTest {

    private val pool = PieceLibrary.ALL
    private val colors = JellyColor.entries
    private val cfg = AntiDroughtConfig()

    private fun block(color: JellyColor = JellyColor.YELLOW) = Grid.Cell(CellType.BLOCK, color)

    /** Lấp đầy hàng [rows] và (một phần) hàng 6 để đạt ĐỘ ĐẦY mong muốn; chừa cột [openCol] rỗng ở hàng 6..8. */
    private fun nearlyFullBoard(openCol: Int = 8): Grid {
        val g = Grid()
        for (y in 0..5) for (x in 0 until g.size) g.set(x, y, block())
        for (x in 0..4) g.set(x, 6, block())          // 54 + 5 = 59 ô → ~0.728 ⇒ bậc ĐỎ
        // Cột openCol giữ rỗng ở 6..8 để I3V lấp kín được → clear cột.
        return g
    }

    // ── isLineClearing ──

    @Test
    fun isLineClearing_trueWhenPieceCompletesColumn() {
        val g = nearlyFullBoard(openCol = 8)
        // I3V (dọc 3) tại cột 8 hàng 6,7,8 → cột 8 đầy → clear.
        assertTrue(WaveGenerator.isLineClearing(g, Piece(PieceLibrary.I3V, JellyColor.PINK)))
    }

    @Test
    fun isLineClearing_falseOnEmptyBoard() {
        // Bàn trống: không mảnh nào lấp kín được cả 1 dòng 9 ô.
        assertFalse(WaveGenerator.isLineClearing(Grid(), Piece(PieceLibrary.I5H, JellyColor.YELLOW)))
    }

    @Test
    fun isLineClearing_ignoresColor() {
        val g = nearlyFullBoard()
        val a = WaveGenerator.isLineClearing(g, Piece(PieceLibrary.I3V, JellyColor.BLUE))
        val b = WaveGenerator.isLineClearing(g, Piece(PieceLibrary.I3V, JellyColor.MINT))
        assertEquals(a, b)
    }

    // ── deal: determinism ──

    @Test
    fun deal_deterministicSameSeed() {
        val g = nearlyFullBoard()
        val w1 = WaveGenerator.deal(g, pool, colors, Rng(42L), cfg, forceHelpful = false)
        val w2 = WaveGenerator.deal(g, pool, colors, Rng(42L), cfg, forceHelpful = false)
        assertEquals(w1.pieces, w2.pieces)
        assertEquals(w1.tier, w2.tier)
        assertEquals(w1.hadHelpful, w2.hadHelpful)
    }

    // ── deal: bốc-thường combo-friendly (nghiêng mảnh nhỏ, KHÔNG có khối đặc biệt khi chưa ép) ──

    @Test
    fun deal_normalPick_isDeterministicAndHasNoSpecialWithoutForce() {
        val g = Grid() // trống → 🟢
        val w1 = WaveGenerator.deal(g, pool, colors, Rng(7L), cfg, forceHelpful = false, forceSpecial = false)
        val w2 = WaveGenerator.deal(g, pool, colors, Rng(7L), cfg, forceHelpful = false, forceSpecial = false)
        assertEquals(WaveGenerator.Tier.GREEN, w1.tier)
        assertEquals(w1.pieces, w2.pieces)                              // deterministic
        // Bốc-thường trọng số 0 cho khối đặc biệt → không đợt nào tự nhiên chứa pentomino/3×3/chéo.
        assertFalse(w1.hadSpecial)
        assertTrue(w1.pieces.none { it.shape in PieceLibrary.SPECIAL })
        // Nghiêng mảnh nhỏ: mọi mảnh ≤ 4 ô.
        assertTrue(w1.pieces.all { it.shape.size <= 4 })
    }

    // ── deal: chèn khối ĐẶC BIỆT khi tới hạn (đủ 24 loại) ──

    @Test
    fun deal_forceSpecial_injectsSpecialPiece() {
        val g = Grid() // trống → mọi khối đặc biệt đặt-được
        val wave = WaveGenerator.deal(g, pool, colors, Rng(11L), cfg, forceHelpful = false, forceSpecial = true)
        assertTrue("forceSpecial phải chèn 1 khối đặc biệt", wave.hadSpecial)
        assertTrue(wave.pieces.any { it.shape in PieceLibrary.SPECIAL })
    }

    // ── deal: bậc 🔴 ép có mảnh thoát ──

    @Test
    fun deal_redTier_guaranteesEscape() {
        val g = nearlyFullBoard(openCol = 8)
        val wave = WaveGenerator.deal(g, pool, colors, Rng(3L), cfg, forceHelpful = false)
        assertEquals(WaveGenerator.Tier.RED, wave.tier)
        assertTrue("Đợt bậc đỏ phải có ≥1 mảnh thoát", wave.hadHelpful)
        assertTrue(wave.pieces.any { WaveGenerator.isLineClearing(g, it) })
    }

    @Test
    fun deal_allPiecesPlaceable_onCrowdedBoard() {
        val g = nearlyFullBoard()
        val wave = WaveGenerator.deal(g, pool, colors, Rng(9L), cfg, forceHelpful = false)
        assertTrue(wave.pieces.all { canFreePlaceAnywhere(g, it) })
    }

    // ── findLineClearingPiece ──

    @Test
    fun findLineClearingPiece_nullWhenNoLineCompletable() {
        assertNull(WaveGenerator.findLineClearingPiece(Grid(), pool, colors, Rng(1L)))
    }

    @Test
    fun findLineClearingPiece_foundWhenCompletable() {
        val g = nearlyFullBoard()
        val p = WaveGenerator.findLineClearingPiece(g, pool, colors, Rng(1L))
        assertNotNull(p)
        assertTrue(WaveGenerator.isLineClearing(g, p!!))
    }

    // ── engine integration ──

    /** Greedy: đặt tự do mảnh đầu tiên vừa chỗ (quét ox/oy), lặp tới khi kẹt hoặc hết lượt an toàn. */
    private fun playGreedy(e: EndlessEngine, steps: Int) {
        var safety = steps
        while (!e.state().isGameOver && safety-- > 0) {
            val s = e.state()
            var placed = false
            loop@ for (i in s.tray.indices) {
                val piece = s.tray[i] ?: continue
                for (oy in 0..(Grid.SIZE - piece.shape.height))
                    for (ox in 0..(Grid.SIZE - piece.shape.width))
                        if (e.placePieceAt(i, ox, oy).isNotEmpty()) { placed = true; break@loop }
            }
            if (!placed) break
        }
    }

    @Test
    fun engine_antiDrought_deterministic() {
        val t = EndlessTuning(antiDrought = AntiDroughtConfig())
        val e1 = EndlessEngine(seed = 42L, initialBudget = 0, tuning = t)
        val e2 = EndlessEngine(seed = 42L, initialBudget = 0, tuning = t)
        playGreedy(e1, 200)
        playGreedy(e2, 200)
        val s1 = e1.state(); val s2 = e2.state()
        assertEquals(s1.tray, s2.tray)
        assertEquals(s1.score, s2.score)
        assertEquals(s1.stage, s2.stage)
        for (y in 0 until Grid.SIZE) for (x in 0 until Grid.SIZE)
            assertEquals("($x,$y)", s1.grid.get(x, y), s2.grid.get(x, y))
    }

    @Test
    fun engine_antiDroughtOff_isDefault() {
        // Mặc định TẮT → mọi mảnh vẫn được sinh (parity path RNG thuần, không lỗi).
        assertNull(EndlessTuning().antiDrought)
        assertNull(EndlessTuning.GAMEPLAY.antiDrought)
    }
}
