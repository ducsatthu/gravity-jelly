# Gravity Jelly — Design System

A design system for **Gravity Jelly**, a casual block-fit puzzle game for Android.
Built UI-first in React for design sign-off, then converted to **Jetpack Compose** — so
every value is a named token and every key element is sized in **dp**.

> **Sources:** This system was authored from a written product brief (no external
> codebase or Figma was provided). All visuals are original to this project. The jelly
> "block-with-number" idea is a generic genre convention — no other game's character
> art was copied.

---

## The product in one paragraph

Place falling jelly blocks to fill rows/columns on a **9×9** grid. The signature
mechanic: the player can **rotate gravity 90°** to make every loose cluster slide and
fall toward a new direction. Stuck-together blocks fall as a cluster. Fill a full row or
column to clear it; survivors then collapse under gravity, chaining **combos**. You lose
when there's no room to place a piece. Gravity rotations are **limited per stage** and
shown on the HUD. One mechanic, kept pure.

## Device & layout baseline
- Portrait Android, baseline **360 × 800 dp**, safe for taller screens.
- Everything on a **4dp grid**; minimum touch target **48dp**.
- Board: cell **36dp**, gap **2dp**, board **340dp** (9×36 + 8×2), side margin **10dp**.
- HUD **56dp**, tray **96dp**, gravity-rotate FAB **64dp**, primary CTA **56dp**.

---

## CONTENT FUNDAMENTALS (voice & copy)

- **Language:** Vietnamese first (UI copy is `vi`), with an English toggle. Examples used
  across the kit: **"Chơi · Endless"**, **"Cài đặt"**, **"Tạm dừng"**, **"Hết chỗ đặt!"**,
  **"Hồi sinh · xem QC"**, **"Kỷ lục"**, **"Sắp có"**.
- **Tone:** warm, playful, encouraging, casual — never technical or stern. Short and
  punchy; a single verb or noun where possible ("Chơi", "Xoay", "Daily").
- **Address:** speaks *to* the player implicitly (imperatives), avoids "tôi/bạn" formality.
- **Casing:** Title-case / sentence-case for buttons and titles; **ALL-CAPS only** for
  tiny metadata labels with wide tracking ("ĐIỂM", "KỶ LỤC", "TRỌNG LỰC", "SẮP CÓ").
- **Numbers:** thousands grouped with a dot, Vietnamese style — `12.480`, `28.640`.
- **Emoji:** none. Personality comes from the jelly characters and motion, not emoji.
- **Iconography in copy:** "QC" = quảng cáo (ad); rewarded-ad actions are stated plainly.

---

## VISUAL FOUNDATIONS

**Overall vibe — "Jelly Pastel Mềm":** soft, cute, candy-like, easy on the eyes. Bright
cream canvas, big rounded panels, glossy jelly characters with googly eyes.

- **Color:** warm cream background `#FFF7EC`; four pastel jelly fills (yellow `#FFE3A3`,
  mint `#A3E5D9`, pink `#F7A9C0`, blue `#B3C7F7`), each with a darker **edge** and a
  lighter **shine** sibling. Stone (fixed) cells are a warm neutral gray. Text is a warm
  cocoa `#5B4636`, never pure black. One signature accent: **gravity purple** `#7E6CF0`.
  Primary CTA is a warm tangerine `#FF9F68`. See the Colors cards.
- **Type:** two rounded families — **Fredoka** for display, titles and numbers (bold,
  friendly, geometric-round); **Nunito** for body/UI labels. Weights lean
  semibold/bold/extra. Numbers on blocks use Fredoka extra-bold.
- **Backgrounds:** flat cream, or a very subtle top-down radial (cream → warmer cream)
  behind the phone. No photos, no busy patterns, no aggressive gradients.
- **Shape language:** generous rounding everywhere — cells `radius/md` (12), cards/tray
  `radius/lg` (20), buttons/panels `radius/xl` (28), sheets `radius/2xl` (36), pills full.
- **Borders:** thick **3dp jelly outlines** (the darker edge color) define every block.
  UI separators are hairline `1.5dp` in `cell-line`.
- **Depth / shadows:** soft, warm, low-opacity drop shadows (`shadow/sm·md·lg`, all cocoa-
  tinted). Jelly fills carry an **inner top sheen** (a blurred light oval). Buttons and the
  FAB use a **solid color "edge" under-shadow** (`0 Npx 0 edge`) that reads as candy depth.
- **Cards:** white `surface`, large radius, soft shadow, no border. The board sits in a
  **sunken well** (`surface-sunken` + inset shadow).
- **Animation:** short and smooth, **150–450ms**, easing from tokens — default
  `ease-inout`, entrances `ease-out`, exits `ease-in`, and a springy **`ease-jelly`**
  (slight overshoot) for placement, squash, and pop. Hard fall = `ease-in` (accelerates).
- **Press / hover states:** buttons **compress** (translate down to their edge depth) on
  press; tray pieces **lift** (`translateY(-6)` + scale) when grabbed. No desktop hover
  reliance — this is touch. Disabled = `opacity 0.55` (or stone gray for the FAB).
- **Transparency / blur:** used sparingly — only the dialog **scrim** (warm 42% overlay).
  No glassmorphism.
- **Eyes:** every jelly character has two googly eyes whose pupils track the current
  gravity direction; they blink (flatten) on squash. This is the soul of the brand.

---

## ICONOGRAPHY

- **System:** a small inline **`Icon`** component (Lucide-style: 24×24 viewBox, **2dp
  round stroke**, no fill) — kept inline so the bundle has zero dependencies. Glyphs:
  `pause play settings rotate volume mute music vibrate globe info close back home
  refresh heart star trophy x2 chevron check`.
- **Substitution flag:** the glyph style is modeled on **Lucide** (outline, rounded). They
  are hand-built to match, not the Lucide package. If you prefer the real Lucide set or a
  filled style, say so and I'll swap them.
- **Emoji / unicode as icons:** not used. The multiplier uses a real "×N" treatment.
- **Brand mark:** the logo is the four jelly characters + a Fredoka **"GRAVITY JELLY"**
  wordmark (pink with a candy edge). No separate logo file — it's composed from
  `JellyBlock`. Ask if you want an exported SVG/PNG logo.

---

## INDEX / MANIFEST

See **`00-index.md`** for the full numbered table of contents. Top level:

- **`styles.css`** — design-system entry (consumers link this one file).
- **`01-tokens/`** — colors, typography, spacing/radius, dimensions (dp), motion + the
  foundation specimen cards in `01-tokens/cards/`.
- **`02-foundations/`** — `JellyBlock`, `Eyes`, `Icon` (the shared atoms).
- **`03-components/`** — `Button`, `Hud`, `Tray`, `GravityRotateButton`, `ComboPopup`,
  `Dialog`, `JellyScene`.
- **`04-screens/`** — the UI kit: interactive `index.html` + Game / Home / Result /
  Settings, with `board.jsx` and `phone-frame.jsx` helpers.
- **`05-effects/`** — motion specs (drop/squash, gravity rotate, line clear, collapse/
  combo, particles) with durations + easing, plus an animated demo card.
- **`SKILL.md`** — makes this folder usable as a downloadable Agent Skill.

**Bundle namespace** (for `@dsCard` HTML): `window.GravityJellyDesignSystem_3e0487`.
The compiled `_ds_bundle.js`, `_ds_manifest.json` are generated automatically — don't edit.
