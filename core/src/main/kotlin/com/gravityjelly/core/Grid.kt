package com.gravityjelly.core

/**
 * Loại nội dung một ô lưới. Khớp schema JSON màn (level-design.md).
 * [VINE] = dây leo (World 2): ô cứng **không rơi** theo trọng lực/xoay (bám như rễ, xem
 * [isJelly]); mọc lan mỗi vài lượt ([growVines]); xoá dòng đi qua GỐC ([Grid.Cell.vineRoot]) →
 * diệt cả dây ([destroyVineOfRoot]); đốt mất kết nối với gốc thì khô héo ([wiltDisconnectedVines]).
 * [TARGET] = ô đích "giọt nước" (World 3 · Sông & Thác): ô mềm **rơi & đếm-đầy như ô thường**
 * (khác VINE), nhưng khi bị xoá hàng/cột (hoặc kíp nổ cuốn qua) thì vỡ → chấm CLEAR_TARGETS/MIXED
 * ([ResolveEvent.DropsCleared]). Một số màn chôn sâu dưới lớp khối → phải cascade nhiều tầng mới xoá.
 */
enum class CellType { EMPTY, BLOCK, STONE, TARGET, VINE }

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
        /** Chỉ dùng khi [type] = [CellType.VINE]: true = GỐC dây (target của màn); false = đốt thường. */
        val vineRoot: Boolean = false,
    ) {
        val isSuper: Boolean get() = superLevel > 0
        val isRainbow: Boolean get() = rainbow
        val isVineRoot: Boolean get() = type == CellType.VINE && vineRoot
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

/** Số ô đích "giọt nước" ([CellType.TARGET]) còn trên bàn (tiến độ CLEAR_TARGETS World 3). */
fun countTargetCells(grid: Grid): Int {
    var n = 0
    for (y in 0 until grid.size) for (x in 0 until grid.size)
        if (grid.get(x, y)?.type == CellType.TARGET) n++
    return n
}
