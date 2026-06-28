package com.gravityjelly.app.ads

/**
 * Cấu hình quảng cáo (business §8, technical §Services).
 * Dùng TEST ad unit id khi dev — thay id thật khi phát hành.
 * Trigger interstitial THEO SỰ KIỆN (số lần thua) + cooldown + ân hạn người mới,
 * KHÔNG theo bộ đếm thời gian thuần.
 */
object AdsConfig {
    // Google test ad units (an toàn để dev; không tính doanh thu).
    const val INTERSTITIAL_UNIT = "ca-app-pub-3940256099942544/1033173712"
    const val REWARDED_UNIT = "ca-app-pub-3940256099942544/5224354917"

    /** Số ván thua đầu được "ân hạn" (người mới không bị interstitial). */
    const val GRACE_GAMES = 2

    /** Sau ân hạn: cứ mỗi N lần thua mới hiện interstitial. */
    const val LOSS_INTERVAL = 3

    /** Thời gian chờ tối thiểu giữa hai interstitial (ms) — guard phụ, không phải trigger chính. */
    const val COOLDOWN_MS = 90_000L
}
