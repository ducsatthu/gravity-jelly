package com.gravityjelly.core

data class RotationResult(
    val newGravity: Direction,
    val settled: Boolean,
    val resolveResult: ResolveResult,
    val budgetAfter: Int,
)

/**
 * Xoay trọng lực 90° (CW hoặc CCW), rồi:
 *   1. applyClusterGravity theo hướng mới (cụm sụp về vị trí mới)
 *   2. resolve (xóa hàng/cột đầy + cascade combo)
 *   3. trừ 1 ngân sách xoay
 * Trả về null nếu hết ngân sách.
 */
fun rotateGravity(
    grid: Grid,
    gravity: Direction,
    cw: Boolean,
    budget: Int,
): RotationResult? {
    if (budget <= 0) return null

    val newGravity = if (cw) gravity.rotateCW() else gravity.rotateCCW()
    val settled = applyClusterGravity(grid, newGravity)
    val resolveResult = resolve(grid, newGravity)

    return RotationResult(
        newGravity = newGravity,
        settled = settled,
        resolveResult = resolveResult,
        budgetAfter = budget - 1,
    )
}
