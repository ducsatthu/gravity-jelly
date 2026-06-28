package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class TrayGeneratorTest {

    @Test
    fun sameSeedSameSequence() {
        val gen1 = TrayGenerator(Rng(42L))
        val gen2 = TrayGenerator(Rng(42L))
        repeat(20) { turn ->
            val tray1 = gen1.deal()
            val tray2 = gen2.deal()
            assertEquals("Turn $turn mismatch", tray1, tray2)
        }
    }

    @Test
    fun differentSeedDiffers() {
        val gen1 = TrayGenerator(Rng(1L))
        val gen2 = TrayGenerator(Rng(2L))
        val trays1 = List(20) { gen1.deal() }
        val trays2 = List(20) { gen2.deal() }
        assertNotEquals(trays1, trays2)
    }

    @Test
    fun dealAlwaysReturnsThreePieces() {
        val gen = TrayGenerator(Rng(123L))
        repeat(100) {
            assertEquals(TrayGenerator.TRAY_SIZE, gen.deal().size)
        }
    }

    @Test
    fun allPiecesHaveValidShapeAndColor() {
        val gen = TrayGenerator(Rng(99L))
        val allShapes = PieceLibrary.ALL.toSet()
        val allColors = JellyColor.entries.toSet()
        repeat(50) {
            for (piece in gen.deal()) {
                assertTrue("Unknown shape: ${piece.shape}", piece.shape in allShapes)
                assertTrue("Unknown color: ${piece.color}", piece.color in allColors)
            }
        }
    }

    @Test
    fun customPoolRespectsSelection() {
        val pool = listOf(PieceLibrary.DOT, PieceLibrary.O4)
        val gen = TrayGenerator(Rng(7L), pool)
        repeat(50) {
            for (piece in gen.deal()) {
                assertTrue(
                    "Shape not in custom pool: ${piece.shape}",
                    piece.shape in pool,
                )
            }
        }
    }
}
