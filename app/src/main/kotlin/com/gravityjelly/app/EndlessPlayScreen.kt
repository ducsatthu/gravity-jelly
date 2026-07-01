package com.gravityjelly.app

import androidx.activity.compose.BackHandler
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInWindow
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.ComboPopup
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.components.GjDialog
import com.gravityjelly.app.ui.guide.GjGuide
import com.gravityjelly.app.ui.guide.GjGuideEntry
import com.gravityjelly.app.ui.guide.GuideTeachDialog
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.game.BOARD_PAD_DP
import com.gravityjelly.game.BoardCanvas
import com.gravityjelly.game.ComboBurst
import com.gravityjelly.game.DragPieceOverlay
import com.gravityjelly.game.EffectKind
import com.gravityjelly.game.EndlessGameHolder
import com.gravityjelly.game.rememberGameDriver
import kotlin.math.roundToInt

/**
 * Màn chơi Endless **ráp ở :app** qua layout [GameScreen] (board-design.jsx: nền PNG đồng cỏ ·
 * HUD score-card/D-pad/pause · khung kem bọc [BoardCanvas] · khay 3 giếng + FAB xoay). Đây là
 * lớp vỏ thay cho `:game` EndlessScreen cũ — vì chrome design nằm ở :app (không import ngược
 * được từ :game). Input kéo-thả vẫn dùng [EndlessGameHolder] (một chiều: kéo → holder → engine).
 *
 * @param onHome thoát về Home (từ dialog Tạm dừng).
 * @param vibrate / reducedMotion: tôn trọng Settings + a11y (haptic + bỏ juice).
 */
@Composable
fun EndlessPlayScreen(
    holder: EndlessGameHolder,
    best: Int,
    onHome: () -> Unit,
    modifier: Modifier = Modifier,
    vibrate: Boolean = true,
    reducedMotion: Boolean = false,
    seenGuides: Set<String> = emptySet(),
    onGuideSeen: (String) -> Unit = {},
) {
    val renderTick = rememberGameDriver(holder.animator)
    val shell = holder.shell
    val density = LocalDensity.current.density
    val haptics = LocalHapticFeedback.current

    var parentWin by remember { mutableStateOf(Offset.Zero) }
    var paused by remember { mutableStateOf(false) }

    // Chuyển app / cuộc gọi đến / xem recents → Activity nhận ON_PAUSE: tự bật dialog Tạm dừng để
    // ván không chạy tiếp lúc người chơi không nhìn. Frame loop (withFrameNanos) tự ngưng khi ra nền;
    // dialog giữ ván đứng khi quay lại cho tới khi người chơi bấm "Tiếp tục". Không tự pause nếu đã thua.
    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_PAUSE && !holder.shell.gameOver) paused = true
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    // Popup dạy luật ĐANG hiện (null = không). Một popup mỗi lúc, từ HAI nguồn:
    //  (1) combo-hồi-lượt-xoay — path riêng giữ nhịp 900ms (cho thấy combo ×N + badge trước).
    //  (2) hàng đợi cơ chế GẶP-LẦN-ĐẦU (holder.guideQueue) — chờ bàn LẮNG rồi hiện tuần tự; khi
    //      nhiều cơ chế cùng nổ trong một nước (vd xóa hàng → trọng lực rơi → thạch dính), nút đổi
    //      thành "Tiếp theo" để bước qua từng popup ngay, không phải chờ lại.
    // [displayEntry] giữ mục cuối để dialog vẫn vẽ đúng nội dung trong lúc chạy animation đóng.
    var activeGuide by remember { mutableStateOf<GjGuideEntry?>(null) }
    var displayEntry by remember { mutableStateOf(GjGuide.comboRefill) }
    LaunchedEffect(activeGuide) { activeGuide?.let { displayEntry = it } }

    // ids đã xem TRONG PHIÊN này (seenGuides từ DataStore cập nhật bất đồng bộ — local đảm bảo
    // không hiện lại ngay trong lúc bước qua chuỗi popup).
    val locallySeen = remember { mutableStateListOf<String>() }
    fun guideSeen(id: String) = id in seenGuides || id in locallySeen
    // bỏ các cơ chế đã-xem đang nằm đầu hàng đợi (vd đã học từ phiên trước) → không kẹt đầu.
    fun pruneSeenHeads() {
        while (holder.guideQueue.firstOrNull()?.let { guideSeen(GjGuide.forMechanic(it).id) } == true) {
            holder.consumeGuide()
        }
    }

    // (1) combo hồi lượt xoay: RotationRefunded → rotationRefillTick tăng; trễ 900ms rồi hiện.
    val comboRefillUnseen = !guideSeen(GjGuide.comboRefill.id)
    LaunchedEffect(holder.rotationRefillTick) {
        if (holder.rotationRefillTick > 0L && comboRefillUnseen && !holder.shell.gameOver) {
            kotlinx.coroutines.delay(900L)
            if (!holder.shell.gameOver && activeGuide == null) activeGuide = GjGuide.comboRefill
        }
    }

    // (2) cơ chế gặp-lần-đầu (poll, tránh re-key liên tục khi hàng đợi đổi): chờ bàn LẮNG rồi mở
    // popup đầu hàng đợi (chưa xem). Popup nằm trên bàn TĨNH, không đè animation nổ/ghép.
    // Key theo seenGuides để đọc đúng trạng thái đã-xem khi DataStore nạp bất đồng bộ.
    LaunchedEffect(seenGuides) {
        while (true) {
            pruneSeenHeads()
            val head = holder.guideQueue.firstOrNull()
            if (head == null || activeGuide != null || holder.shell.gameOver || holder.animator.isPlaying) {
                kotlinx.coroutines.delay(150L); continue
            }
            kotlinx.coroutines.delay(GUIDE_SETTLE_GRACE_MS)
            if (!holder.shell.gameOver && activeGuide == null && !holder.animator.isPlaying &&
                holder.guideQueue.firstOrNull() == head
            ) {
                activeGuide = GjGuide.forMechanic(head)
            }
            kotlinx.coroutines.delay(120L)
        }
    }

    // Nhãn nút: cơ chế hàng đợi mà SAU đầu hàng còn mục CHƯA xem → "Tiếp theo"; còn lại "Đã hiểu".
    // Combo-refill (path riêng) luôn "Đã hiểu".
    val active = activeGuide
    val moreInQueue = active != null && active.id != GjGuide.comboRefill.id &&
        holder.guideQueue.drop(1).any { !guideSeen(GjGuide.forMechanic(it).id) }
    val guideConfirmLabel = if (moreInQueue) "Tiếp theo" else "Đã hiểu"
    val slotWin = remember { arrayOf(Offset.Zero, Offset.Zero, Offset.Zero) }
    // ô khay đang kéo → highlight ô nguồn (selected style: ring cam + nền lõm + tam giác).
    // -1 = không kéo. Đặt khi onDragStart, xoá khi thả/huỷ.
    var draggingSlot by remember { mutableIntStateOf(-1) }

    // Haptic tập trung (đặt/xóa/combo≥3) + reduced-motion → holder/animator, gate bằng [vibrate].
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

    // Back / vuốt-back KHÔNG thoát ván (chống back nhầm mất màn). Ưu tiên: popup dạy luật đang mở →
    // nuốt (bắt buộc xác nhận). Đã thua (ResultScreen overlay) → về Home. Đang Tạm dừng → tiếp tục
    // chơi. Còn lại (đang chơi) → mở Tạm dừng; muốn về Home phải bấm "Về Home" trong dialog.
    BackHandler {
        when {
            activeGuide != null -> Unit          // dialog dạy luật: bắt buộc bấm xác nhận
            shell.gameOver      -> onHome()        // đã thua → về Home
            paused              -> paused = false  // đang Tạm dừng → tiếp tục
            else                -> paused = true   // đang chơi → mở Tạm dừng
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .onGloballyPositioned { parentWin = it.positionInWindow() },
    ) {
        GameScreen(
            score         = shell.score,
            direction     = holder.boardRender.gravity,
            turnsLeft     = shell.budget,
            pieces        = shell.tray,
            selectedIndex = draggingSlot,
            onPause       = { paused = true },
            onSelectPiece = { /* live game dùng kéo-thả, không tap-select */ },
            onRotate      = { if (shell.budget > 0 && !shell.gameOver) holder.rotate(cw = true) },
            // Combo hiếm → overlay ăn mừng ×N nổ TẠI vùng resolve trên bàn (ComboBurstOverlay bên
            // dưới). Thiết kế mới (board-design.jsx) dùng nền PNG, KHÔNG còn band vườn để mảnh rơi.
            // mỗi slot khay: theo dõi vị trí window + kéo-thả → holder (như drag cũ, visual design)
            traySlotModifier = { i ->
                Modifier
                    .onGloballyPositioned { slotWin[i] = it.positionInWindow() }
                    .pointerInput(holder, shell.tray) {
                        detectDragGestures(
                            onDragStart  = { if (holder.beginDrag(i)) draggingSlot = i },
                            onDrag       = { change, _ ->
                                change.consume()
                                val w = slotWin[i]
                                holder.dragTo(w.x + change.position.x, w.y + change.position.y)
                            },
                            onDragEnd    = { holder.commitDrag(); draggingSlot = -1 },
                            onDragCancel = { holder.cancelDrag(); draggingSlot = -1 },
                        )
                    }
            },
            board = { m ->
                BoardCanvas(
                    render     = { holder.boardRender },
                    renderTick = renderTick.value,
                    animator   = holder.animator,
                    modifier   = m.onGloballyPositioned {
                        val p      = it.positionInWindow()
                        val wellPx = minOf(it.size.width, it.size.height).toFloat()
                        val padPx  = BOARD_PAD_DP * density
                        holder.density = density
                        holder.setBoardBounds(p.x + padPx, p.y + padPx, wellPx - 2 * padPx)
                    },
                )
            },
        )

        // Mảnh đang kéo (floating) — frame-driven, vẽ trên cùng.
        DragPieceOverlay(holder, parentWin, renderTick.value, Modifier.fillMaxSize())

        // Combo (hiếm) → overlay ×N + lời khen nổ TẠI vùng resolve trên bàn, giữ rồi tan.
        holder.comboBurst?.let { burst ->
            ComboBurstOverlay(burst, parentWin, Modifier.fillMaxSize())
        }

        // Dialog Tạm dừng (design-faithful).
        GjDialog(
            open        = paused,
            title       = "Tạm dừng",
            icon        = GjIcons.Pause,
            dismissable = true,
            onClose     = { paused = false },
            content     = {
                Text(
                    text  = "Điểm hiện tại: ${shell.score}",
                    style = MaterialTheme.typography.bodyLarge.copy(color = GjPalette.TextMuted),
                )
            },
            actions     = {
                GjButton(onClick = { paused = false }, variant = BtnVariant.Primary, fullWidth = true,
                    icon = GjIcons.Play) { Text("Tiếp tục") }
                GjButton(onClick = { paused = false; onHome() }, variant = BtnVariant.Ghost, fullWidth = true,
                    icon = GjIcons.Home) { Text("Về Home") }
            },
        )

        // Popup dạy luật (combo-refill HOẶC cơ chế gặp-lần-đầu) — bắt buộc xác nhận. Đóng → đánh dấu
        // đã xem; nếu hàng đợi còn cơ chế khác (nút "Tiếp theo") → hiện NGAY popup kế (không chờ lại).
        GuideTeachDialog(
            entry        = displayEntry,
            open         = activeGuide != null,
            confirmLabel = guideConfirmLabel,
            onDismiss    = {
                val e = activeGuide
                activeGuide = null
                if (e != null) {
                    locallySeen.add(e.id)
                    onGuideSeen(e.id)
                    if (e.id != GjGuide.comboRefill.id) {
                        holder.consumeGuide()           // bỏ cơ chế vừa dạy khỏi hàng đợi
                        pruneSeenHeads()
                        // còn cơ chế chưa xem ở đầu → CHAIN: mở ngay popup kế (bàn đã lắng sẵn);
                        // set displayEntry cùng nhịp để tiêu đề/nội dung không trễ một frame.
                        holder.guideQueue.firstOrNull()?.let {
                            val next = GjGuide.forMechanic(it)
                            displayEntry = next
                            activeGuide = next
                        }
                    }
                }
            },
        )
    }
}

/**
 * Overlay ăn mừng combo đặt TẠI vùng resolve trên bàn (combo hiếm → gắn vào đúng nơi vừa
 * xảy ra cho người chơi thấy liền). Dùng đúng [ComboPopup] của design (×N rainbow + lời khen
 * + sao), chỉ phần CHỮ (showDish=false, showPieces=false) — mảnh jelly rơi vẫn ở band vườn.
 *
 * Vị trí: [ComboBurst.winX]/[winY] là tâm vùng combo (toạ độ cửa sổ); quy về cục bộ bằng
 * [parentWin]. Bong bóng rộng 174dp → canh giữa theo winX; nâng [BUBBLE_ANCHOR_DP] để chữ
 * "nổ LÊN" phía trên điểm resolve thay vì che các ô vừa xóa.
 *
 * Vòng đời phỏng game-screen.jsx `gj-combo-life` (giữ ~66% rồi mờ). [key] theo id → remount
 * phát lại animation pop mỗi combo. Box overlay KHÔNG bắt chạm (không pointerInput) → kéo-thả
 * vẫn xuyên qua.
 */
@Composable
private fun ComboBurstOverlay(
    burst: ComboBurst,
    parentWin: Offset,
    modifier: Modifier = Modifier,
) {
    val density = LocalDensity.current
    val alpha   = remember(burst.id) { Animatable(1f) }
    LaunchedEffect(burst.id) {
        alpha.snapTo(1f)
        kotlinx.coroutines.delay(COMBO_HOLD_MS)
        alpha.animateTo(0f, tween(durationMillis = COMBO_FADE_MS))
    }
    val halfWidthPx = with(density) { 87.dp.toPx() }                 // nửa bề rộng ComboPopup (174dp)
    val anchorPx    = with(density) { BUBBLE_ANCHOR_DP.dp.toPx() }   // nâng bong bóng lên trên điểm resolve

    Box(modifier) {
        key(burst.id) {
            Box(
                modifier = Modifier
                    .offset {
                        IntOffset(
                            (burst.winX - parentWin.x - halfWidthPx).roundToInt(),
                            (burst.winY - parentWin.y - anchorPx).roundToInt(),
                        )
                    }
                    .alpha(alpha.value),
            ) {
                ComboPopup(combo = burst.combo, showDish = false, showPieces = false)
            }
        }
    }
}

// Chờ thêm sau khi bàn lắng trước khi mở popup dạy cơ chế — để người chơi thấy KẾT QUẢ đã ổn định.
private const val GUIDE_SETTLE_GRACE_MS = 450L

private const val COMBO_HOLD_MS  = 1300L   // giữ trước khi tan (gj-combo-life ~66% của ~2s)
private const val COMBO_FADE_MS  = 700     // thời gian mờ dần
private const val BUBBLE_ANCHOR_DP = 72f   // dịch lên: 174x120 box, chữ ở đỉnh → chữ nổi CAO hơn trên resolve
