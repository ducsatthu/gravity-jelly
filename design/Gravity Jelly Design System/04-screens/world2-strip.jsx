/* world2-strip.jsx — Dải cuộn ĐẦY ĐỦ World 2 "Rừng rậm" (màn 11–20).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD (HUD là lớp dính riêng). Đọc từ
   DƯỚI lên TRÊN, một con đường mòn LIÊN TỤC uốn lượn, số node 11→20:
     • đáy: đường vào từ mép dưới
     • 11–15 : node thường (JellyBlock luân phiên 4 màu, có số, 3-sao arc;
               tô vài node đã hoàn thành, vài node khoá đá)
     • 16    : BREATHER (nhỏ, nhạt, tag "Nghỉ")
     • 17–19 : node thường (khoá)
     • 20    : BOSS (to 1.2×, hào quang gravity tím #7E6CF0, tag "BOSS")
     • trên 20: CỔNG sang World 3 "Sông & Thác" (banner pill + huy hiệu +
               tên + chip ★ 36); nền trên cổng blend sang palette World 3
               (#D6EEF1→#B4E0EA)
     • đỉnh  : đường tiếp tục ra mép trên (vào World 3)
   Biome World 2: trời #CFE6CE→#B2D3AC, rừng thông + cây tán tròn, thân
   #6D4C32, dương xỉ, gỗ mục accent #C9A06A, sương mờ.
   Exposes window.GJWorld2Strip.                                          */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  // node positions bottom→top (same pitch as World 1 strip)
  const NODES = [
    { id: 11, x: 130, y: 2440, kind: 'reg',      state: 'done',   stars: 3, color: 'yellow' },
    { id: 12, x: 240, y: 2250, kind: 'reg',      state: 'done',   stars: 3, color: 'mint'   },
    { id: 13, x: 110, y: 2060, kind: 'reg',      state: 'done',   stars: 2, color: 'pink'   },
    { id: 14, x: 240, y: 1870, kind: 'reg',      state: 'current'                            },
    { id: 15, x: 120, y: 1680, kind: 'reg',      state: 'locked'                            },
    { id: 16, x: 240, y: 1490, kind: 'breather', state: 'locked'                            },
    { id: 17, x: 110, y: 1290, kind: 'reg',      state: 'locked'                            },
    { id: 18, x: 240, y: 1090, kind: 'reg',      state: 'locked'                            },
    { id: 19, x: 150, y:  880, kind: 'reg',      state: 'locked'                            },
    { id: 20, x: 180, y:  620, kind: 'boss',     state: 'locked'                            },
  ];

  const ENTRY = { x: 180, y: 2620 };
  const GATE  = { x: 180, y: 360  };
  const EXIT  = { x: 180, y: -40  };

  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }
  const ALL_PTS   = [ENTRY, ...NODES.map(n => ({ x: n.x, y: n.y })), GATE, EXIT];
  const FULL_PATH = pathD(ALL_PTS);
  // walked: entry → 11 → 12 → 13 (13 last cleared; 14 is current)
  const WALKED    = pathD([ENTRY, NODES[0], NODES[1], NODES[2]]);

  // ─── background scene ─────────────────────────────────────────────
  function Scene() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="w2s-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"    stopColor="#B4E0EA" />{/* W3 Sông&Thác sâu  */}
            <stop offset="0.06" stopColor="#C2E5EC" />
            <stop offset="0.13" stopColor="#D6EEF1" />{/* W3 light          */}
            <stop offset="0.19" stopColor="#D2EBDA" />{/* blend             */}
            <stop offset="0.24" stopColor="#CFE6CE" />{/* W2 Rừng rậm top   */}
            <stop offset="0.60" stopColor="#C2DDBC" />
            <stop offset="1"    stopColor="#B2D3AC" />{/* W2 floor          */}
          </linearGradient>
          <radialGradient id="w2s-shaft" cx="0.74" cy="0.30" r="0.45">
            <stop offset="0" stopColor="#FBF3D2" stopOpacity="0.5" />
            <stop offset="1" stopColor="#FBF3D2" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="w2s-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#w2s-sky)" />
        <rect x="0" y="500" width={W} height="1300" fill="url(#w2s-shaft)" />

        {/* ── Top band: World 3 Sông & Thác (river / cobbles / reeds) ── */}
        <River y={-10} />
        <River y={120} />
        <Cobble x={60}  y={70}  r={14} />
        <Cobble x={300} y={84}  r={16} />
        <Cobble x={180} y={150} r={18} />
        <Reed x={36}  y={120} s={26} />
        <Reed x={326} y={108} s={24} />
        <Reed x={70}  y={170} s={22} />
        <Reed x={292} y={176} s={24} />
        {/* water sparkle drops */}
        {[[120,60],[250,40],[90,150],[300,140],[180,90]].map(([x,y],i)=>(
          <g key={i}>
            <path d={`M ${x} ${y-5} L ${x+1.6} ${y} L ${x} ${y+5} L ${x-1.6} ${y} Z`} fill="#FFFFFF" opacity="0.9" />
          </g>
        ))}

        {/* ── Blend zone hills near the gate ── */}
        <ellipse cx="40"  cy="300" rx="130" ry="50" fill="#B6D9B0" />
        <ellipse cx="320" cy="312" rx="150" ry="56" fill="#ADD2A8" />
        <ellipse cx="180" cy="368" rx="220" ry="68" fill="#B2D3AC" />

        {/* ── Forest hills, far → near, top→bottom ── */}
        {[
          [60,500,'#A8CFA2'],[290,520,'#9CC79B'],[180,564,'#A2CB9E'],
          [50,720,'#9CC79B'],[320,742,'#92BD92'],[170,792,'#A2CB9E'],
          [60,940,'#94C094'],[300,962,'#8BBA8B'],[190,1020,'#94C094'],
          [40,1180,'#8FBE8C'],[320,1202,'#86B586'],[180,1260,'#8FBE8C'],
          [60,1420,'#86B586'],[300,1442,'#7CAE7E'],[170,1500,'#86B586'],
          [40,1660,'#7CAE7E'],[320,1682,'#74A776'],[190,1740,'#7CAE7E'],
          [60,1900,'#74A776'],[300,1922,'#6CA06F'],[180,1980,'#74A776'],
          [40,2150,'#6CA06F'],[320,2172,'#669A6A'],[180,2232,'#6CA06F'],
          [40,2380,'#669A6A'],[320,2402,'#5E9263'],[180,2470,'#669A6A'],
        ].map(([cx,cy,fill],i)=>(
          <ellipse key={i} cx={cx} cy={cy} rx={i%3===2?240:160} ry={i%3===2?80:60} fill={fill} />
        ))}
        <rect x="0" y={H - 28} width={W} height="28" fill="#5E9263" />

        {/* ── DENSE EDGE FOREST: hai dải rừng dày ở mép TRÁI (x≤70) và PHẢI
           (x≥292), trải dài TỪ ĐẦU TỚI CUỐI. Hành lang giữa (x 72–290) để
           TRỐNG cho đường đi + node — không cây nào nằm trên đường. ── */}
        {(() => {
          const els = [];
          const shades = ['#264F2E', '#2A5C34', '#2E6238', '#356E40', '#3F7D49'];
          // rows every ~95px → đủ dày suốt 2600
          for (let row = 0, y = 280; y <= 2560; y += 95, row++) {
            // LEFT band — 3 overlapping pine columns (đẩy ra xa đường)
            const lx = [2, 22, 42];
            lx.forEach((x, c) => {
              const h = 48 + ((row * 7 + c * 11) % 30);
              els.push(<Pine key={`lp-${row}-${c}`} x={x + (row % 2 ? 6 : 0)} y={y}
                             h={h} canopy={shades[(row + c) % shades.length]} />);
            });
            // RIGHT band — 3 overlapping pine columns (đẩy ra xa đường)
            const rx = [318, 338, 358];
            rx.forEach((x, c) => {
              const h = 48 + ((row * 5 + c * 9) % 30);
              els.push(<Pine key={`rp-${row}-${c}`} x={x - (row % 2 ? 6 : 0)} y={y}
                             h={h} canopy={shades[(row + c + 2) % shades.length]} />);
            });
          }
          // round-canopy trees nestled into the bands (alternate sides)
          for (let row = 0, y = 360; y <= 2520; y += 150, row++) {
            const x = row % 2 ? 38 : 322;
            els.push(<RoundTree key={`rt-${row}`} x={x} y={y} h={40 + (row % 3) * 4}
                                canopy={row % 2 ? '#6FA86F' : '#5F9C66'} />);
            const x2 = row % 2 ? 320 : 40;
            els.push(<RoundTree key={`rt2-${row}`} x={x2} y={y + 70} h={36 + (row % 2) * 6}
                                canopy={row % 2 ? '#5F9C66' : '#6FA86F'} />);
          }
          // underbrush bushes hugging both edges
          for (let row = 0, y = 420; y <= 2540; y += 130, row++) {
            els.push(<Bush key={`bl-${row}`} x={row % 2 ? 48 : 30} y={y} r={14 + (row % 3) * 3} c={row % 2 ? '#5F9C66' : '#6FA86F'} />);
            els.push(<Bush key={`br-${row}`} x={row % 2 ? 316 : 332} y={y + 60} r={14 + (row % 2) * 4} c={row % 2 ? '#6FA86F' : '#5F9C66'} />);
          }
          // MID-GROUND trees filling the open hill pockets on the INNER side
          // of each curve (opposite the path) so empty green areas read as
          // forest too. Path stays clear — these only sit where the road is
          // on the far side at that height.
          // right-inner pockets (path is LEFT at these y):
          [[286,2380,38],[290,2150,40],[284,1760,38],[288,1380,40],[282,1000,38],[286,660,40]]
            .forEach(([x,y,h],i)=> els.push(<RoundTree key={`mr-${i}`} x={x} y={y} h={h} canopy={i%2?'#5F9C66':'#6FA86F'} />));
          [[300,2300,46],[304,1660,48],[300,1200,46],[302,800,48]]
            .forEach(([x,y,h],i)=> els.push(<Pine key={`mrp-${i}`} x={x} y={y} h={h} canopy={i%2?'#356E40':'#3F7D49'} />));
          // left-inner pockets (path is RIGHT at these y):
          [[86,2300,40],[90,1920,38],[84,1540,40],[88,1160,38],[86,760,40]]
            .forEach(([x,y,h],i)=> els.push(<RoundTree key={`ml-${i}`} x={x} y={y} h={h} canopy={i%2?'#6FA86F':'#5F9C66'} />));
          [[72,2080,46],[76,1740,48],[72,1340,46],[74,940,48]]
            .forEach(([x,y,h],i)=> els.push(<Pine key={`mlp-${i}`} x={x} y={y} h={h} canopy={i%2?'#3F7D49':'#356E40'} />));
          return els;
        })()}

        {/* ── Logs / stumps (accent #C9A06A) ── */}
        {[[300,520],[60,760],[306,1180],[58,1560],[300,1980],[60,2360]].map(([x,y],i)=>(
          <Log key={i} x={x} y={y} w={32} />
        ))}

        {/* ── Ferns at edges ── */}
        {[
          [44,300],[320,282],[40,500],[324,520],[48,720],[316,742],
          [44,960],[320,982],[40,1240],[324,1262],[48,1520],[316,1542],
          [44,1800],[320,1822],[40,2100],[324,2122],[48,2400],[316,2422],
        ].map(([x,y],i)=> <Fern key={i} x={x} y={y} s={22} />)}

        {/* ── Mushrooms (jelly caps) ── */}
        <Mushroom x={70}  y={1100} w={22} color="pink" />
        <Mushroom x={300} y={1640} w={20} color="yellow" />
        <Mushroom x={66}  y={2120} w={24} color="mint" />

        {/* ── Drifting mist bands ── */}
        {[300,560,900,1300,1700,2100,2400].map((y,i)=>(
          <ellipse key={i} cx={i%2?260:110} cy={y} rx="120" ry="14" fill="#FFFFFF" opacity="0.34" />
        ))}

        {/* ── Distant jelly characters drifting ── */}
        <FloatJelly x={300} y={1170} size={20} color="mint"   delay="0s"   />
        <FloatJelly x={56}  y={2000} size={22} color="yellow" delay="0.8s" />
        <FloatJelly x={300} y={2280} size={18} color="pink"   delay="1.4s" />
      </svg>
    );
  }

  function River({ y }) {
    return (
      <g>
        <ellipse cx="60"  cy={y} rx="130" ry="42" fill="#8FD0DB" opacity="0.85" />
        <ellipse cx="280" cy={y - 6} rx="150" ry="44" fill="#7FC6D3" opacity="0.85" />
        <ellipse cx="180" cy={y + 30} rx="220" ry="52" fill="#A6DCE5" opacity="0.8" />
        <path d={`M 20 ${y+20} q 80 -14 160 0 t 160 0`} fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.5" />
      </g>
    );
  }
  function Cobble({ x, y, r = 14 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 1.5px rgba(60,80,90,0.25))' }}>
        <ellipse cx={x} cy={y} rx={r} ry={r * 0.72} fill="#B9B2A6" stroke="#9A9184" strokeWidth="1.4" />
        <ellipse cx={x - r * 0.28} cy={y - r * 0.26} rx={r * 0.32} ry={r * 0.2} fill="#D6D0C5" opacity="0.8" />
      </g>
    );
  }
  function Reed({ x, y, s = 24 }) {
    return (
      <g stroke="#5FA06A" strokeWidth="2.4" strokeLinecap="round" fill="none">
        {[-10, 0, 10].map((a, i) => (
          <path key={i} d={`M ${x + a*0.4} ${y} q ${a*0.5} ${-s*0.6} ${a*0.3} ${-s}`} />
        ))}
        {[-10, 0, 10].map((a, i) => (
          <ellipse key={`t-${i}`} cx={x + a*0.3} cy={y - s} rx="2.4" ry="5" fill="#C9A06A" stroke="none" />
        ))}
      </g>
    );
  }
  function Pine({ x, y, h = 56, canopy = '#3F7D49', trunk = '#6D4C32' }) {
    const w = h * 0.66;
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(50,60,40,0.28))' }}>
        <rect x={x - 2.5} y={y} width="5" height={h * 0.32} rx="1.5" fill={trunk} />
        <path d={`M ${x - w} ${y} L ${x + w} ${y} L ${x} ${y - h * 0.55} Z`} fill={canopy} />
        <path d={`M ${x - w * 0.82} ${y - h * 0.32} L ${x + w * 0.82} ${y - h * 0.32} L ${x} ${y - h * 0.78} Z`} fill={canopy} />
        <path d={`M ${x - w * 0.62} ${y - h * 0.6} L ${x + w * 0.62} ${y - h * 0.6} L ${x} ${y - h * 1.02} Z`} fill={canopy} />
        <path d={`M ${x - w * 0.4} ${y - h * 0.5} L ${x - w * 0.12} ${y - h * 0.95} L ${x - w * 0.02} ${y - h * 0.92} L ${x - w * 0.28} ${y - h * 0.48} Z`}
              fill="#FFFFFF" opacity="0.16" />
      </g>
    );
  }
  function RoundTree({ x, y, h = 40, canopy = '#5F9C66', trunk = '#6D4C32' }) {
    const r = h * 0.6;
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(50,60,40,0.22))' }}>
        <rect x={x - 3} y={y} width="6" height={h * 0.5} rx="3" fill={trunk} />
        <ellipse cx={x - r * 0.5} cy={y - r * 0.2} rx={r * 0.72} ry={r * 0.66} fill={canopy} opacity="0.95" />
        <ellipse cx={x + r * 0.5} cy={y - r * 0.3} rx={r * 0.72} ry={r * 0.66} fill={canopy} opacity="0.95" />
        <ellipse cx={x} cy={y - r * 0.74} rx={r} ry={r * 0.82} fill={canopy} />
        <ellipse cx={x - r * 0.34} cy={y - r * 0.94} rx={r * 0.26} ry={r * 0.16} fill="#FFFFFF" opacity="0.24" />
      </g>
    );
  }
  function Log({ x, y, w = 32 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(60,44,24,0.22))' }}>
        <rect x={x - w / 2} y={y} width={w} height={w * 0.42} rx={w * 0.21} fill="#C9A06A" stroke="#A07A48" strokeWidth="1.5" />
        <ellipse cx={x - w / 2 + 2} cy={y + w * 0.21} rx={w * 0.12} ry={w * 0.18} fill="#E0C29A" stroke="#A07A48" strokeWidth="1.2" />
        <circle cx={x - w / 2 + 2} cy={y + w * 0.21} r={w * 0.05} fill="#A07A48" />
      </g>
    );
  }
  function Bush({ x, y, r = 16, c = '#5F9C66' }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(50,60,40,0.20))' }}>
        <ellipse cx={x - r * 0.55} cy={y} rx={r * 0.72} ry={r * 0.56} fill={c} />
        <ellipse cx={x + r * 0.55} cy={y} rx={r * 0.72} ry={r * 0.56} fill={c} />
        <ellipse cx={x} cy={y - r * 0.24} rx={r * 0.84} ry={r * 0.62} fill={c} />
        <ellipse cx={x - r * 0.22} cy={y - r * 0.4} rx={r * 0.2} ry={r * 0.11} fill="#FFFFFF" opacity="0.22" />
      </g>
    );
  }
  function Fern({ x, y, s = 22 }) {
    return (
      <g stroke="#5F9C66" strokeWidth="2" strokeLinecap="round" fill="none"
         style={{ filter: 'drop-shadow(0 1px 1px rgba(50,60,40,0.20))' }}>
        {[-32, -16, 0, 16, 32].map((a, i) => (
          <path key={i}
            d={`M ${x} ${y} q ${Math.sin(a*Math.PI/180)*s*0.7} ${-s*0.5} ${Math.sin(a*Math.PI/180)*s} ${-s}`} />
        ))}
      </g>
    );
  }
  function Mushroom({ x, y, w = 22, color = 'pink' }) {
    const p = {
      pink:   { fill: '#F7A9C0', shine: '#FBD0DF', edge: '#E576A0' },
      yellow: { fill: '#FFE3A3', shine: '#FFF1CE', edge: '#E8B85C' },
      mint:   { fill: '#A3E5D9', shine: '#CBF2EB', edge: '#5FC3B2' },
    }[color] || { fill: '#F7A9C0', shine: '#FBD0DF', edge: '#E576A0' };
    return (
      <g style={{ filter: 'drop-shadow(0 3px 2px rgba(60,44,24,0.20))' }}>
        <rect x={x - w * 0.18} y={y - w * 0.10} width={w * 0.36} height={w * 0.55} rx={w * 0.16}
              fill="#FCF1DC" stroke="#E2C896" strokeWidth="1.2" />
        <ellipse cx={x} cy={y - w * 0.12} rx={w * 0.55} ry={w * 0.4} fill={p.fill} stroke={p.edge} strokeWidth="1.6" />
        <ellipse cx={x - w * 0.16} cy={y - w * 0.26} rx={w * 0.22} ry={w * 0.12} fill={p.shine} opacity="0.92" />
        <circle cx={x - w * 0.2} cy={y - w * 0.1} r={w * 0.07} fill="#FFFFFF" opacity="0.85" />
      </g>
    );
  }
  function FloatJelly({ x, y, size, color, delay }) {
    const p = {
      yellow: { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' },
      mint:   { f: '#A3E5D9', e: '#5FC3B2', s: '#CBF2EB' },
      pink:   { f: '#F7A9C0', e: '#E576A0', s: '#FBD0DF' },
    }[color] || { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' };
    return (
      <g style={{ animation: 'gj-w2s-float 3.6s ease-in-out infinite', animationDelay: delay,
                  transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 4px 3px rgba(60,44,24,0.22))' }}>
        <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={Math.round(size*0.28)}
              fill={p.f} stroke={p.e} strokeWidth="2" />
        <ellipse cx={x} cy={y - size * 0.18} rx={size * 0.34} ry={size * 0.12} fill={p.s} opacity="0.95" />
        <circle cx={x - size * 0.18} cy={y - size * 0.04} r={size * 0.07} fill="#3B2A18" />
        <circle cx={x + size * 0.18} cy={y - size * 0.04} r={size * 0.07} fill="#3B2A18" />
      </g>
    );
  }

  // ─── path layer ───────────────────────────────────────────────────
  function PathLayer() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block', pointerEvents: 'none' }}>
        <path d={FULL_PATH} fill="none" stroke="rgba(120,92,52,0.22)"
              strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,4)" />
        <path d={FULL_PATH} fill="none" stroke="#EAD8B7"
              strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#FFFFFF"
              strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#EFE0C9"
              strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 11" />
        <path d={WALKED} fill="none" stroke="#FF9F68"
              strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
        <path d={WALKED} fill="none" stroke="#FFC59A"
              strokeWidth="6" strokeLinecap="round" strokeDasharray="4 9" opacity="0.9" />
      </svg>
    );
  }

  // ─── stars ────────────────────────────────────────────────────────
  function Star({ filled = false, size = 14 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
              fill={filled ? '#FFC23D' : '#D9CDB5'} stroke={filled ? '#E0A21F' : '#B6A892'}
              strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  function StarArc({ stars = 3, size = 14, width = 64 }) {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: -size - 6, transform: 'translateX(-50%)',
        width, height: size + 8, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', pointerEvents: 'none',
      }}>
        <div style={{ transform: 'translateY(5px) rotate(-22deg)' }}><Star filled={stars >= 1} size={size} /></div>
        <div style={{ transform: 'translateY(-2px)' }}><Star filled={stars >= 2} size={size + 2} /></div>
        <div style={{ transform: 'translateY(5px) rotate(22deg)' }}><Star filled={stars >= 3} size={size} /></div>
      </div>
    );
  }

  function NumberBadge({ n, size, color = '#6A4A2E' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.38), lineHeight: 1,
        color, textShadow: '0 1px 0 rgba(255,255,255,0.55)', pointerEvents: 'none',
      }}>{n}</div>
    );
  }
  function LockGlyph({ size = 18 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
        <path d="M8 11V8.5a4 4 0 1 1 8 0V11" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
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
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.38), lineHeight: 1,
          color: '#7A6A50', textShadow: '0 1px 0 rgba(255,255,255,0.40)', pointerEvents: 'none',
        }}>{n}</div>
        <StarArc stars={0} size={12} width={size + 8} />
        <div style={{
          position: 'absolute', right: -4, bottom: -4, width: 24, height: 24, borderRadius: '50%',
          background: '#8A7B62', border: '2px solid #FFFFFF', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 2px 4px rgba(120,92,52,0.32)',
        }}>
          <LockGlyph size={13} />
        </div>
      </div>
    );
  }
  function CurrentNode({ n, size = 64 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: -16, top: -16, width: size + 32, height: size + 32,
          borderRadius: '50%', background: 'rgba(255,159,104,0.24)',
          animation: 'gj-w2s-pulse 1600ms ease-out infinite',
        }} />
        <div style={{
          position: 'absolute', left: -5, top: -5, width: size + 10, height: size + 10,
          borderRadius: '50%', background: 'rgba(255,159,104,0.34)',
          animation: 'gj-w2s-pulse 1600ms ease-out infinite', animationDelay: '320ms',
        }} />
        <div style={{
          position: 'relative', width: size, height: size, borderRadius: '50%',
          background: '#FFFFFF', border: '3px solid #FF9F68',
          boxShadow: '0 6px 14px rgba(120,92,52,0.24), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width={size - 16} height={size - 16} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A" strokeWidth="2" strokeDasharray="3 4" />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: '#E97E45',
          }}>{n}</div>
        </div>
        <div style={{
          position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)',
          animation: 'gj-w2s-hop 1400ms ease-in-out infinite',
          filter: 'drop-shadow(0 4px 4px rgba(120,92,52,0.30))',
        }}>
          <JellyBlock color="pink" size={38} direction="down" expression="happy" />
        </div>
        <div style={{
          position: 'absolute', left: '50%', top: size + 10, transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)', color: '#FFFFFF',
          border: '2px solid #E97E45', borderBottom: '3px solid #C8662F',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, padding: '5px 14px 6px',
          borderRadius: 999, boxShadow: '0 6px 12px rgba(201,102,47,0.35), inset 0 2px 0 rgba(255,197,154,0.6)',
          whiteSpace: 'nowrap',
        }}>Chơi ngay</div>
      </div>
    );
  }
  function BreatherNode({ n, size = 48 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', top: -10, left: size + 8, background: '#FFFFFF', color: '#8C7458',
          border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
          letterSpacing: '0.10em', padding: '4px 10px', borderRadius: 999,
          boxShadow: '0 3px 8px rgba(120,92,52,0.20)', whiteSpace: 'nowrap',
        }}>NGHỈ</div>
        <div style={{
          position: 'absolute', top: -6, left: size + 4, width: 10, height: 10, borderRadius: '50%',
          background: '#FFD074', border: '1.5px solid #E0A21F',
        }} />
        <div style={{ position: 'relative', width: size, height: size,
                      filter: 'drop-shadow(0 4px 5px rgba(120,92,52,0.22))', opacity: 0.92 }}>
          <JellyBlock color="stone" size={size} showEyes={false} />
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
               style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={`M ${size*0.30} ${size*0.45} q 4 4 8 0`} fill="none" stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${size*0.55} ${size*0.45} q 4 4 8 0`} fill="none" stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: size * 0.15, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: Math.round(size * 0.28), lineHeight: 1, color: '#7A6A50',
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
        <div style={{
          position: 'absolute', left: -28, top: -28, right: -28, bottom: -28, borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(169,156,246,0.55) 0%, rgba(126,108,240,0.30) 55%, rgba(126,108,240,0) 78%)',
          animation: 'gj-w2s-halo 2400ms ease-in-out infinite',
        }} />
        <svg width={size + 56} height={size + 56} viewBox="0 0 200 200"
             style={{ position: 'absolute', left: -28, top: -28, pointerEvents: 'none',
                      animation: 'gj-w2s-spin 8s linear infinite', transformOrigin: '50% 50%' }}>
          {[0, 60, 120, 180, 240, 300].map(a => {
            const rad = (a * Math.PI) / 180;
            const cx = 100 + Math.cos(rad) * 84;
            const cy = 100 + Math.sin(rad) * 84;
            return (<g key={a}><circle cx={cx} cy={cy} r="4.5" fill="#FFFFFF" opacity="0.95" /><circle cx={cx} cy={cy} r="2.5" fill="#A99CF6" /></g>);
          })}
        </svg>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: size * 0.5, height: size * 0.5, borderRadius: '50%',
            background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)', border: '3px solid #FFFFFF',
            boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LockGlyph size={Math.round(size * 0.28)} />
          </div>
        </div>
        <div style={{
          position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)', color: '#FFFFFF',
          border: '2px solid #6353D6', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          letterSpacing: '0.16em', padding: '4px 14px', borderRadius: 999,
          boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)', whiteSpace: 'nowrap',
        }}>BOSS</div>
        <div style={{
          position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)',
          background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #EFE0C9',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, padding: '2px 10px',
          borderRadius: 999, boxShadow: '0 3px 6px rgba(120,92,52,0.20)',
        }}>màn {n}</div>
      </div>
    );
  }

  function PlaceNode({ node }) {
    let inner = null, half = 32;
    if (node.kind === 'boss')          { inner = <BossNode n={node.id} size={80} />;        half = 40; }
    else if (node.kind === 'breather') { inner = <BreatherNode n={node.id} size={48} />;    half = 24; }
    else if (node.state === 'current') { inner = <CurrentNode n={node.id} size={64} />;     half = 32; }
    else if (node.state === 'done')    { inner = <DoneNode n={node.id} color={node.color} stars={node.stars} size={64} />; half = 32; }
    else                               { inner = <LockedRegularNode n={node.id} size={60} />; half = 30; }
    return (
      <div style={{ position: 'absolute', left: node.x - half, top: node.y - half,
                    zIndex: node.kind === 'boss' ? 14 : (node.state === 'current' ? 12 : 5) }}>
        {inner}
      </div>
    );
  }

  // ─── world gate (to World 3) ──────────────────────────────────────
  function GateBanner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 38, transform: 'translateX(-50%)',
        width: 312, background: '#FFFFFF', border: '1.5px solid #E6D8BD', borderRadius: 999,
        padding: '8px 14px 8px 8px', display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 12px 28px rgba(60,90,95,0.30), 0 4px 8px rgba(120,92,52,0.14)', zIndex: 16,
      }}>
        {/* World 3 river badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #C8ECF2 0%, #5FB7C9 60%, #3E94A8 100%)',
          border: '2.5px solid #3E94A8',
          boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.10), inset 0 3px 0 rgba(255,255,255,0.45), 0 2px 4px rgba(50,120,140,0.32)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 13c2.5-2 4.5-2 7 0s4.5 2 7 0" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M4 17c2.5-2 4.5-2 7 0s4.5 2 7 0" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
            <circle cx="15" cy="7.5" r="2.2" fill="#FFFFFF" />
          </svg>
          <div style={{
            position: 'absolute', top: -6, right: -4, background: '#FFCA66', border: '1.5px solid #E0A21F',
            color: '#6A4A2E', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
            padding: '2px 6px', borderRadius: 999, lineHeight: 1, boxShadow: '0 2px 3px rgba(120,92,52,0.20)',
          }}>W3</div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.05, gap: 2 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em',
            color: '#9B886F', whiteSpace: 'nowrap',
          }}>CỔNG · THẾ GIỚI 3</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#2C7C8E',
            whiteSpace: 'nowrap', lineHeight: 1.05,
          }}>Sông &amp; Thác</div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)', border: '1.5px solid #E0A21F',
          padding: '6px 11px 7px 8px', borderRadius: 999,
          boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)', flexShrink: 0,
        }}>
          <Star filled size={14} />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#6A4A2E', lineHeight: 1,
          }}>36</span>
        </div>
      </div>
    );
  }

  function StartSign() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: H - 90, transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        <div style={{
          background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #E6D8BD',
          fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em',
          padding: '6px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(120,92,52,0.20)',
          textTransform: 'uppercase',
        }}>Rừng rậm · tiếp tục</div>
      </div>
    );
  }

  function World2Strip() {
    return (
      <div style={{
        position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-w2s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w2s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w2s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w2s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w2s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <Scene />
        <PathLayer />
        <GateBanner />
        {NODES.map(n => <PlaceNode key={n.id} node={n} />)}
        <StartSign />
      </div>
    );
  }

  window.GJWorld2Strip = World2Strip;
})();
