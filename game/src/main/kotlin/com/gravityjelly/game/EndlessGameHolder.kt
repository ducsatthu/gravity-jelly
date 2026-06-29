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
    val tray: List<Piece>,
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

    // ── trạng thái kéo-thả (plain fields; overlay đọc mỗi frame) ──
    var dragPiece: Piece? = null
        private set
    var dragWindowPos: Offset? = null
        private set

    private var dragIndex = -1
    private var dragOx = -1
    private var dragOy = -1

    // Hướng ngón đang kéo (−1/0/1 mỗi trục), lấy từ chuyển động con trỏ để "hít" ghost theo hướng.
    private var dragDirX = 0
    private var dragDirY = 0
    private var dirSampleX = 0f   // điểm mốc lấy mẫu hướng; chuyển động nhỏ tích luỹ tới khi đủ ngưỡng
    private var dirSampleY = 0f
    private var hasDirSample = false

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
        }
    }

    /** Bắt đầu kéo mảnh khay. Trả false (không kéo) khi đã thua hoặc bàn đang chiếu cascade. */
    fun beginDrag(trayIndex: Int): Boolean {
        if (shell.gameOver) return false
        if (animator.isPlaying) return false   // khoá input khi bàn đang chiếu cascade (tránh lệch thấy/truth)
        val p = shell.tray.getOrNull(trayIndex) ?: return false
        dragIndex = trayIndex
        dragPiece = p
        dragOx = -1; dragOy = -1
        dragDirX = 0; dragDirY = 0; hasDirSample = false
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

        val col = floor((windowX - boardWinX) / cell).toInt()
        val row = floor((liftedY - boardWinY) / cell).toInt()
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
     * Cập nhật hướng kéo [dragDirX]/[dragDirY] từ chuyển động con trỏ. Tích luỹ độ dời từ mốc
     * [dirSampleX]/[dirSampleY] tới khi vượt ngưỡng [DIR_THRESHOLD_DP] (lọc rung tay) rồi mới chốt
     * hướng theo dấu mỗi trục; trục lệch không đáng kể → 0. Giữ hướng cũ khi ngón gần đứng yên.
     */
    private fun updateDragDirection(x: Float, y: Float) {
        if (!hasDirSample) { dirSampleX = x; dirSampleY = y; hasDirSample = true; return }
        val dx = x - dirSampleX
        val dy = y - dirSampleY
        val threshold = DIR_THRESHOLD_DP * density
        if (dx * dx + dy * dy < threshold * threshold) return   // chưa dời đủ → giữ hướng cũ
        val axisEps = threshold * 0.5f
        dragDirX = if (dx > axisEps) 1 else if (dx < -axisEps) -1 else 0
        dragDirY = if (dy > axisEps) 1 else if (dy < -axisEps) -1 else 0
        dirSampleX = x; dirSampleY = y
    }

    /** Thả: nếu ghost hợp lệ → gửi đặt-tự-do tới engine (cụm không neo sẽ rơi). */
    fun commitDrag() {
        val idx = dragIndex
        val ox = dragOx; val oy = dragOy
        endDragState()
        if (idx < 0 || ox < 0 || oy < 0) return
        val pre = boardRender.grid.copy()
        val preGravity = boardRender.gravity
        val events = engine.placePieceAt(idx, ox, oy)
        sync()
        if (events.isNotEmpty()) {
            animator.ingest(events, pre, preGravity, boardRender.grid, boardRender.gravity)
            dispatchFeedback(events)
        }
    }

    fun cancelDrag() = endDragState()

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

        /** Quãng dời tối thiểu (dp) trước khi chốt lại hướng kéo — lọc rung tay, tránh đảo hướng lia lịa. */
        private const val DIR_THRESHOLD_DP = 6f
    }
}
