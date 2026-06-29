package com.gravityjelly.game

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.gravityjelly.core.CellType
import com.gravityjelly.core.ClearedLines
import com.gravityjelly.core.Direction
import com.gravityjelly.core.GameEvent
import com.gravityjelly.core.Grid
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PieceLibrary
import com.gravityjelly.core.Vec
import com.gravityjelly.core.applyClusterGravity

/**
 * @Preview cho từng hiệu ứng: dựng state mẫu + chuỗi sự kiện, nạp vào [BoardAnimator],
 * bước sim tới một mốc giữa-animation rồi vẽ MỘT khung tĩnh. Không chạy game loop.
 */

private fun blk(c: JellyColor) = Grid.Cell(CellType.BLOCK, c)

private val PALETTE = JellyColor.entries

private fun renderOf(grid: Grid, gravity: Direction): BoardRender {
    val r = BoardRender()
    r.grid = grid
    r.gravity = gravity
    fillClusterSizes(grid, r.clusterSizes)
    return r
}

/** Nạp sự kiện rồi bước sim [ms] mili-giây (đóng băng khung để xem giữa hiệu ứng). */
private fun BoardAnimator.freezeAt(ms: Int) {
    val steps = (ms * 1_000_000L / GameClock.STEP_NANOS).toInt()
    repeat(steps) { step(GameClock.STEP_NANOS) }
    renderAlpha = 0f
}

private val previewModifier: Modifier
    @Composable get() = Modifier
        .fillMaxWidth()
        .aspectRatio(1f)
        .background(JellyTheme.surfaceSunken, RoundedCornerShape(20.dp))
        .padding(8.dp)

// ─── Block atoms ───────────────────────────────────────────────────────────────

/** 5 khối nguyên tử: 4 màu jelly + stone — dùng để so mắt với jelly-block.card.html */
@Preview(name = "00 Block atoms — 4 màu + stone", widthDp = 220, heightDp = 52)
@Composable
private fun BlockAtomsPreview() {
    Canvas(
        Modifier
            .fillMaxWidth()
            .aspectRatio(220f / 52f)
            .background(JellyTheme.bg),
    ) {
        val blockSize = size.height * 0.78f
        val slotW = size.width / 5f
        val topOff = (size.height - blockSize) / 2f
        val cr = CornerRadius(blockSize * CORNER_FRAC, blockSize * CORNER_FRAC)
        val borderStroke = Stroke(blockSize * BORDER_FRAC)
        val palettes = arrayOf(JellyTheme.yellow, JellyTheme.mint, JellyTheme.pink, JellyTheme.blue)
        val colors   = arrayOf(JellyColor.YELLOW, JellyColor.MINT, JellyColor.PINK, JellyColor.BLUE)
        for (i in 0..3) {
            val left = i * slotW + (slotW - blockSize) / 2f
            drawJellyBlock(left, topOff, blockSize, cr, borderStroke, palettes[i])
            drawEyes(left, topOff, blockSize, 0f, 1f)
            drawSticker(colors[i], palettes[i], left, topOff, blockSize)
        }
        val stoneLeft = 4 * slotW + (slotW - blockSize) / 2f
        drawStoneBlock(stoneLeft, topOff, blockSize, cr, borderStroke)
    }
}

/** 6 khối: 4 hướng trọng lực (normal) + blink + happy — so với eyes.card.html */
@Preview(name = "00b Eyes — 4 hướng + blink + happy", widthDp = 270, heightDp = 52)
@Composable
private fun EyesPreview() {
    Canvas(
        Modifier
            .fillMaxWidth()
            .aspectRatio(270f / 52f)
            .background(JellyTheme.bg),
    ) {
        val blockSize = size.height * 0.78f
        val slotW = size.width / 6f
        val topOff = (size.height - blockSize) / 2f
        val cr = CornerRadius(blockSize * CORNER_FRAC, blockSize * CORNER_FRAC)
        val borderStroke = Stroke(blockSize * BORDER_FRAC)
        val pal = JellyTheme.mint

        data class Slot(val dx: Float, val dy: Float, val expr: EyeExpression = EyeExpression.NORMAL, val open: Boolean = true)
        val slots = listOf(
            Slot(0f, 1f),                              // down (normal)
            Slot(0f, -1f),                             // up
            Slot(0f, 1f, open = false),                // blink
            Slot(0f, 1f, EyeExpression.HAPPY),         // happy
            Slot(0f, 1f, EyeExpression.SMUG),          // smug
            Slot(0f, 1f, EyeExpression.WINK),          // wink
        )
        for ((i, s) in slots.withIndex()) {
            val left = i * slotW + (slotW - blockSize) / 2f
            drawJellyBlock(left, topOff, blockSize, cr, borderStroke, pal)
            drawEyes(left, topOff, blockSize, s.dx, s.dy, s.expr, s.open)
        }
    }
}

/**
 * 3 mốc state tĩnh để so spec:
 * - Slot 0: squash đỉnh (1.08 × 0.86) → mắt nhắm, không sticker
 * - Slot 1: clearProgress = 0.5 → block mờ 50%, phồng 1.06, sticker mờ
 * - Slot 2: clearProgress = 0.9 → gần biến mất (alpha 10%, scale 1.108)
 */
@Preview(name = "00c State params — squash + clear", widthDp = 165, heightDp = 60)
@Composable
private fun StateParamsPreview() {
    Canvas(
        Modifier
            .fillMaxWidth()
            .aspectRatio(165f / 60f)
            .background(JellyTheme.bg),
    ) {
        val blockSize = size.height * 0.70f
        val slotW = size.width / 3f
        val topOff = (size.height - blockSize) / 2f
        val cr = CornerRadius(blockSize * CORNER_FRAC, blockSize * CORNER_FRAC)
        val borderStroke = Stroke(blockSize * BORDER_FRAC)

        data class CellState(
            val squashX: Float = 1f, val squashY: Float = 1f,
            val clearP: Float = 0f,
            val pal: BlockPalette = JellyTheme.mint,
            val col: JellyColor   = JellyColor.MINT,
        )
        val states = listOf(
            CellState(squashX = 1.08f, squashY = 0.86f,          pal = JellyTheme.yellow, col = JellyColor.YELLOW),
            CellState(clearP  = 0.5f,                             pal = JellyTheme.pink,   col = JellyColor.PINK),
            CellState(clearP  = 0.9f,                             pal = JellyTheme.blue,   col = JellyColor.BLUE),
        )
        for ((i, s) in states.withIndex()) {
            val left = i * slotW + (slotW - blockSize) / 2f
            drawJellyCell(
                left, topOff, blockSize, cr, borderStroke,
                s.pal, s.col, 0f, 1f,
                squashScaleX = s.squashX, squashScaleY = s.squashY,
                clearProgress = s.clearP,
            )
        }
    }
}

// ─── Effect previews ───────────────────────────────────────────────────────────

@Preview(name = "01 Drop squash", widthDp = 260, heightDp = 260)
@Composable
private fun DropSquashPreview() {
    val state = remember {
        val pre = Grid()
        val post = Grid()
        val cells = listOf(Vec(3, 6), Vec(4, 6), Vec(3, 7), Vec(4, 7))
        for (c in cells) post.set(c.x, c.y, blk(JellyColor.MINT))
        // sàn để có ngữ cảnh
        for (x in 0 until 9) post.set(x, 8, blk(PALETTE[x % 4]))
        val anim = BoardAnimator()
        anim.ingest(
            listOf(GameEvent.PiecePlaced(Piece(PieceLibrary.O4, JellyColor.MINT), cells)),
            pre, Direction.DOWN, post, Direction.DOWN,
        )
        anim.freezeAt(70)
        anim to renderOf(post, Direction.DOWN)
    }
    BoardCanvas({ state.second }, 0L, previewModifier, animator = state.first)
}

@Preview(name = "03 Line clear", widthDp = 260, heightDp = 260)
@Composable
private fun LineClearPreview() {
    val state = remember {
        val pre = Grid()
        for (x in 0 until 8) pre.set(x, 8, blk(PALETTE[x % 4]))   // hàng đáy thiếu 1 ô
        val placed = listOf(Vec(8, 8))
        val post = Grid()                                          // sau khi xóa: trống
        val events = listOf(
            GameEvent.PiecePlaced(Piece(PieceLibrary.O4, JellyColor.BLUE), placed),
            GameEvent.LinesCleared(ClearedLines(listOf(8), emptyList()), 9, 1, 81),
        )
        val anim = BoardAnimator()
        anim.ingest(events, pre, Direction.DOWN, post, Direction.DOWN)
        anim.freezeAt(190)
        anim to renderOf(post, Direction.DOWN)
    }
    BoardCanvas({ state.second }, 0L, previewModifier, animator = state.first)
}

@Preview(name = "04 Combo popup", widthDp = 260, heightDp = 260)
@Composable
private fun ComboPopupPreview() {
    val state = remember {
        val pre = Grid()
        for (x in 0 until 8) pre.set(x, 4, blk(PALETTE[x % 4]))
        val placed = listOf(Vec(8, 4))
        val post = Grid()
        val events = listOf(
            GameEvent.PiecePlaced(Piece(PieceLibrary.O4, JellyColor.PINK), placed),
            GameEvent.LinesCleared(ClearedLines(listOf(4), emptyList()), 9, 3, 162),
        )
        val anim = BoardAnimator()
        anim.ingest(events, pre, Direction.DOWN, post, Direction.DOWN)
        anim.freezeAt(140)
        anim to renderOf(post, Direction.DOWN)
    }
    BoardCanvas({ state.second }, 0L, previewModifier, animator = state.first)
}

@Preview(name = "02 Gravity rotate", widthDp = 260, heightDp = 260)
@Composable
private fun GravityRotatePreview() {
    val state = remember {
        val pre = Grid()
        // vài cụm "lơ lửng" chưa sát tường phải
        pre.set(1, 1, blk(JellyColor.YELLOW)); pre.set(2, 1, blk(JellyColor.YELLOW))
        pre.set(1, 2, blk(JellyColor.PINK))
        pre.set(4, 3, blk(JellyColor.MINT)); pre.set(4, 4, blk(JellyColor.MINT))
        pre.set(3, 6, blk(JellyColor.BLUE)); pre.set(4, 6, blk(JellyColor.BLUE))
        val newGravity = Direction.RIGHT
        val post = pre.copy()
        applyClusterGravity(post, newGravity)
        val events = listOf(
            GameEvent.GravityRotated(newGravity),
            GameEvent.Settled(true),
        )
        val anim = BoardAnimator()
        anim.ingest(events, pre, Direction.DOWN, post, newGravity)
        anim.freezeAt(175)
        anim to renderOf(post, newGravity)
    }
    BoardCanvas({ state.second }, 0L, previewModifier, animator = state.first)
}

/**
 * SIÊU KHỐI tĩnh để soi fidelity với super-*.svg: hàng trên = cấp 1 (4 màu), hàng dưới = cấp 2,
 * ô cuối = khối cầu vồng. spin/pulse cố định ở mốc lấp lánh để xem viền màu + vương miện + tia.
 */
@Preview(name = "07 Super blocks — cấp 1/2 + rainbow", widthDp = 280, heightDp = 150)
@Composable
private fun SuperBlocksPreview() {
    Canvas(
        Modifier
            .fillMaxWidth()
            .aspectRatio(280f / 150f)
            .background(JellyTheme.bg),
    ) {
        val blockSize = size.height * 0.34f
        val slotW = size.width / 5f
        val rowH = size.height / 2f
        val cr = CornerRadius(blockSize * CORNER_FRAC, blockSize * CORNER_FRAC)
        val borderStroke = Stroke(blockSize * BORDER_FRAC)
        val palettes = arrayOf(JellyTheme.yellow, JellyTheme.mint, JellyTheme.pink, JellyTheme.blue)

        for (i in 0..3) {
            val left = i * slotW + (slotW - blockSize) / 2f
            // cấp 1 (hàng trên) + cấp 2 (hàng dưới)
            drawSuperJellyCell(
                left, (rowH - blockSize) / 2f, blockSize, cr, borderStroke,
                palettes[i], level = 1, dirX = 0f, dirY = 1f, pulse = 0.6f, spin = 0.12f,
            )
            drawSuperJellyCell(
                left, rowH + (rowH - blockSize) / 2f, blockSize, cr, borderStroke,
                palettes[i], level = 2, dirX = 0f, dirY = 1f, pulse = 1f, spin = 0.12f,
            )
        }
        // cột cuối: cầu vồng thường (dưới) + CẦU VỒNG SIÊU CẤP có vương miện (trên)
        val rbLeft = 4 * slotW + (slotW - blockSize) / 2f
        drawRainbowCell(rbLeft, rowH + (rowH - blockSize) / 2f, blockSize, cr, borderStroke, 0f, 1f)
        drawRainbowCell(
            rbLeft, (rowH - blockSize) / 2f, blockSize, cr, borderStroke, 0f, 1f,
            level = 2, pulse = 1f, spin = 0.12f,
        )
    }
}
