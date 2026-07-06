package com.gravityjelly.app.ads

/**
 * Cấu hình quảng cáo (business §8, technical §Services).
 * Dùng TEST ad unit id khi dev — thay id thật khi phát hành.
 * Trigger interstitial THEO SỰ KIỆN (số lần thua) + cooldown + ân hạn người mới,
 * KHÔNG theo bộ đếm thời gian thuần.
 */
object AdsConfig {
    // Ad unit id theo build type (build.gradle.kts): debug = TEST, release = THẬT.
    // App ID (manifest) đọc qua @string/admob_app_id, cũng tách theo build type.
    val INTERSTITIAL_UNIT = com.gravityjelly.app.BuildConfig.ADMOB_INTERSTITIAL_UNIT
    val REWARDED_UNIT = com.gravityjelly.app.BuildConfig.ADMOB_REWARDED_UNIT

    /** Số ván thua đầu được "ân hạn" (người mới không bị interstitial). */
    const val GRACE_GAMES = 2

    /** Sau ân hạn: cứ mỗi N lần thua mới hiện interstitial. */
    const val LOSS_INTERVAL = 3

    /** Thời gian chờ tối thiểu giữa hai interstitial (ms) — guard phụ, không phải trigger chính. */
    const val COOLDOWN_MS = 90_000L

    /**
     * Hash thiết bị test cho UMP (ép hiện form đồng thuận EEA khi dev).
     * Lấy từ logcat khi chạy: dòng "Use ConsentDebugSettings.Builder().addTestDeviceHashedId(\"…\")".
     * Rỗng = tắt debug (dùng địa lý thật). KHÔNG để giá trị khi phát hành.
     */
    val TEST_DEVICE_HASHES: List<String> = emptyList()
}
