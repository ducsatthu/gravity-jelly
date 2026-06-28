package com.gravityjelly.app

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
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
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.ComboPopup
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.components.GjDialog
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.core.Piece
import com.gravityjelly.game.BOARD_PAD_DP
import com.gravityjelly.game.BoardCanvas
import com.gravityjelly.game.ComboBurst
import com.gravityjelly.game.DragPieceOverlay
import com.gravityjelly.game.EffectKind
import com.gravityjelly.game.EndlessGameHolder
import com.gravityjelly.game.rememberGameDriver
import kotlin.math.roundToInt

/**
 * Màn chơi Endless **ráp ở :app** bằng component design-faithful (GjHud · BoardCanvas ·
 * JellyMeadow · GjTray · GravityRotateButton) qua layout [GameScreen]. Đây là lớp vỏ thay
 * cho `:game` EndlessScreen cũ — vì component design nằm ở :app (không import ngược được
 * từ :game). Input kéo-thả vẫn dùng [EndlessGameHolder] (một chiều: kéo → holder → engine).
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
) {
    val renderTick = rememberGameDriver(holder.animator)
    val shell = holder.shell
    val density = LocalDensity.current.density
    val haptics = LocalHapticFeedback.current

    var parentWin by remember { mutableStateOf(Offset.Zero) }
    var paused by remember { mutableStateOf(false) }
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

    Box(
        modifier = modifier
            .fillMaxSize()
            .onGloballyPositioned { parentWin = it.positionInWindow() },
    ) {
        GameScreen(
            score         = shell.score,
            direction     = holder.boardRender.gravity,
            turnsLeft     = shell.budget,
            pieces        = shell.tray.map { it as Piece? },
            selectedIndex = draggingSlot,
            onPause       = { paused = true },
            onSelectPiece = { /* live game dùng kéo-thả, không tap-select */ },
            onRotate      = { if (shell.budget > 0 && !shell.gameOver) holder.rotate(cw = true) },
            // combo>=2 → jelly block rơi từ board xuống vườn (mảnh vỡ rơi vào đĩa vườn).
            // Chữ ×N + lời khen KHÔNG ở band nữa: combo hiếm → overlay ăn mừng nổ TẠI vùng
            // resolve trên bàn (ComboBurstOverlay bên dưới). showDish=false vì khay đã cố định.
            comboBurst    = if (shell.combo >= 2) shell.combo else 0,
            showComboText = false,
            // mỗi slot khay: theo dõi vị trí window + kéo-thả → holder (như drag cũ, visual design)
            traySlotModifier = { i ->
                Modifier
                    .onGloballyPositioned { slotWin[i] = it.positionInWindow() }
                    .pointerInput(holder, shell.tray) {
                        detectDragGestures(
                            onDragStart  = { holder.beginDrag(i); draggingSlot = i },
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

private const val COMBO_HOLD_MS  = 1300L   // giữ trước khi tan (gj-combo-life ~66% của ~2s)
private const val COMBO_FADE_MS  = 700     // thời gian mờ dần
private const val BUBBLE_ANCHOR_DP = 72f   // dịch lên: 174x120 box, chữ ở đỉnh → chữ nổi CAO hơn trên resolve
