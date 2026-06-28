**JellyBlock** — the signature grid cell: a rounded jelly cube with a thick edge, glossy sheen, and gravity-tracking eyes. Each color also carries a cute corner sticker (yellow star / mint leaf / pink heart / blue droplet) so blocks are recognizable by motif, not just hue. Use for every filled cell on the board and in the tray; pass `color="stone"` for fixed cells.

```jsx
<JellyBlock color="mint" size={36} direction="down" />
<JellyBlock color="stone" size={36} />
```

- `color`: `yellow | mint | pink | blue | stone` — each carries its own face expression.
- `count`: cluster size carried as data; not drawn on the block.
- `direction`: where the eyes look = current gravity.
- `expression`: `normal | happy | focus | smug | wink | front` — forwarded to the eyes for character (e.g. `happy` while falling, `wink` to greet the player).
- `blink`: close both eyes for a moment; pair with `expression="front"` for a natural human blink.
- `squashed`: impact squash; `clearing`: line-clear flash/pop.
- `connect`: `{top,right,bottom,left}` — accepted for compatibility but no longer changes corners; every block stays fully rounded on all four corners.
