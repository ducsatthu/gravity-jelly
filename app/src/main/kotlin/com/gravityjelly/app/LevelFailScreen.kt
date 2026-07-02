package com.gravityjelly.app

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PieceLibrary
import com.gravityjelly.game.EyeExpression
import com.gravityjelly.game.LivingJellyThumbnail

/**
 * Overlay **THUA MÀN Campaign** — bí nước (không còn chỗ đặt mảnh nào). Cùng ngôn ngữ với popup
 * Result Endless ([ResultScreen]) và Win ([LevelWinScreen]): **POPUP** scrim mờ bàn + card mềm,
 * **mascot jelly hồng mặt buồn** nhô lên mép trên card, tiêu đề + lời nhắn, rồi hàng nút
 * Chơi lại · Bản đồ. Không tự chế style mới — tái dùng card/mascot/nút của design system.
 *
 * @param onReplay chơi lại màn (reset). @param onHome về danh sách màn ("Bản đồ" như [LevelWinScreen]).
 * @param objective nhãn MỤC TIÊU chưa đạt của màn (vd "Phá 5 gốc dây leo"); null → ẩn ô nhắc.
 * @param objectiveProgress tiến độ ngắn khi thua (vd "2/5", "1200/3000đ"); null → chỉ hiện nhãn.
 */
@Composable
fun LevelFailScreen(
    onReplay: () -> Unit,
    onHome: () -> Unit,
    modifier: Modifier = Modifier,
    title: String = "Bí nước rồi!",
    message: String = "Không còn chỗ đặt mảnh. Thử lại nhé!",
    objective: String? = null,
    objectiveProgress: String? = null,
) {
    // POPUP: scrim mờ (GjPalette.Overlay) phủ bàn phía sau; card canh giữa.
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(GjPalette.Overlay),
        contentAlignment = Alignment.Center,
    ) {
        // Bọc ngoài để mascot là SIBLING chồm lên mép card (bg CÓ shape, KHÔNG .clip → không cắt).
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .widthIn(max = 360.dp)
                .padding(horizontal = GjSpace.lg),
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 30.dp)                 // chừa chỗ mascot nhô lên
                    .shadow(
                        elevation = 18.dp,
                        shape = RoundedCornerShape(GjRadius.xxl),
                        ambientColor = GjPalette.ShadowSoft,
                        spotColor = GjPalette.ShadowKey,
                    )
                    .background(GjPalette.Surface, RoundedCornerShape(GjRadius.xxl))
                    // top rộng: mascot chìm ~32dp vào card (tâm ở mép) → chữ nằm DƯỚI đáy mascot.
                    .padding(start = GjSpace.xl, end = GjSpace.xl, bottom = GjSpace.xl, top = 44.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(GjSpace.lg),
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(GjSpace.sm),
                ) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontWeight = FontWeight.ExtraBold, fontSize = 24.sp,
                        ),
                        color = GjPalette.Text,
                        textAlign = TextAlign.Center,
                    )
                    Text(
                        text = message,
                        style = MaterialTheme.typography.bodyLarge.copy(color = GjPalette.TextMuted),
                        textAlign = TextAlign.Center,
                    )
                }

                // Ô nhắc MỤC TIÊU chưa đạt (nền sunken như StatCard màn thắng).
                if (objective != null) {
                    ObjectiveReminder(objective, objectiveProgress)
                }

                // Nút: Chơi lại (CTA chính) | Bản đồ. Nhãn 1 dòng để không xuống hàng khi chia đôi.
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
                ) {
                    GjButton(
                        onClick = onReplay,
                        variant = BtnVariant.Primary,
                        icon = GjIcons.Refresh,
                        fullWidth = true,
                        modifier = Modifier.weight(1f),
                    ) { Text("Chơi lại", maxLines = 1, softWrap = false) }

                    GjButton(
                        onClick = onHome,
                        variant = BtnVariant.Ghost,
                        icon = GjIcons.Home,
                        fullWidth = true,
                        modifier = Modifier.weight(1f),
                    ) { Text("Bản đồ", maxLines = 1, softWrap = false) }
                }
            }

            // Mascot jelly hồng mặt buồn — tâm nằm trên đường mép trên card (như ResultScreen).
            SadMascot(Modifier.align(Alignment.TopCenter))
        }
    }
}

// ── ObjectiveReminder: ô nhắc MỤC TIÊU chưa đạt (nền sunken, nhãn nhỏ + text mục tiêu [+ tiến độ]) ──
@Composable
private fun ObjectiveReminder(objective: String, progress: String?) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(GjRadius.lg))
            .background(GjPalette.SurfaceSunken)
            .padding(GjSpace.md),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(GjSpace.xxs),
    ) {
        Text(
            text = "MỤC TIÊU CHƯA ĐẠT",
            color = GjPalette.TextMuted,
            fontSize = 11.sp,
            fontWeight = FontWeight.ExtraBold,
            letterSpacing = 0.06.em,
            fontFamily = MaterialTheme.typography.bodyLarge.fontFamily,
        )
        Text(
            text = objective,
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.ExtraBold, fontSize = 18.sp,
            ),
            color = GjPalette.Text,
            textAlign = TextAlign.Center,
        )
        if (progress != null) {
            Text(
                text = progress,
                style = MaterialTheme.typography.bodyLarge.copy(color = GjPalette.TextMuted),
            )
        }
    }
}

// ── SadMascot: khối jelly hồng mặt buồn nhô lên mép đỉnh card (giống ResultScreen.DefeatedMascot) ──
@Composable
private fun SadMascot(modifier: Modifier = Modifier) {
    LivingJellyThumbnail(
        piece = Piece(PieceLibrary.DOT, JellyColor.PINK),
        seed = 3,
        animate = false,
        staticExpression = EyeExpression.SAD,
        cellDp = 60f,
        modifier = modifier
            .size(64.dp)
            .offset(y = (-2).dp),
    )
}

// ── preview ─────────────────────────────────────────────────────────────────────
@Preview(name = "LevelFail — bí nước", widthDp = 360, heightDp = 720)
@Composable
private fun LevelFailScreenPreview() {
    GravityJellyTheme {
        LevelFailScreen(onReplay = {}, onHome = {})
    }
}
