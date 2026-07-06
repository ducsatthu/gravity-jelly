package com.gravityjelly.app.analytics

import android.content.Context
import android.os.Bundle
import android.util.Log
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.crashlytics.FirebaseCrashlytics

/**
 * Services tracking (CLAUDE.md §:app · Services): **GA4 (Firebase Analytics) + Crashlytics**.
 *
 * Nguyên tắc:
 * - **No-op an toàn** khi chưa có `app/google-services.json` (Firebase chưa cấu hình) — getInstance
 *   có thể ném → bọc [runCatching], mọi hàm log thành rỗng, app vẫn chạy bình thường.
 * - **Privacy-first**: manifest đặt thu thập MẶC ĐỊNH TẮT; chỉ [setCollectionEnabled] = true SAU khi
 *   người dùng đồng thuận (UMP `canRequestAds`). Ngoài EEA thường bật ngay.
 * - Chỉ chứa ở lớp `:app`; `:core` không biết gì về tracking.
 */
class AnalyticsManager(context: Context) {

    private val appContext = context.applicationContext

    private val analytics: FirebaseAnalytics? =
        runCatching { FirebaseAnalytics.getInstance(appContext) }
            .onFailure { Log.i(TAG, "Firebase Analytics chưa sẵn sàng (thiếu google-services.json?)") }
            .getOrNull()

    private val crashlytics: FirebaseCrashlytics? =
        runCatching { FirebaseCrashlytics.getInstance() }.getOrNull()

    /** Có Firebase để log hay không (thiếu google-services.json → false, mọi thứ no-op). */
    val available: Boolean get() = analytics != null

    /**
     * Bật/tắt thu thập dữ liệu (gọi sau khi biết trạng thái đồng thuận). Idempotent.
     * enabled=false: tôn trọng người dùng từ chối; Crashlytics cũng dừng gửi.
     */
    fun setCollectionEnabled(enabled: Boolean) {
        analytics?.setAnalyticsCollectionEnabled(enabled)
        crashlytics?.isCrashlyticsCollectionEnabled = enabled
        Log.i(TAG, "collection enabled=$enabled")
    }

    // ── Sự kiện game (GA4) ──────────────────────────────────────────────────────

    /** Vào một ván (mode = "endless" | "campaign"). */
    fun logGameStart(mode: String) = log("game_start") {
        putString("mode", mode)
    }

    /** Kết thúc ván Endless. */
    fun logEndlessGameOver(score: Int) = log("game_over") {
        putString("mode", "endless")
        putLong("score", score.toLong())
    }

    /** Đạt best mới (Endless). */
    fun logHighScore(score: Int) = log(FirebaseAnalytics.Event.POST_SCORE) {
        putLong(FirebaseAnalytics.Param.SCORE, score.toLong())
    }

    /** Qua màn Campaign. */
    fun logLevelComplete(levelId: Int, stars: Int) = log(FirebaseAnalytics.Event.LEVEL_END) {
        putString(FirebaseAnalytics.Param.LEVEL_NAME, "level_$levelId")
        putLong(FirebaseAnalytics.Param.LEVEL, levelId.toLong())
        putLong("stars", stars.toLong())
        putLong("success", 1L)
    }

    /** Xem màn hình (GA4 screen_view). */
    fun logScreenView(screen: String) = log(FirebaseAnalytics.Event.SCREEN_VIEW) {
        putString(FirebaseAnalytics.Param.SCREEN_NAME, screen)
    }

    /** Đã hiển thị quảng cáo (type = "interstitial" | "rewarded"). */
    fun logAdShown(type: String) = log("ad_shown") {
        putString("ad_type", type)
    }

    // ── Crashlytics ─────────────────────────────────────────────────────────────

    /** Ghi log breadcrumb vào Crashlytics (kèm theo crash gần nhất). */
    fun breadcrumb(message: String) {
        crashlytics?.log(message)
    }

    /** Ghi nhận lỗi non-fatal (đã bắt) để theo dõi trên Crashlytics. */
    fun recordError(throwable: Throwable) {
        crashlytics?.recordException(throwable)
    }

    private inline fun log(event: String, params: Bundle.() -> Unit = {}) {
        val a = analytics ?: return
        a.logEvent(event, Bundle().apply(params))
    }

    companion object {
        private const val TAG = "AnalyticsManager"
    }
}
