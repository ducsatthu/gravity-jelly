package com.gravityjelly.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.ExperimentalTextApi
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontVariation
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.R

// Display: Baloo 2 — tròn-mập "candy/jelly" như Fredoka NHƯNG đủ glyph tiếng Việt.
// (Fredoka chỉ phủ Latin/Math/Hebrew — không có dấu tiếng Việt → chữ vỡ; xem ghi chú dự án.)
@OptIn(ExperimentalTextApi::class)
private val DisplayFamily = FontFamily(
    Font(
        resId = R.font.baloo2_variable,
        weight = FontWeight.SemiBold,
        variationSettings = FontVariation.Settings(FontVariation.weight(600)),
    ),
    Font(
        resId = R.font.baloo2_variable,
        weight = FontWeight.Bold,
        variationSettings = FontVariation.Settings(FontVariation.weight(700)),
    ),
    // ExtraBold (800) — weight "số / score pop" của thiết kế (--weight-extra) cho điểm/kỷ lục.
    Font(
        resId = R.font.baloo2_variable,
        weight = FontWeight.ExtraBold,
        variationSettings = FontVariation.Settings(FontVariation.weight(800)),
    ),
)

@OptIn(ExperimentalTextApi::class)
private val NunitoFamily = FontFamily(
    Font(
        resId = R.font.nunito_variable,
        weight = FontWeight.SemiBold,
        variationSettings = FontVariation.Settings(FontVariation.weight(600)),
    ),
    Font(
        resId = R.font.nunito_variable,
        weight = FontWeight.Bold,
        variationSettings = FontVariation.Settings(FontVariation.weight(700)),
    ),
    Font(
        resId = R.font.nunito_variable,
        weight = FontWeight.ExtraBold,
        variationSettings = FontVariation.Settings(FontVariation.weight(800)),
    ),
    Font(
        resId = R.font.nunito_variable,
        weight = FontWeight.Black,
        variationSettings = FontVariation.Settings(FontVariation.weight(900)),
    ),
)

/**
 * Fredoka — CHỈ dùng cho logo wordmark "GRAVITY / JELLY" (thuần Latin, không dấu).
 * KHÔNG dùng cho text có tiếng Việt vì Fredoka thiếu glyph dấu (xem ghi chú dự án).
 */
@OptIn(ExperimentalTextApi::class)
val GjLogoFontFamily = FontFamily(
    Font(
        resId = R.font.fredoka_variable,
        weight = FontWeight.SemiBold,
        variationSettings = FontVariation.Settings(FontVariation.weight(600)),
    ),
    Font(
        resId = R.font.fredoka_variable,
        weight = FontWeight.Bold,
        variationSettings = FontVariation.Settings(FontVariation.weight(700)),
    ),
)

private val Display = DisplayFamily
private val Body = NunitoFamily

val GjTypography = Typography(
    // display / logo / điểm lớn
    displayLarge = TextStyle(fontFamily = Display, fontWeight = FontWeight.Bold, fontSize = 40.sp, lineHeight = 42.sp),
    // tiêu đề màn
    headlineLarge = TextStyle(fontFamily = Display, fontWeight = FontWeight.Bold, fontSize = 28.sp, lineHeight = 32.sp),
    // heading / dialog title
    headlineMedium = TextStyle(fontFamily = Display, fontWeight = FontWeight.SemiBold, fontSize = 22.sp, lineHeight = 28.sp),
    // số HUD
    titleLarge = TextStyle(fontFamily = Display, fontWeight = FontWeight.Bold, fontSize = 20.sp, lineHeight = 24.sp),
    // body UI
    bodyLarge = TextStyle(fontFamily = Body, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, lineHeight = 23.sp),
    // nhãn nút / list
    labelLarge = TextStyle(fontFamily = Body, fontWeight = FontWeight.Bold, fontSize = 14.sp, lineHeight = 18.sp),
    // caption / hint
    labelSmall = TextStyle(fontFamily = Body, fontWeight = FontWeight.SemiBold, fontSize = 12.sp, lineHeight = 16.sp),
)
