package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/** Tích hợp cơ chế Dòng chảy vào [EndlessEngine] (mọc xuống theo lượt · phá nguồn khi clear line qua ô nguồn · snapshot). */
class EndlessWaterFlowTest {

    private fun dots(waves: Int) = List(waves) { List(3) { Piece(PieceLibrary.DOT, JellyColor.YELLOW) } }

    @Test
    fun `moc 1 o xuong moi luot dat manh`() {
        val e = EndlessEngine(
            seed = 1,
            trayScript = dots(2),
            waterSourceSpecs = listOf(WaterSourceSpec(1, 4, 0, maxLength = 6)),
        )
        assertEquals("khởi tạo chưa mọc", 0, e.state().waterSources[0].flow.size)

        e.placePieceAt(0, 8, 0) // đặt xa cột 4 → nước mọc thẳng xuống
        assertEquals(1, e.state().waterSources[0].flow.size)
        assertEquals(CellEffect.WATER_FLOW, e.state().grid.effect(4, 1))
        e.placePieceAt(1, 7, 0)
        assertEquals(2, e.state().waterSources[0].flow.size)
        e.placePieceAt(2, 6, 0)
        assertEquals(3, e.state().waterSources[0].flow.size)
    }

    @Test
    fun `clear cot qua o nguon pha nguon`() {
        // Cột 4: y=1..8 = BLOCK preset (XEN KẼ màu để clear thường, không hoá siêu khối đơn sắc);
        // đặt DOT úp nắp ô nguồn (4,0) → cột 4 đầy, clear ngay lượt đầu.
        val preset = (1..8).map { Vec(4, it) to Grid.Cell(CellType.BLOCK, JellyColor.entries[it % 4]) }
        val e = EndlessEngine(
            seed = 1,
            trayScript = dots(1),
            preset = preset,
            waterSourceSpecs = listOf(WaterSourceSpec(1, 4, 0, maxLength = 6)),
        )
        val events = e.placePieceAt(0, 4, 0) // DOT úp nắp ô nguồn → cột 4 đầy → clear

        assertTrue("clear cột 4", events.any { it is GameEvent.LinesCleared && 4 in it.lines.cols })
        assertTrue("phát WaterSourceBroken(1)",
            events.any { it is GameEvent.WaterSourceBroken && it.sourceId == 1 })
        val s = e.state().waterSources[0]
        assertTrue("nguồn khô", s.broken)
        assertFalse("nguồn tắt", s.active)
    }

    @Test
    fun `clear cot KHONG co thach nuoc thi KHONG pha nguon`() {
        // Cột 4 (y=1..8) toàn màu KHÁC nước (vàng/mint/hồng); DOT vàng úp nắp → cột đầy & clear, nhưng
        // KHÔNG chứa BLUE → theo quy tắc thạch nước, KHÔNG phá được nguồn.
        val pal = listOf(JellyColor.YELLOW, JellyColor.MINT, JellyColor.PINK)
        val preset = (1..8).map { Vec(4, it) to Grid.Cell(CellType.BLOCK, pal[it % 3]) }
        val e = EndlessEngine(
            seed = 1, trayScript = dots(1), preset = preset,
            waterSourceSpecs = listOf(WaterSourceSpec(1, 4, 0, maxLength = 6)),
        )
        val events = e.placePieceAt(0, 4, 0)
        assertTrue("cột 4 vẫn clear", events.any { it is GameEvent.LinesCleared && 4 in it.lines.cols })
        assertTrue("KHÔNG phá nguồn (thiếu Thạch Nước)", events.none { it is GameEvent.WaterSourceBroken })
        assertTrue("nguồn vẫn active", e.state().waterSources[0].active)
    }

    @Test
    fun `snapshot round-trip giu state nuoc`() {
        val e = EndlessEngine(
            seed = 1,
            trayScript = dots(3),
            waterSourceSpecs = listOf(WaterSourceSpec(1, 4, 0, maxLength = 6)),
        )
        e.placePieceAt(0, 8, 0) // flow = 1 (mọc xuống (4,1))
        val snap = e.snapshot()
        e.placePieceAt(1, 7, 0) // flow = 2
        assertEquals(2, e.state().waterSources[0].flow.size)
        e.restore(snap)
        assertEquals("restore về flow=1", 1, e.state().waterSources[0].flow.size)
        assertEquals("sàn nước cũng khôi phục", CellEffect.WATER_FLOW, e.state().grid.effect(4, 1))
    }
}
