package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class PieceTest {

    @Test
    fun allShapesHaveNoDuplicateCells() {
        for (shape in PieceLibrary.ALL) {
            assertEquals(
                "Duplicate cells in $shape",
                shape.cells.size,
                shape.cells.toSet().size,
            )
        }
    }

    @Test
    fun allShapesAreConnected() {
        for (shape in PieceLibrary.ALL) {
            assertTrue("Not connected: $shape", isConnected(shape.cells))
        }
    }

    @Test
    fun allShapesAreDistinct() {
        val unique = PieceLibrary.ALL.toSet()
        assertEquals(
            "Library contains duplicate shapes",
            PieceLibrary.ALL.size,
            unique.size,
        )
    }

    @Test
    fun shapeAtReturnsAbsolutePositions() {
        val shape = Shape.of(0 to 0, 1 to 0, 0 to 1)
        val placed = shape.at(3, 5)
        assertEquals(
            listOf(Vec(3, 5), Vec(4, 5), Vec(3, 6)),
            placed,
        )
    }

    @Test
    fun shapeSizeAndDimensions() {
        val o = PieceLibrary.O4
        assertEquals(4, o.size)
        assertEquals(2, o.width)
        assertEquals(2, o.height)

        val i4h = PieceLibrary.I4H
        assertEquals(4, i4h.size)
        assertEquals(4, i4h.width)
        assertEquals(1, i4h.height)
    }

    @Test
    fun rotateCWFourTimesReturnsOriginal() {
        for (shape in PieceLibrary.ALL) {
            var r = shape
            repeat(4) { r = r.rotateCW() }
            assertEquals("CW×4 ≠ original for $shape", shape, r)
        }
    }

    @Test
    fun rotateCCWFourTimesReturnsOriginal() {
        for (shape in PieceLibrary.ALL) {
            var r = shape
            repeat(4) { r = r.rotateCCW() }
            assertEquals("CCW×4 ≠ original for $shape", shape, r)
        }
    }

    @Test
    fun rotateCWThenCCWIsIdentity() {
        for (shape in PieceLibrary.ALL) {
            assertEquals(
                "CW then CCW ≠ identity for $shape",
                shape,
                shape.rotateCW().rotateCCW(),
            )
        }
    }

    @Test
    fun shapeCellsAreNormalized() {
        val shape = Shape.of(3 to 5, 4 to 5, 3 to 6)
        assertEquals(
            "Cells should be origin-normalized",
            listOf(Vec(0, 0), Vec(1, 0), Vec(0, 1)),
            shape.cells,
        )
    }

    @Test
    fun equalShapesFromDifferentConstruction() {
        val a = Shape.of(1 to 1, 2 to 1, 1 to 2)
        val b = Shape.of(0 to 0, 1 to 0, 0 to 1)
        assertEquals(a, b)
    }

    private fun isConnected(cells: List<Vec>): Boolean {
        if (cells.size <= 1) return true
        val cellSet = cells.toSet()
        val visited = mutableSetOf(cells.first())
        val queue = ArrayDeque<Vec>()
        queue.add(cells.first())
        val dirs = listOf(Vec(1, 0), Vec(-1, 0), Vec(0, 1), Vec(0, -1))
        while (queue.isNotEmpty()) {
            val curr = queue.removeFirst()
            for (d in dirs) {
                val next = curr + d
                if (next in cellSet && next !in visited) {
                    visited.add(next)
                    queue.add(next)
                }
            }
        }
        return visited.size == cells.size
    }
}
