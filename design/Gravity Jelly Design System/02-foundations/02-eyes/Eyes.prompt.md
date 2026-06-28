**Eyes** — googly jelly eyes whose pupils track the current gravity direction; use inside `JellyBlock` or any character that should "look" toward where it falls.

```jsx
<Eyes direction="down" blockSize={36} />
```

- `direction`: `down | up | left | right` — pupils slide toward gravity.
- `blockSize`: dp size of the host block; eyes scale from it.
- `open={false}`: blink/squash state (flattened whites, hidden pupils).
- `expression`: `normal` (tracks gravity) · `happy` (joyful "^ ^" arcs with a bob — use while falling) · `focus` (eyes front with iris ring + pulsing reticle, like pulling focus on the player) · `smug` (heavy, tilted half-lids — a contemptuous squint) · `wink` (one open eye + one closed arc — a friendly wink) · `front` (round eyes, pupils centered — looking straight at the player).
