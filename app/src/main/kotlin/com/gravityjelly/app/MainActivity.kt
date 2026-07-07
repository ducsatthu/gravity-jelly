package com.gravityjelly.app

import android.os.Bundle
import android.provider.Settings
import androidx.appcompat.app.AppCompatActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.gravityjelly.app.ads.AdsManager
import com.gravityjelly.app.ads.ConsentManager
import com.gravityjelly.app.analytics.AnalyticsManager
import com.gravityjelly.app.games.PlayGamesManager
import com.gravityjelly.app.audio.GjAudioManager
import com.gravityjelly.app.audio.LocalGjAudio
import com.gravityjelly.app.data.GjSettings
import com.gravityjelly.app.data.SettingsRepository
import com.gravityjelly.app.ui.layout.ProvideDesignDensity
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.core.CampaignLevels
import com.gravityjelly.game.GjEase
import com.gravityjelly.game.GjMotion
import kotlinx.coroutines.launch

/**
 * Vỏ ứng dụng (CLAUDE.md §:app): điều hướng màn + lắp ráp :core + :game + Services.
 * Phase 3: Home ⇄ Endless chơi được trọn vòng; best + cài đặt bền qua DataStore (Prompt 13).
 * AdMob (Prompt 14) sau.
 */
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // Splash hệ thống (Theme.GravityJelly.Splash): icon khối jelly trên nền kem ngay cold start,
        // tự tan khi Compose vẽ frame đầu → trao cho màn Splash Compose. Gọi trước super.onCreate.
        installSplashScreen()
        super.onCreate(savedInstanceState)
        if (savedInstanceState != null) {
            @Suppress("DEPRECATION")
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        }
        enableEdgeToEdge()
        setContent {
            GravityJellyTheme {
                // Scale toàn UI theo bề rộng 360dp baseline → cùng tỉ lệ trên mọi thiết bị.
                ProvideDesignDensity {
                    Surface(modifier = Modifier.fillMaxSize()) {
                        GravityJellyApp()
                    }
                }
            }
        }
    }
}

/**
 * Tuyến điều hướng (sealed) — vỏ shell ở :app. Mỗi màn chỉ nhận callback điều hướng,
 * KHÔNG màn nào gọi trực tiếp màn kia. Chừa chỗ [LevelMap] cho sau MVP.
 * (Result là overlay trong [Route.Game] — xem EndlessGameScreen.)
 */
private sealed interface Route {
    data object Splash : Route
    data object Home : Route
    data object Game : Route
    data object Settings : Route
    data object Handbook : Route   // Cẩm nang (tạm thay Daily)
    data object Leaderboard : Route // Bảng xếp hạng (nội bộ, offline)
    data object Campaign : Route   // Chọn màn Campaign (prototype)
    data class CampaignIntro(val index: Int) : Route  // Giới thiệu màn trước khi chơi
    data class CampaignPlay(val index: Int) : Route   // Chơi một màn Campaign
}

@Composable
private fun GravityJellyApp() {
    val context = LocalContext.current
    val repo = remember { SettingsRepository(context) }
    val ads = remember { AdsManager(context) }
    val analytics = remember { AnalyticsManager(context) }
    val games = remember { PlayGamesManager(context) }
    val audio = remember { GjAudioManager(context) }
    // Activity để lấy client Play Games (submit điểm) — null nếu context không phải Activity.
    val activity = remember(context) { context as? android.app.Activity }
    val scope = rememberCoroutineScope()
    // Đọc state bền bất đồng bộ; mặc định an toàn cho khung hình đầu (lần đầu chưa có file).
    val settings by repo.settings.collectAsState(initial = GjSettings())

    // Đồng bộ cờ âm thanh từ Settings → AudioManager (gate SFX + BGM bên trong manager).
    LaunchedEffect(settings.sound) { audio.soundEnabled = settings.sound }
    LaunchedEffect(settings.music) { audio.musicEnabled = settings.music }
    DisposableEffect(Unit) { onDispose { audio.release() } }

    // BGM chạy xuyên suốt — bật lúc mở app, pause/resume theo lifecycle, release khi destroy.
    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        audio.startBgm()
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_PAUSE -> audio.pauseBgm()
                Lifecycle.Event.ON_RESUME -> audio.resumeBgm()
                else -> {}
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    // World người chơi đang tiến tới → nền Home & Endless đổi cảnh theo tiến độ (Đồng cỏ→Rừng→Sông).
    val currentWorld = campaignCurrentWorld(settings.campaignStars)

    // UMP: xin đồng thuận (GDPR/EEA) TRƯỚC, chỉ khi được phép mới init/nạp AdMob (lazy, luồng nền).
    LaunchedEffect(activity) {
        val act = activity
        if (act != null && BuildConfig.ADS_ENABLED) {
            ConsentManager(act).gather(act) { canRequestAds ->
                // Đồng thuận xong: bật thu thập GA4/Crashlytics + init AdMob (chỉ khi được phép).
                analytics.setCollectionEnabled(canRequestAds)
                if (canRequestAds) scope.launch { ads.initialize() }
            }
        }
    }
    // Init Play Games (no-op an toàn khi LEADERBOARD_ID còn placeholder — xem PlayGamesManager).
    LaunchedEffect(Unit) { games.initialize() }

    // reduced-motion: cắt transition còn cross-fade tối giản / tức thời (tôn trọng a11y).
    val reducedMotion = remember {
        Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
    }

    var route: Route by rememberSaveable(
        stateSaver = androidx.compose.runtime.saveable.Saver(
            save    = { (it as? Route)?.routeKey() ?: 0 },
            restore = { routeFromKey(it) },
        ),
    ) { mutableStateOf(Route.Splash) }

    // Tracking: mỗi lần đổi màn → GA4 screen_view (tên lớp Route: Home/Game/Leaderboard…).
    LaunchedEffect(route) { analytics.logScreenView(route::class.simpleName ?: "Unknown") }

    // Back hệ thống: từ Settings/Handbook → Home; ở Home/Splash để hệ thống thoát app.
    // Route.Game KHÔNG xử lý ở đây — EndlessPlayScreen tự bắt back để mở Tạm dừng (chống back nhầm
    // mất ván); muốn về Home phải bấm "Về Home" trong dialog.
    BackHandler(
        enabled = route != Route.Home && route != Route.Splash && route != Route.Game &&
            route !is Route.CampaignPlay,
    ) {
        route = Route.Home
    }

    // Chuyển cảnh mềm (150–450ms, ease token); reduced-motion → snap.
    CompositionLocalProvider(LocalGjAudio provides audio) {
    AnimatedContent(
        targetState   = route,
        modifier      = Modifier.fillMaxSize(),
        label         = "route",
        transitionSpec = {
            if (reducedMotion) {
                EnterTransition.None togetherWith ExitTransition.None
            } else {
                (fadeIn(tween(GjMotion.medium, easing = GjEase.out)) +
                    scaleIn(initialScale = 0.92f, animationSpec = tween(GjMotion.medium, easing = GjEase.out))
                ) togetherWith (
                    fadeOut(tween(GjMotion.base, easing = GjEase.inOut)) +
                        scaleOut(targetScale = 1.04f, animationSpec = tween(GjMotion.base, easing = GjEase.inOut))
                )
            }
        },
    ) { current ->
        when (current) {
            Route.Splash -> SplashScreen(
                onContinue = { route = Route.Home },
                reducedMotion = reducedMotion,
                modifier = Modifier.fillMaxSize(),
            )

            Route.Home -> HomeScreen(
                onPlayEndless = { route = Route.Game },
                onPlayCampaign = { route = Route.Campaign },
                onSettings = { route = Route.Settings },
                onHandbook = { route = Route.Handbook },
                onLeaderboard = { route = Route.Leaderboard },
                world = currentWorld,
                reducedMotion = reducedMotion,
                modifier = Modifier.fillMaxSize(),
            )

            Route.Game -> EndlessGameScreen(
                initialSeed = if (settings.lastSeed != 0L) settings.lastSeed else DEFAULT_SEED,
                best = settings.best,
                ads = ads,
                onBest = { score ->
                    scope.launch { repo.updateBest(score) }
                    analytics.logHighScore(score)
                    // Nộp điểm lên Play Games (guard nội bộ: chỉ khi đã cấu hình id thật).
                    if (activity != null) games.submitScore(activity, score.toLong())
                },
                onGameOver = { score -> analytics.logEndlessGameOver(score) },
                onSeedUsed = { seed -> scope.launch { repo.setLastSeed(seed) } },
                onHome = { route = Route.Home },
                settings = settings,
                onSound = { v -> scope.launch { repo.setSound(v) } },
                onMusic = { v -> scope.launch { repo.setMusic(v) } },
                onVibrate = { v -> scope.launch { repo.setVibrate(v) } },
                vibrate = settings.vibrate,
                reducedMotion = reducedMotion,
                seenGuides = settings.seenGuides,
                onGuideSeen = { id -> scope.launch { repo.markGuideSeen(id) } },
                world = currentWorld,
                modifier = Modifier.fillMaxSize(),
            )

            Route.Settings -> SettingsScreen(
                settings = settings,
                onSound = { v -> scope.launch { repo.setSound(v) } },
                onMusic = { v -> scope.launch { repo.setMusic(v) } },
                onVibrate = { v -> scope.launch { repo.setVibrate(v) } },
                onBack = { route = Route.Home },
                modifier = Modifier.fillMaxSize(),
            )

            Route.Handbook -> CamNangScreen(
                seenGuides = settings.seenGuides,
                onBack = { route = Route.Home },
                modifier = Modifier.fillMaxSize(),
            )

            Route.Leaderboard -> LeaderboardRoute(
                games = games,
                repo = repo,
                best = settings.best,
                playerName = settings.playerName,
                onBack = { route = Route.Home },
                modifier = Modifier.fillMaxSize(),
            )

            Route.Campaign -> CampaignScreen(
                stars = settings.campaignStars,
                onPlay = { index -> route = Route.CampaignIntro(index) },
                onBack = { route = Route.Home },
                reducedMotion = reducedMotion,
                modifier = Modifier.fillMaxSize(),
            )

            is Route.CampaignIntro -> CampaignIntroScreen(
                levelIndex = current.index,
                earnedStars = settings.campaignStars[CampaignLevels.ALL[current.index].id] ?: 0,
                onStart = { route = Route.CampaignPlay(current.index) },
                onClose = { route = Route.Campaign },
                modifier = Modifier.fillMaxSize(),
            )

            is Route.CampaignPlay -> CampaignPlayScreen(
                levelIndex = current.index,
                onExit = { route = Route.Campaign },
                onWin = { levelId, stars ->
                    scope.launch { repo.saveCampaignStar(levelId, stars) }
                    analytics.logLevelComplete(levelId, stars)
                },
                onOpenLevel = { index -> route = Route.CampaignIntro(index) },
                ads = ads,
                settings = settings,
                onSound = { v -> scope.launch { repo.setSound(v) } },
                onMusic = { v -> scope.launch { repo.setMusic(v) } },
                onVibrate = { v -> scope.launch { repo.setVibrate(v) } },
                vibrate = settings.vibrate,
                reducedMotion = reducedMotion,
                seenGuides = settings.seenGuides,
                onGuideSeen = { id -> scope.launch { repo.markGuideSeen(id) } },
                modifier = Modifier.fillMaxSize(),
            )
        }
    }
    } // CompositionLocalProvider
}

// rememberSaveable cần khoá nguyên thuỷ cho sealed route. CampaignPlay mã hoá index vào 1000+index.
private fun Route.routeKey(): Int = when (this) {
    Route.Home -> 0; Route.Game -> 1; Route.Settings -> 2; Route.Splash -> 3; Route.Handbook -> 4
    Route.Campaign -> 5; Route.Leaderboard -> 6
    is Route.CampaignIntro -> 2000 + index
    is Route.CampaignPlay -> 1000 + index
}
private fun routeFromKey(key: Int): Route = when {
    key == 1 -> Route.Game; key == 2 -> Route.Settings; key == 3 -> Route.Splash
    key == 4 -> Route.Handbook; key == 5 -> Route.Campaign; key == 6 -> Route.Leaderboard
    key >= 2000 -> Route.CampaignIntro(key - 2000)
    key >= 1000 -> Route.CampaignPlay(key - 1000)
    else -> Route.Home
}

private val DEFAULT_SEED = 0x9E3779B97F4A7C15uL.toLong()
