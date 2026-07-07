package com.gravityjelly.app

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.drawscope.withTransform
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import kotlin.math.PI
import kotlin.math.floor
import kotlin.math.sin

/**
 * Màn Home — RE-SKIN 01/07 sang nền **`home_world_N_bg.png`** (đổi theo [world]) + **menu icon PNG**
 * (design/04-screens/home-screen.jsx, bản mới).
 *
 *  · Nền tranh vẽ `home_world_{world}_bg.png` (821×1916): trời + LOGO + bàn biome (bản 02/07 **KHÔNG
 *    còn bake panel** — đáy chỉ còn cảnh biome). Neo ĐÁY full-width; phần dư trên là trời ([WorldTheme.homeSky]).
 *    [world] = world người chơi đang tiến tới → Home đổi cảnh theo tiến độ (Đồng cỏ → Rừng → Sông).
 *  · **Panel kem `home_panel.png` TÁCH RỜI** (dùng chung mọi world) phủ lên nền ở đáy (JSX top 72.5%,
 *    height 25%), chứa **menu icon 2 hàng** (JSX khối top 75%, bottom 5%):
 *      – Hàng trên: CHIẾN DỊCH · ENDLESS (2 nút chơi chính, rộng 31cqw/nút).
 *      – Hàng dưới: CẨM NANG · BẢNG XẾP HẠNG · CÀI ĐẶT (3 nút, rộng ~19.3cqw/nút).
 *    Mỗi nút là 1 ảnh PNG tự chứa (khung + icon), flex ĐỀU BỀ NGANG, cao theo tỉ lệ art, nhấn nén .93.
 *  · **Hạt bay theo world** ([PetalLayer]) trôi ngang như gió: Đồng cỏ = cánh hoa · Rừng rậm = LÁ ·
 *    Sông & Thác = GIỌT NƯỚC (đổi hình + palette theo [world]). Ẩn khi reduced-motion.
 *  · **KHÔNG HUD trên** (user 01/07: bỏ chip KỶ LỤC; hearts/life của JSX cũng không dựng).
 *
 * Cả 5 mục (Chiến dịch · Endless · Cẩm nang · BXH · Cài đặt) đều đã có màn và vào được — không
 * mục nào bị khoá. Cơ chế `comingSoon` (làm mờ + khoá bấm) vẫn còn nhưng hiện KHÔNG dùng cho mục
 * nào. Sparkle của bản cũ đã GỠ (JSX comment: nền mới chưa có landmark tương ứng).
 */
@Composable
fun HomeScreen(
    onPlayEndless: () -> Unit,
    onSettings: () -> Unit,
    onPlayCampaign: () -> Unit = {},
    onHandbook: () -> Unit = {},
    onLeaderboard: () -> Unit = {},
    world: Int = 1,
    reducedMotion: Boolean = false,
    modifier: Modifier = Modifier,
) {
    // Nền + trời đổi theo world người chơi đang tiến tới (WorldTheme). Trời lấp dải trên khi màn cao hơn ảnh.
    Box(modifier = modifier.fillMaxSize().background(WorldTheme.homeSky(world))) {
        BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
            // Khung = MÀN HÌNH. Ảnh nền NEO ĐÁY, phủ full bề ngang, tỉ lệ 821/1916 (HOME_AR);
            // dư phía trên (máy cao) lộ trời. Menu là con TRỰC TIẾP của khung, neo từ ĐÁY →
            // bám đúng panel kem (đáy art = đáy màn).
            val boxW: Dp = maxWidth
            val imgH: Dp = boxW * HOME_AR      // chiều cao art khi phủ full width (neo đáy)
            val artHpx = with(LocalDensity.current) { imgH.toPx() }

            // Nền: NEO ĐÁY bằng ContentScale.Crop + BottomCenter — cover ghim đáy (art cao hơn
            // màn → cắt bớt TRỜI ở trên), đáy art luôn trùng đáy màn.
            Image(
                painter            = painterResource(WorldTheme.homeBackground(world)),
                contentDescription = "Gravity Jelly",
                modifier           = Modifier.fillMaxSize(),
                contentScale       = ContentScale.Crop,
                alignment          = Alignment.BottomCenter,
            )

            // ── Cánh hoa bay NGANG trong dải giữa (dưới logo, trên panel) — vẽ TRƯỚC menu để
            // KHÔNG đè lên nút (user 01/07). Ẩn khi reduced-motion.
            if (!reducedMotion) {
                PetalLayer(world = world, artHeightPx = artHpx, modifier = Modifier.fillMaxSize())
            }

            // ── Panel kem tách rời + menu icon 2 hàng (JSX: panel top 72.5% h25%, khối nút top 75% bottom 5%).
            HomeMenu(
                boxW = boxW, imgH = imgH,
                onCampaign = onPlayCampaign,    // prototype đã mở
                onPlay = onPlayEndless,
                onGuide = onHandbook,
                onLeaderboard = onLeaderboard,  // đã có màn Bảng xếp hạng
                onSettings = onSettings,
            )
        }
    }
}

// Tỉ lệ ảnh nền home-world-N-bg.png (821×1916, mọi world cùng khổ) — cao/rộng.
private const val HOME_AR = 1916f / 821f

// (Trời đỉnh ảnh nay lấy theo world qua WorldTheme.homeSky — xem HomeScreen.)

// Panel kem `home_panel.png` (1448×1086): tỉ lệ RỘNG/CAO + phần viền cream (fraction, đo PIL 02/07:
// ngang cream bắt đầu ~4.6% mỗi bên, dọc ~11.3% trên/dưới) — dùng để pad nút vào đúng vùng cream.
private const val PANEL_AR = 1448f / 1086f
private const val PANEL_CREAM_H = 0.046f
private const val PANEL_CREAM_V = 0.113f
// Thu nhỏ cụm nút so với vùng cream (canh giữa) — chỉnh cỡ nút Home bằng đúng knob này (user 03/07).
private const val BTN_ROW_SCALE = 0.85f

// Tỉ lệ RỘNG/CAO từng icon PNG (px nguồn bản mới 02/07) — height = width / aspect.
private const val AR_CAMPAIGN = 1244f / 722f
private const val AR_INFINITE = 1386f / 696f
private const val AR_GUIDE = 918f / 884f
private const val AR_LEADER = 1052f / 1043f
private const val AR_SETTING = 962f / 964f

// ── Panel kem TÁCH RỜI + menu 2 hàng ─────────────────────────────────────────────────────
// Bản 02/07: nền `home_world_N_bg.png` KHÔNG còn bake panel — panel là ảnh riêng `home_panel.png`
// phủ lên (dùng chung mọi world). Bám JSX home-screen.jsx:
//   · panel: left/right 6% (width 88%), top 72.5%, height 25% → đáy cách stage 2.5%.
//   · khối menu: left/right 6%, top 75%, bottom 5% (height 20%), column space-evenly.
//   · 2 hàng, mỗi hàng rộng 66cqw, gap 4cqw; nút flex ĐỀU BỀ NGANG (width = slot), cao theo aspect.
// cqw = 1% bề rộng stage = boxW/100.
@Composable
private fun BoxScope.HomeMenu(
    boxW: Dp,
    imgH: Dp,
    onCampaign: () -> Unit,
    onPlay: () -> Unit,
    onGuide: () -> Unit,
    onLeaderboard: () -> Unit,
    onSettings: () -> Unit,
) {
    val cqw = boxW / 100f

    // Panel kem tách rời — RỘNG 90% (user 02/07), GIỮ ĐÚNG TỈ LỆ GỐC (không stretch): height =
    // width / aspect. Neo đáy cách stage 3%. x canh giữa (mỗi bên (1-.90)/2 = 5%).
    val panelW = boxW * 0.85f            // thu nhỏ (user 02/07: panel hơi lớn so design)
    val panelH = panelW / PANEL_AR
    val panelX = (boxW - panelW) / 2f    // canh giữa ngang
    val panelBottomUp = imgH * 0.02f     // hạ thấp hơn → lộ rõ bàn đá phía trên

    Image(
        painter = painterResource(R.drawable.home_panel),
        contentDescription = null,
        contentScale = ContentScale.Fit,
        modifier = Modifier
            .align(Alignment.BottomStart)
            .offset(x = panelX, y = -panelBottomUp)
            .size(width = panelW, height = panelH),
    )

    // Khối menu TRÙNG panel. Viền cream panel KHÔNG đều (ngang ~4.6% · dọc ~11.3%) → pad bù theo viền
    // rồi cộng khe M=4cqw ĐỀU 4 phía (user 02/07: lề trên/dưới/2 bên tới bờ panel bằng nhau).
    // MỌI số đo là fraction của boxW/panel (không px cứng) → co giãn TỈ LỆ mọi máy, không vỡ layout.
    val padH = panelW * PANEL_CREAM_H + cqw * 4f
    val padV = panelH * PANEL_CREAM_V + cqw * 4f
    // Bề ngang tối đa (tới sát khe cream) rồi THU NHỎ theo hệ số, canh giữa → nút nhỏ lại ĐỀU cả
    // rộng lẫn cao (weight+aspect), 2 hàng vẫn dài bằng nhau, khoảng dọc tự giãn qua space-evenly.
    // (user 03/07: nút hơi lớn.) BTN_ROW_SCALE là knob tỉ lệ duy nhất để chỉnh cỡ nút.
    val contentW = (panelW - padH * 2f) * BTN_ROW_SCALE
    val gap = cqw * 4f                   // khe giữa nút = 4cqw (JSX gap:4cqw)

    Box(
        modifier = Modifier
            .align(Alignment.BottomStart)
            .offset(x = panelX, y = -panelBottomUp)
            .size(width = panelW, height = panelH),
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = padH, vertical = padV),
            horizontalAlignment = Alignment.CenterHorizontally,
            // JSX justify-content:space-evenly → lề trên = giữa = dưới, tự cân, KHÔNG tràn màn thấp.
            verticalArrangement = Arrangement.SpaceEvenly,
        ) {
            // Hàng trên — 2 nút chơi chính. Nút weight(1f) → chia ĐỀU bề ngang contentW (JSX flex:1);
            // cao = rộng/aspect (JSX img width:100% height:auto). 2 hàng cùng contentW → DÀI BẰNG NHAU.
            Row(
                modifier = Modifier.width(contentW),
                horizontalArrangement = Arrangement.spacedBy(gap),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(
                    icon = painterResource(R.drawable.btn_campaign), contentDescription = stringResource(R.string.home_campaign),
                    aspect = AR_CAMPAIGN, onClick = onCampaign,
                )
                IconButton(
                    icon = painterResource(R.drawable.btn_infinite), contentDescription = stringResource(R.string.home_endless),
                    aspect = AR_INFINITE, onClick = onPlay,
                )
            }
            // Hàng dưới — 3 nút phụ trợ, cũng weight(1f) trên contentW = hàng trên.
            Row(
                modifier = Modifier.width(contentW),
                horizontalArrangement = Arrangement.spacedBy(gap),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(
                    icon = painterResource(R.drawable.btn_guide), contentDescription = stringResource(R.string.home_guide),
                    aspect = AR_GUIDE, onClick = onGuide,
                )
                IconButton(
                    icon = painterResource(R.drawable.btn_leaderboard), contentDescription = stringResource(R.string.home_leaderboard),
                    aspect = AR_LEADER, onClick = onLeaderboard,
                )
                IconButton(
                    icon = painterResource(R.drawable.btn_setting), contentDescription = stringResource(R.string.home_settings),
                    aspect = AR_SETTING, onClick = onSettings,
                )
            }
        }
    }
}

/**
 * Nút icon PNG (JSX IconButton): ảnh tự chứa (khung + icon). Đặt trong Row → dùng `weight(1f)` để
 * CHIA ĐỀU bề ngang hàng (JSX flex:1), rồi `aspectRatio(aspect)` suy CHIỀU CAO theo tỉ lệ art
 * (JSX img width:100% height:auto). Nhờ vậy 2 hàng luôn trải đúng contentW ở MỌI kích thước máy,
 * KHÔNG cần số cao "ma thuật" → co giãn tỉ lệ, không vỡ layout.
 * Nhấn nén scale .93 với ease nảy (JSX cubic-bezier(.34,1.56,.64,1) → spring nảy, đúng motion token
 * "gentle jelly bounce"). comingSoon = làm mờ + khoá bấm. Bóng đổ đã bake sẵn trong PNG (alpha).
 */
@Composable
private fun RowScope.IconButton(
    icon: Painter,
    contentDescription: String,
    aspect: Float,
    onClick: () -> Unit,
    comingSoon: Boolean = false,
) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (pressed) 0.93f else 1f,
        animationSpec = spring(dampingRatio = 0.55f, stiffness = Spring.StiffnessMediumLow),
        label = "iconPress",
    )
    Image(
        painter = icon,
        contentDescription = contentDescription,
        contentScale = ContentScale.Fit,
        modifier = Modifier
            .weight(1f)              // flex:1 → mỗi nút một phần bằng nhau của contentW
            .aspectRatio(aspect)     // cao = rộng / aspect (width:100% height:auto)
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
                alpha = if (comingSoon) 0.6f else 1f
            }
            .selectable(
                selected = false,
                enabled = !comingSoon,
                interactionSource = interaction,
                indication = null,
                onClick = onClick,
            ),
    )
}

// ── Cánh hoa bay ────────────────────────────────────────────────────────────────────────
// JSX Petals (count=24, seed=7): mỗi cánh RƠI dọc (-12%→112% màn) + trôi ngang `drift`, đồng
// thời ĐUNG ĐƯA + LỘN (translateX ±7px, rotate -32°→34°). Deterministic qua PRNG. Vẽ trong MỘT
// Canvas, path + brush tái dùng, frame loop withFrameNanos (redraw không recompose) — chống giật.

/** PRNG mulberry32 — khớp rng(seed) của JSX để phân bố cánh hoa trùng thiết kế. */
private class Mulberry32(private var seed: Int) {
    fun next(): Float {
        seed += 0x6D2B79F5
        var t = (seed xor (seed ushr 15)) * (seed or 1)
        t = (t + ((t xor (t ushr 7)) * (t or 61))) xor t
        return ((t xor (t ushr 14)).toLong() and 0xFFFFFFFFL).toFloat() / 4294967296f
    }
}

// 4 cặp màu cánh hoa (JSX PETAL_COLORS: đỉnh sáng → đáy đậm).
private val PetalColors = arrayOf(
    Color(0xFFFFFFFF) to Color(0xFFFBE7EF), // cúc trắng
    Color(0xFFFBD0DF) to Color(0xFFF7A9C0), // hồng
    Color(0xFFFFF1CE) to Color(0xFFFFE3A3), // vàng bơ
    Color(0xFFF7A9C0) to Color(0xFFE576A0), // hồng đậm
)

// World 2 · Rừng rậm — LÁ bay (xanh lá theo palette rừng, đỉnh sáng → đáy đậm).
private val LeafColors = arrayOf(
    Color(0xFFD8F0C0) to Color(0xFFA9D98A), // lá non
    Color(0xFFCBF2EB) to Color(0xFF5FC3B2), // mint (design)
    Color(0xFFBCE3A0) to Color(0xFF7FB069), // xanh lá
    Color(0xFFA3E5D9) to Color(0xFF4F9D5A), // rừng đậm
)

// World 3 · Sông & Thác — GIỌT/TIA nước bay (xanh nước theo palette info, đỉnh sáng → đáy đậm).
private val DropColors = arrayOf(
    Color(0xFFFFFFFF) to Color(0xFFC5E7EE), // bọt trắng
    Color(0xFFEAFAFB) to Color(0xFFB4E0EA), // nước sáng
    Color(0xFFD6EEF1) to Color(0xFF8FB6F2), // info xanh
    Color(0xFFCFEFF3) to Color(0xFFA6DCE5), // ngọc lam
)

/** Loại hạt bay trên Home theo world: cánh hoa (Đồng cỏ) · lá (Rừng) · giọt nước (Sông). */
private enum class HomeParticle { PETAL, LEAF, DROP }

private fun homeParticle(world: Int): HomeParticle = when (world) {
    2    -> HomeParticle.LEAF
    3    -> HomeParticle.DROP
    else -> HomeParticle.PETAL
}

/** 4 cặp màu gradient của hạt theo world (mọi mảng cùng cỡ 4 để [PetalSpec.colorIdx] hợp lệ). */
private fun homeParticleColors(kind: HomeParticle): Array<Pair<Color, Color>> = when (kind) {
    HomeParticle.LEAF -> LeafColors
    HomeParticle.DROP -> DropColors
    HomeParticle.PETAL -> PetalColors
}

// Dải cho phép cánh hoa bay — theo tỉ lệ ART (821×1916): DƯỚI logo (~.38), TRÊN panel (~.78).
// Cánh clamp cứng trong [BAND_TOP, BAND_BOT] → KHÔNG BAO GIỜ đè logo hay panel nút (user 01/07).
private const val BAND_TOP = 0.40f
private const val BAND_BOT = 0.76f

// Cánh hoa bay NGANG như gió thổi, đường đi BẤT ĐỊNH (2 dao động dọc lệch tần + gió giật ngang).
private class PetalSpec(
    val wBase: Float,      // rộng cánh (px baseline 360)
    val baseYFrac: Float,  // tâm dọc trong DẢI (0..1)
    val travelDur: Float,  // giây bay ngang trọn màn
    val delay: Float,      // âm → bắt đầu giữa chừng
    val colorIdx: Int,
    val dir: Float,        // +1 trái→phải, −1 phải→trái
    val wobAmp: Float,     // biên độ wander dọc (theo NỬA dải)
    val wobFreq1: Float, val wobPhase1: Float, // dao động dọc chính (chậm)
    val wobFreq2: Float, val wobPhase2: Float, // dao động dọc phụ (nhanh, nhỏ) → bất định
    val rotSpeed: Float,   // độ/giây lộn (theo gió)
    val gustAmp: Float, val gustFreq: Float, val gustPhase: Float, // gió giật ngang (px baseline 360)
)

private const val TAU = (2.0 * PI).toFloat()

/** Dựng [count] cánh hoa gió-thổi; PRNG Mulberry32 deterministic theo seed. */
private fun buildPetals(count: Int, seed: Int): List<PetalSpec> {
    val r = Mulberry32(seed)
    return List(count) {
        val w = 13f + r.next() * 13f
        val baseY = 0.06f + r.next() * 0.88f          // chừa mép để wander không vọt khỏi dải
        val travelDur = 3.5f + r.next() * 3f          // 3.5..6.5s (gió mạnh, bay nhanh)
        val delay = -r.next() * travelDur
        val colorIdx = floor(r.next() * PetalColors.size).toInt().coerceIn(0, PetalColors.size - 1)
        val dir = 1f                                  // CHỈ bay trái→phải (một chiều)
        val wobAmp = 0.10f + r.next() * 0.16f
        val wobFreq1 = 0.10f + r.next() * 0.12f
        val wobPhase1 = r.next() * TAU
        val wobFreq2 = 0.28f + r.next() * 0.30f
        val wobPhase2 = r.next() * TAU
        val rotSpeed = (if (r.next() < 0.5f) -1f else 1f) * (14f + r.next() * 30f)
        val gustAmp = 6f + r.next() * 12f
        val gustFreq = 0.10f + r.next() * 0.14f
        val gustPhase = r.next() * TAU
        PetalSpec(
            w, baseY, travelDur, delay, colorIdx, dir,
            wobAmp, wobFreq1, wobPhase1, wobFreq2, wobPhase2,
            rotSpeed, gustAmp, gustFreq, gustPhase,
        )
    }
}

// Nửa-kích thước cánh trong không gian đơn vị (rộng 1 → halfW .5; cao 1.35 → halfH .675).
private const val PETAL_HALF_W = 0.5f
private const val PETAL_HALF_H = 0.675f

/** Cánh hoa đơn vị: bo góc 52/52/52/8% (JSX border-radius) → 3 góc tròn + 1 góc nhọn (BL). */
private fun unitPetalPath(): Path = Path().apply {
    val rect = Rect(-PETAL_HALF_W, -PETAL_HALF_H, PETAL_HALF_W, PETAL_HALF_H)
    val round = CornerRadius(0.5f, 0.5f)   // 52% ~ bo gần tròn
    val sharp = CornerRadius(0.08f, 0.108f) // 8% (theo rộng/cao) → góc nhọn
    addRoundRect(
        RoundRect(
            rect = rect,
            topLeft = round, topRight = round,
            bottomRight = round, bottomLeft = sharp,
        ),
    )
}

/** LÁ đơn vị (World 2): hình lá thuôn nhọn 2 đầu (hai cung quад) hơi lệch → dáng lá tự nhiên. */
private fun unitLeafPath(): Path = Path().apply {
    val w = PETAL_HALF_W * 0.86f
    moveTo(0f, -PETAL_HALF_H)                                   // ngọn trên
    quadraticBezierTo(w, -PETAL_HALF_H * 0.10f, 0.06f, PETAL_HALF_H)  // mép phải phình xuống cuống
    quadraticBezierTo(-w, PETAL_HALF_H * 0.10f, 0f, -PETAL_HALF_H)    // mép trái về ngọn
    close()
}

/** GIỌT nước đơn vị (World 3): teardrop — đỉnh nhọn, đáy tròn (giống ô đích giọt nước in-game). */
private fun unitDropPath(): Path = Path().apply {
    val w = PETAL_HALF_W * 0.82f
    moveTo(0f, -PETAL_HALF_H)                                   // đỉnh nhọn
    cubicTo(w, -PETAL_HALF_H * 0.15f, w, PETAL_HALF_H * 0.55f, 0f, PETAL_HALF_H)   // phải xuống đáy tròn
    cubicTo(-w, PETAL_HALF_H * 0.55f, -w, -PETAL_HALF_H * 0.15f, 0f, -PETAL_HALF_H) // trái về đỉnh
    close()
}

private fun unitParticlePath(kind: HomeParticle): Path = when (kind) {
    HomeParticle.LEAF -> unitLeafPath()
    HomeParticle.DROP -> unitDropPath()
    HomeParticle.PETAL -> unitPetalPath()
}

@Composable
private fun PetalLayer(world: Int, artHeightPx: Float, modifier: Modifier = Modifier) {
    val petals = remember { buildPetals(count = 12, seed = 7) }
    // Hình + màu hạt đổi theo world: cánh hoa (Đồng cỏ) · lá (Rừng) · giọt nước (Sông).
    val kind = homeParticle(world)
    val petal = remember(kind) { unitParticlePath(kind) }
    // Brush gradient đơn-vị cho 4 cặp màu (đỉnh sáng → đáy đậm); toạ độ theo trục hạt, CTM sẽ
    // scale theo hạt khi vẽ → không cấp phát mỗi frame.
    val brushes = remember(kind) {
        homeParticleColors(kind).map { (c1, c2) ->
            Brush.verticalGradient(listOf(c1, c2), startY = -PETAL_HALF_H, endY = PETAL_HALF_H)
        }
    }

    var startNanos by remember { mutableLongStateOf(0L) }
    var nowNanos by remember { mutableLongStateOf(0L) }
    LaunchedEffect(Unit) {
        while (true) {
            withFrameNanos { t ->
                if (startNanos == 0L) startNanos = t
                nowNanos = t
            }
        }
    }

    Canvas(modifier = modifier) {
        val elapsed = if (startNanos == 0L) 0f else (nowNanos - startNanos) / 1_000_000_000f
        val unit = size.width / 360f // px trên 1 đơn vị dp-baseline-360
        // Dải bay: map tỉ lệ ART → màn (art neo đáy → đỉnh art ở y âm khi art cao hơn màn).
        val artTop = size.height - artHeightPx
        val bandTop = artTop + BAND_TOP * artHeightPx
        val bandBot = artTop + BAND_BOT * artHeightPx
        val bandHalf = (bandBot - bandTop) / 2f
        val marginX = size.width * 0.10f              // vào/ra ngoài mép ngang
        for (s in petals) {
            // Tiến trình bay ngang p ∈ [0,1): (elapsed - delay)/travelDur, delay âm → giữa chừng.
            val phase = (elapsed - s.delay) / s.travelDur
            val p = phase - floor(phase)
            // x: đi ngang trọn màn theo hướng gió (dir), vào/ra khỏi mép; cộng gió giật ngang.
            val startX = if (s.dir > 0f) -marginX else size.width + marginX
            val endX = if (s.dir > 0f) size.width + marginX else -marginX
            var px = startX + (endX - startX) * p
            px += s.gustAmp * unit * sin(TAU * s.gustFreq * elapsed + s.gustPhase)
            // y: tâm trong dải + WANDER bất định (2 sine lệch tần), CLAMP cứng trong dải.
            val baseY = bandTop + s.baseYFrac * (bandBot - bandTop)
            val wob = sin(TAU * s.wobFreq1 * elapsed + s.wobPhase1) +
                0.5f * sin(TAU * s.wobFreq2 * elapsed + s.wobPhase2)
            val py = (baseY + wob * s.wobAmp * bandHalf).coerceIn(bandTop, bandBot)
            // opacity: hiện dần ở mép vào (0..8%), mờ dần ở mép ra (90..100%).
            val alpha = when {
                p < 0.08f -> p / 0.08f
                p > 0.90f -> (1f - p) / 0.10f
                else -> 1f
            }
            if (alpha <= 0.01f) continue
            val rot = s.rotSpeed * elapsed                // lộn chậm theo gió
            val half = s.wBase * unit / 2f
            withTransform({
                translate(px, py)
                rotate(rot, pivot = Offset.Zero)
                scale(half, half, pivot = Offset.Zero)
            }) {
                drawPath(petal, brush = brushes[s.colorIdx], alpha = alpha.coerceIn(0f, 1f))
            }
        }
    }
}

// ── Preview ──────────────────────────────────────────────────────────────────────────────

@Preview(name = "Home (world-1 bg)", widthDp = 360, heightDp = 800)
@Composable
private fun HomeScreenPreview() {
    GravityJellyTheme {
        HomeScreen(
            onPlayEndless = {},
            onSettings = {},
            onHandbook = {},
        )
    }
}
