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
        // Điểm = điều kiện THẮNG; sao chấm theo NƯỚC (thống nhất toàn campaign). MoveSolver: min = 37 nước.
        stars = StarThresholds(three = 37, two = 50, one = 63, metric = StarMetric.MOVES),
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
        // MoveSolver: min 14 nước → 3★=14, step=5.
        stars = StarThresholds(three = 14, two = 19, one = 24, metric = StarMetric.MOVES),
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
        // Điểm = điều kiện THẮNG; sao chấm theo NƯỚC. MoveSolver: min = 26 nước.
        stars = StarThresholds(three = 26, two = 35, one = 44, metric = StarMetric.MOVES),
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
        // Điểm = điều kiện THẮNG; sao chấm theo NƯỚC. MoveSolver: min = 30 nước.
        stars = StarThresholds(three = 30, two = 41, one = 52, metric = StarMetric.MOVES),
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
        // MoveSolver: min = 13 nước → 3★=13 (04/07: mô hình vine mới rễ-3-hướng/tip-độc-lập làm min tăng 8→13).
        stars = StarThresholds(three = 13, two = 18, one = 23, metric = StarMetric.MOVES),
        difficulty = 4.0,
    )

    /**
     * L20 — BOSS "Thần Rừng" (Vine Siege) · bào máu bằng combo. Boss spawn thêm gốc vine mới mỗi 4
     * lượt. Bắt đầu với 2 gốc. Vine nhanh (N=1). Solver: min 19 nước (spawnEvery=4).
     */
    val L20 = Level(
        id = 20, world = 2, name = "Thần Rừng", seed = 20,
        preset = listOf(vineRoot(1, 8), vineRoot(7, 8)),
        rotationBudget = 4,
        vineGrowEveryN = 1,
        bossVineSpawnEveryN = 4,
        goal = Goal(GoalType.BOSS_COMBO, bossHP = 8),
        // MoveSolver (spawnEvery=4): min 19 nước (04/07: vine mới rễ-3-hướng + chống merge same-turn/quanh-gốc).
        stars = StarThresholds(three = 19, two = 26, one = 33, metric = StarMetric.MOVES),
        difficulty = 4.0,
    )

    // ─────────────────────────────────────────────────────────────────────────────────────────
    // WORLD 3 · SÔNG & THÁC (L21–L30) — REDESIGN v5 (05/07): cơ chế Dòng chảy / Nguồn nước.
    // Nguồn ở HÀNG TRÊN CÙNG, luôn chảy XUỐNG (cố định, độc lập trọng lực), mọc 1 ô/lượt & RẼ ngang khi
    // bị chặn; ĐẨY đoàn tàu jelly đứng trên kênh (xé cụm). PHÁ nguồn = clear hàng/cột đi qua chính ô
    // nguồn (bỏ ô giọt). Đa số màn goal ĐIỂM (nước = áp lực đẩy lệch); vài màn phá nguồn; boss combo.
    // Xem docs/02-thiet-ke-man/07-world-3-nhip-nuoc.md. ⚠ Ngưỡng sao = ỨNG VIÊN, chốt bằng MoveSolver.
    // ─────────────────────────────────────────────────────────────────────────────────────────

    private fun stone(x: Int, y: Int) = PresetCell(x, y, CellType.STONE)
    /** Nguồn ở HÀNG TRÊN CÙNG (y=0), chảy xuống. [maxLength] = trần độ dài kênh. */
    private fun src(id: Int, x: Int, maxLength: Int = 6) = WaterSourceSpec(id, x, 0, maxLength = maxLength)

    /** L21 — "Suối Nhỏ" · intro: 1 nguồn chảy xuống đẩy jelly; dựng đủ 1 line qua ô nguồn để phá. */
    val L21 = Level(
        id = 21, world = 3, name = "Suối Nhỏ", seed = 21,
        waterSources = listOf(src(1, 4, maxLength = 6)),
        rotationBudget = 3,
        goal = Goal(GoalType.CLEAR_TARGETS, count = 1),
        stars = StarThresholds(three = 6, two = 8, one = 10, metric = StarMetric.MOVES),
        difficulty = 2.0,
    )

    /** L22 — "Đôi Dòng" · hướng dẫn 2: hai dòng chảy đẩy lệch; đạt điểm nhẹ. Vẫn nhẹ (< 10 nước). */
    val L22 = Level(
        id = 22, world = 3, name = "Đôi Dòng", seed = 22,
        waterSources = listOf(src(1, 2, maxLength = 6), src(2, 6, maxLength = 6)),
        rotationBudget = 3,
        goal = Goal(GoalType.REACH_SCORE, score = 70),
        stars = StarThresholds(three = 10, two = 13, one = 16, metric = StarMetric.MOVES),
        difficulty = 2.5,
    )

    /** L23 — "Ba Dòng" · bắt đầu khó: 3 dòng chảy đẩy lệch liên tục, dồn combo đủ điểm giữa áp lực. */
    val L23 = Level(
        id = 23, world = 3, name = "Ba Dòng", seed = 23,
        waterSources = listOf(src(1, 1, maxLength = 6), src(2, 4, maxLength = 6), src(3, 7, maxLength = 6)),
        rotationBudget = 3,
        goal = Goal(GoalType.REACH_SCORE, score = 150),
        stars = StarThresholds(three = 16, two = 21, one = 26, metric = StarMetric.MOVES),
        difficulty = 3.0,
    )

    /** L24 — "Xoay Dòng" · xoay trọng lực để dồn combo giữa lúc dòng chảy đẩy lệch. Đạt điểm. */
    val L24 = Level(
        id = 24, world = 3, name = "Xoay Dòng", seed = 24,
        waterSources = listOf(src(1, 3, maxLength = 6), src(2, 6, maxLength = 6)),
        rotationBudget = 4,
        goal = Goal(GoalType.REACH_SCORE, score = 170),
        stars = StarThresholds(three = 16, two = 21, one = 26, metric = StarMetric.MOVES),
        difficulty = 3.0,
    )

    /** L25 — "Chặn Nguồn" · phá 1 nguồn bị đá vây (nước rẽ vòng) — dựng line cắt nguồn giữa áp lực. */
    val L25 = Level(
        id = 25, world = 3, name = "Chặn Nguồn", seed = 25,
        preset = listOf(stone(3, 3), stone(5, 3)),
        waterSources = listOf(src(1, 4, maxLength = 8), src(2, 1, maxLength = 6)),
        rotationBudget = 2,
        goal = Goal(GoalType.MIXED, count = 1, score = 220),
        stars = StarThresholds(three = 19, two = 24, one = 29, metric = StarMetric.MOVES),
        difficulty = 3.5,
    )

    /** L26 — "Bến Nghỉ" · breather: 1 dòng nhẹ, mục tiêu điểm vừa phải. */
    val L26 = Level(
        id = 26, world = 3, name = "Bến Nghỉ", seed = 26,
        waterSources = listOf(src(1, 4, maxLength = 5)),
        rotationBudget = 3,
        goal = Goal(GoalType.REACH_SCORE, score = 90),
        stars = StarThresholds(three = 11, two = 15, one = 19, metric = StarMetric.MOVES),
        difficulty = 2.5,
    )

    /** L27 — "Ba Nguồn" · 3 dòng chảy + đá cản buộc rẽ nhiều; điểm cao hơn. */
    val L27 = Level(
        id = 27, world = 3, name = "Ba Nguồn", seed = 27,
        preset = listOf(stone(4, 4), stone(7, 5)),
        waterSources = listOf(src(1, 1, maxLength = 7), src(2, 4, maxLength = 7), src(3, 7, maxLength = 7)),
        rotationBudget = 4,
        goal = Goal(GoalType.REACH_SCORE, score = 480),
        stars = StarThresholds(three = 22, two = 28, one = 34, metric = StarMetric.MOVES),
        difficulty = 4.0,
    )

    /** L28 — "Dòng Xiết" · điểm cao: 2 dòng chảy dài đẩy mạnh, phải dồn nhiều combo mới đủ điểm. */
    val L28 = Level(
        id = 28, world = 3, name = "Dòng Xiết", seed = 28,
        waterSources = listOf(src(1, 2, maxLength = 8), src(2, 6, maxLength = 8)),
        rotationBudget = 5,
        goal = Goal(GoalType.REACH_SCORE, score = 520),
        stars = StarThresholds(three = 25, two = 32, one = 39, metric = StarMetric.MOVES),
        difficulty = 4.0,
    )

    /**
     * L29 — "Thác Lớn" · gauntlet trước boss: 3 dòng chảy dài + đá bậc thang buộc rẽ; điểm cao nhất
     * trước boss. Mê cung thủy lợi — số nước nhiều nhất World 3.
     */
    val L29 = Level(
        id = 29, world = 3, name = "Thác Lớn", seed = 29,
        preset = listOf(stone(2, 4), stone(4, 5), stone(6, 4)),
        waterSources = listOf(src(1, 1, maxLength = 8), src(2, 4, maxLength = 8), src(3, 7, maxLength = 8)),
        rotationBudget = 3,
        goal = Goal(GoalType.REACH_SCORE, score = 660),
        stars = StarThresholds(three = 29, two = 37, one = 45, metric = StarMetric.MOVES),
        difficulty = 4.5,
    )

    /**
     * L30 — BOSS "Thần Thác" · khởi đầu 2 nguồn; mỗi 3 lượt boss **HỒI SINH nguồn cạn** VÀ **THẢ THÊM 1
     * nguồn mới** từ hàng trên (tối đa 4 nguồn) → áp lực dòng chảy dâng dần. Người chơi phải **phá nguồn
     * 5 LẦN** (cắm Thạch Nước clear line qua ô nguồn). Sao theo LƯỢT. ⚠ ngưỡng chốt bằng solver.
     */
    val L30 = Level(
        id = 30, world = 3, name = "Thần Thác", seed = 30,
        preset = listOf(stone(4, 5)),
        waterSources = listOf(src(1, 2, maxLength = 8), src(2, 6, maxLength = 8)),
        rotationBudget = 4,
        bossReviveEveryN = 3,          // hồi sinh nguồn cạn mỗi 3 lượt
        bossSpawnSourceEveryN = 3,     // thả thêm 1 nguồn mới mỗi 3 lượt
        bossMaxSources = 4,            // tối đa 4 nguồn cùng lúc
        goal = Goal(GoalType.CLEAR_TARGETS, count = 8),   // phá nguồn 8 lần
        stars = StarThresholds(three = 25, two = 32, one = 39, metric = StarMetric.MOVES),
        difficulty = 4.5,
    )

    /** Danh sách các màn Campaign theo thứ tự chơi (World 1 + World 2 + World 3). */
    val ALL: List<Level> = listOf(
        L1, L2, L3, L4, L5, L6, L7, L8, L9, L10,
        L11, L12, L13, L14, L15, L16, L17, L18, L19, L20,
        L21, L22, L23, L24, L25, L26, L27, L28, L29, L30,
    )
}
