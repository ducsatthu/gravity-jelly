package com.gravityjelly.core

/**
 * Mô hình MỘT màn Campaign deterministic, khớp schema JSON ở docs/level-design.md.
 * :core parse/chạy được headless cho solver + sinh màn. (Stub khung, chưa có parser.)
 */
/**
 * Loại mục tiêu màn (hệ mục tiêu v2 — bỏ dựa-hoàn-toàn vào CLEAR_ALL, thêm trigger tutorial + boss).
 * - [TUTORIAL]: qua màn khi một HÀNH ĐỘNG xảy ra ([Goal.trigger]) — luôn khả thi, kiểm chứng bằng event.
 * - [REACH_SCORE]: đạt ngưỡng điểm ([Goal.score]).
 * - [BOSS_COMBO]: bào đủ [Goal.bossHP] sát thương bằng combo (mỗi lần combo chạm mức mới ≥×2 = bậc−1).
 * - [CLEAR_TARGETS]: phá đủ [Goal.count] ô đích (World 2 = GỐC dây leo).
 * - [MIXED]: phải đạt CẢ HAI — phá đủ [Goal.count] gốc VÀ đạt [Goal.score] điểm (World 2).
 * - [CLEAR_ALL]/[COMBO_CHAIN]: giữ cho tương thích/khác world.
 */
enum class GoalType { CLEAR_ALL, CLEAR_TARGETS, REACH_SCORE, COMBO_CHAIN, TUTORIAL, BOSS_COMBO, MIXED }

/**
 * Hành động tutorial cần thực hiện để qua màn (dùng với [GoalType.TUTORIAL]).
 * [COMBO_X2] = lần đầu đạt combo ≥ ×2 (xóa ≥2 hàng/cột trong 1 nước, hoặc cascade dồn tiếp).
 */
enum class TriggerKind { ROW, COL, ROTATE, SUPER1, SUPER2, RAINBOW, RAINBOW_SUPER, COMBO_X2 }

enum class StarMetric { MOVES, SCORE, COMBO, ROTATIONS }

data class PresetCell(
    val x: Int,
    val y: Int,
    val type: CellType,
    val color: JellyColor? = null,
    /** Chỉ dùng khi [type] = [CellType.VINE]: true = GỐC dây leo (target của màn). */
    val vineRoot: Boolean = false,
)

data class StarThresholds(val three: Int, val two: Int, val one: Int, val metric: StarMetric)

data class Goal(
    val type: GoalType,
    val count: Int = 0,
    val score: Int = 0,
    /** Hành động cần cho [GoalType.TUTORIAL]. */
    val trigger: TriggerKind? = null,
    /** Máu boss cho [GoalType.BOSS_COMBO] (tổng sát thương combo cần đạt). */
    val bossHP: Int = 0,
)

/** Một mảnh trong khay (chuỗi cố định, bỏ ngẫu nhiên cho màn thiết kế). [shape] theo vocab docs. */
data class TrayPiece(val shape: String, val color: JellyColor = JellyColor.YELLOW)

data class Level(
    val id: Int,
    val world: Int,
    val name: String,
    val seed: Long,
    val gridSize: Int = Grid.SIZE,
    val preset: List<PresetCell> = emptyList(),
    val gravity: Direction = Direction.DOWN,
    val rotationBudget: Int = 0,
    val modifiers: List<String> = emptyList(),
    val tray: List<TrayPiece> = emptyList(),
    val goal: Goal,
    val stars: StarThresholds,
    val difficulty: Double = 1.0,
    /** World 2 — nhịp mọc dây leo (0 = tắt). Chuyển vào [EndlessTuning.vineGrowEveryN]. */
    val vineGrowEveryN: Int = 0,
    /** World 2 boss — số ô rác chèn mỗi lượt sau ân hạn (0 = tắt). */
    val debrisPerTurn: Int = 0,
    /** World 3 boss "Thần Thác" — tự đảo trọng lực mỗi N lượt (0 = tắt). [EndlessTuning.bossGravityEveryN]. */
    val bossGravityEveryN: Int = 0,
    /** World 2 boss "Thần Rừng" — spawn gốc vine mới mỗi N lượt (0 = tắt). */
    val bossVineSpawnEveryN: Int = 0,
    /** World 3 — vị trí nguồn thác nước (lateral index 0..8 trên cạnh "trên" theo gravity). Rỗng = tắt. */
    val waterSources: List<Int> = emptyList(),
)
