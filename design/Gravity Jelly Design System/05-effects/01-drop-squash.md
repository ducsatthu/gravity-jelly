# Effect 01 — Drop & Squash (mảnh rơi cứng + squash)

**When:** a piece is placed / a cluster falls under gravity. It travels hard in the
gravity direction and stops at the first contact point, with a brief squash on impact.

| Stage | Token | Value |
|---|---|---|
| Fall (travel to contact) | `--motion-base` · `--ease-in` | 250ms, accelerating |
| Impact squash | `--motion-fast` · `--ease-jelly` | 150ms |
| Settle back | `--motion-fast` · `--ease-out` | 150ms |

**Transform sequence (gravity = down):**
1. `translateY(start → contactY)` over 250ms, `ease-in` (gravity accelerates).
2. On contact: `scale(1.08, 0.86)` (squash, wider + shorter) over 150ms `ease-jelly`.
3. Relax to `scale(1, 1)` over 150ms `ease-out`.

Eyes blink (`open=false`) for the squash frame, then re-open looking toward gravity.
Squash axis follows gravity: horizontal gravity squashes on X instead of Y.

**Compose:** `Animatable` offset with `tween(250, easing = EaseIn)` then a
`keyframes { 1.08f at 0; 1f at 150 }` scale on the impacted cells only.
