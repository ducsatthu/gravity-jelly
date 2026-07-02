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
        stars = StarThresholds(three = 5, two = 7, one = 9, metric = StarMetric.MOVES),
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
        stars = StarThresholds(three = 5, two = 6, one = 7, metric = StarMetric.MOVES),
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

    /** Danh sách 10 màn World 1 theo thứ tự chơi. */
    val ALL: List<Level> = listOf(L1, L2, L3, L4, L5, L6, L7, L8, L9, L10)
}
