package com.gravityjelly.core

/**
 * Combo hồi lượt xoay trọng lực — cơ chế chữ ký, dùng CHUNG cho mọi cách chơi
 * (Endless, màn thiết kế, boss, Daily…). Xem docs/business-understanding.md §6.
 *
 * Luật: mỗi lần BẬC COMBO tăng lên một mức ≥ x2 thì hồi +1 lượt xoay.
 *   x2 → +1, x3 → tổng +2, x4 → tổng +3… (hồi cộng dồn = bậc combo − 1 nếu combo chỉ tăng).
 *
 * Là hàm THUẦN của chuỗi combo → không phá yêu cầu deterministic.
 */
object ComboReward {
    /**
     * Số lượt xoay hồi khi combo đi từ [before] lên [after].
     * Đếm số mức combo MỚI đạt mà ≥ 2 trong khoảng (before, after].
     * Trả 0 khi combo không tăng (after ≤ before) hoặc chưa tới x2.
     */
    fun rotationRefund(before: Int, after: Int): Int =
        maxOf(0, after - maxOf(before, 1))
}
