package com.gravityjelly.core

import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * Khoá luật combo-hồi-xoay theo spec (docs/business-understanding.md §6):
 * mỗi bậc combo MỚI đạt ≥ x2 → +1 lượt; hồi cộng dồn = bậc − 1 nếu combo chỉ tăng.
 */
class ComboRewardTest {

    @Test fun reachX1_noRefund() = assertEquals(0, ComboReward.rotationRefund(before = 0, after = 1))

    @Test fun reachX2_refundsOne() = assertEquals(1, ComboReward.rotationRefund(before = 0, after = 2))

    @Test fun reachX3_refundsTwoTotal() = assertEquals(2, ComboReward.rotationRefund(before = 0, after = 3))

    @Test fun reachX4_refundsThreeTotal() = assertEquals(3, ComboReward.rotationRefund(before = 0, after = 4))

    /** Combo bền: nước trước đã x3, nước này leo lên x5 → chỉ hồi 2 bậc mới (x4, x5). */
    @Test fun incrementalAcrossMoves_onlyNewTiers() =
        assertEquals(2, ComboReward.rotationRefund(before = 3, after = 5))

    /** Bắt đầu từ x1 (đã có combo) lên x2 vẫn chỉ +1, không nhân đôi. */
    @Test fun fromX1ToX2_one() = assertEquals(1, ComboReward.rotationRefund(before = 1, after = 2))

    @Test fun noIncrease_noRefund() = assertEquals(0, ComboReward.rotationRefund(before = 2, after = 2))

    @Test fun comboReset_noRefund() = assertEquals(0, ComboReward.rotationRefund(before = 4, after = 0))
}
