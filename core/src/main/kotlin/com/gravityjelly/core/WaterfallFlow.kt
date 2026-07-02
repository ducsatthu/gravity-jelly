package com.gravityjelly.core

/**
 * Cơ chế chữ ký World 3 · Sông & Thác — **thác nước tự nhiên**. Thuần/headless, deterministic.
 *
 * Nước BFS từ nguồn (mép "trên" theo gravity) xuống qua ô trống; gặp vật cản (BLOCK/STONE/VINE)
 * thì TÁCH 2 bên (vuông góc). Ô trống bị ngập = KHÔNG ĐẶT MẢNH ĐƯỢC. Nước chạm giọt (TARGET) =
 * PHÁ GIỌT. Xoay trọng lực = xoay cả thác (nguồn dời mép mới). Tính lại MỖI LƯỢT.
 */

data class FlowResult(
    val floodedCells: Set<Vec>,
    val dropsHit: List<Vec>,
)

fun calculateWaterfallFlow(grid: Grid, sourceLaterals: List<Int>, gravity: Direction): FlowResult {
    if (sourceLaterals.isEmpty()) return FlowResult(emptySet(), emptyList())

    val size = grid.size
    val sources = mapSourcesToGrid(sourceLaterals, gravity, size)
    val flooded = LinkedHashSet<Vec>()
    val dropsHit = mutableListOf<Vec>()
    val queue = ArrayDeque<Vec>()

    val flowDx = gravity.dx
    val flowDy = gravity.dy
    val perpDirs = perpendicularDirs(gravity)

    for (src in sources) {
        if (canWaterEnter(grid, src)) queue.add(src)
    }

    while (queue.isNotEmpty()) {
        val pos = queue.removeFirst()
        if (pos in flooded) continue
        if (!grid.inBounds(pos.x, pos.y)) continue
        if (!canWaterEnter(grid, pos)) continue

        val cell = grid.get(pos.x, pos.y)
        if (cell?.type == CellType.TARGET) dropsHit.add(pos)

        flooded.add(pos)

        val downX = pos.x + flowDx
        val downY = pos.y + flowDy
        if (grid.inBounds(downX, downY)) {
            if (canWaterEnter(grid, Vec(downX, downY))) {
                queue.add(Vec(downX, downY))
            } else {
                for ((pdx, pdy) in perpDirs) {
                    queue.add(Vec(pos.x + pdx, pos.y + pdy))
                }
            }
        }
    }

    return FlowResult(
        flooded,
        dropsHit.sortedWith(compareBy({ it.y }, { it.x })),
    )
}

private fun canWaterEnter(grid: Grid, pos: Vec): Boolean {
    if (!grid.inBounds(pos.x, pos.y)) return false
    val cell = grid.get(pos.x, pos.y) ?: return true
    return cell.type == CellType.TARGET
}

private fun mapSourcesToGrid(laterals: List<Int>, gravity: Direction, size: Int): List<Vec> =
    laterals.mapNotNull { lat ->
        if (lat < 0 || lat >= size) return@mapNotNull null
        when (gravity) {
            Direction.DOWN -> Vec(lat, 0)
            Direction.UP -> Vec(lat, size - 1)
            Direction.LEFT -> Vec(size - 1, lat)
            Direction.RIGHT -> Vec(0, lat)
        }
    }

private fun perpendicularDirs(gravity: Direction): List<Pair<Int, Int>> = when (gravity) {
    Direction.DOWN, Direction.UP -> listOf(-1 to 0, 1 to 0)
    Direction.LEFT, Direction.RIGHT -> listOf(0 to -1, 0 to 1)
}
