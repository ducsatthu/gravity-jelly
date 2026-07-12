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

    /** Số lần thử nạp lại tối đa (mỗi lần vào màn) khi load hụt — thường do mất mạng. */
    const val MAX_LOAD_RETRIES = 4

    /** Backoff giữa các lần thử lại (ms) — tăng dần để không "quay tay" khi offline kéo dài. */
    val RETRY_DELAYS_MS = longArrayOf(2_000L, 5_000L, 15_000L, 30_000L)

    /**
     * Delay (ms) cho lần thử nạp lại thứ [attempt] (0-based) sau khi load hụt.
     * `null` = đã hết ngân sách ([MAX_LOAD_RETRIES] lần) → DỪNG retry (offline không hao pin).
     */
    fun retryDelayMs(attempt: Int): Long? =
        if (attempt < 0 || attempt >= MAX_LOAD_RETRIES) null
        else RETRY_DELAYS_MS[attempt.coerceAtMost(RETRY_DELAYS_MS.lastIndex)]

    /**
     * Endless: có hiện interstitial sau ván thua thứ [gameOverCount] (1-based) không?
     * CHỐT: MỌI ván — không ân hạn/đếm-thua/cooldown (khác [showsAdOnCampaignClear] & loss-gate).
     * Chỉ cần đã preload; nếu chưa kịp thì [AdsManager] bỏ qua ván đó (offline không ảnh hưởng).
     */
    fun showsAdOnEndlessGameOver(gameOverCount: Int): Boolean = gameOverCount >= 1

    /**
     * Hash thiết bị test cho UMP (ép hiện form đồng thuận EEA khi dev).
     * Lấy từ logcat khi chạy: dòng "Use ConsentDebugSettings.Builder().addTestDeviceHashedId(\"…\")".
     * Rỗng = tắt debug (dùng địa lý thật). KHÔNG để giá trị khi phát hành.
     */
    val TEST_DEVICE_HASHES: List<String> = emptyList()

    /**
     * Có hiện interstitial sau khi THẮNG màn Campaign [levelId] không? (áp cho MỌI world/chiến dịch)
     * - **Boss cuối world** (id 10/20/30/…, gồm cả boss L10 của 10 màn đầu) → sau khi hạ gục.
     * - **Mốc GIỮA world từ World 2 trở đi** (L16/L26/L36…, tức id%10==6 & id≥16).
     * 10 màn đầu (L1–L9) KHÔNG có mốc giữa — chỉ quảng cáo ở boss L10.
     */
    fun showsAdOnCampaignClear(levelId: Int): Boolean =
        levelId % 10 == 0 || (levelId >= 16 && levelId % 10 == 6)
}
