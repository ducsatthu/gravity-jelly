package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Khoá TÍNH GIẢI-ĐƯỢC các màn World 1 (hệ mục tiêu v2): chơi headless đúng đường giải dự kiến →
 * engine PHẢI phát đúng event trigger (xóa hàng/cột, siêu khối, cầu vồng). Bảo vệ deterministic +
 * khả thi khi refactor engine. (Các màn ⚠ liệu-nghiệm L5/L8/L10 chưa khoá — cần chơi thử.)
 */
class CampaignLevelsTest {

    private fun events(level: Level, moves: List<Triple<Int, Int, Int>>): List<GameEvent> {
        val e = EndlessEngine.forLevel(level)
        val out = mutableListOf<GameEvent>()
        for ((idx, ox, oy) in moves) out += e.placePieceAt(idx, ox, oy)
        return out
    }

    @Test
    fun `L1 - tu xep I5+I4 day hang - xoa HANG`() {
        // I5 (idx0) cột 0..4 + I4 (idx1) cột 5..8, hàng 8 → hàng đầy → xóa hàng.
        val evs = events(CampaignLevels.L1, listOf(Triple(0, 0, 8), Triple(1, 5, 8)))
        val cleared = evs.filterIsInstance<GameEvent.LinesCleared>()
        assertTrue("phải có xóa hàng", cleared.any { it.lines.rows.isNotEmpty() })
    }

    @Test
    fun `L2 - tu chong 3 V3 day cot - xoa COT`() {
        // 3 V3 chồng cột 4: rows 0..2, 3..5, 6..8 → cột 4 đầy → xóa cột.
        val evs = events(CampaignLevels.L2, listOf(Triple(0, 4, 0), Triple(1, 4, 3), Triple(2, 4, 6)))
        val cleared = evs.filterIsInstance<GameEvent.LinesCleared>()
        assertTrue("phải có xóa cột", cleared.any { it.lines.cols.isNotEmpty() })
    }

    @Test
    fun `L4 - tu xep 3 I3 thanh 3x3 cung mau - tao SIEU KHOI cap 1`() {
        // 3 I3 vàng xếp cột 0..2 rows 6/7/8 → 3×3 vàng → siêu khối cấp 1.
        val evs = events(CampaignLevels.L4, listOf(Triple(0, 0, 6), Triple(1, 0, 7), Triple(2, 0, 8)))
        val supers = evs.filterIsInstance<GameEvent.SuperFormed>()
        assertTrue("phải tạo siêu khối", supers.isNotEmpty())
        assertEquals("cấp 1", 1, supers.first().level)
    }

    @Test
    fun `L6 - xep 3x3 soc ba mau - tao CAU VONG`() {
        // 3 V3 ba màu vào cột 0/1/2 rows 6..8 → 3×3 sọc dọc → cầu vồng.
        val evs = events(CampaignLevels.L6, listOf(Triple(0, 0, 6), Triple(1, 1, 6), Triple(2, 2, 6)))
        assertTrue("phải tạo cầu vồng", evs.any { it is GameEvent.RainbowFormed })
    }

    @Test
    fun `L8 - xoa 2 hang cung luc - dat COMBO x2`() {
        // xây 2 hàng đáy (cols 0..7) rồi V3 lấp cột 8 rows 6..8 → xóa hàng 7+8 cùng lúc → combo ≥2.
        val evs = events(
            CampaignLevels.L8,
            listOf(Triple(0, 0, 8), Triple(1, 4, 8), Triple(2, 0, 7), Triple(0, 4, 7), Triple(1, 8, 6)),
        )
        val cleared = evs.filterIsInstance<GameEvent.LinesCleared>()
        assertTrue("phải đạt combo ≥2", cleared.any { it.comboLevel >= 2 })
    }

    @Test
    fun `khay co dinh dung thu tu thiet ke L1`() {
        val tray = EndlessEngine.forLevel(CampaignLevels.L1).state().tray
        assertEquals(PieceLibrary.I5H, tray[0]?.shape)
        assertEquals(JellyColor.YELLOW, tray[0]?.color)
        assertEquals(PieceLibrary.I4H, tray[1]?.shape)
    }
}
