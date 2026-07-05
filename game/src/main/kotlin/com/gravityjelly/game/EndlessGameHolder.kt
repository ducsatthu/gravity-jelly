package com.gravityjelly.game

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.geometry.Offset
import com.gravityjelly.core.CellType
import com.gravityjelly.core.ComboReward
import com.gravityjelly.core.EndlessEngine
import com.gravityjelly.core.EndlessState
import com.gravityjelly.core.EndlessTuning
import com.gravityjelly.core.GameEvent
import com.gravityjelly.core.Goal
import com.gravityjelly.core.GoalType
import com.gravityjelly.core.Grid
import com.gravityjelly.core.Level
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PlacementResult
import com.gravityjelly.core.StarMetric
import com.gravityjelly.core.StarThresholds
import com.gravityjelly.core.TriggerKind
import com.gravityjelly.core.forLevel
import com.gravityjelly.core.PlacementOutcome
import com.gravityjelly.core.Vec
import com.gravityjelly.core.campaignTuning
import com.gravityjelly.core.freePlace
import com.gravityjelly.core.nearestFreePlacement
import com.gravityjelly.core.previewPlaced
import kotlin.math.roundToInt

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
    /** Màn Campaign đang chơi (null = chế độ Endless, không có mục tiêu/thắng). */
    val level: Level? = null,
) {
    private val engine = if (level != null) EndlessEngine.forLevel(level)
        else EndlessEngine(seed, initialBudget, tuning)

    val boardRender = BoardRender()
    val animator = BoardAnimator()

    // ── mục tiêu Campaign (null ở Endless) ──
    /** Mục tiêu của màn (null = Endless). Lớp vỏ đọc để hiện HUD "Dọn sạch"… */
    val goal: Goal? = level?.goal
    private val starThresholds: StarThresholds? = level?.stars

    /** Số nước đã đặt (đơn vị sao MOVES). Compose observe để HUD hiện. */
    var movesUsed by mutableStateOf(0)
        private set

    /** Đã HOÀN THÀNH mục tiêu màn chưa (chỉ Campaign). Lớp vỏ hiện overlay thắng khi true. */
    var levelComplete by mutableStateOf(false)
        private set

    /** Sao đạt được khi hoàn thành (1–3); 0 khi chưa xong. */
    var starsEarned by mutableStateOf(0)
        private set

    // Đã xảy ra ÍT NHẤT một lần xóa trong màn — chặn "thắng rỗng" khi bàn vốn đã trống (L1/L2).
    private var anyCleared = false

    /** Số cú xoay đã dùng (đơn vị sao ROTATIONS — L3). */
    var rotationsUsed by mutableStateOf(0)
        private set

    // ── Trigger tutorial đã xảy ra (hệ mục tiêu v2) — bám EVENT stream, tích luỹ cả màn. ──
    private var trigRow = false
    private var trigCol = false
    private var trigRotate = false
    private var trigSuper1 = false
    private var trigSuper2 = false
    private var trigRainbow = false
    private var trigRainbowSuper = false
    private var trigCombo2 = false   // đã đạt combo ≥×2 lần nào chưa (L8)

    // ── Combo timer (comboTimeBased): nước vô ích không reset combo, chỉ hết 10s mới reset. ──
    /** Engine có bật combo timer không (đọc tuning 1 lần). */
    val isComboTimeBased: Boolean = if (level != null) campaignTuning(level).comboTimeBased else tuning.comboTimeBased

    /**
     * Tick phát khi combo timer BẮT ĐẦU / RESET (nước có ích mới). LaunchedEffect observe để
     * chạy delay 10s rồi gọi [expireComboTimer]. Compose state vì LaunchedEffect cần key.
     */
    var comboTimerTick by mutableStateOf(0L)
        private set

    // ── Boss combo: sát thương tích luỹ + số nhịp combo (đơn vị sao COMBO). ──
    private var bossDamage = 0
    private var comboHits = 0
    private var bossComboBefore = 0   // bậc combo VÀO nước hiện tại (cộng dồn qua các nước có ích)

    // ── CLEAR_TARGETS/MIXED: số ô đích đã phá + tổng cần phá. ──
    /** Tổng ô đích cần phá = [Goal.count] (gốc dây leo W2 / số lần phá nguồn W3, kể cả boss hồi sinh). */
    val initialTargets: Int = level?.goal?.let { g ->
        if (g.type == GoalType.CLEAR_TARGETS || g.type == GoalType.MIXED) g.count else 0
    } ?: 0
    /** Số ô đích đã phá (gốc dây leo [GameEvent.VineRootsCleared] + nguồn [GameEvent.WaterSourceBroken]). */
    var targetsCleared by mutableStateOf(0)
        private set
    /** Số gốc còn lại cần phá (cho ObjectiveBar biến thể targets/mixed). */
    val targetsRemaining: Int get() = (initialTargets - targetsCleared).coerceAtLeast(0)

    /** Sát thương boss tích luỹ / máu boss (cho BossHud in-game). 0 = không phải màn boss. */
    var bossHpDamage by mutableStateOf(0)
        private set
    val bossHpMax: Int = level?.goal?.takeIf { it.type == GoalType.BOSS_COMBO }?.bossHP ?: 0

    /** Cảnh báo boss sắp ra chiêu (W2 mọc dây · W3 đảo trọng lực) + đếm ngược — null nếu màn không có tell. */
    var bossTell by mutableStateOf(engine.bossTell())
        private set

    /**
     * Callback phản hồi haptic (đặt mảnh / xóa / combo≥3). Lớp vỏ (:app) cấp,
     * gate bằng cờ vibration của Settings. Giữ luồng một chiều: holder phát sự kiện, không tự rung.
     */
    var onEffect: ((EffectKind) -> Unit)? = null

    /**
     * Callback âm thanh SFX — lớp vỏ (:app) cấp, gate bằng cờ sound của Settings.
     * Phát cả lúc ingest (đặt/xoay/sự kiện engine) lẫn lúc animation (clear step, combo burst).
     */
    var onGameSound: ((GameSfx) -> Unit)? = null

    /** Combo burst 20 bậc — lớp vỏ cấp lambda nhận comboLevel (1..20+). */
    var onComboBurstSound: ((Int) -> Unit)? = null

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

    // Offset (ô góc trên-trái) của mảnh, có HYSTERESIS: giữ offset hiện tại tới khi tâm mảnh vượt hẳn
    // nửa ô thêm dải đệm [CELL_HYST] mới lật sang ô mới. Chống ghost nhảy ô do rung tay (chỉ nhích nhẹ
    // KHÔNG đổi chỗ thả). Int.MIN_VALUE = chưa có mốc (đầu cú kéo) → làm tròn thẳng.
    private var lastOx = Int.MIN_VALUE
    private var lastOy = Int.MIN_VALUE

    // Chỗ ghost đã tính preview "sẽ ăn điểm / merge" gần nhất — chỉ tính lại khi ghost ĐỔI Ô
    // (không mỗi lần dragTo). Int.MIN_VALUE = chưa tính.
    private var lastPreviewOx = Int.MIN_VALUE
    private var lastPreviewOy = Int.MIN_VALUE

    // bounds bàn (toạ độ window, px) để quy đổi con trỏ → ô lưới
    private var boardWinX = 0f
    private var boardWinY = 0f
    private var boardSizePx = 0f

    /** Mật độ màn hình (px/dp) — lớp vỏ set; dùng quy các hằng "nhấc mảnh" theo dp. */
    var density: Float = 1f

    val boardCellPx: Float get() = if (boardSizePx > 0f) boardSizePx / Grid.SIZE else 0f

    /**
     * "Nhấc mảnh" khi kéo (px): mảnh + ghost hiện CAO HƠN ngón tay để ngón không che chỗ thả.
     * Quy theo CỠ Ô ([DRAG_LIFT_CELLS] ô) chứ KHÔNG theo mm cố định: bàn thật chỉ ~4.5cm nên lift
     * mm-cố-định (15mm) hoá ra gần 3 ô — ghost lệch xa ngón, khó canh. Theo cỡ ô thì khoảng cách
     * ngón↔ghost luôn ~[DRAG_LIFT_CELLS] ô, dời ngón 1 ô là ghost dời 1 ô đúng như mắt thấy.
     */
    private val dragLiftPx: Float get() = boardCellPx * DRAG_LIFT_CELLS

    init {
        // Playback combo tuần tự: animator phát combo + haptic theo TỪNG nhịp (không dồn một lần).
        animator.onComboBurst = {
            captureComboBurst()
            onComboBurstSound?.invoke(animator.comboBurstCombo)
        }
        animator.onClearStep = { comboLevel ->
            onEffect?.invoke(if (comboLevel >= 3) EffectKind.COMBO else EffectKind.CLEAR)
            onGameSound?.invoke(if (comboLevel >= 2) GameSfx.CLEAR_COMBO else GameSfx.CLEAR_BASE)
        }
        // Cascade vừa chiếu xong → áp nước người chơi đã thả trong lúc đó (đặt-hoãn); nếu không
        // có nước chờ, bàn đã ổn định = đúng lúc CHẤM mục tiêu màn (hiện overlay thắng sau clear).
        animator.onPlaybackEnd = {
            val hadPending = pendingPlacement != null
            flushPendingPlacement()
            if (!hadPending) {
                evaluateGoal()
                onGameSound?.invoke(GameSfx.SETTLED)
            }
        }
        sync()
    }

    fun setBoardBounds(x: Float, y: Float, sizePx: Float) {
        boardWinX = x; boardWinY = y; boardSizePx = sizePx
    }

    // ── input ──

    fun rotate(cw: Boolean) {
        if (shell.gameOver || levelComplete) return
        if (animator.isPlaying) return   // khoá input khi bàn đang chiếu cascade (tránh lệch thấy/truth)
        val pre = boardRender.grid.copy()
        val preGravity = boardRender.gravity
        val events = engine.rotateGravity(cw)
        sync()
        if (events.isNotEmpty()) {
            trackGoalEvents(events)
            animator.ingest(events, pre, preGravity, boardRender.grid, boardRender.gravity)
            dispatchFeedback(events)
            dispatchSounds(events)
            detectRotationRefill(events)
            detectGuideMechanics(events)
            startComboTimerIfProductive(events)
        }
    }

    /**
     * Bắt đầu kéo mảnh khay. CHO PHÉP kéo cả khi bàn đang chiếu cascade — không chặn cú kéo của
     * người chơi (đỡ lỡ nhịp); việc ĐẶT sẽ hoãn tới khi cascade xong (xem [commitDrag]). Ghost neo
     * theo [boardRender].grid (đã là truth cuối, ổn định suốt playback) nên chỗ dự kiến luôn đúng.
     * Trả false khi đã thua, hoặc còn MỘT nước chờ chưa áp (giữ một nước chờ mỗi lúc).
     */
    fun beginDrag(trayIndex: Int): Boolean {
        if (shell.gameOver || levelComplete) return false
        if (pendingPlacement != null) return false   // còn nước chờ áp khi cascade xong → khoan kéo tiếp
        val p = shell.tray.getOrNull(trayIndex) ?: return false
        dragIndex = trayIndex
        dragPiece = p
        dragOx = -1; dragOy = -1
        dragDirX = 0; dragDirY = 0; hasDirSample = false
        pendingDirX = 0; pendingDirY = 0; pendingDirSinceNanos = 0L
        lastOx = Int.MIN_VALUE; lastOy = Int.MIN_VALUE
        boardRender.ghost = null
        clearPreview()
        return true
    }

    /**
     * Con trỏ tại (window) → chọn chỗ đặt cho ghost theo HAI BƯỚC:
     *  1. Nếu mảnh đang nằm ĐÚNG ô (offset khớp mảnh nổi đang vẽ) mà chỗ đó ĐẶT ĐƯỢC → dùng chính
     *     chỗ đó, KHÔNG gợi ý dời. Người chơi đã canh tới nơi thì tôn trọng vị trí họ chọn.
     *  2. Chỉ khi chỗ chính xác đó KHÔNG đặt được (mảnh chưa tới khu vực đủ khít) → mới "hít" ghost
     *     về chỗ khít HỢP LỆ gần nhất trong bán kính [SNAP_RADIUS] ô (xem [nearestFreePlacement]).
     * KHÔNG hard-drop.
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

        // Offset (ô góc trên-trái) KHỚP ĐÚNG mảnh nổi đang vẽ: mảnh vẽ tâm trên con trỏ (origin =
        // con trỏ − nửa-cỡ mảnh), nên offset ô = làm tròn cùng biểu thức. Có hysteresis để rung tay
        // nhẹ không lật ô (xem [stickyCell]). Nhờ khớp mảnh nổi, ghost bám đúng chỗ mắt thấy — kể cả
        // mảnh cỡ chẵn (trước đây floor ô-con-trỏ lệch tới ~1 ô, khiến gợi ý sai chỗ).
        val originCellX = (windowX - boardWinX) / cell - piece.shape.width / 2f
        val originCellY = (liftedY - boardWinY) / cell - piece.shape.height / 2f
        val desiredOx = stickyCell(originCellX, lastOx)
        val desiredOy = stickyCell(originCellY, lastOy)
        lastOx = desiredOx; lastOy = desiredOy
        // Mảnh ra hẳn ngoài bàn (margin 1 ô) → không có ý định thả.
        val shape = piece.shape
        if (desiredOx < -1 || desiredOy < -1 ||
            desiredOx + shape.width > Grid.SIZE + 1 || desiredOy + shape.height > Grid.SIZE + 1) {
            clearGhost(); return
        }

        // BƯỚC 1: mảnh đã nằm đúng chỗ hợp lệ → dùng chính chỗ đó, không gợi ý dời.
        val exact = freePlace(boardRender.grid, piece, desiredOx, desiredOy)
        if (exact is PlacementResult.Success) {
            setGhostAndPreview(exact.cells, piece, desiredOx, desiredOy)
            return
        }

        // BƯỚC 2: chỗ chính xác không đặt được → gợi ý chỗ khít gần nhất (theo hướng kéo).
        when (val res = nearestFreePlacement(boardRender.grid, piece, desiredOx, desiredOy, SNAP_RADIUS, dragDirX, dragDirY)) {
            is PlacementResult.Success -> {
                // Shape chuẩn hoá gốc (0,0) → offset = min toạ độ của cells đã hít.
                val cells = res.cells
                setGhostAndPreview(cells, piece, cells.minOf { it.x }, cells.minOf { it.y })
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
     * Lượng tử hoá offset ô có HYSTERESIS. [f] là offset ô PHÂN SỐ (đã trừ nửa-cỡ mảnh nên khớp tâm
     * mảnh nổi). Giữ offset cũ [prev] chừng nào [f] còn trong [prev − 0.5 − CELL_HYST, prev + 0.5 +
     * CELL_HYST]; ra khỏi dải mới làm tròn lại. Vùng giữ rộng 2·(0.5 + CELL_HYST) quanh tâm ô nên rung
     * tay không lật đi lật lại — đứng yên đủ lâu để thả, phải kéo hẳn > ~(0.5 + CELL_HYST) ô mới đổi.
     * [prev] = Int.MIN_VALUE (đầu cú kéo) → chưa có mốc, làm tròn thẳng.
     */
    private fun stickyCell(f: Float, prev: Int): Int = when {
        prev == Int.MIN_VALUE -> f.roundToInt()
        f < prev - 0.5f - CELL_HYST -> f.roundToInt()
        f > prev + 0.5f + CELL_HYST -> f.roundToInt()
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
            if (events.any { it is GameEvent.PiecePlaced }) movesUsed++
            if (events.any { it is GameEvent.LinesCleared }) anyCleared = true
            trackGoalEvents(events)
            animator.ingest(events, pre, preGravity, boardRender.grid, boardRender.gravity)
            dispatchFeedback(events)
            dispatchSounds(events)
            detectRotationRefill(events)
            detectGuideMechanics(events)
            startComboTimerIfProductive(events)
        }
    }

    // ── mục tiêu màn Campaign ──

    /**
     * Chấm mục tiêu màn khi bàn ĐÃ ổn định (gọi từ [BoardAnimator.onPlaybackEnd]). Chỉ Campaign
     * (goal != null). CLEAR_ALL = đã xóa ít nhất 1 lần VÀ bàn không còn ô cần dọn. Đặt sao +
     * [levelComplete] → lớp vỏ hiện overlay thắng.
     */
    /**
     * Ghi nhận TRIGGER tutorial + sát thương boss từ chuỗi event MỖI nước (hệ mục tiêu v2). Cộng dồn
     * cả màn — [evaluateGoal] đọc lại khi bàn ổn định. Boss: sát thương = bậc−1 mỗi lần combo chạm mức
     * mới ≥×2 ([ComboReward.rotationRefund] trên đỉnh combo nước này).
     */
    private fun trackGoalEvents(events: List<GameEvent>) {
        var peakCombo = bossComboBefore
        for (e in events) {
            when (e) {
                is GameEvent.LinesCleared -> {
                    if (e.lines.rows.isNotEmpty()) trigRow = true
                    if (e.lines.cols.isNotEmpty()) trigCol = true
                    if (e.comboLevel > peakCombo) peakCombo = e.comboLevel
                }
                is GameEvent.GravityRotated -> { trigRotate = true; rotationsUsed++ }
                is GameEvent.SuperFormed -> {
                    if (e.level >= 2) trigSuper2 = true else trigSuper1 = true
                    if (e.comboLevel > peakCombo) peakCombo = e.comboLevel
                }
                is GameEvent.SuperDetonated -> if (e.level >= 2) trigSuper2 = true
                is GameEvent.RainbowFormed -> {
                    if (e.level >= 2) trigRainbowSuper = true else trigRainbow = true
                    if (e.comboLevel > peakCombo) peakCombo = e.comboLevel
                }
                is GameEvent.VineRootsCleared -> targetsCleared += e.roots.size   // World 2 · CLEAR_TARGETS
                is GameEvent.WaterSourceBroken -> targetsCleared += 1             // World 3 · phá nguồn
                else -> {}
            }
        }
        if (peakCombo >= 2) trigCombo2 = true    // combo ×2 lần đầu (L8)
        val dmg = ComboReward.rotationRefund(bossComboBefore, peakCombo)
        if (dmg > 0) { bossDamage += dmg; comboHits++; bossHpDamage = bossDamage }
        bossComboBefore = shell.combo
    }

    private fun evaluateGoal() {
        val g = goal ?: return
        if (levelComplete) return
        val done = when (g.type) {
            GoalType.CLEAR_ALL -> anyCleared && !hasBlocks(boardRender.grid)
            GoalType.REACH_SCORE -> shell.score >= g.score
            GoalType.BOSS_COMBO -> bossDamage >= g.bossHP
            GoalType.TUTORIAL -> when (g.trigger) {
                TriggerKind.ROW -> trigRow
                TriggerKind.COL -> trigCol
                TriggerKind.ROTATE -> trigRotate
                TriggerKind.SUPER1 -> trigSuper1
                TriggerKind.SUPER2 -> trigSuper2
                TriggerKind.RAINBOW -> trigRainbow
                TriggerKind.RAINBOW_SUPER -> trigRainbowSuper
                TriggerKind.COMBO_X2 -> trigCombo2
                null -> false
            }
            // World 2: phá đủ N gốc dây leo (CLEAR_TARGETS) / phá đủ gốc VÀ đủ điểm (MIXED).
            GoalType.CLEAR_TARGETS -> targetsCleared >= g.count
            GoalType.MIXED -> targetsCleared >= g.count && shell.score >= g.score
            GoalType.COMBO_CHAIN -> false   // chưa hỗ trợ
        }
        if (done) {
            starsEarned = computeStars()
            levelComplete = true
        }
    }

    /** Còn ô cần dọn (BLOCK/TARGET)? STONE là chướng ngại, không tính vào clear_all. */
    private fun hasBlocks(grid: Grid): Boolean {
        for (y in 0 until grid.size) for (x in 0 until grid.size) {
            val t = grid.get(x, y)?.type
            if (t == CellType.BLOCK || t == CellType.TARGET) return true
        }
        return false
    }

    private fun computeStars(): Int {
        val s = starThresholds ?: return 1
        // MOVES/ROTATIONS/COMBO: ÍT hơn = tốt hơn (≤ ngưỡng). SCORE: NHIỀU hơn = tốt hơn (≥ ngưỡng).
        val measured = when (s.metric) {
            StarMetric.SCORE -> shell.score
            StarMetric.ROTATIONS -> rotationsUsed
            StarMetric.COMBO -> comboHits
            else -> movesUsed   // MOVES
        }
        return s.tierFor(measured)
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
        clearPreview()
        if (shell.gameOver || levelComplete) return
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
     * Audio SFX tại thời điểm ingest (tức thì, không chờ animation). Clear/combo phát riêng qua
     * [BoardAnimator.onClearStep] / [onComboBurst] để đúng nhịp hiệu ứng; ở đây CHỈ phát sự kiện
     * không phải clear (đặt mảnh, xoay, form siêu khối, vine, boss…).
     */
    private fun dispatchSounds(events: List<GameEvent>) {
        val cb = onGameSound ?: return
        for (e in events) {
            when (e) {
                is GameEvent.PiecePlaced -> cb(GameSfx.PLACE)
                is GameEvent.GravityRotated -> cb(GameSfx.GRAVITY_ROTATE)
                is GameEvent.ClustersCollapsed -> if (e.moved) cb(GameSfx.CLUSTER_COLLAPSE)
                is GameEvent.SuperFormed -> cb(if (e.level >= 2) GameSfx.SUPER_FORM_2 else GameSfx.SUPER_FORM_1)
                is GameEvent.RainbowFormed -> cb(GameSfx.RAINBOW_FORM)
                is GameEvent.SuperDetonated -> {
                    if (e.isRainbow) cb(GameSfx.RAINBOW_DETONATE)
                    else cb(if (e.level >= 2) GameSfx.SUPER_DETONATE_2 else GameSfx.SUPER_DETONATE_1)
                }
                is GameEvent.RotationRefunded -> cb(GameSfx.ROTATION_REFUND)
                is GameEvent.VineGrew -> cb(GameSfx.VINE_GROW)
                is GameEvent.VineRootsCleared -> cb(GameSfx.VINE_SNAP)
                is GameEvent.TrashCountdownTicked -> cb(if (e.died.isNotEmpty()) GameSfx.TRASH_CRUMBLE else GameSfx.TRASH_TICK)
                is GameEvent.WaterSourceBroken -> cb(GameSfx.DROP_CLEAR)   // W3: phá nguồn
                is GameEvent.WaterSourceRevived -> cb(GameSfx.DROP_CLEAR)  // W3 boss: hồi sinh nguồn
                is GameEvent.StonesAdded -> cb(GameSfx.STONE_ADDED)
                is GameEvent.DebrisAdded -> cb(GameSfx.DEBRIS_ADDED)
                is GameEvent.BossGravityFlipped -> cb(GameSfx.BOSS_GRAVITY_FLIP)
                is GameEvent.TrayDealt -> cb(GameSfx.TRAY_DEALT)
                is GameEvent.ComboExpired -> cb(GameSfx.COMBO_EXPIRED)
                is GameEvent.GameOver -> cb(GameSfx.GAME_OVER)
                else -> {}
            }
        }
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

    /**
     * Combo timer hết hạn (10s) — gọi bởi LaunchedEffect ở lớp vỏ. Reset combo engine + sync.
     */
    fun expireComboTimer() {
        if (!isComboTimeBased) return
        val event = engine.resetCombo() ?: return
        boardRender.comboTimerStartNanos = 0L
        onGameSound?.invoke(GameSfx.COMBO_EXPIRED)
        sync()
    }

    /**
     * Nước có ích (clear/merge) → reset combo timer. Combo bắt đầu lần đầu hoặc đã có → reset đồng hồ.
     * Combo = 0 (hết, hoặc chưa bao giờ) → tắt timer.
     */
    private fun startComboTimerIfProductive(events: List<GameEvent>) {
        if (!isComboTimeBased) return
        val productive = events.any { it is GameEvent.LinesCleared || it is GameEvent.SuperFormed || it is GameEvent.RainbowFormed }
        if (productive && shell.combo > 0) {
            boardRender.comboTimerStartNanos = animator.renderNanos()
            comboTimerTick++
        } else if (shell.combo == 0) {
            boardRender.comboTimerStartNanos = 0L
        }
    }

    // ── nội bộ ──

    private fun clearGhost() {
        dragOx = -1; dragOy = -1
        boardRender.ghost = null
        clearPreview()
    }

    /**
     * Đặt ghost tại ([ox],[oy]) + tính preview "sẽ ăn điểm / merge". Preview CHỈ tính lại khi ghost
     * đổi ô (so [lastPreviewOx]/[lastPreviewOy]) — kéo trong cùng ô không tính lại. Bàn luôn đã resolve
     * giữa các nước nên [previewPlaced] đọc [boardRender].grid (truth cuối, kể cả lúc đang chiếu cascade).
     */
    private fun setGhostAndPreview(cells: List<Vec>, piece: Piece, ox: Int, oy: Int) {
        dragOx = ox; dragOy = oy
        boardRender.ghost = GhostPreview(cells, piece.color)
        if (ox == lastPreviewOx && oy == lastPreviewOy) return
        lastPreviewOx = ox; lastPreviewOy = oy
        applyPreview(previewPlaced(boardRender.grid, piece, cells))
    }

    private fun applyPreview(o: PlacementOutcome) {
        // Nhịp đầu chỉ có 1 trong 2 (xóa HOẶC merge). Có thể GỒM NHIỀU vùng rời (vd 2 hàng cách nhau).
        val region = if (o.clearCells.isNotEmpty()) o.clearCells else o.mergeCells
        val mask = boardRender.previewMask
        java.util.Arrays.fill(mask, false)
        for (v in region) mask[v.y * Grid.SIZE + v.x] = true
        boardRender.previewRegion = if (region.isEmpty()) emptyList() else region.toList()
        boardRender.previewLoops = if (region.isEmpty()) emptyList() else regionLoops(mask)
    }

    private fun clearPreview() {
        lastPreviewOx = Int.MIN_VALUE; lastPreviewOy = Int.MIN_VALUE
        boardRender.previewRegion = emptyList()
        boardRender.previewLoops = emptyList()
        java.util.Arrays.fill(boardRender.previewMask, false)
    }

    /**
     * Trace ĐƯỜNG BAO vùng [mask] thành các contour kín (đa giác trực giao BẤT KỲ: nhiều vùng rời, chữ
     * thập, L, blob nổ, cả lỗ thủng). Mỗi cạnh biên (ô-trong giáp ô-ngoài) phát 1 cạnh có HƯỚNG THEO
     * CHIỀU KIM ĐỒNG HỒ quanh ô → nối đầu-cuối thành vòng. Điểm lưới encode `py·(SIZE+1)+px`. Đỉnh thẳng
     * hàng được GỘP để chỉ còn góc thật. Chạy khi preview đổi (không mỗi frame), bàn 9×9 nên rẻ.
     */
    private fun regionLoops(mask: BooleanArray): List<IntArray> {
        val n = Grid.SIZE
        val p = n + 1
        val out = HashMap<Int, MutableList<Int>>()   // điểm-đầu → các điểm-cuối (thường 1; ≥2 ở điểm kẹp)
        fun edge(sx: Int, sy: Int, ex: Int, ey: Int) {
            out.getOrPut(sy * p + sx) { ArrayList(2) }.add(ey * p + ex)
        }
        for (y in 0 until n) for (x in 0 until n) {
            if (!mask[y * n + x]) continue
            // Cạnh biên phát theo chiều kim đồng hồ (y hướng xuống): TL→TR→BR→BL→TL.
            if (y == 0 || !mask[(y - 1) * n + x])     edge(x, y, x + 1, y)         // trên
            if (x == n - 1 || !mask[y * n + (x + 1)]) edge(x + 1, y, x + 1, y + 1) // phải
            if (y == n - 1 || !mask[(y + 1) * n + x]) edge(x + 1, y + 1, x, y + 1) // dưới
            if (x == 0 || !mask[y * n + (x - 1)])     edge(x, y + 1, x, y)         // trái
        }
        val loops = ArrayList<IntArray>()
        val starts = out.keys.toIntArray().also { it.sort() }
        for (s0 in starts) {
            while (out[s0]?.isNotEmpty() == true) {
                val loop = ArrayList<Int>()
                var cur = s0
                var guard = 0
                while (guard++ < 4 * n * n) {
                    loop.add(cur)
                    val ends = out[cur]
                    if (ends.isNullOrEmpty()) break
                    val nxt = ends.removeAt(ends.size - 1)   // deterministic
                    if (nxt == s0) break
                    cur = nxt
                }
                if (loop.size >= 4) loops.add(collapseCollinear(loop, p))
            }
        }
        return loops
    }

    /** Bỏ các đỉnh nằm THẲNG HÀNG (giữ góc thật) — vòng lặp có wrap-around. */
    private fun collapseCollinear(pts: List<Int>, p: Int): IntArray {
        val m = pts.size
        val keep = ArrayList<Int>(m)
        for (i in 0 until m) {
            val a = pts[(i - 1 + m) % m]; val b = pts[i]; val c = pts[(i + 1) % m]
            val cross = (b % p - a % p) * (c / p - b / p) - (b / p - a / p) * (c % p - b % p)
            if (cross != 0) keep.add(b)
        }
        return keep.toIntArray()
    }

    private fun endDragState() {
        dragIndex = -1; dragOx = -1; dragOy = -1
        dragPiece = null; dragWindowPos = null
        boardRender.ghost = null
        clearPreview()
    }

    private fun sync() {
        val s = engine.state()
        boardRender.grid = s.grid
        boardRender.gravity = s.gravity
        fillClusterSizes(s.grid, boardRender.clusterSizes)
        boardRender.waterSources = s.waterSources
        shell = snapshotFrom(s)
        bossTell = engine.bossTell()
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
        /** Khoảng "nhấc mảnh" khi kéo, tính theo SỐ Ô: ngón↔ghost cách ~1.5 ô — đủ để ngón không che
         *  chỗ thả, đủ gần để dời ngón 1 ô là ghost dời 1 ô (không lệch xa gây khó canh). */
        private const val DRAG_LIFT_CELLS = 1.5f

        /**
         * Bán kính "hít" ghost (ô) quanh ô dưới con trỏ: trong phạm vi này, ghost tự nhảy tới chỗ
         * khít hợp lệ gần nhất nên người chơi thả sớm, không cần canh đúng ô. Đủ rộng để thấy "tha
         * thứ" rõ rệt, đủ hẹp để ghost không nhảy xa khỏi ngón (cảm giác lạc). Tăng/giảm để chỉnh độ
         * tha thứ.
         */
        private const val SNAP_RADIUS = 2

        /**
         * Dải đệm hysteresis (đơn vị Ô) quanh TÂM ô khi quy offset mảnh → ô lưới. Giữ ghost ở ô hiện
         * tại tới khi tâm mảnh lệch quá (0.5 + dải) ô mới lật sang ô kế. Chỉ đủ nhỏ để chống rung tay
         * ngay mép ô, KHÔNG tạo vùng chết cả ô (0.35 cũ khiến kéo gần trọn 1 ô mới đổi → cảm giác kẹt).
         * Tăng → dính hơn (khó lệch, khó chỉnh tinh); giảm → nhạy hơn, bám sát mảnh.
         */
        private const val CELL_HYST = 0.12f

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
