package com.gravityjelly.game

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.drawscope.translate

/**
 * Expression variants cho mắt khối jelly.
 * SMUG: clip nửa dưới + xoay ±9°. FOCUS: iris tĩnh (pulsing → Prompt 05).
 */
enum class EyeExpression { NORMAL, FRONT, HAPPY, FOCUS, SMUG, WINK, SAD }

// ── màu nội bộ (INK #4A3526 từ Eyes.jsx) ────────────────────────────────────
private val EyeInk     = Color(0xFF4A3526)
private val EyeRim     = Color(0x4D4A3526)   // 30% opacity
private val Catchlight = Color(0xE6FFFFFF)   // 90% white

// ── cache Path + Stroke (rebuild khi eyeDiam/density thay đổi) ───────────────
private var cacheKey         = -1f
private val happyArcPath     = Path()
private val winkArcPath      = Path()
private var cachedRimStroke  = Stroke(1.5f)
private var cachedArcStroke  = Stroke(1f, cap = StrokeCap.Round)
private var cachedIrisStroke = Stroke(1.5f)

private fun ensureCache(eyeDiam: Float, density: Float) {
    val key = eyeDiam + density * 100_000f
    if (key == cacheKey) return
    cacheKey = key
    val s = eyeDiam / 24f
    happyArcPath.reset()
    happyArcPath.moveTo(3.5f * s, 16.5f * s)
    happyArcPath.quadraticTo(12f * s, 4.5f * s, 20.5f * s, 16.5f * s)
    winkArcPath.reset()
    winkArcPath.moveTo(3.5f * s, 15f * s)
    winkArcPath.quadraticTo(12f * s, 6f * s, 20.5f * s, 15f * s)
    cachedRimStroke  = Stroke(width = density * 1.5f)
    cachedArcStroke  = Stroke(width = eyeDiam * (3.4f / 24f), cap = StrokeCap.Round)
    cachedIrisStroke = Stroke(width = density * 1.5f)
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vẽ đôi mắt googly cho một khối jelly.
 *
 * [dirX],[dirY]: vector trọng lực (float, nội suy khi animation xoay).
 * [expression]: kiểu biểu cảm. [open]=false: nhắm (blink/squash).
 * [alpha]: độ mờ chung — driven bởi clearProgress từ drawJellyCell (mặc định 1).
 *
 * Allocation-free trong vòng vẽ: Path + Stroke tái dùng qua ensureCache.
 */
internal fun DrawScope.drawEyes(
    left: Float, top: Float, blockSize: Float,
    dirX: Float, dirY: Float,
    expression: EyeExpression = EyeExpression.NORMAL,
    open: Boolean = true,
    alpha: Float = 1f,
) {
    val eyeR    = blockSize * EYE_R_FRAC
    val eyeDiam = eyeR * 2f
    val pupilR  = eyeR * 0.52f
    val sparkR  = maxOf(density, pupilR * 0.34f)
    val eyeOff  = eyeR + blockSize * 0.06f
    val cx = left + blockSize / 2f
    val cy = top  + blockSize * EYE_Y_FRAC

    val travel = eyeR * 0.43f
    val pxOff  = dirX * travel
    val pyOff  = dirY * travel

    val lc = Offset(cx - eyeOff, cy)
    val rc = Offset(cx + eyeOff, cy)

    ensureCache(eyeDiam, density)

    // ── blink / squash ──────────────────────────────────────────────────────
    if (!open) {
        val shutH = maxOf(density * 2f, eyeR * 0.18f)
        drawOval(JellyTheme.eyeWhite,
            topLeft = Offset(lc.x - eyeR, lc.y - shutH / 2f),
            size    = Size(eyeDiam, shutH), alpha = alpha)
        drawOval(JellyTheme.eyeWhite,
            topLeft = Offset(rc.x - eyeR, rc.y - shutH / 2f),
            size    = Size(eyeDiam, shutH), alpha = alpha)
        return
    }

    // ── happy "^ ^" ─────────────────────────────────────────────────────────
    if (expression == EyeExpression.HAPPY) {
        translate(lc.x - eyeR, lc.y - eyeR) {
            drawPath(happyArcPath, EyeInk, alpha = alpha, style = cachedArcStroke)
        }
        translate(rc.x - eyeR, rc.y - eyeR) {
            drawPath(happyArcPath, EyeInk, alpha = alpha, style = cachedArcStroke)
        }
        return
    }

    // ── smug: mi nặng nửa mắt, nghiêng ra ngoài ────────────────────────────
    if (expression == EyeExpression.SMUG) {
        val lidH = maxOf(density * 2f, eyeR * 0.12f)
        rotate(9f, pivot = lc) {
            clipRect(lc.x - eyeR, lc.y, lc.x + eyeR, lc.y + eyeR) {
                drawEyeBall(lc, eyeR, pupilR, sparkR, 0f, 0f, alpha)
            }
            drawRect(EyeInk, topLeft = Offset(lc.x - eyeR, lc.y),
                size = Size(eyeDiam, lidH), alpha = alpha)
        }
        rotate(-9f, pivot = rc) {
            clipRect(rc.x - eyeR, rc.y, rc.x + eyeR, rc.y + eyeR) {
                drawEyeBall(rc, eyeR, pupilR, sparkR, 0f, 0f, alpha)
            }
            drawRect(EyeInk, topLeft = Offset(rc.x - eyeR, rc.y),
                size = Size(eyeDiam, lidH), alpha = alpha)
        }
        return
    }

    // ── wink: mắt trái bình thường, mắt phải cung nhắm ────────────────────
    if (expression == EyeExpression.WINK) {
        drawEyeBall(lc, eyeR, pupilR, sparkR, 0f, 0f, alpha)
        translate(rc.x - eyeR, rc.y - eyeR) {
            drawPath(winkArcPath, EyeInk, alpha = alpha, style = cachedArcStroke)
        }
        return
    }

    // ── sad "xịu buồn": con ngươi nhìn xuống + mí trên xịu chếch ra ngoài ──────
    // Tổ hợp từ vocabulary sẵn có (drawEyeBall + mí như SMUG nhưng ở NỬA TRÊN, dốc
    // inner-cao/outer-thấp) — design foundation chưa có mắt buồn nên dựng tối giản.
    if (expression == EyeExpression.SAD) {
        val lidH = eyeR * 0.55f          // mí trên phủ ~nửa trên mắt
        val droop = eyeR * 0.34f          // con ngươi trĩ xuống
        // mắt trái: mí dốc xuống phía ngoài (trái) ⇒ xoay CCW (âm) quanh tâm
        drawEyeBall(lc, eyeR, pupilR, sparkR, 0f, droop, alpha)
        rotate(-13f, pivot = lc) {
            clipRect(lc.x - eyeR, lc.y - eyeR, lc.x + eyeR, lc.y + eyeR) {
                drawRect(EyeInk, topLeft = Offset(lc.x - eyeR, lc.y - eyeR),
                    size = Size(eyeDiam, lidH), alpha = alpha)
            }
        }
        // mắt phải: mí dốc xuống phía ngoài (phải) ⇒ xoay CW (dương)
        drawEyeBall(rc, eyeR, pupilR, sparkR, 0f, droop, alpha)
        rotate(13f, pivot = rc) {
            clipRect(rc.x - eyeR, rc.y - eyeR, rc.x + eyeR, rc.y + eyeR) {
                drawRect(EyeInk, topLeft = Offset(rc.x - eyeR, rc.y - eyeR),
                    size = Size(eyeDiam, lidH), alpha = alpha)
            }
        }
        return
    }

    // ── normal / front / focus ───────────────────────────────────────────────
    val offX = if (expression == EyeExpression.FRONT || expression == EyeExpression.FOCUS) 0f else pxOff
    val offY = if (expression == EyeExpression.FRONT || expression == EyeExpression.FOCUS) 0f else pyOff
    drawEyeBall(lc, eyeR, pupilR, sparkR, offX, offY, alpha)
    drawEyeBall(rc, eyeR, pupilR, sparkR, offX, offY, alpha)

    if (expression == EyeExpression.FOCUS) {
        val irisR = eyeR * 0.86f
        drawCircle(EyeRim, irisR, lc, alpha = alpha, style = cachedIrisStroke)
        drawCircle(EyeRim, irisR, rc, alpha = alpha, style = cachedIrisStroke)
    }
}

private fun DrawScope.drawEyeBall(
    center: Offset,
    eyeR: Float, pupilR: Float, sparkR: Float,
    pupilDx: Float, pupilDy: Float,
    alpha: Float = 1f,
) {
    drawCircle(JellyTheme.eyeWhite, eyeR, center, alpha = alpha)
    drawCircle(EyeRim, eyeR - cachedRimStroke.width / 2f, center,
        alpha = alpha, style = cachedRimStroke)
    val pc = Offset(center.x + pupilDx, center.y + pupilDy)
    drawCircle(EyeInk, pupilR, pc, alpha = alpha)
    drawCircle(Catchlight, sparkR, Offset(pc.x + pupilR * 0.55f, pc.y - pupilR * 0.55f),
        alpha = alpha)
}
