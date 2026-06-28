package com.gravityjelly.app.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.game.GjEase
import kotlinx.coroutines.launch

// spring easing — token chung từ :game GjEase
private val EaseJelly = GjEase.jelly

// ── GjDialog ──────────────────────────────────────────────────────────────────

/**
 * Modal mềm: scrim ấm + thẻ bo tròn nảy vào (280ms ease-jelly).
 *
 * Đặt trong một Box/layout fullscreen (cha phải đủ rộng để phủ màn hình).
 * Không có animation thoát — cha điều khiển vòng đời bằng [open].
 *
 * [dismissable]: false → không đóng khi chạm scrim, ẩn nút X (màn game-over bắt buộc chọn).
 * [actions]: slot cho các [GjButton] xếp dọc (thường fullWidth).
 * [content]: nội dung phụ bên dưới tiêu đề (body text, v.v.).
 */
@Composable
fun GjDialog(
    open: Boolean,
    title: String,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    dismissable: Boolean = true,
    onClose: (() -> Unit)? = null,
    actions: (@Composable () -> Unit)? = null,
    content: (@Composable () -> Unit)? = null,
) {
    val density = LocalDensity.current.density

    // scrim fades in; content removed from composition immediately when open=false
    AnimatedVisibility(
        visible  = open,
        enter    = fadeIn(tween(durationMillis = 200)),
        exit     = fadeOut(tween(durationMillis = 150)),
        modifier = modifier.fillMaxSize(),
    ) {
        // scrim — click-to-dismiss if allowed
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(GjPalette.Overlay)
                .then(
                    if (dismissable && onClose != null)
                        Modifier.clickable(
                            onClick           = onClose,
                            interactionSource = remember { MutableInteractionSource() },
                            indication        = null,
                        )
                    else Modifier
                ),
            contentAlignment = Alignment.Center,
        ) {
            // card spring-in animation (independent of scrim fade)
            val cardScale  = remember { Animatable(0.85f) }
            val cardSlideY = remember { Animatable(12f) }   // dp
            LaunchedEffect(Unit) {
                val spec = tween<Float>(durationMillis = 280, easing = EaseJelly)
                launch { cardScale.animateTo(1f,  spec) }
                launch { cardSlideY.animateTo(0f, spec) }
            }

            DialogCard(
                title       = title,
                icon        = icon,
                dismissable = dismissable,
                onClose     = onClose,
                actions     = actions,
                content     = content,
                modifier    = Modifier.graphicsLayer {
                    scaleX       = cardScale.value
                    scaleY       = cardScale.value
                    translationY = cardSlideY.value * density
                },
            )
        }
    }
}

// ── DialogCard ────────────────────────────────────────────────────────────────

@Composable
private fun DialogCard(
    title: String,
    icon: ImageVector?,
    dismissable: Boolean,
    onClose: (() -> Unit)?,
    actions: (@Composable () -> Unit)?,
    content: (@Composable () -> Unit)?,
    modifier: Modifier = Modifier,
) {
    val cardShape = RoundedCornerShape(GjRadius.xxl)  // radius-2xl = 36dp

    Box(
        modifier = modifier
            .widthIn(max = 312.dp)
            .fillMaxWidth()
            // stop scrim click propagating through the card
            .clickable(
                onClick           = {},
                interactionSource = remember { MutableInteractionSource() },
                indication        = null,
            )
            .shadow(
                elevation    = 12.dp,
                shape        = cardShape,
                ambientColor = GjPalette.ShadowKey,
                spotColor    = GjPalette.ShadowKey,
            )
            .clip(cardShape)
            .background(GjPalette.Surface)
            .padding(GjSpace.xl),
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(0.dp)) {

            // ── title row ──────────────────────────────────────────────────
            Row(
                modifier            = Modifier
                    .fillMaxWidth()
                    .padding(bottom = if (content != null) GjSpace.md else GjSpace.lg),
                horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
                verticalAlignment     = Alignment.CenterVertically,
            ) {
                // icon badge (optional)
                if (icon != null) {
                    Box(
                        modifier         = Modifier
                            .size(36.dp)
                            .background(GjPalette.SurfaceSunken, RoundedCornerShape(GjRadius.md)),
                        contentAlignment = Alignment.Center,
                    ) {
                        GjIcon(
                            icon               = icon,
                            contentDescription = null,
                            modifier           = Modifier.size(22.dp),
                            tint               = GjPalette.Gravity,
                        )
                    }
                }

                // title text
                Text(
                    text     = title,
                    style    = MaterialTheme.typography.headlineMedium.copy(
                        color      = GjPalette.Text,
                        fontWeight = FontWeight.Bold,
                    ),
                    modifier = Modifier.weight(1f),
                )

                // close button (optional)
                if (dismissable && onClose != null) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(RoundedCornerShape(GjRadius.md))
                            .clickable(
                                onClick           = onClose,
                                interactionSource = remember { MutableInteractionSource() },
                                indication        = null,
                            ),
                        contentAlignment = Alignment.Center,
                    ) {
                        GjIcon(
                            icon               = GjIcons.Close,
                            contentDescription = "Đóng",
                            modifier           = Modifier.size(20.dp),
                            tint               = GjPalette.TextMuted,
                        )
                    }
                }
            }

            // ── body content (optional) ────────────────────────────────────
            if (content != null) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = GjSpace.lg),
                ) {
                    content()
                }
            }

            // ── actions (optional) ─────────────────────────────────────────
            if (actions != null) {
                Column(
                    modifier              = Modifier.fillMaxWidth(),
                    verticalArrangement   = Arrangement.spacedBy(GjSpace.sm),
                ) {
                    actions()
                }
            }
        }
    }
}

// ── previews ──────────────────────────────────────────────────────────────────

@Preview(name = "Dialog — Tạm dừng",   widthDp = 360, heightDp = 420)
@Composable
private fun DialogPausePreview() {
    GravityJellyTheme {
        Box(Modifier.fillMaxSize()) {
            GjDialog(
                open        = true,
                title       = "Tạm dừng",
                icon        = GjIcons.Pause,
                dismissable = true,
                onClose     = {},
                actions     = {
                    GjButton(onClick = {}, variant = BtnVariant.Primary, fullWidth = true,
                        icon = GjIcons.Play) { Text("Tiếp tục") }
                    GjButton(onClick = {}, variant = BtnVariant.Ghost, fullWidth = true,
                        icon = GjIcons.Home) { Text("Về Home") }
                },
            )
        }
    }
}

@Preview(name = "Dialog — Xác nhận thoát", widthDp = 360, heightDp = 460)
@Composable
private fun DialogConfirmPreview() {
    GravityJellyTheme {
        Box(Modifier.fillMaxSize()) {
            GjDialog(
                open        = true,
                title       = "Thoát game?",
                icon        = GjIcons.Close,
                dismissable = true,
                onClose     = {},
                content     = {
                    Text(
                        text  = "Tiến trình màn hiện tại sẽ không được lưu. Bạn có chắc muốn thoát?",
                        style = MaterialTheme.typography.bodyLarge.copy(color = GjPalette.TextMuted),
                    )
                },
                actions     = {
                    GjButton(onClick = {}, variant = BtnVariant.Danger,    fullWidth = true) { Text("Thoát") }
                    GjButton(onClick = {}, variant = BtnVariant.Secondary, fullWidth = true) { Text("Huỷ") }
                },
            )
        }
    }
}

@Preview(name = "Dialog — Game Over (bắt buộc)", widthDp = 360, heightDp = 440)
@Composable
private fun DialogGameOverPreview() {
    GravityJellyTheme {
        Box(Modifier.fillMaxSize()) {
            GjDialog(
                open        = true,
                title       = "Game Over",
                icon        = GjIcons.Heart,
                dismissable = false,
                content     = {
                    Text(
                        text  = "Hết chỗ đặt mảnh! Điểm của bạn: 12.480",
                        style = MaterialTheme.typography.bodyLarge.copy(color = GjPalette.TextMuted),
                    )
                },
                actions     = {
                    GjButton(onClick = {}, variant = BtnVariant.Primary, fullWidth = true,
                        icon = GjIcons.Refresh) { Text("Chơi lại") }
                    GjButton(onClick = {}, variant = BtnVariant.Ghost, fullWidth = true,
                        icon = GjIcons.Home) { Text("Về Home") }
                },
            )
        }
    }
}

@Preview(name = "Dialog — Không icon, không nút X", widthDp = 360, heightDp = 400)
@Composable
private fun DialogSimplePreview() {
    GravityJellyTheme {
        Box(Modifier.fillMaxSize()) {
            GjDialog(
                open    = true,
                title   = "Phiên bản 1.0.0",
                content = {
                    Text(
                        text  = "Gravity Jelly — game puzzle trọng lực. Xoay hướng rơi, dọn hàng, lập kỷ lục!",
                        style = MaterialTheme.typography.bodyLarge.copy(color = GjPalette.TextMuted),
                    )
                },
                actions = {
                    GjButton(onClick = {}, variant = BtnVariant.Primary, fullWidth = true) { Text("OK") }
                },
            )
        }
    }
}
