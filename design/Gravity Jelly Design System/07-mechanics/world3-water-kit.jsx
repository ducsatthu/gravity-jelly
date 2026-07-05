/* world3-water-kit.jsx — cơ chế "Dòng chảy / Nguồn nước" của World 3 (Sông & Thác).
   Documentation kit (no .d.ts → stays out of the bundle). Renders three
   landscape design-spec sheets. Reuses JellyBlock from the DS bundle so jelly
   stays 100% on-brand; the water cells are new tiles built from tokens + simple
   shapes only.

   A sheet HTML loads: _ds_bundle.js → world3-water-kit.jsx, then calls
   GJWater.render('<id>', rootEl).  ids: 'components' | 'stateflow' | 'tutorial'. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { JellyBlock } = NS;

  /* ---- water palette (teal ramp, harmonises with mint/aqua jelly) ---- */
  const AQ = {
    deep: '#12959F', teal: '#2FBFC7', mid: '#5FD2D6', light: '#9FE4E7',
    pale: '#D6F2F3', core: '#F1FCFC', edge: '#158A93', foam: '#EAFBFB',
    dry: '#C4BBAC', dryEdge: '#A89A82', dryDark: '#8A7E68',
  };
  const CODE = { Y: 'yellow', M: 'mint', P: 'pink', B: 'blue', S: 'stone' };
  const PURPLE = '#7E6CF0', PURPLE_EDGE = '#6353D6', PURPLE_SHINE = '#A99CF6';

  /* ---- one-time keyframes ---- */
  if (!document.getElementById('gj-water-css')) {
    const s = document.createElement('style');
    s.id = 'gj-water-css';
    s.textContent = `
      @keyframes gjwSource { 0%,100%{ box-shadow:0 0 0 3px ${AQ.core}, 0 0 12px 2px rgba(47,191,199,.6);} 50%{ box-shadow:0 0 0 4px ${AQ.core}, 0 0 20px 5px rgba(47,191,199,.85);} }
      @keyframes gjwNew { 0%,100%{ box-shadow:0 0 0 2px ${AQ.foam}, 0 0 10px 1px rgba(95,210,214,.6); transform:scale(1);} 50%{ box-shadow:0 0 0 3px ${AQ.foam}, 0 0 16px 3px rgba(95,210,214,.9); transform:scale(1.04);} }
      @keyframes gjwRing { 0%,100%{ transform:scale(1); opacity:.85;} 50%{ transform:scale(1.14); opacity:.35;} }
      @keyframes gjwArrow { 0%,100%{ opacity:.55;} 50%{ opacity:1;} }
      @keyframes gjwBob { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-3px);} }
      @keyframes gjwSpin { to { transform:rotate(360deg);} }
      @keyframes gjwSpark { 0%,100%{ transform:scale(.4) rotate(0); opacity:0;} 50%{ transform:scale(1) rotate(40deg); opacity:1;} }
      @keyframes gjwWaveShift { to { transform:translateX(-50%);} }
      @keyframes gjwWaveShiftV { to { transform:translateY(-50%);} }
      @keyframes gjwArrowMarch { from { background-position-x:0;} to { background-position-x:24px;} }
      @keyframes gjwTipGlow { 0%,100%{ opacity:.5; transform:scale(1);} 50%{ opacity:1; transform:scale(1.08);} }
      @keyframes gjwDash { to { stroke-dashoffset:-40;} }
      @media (prefers-reduced-motion: reduce){ [class^="gjw-"]{ animation:none !important; } }
    `;
    document.head.appendChild(s);
  }

  const font = { d: 'var(--font-display)', b: 'var(--font-body)' };
  const rot = { '→': 0, '↓': 90, '←': 180, '↑': -90 };

  /* =================== small parts =================== */

  function Drop({ size = 20, fill = AQ.teal, stroke = AQ.edge, shine = true }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 2.5C12 2.5 4.5 11.4 4.5 16.2A7.5 7.5 0 0 0 19.5 16.2C19.5 11.4 12 2.5 12 2.5Z"
          fill={fill} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
        {shine && <path d="M9 14.2a3.4 3.4 0 0 0 1.7 2.7" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".8" />}
      </svg>
    );
  }

  function Arrow({ dir = '→', size = 22, color = '#fff', sw = 2.6, className }) {
    return (
      <span className={className} style={{ display: 'inline-flex', transform: `rotate(${rot[dir]}deg)`, color }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h13M12 6l6 6-6 6" />
        </svg>
      </span>
    );
  }

  function Foam({ cell, dir }) {
    // two small foam bubbles at the leading (downstream) edge
    const at = { '→': { right: 3, top: '50%' }, '←': { left: 3, top: '50%' }, '↑': { top: 3, left: '50%' }, '↓': { bottom: 3, left: '50%' } }[dir];
    const b = { position: 'absolute', borderRadius: '50%', background: AQ.foam, opacity: .9 };
    return (
      <React.Fragment>
        <span style={{ ...b, width: cell * .1, height: cell * .1, ...at, transform: 'translate(-50%,-50%)' }} />
        <span style={{ ...b, width: cell * .07, height: cell * .07, ...at, transform: `translate(${dir === '→' ? '-160%' : dir === '←' ? '60%' : '-50%'}, ${dir === '↑' || dir === '↓' ? (dir === '↑' ? '60%' : '-160%') : '-190%'})`, opacity: .7 }} />
      </React.Fragment>
    );
  }

  /* =================== water cells =================== */

  function WaterCell({ type, dir = '→', cell = 88 }) {
    const radius = Math.round(cell * 0.24);
    const base = { width: cell, height: cell, borderRadius: radius, position: 'relative', boxSizing: 'border-box', overflow: 'hidden' };

    if (type === 'source') {
      return (
        <div style={{ position: 'relative', width: cell, height: cell }}>
          <div className="gjw-src" style={{ ...base, background: `radial-gradient(circle at 50% 42%, ${AQ.mid} 0%, ${AQ.teal} 46%, ${AQ.deep} 100%)`, boxShadow: `0 0 0 3px ${AQ.core}, 0 0 14px 3px rgba(47,191,199,.7)`, animation: 'gjwSource 1.9s var(--ease-inout,ease) infinite' }}>
            {/* concentric ripple rings around the spring mouth */}
            <span style={{ position: 'absolute', left: '50%', top: '46%', width: cell * .6, height: cell * .6, marginLeft: -cell * .3, marginTop: -cell * .3, borderRadius: '50%', border: `2px solid rgba(255,255,255,.5)`, animation: 'gjwRing 2s ease infinite' }} />
            <span style={{ position: 'absolute', left: '50%', top: '46%', width: cell * .34, height: cell * .34, marginLeft: -cell * .17, marginTop: -cell * .17, borderRadius: '50%', background: `radial-gradient(circle, ${AQ.core} 0%, ${AQ.light} 78%)`, boxShadow: `inset 0 1px 2px rgba(18,149,159,.4)` }} />
            {/* splash dots */}
            <span style={{ position: 'absolute', top: cell * .1, left: '30%', width: cell * .08, height: cell * .08, borderRadius: '50%', background: AQ.foam }} />
            <span style={{ position: 'absolute', top: cell * .16, left: '64%', width: cell * .06, height: cell * .06, borderRadius: '50%', background: AQ.foam, opacity: .85 }} />
            {/* outward flow arrow */}
            <span style={{ position: 'absolute', ...(dir === '→' ? { right: 3, top: '50%', transform: 'translateY(-50%)' } : dir === '↓' ? { bottom: 3, left: '50%', transform: 'translateX(-50%)' } : dir === '←' ? { left: 3, top: '50%', transform: 'translateY(-50%)' } : { top: 3, left: '50%', transform: 'translateX(-50%)' }) }}>
              <Arrow dir={dir} size={cell * .3} color="#fff" sw={3} className="gjw-arr" />
            </span>
          </div>
          {/* prominent drop badge — marks this as the breakable source */}
          <div style={{ position: 'absolute', top: -cell * .14, left: '50%', transform: 'translateX(-50%)', width: cell * .42, height: cell * .42, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            <Drop size={cell * .3} />
          </div>
        </div>
      );
    }

    if (type === 'flow' || type === 'new') {
      const isNew = type === 'new';
      return (
        <div className={isNew ? 'gjw-new' : ''} style={{ ...base, background: `linear-gradient(135deg, ${AQ.light} 0%, ${AQ.mid} 100%)`, boxShadow: isNew ? `0 0 0 2px ${AQ.foam}, 0 0 12px 2px rgba(95,210,214,.7)` : 'inset 0 1px 3px rgba(18,149,159,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: isNew ? 'gjwNew 1.5s var(--ease-inout,ease) infinite' : 'none' }}>
          <Arrow dir={dir} size={cell * .42} color={AQ.deep} sw={3.2} />
          <Foam cell={cell} dir={dir} />
          {isNew && (
            <svg width={cell * .3} height={cell * .3} viewBox="0 0 24 24" style={{ position: 'absolute', top: cell * .06, right: cell * .06, animation: 'gjwSpark 1.4s ease infinite' }}>
              <path d="M12 0c1 6 4 9 12 12-8 3-11 6-12 12-1-6-4-9-12-12 8-3 11-6 12-12z" fill={AQ.foam} />
            </svg>
          )}
        </div>
      );
    }

    if (type === 'drop') {
      return (
        <div style={{ ...base, background: `radial-gradient(circle at 50% 45%, ${AQ.pale} 0%, ${AQ.light} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ position: 'absolute', width: cell * .72, height: cell * .72, borderRadius: '50%', border: `2px dashed ${AQ.deep}`, animation: 'gjwRing 1.7s ease infinite' }} />
          <div style={{ animation: 'gjwBob 1.9s var(--ease-inout,ease) infinite', filter: 'drop-shadow(0 2px 2px rgba(18,149,159,.35))' }}>
            <Drop size={cell * .56} fill={AQ.teal} stroke={AQ.edge} />
          </div>
        </div>
      );
    }

    if (type === 'broken') {
      return (
        <div style={{ position: 'relative', width: cell, height: cell }}>
          <div style={{ ...base, background: `linear-gradient(160deg, ${AQ.dry} 0%, #B3A48C 100%)`, boxShadow: 'inset 0 2px 5px rgba(120,92,52,.24)' }}>
            {/* dried, cracked spring mouth */}
            <span style={{ position: 'absolute', left: '50%', top: '48%', width: cell * .3, height: cell * .3, marginLeft: -cell * .15, marginTop: -cell * .15, borderRadius: '50%', background: '#9C8E77', boxShadow: 'inset 0 1px 2px rgba(74,53,38,.4)' }} />
            <svg width={cell} height={cell} viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }} fill="none" stroke={AQ.dryDark} strokeWidth="2.4" strokeLinecap="round">
              <path d="M50 50 L28 30 M50 50 L74 34 M50 50 L40 78 M50 50 L70 70" opacity=".7" />
            </svg>
          </div>
          {/* cracked / gone drop badge */}
          <div style={{ position: 'absolute', top: -cell * .14, left: '50%', transform: 'translateX(-50%)', width: cell * .42, height: cell * .42, borderRadius: '50%', background: '#EDE5D8', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3, opacity: .8 }}>
            <svg width={cell * .3} height={cell * .3} viewBox="0 0 24 24">
              <path d="M12 2.5C12 2.5 4.5 11.4 4.5 16.2A7.5 7.5 0 0 0 19.5 16.2C19.5 11.4 12 2.5 12 2.5Z" fill="#D9CFBE" stroke={AQ.dryEdge} strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M12 5 L11 12 L13.5 12 L11.5 19" fill="none" stroke={AQ.dryDark} strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      );
    }

    // empty
    return <div style={{ width: cell, height: cell, borderRadius: 'var(--radius-md)', background: 'var(--color-cell-empty)', boxShadow: 'inset 0 0 0 1px var(--color-cell-line)' }} />;
  }

  /* =================== board (9×9 etc.) =================== */

  function WaterBoard({ rows, dir = '→', cell = 20, gap = 3, pad = 8, jellyDir = 'down', fade = [], newAt = [], trail = [], splash = null }) {
    const grid = rows.map((s) => s.split(''));
    const cols = grid[0].length, N = grid.length;
    const K = (r, c) => r + ',' + c;
    const fadeSet = new Set(fade.map(([r, c]) => K(r, c)));
    const newSet = new Set(newAt.map(([r, c]) => K(r, c)));
    const trailSet = new Set(trail.map(([r, c]) => K(r, c)));
    const W = pad * 2 + cols * cell + (cols - 1) * gap;
    const H = pad * 2 + N * cell + (N - 1) * gap;

    const node = (r, c) => {
      const ch = grid[r][c];
      const faded = fadeSet.has(K(r, c));
      let inner;
      if (ch === '.') inner = <WaterCell type="empty" cell={cell} />;
      else if (ch === 'S') inner = <WaterCell type="source" dir={dir} cell={cell} />;
      else if (ch === 's') inner = <WaterCell type={newSet.has(K(r, c)) ? 'new' : 'flow'} dir={dir} cell={cell} />;
      else if (ch === 'd') inner = <WaterCell type="drop" cell={cell} />;
      else if (ch === 'x') inner = <WaterCell type="broken" cell={cell} />;
      else inner = <JellyBlock color={CODE[ch] || 'yellow'} size={cell} direction={jellyDir} showEyes={cell >= 18} />;
      return (
        <div style={{ position: 'relative', width: cell, height: cell, opacity: faded ? 0.32 : 1, transition: 'opacity .3s' }}>
          {inner}
          {trailSet.has(K(r, c)) && (
            <span style={{ position: 'absolute', top: '50%', left: -cell * .5, transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <Arrow dir={dir} size={cell * .8} color={AQ.deep} sw={3} className="gjw-arr" />
            </span>
          )}
        </div>
      );
    };

    return (
      <div style={{ position: 'relative', width: W, height: H }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gridAutoRows: `${cell}px`, gap, padding: pad, background: 'var(--color-surface-sunken)', borderRadius: 16, boxShadow: 'inset 0 2px 6px rgba(120,92,52,.12)' }}>
          {grid.map((row, r) => row.map((_, c) => <React.Fragment key={r + '-' + c}>{node(r, c)}</React.Fragment>))}
        </div>
        {splash && (() => {
          const x = pad + splash[1] * (cell + gap) + cell / 2, y = pad + splash[0] * (cell + gap) + cell / 2;
          return (
            <svg width={cell * 2.4} height={cell * 2.4} viewBox="0 0 60 60" style={{ position: 'absolute', left: x - cell * 1.2, top: y - cell * 1.2, pointerEvents: 'none' }}>
              {[0, 60, 120, 180, 240, 300].map((a) => {
                const rad = a * Math.PI / 180;
                return <circle key={a} cx={30 + Math.cos(rad) * 17} cy={30 + Math.sin(rad) * 17} r={a % 120 === 0 ? 3.4 : 2.4} fill={AQ.mid} opacity=".85" />;
              })}
            </svg>
          );
        })()}
      </div>
    );
  }

  /* =================== horizontal flow strip (push demos) =================== */

  function WaterStrip({ cells, dir = '→', jelly = [], ghost = [], bracket = null, cell = 52, gap = 4, arrow = true }) {
    // cells: array of 'S'|'s'|'n' ; jelly: [{color, index}] sat on top of a cell
    const stride = cell + gap;
    const W = cells.length * cell + (cells.length - 1) * gap;
    return (
      <div style={{ position: 'relative', width: W, height: cell + 14, display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', gap }}>
          {cells.map((ch, i) => (
            <WaterCell key={i} type={ch === 'S' ? 'source' : ch === 'n' ? 'new' : 'flow'} dir={dir} cell={cell} />
          ))}
        </div>
        {/* ghost trail (previous position of a pushed jelly) */}
        {ghost.map((g, i) => (
          <div key={'g' + i} style={{ position: 'absolute', left: g.index * stride, bottom: 0, opacity: .28 }}>
            <JellyBlock color={g.color} size={cell} direction="down" showEyes={false} />
          </div>
        ))}
        {/* jelly sitting on the flow */}
        {jelly.map((j, i) => (
          <div key={'j' + i} style={{ position: 'absolute', left: j.index * stride, bottom: 0 }}>
            <JellyBlock color={j.color} size={cell} direction="down" expression="focus" />
          </div>
        ))}
        {/* cluster bracket */}
        {bracket && (
          <div style={{ position: 'absolute', top: -12, left: bracket[0] * stride, width: (bracket[1] - bracket[0]) * stride + cell, height: 8, borderTop: `3px solid ${AQ.deep}`, borderLeft: `3px solid ${AQ.deep}`, borderRight: `3px solid ${AQ.deep}`, borderRadius: '6px 6px 0 0' }} />
        )}
        {arrow && (
          <span style={{ position: 'absolute', right: -34, top: '46%', transform: 'translateY(-50%)' }}>
            <Arrow dir={dir} size={30} color={AQ.deep} sw={3.4} className="gjw-arr" />
          </span>
        )}
      </div>
    );
  }

  /* =================== chrome =================== */

  function SheetHead({ title, subtitle }) {
    return (
      <header style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 46, height: 46, borderRadius: 14, background: `linear-gradient(160deg, ${AQ.mid}, ${AQ.deep})`, boxShadow: `0 0 0 3px ${AQ.core}, var(--shadow-md)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Drop size={26} fill="#fff" stroke={AQ.pale} />
          </span>
          <div>
            <h1 style={{ margin: 0, fontFamily: font.d, fontWeight: 700, fontSize: 34, lineHeight: 1.02, color: 'var(--color-text)', letterSpacing: '-.01em', whiteSpace: 'nowrap' }}>{title}</h1>
            <p style={{ margin: '4px 0 0', fontFamily: font.b, fontWeight: 700, fontSize: 15, color: AQ.deep, letterSpacing: '.02em' }}>{subtitle}</p>
          </div>
        </div>
      </header>
    );
  }

  function Card({ title, note, children, style = {} }) {
    return (
      <div style={{ background: 'var(--color-surface)', borderRadius: 20, boxShadow: 'var(--shadow-md)', padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, ...style }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>{children}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span style={{ fontFamily: font.d, fontWeight: 700, fontSize: 15, color: 'var(--color-text)', textAlign: 'center', lineHeight: 1.15 }}>{title}</span>
          {note && <span style={{ fontFamily: font.b, fontWeight: 700, fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.3, maxWidth: 190 }}>{note}</span>}
        </div>
      </div>
    );
  }

  function StepChip({ n, tone = AQ.deep }) {
    return <span style={{ minWidth: 24, height: 24, padding: '0 7px', borderRadius: 999, background: tone, color: '#fff', fontFamily: font.d, fontWeight: 800, fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>;
  }

  function Legend({ items }) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, background: 'var(--color-surface)', borderRadius: 16, boxShadow: 'var(--shadow-sm)', padding: '12px 16px' }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, paddingRight: 14, borderRight: i < items.length - 1 ? '1px solid var(--color-cell-line)' : 'none' }}>
            <div style={{ flexShrink: 0 }}>{it.swatch}</div>
            <span style={{ fontFamily: font.b, fontWeight: 700, fontSize: 12.5, color: 'var(--color-text)', lineHeight: 1.25, maxWidth: 200 }}><b style={{ color: AQ.deep }}>{it.k}</b> {it.v}</span>
          </div>
        ))}
      </div>
    );
  }

  function NoteRow({ notes }) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {notes.map((t, i) => (
          <div key={i} style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: 10, background: `color-mix(in srgb, ${AQ.pale} 60%, var(--color-surface))`, borderRadius: 14, padding: '12px 16px', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Drop size={16} /></span>
            <span style={{ fontFamily: font.b, fontWeight: 700, fontSize: 13, color: 'var(--color-text)', lineHeight: 1.3 }}>{t}</span>
          </div>
        ))}
      </div>
    );
  }

  function SheetShell({ w, children }) {
    return (
      <div style={{ width: w, boxSizing: 'border-box', background: `radial-gradient(120% 70% at 50% 0%, #FBFEFE 0%, var(--color-bg) 55%)`, padding: 32, display: 'flex', flexDirection: 'column', gap: 20, fontFamily: font.b, color: 'var(--color-text)' }}>
        {children}
      </div>
    );
  }

  function ObstaclePanel({ n, title, caption, children }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, alignSelf: 'stretch' }}>
          <StepChip n={n} tone={AQ.teal} />
          <span style={{ fontFamily: font.d, fontWeight: 700, fontSize: 15, color: 'var(--color-text)', lineHeight: 1.1 }}>{title}</span>
        </div>
        <div style={{ background: 'var(--color-surface-sunken)', borderRadius: 16, padding: 8 }}>{children}</div>
        <p style={{ margin: 0, fontFamily: font.b, fontWeight: 700, fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.35, maxWidth: 230 }}>{caption}</p>
      </div>
    );
  }

  /* legend swatches */
  const sw = {
    source: <WaterCell type="source" cell={34} />,
    flow: <WaterCell type="flow" cell={34} />,
    new: <WaterCell type="new" cell={34} />,
    drop: <WaterCell type="drop" cell={34} />,
    broken: <WaterCell type="broken" cell={34} />,
  };

  /* =================== SHEET 1 — component sheet =================== */

  function ComponentSheet() {
    return (
      <SheetShell w={1500}>
        <SheetHead title="WORLD 3 — CƠ CHẾ DÒNG CHẢY" subtitle="Nguồn nước · Dòng chảy · Ô giọt nước · Jelly bị đẩy" />

        {/* row A — the four core tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <Card title="Ô nguồn nước — ACTIVE" note="Sinh dòng chảy · badge giọt nước = có thể bị phá">
            <div style={{ padding: '10px 0 0' }}><WaterCell type="source" cell={96} /></div>
          </Card>
          <Card title="Ô dòng chảy thường" note="Nước lan ra từ nguồn · đẩy jelly theo mũi tên">
            <WaterCell type="flow" cell={96} />
          </Card>
          <Card title="Ô dòng chảy MỚI MỌC" note="Vừa tạo trong lượt này · viền sáng + lấp lánh">
            <WaterCell type="new" cell={96} />
          </Card>
          <Card title="Ô giọt nước (TARGET)" note="Clear qua ô này để PHÁ NGUỒN">
            <WaterCell type="drop" cell={96} />
          </Card>
        </div>

        {/* row B — broken + push demos + spread sequence */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.4fr 1.9fr', gap: 16, alignItems: 'stretch' }}>
          <Card title="Nguồn — BROKEN" note="Miệng nguồn khô, nứt · hết glow · badge vỡ">
            <div style={{ padding: '10px 0 0' }}><WaterCell type="broken" cell={96} /></div>
          </Card>

          <Card title="Jelly bị đẩy 1 ô" note="Jelly trên ô nước bị đẩy 1 ô theo hướng dòng chảy">
            <div style={{ padding: '4px 30px 0 0' }}>
              <WaterStrip cells={['s', 's', 's']} jelly={[{ color: 'pink', index: 2 }]} ghost={[{ color: 'pink', index: 1 }]} cell={52} />
            </div>
          </Card>

          <Card title="Cụm dính nhau trôi cùng" note="Cả cụm jelly dính nhau trôi cùng nhau theo dòng">
            <div style={{ padding: '10px 30px 0 0' }}>
              <WaterStrip cells={['s', 's', 's', 's']} jelly={[{ color: 'mint', index: 1 }, { color: 'yellow', index: 2 }, { color: 'blue', index: 3 }]} ghost={[{ color: 'mint', index: 0 }, { color: 'yellow', index: 1 }, { color: 'blue', index: 2 }]} bracket={[1, 3]} cell={48} />
            </div>
          </Card>

          <Card title="Nguồn lan rộng mỗi lượt" note="Mỗi lượt, dòng chảy mọc thêm đúng 1 ô theo mũi tên">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {[['S', 's'], ['S', 's', 'n'], ['S', 's', 's', 'n']].map((cells, i) => (
                <React.Fragment key={i}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <WaterStrip cells={cells} newAt={[]} cell={34} arrow={false} />
                    <span style={{ fontFamily: font.b, fontWeight: 800, fontSize: 10.5, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Lượt {i + 1}</span>
                  </div>
                  {i < 2 && <Arrow dir="→" size={22} color={AQ.deep} sw={3} />}
                </React.Fragment>
              ))}
            </div>
          </Card>
        </div>

        <NoteRow notes={[
          'Nguồn nước tạo thêm 1 ô dòng chảy mỗi lượt.',
          'Nguồn chỉ bị phá khi clear qua ô giọt nước.',
          'Phá nguồn thì toàn bộ dòng chảy do nguồn đó tạo ra sẽ tắt.',
        ]} />
      </SheetShell>
    );
  }

  /* =================== SHEET 2 — state flow =================== */

  // 9×9 board strings; row 4 is the flow lane, source near left col 1, drop objective on source
  const bRow = (fill) => fill; // helper readability
  function stateBoards() {
    const empty = '.........';
    const lane = (n) => {
      // source at col1 + n flow cells to the right on row index 4
      let s = 'S'.padEnd(1) + 's'.repeat(n);
      s = ('.' + s).padEnd(9, '.'); // col0 empty, source col1
      return s;
    };
    return {
      f1: ['.........', '.........', '.........', '.........', lane(0), '.........', '.........', '.........', '.........'],
      f2: ['.........', '.........', '.........', '.........', lane(1), '.........', '.........', '.........', '.........'],
      f3: ['.........', '.........', '.........', '.........', lane(2), '.........', '.........', '.........', '.........'],
      f4: ['.........', '.........', '.........', '.........', lane(3), '.........', '.........', '.........', '.........'],
      f5: ['.........', '.........', '.........', '.........', '.x' + 'ssss'.slice(0, 3) + '...', '.........', '.........', '.........', '.........'],
    };
  }

  function Frame({ n, label, board, dropOnSource, faded, newAt, splash }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StepChip n={n} />
          <span style={{ fontFamily: font.d, fontWeight: 700, fontSize: 15, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{label}</span>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 18, boxShadow: 'var(--shadow-md)', padding: 10, position: 'relative' }}>
          <WaterBoard rows={board} dir="→" cell={20} gap={3} pad={7} fade={faded || []} newAt={newAt || []} splash={splash || null} />
          {dropOnSource && (
            <span style={{ position: 'absolute', left: 10 + 7 + 1 * 23 + 10, top: 10 + 7 + 4 * 23 - 12, zIndex: 5 }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Drop size={18} /></span>
            </span>
          )}
        </div>
      </div>
    );
  }

  function StateFlowSheet() {
    const B = stateBoards();
    return (
      <SheetShell w={1580}>
        <SheetHead title="STATE FLOW — NGUỒN NƯỚC MỌC DẦN" subtitle="Mỗi lượt tạo thêm 1 ô theo hướng đẩy" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          {[
            { n: 1, label: 'Khởi tạo', board: B.f1 },
            { n: 2, label: 'Sau 1 lượt', board: B.f2, newAt: [[4, 2]] },
            { n: 3, label: 'Sau 2 lượt', board: B.f3, newAt: [[4, 3]] },
            { n: 4, label: 'Sau 3 lượt', board: B.f4, newAt: [[4, 4]] },
            { n: 5, label: 'Phá nguồn', board: B.f5, faded: [[4, 2], [4, 3], [4, 4]], splash: [4, 1] },
          ].map((fr, i) => (
            <React.Fragment key={fr.n}>
              <Frame {...fr} />
              {i < 4 && <Arrow dir="→" size={26} color={AQ.deep} sw={3.4} className="gjw-arr" />}
            </React.Fragment>
          ))}
        </div>

        {/* two sub illustrations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card title="A · Jelly bị đẩy" note="1 jelly trên ô dòng chảy bị đẩy 1 ô theo mũi tên" style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 24 }}>
            <div style={{ padding: '4px 34px 0 6px' }}>
              <WaterStrip cells={['s', 's', 's']} jelly={[{ color: 'pink', index: 2 }]} ghost={[{ color: 'pink', index: 1 }]} cell={54} />
            </div>
          </Card>
          <Card title="B · Cụm jelly bị đẩy" note="2–3 jelly dính nhau bị đẩy đồng thời, trôi cùng nhau" style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 24 }}>
            <div style={{ padding: '10px 34px 0 6px' }}>
              <WaterStrip cells={['s', 's', 's', 's']} jelly={[{ color: 'mint', index: 1 }, { color: 'yellow', index: 2 }, { color: 'blue', index: 3 }]} ghost={[{ color: 'mint', index: 0 }, { color: 'yellow', index: 1 }, { color: 'blue', index: 2 }]} bracket={[1, 3]} cell={48} />
            </div>
          </Card>
        </div>

        <Legend items={[
          { swatch: sw.source, k: 'Ô nguồn nước', v: '= sinh dòng chảy' },
          { swatch: sw.flow, k: 'Ô dòng chảy', v: '= đẩy jelly 1 ô' },
          { swatch: sw.drop, k: 'Ô giọt nước', v: '= clear để phá nguồn' },
          { swatch: sw.broken, k: 'Phá nguồn', v: '= tắt toàn bộ dòng chảy' },
        ]} />
      </SheetShell>
    );
  }

  /* =================== SHEET 3 — mini tutorial =================== */

  function Panel({ n, title, caption, children }) {
    return (
      <div style={{ background: 'var(--color-surface)', borderRadius: 22, boxShadow: 'var(--shadow-md)', padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, alignSelf: 'stretch' }}>
          <StepChip n={n} tone={AQ.teal} />
          <span style={{ fontFamily: font.d, fontWeight: 700, fontSize: 16, color: 'var(--color-text)', lineHeight: 1.1 }}>{title}</span>
        </div>
        <div style={{ position: 'relative' }}>{children}</div>
        <p style={{ margin: 0, fontFamily: font.b, fontWeight: 700, fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.35, maxWidth: 260 }}>{caption}</p>
      </div>
    );
  }

  function tutBoard(n, extra = {}) {
    // 9×9, source col1 row4, n flow cells; optional jelly & drop overlays via extra rows
    let lane = '.S' + 's'.repeat(n);
    lane = lane.padEnd(9, '.');
    const rows = ['.........', '.........', '.........', '.........', lane, '.........', '.........', '.........', '.........'];
    if (extra.rows) extra.rows.forEach(([r, s]) => { rows[r] = s; });
    return rows;
  }

  function DropBadgeOnSource() {
    return (
      <span style={{ position: 'absolute', left: 10 + 7 + 1 * 25 + 12, top: 10 + 7 + 4 * 25 - 14, zIndex: 5 }}>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Drop size={19} /></span>
      </span>
    );
  }

  function TutorialSheet() {
    const cell = 22, gap = 3, pad = 7;
    return (
      <SheetShell w={1520}>
        <SheetHead title="CƠ CHẾ MỚI — NGUỒN NƯỚC" subtitle="Dòng chảy mọc dần · Đẩy jelly · Phá nguồn bằng ô giọt nước" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <Panel n={1} title="Nguồn nước xuất hiện" caption="Nguồn nước tạo dòng chảy — mũi tên chỉ hướng nước lan ra.">
            <WaterBoard rows={tutBoard(1)} dir="→" cell={cell} gap={gap} pad={pad} />
            <DropBadgeOnSource />
          </Panel>

          <Panel n={2} title="Nước mọc thêm 1 ô" caption="Mỗi lượt, dòng chảy mọc thêm đúng 1 ô theo mũi tên.">
            <WaterBoard rows={tutBoard(2, { rows: [[3, '.....M...']] })} dir="→" cell={cell} gap={gap} pad={pad} newAt={[[4, 3]]} />
            <DropBadgeOnSource />
          </Panel>

          <Panel n={3} title="Jelly bị đẩy" caption="Jelly đứng trên ô nước sẽ bị đẩy 1 ô — cụm dính trôi cùng nhau.">
            <WaterBoard rows={tutBoard(3, { rows: [[4, '.SssPY..']] })} dir="→" cell={cell} gap={gap} pad={pad} trail={[[4, 4], [4, 5]]} />
            <DropBadgeOnSource />
          </Panel>

          <Panel n={4} title="Phá nguồn" caption="Clear qua ô giọt nước để phá nguồn — cả dòng chảy tắt theo.">
            <WaterBoard rows={['.........', '.........', '.........', '.........', '.xsss....', '.........', '.........', '.........', '.........']} dir="→" cell={cell} gap={gap} pad={pad} fade={[[4, 2], [4, 3], [4, 4]]} splash={[4, 1]} />
          </Panel>
        </div>

        <Legend items={[
          { swatch: sw.source, k: 'Nguồn nước', v: '= sinh dòng chảy' },
          { swatch: sw.flow, k: 'Dòng chảy', v: '= đẩy jelly 1 ô' },
          { swatch: sw.new, k: 'Mỗi lượt', v: '= thêm 1 ô mới' },
          { swatch: sw.broken, k: 'Phá nguồn', v: '= tắt cả dòng chảy' },
        ]} />
      </SheetShell>
    );
  }

  /* =================== continuous stream renderer =================== */

  function wavePath(w, h, amp, wl, yOff) {
    let d = `M0 ${yOff}`;
    for (let x = 0; x <= w; x += wl / 2) {
      const dir = (x / (wl / 2)) % 2 === 0 ? 1 : -1;
      d += ` Q ${x + wl / 4} ${yOff - dir * amp} ${x + wl / 2} ${yOff}`;
    }
    return d;
  }

  function wavePathV(w, h, amp, wl, xOff) {
    let d = `M${xOff} 0`;
    for (let y = 0; y <= h; y += wl / 2) {
      const dir = (y / (wl / 2)) % 2 === 0 ? 1 : -1;
      d += ` Q ${xOff - dir * amp} ${y + wl / 4} ${xOff} ${y + wl / 2}`;
    }
    return d;
  }

  function WaterRibbon({ w, h, radius, tone = 'live', vertical = false, ring = true }) {
    const live = tone === 'live';
    const grad = !live
      ? (vertical ? `linear-gradient(90deg, #B3A48C, ${AQ.dry}, #B3A48C)` : `linear-gradient(180deg, ${AQ.dry} 0%, #B3A48C 100%)`)
      : (vertical ? `linear-gradient(90deg, ${AQ.teal} 0%, ${AQ.light} 50%, ${AQ.teal} 100%)` : `linear-gradient(180deg, ${AQ.light} 0%, ${AQ.mid} 55%, ${AQ.teal} 100%)`);
    const shadow = live ? `inset 0 2px 5px rgba(255,255,255,.5), inset 0 -3px 6px rgba(18,149,159,.4)${ring ? `, 0 0 0 2px ${AQ.core}` : ''}` : 'inset 0 2px 5px rgba(120,92,52,.3)';
    return (
      <div style={{ position: 'absolute', inset: 0, borderRadius: radius != null ? radius : h / 2, background: grad, overflow: 'hidden', boxShadow: shadow }}>
        {live && (vertical ? (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '200%', display: 'flex', flexDirection: 'column', animation: 'gjwWaveShiftV 2.4s linear infinite' }}>
            {[0, 1].map((k) => (
              <svg key={k} width={w} height="50%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
                <path d={wavePathV(w, h, w * 0.11, h * 0.5, w * 0.34)} fill="none" stroke="rgba(255,255,255,.62)" strokeWidth={Math.max(2, w * 0.05)} strokeLinecap="round" />
                <path d={wavePathV(w, h, w * 0.09, h * 0.42, w * 0.64)} fill="none" stroke="rgba(255,255,255,.38)" strokeWidth={Math.max(1.5, w * 0.04)} strokeLinecap="round" />
              </svg>
            ))}
          </div>
        ) : (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '100%', display: 'flex', animation: 'gjwWaveShift 2.4s linear infinite' }}>
            {[0, 1].map((k) => (
              <svg key={k} width="50%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
                <path d={wavePath(w, h, h * 0.1, w * 0.5, h * 0.32)} fill="none" stroke="rgba(255,255,255,.65)" strokeWidth={Math.max(2, h * 0.05)} strokeLinecap="round" />
                <path d={wavePath(w, h, h * 0.08, w * 0.42, h * 0.62)} fill="none" stroke="rgba(255,255,255,.4)" strokeWidth={Math.max(1.5, h * 0.04)} strokeLinecap="round" />
              </svg>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Board with ONE continuous water stream that flows along the CURRENT GRAVITY
  // direction (default ↓) and never changes. Cells are rounded SQUARES.
  // `lane` = fixed line index (col when vertical, row when horizontal);
  // `start` = source position on the moving axis; `len` = flow cells after source.
  function StreamBoard({ cols = 9, rows = 9, cell = 34, gap = 4, pad = 9, dir = '↓', lane = 4, start = 1, len = 0, newTip = false, broken = false, fadeFlow = false, splash = null, jelly = [], ghost = [], bracket = null }) {
    const stride = cell + gap;
    const vertical = dir === '↓' || dir === '↑';
    const W = pad * 2 + cols * cell + (cols - 1) * gap;
    const H = pad * 2 + rows * cell + (rows - 1) * gap;
    const cx = (c) => pad + c * stride + cell / 2;
    const cy = (r) => pad + r * stride + cell / 2;
    const cellR = Math.round(cell * 0.24);
    // center of a cell at moving-axis index p
    const px = (p) => (vertical ? cx(lane) : cx(p));
    const py = (p) => (vertical ? cy(p) : cy(lane));

    const total = len + 1;
    const L = total * cell + (total - 1) * gap + cell * 0.06;
    const cross = cell * 0.86;
    const ribStyle = vertical
      ? { left: cx(lane) - cross / 2, top: pad + start * stride - cell * 0.03, width: cross, height: L }
      : { left: pad + start * stride - cell * 0.03, top: cy(lane) - cross / 2, width: L, height: cross };
    const tip = start + len;
    // leading (downstream) edge point of the stream
    const lead = { '↓': { x: px(tip), y: py(tip) + cell * 0.36 }, '↑': { x: px(tip), y: py(tip) - cell * 0.36 }, '→': { x: px(tip) + cell * 0.36, y: py(tip) }, '←': { x: px(tip) - cell * 0.36, y: py(tip) } }[dir];

    return (
      <div style={{ position: 'relative', width: W, height: H }}>
        {/* empty board — rounded-square cells */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gridAutoRows: `${cell}px`, gap, padding: pad, background: 'var(--color-surface-sunken)', borderRadius: 16, boxShadow: 'inset 0 2px 6px rgba(120,92,52,.12)' }}>
          {Array.from({ length: cols * rows }).map((_, i) => (
            <div key={i} style={{ borderRadius: cellR, background: 'var(--color-cell-empty)', boxShadow: 'inset 0 0 0 1px var(--color-cell-line)' }} />
          ))}
        </div>

        {/* continuous water ribbon (rounded-square corners) */}
        {len > 0 && (
          <div style={{ position: 'absolute', ...ribStyle, opacity: fadeFlow ? 0.3 : 1, transition: 'opacity .3s' }}>
            <WaterRibbon w={ribStyle.width} h={ribStyle.height} radius={cellR} tone={broken ? 'dry' : 'live'} vertical={vertical} />
          </div>
        )}

        {/* marching arrows along the flow — one per flow cell, pointing with gravity */}
        {len > 0 && !broken && Array.from({ length: len }).map((_, k) => (
          <span key={'a' + k} style={{ position: 'absolute', left: px(start + 1 + k) - cell * 0.22, top: py(start + 1 + k) - cell * 0.22, zIndex: 3 }}>
            <Arrow dir={dir} size={cell * 0.44} color="#fff" sw={3} className="gjw-arr" />
          </span>
        ))}

        {/* leading foam at the tip */}
        {len > 0 && !broken && (
          <React.Fragment>
            <span style={{ position: 'absolute', left: lead.x - cell * 0.08, top: lead.y - cell * 0.08, width: cell * 0.16, height: cell * 0.16, borderRadius: '50%', background: AQ.foam, zIndex: 3 }} />
            <span style={{ position: 'absolute', left: lead.x + cell * 0.06, top: lead.y + cell * 0.05, width: cell * 0.1, height: cell * 0.1, borderRadius: '50%', background: AQ.foam, opacity: .8, zIndex: 3 }} />
          </React.Fragment>
        )}

        {/* new tip glow — the cell grown this turn (rounded square) */}
        {len > 0 && newTip && !broken && (
          <span style={{ position: 'absolute', left: px(tip) - cell * 0.55, top: py(tip) - cell * 0.55, width: cell * 1.1, height: cell * 1.1, borderRadius: cellR * 1.4, boxShadow: `0 0 0 2px ${AQ.foam}, 0 0 16px 4px rgba(95,210,214,.9)`, animation: 'gjwTipGlow 1.4s ease infinite', pointerEvents: 'none', zIndex: 4 }}>
            <svg width={cell * 0.42} height={cell * 0.42} viewBox="0 0 24 24" style={{ position: 'absolute', top: -cell * 0.14, right: -cell * 0.06, animation: 'gjwSpark 1.4s ease infinite' }}>
              <path d="M12 0c1 6 4 9 12 12-8 3-11 6-12 12-1-6-4-9-12-12 8-3 11-6 12-12z" fill={AQ.foam} />
            </svg>
          </span>
        )}

        {/* source hero cell — big spring mouth, rounded SQUARE */}
        <span style={{ position: 'absolute', left: px(start), top: py(start), transform: 'translate(-50%,-50%)', zIndex: 5 }}>
          <div style={{ position: 'relative', width: cell * 0.94, height: cell * 0.94 }}>
            {broken ? (
              <div style={{ width: '100%', height: '100%', borderRadius: cellR, background: 'radial-gradient(circle at 50% 45%, #9C8E77 0%, #8A7E68 100%)', boxShadow: 'inset 0 1px 3px rgba(74,53,38,.5)' }}>
                <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ position: 'absolute', inset: 0 }} fill="none" stroke={AQ.dryDark} strokeWidth="2" strokeLinecap="round">
                  <path d="M20 20 L9 10 M20 20 L31 12 M20 20 L15 33 M20 20 L30 30" opacity=".7" />
                </svg>
              </div>
            ) : (
              <React.Fragment>
                <div className="gjw-src" style={{ width: '100%', height: '100%', borderRadius: cellR, background: `radial-gradient(circle at 50% 42%, ${AQ.core} 0%, ${AQ.mid} 44%, ${AQ.deep} 100%)`, boxShadow: `0 0 0 3px ${AQ.core}, 0 0 14px 3px rgba(47,191,199,.7)`, animation: 'gjwSource 1.9s var(--ease-inout,ease) infinite' }} />
                <span style={{ position: 'absolute', left: '50%', top: '50%', width: '66%', height: '66%', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '2px solid rgba(255,255,255,.55)', animation: 'gjwRing 2s ease infinite' }} />
                <span style={{ position: 'absolute', left: '50%', top: '50%', width: '32%', height: '32%', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, ${AQ.core} 0%, ${AQ.light} 80%)` }} />
              </React.Fragment>
            )}
            {/* drop badge in the corner */}
            <span style={{ position: 'absolute', top: -cell * 0.18, right: -cell * 0.18, width: cell * 0.5, height: cell * 0.5, borderRadius: '50%', background: broken ? '#EDE5D8' : '#fff', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: broken ? 0.85 : 1 }}>
              {broken
                ? <svg width={cell * 0.32} height={cell * 0.32} viewBox="0 0 24 24"><path d="M12 2.5C12 2.5 4.5 11.4 4.5 16.2A7.5 7.5 0 0 0 19.5 16.2C19.5 11.4 12 2.5 12 2.5Z" fill="#D9CFBE" stroke={AQ.dryEdge} strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 5 L11 12 L13.5 12 L11.5 19" fill="none" stroke={AQ.dryDark} strokeWidth="1.6" strokeLinecap="round" /></svg>
                : <Drop size={cell * 0.34} />}
            </span>
          </div>
        </span>

        {/* jelly on the stream (+ ghost trail + cluster bracket), pushed WITH gravity */}
        {ghost.map((g, i) => (
          <span key={'g' + i} style={{ position: 'absolute', left: px(g.pos), top: py(g.pos), transform: 'translate(-50%,-50%)', opacity: 0.28, zIndex: 6 }}>
            <JellyBlock color={g.color} size={cell * 0.96} direction="down" showEyes={false} />
          </span>
        ))}
        {jelly.map((j, i) => (
          <span key={'j' + i} style={{ position: 'absolute', left: px(j.pos), top: py(j.pos), transform: 'translate(-50%,-50%)', zIndex: 7 }}>
            <JellyBlock color={j.color} size={cell * 0.96} direction="down" expression="focus" />
          </span>
        ))}
        {bracket && (vertical ? (
          <span style={{ position: 'absolute', left: px(bracket[0]) - cell * 0.72, top: py(bracket[0]) - cell * 0.5, width: cell * 0.18, height: (bracket[1] - bracket[0]) * stride + cell, borderLeft: `3px solid ${AQ.deep}`, borderTop: `3px solid ${AQ.deep}`, borderBottom: `3px solid ${AQ.deep}`, borderRadius: '7px 0 0 7px', zIndex: 8 }} />
        ) : (
          <span style={{ position: 'absolute', left: px(bracket[0]) - cell * 0.5, top: py(bracket[0]) - cell * 0.72, width: (bracket[1] - bracket[0]) * stride + cell, height: cell * 0.18, borderTop: `3px solid ${AQ.deep}`, borderLeft: `3px solid ${AQ.deep}`, borderRight: `3px solid ${AQ.deep}`, borderRadius: '7px 7px 0 0', zIndex: 8 }} />
        ))}

        {/* splash on break */}
        {splash && (
          <svg width={cell * 2.6} height={cell * 2.6} viewBox="0 0 60 60" style={{ position: 'absolute', left: cx(splash[1]) - cell * 1.3, top: cy(splash[0]) - cell * 1.3, pointerEvents: 'none', zIndex: 9 }}>
            {[0, 60, 120, 180, 240, 300].map((a) => {
              const rad = a * Math.PI / 180;
              return <circle key={a} cx={30 + Math.cos(rad) * 18} cy={30 + Math.sin(rad) * 18} r={a % 120 === 0 ? 3.6 : 2.6} fill={AQ.mid} opacity=".85" />;
            })}
          </svg>
        )}
      </div>
    );
  }

  // Water that follows an ORTHOGONAL PATH: it keeps falling with gravity, and
  // only when the cell below is blocked does it detour one cell left/right, then
  // resume falling. `path` = ordered cells [[r,c],…] (source first). Connected
  // square water tiles bend at each elbow.
  function StreamPath({ cols = 9, rows = 9, cell = 30, gap = 4, pad = 9, path = [], blocks = [], jelly = [], newTip = false, splash = null }) {
    const stride = cell + gap;
    const W = pad * 2 + cols * cell + (cols - 1) * gap;
    const H = pad * 2 + rows * cell + (rows - 1) * gap;
    const cx = (c) => pad + c * stride + cell / 2;
    const cy = (r) => pad + r * stride + cell / 2;
    const cellR = Math.round(cell * 0.24);
    const wsz = cell * 0.84;
    const segDir = (a, b) => (b[1] > a[1] ? '→' : b[1] < a[1] ? '←' : b[0] > a[0] ? '↓' : '↑');
    const cross = cell * 0.84;
    const dPath = path.length ? 'M' + path.map((p) => `${cx(p[1])} ${cy(p[0])}`).join(' L') : '';
    const gid = 'gjw-grad-' + path.map((p) => p.join('')).join('_');

    return (
      <div style={{ position: 'relative', width: W, height: H }}>
        {/* empty board */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gridAutoRows: `${cell}px`, gap, padding: pad, background: 'var(--color-surface-sunken)', borderRadius: 16, boxShadow: 'inset 0 2px 6px rgba(120,92,52,.12)' }}>
          {Array.from({ length: cols * rows }).map((_, i) => (
            <div key={i} style={{ borderRadius: cellR, background: 'var(--color-cell-empty)', boxShadow: 'inset 0 0 0 1px var(--color-cell-line)' }} />
          ))}
        </div>

        {/* ONE continuous water ribbon drawn as a single stroked path so the bend
            is a smooth rounded turn (reads as one flowing stream). */}
        {dPath && (
          <svg width={W} height={H} style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'visible' }}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={AQ.light} />
                <stop offset="0.55" stopColor={AQ.mid} />
                <stop offset="1" stopColor={AQ.teal} />
              </linearGradient>
            </defs>
            <path d={dPath} fill="none" stroke={AQ.core} strokeWidth={cross + 4} strokeLinejoin="round" strokeLinecap="round" />
            <path d={dPath} fill="none" stroke={`url(#${gid})`} strokeWidth={cross} strokeLinejoin="round" strokeLinecap="round" />
            {/* soft top shine + two marching highlights = flowing surface */}
            <path d={dPath} fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={cross * 0.42} strokeLinejoin="round" strokeLinecap="round" opacity=".35" />
            <path d={dPath} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth={cross * 0.14} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${cell * 0.5} ${cell * 0.65}`} style={{ animation: 'gjwDash 1.1s linear infinite' }} />
            <path d={dPath} fill="none" stroke="rgba(255,255,255,.4)" strokeWidth={cross * 0.09} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${cell * 0.35} ${cell * 0.85}`} style={{ animation: 'gjwDash 1.7s linear infinite' }} />
          </svg>
        )}

        {/* obstruction blocks */}
        {blocks.map((bl, i) => (
          <span key={'bl' + i} style={{ position: 'absolute', left: cx(bl.pos[1]), top: cy(bl.pos[0]), transform: 'translate(-50%,-50%)', zIndex: 6 }}>
            <JellyBlock color={bl.color || 'stone'} size={cell * 0.96} direction="down" showEyes={bl.color !== 'stone'} />
          </span>
        ))}

        {/* flow arrows along the ribbon + new-tip glow (skip source cell) */}
        {path.slice(1).map((p, i) => {
          const idx = i + 1;
          const dir = idx < path.length - 1 ? segDir(path[idx], path[idx + 1]) : segDir(path[idx - 1], path[idx]);
          const isNew = newTip && idx === path.length - 1;
          return (
            <React.Fragment key={'a' + idx}>
              {isNew && <span style={{ position: 'absolute', left: cx(p[1]) - cell * 0.55, top: cy(p[0]) - cell * 0.55, width: cell * 1.1, height: cell * 1.1, borderRadius: cellR * 1.4, boxShadow: `0 0 0 2px ${AQ.foam}, 0 0 14px 3px rgba(95,210,214,.85)`, animation: 'gjwTipGlow 1.4s ease infinite', pointerEvents: 'none', zIndex: 4 }} />}
              <span style={{ position: 'absolute', left: cx(p[1]), top: cy(p[0]), transform: 'translate(-50%,-50%)', zIndex: 4 }}>
                <Arrow dir={dir} size={cell * 0.42} color="#fff" sw={3} className="gjw-arr" />
              </span>
              {isNew && <svg width={cell * 0.36} height={cell * 0.36} viewBox="0 0 24 24" style={{ position: 'absolute', left: cx(p[1]) + cell * 0.2, top: cy(p[0]) - cell * 0.5, animation: 'gjwSpark 1.4s ease infinite', zIndex: 4 }}><path d="M12 0c1 6 4 9 12 12-8 3-11 6-12 12-1-6-4-9-12-12 8-3 11-6 12-12z" fill={AQ.foam} /></svg>}
            </React.Fragment>
          );
        })}

        {/* source hero (rounded square) */}
        {path.length > 0 && (
          <span style={{ position: 'absolute', left: cx(path[0][1]), top: cy(path[0][0]), transform: 'translate(-50%,-50%)', zIndex: 5 }}>
            <div style={{ position: 'relative', width: cell * 0.94, height: cell * 0.94 }}>
              <div className="gjw-src" style={{ width: '100%', height: '100%', borderRadius: cellR, background: `radial-gradient(circle at 50% 42%, ${AQ.core} 0%, ${AQ.mid} 44%, ${AQ.deep} 100%)`, boxShadow: `0 0 0 3px ${AQ.core}, 0 0 14px 3px rgba(47,191,199,.7)`, animation: 'gjwSource 1.9s var(--ease-inout,ease) infinite' }} />
              <span style={{ position: 'absolute', left: '50%', top: '50%', width: '66%', height: '66%', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '2px solid rgba(255,255,255,.55)', animation: 'gjwRing 2s ease infinite' }} />
              <span style={{ position: 'absolute', left: '50%', top: '50%', width: '32%', height: '32%', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, ${AQ.core} 0%, ${AQ.light} 80%)` }} />
              <span style={{ position: 'absolute', top: -cell * 0.18, right: -cell * 0.18, width: cell * 0.5, height: cell * 0.5, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Drop size={cell * 0.34} /></span>
            </div>
          </span>
        )}

        {/* jelly riding the stream */}
        {jelly.map((j, i) => (
          <span key={'j' + i} style={{ position: 'absolute', left: cx(j.pos[1]), top: cy(j.pos[0]), transform: 'translate(-50%,-50%)', zIndex: 7 }}>
            <JellyBlock color={j.color} size={cell * 0.96} direction="down" expression="focus" />
          </span>
        ))}

        {splash && (
          <svg width={cell * 2.4} height={cell * 2.4} viewBox="0 0 60 60" style={{ position: 'absolute', left: cx(splash[1]) - cell * 1.2, top: cy(splash[0]) - cell * 1.2, pointerEvents: 'none', zIndex: 9 }}>
            {[0, 60, 120, 180, 240, 300].map((a) => { const r = a * Math.PI / 180; return <circle key={a} cx={30 + Math.cos(r) * 17} cy={30 + Math.sin(r) * 17} r={a % 120 === 0 ? 3.4 : 2.4} fill={AQ.mid} opacity=".85" />; })}
          </svg>
        )}
      </div>
    );
  }

  /* =================== SHEET 2b — state flow (continuous stream) =================== */
  function StreamFrame({ n, label, len, newTip, broken, fadeFlow, splash, cell }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <StepChip n={n} />
          <span style={{ fontFamily: font.d, fontWeight: 700, fontSize: 16, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{label}</span>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 20, boxShadow: 'var(--shadow-md)', padding: 12 }}>
          <StreamBoard cell={cell} dir="↓" lane={4} start={1} len={len} newTip={newTip} broken={broken} fadeFlow={fadeFlow} splash={splash} />
        </div>
      </div>
    );
  }

  function GravityPill() {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px 7px 10px', borderRadius: 999, background: `color-mix(in srgb, ${PURPLE} 14%, #fff)`, boxShadow: 'var(--shadow-sm)', alignSelf: 'flex-start' }}>
        <span style={{ width: 26, height: 26, borderRadius: 8, background: `linear-gradient(160deg, ${PURPLE_SHINE}, ${PURPLE})`, boxShadow: `inset 0 -2px 0 ${PURPLE_EDGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Arrow dir="↓" size={16} color="#fff" sw={3.2} />
        </span>
        <span style={{ fontFamily: font.b, fontWeight: 800, fontSize: 13, color: PURPLE_EDGE, letterSpacing: '.01em' }}>Nước chảy theo trọng lực ↓ · không đổi hướng</span>
      </span>
    );
  }

  function StreamFlowSheet() {
    const cell = 30;
    return (
      <SheetShell w={1620}>
        <SheetHead title="STATE FLOW — NGUỒN NƯỚC MỌC DẦN" subtitle="Mỗi lượt tạo thêm 1 ô — dòng chảy nối liền thành một dải nước" />
        <GravityPill />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          {[
            { n: 1, label: 'Khởi tạo', len: 0 },
            { n: 2, label: 'Sau 1 lượt', len: 1, newTip: true },
            { n: 3, label: 'Sau 2 lượt', len: 2, newTip: true },
            { n: 4, label: 'Sau 3 lượt', len: 3, newTip: true },
          ].map((fr, i) => (
            <React.Fragment key={fr.n}>
              <StreamFrame {...fr} cell={cell} />
              {i < 3 && <Arrow dir="→" size={26} color={AQ.deep} sw={3.4} className="gjw-arr" />}
            </React.Fragment>
          ))}
        </div>

        {/* break state + push demos */}
        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1fr 1fr', gap: 16 }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 20, boxShadow: 'var(--shadow-md)', padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, alignSelf: 'stretch' }}>
              <StepChip n={5} tone={AQ.deep} />
              <span style={{ fontFamily: font.d, fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>Phá nguồn</span>
            </div>
            <StreamBoard cell={26} dir="↓" lane={4} start={1} len={3} broken fadeFlow splash={[1, 4]} />
            <span style={{ fontFamily: font.b, fontWeight: 700, fontSize: 12.5, color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.35, maxWidth: 220 }}>Clear qua ô giọt nước ở nguồn → nguồn khô, cả dải nước tắt.</span>
          </div>

          <Card title="A · Jelly bị đẩy 1 ô" note="Jelly đứng trên dòng nước bị đẩy 1 ô theo trọng lực ↓" style={{ justifyContent: 'flex-start' }}>
            <StreamBoard cell={28} cols={7} rows={7} dir="↓" lane={3} start={0} len={4} jelly={[{ color: 'pink', pos: 4 }]} ghost={[{ color: 'pink', pos: 3 }]} />
          </Card>

          <Card title="B · Cụm jelly bị đẩy" note="Cụm jelly dính nhau trôi cùng nhau theo dải nước" style={{ justifyContent: 'flex-start' }}>
            <StreamBoard cell={28} cols={7} rows={7} dir="↓" lane={3} start={0} len={5} jelly={[{ color: 'mint', pos: 3 }, { color: 'yellow', pos: 4 }, { color: 'blue', pos: 5 }]} ghost={[{ color: 'mint', pos: 2 }, { color: 'yellow', pos: 3 }, { color: 'blue', pos: 4 }]} bracket={[3, 5]} />
          </Card>
        </div>

        {/* obstacle → detour: water keeps seeking gravity, bends around blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--color-surface)', borderRadius: 22, boxShadow: 'var(--shadow-md)', padding: '18px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(160deg, ${AQ.mid}, ${AQ.deep})`, boxShadow: `0 0 0 2px ${AQ.core}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Drop size={19} fill="#fff" stroke={AQ.pale} /></span>
            <div>
              <h2 style={{ margin: 0, fontFamily: font.d, fontWeight: 700, fontSize: 21, color: 'var(--color-text)', lineHeight: 1.05 }}>Nước gặp vật cản — luôn tìm đường xuống</h2>
              <p style={{ margin: '3px 0 0', fontFamily: font.b, fontWeight: 700, fontSize: 13, color: AQ.deep }}>Ô dưới bị chặn → rẽ ngang 1 ô rồi chảy xuống tiếp, miễn là còn ô trống.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <ObstaclePanel n={1} title="Còn ô trống" caption="Dưới nguồn còn ô trống → nước chảy thẳng xuống theo trọng lực.">
              <StreamPath cell={26} cols={7} rows={8} path={[[1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3]]} newTip />
            </ObstaclePanel>

            <ObstaclePanel n={2} title="Bị chặn → rẽ ngang" caption="Gặp block chặn ngay dưới → dòng chảy rẽ sang 1 bên còn trống.">
              <StreamPath cell={26} cols={7} rows={8} path={[[1, 3], [2, 3], [3, 3], [3, 4], [4, 4]]} blocks={[{ pos: [4, 3], color: 'stone' }, { pos: [5, 3], color: 'blue' }]} newTip />
            </ObstaclePanel>

            <ObstaclePanel n={3} title="Chèn sát tường → vòng rồi xuống" caption="Block xếp chồng sát tường, hết ô đẩy → rẽ trái rồi tiếp tục chảy xuống.">
              <StreamPath cell={26} cols={7} rows={8} path={[[1, 5], [2, 5], [3, 5], [3, 4], [4, 4], [5, 4], [6, 4]]} blocks={[{ pos: [4, 5], color: 'stone' }, { pos: [5, 5], color: 'stone' }, { pos: [4, 6], color: 'pink' }, { pos: [5, 6], color: 'yellow' }]} newTip />
            </ObstaclePanel>
          </div>
        </div>

        <Legend items={[
          { swatch: sw.source, k: 'Ô nguồn nước', v: '= sinh dòng chảy' },
          { swatch: sw.flow, k: 'Ô dòng chảy', v: '= đẩy jelly 1 ô' },
          { swatch: sw.drop, k: 'Ô giọt nước', v: '= clear để phá nguồn' },
          { swatch: sw.broken, k: 'Phá nguồn', v: '= tắt toàn bộ dòng chảy' },
        ]} />
      </SheetShell>
    );
  }

  /* =================== dispatch =================== */

  function render(id, rootEl) {
    const map = { components: ComponentSheet, stateflow: StateFlowSheet, streamflow: StreamFlowSheet, tutorial: TutorialSheet };
    const Fn = map[id];
    if (!Fn) { rootEl.innerHTML = '<p style="font-family:sans-serif;padding:20px">Unknown sheet: ' + id + '</p>'; return; }
    ReactDOM.createRoot(rootEl).render(<Fn />);
  }

  window.GJWater = { render, WaterCell, WaterBoard, WaterStrip, Drop };
})();
