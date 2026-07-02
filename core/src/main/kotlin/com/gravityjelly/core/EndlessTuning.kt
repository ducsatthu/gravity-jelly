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
    /** World 2 boss "Kẻ Đổ Rác": số ô rác chèn mỗi lượt sau ân hạn (0 = tắt). */
    val debrisPerTurn: Int = 0,
    /** Số lượt ân hạn đầu KHÔNG đổ rác (cho người chơi setup). */
    val debrisGraceTurns: Int = 2,
    /** World 3 boss "Thần Thác": tự đảo trọng lực 180° mỗi N lượt THẢ (0 = tắt). */
    val bossGravityEveryN: Int = 0,
    /** World 2 boss "Thần Rừng": spawn gốc vine mới mỗi N lượt THẢ (0 = tắt). */
    val bossVineSpawnEveryN: Int = 0,
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
        )
    }
}
