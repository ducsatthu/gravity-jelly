# BossHud

The **boss-fight HUD cluster** shown at the top of the GAME screen on boss levels (L10/L20/L30…), in place of the normal `ObjectiveBar`. A dark, self-contained gravity-purple panel so it reads on both the light meadow and darker biome backdrops.

## Contents
- **Round boss portrait** (jelly-style, cute-but-opponent: gloss + angry brows + grimace, themable body color) + **name**.
- **HP bar** — sunken track, fill interpolates **danger → warning** by % HP, `MÁU n/××` in Fredoka. **Jerks + flashes** when the boss takes a hit.
- **Floating damage numbers** (−1/−2/−3) tied to the **combo tier**, in sync with `ComboPopup ×N` (a small `×N` rides along). Map with `comboDamage(combo)`: ×2–3 → 1 · ×4–6 → 2 · ×7+ → 3.
- **Rule reminder**: "Combo ≥ ×2 để gây sát thương".
- Optional per-boss **tell**: `trash` → "Sắp đổ rác" (L20) · `gravity` → "Sắp đảo trọng lực" with a 3→0 countdown (L30).

## Driving the hit
Increment `hitToken` and set `lastHit={ damage, combo }`; the panel plays the jerk/flash and floats the `−damage ×N`. HP is a small integer (hits), e.g. 5 / 8 / 10.

Reuses `Icon` + color tokens; portrait, brows and tell glyphs drawn inline. Shown with three bosses (Chú Sâu Đồng Cỏ · Thần Rừng · Thần Thác) on light/dark in `boss-hud.card.html`.
