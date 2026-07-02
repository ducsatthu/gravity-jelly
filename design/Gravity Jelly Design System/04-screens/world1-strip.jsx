/* world1-strip.jsx — Level-Map SCROLL STRIP for World 1 "Đồng cỏ".
   ----------------------------------------------------------------
   Pure artboard: 360 × 1080dp, NO HUD (the HUD is a separate sticky
   layer added by the screen shell). The scenery + winding road are a
   single painted PNG backdrop (06-svg-assets/backgrounds/world1-map-bg.png,
   724×2172 → exact 1:3, so no distortion at 360 wide). We no longer draw
   trees/bushes/path in SVG — we just DROP the ten level nodes onto the
   painted trail. Reads bottom→top:

     • L1 → L5  : regular nodes (L1–L4 done w/ stars, L5 stone-locked)
     • L6       : BREATHER ("NGHỈ")
     • L7 → L9  : regular nodes (stone-locked)
     • L10      : BOSS (gravity-purple halo)
     • top      : the painted locked GATE → World 2 "Rừng rậm"
                  (a compact stars-required chip labels it)

   Reuses DS tokens & JellyBlock. Exposes window.GJWorld1Strip.
   ---------------------------------------------------------------- */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const BG_SRC = '../06-svg-assets/backgrounds/world1-map-bg-v3.png';
  const LOCK_SRC = '../06-svg-assets/ui/locked-tile.png';
  const OPEN_SRC = '../06-svg-assets/ui/unlocked-tile.png';
  const DONE_SRC = '../06-svg-assets/ui/completed-tile.png';
  const STAR_ON  = '../06-svg-assets/ui/star-on.png';   // earned (yellow)
  const STAR_OFF = '../06-svg-assets/ui/star-off.png';  // empty (grey)

  // ─── Geometry ──────────────────────────────────────────────────────────
  const W = 360;
  const H = 1280; // 665×2365 backdrop scaled to 360 wide (exact 360×1280)

  // One uniform node size across every node type.
  const NODE = 62;

  // Node positions sit ON THE BENDS of the painted winding trail, bottom→top.
  // Consecutive nodes alternate left/right along each curve, so they zigzag
  // up the path across the full height. L10 sits at the top bend below the gate.
  const NODES = [
    { id: 1,  x: 230, y: 1138, kind: 'reg',      state: 'done',   stars: 3, color: 'yellow' },
    { id: 2,  x: 147, y: 1050, kind: 'reg',      state: 'done',   stars: 3, color: 'mint'   },
    { id: 3,  x: 233, y:  964, kind: 'reg',      state: 'done',   stars: 2, color: 'pink'   },
    { id: 4,  x: 126, y:  892, kind: 'reg',      state: 'done',   stars: 1, color: 'blue'   },
    { id: 5,  x: 239, y:  802, kind: 'reg',      state: 'open'   },
    { id: 6,  x: 126, y:  718, kind: 'breather', state: 'locked' },
    { id: 7,  x: 243, y:  646, kind: 'reg',      state: 'locked' },
    { id: 8,  x: 126, y:  562, kind: 'reg',      state: 'locked' },
    { id: 9,  x: 242, y:  484, kind: 'reg',      state: 'locked' },
    { id: 10, x: 133, y:  410, kind: 'boss',     state: 'locked' },
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

  function StarArc({ stars = 3, size = 15, width = 46 }) {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: Math.round(size * 0.18),
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
  // Level number sitting IN THE CENTRE of a painted tile. `vy` is the vertical
  // anchor as a fraction of tile height (locked tiles push it up above the lock).
  function CenterNum({ n, size, color = '#6A4A2E', vy = 0.5, scale = 0.34,
                       shadow = '0 1px 0 rgba(255,255,255,0.65)' }) {
    // Shrink for wider numbers so up to 3 digits (→100) fit inside the node.
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

  function BossNode({ n, size = 76 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <Tile src={LOCK_SRC} size={size} shadow="0 6px 10px rgba(126,108,240,0.32)" />
        <CenterNum n={n} size={size} color="#6353D6" vy={0.33} scale={0.4}
                   shadow="0 1px 0 rgba(255,255,255,0.85)" />
      </div>
    );
  }

  function PlaceNode({ node }) {
    let inner = null;
    const half = NODE / 2;
    if (node.kind === 'boss') {
      inner = <BossNode n={node.id} size={NODE} />;
    } else if (node.kind === 'breather') {
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

  // ─── Gate chip (labels the painted locked gate → World 2) ───────────
  function GateChip() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: 132,
        transform: 'translateX(-50%)',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: '#FFFFFF',
        border: '1.5px solid #E6D8BD',
        borderRadius: 999,
        padding: '5px 12px 5px 6px',
        boxShadow: '0 8px 20px rgba(120,92,52,0.28), 0 3px 6px rgba(120,92,52,0.14)',
        whiteSpace: 'nowrap',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #B6DDB2 0%, #6FA86F 60%, #4F8C58 100%)',
          border: '2px solid #4F8C58',
          boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3c-3.6 4-5 7-5 9.3a5 5 0 0 0 10 0c0-2.3-1.4-5.3-5-9.3z" fill="#FFFFFF" />
            <rect x="10.6" y="16.5" width="2.8" height="4.2" rx="1" fill="#FFFFFF" />
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05, gap: 1 }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 8.5,
            letterSpacing: '0.12em', color: '#9B886F',
          }}>CỔNG · THẾ GIỚI 2</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
            color: '#3F7D49', lineHeight: 1.05,
          }}>Rừng rậm</span>
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
          }}>18</span>
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
        }}>Đồng cỏ · Khởi đầu</div>
      </div>
    );
  }

  // ─── Top-level component ─────────────────────────────────────────────
  function World1Strip() {
    return (
      <div style={{
        position: 'relative', width: W, height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-strip-halo {
            0%,100% { transform: scale(1.00); opacity: 1; }
            50%     { transform: scale(1.12); opacity: 0.85; }
          }
          @keyframes gj-strip-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes gj-strip-pulse {
            0%,100% { transform: scale(1);    opacity: 0.75; }
            50%     { transform: scale(1.10); opacity: 0.35; }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; }
          }
        `}</style>

        {/* Painted meadow + winding road + gate backdrop */}
        <img src={BG_SRC} alt="" draggable="false" style={{
          position: 'absolute', inset: 0, width: W, height: H,
          objectFit: 'cover', display: 'block', pointerEvents: 'none',
          userSelect: 'none',
        }} />

        {/* Gate label chip over the painted gate */}
        <GateChip />

        {/* All ten node placements dropped onto the painted trail */}
        {NODES.map(n => <PlaceNode key={n.id} node={n} />)}
      </div>
    );
  }

  window.GJWorld1Strip = World1Strip;
})();
