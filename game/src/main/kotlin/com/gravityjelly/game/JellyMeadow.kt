package com.gravityjelly.game

import android.provider.Settings
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlin.math.PI
import kotlin.math.sin

// ── chu kỳ animation (giây) — float bob & sway, lệch pha để không đập nhịp ──
private const val FLOAT_PERIOD_SEC = 3.6f
private const val SWAY_PERIOD_SEC  = 4.2f
private const val FLOAT_BOB_DP     = 5f   // biên độ trôi lên-xuống của orb
private const val SWAY_AMP_DEG     = 3f   // biên độ đung đưa của hoa

// màu phụ (ngoài JellyTheme) — lấy thẳng từ game-screen.jsx
private val HillCenterTop = Color(0xFFDCEFD4); private val HillCenterBot = Color(0xFFC6E4BD)
private val HillLeftTop   = Color(0xFFE6F3E2); private val HillLeftBot   = Color(0xFFD3EACE)
private val HillRightTop  = Color(0xFFEAF1FA); private val HillRightBot  = Color(0xFFDAE6F4)
private val GroundTop     = Color(0xFFF1E4CB); private val GroundBot     = Color(0xFFE8D6B6)
private val GrassLine     = Color(0x7396AA78) // rgba(150,170,120,0.45)
private val MushStemTop   = Color(0xFFFCF1DC); private val MushStemBot   = Color(0xFFF3E3C4)
private val OrbGloss      = Color(0x61FFFFFF) // rgba(255,255,255,0.38)
private val DotWhite      = Color(0xCCFFFFFF) // rgba(255,255,255,0.8)
private val BandBgTop     = Color(0xFFFFFCF5) // nền khay (JellyScene band): #FFFCF5 → bg

/**
 * Tài nguyên vẽ tiền-tính (brush/stroke/cr) — `remember(density)` một lần,
 * KHÔNG cấp phát trong vòng vẽ. Brush gradient dùng toạ độ TƯƠNG ĐỐI 0..span
 * và luôn được vẽ trong khối `translate{}` để map đúng vị trí.
 */
private class MeadowAssets(private val d: Float) {
    private fun vGrad(c0: Color, c1: Color, spanDp: Float) =
        Brush.verticalGradient(listOf(c0, c1), startY = 0f, endY = spanDp * d)

    val hillCenter = vGrad(HillCenterTop, HillCenterBot, 32f)
    val hillLeft   = vGrad(HillLeftTop,   HillLeftBot,   44f)
    val hillRight  = vGrad(HillRightTop,  HillRightBot,  38f)
    val ground     = vGrad(GroundTop,     GroundBot,     16f)
    val blade      = vGrad(JellyTheme.mint.shine, JellyTheme.mint.fill, 22f)
    val stem       = vGrad(JellyTheme.mint.shine, JellyTheme.mint.fill, 26f)
    val petal      = vGrad(JellyTheme.pink.shine, JellyTheme.pink.fill, 16f)
    val mushStem   = vGrad(MushStemTop, MushStemBot, 18f)
    val capPink    = vGrad(JellyTheme.pink.shine,   JellyTheme.pink.fill,   18f)
    val capYellow  = vGrad(JellyTheme.yellow.shine, JellyTheme.yellow.fill, 18f)

    // nền khay "đĩa jelly" (JellyScene band): #FFFCF5 0% → bg 60% (span ≈ 60dp của band 100dp)
    val bandBg     = Brush.verticalGradient(listOf(BandBgTop, JellyTheme.bg), startY = 0f, endY = 60f * d)
}

/** Một nhân vật jelly nhỏ "ló" trong cảnh: vị trí + màu + cr/stroke tiền-tính. */
private class CastSpec(
    val palette: BlockPalette,
    val leftFrac: Float,
    val bottomDp: Float,
    sizeDp: Float,
    d: Float,
) {
    val sizePx = sizeDp * d
    val cr     = CornerRadius(sizePx * CORNER_FRAC)
    val stroke = Stroke(sizePx * BORDER_FRAC)
}

/** True khi hệ thống tắt animation (Accessibility → "Remove animations"). */
@Composable
private fun rememberReducedMotion(): Boolean {
    val context = LocalContext.current
    return remember {
        Settings.Global.getFloat(
            context.contentResolver,
            Settings.Global.ANIMATOR_DURATION_SCALE,
            1f,
        ) == 0f
    }
}

/**
 * Dải cảnh jelly trang trí "ở mãi" sau/đáy vùng bàn (game-screen.jsx §JellyMeadow):
 * đồi tầng tạo chiều sâu, nền cỏ + vạch cỏ, hoa đung đưa, vài nhân vật jelly ló,
 * nấm, bụi, orb trôi, sparkle. Theme mint/pink/yellow.
 *
 * - Vẽ TRỌN trong MỘT Canvas, allocation-free (brush/stroke tiền-tính).
 * - KHÔNG che khối board: đặt component này SAU bàn / ở dải dưới, không phủ lên giếng.
 * - Animation rất nhẹ (sway/float) drive bằng [withFrameNanos], tách khỏi vòng vẽ bàn.
 *   [reducedMotion]=true → đứng yên hoàn toàn (không chạy frame loop).
 * - Band STAYS khi combo nổ — mảnh combo RƠI KHUẤT SAU prop: gọi 2 lớp [MeadowLayer.BACKDROP]
 *   (nền+đồi+đất) và [MeadowLayer.PROPS] (cỏ/bụi/hoa/jelly/nấm/orb) rồi chèn mảnh rơi vào GIỮA.
 */
@Composable
fun JellyMeadow(
    modifier: Modifier = Modifier,
    reducedMotion: Boolean = rememberReducedMotion(),
    layer: MeadowLayer = MeadowLayer.ALL,
) {
    val density = LocalDensity.current.density
    val assets  = remember(density) { MeadowAssets(density) }
    val cast    = remember(density) {
        listOf(
            CastSpec(JellyTheme.pink, leftFrac = 0.19f, bottomDp = 21f, sizeDp = 23f, d = density),
            CastSpec(JellyTheme.mint, leftFrac = 0.37f, bottomDp = 19f, sizeDp = 28f, d = density),
            CastSpec(JellyTheme.blue, leftFrac = 0.57f, bottomDp = 20f, sizeDp = 25f, d = density),
        )
    }

    // thời gian (giây) cho sway/float — chỉ lớp PROPS cần (backdrop tĩnh), đứng yên khi reduced-motion
    val animated = layer != MeadowLayer.BACKDROP && !reducedMotion
    var timeSec by remember { mutableFloatStateOf(0f) }
    if (animated) {
        LaunchedEffect(Unit) {
            var startNanos = 0L
            while (true) {
                withFrameNanos { t ->
                    if (startNanos == 0L) startNanos = t
                    timeSec = (t - startNanos) / 1e9f
                }
            }
        }
    }

    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        val d = density
        fun by(bottomDp: Float) = h - bottomDp * d   // toạ độ Y từ đáy band

        val bob   = if (!animated) 0f else sin(timeSec * (2f * PI.toFloat() / FLOAT_PERIOD_SEC)) * FLOAT_BOB_DP * d
        val sway  = if (!animated) 0f else sin(timeSec * (2f * PI.toFloat() / SWAY_PERIOD_SEC)) * SWAY_AMP_DEG

        val drawBackdrop = layer != MeadowLayer.PROPS
        val drawProps    = layer != MeadowLayer.BACKDROP

        // ══ LỚP NỀN (backdrop) — mảnh combo rơi sẽ nằm TRÊN lớp này ════════════
        if (drawBackdrop) {
            // ── 0. nền khay "đĩa jelly" (#FFFCF5 → bg) — modifier clip bo góc ở nơi gọi ──
            drawRect(assets.bandBg, size = Size(w, h))

            // ── 1. đồi tầng (clip phía trên vạch đất để đáy đồi phẳng) ──────────
            val groundLineY = by(14f)
            clipRect(0f, 0f, w, groundLineY) {
                drawDome(w * 0.32f, groundLineY, w * 0.46f, 32f * d, assets.hillCenter)
                drawDome(-0.08f * w, groundLineY, w * 0.58f, 44f * d, assets.hillLeft)
                drawDome(w * 0.56f, groundLineY, w * 0.54f, 38f * d, assets.hillRight)
            }

            // ── 2. nền đất + vạch cỏ ───────────────────────────────────────────
            translate(0f, h - 16f * d) { drawRect(assets.ground, size = Size(w, 16f * d)) }
            drawRect(GrassLine, topLeft = Offset(0f, by(18f)), size = Size(w, 3f * d))
        }

        // ══ LỚP PROP (cỏ/bụi/hoa/jelly/nấm/orb) — che mảnh combo rơi phía sau ══
        if (drawProps) {
            // ── 3. túm cỏ (rounded rect xoay quanh gốc) ────────────────────────
            drawBlade(w * 0.03f,  by(13f), 16f * d, -12f, assets.blade, d)
            drawBlade(w * 0.05f,  by(13f), 22f * d,   0f, assets.blade, d)
            drawBlade(w * 0.07f,  by(13f), 15f * d,  12f, assets.blade, d)
            drawBlade(w * 0.60f,  by(13f), 14f * d, -10f, assets.blade, d)
            drawBlade(w * 0.615f, by(13f), 19f * d,   0f, assets.blade, d)

            // ── 4. bụi trái + hoa đung đưa ─────────────────────────────────────
            drawBush(w * 0.09f, by(14f), 1.0f, JellyTheme.mint, d)
            drawFlower(w * 0.24f, by(14f), sway, assets, d)

            // ── 5. dàn nhân vật jelly ló (giữa cảnh, hai bên tâm combo) ─────────
            for (c in cast) {
                val left = w * c.leftFrac
                val top  = by(c.bottomDp) - c.sizePx
                drawJellyBlock(left, top, c.sizePx, c.cr, c.stroke, c.palette)
                drawEyes(left, top, c.sizePx, 0f, 1f)   // mắt nhìn xuống (down)
            }

            // ── 6. nấm phải + bụi phải ─────────────────────────────────────────
            drawMushroom(w * 0.66f, by(13f), 30f * d, assets.capPink,   assets, d)
            drawMushroom(w * 0.77f, by(13f), 22f * d, assets.capYellow, assets, d)
            drawBush(w * 0.86f, by(14f), 0.85f, JellyTheme.mint, d)

            // ── 7. orb trôi (bob lên-xuống) ────────────────────────────────────
            drawOrb(w * 0.30f, by(52f) + bob,        6f * d, JellyTheme.yellow.fill, 0.55f)
            drawOrb(w * 0.84f, by(50f) - bob * 0.8f, 7f * d, JellyTheme.pink.fill,   0.50f)

            // ── 8. sparkle (tĩnh) ──────────────────────────────────────────────
            drawCircle(JellyTheme.yellow.shine, 3f * d, Offset(w * 0.46f, 10f * d), alpha = 0.7f)
            drawCircle(JellyTheme.pink.shine,   2f * d, Offset(w * 0.70f,  8f * d), alpha = 0.7f)
        }
    }
}

/** Lớp vẽ của [JellyMeadow]: tách để chèn mảnh combo rơi GIỮA backdrop và prop. */
enum class MeadowLayer { BACKDROP, PROPS, ALL }

// ── primitive helpers (DrawScope ext, allocation-free) ──────────────────────

/** Đồi: nửa trên ellipse, đáy phẳng đặt tại [baseY]; gọi trong clipRect phía trên đáy. */
private fun DrawScope.drawDome(left: Float, baseY: Float, width: Float, hh: Float, brush: Brush) {
    translate(left, baseY - hh) {
        drawOval(brush, topLeft = Offset(0f, 0f), size = Size(width, hh * 2f))
    }
}

/** Túm cỏ: rounded rect mảnh, xoay [deg] quanh gốc (đáy giữa). */
private fun DrawScope.drawBlade(cx: Float, baseY: Float, hPx: Float, deg: Float, brush: Brush, d: Float) {
    val wPx = 6f * d
    rotate(deg, pivot = Offset(cx, baseY)) {
        drawRoundRect(
            brush,
            topLeft      = Offset(cx - wPx / 2f, baseY - hPx),
            size         = Size(wPx, hPx),
            cornerRadius = CornerRadius(3f * d),
        )
    }
}

/** Orb tròn + gloss góc trên-trái. */
private fun DrawScope.drawOrb(cx: Float, cy: Float, r: Float, color: Color, alpha: Float) {
    drawCircle(color, r, Offset(cx, cy), alpha = alpha)
    drawCircle(OrbGloss, r * 0.5f, Offset(cx - r * 0.3f, cy - r * 0.3f), alpha = alpha)
}

/** Bụi jelly: 3 orb chồng nhau (đáy tại [baseY]). */
private fun DrawScope.drawBush(left: Float, baseY: Float, sc: Float, p: BlockPalette, d: Float) {
    fun orb(offXdp: Float, offBotDp: Float, diamDp: Float, color: Color, alpha: Float) {
        val diam = diamDp * sc * d
        val cx   = left + offXdp * sc * d + diam / 2f
        val cy   = baseY - offBotDp * sc * d - diam / 2f
        drawOrb(cx, cy, diam / 2f, color, alpha)
    }
    orb(0f,  0f, 24f, p.fill,  0.92f)
    orb(16f, 2f, 30f, p.shine, 1f)
    orb(34f, 0f, 22f, p.fill,  0.92f)
}

/** Hoa: thân + 2 lá + đầu cánh (pink) + nhụy vàng, xoay [sway]° quanh gốc. */
private fun DrawScope.drawFlower(left: Float, baseY: Float, sway: Float, a: MeadowAssets, d: Float) {
    val pivot = Offset(left + 13f * d, baseY)
    rotate(sway, pivot = pivot) {
        // thân
        drawRoundRect(a.stem,
            topLeft = Offset(left + 11f * d, baseY - 26f * d),
            size = Size(4f * d, 26f * d), cornerRadius = CornerRadius(3f * d))
        // 2 lá mint
        drawRoundRect(JellyTheme.mint.fill,
            topLeft = Offset(left + 2f * d, baseY - 17f * d),
            size = Size(9f * d, 7f * d), cornerRadius = CornerRadius(4f * d))
        drawRoundRect(JellyTheme.mint.fill,
            topLeft = Offset(left + 14f * d, baseY - 21f * d),
            size = Size(9f * d, 7f * d), cornerRadius = CornerRadius(4f * d))
        // đầu cánh pink + nhụy vàng
        drawRoundRect(a.petal,
            topLeft = Offset(left + 4f * d, baseY - 38f * d),
            size = Size(18f * d, 16f * d), cornerRadius = CornerRadius(8f * d))
        drawCircle(JellyTheme.yellow.fill, 3f * d, Offset(left + 13f * d, baseY - 30f * d))
    }
}

/** Nấm: thân cream + mũ dome màu + 2 chấm trắng. [wPx] = bề ngang nấm. */
private fun DrawScope.drawMushroom(left: Float, baseY: Float, wPx: Float, capBrush: Brush, a: MeadowAssets, d: Float) {
    // thân
    drawRoundRect(a.mushStem,
        topLeft = Offset(left + wPx * 0.32f, baseY - wPx * 0.5f),
        size = Size(wPx * 0.36f, wPx * 0.5f), cornerRadius = CornerRadius(wPx * 0.14f))
    // mũ dome
    val capH = wPx * 0.6f
    val capTop = baseY - wPx * 0.36f - capH
    translate(left, capTop) {
        drawOval(capBrush, topLeft = Offset(0f, 0f), size = Size(wPx, capH * 1.6f))
    }
    // 2 chấm trắng
    drawCircle(DotWhite, wPx * 0.08f, Offset(left + wPx * 0.32f, capTop + capH * 0.45f))
    drawCircle(DotWhite, wPx * 0.06f, Offset(left + wPx * 0.62f, capTop + capH * 0.6f))
}

// ── preview ──────────────────────────────────────────────────────────────────

@Preview(name = "JellyMeadow — band", widthDp = 340, heightDp = 110)
@Composable
private fun JellyMeadowPreview() {
    JellyMeadow(
        modifier      = Modifier.fillMaxWidth().height(110.dp),
        reducedMotion = true,   // preview tĩnh
    )
}

@Preview(name = "JellyMeadow — sau bàn (vùng dưới)", widthDp = 360, heightDp = 460)
@Composable
private fun JellyMeadowUnderBoardPreview() {
    val render = remember { sampleRender(withGhost = false) }
    androidx.compose.foundation.layout.Column(Modifier.fillMaxWidth()) {
        BoardCanvas(
            render     = { render },
            renderTick = 0L,
            modifier   = Modifier.fillMaxWidth().height(340.dp),
        )
        JellyMeadow(
            modifier      = Modifier.fillMaxWidth().height(110.dp),
            reducedMotion = true,
        )
    }
}
