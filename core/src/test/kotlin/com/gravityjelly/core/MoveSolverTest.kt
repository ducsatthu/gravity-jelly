package com.gravityjelly.core

import org.junit.Test
import kotlin.math.roundToInt

class MoveSolverTest {

    private val solver = MoveSolver()

    /** Ngưỡng sao gợi ý: 3★ = ngắn nhất; bước nới = max(1, round(best*0.35)); 2★=+bước, 1★=+2 bước. */
    private fun stars(best: Int): Triple<Int, Int, Int> {
        val step = maxOf(1, (best * 0.35).roundToInt())
        return Triple(best, best + step, best + 2 * step)
    }

    @Test
    fun `min-moves solve ALL levels`() {
        val out = StringBuilder()
        for (level in CampaignLevels.ALL) {
            val r = solver.solve(level)
            val metric = level.stars.metric
            val cur = level.stars
            val line = StringBuilder(
                "L${level.id} \"${level.name}\" [${level.goal.type}/$metric] won=${r.won} minMoves=${r.moves}"
            )
            if (metric == StarMetric.MOVES && r.won) {
                val (s3, s2, s1) = stars(r.moves)
                line.append("  → GỢI Ý 3★/2★/1★ = $s3/$s2/$s1")
                line.append("  (hiện ${cur.three}/${cur.two}/${cur.one})")
            } else if (metric == StarMetric.MOVES && !r.won) {
                line.append("  ⚠ KHÔNG GIẢI ĐƯỢC")
            }
            out.appendLine(line)
        }
        println(out)
    }
}
