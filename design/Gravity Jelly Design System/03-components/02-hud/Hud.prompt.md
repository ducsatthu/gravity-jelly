**Hud** — the 56dp game top bar. Score on the left, the gravity-direction indicator (purple pill, arrow rotates to current gravity) in the center, pause button on the right. Place it as the first child of the game screen, full width.

```jsx
<Hud score={12480} direction="down" onPause={pause} />
```

- `direction`: `down | up | left | right` — the arrow animates to match the active gravity.
- Height is fixed at `--dim-hud-h` (56dp).
