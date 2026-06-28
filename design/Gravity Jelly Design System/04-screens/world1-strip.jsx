/* world1-strip.jsx — Level-Map SCROLL STRIP for World 1 "Đồng cỏ".
   ----------------------------------------------------------------
   Pure artboard: 360 × 2600dp, NO HUD (the HUD is a separate sticky
   layer added by the screen shell). Reads bottom→top:

     • bottom edge: path enters from below
     • L1 → L5    : regular nodes (alternating 4 jelly colors, with
                    number + 3-star arc; L1–L4 done, L5 stone-locked)
     • L6         : BREATHER ("Nghỉ" tag), smaller & dimmer
     • L7 → L9    : regular nodes (stone-locked)
     • L10        : BOSS (1.2× size, gravity-purple halo, "BOSS" tag)
     • above L10  : WORLD GATE pill banner — badge + name + ★ chip
     • top edge   : path continues out into World 2 "Rừng rậm";
                    background blends smoothly into forest palette

   Reuses DS tokens & JellyBlock. Exposes window.GJWorld1Strip.
   ---------------------------------------------------------------- */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  // ─── Geometry ──────────────────────────────────────────────────────────
  const W = 360;
  const H = 2600;

  // Node y's are evenly spaced (~190dp pitch) bottom→top so the eye reads
  // a steady climb; x's alternate to make a winding S-curve trail.
  const NODES = [
    { id: 1,  x: 130, y: 2440, kind: 'reg',      state: 'done',   stars: 3, color: 'yellow' },
    { id: 2,  x: 240, y: 2250, kind: 'reg',      state: 'done',   stars: 3, color: 'mint'   },
    { id: 3,  x: 110, y: 2060, kind: 'reg',      state: 'done',   stars: 2, color: 'pink'   },
    { id: 4,  x: 240, y: 1870, kind: 'reg',      state: 'done',   stars: 1, color: 'blue'   },
    { id: 5,  x: 120, y: 1680, kind: 'reg',      state: 'locked' },
    { id: 6,  x: 240, y: 1490, kind: 'breather', state: 'locked' },
    { id: 7,  x: 110, y: 1290, kind: 'reg',      state: 'locked' },
    { id: 8,  x: 240, y: 1090, kind: 'reg',      state: 'locked' },
    { id: 9,  x: 150, y:  880, kind: 'reg',      state: 'locked' },
    { id: 10, x: 180, y:  620, kind: 'boss',     state: 'locked' },
  ];

  // Anchor points for the winding path. The trail enters the artboard
  // from below the bottom edge, threads through L1..L10, slides under
  // the gate banner, then leaves through the top edge into World 2.
  const ENTRY = { x: 180, y: 2620 };
  const GATE  = { x: 180, y: 360  };
  const EXIT  = { x: 180, y: -40  };

  // Smooth cubic-Bezier path through points with vertical tangents — the
  // characteristic gentle S-curve of a candy-trail.
  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }

  const ALL_PTS  = [ENTRY, ...NODES.map(n => ({ x: n.x, y: n.y })), GATE, EXIT];
  const FULL_PATH = pathD(ALL_PTS);
  // The "đã đi" (already walked) overlay covers entry → L4 (the last
  // cleared node). L5 is the next playable, so the orange stops at L4.
  const DONE_PATH = pathD([ENTRY, NODES[0], NODES[1], NODES[2], NODES[3]]);

  // ─── Background scene ────────────────────────────────────────────────
  // One tall SVG that paints the sky gradient, layered hills, trees,
  // bushes, daisies and a few branded jelly characters. Top ~18% is
  // Rừng rậm (forest) palette; rest is Đồng cỏ (meadow); a soft band
  // around the gate cross-blends the two.
  function Scene() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="w1-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"     stopColor="#B2D3AC" />{/* Rừng rậm deep   */}
            <stop offset="0.06"  stopColor="#C2DDBC" />
            <stop offset="0.13"  stopColor="#CFE6CE" />{/* Rừng rậm light */}
            <stop offset="0.19"  stopColor="#D9ECDA" />{/* blend          */}
            <stop offset="0.24"  stopColor="#DEF0E1" />{/* Đồng cỏ top    */}
            <stop offset="0.60"  stopColor="#D6ECCF" />
            <stop offset="1"     stopColor="#C6E8C9" />{/* Đồng cỏ floor */}
          </linearGradient>
          <radialGradient id="w1-sun" cx="0.80" cy="0.32" r="0.40">
            <stop offset="0" stopColor="#FFF6CD" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFF6CD" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#w1-sky)" />
        <rect x="0" y="600" width={W} height="1300" fill="url(#w1-sun)" />

        {/* ── Top band: Rừng rậm forest canopy (where the path leaves) ── */}
        <ellipse cx="50"  cy="-10" rx="120" ry="58" fill="#7BA582" opacity="0.85" />
        <ellipse cx="220" cy="-14" rx="160" ry="60" fill="#6F9C76" opacity="0.85" />
        <ellipse cx="350" cy="6"   rx="100" ry="46" fill="#5F8E68" opacity="0.78" />
        <ellipse cx="40"  cy="110" rx="130" ry="58" fill="#8FB48E" />
        <ellipse cx="300" cy="120" rx="150" ry="62" fill="#85AB85" />
        <ellipse cx="180" cy="170" rx="220" ry="74" fill="#9BBE99" />

        {/* darker forest trees in the top band */}
        <ForestTree x={26}  y={88}  h={42} canopy="#5C8E66" trunk="#5A3F23" />
        <ForestTree x={66}  y={64}  h={36} canopy="#6FA677" trunk="#5A3F23" />
        <ForestTree x={108} y={86}  h={40} canopy="#5C8E66" trunk="#5A3F23" />
        <ForestTree x={236} y={70}  h={38} canopy="#6FA677" trunk="#5A3F23" />
        <ForestTree x={290} y={92}  h={44} canopy="#5C8E66" trunk="#5A3F23" />
        <ForestTree x={332} y={66}  h={38} canopy="#6FA677" trunk="#5A3F23" />
        <ForestTree x={170} y={104} h={36} canopy="#6FA677" trunk="#5A3F23" />

        {/* ── Blend zone hills near the gate ── */}
        <ellipse cx="40"  cy="310" rx="130" ry="50" fill="#A8D2A5" />
        <ellipse cx="320" cy="320" rx="150" ry="56" fill="#A0CC9F" />
        <ellipse cx="180" cy="370" rx="220" ry="68" fill="#B0D6AB" />

        {/* ── Meadow hills, far → near, top→bottom ── */}
        <ellipse cx="60"  cy="500" rx="140" ry="54" fill="#BCDDB9" />
        <ellipse cx="290" cy="520" rx="150" ry="58" fill="#B0D6AB" />
        <ellipse cx="180" cy="560" rx="210" ry="76" fill="#B8D9B5" />

        <ellipse cx="50"  cy="720" rx="150" ry="58" fill="#B0D6AB" />
        <ellipse cx="320" cy="740" rx="140" ry="58" fill="#A6CFA4" />
        <ellipse cx="170" cy="790" rx="200" ry="76" fill="#BCDDB9" />

        <ellipse cx="60"  cy="940" rx="150" ry="60" fill="#A6CFA4" />
        <ellipse cx="300" cy="960" rx="160" ry="62" fill="#A0CC9F" />
        <ellipse cx="190" cy="1020" rx="220" ry="84" fill="#B0D6AB" />

        <ellipse cx="40"  cy="1180" rx="140" ry="58" fill="#A6CFA4" />
        <ellipse cx="320" cy="1200" rx="160" ry="62" fill="#9FCAA1" />
        <ellipse cx="180" cy="1260" rx="220" ry="80" fill="#A6CFA4" />

        <ellipse cx="60"  cy="1420" rx="150" ry="60" fill="#A0CC9F" />
        <ellipse cx="300" cy="1440" rx="150" ry="60" fill="#94C297" />
        <ellipse cx="170" cy="1500" rx="220" ry="84" fill="#A6CFA4" />

        <ellipse cx="40"  cy="1660" rx="140" ry="58" fill="#94C297" />
        <ellipse cx="320" cy="1680" rx="150" ry="62" fill="#9CC79B" />
        <ellipse cx="190" cy="1740" rx="220" ry="80" fill="#A0CC9F" />

        <ellipse cx="60"  cy="1900" rx="140" ry="58" fill="#94C297" />
        <ellipse cx="300" cy="1920" rx="160" ry="62" fill="#8BBE8D" />
        <ellipse cx="180" cy="1980" rx="220" ry="80" fill="#94C297" />

        <ellipse cx="40"  cy="2150" rx="160" ry="64" fill="#8BBE8D" />
        <ellipse cx="320" cy="2170" rx="160" ry="66" fill="#85B988" />
        <ellipse cx="180" cy="2230" rx="240" ry="84" fill="#94C297" />

        <ellipse cx="40"  cy="2380" rx="170" ry="70" fill="#7DB585" />
        <ellipse cx="320" cy="2400" rx="170" ry="72" fill="#85B988" />
        <ellipse cx="180" cy="2470" rx="260" ry="92" fill="#9CC79B" />

        {/* grass apron at the bottom edge */}
        <rect x="0" y={H - 30} width={W} height="30" fill="#A4CE9E" />

        {/* ── Trees scattered along both edges (meadow tones) ── */}
        <Tree x={28}  y={300}  h={28} canopy="#7FB37F" />
        <Tree x={336} y={290}  h={30} canopy="#6FA86F" />
        <Tree x={20}  y={440}  h={34} canopy="#7FB37F" />
        <Tree x={338} y={460}  h={32} canopy="#6FA86F" />
        <Tree x={28}  y={620}  h={36} canopy="#7FB37F" />
        <Tree x={332} y={640}  h={38} canopy="#6FA86F" />
        <Tree x={22}  y={830}  h={40} canopy="#6FA86F" />
        <Tree x={338} y={870}  h={36} canopy="#7FB37F" />
        <Tree x={20}  y={1080} h={42} canopy="#5F9C66" />
        <Tree x={336} y={1100} h={38} canopy="#6FA86F" />
        <Tree x={22}  y={1320} h={44} canopy="#7FB37F" />
        <Tree x={336} y={1360} h={40} canopy="#5F9C66" />
        <Tree x={20}  y={1580} h={42} canopy="#6FA86F" />
        <Tree x={338} y={1620} h={44} canopy="#5F9C66" />
        <Tree x={24}  y={1820} h={46} canopy="#7FB37F" />
        <Tree x={336} y={1860} h={42} canopy="#6FA86F" />
        <Tree x={20}  y={2080} h={46} canopy="#5F9C66" />
        <Tree x={338} y={2120} h={44} canopy="#6FA86F" />
        <Tree x={22}  y={2320} h={48} canopy="#7FB37F" />
        <Tree x={334} y={2350} h={46} canopy="#5F9C66" />
        <Tree x={26}  y={2520} h={42} canopy="#6FA86F" />
        <Tree x={332} y={2540} h={44} canopy="#7FB37F" />

        {/* ── Bushes (low rounded blobs) ── */}
        <Bush x={46}  y={480}  r={16} c="#8BBE8D" />
        <Bush x={310} y={510}  r={14} c="#7AB07E" />
        <Bush x={50}  y={730}  r={20} c="#7AB07E" />
        <Bush x={308} y={760}  r={18} c="#8BBE8D" />
        <Bush x={42}  y={970}  r={22} c="#7AB07E" />
        <Bush x={312} y={1000} r={20} c="#8BBE8D" />
        <Bush x={38}  y={1220} r={18} c="#7AB07E" />
        <Bush x={306} y={1250} r={22} c="#7AB07E" />
        <Bush x={44}  y={1480} r={20} c="#8BBE8D" />
        <Bush x={310} y={1510} r={18} c="#7AB07E" />
        <Bush x={40}  y={1740} r={22} c="#7AB07E" />
        <Bush x={306} y={1770} r={20} c="#8BBE8D" />
        <Bush x={48}  y={1990} r={20} c="#8BBE8D" />
        <Bush x={310} y={2020} r={22} c="#7AB07E" />
        <Bush x={40}  y={2230} r={24} c="#7AB07E" />
        <Bush x={306} y={2260} r={22} c="#8BBE8D" />
        <Bush x={50}  y={2460} r={20} c="#8BBE8D" />
        <Bush x={304} y={2490} r={22} c="#7AB07E" />
        <Bush x={130} y={2560} r={14} c="#A4CE9E" />
        <Bush x={230} y={2570} r={12} c="#A4CE9E" />

        {/* ── Daisies — pale freckles ── */}
        <Daisy x={70}  y={550} />
        <Daisy x={300} y={580} />
        <Daisy x={86}  y={770} />
        <Daisy x={292} y={820} />
        <Daisy x={48}  y={1050} />
        <Daisy x={296} y={1080} />
        <Daisy x={92}  y={1300} />
        <Daisy x={294} y={1330} />
        <Daisy x={66}  y={1560} />
        <Daisy x={300} y={1590} />
        <Daisy x={88}  y={1820} />
        <Daisy x={296} y={1850} />
        <Daisy x={50}  y={2070} />
        <Daisy x={302} y={2100} />
        <Daisy x={78}  y={2310} />
        <Daisy x={296} y={2340} />
        <Daisy x={60}  y={2530} />
        <Daisy x={312} y={2550} />

        {/* ── A few branded jelly mushrooms peeking at the edges ── */}
        <Mushroom x={48}  y={1170} w={22} color="pink" />
        <Mushroom x={314} y={1860} w={20} color="yellow" />
        <Mushroom x={48}  y={2410} w={26} color="mint" />

        {/* ── Distant jelly characters drifting in the meadow ── */}
        <FloatJelly x={300} y={1170} size={20} color="mint"   delay="0s"   />
        <FloatJelly x={56}  y={2000} size={22} color="yellow" delay="0.8s" />
        <FloatJelly x={300} y={2280} size={18} color="pink"   delay="1.4s" />
      </svg>
    );
  }

  function ForestTree({ x, y, h, canopy, trunk }) {
    const r = h * 0.62;
    return (
      <g>
        <rect x={x - 3} y={y} width="6" height={h * 0.5} rx="3" fill={trunk} />
        <ellipse cx={x - r * 0.5} cy={y - r * 0.2} rx={r * 0.78} ry={r * 0.72} fill={canopy} opacity="0.95" />
        <ellipse cx={x + r * 0.5} cy={y - r * 0.3} rx={r * 0.78} ry={r * 0.72} fill={canopy} opacity="0.95" />
        <ellipse cx={x} cy={y - r * 0.78} rx={r} ry={r * 0.85} fill={canopy} />
        <ellipse cx={x - r * 0.34} cy={y - r * 0.96} rx={r * 0.28} ry={r * 0.18}
                 fill="#FFFFFF" opacity="0.22" />
      </g>
    );
  }

  function Tree({ x, y, h = 32, canopy = '#7FB37F', trunk = '#7B5A36' }) {
    const r = h * 0.58;
    return (
      <g>
        <rect x={x - 2.5} y={y} width="5" height={h * 0.46} rx="2.5" fill={trunk} />
        <ellipse cx={x - r * 0.5} cy={y - r * 0.18} rx={r * 0.72} ry={r * 0.66} fill={canopy} opacity="0.94" />
        <ellipse cx={x + r * 0.5} cy={y - r * 0.28} rx={r * 0.72} ry={r * 0.66} fill={canopy} opacity="0.94" />
        <ellipse cx={x} cy={y - r * 0.72} rx={r} ry={r * 0.82} fill={canopy} />
        <ellipse cx={x - r * 0.32} cy={y - r * 0.9} rx={r * 0.26} ry={r * 0.16}
                 fill="#FFFFFF" opacity="0.28" />
      </g>
    );
  }

  function Bush({ x, y, r = 16, c = '#8BBE8D' }) {
    return (
      <g>
        <ellipse cx={x - r * 0.55} cy={y} rx={r * 0.7} ry={r * 0.55} fill={c} />
        <ellipse cx={x + r * 0.55} cy={y} rx={r * 0.7} ry={r * 0.55} fill={c} />
        <ellipse cx={x} cy={y - r * 0.22} rx={r * 0.82} ry={r * 0.6} fill={c} />
        <ellipse cx={x - r * 0.2} cy={y - r * 0.4} rx={r * 0.18} ry={r * 0.10} fill="#FFFFFF" opacity="0.32" />
      </g>
    );
  }

  function Daisy({ x, y }) {
    return (
      <g>
        {[0, 72, 144, 216, 288].map(a => {
          const rad = (a * Math.PI) / 180;
          return (
            <circle key={a}
              cx={x + Math.cos(rad) * 3.2}
              cy={y + Math.sin(rad) * 3.2}
              r="2.2" fill="#FFFFFF" opacity="0.95" />
          );
        })}
        <circle cx={x} cy={y} r="1.7" fill="#F6D86B" />
      </g>
    );
  }

  // A foreground "mushroom": cream stem + colored jelly cap. Inline SVG
  // so it sits on the same z-layer as the rest of the scene.
  function Mushroom({ x, y, w = 22, color = 'pink' }) {
    const palette = {
      pink:   { fill: '#F7A9C0', shine: '#FBD0DF', edge: '#E576A0' },
      yellow: { fill: '#FFE3A3', shine: '#FFF1CE', edge: '#E8B85C' },
      mint:   { fill: '#A3E5D9', shine: '#CBF2EB', edge: '#5FC3B2' },
    }[color] || { fill: '#F7A9C0', shine: '#FBD0DF', edge: '#E576A0' };
    return (
      <g style={{ filter: 'drop-shadow(0 3px 2px rgba(120,92,52,0.18))' }}>
        <rect x={x - w * 0.18} y={y - w * 0.10} width={w * 0.36} height={w * 0.55}
              rx={w * 0.16} fill="#FCF1DC" stroke="#E2C896" strokeWidth="1.2" />
        <ellipse cx={x} cy={y - w * 0.12} rx={w * 0.55} ry={w * 0.4} fill={palette.fill}
                 stroke={palette.edge} strokeWidth="1.6" />
        <ellipse cx={x - w * 0.16} cy={y - w * 0.26} rx={w * 0.22} ry={w * 0.12}
                 fill={palette.shine} opacity="0.92" />
        <circle cx={x - w * 0.20} cy={y - w * 0.10} r={w * 0.07} fill="#FFFFFF" opacity="0.85" />
        <circle cx={x + w * 0.18} cy={y - w * 0.16} r={w * 0.05} fill="#FFFFFF" opacity="0.85" />
      </g>
    );
  }

  function FloatJelly({ x, y, size, color, delay }) {
    const palette = {
      yellow: { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' },
      mint:   { f: '#A3E5D9', e: '#5FC3B2', s: '#CBF2EB' },
      pink:   { f: '#F7A9C0', e: '#E576A0', s: '#FBD0DF' },
      blue:   { f: '#B3C7F7', e: '#7E9CE8', s: '#D6E1FB' },
    }[color] || { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' };
    const r = Math.round(size * 0.28);
    return (
      <g style={{ animation: `gj-strip-float 3.6s ease-in-out infinite`, animationDelay: delay,
                  transformOrigin: `${x}px ${y}px`,
                  filter: 'drop-shadow(0 4px 3px rgba(120,92,52,0.20))' }}>
        <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={r}
              fill={palette.f} stroke={palette.e} strokeWidth="2" />
        <ellipse cx={x} cy={y - size * 0.18} rx={size * 0.34} ry={size * 0.12}
                 fill={palette.s} opacity="0.95" />
        <circle cx={x - size * 0.18} cy={y - size * 0.04} r={size * 0.07} fill="#3B2A18" />
        <circle cx={x + size * 0.18} cy={y - size * 0.04} r={size * 0.07} fill="#3B2A18" />
      </g>
    );
  }

  // ─── Path layer ───────────────────────────────────────────────────────
  function PathLayer() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block',
                    pointerEvents: 'none' }}>
        {/* drop shadow under the road */}
        <path d={FULL_PATH} fill="none" stroke="rgba(120,92,52,0.22)"
              strokeWidth="34" strokeLinecap="round" strokeLinejoin="round"
              transform="translate(0,4)" />
        {/* outer warm border around the road */}
        <path d={FULL_PATH} fill="none" stroke="#EAD8B7"
              strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        {/* main white road */}
        <path d={FULL_PATH} fill="none" stroke="#FFFFFF"
              strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        {/* center dashed line (creamy) */}
        <path d={FULL_PATH} fill="none" stroke="#EFE0C9"
              strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 11" />
        {/* completed-portion tangerine overlay (entry → L4) */}
        <path d={DONE_PATH} fill="none" stroke="#FF9F68"
              strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"
              opacity="0.95" />
        <path d={DONE_PATH} fill="none" stroke="#FFC59A"
              strokeWidth="6" strokeLinecap="round" strokeDasharray="4 9"
              opacity="0.9" />
      </svg>
    );
  }

  // ─── Stars ────────────────────────────────────────────────────────────
  function Star({ filled = false, size = 14 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
              fill={filled ? '#FFC23D' : '#D9CDB5'}
              stroke={filled ? '#E0A21F' : '#B6A892'}
              strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  function StarArc({ stars = 3, size = 14, width = 64 }) {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: -size - 6,
        transform: 'translateX(-50%)', width, height: size + 8,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        pointerEvents: 'none',
      }}>
        <div style={{ transform: 'translateY(5px) rotate(-22deg)' }}>
          <Star filled={stars >= 1} size={size} />
        </div>
        <div style={{ transform: 'translateY(-2px)' }}>
          <Star filled={stars >= 2} size={size + 2} />
        </div>
        <div style={{ transform: 'translateY(5px) rotate(22deg)' }}>
          <Star filled={stars >= 3} size={size} />
        </div>
      </div>
    );
  }

  // ─── Node primitives ─────────────────────────────────────────────────
  function NumberBadge({ n, size, color = '#6A4A2E' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: Math.round(size * 0.42), lineHeight: 1, color,
        textShadow: '0 1px 0 rgba(255,255,255,0.55)', pointerEvents: 'none',
      }}>{n}</div>
    );
  }

  function LockGlyph({ size = 18 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
           style={{ display: 'block' }}>
        <path d="M8 11V8.5a4 4 0 1 1 8 0V11" fill="none" stroke="#FFFFFF"
              strokeWidth="2.6" strokeLinecap="round" />
        <rect x="5" y="11" width="14" height="9" rx="2.5" fill="#FFFFFF" />
        <circle cx="12" cy="15" r="1.4" fill="#A89A82" />
        <rect x="11.3" y="15" width="1.4" height="3" rx="0.6" fill="#A89A82" />
      </svg>
    );
  }

  function DoneNode({ n, color, stars, size = 64 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size,
                    filter: 'drop-shadow(0 5px 7px rgba(120,92,52,0.24))' }}>
        <JellyBlock color={color} size={size} showEyes={false} />
        <NumberBadge n={n} size={size} />
        <StarArc stars={stars} size={14} width={size + 14} />
      </div>
    );
  }

  function LockedRegularNode({ n, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size,
                    filter: 'drop-shadow(0 4px 5px rgba(120,92,52,0.20))' }}>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: Math.round(size * 0.40), lineHeight: 1, color: '#7A6A50',
          textShadow: '0 1px 0 rgba(255,255,255,0.40)', pointerEvents: 'none',
        }}>{n}</div>
        {/* small dim 3-star arc (empty stars) */}
        <StarArc stars={0} size={12} width={size + 8} />
        {/* lock badge */}
        <div style={{
          position: 'absolute', right: -4, bottom: -4,
          width: 24, height: 24, borderRadius: '50%',
          background: '#8A7B62', border: '2px solid #FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(120,92,52,0.32)',
        }}>
          <LockGlyph size={13} />
        </div>
      </div>
    );
  }

  function BreatherNode({ n, size = 48 }) {
    return (
      <div style={{ position: 'relative' }}>
        {/* "NGHỈ" tag to the side */}
        <div style={{
          position: 'absolute', top: -10, left: size + 8,
          background: '#FFFFFF', color: '#8C7458',
          border: '1.5px solid #E6D8BD',
          fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
          letterSpacing: '0.10em', padding: '4px 10px', borderRadius: 999,
          boxShadow: '0 3px 8px rgba(120,92,52,0.20)', whiteSpace: 'nowrap',
        }}>
          NGHỈ
        </div>
        {/* moon/zzz hint icon on the tag's left edge */}
        <div style={{
          position: 'absolute', top: -6, left: size + 4,
          width: 10, height: 10, borderRadius: '50%',
          background: '#FFD074', border: '1.5px solid #E0A21F',
        }} />

        <div style={{ position: 'relative', width: size, height: size,
                      filter: 'drop-shadow(0 4px 5px rgba(120,92,52,0.22))',
                      opacity: 0.92 }}>
          <JellyBlock color="stone" size={size} showEyes={false} />
          {/* gentle sleeping eyes (curved lines) */}
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
               style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={`M ${size*0.30} ${size*0.45} q 4 4 8 0`} fill="none"
                  stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${size*0.55} ${size*0.45} q 4 4 8 0`} fill="none"
                  stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: size * 0.15,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: Math.round(size * 0.30), lineHeight: 1, color: '#7A6A50',
            textShadow: '0 1px 0 rgba(255,255,255,0.40)', pointerEvents: 'none',
          }}>{n}</div>
        </div>
      </div>
    );
  }

  function BossNode({ n, size = 80 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size,
                    filter: 'drop-shadow(0 8px 14px rgba(126,108,240,0.40))' }}>
        {/* outer animated halo */}
        <div style={{
          position: 'absolute', left: -28, top: -28, right: -28, bottom: -28,
          borderRadius: '50%',
          background:
            'radial-gradient(closest-side, rgba(169,156,246,0.55) 0%, rgba(126,108,240,0.30) 55%, rgba(126,108,240,0) 78%)',
          animation: 'gj-strip-halo 2400ms ease-in-out infinite',
        }} />
        {/* spark ring */}
        <svg width={size + 56} height={size + 56} viewBox="0 0 200 200"
             style={{ position: 'absolute', left: -28, top: -28, pointerEvents: 'none',
                      animation: 'gj-strip-spin 8s linear infinite',
                      transformOrigin: '50% 50%' }}>
          {[0, 60, 120, 180, 240, 300].map(a => {
            const rad = (a * Math.PI) / 180;
            const cx = 100 + Math.cos(rad) * 84;
            const cy = 100 + Math.sin(rad) * 84;
            return (
              <g key={a}>
                <circle cx={cx} cy={cy} r="4.5" fill="#FFFFFF" opacity="0.95" />
                <circle cx={cx} cy={cy} r="2.5" fill="#A99CF6" />
              </g>
            );
          })}
        </svg>
        {/* stone block */}
        <JellyBlock color="stone" size={size} showEyes={false} />
        {/* lock at center */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: size * 0.5, height: size * 0.5, borderRadius: '50%',
            background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)',
            border: '3px solid #FFFFFF',
            boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LockGlyph size={Math.round(size * 0.28)} />
          </div>
        </div>
        {/* BOSS tag */}
        <div style={{
          position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
          color: '#FFFFFF',
          border: '2px solid #6353D6',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          letterSpacing: '0.16em', padding: '4px 14px', borderRadius: 999,
          boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)',
          whiteSpace: 'nowrap',
        }}>BOSS</div>
        {/* level number sits below the lock */}
        <div style={{
          position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)',
          background: '#FFFFFF', color: '#5B4636',
          border: '1.5px solid #EFE0C9',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          padding: '2px 10px', borderRadius: 999,
          boxShadow: '0 3px 6px rgba(120,92,52,0.20)',
        }}>màn {n}</div>
      </div>
    );
  }

  function PlaceNode({ node }) {
    let inner = null, half = 32;
    if (node.kind === 'boss') {
      inner = <BossNode n={node.id} size={80} />;
      half = 40;
    } else if (node.kind === 'breather') {
      inner = <BreatherNode n={node.id} size={48} />;
      half = 24;
    } else if (node.state === 'done') {
      inner = <DoneNode n={node.id} color={node.color} stars={node.stars} size={64} />;
      half = 32;
    } else {
      inner = <LockedRegularNode n={node.id} size={60} />;
      half = 30;
    }
    return (
      <div style={{ position: 'absolute', left: node.x - half, top: node.y - half }}>
        {inner}
      </div>
    );
  }

  // ─── World gate banner (over the path, above L10) ───────────────────
  function GateBanner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 38,
        transform: 'translateX(-50%)',
        width: 312,
        background: '#FFFFFF',
        border: '1.5px solid #E6D8BD',
        borderRadius: 999,
        padding: '8px 14px 8px 8px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 12px 28px rgba(120,92,52,0.30), 0 4px 8px rgba(120,92,52,0.14)',
      }}>
        {/* world-2 forest badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #B6DDB2 0%, #6FA86F 60%, #4F8C58 100%)',
          border: '2.5px solid #4F8C58',
          boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.12), inset 0 3px 0 rgba(255,255,255,0.45), 0 2px 4px rgba(60,90,55,0.32)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {/* a stylized tree mark */}
          <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3c-3.6 4-5 7-5 9.3a5 5 0 0 0 10 0c0-2.3-1.4-5.3-5-9.3z"
                  fill="#FFFFFF" />
            <rect x="10.6" y="16.5" width="2.8" height="4.2" rx="1" fill="#FFFFFF" />
          </svg>
          <div style={{
            position: 'absolute', top: -6, right: -4,
            background: '#FFCA66', border: '1.5px solid #E0A21F',
            color: '#6A4A2E',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
            padding: '2px 6px', borderRadius: 999, lineHeight: 1,
            boxShadow: '0 2px 3px rgba(120,92,52,0.20)',
          }}>W2</div>
        </div>

        {/* text */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
                      lineHeight: 1.05, gap: 2 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10,
            letterSpacing: '0.12em', color: '#9B886F', whiteSpace: 'nowrap',
          }}>CỔNG · THẾ GIỚI 2</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
            color: '#3F7D49', whiteSpace: 'nowrap', lineHeight: 1.05,
          }}>Rừng rậm</div>
        </div>

        {/* required-stars chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
          border: '1.5px solid #E0A21F',
          padding: '6px 11px 7px 8px', borderRadius: 999,
          boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)',
          flexShrink: 0,
        }}>
          <Star filled size={14} />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
            color: '#6A4A2E', lineHeight: 1,
          }}>18</span>
        </div>
      </div>
    );
  }

  // Small wooden signpost at the very bottom labelling the world entry.
  function StartSign() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: H - 90,
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        <div style={{
          background: '#FFFFFF', color: '#5B4636',
          border: '1.5px solid #E6D8BD',
          fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
          letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 999,
          boxShadow: '0 4px 10px rgba(120,92,52,0.20)',
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
          @keyframes gj-strip-float {
            0%,100% { transform: translateY(0); }
            50%     { transform: translateY(-6px); }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; }
          }
        `}</style>

        <Scene />
        <PathLayer />

        {/* Gate banner sits above L10 in the forest blend zone */}
        <GateBanner />

        {/* All ten node placements */}
        {NODES.map(n => <PlaceNode key={n.id} node={n} />)}

        <StartSign />
      </div>
    );
  }

  window.GJWorld1Strip = World1Strip;
})();
