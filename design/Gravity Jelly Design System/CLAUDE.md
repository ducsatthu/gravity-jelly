# Gravity Jelly — Project Memory

## Current task
Maintaining the **Gravity Jelly** design system / UI kit for the casual Android puzzle game.
Must follow the existing **Gravity Jelly design system** exactly.

## Official Game board ("① Game" screen) — CANONICAL, do not regress
The play-board screen is `04-screens/board-design.jsx` → `window.GJBoardDesign` (aliased
`window.GJGameScreen`); it IS the official "① Game" card (`screen-1-game.card.html`) and the
Game screen in the `index.html` click-through. Old `game-screen.jsx` / `board-scene.jsx` were
deleted — don't bring them back. Structure, top → bottom:
- **Meadow PNG backdrop** — `06-svg-assets/backgrounds/meadow-bg.webp`, full-bleed `object-fit: cover; object-position: center bottom`.
- **Unified HUD** (one flex row): score card (left) · gravity D-pad (center) · pause button (right).
  - Score card = `06-svg-assets/ui/score-card.svg` (plain cream card) with ĐIỂM label + number overlaid centered.
  - Gravity = purple candy D-pad capsule (← ↑ ↓ →; active dir = raised white disc).
  - Pause = small (44dp) WHITE round candy button, two purple bars. (Not an image, not purple.)
- **Board** = 9×9 `GJBoard` grid dropped into the SVG cream frame `06-svg-assets/ui/board-frame.svg`
  (edge-to-edge, no transparent margin; inset 5%, cell 31dp). Empty-cell radius matches jelly block radius (≈ cell × 0.20).
- **Tray** = `06-svg-assets/ui/tray.svg` (3 wells, edge-to-edge) kept TIGHT under the board, next to a purple refresh FAB (60dp). Spare meadow space sits below the tray.
- Props: `score, gravity|direction, board, pieces, blockDirection, onPause, onRotate, onRefresh`.
- **This "① Game" screen = ENDLESS mode** — the only game mode. It also exports `window.GJBoardParts` (ScoreCard, GravityPad, PauseCard, BoardPanel, PieceView, TrayDock, RefreshFab, PAL) so campaign/boss reuse the exact chrome.

## Campaign mode — REMOVED
The game is **endless-only**. The campaign/level/world/boss/objective screens, components,
and docs were deleted. Do NOT recreate: `board-campaign.jsx`, `board-boss.jsx`, world-map
strips, world gates, level-intro / level-win screens, `ObjectiveBar` (08-objective-bar),
the boss HUD cluster (09-boss-hud), boss art, or the `design-docs/` level-design set.
Home has a single **Endless** play button (no "Chiến dịch").

## Game-art assets live in `06-svg-assets/`
SVG chrome in `06-svg-assets/ui/` (board-frame, tray, score-card); raster backgrounds in
`06-svg-assets/backgrounds/`. Shown in the Assets-group cards **SVG Game Objects**
(`svg-assets.card.html`) and **PNG Backgrounds** (`png-backgrounds.card.html`). When adding
new game art, drop it here and add it to the matching card.
- **Thạch Hoàng Gia (Royal Jelly, cấp 1) art** = `06-svg-assets/ui/hoanggia-{yellow,mint,pink,blue}.jpg`
  (OPAQUE full-bleed royal-frame square per colour — gold crown + colour gem emblem). CANONICAL Thạch
  Hoàng Gia visual; corners clipped with border-radius (~20%) wherever rendered. The old cấp-1 PNGs
  `blocks/super-*-1.png` were REMOVED. Rendered via `window.GJCamNangIllus.HoangGia({color,size})`
  — handbook `super` illustration + thumbnail, and the `super1`/`superL2`/`rainbowSuper` before-states.
  ObjectiveBar `super1` tutorial glyph also points at `ui/hoanggia-pink.jpg` (rounded).
- **Vua Thạch (Jelly King) royal-frame art** = `06-svg-assets/ui/vuathach-{yellow,mint,pink,blue}.jpg`
  (OPAQUE full-bleed square per colour — gold CROWN with purple accents over a colour panel + gem
  emblem: star/leaf/heart/drop). CANONICAL Vua Thạch (cấp 2) visual; corners clipped with border-radius
  (~20%). Rendered via `window.GJCamNangIllus.VuaThach({color,size})` — handbook `superL2` illustration
  + thumbnail. Decoupled from Thạch Hoàng Gia via separate `hoanggia-*`/`vuathach-*` files.
- **Thạch Cầu Vồng / Hoàng Đế Cầu Vồng art** = `06-svg-assets/ui/rainbow.jpg` (OPAQUE full-bleed
  4-colour square + diamond gem, bo góc ~20%) &
  `06-svg-assets/ui/rainbowemperor.jpg` (OPAQUE full-bleed crowned rainbow, bo góc ~20%). CANONICAL new rainbow-line
  visual; supersedes old `blocks/rainbow.svg` / `rainbow-2.svg`. Rendered via
  `window.GJCamNangIllus.RainbowJelly({kind:'rainbow'|'emperor',size})` — used in handbook
  `rainbow`/`rainbowSuper`/`blastRainbow`/`blastRainbowSuper` illustrations + thumbnails.

## Brand
"Block jelly" identity: characters are rounded jelly BLOCKS with EYES, thick edge, top gloss/shine. Candy-sweet tone, warm cream background, soft light-brown shadows. Playful, friendly, clean.

## Block naming (canonical — display names; NEVER rename)
Code identifiers stay by COLOR (`yellow/mint/pink/blue`, tokens `--color-block-*`, mechanic ids `super/superL2/rainbow/rainbowSuper/blast*`). These are the human-facing DISPLAY names only.
- **4 basic blocks** (color → VN / EN): yellow → **Thạch Sao** / Star Jelly · mint → **Thạch Lá** / Leaf Jelly · pink → **Thạch Tim** / Heart Jelly · blue → **Thạch Nước** / Aqua Jelly.
- **Evolution tiers (the "Hoàng gia" / royal-crown line)** — old name → new canonical name:
  - "Siêu khối" (super, crowned) → **Thạch Hoàng Gia** (Royal Jelly)
  - "Siêu khối cấp 2" / Cực Hạn → **Vua Thạch** (Jelly King)
  - "Khối cầu vồng" → **Thạch Cầu Vồng** (Rainbow Jelly)
  - "Cầu vồng siêu cấp" → **Hoàng Đế Cầu Vồng** (Rainbow Emperor)
  - Blast/"Nổ …" cards follow the same swap (e.g. "Nổ siêu khối" → **Nổ Thạch Hoàng Gia**).
- Handbook (cam-nang) category label for this line = **"Hoàng gia"** (internal group KEY stays `'SIÊU KHỐI'`). Scenery rainbows in world maps (sky "cầu vồng") are NOT blocks — never rename those.

## Device
Android portrait **360 × 800 dp**. Gutter 16dp. Touch targets ≥ 48dp.

## Fonts (required)
- Display & numbers: **Fredoka** (rounded, 400–700)
- Body & UI labels: **Nunito** (600–800)
- Sizes (px/dp): screen title 28 · heading/dialog 22 · HUD number 20 · body 16 · button label 14 · caption 12 · number on jelly block 18 · logo/big score 40. Title/number line-height 1.05. Small-caps labels use letter-spacing 0.04em.

## Colors (use straight from the design system — keep exact)
- Surfaces: bg cream `#FFF7EC` · white `#FFFFFF` · sunken `#F4E9D8` · dialog scrim `rgba(60,44,24,0.42)`
- 4 jelly blocks — **display name (VN / EN)** · fill / edge / shine:
  - Yellow = **Thạch Sao** (Star Jelly) `#FFE3A3` / `#E8B85C` / `#FFF1CE`
  - Mint = **Thạch Lá** (Leaf Jelly) `#A3E5D9` / `#5FC3B2` / `#CBF2EB`
  - Pink = **Thạch Tim** (Heart Jelly) `#F7A9C0` / `#E576A0` / `#FBD0DF`
  - Blue = **Thạch Nước** (Aqua Jelly) `#B3C7F7` / `#7E9CE8` / `#D6E1FB`
- Stone (locked/fixed): `#C9BCA8` / edge `#A89A82` / shine `#DBD0BF`
- Text: primary `#5B4636` (warm cocoa) · muted `#9B886F` · on dark/color `#FFFFFF` · on jelly `#6A4A2E`
- Primary CTA: tangerine `#FF9F68` / edge `#E97E45` / shine `#FFC59A`
- Semantic: success `#6FCF7F` · warning `#FFCA66` · danger `#F08A7E` · info `#8FB6F2`
- Gravity (signature mechanic accent): purple `#7E6CF0` / edge `#6353D6` / shine `#A99CF6`
- Shadows: soft `rgba(120,92,52,0.16)` · strong `rgba(120,92,52,0.24)`

## Shape & radius
- 4dp grid spacing: 2/4/8/12/16/24/32/48
- Radius: chip 8 · jelly cell 12 · card 20 · button/main panel 28 · large sheet 36 · pill 999
- Borders: thin 1.5 · jelly block 3 · focus 4
- Shadows: sm `0 2 6` · md `0 6 14` · lg `0 12 28`; jelly cells have an inset gloss on top

## Reuse components (don't redraw — use the system's style)
- **JellyBlock**: rounded jelly block, eyes, 3dp edge, top gloss, 4 colors, optional center NUMBER
- **Button**: candy button with 3D edge that depresses on press; variants primary | gravity | success | danger | secondary | ghost; cta size 56dp (radius 28). "SẮP CÓ" (coming soon) = dimmed + "SẮP CÓ" pill
- **HUD bar**: 56dp top bar

## Motion
Short, smooth 150–450ms; gentle jelly bounce (bouncy ease) for pulse/pop.
