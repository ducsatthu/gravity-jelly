package com.gravityjelly.core

sealed class ResolveEvent {
    data class LinesCleared(
        val lines: ClearedLines,
        val cellsCleared: Int,
        val comboLevel: Int,
        val score: Int,
    ) : ResolveEvent()

    data class ClustersCollapsed(val moved: Boolean) : ResolveEvent()

    /** 9 ô cùng màu hợp nhất thành 1 siêu khối tại [at]; [absorbed] = 8 ô bị thu (làm trống). */
    data class SuperFormed(
        val at: Vec,
        val color: JellyColor,
        val level: Int,
        val source: SuperSource,
        val absorbed: List<Vec>,
    ) : ResolveEvent()

    /** Siêu khối tại [at] bị nổ; [cells] = footprint quét (cùng màu toàn bàn; +5×5 nếu cấp 2). */
    data class SuperDetonated(
        val at: Vec,
        val color: JellyColor,
        val level: Int,
        val cells: List<Vec>,
    ) : ResolveEvent()

    /** 3×3 ba màu (mỗi màu 1 cột/hàng) → 1 KHỐI CẦU VỒNG tại [at]; [absorbed] = 8 ô bị thu. */
    data class RainbowFormed(
        val at: Vec,
        val absorbed: List<Vec>,
    ) : ResolveEvent()
}

data class ResolveResult(
    val events: List<ResolveEvent>,
    val totalScore: Int,
    /** Bậc combo sau khi resolve xong (đã cộng dồn từ [startCombo] truyền vào). */
    val endCombo: Int,
    /** true nếu có ít nhất một hàng/cột bị xóa trong lần resolve này. */
    val cleared: Boolean,
    /** true nếu có ít nhất một siêu khối được hợp nhất (kể cả khi không xóa hàng nào). */
    val formedSuper: Boolean = false,
)

/**
 * Vòng resolve, mỗi vòng theo thứ tự ưu tiên:
 *   PHA 1 — **xóa hàng/cột đầy** (tính điểm nền): xóa, đồng thời mọi siêu khối bị cuốn vào →
 *           nổ (cấp 1 = quét cùng màu toàn bàn, cấp 2 = cùng màu + 5×5, dây chuyền) → cụm sụp.
 *   PHA 2 — **merge** (không còn dòng đầy):
 *           • 3×3 cùng màu → SIÊU KHỐI cấp 1.   • ≥2 super-1 cùng màu dính liền → cấp 2.
 *           • 3×3 ba màu (mỗi màu 1 cột/hàng) → KHỐI CẦU VỒNG.
 * Lặp tới khi không còn gì. (Dòng đầy LUÔN xóa — giữ luật nền; merge chỉ từ ô vuông 3×3 / super.)
 *
 * Combo CỘNG DỒN: mỗi hàng/cột bị xóa +1. Merge (siêu khối/cầu vồng) KHÔNG tăng combo nhưng
 * cũng KHÔNG reset ([ResolveResult.formedSuper]). [mergeEnabled] tắt = chỉ còn xóa hàng/cột nền.
 */
fun resolve(grid: Grid, gravity: Direction, startCombo: Int = 0, mergeEnabled: Boolean = true): ResolveResult {
    val events = mutableListOf<ResolveEvent>()
    var totalScore = 0
    var combo = startCombo
    var cleared = false
    var formed = false

    while (true) {
        // PHA 1: xóa hàng/cột đầy TRƯỚC (có thể kích nổ siêu khối nằm trong vùng xóa).
        val lines = findFullLines(grid)
        if (!lines.isEmpty) {
            cleared = true
            combo += lines.count
            val lineSet = lineCells(lines, grid.size)
            val (toClear, detonations) = expandDetonations(grid, lineSet)
            for (v in toClear) grid.set(v.x, v.y, null)

            val cellsCleared = toClear.size
            val score = Scoring.clearScore(cellsCleared, lines.count, combo)
            totalScore += score
            events.add(ResolveEvent.LinesCleared(lines, cellsCleared, combo, score))
            for (d in detonations) {
                events.add(ResolveEvent.SuperDetonated(d.center, d.color, d.level, d.cells))
            }
            val moved = applyConnectedGravity(grid, gravity, toClear)
            events.add(ResolveEvent.ClustersCollapsed(moved))
            continue
        }

        // PHA 2: merge (3×3 cùng màu / 3 màu sọc, hoặc gộp super-1).
        val move = if (mergeEnabled) findMergeMove(grid) else null
        val absorbed: List<Vec> = when (move) {
            is MergeMove.Super -> {
                val a = collapseToSuper(grid, move.center, move.color, move.cells, move.level)
                events.add(ResolveEvent.SuperFormed(move.center, move.color, move.level, SuperSource.CLUSTER, a))
                a
            }
            is MergeMove.Rainbow -> {
                val a = collapseToRainbow(grid, move.center, move.cells)
                events.add(ResolveEvent.RainbowFormed(move.center, a))
                a
            }
            null -> break
        }
        formed = true
        val moved = applyConnectedGravity(grid, gravity, absorbed.toHashSet())
        events.add(ResolveEvent.ClustersCollapsed(moved))
    }

    return ResolveResult(events, totalScore, combo, cleared, formed)
}
