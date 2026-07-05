package com.gravityjelly.game

import com.gravityjelly.core.ClearedLines
import com.gravityjelly.core.GameEvent
import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * Khoá luật phá Khiên boss (BOSS_COMBO): sát thương = số **bậc combo MỚI** đạt trong nước, đo từ
 * `comboBefore` (combo VÀO nước — trước resolve), theo [com.gravityjelly.core.ComboReward.rotationRefund].
 *
 * Bug đã sửa: trước đây holder cộng dồn một `bossComboBefore` = đỉnh combo cả màn. Với combo timer 10s
 * (mọi màn campaign), combo reset về 0 nhưng mốc đỉnh KHÔNG reset → combo x3/x4/x5 nước sau đo từ đỉnh
 * cũ ra **0 sát thương** ⇒ boss gần như bất tử. Nay mốc là combo-vào-nước nên mỗi combo ≥×2 lại phá Khiên.
 */
class BossComboDamageTest {

    private fun cleared(comboLevel: Int) =
        GameEvent.LinesCleared(ClearedLines(rows = listOf(4), cols = emptyList()), 9, comboLevel, 81)

    /** ×2 → +1, ×3 → +2, ×4 → +3 khi combo VÀO nước = 0 (đúng bảng docs/03-co-che/03-boss.md §3). */
    @Test
    fun freshCombo_dealsTierMinusOne() {
        val h2 = EndlessGameHolder(seed = 1L)
        h2.trackGoalEvents(listOf(cleared(2)), comboBefore = 0)
        assertEquals(1, h2.bossHpDamage)

        val h3 = EndlessGameHolder(seed = 1L)
        h3.trackGoalEvents(listOf(cleared(3)), comboBefore = 0)
        assertEquals(2, h3.bossHpDamage)

        val h4 = EndlessGameHolder(seed = 1L)
        h4.trackGoalEvents(listOf(cleared(4)), comboBefore = 0)
        assertEquals(3, h4.bossHpDamage)
    }

    /**
     * Cốt lõi của bug: HAI combo x3 RIÊNG BIỆT (mỗi combo bắt đầu từ 0 vì timer đã reset giữa chừng)
     * đều phá Khiên → tổng 2 + 2 = 4. Code cũ (đỉnh cộng dồn) cho 2 rồi 0 = 2 (boss kẹt).
     */
    @Test
    fun repeatedFreshCombos_eachDealDamage() {
        val h = EndlessGameHolder(seed = 1L)
        h.trackGoalEvents(listOf(cleared(3)), comboBefore = 0)   // combo x3 lần 1
        assertEquals(2, h.bossHpDamage)
        h.trackGoalEvents(listOf(cleared(3)), comboBefore = 0)   // combo x3 lần 2 (timer đã reset → before=0)
        assertEquals("combo x3 lần 2 phải phá thêm Khiên, không phải 0", 4, h.bossHpDamage)
    }

    /**
     * Chuỗi combo LIÊN TỤC (không reset): combo leo 0→2→3→4 qua các nước, mỗi bậc mới +1. Tổng = 3
     * (= đỉnh−1), KHÔNG cộng trùng bậc cũ.
     */
    @Test
    fun sustainedChain_countsOnlyNewTiers() {
        val h = EndlessGameHolder(seed = 1L)
        h.trackGoalEvents(listOf(cleared(2)), comboBefore = 0)   // đạt x2 → +1
        h.trackGoalEvents(listOf(cleared(3)), comboBefore = 2)   // x2→x3 → +1
        h.trackGoalEvents(listOf(cleared(4)), comboBefore = 3)   // x3→x4 → +1
        assertEquals(3, h.bossHpDamage)
    }

    /** Nước không tạo combo mới (peak ≤ before, hoặc < ×2) → không sát thương. */
    @Test
    fun noNewTier_noDamage() {
        val h = EndlessGameHolder(seed = 1L)
        h.trackGoalEvents(listOf(cleared(3)), comboBefore = 3)   // peak = before = 3 → 0
        assertEquals(0, h.bossHpDamage)
        h.trackGoalEvents(listOf(cleared(1)), comboBefore = 0)   // x1 (< ×2) → 0
        assertEquals(0, h.bossHpDamage)
    }
}
