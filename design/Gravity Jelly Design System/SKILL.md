---
name: gravity-jelly-design
description: Use this skill to generate well-branded interfaces and assets for Gravity Jelly (a casual jelly-block puzzle game for Android), either for production or throwaway prototypes/mocks. Contains design guidelines, color/spacing/radius/typography/dimension/motion tokens, the jelly visual language, and React UI-kit components (board, HUD, tray, gravity-rotate FAB, dialogs, screens).
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files
(`00-index.md` is the full ordered table of contents).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out
and create static HTML files for the user to view. If working on production code (the
real Android / Jetpack Compose app), copy the tokens and read the rules here to become an
expert in designing with this brand — token names map 1:1 to Compose (`color/*`,
`space/*`, `radius/*`, `dim/*` in dp, `text/*`, `motion/*`).

Keep the one signature mechanic pure: **gravity rotation**. Don't invent competing systems.

If the user invokes this skill without other guidance, ask what they want to build, ask a
few questions, and act as an expert designer who outputs HTML artifacts _or_ production
code, depending on the need.
