package com.gravityjelly.game

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInWindow
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/**
 * Màn chơi Endless. Lắp ráp: HUD + bàn (Canvas frame-driven) + khay + nút xoay (FAB).
 * Engine giữ trong [holder] (ngoài Compose). Lớp vỏ recompose theo [holder].shell;
 * bàn + overlay vẽ lại mỗi vsync qua renderTick mà KHÔNG recompose.
 */
@Composable
fun EndlessScreen(
    holder: EndlessGameHolder,
    modifier: Modifier = Modifier,
    best: Int = 0,
    vibrate: Boolean = true,
    reducedMotion: Boolean = false,
) {
    val renderTick = rememberGameDriver(holder.animator)
    var parentWin by remember { mutableStateOf(Offset.Zero) }
    val shell = holder.shell
    val density = LocalDensity.current.density

    // Phản hồi haptic tập trung (đặt/xóa/combo≥3) + cờ reduced-motion → holder/animator.
    // Gate bằng [vibrate]; combo dùng rung mạnh hơn (xấp xỉ "double-tick").
    val haptics = LocalHapticFeedback.current
    androidx.compose.runtime.LaunchedEffect(holder, vibrate, reducedMotion, haptics) {
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
        modifier
            .fillMaxSize()
            .background(JellyTheme.bg)
            .onGloballyPositioned { parentWin = it.positionInWindow() },
    ) {
        Column(
            Modifier.fillMaxSize().padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            HudBar(shell, best, Modifier.fillMaxWidth())
            Spacer(Modifier.height(16.dp))
            BoardCanvas(
                render     = { holder.boardRender },
                renderTick = renderTick.value,
                animator   = holder.animator,
                modifier   = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
                    .onGloballyPositioned {
                        val p      = it.positionInWindow()
                        val wellPx = minOf(it.size.width, it.size.height).toFloat()
                        // lưới bắt đầu tại (x + padPx, y + padPx), kích thước = well - 2*pad
                        val padPx  = BOARD_PAD_DP * density
                        holder.density = density
                        holder.setBoardBounds(p.x + padPx, p.y + padPx, wellPx - 2 * padPx)
                    },
            )
            Spacer(Modifier.weight(1f))
            TrayBar(shell.tray, holder, Modifier.fillMaxWidth().excludeSystemGestures())
            Spacer(Modifier.height(8.dp))
        }

        RotateFab(
            budget = shell.budget,
            enabled = shell.budget > 0 && !shell.gameOver,
            onClick = { holder.rotate(cw = true) },
            modifier = Modifier.align(Alignment.BottomEnd).padding(24.dp),
        )

        // mảnh đang kéo (floating) — frame-driven, không recompose
        DragPieceOverlay(holder, parentWin, renderTick.value, Modifier.fillMaxSize())
        // Game Over do :app phủ lên (điều hướng + Services) — xem EndlessGameScreen.
    }
}

@Composable
private fun HudBar(shell: ShellState, best: Int, modifier: Modifier = Modifier) {
    Row(modifier, horizontalArrangement = Arrangement.SpaceBetween) {
        HudStat("ĐIỂM", shell.score.toString())
        HudStat("BEST", best.toString())
        HudStat("MÀN", shell.stage.toString())
        HudStat("XOAY", shell.budget.toString())
    }
}

@Composable
private fun HudStat(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        BasicText(
            value,
            style = TextStyle(color = JellyTheme.textPrimary, fontSize = 22.sp, fontWeight = FontWeight.Bold),
        )
        BasicText(label, style = TextStyle(color = JellyTheme.textMuted, fontSize = 11.sp))
    }
}

@Composable
private fun RotateFab(
    budget: Int,
    enabled: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val base = JellyTheme.gravity
    val bg = if (enabled) base.fill else base.fill.copy(alpha = 0.35f)
    Box(
        modifier
            .size(64.dp)
            .clip(CircleShape)
            .background(bg)
            .then(if (enabled) Modifier.clickable(onClick = onClick) else Modifier),
        contentAlignment = Alignment.Center,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Canvas(Modifier.size(26.dp)) { drawRotateGlyph(Color.White) }
            BasicText(
                budget.toString(),
                style = TextStyle(color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold),
            )
        }
    }
}

/**
 * Overlay mảnh đang kéo (floating) — vẽ tại con trỏ với cỡ ô bàn, frame-driven (đọc
 * [renderTick] mỗi vsync, KHÔNG recompose). Public để lớp ráp ở :app tái dùng.
 * [parentWin] = vị trí window của Box cha (để quy con trỏ về toạ độ local).
 */
@Composable
fun DragPieceOverlay(
    holder: EndlessGameHolder,
    parentWin: Offset,
    renderTick: Long,
    modifier: Modifier,
) {
    Canvas(modifier) {
        @Suppress("UNUSED_EXPRESSION") renderTick
        val piece = holder.dragPiece ?: return@Canvas
        val pos = holder.dragWindowPos ?: return@Canvas
        val cell = holder.boardCellPx
        if (cell <= 0f) return@Canvas
        val sw = piece.shape.width
        val sh = piece.shape.height
        val cx = pos.x - parentWin.x
        val cy = pos.y - parentWin.y
        val originX = cx - sw * cell / 2f
        val originY = cy - sh * cell / 2f
        drawPieceShape(piece, originX, originY, cell, holder.boardRender.gravity)
    }
}

/** Mũi tên xoay vòng cho FAB (vẽ trên recompose, không phải mỗi frame). */
private fun DrawScope.drawRotateGlyph(color: Color) {
    val w = size.minDimension
    val stroke = w * 0.12f
    val inset = stroke
    drawArc(
        color = color,
        startAngle = -40f,
        sweepAngle = 290f,
        useCenter = false,
        topLeft = Offset(inset, inset),
        size = Size(w - inset * 2, w - inset * 2),
        style = Stroke(width = stroke, cap = StrokeCap.Round),
    )
    val r = (w - inset * 2) / 2
    val cx = w / 2
    val cy = w / 2
    val ang = -40.0 * PI / 180.0
    val ex = cx + (r * cos(ang)).toFloat()
    val ey = cy + (r * sin(ang)).toFloat()
    val a = w * 0.20f
    drawLine(color, Offset(ex, ey), Offset(ex - a, ey - a * 0.1f), stroke, cap = StrokeCap.Round)
    drawLine(color, Offset(ex, ey), Offset(ex - a * 0.1f, ey + a), stroke, cap = StrokeCap.Round)
}

// ── preview ──

@Preview(widthDp = 360, heightDp = 800)
@Composable
private fun EndlessScreenPreview() {
    val holder = remember { EndlessGameHolder(seed = 12345L) }
    EndlessScreen(holder, Modifier.fillMaxSize())
}
