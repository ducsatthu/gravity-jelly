package com.gravityjelly.game

import com.gravityjelly.core.CellEffect
import com.gravityjelly.core.CellType
import com.gravityjelly.core.Direction
import com.gravityjelly.core.GameEvent
import com.gravityjelly.core.Grid
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PieceLibrary
import com.gravityjelly.core.ResolveEvent
import com.gravityjelly.core.Vec
import com.gravityjelly.core.resolve
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * World 3 · Dòng chảy — bất biến NHỊP: khối bị **đẩy** (JellyPushed) phải trượt SAU khi chuỗi cascade
 * đặt-mảnh (flash → merge → **rơi**) đã xong, KHÔNG đồng thời với trọng lực rơi. Dựng một lượt vừa
 * xoá hàng vừa đẩy khối, chạy đồng hồ sim và so mốc: ô đích của khối đẩy chỉ được lấp SAU khi hàng đã
 * biến mất trong [BoardAnimator.displayGrid].
 */
class WaterPlaybackTest {

    private fun blk(c: JellyColor) = Grid.Cell(CellType.BLOCK, c)
    private val palette = arrayOf(JellyColor.YELLOW, JellyColor.MINT, JellyColor.PINK, JellyColor.BLUE)

    /** Map ResolveEvent → GameEvent + PiecePlaced đầu (như EndlessEngine, phần dùng cho test này). */
    private fun toGameEvents(placedCells: List<Vec>, re: List<ResolveEvent>): List<GameEvent> {
        val out = mutableListOf<GameEvent>()
        out.add(GameEvent.PiecePlaced(Piece(PieceLibrary.DOT, JellyColor.YELLOW), placedCells))
        for (e in re) when (e) {
            is ResolveEvent.LinesCleared -> out.add(GameEvent.LinesCleared(e.lines, e.cellsCleared, e.comboLevel, e.score, e.survivingRoots))
            is ResolveEvent.ClustersCollapsed -> {}   // animator tự tính lại trọng lực
            else -> {}
        }
        return out
    }

    @Test
    fun push_slides_after_line_fall_not_concurrent() {
        // Hàng đáy y=8 gần đầy (thiếu (8,8)) — thả DOT vào (8,8) → xoá hàng (đa màu, không hoá siêu khối).
        val pre = Grid()
        for (x in 0..7) pre.set(x, 8, blk(palette[x % 4]))
        // Khối lẻ đứng trên KÊNH NƯỚC ở (0,0) → neo-nước, không rơi khi cascade; sẽ bị ĐẨY sang (1,0).
        pre.set(0, 0, blk(JellyColor.MINT))
        pre.setEffect(0, 0, CellEffect.WATER_FLOW)

        val work = pre.copy().also { it.set(8, 8, blk(JellyColor.YELLOW)) }
        val res = resolve(work, Direction.DOWN, startCombo = 0)
        assertTrue("phải có xoá hàng", res.events.any { it is ResolveEvent.LinesCleared })
        assertTrue("khối neo-nước KHÔNG rơi", work.get(0, 0) != null)

        // Sau cascade: engine mọc dòng + đẩy khối (0,0)→(1,0). Dựng truth cuối cho khớp.
        val truth = work.copy().also { it.set(1, 0, it.get(0, 0)); it.set(0, 0, null) }
        val events = toGameEvents(listOf(Vec(8, 8)), res.events).toMutableList().apply {
            add(GameEvent.WaterGrew(listOf(Vec(0, 1))))
            add(GameEvent.JellyPushed(listOf(Vec(0, 0) to Vec(1, 0))))
        }

        val anim = BoardAnimator()
        anim.ingest(events, pre, Direction.DOWN, truth, Direction.DOWN)

        var clearGoneTime = -1L    // mốc hàng y=8 đã biến mất trong displayGrid
        var pushAppearTime = -1L   // mốc ô đích (1,0) được lấp (khối đẩy tới)
        var ribbonGrowTime = -1L   // mốc nốt nước mới (0,1) hết "chờ hiện" → ribbon mọc dài tới đó
        var t = 0L
        repeat(600) {
            anim.step(GameClock.STEP_NANOS)
            t += GameClock.STEP_NANOS
            val nowR = anim.renderNanos()
            if (ribbonGrowTime < 0 && !anim.waterPending(0, 1, nowR)) ribbonGrowTime = t
            val g = anim.displayGrid ?: return@repeat
            if (clearGoneTime < 0 && (0..7).all { g.get(it, 8) == null }) clearGoneTime = t
            if (pushAppearTime < 0 && g.get(1, 0) != null) pushAppearTime = t
        }

        assertTrue("hàng phải được xoá trong playback", clearGoneTime > 0)
        assertTrue("khối đẩy phải xuất hiện ở ô đích", pushAppearTime > 0)
        assertTrue("nốt nước mới phải hiện (ribbon mọc dài) trong playback", ribbonGrowTime > 0)
        assertTrue(
            "ĐẨY phải trượt SAU khi hàng rơi xong (clearGone=$clearGoneTime, pushAppear=$pushAppearTime)",
            pushAppearTime > clearGoneTime,
        )
        assertTrue(
            "RIBBON chỉ mọc dài SAU khi hàng rơi xong (clearGone=$clearGoneTime, ribbonGrow=$ribbonGrowTime)",
            ribbonGrowTime > clearGoneTime,
        )
    }
}
