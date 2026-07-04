package com.gravityjelly.app

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.scaleIn
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import com.gravityjelly.app.ads.AdsManager
import com.gravityjelly.app.ads.findActivity
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
    onSeedUsed: (Long) -> Unit,
    onHome: () -> Unit,
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

    // seed định danh ván hiện tại; đổi seed ⇒ tạo holder mới (reset engine).
    var seed by remember { mutableLongStateOf(initialSeed) }
    val holder = remember(seed) { EndlessGameHolder(seed, tuning = EndlessTuning(comboTimeBased = true)) }
    val shell = holder.shell

    // điểm cuối có thể được x2 nhờ rewarded (mỗi ván một lần).
    var doubled by remember(seed) { mutableStateOf(false) }
    val finalScore = if (doubled) shell.score * 2 else shell.score

    // best "đang hiển thị" gồm cả ván hiện tại (để HUD cập nhật tức thời khi vượt best).
    val liveBest = maxOf(best, finalScore)

    // làm ấm quảng cáo TRƯỚC khi cần (vào màn) — KHÔNG load lúc thua.
    LaunchedEffect(Unit) { ads.prepare() }

    // lưu seed gần nhất mỗi khi bắt đầu ván mới (bất đồng bộ ở lớp shell).
    LaunchedEffect(seed) { onSeedUsed(seed) }

    // khi thua: interstitial theo sự kiện (đã preload; không load) + báo best.
    LaunchedEffect(shell.gameOver, seed) {
        if (shell.gameOver) {
            activity?.let { ads.onGameOver(it) }
        }
    }
    // báo best (gồm cả khi vừa x2 điểm) — chỉ nâng, idempotent ở repo.
    LaunchedEffect(shell.gameOver, seed, doubled) {
        if (shell.gameOver && finalScore > best) onBest(finalScore)
    }

    Box(modifier.fillMaxSize()) {
        EndlessPlayScreen(
            holder = holder,
            best = liveBest,
            onHome = onHome,
            // Chơi lại từ Tạm dừng: ván Endless mới (seed kế tiếp, reset x2 điểm) — như nút Chơi lại ở Result.
            onRestart = { doubled = false; seed = nextSeed(seed) },
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
                score = finalScore,
                best  = maxOf(best, finalScore),
                // Hồi sinh: TODO(06-P5) — engine chưa có API "continue" (chơi tiếp cùng bàn).
                // Tạm: xem rewarded rồi mở ván mới (placeholder), giữ luồng ad đúng nghiệp vụ F2P.
                onReviveAd = {
                    activity?.let { act ->
                        ads.showRewarded(
                            activity      = act,
                            onReward      = { seed = nextSeed(seed) },
                            onUnavailable = { /* chưa sẵn QC: bỏ qua */ },
                        )
                    }
                },
                // x2 điểm: chỉ áp một lần/ván (doubled), qua rewarded.
                onDoubleAd = {
                    if (!doubled) {
                        activity?.let { act ->
                            ads.showRewarded(
                                activity      = act,
                                onReward      = { doubled = true },
                                onUnavailable = { /* chưa sẵn QC */ },
                            )
                        }
                    }
                },
                onReplay = { seed = nextSeed(seed) },
                onHome   = onHome,
                modifier = Modifier.fillMaxSize(),
            )
        }
    }
}

/** Seed kế tiếp khi chơi lại — bước SplitMix64 (deterministic, decorrelate; KHÔNG dùng thời gian). */
private fun nextSeed(s: Long): Long {
    var z = s + -7046029254386353131L
    z = (z xor (z ushr 30)) * -4417276706812531889L
    z = (z xor (z ushr 27)) * -8796714831421723037L
    return z xor (z ushr 31)
}
