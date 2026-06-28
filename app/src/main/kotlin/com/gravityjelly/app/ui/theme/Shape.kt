package com.gravityjelly.app.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes

/** Bo góc — dịch từ 01-tokens/03-spacing-radius (jelly = bo rộng). */
val GjShapes = Shapes(
    small = RoundedCornerShape(GjRadius.sm),   // 8 chip
    medium = RoundedCornerShape(GjRadius.lg),  // 20 thẻ
    large = RoundedCornerShape(GjRadius.xl),   // 28 nút/panel
)
