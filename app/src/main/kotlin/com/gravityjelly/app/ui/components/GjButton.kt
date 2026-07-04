package com.gravityjelly.app.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.res.stringResource
import com.gravityjelly.app.R
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjBorder
import com.gravityjelly.app.ui.theme.GjDimens
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.game.GjEase

// ── enums ─────────────────────────────────────────────────────────────────────

enum class BtnVariant { Primary, Gravity, Success, Danger, Secondary, Ghost }
enum class BtnSize    { Cta, Md }

// ── variant colour spec ───────────────────────────────────────────────────────

private data class BtnSpec(val fill: Color, val edge: Color, val shine: Color, val text: Color)

private fun specFor(v: BtnVariant) = when (v) {
    BtnVariant.Primary ->   BtnSpec(GjPalette.Primary,     GjPalette.PrimaryEdge,  GjPalette.PrimaryShine, GjPalette.TextInvert)
    BtnVariant.Gravity ->   BtnSpec(GjPalette.Gravity,     GjPalette.GravityEdge,  GjPalette.GravityShine, GjPalette.TextInvert)
    BtnVariant.Success ->   BtnSpec(GjPalette.Success,      Color(0xFF4FAE60),      Color(0xFF9BE3A8),       GjPalette.TextInvert)
    BtnVariant.Danger ->    BtnSpec(GjPalette.Danger,       Color(0xFFD66B5E),      Color(0xFFF7B4AC),       GjPalette.TextInvert)
    BtnVariant.Secondary -> BtnSpec(GjPalette.Surface,      Color(0xFFE7D9C2),      GjPalette.Surface,       GjPalette.Text)
    BtnVariant.Ghost ->     BtnSpec(Color.Transparent,      Color.Transparent,      Color.Transparent,       GjPalette.Text)
}

// ease-out per motion token (GjEase.out = cubic-bezier 0.18,0.80,0.32,1.00)
private val PressEasing = GjEase.out

// ── GjButton ──────────────────────────────────────────────────────────────────

/**
 * Nút candy 3D: mặt + edge dày bên dưới, nén xuống khi nhấn (translateY ease-out 150ms).
 *
 * [variant]: primary | gravity | success | danger | secondary | ghost
 * [size]: cta (56dp, radius 28) | md (48dp, radius 20) — luôn ≥ 48dp touch.
 * [comingSoon]: mờ 55% + pill "SẮP CÓ" + disable.
 * [icon]/[iconRight]: [ImageVector] từ [GjIcons].
 */
@Composable
fun GjButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: BtnVariant = BtnVariant.Primary,
    btnSize: BtnSize = BtnSize.Md,
    icon: ImageVector? = null,
    iconRight: ImageVector? = null,
    fullWidth: Boolean = false,
    enabled: Boolean = true,
    comingSoon: Boolean = false,
    content: @Composable () -> Unit,
) {
    val off     = !enabled || comingSoon
    val isGhost = variant == BtnVariant.Ghost
    val spec    = specFor(variant)
    val cta     = btnSize == BtnSize.Cta

    val btnH    = if (cta) GjDimens.ctaHeight else GjDimens.btnHeight
    val edgeD   = if (cta) 5.dp else 4.dp
    val cornerR = if (cta) GjRadius.xl else GjRadius.lg
    val padH    = if (cta) GjSpace.xxl else GjSpace.xl
    val iconSz  = if (cta) GjDimens.iconMd else GjDimens.iconSm
    val textStyle = MaterialTheme.typography.headlineMedium
        .let { if (cta) it else it.copy(fontSize = 14.sp) }

    var pressed by remember { mutableStateOf(false) }
    val pressShift by animateFloatAsState(
        targetValue    = if (pressed && !off) edgeD.value - 1f else 0f,
        animationSpec  = tween(durationMillis = 150, easing = PressEasing),
        label          = "gjbtn_press",
    )
    val density = LocalDensity.current.density

    Box(
        modifier = modifier
            .then(if (fullWidth) Modifier.fillMaxWidth() else Modifier)
            .alpha(if (off) 0.55f else 1f)
            .height(if (isGhost) btnH else btnH + edgeD)
            .pointerInput(off, onClick) {
                detectTapGestures(
                    onPress = {
                        if (!off) {
                            pressed = true
                            val released = tryAwaitRelease()
                            pressed = false
                            if (released) onClick()
                        }
                    },
                )
            }
            .drawBehind {
                if (!isGhost) {
                    val edgePx   = edgeD.value * density
                    val shiftPx  = pressShift * density
                    val cPx      = cornerR.value * density
                    val faceH    = size.height - edgePx

                    // 1. edge layer (full block)
                    drawRoundRect(spec.edge, cornerRadius = CornerRadius(cPx))
                    // 2. face layer (shifted on press)
                    drawRoundRect(
                        spec.fill,
                        topLeft = Offset(0f, shiftPx),
                        size    = Size(size.width, faceH),
                        cornerRadius = CornerRadius(cPx),
                    )
                    // 3. secondary thin border on face
                    if (variant == BtnVariant.Secondary) {
                        drawRoundRect(
                            spec.edge,
                            topLeft = Offset(0f, shiftPx),
                            size    = Size(size.width, faceH),
                            cornerRadius = CornerRadius(cPx),
                            style   = Stroke(GjBorder.thin.value * density),
                        )
                    }
                    // 4. gloss strip — top 3dp, inset 14%, height 34%, hidden when pressed
                    if (!pressed) {
                        val inset   = size.width * 0.14f
                        val glossH  = faceH * 0.34f
                        drawRoundRect(
                            spec.shine.copy(alpha = 0.5f),
                            topLeft = Offset(inset, shiftPx + 3f * density),
                            size    = Size(size.width - inset * 2f, glossH),
                            cornerRadius = CornerRadius(faceH * 50f),
                        )
                    }
                }
            },
        contentAlignment = Alignment.TopCenter,
    ) {
        Row(
            modifier = Modifier
                .height(btnH)
                .then(if (fullWidth) Modifier.fillMaxWidth() else Modifier)
                .offset(y = if (!isGhost) pressShift.dp else 0.dp)
                .padding(horizontal = padH),
            horizontalArrangement = Arrangement.spacedBy(GjSpace.sm, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (icon != null) {
                GjIcon(icon = icon, modifier = Modifier.size(iconSz), tint = spec.text)
            }
            CompositionLocalProvider(LocalTextStyle provides textStyle.copy(color = spec.text)) {
                content()
            }
            if (comingSoon) {
                Text(
                    text  = stringResource(R.string.button_coming_soon),
                    style = MaterialTheme.typography.labelSmall.copy(
                        color        = spec.text,
                        fontWeight   = FontWeight.Bold,
                        letterSpacing = 0.04.sp,
                    ),
                    maxLines = 1,
                    softWrap = false,
                    modifier = Modifier
                        .background(Color.White.copy(alpha = 0.35f), RoundedCornerShape(GjRadius.full))
                        .padding(horizontal = GjSpace.xs, vertical = GjSpace.xxs),
                )
            }
            if (iconRight != null) {
                GjIcon(icon = iconRight, modifier = Modifier.size(iconSz), tint = spec.text)
            }
        }
    }
}

// ── previews ──────────────────────────────────────────────────────────────────

@Preview(name = "Button — 6 variant + states", widthDp = 380, heightDp = 560)
@Composable
private fun GjButtonPreview() {
    GravityJellyTheme {
        Column(
            Modifier
                .background(GjPalette.Bg)
                .padding(GjSpace.lg),
            verticalArrangement = Arrangement.spacedBy(GjSpace.sm),
        ) {
            // 6 variants (MD)
            GjButton(onClick = {}, variant = BtnVariant.Primary,   icon = GjIcons.Play)   { Text("Tiếp tục") }
            GjButton(onClick = {}, variant = BtnVariant.Gravity,   icon = GjIcons.Rotate) { Text("Xoay trọng lực") }
            GjButton(onClick = {}, variant = BtnVariant.Success)                           { Text("Xác nhận") }
            GjButton(onClick = {}, variant = BtnVariant.Danger)                            { Text("Thoát game") }
            GjButton(onClick = {}, variant = BtnVariant.Secondary, icon = GjIcons.Settings) { Text("Cài đặt") }
            GjButton(onClick = {}, variant = BtnVariant.Ghost)                             { Text("Bỏ qua") }

            Spacer(Modifier.height(GjSpace.sm))

            // CTA (56dp) full-width
            GjButton(
                onClick   = {},
                variant   = BtnVariant.Primary,
                btnSize   = BtnSize.Cta,
                icon      = GjIcons.Play,
                fullWidth = true,
            ) { Text("Chơi ngay") }

            GjButton(
                onClick   = {},
                variant   = BtnVariant.Gravity,
                btnSize   = BtnSize.Cta,
                icon      = GjIcons.Rotate,
                fullWidth = true,
            ) { Text("Xoay") }

            Spacer(Modifier.height(GjSpace.sm))

            // comingSoon + disabled
            GjButton(onClick = {}, variant = BtnVariant.Secondary, icon = GjIcons.Star, comingSoon = true) {
                Text("Daily")
            }
            GjButton(onClick = {}, variant = BtnVariant.Primary, enabled = false, icon = GjIcons.Trophy) {
                Text("Disabled")
            }

            // iconRight
            GjButton(onClick = {}, variant = BtnVariant.Secondary, iconRight = GjIcons.Chevron) {
                Text("Bảng xếp hạng")
            }
        }
    }
}
