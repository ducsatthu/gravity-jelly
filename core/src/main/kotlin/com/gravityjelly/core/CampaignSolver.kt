package com.gravityjelly.core

/**
 * Bot greedy cho màn Campaign: đánh giá mọi vị trí free-place + xoay trọng lực,
 * chọn nước tối ưu theo heuristic nhận biết mục tiêu (score / targets / combo / boss).
 *
 * Chạy headless trên :core, không cần Android. Dùng để:
 *  1. Kiểm tra tính khả thi (feasibility) của mỗi màn
 *  2. Thu phân bố kết quả → đặt ngưỡng sao / ngân sách xoay / máu boss (§20 goal-system-v2.md)
 */
class CampaignSolver(private val maxTurns: Int = MAX_TURNS) {

    // ── Kết quả 1 lần chạy ──

    data class SolveResult(
        val won: Boolean,
        val moves: Int,
        val score: Int,
        val maxCombo: Int,
        val rotationsUsed: Int,
        val targetsCleared: Int,
        val comboDamage: Int,
        val comboHits: Int,
        val triggerHit: Boolean,
    )

    // ── Kết quả batch ──

    data class BatchResult(
        val levelId: Int,
        val levelName: String,
        val runs: Int,
        val wins: Int,
        val losses: Int,
        val winRate: Double,
        val scores: List<Int>,
        val movesList: List<Int>,
        val comboDamages: List<Int>,
        val rotationsUsed: List<Int>,
        val maxCombos: List<Int>,
        val targetsClearedList: List<Int>,
    ) {
        fun percentile(sorted: List<Int>, p: Int): Int {
            if (sorted.isEmpty()) return 0
            val idx = (sorted.size * p / 100).coerceIn(0, sorted.size - 1)
            return sorted[idx]
        }

        fun recommend(): Recommendations {
            val winScores = scores.sorted()
            val winMoves = movesList.sorted()
            val winComboDmg = comboDamages.sorted()
            val winRots = rotationsUsed.sorted()

            return Recommendations(
                goalScore = percentile(winScores, 25),
                star3Score = percentile(winScores, 75),
                star2Score = percentile(winScores, 50),
                star1Score = percentile(winScores, 25),
                goalMoves = percentile(winMoves, 75),
                star3Moves = percentile(winMoves, 25),
                star2Moves = percentile(winMoves, 50),
                star1Moves = percentile(winMoves, 75),
                rotationBudget = percentile(winRots, 95) + 1,
                bossHP = if (winComboDmg.isNotEmpty())
                    (percentile(winComboDmg, 50) * 0.8).toInt().coerceAtLeast(1)
                else 0,
                star3Combo = if (winComboDmg.isNotEmpty()) percentile(winComboDmg, 75) else 0,
                star2Combo = if (winComboDmg.isNotEmpty()) percentile(winComboDmg, 50) else 0,
                star1Combo = if (winComboDmg.isNotEmpty()) percentile(winComboDmg, 25) else 0,
            )
        }

        override fun toString(): String = buildString {
            appendLine("═══ L$levelId \"$levelName\" ═══")
            appendLine("  Runs: $runs  Wins: $wins  Losses: $losses  WinRate: ${"%.1f".format(winRate * 100)}%")
            if (scores.isNotEmpty()) {
                val s = scores.sorted()
                appendLine("  Score  — min=${s.first()} P25=${percentile(s,25)} P50=${percentile(s,50)} P75=${percentile(s,75)} max=${s.last()}")
            }
            if (movesList.isNotEmpty()) {
                val m = movesList.sorted()
                appendLine("  Moves  — min=${m.first()} P25=${percentile(m,25)} P50=${percentile(m,50)} P75=${percentile(m,75)} max=${m.last()}")
            }
            if (rotationsUsed.isNotEmpty()) {
                val r = rotationsUsed.sorted()
                appendLine("  Rots   — min=${r.first()} P25=${percentile(r,25)} P50=${percentile(r,50)} P75=${percentile(r,75)} P95=${percentile(r,95)} max=${r.last()}")
            }
            if (comboDamages.any { it > 0 }) {
                val c = comboDamages.sorted()
                appendLine("  CmbDmg — min=${c.first()} P25=${percentile(c,25)} P50=${percentile(c,50)} P75=${percentile(c,75)} max=${c.last()}")
            }
            if (maxCombos.isNotEmpty()) {
                val c = maxCombos.sorted()
                appendLine("  MaxCmb — min=${c.first()} P25=${percentile(c,25)} P50=${percentile(c,50)} P75=${percentile(c,75)} max=${c.last()}")
            }
            val rec = recommend()
            appendLine("  ── Recommendations ──")
            appendLine("  RotBudget: ${rec.rotationBudget}")
            if (scores.isNotEmpty())
                appendLine("  Score goal: ${rec.goalScore}  Stars: 3★=${rec.star3Score} 2★=${rec.star2Score} 1★=${rec.star1Score}")
            if (movesList.isNotEmpty())
                appendLine("  Moves goal: ${rec.goalMoves}  Stars: 3★=${rec.star3Moves} 2★=${rec.star2Moves} 1★=${rec.star1Moves}")
            if (comboDamages.any { it > 0 })
                appendLine("  BossHP: ${rec.bossHP}  Stars: 3★≤${rec.star3Combo} 2★≤${rec.star2Combo} 1★≤${rec.star1Combo}")
        }
    }

    data class Recommendations(
        val goalScore: Int,
        val star3Score: Int, val star2Score: Int, val star1Score: Int,
        val goalMoves: Int,
        val star3Moves: Int, val star2Moves: Int, val star1Moves: Int,
        val rotationBudget: Int,
        val bossHP: Int,
        val star3Combo: Int, val star2Combo: Int, val star1Combo: Int,
    )

    // ── API chính ──

    fun solve(level: Level): SolveResult {
        val engine = EndlessEngine.forLevel(level)
        val goal = level.goal
        val tracker = GoalTracker(goal)

        var moves = 0
        var totalRotsUsed = 0

        while (!engine.state().isGameOver && moves < maxTurns) {
            if (tracker.isWon(engine.state())) break

            val state = engine.state()
            val best = findBestMove(state, goal, tracker)

            if (best == null) break

            when (best) {
                is Move.Place -> {
                    val events = engine.placePieceAt(best.trayIndex, best.ox, best.oy)
                    if (events.isEmpty()) break
                    tracker.processEvents(events, engine.state())
                    moves++
                }
                is Move.RotateThenPlace -> {
                    val rotEvents = engine.rotateGravity(best.cw)
                    if (rotEvents.isEmpty()) break
                    totalRotsUsed++
                    tracker.processEvents(rotEvents, engine.state())
                    if (tracker.isWon(engine.state())) break
                    if (engine.state().isGameOver) break

                    val placeEvents = engine.placePieceAt(best.trayIndex, best.ox, best.oy)
                    if (placeEvents.isEmpty()) {
                        // Rotation succeeded but placement failed — still counts
                        break
                    }
                    tracker.processEvents(placeEvents, engine.state())
                    moves++
                }
                is Move.RotateOnly -> {
                    val rotEvents = engine.rotateGravity(best.cw)
                    if (rotEvents.isEmpty()) break
                    totalRotsUsed++
                    tracker.processEvents(rotEvents, engine.state())
                }
            }
        }

        val finalState = engine.state()
        return SolveResult(
            won = tracker.isWon(finalState),
            moves = moves,
            score = finalState.score,
            maxCombo = tracker.maxCombo,
            rotationsUsed = totalRotsUsed,
            targetsCleared = tracker.targetsCleared,
            comboDamage = tracker.comboDamage,
            comboHits = tracker.comboHits,
            triggerHit = tracker.triggerHit,
        )
    }

    fun solveBatch(level: Level, seeds: Int = 100): BatchResult {
        val results = (0L until seeds).map { offset ->
            val l = level.copy(seed = level.seed + offset)
            solve(l)
        }
        val wins = results.filter { it.won }
        return BatchResult(
            levelId = level.id,
            levelName = level.name,
            runs = seeds,
            wins = wins.size,
            losses = results.size - wins.size,
            winRate = wins.size.toDouble() / results.size,
            scores = wins.map { it.score },
            movesList = wins.map { it.moves },
            comboDamages = wins.map { it.comboDamage },
            rotationsUsed = wins.map { it.rotationsUsed },
            maxCombos = wins.map { it.maxCombo },
            targetsClearedList = wins.map { it.targetsCleared },
        )
    }

    // ── Nước đi ──

    private sealed class Move {
        data class Place(val trayIndex: Int, val ox: Int, val oy: Int) : Move()
        data class RotateThenPlace(val cw: Boolean, val trayIndex: Int, val ox: Int, val oy: Int) : Move()
        data class RotateOnly(val cw: Boolean) : Move()
    }

    // ── Tìm nước tốt nhất ──

    private fun findBestMove(state: EndlessState, goal: Goal, tracker: GoalTracker): Move? {
        var bestMove: Move? = null
        var bestEval = Int.MIN_VALUE
        val flooded = emptySet<Vec>()   // World 3 mới: nước KHÔNG chặn đặt mảnh (jelly đứng trên nước)

        // 1) Thử đặt trực tiếp (không xoay)
        for (trayIdx in state.tray.indices) {
            val piece = state.tray[trayIdx] ?: continue
            val maxOx = state.grid.size - piece.shape.width
            val maxOy = state.grid.size - piece.shape.height
            for (oy in 0..maxOy) {
                for (ox in 0..maxOx) {
                    if (piece.shape.at(ox, oy).any { it in flooded }) continue
                    val eval = evaluateFreePlacement(state.grid, piece, ox, oy, state.gravity, state.combo, goal, tracker, state.waterSources)
                    if (eval != null && eval > bestEval) {
                        bestEval = eval
                        bestMove = Move.Place(trayIdx, ox, oy)
                    }
                }
            }
        }

        // 2) Thử xoay trước rồi đặt
        if (state.rotationBudget > 0) {
            for (cw in listOf(true, false)) {
                val rotDir = if (cw) state.gravity.rotateCW() else state.gravity.rotateCCW()
                val rotGrid = state.grid.copy()
                applyClusterGravity(rotGrid, rotDir)
                val rotResolve = resolve(rotGrid, rotDir, state.combo, mergeEnabled = true)
                val rotCombo = if (rotResolve.cleared || rotResolve.formedSuper) rotResolve.endCombo else state.combo
                val rotScoreBonus = rotResolve.totalScore
                val rotTargets = countTargetsInEvents(rotResolve.events) +
                    sourceBreaksInEvents(rotResolve.events, state.waterSources)
                val rotComboDmg = calcComboDamage(state.combo, rotResolve.endCombo)

                val rotFlooded = emptySet<Vec>()

                for (trayIdx in state.tray.indices) {
                    val piece = state.tray[trayIdx] ?: continue
                    val maxOx = rotGrid.size - piece.shape.width
                    val maxOy = rotGrid.size - piece.shape.height
                    for (oy in 0..maxOy) {
                        for (ox in 0..maxOx) {
                            if (piece.shape.at(ox, oy).any { it in rotFlooded }) continue
                            val placeEval = evaluateFreePlacement(rotGrid, piece, ox, oy, rotDir, rotCombo, goal, tracker)
                            if (placeEval != null) {
                                val totalEval = placeEval + rotScoreBonus +
                                    rotTargets * targetWeight(goal) +
                                    rotComboDmg * comboDamageWeight(goal)
                                if (totalEval > bestEval) {
                                    bestEval = totalEval
                                    bestMove = Move.RotateThenPlace(cw, trayIdx, ox, oy)
                                }
                            }
                        }
                    }
                }

                // Xoay thuần (TUTORIAL rotate, hoặc xoay tạo cascade giá trị)
                if (goal.type == GoalType.TUTORIAL && goal.trigger == TriggerKind.ROTATE) {
                    val eval = 10000
                    if (eval > bestEval) {
                        bestEval = eval
                        bestMove = Move.RotateOnly(cw)
                    }
                } else if (rotScoreBonus > 0 || rotTargets > 0) {
                    val eval = rotScoreBonus + rotTargets * targetWeight(goal) +
                        rotComboDmg * comboDamageWeight(goal) - 50
                    if (eval > bestEval) {
                        bestEval = eval
                        bestMove = Move.RotateOnly(cw)
                    }
                }
            }
        }

        return bestMove
    }

    // ── Đánh giá 1 vị trí đặt (trên bản sao lưới) ──

    private fun evaluateFreePlacement(
        grid: Grid, piece: Piece, ox: Int, oy: Int,
        gravity: Direction, combo: Int, goal: Goal, tracker: GoalTracker,
        sources: List<WaterSource> = emptyList(),
    ): Int? {
        val testGrid = grid.copy()
        val result = freePlace(testGrid, piece, ox, oy)
        if (result !is PlacementResult.Success) return null
        place(testGrid, piece, result.cells)

        val resolveResult = resolve(testGrid, gravity, combo, mergeEnabled = true)

        val scoreGain = resolveResult.totalScore
        val endCombo = resolveResult.endCombo
        val comboGain = if (resolveResult.cleared || resolveResult.formedSuper) endCombo - combo else 0

        val targetsCleared = countTargetsInEvents(resolveResult.events) +
            sourceBreaksInEvents(resolveResult.events, sources)
        val comboDmg = calcComboDamage(combo, endCombo)

        val holes = countHoles(testGrid, gravity)
        val height = maxHeight(testGrid, gravity)

        var eval = scoreGain +
            comboGain * 30 +
            targetsCleared * targetWeight(goal) +
            comboDmg * comboDamageWeight(goal) -
            holes * 12 -
            height * 3

        // Bonus cho TUTORIAL triggers
        if (goal.type == GoalType.TUTORIAL && !tracker.triggerHit) {
            eval += checkTutorialTrigger(resolveResult, goal) * 5000
        }

        // Bonus: đặt MINT gần gốc vine (cho W2)
        if (piece.color == JellyColor.MINT && hasVines(grid)) {
            eval += mintNearRootBonus(grid, result.cells)
        }

        return eval
    }

    // ── Trọng số theo goal ──

    private fun targetWeight(goal: Goal): Int = when (goal.type) {
        GoalType.CLEAR_TARGETS, GoalType.MIXED -> 500
        else -> 50
    }

    private fun comboDamageWeight(goal: Goal): Int = when (goal.type) {
        GoalType.BOSS_COMBO -> 800
        else -> 30
    }

    // ── Heuristic phụ ──

    private fun countHoles(grid: Grid, gravity: Direction): Int {
        var holes = 0
        val size = grid.size
        when (gravity) {
            Direction.DOWN -> {
                for (x in 0 until size) {
                    var blocked = false
                    for (y in (size - 1) downTo 0) {
                        if (!grid.isEmpty(x, y)) blocked = true
                        else if (blocked) holes++
                    }
                }
            }
            Direction.UP -> {
                for (x in 0 until size) {
                    var blocked = false
                    for (y in 0 until size) {
                        if (!grid.isEmpty(x, y)) blocked = true
                        else if (blocked) holes++
                    }
                }
            }
            Direction.LEFT -> {
                for (y in 0 until size) {
                    var blocked = false
                    for (x in 0 until size) {
                        if (!grid.isEmpty(x, y)) blocked = true
                        else if (blocked) holes++
                    }
                }
            }
            Direction.RIGHT -> {
                for (y in 0 until size) {
                    var blocked = false
                    for (x in (size - 1) downTo 0) {
                        if (!grid.isEmpty(x, y)) blocked = true
                        else if (blocked) holes++
                    }
                }
            }
        }
        return holes
    }

    private fun maxHeight(grid: Grid, gravity: Direction): Int {
        val size = grid.size
        var maxH = 0
        when (gravity) {
            Direction.DOWN -> {
                for (x in 0 until size) {
                    for (y in 0 until size) {
                        if (!grid.isEmpty(x, y)) { maxH = maxOf(maxH, size - y); break }
                    }
                }
            }
            Direction.UP -> {
                for (x in 0 until size) {
                    for (y in (size - 1) downTo 0) {
                        if (!grid.isEmpty(x, y)) { maxH = maxOf(maxH, y + 1); break }
                    }
                }
            }
            Direction.LEFT -> {
                for (y in 0 until size) {
                    for (x in (size - 1) downTo 0) {
                        if (!grid.isEmpty(x, y)) { maxH = maxOf(maxH, x + 1); break }
                    }
                }
            }
            Direction.RIGHT -> {
                for (y in 0 until size) {
                    for (x in 0 until size) {
                        if (!grid.isEmpty(x, y)) { maxH = maxOf(maxH, size - x); break }
                    }
                }
            }
        }
        return maxH
    }

    private fun mintNearRootBonus(grid: Grid, placedCells: List<Vec>): Int {
        var bonus = 0
        for (cell in placedCells) {
            for (y in 0 until grid.size) {
                val c = grid.get(cell.x, y)
                if (c != null && c.isVineRoot) { bonus += 40; break }
            }
            for (x in 0 until grid.size) {
                val c = grid.get(x, cell.y)
                if (c != null && c.isVineRoot) { bonus += 40; break }
            }
        }
        return bonus
    }

    private fun checkTutorialTrigger(r: ResolveResult, goal: Goal): Int {
        if (goal.trigger == null) return 0
        for (e in r.events) {
            when {
                goal.trigger == TriggerKind.ROW && e is ResolveEvent.LinesCleared && e.lines.rows.isNotEmpty() -> return 1
                goal.trigger == TriggerKind.COL && e is ResolveEvent.LinesCleared && e.lines.cols.isNotEmpty() -> return 1
                goal.trigger == TriggerKind.SUPER1 && e is ResolveEvent.SuperFormed && e.level >= 1 -> return 1
                goal.trigger == TriggerKind.SUPER2 && e is ResolveEvent.SuperFormed && e.level >= 2 -> return 1
                goal.trigger == TriggerKind.RAINBOW && e is ResolveEvent.RainbowFormed && e.level == 0 -> return 1
                goal.trigger == TriggerKind.RAINBOW_SUPER && e is ResolveEvent.RainbowFormed && e.level >= 2 -> return 1
                goal.trigger == TriggerKind.COMBO_X2 && e is ResolveEvent.LinesCleared && e.comboLevel >= 2 -> return 1
            }
        }
        return 0
    }

    // ── Đếm targets bị xoá từ events ──

    private fun countTargetsInEvents(events: List<ResolveEvent>): Int {
        var count = 0
        for (e in events) {
            when (e) {
                is ResolveEvent.VineRootsCleared -> count += e.roots.size
                is ResolveEvent.DropsCleared -> count += e.drops.size
                else -> {}
            }
        }
        return count
    }

    /**
     * W3 — số nguồn active bị phá bởi các hàng/cột vừa xoá (clear đi qua chính ô nguồn). Gợi ý greedy
     * nhắm phá nguồn (tracker thật đếm qua [GameEvent.WaterSourceBroken]; đây chỉ là heuristic đánh giá).
     */
    private fun sourceBreaksInEvents(events: List<ResolveEvent>, sources: List<WaterSource>): Int {
        if (sources.isEmpty()) return 0
        val rows = HashSet<Int>(); val cols = HashSet<Int>()
        for (e in events) if (e is ResolveEvent.LinesCleared) {
            rows.addAll(e.bluLines.rows); cols.addAll(e.bluLines.cols)   // chỉ dòng có Thạch Nước phá được
        }
        if (rows.isEmpty() && cols.isEmpty()) return 0
        return sources.count { it.active && (it.pos.y in rows || it.pos.x in cols) }
    }

    // ── Combo damage cho boss ──

    companion object {
        const val MAX_TURNS = 600

        fun calcComboDamage(before: Int, after: Int): Int =
            ComboReward.rotationRefund(before, after)
    }

    // ── Goal tracker ──

    private class GoalTracker(private val goal: Goal) {
        var maxCombo = 0
        var targetsCleared = 0
        var comboDamage = 0
        var comboHits = 0
        var triggerHit = false
        private var lastComboForDmg = 0

        fun processEvents(events: List<GameEvent>, state: EndlessState) {
            for (e in events) {
                when (e) {
                    is GameEvent.VineRootsCleared -> targetsCleared += e.roots.size
                    is GameEvent.WaterSourceBroken -> targetsCleared += 1   // W3: phá nguồn = 1 target
                    is GameEvent.LinesCleared -> {
                        if (e.comboLevel > maxCombo) maxCombo = e.comboLevel
                        checkTrigger(e)
                    }
                    is GameEvent.SuperFormed -> checkTriggerSuper(e)
                    is GameEvent.RainbowFormed -> checkTriggerRainbow(e)
                    is GameEvent.GravityRotated -> {
                        if (goal.type == GoalType.TUTORIAL && goal.trigger == TriggerKind.ROTATE)
                            triggerHit = true
                    }
                    else -> {}
                }
            }
            // Combo damage: track from state combo
            val currentCombo = state.combo
            if (currentCombo > lastComboForDmg) {
                val dmg = calcComboDamage(lastComboForDmg, currentCombo)
                if (dmg > 0) { comboDamage += dmg; comboHits++ }
                lastComboForDmg = currentCombo
            }
            if (currentCombo == 0) lastComboForDmg = 0
            if (currentCombo > maxCombo) maxCombo = currentCombo
        }

        private fun checkTrigger(e: GameEvent.LinesCleared) {
            if (goal.type != GoalType.TUTORIAL) return
            when (goal.trigger) {
                TriggerKind.ROW -> if (e.lines.rows.isNotEmpty()) triggerHit = true
                TriggerKind.COL -> if (e.lines.cols.isNotEmpty()) triggerHit = true
                TriggerKind.COMBO_X2 -> if (e.comboLevel >= 2) triggerHit = true
                else -> {}
            }
        }

        private fun checkTriggerSuper(e: GameEvent.SuperFormed) {
            if (goal.type != GoalType.TUTORIAL) return
            when (goal.trigger) {
                TriggerKind.SUPER1 -> if (e.level >= 1) triggerHit = true
                TriggerKind.SUPER2 -> if (e.level >= 2) triggerHit = true
                else -> {}
            }
        }

        private fun checkTriggerRainbow(e: GameEvent.RainbowFormed) {
            if (goal.type != GoalType.TUTORIAL) return
            when (goal.trigger) {
                TriggerKind.RAINBOW -> if (e.level == 0) triggerHit = true
                TriggerKind.RAINBOW_SUPER -> if (e.level >= 2) triggerHit = true
                else -> {}
            }
        }

        fun isWon(state: EndlessState): Boolean = when (goal.type) {
            GoalType.REACH_SCORE -> state.score >= goal.score
            GoalType.CLEAR_TARGETS -> targetsCleared >= goal.count
            GoalType.BOSS_COMBO -> comboDamage >= goal.bossHP
            GoalType.MIXED -> targetsCleared >= goal.count && state.score >= goal.score
            GoalType.TUTORIAL -> triggerHit
            GoalType.COMBO_CHAIN -> maxCombo >= goal.count
            GoalType.CLEAR_ALL -> {
                var occupied = 0
                for (y in 0 until state.grid.size) for (x in 0 until state.grid.size)
                    if (!state.grid.isEmpty(x, y)) occupied++
                occupied == 0
            }
        }
    }
}
