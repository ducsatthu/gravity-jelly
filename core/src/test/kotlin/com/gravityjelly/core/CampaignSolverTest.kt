package com.gravityjelly.core

import org.junit.Test

class CampaignSolverTest {

    private val solver = CampaignSolver()

    @Test
    fun `solve L1 single run`() {
        val result = solver.solve(CampaignLevels.L1)
        println("L1: won=${result.won} moves=${result.moves} score=${result.score} trigger=${result.triggerHit}")
        assert(result.won) { "Bot should win L1 (tutorial row)" }
    }

    @Test
    fun `solve L2 single run`() {
        val result = solver.solve(CampaignLevels.L2)
        println("L2: won=${result.won} moves=${result.moves} score=${result.score} trigger=${result.triggerHit}")
        assert(result.won) { "Bot should win L2 (tutorial col)" }
    }

    @Test
    fun `solve all W1 levels`() {
        val levels = CampaignLevels.ALL.filter { it.world == 1 }
        for (level in levels) {
            val result = solver.solve(level)
            println("L${level.id} \"${level.name}\": won=${result.won} moves=${result.moves} score=${result.score} combo=${result.maxCombo} rots=${result.rotationsUsed} trigger=${result.triggerHit}")
        }
    }

    @Test
    fun `batch W1 all levels`() {
        val levels = CampaignLevels.ALL.filter { it.world == 1 }
        for (level in levels) {
            val batch = solver.solveBatch(level, seeds = 50)
            println(batch)
            println()
        }
    }

    @Test
    fun `batch W2 all levels`() {
        val levels = CampaignLevels.ALL.filter { it.world == 2 }
        for (level in levels) {
            val batch = solver.solveBatch(level, seeds = 50)
            println(batch)
            println()
        }
    }

    @Test
    fun `batch W3 all levels`() {
        val levels = CampaignLevels.ALL.filter { it.world == 3 }
        for (level in levels) {
            val batch = solver.solveBatch(level, seeds = 50)
            println(batch)
            println()
        }
    }

    @Test
    fun `comboDamage calculation`() {
        assert(CampaignSolver.calcComboDamage(0, 0) == 0)
        assert(CampaignSolver.calcComboDamage(0, 1) == 0)
        assert(CampaignSolver.calcComboDamage(0, 2) == 1)
        assert(CampaignSolver.calcComboDamage(0, 3) == 3)   // 1+2
        assert(CampaignSolver.calcComboDamage(0, 4) == 6)   // 1+2+3
        assert(CampaignSolver.calcComboDamage(2, 4) == 5)   // 2+3
        assert(CampaignSolver.calcComboDamage(3, 5) == 7)   // 3+4
    }
}
