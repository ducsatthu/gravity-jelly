package com.gravityjelly.core

sealed class PlacementResult {
    data class Success(val cells: List<Vec>) : PlacementResult()
    data object Invalid : PlacementResult()
}

/**
 * Hard-drop: chọn vị trí trên trục vuông góc trọng lực ([lateralIndex]),
 * mảnh rơi theo [gravity] tới điểm chạm đầu tiên — KHÔNG xuyên khe.
 */
fun hardDrop(
    grid: Grid,
    piece: Piece,
    lateralIndex: Int,
    gravity: Direction,
): PlacementResult {
    val shape = piece.shape
    val isVertical = gravity.dy != 0

    val lateralSpan = if (isVertical) shape.width else shape.height
    if (lateralIndex < 0 || lateralIndex + lateralSpan > grid.size) {
        return PlacementResult.Invalid
    }

    val dropSpan = if (isVertical) shape.height else shape.width
    val dropStep = if (isVertical) gravity.dy else gravity.dx
    val dropStart = if (dropStep > 0) 0 else grid.size - dropSpan

    var lastValid: List<Vec>? = null
    var dropPos = dropStart

    while (dropPos in 0..(grid.size - dropSpan)) {
        val ox = if (isVertical) lateralIndex else dropPos
        val oy = if (isVertical) dropPos else lateralIndex
        val cells = shape.at(ox, oy)

        if (cells.all { grid.isEmpty(it.x, it.y) }) {
            lastValid = cells
            dropPos += dropStep
        } else {
            break
        }
    }

    return if (lastValid != null) PlacementResult.Success(lastValid) else PlacementResult.Invalid
}

fun canPlaceAnywhere(
    grid: Grid,
    piece: Piece,
    gravity: Direction,
): Boolean {
    val isVertical = gravity.dy != 0
    val lateralSpan = if (isVertical) piece.shape.width else piece.shape.height
    for (lateral in 0..(grid.size - lateralSpan)) {
        if (hardDrop(grid, piece, lateral, gravity) is PlacementResult.Success) return true
    }
    return false
}

/**
 * Đặt tự do tại offset [ox],[oy]: mọi ô đích phải trong lưới và rỗng.
 * KHÔNG rơi theo trọng lực ở bước này — neo/rơi do [applyClusterGravity] xử lý sau.
 */
fun freePlace(grid: Grid, piece: Piece, ox: Int, oy: Int): PlacementResult {
    val cells = piece.shape.at(ox, oy)
    return if (cells.all { grid.inBounds(it.x, it.y) && grid.isEmpty(it.x, it.y) }) {
        PlacementResult.Success(cells)
    } else {
        PlacementResult.Invalid
    }
}

/**
 * Tìm offset đặt-tự-do HỢP LỆ gần [desiredOx],[desiredOy] nhất, trong bán kính [radius] ô.
 * Cho phép "hít" ghost về chỗ khít gần nhất khi kéo: người chơi thả sớm, không phải canh từng
 * pixel tới đúng ô. Trả [PlacementResult.Success] với cells đã hít (suy ra offset bằng minX/minY
 * của cells vì Shape đã chuẩn hoá gốc (0,0)); [PlacementResult.Invalid] nếu không có chỗ khít nào
 * trong bán kính.
 *
 * Deterministic: quét vùng vuông cố định, chọn offset có khoảng cách Euclidean (bình phương) tới
 * điểm mong muốn nhỏ nhất. Khi NHIỀU ô cùng khoảng cách: ưu tiên ô nằm theo HƯỚNG NGÓN ĐANG KÉO
 * [dirX],[dirY] (mỗi trục −1/0/1; tích vô hướng với độ lệch càng lớn càng tốt) — kéo lên thì hít ô
 * phía trên, kéo phải thì hít ô bên phải… Hoà tiếp thì lệch DỌC ít hơn rồi lệch TRÁI ít hơn (fallback
 * cố định khi không có hướng). Không phụ thuộc Random/thứ tự iteration không ổn định.
 */
fun nearestFreePlacement(
    grid: Grid,
    piece: Piece,
    desiredOx: Int,
    desiredOy: Int,
    radius: Int,
    dirX: Int = 0,
    dirY: Int = 0,
): PlacementResult {
    val shape = piece.shape
    val maxOx = grid.size - shape.width
    val maxOy = grid.size - shape.height
    if (maxOx < 0 || maxOy < 0) return PlacementResult.Invalid

    var bestCells: List<Vec>? = null
    var bestDist = Int.MAX_VALUE
    var bestAlign = Int.MIN_VALUE
    var bestAbsDy = Int.MAX_VALUE
    var bestAbsDx = Int.MAX_VALUE
    for (oy in (desiredOy - radius)..(desiredOy + radius)) {
        if (oy < 0 || oy > maxOy) continue
        for (ox in (desiredOx - radius)..(desiredOx + radius)) {
            if (ox < 0 || ox > maxOx) continue
            val cells = shape.at(ox, oy)
            if (!cells.all { grid.isEmpty(it.x, it.y) }) continue
            val dx = ox - desiredOx
            val dy = oy - desiredOy
            val dist = dx * dx + dy * dy
            val align = dx * dirX + dy * dirY   // >0: cùng hướng kéo; <0: ngược hướng
            val absDx = if (dx < 0) -dx else dx
            val absDy = if (dy < 0) -dy else dy
            val better = when {
                dist != bestDist -> dist < bestDist
                align != bestAlign -> align > bestAlign
                absDy != bestAbsDy -> absDy < bestAbsDy
                else -> absDx < bestAbsDx
            }
            if (better) {
                bestDist = dist; bestAlign = align; bestAbsDy = absDy; bestAbsDx = absDx
                bestCells = cells
            }
        }
    }
    return if (bestCells != null) PlacementResult.Success(bestCells) else PlacementResult.Invalid
}

/**
 * Có tồn tại vị trí đặt tự do hợp lệ nào cho [piece] không (độc lập trọng lực).
 * Dùng cho điều kiện thua khi đặt-tự-do: còn chỗ khít là còn nước đi.
 */
fun canFreePlaceAnywhere(grid: Grid, piece: Piece): Boolean {
    val shape = piece.shape
    for (oy in 0..(grid.size - shape.height)) {
        for (ox in 0..(grid.size - shape.width)) {
            if (freePlace(grid, piece, ox, oy) is PlacementResult.Success) return true
        }
    }
    return false
}

fun place(grid: Grid, piece: Piece, cells: List<Vec>) {
    for (cell in cells) {
        grid.set(cell.x, cell.y, Grid.Cell(CellType.BLOCK, piece.color))
    }
}
