package com.gravityjelly.app.ads

import android.app.Activity
import android.content.Context
import android.os.SystemClock
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.gravityjelly.app.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Services AdMob (CLAUDE.md §:app · technical §Services).
 *
 * Nguyên tắc:
 * - Init SDK **lazy ở luồng nền**; PRELOAD interstitial + rewarded TRƯỚC khi cần.
 * - Interstitial **theo sự kiện** (số lần thua) + cooldown + ân hạn người mới — không theo timer thuần.
 * - **KHÔNG load lúc vừa thua**: [onGameOver] chỉ SHOW bản đã preload; nạp bản kế sau khi đóng.
 * - Mọi thao tác load/show của GMA chạy trên main thread (gọi từ UI).
 *
 * Tất cả state giữ ở đây (ngoài Compose); UI chỉ gọi [initialize]/[prepare]/[onGameOver]/[showRewarded].
 */
class AdsManager(context: Context) {

    private val appContext = context.applicationContext

    private var initialized = false
    private var interstitial: InterstitialAd? = null
    private var rewarded: RewardedAd? = null
    private var loadingInterstitial = false
    private var loadingRewarded = false

    private var lossCount = 0
    private var lastInterstitialAtMs = 0L

    /** Init SDK ở luồng nền rồi preload (gọi một lần lúc khởi động). Idempotent. */
    suspend fun initialize() {
        if (!BuildConfig.ADS_ENABLED) return
        if (initialized) return
        initialized = true
        withContext(Dispatchers.IO) {
            runCatching { MobileAds.initialize(appContext) {} }
                .onFailure { Log.w(TAG, "MobileAds init failed", it) }
        }
        // load phải ở main thread
        withContext(Dispatchers.Main) { preloadAll() }
    }

    /** Làm ấm quảng cáo TRƯỚC khi người chơi có thể cần (gọi khi vào màn chơi). KHÔNG gọi lúc thua. */
    fun prepare() {
        if (!BuildConfig.ADS_ENABLED || !initialized) return
        preloadAll()
    }

    private fun preloadAll() {
        preloadInterstitial()
        preloadRewarded()
    }

    private fun preloadInterstitial() {
        if (interstitial != null || loadingInterstitial) return
        loadingInterstitial = true
        InterstitialAd.load(
            appContext,
            AdsConfig.INTERSTITIAL_UNIT,
            AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitial = ad
                    loadingInterstitial = false
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    interstitial = null
                    loadingInterstitial = false
                    Log.w(TAG, "interstitial load failed: ${error.message}")
                }
            },
        )
    }

    private fun preloadRewarded() {
        if (rewarded != null || loadingRewarded) return
        loadingRewarded = true
        RewardedAd.load(
            appContext,
            AdsConfig.REWARDED_UNIT,
            AdRequest.Builder().build(),
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    rewarded = ad
                    loadingRewarded = false
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    rewarded = null
                    loadingRewarded = false
                    Log.w(TAG, "rewarded load failed: ${error.message}")
                }
            },
        )
    }

    /**
     * Sự kiện thua: hiện interstitial nếu đủ điều kiện (ân hạn → mỗi N lần → cooldown → đã preload).
     * KHÔNG load ở đây — chỉ show bản sẵn có; nạp bản kế khi ad đóng.
     * @return true nếu đã show (để UI có thể hoãn dialog cho tới khi ad đóng nếu muốn).
     */
    fun onGameOver(activity: Activity): Boolean {
        if (!BuildConfig.ADS_ENABLED) return false
        lossCount++
        if (lossCount <= AdsConfig.GRACE_GAMES) return false
        if ((lossCount - AdsConfig.GRACE_GAMES) % AdsConfig.LOSS_INTERVAL != 0) return false

        val now = SystemClock.elapsedRealtime()
        if (now - lastInterstitialAtMs < AdsConfig.COOLDOWN_MS) return false

        val ad = interstitial ?: return false // chưa preload kịp → bỏ qua, KHÔNG load lúc thua
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                interstitial = null
                preloadInterstitial() // nạp bản kế sau khi đóng (không gây giật lúc thua)
            }

            override fun onAdFailedToShowFullScreenContent(error: AdError) {
                interstitial = null
                preloadInterstitial()
            }
        }
        lastInterstitialAtMs = now
        interstitial = null
        ad.show(activity)
        return true
    }

    /**
     * Rewarded: show bản đã preload; [onReward] khi user nhận thưởng, [onUnavailable] nếu chưa sẵn.
     * Nạp bản kế sau khi đóng.
     */
    fun showRewarded(activity: Activity, onReward: () -> Unit, onUnavailable: () -> Unit) {
        if (!BuildConfig.ADS_ENABLED) { onUnavailable(); return }
        val ad = rewarded
        if (ad == null) {
            preloadRewarded()
            onUnavailable()
            return
        }
        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                rewarded = null
                preloadRewarded()
            }

            override fun onAdFailedToShowFullScreenContent(error: AdError) {
                rewarded = null
                preloadRewarded()
                onUnavailable()
            }
        }
        rewarded = null
        ad.show(activity) { _ -> onReward() }
    }

    /** Có sẵn rewarded để mời xem hay không (để ẩn/hiện nút). */
    val rewardedReady: Boolean get() = rewarded != null

    companion object {
        private const val TAG = "AdsManager"
    }
}
