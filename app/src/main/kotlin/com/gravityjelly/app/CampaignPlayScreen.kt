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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.gravityjelly.app.data.GjSettings
import com.gravityjelly.app.ui.components.BossCard
import com.gravityjelly.app.ui.components.bossKindForWorld
import com.gravityjelly.app.ui.components.bossNameForWorld
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
    val introLabel = if (showingIntro && introIndex + 1 < unseenIntro.size) "Tiếp theo" else "Đã hiểu"

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
                if (level.goal.type == GoalType.BOSS_COMBO) {
                    BossCard(
                        level = level.id,
                        name = bossNameForWorld(level.world),
                        kind = bossKindForWorld(level.world),
                        // Khiên CÒN LẠI = máu boss chưa bị bào; rút về 0 khi hạ boss.
                        shieldCurrent = (holder.bossHpMax - holder.bossHpDamage).coerceAtLeast(0),
                        shieldTarget = holder.bossHpMax,
                        // Tell sống: W2 sắp mọc dây · W3 sắp đảo trọng lực (+đếm ngược). null (W1) → chip CẨM NANG.
                        tell = holder.bossTell,
                    )
                } else {
                    ObjectiveBar(
                        goal = level.goal,
                        world = level.world,
                        level = level.id,
                        worldName = WorldTheme.name(level.world),
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
            title = "Tạm dừng",
            icon = GjIcons.Pause,
            dismissable = false,
            content = {
                Text(
                    text = "Trò chơi đang tạm dừng. Tiến độ màn này được giữ nguyên.",
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
                    btnSize = BtnSize.Cta, fullWidth = true, icon = GjIcons.Play) { Text("TIẾP TỤC") }
                Row(horizontalArrangement = Arrangement.spacedBy(GjSpace.sm)) {
                    GjButton(onClick = { paused = false; replayKey++ }, variant = BtnVariant.Secondary,
                        icon = GjIcons.Refresh, modifier = Modifier.weight(1f)) { Text("Chơi lại") }
                    GjButton(onClick = { showSettings = true }, variant = BtnVariant.Secondary,
                        icon = GjIcons.Settings, modifier = Modifier.weight(1f)) { Text("Cài đặt") }
                }
                GjButton(onClick = { paused = false; onExit() }, variant = BtnVariant.Ghost, fullWidth = true,
                    icon = GjIcons.Home) { Text("Danh sách màn") }
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
                worldName = WorldTheme.name(level.world),
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
                GoalType.REACH_SCORE -> "${shell.score}/${level.goal.score}đ"
                GoalType.MIXED ->
                    "${holder.targetsCleared}/${holder.initialTargets} · ${shell.score}/${level.goal.score}đ"
                GoalType.BOSS_COMBO -> "Máu boss ${holder.bossHpMax - holder.bossHpDamage}/${holder.bossHpMax}"
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

/** Nhãn mục tiêu; ô đích tuỳ world: World 2 = "gốc dây leo", World 3 = "giọt nước". */
internal fun goalLabel(goal: Goal, world: Int = 2): String = when (goal.type) {
    GoalType.CLEAR_ALL -> "Dọn sạch bàn"
    GoalType.CLEAR_TARGETS ->
        if (world == 3) "Phá ${goal.count} giọt nước" else "Phá ${goal.count} gốc dây leo"
    GoalType.REACH_SCORE -> "Đạt ${goal.score} điểm"
    GoalType.MIXED ->
        if (world == 3) "Phá ${goal.count} giọt + ${goal.score} điểm"
        else "Phá ${goal.count} gốc + ${goal.score} điểm"
    GoalType.COMBO_CHAIN -> "Chuỗi combo"
    GoalType.BOSS_COMBO -> "Hạ boss bằng combo (máu ${goal.bossHP})"
    GoalType.TUTORIAL -> when (goal.trigger) {
        TriggerKind.ROW -> "Xóa 1 hàng ngang"
        TriggerKind.COL -> "Xóa 1 cột dọc"
        TriggerKind.ROTATE -> "Xoay trọng lực dồn khối"
        TriggerKind.SUPER1 -> "Ghép 9 ô cùng màu → Thạch Hoàng Gia"
        TriggerKind.SUPER2 -> "Gộp 2 Thạch Hoàng Gia → Vua Thạch"
        TriggerKind.RAINBOW -> "Tạo 1 Thạch Cầu Vồng"
        TriggerKind.RAINBOW_SUPER -> "Tạo Hoàng Đế Cầu Vồng"
        TriggerKind.COMBO_X2 -> "Đạt combo ×2 lần đầu"
        null -> "Hoàn thành mục tiêu"
    }
}

/**
 * Ô thống kê thứ 2 ở màn thắng (design có "THƯỞNG xu" — game chưa có tiền tệ nên thay bằng thành
 * tích theo tiêu chí sao): nước đi / lượt xoay / mục tiêu điểm / boss.
 */
/** Popup dạy-luật hiện NGAY khi vào màn (trước khi chơi) — chỉ lần đầu. */
private fun levelIntroGuides(levelId: Int): List<GjGuideEntry> = when (levelId) {
    11 -> listOf(GjGuide.vineIntro, GjGuide.vineDestroy, GjGuide.vineToTrash, GjGuide.trashDestroy)
    else -> emptyList()
}

internal fun winStat(metric: StarMetric, goal: Goal, moves: Int, rotations: Int): Pair<String, String> =
    when (metric) {
        StarMetric.MOVES -> "NƯỚC ĐI" to moves.toString()
        StarMetric.ROTATIONS -> "LƯỢT XOAY" to rotations.toString()
        StarMetric.SCORE -> "MỤC TIÊU" to "${goal.score}+"
        StarMetric.COMBO -> "BOSS" to "Hạ gục!"
    }

/**
 * Dải sao SỐNG cho ObjectiveBar ở màn chấm theo NƯỚC ĐI / LƯỢT XOAY (ít hơn = tốt hơn): bậc đang giữ +
 * gợi ý "còn N … giữ bậc" / "thêm 1 … rớt bậc". Trả null cho SCORE (đã có coin/caption trên thanh điểm)
 * và COMBO (màn boss dùng BossCard). Dùng chung [StarThresholds.tierFor] với lúc chấm sao khi thắng.
 */
internal fun liveStarsFor(stars: StarThresholds, movesUsed: Int, rotationsUsed: Int): LiveStars? {
    val used = when (stars.metric) {
        StarMetric.MOVES -> movesUsed
        StarMetric.ROTATIONS -> rotationsUsed
        else -> return null
    }
    val tier = stars.tierFor(used)
    val unit = if (stars.metric == StarMetric.ROTATIONS) "lượt xoay" else "nước"
    val keepThreshold = when (tier) {
        3 -> stars.three
        2 -> stars.two
        else -> null   // đã 1★ (thấp nhất) — hoàn thành không tụt thêm
    }
    val next = when {
        keepThreshold == null -> null
        keepThreshold - used >= 1 -> "Còn ${keepThreshold - used} $unit giữ $tier★"
        else -> "Thêm 1 $unit rớt ${tier - 1}★"
    }
    return LiveStars(tier = tier, now = "Đang $tier★", next = next)
}
