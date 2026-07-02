package com.gravityjelly.core

/**
 * Kết quả DỰ ĐOÁN nhịp đầu khi thả [Piece] tại một chỗ — dùng cho highlight lúc kéo ghost
 * ("thả xuống có ăn điểm / merge không?"). Toạ độ lưới, map thẳng sang cùng phép tính vẽ ghost.
 */
data class PlacementOutcome(
    /** true nếu đặt được (mọi ô đích trong lưới + rỗng). false ⇒ [NONE], không có preview. */
    val valid: Boolean,
    /** Ô mảnh sẽ chiếm (ghost). Rỗng khi [valid]=false. */
    val placedCells: List<Vec>,
    /** Ô sẽ bị XÓA (hàng/cột đầy, đã gồm dây chuyền kíp nổ) — highlight "ăn điểm". */
    val clearCells: Set<Vec>,
    /** Ô sẽ gom vào SIÊU KHỐI/CẦU VỒNG — highlight "merge". */
    val mergeCells: Set<Vec>,
    /** Tâm khối mới hình thành (vẽ gợi ý vương miện); null nếu nước này không merge. */
    val mergeCenter: Vec?,
    /** true nếu merge tạo CẦU VỒNG (lớp vỏ có thể phân biệt so với siêu khối đơn màu). */
    val formsRainbow: Boolean,
) {
    /** Thả xuống có ăn điểm (xóa hàng/cột hoặc gom siêu khối/cầu vồng) không. */
    val willScore: Boolean get() = clearCells.isNotEmpty() || mergeCells.isNotEmpty()

    companion object {
        val NONE = PlacementOutcome(false, emptyList(), emptySet(), emptySet(), null, false)
    }
}

/**
 * Dự đoán KẾT QUẢ NHỊP ĐẦU khi thả [piece] tại offset ([ox],[oy]). KHÔNG mutate [grid] thật
 * (chạy trên bản sao). Vì bàn LUÔN ở trạng thái đã resolve giữa các nước (không còn hàng đầy /
 * cụm ghép treo lơ lửng), mọi xóa/ghép tìm thấy sau khi đặt ĐỀU do chính nước này gây ra.
 *
 * Chỉ tính NHỊP ĐẦU, theo đúng thứ tự ưu tiên của [resolve]:
 *   PHA 0 hàng/cột ĐƠN SẮC → siêu khối · PHA 1 merge 3×3 / cầu vồng · PHA 2 xóa hàng/cột (+kíp nổ).
 * Không mô phỏng cascade sâu (các nhịp sau khi cụm sụp) — giữ preview ổn định, dễ đọc cho người chơi.
 */
fun previewPlacement(grid: Grid, piece: Piece, ox: Int, oy: Int): PlacementOutcome {
    val result = freePlace(grid, piece, ox, oy)
    if (result !is PlacementResult.Success) return PlacementOutcome.NONE
    return previewPlaced(grid, piece, result.cells)
}

/**
 * Như [previewPlacement] nhưng nhận sẵn [cells] HỢP LỆ đã tính (vd cells "hít" của
 * [nearestFreePlacement] khi kéo). [cells] phải trong lưới + rỗng — người gọi tự đảm bảo.
 */
fun previewPlaced(grid: Grid, piece: Piece, cells: List<Vec>): PlacementOutcome {
    val work = grid.copy()
    place(work, piece, cells)

    // PHA 0: hàng/cột đầy ĐƠN SẮC → siêu khối.
    findMonoLineSuper(work)?.let { m ->
        return PlacementOutcome(true, cells, emptySet(), m.cells.toHashSet(), m.center, false)
    }
    // PHA 1: merge 3×3 cùng màu / ba màu sọc (cầu vồng).
    findMergeMove(work)?.let { m ->
        return when (m) {
            is MergeMove.Super -> PlacementOutcome(true, cells, emptySet(), m.cells.toHashSet(), m.center, false)
            is MergeMove.Rainbow -> PlacementOutcome(true, cells, emptySet(), m.cells.toHashSet(), m.center, true)
        }
    }
    // PHA 2: xóa hàng/cột đầy (kèm dây chuyền kíp nổ nếu chạm siêu khối/cầu vồng).
    val lines = findFullLines(work)
    if (!lines.isEmpty) {
        val (cleared, _) = expandDetonations(work, lineCells(lines, work.size))
        return PlacementOutcome(true, cells, cleared, emptySet(), null, false)
    }
    return PlacementOutcome(true, cells, emptySet(), emptySet(), null, false)
}
