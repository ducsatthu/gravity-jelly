/* proto-game.jsx — the shared playable controller. Both prototypes call
   window.GJProtoGame(config) to get a mounted React app; config supplies the
   mechanic-specific bits (initial board, clear rules, targets, growth).
   window.GJProtoGame. */
(function () {
  const E = window.GJProtoEngine;
  const U = window.GJProtoUI;
  const { useState, useRef, useLayoutEffect, useEffect } = React;
  const DIRS = E.DIRS;
  const CELL = 32;

  function makeGame(config) {
    return function GameApp() {
      const [, force] = useState(0);
      const rerender = () => force((n) => n + 1);

      // refs hold the source of truth (async turn loop reads these), state used for render
      const rng = useRef(E.makeRng(config.seed));
      const cellsRef = useRef(config.initCells());
      const trayRef = useRef(E.newTray(rng.current));
      const dirIdxRef = useRef(0);
      const chargesRef = useRef(config.charges);
      const movesRef = useRef(0);
      const statusRef = useRef(null);
      const busy = useRef(false);

      const [cells, setCells] = useState(cellsRef.current);
      const [tray, setTray] = useState(trayRef.current);
      const [dirIdx, setDirIdx] = useState(0);
      const [charges, setCharges] = useState(config.charges);
      const [moves, setMoves] = useState(0);
      const [status, setStatus] = useState(null);
      const [targets, setTargets] = useState(config.countTargets(cellsRef.current));
      const [selected, setSelected] = useState(-1);
      const [hover, setHover] = useState(null);
      const [clearing, setClearing] = useState(new Set());
      const [combo, setCombo] = useState(null);
      const [flash, setFlash] = useState(null);

      const dir = DIRS[dirIdx];
      const delay = (ms) => new Promise((r) => setTimeout(r, ms));

      // ---- responsive phone scaling ----
      const [scale, setScale] = useState(1);
      useLayoutEffect(() => {
        const fit = () => {
          const s = Math.min((window.innerWidth - 24) / 360, (window.innerHeight - 24) / 800, 1.15);
          setScale(s);
        };
        fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
      }, []);

      function finalize(cs) {
        const t = config.countTargets(cs); setTargets(t);
        let tr = trayRef.current;
        if (tr.every((p) => !p)) { tr = E.newTray(rng.current); trayRef.current = tr; setTray(tr); }
        if (t <= 0) { statusRef.current = 'win'; setStatus('win'); return; }
        const placeable = tr.some((p) => p && E.existsPlacement(cs, p));
        if (!placeable) { statusRef.current = 'lose'; setStatus('lose'); }
      }

      async function resolveTurn(cs, isPlacement) {
        busy.current = true;
        let comboTier = 0, refunded = false;
        while (!statusRef.current) {
          const lines = E.fullLines(cs);
          const tot = lines.rows.length + lines.cols.length;
          if (tot === 0) break;
          comboTier += tot;
          const posSet = E.linePositions(lines);
          const clearIds = new Set();
          cs.forEach((cl) => { if (posSet.has(cl.r + '-' + cl.c) && cl.kind !== 'stone') clearIds.add(cl.id); });
          setClearing(clearIds); setCells(cs);
          await delay(360);
          const res = config.applyClear(cs, lines);
          if (res.flash) { setFlash({ msg: res.flash, key: Date.now() }); setTimeout(() => setFlash(null), 1000); }
          const settled = E.settle(res.next, DIRS[dirIdxRef.current], config.isFixed);
          setClearing(new Set()); cellsRef.current = settled; setCells(settled);
          if (comboTier >= 2) {
            setCombo({ n: comboTier, key: Date.now() });
            if (!refunded) { chargesRef.current = chargesRef.current + 1; setCharges(chargesRef.current); refunded = true; }
            setTimeout(() => setCombo(null), 850);
          }
          await delay(330);
          cs = settled;
        }
        if (isPlacement && !statusRef.current) {
          const m = movesRef.current + 1; movesRef.current = m; setMoves(m);
          if (config.grows && m % 2 === 0) {
            await delay(160);
            const grown = config.growth(cs);
            cellsRef.current = grown; setCells(grown); cs = grown;
            await delay(300);
            busy.current = false;
            return resolveTurn(cs, false); // growth may complete a line
          }
        }
        finalize(cs);
        busy.current = false;
      }

      function doPlace(piece, ar, ac, idx) {
        if (busy.current || statusRef.current) return;
        const added = piece.cells.map(([r, c]) => ({ id: E.uid(), kind: 'jelly', color: piece.color, r: ar + r, c: ac + c }));
        const tr = trayRef.current.slice(); tr[idx] = null; trayRef.current = tr; setTray(tr);
        setSelected(-1); setHover(null);
        const next = cellsRef.current.concat(added); cellsRef.current = next; setCells(next);
        resolveTurn(next, true);
      }

      function doRotate() {
        if (busy.current || statusRef.current || chargesRef.current <= 0) return;
        const nd = (dirIdxRef.current + 1) % 4; dirIdxRef.current = nd; setDirIdx(nd);
        chargesRef.current -= 1; setCharges(chargesRef.current);
        setSelected(-1); setHover(null);
        const settled = E.settle(cellsRef.current, DIRS[nd], config.isFixed);
        cellsRef.current = settled; setCells(settled);
        resolveTurn(settled, false);
      }

      function restart() {
        busy.current = false; statusRef.current = null; setStatus(null);
        rng.current = E.makeRng(config.seed);
        const c = config.initCells(); cellsRef.current = c; setCells(c);
        const tr = E.newTray(rng.current); trayRef.current = tr; setTray(tr);
        dirIdxRef.current = 0; setDirIdx(0);
        chargesRef.current = config.charges; setCharges(config.charges);
        movesRef.current = 0; setMoves(0);
        setSelected(-1); setHover(null); setClearing(new Set()); setCombo(null);
        setTargets(config.countTargets(c));
      }

      function selectPiece(i) {
        if (busy.current || statusRef.current || !tray[i]) return;
        setSelected((s) => (s === i ? -1 : i));
      }
      function onCellMove(rc) { if (selected >= 0) setHover(rc); }
      function onCellClick(rc) {
        if (selected < 0 || busy.current || statusRef.current) return;
        const piece = tray[selected];
        const L = E.landing(cellsRef.current, piece, dir, rc.r, rc.c);
        if (L) doPlace(piece, L.ar, L.ac, selected);
      }

      // ---- derived render values ----
      const piece = selected >= 0 ? tray[selected] : null;
      let previewCells = [], previewValid = false;
      if (piece && hover) {
        const L = E.landing(cells, piece, dir, hover.r, hover.c);
        if (L) { previewCells = piece.cells.map(([r, c]) => [L.ar + r, L.ac + c]); previewValid = true; }
      }
      const displayCells = config.decorate ? config.decorate(cells, dir) : cells;
      const warn = config.grows && !status && (movesRef.current % 2 === 1);
      const remaining = targets;

      return (
        <div style={{ width: 360 * scale, height: 800 * scale }}>
          <div style={{ width: 360, height: 800, transform: `scale(${scale})`, transformOrigin: 'top left',
            position: 'relative', borderRadius: 40, overflow: 'hidden', background: config.bg,
            boxShadow: '0 30px 60px rgba(60,44,24,0.4)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body,sans-serif)' }}>

            {/* HUD */}
            <div style={{ padding: '16px 18px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 16, padding: '8px 14px', boxShadow: '0 3px 8px rgba(120,92,52,0.16)' }}>
                <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, color: config.accent, letterSpacing: '0.01em', whiteSpace: 'nowrap', lineHeight: 1.1 }}>{config.title}</div>
                <div style={{ fontSize: 11, color: '#9B886F', fontWeight: 700, whiteSpace: 'nowrap' }}>{config.subtitle}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 16, padding: '6px 12px', textAlign: 'center', boxShadow: '0 3px 8px rgba(120,92,52,0.16)' }}>
                <div style={{ fontSize: 10, color: '#9B886F', fontWeight: 800, letterSpacing: '0.06em' }}>LƯỢT</div>
                <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 20, color: '#5B4636', lineHeight: 1 }}>{moves}</div>
              </div>
            </div>

            {/* objective pill */}
            <div style={{ padding: '2px 18px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 999, padding: '7px 14px 7px 10px', boxShadow: '0 3px 8px rgba(120,92,52,0.16)' }}>
                <div style={{ transform: 'scale(0.82)' }}><U.CellArt cell={config.goalGlyph} size={26} dir="down" /></div>
                <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 15, color: '#5B4636', whiteSpace: 'nowrap' }}>Còn: {remaining} {config.goalWord}</span>
              </div>
              {warn && (
                <div style={{ background: '#FFCA66', borderRadius: 999, padding: '6px 12px', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 12, color: '#6A4A2E', boxShadow: '0 3px 0 #E3A63A', animation: 'gjpulse 900ms ease-in-out infinite' }}>{config.warnText}</div>
              )}
            </div>

            {/* board */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '4px 0' }}>
              <U.BoardView cells={displayCells} cell={CELL} dir={dir}
                previewCells={previewCells} previewValid={previewValid} clearing={clearing}
                onCellMove={onCellMove} onCellLeave={() => setHover(null)} onCellClick={onCellClick} />
              {combo && (
                <div key={combo.key} style={{ position: 'absolute', top: '28%', left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                  <U.ComboPopup combo={combo.n} />
                </div>
              )}
              {flash && (
                <div key={flash.key} style={{ position: 'absolute', bottom: '8%', left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{ animation: 'gjrise 320ms cubic-bezier(.34,1.4,.5,1)', background: '#4E8C3F', color: '#fff', borderRadius: 999, padding: '8px 18px', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 16, boxShadow: '0 5px 0 #356328, 0 8px 16px rgba(53,99,40,0.35)' }}>{flash.msg}</div>
                </div>
              )}
            </div>

            {/* hint */}
            <div style={{ padding: '0 20px 6px', textAlign: 'center', fontSize: 12, color: config.hintColor || '#7A6A54', fontWeight: 700, minHeight: 30 }}>
              {selected >= 0 ? 'Chạm vào cột trên bàn để thả khối ↓' : config.hint}
            </div>

            {/* controls */}
            <div style={{ padding: '0 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button type="button" onClick={restart} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: 'none', borderRadius: 999, padding: '10px 16px', boxShadow: '0 3px 8px rgba(120,92,52,0.16)', cursor: 'pointer', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 14, color: '#5B4636' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B4636" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 1 1 2.3 5.6" /><path d="M4 20v-4h4" /></svg>
                Chơi lại
              </button>
              <U.RotateButton turnsLeft={charges} onRotate={doRotate} disabled={busy.current} />
            </div>

            {/* tray */}
            <div style={{ padding: '0 16px 16px' }}>
              <U.Tray tray={tray} selected={selected} onSelect={selectPiece} disabled={!!status} />
            </div>

            {/* dialogs */}
            <U.Dialog open={status === 'win'} tone="win" title={config.winTitle} body={config.winBody}
              actions={<U.BigButton tone="gravity" onClick={restart}>Chơi lại</U.BigButton>} />
            <U.Dialog open={status === 'lose'} tone="lose" title="KẸT!" body="Không còn chỗ đặt khối."
              actions={<U.BigButton onClick={restart}>Chơi lại</U.BigButton>} />
          </div>
        </div>
      );
    };
  }

  window.GJProtoGame = makeGame;
})();
