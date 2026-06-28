package com.gravityjelly.game

import com.gravityjelly.core.JellyColor

/**
 * Tính cách mắt theo MÀU cho khối jelly đang đứng yên trên bàn.
 *
 * Vì sao có file này: design Eyes.jsx mặc định "mắt nhìn về hướng trọng lực" (block nhìn
 * theo hướng nó sẽ đổ). Trên bàn điều đó khiến MỌI mắt đông cứng cùng một hướng. Yêu cầu:
 * sau khi rơi/đứng yên, mắt KHÔNG cố định mà mỗi màu có một tính cách riêng.
 *
 * KHÔNG bịa expression/hiệu ứng mới: chỉ TỔ HỢP đúng 6 expression của design system
 * (normal/front/happy/focus/smug/wink + blink) — xem `02-foundations/02-eyes/Eyes.jsx`.
 * Mọi THỜI LƯỢNG hành vi (nhắm 130ms, wink 420ms, double-blink, happy bob 700ms, glance ramp)
 * lấy ĐÚNG từ `05-effects/effects.card.html`. Còn CHU KỲ idle (3–7s) theo cùng quy ước đã chốt
 * ở [LivingJellyThumbnail] (số 2200/2400ms ở card là nhịp DEMO, không phải nhịp idle).
 *
 * Mapping 4 màu (do người chơi chốt):
 *   - YELLOW — vui nhộn   : hay nháy mắt (wink) + thỉnh thoảng happy "^ ^".
 *   - MINT   — thư thái   : chớp mắt nhiều, nhìn thẳng bình thản, liếc chậm.
 *   - PINK   — tinh nghịch: wink + happy thường xuyên hơn yellow.
 *   - BLUE   — nghiêm túc : thỉnh thoảng focus (nhìn người chơi) + smug squint, ít chớp.
 *
 * Quy tắc gravity↔tính cách (do người chơi chốt): khi vừa có sự kiện (đặt/xoay/xóa), [settle]≈1
 * ⇒ mắt nhìn theo trọng lực (giữ đúng design). Bàn yên dần ⇒ [settle]→0 ⇒ con ngươi trượt về giữa
 * rồi tính cách riêng tiếp quản. Settle do [BoardAnimator.settleFactor] cấp (board-wide). Tính cách
 * idle lệch pha theo TỪNG Ô (deterministic theo x,y,color) nên không đồng loạt.
 *
 * Allocation-free: ghi kết quả vào [EyeRender] tái dùng; chỉ số học + hash, không cấp phát.
 */

/** Kết quả mắt một ô (tái dùng một instance — KHÔNG cấp phát trong vòng vẽ). */
internal class EyeRender {
    var expression: EyeExpression = EyeExpression.FRONT
    var dirX: Float = 0f
    var dirY: Float = 0f
    var open: Boolean = true
}

// ── Thời lượng hành vi — ĐÚNG design (effects.card.html / Eyes.jsx) ─────────────
private const val BLINK_CLOSE_MS = 130L     // panel 7: close(130)
private const val DOUBLE_GAP_MS = 300L      // panel 7: setTimeout(..., 300)
private const val DOUBLE_CLOSE_MS = 120L    // panel 7: close(120)
private const val WINK_HOLD_MS = 420L       // panel 6: wink giữ 420ms
private const val HAPPY_HOLD_MS = 700L      // gjEyeJoy 700ms (một nhịp bob vui)
private const val GLANCE_RAMP_MS = 320L     // ~motion-medium ease-inout chuyển con ngươi
// Hold cho focus/smug: design không nêu thời lượng idle riêng ⇒ tổ hợp trong dải motion,
// đủ đọc được "kéo focus" / "nhếch mép" rồi về. (Ghi rõ: số idle-hold, không phải token cứng.)
private const val FOCUS_HOLD_MS = 1000L
private const val SMUG_HOLD_MS = 900L

// ── Chu kỳ idle theo tính cách (3–7s, quy ước idle như LivingJelly) ─────────────
// Chớp mắt: tất cả tính cách dùng chu kỳ RẤT THƯA ~20s (chớp hiếm, gần như chỉ nhìn).
private const val BLINK_PERIOD = 20_000L
// YELLOW vui nhộn: wink/happy vừa phải, tươi.
private const val Y_WINK_PERIOD = 4500L
private const val Y_HAPPY_PERIOD = 6500L
private const val Y_BLINK_PERIOD = BLINK_PERIOD
// PINK tinh nghịch: wink/happy DÀY hơn yellow.
private const val P_WINK_PERIOD = 3200L
private const val P_HAPPY_PERIOD = 5200L
private const val P_BLINK_PERIOD = BLINK_PERIOD
// MINT thư thái/điềm tĩnh: PHẦN LỚN nhìn thẳng người chơi, chớp mắt thưa; rất thi thoảng liếc chậm.
private const val M_BLINK_PERIOD = BLINK_PERIOD
private const val M_GLANCE_PERIOD = 20_000L // liếc rất hiếm (chủ yếu vẫn nhìn thẳng)
private const val M_GLANCE_LOOK = 1100L     // giữ hướng ~1.1s rồi về thẳng
private const val M_BLINK_PROB = 0.3f       // ít double-blink
// BLUE nghiêm túc: focus/smug thưa, ít chớp.
private const val B_FOCUS_PERIOD = 5200L
private const val B_SMUG_PERIOD = 7600L
private const val B_BLINK_PERIOD = BLINK_PERIOD

private const val DEFAULT_BLINK_PROB = 0.35f // panel 7: Math.random() < 0.35

/**
 * Giải mắt cho một ô bàn. Ghi vào [out].
 * [tMs]: thời gian sim (ms). [settle]: 1 = nhìn trọng lực, 0 = tính cách. [gravX/Y]: vector nhìn
 * khi đang theo trọng lực (có thể là con ngươi nội suy lúc xoay).
 */
internal fun resolveBoardEye(
    out: EyeRender,
    color: JellyColor,
    x: Int, y: Int,
    tMs: Long,
    settle: Float,
    gravX: Float, gravY: Float,
) {
    // Đang/ vừa có sự kiện: nhìn theo trọng lực; settle giảm ⇒ con ngươi trượt từ trọng lực về giữa.
    // Tại settle==0 mới mở khoá tính cách (special expression) ⇒ chuyển tiếp mượt (front ≡ normal dir 0).
    if (settle > 0f) {
        out.expression = EyeExpression.NORMAL
        out.open = true
        out.dirX = gravX * settle
        out.dirY = gravY * settle
        return
    }

    val seed = cellSeed(x, y, color)
    when (color) {
        JellyColor.YELLOW -> winkyHappy(out, tMs, seed, Y_WINK_PERIOD, Y_HAPPY_PERIOD, Y_BLINK_PERIOD)
        JellyColor.PINK   -> winkyHappy(out, tMs, seed, P_WINK_PERIOD, P_HAPPY_PERIOD, P_BLINK_PERIOD)
        JellyColor.MINT   -> calm(out, tMs, seed)
        JellyColor.BLUE   -> serious(out, tMs, seed)
    }
}

/** YELLOW & PINK: happy "^ ^" (ưu tiên) > wink chào > nhìn thẳng + chớp mắt. */
private fun winkyHappy(
    out: EyeRender, t: Long, seed: Int,
    winkPeriod: Long, happyPeriod: Long, blinkPeriod: Long,
) {
    out.dirX = 0f; out.dirY = 0f; out.open = true
    if (inHold(t, phase(seed, 0x9E37, happyPeriod), happyPeriod, HAPPY_HOLD_MS)) {
        out.expression = EyeExpression.HAPPY; return
    }
    if (inHold(t, phase(seed, 0x85EB, winkPeriod), winkPeriod, WINK_HOLD_MS)) {
        out.expression = EyeExpression.WINK; return
    }
    out.expression = EyeExpression.FRONT
    out.open = !blinkClosed(t, phase(seed, 0xC2B2, blinkPeriod), blinkPeriod, DEFAULT_BLINK_PROB, seed)
}

/** MINT: nhìn thẳng bình thản + liếc chậm theo một hướng cardinal + chớp mắt dày. */
private fun calm(out: EyeRender, t: Long, seed: Int) {
    val frac = glanceFrac(t, phase(seed, 0x1009, M_GLANCE_PERIOD), M_GLANCE_PERIOD, M_GLANCE_LOOK)
    // hướng liếc cardinal cố định theo ô (deterministic, không drift tự do — đúng tinh thần design)
    val dir = seed and 3
    val gx = if (dir == 2) -1f else if (dir == 3) 1f else 0f
    val gy = if (dir == 0) 1f else if (dir == 1) -1f else 0f
    out.dirX = gx * frac
    out.dirY = gy * frac
    out.expression = if (frac > 0f) EyeExpression.NORMAL else EyeExpression.FRONT
    out.open = !blinkClosed(t, phase(seed, 0x27D4, M_BLINK_PERIOD), M_BLINK_PERIOD, M_BLINK_PROB, seed)
}

/** BLUE: thỉnh thoảng smug (ưu tiên) / focus nhìn người chơi; còn lại nhìn thẳng, ít chớp. */
private fun serious(out: EyeRender, t: Long, seed: Int) {
    out.dirX = 0f; out.dirY = 0f; out.open = true
    if (inHold(t, phase(seed, 0x6A09, B_SMUG_PERIOD), B_SMUG_PERIOD, SMUG_HOLD_MS)) {
        out.expression = EyeExpression.SMUG; return
    }
    if (inHold(t, phase(seed, 0xBB67, B_FOCUS_PERIOD), B_FOCUS_PERIOD, FOCUS_HOLD_MS)) {
        out.expression = EyeExpression.FOCUS; return
    }
    out.expression = EyeExpression.FRONT
    out.open = !blinkClosed(t, phase(seed, 0x3C6E, B_BLINK_PERIOD), B_BLINK_PERIOD, DEFAULT_BLINK_PROB, seed)
}

// ── helpers (thuần số học, không cấp phát) ──────────────────────────────────────

/** Cửa sổ "đang diễn ra" của một hành vi tuần hoàn. */
private fun inHold(t: Long, phase: Long, period: Long, hold: Long): Boolean =
    (t + phase) % period < hold

/**
 * Chớp mắt deterministic + double-blink (đúng panel 7): nhắm [BLINK_CLOSE_MS]; có [prob] xác suất
 * nhắm lần 2 cách [DOUBLE_GAP_MS] trong [DOUBLE_CLOSE_MS]. Thay Math.random() bằng hash(seed,cycle).
 */
private fun blinkClosed(t: Long, phase: Long, period: Long, prob: Float, seed: Int): Boolean {
    val bt = t + phase
    val local = bt % period
    val cycle = (bt / period).toInt()
    if (local < BLINK_CLOSE_MS) return true
    if (hash01(seed, cycle) < prob && local in DOUBLE_GAP_MS until (DOUBLE_GAP_MS + DOUBLE_CLOSE_MS)) return true
    return false
}

/** Liếc: ramp vào/giữ/ramp ra (smoothstep ≈ ease-inout). Trả [0,1] cho biên độ con ngươi. */
private fun glanceFrac(t: Long, phase: Long, period: Long, look: Long): Float {
    val local = (t + phase) % period
    return when {
        local >= look -> 0f
        local < GLANCE_RAMP_MS -> smoothstep(local.toFloat() / GLANCE_RAMP_MS)
        local > look - GLANCE_RAMP_MS -> smoothstep((look - local).toFloat() / GLANCE_RAMP_MS)
        else -> 1f
    }
}

/** Pha lệch theo ô: ổn định trong [0,period) từ (seed, salt). */
private fun phase(seed: Int, salt: Int, period: Long): Long {
    val h = (seed * salt) and 0x7FFFFFFF
    return h % period
}

/** Seed deterministic cho một ô (x,y,color) — KHÔNG Random toàn cục. */
private fun cellSeed(x: Int, y: Int, color: JellyColor): Int {
    var h = (x * 73856093) xor (y * 19349663) xor (color.ordinal * 83492791)
    h = h xor (h ushr 13)
    h *= -1640531527
    return h xor (h ushr 16)
}

private fun smoothstep(x: Float): Float {
    val c = x.coerceIn(0f, 1f)
    return c * c * (3f - 2f * c)
}

private fun hash01(a: Int, b: Int): Float {
    var h = (a * 73856093) xor (b * 19349663)
    h = h xor (h ushr 13)
    h *= -1640531527
    h = h xor (h ushr 16)
    return ((h ushr 8) and 0xFFFF) / 65535f
}
