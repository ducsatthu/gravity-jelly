package com.gravityjelly.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

/**
 * Theme Gravity Jelly: bám design system block jelly (kem ấm, primary cam, gravity tím).
 * Dùng warm light scheme; màu thương hiệu đầy đủ ở [GjPalette].
 */
private val GjColorScheme = lightColorScheme(
    primary = GjPalette.Primary,
    onPrimary = GjPalette.TextInvert,
    secondary = GjPalette.Gravity,
    onSecondary = GjPalette.TextInvert,
    tertiary = GjPalette.Info,
    background = GjPalette.Bg,
    onBackground = GjPalette.Text,
    surface = GjPalette.Surface,
    onSurface = GjPalette.Text,
    surfaceVariant = GjPalette.SurfaceSunken,
    onSurfaceVariant = GjPalette.TextMuted,
    error = GjPalette.Danger,
)

@Composable
fun GravityJellyTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = GjColorScheme,
        typography = GjTypography,
        shapes = GjShapes,
        content = content,
    )
}
