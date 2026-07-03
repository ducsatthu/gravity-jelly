package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Khoá cơ chế chữ ký World 2 · DÂY LEO ([Vine]) — deterministic:
 * nhánh độc lập (max 1 đốt mọc/gốc/lượt, tip-only, không ghép), thứ tự hướng cố định,
 * bám cứng khi trọng lực, héo khi mất kết nối gốc, xoá dòng qua gốc diệt cả dây, VINE đếm vào dòng đầy.
 */
class VineTest {

    private fun vine(root: Boolean, color: JellyColor = JellyColor.MINT) =
        Grid.Cell(CellType.VINE, color, vineRoot = root)

    private fun block(color: JellyColor = JellyColor.YELLOW) = Grid.Cell(CellType.BLOCK, color)

    @Test
    fun `goc tran cung chi moc 1 mam moi luot`() {
        val g = Grid()
        g.set(4, 4, vine(root = true)) // gốc giữa bàn → đủ 4 hướng
        val a1 = growVines(g, Direction.DOWN)
        assertEquals("gốc trần cũng chỉ 1 mầm/lượt (không còn burst 3)", 1, a1.size)
        assertEquals("mầm đầu mọc NGƯỢC trọng lực (UP)", listOf(Vec(4, 3)), a1)
    }

    @Test
    fun `moc 1 mam moi luot (nguoc trong luc DOWN) va deterministic`() {
        val g = Grid()
        g.set(0, 8, vine(root = true)) // góc → chỉ có UP + RIGHT khả dụng
        // Lượt 1: 1 mầm, ưu tiên NGƯỢC trọng lực (UP) → (0,7)
        val a1 = growVines(g, Direction.DOWN)
        assertEquals(listOf(Vec(0, 7)), a1)
        assertEquals(CellType.VINE, g.get(0, 7)?.type)
        assertFalse("đốt mới không phải gốc", g.get(0, 7)!!.vineRoot)
        // Lượt 2: vẫn 1 mầm — tip (0,7)→UP→(0,6)
        val a2 = growVines(g, Direction.DOWN)
        assertEquals(listOf(Vec(0, 6)), a2)
    }

    @Test
    fun `nhanh khong tao vong tron trong chinh no`() {
        val g = Grid()
        // Nhánh hình chữ L: (1,2)→(1,1)→(2,1). Tip (2,1) muốn mọc DOWN→(2,2).
        // (2,2) kề (1,2) = ô cùng nhánh nhưng KHÔNG phải cha → tạo vòng → phải chặn.
        g.set(1, 3, vine(root = true))
        g.set(1, 2, vine(root = false))
        g.set(1, 1, vine(root = false))
        g.set(2, 1, vine(root = false))
        val a = growVines(g, Direction.DOWN)
        // (2,2) bị chặn vì kề (1,2); tip phải chọn hướng khác (RIGHT→(3,1))
        assertFalse("không mọc vào (2,2) tạo vòng", a.contains(Vec(2, 2)))
    }

    @Test
    fun `canh phat sinh mam phu (side shoot) khi tip bi chan`() {
        val g = Grid()
        // Nhánh dọc: root(4,8) → (4,7) → tip(4,6). Tip bị chặn 3 phía.
        g.set(4, 8, vine(root = true))
        g.set(4, 7, vine(root = false))
        g.set(4, 6, vine(root = false))
        g.set(4, 5, block()) // chặn tip UP
        g.set(3, 6, block()) // chặn tip LEFT
        g.set(5, 6, block()) // chặn tip RIGHT
        // Tip (4,6) bị bít → ô thân (4,7) phải mọc nhánh phụ sang bên
        val a = growVines(g, Direction.DOWN)
        assertTrue("phải có side shoot từ thân cành", a.isNotEmpty())
        // (4,7) mọc sang LEFT(3,7) hoặc RIGHT(5,7)
        assertTrue("side shoot vuông góc", a.any { it == Vec(3, 7) || it == Vec(5, 7) })
    }

    @Test
    fun `toi da 1 dot moc moi luot moi goc`() {
        val g = Grid()
        g.set(4, 4, vine(root = true))
        // Tạo 4 nhánh từ gốc (đã qua lượt gốc trần)
        g.set(4, 3, vine(root = false)) // UP
        g.set(5, 4, vine(root = false)) // RIGHT
        g.set(4, 5, vine(root = false)) // DOWN
        g.set(3, 4, vine(root = false)) // LEFT
        val a = growVines(g, Direction.DOWN)
        assertEquals("mỗi rễ mỗi lượt chỉ 1 đốt mọc", 1, a.size)
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
    fun `dot mat ket noi goc thi hoa rac voi dem nguoc`() {
        val g = Grid()
        g.set(0, 8, vine(root = true))
        g.set(0, 7, vine(root = false))
        g.set(0, 6, vine(root = false))
        g.set(0, 7, null)                // cắt giữa → (0,6) mất kết nối gốc
        val wilted = wiltDisconnectedVines(g)
        assertEquals(listOf(Vec(0, 6)), wilted)
        assertEquals("đốt mất kết nối hoá rác", CellType.TRASH, g.get(0, 6)?.type)
        assertEquals("đếm ngược bắt đầu = WILT_COUNTDOWN", WILT_COUNTDOWN, g.get(0, 6)?.trashCountdown)
        assertEquals("gốc còn nguyên", CellType.VINE, g.get(0, 8)?.type)
    }

    @Test
    fun `tickTrashCountdown giam dem nguoc va thanh rac chet khi = 0`() {
        val g = Grid()
        g.set(0, 6, Grid.Cell(CellType.TRASH, trashCountdown = WILT_COUNTDOWN))
        repeat(WILT_COUNTDOWN - 1) { i ->
            val t = tickTrashCountdown(g)
            assertTrue("tick ${i + 1}: chưa chết", t.isEmpty())
            assertEquals(WILT_COUNTDOWN - 1 - i, g.get(0, 6)?.trashCountdown)
        }
        // tick cuối: → 0 → rác chết
        val tLast = tickTrashCountdown(g)
        assertEquals(listOf(Vec(0, 6)), tLast)
        assertEquals(0, g.get(0, 6)?.trashCountdown)
    }

    @Test
    fun `destroyVineOfRoot chi xoa goc - dot con lai cho wilt`() {
        val g = Grid()
        g.set(0, 8, vine(root = true))
        g.set(0, 7, vine(root = false))
        g.set(1, 8, vine(root = false))
        val gone = destroyVineOfRoot(g, Vec(0, 8))
        assertEquals("chỉ xoá gốc", 1, gone.size)
        assertNull("gốc bị xoá", g.get(0, 8))
        assertEquals("đốt còn sống", CellType.VINE, g.get(0, 7)?.type)
        assertEquals("đốt còn sống", CellType.VINE, g.get(1, 8)?.type)
        // wiltDisconnectedVines chuyển chúng sang TRASH
        val wilted = wiltDisconnectedVines(g)
        assertEquals(2, wilted.size)
        assertEquals(CellType.TRASH, g.get(0, 7)?.type)
        assertEquals(WILT_COUNTDOWN, g.get(0, 7)?.trashCountdown)
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
    fun `xoa dong qua goc - goc tan + dot heo rac (can MINT)`() {
        val g = Grid()
        for (x in 0 until 7) g.set(x, 8, block(JellyColor.YELLOW))
        g.set(7, 8, block(JellyColor.MINT))     // ≥1 MINT → dòng đủ điều kiện phá gốc
        g.set(8, 8, vine(root = true))          // gốc nằm trên hàng 8
        g.set(8, 7, vine(root = false))         // đốt phía trên gốc
        val r = resolve(g, Direction.DOWN, startCombo = 0)
        val vrc = r.events.filterIsInstance<ResolveEvent.VineRootsCleared>()
        assertTrue("phải phát VineRootsCleared", vrc.isNotEmpty())
        assertEquals(1, vrc.first().roots.size)
        assertEquals("đốt trên hoá rác (đếm ngược)", CellType.TRASH, g.get(8, 7)?.type)
        assertEquals(WILT_COUNTDOWN, g.get(8, 7)?.trashCountdown)
    }

    @Test
    fun `vine khong moc ke TRASH - chong hoi sinh`() {
        val g = Grid()
        g.set(4, 8, vine(root = true))
        g.set(4, 7, vine(root = false)) // nhánh đi lên
        g.set(3, 7, Grid.Cell(CellType.TRASH, trashCountdown = 3)) // rác bên trái
        // Tip (4,7) thử UP→(4,6): kề (3,6)? Không. OK.
        // Cành (4,7) side-shoot LEFT→(3,7)? Đã có rác, không empty. Skip.
        // Nhưng nếu rác ở (3,6): tip mọc UP→(4,6) kề TRASH (3,6) → phải chặn.
        g.set(3, 6, Grid.Cell(CellType.TRASH, trashCountdown = 2))
        val a = growVines(g, Direction.DOWN)
        assertFalse("không mọc vào ô kề TRASH", a.contains(Vec(4, 6)))
    }

    // ── TRASH (rác rừng) ────────────────────────────────────────────────────────────

    private fun trash() = Grid.Cell(CellType.TRASH)

    @Test
    fun `TRASH chet (countdown=0) khong dem vao dong day`() {
        val g = Grid()
        for (x in 0 until 8) g.set(x, 8, block())
        g.set(8, 8, trash())                 // rác chết (countdown=0) → hàng KHÔNG đầy
        assertTrue("hàng chứa TRASH chết = không clear", findFullLines(g).isEmpty)
    }

    @Test
    fun `TRASH dang heo (countdown gt 0) dem vao dong day va bi pha`() {
        val g = Grid()
        for (x in 0 until 8) g.set(x, 8, block())
        g.set(8, 8, Grid.Cell(CellType.TRASH, trashCountdown = 3))  // đang héo → đếm đầy
        assertFalse("hàng chứa TRASH héo = đầy", findFullLines(g).isEmpty)
        val r = resolve(g, Direction.DOWN)
        assertTrue("hàng clear", r.cleared)
        assertNull("TRASH héo bị phá", g.get(8, 8))
    }

    @Test
    fun `TRASH tinh - khong roi theo trong luc`() {
        val g = Grid()
        g.set(0, 0, trash())
        val moved = applyClusterGravity(g, Direction.DOWN)
        assertFalse("rác không rơi", moved)
        assertEquals(CellType.TRASH, g.get(0, 0)?.type)
    }

    @Test
    fun `TRASH bi super block pha`() {
        val g = Grid()
        g.set(4, 4, Grid.Cell(CellType.BLOCK, JellyColor.YELLOW, superLevel = 1))
        g.set(0, 0, trash())
        g.set(3, 3, Grid.Cell(CellType.BLOCK, JellyColor.YELLOW))  // cùng màu → bị quét
        // lấp hàng 4 để kích nổ super
        for (x in 0 until 9) if (g.isEmpty(x, 4)) g.set(x, 4, block(JellyColor.MINT))
        val r = resolve(g, Direction.DOWN)
        assertTrue("TRASH bị phá", r.cleared)
    }

    @Test
    fun `TRASH chan khoi thuong roi`() {
        val g = Grid()
        g.set(0, 8, trash())
        g.set(0, 5, block())
        applyClusterGravity(g, Direction.DOWN)
        assertEquals("khối dừng ngay trên rác", CellType.BLOCK, g.get(0, 7)?.type)
        assertEquals(CellType.TRASH, g.get(0, 8)?.type)
    }

    @Test
    fun `vine cat khong triet de tao rac voi dem nguoc`() {
        val g = Grid()
        g.set(0, 8, vine(root = true))
        g.set(0, 7, vine(root = false))
        g.set(0, 6, vine(root = false))
        // lấp hàng 7 (cắt giữa vine) — không có MINT nên gốc sống
        for (x in 1 until 9) g.set(x, 7, block())
        g.set(8, 7, block(JellyColor.MINT))  // MINT nhưng gốc ở hàng 8, không trên hàng 7
        val r = resolve(g, Direction.DOWN)
        assertTrue("hàng 7 xoá", r.cleared)
        assertEquals("gốc hàng 8 còn", CellType.VINE, g.get(0, 8)?.type)
        assertEquals("đốt cắt rời hoá rác", CellType.TRASH, g.get(0, 6)?.type)
        assertEquals("đếm ngược = WILT_COUNTDOWN", WILT_COUNTDOWN, g.get(0, 6)?.trashCountdown)
    }

    @Test
    fun `cat day trong luot moc - HOAN moc, o vua mo khong bi lap`() {
        // Dây dọc: gốc(4,8) → (4,7) → (4,6). vineGrowEveryN=1 (mọc mỗi lượt).
        // Người chơi hoàn tất hàng 7 → cắt giữa dây tại (4,7): (4,6) mất kết nối → héo.
        // Vì có nhát cắt trong lượt này, dây KHÔNG được mọc lại ngay (nếu mọc, gốc (4,8) sẽ
        // đẻ mầm mới vào (3,8)/(5,8) — đúng các ô người chơi vừa mở → chặn oan).
        val dot = Piece(PieceLibrary.DOT, JellyColor.YELLOW)
        val preset = buildList {
            add(Vec(4, 8) to Grid.Cell(CellType.VINE, JellyColor.MINT, vineRoot = true))
            add(Vec(4, 7) to Grid.Cell(CellType.VINE, JellyColor.MINT))
            add(Vec(4, 6) to Grid.Cell(CellType.VINE, JellyColor.MINT))
            // Lấp hàng 7 trừ ô (4,7)=dây và ô (8,7)=chỗ người chơi thả DOT.
            for (x in 0 until 9) if (x != 4 && x != 8)
                add(Vec(x, 7) to Grid.Cell(CellType.BLOCK, JellyColor.YELLOW))
        }
        val engine = EndlessEngine(
            seed = 1,
            initialBudget = 0,
            tuning = EndlessTuning(vineGrowEveryN = 1),
            preset = preset,
            trayScript = listOf(listOf(dot, dot, dot)),
        )
        val ev = engine.placePieceAt(0, 8, 7)   // hoàn tất hàng 7 → cắt giữa dây
        assertTrue("phải có nhịp cắt dây (héo đốt)", ev.any { it is GameEvent.VineRootsCleared })
        assertFalse("HOÃN mọc: không phát VineGrew trong lượt cắt", ev.any { it is GameEvent.VineGrew })
        val g = engine.state().grid
        assertTrue("ô vừa mở (3,8) vẫn trống", g.isEmpty(3, 8))
        assertTrue("ô vừa mở (5,8) vẫn trống", g.isEmpty(5, 8))
        assertTrue("ô (4,7) vừa cắt vẫn trống", g.isEmpty(4, 7))
        assertEquals("đốt bị cắt hoá rác đếm ngược", CellType.TRASH, g.get(4, 6)?.type)
        assertEquals("gốc còn nguyên", CellType.VINE, g.get(4, 8)?.type)
    }

    @Test
    fun `khong cat thi van moc dung nhip (khong regress)`() {
        // Không có nhát cắt trong lượt → dây vẫn mọc bình thường theo nhịp.
        val dot = Piece(PieceLibrary.DOT, JellyColor.YELLOW)
        val engine = EndlessEngine(
            seed = 1,
            initialBudget = 0,
            tuning = EndlessTuning(vineGrowEveryN = 1),
            preset = listOf(Vec(4, 8) to Grid.Cell(CellType.VINE, JellyColor.MINT, vineRoot = true)),
            trayScript = listOf(listOf(dot, dot, dot)),
        )
        val ev = engine.placePieceAt(0, 0, 0)   // thả xa dây, không cắt gì
        assertFalse("không cắt dây", ev.any { it is GameEvent.VineRootsCleared })
        assertTrue("vẫn mọc theo nhịp", ev.any { it is GameEvent.VineGrew })
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
