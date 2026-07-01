package com.gravityjelly.app.ui.layout

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.tooling.preview.Preview
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme

// radial gradient: centre légèrement plus chaud → bords cream normal
// correspond au fond des écrans du design kit
private val BgCenter = androidx.compose.ui.graphics.Color(0xFFFFF0DC)  // cream chaud léger
private val BgEdge   = GjPalette.Bg                                      // #FFF7EC

// ── GjScreenScaffold ──────────────────────────────────────────────────────────

/**
 * Scaffold nền dùng chung mọi màn hình.
 *
 * - Nền cream `GjPalette.Bg` với radial gradient nhẹ tâm ấm → cạnh bình thường.
 * - Safe-area tự động (`WindowInsets.safeDrawing`) — hỗ trợ edge-to-edge Android 15+.
 * - Gutter ngang 16dp mặc định; tắt bằng `applyGutter = false` khi màn cần full-bleed.
 * - Không fix kích thước — co giãn mọi tỉ lệ màn hình, giữ tỉ lệ phần tử theo luới 4dp.
 *
 * [applyGutter]: true → padding horizontal 16dp (GjSpace.lg); false → toàn màn (canvas bàn, v.v.).
 * [contentAlignment]: canh lề nội dung bên trong Box; mặc định TopCenter.
 * [drawBackground]: true → vẽ nền gradient cream mặc định; false → để màn tự cấp nền
 *   (vd Home dùng ảnh raster full-bleed phía sau).
 */
@Composable
fun GjScreenScaffold(
    modifier: Modifier = Modifier,
    applyGutter: Boolean = true,
    contentAlignment: Alignment = Alignment.TopCenter,
    drawBackground: Boolean = true,
    content: @Composable BoxScope.() -> Unit,
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .then(
                if (drawBackground) Modifier.drawBehind {
                    // radial gradient — tâm warmest, cạnh cream bình thường
                    drawRect(
                        brush = Brush.radialGradient(
                            colors = listOf(BgCenter, BgEdge),
                            center = Offset(size.width / 2f, size.height * 0.38f),
                            radius = size.width * 0.85f,
                        ),
                    )
                } else Modifier
            )
            .windowInsetsPadding(WindowInsets.safeDrawing)
            .then(
                if (applyGutter) Modifier.padding(horizontal = GjSpace.lg)
                else Modifier
            ),
        contentAlignment = contentAlignment,
        content = content,
    )
}

// ── previews ──────────────────────────────────────────────────────────────────

@Preview(name = "Scaffold — rỗng 360×800",  widthDp = 360, heightDp = 800)
@Preview(name = "Scaffold — tablet 600×900", widthDp = 600, heightDp = 900)
@Composable
private fun ScaffoldEmptyPreview() {
    GravityJellyTheme {
        GjScreenScaffold {
            /* rỗng — kiểm nền gradient + safe area */
        }
    }
}

@Preview(name = "Scaffold — có nội dung", widthDp = 360, heightDp = 800)
@Composable
private fun ScaffoldContentPreview() {
    GravityJellyTheme {
        GjScreenScaffold(contentAlignment = Alignment.Center) {
            androidx.compose.foundation.layout.Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(GjSpace.md),
            ) {
                Text(
                    text  = "Gravity Jelly",
                    style = MaterialTheme.typography.displayLarge,
                    color = GjPalette.Text,
                )
                Text(
                    text  = "Nền + padding + safe area khớp thiết kế",
                    style = MaterialTheme.typography.bodyLarge,
                    color = GjPalette.TextMuted,
                )
                GjButton(
                    onClick  = {},
                    variant  = BtnVariant.Primary,
                    fullWidth = true,
                ) { Text("Bắt đầu") }
            }
        }
    }
}

@Preview(name = "Scaffold — full-bleed (applyGutter=false)", widthDp = 360, heightDp = 800)
@Composable
private fun ScaffoldFullBleedPreview() {
    GravityJellyTheme {
        GjScreenScaffold(applyGutter = false) {
            // Mô phỏng màn game: nội dung chạm sát cạnh ngang
            Box(
                modifier          = Modifier.fillMaxSize(),
                contentAlignment  = Alignment.Center,
            ) {
                Text(
                    text  = "full-bleed (bàn chơi, canvas)",
                    style = MaterialTheme.typography.bodyLarge,
                    color = GjPalette.TextMuted,
                )
            }
        }
    }
}
