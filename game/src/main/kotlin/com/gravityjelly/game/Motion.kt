package com.gravityjelly.game

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.DurationBasedAnimationSpec
import androidx.compose.animation.core.Easing
import androidx.compose.animation.core.tween

/**
 * Token MOTION — dịch 1:1 từ design `01-tokens/05-motion.css`.
 *
 * Dùng chung cho cả `:game` (effect/BoardAnimator) và `:app` (component Compose),
 * thay cho các hằng `CubicBezierEasing(...)` rải rác từng file. `:app` phụ thuộc
 * `:game` nên import được trực tiếp.
 *
 * Lưu ý: [Anim] (Anim.kt) là các hàm easing THUẦN SỐ (Float→Float) gọi trong vòng vẽ
 * allocation-free; còn đây là [Easing]/[DurationBasedAnimationSpec] cho API Compose
 * `animate*AsState` / `Animatable`. Hai lớp song hành, cùng giá trị bezier.
 */

/** Thời lượng (ms) — fast 150 · base 250 · medium 350 · slow 450. */
object GjMotion {
    const val fast   = 150   // taps, squash settle
    const val base   = 250   // piece place, popups
    const val medium = 350   // gravity rotate slide
    const val slow   = 450   // chain collapse / combo
}

/** Easing cubic-bezier — đúng số trong 05-motion.css. */
object GjEase {
    val inOut: Easing = CubicBezierEasing(0.45f, 0.05f, 0.30f, 0.95f)
    val out:   Easing = CubicBezierEasing(0.18f, 0.80f, 0.32f, 1.00f)
    val in_:   Easing = CubicBezierEasing(0.55f, 0.00f, 0.85f, 0.30f)
    val jelly: Easing = CubicBezierEasing(0.34f, 1.56f, 0.50f, 1.00f)  // overshoot mềm
}

// ── tween dựng sẵn cho các "named transition" của css ───────────────────────────

/** `--t-tap`: transform fast ease-out. */
fun <T> gjTapSpec(): DurationBasedAnimationSpec<T> = tween(GjMotion.fast, easing = GjEase.out)

/** `--t-place`: transform base ease-jelly (nảy nhẹ khi đặt mảnh/popup). */
fun <T> gjPlaceSpec(): DurationBasedAnimationSpec<T> = tween(GjMotion.base, easing = GjEase.jelly)

/** `--t-rotate`: transform medium ease-inout (xoay trọng lực, slide cụm). */
fun <T> gjRotateSpec(): DurationBasedAnimationSpec<T> = tween(GjMotion.medium, easing = GjEase.inOut)
