package com.gravityjelly.app.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjDimens
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.game.GjEase

// ── easing (token chung từ :game GjEase) ───────────────────────────────────────

private val EaseOut   = GjEase.out
private val EaseInOut = GjEase.inOut

// edge depth + size constants
private val EDGE_DP   = 5.dp    // candy bottom edge (= CSS boxShadow Y offset)
private val BTN_DP    = GjDimens.gravityBtn          // 64dp face circle
private val BADGE_OVF = 6.dp    // badge overflows 6dp above and to the right

// ── GravityRotateButton ───────────────────────────────────────────────────────

/**
 * FAB chữ ký 64dp xoay trọng lực 90° mỗi lần nhấn.
 *
 * [turnsLeft]: lượt xoay còn lại — badge hiện số này; = 0 → tắt hoàn toàn.
 * [disabled]: tắt thủ công (ngoài việc hết lượt).
 * Icon quay +90° tích lũy mỗi lần nhấn (350ms ease-inout).
 * Nút candy 3D: nhấn nén 4dp xuống edge, nhả bật lên 150ms ease-out.
 */
@Composable
fun GravityRotateButton(
    turnsLeft: Int,
    onRotate: () -> Unit,
    modifier: Modifier = Modifier,
    disabled: Boolean = false,
) {
    val off = disabled || turnsLeft <= 0

    // cumulative icon rotation (+90° per press)
    var spinAngle by remember { mutableFloatStateOf(0f) }
    val animSpin by animateFloatAsState(
        targetValue   = spinAngle,
        animationSpec = tween(durationMillis = 350, easing = EaseInOut),
        label         = "grb_spin",
    )

    // press-down animation
    var pressed by remember { mutableStateOf(false) }
    val pressShift by animateFloatAsState(
        targetValue   = if (pressed && !off) EDGE_DP.value - 1f else 0f,
        animationSpec = tween(durationMillis = 150, easing = EaseOut),
        label         = "grb_press",
    )

    val density = LocalDensity.current.density

    // outer Box: gives room for badge overflow (6dp top + 6dp right)
    // FAB with edge = BTN_DP + EDGE_DP tall; badge adds BADGE_OVF above
    Box(
        modifier = modifier.size(
            width  = BTN_DP + BADGE_OVF,
            height = BTN_DP + EDGE_DP + BADGE_OVF,
        ),
    ) {
        // ── FAB body (64dp face + 5dp edge = 69dp tall) ─────────────────────
        Box(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .size(width = BTN_DP, height = BTN_DP + EDGE_DP)
                .alpha(if (off) 0.7f else 1f)
                .pointerInput(off, onRotate) {
                    detectTapGestures(
                        onPress = {
                            if (!off) {
                                pressed = true
                                val released = tryAwaitRelease()
                                pressed = false
                                if (released) {
                                    spinAngle += 90f
                                    onRotate()
                                }
                            }
                        },
                    )
                }
                .drawBehind {
                    val edgePx  = EDGE_DP.value * density
                    val shiftPx = pressShift * density
                    val faceH   = size.height - edgePx        // 64dp * density
                    val fullR   = CornerRadius(size.width / 2f)

                    if (!off) {
                        // 1. edge layer (full circle, GravityEdge)
                        drawRoundRect(GjPalette.GravityEdge, cornerRadius = fullR)
                        // 2. face layer (Gravity, shifted down by pressShift)
                        drawRoundRect(
                            GjPalette.Gravity,
                            topLeft      = Offset(0f, shiftPx),
                            size         = Size(size.width, faceH),
                            cornerRadius = fullR,
                        )
                        // 3. gloss: top 6dp, 24% inset, 24% height, hidden on press
                        if (!pressed) {
                            val inset  = size.width * 0.24f
                            val glossH = faceH * 0.24f
                            drawRoundRect(
                                color        = GjPalette.GravityShine.copy(alpha = 0.55f),
                                topLeft      = Offset(inset, shiftPx + 6.dp.toPx()),
                                size         = Size(size.width - inset * 2f, glossH),
                                cornerRadius = CornerRadius(glossH * 50f),
                            )
                        }
                    } else {
                        // disabled: plain stone circle, no edge
                        drawRoundRect(GjPalette.Stone, cornerRadius = fullR)
                    }
                },
            contentAlignment = Alignment.TopCenter,
        ) {
            // icon container tracks the face (64dp), shifting with press
            Box(
                modifier         = Modifier.size(BTN_DP).offset(y = pressShift.dp),
                contentAlignment = Alignment.Center,
            ) {
                GjIcon(
                    icon               = GjIcons.RotateCw,
                    contentDescription = "Xoay trọng lực, còn $turnsLeft lượt",
                    modifier           = Modifier.size(30.dp).rotate(animSpin),
                    tint               = GjPalette.TextInvert,
                )
            }
        }

        // ── badge: turns remaining ───────────────────────────────────────────
        RotateBadge(
            count    = turnsLeft,
            off      = off,
            modifier = Modifier.align(Alignment.TopEnd),
        )
    }
}

// ── RotateBadge ───────────────────────────────────────────────────────────────

@Composable
private fun RotateBadge(count: Int, off: Boolean, modifier: Modifier = Modifier) {
    val borderColor = if (off) GjPalette.StoneEdge else GjPalette.Gravity
    val textColor   = if (off) GjPalette.TextMuted  else GjPalette.Gravity
    val badgeShape  = RoundedCornerShape(GjRadius.full)

    Box(
        modifier = modifier
            .defaultMinSize(minWidth = 24.dp)
            .height(24.dp)
            .shadow(
                elevation    = 2.dp,
                shape        = badgeShape,
                ambientColor = GjPalette.ShadowSoft,
                spotColor    = GjPalette.ShadowSoft,
            )
            .background(GjPalette.Surface, badgeShape)
            .border(2.dp, borderColor, badgeShape)
            .padding(horizontal = GjSpace.xs),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text  = count.toString(),
            style = MaterialTheme.typography.headlineMedium.copy(
                fontSize      = 14.sp,
                color         = textColor,
                fontWeight    = FontWeight.Bold,
                lineHeight    = 1.em,
                letterSpacing = 0.em,
            ),
        )
    }
}

// ── previews ──────────────────────────────────────────────────────────────────

@Preview(name = "GravityRotateButton — states", widthDp = 260, heightDp = 100)
@Composable
private fun GravityRotateButtonPreview() {
    GravityJellyTheme {
        androidx.compose.foundation.layout.Row(
            modifier              = Modifier
                .background(GjPalette.Bg)
                .padding(GjSpace.xl),
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(GjSpace.xl),
            verticalAlignment     = Alignment.CenterVertically,
        ) {
            // active, 3 turns left
            GravityRotateButton(turnsLeft = 3, onRotate = {})
            // active, 1 turn left
            GravityRotateButton(turnsLeft = 1, onRotate = {})
            // disabled (0 turns)
            GravityRotateButton(turnsLeft = 0, onRotate = {})
        }
    }
}
