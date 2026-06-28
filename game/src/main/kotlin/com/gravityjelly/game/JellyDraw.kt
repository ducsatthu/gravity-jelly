package com.gravityjelly.game

import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.scale
import com.gravityjelly.core.Direction
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece

// Tỉ lệ dịch từ token (GjRadius.md=12dp / GjDimens.cell=36dp, GjBorder.jelly=3dp / 36dp)
internal const val GAP_FRAC           = 0.06f
const val TRAY_GAP_FRAC               = 0.10f       // khe rộng hơn cho khay (design Tray.jsx gap≈2dp/cell)
internal const val CORNER_FRAC        = 0.28f       // theo JellyBlock.jsx: Math.round(size*0.28) / size
internal const val BORDER_FRAC        = 3f / 36f    // GjBorder.jelly / GjDimens.cell ≈ 0.083
internal const val GLOSS_INSET_FRAC   = 0.12f       // inset ngang trái/phải 12%
internal const val GLOSS_HEIGHT_FRAC  = 0.34f       // chiều cao gloss 34%
internal const val GLOSS_TOP_OFF      = 2f / 36f    // offset từ đỉnh (2dp / cell 36dp)
internal const val GLOSS_ALPHA        = 0.85f       // độ mờ shine (theo design)
// Mắt — dùng bởi JellyEyes.kt (drawEyes) và drawStoneBlock
internal const val EYE_Y_FRAC         = 0.50f       // tâm Y mắt = giữa khối (theo JSX flex-center)
internal const val EYE_R_FRAC         = 0.13f       // bán kính lòng trắng = blockSize*0.26/2
internal const val STONE_EYE_OFF_FRAC = 0.12f       // offset tâm gạch đá từ tâm khối
internal const val STONE_DASH_W_FRAC  = 0.12f       // nửa chiều dài gạch ngang đá

/**
 * Vẽ một khối jelly theo đúng thứ tự lớp: fill → oval gloss → viền edge.
 * [borderStroke] truyền vào từ nơi precompute — tránh cấp phát Stroke mỗi lần gọi.
 * [alpha] cho phép mờ dần khi xóa hàng (clearProgress drive từ ngoài, mặc định = 1).
 */
internal fun DrawScope.drawJellyBlock(
    left: Float, top: Float, blockSize: Float,
    cr: CornerRadius, borderStroke: Stroke, palette: BlockPalette,
    alpha: Float = 1f,
) {
    val sz = Size(blockSize, blockSize)
    val off = Offset(left, top)
    drawRoundRect(palette.fill, off, sz, cr, alpha = alpha)
    val gi = blockSize * GLOSS_INSET_FRAC
    drawOval(
        color   = palette.shine,
        topLeft = Offset(left + gi, top + blockSize * GLOSS_TOP_OFF),
        size    = Size(blockSize - gi * 2, blockSize * GLOSS_HEIGHT_FRAC),
        alpha   = GLOSS_ALPHA * alpha,
    )
    drawRoundRect(palette.edge, off, sz, cr, alpha = alpha, style = borderStroke)
}

/**
 * Khối đá cố định: fill+gloss+viền từ stone palette + mắt ngủ (hai gạch ngang).
 * Màu gạch dùng stone.edge (xám ấm).
 */
internal fun DrawScope.drawStoneBlock(
    left: Float, top: Float, blockSize: Float,
    cr: CornerRadius, borderStroke: Stroke,
) {
    drawJellyBlock(left, top, blockSize, cr, borderStroke, JellyTheme.stone)
    val cx = left + blockSize / 2f
    val eyeY = top + blockSize * EYE_Y_FRAC
    val dashW = blockSize * STONE_DASH_W_FRAC
    val eyeOff = blockSize * STONE_EYE_OFF_FRAC
    val lineW = borderStroke.width * 0.8f
    drawLine(JellyTheme.stone.edge, Offset(cx - eyeOff - dashW, eyeY), Offset(cx - eyeOff + dashW, eyeY), lineW)
    drawLine(JellyTheme.stone.edge, Offset(cx + eyeOff - dashW, eyeY), Offset(cx + eyeOff + dashW, eyeY), lineW)
}

// drawEyes → xem JellyEyes.kt (đã được tách thành file riêng để hỗ trợ expression + blink)

/**
 * Vẽ một [piece] (mọi ô của shape) gốc ([originX],[originY]) với kích thước ô [cell].
 * Dùng cho khay 3 mảnh và mảnh đang kéo (floating). Mắt nhìn theo [gravity].
 * [showSticker] mặc định bật — tắt khi render ghost/highlight không cần chi tiết.
 */
internal fun DrawScope.drawPieceShape(
    piece: Piece,
    originX: Float, originY: Float,
    cell: Float,
    gravity: Direction = Direction.DOWN,
    showSticker: Boolean = true,
    gapFrac: Float = GAP_FRAC,
) {
    val gap = cell * gapFrac
    val blockSize = cell - gap
    val corner = blockSize * CORNER_FRAC
    val cr = CornerRadius(corner, corner)
    val borderStroke = Stroke(blockSize * BORDER_FRAC)
    val palette = JellyTheme.forColor(piece.color)
    val cells = piece.shape.cells
    for (i in cells.indices) {
        val c = cells[i]
        val left = originX + c.x * cell + gap / 2
        val top = originY + c.y * cell + gap / 2
        drawJellyBlock(left, top, blockSize, cr, borderStroke, palette)
        drawEyes(left, top, blockSize, gravity.dx.toFloat(), gravity.dy.toFloat())
        if (showSticker) drawSticker(piece.color, palette, left, top, blockSize)
    }
}

/**
 * Ô jelly đầy đủ state: squash + clear + sticker + mắt.
 * File 05 drive [squashScaleX/Y] và [clearProgress]; mặc định (1, 1, 0) = khối thường.
 *
 * [squashScaleX/Y]: scale theo trục ngang/dọc quanh tâm khối.
 * [clearProgress]: 0 = bình thường → 1 = pop-fade xong (scale ×1.12 + mờ về 0).
 * [showSticker]: false cho ghost/highlight; cũng tự ẩn khi squash đang chạy.
 */
internal fun DrawScope.drawJellyCell(
    left: Float, top: Float, blockSize: Float,
    cr: CornerRadius, borderStroke: Stroke,
    palette: BlockPalette, color: JellyColor,
    dirX: Float, dirY: Float,
    expression: EyeExpression = EyeExpression.NORMAL,
    eyeOpen: Boolean = true,
    squashScaleX: Float = 1f,
    squashScaleY: Float = 1f,
    clearProgress: Float = 0f,
    showSticker: Boolean = true,
) {
    // alpha: 1 → 0 khi clearProgress tăng (fade out)
    val clearAlpha  = if (clearProgress > 0f) 1f - clearProgress else 1f
    // scale phồng: 1 → 1.12 khi clearProgress tăng (pop bloom)
    val clearScale  = if (clearProgress > 0f) 1f + clearProgress * 0.12f else 1f

    // mắt nhắm khi squash mạnh (một trục nào đó < 0.92) HOẶC khi tính cách đang chớp ([eyeOpen]=false)
    val eyeOpenNow  = eyeOpen && squashScaleX >= 0.92f && squashScaleY >= 0.92f
    // sticker ẩn khi đang squash (như JSX !squashed)
    val drawStickerNow = showSticker && squashScaleX == 1f && squashScaleY == 1f

    val sx    = squashScaleX * clearScale
    val sy    = squashScaleY * clearScale
    val pivot = Offset(left + blockSize / 2f, top + blockSize / 2f)

    // KHÔNG gộp cụm — mỗi ô là khối jelly bo tròn RIÊNG (đúng design: JellyBlock
    // "never squared"). Xem memory ingame-endless-fidelity (quyết định: không gộp).
    fun body() {
        drawJellyBlock(left, top, blockSize, cr, borderStroke, palette, clearAlpha)
        drawEyes(left, top, blockSize, dirX, dirY, expression, eyeOpenNow, clearAlpha)
        if (drawStickerNow) drawSticker(color, palette, left, top, blockSize, clearAlpha)
    }

    if (sx != 1f || sy != 1f) scale(sx, sy, pivot) { body() } else body()
}
