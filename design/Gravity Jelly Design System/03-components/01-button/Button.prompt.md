**Button** — the jelly candy button with a 3D edge that compresses on press. Use for every tappable action; `size="cta"` is the 56dp primary action (radius 28dp).

```jsx
<Button variant="primary" size="cta" icon="play" fullWidth>Chơi</Button>
<Button variant="secondary" icon="settings">Cài đặt</Button>
<Button variant="secondary" icon="star" comingSoon>Daily</Button>
```

- `variant`: `primary | gravity | success | danger | secondary | ghost`.
- `size`: `cta` (56dp) | `md` (48dp). Always meets the 48dp touch minimum.
- `comingSoon`: dims the button and appends a "SẮP CÓ" pill (also disables it).
- `icon` / `iconRight`: glyph names from `Icon`.
