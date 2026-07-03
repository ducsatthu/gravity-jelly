package com.gravityjelly.game

import androidx.compose.ui.graphics.Color
import com.gravityjelly.core.JellyColor

data class BlockPalette(val fill: Color, val edge: Color, val shine: Color)

object JellyTheme {
    val bg = Color(0xFFFFF7EC)
    val surfaceSunken = Color(0xFFF4E9D8)
    val cellEmpty = Color(0xFFFBEFDD)
    val cellLine = Color(0xFFEFE0C9)
    val textOnBlock = Color(0xFF6A4A2E)
    val textPrimary = Color(0xFF5B4636)
    val textMuted = Color(0xFF9B886F)
    val eyeWhite = Color(0xFFFFFFFF)
    val pupil = Color(0xFF5B4636)

    val yellow = BlockPalette(Color(0xFFFFE3A3), Color(0xFFE8B85C), Color(0xFFFFF1CE))
    val mint = BlockPalette(Color(0xFFA3E5D9), Color(0xFF5FC3B2), Color(0xFFCBF2EB))
    val pink = BlockPalette(Color(0xFFF7A9C0), Color(0xFFE576A0), Color(0xFFFBD0DF))
    val blue = BlockPalette(Color(0xFFB3C7F7), Color(0xFF7E9CE8), Color(0xFFD6E1FB))
    val stone = BlockPalette(Color(0xFFC9BCA8), Color(0xFFA89A82), Color(0xFFDBD0BF))
    val trash = BlockPalette(Color(0xFFB5A48A), Color(0xFF8F7D64), Color(0xFFCABBA3))
    val vine = BlockPalette(Color(0xFF9ECF7E), Color(0xFF6BA352), Color(0xFFC0E4A0))

    /** Accent cơ chế chữ ký — nút xoay trọng lực. */
    val gravity = BlockPalette(Color(0xFF7E6CF0), Color(0xFF6353D6), Color(0xFFA99CF6))

    fun forColor(color: JellyColor): BlockPalette = when (color) {
        JellyColor.YELLOW -> yellow
        JellyColor.MINT -> mint
        JellyColor.PINK -> pink
        JellyColor.BLUE -> blue
    }
}
