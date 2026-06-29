package com.gravityjelly.app

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.R
import com.gravityjelly.app.ui.components.GravityRotateButton
import com.gravityjelly.app.ui.theme.GjLogoFontFamily
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.core.Direction
import com.gravityjelly.core.Piece
import com.gravityjelly.game.BoardCanvas
import com.gravityjelly.game.EndlessGameHolder
import com.gravityjelly.game.PieceThumbnail
import com.gravityjelly.game.TRAY_GAP_FRAC
import com.gravityjelly.game.rememberGameDriver

/**
 * Màn Game — ráp design-faithful theo `04-screens/board-design.jsx` (ưu tiên #1, là card
 * chính thức "① Game").
 *
 * Thứ tự dọc (board-design.jsx): **nền PNG đồng cỏ full-bleed** → **HUD một hàng** (score
 * card · D-pad trọng lực · nút pause tròn) → **bàn 9×9 trong khung kem SVG** → **khay 3 giếng
 * + FAB xoay** → khoảng thở đồng cỏ phía dưới.
 *
 * Đây là lớp **vỏ bố cục** thuần: KHÔNG chứa luật chơi, KHÔNG tự vẽ bàn — bàn do [board] slot
 * cung cấp ([BoardCanvas] nối holder ở nơi gọi). Toàn bộ chrome (score-card, board-frame, tray)
 * vẽ lại trong Canvas theo đúng 06-svg-assets (rounded-rect lồng nhau + gradient dọc), trừ nền
 * đồng cỏ là ảnh raster `meadow_bg.png`.
 *
 * Quyết định (lệch thiết kế ↔ gameplay đã chốt với chủ dự án):
 * - **D-pad trọng lực** ở HUD chỉ là **chỉ thị hướng** (đĩa trắng nổi = hướng hiện tại) — không
 *   bắt chạm; nút xoay + bộ đếm lượt là [GravityRotateButton] (FAB) bên phải khay.
 * - **Bỏ FAB refresh** của thiết kế (engine chưa có cơ chế đổi mảnh) — FAB phải = nút xoay.
 *
 * @param direction hướng trọng lực hiện tại (drive đĩa D-pad + mắt khối trên bàn).
 * @param turnsLeft lượt xoay còn lại — badge trên FAB xoay; 0 → FAB tắt.
 * @param board slot vẽ bàn — nhận Modifier đã định cỡ (đặt trong giếng khung kem).
 */
@Composable
fun GameScreen(
    score: Int,
    direction: Direction,
    turnsLeft: Int,
    pieces: List<Piece?>,
    selectedIndex: Int,
    onPause: () -> Unit,
    onSelectPiece: (Int) -> Unit,
    onRotate: () -> Unit,
    modifier: Modifier = Modifier,
    traySlotModifier: (Int) -> Modifier = { Modifier },
    board: @Composable (Modifier) -> Unit,
) {
    Box(modifier = modifier.fillMaxSize().background(GjPalette.Bg)) {
        // ── Nền đồng cỏ PNG full-bleed (sau status bar), object-fit cover, neo đáy ──────
        Image(
            painter            = painterResource(R.drawable.meadow_bg),
            contentDescription = null,
            modifier           = Modifier.fillMaxSize(),
            contentScale       = ContentScale.Crop,
            alignment          = Alignment.BottomCenter,
        )

        // Nội dung trong vùng an toàn; padding 12/6/16 (board-design.jsx container padding).
        Column(
            modifier = Modifier
                .fillMaxSize()
                .windowInsetsPadding(WindowInsets.safeDrawing)
                .padding(start = HGUTTER, end = HGUTTER, top = 12.dp, bottom = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            // ── HUD: score card (trái) · D-pad trọng lực (giữa) · pause (phải) ─────────
            Row(
                modifier              = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment     = Alignment.CenterVertically,
            ) {
                ScoreCard(score = score)
                GravityDpad(direction = direction)
                PauseRound(onPause = onPause)
            }

            // HUD marginBottom 16 + board paddingTop 24 (board-design.jsx).
            Spacer(Modifier.height(40.dp))

            // ── Bàn 9×9 trong khung kem (board-frame.svg) ─────────────────────────────
            BoardFrame(modifier = Modifier.fillMaxWidth().aspectRatio(1f)) { inner ->
                board(inner)
            }

            Spacer(Modifier.height(14.dp))

            // ── Khay 3 giếng + FAB xoay (thay FAB refresh) ────────────────────────────
            Row(
                modifier              = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
                verticalAlignment     = Alignment.CenterVertically,
            ) {
                GameTray(
                    pieces        = pieces,
                    selectedIndex = selectedIndex,
                    onSelect      = onSelectPiece,
                    slotModifier  = traySlotModifier,
                    modifier      = Modifier.weight(1f),
                )
                GravityRotateButton(turnsLeft = turnsLeft, onRotate = onRotate)
            }

            // Khoảng thở đồng cỏ phía dưới (board-design.jsx: flex:1 minHeight).
            Spacer(Modifier.weight(1f))
        }
    }
}

/** Gutter ngang cột nội dung (board-design.jsx container padding ngang ~6px, nới nhẹ cho cân). */
private val HGUTTER = 8.dp

// ── HUD · Score card (06-svg-assets/ui/score-card.svg) ──────────────────────────

private val ScoreBorderTop = Color(0xFFFFFCF7)
private val ScoreBorderBot = Color(0xFFE3D4BF)
private val ScoreBgTop     = Color(0xFFFFFFFF)
private val ScoreBgBot     = Color(0xFFFFFAF0)
private val ScoreShadow    = Color(0x338BA295)   // feDropShadow #8ba295 @0.2

/** Số kiểu Việt: 12480 → "12.480" (board-design.jsx toLocaleString('vi-VN')). */
private fun Int.viScore(): String {
    if (this == 0) return "0"
    return toString().reversed().chunked(3).joinToString(".").reversed()
}

@Composable
private fun ScoreCard(score: Int, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier.size(80.dp).drawBehind { drawScoreCard() },
        contentAlignment = Alignment.Center,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text  = "ĐIỂM",
                style = MaterialTheme.typography.labelSmall.copy(
                    color         = GjPalette.TextMuted,
                    fontSize      = 10.sp,
                    fontWeight    = FontWeight.ExtraBold,
                    letterSpacing = 0.08.em,
                    lineHeight    = 1.em,
                ),
            )
            Text(
                text  = score.viScore(),
                style = MaterialTheme.typography.titleLarge.copy(
                    fontFamily = GjLogoFontFamily,           // chữ số = Fredoka (display)
                    color      = GjPalette.Text,
                    fontSize   = 18.sp,
                    fontWeight = FontWeight.Bold,
                    lineHeight = 1.05.em,
                ),
            )
        }
    }
}

/** Vẽ thẻ điểm: viền gradient + nền gradient + highlight góc (score-card.svg viewBox 200). */
private fun DrawScope.drawScoreCard() {
    val w   = size.width
    val rO  = CornerRadius(w * 0.225f)   // outer rx 45/200
    val rI  = CornerRadius(w * 0.19f)    // inner rx 38/200
    val o   = w * 0.10f                  // outer inset 20/200
    val oSz = w * 0.80f
    val i   = w * 0.125f                 // inner inset 25/200
    val iSz = w * 0.75f
    // bóng đổ mềm (dy 5/200)
    drawRoundRect(ScoreShadow, topLeft = Offset(o, o + w * 0.025f), size = Size(oSz, oSz), cornerRadius = rO)
    // viền
    drawRoundRect(
        brush = Brush.verticalGradient(listOf(ScoreBorderTop, ScoreBorderBot), startY = o, endY = o + oSz),
        topLeft = Offset(o, o), size = Size(oSz, oSz), cornerRadius = rO,
    )
    // nền
    drawRoundRect(
        brush = Brush.verticalGradient(listOf(ScoreBgTop, ScoreBgBot), startY = i, endY = i + iSz),
        topLeft = Offset(i, i), size = Size(iSz, iSz), cornerRadius = rI,
    )
    // highlight góc trên-trái (M45 33 Q34 34 33 45)
    drawCornerHighlight(w, w, 0.225f, 0.165f, 0.17f, 0.17f, 0.165f, 0.225f, w * 0.015f)
}

// ── HUD · Gravity D-pad (chỉ thị hướng — board-design.jsx GravityPad) ───────────

private val DpadFaceTop = Color(0xFF9183F6)
private val DpadFaceMid = Color(0xFF7E6CF0)
private val DpadFaceBot = Color(0xFF6353D6)
private val DpadEdge    = Color(0xFF4F3FB0)   // boxShadow 0 6px 0 #4F3FB0

/**
 * Capsule tím với **4 mũi tên CỐ ĐỊNH** theo thứ tự trái · trên · phải · dưới; **đĩa trắng nổi
 * (active) DI CHUYỂN** tới mũi tên trùng hướng trọng lực hiện tại. KHÔNG bắt chạm (chỉ chỉ-thị).
 */
@Composable
private fun GravityDpad(direction: Direction, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier
            .height(50.dp)
            .drawBehind {
                val r = CornerRadius(size.height / 2f)
                val edgePx = 6.dp.toPx()
                drawRoundRect(DpadEdge, cornerRadius = r)
                drawRoundRect(
                    brush = Brush.verticalGradient(listOf(DpadFaceTop, DpadFaceMid, DpadFaceBot)),
                    size  = Size(size.width, size.height - edgePx), cornerRadius = r,
                )
            }
            .padding(horizontal = 9.dp),
        verticalAlignment     = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(1.dp),
    ) {
        for (d in DPAD_ORDER) {
            if (d == direction) DpadActiveDisc(d) else DpadGhostSlot(d)
        }
    }
}

/** Đĩa trắng nổi = ô active; arrow màu tím đậm trên đĩa. */
@Composable
private fun DpadActiveDisc(dir: Direction) {
    Box(
        modifier = Modifier
            .size(40.dp)
            .drawBehind {
                val R = size.minDimension / 2f
                val c = Offset(size.width / 2f, size.height / 2f)
                drawCircle(Color(0xFFC8BCF2), R, Offset(c.x, c.y + 4.dp.toPx())) // mép dưới
                drawCircle(
                    brush = Brush.radialGradient(
                        listOf(Color.White, Color(0xFFF3ECFF)),
                        center = Offset(c.x, c.y - R * 0.35f), radius = R * 1.25f,
                    ),
                    radius = R, center = c,
                )
            },
        contentAlignment = Alignment.Center,
    ) {
        DpadArrow(degrees = dir.dpadDegrees(), color = DpadFaceBot, sizeDp = 24.dp)
    }
}

/** Ô mũi tên mờ (chưa active) — bề rộng cố định để 4 ô giãn đều khi đĩa active di chuyển. */
@Composable
private fun DpadGhostSlot(dir: Direction) {
    Box(Modifier.size(width = 26.dp, height = 40.dp), contentAlignment = Alignment.Center) {
        DpadArrow(degrees = dir.dpadDegrees(), color = DpadGhost, sizeDp = 20.dp)
    }
}

/** Thứ tự mũi tên D-pad CỐ ĐỊNH: trái · trên · phải · dưới (đĩa active di chuyển theo hướng). */
private val DPAD_ORDER = listOf(Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN)
private val DpadGhost = Color(0xEBFFFFFF)   // rgba(255,255,255,0.92)

/** board-design.jsx Arrow rot map: up 0 · down 180 · left 270 · right 90. */
private fun Direction.dpadDegrees(): Float = when (this) {
    Direction.UP    -> 0f
    Direction.DOWN  -> 180f
    Direction.LEFT  -> 270f
    Direction.RIGHT -> 90f
}

/** Mũi tên chevron (board-design.jsx Arrow: M12 5v14 M6 11l6-6 6 6) quay [degrees]. */
@Composable
private fun DpadArrow(degrees: Float, color: Color, sizeDp: Dp) {
    Canvas(Modifier.size(sizeDp).rotate(degrees)) {
        val u  = size.minDimension / 24f
        val sw = 3f * u
        drawLine(color, Offset(12 * u, 5 * u), Offset(12 * u, 19 * u), sw, StrokeCap.Round)
        drawLine(color, Offset(6 * u, 11 * u), Offset(12 * u, 5 * u), sw, StrokeCap.Round)
        drawLine(color, Offset(18 * u, 11 * u), Offset(12 * u, 5 * u), sw, StrokeCap.Round)
    }
}

// ── HUD · Pause (board-design.jsx PauseCard) ────────────────────────────────────

@Composable
private fun PauseRound(onPause: () -> Unit, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .size(44.dp)
            .clip(CircleShape)
            .drawBehind {
                val R = size.minDimension / 2f
                val c = Offset(size.width / 2f, size.height / 2f)
                drawCircle(Color(0xFFE3D4BF), R, Offset(c.x, c.y + 4.dp.toPx())) // mép dưới candy
                drawCircle(
                    brush = Brush.radialGradient(
                        listOf(Color.White, Color(0xFFF6EFE2)),
                        center = Offset(c.x, c.y - R * 0.35f), radius = R * 1.25f,
                    ),
                    radius = R, center = c,
                )
            }
            .clickableNoRipple(onPause),
        contentAlignment = Alignment.Center,
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(5.dp)) {
            repeat(2) {
                Box(
                    Modifier
                        .size(width = 4.dp, height = 14.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(GjPalette.Gravity),
                )
            }
        }
    }
}

/** clickable không ripple (HUD candy button — design không có ripple Material). */
@Composable
private fun Modifier.clickableNoRipple(onClick: () -> Unit): Modifier {
    val interaction = remember { MutableInteractionSource() }
    return this.clickable(interactionSource = interaction, indication = null, onClick = onClick)
}

// ── Bàn · khung kem (06-svg-assets/ui/board-frame.svg) ──────────────────────────

private val FrameOuterTop = Color(0xFFFFFBF4)
private val FrameOuterBot = Color(0xFFF2E3D0)
private val FrameInnerTop = Color(0xFFFDF9F2)
private val FrameInnerBot = Color(0xFFFAF2E5)
private val FrameShadow   = Color(0x1F5C6B4E)   // feDropShadow #5c6b4e @0.12
private val FrameHi       = Color(0x80FFFFFF)   // highlight stroke @0.5

/**
 * Khung kem quanh bàn (board-frame.svg): rounded-rect lồng nhau + gradient dọc + highlight góc.
 * Giếng lõm + lưới do [BoardCanvas] tự vẽ; [content] đặt vào trong, inset 5% (board-design.jsx).
 */
@Composable
private fun BoardFrame(
    modifier: Modifier,
    content: @Composable (Modifier) -> Unit,
) {
    Box(
        modifier = modifier.drawBehind { drawBoardFrame() },
        contentAlignment = Alignment.Center,
    ) {
        content(Modifier.fillMaxSize(0.90f))
    }
}

private fun DrawScope.drawBoardFrame() {
    val w = size.width
    val h = size.height
    val rO = CornerRadius(w * 0.108f)   // outer rx 80/740
    val rI = CornerRadius(w * 0.088f)   // inner rx 65/740
    // bóng đổ mềm (dy 12/740)
    drawRoundRect(FrameShadow, topLeft = Offset(0f, h * 0.016f), size = Size(w, h), cornerRadius = rO)
    // viền kem ngoài
    drawRoundRect(brush = Brush.verticalGradient(listOf(FrameOuterTop, FrameOuterBot)), cornerRadius = rO)
    // nền kem trong
    val ins = w * 0.02f
    drawRoundRect(
        brush = Brush.verticalGradient(listOf(FrameInnerTop, FrameInnerBot), startY = ins, endY = h - ins),
        topLeft = Offset(ins, ins), size = Size(w - 2 * ins, h - 2 * ins), cornerRadius = rI,
    )
    // highlight góc trên-trái (M120 58 Q70 62 62 120)
    drawCornerHighlight(w, h, 0.1216f, 0.0378f, 0.054f, 0.0432f, 0.0432f, 0.1216f, w * 0.008f)
}

// ── Khay 3 giếng (06-svg-assets/ui/tray.svg) ────────────────────────────────────

private val TrayBorderTop = Color(0xFFFDFBF7)
private val TrayBorderBot = Color(0xFFE2CFB7)
private val TrayBgTop     = Color(0xFFFBF4E9)
private val TrayBgBot     = Color(0xFFF9EFE0)
private val TrayDivider   = Color(0xFFE6DAC9)
private val TrayShadow    = Color(0x265C6B4E)   // feDropShadow @0.15
private val TrayHi        = Color(0x99FFFFFF)   // highlight @0.6

/** Cỡ ô dùng chung cho mảnh khay (mảnh lớn nhất quyết định, kẹp 12–22dp — mirror GjTray). */
private fun List<Piece?>.trayCellDp(): Float {
    var maxDim = 1
    for (p in this) if (p != null) maxDim = maxOf(maxDim, p.shape.width, p.shape.height)
    return ((64f - (maxDim - 1) * 2f) / maxDim).coerceIn(12f, 22f)
}

/**
 * Khay 3 giếng (tray.svg): pill bo góc + gradient + 2 vạch ngăn. Mỗi giếng một mảnh (kéo-thả
 * qua [slotModifier]); ô đang kéo ([selectedIndex]) nhấc nhẹ lên. KHÔNG vẽ giếng lõm/đường gạch
 * cho ô trống (thiết kế mới: nền tray phẳng).
 */
@Composable
private fun GameTray(
    pieces: List<Piece?>,
    selectedIndex: Int,
    onSelect: (Int) -> Unit,
    slotModifier: (Int) -> Modifier,
    modifier: Modifier = Modifier,
) {
    val cellDp = remember(pieces) { pieces.trayCellDp() }
    Box(
        modifier = modifier
            .aspectRatio(770f / 260f)
            .drawBehind { drawTray() },
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = GjSpace.md, vertical = GjSpace.sm),
        ) {
            for (i in 0 until 3) {
                val piece = pieces.getOrNull(i)
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .then(slotModifier(i))
                        .clickableNoRipple { if (piece != null) onSelect(i) },
                    contentAlignment = Alignment.Center,
                ) {
                    if (piece != null) {
                        val lifted = selectedIndex == i
                        PieceThumbnail(
                            piece    = piece,
                            cellDp   = cellDp,
                            gapFrac  = TRAY_GAP_FRAC,
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(GjSpace.xs)
                                .then(if (lifted) Modifier.padding(bottom = 6.dp) else Modifier),
                        )
                    }
                }
            }
        }
    }
}

private fun DrawScope.drawTray() {
    val w = size.width
    val h = size.height
    val rB  = CornerRadius(w * 0.0714f)   // border rx 55/770
    val rBg = CornerRadius(w * 0.0584f)   // bg rx 45/770
    // bóng đổ (dy 8/260)
    drawRoundRect(TrayShadow, topLeft = Offset(0f, h * 0.031f), size = Size(w, h), cornerRadius = rB)
    // viền
    drawRoundRect(brush = Brush.verticalGradient(listOf(TrayBorderTop, TrayBorderBot)), cornerRadius = rB)
    // nền
    val insX = w * 0.013f
    val insY = h * 0.0385f
    drawRoundRect(
        brush = Brush.verticalGradient(listOf(TrayBgTop, TrayBgBot), startY = insY, endY = h - insY),
        topLeft = Offset(insX, insY), size = Size(w - 2 * insX, h - 2 * insY), cornerRadius = rBg,
    )
    // 2 vạch ngăn giếng (x 275/770, 525/770; y 55..235 / 260)
    val divW = w * 0.0039f
    val y0 = h * 0.1538f
    val y1 = h * 0.8462f
    drawLine(TrayDivider, Offset(w * 0.3377f, y0), Offset(w * 0.3377f, y1), divW, StrokeCap.Round)
    drawLine(TrayDivider, Offset(w * 0.6623f, y0), Offset(w * 0.6623f, y1), divW, StrokeCap.Round)
    // highlight góc trên-trái (M65 33 Q40 35 37 60)
    val hi = Path().apply {
        moveTo(w * 0.0649f, h * 0.0692f)
        quadraticBezierTo(w * 0.0325f, h * 0.0769f, w * 0.0286f, h * 0.1731f)
    }
    drawPath(hi, TrayHi, style = Stroke(width = w * 0.0052f, cap = StrokeCap.Round))
}

// ── helper chung: highlight bo góc trên-trái (vệt sáng "kẹo bóng") ──────────────

private fun DrawScope.drawCornerHighlight(
    w: Float, h: Float,
    mx: Float, my: Float, cx: Float, cy: Float, ex: Float, ey: Float,
    strokeW: Float,
) {
    val p = Path().apply {
        moveTo(w * mx, h * my)
        quadraticBezierTo(w * cx, h * cy, w * ex, h * ey)
    }
    drawPath(p, FrameHi, style = Stroke(width = strokeW, cap = StrokeCap.Round))
}

// ── preview (dữ liệu mẫu qua EndlessGameHolder cho bàn sống) ────────────────────

@Preview(name = "GameScreen — dữ liệu mẫu", widthDp = 360, heightDp = 800)
@Composable
private fun GameScreenPreview() {
    GravityJellyTheme {
        val holder     = remember { EndlessGameHolder(seed = 12345L) }
        val renderTick = rememberGameDriver(holder.animator)
        val shell      = holder.shell
        GameScreen(
            score         = shell.score,
            direction     = holder.boardRender.gravity,
            turnsLeft     = shell.budget,
            pieces        = shell.tray.map { it as Piece? },
            selectedIndex = -1,
            onPause       = {},
            onSelectPiece = {},
            onRotate      = { holder.rotate(cw = true) },
            board         = { m ->
                BoardCanvas(
                    render     = { holder.boardRender },
                    renderTick = renderTick.value,
                    animator   = holder.animator,
                    modifier   = m,
                )
            },
        )
    }
}
