package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
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
    fun `moi moc boss dung chung co che combo pha Khien`() {
        // Quy tắc thiết kế (chốt 05/07): MỌI màn boss (id % 10 == 0) đều là BOSS_COMBO — combo phá Khiên.
        // Chiêu/chướng ngại theo world khác nhau (đá / vine / nước) nhưng điều kiện THẮNG luôn là combo.
        val bosses = CampaignLevels.ALL.filter { it.isBoss }
        assertTrue("phải có ≥3 boss", bosses.size >= 3)
        for (b in bosses) {
            assertEquals("boss L${b.id} phải là BOSS_COMBO", GoalType.BOSS_COMBO, b.goal.type)
            assertTrue("boss L${b.id} phải có Khiên > 0", b.goal.bossHP > 0)
        }
        // Khiên tăng dần theo mốc: 5 → 8 → 11.
        assertEquals(listOf(5, 8, 11), bosses.take(3).map { it.goal.bossHP })
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
    fun `L20 boss Than Rung spawn vine moi 4 luot`() {
        assertEquals("bossVineSpawnEveryN = 4", 4, CampaignLevels.L20.bossVineSpawnEveryN)
        assertEquals("ban đầu 2 gốc", 2, CampaignLevels.L20.preset.count { it.vineRoot })
        assertEquals("bossHP = 8", 8, CampaignLevels.L20.goal.bossHP)
        assertEquals("vineGrowEveryN = 1", 1, CampaignLevels.L20.vineGrowEveryN)
    }

    @Test
    fun `W3 cau truc - 10 man thac nuoc + boss Than Thac`() {
        val w3 = CampaignLevels.ALL.filter { it.world == 3 }
        assertEquals("10 màn World 3", 10, w3.size)
        assertEquals("id 21..30", (21..30).toList(), w3.map { it.id })
        val flowLevels = w3.filter { it.waterSources.isNotEmpty() }
        assertTrue("đa số màn có dòng chảy", flowLevels.size >= 7)
        // Mọi mốc boss (L10/L20/L30) DÙNG CHUNG cơ chế combo phá Khiên; nước ở L30 chỉ là chướng ngại.
        assertEquals("L30 boss combo phá Khiên", GoalType.BOSS_COMBO, CampaignLevels.L30.goal.type)
        assertEquals("L30 Khiên = 11 (5→8→11)", 11, CampaignLevels.L30.goal.bossHP)
        assertTrue("L30 vẫn giữ nước làm chướng ngại", CampaignLevels.L30.waterSources.isNotEmpty())
        assertEquals("L30 hồi sinh nguồn mỗi 3 lượt", 3, CampaignLevels.L30.bossReviveEveryN)
        assertTrue("mọi màn W3 chấm sao theo LƯỢT", w3.all { it.stars.metric == StarMetric.MOVES })
        assertEquals("tổng 30 màn", 30, CampaignLevels.ALL.size)
    }

    @Test
    fun `L21 dong chay - 1 nguon o hang tren cung`() {
        val l = CampaignLevels.L21
        assertEquals("1 nguồn", 1, l.waterSources.size)
        assertEquals("nguồn ở hàng trên cùng (y=0)", 0, l.waterSources[0].y)
        assertEquals("goal phá nguồn", GoalType.CLEAR_TARGETS, l.goal.type)
    }

    @Test
    fun `L30 boss Than Thac hoi sinh nguon sau khi can`() {
        // Cột 4 (y=1..8) preset xen kẽ CÓ Thạch Nước (BLUE); đặt DOT úp nắp (4,0) → clear cột 4 (có BLUE) → phá nguồn.
        val preset = (1..8).map { Vec(4, it) to Grid.Cell(CellType.BLOCK, JellyColor.entries[it % 4]) }
        val dot = Piece(PieceLibrary.DOT, JellyColor.YELLOW)
        val e = EndlessEngine(
            seed = 30,
            tuning = EndlessTuning(bossReviveEveryN = 3),
            preset = preset,
            waterSourceSpecs = listOf(WaterSourceSpec(1, 4, 0, maxLength = 8)),
            trayScript = List(4) { listOf(dot, dot, dot) },
        )
        val t1 = e.placePieceAt(0, 4, 0)   // lượt 1: clear cột 4 → phá nguồn
        assertTrue("phá nguồn lượt 1", t1.any { it is GameEvent.WaterSourceBroken })
        assertTrue("nguồn cạn", e.state().waterSources[0].broken)

        e.placePieceAt(1, 0, 5)            // lượt 2 (không đụng cột nguồn)
        val t3 = e.placePieceAt(2, 6, 5)   // lượt 3 = bội 3 → HỒI SINH
        assertTrue("hồi sinh nguồn ở lượt 3", t3.any { it is GameEvent.WaterSourceRevived })
        assertFalse("nguồn sống lại", e.state().waterSources[0].broken)
    }

    @Test
    fun `khay co dinh dung thu tu thiet ke L1`() {
        val tray = EndlessEngine.forLevel(CampaignLevels.L1).state().tray
        assertEquals(PieceLibrary.I5H, tray[0]?.shape)
        assertEquals(JellyColor.YELLOW, tray[0]?.color)
        assertEquals(PieceLibrary.I4H, tray[1]?.shape)
    }
}
