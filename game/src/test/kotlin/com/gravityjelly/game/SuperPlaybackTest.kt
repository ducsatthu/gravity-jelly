package com.gravityjelly.game

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
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Playback siêu khối headless: dựng chuỗi sự kiện THẬT qua :core [resolve], map sang [GameEvent],
 * nạp [BoardAnimator], chạy đồng hồ sim qua hết các nhịp rồi kiểm tra [BoardAnimator.displayGrid]
 * khớp truth của engine — bảo đảm replay (hợp nhất + nổ 5×5) không lệch.
 */
class SuperPlaybackTest {

    private fun blk(c: JellyColor) = Grid.Cell(CellType.BLOCK, c)
    private fun sup(c: JellyColor, lvl: Int = 1) = Grid.Cell(CellType.BLOCK, c, superLevel = lvl)
    private val palette = arrayOf(JellyColor.YELLOW, JellyColor.MINT, JellyColor.PINK, JellyColor.BLUE)

    /** Map chuỗi ResolveEvent → GameEvent (như EndlessEngine) + PiecePlaced đầu. */
    private fun toGameEvents(placedCells: List<Vec>, re: List<ResolveEvent>): List<GameEvent> {
        val out = mutableListOf<GameEvent>()
        out.add(GameEvent.PiecePlaced(Piece(PieceLibrary.DOT, JellyColor.MINT), placedCells))
        for (e in re) when (e) {
            is ResolveEvent.LinesCleared -> out.add(GameEvent.LinesCleared(e.lines, e.cellsCleared, e.comboLevel, e.score))
            is ResolveEvent.ClustersCollapsed -> {}   // animator tự tính lại trọng lực
            is ResolveEvent.SuperFormed -> out.add(GameEvent.SuperFormed(e.at, e.color, e.level, e.source, e.absorbed))
            is ResolveEvent.SuperDetonated -> out.add(GameEvent.SuperDetonated(e.at, e.color, e.level, e.cells))
            is ResolveEvent.RainbowFormed -> out.add(GameEvent.RainbowFormed(e.at, e.absorbed))
        }
        return out
    }

    /** Chạy sim ~2.5s (qua hết nhịp + collapse + gap) để playback hoàn tất. */
    private fun runToEnd(anim: BoardAnimator) {
        var ms = 0L
        while (ms < 2500) { anim.step(GameClock.STEP_NANOS); ms += GameClock.STEP_NANOS / 1_000_000L }
    }

    @Test
    fun formation_playbackEndsWithSuper() {
        // Cụm 3×3 MINT (KHÔNG thành hàng/cột) thiếu (5,5); thả DOT vào (5,5) → hợp nhất siêu khối.
        val pre = Grid()
        for (dy in 0..2) for (dx in 0..2) if (!(dx == 2 && dy == 2)) pre.set(3 + dx, 3 + dy, blk(JellyColor.MINT))
        val placed = pre.copy().also { it.set(5, 5, blk(JellyColor.MINT)) }

        val work = placed.copy()
        val result = resolve(work, Direction.DOWN, startCombo = 0)
        assertTrue("phải có hợp nhất", result.events.any { it is ResolveEvent.SuperFormed })
        assertTrue("không xóa dòng", result.events.none { it is ResolveEvent.LinesCleared })

        val anim = BoardAnimator()
        anim.ingest(toGameEvents(listOf(Vec(5, 5)), result.events), pre, Direction.DOWN, work, Direction.DOWN)
        runToEnd(anim)

        // playback khớp truth engine: đúng 1 siêu khối MINT
        val g = anim.displayGrid!!
        var supers = 0
        for (y in 0 until Grid.SIZE) for (x in 0 until Grid.SIZE) {
            val c = g.get(x, y)
            if (c?.isSuper == true) { supers++; assertEquals(JellyColor.MINT, c.color) }
            assertEquals("ô ($x,$y) lệch truth", work.get(x, y), c)
        }
        assertEquals(1, supers)
    }

    @Test
    fun rainbow_playbackEndsWithRainbow() {
        // 3×3 ba màu mỗi màu 1 cột, thiếu (5,5); thả DOT vào (5,5) → khối cầu vồng.
        val pre = Grid()
        for (dy in 0..2) {
            pre.set(3, 3 + dy, blk(JellyColor.MINT))
            pre.set(4, 3 + dy, blk(JellyColor.PINK))
            if (dy != 2) pre.set(5, 3 + dy, blk(JellyColor.BLUE))
        }
        val placed = pre.copy().also { it.set(5, 5, blk(JellyColor.BLUE)) }

        val work = placed.copy()
        val result = resolve(work, Direction.DOWN, startCombo = 0)
        assertTrue("phải có cầu vồng", result.events.any { it is ResolveEvent.RainbowFormed })
        assertTrue("không siêu khối", result.events.none { it is ResolveEvent.SuperFormed })

        val anim = BoardAnimator()
        anim.ingest(toGameEvents(listOf(Vec(5, 5)), result.events), pre, Direction.DOWN, work, Direction.DOWN)
        runToEnd(anim)

        val g = anim.displayGrid!!
        var rainbows = 0
        for (y in 0 until Grid.SIZE) for (x in 0 until Grid.SIZE) {
            if (g.get(x, y)?.isRainbow == true) rainbows++
            assertEquals("ô ($x,$y) lệch truth", work.get(x, y), g.get(x, y))
        }
        assertEquals(1, rainbows)
    }

    @Test
    fun detonation_playbackClearsAllSameColor() {
        // Siêu khối MINT (4,4) sẵn trên bàn + vài khối MINT rải rác ở xa; hàng 4 (toàn pink/blue)
        // thiếu (8,4). Thả DOT vào (8,4) → hàng 4 đầy → nổ siêu khối → quét sạch MỌI ô MINT.
        val pre = Grid()
        pre.set(4, 4, sup(JellyColor.MINT))
        pre.set(0, 0, blk(JellyColor.MINT))   // mint xa → bị quét
        pre.set(8, 8, blk(JellyColor.MINT))   // mint xa → bị quét
        pre.set(1, 7, blk(JellyColor.PINK))   // khác màu → giữ
        for (x in 0 until 8) if (x != 4) pre.set(x, 4, blk(if (x % 2 == 0) JellyColor.PINK else JellyColor.BLUE))
        val placed = pre.copy().also { it.set(8, 4, blk(JellyColor.PINK)) }

        val work = placed.copy()
        val result = resolve(work, Direction.DOWN, startCombo = 0)
        assertTrue("phải có nổ siêu khối", result.events.any { it is ResolveEvent.SuperDetonated })

        val anim = BoardAnimator()
        anim.ingest(toGameEvents(listOf(Vec(8, 4)), result.events), pre, Direction.DOWN, work, Direction.DOWN)
        runToEnd(anim)

        val g = anim.displayGrid!!
        // không còn ô MINT nào trên bàn
        for (y in 0 until Grid.SIZE) for (x in 0 until Grid.SIZE) {
            assertTrue("ô MINT ($x,$y) phải bị quét", g.get(x, y)?.color != JellyColor.MINT)
        }
        // playback khớp truth engine
        for (y in 0 until Grid.SIZE) for (x in 0 until Grid.SIZE) {
            assertEquals("ô ($x,$y) lệch truth", work.get(x, y), g.get(x, y))
        }
    }
}
