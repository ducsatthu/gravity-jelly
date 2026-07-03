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
    /** World 3: ô trống bị nước ngập — KHÔNG đặt mảnh được. Rỗng nếu tắt thác. */
    val floodedCells: Set<Vec> = emptySet(),
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
        val survivingRoots: List<Vec> = emptyList(),
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
    /** Dây leo mọc lan thêm các đốt tại [cells] (World 2). */
    data class VineGrew(val cells: List<Vec>) : GameEvent()
    /** Xoá dòng qua GỐC → dây tan. [roots] = gốc bị diệt (chấm CLEAR_TARGETS); [cells] = mọi ô dây mất. */
    data class VineRootsCleared(val roots: List<Vec>, val cells: List<Vec>) : GameEvent()
    /** Vỡ ô đích "giọt nước" tại [drops] (World 3 · chấm CLEAR_TARGETS/MIXED). */
    data class DropsCleared(val drops: List<Vec>) : GameEvent()
    /** Đếm ngược rác giảm; [died] = ô vừa hết đếm ngược (thành rác chết). */
    data class TrashCountdownTicked(val died: List<Vec>) : GameEvent()
    /** Boss "Kẻ Đổ Rác" chèn ô rác cứng tại [positions] (World 2 · L20). */
    data class DebrisAdded(val positions: List<Vec>) : GameEvent()
    /** Boss "Thần Thác" (World 3 · L30) tự ĐẢO hướng trọng lực 180° → [newGravity]. */
    data class BossGravityFlipped(val newGravity: Direction) : GameEvent()
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
    /** Ô dựng sẵn cho màn Campaign (rỗng = bàn trống như Endless). Áp lúc khởi tạo. */
    private val preset: List<Pair<Vec, Grid.Cell>> = emptyList(),
    /**
     * Chuỗi khay CỐ ĐỊNH (mỗi đợt 3 mảnh) cho màn thiết kế — bỏ ngẫu nhiên. Phát hết đợt này
     * mới sang đợt kế; khi cạn script → quay lại deal RNG (đỡ dead-end cho prototype). Rỗng =
     * Endless (deal RNG từ đầu).
     */
    private val trayScript: List<List<Piece>> = emptyList(),
    initialGravity: Direction = Direction.DOWN,
    /** World 3 — vị trí nguồn thác nước (lateral 0..8). Rỗng = tắt thác. */
    private val waterSources: List<Int> = emptyList(),
) {
    private val rng = Rng(seed)
    private val grid = Grid()
    private var gravity = initialGravity
    private var stage = 1
    private var waveIdx = 0
    private var tray: List<Piece?>
    private var rotBudget = initialBudget
    private var score = 0
    private var combo = 0
    private var gameOver = false
    /** Số lượt THẢ mảnh kể từ lần dây leo mọc gần nhất (nhịp mọc = [EndlessTuning.vineGrowEveryN]). */
    private var placesSinceGrow = 0
    /** Tổng số lượt THẢ mảnh (boss "Kẻ Đổ Rác": qua ân hạn mới bắt đầu đổ rác). */
    private var placeTurns = 0
    /** World 3: ô trống bị thác ngập — cấm đặt mảnh. Tính lại mỗi lượt. */
    private var floodedCells: Set<Vec> = emptySet()

    init {
        for ((pos, cell) in preset) grid.set(pos.x, pos.y, cell)
        tray = dealTray()
        recalculateWaterfall(mutableListOf())
    }

    /**
     * Ảnh chụp TOÀN BỘ state biến đổi (grid + rng + counters) để solver fork/thử-lui nhanh mà không
     * dựng lại engine. Cặp với [restore]. KHÔNG lộ ra :game/:app — chỉ solver headless dùng.
     */
    class Snapshot internal constructor(
        internal val grid: Grid,
        internal val gravity: Direction,
        internal val stage: Int,
        internal val waveIdx: Int,
        internal val tray: List<Piece?>,
        internal val rotBudget: Int,
        internal val score: Int,
        internal val combo: Int,
        internal val gameOver: Boolean,
        internal val placesSinceGrow: Int,
        internal val placeTurns: Int,
        internal val floodedCells: Set<Vec>,
        internal val rngState: ULong,
    )

    fun snapshot(): Snapshot = Snapshot(
        grid.copy(), gravity, stage, waveIdx, tray.toList(), rotBudget, score, combo,
        gameOver, placesSinceGrow, placeTurns, floodedCells.toSet(), rng.stateSnapshot(),
    )

    fun restore(s: Snapshot) {
        grid.loadFrom(s.grid)
        gravity = s.gravity
        stage = s.stage
        waveIdx = s.waveIdx
        tray = s.tray
        rotBudget = s.rotBudget
        score = s.score
        combo = s.combo
        gameOver = s.gameOver
        placesSinceGrow = s.placesSinceGrow
        placeTurns = s.placeTurns
        floodedCells = s.floodedCells
        rng.stateRestore(s.rngState)
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
        floodedCells = floodedCells.toSet(),
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
        val cells = piece.shape.at(ox, oy)
        if (cells.any { it in floodedCells }) return emptyList()
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
        growVinesIfDue(events)
        tickTrashIfNeeded(events)
        spawnBossVineIfDue(events)
        dropDebrisIfDue(events)
        flipBossGravityIfDue(events)
        recalculateWaterfall(events)

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
     * Dây leo mọc lan (World 2): mỗi [EndlessTuning.vineGrowEveryN] lượt THẢ, mọc 1 đốt/dây. Đốt mới
     * (đếm vào ô đầy) có thể lấp đầy dòng → resolve tiếp, cộng dồn điểm/combo như một nhịp bình thường.
     */
    private fun growVinesIfDue(events: MutableList<GameEvent>) {
        if (tuning.vineGrowEveryN <= 0 || !hasVines(grid)) return
        // VỪA CẮT dây trong lượt này (phá gốc hoặc đốt héo mất kết nối → phát VineRootsCleared)?
        // HOÃN mọc & đặt LẠI nhịp: người chơi phải được hưởng nhát cắt. Nếu vẫn mọc ngay, dây sẽ
        // lấp lại đúng ô vừa mở trong CÙNG lượt → ô "mầm sắp tới" bị chặn, rồi lượt sau hoá cành
        // đếm ngược (đúng lỗi báo). Cắt xong ⇒ dây tạm ngưng, chờ đủ vineGrowEveryN lượt mới mọc lại.
        if (events.any { it is GameEvent.VineRootsCleared }) {
            placesSinceGrow = 0
            return
        }
        placesSinceGrow++
        if (placesSinceGrow < tuning.vineGrowEveryN) return
        placesSinceGrow = 0
        val grown = growVines(grid, gravity)
        if (grown.isEmpty()) return
        events.add(GameEvent.VineGrew(grown))
        foldResolve(events)
    }

    private fun tickTrashIfNeeded(events: MutableList<GameEvent>) {
        val died = tickTrashCountdown(grid)
        if (died.isNotEmpty()) events.add(GameEvent.TrashCountdownTicked(died))
    }

    /**
     * Boss "Kẻ Đổ Rác" (L20): sau [EndlessTuning.debrisGraceTurns] lượt ân hạn, mỗi lượt chèn
     * [EndlessTuning.debrisPerTurn] ô rác cứng (BLOCK — rơi/xoay/xoá như ô thường, §9) vào các ô
     * trống gần "trần" (cạnh ngược hướng trọng lực). Deterministic theo lưới + số lượt.
     */
    private fun dropDebrisIfDue(events: MutableList<GameEvent>) {
        if (tuning.debrisPerTurn <= 0 || placeTurns <= tuning.debrisGraceTurns) return
        val empties = ArrayList<Vec>()
        for (y in 0 until grid.size) for (x in 0 until grid.size)
            if (grid.isEmpty(x, y)) empties.add(Vec(x, y))
        // Gần trần nhất trước: rank theo hình chiếu lên hướng trọng lực (nhỏ = sát trần), rồi (y,x).
        empties.sortWith(compareBy({ it.x * gravity.dx + it.y * gravity.dy }, { it.y }, { it.x }))
        val n = minOf(tuning.debrisPerTurn, empties.size)
        if (n == 0) return
        val placed = ArrayList<Vec>(n)
        for (i in 0 until n) {
            val v = empties[i]
            val color = JellyColor.entries[(placeTurns + i) % JellyColor.entries.size]
            grid.set(v.x, v.y, Grid.Cell(CellType.BLOCK, color))
            placed.add(v)
        }
        // Rác vừa chèn có thể tạo cụm/lấp dòng → resolve tiếp.
        foldResolve(events)
        events.add(GameEvent.DebrisAdded(placed))
    }

    /**
     * Boss "Thần Thác" (World 3 · L30, archetype Tham Trọng Lực): cứ mỗi [EndlessTuning.bossGravityEveryN]
     * lượt THẢ, boss tự **đảo hướng trọng lực 180°** — cả bàn đổ ngược, ép người chơi giành lại nhịp bằng
     * ngân sách xoay và biến đòn của boss thành cascade/combo cho mình (bào máu). Deterministic theo số lượt.
     * KHÔNG tốn ngân sách xoay của người chơi. Chỉ đổi [gravity] → lớp render tự chạy hoạt cảnh xoay.
     */
    private fun flipBossGravityIfDue(events: MutableList<GameEvent>) {
        if (tuning.bossGravityEveryN <= 0) return
        if (placeTurns % tuning.bossGravityEveryN != 0) return
        gravity = gravity.rotateCW().rotateCW()   // 180° = đảo
        events.add(GameEvent.BossGravityFlipped(gravity))
        val settled = applyClusterGravity(grid, gravity)
        events.add(GameEvent.Settled(settled))
        foldResolve(events)                       // cascade sau khi đổ ngược → cộng combo/sát thương
    }

    /**
     * Boss "Thần Rừng" (W2 · L20): mỗi [EndlessTuning.bossVineSpawnEveryN] lượt, spawn 1 gốc vine
     * mới tại ô trống ngẫu nhiên (deterministic qua [rng]). Gốc mới bắt đầu mọc lan bình thường.
     */
    private fun spawnBossVineIfDue(events: MutableList<GameEvent>) {
        if (tuning.bossVineSpawnEveryN <= 0) return
        if (placeTurns % tuning.bossVineSpawnEveryN != 0) return
        val empties = ArrayList<Vec>()
        for (y in 0 until grid.size) for (x in 0 until grid.size)
            if (grid.isEmpty(x, y)) empties.add(Vec(x, y))
        if (empties.isEmpty()) return
        val pos = empties[rng.nextInt(empties.size)]
        grid.set(pos.x, pos.y, Grid.Cell(CellType.VINE, JellyColor.MINT, vineRoot = true))
        events.add(GameEvent.VineGrew(listOf(pos)))
        foldResolve(events)
    }

    /**
     * Cảnh báo boss SẮP ra chiêu (tell) cho HUD — null nếu màn không có chiêu định kỳ (vd boss combo thuần).
     * Chiêu bắn khi `placeTurns % N == 0` (sau khi [finishTurn] tăng placeTurns) → số lượt còn lại tới lần
     * kế = `N − (placeTurns % N)` (N khi vừa bắn hoặc chưa thả nước nào; 1 = ngay lượt sau). Deterministic.
     */
    fun bossTell(): BossTell? {
        val (period, kind) = when {
            tuning.bossGravityEveryN > 0 -> tuning.bossGravityEveryN to BossTellKind.GRAVITY_INVERT
            tuning.bossVineSpawnEveryN > 0 -> tuning.bossVineSpawnEveryN to BossTellKind.VINE_SPAWN
            else -> return null
        }
        return BossTell(kind, period - (placeTurns % period))
    }

    /**
     * Thác nước (W3): tính lại dòng chảy từ [waterSources] theo [gravity] hiện tại. Ô trống bị ngập
     * = cấm đặt mảnh. Giọt (TARGET) bị nước chạm = phá luôn (phát [GameEvent.DropsCleared]).
     */
    private fun recalculateWaterfall(events: MutableList<GameEvent>) {
        if (waterSources.isEmpty()) { floodedCells = emptySet(); return }
        val result = calculateWaterfallFlow(grid, waterSources, gravity)
        floodedCells = result.floodedCells
        if (result.dropsHit.isNotEmpty()) {
            for (v in result.dropsHit) grid.set(v.x, v.y, null)
            events.add(GameEvent.DropsCleared(result.dropsHit))
            val moved = applyClusterGravity(grid, gravity)
            if (moved) foldResolve(events)
            floodedCells = calculateWaterfallFlow(grid, waterSources, gravity).floodedCells
        }
    }

    /** Resolve thêm một nhịp sau khi lưới bị biến đổi ngoài lượt đặt (mọc dây / đổ rác); cộng dồn. */
    private fun foldResolve(events: MutableList<GameEvent>) {
        val prev = combo
        val r = resolve(grid, gravity, combo, tuning.superMergeEnabled)
        score += r.totalScore
        if (r.cleared || r.formedSuper) combo = r.endCombo
        applyComboRefund(prev, r.endCombo, events)
        r.events.mapTo(events) { it.toGameEvent() }
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

        recalculateWaterfall(events)

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
        if (tray.any { it != null && canFreePlaceNotFlooded(grid, it, floodedCells) }) return false
        if (rotBudget <= 0) return true

        for (dir in Direction.entries) {
            if (dir == gravity) continue
            val testGrid = grid.copy()
            applyClusterGravity(testGrid, dir)
            resolve(testGrid, dir, mergeEnabled = tuning.superMergeEnabled)
            val testFlooded = if (waterSources.isNotEmpty())
                calculateWaterfallFlow(testGrid, waterSources, dir).floodedCells else emptySet()
            if (tray.any { it != null && canFreePlaceNotFlooded(testGrid, it, testFlooded) }) return false
        }

        return true
    }

    private fun canFreePlaceNotFlooded(grid: Grid, piece: Piece, flooded: Set<Vec>): Boolean {
        if (flooded.isEmpty()) return canFreePlaceAnywhere(grid, piece)
        val shape = piece.shape
        for (oy in 0..(grid.size - shape.height)) {
            for (ox in 0..(grid.size - shape.width)) {
                val cells = shape.at(ox, oy)
                if (cells.all { grid.isEmpty(it.x, it.y) && it !in flooded }) return true
            }
        }
        return false
    }

    private fun dealTray(): List<Piece> {
        // Màn thiết kế: rút đợt kế trong script (đủ TRAY_SIZE; thiếu → chèn RNG, dư → cắt).
        if (waveIdx < trayScript.size) {
            val wave = trayScript[waveIdx]
            waveIdx++
            val pool = tuning.poolFor(stage)
            return List(TrayGenerator.TRAY_SIZE) { i ->
                wave.getOrNull(i) ?: Piece(rng.pick(pool), rng.pick(JellyColor.entries))
            }
        }
        val pool = tuning.poolFor(stage)
        return List(TrayGenerator.TRAY_SIZE) {
            Piece(shape = rng.pick(pool), color = rng.pick(JellyColor.entries))
        }
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
    is ResolveEvent.LinesCleared -> GameEvent.LinesCleared(lines, cellsCleared, comboLevel, score, survivingRoots)
    is ResolveEvent.ClustersCollapsed -> GameEvent.ClustersCollapsed(moved)
    is ResolveEvent.SuperFormed -> GameEvent.SuperFormed(at, color, level, source, absorbed, score, comboLevel)
    is ResolveEvent.SuperDetonated -> GameEvent.SuperDetonated(at, color, level, cells, isRainbow)
    is ResolveEvent.RainbowFormed -> GameEvent.RainbowFormed(at, absorbed, score, comboLevel, level)
    is ResolveEvent.VineRootsCleared -> GameEvent.VineRootsCleared(roots, cells)
    is ResolveEvent.DropsCleared -> GameEvent.DropsCleared(drops)
}
