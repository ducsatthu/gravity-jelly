**Tray** — the 112dp bottom dock holding the 3 upcoming pieces to drag onto the board. All slots share **one cell size** (driven by the largest piece present, clamped 12–22dp), so the dock never mixes huge and tiny cells — small pieces get roomy cells, big pieces (5-long bar, 3×3) get uniformly smaller cells, never jarring. Any shape from 1 to 9 cells fits. The selected slot lifts 6dp and shows a primary focus ring. Use as the bottom element of the game screen, above the rotate FAB.

The game's piece catalog spans 6 groups — straight bars (1–5 cells), squares (2×2, 3×3), L/J hooks, T pieces, S/Z zig-zags, and special folded shapes (staircase, U, plus, diagonals) — **24 base shape types** in all. The Tray card shows the complete catalog with names.

```jsx
<Tray
  pieces={[
    { cells: [[0,0],[0,1],[1,0]], color: 'mint', count: 3 },
    { cells: [[0,0],[0,1],[0,2]], color: 'pink', count: 3 },
    null,
  ]}
  selectedIndex={0}
  onSelect={setSelected}
/>
```

- `pieces`: array of 3; `null` = consumed slot (shows a dashed placeholder).
- Pieces auto-normalize their cell coordinates and merge adjacent corners.
