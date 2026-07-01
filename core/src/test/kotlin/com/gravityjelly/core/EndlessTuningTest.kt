package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class EndlessTuningTest {

    // ── budgetFor ──

    @Test
    fun budgetFor_stage1_baseBudget() {
        val t = EndlessTuning(baseBudget = 5, budgetDecay = 3)
        assertEquals(5, t.budgetFor(1))
    }

    @Test
    fun budgetFor_decaysOverStages() {
        val t = EndlessTuning(baseBudget = 3, budgetDecay = 5)
        assertEquals(3, t.budgetFor(1))   // (1-1)/5 = 0 → 3-0 = 3
        assertEquals(3, t.budgetFor(5))   // (5-1)/5 = 0 → 3-0 = 3
        assertEquals(2, t.budgetFor(6))   // (6-1)/5 = 1 → 3-1 = 2
        assertEquals(1, t.budgetFor(11))  // (11-1)/5 = 2 → 3-2 = 1
        assertEquals(0, t.budgetFor(16))  // (16-1)/5 = 3 → 3-3 = 0
    }

    @Test
    fun budgetFor_neverBelowMin() {
        val t = EndlessTuning(baseBudget = 3, budgetDecay = 1, budgetMin = 1)
        assertEquals(1, t.budgetFor(100))
    }

    @Test
    fun budgetFor_noDecay() {
        val t = EndlessTuning(baseBudget = 3, budgetDecay = Int.MAX_VALUE)
        assertEquals(3, t.budgetFor(1000))
    }

    // ── poolFor ──

    @Test
    fun poolFor_beforeHardStage_allPieces() {
        val t = EndlessTuning(hardPoolStage = 10)
        assertEquals(PieceLibrary.ALL, t.poolFor(9))
    }

    @Test
    fun poolFor_atHardStage_hardPool() {
        val t = EndlessTuning(hardPoolStage = 10)
        assertEquals(PieceLibrary.HARD, t.poolFor(10))
    }

    @Test
    fun hardPool_hasNoSmallPieces() {
        assertTrue(PieceLibrary.HARD.all { it.size >= 3 })
        assertTrue(PieceLibrary.HARD.size < PieceLibrary.ALL.size)
    }

    // ── stone scattering in engine ──

    @Test
    fun stones_addedAtStoneStartStage() {
        val t = EndlessTuning(stoneStartStage = 2, stoneInterval = 1, stonesPerDrop = 2)
        val e = EndlessEngine(seed = 1L, tuning = t)
        // Play until stage 2 (place all 3 pieces to trigger new tray)
        playUntilStage(e, 2)
        // Stage 2 events should include StonesAdded
        val g = e.state().grid
        var stones = 0
        for (y in 0 until g.size) for (x in 0 until g.size)
            if (g.get(x, y)?.type == CellType.STONE) stones++
        assertEquals(2, stones)
    }

    @Test
    fun stones_notAddedBeforeStartStage() {
        val t = EndlessTuning(stoneStartStage = 5, stoneInterval = 1, stonesPerDrop = 1)
        val e = EndlessEngine(seed = 1L, tuning = t)
        playUntilStage(e, 2)
        val g = e.state().grid
        for (y in 0 until g.size) for (x in 0 until g.size)
            assertNull("No stones at stage 2", g.get(x, y)?.takeIf { it.type == CellType.STONE })
    }

    @Test
    fun stones_respectInterval() {
        val t = EndlessTuning(stoneStartStage = 2, stoneInterval = 2, stonesPerDrop = 1)
        val e = EndlessEngine(seed = 1L, tuning = t)
        playUntilStage(e, 3) // stage 2: stones, stage 3: skip (interval=2)
        val g = e.state().grid
        var stones = 0
        for (y in 0 until g.size) for (x in 0 until g.size)
            if (g.get(x, y)?.type == CellType.STONE) stones++
        assertEquals(1, stones) // only from stage 2, not stage 3
    }

    @Test
    fun stones_emitStonesAddedEvent() {
        val t = EndlessTuning(stoneStartStage = 2, stoneInterval = 1, stonesPerDrop = 1)
        val e = EndlessEngine(seed = 1L, tuning = t)
        val events = playUntilStageCollectingEvents(e, 2)
        assertTrue(events.any { it is GameEvent.StonesAdded })
    }

    @Test
    fun stones_dontMoveWithGravity() {
        val t = EndlessTuning(stoneStartStage = 2, stoneInterval = 1, stonesPerDrop = 3)
        val e = EndlessEngine(seed = 42L, tuning = t)
        playUntilStage(e, 2)
        // Record stone positions
        val stonesBefore = findStones(e.state().grid)
        assertTrue(stonesBefore.isNotEmpty())
        // Rotate gravity
        e.rotateGravity(cw = true)
        val stonesAfter = findStones(e.state().grid)
        assertEquals(stonesBefore.toSet(), stonesAfter.toSet())
    }

    @Test
    fun stones_blockClusterMovement() {
        val g = Grid()
        g.set(4, 4, Grid.Cell(CellType.STONE))
        g.set(4, 0, Grid.Cell(CellType.BLOCK, JellyColor.MINT))
        applyClusterGravity(g, Direction.DOWN)
        // Block stops above stone
        assertEquals(CellType.BLOCK, g.get(4, 3)?.type)
        assertEquals(CellType.STONE, g.get(4, 4)?.type)
    }

    @Test
    fun stones_participateInLineClear() {
        val g = Grid()
        for (x in 0 until 9) {
            if (x == 4) g.set(x, 8, Grid.Cell(CellType.STONE))
            else g.set(x, 8, Grid.Cell(CellType.BLOCK, JellyColor.YELLOW))
        }
        val r = resolve(g, Direction.DOWN)
        assertEquals(9, (r.events[0] as ResolveEvent.LinesCleared).cellsCleared)
        assertNull(g.get(4, 8)) // stone was cleared
    }

    // ── budget replenishment ──

    @Test
    fun replenishBudget_resetsOnNewStage() {
        val t = EndlessTuning(baseBudget = 3, replenishBudget = true)
        val e = EndlessEngine(seed = 1L, initialBudget = 3, tuning = t)
        e.rotateGravity(cw = true)
        assertEquals(2, e.state().rotationBudget)
        playUntilStage(e, 2)
        assertEquals(3, e.state().rotationBudget) // replenished
    }

    @Test
    fun replenishBudget_decaysWithStage() {
        val t = EndlessTuning(baseBudget = 3, budgetDecay = 3, replenishBudget = true)
        val e = EndlessEngine(seed = 1L, initialBudget = 3, tuning = t)
        playUntilStage(e, 4)
        // budgetFor(4) = max(0, 3 - (4-1)/3) = max(0, 3-1) = 2
        assertEquals(2, e.state().rotationBudget)
    }

    @Test
    fun noReplenish_budgetOnlyDecreases() {
        val t = EndlessTuning(replenishBudget = false)
        val e = EndlessEngine(seed = 1L, initialBudget = 3, tuning = t)
        e.rotateGravity(cw = true)
        assertEquals(2, e.state().rotationBudget)
        playUntilStage(e, 2)
        assertEquals(2, e.state().rotationBudget) // NOT replenished
    }

    // ── pool switching ──

    @Test
    fun hardPool_afterThreshold_noSmallPieces() {
        val t = EndlessTuning(hardPoolStage = 2)
        val e = EndlessEngine(seed = 42L, tuning = t)
        playUntilStage(e, 2)
        val tray = e.state().tray
        // All pieces should have size >= 3
        assertTrue(tray.filterNotNull().all { it.shape.size >= 3 })
    }

    // ── GAMEPLAY preset ──

    @Test
    fun gameplayPreset_hasReasonableDefaults() {
        val t = EndlessTuning.GAMEPLAY
        assertEquals(3, t.baseBudget)
        assertEquals(5, t.budgetDecay)
        assertTrue(t.replenishBudget)
        assertEquals(4, t.stoneStartStage)
        assertEquals(8, t.hardPoolStage)
    }

    // ── difficulty is measurable ──

    @Test
    fun tuning_increasesDifficulty_measurable() {
        val easy = GreedyBot(
            tuning = EndlessTuning(),
            initialBudget = 5,
        )
        val hard = GreedyBot(
            tuning = EndlessTuning.GAMEPLAY,
            initialBudget = 3,
        )

        val easyResult = easy.runBatch(100, baseSeed = 1000L)
        val hardResult = hard.runBatch(100, baseSeed = 1000L)

        assertTrue(
            "Hard tuning should produce shorter games on average " +
                "(easy=${easyResult.avgTurns}, hard=${hardResult.avgTurns})",
            hardResult.avgTurns < easyResult.avgTurns,
        )
    }

    // ── deterministic ──

    @Test
    fun tuning_deterministicWithSeed() {
        val t = EndlessTuning.GAMEPLAY
        val e1 = EndlessEngine(seed = 42L, initialBudget = 3, tuning = t)
        val e2 = EndlessEngine(seed = 42L, initialBudget = 3, tuning = t)

        playUntilStage(e1, 5)
        playUntilStage(e2, 5)

        val s1 = e1.state()
        val s2 = e2.state()
        assertEquals(s1.score, s2.score)
        assertEquals(s1.stage, s2.stage)
        assertEquals(s1.rotationBudget, s2.rotationBudget)
        assertEquals(s1.tray, s2.tray)
        assertEquals(s1.isGameOver, s2.isGameOver)
        for (y in 0 until Grid.SIZE) for (x in 0 until Grid.SIZE)
            assertEquals("($x,$y)", s1.grid.get(x, y), s2.grid.get(x, y))
    }

    // ── helpers ──

    private fun playUntilStage(e: EndlessEngine, targetStage: Int) {
        var safety = 500
        while (e.state().stage < targetStage && !e.state().isGameOver && safety-- > 0) {
            val s = e.state()
            var placed = false
            for (i in s.tray.indices) {
                for (lat in 0 until Grid.SIZE) {
                    if (e.placePiece(i, lat).isNotEmpty()) {
                        placed = true
                        break
                    }
                }
                if (placed) break
            }
            if (!placed) break
        }
    }

    private fun playUntilStageCollectingEvents(e: EndlessEngine, targetStage: Int): List<GameEvent> {
        val allEvents = mutableListOf<GameEvent>()
        var safety = 500
        while (e.state().stage < targetStage && !e.state().isGameOver && safety-- > 0) {
            val s = e.state()
            var placed = false
            for (i in s.tray.indices) {
                for (lat in 0 until Grid.SIZE) {
                    val ev = e.placePiece(i, lat)
                    if (ev.isNotEmpty()) {
                        allEvents.addAll(ev)
                        placed = true
                        break
                    }
                }
                if (placed) break
            }
            if (!placed) break
        }
        return allEvents
    }

    private fun findStones(g: Grid): List<Vec> {
        val stones = mutableListOf<Vec>()
        for (y in 0 until g.size) for (x in 0 until g.size)
            if (g.get(x, y)?.type == CellType.STONE) stones.add(Vec(x, y))
        return stones
    }
}
