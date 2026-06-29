package com.gravityjelly.core

data class ClearedLines(
    val rows: List<Int>,
    val cols: List<Int>,
) {
    val count: Int get() = rows.size + cols.size
    val isEmpty: Boolean get() = count == 0
}

fun findFullLines(grid: Grid): ClearedLines {
    val fullRows = (0 until grid.size).filter { y ->
        (0 until grid.size).all { x -> !grid.isEmpty(x, y) }
    }
    val fullCols = (0 until grid.size).filter { x ->
        (0 until grid.size).all { y -> !grid.isEmpty(x, y) }
    }
    return ClearedLines(fullRows, fullCols)
}

/**
 * Xóa đồng thời mọi hàng/cột trong [lines]. Ô giao điểm chỉ tính một lần.
 * Trả về số ô duy nhất đã xóa.
 */
fun clearLines(grid: Grid, lines: ClearedLines): Int {
    val toClear = mutableSetOf<Vec>()
    for (row in lines.rows) {
        for (x in 0 until grid.size) toClear.add(Vec(x, row))
    }
    for (col in lines.cols) {
        for (y in 0 until grid.size) toClear.add(Vec(col, y))
    }
    for (v in toClear) {
        grid.set(v.x, v.y, null)
    }
    return toClear.size
}

/** Tập ô thuộc các hàng/cột trong [lines] (dùng làm seed cho trọng lực cục bộ sau xóa). */
fun lineCells(lines: ClearedLines, size: Int): Set<Vec> {
    val cells = HashSet<Vec>()
    for (row in lines.rows) for (x in 0 until size) cells.add(Vec(x, row))
    for (col in lines.cols) for (y in 0 until size) cells.add(Vec(col, y))
    return cells
}

object Scoring {
    fun clearScore(cellsCleared: Int, linesCleared: Int, comboLevel: Int = 1): Int =
        cellsCleared * linesCleared * comboLevel

    /**
     * Điểm khi GHÉP (siêu khối/cầu vồng): số ô gom × combo × [mult].
     * [mult]=2 cho hàng/cột đầy ĐƠN SẮC (thưởng color-clear), =1 cho 3×3 / cấp 2.
     */
    fun mergeScore(cellsMerged: Int, comboLevel: Int, mult: Int = 1): Int =
        cellsMerged * comboLevel * mult
}
