# Effect 03 — Line Clear (xóa hàng / cột)

**When:** a row or column is fully filled. The line flashes, blocks pop and vanish with
a small particle burst and a light haptic tick.

| Stage | Token | Value |
|---|---|---|
| Flash (brighten) | `--motion-fast` · `--ease-out` | 150ms |
| Pop + vanish | `--motion-base` · `--ease-out` | 250ms |
| Particle burst | `--motion-base` · `--ease-out` | 250ms (parallel) |

**Per-block sequence (this is the `clearing` state on `JellyBlock`):**
1. Flash: `filter: brightness(1.6)` + a `--shine` ring (`box-shadow: 0 0 0 4px shine`),
   150ms `ease-out`.
2. Pop: `scale(1.12)` while `opacity → 0`, 250ms `ease-out`.
3. Particles: 4–6 small `--shine`-colored dots scatter outward ~16dp and fade, 250ms.
4. Haptic: one short tick (respect the vibration setting).

Stagger blocks along the line by ~20ms each for a sweep read.
After the line empties, remaining clusters fall — **Effect 04**.

**Compose:** `clearing` boolean → `keyframes` on scale/alpha; particles as a short-lived
list of `Offset` animatables; `HapticFeedbackType.LongPress` once.
