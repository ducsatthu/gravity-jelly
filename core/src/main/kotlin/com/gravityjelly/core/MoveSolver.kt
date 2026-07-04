package com.gravityjelly.core

/**
 * Solver TÌM SỐ NƯỚC NGẮN NHẤT giải được một màn — beam search theo độ sâu (mỗi độ sâu = 1 nước ĐẶT).
 *
 * Khác [CampaignSolver] (greedy 1-nước, đi thừa & kẹt màn khó), solver này duyệt theo TẦNG số nước:
 * dừng ở tầng ĐẦU TIÊN chạm mục tiêu ⇒ `moves` khi đó = số nước ngắn nhất solver tìm được. Đây là cơ
 * sở đặt ngưỡng **3★ = ngắn nhất** (goal-system-v2.md §20).
 *
 * Xoay trọng lực KHÔNG tính là "nước" (chỉ tốn ngân sách xoay) — được gộp làm tiền tố của mỗi nước đặt,
 * và xét riêng trường hợp "thắng chỉ bằng xoay" (vd L24 lái thác trúng giọt, 0 nước đặt).
 *
 * Fork state qua [EndlessEngine.snapshot]/[EndlessEngine.restore]; deterministic, headless.
 */
class MoveSolver(
    private val beamWidth: Int = 120,
    private val maxDepth: Int = 45,
    private val maxNodes: Int = 1_500_000,
) {
    data class Result(
        val won: Boolean,
        val moves: Int,
        val rotationsUsed: Int,
        val comboHits: Int,
        val nodesExpanded: Int,
    )

    /** Tiến độ mục tiêu tích luỹ dọc một đường đi (không nằm trong state engine → phải tự cộng). */
    private class Progress(
        var targets: Int = 0,
        var comboDmg: Int = 0,
        var comboHits: Int = 0,
        var triggerHit: Boolean = false,
        var lastComboForDmg: Int = 0,
        var maxCombo: Int = 0,
        var rotationsUsed: Int = 0,
    ) {
        fun copy() = Progress(targets, comboDmg, comboHits, triggerHit, lastComboForDmg, maxCombo, rotationsUsed)
    }

    private class Node(
        val snap: EndlessEngine.Snapshot,
        val prog: Progress,
        val moves: Int,
        val heur: Int,
    )

    // Bốn hướng đặt tương đối = 4 orientation của trọng lực; chi phí ngân sách tối thiểu để đạt.
    private enum class Rot(val cost: Int) { NONE(0), CW(1), CCW(1), HALF(2) }

    private var nodes = 0

    /**
     * Số nước NGẮN NHẤT tìm được = min giữa beam search và greedy [CampaignSolver] (chạy CÙNG seed màn).
     * Beam giỏi màn xoay/nước; greedy giỏi màn dồn-combo cần xây cấu trúc — bù nhau. Nếu chỉ một bên
     * thắng thì lấy bên đó; cả hai thua ⇒ won=false (màn có thể vượt khả năng solver / cần chỉnh thiết kế).
     */
    fun solve(level: Level): Result {
        val beam = solveBeam(level)
        val greedy = CampaignSolver().solve(level)
        val greedyWon = greedy.won
        return when {
            beam.won && greedyWon -> if (beam.moves <= greedy.moves) beam
                else Result(true, greedy.moves, greedy.rotationsUsed, greedy.comboHits, beam.nodesExpanded)
            beam.won -> beam
            greedyWon -> Result(true, greedy.moves, greedy.rotationsUsed, greedy.comboHits, beam.nodesExpanded)
            else -> beam
        }
    }

    fun solveBeam(level: Level): Result {
        nodes = 0
        val engine = EndlessEngine.forLevel(level)
        val goal = level.goal
        val start = Node(engine.snapshot(), Progress(), 0, 0)

        // Màn đã thắng ngay từ đầu (hiếm) → 0 nước.
        if (isWon(goal, start.snap, start.prog)) return win(start)

        val visited = HashSet<String>()
        visited.add(keyOf(goal, start.snap, start.prog))
        var beam = listOf(start)

        for (depth in 0 until maxDepth) {
            // 1) Thắng CHỈ bằng xoay từ một node ở tầng hiện tại (không thêm nước).
            for (node in beam) {
                val rw = rotateOnlyWin(engine, goal, node)
                if (rw != null) return rw
            }

            // 2) Sinh con = (xoay tuỳ chọn) + đặt 1 mảnh. Con thắng → trả ngay (moves = depth+1).
            val children = ArrayList<Node>()
            for (node in beam) {
                if (nodes >= maxNodes) break
                val childWin = expandPlacements(engine, goal, node, visited, children)
                if (childWin != null) return childWin
            }
            if (children.isEmpty() || nodes >= maxNodes) break

            // Giữ top-[beamWidth] theo heuristic cho tầng kế.
            beam = children.sortedByDescending { it.heur }.take(beamWidth)
        }

        return Result(won = false, moves = 0, rotationsUsed = 0, comboHits = 0, nodesExpanded = nodes)
    }

    // ── Sinh node con bằng cách đặt mảnh (có tiền tố xoay) ──

    /** Trả node THẮNG nếu gặp; ngược lại đẩy các con hợp lệ vào [out] và trả null. */
    private fun expandPlacements(
        engine: EndlessEngine, goal: Goal, node: Node,
        visited: HashSet<String>, out: ArrayList<Node>,
    ): Result? {
        for (rot in orientationsFor(node)) {
            engine.restore(node.snap)
            val rotEvents = applyRotation(engine, rot) ?: continue
            val rotSnap = engine.snapshot()
            val rotProg = node.prog.copy()
            rotProg.rotationsUsed += rot.cost
            update(rotProg, goal, rotEvents, engine.state())

            val state = engine.state()
            if (state.isGameOver) continue
            val flooded = state.floodedCells

            for (trayIdx in state.tray.indices) {
                val piece = state.tray[trayIdx] ?: continue
                val maxOx = state.grid.size - piece.shape.width
                val maxOy = state.grid.size - piece.shape.height
                for (oy in 0..maxOy) {
                    for (ox in 0..maxOx) {
                        if (piece.shape.at(ox, oy).any { it in flooded }) continue
                        if (!fits(state.grid, piece, ox, oy, flooded)) continue

                        engine.restore(rotSnap)
                        val placeEvents = engine.placePieceAt(trayIdx, ox, oy)
                        if (placeEvents.isEmpty()) continue
                        nodes++

                        val prog = rotProg.copy()
                        val after = engine.state()
                        update(prog, goal, placeEvents, after)

                        val childSnap = engine.snapshot()
                        val child = Node(childSnap, prog, node.moves + 1, heuristic(goal, after, prog))
                        if (isWon(goal, childSnap, prog)) {
                            return Result(true, child.moves, prog.rotationsUsed, prog.comboHits, nodes)
                        }
                        val key = keyOf(goal, childSnap, prog)
                        if (visited.add(key)) out.add(child)
                    }
                }
                if (nodes >= maxNodes) return null
            }
        }
        return null
    }

    /** Thử thắng chỉ bằng chuỗi xoay (≤ ngân sách) từ [node] — không tốn nước. */
    private fun rotateOnlyWin(engine: EndlessEngine, goal: Goal, node: Node): Result? {
        for (rot in orientationsFor(node)) {
            if (rot == Rot.NONE) continue
            engine.restore(node.snap)
            val ev = applyRotation(engine, rot) ?: continue
            val prog = node.prog.copy()
            prog.rotationsUsed += rot.cost
            update(prog, goal, ev, engine.state())
            if (isWon(goal, engine.snapshot(), prog)) {
                return Result(true, node.moves, prog.rotationsUsed, prog.comboHits, nodes)
            }
        }
        return null
    }

    private fun orientationsFor(node: Node): List<Rot> {
        val budget = node.snap.rotBudget
        if (budget <= 0) return listOf(Rot.NONE)
        val list = ArrayList<Rot>(4)
        list.add(Rot.NONE)
        list.add(Rot.CW)
        list.add(Rot.CCW)
        if (budget >= 2) list.add(Rot.HALF)
        return list
    }

    /** Áp chuỗi xoay lên engine; null nếu không đủ ngân sách / bị chặn. Trả gộp events. */
    private fun applyRotation(engine: EndlessEngine, rot: Rot): List<GameEvent>? {
        return when (rot) {
            Rot.NONE -> emptyList()
            Rot.CW -> engine.rotateGravity(cw = true).ifEmpty { null }
            Rot.CCW -> engine.rotateGravity(cw = false).ifEmpty { null }
            Rot.HALF -> {
                val a = engine.rotateGravity(cw = true).ifEmpty { return null }
                val b = engine.rotateGravity(cw = true).ifEmpty { return null }
                a + b
            }
        }
    }

    private fun fits(grid: Grid, piece: Piece, ox: Int, oy: Int, flooded: Set<Vec>): Boolean {
        for (c in piece.shape.at(ox, oy)) {
            if (!grid.isEmpty(c.x, c.y) || c in flooded) return false
        }
        return true
    }

    private fun win(node: Node) = Result(true, node.moves, node.prog.rotationsUsed, node.prog.comboHits, nodes)

    // ── Tiến độ mục tiêu từ events (đồng bộ luật với CampaignSolver.GoalTracker) ──

    private fun update(p: Progress, goal: Goal, events: List<GameEvent>, state: EndlessState) {
        for (e in events) {
            when (e) {
                is GameEvent.VineRootsCleared -> p.targets += e.roots.size
                is GameEvent.DropsCleared -> p.targets += e.drops.size
                is GameEvent.LinesCleared -> {
                    if (e.comboLevel > p.maxCombo) p.maxCombo = e.comboLevel
                    if (goal.type == GoalType.TUTORIAL) when (goal.trigger) {
                        TriggerKind.ROW -> if (e.lines.rows.isNotEmpty()) p.triggerHit = true
                        TriggerKind.COL -> if (e.lines.cols.isNotEmpty()) p.triggerHit = true
                        TriggerKind.COMBO_X2 -> if (e.comboLevel >= 2) p.triggerHit = true
                        else -> {}
                    }
                }
                is GameEvent.SuperFormed -> if (goal.type == GoalType.TUTORIAL) when (goal.trigger) {
                    TriggerKind.SUPER1 -> if (e.level >= 1) p.triggerHit = true
                    TriggerKind.SUPER2 -> if (e.level >= 2) p.triggerHit = true
                    else -> {}
                }
                is GameEvent.RainbowFormed -> if (goal.type == GoalType.TUTORIAL) when (goal.trigger) {
                    TriggerKind.RAINBOW -> if (e.level == 0) p.triggerHit = true
                    TriggerKind.RAINBOW_SUPER -> if (e.level >= 2) p.triggerHit = true
                    else -> {}
                }
                is GameEvent.GravityRotated ->
                    if (goal.type == GoalType.TUTORIAL && goal.trigger == TriggerKind.ROTATE) p.triggerHit = true
                else -> {}
            }
        }
        val c = state.combo
        if (c > p.lastComboForDmg) {
            val dmg = ComboReward.rotationRefund(p.lastComboForDmg, c)
            if (dmg > 0) { p.comboDmg += dmg; p.comboHits++ }
            p.lastComboForDmg = c
        }
        if (c == 0) p.lastComboForDmg = 0
        if (c > p.maxCombo) p.maxCombo = c
    }

    private fun isWon(goal: Goal, snap: EndlessEngine.Snapshot, p: Progress): Boolean = when (goal.type) {
        GoalType.REACH_SCORE -> snap.score >= goal.score
        GoalType.CLEAR_TARGETS -> p.targets >= goal.count
        GoalType.BOSS_COMBO -> p.comboDmg >= goal.bossHP
        GoalType.MIXED -> p.targets >= goal.count && snap.score >= goal.score
        GoalType.TUTORIAL -> p.triggerHit
        GoalType.COMBO_CHAIN -> p.maxCombo >= goal.count
        GoalType.CLEAR_ALL -> {
            var occ = 0
            for (y in 0 until snap.grid.size) for (x in 0 until snap.grid.size)
                if (!snap.grid.isEmpty(x, y)) occ++
            occ == 0
        }
    }

    // ── Heuristic chọn beam (cao = hứa hẹn hơn); hướng về mục tiêu để không phí ngân sách node ──

    private fun heuristic(goal: Goal, state: EndlessState, p: Progress): Int {
        var h = 0
        if (p.triggerHit) h += 1_000_000
        h += p.targets * 20_000
        h += p.comboDmg * (if (goal.type == GoalType.BOSS_COMBO) 2_000 else 100)
        h += minOf(state.score, if (goal.score > 0) goal.score else state.score)
        h -= occupied(state.grid) * 3
        return h
    }

    private fun occupied(grid: Grid): Int {
        var n = 0
        for (y in 0 until grid.size) for (x in 0 until grid.size) if (!grid.isEmpty(x, y)) n++
        return n
    }

    // ── Khoá dedup: state engine + tiến độ (gộp mọi giá trị "≥ goal" để hội tụ) ──

    private fun keyOf(goal: Goal, snap: EndlessEngine.Snapshot, p: Progress): String {
        val sb = StringBuilder(140)
        val g = snap.grid
        for (y in 0 until g.size) for (x in 0 until g.size) {
            val c = g.get(x, y)
            if (c == null) sb.append('.')
            else sb.append(c.type.ordinal).append(c.color?.ordinal ?: 9).append(c.superLevel)
                .append(if (c.rainbow) 'r' else '-').append(if (c.vineRoot) 'v' else '-')
        }
        sb.append('|').append(snap.gravity.ordinal).append('|').append(snap.rotBudget)
        sb.append('|')
        for (t in snap.tray) sb.append(t?.let { "${it.shape.hashCode()}:${it.color.ordinal}" } ?: "_").append(',')
        sb.append('|').append(if (goal.count > 0) minOf(p.targets, goal.count) else p.targets)
        sb.append('|').append(if (p.triggerHit) 1 else 0)
        sb.append('|').append(if (goal.score > 0) minOf(snap.score, goal.score) else 0)
        sb.append('|').append(if (goal.bossHP > 0) minOf(p.comboDmg, goal.bossHP) else 0)
        return sb.toString()
    }
}
