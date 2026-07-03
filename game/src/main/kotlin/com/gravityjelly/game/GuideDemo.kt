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
import com.gravityjelly.core.JellyColor

/**
 * Mini-board TĨNH cho popup dạy luật / trang cẩm nang: vẽ một lưới nhỏ các khối jelly thật
 * (thường / siêu khối / cầu vồng / đá) bằng đúng draw-funcs của board ([drawJellyCell],
 * [drawSuperJellyCell], [drawRainbowCell], [drawStoneBlock]) nên người chơi nhận ra "vật thật".
 *
 * Đây là minh hoạ tĩnh (không game-loop): siêu khối/cầu vồng dùng [pulse]/[spin] cố định ở mốc
 * lấp lánh để thấy viền màu + vương miện + tia (giống @Preview "07 Super blocks"). Allocation-aware
 * như board: stroke/cr precompute một lần mỗi vẽ. Công khai để :app (GjGuide) tái dùng.
 */
enum class GuideCellKind { EMPTY, JELLY, SUPER1, SUPER2, RAINBOW, RAINBOW2, STONE, VINE, TRASH }

/** Một ô của mini-board minh hoạ. [color] bắt buộc cho JELLY/SUPER1/SUPER2 (mặc định vàng nếu thiếu). */
data class GuideCell(val kind: GuideCellKind, val color: JellyColor? = null)

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
                // khối
                for (y in 0 until rowN) {
                    val row = rows[y]
                    for (x in row.indices) {
                        val cell = row[x]
                        if (cell.kind == GuideCellKind.EMPTY) continue
                        val left = x * cellSize + gap / 2f
                        val top = y * cellSize + gap / 2f
                        drawGuideCell(cell, left, top, blockSize, cr, borderStroke)
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
                connectUp = true, connectDown = !isRoot)
        }
        GuideCellKind.TRASH -> drawDebrisCell(left, top, blockSize, cr, borderStroke)
    }
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
