package com.gravityjelly.app.ui.guide

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme

/**
 * Phần thân của một [GjGuideEntry]: minh hoạ (nếu có) + mô tả bằng chữ.
 *
 * Component CHUNG — dùng làm `content` của [com.gravityjelly.app.ui.components.GjDialog]
 * trong popup dạy-lần-đầu, VÀ tái dùng cho từng dòng ở trang "Hướng dẫn" tương lai
 * (lặp [GjGuide.all]). Tiêu đề/icon do nơi gọi tự lo (dialog đã có sẵn slot tiêu đề).
 */
@Composable
fun GuideCardContent(
    entry: GjGuideEntry,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier            = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(GjSpace.lg),
    ) {
        entry.demo?.let { demo ->
            Box(
                modifier         = Modifier.fillMaxWidth().padding(vertical = GjSpace.xs),
                contentAlignment = Alignment.Center,
            ) {
                demo()
            }
        }

        // Body dùng font Display (Baloo) như tiêu đề + "+1" để đồng nhất; màu Text đậm (không mờ),
        // base SemiBold 600 → highlight ExtraBold 800 (trong AnnotatedString) chênh rõ, cùng một font.
        Text(
            text      = entry.body,
            style     = MaterialTheme.typography.headlineMedium.copy(
                color      = GjPalette.Text,
                fontWeight = FontWeight.SemiBold,
                fontSize   = 17.sp,
                lineHeight = 24.sp,
            ),
            textAlign = TextAlign.Center,
        )
    }
}

// ── preview ───────────────────────────────────────────────────────────────────

@Preview(name = "GuideCardContent — combo refill", widthDp = 312)
@Composable
private fun GuideCardContentPreview() {
    GravityJellyTheme {
        Box(Modifier.padding(GjSpace.xl)) {
            GuideCardContent(GjGuide.comboRefill)
        }
    }
}
