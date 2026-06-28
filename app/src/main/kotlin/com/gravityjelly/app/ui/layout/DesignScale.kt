package com.gravityjelly.app.ui.layout

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Density

/** Bề rộng baseline của design system (360×800 dp). Mọi token dp/sp authored theo mốc này. */
const val DESIGN_BASELINE_WIDTH_DP = 360f

// Kẹp tỉ lệ để máy rất hẹp/rất rộng (gập, tablet) không phóng/thu quá đà.
private const val MIN_SCALE = 0.85f
private const val MAX_SCALE = 1.30f

/**
 * Scale TOÀN BỘ UI theo bề rộng màn so với baseline 360dp của design — để mọi thiết bị
 * giữ **cùng tỉ lệ** như bản thiết kế (HUD/tray/font/khối/padding co giãn đồng nhất cùng bàn),
 * thay vì dp tuyệt đối làm chrome "nhỏ lại" trên máy rộng.
 *
 * Cơ chế: override [LocalDensity] sao cho `360.dp` ánh xạ đúng bề rộng thật của máy.
 * `scale = screenWidthDp / 360` (kẹp [MIN_SCALE]..[MAX_SCALE]); nhân vào `density`
 * nên dp **và** sp đều co giãn theo. `fontScale` giữ nguyên (tôn trọng cỡ chữ hệ thống/a11y).
 *
 * Đặt bao quanh nội dung app (trong Theme) ở [MainActivity].
 */
@Composable
fun ProvideDesignDensity(
    baselineWidthDp: Float = DESIGN_BASELINE_WIDTH_DP,
    content: @Composable () -> Unit,
) {
    val configuration = LocalConfiguration.current
    val base = LocalDensity.current
    val scale = (configuration.screenWidthDp / baselineWidthDp).coerceIn(MIN_SCALE, MAX_SCALE)
    val scaled = Density(density = base.density * scale, fontScale = base.fontScale)
    CompositionLocalProvider(LocalDensity provides scaled, content = content)
}
