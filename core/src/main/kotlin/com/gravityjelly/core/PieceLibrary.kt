package com.gravityjelly.core

object PieceLibrary {

    private fun s(vararg c: Pair<Int, Int>) = Shape.of(*c)

    // ── Monomino (1 ô) ──
    val DOT = s(0 to 0)

    // ── Domino (2 ô) ──
    val I2H = s(0 to 0, 1 to 0)
    val I2V = s(0 to 0, 0 to 1)

    // ── Tromino (3 ô) ──
    val I3H = s(0 to 0, 1 to 0, 2 to 0)
    val I3V = s(0 to 0, 0 to 1, 0 to 2)
    val L3_0 = s(0 to 0, 1 to 0, 0 to 1)
    val L3_1 = s(0 to 0, 1 to 0, 1 to 1)
    val L3_2 = s(0 to 0, 0 to 1, 1 to 1)
    val L3_3 = s(1 to 0, 0 to 1, 1 to 1)

    // ── Tetromino (4 ô) ──
    val I4H = s(0 to 0, 1 to 0, 2 to 0, 3 to 0)
    val I4V = s(0 to 0, 0 to 1, 0 to 2, 0 to 3)
    val O4  = s(0 to 0, 1 to 0, 0 to 1, 1 to 1)

    val T4_0 = s(0 to 0, 1 to 0, 2 to 0, 1 to 1)
    val T4_1 = s(0 to 0, 0 to 1, 1 to 1, 0 to 2)
    val T4_2 = s(1 to 0, 0 to 1, 1 to 1, 2 to 1)
    val T4_3 = s(1 to 0, 0 to 1, 1 to 1, 1 to 2)

    val S4  = s(1 to 0, 2 to 0, 0 to 1, 1 to 1)
    val S4V = s(0 to 0, 0 to 1, 1 to 1, 1 to 2)
    val Z4  = s(0 to 0, 1 to 0, 1 to 1, 2 to 1)
    val Z4V = s(1 to 0, 0 to 1, 1 to 1, 0 to 2)

    val L4_0 = s(0 to 0, 0 to 1, 0 to 2, 1 to 2)
    val L4_1 = s(0 to 0, 1 to 0, 2 to 0, 0 to 1)
    val L4_2 = s(0 to 0, 1 to 0, 1 to 1, 1 to 2)
    val L4_3 = s(2 to 0, 0 to 1, 1 to 1, 2 to 1)

    val J4_0 = s(1 to 0, 1 to 1, 0 to 2, 1 to 2)
    val J4_1 = s(0 to 0, 0 to 1, 1 to 1, 2 to 1)
    val J4_2 = s(0 to 0, 1 to 0, 0 to 1, 0 to 2)
    val J4_3 = s(0 to 0, 1 to 0, 2 to 0, 2 to 1)

    // ── Pentomino (5 ô) — bộ chọn lọc ──
    val I5H  = s(0 to 0, 1 to 0, 2 to 0, 3 to 0, 4 to 0)
    val I5V  = s(0 to 0, 0 to 1, 0 to 2, 0 to 3, 0 to 4)
    val PLUS = s(1 to 0, 0 to 1, 1 to 1, 2 to 1, 1 to 2)

    val ALL: List<Shape> = listOf(
        DOT,
        I2H, I2V,
        I3H, I3V, L3_0, L3_1, L3_2, L3_3,
        I4H, I4V, O4,
        T4_0, T4_1, T4_2, T4_3,
        S4, S4V, Z4, Z4V,
        L4_0, L4_1, L4_2, L4_3,
        J4_0, J4_1, J4_2, J4_3,
        I5H, I5V, PLUS,
    )

    val HARD: List<Shape> = ALL.filter { it.size >= 3 }
}
