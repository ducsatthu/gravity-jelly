# ObjectiveBar

The always-on **level-objective cluster** shown directly under the 56dp HUD and above the 9×9 board — where the player always sees which **màn** they're on, "what do I need to do", plus live progress. One component, one `goal` descriptor, switching on `goal.kind`. A left **level badge** (`level` global number + `world` name) anchors every bar, and **every level is rated the same way — by moves (số nước)** via the footer 3-star strip.

## Goal types (from the objective catalogue)
- **tutorial** — single action; icon + short label. Single-action variants show **no counter** (the label + a done tick say it all); only `combo` keeps a live `×N` chip. Variants: `clearRow · clearCol · rotate · super1 · super2 · rainbow · rainbowSuper · combo`.
- **targets** — CLEAR_TARGETS: a row of target glyphs (`vine` root / `drop`) that dim as destroyed, plus a "còn N" pill. Buried drops get a layer-lock.

> The old **score** (REACH_SCORE / điểm) and **mixed** kinds were removed — scoring is unified to số nước across all levels, so no bar mixes điểm with moves.

## States
`active · near` (gentle ease-jelly pulse) `· done` (success fill + tick pop, bar glow). Derived from progress, or forced via `goal.status`.

## Extras
`level` + `world` render the left **Màn** badge (omit `level` to hide it — e.g. endless mode). Gravity turns-left is **not** shown here — it lives on the FAB.

## Sizes (dp)
single-row 52 · padding 16 · radius 20 · shadow sm · glyph 26–30 · chip 28 · level badge min 44. Labels Nunito, numbers Fredoka.

Reuses `Icon` + color tokens; special-block / vine / drop / grid glyphs are drawn inline so the component stays dependency-free.
