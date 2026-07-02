package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Khoá boss World 2 · "Kẻ Đổ Rác" ([EndlessEngine.dropDebrisIfDue]): ân hạn
 * [EndlessTuning.debrisGraceTurns] lượt đầu KHÔNG đổ, sau đó mỗi lượt chèn đúng
 * [EndlessTuning.debrisPerTurn] ô rác — deterministic.
 */
class BossDebrisTest {

    private fun engine(): EndlessEngine {
        val dot = Piece(PieceLibrary.DOT, JellyColor.YELLOW)
        return EndlessEngine(
            seed = 7,
            initialBudget = 0,
            tuning = EndlessTuning(debrisPerTurn = 2, debrisGraceTurns = 2),
            // 2 đợt khay để đủ mảnh thả tới lượt 3+.
            trayScript = listOf(listOf(dot, dot, dot), listOf(dot, dot, dot)),
        )
    }

    @Test
    fun `an han 2 luot dau khong do rac`() {
        val e = engine()
        val t1 = e.placePieceAt(0, 0, 0)
        val t2 = e.placePieceAt(1, 1, 0)
        assertFalse("lượt 1 ân hạn", t1.any { it is GameEvent.DebrisAdded })
        assertFalse("lượt 2 ân hạn", t2.any { it is GameEvent.DebrisAdded })
    }

    @Test
    fun `luot 3 do dung 2 o rac`() {
        val e = engine()
        e.placePieceAt(0, 0, 0)
        e.placePieceAt(1, 1, 0)
        val t3 = e.placePieceAt(2, 2, 0)
        val debris = t3.filterIsInstance<GameEvent.DebrisAdded>()
        assertTrue("lượt 3 bắt đầu đổ", debris.isNotEmpty())
        assertEquals(2, debris.first().positions.size)
    }

    @Test
    fun `deterministic - cung seed cung vi tri rac`() {
        fun run(): List<Vec> {
            val e = engine()
            e.placePieceAt(0, 0, 0)
            e.placePieceAt(1, 1, 0)
            return e.placePieceAt(2, 2, 0).filterIsInstance<GameEvent.DebrisAdded>()
                .flatMap { it.positions }
        }
        assertEquals(run(), run())
    }
}
