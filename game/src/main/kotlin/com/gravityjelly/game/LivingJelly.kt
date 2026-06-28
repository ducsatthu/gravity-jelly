package com.gravityjelly.game

import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalDensity
import com.gravityjelly.core.Direction
import com.gravityjelly.core.Piece

/**
 * Khối jelly "sống" cho logo màn Home: nhìn thẳng người chơi, thi thoảng chớp mắt / nháy mắt,
 * và liếc sang một hướng rồi về thẳng — để nhân vật như đang sống.
 *
 * KHÔNG tự chế hiệu ứng: mọi behavior + timing bám đúng design effects (`design/.../05-effects`)
 * và foundation Eyes (`design/.../02-foundations/02-eyes/Eyes.jsx`). Tham chiếu:
 *  - Chớp mắt  (panel 7 "NHÌN THẲNG · chớp mắt"): expression=front, chu kỳ 2400ms, nhắm ~130ms,
 *    35% double-blink (lần 2 cách 300ms, ~120ms). drawEyes(open=false) = mắt dẹt (shutEye).
 *  - Nháy mắt  (panel 6 "NHÁY MẮT · chào người chơi"): front ↔ wink, chu kỳ 2200ms, giữ 420ms.
 *  - Liếc hướng (panel 2 rotate "swing to direction, then settle front"): liếc tới hướng cardinal,
 *    giữ ~600ms rồi về front; con ngươi chỉ trỏ các hướng cardinal/front như design (KHÔNG drift tự do).
 * Design squash chỉ xảy ra lúc VA CHẠM khi rơi (effect 01) — KHÔNG có "thở" idle, nên ở đây không squash.
 *
 * Chống giật (CLAUDE.md): một Canvas, vẽ allocation-free (Stroke/CornerRadius tái dùng; Path cache
 * trong drawEyes). Frame loop theo vsync [withFrameNanos]; Canvas đọc time-state TRONG draw phase
 * ⇒ chỉ invalidate draw, KHÔNG recompose mỗi frame.
 *
 * Deterministic: nhịp/pha + nhánh double-blink suy từ [seed] (hash, KHÔNG Random toàn cục). Mỗi khối
 * lệch pha nên không chớp/nháy đồng loạt. [glanceDir]: hướng liếc ưa thích (giữ chất design: pink←trái…).
 */
@Composable
fun LivingJellyThumbnail(
    piece: Piece,
    seed: Int,
    modifier: Modifier = Modifier,
    cellDp: Float? = null,
    glanceDir: Direction = Direction.DOWN,
) {
    val density = LocalDensity.current.density
    val timeMs = remember { mutableLongStateOf(0L) }
    LaunchedEffect(Unit) {
        var startNanos = 0L
        while (true) {
            withFrameNanos { now ->
                if (startNanos == 0L) startNanos = now
                timeMs.longValue = (now - startNanos) / 1_000_000L
            }
        }
    }

    // Pha lệch theo seed (giữ nguyên chu kỳ design, chỉ dời pha ⇒ các khối không đồng bộ).
    val blinkPhase = (seed * 877L) % BLINK_PERIOD_MS
    val winkPhase = (seed * 613L) % WINK_PERIOD_MS
    val glancePhase = (seed * 1009L) % GLANCE_PERIOD_MS
    val gdx = glanceDir.dx.toFloat()
    val gdy = glanceDir.dy.toFloat()

    Canvas(modifier) {
        val t = timeMs.longValue                       // ← draw-phase read

        // ── Nháy mắt (wink): front ↔ wink, ưu tiên cao nhất khi đang giữ ──
        val winkLocal = (t + winkPhase) % WINK_PERIOD_MS
        val winking = winkLocal < WINK_HOLD_MS

        // ── Chớp mắt (blink): nhắm cả hai; 35% double-blink (deterministic theo cycle) ──
        val blinkT = t + blinkPhase
        val blinkLocal = blinkT % BLINK_PERIOD_MS
        val blinkCycle = (blinkT / BLINK_PERIOD_MS).toInt()
        var closed = blinkLocal < BLINK_CLOSE_MS
        if (!closed && hash01(seed, blinkCycle) < DOUBLE_BLINK_PROB &&
            blinkLocal in DOUBLE_GAP_MS until (DOUBLE_GAP_MS + DOUBLE_CLOSE_MS)
        ) closed = true
        val blinking = closed && !winking          // wink giữ mắt mở (một bên cung nhắm)

        // ── Liếc hướng: ramp tới hướng cardinal, giữ, rồi về front (ease mềm) ──
        val glanceLocal = (t + glancePhase) % GLANCE_PERIOD_MS
        val frac = when {
            glanceLocal >= GLANCE_LOOK_MS -> 0f
            glanceLocal < GLANCE_RAMP_MS -> smoothstep(glanceLocal.toFloat() / GLANCE_RAMP_MS)
            glanceLocal > GLANCE_LOOK_MS - GLANCE_RAMP_MS ->
                smoothstep((GLANCE_LOOK_MS - glanceLocal).toFloat() / GLANCE_RAMP_MS)
            else -> 1f
        }

        // Chọn expression theo design: wink > liếc(normal) > nhìn thẳng(front). Blink override qua open.
        val expression: EyeExpression
        val dirX: Float
        val dirY: Float
        when {
            winking -> { expression = EyeExpression.WINK; dirX = 0f; dirY = 0f }
            frac > 0f -> { expression = EyeExpression.NORMAL; dirX = gdx * frac; dirY = gdy * frac }
            else -> { expression = EyeExpression.FRONT; dirX = 0f; dirY = 0f }
        }

        // ── Vẽ (giống drawPieceShape; mắt động, không squash) ──
        val sw = piece.shape.width
        val sh = piece.shape.height
        val cell = if (cellDp != null) cellDp * density
                   else size.minDimension / (maxOf(sw, sh) + 0.4f)
        val originX = (size.width - sw * cell) / 2f
        val originY = (size.height - sh * cell) / 2f

        val gap = cell * GAP_FRAC
        val blockSize = cell - gap
        val corner = blockSize * CORNER_FRAC
        val cr = CornerRadius(corner, corner)
        val borderStroke = Stroke(blockSize * BORDER_FRAC)
        val palette = JellyTheme.forColor(piece.color)
        val cells = piece.shape.cells
        for (i in cells.indices) {
            val c = cells[i]
            val left = originX + c.x * cell + gap / 2f
            val top = originY + c.y * cell + gap / 2f
            drawJellyBlock(left, top, blockSize, cr, borderStroke, palette)
            drawEyes(left, top, blockSize, dirX, dirY, expression, open = !blinking)
            drawSticker(piece.color, palette, left, top, blockSize)
        }
    }
}

// ── Hằng số timing — bám design 05-effects (đừng "tự chế", chỉnh thì sửa kèm tham chiếu) ──
// LƯU Ý: *_PERIOD (khoảng cách GIỮA các lần) được GIÃN so với effects.card.html — các số 2200/2400ms
// ở card là nhịp DEMO (lặp nhanh để xem hiệu ứng), không phải nhịp idle. Logo Home cần nhịp nghỉ chậm,
// tự nhiên. Còn THỜI LƯỢNG từng hành vi (nhắm 130ms, wink 420ms, double-blink) giữ ĐÚNG design.
private const val BLINK_PERIOD_MS = 5000L   // idle ~5s/lần (design demo: 2400) — chớp mắt thưa, tự nhiên
private const val BLINK_CLOSE_MS = 130L     // panel 7: close(130) — GIỮ
private const val DOUBLE_BLINK_PROB = 0.35f // panel 7: Math.random() < 0.35 — GIỮ
private const val DOUBLE_GAP_MS = 300L      // panel 7: setTimeout(..., 300) — GIỮ
private const val DOUBLE_CLOSE_MS = 120L    // panel 7: close(120) — GIỮ
private const val WINK_PERIOD_MS = 7000L    // idle ~7s/lần (design demo: 2200) — "now and then" wink
private const val WINK_HOLD_MS = 420L       // panel 6: setTimeout(..., 420) — GIỮ
private const val GLANCE_PERIOD_MS = 5500L  // liếc ~5.5s/lần (giãn cho đỡ "đảo mắt" liên tục)
private const val GLANCE_LOOK_MS = 900L     // giữ hướng ~0.9s rồi về front (panel 2 ~600; kéo dài cho êm)
private const val GLANCE_RAMP_MS = 320L      // ramp vào/ra ~motion-medium (350ms) ease-inout — chuyển con ngươi mượt

/** smoothstep ease (xấp xỉ ease-inout của design cho chuyển con ngươi). */
private fun smoothstep(x: Float): Float {
    val c = x.coerceIn(0f, 1f)
    return c * c * (3f - 2f * c)
}

/** Hash deterministic (seed, cycle) → [0,1). Thay cho Math.random() của design, KHÔNG Random toàn cục. */
private fun hash01(a: Int, b: Int): Float {
    var h = (a * 73856093) xor (b * 19349663)
    h = h xor (h ushr 13)
    h *= -1640531527
    h = h xor (h ushr 16)
    return ((h ushr 8) and 0xFFFF) / 65535f
}
