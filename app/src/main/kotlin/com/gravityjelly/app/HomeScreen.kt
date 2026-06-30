package com.gravityjelly.app

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.components.BtnSize
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.layout.GjScreenScaffold
import com.gravityjelly.app.ui.theme.GjLogoFontFamily
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.core.Direction
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PieceLibrary
import com.gravityjelly.game.LivingJellyThumbnail

/**
 * Màn Home: chip kỷ lục (trên) · logo jelly + wordmark (giữa) · cụm nút hành động (dưới).
 * Bố cục khớp design/04-screens/home-screen.jsx.
 *
 * Điều hướng đẩy lên :app (shell). Luồng một chiều: UI → callback → đổi màn.
 * Được phép import :game (PieceThumbnail) và :core (Piece/PieceLibrary) — đúng kiến trúc.
 */
@Composable
fun HomeScreen(
    best: Int,
    onPlayEndless: () -> Unit,
    onSettings: () -> Unit,
    onHandbook: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    GjScreenScaffold(modifier = modifier, contentAlignment = Alignment.TopCenter) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                // scaffold đã có gutter 16dp; +8dp = 24dp (space-xl) đúng JSX padding.
                .padding(horizontal = GjSpace.sm, vertical = GjSpace.xl),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            // ── Chip kỷ lục (trên cùng) ──────────────────────────────────────────
            BestScoreChip(best = best)

            // ── Logo (chiếm khoảng giữa, canh giữa) ──────────────────────────────
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center,
            ) {
                Logo()
            }

            // ── Cụm nút hành động (dưới cùng) ─────────────────────────────────────
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(GjSpace.md),
            ) {
                // CTA chính: vào Endless
                GjButton(
                    onClick = onPlayEndless,
                    variant = BtnVariant.Primary,
                    btnSize = BtnSize.Cta,
                    icon = GjIcons.Play,
                    fullWidth = true,
                ) { Text("CHƠI · ENDLESS") }

                // Hàng dưới: Cài đặt · Cẩm nang (tạm thay Daily — chưa làm Daily).
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
                ) {
                    GjButton(
                        onClick = onSettings,
                        modifier = Modifier.weight(1f),
                        variant = BtnVariant.Secondary,
                        icon = GjIcons.Settings,
                        fullWidth = true,
                    ) { Text("Cài đặt") }

                    // Cẩm nang: danh sách luật đã thu thập, bấm mở popup như in-game.
                    GjButton(
                        onClick = onHandbook,
                        modifier = Modifier.weight(1f),
                        variant = BtnVariant.Secondary,
                        icon = GjIcons.Info,
                        fullWidth = true,
                    ) { Text("Cẩm nang") }
                }
            }
        }
    }
}

// ── Logo: hàng 4 khối jelly nghiêng + wordmark GRAVITY / JELLY ──────────────────

@Composable
private fun Logo() {
    val density = LocalDensity.current
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        // Hàng 4 khối jelly (pink/yellow/mint/blue), mỗi khối ~52dp, nghiêng vài độ
        // và lệch dọc nhẹ — khớp JSX (gap 6, rotate -8/4/-4/8, marginTop 8/0/10/2).
        //
        // Mắt "sống" theo đúng design effects (nhìn thẳng + chớp/nháy + liếc hướng rồi về front).
        // Hiệu ứng + timing nằm trong LivingJellyThumbnail (:game), bám 05-effects & Eyes.jsx;
        // frame loop vsync + redraw-not-recompose; lệch pha theo seed nên các khối không đồng bộ.
        Row(
            verticalAlignment = Alignment.Top,
            horizontalArrangement = Arrangement.spacedBy(0.dp),  // ô có sẵn lề; gap thực ≈ 6dp
        ) {
            // Mỗi khối seed riêng (lệch pha) + hướng liếc ưa thích (JSX: pink←trái, mint→phải).
            JellyTile(JellyColor.PINK, rot = -8f, topGap = 8.dp, look = Direction.LEFT, seed = 0)
            JellyTile(JellyColor.YELLOW, rot = 4f, topGap = 0.dp, look = Direction.DOWN, seed = 1)
            JellyTile(JellyColor.MINT, rot = -4f, topGap = 10.dp, look = Direction.RIGHT, seed = 2)
            JellyTile(JellyColor.BLUE, rot = 8f, topGap = 2.dp, look = Direction.DOWN, seed = 3)
        }

        Spacer(Modifier.size(GjSpace.md))

        // Wordmark
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            // "GRAVITY": Fredoka, 24sp, in đậm, mờ (TextMuted), giãn ký tự 0.18em (JSX).
            Text(
                text = "GRAVITY",
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontFamily = GjLogoFontFamily,   // Fredoka (logo thuần Latin)
                    fontWeight = FontWeight.Bold,
                    fontSize = 24.sp,
                    lineHeight = 22.sp,               // wrapper lineHeight 0.92
                    letterSpacing = 0.18.em,
                ),
                color = GjPalette.TextMuted,
                textAlign = TextAlign.Center,
            )
            // "JELLY": Fredoka 56sp cực đậm, hồng khối jelly, viền + bóng candy 3D
            // (JSX: fontSize 56, WebkitTextStroke 2px pink-edge, textShadow 0 4px 0 pink-edge).
            val jellyBase = MaterialTheme.typography.displayLarge.copy(
                fontFamily = GjLogoFontFamily,
                fontWeight = FontWeight.Bold,
                fontSize = 56.sp,
                lineHeight = 52.sp,                   // 0.92 × 56
                letterSpacing = 0.02.em,
            )
            // 3 lớp candy: bóng đặc 3D (lệch 4dp) → viền pink-edge 2dp → thân hồng đầy.
            Box(contentAlignment = Alignment.Center) {
                // 1) bóng đặc: thân pink-edge đầy, lệch xuống 4dp (textShadow 0 4px 0)
                Text(
                    text  = "JELLY",
                    style = jellyBase,
                    color = GjPalette.BlockPinkEdge,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.offset(y = 4.dp),
                )
                // 2) viền pink-edge 2dp (WebkitTextStroke 2px)
                Text(
                    text  = "JELLY",
                    style = jellyBase.copy(drawStyle = Stroke(width = with(density) { 2.dp.toPx() })),
                    color = GjPalette.BlockPinkEdge,
                    textAlign = TextAlign.Center,
                )
                // 3) thân hồng đầy
                Text(
                    text  = "JELLY",
                    style = jellyBase,
                    color = GjPalette.BlockPink,
                    textAlign = TextAlign.Center,
                )
            }
        }
    }
}

/**
 * Một khối jelly đơn (shape 1 ô DOT), nghiêng [rot] độ, lệch xuống [topGap].
 * [look]: hướng liếc ưa thích; [seed]: pha animation riêng từng khối (lệch pha, không đồng bộ).
 */
@Composable
private fun JellyTile(
    color: JellyColor,
    rot: Float,
    topGap: androidx.compose.ui.unit.Dp,
    look: Direction = Direction.DOWN,
    seed: Int = 0,
) {
    // Ô 58dp (chừa lề cho xoay), khối vẽ ~52dp qua cellDp — khớp JellyBlock size=52 của design.
    LivingJellyThumbnail(
        piece = Piece(PieceLibrary.DOT, color),
        seed = seed,
        modifier = Modifier
            .padding(top = topGap)
            .size(58.dp)
            .rotate(rot),
        cellDp = 54f,
        glanceDir = look,
    )
}

// ── Chip kỷ lục: Trophy + "KỶ LỤC" + điểm định dạng VN ──────────────────────────

@Composable
private fun BestScoreChip(best: Int) {
    Surface(
        shape = RoundedCornerShape(GjRadius.full),
        color = GjPalette.Surface,
        modifier = Modifier.shadow(4.dp, RoundedCornerShape(GjRadius.full)),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = GjSpace.lg, vertical = GjSpace.sm),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
        ) {
            GjIcon(
                icon = GjIcons.Trophy,
                modifier = Modifier.size(18.dp),
                tint = GjPalette.Warning,
            )
            // Nhãn "KỶ LỤC" — small-caps, giãn ký tự
            Text(
                text = "KỶ LỤC",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.04.em,
                ),
                color = GjPalette.TextMuted,
            )
            // Số điểm định dạng kiểu VN: 12.480 — font display (Baloo 2) weight 800,
            // 16sp (text-body) khớp JSX: font-display · weight-extra · text-body.
            // KHÔNG dùng GjLogoFontFamily (Fredoka chỉ cho logo wordmark).
            Text(
                text = best.toViScore(),
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 16.sp,
                    lineHeight = 20.sp,
                ),
                color = GjPalette.Text,
            )
        }
    }
}

// ── Tiện ích: định dạng điểm kiểu VN (12480 → "12.480") ─────────────────────────

/** Chèn dấu chấm phân tách hàng nghìn theo quy ước VN. Ví dụ: 12480 → "12.480". */
private fun Int.toViScore(): String =
    toString()
        .reversed()
        .chunked(3)
        .joinToString(".")
        .reversed()

// ── Preview ─────────────────────────────────────────────────────────────────────

@Preview(name = "Home + Logo", widthDp = 360, heightDp = 800)
@Composable
private fun HomeScreenPreview() {
    GravityJellyTheme {
        HomeScreen(
            best = 12480,
            onPlayEndless = {},
            onSettings = {},
            onHandbook = {},
        )
    }
}
