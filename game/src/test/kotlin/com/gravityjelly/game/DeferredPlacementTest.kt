package com.gravityjelly.game

import com.gravityjelly.core.CellType
import com.gravityjelly.core.ClearedLines
import com.gravityjelly.core.Direction
import com.gravityjelly.core.GameEvent
import com.gravityjelly.core.Grid
import com.gravityjelly.core.JellyColor
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Đặt-HOÃN khi bàn đang chiếu cascade: KHÔNG chặn cú kéo của người chơi (đỡ lỡ nhịp), nhưng việc
 * ĐẶT block chỉ thành công SAU khi cascade chiếu xong — đúng truth mà ghost đã neo. Đảo hành vi
 * cũ "chặn cứng beginDrag khi isPlaying".
 */
class DeferredPlacementTest {

    private fun blk(c: JellyColor) = Grid.Cell(CellType.BLOCK, c)

    /** Ép animator vào trạng thái đang chiếu cascade (một nhịp xóa) — KHÔNG đụng engine/boardRender. */
    private fun forceCascade(holder: EndlessGameHolder) {
        val pre = Grid()
        for (x in 0 until Grid.SIZE) pre.set(x, 8, blk(JellyColor.YELLOW))   // hàng đáy đầy
        val post = pre.copy()
        for (x in 0 until Grid.SIZE) post.set(x, 8, null)                    // engine đã xóa
        val lines = ClearedLines(rows = listOf(8), cols = emptyList())
        val events = listOf<GameEvent>(GameEvent.LinesCleared(lines, cellsCleared = 9, comboLevel = 1, score = 9))
        holder.animator.ingest(events, pre, Direction.DOWN, post, Direction.DOWN)
    }

    private fun filledCells(grid: Grid): Int {
        var n = 0
        for (y in 0 until Grid.SIZE) for (x in 0 until Grid.SIZE) if (grid.get(x, y) != null) n++
        return n
    }

    @Test
    fun drop_during_cascade_is_deferred_then_applied_when_playback_ends() {
        val holder = EndlessGameHolder(seed = 42L)
        holder.density = 1f
        holder.setBoardBounds(0f, 0f, 900f)   // cell = 100px
        val tray0 = holder.shell.tray.size
        assertEquals("bàn khởi tạo rỗng", 0, filledCells(holder.boardRender.grid))

        forceCascade(holder)
        assertTrue("đang chiếu cascade", holder.animator.isPlaying)

        // CHO PHÉP kéo dù đang cascade (trước đây bị chặn cứng).
        assertTrue("kéo không bị chặn khi cascade", holder.beginDrag(0))
        holder.dragTo(450f, 550f)
        assertNotNull("ghost hiện chỗ dự kiến", holder.boardRender.ghost)

        // Thả khi cascade còn chạy → HOÃN: ghost giữ, mảnh nổi mất, engine CHƯA đổi.
        holder.commitDrag()
        assertNull("ngón nhả → bỏ mảnh nổi", holder.dragPiece)
        assertNotNull("ghost giữ tại chỗ dự kiến (đánh dấu nước chờ)", holder.boardRender.ghost)
        assertEquals("chưa đặt: bàn chưa đổi", 0, filledCells(holder.boardRender.grid))
        assertEquals("chưa đặt: khay chưa rút", tray0, holder.shell.tray.size)

        // Còn nước chờ → kéo tiếp bị khoan (giữ một nước chờ mỗi lúc).
        assertFalse("đang có nước chờ → khoan kéo tiếp", holder.beginDrag(1))

        // Chiếu hết cascade → tự áp nước chờ ngay khi playback kết thúc.
        repeat(1200) { holder.animator.step(GameClock.STEP_NANOS) }
        assertNull("đã áp → ghost dọn", holder.boardRender.ghost)
        assertTrue("đặt thành công: bàn có khối", filledCells(holder.boardRender.grid) > 0)
        assertEquals("đặt thành công: khay rút 1", tray0 - 1, holder.shell.tray.size)
    }
}
