# 00 · Index — Gravity Jelly Design System

The single source of reading order. Folders & files use 2-digit numeric prefixes in
dependency / play-flow order. Update this file whenever anything is added, renamed, or
moved.

**Status legend:** ✅ done · 🟡 in progress · ⬜ planned

| # | Path | What | Status |
|---|------|------|--------|
| 00 | `00-index.md` | This table of contents | ✅ |
| 00 | `readme.md` | Design guide: context, content & visual foundations, iconography, manifest | ✅ |
| 00 | `styles.css` | DS entry — `@import` lines only; consumers link this | ✅ |
| 00 | `SKILL.md` | Agent Skill wrapper (front-matter + how to use) | ✅ |

## 01 · Tokens
| # | Path | What | Status |
|---|------|------|--------|
| 01 | `01-tokens/01-colors.css` | `color/*` — surfaces, 4 jelly fills + edge/shine, stone, text, accent, semantic | ✅ |
| 02 | `01-tokens/02-typography.css` | `font/*`, `text/*`, weights, leading, tracking (Fredoka + Nunito) | ✅ |
| 03 | `01-tokens/03-spacing-radius.css` | `space/*` (4dp grid), `radius/*`, borders, shadows | ✅ |
| 04 | `01-tokens/04-dimensions.css` | `dim/*` in dp — cell, board, HUD, tray, FAB, CTA, touch-min | ✅ |
| 05 | `01-tokens/05-motion.css` | `motion/*` durations + `ease/*` easing + named transitions | ✅ |
| — | `01-tokens/cards/*.card.html` | Specimen cards: jelly/surfaces/accent colors, type, spacing, radius+shadow, dimensions, motion | ✅ |

## 02 · Foundations (shared atoms)
| # | Path | What | Status |
|---|------|------|--------|
| 01 | `02-foundations/01-jelly-block/` | `JellyBlock` — signature cell: fill, edge, shine, eyes, cluster number, squash/clearing/connect | ✅ |
| 02 | `02-foundations/02-eyes/` | `Eyes` — googly eyes; pupils track gravity | ✅ |
| 03 | `02-foundations/03-icon/` | `Icon` — Lucide-style 2dp stroke glyph set | ✅ |

## 03 · Components
| # | Path | What | Status |
|---|------|------|--------|
| 01 | `03-components/01-button/` | `Button` — jelly CTA, 3D press, variants/sizes/comingSoon | ✅ |
| 02 | `03-components/02-hud/` | `Hud` — 56dp bar: score, gravity indicator, pause | ✅ |
| 03 | `03-components/03-tray/` | `Tray` — 96dp dock of 3 draggable pieces | ✅ |
| 04 | `03-components/04-gravity-rotate-button/` | `GravityRotateButton` — 64dp FAB + turns badge | ✅ |
| 05 | `03-components/05-combo-popup/` | `ComboPopup` — springy ×N chain multiplier | ✅ |
| 06 | `03-components/06-dialog/` | `Dialog` — soft modal sheet (pause/confirm/info) | ✅ |
| 08 | `03-components/08-objective-bar/` | `ObjectiveBar` — level-objective cluster under the HUD: tutorial (0/1 · ×N) · REACH_SCORE bar · CLEAR_TARGETS dimming counter (vine/drop, buried lock) · MIXED 2-row; active/near/done + gravity turns chip | ✅ |
| 09 | `03-components/09-boss-hud/` | `BossHud` — boss-fight HUD cluster (top of GAME screen, replaces ObjectiveBar on L10/20/30): round portrait + name · HP bar danger→warning, jerk+flash on hit · floating −damage tied to combo (sync ComboPopup ×N) · rule reminder · per-boss tell (trash / gravity 3→0) | ✅ |

## 04 · Screens (UI kit)
| # | Path | What | Status |
|---|------|------|--------|
| — | `04-screens/index.html` | Interactive click-through (Home→Game→Result→Settings) | ✅ |
| 01 | `04-screens/board-design.jsx` | **Game** (official ① card) — meadow PNG bg + unified HUD (score · gravity · pause) + SVG board frame + SVG tray + refresh FAB (priority #1) = ENDLESS. Also exports `window.GJBoardParts` (chrome reused below). | ✅ |
| 01b | `04-screens/board-campaign.jsx` | **Game · Chiến dịch** — campaign in-game: reuses board chrome, swaps score for LƯỢT (moves) card + live 3-star badge + MỤC TIÊU progress banner (`GJBoardCampaign`) | ✅ |
| 01c | `04-screens/board-boss.jsx` | **Game · Boss** — campaign boss fight in-game: boss HP bar + PHA pips + LƯỢT + stars, purple danger vignette, stone-armour board (`GJBoardBoss`) | ✅ |
| 01e | `04-screens/screen-1e-game-objective.card.html` | **Game · Mục tiêu** — ObjectiveBar ráp vào màn GAME thật (HUD điểm/trọng lực/pause · cụm mục tiêu · bàn · khay) | ✅ |
| 02 | `04-screens/home-screen.jsx` | **Home** — logo, Play, Settings, Daily | ✅ |
| 03 | `04-screens/result-screen.jsx` | **Result** — final/best, x2 ad, revive, replay, home | ✅ |
| 04 | `04-screens/settings-screen.jsx` | **Settings** — sound/music/vibration, language, info | ✅ |
| 05 | `04-screens/level-map.jsx` | **Level Map** — vertical climb, biome scene, winding path, node states (completed/current/locked/boss/breather), HUD + star progress | ✅ |
| 06 | `04-screens/splash-screen.jsx` | **Splash / Loading** — logo, bobbing blocks, jelly progress bar | ✅ |
| 07 | `04-screens/level-intro-screen.jsx` | **Level Intro** — updated to new objective system: title "Màn X · Tên" + world chip, bold objective block (big hero glyph + goal sentence), 3-star threshold row (per-unit), gravity rotation-budget chip + optional new-mechanic chip, BẮT ĐẦU CTA. `goal.kind`: tutorial/targets/score/boss | ✅ |
| 08 | `04-screens/level-win-screen.jsx` | **Level Win** — confetti, 3-star result, score, coin reward, Next/Replay/Map | ✅ |
| 09 | `04-screens/pause-screen.jsx` | **Pause** — ghost board + Dialog: quick toggles, resume/restart/settings/quit | ✅ |
| 10 | `04-screens/out-of-lives-screen.jsx` | **Out of Lives** — empty hearts, refill countdown, coins/ad refill | ✅ |
| 11 | `04-screens/boss-intro-screen.jsx` | **Boss Intro** — gravity stage, boss jelly, BOSS banner, Challenge | ✅ |
| 12 | `04-screens/daily-reward-screen.jsx` | **Daily Reward** — 7-day streak grid, claim CTA | ✅ |
| 13 | `04-screens/shop-screen.jsx` | **Shop** — coin balance, booster shelf, coin packs (tabbed) | ✅ |
| 14 | `04-screens/missions-screen.jsx` | **Missions / Achievements** — daily/achv tabs, progress bars, claim | ✅ |
| 15 | `04-screens/leaderboard-screen.jsx` | **Leaderboard** — friends/global tabs, top-3 podium, ranked rows | ✅ |
| 16 | `04-screens/cam-nang-screen.jsx` | **Cẩm nang (Handbook)** — collectible 13-rule book in 4 groups; locked/unlocked entries; teach-style detail popup with "real game" illustration | ✅ |
| — | `04-screens/cam-nang-illus.jsx` | Helper: Handbook popup illustrations — `MiniBoard`, `SpecialBlock` (super/rainbow/crown), per-mechanic before→after demos (`window.GJCamNangIllus`) | ✅ |
| — | `04-screens/board.jsx` | Helper: char-map → clustered 9×9 board | ✅ |
| — | `04-screens/phone-frame.jsx` | Helper: Android device shell | ✅ |
| — | `04-screens/screen-extras.jsx` | Helper: extra glyphs (lock/clock/gift/coin/bomb/crown…) + Stars/CoinChip/AdBadge | ✅ |
| — | `04-screens/screen-{1..4}-*.card.html` · `screen-{05..14}-*.card.html` | Per-screen preview cards for review | ✅ |

## 05 · Effects (motion specs)
| # | Path | What | Status |
|---|------|------|--------|
| 01 | `05-effects/01-drop-squash.md` | Hard fall + impact squash (250→150ms) | ✅ |
| 02 | `05-effects/02-gravity-rotate.md` | 90° board re-flow + eye/arrow rotate (350ms) | ✅ |
| 03 | `05-effects/03-line-clear.md` | Flash + pop + particle burst (150→250ms) | ✅ |
| 04 | `05-effects/04-collapse-combo.md` | Chain collapse + combo popup (350→450ms) | ✅ |
| 05 | `05-effects/05-particles-juice.md` | Shared particle/haptic/juice layer | ✅ |
| — | `05-effects/effects.card.html` | Animated demo of all four effects | ✅ |

## 06 · SVG assets (vector game objects)
| # | Path | What | Status |
|---|------|------|--------|
| — | `06-svg-assets/blocks/` | 5 jelly blocks (yellow/mint/pink/blue/stone) — gloss clipped to inner edge | ✅ |
| — | `06-svg-assets/faces/` | Eye overlays — 4 gravity directions + front + happy/wink/focus | ✅ |
| — | `06-svg-assets/pieces/` | 7 mini jelly confetti pieces | ✅ |
| — | `06-svg-assets/tokens/` | star full/empty, heart, coin, combo dish | ✅ |
| — | `06-svg-assets/ui/` | 5 jelly buttons, gravity FAB, 4 gravity-direction arrows | ✅ |
| — | `06-svg-assets/icons/` | 21 Lucide-style icons | ✅ |
| — | `06-svg-assets/svg-assets.card.html` | Asset preview sheet (group "Assets") | ✅ |

## 07 · Mechanics (illustration cards — "THẺ CƠ CHẾ")
Before→After specimen cards illustrating every game mechanic, built from the DS
(JellyBlock/Icon/GravityRotateButton/ComboPopup/Tray + screen-extras glyphs) via a
shared declarative engine. All tagged `@dsCard group="Mechanics"`; 49 cards (A–G).
| # | Path | What | Status |
|---|------|------|--------|
| — | `07-mechanics/mechanics-kit.jsx` | Engine: `MiniBoard` (glow/gate/portal/spike/target/ice/float/dye/seed/chains/divider/super/rainbow + deco badges), `CardShell`, `GravityChip`, `renderById` | ✅ |
| — | `07-mechanics/mechanics-widgets.jsx` | Bespoke bodies: tray/hold/preview/single/giant, boss face, combo meter, goal HUD, modifier palette, buff/power-up/daily/streak, fab-lock | ✅ |
| — | `07-mechanics/mechanics-cards.js` | Declarative registry of all 49 cards (`window.GJ_MECH_CARDS`) | ✅ |
| A | `07-mechanics/a1…a10.card.html` | **Trọng lực** — xoay 90°, 180°, chéo, điểm, chia vùng, đảo tự động, zero-G, combo hồi xoay, khoá xoay, xoay cục bộ | ✅ |
| B | `07-mechanics/b0,b0b,b1…b7.card.html` | **Cụm / Màu** — merge-9, nổ siêu khối, combo leo thang, color-clear, cầu vồng, cấp 2, cụm nặng, nhuộm, mầm | ✅ |
| C | `07-mechanics/cpool,c1…c8.card.html` | **Hazard** — bảng modifier, xích, đếm ngược, cổng, keo, nam châm, gai, đá rơi, đổi hướng | ✅ |
| D | `07-mechanics/d1…d6.card.html` | **Khay** — hold, preview 2 đợt, mảnh đá, 2 màu, khay đơn, mảnh khổng lồ | ✅ |
| E | `07-mechanics/e1…e5.card.html` | **Mục tiêu** — giải cứu, đào đích, cấm xoay, mục tiêu màu, perfect clear | ✅ |
| F | `07-mechanics/f1…f6.card.html` | **Boss** — hút trọng lực, đóng băng, khoá màu, điểm yếu, đổi pha, phản công | ✅ |
| G | `07-mechanics/g1…g4.card.html` | **Meta** — buff roguelite, power-up, daily seed, streak | ✅ |

## 08 · Brand (logo & app icon)
Android brand kit built from one SVG source: 2×2 jelly cluster + gravity-rotate arc on
purple. Spec board (group "Brand") + exported PNGs.
| # | Path | What | Status |
|---|------|------|--------|
| — | `08-brand/gravity-jelly-logo.js` | SVG mark builders (`window.GJLogo`) — foreground / background / full / monochrome | ✅ |
| — | `08-brand/brand.card.html` | **Brand board** — icon, adaptive layers, masks, densities, wordmark, clear-space, backgrounds, do/don't, file list | ✅ |
| — | `08-brand/android/` | Exported PNGs: adaptive fg/bg, monochrome, Play 512, mipmap 192–48, feature 1024×500, wordmark ×2 + README | ✅ |
