package com.gravityjelly.app.ui.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.R
import com.gravityjelly.core.BossTell
import com.gravityjelly.core.BossTellKind
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjBodyFontFamily
import com.gravityjelly.app.ui.theme.GjDisplayFontFamily
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace

/**
 * **BossHud / BossCard** — cụm boss casual (KHÔNG phải HUD combat/RPG), bám 1:1
 * `design/.../03-components/09-boss-hud/BossHud.jsx` (bản redesign 03/07) + card `boss-hud.card.html`.
 *
 * Dùng **BossCard** — thẻ compact in-game đặt vào slot `objective` (dưới HUD 56dp, trên bàn) ở các màn
 * BOSS (L10/L20/L30…), thay cho [ObjectiveBar]. Mỗi boss có silhouette RIÊNG vẽ từ PNG art (mắt-only,
 * KHÔNG miệng/lông mày) trong `06-svg-assets/bosses/` → app copy sang `res/drawable-nodpi/boss_*.png`.
 * Tiến độ = thanh **Khiên** (KHÔNG phải máu/tim); chữ dùng "phá khiên" (KHÔNG "gây sát thương").
 * Tím (#7E6CF0) CHỈ dùng làm viền/quầng/hairline — không tô kín panel.
 *
 * Bố cục (theo BossHud.jsx BossCard): mascot tràn TRÁI (rộng ~118dp) · nhãn `MÀN n` góc phải-trên ·
 * tên boss · thanh Khiên + số `Khiên cur/tgt` · chip luật/cảnh-báo. Radius xl(28), viền tím mảnh,
 * bóng cocoa mềm (shadow lg), minHeight ~118dp.
 *
 * Số liệu sống truyền từ holder: [shieldCurrent] = khiên CÒN LẠI (bossHpMax − damage), [shieldTarget] =
 * bossHpMax. Khiên vỡ dần → thanh rút về 0 khi hạ boss.
 */

/** 3 boss theo world: W1 = Chú Sâu Đồng Cỏ (mint) · W2 = Thần Rừng (forest) · W3 = Thần Thác (xanh). */
enum class BossKind { WORM, FOREST, WATER }

fun bossKindForWorld(world: Int): BossKind = when (world) {
    2 -> BossKind.FOREST
    3 -> BossKind.WATER
    else -> BossKind.WORM
}

// W2 = boss "Thần Rừng" (spawn dây leo) — khớp tell "Mọc dây" của :core.
@androidx.annotation.StringRes
fun bossNameResForWorld(world: Int): Int = when (world) {
    2 -> R.string.boss_name_forest
    3 -> R.string.boss_name_water
    else -> R.string.boss_name_worm
}

private data class BossTheme(val color: Color, val edge: Color, val asset: Int, val aura: Boolean)

private fun themeFor(kind: BossKind): BossTheme = when (kind) {
    BossKind.WORM -> BossTheme(GjPalette.BlockMint, GjPalette.BlockMintEdge, R.drawable.boss_worm, aura = true)
    // Thần Rừng: mascot boss_forest (thần rừng thân cây + vương miện lá). Màu thẻ theo design (nâu ấm).
    BossKind.FOREST -> BossTheme(Color(0xFFD9BE94), Color(0xFFB79A6E), R.drawable.boss_forest, aura = false)
    BossKind.WATER -> BossTheme(GjPalette.BlockBlue, GjPalette.BlockBlueEdge, R.drawable.boss_water, aura = true)
}

/**
 * Thẻ boss compact in-game.
 *
 * @param level số màn (10/20/30…).
 * @param name tên hiển thị boss.
 * @param kind loại boss (quyết định mascot + màu thanh khiên).
 * @param shieldCurrent khiên còn lại (0 = đã hạ boss).
 * @param shieldTarget tổng khiên tối đa.
 * @param tell cảnh báo boss SẮP ra chiêu (W2 mọc dây · W3 đảo trọng lực) + đếm ngược. null → hiện chip
 *   CẨM NANG "cách phá khiên" ([ruleLabel]); khác null → hiện chip CẢNH BÁO (điều boss sắp làm).
 * @param ruleLabel nhãn chip CẨM NANG "cách phá khiên" (mặc định "Combo ×2 phá khiên").
 */
@Composable
fun BossCard(
    level: Int,
    name: String,
    kind: BossKind,
    shieldCurrent: Int,
    shieldTarget: Int,
    modifier: Modifier = Modifier,
    tell: BossTell? = null,
    ruleLabel: String = stringResource(R.string.boss_rule_default),
    liveStars: LiveStars? = null,
) {
    val theme = themeFor(kind)
    Box(
        modifier = modifier
            .fillMaxWidth()
            .shadow(12.dp, RoundedCornerShape(GjRadius.xl), clip = false,
                ambientColor = GjPalette.ShadowKey, spotColor = GjPalette.ShadowKey)
            .clip(RoundedCornerShape(GjRadius.xl))
            .background(GjPalette.Surface)
            .border(1.5.dp, GjPalette.Gravity.copy(alpha = 0.22f), RoundedCornerShape(GjRadius.xl))
            // Cao TỐI THIỂU 118dp, CO GIÃN theo nội dung (design minHeight:118) — chip/nội dung không bị bó.
            // Mascot có CHIỀU CAO CỐ ĐỊNH (không fillMaxHeight) nên thẻ KHÔNG giãn vô hạn đẩy mất bàn.
            .heightIn(min = 118.dp),
    ) {
        // Mascot tràn trái — vùng 118×118dp cố định, PNG canh giữa theo chiều cao thẻ (BossHud.jsx BossMascot).
        BossMascot(
            kind = kind,
            asset = theme.asset,
            aura = theme.aura,
            modifier = Modifier
                .align(Alignment.CenterStart)
                .width(118.dp)
                .height(118.dp),
        )
        // Nhãn MÀN n góc phải-trên.
        LevelBadge(
            level = level,
            modifier = Modifier.align(Alignment.TopEnd).padding(top = 12.dp, end = 14.dp),
        )
        // Cột nội dung: tên · thanh Khiên · chip luật.
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 120.dp, end = 16.dp, top = 14.dp, bottom = 14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Text(
                text = name,
                modifier = Modifier.padding(end = 52.dp),
                maxLines = 1,
                style = androidx.compose.ui.text.TextStyle(
                    fontFamily = GjDisplayFontFamily, fontWeight = FontWeight.Bold,
                    fontSize = 18.sp, color = GjPalette.Text, lineHeight = 1.08.em,
                ),
            )
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                ShieldBar(
                    modifier = Modifier.weight(1f),
                    current = shieldCurrent, target = shieldTarget,
                    color = theme.color, edge = theme.edge,
                )
                ShieldCount(current = shieldCurrent, target = shieldTarget)
            }
            if (tell != null) TellChip(tell) else RuleChip(label = ruleLabel)
            if (liveStars != null) StripFooter(liveStars)
        }
    }
}

/**
 * **BossIntroCard** — thẻ LỚN trước màn boss (bám BossHud.jsx BossIntroCard): tag BOSS + `MÀN n` ·
 * mascot lớn + "ĐỐI THỦ" + tên · thanh Khiên (đầy) + `Khiên n/n` · chip luật/cảnh-báo · (slot [extra]
 * cho dải sao + ngân sách xoay của màn Intro) · CTA "Chơi".
 *
 * @param shieldTarget tổng khiên (preview đầy: current = target).
 * @param tell tell boss (W2/W3) → chip CẢNH BÁO; null → chip CẨM NANG [ruleLabel].
 * @param extra slot chèn thêm (dải sao / ngân sách xoay) giữa chip và CTA.
 */
@Composable
fun BossIntroCard(
    level: Int,
    name: String,
    kind: BossKind,
    shieldTarget: Int,
    onPlay: () -> Unit,
    modifier: Modifier = Modifier,
    tell: BossTell? = null,
    ruleLabel: String = stringResource(R.string.boss_rule_default),
    playLabel: String = stringResource(R.string.boss_play),
    extra: (@Composable ColumnScope.() -> Unit)? = null,
) {
    val theme = themeFor(kind)
    Column(
        modifier = modifier
            .fillMaxWidth()
            .shadow(12.dp, RoundedCornerShape(GjRadius.xl), clip = false,
                ambientColor = GjPalette.ShadowKey, spotColor = GjPalette.ShadowKey)
            .clip(RoundedCornerShape(GjRadius.xl))
            .background(GjPalette.Surface)
            .border(1.5.dp, GjPalette.Gravity.copy(alpha = 0.30f), RoundedCornerShape(GjRadius.xl))
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            BossTag()
            Text(
                stringResource(R.string.boss_level, level),
                style = MaterialTheme.typography.labelSmall.copy(
                    color = GjPalette.TextMuted, fontWeight = FontWeight.ExtraBold, letterSpacing = 0.04.em,
                ),
            )
        }
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(14.dp)) {
            BossMascot(kind = kind, asset = theme.asset, aura = theme.aura,
                modifier = Modifier.height(120.dp).width(120.dp))
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    stringResource(R.string.boss_opponent),
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = GjPalette.TextMuted, fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 0.04.em, fontSize = 10.sp,
                    ),
                )
                Text(
                    name,
                    style = androidx.compose.ui.text.TextStyle(
                        fontFamily = GjDisplayFontFamily, fontWeight = FontWeight.Bold,
                        fontSize = 22.sp, color = GjPalette.Text, lineHeight = 1.1.em,
                    ),
                )
            }
        }
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            ShieldBar(Modifier.weight(1f), current = shieldTarget, target = shieldTarget,
                color = theme.color, edge = theme.edge)
            ShieldCount(current = shieldTarget, target = shieldTarget)
        }
        if (tell != null) TellChip(tell) else RuleChip(label = ruleLabel)
        extra?.invoke(this)
        GjButton(onClick = onPlay, variant = BtnVariant.Primary, btnSize = BtnSize.Cta,
            fullWidth = true, icon = GjIcons.Play) { Text(playLabel) }
    }
}

/* ── mascot PNG (mắt-only) + quầng tím/cyan mờ ──────────────────────────────────── */

@Composable
private fun BossMascot(kind: BossKind, asset: Int, aura: Boolean, modifier: Modifier = Modifier) {
    val bob = rememberInfiniteTransition(label = "boss-bob")
    val dy by bob.animateFloat(
        initialValue = 0f, targetValue = -4f,
        animationSpec = infiniteRepeatable(tween(1400), RepeatMode.Reverse),
        label = "dy",
    )
    Box(modifier, contentAlignment = Alignment.Center) {
        if (aura) {
            Box(
                Modifier
                    .size(96.dp)
                    .clip(RoundedCornerShape(GjRadius.full))
                    .background(
                        Brush.radialGradient(
                            listOf(GjPalette.Gravity.copy(alpha = 0.16f), Color.Transparent),
                        ),
                    ),
            )
        }
        Image(
            painter = painterResource(asset),
            contentDescription = null,
            contentScale = ContentScale.Fit,
            modifier = Modifier
                .fillMaxHeight()
                .padding(vertical = 4.dp)
                .graphicsLayer { translationY = dy * density },
        )
    }
}

/* ── thanh Khiên (ShieldBar) — track chìm, fill theme boss, rút về khi vỡ ────────── */

@Composable
private fun ShieldBar(modifier: Modifier = Modifier, current: Int, target: Int, color: Color, edge: Color) {
    val pct = if (target > 0) (current.toFloat() / target).coerceIn(0f, 1f) else 0f
    Box(
        modifier
            .height(8.dp)
            .clip(RoundedCornerShape(GjRadius.full))
            .background(GjPalette.SurfaceSunken),
    ) {
        Box(
            Modifier
                .fillMaxWidth(pct)
                .height(8.dp)
                .clip(RoundedCornerShape(GjRadius.full))
                .background(
                    Brush.verticalGradient(
                        listOf(mix(color, Color.White, 0.28f), edge),
                    ),
                ),
        )
    }
}

@Composable
private fun ShieldCount(current: Int, target: Int) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
            stringResource(R.string.boss_shield),
            style = MaterialTheme.typography.labelSmall.copy(
                color = GjPalette.TextMuted, fontWeight = FontWeight.Bold,
            ),
        )
        Row(verticalAlignment = Alignment.Bottom) {
            Text(
                "$current",
                style = androidx.compose.ui.text.TextStyle(
                    fontFamily = GjDisplayFontFamily, fontWeight = FontWeight.Bold,
                    fontSize = 14.sp, color = GjPalette.Text, lineHeight = 1.05.em,
                ),
            )
            Text(
                "/$target",
                style = androidx.compose.ui.text.TextStyle(
                    fontFamily = GjDisplayFontFamily, fontWeight = FontWeight.Bold,
                    fontSize = 12.sp, color = GjPalette.TextMuted, lineHeight = 1.05.em,
                ),
            )
        }
    }
}

/* ── nhãn MÀN n ─────────────────────────────────────────────────────────────────── */

@Composable
private fun LevelBadge(level: Int, modifier: Modifier = Modifier) {
    Box(
        modifier
            .clip(RoundedCornerShape(GjRadius.full))
            .background(GjPalette.SurfaceSunken)
            .padding(horizontal = 9.dp, vertical = 3.dp),
    ) {
        Text(
            stringResource(R.string.boss_level, level),
            style = MaterialTheme.typography.labelSmall.copy(
                color = GjPalette.TextMuted, fontWeight = FontWeight.ExtraBold,
                letterSpacing = 0.04.em, fontSize = 10.sp,
            ),
        )
    }
}

/* ── tag BOSS (design BossHud.jsx BossTag) — pill tím + chấm trắng nhấp nháy ── */

@Composable
private fun BossTag() {
    val glow = rememberInfiniteTransition(label = "boss-tag")
    val a by glow.animateFloat(
        initialValue = 0.35f, targetValue = 0.8f,
        animationSpec = infiniteRepeatable(tween(800), RepeatMode.Reverse),
        label = "a",
    )
    Row(
        Modifier
            .clip(RoundedCornerShape(GjRadius.full))
            .background(GjPalette.Gravity)
            .padding(horizontal = 11.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(5.dp),
    ) {
        Box(Modifier.size(6.dp).clip(RoundedCornerShape(GjRadius.full)).background(Color.White.copy(alpha = a)))
        Text(
            stringResource(R.string.boss_tag),
            style = MaterialTheme.typography.labelSmall.copy(
                color = Color.White, fontWeight = FontWeight.ExtraBold, letterSpacing = 0.04.em, fontSize = 11.sp,
            ),
        )
    }
}

/* ── chip boss dùng chung — THIẾT KẾ MỚI: BỎ chữ kicker (CẨM NANG/CẢNH BÁO) ──────────
 * Chỉ đĩa + nhãn. Rule: nền chìm + đĩa tím nhạt (icon ×2). Tell: nền tone + đĩa đặc +
 * CHẤM ĐỎ nhấp nháy góc đĩa (thay chữ "CẢNH BÁO", báo "boss sắp ra chiêu"). Bỏ kicker →
 * nhãn dư chỗ, HẾT cắt ngang. Nhãn vẫn tự thu nhỏ (đo TextMeasurer) phòng máy rất hẹp;
 * lineHeight 1.25em đủ chỗ dấu tiếng Việt. Bám design/.../BossHud.jsx `Chip` (role rule/tell). */
@Composable
private fun BossChip(
    bg: Color,
    discBg: Color,
    labelColor: Color,
    label: String,
    dot: Boolean,
    discIcon: @Composable () -> Unit,
) {
    val measurer = rememberTextMeasurer()
    val density = LocalDensity.current
    // Ép fillMaxWidth để ĐO ĐÚNG bề rộng cột (constraints.maxWidth = bề rộng thật, không bị wrap-content
    // báo nhỏ như bản trước). Pill BÊN TRONG vẫn wrap-content (ôm chữ) như thiết kế, neo trái.
    BoxWithConstraints(Modifier.fillMaxWidth()) {
        val maxWpx = constraints.maxWidth.toFloat()
        // Chỗ nhãn còn lại = cột − padding(4+12) − đĩa(20) − gap(7) − 6dp thở (tránh sát mép rounded).
        val availPx = (maxWpx - with(density) { (4 + 12 + 20 + 7 + 6).dp.toPx() }).coerceAtLeast(1f)
        val availDp = with(density) { availPx.toDp() }
        val labelSp = remember(label, availPx) {
            var s = 12f
            while (s > 10f) {
                val w = measurer.measure(
                    AnnotatedString(label),
                    TextStyle(fontFamily = GjBodyFontFamily, fontWeight = FontWeight.Bold, fontSize = s.sp),
                ).size.width
                if (w <= availPx) break
                s -= 0.5f
            }
            s
        }
        Row(
            Modifier
                .clip(RoundedCornerShape(GjRadius.full))
                .background(bg)
                .padding(start = 4.dp, end = 12.dp, top = 4.dp, bottom = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(7.dp),
        ) {
            Box(contentAlignment = Alignment.Center) {
                Box(
                    Modifier.size(20.dp).clip(RoundedCornerShape(GjRadius.full)).background(discBg),
                    contentAlignment = Alignment.Center,
                ) { discIcon() }
                if (dot) {
                    // Chấm đỏ nhấp nháy (opacity 0.35↔0.85, 1400ms) — BossHud.jsx tell dot.
                    val trans = rememberInfiniteTransition(label = "bossDot")
                    val a by trans.animateFloat(
                        initialValue = 0.35f, targetValue = 0.85f,
                        animationSpec = infiniteRepeatable(tween(1400), RepeatMode.Reverse), label = "dotAlpha",
                    )
                    Box(
                        Modifier
                            .align(Alignment.TopEnd)
                            .offset(x = 1.5.dp, y = (-1.5).dp)
                            .graphicsLayer { alpha = a }
                            .size(7.dp)
                            .clip(RoundedCornerShape(GjRadius.full))
                            .background(GjPalette.Danger)
                            .border(1.5.dp, GjPalette.Surface, RoundedCornerShape(GjRadius.full)),
                    )
                }
            }
            // widthIn(max) = chặn CỨNG: nhãn không vượt bề rộng còn lại → pill ôm chữ mà KHÔNG tràn/cắt.
            Text(
                label, maxLines = 1, softWrap = false,
                modifier = Modifier.widthIn(max = availDp),
                style = TextStyle(
                    fontFamily = GjBodyFontFamily, fontWeight = FontWeight.Bold,
                    fontSize = labelSp.sp, color = labelColor, lineHeight = 1.25.em,
                ),
            )
        }
    }
}

/* ── rule (CẨM NANG) — nền chìm, đĩa tím nhạt icon ×2; KHÔNG chữ, KHÔNG chấm ── */
@Composable
private fun RuleChip(label: String) {
    BossChip(
        bg = GjPalette.SurfaceSunken,
        discBg = GjPalette.Gravity.copy(alpha = 0.14f),
        labelColor = GjPalette.Text,
        label = label,
        dot = false,
    ) { GjIcon(GjIcons.X2, modifier = Modifier.size(12.dp), tint = GjPalette.GravityEdge) }
}

/* ── tell (boss sắp ra chiêu) — nền tone, đĩa đặc + CHẤM ĐỎ nhấp nháy thay chữ ── */
@Composable
private fun TellChip(tell: BossTell) {
    val gravityTone = tell.kind == BossTellKind.GRAVITY_INVERT
    // tone theo BossHud.jsx chipTone: gravity = tím · vine(leaf) = warm amber.
    val bg = if (gravityTone) GjPalette.Gravity.copy(alpha = 0.12f) else GjPalette.Warning.copy(alpha = 0.20f)
    val fg = if (gravityTone) GjPalette.GravityEdge else Color(0xFF9A7326)
    val disc = if (gravityTone) GjPalette.Gravity else GjPalette.Warning
    val discFg = if (gravityTone) Color.White else Color(0xFF5B4636)
    BossChip(
        bg = bg,
        discBg = disc,
        labelColor = fg,
        label = tellLabel(tell),
        dot = true,
    ) {
        if (gravityTone) GjIcon(GjIcons.RotateCw, modifier = Modifier.size(12.dp), tint = discFg)
        else LeafGlyph(discFg)
    }
}

/** Nhãn tell: "Lượt sau: …" khi còn 1 lượt, else "Sau N lượt: …". Chiêu theo [BossTellKind]. */
@Composable
private fun tellLabel(tell: BossTell): String {
    val what = when (tell.kind) {
        BossTellKind.VINE_SPAWN -> stringResource(R.string.boss_tell_vine_spawn)
        BossTellKind.GRAVITY_INVERT -> stringResource(R.string.boss_tell_gravity_invert)
        BossTellKind.SOURCE_REVIVE -> stringResource(R.string.boss_tell_source_revive)
    }
    val prefix = if (tell.turnsUntil <= 1) stringResource(R.string.boss_tell_next_turn)
        else stringResource(R.string.boss_tell_after_turns, tell.turnsUntil)
    return stringResource(R.string.boss_tell_format, prefix, what)
}

/** Lá (design BossHud.jsx Glyph "leaf") — chiêu mọc dây W2. */
@Composable
private fun LeafGlyph(color: Color) {
    Canvas(Modifier.size(12.dp)) {
        val u = size.width / 24f
        // M5 19c0-8 6-13 14-14 1 8-5 14-14 14z  +  gân M6 18c3-5 6-7 9-8
        val body = Path().apply {
            moveTo(5 * u, 19 * u)
            cubicTo(5 * u, 11 * u, 11 * u, 6 * u, 19 * u, 5 * u)
            cubicTo(20 * u, 13 * u, 13 * u, 19 * u, 5 * u, 19 * u)
            close()
        }
        drawPath(body, color, style = Stroke(width = 2.4f * u, join = StrokeJoin.Round))
        val vein = Path().apply {
            moveTo(6 * u, 18 * u)
            cubicTo(9 * u, 13 * u, 12 * u, 11 * u, 15 * u, 10 * u)
        }
        drawPath(vein, color, style = Stroke(width = 2.4f * u, cap = StrokeCap.Round, join = StrokeJoin.Round))
    }
}

/** Trộn 2 màu tuyến tính (color-mix in srgb) cho gradient thanh khiên. */
private fun mix(a: Color, b: Color, t: Float): Color = Color(
    red = a.red * (1 - t) + b.red * t,
    green = a.green * (1 - t) + b.green * t,
    blue = a.blue * (1 - t) + b.blue * t,
    alpha = a.alpha * (1 - t) + b.alpha * t,
)
