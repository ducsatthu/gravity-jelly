package com.gravityjelly.app

import androidx.annotation.DrawableRes
import androidx.annotation.StringRes
import androidx.compose.ui.graphics.Color

/**
 * Bảng tra **theme theo world** cho lớp vỏ (app-side resource concern, không phải luật chơi).
 *
 * Mỗi world (Đồng cỏ, Rừng rậm, … — xem bảng world trong design system) có một nền riêng.
 * Màn Game và cả **chế độ luyện tập (Endless)** đều lấy nền qua đây: truyền `world` hiện tại
 * (world người chơi đang mở / đang chọn) → nhận đúng ảnh nền.
 *
 * Hiện chỉ world 1 (Đồng cỏ) có art. World chưa vẽ nền sẽ **fallback về world 1** để không vỡ
 * bố cục — thêm world mới chỉ cần drop `ingame_world_N_bg.png` vào drawable và nối một nhánh.
 */
object WorldTheme {

    /** Res nền in-game cho [world]. Fallback world 1 khi world chưa có art riêng. */
    @DrawableRes
    fun ingameBackground(world: Int): Int = when (world) {
        2    -> R.drawable.ingame_world_2_bg   // Rừng rậm (forest-bg)
        3    -> R.drawable.ingame_world_3_bg   // Sông & Thác (waterfall-bg)
        else -> R.drawable.ingame_world_1_bg   // Đồng cỏ (meadow) — mặc định
    }

    /** Res nền màn HOME cho [world] (đổi theo world người chơi đang tiến tới). Fallback world 1. */
    @DrawableRes
    fun homeBackground(world: Int): Int = when (world) {
        2    -> R.drawable.home_world_2_bg
        3    -> R.drawable.home_world_3_bg
        else -> R.drawable.home_world_1_bg
    }

    /**
     * Màu TRỜI ở đỉnh ảnh nền Home (lấp dải trên khi màn cao hơn ảnh) — lấy mẫu từ mép trên từng ảnh
     * home-world-N-bg để blend liền: W1 #8ECDF3 (JSX), W2 #A7DFD0 (rừng), W3 #64CBF1 (sông).
     */
    fun homeSky(world: Int): Color = when (world) {
        2    -> Color(0xFFA7DFD0)
        3    -> Color(0xFF64CBF1)
        else -> Color(0xFF8ECDF3)
    }

    /** Res tên hiển thị của [world] (đa ngôn ngữ — `values(-en)/strings.xml`). Resolve bằng `stringResource`. */
    @StringRes
    fun nameRes(world: Int): Int = when (world) {
        1 -> R.string.world_1_name; 2 -> R.string.world_2_name; 3 -> R.string.world_3_name
        4 -> R.string.world_4_name; 5 -> R.string.world_5_name; 6 -> R.string.world_6_name
        7 -> R.string.world_7_name; 8 -> R.string.world_8_name; 9 -> R.string.world_9_name
        10 -> R.string.world_10_name; else -> R.string.world_1_name
    }

    /**
     * Màu nhấn theo biome của [world] — dùng cho node màn ở màn intro (level-intro-screen.jsx `accent`).
     * Lấy từ palette design (colors.css) cho khớp tông sweet-candy. World chưa vẽ → fallback world 1.
     */
    fun accent(world: Int): Color = when (world) {
        1 -> Color(0xFF6FCF7F)   // success — Đồng cỏ
        2 -> Color(0xFF4F9D5A)   // rừng xanh đậm
        3 -> Color(0xFF8FB6F2)   // info — Sông & Thác
        4 -> Color(0xFFFFCA66)   // warning — Sa mạc cát
        5 -> Color(0xFF5FC3B2)   // mint-edge — Bãi biển
        6 -> Color(0xFFB3C7F7)   // blue — Núi tuyết
        7 -> Color(0xFF7AC7DE)   // băng lam
        8 -> Color(0xFFF08A7E)   // danger — Núi lửa
        9 -> Color(0xFF8FB6F2)   // sky — Bầu trời
        10 -> Color(0xFF7E6CF0)  // gravity — Vũ trụ
        else -> Color(0xFF6FCF7F)
    }
}
