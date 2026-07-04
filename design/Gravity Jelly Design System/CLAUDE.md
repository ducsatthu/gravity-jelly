# Gravity Jelly — Project Memory

## Current task
Maintaining the **Gravity Jelly** design system / UI kit for the casual Android puzzle game.
Must follow the existing **Gravity Jelly design system** exactly.

## Official Game board ("① Game" screen) — CANONICAL, do not regress
The play-board screen is `04-screens/board-design.jsx` → `window.GJBoardDesign` (aliased
`window.GJGameScreen`); it IS the official "① Game" card (`screen-1-game.card.html`) and the
Game screen in the `index.html` click-through. Old `game-screen.jsx` / `board-scene.jsx` were
deleted — don't bring them back. Structure, top → bottom:
- **Meadow PNG backdrop** — `06-svg-assets/backgrounds/meadow-bg.png`, full-bleed `object-fit: cover; object-position: center bottom`.
- **Unified HUD** (one flex row): score card (left) · gravity D-pad (center) · pause button (right).
  - Score card = `06-svg-assets/ui/score-card.svg` (plain cream card) with ĐIỂM label + number overlaid centered.
  - Gravity = purple candy D-pad capsule (← ↑ ↓ →; active dir = raised white disc).
  - Pause = small (44dp) WHITE round candy button, two purple bars. (Not an image, not purple.)
- **Board** = 9×9 `GJBoard` grid dropped into the SVG cream frame `06-svg-assets/ui/board-frame.svg`
  (edge-to-edge, no transparent margin; inset 5%, cell 31dp). Empty-cell radius matches jelly block radius (≈ cell × 0.28).
- **Tray** = `06-svg-assets/ui/tray.svg` (3 wells, edge-to-edge) kept TIGHT under the board, next to a purple refresh FAB (60dp). Spare meadow space sits below the tray.
- Props: `score, gravity|direction, board, pieces, blockDirection, onPause, onRotate, onRefresh`.
- **This "① Game" screen = ENDLESS mode.** Keep it (nearly) intact — do not add campaign HUD to it. It also exports `window.GJBoardParts` (ScoreCard, GravityPad, PauseCard, BoardPanel, PieceView, TrayDock, RefreshFab, PAL) so campaign/boss reuse the exact chrome.

## Campaign in-game boards (reuse board chrome, NOT the endless card)
Campaign play needs three readouts endless lacks — moves, objective progress, current stars.
Built as separate screens on top of `GJBoardParts`; endless `board-design.jsx` is untouched.
- `04-screens/board-campaign.jsx` → `window.GJBoardCampaign` (`screen-1b-game-campaign.card.html`).
  Header row: pause · **level badge** (MÀN n · world small-caps + live 3-star row) · **LƯỢT** stat
  card (moves; turns tangerine when ≤5). Below: **MỤC TIÊU** cream banner — goal chips (mini jelly +
  `cleared/target`, green check disc when done). Then gravity D-pad · board · tray + refresh.
  Props: `level, world, moves, stars, gravity, goals[{color,cleared,target}], board, pieces, blockDirection, onPause, onRotate, onRefresh`.
- `04-screens/board-boss.jsx` → `window.GJBoardBoss` (`screen-1c-game-boss.card.html`).
  Header: pause · **BOSS · MÀN n** warning pill · LƯỢT card. Below: purple **boss panel** = boss face
  (gravity block + angry eyes) + name + live stars + **HP bar** (danger-red numeric) + **PHA x/y** pips.
  Purple danger vignette over the meadow; board seeded with STONE armour to smash.
  Props: `level, name, hp, maxHp, phase, phases, moves, stars, gravity, board, pieces, blockDirection, onPause, onRotate, onRefresh`.

## Game-art assets live in `06-svg-assets/`
SVG chrome in `06-svg-assets/ui/` (board-frame, tray, score-card); raster backgrounds in
`06-svg-assets/backgrounds/`. Shown in the Assets-group cards **SVG Game Objects**
(`svg-assets.card.html`) and **PNG Backgrounds** (`png-backgrounds.card.html`). When adding
new game art, drop it here and add it to the matching card.

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
- **Boss cluster** (`03-components/09-boss-hud/` → `NS.BossCard` / `BossIntroCard` / `BossToast` / `BossMascot` / `ShieldBar`; `NS.BossHud` aliases `BossCard`): soft casual (NOT combat/RPG). Each boss has its OWN eyes-only mascot rendered from SUPPLIED PNG ART in `06-svg-assets/bosses/` (`boss-worm.png` / `boss-forest.png` / `boss-water.png`, transparent) via `BossMascot kind="worm|trash|water"` — no shared circle/ring, no mouth/brows; `size` (display height) + `assetBase` (path to `06-svg-assets/bosses/` relative to page, default `../../` for a component card 2 levels deep) props. Faint purple/cyan aura behind worm/water. Pieces: `BossCard` (compact in-game/pre-boss card — mascot overflows the LEFT, text right: name · `MÀN n` badge · thin **Khiên** `ShieldBar` · `chip{kind,tone,label}` where `role:'rule'|'tell'` styles it as calm CẨM NANG vs coloured CẢNH BÁO — same rule/tell split as the toast/rule below) · `BossIntroCard` (large pre-level: BOSS tag + level + big title + shield bar + rule chip + orange "Chơi" CTA) · `BossToast` (WARNING pill = điều boss SẮP làm, một *tell*: "Lượt sau: Đổ rác" / "Sau 2 lượt: Đảo trọng lực"; viền màu + bob) · `BossRule` (CẨM NANG = CÁCH phá khiên, một *rule*: "Combo ×2 phá khiên"; nền chìm, không viền/không bob — KHÔNG bao giờ để rule vào toast). Progress = "Khiên n/m" (NOT HP hearts); copy uses "phá khiên" (NOT "gây sát thương"); purple only as tag/glow/hairline. 3 bosses (Chú Sâu Đồng Cỏ 4/5 · Thần Rừng 6/8 · Thần Thác 7/10) in `boss-hud.card.html`; art shown in **Boss Art** (`boss-art.card.html`).
- **ObjectiveBar** (`03-components/08-objective-bar/` → `NS.ObjectiveBar`): the always-on level-objective cluster placed UNDER the 56dp HUD, above the board. One `goal` descriptor, switches on `goal.kind`:
  - `tutorial` (variant: clearRow/clearCol/rotate/super1/super2/rainbow/rainbowSuper/combo) — glyph + short label + `0/1` chip (combo shows `×N`).
  - `score` — REACH_SCORE progress bar (`current/target`), primary fill, glows when full.
  - `targets` — CLEAR_TARGETS: row of `vine`/`drop` glyphs that dim as destroyed + "còn N" pill; buried drops get a layer-lock.
  - `mixed` — two stacked rows (targets + score); ~72dp tall.
  - States active/near(pulse)/done(success+tick); optional `rotations` → purple gravity turns chip. Special-block/vine/drop/grid glyphs drawn inline (no extra deps). Shown assembled in `screen-1e-game-objective.card.html`.
- **JellyBlock**: rounded jelly block, eyes, 3dp edge, top gloss, 4 colors, optional center NUMBER
- **Button**: candy button with 3D edge that depresses on press; variants primary | gravity | success | danger | secondary | ghost; cta size 56dp (radius 28). "SẮP CÓ" (coming soon) = dimmed + "SẮP CÓ" pill
- **HUD bar**: 56dp top bar

## Motion
Short, smooth 150–450ms; gentle jelly bounce (bouncy ease) for pulse/pop.

## World → level numbering (canonical, NEVER renumber)
Exactly 10 consecutive levels per world. Position 6 of each world = **BREATHER**, position 10 = **BOSS**. So bosses = `10, 20, 30, …, 100`; breathers = `6, 16, 26, …, 96`. Every node in any UI must carry its real global level number from this table:

| World | Name | Levels |
|---|---|---|
| 1 | Đồng cỏ | 1–10 |
| 2 | Rừng rậm | 11–20 |
| 3 | Sông & Thác | 21–30 |
| 4 | Sa mạc | 31–40 |
| 5 | Bãi biển | 41–50 |
| 6 | Núi tuyết | 51–60 |
| 7 | Hang băng | 61–70 |
| 8 | Núi lửa | 71–80 |
| 9 | Bầu trời | 81–90 |
| 10 | Vũ trụ | 91–100 |
