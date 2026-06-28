/* mechanics-kit.jsx — engine for the "THẺ CƠ CHẾ" (mechanic illustration cards).
   A documentation helper (no .d.ts → stays out of the bundle).

   A card HTML loads: _ds_bundle.js → screen-extras.jsx → mechanics-kit.jsx →
   mechanics-widgets.jsx → mechanics-cards.js, then calls
   GJMech.renderById('<id>', rootEl).

   Board cards are declared in the registry (mechanics-cards.js) and rendered
   here; widget cards delegate to window.GJMechW[kind]. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { JellyBlock, Icon, Eyes } = NS;
  const X = window.GJExtras || {};

  const CODE = { Y: 'yellow', M: 'mint', P: 'pink', B: 'blue', S: 'stone' };
  const key = (r, c) => r + ',' + c;

  /* ---- one-time shared CSS ---- */
  if (!document.getElementById('gj-mech-css')) {
    const s = document.createElement('style');
    s.id = 'gj-mech-css';
    s.textContent = `
      @keyframes gjGlow { 0%,100%{ box-shadow:0 0 0 0 rgba(255,202,102,0), var(--shadow-sm); transform:scale(1);} 50%{ box-shadow:0 0 0 4px rgba(255,202,102,.85), 0 0 14px 2px rgba(255,202,102,.55); transform:scale(1.05);} }
      @keyframes gjSuper { 0%,100%{ box-shadow:0 0 14px 3px rgba(255,236,179,.55), var(--shadow-md); transform:scale(1.08);} 50%{ box-shadow:0 0 24px 7px rgba(255,236,179,.8), var(--shadow-md); transform:scale(1.16);} }
      @keyframes gjGate { 0%,100%{ box-shadow:inset 0 0 0 2px var(--color-gravity), 0 0 0 0 rgba(126,108,240,0);} 50%{ box-shadow:inset 0 0 0 2px var(--color-gravity), 0 0 12px 2px rgba(126,108,240,.6);} }
      @keyframes gjBob { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-3px);} }
      @keyframes gjArrow { 0%,100%{ transform:translateY(0); opacity:.65;} 50%{ transform:translateY(4px); opacity:1;} }
      @keyframes gjFloat { 0%,100%{ transform:translateY(0) rotate(-2deg);} 50%{ transform:translateY(-4px) rotate(2deg);} }
      @keyframes gjSpin { to { transform:rotate(360deg);} }
      @keyframes gjPulse { 0%,100%{ transform:scale(1); opacity:.9;} 50%{ transform:scale(1.12); opacity:1;} }
      @keyframes gjBurst { 0%{ transform:scale(.3); opacity:0;} 40%{ opacity:1;} 100%{ transform:scale(1.5); opacity:0;} }
      @keyframes gjTwinkle { 0%,100%{ transform:translate(-50%,-50%) scale(.35) rotate(0deg); opacity:0;} 50%{ transform:translate(-50%,-50%) scale(1) rotate(45deg); opacity:1;} }
      .gj-glow  { animation: gjGlow 1.6s var(--ease-inout,ease) infinite; border-radius: var(--radius-md); }
      .gj-arrow { animation: gjArrow 1.4s var(--ease-inout,ease) infinite; }
      .gj-float { animation: gjFloat 2.2s var(--ease-inout,ease) infinite; }
      @media (prefers-reduced-motion: reduce){ [class^="gj-"]{ animation:none !important; } }
    `;
    document.head.appendChild(s);
  }

  /* ============== small inline glyphs the base set lacks ============== */
  const gstyle = (sw, color) => ({ fill: 'none', stroke: color, strokeWidth: sw || 2, strokeLinecap: 'round', strokeLinejoin: 'round' });
  const Glyph = {
    magnet: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" {...gstyle(2, c)}><path d="M6 4v7a6 6 0 0 0 12 0V4" /><path d="M6 4H3v3M18 4h3v3" /><path d="M6 11H3M18 11h3" /></svg>,
    arrow: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" {...gstyle(2.4, c)}><path d="M5 12h12M12 7l5 5-5 5" /></svg>,
    hidden: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" {...gstyle(2.4, c)}><path d="M9 9a3 3 0 1 1 4 2.8c-.8.4-1 .9-1 1.7" /><circle cx="12" cy="17.5" r="0.4" fill={c} stroke={c} /></svg>,
    heavy: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" {...gstyle(2.2, c)}><path d="M7 5l5 5 5-5M7 12l5 5 5-5" /></svg>,
    norotate: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" {...gstyle(2, c)}><path d="M4.5 12a7.5 7.5 0 1 1 2.2 5.3" /><path d="M6.7 13.5l-1.2 4M5 17.5l4.2-.8" /><path d="M5 5l14 14" stroke={c} strokeWidth="2.4" /></svg>,
    dye: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3.5c3.6 4.4 5.5 7.2 5.5 10a5.5 5.5 0 1 1-11 0c0-2.8 1.9-5.6 5.5-10z" fill={c} stroke="none" /><path d="M9 14a3 3 0 0 0 1.5 2.5" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".7" /></svg>,
    seed: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" {...gstyle(2, c)}><path d="M12 21v-7" /><path d="M12 14c0-3 2.5-4.5 5-4.5C17 12.5 15 14 12 14z" /><path d="M12 16c0-2.5-2-4-4.2-4C7.8 14.5 9.5 16 12 16z" /></svg>,
    sticky: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M4 5h16v7c0 1-1 1.6-2 2.2-1.3.8-1.3 2.3-2.6 3-1 .6-2 .6-3 0-1.3-.7-1.3-2.2-2.6-3C6 13.6 5 13 5 12z" fill={c} stroke="none" opacity=".85" /></svg>,
    spike: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M3 19l3-7 3 7 3-7 3 7 3-7 3 7z" fill={c} stroke="none" /></svg>,
    portal: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" {...gstyle(2, c)}><ellipse cx="12" cy="12" rx="5" ry="8" /><ellipse cx="12" cy="12" rx="2" ry="4.5" /></svg>,
    snow: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" {...gstyle(1.8, c)}><path d="M12 3v18M4 7l16 10M20 7L4 17" /><path d="M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2" /></svg>,
    chainlink: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" {...gstyle(2, c)}><rect x="3.5" y="9" width="8" height="6" rx="3" /><rect x="12.5" y="9" width="8" height="6" rx="3" /></svg>,
    slide: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" {...gstyle(2, c)}><path d="M4 8h13M4 12h10M4 16h7" /></svg>,
    rays: (s, c) => <svg width={s} height={s} viewBox="0 0 24 24" {...gstyle(2, c)}><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>,
  };

  /* ============== board cells ============== */
  function Empty({ cell }) {
    return <div style={{ width: cell, height: cell, borderRadius: 'var(--radius-md)', background: 'var(--color-cell-empty)', boxShadow: 'inset 0 0 0 1px var(--color-cell-line)' }} />;
  }

  /* corner badge overlay on a filled cell */
  function Badge({ glyph, num, bg, fg, cell }) {
    const sz = Math.round(cell * 0.42);
    return (
      <div style={{ position: 'absolute', top: -4, right: -4, minWidth: sz, height: sz, padding: num != null ? '0 3px' : 0, borderRadius: 999, background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, boxShadow: 'var(--shadow-sm)', zIndex: 5 }}>
        {glyph}
        {num != null && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: Math.round(cell * 0.3), lineHeight: 1 }}>{num}</span>}
      </div>
    );
  }

  /* full-cell special tiles for empty positions */
  function SpecialEmpty({ type, cell, color, num }) {
    if (type === 'gate') {
      return <div style={{ width: cell, height: cell, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-gravity) 12%, var(--color-cell-empty))', animation: 'gjGate 1.5s var(--ease-inout,ease) infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gravity)' }}><span style={{ display: 'flex', transform: 'rotate(90deg)' }}><Icon name="chevron" size={Math.round(cell * 0.5)} strokeWidth={2.6} /></span></div>;
    }
    if (type === 'portal') {
      const cc = color || 'var(--color-gravity)';
      return <div style={{ width: cell, height: cell, borderRadius: '50%', background: `radial-gradient(circle, ${cc} 0%, transparent 72%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ animation: 'gjSpin 3s linear infinite', display: 'flex', color: cc }}>{Glyph.portal(Math.round(cell * 0.66), cc)}</div></div>;
    }
    if (type === 'spike') {
      return <div style={{ width: cell, height: cell, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-danger) 16%, var(--color-cell-empty))', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', color: 'var(--color-danger)' }}>{Glyph.spike(Math.round(cell * 0.8), 'var(--color-danger)')}</div>;
    }
    if (type === 'target') {
      return <div style={{ width: cell, height: cell, borderRadius: 'var(--radius-md)', background: 'var(--color-cell-empty)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'gjPulse 1.6s ease infinite' }}>{X.Target ? <X.Target size={Math.round(cell * 0.7)} color="var(--color-gravity)" /> : null}</div>;
    }
    return <Empty cell={cell} />;
  }

  /* rescue pet */
  function Pet({ cell, color = 'pink', direction = 'down', expression = 'focus' }) {
    return (
      <div style={{ width: cell, height: cell, position: 'relative', animation: 'gjBob 1.8s var(--ease-inout,ease) infinite', zIndex: 3 }}>
        <div style={{ position: 'absolute', inset: -3, borderRadius: 'var(--radius-md)', boxShadow: '0 0 0 3px var(--color-primary-shine), 0 0 14px 2px rgba(255,159,104,.5)', pointerEvents: 'none' }} />
        <JellyBlock color={color} size={cell} direction={direction} expression={expression} />
      </div>
    );
  }

  /* merged super-block — a charged, "powered-up" cell, not a plain happy block */
  function Spark({ x, y, s, d }) {
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: s, height: s, animation: `gjTwinkle 1.5s var(--ease-inout,ease) ${d}s infinite`, zIndex: 6, pointerEvents: 'none' }}>
        <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 0c1.2 7 4.8 10.8 12 12-7.2 1.2-10.8 5-12 12-1.2-7-4.8-10.8-12-12 7.2-1.2 10.8-5 12-12z" fill="#FFF6DC" /></svg>
      </div>
    );
  }
  function SuperCell({ cell, color = 'mint', mega = false }) {
    const flavor = ['yellow', 'mint', 'pink', 'blue'].includes(color) ? color : 'mint';
    const src = `../06-svg-assets/blocks/super-${flavor}-${mega ? 2 : 1}.svg`;
    return (
      <div style={{ width: cell, height: cell, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 4 }}>
        <div style={{ animation: 'gjSuper 1.5s var(--ease-jelly,ease) infinite', borderRadius: 'var(--radius-md)', display: 'flex', filter: mega ? 'drop-shadow(0 0 11px rgba(255,202,102,.9))' : 'drop-shadow(0 0 7px rgba(255,236,179,.7))' }}>
          <img src={src} width={cell} height={cell} alt={mega ? 'super block level 2' : 'super block level 1'} style={{ display: 'block' }} />
        </div>
        <Spark x={Math.round(cell * 0.02)} y={Math.round(cell * 0.2)} s={Math.round(cell * 0.3)} d={0} />
        <Spark x={Math.round(cell * 0.86)} y={Math.round(cell * 0.74)} s={Math.round(cell * 0.24)} d={0.5} />
        {mega && <Spark x={Math.round(cell * 0.88)} y={Math.round(cell * 0.1)} s={Math.round(cell * 0.22)} d={0.9} />}
      </div>
    );
  }

  /* rainbow / wild block — the merged wildcard jelly */
  function Rainbow({ cell }) {
    return (
      <div style={{ width: cell, height: cell, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="../06-svg-assets/blocks/rainbow.svg" width={cell} height={cell} alt="rainbow block" style={{ display: 'block', filter: 'drop-shadow(0 1px 2px rgba(120,92,52,.18))' }} />
      </div>
    );
  }

  function pos(r, c, cell, gap, pad) { return { x: pad + c * (cell + gap), y: pad + r * (cell + gap) }; }

  /* the board snippet */
  function MiniBoard({
    rows, direction = 'down', cell = 40, gap = 4, pad = 8,
    glow = [], gate = [], pet = [], superAt = null, supers = [], mega = false, rainbow = [],
    petColor = 'pink', petExpr = 'focus', deco = {}, chains = [], divider = null,
  }) {
    const grid = rows.map((s) => s.split(''));
    const cols = grid[0].length, N = grid.length;
    const glowSet = new Set(glow.map(([r, c]) => key(r, c)));
    const gateSet = new Set(gate.map(([r, c]) => key(r, c)));
    const petSet = new Set(pet.map(([r, c]) => key(r, c)));
    const rainSet = new Set(rainbow.map(([r, c]) => key(r, c)));
    const superMap = {}; supers.forEach(([r, c, col]) => { superMap[key(r, c)] = col || 'mint'; });
    const W = pad * 2 + cols * cell + (cols - 1) * gap;
    const H = pad * 2 + N * cell + (N - 1) * gap;

    const decoBadge = (d, cl) => {
      const map = {
        lock: [X.Lock && <X.Lock size={Math.round(cl * 0.36)} color="#fff" />, 'var(--color-info)', '#fff'],
        clock: [X.Clock && <X.Clock size={Math.round(cl * 0.34)} color="#fff" />, 'var(--color-warning)', '#5B4636'],
        bomb: [X.Bomb && <X.Bomb size={Math.round(cl * 0.36)} color="#fff" />, 'var(--color-danger)', '#fff'],
        magnet: [Glyph.magnet(Math.round(cl * 0.4), '#fff'), 'var(--color-danger)', '#fff'],
        arrow: [Glyph.arrow(Math.round(cl * 0.44), '#fff'), 'var(--color-gravity)', '#fff'],
        hidden: [Glyph.hidden(Math.round(cl * 0.4), '#fff'), 'var(--color-text-muted)', '#fff'],
        heavy: [Glyph.heavy(Math.round(cl * 0.42), '#fff'), 'var(--color-text)', '#fff'],
        norotate: [Glyph.norotate(Math.round(cl * 0.42), '#fff'), 'var(--color-text-muted)', '#fff'],
        seed: [Glyph.seed(Math.round(cl * 0.42), '#fff'), 'var(--color-success)', '#fff'],
        slide: [Glyph.slide(Math.round(cl * 0.42), '#fff'), 'var(--color-info)', '#fff'],
        expand: [X.Plus && <X.Plus size={Math.round(cl * 0.4)} color="#fff" />, 'var(--color-stone-edge)', '#fff'],
        weak: [Glyph.rays(Math.round(cl * 0.44), '#fff'), 'var(--color-danger)', '#fff'],
      };
      const m = map[d.type];
      if (!m) return null;
      return <Badge glyph={m[0]} num={d.num} bg={m[1]} fg={m[2]} cell={cl} />;
    };

    const cellNode = (r, c) => {
      const k = key(r, c);
      const d = deco[k];
      if (superMap[k]) return <SuperCell cell={cell} color={superMap[k]} mega={mega} />;
      if (superAt && superAt[0] === r && superAt[1] === c) return <SuperCell cell={cell} color={superAt[2] || 'mint'} mega={mega} />;
      if (rainSet.has(k)) return <Rainbow cell={cell} />;
      if (petSet.has(k)) return <Pet cell={cell} color={petColor} direction={direction} expression={petExpr} />;
      const ch = grid[r][c];
      if (ch === '.') {
        if (d && ['gate', 'portal', 'spike', 'target'].includes(d.type)) return <SpecialEmpty type={d.type} cell={cell} color={d.color} num={d.num} />;
        return <Empty cell={cell} />;
      }
      // filled
      const isStone = ch === 'S';
      const floating = d && d.type === 'float';
      const iced = d && (d.type === 'ice');
      const dimmed = d && d.type === 'dim';
      return (
        <div className={(glowSet.has(k) ? 'gj-glow ' : '') + (floating ? 'gj-float' : '')} style={{ width: cell, height: cell, position: 'relative', opacity: dimmed ? 0.4 : 1 }}>
          <JellyBlock color={isStone ? 'stone' : CODE[ch]} size={cell} direction={direction} showEyes={!isStone} />
          {floating && <div style={{ position: 'absolute', inset: -3, borderRadius: 'var(--radius-md)', border: '2px dashed var(--color-gravity)', animation: 'gjPulse 1.5s ease infinite' }} />}
          {iced && <div style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-md)', background: 'rgba(143,182,242,.5)', boxShadow: 'inset 0 0 0 2px rgba(214,225,251,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Glyph.snow(Math.round(cell * 0.6), '#fff')}</div>}
          {d && d.type === 'dye' && <div style={{ position: 'absolute', bottom: 1, right: 1 }}>{Glyph.dye(Math.round(cell * 0.5), 'var(--color-block-pink-edge)')}</div>}
          {d && d.type === 'sticky' && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Glyph.sticky(Math.round(cell * 0.7), 'var(--color-warning)')}</div>}
          {d && !['float', 'ice', 'dye', 'sticky', 'dim'].includes(d.type) && decoBadge(d, cell)}
        </div>
      );
    };

    return (
      <div style={{ position: 'relative', width: W, height: H }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gridAutoRows: `${cell}px`, gap, padding: pad, background: 'var(--color-surface-sunken)', borderRadius: 16, boxShadow: 'inset 0 2px 6px rgba(120,92,52,.12)' }}>
          {grid.map((row, r) => row.map((_, c) => <React.Fragment key={key(r, c)}>{cellNode(r, c)}</React.Fragment>))}
        </div>
        {/* chain links between two cells */}
        {chains.map((pair, i) => {
          const a = pos(pair[0][0], pair[0][1], cell, gap, pad), b = pos(pair[1][0], pair[1][1], cell, gap, pad);
          const ax = a.x + cell / 2, ay = a.y + cell / 2, bx = b.x + cell / 2, by = b.y + cell / 2;
          const len = Math.hypot(bx - ax, by - ay), ang = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
          return <div key={'ch' + i} style={{ position: 'absolute', left: ax, top: ay - 5, width: len, height: 10, transformOrigin: '0 50%', transform: `rotate(${ang}deg)`, background: 'repeating-linear-gradient(90deg, var(--color-warning) 0 7px, transparent 7px 12px)', borderRadius: 6, zIndex: 6, opacity: .9 }} />;
        })}
        {/* gravity divider line */}
        {divider != null && (() => {
          const y = pad + (divider.after + 1) * cell + divider.after * gap + gap / 2;
          return <div style={{ position: 'absolute', left: pad, right: pad, top: y - 2, height: 4, background: 'var(--color-gravity)', borderRadius: 2, zIndex: 6, boxShadow: '0 0 8px rgba(126,108,240,.5)' }} />;
        })()}
      </div>
    );
  }

  /* ============== card chrome ============== */
  function Chip({ group, name }) {
    return (
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-sm)', padding: '8px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{group}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, lineHeight: 1.05, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{name}</span>
      </div>
    );
  }

  function Panel({ label, children }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '100%' }}>
        {label && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-text-muted)', alignSelf: 'flex-start' }}>{label}</span>}
        {children}
      </div>
    );
  }

  function GravityChip({ icon = 'rotate', label, tone = 'gravity' }) {
    const bg = tone === 'warning' ? 'var(--color-warning)' : tone === 'danger' ? 'var(--color-danger)' : tone === 'success' ? 'var(--color-success)' : 'var(--color-gravity)';
    const edge = tone === 'warning' ? '#E2A82E' : tone === 'danger' ? '#D96A5E' : tone === 'success' ? '#4FB45F' : 'var(--color-gravity-edge)';
    const fg = tone === 'warning' ? 'var(--color-text)' : 'var(--color-text-invert)';
    const customGlyphs = { magnet: Glyph.magnet, arrow: Glyph.arrow, heavy: Glyph.heavy, rays: Glyph.rays, snow: Glyph.snow, portal: Glyph.portal };
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: bg, color: fg, borderBottom: `3px solid ${edge}`, borderRadius: 'var(--radius-pill)', padding: '8px 16px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' }}>
        {customGlyphs[icon] ? customGlyphs[icon](18, fg) : (icon === 'bomb' && X.Bomb ? <X.Bomb size={18} color={fg} /> : icon === 'clock' && X.Clock ? <X.Clock size={18} color={fg} /> : icon === 'lock' && X.Lock ? <X.Lock size={18} color={fg} /> : icon ? <Icon name={icon} size={18} strokeWidth={2.6} /> : null)}
        {label}
      </div>
    );
  }

  function ActionNode({ children }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div className="gj-arrow" style={{ color: 'var(--color-gravity)', display: 'flex' }}>
          <span style={{ display: 'flex', transform: 'rotate(90deg)' }}><Icon name="chevron" size={22} strokeWidth={2.8} /></span>
        </div>
        {children}
      </div>
    );
  }

  function CardShell({ group, name, caption, children }) {
    return (
      <div style={{ width: 360, minHeight: 760, boxSizing: 'border-box', background: 'radial-gradient(120% 80% at 50% 0%, #FFFCF5 0%, var(--color-bg) 60%)', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
        <Chip group={group} name={name} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%' }}>{children}</div>
        <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 600, lineHeight: 1.4, textAlign: 'center', textWrap: 'pretty', color: 'var(--color-text)', maxWidth: 300 }}>{caption}</p>
      </div>
    );
  }

  /* action descriptor → node */
  function renderAction(a) {
    if (!a) return null;
    if (React.isValidElement(a)) return a;
    if (a.kind === 'star') return <GravityChip icon="star" label={a.label} tone={a.tone} />;
    return <GravityChip icon={a.icon === undefined ? 'rotate' : a.icon} label={a.label} tone={a.tone} />;
  }

  function BoardBody({ before, after, beforeLabel = 'TRƯỚC', afterLabel = 'SAU', action }) {
    return (
      <>
        <Panel label={beforeLabel}><MiniBoard {...before} /></Panel>
        <ActionNode>{renderAction(action)}</ActionNode>
        <Panel label={afterLabel}><MiniBoard {...after} /></Panel>
      </>
    );
  }

  /* legacy convenience used by hand-written cards */
  function MechanicCard({ group, name, before, after, action, caption, beforeLabel, afterLabel }) {
    return (
      <CardShell group={group} name={name} caption={caption}>
        <Panel label={beforeLabel || 'TRƯỚC'}>{before}</Panel>
        <ActionNode>{action}</ActionNode>
        <Panel label={afterLabel || 'SAU'}>{after}</Panel>
      </CardShell>
    );
  }

  function renderById(id, rootEl) {
    const card = (window.GJ_MECH_CARDS || {})[id];
    if (!card) { rootEl.innerHTML = '<p style="font-family:sans-serif;padding:20px">Unknown card: ' + id + '</p>'; return; }
    let body;
    if (card.kind === 'board' || !card.kind) {
      body = <BoardBody before={card.before} after={card.after} action={card.action} beforeLabel={card.beforeLabel} afterLabel={card.afterLabel} />;
    } else {
      const W = window.GJMechW || {};
      const fn = W[card.kind];
      body = fn ? fn(card, { MiniBoard, GravityChip, Panel, ActionNode, Glyph, X }) : <p>Missing widget: {card.kind}</p>;
    }
    ReactDOM.createRoot(rootEl).render(<CardShell group={card.group} name={card.name} caption={card.caption}>{body}</CardShell>);
  }

  window.GJMech = { MechanicCard, MiniBoard, GravityChip, ActionNode, CardShell, Panel, Glyph, Rainbow, SuperCell, Pet, renderById, renderAction, BoardBody };
})();
