package com.gravityjelly.app

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.guide.CandyCard
import com.gravityjelly.app.ui.guide.EntryCard
import com.gravityjelly.app.ui.guide.GjGuide
import com.gravityjelly.app.ui.guide.GjGuideEntry
import com.gravityjelly.app.ui.guide.GuideFilterTabs
import com.gravityjelly.app.ui.guide.GuideGroup
import com.gravityjelly.app.ui.guide.GuideTeachDialog
import com.gravityjelly.app.ui.guide.MascotBook
import com.gravityjelly.app.ui.guide.ProgressTrack
import com.gravityjelly.app.ui.guide.SectionHeaderPill
import com.gravityjelly.app.ui.guide.SpotlightCard
import com.gravityjelly.app.ui.guide.WideEntryCard
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme

/**
 * Màn **Cẩm nang** (Handbook) — RE-SKIN 02/07 bám `design/.../04-screens/cam-nang-screen.jsx`
 * (+ `cam-nang-illus.jsx`). Diện mạo mới: nền tranh kẹo full-bleed `cam_nang_bg.png`, **thẻ hero**
 * đầu trang (nút back tròn + tiêu đề + linh vật cầm sách + thanh tiến trình), **tab lọc** theo nhóm,
 * mục **NÊN XEM** ([SpotlightCard]) khi xem "Tất cả", rồi từng nhóm có **tiêu đề dạng viên** + lưới
 * thẻ 2-cột có thumbnail bàn thật; nhóm Hoàng gia mở đầu bằng **thẻ "Quan trọng"** to ngang.
 *
 * Mục **đã thu thập** (`id ∈ [seenGuides]`) bấm mở popup chi tiết ([GuideTeachDialog]); mục CHƯA mở khoá
 * hiện mờ + ổ khoá. Nguồn dữ liệu chung: [GjGuide.all] (13 luật, 4 nhóm — trùng ENTRIES của thiết kế).
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
    val seenSet = unlocked.map { it.id }.toSet() // demo: đã mở khoá = đã xem

    var filter by remember { mutableStateOf<GuideGroup?>(null) } // null = "Tất cả"
    val tabScroll = rememberScrollState()

    // Mục đang mở popup; [displayEntry] giữ nội dung trong lúc dialog chạy animation đóng.
    var openEntry by remember { mutableStateOf<GjGuideEntry?>(null) }
    var displayEntry by remember { mutableStateOf(all.first()) }
    LaunchedEffect(openEntry) { openEntry?.let { displayEntry = it } }

    // Mục NÊN XEM: ưu tiên "Xoay trọng lực" nếu đã mở, không thì mục mở khoá đầu tiên.
    val spotlight = unlocked.firstOrNull { it.id == "gravity-rotate" } ?: unlocked.firstOrNull()
    // Nhóm hiện theo tab đang chọn.
    val visibleGroups = (if (filter == null) GuideGroup.entries.toList() else listOf(filter!!))
        .map { g -> g to all.filter { it.group == g } }
        .filter { it.second.isNotEmpty() }

    Box(modifier.fillMaxSize().background(GjPalette.Bg)) {
        // Nền tranh kẹo full-bleed (821×1916) — cover, canh trên (bám background của screen JSX).
        Image(
            painter = painterResource(R.drawable.cam_nang_bg),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
            alignment = Alignment.TopCenter,
        )

        Box(Modifier.fillMaxSize().windowInsetsPadding(WindowInsets.safeDrawing)) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(start = 14.dp, end = 14.dp, top = 12.dp, bottom = 28.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                HeaderCard(count = unlocked.size, total = all.size, onBack = onBack)

                GuideFilterTabs(value = filter, onChange = { filter = it }, scrollState = tabScroll)

                if (filter == null && spotlight != null) {
                    SpotlightCard(entry = spotlight, onOpen = { openEntry = spotlight })
                }

                for ((group, list) in visibleGroups) {
                    Column {
                        SectionHeaderPill(group)
                        Spacer(Modifier.height(12.dp))

                        // Nhóm Hoàng gia: mở đầu bằng thẻ "Quan trọng" (Thạch Hoàng Gia) nếu đã mở khoá.
                        val heroId = if (group == GuideGroup.SUPER) "form-super1" else null
                        val hero = heroId?.let { id -> list.firstOrNull { it.id == id && isUnlocked(id) } }
                        if (hero != null) {
                            WideEntryCard(entry = hero, seen = hero.id in seenSet, onOpen = { openEntry = hero })
                            Spacer(Modifier.height(14.dp))
                        }
                        val rest = if (hero != null) list.filter { it.id != hero.id } else list
                        EntryGrid(rest, isUnlocked = { isUnlocked(it) }, seenSet = seenSet, onOpen = { openEntry = it })
                    }
                }
            }
        }

        // Popup chi tiết — GIỐNG in-game; trong Cẩm nang chỉ XEM 1 mục: nút "Đã hiểu" đóng luôn.
        // Đóng được bằng X / chạm scrim.
        GuideTeachDialog(
            entry = displayEntry,
            open = openEntry != null,
            dismissable = true,
            onClose = { openEntry = null },
            onDismiss = { openEntry = null },
        )
    }
}

// ── thẻ hero đầu trang: back + tiêu đề + linh vật + tiến trình ────────────────────
@Composable
private fun HeaderCard(count: Int, total: Int, onBack: () -> Unit) {
    val frac = if (total == 0) 0f else (count.toFloat() / total).coerceIn(0f, 1f)
    CandyCard(peel = 30.dp, modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(horizontal = 16.dp, vertical = 14.dp)) {
            Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                // nút back tròn
                Box(
                    Modifier
                        .padding(top = 2.dp)
                        .size(44.dp)
                        .clip(RoundedCornerShape(GjRadius.full))
                        .background(GjPalette.Surface)
                        .border(2.dp, GjPalette.CellLine, RoundedCornerShape(GjRadius.full))
                        .pointerInput(Unit) { detectTapGestures(onTap = { onBack() }) },
                    contentAlignment = Alignment.Center,
                ) {
                    GjIcon(GjIcons.Back, contentDescription = "Quay lại", modifier = Modifier.size(22.dp), tint = GjPalette.Text)
                }
                Column(Modifier.weight(1f)) {
                    Text(
                        "Cẩm nang",
                        style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.ExtraBold, fontSize = 26.sp, lineHeight = 27.sp),
                        color = GjPalette.Text,
                    )
                    Text(
                        "Mẹo nhỏ để phá màn khó",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, fontSize = 13.sp),
                        color = GjPalette.TextMuted,
                        modifier = Modifier.padding(top = 3.dp),
                    )
                }
                MascotBook(size = 56.dp)
            }
            // thanh tiến trình
            Row(
                modifier = Modifier
                    .padding(top = 12.dp)
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(GjRadius.full))
                    .background(GjPalette.SurfaceSunken)
                    .padding(horizontal = 10.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                Text(
                    "Đã mở $count/$total",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.ExtraBold, fontSize = 12.5.sp),
                    color = GjPalette.TextMuted,
                )
                Box(
                    Modifier
                        .weight(1f)
                        .height(12.dp)
                        .clip(RoundedCornerShape(GjRadius.full))
                        .background(ProgressTrack),
                ) {
                    Box(
                        Modifier
                            .fillMaxWidth(frac)
                            .fillMaxHeight()
                            .clip(RoundedCornerShape(GjRadius.full))
                            .background(Brush.verticalGradient(listOf(GjPalette.GravityShine, GjPalette.Gravity))),
                    )
                }
            }
        }
    }
}

// ── lưới thẻ 2-cột ────────────────────────────────────────────────────────────────
@Composable
private fun EntryGrid(
    list: List<GjGuideEntry>,
    isUnlocked: (String) -> Boolean,
    seenSet: Set<String>,
    onOpen: (GjGuideEntry) -> Unit,
) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        for (pair in list.chunked(2)) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                for (entry in pair) {
                    EntryCard(
                        entry = entry,
                        unlocked = isUnlocked(entry.id),
                        seen = entry.id in seenSet,
                        onOpen = { onOpen(entry) },
                        modifier = Modifier.weight(1f),
                    )
                }
                if (pair.size == 1) Spacer(Modifier.weight(1f))
            }
        }
    }
}

/** TẠM (review): mở khoá MỌI mục cẩm nang để soi popup không cần chơi. Đặt false để trả về thường. */
private const val UNLOCK_ALL_FOR_REVIEW = false

// ── preview ─────────────────────────────────────────────────────────────────────

@Preview(name = "Cẩm nang — diện mạo mới", widthDp = 360, heightDp = 800)
@Composable
private fun CamNangScreenPreview() {
    GravityJellyTheme {
        CamNangScreen(
            seenGuides = setOf("gravity-rotate", "clear-line", "gravity-drop", "sticky-cluster", "form-super1", "form-rainbow", "detonate-super1", "combo-refill"),
            onBack = {},
        )
    }
}
