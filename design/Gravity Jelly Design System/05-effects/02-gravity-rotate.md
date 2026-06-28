# Effect 02 — Gravity Rotate (xoay trọng lực 90°)

**When:** player taps the `GravityRotateButton`. The whole board's loose clusters slide
to the new gravity wall; eyes rotate to keep looking "down" relative to gravity.

| Stage | Token | Value |
|---|---|---|
| Board re-flow slide | `--motion-medium` · `--ease-inout` | 350ms |
| Eye pupil rotate | `--motion-medium` · `--ease-inout` | 350ms (parallel) |
| HUD arrow rotate | `--motion-medium` · `--ease-inout` | 350ms (parallel) |

**Sequence:**
1. Recompute resting positions for every non-stone cluster against the new gravity wall.
2. Animate each cluster's `translate(x, y)` to its new cell over 350ms `ease-inout`
   (all clusters move together, smooth — not staggered).
3. In parallel, pupils tween toward the new gravity vector; the HUD pill arrow rotates
   90° the same way.
4. Settled clusters that complete a row/column immediately trigger **Effect 03**.

**Direction cycle:** down → left → up → right (each tap = one 90° step).
Rotation count is finite per stage; at 0 the button greys out (`--color-stone`).

**Compose:** drive one shared `animateFloatAsState(progress)` 0→1; map each cluster's
old/new cell through `lerp`. Stones do not move.
