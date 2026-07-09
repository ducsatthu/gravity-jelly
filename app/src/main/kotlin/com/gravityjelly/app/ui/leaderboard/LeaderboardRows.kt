package com.gravityjelly.app.ui.leaderboard

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.R
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace

// màu huy hiệu hạng theo dòng (leaderboard-screen.jsx BADGE)
private val BADGE = mapOf(
    4 to (Color(0xFF8C7CF3) to Color(0xFF6353D6)),
    5 to (Color(0xFFF3C85B) to Color(0xFFD9A33A)),
    6 to (Color(0xFF66C9B8) to Color(0xFF45A895)),
    7 to (Color(0xFF8FAAEE) to Color(0xFF6A88DB)),
    8 to (Color(0xFFF090B4) to Color(0xFFDC6494)),
    9 to (Color(0xFFFFAE7C) to Color(0xFFEE8248)),
    10 to (Color(0xFF6FD79E) to Color(0xFF49B679)),
)

@Composable
private fun RankBadge(rank: Int) {
    val (a, b) = BADGE[rank] ?: (Color(0xFFC9BCA8) to Color(0xFFA89A82))
    Box(
        Modifier.size(46.dp).clip(RoundedCornerShape(14.dp))
            .background(Brush.verticalGradient(listOf(a, b))),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            "$rank",
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold, fontSize = 19.sp),
            color = Color.White,
        )
    }
}

/** Dòng xếp hạng thường (hạng 4–10). */
@Composable
fun LbRow(rank: Int, name: String, score: Int) {
    Surface(shape = RoundedCornerShape(GjRadius.lg), color = GjPalette.Surface, shadowElevation = 2.dp) {
        Row(
            Modifier.fillMaxWidth().padding(start = 12.dp, end = 18.dp, top = 10.dp, bottom = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
        ) {
            RankBadge(rank)
            Text(
                name, modifier = Modifier.weight(1f),
                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.ExtraBold, fontSize = 18.sp),
                color = GjPalette.Text, maxLines = 1, overflow = TextOverflow.Ellipsis,
            )
            Text(
                formatScore(score),
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold, fontSize = 20.sp),
                color = GjPalette.GravityEdge,
            )
        }
    }
}

/** Hàng của bạn (ghim) — badge tangerine hạng + tên + nhãn BẠN + (tuỳ chọn) bút đổi tên + điểm. */
@Composable
fun YouRow(rank: Int, name: String, score: Int, onEdit: (() -> Unit)? = null) {
    Row(
        Modifier.fillMaxWidth()
            .clip(RoundedCornerShape(GjRadius.lg))
            .background(GjPalette.Primary.copy(alpha = 0.12f).compositeOverSurface())
            .border(2.dp, GjPalette.Primary, RoundedCornerShape(GjRadius.lg))
            .padding(start = 12.dp, end = 18.dp, top = 10.dp, bottom = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
    ) {
        Box(
            Modifier.defaultMinSize(minWidth = 60.dp).height(46.dp).clip(RoundedCornerShape(14.dp))
                .background(Brush.verticalGradient(listOf(Color(0xFFFFE0C6), Color(0xFFFFCBA6))))
                .padding(horizontal = 10.dp),
            contentAlignment = Alignment.Center,
        ) {
            Text(
                if (rank > 0) "$rank" else "—",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold, fontSize = 18.sp),
                color = GjPalette.PrimaryEdge,
            )
        }
        Row(Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(GjSpace.sm)) {
            // tên tự co cho vừa (hiện đủ tên dài, không cắt) — như tên trong khung bục
            AutoResizeText(
                text = name, color = GjPalette.Text,
                baseStyle = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.ExtraBold),
                maxFontSize = 18.sp, minFontSize = 9.sp,
                modifier = Modifier.weight(1f, fill = false),
            )
            Box(
                Modifier.clip(RoundedCornerShape(GjRadius.full))
                    .background(GjPalette.Primary.copy(alpha = 0.24f).compositeOverSurface())
                    .padding(horizontal = 8.dp, vertical = 3.dp),
            ) {
                Text(
                    stringResource(R.string.leaderboard_you_badge),
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.ExtraBold, fontSize = 10.sp, letterSpacing = 0.6.sp),
                    color = GjPalette.PrimaryEdge,
                )
            }
            if (onEdit != null) {
                Box(
                    Modifier.size(26.dp).clip(RoundedCornerShape(GjRadius.full))
                        .pointerInput(Unit) { detectTapGestures(onTap = { onEdit() }) },
                    contentAlignment = Alignment.Center,
                ) {
                    GjIcon(GjIcons.Pencil, contentDescription = stringResource(R.string.leaderboard_edit_name),
                        modifier = Modifier.size(16.dp), tint = GjPalette.PrimaryEdge)
                }
            }
        }
        Text(
            formatScore(score),
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold, fontSize = 20.sp),
            color = GjPalette.PrimaryEdge,
        )
    }
}

/**
 * Text tự co cỡ chữ cho vừa 1 dòng trong bề rộng cấp phát (Compose BOM 2024.09 chưa có autoSize).
 * Đo qua onTextLayout: còn tràn + chưa chạm sàn → hạ 1sp rồi đo lại; ổn định thì bật vẽ.
 * drawWithContent giữ chữ ẩn tới khi cỡ ổn định (tránh nhấp nháy). remember theo (text,max) → đổi tên reset.
 * Dùng chung cho tên trong khung bục (FrameSlot) và hàng "Bạn" (YouRow).
 */
@Composable
fun AutoResizeText(
    text: String,
    color: Color,
    baseStyle: TextStyle,
    maxFontSize: TextUnit,
    minFontSize: TextUnit,
    modifier: Modifier = Modifier,
) {
    var fontSize by remember(text, maxFontSize) { mutableStateOf(maxFontSize) }
    var ready by remember(text, maxFontSize) { mutableStateOf(false) }
    Text(
        text, color = color, maxLines = 1, softWrap = false, overflow = TextOverflow.Ellipsis,
        modifier = modifier.drawWithContent { if (ready) drawContent() },
        style = baseStyle.copy(fontSize = fontSize),
        onTextLayout = { result ->
            if (!ready) {
                if (result.hasVisualOverflow && fontSize.value > minFontSize.value) {
                    fontSize = (fontSize.value - 1f).coerceAtLeast(minFontSize.value).sp
                } else {
                    ready = true
                }
            }
        },
    )
}

// trộn màu bán trong suốt trên nền surface trắng (tránh nền trong suốt lộ gradient nền)
private fun Color.compositeOverSurface(): Color {
    val a = alpha
    return Color(
        red = red * a + 1f * (1 - a),
        green = green * a + 1f * (1 - a),
        blue = blue * a + 1f * (1 - a),
    )
}
