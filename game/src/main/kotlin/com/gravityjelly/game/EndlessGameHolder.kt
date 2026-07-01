package com.gravityjelly.game

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.geometry.Offset
import com.gravityjelly.core.EndlessEngine
import com.gravityjelly.core.EndlessState
import com.gravityjelly.core.EndlessTuning
import com.gravityjelly.core.GameEvent
import com.gravityjelly.core.Grid
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PlacementResult
import com.gravityjelly.core.nearestFreePlacement
import kotlin.math.floor

/** Loại phản hồi haptic theo sự kiện (lớp vỏ map sang rung, tôn trọng Settings.vibrate). */
enum class EffectKind { PLACE, CLEAR, COMBO }

/**
 * Cơ chế chơi mà người chơi vừa GẶP lần đầu — lớp vỏ ([com.gravityjelly.app] EndlessPlayScreen) map
 * sang popup dạy luật / mục cẩm nang tương ứng. Holder phát hiện từ chuỗi [GameEvent] (giữ ranh giới:
 * :game không biết id guide của :app). Một cơ chế chỉ vào hàng đợi MỘT lần / phiên (dedup); việc đã
 * xem chưa (bền hoá) do lớp vỏ lọc qua seenGuides.
 *
 * (Combo-hồi-lượt-xoay KHÔNG nằm đây — giữ path riêng [rotationRefillTick] để bảo toàn nhịp dạy 900ms.)
 */
enum class GameMechanic {
    GRAVITY_ROTATE,
    CLEAR_LINE,                  // xóa hàng HOẶC cột — cùng một luật (gộp, không tách)
    GRAVITY_DROP, STICKY_CLUSTER,
    FORM_SUPER1, FORM_RAINBOW, FORM_SUPER2, FORM_RAINBOW2,
    DETONATE_SUPER1, DETONATE_SUPER2, DETONATE_RAINBOW1, DETONATE_RAINBOW2,
}

/**
 * Combo burst để ăn mừng tại vùng resolve. [winX]/[winY] là toạ độ cửa sổ (px) của tâm
 * vùng combo trên bàn; lớp vỏ quy về toạ độ cục bộ rồi đặt [com.gravityjelly...ComboPopup].
 */
data class ComboBurst(val id: Long, val combo: Int, val winX: Float, val winY: Float)

/** State vỏ — Compose observe; CHỈ đổi khi có input (đặt mảnh / xoay), không mỗi frame. */
data class ShellState(
    val score: Int,
    val budget: Int,
    val combo: Int,
    val stage: Int,
    val tray: List<Piece?>,
    val gameOver: Boolean,
)

/**
 * Holder "ViewModel-like": giữ [EndlessEngine] NGOÀI Compose (CLAUDE.md §luồng một chiều).
 * - [shell]: Compose state cho HUD/khay/FAB — recompose khi điểm/budget/tray đổi.
 * - [boardRender]: dữ liệu sống cho Canvas (KHÔNG Compose state) — đọc mỗi frame.
 * Input rời rạc → engine cập nhật → [sync] kéo snapshot ra hai kênh trên.
 */
class EndlessGameHolder(
    seed: Long,
    initialBudget: Int = EndlessEngine.DEFAULT_ROTATION_BUDGET,
    tuning: EndlessTuning = EndlessTuning(),
) {
    private val engine = EndlessEngine(seed, initialBudget, tuning)

    val boardRender = BoardRender()
    val animator = BoardAnimator()

    /**
     * Callback phản hồi haptic (đặt mảnh / xóa / combo≥3). Lớp vỏ ([EndlessScreen]) cấp,
     * gate bằng cờ vibration của Settings. Giữ luồng một chiều: holder phát sự kiện, không tự rung.
     */
    var onEffect: ((EffectKind) -> Unit)? = null

    var shell by mutableStateOf(snapshotFrom(engine.state()))
        private set

    /**
     * Combo vừa nổ — overlay ăn mừng (×N + lời khen) đặt TẠI vùng resolve trên bàn
     * (combo hiếm → buộc ăn mừng vào đúng nơi vừa thả/xóa cho người chơi thấy liền).
     * [ComboBurst.winX]/[winY] = toạ độ cửa sổ (px) tâm vùng combo; null = chưa có.
     * Đổi identity (id) mỗi combo → lớp vỏ remount overlay để phát lại.
     */
    var comboBurst by mutableStateOf<ComboBurst?>(null)
        private set

    private var lastComboBurstId = 0L

    /**
     * Bộ đếm "combo vừa hồi lượt xoay" — tăng mỗi khi engine phát [GameEvent.RotationRefunded].
     * Lớp vỏ quan sát để bật phản hồi/popup dạy luật (xem EndlessPlayScreen). 0 = chưa hồi lần nào.
     */
    var rotationRefillTick by mutableStateOf(0L)
        private set

    /**
     * Hàng đợi cơ chế GẶP-LẦN-ĐẦU chờ dạy (theo thứ tự gặp). Lớp vỏ quan sát → chờ bàn lắng → hiện
     * popup tuần tự (lọc seenGuides), rồi gọi [consumeGuide] bỏ phần tử đầu. Dedup trong [encounteredMechanics]
     * để mỗi cơ chế chỉ vào hàng đợi một lần mỗi phiên.
     */
    var guideQueue by mutableStateOf<List<GameMechanic>>(emptyList())
        private set

    private val encounteredMechanics = HashSet<GameMechanic>()

    // ── trạng thái kéo-thả (plain fields; overlay đọc mỗi frame) ──
    var dragPiece: Piece? = null
        private set
    var dragWindowPos: Offset? = null
        private set

    private var dragIndex = -1
    private var dragOx = -1
    private var dragOy = -1

    /**
     * Nước đặt ĐANG CHỜ: người chơi thả mảnh trong khi bàn còn chiếu cascade. KHÔNG chặn cú kéo
     * (đỡ lỡ nhịp người chơi) — chỉ HOÃN việc áp: ghi lại nước rồi đặt NGAY khi playback kết thúc
     * (xem [flushPendingPlacement], do [BoardAnimator.onPlaybackEnd] gọi). Ghost giữ tại [ghost]
     * cho người chơi thấy chỗ sẽ đặt. Mỗi lúc chỉ giữ MỘT nước chờ (cascade ngắn, áp xong mở tiếp).
     */
    private class PendingPlacement(val index: Int, val ox: Int, val oy: Int, val ghost: GhostPreview)
    private var pendingPlacement: PendingPlacement? = null

    // Hướng ngón đang kéo (−1/0/1 mỗi trục), lấy từ chuyển động con trỏ để "hít" ghost theo hướng.
    private var dragDirX = 0
    private var dragDirY = 0
    private var dirSampleX = 0f   // điểm mốc lấy mẫu hướng; chuyển động nhỏ tích luỹ tới khi đủ ngưỡng
    private var dirSampleY = 0f
    private var hasDirSample = false
    // Ứng viên hướng MỚI đang chờ "giữ đủ lâu" mới chốt — chống đổi hướng tức thời khi ngón
    // nhích/đảo lúc cuối (xem [updateDragDirection]). Đồng hồ lấy từ animator.renderNanos().
    private var pendingDirX = 0
    private var pendingDirY = 0
    private var pendingDirSinceNanos = 0L

    // Ô lưới dưới con trỏ, có HYSTERESIS: giữ ô hiện tại tới khi con trỏ vượt hẳn mép ô thêm dải đệm
    // [CELL_HYST] mới lật sang ô mới. Chống ghost nhảy ô do rung tay (chỉ nhích nhẹ KHÔNG đổi chỗ thả),
    // và buộc phải kéo đủ xa mới đổi ô gợi ý. Int.MIN_VALUE = chưa có mốc (đầu cú kéo) → dùng floor.
    private var lastCol = Int.MIN_VALUE
    private var lastRow = Int.MIN_VALUE

    // bounds bàn (toạ độ window, px) để quy đổi con trỏ → ô lưới
    private var boardWinX = 0f
    private var boardWinY = 0f
    private var boardSizePx = 0f

    /** Mật độ màn hình (px/dp) — lớp vỏ set; dùng quy các hằng "nhấc mảnh" theo dp. */
    var density: Float = 1f

    val boardCellPx: Float get() = if (boardSizePx > 0f) boardSizePx / Grid.SIZE else 0f

    /**
     * "Nhấc mảnh" khi kéo (px): mảnh + ghost hiện CAO HƠN ngón tay để ngón không che chỗ thả.
     * Quy theo kích thước VẬT LÝ ~[DRAG_LIFT_MM]mm (cỡ ngón tay thật), độc lập kích thước bàn —
     * 1mm ≈ 160/25.4 dp. Con trỏ → ô lưới quy theo điểm đã nhấc.
     */
    private val dragLiftPx: Float get() = DRAG_LIFT_MM * (160f / 25.4f) * density

    init {
        // Playback combo tuần tự: animator phát combo + haptic theo TỪNG nhịp (không dồn một lần).
        animator.onComboBurst = { captureComboBurst() }
        animator.onClearStep = { comboLevel ->
            onEffect?.invoke(if (comboLevel >= 3) EffectKind.COMBO else EffectKind.CLEAR)
        }
        // Cascade vừa chiếu xong → áp nước người chơi đã thả trong lúc đó (đặt-hoãn).
        animator.onPlaybackEnd = { flushPendingPlacement() }
        sync()
    }

    fun setBoardBounds(x: Float, y: Float, sizePx: Float) {
        boardWinX = x; boardWinY = y; boardSizePx = sizePx
    }

    // ── input ──

    fun rotate(cw: Boolean) {
        if (shell.gameOver) return
        if (animator.isPlaying) return   // khoá input khi bàn đang chiếu cascade (tránh lệch thấy/truth)
        val pre = boardRender.grid.copy()
        val preGravity = boardRender.gravity
        val events = engine.rotateGravity(cw)
        sync()
        if (events.isNotEmpty()) {
            animator.ingest(events, pre, preGravity, boardRender.grid, boardRender.gravity)
            dispatchFeedback(events)
            detectRotationRefill(events)
            detectGuideMechanics(events)
        }
    }

    /**
     * Bắt đầu kéo mảnh khay. CHO PHÉP kéo cả khi bàn đang chiếu cascade — không chặn cú kéo của
     * người chơi (đỡ lỡ nhịp); việc ĐẶT sẽ hoãn tới khi cascade xong (xem [commitDrag]). Ghost neo
     * theo [boardRender].grid (đã là truth cuối, ổn định suốt playback) nên chỗ dự kiến luôn đúng.
     * Trả false khi đã thua, hoặc còn MỘT nước chờ chưa áp (giữ một nước chờ mỗi lúc).
     */
    fun beginDrag(trayIndex: Int): Boolean {
        if (shell.gameOver) return false
        if (pendingPlacement != null) return false   // còn nước chờ áp khi cascade xong → khoan kéo tiếp
        val p = shell.tray.getOrNull(trayIndex) ?: return false
        dragIndex = trayIndex
        dragPiece = p
        dragOx = -1; dragOy = -1
        dragDirX = 0; dragDirY = 0; hasDirSample = false
        pendingDirX = 0; pendingDirY = 0; pendingDirSinceNanos = 0L
        lastCol = Int.MIN_VALUE; lastRow = Int.MIN_VALUE
        boardRender.ghost = null
        return true
    }

    /**
     * Con trỏ tại (window) → "hít" ghost về chỗ khít HỢP LỆ gần ô dưới con trỏ nhất, trong bán
     * kính [SNAP_RADIUS] ô (xem [nearestFreePlacement]). Người chơi không phải kéo tới đúng ô:
     * vừa lại gần là ghost đã hiện vị trí sẽ thả → thả sớm, đỡ mất nhịp. KHÔNG hard-drop.
     */
    fun dragTo(windowX: Float, windowY: Float) {
        if (dragIndex < 0) return
        val cell = boardCellPx
        val piece = dragPiece
        // Nhấc điểm tác động lên trên ngón tay; mảnh nổi vẽ cao thêm 10dp so với ghost.
        val lift = dragLiftPx
        val liftedY = windowY - lift
        dragWindowPos = Offset(windowX, liftedY - 10f * density)
        if (cell <= 0f || piece == null) { clearGhost(); return }

        updateDragDirection(windowX, liftedY)

        // Quy con trỏ → ô có hysteresis: ô chỉ đổi khi con trỏ vượt hẳn mép ô (dải đệm [CELL_HYST]).
        // Nhờ đó rung tay nhẹ KHÔNG lệch chỗ thả, và phải kéo đủ xa mới đổi ô gợi ý (xem [stickyCell]).
        val col = stickyCell((windowX - boardWinX) / cell, lastCol)
        val row = stickyCell((liftedY - boardWinY) / cell, lastRow)
        lastCol = col; lastRow = row
        // Con trỏ ra hẳn ngoài bàn (margin 1 ô) → không có ý định thả.
        if (col < -1 || row < -1 || col > Grid.SIZE || row > Grid.SIZE) { clearGhost(); return }

        val shape = piece.shape
        val desiredOx = col - shape.width / 2
        val desiredOy = row - shape.height / 2

        when (val res = nearestFreePlacement(boardRender.grid, piece, desiredOx, desiredOy, SNAP_RADIUS, dragDirX, dragDirY)) {
            is PlacementResult.Success -> {
                // Shape chuẩn hoá gốc (0,0) → offset = min toạ độ của cells đã hít.
                val cells = res.cells
                dragOx = cells.minOf { it.x }
                dragOy = cells.minOf { it.y }
                boardRender.ghost = GhostPreview(cells, piece.color)
            }
            PlacementResult.Invalid -> clearGhost()
        }
    }

    /**
     * Cập nhật hướng kéo [dragDirX]/[dragDirY] từ chuyển động con trỏ — gợi ý hướng "hít" ghost.
     * Chống nhạy 2 lớp để người chơi không bị đặt sai khi nhích/đảo hướng lúc cuối:
     *  1. NGƯỠNG QUÃNG: phải dời ≥ [DIR_THRESHOLD_DP] kể từ mốc mới tính một hướng ứng viên (lọc rung).
     *  2. ĐỘ TRỄ THỜI GIAN: hướng MỚI (khác hướng đang dùng) chỉ được CHỐT sau khi giữ liên tục
     *     ≥ [DIR_COMMIT_NANOS]. Ngón gần đứng yên → GIỮ hướng cũ + reset đồng hồ → khi dừng lại để
     *     thả tay, ghost không nhảy. Nhờ đó "đẩy lên rồi nhích xuống thả" không lật hướng tức thì.
     */
    /**
     * Lượng tử hoá toạ độ ô có HYSTERESIS. [f] là toạ độ ô phân số của con trỏ (px / cell). Giữ ô cũ
     * [prev] chừng nào con trỏ còn trong khoảng [prev − CELL_HYST, prev + 1 + CELL_HYST]; ra khỏi dải
     * mới nhảy sang ô mới ([floor]). Hai ô kề nhau chia sẻ vùng chồng lấn rộng 2·[CELL_HYST] nên rung
     * quanh mép ô không lật đi lật lại — đứng yên đủ lâu để thả, và phải kéo hẳn > ~(0.5 + CELL_HYST) ô
     * mới đổi ô (không đổi vì nhích tay). [prev] = Int.MIN_VALUE (đầu cú kéo) → chưa có mốc, lấy floor.
     */
    private fun stickyCell(f: Float, prev: Int): Int = when {
        prev == Int.MIN_VALUE -> floor(f).toInt()
        f < prev - CELL_HYST -> floor(f).toInt()
        f >= prev + 1 + CELL_HYST -> floor(f).toInt()
        else -> prev
    }

    private fun updateDragDirection(x: Float, y: Float) {
        val now = animator.renderNanos()
        if (!hasDirSample) {
            dirSampleX = x; dirSampleY = y; hasDirSample = true
            pendingDirX = dragDirX; pendingDirY = dragDirY; pendingDirSinceNanos = now
            return
        }
        val dx = x - dirSampleX
        val dy = y - dirSampleY
        val threshold = DIR_THRESHOLD_DP * density
        if (dx * dx + dy * dy < threshold * threshold) {
            // Ngón gần đứng yên / đi chậm → giữ hướng hiện tại, reset đồng hồ đổi-hướng.
            pendingDirX = dragDirX; pendingDirY = dragDirY; pendingDirSinceNanos = now
            return
        }
        // Đã dời đủ xa → đo hướng ứng viên theo trục trội, rồi dời mốc đo đoạn kế.
        val axisEps = threshold * 0.5f
        val candX = if (dx > axisEps) 1 else if (dx < -axisEps) -1 else 0
        val candY = if (dy > axisEps) 1 else if (dy < -axisEps) -1 else 0
        dirSampleX = x; dirSampleY = y

        if (candX == dragDirX && candY == dragDirY) {
            // vẫn hướng cũ → giữ, reset pending
            pendingDirX = candX; pendingDirY = candY; pendingDirSinceNanos = now
            return
        }
        if (candX != pendingDirX || candY != pendingDirY) {
            // vừa phát hiện hướng mới → bắt đầu đếm độ trễ, CHƯA áp dụng
            pendingDirX = candX; pendingDirY = candY; pendingDirSinceNanos = now
            return
        }
        // hướng mới đã giữ liên tục đủ lâu → mới chốt
        if (now - pendingDirSinceNanos >= DIR_COMMIT_NANOS) {
            dragDirX = candX; dragDirY = candY
        }
    }

    /**
     * Thả mảnh. Ghost hợp lệ + bàn rảnh → đặt-tự-do ngay (cụm không neo sẽ rơi). Ghost hợp lệ
     * nhưng bàn CÒN chiếu cascade → KHÔNG áp ngay (sẽ cắt animation + lệch thấy/truth): ghi
     * [pendingPlacement], bỏ mảnh nổi nhưng GIỮ ghost; animator gọi [flushPendingPlacement] khi
     * playback xong → đặt thành công đúng chỗ dự kiến.
     */
    fun commitDrag() {
        val idx = dragIndex
        val ox = dragOx; val oy = dragOy
        val ghost = boardRender.ghost
        if (idx < 0 || ox < 0 || oy < 0 || ghost == null) { endDragState(); return }
        if (animator.isPlaying) {
            pendingPlacement = PendingPlacement(idx, ox, oy, ghost)
            // ngón đã nhả: bỏ mảnh nổi, GIỮ ghost để người chơi thấy chỗ sẽ đặt khi cascade xong
            dragIndex = -1; dragOx = -1; dragOy = -1
            dragPiece = null; dragWindowPos = null
            return
        }
        endDragState()
        applyPlacement(idx, ox, oy)
    }

    fun cancelDrag() = endDragState()

    /** Gửi nước đặt tới engine + nạp animation. Dùng cho cả đặt ngay lẫn flush nước chờ. */
    private fun applyPlacement(index: Int, ox: Int, oy: Int) {
        val pre = boardRender.grid.copy()
        val preGravity = boardRender.gravity
        val events = engine.placePieceAt(index, ox, oy)
        sync()
        if (events.isNotEmpty()) {
            animator.ingest(events, pre, preGravity, boardRender.grid, boardRender.gravity)
            dispatchFeedback(events)
            detectRotationRefill(events)
            detectGuideMechanics(events)
        }
    }

    /**
     * Áp nước đặt ĐANG CHỜ ngay khi cascade chiếu xong (gọi bởi [BoardAnimator.onPlaybackEnd]).
     * Tới đây bàn đã ổn định = đúng truth mà ghost đã neo → đặt thành công đúng chỗ dự kiến rồi
     * mới mở cho nước kế. Bỏ qua nếu đã thua.
     */
    private fun flushPendingPlacement() {
        val p = pendingPlacement ?: return
        pendingPlacement = null
        boardRender.ghost = null
        if (shell.gameOver) return
        applyPlacement(p.index, p.ox, p.oy)
    }

    /**
     * Animator phát combo (≥2) theo nhịp playback → callback [BoardAnimator.onComboBurst] gọi
     * hàm này: quy tâm vùng resolve (toạ độ ô) sang px cửa sổ rồi phát [comboBurst] để overlay
     * ăn mừng đặt đúng chỗ, đúng lúc nhịp combo đó vỡ trên bàn.
     */
    private fun captureComboBurst() {
        val id = animator.comboBurstId
        if (id == lastComboBurstId) return
        lastComboBurstId = id
        val cell = boardCellPx
        if (cell <= 0f) { comboBurst = null; return }   // chưa đo được bàn → bỏ qua an toàn
        comboBurst = ComboBurst(
            id     = id,
            combo  = animator.comboBurstCombo,
            winX   = boardWinX + animator.comboBurstCellX * cell,
            winY   = boardWinY + animator.comboBurstCellY * cell,
        )
    }

    /**
     * Haptic "đặt mảnh" tại thời điểm ingest. Xóa/combo KHÔNG rung ở đây nữa — chúng phát
     * theo TỪNG nhịp playback qua [BoardAnimator.onClearStep] (rung đúng lúc ô vỡ, không dồn).
     */
    private fun dispatchFeedback(events: List<GameEvent>) {
        val cb = onEffect ?: return
        var placed = false; var cleared = false
        for (i in events.indices) {
            when (events[i]) {
                is GameEvent.PiecePlaced  -> placed = true
                is GameEvent.LinesCleared -> cleared = true
                else -> {}
            }
        }
        // Nước đi có xóa → để nhịp xóa lo haptic; chỉ tick "đặt" khi đặt trơn không ăn điểm.
        if (placed && !cleared) cb(EffectKind.PLACE)
    }

    /**
     * Quét [GameEvent.RotationRefunded] trong nước vừa đi → tăng [rotationRefillTick] cho lớp vỏ.
     * Độc lập với haptic (chạy cả khi tắt rung) nên tách khỏi [dispatchFeedback].
     */
    private fun detectRotationRefill(events: List<GameEvent>) {
        for (i in events.indices) {
            if (events[i] is GameEvent.RotationRefunded) { rotationRefillTick++; return }
        }
    }

    /**
     * Quét chuỗi sự kiện → phát hiện cơ chế GẶP-LẦN-ĐẦU và nối vào [guideQueue] (giữ thứ tự gặp,
     * mỗi cơ chế chỉ một lần / phiên qua [encounteredMechanics]). Lớp vỏ map sang popup dạy luật.
     * `internal` (không private) để test khoá spec phát hiện (GuideMechanicDetectionTest).
     */
    internal fun detectGuideMechanics(events: List<GameEvent>) {
        var added = false
        val next = ArrayList(guideQueue)
        fun enqueue(m: GameMechanic) { if (encounteredMechanics.add(m)) { next.add(m); added = true } }
        for (e in events) {
            when (e) {
                // Lần đầu XOAY trọng lực → giới thiệu nút xoay + D-Pad (cơ chế chữ ký).
                is GameEvent.GravityRotated -> enqueue(GameMechanic.GRAVITY_ROTATE)
                is GameEvent.LinesCleared ->
                    if (e.lines.rows.isNotEmpty() || e.lines.cols.isNotEmpty()) enqueue(GameMechanic.CLEAR_LINE)
                // Cụm sụp có DI CHUYỂN (sau xóa/ghép) = lúc dạy được "trọng lực rơi" + "thạch dính
                // cụm" (đặt SAU clear trong stream → popup xóa-hàng hiện trước, rồi tới hai luật này).
                is GameEvent.ClustersCollapsed -> if (e.moved) {
                    enqueue(GameMechanic.GRAVITY_DROP)
                    enqueue(GameMechanic.STICKY_CLUSTER)
                }
                is GameEvent.SuperFormed ->
                    enqueue(if (e.level >= 2) GameMechanic.FORM_SUPER2 else GameMechanic.FORM_SUPER1)
                is GameEvent.RainbowFormed ->
                    enqueue(if (e.level >= 2) GameMechanic.FORM_RAINBOW2 else GameMechanic.FORM_RAINBOW)
                is GameEvent.SuperDetonated -> enqueue(
                    if (e.isRainbow) {
                        if (e.level >= 2) GameMechanic.DETONATE_RAINBOW2 else GameMechanic.DETONATE_RAINBOW1
                    } else {
                        if (e.level >= 2) GameMechanic.DETONATE_SUPER2 else GameMechanic.DETONATE_SUPER1
                    },
                )
                else -> {}
            }
        }
        if (added) guideQueue = next
    }

    /** Bỏ cơ chế đầu hàng đợi (lớp vỏ gọi sau khi đã hiện/đã bỏ qua popup tương ứng). */
    fun consumeGuide() {
        if (guideQueue.isNotEmpty()) guideQueue = guideQueue.drop(1)
    }

    // ── nội bộ ──

    private fun clearGhost() {
        dragOx = -1; dragOy = -1
        boardRender.ghost = null
    }

    private fun endDragState() {
        dragIndex = -1; dragOx = -1; dragOy = -1
        dragPiece = null; dragWindowPos = null
        boardRender.ghost = null
    }

    private fun sync() {
        val s = engine.state()
        boardRender.grid = s.grid
        boardRender.gravity = s.gravity
        fillClusterSizes(s.grid, boardRender.clusterSizes)
        shell = snapshotFrom(s)
    }

    private fun snapshotFrom(s: EndlessState) = ShellState(
        score = s.score,
        budget = s.rotationBudget,
        combo = s.combo,
        stage = s.stage,
        tray = s.tray,
        gameOver = s.isGameOver,
    )

    companion object {
        /** Khoảng "nhấc mảnh" khi kéo, tính theo mm vật lý (~cỡ đốt ngón tay) để ngón không che chỗ thả. */
        private const val DRAG_LIFT_MM = 15f

        /**
         * Bán kính "hít" ghost (ô) quanh ô dưới con trỏ: trong phạm vi này, ghost tự nhảy tới chỗ
         * khít hợp lệ gần nhất nên người chơi thả sớm, không cần canh đúng ô. Đủ rộng để thấy "tha
         * thứ" rõ rệt, đủ hẹp để ghost không nhảy xa khỏi ngón (cảm giác lạc). Tăng/giảm để chỉnh độ
         * tha thứ.
         */
        private const val SNAP_RADIUS = 2

        /**
         * Dải đệm hysteresis (đơn vị Ô) khi quy con trỏ → ô lưới. Giữ ghost dính ở một ô tới khi con
         * trỏ vượt mép ô thêm dải này mới lật sang ô kế → cần kéo ~(0.5 + dải) ≈ 0.85 ô mới đổi chỗ
         * gợi ý. Chống "chỉ nhích nhẹ đã lệch": rung quanh mép ô không đổi ghost, người chơi có đủ
         * vùng đứng yên để thả. Tăng → dính hơn (khó lệch, nhưng khó chỉnh tinh); giảm → nhạy hơn.
         */
        private const val CELL_HYST = 0.35f

        /**
         * Quãng dời tối thiểu (dp) trước khi tính một hướng kéo ứng viên — lọc rung tay, tránh đảo
         * hướng lia lịa. Tăng từ 6→14dp để bớt nhạy: ngón nhích nhẹ không đổi hướng gợi ý.
         */
        private const val DIR_THRESHOLD_DP = 14f

        /**
         * Độ trễ (ns) phải GIỮ một hướng MỚI liên tục trước khi nó được chốt làm hướng "hít" ghost.
         * ~160ms: đủ để bỏ qua cú nhích/đảo hướng ngắn lúc người chơi chuẩn bị thả tay (tránh đặt sai),
         * vẫn đủ nhạy khi họ thật sự đổi hướng kéo có chủ đích.
         */
        private const val DIR_COMMIT_NANOS = 160_000_000L
    }
}
