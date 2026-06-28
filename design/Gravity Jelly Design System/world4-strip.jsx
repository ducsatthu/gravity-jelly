/* world4-strip.jsx — Dải cuộn ĐẦY ĐỦ World 4 "Sa mạc" (màn 31–40).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn, số node 31→40:
     • 31–35 node thường · 36 BREATHER · 37–39 thường · 40 BOSS
     • trên 40: CỔNG sang World 5 "Bãi biển" (chip ★ 72); nền trên cổng
       blend sang palette Bãi biển (#B6E4EF→#4FA9CF ocean)
   Biome World 4: trời cát ấm #FBEBCB→#EFCB85, đụn cát tầng, xương rồng,
   đá tảng/mesa sa thạch, ốc đảo (nước xanh + cọ), mặt trời nóng, kim tự
   tháp xa, hạt cát lấp lánh, sóng nhiệt mờ. Vách hẻm sa thạch 2 bên (mép
   TRÁI x≤72 / PHẢI x≥288) — KHÔNG cây leo, thay bằng cỏ khô + xương rồng
   nhỏ. Hành lang giữa (x 72–290) TRỐNG cho đường + node.
   Exposes window.GJWorld4Strip.                                          */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const NODES = [
  { id: 31, x: 130, y: 2440, kind: 'reg', state: 'done', stars: 3, color: 'yellow' },
  { id: 32, x: 240, y: 2250, kind: 'reg', state: 'done', stars: 3, color: 'pink' },
  { id: 33, x: 110, y: 2060, kind: 'reg', state: 'done', stars: 2, color: 'mint' },
  { id: 34, x: 240, y: 1870, kind: 'reg', state: 'current' },
  { id: 35, x: 120, y: 1680, kind: 'reg', state: 'locked' },
  { id: 36, x: 240, y: 1490, kind: 'breather', state: 'locked' },
  { id: 37, x: 110, y: 1290, kind: 'reg', state: 'locked' },
  { id: 38, x: 240, y: 1090, kind: 'reg', state: 'locked' },
  { id: 39, x: 150, y: 880, kind: 'reg', state: 'locked' },
  { id: 40, x: 180, y: 620, kind: 'boss', state: 'locked' }];


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
          <linearGradient id="w4s-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4FA9CF" />{/* W5 ocean sâu     */}
            <stop offset="0.05" stopColor="#79C4DE" />
            <stop offset="0.11" stopColor="#B6E4EF" />{/* W5 beach sky     */}
            <stop offset="0.16" stopColor="#E4EBC9" />{/* blend sand       */}
            <stop offset="0.21" stopColor="#FBEBCB" />{/* W4 Sa mạc top    */}
            <stop offset="0.58" stopColor="#F6DCA6" />
            <stop offset="1" stopColor="#EFCB85" />{/* W4 floor         */}
          </linearGradient>
          <radialGradient id="w4s-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFF6D6" stopOpacity="0.95" />
            <stop offset="0.55" stopColor="#FFE38A" stopOpacity="0.5" />
            <stop offset="1" stopColor="#FFE38A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w4s-shimmer" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#FFF6DC" stopOpacity="0.5" />
            <stop offset="1" stopColor="#FFF6DC" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w4s-oasis" cx="0.5" cy="0.4" r="0.62">
            <stop offset="0" stopColor="#BFEAF0" />
            <stop offset="0.6" stopColor="#7FCBDD" />
            <stop offset="1" stopColor="#5BB4CB" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#w4s-sky)" />

        {/* ── Top band: World 5 Bãi biển (ocean + shore + palm) ── */}
        {(() => {
          const els = [];
          // ocean waves
          for (let i = 0, y = 40; y < 150; y += 26, i++) {
            els.push(
              <path key={`wv${i}`} d={`M 0 ${y} q 30 -8 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`}
              fill="none" stroke="#FFFFFF" strokeWidth="2" opacity={0.45 - i * 0.06} strokeLinecap="round" />
            );
          }
          return els;
        })()}
        {/* sand causeway / mỏm cát — đường đi LUÔN trên cát, không trên mặt
            biển: dải cát chạy dọc giữa nối bờ lên mép trên, ôm lấy con đường */}
        <path d="M150 -12 C 146 50, 138 100, 134 152 L 226 152 C 222 100, 214 50, 210 -12 Z"
        fill="#F0DBAA" />
        <path d="M150 -12 C 146 50, 138 100, 134 152" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.65" strokeLinecap="round" />
        <path d="M210 -12 C 214 50, 222 100, 226 152" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.65" strokeLinecap="round" />
        <ellipse cx="180" cy="40" rx="30" ry="7" fill="#FBEDC8" opacity="0.55" />
        {/* shore line */}
        <path d="M0 150 q 90 26 180 8 t 180 14 L360 230 L0 230 Z" fill="#F3E2BC" />
        <path d="M0 158 q 90 24 180 8 t 180 14" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
        {/* beach palms + sun + shells */}
        <BeachSun x={64} y={92} r={26} />
        <Palm x={300} y={196} h={56} />
        <Palm x={120} y={206} h={42} />
        <Rock x={210} y={210} r={12} c="#E7D3A8" edge="#C9B07E" />
        {[[160, 196], [250, 202], [80, 200]].map(([x, y], i) =>
        <Shell key={i} x={x} y={y} />
        )}

        {/* ── Blend zone (sand drifting onto shore) ── */}
        <ellipse cx="40" cy="300" rx="130" ry="48" fill="#F6DEAC" />
        <ellipse cx="320" cy="312" rx="150" ry="54" fill="#F2D69E" />
        <ellipse cx="180" cy="372" rx="220" ry="66" fill="#EFCF92" />

        {/* ── Big desert sun ── */}
        <circle cx="270" cy="640" r="120" fill="url(#w4s-sun)" />
        <circle cx="270" cy="640" r="46" fill="#FFEFB0" opacity="0.92" />
        <circle cx="270" cy="640" r="34" fill="#FFE38A" />

        {/* ── distant pyramids / mesas (back layer) ── */}
        <Pyramid x={92} y={760} s={84} fill="#E9C98C" edge="#CBA763" />
        <Pyramid x={150} y={780} s={56} fill="#EFD49A" edge="#CBA763" />
        <Mesa x={290} y={900} w={120} h={70} fill="#E4BE80" edge="#C49A58" />

        {/* ── Oasis pools (center-back, behind path) ── */}
        {[540, 980, 1380, 1780, 2160, 2470].map((y, i) =>
        <g key={i}>
            <ellipse cx="180" cy={y} rx="220" ry="58" fill="url(#w4s-oasis)" opacity="0.5" />
            <ellipse cx="180" cy={y} rx="170" ry="40" fill="url(#w4s-shimmer)" />
            {/* ripple lines */}
            <path d={`M ${100} ${y} q 40 -7 80 0 t 80 0`} fill="none" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.4" />
          </g>
        )}

        {/* dune ridge layers (lighter higher) */}
        {[
        [60, 520, '#F1D8A2'], [300, 540, '#EFD49A'],
        [50, 740, '#EFD49A'], [320, 762, '#ECCE90'],
        [60, 960, '#ECCE90'], [300, 982, '#E8C786'],
        [40, 1200, '#E8C786'], [320, 1222, '#E4C07C'],
        [60, 1440, '#E4C07C'], [300, 1462, '#E0B972'],
        [40, 1680, '#E0B972'], [320, 1702, '#DCB268'],
        [60, 1920, '#DCB268'], [300, 1942, '#D8AB5E'],
        [40, 2160, '#D8AB5E'], [320, 2182, '#D4A455'],
        [40, 2390, '#D4A455'], [320, 2412, '#CF9D4C']].
        map(([cx, cy, fill], i) =>
        <ellipse key={i} cx={cx} cy={cy} rx="160" ry="56" fill={fill} />
        )}
        <rect x="0" y={H - 28} width={W} height="28" fill="#CF9D4C" />

        {/* ── DENSE EDGE CLIFFS: vách hẻm sa thạch 2 bên (mép TRÁI x≤72 /
            PHẢI x≥288). KHÔNG cây leo — thay bằng cỏ khô + xương rồng nhỏ
            rủ trên gờ. Hành lang giữa TRỐNG cho đường. ── */}
        {(() => {
          const els = [];
          els.push(<CliffWall key="wl" side="l" />);
          els.push(<CliffWall key="wr" side="r" />);
          // đá tảng + bụi cỏ khô ở chân vách (vùng còn vách, y > 560)
          for (let row = 0, y = 380; y <= 2540; y += 220, row++) {
            if (y > 560) els.push(<Rock key={`bl-${row}`} x={row % 2 ? 82 : 76} y={y} r={12 + row % 3 * 3} c="#D9C49A" edge="#BBA376" />);
            if (y + 110 > 560) els.push(<Rock key={`br-${row}`} x={row % 2 ? 278 : 284} y={y + 110} r={12 + row % 2 * 3} c="#D9C49A" edge="#BBA376" />);
          }
          for (let row = 0, y = 320; y <= 2540; y += 240, row++) {
            if (y > 560) els.push(<DryTuft key={`lr-${row}`} x={78} y={y} s={22} />);
            if (y + 120 > 560) els.push(<DryTuft key={`rr-${row}`} x={282} y={y + 120} s={22} />);
          }
          return els;
        })()}

        {/* ── Mid-ground cacti + rocks in open pockets (opposite the path) ── */}
        {[[286, 2360, 52], [290, 2120, 44], [284, 1740, 48], [288, 1360, 42], [282, 980, 48]].
        map(([x, y, h], i) => <Cactus key={`mc-${i}`} x={x} y={y} h={h} />)}
        {[[86, 2280, 48], [90, 1900, 44], [84, 1520, 48], [88, 1140, 42], [86, 740, 46]].
        map(([x, y, h], i) => <Cactus key={`mcl-${i}`} x={x} y={y} h={h} />)}
        {[[286, 2240, 18], [290, 1480, 20], [286, 700, 18]].
        map(([x, y, r], i) => <Rock key={`mr-${i}`} x={x} y={y} r={r} />)}

        {/* ── Heat-shimmer / dust bands ── */}
        {[300, 560, 900, 1300, 1700, 2100, 2400].map((y, i) =>
        <ellipse key={i} cx={i % 2 ? 260 : 110} cy={y} rx="120" ry="11" fill="#FFFFFF" opacity="0.22" />
        )}

        {/* ── Sand sparkles ── */}
        {[[110, 1100], [250, 1500], [90, 1900], [300, 1300], [150, 700], [230, 2000], [120, 2300]].map(([x, y], i) =>
        <g key={i}>
            <circle cx={x} cy={y} r="1.6" fill="#FFF7DC" opacity="0.85" />
          </g>
        )}

        {/* ── Drifting jelly characters ── */}
        <FloatJelly x={300} y={1170} size={20} color="yellow" delay="0s" />
        <FloatJelly x={56} y={2000} size={22} color="pink" delay="0.8s" />
        <FloatJelly x={300} y={2280} size={18} color="mint" delay="1.4s" />
      </svg>);

  }

  function BeachSun({ x, y, r = 26 }) {
    return (
      <g>
        {[...Array(8)].map((_, i) => {
          const a = i / 8 * Math.PI * 2;
          return <line key={i} x1={x + Math.cos(a) * (r + 4)} y1={y + Math.sin(a) * (r + 4)}
          x2={x + Math.cos(a) * (r + 12)} y2={y + Math.sin(a) * (r + 12)}
          stroke="#FFD86A" strokeWidth="3" strokeLinecap="round" opacity="0.8" />;
        })}
        <circle cx={x} cy={y} r={r} fill="#FFE9A6" stroke="#FFD16A" strokeWidth="2" />
        <circle cx={x - r * 0.28} cy={y - r * 0.28} r={r * 0.3} fill="#FFF4CE" opacity="0.8" />
      </g>);

  }
  function Palm({ x, y, h = 50 }) {
    const fronds = [-46, -16, 16, 46, -78, 78];
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.20))' }}>
        <path d={`M ${x} ${y} q ${-6} ${-h * 0.5} ${4} ${-h}`} fill="none" stroke="#B98A56" strokeWidth="6" strokeLinecap="round" />
        <g transform={`translate(${x + 4} ${y - h})`}>
          {fronds.map((deg, i) =>
          <path key={i} d="M0 0 Q 22 -6 40 4 Q 22 2 0 6 Z"
          fill={i % 2 ? '#57A86A' : '#67B87A'} stroke="#3F8A52" strokeWidth="1"
          transform={`rotate(${deg})`} />
          )}
          <circle cx="0" cy="0" r="3.5" fill="#C98A4E" />
          <circle cx="3" cy="5" r="2.5" fill="#B97A3E" />
        </g>
      </g>);

  }
  function Shell({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 1px 1px rgba(120,100,40,0.2))' }}>
        <path d={`M ${x} ${y} a 7 7 0 1 1 0.1 0 Z`} fill="#FBD8E2" stroke="#E89BB4" strokeWidth="1.2" />
        {[-3, 0, 3].map((o, i) =>
        <line key={i} x1={x} y1={y} x2={x + o} y2={y - 7} stroke="#E89BB4" strokeWidth="1" />
        )}
      </g>);

  }
  function Pyramid({ x, y, s = 80, fill = '#E9C98C', edge = '#CBA763' }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 4px rgba(150,110,40,0.22))' }}>
        <path d={`M ${x} ${y - s} L ${x + s * 0.78} ${y} L ${x - s * 0.78} ${y} Z`} fill={fill} stroke={edge} strokeWidth="2" strokeLinejoin="round" />
        <path d={`M ${x} ${y - s} L ${x + s * 0.78} ${y} L ${x} ${y} Z`} fill="rgba(120,90,30,0.14)" />
        <path d={`M ${x} ${y - s} L ${x} ${y}`} stroke="#FFF1C6" strokeWidth="1.5" opacity="0.5" />
      </g>);

  }
  function Mesa({ x, y, w = 110, h = 64, fill = '#E4BE80', edge = '#C49A58' }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 4px rgba(150,110,40,0.20))' }}>
        <path d={`M ${x - w / 2} ${y} L ${x - w / 2 + 8} ${y - h} L ${x + w / 2 - 8} ${y - h} L ${x + w / 2} ${y} Z`}
        fill={fill} stroke={edge} strokeWidth="2" strokeLinejoin="round" />
        <rect x={x - w / 2 + 8} y={y - h} width={w - 16} height="5" rx="2" fill="#F2D8A4" opacity="0.8" />
        {[-w * 0.2, w * 0.05, w * 0.28].map((o, i) =>
        <line key={i} x1={x + o} y1={y - h + 6} x2={x + o} y2={y} stroke={edge} strokeWidth="1.2" opacity="0.5" />
        )}
      </g>);

  }
  function Cactus({ x, y, h = 44 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.20))' }}>
        <rect x={x - 5} y={y - h} width="10" height={h} rx="5" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.5" />
        <rect x={x - 16} y={y - h * 0.66} width="8" height={h * 0.4} rx="4" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.5" />
        <rect x={x - 16} y={y - h * 0.66} width="8" height="8" rx="4" fill="#7FA86A" />
        <rect x={x + 8} y={y - h * 0.78} width="8" height={h * 0.5} rx="4" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.5" />
        {/* tiny flowers */}
        <circle cx={x} cy={y - h} r="3" fill="#F7A9C0" />
        <circle cx={x - 12} cy={y - h * 0.66} r="2.4" fill="#FFCA66" />
      </g>);

  }
  function CliffWall({ side }) {
    // VÁCH HẺM SA THẠCH một mép — KẾT THÚC DỨT KHOÁT ở rìa trên (yEnd), lộ
    // sa mạc phía trên. Màu sa thạch ấm, vân đá ngang, cỏ khô + xương rồng
    // nhỏ rủ trên gờ.
    const isL = side === 'l';
    const yEnd = 580;
    const insetAt = (i) => [74, 58, 66][i % 3];
    const pts = [];
    for (let y = yEnd, i = 0; y <= H + 40; y += 150, i++) {
      pts.push([isL ? insetAt(i) : W - insetAt(i), y, i]);
    }
    const outerX = isL ? -24 : W + 24;
    const innerTop = pts[0][0];
    let d = `M ${outerX} ${yEnd} `;
    d += `Q ${(outerX + innerTop) / 2} ${yEnd - 14} ${innerTop} ${yEnd} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],[x, y] = pts[i];
      const my = (py + y) / 2;
      d += `Q ${px} ${my} ${x} ${y} `;
    }
    d += `L ${outerX} ${H + 40} Z`;
    // vân sa thạch ngang
    const strata = [];
    for (let y = yEnd + 40; y < H; y += 70) {
      const inset = insetAt(Math.round((y - yEnd) / 150));
      strata.push(
        <line key={`st${y}`} x1={outerX} y1={y}
        x2={isL ? inset - 10 : W - inset + 10} y2={y + 4}
        stroke="#C49A58" strokeWidth="1.6" opacity="0.32" />
      );
    }
    // cỏ khô + xương rồng nhỏ rủ trên gờ trong
    const deco = [];
    pts.forEach(([x, y, i]) => {
      if (i % 2 === 0) {
        deco.push(<DryTuft key={`dt${i}`} x={isL ? x - 6 : x + 6} y={y} s={18} />);
      }
      if (i % 3 === 1) {
        deco.push(
          <g key={`sc${i}`}>
            <rect x={isL ? x - 4 : x + 1} y={y - 14} width="6" height="16" rx="3" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.2" />
            <circle cx={isL ? x - 1 : x + 4} cy={y - 14} r="2.4" fill="#FFCA66" />
          </g>
        );
      }
    });
    return (
      <g style={{ filter: 'drop-shadow(0 0 7px rgba(150,110,50,0.18))' }}>
        <path d={d} fill="#E0C089" stroke="#C49A58" strokeWidth="2.5" />
        {/* rìa đá trên — gờ sáng */}
        <path d={`M ${outerX} ${yEnd} Q ${(outerX + innerTop) / 2} ${yEnd - 14} ${innerTop} ${yEnd}`}
        fill="none" stroke="#F4E0AE" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        {/* dải bóng trong tạo khối */}
        <path d={d} fill="none" stroke="rgba(150,110,50,0.14)" strokeWidth="12" />
        {strata}
        {deco}
      </g>);

  }
  function DryTuft({ x, y, s = 22 }) {
    return (
      <g stroke="#C9A86A" strokeWidth="2.2" strokeLinecap="round" fill="none">
        {[-12, -4, 4, 12].map((a, i) =>
        <path key={i} d={`M ${x + a * 0.3} ${y} q ${a * 0.6} ${-s * 0.6} ${a * 0.5} ${-s}`} />
        )}
      </g>);

  }
  function Rock({ x, y, r = 16, c = '#DCC79E', edge = '#BBA376' }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(150,110,50,0.20))' }}>
        <path d={`M ${x - r} ${y + r * 0.5} Q ${x - r} ${y - r * 0.5} ${x - r * 0.3} ${y - r * 0.7}
                  Q ${x + r * 0.4} ${y - r * 0.9} ${x + r} ${y - r * 0.2}
                  Q ${x + r * 1.05} ${y + r * 0.5} ${x} ${y + r * 0.6} Z`}
        fill={c} stroke={edge} strokeWidth="1.5" />
        <path d={`M ${x - r * 0.5} ${y - r * 0.3} Q ${x} ${y - r * 0.6} ${x + r * 0.4} ${y - r * 0.3}`}
        fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
      </g>);

  }
  function FloatJelly({ x, y, size, color, delay }) {
    const p = {
      yellow: { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' },
      mint: { f: '#A3E5D9', e: '#5FC3B2', s: '#CBF2EB' },
      pink: { f: '#F7A9C0', e: '#E576A0', s: '#FBD0DF' }
    }[color] || { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' };
    return (
      <g style={{ animation: 'gj-w4s-float 3.6s ease-in-out infinite', animationDelay: delay,
        transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 4px 3px rgba(150,110,50,0.22))' }}>
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
        <path d={FULL_PATH} fill="none" stroke="rgba(120,90,40,0.22)"
        strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,4)" />
        <path d={FULL_PATH} fill="none" stroke="#E0C089"
        strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#FBEEC9"
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
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 5px 7px rgba(150,110,50,0.24))' }}>
        <JellyBlock color={color} size={size} showEyes={false} />
        <NumberBadge n={n} size={size} />
        <StarArc stars={stars} size={14} width={size + 14} />
      </div>);

  }
  function LockedRegularNode({ n, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 5px rgba(150,110,50,0.20))' }}>
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
          justifyContent: 'center', boxShadow: '0 2px 4px rgba(150,110,50,0.32)'
        }}>
          <LockGlyph size={13} />
        </div>
      </div>);

  }
  function CurrentNode({ n, size = 64 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: -16, top: -16, width: size + 32, height: size + 32, borderRadius: '50%', background: 'rgba(255,159,104,0.24)', animation: 'gj-w4s-pulse 1600ms ease-out infinite' }} />
        <div style={{ position: 'absolute', left: -5, top: -5, width: size + 10, height: size + 10, borderRadius: '50%', background: 'rgba(255,159,104,0.34)', animation: 'gj-w4s-pulse 1600ms ease-out infinite', animationDelay: '320ms' }} />
        <div style={{
          position: 'relative', width: size, height: size, borderRadius: '50%', background: '#FFFFFF', border: '3px solid #FF9F68',
          boxShadow: '0 6px 14px rgba(150,110,50,0.24), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width={size - 16} height={size - 16} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A" strokeWidth="2" strokeDasharray="3 4" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#E97E45' }}>{n}</div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)', animation: 'gj-w4s-hop 1400ms ease-in-out infinite', filter: 'drop-shadow(0 4px 4px rgba(150,110,50,0.30))' }}>
          <JellyBlock color="yellow" size={38} direction="down" expression="happy" />
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
        <div style={{ position: 'absolute', top: -10, left: size + 8, background: '#FFFFFF', color: '#8C7458', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.10em', padding: '4px 10px', borderRadius: 999, boxShadow: '0 3px 8px rgba(150,110,50,0.20)', whiteSpace: 'nowrap' }}>NGHỈ</div>
        <div style={{ position: 'absolute', top: -6, left: size + 4, width: 10, height: 10, borderRadius: '50%', background: '#FFD074', border: '1.5px solid #E0A21F' }} />
        <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 5px rgba(150,110,50,0.22))', opacity: 0.92 }}>
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
        <div style={{ position: 'absolute', left: -28, top: -28, right: -28, bottom: -28, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(169,156,246,0.55) 0%, rgba(126,108,240,0.30) 55%, rgba(126,108,240,0) 78%)', animation: 'gj-w4s-halo 2400ms ease-in-out infinite' }} />
        <svg width={size + 56} height={size + 56} viewBox="0 0 200 200" style={{ position: 'absolute', left: -28, top: -28, pointerEvents: 'none', animation: 'gj-w4s-spin 8s linear infinite', transformOrigin: '50% 50%' }}>
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
        <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #EFE0C9', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 999, boxShadow: '0 3px 6px rgba(150,110,50,0.20)' }}>màn {n}</div>
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

  // ─── gate to World 5 (Bãi biển) ───────────────────────────────────
  function GateBanner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 38, transform: 'translateX(-50%)', width: 312,
        background: '#FFFFFF', border: '1.5px solid #CFE6EC', borderRadius: 999, padding: '8px 14px 8px 8px',
        display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 28px rgba(60,130,150,0.30), 0 4px 8px rgba(120,92,52,0.14)', zIndex: 16
      }}>
        {/* World 5 beach badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #CFF0F6 0%, #6FC2D8 60%, #4296B0 100%)',
          border: '2.5px solid #4296B0', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.10), inset 0 3px 0 rgba(255,255,255,0.45), 0 2px 4px rgba(50,110,130,0.32)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 17c2-3 4-3 6 0s4 0 6-3 4-2 6 1" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="17" cy="7" r="3" fill="#FFE9A6" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
          <div style={{ position: 'absolute', top: -6, right: -4, background: '#8FC9E6', border: '1.5px solid #4296B0', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, padding: '2px 6px', borderRadius: 999, lineHeight: 1, boxShadow: '0 2px 3px rgba(50,110,130,0.20)' }}>W5</div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.05, gap: 2 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', color: '#9B886F', whiteSpace: 'nowrap' }}>CỔNG · THẾ GIỚI 5</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#2E84A6', whiteSpace: 'nowrap', lineHeight: 1.05 }}>Bãi biển</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)', border: '1.5px solid #E0A21F', padding: '6px 11px 7px 8px', borderRadius: 999, boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)', flexShrink: 0 }}>
          <Star filled size={14} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#6A4A2E', lineHeight: 1 }}>72</span>
        </div>
      </div>);

  }

  function StartSign() {
    return (
      <div style={{ position: 'absolute', left: '50%', top: H - 90, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(150,110,50,0.20)', textTransform: 'uppercase' }}>Sa mạc · tiếp tục</div>
      </div>);

  }

  function World4Strip() {
    return (
      <div style={{ position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden' }}>
        <style>{`
          @keyframes gj-w4s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w4s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w4s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w4s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w4s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>
        <Scene />
        <PathLayer />
        <GateBanner />
        {NODES.map((n) => <PlaceNode key={n.id} node={n} />)}
        <StartSign />
      </div>);

  }

  window.GJWorld4Strip = World4Strip;
})();