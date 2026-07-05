package com.gravityjelly.core

import org.junit.Test

/**
 * Runner (KHÔNG phải test khẳng định) — chạy [MoveSolver] trên World 3 (L21-L30) để đo **số nước ngắn
 * nhất**, làm cơ sở đặt ngưỡng sao. Ghi kết quả ra `core/build/solver-w3.txt` + in stdout.
 * Chạy: `./gradlew :core:test --tests "*SolveWorld3Test"`.
 */
class SolveWorld3Test {

    @Test
    fun solveWorld3() {
        val solver = MoveSolver()
        val batchSolver = CampaignSolver()
        val seeds = 40
        val sb = StringBuilder()
        sb.appendLine("World 3 · Dòng chảy — số nước MIN (MoveSolver tối ưu) & MAX (greedy $seeds seed)")
        sb.appendLine("=".repeat(100))
        sb.appendLine("Màn            | MIN | MAX | goal            | 3★ | winRate")
        sb.appendLine("-".repeat(100))
        var overallMin = Int.MAX_VALUE; var overallMax = 0
        for (l in CampaignLevels.ALL.filter { it.world == 3 }) {
            val min = solver.solve(l).moves                       // số nước ngắn nhất (tối ưu)
            val batch = batchSolver.solveBatch(l, seeds)          // greedy nhiều seed → phân bố nước thắng
            val wins = batch.movesList
            val max = if (wins.isEmpty()) -1 else wins.max()
            if (min in 1..overallMin) overallMin = min
            if (max > overallMax) overallMax = max
            sb.appendLine(
                "L${l.id} ${l.name.padEnd(11)} | ${"%3d".format(min)} | ${"%3d".format(max)} | " +
                    "${l.goal.type.name.padEnd(15)} | ${"%2d".format(l.stars.three)} | " +
                    "${"%.0f".format(batch.winRate * 100)}%",
            )
        }
        sb.appendLine("-".repeat(100))
        sb.appendLine("TỔNG World 3: nước tối thiểu = $overallMin (ngắn nhất), nước tối đa = $overallMax (ván greedy dài nhất thắng)")
        sb.appendLine("Ghi chú: MIN = lời giải tối ưu (đặt ngưỡng 3★). MAX = ván greedy DÀI NHẤT còn thắng trong $seeds seed")
        sb.appendLine("         (KHÔNG phải trần tuyệt đối — chơi dở hơn vẫn có thể dài hơn / thua).")
        val out = sb.toString()
        java.io.File("build/solver-w3.txt").apply { parentFile.mkdirs(); writeText(out) }
        println(out)
    }
}
