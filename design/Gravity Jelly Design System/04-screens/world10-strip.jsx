/* world10-strip.jsx — Dải cuộn ĐẦY ĐỦ World 10 "Vũ trụ" (màn 91–100) — THẾ
   GIỚI CUỐI CÙNG.
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục =
   ĐƯỜNG SAO / dải ngân hà nối các HÀNH TINH, số node 91→100:
     • 91–95 node thường · 96 BREATHER · 97–99 thường · 100 BOSS CUỐI
     • trên 100: KHÔNG có cổng sang thế giới mới — thay bằng ĐỈNH VŨ TRỤ /
       FINALE (vương miện vàng, hào quang, "Hoàn thành hành trình")
   Biome World 10 (deep space): TRỜI ĐÊM #1C1248→#2E1F6B→#3A2A7A. GIỮA là
   DẢI NGÂN HÀ SÁNG (lavender) cho đường + node. HAI MÉP là TINH VÂN tím dày
   #5A3A9E/#3A2A7A cuộn vào trong + sao. Trên nền: hành tinh có vành, sao
   băng, sao chổi, vệ tinh, chòm sao, HỐ TRỌNG LỰC tím (signature) hút nhẹ,
   lấp lánh. Mặt trên = FINALE vàng rực. Exposes window.GJWorld10Strip.     */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const NODES = [
  { id: 91, x: 130, y: 2440, kind: 'reg', state: 'done', stars: 3, color: 'blue' },
  { id: 92, x: 240, y: 2250, kind: 'reg', state: 'done', stars: 2, color: 'pink' },
  { id: 93, x: 110, y: 2060, kind: 'reg', state: 'done', stars: 3, color: 'mint' },
  { id: 94, x: 240, y: 1870, kind: 'reg', state: 'current' },
  { id: 95, x: 120, y: 1680, kind: 'reg', state: 'locked' },
  { id: 96, x: 240, y: 1490, kind: 'breather', state: 'locked' },
  { id: 97, x: 110, y: 1290, kind: 'reg', state: 'locked' },
  { id: 98, x: 240, y: 1090, kind: 'reg', state: 'locked' },
  { id: 99, x: 150, y: 880, kind: 'reg', state: 'locked' },
  { id: 100, x: 180, y: 620, kind: 'boss', state: 'locked' }];


  const ENTRY = { x: 180, y: 2620 };
  const FINALE = { x: 180, y: 360 };
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
  const ALL_PTS = [ENTRY, ...NODES.map((n) => ({ x: n.x, y: n.y })), FINALE, EXIT];
  const FULL_PATH = pathD(ALL_PTS);
  const WALKED = pathD([ENTRY, NODES[0], NODES[1], NODES[2]]);

  // ─── scene ────────────────────────────────────────────────────────
  function Scene() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          {/* deep space (đáy ngả về bầu trời World 9 → đỉnh tối/finale sáng) */}
          <linearGradient id="w10s-space" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#3A2A7A" />
            <stop offset="0.5" stopColor="#241765" />
            <stop offset="0.86" stopColor="#1C1248" />
            <stop offset="1" stopColor="#2A1B5E" />
          </linearGradient>
          {/* milky-way bright corridor down the middle */}
          <linearGradient id="w10s-trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6E5CC8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#9E8CF0" stopOpacity="0.5" />
            <stop offset="1" stopColor="#6E5CC8" stopOpacity="0" />
          </linearGradient>
          {/* nebula banks 2 edges */}
          <linearGradient id="w10s-bank-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4A2E8E" />
            <stop offset="0.7" stopColor="#3A2576" />
            <stop offset="1" stopColor="#2A1B5E" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="w10s-bank-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#4A2E8E" />
            <stop offset="0.7" stopColor="#3A2576" />
            <stop offset="1" stopColor="#2A1B5E" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="w10s-neb" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#C4A7FF" stopOpacity="0.65" />
            <stop offset="0.5" stopColor="#8A6CF0" stopOpacity="0.32" />
            <stop offset="1" stopColor="#6353D6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w10s-neb2" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#F7A9C0" stopOpacity="0.4" />
            <stop offset="1" stopColor="#F7A9C0" stopOpacity="0" />
          </radialGradient>
          {/* top FINALE golden glow */}
          <radialGradient id="w10s-finale" cx="0.5" cy="0.35" r="0.6">
            <stop offset="0" stopColor="#FFF3CC" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#FFD074" stopOpacity="0.4" />
            <stop offset="1" stopColor="#FFD074" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="w10s-planet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9E8CF8" />
            <stop offset="1" stopColor="#6353D6" />
          </linearGradient>
          <radialGradient id="w10s-hole" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#160C3A" />
            <stop offset="0.55" stopColor="#160C3A" />
            <stop offset="0.72" stopColor="#7E6CF0" />
            <stop offset="0.86" stopColor="#A99CF6" />
            <stop offset="1" stopColor="#A99CF6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* base deep space */}
        <rect x="0" y="0" width={W} height={H} fill="url(#w10s-space)" />

        {/* ── Top FINALE band: golden glow ── */}
        <rect x="0" y="0" width={W} height="240" fill="url(#w10s-finale)" />

        {/* large nebula clouds scattered along the climb */}
        <ellipse cx={90} cy={1900} rx={150} ry={120} fill="url(#w10s-neb)" />
        <ellipse cx={280} cy={1200} rx={140} ry={110} fill="url(#w10s-neb2)" />
        <ellipse cx={110} cy={760} rx={130} ry={100} fill="url(#w10s-neb)" />
        <ellipse cx={260} cy={2200} rx={120} ry={90} fill="url(#w10s-neb2)" />

        {/* ── NEBULA BANKS on BOTH EDGES ── */}
        <NebulaBank side="l" />
        <NebulaBank side="r" />

        {/* ── dense starfield ── */}
        <Starfield />

        {/* ── milky-way band weaving along ── */}
        <MilkyWay />

        {/* ── ringed planets ── */}
        <Planet x={292} y={1640} r={40} ring />
        <Planet x={78} y={1080} r={30} ring={false} moon />
        <Planet x={286} y={2360} r={26} ring />
        <Planet x={86} y={2000} r={22} ring={false} />

        {/* ── gravity wells (signature mechanic) ── */}
        <GravityWell x={96} y={1420} s={0.78} />
        <GravityWell x={272} y={820} s={0.62} />

        {/* ── comets / shooting stars ── */}
        {[[300, 1820, '0s'], [70, 1480, '0.9s'], [296, 980, '1.4s'], [120, 2120, '0.5s']].
        map(([x, y, d], i) => <Comet key={`co${i}`} x={x} y={y} delay={d} />)}

        {/* ── satellites drifting ── */}
        {[[110, 1740, '0s'], [262, 1380, '0.7s'], [120, 940, '1.2s']].
        map(([x, y, d], i) => <Satellite key={`sa${i}`} x={x} y={y} delay={d} />)}

        {/* ── constellations ── */}
        <Constellation x={60} y={1640} pts={[[0,0],[26,18],[14,46],[44,40],[58,12]]} delay="0s" />
        <Constellation x={250} y={1080} pts={[[0,10],[22,0],[38,26],[16,40]]} delay="0.6s" />

        {/* ── twinkle sparkles ── */}
        {[[150, 2280], [120, 1560], [240, 1140], [160, 760], [200, 1940], [130, 1020], [280, 1300], [70, 700]].map(([x, y], i) =>
        <g key={`sp${i}`}>
          <circle cx={x} cy={y} r="1.8" fill="#FFFFFF" opacity="0.95" />
          <circle cx={x + 14} cy={y + 18} r="1.1" fill="#C4B5FA" opacity="0.85" />
        </g>
        )}

        {/* ── Drifting jelly astronauts ── */}
        <FloatJelly x={300} y={1170} size={20} color="mint" delay="0s" />
        <FloatJelly x={56} y={2000} size={22} color="yellow" delay="0.8s" />
        <FloatJelly x={300} y={2280} size={18} color="pink" delay="1.4s" />
      </svg>);

  }

  function Starfield() {
    const stars = [];
    let seed = 7;
    const rnd = () => (seed = seed * 1103515245 + 12345 & 0x7fffffff) / 0x7fffffff;
    for (let i = 0; i < 150; i++) {
      const x = Math.round(rnd() * W);
      const y = Math.round(rnd() * H);
      const r = 0.7 + rnd() * 1.6;
      const tw = rnd() > 0.7;
      if (tw) {
        stars.push(
          <g key={`sf${i}`} style={{ animation: 'gj-w10s-tw 2400ms ease-in-out infinite', animationDelay: `${rnd() * 2}s`, transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r={r} fill={rnd() > 0.85 ? '#C4B5FA' : '#FFFFFF'} />
          </g>);
      } else {
        stars.push(<circle key={`sf${i}`} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={0.5 + rnd() * 0.4} />);
      }
    }
    return <g>{stars}</g>;
  }

  function MilkyWay() {
    // soft luminous band following the serpentine, drawn as a wide blurred stroke
    return (
      <g opacity="0.5">
        <path d={FULL_PATH} fill="none" stroke="url(#w10s-trail)" strokeWidth="120" strokeLinecap="round" style={{ filter: 'blur(14px)' }} />
      </g>);

  }

  function NebulaBank({ side }) {
    const isL = side === 'l';
    const fill = isL ? 'url(#w10s-bank-l)' : 'url(#w10s-bank-r)';
    const X = (v) => isL ? v : W - v;
    const outerX = isL ? -24 : W + 24;
    const inset = (i) => [78, 60, 70, 62][i % 4];
    const pts = [];
    for (let y = 240, i = 0; y <= H + 40; y += 150, i++) {
      pts.push([X(inset(i)), y, i]);
    }
    let d = `M ${outerX} 240 L ${pts[0][0]} ${pts[0][1]} `;
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
    // glowing nebula lobes bulging inward
    const lobes = [];
    for (let y = 300, i = 0; y < H; y += 130, i++) {
      const ix = inset(Math.round((y - 240) / 150));
      const r = 30 + i % 3 * 14;
      lobes.push(<ellipse key={`nl${i}`} cx={X(ix - r * 0.3)} cy={y} rx={r} ry={r * 0.8} fill="url(#w10s-neb)" opacity="0.7" />);
    }
    // sparkle stars tucked in the bank
    const glints = [];
    for (let y = 360, i = 0; y < H; y += 220, i++) {
      glints.push(
        <g key={`gl${i}`} style={{ animation: 'gj-w10s-tw 2400ms ease-in-out infinite', animationDelay: `${i * 0.3}s`, transformOrigin: `${X(40)}px ${y}px` }}>
          <circle cx={X(40)} cy={y} r={i % 2 ? 1.8 : 2.6} fill={i % 3 ? '#FFFFFF' : '#C4B5FA'} />
        </g>);
    }
    return (
      <g>
        <path d={d} fill={fill} />
        {lobes}
        {glints}
        <path d={edge} fill="none" stroke="#7E6CF0" strokeWidth="6" opacity="0.30" strokeLinecap="round" />
        <path d={edge} fill="none" stroke="#C4B5FA" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      </g>);

  }

  function Planet({ x, y, r, ring, moon }) {
    return (
      <g style={{ animation: 'gj-w10s-bob 7s ease-in-out infinite', transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 0 14px rgba(169,156,246,0.45))' }}>
        {ring && <ellipse cx={x} cy={y} rx={r * 1.6} ry={r * 0.42} fill="none" stroke="#C4B5FA" strokeWidth="3.5" opacity="0.8" transform={`rotate(-20 ${x} ${y})`} />}
        <circle cx={x} cy={y} r={r} fill="url(#w10s-planet)" stroke="#A99CF6" strokeWidth="2.5" />
        <ellipse cx={x - r * 0.3} cy={y - r * 0.3} rx={r * 0.34} ry={r * 0.22} fill="#C4B5FA" opacity="0.5" />
        <circle cx={x + r * 0.32} cy={y + r * 0.28} r={r * 0.18} fill="#5847BE" opacity="0.6" />
        {ring && <ellipse cx={x} cy={y} rx={r * 1.6} ry={r * 0.42} fill="none" stroke="#8A77E6" strokeWidth="1.5" opacity="0.5" transform={`rotate(-20 ${x} ${y})`} strokeDasharray="2 5" />}
        {moon && <circle cx={x + r + 14} cy={y - r * 0.5} r={r * 0.32} fill="#B3C7F7" stroke="#7E9CE8" strokeWidth="1.5" />}
      </g>);

  }

  function GravityWell({ x, y, s = 1 }) {
    const R = 52 * s;
    return (
      <g>
        <circle cx={x} cy={y} r={R} fill="url(#w10s-hole)" />
        <g style={{ animation: 'gj-w10s-spin 7s linear infinite', transformOrigin: `${x}px ${y}px` }}>
          <ellipse cx={x} cy={y} rx={48 * s} ry={16 * s} fill="none" stroke="#A99CF6" strokeWidth={3 * s} opacity="0.85" transform={`rotate(-16 ${x} ${y})`} />
          <ellipse cx={x} cy={y} rx={62 * s} ry={21 * s} fill="none" stroke="#7E6CF0" strokeWidth={2 * s} opacity="0.5" transform={`rotate(-16 ${x} ${y})`} />
        </g>
        {[0, 72, 144, 216, 288].map((a, i) => {
          const r = a * Math.PI / 180;
          return <circle key={i} cx={x + Math.cos(r) * 58 * s} cy={y + Math.sin(r) * 20 * s} r={2.4 * s} fill="#FFFFFF" opacity="0.85"
                         style={{ animation: 'gj-w10s-tw 1800ms ease-in-out infinite', animationDelay: `${i * 0.25}s`, transformOrigin: `${x}px ${y}px` }} />;
        })}
        <circle cx={x} cy={y} r={20 * s} fill="#120A30" />
        <circle cx={x - 6 * s} cy={y - 6 * s} r={5 * s} fill="#3A2A7A" opacity="0.7" />
      </g>);

  }

  function Comet({ x, y, delay = '0s' }) {
    return (
      <g style={{ animation: 'gj-w10s-comet 5s ease-in-out infinite', animationDelay: delay, transformOrigin: `${x}px ${y}px` }} opacity="0.85">
        <path d={`M ${x} ${y} L ${x - 46} ${y + 30}`} stroke="#C4B5FA" strokeWidth="6" strokeLinecap="round" opacity="0.35" />
        <path d={`M ${x} ${y} L ${x - 34} ${y + 22}`} stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" opacity="0.7" />
        <circle cx={x} cy={y} r="4.5" fill="#FFFFFF" />
        <circle cx={x} cy={y} r="9" fill="#C4B5FA" opacity="0.3" />
      </g>);

  }

  function Satellite({ x, y, delay = '0s' }) {
    return (
      <g style={{ animation: 'gj-w10s-bob 6s ease-in-out infinite', animationDelay: delay, transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 0 6px rgba(169,156,246,0.4))' }}>
        <rect x={x - 6} y={y - 6} width="12" height="12" rx="3" fill="#B6A6F8" stroke="#7E6CF0" strokeWidth="1.5" />
        <rect x={x - 22} y={y - 5} width="12" height="10" rx="2" fill="#5847BE" stroke="#A99CF6" strokeWidth="1.2" />
        <rect x={x + 10} y={y - 5} width="12" height="10" rx="2" fill="#5847BE" stroke="#A99CF6" strokeWidth="1.2" />
        <line x1={x - 10} y1={y} x2={x + 10} y2={y} stroke="#A99CF6" strokeWidth="1.5" />
        <circle cx={x} cy={y - 12} r="2" fill="#FFE3A3" />
        <line x1={x} y1={y - 6} x2={x} y2={y - 11} stroke="#A99CF6" strokeWidth="1.2" />
      </g>);

  }

  function Constellation({ x, y, pts, delay = '0s' }) {
    let d = `M ${x + pts[0][0]} ${y + pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${x + pts[i][0]} ${y + pts[i][1]}`;
    return (
      <g opacity="0.7" style={{ animation: 'gj-w10s-tw 3000ms ease-in-out infinite', animationDelay: delay }}>
        <path d={d} fill="none" stroke="#A99CF6" strokeWidth="1" opacity="0.5" />
        {pts.map(([dx, dy], i) =>
        <g key={i}>
          <circle cx={x + dx} cy={y + dy} r={i === 0 || i === pts.length - 1 ? 2.4 : 1.8} fill="#FFFFFF" />
          <circle cx={x + dx} cy={y + dy} r="5" fill="#C4B5FA" opacity="0.2" />
        </g>
        )}
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
      <g style={{ animation: 'gj-w10s-float 3.6s ease-in-out infinite', animationDelay: delay,
        transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 0 6px rgba(169,156,246,0.5))' }}>
        {/* little helmet glow */}
        <circle cx={x} cy={y} r={size * 0.78} fill="#C4B5FA" opacity="0.14" />
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
        <path d={FULL_PATH} fill="none" stroke="rgba(20,12,48,0.5)"
        strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,5)" />
        <path d={FULL_PATH} fill="none" stroke="#4A3A8E"
        strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#6E5CC8"
        strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#C4B5FA"
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
        fill={filled ? '#FFC23D' : '#5A4A9E'} stroke={filled ? '#E0A21F' : '#8A77E6'}
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
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.34), lineHeight: 1,
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
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 5px 10px rgba(20,12,48,0.55))' }}>
        {/* faint glow ring so jelly reads against dark space */}
        <div style={{ position: 'absolute', left: -8, top: -8, width: size + 16, height: size + 16, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(196,181,250,0.4), rgba(196,181,250,0))' }} />
        <JellyBlock color={color} size={size} showEyes={false} />
        <NumberBadge n={n} size={size} />
        <StarArc stars={stars} size={14} width={size + 14} />
      </div>);

  }
  function LockedRegularNode({ n, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 8px rgba(20,12,48,0.5))' }}>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.34), lineHeight: 1,
          color: '#7A6A50', textShadow: '0 1px 0 rgba(255,255,255,0.40)', pointerEvents: 'none'
        }}>{n}</div>
        <StarArc stars={0} size={12} width={size + 8} />
        <div style={{
          position: 'absolute', right: -4, bottom: -4, width: 24, height: 24, borderRadius: '50%',
          background: '#8A7B62', border: '2px solid #FFFFFF', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 2px 4px rgba(20,12,48,0.5)'
        }}>
          <LockGlyph size={13} />
        </div>
      </div>);

  }
  function CurrentNode({ n, size = 64 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: -16, top: -16, width: size + 32, height: size + 32, borderRadius: '50%', background: 'rgba(255,159,104,0.30)', animation: 'gj-w10s-pulse 1600ms ease-out infinite' }} />
        <div style={{ position: 'absolute', left: -5, top: -5, width: size + 10, height: size + 10, borderRadius: '50%', background: 'rgba(255,159,104,0.40)', animation: 'gj-w10s-pulse 1600ms ease-out infinite', animationDelay: '320ms' }} />
        <div style={{
          position: 'relative', width: size, height: size, borderRadius: '50%', background: '#FFFFFF', border: '3px solid #FF9F68',
          boxShadow: '0 6px 18px rgba(20,12,48,0.5), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width={size - 16} height={size - 16} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A" strokeWidth="2" strokeDasharray="3 4" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#E97E45' }}>{n}</div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)', animation: 'gj-w10s-hop 1400ms ease-in-out infinite', filter: 'drop-shadow(0 4px 4px rgba(20,12,48,0.5))' }}>
          <JellyBlock color="pink" size={38} direction="down" expression="happy" />
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
        <div style={{ position: 'absolute', top: -10, left: size + 8, background: '#FFFFFF', color: '#8C7458', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.10em', padding: '4px 10px', borderRadius: 999, boxShadow: '0 3px 8px rgba(20,12,48,0.5)', whiteSpace: 'nowrap' }}>NGHỈ</div>
        <div style={{ position: 'absolute', top: -6, left: size + 4, width: 10, height: 10, borderRadius: '50%', background: '#FFD074', border: '1.5px solid #E0A21F' }} />
        <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 8px rgba(20,12,48,0.5))', opacity: 0.92 }}>
          <JellyBlock color="stone" size={size} showEyes={false} />
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={`M ${size * 0.30} ${size * 0.45} q 4 4 8 0`} fill="none" stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${size * 0.55} ${size * 0.45} q 4 4 8 0`} fill="none" stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: size * 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.28), lineHeight: 1, color: '#7A6A50', textShadow: '0 1px 0 rgba(255,255,255,0.40)', pointerEvents: 'none' }}>{n}</div>
        </div>
      </div>);

  }
  function BossNode({ n, size = 84 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 8px 18px rgba(126,108,240,0.55))' }}>
        <div style={{ position: 'absolute', left: -30, top: -30, right: -30, bottom: -30, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(169,156,246,0.7) 0%, rgba(126,108,240,0.36) 55%, rgba(126,108,240,0) 78%)', animation: 'gj-w10s-halo 2400ms ease-in-out infinite' }} />
        <svg width={size + 60} height={size + 60} viewBox="0 0 200 200" style={{ position: 'absolute', left: -30, top: -30, pointerEvents: 'none', animation: 'gj-w10s-spin 8s linear infinite', transformOrigin: '50% 50%' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const rad = a * Math.PI / 180;const cx = 100 + Math.cos(rad) * 86;const cy = 100 + Math.sin(rad) * 86;
            return <g key={a}><circle cx={cx} cy={cy} r="4.5" fill="#FFFFFF" opacity="0.95" /><circle cx={cx} cy={cy} r="2.5" fill="#A99CF6" /></g>;
          })}
        </svg>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: size * 0.5, height: size * 0.5, borderRadius: '50%', background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)', border: '3px solid #FFFFFF', boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LockGlyph size={Math.round(size * 0.26)} />
          </div>
        </div>
        <div style={{ position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)', color: '#FFFFFF', border: '2px solid #6353D6', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', padding: '4px 13px', borderRadius: 999, boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 1.5px 0 rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>BOSS CUỐI</div>
        <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #EFE0C9', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 999, boxShadow: '0 3px 6px rgba(20,12,48,0.5)' }}>màn {n}</div>
      </div>);

  }

  function PlaceNode({ node }) {
    let inner = null,half = 32;
    if (node.kind === 'boss') {inner = <BossNode n={node.id} size={84} />;half = 42;} else
    if (node.kind === 'breather') {inner = <BreatherNode n={node.id} size={48} />;half = 24;} else
    if (node.state === 'current') {inner = <CurrentNode n={node.id} size={64} />;half = 32;} else
    if (node.state === 'done') {inner = <DoneNode n={node.id} color={node.color} stars={node.stars} size={64} />;half = 32;} else
    {inner = <LockedRegularNode n={node.id} size={60} />;half = 30;}
    return (
      <div style={{ position: 'absolute', left: node.x - half, top: node.y - half, zIndex: node.kind === 'boss' ? 14 : node.state === 'current' ? 12 : 5 }}>
        {inner}
      </div>);

  }

  // ─── FINALE — đỉnh vũ trụ (thay cho cổng sang thế giới mới) ────────
  function FinaleBanner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: FINALE.y - 96, transform: 'translateX(-50%)', width: 300,
        display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 16
      }}>
        {/* radiant rays */}
        <svg width="300" height="190" viewBox="0 0 300 190" style={{ position: 'absolute', top: -8, left: 0, pointerEvents: 'none' }}>
          <g style={{ animation: 'gj-w10s-spin 30s linear infinite', transformOrigin: '150px 96px' }}>
            {Array.from({ length: 16 }).map((_, i) => {
              const a = i / 16 * Math.PI * 2;
              const x1 = 150 + Math.cos(a) * 46, y1 = 96 + Math.sin(a) * 46;
              const x2 = 150 + Math.cos(a) * (i % 2 ? 92 : 76), y2 = 96 + Math.sin(a) * (i % 2 ? 92 : 76);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD074" strokeWidth="3" strokeLinecap="round" opacity="0.5" />;
            })}
          </g>
        </svg>

        {/* crown trophy */}
        <div style={{
          position: 'relative', width: 92, height: 92, borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 28%, #FFF6D6 0%, #FFD074 55%, #E8A82E 100%)',
          border: '3px solid #FFFFFF', boxShadow: '0 10px 26px rgba(232,168,46,0.5), inset 0 -4px 0 rgba(200,140,30,0.4), inset 0 4px 0 rgba(255,255,255,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'gj-w10s-bob 3.4s ease-in-out infinite'
        }}>
          <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M8 32 L6 16 L16 24 L24 11 L32 24 L42 16 L40 32 Z" fill="#FFF1C2" stroke="#C8861E" strokeWidth="2" strokeLinejoin="round" />
            <rect x="8" y="32" width="32" height="6" rx="2" fill="#FFE08A" stroke="#C8861E" strokeWidth="2" />
            <circle cx="24" cy="11" r="3" fill="#F7A9C0" stroke="#C8861E" strokeWidth="1.5" />
            <circle cx="6" cy="16" r="2.6" fill="#A3E5D9" stroke="#C8861E" strokeWidth="1.3" />
            <circle cx="42" cy="16" r="2.6" fill="#B3C7F7" stroke="#C8861E" strokeWidth="1.3" />
            <circle cx="18" cy="30" r="2" fill="#E576A0" />
            <circle cx="30" cy="30" r="2" fill="#7E9CE8" />
          </svg>
        </div>

        {/* finale plate */}
        <div style={{
          marginTop: 10, width: 270, background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF6E2 100%)',
          border: '1.5px solid #F0D69C', borderRadius: 24, padding: '12px 16px 14px', textAlign: 'center',
          boxShadow: '0 14px 30px rgba(20,12,48,0.5), inset 0 2px 0 rgba(255,255,255,0.85)'
        }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.16em', color: '#C8861E' }}>ĐỈNH VŨ TRỤ · CHƯƠNG CUỐI</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#5B4636', lineHeight: 1.05, marginTop: 3 }}>Hoàn thành hành trình</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, color: '#9B886F', marginTop: 4 }}>Vượt màn 100 để cứu cả dải ngân hà jelly</div>
          <div style={{ margin: '10px auto 0', display: 'inline-flex', alignItems: 'center', gap: 5, background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)', border: '1.5px solid #E0A21F', padding: '5px 13px 6px', borderRadius: 999, boxShadow: '0 3px 6px rgba(200,150,40,0.3), inset 0 1.5px 0 rgba(255,255,255,0.6)' }}>
            <Star filled size={14} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#6A4A2E', lineHeight: 1 }}>300</span>
          </div>
        </div>
      </div>);

  }

  function StartSign() {
    return (
      <div style={{ position: 'absolute', left: '50%', top: H - 90, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ background: '#FFFFFF', color: '#5B4ECB', border: '1.5px solid #C9BEF0', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(20,12,48,0.5)', textTransform: 'uppercase' }}>Vũ trụ · chặng cuối</div>
      </div>);

  }

  function World10Strip() {
    return (
      <div style={{ position: 'relative', width: W, height: H, background: '#1C1248', fontFamily: 'var(--font-body)', color: '#EDE7FF', overflow: 'hidden' }}>
        <style>{`
          @keyframes gj-w10s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w10s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w10s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w10s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w10s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @keyframes gj-w10s-bob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes gj-w10s-comet { 0%,100%{transform:translate(0,0);opacity:0.4} 50%{transform:translate(-6px,4px);opacity:1} }
          @keyframes gj-w10s-tw    { 0%,100%{opacity:0.35;transform:scale(0.85)} 50%{opacity:1;transform:scale(1.2)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>
        <Scene />
        <PathLayer />
        <FinaleBanner />
        {NODES.map((n) => <PlaceNode key={n.id} node={n} />)}
        <StartSign />
      </div>);

  }

  window.GJWorld10Strip = World10Strip;
})();
