package com.gravityjelly.app.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjDisplayFontFamily
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.core.Goal
import com.gravityjelly.core.GoalType
import com.gravityjelly.core.TriggerKind

/**
 * **ObjectiveBar** — cụm "mình cần làm gì" luôn hiển thị, đặt NGAY DƯỚI HUD 56dp và TRÊN bàn 9×9
 * (chỉ dùng cho chế độ Campaign — Endless không có mục tiêu). Bám 1:1
 * `design/.../03-components/08-objective-bar/ObjectiveBar.jsx` + card `screen-1e-game-objective`.
 *
 * **CHẤM SAO THỐNG NHẤT THEO NƯỚC (số nước)** cho MỌI màn (design mới bỏ chấm-theo-điểm): badge
 * MÀN neo trái + dải 3 sao sống ở footer. Điểm chỉ còn là điều kiện THẮNG, không chấm sao nữa.
 * Một cụm, chuyển nhánh theo [Goal.type] — số liệu sống truyền từ holder:
 * - **TUTORIAL** → glyph cơ chế + nhãn ngắn; single-action KHÔNG chip (nhãn + tick đủ), combo hiện `×2`. [tutorial]
 * - **CLEAR_TARGETS** → dãy glyph đích (gốc dây leo / giọt nước) mờ dần + pill "còn N".              [targets]
 * - **REACH_SCORE** → thanh tiến độ điểm = MỤC TIÊU thắng (KHÔNG coin sao); sao theo nước ở footer.
 * - **MIXED** → 2 dòng: dãy đích + thanh điểm mục tiêu (cao 72dp); sao theo nước ở footer.
 * - **BOSS_COMBO** → màn boss dùng **BossCard** (không gọi bar này); nhánh ở đây chỉ dự phòng.
 *
 * Trạng thái: active · near (pulse nhẹ ease-jelly) · done (nền success + tick pop, glow).
 * KHÔNG hiện chip `rotations`: bộ đếm lượt xoay đã ở FAB (GravityRotateButton).
 *
 * Kích thước (dp, theo ObjectiveBar.jsx): 1 dòng 52 · 2 dòng 72 · padding 16 · radius 20 · shadow sm ·
 * badge MÀN min 44 · glyph đích 24 · glyph tutorial 28–30 · chip 28 · pill 26. Chữ số Fredoka, nhãn Nunito.
 */
@Composable
fun ObjectiveBar(
    goal: Goal,
    world: Int,
    level: Int,
    worldName: String,
    score: Int,
    targetsCleared: Int,
    initialTargets: Int,
    bossDamage: Int,
    bossHpMax: Int,
    tutorialLabel: String,
    modifier: Modifier = Modifier,
    /** Mục tiêu ĐÃ hoàn thành (holder.levelComplete) — hiện tick "Xong" cho tutorial. */
    objectiveDone: Boolean = false,
    /**
     * Dải sao SỐNG chấm theo NƯỚC ĐI / LƯỢT XOAY (StarStrip + caption footer). MỌI màn campaign chấm
     * theo nước (design mới "unified to số nước") → luôn có. Điểm chỉ còn là điều kiện THẮNG, KHÔNG chấm sao.
     */
    liveStars: LiveStars? = null,
) {
    val stripFooter: (@Composable () -> Unit)? = liveStars?.let { { StripFooter(it) } }
    // Badge MÀN neo trái mọi bar (design ObjectiveBar.jsx LevelBadge) — luôn thấy đang ở màn nào.
    val lead: @Composable () -> Unit = { LevelBadge(level = level, worldName = worldName) }
    when (goal.type) {
        GoalType.MIXED -> {
            val total = initialTargets.coerceAtLeast(goal.count)
            val remaining = (total - targetsCleared).coerceAtLeast(0)
            val scoreDone = score >= goal.score
            Shell(tall = true, modifier = modifier, footer = stripFooter) {
                lead()
                Column(
                    Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    TargetCounter(Modifier.fillMaxWidth(), isDrop = world == 3, total = total, remaining = remaining)
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .height(1.dp)
                            .background(GjPalette.CellLine),
                    )
                    ScoreBar(Modifier.fillMaxWidth(), score = score, target = goal.score, done = scoreDone,
                        compact = true, near = !scoreDone && score.ratio(goal.score) >= 0.7f)
                }
            }
        }

        GoalType.REACH_SCORE -> {
            // Điểm = MỤC TIÊU thắng (thanh tiến độ, KHÔNG coin sao); sao chấm theo NƯỚC ở footer.
            val done = score >= goal.score
            val near = !done && score.ratio(goal.score) >= 0.7f
            Shell(modifier = modifier, footer = stripFooter) {
                lead()
                GlyphCircle(bg = GjPalette.Primary.copy(alpha = 0.18f)) {
                    GjIcon(GjIcons.Star, modifier = Modifier.size(19.dp), tint = GjPalette.Primary)
                }
                ScoreBar(Modifier.weight(1f), score = score, target = goal.score, done = done, near = near)
            }
        }

        GoalType.CLEAR_TARGETS -> {
            val total = initialTargets.coerceAtLeast(goal.count)
            val remaining = (total - targetsCleared).coerceAtLeast(0)
            Shell(modifier = modifier, footer = stripFooter) {
                lead()
                Text("MỤC TIÊU", style = captionStyle())
                TargetCounter(Modifier.weight(1f), isDrop = world == 3, total = total, remaining = remaining)
            }
        }

        GoalType.BOSS_COMBO -> {
            // Màn boss dùng BossCard (không gọi ObjectiveBar); nhánh này chỉ dự phòng.
            val done = bossDamage >= bossHpMax
            Shell(tall = true, modifier = modifier) {
                lead()
                Column(
                    Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(5.dp),
                ) {
                    ScoreBar(
                        Modifier.fillMaxWidth(), score = bossDamage, target = bossHpMax, done = done,
                        near = false, label = "MÁU BOSS", fill = GjPalette.Danger, compact = true,
                    )
                    Text(
                        "Combo ≥ ×2 để gây sát thương",
                        style = MaterialTheme.typography.labelSmall.copy(color = GjPalette.TextMuted),
                    )
                }
            }
        }

        GoalType.TUTORIAL -> {
            val variant = goal.trigger
            val isCombo = variant == TriggerKind.COMBO_X2
            Shell(modifier = modifier, footer = stripFooter) {
                lead()
                TutorialGlyph(variant)
                Text(
                    tutorialLabel,
                    modifier = Modifier.weight(1f),
                    maxLines = 1,
                    style = MaterialTheme.typography.bodyLarge.copy(
                        color = GjPalette.Text, fontWeight = FontWeight.Bold,
                    ),
                )
                // Single-action: bỏ chip "0/1" thừa (nhãn + tick đã đủ); combo giữ ×2; XONG → tick "Xong".
                if (isCombo || objectiveDone) {
                    ProgressChip(text = if (objectiveDone) "Xong" else "×2", done = objectiveDone, near = false)
                }
            }
        }

        // CLEAR_ALL / COMBO_CHAIN — chưa dùng ở Campaign hiện tại: readout nhãn tối giản.
        else -> Shell(modifier = modifier, footer = stripFooter) {
            lead()
            Text("MỤC TIÊU", style = captionStyle())
            Text(
                tutorialLabel,
                modifier = Modifier.weight(1f),
                maxLines = 1,
                style = MaterialTheme.typography.bodyLarge.copy(color = GjPalette.Text, fontWeight = FontWeight.Bold),
            )
        }
    }
}

private fun Int.ratio(target: Int): Float = if (target > 0) this / target.toFloat() else 0f

/* ── badge MÀN (số màn toàn cục + tên world) — design ObjectiveBar.jsx LevelBadge ─── */

/**
 * Neo trái mọi bar: ô "MÀN <số>" + tên world, ngăn cách bằng gạch dọc. Bám LevelBadge trong
 * `ObjectiveBar.jsx`: minWidth 44 · radius 12 · nền surface-sunken · MÀN 9sp · số 22sp · world 8.5sp.
 */
@Composable
private fun LevelBadge(level: Int, worldName: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
    ) {
        Column(
            Modifier
                .defaultMinSize(minWidth = 44.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(GjPalette.SurfaceSunken)
                .padding(horizontal = 9.dp, vertical = 3.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(1.dp),
        ) {
            Text("MÀN", style = captionStyle().copy(fontSize = 9.sp))
            Text("$level", style = numStyle(22.sp, GjPalette.Text))
            Text(
                worldName, maxLines = 1,
                style = captionStyle().copy(fontSize = 8.5.sp),
            )
        }
        Box(
            Modifier
                .width(1.5.dp)
                .height(40.dp)
                .clip(RoundedCornerShape(2.dp))
                .background(GjPalette.CellLine),
        )
    }
}

/* ── dải sao SỐNG cho màn chấm nước đi/lượt xoay (StripFooter · StarStrip) ────── */

/**
 * Readout sao sống cho màn "move-limited". [tier] = bậc sao ĐANG giữ (1..3) theo số nước/lượt đã dùng;
 * [now] = "Đang N★"; [next] = gợi ý ngắn giữ/rớt bậc (null nếu đã ở bậc thấp nhất). Tính ở nơi gọi
 * (CampaignPlayScreen) từ [com.gravityjelly.core.StarThresholds.tierFor] để dùng chung với lúc chấm sao thắng.
 */
data class LiveStars(val tier: Int, val now: String, val next: String?)

/** Footer dải 3 sao + caption bậc (design StripFooter). */
@Composable
private fun StripFooter(live: LiveStars) {
    Row(
        Modifier.padding(top = 6.dp, start = 2.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        StarStrip(live.tier)
        StarCaptionRow(live.now, live.next)
    }
}

/** Dải 3 mốc sao — rail chìm + fill vàng lấp tới bậc hiện tại (design StarStrip). */
@Composable
private fun StarStrip(tier: Int, size: androidx.compose.ui.unit.Dp = 14.dp) {
    val fillFrac = when {
        tier >= 3 -> 1f
        tier == 2 -> 0.5f
        else -> 0f
    }
    Box(Modifier.width(74.dp).height(size + 4.dp)) {
        // rail chìm (inset nửa sao mỗi bên để nối tâm sao đầu–cuối) + fill vàng tới bậc.
        Box(
            Modifier
                .align(Alignment.Center)
                .fillMaxWidth()
                .padding(horizontal = size / 2)
                .height(3.dp),
        ) {
            Box(Modifier.matchParentSize().clip(RoundedCornerShape(GjRadius.full)).background(GjPalette.SurfaceSunken))
            if (fillFrac > 0f) {
                Box(
                    Modifier
                        .fillMaxHeight()
                        .fillMaxWidth(fillFrac)
                        .clip(RoundedCornerShape(GjRadius.full))
                        .background(GjPalette.Warning),
                )
            }
        }
        Row(
            Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            for (i in 0 until 3) MiniStar(filled = tier >= i + 1, size = size)
        }
    }
}

/** Sao trần nhỏ — vàng khi đạt, kem nhạt khi chưa (design MiniStar). */
@Composable
private fun MiniStar(filled: Boolean, size: androidx.compose.ui.unit.Dp = 13.dp) {
    Canvas(Modifier.size(size)) {
        if (filled) drawStar(GjPalette.Warning, Color(0xFFE2A82E))
        else drawStar(Color(0xFFEFE2C7), Color(0xFFDECBAA))
    }
}

/** Caption bậc sao dạng chuỗi (now vàng · next mờ) cho dải sao sống. */
@Composable
private fun StarCaptionRow(now: String, next: String?) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(5.dp),
    ) {
        Text(now, style = numStyle(12.sp, Color(0xFFC88F26)), maxLines = 1)
        if (next != null) {
            Text("·", style = MaterialTheme.typography.labelSmall.copy(color = Color(0xFFE0CDAC)))
            Text(
                next, maxLines = 1,
                style = MaterialTheme.typography.labelSmall.copy(color = GjPalette.TextMuted, fontWeight = FontWeight.Bold),
            )
        }
    }
}

/* ── vỏ Shell (ObjectiveBar.jsx Shell) ───────────────────────────────────────── */

@Composable
private fun Shell(
    modifier: Modifier = Modifier,
    tall: Boolean = false,
    footer: (@Composable () -> Unit)? = null,
    content: @Composable RowScope.() -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .shadow(4.dp, RoundedCornerShape(GjRadius.lg), clip = false,
                ambientColor = GjPalette.ShadowSoft, spotColor = GjPalette.ShadowSoft)
            .clip(RoundedCornerShape(GjRadius.lg))
            .background(GjPalette.Surface)
            .defaultMinSize(minHeight = if (footer != null) 0.dp else if (tall) 72.dp else 52.dp)
            .padding(
                horizontal = GjSpace.lg,
                vertical = if (tall) 9.dp else if (footer != null) 7.dp else 0.dp,
            ),
        verticalArrangement = Arrangement.Center,
    ) {
        Row(
            Modifier.fillMaxWidth().defaultMinSize(minHeight = if (tall) 54.dp else 40.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
        ) { content() }
        footer?.invoke()
    }
}

/* ── thanh điểm (ScoreBar) ───────────────────────────────────────────────────── */

@Composable
private fun ScoreBar(
    modifier: Modifier = Modifier,
    score: Int,
    target: Int,
    done: Boolean,
    near: Boolean,
    compact: Boolean = false,
    label: String = "ĐIỂM",
    fill: Color = GjPalette.Primary,
) {
    val pct = score.ratio(target).coerceIn(0f, 1f)
    val scale = objScale(done, near)
    Column(modifier.fillMaxWidth()) {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(bottom = if (compact) 4.dp else 5.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(label, style = captionStyle())
            Row(verticalAlignment = Alignment.Bottom) {
                Text(
                    score.viGroup(),
                    style = numStyle(20.sp, if (done) GjPalette.Success else fill),
                )
                Text(
                    " / ${target.viGroup()}",
                    style = numStyle(12.sp, GjPalette.TextMuted),
                )
            }
        }
        // Track + fill (thanh tiến độ MỤC TIÊU điểm — không còn coin sao; sao chấm theo nước ở footer).
        Box(Modifier.fillMaxWidth()) {
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(12.dp)
                    .clip(RoundedCornerShape(GjRadius.full))
                    .background(GjPalette.SurfaceSunken),
            ) {
                Box(
                    Modifier
                        .fillMaxWidth(pct)
                        .height(12.dp)
                        .graphicsLayer { scaleY = scale }
                        .clip(RoundedCornerShape(GjRadius.full))
                        .background(
                            Brush.verticalGradient(
                                if (done) listOf(Color(0xFF8FE0A0), GjPalette.Success)
                                else listOf(fill.shine(), fill),
                            ),
                        ),
                )
            }
        }
    }
}

/* ── dãy đích mờ dần + pill "còn N" (TargetCounter) ──────────────────────────── */

@Composable
private fun TargetCounter(modifier: Modifier = Modifier, isDrop: Boolean, total: Int, remaining: Int) {
    val done = remaining <= 0
    val gone = total - remaining
    Row(
        modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp),
        ) {
            for (i in 0 until total) {
                if (isDrop) DropGlyph(dim = i < gone) else VineGlyph(dim = i < gone)
            }
        }
        Pill(done = done) {
            if (done) {
                GjIcon(GjIcons.Check, modifier = Modifier.size(15.dp), tint = GjPalette.TextInvert)
                Text("Xong", style = numStyle(14.sp, GjPalette.TextInvert))
            } else {
                Text("còn", style = captionStyle().copy(color = GjPalette.Text, fontWeight = FontWeight.ExtraBold))
                Text("$remaining", style = numStyle(14.sp, GjPalette.Text))
            }
        }
    }
}

@Composable
private fun Pill(done: Boolean, content: @Composable () -> Unit) {
    val scale = objScale(done, near = false)
    Row(
        Modifier
            .graphicsLayer { scaleX = scale; scaleY = scale }
            .defaultMinSize(minHeight = 26.dp)
            .clip(RoundedCornerShape(GjRadius.full))
            .background(if (done) GjPalette.Success else GjPalette.SurfaceSunken)
            .padding(horizontal = 11.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) { content() }
}

/* ── chip tiến độ tutorial (ProgressChip) ────────────────────────────────────── */

@Composable
private fun ProgressChip(text: String, done: Boolean, near: Boolean) {
    val scale = objScale(done, near)
    Row(
        Modifier
            .graphicsLayer { scaleX = scale; scaleY = scale }
            .defaultMinSize(minHeight = 28.dp)
            .clip(RoundedCornerShape(GjRadius.full))
            .background(if (done) GjPalette.Success else GjPalette.SurfaceSunken)
            .padding(horizontal = GjSpace.md),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        if (done) GjIcon(GjIcons.Check, modifier = Modifier.size(16.dp), tint = GjPalette.TextInvert)
        Text(text, style = numStyle(20.sp, if (done) GjPalette.TextInvert else GjPalette.Text))
    }
}

/* ── glyph tutorial (TutorialGlyph) ──────────────────────────────────────────── */

@Composable
private fun TutorialGlyph(variant: TriggerKind?) {
    when (variant) {
        TriggerKind.ROW -> GridGlyph(rowAxis = true)
        TriggerKind.COL -> GridGlyph(rowAxis = false)
        TriggerKind.ROTATE -> GlyphCircle(bg = GjPalette.Gravity.copy(alpha = 0.16f)) {
            GjIcon(GjIcons.RotateCw, modifier = Modifier.size(19.dp), tint = GjPalette.Gravity)
        }
        TriggerKind.SUPER1 -> SpecialGlyph(kind = SpecialKind.SUPER, fill = GjPalette.BlockPink, edge = GjPalette.BlockPinkEdge)
        TriggerKind.SUPER2 -> SpecialGlyph(kind = SpecialKind.SUPER, fill = GjPalette.BlockBlue, edge = GjPalette.BlockBlueEdge, lvl2 = true)
        TriggerKind.RAINBOW -> SpecialGlyph(kind = SpecialKind.RAINBOW, fill = GjPalette.BlockPink, edge = GjPalette.BlockPinkEdge)
        TriggerKind.RAINBOW_SUPER -> SpecialGlyph(kind = SpecialKind.CROWN, fill = GjPalette.BlockPink, edge = GjPalette.BlockPinkEdge)
        TriggerKind.COMBO_X2 -> GlyphCircle(bg = GjPalette.Warning.copy(alpha = 0.26f)) {
            GjIcon(GjIcons.X2, modifier = Modifier.size(19.dp), tint = Color(0xFFB9821C))
        }
        null -> Unit
    }
}

/** Vòng tròn nền nhạt bọc icon (score star / rotate / combo) — 30dp. */
@Composable
private fun GlyphCircle(bg: Color, content: @Composable () -> Unit) {
    Box(
        Modifier.size(30.dp).clip(RoundedCornerShape(GjRadius.full)).background(bg),
        contentAlignment = Alignment.Center,
    ) { content() }
}

/** Lưới mini 3×3 với hàng/cột giữa sáng — CLEAR_ROW / CLEAR_COL (ObjectiveBar.jsx GridGlyph). */
@Composable
private fun GridGlyph(rowAxis: Boolean) {
    val hot = GjPalette.Primary
    val hotEdge = GjPalette.PrimaryEdge
    val cold = GjPalette.SurfaceSunken
    val coldEdge = Color(0xFFE7D8BF)
    Canvas(Modifier.size(28.dp)) {
        val u = size.width / 27f
        for (r in 0 until 3) for (c in 0 until 3) {
            val lit = if (rowAxis) r == 1 else c == 1
            val tl = Offset((c * 8.5f + 1.5f) * u, (r * 8.5f + 1.5f) * u)
            val sz = Size(6.5f * u, 6.5f * u)
            val rad = androidx.compose.ui.geometry.CornerRadius(2f * u)
            drawRoundRect(if (lit) hot else cold, topLeft = tl, size = sz, cornerRadius = rad)
            drawRoundRect(if (lit) hotEdge else coldEdge, topLeft = tl, size = sz, cornerRadius = rad,
                style = Stroke(width = 1f * u))
        }
    }
}

private enum class SpecialKind { SUPER, RAINBOW, CROWN }

/** Ô "power-cell" siêu khối/cầu vồng/vương miện — bám ObjectiveBar.jsx SpecialGlyph (30dp). */
@Composable
private fun SpecialGlyph(kind: SpecialKind, fill: Color, edge: Color, lvl2: Boolean = false) {
    val size = 30.dp
    val rainbow = kind != SpecialKind.SUPER
    val rainbowBrush = Brush.sweepGradient(
        listOf(GjPalette.BlockPink, GjPalette.BlockYellow, GjPalette.BlockMint, GjPalette.BlockBlue, GjPalette.BlockPink),
    )
    Box(contentAlignment = Alignment.Center) {
        // vòng warning glow (boxShadow 0 0 0 2px warning)
        Box(
            Modifier
                .size(size + 4.dp)
                .clip(RoundedCornerShape(GjRadius.md))
                .background(GjPalette.Warning),
        )
        Box(
            Modifier
                .size(size)
                .clip(RoundedCornerShape(GjRadius.sm))
                .then(if (rainbow) Modifier.background(rainbowBrush) else Modifier.background(fill))
                .border(3.dp, if (rainbow) GjPalette.BlockPinkEdge else edge, RoundedCornerShape(GjRadius.sm)),
            contentAlignment = Alignment.Center,
        ) {
            if (rainbow) {
                Box(Modifier.size(10.dp).clip(RoundedCornerShape(GjRadius.full)).background(Color(0xFCFFFFFF)))
            } else {
                Canvas(Modifier.size(15.dp)) { drawStar(Color(0xFFFFF6DD), Color(0xFFE2A82E)) }
            }
        }
        // gloss trên
        Box(
            Modifier
                .size(width = size * 0.7f, height = size * 0.32f)
                .padding(top = 2.dp)
                .align(Alignment.TopCenter)
                .clip(RoundedCornerShape(GjRadius.full))
                .background(Color(0xB3FFFFFF)),
        )
        if (kind == SpecialKind.CROWN) {
            Canvas(
                Modifier
                    .size(size * 0.62f)
                    .align(Alignment.TopCenter)
                    .padding(bottom = size),
            ) { drawCrown() }
        }
        if (lvl2) {
            Box(
                Modifier
                    .align(Alignment.BottomEnd)
                    .size(17.dp)
                    .clip(RoundedCornerShape(GjRadius.full))
                    .background(GjPalette.Surface)
                    .border(2.dp, GjPalette.Warning, RoundedCornerShape(GjRadius.full)),
                contentAlignment = Alignment.Center,
            ) {
                Text("2", style = numStyle(10.sp, Color(0xFFB9821C)))
            }
        }
    }
}

/* ── glyph đích: gốc dây leo (World 2) · giọt nước (World 3) ─────────────────── */

/** Mầm dây leo (ObjectiveBar.jsx VineGlyph): ụ đất nâu + thân + 2 lá vine-green; mờ khi đã phá. */
@Composable
private fun VineGlyph(dim: Boolean) {
    val a = if (dim) 0.3f else 1f
    Canvas(Modifier.size(24.dp)) {
        val w = size.width
        val stem = Color(0xFF6BA352).copy(alpha = a)
        val leaf = Color(0xFF9ECF7E).copy(alpha = a)
        drawOval(
            Color(0xFFC7A97E).copy(alpha = a),
            topLeft = Offset(w * 0.2f, w * 0.75f),
            size = Size(w * 0.6f, w * 0.19f),
        )
        drawLine(stem, Offset(w / 2f, w * 0.82f), Offset(w / 2f, w * 0.42f), w * 0.10f, StrokeCap.Round)
        drawOval(leaf, Offset(w * 0.16f, w * 0.33f), Size(w * 0.30f, w * 0.18f))
        drawOval(leaf, Offset(w * 0.54f, w * 0.29f), Size(w * 0.30f, w * 0.18f))
    }
}

/**
 * Giọt nước (World 3). ObjectiveBar.jsx vẽ DropGlyph MINT, NHƯNG giọt đích trên bàn là **xanh dương**
 * (block-blue) → glyph bám màu bàn để người chơi liên hệ đúng "giọt cần phá" (lệch chủ ý so với mockup,
 * ưu tiên UX). Đổi lại mint nếu muốn khớp mockup nguyên bản.
 */
@Composable
private fun DropGlyph(dim: Boolean) {
    val a = if (dim) 0.4f else 1f
    val water = Color(0xFFB3C7F7).copy(alpha = a)
    val edge = Color(0xFF7E9CE8).copy(alpha = a)
    val shine = Color(0xFFEAF0FF).copy(alpha = a)
    Canvas(Modifier.size(24.dp)) {
        val w = size.width
        val cx = w / 2f
        val drop = Path().apply {
            moveTo(cx, w * 0.13f)
            cubicTo(w * 0.87f, w * 0.46f, w * 0.87f, w * 0.72f, cx, w * 0.87f)
            cubicTo(w * 0.13f, w * 0.72f, w * 0.13f, w * 0.46f, cx, w * 0.13f)
            close()
        }
        drawPath(drop, water)
        drawPath(drop, edge, style = Stroke(width = w * 0.066f, join = StrokeJoin.Round))
        drawCircle(shine, radius = w * 0.08f, center = Offset(cx - w * 0.10f, w * 0.60f))
    }
}

/* ── vẽ tay: ngôi sao + vương miện ──────────────────────────────────────────── */

private fun DrawScope.drawStar(fillC: Color, strokeC: Color) {
    val w = size.width
    // ngôi sao 5 cánh (viewBox 24): M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z
    val u = w / 24f
    val p = Path().apply {
        moveTo(12 * u, 3 * u)
        lineTo(14.6f * u, 8.3f * u)
        lineTo(20.5f * u, 9.2f * u)
        lineTo(16.2f * u, 13.3f * u)
        lineTo(17.2f * u, 19.1f * u)
        lineTo(12 * u, 16.9f * u)
        lineTo(6.8f * u, 19.1f * u)
        lineTo(7.8f * u, 13.3f * u)
        lineTo(3.5f * u, 9.2f * u)
        lineTo(9.4f * u, 8.3f * u)
        close()
    }
    drawPath(p, fillC)
    drawPath(p, strokeC, style = Stroke(width = 1.6f * u, join = StrokeJoin.Round))
}

private fun DrawScope.drawCrown() {
    val w = size.width
    val u = w / 24f
    val gold = Color(0xFFFFCA66)
    val goldEdge = Color(0xFFE2A82E)
    // M3.5 18l-1-9 5 3.5L12 5l4.5 7.5 5-3.5-1 9z
    val p = Path().apply {
        moveTo(3.5f * u, 18 * u)
        lineTo(2.5f * u, 9 * u)
        lineTo(7.5f * u, 12.5f * u)
        lineTo(12 * u, 5 * u)
        lineTo(16.5f * u, 12.5f * u)
        lineTo(21.5f * u, 9 * u)
        lineTo(20.5f * u, 18 * u)
        close()
    }
    drawPath(p, gold)
    drawPath(p, goldEdge, style = Stroke(width = 1.6f * u, join = StrokeJoin.Round))
}

/* ── trạng thái động: pop (done) · pulse (near) ─────────────────────────────── */

/**
 * Scale cho pop/pulse — bám keyframe ObjectiveBar.jsx (gj-obj-pop 0.5→1.16→1; gj-obj-nudge ±1.06).
 * Chỉ chạy trên lớp vỏ HUD nhỏ (không phải bàn), redraw khi tiến độ đổi — hợp checklist chống giật.
 */
@Composable
private fun objScale(done: Boolean, near: Boolean): Float {
    val pop = remember { Animatable(1f) }
    LaunchedEffect(done) {
        if (done) {
            pop.snapTo(0.5f)
            pop.animateTo(1.16f, tween(180))
            pop.animateTo(1f, spring(dampingRatio = Spring.DampingRatioMediumBouncy))
        }
    }
    val trans = rememberInfiniteTransition(label = "obj")
    val pulse by trans.animateFloat(
        initialValue = 1f, targetValue = 1.06f,
        animationSpec = infiniteRepeatable(tween(450, easing = LinearEasing), RepeatMode.Reverse),
        label = "pulse",
    )
    return when {
        done -> pop.value
        near -> pulse
        else -> 1f
    }
}

/* ── kiểu chữ ────────────────────────────────────────────────────────────────── */

/** Nhãn caption nhỏ (Nunito, muted, extrabold, tracking wide) — CAPTION trong ObjectiveBar.jsx. */
@Composable
private fun captionStyle() = MaterialTheme.typography.labelSmall.copy(
    color = GjPalette.TextMuted, fontWeight = FontWeight.ExtraBold, letterSpacing = 0.04.em,
)

/** Số (Fredoka/display, digit-safe) — NUM trong ObjectiveBar.jsx. */
private fun numStyle(fontSize: androidx.compose.ui.unit.TextUnit, color: Color) = androidx.compose.ui.text.TextStyle(
    fontFamily = GjDisplayFontFamily, fontWeight = FontWeight.Bold, fontSize = fontSize, color = color, lineHeight = 1.05.em,
)

/** shine của fill (tangerine → tangerine-shine) cho gradient thanh điểm. */
private fun Color.shine(): Color = when (this) {
    GjPalette.Primary -> GjPalette.PrimaryShine
    GjPalette.Danger -> Color(0xFFF7B2A8)
    else -> this
}

/** 12480 → "12.480" (nhóm 3 kiểu vi-VN). */
private fun Int.viGroup(): String {
    if (this == 0) return "0"
    return toString().reversed().chunked(3).joinToString(".").reversed()
}
