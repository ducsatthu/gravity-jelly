# Effect 05 — Particles & Juice (particle + cảm giác)

Shared "juice" layer that makes clears and combos feel satisfying. Small, short, never
blocking input.

## Burst particles (on line clear)
- 4–6 dots per cleared block, color = that block's `--*-shine`.
- Size 4–6dp, scatter radius ~16dp, gravity-biased drift, fade over `--motion-base` (250ms), `--ease-out`.

## Score float
- "+N" text floats up ~20dp from the cleared line, `--motion-base`, `--ease-out`, then fades.

## Press / tap feedback (global)
- Buttons: compress (`translateY` to edge depth) over `--motion-fast`, `--ease-out`.
- Jelly cells when grabbed from tray: lift `translateY(-6dp)` + scale `1.04`, `--ease-jelly`.

## Haptics (respect Settings → vibration)
- Place piece: light tick. Line clear: medium tick. Combo ≥3: double tick.

## Rules
- Total particle lifetime ≤ 450ms; never obscure the board for longer.
- All durations stay within 150–450ms; all easing from `--ease-*` tokens.
- Reduced-motion: skip particles + float; keep instant state changes.

**Compose:** a single `ParticleLayer` composable over the board reading a queue of
short-lived emitters; haptics via `LocalHapticFeedback`.
