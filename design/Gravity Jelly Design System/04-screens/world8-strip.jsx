/* world8-strip.jsx — Dải cuộn ĐẦY ĐỦ World 8 "Núi lửa" (màn 71–80).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn, số node 71→80:
     • 71–75 node thường · 76 BREATHER · 77–79 thường · 80 BOSS
     • trên 80: CỔNG sang World 9 "Bầu trời" (chip ★ 130); nền trên cổng
       blend sang palette Bầu trời (#BBD3F7→#D8E6FB trời sáng, mây trắng)
   Biome World 8 (nhìn TỪ TRÊN XUỐNG): NÚI LỬA. GIỮA là NỀN NHAM THẠCH
   ấm phát sáng #E8C9A8→#B07F52 (hành lang x 72–290) cho đường + node, có
   khe nứt dung nham phát sáng len lỏi. HAI MÉP là VÁCH ĐÁ N�ham THẠCH tối
   #3A1C12→#5A3322 với khe dung nham #FF7A3D, miệng phun lửa, gai obsidian
   chĩa vào trong, đá magma. Trên nền: hồ dung nham, miệng phun lửa, gai
   obsidian, đá núi lửa, khói/tàn lửa bốc lên, mạch nham thạch. Mặt trên =
   BẦU TRỜI (W9 preview). Exposes window.GJWorld8Strip.                   */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const NODES = [
  { id: 71, x: 130, y: 2440, kind: 'reg', state: 'done', stars: 3, color: 'mint' },
  { id: 72, x: 240, y: 2250, kind: 'reg', state: 'done', stars: 2, color: 'blue' },
  { id: 73, x: 110, y: 2060, kind: 'reg', state: 'done', stars: 3, color: 'pink' },
  { id: 74, x: 240, y: 1870, kind: 'reg', state: 'current' },
  { id: 75, x: 120, y: 1680, kind: 'reg', state: 'locked' },
  { id: 76, x: 240, y: 1490, kind: 'breather', state: 'locked' },
  { id: 77, x: 110, y: 1290, kind: 'reg', state: 'locked' },
  { id: 78, x: 240, y: 1090, kind: 'reg', state: 'locked' },
  { id: 79, x: 150, y: 880, kind: 'reg', state: 'locked' },
  { id: 80, x: 180, y: 620, kind: 'boss', state: 'locked' }];


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
          {/* nền nham thạch ấm phát sáng ở giữa */}
          <linearGradient id="w8s-trail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EACFAE" />
            <stop offset="0.5" stopColor="#D2A878" />
            <stop offset="1" stopColor="#BC8C5E" />
          </linearGradient>
          {/* vách đá nham thạch 2 mép (tối) */}
          <linearGradient id="w8s-wall-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2C120B" />
            <stop offset="0.7" stopColor="#43251A" />
            <stop offset="1" stopColor="#5A3322" />
          </linearGradient>
          <linearGradient id="w8s-wall-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#2C120B" />
            <stop offset="0.7" stopColor="#43251A" />
            <stop offset="1" stopColor="#5A3322" />
          </linearGradient>
          {/* top band = BẦU TRỜI nhìn TỪ DƯỚI LÊN (W9 preview) */}
          <linearGradient id="w8s-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9BBEF5" />
            <stop offset="0.55" stopColor="#BBD3F7" />
            <stop offset="1" stopColor="#DCEAFB" />
          </linearGradient>
          <radialGradient id="w8s-lava" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFE6A8" stopOpacity="0.95" />
            <stop offset="0.45" stopColor="#FF7A3D" stopOpacity="0.9" />
            <stop offset="1" stopColor="#E0431F" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w8s-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFF4D2" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#FFE08A" stopOpacity="0.6" />
            <stop offset="1" stopColor="#FFE08A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w8s-vent" cx="0.5" cy="0.42" r="0.55">
            <stop offset="0" stopColor="#FFE6A8" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#FF7A3D" stopOpacity="0.55" />
            <stop offset="1" stopColor="#E0431F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* base warm volcanic ground */}
        <rect x="0" y="0" width={W} height={H} fill="url(#w8s-trail)" />

        {/* ── Top band: World 9 Bầu trời — nhìn TỪ DƯỚI LÊN ── */}
        <rect x="0" y="0" width={W} height="200" fill="url(#w8s-sky)" />
        {/* soft sun glow */}
        <circle cx={286} cy={56} r={90} fill="url(#w8s-sun)" />
        <circle cx={286} cy={56} r={26} fill="#FFF1C2" stroke="#FFE08A" strokeWidth="3" />
        {/* fluffy clouds (aerial) */}
        <SkyCloud cx={84} cy={86} s={1.1} />
        <SkyCloud cx={210} cy={140} s={0.9} />
        <SkyCloud cx={300} cy={150} s={0.8} />
        <SkyCloud cx={140} cy={44} s={0.7} />
        {/* drifting sky sparkles */}
        {[[60,120],[180,70],[250,110],[330,90],[110,160],[30,60]].map(([x, y], i) =>
        <g key={`sk${i}`}>
          <circle cx={x} cy={y} r="1.8" fill="#FFFFFF" opacity="0.95" />
          <circle cx={x + 12} cy={y + 14} r="1.1" fill="#FFFFFF" opacity="0.8" />
        </g>
        )}

        {/* ── Volcano rim meeting the sky ── */}
        <path d="M0 188 q 90 22 180 6 t 180 14 L360 250 L0 250 Z" fill="#7A4E33" opacity="0.95" />
        <path d="M0 196 q 90 20 180 6 t 180 14" fill="none" stroke="#FFB27A" strokeWidth="3" opacity="0.85" strokeLinecap="round" />
        {/* a couple lava cracks glowing on the rim */}
        <path d="M40 214 q 40 8 80 0" fill="none" stroke="#FF7A3D" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
        <path d="M230 220 q 40 8 80 0" fill="none" stroke="#FF7A3D" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />

        {/* ── NHAM THẠCH WALLS on BOTH EDGES (mép TRÁI x≤72 / PHẢI x≥288) ── */}
        <RockWall side="l" />
        <RockWall side="r" />

        {/* ── Big glowing lava vent (light source, upper-right) ── */}
        <BigVent x={296} y={430} />

        {/* ── glowing lava cracks weaving down the central ground ── */}
        <GroundCracks />

        {/* ── Volcano decorations along the central trail (pockets
              OPPOSITE the path side) ── */}
        {/* glowing lava pools */}
        {[[150, 2120], [240, 1100], [120, 760]].map(([x, y], i) => <LavaPool key={`lp${i}`} x={x} y={y} />)}
        {/* fire vents / flame jets */}
        {[[286, 2360, 1], [88, 1980, 0], [288, 1580, 1], [150, 1620, 0], [98, 1180, 0]].
        map(([x, y], i) => <FireVent key={`fv${i}`} x={x} y={y} delay={`${i * 0.4}s`} />)}
        {/* obsidian crystal spikes */}
        {[[96, 2300], [228, 1040], [286, 1320]].map(([x, y], i) => <Obsidian key={`ob${i}`} x={x} y={y} />)}
        {/* volcanic rocks / magma boulders */}
        {[[284, 2180], [110, 1700], [266, 880], [270, 2280], [262, 1180]].
        map(([x, y], i) => <MagmaRock key={`mr${i}`} x={x} y={y} glow={i % 2 === 0} />)}
        {/* rising smoke puffs */}
        {[[300, 1430, '0s'], [70, 1320, '0.6s'], [296, 700, '1.1s'], [120, 1900, '1.5s']].
        map(([x, y, d], i) => <Smoke key={`sm${i}`} x={x} y={y} delay={d} />)}
        {/* floating embers */}
        {[[300, 1170, '0s'], [56, 2000, '0.5s'], [240, 1480, '1s'], [160, 940, '0.7s'], [320, 2080, '1.3s']].
        map(([x, y, d], i) => <Ember key={`eb${i}`} x={x} y={y} delay={d} />)}

        {/* ── ash sparkles ── */}
        {[[150, 2200], [120, 1500], [240, 1100], [160, 720], [200, 1900], [130, 1000]].map(([x, y], i) =>
        <g key={`sp${i}`}>
          <circle cx={x} cy={y} r="1.6" fill="#FFE6A8" opacity="0.9" />
          <circle cx={x + 14} cy={y + 18} r="1.1" fill="#FFC061" opacity="0.8" />
        </g>
        )}

        {/* ── Drifting jelly characters ── */}
        <FloatJelly x={300} y={1170} size={20} color="yellow" delay="0s" />
        <FloatJelly x={56} y={2000} size={22} color="pink" delay="0.8s" />
        <FloatJelly x={300} y={2280} size={18} color="mint" delay="1.4s" />
      </svg>);

  }

  // ── sky cloud (World 9 preview) ──
  function SkyCloud({ cx, cy, s = 1 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 4px rgba(120,150,200,0.25))' }}>
        <ellipse cx={cx} cy={cy} rx={34 * s} ry={15 * s} fill="#FFFFFF" />
        <circle cx={cx - 18 * s} cy={cy - 2 * s} r={13 * s} fill="#FFFFFF" />
        <circle cx={cx - 2 * s} cy={cy - 9 * s} r={16 * s} fill="#FFFFFF" />
        <circle cx={cx + 16 * s} cy={cy - 3 * s} r={12 * s} fill="#FFFFFF" />
        <ellipse cx={cx} cy={cy + 9 * s} rx={32 * s} ry={8 * s} fill="#E4EEFB" opacity="0.85" />
      </g>);

  }

  // ── lava vent acting as the upper light source ──
  function BigVent({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 18px rgba(255,122,61,0.6))' }}>
        <circle cx={x} cy={y} r={130} fill="url(#w8s-vent)" opacity="0.5" />
        <ellipse cx={x} cy={y} rx="54" ry="40" fill="#7A2A14" stroke="#FF7A3D" strokeWidth="3" />
        <ellipse cx={x} cy={y} rx="38" ry="27" fill="url(#w8s-lava)" />
        <ellipse cx={x - 12} cy={y - 8} rx="16" ry="10" fill="#FFE6A8" opacity="0.65" />
      </g>);

  }

  // ── glowing lava cracks down the central ground ──
  function GroundCracks() {
    const segs = [
      'M150 2300 q 30 -120 -10 -240 q -30 -110 20 -230',
      'M232 1820 q -28 -110 14 -210 q 28 -100 -10 -200',
      'M150 1380 q 30 -120 -8 -230',
      'M210 980 q -24 -110 12 -210'];

    return (
      <g opacity="0.62">
        {segs.map((d, i) =>
        <g key={i}>
          <path d={d} fill="none" stroke="#E0431F" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
          <path d={d} fill="none" stroke="#FF9F52" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        </g>
        )}
      </g>);

  }

  // ── volcano decorations on the warm ground ──
  function LavaPool({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 9px rgba(255,122,61,0.5))' }}>
        <ellipse cx={x} cy={y} rx="36" ry="16" fill="#7A2A14" stroke="#FF7A3D" strokeWidth="2.5" />
        <ellipse cx={x} cy={y} rx="25" ry="10" fill="url(#w8s-lava)" />
        <ellipse cx={x - 9} cy={y - 3} rx="11" ry="4.5" fill="#FFE6A8" opacity="0.6" />
        {/* bubbles */}
        <circle cx={x + 10} cy={y + 1} r="2.4" fill="#FFC061" opacity="0.85" />
        <circle cx={x - 4} cy={y + 3} r="1.6" fill="#FFE6A8" opacity="0.8" />
      </g>);

  }
  function FireVent({ x, y, delay = '0s' }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 7px rgba(255,122,61,0.55))' }}>
        {/* vent mouth */}
        <ellipse cx={x} cy={y + 8} rx="16" ry="6" fill="#3A1C12" stroke="#E0431F" strokeWidth="2" />
        <ellipse cx={x} cy={y + 8} rx="9" ry="3" fill="#FF7A3D" />
        {/* flame */}
        <g style={{ animation: 'gj-w8s-flame 900ms ease-in-out infinite', animationDelay: delay, transformOrigin: `${x}px ${y + 8}px` }}>
          <path d={`M ${x} ${y - 26} q 11 14 7 26 q -2 6 -7 9 q -5 -3 -7 -9 q -4 -12 7 -26 Z`} fill="#FF7A3D" stroke="#E0431F" strokeWidth="1" strokeLinejoin="round" />
          <path d={`M ${x} ${y - 14} q 6 8 3 16 q -3 4 -3 4 q 0 0 -3 -4 q -3 -8 3 -16 Z`} fill="#FFC061" />
          <path d={`M ${x} ${y - 4} q 2 4 0 8 q -2 -4 0 -8 Z`} fill="#FFE6A8" />
        </g>
      </g>);

  }
  function Obsidian({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 5px rgba(255,80,40,0.4))' }}>
        {[[-12, 24, 7], [2, 36, 9], [14, 20, 6]].map(([o, h, w], i) =>
        <g key={i}>
          <path d={`M ${x + o} ${y - h} L ${x + o + w} ${y + 6} L ${x + o - w} ${y + 6} Z`}
                fill={i === 1 ? '#2A1714' : '#3A2018'} stroke="#1A0C08" strokeWidth="1.2" strokeLinejoin="round" />
          <path d={`M ${x + o} ${y - h} L ${x + o} ${y + 6}`} stroke="#FF7A3D" strokeWidth="1" opacity="0.75" />
          <path d={`M ${x + o - w * 0.4} ${y - h * 0.5} L ${x + o} ${y - h} L ${x + o + w * 0.3} ${y - h * 0.4}`} fill="none" stroke="#6E4030" strokeWidth="0.8" opacity="0.7" />
        </g>
        )}
        <ellipse cx={x} cy={y + 7} rx="18" ry="4" fill="#E0431F" opacity="0.22" />
      </g>);

  }
  function MagmaRock({ x, y, glow = false }) {
    const n = 7;const pts = [];const r = 20;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.72 : r;
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.86]);
    }
    const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z';
    return (
      <g style={{ filter: 'drop-shadow(0 3px 4px rgba(20,6,2,0.45))' }}>
        <path d={d} fill="#3A1C12" stroke="#21100A" strokeWidth="1.5" strokeLinejoin="round" />
        {glow &&
        <g>
          <path d={`M ${x - 12} ${y - 4} q 10 6 22 -2`} fill="none" stroke="#FF7A3D" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <path d={`M ${x - 6} ${y + 6} q 8 4 16 -2`} fill="none" stroke="#FF9F52" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        </g>}
        <ellipse cx={x} cy={y - r * 0.24} rx={r * 0.42} ry={r * 0.26} fill="#5A3322" opacity="0.7" />
      </g>);

  }
  function Smoke({ x, y, delay = '0s' }) {
    return (
      <g style={{ animation: 'gj-w8s-smoke 4.4s ease-in-out infinite', animationDelay: delay, transformOrigin: `${x}px ${y}px` }}>
        <circle cx={x} cy={y} r="11" fill="#9B8A7C" opacity="0.32" />
        <circle cx={x - 8} cy={y + 6} r="8" fill="#A89A8C" opacity="0.28" />
        <circle cx={x + 8} cy={y + 4} r="9" fill="#8F7F71" opacity="0.26" />
        <circle cx={x + 2} cy={y - 8} r="7" fill="#B0A294" opacity="0.24" />
      </g>);

  }
  function Ember({ x, y, delay = '0s' }) {
    return (
      <g style={{ animation: 'gj-w8s-ember 2.8s ease-in-out infinite', animationDelay: delay, transformOrigin: `${x}px ${y}px` }}>
        <circle cx={x} cy={y} r="2.6" fill="#FFC061" opacity="0.95" />
        <circle cx={x} cy={y} r="5" fill="#FF7A3D" opacity="0.4" />
      </g>);

  }

  function RockWall({ side }) {
    // VÁCH ĐÁ NHAM THẠCH một mép — nền đá tối, mép trong uốn lượn có khe
    // dung nham phát sáng cam, gai obsidian chĩa vào trong, miệng phun lửa.
    const isL = side === 'l';
    const fill = isL ? 'url(#w8s-wall-l)' : 'url(#w8s-wall-r)';
    const X = (v) => isL ? v : W - v;
    const outerX = isL ? -24 : W + 24;
    const inset = (i) => [70, 56, 64, 58][i % 4];
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
    // inward-pointing obsidian spikes packed along the wall
    const spikes = [];
    for (let y = 300, i = 0; y < H; y += 104, i++) {
      const ix = inset(Math.round((y - 250) / 150));
      spikes.push(<WallSpike key={`ws${i}`} bx={X(ix)} y={y} dir={isL ? 1 : -1} len={16 + i % 3 * 7} />);
    }
    // embedded glow vents
    const vents = [];
    for (let y = 420, i = 0; y < H; y += 360, i++) {
      vents.push(<circle key={`wo${i}`} cx={X(34)} cy={y} r={i % 2 ? 6 : 8} fill="url(#w8s-vent)" opacity="0.85" />);
    }
    // lava-vein cracks on the wall
    const veins = [];
    for (let y = 360, i = 0; y < H; y += 240, i++) {
      const vx = X(40 + i % 2 * 10);
      veins.push(
        <path key={`wv${i}`} d={`M ${vx} ${y - 30} q ${isL ? 14 : -14} 20 ${isL ? -6 : 6} 44 q ${isL ? 12 : -12} 18 ${isL ? 4 : -4} 40`}
              fill="none" stroke="#FF7A3D" strokeWidth="2" strokeLinecap="round" opacity="0.7" />);
    }
    return (
      <g>
        <path d={d} fill={fill} />
        {veins}
        {vents}
        {spikes}
        {/* glowing lava rim just inside the trail */}
        <path d={edge} fill="none" stroke="#E0431F" strokeWidth="9" opacity="0.4" strokeLinecap="round" />
        <path d={edge} fill="none" stroke="#FFB27A" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
      </g>);

  }
  function WallSpike({ bx, y, dir, len = 18 }) {
    // gai obsidian chĩa vào trong lối đi (từ mép)
    const tip = bx + dir * len;
    const w = 6 + len * 0.18;
    return (
      <g style={{ filter: 'drop-shadow(0 0 4px rgba(255,80,40,0.4))' }}>
        <path d={`M ${tip} ${y} L ${bx} ${y - w} L ${bx - dir * 6} ${y} L ${bx} ${y + w} Z`}
              fill="#2A1714" stroke="#1A0C08" strokeWidth="1.1" strokeLinejoin="round" opacity="0.95" />
        <path d={`M ${tip} ${y} L ${bx} ${y}`} stroke="#FF7A3D" strokeWidth="0.9" opacity="0.7" />
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
      <g style={{ animation: 'gj-w8s-float 3.6s ease-in-out infinite', animationDelay: delay,
        transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 4px 4px rgba(80,40,20,0.4))' }}>
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
        <path d={FULL_PATH} fill="none" stroke="rgba(60,28,18,0.24)"
        strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,4)" />
        <path d={FULL_PATH} fill="none" stroke="#8A6147"
        strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#D9B58C"
        strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#FF9F52"
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
        fill={filled ? '#FFC23D' : '#D8B79A'} stroke={filled ? '#E0A21F' : '#B58E6E'}
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
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 5px 8px rgba(60,28,18,0.42))' }}>
        <JellyBlock color={color} size={size} showEyes={false} />
        <NumberBadge n={n} size={size} />
        <StarArc stars={stars} size={14} width={size + 14} />
      </div>);

  }
  function LockedRegularNode({ n, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 6px rgba(60,28,18,0.4))' }}>
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
          justifyContent: 'center', boxShadow: '0 2px 4px rgba(60,28,18,0.45)'
        }}>
          <LockGlyph size={13} />
        </div>
      </div>);

  }
  function CurrentNode({ n, size = 64 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: -16, top: -16, width: size + 32, height: size + 32, borderRadius: '50%', background: 'rgba(255,159,104,0.26)', animation: 'gj-w8s-pulse 1600ms ease-out infinite' }} />
        <div style={{ position: 'absolute', left: -5, top: -5, width: size + 10, height: size + 10, borderRadius: '50%', background: 'rgba(255,159,104,0.36)', animation: 'gj-w8s-pulse 1600ms ease-out infinite', animationDelay: '320ms' }} />
        <div style={{
          position: 'relative', width: size, height: size, borderRadius: '50%', background: '#FFFFFF', border: '3px solid #FF9F68',
          boxShadow: '0 6px 16px rgba(60,28,18,0.38), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width={size - 16} height={size - 16} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A" strokeWidth="2" strokeDasharray="3 4" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#E97E45' }}>{n}</div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)', animation: 'gj-w8s-hop 1400ms ease-in-out infinite', filter: 'drop-shadow(0 4px 4px rgba(60,28,18,0.4))' }}>
          <JellyBlock color="yellow" size={38} direction="down" expression="happy" />
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
        <div style={{ position: 'absolute', top: -10, left: size + 8, background: '#FFFFFF', color: '#8C7458', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.10em', padding: '4px 10px', borderRadius: 999, boxShadow: '0 3px 8px rgba(60,28,18,0.36)', whiteSpace: 'nowrap' }}>NGHỈ</div>
        <div style={{ position: 'absolute', top: -6, left: size + 4, width: 10, height: 10, borderRadius: '50%', background: '#FFD074', border: '1.5px solid #E0A21F' }} />
        <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 6px rgba(60,28,18,0.4))', opacity: 0.92 }}>
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
        <div style={{ position: 'absolute', left: -28, top: -28, right: -28, bottom: -28, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(169,156,246,0.6) 0%, rgba(126,108,240,0.32) 55%, rgba(126,108,240,0) 78%)', animation: 'gj-w8s-halo 2400ms ease-in-out infinite' }} />
        <svg width={size + 56} height={size + 56} viewBox="0 0 200 200" style={{ position: 'absolute', left: -28, top: -28, pointerEvents: 'none', animation: 'gj-w8s-spin 8s linear infinite', transformOrigin: '50% 50%' }}>
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
        <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #EFE0C9', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 999, boxShadow: '0 3px 6px rgba(60,28,18,0.36)' }}>màn {n}</div>
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

  // ─── gate to World 9 (Bầu trời) ───────────────────────────────────
  function GateBanner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 38, transform: 'translateX(-50%)', width: 312,
        background: '#FFFFFF', border: '1.5px solid #BFD2E0', borderRadius: 999, padding: '8px 14px 8px 8px',
        display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 28px rgba(40,80,140,0.28), 0 4px 8px rgba(120,92,52,0.14)', zIndex: 16
      }}>
        {/* World 9 sky badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #DCEAFB 0%, #9BBEF5 55%, #6E94E0 100%)',
          border: '2.5px solid #8FB6F2', boxShadow: 'inset 0 -3px 0 rgba(60,90,150,0.3), inset 0 3px 0 rgba(255,255,255,0.6), 0 2px 4px rgba(60,90,150,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          {/* cloud + sun glyph */}
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="16" cy="8" r="4" fill="#FFE08A" stroke="#FFC23D" strokeWidth="1" />
            <path d="M6 17 a4 4 0 0 1 0.4 -7.96 a5 5 0 0 1 9.4 1.2 a3.5 3.5 0 0 1 -0.3 6.76 Z" fill="#FFFFFF" stroke="#BBD3F7" strokeWidth="1.1" strokeLinejoin="round" />
          </svg>
          <div style={{ position: 'absolute', top: -6, right: -4, background: '#6E94E0', border: '1.5px solid #9BBEF5', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, padding: '2px 6px', borderRadius: 999, lineHeight: 1, boxShadow: '0 2px 3px rgba(60,90,150,0.3)' }}>W9</div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.05, gap: 2 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', color: '#9B886F', whiteSpace: 'nowrap' }}>CỔNG · THẾ GIỚI 9</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#3F6FB5', whiteSpace: 'nowrap', lineHeight: 1.05 }}>Bầu trời</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)', border: '1.5px solid #E0A21F', padding: '6px 11px 7px 8px', borderRadius: 999, boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)', flexShrink: 0 }}>
          <Star filled size={14} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#6A4A2E', lineHeight: 1 }}>130</span>
        </div>
      </div>);

  }

  function StartSign() {
    return (
      <div style={{ position: 'absolute', left: '50%', top: H - 90, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ background: '#FFFFFF', color: '#B5462E', border: '1.5px solid #F0C3A8', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(60,28,18,0.36)', textTransform: 'uppercase' }}>Núi lửa · tiếp tục</div>
      </div>);

  }

  function World8Strip() {
    return (
      <div style={{ position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden' }}>
        <style>{`
          @keyframes gj-w8s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w8s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w8s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w8s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w8s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @keyframes gj-w8s-ember { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-8px);opacity:1} }
          @keyframes gj-w8s-flame { 0%,100%{transform:scaleY(1) scaleX(1)} 50%{transform:scaleY(1.16) scaleX(0.9)} }
          @keyframes gj-w8s-smoke { 0%{transform:translateY(0) scale(0.9);opacity:0.0} 25%{opacity:0.4} 100%{transform:translateY(-30px) scale(1.3);opacity:0} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>
        <Scene />
        <PathLayer />
        <GateBanner />
        {NODES.map((n) => <PlaceNode key={n.id} node={n} />)}
        <StartSign />
      </div>);

  }

  window.GJWorld8Strip = World8Strip;
})();
