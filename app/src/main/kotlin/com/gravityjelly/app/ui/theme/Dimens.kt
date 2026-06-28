package com.gravityjelly.app.ui.theme

import androidx.compose.ui.unit.dp

/** Spacing, dimension, radius — dịch từ 01-tokens/03-spacing-radius + 04-dimensions. */
object GjSpace {
    val xxs = 2.dp
    val xs = 4.dp
    val sm = 8.dp
    val md = 12.dp
    val lg = 16.dp
    val xl = 24.dp
    val xxl = 32.dp
    val xxxl = 48.dp
}

object GjRadius {
    val sm = 8.dp
    val md = 12.dp
    val lg = 20.dp
    val xl = 28.dp
    val xxl = 36.dp
    val full = 999.dp
}

object GjBorder {
    val thin = 1.5.dp
    val jelly = 3.dp
    val bold = 4.dp
}

object GjDimens {
    // Board 9x9
    val cell = 36.dp
    val cellGap = 2.dp
    val board = 340.dp
    val boardMargin = 10.dp
    val boardPad = 8.dp
    // HUD / controls
    val hudHeight = 56.dp
    val trayHeight = 112.dp
    val traySlot = 96.dp
    val gravityBtn = 64.dp
    val ctaHeight = 56.dp
    val btnHeight = 48.dp
    val touchMin = 48.dp
    // Icons
    val iconSm = 20.dp
    val iconMd = 24.dp
    val iconLg = 32.dp
}
