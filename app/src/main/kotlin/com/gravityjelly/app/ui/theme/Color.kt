package com.gravityjelly.app.ui.theme

import androidx.compose.ui.graphics.Color

/**
 * Màu — dịch 1:1 từ Gravity Jelly Design System (01-tokens/01-colors.css).
 * Giữ nguyên giá trị để khớp thiết kế. Truy cập qua GjColors trong Theme.kt.
 */
object GjPalette {
    // Surfaces
    val Bg = Color(0xFFFFF7EC)
    val Surface = Color(0xFFFFFFFF)
    val SurfaceSunken = Color(0xFFF4E9D8)
    val Overlay = Color(0x6B3C2C18) // rgba(60,44,24,0.42)

    // Jelly fills
    val BlockYellow = Color(0xFFFFE3A3)
    val BlockMint = Color(0xFFA3E5D9)
    val BlockPink = Color(0xFFF7A9C0)
    val BlockBlue = Color(0xFFB3C7F7)

    // Jelly edges
    val BlockYellowEdge = Color(0xFFE8B85C)
    val BlockMintEdge = Color(0xFF5FC3B2)
    val BlockPinkEdge = Color(0xFFE576A0)
    val BlockBlueEdge = Color(0xFF7E9CE8)

    // Jelly shines
    val BlockYellowShine = Color(0xFFFFF1CE)
    val BlockMintShine = Color(0xFFCBF2EB)
    val BlockPinkShine = Color(0xFFFBD0DF)
    val BlockBlueShine = Color(0xFFD6E1FB)

    // Stone
    val Stone = Color(0xFFC9BCA8)
    val StoneEdge = Color(0xFFA89A82)
    val StoneShine = Color(0xFFDBD0BF)

    // Grid cell
    val CellEmpty = Color(0xFFFBEFDD)
    val CellLine = Color(0xFFEFE0C9)

    // Text
    val Text = Color(0xFF5B4636)
    val TextMuted = Color(0xFF9B886F)
    val TextInvert = Color(0xFFFFFFFF)
    val TextOnBlock = Color(0xFF6A4A2E)

    // Brand / primary
    val Primary = Color(0xFFFF9F68)
    val PrimaryEdge = Color(0xFFE97E45)
    val PrimaryShine = Color(0xFFFFC59A)

    // Semantic
    val Success = Color(0xFF6FCF7F)
    val Warning = Color(0xFFFFCA66)
    val Danger = Color(0xFFF08A7E)
    val Info = Color(0xFF8FB6F2)
    val Star = Color(0xFFFFC23D)

    // Gravity accent (signature mechanic)
    val Gravity = Color(0xFF7E6CF0)
    val GravityEdge = Color(0xFF6353D6)
    val GravityShine = Color(0xFFA99CF6)

    // Shadows
    val ShadowSoft = Color(0x29785C34) // rgba(120,92,52,0.16)
    val ShadowKey = Color(0x3D785C34)  // rgba(120,92,52,0.24)
}
