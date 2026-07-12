/* world4-strip.jsx — Level-Map SCROLL STRIP for World 4 "Sa mạc".
   ----------------------------------------------------------------
   Same approach as Worlds 1–3: pure painted artboard 360 × 1080dp, NO HUD.
   The scenery + winding sand road + locked gate are a single painted PNG
   backdrop (06-svg-assets/backgrounds/world4-map-bg.jpg, 724×2172 → exact
   1:3, scaled to 360 wide = 360×1080, no distortion). We do NOT draw
   dunes/cacti/path in SVG — we just DROP the ten level nodes onto the
   painted trail. Reads bottom→top:

     • L31 → L35 : regular nodes (L31–L33 done w/ stars, L34 open, L35 locked)
     • L36       : BREATHER
     • L37 → L39 : regular nodes (stone-locked)
     • L40       : BOSS
     • top       : the painted locked GATE → World 5 "Bãi biển"
                   (a compact stars-required chip labels it)

   Reuses DS tokens & tile art. Exposes window.GJWorld4Strip.
   ---------------------------------------------------------------- */
(function () {
  const BG_SRC   = '../06-svg-assets/backgrounds/world4-map-bg.jpg';
  const LOCK_SRC = '../06-svg-assets/ui/locked-tile.png';
  const OPEN_SRC = '../06-svg-assets/ui/unlocked-tile.png';
  const DONE_SRC = '../06-svg-assets/ui/completed-tile.png';
  const STAR_ON  = '../06-svg-assets/ui/star-on.png';   // earned (yellow)
  const STAR_OFF = '../06-svg-assets/ui/star-off.png';  // empty (grey)

  // ─── Geometry ──────────────────────────────────────────────────────────
  const W = 360;
  const H = 1080; // 724×2172 backdrop scaled to 360 wide (exact 360×1080)

  // One uniform node size across every node type.
  const NODE = 62;

  // Node positions snapped to the CURVE CORNERS of the painted winding
  // sand trail (alternating left/right bends), bottom→top. x/y measured from
  // the painted path centerline of world4-map-bg.png.
  const NODES = [
    { id: 31, x: 190, y: 1000, kind: 'reg',      state: 'done',   stars: 3, color: 'yellow' }, // R bend
    { id: 32, x: 158, y:  888, kind: 'reg',      state: 'done',   stars: 3, color: 'pink'   }, // L bend
    { id: 33, x: 205, y:  800, kind: 'reg',      state: 'done',   stars: 2, color: 'mint'   }, // R bend
    { id: 34, x: 136, y:  707, kind: 'reg',      state: 'open'   },                            // L bend
    { id: 35, x: 240, y:  612, kind: 'reg',      state: 'locked' },                            // R bend
    { id: 36, x: 132, y:  519, kind: 'breather', state: 'locked' },                            // L bend
    { id: 37, x: 244, y:  456, kind: 'reg',      state: 'locked' },                            // R bend (deep)
    { id: 38, x: 130, y:  382, kind: 'reg',      state: 'locked' },                            // L bend
    { id: 39, x: 210, y:  306, kind: 'reg',      state: 'locked' },                            // R bend
    { id: 40, x: 151, y:  240, kind: 'boss',     state: 'locked' },                            // road → gate
  ];

  // ─── Stars ────────────────────────────────────────────────────────────
  function Star({ filled = false, size = 14 }) {
    return (
      <img src={filled ? STAR_ON : STAR_OFF} alt="" draggable="false"
           style={{
             width: size, height: size, display: 'block',
             userSelect: 'none', pointerEvents: 'none',
             filter: filled
               ? 'drop-shadow(0 1px 1.5px rgba(190,120,20,0.5))'
               : 'drop-shadow(0 1px 1.5px rgba(120,92,52,0.32))',
           }} />
    );
  }

  function StarArc({ stars = 3, size = 15, width = 46, top }) {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: top != null ? top : Math.round(size * 0.18),
        transform: 'translateX(-50%)', width, height: size + 6,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        pointerEvents: 'none', zIndex: 2,
      }}>
        <div style={{ transform: 'translateY(2px) rotate(-18deg)' }}>
          <Star filled={stars >= 1} size={size} />
        </div>
        <div style={{ transform: 'translateY(-3px)' }}>
          <Star filled={stars >= 2} size={size + 3} />
        </div>
        <div style={{ transform: 'translateY(2px) rotate(18deg)' }}>
          <Star filled={stars >= 3} size={size} />
        </div>
      </div>
    );
  }

  // ─── Node primitives ─────────────────────────────────────────────────
  function CenterNum({ n, size, color = '#6A4A2E', vy = 0.5, scale = 0.34,
                       shadow = '0 1px 0 rgba(255,255,255,0.65)' }) {
    const digits = String(n).length;
    const dscale = digits >= 3 ? 0.66 : digits === 2 ? 0.82 : 1;
    return (
      <div style={{
        position: 'absolute', left: 0, right: 0, top: `${vy * 100}%`,
        transform: 'translateY(-50%)', textAlign: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: Math.round(size * scale * dscale), lineHeight: 1, color,
        textShadow: shadow, pointerEvents: 'none',
      }}>{n}</div>
    );
  }

  function Tile({ src, size, shadow }) {
    return (
      <img src={src} alt="" draggable="false"
           style={{ position: 'relative', width: size, height: size, display: 'block',
                    userSelect: 'none', pointerEvents: 'none',
                    filter: `drop-shadow(${shadow})` }} />
    );
  }

  function DoneNode({ n, stars, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <Tile src={DONE_SRC} size={size} shadow="0 5px 7px rgba(120,92,52,0.30)" />
        <CenterNum n={n} size={size} color="#B67A16" vy={0.56} scale={0.36} />
        <StarArc stars={stars} size={15} width={54} />
      </div>
    );
  }

  // Unlocked-but-not-yet-played: bright yellow tile, prominent centred number, pulse.
  function OpenNode({ n, size = 64 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{
          position: 'absolute', left: -16, top: -16, right: -16, bottom: -16,
          borderRadius: '50%',
          background:
            'radial-gradient(closest-side, rgba(255,159,104,0.55) 0%, rgba(255,159,104,0.22) 55%, rgba(255,159,104,0) 78%)',
          animation: 'gj-strip-pulse 1800ms ease-in-out infinite',
        }} />
        <Tile src={OPEN_SRC} size={size} shadow="0 6px 9px rgba(120,92,52,0.30)" />
        <CenterNum n={n} size={size} color="#B67A16" vy={0.52} scale={0.38} />
      </div>
    );
  }

  // Locked cream tile — the padlock is painted at the bottom, so the number
  // sits in the empty upper area.
  function LockedRegularNode({ n, size = 58 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <Tile src={LOCK_SRC} size={size} shadow="0 5px 7px rgba(120,92,52,0.26)" />
        <CenterNum n={n} size={size} color="#8A7A63" vy={0.33} scale={0.34} />
      </div>
    );
  }

  function BreatherNode({ n, size = 52 }) {
    return <LockedRegularNode n={n} size={size} />;
  }

  // ─── BOSS GATE ───────────────────────────────────────────────────────
  // Ornate framed gate node marking the world's boss level (10/20/30…).
  // Three states: locked (gold + padlock) · current (amethyst, playable)
  // · cleared (gold + ruby, beaten). Sized by width; height follows the art.
  const BOSS_SRC = {
    locked:  '../06-svg-assets/ui/boss-gate-locked.png',
    current: '../06-svg-assets/ui/boss-gate-current.png',
    cleared: '../06-svg-assets/ui/boss-gate-cleared.png',
  };
  // aspect (h/w) + panel-centre anchor (fraction of image) + number colour
  const BOSS_META = {
    locked:  { ar: 1.1118, vx: 0.477, vy: 0.423, num: '#8A6A2E' },
    current: { ar: 1.0404, vx: 0.498, vy: 0.502, num: '#6A4A2E' },
    cleared: { ar: 1.0266, vx: 0.500, vy: 0.501, num: '#B67A16' },
  };

  function BossGateNode({ n, variant = 'locked', stars = 3, width = 104 }) {
    const m = BOSS_META[variant];
    const w = width, h = Math.round(width * m.ar);
    const shadow = variant === 'current'
      ? '0 7px 14px rgba(126,108,240,0.40)'
      : variant === 'cleared'
        ? '0 7px 13px rgba(200,150,40,0.36)'
        : '0 7px 12px rgba(120,92,52,0.30)';
    const numSize = Math.round(w * (String(n).length >= 2 ? 0.34 : 0.42));
    return (
      <div style={{ position: 'relative', width: w, height: h }}>
        {variant === 'current' &&
        <div style={{
          position: 'absolute', left: -18, top: -14, right: -18, bottom: -14,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(169,156,246,0.60) 0%, rgba(126,108,240,0.28) 55%, rgba(126,108,240,0) 80%)',
          animation: 'gj-strip-pulse 1800ms ease-in-out infinite',
        }} />}
        <img src={BOSS_SRC[variant]} alt="" draggable="false" style={{
          position: 'relative', width: w, height: h, display: 'block',
          userSelect: 'none', pointerEvents: 'none',
          filter: `drop-shadow(${shadow})`,
        }} />
        {variant === 'cleared' &&
          <StarArc stars={stars} size={15} width={54} top={Math.round(h * 0.16)} />}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: numSize, lineHeight: 1, color: m.num,
          textShadow: '0 1px 0 rgba(255,255,255,0.7)', pointerEvents: 'none',
        }}>{n}</div>
      </div>
    );
  }

  function PlaceNode({ node }) {
    const half = NODE / 2;
    if (node.kind === 'boss') {
      const variant = node.state === 'done' ? 'cleared'
                    : node.state === 'open' ? 'current' : 'locked';
      const BW = 60;
      const m = BOSS_META[variant];
      const bh = Math.round(BW * m.ar);
      return (
        <div style={{
          position: 'absolute', zIndex: 3,
          left: Math.round(node.x - m.vx * BW),
          top: Math.round(node.y - m.vy * bh),
        }}>
          <BossGateNode n={node.id} variant={variant} stars={node.stars || 3} width={BW} />
        </div>
      );
    }
    let inner = null;
    if (node.kind === 'breather') {
      inner = <BreatherNode n={node.id} size={NODE} />;
    } else if (node.state === 'open') {
      inner = <OpenNode n={node.id} size={NODE} />;
    } else if (node.state === 'done') {
      inner = <DoneNode n={node.id} color={node.color} stars={node.stars} size={NODE} />;
    } else {
      inner = <LockedRegularNode n={node.id} size={NODE} />;
    }
    return (
      <div style={{ position: 'absolute', left: node.x - half, top: node.y - half }}>
        {inner}
      </div>
    );
  }

  // ─── Gate chip (labels the painted locked gate → World 5 Bãi biển) ────
  function GateChip() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: 96,
        transform: 'translateX(-50%)',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: '#FFFFFF',
        border: '1.5px solid #CFE6EC',
        borderRadius: 999,
        padding: '5px 12px 5px 6px',
        boxShadow: '0 8px 20px rgba(60,130,150,0.28), 0 3px 6px rgba(120,92,52,0.14)',
        whiteSpace: 'nowrap',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #CFF0F6 0%, #6FC2D8 60%, #4296B0 100%)',
          border: '2px solid #4296B0',
          boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 16c2-3 4-3 6 0s4 0 6-3 4-2 6 1" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="17" cy="7.5" r="2.6" fill="#FFFFFF" />
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05, gap: 1 }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 8.5,
            letterSpacing: '0.12em', color: '#9B886F',
          }}>CỔNG · THẾ GIỚI 5</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
            color: '#2E84A6', lineHeight: 1.05,
          }}>Bãi biển</span>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
          border: '1.5px solid #E0A21F',
          padding: '4px 9px 5px 6px', borderRadius: 999,
          boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)',
        }}>
          <Star filled size={13} />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
            color: '#6A4A2E', lineHeight: 1,
          }}>72</span>
        </div>
      </div>
    );
  }

  // Small start marker at the very bottom.
  function StartSign() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: H - 44,
        transform: 'translateX(-50%)',
      }}>
        <div style={{
          background: '#FFFFFF', color: '#5B4636',
          border: '1.5px solid #E6D8BD',
          fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
          letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 999,
          boxShadow: '0 4px 10px rgba(120,92,52,0.24)',
          textTransform: 'uppercase',
        }}>Sa mạc · Tiếp tục</div>
      </div>
    );
  }

  // ─── Top-level component ─────────────────────────────────────────────
  function World4Strip() {
    return (
      <div style={{
        position: 'relative', width: W, height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-strip-pulse {
            0%,100% { transform: scale(1);    opacity: 0.75; }
            50%     { transform: scale(1.10); opacity: 0.35; }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; }
          }
        `}</style>

        {/* Painted desert + winding sand road + gate backdrop */}
        <img src={BG_SRC} alt="" draggable="false" style={{
          position: 'absolute', inset: 0, width: W, height: H,
          objectFit: 'cover', display: 'block', pointerEvents: 'none',
          userSelect: 'none',
        }} />

        {/* Gate label chip over the painted gate */}
        <GateChip />

        {/* All ten node placements dropped onto the painted trail */}
        {NODES.map(n => <PlaceNode key={n.id} node={n} />)}

        {/* Start marker */}
        <StartSign />

        {/* DEBUG coord grid (temporary) */}
        {window.__gjGrid !== false && <DebugGrid />}
      </div>
    );
  }

  function DebugGrid() {
    const lines = [];
    for (let y = 0; y <= H; y += 40) {
      lines.push(<div key={'h'+y} style={{ position:'absolute', left:0, right:0, top:y, height:1, background: y%200===0?'rgba(200,0,0,0.55)':'rgba(0,0,0,0.22)' }} />);
      lines.push(<div key={'hy'+y} style={{ position:'absolute', left:2, top:y+1, fontSize:9, fontFamily:'monospace', color:'#B00', fontWeight:700 }}>{y}</div>);
    }
    for (let x = 0; x <= W; x += 40) {
      lines.push(<div key={'v'+x} style={{ position:'absolute', top:0, bottom:0, left:x, width:1, background: x%80===0?'rgba(0,0,200,0.4)':'rgba(0,0,0,0.18)' }} />);
      lines.push(<div key={'vx'+x} style={{ position:'absolute', top:2, left:x+2, fontSize:9, fontFamily:'monospace', color:'#00B', fontWeight:700 }}>{x}</div>);
    }
    return <div style={{ position:'absolute', inset:0, zIndex:99, pointerEvents:'none' }}>{lines}</div>;
  }

  window.GJWorld4Strip = World4Strip;
})();
