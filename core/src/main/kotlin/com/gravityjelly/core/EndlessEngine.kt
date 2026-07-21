package com.gravityjelly.core

data class EndlessState(
    val grid: Grid,
    val gravity: Direction,
    /** 3 ô khay cố định; null = ô đã đặt mảnh đi (các ô khác GIỮ nguyên vị trí, không dồn). */
    val tray: List<Piece?>,
    val rotationBudget: Int,
    val score: Int,
    val combo: Int,
    val stage: Int,
    val isGameOver: Boolean,
)

sealed class GameEvent {
    data class PiecePlaced(val piece: Piece, val cells: List<Vec>) : GameEvent()
    data class GravityRotated(val newGravity: Direction) : GameEvent()
    data class Settled(val moved: Boolean) : GameEvent()
    data class LinesCleared(
        val lines: ClearedLines,
        val cellsCleared: Int,
        val comboLevel: Int,
        val score: Int,
    ) : GameEvent()
    data class ClustersCollapsed(val moved: Boolean) : GameEvent()
    /** 9 ô cùng màu hợp nhất thành 1 siêu khối tại [at]; [absorbed] = ô bị thu. [score]/[comboLevel] cho HUD. */
    data class SuperFormed(
        val at: Vec,
        val color: JellyColor,
        val level: Int,
        val source: SuperSource,
        val absorbed: List<Vec>,
        val score: Int = 0,
        val comboLevel: Int = 0,
    ) : GameEvent()
    /**
     * Siêu khối tại [at] nổ; [cells] = footprint bị quét (cùng màu toàn bàn; +5×5 nếu cấp 2).
     * [isRainbow] = true khi detonator là CẦU VỒNG (lớp vỏ phân biệt nổ siêu khối ↔ nổ cầu vồng).
     */
    data class SuperDetonated(
        val at: Vec,
        val color: JellyColor,
        val level: Int,
        val cells: List<Vec>,
        val isRainbow: Boolean = false,
    ) : GameEvent()
    /**
     * 1 KHỐI CẦU VỒNG tại [at]; [absorbed] = ô bị thu. [level] = 0 cầu vồng thường;
     * = 2 CẦU VỒNG SIÊU CẤP (vương miện; nổ xoá sạch toàn bàn).
     */
    data class RainbowFormed(
        val at: Vec,
        val absorbed: List<Vec>,
        val score: Int = 0,
        val comboLevel: Int = 0,
        val level: Int = 0,
    ) : GameEvent()
    /** Combo leo thang đã hồi [amount] lượt xoay; [budgetAfter] là ngân sách sau khi cộng. */
    data class RotationRefunded(val amount: Int, val budgetAfter: Int) : GameEvent()
    data class StonesAdded(val positions: List<Vec>) : GameEvent()
    data class TrayDealt(val tray: List<Piece?>) : GameEvent()
    /** Combo bị reset bởi game layer (hết thời gian combo timer). */
    data class ComboExpired(val wasBefore: Int) : GameEvent()
    data object GameOver : GameEvent()
}

/**
 * Engine Endless headless, deterministic.
 * Input rời rạc → state mới + chuỗi sự kiện cho :game.
 * Cùng seed + cùng chuỗi input → cùng kết quả.
 */
class EndlessEngine(
    seed: Long,
    initialBudget: Int = DEFAULT_ROTATION_BUDGET,
    private val tuning: EndlessTuning = EndlessTuning(),
    initialGravity: Direction = Direction.DOWN,
) {
    private val rng = Rng(seed)
    private val grid = Grid()
    private var gravity = initialGravity
    private var stage = 1
    private var tray: List<Piece?>
    private var rotBudget = initialBudget
    private var score = 0
    private var combo = 0
    private var gameOver = false
    /** Tổng số lượt THẢ mảnh. */
    private var placeTurns = 0
    /** Chống hạn: số đợt RỦI RO (bậc ≥🟡) liên tiếp KHÔNG có mảnh thoát. Chạm ngưỡng → ép đợt kế có. */
    private var wavesSinceHelpful = 0
    private var wavesSinceSpecial = 0

    init {
        tray = dealTray()
    }

    /**
     * Ảnh chụp TOÀN BỘ state biến đổi (grid + rng + counters) để solver fork/thử-lui nhanh mà không
     * dựng lại engine. Cặp với [restore]. KHÔNG lộ ra :game/:app — chỉ solver headless dùng.
     */
    class Snapshot internal constructor(
        internal val grid: Grid,
        internal val gravity: Direction,
        internal val stage: Int,
        internal val tray: List<Piece?>,
        internal val rotBudget: Int,
        internal val score: Int,
        internal val combo: Int,
        internal val gameOver: Boolean,
        internal val placeTurns: Int,
        internal val wavesSinceHelpful: Int,
        internal val wavesSinceSpecial: Int,
        internal val rngState: ULong,
    )

    fun snapshot(): Snapshot = Snapshot(
        grid.copy(), gravity, stage, tray.toList(), rotBudget, score, combo,
        gameOver, placeTurns, wavesSinceHelpful, wavesSinceSpecial,
        rng.stateSnapshot(),
    )

    fun restore(s: Snapshot) {
        grid.loadFrom(s.grid)
        gravity = s.gravity
        stage = s.stage
        tray = s.tray
        rotBudget = s.rotBudget
        score = s.score
        combo = s.combo
        gameOver = s.gameOver
        placeTurns = s.placeTurns
        wavesSinceHelpful = s.wavesSinceHelpful
        wavesSinceSpecial = s.wavesSinceSpecial
        rng.stateRestore(s.rngState)
    }

    /**
     * Serialize TRỌN state ván thành chuỗi bền cho :app lưu qua process death (Bundle/DataStore).
     * Cặp với [loadSave]. Xem [EndlessSaveCodec].
     */
    fun encodeSave(): String = EndlessSaveCodec.encode(snapshot())

    /**
     * Khôi phục ván từ chuỗi [encodeSave]. Trả `false` nếu chuỗi hỏng/sai phiên bản (giữ nguyên
     * ván hiện tại) → lớp vỏ khởi ván mới thay vì crash.
     */
    fun loadSave(blob: String): Boolean {
        val s = EndlessSaveCodec.decode(blob) ?: return false
        restore(s)
        return true
    }

    fun state(): EndlessState = EndlessState(
        grid = grid.copy(),
        gravity = gravity,
        tray = tray.toList(),
        rotationBudget = rotBudget,
        score = score,
        combo = combo,
        stage = stage,
        isGameOver = gameOver,
    )

    /**
     * Đặt tự do tại offset [ox],[oy] (toạ độ gốc mảnh trên lưới).
     * Mảnh GHIM ĐÚNG chỗ thả — KHÔNG rơi (cho phép treo lửng). Trọng lực chỉ tác động
     * khi resolve có xóa hàng/cột: cụm mất đỡ mới sụp ([resolve] → [applyClusterGravity]).
     * Xoay trọng lực là hành động riêng mới dồn cả bàn đổ.
     */
    fun placePieceAt(trayIndex: Int, ox: Int, oy: Int): List<GameEvent> {
        if (gameOver) return emptyList()
        if (trayIndex !in tray.indices) return emptyList()

        val piece = tray[trayIndex] ?: return emptyList()
        val placeResult = freePlace(grid, piece, ox, oy)
        if (placeResult !is PlacementResult.Success) return emptyList()

        place(grid, piece, placeResult.cells)

        val events = mutableListOf<GameEvent>()
        events.add(GameEvent.PiecePlaced(piece, placeResult.cells))

        finishTurn(trayIndex, events)
        return events
    }

    fun placePiece(trayIndex: Int, lateralIndex: Int): List<GameEvent> {
        if (gameOver) return emptyList()
        if (trayIndex !in tray.indices) return emptyList()

        val piece = tray[trayIndex] ?: return emptyList()
        val dropResult = hardDrop(grid, piece, lateralIndex, gravity)
        if (dropResult !is PlacementResult.Success) return emptyList()

        place(grid, piece, dropResult.cells)

        val events = mutableListOf<GameEvent>()
        events.add(GameEvent.PiecePlaced(piece, dropResult.cells))

        finishTurn(trayIndex, events)
        return events
    }

    /** Phần chung sau khi đặt mảnh: resolve cascade, rút khay, sang chặng, kiểm tra thua. */
    private fun finishTurn(trayIndex: Int, events: MutableList<GameEvent>) {
        val prevCombo = combo
        val resolveResult = resolve(grid, gravity, combo, tuning.superMergeEnabled)
        score += resolveResult.totalScore
        // Combo cộng dồn qua các nước; chỉ reset khi nước thả block KHÔNG xóa lẫn KHÔNG hợp nhất.
        // Hợp nhất siêu khối là nước "có ích" → GIỮ combo (endCombo == combo cũ khi không xóa).
        // comboTimeBased: nước vô ích GIỮ combo — game layer quản lý timer 10s reset.
        combo = if (resolveResult.cleared || resolveResult.formedSuper) resolveResult.endCombo
            else if (tuning.comboTimeBased) combo
            else 0
        applyComboRefund(prevCombo, resolveResult.endCombo, events)
        resolveResult.events.mapTo(events) { it.toGameEvent() }

        placeTurns++

        // Set null tại đúng ô vừa đặt — GIỮ vị trí các ô còn lại (không dồn trái).
        tray = tray.toMutableList().also { it[trayIndex] = null }

        if (tray.all { it == null }) {
            advanceStage(events)
        }

        if (checkGameOver()) {
            gameOver = true
            events.add(GameEvent.GameOver)
        }
    }

    /**
     * Game layer gọi khi combo timer hết hạn (comboTimeBased). Trả event nếu combo > 0 (đã reset).
     */
    fun resetCombo(): GameEvent? {
        if (combo <= 0) return null
        val was = combo
        combo = 0
        return GameEvent.ComboExpired(was)
    }

    fun rotateGravity(cw: Boolean): List<GameEvent> {
        if (gameOver) return emptyList()
        if (rotBudget <= 0) return emptyList()

        gravity = if (cw) gravity.rotateCW() else gravity.rotateCCW()
        rotBudget--

        val events = mutableListOf<GameEvent>()
        events.add(GameEvent.GravityRotated(gravity))

        val settled = applyClusterGravity(grid, gravity)
        events.add(GameEvent.Settled(settled))

        val prevCombo = combo
        val resolveResult = resolve(grid, gravity, combo, tuning.superMergeEnabled)
        score += resolveResult.totalScore
        combo = resolveResult.endCombo
        applyComboRefund(prevCombo, resolveResult.endCombo, events)
        resolveResult.events.mapTo(events) { it.toGameEvent() }

        if (checkGameOver()) {
            gameOver = true
            events.add(GameEvent.GameOver)
        }

        return events
    }

    /**
     * Hồi lượt xoay khi combo leo thang (CHUNG cho cả đặt mảnh lẫn xoay) — [ComboReward].
     * Cộng vào ngân sách, không vượt [EndlessTuning.rotationBudgetCap], và phát sự kiện nếu có hồi.
     */
    private fun applyComboRefund(before: Int, after: Int, events: MutableList<GameEvent>) {
        if (!tuning.comboRefundsRotation) return
        val want = ComboReward.rotationRefund(before, after)
        if (want <= 0) return
        val newBudget = minOf(rotBudget + want, tuning.rotationBudgetCap)
        val granted = newBudget - rotBudget
        if (granted <= 0) return
        rotBudget = newBudget
        events.add(GameEvent.RotationRefunded(granted, rotBudget))
    }

    private fun checkGameOver(): Boolean {
        if (tray.any { it != null && canFreePlaceAnywhere(grid, it) }) return false
        if (rotBudget <= 0) return true

        for (dir in Direction.entries) {
            if (dir == gravity) continue
            val testGrid = grid.copy()
            applyClusterGravity(testGrid, dir)
            resolve(testGrid, dir, mergeEnabled = tuning.superMergeEnabled)
            if (tray.any { it != null && canFreePlaceAnywhere(testGrid, it) }) return false
        }

        return true
    }

    private fun dealTray(): List<Piece> {
        val pool = tuning.poolFor(stage)
        val cfg = tuning.antiDrought
            ?: return List(TrayGenerator.TRAY_SIZE) {
                PieceLibrary.dealt(shape = rng.pick(pool), color = rng.pick(JellyColor.entries))
            }
        // Chống hạn (Endless live): sinh đợt bảo đảm đường thoát + chèn khối đặc biệt định kỳ.
        val forceHelpful = wavesSinceHelpful >= cfg.pityWaves
        val forceSpecial = cfg.specialEveryWaves > 0 && wavesSinceSpecial >= cfg.specialEveryWaves
        val wave = WaveGenerator.deal(grid, pool, JellyColor.entries, rng, cfg, forceHelpful, forceSpecial)
        wavesSinceHelpful = when {
            wave.tier == WaveGenerator.Tier.GREEN -> 0   // bàn thoáng → không tính hạn hán
            wave.hadHelpful -> 0
            else -> wavesSinceHelpful + 1
        }
        wavesSinceSpecial = if (wave.hadSpecial) 0 else wavesSinceSpecial + 1
        return wave.pieces
    }

    private fun advanceStage(events: MutableList<GameEvent>) {
        stage++
        tray = dealTray()
        if (tuning.replenishBudget) rotBudget = tuning.budgetFor(stage)
        val stones = scatterStones()
        if (stones.isNotEmpty()) events.add(GameEvent.StonesAdded(stones))
        events.add(GameEvent.TrayDealt(tray.toList()))
    }

    private fun scatterStones(): List<Vec> {
        if (stage < tuning.stoneStartStage) return emptyList()
        if ((stage - tuning.stoneStartStage) % tuning.stoneInterval != 0) return emptyList()

        val emptyCells = mutableListOf<Vec>()
        for (y in 0 until grid.size) for (x in 0 until grid.size)
            if (grid.isEmpty(x, y)) emptyCells.add(Vec(x, y))

        val count = minOf(tuning.stonesPerDrop, emptyCells.size)
        val placed = mutableListOf<Vec>()
        for (i in 0 until count) {
            val idx = rng.nextInt(emptyCells.size)
            val pos = emptyCells.removeAt(idx)
            grid.set(pos.x, pos.y, Grid.Cell(CellType.STONE))
            placed.add(pos)
        }
        return placed
    }

    companion object {
        const val DEFAULT_ROTATION_BUDGET = 3
    }
}

private fun ResolveEvent.toGameEvent(): GameEvent = when (this) {
    is ResolveEvent.LinesCleared -> GameEvent.LinesCleared(lines, cellsCleared, comboLevel, score)
    is ResolveEvent.ClustersCollapsed -> GameEvent.ClustersCollapsed(moved)
    is ResolveEvent.SuperFormed -> GameEvent.SuperFormed(at, color, level, source, absorbed, score, comboLevel)
    is ResolveEvent.SuperDetonated -> GameEvent.SuperDetonated(at, color, level, cells, isRainbow)
    is ResolveEvent.RainbowFormed -> GameEvent.RainbowFormed(at, absorbed, score, comboLevel, level)
}
