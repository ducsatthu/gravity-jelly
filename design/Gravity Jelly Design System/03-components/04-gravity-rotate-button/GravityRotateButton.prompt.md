**GravityRotateButton** — the signature 64dp circular FAB that rotates gravity 90°. Floats at the right of the tray. Shows a badge with rotations left this stage and disables (turns gray) at 0. The icon spins 90° per press.

```jsx
<GravityRotateButton turnsLeft={3} onRotate={rotateGravity} />
```

- `turnsLeft`: remaining rotations; the badge reflects it and 0 disables the button.
- This is the one signature mechanic control — don't add competing FABs.
