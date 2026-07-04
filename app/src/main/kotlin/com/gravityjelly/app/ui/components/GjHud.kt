package com.gravityjelly.app.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.addPathNodes
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjBorder
import com.gravityjelly.app.ui.theme.GjDimens
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GjLogoFontFamily
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.app.R
import com.gravityjelly.core.Direction
import com.gravityjelly.game.GjEase

// ── animation easing (token chung) ─────────────────────────────────────────────

private val EaseInOut = GjEase.inOut

// ── arrow ImageVector (18dp, strokeWidth 2.6, path from Hud.jsx) ──────────────

private val GravityArrow: ImageVector by lazy {
    ImageVector.Builder(
        defaultWidth   = 18.dp,
        defaultHeight  = 18.dp,
        viewportWidth  = 24f,
        viewportHeight = 24f,
    ).addPath(
        pathData        = addPathNodes("M12 4v15M6 13l6 6 6-6"),
        fill            = null,
        stroke          = SolidColor(Color.Black),
        strokeLineWidth = 2.6f,
        strokeLineCap   = StrokeCap.Round,
        strokeLineJoin  = StrokeJoin.Round,
    ).build()
}

// ── score formatter → Vietnamese thousands dot e.g. 12480 → "12.480" ─────────

private fun Int.toViScore(): String {
    if (this == 0) return "0"
    val reversed = toString().reversed()
    return reversed.chunked(3).joinToString(".").reversed()
}

// ── target rotation (degrees) per Direction ───────────────────────────────────
// Mũi tên gốc (path Hud.jsx) chỉ XUỐNG. Mũi tên phải chỉ ĐÚNG hướng trọng lực kéo
// (hướng khối rơi). Compose rotate() quay THEO CHIỀU KIM ĐỒNG HỒ với góc dương; từ base
// chỉ xuống: +90° → trái, +180° → lên, +270° → phải. Thứ tự này khớp đúng chuỗi xoay CW
// của Direction.rotateCW (DOWN→LEFT→UP→RIGHT): mỗi lần nhấn xoay, mũi tên +90° cùng icon.
private fun Direction.arrowDeg() = when (this) {
    Direction.DOWN  ->   0f   // base đã chỉ xuống
    Direction.LEFT  ->  90f
    Direction.UP    -> 180f
    Direction.RIGHT -> 270f
}

// ── GjHud ─────────────────────────────────────────────────────────────────────

/**
 * HUD 56dp: điểm (trái) · chỉ báo trọng lực (giữa) · nút tạm dừng (phải).
 * [direction] drive mũi tên xoay 350ms ease-inout (tìm cung ngắn nhất).
 */
@Composable
fun GjHud(
    score: Int,
    direction: Direction,
    onPause: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(GjDimens.hudHeight)
            .padding(horizontal = GjSpace.lg),
        horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        // ── Score (left) ────────────────────────────────────────────────────
        Column(
            modifier = Modifier
                .weight(1f)
                .widthIn(min = 84.dp),
            verticalArrangement = Arrangement.Center,
        ) {
            Text(
                text  = stringResource(R.string.hud_score),
                style = MaterialTheme.typography.labelSmall.copy(
                    color         = GjPalette.TextMuted,
                    fontWeight    = FontWeight.Bold,
                    letterSpacing = 0.04.em,
                ),
            )
            Text(
                text  = score.toViScore(),
                style = MaterialTheme.typography.titleLarge.copy(
                    // HUD number = font-display (Fredoka) theo 02-typography.css; chỉ chữ số,
                    // không dấu tiếng Việt nên Fredoka phủ đủ glyph (Baloo2 chỉ cho text có dấu).
                    fontFamily = GjLogoFontFamily,
                    color      = GjPalette.Text,
                    fontWeight = FontWeight.Bold,
                    lineHeight = 1.1.em,
                ),
            )
        }

        // ── Gravity indicator (center) ───────────────────────────────────
        GravityIndicator(direction = direction)

        // ── Pause button (right) ─────────────────────────────────────────
        Box(
            modifier = Modifier
                .weight(1f),
            contentAlignment = Alignment.CenterEnd,
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .shadow(
                        elevation     = 2.dp,
                        shape         = RoundedCornerShape(GjRadius.lg),
                        ambientColor  = GjPalette.ShadowSoft,
                        spotColor     = GjPalette.ShadowSoft,
                    )
                    .background(GjPalette.Surface, RoundedCornerShape(GjRadius.lg))
                    .border(GjBorder.thin, Color(0xFFECDFC9), RoundedCornerShape(GjRadius.lg))
                    .clickable(
                        onClick              = onPause,
                        interactionSource    = remember { MutableInteractionSource() },
                        indication           = null,
                    ),
                contentAlignment = Alignment.Center,
            ) {
                GjIcon(
                    icon               = GjIcons.Pause,
                    contentDescription = stringResource(R.string.hud_pause),
                    modifier           = Modifier.size(22.dp),
                    tint               = GjPalette.Text,
                )
            }
        }
    }
}

// ── GravityIndicator ──────────────────────────────────────────────────────────

@Composable
private fun GravityIndicator(direction: Direction) {
    val density = LocalDensity.current.density
    val edgeD   = 3.dp
    val edgeDpx = { edgeD.value * density }

    // Shortest-path cumulative rotation so animation never wraps >180°
    var cumulativeAngle by remember { mutableFloatStateOf(direction.arrowDeg()) }
    LaunchedEffect(direction) {
        val target  = direction.arrowDeg()
        val cur     = ((cumulativeAngle % 360f) + 360f) % 360f
        val delta   = ((target - cur + 540f) % 360f) - 180f
        cumulativeAngle += delta
    }
    val animatedAngle by animateFloatAsState(
        targetValue   = cumulativeAngle,
        animationSpec = tween(durationMillis = 350, easing = EaseInOut),
        label         = "gravity_arrow",
    )

    Box(
        modifier = Modifier
            .height(36.dp + edgeD)
            .drawBehind {
                val ePx = edgeDpx()
                val r   = size.height * 50f  // pill = huge corner radius
                // edge
                drawRoundRect(GjPalette.GravityEdge, cornerRadius = CornerRadius(r))
                // face
                drawRoundRect(
                    GjPalette.Gravity,
                    topLeft = Offset(0f, 0f),
                    size    = Size(size.width, size.height - ePx),
                    cornerRadius = CornerRadius(r),
                )
            },
        contentAlignment = Alignment.TopCenter,
    ) {
        Row(
            modifier = Modifier
                .height(36.dp)
                .padding(horizontal = GjSpace.md),
            horizontalArrangement = Arrangement.spacedBy(GjSpace.xs),
            verticalAlignment     = Alignment.CenterVertically,
        ) {
            GjIcon(
                icon               = GravityArrow,
                contentDescription = null,
                modifier           = Modifier
                    .size(18.dp)
                    .rotate(animatedAngle),
                tint               = GjPalette.TextInvert,
            )
            Text(
                text  = stringResource(R.string.hud_gravity),
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontSize      = 14.sp,
                    color         = GjPalette.TextInvert,
                    letterSpacing = 0.04.em,
                    fontWeight    = FontWeight.SemiBold,
                    lineHeight    = 1.em,
                ),
            )
        }
    }
}

// ── previews ──────────────────────────────────────────────────────────────────

@Preview(name = "Hud — 4 hướng trọng lực", widthDp = 380, heightDp = 260)
@Composable
private fun GjHudPreview() {
    GravityJellyTheme {
        Column(
            Modifier.background(GjPalette.SurfaceSunken),
            verticalArrangement = Arrangement.spacedBy(2.dp),
        ) {
            GjHud(score = 12_480, direction = Direction.DOWN,  onPause = {}, Modifier.background(GjPalette.Bg))
            GjHud(score = 1_200,  direction = Direction.RIGHT, onPause = {}, Modifier.background(GjPalette.Bg))
            GjHud(score = 350,    direction = Direction.UP,    onPause = {}, Modifier.background(GjPalette.Bg))
            GjHud(score = 99_999, direction = Direction.LEFT,  onPause = {}, Modifier.background(GjPalette.Bg))
        }
    }
}
