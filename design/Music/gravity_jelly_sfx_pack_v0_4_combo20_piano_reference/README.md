# Gravity Jelly SFX Pack v0.4 — Piano Reference Tone + 20 Combo Bursts

This version keeps the v0.3 muted piano reference tone, but replaces the old 4-tier combo burst design with **20 separate ascending combo burst files**.

## Main change

Old:

- `sfx_combo_burst_1.ogg`
- `sfx_combo_burst_2.ogg`
- `sfx_combo_burst_3.ogg`
- `sfx_combo_burst_4.ogg`

New:

- `sfx_combo_burst_01.ogg` → `sfx_combo_burst_20.ogg`
- Each file is a distinct rising piano note/gesture.
- The sequence follows a soft C major ascending palette.
- Upper notes are quieter and more low-pass filtered to avoid harshness.

## Preview files

- `preview_combo_burst_20_v04.mp3` — all 20 combo bursts in order
- `preview_mvp_v04.mp3` — quick gameplay preview including combo examples

## Duration policy

- Total `.ogg` files: 64
- Longest SFX: 2100 ms
- Files under 1 second: 57
- Every SFX is under 3 seconds
- Combo burst files are about 420–672 ms each

## Suggested mapping

Use combo step 1–20 directly:

```kotlin
val rawRes = GjSfxRawMap.comboBurstForStep(comboStep)
```

If your combo is higher than 20, clamp to 20:

```kotlin
val index = (comboStep - 1).coerceIn(0, 19)
```

## Suggested volume

- Combo burst 01–06: 0.48–0.56
- Combo burst 07–14: 0.52–0.62
- Combo burst 15–20: 0.56–0.66

Avoid playing a long fanfare on every combo step. These files are intentionally short piano-note bursts so the combo can rise without becoming noisy.
