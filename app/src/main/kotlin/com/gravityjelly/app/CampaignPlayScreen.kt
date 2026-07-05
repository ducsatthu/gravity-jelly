package com.gravityjelly.app

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInWindow
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.gravityjelly.app.data.GjSettings
import com.gravityjelly.app.ui.components.BossCard
import com.gravityjelly.app.ui.components.bossKindForWorld
import com.gravityjelly.app.ui.components.bossNameResForWorld
import com.gravityjelly.app.ui.components.BtnSize
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.components.GjDialog
import com.gravityjelly.app.ui.components.GjPauseToggleRow
import com.gravityjelly.app.ui.components.LiveStars
import com.gravityjelly.app.ui.components.ObjectiveBar
import com.gravityjelly.app.ui.guide.GjGuide
import com.gravityjelly.app.ui.guide.GjGuideEntry
import com.gravityjelly.app.ui.guide.GuideTeachDialog
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.audio.GjSfx
import com.gravityjelly.app.audio.LocalGjAudio
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.game.BOARD_PAD_DP
import com.gravityjelly.game.BoardCanvas
import com.gravityjelly.game.DragPieceOverlay
import com.gravityjelly.game.EffectKind
import com.gravityjelly.game.ComboBurst
import com.gravityjelly.game.EndlessGameHolder
import com.gravityjelly.game.rememberGameDriver
import com.gravityjelly.core.CampaignLevels
import com.gravityjelly.core.Goal
import com.gravityjelly.core.GoalType
import com.gravityjelly.core.StarMetric
import com.gravityjelly.core.StarThresholds
import com.gravityjelly.core.TriggerKind

/**
 * Màn CHƠI một màn Campaign — tái dùng layout [GameScreen] + kéo-thả [EndlessGameHolder] (nay nhận
 * [com.gravityjelly.core.Level]). Thêm so với Endless: **banner mục tiêu**, **overlay THẮNG** (sao +
 * Màn kế/Chơi lại) khi holder báo [EndlessGameHolder.levelComplete], **overlay THUA** khi bí nước.
 * Prototype: chưa gắn hệ dạy-luật (guide) — ưu tiên trải nghiệm vòng chơi.
 *
 * @param levelIndex chỉ số trong [CampaignLevels.ALL].
 * @param onWin báo (stars) khi thắng để lớp trên lưu tiến độ.
 * @param seenGuides / onGuideSeen: Campaign KHÔNG bật popup dạy-luật (mục tiêu mở-khoá của màn đã dạy);
 *   chỉ dùng để ÂM THẦM mở khoá mục Cẩm nang tương ứng khi gặp cơ chế lần đầu — người chơi xem lại sau.
 *   (Popup dạy-luật đầy đủ chỉ ở Endless — [EndlessPlayScreen].)
 */
@Composable
fun CampaignPlayScreen(
    levelIndex: Int,
    onExit: () -> Unit,
    onWin: (levelId: Int, stars: Int) -> Unit,
    onOpenLevel: (Int) -> Unit,
    modifier: Modifier = Modifier,
    settings: GjSettings = GjSettings(),
    onSound: (Boolean) -> Unit = {},
    onMusic: (Boolean) -> Unit = {},
    onVibrate: (Boolean) -> Unit = {},
    vibrate: Boolean = true,
    reducedMotion: Boolean = false,
    seenGuides: Set<String> = emptySet(),
    onGuideSeen: (String) -> Unit = {},
) {
    val levels = CampaignLevels.ALL
    val level = levels[levelIndex]
    val hasNext = levelIndex + 1 < levels.size

    // Chơi lại = tạo lại holder (reset màn). replayKey đổi → remember tính lại.
    var replayKey by remember(levelIndex) { mutableIntStateOf(0) }
    val holder = remember(levelIndex, replayKey) { EndlessGameHolder(seed = level.seed, level = level) }

    val renderTick = rememberGameDriver(holder.animator)
    val shell = holder.shell
    val density = LocalDensity.current.density
    val haptics = LocalHapticFeedback.current
    val audio = LocalGjAudio.current

    var parentWin by remember { mutableStateOf(Offset.Zero) }
    var paused by remember { mutableStateOf(false) }
    // "Cài đặt" trong Tạm dừng mở màn Cài đặt PHỦ LÊN (không đổi route → giữ nguyên màn đang chơi).
    var showSettings by remember { mutableStateOf(false) }
    var draggingSlot by remember { mutableIntStateOf(-1) }
    val slotWin = remember { arrayOf(Offset.Zero, Offset.Zero, Offset.Zero) }

    // ── Cẩm nang TỰ MỞ KHOÁ (Campaign KHÔNG bật popup dạy-luật) ──────────────────────────────────
    // Khác Endless: ở Campaign, MỤC TIÊU mở-khoá của từng màn đã dạy người chơi cơ chế tương ứng, nên
    // KHÔNG ngắt mạch bằng popup [GuideTeachDialog]. Thay vào đó ÂM THẦM đánh dấu mọi cơ chế GẶP-LẦN-ĐẦU
    // ([holder.guideQueue]) + combo-hồi-lượt-xoay vào `seenGuides` → mục Cẩm nang tương ứng tự mở khoá để
    // người chơi xem lại sau. Reset theo màn (replayKey) để không mở khoá lặp trong cùng phiên.
    val autoUnlocked = remember(levelIndex, replayKey) { mutableStateListOf<String>() }
    fun autoUnlock(id: String) {
        if (id in seenGuides || id in autoUnlocked) return
        autoUnlocked.add(id)
        onGuideSeen(id)
    }
    // (1) cơ chế gặp-lần-đầu: rút cạn hàng đợi, mở khoá từng mục (không popup nên không cần chờ bàn lắng).
    LaunchedEffect(holder.guideQueue) {
        while (holder.guideQueue.isNotEmpty()) {
            autoUnlock(GjGuide.forMechanic(holder.guideQueue.first()).id)
            holder.consumeGuide()
        }
    }
    // (2) combo hồi lượt xoay: gặp lần đầu → mở khoá mục combo-refill.
    LaunchedEffect(holder.rotationRefillTick) {
        if (holder.rotationRefillTick > 0L) autoUnlock(GjGuide.comboRefill.id)
    }

    // ── Popup DẠY LUẬT đầu-màn (intro guide) ─────────────────────────────────────────────────────────
    // Một số màn giới thiệu cơ chế MỚI → hiện popup giải thích NGAY KHI VÀO MÀN (trước khi chơi),
    // chỉ lần đầu (gate bởi seenGuides). Hiện tuần tự; nút "Tiếp theo" nếu còn popup sau.
    val introGuides: List<GjGuideEntry> = remember(level.id) { levelIntroGuides(level.id) }
    val unseenIntro = remember(levelIndex, replayKey) {
        introGuides.filter { it.id !in seenGuides }
    }
    var introIndex by remember(levelIndex, replayKey) { mutableIntStateOf(0) }
    val showingIntro = introIndex < unseenIntro.size
    val introEntry = if (showingIntro) unseenIntro[introIndex] else null
    val introLabel = if (showingIntro && introIndex + 1 < unseenIntro.size)
        stringResource(R.string.campaignplay_intro_next) else stringResource(R.string.campaignplay_intro_got_it)

    // Thắng → lưu sao MỘT lần (theo levelComplete). reducedMotion không ảnh hưởng logic.
    LaunchedEffect(holder.levelComplete) {
        if (holder.levelComplete) onWin(level.id, holder.starsEarned)
    }

    // Ra nền → tự tạm dừng (như Endless), trừ khi đã thắng/thua.
    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_PAUSE && !shell.gameOver && !holder.levelComplete) paused = true
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    // Haptic (đặt/xóa/combo) + reduced-motion → animator, gate bằng [vibrate].
    LaunchedEffect(holder, vibrate, reducedMotion, haptics) {
        holder.animator.reducedMotion = reducedMotion
        holder.onEffect = if (!vibrate) null else { kind ->
            when (kind) {
                EffectKind.PLACE -> haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                EffectKind.CLEAR -> haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                EffectKind.COMBO -> haptics.performHapticFeedback(HapticFeedbackType.LongPress)
            }
        }
    }

    // SFX gameplay — holder phát GameSfx → audio manager chơi.
    LaunchedEffect(holder, audio) {
        holder.onGameSound = { cue -> audio?.playGame(cue) }
        holder.onComboBurstSound = { level -> audio?.playComboBurst(level) }
    }

    // SFX thắng/thua — phát MỘT lần khi state đổi.
    LaunchedEffect(holder.levelComplete) {
        if (holder.levelComplete) {
            audio?.play(GjSfx.SFX_LEVEL_WIN)
            audio?.play(GjSfx.SFX_CONFETTI)
        }
    }
    LaunchedEffect(shell.gameOver, holder.levelComplete) {
        if (shell.gameOver && !holder.levelComplete) audio?.play(GjSfx.SFX_LEVEL_FAIL)
    }

    // Combo timer 10s: khi có combo productive → delay 10s → expire nếu chưa có combo mới.
    LaunchedEffect(holder.comboTimerTick) {
        if (holder.comboTimerTick > 0L && holder.isComboTimeBased && holder.shell.combo > 0) {
            kotlinx.coroutines.delay(10_000L)
            holder.expireComboTimer()
        }
    }

    // Back: thắng/thua → thoát về danh sách; đang tạm dừng → tiếp tục; else → mở tạm dừng.
    BackHandler {
        when {
            holder.levelComplete || shell.gameOver -> onExit()
            showSettings -> showSettings = false   // Cài đặt phủ → về lại Tạm dừng
            paused -> paused = false
            else -> paused = true
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .onGloballyPositioned { parentWin = it.positionInWindow() },
    ) {
        GameScreen(
            score = shell.score,
            direction = holder.boardRender.gravity,
            turnsLeft = shell.budget,
            pieces = shell.tray,
            selectedIndex = draggingSlot,
            onPause = { paused = true },
            onSelectPiece = {},
            onRotate = { holder.rotate(cw = true) },
            world = level.world,
            // Cụm dưới HUD (screen-1e-game-objective) — chỉ Campaign. Màn BOSS → thẻ BossCard (Khiên),
            // còn lại → ObjectiveBar (điểm/đích/mixed/tutorial).
            objective = {
                if (level.isBoss) {
                    // Khiên = máu combo (BOSS_COMBO) HOẶC số lần phá nguồn còn lại (CLEAR_TARGETS — Thần Thác).
                    val bossCombo = level.goal.type == GoalType.BOSS_COMBO
                    BossCard(
                        level = level.id,
                        name = stringResource(bossNameResForWorld(level.world)),
                        kind = bossKindForWorld(level.world),
                        shieldCurrent = if (bossCombo) (holder.bossHpMax - holder.bossHpDamage).coerceAtLeast(0)
                            else holder.targetsRemaining,
                        shieldTarget = if (bossCombo) holder.bossHpMax else holder.initialTargets,
                        tell = holder.bossTell,
                        ruleLabel = if (bossCombo) stringResource(R.string.boss_rule_default)
                            else stringResource(R.string.boss_rule_water),
                        liveStars = liveStarsFor(level.stars, holder.movesUsed, holder.rotationsUsed),
                    )
                } else {
                    ObjectiveBar(
                        goal = level.goal,
                        world = level.world,
                        level = level.id,
                        worldName = stringResource(WorldTheme.nameRes(level.world)),
                        score = shell.score,
                        targetsCleared = holder.targetsCleared,
                        initialTargets = holder.initialTargets,
                        bossDamage = holder.bossHpDamage,
                        bossHpMax = holder.bossHpMax,
                        tutorialLabel = goalLabel(level.goal, level.world),
                        objectiveDone = holder.levelComplete,
                        // Dải sao SỐNG chấm theo nước — MỌI màn (điểm chỉ là điều kiện thắng).
                        liveStars = liveStarsFor(level.stars, holder.movesUsed, holder.rotationsUsed),
                    )
                }
            },
            traySlotModifier = { i ->
                Modifier
                    .onGloballyPositioned { slotWin[i] = it.positionInWindow() }
                    .pointerInput(holder, shell.tray) {
                        detectDragGestures(
                            onDragStart = { if (holder.beginDrag(i)) draggingSlot = i },
                            onDrag = { change, _ ->
                                change.consume()
                                val w = slotWin[i]
                                holder.dragTo(w.x + change.position.x, w.y + change.position.y)
                            },
                            onDragEnd = { holder.commitDrag(); draggingSlot = -1 },
                            onDragCancel = { holder.cancelDrag(); draggingSlot = -1 },
                        )
                    }
            },
            board = { m ->
                BoardCanvas(
                    render = { holder.boardRender },
                    renderTick = renderTick.value,
                    animator = holder.animator,
                    modifier = m.onGloballyPositioned {
                        val p = it.positionInWindow()
                        val wellPx = minOf(it.size.width, it.size.height).toFloat()
                        val padPx = BOARD_PAD_DP * density
                        holder.density = density
                        holder.setBoardBounds(p.x + padPx, p.y + padPx, wellPx - 2 * padPx)
                    },
                )
            },
        )

        // Mảnh đang kéo (floating).
        DragPieceOverlay(holder, parentWin, renderTick.value, Modifier.fillMaxSize())

        // Combo → overlay ×N nổ trên bàn (tái dùng ComboBurstOverlay từ Endless).
        holder.comboBurst?.let { burst ->
            ComboBurstOverlay(burst, parentWin, Modifier.fillMaxSize())
        }

        // Dialog Tạm dừng — bám pause-screen.jsx (như Endless): toggle nhanh Âm thanh·Nhạc → TIẾP TỤC
        // (CTA) → hàng Chơi lại·Cài đặt → Danh sách màn (ghost). dismissable=false: chỉ thoát bằng nút/Back.
        GjDialog(
            open = paused && !showSettings,
            title = stringResource(R.string.campaignplay_pause_title),
            icon = GjIcons.Pause,
            dismissable = false,
            content = {
                Text(
                    text = stringResource(R.string.campaignplay_pause_message),
                    style = MaterialTheme.typography.bodyLarge.copy(color = GjPalette.TextMuted),
                )
            },
            actions = {
                GjPauseToggleRow(
                    sound = settings.sound,
                    music = settings.music,
                    onSound = onSound,
                    onMusic = onMusic,
                )
                GjButton(onClick = { paused = false }, variant = BtnVariant.Primary,
                    btnSize = BtnSize.Cta, fullWidth = true, icon = GjIcons.Play) { Text(stringResource(R.string.campaignplay_resume)) }
                Row(horizontalArrangement = Arrangement.spacedBy(GjSpace.sm)) {
                    GjButton(onClick = { paused = false; replayKey++ }, variant = BtnVariant.Secondary,
                        icon = GjIcons.Refresh, modifier = Modifier.weight(1f)) { Text(stringResource(R.string.campaignplay_replay)) }
                    GjButton(onClick = { showSettings = true }, variant = BtnVariant.Secondary,
                        icon = GjIcons.Settings, modifier = Modifier.weight(1f)) { Text(stringResource(R.string.campaignplay_settings)) }
                }
                GjButton(onClick = { paused = false; onExit() }, variant = BtnVariant.Ghost, fullWidth = true,
                    icon = GjIcons.Home) { Text(stringResource(R.string.campaignplay_level_list)) }
            },
        )

        // "Cài đặt" trong Tạm dừng → màn Cài đặt PHỦ toàn màn (giữ nguyên màn đang chơi, KHÔNG đổi
        // route). Back / "Về Home" trong màn này chỉ đóng lớp phủ, quay lại overlay Tạm dừng.
        if (showSettings) {
            SettingsScreen(
                settings = settings,
                onSound = onSound,
                onMusic = onMusic,
                onVibrate = onVibrate,
                onBack = { showSettings = false },
                modifier = Modifier.fillMaxSize(),
            )
        }

        // Overlay THẮNG — màn ăn mừng bám design (level-win-screen.jsx).
        if (holder.levelComplete) {
            val stat = winStat(level.stars.metric, level.goal, holder.movesUsed, holder.rotationsUsed)
            LevelWinScreen(
                level = level.id,
                worldName = stringResource(WorldTheme.nameRes(level.world)),
                stars = holder.starsEarned,
                score = shell.score,
                statLabel = stat.first,
                statValue = stat.second,
                hasNext = hasNext,
                onNext = { onOpenLevel(levelIndex + 1) },
                onReplay = { replayKey++ },
                onHome = onExit,
                reducedMotion = reducedMotion,
            )
        }

        // Popup DẠY LUẬT đầu-màn (intro guide) — chặn tương tác cho tới khi người chơi xác nhận hết.
        if (introEntry != null) {
            GuideTeachDialog(
                entry = introEntry,
                open = true,
                confirmLabel = introLabel,
                onDismiss = {
                    autoUnlock(introEntry.id)
                    introIndex++
                },
            )
        }

        // Overlay THUA (bí nước — không đặt được mảnh nào): popup card + mascot buồn (đồng bộ
        // Result Endless / Win), thay cho GjDialog thô trước đây. Nhắc lại MỤC TIÊU chưa đạt + tiến độ.
        if (shell.gameOver && !holder.levelComplete) {
            val goalProgress = when (level.goal.type) {
                GoalType.CLEAR_TARGETS -> "${holder.targetsCleared}/${holder.initialTargets}"
                GoalType.REACH_SCORE -> stringResource(R.string.campaignplay_progress_score, shell.score, level.goal.score)
                GoalType.MIXED ->
                    stringResource(R.string.campaignplay_progress_mixed, holder.targetsCleared, holder.initialTargets, shell.score, level.goal.score)
                GoalType.BOSS_COMBO -> stringResource(R.string.campaignplay_progress_boss, holder.bossHpMax - holder.bossHpDamage, holder.bossHpMax)
                else -> null   // CLEAR_ALL / COMBO_CHAIN / TUTORIAL: không có số tiến độ gọn
            }
            LevelFailScreen(
                onReplay = { replayKey++ },
                onHome = onExit,
                objective = goalLabel(level.goal, level.world),
                objectiveProgress = goalProgress,
            )
        }
    }
}

/** Nhãn mục tiêu (đa ngôn ngữ); ô đích tuỳ world: World 2 = "gốc dây leo", World 3 = "giọt nước". */
@Composable
internal fun goalLabel(goal: Goal, world: Int = 2): String = when (goal.type) {
    GoalType.CLEAR_ALL -> stringResource(R.string.goal_clear_all)
    GoalType.CLEAR_TARGETS ->
        if (world == 3) stringResource(R.string.goal_clear_targets_water, goal.count)
        else stringResource(R.string.goal_clear_targets_vine, goal.count)
    GoalType.REACH_SCORE -> stringResource(R.string.goal_reach_score, goal.score)
    GoalType.MIXED ->
        if (world == 3) stringResource(R.string.goal_mixed_water, goal.count, goal.score)
        else stringResource(R.string.goal_mixed_vine, goal.count, goal.score)
    GoalType.COMBO_CHAIN -> stringResource(R.string.goal_combo_chain)
    GoalType.BOSS_COMBO -> stringResource(R.string.goal_boss_combo, goal.bossHP)
    GoalType.TUTORIAL -> when (goal.trigger) {
        TriggerKind.ROW -> stringResource(R.string.goal_tut_row)
        TriggerKind.COL -> stringResource(R.string.goal_tut_col)
        TriggerKind.ROTATE -> stringResource(R.string.goal_tut_rotate)
        TriggerKind.SUPER1 -> stringResource(R.string.goal_tut_super1)
        TriggerKind.SUPER2 -> stringResource(R.string.goal_tut_super2)
        TriggerKind.RAINBOW -> stringResource(R.string.goal_tut_rainbow)
        TriggerKind.RAINBOW_SUPER -> stringResource(R.string.goal_tut_rainbow_super)
        TriggerKind.COMBO_X2 -> stringResource(R.string.goal_tut_combo_x2)
        null -> stringResource(R.string.goal_tut_default)
    }
}

/**
 * Ô thống kê thứ 2 ở màn thắng (design có "THƯỞNG xu" — game chưa có tiền tệ nên thay bằng thành
 * tích theo tiêu chí sao): nước đi / lượt xoay / mục tiêu điểm / boss.
 */
/** Popup dạy-luật hiện NGAY khi vào màn (trước khi chơi) — chỉ lần đầu. */
private fun levelIntroGuides(levelId: Int): List<GjGuideEntry> = when (levelId) {
    11 -> listOf(GjGuide.vineIntro, GjGuide.vineDestroy, GjGuide.vineToTrash, GjGuide.trashDestroy)
    21 -> listOf(GjGuide.waterFlow, GjGuide.waterDrift, GjGuide.waterBreak)   // World 3 · Dòng chảy — dạy luật lần đầu
    else -> emptyList()
}

@Composable
internal fun winStat(metric: StarMetric, goal: Goal, moves: Int, rotations: Int): Pair<String, String> =
    when (metric) {
        StarMetric.MOVES -> stringResource(R.string.campaignplay_stat_moves) to moves.toString()
        StarMetric.ROTATIONS -> stringResource(R.string.campaignplay_stat_rotations) to rotations.toString()
        StarMetric.SCORE -> stringResource(R.string.campaignplay_stat_score) to "${goal.score}+"
        StarMetric.COMBO -> stringResource(R.string.campaignplay_stat_boss) to stringResource(R.string.campaignplay_stat_boss_done)
    }

/**
 * Dải sao SỐNG cho màn chấm theo NƯỚC ĐI / LƯỢT XOAY (ít hơn = tốt hơn): bậc đang giữ +
 * gợi ý "còn N … giữ bậc" / "thêm 1 … rớt bậc". Dùng cho cả ObjectiveBar lẫn BossCard (boss chấm MOVES).
 * Trả null cho SCORE. Dùng chung [StarThresholds.tierFor] với lúc chấm sao khi thắng.
 */
@Composable
internal fun liveStarsFor(stars: StarThresholds, movesUsed: Int, rotationsUsed: Int): LiveStars? {
    val used = when (stars.metric) {
        StarMetric.MOVES -> movesUsed
        StarMetric.ROTATIONS -> rotationsUsed
        else -> return null
    }
    val tier = stars.tierFor(used)
    val unit = if (stars.metric == StarMetric.ROTATIONS)
        stringResource(R.string.campaignplay_unit_rotations) else stringResource(R.string.campaignplay_unit_moves)
    val keepThreshold = when (tier) {
        3 -> stars.three
        2 -> stars.two
        else -> null   // đã 1★ (thấp nhất) — hoàn thành không tụt thêm
    }
    val next = when {
        keepThreshold == null -> null
        keepThreshold - used >= 1 -> stringResource(R.string.campaignplay_stars_keep, keepThreshold - used, unit, tier)
        else -> stringResource(R.string.campaignplay_stars_drop, unit, tier - 1)
    }
    return LiveStars(tier = tier, now = stringResource(R.string.campaignplay_stars_now, tier), next = next)
}
