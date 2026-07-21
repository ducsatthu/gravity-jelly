package com.gravityjelly.app

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.scaleIn
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.Saver
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.gravityjelly.app.ads.AdsManager
import com.gravityjelly.app.ads.findActivity
import com.gravityjelly.app.audio.GjSfx
import com.gravityjelly.app.audio.LocalGjAudio
import com.gravityjelly.core.AntiDroughtConfig
import com.gravityjelly.core.EndlessTuning
import com.gravityjelly.game.EndlessGameHolder
import com.gravityjelly.game.GjEase
import com.gravityjelly.game.GjMotion

/**
 * Wiring màn Endless. :app sở hữu vòng đời holder + seed chơi lại + best.
 * Luồng một chiều: input (trong :game) → engine → state → vẽ; điều hướng
 * (Hồi sinh / x2 / Chơi lại / Về Home) đẩy ngược qua callback ở lớp shell.
 *
 * Khi thua: phủ [ResultScreen] (design-faithful) spring-in lên trên bàn — đúng
 * "Game --thua--> Result (overlay)" của 04-hub Prompt 2.
 *
 * @param best best score hiện có (đến từ shell, bền hoá bằng DataStore).
 * @param onBest gọi khi có điểm cuối > best để shell cập nhật/lưu.
 */
@Composable
fun EndlessGameScreen(
    initialSeed: Long,
    best: Int,
    ads: AdsManager,
    onBest: (Int) -> Unit,
    /** Gọi mỗi khi thua (điểm cuối) — dùng cho tracking; khác [onBest] (chỉ khi phá kỷ lục). */
    onGameOver: (Int) -> Unit = {},
    onSeedUsed: (Long) -> Unit,
    onHome: () -> Unit,
    /**
     * Ván Endless dở đã lưu ở đĩa (DataStore) — lớp dự phòng process death khi Bundle không còn.
     * Chỉ áp cho ván ĐẦU khi vào màn; Chơi lại luôn ván mới. Null = không có ván dở.
     */
    resumeBlob: String? = null,
    /** Lưu ván hiện tại xuống đĩa (gọi khi app vào nền). Lớp vỏ bơm sang DataStore. */
    onPersistGame: (String) -> Unit = {},
    /** Xoá ván đã lưu (thắng/thua, Chơi lại). */
    onClearSave: () -> Unit = {},
    modifier: Modifier = Modifier,
    settings: com.gravityjelly.app.data.GjSettings = com.gravityjelly.app.data.GjSettings(),
    onSound: (Boolean) -> Unit = {},
    onMusic: (Boolean) -> Unit = {},
    onVibrate: (Boolean) -> Unit = {},
    vibrate: Boolean = true,
    reducedMotion: Boolean = false,
    seenGuides: Set<String> = emptySet(),
    onGuideSeen: (String) -> Unit = {},
    /** World để chọn nền in-game (đổi theo world người chơi đang tiến tới). Mặc định 1 (Đồng cỏ). */
    world: Int = 1,
) {
    val activity = LocalContext.current.findActivity()
    val audio = LocalGjAudio.current

    // seed định danh ván hiện tại; đổi seed ⇒ tạo holder mới (reset engine). rememberSaveable để
    // seed sống qua process death (khớp Bundle của holder).
    var seed by rememberSaveable { mutableLongStateOf(initialSeed) }

    // Saver: chụp/khôi phục ván qua Bundle savedInstanceState (OS kill khi app ở nền, còn Recents).
    // gameOver → lưu null (bỏ qua khôi phục) để không bắn lại interstitial/best khi vào lại màn Result.
    val holderSaver = remember {
        Saver<EndlessGameHolder, String>(
            save = { if (it.shell.gameOver) null else it.encodeSave() },
            restore = { blob -> EndlessGameHolder(0L, tuning = endlessTuning(), restoreBlob = blob) },
        )
    }
    val holder = rememberSaveable(seed, saver = holderSaver) {
        // Chỉ ván ĐẦU (seed gốc) mới khôi phục từ ĐĨA; Chơi lại (seed đổi) luôn ván mới.
        val blob = if (seed == initialSeed) resumeBlob else null
        EndlessGameHolder(seed, tuning = endlessTuning(), restoreBlob = blob)
    }
    val shell = holder.shell

    // Chơi lại: xoá ván đã lưu rồi sang seed kế → holder mới (ván Endless mới).
    val restart: () -> Unit = { onClearSave(); seed = nextSeed(seed) }

    // App vào nền (ON_STOP) → lưu ván xuống đĩa (lớp dự phòng cho Bundle). Bỏ qua khi đã thua.
    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner, holder) {
        val obs = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_STOP && !holder.shell.gameOver) {
                onPersistGame(holder.encodeSave())
            }
        }
        lifecycleOwner.lifecycle.addObserver(obs)
        onDispose { lifecycleOwner.lifecycle.removeObserver(obs) }
    }

    // best "đang hiển thị" gồm cả ván hiện tại (để HUD cập nhật tức thời khi vượt best).
    val liveBest = maxOf(best, shell.score)

    // làm ấm quảng cáo TRƯỚC khi cần (vào màn) — KHÔNG load lúc thua.
    LaunchedEffect(Unit) { ads.prepare() }

    // lưu seed gần nhất mỗi khi bắt đầu ván mới (bất đồng bộ ở lớp shell).
    LaunchedEffect(seed) { onSeedUsed(seed) }

    // khi thua: xoá ván đã lưu (không hồi bàn đã thua) + interstitial NGAY sau mỗi ván (đã preload).
    LaunchedEffect(shell.gameOver, seed) {
        if (shell.gameOver) {
            onClearSave()
            activity?.let { ads.onEndlessGameOver(it) }
            onGameOver(shell.score) // tracking: mỗi ván thua (khác onBest)
        }
    }
    // báo best — chỉ nâng, idempotent ở repo.
    LaunchedEffect(shell.gameOver, seed) {
        if (shell.gameOver && shell.score > best) {
            audio?.play(GjSfx.SFX_NEW_BEST)
            onBest(shell.score)
        }
    }

    Box(modifier.fillMaxSize()) {
        EndlessPlayScreen(
            holder = holder,
            best = liveBest,
            onHome = onHome,
            // Chơi lại từ Tạm dừng: ván Endless mới (seed kế tiếp) — như nút Chơi lại ở Result.
            onRestart = restart,
            settings = settings,
            onSound = onSound,
            onMusic = onMusic,
            onVibrate = onVibrate,
            vibrate = vibrate,
            reducedMotion = reducedMotion,
            seenGuides = seenGuides,
            onGuideSeen = onGuideSeen,
            world = world,
            modifier = Modifier.fillMaxSize(),
        )

        // ── Game Over → Result (overlay, spring-in ease-jelly) ────────────────
        AnimatedVisibility(
            visible = shell.gameOver,
            enter   = fadeIn(androidx.compose.animation.core.tween(GjMotion.base)) +
                      scaleIn(
                          animationSpec = androidx.compose.animation.core.tween(GjMotion.base, easing = GjEase.jelly),
                          initialScale  = 0.9f,
                      ),
        ) {
            ResultScreen(
                score = shell.score,
                best  = maxOf(best, shell.score),
                // Hồi sinh: TODO(06-P5) — engine chưa có API "continue" (chơi tiếp cùng bàn).
                // Tạm: xem rewarded rồi mở ván mới (placeholder), giữ luồng ad đúng nghiệp vụ F2P.
                onReviveAd = {
                    activity?.let { act ->
                        ads.showRewarded(
                            activity      = act,
                            onReward      = restart,
                            onUnavailable = { /* chưa sẵn QC: bỏ qua */ },
                        )
                    }
                },
                onReplay = restart,
                onHome   = onHome,
                modifier = Modifier.fillMaxSize(),
            )
        }
    }
}

/**
 * Cấu hình Endless live — DÙNG CHUNG cho khởi tạo holder và khôi phục qua Saver để ván sau kill
 * hành xử y hệt (poolFor/antiDrought độc lập seed; rng state đã nằm trong bản lưu).
 */
private fun endlessTuning() = EndlessTuning(comboTimeBased = true, antiDrought = AntiDroughtConfig())

/** Seed kế tiếp khi chơi lại — bước SplitMix64 (deterministic, decorrelate; KHÔNG dùng thời gian). */
private fun nextSeed(s: Long): Long {
    var z = s + -7046029254386353131L
    z = (z xor (z ushr 30)) * -4417276706812531889L
    z = (z xor (z ushr 27)) * -8796714831421723037L
    return z xor (z ushr 31)
}
