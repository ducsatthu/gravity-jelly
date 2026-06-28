package com.gravityjelly.app.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.gravityjelly.app.ui.theme.GjBorder
import com.gravityjelly.app.ui.theme.GjDimens
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PieceLibrary
import com.gravityjelly.game.GjEase
import com.gravityjelly.game.PieceThumbnail
import com.gravityjelly.game.TRAY_GAP_FRAC

// ── motion tokens (chung từ :game GjEase) ──────────────────────────────────────

private val EaseJelly = GjEase.jelly
private val EaseOut   = GjEase.out

// ── shared cell size (mirrors JSX sharedCellSize: fit=80dp, gap=2dp, 12–22dp) ─

private fun List<Piece?>.sharedCellDp(): Float {
    var maxDim = 1
    for (p in this) {
        if (p == null) continue
        maxDim = maxOf(maxDim, p.shape.width, p.shape.height)
    }
    return ((80f - (maxDim - 1) * 2f) / maxDim).coerceIn(12f, 22f)
}

// ── GjTray ────────────────────────────────────────────────────────────────────

/**
 * Khay 3 mảnh 112dp dưới cùng màn chơi.
 *
 * Tất cả slot dùng chung **một cell size** (piece lớn nhất quyết định, kẹp 12–22dp)
 * để bộ đồ không lẫn lộn tỉ lệ. Slot chọn nâng lên 6dp + ring tím.
 *
 * [pieces]: đúng 3 phần tử; null = ô đã đặt hết.
 * [selectedIndex]: -1 = không chọn; ô null không thể được chọn.
 */
@Composable
fun GjTray(
    pieces: List<Piece?>,
    selectedIndex: Int = -1,
    onSelect: (Int) -> Unit = {},
    modifier: Modifier = Modifier,
    slotModifier: (Int) -> Modifier = { Modifier },
) {
    val trayShape = RoundedCornerShape(topStart = GjRadius.xxl, topEnd = GjRadius.xxl)
    val cellDp    = remember(pieces) { pieces.sharedCellDp() }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(GjDimens.trayHeight)
            .drawBehind {
                // Bóng đổ mềm HƯỚNG LÊN ở mép trên (design Tray.jsx: box-shadow 0 -6px 18px
                // shadow-soft) → dock "nổi" trên vùng chơi. Compose .shadow() chỉ đổ xuống
                // (mất hút ở đáy màn), nên dùng shadow-layer của native paint: vẽ shape trong
                // suốt, chỉ lấy phần bóng hắt lên. Tray redraw hiếm nên cấp phát Paint ở đây OK.
                val cornerPx    = GjRadius.xxl.toPx()
                val shadowPaint = android.graphics.Paint().apply {
                    isAntiAlias = true
                    color       = android.graphics.Color.TRANSPARENT
                    setShadowLayer(18.dp.toPx(), 0f, -6.dp.toPx(), GjPalette.ShadowSoft.toArgb())
                }
                drawIntoCanvas { canvas ->
                    canvas.nativeCanvas.drawRoundRect(
                        0f, 0f, size.width, size.height, cornerPx, cornerPx, shadowPaint,
                    )
                }
            }
            .background(GjPalette.Surface, trayShape)
            .padding(top = GjSpace.sm, start = GjSpace.md, end = GjSpace.md),
    ) {
        Row(
            modifier              = Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment     = Alignment.CenterVertically,
        ) {
            for (i in 0 until 3) {
                val piece    = pieces.getOrNull(i)
                val selected = selectedIndex == i && piece != null
                TraySlot(
                    piece    = piece,
                    selected = selected,
                    cellDp   = cellDp,
                    onClick  = { if (piece != null) onSelect(i) },
                    extra    = slotModifier(i),
                )
            }
        }
    }
}

// ── TraySlot ──────────────────────────────────────────────────────────────────

@Composable
private fun TraySlot(
    piece: Piece?,
    selected: Boolean,
    cellDp: Float,
    onClick: () -> Unit,
    extra: Modifier = Modifier,
) {
    val density = LocalDensity.current.density

    // lift: 0dp → 6dp; ease-jelly (bouncy) 250ms
    val liftDp by animateFloatAsState(
        targetValue   = if (selected) 6f else 0f,
        animationSpec = tween(durationMillis = 250, easing = EaseJelly),
        label         = "tray_lift",
    )
    // ring alpha: 0 → 1; ease-out 150ms
    val ringAlpha by animateFloatAsState(
        targetValue   = if (selected) 1f else 0f,
        animationSpec = tween(durationMillis = 150, easing = EaseOut),
        label         = "tray_ring",
    )

    Box(
        modifier = Modifier
            .size(GjDimens.traySlot)
            .then(extra)                                // gắn kéo-thả (live game) nếu có
            .alpha(if (piece == null) 0.35f else 1f)   // empty = 35% opacity
            .offset(y = (-liftDp).dp)
            .drawBehind {
                val cornerPx = GjRadius.lg.value * density
                val ringWPx  = GjBorder.bold.value * density

                // selected background
                if (ringAlpha > 0f || liftDp > 0f) {
                    drawRoundRect(GjPalette.SurfaceSunken, cornerRadius = CornerRadius(cornerPx))
                }

                // inset primary ring: CSS `inset 0 0 0 4px primary`
                if (ringAlpha > 0f) {
                    drawRoundRect(
                        color        = GjPalette.Primary.copy(alpha = ringAlpha),
                        topLeft      = Offset(ringWPx / 2f, ringWPx / 2f),
                        size         = Size(size.width - ringWPx, size.height - ringWPx),
                        cornerRadius = CornerRadius((cornerPx - ringWPx / 2f).coerceAtLeast(0f)),
                        style        = Stroke(ringWPx),
                    )

                    // dấu tam giác chỉ XUỐNG phía trên ô (design Tray.jsx selection marker:
                    // borderTop 8px solid primary, top:-11, nằm NGOÀI mép dock nên không bị bo che).
                    val cxp   = size.width / 2f
                    val topY  = -11.dp.toPx()
                    val halfW = 6.dp.toPx()
                    val triH  = 8.dp.toPx()
                    val tri = Path().apply {
                        moveTo(cxp - halfW, topY)
                        lineTo(cxp + halfW, topY)
                        lineTo(cxp, topY + triH)
                        close()
                    }
                    drawPath(tri, GjPalette.Primary.copy(alpha = ringAlpha))
                }
            }
            .clickable(
                enabled           = piece != null,
                onClick           = onClick,
                interactionSource = remember { MutableInteractionSource() },
                indication        = null,
            ),
        contentAlignment = Alignment.Center,
    ) {
        if (piece != null) {
            PieceThumbnail(
                piece    = piece,
                cellDp   = cellDp,
                gapFrac  = TRAY_GAP_FRAC,   // khe rộng hơn giữa các ô (design Tray.jsx ~2dp)
                modifier = Modifier
                    .size(GjDimens.traySlot)
                    .padding(GjSpace.sm),
            )
        } else {
            EmptySlotHole()
        }
    }
}

// ── EmptySlotHole ─────────────────────────────────────────────────────────────

@Composable
private fun EmptySlotHole() {
    val density    = LocalDensity.current.density
    val dashPx     = 4f * density
    val dashEffect = remember(density) {
        PathEffect.dashPathEffect(floatArrayOf(dashPx, dashPx))
    }
    Box(
        modifier = Modifier
            .size(52.dp)
            .drawBehind {
                drawRoundRect(
                    color        = GjPalette.CellLine,
                    cornerRadius = CornerRadius(GjRadius.md.value * density),
                    style        = Stroke(
                        width       = 2.dp.toPx(),
                        pathEffect  = dashEffect,
                    ),
                )
            },
    )
}

// ── previews ──────────────────────────────────────────────────────────────────

private val previewPieces = listOf(
    Piece(PieceLibrary.L3_0, JellyColor.MINT),
    Piece(PieceLibrary.I3H,  JellyColor.PINK),
    Piece(PieceLibrary.O4,   JellyColor.BLUE),
)

@Preview(name = "Tray — slot 0 chọn", widthDp = 380, heightDp = 130)
@Composable
private fun GjTrayPreviewSelected() {
    GravityJellyTheme {
        Box(Modifier.background(GjPalette.Bg)) {
            GjTray(
                pieces        = previewPieces,
                selectedIndex = 0,
                modifier      = Modifier.align(Alignment.BottomCenter),
            )
        }
    }
}

@Preview(name = "Tray — không chọn", widthDp = 380, heightDp = 130)
@Composable
private fun GjTrayPreviewNone() {
    GravityJellyTheme {
        Box(Modifier.background(GjPalette.Bg)) {
            GjTray(
                pieces        = previewPieces,
                selectedIndex = -1,
                modifier      = Modifier.align(Alignment.BottomCenter),
            )
        }
    }
}

@Preview(name = "Tray — có ô trống", widthDp = 380, heightDp = 130)
@Composable
private fun GjTrayPreviewEmpty() {
    GravityJellyTheme {
        Box(Modifier.background(GjPalette.Bg)) {
            GjTray(
                pieces        = listOf(Piece(PieceLibrary.I5H, JellyColor.YELLOW), null, null),
                selectedIndex = 0,
                modifier      = Modifier.align(Alignment.BottomCenter),
            )
        }
    }
}

@Preview(name = "Tray — mảnh to (3×3 chiếm slot 1)", widthDp = 380, heightDp = 130)
@Composable
private fun GjTrayPreviewLarge() {
    GravityJellyTheme {
        Box(Modifier.background(GjPalette.Bg)) {
            GjTray(
                pieces        = listOf(
                    Piece(PieceLibrary.I4H,  JellyColor.MINT),
                    Piece(PieceLibrary.PLUS, JellyColor.PINK),
                    Piece(PieceLibrary.I2V,  JellyColor.YELLOW),
                ),
                selectedIndex = 1,
                modifier      = Modifier.align(Alignment.BottomCenter),
            )
        }
    }
}
