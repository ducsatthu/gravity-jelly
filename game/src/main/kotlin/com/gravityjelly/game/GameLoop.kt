package com.gravityjelly.game

import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.withFrameNanos
import androidx.compose.runtime.LaunchedEffect

/**
 * Vòng lặp khung hình theo vsync bằng withFrameNanos (CLAUDE.md §chống giật).
 * Game state nằm NGOÀI Compose; loop chỉ tick sim + bump một biến để Canvas vẽ lại.
 * KHÔNG drive animation từng frame bằng recomposition của lớp vỏ.
 *
 * Stub khung: fixed-timestep tách khỏi render; alpha nội suy truyền cho renderer.
 */
class GameClock(
    private val stepNanos: Long = STEP_NANOS, // ~60Hz logic
) {
    private var accumulator = 0L
    private var last = 0L

    /** Trả về số bước sim cần chạy frame này (fixed-timestep). */
    fun advance(frameTimeNanos: Long, onStep: () -> Unit): Float {
        if (last == 0L) { last = frameTimeNanos; return 0f }
        accumulator += (frameTimeNanos - last)
        last = frameTimeNanos
        var steps = 0
        while (accumulator >= stepNanos && steps < MAX_STEPS) {
            onStep(); accumulator -= stepNanos; steps++
        }
        // Spiral-of-death guard: nếu chạm MAX_STEPS mà accumulator còn dư (delta khổng lồ
        // khi resume từ nền — withFrameNanos ngừng lúc ra nền nên frame đầu cộng cả khoảng
        // thời gian ở nền), vứt phần backlog, chỉ giữ phần lẻ < 1 step. Không làm vậy thì
        // accumulator dư rò rỉ vào alpha, thổi phồng renderNanos() và desync với simTimeNanos
        // → cascade/trọng lực đứng hình nhưng input lại mở khoá.
        if (accumulator >= stepNanos) accumulator %= stepNanos
        return (accumulator.toDouble() / stepNanos).toFloat() // alpha nội suy [0,1)
    }

    companion object {
        private const val MAX_STEPS = 5
        const val STEP_NANOS = 16_666_667L // ~60Hz
    }
}

/**
 * Driver Compose chạy GameClock + tick [animator] theo fixed-timestep,
 * ghi alpha nội suy vào animator, và phát renderTick để Canvas vẽ lại mỗi vsync.
 * Game state nằm NGOÀI Compose; KHÔNG drive animation bằng recomposition.
 */
@Composable
fun rememberGameDriver(animator: BoardAnimator): MutableState<Long> {
    val clock = remember { GameClock() }
    val renderTick = remember { mutableLongStateOf(0L) }
    LaunchedEffect(animator) {
        while (true) {
            withFrameNanos { t ->
                val alpha = clock.advance(t) { animator.step(GameClock.STEP_NANOS) }
                animator.renderAlpha = alpha
                renderTick.value = t
            }
        }
    }
    return renderTick
}
