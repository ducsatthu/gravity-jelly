package com.gravityjelly.core

/**
 * Hướng trọng lực. Lưới 9x9, hard-drop theo 1 trong 4 hướng.
 * Giá trị (dx,dy) là vector "rơi" theo hướng đó trên lưới (y tăng xuống dưới).
 */
enum class Direction(val dx: Int, val dy: Int) {
    DOWN(0, 1),
    UP(0, -1),
    LEFT(-1, 0),
    RIGHT(1, 0);

    /** Xoay 90° theo chiều kim đồng hồ — cú xoay trọng lực chữ ký. */
    fun rotateCW(): Direction = when (this) {
        DOWN -> LEFT
        LEFT -> UP
        UP -> RIGHT
        RIGHT -> DOWN
    }

    fun rotateCCW(): Direction = when (this) {
        DOWN -> RIGHT
        RIGHT -> UP
        UP -> LEFT
        LEFT -> DOWN
    }
}
