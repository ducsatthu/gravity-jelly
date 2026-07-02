package com.gravityjelly.app

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.components.BtnSize
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.core.CampaignLevels
import com.gravityjelly.core.GoalType
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Level
import com.gravityjelly.core.StarMetric
import com.gravityjelly.core.StarThresholds
import com.gravityjelly.core.TriggerKind
import com.gravityjelly.app.ui.guide.ComboX2Demo
import com.gravityjelly.game.GuideCell
import com.gravityjelly.game.GuideMiniBoard
import com.gravityjelly.game.gEmpty
import com.gravityjelly.game.gJelly
import com.gravityjelly.game.gRainbow
import com.gravityjelly.game.gRainbow2
import com.gravityjelly.game.gSuper1
import com.gravityjelly.game.gSuper2

/**
 * Màn GIỚI THIỆU trước khi vào chơi một màn Campaign — bám `04-screens/screen-06-level-intro.card`
 * (bản redesign mới, 02/07). Cấu trúc sheet trên nền cream, từ trên xuống:
 *
 *  1. **Chip world** (viên bo tròn, màu accent theo world / gravity cho boss) + tiêu đề `Màn N · Tên`.
 *  2. Khối **MỤC TIÊU** (nền lún): hero glyph objective ở giữa (tái dùng [GuideMiniBoard] vẽ khối
 *     THẬT — không tự chế), nhãn MỤC TIÊU, câu mục tiêu.
 *  3. Dải **3 sao ngưỡng** ngang: 3★ / 2★ / 1★, mỗi cột = 3 sao + giá trị ngưỡng + đơn vị.
 *  4. Chip **Đảo trọng lực · N lượt** + caption "Số lần được đảo trọng lực trong cả màn".
 *  5. CTA **BẮT ĐẦU** (variant gravity cho boss).
 *
 * Khác design template: template minh hoạ 3 archetype (tutorial-special · ô đích · boss) và có
 * "XEM TRƯỚC BÀN" (preview bàn khởi đầu) — phần preview theo TỪNG bàn sẽ custom sau. Ở đây hero glyph
 * gánh vai trò minh hoạ objective: World 1 là TUTORIAL nên mỗi cơ chế map sang một glyph khối thật
 * tương ứng (hàng/cột/siêu khối/cầu vồng/…), lấy từ vocabulary design.
 *
 * @param levelIndex chỉ số trong [CampaignLevels.ALL].
 * @param earnedStars sao đã đạt của màn này (0 = chưa xong) → tô đậm bậc đã đạt trên dải sao.
 */
@Composable
fun CampaignIntroScreen(
    levelIndex: Int,
    earnedStars: Int,
    onStart: () -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val level = CampaignLevels.ALL[levelIndex]
    val isBoss = level.goal.type == GoalType.BOSS_COMBO
    // Accent: boss = gravity tím (design), còn lại theo biome của world.
    val accent = if (isBoss) GjPalette.Gravity else WorldTheme.accent(level.world)

    BackHandler(onBack = onClose)

    Box(
        modifier = modifier
            .fillMaxSize()
            // Nền cream radial (screen-06 body).
            .background(
                Brush.radialGradient(
                    0f to GjPalette.Bg,
                    1f to Color(0xFFF3E3CC),
                ),
            )
            .windowInsetsPadding(WindowInsets.safeDrawing),
    ) {
        // Sheet căn giữa, cuộn được khi màn hình thấp.
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = GjSpace.xl, vertical = GjSpace.xxl),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(GjRadius.xxl))
                    .background(GjPalette.Surface)
                    .padding(horizontal = GjSpace.xl, vertical = GjSpace.xl),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(GjSpace.lg),
            ) {
                // ── Tiêu đề: chip world + "Màn N · Tên" ──
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(GjSpace.xs),
                ) {
                    Text(
                        text = WorldTheme.name(level.world).uppercase(),
                        color = accent,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 0.06.em,
                        fontFamily = MaterialTheme.typography.bodyLarge.fontFamily,
                        modifier = Modifier
                            .clip(RoundedCornerShape(GjRadius.full))
                            .background(accent.copy(alpha = 0.16f))
                            .padding(horizontal = GjSpace.md, vertical = GjSpace.xs),
                    )
                    Text(
                        text = "Màn ${level.id} · ${level.name}",
                        color = GjPalette.Text,
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = 22.sp,
                        ),
                        textAlign = TextAlign.Center,
                    )
                }

                // ── Khối MỤC TIÊU ──
                ObjectiveCard(level = level, isBoss = isBoss)

                // ── Dải 3 sao ngưỡng ──
                StarStrip(t = level.stars, earned = earnedStars)

                // ── Ngân sách xoay (ẩn khi màn không cho xoay) ──
                if (level.rotationBudget > 0) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(GjSpace.xs),
                    ) {
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(GjRadius.full))
                                .background(GjPalette.Gravity.copy(alpha = 0.14f))
                                .padding(horizontal = GjSpace.lg, vertical = GjSpace.sm),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
                        ) {
                            GjIcon(
                                GjIcons.RotateCw,
                                contentDescription = null,
                                tint = GjPalette.Gravity,
                                modifier = Modifier.size(18.dp),
                            )
                            Text(
                                text = "Đảo trọng lực · ",
                                color = GjPalette.Text,
                                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold),
                            )
                            Text(
                                text = "${level.rotationBudget}",
                                color = GjPalette.Gravity,
                                style = MaterialTheme.typography.headlineMedium.copy(
                                    fontWeight = FontWeight.ExtraBold,
                                    fontSize = 18.sp,
                                ),
                            )
                            Text(
                                text = " lượt",
                                color = GjPalette.Text,
                                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold),
                            )
                        }
                        Text(
                            text = "Số lần được đảo trọng lực trong cả màn",
                            color = GjPalette.TextMuted,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            textAlign = TextAlign.Center,
                            fontFamily = MaterialTheme.typography.bodyLarge.fontFamily,
                        )
                    }
                }

                GjButton(
                    onClick = onStart,
                    variant = if (isBoss) BtnVariant.Gravity else BtnVariant.Primary,
                    btnSize = BtnSize.Cta,
                    icon = GjIcons.Play,
                    fullWidth = true,
                ) { Text("BẮT ĐẦU") }
            }
        }

        // Nút đóng (top-end) — VẼ SAU CÙNG để nổi trên lớp cuộn (không bị Column nuốt chạm).
        Box(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(GjSpace.md)
                .size(44.dp)
                .clip(RoundedCornerShape(GjRadius.lg))
                .background(GjPalette.Surface)
                .clickable(onClick = onClose),
            contentAlignment = Alignment.Center,
        ) {
            GjIcon(GjIcons.Close, contentDescription = "Đóng", tint = GjPalette.TextMuted, modifier = Modifier.size(22.dp))
        }
    }
}

// ── Khối MỤC TIÊU ────────────────────────────────────────────────────────────────────────────
@Composable
private fun ObjectiveCard(level: Level, isBoss: Boolean) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(GjRadius.xl))
            .background(
                if (isBoss) GjPalette.Gravity.copy(alpha = 0.10f) else GjPalette.SurfaceSunken,
            )
            .padding(horizontal = GjSpace.lg, vertical = GjSpace.md),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(GjSpace.sm),
    ) {
        // Hero glyph objective (khối THẬT).
        Box(Modifier.padding(vertical = GjSpace.xs), contentAlignment = Alignment.Center) {
            ObjectiveHero(level)
        }

        Text(
            text = "MỤC TIÊU",
            color = GjPalette.TextMuted,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.06.em,
            fontFamily = MaterialTheme.typography.headlineMedium.fontFamily,
        )
        Text(
            text = goalLabel(level.goal, level.world),
            color = GjPalette.Text,
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, fontSize = 18.sp),
            textAlign = TextAlign.Center,
        )
    }
}

/**
 * Hero glyph minh hoạ objective — MỖI loại một hình riêng bằng KHỐI THẬT (tái dùng [GuideMiniBoard]
 * của :game, không tự chế). Tutorial: mini-board 3×3 phác đúng "cái cần tạo"; điểm/boss có hero riêng.
 */
private const val HERO_DP = 84

@Composable
private fun ObjectiveHero(level: Level) {
    val Y = JellyColor.YELLOW
    val M = JellyColor.MINT
    val P = JellyColor.PINK
    val B = JellyColor.BLUE
    val E = gEmpty
    when (level.goal.type) {
        GoalType.REACH_SCORE -> ScoreHero(level.goal.score)
        GoalType.BOSS_COMBO -> BossHero(level.goal.bossHP)
        // Ô đích tuỳ world: World 3 = giọt nước, còn lại (World 2) = gốc dây leo.
        GoalType.CLEAR_TARGETS ->
            if (level.world == 3) DropHero(level.goal.count) else VineHero(level.goal.count)
        GoalType.MIXED ->
            if (level.world == 3) DropHero(level.goal.count, level.goal.score)
            else VineHero(level.goal.count, level.goal.score)
        GoalType.TUTORIAL -> when (level.goal.trigger) {
            // Đầy 1 HÀNG (màu bất kỳ) → hàng giữa lấp đủ.
            TriggerKind.ROW -> HeroBoard(
                listOf(listOf(E, E, E), listOf(gJelly(Y), gJelly(M), gJelly(P)), listOf(E, E, E)),
            )
            // Đầy 1 CỘT → cột giữa lấp đủ.
            TriggerKind.COL -> HeroBoard(
                listOf(listOf(E, gJelly(P), E), listOf(E, gJelly(B), E), listOf(E, gJelly(Y), E)),
            )
            // Xoay trọng lực: khối giữa + huy hiệu xoay tím.
            TriggerKind.ROTATE -> HeroBoard(
                rows = listOf(listOf(E, E, E), listOf(E, gJelly(M), E), listOf(E, E, E)),
                badge = { RotateBadge() },
            )
            // Màn 4: "9 ô cùng màu → Thạch Hoàng Gia".
            TriggerKind.SUPER1 -> TwoStepHero(
                before = listOf(listOf(gJelly(Y), gJelly(Y), gJelly(Y)), listOf(gJelly(Y), gJelly(Y), gJelly(Y)), listOf(gJelly(Y), gJelly(Y), gJelly(Y))),
                beforeWidth = 66,
                after = listOf(listOf(gSuper1(Y))),
                afterWidth = 52,
            )
            // Màn 5: "2 Thạch Hoàng Gia → Vua Thạch".
            TriggerKind.SUPER2 -> TwoStepHero(
                before = listOf(listOf(gSuper1(Y), gSuper1(Y))),
                beforeWidth = 76,
                after = listOf(listOf(gSuper2(Y))),
                afterWidth = 52,
            )
            // Màn 6: "3×3 ba màu (mỗi màu 1 cột) → Thạch Cầu Vồng".
            TriggerKind.RAINBOW -> TwoStepHero(
                before = listOf(listOf(gJelly(P), gJelly(M), gJelly(B)), listOf(gJelly(P), gJelly(M), gJelly(B)), listOf(gJelly(P), gJelly(M), gJelly(B))),
                beforeWidth = 66,
                after = listOf(listOf(gRainbow)),
                afterWidth = 52,
            )
            // Màn 7: "2 Thạch Hoàng Gia KHÁC MÀU → Hoàng Đế Cầu Vồng".
            TriggerKind.RAINBOW_SUPER -> TwoStepHero(
                before = listOf(listOf(gSuper1(Y), gSuper1(B))),
                beforeWidth = 76,
                after = listOf(listOf(gRainbow2)),
                afterWidth = 52,
            )
            // Combo ×2: thay khối+huy hiệu bằng hình minh hoạ cách đạt (2 hàng đầy → COMBO ×2).
            TriggerKind.COMBO_X2 -> Box(Modifier.width(220.dp)) { ComboX2Demo() }
            null -> HeroBoard(centered(gJelly(M)))
        }
        else -> HeroBoard(centered(gJelly(M)))
    }
}

/**
 * Hero 2 bước "TRƯỚC → SAU": mini-board [before] · mũi tên gravity · mini-board [after]. Không nhãn
 * chữ. Dùng cho các mục tiêu "ghép/gộp thành X" (siêu khối, cực hạn khối, cầu vồng…). Khối thật, không tự chế.
 */
@Composable
private fun TwoStepHero(
    before: List<List<GuideCell>>,
    beforeWidth: Int,
    after: List<List<GuideCell>>,
    afterWidth: Int,
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
    ) {
        Box(Modifier.width(beforeWidth.dp)) { GuideMiniBoard(before) }
        GjIcon(GjIcons.Chevron, contentDescription = null, tint = GjPalette.Gravity, modifier = Modifier.size(20.dp))
        Box(Modifier.width(afterWidth.dp)) { GuideMiniBoard(after) }
    }
}

/** Lưới 3×3 chỉ có 1 ô ở giữa (dùng cho siêu khối / cầu vồng / khối lẻ). */
private fun centered(cell: GuideCell): List<List<GuideCell>> =
    listOf(listOf(gEmpty, gEmpty, gEmpty), listOf(gEmpty, cell, gEmpty), listOf(gEmpty, gEmpty, gEmpty))

/** Mini-board hero cố định [HERO_DP], tuỳ chọn [badge] dán góc dưới-phải. */
@Composable
private fun HeroBoard(rows: List<List<GuideCell>>, badge: (@Composable () -> Unit)? = null) {
    Box(Modifier.size(HERO_DP.dp), contentAlignment = Alignment.Center) {
        GuideMiniBoard(rows)
        if (badge != null) {
            Box(Modifier.align(Alignment.BottomEnd)) { badge() }
        }
    }
}

@Composable
private fun RotateBadge() {
    Box(
        Modifier
            .size(30.dp)
            .clip(CircleShape)
            .background(GjPalette.Gravity)
            .border(2.dp, GjPalette.Surface, CircleShape),
        contentAlignment = Alignment.Center,
    ) {
        GjIcon(GjIcons.RotateCw, contentDescription = null, tint = GjPalette.TextInvert, modifier = Modifier.size(18.dp))
    }
}

/** Hero điểm — sao lớn + số điểm mục tiêu chồng giữa (design ScoreHero). */
@Composable
private fun ScoreHero(target: Int) {
    Box(Modifier.size(HERO_DP.dp), contentAlignment = Alignment.Center) {
        Image(
            painter = painterResource(R.drawable.star_on),
            contentDescription = null,
            modifier = Modifier.size(HERO_DP.dp),
        )
        Text(
            text = "$target",
            color = Color(0xFFB9821C),
            fontSize = 22.sp,
            fontWeight = FontWeight.Black,
            fontFamily = MaterialTheme.typography.headlineMedium.fontFamily,
        )
    }
}

/** Hero boss — mặt khối gravity + mắt giận + huy hiệu máu (design BossHero). */
@Composable
private fun BossHero(hp: Int) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Box(
            Modifier
                .size(72.dp)
                .clip(RoundedCornerShape(18.dp))
                .background(GjPalette.Gravity)
                .border(4.dp, GjPalette.GravityEdge, RoundedCornerShape(18.dp)),
            contentAlignment = Alignment.Center,
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                repeat(2) { BossEye() }
            }
        }
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(GjRadius.full))
                .background(GjPalette.Danger)
                .padding(horizontal = GjSpace.sm, vertical = 2.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(3.dp),
        ) {
            GjIcon(GjIcons.Heart, contentDescription = null, tint = GjPalette.TextInvert, modifier = Modifier.size(13.dp))
            Text(
                text = "$hp",
                color = GjPalette.TextInvert,
                fontSize = 13.sp,
                fontWeight = FontWeight.Black,
                fontFamily = MaterialTheme.typography.headlineMedium.fontFamily,
            )
        }
    }
}

/**
 * Hero mục tiêu World 2 — phá [count] GỐC dây leo (bám ObjectiveBar VineGlyph). MIXED: kèm badge
 * điểm [score] cần đạt thêm.
 */
@Composable
private fun VineHero(count: Int, score: Int = 0) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(GjSpace.sm)) {
            repeat(count.coerceAtLeast(1)) { VineHeroGlyph() }
        }
        if (score > 0) {
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(GjRadius.full))
                    .background(GjPalette.Primary.copy(alpha = 0.16f))
                    .padding(horizontal = GjSpace.sm, vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(3.dp),
            ) {
                Image(
                    painter = painterResource(R.drawable.star_on),
                    contentDescription = null,
                    modifier = Modifier.size(13.dp),
                )
                Text(
                    text = "+$score điểm",
                    color = Color(0xFFB9821C),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Black,
                    fontFamily = MaterialTheme.typography.headlineMedium.fontFamily,
                )
            }
        }
    }
}

@Composable
private fun VineHeroGlyph() {
    Canvas(Modifier.size(44.dp)) {
        val w = size.width
        val stem = Color(0xFF5FC3B2)
        val leaf = Color(0xFFA3E5D9)
        drawOval(
            Color(0xFFC7A97E),
            topLeft = androidx.compose.ui.geometry.Offset(w * 0.2f, w * 0.72f),
            size = androidx.compose.ui.geometry.Size(w * 0.6f, w * 0.18f),
        )
        drawLine(
            stem,
            androidx.compose.ui.geometry.Offset(w / 2f, w * 0.78f),
            androidx.compose.ui.geometry.Offset(w / 2f, w * 0.4f),
            w * 0.1f,
        )
        drawOval(leaf, androidx.compose.ui.geometry.Offset(w * 0.14f, w * 0.3f), androidx.compose.ui.geometry.Size(w * 0.34f, w * 0.2f))
        drawOval(leaf, androidx.compose.ui.geometry.Offset(w * 0.52f, w * 0.26f), androidx.compose.ui.geometry.Size(w * 0.34f, w * 0.2f))
    }
}

/**
 * Hero mục tiêu World 3 — phá [count] GIỌT NƯỚC (bám ObjectiveBar drop glyph). MIXED: kèm badge điểm
 * [score] cần đạt thêm. Tái dùng khung của [VineHero], chỉ đổi glyph sang giọt nước.
 */
@Composable
private fun DropHero(count: Int, score: Int = 0) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(GjSpace.sm)) {
            repeat(count.coerceAtLeast(1)) { DropHeroGlyph() }
        }
        if (score > 0) {
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(GjRadius.full))
                    .background(GjPalette.Primary.copy(alpha = 0.16f))
                    .padding(horizontal = GjSpace.sm, vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(3.dp),
            ) {
                Image(
                    painter = painterResource(R.drawable.star_on),
                    contentDescription = null,
                    modifier = Modifier.size(13.dp),
                )
                Text(
                    text = "+$score điểm",
                    color = Color(0xFFB9821C),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Black,
                    fontFamily = MaterialTheme.typography.headlineMedium.fontFamily,
                )
            }
        }
    }
}

@Composable
private fun DropHeroGlyph() {
    val water = Color(0xFF8FB6F2)
    val shine = Color(0xFFEAFAFB)
    Canvas(Modifier.size(44.dp)) {
        val w = size.width
        val cx = w / 2f
        val drop = androidx.compose.ui.graphics.Path().apply {
            moveTo(cx, w * 0.14f)
            cubicTo(w * 0.84f, w * 0.44f, w * 0.84f, w * 0.72f, cx, w * 0.86f)
            cubicTo(w * 0.16f, w * 0.72f, w * 0.16f, w * 0.44f, cx, w * 0.14f)
            close()
        }
        drawPath(drop, water)
        drawCircle(
            shine, radius = w * 0.10f,
            center = androidx.compose.ui.geometry.Offset(cx - w * 0.08f, w * 0.56f),
        )
    }
}

@Composable
private fun BossEye() {
    Box(
        Modifier.size(16.dp).clip(CircleShape).background(GjPalette.TextInvert),
        contentAlignment = Alignment.Center,
    ) {
        Box(Modifier.size(8.dp).clip(CircleShape).background(Color(0xFF4A3526)))
    }
}

// ── Dải 3 sao ngưỡng ─────────────────────────────────────────────────────────────────────────
/**
 * Dải ngang 3 cột: 3★ / 2★ / 1★, mỗi cột = hàng 3 sao (sáng dần) + giá trị ngưỡng + đơn vị
 * ([StarThresholds]). Cột bậc đã đạt (theo [earned]) tô đậm.
 *
 * LƯU Ý gác sao: `EndlessGameHolder.computeStars` hiện chỉ gác trên `three`/`two` — hoàn thành màn =
 * luôn ≥1★, nên giá trị 1★ ở đây là "mốc tham chiếu" chứ chưa phải điều kiện chặn (chờ chốt sau).
 */
@Composable
private fun StarStrip(t: StarThresholds, earned: Int) {
    val tiers = listOf(3 to t.three, 2 to t.two, 1 to t.one)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(GjRadius.lg))
            .background(GjPalette.SurfaceSunken)
            .padding(horizontal = GjSpace.md, vertical = GjSpace.sm),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceAround,
    ) {
        tiers.forEachIndexed { i, (n, value) ->
            if (i > 0) {
                Box(Modifier.width(1.dp).height(24.dp).background(GjPalette.CellLine))
            }
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(3.dp),
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                    for (s in 1..3) {
                        Image(
                            painter = painterResource(if (s <= n) R.drawable.star_on else R.drawable.star_off),
                            contentDescription = null,
                            modifier = Modifier.size(15.dp),
                        )
                    }
                }
                val achieved = earned > 0 && earned >= n
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(
                        text = starValue(t.metric, value),
                        color = if (achieved) GjPalette.Success else GjPalette.Text,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.ExtraBold,
                        fontFamily = MaterialTheme.typography.headlineMedium.fontFamily,
                    )
                    Text(
                        text = " ${starUnit(t.metric)}",
                        color = GjPalette.TextMuted,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = MaterialTheme.typography.bodyLarge.fontFamily,
                    )
                }
            }
        }
    }
}

/** Đơn vị hiển thị theo [StarMetric]. */
private fun starUnit(metric: StarMetric): String = when (metric) {
    StarMetric.MOVES -> "nước"
    StarMetric.ROTATIONS -> "lần"
    StarMetric.SCORE -> "đ"
    StarMetric.COMBO -> "nhịp"
}

/**
 * Giá trị ngưỡng cho một bậc sao. Metric "càng ít càng tốt" (MOVES/ROTATIONS/COMBO) hiện dấu `≤`;
 * SCORE (càng nhiều càng tốt) để trần số.
 */
private fun starValue(metric: StarMetric, n: Int): String = when (metric) {
    StarMetric.SCORE -> "$n"
    else -> "≤$n"
}
