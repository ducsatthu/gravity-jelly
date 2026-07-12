package com.gravityjelly.core

class TrayGenerator(
    private val rng: Rng,
    private val pool: List<Shape> = PieceLibrary.ALL,
) {
    fun deal(): List<Piece> = List(TRAY_SIZE) {
        PieceLibrary.dealt(
            shape = rng.pick(pool),
            color = rng.pick(JellyColor.entries),
        )
    }

    companion object {
        const val TRAY_SIZE = 3
    }
}
