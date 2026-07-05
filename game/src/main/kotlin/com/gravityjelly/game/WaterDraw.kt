package com.gravityjelly.game

import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import com.gravityjelly.core.Vec
import com.gravityjelly.core.WaterSource
import kotlin.math.cos
import kotlin.math.sin

/**
 * Lớp SÀN nước — cơ chế Dòng chảy World 3 (Sông & Thác). Bám design system
 * `07-mechanics/world3-water-kit.jsx` (palette AQ + keyframe gjwSource/gjwRing/gjwNew) — KHÔNG tự chế
 * màu/timing. Vẽ TRƯỚC lớp jelly để khối "đứng trên nước". Allocation-free: tái dùng [waterPath],
 * animation liên tục suy từ `now` (nanos). Xem docs/02-thiet-ke-man/07-world-3-nhip-nuoc.md §8.
 */

// ── palette AQ (world3-water-kit.jsx:15-19) ──
private val AQ_deep = Color(0xFF12959F)
private val AQ_teal = Color(0xFF2FBFC7)
private val AQ_mid = Color(0xFF5FD2D6)
private val AQ_light = Color(0xFF9FE4E7)
private val AQ_pale = Color(0xFFD6F2F3)
private val AQ_core = Color(0xFFF1FCFC)
private val AQ_edge = Color(0xFF158A93)
private val AQ_foam = Color(0xFFEAFBFB)
private val AQ_dry = Color(0xFFC4BBAC)
private val AQ_dry2 = Color(0xFFB3A48C)
private val AQ_dryDark = Color(0xFF8A7E68)
private val AQ_dryMouth = Color(0xFF9C8E77)

private val waterPath = Path()
private val dropDash = floatArrayOf(0f, 0f)

private const val NANOS_PER_MS = 1_000_000L
private const val TWO_PI = 2f * Math.PI.toFloat()

/** Pha 0..1 tuần hoàn theo chu kỳ [periodMs] (cho breathe/ripple liên tục). */
private fun phase01(now: Long, periodMs: Long): Float {
    val ms = (now / NANOS_PER_MS) % periodMs
    return ms.toFloat() / periodMs
}

private val ribbonPath = Path()
private val ribbonDash = floatArrayOf(0f, 0f)

/**
 * Vẽ **một dải nước NỐI LIỀN** cho 1 nguồn (World 3 · Dòng chảy) — bám design `world3-water-kit.jsx`
 * `StreamPath`: một đường stroke bo góc (gradient light→teal) chạy dọc [source] `pos → flow`, có **sóng
 * trắng diễu** (marching dash), mũi tên xuôi dòng, foam ở ngọn, và **miệng nguồn hero** ở gốc. Nguồn khô
 * ([WaterSource.broken]) hoặc chưa mọc → chỉ vẽ ô nguồn. Allocation-aware: tái dùng [ribbonPath].
 *
 * Toạ độ ô tính từ [cellSize] (tâm ô = (x+0.5)·cellSize). Vẽ TRƯỚC lớp jelly (jelly đứng đè lên).
 */
internal fun DrawScope.drawWaterRibbon(
    source: WaterSource, cellSize: Float, blockSize: Float, cr: CornerRadius, now: Long,
    isPending: ((Vec) -> Boolean)? = null,
) {
    fun cx(v: Vec) = (v.x + 0.5f) * cellSize
    fun cy(v: Vec) = (v.y + 0.5f) * cellSize
    val srcLeft = source.pos.x * cellSize + (cellSize - blockSize) / 2f
    val srcTop = source.pos.y * cellSize + (cellSize - blockSize) / 2f

    // Nguồn khô → chỉ ô nguồn khô.
    if (source.broken) {
        drawWaterSourceCell(srcLeft, srcTop, blockSize, cr, 0, 1, broken = true, now = now)
        return
    }

    // [source.flow] là CÂY (có thể nhiều nhánh) — dựng đường theo CẠNH cha→con (ô kề mọc trước→ô mọc sau),
    // KHÔNG nối polyline theo thứ tự flow (tránh "gai" nối cuối-nhánh sang nhánh mới). Mỗi cạnh 1 ô.
    // ẨN ô nước MỚI mọc còn CHỜ hiện ([isPending]) → dải nước mọc dài SAU cascade (World 3). Ô mới mọc là
    // ngọn/lá nên bỏ đi chỉ rút ngắn nhánh, không mồ côi ô cũ.
    val cells = ArrayList<Vec>(source.flow.size + 1)
    cells.add(source.pos)
    for (f in source.flow) if (isPending == null || !isPending(f)) cells.add(f)

    // Chưa mọc (hoặc mọi ô mới còn chờ hiện) → chỉ ô nguồn (không dải).
    if (cells.size == 1) {
        drawWaterSourceCell(srcLeft, srcTop, blockSize, cr, 0, 1, broken = false, now = now)
        return
    }
    val order = HashMap<Int, Int>(cells.size * 2)   // packed(x,y) → chỉ số mọc
    for (i in cells.indices) order[cells[i].y * 100 + cells[i].x] = i
    fun parentOf(i: Int): Vec? {
        val c = cells[i]
        // ô kề (trên/trái/phải/dưới) đã là nước & mọc TRƯỚC = ô nguồn của nhánh
        for (nb in arrayOf(Vec(c.x, c.y - 1), Vec(c.x - 1, c.y), Vec(c.x + 1, c.y), Vec(c.x, c.y + 1))) {
            val j = order[nb.y * 100 + nb.x] ?: continue
            if (j < i) return nb
        }
        return null
    }

    val p = ribbonPath
    p.reset()
    val isParent = HashSet<Int>()
    var minY = cy(source.pos); var maxY = minY
    for (c in cells) { val y = cy(c); if (y < minY) minY = y; if (y > maxY) maxY = y }
    for (i in 1 until cells.size) {
        val par = parentOf(i) ?: continue
        p.moveTo(cx(par), cy(par)); p.lineTo(cx(cells[i]), cy(cells[i]))
        isParent.add(order.getValue(par.y * 100 + par.x))
    }

    val cross = blockSize * 0.84f
    val grad = Brush.verticalGradient(listOf(AQ_light, AQ_mid, AQ_teal), startY = minY, endY = maxY + cross)

    // lõi sáng → thân gradient → ánh trắng → 2 vệt sóng diễu (bám StreamPath dPath)
    p.strokeRibbon(this, AQ_core, cross + blockSize * 0.10f)
    drawPath(p, grad, style = ribbonStroke(cross))
    p.strokeRibbon(this, Color.White.copy(alpha = 0.32f), cross * 0.42f)
    val march1 = -phase01(now, 1100L) * (cellSize * 1.15f)
    ribbonDash[0] = cellSize * 0.5f; ribbonDash[1] = cellSize * 0.65f
    drawPath(p, Color.White.copy(alpha = 0.7f),
        style = ribbonStroke(cross * 0.14f, PathEffect.dashPathEffect(ribbonDash, march1)))
    val march2 = -phase01(now, 1700L) * (cellSize * 1.2f)
    ribbonDash[0] = cellSize * 0.35f; ribbonDash[1] = cellSize * 0.85f
    drawPath(p, Color.White.copy(alpha = 0.4f),
        style = ribbonStroke(cross * 0.09f, PathEffect.dashPathEffect(ribbonDash, march2)))

    // mũi tên theo hướng dòng cục bộ (ô − cha) trên mỗi ô flow
    for (i in 1 until cells.size) {
        val c = cells[i]; val par = parentOf(i) ?: source.pos
        drawWaterArrow(cx(c), cy(c), blockSize * 0.42f, c.x - par.x, c.y - par.y, Color.White, blockSize * 0.09f, alpha = 0.9f)
    }
    // foam ở NGỌN mỗi nhánh (ô flow không là cha của ô nào)
    for (i in 1 until cells.size) {
        if (i in isParent) continue
        val c = cells[i]; val par = parentOf(i) ?: source.pos
        val fdx = c.x - par.x; val fdy = c.y - par.y
        drawCircle(AQ_foam, blockSize * 0.09f, Offset(cx(c) + fdx * blockSize * 0.34f, cy(c) + fdy * blockSize * 0.34f))
    }

    // miệng nguồn hero ở gốc (vẽ ĐÈ lên đầu dải)
    drawWaterSourceCell(srcLeft, srcTop, blockSize, cr, 0, 1, broken = false, now = now)
}

/** Stroke bo tròn khớp mối nối cho dải nước liền. */
private fun ribbonStroke(width: Float, pe: PathEffect? = null) =
    Stroke(width = width, cap = StrokeCap.Round, join = StrokeJoin.Round, pathEffect = pe)

private fun Path.strokeRibbon(ds: DrawScope, color: Color, width: Float) {
    ds.drawPath(this, color, style = ribbonStroke(width))
}

/** Ô dòng chảy thường ([CellEffect.WATER_FLOW]) — gradient light→mid + mũi tên hướng + foam mép xuôi. */
internal fun DrawScope.drawWaterFlowCell(
    left: Float, top: Float, blockSize: Float, cr: CornerRadius,
    dirX: Int, dirY: Int, now: Long,
) {
    val off = Offset(left, top)
    val sz = Size(blockSize, blockSize)
    // nền gradient chéo 135° light→mid (jsx:114)
    drawRoundRect(
        Brush.linearGradient(listOf(AQ_light, AQ_mid), start = off, end = Offset(left + blockSize, top + blockSize)),
        off, sz, cr,
    )
    // ánh nước chạy (shimmer nhẹ): vệt sáng mảnh phía trên
    val cx = left + blockSize / 2f
    val cy = top + blockSize / 2f
    // mũi tên hướng ở tâm (glyph chính, cỡ vừa — jsx:115)
    drawWaterArrow(cx, cy, blockSize * 0.42f, dirX, dirY, AQ_deep, blockSize * 0.09f)
    // 2 bọt foam ở mép xuôi dòng (jsx:70-79)
    val fx = cx + dirX * blockSize * 0.36f
    val fy = cy + dirY * blockSize * 0.36f
    drawCircle(AQ_foam, blockSize * 0.055f, Offset(fx, fy))
    val bob = 0.5f + 0.5f * sin(phase01(now, 1400L) * 2f * Math.PI.toFloat())
    drawCircle(AQ_foam.copy(alpha = 0.75f), blockSize * 0.035f, Offset(fx - dirX * blockSize * 0.14f, fy - dirY * blockSize * 0.14f - bob * 1.5f))
}

/**
 * Ô GIỌT NƯỚC (target — occupant [CellType.TARGET]). Bám design world3-water-kit.jsx type 'drop'
 * (jsx:126-135): nền radial pale→light, **VÒNG TARGET NÉT ĐỨT** (deep) pulse + march, giọt teal bob.
 * Khác hẳn nốt/dòng chảy → đọc rõ "mục tiêu phá nguồn".
 */
internal fun DrawScope.drawWaterDropTarget(
    left: Float, top: Float, blockSize: Float, cr: CornerRadius, now: Long,
) {
    val off = Offset(left, top)
    val sz = Size(blockSize, blockSize)
    val cx = left + blockSize / 2f
    val cy = top + blockSize / 2f
    // nền radial pale→light (jsx:128)
    drawRoundRect(
        Brush.radialGradient(listOf(AQ_pale, AQ_light), center = Offset(cx, cy - blockSize * 0.05f), radius = blockSize * 0.7f),
        off, sz, cr,
    )
    // vòng target nét đứt (gjwRing 1.7s pulse + march) — 72% ô, deep (jsx:129)
    val rp = 0.5f - 0.5f * cos(phase01(now, 1700L) * TWO_PI)
    val ringR = blockSize * 0.36f * (1f + 0.06f * rp)
    dropDash[0] = blockSize * 0.12f
    dropDash[1] = blockSize * 0.10f
    val march = -phase01(now, 2200L) * (dropDash[0] + dropDash[1])
    drawCircle(
        AQ_deep.copy(alpha = 0.85f - 0.3f * rp), ringR, Offset(cx, cy),
        style = Stroke(width = blockSize * 0.04f, pathEffect = PathEffect.dashPathEffect(dropDash, march)),
    )
    // giọt teal bob lên xuống (gjwBob 1.9s, jsx:130)
    val bob = sin(phase01(now, 1900L) * TWO_PI) * blockSize * 0.05f
    drawWaterDroplet(cx, cy + bob, blockSize * 0.28f, AQ_teal, AQ_edge)
}

/** Ô nguồn nước ([CellEffect.WATER_SOURCE]) — miệng nguồn tỏa sáng + ripple + badge giọt; hoặc khô/nứt nếu [broken]. */
internal fun DrawScope.drawWaterSourceCell(
    left: Float, top: Float, blockSize: Float, cr: CornerRadius,
    dirX: Int, dirY: Int, broken: Boolean, now: Long,
) {
    val off = Offset(left, top)
    val sz = Size(blockSize, blockSize)
    val cx = left + blockSize / 2f
    val cy = top + blockSize / 2f

    if (broken) {
        // Nguồn khô: gradient khô + miệng xám + nứt 4 vạch (jsx:137-146, 683-688)
        drawRoundRect(
            Brush.linearGradient(listOf(AQ_dry, AQ_dry2), start = off, end = Offset(left, top + blockSize)),
            off, sz, cr,
        )
        drawCircle(AQ_dryMouth, blockSize * 0.15f, Offset(cx, cy))
        val cl = blockSize * 0.32f
        val sw = blockSize * 0.045f
        val angles = floatArrayOf(-2.3f, -0.5f, 1.7f, 2.6f)
        for (a in angles) {
            drawLine(AQ_dryDark.copy(alpha = 0.7f), Offset(cx, cy),
                Offset(cx + cos(a) * cl, cy + sin(a) * cl), sw, StrokeCap.Round)
        }
        drawWaterDropBadge(cx + blockSize * 0.3f, cy - blockSize * 0.3f, blockSize * 0.34f, broken = true)
        return
    }

    // miệng nguồn: radial core→mid→deep (jsx:691)
    drawRoundRect(
        Brush.radialGradient(
            listOf(AQ_core, AQ_mid, AQ_deep),
            center = Offset(cx, cy - blockSize * 0.06f), radius = blockSize * 0.72f,
        ),
        off, sz, cr,
    )
    // breathe glow: viền sáng thở (gjwSource 1.9s) — vẽ vòng core mờ, dày lên tại 50%
    val breathe = 0.5f - 0.5f * cos(phase01(now, 1900L) * 2f * Math.PI.toFloat())
    drawRoundRect(
        AQ_core.copy(alpha = 0.3f + 0.35f * breathe), off, sz, cr,
        style = Stroke(width = blockSize * (0.04f + 0.03f * breathe)),
    )
    // ripple ring (gjwRing 2s): scale 1→1.14, opacity .85→.35
    val rp = 0.5f - 0.5f * cos(phase01(now, 2000L) * 2f * Math.PI.toFloat())
    val ringR = blockSize * 0.32f * (1f + 0.14f * rp)
    drawCircle(Color.White.copy(alpha = 0.85f - 0.5f * rp), ringR, Offset(cx, cy),
        style = Stroke(width = blockSize * 0.03f))
    // miệng trong sáng
    drawCircle(AQ_core, blockSize * 0.15f, Offset(cx, cy))
    drawCircle(AQ_light.copy(alpha = 0.7f), blockSize * 0.1f, Offset(cx, cy))
    // mũi tên nước phun ra ở mép xuôi dòng (jsx:99-101)
    drawWaterArrow(cx + dirX * blockSize * 0.3f, cy + dirY * blockSize * 0.3f,
        blockSize * 0.3f, dirX, dirY, Color.White, blockSize * 0.08f)
    // badge giọt (đánh dấu nguồn phá được) — góc trên-phải, mostly-inside (jsx:104-106)
    drawWaterDropBadge(cx + blockSize * 0.3f, cy - blockSize * 0.3f, blockSize * 0.36f, broken = false)
}

/** Đĩa trắng + giọt teal (hoặc khô) — dấu "nguồn phá được bằng ô giọt". */
private fun DrawScope.drawWaterDropBadge(bcx: Float, bcy: Float, d: Float, broken: Boolean) {
    drawCircle(if (broken) Color(0xFFEDE5D8) else Color.White, d / 2f, Offset(bcx, bcy))
    drawWaterDroplet(bcx, bcy, d * 0.34f, if (broken) AQ_dry else AQ_teal, if (broken) AQ_dryDark else AQ_edge)
}

/** Giọt nước (teardrop): bulb tròn + đỉnh nhọn + shine. */
private fun DrawScope.drawWaterDroplet(cx: Float, cy: Float, r: Float, fill: Color, edge: Color) {
    val bulbCy = cy + r * 0.32f
    val bulbR = r * 0.66f
    drawCircle(fill, bulbR, Offset(cx, bulbCy))
    val p = waterPath
    p.reset()
    p.moveTo(cx, cy - r)
    p.lineTo(cx - bulbR * 0.72f, bulbCy)
    p.lineTo(cx + bulbR * 0.72f, bulbCy)
    p.close()
    drawPath(p, fill)
    drawCircle(Color.White.copy(alpha = 0.7f), bulbR * 0.28f, Offset(cx - bulbR * 0.3f, bulbCy + bulbR * 0.1f))
}

/**
 * Mũi tên ĐẦY ĐỦ (thân + đầu) hướng ([dirX],[dirY]) tại tâm ([cx],[cy]) — bám design `Arrow`
 * (`M5 12h13 M12 6l6 6-6 6`, viewBox 24): thân dài `5→18`, đầu chevron tại ngọn. [size] = bề rộng
 * glyph, [sw] = nét. Không phải chevron trơ như trước.
 */
private fun DrawScope.drawWaterArrow(
    cx: Float, cy: Float, size: Float, dirX: Int, dirY: Int, color: Color, sw: Float, alpha: Float = 1f,
) {
    if (dirX == 0 && dirY == 0) return
    val ax = dirX.toFloat(); val ay = dirY.toFloat()
    val px = -ay; val py = ax                 // vuông góc
    val u = size / 24f                        // 1 đơn vị viewBox
    val tip = Offset(cx + ax * 6f * u, cy + ay * 6f * u)     // ngọn tại x=18 (tâm 12)
    val tail = Offset(cx - ax * 7f * u, cy - ay * 7f * u)    // đuôi tại x=5
    val back = 6f * u; val wing = 6f * u
    val a1 = Offset(tip.x - ax * back + px * wing, tip.y - ay * back + py * wing)
    val a2 = Offset(tip.x - ax * back - px * wing, tip.y - ay * back - py * wing)
    val c = color.copy(alpha = alpha)
    drawLine(c, tail, tip, sw, StrokeCap.Round)   // thân
    drawLine(c, tip, a1, sw, StrokeCap.Round)     // cánh đầu
    drawLine(c, tip, a2, sw, StrokeCap.Round)
}
