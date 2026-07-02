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

/**
 * Ô DÂY LEO (World 2): nền jelly mint (obstacle bám rễ) + mầm cây bám vine glyph design
 * (`ObjectiveBar.jsx` VineGlyph — thân + 2 lá mint). GỐC ([root]) thêm ụ đất nâu `#C7A97E` ở đáy +
 * viền đậm hơn để báo "đây là target cần phá". Không mắt (khác jelly sống).
 */
internal fun DrawScope.drawVineCell(
    left: Float, top: Float, blockSize: Float,
    cr: CornerRadius, borderStroke: Stroke, root: Boolean,
) {
    drawJellyBlock(left, top, blockSize, cr, borderStroke, JellyTheme.mint)
    val cx = left + blockSize / 2f
    val stem = JellyTheme.mint.edge
    val leaf = JellyTheme.mint.fill
    // Ụ đất nâu ở đáy gốc.
    if (root) {
        drawOval(
            color = MOUND_BROWN,
            topLeft = Offset(left + blockSize * 0.18f, top + blockSize * 0.72f),
            size = Size(blockSize * 0.64f, blockSize * 0.2f),
        )
    }
    // Thân mầm (đường dọc từ ~0.78 lên ~0.42).
    val stemW = blockSize * 0.09f
    drawLine(stem, Offset(cx, top + blockSize * 0.78f), Offset(cx, top + blockSize * 0.42f), stemW)
    // Hai lá (oval nghiêng hai bên đỉnh thân).
    val lr = blockSize * 0.17f
    drawOval(leaf, Offset(cx - lr * 1.7f, top + blockSize * 0.34f), Size(lr * 1.6f, lr))
    drawOval(leaf, Offset(cx + lr * 0.1f, top + blockSize * 0.30f), Size(lr * 1.6f, lr))
    // Viền target đậm cho gốc (vẽ chồng viền edge dày hơn).
    if (root) {
        drawRoundRect(
            stem, Offset(left, top), Size(blockSize, blockSize), cr,
            style = Stroke(borderStroke.width * 1.6f),
        )
    }
}

private val MOUND_BROWN = androidx.compose.ui.graphics.Color(0xFFC7A97E)

// Ô ĐÍCH "giọt nước" (World 3): palette info/nước design — accent #EAFAFB, info #8FB6F2.
private val DROP_WATER = androidx.compose.ui.graphics.Color(0xFFEAFAFB)  // bọt/nước sáng
private val DROP_EDGE  = androidx.compose.ui.graphics.Color(0xFF8FB6F2)  // info — viền target
private val DROP_SHINE = androidx.compose.ui.graphics.Color(0xCCFFFFFF)  // đốm sáng đỉnh

/**
 * Ô ĐÍCH "giọt nước" (World 3 · Sông & Thác): nền jelly xanh dương (rơi & đếm-đầy như ô thường) +
 * GIỌT NƯỚC trắng-nước ở giữa + viền info đậm báo "đây là target cần xoá". Không mắt (khác jelly sống).
 * Bám palette design (info #8FB6F2, accent nước #EAFAFB).
 */
internal fun DrawScope.drawDropCell(
    left: Float, top: Float, blockSize: Float,
    cr: CornerRadius, borderStroke: Stroke,
) {
    drawJellyBlock(left, top, blockSize, cr, borderStroke, JellyTheme.blue)
    val bs = blockSize
    val cx = left + bs / 2f
    // Giọt nước hình teardrop: đỉnh nhọn, đáy tròn.
    val tipY = top + bs * 0.22f
    val botY = top + bs * 0.80f
    val rw = bs * 0.22f
    val drop = androidx.compose.ui.graphics.Path().apply {
        moveTo(cx, tipY)
        cubicTo(cx + rw, top + bs * 0.40f, cx + rw, top + bs * 0.64f, cx, botY)
        cubicTo(cx - rw, top + bs * 0.64f, cx - rw, top + bs * 0.40f, cx, tipY)
        close()
    }
    drawPath(drop, DROP_WATER)
    drawPath(drop, DROP_EDGE, style = Stroke(borderStroke.width * 0.9f))
    // Đốm sáng nhỏ lệch trái-trên trong giọt.
    drawCircle(DROP_SHINE, radius = bs * 0.07f, center = Offset(cx - bs * 0.07f, top + bs * 0.52f))
    // Viền target đậm quanh ô (như gốc dây leo) để báo mục tiêu.
    drawRoundRect(
        DROP_EDGE, Offset(left, top), Size(bs, bs), cr,
        style = Stroke(borderStroke.width * 1.6f),
    )
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
