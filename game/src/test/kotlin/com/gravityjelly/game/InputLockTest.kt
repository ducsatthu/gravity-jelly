package com.gravityjelly.game

import com.gravityjelly.core.CellType
import com.gravityjelly.core.ClearedLines
import com.gravityjelly.core.Direction
import com.gravityjelly.core.GameEvent
import com.gravityjelly.core.Grid
import com.gravityjelly.core.JellyColor
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Khoá input khi bàn đang chiếu cascade ([BoardAnimator.isPlaying]). Ngăn lỗi: người chơi thả/xoay
 * trong lúc animation rơi chưa xong → cắt ngang ("không thấy rơi") + thả theo bàn trung gian
 * trong khi engine đã resolve ("rơi nhảy đột ngột sau khi thả block kế").
 */
class InputLockTest {

    private fun blk(c: JellyColor) = Grid.Cell(CellType.BLOCK, c)

    /** Một nhịp xóa thật: bàn có hàng đáy đầy → event LinesCleared cho animator dựng playback. */
    private fun ingestClearBeat(anim: BoardAnimator) {
        val pre = Grid()
        for (x in 0 until Grid.SIZE) pre.set(x, 8, blk(JellyColor.YELLOW))   // hàng đáy đầy
        val post = pre.copy()
        for (x in 0 until Grid.SIZE) post.set(x, 8, null)                    // engine đã xóa
        val lines = ClearedLines(rows = listOf(8), cols = emptyList())
        val events = listOf<GameEvent>(GameEvent.LinesCleared(lines, cellsCleared = 9, comboLevel = 1, score = 9))
        anim.ingest(events, pre, Direction.DOWN, post, Direction.DOWN)
    }

    @Test
    fun isPlaying_true_during_cascade_then_false_after_drain() {
        val anim = BoardAnimator()
        assertFalse("nghỉ ban đầu không khoá", anim.isPlaying)

        ingestClearBeat(anim)
        assertTrue("ngay sau ingest cascade → đang chiếu, khoá input", anim.isPlaying)

        // còn đang chiếu giữa chừng (vài trăm ms)
        repeat(20) { anim.step(GameClock.STEP_NANOS) }
        assertTrue("giữa cascade vẫn khoá", anim.isPlaying)

        // chạy hết
        repeat(1200) { anim.step(GameClock.STEP_NANOS) }
        assertFalse("cascade xong → mở khoá", anim.isPlaying)
    }

    @Test
    fun place_only_squash_does_not_lock() {
        val anim = BoardAnimator()
        val pre = Grid()
        val post = pre.copy().also { it.set(4, 8, blk(JellyColor.MINT)) }
        val events = listOf<GameEvent>(
            GameEvent.PiecePlaced(
                com.gravityjelly.core.Piece(com.gravityjelly.core.PieceLibrary.O4, JellyColor.MINT),
                listOf(com.gravityjelly.core.Vec(4, 8)),
            ),
        )
        anim.ingest(events, pre, Direction.DOWN, post, Direction.DOWN)
        // đặt mảnh trơn (không xóa, bàn không đổi topo) → KHÔNG khoá, người chơi đặt tiếp được ngay
        assertFalse("đặt trơn chỉ squash, không khoá input", anim.isPlaying)
    }
}
