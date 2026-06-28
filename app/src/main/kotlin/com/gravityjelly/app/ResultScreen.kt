package com.gravityjelly.app

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.layout.GjScreenScaffold
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme

// ── format số kiểu Việt Nam (1.234.567) ────────────────────────────────────────

/** Chèn dấu chấm phân nhóm hàng nghìn theo định dạng VN. Ví dụ: 18920 → "18.920". */
private fun Int.toViScore(): String =
    toString().reversed().chunked(3).joinToString(".").reversed()

// ── ScoreStat: một cột điểm (nhãn nhỏ + số lớn) ─────────────────────────────────

/**
 * Một ô thống kê điểm trong hàng. [accent] = true → số to (displayLarge, màu Text),
 * false → số nhỏ hơn (headlineLarge, màu muted) cho cột kỷ lục.
 */
@Composable
private fun ScoreStat(
    label: String,
    value: Int,
    accent: Boolean,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(GjSpace.xxs),
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.04.sp,
            ),
            color = GjPalette.TextMuted,
            textAlign = TextAlign.Center,
        )
        Text(
            text = value.toViScore(),
            style = if (accent) MaterialTheme.typography.displayLarge
                    else MaterialTheme.typography.headlineLarge,
            color = if (accent) GjPalette.Text else GjPalette.TextMuted,
            textAlign = TextAlign.Center,
        )
    }
}

// ── ResultScreen ────────────────────────────────────────────────────────────────

/**
 * Màn Result — kết thúc một ván Endless.
 *
 * Card mềm canh giữa (theo `result-screen.jsx`): tiêu đề "Hết chỗ đặt!",
 * badge "KỶ LỤC MỚI!" khi đạt kỷ lục, hàng điểm cuối / kỷ lục, rồi các nút
 * hành động xếp dọc (hồi sinh · xem QC, x2 điểm · xem QC, chơi lại, về Home).
 *
 * Luồng một chiều: nút → callback đẩy lên :app (shell) đổi màn / gọi Services (AdMob).
 *
 * [score]: điểm cuối ván. [best]: kỷ lục hiện có (đã gồm ván này nếu là kỷ lục mới).
 */
@Composable
fun ResultScreen(
    score: Int,
    best: Int,
    onReviveAd: () -> Unit,
    onDoubleAd: () -> Unit,
    onReplay: () -> Unit,
    onHome: () -> Unit,
    modifier: Modifier = Modifier,
) {
    // Kỷ lục mới khi điểm ván này chạm/vượt kỷ lục (best đã được cập nhật trước đó).
    val isNewBest = score >= best && score > 0

    GjScreenScaffold(modifier = modifier, contentAlignment = Alignment.Center) {
        // Card mềm: nền trắng, bo card lớn, shadow lg, canh giữa.
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .widthIn(max = 360.dp)
                .shadow(
                    elevation = 18.dp,
                    shape = RoundedCornerShape(GjRadius.xxl),
                    ambientColor = GjPalette.ShadowSoft,
                    spotColor = GjPalette.ShadowKey,
                )
                .background(GjPalette.Surface, RoundedCornerShape(GjRadius.xxl))
                .padding(GjSpace.xl),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(GjSpace.lg),
        ) {
            // ── Tiêu đề + badge kỷ lục ──────────────────────────────────────────
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(GjSpace.sm),
            ) {
                Text(
                    text = "Hết chỗ đặt!",
                    style = MaterialTheme.typography.headlineMedium,
                    color = GjPalette.Text,
                    textAlign = TextAlign.Center,
                )
                if (isNewBest) {
                    NewBestBadge()
                }
            }

            // ── Hàng điểm: ĐIỂM (lớn) | divider | KỶ LỤC ───────────────────────
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(IntrinsicSize.Min),
                verticalAlignment = Alignment.Bottom,
                horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
            ) {
                ScoreStat(
                    label = "ĐIỂM",
                    value = score,
                    accent = true,
                    modifier = Modifier.weight(1f),
                )
                // Vạch ngăn dọc mảnh
                Box(
                    modifier = Modifier
                        .width(1.dp)
                        .fillMaxHeight()
                        .background(GjPalette.CellLine),
                )
                ScoreStat(
                    label = "KỶ LỤC",
                    value = best,
                    accent = false,
                    modifier = Modifier.weight(1f),
                )
            }

            // ── Nút hành động — xếp dọc, full-width, gap sm ──────────────────────
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(GjSpace.sm),
            ) {
                // Hồi sinh qua quảng cáo thưởng (rewarded) — nhấn nhất, dùng Gravity (accent chữ ký).
                GjButton(
                    onClick = onReviveAd,
                    variant = BtnVariant.Gravity,
                    icon = GjIcons.Heart,
                    fullWidth = true,
                ) { Text("Hồi sinh · xem QC") }

                // Nhân đôi điểm qua quảng cáo thưởng.
                GjButton(
                    onClick = onDoubleAd,
                    variant = BtnVariant.Primary,
                    icon = GjIcons.X2,
                    fullWidth = true,
                ) { Text("x2 điểm · xem QC") }

                // Chơi lại ngay một ván mới.
                GjButton(
                    onClick = onReplay,
                    variant = BtnVariant.Secondary,
                    icon = GjIcons.Refresh,
                    fullWidth = true,
                ) { Text("Chơi lại") }

                // Quay về màn Home.
                GjButton(
                    onClick = onHome,
                    variant = BtnVariant.Ghost,
                    icon = GjIcons.Home,
                    fullWidth = true,
                ) { Text("Về Home") }
            }
        }
    }
}

// ── NewBestBadge: pill "KỶ LỤC MỚI!" ───────────────────────────────────────────

/** Nhãn pill nền Star (vàng) + icon ngôi sao — hiện khi đạt kỷ lục mới. */
@Composable
private fun NewBestBadge() {
    Row(
        modifier = Modifier
            .background(GjPalette.Star, RoundedCornerShape(GjRadius.full))
            .padding(horizontal = GjSpace.md, vertical = GjSpace.xs),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(GjSpace.xs),
    ) {
        GjIcon(
            icon = GjIcons.Star,
            modifier = Modifier.size(16.dp),
            tint = GjPalette.Text,
        )
        Text(
            text = "KỶ LỤC MỚI!",
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.04.sp,
            ),
            color = GjPalette.Text,
        )
    }
}

// ── previews ──────────────────────────────────────────────────────────────────

@Preview(name = "Result — điểm < kỷ lục", widthDp = 360, heightDp = 720)
@Composable
private fun ResultScreenPreview() {
    GravityJellyTheme {
        ResultScreen(
            score = 18920,
            best = 28640,
            onReviveAd = {},
            onDoubleAd = {},
            onReplay = {},
            onHome = {},
        )
    }
}

@Preview(name = "Result — kỷ lục mới", widthDp = 360, heightDp = 720)
@Composable
private fun ResultScreenNewBestPreview() {
    GravityJellyTheme {
        ResultScreen(
            score = 31200,
            best = 31200,
            onReviveAd = {},
            onDoubleAd = {},
            onReplay = {},
            onHome = {},
        )
    }
}
