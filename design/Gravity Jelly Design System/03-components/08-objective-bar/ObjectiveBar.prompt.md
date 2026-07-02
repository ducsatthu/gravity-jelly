# ObjectiveBar

The always-on **level-objective cluster** shown directly under the 56dp HUD and above the 9×9 board — where the player always sees "what do I need to do" plus live progress. One component, one `goal` descriptor, switching on `goal.kind`.

## Goal types (from the objective catalogue)
- **tutorial** — single action; icon + short label + `0/1` chip (or `×N` for combo). Variants: `clearRow · clearCol · rotate · super1 · super2 · rainbow · rainbowSuper · combo`.
- **score** — REACH_SCORE progress bar (`current / target`), primary tangerine fill; glows when full.
- **targets** — CLEAR_TARGETS: a row of target glyphs (`vine` root / `drop`) that dim as destroyed, plus a "còn N" pill. Buried drops get a layer-lock.
- **mixed** — must satisfy BOTH: a targets row + a score bar, stacked compactly.

## States
`active · near` (gentle ease-jelly pulse) `· done` (success fill + tick pop, bar glow). Derived from progress, or forced via `goal.status`.

## Extras
`rotations` renders the gravity turns-left chip (purple) on the right, for when it isn't on the FAB.

## Sizes (dp)
single-row 52 · two-row (mixed) 72 · padding 16 · radius 20 · shadow sm · progress track 12 · glyph 26–30 · chip 28. Labels Nunito, numbers Fredoka.

Reuses `Icon` + color tokens; special-block / vine / drop / grid glyphs are drawn inline so the component stays dependency-free.
