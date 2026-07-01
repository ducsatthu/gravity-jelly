package com.gravityjelly.game

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Bất biến GAMECLOCK khi resume từ nền.
 *
 * Khi app ra nền, withFrameNanos ngừng gọi ⇒ [GameClock.last] đóng băng. Frame đầu sau khi
 * quay lại có delta = cả khoảng thời gian ở nền (hàng chục giây). Guard MAX_STEPS chặn số
 * step, nhưng nếu accumulator dư rò rỉ vào alpha thì renderNanos() bị thổi phồng và desync
 * với simTimeNanos ⇒ cascade/trọng lực đứng hình còn input lại mở khoá.
 *
 * Test chốt: dù delta lớn cỡ nào, alpha trả về LUÔN ở [0,1) và số step bị chặn ở MAX_STEPS.
 */
class GameClockResumeTest {

    private val step = GameClock.STEP_NANOS

    @Test
    fun `delta khong lo khi resume tu nen khong thoi phong alpha`() {
        val clock = GameClock()
        var t = 0L
        // Frame khởi tạo: advance đầu tiên chỉ ghi last, trả 0.
        assertEquals(0f, clock.advance(t) { }, 0f)

        // Chạy vài frame bình thường (~16.6ms/frame) cho ổn định.
        repeat(5) {
            t += step
            clock.advance(t) { }
        }

        // Mô phỏng ra nền 30s rồi quay lại: một frame với delta khổng lồ.
        t += 30_000_000_000L
        var steps = 0
        val alpha = clock.advance(t) { steps++ }

        // Số step bị chặn (không cố "đuổi" 30s sim), alpha KHÔNG phồng.
        assertEquals("phải chặn ở MAX_STEPS", 5, steps)
        assertTrue("alpha phải < 1 (nhận được $alpha)", alpha < 1f)
        assertTrue("alpha phải >= 0 (nhận được $alpha)", alpha >= 0f)
    }

    @Test
    fun `frame binh thuong alpha van o khoang mot phan step`() {
        val clock = GameClock()
        // frameTimeNanos từ Choreographer luôn lớn (nanoTime), không bao giờ 0.
        var t = 1_000_000_000L
        clock.advance(t) { }
        // Nhích nửa step: chưa đủ một step ⇒ 0 step, alpha ~0.5.
        t += step / 2
        var steps = 0
        val alpha = clock.advance(t) { steps++ }
        assertEquals(0, steps)
        assertTrue("alpha ~0.5 (nhận được $alpha)", alpha in 0.4f..0.6f)
    }
}
