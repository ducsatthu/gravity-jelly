package com.gravityjelly.app.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.keyframes
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.PlatformTextStyle
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.LineHeightStyle
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.core.JellyColor
import androidx.compose.ui.res.stringResource
import com.gravityjelly.app.R
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

// ── tier table ────────────────────────────────────────────────────────────────

private data class Tier(
    val min: Int,
    @androidx.annotation.StringRes val wordRes: Int,
    val color: Color,
    val grad: List<Color>,   // ×N rainbow fill (design tier.grad, linear 95°)
    val numSize: Int,    // sp for ×N number
    val stars: Int,
)

// grad copy nguyên các stop từ ComboPopup.jsx (tier.grad, linear-gradient 95deg).
private val TIERS = listOf(
    Tier(25, R.string.combo_tier_legendary,  Color(0xFFFFD700),
        listOf(Color(0xFFFFD700), Color(0xFFFF4500), Color(0xFFFF00FF), Color(0xFFFFD700)), 42, 3),
    Tier(20, R.string.combo_tier_superhuman,   Color(0xFFFF00FF),
        listOf(Color(0xFFFF00FF), Color(0xFF00BFFF), Color(0xFFFFD700), Color(0xFFFF00FF)), 40, 3),
    Tier(16, R.string.combo_tier_divine,  Color(0xFF00FFCC),
        listOf(Color(0xFF00FFCC), Color(0xFFFF00FF), Color(0xFFFFD700), Color(0xFF00FFCC)), 38, 3),
    Tier(13, R.string.combo_tier_unbelievable, Color(0xFFFF4500),
        listOf(Color(0xFFFF4500), Color(0xFFFFD700), Color(0xFF00BFFF), Color(0xFFFF4500)), 36, 3),
    Tier(9, R.string.combo_tier_frenzy,  Color(0xFFFF5470),
        listOf(Color(0xFFFF5470), Color(0xFFFF9F45), Color(0xFFFFC24B), Color(0xFFFF5470)), 34, 3),
    Tier(7, R.string.combo_tier_amazing,       Color(0xFFFF7A3C),
        listOf(Color(0xFFFF7A3C), Color(0xFFFFC24B), Color(0xFFFF6FA5), Color(0xFFFF7A3C)), 32, 2),
    Tier(5, R.string.combo_tier_excellent,     Color(0xFFF0A92E),
        listOf(Color(0xFFFFC24B), Color(0xFF5FC98A), Color(0xFF6FA8FF), Color(0xFFFFC24B)), 30, 2),
    Tier(4, R.string.combo_tier_perfect,     Color(0xFF3FA86A),
        listOf(Color(0xFF5FC98A), Color(0xFF3FB6C9), Color(0xFF6FA8FF), Color(0xFF5FC98A)), 29, 1),
    Tier(2, R.string.combo_tier_great,    Color(0xFF6E7BF0),
        listOf(Color(0xFF6FA8FF), Color(0xFFB98CFF), Color(0xFFFF6FA5), Color(0xFF6FA8FF)), 28, 0),
    Tier(0, R.string.combo_tier_good,          Color(0xFF8A6BF0),
        listOf(Color(0xFFB98CFF), Color(0xFF6FA8FF), Color(0xFF5FC98A), Color(0xFFB98CFF)), 26, 0),
)

private fun tierFor(combo: Int) = TIERS.first { combo >= it.min }

// 8 hướng offset (±1dp) cho viền trắng cartoon quanh chữ ×N / lời khen (đậm như design stroke).
private val OUTLINE_DIRS = listOf(
    -1 to -1, 0 to -1, 1 to -1, -1 to 0, 1 to 0, -1 to 1, 0 to 1, 1 to 1,
)

// Cắt khoảng đệm dòng (line-height:1 của design) để ×N và lời khen ÔM SÁT glyph → chữ khen
// nằm sát ngay dưới ×N, không bị cách xa bởi font-padding mặc định của Baloo 2.
private val TrimPlatform   = PlatformTextStyle(includeFontPadding = false)
private val TrimLineHeight = LineHeightStyle(
    alignment = LineHeightStyle.Alignment.Center,
    trim      = LineHeightStyle.Trim.Both,
)

// ── per-letter praise colours (7-colour rainbow cycle) ────────────────────────

private val JELLY_COLORS = listOf(
    Color(0xFFFF6FA5), Color(0xFFFF9F45), Color(0xFFFFC24B),
    Color(0xFF5FC98A), Color(0xFF3FB6C9), Color(0xFF6FA8FF), Color(0xFFB98CFF),
)

private fun coloredPraiseString(word: String, stars: Int) = buildAnnotatedString {
    val starStyle = SpanStyle(color = Color(0xFFFFC24B))
    if (stars > 0) withStyle(starStyle) { append("✦ ") }
    var idx = 0
    for (ch in word) {
        if (ch == ' ') {
            append(' ')
        } else {
            withStyle(SpanStyle(color = JELLY_COLORS[idx % JELLY_COLORS.size])) { append(ch) }
            idx++
        }
    }
    if (stars > 0) withStyle(starStyle) { append(" ✦") }
}

// ── drop model ────────────────────────────────────────────────────────────────

private val DROP_COLORS = listOf(JellyColor.YELLOW, JellyColor.MINT, JellyColor.PINK, JellyColor.BLUE)

private data class DropSpec(
    val xDp: Float,        // horizontal offset from container center (87dp)
    val color: JellyColor,
    val sizeDp: Float,
    val r0: Float,         // rotation at start of fall
    val r1: Float,         // rotation at rest
    val delayMs: Int,
)

private fun computeDrops(n: Int): List<DropSpec> = List(n) { i ->
    val t   = if (n > 1) i.toFloat() / (n - 1) else 0.5f
    val jit = (if (i % 2 == 1) 1f else -1f) * (4 + (i % 3) * 3).toFloat()
    val x   = ((t - 0.5f) * 106f + jit).roundToInt().toFloat()   // dishW-44=106dp spread
    DropSpec(
        xDp     = x,
        color   = DROP_COLORS[(i * 3 + 1) % 4],
        sizeDp  = (16 + (i % 3) * 3).toFloat(),
        r0      = ((i * 53) % 80 - 40).toFloat(),
        r1      = ((i * 29) % 22 - 11).toFloat(),
        delayMs = i * 58,
    )
}

// ── drop animation derivations ────────────────────────────────────────────────

// prog is 0→1 following keyframe-paced time. Derive translateY relative to rest.
private fun dropYDp(prog: Float, fallDp: Float): Float = when {
    prog < 0.60f -> lerp(-fallDp, 0f,   prog / 0.60f)
    prog < 0.73f -> lerp(0f,    -13f,  (prog - 0.60f) / 0.13f)
    prog < 0.85f -> lerp(-13f,   0f,   (prog - 0.73f) / 0.12f)
    prog < 0.93f -> lerp(0f,    -4f,   (prog - 0.85f) / 0.08f)
    else          -> lerp(-4f,   0f,   (prog - 0.93f) / 0.07f)
}

private fun squashScaleY(prog: Float): Float = when {
    prog < 0.57f -> 1f
    prog < 0.63f -> lerp(1f,    0.68f, (prog - 0.57f) / 0.06f)
    prog < 0.73f -> lerp(0.68f, 1.08f, (prog - 0.63f) / 0.10f)
    prog < 0.85f -> lerp(1.08f, 0.95f, (prog - 0.73f) / 0.12f)
    prog < 1.00f -> lerp(0.95f, 1.00f, (prog - 0.85f) / 0.15f)
    else          -> 1f
}

private fun squashScaleX(prog: Float): Float = when {
    prog < 0.57f -> 1f
    prog < 0.63f -> lerp(1f,    1.20f, (prog - 0.57f) / 0.06f)
    prog < 0.73f -> lerp(1.20f, 0.92f, (prog - 0.63f) / 0.10f)
    prog < 0.85f -> lerp(0.92f, 1.05f, (prog - 0.73f) / 0.12f)
    prog < 1.00f -> lerp(1.05f, 1.00f, (prog - 0.85f) / 0.15f)
    else          -> 1f
}

private fun lerp(a: Float, b: Float, t: Float) = a + (b - a) * t.coerceIn(0f, 1f)

// ── JellyColor → palette colours ─────────────────────────────────────────────

private data class BlockColors(val fill: Color, val edge: Color, val shine: Color)

private fun jellyColors(c: JellyColor) = when (c) {
    JellyColor.YELLOW -> BlockColors(GjPalette.BlockYellow, GjPalette.BlockYellowEdge, GjPalette.BlockYellowShine)
    JellyColor.MINT   -> BlockColors(GjPalette.BlockMint,   GjPalette.BlockMintEdge,   GjPalette.BlockMintShine)
    JellyColor.PINK   -> BlockColors(GjPalette.BlockPink,   GjPalette.BlockPinkEdge,   GjPalette.BlockPinkShine)
    JellyColor.BLUE   -> BlockColors(GjPalette.BlockBlue,   GjPalette.BlockBlueEdge,   GjPalette.BlockBlueShine)
}

// ── ComboPopup ────────────────────────────────────────────────────────────────

/**
 * Bong bóng ăn mừng chuỗi: "×N" nảy lên + lời khen + n mảnh jelly rơi xuống đĩa.
 *
 * [combo]: số nhân chuỗi. combo > 1 → hiện "×N" + lời khen.
 * [praise]: ghi đè lời khen tự động.
 * [visible]: false → không render (cha quản lý vòng đời; remount với key mới để phát lại).
 * Đặt overlapping lên board tại vị trí chuỗi resolve.
 */
@Composable
fun ComboPopup(
    combo: Int = 2,
    modifier: Modifier = Modifier,
    praise: String? = null,
    showDish: Boolean = true,
    showPieces: Boolean = true,
    showText: Boolean = true,
    heightDp: Dp = 120.dp,
    visible: Boolean = true,
    textScale: Float = 1f,
) {
    if (!visible) return

    val tier    = remember(combo) { tierFor(combo) }
    // Cỡ chữ ×N hiệu dụng = numSize của tier × textScale. Mọi cỡ dẫn xuất (dấu ×, lời khen,
    // khoảng cách dọc) tính từ [numSp] nên scale đồng bộ. Chỉ burst in-game phóng to (textScale=2f);
    // Cẩm nang/demo/Level Info giữ 1f để layout không vỡ.
    val numSp   = tier.numSize * textScale
    val word    = praise ?: stringResource(tier.wordRes)
    val hasText = combo > 1 && showText
    val n       = (combo + 2).coerceIn(3, 9)
    val drops   = remember(n) { computeDrops(n) }
    // fh = height - floor - 26; floor=16, so fh = 120-16-26 = 78dp
    val fallDp  = (heightDp.value - 16f - 26f).coerceAtLeast(20f)

    // ── combo text animations ─────────────────────────────────────────────────

    val popScale  = remember { Animatable(0.3f) }
    val popAlpha  = remember { Animatable(0f) }
    val popRotate = remember { Animatable(-8f) }
    val numScale  = remember { Animatable(1f) }

    if (hasText) {
        LaunchedEffect(Unit) {
            launch {
                popScale.animateTo(1f, keyframes {
                    durationMillis = 520
                    0.3f  at 0
                    1.16f at 234   // 45%
                    0.96f at 364   // 70%
                    1.00f at 520
                })
            }
            launch {
                popAlpha.animateTo(1f, keyframes {
                    durationMillis = 234
                    0f at 0; 1f at 234
                })
            }
            launch {
                popRotate.animateTo(0f, keyframes {
                    durationMillis = 520
                    (-8f) at 0
                    3f    at 234
                    (-1f) at 364
                    0f    at 520
                })
            }
            launch {
                numScale.animateTo(1f, keyframes {
                    durationMillis = 520
                    1f    at 100   // 100ms delay start
                    1.20f at 308   // 40% of 520 after delay
                    1f    at 520
                })
            }
        }
    }

    // ── drop animations ───────────────────────────────────────────────────────

    val dropProgs = remember(n) { List(n) { Animatable(0f) } }
    if (showPieces) {
        LaunchedEffect(Unit) {
            drops.forEachIndexed { i, drop ->
                launch {
                    kotlinx.coroutines.delay(drop.delayMs.toLong())
                    dropProgs[i].animateTo(1f, keyframes {
                        durationMillis = 660
                        0.00f at 0
                        0.60f at 396    // 60% — arrives at rest
                        0.73f at 482    // 73% — peak first bounce
                        0.85f at 561    // 85% — back at rest
                        0.93f at 614    // 93% — peak small bounce
                        1.00f at 660
                    })
                }
            }
        }
    }

    // dish bob
    val dishBobY = remember { Animatable(0f) }
    if (showDish && showPieces) {
        LaunchedEffect(Unit) {
            kotlinx.coroutines.delay(360)
            dishBobY.animateTo(0f, keyframes {
                durationMillis = 460
                0f  at 0
                2f  at 138   // 30% — slight dip
                0f  at 460
            })
        }
    }

    // ── layout ────────────────────────────────────────────────────────────────

    // Container: 174dp wide (dishW 150 + 24), variable height
    Box(
        modifier = modifier.size(width = 174.dp, height = heightDp),
    ) {
        // ── combo text ─────────────────────────────────────────────────────────
        // Vầng sáng mềm sau cụm chữ (ComboPopup.jsx §glow): radial 24% tier.color,
        // 150×64dp, fade hết ở 72% bán kính — tăng độ đọc trên nền vườn.
        if (hasText) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .offset(y = (-2).dp)
                    .size(width = 150.dp, height = 64.dp)
                    .alpha(popAlpha.value)
                    .drawBehind {
                        drawOval(
                            brush = Brush.radialGradient(
                                colorStops = arrayOf(
                                    0f    to tier.color.copy(alpha = 0.24f),
                                    0.72f to Color.Transparent,
                                ),
                                center = Offset(size.width / 2f, size.height / 2f),
                                radius = size.minDimension / 2f,
                            ),
                        )
                    },
            )
        }
        if (hasText) {
            Column(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .alpha(popAlpha.value)
                    .graphicsLayer {
                        scaleX          = popScale.value
                        scaleY          = popScale.value
                        rotationZ       = popRotate.value
                        transformOrigin = androidx.compose.ui.graphics.TransformOrigin(0.5f, 0.5f)
                    },
                horizontalAlignment = Alignment.CenterHorizontally,
                // Kéo lời khen SÁT RẠT dưới ×N. Khoảng hở dư theo cỡ số (line box) nên trừ tỉ lệ
                // với tier.numSize thay vì hằng số → mọi tier đều dính sát (design gap≈1px).
                verticalArrangement = Arrangement.spacedBy(-(numSp * 0.40f).dp),
            ) {
                // ×N with white outline (drawn behind + colored on top)
                // unbounded: khi textScale phóng to (burst in-game), ×N đo theo bề rộng THẬT của chữ
                // rồi canh giữa TRÀN ra ngoài khung 174dp — không bị ép xuống hàng / cắt cụt.
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier.wrapContentWidth(unbounded = true),
                ) {
                    val comboStr = buildAnnotatedString {
                        withStyle(SpanStyle(fontSize = (numSp * 0.62f).sp)) { append("×") }
                        withStyle(SpanStyle(fontSize = numSp.sp))           { append(combo.toString()) }
                    }
                    // weight-extra (800) = token "số / score pop" của design (ComboPopup.jsx var(--weight-extra)).
                    val outlineStyle = MaterialTheme.typography.headlineLarge.copy(
                        fontWeight      = FontWeight.ExtraBold,
                        lineHeight      = numSp.sp,
                        lineHeightStyle = TrimLineHeight,
                        platformStyle   = TrimPlatform,
                        shadow          = Shadow(Color.White, Offset.Zero, blurRadius = 3f),
                    )
                    // Outline trắng 8 HƯỚNG (≈ WebkitTextStroke 3px của design) → chữ dày, nổi trên nền vườn.
                    for ((dx, dy) in OUTLINE_DIRS) {
                        Text(
                            text     = comboStr,
                            style    = outlineStyle.copy(color = Color.White),
                            softWrap = false,
                            maxLines = 1,
                            modifier = Modifier.offset(dx.dp, dy.dp),
                        )
                    }
                    // ×N tô GRADIENT cầu vồng (ComboPopup.jsx tier.grad, ~95° ≈ ngang).
                    // Giữ brush TĨNH (không scroll hue mỗi frame) để tôn trọng anti-jank:
                    // KHÔNG drive animation bằng recomposition — vẫn đa sắc đúng nhận diện.
                    Text(
                        text  = comboStr,
                        softWrap = false,
                        maxLines = 1,
                        style = outlineStyle.copy(
                            brush = Brush.linearGradient(
                                colors = tier.grad,
                                start  = Offset(0f, 0f),
                                end    = Offset(Float.POSITIVE_INFINITY, 0f),
                            ),
                        ),
                        modifier = Modifier.graphicsLayer {
                            scaleX = numScale.value
                            scaleY = numScale.value
                        },
                    )
                }

                // Lời khen: chữ tô màu/jelly + outline trắng 8 hướng (design WHITE_OUTLINE: 8×1px + drop).
                // weight-extra (800) cho dày, nổi bật như design (var(--weight-extra)).
                val praiseString = remember(word, tier.stars) { coloredPraiseString(word, tier.stars) }
                val plainWord    = remember(word, tier.stars) { if (tier.stars > 0) "✦ $word ✦" else word }
                val praiseStyle  = MaterialTheme.typography.headlineLarge.copy(
                    fontSize        = (numSp * 0.44f).sp,
                    fontWeight      = FontWeight.ExtraBold,
                    lineHeight      = (numSp * 0.44f).sp,
                    lineHeightStyle = TrimLineHeight,
                    platformStyle   = TrimPlatform,
                    letterSpacing   = 0.5.sp,
                )
                // unbounded + softWrap=false: lời khen (có ✦…✦) LUÔN nằm 1 hàng, canh giữa tràn ra
                // ngoài khung khi phóng to → sao hai bên không rớt xuống hàng / vỡ.
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier.wrapContentWidth(unbounded = true),
                ) {
                    // bản trắng 8 hướng (đặt SAU) làm viền cartoon + bóng nâu nhẹ ở dưới
                    val praiseOutline = praiseStyle.copy(
                        color  = Color.White,
                        shadow = Shadow(Color(0x47785C34), Offset(0f, 2f), blurRadius = 2f),
                    )
                    for ((dx, dy) in OUTLINE_DIRS) {
                        Text(
                            text = plainWord, style = praiseOutline, softWrap = false, maxLines = 1,
                            modifier = Modifier.offset(dx.dp, dy.dp),
                        )
                    }
                    Text(text = praiseString, style = praiseStyle, softWrap = false, maxLines = 1)
                }
            }
        }

        // ── dish ───────────────────────────────────────────────────────────────
        if (showDish && showPieces) {
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .offset(y = (-2).dp + dishBobY.value.dp)
                    .size(width = 150.dp, height = 32.dp)
                    .drawBehind {
                        val dishW = size.width
                        val dishH = size.height

                        // outer oval: cream gradient, 2dp border
                        drawOval(
                            brush = Brush.verticalGradient(
                                listOf(Color(0xFFFBEFD8), Color(0xFFECD9B4)),
                                startY = 2f, endY = 30.dp.toPx(),
                            ),
                            topLeft = Offset(0f, dishH - 30.dp.toPx()),
                            size    = Size(dishW, 30.dp.toPx()),
                        )
                        drawOval(
                            color   = Color(0xFFE2C896),
                            topLeft = Offset(0f, dishH - 30.dp.toPx()),
                            size    = Size(dishW, 30.dp.toPx()),
                            style   = Stroke(2.dp.toPx()),
                        )

                        // inner oval: darker cream, inset
                        val innerW = dishW - 26.dp.toPx()
                        val innerX = (dishW - innerW) / 2f
                        drawOval(
                            brush   = Brush.radialGradient(
                                listOf(Color(0xFFE7D2A6), Color(0xFFD8BE8A)),
                                center = Offset(dishW / 2f, 10.dp.toPx()),
                                radius = dishW * 0.6f,
                            ),
                            topLeft = Offset(innerX, 1.dp.toPx()),
                            size    = Size(innerW, 19.dp.toPx()),
                        )
                    },
            )
        }

        // ── falling jelly pieces ───────────────────────────────────────────────
        if (showPieces) {
            val floorOffset = 16.dp   // floor = 16dp from bottom
            drops.forEachIndexed { i, drop ->
                val prog      = dropProgs[i].value
                val yOff      = dropYDp(prog, fallDp)
                val dropAlpha = (prog / 0.09f).coerceIn(0f, 1f)
                val rotation  = if (prog < 0.6f) lerp(drop.r0, drop.r1, prog / 0.6f) else drop.r1

                MiniJelly(
                    color    = drop.color,
                    sizeDp   = drop.sizeDp.dp,
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .offset(
                            x = 87.dp + drop.xDp.dp - (drop.sizeDp / 2f).dp,
                            y = -floorOffset + yOff.dp,
                        )
                        .alpha(dropAlpha)
                        .graphicsLayer {
                            scaleX          = squashScaleX(prog)
                            scaleY          = squashScaleY(prog)
                            rotationZ       = rotation
                            transformOrigin = androidx.compose.ui.graphics.TransformOrigin(0.5f, 1.0f)
                        },
                )
            }
        }
    }
}

// ── MiniJelly ────────────────────────────────────────────────────────────────

@Composable
private fun MiniJelly(color: JellyColor, sizeDp: Dp, modifier: Modifier = Modifier) {
    val pal     = remember(color) { jellyColors(color) }
    val radiusFrac = 0.30f   // Math.max(4, Math.round(size*0.3)) / size ≈ 0.30

    Box(
        modifier = modifier
            .size(sizeDp)
            .drawBehind {
                val r = CornerRadius(size.width * radiusFrac)

                // fill
                drawRoundRect(pal.fill, cornerRadius = r)
                // border (2dp edge)
                drawRoundRect(pal.edge, cornerRadius = r, style = Stroke(2.dp.toPx()))
                // gloss strip: top 1dp, 16% inset, 36% height, shine 0.9 alpha
                val inset  = size.width * 0.16f
                val glossH = size.height * 0.36f
                drawOval(
                    color   = pal.shine.copy(alpha = 0.9f),
                    topLeft = Offset(inset, 1.dp.toPx()),
                    size    = Size(size.width - inset * 2f, glossH),
                )
            },
    )
}

// ── previews ──────────────────────────────────────────────────────────────────

@Preview(name = "ComboPopup — combo 2 (TỐT!)",      widthDp = 200, heightDp = 140)
@Composable
private fun ComboPreview2() {
    GravityJellyTheme {
        Box(Modifier.background(GjPalette.Bg).padding(13.dp), contentAlignment = Alignment.Center) {
            ComboPopup(combo = 2)
        }
    }
}

@Preview(name = "ComboPopup — combo 4 (HOÀN HẢO!)", widthDp = 200, heightDp = 140)
@Composable
private fun ComboPreview4() {
    GravityJellyTheme {
        Box(Modifier.background(GjPalette.Bg).padding(13.dp), contentAlignment = Alignment.Center) {
            ComboPopup(combo = 4)
        }
    }
}

@Preview(name = "ComboPopup — combo 7 (AMAZING!)",   widthDp = 200, heightDp = 140)
@Composable
private fun ComboPreview7() {
    GravityJellyTheme {
        Box(Modifier.background(GjPalette.Bg).padding(13.dp), contentAlignment = Alignment.Center) {
            ComboPopup(combo = 7)
        }
    }
}

@Preview(name = "ComboPopup — combo 9 (CUỒNG NHIỆT!)", widthDp = 200, heightDp = 140)
@Composable
private fun ComboPreview9() {
    GravityJellyTheme {
        Box(Modifier.background(GjPalette.Bg).padding(13.dp), contentAlignment = Alignment.Center) {
            ComboPopup(combo = 9)
        }
    }
}

@Preview(name = "ComboPopup — combo 1 (chỉ mảnh rơi)", widthDp = 200, heightDp = 140)
@Composable
private fun ComboPreview1() {
    GravityJellyTheme {
        Box(Modifier.background(GjPalette.Bg).padding(13.dp), contentAlignment = Alignment.Center) {
            ComboPopup(combo = 1)
        }
    }
}
