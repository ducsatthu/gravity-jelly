package com.gravityjelly.core

data class EndlessTuning(
    val baseBudget: Int = 3,
    val budgetDecay: Int = Int.MAX_VALUE,
    val budgetMin: Int = 0,
    val replenishBudget: Boolean = false,
    val stoneStartStage: Int = Int.MAX_VALUE,
    val stoneInterval: Int = 3,
    val stonesPerDrop: Int = 1,
    val hardPoolStage: Int = Int.MAX_VALUE,
    /** Combo ≥ x2 hồi lượt xoay (cơ chế chữ ký dùng chung) — [ComboReward]. */
    val comboRefundsRotation: Boolean = true,
    /** Bật hợp nhất SIÊU KHỐI (9 ô cùng màu → siêu khối, nổ quét cùng màu toàn bàn). Tắt = merge off. */
    val superMergeEnabled: Boolean = true,
    /** TODO(combo-refund): chốt TRẦN hồi lượt xoay mỗi chặng. Tạm để không trần. */
    val rotationBudgetCap: Int = Int.MAX_VALUE,
    /** World 2 — DÂY LEO: mọc 1 đốt/dây mỗi N lượt THẢ (0 = tắt; 2 = mọc chậm, 1 = mọc nhanh). */
    val vineGrowEveryN: Int = 0,
    /** World 2 — DÂY LEO: số MẦM (tip) tối đa mỗi gốc nuôi cùng lúc — cap độ rậm (mặc định [DEFAULT_VINE_MAX_SPROUTS]). */
    val vineMaxSprouts: Int = DEFAULT_VINE_MAX_SPROUTS,
    /** Cơ chế đổ đá/rác (archetype boss dự phòng — KHÔNG dùng ở L20, L20 = Thần Rừng): số ô rác chèn mỗi lượt sau ân hạn (0 = tắt). */
    val debrisPerTurn: Int = 0,
    /** Số lượt ân hạn đầu KHÔNG đổ rác (cho người chơi setup). */
    val debrisGraceTurns: Int = 2,
    /** World 3 boss "Thần Thác": tự đảo trọng lực 180° mỗi N lượt THẢ (0 = tắt). (LEGACY — thay bằng revive.) */
    val bossGravityEveryN: Int = 0,
    /** World 3 boss "Thần Thác": HỒI SINH nguồn nước đã cạn (broken) mỗi N lượt THẢ — nguồn sống lại từ trên (0 = tắt). */
    val bossReviveEveryN: Int = 0,
    /** World 3 boss "Thần Thác": THẢ THÊM nguồn mới từ hàng trên mỗi N lượt THẢ (0 = tắt), tối đa [bossMaxSources]. */
    val bossSpawnSourceEveryN: Int = 0,
    /** World 3 boss — trần tổng số nguồn (cho spawn; 0 = không spawn). */
    val bossMaxSources: Int = 0,
    /** World 2 boss "Thần Rừng": spawn gốc vine mới mỗi N lượt THẢ (0 = tắt). */
    val bossVineSpawnEveryN: Int = 0,
    /**
     * Combo theo thời gian: nước vô ích KHÔNG reset combo trong core — game layer quản lý
     * timer 10s và gọi [EndlessEngine.resetCombo] khi hết hạn. Solver/replay bỏ qua timer.
     */
    val comboTimeBased: Boolean = false,
    /**
     * CHỐNG HẠN khay: bảo đảm mỗi đợt có đường thoát (null = TẮT, giữ RNG thuần & mọi golden test
     * byte-identical). Chỉ bật ở Endless live — KHÔNG bật cho [GAMEPLAY] (bot batch đo độ khó) hay
     * mặc định. Xem [WaveGenerator] / [AntiDroughtConfig].
     */
    val antiDrought: AntiDroughtConfig? = null,
) {
    fun budgetFor(stage: Int): Int =
        maxOf(budgetMin, baseBudget - (stage - 1) / budgetDecay)

    fun poolFor(stage: Int): List<Shape> =
        if (stage >= hardPoolStage) PieceLibrary.HARD else PieceLibrary.ALL

    companion object {
        val GAMEPLAY = EndlessTuning(
            baseBudget = 3,
            budgetDecay = 5,
            budgetMin = 0,
            replenishBudget = true,
            stoneStartStage = 4,
            stoneInterval = 3,
            stonesPerDrop = 1,
            hardPoolStage = 8,
            comboTimeBased = true,
        )
    }
}
