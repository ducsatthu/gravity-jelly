package com.gravityjelly.game

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInWindow
import androidx.compose.ui.unit.dp
import com.gravityjelly.core.Direction
import com.gravityjelly.core.Piece
import com.gravityjelly.core.TrayGenerator

/**
 * Khay 3 mảnh (Composable vỏ). Mỗi ô draggable: kéo lên bàn → holder tính ghost,
 * thả → holder gửi PlacePiece. Recompose chỉ khi [tray] đổi (sau mỗi lượt đặt).
 */
@Composable
fun TrayBar(
    tray: List<Piece>,
    holder: EndlessGameHolder,
    modifier: Modifier = Modifier,
) {
    Row(modifier, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        for (i in 0 until TrayGenerator.TRAY_SIZE) {
            TraySlot(
                piece = tray.getOrNull(i),
                index = i,
                holder = holder,
                modifier = Modifier.weight(1f).aspectRatio(1f),
            )
        }
    }
}

@Composable
private fun TraySlot(
    piece: Piece?,
    index: Int,
    holder: EndlessGameHolder,
    modifier: Modifier,
) {
    var slotWin by remember { mutableStateOf(Offset.Zero) }
    Box(
        modifier
            .background(JellyTheme.surfaceSunken, RoundedCornerShape(16.dp))
            .onGloballyPositioned { slotWin = it.positionInWindow() }
            .then(
                if (piece != null) {
                    Modifier.pointerInput(piece) {
                        detectDragGestures(
                            onDragStart = { holder.beginDrag(index) },
                            onDrag = { change, _ ->
                                change.consume()
                                holder.dragTo(slotWin.x + change.position.x, slotWin.y + change.position.y)
                            },
                            onDragEnd = { holder.commitDrag() },
                            onDragCancel = { holder.cancelDrag() },
                        )
                    }
                } else {
                    Modifier
                },
            ),
    ) {
        if (piece != null) {
            PiecePreview(piece, Modifier.fillMaxSize().padding(10.dp))
        }
    }
}

/** Vẽ mảnh thu nhỏ vừa khít ô khay (một Canvas, allocation-free). */
@Composable
private fun PiecePreview(piece: Piece, modifier: Modifier) {
    PieceThumbnail(piece, modifier)
}

/**
 * Public: vẽ mảnh canh giữa trong [modifier].
 * [cellDp]: kích thước ô dp; null = tự scale vừa khít.
 * [gravity]: hướng nhìn của mắt (logo Home dùng để mỗi khối nhìn một hướng).
 * API cho :app (GjTray, logo) và nơi cần hiển thị mảnh ngoài game loop.
 */
@Composable
fun PieceThumbnail(
    piece: Piece,
    modifier: Modifier = Modifier,
    cellDp: Float? = null,
    gravity: Direction = Direction.DOWN,
    gapFrac: Float = GAP_FRAC,
) {
    val density = LocalDensity.current.density
    Canvas(modifier) {
        val sw   = piece.shape.width
        val sh   = piece.shape.height
        val cell = if (cellDp != null) cellDp * density
                   else size.minDimension / (maxOf(sw, sh) + 0.4f)
        drawPieceShape(
            piece,
            originX = (size.width  - sw * cell) / 2f,
            originY = (size.height - sh * cell) / 2f,
            cell    = cell,
            gravity = gravity,
            gapFrac = gapFrac,
        )
    }
}
