package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Bảo vệ persistence ván Endless: encode→decode phải cho ĐÚNG state (grid/khay/điểm/combo/budget/
 * rng), và ván khôi phục phải tiếp diễn DETERMINISTIC y hệt ván gốc (nền cho "tiếp tục lại" khi
 * process bị kill). Chuỗi hỏng → trả về "khôi phục thất bại" chứ không crash.
 */
class EndlessSaveCodecTest {

    private fun gridsEqual(a: Grid, b: Grid): Boolean {
        for (y in 0 until a.size) for (x in 0 until a.size)
            if (a.get(x, y) != b.get(x, y)) return false
        return true
    }

    private fun assertSameState(a: EndlessState, b: EndlessState) {
        assertTrue("grid khác nhau", gridsEqual(a.grid, b.grid))
        assertEquals(a.gravity, b.gravity)
        assertEquals(a.score, b.score)
        assertEquals(a.combo, b.combo)
        assertEquals(a.stage, b.stage)
        assertEquals(a.rotationBudget, b.rotationBudget)
        assertEquals(a.isGameOver, b.isGameOver)
        assertEquals(a.tray, b.tray)   // Piece/Shape có equals theo giá trị
    }

    /** Chơi vài nước để state có grid/tray/điểm/rng đã tiến (không còn ván khởi tạo). */
    private fun playedEngine(seed: Long): EndlessEngine = EndlessEngine(seed).apply {
        placePiece(0, 0)
        placePiece(1, 3)
        rotateGravity(cw = true)
        placePiece(2, 6)
    }

    @Test
    fun roundTrip_preservesState() {
        val original = playedEngine(seed = 42L)
        val blob = original.encodeSave()

        val restored = EndlessEngine(seed = 999L)   // seed KHÁC: chứng minh loadSave đè trọn state
        assertTrue(restored.loadSave(blob))

        assertSameState(original.state(), restored.state())
    }

    @Test
    fun roundTrip_continuesDeterministically() {
        val original = playedEngine(seed = 7L)
        val restored = EndlessEngine(seed = 1L).also { assertTrue(it.loadSave(original.encodeSave())) }

        // Cùng chuỗi nước tiếp theo trên cả hai → phải cho state y hệt (rng + counter đã khôi phục đúng).
        repeat(4) { i ->
            original.placePiece(i % 3, i)
            restored.placePiece(i % 3, i)
        }
        original.rotateGravity(cw = false)
        restored.rotateGravity(cw = false)

        assertSameState(original.state(), restored.state())
    }

    @Test
    fun roundTrip_preservesGameOverFlag() {
        // Cạn budget + bàn kẹt hiếm khi đạt nhanh; ở đây chỉ cần cờ tuần tự hoá đúng qua encode/decode.
        val e = playedEngine(seed = 3L)
        val restored = EndlessEngine(seed = 3L).also { it.loadSave(e.encodeSave()) }
        assertEquals(e.state().isGameOver, restored.state().isGameOver)
    }

    @Test
    fun decode_corruptBlob_returnsFalse() {
        val e = EndlessEngine(seed = 5L)
        val before = e.state()
        assertFalse(e.loadSave("rác không hợp lệ"))
        assertFalse(e.loadSave(""))
        assertFalse(e.loadSave("GJ1|thiếu-trường"))
        // Ván giữ nguyên khi loadSave thất bại.
        assertSameState(before, e.state())
    }

    @Test
    fun decode_wrongVersion_returnsNull() {
        val blob = EndlessEngine(seed = 5L).encodeSave()
        val tampered = "GJ9" + blob.substring(3)
        assertNull(EndlessSaveCodec.decode(tampered))
    }
}
