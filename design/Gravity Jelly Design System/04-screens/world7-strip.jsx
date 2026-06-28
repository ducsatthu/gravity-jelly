/* world7-strip.jsx — Dải cuộn ĐẦY ĐỦ World 7 "Hang băng" (màn 61–70).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn, số node 61→70:
     • 61–65 node thường · 66 BREATHER · 67–69 thường · 70 BOSS
     • trên 70: CỔNG sang World 8 "Núi lửa" (chip ★ 120); nền trên cổng
       blend sang palette Núi lửa (#3A1810→#FF7A3D nham thạch nóng)
   Biome World 7 (nhìn TỪ TRÊN XUỐNG): HANG ĐỘNG BĂNG tối #16344B→#22405A.
   GIỮA là LỐI BĂNG phát sáng #D9F2FC→#9CCFE6 (hành lang x 72–290) cho
   đường + node; HAI MÉP là VÁCH HANG tối #1B344A→#2E516B với cụm TINH THỂ
   BĂNG #7FE0F2/#CFF6FF chĩa vào trong, măng băng, đèn hang phát sáng. Trên
   lối băng: tinh thể phát sáng, hồ băng sáng, nấm băng, măng đá băng, đèn
   hang, tảng băng, thác băng đóng. Mặt trên = NÚI LỬA (W8 preview).
   Exposes window.GJWorld7Strip.                                          */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const NODES = [
  { id: 61, x: 130, y: 2440, kind: 'reg', state: 'done', stars: 3, color: 'mint' },
  { id: 62, x: 240, y: 2250, kind: 'reg', state: 'done', stars: 2, color: 'blue' },
  { id: 63, x: 110, y: 2060, kind: 'reg', state: 'done', stars: 3, color: 'pink' },
  { id: 64, x: 240, y: 1870, kind: 'reg', state: 'current' },
  { id: 65, x: 120, y: 1680, kind: 'reg', state: 'locked' },
  { id: 66, x: 240, y: 1490, kind: 'breather', state: 'locked' },
  { id: 67, x: 110, y: 1290, kind: 'reg', state: 'locked' },
  { id: 68, x: 240, y: 1090, kind: 'reg', state: 'locked' },
  { id: 69, x: 150, y: 880, kind: 'reg', state: 'locked' },
  { id: 70, x: 180, y: 620, kind: 'boss', state: 'locked' }];


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
          {/* lối băng phát sáng ở giữa */}
          <linearGradient id="w7s-trail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E2F5FD" />
            <stop offset="0.5" stopColor="#C2E4F1" />
            <stop offset="1" stopColor="#A7D2E6" />
          </linearGradient>
          {/* vách hang 2 mép (đá băng tối) */}
          <linearGradient id="w7s-wall-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#13304A" />
            <stop offset="0.7" stopColor="#1E3C57" />
            <stop offset="1" stopColor="#2E516B" />
          </linearGradient>
          <linearGradient id="w7s-wall-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#13304A" />
            <stop offset="0.7" stopColor="#1E3C57" />
            <stop offset="1" stopColor="#2E516B" />
          </linearGradient>
          {/* top band = NÚI LỬA nhìn TỪ TRÊN XUỐNG (W8 preview) */}
          <linearGradient id="w7s-volcano" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3A1710" />
            <stop offset="0.55" stopColor="#2C120B" />
            <stop offset="1" stopColor="#43251A" />
          </linearGradient>
          <radialGradient id="w7s-crystal" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#BFF4FF" stopOpacity="0.95" />
            <stop offset="1" stopColor="#7FE0F2" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w7s-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#CFF6FF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#3E94AE" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w7s-lava" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFD27A" stopOpacity="0.95" />
            <stop offset="0.45" stopColor="#FF7A3D" stopOpacity="0.9" />
            <stop offset="1" stopColor="#E0431F" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w7s-orb" cx="0.5" cy="0.42" r="0.55">
            <stop offset="0" stopColor="#DFFAFF" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#7FE0F2" stopOpacity="0.5" />
            <stop offset="1" stopColor="#5FC9DE" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* base glowing ice trail */}
        <rect x="0" y="0" width={W} height={H} fill="url(#w7s-trail)" />

        {/* ── Top band: World 8 Núi lửa — nhìn TỪ TRÊN XUỐNG ── */}
        <rect x="0" y="0" width={W} height="200" fill="url(#w7s-volcano)" />
        {/* lava pools / glowing cracks (aerial) */}
        <LavaPool cx={92} cy={78} rx={56} ry={24} />
        <LavaPool cx={276} cy={138} rx={66} ry={26} />
        <LavaCrack d="M0 110 Q 90 96 150 120 T 360 104" />
        <LavaCrack d="M30 168 Q 120 150 210 176 T 360 158" />
        {/* dark volcanic rocks */}
        <VolRock cx={300} cy={52} r={40} />
        <VolRock cx={54} cy={158} r={44} />
        <VolRock cx={176} cy={34} r={32} />
        {/* glowing embers rising */}
        {[[70, 120], [200, 150], [268, 70], [126, 44], [330, 96], [150, 60]].map(([x, y], i) =>
        <g key={`em${i}`} style={{ animation: 'gj-w7s-ember 2.8s ease-in-out infinite', animationDelay: `${i * 0.32}s`, transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r="2.4" fill="#FFC061" opacity="0.95" />
            <circle cx={x} cy={y} r="4.5" fill="#FF7A3D" opacity="0.4" />
          </g>
        )}

        {/* ── Volcano edge meeting the ice trail ── */}
        <path d="M0 188 q 90 22 180 6 t 180 14 L360 250 L0 250 Z" fill="#7FC3D8" opacity="0.9" />
        <path d="M0 196 q 90 20 180 6 t 180 14" fill="none" stroke="#CFF6FF" strokeWidth="3" opacity="0.8" strokeLinecap="round" />

        {/* ── ICE-CAVE WALLS on BOTH EDGES (mép TRÁI x≤72 / PHẢI x≥288) ── */}
        <CaveWall side="l" />
        <CaveWall side="r" />

        {/* ── Big glowing crystal cluster (light source, upper-right) ── */}
        <radialGlow x={296} y={430} r={130} />

        {/* ── Ice decorations along the central trail (pockets
              OPPOSITE the path side) ── */}
        {/* glowing crystal clusters */}
        {[[286, 2360, 1], [88, 1980, 0], [288, 1580, 1], [150, 1620, 0], [98, 1180, 0]].
        map(([x, y, t], i) => <CrystalCluster key={`gc${i}`} x={x} y={y} tilt={t} />)}
        {/* glowing ice pools */}
        {[[150, 2120], [240, 1100], [120, 760]].map(([x, y], i) => <GlowPool key={`gp${i}`} x={x} y={y} />)}
        {/* ice mushrooms */}
        {[[284, 2180], [110, 1700], [266, 880]].map(([x, y], i) => <IceMushroom key={`im${i}`} x={x} y={y} />)}
        {/* stalagmite crystal spikes */}
        {[[96, 2300], [228, 1040], [286, 1320]].map(([x, y], i) => <Stalagmites key={`st${i}`} x={x} y={y} />)}
        {/* icicle clusters (from above) */}
        {[[262, 2040], [98, 1500], [156, 940]].map(([x, y], i) => <Icicles key={`ic${i}`} x={x} y={y} />)}
        {/* ice boulders */}
        {[[270, 2280], [262, 1180]].map(([x, y], i) => <IceBoulder key={`ib${i}`} x={x} y={y} />)}
        {/* floating cave-light orbs */}
        {[[300, 1430, 9, '0s'], [70, 1320, 7, '0.6s'], [296, 700, 8, '1.1s'], [120, 1900, 7, '1.5s']].
        map(([x, y, r, d], i) => <CaveOrb key={`co${i}`} x={x} y={y} r={r} delay={d} />)}

        {/* ── Ice sparkles ── */}
        {[[150, 2200], [120, 1500], [240, 1100], [160, 720], [200, 1900], [130, 1000]].map(([x, y], i) =>
        <g key={`sp${i}`}>
          <circle cx={x} cy={y} r="1.8" fill="#FFFFFF" opacity="0.95" />
          <circle cx={x + 14} cy={y + 18} r="1.2" fill="#CFF6FF" opacity="0.85" />
        </g>
        )}

        {/* ── Drifting jelly characters ── */}
        <FloatJelly x={300} y={1170} size={20} color="blue" delay="0s" />
        <FloatJelly x={56} y={2000} size={22} color="mint" delay="0.8s" />
        <FloatJelly x={300} y={2280} size={18} color="pink" delay="1.4s" />
      </svg>);

  }

  // ── top-down volcano terrain (World 8 preview) ──
  function LavaPool({ cx, cy, rx, ry }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 10px rgba(255,122,61,0.55))' }}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#7A2A14" stroke="#FF7A3D" strokeWidth="2.5" />
        <ellipse cx={cx} cy={cy} rx={rx * 0.74} ry={ry * 0.7} fill="url(#w7s-lava)" />
        <ellipse cx={cx - rx * 0.24} cy={cy - ry * 0.28} rx={rx * 0.3} ry={ry * 0.24} fill="#FFE6A8" opacity="0.6" />
      </g>);

  }
  function LavaCrack({ d }) {
    return (
      <g>
        <path d={d} fill="none" stroke="#E0431F" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <path d={d} fill="none" stroke="#FF9F52" strokeWidth="2.2" strokeLinecap="round" opacity="0.95" />
      </g>);

  }
  function VolRock({ cx, cy, r }) {
    const n = 7;const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.7 : r;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86]);
    }
    const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z';
    return (
      <g style={{ filter: 'drop-shadow(0 2px 3px rgba(20,6,2,0.5))' }}>
        <path d={d} fill="#3A1C12" stroke="#21100A" strokeWidth="1.5" strokeLinejoin="round" />
        {pts.map(([x, y], i) =>
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#21100A" strokeWidth="1" opacity="0.5" />
        )}
        <ellipse cx={cx} cy={cy - r * 0.2} rx={r * 0.4} ry={r * 0.26} fill="#5A3322" opacity="0.7" />
      </g>);

  }

  function radialGlow(props) { return RadialGlow(props); }
  function RadialGlow({ x, y, r }) {
    return (
      <g>
        <circle cx={x} cy={y} r={r} fill="url(#w7s-orb)" opacity="0.6" />
        <CrystalCluster x={x} y={y} tilt={0} big />
      </g>);

  }

  // ── ice-cave decorations on the glowing trail ──
  function CrystalCluster({ x, y, tilt = 0, big = false }) {
    const k = big ? 1.5 : 1;
    const shard = (dx, h, w, hue) => {
      const bx = x + dx;
      return (
        <path key={`${dx}-${h}`} d={`M ${bx} ${y - h} L ${bx + w} ${y + 4} L ${bx} ${y + 10} L ${bx - w} ${y + 4} Z`}
              fill={hue} stroke="#CFF6FF" strokeWidth="1.3" strokeLinejoin="round" />);
    };
    return (
      <g transform={`rotate(${tilt * 5} ${x} ${y})`} style={{ filter: 'drop-shadow(0 0 8px rgba(127,224,242,0.6))' }}>
        <ellipse cx={x} cy={y + 12} rx={22 * k} ry={6 * k} fill="#5FC9DE" opacity="0.28" />
        {shard(-14 * k, 30 * k, 8 * k, '#5FC9DE')}
        {shard(13 * k, 36 * k, 9 * k, '#5FC9DE')}
        {shard(0, 52 * k, 11 * k, '#7FE0F2')}
        <path d={`M ${x} ${y - 52 * k} L ${x} ${y + 8 * k}`} stroke="#CFF6FF" strokeWidth="1" opacity="0.8" />
        <path d={`M ${x} ${y - 52 * k} L ${x - 11 * k} ${y + 4} M ${x} ${y - 52 * k} L ${x + 11 * k} ${y + 4}`} stroke="#FFFFFF" strokeWidth="0.9" opacity="0.55" />
        <circle cx={x} cy={y - 36 * k} r={2.4 * k} fill="#FFFFFF" opacity="0.9" />
      </g>);

  }
  function GlowPool({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 8px rgba(95,201,222,0.5))' }}>
        <ellipse cx={x} cy={y} rx="34" ry="16" fill="#2E6E86" stroke="#5FC9DE" strokeWidth="2.5" />
        <ellipse cx={x} cy={y} rx="24" ry="11" fill="url(#w7s-pool)" />
        <ellipse cx={x - 9} cy={y - 4} rx="11" ry="5" fill="#CFF6FF" opacity="0.55" />
        <path d={`M ${x - 16} ${y + 2} L ${x} ${y - 5} L ${x + 13} ${y + 3}`} fill="none" stroke="#CFF6FF" strokeWidth="1" opacity="0.6" />
      </g>);

  }
  function IceMushroom({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 4px rgba(8,24,40,0.4))' }}>
        <rect x={x - 4} y={y - 14} width="8" height="16" rx="3" fill="#CFEAF7" stroke="#9FCFE6" strokeWidth="1.2" />
        <path d={`M ${x - 18} ${y - 12} q 18 -20 36 0 q -18 7 -36 0 Z`} fill="#7FE0F2" stroke="#CFF6FF" strokeWidth="1.4" strokeLinejoin="round" />
        <ellipse cx={x - 5} cy={y - 14} rx="6" ry="3" fill="#FFFFFF" opacity="0.6" />
        <circle cx={x - 8} cy={y - 11} r="1.3" fill="#CFF6FF" />
        <circle cx={x + 6} cy={y - 13} r="1.1" fill="#CFF6FF" />
      </g>);

  }
  function Stalagmites({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 6px rgba(127,224,242,0.45))' }}>
        {[[-12, 24, 7], [2, 34, 9], [14, 20, 6]].map(([o, h, w], i) =>
        <g key={i}>
          <path d={`M ${x + o} ${y - h} L ${x + o + w} ${y + 6} L ${x + o - w} ${y + 6} Z`}
                fill={i === 1 ? '#7FE0F2' : '#5FC9DE'} stroke="#CFF6FF" strokeWidth="1.2" strokeLinejoin="round" />
          <path d={`M ${x + o} ${y - h} L ${x + o} ${y + 6}`} stroke="#CFF6FF" strokeWidth="0.8" opacity="0.7" />
        </g>
        )}
        <ellipse cx={x} cy={y + 7} rx="18" ry="4" fill="#5FC9DE" opacity="0.3" />
      </g>);

  }
  function Icicles({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 3px rgba(8,24,40,0.35))' }}>
        <rect x={x - 16} y={y - 6} width="32" height="5" rx="2.5" fill="#CFEAF7" stroke="#9FCFE6" strokeWidth="1" />
        {[-12, -4, 4, 12].map((o, i) => {
          const len = [14, 20, 12, 17][i];
          return <path key={i} d={`M ${x + o - 3} ${y - 1} L ${x + o + 3} ${y - 1} L ${x + o} ${y - 1 + len} Z`}
          fill="#CFEAF7" stroke="#7FE0F2" strokeWidth="0.9" strokeLinejoin="round" opacity="0.95" />;
        })}
      </g>);

  }
  function IceBoulder({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 4px rgba(8,24,40,0.4))' }}>
        <path d={`M ${x - 20} ${y} q -4 -18 14 -22 q 10 -8 20 2 q 14 0 8 18 Z`} fill="#6FA8C4" stroke="#3E6F8C" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={`M ${x - 18} ${y - 14} q 12 -12 26 -8 q 8 -4 8 6 q -10 4 -20 2 q -8 4 -14 0 Z`} fill="#CFEAF7" opacity="0.9" />
        <ellipse cx={x + 6} cy={y - 4} rx="6" ry="4" fill="#3E6F8C" opacity="0.5" />
      </g>);

  }
  function CaveOrb({ x, y, r = 8, delay = '0s' }) {
    return (
      <g style={{ animation: 'gj-w7s-float 3.6s ease-in-out infinite', animationDelay: delay, transformOrigin: `${x}px ${y}px` }}>
        <circle cx={x} cy={y} r={r * 2.2} fill="url(#w7s-orb)" opacity="0.55" />
        <circle cx={x} cy={y} r={r} fill="#DFFAFF" />
        <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.34} fill="#FFFFFF" />
      </g>);

  }

  function CaveWall({ side }) {
    // VÁCH HANG một mép — nền đá băng tối, mép trong uốn lượn có gờ băng
    // phát sáng cyan, cụm tinh thể chĩa vào trong, đèn hang, lấp lánh.
    const isL = side === 'l';
    const fill = isL ? 'url(#w7s-wall-l)' : 'url(#w7s-wall-r)';
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
    // inward-pointing crystal spikes packed along the wall
    const spikes = [];
    for (let y = 300, i = 0; y < H; y += 104, i++) {
      const ix = inset(Math.round((y - 250) / 150));
      spikes.push(<WallSpike key={`ws${i}`} bx={X(ix)} y={y} dir={isL ? 1 : -1} len={16 + i % 3 * 7} />);
    }
    // embedded glow orbs
    const orbs = [];
    for (let y = 420, i = 0; y < H; y += 360, i++) {
      orbs.push(<circle key={`wo${i}`} cx={X(34)} cy={y} r={i % 2 ? 5 : 7} fill="url(#w7s-orb)" opacity="0.8" />);
    }
    // sparkles
    const sparks = [];
    for (let y = 380, i = 0; y < H; y += 210, i++) {
      sparks.push(<circle key={`wk${i}`} cx={X(28 + i % 2 * 12)} cy={y} r="1.5" fill="#CFF6FF" opacity="0.85" />);
    }
    return (
      <g>
        <path d={d} fill={fill} />
        {orbs}
        {spikes}
        {sparks}
        {/* glowing ice rim just inside the trail */}
        <path d={edge} fill="none" stroke="#3E94AE" strokeWidth="9" opacity="0.5" strokeLinecap="round" />
        <path d={edge} fill="none" stroke="#CFF6FF" strokeWidth="3.5" opacity="0.85" strokeLinecap="round" />
      </g>);

  }
  function WallSpike({ bx, y, dir, len = 18 }) {
    // tinh thể băng chĩa vào trong lối đi (từ mép)
    const tip = bx + dir * len;
    const w = 6 + len * 0.18;
    return (
      <g style={{ filter: 'drop-shadow(0 0 5px rgba(127,224,242,0.5))' }}>
        <path d={`M ${tip} ${y} L ${bx} ${y - w} L ${bx - dir * 6} ${y} L ${bx} ${y + w} Z`}
              fill="#5FC9DE" stroke="#CFF6FF" strokeWidth="1.1" strokeLinejoin="round" opacity="0.92" />
        <path d={`M ${tip} ${y} L ${bx} ${y}`} stroke="#CFF6FF" strokeWidth="0.8" opacity="0.7" />
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
      <g style={{ animation: 'gj-w7s-float 3.6s ease-in-out infinite', animationDelay: delay,
        transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 4px 4px rgba(8,24,40,0.4))' }}>
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
        <path d={FULL_PATH} fill="none" stroke="rgba(20,50,80,0.22)"
        strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,4)" />
        <path d={FULL_PATH} fill="none" stroke="#7FC3D8"
        strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#E8F7FD"
        strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#7FE0F2"
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
        fill={filled ? '#FFC23D' : '#9FB8C9'} stroke={filled ? '#E0A21F' : '#7895A8'}
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
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 5px 8px rgba(8,24,40,0.4))' }}>
        <JellyBlock color={color} size={size} showEyes={false} />
        <NumberBadge n={n} size={size} />
        <StarArc stars={stars} size={14} width={size + 14} />
      </div>);

  }
  function LockedRegularNode({ n, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 6px rgba(8,24,40,0.36))' }}>
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
          justifyContent: 'center', boxShadow: '0 2px 4px rgba(8,24,40,0.45)'
        }}>
          <LockGlyph size={13} />
        </div>
      </div>);

  }
  function CurrentNode({ n, size = 64 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: -16, top: -16, width: size + 32, height: size + 32, borderRadius: '50%', background: 'rgba(255,159,104,0.26)', animation: 'gj-w7s-pulse 1600ms ease-out infinite' }} />
        <div style={{ position: 'absolute', left: -5, top: -5, width: size + 10, height: size + 10, borderRadius: '50%', background: 'rgba(255,159,104,0.36)', animation: 'gj-w7s-pulse 1600ms ease-out infinite', animationDelay: '320ms' }} />
        <div style={{
          position: 'relative', width: size, height: size, borderRadius: '50%', background: '#FFFFFF', border: '3px solid #FF9F68',
          boxShadow: '0 6px 16px rgba(8,24,40,0.34), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width={size - 16} height={size - 16} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A" strokeWidth="2" strokeDasharray="3 4" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#E97E45' }}>{n}</div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)', animation: 'gj-w7s-hop 1400ms ease-in-out infinite', filter: 'drop-shadow(0 4px 4px rgba(8,24,40,0.4))' }}>
          <JellyBlock color="mint" size={38} direction="down" expression="happy" />
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
        <div style={{ position: 'absolute', top: -10, left: size + 8, background: '#FFFFFF', color: '#8C7458', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.10em', padding: '4px 10px', borderRadius: 999, boxShadow: '0 3px 8px rgba(8,24,40,0.34)', whiteSpace: 'nowrap' }}>NGHỈ</div>
        <div style={{ position: 'absolute', top: -6, left: size + 4, width: 10, height: 10, borderRadius: '50%', background: '#FFD074', border: '1.5px solid #E0A21F' }} />
        <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 6px rgba(8,24,40,0.36))', opacity: 0.92 }}>
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
        <div style={{ position: 'absolute', left: -28, top: -28, right: -28, bottom: -28, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(169,156,246,0.6) 0%, rgba(126,108,240,0.32) 55%, rgba(126,108,240,0) 78%)', animation: 'gj-w7s-halo 2400ms ease-in-out infinite' }} />
        <svg width={size + 56} height={size + 56} viewBox="0 0 200 200" style={{ position: 'absolute', left: -28, top: -28, pointerEvents: 'none', animation: 'gj-w7s-spin 8s linear infinite', transformOrigin: '50% 50%' }}>
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
        <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #EFE0C9', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 999, boxShadow: '0 3px 6px rgba(8,24,40,0.34)' }}>màn {n}</div>
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

  // ─── gate to World 8 (Núi lửa) ────────────────────────────────────
  function GateBanner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 38, transform: 'translateX(-50%)', width: 312,
        background: '#FFFFFF', border: '1.5px solid #E8C6B0', borderRadius: 999, padding: '8px 14px 8px 8px',
        display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 28px rgba(120,50,20,0.3), 0 4px 8px rgba(120,92,52,0.14)', zIndex: 16
      }}>
        {/* World 8 volcano badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #C8543A 0%, #93351F 55%, #5A1E10 100%)',
          border: '2.5px solid #E8703F', boxShadow: 'inset 0 -3px 0 rgba(40,12,6,0.4), inset 0 3px 0 rgba(255,180,120,0.5), 0 2px 4px rgba(80,30,15,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          {/* volcano glyph */}
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 21 L9 9 L15 9 L21 21 Z" fill="#5A2A18" stroke="#3A1810" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M9 9 L12 3 L15 9 Z" fill="#FFC061" stroke="#FF7A3D" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M10.5 21 L12 13 L13.5 21 Z" fill="#FF7A3D" />
          </svg>
          <div style={{ position: 'absolute', top: -6, right: -4, background: '#A8401F', border: '1.5px solid #E8703F', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, padding: '2px 6px', borderRadius: 999, lineHeight: 1, boxShadow: '0 2px 3px rgba(80,30,15,0.3)' }}>W8</div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.05, gap: 2 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', color: '#9B886F', whiteSpace: 'nowrap' }}>CỔNG · THẾ GIỚI 8</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#B5462E', whiteSpace: 'nowrap', lineHeight: 1.05 }}>Núi lửa</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)', border: '1.5px solid #E0A21F', padding: '6px 11px 7px 8px', borderRadius: 999, boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)', flexShrink: 0 }}>
          <Star filled size={14} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#6A4A2E', lineHeight: 1 }}>120</span>
        </div>
      </div>);

  }

  function StartSign() {
    return (
      <div style={{ position: 'absolute', left: '50%', top: H - 90, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ background: '#FFFFFF', color: '#2F6B83', border: '1.5px solid #BFD2E0', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(8,24,40,0.34)', textTransform: 'uppercase' }}>Hang băng · tiếp tục</div>
      </div>);

  }

  function World7Strip() {
    return (
      <div style={{ position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden' }}>
        <style>{`
          @keyframes gj-w7s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w7s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w7s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w7s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w7s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @keyframes gj-w7s-ember { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-7px);opacity:1} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>
        <Scene />
        <PathLayer />
        <GateBanner />
        {NODES.map((n) => <PlaceNode key={n.id} node={n} />)}
        <StartSign />
      </div>);

  }

  window.GJWorld7Strip = World7Strip;
})();
