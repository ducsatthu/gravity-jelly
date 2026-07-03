package com.gravityjelly.core

/**
 * Tìm tất cả cụm (thành phần liên thông 4-kề) các ô jelly **cùng màu** trên lưới.
 * Hai ô khác màu KHÔNG thuộc cùng cụm — nền cho luật neo "jelly dính theo màu".
 * STONE không thuộc cụm nào. Cells trong mỗi cụm sắp theo (y, x) — deterministic.
 */
fun findClusters(grid: Grid): List<List<Vec>> {
    val visited = Array(grid.size) { BooleanArray(grid.size) }
    val clusters = mutableListOf<List<Vec>>()
    for (y in 0 until grid.size) {
        for (x in 0 until grid.size) {
            if (!visited[y][x] && isJelly(grid, x, y)) {
                val color = grid.get(x, y)?.color
                val cluster = mutableListOf<Vec>()
                val queue = ArrayDeque<Vec>()
                queue.add(Vec(x, y))
                visited[y][x] = true
                while (queue.isNotEmpty()) {
                    val curr = queue.removeFirst()
                    cluster.add(curr)
                    for (dir in Direction.entries) {
                        val nx = curr.x + dir.dx
                        val ny = curr.y + dir.dy
                        if (grid.inBounds(nx, ny) && !visited[ny][nx] &&
                            isJelly(grid, nx, ny) && grid.get(nx, ny)?.color == color
                        ) {
                            visited[ny][nx] = true
                            queue.add(Vec(nx, ny))
                        }
                    }
                }
                clusters.add(cluster.sortedWith(compareBy({ it.y }, { it.x })))
            }
        }
    }
    return clusters
}

/**
 * Ô jelly = ô đầy KHÔNG bất động. STONE, VINE, TRASH đứng yên: không thuộc cụm, không rơi theo
 * trọng lực/xoay — nhưng vẫn là vật cản chặn cụm khác (grid.isEmpty=false).
 */
private fun isJelly(grid: Grid, x: Int, y: Int): Boolean {
    val t = grid.get(x, y)?.type ?: return false
    return t != CellType.STONE && t != CellType.VINE && t != CellType.TRASH
}

/**
 * Trọng lực CỤC BỘ sau khi xóa hàng/cột: CHỈ các ô jelly **nối liền** (chuỗi 4-kề,
 * KHÔNG phân màu) tới [seed] (các ô vừa bị xóa) mới rơi — cả tháp liên kết sụp theo.
 * Ô jelly thả lửng KHÔNG nối liền tới vùng xóa thì đứng yên (giữ nguyên vị trí).
 * Trong vùng "active", mỗi cụm CÙNG MÀU rơi nguyên khối, bị chặn bởi tường / đá /
 * ô bất động / cụm khác. Deterministic. Trả về true nếu có di chuyển.
 */
fun applyConnectedGravity(grid: Grid, gravity: Direction, seed: Set<Vec>): Boolean {
    // 1) flood vùng active: jelly nối liền (color-blind) tới ô kề bất kỳ ô seed
    val active = HashSet<Vec>()
    val queue = ArrayDeque<Vec>()
    fun tryAdd(x: Int, y: Int) {
        if (grid.inBounds(x, y) && isJelly(grid, x, y)) {
            val v = Vec(x, y)
            if (active.add(v)) queue.add(v)
        }
    }
    for (s in seed) for (dir in Direction.entries) tryAdd(s.x + dir.dx, s.y + dir.dy)
    while (queue.isNotEmpty()) {
        val c = queue.removeFirst()
        for (dir in Direction.entries) tryAdd(c.x + dir.dx, c.y + dir.dy)
    }
    if (active.isEmpty()) return false

    // 2) rơi: chỉ cụm cùng màu TRONG vùng active; ô ngoài active là vật cản bất động
    var anyMoved = false
    while (true) {
        val clusters = activeColorClusters(grid, active)
        val sorted = clusters.sortedByDescending { cluster ->
            cluster.maxOf { it.x * gravity.dx + it.y * gravity.dy }
        }

        val moves = mutableListOf<Pair<List<Vec>, List<Pair<Vec, Grid.Cell>>>>()
        for (cluster in sorted) {
            val clusterSet = cluster.toHashSet()
            val destinations = cluster.map { Vec(it.x + gravity.dx, it.y + gravity.dy) }
            val canMove = destinations.all { pos ->
                grid.inBounds(pos.x, pos.y) &&
                    (grid.isEmpty(pos.x, pos.y) || pos in clusterSet)
            }
            if (canMove) {
                val cellData = cluster.map { grid.get(it.x, it.y)!! }
                moves.add(cluster to destinations.zip(cellData))
            }
        }

        if (moves.isEmpty()) break
        anyMoved = true

        for ((old, _) in moves) {
            for (v in old) { grid.set(v.x, v.y, null); active.remove(v) }
        }
        for ((_, newCells) in moves) {
            for ((v, cell) in newCells) { grid.set(v.x, v.y, cell); active.add(v) }
        }
    }
    return anyMoved
}

/**
 * Cụm cùng màu (4-kề) CHỈ trong tập [active]; ô ngoài active không gộp (là vật cản).
 * Duyệt seed theo (y,x) để danh sách cụm deterministic.
 */
private fun activeColorClusters(grid: Grid, active: Set<Vec>): List<List<Vec>> {
    val visited = HashSet<Vec>()
    val clusters = mutableListOf<List<Vec>>()
    val ordered = active.sortedWith(compareBy({ it.y }, { it.x }))
    for (start in ordered) {
        if (start in visited) continue
        val color = grid.get(start.x, start.y)?.color
        val cluster = mutableListOf<Vec>()
        val queue = ArrayDeque<Vec>()
        queue.add(start); visited.add(start)
        while (queue.isNotEmpty()) {
            val c = queue.removeFirst()
            cluster.add(c)
            for (dir in Direction.entries) {
                val n = Vec(c.x + dir.dx, c.y + dir.dy)
                if (n in active && n !in visited && grid.get(n.x, n.y)?.color == color) {
                    visited.add(n); queue.add(n)
                }
            }
        }
        clusters.add(cluster.sortedWith(compareBy({ it.y }, { it.x })))
    }
    return clusters
}

/**
 * Vật lý cụm cứng: mỗi cụm rơi nguyên khối theo [gravity],
 * dừng khi chạm tường hoặc cụm khác — để lại lỗ hổng.
 * Lặp bước-1-ô; thứ tự sắp theo cạnh dẫn đầu; deterministic.
 * Trả về true nếu có bất kỳ di chuyển nào.
 */
fun applyClusterGravity(grid: Grid, gravity: Direction): Boolean {
    var anyMoved = false
    while (true) {
        val clusters = findClusters(grid)
        val sorted = clusters.sortedByDescending { cluster ->
            cluster.maxOf { it.x * gravity.dx + it.y * gravity.dy }
        }

        val moves = mutableListOf<Pair<List<Vec>, List<Pair<Vec, Grid.Cell>>>>()
        for (cluster in sorted) {
            val clusterSet = cluster.toHashSet()
            val destinations = cluster.map { Vec(it.x + gravity.dx, it.y + gravity.dy) }
            val canMove = destinations.all { pos ->
                grid.inBounds(pos.x, pos.y) &&
                    (grid.isEmpty(pos.x, pos.y) || pos in clusterSet)
            }
            if (canMove) {
                val cellData = cluster.map { grid.get(it.x, it.y)!! }
                moves.add(cluster to destinations.zip(cellData))
            }
        }

        if (moves.isEmpty()) break
        anyMoved = true

        for ((old, _) in moves) {
            for (v in old) grid.set(v.x, v.y, null)
        }
        for ((_, newCells) in moves) {
            for ((v, cell) in newCells) grid.set(v.x, v.y, cell)
        }
    }
    return anyMoved
}
