package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Khoá cơ chế chữ ký World 2 · DÂY LEO ([Vine]) — deterministic, bám `goal-system-v2.md §8`:
 * mọc từ tip theo thứ tự hướng cố định, bám cứng khi trọng lực, héo khi mất kết nối gốc, xoá dòng
 * qua gốc diệt cả dây, và VINE đếm vào dòng đầy.
 */
class VineTest {

    private fun vine(root: Boolean, color: JellyColor = JellyColor.MINT) =
        Grid.Cell(CellType.VINE, color, vineRoot = root)

    private fun block(color: JellyColor = JellyColor.YELLOW) = Grid.Cell(CellType.BLOCK, color)

    @Test
    fun `moc tu tip len tren (nguoc trong luc DOWN) va deterministic`() {
        val g = Grid()
        g.set(0, 8, vine(root = true))
        // Lần mọc 1: tip = gốc (0,8) → ngược trọng lực DOWN = UP → (0,7).
        val a1 = growVines(g, Direction.DOWN)
        assertEquals(listOf(Vec(0, 7)), a1)
        assertEquals(CellType.VINE, g.get(0, 7)?.type)
        assertFalse("đốt mới không phải gốc", g.get(0, 7)!!.vineRoot)
        // Lần mọc 2: tip = (0,7) → lên (0,6).
        val a2 = growVines(g, Direction.DOWN)
        assertEquals(listOf(Vec(0, 6)), a2)
    }

    @Test
    fun `moc theo thu tu phai khi tren bi chan`() {
        val g = Grid()
        g.set(0, 8, vine(root = true))
        g.set(0, 7, block())            // chặn hướng UP → thứ tự kế là PHẢI (rotateCCW của DOWN = RIGHT)
        val a = growVines(g, Direction.DOWN)
        assertEquals(listOf(Vec(1, 8)), a)
    }

    @Test
    fun `deterministic - cung dau vao cho cung ket qua`() {
        fun run(): List<Vec> {
            val g = Grid()
            g.set(4, 4, vine(root = true))
            val out = ArrayList<Vec>()
            repeat(3) { out += growVines(g, Direction.DOWN) }
            return out
        }
        assertEquals(run(), run())
    }

    @Test
    fun `bam cung - khong roi theo trong luc`() {
        val g = Grid()
        g.set(0, 0, vine(root = true))   // gốc lửng trên cao
        val moved = applyClusterGravity(g, Direction.DOWN)
        assertFalse("dây leo không rơi", moved)
        assertEquals(CellType.VINE, g.get(0, 0)?.type)
    }

    @Test
    fun `khoi thuong roi bi VINE chan lai`() {
        val g = Grid()
        g.set(0, 8, vine(root = true))   // vật cản ở đáy
        g.set(0, 5, block())             // khối thường phía trên
        applyClusterGravity(g, Direction.DOWN)
        assertEquals("khối dừng ngay trên dây", CellType.BLOCK, g.get(0, 7)?.type)
        assertEquals(CellType.VINE, g.get(0, 8)?.type)
    }

    @Test
    fun `dot mat ket noi goc thi kho heo`() {
        val g = Grid()
        g.set(0, 8, vine(root = true))
        g.set(0, 7, vine(root = false))
        g.set(0, 6, vine(root = false))
        g.set(0, 7, null)                // cắt giữa → (0,6) mất kết nối gốc
        val wilted = wiltDisconnectedVines(g)
        assertEquals(listOf(Vec(0, 6)), wilted)
        assertNull(g.get(0, 6))
        assertEquals("gốc còn nguyên", CellType.VINE, g.get(0, 8)?.type)
    }

    @Test
    fun `destroyVineOfRoot xoa ca day`() {
        val g = Grid()
        g.set(0, 8, vine(root = true))
        g.set(0, 7, vine(root = false))
        g.set(1, 8, vine(root = false))
        val gone = destroyVineOfRoot(g, Vec(0, 8))
        assertEquals(3, gone.size)
        assertNull(g.get(0, 8)); assertNull(g.get(0, 7)); assertNull(g.get(1, 8))
    }

    @Test
    fun `VINE dem vao dong day`() {
        val g = Grid()
        for (x in 0 until 8) g.set(x, 8, block())
        g.set(8, 8, vine(root = true))   // ô cuối là dây → hàng vẫn "đầy"
        assertTrue(findFullLines(g).rows.contains(8))
    }

    @Test
    fun `engine moc dung nhip vineGrowEveryN = 2`() {
        val dot = Piece(PieceLibrary.DOT, JellyColor.YELLOW)
        val engine = EndlessEngine(
            seed = 1,
            initialBudget = 0,
            tuning = EndlessTuning(vineGrowEveryN = 2),
            preset = listOf(Vec(0, 8) to Grid.Cell(CellType.VINE, JellyColor.MINT, vineRoot = true)),
            trayScript = listOf(listOf(dot, dot, dot)),
        )
        val t1 = engine.placePieceAt(0, 5, 0)
        assertFalse("lượt 1 chưa mọc", t1.any { it is GameEvent.VineGrew })
        val t2 = engine.placePieceAt(1, 6, 0)
        assertTrue("lượt 2 mọc", t2.any { it is GameEvent.VineGrew })
    }

    @Test
    fun `xoa dong qua goc - diet ca day + phat VineRootsCleared (can MINT)`() {
        val g = Grid()
        for (x in 0 until 7) g.set(x, 8, block(JellyColor.YELLOW))
        g.set(7, 8, block(JellyColor.MINT))     // ≥1 MINT → dòng đủ điều kiện phá gốc
        g.set(8, 8, vine(root = true))          // gốc nằm trên hàng 8
        g.set(8, 7, vine(root = false))         // đốt phía trên gốc
        val r = resolve(g, Direction.DOWN, startCombo = 0)
        val vrc = r.events.filterIsInstance<ResolveEvent.VineRootsCleared>()
        assertTrue("phải phát VineRootsCleared", vrc.isNotEmpty())
        assertEquals(1, vrc.first().roots.size)
        assertNull("đốt trên cũng tan", g.get(8, 7))
    }

    @Test
    fun `xoa dong qua goc KHONG MINT - goc song sot`() {
        val g = Grid()
        for (x in 0 until 8) g.set(x, 8, block(JellyColor.YELLOW))
        g.set(8, 8, vine(root = true))          // gốc nằm trên hàng 8
        g.set(8, 7, vine(root = false))
        val r = resolve(g, Direction.DOWN, startCombo = 0)
        val vrc = r.events.filterIsInstance<ResolveEvent.VineRootsCleared>()
        assertTrue("KHÔNG có MINT → gốc sống sót", vrc.isEmpty())
        assertEquals("gốc còn nguyên", CellType.VINE, g.get(8, 8)?.type)
    }
}
