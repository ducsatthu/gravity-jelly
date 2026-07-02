package com.gravityjelly.core

sealed class ResolveEvent {
    data class LinesCleared(
        val lines: ClearedLines,
        val cellsCleared: Int,
        val comboLevel: Int,
        val score: Int,
    ) : ResolveEvent()

    data class ClustersCollapsed(val moved: Boolean) : ResolveEvent()

    /**
     * 9 ô cùng màu hợp nhất thành 1 siêu khối tại [at]; [absorbed] = các ô bị thu (làm trống).
     * [score] điểm cộng cho lần ghép, [comboLevel] bậc combo tại nhịp ghép này.
     */
    data class SuperFormed(
        val at: Vec,
        val color: JellyColor,
        val level: Int,
        val source: SuperSource,
        val absorbed: List<Vec>,
        val score: Int = 0,
        val comboLevel: Int = 0,
    ) : ResolveEvent()

    /**
     * Siêu khối tại [at] bị nổ; [cells] = footprint quét (cùng màu toàn bàn; +5×5 nếu cấp 2).
     * [isRainbow] = true khi detonator là CẦU VỒNG (quét theo màu kề / cả bàn nếu siêu cấp); giúp
     * lớp vỏ phân biệt nổ siêu khối ↔ nổ cầu vồng (vd dạy luật lần đầu).
     */
    data class SuperDetonated(
        val at: Vec,
        val color: JellyColor,
        val level: Int,
        val cells: List<Vec>,
        val isRainbow: Boolean = false,
    ) : ResolveEvent()

    /**
     * 1 KHỐI CẦU VỒNG hình thành tại [at]; [absorbed] = các ô bị thu. [level] = 0 cầu vồng thường
     * (3×3 ba màu); = 2 CẦU VỒNG SIÊU CẤP (gộp kíp nổ khác màu/có cầu vồng — nổ xoá sạch toàn bàn).
     */
    data class RainbowFormed(
        val at: Vec,
        val absorbed: List<Vec>,
        val score: Int = 0,
        val comboLevel: Int = 0,
        val level: Int = 0,
    ) : ResolveEvent()

    /**
     * Xoá dòng đi qua GỐC dây leo → cả dây tan. [roots] = các gốc bị diệt (tín hiệu chấm
     * CLEAR_TARGETS); [cells] = mọi ô dây (gốc + đốt + đốt héo) đã biến mất trong nhịp này (cho render).
     */
    data class VineRootsCleared(val roots: List<Vec>, val cells: List<Vec>) : ResolveEvent()

    /**
     * Xoá hàng/cột (hoặc kíp nổ cuốn qua) đi qua ô ĐÍCH "giọt nước" ([CellType.TARGET], World 3 ·
     * Sông & Thác) → giọt vỡ. [drops] = các giọt vừa phá (tín hiệu chấm CLEAR_TARGETS/MIXED). Giọt
     * rơi/đếm-đầy như ô thường; khác dây leo ở chỗ KHÔNG cần diệt cả chuỗi — mỗi ô là một target.
     */
    data class DropsCleared(val drops: List<Vec>) : ResolveEvent()
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
 * Vòng resolve, mỗi vòng theo thứ tự ưu tiên — **GHÉP hết rồi mới FLASH** (tránh hàng đầy kích nổ kíp
 * nổ trước khi kịp ghép → mất khối mạnh "đáng tiếc cho người chơi"):
 *   PHA 0 — **hàng/cột đầy ĐƠN SẮC → SIÊU KHỐI** (ưu tiên TRƯỚC xóa): gom 9 ô về 1 siêu khối tại
 *           tâm đường, **thưởng ×2 điểm** (có super-1 trong đường → cấp 2).
 *   PHA 1 — **merge** (trước xóa): • 3×3 cùng màu → SIÊU KHỐI cấp 1.  • gộp kíp nổ dính liền → cấp 2
 *           (super-1 cùng màu) / CẦU VỒNG SIÊU CẤP (khác màu / có cầu vồng).  • 3×3 ba màu → CẦU VỒNG.
 *   PHA 2 — **xóa hàng/cột đầy** (mixed, tính điểm nền): xóa, đồng thời mọi kíp nổ bị cuốn vào →
 *           nổ (cấp 1 = quét cùng màu toàn bàn, cấp 2 = cùng màu + 5×5, cầu vồng siêu cấp = cả bàn) → cụm sụp.
 * Lặp tới khi không còn gì.
 *
 * Combo CỘNG DỒN: hàng/cột xóa thường +1; **mỗi lần GHÉP (siêu khối/cầu vồng) +1**; **nhịp NỔ
 * detonator nhảy theo loại** ([detonationComboBonus]: super1 +2, super2 +5, cầu vồng +2/màu kề, cầu
 * vồng siêu cấp +9). Điểm ghép = số ô × combo (×2 nếu hàng/cột đơn sắc). [mergeEnabled] tắt = chỉ xóa nền.
 */
fun resolve(grid: Grid, gravity: Direction, startCombo: Int = 0, mergeEnabled: Boolean = true): ResolveResult {
    val events = mutableListOf<ResolveEvent>()
    var totalScore = 0
    var combo = startCombo
    var cleared = false
    var formed = false

    while (true) {
        // PHA 0: hàng/cột đầy ĐƠN SẮC → siêu khối (ưu tiên trước xóa) + ×2 điểm + combo +1.
        val monoLine = if (mergeEnabled) findMonoLineSuper(grid) else null
        if (monoLine != null) {
            combo += 1
            val a = collapseToSuper(grid, monoLine.center, monoLine.color, monoLine.cells, monoLine.level)
            val score = Scoring.mergeScore(monoLine.cells.size, combo, mult = 2)
            totalScore += score
            events.add(ResolveEvent.SuperFormed(monoLine.center, monoLine.color, monoLine.level, monoLine.source, a, score, combo))
            formed = true
            val moved = applyClusterGravity(grid, gravity)
            events.add(ResolveEvent.ClustersCollapsed(moved))
            continue
        }

        // PHA 1: MERGE TRƯỚC FLASH — GHÉP xong hết (3×3 cùng màu / 3 màu sọc / gộp kíp nổ) rồi mới
        // xóa. Tránh trường hợp một hàng đầy đi qua các kíp nổ bị FLASH kích nổ trước, làm mất cơ
        // hội ghép (vd 2 super-1 khác màu → cầu vồng siêu cấp) — "đáng tiếc cho người chơi".
        val move = if (mergeEnabled) findMergeMove(grid) else null
        if (move != null) {
            val absorbed: List<Vec> = when (move) {
                is MergeMove.Super -> {
                    combo += 1
                    val a = collapseToSuper(grid, move.center, move.color, move.cells, move.level)
                    val score = Scoring.mergeScore(move.cells.size, combo)
                    totalScore += score
                    events.add(ResolveEvent.SuperFormed(move.center, move.color, move.level, move.source, a, score, combo))
                    a
                }
                is MergeMove.Rainbow -> {
                    combo += 1
                    val a = collapseToRainbow(grid, move.center, move.cells, move.level)
                    val score = Scoring.mergeScore(move.cells.size, combo)
                    totalScore += score
                    events.add(ResolveEvent.RainbowFormed(move.center, a, score, combo, move.level))
                    a
                }
            }
            formed = true
            val moved = applyClusterGravity(grid, gravity)
            events.add(ResolveEvent.ClustersCollapsed(moved))
            continue
        }

        // PHA 2: hết đường ghép → xóa hàng/cột đầy (có thể kích nổ kíp nổ nằm trong vùng xóa).
        val lines = findFullLines(grid)
        if (!lines.isEmpty) {
            cleared = true
            val lineSet = lineCells(lines, grid.size)
            val (toClear, detonations) = expandDetonations(grid, lineSet)
            // Combo: nhịp NỔ super/cầu vồng → cộng theo LOẠI detonator (×2/×5/×9…), đè +lines.count;
            // nhịp xóa thường → +lines.count. Cộng dồn với combo sẵn có (startCombo).
            combo += if (detonations.isEmpty()) lines.count else detonations.sumOf { detonationComboBonus(it) }

            // DÂY LEO + QUY TẮC MINT (§8 goal-system-v2.md): gốc chỉ bị phá nếu:
            //  (a) gốc nằm trên dòng bị xoá VÀ dòng đó chứa ≥1 khối MINT, hoặc
            //  (b) gốc bị siêu khối MINT nổ quét (đã giữ lại trong expandDetonations).
            // Bắt gốc khi lưới còn nguyên (trước set null).
            val rootsHit = toClear.filter { v ->
                val c = grid.get(v.x, v.y) ?: return@filter false
                if (!c.isVineRoot) return@filter false
                // (b) Gốc từ MINT detonation (không nằm trên line → giữ luôn)
                if (v !in lineSet) return@filter true
                // (a) Gốc trên dòng xoá → kiểm tra MINT
                val rowMint = v.y in lines.rows && (0 until grid.size).any { x ->
                    val bc = grid.get(x, v.y); bc != null && bc.type == CellType.BLOCK && bc.color == JellyColor.MINT
                }
                val colMint = v.x in lines.cols && (0 until grid.size).any { y ->
                    val bc = grid.get(v.x, y); bc != null && bc.type == CellType.BLOCK && bc.color == JellyColor.MINT
                }
                rowMint || colMint
            }
            val vineGone = HashSet<Vec>()
            for (r in rootsHit) vineGone.addAll(destroyVineOfRoot(grid, r))

            // GIỌT NƯỚC (World 3): mọi ô đích trên vùng xoá = giọt vỡ (bắt trước khi set null).
            val dropsHit = toClear.filter { grid.get(it.x, it.y)?.type == CellType.TARGET }

            val rootsHitSet = rootsHit.toSet()
            var cellsCleared = 0
            for (v in toClear) {
                val c = grid.get(v.x, v.y)
                if (c != null && c.isVineRoot && v !in rootsHitSet) continue
                grid.set(v.x, v.y, null)
                cellsCleared++
            }
            vineGone.addAll(wiltDisconnectedVines(grid))

            val score = Scoring.clearScore(cellsCleared, lines.count, combo)
            totalScore += score
            events.add(ResolveEvent.LinesCleared(lines, cellsCleared, combo, score))
            for (d in detonations) {
                events.add(ResolveEvent.SuperDetonated(d.center, d.color, d.level, d.cells, d.isRainbow))
            }
            if (rootsHit.isNotEmpty() || vineGone.isNotEmpty()) {
                events.add(ResolveEvent.VineRootsCleared(rootsHit, vineGone.sortedWith(compareBy({ it.y }, { it.x }))))
            }
            if (dropsHit.isNotEmpty()) {
                events.add(ResolveEvent.DropsCleared(dropsHit.sortedWith(compareBy({ it.y }, { it.x }))))
            }
            val moved = applyClusterGravity(grid, gravity)
            events.add(ResolveEvent.ClustersCollapsed(moved))
            continue
        }

        break
    }

    return ResolveResult(events, totalScore, combo, cleared, formed)
}
