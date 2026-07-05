package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/** Cơ chế Dòng chảy World 3 (redesign v5): nguồn ở top, chảy XUỐNG, rẽ TRÁI-trước, đẩy đoàn tàu. */
class WaterFlowTest {

    private fun block(color: JellyColor = JellyColor.YELLOW) = Grid.Cell(CellType.BLOCK, color)
    private fun stone() = Grid.Cell(CellType.STONE)

    /** Nguồn tại [pos] (top), đã gắn sàn WATER_SOURCE lên grid (như level seed). */
    private fun seed(grid: Grid, id: Int, pos: Vec, maxLength: Int = 8): WaterSource {
        grid.setEffect(pos.x, pos.y, CellEffect.WATER_SOURCE)
        return WaterSource(id = id, pos = pos, maxLength = maxLength)
    }

    // ---------------- growWaterFlow (xuống + rẽ) ----------------

    @Test
    fun `moc dung 1 o xuong duoi moi luot`() {
        val g = Grid()
        var s = seed(g, 1, Vec(4, 0))
        val r1 = growWaterFlow(g, listOf(s)); s = r1.sources[0]
        assertEquals(listOf(Vec(4, 1)), r1.newCells)
        assertEquals(CellEffect.WATER_FLOW, g.effect(4, 1))
        assertEquals(listOf(Vec(4, 1)), s.flow)

        val r2 = growWaterFlow(g, listOf(s)); s = r2.sources[0]
        assertEquals(listOf(Vec(4, 2)), r2.newCells)
        assertEquals(listOf(Vec(4, 1), Vec(4, 2)), s.flow)
    }

    @Test
    fun `dong ket thuc khi cham hang day`() {
        val g = Grid()
        var s = seed(g, 1, Vec(3, 7))
        s = growWaterFlow(g, listOf(s)).sources[0] // -> (3,8) hàng đáy
        assertEquals(listOf(Vec(3, 8)), s.flow)
        val r = growWaterFlow(g, listOf(s)) // ngọn ở đáy → KẾT THÚC (không rẽ ngang)
        assertTrue("dòng dừng ở đáy, không snake ngang", r.newCells.isEmpty())
    }

    @Test
    fun `moc snake xuong tan day (khong gioi han do dai)`() {
        val g = Grid()
        var s = seed(g, 1, Vec(4, 0)) // cột trống → chảy thẳng xuống tới đáy
        repeat(12) { s = growWaterFlow(g, listOf(s)).sources[0] }
        assertEquals("mọc đủ 8 ô tới hàng đáy", 8, s.flow.size)
        assertEquals("ngọn ở hàng đáy", Vec(4, 8), s.flow.last())
    }

    @Test
    fun `moc DON jelly xuong (frontier push) roi lan vao`() {
        val g = Grid()
        g.set(4, 1, block()) // jelly ngay dưới nguồn
        val s = seed(g, 1, Vec(4, 0))
        val r = growWaterFlow(g, listOf(s))
        assertEquals("nước lấn vào ô vừa dồn", listOf(Vec(4, 1)), r.newCells)
        assertEquals("jelly bị dồn xuống (4,2)", CellType.BLOCK, g.get(4, 2)?.type)
        assertEquals("ô (4,1) thành kênh nước", CellEffect.WATER_FLOW, g.effect(4, 1))
        assertEquals("phát move dồn", listOf(Vec(4, 1) to Vec(4, 2)), r.pushes)
    }

    @Test
    fun `dồn het ve day roi nuoc re`() {
        val g = Grid()
        for (y in 1..8) g.set(4, y, block()) // cột 4 đầy jelly tới đáy → không dồn được
        val s = seed(g, 1, Vec(4, 0))
        val r = growWaterFlow(g, listOf(s))
        assertEquals("đoàn chạm đáy → nước RẼ trái", listOf(Vec(3, 0)), r.newCells)
        assertTrue("không dồn được", r.pushes.isEmpty())
    }

    @Test
    fun `nhanh - re quanh da roi tach 2 nhanh xuong day`() {
        val g = Grid()
        g.set(4, 1, stone()) // chặn ngay dưới nguồn → nước phải rẽ & tách nhánh
        var s = seed(g, 1, Vec(4, 0))
        repeat(30) { s = growWaterFlow(g, listOf(s)).sources[0] }
        assertEquals("nhánh TRÁI chảy tới đáy", CellEffect.WATER_FLOW, g.effect(3, 8))
        assertEquals("nhánh PHẢI chảy tới đáy", CellEffect.WATER_FLOW, g.effect(5, 8))
    }

    @Test
    fun `khong lan ngang tren ban trong (1 cot thang)`() {
        val g = Grid()
        var s = seed(g, 1, Vec(4, 0))
        repeat(30) { s = growWaterFlow(g, listOf(s)).sources[0] }
        // chỉ cột 4 có nước; không tràn sang cột 3/5
        for (y in 1..8) assertEquals(CellEffect.WATER_FLOW, g.effect(4, y))
        for (y in 0..8) { assertEquals(CellEffect.NONE, g.effect(3, y)); assertEquals(CellEffect.NONE, g.effect(5, y)) }
    }

    @Test
    fun `re trai cung DON toa theo huong trai`() {
        val g = Grid()
        g.set(4, 1, stone())               // xuống bị đá chặn → rẽ trái
        g.set(3, 0, block(JellyColor.PINK)) // ô trái có jelly
        // (2,0) trống → dồn jelly trái sang (2,0), nước lấn (3,0)
        val s = seed(g, 1, Vec(4, 0))
        val r = growWaterFlow(g, listOf(s))
        assertEquals("nước lấn ô trái vừa dồn", listOf(Vec(3, 0)), r.newCells)
        assertEquals("jelly bị dồn sang TRÁI", CellType.BLOCK, g.get(2, 0)?.type)
        assertEquals(listOf(Vec(3, 0) to Vec(2, 0)), r.pushes)
    }

    @Test
    fun `re trai khi o duoi bi da chan`() {
        val g = Grid()
        g.set(4, 1, stone())
        val s = seed(g, 1, Vec(4, 0))
        val (next, cell) = growSource(g, s)
        assertEquals(Vec(3, 0), cell)
        assertEquals(listOf(Vec(3, 0)), next.flow)
    }

    @Test
    fun `re phai khi ca duoi va trai bi chan`() {
        val g = Grid()
        g.set(4, 1, stone()); g.set(3, 0, stone()) // dưới + trái đều chặn
        val s = seed(g, 1, Vec(4, 0))
        val (_, cell) = growSource(g, s)
        assertEquals("hết trái → rẽ phải", Vec(5, 0), cell)
    }

    @Test
    fun `bi cả 3 huong thi khong moc`() {
        val g = Grid()
        g.set(4, 1, stone()); g.set(3, 0, stone()); g.set(5, 0, stone())
        val s = seed(g, 1, Vec(4, 0))
        val (next, cell) = growSource(g, s)
        assertNull(cell)
        assertTrue(next.flow.isEmpty())
    }

    // ---------------- pushJellyByFlow (đoàn tàu, xuống) ----------------

    @Test
    fun `day 1 jelly tren kenh xuong 1 o`() {
        val g = Grid()
        val s = seed(g, 1, Vec(4, 0)).copy(flow = listOf(Vec(4, 1), Vec(4, 2)))
        g.setEffect(4, 1, CellEffect.WATER_FLOW); g.setEffect(4, 2, CellEffect.WATER_FLOW)
        g.set(4, 2, block(JellyColor.PINK)) // jelly trên kênh
        assertTrue(pushJellyByFlow(g, listOf(s)).isNotEmpty())
        assertNull("ô cũ trống", g.get(4, 2))
        assertEquals("đẩy xuống 1 ô", CellType.BLOCK, g.get(4, 3)?.type)
        assertEquals("sàn nước KHÔNG dời", CellEffect.WATER_FLOW, g.effect(4, 2))
    }

    @Test
    fun `doan tau 2 khoi troi cung`() {
        val g = Grid()
        val s = seed(g, 1, Vec(4, 0)).copy(flow = listOf(Vec(4, 1), Vec(4, 2)))
        g.setEffect(4, 1, CellEffect.WATER_FLOW); g.setEffect(4, 2, CellEffect.WATER_FLOW)
        g.set(4, 1, block(JellyColor.MINT)); g.set(4, 2, block(JellyColor.MINT))
        assertTrue(pushJellyByFlow(g, listOf(s)).isNotEmpty())
        assertNull("đầu đoàn dời đi", g.get(4, 1))
        assertEquals(CellType.BLOCK, g.get(4, 2)?.type)
        assertEquals(CellType.BLOCK, g.get(4, 3)?.type)
    }

    @Test
    fun `nap thach NUOC (BLUE) o lai tren nguon`() {
        val g = Grid()
        val s = seed(g, 1, Vec(4, 0)).copy(flow = listOf(Vec(4, 1)))
        g.setEffect(4, 1, CellEffect.WATER_FLOW)
        g.set(4, 0, block(JellyColor.BLUE)) // nắp THẠCH NƯỚC trên ô nguồn → giữ
        g.set(4, 1, block(JellyColor.PINK)) // trên kênh
        pushJellyByFlow(g, listOf(s))
        assertEquals("nắp thạch nước Ở LẠI", JellyColor.BLUE, g.get(4, 0)?.color)
        assertNull("khối trên kênh trôi đi", g.get(4, 1))
        assertEquals(CellType.BLOCK, g.get(4, 2)?.type)
    }

    @Test
    fun `nap KHAC MAU tren nguon cung troi theo dong`() {
        val g = Grid()
        val s = seed(g, 1, Vec(4, 0)).copy(flow = listOf(Vec(4, 1)))
        g.setEffect(4, 1, CellEffect.WATER_FLOW)
        g.set(4, 0, block(JellyColor.YELLOW)) // KHÔNG phải thạch nước → trôi
        assertTrue(pushJellyByFlow(g, listOf(s)).isNotEmpty())
        assertNull("nắp khác màu trôi khỏi nguồn", g.get(4, 0))
        assertEquals("trôi xuống ô kênh", JellyColor.YELLOW, g.get(4, 1)?.color)
    }

    @Test
    fun `drift bi chan xuong thi DUNG YEN (khong tu re)`() {
        val g = Grid()
        val s = seed(g, 1, Vec(4, 0)).copy(flow = listOf(Vec(4, 1)))
        g.setEffect(4, 1, CellEffect.WATER_FLOW)
        g.set(4, 1, block(JellyColor.PINK))
        g.set(4, 2, stone()) // xuống bị chặn → khối ĐỨNG YÊN (chỉ nước mới rẽ)
        assertFalse("bị chặn → không trôi, không rẽ", pushJellyByFlow(g, listOf(s)).isNotEmpty())
        assertEquals(CellType.BLOCK, g.get(4, 1)?.type)
        assertNull("KHÔNG rẽ sang bên", g.get(3, 1))
    }

    @Test
    fun `jelly ngoai kenh khong bi day`() {
        val g = Grid()
        val s = seed(g, 1, Vec(4, 0)).copy(flow = listOf(Vec(4, 1)))
        g.setEffect(4, 1, CellEffect.WATER_FLOW)
        g.set(6, 5, block(JellyColor.YELLOW)) // xa kênh
        assertFalse(pushJellyByFlow(g, listOf(s)).isNotEmpty())
        assertEquals(CellType.BLOCK, g.get(6, 5)?.type)
    }

    // ---------------- khối neo-nước không chịu trọng lực ----------------

    @Test
    fun `khoi tren nuoc KHONG roi theo trong luc`() {
        val g = Grid()
        g.setEffect(4, 2, CellEffect.WATER_FLOW)
        g.set(4, 2, block(JellyColor.PINK))   // khối trên nước, dưới trống
        applyClusterGravity(g, Direction.DOWN)
        assertEquals("khối neo-nước GIỮ chỗ", CellType.BLOCK, g.get(4, 2)?.type)
        assertNull("không rơi xuống đáy", g.get(4, 8))
    }

    @Test
    fun `khoi ngoai nuoc VAN roi binh thuong`() {
        val g = Grid()
        g.set(4, 2, block(JellyColor.PINK))   // không trên nước → rơi
        applyClusterGravity(g, Direction.DOWN)
        assertNull("đã rời chỗ cũ", g.get(4, 2))
        assertEquals("rơi tới đáy", CellType.BLOCK, g.get(4, 8)?.type)
    }

    // ---------------- breakSource ----------------

    @Test
    fun `pha nguon tat ca chuoi`() {
        val g = Grid()
        var s = seed(g, 1, Vec(4, 0)).copy(flow = listOf(Vec(4, 1), Vec(4, 2)))
        g.setEffect(4, 1, CellEffect.WATER_FLOW); g.setEffect(4, 2, CellEffect.WATER_FLOW)
        s = breakSource(g, s)
        assertFalse(s.active); assertTrue(s.broken)
        assertTrue(s.flow.isEmpty())
        assertEquals("flow tắt", CellEffect.NONE, g.effect(4, 1))
        assertEquals("flow tắt", CellEffect.NONE, g.effect(4, 2))
        assertEquals("ô nguồn giữ WATER_SOURCE (render khô)", CellEffect.WATER_SOURCE, g.effect(4, 0))
    }

    @Test
    fun `nguon broken khong moc`() {
        val g = Grid()
        val s = WaterSource(1, Vec(4, 0), active = false, broken = true)
        val (next, cell) = growSource(g, s)
        assertNull(cell); assertTrue(next.flow.isEmpty())
    }

    @Test
    fun `determinism - cung input cung ket qua`() {
        fun run(): List<Vec> {
            val g = Grid()
            var s = seed(g, 1, Vec(4, 0))
            repeat(6) { s = growWaterFlow(g, listOf(s)).sources[0] }
            return s.flow
        }
        assertEquals(run(), run())
    }
}
