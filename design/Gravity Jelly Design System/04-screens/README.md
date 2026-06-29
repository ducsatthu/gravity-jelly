# Screens — Gravity Jelly UI Kit

High-fidelity recreations of the four core screens, composed from the design-system
components. Baseline device: **360 × 800 dp** portrait, rendered inside an Android
`PhoneFrame` (a kit helper, not a shipped primitive).

## Entry
- **`index.html`** — the interactive click-through. Home → Game → Result → Settings,
  with a working pause dialog, gravity-rotate (cycles direction + decrements turns +
  fires a combo popup), score x2, revive, replay, language + toggles.

## Screens (priority / play-flow order)
1. **Game** (`board-design.jsx` → `window.GJBoardDesign`, aliased `GJGameScreen`) — the
   heart of the product, and the OFFICIAL “① Game” card. A meadow **PNG backdrop**
   (`06-svg-assets/backgrounds/meadow-bg.png`) under a single unified **HUD** (score
   card · gravity D-pad · round pause button), the 9×9 `Board` in an **SVG cream frame**
   (`06-svg-assets/ui/board-frame.svg`, edge-to-edge, board cell 31dp), and a 3-well
   **SVG tray** (`06-svg-assets/ui/tray.svg`) kept tight under the board next to a purple
   refresh FAB. Score card art = `06-svg-assets/ui/score-card.svg`.
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
  Empty-cell radius now matches the jelly block radius (≈ cell × 0.28).
- Game chrome art (board frame, tray, score card, meadow background) lives in
  `06-svg-assets/` — see the **PNG Backgrounds** and **SVG Game Objects** asset cards.

## Board map format
9 strings of 9 chars: `Y`=yellow `M`=mint `P`=pink `B`=blue `S`=stone `.`=empty.
Cluster number = size of the contiguous same-color group (computed in `board.jsx`).

## Notes
- Screens read primitives from `window.GravityJellyDesignSystem_3e0487` (the compiled
  bundle) and export themselves to `window.GJ*`.
- Gravity rotation in the kit signals direction via the HUD arrow + eye tracking; a
  real implementation also re-flows the board toward the new gravity (see `05-effects`).
