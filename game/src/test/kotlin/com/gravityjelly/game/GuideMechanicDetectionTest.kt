package com.gravityjelly.game

import com.gravityjelly.core.ClearedLines
import com.gravityjelly.core.Direction
import com.gravityjelly.core.GameEvent
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Vec
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Khoá spec phát hiện cơ chế GẶP-LẦN-ĐẦU ([EndlessGameHolder.detectGuideMechanics] → [guideQueue]):
 * mỗi loại sự kiện engine map đúng [GameMechanic], giữ thứ tự, dedup một-lần/phiên. Đây là nguồn
 * trigger cho popup dạy luật (vd "Nổ siêu khối" hiện LẦN ĐẦU siêu khối kích nổ).
 */
class GuideMechanicDetectionTest {

    private fun holder() = EndlessGameHolder(seed = 1L)

    private fun detonated(level: Int, isRainbow: Boolean) =
        GameEvent.SuperDetonated(Vec(4, 4), JellyColor.YELLOW, level, listOf(Vec(4, 4)), isRainbow)

    @Test
    fun superDetonated_level1_enqueuesDetonateSuper1() {
        val h = holder()
        h.detectGuideMechanics(listOf(detonated(level = 1, isRainbow = false)))
        assertEquals(listOf(GameMechanic.DETONATE_SUPER1), h.guideQueue)
    }

    @Test
    fun superDetonated_level2_enqueuesDetonateSuper2() {
        val h = holder()
        h.detectGuideMechanics(listOf(detonated(level = 2, isRainbow = false)))
        assertEquals(listOf(GameMechanic.DETONATE_SUPER2), h.guideQueue)
    }

    @Test
    fun rainbowDetonated_byLevel_enqueuesRainbow1or2() {
        val h1 = holder()
        h1.detectGuideMechanics(listOf(detonated(level = 0, isRainbow = true)))
        assertEquals(listOf(GameMechanic.DETONATE_RAINBOW1), h1.guideQueue)

        val h2 = holder()
        h2.detectGuideMechanics(listOf(detonated(level = 2, isRainbow = true)))
        assertEquals(listOf(GameMechanic.DETONATE_RAINBOW2), h2.guideQueue)
    }

    @Test
    fun gravityRotated_enqueuesGravityRotate() {
        val h = holder()
        h.detectGuideMechanics(listOf(GameEvent.GravityRotated(Direction.RIGHT)))
        assertEquals(listOf(GameMechanic.GRAVITY_ROTATE), h.guideQueue)
    }

    @Test
    fun linesCleared_rowOrCol_enqueuesSingleClearLine() {
        // Xóa hàng & cột là CÙNG một luật → chỉ một mục CLEAR_LINE (không tách hàng/cột).
        val h = holder()
        h.detectGuideMechanics(
            listOf(GameEvent.LinesCleared(ClearedLines(rows = listOf(3), cols = listOf(5)), 17, 1, 17)),
        )
        assertEquals(listOf(GameMechanic.CLEAR_LINE), h.guideQueue)
    }

    @Test
    fun clustersCollapsedMoved_enqueuesGravityDropAndSticky() {
        val h = holder()
        h.detectGuideMechanics(listOf(GameEvent.ClustersCollapsed(moved = true)))
        assertEquals(listOf(GameMechanic.GRAVITY_DROP, GameMechanic.STICKY_CLUSTER), h.guideQueue)
        // không di chuyển → không dạy gì
        val h2 = holder()
        h2.detectGuideMechanics(listOf(GameEvent.ClustersCollapsed(moved = false)))
        assertTrue(h2.guideQueue.isEmpty())
    }

    @Test
    fun firstDetonationFlow_clearThenDetonateSuper_keepsOrder() {
        // Mô phỏng đúng chuỗi khi siêu khối bị cuốn vào hàng xóa: xóa hàng → nổ super → cụm sụp.
        val h = holder()
        h.detectGuideMechanics(
            listOf(
                GameEvent.LinesCleared(ClearedLines(rows = listOf(4), cols = emptyList()), 9, 3, 81),
                detonated(level = 1, isRainbow = false),
                GameEvent.ClustersCollapsed(moved = true),
            ),
        )
        assertEquals(
            listOf(
                GameMechanic.CLEAR_LINE,
                GameMechanic.DETONATE_SUPER1,
                GameMechanic.GRAVITY_DROP,
                GameMechanic.STICKY_CLUSTER,
            ),
            h.guideQueue,
        )
    }

    @Test
    fun dedup_sameMechanicOncePerSession() {
        val h = holder()
        h.detectGuideMechanics(listOf(detonated(level = 1, isRainbow = false)))
        h.detectGuideMechanics(listOf(detonated(level = 1, isRainbow = false)))   // lần 2 KHÔNG thêm
        assertEquals(listOf(GameMechanic.DETONATE_SUPER1), h.guideQueue)
    }

    @Test
    fun consumeGuide_dropsHead() {
        val h = holder()
        h.detectGuideMechanics(listOf(GameEvent.GravityRotated(Direction.LEFT), detonated(1, false)))
        assertEquals(listOf(GameMechanic.GRAVITY_ROTATE, GameMechanic.DETONATE_SUPER1), h.guideQueue)
        h.consumeGuide()
        assertEquals(listOf(GameMechanic.DETONATE_SUPER1), h.guideQueue)
    }
}
