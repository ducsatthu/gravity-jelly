**ComboPopup** — the springy "×2 / ×3 …" bubble that bursts up after a chain-clear combo, floats, and fades (~900ms). Position it over the board where the chain resolved; the parent owns placement and lifecycle.

```jsx
{combo > 1 && <ComboPopup key={comboId} combo={combo} />}
```

- `combo`: the multiplier number. The praise line under the bubble escalates with it — small chains say *Tốt!*, big ones shout *Hoàn hảo! / Amazing! / Cuồng nhiệt!* in hotter colors with sparkles.
- `praise`: override the auto-picked word with your own.
- Replay by remounting with a new `key`. Renders `null` when `visible={false}`.
