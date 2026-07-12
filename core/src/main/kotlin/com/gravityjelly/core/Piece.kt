package com.gravityjelly.core

/**
 * Polyomino hình dạng cố định. Cells đã chuẩn hoá: gốc (0,0), sắp theo (y,x).
 * Mọi construction đi qua [of]/[rotateCW]/[rotateCCW] để đảm bảo canonical form.
 */
class Shape private constructor(val cells: List<Vec>) {

    val size: Int get() = cells.size
    val width: Int get() = cells.maxOf { it.x } + 1
    val height: Int get() = cells.maxOf { it.y } + 1

    fun at(x: Int, y: Int): List<Vec> = cells.map { Vec(it.x + x, it.y + y) }

    fun rotateCW(): Shape = create(cells.map { Vec(-it.y, it.x) })

    fun rotateCCW(): Shape = create(cells.map { Vec(it.y, -it.x) })

    override fun equals(other: Any?): Boolean = other is Shape && cells == other.cells
    override fun hashCode(): Int = cells.hashCode()
    override fun toString(): String = "Shape(${cells.joinToString()})"

    companion object {
        fun of(vararg offsets: Pair<Int, Int>): Shape =
            create(offsets.map { Vec(it.first, it.second) })

        fun of(cells: List<Vec>): Shape = create(cells)

        private fun create(raw: List<Vec>): Shape {
            require(raw.isNotEmpty()) { "Shape must have at least one cell" }
            val minX = raw.minOf { it.x }
            val minY = raw.minOf { it.y }
            val normalized = raw
                .map { Vec(it.x - minX, it.y - minY) }
                .sortedWith(compareBy({ it.y }, { it.x }))
            return Shape(normalized)
        }
    }
}

/**
 * Mảnh khay: [shape] + [color] (màu chủ đạo).
 * [cellColors] (tùy chọn) = màu RIÊNG từng ô, căn đúng thứ tự [Shape.cells]; null = mọi ô dùng [color].
 * Dùng cho khối đa sắc như vuông 3×3 (vành ngoài 1 màu, tâm 1 màu khác) — xem [PieceLibrary.dealt].
 */
data class Piece(
    val shape: Shape,
    val color: JellyColor,
    val cellColors: List<JellyColor>? = null,
) {
    /** Màu của ô thứ [index] (theo thứ tự [Shape.cells]); rơi về [color] nếu không có màu riêng. */
    fun colorAt(index: Int): JellyColor = cellColors?.getOrNull(index) ?: color
}
