package com.gravityjelly.app

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
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
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.guide.GjGuide
import com.gravityjelly.app.ui.guide.GjGuideEntry
import com.gravityjelly.app.ui.guide.GuideGroup
import com.gravityjelly.app.ui.guide.GuideTeachDialog
import com.gravityjelly.app.ui.guide.tint
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.layout.GjScreenScaffold
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme

/**
 * Màn **Cẩm nang** (Handbook) — bám `design/.../04-screens/cam-nang-screen.jsx`.
 *
 * Danh sách luật chơi gom 4 nhóm ([GuideGroup]); mỗi mục = icon-chip (tint theo nhóm) + tiêu đề +
 * mô tả MỘT dòng. Mục **đã thu thập** (`id ∈ [seenGuides]` — gặp cơ chế lần đầu lúc chơi) bấm vào
 * mở popup chi tiết ([GuideTeachDialog], minh hoạ hình thật + nút "Đã hiểu"/"Tiếp theo" sang mục kế
 * trong cẩm nang). Mục CHƯA mở khoá hiện mờ + ổ khoá. Header có chỉ-số tiến trình.
 *
 * Daily thật chưa làm → tạm thay bằng Cẩm nang; nguồn chung [GjGuide.all].
 */
@Composable
fun CamNangScreen(
    seenGuides: Set<String>,
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val all = GjGuide.all
    // TẠM: mở khoá toàn bộ để soi nội dung từng popup mà không phải chơi tới (đổi về false khi xong).
    fun isUnlocked(id: String) = UNLOCK_ALL_FOR_REVIEW || id in seenGuides
    val unlocked = all.filter { isUnlocked(it.id) }

    // Mục đang mở popup; [displayEntry] giữ nội dung trong lúc dialog chạy animation đóng.
    var openEntry by remember { mutableStateOf<GjGuideEntry?>(null) }
    var displayEntry by remember { mutableStateOf(all.first()) }
    LaunchedEffect(openEntry) { openEntry?.let { displayEntry = it } }

    Box(modifier.fillMaxSize()) {
        GjScreenScaffold(contentAlignment = Alignment.TopStart) {
            Column(modifier = Modifier.fillMaxWidth()) {
                // ── header: back + tiêu đề + tiến trình ─────────────────────────────
                Row(
                    modifier = Modifier.fillMaxWidth().height(56.dp).padding(top = GjSpace.sm),
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
                    Text(
                        "Cẩm nang",
                        style = MaterialTheme.typography.headlineLarge,
                        color = GjPalette.Text,
                        modifier = Modifier.weight(1f),
                    )
                    ProgressPill(count = unlocked.size, total = all.size)
                }

                // ── danh sách cuộn, gom theo nhóm ───────────────────────────────────
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState())
                        .padding(top = GjSpace.sm, bottom = GjSpace.xl),
                ) {
                    for (group in GuideGroup.entries) {
                        val items = all.filter { it.group == group }
                        if (items.isEmpty()) continue
                        GroupBlock(group) {
                            items.forEachIndexed { i, entry ->
                                if (i > 0) RowDivider()
                                ItemRow(
                                    entry = entry,
                                    unlocked = isUnlocked(entry.id),
                                    onOpen = { openEntry = entry },
                                )
                            }
                        }
                    }
                }
            }
        }

        // Popup chi tiết — GIỐNG in-game; trong Cẩm nang chỉ XEM 1 mục: nút "Đã hiểu" đóng luôn
        // (KHÔNG duyệt "Tiếp theo" — nút đó chỉ dành cho in-game khi một nước mở nhiều cơ chế).
        // Đóng được bằng X / chạm scrim.
        GuideTeachDialog(
            entry       = displayEntry,
            open        = openEntry != null,
            dismissable = true,
            onClose     = { openEntry = null },
            onDismiss   = { openEntry = null },
        )
    }
}

// ── tiến trình ở header: thanh nhỏ + "Đã mở X/N" ────────────────────────────────
@Composable
private fun ProgressPill(count: Int, total: Int) {
    val frac = if (total == 0) 0f else (count.toFloat() / total).coerceIn(0f, 1f)
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(GjRadius.full))
            .background(GjPalette.SurfaceSunken)
            .padding(start = 10.dp, end = GjSpace.md, top = 6.dp, bottom = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
    ) {
        Box(
            Modifier
                .width(40.dp)
                .height(6.dp)
                .clip(RoundedCornerShape(GjRadius.full))
                .background(ProgressTrack),
        ) {
            Box(
                Modifier
                    .fillMaxWidth(frac)
                    .height(6.dp)
                    .clip(RoundedCornerShape(GjRadius.full))
                    .background(GjPalette.Gravity),
            )
        }
        Text(
            "Đã mở $count/$total",
            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.ExtraBold, fontSize = 12.sp),
            color = GjPalette.Gravity,
        )
    }
}

// ── nhóm: chấm màu + nhãn small-caps, rồi thẻ Surface chứa các hàng ──────────────
@Composable
private fun GroupBlock(group: GuideGroup, content: @Composable () -> Unit) {
    Column(modifier = Modifier.padding(bottom = GjSpace.lg)) {
        Row(
            modifier = Modifier.padding(start = GjSpace.sm, bottom = GjSpace.sm),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
        ) {
            Box(Modifier.size(8.dp).clip(RoundedCornerShape(2.dp)).background(group.tint.copy(alpha = 0.9f)))
            Text(
                group.label,
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, letterSpacing = 0.48.sp),
                color = GjPalette.TextMuted,
            )
        }
        Surface(
            shape = RoundedCornerShape(GjRadius.lg),
            color = GjPalette.Surface,
            shadowElevation = 2.dp,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Column { content() }
        }
    }
}

// ── một hàng cẩm nang: icon-chip + (tiêu đề / mô tả) + chevron; hoặc khoá ────────
@Composable
private fun ItemRow(entry: GjGuideEntry, unlocked: Boolean, onOpen: () -> Unit) {
    if (!unlocked) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 56.dp)
                .alpha(0.45f)
                .padding(horizontal = GjSpace.lg, vertical = GjSpace.sm),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
        ) {
            Box(
                modifier = Modifier.size(36.dp).clip(RoundedCornerShape(GjRadius.md)).background(GjPalette.SurfaceSunken),
                contentAlignment = Alignment.Center,
            ) { LockGlyph(19.dp, GjPalette.TextMuted) }
            Text(
                "Chưa mở khoá",
                style = MaterialTheme.typography.bodyLarge,
                color = GjPalette.TextMuted,
                fontWeight = FontWeight.Bold,
            )
        }
        return
    }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 64.dp)
            .pointerInput(entry.id) { detectTapGestures(onTap = { onOpen() }) }
            .padding(horizontal = GjSpace.lg, vertical = GjSpace.sm),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
    ) {
        Box(
            modifier = Modifier.size(36.dp).clip(RoundedCornerShape(GjRadius.md)).background(GjPalette.SurfaceSunken),
            contentAlignment = Alignment.Center,
        ) {
            GjIcon(entry.icon, modifier = Modifier.size(20.dp), tint = entry.group.tint)
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(
                entry.title,
                style = MaterialTheme.typography.bodyLarge,
                color = GjPalette.Text,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                entry.desc,
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold, fontSize = 12.sp, lineHeight = 16.sp),
                color = GjPalette.TextMuted,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(top = 2.dp),
            )
        }
        GjIcon(GjIcons.Chevron, modifier = Modifier.size(20.dp), tint = GjPalette.TextMuted)
    }
}

/** Ổ khoá nhỏ (bám LockGlyph SVG của thiết kế): thân bo + quai + lỗ khoá. */
@Composable
private fun LockGlyph(size: Dp, tint: Color) {
    Canvas(Modifier.size(size)) {
        val s = this.size.minDimension / 24f
        val stroke = Stroke(width = 2f * s, cap = StrokeCap.Round, join = StrokeJoin.Round)
        drawRoundRect(
            tint,
            topLeft = Offset(4.5f * s, 10.5f * s),
            size = Size(15f * s, 10f * s),
            cornerRadius = CornerRadius(3f * s),
            style = stroke,
        )
        drawLine(tint, Offset(8f * s, 10.5f * s), Offset(8f * s, 7f * s), 2f * s, cap = StrokeCap.Round)
        drawLine(tint, Offset(16f * s, 10.5f * s), Offset(16f * s, 7f * s), 2f * s, cap = StrokeCap.Round)
        drawArc(
            tint, startAngle = 180f, sweepAngle = 180f, useCenter = false,
            topLeft = Offset(8f * s, 3f * s), size = Size(8f * s, 8f * s), style = stroke,
        )
        drawCircle(tint, radius = 1.5f * s, center = Offset(12f * s, 15f * s))
    }
}

/** Đường kẻ ngăn hàng (canh sau icon-chip cho thẳng tiêu đề). */
@Composable
private fun RowDivider() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 64.dp)
            .height(1.5.dp)
            .background(GjPalette.CellLine),
    )
}

private val ProgressTrack = Color(0xFFE6D7BE)

/** TẠM (review): mở khoá MỌI mục cẩm nang để soi popup không cần chơi. Đặt false để trả về thường. */
private const val UNLOCK_ALL_FOR_REVIEW = false

// ── preview ─────────────────────────────────────────────────────────────────────

@Preview(name = "Cẩm nang — nhóm + tiến trình", widthDp = 360, heightDp = 800)
@Composable
private fun CamNangScreenPreview() {
    GravityJellyTheme {
        CamNangScreen(
            seenGuides = setOf("gravity-rotate", "clear-line", "gravity-drop", "sticky-cluster", "form-super1", "combo-refill"),
            onBack = {},
        )
    }
}
