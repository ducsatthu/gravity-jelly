/* world6-transition.jsx — Khung chuyển cảnh World 6 → World 7.
   ---------------------------------------------------------------------
   Cycle 3.0s. Cùng choreography đã duyệt (W1→W2 … W5→W6):
     0–18 %  Hang băng TRỖI LÊN nửa trên (translateY +60→0, blur fade)
             + Núi tuyết LƯỚT XUỐNG nửa dưới (translateY 0→+8)
     18–32 % Banner POP IN giữa (scale spring)
     22 %+   Confetti RƠI (lệch pha) + 2 Mascot vẫy + hop
     30 %+   Motion-blur streaks dọc · tinh thể băng lấp lánh
     95–100% Reset

   Nửa trên World 7 Hang băng (aerial top-down): hang động băng tối
   #22405A→#1E3A52→#2C5570, hồ băng phát sáng #2E6E86/#5FC9DE, đá hang
   #2A4A63/#16344B, tinh thể băng #7FE0F2/#CFF6FF nhô lên, hơi lạnh lấp
   lánh #CFF6FF.
   Nửa dưới World 6 Núi tuyết: lối mòn tuyết giữa + rừng thông 2 mép
   (đồng bộ strip) đang trôi đi + motion blur tuyết/băng + bụi tuyết.
   Banner "THẾ GIỚI 7 — Hang băng" (Fredoka 22 #2F6B83).
   Exposes window.GJWorld6Transition + window.GJWorld6TransitionCard.     */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const W = 360;
  const H = 800;
  const BANNER_Y = 400;
  const CYCLE = '3000ms';

  // ─── new world rising (top) — Hang băng (aerial ice cave) ──────────
  function CaveRising() {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w6t-in ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="w6t-cave" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#1B344A" />
              <stop offset="0.5"  stopColor="#22405A" />
              <stop offset="1"    stopColor="#2C5570" />
            </linearGradient>
            <radialGradient id="w6t-cglow" cx="0.5" cy="0.42" r="0.62">
              <stop offset="0"   stopColor="#5FC9DE" stopOpacity="0.30" />
              <stop offset="0.6" stopColor="#2E6E86" stopOpacity="0.10" />
              <stop offset="1"   stopColor="#2E6E86" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="w6t-crystal" cx="0.5" cy="0.4" r="0.6">
              <stop offset="0" stopColor="#BFF4FF" stopOpacity="0.9" />
              <stop offset="1" stopColor="#7FE0F2" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="w6t-pool" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#CFF6FF" stopOpacity="0.85" />
              <stop offset="1" stopColor="#2E6E86" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#w6t-cave)" />
          <rect x="0" y="0" width={W} height="420" fill="url(#w6t-cglow)" />

          {/* glowing ice pools (aerial) */}
          <CavePool cx={92}  cy={104} rx={64} ry={28} />
          <CavePool cx={284} cy={188} rx={72} ry={30} />
          <CavePool cx={196} cy={300} rx={86} ry={32} />

          {/* dark cave rocks */}
          <CaveRock cx={306} cy={70}  r={42} />
          <CaveRock cx={48}  cy={200} r={46} />
          <CaveRock cx={168} cy={48}  r={34} />
          <CaveRock cx={312} cy={330} r={40} />
          <CaveRock cx={56}  cy={350} r={38} />

          {/* ice crystals / stalagmites rising (top-down) */}
          {[[150,150,17],[326,236,14],[40,128,13],[236,96,15],[110,238,12],
            [280,300,14],[196,372,16],[78,300,11],[330,150,12]].map(([x,y,r],i)=>(
            <CaveCrystal key={`cc${i}`} x={x} y={y} r={r} />
          ))}

          {/* cold mist sparkles */}
          {[[64,120],[210,160],[272,80],[126,52],[332,110],[154,76],[300,260],[90,360],[210,392]].map(([x,y],i)=>(
            <g key={`gl${i}`}>
              <circle cx={x} cy={y} r="2" fill="#CFF6FF" opacity="0.9" />
              <circle cx={x+12} cy={y+15} r="1.2" fill="#9FE9F7" opacity="0.75" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  function CavePool({ cx, cy, rx, ry }) {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#2E6E86" stroke="#5FC9DE" strokeWidth="2.5" opacity="0.95" />
        <ellipse cx={cx} cy={cy} rx={rx * 0.7} ry={ry * 0.66} fill="url(#w6t-pool)" />
        <ellipse cx={cx - rx * 0.26} cy={cy - ry * 0.3} rx={rx * 0.34} ry={ry * 0.26} fill="#CFF6FF" opacity="0.45" />
      </g>
    );
  }
  function CaveRock({ cx, cy, r }) {
    const n = 7; const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.7 : r;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86]);
    }
    const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z';
    return (
      <g style={{ filter: 'drop-shadow(0 2px 3px rgba(8,24,40,0.45))' }}>
        <path d={d} fill="#2A4A63" stroke="#16344B" strokeWidth="1.5" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#16344B" strokeWidth="1" opacity="0.5" />
        ))}
        <ellipse cx={cx} cy={cy - r * 0.2} rx={r * 0.4} ry={r * 0.26} fill="#3D6480" opacity="0.7" />
      </g>
    );
  }
  function CaveCrystal({ x, y, r = 14 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 6px rgba(127,224,242,0.6))' }}>
        <path d={`M ${x} ${y - r} L ${x + r * 0.5} ${y - r * 0.1} L ${x + r * 0.32} ${y + r} L ${x - r * 0.32} ${y + r} L ${x - r * 0.5} ${y - r * 0.1} Z`}
              fill="#7FE0F2" stroke="#CFF6FF" strokeWidth="1.4" strokeLinejoin="round" opacity="0.95" />
        <path d={`M ${x} ${y - r} L ${x} ${y + r}`} stroke="#CFF6FF" strokeWidth="1" opacity="0.7" />
        <path d={`M ${x} ${y - r} L ${x - r * 0.5} ${y - r * 0.1} M ${x} ${y - r} L ${x + r * 0.5} ${y - r * 0.1}`} stroke="#FFFFFF" strokeWidth="0.9" opacity="0.6" />
      </g>
    );
  }

  // ─── old world leaving (bottom) — Núi tuyết ───────────────────────
  function SnowLeaving() {
    return (
      <div style={{
        position: 'absolute', top: 380, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w6t-out ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <defs>
            <linearGradient id="w6t-trail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"   stopColor="#FCFEFF" />
              <stop offset="0.5" stopColor="#EEF5FB" />
              <stop offset="1"   stopColor="#E4EEF6" />
            </linearGradient>
            <linearGradient id="w6t-forest-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#A6BFD2" />
              <stop offset="0.7" stopColor="#BBD0DE" />
              <stop offset="1" stopColor="#D4E2EC" />
            </linearGradient>
            <linearGradient id="w6t-forest-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#A6BFD2" />
              <stop offset="0.7" stopColor="#BBD0DE" />
              <stop offset="1" stopColor="#D4E2EC" />
            </linearGradient>
            <linearGradient id="w6t-veil" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0"    stopColor="#1E3A52" stopOpacity="0.20" />
              <stop offset="0.55" stopColor="#1E3A52" stopOpacity="0.05" />
              <stop offset="1"    stopColor="#1E3A52" stopOpacity="0"    />
            </linearGradient>
          </defs>

          {/* snow trail base */}
          <rect x="0" y="0" width={W} height="420" fill="url(#w6t-trail)" />

          {/* pine forest on both edges (matches strip) */}
          <ForestEdge side="l" />
          <ForestEdge side="r" />

          {/* compressed-snow walking corridor down the middle */}
          <path d="M150 0 L 210 0 L 214 420 L 146 420 Z" fill="#FFFFFF" opacity="0.55" />
          <line x1="180" y1="0" x2="180" y2="420" stroke="#BFD6E6" strokeWidth="3.5" strokeDasharray="7 11" />

          {/* a couple winter props on the trail */}
          <SnowPine x={120} y={150} h={58} />
          <Snowman x={244} y={300} />
          <SnowBoulder x={142} y={250} />
          <FrozenPond x={214} y={120} />

          <rect x="0" y="0" width={W} height="150" fill="url(#w6t-veil)" />
        </svg>

        {/* MOTION-BLUR streaks scrolling down */}
        <StreakLayer streaks={[[30,60],[330,60],[150,70],[212,60]]}
                     color="rgba(255,255,255,0.6)" speed="1100ms" />
        <StreakLayer streaks={[[48,80],[316,70],[120,50],[244,70]]}
                     color="rgba(199,220,236,0.6)" speed="1400ms" delay="200ms" />
        <StreakLayer streaks={[[60,70],[180,90],[290,60],[330,70]]}
                     color="rgba(170,210,234,0.5)" speed="900ms" delay="400ms" />
      </div>
    );
  }

  function ForestEdge({ side }) {
    const isL = side === 'l';
    const fill = isL ? 'url(#w6t-forest-l)' : 'url(#w6t-forest-r)';
    const X = (v) => (isL ? v : W - v);
    const outerX = isL ? -24 : W + 24;
    const inset = (i) => [70, 56, 64, 58][i % 4];
    const pts = [];
    for (let y = -20, i = 0; y <= 440; y += 150, i++) pts.push([X(inset(i)), y]);
    let d = `M ${outerX} -20 L ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1], [x, y] = pts[i];
      d += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    d += `L ${outerX} 440 Z`;
    let edge = `M ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1], [x, y] = pts[i];
      edge += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    const pines = [];
    for (let y = 20, i = 0; y < 420; y += 92, i++) {
      pines.push(<PineTop key={`p${i}`} x={X(34 - i % 3 * 8)} y={y} r={11 + i % 3 * 3} />);
      if (i % 2 === 0) pines.push(<PineTop key={`q${i}`} x={X(20)} y={y + 44} r={9} />);
    }
    return (
      <g>
        <path d={d} fill={fill} />
        {pines}
        <path d={edge} fill="none" stroke="#C7DCEC" strokeWidth="9" opacity="0.55" strokeLinecap="round" />
        <path d={edge} fill="none" stroke="#FFFFFF" strokeWidth="4" opacity="0.9" strokeLinecap="round" />
      </g>
    );
  }
  function PineTop({ x, y, r = 11 }) {
    const n = 8; const pts = [];
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
      </g>
    );
  }
  function SnowPine({ x, y, h = 58 }) {
    const w = h * 0.5;
    const tiers = [0.0, 0.32, 0.62];
    return (
      <g style={{ filter: 'drop-shadow(0 4px 4px rgba(90,120,150,0.24))' }}>
        <rect x={x - 3} y={y - 12} width="6" height="12" rx="2" fill="#9A6E44" stroke="#7E5630" strokeWidth="1" />
        {tiers.map((t, i) => {
          const ty = y - 12 - h * (1 - t);
          const tw = w * (1 - t * 0.5);
          return (
            <g key={i}>
              <path d={`M ${x} ${ty} L ${x + tw / 2} ${ty + h * 0.32} L ${x - tw / 2} ${ty + h * 0.32} Z`}
                    fill={i === 0 ? '#3F8A5E' : '#4E9A6C'} stroke="#357A50" strokeWidth="1.2" strokeLinejoin="round" />
              <path d={`M ${x} ${ty} q ${tw * 0.22} ${h * 0.1} ${tw * 0.34} ${h * 0.18} q ${-tw * 0.34} ${-h * 0.04} ${-tw * 0.68} 0 q ${tw * 0.12} ${-h * 0.08} ${tw * 0.34} ${-h * 0.18} Z`}
                    fill="#FFFFFF" opacity="0.92" />
            </g>
          );
        })}
        <circle cx={x} cy={y - 12 - h} r="3" fill="#FFFFFF" />
      </g>
    );
  }
  function Snowman({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 4px 5px rgba(90,120,150,0.26))' }}>
        <circle cx={x} cy={y - 12} r="15" fill="#FFFFFF" stroke="#D2E2EE" strokeWidth="1.5" />
        <circle cx={x} cy={y - 32} r="11" fill="#FFFFFF" stroke="#D2E2EE" strokeWidth="1.5" />
        <circle cx={x} cy={y - 49} r="8.5" fill="#FFFFFF" stroke="#D2E2EE" strokeWidth="1.5" />
        <line x1={x - 10} y1={y - 34} x2={x - 21} y2={y - 42} stroke="#9A6E44" strokeWidth="2" strokeLinecap="round" />
        <line x1={x + 10} y1={y - 34} x2={x + 21} y2={y - 40} stroke="#9A6E44" strokeWidth="2" strokeLinecap="round" />
        <circle cx={x - 3} cy={y - 51} r="1.4" fill="#3B2A18" />
        <circle cx={x + 3} cy={y - 51} r="1.4" fill="#3B2A18" />
        <path d={`M ${x} ${y - 48} l 7 2 l -7 2 Z`} fill="#FF9F68" stroke="#E97E45" strokeWidth="0.8" strokeLinejoin="round" />
        <path d={`M ${x - 8} ${y - 41} q 8 5 16 0`} fill="none" stroke="#F08A7E" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx={x} cy={y - 28} r="1.5" fill="#5B4636" />
      </g>
    );
  }
  function SnowBoulder({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 4px rgba(90,120,150,0.24))' }}>
        <path d={`M ${x - 20} ${y} q -4 -18 14 -22 q 10 -8 20 2 q 14 0 8 18 Z`} fill="#A9B9C7" stroke="#8395A6" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={`M ${x - 18} ${y - 14} q 12 -12 26 -8 q 8 -4 8 6 q -10 4 -20 2 q -8 4 -14 0 Z`} fill="#FFFFFF" opacity="0.94" />
      </g>
    );
  }
  function FrozenPond({ x, y }) {
    return (
      <g>
        <ellipse cx={x} cy={y} rx="30" ry="14" fill="#C7E2F2" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.95" />
        <ellipse cx={x - 8} cy={y - 3} rx="11" ry="5" fill="#FFFFFF" opacity="0.4" />
        <path d={`M ${x - 14} ${y + 2} L ${x} ${y - 4} L ${x + 11} ${y + 3}`} fill="none" stroke="#9DC4DE" strokeWidth="1" opacity="0.7" />
      </g>
    );
  }

  function StreakLayer({ streaks, color, speed = '1100ms', delay = '0ms' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        animation: `gj-w6t-scroll ${speed} linear infinite`, animationDelay: delay,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ position: 'absolute', inset: 0 }}>
          {streaks.map(([x, len], i) => (
            <rect key={i} x={x - 2} y={(i * 53) % 360} width="4" height={len} rx="2" fill={color} />
          ))}
          {streaks.map(([x, len], i) => (
            <rect key={`b-${i}`} x={x - 2} y={(i * 53) % 360 + 360} width="4" height={len} rx="2" fill={color} />
          ))}
        </svg>
      </div>
    );
  }

  // ─── horizon seam (snow → ice cave) ───────────────────────────────
  function HorizonSeam() {
    return (
      <div aria-hidden="true" style={{
        position: 'absolute', top: 360, left: 0, right: 0, height: 60, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(44,85,112,0) 0%, rgba(95,201,222,0.5) 46%, rgba(228,238,246,0.6) 56%, rgba(252,254,255,0) 100%)',
        boxShadow: 'inset 0 1.5px 0 rgba(207,246,255,0.55), inset 0 -1.5px 0 rgba(255,255,255,0.35)',
        animation: 'gj-w6t-seam 2000ms ease-in-out infinite',
      }} />
    );
  }

  // ─── confetti + ice sparkles ──────────────────────────────────────
  function Confetti() {
    const COLORS = ['#FFE3A3', '#A3E5D9', '#F7A9C0', '#B3C7F7', '#7FE0F2', '#7E6CF0'];
    const items = [
      [28,10,'rect',0,0,3200],[64,12,'tri',2,350,3000],[104,11,'rect',4,700,3400],
      [144,10,'circ',1,250,3100],[184,12,'rect',3,850,3200],[224,11,'tri',5,200,2900],
      [264,10,'rect',0,600,3300],[304,12,'rect',4,100,3100],[344,10,'tri',1,700,3000],
      [44,9,'circ',5,1100,3200],[84,11,'tri',3,450,3300],[124,10,'rect',2,950,3000],
      [164,9,'circ',0,550,3100],[204,11,'rect',5,150,2900],[244,12,'tri',4,800,3200],
      [284,10,'rect',2,350,3300],[324,11,'tri',3,1000,3000],[16,10,'rect',1,200,3100],
      [56,9,'tri',4,1200,3200],[128,11,'rect',0,50,3300],[192,10,'circ',2,900,3000],
      [256,11,'rect',5,500,3100],[296,12,'tri',3,100,3200],[336,10,'rect',4,750,3000],
      [32,11,'tri',2,1400,3300],[108,10,'rect',5,1300,3000],[216,12,'tri',1,0,3200],[288,10,'circ',4,250,3100],
    ];
    return (
      <React.Fragment>
        {items.map(([x, s, kind, ci, delay, dur], i) => {
          const fill = COLORS[ci];
          const rotStart = (i % 2 === 0 ? -1 : 1) * 120;
          const rotEnd = rotStart + (i % 2 === 0 ? 540 : -540);
          let shape;
          if (kind === 'rect') shape = <div style={{ width: s, height: s*1.2, borderRadius: Math.max(2,s*0.18), background: fill, border: '0.5px solid rgba(120,92,52,0.18)' }} />;
          else if (kind === 'tri') shape = (<svg width={s*1.4} height={s*1.2} viewBox="0 0 24 24" style={{display:'block'}}><path d="M12 2 L22 20 L2 20 Z" fill={fill} stroke="rgba(120,92,52,0.18)" strokeWidth="0.8" strokeLinejoin="round" /></svg>);
          else shape = <div style={{ width: s, height: s, borderRadius: '50%', background: fill, border: '0.5px solid rgba(120,92,52,0.18)' }} />;
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: -20, animation: `gj-w6t-fall-c ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
              <div style={{ animation: `gj-w6t-sway 1400ms ease-in-out infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%' }}>
                <div style={{ animation: `gj-w6t-spin ${dur}ms linear infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%', ['--rs']: `${rotStart}deg`, ['--re']: `${rotEnd}deg` }}>
                  {shape}
                </div>
              </div>
            </div>
          );
        })}

        {/* falling ice shards (cave theme) */}
        {[[40,11,3400,0],[96,9,3000,400],[150,12,3600,150],[210,10,3200,700],
          [264,11,3300,250],[318,9,3100,900],[68,10,3500,1100],[180,9,2900,550],
          [240,12,3400,1300],[300,10,3200,350]].map(([x,s,dur,delay],i)=>(
          <div key={`ic${i}`} style={{ position: 'absolute', left: x, top: -16, animation: `gj-w6t-fall-c ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
            <div style={{ animation: 'gj-w6t-sway 1700ms ease-in-out infinite', animationDelay: `${delay}ms` }}>
              <svg width={s*1.6} height={s*1.9} viewBox="0 0 24 30" style={{ display: 'block', filter: 'drop-shadow(0 0 3px rgba(127,224,242,0.6))' }}>
                <path d="M12 1 L17 9 L14 29 L10 29 L7 9 Z" fill="#7FE0F2" stroke="#CFF6FF" strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M12 1 L12 29" stroke="#CFF6FF" strokeWidth="0.9" opacity="0.8" />
              </svg>
            </div>
          </div>
        ))}

        {/* twinkling ice sparkles */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
          {[[56,350,12,0.0],[304,348,11,0.5],[44,460,10,1.0],[316,460,12,0.3],
            [36,410,9,1.4],[324,410,9,0.8],[80,348,8,1.2],[280,460,8,0.6]].map(([x,y,s,d],i)=>(
            <g key={i} style={{ animation: 'gj-w6t-tw 1800ms ease-in-out infinite', animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}>
              <path d={`M ${x} ${y-s} L ${x+s*0.28} ${y-s*0.28} L ${x+s} ${y} L ${x+s*0.28} ${y+s*0.28} L ${x} ${y+s} L ${x-s*0.28} ${y+s*0.28} L ${x-s} ${y} L ${x-s*0.28} ${y-s*0.28} Z`} fill="#CFF6FF" />
              <circle cx={x} cy={y} r={s*0.18} fill="#FFFFFF" />
            </g>
          ))}
        </svg>
      </React.Fragment>
    );
  }

  // ─── banner ───────────────────────────────────────────────────────
  function Banner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: BANNER_Y - 64, width: 280, padding: '14px 18px 16px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #ECF5FA 100%)', border: '1.5px solid #BFD2E0',
        borderRadius: 28,
        boxShadow: '0 18px 36px rgba(20,50,80,0.30), 0 6px 12px rgba(120,92,52,0.12), inset 0 2px 0 rgba(255,255,255,0.85)',
        textAlign: 'center', zIndex: 5,
        animation: `gj-w6t-pop ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`, transformOrigin: '50% 60%',
      }}>
        {/* ice-crystal flourishes */}
        <svg width="22" height="24" viewBox="0 0 24 30" style={{ position: 'absolute', top: 12, left: 16 }}>
          <path d="M12 1 L17 9 L14 27 L10 27 L7 9 Z" fill="#7FE0F2" stroke="#2F6B83" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M12 1 L12 27" stroke="#2F6B83" strokeWidth="1" />
          <path d="M5 6 L12 11 L19 6" fill="none" stroke="#5F9FB8" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 13, right: 15 }}>
          <g stroke="#5F9FB8" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="3.5" y1="7.5" x2="20.5" y2="16.5" />
            <line x1="20.5" y1="7.5" x2="3.5" y2="16.5" />
            <path d="M12 3 l-2.5 2.5 M12 3 l2.5 2.5 M12 21 l-2.5 -2.5 M12 21 l2.5 -2.5" />
          </g>
        </svg>

        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#9B886F', marginBottom: 4 }}>CHÀO MỪNG ĐẾN</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#3D7E96', marginBottom: 4 }}>THẾ GIỚI 7</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#2F6B83', lineHeight: 1.05 }}>Hang băng</div>
        <div style={{ margin: '8px auto 0', width: 84, height: 4, borderRadius: 999, background: 'linear-gradient(90deg, #7FE0F2 0%, #2F6B83 100%)', boxShadow: '0 2px 4px rgba(20,50,80,0.30)' }} />
      </div>
    );
  }

  // ─── mascots ──────────────────────────────────────────────────────
  function Mascots() {
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', left: 56, top: BANNER_Y + 78, zIndex: 6, animation: 'gj-w6t-hop 800ms ease-in-out infinite', filter: 'drop-shadow(0 6px 6px rgba(20,50,80,0.34))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="mint" size={62} direction="up" expression="happy" />
            <div style={{
              position: 'absolute', left: 56, top: -4, width: 22, height: 16, borderRadius: 9,
              background: 'var(--color-block-mint)', border: '2.5px solid var(--color-block-mint-edge)',
              boxShadow: 'inset 0 2px 0 var(--color-block-mint-shine)', transformOrigin: '0% 70%',
              animation: 'gj-w6t-wave 520ms ease-in-out infinite',
            }} />
            <div style={{ position: 'absolute', left: 6, top: 64, width: 50, height: 8, borderRadius: '50%', background: 'rgba(20,50,80,0.28)', filter: 'blur(2px)', animation: 'gj-w6t-msh 800ms ease-in-out infinite' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', right: 56, top: BANNER_Y + 86, zIndex: 6, animation: 'gj-w6t-hop 800ms ease-in-out infinite', animationDelay: '280ms', filter: 'drop-shadow(0 5px 5px rgba(20,50,80,0.30))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="blue" size={52} direction="up" expression="happy" />
            <div style={{ position: 'absolute', left: 2, top: 54, width: 44, height: 7, borderRadius: '50%', background: 'rgba(20,50,80,0.26)', filter: 'blur(2px)', animation: 'gj-w6t-msh 800ms ease-in-out infinite', animationDelay: '280ms' }} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ─── frame ────────────────────────────────────────────────────────
  function World6Transition() {
    return (
      <div style={{
        position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-w6t-in { 0%{transform:translateY(60px);filter:blur(4px);opacity:0.7} 18%{transform:translateY(0);filter:blur(0);opacity:1} 95%{transform:translateY(0);filter:blur(0);opacity:1} 100%{transform:translateY(60px);filter:blur(4px);opacity:0.7} }
          @keyframes gj-w6t-out { 0%{transform:translateY(0);opacity:1} 18%{transform:translateY(8px);opacity:0.96} 95%{transform:translateY(28px);opacity:0.92} 100%{transform:translateY(0);opacity:1} }
          @keyframes gj-w6t-scroll { from{transform:translateY(-180px)} to{transform:translateY(180px)} }
          @keyframes gj-w6t-seam { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes gj-w6t-pop { 0%{transform:translate(-50%,24px) scale(0.55);opacity:0} 18%{transform:translate(-50%,24px) scale(0.55);opacity:0} 28%{transform:translate(-50%,-4px) scale(1.08);opacity:1} 36%{transform:translate(-50%,0) scale(1);opacity:1} 90%{transform:translate(-50%,0) scale(1);opacity:1} 96%{transform:translate(-50%,4px) scale(0.95);opacity:0} 100%{transform:translate(-50%,24px) scale(0.55);opacity:0} }
          @keyframes gj-w6t-fall-c { 0%{transform:translateY(0)} 100%{transform:translateY(880px)} }
          @keyframes gj-w6t-sway { 0%,100%{transform:translateX(-10px)} 50%{transform:translateX(10px)} }
          @keyframes gj-w6t-spin { from{transform:rotate(var(--rs,0deg))} to{transform:rotate(var(--re,360deg))} }
          @keyframes gj-w6t-tw { 0%,100%{opacity:0.35;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.25)} }
          @keyframes gj-w6t-hop { 0%,100%{transform:translateY(0) scaleY(1)} 45%{transform:translateY(-14px) scaleY(1.04)} 55%{transform:translateY(-14px) scaleY(1.04)} }
          @keyframes gj-w6t-wave { 0%,100%{transform:rotate(-18deg)} 50%{transform:rotate(32deg)} }
          @keyframes gj-w6t-msh { 0%,100%{transform:scale(1);opacity:0.30} 45%{transform:scale(0.7);opacity:0.18} 55%{transform:scale(0.7);opacity:0.18} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <CaveRising />
        <SnowLeaving />
        <HorizonSeam />
        <Confetti />
        <Mascots />
        <Banner />
      </div>
    );
  }

  // ─── card ─────────────────────────────────────────────────────────
  function World6TransitionCard() {
    return (
      <div style={{
        position: 'relative', width: 760, padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#9B886F' }}>04 · SCREENS / TRANSITION</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: '#9B886F' }}>Cycle 3.0s · World 6 → World 7</div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: '#5B4636', marginBottom: 4, lineHeight: 1.05 }}>Chuyển cảnh · Núi tuyết → Hang băng</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#9B886F', marginBottom: 20 }}>Hang băng TRỖI LÊN · Núi tuyết LƯỚT XUỐNG · Banner POP · Confetti + băng RƠI · Mascot VẪY</div>

        <div style={{ display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28, alignItems: 'flex-start' }}>
          <div style={{ width: W, height: H, borderRadius: 28, overflow: 'hidden', boxShadow: '0 16px 36px rgba(60,44,24,0.32)' }}>
            <World6Transition />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
            <Phase t="0–18 %" name="Hang băng TRỖI LÊN"
                   detail="hang động băng (aerial) #22405A→#2C5570 · hồ băng phát sáng #2E6E86/#5FC9DE · đá hang #2A4A63 · tinh thể băng #7FE0F2 nhô lên · translateY +60→0 + blur fade" />
            <Phase t="0–18 %" name="Núi tuyết lướt xuống"
                   detail="lối mòn tuyết giữa + rừng thông 2 mép (đồng bộ strip) · translateY 0→+8 · veil xanh đậm fade = 'chìm vào hang'" />
            <Phase t="18–32 %" name="Banner POP IN"
                   detail="surface trắng→xanh băng · bo 28 · viền #BFD2E0 · 'Hang băng' Fredoka 22 #2F6B83 · tinh thể băng + bông tuyết 2 góc · spring" />
            <Phase t="22 %+" name="Confetti + băng + Mascot"
                   detail="28 mảnh confetti + 10 mảnh băng translateY 0→880 + sway + spin · mascot mint vẫy + xanh dương hop lệch pha 280ms" />
            <Phase t="30 %+" name="Sparkle băng + bụi tuyết"
                   detail="3 lớp streaks scroll dọc (trắng/xanh) · lấp lánh tinh thể băng #CFF6FF twinkle" />
            <Phase t="95–100 %" name="Reset" detail="banner scale-out, hang băng slide back, confetti loop, núi tuyết về vị trí" />

            <div style={{ height: 8 }} />
            <Note num="●" name="Palette World 7"
                  detail="hang #22405A→#2C5570 · hồ băng #2E6E86/#5FC9DE · đá #2A4A63/#16344B · tinh thể #7FE0F2/#CFF6FF · accent #2F6B83 · CTA cam giữ nguyên" />
            <Note num="●" name="Đồng bộ cutscene"
                  detail="cùng choreography & cycle 3.0s với W1→W2 … W5→W6 (new-world-in → old-world-out) để loạt transition nhất quán" />
          </div>
        </div>
      </div>
    );
  }
  function Phase({ t, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 64, padding: '3px 8px', borderRadius: 8, background: '#D6E9F0', color: '#2F6B83', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, textAlign: 'center', lineHeight: 1.2, border: '1.5px solid #AfD0DE' }}>{t}</div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 13, color: '#5B4636' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: '#9B886F', marginTop: 2 }}>{detail}</div>
        </div>
      </div>
    );
  }
  function Note({ num, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 24, height: 24, borderRadius: 999, background: '#4E94AC', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1, boxShadow: '0 2px 0 #2F6B83' }}>{num}</div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12, color: '#5B4636' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: '#9B886F', marginTop: 2 }}>{detail}</div>
        </div>
      </div>
    );
  }

  window.GJWorld6Transition = World6Transition;
  window.GJWorld6TransitionCard = World6TransitionCard;
})();
