package com.gravityjelly.app

import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
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
import com.gravityjelly.app.ads.AdsManager
import com.gravityjelly.app.data.GjSettings
import com.gravityjelly.app.data.SettingsRepository
import com.gravityjelly.app.ui.layout.ProvideDesignDensity
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.game.GjEase
import com.gravityjelly.game.GjMotion
import kotlinx.coroutines.launch

/**
 * Vỏ ứng dụng (CLAUDE.md §:app): điều hướng màn + lắp ráp :core + :game + Services.
 * Phase 3: Home ⇄ Endless chơi được trọn vòng; best + cài đặt bền qua DataStore (Prompt 13).
 * AdMob (Prompt 14) sau.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // Splash hệ thống (Theme.GravityJelly.Splash): icon khối jelly trên nền kem ngay cold start,
        // tự tan khi Compose vẽ frame đầu → trao cho màn Splash Compose. Gọi trước super.onCreate.
        installSplashScreen()
        super.onCreate(savedInstanceState)
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
    // data object LevelMap : Route  // sau MVP
}

@Composable
private fun GravityJellyApp() {
    val context = LocalContext.current
    val repo = remember { SettingsRepository(context) }
    val ads = remember { AdsManager(context) }
    val scope = rememberCoroutineScope()
    // Đọc state bền bất đồng bộ; mặc định an toàn cho khung hình đầu (lần đầu chưa có file).
    val settings by repo.settings.collectAsState(initial = GjSettings())

    // Init SDK quảng cáo lazy ở luồng nền (một lần) rồi preload.
    LaunchedEffect(Unit) { ads.initialize() }

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

    // Back hệ thống: từ Settings/Handbook → Home; ở Home/Splash để hệ thống thoát app.
    // Route.Game KHÔNG xử lý ở đây — EndlessPlayScreen tự bắt back để mở Tạm dừng (chống back nhầm
    // mất ván); muốn về Home phải bấm "Về Home" trong dialog.
    BackHandler(enabled = route != Route.Home && route != Route.Splash && route != Route.Game) {
        route = Route.Home
    }

    // Chuyển cảnh mềm (150–450ms, ease token); reduced-motion → snap.
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
                onSettings = { route = Route.Settings },
                onHandbook = { route = Route.Handbook },
                reducedMotion = reducedMotion,
                modifier = Modifier.fillMaxSize(),
            )

            Route.Game -> EndlessGameScreen(
                initialSeed = if (settings.lastSeed != 0L) settings.lastSeed else DEFAULT_SEED,
                best = settings.best,
                ads = ads,
                onBest = { score -> scope.launch { repo.updateBest(score) } },
                onSeedUsed = { seed -> scope.launch { repo.setLastSeed(seed) } },
                onHome = { route = Route.Home },
                vibrate = settings.vibrate,
                reducedMotion = reducedMotion,
                seenGuides = settings.seenGuides,
                onGuideSeen = { id -> scope.launch { repo.markGuideSeen(id) } },
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
        }
    }
}

// rememberSaveable cần khoá nguyên thuỷ cho sealed route.
private fun Route.routeKey(): Int = when (this) {
    Route.Home -> 0; Route.Game -> 1; Route.Settings -> 2; Route.Splash -> 3; Route.Handbook -> 4
}
private fun routeFromKey(key: Int): Route = when (key) {
    1 -> Route.Game; 2 -> Route.Settings; 3 -> Route.Splash; 4 -> Route.Handbook; else -> Route.Home
}

private val DEFAULT_SEED = 0x9E3779B97F4A7C15uL.toLong()
