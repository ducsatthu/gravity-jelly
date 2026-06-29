package com.gravityjelly.game

import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.text.TextMeasurer
import com.gravityjelly.core.CellType
import com.gravityjelly.core.ClearedLines
import com.gravityjelly.core.Direction
import com.gravityjelly.core.GameEvent
import com.gravityjelly.core.Grid
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.Vec
import com.gravityjelly.core.applyClusterGravity
import com.gravityjelly.core.applyConnectedGravity
import com.gravityjelly.core.expandDetonations
import com.gravityjelly.core.lineCells
import com.gravityjelly.core.place

/**
 * Bộ điều phối animation cho bàn (đọc chuỗi [GameEvent] từ :core).
 * - Tái dựng các bước resolve trên BẢN SAO grid (gọi hàm thuần :core: place/clearLines/
 *   applyClusterGravity) để lấy MÀU ô bị xóa + vị trí trước/sau cho nội suy. KHÔNG tái cài luật.
 * - Hiệu ứng theo thời gian sim (fixed-timestep) + nội suy alpha khi vẽ.
 * - Object pool particle/popup, cap số lượng; trạng thái ô lưu trong mảng 9x9 tái dùng
 *   → KHÔNG cấp phát trong vòng vẽ.
 *
 * Vẽ TẤT CẢ trong cùng Canvas của BoardCanvas (một canvas duy nhất).
 */
class BoardAnimator {

    private val n = Grid.SIZE
    private val particles = ParticleSystem()

    /**
     * Reduced-motion (a11y): bỏ particle + popup float + squash, GIỮ chuyển state cốt lõi
     * (slide collapse/rotate vẫn chạy để bàn đọc được). Lớp vỏ set qua [EndlessScreen].
     */
    var reducedMotion = false

    // sim time
    private var simTimeNanos = 0L
    var renderAlpha = 0f

    fun renderNanos(): Long = simTimeNanos + (renderAlpha * GameClock.STEP_NANOS).toLong()

    // ── playback cascade tuần tự (xóa → rơi → xóa → rơi …) ──────────────────────
    // Combo ăn điểm KHÔNG dồn một nhịp: bàn rơi xong, hàng mới đầy mới flash nhịp kế.
    // [displayGrid] = grid trung gian của nhịp đang chiếu (null ⇒ lớp vẽ dùng grid cuối
    // từ BoardRender). Các [phases] kích hoạt theo thời gian sim trong [advancePhases].
    var displayGrid: Grid? = null
        private set
    private val phases = ArrayList<CascadePhase>()
    private var phaseIdx = 0

    /**
     * Thời điểm sim mà toàn bộ playback của nước hiện tại (slide xoay + chuỗi cascade) kết thúc.
     * Lớp vỏ KHOÁ input tới mốc này: ngăn người chơi thả/xoay trong khi bàn còn đang chiếu
     * (xóa → rơi → …). Nếu không khoá, người chơi thả theo bàn TRUNG GIAN trong khi engine đã
     * resolve xong → lệch "thấy" vs "truth" (thả đè ô, rơi nhảy đột ngột — bug đã sửa).
     */
    private var playbackEndNanos = 0L

    /** true khi animator còn đang chiếu nước hiện tại (slide xoay hoặc cascade chưa xong). */
    val isPlaying: Boolean
        get() = renderNanos() < playbackEndNanos

    /** Haptic theo từng nhịp xóa (lớp vỏ map sang rung). [comboLevel] để phân biệt combo. */
    var onClearStep: ((comboLevel: Int) -> Unit)? = null
    /** Combo (×N) vừa chốt tại một nhịp → lớp vỏ đọc [comboBurst*] rồi nổ overlay ăn mừng. */
    var onComboBurst: (() -> Unit)? = null

    /**
     * Một nhịp playback: "xóa" (flash + điểm/combo), "rơi" (collapse slide),
     * hoặc "hợp nhất" ([isForm]: flash 8 ô hội tụ + pop siêu khối). Nổ siêu khối gắn vào
     * nhịp xóa qua [blastCells]/[blastCenters] (flash lan từ tâm như sóng xung kích).
     */
    private class CascadePhase(
        val at: Long,
        val display: Grid,
        val isCollapse: Boolean,
        val isForm: Boolean = false,
        val lines: ClearedLines? = null,
        val colorGrid: Grid? = null,
        val comboLevel: Int = 0,
        val score: Int = 0,
        val fireCombo: Boolean = false,
        val slideBefore: Grid? = null,
        val moved: Boolean = false,
        // siêu khối — hợp nhất
        val superAt: Vec? = null,
        val superColor: JellyColor? = null,
        val superLevel: Int = 0,
        val absorbed: List<Vec>? = null,
        // nổ siêu khối / cầu vồng theo CHẶNG (xem buildClearBeat)
        val clearCells: List<Vec>? = null,   // chặng 1: xóa hàng/cột như thường (flash phẳng)
        val smileCells: List<Vec>? = null,   // chặng 2: ô bị quét — cười (super) / highlight (cầu vồng) rồi biến mất
        val smileHighlight: Boolean = false, // true = HIGHLIGHT (cầu vồng) thay vì CƯỜI (super)
        val superCells: List<Vec>? = null,   // chặng 3: tâm SIÊU KHỐI biến mất cuối
        val rainbowCells: List<Vec>? = null, // chặng 3: tâm CẦU VỒNG biến mất cuối
    )

    /**
     * Hiệu ứng "cười tươi rồi nổ" cho TÂM siêu khối khi bị kích: vẽ đè overlay tại ô tâm —
     * mắt HAPPY (^ ^), nhún to (easeOutBack) rồi pop-fade. [start] = thời điểm nhịp xóa nổ.
     */
    private class SuperFlash(val x: Int, val y: Int, val color: JellyColor, val level: Int, val start: Long, val rainbow: Boolean = false)

    /** Ô bị quét (chặng 2): [highlight]=false → cười (HAPPY, super); =true → highlight glow (cầu vồng). Rồi pop-fade. */
    private class SmileFlash(val x: Int, val y: Int, val color: JellyColor, val start: Long, val highlight: Boolean = false)

    // ── settle: thời điểm sự kiện gần nhất (đặt/xoay/xóa) để quyết "nhìn trọng lực" vs "tính cách".
    // 0 ở đầu ván ⇒ khối nhìn trọng lực ~SETTLE_HOLD rồi trôi dần sang tính cách (xem JellyPersonality).
    private var lastEventNanos = 0L

    /**
     * Settle CẢ BÀN — chỉ dùng cho XOAY trọng lực (mọi khối nhìn tường mới rồi trôi về tính cách).
     * 1 = vừa xoay → nhìn theo trọng lực; ramp về 0 = trả mắt cho tính cách riêng.
     */
    fun settleFactor(now: Long): Float {
        val el = now - lastEventNanos
        if (el <= SETTLE_HOLD_NANOS) return 1f
        if (el >= SETTLE_HOLD_NANOS + SETTLE_RAMP_NANOS) return 0f
        val t = (el - SETTLE_HOLD_NANOS).toFloat() / SETTLE_RAMP_NANOS
        return 1f - Anim.easeInOut(t)
    }

    /**
     * Settle PER-CELL — ô đang TRƯỢT (rơi/collapse) hoặc vừa đặt/vừa tiếp đất mới nhìn trọng lực;
     * sau đó trôi dần về tính cách. Khối đứng yên (không rơi) giữ tính cách → "khi rơi chỉ khối
     * bị rơi mới nhìn xuống" (yêu cầu người chơi). Lớp vẽ lấy max với [settleFactor] (xoay).
     */
    fun cellSettleFactor(x: Int, y: Int, now: Long): Float {
        // đang trượt thật sự (slide còn chạy) → nhìn trọng lực
        if ((slideDX[y][x] != 0f || slideDY[y][x] != 0f) && elapsed(slideStart, slideDur, now) < 1f) return 1f
        // vừa đặt / vừa tiếp đất (placeStart): giữ một nhịp rồi trôi về tính cách
        val st = placeStart[y][x]
        if (st == 0L) return 0f
        val el = now - st
        if (el < 0L) return 1f                       // chưa tới mốc tiếp đất (đang rơi) → vẫn nhìn xuống
        if (el <= SETTLE_HOLD_NANOS) return 1f
        if (el >= SETTLE_HOLD_NANOS + SETTLE_RAMP_NANOS) return 0f
        val t = (el - SETTLE_HOLD_NANOS).toFloat() / SETTLE_RAMP_NANOS
        return 1f - Anim.easeInOut(t)
    }

    fun step(dtNanos: Long) {
        simTimeNanos += dtNanos
        advancePhases(simTimeNanos)
        particles.step(dtNanos / 1e9f)
    }

    // ── trạng thái ô (mảng tái dùng) ──
    private val placeStart = Array(n) { LongArray(n) }     // 0 = không squash
    private val slideDX = Array(n) { FloatArray(n) }       // start-delta theo ô
    private val slideDY = Array(n) { FloatArray(n) }
    private val clearStart = Array(n) { LongArray(n) }
    private val clearColor = Array(n) { Array(n) { Color.White } }
    private val clearShine = Array(n) { Array(n) { Color.White } }   // màu ring shine theo khối
    private val superFlashes = ArrayList<SuperFlash>(4)               // tâm siêu khối đang "cười + nổ"
    private val smileFlashes = ArrayList<SmileFlash>(32)              // block cùng màu đang "cười rồi biến mất"
    private var squashGravity = Direction.DOWN

    // ── combo burst gần nhất (overlay ăn mừng ×N đặt TẠI vùng resolve trên bàn) ──
    // Lớp vỏ (holder) đọc sau mỗi ingest: [comboBurstId] đổi → có combo mới để nổ.
    // Vị trí lưu theo TOẠ ĐỘ Ô (tâm vùng xóa); holder quy ra px cửa sổ bằng bounds bàn.
    var comboBurstId = 0L
        private set
    var comboBurstCombo = 0
        private set
    var comboBurstCellX = 0f
        private set
    var comboBurstCellY = 0f
        private set

    // slide (collapse / rotate)
    private var slideStart = 0L
    private var slideDur = Anim.COLLAPSE_NANOS

    // rotate pupils
    private var rotStart = 0L
    private var rotActive = false
    private var oldDirX = 0f
    private var oldDirY = 1f
    private var newDirX = 0f
    private var newDirY = 1f

    val isRotating: Boolean
        get() = rotActive && (renderNanos() - rotStart) < Anim.ROTATE_NANOS

    // con trỏ mắt hiện tại (nội suy khi xoay)
    val pupilX: Float
        get() {
            val t = Anim.easeInOut(((renderNanos() - rotStart).toFloat() / Anim.ROTATE_NANOS))
            return Anim.lerp(oldDirX, newDirX, t)
        }
    val pupilY: Float
        get() {
            val t = Anim.easeInOut(((renderNanos() - rotStart).toFloat() / Anim.ROTATE_NANOS))
            return Anim.lerp(oldDirY, newDirY, t)
        }

    // buffer cho computeSlide (tái dùng, tránh alloc lúc ingest)
    private val beforeCoords = IntArray(n)
    private val afterCoords = IntArray(n)
    private val afterCellX = IntArray(n)
    private val afterCellY = IntArray(n)

    /**
     * Nạp sự kiện sau một hành động (đặt mảnh hoặc xoay).
     * [pre] = grid trước hành động; [post] = grid sau (truth từ engine).
     */
    fun ingest(
        events: List<GameEvent>,
        pre: Grid,
        preGravity: Direction,
        post: Grid,
        postGravity: Direction,
    ) {
        val now = renderNanos()
        particles.setGravityBias(postGravity.dx.toFloat(), postGravity.dy.toFloat())
        squashGravity = postGravity

        phases.clear()
        phaseIdx = 0
        displayGrid = null

        val work = pre.copy()

        // có "nhịp" cần playback không: xóa hàng/cột, hợp nhất siêu khối, HOẶC tạo cầu vồng.
        var hasBeats = false
        for (i in events.indices) {
            val e = events[i]
            if (e is GameEvent.LinesCleared || e is GameEvent.SuperFormed || e is GameEvent.RainbowFormed) {
                hasBeats = true; break
            }
        }

        // "Nhìn trọng lực" CẢ BÀN chỉ khi XOAY trọng lực (mọi khối đều định hướng lại theo tường mới).
        // Đặt mảnh / xóa-rơi KHÔNG snap cả bàn: chỉ ô vừa đặt/vừa rơi mới nhìn trọng lực (per-cell,
        // xem [cellSettleFactor]) — yêu cầu người chơi: khi rơi chỉ khối bị rơi mới nhìn xuống.
        if (postGravity != preGravity) lastEventNanos = now

        // 1) đặt mảnh → squash
        for (i in events.indices) {
            val e = events[i]
            if (e is GameEvent.PiecePlaced) {
                place(work, e.piece, e.cells)
                if (!reducedMotion) {
                    for (k in e.cells.indices) {
                        val c = e.cells[k]
                        placeStart[c.y][c.x] = now
                    }
                }
            }
        }

        var cursor = now

        // 2) xoay trọng lực → slide cả bàn về tường mới + xoay con ngươi (ngay lập tức)
        if (postGravity != preGravity) {
            val before = work.copy()
            applyClusterGravity(work, postGravity)
            computeSlide(before, work, postGravity, now, Anim.ROTATE_NANOS)
            rotActive = true
            rotStart = now
            oldDirX = preGravity.dx.toFloat(); oldDirY = preGravity.dy.toFloat()
            newDirX = postGravity.dx.toFloat(); newDirY = postGravity.dy.toFloat()
            // các nhịp CHỜ bàn xoay ổn định xong rồi mới bắt đầu
            if (hasBeats) cursor = now + Anim.ROTATE_NANOS
        }

        // 3) chuỗi nhịp resolve theo ĐÚNG thứ tự engine: hợp nhất siêu khối / xóa+nổ → rơi.
        //    Mỗi nhịp = beat (form|clear) rồi collapse; nhịp kế chỉ bắt đầu SAU khi rơi xong.
        if (hasBeats) {
            displayGrid = work.copy()   // bàn đã đặt/đã xoay, trước nhịp đầu

            // combo tăng dần ⇒ NHỊP cuối có comboLevel cao nhất nổ overlay ×N — xét MỌI nhịp (xóa + ghép).
            var lastComboBeat = -1
            var bi = 0
            for (i in events.indices) {
                when (val e = events[i]) {
                    is GameEvent.SuperFormed -> { if (e.comboLevel >= 2) lastComboBeat = bi; bi++ }
                    is GameEvent.RainbowFormed -> { if (e.comboLevel >= 2) lastComboBeat = bi; bi++ }
                    is GameEvent.LinesCleared -> { if (e.comboLevel >= 2) lastComboBeat = bi; bi++ }
                    else -> {}
                }
            }

            var beatIdx = 0
            for (i in events.indices) {
                when (val e = events[i]) {
                    is GameEvent.SuperFormed -> {
                        cursor = buildMergeBeat(
                            e.at, e.absorbed, Grid.Cell(CellType.BLOCK, e.color, superLevel = e.level), e.color, work, postGravity, cursor,
                            score = e.score, comboLevel = e.comboLevel, fireCombo = beatIdx == lastComboBeat,
                        )
                        beatIdx++
                    }
                    is GameEvent.RainbowFormed -> {
                        cursor = buildMergeBeat(
                            e.at, e.absorbed, Grid.Cell(CellType.BLOCK, color = null, rainbow = true), null, work, postGravity, cursor,
                            score = e.score, comboLevel = e.comboLevel, fireCombo = beatIdx == lastComboBeat,
                        )
                        beatIdx++
                    }
                    is GameEvent.LinesCleared -> {
                        cursor = buildClearBeat(e, work, postGravity, cursor, fireCombo = beatIdx == lastComboBeat)
                        beatIdx++
                    }
                    else -> {}
                }
            }
        }

        // Mốc kết thúc playback để lớp vỏ khoá input: cascade (cursor đã gồm slide xoay + mọi nhịp)
        // hoặc chỉ slide xoay (xoay không cleared). Đặt-mảnh-trơn (chỉ squash, bàn không đổi) KHÔNG khoá.
        playbackEndNanos = when {
            hasBeats -> cursor
            postGravity != preGravity -> now + Anim.ROTATE_NANOS
            else -> now
        }

        // áp ngay các pha tới hạn (nhịp đầu) để không trễ một frame
        advancePhases(now)
    }

    /**
     * Dựng một nhịp HỢP NHẤT (siêu khối cấp 1/2 hoặc cầu vồng) trên [work]: 8 ô bị thu flash hội
     * tụ + ô kết quả pop, rồi cụm mất đỡ sụp. [resultCell] = ô đặt tại [at]; [sparkle] = màu lóe
     * (null ⇒ trắng, dùng cho cầu vồng). Phản chiếu collapseToSuper/collapseToRainbow của :core.
     */
    private fun buildMergeBeat(
        at: Vec, absorbed: List<Vec>, resultCell: Grid.Cell, sparkle: JellyColor?,
        work: Grid, gravity: Direction, cursor: Long,
        score: Int = 0, comboLevel: Int = 0, fireCombo: Boolean = false,
    ): Long {
        val colorGrid = work.copy()                              // còn 9 ô (đọc màu để flash)
        for (v in absorbed) work.set(v.x, v.y, null)
        work.set(at.x, at.y, resultCell)
        val after = work.copy()                                  // ô kết quả hiện, 8 ô trống
        val moved = applyConnectedGravity(work, gravity, absorbed.toHashSet())
        val afterFall = work.copy()

        val formAt = cursor
        phases.add(
            CascadePhase(
                at = formAt, display = after, isCollapse = false, isForm = true,
                colorGrid = colorGrid, score = score, comboLevel = comboLevel, fireCombo = fireCombo,
                superAt = at, superColor = sparkle, absorbed = absorbed,
            ),
        )
        val collapseAt = formAt + Anim.CLEAR_LEAD_NANOS
        phases.add(
            CascadePhase(at = collapseAt, display = afterFall, isCollapse = true, slideBefore = after, moved = moved),
        )
        return collapseAt + Anim.COLLAPSE_NANOS + Anim.CASCADE_GAP_NANOS
    }

    /**
     * Dựng một nhịp XÓA trên [work] — phản chiếu [expandDetonations] của :core.
     *  • KHÔNG nổ siêu khối → nhịp xóa thường (flash line → rơi).
     *  • CÓ nổ → **3 CHẶNG** (thời gian config ở companion DET_*): (1) xóa hàng/cột như thường →
     *    (2) các block CÙNG MÀU cười một chút rồi biến mất → (3) siêu khối biến mất cuối → rơi.
     */
    private fun buildClearBeat(
        e: GameEvent.LinesCleared, work: Grid, gravity: Direction, cursor: Long, fireCombo: Boolean,
    ): Long {
        val sk = work.copy()                                     // màu mọi ô trước khi xóa
        val seed = lineCells(e.lines, Grid.SIZE)
        val (toClear, dets) = expandDetonations(work, seed)

        if (dets.isEmpty()) {
            // ── nhịp xóa thường ──
            for (v in toClear) work.set(v.x, v.y, null)
            val beforeK = work.copy()
            val moved = applyConnectedGravity(work, gravity, toClear)
            val afterK = work.copy()
            val clearAt = cursor
            phases.add(
                CascadePhase(
                    at = clearAt, display = beforeK, isCollapse = false,
                    lines = e.lines, colorGrid = sk,
                    comboLevel = e.comboLevel, score = e.score, fireCombo = fireCombo,
                ),
            )
            val collapseAt = clearAt + Anim.CLEAR_LEAD_NANOS
            phases.add(
                CascadePhase(at = collapseAt, display = afterK, isCollapse = true, slideBefore = beforeK, moved = moved),
            )
            return collapseAt + Anim.COLLAPSE_NANOS + Anim.CASCADE_GAP_NANOS
        }

        // ── NỔ siêu khối / cầu vồng: 4 nhịp (xóa hàng → victim → tâm tan → rơi) ──
        // Tâm super (cười+nổ) và tâm cầu vồng (highlight→tan) tách riêng; victim = ô bị quét (cùng màu
        // cho super / màu kề cho cầu vồng). Cầu vồng → victim "highlight" thay vì "cười".
        val hasRainbow = dets.any { it.isRainbow }
        val centers = HashSet<Vec>(); for (d in dets) centers.add(d.center)
        val superCenters = ArrayList<Vec>(); val rainbowCenters = ArrayList<Vec>()
        for (d in dets) if (d.isRainbow) rainbowCenters.add(d.center) else superCenters.add(d.center)
        val stage1 = ArrayList<Vec>()                            // hàng/cột (trừ tâm detonator)
        for (v in seed) if (v !in centers) stage1.add(v)
        val stage2 = ArrayList<Vec>()                            // ô bị quét (trừ hàng, trừ tâm)
        for (v in toClear) if (v !in seed && v !in centers) stage2.add(v)

        // display grid theo từng chặng (block còn lại vẫn HIỆN cho tới lượt biến mất)
        val g1 = sk.copy(); for (v in stage1) g1.set(v.x, v.y, null)
        val g2 = g1.copy(); for (v in stage2) g2.set(v.x, v.y, null)
        val g3 = g2.copy(); for (v in centers) g3.set(v.x, v.y, null)
        for (v in toClear) work.set(v.x, v.y, null)             // work = final (trước rơi)
        val moved = applyConnectedGravity(work, gravity, toClear)
        val afterK = work.copy()

        val t0 = cursor                                                          // chặng 1: xóa hàng
        val t1 = t0 + DET_LINE_NANOS                                             // chặng 2: victim (cười/highlight)
        val smileDone = t1 + DET_SMILE_HOLD_NANOS + DET_SMILE_POP_NANOS
        val t2 = smileDone + DET_SUPER_DELAY_NANOS                               // chặng 3: tâm tan cuối
        val collapseAt = t2 + SUPER_FLASH_NANOS

        phases.add(
            CascadePhase(
                at = t0, display = g1, isCollapse = false, colorGrid = sk,
                comboLevel = e.comboLevel, score = e.score, fireCombo = fireCombo, clearCells = stage1,
            ),
        )
        phases.add(CascadePhase(at = t1, display = g2, isCollapse = false, colorGrid = sk, smileCells = stage2, smileHighlight = hasRainbow))
        phases.add(CascadePhase(at = t2, display = g3, isCollapse = false, colorGrid = sk, superCells = superCenters, rainbowCells = rainbowCenters))
        phases.add(CascadePhase(at = collapseAt, display = afterK, isCollapse = true, slideBefore = g3, moved = moved))
        return collapseAt + Anim.COLLAPSE_NANOS + Anim.CASCADE_GAP_NANOS
    }

    /** Kích hoạt các pha playback tới hạn theo thời gian sim [now]. */
    private fun advancePhases(now: Long) {
        while (phaseIdx < phases.size && phases[phaseIdx].at <= now) {
            val p = phases[phaseIdx]
            phaseIdx++
            displayGrid = p.display
            when {
                p.isCollapse -> activateCollapse(p)
                p.isForm -> activateForm(p)
                p.smileCells != null -> activateSmile(p)
                p.superCells != null -> activateSuperPop(p)
                else -> activateClear(p)
            }
        }
    }

    /**
     * Hợp nhất: 8 ô bị thu flash hội tụ về tâm (ô ngoài flash trước), siêu khối pop (squash bounce)
     * + lóe sao. Tổ hợp từ vocabulary line-clear (flash/particle) — b0 "tia hội tụ + ngôi sao nổ".
     */
    private fun activateForm(p: CascadePhase) {
        val colorGrid = p.colorGrid ?: return
        val absorbed = p.absorbed ?: return
        val center = p.superAt ?: return
        var maxD = 1
        for (i in absorbed.indices) { val d = cheb(absorbed[i], center); if (d > maxD) maxD = d }
        for (i in absorbed.indices) {
            val v = absorbed[i]
            val d = cheb(v, center)
            markClearCell(v.x, v.y, colorGrid, p.at + (maxD - d) * Anim.CLEAR_STAGGER_NANOS)  // ngoài → trong
        }
        if (!reducedMotion) {
            placeStart[center.y][center.x] = p.at + Anim.CLEAR_LEAD_NANOS  // pop sau khi 8 ô bắt đầu mờ
            val shine = p.superColor?.let { JellyTheme.forColor(it).shine } ?: Color.White
            particles.burst(center.x + 0.5f, center.y + 0.5f, shine, SUPER_POP_PARTICLES)
            // điểm "+N" cho lần ghép (bay lên tại tâm) — token motion như nhịp xóa
            if (p.score > 0) {
                particles.popup(
                    center.x + 0.5f, center.y + 0.9f, "+${p.score}", JellyTheme.textPrimary, SCORE_SP,
                    lifeS = Anim.SCORE_POP_NANOS / 1e9f, floatCell = 0.56f,
                )
            }
        }
        // combo "×N" cho nhịp ghép: nổ overlay ComboPopup tại tâm (lớp :app đọc comboBurst*)
        if (p.fireCombo && p.comboLevel >= 2) {
            comboBurstId++
            comboBurstCombo = p.comboLevel
            comboBurstCellX = center.x + 0.5f
            comboBurstCellY = center.y + 0.5f
            onComboBurst?.invoke()
        }
        onClearStep?.invoke(p.comboLevel)
    }

    /**
     * Flash/pop + particle + điểm/combo cho một nhịp xóa; màu lấy từ [CascadePhase.colorGrid].
     * Stagger ~20ms/khối dọc dòng (đọc thành "quét") theo vị trí ô trên đường.
     */
    private fun activateClear(p: CascadePhase) {
        val colorGrid = p.colorGrid ?: return
        var sumX = 0f; var sumY = 0f; var cnt = 0
        val stagger = Anim.CLEAR_STAGGER_NANOS
        val lines = p.lines
        if (lines != null) {
            for (ri in lines.rows.indices) {
                val y = lines.rows[ri]
                for (x in 0 until n) if (markClearCell(x, y, colorGrid, p.at + x * stagger)) { sumX += x; sumY += y; cnt++ }
            }
            for (ci in lines.cols.indices) {
                val x = lines.cols[ci]
                for (y in 0 until n) if (markClearCell(x, y, colorGrid, p.at + y * stagger)) { sumX += x; sumY += y; cnt++ }
            }
        }
        // chặng 1 của nổ: xóa hàng/cột (danh sách ô tường minh, quét theo thứ tự)
        val cc = p.clearCells
        if (cc != null) {
            for (i in cc.indices) {
                val v = cc[i]
                if (markClearCell(v.x, v.y, colorGrid, p.at + i * stagger)) { sumX += v.x; sumY += v.y; cnt++ }
            }
        }
        if (cnt > 0 && !reducedMotion) {
            val cx = sumX / cnt + 0.5f
            val cy = sumY / cnt + 0.5f
            if (p.score > 0) {
                // score "+N": ngắn (≤450ms) + trôi ~20dp (0.56 ô) theo token motion
                particles.popup(
                    cx, cy + 0.4f, "+${p.score}", JellyTheme.textPrimary, SCORE_SP,
                    lifeS = Anim.SCORE_POP_NANOS / 1e9f,
                    floatCell = 0.56f,
                )
            }
            if (p.fireCombo && p.comboLevel >= 2) {
                // combo "×N": overlay ComboPopup nổ TẠI vùng resolve ở lớp :app — chỉ ghi tâm + bump id.
                comboBurstId++
                comboBurstCombo = p.comboLevel
                comboBurstCellX = cx
                comboBurstCellY = cy
                onComboBurst?.invoke()
            }
        }
        // haptic theo nhịp (mắt nhìn trọng lực do per-cell [cellSettleFactor] lo: chỉ khối đang rơi)
        onClearStep?.invoke(p.comboLevel)
    }

    /** Chặng 2 nổ: ô bị quét cười (super) hoặc highlight (cầu vồng) rồi pop-fade ([drawSmileFlashes]). */
    private fun activateSmile(p: CascadePhase) {
        val colorGrid = p.colorGrid ?: return
        val cells = p.smileCells ?: return
        for (i in cells.indices) {
            val v = cells[i]
            val col = colorGrid.get(v.x, v.y)?.color ?: continue
            smileFlashes.add(SmileFlash(v.x, v.y, col, p.at, highlight = p.smileHighlight))
        }
        onClearStep?.invoke(0)
    }

    /** Chặng 3 nổ: tâm SIÊU KHỐI / CẦU VỒNG "biến mất" CUỐI cùng (overlay [drawSuperFlashes]). */
    private fun activateSuperPop(p: CascadePhase) {
        val colorGrid = p.colorGrid ?: return
        p.superCells?.let { cells ->
            for (i in cells.indices) {
                val cell = colorGrid.get(cells[i].x, cells[i].y) ?: continue
                val col = cell.color ?: continue
                superFlashes.add(SuperFlash(cells[i].x, cells[i].y, col, cell.superLevel, p.at))
                if (!reducedMotion) {
                    particles.burst(cells[i].x + 0.5f, cells[i].y + 0.5f, JellyTheme.forColor(col).shine, SUPER_POP_PARTICLES)
                }
            }
        }
        p.rainbowCells?.let { cells ->
            for (i in cells.indices) {
                superFlashes.add(SuperFlash(cells[i].x, cells[i].y, JellyColor.YELLOW, 0, p.at, rainbow = true))
                if (!reducedMotion) particles.burst(cells[i].x + 0.5f, cells[i].y + 0.5f, Color.White, SUPER_POP_PARTICLES)
            }
        }
        onClearStep?.invoke(0)
    }

    /** Kích hoạt nhịp rơi: nội suy slide từ [CascadePhase.slideBefore] về [CascadePhase.display]. */
    private fun activateCollapse(p: CascadePhase) {
        if (p.moved && p.slideBefore != null) {
            computeSlide(p.slideBefore, p.display, squashGravity, p.at, Anim.COLLAPSE_NANOS)
            // Squash khi CHẠM ĐÁY (spec 01: "a cluster falls under gravity" cũng nhún khi tiếp đất):
            // ô nào vừa rơi (slide ≠ 0) → đặt mốc squash đúng lúc slide kết thúc → nhão ra như lúc thả mảnh.
            if (!reducedMotion) {
                val impact = p.at + Anim.COLLAPSE_NANOS
                for (y in 0 until n) for (x in 0 until n) {
                    if (slideDY[y][x] != 0f || slideDX[y][x] != 0f) placeStart[y][x] = impact
                }
            }
        } else {
            // không có gì rơi → xoá slide buffer (đứng yên)
            for (y in 0 until n) for (x in 0 until n) { slideDX[y][x] = 0f; slideDY[y][x] = 0f }
        }
    }

    /** Đánh dấu một ô xóa (nếu có khối ở [colorGrid]) + bắn particle. Trả về true nếu có khối. */
    private fun markClearCell(x: Int, y: Int, colorGrid: Grid, t0: Long): Boolean {
        val cell = colorGrid.get(x, y) ?: return false
        clearStart[y][x] = t0
        val fill = when (cell.type) {
            CellType.STONE -> JellyTheme.stone.fill
            else -> cell.color?.let { JellyTheme.forColor(it).fill } ?: JellyTheme.cellEmpty
        }
        clearColor[y][x] = fill
        val shine = when (cell.type) {
            CellType.STONE -> JellyTheme.stone.shine
            else -> cell.color?.let { JellyTheme.forColor(it).shine } ?: Color.White
        }
        clearShine[y][x] = shine
        if (!reducedMotion) particles.burst(x + 0.5f, y + 0.5f, shine, PARTICLES_PER_CELL)
        return true
    }

    /**
     * Tính start-delta (theo ô) cho mọi ô đầy trong [after] để nội suy slide.
     * Ghép cặp theo thứ tự từ phía TƯỜNG trên từng đường vuông góc trọng lực.
     * Đá (STONE) bỏ qua (không di chuyển). Toàn bộ dùng buffer tái dùng.
     */
    private fun computeSlide(before: Grid, after: Grid, gravity: Direction, start: Long, dur: Long) {
        for (y in 0 until n) for (x in 0 until n) { slideDX[y][x] = 0f; slideDY[y][x] = 0f }
        slideStart = start
        slideDur = dur

        val vertical = gravity.dy != 0
        val positive = (gravity.dx + gravity.dy) > 0

        for (line in 0 until n) {
            var nb = 0
            var na = 0
            for (k in 0 until n) {
                val x = if (vertical) line else k
                val y = if (vertical) k else line
                val bc = before.get(x, y)
                if (bc != null && bc.type != CellType.STONE) {
                    beforeCoords[nb] = k; nb++
                }
                val ac = after.get(x, y)
                if (ac != null && ac.type != CellType.STONE) {
                    afterCoords[na] = k; afterCellX[na] = x; afterCellY[na] = y; na++
                }
            }
            val pairs = if (nb < na) nb else na
            for (r in 0 until pairs) {
                val bi = if (positive) nb - 1 - r else r
                val ai = if (positive) na - 1 - r else r
                val delta = (beforeCoords[bi] - afterCoords[ai]).toFloat()
                val ax = afterCellX[ai]; val ay = afterCellY[ai]
                if (vertical) slideDY[ay][ax] = delta else slideDX[ay][ax] = delta
            }
        }
    }

    // ── truy vấn cho BoardCanvas (float, không alloc) ──

    fun slideOffsetX(x: Int, y: Int, now: Long): Float {
        val d = slideDX[y][x]
        if (d == 0f) return 0f
        return d * (1f - Anim.easeInOut(elapsed(slideStart, slideDur, now)))
    }

    fun slideOffsetY(x: Int, y: Int, now: Long): Float {
        val d = slideDY[y][x]
        if (d == 0f) return 0f
        return d * (1f - Anim.easeInOut(elapsed(slideStart, slideDur, now)))
    }

    /**
     * Hệ số squash (1.0 nếu không). Trục theo gravity: dọc → bóp Y phình X; ngang → ngược lại.
     * Hai pha (spec 01-drop-squash): nén-vào-đỉnh 150ms (ease-jelly/easeOutBack) → giãn 150ms ease-out.
     */
    fun squashScaleX(x: Int, y: Int, now: Long): Float =
        squashAxis(x, y, now, peak = if (squashGravity.dy != 0) SQUASH_WIDE else SQUASH_SHORT)

    fun squashScaleY(x: Int, y: Int, now: Long): Float =
        squashAxis(x, y, now, peak = if (squashGravity.dy != 0) SQUASH_SHORT else SQUASH_WIDE)

    private fun squashAxis(x: Int, y: Int, now: Long, peak: Float): Float {
        val st = placeStart[y][x]
        if (st == 0L) return 1f
        val el = now - st
        if (el < 0L || el >= Anim.SQUASH_NANOS) return 1f
        return if (el < Anim.SQUASH_PEAK_NANOS) {
            // pha A: (1,1) → đỉnh, vọt mềm jelly
            val pa = el.toFloat() / Anim.SQUASH_PEAK_NANOS
            Anim.lerp(1f, peak, Anim.easeOutBack(pa))
        } else {
            // pha B: đỉnh → (1,1), giãn ease-out
            val pb = (el - Anim.SQUASH_PEAK_NANOS).toFloat() / (Anim.SQUASH_NANOS - Anim.SQUASH_PEAK_NANOS)
            Anim.lerp(peak, 1f, Anim.easeOut(pb))
        }
    }

    /**
     * Tiến độ xóa ô (0 = bình thường, 1 = xong fade-out).
     * Placeholder — Prompt 05 sẽ drive giá trị thực từ EffectController.
     * Hiện tại clearing xử lý qua drawOverlays (overlay riêng), trả về 0f.
     */
    fun clearProgress(x: Int, y: Int, now: Long): Float = 0f

    fun clear() {
        particles.clear()
        superFlashes.clear()
        smileFlashes.clear()
        for (y in 0 until n) for (x in 0 until n) {
            placeStart[y][x] = 0L; clearStart[y][x] = 0L
            slideDX[y][x] = 0f; slideDY[y][x] = 0f
        }
        rotActive = false
        phases.clear(); phaseIdx = 0; displayGrid = null
        playbackEndNanos = renderNanos()  // không kẹt khoá input sang ván mới
        lastEventNanos = renderNanos()   // ván mới: nhìn trọng lực rồi trôi về tính cách
    }

    fun drawOverlays(scope: DrawScope, cellPx: Float, gap: Float, measurer: TextMeasurer, now: Long) {
        drawClearing(scope, cellPx, gap, now)
        drawSmileFlashes(scope, cellPx, gap, now)   // block cùng màu cười (chặng 2)
        drawSuperFlashes(scope, cellPx, gap, now)   // siêu khối biến mất cuối (chặng 3) — vẽ trên cùng
        particles.drawParticles(scope, cellPx, renderAlpha)
        particles.drawPopups(scope, measurer, cellPx, renderAlpha)
    }

    /**
     * Block CÙNG MÀU "cười rồi biến mất" (chặng 2 nổ). Giữ HAPPY + nhún nhẹ trong [DET_SMILE_HOLD_NANOS]
     * rồi pop-fade trong [DET_SMILE_POP_NANOS]. Tổ hợp vocabulary: Eyes.HAPPY + 03-line-clear pop.
     */
    private fun drawSmileFlashes(scope: DrawScope, cellPx: Float, gap: Float, now: Long) {
        if (smileFlashes.isEmpty()) return
        val blockSize = cellPx - gap
        val cr = CornerRadius(blockSize * CORNER_FRAC, blockSize * CORNER_FRAC)
        val borderStroke = Stroke(blockSize * BORDER_FRAC)
        val total = DET_SMILE_HOLD_NANOS + DET_SMILE_POP_NANOS
        var i = 0
        while (i < smileFlashes.size) {
            val f = smileFlashes[i]
            val el = now - f.start
            if (el >= total) { smileFlashes.removeAt(i); continue }
            i++
            if (el < 0L) continue
            val clearP: Float
            val squash: Float
            if (el < DET_SMILE_HOLD_NANOS) {
                clearP = 0f
                val a = el.toFloat() / DET_SMILE_HOLD_NANOS
                squash = if (reducedMotion) 1f else 1f + 0.07f * kotlin.math.sin(a * Math.PI.toFloat())  // nhún 1 nhịp
            } else {
                clearP = (el - DET_SMILE_HOLD_NANOS).toFloat() / DET_SMILE_POP_NANOS
                squash = 1f
            }
            val left = f.x * cellPx + gap / 2f
            val top = f.y * cellPx + gap / 2f
            val palette = JellyTheme.forColor(f.color)
            with(scope) {
                if (f.highlight) {
                    // CẦU VỒNG: block giữ nguyên + vòng sáng trắng nhấp nháy (đánh dấu sắp quét) → pop
                    drawJellyCell(
                        left, top, blockSize, cr, borderStroke, palette, f.color, 0f, 1f,
                        expression = EyeExpression.NORMAL, eyeOpen = true,
                        squashScaleX = squash, squashScaleY = squash, clearProgress = clearP, showSticker = false,
                    )
                    if (clearP == 0f) {
                        val a = el.toFloat() / DET_SMILE_HOLD_NANOS
                        val ringA = 0.35f + 0.5f * (0.5f + 0.5f * kotlin.math.sin(a * 3f * Math.PI.toFloat()))
                        val rw = blockSize * 0.10f
                        drawRoundRect(
                            Color.White.copy(alpha = ringA),
                            Offset(left - rw * 0.5f, top - rw * 0.5f),
                            Size(blockSize + rw, blockSize + rw),
                            CornerRadius(cr.x + rw * 0.5f, cr.y + rw * 0.5f), style = Stroke(rw),
                        )
                    }
                } else {
                    // SUPER: ô cùng màu cười (HAPPY) + nhún → pop
                    drawJellyCell(
                        left, top, blockSize, cr, borderStroke, palette, f.color, 0f, 1f,
                        expression = EyeExpression.HAPPY, eyeOpen = true,
                        squashScaleX = squash, squashScaleY = squash, clearProgress = clearP, showSticker = false,
                    )
                }
            }
        }
    }

    /**
     * Vẽ tâm siêu khối "cười tươi rồi nổ" (đè lên flash xóa). Tổ hợp từ vocabulary design:
     * mắt HAPPY (Eyes.jsx ^ ^) + nhún to easeOutBack (01-drop-squash) → pop-fade (03-line-clear).
     * Pha 1 (≤45%): nhún to ×1.0→×1.26, mắt cười rõ. Pha 2: clearProgress 0→1 (pop ×1.12 + mờ → 0).
     */
    private fun drawSuperFlashes(scope: DrawScope, cellPx: Float, gap: Float, now: Long) {
        if (superFlashes.isEmpty()) return
        val blockSize = cellPx - gap
        val cr = CornerRadius(blockSize * CORNER_FRAC, blockSize * CORNER_FRAC)
        val borderStroke = Stroke(blockSize * BORDER_FRAC)
        val spin = (now % SUPER_SPIN_NANOS).toFloat() / SUPER_SPIN_NANOS
        var i = 0
        while (i < superFlashes.size) {
            val f = superFlashes[i]
            val el = now - f.start
            if (el >= SUPER_FLASH_NANOS) { superFlashes.removeAt(i); continue }
            i++
            if (el < 0L) continue
            val t = el.toFloat() / SUPER_FLASH_NANOS
            val bounce: Float
            val clearP: Float
            if (reducedMotion) {
                bounce = 1f
                clearP = t
            } else if (t < 0.45f) {
                bounce = Anim.lerp(1f, 1.26f, Anim.easeOutBack(t / 0.45f))   // bật to vui vẻ
                clearP = 0f
            } else {
                val b = (t - 0.45f) / 0.55f
                bounce = Anim.lerp(1.26f, 1.1f, Anim.easeOut(b))
                clearP = b                                                    // pop-fade
            }
            val left = f.x * cellPx + gap / 2f
            val top  = f.y * cellPx + gap / 2f
            with(scope) {
                if (f.rainbow) {
                    drawRainbowCell(
                        left, top, blockSize, cr, borderStroke, 0f, 1f,
                        expression = EyeExpression.HAPPY, eyeOpen = true,
                        squashScaleX = bounce, squashScaleY = bounce, clearProgress = clearP,
                    )
                } else {
                    drawSuperJellyCell(
                        left, top, blockSize, cr, borderStroke,
                        JellyTheme.forColor(f.color), f.level, 0f, 1f,
                        expression = EyeExpression.HAPPY, eyeOpen = true,
                        squashScaleX = bounce, squashScaleY = bounce,
                        clearProgress = clearP, pulse = 1f, spin = spin,
                    )
                }
            }
        }
    }

    private fun drawClearing(scope: DrawScope, cellPx: Float, gap: Float, now: Long) {
        val blockSize = cellPx - gap
        val corner = blockSize * CORNER_FRAC
        val ringW = blockSize * RING_FRAC   // ring shine 4dp (spec line-clear)
        for (y in 0 until n) {
            for (x in 0 until n) {
                val st = clearStart[y][x]
                if (st == 0L) continue
                val el = now - st
                if (el < 0L || el >= Anim.CLEAR_NANOS) continue
                val p = el.toFloat() / Anim.CLEAR_NANOS
                val left = x * cellPx + gap / 2
                val top = y * cellPx + gap / 2
                val cx = left + blockSize / 2
                val cy = top + blockSize / 2
                val base = clearColor[y][x]
                val flashSplit = Anim.CLEAR_FLASH_FRAC
                if (p < flashSplit) {
                    // flash: sáng mạnh (≈brightness 1.6) + ring shine 4dp màu khối
                    val ft = p / flashSplit
                    val bright = lerp(base, Color.White, 0.72f * Anim.easeOut(ft))
                    scope.drawRoundRectScaled(bright, left, top, blockSize, corner, 1f, cx, cy)
                    val ring = clearShine[y][x].copy(alpha = 0.85f * (1f - ft))
                    scope.drawRoundRect(
                        ring, Offset(left - ringW, top - ringW),
                        Size(blockSize + ringW * 2, blockSize + ringW * 2),
                        CornerRadius(corner, corner),
                        style = Stroke(ringW),
                    )
                } else {
                    // pop + biến mất: scale 1.12 + alpha→0, cả hai ease-out (spec)
                    val pt = (p - flashSplit) / (1f - flashSplit)
                    val eo = Anim.easeOut(pt)
                    val popScale = 1f + 0.12f * eo
                    val alpha = 1f - eo
                    scope.drawRoundRectScaled(base.copy(alpha = alpha), left, top, blockSize, corner, popScale, cx, cy)
                }
            }
        }
    }

    /** Khoảng cách Chebyshev (ô) giữa 2 điểm — dùng để stagger hội tụ (hợp nhất). */
    private fun cheb(v: Vec, c: Vec): Int =
        maxOf(kotlin.math.abs(v.x - c.x), kotlin.math.abs(v.y - c.y))

    companion object {
        private const val PARTICLES_PER_CELL = 5   // spec 4–6 đốm/khối
        private const val SUPER_POP_PARTICLES = 12 // lóe sao khi siêu khối hợp nhất (b0 "ngôi sao nổ")
        private const val SUPER_FLASH_NANOS = 520 * Anim.MS   // "cười tươi rồi nổ" của tâm siêu khối
        private const val SUPER_SPIN_NANOS  = 2600 * Anim.MS  // viền màu chạy (đồng bộ BoardCanvas)

        // ── NỔ SIÊU KHỐI: thời gian 3 CHẶNG — CONFIG, chỉnh tăng/giảm cho tới khi đạt ──
        private const val DET_LINE_NANOS       = 450 * Anim.MS  // chặng 1: xóa hàng/cột xong → chờ
        private const val DET_SMILE_HOLD_NANOS = 380 * Anim.MS  // chặng 2: block cùng màu CƯỜI bao lâu
        private const val DET_SMILE_POP_NANOS  = 260 * Anim.MS  // chặng 2: rồi pop-fade biến mất
        private const val DET_SUPER_DELAY_NANOS = 220 * Anim.MS // chờ thêm trước khi siêu khối biến mất
        private const val SCORE_SP = 16f
        private const val SQUASH_WIDE = 1.08f
        private const val SQUASH_SHORT = 0.86f

        // settle: giữ "nhìn trọng lực" ~1.2s sau sự kiện rồi ramp ~0.8s trả mắt cho tính cách
        // (người chơi chốt "bàn yên ~1–2s"). Đây là cửa sổ chuyển tiếp idle, không phải token cứng.
        private const val SETTLE_HOLD_NANOS = 1200 * Anim.MS
        private const val SETTLE_RAMP_NANOS = 800 * Anim.MS

        // tỉ lệ vẽ khối (đồng bộ JellyDraw — theo JellyBlock.jsx size*0.28)
        private const val CORNER_FRAC = 0.28f
        private const val BORDER_FRAC = 3f / 36f
        private const val RING_FRAC = 4f / 36f     // ring shine clear = 4dp / ô 36dp

        private fun elapsed(start: Long, dur: Long, now: Long): Float {
            if (dur <= 0L) return 1f
            return ((now - start).toFloat() / dur).coerceIn(0f, 1f)
        }
    }
}

/** Vẽ roundRect có scale quanh tâm (inline scope — không cấp phát). */
private fun DrawScope.drawRoundRectScaled(
    color: Color, left: Float, top: Float, blockSize: Float, corner: Float,
    scaleFactor: Float, pivotX: Float, pivotY: Float,
) {
    scale(scaleFactor, scaleFactor, Offset(pivotX, pivotY)) {
        drawRoundRect(color, Offset(left, top), Size(blockSize, blockSize), CornerRadius(corner, corner))
    }
}
