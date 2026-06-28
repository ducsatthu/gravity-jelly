# Effect 04 — Collapse & Combo (sụp cụm + combo dây chuyền)

**When:** after a line clear empties cells, clusters above/around fall under the current
gravity to fill the gap. If the collapse completes another line, the chain repeats — each
step raises the combo multiplier with a popup.

| Stage | Token | Value |
|---|---|---|
| Cluster collapse fall | `--motion-medium` · `--ease-inout` | 350ms |
| Combo popup (`ComboPopup`) | — · `--ease-out` | ~900ms (pop → float → fade) |
| Chain settle → re-check | `--motion-slow` · `--ease-inout` | up to 450ms |

**Sequence (one chain step):**
1. Collapse: every floating cluster tweens to its new resting cell, 350ms `ease-inout`.
2. Re-check rows/columns. If a new line is full → multiplier += 1, fire `ComboPopup`
   (`×2`, `×3`, …) over the chain origin, and loop to **Effect 03**.
3. Combo popup motion: `scale 0.4→1.18→1.0`, float up ~26dp, fade out (~900ms).
4. Score increment animates up; combos award bonus points.

Keep chains readable: cap each settle at 450ms so long combos stay snappy, not sluggish.

**Compose:** recursive `suspend` loop — `collapse() → detectLines() → if(any) { combo++;
showCombo(combo); clear() }` until stable.
