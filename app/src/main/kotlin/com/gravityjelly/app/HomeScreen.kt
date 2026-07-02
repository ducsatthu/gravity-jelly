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
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
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
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import kotlin.math.PI
import kotlin.math.floor
import kotlin.math.sin

/**
 * Màn Home — RE-SKIN 01/07 sang nền **`home_world_1_bg.png`** + **menu icon PNG**
 * (design/04-screens/home-screen.jsx, bản mới).
 *
 *  · Nền tranh vẽ `home_world_1_bg.png` (821×1916): trời + LOGO + bàn cỏ + **panel kem trống**
 *    ở đáy để chứa menu. Neo ĐÁY full-width; phần dư phía trên là trời (lấp bằng [SkyTop]).
 *  · **Menu icon 2 hàng** đặt trong panel kem (JSX: left/right 12%, top 77.5%, bottom 4.9%):
 *      – Hàng trên (to, h=18.4cqw): CHIẾN DỊCH · ENDLESS (2 nút chơi chính).
 *      – Hàng dưới (nhỏ, h=15.2cqw): CẨM NANG · BẢNG XẾP HẠNG · CÀI ĐẶT.
 *    Mỗi nút là 1 ảnh PNG tự chứa (khung + icon), cao theo cqw, rộng theo tỉ lệ art, nhấn nén .93.
 *  · **Cánh hoa bay** ([PetalLayer]) trôi khắp màn (JSX Petals count=24 seed=7, zIndex 3 → đè
 *    lên cả menu). Ẩn khi reduced-motion (JSX @media reduced → opacity 0).
 *  · **KHÔNG HUD trên** (user 01/07: bỏ chip KỶ LỤC; hearts/life của JSX cũng không dựng).
 *
 * CHIẾN DỊCH + BẢNG XẾP HẠNG chưa có màn → coi là "sắp có": làm mờ (alpha .6) + khoá bấm
 * (design Button: coming-soon = dimmed). Sparkle của bản cũ đã GỠ (JSX comment: nền mới chưa
 * có landmark tương ứng).
 */
@Composable
fun HomeScreen(
    onPlayEndless: () -> Unit,
    onSettings: () -> Unit,
    onPlayCampaign: () -> Unit = {},
    onHandbook: () -> Unit = {},
    reducedMotion: Boolean = false,
    modifier: Modifier = Modifier,
) {
    // Nền trời lấp dải trên ảnh (đỉnh home_world_1_bg ~ #8ECDF3, khớp gradient trời JSX).
    Box(modifier = modifier.fillMaxSize().background(SkyTop)) {
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
                painter            = painterResource(R.drawable.home_world_1_bg),
                contentDescription = "Gravity Jelly",
                modifier           = Modifier.fillMaxSize(),
                contentScale       = ContentScale.Crop,
                alignment          = Alignment.BottomCenter,
            )

            // ── Cánh hoa bay NGANG trong dải giữa (dưới logo, trên panel) — vẽ TRƯỚC menu để
            // KHÔNG đè lên nút (user 01/07). Ẩn khi reduced-motion.
            if (!reducedMotion) {
                PetalLayer(artHeightPx = artHpx, modifier = Modifier.fillMaxSize())
            }

            // ── Menu icon trong panel kem (JSX: khối left 12% right 12% top 77.5% bottom 4.9%) ──
            HomeMenu(
                boxW = boxW, imgH = imgH,
                onCampaign = onPlayCampaign,    // prototype đã mở
                onPlay = onPlayEndless,
                onGuide = onHandbook,
                onLeaderboard = {},            // SẮP CÓ (dimmed + khoá)
                onSettings = onSettings,
            )
        }
    }
}

// Tỉ lệ ảnh nền home_world_1_bg.png (821×1916) — cao/rộng.
private const val HOME_AR = 1916f / 821f

// Trời ở đỉnh ảnh (gradient JSX #8ecdf3 → #bce5fb, lấy điểm đỉnh).
private val SkyTop = Color(0xFF8ECDF3)

// Tỉ lệ RỘNG/CAO từng icon PNG (px nguồn) — width = height × aspect.
private const val AR_CAMPAIGN = 1113f / 772f
private const val AR_INFINITE = 1071f / 762f
private const val AR_GUIDE = 1136f / 877f
private const val AR_LEADER = 1036f / 876f
private const val AR_SETTING = 972f / 1007f

// ── Menu 2 hàng trong panel kem ────────────────────────────────────────────────────────
// JSX: khối menu absolute (left 12%, right 12%, top 77.5%, bottom 4.9% của stage), column
// canh giữa, gap 2cqw. cqw = 1% bề rộng stage = boxW/100. Chiều cao icon theo cqw; hàng trên
// 18.4cqw, hàng dưới 15.2cqw; gap hàng trên 4cqw, hàng dưới 3.5cqw.
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
    val panelW = boxW * 0.76f            // left 12% + right 12%
    val panelH = imgH * (1f - 0.775f - 0.049f) // top 77.5% → bottom 4.9%
    val panelBottomUp = imgH * 0.049f     // đáy panel cách đáy stage 4.9%

    Box(
        modifier = Modifier
            .align(Alignment.BottomStart)
            .offset(x = boxW * 0.12f, y = -panelBottomUp)
            .size(width = panelW, height = panelH),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(cqw * 2f),
        ) {
            // Hàng trên — 2 nút chơi chính (to hơn).
            Row(
                horizontalArrangement = Arrangement.spacedBy(cqw * 4f),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(
                    icon = painterResource(R.drawable.btn_campaign), contentDescription = "Chiến dịch",
                    heightDp = cqw * 18.4f, aspect = AR_CAMPAIGN, onClick = onCampaign,
                )
                IconButton(
                    icon = painterResource(R.drawable.btn_infinite), contentDescription = "Chơi Endless",
                    heightDp = cqw * 18.4f, aspect = AR_INFINITE, onClick = onPlay,
                )
            }
            // Hàng dưới — phụ trợ (nhỏ hơn).
            Row(
                horizontalArrangement = Arrangement.spacedBy(cqw * 3.5f),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(
                    icon = painterResource(R.drawable.btn_guide), contentDescription = "Cẩm nang",
                    heightDp = cqw * 15.2f, aspect = AR_GUIDE, onClick = onGuide,
                )
                IconButton(
                    icon = painterResource(R.drawable.btn_leaderboard), contentDescription = "Bảng xếp hạng",
                    heightDp = cqw * 15.2f, aspect = AR_LEADER, comingSoon = true, onClick = onLeaderboard,
                )
                IconButton(
                    icon = painterResource(R.drawable.btn_setting), contentDescription = "Cài đặt",
                    heightDp = cqw * 15.2f, aspect = AR_SETTING, onClick = onSettings,
                )
            }
        }
    }
}

/**
 * Nút icon PNG (JSX IconButton): ảnh tự chứa (khung + icon), cao [heightDp], rộng theo tỉ lệ
 * art [aspect]. Nhấn nén scale .93 với ease nảy (JSX cubic-bezier(.34,1.56,.64,1) → spring nảy,
 * đúng motion token "gentle jelly bounce"). comingSoon = làm mờ + khoá bấm (design coming-soon).
 * Bóng đổ đã bake sẵn trong PNG (alpha), nên không thêm shadow chữ nhật giả.
 */
@Composable
private fun IconButton(
    icon: Painter,
    contentDescription: String,
    heightDp: Dp,
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
            .height(heightDp)
            .width(heightDp * aspect)
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

@Composable
private fun PetalLayer(artHeightPx: Float, modifier: Modifier = Modifier) {
    val petals = remember { buildPetals(count = 12, seed = 7) }
    val petal = remember { unitPetalPath() }
    // Brush gradient đơn-vị cho 4 cặp màu (đỉnh sáng → đáy đậm); toạ độ theo trục cánh, CTM sẽ
    // scale theo cánh khi vẽ → không cấp phát mỗi frame.
    val brushes = remember {
        PetalColors.map { (c1, c2) ->
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
