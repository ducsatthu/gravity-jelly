/* jelly-play.jsx — fully playable Gravity Jelly prototype (UI-kit demo).
   Block-sudoku placement + the signature gravity-rotate slide. Reads DS
   components from the namespace. Exposes window.GJPlay. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { JellyBlock, Hud, GravityRotateButton, ComboPopup, Dialog, Button } = NS;
  const { useState, useRef, useEffect, useLayoutEffect, useCallback } = React;

  const N = 9;
  const COLORS = ['yellow', 'mint', 'pink', 'blue'];
  const DIRS = ['down', 'left', 'up', 'right']; // clockwise
  const MAX_CHARGES = 5;
  const uid = () => Math.random().toString(36).slice(2, 9);

  // Normalized shapes (origin 0,0). Small shapes repeated → higher draw weight.
  const SHAPES = [
  [[0, 0]],
  [[0, 0], [0, 1]], [[0, 0], [1, 0]],
  [[0, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [1, 1]], [[0, 1], [0, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 1]], // T
  [[0, 0], [1, 0], [2, 0], [2, 1]], // L
  [[0, 1], [1, 1], [2, 1], [2, 0]], // J
  [[0, 1], [0, 2], [1, 0], [1, 1]], // S
  [[0, 0], [0, 1], [1, 1], [1, 2]], // Z
  [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]], // plus
  [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [1, 0], [2, 0], [3, 0]]];

  // weight: index 0..6 (small) twice
  const POOL = SHAPES.concat(SHAPES.slice(0, 8));

  const randomPiece = () => {
    const cells = POOL[Math.floor(Math.random() * POOL.length)];
    return { cells, color: COLORS[Math.floor(Math.random() * COLORS.length)] };
  };
  const newTray = () => [randomPiece(), randomPiece(), randomPiece()];

  // ---- grid helpers ----
  const key = (r, c) => r + '-' + c;
  function colorGrid(blocks) {
    const g = Array.from({ length: N }, () => Array(N).fill(null));
    blocks.forEach((b) => {if (b.r >= 0 && b.r < N && b.c >= 0 && b.c < N) g[b.r][b.c] = b.color;});
    return g;
  }
  function canPlace(blocks, piece, ar, ac) {
    const g = colorGrid(blocks);
    return piece.cells.every(([r, c]) => {
      const rr = ar + r,cc = ac + c;
      return rr >= 0 && rr < N && cc >= 0 && cc < N && !g[rr][cc];
    });
  }
  function pieceExtent(piece) {
    const rs = piece.cells.map(([r]) => r),cs = piece.cells.map(([, c]) => c);
    return { h: Math.max(...rs) + 1, w: Math.max(...cs) + 1 };
  }
  function existsPlacement(blocks, piece) {
    const { h, w } = pieceExtent(piece);
    for (let r = 0; r <= N - h; r++) for (let c = 0; c <= N - w; c++) if (canPlace(blocks, piece, r, c)) return true;
    return false;
  }
  function computeClears(blocks) {
    const g = colorGrid(blocks);
    const full = (cells) => cells.every(([r, c]) => g[r][c]);
    const clear = new Set();
    let groups = 0;
    for (let r = 0; r < N; r++) {const cells = Array.from({ length: N }, (_, c) => [r, c]);if (full(cells)) {groups++;cells.forEach(([r, c]) => clear.add(key(r, c)));}}
    for (let c = 0; c < N; c++) {const cells = Array.from({ length: N }, (_, r) => [r, c]);if (full(cells)) {groups++;cells.forEach(([r, c]) => clear.add(key(r, c)));}}
    for (let br = 0; br < 3; br++) for (let bc = 0; bc < 3; bc++) {
      const cells = [];for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) cells.push([br * 3 + i, bc * 3 + j]);
      if (full(cells)) {groups++;cells.forEach(([r, c]) => clear.add(key(r, c)));}
    }
    return { clearIds: blocks.filter((b) => clear.has(key(b.r, b.c))).map((b) => b.id), groups };
  }
  function applyGravity(blocks, dir) {
    const moved = blocks.map((b) => ({ ...b }));
    const grid = Array.from({ length: N }, () => Array(N).fill(null));
    moved.forEach((b) => {grid[b.r][b.c] = b;});
    if (dir === 'down' || dir === 'up') {
      for (let c = 0; c < N; c++) {
        const col = [];for (let r = 0; r < N; r++) if (grid[r][c]) col.push(grid[r][c]);
        if (dir === 'down') {let r = N - 1;for (let i = col.length - 1; i >= 0; i--) {col[i].r = r--;col[i].c = c;}} else
        {let r = 0;for (let i = 0; i < col.length; i++) {col[i].r = r++;col[i].c = c;}}
      }
    } else {
      for (let r = 0; r < N; r++) {
        const row = [];for (let c = 0; c < N; c++) if (grid[r][c]) row.push(grid[r][c]);
        if (dir === 'right') {let c = N - 1;for (let i = row.length - 1; i >= 0; i--) {row[i].c = c--;row[i].r = r;}} else
        {let c = 0;for (let i = 0; i < row.length; i++) {row[i].c = c++;row[i].r = r;}}
      }
    }
    return moved;
  }

  // ---- tray piece thumbnail ----
  function TrayThumb({ piece, cell }) {
    const { h, w } = pieceExtent(piece);
    return (
      <div style={{ position: 'relative', width: w * (cell + 2) - 2, height: h * (cell + 2) - 2 }}>
        {piece.cells.map(([r, c], i) =>
        <div key={i} style={{ position: 'absolute', left: c * (cell + 2), top: r * (cell + 2) }}>
            <JellyBlock color={piece.color} size={cell} showEyes={false} />
          </div>
        )}
      </div>);

  }

  // ---- DragGhost: the piece "in hand" while dragging (follows the pointer) ----
  function DragGhost({ piece, cell, valid }) {
    const { h, w } = pieceExtent(piece);
    const g = 2;
    return (
      <div style={{ position: 'relative', width: w * (cell + g) - g, height: h * (cell + g) - g, transform: 'scale(1.06)', opacity: valid ? 0.9 : 0.8 }}>
        {piece.cells.map(([r, c], i) =>
        <div key={i} style={{ position: 'absolute', left: c * (cell + g), top: r * (cell + g) }}>
            <JellyBlock color={piece.color} size={cell} showEyes={cell >= 20} />
          </div>
        )}
      </div>);

  }

  // ---- LiveJelly: a board block with its own autonomous eye life ----
  // Default: eyes track gravity. On a private random timer it glances around,
  // blinks, looks at the player, or winks — each block independent, never in
  // sync. `falling` (set briefly when gravity moves it) plays happy eyes.
  function LiveJelly({ color, size, gravityDir, falling, clearing }) {
    const [ov, setOv] = useState(null);
    useEffect(() => {
      let alive = true,t;
      const schedule = () => {t = setTimeout(act, 2200 + Math.random() * 4200);};
      const clear = (ms) => setTimeout(() => {if (alive) setOv(null);}, ms);
      const act = () => {
        if (!alive) return;
        const roll = Math.random();
        if (roll < 0.38) {setOv({ blink: true });clear(150);} else
        if (roll < 0.68) {setOv({ direction: ['left', 'right', 'up'][Math.floor(Math.random() * 3)] });clear(820);} else
        if (roll < 0.88) {setOv({ expression: 'front' });clear(1150);} else
        {setOv({ expression: 'wink' });clear(520);}
        schedule();
      };
      schedule();
      return () => {alive = false;clearTimeout(t);};
    }, []);
    const expression = clearing ? 'happy' : falling ? 'happy' : ov && ov.expression || 'normal';
    const direction = clearing || falling ? gravityDir : ov && ov.direction || gravityDir;
    const blink = !!(ov && ov.blink) && !clearing && !falling;
    return <JellyBlock color={color} size={size} direction={direction} expression={expression} blink={blink} />;
  }

  function GameApp() {
    const [blocks, setBlocks] = useState([]);
    const [tray, setTray] = useState(newTray);
    const [selected, setSelected] = useState(-1);
    const [dirIdx, setDirIdx] = useState(0);
    const [charges, setCharges] = useState(3);
    const [score, setScore] = useState(0);
    const [clearing, setClearing] = useState([]);
    const [combo, setCombo] = useState(null);
    const [hover, setHover] = useState(null);
    const [paused, setPaused] = useState(false);
    const [over, setOver] = useState(false);
    const [falling, setFalling] = useState(() => new Set());
    const [cell, setCell] = useState(30);
    const [drag, setDrag] = useState(null); // {x,y,piece,scale,anchor,valid}
    const busy = useRef(false);
    const boardRef = useRef(null);
    const downRef = useRef(null); // active pointer-down bookkeeping
    const draggedRef = useRef(false); // suppress the click that follows a drag
    const dir = DIRS[dirIdx];

    // responsive board cell
    const areaRef = useRef(null);
    useLayoutEffect(() => {
      const el = areaRef.current;if (!el || typeof ResizeObserver === 'undefined') return;
      const measure = () => {
        const avail = Math.min(el.clientWidth - 8, el.clientHeight - 16);
        setCell(Math.max(22, Math.min(46, Math.floor((avail - 16 - 12) / N))));
      };
      measure();const ro = new ResizeObserver(measure);ro.observe(el);return () => ro.disconnect();
    }, []);

    // idle blink is now per-block (LiveJelly); no global blink needed.

    const pad = 6,gap = 2;
    const step = cell + gap;
    const boardPx = pad * 2 + N * cell + (N - 1) * gap;
    const cellPos = (i) => pad + i * step;

    const resolve = useCallback((curBlocks, curTray, curCharges) => {
      const { clearIds, groups } = computeClears(curBlocks);
      const refill = (t) => t.every((p) => !p) ? newTray() : t;
      const finishUp = (bl, t, ch) => {
        const placeable = t.some((p) => p && existsPlacement(bl, p));
        if (!placeable && ch <= 0) setTimeout(() => setOver(true), 250);
        busy.current = false;
      };
      if (groups > 0) {
        setClearing(clearIds);
        setCombo({ n: Math.max(2, groups + 1), key: Date.now() });
        setTimeout(() => {
          const remain = curBlocks.filter((b) => !clearIds.includes(b.id));
          const newCh = Math.min(MAX_CHARGES, curCharges + groups);
          const t = refill(curTray);
          setBlocks(remain);setClearing([]);setTray(t);
          setScore((s) => s + groups * 100 + clearIds.length * 5);
          setCharges(newCh);
          setTimeout(() => setCombo(null), 700);
          finishUp(remain, t, newCh);
        }, 480);
      } else {
        const t = refill(curTray);
        if (t !== curTray) setTray(t);
        finishUp(curBlocks, t, curCharges);
      }
    }, []);

    const placePiece = useCallback((piece, ar, ac, idx) => {
      if (busy.current || paused || over) return false;
      if (!piece || !canPlace(blocks, piece, ar, ac)) return false;
      busy.current = true;
      const added = piece.cells.map(([r, c]) => ({ id: uid(), r: ar + r, c: ac + c, color: piece.color, fresh: true }));
      const next = blocks.concat(added);
      const t2 = tray.slice();t2[idx] = null;
      setBlocks(next);setTray(t2);setSelected(-1);setHover(null);
      setTimeout(() => setBlocks((bs) => bs.map((b) => b.fresh ? { ...b, fresh: false } : b)), 30);
      setTimeout(() => resolve(next, t2, charges), 180);
      return true;
    }, [blocks, tray, charges, paused, over, resolve]);

    const place = useCallback((ar, ac) => {
      if (selected < 0) return;
      placePiece(tray[selected], ar, ac, selected);
    }, [placePiece, tray, selected]);

    // ---- pointer drag-and-drop: lift a tray piece, drag it over the board,
    //      snap-preview the target cells, release to drop. Mouse + touch. ----
    const liftFor = (scale) => Math.round(cell * scale * 1.05) + 26;
    const dragAnchor = (clientX, clientY, piece, scale, rect) => {
      const ext = pieceExtent(piece);
      const pw = ext.w * step - gap,ph = ext.h * step - gap;
      const lift = liftFor(scale);
      const cxLocal = (clientX - rect.left) / scale;
      const cyLocal = (clientY - lift - rect.top) / scale;
      const onBoard = cxLocal >= -cell && cxLocal <= boardPx + cell && cyLocal >= -cell && cyLocal <= boardPx + cell;
      if (!onBoard) return { anchor: null, valid: false };
      let hc = Math.round((cxLocal - pw / 2 - pad) / step);
      let hr = Math.round((cyLocal - ph / 2 - pad) / step);
      hr = Math.max(0, Math.min(N - ext.h, hr));
      hc = Math.max(0, Math.min(N - ext.w, hc));
      return { anchor: [hr, hc], valid: canPlace(blocks, piece, hr, hc) };
    };
    const trayDown = (i, e) => {
      if (!tray[i] || busy.current || paused || over) return;
      downRef.current = { i, x: e.clientX, y: e.clientY, armed: false };
      try {e.currentTarget.setPointerCapture(e.pointerId);} catch (_) {}
    };
    const trayMove = (e) => {
      const d = downRef.current;if (!d) return;
      if (!d.armed) {
        if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 7) return;
        d.armed = true;setSelected(d.i);
      }
      const rect = boardRef.current.getBoundingClientRect();
      const scale = rect.width / boardPx;
      const piece = tray[d.i];
      const info = dragAnchor(e.clientX, e.clientY, piece, scale, rect);
      setDrag({ x: e.clientX, y: e.clientY, piece, scale, anchor: info.anchor, valid: info.valid });
      setHover(info.anchor);
    };
    const trayUp = (e) => {
      const d = downRef.current;if (!d) return;
      downRef.current = null;
      if (!d.armed) return; // a plain tap — handled by onClick
      draggedRef.current = true;
      const rect = boardRef.current.getBoundingClientRect();
      const scale = rect.width / boardPx;
      const piece = tray[d.i];
      const info = dragAnchor(e.clientX, e.clientY, piece, scale, rect);
      setDrag(null);setHover(null);
      if (!(info.anchor && info.valid && placePiece(piece, info.anchor[0], info.anchor[1], d.i))) {
        setSelected(-1);
      }
    };
    const trayClick = (i) => {
      if (draggedRef.current) {draggedRef.current = false;return;}
      if (!tray[i] || busy.current || paused || over) return;
      setSelected((s) => s === i ? -1 : i);
    };

    const rotateGravity = useCallback(() => {
      if (busy.current || paused || over || charges <= 0) return;
      busy.current = true;
      const ndir = (dirIdx + 1) % 4;
      const moved = applyGravity(blocks, DIRS[ndir]);
      // mark blocks that actually shifted so they play the happy "falling" eyes
      const movedIds = moved.filter((m) => {const o = blocks.find((b) => b.id === m.id);return o && (o.r !== m.r || o.c !== m.c);}).map((m) => m.id);
      setDirIdx(ndir);setCharges((c) => c - 1);setBlocks(moved);setSelected(-1);setHover(null);
      setFalling(new Set(movedIds));
      setTimeout(() => setFalling(new Set()), 700);
      setTimeout(() => resolve(moved, tray, charges - 1), 380);
    }, [blocks, tray, dirIdx, charges, paused, over, resolve]);

    const restart = () => {
      busy.current = false;
      setBlocks([]);setTray(newTray());setSelected(-1);setDirIdx(0);
      setCharges(3);setScore(0);setClearing([]);setCombo(null);setHover(null);setOver(false);setPaused(false);
    };

    // hovered anchor (clamped so the piece stays on board)
    const anchorFor = (hr, hc) => {
      const piece = tray[selected];if (!piece) return null;
      const { h, w } = pieceExtent(piece);
      return [Math.max(0, Math.min(N - h, hr)), Math.max(0, Math.min(N - w, hc))];
    };
    const onBoardMove = (e) => {
      if (downRef.current || selected < 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const hc = Math.floor((e.clientX - rect.left - pad) / step);
      const hr = Math.floor((e.clientY - rect.top - pad) / step);
      if (hr < 0 || hc < 0 || hr >= N || hc >= N) {setHover(null);return;}
      setHover(anchorFor(hr, hc));
    };
    const onBoardClick = (e) => {
      if (downRef.current || selected < 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const hc = Math.floor((e.clientX - rect.left - pad) / step);
      const hr = Math.floor((e.clientY - rect.top - pad) / step);
      if (hr < 0 || hc < 0 || hr >= N || hc >= N) return;
      const a = anchorFor(hr, hc);if (a) place(a[0], a[1]);
    };

    const clearingSet = new Set(clearing);
    const piece = selected >= 0 ? tray[selected] : null;
    const previewCells = hover && piece ? piece.cells.map(([r, c]) => [hover[0] + r, hover[1] + c]) : [];
    const previewValid = hover && piece ? canPlace(blocks, piece, hover[0], hover[1]) : false;

    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'radial-gradient(130% 80% at 50% -10%, #FFFBF3 0%, var(--color-bg) 46%, #F6EAD6 100%)' }}>
        <Hud score={score} direction={dir} onPause={() => setPaused(true)} />

        {/* board */}
        <div ref={areaRef} style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 4px 12px' }}>
          <div style={{ position: 'relative', padding: 7, borderRadius: 24, background: 'linear-gradient(180deg,#FFFFFF 0%,#FBF1DF 100%)', border: '2px solid #F1E3C9', boxShadow: '0 8px 0 #E9D7BA, 0 20px 30px -12px var(--color-shadow-key), inset 0 3px 0 rgba(255,255,255,0.95)' }}>
            <div
              ref={boardRef}
              onMouseMove={onBoardMove} onMouseLeave={() => setHover(null)} onClick={onBoardClick}
              style={{ position: 'relative', width: boardPx, height: boardPx, background: 'var(--color-surface-sunken)', borderRadius: 20, boxShadow: 'inset 0 2px 6px rgba(120,92,52,0.12)', cursor: selected >= 0 ? 'pointer' : 'default' }}>
              
              {/* empty cells */}
              {Array.from({ length: N }).map((_, r) => Array.from({ length: N }).map((_, c) =>
              <div key={key(r, c)} style={{ position: 'absolute', left: cellPos(c), top: cellPos(r), width: cell, height: cell, borderRadius: 7, background: 'var(--color-cell-empty)', boxShadow: 'inset 0 0 0 1px var(--color-cell-line)' }} />
              ))}
              {/* 3x3 separators */}
              {[3, 6].map((i) =>
              <div key={'v' + i} style={{ position: 'absolute', left: cellPos(i) - gap / 2 - 1, top: pad, width: 2, height: N * cell + (N - 1) * gap, background: 'var(--color-cell-line)', opacity: 0.9, borderRadius: 2 }} />
              )}
              {[3, 6].map((i) =>
              <div key={'h' + i} style={{ position: 'absolute', top: cellPos(i) - gap / 2 - 1, left: pad, height: 2, width: N * cell + (N - 1) * gap, background: 'var(--color-cell-line)', opacity: 0.9, borderRadius: 2 }} />
              )}
              {/* placement preview */}
              {previewCells.map(([r, c], i) =>
              <div key={'p' + i} style={{ position: 'absolute', left: cellPos(c), top: cellPos(r), width: cell, height: cell, borderRadius: 7, background: previewValid ? 'var(--color-success)' : 'var(--color-danger)', boxShadow: `inset 0 0 0 2px ${previewValid ? 'var(--color-success)' : 'var(--color-danger)'}`, opacity: 0.5, pointerEvents: 'none', transition: 'opacity 120ms' }} />
              )}
              {/* live blocks */}
              {blocks.map((b) => {
                const isClearing = clearingSet.has(b.id);
                return (
                  <div key={b.id} style={{ position: 'absolute', left: cellPos(b.c), top: cellPos(b.r), transition: 'left 340ms var(--ease-jelly), top 340ms var(--ease-jelly), transform 320ms var(--ease-jelly), opacity 320ms ease', transform: isClearing ? 'scale(0.2)' : b.fresh ? 'scale(0.6)' : 'scale(1)', opacity: isClearing ? 0 : 1, zIndex: isClearing ? 3 : 1 }}>
                    <LiveJelly color={b.color} size={cell} gravityDir={dir} falling={falling.has(b.id)} clearing={isClearing} />
                  </div>);

              })}
            </div>
          </div>
          {combo &&
          <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
              <ComboPopup key={combo.key} combo={combo.n} />
            </div>
          }
        </div>

        {/* control band */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 22px 12px' }}>
          <div style={{ maxWidth: 150 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--color-text)' }}>Đổi trọng lực</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.3 }}>Trượt toàn bộ khối về tường mới để dồn hàng.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <GravityRotateButton turnsLeft={charges} onRotate={rotateGravity} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, color: 'var(--color-gravity-edge)', letterSpacing: '0.05em' }}>XOAY</span>
          </div>
        </div>

        {/* tray */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0, height: 104, display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 8, padding: '0 14px', background: 'var(--color-surface)', borderRadius: '26px 26px 0 0', boxShadow: '0 -6px 18px var(--color-shadow-soft)' }}>
          {tray.map((p, i) => {
            const sel = selected === i && p;
            return (
              <button key={i} type="button" disabled={!p}
              onClick={() => trayClick(i)}
              onPointerDown={(e) => trayDown(i, e)}
              onPointerMove={trayMove}
              onPointerUp={trayUp}
              onPointerCancel={trayUp}
              style={{ width: 92, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 16, background: sel ? 'var(--color-surface-sunken)' : 'transparent', boxShadow: sel ? 'inset 0 0 0 3px var(--color-primary)' : 'none', transform: sel ? 'translateY(-6px)' : 'none', opacity: p ? drag && selected === i ? 0.3 : 1 : 0.3, transition: 'transform 220ms var(--ease-jelly), box-shadow 140ms, opacity 140ms', cursor: p ? 'grab' : 'default', touchAction: 'none' }}>
                {p ? <TrayThumb piece={p} cell={Math.min(20, Math.floor(70 / Math.max(pieceExtent(p).w, pieceExtent(p).h)))} /> :
                <div style={{ width: 48, height: 48, borderRadius: 10, border: '2px dashed var(--color-cell-line)' }} />}
              </button>);

          })}
        </div>

        {/* dragged piece — a lifted ghost that follows the pointer (portaled to
             <body> so the phone's scale transform doesn't offset fixed coords). */}
        {drag && ReactDOM.createPortal(
          <div style={{ position: 'fixed', left: drag.x, top: drag.y - liftFor(drag.scale) - 10, transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 60, filter: 'drop-shadow(0 12px 16px rgba(80,60,40,0.32))' }}>
            <DragGhost piece={drag.piece} cell={Math.max(12, Math.round(cell * drag.scale))} valid={drag.valid} />
          </div>,
          document.body
        )}

        {/* pause */}
        <Dialog open={paused} title="Tạm dừng" icon="pause" onClose={() => setPaused(false)}
        actions={<><Button variant="primary" fullWidth onClick={() => setPaused(false)}>Tiếp tục</Button><Button variant="secondary" fullWidth onClick={restart}>Chơi lại</Button></>}>
          Điểm hiện tại: <b style={{ color: 'var(--color-text)' }}>{score.toLocaleString('vi-VN')}</b>
        </Dialog>

        {/* game over */}
        <Dialog open={over} title="Hết nước đi!" icon="trophy" dismissable={false}
        actions={<Button variant="gravity" fullWidth onClick={restart} icon="refresh">Chơi lại</Button>}>
          Không còn chỗ đặt khối và đã hết lượt xoay. Tổng điểm: <b style={{ color: 'var(--color-text)' }}>{score.toLocaleString('vi-VN')}</b>.
        </Dialog>
      </div>);

  }

  window.GJPlay = GameApp;
})();