package com.gravityjelly.app

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
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
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PieceLibrary
import com.gravityjelly.game.EyeExpression
import com.gravityjelly.game.LivingJellyThumbnail

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
 * **Popup** (scrim mờ bàn phía sau, KHÔNG phải màn hình đục) — như [LevelWinScreen]. Card mềm canh
 * giữa (theo `result-screen.jsx`): **mascot jelly hồng** nhô lên nửa trên mép card, tiêu đề
 * "Hết chỗ đặt!", badge "KỶ LỤC MỚI!" khi đạt kỷ lục, hàng điểm cuối / kỷ lục, rồi hàng nút
 * Chơi lại · Về Home.
 *
 * Rewarded actions (Hồi sinh · x2 điểm) — **tạm ẩn**: design mới đã bỏ nút x2, còn cơ chế "hồi
 * sinh" (chơi tiếp cùng bàn) chưa chốt nên chưa hiện nút. Callback [onReviveAd]/[onDoubleAd] giữ
 * nguyên trong chữ ký + luồng ad ở [EndlessGameScreen] để bật lại khi cơ chế được định nghĩa.
 *
 * Luồng một chiều: nút → callback đẩy lên :app (shell) đổi màn / gọi Services (AdMob).
 *
 * [score]: điểm cuối ván. [best]: kỷ lục hiện có (đã gồm ván này nếu là kỷ lục mới).
 */
@Composable
fun ResultScreen(
    score: Int,
    best: Int,
    @Suppress("UNUSED_PARAMETER") onReviveAd: () -> Unit,   // giữ cho revive tương lai (đang ẩn)
    @Suppress("UNUSED_PARAMETER") onDoubleAd: () -> Unit,   // x2 đã bỏ theo design (giữ để bật lại)
    onReplay: () -> Unit,
    onHome: () -> Unit,
    modifier: Modifier = Modifier,
) {
    // Kỷ lục mới khi điểm ván này chạm/vượt kỷ lục (best đã được cập nhật trước đó).
    val isNewBest = score >= best && score > 0

    // POPUP: scrim mờ (GjPalette.Overlay) phủ bàn phía sau — không phải màn hình đục. Card canh giữa.
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(GjPalette.Overlay),
        contentAlignment = Alignment.Center,
    ) {
        // Bọc ngoài để mascot là SIBLING chồm lên đỉnh card (background CÓ shape, KHÔNG .clip →
        // không cắt mascot). Bám result-screen.jsx: JellyBlock hồng nhô trên mép card.
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .widthIn(max = 360.dp)
                .padding(horizontal = GjSpace.lg),
        ) {
            // Card mềm: nền trắng, bo card lớn, shadow lg. padding(top) chừa chỗ mascot chồm lên.
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 30.dp)                 // chừa chỗ cho mascot nhô lên trên
                    .shadow(
                        elevation = 18.dp,
                        shape = RoundedCornerShape(GjRadius.xxl),
                        ambientColor = GjPalette.ShadowSoft,
                        spotColor = GjPalette.ShadowKey,
                    )
                    .background(GjPalette.Surface, RoundedCornerShape(GjRadius.xxl))
                    // top rộng hơn: mascot chìm ~32dp vào card (tâm ở mép) → chữ phải nằm DƯỚI đáy
                    // mascot, không bị che. 44dp = 32 (mascot) + ~12 khoảng thở.
                    .padding(start = GjSpace.xl, end = GjSpace.xl, bottom = GjSpace.xl, top = 44.dp),
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
                        // design result-screen.jsx: --text-title (28) weight 800; đồng bộ với
                        // LevelWinScreen "Hoàn thành!" (extrabold 24) cho hai popup cùng tông.
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontWeight = FontWeight.ExtraBold, fontSize = 24.sp,
                        ),
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

                // ── Nút điều hướng — Chơi lại | Về Home cạnh nhau (result-screen.jsx nav row) ──
                // Nhãn 1 dòng (softWrap=false) + gap sm để "Về Home" không bị xuống hàng khi chia đôi.
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
                ) {
                    // Chơi lại ngay một ván mới.
                    GjButton(
                        onClick = onReplay,
                        variant = BtnVariant.Secondary,
                        icon = GjIcons.Refresh,
                        fullWidth = true,
                        modifier = Modifier.weight(1f),
                    ) { Text("Chơi lại", maxLines = 1, softWrap = false) }

                    // Quay về màn Home.
                    GjButton(
                        onClick = onHome,
                        variant = BtnVariant.Ghost,
                        icon = GjIcons.Home,
                        fullWidth = true,
                        modifier = Modifier.weight(1f),
                    ) { Text("Về Home", maxLines = 1, softWrap = false) }
                }
            }

            // ── Mascot jelly hồng — sibling chồm lên nửa trên đỉnh card ──────────────
            DefeatedMascot(Modifier.align(Alignment.TopCenter))
        }
    }
}

// ── DefeatedMascot: khối jelly hồng mặt buồn nhô lên mép đỉnh card ────────────────
//
// Bám result-screen.jsx: <JellyBlock color="pink" size={64} /> ở đỉnh card. KHÔNG dùng pose
// squashed của design (nén méo mắt — phản hồi người chơi). Mặt TĨNH buồn (animate=false, SAD).
// offset -2: nửa trên nhô ra ngoài, TÂM nằm ngay trên đường mép trên của card (card padding top 30
// ⇒ mép ở y=30; mascot 64, tâm = offset+32 = 30).
@Composable
private fun DefeatedMascot(modifier: Modifier = Modifier) {
    LivingJellyThumbnail(
        piece = Piece(PieceLibrary.DOT, JellyColor.PINK),
        seed = 3,
        animate = false,                             // khung tĩnh, không chớp/nháy/liếc
        staticExpression = EyeExpression.SAD,        // mặt xịu buồn "hết chỗ"
        cellDp = 60f,
        modifier = modifier
            .size(64.dp)
            .offset(y = (-2).dp),
    )
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
