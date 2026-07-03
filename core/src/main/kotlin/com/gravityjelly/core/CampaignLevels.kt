package com.gravityjelly.core

import com.gravityjelly.core.JellyColor.BLUE
import com.gravityjelly.core.JellyColor.MINT
import com.gravityjelly.core.JellyColor.PINK
import com.gravityjelly.core.JellyColor.YELLOW

/**
 * World 1 · Đồng cỏ = TUTORIAL WORLD (hệ mục tiêu v2, cập nhật 01/07/2026). Mỗi màn dạy đúng 1 cơ chế.
 *
 * NGUYÊN TẮC (01/07): **KHÔNG đặt sẵn khối để người chơi chỉ xóa** — người chơi TỰ KÉO-THẢ xây nên cấu
 * trúc mục tiêu (hàng/cột/3×3/…) từ khay được dựng đủ mảnh. Bàn khởi đầu TRỐNG (chỉ boss có đá cản, là
 * chướng ngại chứ không phải khối để xóa). Khay cạn script → deal RNG (đủ mảnh chơi tiếp ở màn điểm/boss).
 *
 * Lineup: L1 xóa-hàng · L2 xóa-cột · L3 xoay · L4 Thạch-Hoàng-Gia · L5 Vua-Thạch · L6 Thạch-Cầu-Vồng · L7 Hoàng-Đế-Cầu-Vồng
 * · L8 combo-×2 · L9 200-điểm · L10 boss. ⚠ L5, L7, L10 LIỆU NGHIỆM — cần chơi thử chỉnh khay/ngưỡng sao.
 */
object CampaignLevels {

    private fun tp(shape: String, color: JellyColor) = TrayPiece(shape, color)

    /** L1 — "Hàng đầu tiên" · tự xếp I5+I4 lấp đầy 1 HÀNG (9 ô) → xóa hàng. */
    val L1 = Level(
        id = 1, world = 1, name = "Hàng đầu tiên", seed = 1,
        preset = emptyList(),
        rotationBudget = 0,
        tray = listOf(tp("I5", YELLOW), tp("I4", MINT), tp("I3", PINK)),
        goal = Goal(GoalType.TUTORIAL, trigger = TriggerKind.ROW),
        stars = StarThresholds(three = 2, two = 3, one = 4, metric = StarMetric.MOVES),
        difficulty = 1.0,
    )

    /** L2 — "Cột đầu tiên" · tự chồng 3 mảnh dọc V3 lấp đầy 1 CỘT (9 ô) → xóa cột. */
    val L2 = Level(
        id = 2, world = 1, name = "Cột đầu tiên", seed = 2,
        preset = emptyList(),
        rotationBudget = 0,
        tray = listOf(tp("V3", MINT), tp("V3", YELLOW), tp("V3", PINK)),
        goal = Goal(GoalType.TUTORIAL, trigger = TriggerKind.COL),
        stars = StarThresholds(three = 3, two = 4, one = 5, metric = StarMetric.MOVES),
        difficulty = 1.0,
    )

    /** L3 — "Cú xoay đầu" · đặt vài mảnh rồi XOAY trọng lực để thấy CHÍNH khối mình dồn về tường. */
    val L3 = Level(
        id = 3, world = 1, name = "Cú xoay đầu", seed = 3,
        preset = emptyList(),
        rotationBudget = 2,
        tray = listOf(tp("I3", YELLOW), tp("I3", MINT), tp("V3", PINK)),
        goal = Goal(GoalType.TUTORIAL, trigger = TriggerKind.ROTATE),
        // Ngân sách 2 → tối đa 2 lần xoay, nên bậc sao khớp: ★★★=1 lần · ★★=2 lần (bỏ bậc ≤3 không chạm tới).
        stars = StarThresholds(three = 1, two = 2, one = 2, metric = StarMetric.ROTATIONS),
        difficulty = 1.5,
    )

    /** L4 — "Siêu khối" · tự xếp 3 mảnh ngang cùng màu thành 3×3 CÙNG MÀU → siêu khối cấp 1. */
    val L4 = Level(
        id = 4, world = 1, name = "Thạch Hoàng Gia", seed = 4,
        preset = emptyList(),
        rotationBudget = 1,
        tray = listOf(tp("I3", YELLOW), tp("I3", YELLOW), tp("I3", YELLOW)),
        goal = Goal(GoalType.TUTORIAL, trigger = TriggerKind.SUPER1),
        stars = StarThresholds(three = 3, two = 4, one = 5, metric = StarMetric.MOVES),
        difficulty = 2.0,
    )

    /**
     * L5 — "Cực hạn khối" · tạo SIÊU KHỐI CẤP 2. Ý đồ: xây một super1 (3×3 vàng) rồi lấp lại 3×3 quanh nó
     * (box chứa super1 → cấp 2). ⚠ LIỆU NGHIỆM: super1 rơi theo trọng lực sau khi ghép → cần chơi thử
     * chốt trình tự đặt. Khay cấp dư mảnh vàng.
     */
    val L5 = Level(
        id = 5, world = 1, name = "Vua Thạch", seed = 5,
        preset = emptyList(),
        rotationBudget = 2,
        tray = listOf(
            tp("I3", YELLOW), tp("I3", YELLOW), tp("I3", YELLOW),   // đợt 1: xây super1
            tp("I3", YELLOW), tp("I3", YELLOW), tp("I3", YELLOW),   // đợt 2: lấp lại 3×3 → super2
        ),
        goal = Goal(GoalType.TUTORIAL, trigger = TriggerKind.SUPER2),
        // MoveSolver: min = 6 nước → 3★=6, bước+2.
        stars = StarThresholds(three = 6, two = 8, one = 10, metric = StarMetric.MOVES),
        difficulty = 2.5,
    )

    /** L6 — "Cầu vồng 1" · tự xếp 3 cột V3 ba màu thành 3×3 SỌC BA MÀU → ô cầu vồng. */
    val L6 = Level(
        id = 6, world = 1, name = "Thạch Cầu Vồng", seed = 6,
        preset = emptyList(),
        rotationBudget = 2,
        tray = listOf(tp("V3", YELLOW), tp("V3", MINT), tp("V3", PINK)),
        goal = Goal(GoalType.TUTORIAL, trigger = TriggerKind.RAINBOW),
        stars = StarThresholds(three = 3, two = 4, one = 5, metric = StarMetric.MOVES),
        difficulty = 2.5,
    )

    /**
     * L7 — "Cầu vồng 2" · tạo CẦU VỒNG SIÊU CẤP (gộp kíp nổ khác màu / có cầu vồng dính liền).
     * ⚠ LIỆU NGHIỆM CAO: hai kíp nổ 3×3 tâm luôn cách ≥3 ô → khó đặt kề — có thể cần bổ sung cơ chế
     * :core cho dễ dạy. Tạm cấp khay đa dạng, CHỜ chơi thử để redesign.
     */
    val L7 = Level(
        id = 7, world = 1, name = "Hoàng Đế Cầu Vồng", seed = 7,
        preset = emptyList(),
        rotationBudget = 2,
        tray = listOf(
            tp("V3", YELLOW), tp("V3", MINT), tp("V3", PINK),
            tp("I3", YELLOW), tp("I3", YELLOW), tp("I3", YELLOW),
        ),
        goal = Goal(GoalType.TUTORIAL, trigger = TriggerKind.RAINBOW_SUPER),
        stars = StarThresholds(three = 6, two = 8, one = 10, metric = StarMetric.MOVES),
        difficulty = 3.0,
    )

    /**
     * L8 — "Combo x2 đầu tiên" · dạy DỒN CHUỖI: đạt combo ×2 lần đầu. Ý đồ: tự xây 2 hàng đáy (thiếu
     * cùng cột 8) rồi thả 1 mảnh dọc lấp cột 8 → xóa 2 hàng CÙNG LÚC → combo ×2. Khay đa màu (không
     * hoá siêu khối ngoài ý).
     */
    val L8 = Level(
        id = 8, world = 1, name = "Combo x2 đầu tiên", seed = 8,
        preset = emptyList(),
        rotationBudget = 2,
        tray = listOf(
            tp("I4", YELLOW), tp("I4", MINT), tp("I4", PINK),
            tp("I4", BLUE), tp("V3", YELLOW), tp("1", MINT),
        ),
        goal = Goal(GoalType.TUTORIAL, trigger = TriggerKind.COMBO_X2),
        // MoveSolver: min = 5 nước (xây 2 hàng đáy + lấp cột 8 → combo ×2) → 3★=5.
        stars = StarThresholds(three = 5, two = 7, one = 9, metric = StarMetric.MOVES),
        difficulty = 2.5,
    )

    /** L9 — "Hai trăm điểm" · củng cố điểm mức khó hơn. Đạt 200đ (dồn combo nhiều hàng). Khay cạn → RNG. */
    val L9 = Level(
        id = 9, world = 1, name = "Hai trăm điểm", seed = 9,
        preset = emptyList(),
        rotationBudget = 2,
        tray = listOf(
            tp("I5", YELLOW), tp("I4", MINT), tp("I5", PINK), tp("I4", BLUE),
            tp("V3", YELLOW), tp("V3", MINT), tp("V3", PINK), tp("V3", BLUE),
        ),
        goal = Goal(GoalType.REACH_SCORE, score = 200),
        stars = StarThresholds(three = 360, two = 280, one = 200, metric = StarMetric.SCORE),
        difficulty = 3.0,
    )

    /**
     * L10 — "Boss Combo" · máu boss = 5. Bào máu bằng combo: mỗi lần combo chạm mức mới ≥×2 = bậc−1 sát
     * thương. Có 2 ĐÁ CẢN (chướng ngại, không phải khối để xóa) tạo thế combo. Tự xây & xóa nhiều hàng
     * cùng lúc để lên combo. Sao = số NHỊP combo. ⚠ cần chơi thử chỉnh khay/ngưỡng.
     */
    val L10 = Level(
        id = 10, world = 1, name = "Boss Combo", seed = 10,
        preset = listOf(PresetCell(4, 0, CellType.STONE), PresetCell(4, 8, CellType.STONE)),
        rotationBudget = 3,
        tray = listOf(
            tp("I5", YELLOW), tp("I4", MINT), tp("I5", PINK), tp("I4", BLUE),
            tp("V3", YELLOW), tp("V3", MINT), tp("V3", PINK), tp("V3", BLUE),
        ),
        goal = Goal(GoalType.BOSS_COMBO, bossHP = 5),
        stars = StarThresholds(three = 3, two = 4, one = 5, metric = StarMetric.COMBO),
        difficulty = 3.5,
    )

    // ─────────────────────────────────────────────────────────────────────────────────────────
    // WORLD 2 · RỪNG RẬM (L11–L20) — REDESIGN v2 (02/07): vine xuyên suốt 9/10 màn + MINT-only
    // phá gốc + boss Thần Rừng (vine siege). Mỗi màn khai thác 1 khía cạnh mới của vine.
    // (goal-system-v2.md §8–11). ⚠ Ngưỡng sao/xoay = ứng viên, chốt bằng solver.
    // ─────────────────────────────────────────────────────────────────────────────────────────

    private fun vineRoot(x: Int, y: Int) = PresetCell(x, y, CellType.VINE, MINT, vineRoot = true)

    /** L11 — "Mầm Đầu Tiên" · phá 1 gốc (DẠY QUY TẮC MINT: dòng xoá phải chứa ≥1 khối MINT). */
    val L11 = Level(
        id = 11, world = 2, name = "Mầm Đầu Tiên", seed = 11,
        preset = listOf(vineRoot(4, 8)),
        rotationBudget = 3,
        vineGrowEveryN = 2,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 1),
        // MoveSolver: min = 4 nước → 3★=4.
        stars = StarThresholds(three = 4, two = 5, one = 6, metric = StarMetric.MOVES),
        difficulty = 2.0,
    )

    /** L12 — "Dây Leo Lan" · vine = trở ngại (chận chỗ). Đạt điểm với vine mọc nền. */
    val L12 = Level(
        id = 12, world = 2, name = "Dây Leo Lan", seed = 12,
        preset = listOf(vineRoot(4, 8)),
        rotationBudget = 3,
        vineGrowEveryN = 2,
        goal = Goal(GoalType.REACH_SCORE, score = 200),
        stars = StarThresholds(three = 400, two = 300, one = 200, metric = StarMetric.SCORE),
        difficulty = 2.0,
    )

    /** L13 — "Hai Rễ" · 2 gốc cùng hàng đáy → 1 clear = diệt cả 2. */
    val L13 = Level(
        id = 13, world = 2, name = "Hai Rễ", seed = 13,
        preset = listOf(vineRoot(2, 8), vineRoot(6, 8)),
        rotationBudget = 3,
        vineGrowEveryN = 2,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 2),
        // MoveSolver: min = 7 nước → 3★=7.
        stars = StarThresholds(three = 7, two = 9, one = 11, metric = StarMetric.MOVES),
        difficulty = 2.5,
    )

    /** L14 — "Rễ Khuất" · 1 gốc giữa bàn + 2 đá chắn → buộc xoay/lái để MINT tới gốc. */
    val L14 = Level(
        id = 14, world = 2, name = "Rễ Khuất", seed = 14,
        preset = listOf(vineRoot(4, 5), stone(3, 6), stone(5, 6)),
        rotationBudget = 3,
        vineGrowEveryN = 2,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 1),
        // MoveSolver: min = 11 nước (đá chắn buộc lái MINT tới gốc) → 3★=11.
        stars = StarThresholds(three = 11, two = 15, one = 19, metric = StarMetric.MOVES),
        difficulty = 3.0,
    )

    /** L15 — "Rừng Nhanh" · 2 gốc, mọc NHANH (N=1). Áp lực thời gian. */
    val L15 = Level(
        id = 15, world = 2, name = "Rừng Nhanh", seed = 15,
        preset = listOf(vineRoot(3, 8), vineRoot(5, 8)),
        rotationBudget = 3,
        vineGrowEveryN = 1,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 2),
        // MoveSolver: min = 4 nước (vine nhanh N=1 nhưng 2 gốc kề đáy) → 3★=4.
        stars = StarThresholds(three = 4, two = 5, one = 6, metric = StarMetric.MOVES),
        difficulty = 3.0,
    )

    /** L16 — "Bãi Trống" · breather: KHÔNG vine, đạt điểm nhẹ. */
    val L16 = Level(
        id = 16, world = 2, name = "Bãi Trống", seed = 16,
        rotationBudget = 3,
        goal = Goal(GoalType.REACH_SCORE, score = 150),
        stars = StarThresholds(three = 300, two = 220, one = 150, metric = StarMetric.SCORE),
        difficulty = 1.5,
    )

    /** L17 — "Tầng Rễ" · 2 gốc 2 tầng (đáy + giữa) → phải ưu tiên, phá lần lượt. */
    val L17 = Level(
        id = 17, world = 2, name = "Tầng Rễ", seed = 17,
        preset = listOf(vineRoot(4, 8), vineRoot(4, 4)),
        rotationBudget = 3,
        vineGrowEveryN = 2,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 2),
        // MoveSolver: min = 4 nước → 3★=4.
        stars = StarThresholds(three = 4, two = 5, one = 6, metric = StarMetric.MOVES),
        difficulty = 3.0,
    )

    /** L18 — "Rừng & Điểm" · MIXED: 1 gốc + điểm. Vine nhanh (N=1) + dồn score. */
    val L18 = Level(
        id = 18, world = 2, name = "Rừng & Điểm", seed = 18,
        preset = listOf(vineRoot(4, 5)),
        rotationBudget = 3,
        vineGrowEveryN = 1,
        goal = Goal(GoalType.MIXED, count = 1, score = 200),
        // Sao = LƯỢT (nhất quán màn dọn-mục-tiêu; điểm là sàn goal). MoveSolver: min = 29 nước (seed 18) → 3★=29.
        // ⚠ min cao (200đ + phá gốc, vine N=1) — cùng họ khó với L28; cân nhắc nới score/khay nếu thấy nản.
        stars = StarThresholds(three = 29, two = 39, one = 49, metric = StarMetric.MOVES),
        difficulty = 3.5,
    )

    /** L19 — "Rừng Rậm" · gauntlet: 3 gốc 3 tầng, nhanh (N=1). */
    val L19 = Level(
        id = 19, world = 2, name = "Rừng Rậm", seed = 19,
        preset = listOf(vineRoot(2, 8), vineRoot(4, 5), vineRoot(6, 2)),
        rotationBudget = 4,
        vineGrowEveryN = 1,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 3),
        // MoveSolver: min = 8 nước → 3★=8.
        stars = StarThresholds(three = 8, two = 11, one = 14, metric = StarMetric.MOVES),
        difficulty = 4.0,
    )

    /**
     * L20 — BOSS "Thần Rừng" (Vine Siege) · bào máu bằng combo. Boss spawn thêm gốc vine mới mỗi 3
     * lượt. Bắt đầu với 2 gốc. Vine nhanh (N=1). ⚠ HP + nhịp spawn = ứng viên solver.
     */
    val L20 = Level(
        id = 20, world = 2, name = "Thần Rừng", seed = 20,
        preset = listOf(vineRoot(1, 8), vineRoot(7, 8)),
        rotationBudget = 4,
        vineGrowEveryN = 1,
        bossVineSpawnEveryN = 3,
        goal = Goal(GoalType.BOSS_COMBO, bossHP = 8),   // khiên mock (boss-hud): Kẻ Đổ Rác/Thần Rừng = 8
        stars = StarThresholds(three = 4, two = 6, one = 8, metric = StarMetric.COMBO),
        difficulty = 4.0,
    )

    // ─────────────────────────────────────────────────────────────────────────────────────────
    // WORLD 3 · SÔNG & THÁC (L21–L30) — REDESIGN v3 (02/07): thác nước tự nhiên (BFS chảy từ
    // nguồn, tách khi gặp vật cản, ngập ô trống, phá giọt). Xoay trọng lực = xoay cả thác.
    // (goal-system-v2.md §12–15). ⚠ Ngưỡng sao = ứng viên, chốt bằng solver.
    // ─────────────────────────────────────────────────────────────────────────────────────────

    private fun drop(x: Int, y: Int) = PresetCell(x, y, CellType.TARGET, BLUE)
    private fun stone(x: Int, y: Int) = PresetCell(x, y, CellType.STONE)

    /** L21 — "Suối Nhỏ" · intro thác: 1 nguồn, 2 giọt gần. Đặt mảnh chặn thác → tách dòng phá giọt. */
    val L21 = Level(
        id = 21, world = 3, name = "Suối Nhỏ", seed = 21,
        preset = listOf(drop(3, 8), drop(5, 8)),
        waterSources = listOf(4),
        rotationBudget = 3,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 2),
        // MoveSolver: min = 10 nước (giọt lệch nguồn, 1 lần xoay không quét đủ) → 3★=10.
        stars = StarThresholds(three = 10, two = 14, one = 18, metric = StarMetric.MOVES),
        difficulty = 2.0,
    )

    /** L22 — "Nước Tràn" · thác ngập = áp lực. Đạt điểm với diện tích bị thu hẹp. */
    val L22 = Level(
        id = 22, world = 3, name = "Nước Tràn", seed = 22,
        waterSources = listOf(4),
        rotationBudget = 3,
        goal = Goal(GoalType.REACH_SCORE, score = 200),
        stars = StarThresholds(three = 400, two = 300, one = 200, metric = StarMetric.SCORE),
        difficulty = 2.5,
    )

    /** L23 — "Thác Tách" · xây tường tách dòng tới 3 giọt xa. */
    val L23 = Level(
        id = 23, world = 3, name = "Thác Tách", seed = 23,
        preset = listOf(drop(1, 8), drop(5, 8), drop(7, 8)),
        waterSources = listOf(4),
        rotationBudget = 3,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 3),
        // ⚠ MoveSolver: min = 2 nước (1 cú xoay quét trúng cả 3 giọt) → MOVES SUY BIẾN. Chờ quyết:
        // đổi metric→ROTATIONS hay siết hình học giọt. Tạm giữ số cũ (chưa hạ 3★ xuống 2).
        stars = StarThresholds(three = 4, two = 6, one = 10, metric = StarMetric.MOVES),
        difficulty = 3.0,
    )

    /** L24 — "Xoay Thác" · turning point: xoay gravity = lái thác qua 2 giọt. */
    val L24 = Level(
        id = 24, world = 3, name = "Xoay Thác", seed = 24,
        preset = listOf(drop(0, 4), drop(8, 4)),
        waterSources = listOf(4),
        rotationBudget = 4,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 2),
        // ⚠ Solver thắng 90% với 0 NƯỚC ĐẶT (chỉ xoay thác trúng giọt) → metric MOVES SUY BIẾN ở đây
        // (0 nước = 3★ miễn phí). Nên đổi metric màn này sang ROTATIONS. Tạm giữ MOVES, chờ chốt.
        stars = StarThresholds(three = 4, two = 7, one = 10, metric = StarMetric.MOVES),
        difficulty = 3.0,
    )

    /** L25 — "Giọt Sau Đá" · đá chắn dòng chảy, xoay + kênh vòng. */
    val L25 = Level(
        id = 25, world = 3, name = "Giọt Sau Đá", seed = 25,
        preset = listOf(
            drop(2, 7), drop(6, 7),
            stone(2, 5), stone(6, 5), stone(4, 3),
        ),
        waterSources = listOf(4),
        rotationBudget = 4,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 2),
        // ⚠ MoveSolver: min = 1 nước (xoay quét trúng 2 giọt) → MOVES SUY BIẾN. Chờ quyết metric/redesign.
        stars = StarThresholds(three = 6, two = 9, one = 13, metric = StarMetric.MOVES),
        difficulty = 3.5,
    )

    /** L26 — "Bến Nghỉ" · breather: thác nhẹ, đạt điểm. */
    val L26 = Level(
        id = 26, world = 3, name = "Bến Nghỉ", seed = 26,
        waterSources = listOf(7),
        rotationBudget = 3,
        goal = Goal(GoalType.REACH_SCORE, score = 150),
        stars = StarThresholds(three = 300, two = 220, one = 150, metric = StarMetric.SCORE),
        difficulty = 2.0,
    )

    /** L27 — "Hai Nguồn" · 2 nguồn, ngập rộng, 4 giọt. */
    val L27 = Level(
        id = 27, world = 3, name = "Hai Nguồn", seed = 27,
        preset = listOf(drop(0, 8), drop(3, 8), drop(5, 8), drop(8, 8)),
        waterSources = listOf(2, 6),
        rotationBudget = 4,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 4),
        // ⚠ MoveSolver: min = 1 nước (xoay quét trúng cả 4 giọt) → MOVES SUY BIẾN. Chờ quyết metric/redesign.
        stars = StarThresholds(three = 3, two = 5, one = 8, metric = StarMetric.MOVES),
        difficulty = 3.5,
    )

    /** L28 — "Thác & Điểm" · mixed: giọt + score. */
    val L28 = Level(
        id = 28, world = 3, name = "Thác & Điểm", seed = 28,
        preset = listOf(drop(2, 8), drop(6, 8)),
        waterSources = listOf(4),
        rotationBudget = 4,
        goal = Goal(GoalType.MIXED, count = 2, score = 200),
        // Sao = LƯỢT (nhất quán màn dọn-mục-tiêu; điểm là sàn goal). ⚠ SOLVER THẮNG 0% → chưa kiểm chứng
        // được; ước lượng theo L18 (mixed+điểm). Màn có thể QUÁ KHÓ — cần playtest hoặc nới khay/nhịp.
        stars = StarThresholds(three = 18, two = 26, one = 34, metric = StarMetric.MOVES),
        difficulty = 3.5,
    )

    /** L29 — "Thác Lớn" · gauntlet: 5 giọt + 4 đá = mê cung thủy lợi. Nguồn trung tâm, đá rải ngoài. */
    val L29 = Level(
        id = 29, world = 3, name = "Thác Lớn", seed = 29,
        preset = listOf(
            drop(0, 8), drop(2, 7), drop(6, 7), drop(8, 8), drop(1, 4),
            stone(2, 5), stone(6, 5), stone(3, 3), stone(5, 3),
        ),
        waterSources = listOf(4),
        rotationBudget = 5,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 5),
        // ⚠ MoveSolver: min = 2 nước (5 giọt+4 đá quét sạch bằng ~2 cú xoay) → MOVES SUY BIẾN, KHÔNG khó
        // như tưởng. Chờ quyết metric→ROTATIONS/redesign. (Comment "solver 0%" cũ dùng greedy — đã sai.)
        stars = StarThresholds(three = 10, two = 15, one = 22, metric = StarMetric.MOVES),
        difficulty = 4.5,
    )

    /**
     * L30 — BOSS "Thần Thác" · Cứ 3 lượt boss ĐẢO trọng lực 180° → đảo cả thác nếu có.
     * Bào máu bằng combo. ⚠ HP = ứng viên solver.
     */
    val L30 = Level(
        id = 30, world = 3, name = "Thần Thác", seed = 30,
        preset = listOf(stone(4, 0), stone(4, 8)),
        waterSources = listOf(4),
        rotationBudget = 5,
        bossGravityEveryN = 3,
        goal = Goal(GoalType.BOSS_COMBO, bossHP = 10),  // khiên mock (boss-hud): Thần Thác = 10
        stars = StarThresholds(three = 4, two = 6, one = 8, metric = StarMetric.COMBO),
        difficulty = 4.0,
    )

    /** Danh sách các màn Campaign theo thứ tự chơi (World 1 + World 2 + World 3). */
    val ALL: List<Level> = listOf(
        L1, L2, L3, L4, L5, L6, L7, L8, L9, L10,
        L11, L12, L13, L14, L15, L16, L17, L18, L19, L20,
        L21, L22, L23, L24, L25, L26, L27, L28, L29, L30,
    )
}
