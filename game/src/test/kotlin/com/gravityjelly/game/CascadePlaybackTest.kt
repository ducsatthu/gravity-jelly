package com.gravityjelly.game

import com.gravityjelly.core.CellType
import com.gravityjelly.core.Direction
import com.gravityjelly.core.GameEvent
import com.gravityjelly.core.Grid
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PieceLibrary
import com.gravityjelly.core.ResolveEvent
import com.gravityjelly.core.Vec
import com.gravityjelly.core.resolve
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * "Chạy thử" headless: dựng một combo cascade THẬT (qua :core resolve), nạp vào
 * [BoardAnimator], rồi bước đồng hồ sim và IN ra bàn hiển thị ([BoardAnimator.displayGrid])
 * tại từng mốc thời gian — để thấy combo chơi TUẦN TỰ: flash → rơi → flash → rơi.
 */
class CascadePlaybackTest {

    private fun blk(c: JellyColor) = Grid.Cell(CellType.BLOCK, c)

    /** ASCII một khung: chữ cái = màu, '.' = trống. */
    private fun ascii(grid: Grid): String {
        val sb = StringBuilder()
        for (y in 0 until Grid.SIZE) {
            for (x in 0 until Grid.SIZE) {
                val cell = grid.get(x, y)
                sb.append(
                    when {
                        cell == null -> '·'
                        cell.type == CellType.STONE -> '#'
                        else -> when (cell.color) {
                            JellyColor.YELLOW -> 'Y'
                            JellyColor.MINT -> 'M'
                            JellyColor.PINK -> 'P'
                            JellyColor.BLUE -> 'B'
                            null -> '?'
                        }
                    },
                )
                sb.append(' ')
            }
            sb.append('\n')
        }
        return sb.toString()
    }

    @Test
    fun cascade_plays_sequentially() {
        val A = JellyColor.YELLOW   // thân
        val B = JellyColor.BLUE     // cột rơi lấp khe col8

        // Bàn TRƯỚC khi đặt mảnh (gravity DOWN).
        val pre = Grid()
        for (x in 0..7) pre.set(x, 8, blk(A))   // hàng đáy thiếu col8
        for (x in 0..7) pre.set(x, 7, blk(A))   // hàng 7 thiếu col8
        // Phá đơn sắc: col0 của hàng 7/8 đổi màu B → hàng KHÔNG còn 1 màu nên hoàn tất sẽ
        // XÓA THƯỜNG (cascade), không hợp nhất thành siêu khối (luật mới: 9 ô cùng màu → siêu khối).
        pre.set(0, 8, blk(B)); pre.set(0, 7, blk(B))
        pre.set(7, 6, blk(A))                    // cầu nối để cột B "active"
        pre.set(8, 6, blk(B)); pre.set(8, 5, blk(B))  // cột B treo trên khe col8

        // Đặt mảnh 1 ô tại (8,8) → hoàn tất hàng đáy → kích combo dây chuyền.
        val placedCell = Vec(8, 8)
        val placed = pre.copy().also { it.set(placedCell.x, placedCell.y, blk(A)) }

        // Resolve THẬT từ :core → lấy chuỗi sự kiện + bàn cuối.
        val work = placed.copy()
        val result = resolve(work, Direction.DOWN, startCombo = 0)

        val clears = result.events.filterIsInstance<ResolveEvent.LinesCleared>()
        println("== Số nhịp xóa (cascade steps): ${clears.size} ==")
        clears.forEachIndexed { i, e ->
            println("   nhịp ${i + 1}: rows=${e.lines.rows} cols=${e.lines.cols} combo=×${e.comboLevel} +${e.score}đ")
        }
        assertTrue("Cần ≥2 nhịp để minh hoạ cascade tuần tự", clears.size >= 2)

        // Dựng GameEvent list (PiecePlaced + các LinesCleared) cho animator.
        val events = mutableListOf<GameEvent>()
        events.add(GameEvent.PiecePlaced(Piece(PieceLibrary.O4, A), listOf(placedCell)))
        clears.forEach { events.add(GameEvent.LinesCleared(it.lines, it.cellsCleared, it.comboLevel, it.score)) }

        val anim = BoardAnimator()
        val log = StringBuilder()
        anim.onClearStep = { combo -> log.append("        → FLASH nhịp xóa (combo=×$combo) + haptic\n") }
        anim.onComboBurst = { log.append("        → NỔ overlay combo ×${anim.comboBurstCombo} tại ô(${"%.1f".format(anim.comboBurstCellX)},${"%.1f".format(anim.comboBurstCellY)})\n") }

        anim.ingest(events, pre, Direction.DOWN, work, Direction.DOWN)

        // Bước đồng hồ sim ~60Hz, chụp khung tại các mốc thời gian (cadence ~850ms/nhịp).
        val snapshots = longArrayOf(0, 100, 300, 550, 700, 850, 1050, 1250, 1400, 1550, 1750)
        var elapsedMs = 0L
        var nextIdx = 0
        // mốc 0 (ngay sau ingest)
        fun dump(ms: Long) {
            println("\n--- t = ${ms}ms ---")
            val now = anim.renderNanos()
            val slideActive = (0 until Grid.SIZE).any { y ->
                (0 until Grid.SIZE).any { x -> anim.slideOffsetY(x, y, now) != 0f }
            }
            // tìm ô đang "nhão" nhất (squashY < 1) để chứng minh hiệu ứng nhún khi chạm đáy
            var minSquash = 1f; var sqx = -1; var sqy = -1
            for (y in 0 until Grid.SIZE) for (x in 0 until Grid.SIZE) {
                val s = anim.squashScaleY(x, y, now)
                if (s < minSquash) { minSquash = s; sqx = x; sqy = y }
            }
            val squashNote = if (minSquash < 0.999f) "  (NHÚN: ô($sqx,$sqy) squashY=${"%.3f".format(minSquash)})" else ""
            // ô đang "nhìn trọng lực" (per-cell settle > 0.5) — chỉ khối đang rơi/vừa tiếp đất
            val looking = mutableListOf<String>()
            for (y in 0 until Grid.SIZE) for (x in 0 until Grid.SIZE) {
                if ((anim.displayGrid ?: work).get(x, y) != null && anim.cellSettleFactor(x, y, now) > 0.5f) looking.add("($x,$y)")
            }
            println("displayGrid${if (slideActive) "  (đang RƠI: slide ≠ 0)" else ""}$squashNote:")
            print(ascii(anim.displayGrid ?: work))
            println("   mắt NHÌN TRỌNG LỰC: ${if (looking.isEmpty()) "(không ô nào — tất cả giữ tính cách)" else looking.joinToString(" ")}")
            if (log.isNotEmpty()) { print(log); log.clear() }
        }
        dump(0)
        nextIdx = 1
        while (nextIdx < snapshots.size) {
            anim.step(GameClock.STEP_NANOS)
            elapsedMs += GameClock.STEP_NANOS / 1_000_000L
            if (elapsedMs >= snapshots[nextIdx]) { dump(snapshots[nextIdx]); nextIdx++ }
        }
        println("\n== Bàn CUỐI (truth từ engine) ==")
        print(ascii(work))
    }
}
