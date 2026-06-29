package com.gravityjelly.game

import com.gravityjelly.core.Direction
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Xoay trọng lực bị KHOÁ cho tới khi slide xoay (và mọi flash kéo theo) chiếu xong:
 * không cho xoay lần kế khi bàn "chưa di chuyển hết / chưa flash thành công" (yêu cầu người chơi).
 */
class RotateLockTest {

    @Test
    fun second_rotate_blocked_until_first_rotation_playback_done() {
        val holder = EndlessGameHolder(seed = 7L)
        val budget0 = holder.shell.budget
        val grav0 = holder.boardRender.gravity
        assertTrue("cần budget xoay để test", budget0 >= 2)

        // Xoay lần 1 → engine xoay + animator bắt đầu chiếu slide xoay.
        holder.rotate(cw = true)
        val budget1 = holder.shell.budget
        val grav1 = holder.boardRender.gravity
        assertEquals("xoay 1 trừ 1 lượt", budget0 - 1, budget1)
        assertNotEquals("hướng trọng lực đã đổi", grav0, grav1)
        assertTrue("ngay sau xoay → đang chiếu, khoá", holder.animator.isPlaying)

        // Xoay lần 2 NGAY khi còn đang chiếu → bị bỏ qua (budget & hướng giữ nguyên).
        holder.rotate(cw = true)
        assertEquals("xoay 2 bị chặn → budget không đổi", budget1, holder.shell.budget)
        assertEquals("xoay 2 bị chặn → hướng không đổi", grav1, holder.boardRender.gravity)

        // Chạy hết slide xoay → mở khoá → xoay lại được.
        repeat(60) { holder.animator.step(GameClock.STEP_NANOS) }   // >350ms (ROTATE_NANOS)
        assertTrue("slide xoay xong → hết khoá", !holder.animator.isPlaying)

        holder.rotate(cw = true)
        assertEquals("hết khoá → xoay được, trừ tiếp 1 lượt", budget1 - 1, holder.shell.budget)
    }
}
