package com.gravityjelly.game

/**
 * Easing + thời lượng cho lớp animation (khớp design 05-effects).
 * Tất cả thuần số học — gọi được trong vòng vẽ (không cấp phát).
 * Mọi thời lượng nằm trong 150–450ms (trừ combo popup ~900ms) theo token motion.
 */
internal object Anim {
    // thời lượng (nano giây)
    const val MS = 1_000_000L
    const val SQUASH_NANOS = 300 * MS      // squash + settle (150 + 150)
    const val SQUASH_PEAK_NANOS = 150 * MS // mốc chia 2 pha: nén-vào-đỉnh → giãn
    const val CLEAR_NANOS = 400 * MS       // flash 150 + pop 250
    const val CLEAR_LEAD_NANOS = 200 * MS  // bắt đầu rơi giữa nhịp xóa (ô đã pop gần hết)
    const val CLEAR_STAGGER_NANOS = 20 * MS // quét ~20ms/khối dọc dòng (spec line-clear)
    const val COLLAPSE_NANOS = 350 * MS    // cluster collapse slide
    const val CASCADE_GAP_NANOS = 300 * MS // nghỉ sau khi rơi+nhún xong rồi mới flash nhịp combo kế
    const val ROTATE_NANOS = 350 * MS      // gravity-rotate slide + pupil
    const val COMBO_NANOS = 900 * MS       // pop → float → fade (ngoại lệ ăn mừng)
    const val SCORE_POP_NANOS = 450 * MS   // score "+N" float (≤ 450ms theo token)
    const val PARTICLE_NANOS = 420 * MS    // ≤ 450ms (rule juice)

    /** Tỉ lệ pha flash trong tổng thời gian xóa (150ms / 400ms). */
    const val CLEAR_FLASH_FRAC = 0.375f

    fun lerp(a: Float, b: Float, t: Float): Float = a + (b - a) * t

    /** progress [0,1] an toàn. */
    fun clamp01(t: Float): Float = if (t < 0f) 0f else if (t > 1f) 1f else t

    fun easeIn(t: Float): Float { val x = clamp01(t); return x * x * x }

    fun easeOut(t: Float): Float { val x = 1f - clamp01(t); return 1f - x * x * x }

    fun easeInOut(t: Float): Float {
        val x = clamp01(t)
        return if (x < 0.5f) 4f * x * x * x else 1f - cube(-2f * x + 2f) / 2f
    }

    /** Overshoot mềm (cảm giác jelly) — vọt nhẹ rồi về. */
    fun easeOutBack(t: Float): Float {
        val x = clamp01(t)
        val c1 = 1.70158f
        val c3 = c1 + 1f
        val u = x - 1f
        return 1f + c3 * u * u * u + c1 * u * u
    }

    private fun cube(v: Float): Float = v * v * v
}
