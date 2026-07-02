/* proto-ui.jsx — shared presentational parts for the two mechanic prototypes.
   Reads JellyBlock from the DS bundle for jelly/stone cells; draws the special
   mechanic cells (drop / vine root / vine segment) inline. window.GJProtoUI. */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const JellyBlock = NS.JellyBlock;
  const E = window.GJProtoEngine;
  const N = E.N;
  const { useState, useEffect } = React;

  // ---------- special mechanic cell art ----------
  function DropCell({ size, buried }) {
    return (
      <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), boxSizing: 'border-box',
        background: '#5FC3B2', border: `3px solid #3E9E8E`, boxShadow: '0 2px 6px rgba(120,92,52,0.16)',
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        opacity: buried ? 0.9 : 1 }}>
        <div style={{ position: 'absolute', top: 2, left: '14%', right: '14%', height: '32%', background: '#CBF2EB', borderRadius: '50%', opacity: 0.8 }} />
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" style={{ position: 'relative' }}>
          <path d="M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z" fill="#EAFBF7" stroke="#3E9E8E" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        {buried && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(90,70,54,0.34)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24"><path d="M6 11V8a6 6 0 1 1 12 0v3" fill="none" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" /><rect x="4.5" y="11" width="15" height="10" rx="2.4" fill="#FFF" /></svg>
          </div>
        )}
      </div>
    );
  }
  function VineCell({ size, root, head, connect }) {
    connect = connect || {};
    const fill = root ? '#4E8C3F' : '#7FBE5C';
    const edge = root ? '#356328' : '#4E8C3F';
    const stem = root ? '#2C5321' : '#3C6E30';
    const leaf = '#E4F7CE';
    const t = Math.max(5, Math.round(size * 0.26)); // stem thickness
    const c0 = size / 2;
    const bar = (k, st) => <div key={k} style={Object.assign({ position: 'absolute', background: stem, borderRadius: t / 2 }, st)} />;
    const conns = [];
    if (connect.up) conns.push(bar('u', { left: c0 - t / 2, top: -2, width: t, height: c0 + t / 2 + 2 }));
    if (connect.down) conns.push(bar('d', { left: c0 - t / 2, top: c0 - t / 2, width: t, height: c0 + t / 2 + 2 }));
    if (connect.left) conns.push(bar('l', { top: c0 - t / 2, left: -2, width: c0 + t / 2 + 2, height: t }));
    if (connect.right) conns.push(bar('r', { top: c0 - t / 2, left: c0 - t / 2, width: c0 + t / 2 + 2, height: t }));
    return (
      <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), boxSizing: 'border-box',
        background: fill, border: `3px solid ${edge}`,
        boxShadow: head ? '0 0 0 3px #C6F0A6, 0 2px 8px rgba(53,99,40,0.5)' : (root ? '0 2px 8px rgba(53,99,40,0.4)' : '0 2px 6px rgba(120,92,52,0.16)'),
        position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 2, left: '14%', right: '14%', height: '26%', background: root ? '#7CB86A' : '#A9D98F', borderRadius: '50%', opacity: 0.5 }} />
        {conns}
        <div style={{ position: 'absolute', left: c0 - t * 0.62, top: c0 - t * 0.62, width: t * 1.24, height: t * 1.24, borderRadius: '50%', background: stem }} />
        <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {root ? (
            <g fill={leaf} stroke={edge} strokeWidth="1">
              <path d="M12 17c-3.4 0-5.6-2.2-5.6-5.6C9.8 11.4 12 13.6 12 17z" />
              <path d="M12 17c3.4 0 5.6-2.2 5.6-5.6C14.2 11.4 12 13.6 12 17z" />
            </g>
          ) : head ? (
            <g fill="none" stroke={leaf} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16c0-3.4 1.4-6 4.6-7.4C17.4 6 15.2 4 12.4 4" /><circle cx="16.6" cy="8.6" r="0.4" />
            </g>
          ) : (
            <path d="M6.6 6.4c3.6.2 5.8 2.4 5.6 6-3.6-.2-5.8-2.4-5.6-6z" fill={leaf} stroke={edge} strokeWidth="0.8" strokeLinejoin="round" />
          )}
        </svg>
      </div>
    );
  }

  function CellArt({ cell, size, dir }) {
    if (cell.kind === 'jelly') return <JellyBlock color={cell.color} size={size} showEyes={size >= 24} direction={dir} />;
    if (cell.kind === 'stone') return <JellyBlock color="stone" size={size} />;
    if (cell.kind === 'drop') return <DropCell size={size} buried={cell.buried} />;
    if (cell.kind === 'root') return <VineCell size={size} root head={cell.isHead} connect={cell.connect} />;
    if (cell.kind === 'seg') return <VineCell size={size} head={cell.isHead} connect={cell.connect} />;
    return null;
  }

  // ---------- board ----------
  function BoardView({ cells, cell, dir, previewCells, previewValid, clearing, onCellMove, onCellLeave, onCellClick }) {
    const pad = 7, gap = 2, step = cell + gap;
    const boardPx = pad * 2 + N * cell + (N - 1) * gap;
    const pos = (i) => pad + i * step;
    const coordFrom = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const scale = rect.width / boardPx;
      const c = Math.floor(((e.clientX - rect.left) / scale - pad) / step);
      const r = Math.floor(((e.clientY - rect.top) / scale - pad) / step);
      return { r: E.clamp(r, 0, N - 1), c: E.clamp(c, 0, N - 1) };
    };
    const previewSet = new Set((previewCells || []).map((p) => p[0] + '-' + p[1]));
    const clearingSet = clearing || new Set();
    return (
      <div style={{ position: 'relative', padding: pad, borderRadius: 24,
        background: 'linear-gradient(180deg,#FFFFFF 0%,#FBF1DF 100%)', border: '2px solid #F1E3C9',
        boxShadow: '0 8px 0 #E9D7BA, 0 20px 30px -12px rgba(120,92,52,0.24), inset 0 3px 0 rgba(255,255,255,0.95)' }}>
        <div
          onMouseMove={(e) => onCellMove && onCellMove(coordFrom(e))}
          onMouseLeave={() => onCellLeave && onCellLeave()}
          onClick={(e) => onCellClick && onCellClick(coordFrom(e))}
          style={{ position: 'relative', width: boardPx - pad * 2, height: boardPx - pad * 2, background: 'var(--color-surface-sunken,#F4E9D8)', borderRadius: 18, boxShadow: 'inset 0 2px 6px rgba(120,92,52,0.12)', cursor: 'pointer', margin: 0 }}>
          {Array.from({ length: N }).map((_, r) => Array.from({ length: N }).map((_, c) => (
            <div key={r + '-' + c} style={{ position: 'absolute', left: (pos(c) - pad), top: (pos(r) - pad), width: cell, height: cell, borderRadius: Math.round(cell * 0.28), background: 'rgba(120,92,52,0.05)', boxShadow: 'inset 0 0 0 1px rgba(120,92,52,0.08)' }} />
          )))}
          {/* preview */}
          {(previewCells || []).map(([r, c], i) => (
            <div key={'pv' + i} style={{ position: 'absolute', left: (pos(c) - pad), top: (pos(r) - pad), width: cell, height: cell, borderRadius: Math.round(cell * 0.28),
              background: previewValid ? 'rgba(111,207,127,0.55)' : 'rgba(240,138,126,0.5)',
              boxShadow: `inset 0 0 0 2px ${previewValid ? '#6FCF7F' : '#F08A7E'}`, pointerEvents: 'none' }} />
          ))}
          {/* live cells */}
          {cells.map((cl) => {
            const isClearing = clearingSet.has(cl.id);
            return (
              <div key={cl.id} style={{ position: 'absolute', left: (pos(cl.c) - pad), top: (pos(cl.r) - pad),
                transition: 'left 300ms cubic-bezier(.34,1.4,.5,1), top 300ms cubic-bezier(.34,1.4,.5,1), transform 260ms ease, opacity 260ms ease',
                transform: isClearing ? 'scale(0.2)' : (cl.fresh ? 'scale(0.62)' : 'scale(1)'), opacity: isClearing ? 0 : 1, zIndex: isClearing ? 3 : 1 }}>
                <CellArt cell={cl} size={cell} dir={dir} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- tray ----------
  function TrayThumb({ piece, cell }) {
    const { h, w } = E.pieceExtent(piece); const g = 2;
    return (
      <div style={{ position: 'relative', width: w * (cell + g) - g, height: h * (cell + g) - g }}>
        {piece.cells.map(([r, c], i) => (
          <div key={i} style={{ position: 'absolute', left: c * (cell + g), top: r * (cell + g) }}>
            <JellyBlock color={piece.color} size={cell} showEyes={false} />
          </div>
        ))}
      </div>
    );
  }
  function Tray({ tray, selected, onSelect, disabled }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 8, padding: '10px 12px',
        background: 'var(--color-surface,#fff)', borderRadius: 24, boxShadow: '0 6px 16px rgba(120,92,52,0.16)' }}>
        {tray.map((p, i) => {
          const sel = selected === i && p;
          return (
            <button key={i} type="button" disabled={!p || disabled} onClick={() => onSelect(i)}
              style={{ width: 92, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none',
                borderRadius: 16, background: sel ? 'var(--color-surface-sunken,#F4E9D8)' : 'transparent',
                boxShadow: sel ? 'inset 0 0 0 3px #FF9F68' : 'none', transform: sel ? 'translateY(-4px)' : 'none',
                opacity: p ? 1 : 0.3, transition: 'transform 200ms cubic-bezier(.34,1.4,.5,1), box-shadow 140ms', cursor: p && !disabled ? 'pointer' : 'default' }}>
              {p ? <TrayThumb piece={p} cell={Math.min(20, Math.floor(64 / Math.max(E.pieceExtent(p).w, E.pieceExtent(p).h)))} />
                : <div style={{ width: 44, height: 44, borderRadius: 10, border: '2px dashed rgba(120,92,52,0.25)' }} />}
            </button>
          );
        })}
      </div>
    );
  }

  // ---------- rotate button + charges ----------
  function RotateButton({ turnsLeft, onRotate, disabled }) {
    const dead = disabled || turnsLeft <= 0;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button type="button" onClick={onRotate} disabled={dead}
          style={{ position: 'relative', width: 60, height: 60, borderRadius: 30, border: 'none', cursor: dead ? 'default' : 'pointer',
            background: dead ? '#C9BCA8' : '#7E6CF0', boxShadow: dead ? '0 3px 0 #A89A82' : '0 5px 0 #6353D6', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 120ms, box-shadow 120ms' }}
          onMouseDown={(e) => { if (!dead) { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = '0 2px 0 #6353D6'; } }}
          onMouseUp={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = dead ? '0 3px 0 #A89A82' : '0 5px 0 #6353D6'; }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12a8 8 0 1 1 2.3 5.6" /><path d="M4 20v-4h4" />
          </svg>
          <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 22, height: 22, padding: '0 5px', borderRadius: 11,
            background: '#FF9F68', color: '#fff', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 0 #E97E45' }}>{turnsLeft}</span>
        </button>
        <span style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 11, fontWeight: 700, color: '#6353D6', letterSpacing: '0.06em' }}>XOAY</span>
      </div>
    );
  }

  // ---------- combo popup ----------
  function ComboPopup({ combo }) {
    return (
      <div style={{ animation: 'gjpop 700ms cubic-bezier(.34,1.56,.5,1)', fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700,
        fontSize: 46, color: '#fff', textShadow: '0 3px 0 #E97E45, 0 6px 12px rgba(120,92,52,0.4)', WebkitTextStroke: '2px #E97E45' }}>
        ×{combo}
      </div>
    );
  }

  // ---------- dialog ----------
  function Dialog({ open, title, body, tone, actions }) {
    if (!open) return null;
    const accent = tone === 'win' ? '#6FCF7F' : tone === 'lose' ? '#F08A7E' : '#7E6CF0';
    return (
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(60,44,24,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40, padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 300, background: '#fff', borderRadius: 32, padding: '28px 24px 22px', textAlign: 'center', boxShadow: '0 24px 48px rgba(120,92,52,0.34)', animation: 'gjrise 300ms cubic-bezier(.34,1.4,.5,1)' }}>
          <div style={{ width: 60, height: 60, borderRadius: 30, margin: '0 auto 14px', background: accent, boxShadow: `0 5px 0 ${accent}99`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 30 }}>{tone === 'win' ? '🎉' : tone === 'lose' ? '🌀' : '⏸'}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 24, color: '#5B4636', lineHeight: 1.1 }}>{title}</div>
          {body && <div style={{ fontFamily: 'var(--font-body,sans-serif)', fontSize: 15, color: '#9B886F', marginTop: 8, lineHeight: 1.4 }}>{body}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>{actions}</div>
        </div>
      </div>
    );
  }
  function BigButton({ children, onClick, tone }) {
    const bg = tone === 'ghost' ? '#F4E9D8' : tone === 'gravity' ? '#7E6CF0' : '#FF9F68';
    const edge = tone === 'ghost' ? '#E0D2BC' : tone === 'gravity' ? '#6353D6' : '#E97E45';
    const col = tone === 'ghost' ? '#5B4636' : '#fff';
    return (
      <button type="button" onClick={onClick} style={{ width: '100%', height: 52, border: 'none', borderRadius: 26, background: bg, color: col,
        boxShadow: `0 4px 0 ${edge}`, fontFamily: 'var(--font-display,sans-serif)', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>{children}</button>
    );
  }

  window.GJProtoUI = { BoardView, Tray, RotateButton, ComboPopup, Dialog, BigButton, CellArt };
})();
