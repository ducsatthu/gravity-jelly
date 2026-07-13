package com.gravityjelly.game

import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.drawscope.translate
import com.gravityjelly.core.Direction
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece

// Tỉ lệ dịch từ token (GjRadius.md=12dp / GjDimens.cell=36dp, GjBorder.jelly=3dp / 36dp)
internal const val GAP_FRAC           = 0.06f
const val TRAY_GAP_FRAC               = 0.10f       // khe rộng hơn cho khay (design Tray.jsx gap≈2dp/cell)
// Khay nhích thân khối lên: nuốt bớt gờ-bóng đáy của art (chiếu-sáng-từ-trên) cho bớt cảm giác
// nặng đáy khi khối đứng riêng trong ô khay. CHỈ áp ở tray (board/drag/logo giữ nguyên art gốc).
const val TRAY_BODY_LIFT_FRAC         = 0.05f
internal const val CORNER_FRAC        = 0.28f       // theo JellyBlock.jsx: Math.round(size*0.28) / size
internal const val BORDER_FRAC        = 3f / 36f    // GjBorder.jelly / GjDimens.cell ≈ 0.083
internal const val GLOSS_INSET_FRAC   = 0.12f       // inset ngang trái/phải 12%
internal const val GLOSS_HEIGHT_FRAC  = 0.34f       // chiều cao gloss 34%
internal const val GLOSS_TOP_OFF      = 2f / 36f    // offset từ đỉnh (2dp / cell 36dp)
internal const val GLOSS_ALPHA        = 0.85f       // độ mờ shine (theo design)
// Mắt — dùng bởi JellyEyes.kt (drawEyes) và drawStoneBlock
internal const val EYE_Y_FRAC         = 0.50f       // tâm Y mắt = giữa khối (theo JSX flex-center)
// Mắt cho các tầng có art khung riêng (bám `06-svg-assets/eye-block-preview.card.html`):
internal const val EYE_Y_SUPER1       = 0.52f       // super_1.png: thân đầy, emblem ở góc → mắt gần giữa
internal const val EYE_Y_VUATHACH     = 0.58f       // Vua Thạch: vương miện ở đỉnh → mắt xuống thân
internal const val EYE_Y_RAINBOW      = 0.56f       // Thạch Cầu Vồng
internal const val EYE_Y_EMPEROR      = 0.60f       // Hoàng Đế Cầu Vồng: vương miện cầu vồng cao hơn
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

// ── Vine design palette (06-svg-assets/blocks/block-vine-*.svg) ─────────────
private val VINE_BG      = Color(0xFFF4E9D8)    // cream block fill
private val VINE_BG_EDGE = Color(0xFFE0CDAE)    // cream block stroke
private val V_STEM       = Color(0xFF5FB16E)    // vine stem green
private val V_HI         = Color(0xFF7FCF8E)    // vine highlight / leaf fill
private val V_LEAF_EDGE  = Color(0xFF4FA95F)    // leaf outline
private val V_BARK       = Color(0xFF8A6A3C)    // trunk dark
private val V_BARK_HI    = Color(0xFFA6844C)    // trunk highlight
private val V_FEET       = Color(0xFF9A7A46)    // root feet
private val V_KNOT       = Color(0xFF6E5228)    // trunk knot
private val V_BUD_FILL   = Color(0xFFBEE89C)    // tip bud fill
private val V_BUD_EDGE   = Color(0xFF8CCB68)    // tip bud outline
private val V_TIP_LEAF   = Color(0xFFC6ECA6)    // young leaf (tip)
// Cut vine / trash (block-vine-cut.svg)
private val CUT_GREEN    = Color(0xFF7BA85C)     // wilting green
private val CUT_GREEN_HI = Color(0xFFA9C98A)     // wilting highlight
private val CUT_BROWN    = Color(0xFF9A7A46)     // dead wood
private val CUT_SPLINTER = Color(0xFF8A6A3C)     // break splinters
private val CUT_DEAD_LF  = Color(0xFFC0A16A)     // dead leaf fill
private val CUT_LIVE_LF  = Color(0xFF8FBE6A)     // surviving leaf fill
private val CUT_LIVE_STK = Color(0xFF5FA04A)     // surviving leaf stroke
private val COUNTDOWN_BG   = Color(0xFFFFCA66)   // badge background (warning yellow)
private val COUNTDOWN_EDGE = Color(0xFFE9A93F)   // badge border
// Dead debris (block-debris.svg) — fully dead trash: dry leaves + sticks
private val DEBRIS_BG      = Color(0xFFEFE1CA)   // warmer cream base
private val DEBRIS_EDGE    = Color(0xFFE0CDAE)   // base border
private val DEBRIS_DARK    = Color(0xFF8A6A3C)   // dark wood / stick
private val DEBRIS_LIGHT   = Color(0xFFA2814A)   // light wood
private val DEBRIS_LF1     = Color(0xFFC7A86E)   // dead leaf 1
private val DEBRIS_LF2     = Color(0xFFB79A6E)   // dead leaf 2
private val DEBRIS_LF3     = Color(0xFFCBB07A)   // dead leaf 3

/**
 * Ô DÂY LEO (World 2) — connection-aware, bám 16 biến thể SVG trong
 * `06-svg-assets/blocks/block-vine-*.svg`. Nền kem + dây/thân xanh; gốc ([root])
 * có thân nâu từ đáy + viền đậm target; ngọn (tip, ≤1 kết nối) có mầm non.
 */
internal fun DrawScope.drawVineCell(
    left: Float, top: Float, blockSize: Float,
    cr: CornerRadius, borderStroke: Stroke, root: Boolean,
    connectUp: Boolean = false, connectDown: Boolean = false,
    connectLeft: Boolean = false, connectRight: Boolean = false,
) {
    val bs = blockSize
    val s  = bs / 100f
    val cx = left + 50f * s
    val cy = top + 50f * s

    // Cream base (chung mọi biến thể vine SVG)
    val sz = Size(bs, bs); val off = Offset(left, top)
    drawRoundRect(VINE_BG, off, sz, cr)
    val gi = bs * GLOSS_INSET_FRAC
    drawOval(Color.White, Offset(left + gi, top + bs * GLOSS_TOP_OFF),
        Size(bs - gi * 2, bs * GLOSS_HEIGHT_FRAC), alpha = 0.45f)
    drawRoundRect(VINE_BG_EDGE, off, sz, cr, style = borderStroke)

    if (root) {
        drawVineRoot(left, top, bs, s, cx, cy, cr, borderStroke,
            connectUp, connectLeft, connectRight)
        return
    }
    val n = (if (connectUp) 1 else 0) + (if (connectDown) 1 else 0) +
            (if (connectLeft) 1 else 0) + (if (connectRight) 1 else 0)
    if (n <= 1) drawVineTip(left, top, bs, s, cx, cy,
        connectUp, connectDown, connectLeft, connectRight)
    else drawVineSegment(left, top, bs, s, cx, cy,
        connectUp, connectDown, connectLeft, connectRight, n)
}

// ── Root: thân nâu đáy→giữa + nhánh xanh hướng kết nối ────────────────────
private fun DrawScope.drawVineRoot(
    left: Float, top: Float, bs: Float, s: Float,
    cx: Float, cy: Float,
    cr: CornerRadius, borderStroke: Stroke,
    up: Boolean, lt: Boolean, rt: Boolean,
) {
    val foot = Path()
    foot.moveTo(cx, top + 93f * s)
    foot.cubicTo(left + 42f * s, top + 88f * s, left + 33f * s, top + 90f * s, left + 27f * s, top + 95f * s)
    drawPath(foot, V_FEET, style = Stroke(5f * s, cap = StrokeCap.Round))
    foot.reset()
    foot.moveTo(cx, top + 93f * s)
    foot.cubicTo(left + 58f * s, top + 88f * s, left + 67f * s, top + 90f * s, left + 73f * s, top + 95f * s)
    drawPath(foot, V_FEET, style = Stroke(5f * s, cap = StrokeCap.Round))

    val bot = Offset(cx, top + 95f * s); val mid = Offset(cx, cy)
    drawLine(V_BARK, bot, mid, strokeWidth = 12f * s, cap = StrokeCap.Round)
    drawLine(V_BARK_HI, bot, mid, strokeWidth = 4.5f * s, cap = StrokeCap.Round, alpha = 0.8f)
    drawOval(V_KNOT, Offset(cx - 3.2f * s, top + 72f * s - 4.4f * s),
        Size(6.4f * s, 8.8f * s), style = Stroke(1.8f * s))
    drawCircle(V_STEM, radius = 5f * s, center = mid)

    val bw = 6f * s; val bh = 2.4f * s
    if (rt) {
        val p = Path().apply {
            moveTo(cx, cy)
            cubicTo(left + 60f * s, top + 49f * s, left + 70f * s, top + 51f * s, left + 91f * s, cy)
        }
        drawPath(p, V_STEM, style = Stroke(bw, cap = StrokeCap.Round))
        drawPath(p, V_HI, alpha = 0.7f, style = Stroke(bh, cap = StrokeCap.Round))
        drawVineLeaf(left + 68f * s, top + 46f * s, bs, 30f, 0.8f)
    }
    if (lt) {
        val p = Path().apply {
            moveTo(cx, cy)
            cubicTo(left + 40f * s, top + 49f * s, left + 30f * s, top + 51f * s, left + 9f * s, cy)
        }
        drawPath(p, V_STEM, style = Stroke(bw, cap = StrokeCap.Round))
        drawPath(p, V_HI, alpha = 0.7f, style = Stroke(bh, cap = StrokeCap.Round))
        drawVineLeaf(left + 32f * s, top + 46f * s, bs, -60f, 0.8f)
    }
    if (up) {
        val p = Path().apply {
            moveTo(cx, top + 52f * s)
            cubicTo(left + 51f * s, top + 42f * s, left + 49f * s, top + 34f * s, cx, top + 9f * s)
        }
        drawPath(p, V_STEM, style = Stroke(bw, cap = StrokeCap.Round))
        drawPath(p, V_HI, alpha = 0.7f, style = Stroke(bh, cap = StrokeCap.Round))
        drawVineLeaf(left + 53f * s, top + 38f * s, bs, 26f, 0.85f)
        drawVineLeaf(left + 47f * s, top + 30f * s, bs, -150f, 0.8f)
    }

    drawRoundRect(V_STEM, Offset(left, top), Size(bs, bs), cr,
        style = Stroke(borderStroke.width * 1.6f))
}

// ── Segment: thân xanh nối cạnh ↔ cạnh ─────────────────────────────────────
private fun DrawScope.drawVineSegment(
    left: Float, top: Float, bs: Float, s: Float,
    cx: Float, cy: Float,
    up: Boolean, dn: Boolean, lt: Boolean, rt: Boolean,
    n: Int,
) {
    val w = 8f * s; val hw = 3f * s
    val eL = left + 9f * s; val eR = left + 91f * s
    val eT = top + 9f * s;  val eB = top + 91f * s

    if (n == 2 && lt && rt) {
        drawLine(V_STEM, Offset(eL, cy), Offset(eR, cy), strokeWidth = w, cap = StrokeCap.Round)
        drawLine(V_HI, Offset(eL, cy), Offset(eR, cy), strokeWidth = hw, cap = StrokeCap.Round, alpha = 0.7f)
        drawVineLeaf(left + 42f * s, top + 42f * s, bs, -60f)
        drawVineLeaf(left + 60f * s, top + 60f * s, bs, 120f, 0.8f)
        return
    }
    if (n == 2 && up && dn) {
        drawLine(V_STEM, Offset(cx, eT), Offset(cx, eB), strokeWidth = w, cap = StrokeCap.Round)
        drawLine(V_HI, Offset(cx, eT), Offset(cx, eB), strokeWidth = hw, cap = StrokeCap.Round, alpha = 0.7f)
        drawVineLeaf(left + 62f * s, top + 42f * s, bs, 22f)
        drawVineLeaf(left + 38f * s, top + 60f * s, bs, 150f, 0.8f)
        return
    }
    if (n == 2) {
        val from = if (dn) Offset(cx, eB) else Offset(cx, eT)
        val to   = if (rt) Offset(eR, cy) else Offset(eL, cy)
        val p = Path().apply { moveTo(from.x, from.y); quadraticTo(cx, cy, to.x, to.y) }
        drawPath(p, V_STEM, style = Stroke(w, cap = StrokeCap.Round))
        drawPath(p, V_HI, alpha = 0.7f, style = Stroke(hw, cap = StrokeCap.Round))
        val dx = if (rt) 1f else -1f; val dy = if (dn) 1f else -1f
        drawVineLeaf(cx + 16f * s * dx, cy - 6f * s * dy, bs, 30f * dx)
        drawVineLeaf(cx - 4f * s * dx, cy + 16f * s * dy, bs, 150f * dx, 0.8f)
        return
    }
    // T-junction (3) hoặc X (4)
    if (up) { drawLine(V_STEM, Offset(cx, cy), Offset(cx, eT), strokeWidth = w, cap = StrokeCap.Round)
              drawLine(V_HI, Offset(cx, cy), Offset(cx, eT), strokeWidth = hw, cap = StrokeCap.Round, alpha = 0.7f) }
    if (dn) { drawLine(V_STEM, Offset(cx, cy), Offset(cx, eB), strokeWidth = w, cap = StrokeCap.Round)
              drawLine(V_HI, Offset(cx, cy), Offset(cx, eB), strokeWidth = hw, cap = StrokeCap.Round, alpha = 0.7f) }
    if (lt) { drawLine(V_STEM, Offset(cx, cy), Offset(eL, cy), strokeWidth = w, cap = StrokeCap.Round)
              drawLine(V_HI, Offset(cx, cy), Offset(eL, cy), strokeWidth = hw, cap = StrokeCap.Round, alpha = 0.7f) }
    if (rt) { drawLine(V_STEM, Offset(cx, cy), Offset(eR, cy), strokeWidth = w, cap = StrokeCap.Round)
              drawLine(V_HI, Offset(cx, cy), Offset(eR, cy), strokeWidth = hw, cap = StrokeCap.Round, alpha = 0.7f) }
    drawCircle(V_STEM, radius = 6.5f * s, center = Offset(cx, cy))
    drawCircle(V_HI, radius = 2.4f * s, center = Offset(cx - 2f * s, cy - 2f * s))
    if (n == 4) {
        drawVineLeaf(left + 64f * s, top + 36f * s, bs, 26f, 0.85f)
        drawVineLeaf(left + 36f * s, top + 64f * s, bs, -150f, 0.85f)
        drawVineLeaf(left + 64f * s, top + 64f * s, bs, 150f, 0.8f)
        drawVineLeaf(left + 36f * s, top + 36f * s, bs, -26f, 0.8f)
    } else if (!rt) {
        drawVineLeaf(left + 36f * s, top + 40f * s, bs, -26f)
        drawVineLeaf(left + 60f * s, top + 62f * s, bs, 150f, 0.8f)
    } else if (!lt) {
        drawVineLeaf(left + 64f * s, top + 40f * s, bs, 26f)
        drawVineLeaf(left + 40f * s, top + 62f * s, bs, 150f, 0.8f)
    } else if (!up) {
        drawVineLeaf(left + 40f * s, top + 62f * s, bs, -150f)
        drawVineLeaf(left + 60f * s, top + 62f * s, bs, 150f, 0.8f)
    } else {
        drawVineLeaf(left + 40f * s, top + 38f * s, bs, -26f)
        drawVineLeaf(left + 60f * s, top + 38f * s, bs, 26f, 0.8f)
    }
}

// ── Tip: nửa thân + mầm non (block-vine-tip.svg) ───────────────────────────
private fun DrawScope.drawVineTip(
    left: Float, top: Float, bs: Float, s: Float,
    cx: Float, cy: Float,
    up: Boolean, dn: Boolean, lt: Boolean, rt: Boolean,
) {
    val w = 8f * s; val hw = 3f * s
    val stemX: Float; val stemY: Float; val budX: Float; val budY: Float
    when {
        dn   -> { stemX = cx; stemY = top + 91f * s; budX = cx; budY = top + 52f * s }
        up   -> { stemX = cx; stemY = top + 9f * s;  budX = cx; budY = top + 48f * s }
        lt   -> { stemX = left + 9f * s; stemY = cy;  budX = left + 48f * s; budY = cy }
        rt   -> { stemX = left + 91f * s; stemY = cy; budX = left + 52f * s; budY = cy }
        else -> { stemX = cx; stemY = top + 91f * s; budX = cx; budY = top + 52f * s }
    }
    drawLine(V_STEM, Offset(stemX, stemY), Offset(budX, budY), strokeWidth = w, cap = StrokeCap.Round)
    drawLine(V_HI, Offset(stemX, stemY), Offset(budX, budY), strokeWidth = hw, cap = StrokeCap.Round, alpha = 0.7f)
    val budAngle = when { dn || (!up && !lt && !rt) -> 0f; up -> 180f; lt -> 90f; else -> -90f }
    translate(budX, budY) {
        rotate(budAngle, Offset.Zero) {
            val bud = Path().apply {
                moveTo(0f, 0f)
                cubicTo(-3f * s, -6f * s, -2f * s, -11f * s, 0f, -14f * s)
                cubicTo(2f * s, -11f * s, 3f * s, -6f * s, 0f, 0f)
                close()
            }
            drawPath(bud, V_BUD_FILL)
            drawPath(bud, V_BUD_EDGE, style = Stroke(1.4f * s))
        }
    }
    drawCircle(V_STEM, radius = 3.2f * s, center = Offset(budX, budY))
    when {
        dn || (!up && !lt && !rt) -> {
            drawVineLeaf(left + 48f * s, top + 50f * s, bs, -46f, 0.72f, V_TIP_LEAF)
            drawVineLeaf(left + 52f * s, top + 50f * s, bs, 46f, 0.72f, V_TIP_LEAF)
        }
        up -> {
            drawVineLeaf(left + 48f * s, top + 50f * s, bs, -134f, 0.72f, V_TIP_LEAF)
            drawVineLeaf(left + 52f * s, top + 50f * s, bs, 134f, 0.72f, V_TIP_LEAF)
        }
        lt -> {
            drawVineLeaf(left + 50f * s, top + 48f * s, bs, 44f, 0.72f, V_TIP_LEAF)
            drawVineLeaf(left + 50f * s, top + 52f * s, bs, 136f, 0.72f, V_TIP_LEAF)
        }
        else -> {
            drawVineLeaf(left + 50f * s, top + 52f * s, bs, -136f, 0.72f, V_TIP_LEAF)
            drawVineLeaf(left + 50f * s, top + 48f * s, bs, -44f, 0.72f, V_TIP_LEAF)
        }
    }
}

// ── Lá dây leo (bezier path bám SVG leaf shape) ────────────────────────────
private fun DrawScope.drawVineLeaf(
    px: Float, py: Float, blockSize: Float,
    rotation: Float, leafScale: Float = 1f,
    fillColor: Color = V_HI,
    strokeColor: Color = V_LEAF_EDGE,
) {
    val sc = blockSize / 100f * leafScale
    translate(px, py) {
        rotate(rotation, Offset.Zero) {
            val p = Path().apply {
                moveTo(0f, 0f)
                cubicTo(-1f * sc, -7f * sc, 4f * sc, -12f * sc, 11f * sc, -13f * sc)
                cubicTo(12f * sc, -6f * sc, 7f * sc, -1f * sc, 0f, 0f)
                close()
            }
            drawPath(p, fillColor)
            drawPath(p, strokeColor, style = Stroke(1.4f * sc))
            p.reset()
            p.moveTo(1f * sc, -2f * sc)
            p.cubicTo(3f * sc, -5f * sc, 6f * sc, -8f * sc, 9f * sc, -10f * sc)
            drawPath(p, strokeColor, style = Stroke(1.1f * sc))
        }
    }
}

/**
 * Ô RÁC (dây leo bị cắt — block-vine-cut.svg): nền kem + thân héo xanh xỉn
 * chuyển nâu gãy + mảnh vụn + lá chết nâu & lá sống xanh.
 */
internal fun DrawScope.drawTrashCell(
    left: Float, top: Float, blockSize: Float,
    cr: CornerRadius, borderStroke: Stroke,
    countdown: Int = 0,
) {
    val bs = blockSize; val s = bs / 100f
    val sz = Size(bs, bs); val off = Offset(left, top)
    drawRoundRect(VINE_BG, off, sz, cr)
    val gi = bs * GLOSS_INSET_FRAC
    drawOval(Color.White, Offset(left + gi, top + bs * GLOSS_TOP_OFF),
        Size(bs - gi * 2, bs * GLOSS_HEIGHT_FRAC), alpha = 0.40f)
    drawRoundRect(VINE_BG_EDGE, off, sz, cr, style = borderStroke)
    // Thân héo
    val stem = Path().apply {
        moveTo(left + 50f * s, top + 92f * s)
        cubicTo(left + 50f * s, top + 74f * s, left + 46f * s, top + 66f * s, left + 40f * s, top + 60f * s)
    }
    drawPath(stem, CUT_GREEN, style = Stroke(8f * s, cap = StrokeCap.Round))
    drawPath(stem, CUT_GREEN_HI, alpha = 0.6f, style = Stroke(3f * s, cap = StrokeCap.Round))
    // Phần chết nâu
    val dead = Path().apply {
        moveTo(left + 40f * s, top + 60f * s)
        cubicTo(left + 35f * s, top + 55f * s, left + 32f * s, top + 52f * s, left + 31f * s, top + 47f * s)
    }
    drawPath(dead, CUT_BROWN, style = Stroke(7f * s, cap = StrokeCap.Round))
    // Mảnh vụn
    val sx = left + 31f * s; val sy = top + 47f * s; val spw = 2f * s
    drawLine(CUT_SPLINTER, Offset(sx, sy), Offset(sx - 4f * s, sy - 4f * s), strokeWidth = spw, cap = StrokeCap.Round)
    drawLine(CUT_SPLINTER, Offset(sx, sy), Offset(sx + 1f * s, sy - 6f * s), strokeWidth = spw, cap = StrokeCap.Round)
    drawLine(CUT_SPLINTER, Offset(sx, sy), Offset(sx + 5f * s, sy - 3f * s), strokeWidth = spw, cap = StrokeCap.Round)
    // Lá sống + lá chết
    drawVineLeaf(left + 55f * s, top + 70f * s, bs, 40f, 0.9f, CUT_LIVE_LF, CUT_LIVE_STK)
    drawVineLeaf(left + 24f * s, top + 62f * s, bs, -150f, 0.85f, CUT_DEAD_LF, CUT_SPLINTER)
    // Badge đếm ngược (block-vine-cut.svg: vòng tròn vàng + số)
    if (countdown > 0) {
        val badgeCx = left + 74f * s; val badgeCy = top + 26f * s; val badgeR = 14f * s
        drawCircle(COUNTDOWN_BG, badgeR, Offset(badgeCx, badgeCy))
        drawCircle(COUNTDOWN_EDGE, badgeR, Offset(badgeCx, badgeCy), style = Stroke(3f * s))
        drawIntoCanvas { canvas ->
            canvas.nativeCanvas.drawText(
                countdown.toString(), badgeCx, badgeCy + 6f * s,
                android.graphics.Paint().apply {
                    color = 0xFF5B4636.toInt()
                    textSize = 18f * s
                    textAlign = android.graphics.Paint.Align.CENTER
                    typeface = android.graphics.Typeface.DEFAULT_BOLD
                },
            )
        }
    }
}

/**
 * Ô RÁC CHẾT (block-debris.svg): lá khô + củi khô — countdown đã hết, hoàn toàn chết.
 * Khác [drawTrashCell] (cut vine còn xanh + badge đếm ngược).
 */
internal fun DrawScope.drawDebrisCell(
    left: Float, top: Float, blockSize: Float,
    cr: CornerRadius, borderStroke: Stroke,
) {
    val bs = blockSize; val s = bs / 100f
    val sz = Size(bs, bs); val off = Offset(left, top)
    drawRoundRect(DEBRIS_BG, off, sz, cr)
    val gi = bs * GLOSS_INSET_FRAC
    drawOval(Color.White, Offset(left + gi, top + bs * GLOSS_TOP_OFF),
        Size(bs - gi * 2, bs * GLOSS_HEIGHT_FRAC), alpha = 0.40f)
    drawRoundRect(DEBRIS_EDGE, off, sz, cr, style = borderStroke)
    // Cành khô 1 (ngang trên)
    val stick1 = Path().apply {
        moveTo(left + 22f * s, top + 68f * s)
        cubicTo(left + 38f * s, top + 62f * s, left + 54f * s, top + 60f * s, left + 74f * s, top + 54f * s)
    }
    drawPath(stick1, DEBRIS_DARK, style = Stroke(4.5f * s, cap = StrokeCap.Round))
    // Nhánh nhỏ
    drawLine(DEBRIS_DARK, Offset(left + 46f * s, top + 63f * s), Offset(left + 53f * s, top + 56f * s), strokeWidth = 2.6f * s, cap = StrokeCap.Round)
    drawLine(DEBRIS_DARK, Offset(left + 58f * s, top + 60f * s), Offset(left + 63f * s, top + 64f * s), strokeWidth = 2.6f * s, cap = StrokeCap.Round)
    // Cành khô 2 (ngang dưới)
    val stick2 = Path().apply {
        moveTo(left + 28f * s, top + 78f * s)
        cubicTo(left + 42f * s, top + 74f * s, left + 56f * s, top + 76f * s, left + 72f * s, top + 70f * s)
    }
    drawPath(stick2, DEBRIS_LIGHT, style = Stroke(3.6f * s, cap = StrokeCap.Round))
    drawLine(DEBRIS_LIGHT, Offset(left + 50f * s, top + 74f * s), Offset(left + 46f * s, top + 80f * s), strokeWidth = 2.2f * s, cap = StrokeCap.Round)
    // 4 lá khô
    drawVineLeaf(left + 34f * s, top + 52f * s, bs, -28f, 1.05f, DEBRIS_LF1, DEBRIS_DARK)
    drawVineLeaf(left + 62f * s, top + 44f * s, bs, 22f, 1f, DEBRIS_LF2, DEBRIS_DARK)
    drawVineLeaf(left + 50f * s, top + 58f * s, bs, 150f, 0.95f, DEBRIS_LF3, DEBRIS_DARK)
    drawVineLeaf(left + 72f * s, top + 62f * s, bs, 60f, 0.85f, DEBRIS_LF2, DEBRIS_DARK)
    // Mảnh vụn nhỏ
    drawCircle(DEBRIS_DARK, 1.8f * s, Offset(left + 40f * s, top + 42f * s))
    drawCircle(DEBRIS_LIGHT, 1.6f * s, Offset(left + 66f * s, top + 70f * s))
    drawCircle(DEBRIS_DARK, 1.4f * s, Offset(left + 30f * s, top + 60f * s))
}

// Ô ĐÍCH "giọt nước" (World 3) → vẽ ở WaterDraw.kt (drawWaterDropTarget) bám design vòng-target nét-đứt.

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
    bitmaps: JellyBitmaps? = null,
    bodyLiftFrac: Float = 0f,
) {
    val gap = cell * gapFrac
    val blockSize = cell - gap
    val corner = blockSize * CORNER_FRAC
    val cr = CornerRadius(corner, corner)
    val borderStroke = Stroke(blockSize * BORDER_FRAC)
    // Nhích thân lên → mắt cũng nhích lên nửa mức đó cho khớp mặt (chỉ khi có lift, tray).
    val eyeY = EYE_Y_FRAC - bodyLiftFrac * 0.5f
    val cells = piece.shape.cells
    for (i in cells.indices) {
        val c = cells[i]
        val cellColor = piece.colorAt(i)                 // màu RIÊNG từng ô (vd tâm vuông 3×3 khác vành)
        val left = originX + c.x * cell + gap / 2
        val top = originY + c.y * cell + gap / 2
        if (bitmaps != null) {
            // Thân = art PNG (đã bao gồm gloss/viền/emblem); mắt vẫn overlay vẽ tay.
            drawBlockImage(bitmaps.base(cellColor), left, top, blockSize, liftFrac = bodyLiftFrac)
            drawEyes(left, top, blockSize, gravity.dx.toFloat(), gravity.dy.toFloat(), eyeYFrac = eyeY)
        } else {
            val palette = JellyTheme.forColor(cellColor)
            drawJellyBlock(left, top, blockSize, cr, borderStroke, palette)
            drawEyes(left, top, blockSize, gravity.dx.toFloat(), gravity.dy.toFloat(), eyeYFrac = eyeY)
            if (showSticker) drawSticker(cellColor, palette, left, top, blockSize)
        }
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
    bitmaps: JellyBitmaps? = null,
) {
    // alpha: 1 → 0 khi clearProgress tăng (fade out)
    val clearAlpha  = if (clearProgress > 0f) 1f - clearProgress else 1f
    // scale phồng: 1 → 1.12 khi clearProgress tăng (pop bloom)
    val clearScale  = if (clearProgress > 0f) 1f + clearProgress * 0.12f else 1f

    // mắt nhắm khi squash mạnh (một trục nào đó < 0.92) HOẶC khi tính cách đang chớp ([eyeOpen]=false)
    val eyeOpenNow  = eyeOpen && squashScaleX >= 0.92f && squashScaleY >= 0.92f
    // sticker ẩn khi đang squash (như JSX !squashed) — chỉ dùng ở nhánh vẽ tay fallback
    val drawStickerNow = showSticker && squashScaleX == 1f && squashScaleY == 1f

    val sx    = squashScaleX * clearScale
    val sy    = squashScaleY * clearScale
    val pivot = Offset(left + blockSize / 2f, top + blockSize / 2f)

    // KHÔNG gộp cụm — mỗi ô là khối jelly bo tròn RIÊNG (đúng design: JellyBlock
    // "never squared"). Xem memory ingame-endless-fidelity (quyết định: không gộp).
    // Thân = art PNG (`blocks/jelly-*.png`) khi có [bitmaps]; mắt vẫn overlay vẽ tay.
    fun body() {
        if (bitmaps != null) {
            drawBlockImage(bitmaps.base(color), left, top, blockSize, clearAlpha)
            drawEyes(left, top, blockSize, dirX, dirY, expression, eyeOpenNow, clearAlpha)
        } else {
            drawJellyBlock(left, top, blockSize, cr, borderStroke, palette, clearAlpha)
            drawEyes(left, top, blockSize, dirX, dirY, expression, eyeOpenNow, clearAlpha)
            if (drawStickerNow) drawSticker(color, palette, left, top, blockSize, clearAlpha)
        }
    }

    if (sx != 1f || sy != 1f) scale(sx, sy, pivot) { body() } else body()
}
