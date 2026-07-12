package com.gravityjelly.game

import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset

/**
 * Overlay mảnh đang kéo (floating) — vẽ tại con trỏ với cỡ ô bàn, frame-driven (đọc
 * [renderTick] mỗi vsync, KHÔNG recompose). Public để lớp ráp ở :app tái dùng
 * (EndlessPlayScreen, CampaignPlayScreen). [parentWin] = vị trí window của Box cha
 * (để quy con trỏ về toạ độ local).
 *
 * Ghi chú: trước đây nằm chung trong `EndlessScreen.kt` (màn Endless dựng ở `:game` cũ).
 * Chrome màn chơi nay ở `:app`; chỉ overlay này còn dùng nên tách riêng, phần còn lại đã bỏ.
 */
@Composable
fun DragPieceOverlay(
    holder: EndlessGameHolder,
    parentWin: Offset,
    renderTick: Long,
    modifier: Modifier,
) {
    val bitmaps = rememberJellyBitmaps()
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
        drawPieceShape(piece, originX, originY, cell, holder.boardRender.gravity, bitmaps = bitmaps)
    }
}
