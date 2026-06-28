/* world5-strip.jsx — Dải cuộn ĐẦY ĐỦ World 5 "Bãi biển" (màn 41–50).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn, số node 41→50:
     • 41–45 node thường · 46 BREATHER · 47–49 thường · 50 BOSS
     • trên 50: CỔNG sang World 6 "Núi tuyết" (chip ★ 80); nền trên cổng
       blend sang palette Núi tuyết (#DCEBF5→#AcCfE6 trời tuyết lạnh)
   Biome World 5 (nhìn từ trên xuống): bãi cát vàng ấm #FBEEC9→#EBD29C chạy
   dọc GIỮA (hành lang x 72–290) cho đường + node; HAI MÉP là BIỂN xanh
   #6FC4DA→#4FA9CF với bọt sóng trắng lăn vào bờ, lấp lánh, phao/thuyền/cá
   nhỏ trôi. Trên cát: cọ, dù sọc, lâu đài cát, bóng biển, sao biển, vỏ sò,
   cua, xô-xẻng, mặt trời nóng. KHÔNG cây leo / vách đá.
   Exposes window.GJWorld5Strip.                                          */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const NODES = [
  { id: 41, x: 130, y: 2440, kind: 'reg', state: 'done', stars: 3, color: 'mint' },
  { id: 42, x: 240, y: 2250, kind: 'reg', state: 'done', stars: 3, color: 'yellow' },
  { id: 43, x: 110, y: 2060, kind: 'reg', state: 'done', stars: 2, color: 'pink' },
  { id: 44, x: 240, y: 1870, kind: 'reg', state: 'current' },
  { id: 45, x: 120, y: 1680, kind: 'reg', state: 'locked' },
  { id: 46, x: 240, y: 1490, kind: 'breather', state: 'locked' },
  { id: 47, x: 110, y: 1290, kind: 'reg', state: 'locked' },
  { id: 48, x: 240, y: 1090, kind: 'reg', state: 'locked' },
  { id: 49, x: 150, y: 880, kind: 'reg', state: 'locked' },
  { id: 50, x: 180, y: 620, kind: 'boss', state: 'locked' }];


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
          {/* dải cát giữa (warm sand) */}
          <linearGradient id="w5s-sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FBEEC9" />
            <stop offset="0.5" stopColor="#F4E2B4" />
            <stop offset="1" stopColor="#EBD29C" />
          </linearGradient>
          {/* biển 2 mép */}
          <linearGradient id="w5s-sea-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4FA9CF" />
            <stop offset="0.7" stopColor="#6FC4DA" />
            <stop offset="1" stopColor="#9ED9E6" />
          </linearGradient>
          <linearGradient id="w5s-sea-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#4FA9CF" />
            <stop offset="0.7" stopColor="#6FC4DA" />
            <stop offset="1" stopColor="#9ED9E6" />
          </linearGradient>
          {/* top band = cánh đồng tuyết nhìn TỪ TRÊN XUỐNG (W6 preview) */}
          <linearGradient id="w5s-snow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EDF5FC" />
            <stop offset="0.55" stopColor="#DBEAF4" />
            <stop offset="1" stopColor="#E9EDE8" />
          </linearGradient>
          <radialGradient id="w5s-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFF6D6" stopOpacity="0.95" />
            <stop offset="0.55" stopColor="#FFE38A" stopOpacity="0.45" />
            <stop offset="1" stopColor="#FFE38A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w5s-foam" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* base sand */}
        <rect x="0" y="0" width={W} height={H} fill="url(#w5s-sand)" />

        {/* ── Top band: World 6 Núi tuyết — nhìn TỪ TRÊN XUỐNG ── */}
        <rect x="0" y="0" width={W} height="200" fill="url(#w5s-snow)" />
        {/* hồ băng (aerial) */}
        <IcePatch cx={88} cy={66} rx={64} ry={28} />
        <IcePatch cx={276} cy={124} rx={72} ry={30} />
        {/* đụn tuyết mềm */}
        <SnowDrift cx={300} cy={46} rx={72} ry={24} />
        <SnowDrift cx={56} cy={150} rx={80} ry={26} />
        <SnowDrift cx={180} cy={26} rx={94} ry={22} />
        {/* đỉnh núi đá phủ tuyết nhìn từ trên */}
        <SummitTop cx={150} cy={108} r={36} />
        <SummitTop cx={322} cy={176} r={26} />
        {/* thông nhìn từ trên (đốm xanh + tuyết) */}
        {[[34, 58], [112, 150], [210, 78], [298, 28], [336, 128], [70, 38], [248, 162], [160, 172]].map(([x, y], i) =>
        <PineTop key={i} x={x} y={y} r={10 + i % 2 * 3} />
        )}
        {/* tuyết lấp lánh rơi */}
        {[[60, 100], [200, 142], [268, 60], [120, 32], [330, 90], [148, 52]].map(([x, y], i) =>
        <g key={`sf${i}`} style={{ animation: 'gj-w5s-float 3.6s ease-in-out infinite', animationDelay: `${i * 0.35}s`, transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r="2" fill="#FFFFFF" opacity="0.92" />
          </g>
        )}

        {/* ── Shore: sand causeway meeting the snow band ── */}
        <path d="M0 188 q 90 22 180 6 t 180 14 L360 250 L0 250 Z" fill="#F3E2BC" />
        <path d="M0 196 q 90 20 180 6 t 180 14" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" strokeLinecap="round" />

        {/* ── SEA on BOTH EDGES (mép TRÁI x≤72 / PHẢI x≥288) ── */}
        <SeaEdge side="l" />
        <SeaEdge side="r" />

        {/* ── Big beach sun (over sea, upper-right) ── */}
        <circle cx="296" cy="430" r="120" fill="url(#w5s-sun)" />
        <BeachSun x={296} y={430} r={40} />

        {/* ── Beach decorations along the central sand (in pockets
              OPPOSITE the path side) ── */}
        {/* palms */}
        {[[286, 2380, 64], [86, 2000, 56], [288, 1600, 60], [88, 1180, 52], [286, 760, 58]].
        map(([x, y, h], i) => <Palm key={`pl${i}`} x={x} y={y} h={h} />)}
        {/* striped umbrellas */}
        {[[88, 2300, 1], [286, 1960, 0], [90, 1520, 1]].
        map(([x, y, t], i) => <Umbrella key={`um${i}`} x={x} y={y} tilt={t} />)}
        {/* sandcastles */}
        {[[284, 2180], [110, 1360]].map(([x, y], i) => <Sandcastle key={`sc${i}`} x={x} y={y} />)}
        {/* beach balls */}
        {[[96, 2120, 16], [288, 1760, 14], [94, 980, 15]].
        map(([x, y, r], i) => <BeachBall key={`bb${i}`} x={x} y={y} r={r} />)}
        {/* starfish + shells + crabs scattered */}
        {[[120, 2280], [262, 2040], [98, 1700], [276, 1320], [130, 940], [250, 700]].
        map(([x, y], i) => <Starfish key={`st${i}`} x={x} y={y} r={11 + i % 2 * 2} />)}
        {[[150, 2150], [238, 1860], [104, 1240], [266, 880]].
        map(([x, y], i) => <Shell key={`sh${i}`} x={x} y={y} />)}
        {[[270, 2300], [108, 1820], [262, 1180]].
        map(([x, y], i) => <Crab key={`cr${i}`} x={x} y={y} />)}
        {/* bucket + spade */}
        {[[150, 1620], [228, 1040]].map(([x, y], i) => <Bucket key={`bk${i}`} x={x} y={y} />)}

        {/* ── Sand sparkles ── */}
        {[[150, 2200], [120, 1500], [240, 1100], [160, 720], [200, 1900], [130, 1000]].map(([x, y], i) =>
        <circle key={`sp${i}`} cx={x} cy={y} r="1.6" fill="#FFF7DC" opacity="0.85" />
        )}

        {/* ── Drifting jelly characters ── */}
        <FloatJelly x={300} y={1170} size={20} color="blue" delay="0s" />
        <FloatJelly x={56} y={2000} size={22} color="pink" delay="0.8s" />
        <FloatJelly x={300} y={2280} size={18} color="mint" delay="1.4s" />
      </svg>);

  }

  // ── top-down snow terrain (World 6 preview) ──
  function IcePatch({ cx, cy, rx, ry }) {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#C7E2F2" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.92" />
        <ellipse cx={cx - rx * 0.26} cy={cy - ry * 0.3} rx={rx * 0.4} ry={ry * 0.34} fill="#FFFFFF" opacity="0.35" />
        <path d={`M ${cx - rx * 0.5} ${cy + ry * 0.1} L ${cx} ${cy - ry * 0.3} L ${cx + rx * 0.42} ${cy + ry * 0.2}`} fill="none" stroke="#A9CFE6" strokeWidth="1" opacity="0.6" />
      </g>);

  }
  function SnowDrift({ cx, cy, rx, ry }) {
    return (
      <g>
        <ellipse cx={cx} cy={cy + ry * 0.28} rx={rx} ry={ry} fill="#C9DCEC" opacity="0.65" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#F5FAFF" />
      </g>);

  }
  function SummitTop({ cx, cy, r }) {
    // đỉnh núi đá nhìn TỪ TRÊN — vạt đá lởm chởm + tuyết phủ giữa, gờ tỏa ra
    const n = 7;const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.68 : r;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86]);
    }
    const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z';
    const ip = pts.map(([x, y]) => [cx + (x - cx) * 0.5, cy + (y - cy) * 0.5]);
    const id = 'M ' + ip.map((p) => p.join(' ')).join(' L ') + ' Z';
    return (
      <g style={{ filter: 'drop-shadow(0 2px 3px rgba(90,120,150,0.22))' }}>
        <path d={d} fill="#A6B8CC" stroke="#8197AE" strokeWidth="1.5" strokeLinejoin="round" />
        {pts.map(([x, y], i) =>
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#8197AE" strokeWidth="1" opacity="0.5" />
        )}
        <path d={id} fill="#FFFFFF" stroke="#E3EDF5" strokeWidth="1" strokeLinejoin="round" />
      </g>);

  }
  function PineTop({ x, y, r = 10 }) {
    // thông nhìn TỪ TRÊN — ngôi sao xanh nhiều cánh + tâm tuyết
    const n = 8;const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.45 : r;
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z';
    return (
      <g style={{ filter: 'drop-shadow(0 1px 2px rgba(90,120,150,0.20))' }}>
        <path d={d} fill="#5F8A6E" stroke="#4A7458" strokeWidth="1" strokeLinejoin="round" />
        <circle cx={x} cy={y} r={r * 0.36} fill="#FFFFFF" opacity="0.92" />
        <circle cx={x} cy={y} r={r * 0.13} fill="#9A7A52" />
      </g>);

  }

  function BeachSun({ x, y, r = 40 }) {
    return (
      <g>
        {[...Array(10)].map((_, i) => {
          const a = i / 10 * Math.PI * 2;
          return <line key={i} x1={x + Math.cos(a) * (r + 6)} y1={y + Math.sin(a) * (r + 6)}
          x2={x + Math.cos(a) * (r + 18)} y2={y + Math.sin(a) * (r + 18)}
          stroke="#FFD86A" strokeWidth="4" strokeLinecap="round" opacity="0.85" />;
        })}
        <circle cx={x} cy={y} r={r} fill="#FFE9A6" stroke="#FFD16A" strokeWidth="2.5" />
        <circle cx={x - r * 0.28} cy={y - r * 0.28} r={r * 0.3} fill="#FFF4CE" opacity="0.85" />
      </g>);

  }
  function Palm({ x, y, h = 56 }) {
    // thân ĐỨNG THẲNG, hơi thuôn; tán cọ xòe ĐỀU CẢ HAI BÊN
    const fronds = [-74, -40, -10, 22];
    const leaf = 'M0 0 Q 24 -8 46 4 Q 26 1 0 7 Z';
    return (
      <g style={{ filter: 'drop-shadow(0 3px 3px rgba(120,100,40,0.22))' }}>
        <path d={`M ${x - 3.5} ${y} L ${x - 2} ${y - h} L ${x + 2} ${y - h} L ${x + 3.5} ${y} Z`} fill="#B98A56" stroke="#A2773F" strokeWidth="1" strokeLinejoin="round" />
        {[0.28, 0.52, 0.76].map((f, i) =>
        <line key={i} x1={x - 2.8} y1={y - h * f} x2={x + 2.8} y2={y - h * f - 1} stroke="#A2773F" strokeWidth="0.9" opacity="0.5" />
        )}
        <g transform={`translate(${x} ${y - h})`}>
          {fronds.map((deg, i) =>
          <path key={`r${i}`} d={leaf} fill={i % 2 ? '#57A86A' : '#67B87A'} stroke="#3F8A52" strokeWidth="1" transform={`rotate(${deg})`} />
          )}
          {fronds.map((deg, i) =>
          <path key={`l${i}`} d={leaf} fill={i % 2 ? '#57A86A' : '#67B87A'} stroke="#3F8A52" strokeWidth="1" transform={`scale(-1,1) rotate(${deg})`} />
          )}
          <circle cx="0" cy="2" r="3.6" fill="#C98A4E" />
          <circle cx="-3.5" cy="5" r="2.6" fill="#B97A3E" />
          <circle cx="3.5" cy="5" r="2.6" fill="#B97A3E" />
        </g>
      </g>);

  }
  function Umbrella({ x, y, tilt = 0 }) {
    const r = 30;
    const wedges = ['#F7A9C0', '#FFFFFF', '#8FB6F2', '#FFFFFF', '#FFE3A3', '#FFFFFF'];
    return (
      <g transform={`rotate(${tilt * 8} ${x} ${y})`} style={{ filter: 'drop-shadow(0 3px 4px rgba(120,100,40,0.22))' }}>
        <line x1={x} y1={y - 4} x2={x + 10} y2={y + 40} stroke="#C9B07E" strokeWidth="3.5" strokeLinecap="round" />
        {wedges.map((c, i) => {
          const a0 = Math.PI + i / wedges.length * Math.PI;
          const a1 = Math.PI + (i + 1) / wedges.length * Math.PI;
          const x0 = x + Math.cos(a0) * r,y0 = y + Math.sin(a0) * r;
          const x1 = x + Math.cos(a1) * r,y1 = y + Math.sin(a1) * r;
          return <path key={i} d={`M ${x} ${y} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`} fill={c} stroke="#E576A0" strokeWidth="0.8" />;
        })}
        <path d={`M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`} fill="none" stroke="#E89BB4" strokeWidth="1.5" opacity="0.5" />
        <circle cx={x} cy={y - r} r="2.6" fill="#E576A0" />
      </g>);

  }
  function Sandcastle({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 3px rgba(150,120,60,0.22))' }}>
        <rect x={x - 22} y={y - 14} width="44" height="16" rx="3" fill="#E7CE97" stroke="#CDB178" strokeWidth="1.5" />
        {[-20, -6, 8].map((o, i) =>
        <g key={i}>
            <rect x={x + o} y={y - 30} width="14" height="20" rx="3" fill="#EFD9A6" stroke="#CDB178" strokeWidth="1.5" />
            <path d={`M ${x + o - 2} ${y - 30} L ${x + o + 7} ${y - 40} L ${x + o + 16} ${y - 30} Z`} fill="#E7CE97" stroke="#CDB178" strokeWidth="1.3" strokeLinejoin="round" />
          </g>
        )}
        {/* flag */}
        <line x1={x + 15} y1={y - 40} x2={x + 15} y2={y - 52} stroke="#9A7A52" strokeWidth="1.5" />
        <path d={`M ${x + 15} ${y - 52} L ${x + 25} ${y - 49} L ${x + 15} ${y - 46} Z`} fill="#F08A7E" />
        {/* crenellations */}
        {[-18, -12, -6, 0, 6, 12, 18].map((o, i) =>
        <rect key={`cr${i}`} x={x + o - 1.5} y={y - 17} width="3" height="3" fill="#EFD9A6" />
        )}
      </g>);

  }
  function BeachBall({ x, y, r = 16 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 3px rgba(120,100,40,0.24))' }}>
        <circle cx={x} cy={y} r={r} fill="#FFFFFF" stroke="#E8D7B6" strokeWidth="1.5" />
        <path d={`M ${x} ${y - r} A ${r} ${r} 0 0 1 ${x + r * 0.86} ${y + r * 0.5} L ${x} ${y} Z`} fill="#F7A9C0" />
        <path d={`M ${x} ${y - r} A ${r} ${r} 0 0 0 ${x - r * 0.86} ${y + r * 0.5} L ${x} ${y} Z`} fill="#8FB6F2" />
        <path d={`M ${x - r * 0.86} ${y + r * 0.5} A ${r} ${r} 0 0 0 ${x + r * 0.86} ${y + r * 0.5} L ${x} ${y} Z`} fill="#FFE3A3" />
        <circle cx={x - r * 0.3} cy={y - r * 0.32} r={r * 0.22} fill="#FFFFFF" opacity="0.7" />
      </g>);

  }
  function Starfish({ x, y, r = 12 }) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = (-90 + i * 72) * Math.PI / 180;
      pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
      const a2 = (-90 + i * 72 + 36) * Math.PI / 180;
      pts.push([x + Math.cos(a2) * r * 0.46, y + Math.sin(a2) * r * 0.46]);
    }
    const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z';
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.22))' }}>
        <path d={d} fill="#FFB07F" stroke="#E97E45" strokeWidth="1.4" strokeLinejoin="round" />
        {[0, 1, 2, 3, 4].map((i) => {const a = (-90 + i * 72) * Math.PI / 180;return <circle key={i} cx={x + Math.cos(a) * r * 0.4} cy={y + Math.sin(a) * r * 0.4} r="1.1" fill="#FFE3A3" />;})}
      </g>);

  }
  function Shell({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 1px 1px rgba(120,100,40,0.2))' }}>
        <path d={`M ${x} ${y} a 8 8 0 1 1 0.1 0 Z`} fill="#FBD8E2" stroke="#E89BB4" strokeWidth="1.3" />
        {[-4, 0, 4].map((o, i) =>
        <line key={i} x1={x} y1={y} x2={x + o} y2={y - 8} stroke="#E89BB4" strokeWidth="1.1" />
        )}
      </g>);

  }
  function Crab({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.22))' }}>
        {/* legs */}
        {[-1, 1].map((s) => [0, 1, 2].map((i) =>
        <line key={`${s}${i}`} x1={x + s * 8} y1={y + 2 + i * 2} x2={x + s * 18} y2={y - 2 + i * 5} stroke="#E97E45" strokeWidth="1.8" strokeLinecap="round" />
        ))}
        {/* claws */}
        <circle cx={x - 16} cy={y - 6} r="4" fill="#F08A7E" stroke="#D9685C" strokeWidth="1.2" />
        <circle cx={x + 16} cy={y - 6} r="4" fill="#F08A7E" stroke="#D9685C" strokeWidth="1.2" />
        {/* body */}
        <ellipse cx={x} cy={y} rx="11" ry="8" fill="#F08A7E" stroke="#D9685C" strokeWidth="1.5" />
        <circle cx={x - 4} cy={y - 3} r="1.6" fill="#3B2A18" />
        <circle cx={x + 4} cy={y - 3} r="1.6" fill="#3B2A18" />
        <path d={`M ${x - 3} ${y + 2} q 3 2 6 0`} fill="none" stroke="#9A3A30" strokeWidth="1.2" strokeLinecap="round" />
      </g>);

  }
  function Bucket({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.22))' }}>
        <path d={`M ${x - 11} ${y - 16} L ${x + 11} ${y - 16} L ${x + 8} ${y} L ${x - 8} ${y} Z`} fill="#8FB6F2" stroke="#6F97DE" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={`M ${x - 11} ${y - 16} Q ${x} ${y - 28} ${x + 11} ${y - 16}`} fill="none" stroke="#6F97DE" strokeWidth="1.8" />
        <rect x={x - 11} y={y - 18} width="22" height="3" rx="1.5" fill="#A9C8F6" />
        {/* spade */}
        <line x1={x + 14} y1={y - 22} x2={x + 20} y2={y} stroke="#C9B07E" strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx={x + 12} cy={y - 24} rx="5" ry="4" fill="#FFCA66" stroke="#E0A21F" strokeWidth="1.3" transform={`rotate(-24 ${x + 12} ${y - 24})`} />
      </g>);

  }

  function SeaEdge({ side }) {
    // BIỂN một mép — mặt nước xanh, mép trong (bờ) uốn lượn có bọt trắng,
    // sóng ngang lăn, lấp lánh, vài phao/cá nhỏ trôi.
    const isL = side === 'l';
    const fill = isL ? 'url(#w5s-sea-l)' : 'url(#w5s-sea-r)';
    const X = (v) => isL ? v : W - v;
    const outerX = isL ? -24 : W + 24;
    // inner shoreline points (wavy)
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
    // foam edge stroke path (just the shoreline)
    let foam = `M ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],[x, y] = pts[i];
      foam += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    // horizontal wave ripples on the water
    const waves = [];
    for (let y = 320, i = 0; y < H; y += 90, i++) {
      const ix = inset(Math.round((y - 250) / 150));
      const x0 = isL ? -10 : W + 10;const x1 = X(ix + 12);
      waves.push(
        <path key={`wv${i}`} d={`M ${x0} ${y} q ${(x1 - x0) / 4} -6 ${(x1 - x0) / 2} 0 t ${(x1 - x0) / 2} 0`}
        fill="none" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.4" strokeLinecap="round" />
      );
    }
    // sparkles
    const sparks = [];
    for (let y = 360, i = 0; y < H; y += 210, i++) {
      sparks.push(<circle key={`sk${i}`} cx={X(28 + i % 2 * 10)} cy={y} r="1.5" fill="#FFFFFF" opacity="0.85" />);
    }
    // floating props (buoy / little fish)
    const props = [];
    [620, 1240, 1880, 2380].forEach((y, i) => {
      if (i % 2 === 0) props.push(<Buoy key={`bu${i}`} x={X(34)} y={y} />);else
      props.push(<MiniFish key={`fi${i}`} x={X(36)} y={y} flip={!isL} />);
    });
    return (
      <g>
        <path d={d} fill={fill} />
        {waves}
        {sparks}
        {props}
        {/* wet-sand band just inside shoreline */}
        <path d={foam} fill="none" stroke="#EAD7A8" strokeWidth="9" opacity="0.55" strokeLinecap="round" />
        {/* foam line */}
        <path d={foam} fill="none" stroke="#FFFFFF" strokeWidth="4" opacity="0.85" strokeLinecap="round" />
        <path d={foam} fill="none" stroke="#CFEEF5" strokeWidth="2" opacity="0.7" strokeLinecap="round" transform="translate(0,4)" />
      </g>);

  }
  function Buoy({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(40,90,110,0.25))' }}>
        <circle cx={x} cy={y} r="9" fill="#FFFFFF" stroke="#F08A7E" strokeWidth="3" />
        <circle cx={x} cy={y} r="3.4" fill="#6FC4DA" />
        <ellipse cx={x} cy={y + 11} rx="13" ry="3" fill="#FFFFFF" opacity="0.45" />
      </g>);

  }
  function MiniFish({ x, y, flip }) {
    return (
      <g transform={flip ? `scale(-1,1) translate(${-2 * x},0)` : undefined} style={{ filter: 'drop-shadow(0 1px 1px rgba(40,90,110,0.22))' }}>
        <ellipse cx={x} cy={y} rx="9" ry="5.5" fill="#FFE3A3" stroke="#E8B85C" strokeWidth="1.3" />
        <path d={`M ${x + 8} ${y} l 7 -5 l 0 10 Z`} fill="#FFD074" stroke="#E8B85C" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx={x - 4} cy={y - 1.5} r="1.4" fill="#3B2A18" />
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
      <g style={{ animation: 'gj-w5s-float 3.6s ease-in-out infinite', animationDelay: delay,
        transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 4px 3px rgba(120,100,40,0.22))' }}>
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
        <path d={FULL_PATH} fill="none" stroke="rgba(120,90,40,0.20)"
        strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,4)" />
        <path d={FULL_PATH} fill="none" stroke="#E7D09A"
        strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#FCF1D2"
        strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#E6CFA0"
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
        fill={filled ? '#FFC23D' : '#D9CDB5'} stroke={filled ? '#E0A21F' : '#B6A892'}
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
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 5px 7px rgba(120,100,40,0.24))' }}>
        <JellyBlock color={color} size={size} showEyes={false} />
        <NumberBadge n={n} size={size} />
        <StarArc stars={stars} size={14} width={size + 14} />
      </div>);

  }
  function LockedRegularNode({ n, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 5px rgba(120,100,40,0.20))' }}>
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
          justifyContent: 'center', boxShadow: '0 2px 4px rgba(120,100,40,0.32)'
        }}>
          <LockGlyph size={13} />
        </div>
      </div>);

  }
  function CurrentNode({ n, size = 64 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: -16, top: -16, width: size + 32, height: size + 32, borderRadius: '50%', background: 'rgba(255,159,104,0.24)', animation: 'gj-w5s-pulse 1600ms ease-out infinite' }} />
        <div style={{ position: 'absolute', left: -5, top: -5, width: size + 10, height: size + 10, borderRadius: '50%', background: 'rgba(255,159,104,0.34)', animation: 'gj-w5s-pulse 1600ms ease-out infinite', animationDelay: '320ms' }} />
        <div style={{
          position: 'relative', width: size, height: size, borderRadius: '50%', background: '#FFFFFF', border: '3px solid #FF9F68',
          boxShadow: '0 6px 14px rgba(120,100,40,0.24), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width={size - 16} height={size - 16} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A" strokeWidth="2" strokeDasharray="3 4" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#E97E45' }}>{n}</div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)', animation: 'gj-w5s-hop 1400ms ease-in-out infinite', filter: 'drop-shadow(0 4px 4px rgba(120,100,40,0.30))' }}>
          <JellyBlock color="mint" size={38} direction="down" expression="happy" />
        </div>
        <div style={{
          position: 'absolute', left: '50%', top: size + 10, transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)', color: '#FFFFFF',
          border: '2px solid #E97E45', borderBottom: '3px solid #C8662F', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          padding: '5px 14px 6px', borderRadius: 999, boxShadow: '0 6px 12px rgba(201,102,47,0.35), inset 0 2px 0 rgba(255,197,154,0.6)', whiteSpace: 'nowrap'
        }}>Chơi ngay</div>
      </div>);

  }
  function BreatherNode({ n, size = 48 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: -10, left: size + 8, background: '#FFFFFF', color: '#8C7458', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.10em', padding: '4px 10px', borderRadius: 999, boxShadow: '0 3px 8px rgba(120,100,40,0.20)', whiteSpace: 'nowrap' }}>NGHỈ</div>
        <div style={{ position: 'absolute', top: -6, left: size + 4, width: 10, height: 10, borderRadius: '50%', background: '#FFD074', border: '1.5px solid #E0A21F' }} />
        <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 5px rgba(120,100,40,0.22))', opacity: 0.92 }}>
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
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 8px 14px rgba(126,108,240,0.40))' }}>
        <div style={{ position: 'absolute', left: -28, top: -28, right: -28, bottom: -28, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(169,156,246,0.55) 0%, rgba(126,108,240,0.30) 55%, rgba(126,108,240,0) 78%)', animation: 'gj-w5s-halo 2400ms ease-in-out infinite' }} />
        <svg width={size + 56} height={size + 56} viewBox="0 0 200 200" style={{ position: 'absolute', left: -28, top: -28, pointerEvents: 'none', animation: 'gj-w5s-spin 8s linear infinite', transformOrigin: '50% 50%' }}>
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
        <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #EFE0C9', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 999, boxShadow: '0 3px 6px rgba(120,100,40,0.20)' }}>màn {n}</div>
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

  // ─── gate to World 6 (Núi tuyết) ──────────────────────────────────
  function GateBanner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 38, transform: 'translateX(-50%)', width: 312,
        background: '#FFFFFF', border: '1.5px solid #D2E2F0', borderRadius: 999, padding: '8px 14px 8px 8px',
        display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 28px rgba(90,120,160,0.30), 0 4px 8px rgba(120,92,52,0.14)', zIndex: 16
      }}>
        {/* World 6 snow badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #FFFFFF 0%, #CFE2F2 55%, #9DBCDC 100%)',
          border: '2.5px solid #8AA9C6', boxShadow: 'inset 0 -3px 0 rgba(90,120,150,0.14), inset 0 3px 0 rgba(255,255,255,0.7), 0 2px 4px rgba(90,120,150,0.32)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
            <g stroke="#6E92B6" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="3" x2="12" y2="21" />
              <line x1="3.5" y1="7.5" x2="20.5" y2="16.5" />
              <line x1="20.5" y1="7.5" x2="3.5" y2="16.5" />
              <path d="M12 3 l-2.5 2.5 M12 3 l2.5 2.5 M12 21 l-2.5 -2.5 M12 21 l2.5 -2.5" />
            </g>
          </svg>
          <div style={{ position: 'absolute', top: -6, right: -4, background: '#A6C2DA', border: '1.5px solid #8AA9C6', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, padding: '2px 6px', borderRadius: 999, lineHeight: 1, boxShadow: '0 2px 3px rgba(90,120,150,0.20)' }}>W6</div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.05, gap: 2 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', color: '#9B886F', whiteSpace: 'nowrap' }}>CỔNG · THẾ GIỚI 6</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#5C7C9E', whiteSpace: 'nowrap', lineHeight: 1.05 }}>Núi tuyết</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)', border: '1.5px solid #E0A21F', padding: '6px 11px 7px 8px', borderRadius: 999, boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)', flexShrink: 0 }}>
          <Star filled size={14} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#6A4A2E', lineHeight: 1 }}>80</span>
        </div>
      </div>);

  }

  function StartSign() {
    return (
      <div style={{ position: 'absolute', left: '50%', top: H - 90, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(120,100,40,0.20)', textTransform: 'uppercase' }}>Bãi biển · tiếp tục</div>
      </div>);

  }

  function World5Strip() {
    return (
      <div style={{ position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden' }}>
        <style>{`
          @keyframes gj-w5s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w5s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w5s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w5s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w5s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>
        <Scene />
        <PathLayer />
        <GateBanner />
        {NODES.map((n) => <PlaceNode key={n.id} node={n} />)}
        <StartSign />
      </div>);

  }

  window.GJWorld5Strip = World5Strip;
})();
