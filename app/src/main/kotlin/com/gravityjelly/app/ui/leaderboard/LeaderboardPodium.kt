package com.gravityjelly.app.ui.leaderboard

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ── bảng màu kim loại vàng/bạc/đồng (leaderboard-screen.jsx METAL) ──────────────
private class Metal(val top: Color, val bot: Color, val edge: Color, val ink: Color, val laurel: Color)
private val METAL = mapOf(
    1 to Metal(Color(0xFFFFE79A), Color(0xFFFFCB4E), Color(0xFFEBB43C), Color(0xFF8A5A12), Color(0xFFC98A1E)),
    2 to Metal(Color(0xFFECE7DB), Color(0xFFCFC7B6), Color(0xFFBDB4A1), Color(0xFF6E6555), Color(0xFF8C8474)),
    3 to Metal(Color(0xFFF6CFA6), Color(0xFFE7A876), Color(0xFFD5945F), Color(0xFF8A4E23), Color(0xFFB06B34)),
)

// ── vòng nguyệt quế ôm số hạng ──────────────────────────────────────────────────
@Composable
private fun Laurel(rank: Int, size: Dp, ink: Color, leaf: Color) {
    Box(Modifier.size(size), contentAlignment = Alignment.Center) {
        Canvas(Modifier.size(size)) {
            val u = this.size.width / 32f
            val stroke = Stroke(width = 1.1f * u)
            val left = Path().apply { moveTo(11f * u, 26f * u); cubicTo(7f * u, 22f * u, 5.5f * u, 17f * u, 8f * u, 8f * u) }
            val right = Path().apply { moveTo(21f * u, 26f * u); cubicTo(25f * u, 22f * u, 26.5f * u, 17f * u, 24f * u, 8f * u) }
            drawPath(left, leaf, alpha = 0.7f, style = stroke)
            drawPath(right, leaf, alpha = 0.7f, style = stroke)
            val pts = listOf(11f to 25f, 8f to 21f, 6.4f to 16.5f, 7f to 12f, 9f to 8f)
            for ((x, y) in pts) {
                drawOval(leaf, topLeft = androidx.compose.ui.geometry.Offset((x - 2.8f) * u, (y - 1.5f) * u),
                    size = androidx.compose.ui.geometry.Size(5.6f * u, 3f * u))
                drawOval(leaf, topLeft = androidx.compose.ui.geometry.Offset((32f - x - 2.8f) * u, (y - 1.5f) * u),
                    size = androidx.compose.ui.geometry.Size(5.6f * u, 3f * u))
            }
        }
        Text(
            "$rank",
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.ExtraBold, fontSize = (size.value * 0.44f).sp, lineHeight = (size.value * 0.44f).sp,
            ),
            color = ink,
        )
    }
}

/** Một cột bục (rank 1/2/3). Caller truyền [modifier] = Modifier.weight(1f) trong Row. */
@Composable
fun RowScope.Podium(rank: Int, name: String, score: Int, modifier: Modifier = Modifier) {
    val h = when (rank) { 1 -> 176.dp; 2 -> 132.dp; else -> 116.dp }
    val m = METAL[rank]!!
    val shape = RoundedCornerShape(topStart = 18.dp, topEnd = 18.dp)
    Column(modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
        if (rank == 1) {
            Crown(40.dp, Modifier.padding(bottom = 2.dp))
        }
        Box(
            Modifier
                .fillMaxWidth()
                .height(h)
                .clip(shape)
                .background(Brush.verticalGradient(0f to m.top, 0.68f to m.bot, 1f to m.bot)),
        ) {
            // viền trên sáng (candy 3D) + cạnh đáy tối
            Box(Modifier.fillMaxWidth().height(3.dp).align(Alignment.TopCenter)
                .background(m.top.copy(alpha = 0.55f).compositeOverWhite()))
            Column(
                Modifier.fillMaxWidth().padding(top = if (rank == 1) 18.dp else 12.dp, start = 4.dp, end = 4.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(2.dp),
            ) {
                Laurel(rank, if (rank == 1) 66.dp else 56.dp, m.ink, m.laurel)
                Text(
                    name,
                    style = MaterialTheme.typography.bodyLarge.copy(
                        fontWeight = FontWeight.ExtraBold, fontSize = if (rank == 1) 16.sp else 12.sp,
                    ),
                    color = m.ink, maxLines = 1, overflow = TextOverflow.Ellipsis,
                )
                Text(
                    formatScore(score),
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.ExtraBold, fontSize = if (rank == 1) 22.sp else 18.sp,
                    ),
                    color = m.ink,
                )
            }
        }
    }
}

// hỗ trợ trộn viền sáng trên nền trắng
private fun Color.compositeOverWhite(): Color {
    val a = alpha
    return Color(
        red = red * a + 1f * (1 - a),
        green = green * a + 1f * (1 - a),
        blue = blue * a + 1f * (1 - a),
    )
}
