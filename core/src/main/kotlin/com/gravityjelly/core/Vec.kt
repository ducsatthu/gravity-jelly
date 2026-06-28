package com.gravityjelly.core

data class Vec(val x: Int, val y: Int) {
    operator fun plus(other: Vec) = Vec(x + other.x, y + other.y)
}
