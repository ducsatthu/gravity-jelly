package com.gravityjelly.app

import androidx.annotation.DrawableRes
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
        1    -> R.drawable.ingame_world_1_bg
        // 2 -> R.drawable.ingame_world_2_bg   // Rừng rậm — thêm khi có art
        else -> R.drawable.ingame_world_1_bg
    }

    /** Tên hiển thị của [world] (bảng world trong design system / CLAUDE.md). */
    fun name(world: Int): String = when (world) {
        1 -> "Đồng cỏ"; 2 -> "Rừng rậm"; 3 -> "Sông & Thác"; 4 -> "Sa mạc"; 5 -> "Bãi biển"
        6 -> "Núi tuyết"; 7 -> "Hang băng"; 8 -> "Núi lửa"; 9 -> "Bầu trời"; 10 -> "Vũ trụ"
        else -> "Đồng cỏ"
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
