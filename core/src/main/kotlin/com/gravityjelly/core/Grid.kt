package com.gravityjelly.core

/** Loại nội dung một ô lưới. Khớp schema JSON màn (level-design.md). */
enum class CellType { EMPTY, BLOCK, STONE, TARGET }

/** Màu khối jelly (4 nhân vật chữ ký). Dùng cho hiển thị + cụm cùng màu. */
enum class JellyColor { YELLOW, MINT, PINK, BLUE }

/**
 * Lưới 9x9 thuần dữ liệu. KHÔNG chứa logic Android.
 * Đây là stub khung — luật chơi (hard-drop 4 hướng, physics cụm, resolve cascade)
 * sẽ thêm sau ở [com.gravityjelly.core] với unit test + golden test đầy đủ.
 */
class Grid(val size: Int = SIZE) {
    private val cells = Array(size) { arrayOfNulls<Cell>(size) }

    /**
     * Một ô lưới. [superLevel] = 0 là khối thường; ≥ 1 là **siêu khối** (gom 9 ô cùng màu).
     * Siêu khối vẫn mang [type] = BLOCK + [color] → tự động hành xử như jelly thường cho
     * trọng lực/cụm; chỉ khác khi bị cuốn vào lần xóa → nổ bán kính (xem [SuperBlock]).
     */
    data class Cell(
        val type: CellType,
        val color: JellyColor? = null,
        val superLevel: Int = 0,
        val rainbow: Boolean = false,
    ) {
        val isSuper: Boolean get() = superLevel > 0
        val isRainbow: Boolean get() = rainbow
    }

    fun get(x: Int, y: Int): Cell? = cells.getOrNull(y)?.getOrNull(x)

    fun set(x: Int, y: Int, cell: Cell?) {
        require(inBounds(x, y)) { "($x,$y) ngoài lưới" }
        cells[y][x] = cell
    }

    fun inBounds(x: Int, y: Int): Boolean = x in 0 until size && y in 0 until size

    fun isEmpty(x: Int, y: Int): Boolean = get(x, y) == null

    fun copy(): Grid {
        val g = Grid(size)
        for (y in 0 until size) for (x in 0 until size)
            cells[y][x]?.let { g.cells[y][x] = it }
        return g
    }

    companion object {
        const val SIZE = 9
    }
}
