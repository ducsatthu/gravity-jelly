package com.gravityjelly.game

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.core.CellType
import com.gravityjelly.core.Direction
import com.gravityjelly.core.Grid
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PieceLibrary
import com.gravityjelly.core.PlacementResult
import com.gravityjelly.core.Vec
import com.gravityjelly.core.findClusters
import com.gravityjelly.core.hardDrop

// JellyBlock của design KHÔNG vẽ số cụm trên board (game-screen.jsx/JellyBlock.jsx
// nhận `count` nhưng bỏ qua) — chỉ mắt + sticker. Bật cờ này nếu muốn hiện lại số.
private const val SHOW_CLUSTER_NUMBER = false
private const val NUMBER_Y_FRAC    = 0.62f
private const val NUMBER_SIZE_FRAC = 0.32f
private const val GHOST_FILL_ALPHA = 0.42f
private const val GHOST_EDGE_ALPHA = 0.75f

// Kích thước giếng lõm — đọc bởi lớp ráp màn (kể cả :app) để tính tọa độ lưới cho drag
const val BOARD_PAD_DP         = 5f   // padding trong giếng (board.jsx: pad=5 → lưới gần kín giếng)
internal const val BOARD_WELL_RADIUS_DP = 12f  // GjRadius.md

// Màu inset shadow — rgba(120,92,52,0.12) từ design token shadow-soft
private val INSET_SHADOW_COLOR = Color(0x1F785C34)

/**
 * Dữ liệu render "sống": holder mutate ngoài Compose, Canvas đọc MỖI FRAME qua [renderTick].
 * KHÔNG là Compose state → đổi ghost/grid khi kéo-thả không gây recompose lớp vỏ.
 * Một instance tái dùng → vẽ allocation-free.
 */
class BoardRender {
    var grid: Grid = Grid()
    var gravity: Direction = Direction.DOWN
    val clusterSizes: Array<IntArray> = Array(Grid.SIZE) { IntArray(Grid.SIZE) }
    var ghost: GhostPreview? = null

    // Highlight "thả xuống sẽ ăn điểm / merge" — holder populate KHI ghost đổi ô (không mỗi frame).
    // Vùng sẽ nổ vẽ như MỘT khu vực liền: [previewRegion] (index-truy cập) + [previewMask] tra ô-kề
    // O(1) khi vẽ chu vi (allocation-free). Rỗng = thả trơn, không sáng gì.
    var previewRegion: List<Vec> = emptyList()
    val previewMask = BooleanArray(Grid.SIZE * Grid.SIZE)

    // Đường BAO của vùng — mỗi phần tử là 1 contour kín (mảng điểm lưới encode py·(SIZE+1)+px, đã gộp
    // đỉnh thẳng hàng). Hỗ trợ MỌI hình: nhiều vùng rời, chữ thập, L, blob nổ super, cả lỗ thủng. Dải
    // viền chạy vẽ dọc từng contour. Trace bằng holder khi preview đổi (không mỗi frame).
    var previewLoops: List<IntArray> = emptyList()
}

/** Vị trí hard-drop preview của mảnh đang kéo (cells tính từ :core hardDrop). */
data class GhostPreview(val cells: List<Vec>, val color: JellyColor)

/**
 * Vẽ CẢ BÀN (giếng lõm + lưới 9×9 + khối jelly) trong MỘT Canvas (CLAUDE.md §chống giật).
 *
 * Canvas được giao kích thước GIẾNG ĐẦY ĐỦ (340dp vuông), bao gồm:
 * - Nền surface-sunken + viền cong 12dp + inset shadow bắt chước `inset 0 2px 6px rgba(120,92,52,0.12)`
 * - Padding [BOARD_PAD_DP] → lưới 9×9 nằm phía trong
 *
 * [render] trả về dữ liệu sống (đọc lại mỗi frame); [renderTick] bump theo vsync để vẽ lại.
 * Caller dùng [BOARD_PAD_DP] + vị trí Canvas để tính toạ độ lưới cho drag.
 */
@Composable
fun BoardCanvas(
    render: () -> BoardRender,
    renderTick: Long,
    modifier: Modifier = Modifier,
    animator: BoardAnimator? = null,
) {
    val density = LocalDensity.current.density
    val textMeasurer = rememberTextMeasurer()
    // Kết quả mắt tái dùng (mutate trong draw phase — KHÔNG cấp phát mỗi ô/mỗi frame).
    val eyeOut = remember { EyeRender() }

    // Precompute inset shadow brush — density không thay đổi runtime → remember 1 lần
    val insetShadowBrush = remember(density) {
        Brush.verticalGradient(
            colors = listOf(INSET_SHADOW_COLOR, Color.Transparent),
            startY = 0f,
            endY   = (2f + 6f) * density,  // CSS: offset 2px + blur 6px
        )
    }

    Canvas(modifier = modifier) {
        @Suppress("UNUSED_EXPRESSION") renderTick
        val r = render()
        // Trong lúc playback combo, animator chiếu grid trung gian (xóa → rơi → xóa …);
        // ngoài combo displayGrid = null ⇒ dùng grid cuối (truth) từ BoardRender.
        val grid = animator?.displayGrid ?: r.grid
        val gravity = r.gravity
        val clusterSizes = r.clusterSizes
        val ghost = r.ghost
        val previewRegion = r.previewRegion
        val previewMask = r.previewMask
        val previewLoops = r.previewLoops

        val n = Grid.SIZE
        val padPx = BOARD_PAD_DP * density
        val wellCr = CornerRadius(BOARD_WELL_RADIUS_DP * density)

        // ── 1. Giếng lõm: nền surface-sunken + inset shadow ────────────────
        drawRoundRect(JellyTheme.surfaceSunken, cornerRadius = wellCr)
        drawRoundRect(brush = insetShadowBrush, cornerRadius = wellCr)

        // ── 2. Lưới + khối — tất cả offset vào trong padPx ─────────────────
        translate(padPx, padPx) {

            val availPx = minOf(size.width, size.height) - padPx * 2
            val cellSize  = availPx / n
            val gap       = cellSize * GAP_FRAC
            val blockSize = cellSize - gap
            val cr        = CornerRadius(blockSize * CORNER_FRAC)
            val borderStroke = Stroke(width = blockSize * BORDER_FRAC)  // precompute 1 lần / frame
            val cellLineStroke = Stroke(width = density)               // 1px outline ô trống (design: inset 0 0 0 1px)

            val now      = animator?.renderNanos() ?: 0L
            val rotating = animator?.isRotating == true
            val eyeDirX  = if (rotating) animator!!.pupilX else gravity.dx.toFloat()
            val eyeDirY  = if (rotating) animator!!.pupilY else gravity.dy.toFloat()
            // settle cả-bàn: chỉ >0 khi vừa XOAY trọng lực (mọi khối định hướng lại). Cascade/đặt
            // mảnh dùng settle PER-CELL (chỉ khối đang rơi/vừa tiếp đất nhìn xuống) — lấy max bên dưới.
            val boardSettle = animator?.settleFactor(now) ?: 1f
            val tMs      = now / Anim.MS
            // nhịp thở quầng sáng siêu khối (idle ~1300ms, đồng bộ cả bàn) — 0→1→0 mượt
            val superPulse = run {
                val period = 1300L * Anim.MS
                val phase = (now % period).toFloat() / period
                0.5f - 0.5f * kotlin.math.cos(phase * 2f * Math.PI.toFloat())
            }
            // viền màu chạy quanh siêu khối: 0→1 tuyến tính, lặp mỗi ~2600ms (1 vòng/chu kỳ)
            val superSpin = run {
                val period = 2600L * Anim.MS
                (now % period).toFloat() / period
            }

            // ô trống: nền cell-empty + viền 1px cell-line từng ô (board.jsx — KHÔNG kẻ lưới liền)
            for (y in 0 until n) for (x in 0 until n) {
                val left = x * cellSize + gap / 2f
                val top  = y * cellSize + gap / 2f
                val off  = Offset(left, top)
                val sz   = Size(blockSize, blockSize)
                drawRoundRect(JellyTheme.cellEmpty, off, sz, cr)
                drawRoundRect(JellyTheme.cellLine, off, sz, cr, style = cellLineStroke)
            }

            // Block trong vùng sẽ nổ → khoác VIỀN LẤP LÁNH kiểu siêu khối (viền nhiều màu chạy).
            val regionActive = ghost != null && previewRegion.isNotEmpty()

            // ô đầy (áp slide offset + squash từ animator)
            for (y in 0 until n) for (x in 0 until n) {
                val cell = grid.get(x, y) ?: continue
                val ox   = (animator?.slideOffsetX(x, y, now) ?: 0f) * cellSize
                val oy   = (animator?.slideOffsetY(x, y, now) ?: 0f) * cellSize
                val left = x * cellSize + gap / 2f + ox
                val top  = y * cellSize + gap / 2f + oy
                when (cell.type) {
                    CellType.STONE -> drawStoneBlock(left, top, blockSize, cr, borderStroke)
                    CellType.BLOCK -> {
                        // Vùng preview: viền lấp lánh SAU LƯNG block (ló ra ngoài mép, mặt block vẫn sạch).
                        if (regionActive && previewMask[y * n + x]) drawShimmerBorder(left, top, blockSize, superSpin)
                        val eyeColor = cell.color ?: JellyColor.YELLOW   // cầu vồng (color null) → mắt trung tính
                        val palette = JellyTheme.forColor(eyeColor)
                        val cs      = clusterSizes[y][x]
                        // Mắt "sống": chỉ khối đang rơi/vừa tiếp đất (per-cell) hoặc cả bàn khi xoay
                        // mới nhìn trọng lực; còn lại giữ tính cách theo màu.
                        val settle  = if (animator != null) maxOf(boardSettle, animator.cellSettleFactor(x, y, now)) else 1f
                        resolveBoardEye(eyeOut, eyeColor, x, y, tMs, settle, eyeDirX, eyeDirY)
                        val sqX = animator?.squashScaleX(x, y, now) ?: 1f
                        val sqY = animator?.squashScaleY(x, y, now) ?: 1f
                        val clp = animator?.clearProgress(x, y, now) ?: 0f
                        // KHÔNG gộp cụm — vẽ từng khối jelly riêng (bản cũ; xem memory)
                        when {
                            cell.isRainbow -> drawRainbowCell(
                                left, top, blockSize, cr, borderStroke,
                                eyeOut.dirX, eyeOut.dirY,
                                expression = eyeOut.expression, eyeOpen = eyeOut.open,
                                squashScaleX = sqX, squashScaleY = sqY, clearProgress = clp,
                                level = cell.superLevel, pulse = superPulse, spin = superSpin,
                            )
                            cell.isSuper -> drawSuperJellyCell(
                                left, top, blockSize, cr, borderStroke,
                                palette, cell.superLevel, eyeOut.dirX, eyeOut.dirY,
                                expression = eyeOut.expression, eyeOpen = eyeOut.open,
                                squashScaleX = sqX, squashScaleY = sqY, clearProgress = clp,
                                pulse = superPulse, spin = superSpin,
                            )
                            else -> drawJellyCell(
                                left, top, blockSize, cr, borderStroke,
                                palette, eyeColor, eyeOut.dirX, eyeOut.dirY,
                                expression    = eyeOut.expression,
                                eyeOpen       = eyeOut.open,
                                squashScaleX  = sqX,
                                squashScaleY  = sqY,
                                clearProgress = clp,
                            )
                        }
                        if (SHOW_CLUSTER_NUMBER && cs >= 2) drawNumber(textMeasurer, cs, left, top, blockSize)
                    }
                    else -> {}
                }
            }

            // highlight "sẽ ăn điểm / merge": DẢI VIỀN NHIỀU MÀU CHẠY bám ĐƯỜNG BAO thật của vùng (mọi
            // hình: nhiều vùng rời, chữ thập, L, blob nổ). Vẽ TRÊN block để dải liền mạch, không bị che.
            for (i in previewLoops.indices) {
                drawRegionLoop(previewLoops[i], cellSize, blockSize, superSpin)
            }

            // ghost preview (điểm rơi)
            if (ghost != null) {
                val palette = JellyTheme.forColor(ghost.color)
                val cells   = ghost.cells
                for (i in cells.indices) {
                    val v    = cells[i]
                    val left = v.x * cellSize + gap / 2f
                    val top  = v.y * cellSize + gap / 2f
                    drawRoundRect(palette.fill.copy(alpha = GHOST_FILL_ALPHA), Offset(left, top), Size(blockSize, blockSize), cr)
                    drawRoundRect(palette.edge.copy(alpha = GHOST_EDGE_ALPHA), Offset(left, top), Size(blockSize, blockSize), cr, style = borderStroke)
                }
            }

            // lớp hiệu ứng (clearing + particle + popup) — cùng MỘT Canvas, cùng translate
            animator?.drawOverlays(this, cellSize, gap, textMeasurer, now)
        }
    }
}

/**
 * Vẽ highlight cho CẢ VÙNG [cells] (các ô sẽ nổ khi thả) như MỘT khu vực liền, màu [palette] của mảnh.
 * KHÔNG tô fill phủ ô (giữ block SÁNG NGUYÊN, không làm mờ) — chỉ HÀO QUANG VIỀN quanh chu vi:
 * cạnh nào KHÔNG giáp ô cùng vùng (tra [mask]) thì vẽ, chồng 3 lớp từ quầng rộng-mờ → nét sắc để tạo
 * glow toả. Quầng dùng `shine` (màu SÁNG → thêm ánh sáng, không làm tối block); nét sắc dùng `fill`
 * (đúng màu mảnh, nổi trên cả nền kem lẫn block). StrokeCap.Round bo góc + trám mối nối.
 * Allocation-nhẹ: tra mask O(1) (không dựng set/frame), Offset value-class, Color.copy inline.
 */
// Scratch Path dựng lại mỗi contour (reset, không cấp phát Path mới) — vẽ 1 luồng nên an toàn.
private val regionLoopPath = Path()

/**
 * Dải viền nhiều màu chạy dọc MỘT contour [loop] (mảng điểm lưới encode py·(SIZE+1)+px, đã gộp đỉnh
 * thẳng hàng). Dựng Path bo góc (bán kính = cellSize·CORNER_FRAC, kẹp ≤ nửa cạnh ngắn nhất) rồi chạy
 * dash 2 lớp bloom + sắc. Bám đúng đường bao mọi hình (chữ thập/L/blob nổ).
 */
private fun DrawScope.drawRegionLoop(loop: IntArray, cellSize: Float, blockSize: Float, spin: Float) {
    val m = loop.size
    if (m < 3) return
    val p = Grid.SIZE + 1
    val radius = cellSize * CORNER_FRAC
    val path = regionLoopPath
    path.reset()
    var perim = 0f
    for (i in 0 until m) {
        val prev = loop[(i - 1 + m) % m]; val curr = loop[i]; val next = loop[(i + 1) % m]
        val cx = (curr % p) * cellSize; val cy = (curr / p) * cellSize
        val px = (prev % p) * cellSize; val py = (prev / p) * cellSize
        val nx = (next % p) * cellSize; val ny = (next / p) * cellSize
        val inLen  = kotlin.math.hypot(cx - px, cy - py)
        val outLen = kotlin.math.hypot(nx - cx, ny - cy)
        val r = minOf(radius, inLen * 0.5f, outLen * 0.5f)
        val entryX = cx - (cx - px) / inLen * r;  val entryY = cy - (cy - py) / inLen * r
        val exitX  = cx + (nx - cx) / outLen * r; val exitY  = cy + (ny - cy) / outLen * r
        if (i == 0) path.moveTo(entryX, entryY) else path.lineTo(entryX, entryY)
        path.quadraticBezierTo(cx, cy, exitX, exitY)
        perim += outLen
    }
    path.close()
    drawRunningPath(path, perim, blockSize * 0.16f, spin, 0.42f)
    drawRunningPath(path, perim, blockSize * 0.06f, spin, 0.98f)
}

/** Tính kích thước cụm chứa mỗi ô vào [out] (tái dùng mảng; gọi khi grid đổi, KHÔNG mỗi frame). */
internal fun fillClusterSizes(grid: Grid, out: Array<IntArray>) {
    for (y in 0 until Grid.SIZE) for (x in 0 until Grid.SIZE) out[y][x] = 0
    val clusters = findClusters(grid)
    for (ci in clusters.indices) {
        val cluster = clusters[ci]
        val sizeC   = cluster.size
        for (i in cluster.indices) {
            val v = cluster[i]
            out[v.y][v.x] = sizeC
        }
    }
}

private fun DrawScope.drawNumber(
    measurer: TextMeasurer, number: Int,
    left: Float, top: Float, blockSize: Float,
) {
    val fontSizeSp = (blockSize * NUMBER_SIZE_FRAC / density).sp
    val style  = TextStyle(
        color      = JellyTheme.textOnBlock,
        fontSize   = fontSizeSp,
        fontWeight = FontWeight.Bold,
    )
    val layout = measurer.measure(number.toString(), style)
    val tx = left + (blockSize - layout.size.width) / 2f
    val ty = top  + blockSize * NUMBER_Y_FRAC - layout.size.height / 2f
    drawText(layout, topLeft = Offset(tx, ty))
}

// ── preview ──────────────────────────────────────────────────────────────────

@Preview(name = "BoardCanvas — giếng lõm + ghost", widthDp = 340, heightDp = 340)
@Composable
private fun BoardCanvasPreview() {
    val render = remember { sampleRender(withGhost = true) }
    BoardCanvas(
        render      = { render },
        renderTick  = 0L,
        modifier    = Modifier
            .fillMaxWidth()
            .aspectRatio(1f),
    )
}

@Preview(name = "BoardCanvas — trống", widthDp = 340, heightDp = 340)
@Composable
private fun BoardCanvasEmptyPreview() {
    val render = remember { BoardRender().also { it.gravity = Direction.DOWN } }
    BoardCanvas(
        render     = { render },
        renderTick = 0L,
        modifier   = Modifier
            .fillMaxWidth()
            .aspectRatio(1f),
    )
}

internal fun sampleRender(withGhost: Boolean): BoardRender {
    val grid = Grid()
    fun b(c: JellyColor) = Grid.Cell(CellType.BLOCK, c)
    val s = Grid.Cell(CellType.STONE)

    grid.set(0, 8, b(JellyColor.YELLOW)); grid.set(1, 8, b(JellyColor.YELLOW))
    grid.set(2, 8, b(JellyColor.MINT));   grid.set(3, 8, b(JellyColor.MINT))
    grid.set(4, 8, b(JellyColor.MINT));   grid.set(6, 8, s)
    grid.set(7, 8, b(JellyColor.PINK));   grid.set(8, 8, b(JellyColor.PINK))

    grid.set(0, 7, b(JellyColor.YELLOW)); grid.set(1, 7, b(JellyColor.MINT))
    grid.set(2, 7, b(JellyColor.MINT));   grid.set(6, 7, s)
    grid.set(7, 7, b(JellyColor.BLUE));   grid.set(8, 7, b(JellyColor.PINK))

    grid.set(0, 6, b(JellyColor.YELLOW)); grid.set(7, 6, b(JellyColor.BLUE))
    grid.set(8, 6, b(JellyColor.BLUE))

    val r = BoardRender()
    r.grid    = grid
    r.gravity = Direction.DOWN
    fillClusterSizes(grid, r.clusterSizes)

    if (withGhost) {
        val piece = Piece(PieceLibrary.L3_0, JellyColor.BLUE)
        val res   = hardDrop(grid, piece, lateralIndex = 3, gravity = Direction.DOWN)
        if (res is PlacementResult.Success) r.ghost = GhostPreview(res.cells, piece.color)
    }
    return r
}
