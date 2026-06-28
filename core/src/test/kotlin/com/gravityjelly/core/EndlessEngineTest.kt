package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class EndlessEngineTest {

    private fun countOccupied(g: Grid): Int {
        var n = 0
        for (y in 0 until g.size) for (x in 0 until g.size)
            if (g.get(x, y) != null) n++
        return n
    }

    private fun gridsEqual(a: Grid, b: Grid): Boolean {
        for (y in 0 until a.size) for (x in 0 until a.size)
            if (a.get(x, y) != b.get(x, y)) return false
        return true
    }

    // ── initial state ──

    @Test
    fun initialState_emptyGrid() {
        val e = EndlessEngine(seed = 1L)
        val s = e.state()
        assertEquals(0, countOccupied(s.grid))
    }

    @Test
    fun initialState_gravityDown() {
        val s = EndlessEngine(seed = 1L).state()
        assertEquals(Direction.DOWN, s.gravity)
    }

    @Test
    fun initialState_trayHas3Pieces() {
        val s = EndlessEngine(seed = 1L).state()
        assertEquals(3, s.tray.size)
    }

    @Test
    fun initialState_scoreZero() {
        val s = EndlessEngine(seed = 1L).state()
        assertEquals(0, s.score)
        assertEquals(0, s.combo)
    }

    @Test
    fun initialState_notGameOver() {
        assertFalse(EndlessEngine(seed = 1L).state().isGameOver)
    }

    @Test
    fun initialState_budgetMatchesDefault() {
        val s = EndlessEngine(seed = 1L).state()
        assertEquals(EndlessEngine.DEFAULT_ROTATION_BUDGET, s.rotationBudget)
    }

    @Test
    fun initialState_customBudget() {
        val s = EndlessEngine(seed = 1L, initialBudget = 7).state()
        assertEquals(7, s.rotationBudget)
    }

    @Test
    fun initialState_stage1() {
        assertEquals(1, EndlessEngine(seed = 1L).state().stage)
    }

    // ── placePiece ──

    @Test
    fun placePiece_validPlacement_returnsPiecePlacedEvent() {
        val e = EndlessEngine(seed = 1L)
        val events = e.placePiece(0, 0)
        assertTrue(events.isNotEmpty())
        assertTrue(events.first() is GameEvent.PiecePlaced)
    }

    @Test
    fun placePiece_validPlacement_cellsAppearOnGrid() {
        val e = EndlessEngine(seed = 1L)
        val piece = e.state().tray[0]
        e.placePiece(0, 0)
        assertTrue(countOccupied(e.state().grid) > 0)
    }

    @Test
    fun placePiece_removesPieceFromTray() {
        val e = EndlessEngine(seed = 1L)
        val before = e.state().tray.size
        e.placePiece(0, 0)
        assertEquals(before - 1, e.state().tray.size)
    }

    @Test
    fun placePiece_invalidTrayIndex_noOp() {
        val e = EndlessEngine(seed = 1L)
        val stateBefore = e.state()
        val events = e.placePiece(5, 0)
        assertTrue(events.isEmpty())
        assertEquals(stateBefore.score, e.state().score)
    }

    @Test
    fun placePiece_negativeTrayIndex_noOp() {
        val e = EndlessEngine(seed = 1L)
        val events = e.placePiece(-1, 0)
        assertTrue(events.isEmpty())
    }

    @Test
    fun placePiece_invalidLateral_noOp() {
        val e = EndlessEngine(seed = 1L)
        val events = e.placePiece(0, 99)
        assertTrue(events.isEmpty())
    }

    @Test
    fun placePiece_afterGameOver_noOp() {
        val e = makeGameOverEngine()
        assertTrue(e.state().isGameOver)
        val events = e.placePiece(0, 0)
        assertTrue(events.isEmpty())
    }

    // ── tray dealing ──

    @Test
    fun trayDealt_whenTrayEmpty() {
        val e = EndlessEngine(seed = 1L)
        e.placePiece(0, 0)
        e.placePiece(0, 2)
        val events = e.placePiece(0, 4) // places last piece
        assertTrue(events.any { it is GameEvent.TrayDealt })
        assertEquals(3, e.state().tray.size)
    }

    @Test
    fun trayDealt_incrementsStage() {
        val e = EndlessEngine(seed = 1L)
        assertEquals(1, e.state().stage)
        e.placePiece(0, 0)
        e.placePiece(0, 2)
        e.placePiece(0, 4) // empties tray → deal
        assertEquals(2, e.state().stage)
    }

    // ── rotateGravity ──

    @Test
    fun rotateGravity_changesDirection() {
        val e = EndlessEngine(seed = 1L)
        e.rotateGravity(cw = true)
        assertEquals(Direction.LEFT, e.state().gravity)
    }

    @Test
    fun rotateGravity_decrementsBudget() {
        val e = EndlessEngine(seed = 1L, initialBudget = 5)
        e.rotateGravity(cw = true)
        assertEquals(4, e.state().rotationBudget)
    }

    @Test
    fun rotateGravity_zeroBudget_noOp() {
        val e = EndlessEngine(seed = 1L, initialBudget = 0)
        val events = e.rotateGravity(cw = true)
        assertTrue(events.isEmpty())
        assertEquals(Direction.DOWN, e.state().gravity)
    }

    @Test
    fun rotateGravity_emitsGravityRotatedAndSettled() {
        val e = EndlessEngine(seed = 1L)
        val events = e.rotateGravity(cw = true)
        assertTrue(events[0] is GameEvent.GravityRotated)
        assertTrue(events[1] is GameEvent.Settled)
    }

    @Test
    fun rotateGravity_afterGameOver_noOp() {
        val e = makeGameOverEngine()
        val events = e.rotateGravity(cw = true)
        assertTrue(events.isEmpty())
    }

    // ── scoring ──

    @Test
    fun score_accumulates() {
        val e = EndlessEngine(seed = 100L)
        e.placePiece(0, 0)
        val s1 = e.state().score
        e.placePiece(0, 0)
        // Score should be >= s1 (either same if no clear, or higher if clear)
        assertTrue(e.state().score >= s1)
    }

    // ── game over detection ──

    @Test
    fun gameOver_fullGrid_noBudget() {
        val e = makeGameOverEngine()
        assertTrue(e.state().isGameOver)
    }

    @Test
    fun gameOver_emitsGameOverEvent() {
        val e = EndlessEngine(seed = 1L, initialBudget = 0, tuning = EndlessTuning(superMergeEnabled = false))
        var lastEvents = emptyList<GameEvent>()
        var safety = 400
        while (!e.state().isGameOver && safety-- > 0) {
            val ev = greedyFreePlace(e)
            if (ev.isEmpty()) break
            lastEvents = ev
        }
        assertTrue("Should reach game over", e.state().isGameOver)
        assertTrue("Last events should contain GameOver", lastEvents.last() is GameEvent.GameOver)
    }

    @Test
    fun notGameOver_whenBudgetRemains_andRotationHelps() {
        val e = EndlessEngine(seed = 1L, initialBudget = 5)
        // With an empty grid and budget, should never be game over
        e.placePiece(0, 0)
        assertFalse(e.state().isGameOver)
    }

    // ── state snapshot ──

    @Test
    fun stateSnapshot_isIndependentCopy() {
        val e = EndlessEngine(seed = 1L)
        val s1 = e.state()
        e.placePiece(0, 0)
        val s2 = e.state()

        // s1's grid should be unchanged
        assertEquals(0, countOccupied(s1.grid))
        assertTrue(countOccupied(s2.grid) > 0)
    }

    // ── deterministic ──

    @Test
    fun deterministic_sameScenario_sameResult() {
        fun runScenario(): EndlessState {
            val e = EndlessEngine(seed = 42L, initialBudget = 3)
            e.placePiece(0, 0)
            e.placePiece(0, 3)
            e.placePiece(0, 6)
            e.rotateGravity(cw = true)
            e.placePiece(1, 0)
            return e.state()
        }

        val s1 = runScenario()
        val s2 = runScenario()

        assertEquals(s1.score, s2.score)
        assertEquals(s1.gravity, s2.gravity)
        assertEquals(s1.rotationBudget, s2.rotationBudget)
        assertEquals(s1.tray, s2.tray)
        assertEquals(s1.isGameOver, s2.isGameOver)
        assertEquals(s1.stage, s2.stage)
        assertEquals(s1.combo, s2.combo)
        assertTrue(gridsEqual(s1.grid, s2.grid))
    }

    @Test
    fun deterministic_differentSeeds_differentTrays() {
        val s1 = EndlessEngine(seed = 1L).state()
        val s2 = EndlessEngine(seed = 999L).state()
        // Extremely unlikely to have identical trays
        assertTrue(s1.tray != s2.tray)
    }

    // ── golden test ──

    /**
     * GOLDEN TEST — Fixed seed scenario.
     * Chạy kịch bản cố định với seed 42 → xác minh chính xác state sau mỗi bước.
     * Bảo vệ deterministic khi refactor.
     */
    @Test
    fun golden_fixedSeedScenario() {
        // Golden nền (đặt mảnh + xoay, không clear): tắt merge để giá trị ổn định độc lập
        // cơ chế cụm-≥9 (cụm khác màu giờ tự xóa lấy điểm — có test riêng ở SuperBlockTest).
        val e = EndlessEngine(seed = 42L, initialBudget = 3, tuning = EndlessTuning(superMergeEnabled = false))

        // ── Step 0: initial state ──
        val s0 = e.state()
        assertEquals(3, s0.tray.size)
        assertEquals(Direction.DOWN, s0.gravity)
        assertEquals(0, s0.score)
        assertEquals(3, s0.rotationBudget)
        assertEquals(1, s0.stage)
        assertFalse(s0.isGameOver)
        // Golden: exact tray colors
        assertEquals(JellyColor.MINT, s0.tray[0].color)
        assertEquals(JellyColor.BLUE, s0.tray[1].color)
        assertEquals(JellyColor.MINT, s0.tray[2].color)

        // ── Step 1: place piece 0 at lateral 0 ──
        val ev1 = e.placePiece(0, 0)
        assertTrue(ev1.first() is GameEvent.PiecePlaced)
        val placed1 = ev1.first() as GameEvent.PiecePlaced
        assertEquals(
            listOf(Vec(1, 6), Vec(1, 7), Vec(0, 8), Vec(1, 8)),
            placed1.cells,
        )
        val s1 = e.state()
        assertEquals(2, s1.tray.size)
        assertEquals(0, s1.score)
        assertFalse(s1.isGameOver)

        // ── Step 2: place piece 0 (now BLUE L) at lateral 4 ──
        val ev2 = e.placePiece(0, 4)
        val placed2 = ev2.first() as GameEvent.PiecePlaced
        assertEquals(
            listOf(Vec(4, 6), Vec(4, 7), Vec(4, 8), Vec(5, 8)),
            placed2.cells,
        )
        val s2 = e.state()
        assertEquals(1, s2.tray.size)
        assertEquals(0, s2.score)
        assertFalse(s2.isGameOver)

        // ── Step 3: place last piece (MINT S) at lat 0 → new tray dealt ──
        val ev3 = e.placePiece(0, 0)
        assertTrue(ev3.isNotEmpty())
        assertTrue(ev3.any { it is GameEvent.TrayDealt })
        val s3 = e.state()
        assertEquals(3, s3.tray.size)
        assertEquals(2, s3.stage)
        assertEquals(0, s3.score)
        // Golden: exact new tray colors
        assertEquals(JellyColor.BLUE, s3.tray[0].color)
        assertEquals(JellyColor.YELLOW, s3.tray[1].color)
        assertEquals(JellyColor.BLUE, s3.tray[2].color)

        // ── Step 4: rotate CW ──
        val ev4 = e.rotateGravity(cw = true)
        assertEquals(GameEvent.GravityRotated(Direction.LEFT), ev4[0])
        assertEquals(GameEvent.Settled(true), ev4[1])
        val s4 = e.state()
        assertEquals(Direction.LEFT, s4.gravity)
        assertEquals(2, s4.rotationBudget)
        assertEquals(0, s4.score)
    }

    /**
     * GOLDEN TEST — Deterministic event chain.
     * Two runs of the exact same scenario produce identical event sequences.
     */
    @Test
    fun golden_deterministicEventChain() {
        fun runAndCollectEvents(): List<GameEvent> {
            val e = EndlessEngine(seed = 77L, initialBudget = 2)
            val allEvents = mutableListOf<GameEvent>()
            allEvents.addAll(e.placePiece(0, 0))
            allEvents.addAll(e.placePiece(0, 3))
            allEvents.addAll(e.placePiece(0, 5))
            allEvents.addAll(e.rotateGravity(cw = false))
            allEvents.addAll(e.placePiece(0, 0))
            return allEvents
        }

        val events1 = runAndCollectEvents()
        val events2 = runAndCollectEvents()

        assertEquals(events1.size, events2.size)
        for (i in events1.indices) {
            assertEquals("event[$i]", events1[i], events2[i])
        }
    }

    /**
     * GOLDEN TEST — Play until game over.
     * Greedy strategy: try each tray piece at each lateral, first success wins.
     * Exact turn count and final score must match across runs.
     */
    @Test
    fun golden_playUntilGameOver() {
        fun playGreedy(seed: Long): EndlessState {
            // Golden này khoá riêng nhánh ĐẶT-TỰ-DO không xoay (budget 0); tắt combo-hồi-xoay
            // để không cho ngân sách tự sinh làm thoát thua, và tắt merge siêu khối (merge dọn chỗ
            // khiến greedy không bao giờ bí — mechanic đó có test riêng ở SuperBlockTest).
            val e = EndlessEngine(
                seed = seed,
                initialBudget = 0,
                tuning = EndlessTuning(comboRefundsRotation = false, superMergeEnabled = false),
            )
            var turns = 0
            var safety = 1000
            while (!e.state().isGameOver && safety-- > 0) {
                if (greedyFreePlace(e).isEmpty()) break
                turns++
            }
            // turns nằm trong score/stage; trả state để so sánh sâu.
            return e.state()
        }

        val s1 = playGreedy(seed = 12345L)
        val s2 = playGreedy(seed = 12345L)

        // Golden: exact values for seed 12345, budget 0, greedy free-place strategy.
        // Đặt-tự-do KHÔNG rơi; chỉ cascade khi clear.
        assertEquals(117, s1.score)
        assertTrue("Greedy fill should end game over", s1.isGameOver)

        // Same seed → bit-identical kết quả (deterministic).
        assertEquals(s1.score, s2.score)
        assertEquals(s1.stage, s2.stage)
        assertTrue(gridsEqual(s1.grid, s2.grid))

        // Different seed → khác kết quả (màu/hình mảnh khác → lưới khác dù điểm có thể trùng).
        val s3 = playGreedy(seed = 99999L)
        assertFalse(
            "Different seeds should produce different boards",
            gridsEqual(s1.grid, s3.grid),
        )
    }

    // ── helpers ──

    /**
     * Greedy đặt-tự-do: thử từng mảnh khay tại từng offset (oy,ox) row-major,
     * đặt thành công đầu tiên. Trả về chuỗi sự kiện (rỗng nếu hết chỗ).
     * "Hết chỗ" trùng đúng điều kiện thua free-place ở trọng lực hiện tại.
     */
    private fun greedyFreePlace(e: EndlessEngine): List<GameEvent> {
        val s = e.state()
        for (i in s.tray.indices) {
            val shape = s.tray[i].shape
            for (oy in 0..(Grid.SIZE - shape.height)) {
                for (ox in 0..(Grid.SIZE - shape.width)) {
                    val ev = e.placePieceAt(i, ox, oy)
                    if (ev.isNotEmpty()) return ev
                }
            }
        }
        return emptyList()
    }

    private fun makeGameOverEngine(): EndlessEngine {
        // Merge OFF: kiểm thử THUA độc lập cơ chế siêu khối (siêu khối/nổ dọn chỗ nên khó bí).
        val e = EndlessEngine(seed = 1L, initialBudget = 0, tuning = EndlessTuning(superMergeEnabled = false))
        var safety = 400
        while (!e.state().isGameOver && safety-- > 0) {
            if (greedyFreePlace(e).isEmpty()) break
        }
        return e
    }
}
