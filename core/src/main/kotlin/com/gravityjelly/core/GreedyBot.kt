package com.gravityjelly.core

class GreedyBot(
    private val tuning: EndlessTuning = EndlessTuning(),
    private val initialBudget: Int = EndlessEngine.DEFAULT_ROTATION_BUDGET,
) {
    data class RunResult(
        val turns: Int,
        val score: Int,
        val stage: Int,
    )

    data class BatchResult(
        val runs: Int,
        val avgTurns: Double,
        val avgScore: Double,
        val avgStage: Double,
        val medianTurns: Int,
        val medianScore: Int,
        val minTurns: Int,
        val maxTurns: Int,
    )

    fun runOnce(seed: Long): RunResult {
        val engine = EndlessEngine(seed = seed, initialBudget = initialBudget, tuning = tuning)
        var turns = 0
        // Trần an toàn: merge siêu khối dọn chỗ liên tục có thể khiến greedy gần như không bao
        // giờ bí (ván vô hạn) → cap để mọi cấu hình luôn dừng, deterministic.
        while (!engine.state().isGameOver && turns < MAX_TURNS) {
            if (tryPlace(engine)) {
                turns++
                continue
            }
            val s = engine.state()
            if (s.rotationBudget > 0) {
                engine.rotateGravity(cw = true)
                if (engine.state().isGameOver) break
                if (tryPlace(engine)) {
                    turns++
                    continue
                }
                engine.rotateGravity(cw = true)
                if (engine.state().isGameOver) break
                if (tryPlace(engine)) {
                    turns++
                    continue
                }
                engine.rotateGravity(cw = true)
                if (engine.state().isGameOver) break
                if (tryPlace(engine)) {
                    turns++
                    continue
                }
            }
            break
        }
        val final_ = engine.state()
        return RunResult(turns, final_.score, final_.stage)
    }

    fun runBatch(count: Int, baseSeed: Long = 0L): BatchResult {
        val results = (0L until count).map { runOnce(baseSeed + it) }
        val sortedTurns = results.map { it.turns }.sorted()
        val sortedScores = results.map { it.score }.sorted()
        return BatchResult(
            runs = count,
            avgTurns = results.map { it.turns.toDouble() }.average(),
            avgScore = results.map { it.score.toDouble() }.average(),
            avgStage = results.map { it.stage.toDouble() }.average(),
            medianTurns = sortedTurns[sortedTurns.size / 2],
            medianScore = sortedScores[sortedScores.size / 2],
            minTurns = sortedTurns.first(),
            maxTurns = sortedTurns.last(),
        )
    }

    companion object {
        /** Trần lượt cho 1 ván bot (chặn ván vô hạn khi merge bật). */
        const val MAX_TURNS = 600
    }

    private fun tryPlace(engine: EndlessEngine): Boolean {
        val s = engine.state()
        for (i in s.tray.indices) {
            for (lat in 0 until Grid.SIZE) {
                if (engine.placePiece(i, lat).isNotEmpty()) return true
            }
        }
        return false
    }
}
