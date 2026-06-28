/* board.jsx — Game board renderer (UI-kit helper, not a DS primitive).
   Parses a compact char map, finds same-color clusters (for the cluster
   number + merged corners), and lays out 9x9 JellyBlocks. */

(function () {
  const { JellyBlock } = window.GravityJellyDesignSystem_3e0487;

  const CODE = { Y: 'yellow', M: 'mint', P: 'pink', B: 'blue', S: 'stone' };

  // mapRows: array of 9 strings, chars in {Y,M,P,B,S,.}
  function parse(mapRows) {
    return mapRows.map((row) => row.split('').map((ch) => (ch === '.' ? null : { code: ch, color: CODE[ch] })));
  }

  // flood-fill same-color (non-stone) clusters -> size + membership id
  function clusters(grid) {
    const N = grid.length;
    const id = grid.map((r) => r.map(() => -1));
    const sizes = [];
    let next = 0;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (!cell || cell.code === 'S' || id[r][c] !== -1) continue;
        // BFS
        const stack = [[r, c]];
        id[r][c] = next;
        let size = 0;
        while (stack.length) {
          const [cr, cc] = stack.pop();
          size++;
          [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]].forEach(([nr, nc]) => {
            if (nr < 0 || nc < 0 || nr >= N || nc >= grid[nr].length) return;
            const n = grid[nr][nc];
            if (n && n.code === cell.code && id[nr][nc] === -1) {
              id[nr][nc] = next;
              stack.push([nr, nc]);
            }
          });
        }
        sizes[next] = size;
        next++;
      }
    }
    return { id, sizes };
  }

  function Board({ map, direction = 'down', cell = 36, gap = 2, pad = 8, style = {} }) {
    const grid = React.useMemo(() => parse(map), [map]);
    const { id, sizes } = React.useMemo(() => clusters(grid), [grid]);
    const N = grid.length;
    const connectAt = (r, c) => {
      const same = (nr, nc) => nr >= 0 && nc >= 0 && nr < N && nc < grid[nr].length && id[nr][nc] === id[r][c] && id[r][c] !== -1;
      return { top: same(r - 1, c), right: same(r, c + 1), bottom: same(r + 1, c), left: same(r, c - 1) };
    };

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, ${cell}px)`,
          gridAutoRows: `${cell}px`,
          gap,
          padding: pad,
          background: 'var(--color-surface-sunken)',
          borderRadius: 12,
          boxShadow: 'inset 0 2px 6px rgba(120,92,52,0.12)',
          ...style,
        }}
      >
        {grid.map((row, r) =>
          row.map((cellv, c) => {
            if (!cellv) {
              return <div key={`${r}-${c}`} style={{ width: cell, height: cell, borderRadius: 'var(--radius-md)', background: 'var(--color-cell-empty)', boxShadow: 'inset 0 0 0 1px var(--color-cell-line)' }} />;
            }
            const isStone = cellv.code === 'S';
            return (
              <JellyBlock
                key={`${r}-${c}`}
                color={cellv.color}
                size={cell}
                count={isStone ? null : sizes[id[r][c]]}
                direction={direction}
                showEyes={!isStone}
                connect={connectAt(r, c)}
              />
            );
          })
        )}
      </div>
    );
  }

  window.GJBoard = Board;
})();
