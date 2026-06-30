package com.gravityjelly.app

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.guide.GjGuide
import com.gravityjelly.app.ui.guide.GjGuideEntry
import com.gravityjelly.app.ui.guide.GuideTeachDialog
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.layout.GjScreenScaffold
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme

/**
 * Màn **Cẩm nang** (tạm thay nút Daily): danh sách mọi mục hướng dẫn ([GjGuide.all]). Mục **đã thu
 * thập** (id ∈ [seenGuides] — gặp cơ chế lần đầu lúc chơi) hiện đầy đủ icon + tiêu đề và **bấm vào
 * mở đúng popup như in-game** ([GuideTeachDialog]); mục CHƯA mở khoá hiện mờ ("Chưa mở khoá") để
 * người chơi biết còn gì để khám phá. Bám pattern màn Cài đặt (header Back + thẻ Surface bo tròn).
 *
 * Daily thật chưa làm → khi có sẽ tách lại; cẩm nang giữ nguyên (nguồn chung [GjGuide.all]).
 */
@Composable
fun CamNangScreen(
    seenGuides: Set<String>,
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val entries = GjGuide.all
    val unlockedCount = entries.count { it.id in seenGuides }

    // Mục đang xem (mở popup). [displayEntry] giữ nội dung trong lúc dialog chạy animation đóng.
    var selected by remember { mutableStateOf<GjGuideEntry?>(null) }
    var displayEntry by remember { mutableStateOf(entries.first()) }
    LaunchedEffect(selected) { selected?.let { displayEntry = it } }

    Box(modifier.fillMaxSize()) {
        GjScreenScaffold(contentAlignment = Alignment.TopStart) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = GjSpace.sm, bottom = GjSpace.xl)
                    .verticalScroll(rememberScrollState()),
            ) {
                // ── header: Back + tiêu đề ──────────────────────────────────────────
                Row(
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(GjRadius.lg))
                            .pointerInput(Unit) { detectTapGestures(onTap = { onBack() }) },
                        contentAlignment = Alignment.Center,
                    ) {
                        GjIcon(GjIcons.Back, contentDescription = "Quay lại", tint = GjPalette.Text)
                    }
                    Text("Cẩm nang", style = MaterialTheme.typography.headlineLarge, color = GjPalette.Text)
                }

                // số đã thu thập
                Text(
                    "Đã mở $unlockedCount/${entries.size}",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.48.sp,
                    ),
                    color = GjPalette.TextMuted,
                    modifier = Modifier.padding(start = GjSpace.sm, top = GjSpace.xs, bottom = GjSpace.md),
                )

                // ── danh sách trong một thẻ Surface bo tròn ─────────────────────────
                Surface(
                    shape = RoundedCornerShape(GjRadius.lg),
                    color = GjPalette.Surface,
                    shadowElevation = 2.dp,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Column {
                        entries.forEachIndexed { i, entry ->
                            if (i > 0) RowDivider()
                            GuideListRow(
                                entry = entry,
                                unlocked = entry.id in seenGuides,
                                onClick = { selected = entry },
                            )
                        }
                    }
                }

                if (unlockedCount == 0) {
                    Spacer(Modifier.height(GjSpace.lg))
                    Text(
                        "Chơi và gặp các cơ chế lần đầu\nđể mở khoá cẩm nang!",
                        style = MaterialTheme.typography.bodyMedium,
                        color = GjPalette.TextMuted,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth().padding(GjSpace.md),
                    )
                }
            }
        }

        // Popup GIỐNG in-game (dismissable=false, nút "Đã hiểu"); chỉ mục đã mở khoá mới mở được.
        GuideTeachDialog(
            entry = displayEntry,
            open = selected != null,
            onDismiss = { selected = null },
        )
    }
}

/** Một hàng cẩm nang: icon chip + tiêu đề + chevron (đã mở) / "Chưa mở khoá" mờ (chưa mở). */
@Composable
private fun GuideListRow(
    entry: GjGuideEntry,
    unlocked: Boolean,
    onClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 60.dp)
            .then(
                if (unlocked) Modifier.pointerInput(entry.id) { detectTapGestures(onTap = { onClick() }) }
                else Modifier,
            )
            .padding(horizontal = GjSpace.lg, vertical = GjSpace.sm),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
    ) {
        // icon chip 40dp (mờ khi chưa mở khoá)
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(RoundedCornerShape(GjRadius.md))
                .background(GjPalette.SurfaceSunken)
                .alpha(if (unlocked) 1f else 0.45f),
            contentAlignment = Alignment.Center,
        ) {
            GjIcon(
                entry.icon,
                modifier = Modifier.size(22.dp),
                tint = if (unlocked) GjPalette.Primary else GjPalette.TextMuted,
            )
        }
        Text(
            text = if (unlocked) entry.title else "Chưa mở khoá",
            style = MaterialTheme.typography.bodyLarge,
            color = if (unlocked) GjPalette.Text else GjPalette.TextMuted,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.weight(1f),
        )
        if (unlocked) {
            GjIcon(GjIcons.Chevron, modifier = Modifier.size(20.dp), tint = GjPalette.TextMuted)
        }
    }
}

/** Đường kẻ ngăn hàng (canh sau icon chip cho thẳng tiêu đề). */
@Composable
private fun RowDivider() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 72.dp)
            .height(1.5.dp)
            .background(GjPalette.CellLine),
    )
}

// ── preview ─────────────────────────────────────────────────────────────────────

@Preview(name = "Cẩm nang — vài mục đã mở", widthDp = 360, heightDp = 800)
@Composable
private fun CamNangScreenPreview() {
    GravityJellyTheme {
        CamNangScreen(
            seenGuides = setOf("clear-row", "clear-column", "form-super1", "combo-refill"),
            onBack = {},
        )
    }
}
