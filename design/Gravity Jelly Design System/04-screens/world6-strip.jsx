/* world6-strip.jsx — Dải cuộn ĐẦY ĐỦ World 6 "Núi tuyết" (màn 51–60).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn, số node 51→60:
     • 51–55 node thường · 56 BREATHER · 57–59 thường · 60 BOSS
     • trên 60: CỔNG sang World 7 "Hang băng" (chip ★ 100); nền trên cổng
       blend sang palette Hang băng (#2C4A63→#1E3A52 hang động băng tối)
   Biome World 6 (nhìn từ trên xuống): LỐI MÒN TUYẾT nén trắng #FCFEFF→#E4EEF6
   chạy dọc GIỮA (hành lang x 72–290) cho đường + node; HAI MÉP là RỪNG
   THÔNG phủ tuyết — bóng tuyết xanh lạnh #B8CEDD với thông top-down dày,
   đụn tuyết. Trên lối mòn: người tuyết, thông nhỏ, tảng đá phủ tuyết, ao
   băng, chùm băng nhũ, xe trượt, hòn tuyết, mặt trời mùa đông nhạt.
   Exposes window.GJWorld6Strip.                                          */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const NODES = [
  { id: 51, x: 130, y: 2440, kind: 'reg', state: 'done', stars: 3, color: 'blue' },
  { id: 52, x: 240, y: 2250, kind: 'reg', state: 'done', stars: 3, color: 'mint' },
  { id: 53, x: 110, y: 2060, kind: 'reg', state: 'done', stars: 2, color: 'pink' },
  { id: 54, x: 240, y: 1870, kind: 'reg', state: 'current' },
  { id: 55, x: 120, y: 1680, kind: 'reg', state: 'locked' },
  { id: 56, x: 240, y: 1490, kind: 'breather', state: 'locked' },
  { id: 57, x: 110, y: 1290, kind: 'reg', state: 'locked' },
  { id: 58, x: 240, y: 1090, kind: 'reg', state: 'locked' },
  { id: 59, x: 150, y: 880, kind: 'reg', state: 'locked' },
  { id: 60, x: 180, y: 620, kind: 'boss', state: 'locked' }];


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
          {/* lối mòn tuyết nén ở giữa */}
          <linearGradient id="w6s-trail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FCFEFF" />
            <stop offset="0.5" stopColor="#EEF5FB" />
            <stop offset="1" stopColor="#E4EEF6" />
          </linearGradient>
          {/* rừng thông 2 mép (bóng tuyết xanh lạnh) */}
          <linearGradient id="w6s-forest-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#A6BFD2" />
            <stop offset="0.7" stopColor="#BBD0DE" />
            <stop offset="1" stopColor="#D4E2EC" />
          </linearGradient>
          <linearGradient id="w6s-forest-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#A6BFD2" />
            <stop offset="0.7" stopColor="#BBD0DE" />
            <stop offset="1" stopColor="#D4E2EC" />
          </linearGradient>
          {/* top band = HANG BĂNG nhìn TỪ TRÊN XUỐNG (W7 preview) */}
          <linearGradient id="w6s-cave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#22405A" />
            <stop offset="0.55" stopColor="#1E3A52" />
            <stop offset="1" stopColor="#2C5570" />
          </linearGradient>
          <radialGradient id="w6s-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFFDF2" stopOpacity="0.95" />
            <stop offset="0.55" stopColor="#FFF1C9" stopOpacity="0.4" />
            <stop offset="1" stopColor="#FFF1C9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w6s-crystal" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#BFF4FF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#7FE0F2" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* base snow trail */}
        <rect x="0" y="0" width={W} height={H} fill="url(#w6s-trail)" />

        {/* ── Top band: World 7 Hang băng — nhìn TỪ TRÊN XUỐNG ── */}
        <rect x="0" y="0" width={W} height="200" fill="url(#w6s-cave)" />
        {/* hồ băng phát sáng (aerial) */}
        <CaveCrystalPool cx={88} cy={70} rx={60} ry={26} />
        <CaveCrystalPool cx={278} cy={130} rx={70} ry={28} />
        {/* nền đá hang tối */}
        <CaveRock cx={300} cy={48} r={40} />
        <CaveRock cx={54} cy={156} r={44} />
        <CaveRock cx={170} cy={30} r={34} />
        {/* măng đá / tinh thể băng nhô lên (top-down) */}
        {[[150, 110, 16], [322, 178, 13], [40, 96, 12], [232, 70, 14], [108, 162, 11], [276, 36, 12]].map(([x, y, r], i) =>
        <CaveCrystal key={`cc${i}`} x={x} y={y} r={r} />
        )}
        {/* hơi lạnh lấp lánh */}
        {[[60, 100], [200, 142], [268, 60], [120, 32], [330, 90], [148, 52]].map(([x, y], i) =>
        <g key={`gl${i}`} style={{ animation: 'gj-w6s-float 3.6s ease-in-out infinite', animationDelay: `${i * 0.35}s`, transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r="2" fill="#CFF6FF" opacity="0.9" />
          </g>
        )}

        {/* ── Cave mouth meeting the snow trail ── */}
        <path d="M0 188 q 90 22 180 6 t 180 14 L360 250 L0 250 Z" fill="#D6E4EE" />
        <path d="M0 196 q 90 20 180 6 t 180 14" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.7" strokeLinecap="round" />

        {/* ── PINE FOREST on BOTH EDGES (mép TRÁI x≤72 / PHẢI x≥288) ── */}
        <ForestEdge side="l" />
        <ForestEdge side="r" />

        {/* ── Pale winter sun (upper-right) ── */}
        <circle cx="296" cy="430" r="120" fill="url(#w6s-sun)" />
        <WinterSun x={296} y={430} r={38} />

        {/* ── Snow decorations along the central trail (pockets
              OPPOSITE the path side) ── */}
        {/* snowmen */}
        {[[286, 2360, 1], [88, 1980, 0], [288, 1580, 1], [150, 1620, 0]].
        map(([x, y, t], i) => <Snowman key={`sm${i}`} x={x} y={y} tilt={t} />)}
        {/* snow-dusted pines on the trail */}
        {[[86, 2200, 64], [288, 1960, 58], [88, 1180, 60], [286, 760, 62], [120, 1360, 50]].
        map(([x, y, h], i) => <SnowPine key={`pn${i}`} x={x} y={y} h={h} />)}
        {/* snow-capped boulders */}
        {[[284, 2180], [110, 1700], [266, 880]].map(([x, y], i) => <SnowBoulder key={`bd${i}`} x={x} y={y} />)}
        {/* frozen ponds */}
        {[[150, 2120], [240, 1100]].map(([x, y], i) => <FrozenPond key={`fp${i}`} x={x} y={y} />)}
        {/* sleds */}
        {[[96, 2300], [228, 1040]].map(([x, y], i) => <Sled key={`sl${i}`} x={x} y={y} />)}
        {/* icicle clusters */}
        {[[262, 2040], [98, 1500], [276, 1320]].map(([x, y], i) => <Icicles key={`ic${i}`} x={x} y={y} />)}
        {/* snowballs */}
        {[[270, 2280], [108, 1820], [262, 1180], [130, 940]].
        map(([x, y, r], i) => <Snowball key={`sb${i}`} x={x} y={y} r={13 + i % 2 * 3} />)}

        {/* ── Snow sparkles ── */}
        {[[150, 2200], [120, 1500], [240, 1100], [160, 720], [200, 1900], [130, 1000]].map(([x, y], i) =>
        <g key={`sp${i}`}>
          <circle cx={x} cy={y} r="1.8" fill="#FFFFFF" opacity="0.9" />
          <circle cx={x + 14} cy={y + 18} r="1.2" fill="#D8ECFA" opacity="0.8" />
        </g>
        )}

        {/* ── Drifting jelly characters ── */}
        <FloatJelly x={300} y={1170} size={20} color="blue" delay="0s" />
        <FloatJelly x={56} y={2000} size={22} color="mint" delay="0.8s" />
        <FloatJelly x={300} y={2280} size={18} color="pink" delay="1.4s" />
      </svg>);

  }

  // ── top-down ice-cave terrain (World 7 preview) ──
  function CaveCrystalPool({ cx, cy, rx, ry }) {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#2E6E86" stroke="#5FC9DE" strokeWidth="2.5" opacity="0.95" />
        <ellipse cx={cx} cy={cy} rx={rx * 0.7} ry={ry * 0.66} fill="url(#w6s-crystal)" />
        <ellipse cx={cx - rx * 0.26} cy={cy - ry * 0.3} rx={rx * 0.34} ry={ry * 0.28} fill="#CFF6FF" opacity="0.4" />
      </g>);

  }
  function CaveRock({ cx, cy, r }) {
    const n = 7;const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.7 : r;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86]);
    }
    const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z';
    return (
      <g style={{ filter: 'drop-shadow(0 2px 3px rgba(8,24,40,0.4))' }}>
        <path d={d} fill="#2A4A63" stroke="#16344B" strokeWidth="1.5" strokeLinejoin="round" />
        {pts.map(([x, y], i) =>
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#16344B" strokeWidth="1" opacity="0.5" />
        )}
        <ellipse cx={cx} cy={cy - r * 0.2} rx={r * 0.4} ry={r * 0.26} fill="#3D6480" opacity="0.7" />
      </g>);

  }
  function CaveCrystal({ x, y, r = 14 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 6px rgba(127,224,242,0.55))' }}>
        <path d={`M ${x} ${y - r} L ${x + r * 0.5} ${y - r * 0.1} L ${x + r * 0.32} ${y + r} L ${x - r * 0.32} ${y + r} L ${x - r * 0.5} ${y - r * 0.1} Z`}
        fill="#7FE0F2" stroke="#CFF6FF" strokeWidth="1.4" strokeLinejoin="round" opacity="0.95" />
        <path d={`M ${x} ${y - r} L ${x} ${y + r}`} stroke="#CFF6FF" strokeWidth="1" opacity="0.7" />
        <path d={`M ${x} ${y - r} L ${x - r * 0.5} ${y - r * 0.1} M ${x} ${y - r} L ${x + r * 0.5} ${y - r * 0.1}`} stroke="#FFFFFF" strokeWidth="0.9" opacity="0.6" />
      </g>);

  }

  function WinterSun({ x, y, r = 38 }) {
    return (
      <g>
        {[...Array(10)].map((_, i) => {
          const a = i / 10 * Math.PI * 2;
          return <line key={i} x1={x + Math.cos(a) * (r + 6)} y1={y + Math.sin(a) * (r + 6)}
          x2={x + Math.cos(a) * (r + 16)} y2={y + Math.sin(a) * (r + 16)}
          stroke="#FFEDB0" strokeWidth="4" strokeLinecap="round" opacity="0.7" />;
        })}
        <circle cx={x} cy={y} r={r} fill="#FFF6DA" stroke="#FFE9A6" strokeWidth="2.5" />
        <circle cx={x - r * 0.28} cy={y - r * 0.28} r={r * 0.3} fill="#FFFEF4" opacity="0.85" />
      </g>);

  }

  // side-on snow-dusted pine standing on the trail
  function SnowPine({ x, y, h = 60 }) {
    const w = h * 0.5;
    const tiers = [0.0, 0.32, 0.62];
    return (
      <g style={{ filter: 'drop-shadow(0 4px 4px rgba(90,120,150,0.24))' }}>
        {/* trunk */}
        <rect x={x - 3} y={y - 12} width="6" height="12" rx="2" fill="#9A6E44" stroke="#7E5630" strokeWidth="1" />
        {tiers.map((t, i) => {
          const ty = y - 12 - h * (1 - t);
          const tw = w * (1 - t * 0.5);
          return (
            <g key={i}>
              <path d={`M ${x} ${ty} L ${x + tw / 2} ${ty + h * 0.32} L ${x - tw / 2} ${ty + h * 0.32} Z`}
              fill={i === 0 ? '#3F8A5E' : '#4E9A6C'} stroke="#357A50" strokeWidth="1.2" strokeLinejoin="round" />
              {/* snow cap on each tier */}
              <path d={`M ${x} ${ty} q ${tw * 0.22} ${h * 0.1} ${tw * 0.34} ${h * 0.18} q ${-tw * 0.34} ${-h * 0.04} ${-tw * 0.68} 0 q ${tw * 0.12} ${-h * 0.08} ${tw * 0.34} ${-h * 0.18} Z`}
              fill="#FFFFFF" opacity="0.92" />
            </g>);

        })}
        <circle cx={x} cy={y - 12 - h} r="3" fill="#FFFFFF" />
      </g>);

  }

  function Snowman({ x, y, tilt = 0 }) {
    return (
      <g transform={`rotate(${tilt * 6} ${x} ${y})`} style={{ filter: 'drop-shadow(0 4px 5px rgba(90,120,150,0.26))' }}>
        {/* base */}
        <circle cx={x} cy={y - 12} r="16" fill="#FFFFFF" stroke="#D2E2EE" strokeWidth="1.5" />
        <circle cx={x} cy={y - 34} r="12" fill="#FFFFFF" stroke="#D2E2EE" strokeWidth="1.5" />
        <circle cx={x} cy={y - 52} r="9" fill="#FFFFFF" stroke="#D2E2EE" strokeWidth="1.5" />
        {/* shading */}
        <ellipse cx={x + 5} cy={y - 10} rx="6" ry="9" fill="#E6F0F8" opacity="0.7" />
        {/* arms */}
        <line x1={x - 11} y1={y - 36} x2={x - 22} y2={y - 44} stroke="#9A6E44" strokeWidth="2" strokeLinecap="round" />
        <line x1={x + 11} y1={y - 36} x2={x + 22} y2={y - 42} stroke="#9A6E44" strokeWidth="2" strokeLinecap="round" />
        {/* buttons */}
        <circle cx={x} cy={y - 30} r="1.6" fill="#5B4636" />
        <circle cx={x} cy={y - 36} r="1.6" fill="#5B4636" />
        {/* face */}
        <circle cx={x - 3} cy={y - 54} r="1.5" fill="#3B2A18" />
        <circle cx={x + 3} cy={y - 54} r="1.5" fill="#3B2A18" />
        <path d={`M ${x} ${y - 51} l 8 2 l -8 2 Z`} fill="#FF9F68" stroke="#E97E45" strokeWidth="0.8" strokeLinejoin="round" />
        {/* scarf */}
        <path d={`M ${x - 9} ${y - 44} q 9 5 18 0`} fill="none" stroke="#F08A7E" strokeWidth="3.4" strokeLinecap="round" />
        <line x1={x + 8} y1={y - 43} x2={x + 11} y2={y - 33} stroke="#F08A7E" strokeWidth="3" strokeLinecap="round" />
      </g>);

  }

  function SnowBoulder({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 4px rgba(90,120,150,0.24))' }}>
        <path d={`M ${x - 20} ${y} q -4 -18 14 -22 q 10 -8 20 2 q 14 0 8 18 Z`} fill="#A9B9C7" stroke="#8395A6" strokeWidth="1.5" strokeLinejoin="round" />
        {/* snow cap */}
        <path d={`M ${x - 18} ${y - 14} q 12 -12 26 -8 q 8 -4 8 6 q -10 4 -20 2 q -8 4 -14 0 Z`} fill="#FFFFFF" opacity="0.94" />
        <ellipse cx={x + 6} cy={y - 4} rx="6" ry="4" fill="#8FA2B3" opacity="0.5" />
      </g>);

  }

  function FrozenPond({ x, y }) {
    return (
      <g>
        <ellipse cx={x} cy={y} rx="34" ry="16" fill="#C7E2F2" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.95" />
        <ellipse cx={x - 9} cy={y - 4} rx="12" ry="6" fill="#FFFFFF" opacity="0.4" />
        <path d={`M ${x - 16} ${y + 2} L ${x} ${y - 5} L ${x + 13} ${y + 3}`} fill="none" stroke="#9DC4DE" strokeWidth="1" opacity="0.7" />
        <path d={`M ${x - 4} ${y + 6} L ${x + 8} ${y - 2}`} fill="none" stroke="#9DC4DE" strokeWidth="1" opacity="0.6" />
      </g>);

  }

  function Sled({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 3px rgba(90,120,150,0.24))' }}>
        <rect x={x - 18} y={y - 8} width="36" height="8" rx="3" fill="#F08A7E" stroke="#D9685C" strokeWidth="1.5" />
        {[-12, -2, 8].map((o, i) =>
        <rect key={i} x={x + o} y={y - 8} width="3" height="8" rx="1" fill="#FFFFFF" opacity="0.6" />
        )}
        {/* runner */}
        <path d={`M ${x - 18} ${y + 2} L ${x + 16} ${y + 2} q 8 0 8 -8`} fill="none" stroke="#C9B07E" strokeWidth="2.4" strokeLinecap="round" />
        {/* rope */}
        <path d={`M ${x + 22} ${y - 6} q 10 -2 14 -12`} fill="none" stroke="#9A6E44" strokeWidth="1.6" strokeLinecap="round" />
      </g>);

  }

  function Icicles({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(90,120,150,0.2))' }}>
        <rect x={x - 16} y={y - 6} width="32" height="5" rx="2.5" fill="#E6F0F8" stroke="#C7DCEC" strokeWidth="1" />
        {[-12, -4, 4, 12].map((o, i) => {
          const len = [14, 20, 12, 17][i];
          return <path key={i} d={`M ${x + o - 3} ${y - 1} L ${x + o + 3} ${y - 1} L ${x + o} ${y - 1 + len} Z`}
          fill="#CFEAF7" stroke="#A9D2EA" strokeWidth="0.9" strokeLinejoin="round" opacity="0.95" />;
        })}
      </g>);

  }

  function Snowball({ x, y, r = 14 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 3px rgba(90,120,150,0.22))' }}>
        <circle cx={x} cy={y} r={r} fill="#FFFFFF" stroke="#D2E2EE" strokeWidth="1.5" />
        <circle cx={x - r * 0.3} cy={y - r * 0.32} r={r * 0.26} fill="#FFFFFF" opacity="0.9" />
        <ellipse cx={x + r * 0.3} cy={y + r * 0.3} rx={r * 0.4} ry={r * 0.26} fill="#E6F0F8" opacity="0.7" />
      </g>);

  }

  function ForestEdge({ side }) {
    // RỪNG THÔNG một mép — nền bóng tuyết xanh lạnh, mép trong uốn lượn có
    // gờ tuyết trắng, thông top-down dày, đụn tuyết, lấp lánh.
    const isL = side === 'l';
    const fill = isL ? 'url(#w6s-forest-l)' : 'url(#w6s-forest-r)';
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
    // top-down pines packed in the forest band
    const pines = [];
    for (let y = 300, i = 0; y < H; y += 95, i++) {
      const ix = inset(Math.round((y - 250) / 150));
      pines.push(<PineTop key={`pta${i}`} x={X(ix - 20 - i % 3 * 10)} y={y} r={11 + i % 3 * 3} />);
      if (i % 2 === 0) pines.push(<PineTop key={`ptb${i}`} x={X(28 + i % 2 * 8)} y={y + 46} r={9 + i % 2 * 3} />);
    }
    // snow drifts
    const drifts = [];
    for (let y = 360, i = 0; y < H; y += 300, i++) {
      drifts.push(<SnowDrift key={`sd${i}`} cx={X(40)} cy={y} rx={40} ry={16} />);
    }
    // sparkles
    const sparks = [];
    for (let y = 380, i = 0; y < H; y += 210, i++) {
      sparks.push(<circle key={`sk${i}`} cx={X(30 + i % 2 * 10)} cy={y} r="1.5" fill="#FFFFFF" opacity="0.85" />);
    }
    return (
      <g>
        <path d={d} fill={fill} />
        {drifts}
        {pines}
        {sparks}
        {/* snowbank ridge just inside the trail */}
        <path d={edge} fill="none" stroke="#C7DCEC" strokeWidth="9" opacity="0.55" strokeLinecap="round" />
        <path d={edge} fill="none" stroke="#FFFFFF" strokeWidth="4" opacity="0.9" strokeLinecap="round" />
      </g>);

  }
  function PineTop({ x, y, r = 11 }) {
    // thông nhìn TỪ TRÊN — ngôi sao xanh nhiều cánh + tâm tuyết
    const n = 8;const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.45 : r;
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z';
    return (
      <g style={{ filter: 'drop-shadow(0 2px 3px rgba(70,100,130,0.28))' }}>
        <path d={d} fill="#3F8A5E" stroke="#357A50" strokeWidth="1" strokeLinejoin="round" />
        <circle cx={x} cy={y} r={r * 0.4} fill="#FFFFFF" opacity="0.92" />
        <circle cx={x} cy={y} r={r * 0.14} fill="#9A6E44" />
      </g>);

  }
  function SnowDrift({ cx, cy, rx, ry }) {
    return (
      <g>
        <ellipse cx={cx} cy={cy + ry * 0.28} rx={rx} ry={ry} fill="#9FB8C9" opacity="0.5" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#F5FAFF" />
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
      <g style={{ animation: 'gj-w6s-float 3.6s ease-in-out infinite', animationDelay: delay,
        transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 4px 3px rgba(90,120,150,0.24))' }}>
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
        <path d={FULL_PATH} fill="none" stroke="rgba(90,120,150,0.18)"
        strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,4)" />
        <path d={FULL_PATH} fill="none" stroke="#DCE9F2"
        strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#FFFFFF"
        strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#BFD6E6"
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
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 5px 7px rgba(90,120,150,0.26))' }}>
        <JellyBlock color={color} size={size} showEyes={false} />
        <NumberBadge n={n} size={size} />
        <StarArc stars={stars} size={14} width={size + 14} />
      </div>);

  }
  function LockedRegularNode({ n, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 5px rgba(90,120,150,0.22))' }}>
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
          justifyContent: 'center', boxShadow: '0 2px 4px rgba(90,120,150,0.34)'
        }}>
          <LockGlyph size={13} />
        </div>
      </div>);

  }
  function CurrentNode({ n, size = 64 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: -16, top: -16, width: size + 32, height: size + 32, borderRadius: '50%', background: 'rgba(255,159,104,0.24)', animation: 'gj-w6s-pulse 1600ms ease-out infinite' }} />
        <div style={{ position: 'absolute', left: -5, top: -5, width: size + 10, height: size + 10, borderRadius: '50%', background: 'rgba(255,159,104,0.34)', animation: 'gj-w6s-pulse 1600ms ease-out infinite', animationDelay: '320ms' }} />
        <div style={{
          position: 'relative', width: size, height: size, borderRadius: '50%', background: '#FFFFFF', border: '3px solid #FF9F68',
          boxShadow: '0 6px 14px rgba(90,120,150,0.24), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width={size - 16} height={size - 16} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A" strokeWidth="2" strokeDasharray="3 4" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#E97E45' }}>{n}</div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)', animation: 'gj-w6s-hop 1400ms ease-in-out infinite', filter: 'drop-shadow(0 4px 4px rgba(90,120,150,0.30))' }}>
          <JellyBlock color="blue" size={38} direction="down" expression="happy" />
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
        <div style={{ position: 'absolute', top: -10, left: size + 8, background: '#FFFFFF', color: '#8C7458', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.10em', padding: '4px 10px', borderRadius: 999, boxShadow: '0 3px 8px rgba(90,120,150,0.22)', whiteSpace: 'nowrap' }}>NGHỈ</div>
        <div style={{ position: 'absolute', top: -6, left: size + 4, width: 10, height: 10, borderRadius: '50%', background: '#FFD074', border: '1.5px solid #E0A21F' }} />
        <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 5px rgba(90,120,150,0.24))', opacity: 0.92 }}>
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
        <div style={{ position: 'absolute', left: -28, top: -28, right: -28, bottom: -28, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(169,156,246,0.55) 0%, rgba(126,108,240,0.30) 55%, rgba(126,108,240,0) 78%)', animation: 'gj-w6s-halo 2400ms ease-in-out infinite' }} />
        <svg width={size + 56} height={size + 56} viewBox="0 0 200 200" style={{ position: 'absolute', left: -28, top: -28, pointerEvents: 'none', animation: 'gj-w6s-spin 8s linear infinite', transformOrigin: '50% 50%' }}>
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
        <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #EFE0C9', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 999, boxShadow: '0 3px 6px rgba(90,120,150,0.22)' }}>màn {n}</div>
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

  // ─── gate to World 7 (Hang băng) ──────────────────────────────────
  function GateBanner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 38, transform: 'translateX(-50%)', width: 312,
        background: '#FFFFFF', border: '1.5px solid #BFD2E0', borderRadius: 999, padding: '8px 14px 8px 8px',
        display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 28px rgba(40,70,100,0.32), 0 4px 8px rgba(120,92,52,0.14)', zIndex: 16
      }}>
        {/* World 7 ice-cave badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #4E7A92 0%, #2C5570 55%, #1B3A52 100%)',
          border: '2.5px solid #5F9FB8', boxShadow: 'inset 0 -3px 0 rgba(10,30,50,0.3), inset 0 3px 0 rgba(143,209,224,0.5), 0 2px 4px rgba(20,50,80,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          {/* ice crystal glyph */}
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2 L15 9 L12 22 L9 9 Z" fill="#7FE0F2" stroke="#CFF6FF" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M12 2 L12 22" stroke="#CFF6FF" strokeWidth="1" />
            <path d="M5 6 L12 11 L19 6" fill="none" stroke="#9FE9F7" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', top: -6, right: -4, background: '#3D7E96', border: '1.5px solid #5F9FB8', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, padding: '2px 6px', borderRadius: 999, lineHeight: 1, boxShadow: '0 2px 3px rgba(20,50,80,0.3)' }}>W7</div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.05, gap: 2 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', color: '#9B886F', whiteSpace: 'nowrap' }}>CỔNG · THẾ GIỚI 7</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#2F6B83', whiteSpace: 'nowrap', lineHeight: 1.05 }}>Hang băng</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)', border: '1.5px solid #E0A21F', padding: '6px 11px 7px 8px', borderRadius: 999, boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)', flexShrink: 0 }}>
          <Star filled size={14} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#6A4A2E', lineHeight: 1 }}>100</span>
        </div>
      </div>);

  }

  function StartSign() {
    return (
      <div style={{ position: 'absolute', left: '50%', top: H - 90, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(90,120,150,0.22)', textTransform: 'uppercase' }}>Núi tuyết · tiếp tục</div>
      </div>);

  }

  function World6Strip() {
    return (
      <div style={{ position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden' }}>
        <style>{`
          @keyframes gj-w6s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w6s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w6s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w6s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w6s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>
        <Scene />
        <PathLayer />
        <GateBanner />
        {NODES.map((n) => <PlaceNode key={n.id} node={n} />)}
        <StartSign />
      </div>);

  }

  window.GJWorld6Strip = World6Strip;
})();
