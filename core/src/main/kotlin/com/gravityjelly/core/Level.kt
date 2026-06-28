package com.gravityjelly.core

/**
 * Mô hình MỘT màn Campaign deterministic, khớp schema JSON ở docs/level-design.md.
 * :core parse/chạy được headless cho solver + sinh màn. (Stub khung, chưa có parser.)
 */
enum class GoalType { CLEAR_ALL, CLEAR_TARGETS, REACH_SCORE, COMBO_CHAIN }

enum class StarMetric { MOVES, SCORE, COMBO }

data class PresetCell(val x: Int, val y: Int, val type: CellType)

data class StarThresholds(val three: Int, val two: Int, val one: Int, val metric: StarMetric)

data class Goal(val type: GoalType, val count: Int = 0, val score: Int = 0)

/** Một mảnh trong khay (chuỗi cố định, bỏ ngẫu nhiên cho màn thiết kế). */
data class TrayPiece(val shape: String)

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
)
