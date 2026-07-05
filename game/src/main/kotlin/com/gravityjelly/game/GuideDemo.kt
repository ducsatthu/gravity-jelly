package com.gravityjelly.game

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.gravityjelly.core.Direction
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Vec
import com.gravityjelly.core.WaterSource

/**
 * Mini-board TĨNH cho popup dạy luật / trang cẩm nang: vẽ một lưới nhỏ các khối jelly thật
 * (thường / siêu khối / cầu vồng / đá) bằng đúng draw-funcs của board ([drawJellyCell],
 * [drawSuperJellyCell], [drawRainbowCell], [drawStoneBlock]) nên người chơi nhận ra "vật thật".
 *
 * Đây là minh hoạ tĩnh (không game-loop): siêu khối/cầu vồng dùng [pulse]/[spin] cố định ở mốc
 * lấp lánh để thấy viền màu + vương miện + tia (giống @Preview "07 Super blocks"). Allocation-aware
 * như board: stroke/cr precompute một lần mỗi vẽ. Công khai để :app (GjGuide) tái dùng.
 */
enum class GuideCellKind {
    EMPTY, JELLY, SUPER1, SUPER2, RAINBOW, RAINBOW2, STONE, VINE, TRASH,
    WATER_SOURCE, WATER_FLOW, WATER_DROP, WATER_BROKEN, // World 3 · Dòng chảy
}

/**
 * Một ô của mini-board minh hoạ. [color] bắt buộc cho JELLY/SUPER1/SUPER2 (mặc định vàng nếu thiếu).
 * [dir] = hướng chảy cho ô nước ([WATER_SOURCE]/[WATER_FLOW]); mặc định phải.
 */
data class GuideCell(val kind: GuideCellKind, val color: JellyColor? = null, val dir: Direction? = null)

// ── shorthand dựng layout gọn ───────────────────────────────────────────────────
val gEmpty = GuideCell(GuideCellKind.EMPTY)
val gStone = GuideCell(GuideCellKind.STONE)
val gRainbow = GuideCell(GuideCellKind.RAINBOW)
val gRainbow2 = GuideCell(GuideCellKind.RAINBOW2)
fun gJelly(c: JellyColor) = GuideCell(GuideCellKind.JELLY, c)
fun gSuper1(c: JellyColor) = GuideCell(GuideCellKind.SUPER1, c)
fun gSuper2(c: JellyColor) = GuideCell(GuideCellKind.SUPER2, c)
val gVineRoot = GuideCell(GuideCellKind.VINE, JellyColor.MINT)
val gVine = GuideCell(GuideCellKind.VINE, null)
val gTrash = GuideCell(GuideCellKind.TRASH)
fun gWaterSource(dir: Direction = Direction.RIGHT) = GuideCell(GuideCellKind.WATER_SOURCE, dir = dir)
fun gWaterFlow(dir: Direction = Direction.RIGHT) = GuideCell(GuideCellKind.WATER_FLOW, dir = dir)
val gWaterDrop = GuideCell(GuideCellKind.WATER_DROP)
val gWaterBroken = GuideCell(GuideCellKind.WATER_BROKEN)

// mốc lấp lánh cố định (siêu khối/cầu vồng) — bám @Preview "07 Super blocks"
private const val GUIDE_PULSE = 0.7f
private const val GUIDE_SPIN = 0.12f

/**
 * Vẽ mini-board từ [rows] (mỗi hàng là danh sách [GuideCell]; các hàng có thể lệch độ dài — coi như
 * ô trống). Tự đặt aspect-ratio theo số cột/hàng; [modifier] thường chỉ cần định bề rộng.
 */
@Composable
fun GuideMiniBoard(
    rows: List<List<GuideCell>>,
    modifier: Modifier = Modifier,
) {
    val cols = rows.maxOf { it.size }
    val rowN = rows.size
    Canvas(
        modifier
            .fillMaxWidth()
            .aspectRatio(cols.toFloat() / rowN.toFloat()),
    ) {
        val padPx = 4f * density
        val wellCr = CornerRadius(10f * density)
        drawRoundRect(JellyTheme.surfaceSunken, cornerRadius = wellCr)

        translate(padPx, padPx) {
            val availW = size.width - padPx * 2
            val availH = size.height - padPx * 2
            val cellSize = minOf(availW / cols, availH / rowN)
            val gap = cellSize * GAP_FRAC
            val blockSize = cellSize - gap
            val cr = CornerRadius(blockSize * CORNER_FRAC)
            val borderStroke = Stroke(width = blockSize * BORDER_FRAC)
            val cellLineStroke = Stroke(width = density)

            // canh giữa lưới trong vùng khả dụng (board có thể không khít hết)
            val offX = (availW - cellSize * cols) / 2f
            val offY = (availH - cellSize * rowN) / 2f
            translate(offX, offY) {
                // ô trống: nền + viền 1px (như board)
                for (y in 0 until rowN) for (x in 0 until cols) {
                    val left = x * cellSize + gap / 2f
                    val top = y * cellSize + gap / 2f
                    drawRoundRect(JellyTheme.cellEmpty, Offset(left, top), Size(blockSize, blockSize), cr)
                    drawRoundRect(JellyTheme.cellLine, Offset(left, top), Size(blockSize, blockSize), cr, style = cellLineStroke)
                }
                // World 3: vẽ NƯỚC thành DẢI LIỀN (như in-game, drawWaterRibbon) thay vì tile rời.
                drawGuideWaterRibbon(rows, rowN, cols, cellSize, blockSize, cr)

                // khối
                fun vineAt(cx: Int, cy: Int): Boolean {
                    if (cy < 0 || cy >= rowN || cx < 0) return false
                    val r = rows[cy]
                    return cx < r.size && r[cx].kind == GuideCellKind.VINE
                }
                for (y in 0 until rowN) {
                    val row = rows[y]
                    for (x in row.indices) {
                        val cell = row[x]
                        if (cell.kind == GuideCellKind.EMPTY) continue
                        val left = x * cellSize + gap / 2f
                        val top = y * cellSize + gap / 2f
                        drawGuideCell(
                            cell, left, top, blockSize, cr, borderStroke,
                            vineUp = vineAt(x, y - 1), vineDown = vineAt(x, y + 1),
                            vineLeft = vineAt(x - 1, y), vineRight = vineAt(x + 1, y),
                        )
                    }
                }
            }
        }
    }
}

private fun DrawScope.drawGuideCell(
    cell: GuideCell,
    left: Float, top: Float, blockSize: Float,
    cr: CornerRadius, borderStroke: Stroke,
    vineUp: Boolean = false, vineDown: Boolean = false,
    vineLeft: Boolean = false, vineRight: Boolean = false,
) {
    when (cell.kind) {
        GuideCellKind.EMPTY -> {}
        GuideCellKind.STONE -> drawStoneBlock(left, top, blockSize, cr, borderStroke)
        GuideCellKind.JELLY -> {
            val color = cell.color ?: JellyColor.YELLOW
            drawJellyCell(left, top, blockSize, cr, borderStroke, JellyTheme.forColor(color), color, 0f, 1f)
        }
        GuideCellKind.SUPER1 -> {
            val color = cell.color ?: JellyColor.YELLOW
            drawSuperJellyCell(
                left, top, blockSize, cr, borderStroke,
                JellyTheme.forColor(color), level = 1, dirX = 0f, dirY = 1f,
                pulse = GUIDE_PULSE, spin = GUIDE_SPIN,
            )
        }
        GuideCellKind.SUPER2 -> {
            val color = cell.color ?: JellyColor.YELLOW
            drawSuperJellyCell(
                left, top, blockSize, cr, borderStroke,
                JellyTheme.forColor(color), level = 2, dirX = 0f, dirY = 1f,
                pulse = GUIDE_PULSE, spin = GUIDE_SPIN,
            )
        }
        GuideCellKind.RAINBOW -> drawRainbowCell(
            left, top, blockSize, cr, borderStroke, 0f, 1f,
            level = 0, pulse = GUIDE_PULSE, spin = GUIDE_SPIN,
        )
        GuideCellKind.RAINBOW2 -> drawRainbowCell(
            left, top, blockSize, cr, borderStroke, 0f, 1f,
            level = 2, pulse = GUIDE_PULSE, spin = GUIDE_SPIN,
        )
        GuideCellKind.VINE -> {
            val isRoot = cell.color != null
            drawVineCell(left, top, blockSize, cr, borderStroke, root = isRoot,
                connectUp = vineUp, connectDown = vineDown,
                connectLeft = vineLeft, connectRight = vineRight)
        }
        GuideCellKind.TRASH -> drawDebrisCell(left, top, blockSize, cr, borderStroke)
        // Nước vẽ thành DẢI LIỀN ở [drawGuideWaterRibbon] (bỏ qua per-ô).
        GuideCellKind.WATER_SOURCE, GuideCellKind.WATER_FLOW, GuideCellKind.WATER_BROKEN -> {}
        GuideCellKind.WATER_DROP -> drawWaterDropTarget(left, top, blockSize, cr, now = 0L)
    }
}

/**
 * Vẽ nước của mini-board thành **DẢI LIỀN** (giống in-game): gom ô nguồn ([GuideCellKind.WATER_SOURCE]
 * hoặc [GuideCellKind.WATER_BROKEN]) + các ô [GuideCellKind.WATER_FLOW] kề nhau (BFS → thứ tự cây) rồi
 * gọi [drawWaterRibbon]. Toạ độ ô khớp GuideMiniBoard (tâm = (x+0.5)·cellSize). Tĩnh (now=0L).
 */
private fun DrawScope.drawGuideWaterRibbon(
    rows: List<List<GuideCell>>, rowN: Int, cols: Int, cellSize: Float, blockSize: Float, cr: CornerRadius,
) {
    fun kindAt(x: Int, y: Int): GuideCellKind? {
        if (y < 0 || y >= rowN || x < 0) return null
        val r = rows[y]; return if (x < r.size) r[x].kind else null
    }
    var src: Vec? = null; var broken = false
    loop@ for (y in 0 until rowN) for (x in 0 until cols) when (kindAt(x, y)) {
        GuideCellKind.WATER_SOURCE -> { src = Vec(x, y); broken = false; break@loop }
        GuideCellKind.WATER_BROKEN -> { src = Vec(x, y); broken = true; break@loop }
        else -> {}
    }
    val s = src ?: return
    val flow = ArrayList<Vec>()
    if (!broken) {
        val seen = HashSet<Int>(); seen.add(s.y * 100 + s.x)
        val queue = ArrayDeque<Vec>(); queue.add(s)
        while (queue.isNotEmpty()) {
            val c = queue.removeFirst()
            for (d in arrayOf(Vec(c.x, c.y + 1), Vec(c.x - 1, c.y), Vec(c.x + 1, c.y), Vec(c.x, c.y - 1))) {
                if (kindAt(d.x, d.y) == GuideCellKind.WATER_FLOW && seen.add(d.y * 100 + d.x)) {
                    flow.add(d); queue.add(d)
                }
            }
        }
    }
    drawWaterRibbon(WaterSource(0, s, active = !broken, broken = broken, flow = flow), cellSize, blockSize, cr, 0L)
}

// ── preview ──────────────────────────────────────────────────────────────────

@Preview(name = "GuideMiniBoard — atoms", widthDp = 220, heightDp = 220)
@Composable
private fun GuideMiniBoardPreview() {
    Row(
        Modifier.fillMaxWidth().background(JellyTheme.bg).padding(8.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        GuideMiniBoard(
            rows = listOf(
                listOf(gJelly(JellyColor.YELLOW), gJelly(JellyColor.YELLOW), gJelly(JellyColor.YELLOW)),
                listOf(gJelly(JellyColor.YELLOW), gSuper1(JellyColor.YELLOW), gJelly(JellyColor.YELLOW)),
                listOf(gJelly(JellyColor.YELLOW), gJelly(JellyColor.YELLOW), gJelly(JellyColor.YELLOW)),
            ),
            modifier = Modifier.weight(1f),
        )
        GuideMiniBoard(
            rows = listOf(
                listOf(gEmpty, gRainbow, gEmpty),
                listOf(gSuper2(JellyColor.MINT), gEmpty, gRainbow2),
                listOf(gStone, gEmpty, gJelly(JellyColor.PINK)),
            ),
            modifier = Modifier.weight(1f),
        )
    }
}
