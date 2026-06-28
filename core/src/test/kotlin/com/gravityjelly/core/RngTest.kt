package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/** Bảo vệ yêu cầu cứng: cùng seed -> cùng chuỗi (deterministic). */
class RngTest {

    @Test
    fun sameSeedSameSequence() {
        val a = Rng(42L)
        val b = Rng(42L)
        repeat(1000) {
            assertEquals(a.nextLong(), b.nextLong())
        }
    }

    @Test
    fun differentSeedDiffers() {
        val a = Rng(1L)
        val b = Rng(2L)
        val seqA = List(50) { a.nextLong() }
        val seqB = List(50) { b.nextLong() }
        assertTrue("Hai seed khác nhau không nên trùng chuỗi", seqA != seqB)
    }

    @Test
    fun nextIntInRange() {
        val r = Rng(7L)
        repeat(10_000) {
            val v = r.nextInt(9)
            assertTrue(v in 0..8)
        }
    }

    @Test
    fun directionRotateIsCyclic() {
        var d = Direction.DOWN
        repeat(4) { d = d.rotateCW() }
        assertEquals(Direction.DOWN, d)
    }
}
