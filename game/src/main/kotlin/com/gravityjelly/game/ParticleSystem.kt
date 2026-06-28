package com.gravityjelly.game

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.text.TextLayoutResult
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.TextUnitType

/**
 * Lớp "juice": particle burst + popup combo/điểm.
 * Object pool kích thước cố định (cap số particle); tái dùng slot — KHÔNG cấp phát trong vòng vẽ.
 * Toạ độ lưu theo ĐƠN VỊ Ô (cell) để độc lập độ phân giải; quy ra px khi vẽ.
 * Particle nội suy vị trí theo alpha (prev→curr) cho mượt fixed-timestep.
 */
internal class ParticleSystem {

    // ── particles ──
    private val px = FloatArray(MAX_PARTICLES)
    private val py = FloatArray(MAX_PARTICLES)
    private val prevX = FloatArray(MAX_PARTICLES)
    private val prevY = FloatArray(MAX_PARTICLES)
    private val vx = FloatArray(MAX_PARTICLES)
    private val vy = FloatArray(MAX_PARTICLES)
    private val life = FloatArray(MAX_PARTICLES)        // giây còn lại
    private val maxLife = FloatArray(MAX_PARTICLES)
    private val radius = FloatArray(MAX_PARTICLES)      // theo ô
    private val pcolor = Array(MAX_PARTICLES) { Color.White }
    private val pActive = BooleanArray(MAX_PARTICLES)
    private var spawnCounter = 0

    // hướng "trọng lực" để particle trôi lệch (đặt theo gravity hiện tại)
    private var biasX = 0f
    private var biasY = 1f

    fun setGravityBias(dx: Float, dy: Float) { biasX = dx; biasY = dy }

    /** Bắn [count] đốm tại tâm ô (cx,cy theo đơn vị ô), màu [color]. */
    fun burst(cx: Float, cy: Float, color: Color, count: Int) {
        var emitted = 0
        var i = 0
        while (i < MAX_PARTICLES && emitted < count) {
            if (!pActive[i]) {
                val ang = (spawnCounter++ * GOLDEN_ANGLE)
                val speed = 1.6f + 0.5f * fract(spawnCounter * 0.61803f) // ô/giây
                px[i] = cx; py[i] = cy
                prevX[i] = cx; prevY[i] = cy
                vx[i] = cos(ang) * speed
                vy[i] = sin(ang) * speed
                val lifeS = (PARTICLE_LIFE_MS - 80f * fract(ang)) / 1000f
                life[i] = lifeS; maxLife[i] = lifeS
                radius[i] = 0.07f + 0.04f * fract(ang * 1.3f) // ~4–6dp tại ô 36dp
                pcolor[i] = color
                pActive[i] = true
                emitted++
            }
            i++
        }
    }

    fun step(dtSeconds: Float) {
        var i = 0
        while (i < MAX_PARTICLES) {
            if (pActive[i]) {
                prevX[i] = px[i]; prevY[i] = py[i]
                px[i] += vx[i] * dtSeconds
                py[i] += vy[i] * dtSeconds
                vx[i] += biasX * GRAVITY_BIAS * dtSeconds
                vy[i] += biasY * GRAVITY_BIAS * dtSeconds
                vx[i] *= DRAG; vy[i] *= DRAG
                life[i] -= dtSeconds
                if (life[i] <= 0f) pActive[i] = false
            }
            i++
        }
        // popups
        var j = 0
        while (j < MAX_POPUPS) {
            if (popActive[j]) {
                popAge[j] += dtSeconds
                if (popAge[j] >= popLife[j]) popActive[j] = false
            }
            j++
        }
    }

    fun drawParticles(scope: DrawScope, cellPx: Float, alpha: Float) {
        var i = 0
        while (i < MAX_PARTICLES) {
            if (pActive[i]) {
                val rx = (prevX[i] + (px[i] - prevX[i]) * alpha) * cellPx
                val ry = (prevY[i] + (py[i] - prevY[i]) * alpha) * cellPx
                val t = (life[i] / maxLife[i]).coerceIn(0f, 1f)
                val a = Anim.easeOut(t)
                scope.drawCircle(pcolor[i].copy(alpha = a), radius[i] * cellPx, Offset(rx, ry))
            }
            i++
        }
    }

    // ── popups (combo ×N / +score) ──
    private val popX = FloatArray(MAX_POPUPS)
    private val popY = FloatArray(MAX_POPUPS)
    private val popAge = FloatArray(MAX_POPUPS)
    private val popActive = BooleanArray(MAX_POPUPS)
    private val popText = arrayOfNulls<String>(MAX_POPUPS)
    private val popColor = Array(MAX_POPUPS) { Color.White }
    private val popSizeSp = FloatArray(MAX_POPUPS)
    private val popLayout = arrayOfNulls<TextLayoutResult>(MAX_POPUPS)
    private val popLife = FloatArray(MAX_POPUPS)    // vòng đời theo từng popup (giây)
    private val popFloat = FloatArray(MAX_POPUPS)   // biên độ trôi lên (đơn vị ô)

    /**
     * Spawn popup tại ô (cx,cy). [sizeSp] cỡ chữ.
     * [lifeS]/[floatCell]: combo "×N" để mặc định (~900ms, ~26dp); score "+N" truyền ngắn hơn
     * (≤450ms, ~20dp) để bám token motion. Xem 05-particles-juice.md.
     */
    fun popup(
        cx: Float, cy: Float, text: String, color: Color, sizeSp: Float,
        lifeS: Float = POPUP_LIFE_S,
        floatCell: Float = POPUP_FLOAT_CELL,
    ) {
        var i = 0
        while (i < MAX_POPUPS) {
            if (!popActive[i]) {
                popX[i] = cx; popY[i] = cy; popAge[i] = 0f
                popText[i] = text; popColor[i] = color; popSizeSp[i] = sizeSp
                popLife[i] = lifeS; popFloat[i] = floatCell
                popLayout[i] = null // đo lại (lần vẽ đầu)
                popActive[i] = true
                return
            }
            i++
        }
    }

    fun drawPopups(scope: DrawScope, measurer: TextMeasurer, cellPx: Float, alpha: Float) {
        var i = 0
        while (i < MAX_POPUPS) {
            if (popActive[i]) {
                // đọc theo vòng đời riêng của popup (combo dài / score ngắn)
                val t = (popAge[i] / popLife[i]).coerceIn(0f, 1f)
                // scale 0.4→1.18→1.0 (spec collapse-combo)
                val scale = when {
                    t < 0.25f -> Anim.lerp(0.4f, 1.18f, Anim.easeOut(t / 0.25f))
                    t < 0.45f -> Anim.lerp(1.18f, 1.0f, (t - 0.25f) / 0.20f)
                    else -> 1.0f
                }
                val floatUp = Anim.easeOut(t) * popFloat[i]
                val fade = if (t < 0.7f) 1f else 1f - (t - 0.7f) / 0.3f

                var layout = popLayout[i]
                if (layout == null) {
                    val style = TextStyle(
                        color = popColor[i],
                        fontSize = TextUnit(popSizeSp[i], TextUnitType.Sp),
                        fontWeight = FontWeight.Black,
                    )
                    layout = measurer.measure(popText[i] ?: "", style)
                    popLayout[i] = layout
                }
                val cx = popX[i] * cellPx
                val cy = (popY[i] - floatUp) * cellPx
                val w = layout.size.width
                val h = layout.size.height
                val drawn = layout
                scope.scale(scale, scale, Offset(cx, cy)) {
                    drawText(drawn, color = popColor[i].copy(alpha = fade), topLeft = Offset(cx - w / 2f, cy - h / 2f))
                }
            }
            i++
        }
    }

    fun clear() {
        var i = 0
        while (i < MAX_PARTICLES) { pActive[i] = false; i++ }
        var j = 0
        while (j < MAX_POPUPS) { popActive[j] = false; j++ }
    }

    val activeParticleCount: Int
        get() {
            var n = 0; var i = 0
            while (i < MAX_PARTICLES) { if (pActive[i]) n++; i++ }
            return n
        }

    companion object {
        const val MAX_PARTICLES = 140
        const val MAX_POPUPS = 8
        private const val PARTICLE_LIFE_MS = 420f
        private const val POPUP_LIFE_S = 0.9f
        private const val POPUP_FLOAT_CELL = 0.72f
        private const val GRAVITY_BIAS = 5.5f
        private const val DRAG = 0.92f
        private const val GOLDEN_ANGLE = 2.399963f

        private fun cos(a: Float): Float = kotlin.math.cos(a)
        private fun sin(a: Float): Float = kotlin.math.sin(a)
        private fun fract(v: Float): Float = v - kotlin.math.floor(v)
    }
}
