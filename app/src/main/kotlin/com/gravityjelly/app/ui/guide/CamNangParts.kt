package com.gravityjelly.app.ui.guide

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.R
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PieceLibrary
import com.gravityjelly.game.GuideCell
import com.gravityjelly.game.GuideMiniBoard
import com.gravityjelly.game.LivingJellyThumbnail
import com.gravityjelly.game.gEmpty
import com.gravityjelly.game.gJelly
import com.gravityjelly.game.gRainbow
import com.gravityjelly.game.gRainbow2
import com.gravityjelly.game.gStone
import com.gravityjelly.game.gSuper1
import com.gravityjelly.game.gSuper2
import com.gravityjelly.game.gTrash
import com.gravityjelly.game.gVine
import com.gravityjelly.game.gVineRoot
import com.gravityjelly.game.gWaterSource
import com.gravityjelly.game.gWaterFlow
import com.gravityjelly.game.gWaterBroken
import com.gravityjelly.core.Direction

/**
 * Khối dựng cho màn **Cẩm nang** — bám `design/.../04-screens/cam-nang-screen.jsx` (+ `cam-nang-illus.jsx`).
 *
 * Gồm: thẻ kẹo có góc gập ([CandyCard] + [Peel]), tem tròn ([Seal]), nhãn "Đã xem" ([SeenTag]),
 * linh vật cầm sách ([MascotBook]), tab lọc ([GuideFilterTabs]), tiêu đề nhóm dạng viên ([SectionHeaderPill]),
 * thumbnail bàn/khối cho từng luật ([GuideThumb]), thẻ "NÊN XEM" ([SpotlightCard]), thẻ "Quan trọng"
 * to ngang ([WideEntryCard]) và thẻ 2-cột ([EntryCard]).
 *
 * KHÔNG tự chế hình khối: thumbnail tái dùng [GuideMiniBoard] (:game) vẽ khối jelly thật; linh vật +
 * jelly tab dùng [LivingJellyThumbnail]. Mọi màu/spacing/radius lấy từ token DS (skill design-fidelity).
 */

// ── token cục bộ khớp thiết kế ───────────────────────────────────────────────────
/** Viền kem ấm mỏng của thẻ: `rgba(150,120,80,0.16)`. */
internal val CardBorder = Color(0x29967850)
/** Nền rãnh tiến trình header: `#E6D7BE`. */
internal val ProgressTrack = Color(0xFFE6D7BE)

/** Hình khối thẻ kẹo: bo 20dp ba góc, góc trên-phải VUÔNG để [Peel] (góc gập) nằm khít (bám cardStyle). */
internal val CandyCardShape = RoundedCornerShape(
    topStart = GjRadius.lg, topEnd = 0.dp, bottomEnd = GjRadius.lg, bottomStart = GjRadius.lg,
)

/** Nhãn hiển thị title-case cho tiêu đề nhóm / tab (giữ chủ đề "Hoàng gia" của app, viết mềm hơn). */
internal val GuideGroup.displayLabel: String
    @Composable get() = when (this) {
        GuideGroup.BASIC -> stringResource(R.string.camnangparts_group_basic)
        GuideGroup.SUPER -> stringResource(R.string.camnangparts_group_super)
        GuideGroup.BLAST -> stringResource(R.string.camnangparts_group_blast)
        GuideGroup.COMBO -> stringResource(R.string.camnangparts_group_combo)
        GuideGroup.FOREST -> stringResource(R.string.camnangparts_group_forest)
        GuideGroup.RIVER -> stringResource(R.string.camnangparts_group_river)
    }

/** Màu KHỐI jelly đại diện nhóm ở tab + tiêu đề nhóm (bám GROUP_JELLY của thiết kế). */
internal val GuideGroup.jelly: JellyColor
    get() = when (this) {
        GuideGroup.BASIC -> JellyColor.MINT
        GuideGroup.SUPER -> JellyColor.YELLOW
        GuideGroup.BLAST -> JellyColor.PINK
        GuideGroup.COMBO -> JellyColor.BLUE
        GuideGroup.FOREST -> JellyColor.MINT
        GuideGroup.RIVER -> JellyColor.BLUE
    }

// ── shorthand dựng lưới thumbnail (file-private, không đụng GjGuideDemos) ─────────
private val e = gEmpty
private val st = gStone
private val rb = gRainbow
private val rb2 = gRainbow2
private fun j(c: JellyColor) = gJelly(c)
private fun s1(c: JellyColor) = gSuper1(c)
private fun s2(c: JellyColor) = gSuper2(c)
private val Y = JellyColor.YELLOW
private val M = JellyColor.MINT
private val P = JellyColor.PINK
private val B = JellyColor.BLUE
private val vr = gVineRoot
private val vi = gVine
private val tr = gTrash
private val ws = gWaterSource(Direction.DOWN)   // nguồn nước (chảy xuống)
private val wf = gWaterFlow(Direction.DOWN)      // ô dòng chảy
private val wx = gWaterBroken                     // nguồn khô

// ── Peel: góc giấy gập ở trên-phải thẻ ───────────────────────────────────────────
/**
 * Góc giấy gập (dog-ear) ở trên-phải — mặt sau trang giấy nhấc lên khỏi thẻ, có vệt gấp sáng chạy
 * theo đường chéo (bám hàm `Peel` của thiết kế, đơn giản hoá bằng một tam giác + vệt sáng).
 */
@Composable
internal fun BoxScope.Peel(size: Dp = 30.dp) {
    Canvas(Modifier.align(Alignment.TopEnd).size(size)) {
        val s = size.toPx()
        val flap = Path().apply { moveTo(0f, 0f); lineTo(s, 0f); lineTo(s, s); close() }
        drawPath(
            flap,
            brush = Brush.linearGradient(
                colors = listOf(Color(0xFFD6BC90), Color(0xFFE7D2AE), Color(0xFFF2E1C0)),
                start = Offset(s, 0f), end = Offset(0f, s),
            ),
        )
        // vệt gấp sáng theo đường chéo (top-left → bottom-right)
        drawLine(Color(0xD9FFFFFF), Offset(0f, 0f), Offset(s, s), strokeWidth = 2f * density)
    }
}

// ── CandyCard: nền trắng + bóng mềm + viền ấm + góc gập ──────────────────────────
/** Thẻ kẹo nền trắng dùng chung (spotlight / wide / entry). [onClick] != null → bấm được. */
@Composable
internal fun CandyCard(
    modifier: Modifier = Modifier,
    peel: Dp = 30.dp,
    onClick: (() -> Unit)? = null,
    content: @Composable BoxScope.() -> Unit,
) {
    Box(
        modifier
            .shadow(6.dp, CandyCardShape, clip = false)
            .clip(CandyCardShape)
            .background(GjPalette.Surface)
            .border(1.5.dp, CardBorder, CandyCardShape)
            .then(
                if (onClick != null) Modifier.pointerInput(onClick) { detectTapGestures(onTap = { onClick() }) }
                else Modifier,
            ),
    ) {
        content()
        Peel(peel)
    }
}

// ── Seal: tem tròn "Mới" / "Quan trọng" ──────────────────────────────────────────
@Composable
internal fun Seal(text: String, tone: Color = GjPalette.Warning, modifier: Modifier = Modifier) {
    Box(
        modifier
            .clip(RoundedCornerShape(GjRadius.full))
            .background(tone)
            .border(2.dp, Color(0xB3FFFFFF), RoundedCornerShape(GjRadius.full))
            .padding(horizontal = 12.dp, vertical = 6.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text,
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Bold, fontSize = 12.sp, lineHeight = 13.sp,
            ),
            color = GjPalette.TextOnBlock,
            textAlign = TextAlign.Center,
        )
    }
}

// ── SeenTag: "Đã xem" + chấm tích xanh ───────────────────────────────────────────
@Composable
internal fun SeenTag() {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(5.dp)) {
        Text(
            stringResource(R.string.camnangparts_seen),
            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.ExtraBold, fontSize = 12.sp),
            color = GjPalette.TextMuted,
        )
        Box(Modifier.size(18.dp).clip(RoundedCornerShape(GjRadius.full)).background(GjPalette.Success), contentAlignment = Alignment.Center) {
            GjIcon(GjIcons.Check, modifier = Modifier.size(12.dp), tint = GjPalette.TextInvert)
        }
    }
}

// ── MascotBook: jelly hồng "sống" cầm quyển sách kẹo ─────────────────────────────
/**
 * Linh vật header: khối jelly hồng dùng [LivingJellyThumbnail] (chớp/nháy/liếc như logo Home) + quyển
 * sách kẹo vàng nhỏ nghiêng. Thiết kế vẽ mặt "happy" tĩnh — bản game chưa có expression happy tĩnh nên
 * dùng jelly-sống (đúng bộ hiệu ứng mắt của DS) cho có hồn.
 */
@Composable
internal fun MascotBook(size: Dp = 56.dp) {
    Box(Modifier.size(size)) {
        LivingJellyThumbnail(
            piece = Piece(PieceLibrary.DOT, JellyColor.PINK),
            seed = 7,
            modifier = Modifier.fillMaxSize(),
            cellDp = size.value * 0.92f,
        )
        Box(
            Modifier
                .align(Alignment.BottomEnd)
                .offset(x = 6.dp, y = (-2).dp)
                .size(width = size * 0.5f, height = size * 0.4f)
                .rotate(-8f)
                .clip(RoundedCornerShape(6.dp))
                .background(GjPalette.BlockYellow)
                .border(2.dp, GjPalette.BlockYellowEdge, RoundedCornerShape(6.dp)),
            contentAlignment = Alignment.Center,
        ) {
            GjIcon(GjIcons.Star, modifier = Modifier.size(size * 0.2f), tint = GjPalette.Warning)
        }
    }
}

// ── GuideFilterTabs: Tất cả · Cơ bản · Hoàng gia · Giải phóng · Mẹo ──────────────
@Composable
internal fun GuideFilterTabs(
    value: GuideGroup?,
    onChange: (GuideGroup?) -> Unit,
    scrollState: androidx.compose.foundation.ScrollState,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(scrollState)
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
    ) {
        TabChip(label = stringResource(R.string.camnangparts_all), jelly = JellyColor.YELLOW, active = value == null, onClick = { onChange(null) })
        for (g in GuideGroup.entries) {
            TabChip(label = g.displayLabel, jelly = g.jelly, active = value == g, onClick = { onChange(g) })
        }
    }
}

@Composable
private fun TabChip(label: String, jelly: JellyColor, active: Boolean, onClick: () -> Unit) {
    val shape = RoundedCornerShape(GjRadius.full)
    Row(
        modifier = Modifier
            .then(if (active) Modifier.shadow(3.dp, shape, clip = false) else Modifier)
            .clip(shape)
            .background(if (active) GjPalette.Primary else GjPalette.Surface)
            .then(if (active) Modifier else Modifier.border(2.dp, GjPalette.CellLine, shape))
            .pointerInput(onClick) { detectTapGestures(onTap = { onClick() }) }
            .padding(start = 8.dp, end = 14.dp, top = 7.dp, bottom = 7.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(7.dp),
    ) {
        LivingJellyThumbnail(
            piece = Piece(PieceLibrary.DOT, jelly),
            seed = label.hashCode(),
            modifier = Modifier.size(24.dp),
            cellDp = 22f,
        )
        Text(
            label,
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, fontSize = 14.sp),
            color = if (active) GjPalette.TextInvert else GjPalette.Text,
        )
    }
}

// ── SectionHeaderPill: viên jelly + nhãn nhóm ────────────────────────────────────
@Composable
internal fun SectionHeaderPill(group: GuideGroup) {
    Row(
        modifier = Modifier
            .shadow(2.dp, RoundedCornerShape(GjRadius.full), clip = false)
            .clip(RoundedCornerShape(GjRadius.full))
            .background(GjPalette.Surface)
            .padding(start = 8.dp, end = 16.dp, top = 6.dp, bottom = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(9.dp),
    ) {
        LivingJellyThumbnail(
            piece = Piece(PieceLibrary.DOT, group.jelly),
            seed = group.ordinal + 31,
            modifier = Modifier.size(28.dp),
            cellDp = 26f,
        )
        Text(
            group.displayLabel,
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, fontSize = 19.sp),
            color = GjPalette.Text,
        )
    }
}

// ── GuideThumb: thumbnail bàn / khối cho từng luật ───────────────────────────────
/** Lưới thumbnail cho từng id luật (null = luật vẽ tuỳ biến như combo). */
private fun thumbRows(id: String): List<List<GuideCell>>? = when (id) {
    "gravity-rotate" -> listOf(
        listOf(e, j(Y), e, e),
        listOf(e, j(P), j(B), e),
        listOf(j(Y), j(P), j(B), j(M)),
    )
    "clear-line" -> listOf(
        listOf(e, e, j(Y), e, e),
        listOf(j(M), j(Y), j(P), j(B), j(M)),
    )
    "gravity-drop" -> listOf(
        listOf(j(Y), e, j(M), e),
        listOf(e, e, e, e),
        listOf(j(B), e, j(P), j(Y)),
    )
    "sticky-cluster" -> listOf(
        listOf(e, j(M), j(M), e),
        listOf(j(M), j(M), j(M), e),
        listOf(e, j(M), e, st),
    )
    "form-super1" -> listOf(listOf(s1(P)))
    "form-rainbow" -> listOf(
        listOf(j(Y), j(Y), j(Y)),
        listOf(j(M), j(M), j(M)),
        listOf(j(B), j(B), j(B)),
    )
    "form-super2" -> listOf(listOf(s1(B), s2(B)))
    "form-rainbow2" -> listOf(listOf(rb2))
    "detonate-super1" -> listOf(
        listOf(e, j(P), e, j(B)),
        listOf(j(P), e, j(M), j(P)),
        listOf(j(B), j(P), j(Y), j(P)),
        listOf(j(M), j(M), j(P), j(B)),
    )
    "detonate-super2" -> listOf(
        listOf(j(B), j(M), j(P), j(Y), j(B)),
        listOf(j(B), j(Y), j(B), j(P), j(M)),
        listOf(j(M), j(Y), j(B), j(Y), j(P)),
        listOf(j(P), j(B), j(M), j(B), j(Y)),
        listOf(j(Y), j(P), j(B), j(M), j(P)),
    )
    "detonate-rainbow1" -> listOf(listOf(rb))
    "detonate-rainbow2" -> listOf(listOf(rb2))
    "vine-intro" -> listOf(
        listOf(e, vi, e, e),
        listOf(vi, vi, e, e),
        listOf(e, vr, e, e),
    )
    "vine-destroy" -> listOf(
        listOf(e, vi, e, e),
        listOf(j(Y), vr, j(M), j(P)),
    )
    "vine-to-trash" -> listOf(
        listOf(e, tr, e, e),
        listOf(e, e, e, e),
        listOf(e, vr, e, e),
    )
    "trash-destroy" -> listOf(
        listOf(e, tr, e),
        listOf(tr, s1(Y), tr),
        listOf(e, tr, e),
    )
    "water-flow" -> listOf(       // nguồn top chảy xuống + rẽ nhánh quanh đá (liền mạch)
        listOf(wf, ws, wf),
        listOf(wf, st, wf),
        listOf(wf, e, wf),
    )
    "water-drift" -> listOf(      // khối trôi xuôi theo dòng
        listOf(e, ws, e),
        listOf(e, wf, e),
        listOf(e, j(P), e),
    )
    "water-break" -> listOf(      // Thạch Nước cột ô nguồn → phá
        listOf(e, ws, e),
        listOf(e, j(B), e),
        listOf(e, j(B), e),
    )
    else -> null
}

/** Nền giếng thumbnail (bám tint của thiết kế). */
private fun thumbTint(id: String): Color = when (id) {
    "form-super1" -> GjPalette.BlockPinkShine
    "combo-refill" -> GjPalette.BlockBlueShine
    else -> GjPalette.CellEmpty
}

/** Thumbnail của một luật: bàn mini thật (canh giữa, khít chiều cao), hoặc hình combo tuỳ biến. */
@Composable
internal fun GuideThumb(id: String, modifier: Modifier = Modifier, height: Dp = 88.dp) {
    val tint = thumbTint(id)
    Box(
        modifier
            .fillMaxWidth()
            .height(height)
            .clip(RoundedCornerShape(GjRadius.md))
            .background(tint),
        contentAlignment = Alignment.Center,
    ) {
        if (id == "combo-refill") {
            ComboThumbContent()
        } else {
            val rows = thumbRows(id) ?: thumbRows("sticky-cluster")!!
            val cols = rows.maxOf { it.size }
            val rowN = rows.size
            // khít chiều cao giếng (chừa ~8dp trên+dưới); không vượt bề rộng giếng
            androidx.compose.foundation.layout.BoxWithConstraints {
                val availH = height - 16.dp
                val byHeight = availH * (cols.toFloat() / rowN.toFloat())
                val boardW = byHeight.coerceAtMost(maxWidth * 0.92f)
                GuideMiniBoard(rows, Modifier.width(boardW))
            }
        }
    }
}

/** Nội dung thumbnail combo: viên "×2" tím + tem "+1" xanh (bám Thumb comboTurn). */
@Composable
private fun ComboThumbContent() {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(
            Modifier
                .shadow(3.dp, RoundedCornerShape(GjRadius.full), clip = false)
                .clip(RoundedCornerShape(GjRadius.full))
                .background(GjPalette.Gravity)
                .padding(horizontal = 12.dp, vertical = 6.dp),
        ) {
            Text(
                stringResource(R.string.camnangparts_combo_x2),
                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.ExtraBold, fontSize = 18.sp),
                color = GjPalette.TextInvert,
            )
        }
        Box(
            Modifier
                .clip(RoundedCornerShape(GjRadius.full))
                .background(GjPalette.Success)
                .padding(horizontal = 9.dp, vertical = 3.dp),
        ) {
            Text(
                stringResource(R.string.camnangparts_combo_plus1),
                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.ExtraBold, fontSize = 14.sp),
                color = GjPalette.TextInvert,
            )
        }
    }
}

// ── SpotlightCard: "NÊN XEM" ─────────────────────────────────────────────────────
@Composable
internal fun SpotlightCard(entry: GjGuideEntry, onOpen: () -> Unit) {
    CandyCard(peel = 30.dp) {
        Seal(stringResource(R.string.camnangparts_new), modifier = Modifier.align(Alignment.TopStart).padding(10.dp))
        Row(
            modifier = Modifier.padding(horizontal = 18.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            Box(Modifier.width(120.dp)) { GuideThumb(entry.id) }
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    GjIcon(GjIcons.Star, modifier = Modifier.size(13.dp), tint = GjPalette.Gravity)
                    Text(
                        stringResource(R.string.camnangparts_should_watch),
                        style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, fontSize = 12.sp, letterSpacing = 0.6.sp),
                        color = GjPalette.Gravity,
                    )
                }
                Text(
                    entry.title,
                    style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, fontSize = 22.sp, lineHeight = 24.sp),
                    color = GjPalette.Text,
                    modifier = Modifier.padding(top = 3.dp, bottom = 4.dp),
                )
                Text(
                    entry.desc,
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold, fontSize = 13.sp, lineHeight = 17.sp),
                    color = GjPalette.TextMuted,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.padding(bottom = 12.dp),
                )
                GjButton(onClick = onOpen, variant = BtnVariant.Primary) { Text(stringResource(R.string.camnangparts_view_tip)) }
            }
        }
    }
}

// ── WideEntryCard: thẻ "Quan trọng" to ngang (hero nhóm) ─────────────────────────
@Composable
internal fun WideEntryCard(entry: GjGuideEntry, seen: Boolean, onOpen: () -> Unit) {
    CandyCard(peel = 30.dp, onClick = onOpen, modifier = Modifier.fillMaxWidth()) {
        Seal(stringResource(R.string.camnangparts_important), modifier = Modifier.align(Alignment.TopStart).padding(10.dp))
        Row(
            modifier = Modifier.padding(horizontal = 18.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            Box(Modifier.width(120.dp)) { GuideThumb(entry.id) }
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    entry.title,
                    style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, fontSize = 21.sp, lineHeight = 23.sp),
                    color = GjPalette.Text,
                    modifier = Modifier.padding(bottom = 4.dp),
                )
                Text(
                    entry.desc,
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold, fontSize = 13.sp, lineHeight = 17.sp),
                    color = GjPalette.TextMuted,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.padding(bottom = if (seen) 8.dp else 0.dp),
                )
                if (seen) SeenTag()
            }
        }
    }
}

// ── EntryCard: thẻ 2-cột (mở khoá hoặc bị khoá) ──────────────────────────────────
@Composable
internal fun EntryCard(entry: GjGuideEntry, unlocked: Boolean, seen: Boolean, onOpen: () -> Unit, modifier: Modifier = Modifier) {
    if (!unlocked) {
        Column(
            modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(GjRadius.xl))
                .background(GjPalette.SurfaceSunken)
                .border(1.5.dp, Color(0x24967850), RoundedCornerShape(GjRadius.xl))
                .alpha(0.85f)
                .padding(horizontal = 16.dp, vertical = 14.dp),
        ) {
            Box(
                Modifier.fillMaxWidth().height(88.dp).clip(RoundedCornerShape(GjRadius.md)).background(GjPalette.SurfaceSunken),
                contentAlignment = Alignment.Center,
            ) { LockGlyph(26.dp, GjPalette.TextMuted) }
            Text(
                stringResource(R.string.camnangparts_locked),
                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, fontSize = 16.sp),
                color = GjPalette.TextMuted,
                modifier = Modifier.padding(top = 10.dp),
            )
            Text(
                stringResource(R.string.camnangparts_play_to_unlock),
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold, fontSize = 12.sp),
                color = GjPalette.TextMuted,
                modifier = Modifier.padding(top = 2.dp),
            )
        }
        return
    }
    CandyCard(peel = 26.dp, onClick = onOpen, modifier = modifier.fillMaxWidth()) {
        Column(Modifier.padding(horizontal = 16.dp, vertical = 14.dp)) {
            GuideThumb(entry.id)
            Text(
                entry.title,
                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, fontSize = 17.sp, lineHeight = 19.sp),
                color = GjPalette.Text,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(top = 10.dp),
            )
            Text(
                entry.desc,
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold, fontSize = 12.sp, lineHeight = 16.sp),
                color = GjPalette.TextMuted,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(top = 3.dp),
            )
            if (seen) {
                Spacer(Modifier.height(8.dp))
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) { SeenTag() }
            }
        }
    }
}

// ── Ổ khoá nhỏ (bám LockGlyph SVG của thiết kế) ──────────────────────────────────
@Composable
internal fun LockGlyph(size: Dp, tint: Color) {
    Canvas(Modifier.size(size)) {
        val s = this.size.minDimension / 24f
        val stroke = androidx.compose.ui.graphics.drawscope.Stroke(
            width = 2f * s,
            cap = androidx.compose.ui.graphics.StrokeCap.Round,
            join = androidx.compose.ui.graphics.StrokeJoin.Round,
        )
        drawRoundRect(
            tint,
            topLeft = Offset(4.5f * s, 10.5f * s),
            size = androidx.compose.ui.geometry.Size(15f * s, 10f * s),
            cornerRadius = androidx.compose.ui.geometry.CornerRadius(3f * s),
            style = stroke,
        )
        drawLine(tint, Offset(8f * s, 10.5f * s), Offset(8f * s, 7f * s), 2f * s, cap = androidx.compose.ui.graphics.StrokeCap.Round)
        drawLine(tint, Offset(16f * s, 10.5f * s), Offset(16f * s, 7f * s), 2f * s, cap = androidx.compose.ui.graphics.StrokeCap.Round)
        drawArc(
            tint, startAngle = 180f, sweepAngle = 180f, useCenter = false,
            topLeft = Offset(8f * s, 3f * s), size = androidx.compose.ui.geometry.Size(8f * s, 8f * s), style = stroke,
        )
        drawCircle(tint, radius = 1.5f * s, center = Offset(12f * s, 15f * s))
    }
}
