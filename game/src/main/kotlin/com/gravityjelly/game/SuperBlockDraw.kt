package com.gravityjelly.game

import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipPath
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.graphics.lerp
import kotlin.math.sin

/**
 * Vẽ SIÊU KHỐI (merge-9). Bám đúng `06-svg-assets/blocks/super-{màu}-{1,2}.svg` (bản cập nhật):
 *  - Thân = khối jelly thường theo màu (fill/edge/gloss) — tái dùng [drawJellyBlock].
 *  - **Viền NHIỀU MÀU chạy quanh** (4 cung vàng/mint/hồng/xanh, dasharray 87.98/263.95 quay vòng):
 *    cấp 1 = 1 lớp mảnh (4u); cấp 2 = lớp nền dày mờ (9u) + lớp sắc (6u). [spin] drive quay.
 *  - **Hào quang lấp lánh** quanh khối: tia 4 cánh nhiều màu nhấp nháy lệch pha (cấp 1: 5, cấp 2: 9).
 *  - **Vương miện** trên đỉnh: cấp 1 = vương miện 3 chấu + ngọc; cấp 2 = vương miện zigzag 5 đỉnh,
 *    nhiều ngọc + ngọc lớn (ngọc giữa lấy màu edge của khối, đúng SVG).
 *  - Mắt: GIỮ hệ mắt sống của board cho nhất quán (memory ingame-eye-personality).
 *  - KHÔNG vẽ sticker góc (siêu khối thay sticker bằng vương miện).
 *
 * [pulse] 0..1 (nhịp thở) drive cường độ quầng + độ trắng viền trong. [spin] 0..1 (chạy liên tục)
 * drive viền màu quay quanh + nhấp nháy lấp lánh. Squash/clearProgress giống [drawJellyCell].
 */

// ── Tỉ lệ SVG: thân (body) ở 3.5..96.5 trong viewBox 100 ⇒ 1 svg-unit = blockSize / 93 ──
private const val SVG_BODY_W = 93f

// Viền chạy: rect 0..100 rx28 (vb100). dasharray "87.98 263.95" = 1/4 chu vi sáng, 3/4 tắt.
private const val RING_CORNER_U  = 28f
private const val RING_SIZE_U    = 100f
private const val RING_OFFSET_U  = -3.5f     // mép trái viền so với mép thân (0 − 3.5)
private const val RING_QUARTER_U = 87.98f
private const val RING_PERIM_U   = 351.93f
private const val RING_STROKE1_U = 4f        // cấp 1: viền mảnh
private const val RING_SHARP2_U  = 6f        // cấp 2: lớp sắc
private const val RING_SOFT2_U   = 9f        // cấp 2: lớp nền dày (giả-bloom, alpha thấp)

// Viền trong sáng (rect 10..90 rx19 stroke 2.6 trong vb100, quy về tỉ lệ thân 93)
private const val SUPER_INNER_INSET  = 0.07f
private const val SUPER_INNER_CORNER = 0.20f
private const val SUPER_INNER_STROKE = 0.028f
private const val SUPER_HALO_STROKE  = 0.10f

// ── Bảng màu (đúng hex DS) ──
private val RingColors = arrayOf(
    Color(0xFFFFCA66), Color(0xFF5FC3B2), Color(0xFFE576A0), Color(0xFF8FB6F2), // gold/mint/pink/blue
)
private val CrownFill = Color(0xFFFFCA66)   // warning gold
private val CrownEdge = Color(0xFFE2A82E)
private val CrownHi   = Color(0xFFFFE3A3)   // vàng nhạt (đốm/chấm trong)
private val HaloWhite = Color(0xFFFFFFFF)

private val SpGold   = Color(0xFFFFCA66)
private val SpMint   = Color(0xFF5FC3B2)
private val SpBlue   = Color(0xFF8FB6F2)
private val SpPink   = Color(0xFFF7A9C0)
private val SpPinkE  = Color(0xFFE576A0)
private val SpPurple = Color(0xFFA99CF6)
private val SpYellow = Color(0xFFFFE3A3)

// Vị trí (fraction blockSize, gốc = mép trên-trái thân; có thể <0 hoặc >1 = ngoài thân) + bán kính
// (fraction) + màu. Quy từ toạ độ SVG: f = (svg − 3.5) / 93, r = 7·scale / 93.
private val SP1_X = floatArrayOf(0.876f, 1.108f, 0.167f, -0.102f, 0.844f)
private val SP1_Y = floatArrayOf(-0.102f, 0.823f, 1.127f, 0.124f, -0.096f)
private val SP1_R = floatArrayOf(0.0452f, 0.0376f, 0.0406f, 0.0376f, 0.0436f)
private val SP1_C = arrayOf(SpGold, SpBlue, SpMint, SpPink, SpPurple)

private val SP2_X = floatArrayOf(0.876f, 1.207f, 1.148f, 0.806f, 0.180f, -0.198f, -0.157f, 0.190f, 0.909f)
private val SP2_Y = floatArrayOf(-0.102f, 0.243f, 0.788f, 1.187f, 1.157f, 0.782f, 0.180f, -0.138f, -0.106f)
private val SP2_R = floatArrayOf(0.0692f, 0.0452f, 0.0602f, 0.0467f, 0.0677f, 0.0452f, 0.0587f, 0.0452f, 0.0677f)
private val SP2_C = arrayOf(SpGold, SpMint, SpBlue, SpPurple, SpPink, SpPinkE, SpYellow, SpMint, SpGold)

private const val TWO_PI = (2.0 * Math.PI).toFloat()

// ── cache Path/Stroke (rebuild khi blockSize/density đổi) — allocation-free trong vòng vẽ ──
private var superCacheKey = -1f
private var superScaleU = 0f
private val superRingPath = Path()       // viền chạy (toạ độ local quanh gốc thân)
private val crownZigzag = Path()         // vương miện cấp 2
private val sparkleUnit = Path()         // tia 4 cánh bán kính 1
private val superRingDash = floatArrayOf(1f, 1f)
private var superInnerStroke = Stroke(1f)
private var superHaloStroke  = Stroke(1f)
private var crownBandStroke  = Stroke(1f, join = StrokeJoin.Round)
private var crownJewelStroke = Stroke(1f)
private var crownGemStroke   = Stroke(1f)

private fun ensureSuperCache(blockSize: Float, density: Float) {
    val key = blockSize + density * 100_000f
    if (key == superCacheKey) return
    superCacheKey = key
    val u = blockSize / SVG_BODY_W
    superScaleU = u

    // viền chạy: rounded-rect 0..100 (local, gốc tại mép thân)
    val rl = RING_OFFSET_U * u
    val rs = RING_SIZE_U * u
    val rc = RING_CORNER_U * u
    superRingPath.reset()
    superRingPath.addRoundRect(RoundRect(rl, rl, rl + rs, rl + rs, CornerRadius(rc, rc)))
    superRingDash[0] = RING_QUARTER_U * u
    superRingDash[1] = (RING_PERIM_U - RING_QUARTER_U) * u

    // vương miện cấp 2 (path zigzag, đơn vị svg → *u)
    crownZigzag.reset()
    crownZigzag.moveTo(-19f * u, 6f * u)
    crownZigzag.lineTo(-18f * u, -7f * u)
    crownZigzag.lineTo(-13.5f * u, -1f * u)
    crownZigzag.lineTo(-9f * u, -13f * u)
    crownZigzag.lineTo(-4.5f * u, -1f * u)
    crownZigzag.lineTo(0f, -19f * u)
    crownZigzag.lineTo(4.5f * u, -1f * u)
    crownZigzag.lineTo(9f * u, -13f * u)
    crownZigzag.lineTo(13.5f * u, -1f * u)
    crownZigzag.lineTo(18f * u, -7f * u)
    crownZigzag.lineTo(19f * u, 6f * u)
    crownZigzag.close()

    // tia 4 cánh (bán kính 1) — svg path chia 7
    sparkleUnit.reset()
    sparkleUnit.moveTo(0f, -1f)
    sparkleUnit.cubicTo(0.1f, -0.286f, 0.286f, -0.1f, 1f, 0f)
    sparkleUnit.cubicTo(0.286f, 0.1f, 0.1f, 0.286f, 0f, 1f)
    sparkleUnit.cubicTo(-0.1f, 0.286f, -0.286f, 0.1f, -1f, 0f)
    sparkleUnit.cubicTo(-0.286f, -0.1f, -0.1f, -0.286f, 0f, -1f)
    sparkleUnit.close()

    superInnerStroke = Stroke(width = blockSize * SUPER_INNER_STROKE)
    superHaloStroke  = Stroke(width = blockSize * SUPER_HALO_STROKE)
    crownBandStroke  = Stroke(width = 1.5f * u, join = StrokeJoin.Round)
    crownJewelStroke = Stroke(width = 0.9f * u)
    crownGemStroke   = Stroke(width = 1.3f * u)
}

internal fun DrawScope.drawSuperJellyCell(
    left: Float, top: Float, blockSize: Float,
    cr: CornerRadius, borderStroke: Stroke,
    palette: BlockPalette, level: Int,
    dirX: Float, dirY: Float,
    expression: EyeExpression = EyeExpression.NORMAL,
    eyeOpen: Boolean = true,
    squashScaleX: Float = 1f,
    squashScaleY: Float = 1f,
    clearProgress: Float = 0f,
    pulse: Float = 0f,
    spin: Float = 0f,
) {
    val clearAlpha = if (clearProgress > 0f) 1f - clearProgress else 1f
    val clearScale = if (clearProgress > 0f) 1f + clearProgress * 0.12f else 1f
    val eyeOpenNow = eyeOpen && squashScaleX >= 0.92f && squashScaleY >= 0.92f
    val sx = squashScaleX * clearScale
    val sy = squashScaleY * clearScale
    val pivot = Offset(left + blockSize / 2f, top + blockSize / 2f)
    val lvlMul = if (level >= 2) 1f else 0.85f      // cấp 2 sáng mạnh hơn

    ensureSuperCache(blockSize, density)

    fun body() {
        // ── quầng sáng trắng nhịp thở (sau lưng, cho "phát sáng đặc trưng") ──
        val g = blockSize * 0.05f + blockSize * 0.03f * pulse
        drawRoundRect(
            HaloWhite.copy(alpha = (0.10f + 0.15f * pulse) * lvlMul * clearAlpha),
            Offset(left - g, top - g), Size(blockSize + g * 2, blockSize + g * 2),
            CornerRadius(cr.x + g, cr.y + g), style = superHaloStroke,
        )
        // ── hào quang lấp lánh + viền màu chạy (sau lưng thân, ló ra ngoài mép) ──
        drawSparkles(left, top, blockSize, level, spin, lvlMul * clearAlpha)
        drawRunningRing(left, top, level, spin, clearAlpha)
        // ── thân jelly ──
        drawJellyBlock(left, top, blockSize, cr, borderStroke, palette, clearAlpha)
        // ── viền trong sáng: shine → trắng theo nhịp ──
        val inset = blockSize * SUPER_INNER_INSET
        val ringColor = lerp(palette.shine, HaloWhite, 0.45f + 0.4f * pulse)
        drawRoundRect(
            ringColor.copy(alpha = (0.85f + 0.15f * pulse) * clearAlpha),
            Offset(left + inset, top + inset),
            Size(blockSize - inset * 2, blockSize - inset * 2),
            CornerRadius(blockSize * SUPER_INNER_CORNER),
            style = superInnerStroke,
        )
        drawEyes(left, top, blockSize, dirX, dirY, expression, eyeOpenNow, clearAlpha)
        drawCrown(left, top, blockSize, level, palette.edge, clearAlpha)
    }

    if (sx != 1f || sy != 1f) scale(sx, sy, pivot) { body() } else body()
}

/**
 * Viền LẤP LÁNH kiểu siêu khối (viền nhiều màu chạy) quanh MỘT ô — tái dùng cho highlight preview
 * "vùng sẽ ăn điểm" khi kéo ghost. Vẽ SAU LƯNG block (gọi trước khi vẽ thân) để chỉ ló shimmer ra
 * ngoài mép, mặt block vẫn sạch. [spin] drive chạy (dùng chung superSpin của board); [alpha] mờ dần.
 */
internal fun DrawScope.drawShimmerBorder(left: Float, top: Float, blockSize: Float, spin: Float, alpha: Float = 1f) {
    ensureSuperCache(blockSize, density)
    drawRunningRing(left, top, level = 1, spin, alpha)
}

// ── Viền chạy quanh CẢ VÙNG highlight (đường bao BẤT KỲ — chữ thập/L/blob nổ) ──
private val regionRingDash = floatArrayOf(1f, 1f)

/**
 * Vẽ VIỀN NHIỀU MÀU CHẠY dọc [path] (một contour kín BẤT KỲ, chu vi [perimeter]) — 4 cung 1/4 chu vi
 * chạy vòng theo [spin], y như viền siêu khối nhưng bám đúng đường bao thật của vùng (đa giác trực
 * giao: chữ thập, L, blob nổ super…). Người gọi tự dựng [path] bo góc + tính [perimeter].
 * Tái dùng [regionRingDash]; dashPathEffect cấp phát như [ringPass] hiện có.
 */
internal fun DrawScope.drawRunningPath(
    path: Path, perimeter: Float, strokeWidth: Float, spin: Float, alpha: Float,
) {
    if (perimeter <= 0f) return
    val quarter = perimeter / 4f
    regionRingDash[0] = quarter
    regionRingDash[1] = perimeter - quarter
    val run = spin * perimeter
    for (i in RingColors.indices) {
        val pe = PathEffect.dashPathEffect(regionRingDash, i * quarter + run)
        drawPath(
            path, RingColors[i].copy(alpha = alpha),
            style = Stroke(width = strokeWidth, cap = StrokeCap.Round, pathEffect = pe),
        )
    }
}

/** Viền nhiều màu chạy quanh: 4 cung 1/4 chu vi, phase chạy theo [spin]; cấp 2 thêm lớp nền dày. */
private fun DrawScope.drawRunningRing(left: Float, top: Float, level: Int, spin: Float, alpha: Float) {
    val quarter = superRingDash[0]
    val perim = RING_PERIM_U * superScaleU
    val run = spin * perim
    translate(left, top) {
        if (level >= 2) {
            ringPass(RING_SOFT2_U * superScaleU, quarter, run, 0.42f * alpha)
            ringPass(RING_SHARP2_U * superScaleU, quarter, run, 0.98f * alpha)
        } else {
            ringPass(RING_STROKE1_U * superScaleU, quarter, run, 0.95f * alpha)
        }
    }
}

private fun DrawScope.ringPass(width: Float, quarter: Float, run: Float, a: Float) {
    for (i in RingColors.indices) {
        val pe = PathEffect.dashPathEffect(superRingDash, i * quarter + run)
        drawPath(
            superRingPath, RingColors[i].copy(alpha = a),
            style = Stroke(width = width, cap = StrokeCap.Round, pathEffect = pe),
        )
    }
}

/** Tia 4 cánh nhấp nháy lệch pha quanh khối (đứng sau thân, ló ra ngoài mép). */
private fun DrawScope.drawSparkles(
    left: Float, top: Float, blockSize: Float, level: Int, spin: Float, alpha: Float,
) {
    val xs = if (level >= 2) SP2_X else SP1_X
    val ys = if (level >= 2) SP2_Y else SP1_Y
    val rs = if (level >= 2) SP2_R else SP1_R
    val cs = if (level >= 2) SP2_C else SP1_C
    for (i in xs.indices) {
        val cx = left + xs[i] * blockSize
        val cy = top + ys[i] * blockSize
        val baseR = rs[i] * blockSize
        val tw = 0.5f + 0.5f * sin((spin + i * 0.137f) * TWO_PI)   // 0..1 nhấp nháy
        val r = baseR * (0.78f + 0.34f * tw)
        val a = (0.5f + 0.5f * tw) * alpha
        val col = cs[i]
        drawCircle(col.copy(alpha = 0.26f * a), r * 1.5f, Offset(cx, cy))   // quầng mờ
        translate(cx, cy) {
            scale(r, r, Offset.Zero) {
                drawPath(sparkleUnit, col.copy(alpha = a))
                drawCircle(HaloWhite.copy(alpha = a), 0.26f, Offset.Zero)
            }
        }
    }
}

/** Vương miện trên đỉnh khối; ngọc giữa = [gem] (super: palette.edge; cầu vồng siêu cấp: tím rainbow). */
private fun DrawScope.drawCrown(
    left: Float, top: Float, blockSize: Float, level: Int, gem: Color, alpha: Float,
) {
    val u = superScaleU
    val cx = left + blockSize / 2f
    if (level >= 2) {
        translate(cx, top + 2f * u) {
            // băng đáy
            drawRoundRect(CrownFill.copy(alpha = alpha), Offset(-19.5f * u, -1.5f * u), Size(39f * u, 9f * u), CornerRadius(3f * u))
            drawRoundRect(CrownEdge.copy(alpha = alpha), Offset(-19.5f * u, -1.5f * u), Size(39f * u, 9f * u), CornerRadius(3f * u), style = crownBandStroke)
            // thân zigzag
            drawPath(crownZigzag, CrownFill.copy(alpha = alpha))
            drawPath(crownZigzag, CrownEdge.copy(alpha = alpha), style = crownBandStroke)
            // đường nổi sáng ngang
            drawLine(CrownHi.copy(alpha = 0.85f * alpha), Offset(-18.4f * u, -3.4f * u), Offset(18.4f * u, -3.4f * u), 1.4f * u, cap = StrokeCap.Round)
            // ngọc trên các đỉnh
            jewel(-18f * u, -7.5f * u, 2.1f * u, CrownFill, alpha)
            jewel(-9f * u, -13.6f * u, 2.1f * u, SpPinkE, alpha)
            jewel(9f * u, -13.6f * u, 2.1f * u, SpPinkE, alpha)
            jewel(18f * u, -7.5f * u, 2.1f * u, CrownFill, alpha)
            jewel(0f, -20f * u, 2.7f * u, HaloWhite, alpha)
            jewel(-12.5f * u, 3f * u, 1.7f * u, CrownHi, alpha)
            jewel(12.5f * u, 3f * u, 1.7f * u, CrownHi, alpha)
            // ngọc giữa lớn
            drawCircle(gem.copy(alpha = alpha), 6.4f * u, Offset(0f, 2.8f * u))
            drawCircle(HaloWhite.copy(alpha = alpha), 6.4f * u, Offset(0f, 2.8f * u), style = crownGemStroke)
            drawCircle(HaloWhite.copy(alpha = 0.9f * alpha), 1.1f * u, Offset(-1.6f * u, 1.4f * u))
        }
    } else {
        translate(cx, top + 3f * u) {
            // băng đáy
            drawRoundRect(CrownFill.copy(alpha = alpha), Offset(-11f * u, -1f * u), Size(22f * u, 6.4f * u), CornerRadius(2.2f * u))
            drawRoundRect(CrownEdge.copy(alpha = alpha), Offset(-11f * u, -1f * u), Size(22f * u, 6.4f * u), CornerRadius(2.2f * u), style = crownBandStroke)
            // ba chấu (tròn)
            jewel(-7f * u, -2.4f * u, 3.3f * u, CrownFill, alpha)
            jewel(7f * u, -2.4f * u, 3.3f * u, CrownFill, alpha)
            jewel(0f, -4.4f * u, 3.9f * u, CrownFill, alpha)
            // chấm trong
            drawCircle(CrownHi.copy(alpha = alpha), 1.1f * u, Offset(-7f * u, -2.4f * u))
            drawCircle(CrownHi.copy(alpha = alpha), 1.1f * u, Offset(7f * u, -2.4f * u))
            // ngọc giữa
            drawCircle(gem.copy(alpha = alpha), 3.8f * u, Offset(0f, 1.8f * u))
            drawCircle(HaloWhite.copy(alpha = alpha), 3.8f * u, Offset(0f, 1.8f * u), style = crownGemStroke)
            drawCircle(HaloWhite.copy(alpha = 0.9f * alpha), 0.8f * u, Offset(-1f * u, 0.9f * u))
        }
    }
}

private fun DrawScope.jewel(x: Float, y: Float, r: Float, fill: Color, alpha: Float) {
    drawCircle(fill.copy(alpha = alpha), r, Offset(x, y))
    drawCircle(CrownEdge.copy(alpha = alpha), r, Offset(x, y), style = crownJewelStroke)
}

// ── KHỐI CẦU VỒNG (rainbow.svg) — dải màu chéo -22°, gloss, viền, mắt cười ───────────────
private val RbBands = arrayOf(
    Color(0xFFFFE3A3), Color(0xFFA3E5D9), Color(0xFFB3C7F7), Color(0xFFF7A9C0), Color(0xFFFFD9B0),
)
// dải theo viewBox100: (yTop, height) — rotate -22° quanh tâm
private val RbBandY = floatArrayOf(-0.14f, 0.16f, 0.39f, 0.62f, 0.85f)
private val RbBandH = floatArrayOf(0.30f, 0.23f, 0.23f, 0.25f, 0.32f)
private val RbEdge = Color(0xFFC9A6E8)
private val RbInner = Color(0x73FFFFFF)   // viền trong trắng mờ

private val rbClipPath = Path()

private fun ensureRbClip(left: Float, top: Float, blockSize: Float, corner: Float) {
    // path bo tròn theo ô hiện tại (toạ độ tuyệt đối) — rebuild mỗi ô (vị trí đổi) nhưng rẻ.
    rbClipPath.reset()
    rbClipPath.addRoundRect(
        RoundRect(
            left, top, left + blockSize, top + blockSize,
            CornerRadius(corner, corner),
        ),
    )
}

// Ngọc giữa vương miện cho CẦU VỒNG SIÊU CẤP (tím rainbow, hợp dải màu).
private val RbCrownGem = Color(0xFFC9A6E8)

internal fun DrawScope.drawRainbowCell(
    left: Float, top: Float, blockSize: Float,
    cr: CornerRadius, borderStroke: Stroke,
    dirX: Float, dirY: Float,
    expression: EyeExpression = EyeExpression.HAPPY,
    eyeOpen: Boolean = true,
    squashScaleX: Float = 1f,
    squashScaleY: Float = 1f,
    clearProgress: Float = 0f,
    level: Int = 0,
    pulse: Float = 0f,
    spin: Float = 0f,
) {
    val clearAlpha = if (clearProgress > 0f) 1f - clearProgress else 1f
    val clearScale = if (clearProgress > 0f) 1f + clearProgress * 0.12f else 1f
    val eyeOpenNow = eyeOpen && squashScaleX >= 0.92f && squashScaleY >= 0.92f
    val sx = squashScaleX * clearScale
    val sy = squashScaleY * clearScale
    val cx = left + blockSize / 2f
    val cy = top + blockSize / 2f
    val pivot = Offset(cx, cy)
    val corner = cr.x
    val apex = level >= 2
    if (apex) ensureSuperCache(blockSize, density)

    fun body() {
        if (apex) {
            // ── CẦU VỒNG SIÊU CẤP: hào quang + viền màu chạy + tia lấp lánh (giống siêu khối cấp 2) ──
            val g = blockSize * 0.05f + blockSize * 0.03f * pulse
            drawRoundRect(
                HaloWhite.copy(alpha = (0.10f + 0.15f * pulse) * clearAlpha),
                Offset(left - g, top - g), Size(blockSize + g * 2, blockSize + g * 2),
                CornerRadius(cr.x + g, cr.y + g), style = superHaloStroke,
            )
            drawSparkles(left, top, blockSize, level, spin, clearAlpha)
            drawRunningRing(left, top, level, spin, clearAlpha)
        }
        ensureRbClip(left, top, blockSize, corner)
        clipPath(rbClipPath) {
            rotate(-22f, pivot) {
                val w = blockSize * 1.6f
                val bx = left - blockSize * 0.30f
                for (i in RbBands.indices) {
                    drawRect(
                        RbBands[i].copy(alpha = clearAlpha),
                        topLeft = Offset(bx, top + RbBandY[i] * blockSize),
                        size = Size(w, RbBandH[i] * blockSize),
                    )
                }
            }
            // gloss trên
            drawOval(
                Color.White.copy(alpha = 0.55f * clearAlpha),
                topLeft = Offset(left + blockSize * 0.12f, top + blockSize * 0.04f),
                size = Size(blockSize * 0.76f, blockSize * 0.30f),
            )
        }
        // viền trong trắng + viền ngoài tím nhạt
        drawRoundRect(RbInner.copy(alpha = clearAlpha), Offset(left, top), Size(blockSize, blockSize), cr, style = borderStroke)
        drawRoundRect(RbEdge.copy(alpha = clearAlpha), Offset(left, top), Size(blockSize, blockSize), cr, style = borderStroke)
        drawEyes(left, top, blockSize, dirX, dirY, expression, eyeOpenNow, clearAlpha)
        if (apex) drawCrown(left, top, blockSize, level, RbCrownGem, clearAlpha)
    }

    if (sx != 1f || sy != 1f) scale(sx, sy, pivot) { body() } else body()
}
