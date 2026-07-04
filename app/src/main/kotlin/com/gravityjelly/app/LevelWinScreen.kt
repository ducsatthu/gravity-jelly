package com.gravityjelly.app

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.StartOffset
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.components.BtnSize
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.core.Direction
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PieceLibrary
import com.gravityjelly.game.LivingJellyThumbnail

/**
 * Màn/overlay **THẮNG MÀN** — bám `04-screens/level-win-screen.jsx`: confetti rơi, mascot happy nhún,
 * 3 sao chồm đỉnh card, điểm + thống kê, nút MÀN TIẾP / Chơi lại / Bản đồ.
 *
 * Khác design: design có ô **THƯỞNG (xu)** — game chưa có hệ tiền tệ (MVP F2P qua AdMob), nên thay ô
 * xu bằng **thống kê thành tích** ([statLabel]/[statValue]) theo tiêu chí sao của màn (nước / lượt
 * xoay / mục tiêu). Mọi giá trị "ma thuật" bám token design (spacing/radius/màu confetti từ palette).
 *
 * @param hasNext còn màn kế → hiện nút MÀN TIẾP.
 */
@Composable
fun LevelWinScreen(
    level: Int,
    worldName: String,
    stars: Int,
    score: Int,
    statLabel: String,
    statValue: String,
    hasNext: Boolean,
    onNext: () -> Unit,
    onReplay: () -> Unit,
    onHome: () -> Unit,
    modifier: Modifier = Modifier,
    reducedMotion: Boolean = false,
) {
    BoxWithConstraints(
        modifier = modifier
            .fillMaxSize()
            .background(GjPalette.Overlay),      // scrim làm mờ bàn phía sau
        contentAlignment = Alignment.Center,
    ) {
        // Confetti rơi (14 mảnh) — sau scrim, dưới card.
        if (!reducedMotion) {
            val w = maxWidth
            val h = maxHeight
            for (i in 0 until 14) ConfettiPiece(i, w, h)
        }

        // Card ăn mừng — Box bọc để 3 sao là SIBLING chồm lên đỉnh (không bị card clip cắt).
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .widthIn(max = 360.dp)
                .padding(horizontal = GjSpace.xl),
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 34.dp)                 // chừa chỗ cho sao chồm lên trên
                    // background CÓ shape (không .clip) → nền bo góc mà KHÔNG cắt sao sibling.
                    .background(GjPalette.Surface, RoundedCornerShape(GjRadius.xxl))
                    .padding(start = GjSpace.xl, end = GjSpace.xl, top = 40.dp, bottom = GjSpace.xl),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(GjSpace.lg),
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(GjSpace.xxs),
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
                    ) {
                        HappyMascot(reducedMotion)
                        Text(
                            text = stringResource(R.string.levelwin_complete),
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontWeight = FontWeight.ExtraBold, fontSize = 24.sp,
                            ),
                            color = GjPalette.Text,
                        )
                    }
                    Text(
                        text = stringResource(R.string.levelwin_level_world, level, worldName.uppercase()),
                        color = GjPalette.TextMuted,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 0.06.em,
                        fontFamily = MaterialTheme.typography.bodyLarge.fontFamily,
                    )
                }

                // Điểm + thống kê (design: ĐIỂM | THƯỞNG).
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
                ) {
                    StatCard(stringResource(R.string.levelwin_score_label), score.toString(), Modifier.weight(1f))
                    StatCard(statLabel, statValue, Modifier.weight(1f))
                }

                // Nút hành động.
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(GjSpace.sm),
                ) {
                    if (hasNext) {
                        GjButton(
                            onClick = onNext,
                            variant = BtnVariant.Success,
                            btnSize = BtnSize.Cta,
                            iconRight = GjIcons.Play,
                            fullWidth = true,
                        ) { Text(stringResource(R.string.levelwin_next)) }
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(GjSpace.sm)) {
                        GjButton(onClick = onReplay, variant = BtnVariant.Secondary, icon = GjIcons.Refresh,
                            fullWidth = true, modifier = Modifier.weight(1f)) { Text(stringResource(R.string.levelwin_replay)) }
                        GjButton(onClick = onHome, variant = BtnVariant.Secondary, icon = GjIcons.Home,
                            fullWidth = true, modifier = Modifier.weight(1f)) { Text(stringResource(R.string.levelwin_map)) }
                    }
                }
            }

            // 3 sao chồm lên đỉnh card — sibling căn giữa-trên, không bị cắt.
            WinStars(stars, reducedMotion, Modifier.align(Alignment.TopCenter))
        }
    }
}

// ── 3 sao (giữa cao + lớn hơn, design EX.Stars size 56) ────────────────────────────────────────
@Composable
private fun WinStars(earned: Int, reducedMotion: Boolean, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.Bottom,
        horizontalArrangement = Arrangement.spacedBy(GjSpace.xs),
    ) {
        WinStar(earned >= 1, 56.dp)
        WinStar(earned >= 2, 66.dp, Modifier.offset(y = (-10).dp))   // giữa cao + lớn
        WinStar(earned >= 3, 56.dp)
    }
}

@Composable
private fun WinStar(filled: Boolean, sizeDp: Dp, modifier: Modifier = Modifier) {
    Image(
        painter = painterResource(if (filled) R.drawable.star_on else R.drawable.star_off),
        contentDescription = null,
        modifier = modifier.size(sizeDp),
    )
}

// ── Mascot mint happy nhún (design JellyBlock happy + gj-bob 1400ms translateY -8) ──────────────
@Composable
private fun HappyMascot(reducedMotion: Boolean) {
    val bobY = if (reducedMotion) {
        0f
    } else {
        val t = rememberInfiniteTransition(label = "mascot-bob")
        t.animateFloat(
            initialValue = 0f, targetValue = -8f,
            animationSpec = infiniteRepeatable(tween(1400, easing = LinearEasing), RepeatMode.Reverse),
            label = "bob",
        ).value
    }
    LivingJellyThumbnail(
        piece = Piece(PieceLibrary.DOT, JellyColor.MINT),
        seed = 7,
        modifier = Modifier.size(40.dp).offset(y = bobY.dp),
        cellDp = 36f,
        glanceDir = Direction.DOWN,
    )
}

// ── Ô thống kê (nền sunken, nhãn nhỏ + số) ─────────────────────────────────────────────────────
@Composable
private fun StatCard(label: String, value: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(GjRadius.lg))
            .background(GjPalette.SurfaceSunken)
            .padding(GjSpace.md),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(GjSpace.xxs),
    ) {
        Text(
            text = label,
            color = GjPalette.TextMuted,
            fontSize = 11.sp,
            fontWeight = FontWeight.ExtraBold,
            letterSpacing = 0.06.em,
            fontFamily = MaterialTheme.typography.bodyLarge.fontFamily,
        )
        Text(
            text = value,
            color = GjPalette.Text,
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.ExtraBold, fontSize = 24.sp),
            maxLines = 1,
        )
    }
}

// ── Confetti ───────────────────────────────────────────────────────────────────────────────────
private val CONFETTI = listOf(
    Color(0xFFFFE3A3),   // block yellow
    Color(0xFFA3E5D9),   // block mint
    Color(0xFFF7A9C0),   // block pink
    Color(0xFFB3C7F7),   // block blue
    Color(0xFFFF9F68),   // primary
)

/**
 * Một mảnh confetti rơi lặp vô hạn (design `gj-confetti-fall`: y −20→cao, xoay 320°, fade 12% đầu).
 * Vị trí/khoảng thời gian theo công thức index của design để trải đều, không ngẫu nhiên (deterministic).
 */
@Composable
private fun BoxScope.ConfettiPiece(index: Int, containerW: Dp, containerH: Dp) {
    val leftPct = (index * 53 + 12) % 100
    val sizePx = (8 + (index % 3) * 4).dp
    val durMs = 2200 + (index % 5) * 320
    val delayMs = (index % 7) * 240
    val color = CONFETTI[index % CONFETTI.size]
    val round = if (index % 2 == 0) RoundedCornerShape(3.dp) else CircleShape

    val t = rememberInfiniteTransition(label = "confetti$index")
    val p by t.animateFloat(
        initialValue = 0f, targetValue = 1f,
        animationSpec = infiniteRepeatable(
            tween(durMs, easing = LinearEasing),
            initialStartOffset = StartOffset(delayMs),
        ),
        label = "fall",
    )

    val y = (-20).dp + (containerH + 40.dp) * p
    val x = containerW * (leftPct / 100f)
    val alpha = when {
        p < 0.12f -> p / 0.12f
        else -> (1f - (p - 0.12f) / 0.88f).coerceIn(0f, 1f)
    }

    Box(
        Modifier
            .align(Alignment.TopStart)
            .offset(x = x, y = y)
            .size(sizePx)
            .clip(round)
            .background(color.copy(alpha = color.alpha * alpha)),
    )
}
