package com.gravityjelly.game

import android.content.res.Resources
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.BitmapShader
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Shader
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.FilterQuality
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import com.gravityjelly.core.JellyColor
import kotlin.math.roundToInt

/**
 * Bộ ảnh THÂN khối jelly + các tầng tiến hóa — nguồn art gốc trong
 * `design/Gravity Jelly Design System/06-svg-assets` (import về `res/drawable-nodpi`).
 *
 * Từ bản reskin 12/07: thân khối KHÔNG còn vẽ tay (fill/gloss/viền/sticker) mà dùng art ảnh;
 * mắt vẫn là overlay vẽ tay ([drawEyes]) ghép lên trên (xem `06-svg-assets/eye-block-preview.card.html`).
 * Đá (stone) KHÔNG có art mới → vẫn vẽ tay ([drawStoneBlock]).
 *
 * Art là **ảnh gốc PNG đặc, vuông 1254² full-bleed** (khung vàng chạm sát mép), KHÔNG bo góc/không alpha.
 * Bo tròn do lớp render (khớp `svg-assets.card.html`: `border-radius: 20%` = bán kính ô lưới trống).
 *
 * CHỐNG RĂNG CƯA (mấu chốt — user báo răng cưa nhiều lần): ô jelly bị thu >10× (1254px → ô ~110px). Canvas
 * phần cứng khi `drawImage` thu nhỏ chỉ lấy **bilinear 2×2** (mipmap của `setHasMipMap` KHÔNG đáng tin trên
 * đường drawBitmap tăng tốc) → thiếu mẫu → mép/viền vàng răng cưa. GIẢI PHÁP: [JellyArt] THU NHỎ ảnh sẵn
 * bằng phần mềm (hạ 2× nhiều bước = lọc vùng chuẩn, như tự làm mip-chain) xuống ĐÚNG kích thước hiển thị,
 * bo góc AA ở kích thước đó, cache theo size; lúc vẽ chỉ [drawImage] **1:1** → GPU không phải thu nhỏ →
 * HẾT răng cưa, nét nhất có thể. Xem [JellyArt.at].
 *
 * Chỉ mục theo [JellyColor.ordinal] (YELLOW/MINT/PINK/BLUE). Cầu vồng đa sắc → 1 ảnh dùng chung.
 */
class JellyBitmaps(
    /** Thân 4 màu cơ bản (`blocks/jelly-*.png`). */
    val base: Array<JellyArt>,
    /** Thạch Hoàng Gia — siêu khối cấp 1 (`ui/hoanggia-*.png`). */
    val superL1: Array<JellyArt>,
    /** Vua Thạch — siêu khối cấp 2, khung vương miện (`ui/vuathach-*.png`). */
    val vuathach: Array<JellyArt>,
    /** Thạch Cầu Vồng (`ui/rainbow.png`). */
    val rainbow: JellyArt,
    /** Hoàng Đế Cầu Vồng (`ui/rainbowemperor.png`). */
    val rainbowEmperor: JellyArt,
) {
    fun base(color: JellyColor): JellyArt = base[color.ordinal]
    fun superL1(color: JellyColor): JellyArt = superL1[color.ordinal]
    fun vuathach(color: JellyColor): JellyArt = vuathach[color.ordinal]
}

// Bo góc — khớp design (`svg-assets.card.html`: `border-radius: 20%`, cũng bằng bán kính ô lưới trống).
private const val CORNER_RADIUS_FRAC = 0.20f

// Cache ảnh GỐC đã giải mã theo id (dùng CHUNG cả tiến trình). Ảnh ở drawable-nodpi (không scale theo
// density) nên không cần vô hiệu khi đổi cấu hình. Giữ ảnh gốc để dựng lại bản thu-nhỏ ở mọi kích thước.
private val rawCache = HashMap<Int, Bitmap>()

private fun loadRaw(res: Resources, id: Int): Bitmap = synchronized(rawCache) {
    rawCache.getOrPut(id) {
        BitmapFactory.decodeResource(res, id, BitmapFactory.Options().apply { inScaled = false })
    }
}

/**
 * Một art khối jelly: giữ ảnh GỐC vuông + cache bản đã **thu nhỏ chất lượng cao + bo góc** theo TỪNG
 * kích thước hiển thị (px). Nhờ vẽ 1:1 nên GPU không phải thu nhỏ → hết răng cưa (xem KDoc [JellyBitmaps]).
 *
 * [blockSize] trong game gần như cố định theo màn (ô bàn/khay/thumbnail) → cache chỉ vài size, rất nhẹ.
 * Squash/pop dùng canvas `scale()` (biến đổi, không đổi blockSize) nên không làm phình cache.
 */
class JellyArt internal constructor(private val src: Bitmap) {
    private val bySize = HashMap<Int, ImageBitmap>()
    private val byLifted = HashMap<Long, ImageBitmap>()

    /** ImageBitmap đã thu nhỏ về đúng [sizePx]² (bo góc AA sẵn). Cache theo size. */
    fun at(sizePx: Int): ImageBitmap {
        val size = sizePx.coerceIn(1, src.width)
        return synchronized(bySize) { bySize.getOrPut(size) { renderRounded(src, size) } }
    }

    /**
     * Bản "nhích lên" cho KHAY: nuốt bớt gờ-bóng đáy ([liftPx] px cuối) rồi phóng phần còn lại
     * lấp kín ô → trọng tâm khối dồn lên, bớt cảm giác nặng đáy. Chỉ dùng ở tray (xem [drawBlockImage]).
     * Cache theo (size, liftPx). [liftPx]=0 → giống [at].
     */
    fun atLifted(sizePx: Int, liftPx: Int): ImageBitmap {
        val size = sizePx.coerceIn(1, src.width)
        if (liftPx <= 0) return at(size)
        val key = size.toLong() * 1000L + liftPx.coerceAtMost(999)
        return synchronized(byLifted) { byLifted.getOrPut(key) { renderRoundedLifted(src, size, liftPx) } }
    }
}

/** Thu nhỏ [src] → [size]² chất lượng cao rồi bo góc 20% (AA). */
private fun renderRounded(src: Bitmap, size: Int): ImageBitmap {
    val small = highQualityScale(src, size)
    val out = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(out)
    val radius = size * CORNER_RADIUS_FRAC
    val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        isFilterBitmap = true
        isDither = true
        shader = BitmapShader(small, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP)
    }
    canvas.drawRoundRect(RectF(0f, 0f, size.toFloat(), size.toFloat()), radius, radius, paint)
    if (small !== src) small.recycle()
    return out.asImageBitmap()
}

/**
 * Như [renderRounded] nhưng CẮT [liftPx] px ở đáy rồi phóng phần trên lấp kín ô (bo góc AA ở [size]).
 * Cách làm: thu nhỏ vuông về [size]², kéo dãn dọc thành cao ([size]+[liftPx]) rồi chỉ lấy [size] hàng
 * TRÊN (BitmapShader mặc định lấy từ gốc) → hàng dưới cùng (gờ-bóng đáy) bị bỏ. Dãn ~[liftPx]/[size]
 * (vài %) không thấy méo, nhưng trọng tâm dồn lên. Chỉ cho tray.
 */
private fun renderRoundedLifted(src: Bitmap, size: Int, liftPx: Int): ImageBitmap {
    val base = highQualityScale(src, size)
    val tall = Bitmap.createScaledBitmap(base, size, size + liftPx, true)
    if (base !== src) base.recycle()
    val out = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(out)
    val radius = size * CORNER_RADIUS_FRAC
    val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        isFilterBitmap = true
        isDither = true
        shader = BitmapShader(tall, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP)
    }
    canvas.drawRoundRect(RectF(0f, 0f, size.toFloat(), size.toFloat()), radius, radius, paint)
    tall.recycle()
    return out.asImageBitmap()
}

/**
 * Thu nhỏ vuông [src] → [target]² bằng cách **hạ 2× nhiều bước** (mỗi bước bilinear = trung bình 2×2 =
 * lọc vùng sạch), bước cuối về đúng target. Đây là cách khử răng cưa chuẩn khi thu >2× (tự làm mip-chain),
 * hơn hẳn 1 phát bilinear từ 1254→110. KHÔNG recycle [src] (ảnh gốc dùng chung, cache lâu dài).
 */
private fun highQualityScale(src: Bitmap, target: Int): Bitmap {
    if (src.width == target) return src
    var cur = src
    while (cur.width / 2 >= target) {
        val nw = cur.width / 2
        val half = Bitmap.createScaledBitmap(cur, nw, nw, true)
        if (cur !== src) cur.recycle()
        cur = half
    }
    if (cur.width == target) return cur
    val fin = Bitmap.createScaledBitmap(cur, target, target, true)
    if (cur !== src) cur.recycle()
    return fin
}

/**
 * Tải bộ art khối jelly 1 lần (bọc [remember] theo [Resources]). Nhiều Canvas gọi hàm này → mỗi cái tự
 * cache [JellyBitmaps], nhưng [JellyArt] chỉ giữ tham chiếu ảnh gốc (cache theo id chung) nên rất nhẹ.
 */
@Composable
fun rememberJellyBitmaps(): JellyBitmaps {
    val res = LocalContext.current.resources
    return remember(res) {
        fun art(id: Int) = JellyArt(loadRaw(res, id))
        // Thứ tự PHẢI khớp JellyColor.entries: YELLOW, MINT, PINK, BLUE
        JellyBitmaps(
            base = arrayOf(
                art(R.drawable.jelly_yellow), art(R.drawable.jelly_mint),
                art(R.drawable.jelly_pink), art(R.drawable.jelly_blue),
            ),
            superL1 = arrayOf(
                art(R.drawable.hoanggia_yellow), art(R.drawable.hoanggia_mint),
                art(R.drawable.hoanggia_pink), art(R.drawable.hoanggia_blue),
            ),
            vuathach = arrayOf(
                art(R.drawable.vuathach_yellow), art(R.drawable.vuathach_mint),
                art(R.drawable.vuathach_pink), art(R.drawable.vuathach_blue),
            ),
            rainbow = art(R.drawable.rainbow),
            rainbowEmperor = art(R.drawable.rainbow_emperor),
        )
    }
}

/**
 * Vẽ THÂN khối vào ô [left]/[top] cạnh [blockSize]. Lấy bản art đã thu nhỏ về đúng [blockSize]² (bo góc
 * sẵn) rồi [drawImage] **1:1** (dstSize == kích thước bitmap) → GPU KHÔNG thu nhỏ → không răng cưa.
 *
 * Vị trí SUB-PIXEL: dịch bằng float [left]/[top] (không bo tròn) để mép không "nhảy" 1px khi trượt/cascade.
 * [FilterQuality.Low] (bilinear) lo phần lệch sub-pixel + biến đổi squash nhẹ (±12%) mượt; vì vẽ ~1:1 nên
 * không cần mipmap/High.
 */
internal fun DrawScope.drawBlockImage(
    art: JellyArt, left: Float, top: Float, blockSize: Float, alpha: Float = 1f,
    liftFrac: Float = 0f,
) {
    val size = blockSize.roundToInt().coerceAtLeast(1)
    val image = if (liftFrac > 0f) art.atLifted(size, (size * liftFrac).roundToInt()) else art.at(size)
    translate(left, top) {
        drawImage(
            image = image,
            dstOffset = IntOffset.Zero,
            dstSize = IntSize(size, size),
            alpha = alpha,
            filterQuality = FilterQuality.Low,
        )
    }
}
