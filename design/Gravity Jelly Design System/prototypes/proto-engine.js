/* proto-engine.js — pure gameplay logic shared by the Vine (W2) and Drop (W3)
   playable prototypes. Block-fit placement + gravity-rotate slide + cascade.
   No React here — everything hangs off window.GJProtoEngine. */
(function () {
  const N = 9;
  const DIRS = ['down', 'left', 'up', 'right']; // clockwise rotate order
  const COLORS = ['yellow', 'mint', 'pink', 'blue'];

  // tray shapes (normalized, origin 0,0): I3 horizontal, V3 vertical, O4 2x2, single
  const SHAPES = [
    { name: 'I3', cells: [[0, 0], [0, 1], [0, 2]] },
    { name: 'V3', cells: [[0, 0], [1, 0], [2, 0]] },
    { name: 'O4', cells: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    { name: 'ONE', cells: [[0, 0]] },
  ];

  const uid = () => Math.random().toString(36).slice(2, 9);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const inb = (r, c) => r >= 0 && r < N && c >= 0 && c < N;
  const key = (r, c) => r + '-' + c;

  // seeded RNG (mulberry32) so trays are reproducible per prototype run
  function makeRng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randomPiece(rng) {
    const s = SHAPES[Math.floor(rng() * SHAPES.length)];
    return { shape: s.name, cells: s.cells, color: COLORS[Math.floor(rng() * COLORS.length)] };
  }
  const newTray = (rng) => [randomPiece(rng), randomPiece(rng), randomPiece(rng)];

  // ---- grid helpers ----
  const emptyGrid = () => Array.from({ length: N }, () => Array(N).fill(null));
  function cellsToGrid(cells) {
    const g = emptyGrid();
    cells.forEach((c) => { if (inb(c.r, c.c)) g[c.r][c.c] = c; });
    return g;
  }
  function gridToCells(g) {
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (g[r][c]) { g[r][c].r = r; g[r][c].c = c; out.push(g[r][c]); }
    }
    return out;
  }
  function pieceExtent(piece) {
    const rs = piece.cells.map((p) => p[0]); const cs = piece.cells.map((p) => p[1]);
    return { h: Math.max(...rs) + 1, w: Math.max(...cs) + 1 };
  }
  function canPlaceGrid(g, piece, ar, ac) {
    return piece.cells.every(([r, c]) => { const rr = ar + r, cc = ac + c; return inb(rr, cc) && !g[rr][cc]; });
  }
  function canPlace(cells, piece, ar, ac) { return canPlaceGrid(cellsToGrid(cells), piece, ar, ac); }
  function existsPlacement(cells, piece) {
    const g = cellsToGrid(cells); const { h, w } = pieceExtent(piece);
    for (let r = 0; r <= N - h; r++) for (let c = 0; c <= N - w; c++) if (canPlaceGrid(g, piece, r, c)) return true;
    return false;
  }

  // gravity-drop landing: player targets lane (pr,pc); piece slides along `dir`
  // to first contact. Returns {ar,ac} or null.
  function landing(cells, piece, dir, pr, pc) {
    const g = cellsToGrid(cells); const { h, w } = pieceExtent(piece);
    if (dir === 'down' || dir === 'up') {
      const ac = clamp(pc - ((w - 1) >> 1), 0, N - w);
      if (dir === 'down') { for (let ar = N - h; ar >= 0; ar--) if (canPlaceGrid(g, piece, ar, ac)) return { ar, ac }; }
      else { for (let ar = 0; ar <= N - h; ar++) if (canPlaceGrid(g, piece, ar, ac)) return { ar, ac }; }
    } else {
      const ar = clamp(pr - ((h - 1) >> 1), 0, N - h);
      if (dir === 'right') { for (let ac = N - w; ac >= 0; ac--) if (canPlaceGrid(g, piece, ar, ac)) return { ar, ac }; }
      else { for (let ac = 0; ac <= N - w; ac++) if (canPlaceGrid(g, piece, ar, ac)) return { ar, ac }; }
    }
    return null;
  }

  // full rows / cols (all 9 cells occupied, stones included)
  function fullLines(cells) {
    const g = cellsToGrid(cells); const rows = [], cols = [];
    for (let r = 0; r < N; r++) if (g[r].every((x) => x)) rows.push(r);
    for (let c = 0; c < N; c++) { let full = true; for (let r = 0; r < N; r++) if (!g[r][c]) { full = false; break; } if (full) cols.push(c); }
    return { rows, cols };
  }
  function linePositions(lines) {
    const set = new Set();
    lines.rows.forEach((r) => { for (let c = 0; c < N; c++) set.add(key(r, c)); });
    lines.cols.forEach((c) => { for (let r = 0; r < N; r++) set.add(key(r, c)); });
    return set;
  }

  // ---- gravity settle with fixed obstacles ----
  function settleDown(g, isFixed) {
    const ng = emptyGrid();
    for (let c = 0; c < N; c++) {
      let start = 0;
      for (let r = 0; r <= N; r++) {
        const cell = r < N ? g[r][c] : null;
        const fixedHere = r < N && cell && isFixed(cell);
        if (r === N || fixedHere) {
          const movable = [];
          for (let rr = start; rr < r; rr++) { const x = g[rr][c]; if (x && !isFixed(x)) movable.push(x); }
          let put = r - 1;
          for (let i = movable.length - 1; i >= 0; i--) { ng[put][c] = movable[i]; put--; }
          if (fixedHere) ng[r][c] = cell;
          start = r + 1;
        }
      }
    }
    return ng;
  }
  function transpose(g) { const t = emptyGrid(); for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) t[c][r] = g[r][c]; return t; }
  function vflip(g) { const t = emptyGrid(); for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) t[N - 1 - r][c] = g[r][c]; return t; }
  function settle(cells, dir, isFixed) {
    isFixed = isFixed || (() => false);
    let g = cellsToGrid(cells);
    if (dir === 'down') g = settleDown(g, isFixed);
    else if (dir === 'up') g = vflip(settleDown(vflip(g), isFixed));
    else if (dir === 'right') g = transpose(settleDown(transpose(g), isFixed));
    else if (dir === 'left') g = transpose(vflip(settleDown(vflip(transpose(g)), isFixed)));
    return gridToCells(g);
  }

  window.GJProtoEngine = {
    N, DIRS, COLORS, SHAPES,
    uid, clamp, inb, key, makeRng, randomPiece, newTray,
    cellsToGrid, gridToCells, pieceExtent, canPlace, existsPlacement,
    landing, fullLines, linePositions, settle,
  };
})();
