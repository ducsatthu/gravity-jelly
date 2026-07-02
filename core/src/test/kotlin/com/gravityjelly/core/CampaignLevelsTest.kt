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
    fun `W2 cau truc - 10 man vine + boss Than Rung`() {
        val w2 = CampaignLevels.ALL.filter { it.world == 2 }
        assertEquals("10 màn World 2", 10, w2.size)
        assertEquals("id 11..20", (11..20).toList(), w2.map { it.id })
        val vineLevels = w2.filter { it.vineGrowEveryN > 0 }
        assertEquals("9 màn có vine (trừ L16 nghỉ)", 9, vineLevels.size)
        assertEquals("L16 nghỉ không vine", 0, CampaignLevels.L16.vineGrowEveryN)
        assertEquals("L20 boss vine spawn", GoalType.BOSS_COMBO, CampaignLevels.L20.goal.type)
        assertTrue("L20 có bossVineSpawnEveryN", CampaignLevels.L20.bossVineSpawnEveryN > 0)
    }

    @Test
    fun `L13 - 2 goc cung hang day`() {
        val l = CampaignLevels.L13
        val roots = l.preset.filter { it.vineRoot }
        assertEquals("2 gốc", 2, roots.size)
        assertEquals("cùng hàng 8", setOf(8), roots.map { it.y }.toSet())
    }

    @Test
    fun `L14 - 1 goc giua + 2 da`() {
        val l = CampaignLevels.L14
        assertEquals("1 gốc", 1, l.preset.count { it.vineRoot })
        assertEquals("2 đá", 2, l.preset.count { it.type == CellType.STONE })
    }

    @Test
    fun `L20 boss Than Rung spawn vine moi 3 luot`() {
        val e = EndlessEngine.forLevel(CampaignLevels.L20)
        val initRoots = (0 until 9).flatMap { x ->
            (0 until 9).mapNotNull { y ->
                if (e.state().grid.get(x, y)?.isVineRoot == true) Vec(x, y) else null
            }
        }
        assertEquals("ban đầu 2 gốc", 2, initRoots.size)
        // Đặt 3 mảnh (ở vùng trống trên cao) → sau lượt 3, boss spawn gốc mới
        e.placePieceAt(0, 0, 0)
        e.placePieceAt(1, 3, 0)
        e.placePieceAt(2, 6, 0)
        val rootsAfter = (0 until 9).flatMap { x ->
            (0 until 9).mapNotNull { y ->
                if (e.state().grid.get(x, y)?.isVineRoot == true) Vec(x, y) else null
            }
        }
        assertTrue("sau 3 lượt, boss spawn thêm gốc", rootsAfter.size > initRoots.size)
    }

    @Test
    fun `W3 cau truc - 10 man thac nuoc + boss Than Thac`() {
        val w3 = CampaignLevels.ALL.filter { it.world == 3 }
        assertEquals("10 màn World 3", 10, w3.size)
        assertEquals("id 21..30", (21..30).toList(), w3.map { it.id })
        val waterfallLevels = w3.filter { it.waterSources.isNotEmpty() }
        assertTrue("đa số màn có thác", waterfallLevels.size >= 7)
        assertEquals("L30 boss", GoalType.BOSS_COMBO, CampaignLevels.L30.goal.type)
        assertEquals("L30 gravity flip", 3, CampaignLevels.L30.bossGravityEveryN)
        assertEquals("tổng 30 màn", 30, CampaignLevels.ALL.size)
    }

    @Test
    fun `L21 thac nuoc - co nguon va giot`() {
        val l = CampaignLevels.L21
        assertEquals("1 nguồn", 1, l.waterSources.size)
        assertEquals("2 giọt", 2, l.preset.count { it.type == CellType.TARGET })
    }

    @Test
    fun `L30 boss Than Thac tu dao trong luc moi 3 luot`() {
        val dot = Piece(PieceLibrary.DOT, JellyColor.YELLOW)
        val e = EndlessEngine(
            seed = 30,
            initialBudget = 5,
            tuning = EndlessTuning(bossGravityEveryN = 3),
            preset = listOf(Vec(4, 0) to Grid.Cell(CellType.STONE), Vec(4, 8) to Grid.Cell(CellType.STONE)),
            trayScript = listOf(listOf(dot, dot, dot), listOf(dot, dot, dot)),
        )
        val t1 = e.placePieceAt(0, 0, 1)
        val t2 = e.placePieceAt(1, 0, 2)
        val t3 = e.placePieceAt(2, 0, 3)
        assertTrue("lượt 1 chưa đảo", t1.none { it is GameEvent.BossGravityFlipped })
        assertTrue("lượt 2 chưa đảo", t2.none { it is GameEvent.BossGravityFlipped })
        assertTrue("lượt 3 đảo trọng lực", t3.any { it is GameEvent.BossGravityFlipped })
        assertEquals(Direction.UP, e.state().gravity)
    }

    @Test
    fun `khay co dinh dung thu tu thiet ke L1`() {
        val tray = EndlessEngine.forLevel(CampaignLevels.L1).state().tray
        assertEquals(PieceLibrary.I5H, tray[0]?.shape)
        assertEquals(JellyColor.YELLOW, tray[0]?.color)
        assertEquals(PieceLibrary.I4H, tray[1]?.shape)
    }
}
