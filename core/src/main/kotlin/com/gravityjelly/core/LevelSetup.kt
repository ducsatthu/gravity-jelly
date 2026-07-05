package com.gravityjelly.core

/**
 * Cầu nối MÀN thiết kế → tham số [EndlessEngine]. Thuần Kotlin/headless (chạy cho solver/test).
 * Map vocab mảnh ở docs (`_level-spec.md`) sang [Shape] trong [PieceLibrary], và dựng preset/khay.
 *
 * World 1 dùng bộ hình mặc-định-ngang (I3 = I3H…, V3 = dọc). Người chơi KHÔNG tự xoay mảnh nên
 * mỗi tên ứng đúng một [Shape] canonical.
 */
fun shapeByName(name: String): Shape = when (name.uppercase()) {
    "1", "DOT" -> PieceLibrary.DOT
    "I2" -> PieceLibrary.I2H
    "I3" -> PieceLibrary.I3H
    "I4" -> PieceLibrary.I4H
    "I5" -> PieceLibrary.I5H
    "V3" -> PieceLibrary.I3V          // dọc cao 3
    "L3" -> PieceLibrary.L3_0
    "L4" -> PieceLibrary.L4_0
    "J4" -> PieceLibrary.J4_0
    "T4" -> PieceLibrary.T4_0
    "S4" -> PieceLibrary.S4
    "Z4" -> PieceLibrary.Z4
    "O4" -> PieceLibrary.O4
    "P5" -> PieceLibrary.PLUS
    else -> error("Tên mảnh không rõ: $name")
}

fun TrayPiece.toPiece(): Piece = Piece(shapeByName(shape), color)

/**
 * Preset màn → cặp (vị trí, ô lưới) cho [EndlessEngine]. BLOCK không màu → vàng; TARGET (giọt nước)
 * không màu → xanh dương (rơi & đếm-đầy như ô thường, cần màu để hiển thị/tính cụm).
 */
fun Level.toPresetCells(): List<Pair<Vec, Grid.Cell>> = preset.map { c ->
    val color = c.color ?: when (c.type) {
        CellType.BLOCK -> JellyColor.YELLOW
        CellType.TARGET -> JellyColor.BLUE
        else -> null
    }
    Vec(c.x, c.y) to Grid.Cell(c.type, color, vineRoot = c.vineRoot)
}

/** Khay phẳng của màn → chuỗi đợt 3 mảnh (deterministic). */
fun Level.toTrayScript(): List<List<Piece>> =
    tray.chunked(TrayGenerator.TRAY_SIZE).map { wave -> wave.map { it.toPiece() } }

/**
 * Tuning cho màn Campaign: **cơ chế ĐẦY ĐỦ như Endless ở MỌI màn** — LUÔN bật merge siêu khối/cầu vồng
 * (đặt 3×3 cùng màu/9 ô cùng màu/… luôn ghép, kể cả màn mục tiêu xóa-hàng/điểm; khay tutorial dùng ĐA
 * MÀU nên hàng/cột vẫn xóa thường, không hoá mono-super ngoài ý muốn). Không đá tự rơi, không replenish
 * ngân sách (màn quy định). Hồi-lượt-xoay theo combo giữ cơ chế chữ ký (chỉ tác dụng khi màn cho xoay).
 */
fun campaignTuning(level: Level): EndlessTuning = EndlessTuning(
    superMergeEnabled = true,
    replenishBudget = false,
    vineGrowEveryN = level.vineGrowEveryN,
    vineMaxSprouts = level.vineMaxSprouts,
    debrisPerTurn = level.debrisPerTurn,
    bossGravityEveryN = level.bossGravityEveryN,
    bossReviveEveryN = level.bossReviveEveryN,
    bossSpawnSourceEveryN = level.bossSpawnSourceEveryN,
    bossMaxSources = level.bossMaxSources,
    bossVineSpawnEveryN = level.bossVineSpawnEveryN,
    comboTimeBased = true,
)

/** Dựng engine đã cấu hình theo [level] (preset + khay cố định + trọng lực + ngân sách + tuning). */
fun EndlessEngine.Companion.forLevel(level: Level): EndlessEngine = EndlessEngine(
    seed = level.seed,
    initialBudget = level.rotationBudget,
    tuning = campaignTuning(level),
    preset = level.toPresetCells(),
    trayScript = level.toTrayScript(),
    initialGravity = level.gravity,
    waterSourceSpecs = level.waterSources,
)
