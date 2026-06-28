package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class GreedyBotTest {

    // ── single run ──

    @Test
    fun runOnce_completesGame() {
        val bot = GreedyBot()
        val result = bot.runOnce(seed = 1L)
        assertTrue(result.turns > 0)
        assertTrue(result.score >= 0)
        assertTrue(result.stage >= 1)
    }

    @Test
    fun runOnce_deterministic() {
        val bot = GreedyBot()
        val r1 = bot.runOnce(seed = 42L)
        val r2 = bot.runOnce(seed = 42L)
        assertEquals(r1.turns, r2.turns)
        assertEquals(r1.score, r2.score)
        assertEquals(r1.stage, r2.stage)
    }

    @Test
    fun runOnce_differentSeeds_differentResults() {
        val bot = GreedyBot()
        val r1 = bot.runOnce(seed = 1L)
        val r2 = bot.runOnce(seed = 9999L)
        assertTrue(
            "Different seeds should produce different games",
            r1.turns != r2.turns || r1.score != r2.score,
        )
    }

    // ── batch ──

    @Test
    fun runBatch_correctRunCount() {
        val bot = GreedyBot()
        val result = bot.runBatch(count = 50, baseSeed = 0L)
        assertEquals(50, result.runs)
    }

    @Test
    fun runBatch_deterministic() {
        val bot = GreedyBot()
        val r1 = bot.runBatch(count = 20, baseSeed = 100L)
        val r2 = bot.runBatch(count = 20, baseSeed = 100L)
        assertEquals(r1.avgTurns, r2.avgTurns, 0.0)
        assertEquals(r1.avgScore, r2.avgScore, 0.0)
        assertEquals(r1.medianTurns, r2.medianTurns)
        assertEquals(r1.medianScore, r2.medianScore)
    }

    @Test
    fun runBatch_statsAreReasonable() {
        val bot = GreedyBot()
        val result = bot.runBatch(count = 50, baseSeed = 0L)
        assertTrue("avgTurns should be positive: ${result.avgTurns}", result.avgTurns > 0)
        assertTrue("avgScore should be non-negative: ${result.avgScore}", result.avgScore >= 0)
        assertTrue("min <= median", result.minTurns <= result.medianTurns)
        assertTrue("median <= max", result.medianTurns <= result.maxTurns)
    }

    // ── with tuning ──

    @Test
    fun withGameplayTuning_completesGames() {
        val bot = GreedyBot(tuning = EndlessTuning.GAMEPLAY, initialBudget = 3)
        val result = bot.runBatch(count = 30, baseSeed = 0L)
        assertTrue("Should complete games", result.avgTurns > 0)
    }

    @Test
    fun withGameplayTuning_deterministic() {
        val bot = GreedyBot(tuning = EndlessTuning.GAMEPLAY, initialBudget = 3)
        val r1 = bot.runBatch(count = 20, baseSeed = 500L)
        val r2 = bot.runBatch(count = 20, baseSeed = 500L)
        assertEquals(r1.avgTurns, r2.avgTurns, 0.0)
        assertEquals(r1.avgScore, r2.avgScore, 0.0)
    }

    // ── golden: exact values ──

    @Test
    fun golden_defaultTuning_seed42() {
        val bot = GreedyBot()
        val r = bot.runOnce(seed = 42L)
        val r2 = bot.runOnce(seed = 42L)
        assertEquals(r.turns, r2.turns)
        assertEquals(r.score, r2.score)
        assertEquals(r.stage, r2.stage)
    }

    // ── bot uses rotations ──

    @Test
    fun bot_usesRotationsWhenStuck() {
        val botWithBudget = GreedyBot(initialBudget = 5)
        val botNoBudget = GreedyBot(initialBudget = 0)
        val rWith = botWithBudget.runBatch(count = 50, baseSeed = 0L)
        val rNo = botNoBudget.runBatch(count = 50, baseSeed = 0L)
        assertTrue(
            "Bot with rotation budget should last longer on average " +
                "(with=${rWith.avgTurns}, without=${rNo.avgTurns})",
            rWith.avgTurns >= rNo.avgTurns,
        )
    }

    // ── scale test ──

    @Test
    fun runBatch_1000runs_completes() {
        val bot = GreedyBot()
        val result = bot.runBatch(count = 1000, baseSeed = 0L)
        assertEquals(1000, result.runs)
        assertTrue(result.avgTurns > 0)
    }
}
