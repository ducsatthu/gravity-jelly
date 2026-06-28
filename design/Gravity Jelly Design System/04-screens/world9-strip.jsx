/* world9-strip.jsx — Dải cuộn ĐẦY ĐỦ World 9 "Bầu trời" (màn 81–90).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn = CẦU MÂY / cầu vồng nối các ĐẢO TRỜI, số node 81→90:
     • 81–85 node thường · 86 BREATHER · 87–89 thường · 90 BOSS
     • trên 90: CỔNG sang World 10 "Vũ trụ" (chip ★ 150); nền trên cổng
       blend sang palette Vũ trụ (#2A1B5E→#3A2A7A trời đêm, sao, tinh vân)
   Biome World 9 (nhìn TỪ TRÊN/giữa mây): BẦU TRỜI. GIỮA là HÀNH LANG TRỜI
   SÁNG #DCEAFB→#BBD3F7 cho đường + node, có cầu mây trắng nối các đảo. HAI
   MÉP là BỜ MÂY cumulus dày #FFFFFF/#E4EEFB cuộn vào trong + đảo trời cỏ
   xanh trôi nổi. Trên nền: đảo trời cỏ xanh có thác mây, cầu vồng, mặt
   trời ấm (nguồn sáng), khinh khí cầu, đàn chim, lấp lánh. Mặt trên = VŨ
   TRỤ (W10 preview). Exposes window.GJWorld9Strip.                       */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const NODES = [
  { id: 81, x: 130, y: 2440, kind: 'reg', state: 'done', stars: 3, color: 'mint' },
  { id: 82, x: 240, y: 2250, kind: 'reg', state: 'done', stars: 2, color: 'blue' },
  { id: 83, x: 110, y: 2060, kind: 'reg', state: 'done', stars: 3, color: 'pink' },
  { id: 84, x: 240, y: 1870, kind: 'reg', state: 'current' },
  { id: 85, x: 120, y: 1680, kind: 'reg', state: 'locked' },
  { id: 86, x: 240, y: 1490, kind: 'breather', state: 'locked' },
  { id: 87, x: 110, y: 1290, kind: 'reg', state: 'locked' },
  { id: 88, x: 240, y: 1090, kind: 'reg', state: 'locked' },
  { id: 89, x: 150, y: 880, kind: 'reg', state: 'locked' },
  { id: 90, x: 180, y: 620, kind: 'boss', state: 'locked' }];


  const ENTRY = { x: 180, y: 2620 };
  const GATE = { x: 180, y: 360 };
  const EXIT = { x: 180, y: -40 };

  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }
  const ALL_PTS = [ENTRY, ...NODES.map((n) => ({ x: n.x, y: n.y })), GATE, EXIT];
  const FULL_PATH = pathD(ALL_PTS);
  const WALKED = pathD([ENTRY, NODES[0], NODES[1], NODES[2]]);

  // ─── scene ────────────────────────────────────────────────────────
  function Scene() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          {/* nền trời sáng ở giữa (đáy sáng → đỉnh ngả vũ trụ) */}
          <linearGradient id="w9s-trail" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#E4EFFC" />
            <stop offset="0.5" stopColor="#C7DCF7" />
            <stop offset="1" stopColor="#A6C4F2" />
          </linearGradient>
          {/* bờ mây cumulus 2 mép */}
          <linearGradient id="w9s-bank-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#EFF5FF" />
            <stop offset="1" stopColor="#D7E5FB" />
          </linearGradient>
          <linearGradient id="w9s-bank-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#EFF5FF" />
            <stop offset="1" stopColor="#D7E5FB" />
          </linearGradient>
          {/* top band = VŨ TRỤ nhìn TỪ DƯỚI LÊN (W10 preview) */}
          <linearGradient id="w9s-space" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#241765" />
            <stop offset="0.55" stopColor="#33237A" />
            <stop offset="1" stopColor="#5B4BAE" />
          </linearGradient>
          <radialGradient id="w9s-nebula" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#C4A7FF" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#8A6CF0" stopOpacity="0.4" />
            <stop offset="1" stopColor="#6353D6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w9s-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFF7DA" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#FFE08A" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFE08A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="w9s-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9BE08C" />
            <stop offset="1" stopColor="#6FC97F" />
          </linearGradient>
          <linearGradient id="w9s-island" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#CDA9E8" />
            <stop offset="1" stopColor="#9B7FD6" />
          </linearGradient>
        </defs>

        {/* base bright sky */}
        <rect x="0" y="0" width={W} height={H} fill="url(#w9s-trail)" />

        {/* ── Top band: World 10 Vũ trụ — nhìn TỪ DƯỚI LÊN ── */}
        <rect x="0" y="0" width={W} height="200" fill="url(#w9s-space)" />
        {/* nebula glow + planet */}
        <ellipse cx={92} cy={70} rx={120} ry={80} fill="url(#w9s-nebula)" />
        <circle cx={292} cy={66} r={34} fill="#8E7CF4" stroke="#A99CF6" strokeWidth="2.5" />
        <ellipse cx={292} cy={66} rx={52} ry={15} fill="none" stroke="#C4B5FA" strokeWidth="3" opacity="0.8" transform="rotate(-18 292 66)" />
        <ellipse cx={284} cy={58} rx={11} ry={7} fill="#B6A6F8" opacity="0.7" />
        {/* twinkling stars */}
        {[[40,110,1.9],[120,150,1.4],[180,60,2.1],[230,130,1.5],[330,120,1.8],[70,60,1.4],[150,110,1.6],[260,70,1.3],[20,150,1.4],[200,170,1.7],[310,170,1.4],[100,40,1.5]].map(([x, y, r], i) =>
        <g key={`st${i}`} style={{ animation: 'gj-w9s-tw 2200ms ease-in-out infinite', animationDelay: `${i * 0.2}s`, transformOrigin: `${x}px ${y}px` }}>
          <circle cx={x} cy={y} r={r} fill="#FFFFFF" />
          <circle cx={x} cy={y} r={r * 2.6} fill="#FFFFFF" opacity="0.18" />
        </g>
        )}

        {/* ── Atmosphere rim where space meets sky ── */}
        <path d="M0 192 q 90 26 180 8 t 180 16 L360 250 L0 250 Z" fill="#7FA6EE" opacity="0.55" />
        <path d="M0 200 q 90 24 180 8 t 180 16" fill="none" stroke="#DCEAFB" strokeWidth="3" opacity="0.9" strokeLinecap="round" />
        <path d="M0 208 q 90 22 180 8 t 180 14" fill="none" stroke="#A99CF6" strokeWidth="2" opacity="0.65" strokeLinecap="round" />

        {/* ── CLOUD BANKS on BOTH EDGES ── */}
        <CloudBank side="l" />
        <CloudBank side="r" />

        {/* ── Big warm sun (light source, upper-right) ── */}
        <BigSun x={296} y={430} />

        {/* ── rainbow arcs weaving along the climb ── */}
        <Rainbow cx={150} cy={2120} w={150} flip={false} />
        <Rainbow cx={240} cy={1380} w={130} flip />
        <Rainbow cx={150} cy={760} w={140} flip={false} />

        {/* ── floating grass sky-islands (pockets OPPOSITE the path side) ── */}
        {[[286, 2340, 1.05], [80, 1980, 0.92], [292, 1600, 1.0], [96, 1180, 0.9], [288, 880, 0.86], [150, 2200, 0.78]].
        map(([x, y, s], i) => <SkyIsland key={`si${i}`} x={x} y={y} s={s} delay={`${i * 0.5}s`} />)}

        {/* ── fluffy drifting clouds ── */}
        {[[300, 1430, 1.0, '0s'], [70, 1320, 0.85, '0.6s'], [296, 700, 0.9, '1.1s'], [120, 1700, 0.8, '1.5s'], [240, 1040, 0.75, '0.3s'], [60, 2080, 0.9, '0.9s']].
        map(([x, y, s, d], i) => <DriftCloud key={`dc${i}`} cx={x} cy={y} s={s} delay={d} />)}

        {/* ── hot-air balloons ── */}
        {[[100, 1500, 'pink', '0s'], [270, 1820, 'yellow', '0.7s'], [120, 980, 'mint', '1.2s']].
        map(([x, y, c, d], i) => <Balloon key={`ba${i}`} x={x} y={y} color={c} delay={d} />)}

        {/* ── bird flocks ── */}
        {[[60, 1240, '0s'], [300, 2060, '0.8s'], [80, 700, '1.3s'], [250, 1620, '0.4s']].
        map(([x, y, d], i) => <Birds key={`bd${i}`} x={x} y={y} delay={d} />)}

        {/* ── sky sparkles ── */}
        {[[150, 2280], [120, 1560], [240, 1140], [160, 760], [200, 1940], [130, 1020], [280, 1300]].map(([x, y], i) =>
        <g key={`sp${i}`}>
          <circle cx={x} cy={y} r="1.8" fill="#FFFFFF" opacity="0.95" />
          <circle cx={x + 14} cy={y + 18} r="1.1" fill="#FFF4DC" opacity="0.85" />
        </g>
        )}

        {/* ── Drifting jelly characters ── */}
        <FloatJelly x={300} y={1170} size={20} color="blue" delay="0s" />
        <FloatJelly x={56} y={2000} size={22} color="pink" delay="0.8s" />
        <FloatJelly x={300} y={2280} size={18} color="mint" delay="1.4s" />
      </svg>);

  }

  // ── big warm sun acting as the upper light source ──
  function BigSun({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 16px rgba(255,224,138,0.6))' }}>
        <circle cx={x} cy={y} r={130} fill="url(#w9s-sun)" opacity="0.55" />
        <circle cx={x} cy={y} r={36} fill="#FFF1C2" stroke="#FFD074" strokeWidth="3" />
        <g style={{ animation: 'gj-w9s-spin 26s linear infinite', transformOrigin: `${x}px ${y}px` }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const rad = a * Math.PI / 180;
            const x1 = x + Math.cos(rad) * 46, y1 = y + Math.sin(rad) * 46;
            const x2 = x + Math.cos(rad) * 60, y2 = y + Math.sin(rad) * 60;
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD074" strokeWidth="4" strokeLinecap="round" opacity="0.85" />;
          })}
        </g>
        <ellipse cx={x - 11} cy={y - 9} rx={13} ry={9} fill="#FFFCEC" opacity="0.7" />
      </g>);

  }

  // ── rainbow arc ──
  function Rainbow({ cx, cy, w, flip }) {
    const bands = ['#F7A9C0', '#FFC061', '#FFE08A', '#9BE08C', '#8FB6F2', '#A99CF6'];
    const r0 = w / 2;
    const sweep = flip ? 0 : 1;
    return (
      <g opacity="0.78" style={{ filter: 'drop-shadow(0 3px 5px rgba(80,110,170,0.18))' }}>
        {bands.map((c, i) => {
          const r = r0 - i * 6;
          const y = cy;
          return (
            <path key={i}
              d={`M ${cx - r} ${y} A ${r} ${r} 0 0 ${sweep} ${cx + r} ${y}`}
              fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" />);

        })}
        {/* end clouds */}
        <DriftCloud cx={cx - r0 + 4} cy={cy} s={0.6} delay="0s" />
        <DriftCloud cx={cx + r0 - 4} cy={cy} s={0.6} delay="0s" />
      </g>);

  }

  // ── fluffy drifting cloud ──
  function DriftCloud({ cx, cy, s = 1, delay = '0s' }) {
    return (
      <g style={{ animation: 'gj-w9s-drift 7s ease-in-out infinite', animationDelay: delay, transformOrigin: `${cx}px ${cy}px`, filter: 'drop-shadow(0 4px 6px rgba(90,120,180,0.22))' }}>
        <ellipse cx={cx} cy={cy} rx={36 * s} ry={16 * s} fill="#FFFFFF" />
        <circle cx={cx - 19 * s} cy={cy - 2 * s} r={14 * s} fill="#FFFFFF" />
        <circle cx={cx - 2 * s} cy={cy - 10 * s} r={17 * s} fill="#FFFFFF" />
        <circle cx={cx + 17 * s} cy={cy - 3 * s} r={13 * s} fill="#FFFFFF" />
        <ellipse cx={cx} cy={cy + 10 * s} rx={34 * s} ry={8 * s} fill="#E2ECFB" opacity="0.85" />
      </g>);

  }

  // ── floating grass-topped sky island ──
  function SkyIsland({ x, y, s = 1, delay = '0s' }) {
    const w = 64 * s;
    return (
      <g style={{ animation: 'gj-w9s-bob 5s ease-in-out infinite', animationDelay: delay, transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 8px 10px rgba(80,110,170,0.22))' }}>
        {/* floating rock underside (cosmos-tinted) */}
        <path d={`M ${x - w / 2} ${y} Q ${x - w / 2 - 6} ${y + 26 * s} ${x - w * 0.18} ${y + 40 * s} Q ${x} ${y + 54 * s} ${x + w * 0.2} ${y + 38 * s} Q ${x + w / 2 + 6} ${y + 24 * s} ${x + w / 2} ${y} Z`}
          fill="url(#w9s-island)" stroke="#7E66C6" strokeWidth="1.5" strokeLinejoin="round" />
        {/* grass top */}
        <ellipse cx={x} cy={y} rx={w / 2} ry={13 * s} fill="url(#w9s-grass)" stroke="#56B36A" strokeWidth="1.5" />
        <ellipse cx={x - w * 0.16} cy={y - 3 * s} rx={w * 0.22} ry={5 * s} fill="#B6EDA5" opacity="0.8" />
        {/* tiny grass blades */}
        {[-0.3, -0.05, 0.18, 0.34].map((o, i) =>
        <path key={i} d={`M ${x + w * o} ${y - 3 * s} q 2 -7 0 -11`} fill="none" stroke="#56B36A" strokeWidth="1.6" strokeLinecap="round" />
        )}
        {/* cloud waterfall trickling off the edge */}
        <path d={`M ${x - w * 0.32} ${y + 6 * s} q -3 16 1 30`} fill="none" stroke="#FFFFFF" strokeWidth={4 * s} strokeLinecap="round" opacity="0.75" />
        <circle cx={x - w * 0.30} cy={y + 38 * s} r={4 * s} fill="#FFFFFF" opacity="0.7" />
      </g>);

  }

  // ── hot-air balloon ──
  function Balloon({ x, y, color, delay = '0s' }) {
    const p = {
      yellow: { f: '#FFE3A3', e: '#E8B85C' },
      mint: { f: '#A3E5D9', e: '#5FC3B2' },
      pink: { f: '#F7A9C0', e: '#E576A0' },
      blue: { f: '#B3C7F7', e: '#7E9CE8' }
    }[color] || { f: '#FFE3A3', e: '#E8B85C' };
    return (
      <g style={{ animation: 'gj-w9s-bob 6s ease-in-out infinite', animationDelay: delay, transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 6px 8px rgba(80,110,170,0.24))' }}>
        <path d={`M ${x} ${y - 24} C ${x - 22} ${y - 24} ${x - 20} ${y + 4} ${x - 6} ${y + 18} L ${x + 6} ${y + 18} C ${x + 20} ${y + 4} ${x + 22} ${y - 24} ${x} ${y - 24} Z`}
          fill={p.f} stroke={p.e} strokeWidth="2" />
        <path d={`M ${x} ${y - 24} C ${x - 8} ${y - 24} ${x - 7} ${y + 6} ${x} ${y + 18} C ${x + 7} ${y + 6} ${x + 8} ${y - 24} ${x} ${y - 24} Z`} fill="#FFFFFF" opacity="0.4" />
        <ellipse cx={x - 7} cy={y - 16} rx="4" ry="6" fill="#FFFFFF" opacity="0.6" />
        <path d={`M ${x - 6} ${y + 18} L ${x - 4} ${y + 27} M ${x + 6} ${y + 18} L ${x + 4} ${y + 27}`} stroke={p.e} strokeWidth="1.2" />
        <rect x={x - 5} y={y + 27} width="10" height="7" rx="2" fill="#C58A52" stroke="#9C6B3C" strokeWidth="1.2" />
      </g>);

  }

  // ── bird flock ──
  function Birds({ x, y, delay = '0s' }) {
    return (
      <g style={{ animation: 'gj-w9s-fly 4s ease-in-out infinite', animationDelay: delay, transformOrigin: `${x}px ${y}px` }} opacity="0.7">
        {[[0, 0, 1], [18, 6, 0.8], [-16, 7, 0.8]].map(([dx, dy, sc], i) =>
        <path key={i} d={`M ${x + dx - 7 * sc} ${y + dy} q ${7 * sc} -6 ${7 * sc} 0 q 0 -6 ${7 * sc} 0`} fill="none" stroke="#5B6B8C" strokeWidth="1.8" strokeLinecap="round" />
        )}
      </g>);

  }

  function CloudBank({ side }) {
    // BỜ MÂY một mép — cumulus dày cuộn vào trong, mép trong uốn lượn, có
    // đảo trời nhỏ + lấp lánh nắng.
    const isL = side === 'l';
    const fill = isL ? 'url(#w9s-bank-l)' : 'url(#w9s-bank-r)';
    const X = (v) => isL ? v : W - v;
    const outerX = isL ? -24 : W + 24;
    const inset = (i) => [72, 56, 66, 58][i % 4];
    const pts = [];
    for (let y = 250, i = 0; y <= H + 40; y += 150, i++) {
      pts.push([X(inset(i)), y, i]);
    }
    let d = `M ${outerX} 250 L ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],[x, y] = pts[i];
      const my = (py + y) / 2;
      d += `Q ${px} ${my} ${x} ${y} `;
    }
    d += `L ${outerX} ${H + 40} Z`;
    let edge = `M ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],[x, y] = pts[i];
      edge += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    // puffy cloud lobes bulging inward along the bank
    const lobes = [];
    for (let y = 290, i = 0; y < H; y += 96, i++) {
      const ix = inset(Math.round((y - 250) / 150));
      const r = 18 + i % 3 * 7;
      lobes.push(<circle key={`cl${i}`} cx={X(ix - r * 0.4)} cy={y} r={r} fill="#FFFFFF" opacity="0.96" />);
    }
    // soft sun sparkles tucked in the bank
    const glints = [];
    for (let y = 420, i = 0; y < H; y += 300, i++) {
      glints.push(
        <g key={`gl${i}`} style={{ animation: 'gj-w9s-tw 2400ms ease-in-out infinite', animationDelay: `${i * 0.3}s`, transformOrigin: `${X(36)}px ${y}px` }}>
          <circle cx={X(36)} cy={y} r={i % 2 ? 2.2 : 3} fill="#FFF4DC" />
        </g>);
    }
    return (
      <g>
        <path d={d} fill={fill} />
        {lobes}
        {glints}
        {/* soft blue underside shade just inside the trail */}
        <path d={edge} fill="none" stroke="#BCD3F4" strokeWidth="8" opacity="0.32" strokeLinecap="round" />
        <path d={edge} fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.9" strokeLinecap="round" />
      </g>);

  }

  function FloatJelly({ x, y, size, color, delay }) {
    const p = {
      yellow: { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' },
      mint: { f: '#A3E5D9', e: '#5FC3B2', s: '#CBF2EB' },
      pink: { f: '#F7A9C0', e: '#E576A0', s: '#FBD0DF' },
      blue: { f: '#B3C7F7', e: '#7E9CE8', s: '#D6E1FB' }
    }[color] || { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' };
    return (
      <g style={{ animation: 'gj-w9s-float 3.6s ease-in-out infinite', animationDelay: delay,
        transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 4px 4px rgba(80,110,170,0.3))' }}>
        <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={Math.round(size * 0.28)}
        fill={p.f} stroke={p.e} strokeWidth="2" />
        <ellipse cx={x} cy={y - size * 0.18} rx={size * 0.34} ry={size * 0.12} fill={p.s} opacity="0.95" />
        <circle cx={x - size * 0.18} cy={y - size * 0.04} r={size * 0.07} fill="#3B2A18" />
        <circle cx={x + size * 0.18} cy={y - size * 0.04} r={size * 0.07} fill="#3B2A18" />
      </g>);

  }

  // ─── path ─────────────────────────────────────────────────────────
  function PathLayer() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{ position: 'absolute', inset: 0, display: 'block', pointerEvents: 'none' }}>
        <path d={FULL_PATH} fill="none" stroke="rgba(90,120,180,0.20)"
        strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,5)" />
        <path d={FULL_PATH} fill="none" stroke="#C9DCF5"
        strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#EFF6FF"
        strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#9BB8EC"
        strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 11" />
        <path d={WALKED} fill="none" stroke="#FF9F68"
        strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
        <path d={WALKED} fill="none" stroke="#FFC59A"
        strokeWidth="6" strokeLinecap="round" strokeDasharray="4 9" opacity="0.9" />
      </svg>);

  }

  // ─── stars / node primitives (shared) ────────────────────────────
  function Star({ filled = false, size = 14 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
        fill={filled ? '#FFC23D' : '#CBD9F0'} stroke={filled ? '#E0A21F' : '#9FB4D8'}
        strokeWidth="1.6" strokeLinejoin="round" />
      </svg>);

  }
  function StarArc({ stars = 3, size = 14, width = 64 }) {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: -size - 6, transform: 'translateX(-50%)',
        width, height: size + 8, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', pointerEvents: 'none'
      }}>
        <div style={{ transform: 'translateY(5px) rotate(-22deg)' }}><Star filled={stars >= 1} size={size} /></div>
        <div style={{ transform: 'translateY(-2px)' }}><Star filled={stars >= 2} size={size + 2} /></div>
        <div style={{ transform: 'translateY(5px) rotate(22deg)' }}><Star filled={stars >= 3} size={size} /></div>
      </div>);

  }
  function NumberBadge({ n, size, color = '#6A4A2E' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.36), lineHeight: 1,
        color, textShadow: '0 1px 0 rgba(255,255,255,0.55)', pointerEvents: 'none'
      }}>{n}</div>);

  }
  function LockGlyph({ size = 18 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
        <path d="M8 11V8.5a4 4 0 1 1 8 0V11" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="5" y="11" width="14" height="9" rx="2.5" fill="#FFFFFF" />
        <circle cx="12" cy="15" r="1.4" fill="#A89A82" />
        <rect x="11.3" y="15" width="1.4" height="3" rx="0.6" fill="#A89A82" />
      </svg>);

  }

  function DoneNode({ n, color, stars, size = 64 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 5px 8px rgba(70,100,160,0.4))' }}>
        <JellyBlock color={color} size={size} showEyes={false} />
        <NumberBadge n={n} size={size} />
        <StarArc stars={stars} size={14} width={size + 14} />
      </div>);

  }
  function LockedRegularNode({ n, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 6px rgba(70,100,160,0.38))' }}>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.36), lineHeight: 1,
          color: '#7A6A50', textShadow: '0 1px 0 rgba(255,255,255,0.40)', pointerEvents: 'none'
        }}>{n}</div>
        <StarArc stars={0} size={12} width={size + 8} />
        <div style={{
          position: 'absolute', right: -4, bottom: -4, width: 24, height: 24, borderRadius: '50%',
          background: '#8A7B62', border: '2px solid #FFFFFF', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 2px 4px rgba(70,100,160,0.42)'
        }}>
          <LockGlyph size={13} />
        </div>
      </div>);

  }
  function CurrentNode({ n, size = 64 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: -16, top: -16, width: size + 32, height: size + 32, borderRadius: '50%', background: 'rgba(255,159,104,0.26)', animation: 'gj-w9s-pulse 1600ms ease-out infinite' }} />
        <div style={{ position: 'absolute', left: -5, top: -5, width: size + 10, height: size + 10, borderRadius: '50%', background: 'rgba(255,159,104,0.36)', animation: 'gj-w9s-pulse 1600ms ease-out infinite', animationDelay: '320ms' }} />
        <div style={{
          position: 'relative', width: size, height: size, borderRadius: '50%', background: '#FFFFFF', border: '3px solid #FF9F68',
          boxShadow: '0 6px 16px rgba(70,100,160,0.36), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width={size - 16} height={size - 16} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A" strokeWidth="2" strokeDasharray="3 4" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#E97E45' }}>{n}</div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)', animation: 'gj-w9s-hop 1400ms ease-in-out infinite', filter: 'drop-shadow(0 4px 4px rgba(70,100,160,0.4))' }}>
          <JellyBlock color="blue" size={38} direction="down" expression="happy" />
        </div>
        <div style={{
          position: 'absolute', left: '50%', top: size + 10, transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)', color: '#FFFFFF',
          border: '2px solid #E97E45', borderBottom: '3px solid #C8662F', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          padding: '5px 14px 6px', borderRadius: 999, boxShadow: '0 6px 12px rgba(201,102,47,0.4), inset 0 2px 0 rgba(255,197,154,0.6)', whiteSpace: 'nowrap'
        }}>Chơi ngay</div>
      </div>);

  }
  function BreatherNode({ n, size = 48 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: -10, left: size + 8, background: '#FFFFFF', color: '#8C7458', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.10em', padding: '4px 10px', borderRadius: 999, boxShadow: '0 3px 8px rgba(70,100,160,0.36)', whiteSpace: 'nowrap' }}>NGHỈ</div>
        <div style={{ position: 'absolute', top: -6, left: size + 4, width: 10, height: 10, borderRadius: '50%', background: '#FFD074', border: '1.5px solid #E0A21F' }} />
        <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 6px rgba(70,100,160,0.38))', opacity: 0.92 }}>
          <JellyBlock color="stone" size={size} showEyes={false} />
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={`M ${size * 0.30} ${size * 0.45} q 4 4 8 0`} fill="none" stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${size * 0.55} ${size * 0.45} q 4 4 8 0`} fill="none" stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: size * 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.28), lineHeight: 1, color: '#7A6A50', textShadow: '0 1px 0 rgba(255,255,255,0.40)', pointerEvents: 'none' }}>{n}</div>
        </div>
      </div>);

  }
  function BossNode({ n, size = 80 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 8px 16px rgba(126,108,240,0.45))' }}>
        <div style={{ position: 'absolute', left: -28, top: -28, right: -28, bottom: -28, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(169,156,246,0.6) 0%, rgba(126,108,240,0.32) 55%, rgba(126,108,240,0) 78%)', animation: 'gj-w9s-halo 2400ms ease-in-out infinite' }} />
        <svg width={size + 56} height={size + 56} viewBox="0 0 200 200" style={{ position: 'absolute', left: -28, top: -28, pointerEvents: 'none', animation: 'gj-w9s-spin 8s linear infinite', transformOrigin: '50% 50%' }}>
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const rad = a * Math.PI / 180;const cx = 100 + Math.cos(rad) * 84;const cy = 100 + Math.sin(rad) * 84;
            return <g key={a}><circle cx={cx} cy={cy} r="4.5" fill="#FFFFFF" opacity="0.95" /><circle cx={cx} cy={cy} r="2.5" fill="#A99CF6" /></g>;
          })}
        </svg>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: size * 0.5, height: size * 0.5, borderRadius: '50%', background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)', border: '3px solid #FFFFFF', boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LockGlyph size={Math.round(size * 0.28)} />
          </div>
        </div>
        <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)', color: '#FFFFFF', border: '2px solid #6353D6', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', padding: '4px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>BOSS</div>
        <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #EFE0C9', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 999, boxShadow: '0 3px 6px rgba(70,100,160,0.36)' }}>màn {n}</div>
      </div>);

  }

  function PlaceNode({ node }) {
    let inner = null,half = 32;
    if (node.kind === 'boss') {inner = <BossNode n={node.id} size={80} />;half = 40;} else
    if (node.kind === 'breather') {inner = <BreatherNode n={node.id} size={48} />;half = 24;} else
    if (node.state === 'current') {inner = <CurrentNode n={node.id} size={64} />;half = 32;} else
    if (node.state === 'done') {inner = <DoneNode n={node.id} color={node.color} stars={node.stars} size={64} />;half = 32;} else
    {inner = <LockedRegularNode n={node.id} size={60} />;half = 30;}
    return (
      <div style={{ position: 'absolute', left: node.x - half, top: node.y - half, zIndex: node.kind === 'boss' ? 14 : node.state === 'current' ? 12 : 5 }}>
        {inner}
      </div>);

  }

  // ─── gate to World 10 (Vũ trụ) ────────────────────────────────────
  function GateBanner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 38, transform: 'translateX(-50%)', width: 312,
        background: '#FFFFFF', border: '1.5px solid #C9BEF0', borderRadius: 999, padding: '8px 14px 8px 8px',
        display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 28px rgba(83,68,196,0.30), 0 4px 8px rgba(120,92,52,0.14)', zIndex: 16
      }}>
        {/* World 10 cosmos badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #4A3A92 0%, #2E1F6B 60%, #1C1248 100%)',
          border: '2.5px solid #8E7CF4', boxShadow: 'inset 0 -3px 0 rgba(20,12,60,0.5), inset 0 3px 0 rgba(169,156,246,0.5), 0 2px 4px rgba(83,68,196,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
        }}>
          {/* planet + ring + stars glyph */}
          <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="22" cy="20" r="9" fill="#8E7CF4" stroke="#A99CF6" strokeWidth="1.5" />
            <ellipse cx="22" cy="20" rx="15" ry="4.5" fill="none" stroke="#C4B5FA" strokeWidth="1.8" transform="rotate(-20 22 20)" />
            <circle cx="9" cy="11" r="1.4" fill="#FFFFFF" />
            <circle cx="31" cy="9" r="1.1" fill="#FFFFFF" />
            <circle cx="8" cy="28" r="1.2" fill="#FFFFFF" />
          </svg>
          <div style={{ position: 'absolute', top: -6, right: -4, background: '#6353D6', border: '1.5px solid #A99CF6', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, padding: '2px 6px', borderRadius: 999, lineHeight: 1, boxShadow: '0 2px 3px rgba(83,68,196,0.4)' }}>W10</div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.05, gap: 2 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', color: '#9B886F', whiteSpace: 'nowrap' }}>CỔNG · THẾ GIỚI 10</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#5B4ECB', whiteSpace: 'nowrap', lineHeight: 1.05 }}>Vũ trụ</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)', border: '1.5px solid #E0A21F', padding: '6px 11px 7px 8px', borderRadius: 999, boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)', flexShrink: 0 }}>
          <Star filled size={14} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#6A4A2E', lineHeight: 1 }}>150</span>
        </div>
      </div>);

  }

  function StartSign() {
    return (
      <div style={{ position: 'absolute', left: '50%', top: H - 90, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ background: '#FFFFFF', color: '#3F6FB5', border: '1.5px solid #C5D8F2', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(70,100,160,0.34)', textTransform: 'uppercase' }}>Bầu trời · tiếp tục</div>
      </div>);

  }

  function World9Strip() {
    return (
      <div style={{ position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden' }}>
        <style>{`
          @keyframes gj-w9s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w9s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w9s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w9s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w9s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @keyframes gj-w9s-bob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes gj-w9s-drift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(8px)} }
          @keyframes gj-w9s-fly   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,-5px)} }
          @keyframes gj-w9s-tw    { 0%,100%{opacity:0.4;transform:scale(0.85)} 50%{opacity:1;transform:scale(1.2)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>
        <Scene />
        <PathLayer />
        <GateBanner />
        {NODES.map((n) => <PlaceNode key={n.id} node={n} />)}
        <StartSign />
      </div>);

  }

  window.GJWorld9Strip = World9Strip;
})();
