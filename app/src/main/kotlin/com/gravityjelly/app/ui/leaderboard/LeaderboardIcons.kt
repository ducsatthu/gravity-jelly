package com.gravityjelly.app.ui.leaderboard

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp

// Bảng màu vương miện / sao — bám super-block/design (warning gold).
private val CrownFill = Color(0xFFFFCA66)
private val CrownEdge = Color(0xFFE2A82E)
private val StarFill = Color(0xFFFFC23D)
private val StarEdge = Color(0xFFE2A82E)

/** Vương miện #1 (3 chóp + viên ngọc) — viewBox 24×24 scale theo [size]. */
@Composable
fun Crown(size: Dp, modifier: Modifier = Modifier) {
    Canvas(modifier.size(size)) {
        val u = this.size.width / 24f
        fun p(x: Float, y: Float) = Offset(x * u, y * u)
        val body = Path().apply {
            moveTo(3f * u, 8f * u)
            lineTo(7f * u, 14f * u); lineTo(12f * u, 6f * u)
            lineTo(17f * u, 14f * u); lineTo(21f * u, 8f * u)
            lineTo(20f * u, 19f * u); lineTo(4f * u, 19f * u)
            close()
        }
        drawPath(body, CrownFill)
        drawPath(body, CrownEdge, style = Stroke(width = 1.6f * u))
        drawCircle(Color.White, 1.4f * u, p(3f, 8f))
        drawCircle(Color.White, 1.6f * u, p(12f, 6f))
        drawCircle(Color.White, 1.4f * u, p(21f, 8f))
    }
}

/** Sao đặc (trang trí confetti). */
@Composable
fun FilledStar(size: Dp, modifier: Modifier = Modifier) {
    Canvas(modifier.size(size)) {
        // sao 5 cánh nhọn: bán kính trong ≈ 0.4× ngoài (đúng tỉ lệ ngôi sao, không ra ngũ giác)
        val path = starPath(this, 5, this.size.width / 2f, this.size.width * 0.2f)
        drawPath(path, StarFill)
        drawPath(path, StarEdge, style = Stroke(width = this.size.width * 0.06f))
    }
}

/** Chiếc lá 3 lớp (thân + highlight + gân) — bám đúng 3 path Leaf trong leaderboard-screen.jsx. */
@Composable
fun Leaf(size: Dp, flip: Boolean = false, modifier: Modifier = Modifier) {
    Canvas(modifier.size(size)) {
        val u = this.size.width / 70f
        fun x(v: Float) = (if (flip) 70f - v else v) * u
        // thân lá — M4 56 C4 30 24 8 54 4 c2 26 -16 48 -50 52 z
        val body = Path().apply {
            moveTo(x(4f), 56f * u)
            cubicTo(x(4f), 30f * u, x(24f), 8f * u, x(54f), 4f * u)
            cubicTo(x(56f), 30f * u, x(38f), 52f * u, x(4f), 56f * u)
            close()
        }
        drawPath(body, Color(0xFF8FD08A))
        // highlight nhạt bên trong — M20 44 C14 30 30 14 52 12 c0 20 -14 34 -32 32 z
        val hi = Path().apply {
            moveTo(x(20f), 44f * u)
            cubicTo(x(14f), 30f * u, x(30f), 14f * u, x(52f), 12f * u)
            cubicTo(x(52f), 32f * u, x(38f), 46f * u, x(20f), 44f * u)
            close()
        }
        drawPath(hi, Color(0xFFA6DCA0), alpha = 0.7f)
        // gân lá — M14 50 C22 34 34 24 48 16
        val vein = Path().apply {
            moveTo(x(14f), 50f * u)
            cubicTo(x(22f), 34f * u, x(34f), 24f * u, x(48f), 16f * u)
        }
        drawPath(vein, Color(0xFF63B368), style = Stroke(width = 2.4f * u, cap = StrokeCap.Round))
    }
}

private fun starPath(ds: DrawScope, points: Int, outer: Float, inner: Float): Path {
    val cx = ds.size.width / 2f; val cy = ds.size.height / 2f
    val path = Path()
    val step = Math.PI / points
    for (i in 0 until points * 2) {
        val r = if (i % 2 == 0) outer else inner
        val a = -Math.PI / 2 + i * step
        path.apply {
            val px = cx + (r * Math.cos(a)).toFloat()
            val py = cy + (r * Math.sin(a)).toFloat()
            if (i == 0) moveTo(px, py) else lineTo(px, py)
        }
    }
    path.close()
    return path
}
