package com.gravityjelly.game

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.drawscope.translate
import com.gravityjelly.core.JellyColor

// Tỉ lệ từ JSX: s = Math.round(size*0.36); offset góc top=7%, right=7%
private const val STICKER_SIZE_FRAC = 0.36f
private const val STICKER_OFF_FRAC  = 0.07f
private const val STICKER_ROTATE    = -12f

// ── Cache Path + Stroke (rebuild khi stickerSize thay đổi) ───────────────────
private var cachedStickerSize   = -1f
private val starPath            = Path()
private val leafPath            = Path()
private val heartPath           = Path()
private val dropPath            = Path()
private var cachedFillStroke    = Stroke(1f, join = StrokeJoin.Round, cap = StrokeCap.Round)
private var cachedOutlineStroke = Stroke(1f, join = StrokeJoin.Round, cap = StrokeCap.Round)

private fun ensureStickerCache(stickerSize: Float) {
    if (stickerSize == cachedStickerSize) return
    cachedStickerSize = stickerSize
    val s = stickerSize / 24f   // scale viewBox 24×24 → stickerSize

    // ── star ☆ (yellow) ─ 5-pointed star, connected lines ───────────────────
    // SVG d: M12 2.4 l2.7 5.9 6.4.6 -4.8 4.3 1.4 6.3 L12 16.4 6.3 19.5 l1.4-6.3 L2.9 8.9 l6.4-.6 z
    starPath.reset()
    starPath.moveTo(12f * s, 2.4f * s)
    starPath.relativeLineTo( 2.7f * s,  5.9f * s)
    starPath.relativeLineTo( 6.4f * s,  0.6f * s)
    starPath.relativeLineTo(-4.8f * s,  4.3f * s)
    starPath.relativeLineTo( 1.4f * s,  6.3f * s)
    starPath.lineTo(12f * s, 16.4f * s)
    starPath.lineTo( 6.3f * s, 19.5f * s)
    starPath.relativeLineTo(1.4f * s, -6.3f * s)
    starPath.lineTo( 2.9f * s, 8.9f * s)
    starPath.relativeLineTo(6.4f * s, -0.6f * s)
    starPath.close()

    // ── leaf 🍃 (mint) ─ oval thân + vein chéo (stroke-only) ─────────────────
    // SVG d: M5 19 c0-8 6-14 14-14 0 8-6 14-14 14z m3.5-3.5 C13 14 16 11 17 7
    leafPath.reset()
    leafPath.moveTo(5f * s, 19f * s)
    leafPath.relativeCubicTo(   0f,      -8f * s,   6f * s, -14f * s,  14f * s, -14f * s)
    leafPath.relativeCubicTo(   0f,       8f * s,  -6f * s,  14f * s, -14f * s,  14f * s)
    leafPath.close()
    leafPath.moveTo(8.5f * s, 15.5f * s)       // m3.5 -3.5 từ (5,19) → tuyệt đối
    leafPath.cubicTo(13f * s, 14f * s, 16f * s, 11f * s, 17f * s, 7f * s)

    // ── heart ♥ (pink) ───────────────────────────────────────────────────────
    // SVG d: M12 20.7 l-1.5-1.4 C5.4 14.6 2 11.5 2 7.8 2 5.1 4.1 3 6.8 3
    //        8.3 3 9.8 3.8 12 6 14.2 3.8 15.7 3 17.2 3 19.9 3 22 5.1 22 7.8
    //        c0 3.7-3.4 6.8-8.5 11.5z
    heartPath.reset()
    heartPath.moveTo(12f * s, 20.7f * s)
    heartPath.relativeLineTo(-1.5f * s, -1.4f * s)
    heartPath.cubicTo( 5.4f * s, 14.6f * s,  2f * s, 11.5f * s,  2f * s,  7.8f * s)
    heartPath.cubicTo( 2f * s,   5.1f * s,  4.1f * s,  3f * s,  6.8f * s,  3f * s)
    heartPath.cubicTo( 8.3f * s,  3f * s,  9.8f * s,  3.8f * s, 12f * s,  6f * s)
    heartPath.cubicTo(14.2f * s,  3.8f * s, 15.7f * s,  3f * s, 17.2f * s,  3f * s)
    heartPath.cubicTo(19.9f * s,  3f * s,  22f * s,  5.1f * s,  22f * s,  7.8f * s)
    heartPath.relativeCubicTo(0f, 3.7f * s, -3.4f * s, 6.8f * s, -8.5f * s, 11.5f * s)
    heartPath.close()

    // ── droplet 💧 (blue) ────────────────────────────────────────────────────
    // SVG d: M12 3.2 c4 5 6 8 6 11 a6 6 0 1 1-12 0 c0-3 2-6 6-11z
    // Cung dưới: chord = diameter (12) → tâm (12, 14.2), r=6, start=0° sweep=180° CW
    dropPath.reset()
    dropPath.moveTo(12f * s, 3.2f * s)
    dropPath.relativeCubicTo(4f * s, 5f * s, 6f * s, 8f * s, 6f * s, 11f * s)
    dropPath.arcTo(
        rect              = Rect(6f * s, 8.2f * s, 18f * s, 20.2f * s),
        startAngleDegrees = 0f,
        sweepAngleDegrees = 180f,
        forceMoveTo       = false,
    )
    dropPath.relativeCubicTo(0f, -3f * s, 2f * s, -6f * s, 6f * s, -11f * s)
    dropPath.close()

    // Stroke scale từ strokeWidth trong viewBox 24px
    cachedFillStroke    = Stroke(width = stickerSize * (1.6f / 24f), join = StrokeJoin.Round, cap = StrokeCap.Round)
    cachedOutlineStroke = Stroke(width = stickerSize * (2.2f / 24f), join = StrokeJoin.Round, cap = StrokeCap.Round)
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vẽ sticker góc phải-trên khớp màu khối: ☆ yellow | 🍃 mint | ♥ pink | 💧 blue.
 * Stone không có sticker — chỉ gọi hàm này cho [CellType.BLOCK].
 * [alpha]: độ mờ chung — driven bởi clearProgress (mặc định 1).
 * Allocation-free trong vòng vẽ: Path + Stroke tái dùng qua [ensureStickerCache].
 */
internal fun DrawScope.drawSticker(
    color: JellyColor, palette: BlockPalette,
    left: Float, top: Float, blockSize: Float,
    alpha: Float = 1f,
) {
    val stickerSize = blockSize * STICKER_SIZE_FRAC
    ensureStickerCache(stickerSize)

    val sx = left + blockSize * (1f - STICKER_OFF_FRAC) - stickerSize
    val sy = top  + blockSize * STICKER_OFF_FRAC
    val pivotX = sx + stickerSize / 2f
    val pivotY = sy + stickerSize / 2f

    rotate(STICKER_ROTATE, pivot = Offset(pivotX, pivotY)) {
        translate(sx, sy) {
            when (color) {
                JellyColor.YELLOW -> {
                    drawPath(starPath,  palette.shine, alpha = alpha)
                    drawPath(starPath,  palette.edge,  alpha = alpha, style = cachedFillStroke)
                }
                JellyColor.MINT -> {
                    drawPath(leafPath, palette.edge, alpha = alpha, style = cachedOutlineStroke)
                }
                JellyColor.PINK -> {
                    drawPath(heartPath, palette.shine, alpha = alpha)
                    drawPath(heartPath, palette.edge,  alpha = alpha, style = cachedFillStroke)
                }
                JellyColor.BLUE -> {
                    drawPath(dropPath,  palette.shine, alpha = alpha)
                    drawPath(dropPath,  palette.edge,  alpha = alpha, style = cachedFillStroke)
                }
            }
        }
    }
}
