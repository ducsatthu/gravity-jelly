# Screens — Gravity Jelly UI Kit

High-fidelity recreations of the four core screens, composed from the design-system
components. Baseline device: **360 × 800 dp** portrait, rendered inside an Android
`PhoneFrame` (a kit helper, not a shipped primitive).

## Entry
- **`index.html`** — the interactive click-through. Home → Game → Result → Settings,
  with a working pause dialog, gravity-rotate (cycles direction + decrements turns +
  fires a combo popup), score x2, revive, replay, language + toggles.

## Screens (priority / play-flow order)
1. **Game** (`game-screen.jsx`) — the heart of the product. `Hud` (56dp) + 9×9 `Board`
   + `Tray` (96dp) + floating `GravityRotateButton` (64dp). Board cell 36dp, gap 2dp,
   board 340dp, side margin 10dp.
2. **Home** (`home-screen.jsx`) — jelly-character logo + wordmark, best-score chip,
   Play (Endless) CTA, Settings + Daily (coming soon).
3. **Result** (`result-screen.jsx`) — final + best score, rewarded-ad actions
   (x2 score, revive), replay + home.
4. **Settings** (`settings-screen.jsx`) — sound / music / vibration toggles,
   language segmented control, info rows.

## Kit helpers (not DS primitives — kebab-case so they're not bundled)
- `phone-frame.jsx` → `window.GJPhoneFrame` — Android shell + status bar.
- `board.jsx` → `window.GJBoard` — parses a char map (`Y M P B S .`), flood-fills
  same-color clusters for the on-block number + merged corners, lays out the grid.

## Board map format
9 strings of 9 chars: `Y`=yellow `M`=mint `P`=pink `B`=blue `S`=stone `.`=empty.
Cluster number = size of the contiguous same-color group (computed in `board.jsx`).

## Notes
- Screens read primitives from `window.GravityJellyDesignSystem_3e0487` (the compiled
  bundle) and export themselves to `window.GJ*`.
- Gravity rotation in the kit signals direction via the HUD arrow + eye tracking; a
  real implementation also re-flows the board toward the new gravity (see `05-effects`).
