package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

/**
 * Khoá [EndlessEngine.bossTell] — cảnh báo boss SẮP ra chiêu + đếm ngược cho HUD (BossCard tell chip):
 * `turnsUntil = N − (placeTurns % N)`, bắn khi placeTurns % N == 0 (sau [finishTurn]). Deterministic.
 */
class BossTellTest {

    private fun engine(tuning: EndlessTuning): EndlessEngine {
        val dot = Piece(PieceLibrary.DOT, JellyColor.YELLOW)
        return EndlessEngine(
            seed = 1,
            initialBudget = 0,
            tuning = tuning,
            trayScript = listOf(listOf(dot, dot, dot), listOf(dot, dot, dot)),
        )
    }

    @Test
    fun `khong co co che dinh ky thi bossTell null`() {
        assertNull(engine(EndlessTuning()).bossTell())
    }

    @Test
    fun `dao trong luc moi 3 luot - dem nguoc 3 2 1 roi reset`() {
        val e = engine(EndlessTuning(bossGravityEveryN = 3))
        // Chưa thả nước nào: chiêu đầu sau đúng 3 lượt.
        assertEquals(BossTell(BossTellKind.GRAVITY_INVERT, 3), e.bossTell())
        e.placePieceAt(0, 0, 0)
        assertEquals(2, e.bossTell()!!.turnsUntil)
        e.placePieceAt(1, 1, 0)
        assertEquals(1, e.bossTell()!!.turnsUntil)   // lượt sau bắn chiêu
        e.placePieceAt(2, 2, 0)                       // lượt 3 → vừa bắn → reset về 3
        assertEquals(BossTell(BossTellKind.GRAVITY_INVERT, 3), e.bossTell())
    }

    @Test
    fun `vine spawn cho dung kind va chu ky`() {
        val e = engine(EndlessTuning(bossVineSpawnEveryN = 2))
        assertEquals(BossTellKind.VINE_SPAWN, e.bossTell()!!.kind)
        assertEquals(2, e.bossTell()!!.turnsUntil)
    }
}
