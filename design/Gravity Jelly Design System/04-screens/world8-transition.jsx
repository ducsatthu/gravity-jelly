/* world8-transition.jsx — Khung chuyển cảnh World 8 → World 9.
   ---------------------------------------------------------------------
   Cycle 3.0s. Cùng choreography đã duyệt (W1→W2 … W7→W8):
     0–18 %  Bầu trời TRỖI LÊN nửa trên (translateY +60→0, blur fade)
             + Núi lửa LƯỚT XUỐNG nửa dưới (translateY 0→+8)
     18–32 % Banner POP IN giữa (scale spring)
     22 %+   Confetti + lông vũ/mây BAY (lệch pha) + 2 Mascot vẫy + hop
     30 %+   Motion-blur streaks dọc · mây/tia nắng bốc lên
     95–100% Reset

   Nửa trên World 9 Bầu trời (aerial): trời sáng #A6C4F2→#C7DCF7→#E4EFFC,
   mây cumulus trắng #FFFFFF/#E2ECFB, mặt trời ấm #FFF1C2/#FFD074, đảo trời
   cỏ xanh #9BE08C/#6FC97F trôi nổi, cầu vồng nhiều màu, lấp lánh nắng.
   Nửa dưới World 8 Núi lửa: lối nham thạch phát sáng giữa + vách đá nham
   thạch 2 mép (đồng bộ strip) đang trôi đi + motion blur + tàn lửa.
   Banner "THẾ GIỚI 9 — Bầu trời" (Fredoka 22 #3F6FB5).
   Exposes window.GJWorld8Transition + window.GJWorld8TransitionCard.     */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const W = 360;
  const H = 800;
  const BANNER_Y = 400;
  const CYCLE = '3000ms';

  // ─── new world rising (top) — Bầu trời (aerial sky) ────────────────
  function SkyRising() {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w8t-in ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="w8t-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#A6C4F2" />
              <stop offset="0.5"  stopColor="#C7DCF7" />
              <stop offset="1"    stopColor="#E4EFFC" />
            </linearGradient>
            <radialGradient id="w8t-sunglow" cx="0.78" cy="0.28" r="0.6">
              <stop offset="0"   stopColor="#FFF7DA" stopOpacity="0.85" />
              <stop offset="0.5" stopColor="#FFE08A" stopOpacity="0.3" />
              <stop offset="1"   stopColor="#FFE08A" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="w8t-grass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9BE08C" />
              <stop offset="1" stopColor="#6FC97F" />
            </linearGradient>
            <linearGradient id="w8t-isl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#CDA9E8" />
              <stop offset="1" stopColor="#9B7FD6" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#w8t-sky)" />
          <rect x="0" y="0" width={W} height="420" fill="url(#w8t-sunglow)" />

          {/* warm sun upper-right */}
          <g style={{ filter: 'drop-shadow(0 0 14px rgba(255,224,138,0.55))' }}>
            <circle cx={296} cy={70} r={34} fill="#FFF1C2" stroke="#FFD074" strokeWidth="3" />
            {[0,45,90,135,180,225,270,315].map((a)=>{const r=a*Math.PI/180;return(
              <line key={a} x1={296+Math.cos(r)*42} y1={70+Math.sin(r)*42} x2={296+Math.cos(r)*55} y2={70+Math.sin(r)*55} stroke="#FFD074" strokeWidth="4" strokeLinecap="round" opacity="0.85" />);})}
          </g>

          {/* rainbow arc */}
          <SkyRainbow cx={120} cy={250} w={150} />

          {/* floating grass sky-islands */}
          <SkyIsland x={70}  y={150} s={1.0} />
          <SkyIsland x={286} y={210} s={0.92} />
          <SkyIsland x={184} y={320} s={0.85} />

          {/* fluffy clouds */}
          <PuffCloud cx={96}  cy={300} s={1.0} />
          <PuffCloud cx={284} cy={330} s={0.85} />
          <PuffCloud cx={168} cy={70}  s={0.8} />
          <PuffCloud cx={40}  cy={230} s={0.7} />

          {/* bird flocks */}
          <FlockV x={230} y={120} />
          <FlockV x={60}  y={350} />

          {/* sun sparkles */}
          {[[64,120],[210,160],[272,90],[126,60],[332,150],[154,86],
            [300,260],[90,360],[210,392],[40,128],[236,96],[280,300]].map(([x,y],i)=>(
            <g key={`sp${i}`} style={{ animation: 'gj-w8t-tw 2200ms ease-in-out infinite', animationDelay: `${i*0.2}s`, transformOrigin: `${x}px ${y}px` }}>
              <circle cx={x} cy={y} r="1.8" fill="#FFFFFF" />
              <circle cx={x} cy={y} r="4.5" fill="#FFF4DC" opacity="0.4" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  function SkyRainbow({ cx, cy, w }) {
    const bands = ['#F7A9C0', '#FFC061', '#FFE08A', '#9BE08C', '#8FB6F2', '#A99CF6'];
    const r0 = w / 2;
    return (
      <g opacity="0.8" style={{ filter: 'drop-shadow(0 3px 5px rgba(80,110,170,0.18))' }}>
        {bands.map((c, i) => {
          const r = r0 - i * 6;
          return <path key={i} d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" />;
        })}
      </g>
    );
  }
  function PuffCloud({ cx, cy, s = 1 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 4px 6px rgba(90,120,180,0.22))' }}>
        <ellipse cx={cx} cy={cy} rx={36 * s} ry={16 * s} fill="#FFFFFF" />
        <circle cx={cx - 19 * s} cy={cy - 2 * s} r={14 * s} fill="#FFFFFF" />
        <circle cx={cx - 2 * s} cy={cy - 10 * s} r={17 * s} fill="#FFFFFF" />
        <circle cx={cx + 17 * s} cy={cy - 3 * s} r={13 * s} fill="#FFFFFF" />
        <ellipse cx={cx} cy={cy + 10 * s} rx={34 * s} ry={8 * s} fill="#E2ECFB" opacity="0.85" />
      </g>
    );
  }
  function SkyIsland({ x, y, s = 1 }) {
    const w = 64 * s;
    return (
      <g style={{ filter: 'drop-shadow(0 8px 10px rgba(80,110,170,0.22))' }}>
        <path d={`M ${x - w / 2} ${y} Q ${x - w / 2 - 6} ${y + 26 * s} ${x - w * 0.18} ${y + 40 * s} Q ${x} ${y + 54 * s} ${x + w * 0.2} ${y + 38 * s} Q ${x + w / 2 + 6} ${y + 24 * s} ${x + w / 2} ${y} Z`}
          fill="url(#w8t-isl)" stroke="#7E66C6" strokeWidth="1.5" strokeLinejoin="round" />
        <ellipse cx={x} cy={y} rx={w / 2} ry={13 * s} fill="url(#w8t-grass)" stroke="#56B36A" strokeWidth="1.5" />
        <ellipse cx={x - w * 0.16} cy={y - 3 * s} rx={w * 0.22} ry={5 * s} fill="#B6EDA5" opacity="0.8" />
        <path d={`M ${x - w * 0.32} ${y + 6 * s} q -3 16 1 30`} fill="none" stroke="#FFFFFF" strokeWidth={4 * s} strokeLinecap="round" opacity="0.75" />
      </g>
    );
  }
  function FlockV({ x, y }) {
    return (
      <g opacity="0.65">
        {[[0, 0], [18, 6], [-16, 7]].map(([dx, dy], i) =>
        <path key={i} d={`M ${x + dx - 7} ${y + dy} q 7 -6 7 0 q 0 -6 7 0`} fill="none" stroke="#5B6B8C" strokeWidth="1.8" strokeLinecap="round" />
        )}
      </g>
    );
  }

  // ─── old world leaving (bottom) — Núi lửa ─────────────────────────
  function VolcanoLeaving() {
    return (
      <div style={{
        position: 'absolute', top: 380, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w8t-out ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <defs>
            <linearGradient id="w8t-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"   stopColor="#EACFAE" />
              <stop offset="0.5" stopColor="#D2A878" />
              <stop offset="1"   stopColor="#BC8C5E" />
            </linearGradient>
            <linearGradient id="w8t-wall-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#2C120B" />
              <stop offset="0.7" stopColor="#43251A" />
              <stop offset="1" stopColor="#5A3322" />
            </linearGradient>
            <linearGradient id="w8t-wall-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#2C120B" />
              <stop offset="0.7" stopColor="#43251A" />
              <stop offset="1" stopColor="#5A3322" />
            </linearGradient>
            <linearGradient id="w8t-veil" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0"    stopColor="#A6C4F2" stopOpacity="0.30" />
              <stop offset="0.55" stopColor="#A6C4F2" stopOpacity="0.06" />
              <stop offset="1"    stopColor="#A6C4F2" stopOpacity="0"    />
            </linearGradient>
            <radialGradient id="w8t-vent" cx="0.5" cy="0.42" r="0.55">
              <stop offset="0" stopColor="#FFE6A8" stopOpacity="0.95" />
              <stop offset="0.5" stopColor="#FF7A3D" stopOpacity="0.55" />
              <stop offset="1" stopColor="#E0431F" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="w8t-lava" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#FFE6A8" stopOpacity="0.95" />
              <stop offset="0.45" stopColor="#FF7A3D" stopOpacity="0.9" />
              <stop offset="1" stopColor="#E0431F" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* warm volcanic ground base */}
          <rect x="0" y="0" width={W} height="420" fill="url(#w8t-ground)" />

          {/* rock walls on both edges (matches strip) */}
          <RockWall side="l" />
          <RockWall side="r" />

          {/* glowing lava corridor down the middle */}
          <path d="M150 0 L 210 0 L 214 420 L 146 420 Z" fill="#F0D6B2" opacity="0.55" />
          <line x1="180" y1="0" x2="180" y2="420" stroke="#FF9F52" strokeWidth="3.5" strokeDasharray="7 11" />

          {/* a couple volcano props on the trail */}
          <LavaPool x={120} y={150} />
          <FireVent x={244} y={300} />
          <MagmaRock x={142} y={250} />
          <LavaPool x={214} y={110} />

          <rect x="0" y="0" width={W} height="150" fill="url(#w8t-veil)" />
        </svg>

        {/* MOTION-BLUR streaks scrolling down */}
        <StreakLayer streaks={[[30,60],[330,60],[150,70],[212,60]]}
                     color="rgba(255,200,140,0.6)" speed="1100ms" />
        <StreakLayer streaks={[[48,80],[316,70],[120,50],[244,70]]}
                     color="rgba(255,159,82,0.5)" speed="1400ms" delay="200ms" />
        <StreakLayer streaks={[[60,70],[180,90],[290,60],[330,70]]}
                     color="rgba(217,181,140,0.5)" speed="900ms" delay="400ms" />
      </div>
    );
  }

  function RockWall({ side }) {
    const isL = side === 'l';
    const fill = isL ? 'url(#w8t-wall-l)' : 'url(#w8t-wall-r)';
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
    const spikes = [];
    for (let y = 20, i = 0; y < 420; y += 100, i++) {
      const ix = inset(Math.round((y + 20) / 150));
      spikes.push(<WallSpike key={`ws${i}`} bx={X(ix)} y={y} dir={isL ? 1 : -1} len={16 + i % 3 * 7} />);
    }
    const vents = [];
    for (let y = 60, i = 0; y < 420; y += 150, i++) {
      vents.push(<circle key={`wo${i}`} cx={X(34)} cy={y} r={i % 2 ? 5 : 7} fill="url(#w8t-vent)" opacity="0.85" />);
    }
    return (
      <g>
        <path d={d} fill={fill} />
        {vents}
        {spikes}
        <path d={edge} fill="none" stroke="#E0431F" strokeWidth="9" opacity="0.4" strokeLinecap="round" />
        <path d={edge} fill="none" stroke="#FFB27A" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
      </g>
    );
  }
  function WallSpike({ bx, y, dir, len = 18 }) {
    const tip = bx + dir * len;
    const w = 6 + len * 0.18;
    return (
      <g style={{ filter: 'drop-shadow(0 0 4px rgba(255,80,40,0.4))' }}>
        <path d={`M ${tip} ${y} L ${bx} ${y - w} L ${bx - dir * 6} ${y} L ${bx} ${y + w} Z`}
              fill="#2A1714" stroke="#1A0C08" strokeWidth="1.1" strokeLinejoin="round" opacity="0.95" />
        <path d={`M ${tip} ${y} L ${bx} ${y}`} stroke="#FF7A3D" strokeWidth="0.9" opacity="0.7" />
      </g>
    );
  }
  function LavaPool({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 9px rgba(255,122,61,0.5))' }}>
        <ellipse cx={x} cy={y} rx="34" ry="16" fill="#7A2A14" stroke="#FF7A3D" strokeWidth="2.5" />
        <ellipse cx={x} cy={y} rx="24" ry="10" fill="url(#w8t-lava)" />
        <ellipse cx={x - 9} cy={y - 3} rx="11" ry="4.5" fill="#FFE6A8" opacity="0.6" />
        <circle cx={x + 10} cy={y + 1} r="2.4" fill="#FFC061" opacity="0.85" />
      </g>
    );
  }
  function FireVent({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 7px rgba(255,122,61,0.55))' }}>
        <ellipse cx={x} cy={y + 8} rx="16" ry="6" fill="#3A1C12" stroke="#E0431F" strokeWidth="2" />
        <ellipse cx={x} cy={y + 8} rx="9" ry="3" fill="#FF7A3D" />
        <g style={{ animation: 'gj-w8t-flame 900ms ease-in-out infinite', transformOrigin: `${x}px ${y + 8}px` }}>
          <path d={`M ${x} ${y - 26} q 11 14 7 26 q -2 6 -7 9 q -5 -3 -7 -9 q -4 -12 7 -26 Z`} fill="#FF7A3D" stroke="#E0431F" strokeWidth="1" strokeLinejoin="round" />
          <path d={`M ${x} ${y - 14} q 6 8 3 16 q -3 4 -3 4 q 0 0 -3 -4 q -3 -8 3 -16 Z`} fill="#FFC061" />
          <path d={`M ${x} ${y - 4} q 2 4 0 8 q -2 -4 0 -8 Z`} fill="#FFE6A8" />
        </g>
      </g>
    );
  }
  function MagmaRock({ x, y }) {
    const n = 7; const pts = []; const r = 22;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.72 : r;
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.86]);
    }
    const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z';
    return (
      <g style={{ filter: 'drop-shadow(0 3px 4px rgba(20,6,2,0.45))' }}>
        <path d={d} fill="#3A1C12" stroke="#21100A" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={`M ${x - 12} ${y - 4} q 10 6 22 -2`} fill="none" stroke="#FF7A3D" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
        <ellipse cx={x} cy={y - r * 0.24} rx={r * 0.42} ry={r * 0.26} fill="#5A3322" opacity="0.7" />
      </g>
    );
  }

  function StreakLayer({ streaks, color, speed = '1100ms', delay = '0ms' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        animation: `gj-w8t-scroll ${speed} linear infinite`, animationDelay: delay,
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

  // ─── horizon seam (volcano → sky) ─────────────────────────────────
  function HorizonSeam() {
    return (
      <div aria-hidden="true" style={{
        position: 'absolute', top: 360, left: 0, right: 0, height: 60, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(166,196,242,0) 0%, rgba(255,197,154,0.5) 44%, rgba(220,234,251,0.7) 56%, rgba(188,140,94,0) 100%)',
        boxShadow: 'inset 0 1.5px 0 rgba(220,234,251,0.7), inset 0 -1.5px 0 rgba(255,180,120,0.4)',
        animation: 'gj-w8t-seam 2000ms ease-in-out infinite',
      }} />
    );
  }

  // ─── confetti + clouds/feathers rising ────────────────────────────
  function Confetti() {
    const COLORS = ['#B3C7F7', '#8FB6F2', '#A3E5D9', '#F7A9C0', '#FFE3A3', '#A99CF6'];
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
          if (kind === 'rect') shape = <div style={{ width: s, height: s*1.2, borderRadius: Math.max(2,s*0.18), background: fill, border: '0.5px solid rgba(60,80,140,0.2)' }} />;
          else if (kind === 'tri') shape = (<svg width={s*1.4} height={s*1.2} viewBox="0 0 24 24" style={{display:'block'}}><path d="M12 2 L22 20 L2 20 Z" fill={fill} stroke="rgba(60,80,140,0.2)" strokeWidth="0.8" strokeLinejoin="round" /></svg>);
          else shape = <div style={{ width: s, height: s, borderRadius: '50%', background: fill, border: '0.5px solid rgba(60,80,140,0.2)' }} />;
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: -20, animation: `gj-w8t-fall-c ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
              <div style={{ animation: `gj-w8t-sway 1400ms ease-in-out infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%' }}>
                <div style={{ animation: `gj-w8t-spin ${dur}ms linear infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%', ['--rs']: `${rotStart}deg`, ['--re']: `${rotEnd}deg` }}>
                  {shape}
                </div>
              </div>
            </div>
          );
        })}

        {/* rising fluffy cloud puffs (sky theme) */}
        {[[40,3400,0],[96,3000,400],[150,3600,150],[210,3200,700],
          [264,3300,250],[318,3100,900],[68,3500,1100],[180,2900,550],
          [240,3400,1300],[300,3200,350],[120,3000,800],[330,3500,500]].map(([x,dur,delay],i)=>(
          <div key={`pf${i}`} style={{ position: 'absolute', left: x, top: H + 14, animation: `gj-w8t-rise ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
            <div style={{ animation: 'gj-w8t-sway 1700ms ease-in-out infinite', animationDelay: `${delay}ms`, filter: 'drop-shadow(0 2px 3px rgba(90,120,180,0.3))' }}>
              <svg width="22" height="14" viewBox="0 0 22 14"><ellipse cx="11" cy="9" rx="9" ry="4.5" fill="#FFFFFF" /><circle cx="6" cy="7" r="4.5" fill="#FFFFFF" /><circle cx="13" cy="5" r="5.5" fill="#FFFFFF" /></svg>
            </div>
          </div>
        ))}

        {/* twinkling sun sparks near banner */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
          {[[56,350,12,0.0],[304,348,11,0.5],[44,460,10,1.0],[316,460,12,0.3],
            [36,410,9,1.4],[324,410,9,0.8],[80,348,8,1.2],[280,460,8,0.6]].map(([x,y,s,d],i)=>(
            <g key={i} style={{ animation: 'gj-w8t-tw 1800ms ease-in-out infinite', animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}>
              <path d={`M ${x} ${y-s} L ${x+s*0.28} ${y-s*0.28} L ${x+s} ${y} L ${x+s*0.28} ${y+s*0.28} L ${x} ${y+s} L ${x-s*0.28} ${y+s*0.28} L ${x-s} ${y} L ${x-s*0.28} ${y-s*0.28} Z`} fill="#FFE08A" />
              <circle cx={x} cy={y} r={s*0.18} fill="#FFF7DC" />
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
        background: 'linear-gradient(180deg, #FFFFFF 0%, #EAF2FE 100%)', border: '1.5px solid #C5D8F2',
        borderRadius: 28,
        boxShadow: '0 18px 36px rgba(60,90,160,0.30), 0 6px 12px rgba(120,92,52,0.14), inset 0 2px 0 rgba(255,255,255,0.85)',
        textAlign: 'center', zIndex: 5,
        animation: `gj-w8t-pop ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`, transformOrigin: '50% 60%',
      }}>
        {/* sky flourishes */}
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', top: 12, left: 14 }}>
          <circle cx="17" cy="8" r="4" fill="#FFE08A" stroke="#FFC23D" strokeWidth="1" />
          <path d="M5 17 a3.5 3.5 0 0 1 0.4 -6.96 a4.4 4.4 0 0 1 8.2 1 a3 3 0 0 1 -0.3 5.96 Z" fill="#FFFFFF" stroke="#BBD3F7" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 13, right: 15 }}>
          <path d="M3 17 A 9 9 0 0 1 21 17" fill="none" stroke="#F7A9C0" strokeWidth="2" strokeLinecap="round" />
          <path d="M5.5 17 A 6.5 6.5 0 0 1 18.5 17" fill="none" stroke="#FFE08A" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 17 A 4 4 0 0 1 16 17" fill="none" stroke="#8FB6F2" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#9B886F', marginBottom: 4 }}>CHÀO MỪNG ĐẾN</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#5A8BD0', marginBottom: 4 }}>THẾ GIỚI 9</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#3F6FB5', lineHeight: 1.05 }}>Bầu trời</div>
        <div style={{ margin: '8px auto 0', width: 84, height: 4, borderRadius: 999, background: 'linear-gradient(90deg, #8FB6F2 0%, #A99CF6 100%)', boxShadow: '0 2px 4px rgba(60,90,160,0.3)' }} />
      </div>
    );
  }

  // ─── mascots ──────────────────────────────────────────────────────
  function Mascots() {
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', left: 56, top: BANNER_Y + 78, zIndex: 6, animation: 'gj-w8t-hop 800ms ease-in-out infinite', filter: 'drop-shadow(0 6px 6px rgba(60,90,160,0.32))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="blue" size={62} direction="up" expression="happy" />
            <div style={{
              position: 'absolute', left: 56, top: -4, width: 22, height: 16, borderRadius: 9,
              background: 'var(--color-block-blue)', border: '2.5px solid var(--color-block-blue-edge)',
              boxShadow: 'inset 0 2px 0 var(--color-block-blue-shine)', transformOrigin: '0% 70%',
              animation: 'gj-w8t-wave 520ms ease-in-out infinite',
            }} />
            <div style={{ position: 'absolute', left: 6, top: 64, width: 50, height: 8, borderRadius: '50%', background: 'rgba(60,90,160,0.26)', filter: 'blur(2px)', animation: 'gj-w8t-msh 800ms ease-in-out infinite' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', right: 56, top: BANNER_Y + 86, zIndex: 6, animation: 'gj-w8t-hop 800ms ease-in-out infinite', animationDelay: '280ms', filter: 'drop-shadow(0 5px 5px rgba(60,90,160,0.28))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="mint" size={52} direction="up" expression="happy" />
            <div style={{ position: 'absolute', left: 2, top: 54, width: 44, height: 7, borderRadius: '50%', background: 'rgba(60,90,160,0.24)', filter: 'blur(2px)', animation: 'gj-w8t-msh 800ms ease-in-out infinite', animationDelay: '280ms' }} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ─── frame ────────────────────────────────────────────────────────
  function World8Transition() {
    return (
      <div style={{
        position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-w8t-in { 0%{transform:translateY(60px);filter:blur(4px);opacity:0.7} 18%{transform:translateY(0);filter:blur(0);opacity:1} 95%{transform:translateY(0);filter:blur(0);opacity:1} 100%{transform:translateY(60px);filter:blur(4px);opacity:0.7} }
          @keyframes gj-w8t-out { 0%{transform:translateY(0);opacity:1} 18%{transform:translateY(8px);opacity:0.96} 95%{transform:translateY(28px);opacity:0.92} 100%{transform:translateY(0);opacity:1} }
          @keyframes gj-w8t-scroll { from{transform:translateY(-180px)} to{transform:translateY(180px)} }
          @keyframes gj-w8t-seam { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes gj-w8t-pop { 0%{transform:translate(-50%,24px) scale(0.55);opacity:0} 18%{transform:translate(-50%,24px) scale(0.55);opacity:0} 28%{transform:translate(-50%,-4px) scale(1.08);opacity:1} 36%{transform:translate(-50%,0) scale(1);opacity:1} 90%{transform:translate(-50%,0) scale(1);opacity:1} 96%{transform:translate(-50%,4px) scale(0.95);opacity:0} 100%{transform:translate(-50%,24px) scale(0.55);opacity:0} }
          @keyframes gj-w8t-fall-c { 0%{transform:translateY(0)} 100%{transform:translateY(880px)} }
          @keyframes gj-w8t-rise { 0%{transform:translateY(0);opacity:0} 12%{opacity:1} 88%{opacity:1} 100%{transform:translateY(-840px);opacity:0} }
          @keyframes gj-w8t-sway { 0%,100%{transform:translateX(-10px)} 50%{transform:translateX(10px)} }
          @keyframes gj-w8t-spin { from{transform:rotate(var(--rs,0deg))} to{transform:rotate(var(--re,360deg))} }
          @keyframes gj-w8t-tw { 0%,100%{opacity:0.35;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.25)} }
          @keyframes gj-w8t-flame { 0%,100%{transform:scaleY(1) scaleX(1)} 50%{transform:scaleY(1.16) scaleX(0.9)} }
          @keyframes gj-w8t-hop { 0%,100%{transform:translateY(0) scaleY(1)} 45%{transform:translateY(-14px) scaleY(1.04)} 55%{transform:translateY(-14px) scaleY(1.04)} }
          @keyframes gj-w8t-wave { 0%,100%{transform:rotate(-18deg)} 50%{transform:rotate(32deg)} }
          @keyframes gj-w8t-msh { 0%,100%{transform:scale(1);opacity:0.30} 45%{transform:scale(0.7);opacity:0.18} 55%{transform:scale(0.7);opacity:0.18} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <SkyRising />
        <VolcanoLeaving />
        <HorizonSeam />
        <Confetti />
        <Mascots />
        <Banner />
      </div>
    );
  }

  // ─── card ─────────────────────────────────────────────────────────
  function World8TransitionCard() {
    return (
      <div style={{
        position: 'relative', width: 760, padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#9B886F' }}>04 · SCREENS / TRANSITION</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: '#9B886F' }}>Cycle 3.0s · World 8 → World 9</div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: '#5B4636', marginBottom: 4, lineHeight: 1.05 }}>Chuyển cảnh · Núi lửa → Bầu trời</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#9B886F', marginBottom: 20 }}>Bầu trời TRỖI LÊN · Núi lửa LƯỚT XUỐNG · Banner POP · Confetti + mây BAY · Mascot VẪY</div>

        <div style={{ display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28, alignItems: 'flex-start' }}>
          <div style={{ width: W, height: H, borderRadius: 28, overflow: 'hidden', boxShadow: '0 16px 36px rgba(60,44,24,0.32)' }}>
            <World8Transition />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
            <Phase t="0–18 %" name="Bầu trời TRỖI LÊN"
                   detail="trời sáng (aerial) #A6C4F2→#E4EFFC · mây cumulus trắng · mặt trời ấm #FFF1C2/#FFD074 · đảo trời cỏ xanh #9BE08C trôi nổi · cầu vồng · translateY +60→0 + blur fade" />
            <Phase t="0–18 %" name="Núi lửa lướt xuống"
                   detail="lối nham thạch phát sáng giữa + vách đá nham thạch 2 mép (đồng bộ strip) · translateY 0→+8 · veil xanh trời fade = 'bay lên bầu trời'" />
            <Phase t="18–32 %" name="Banner POP IN"
                   detail="surface trắng→xanh trời · bo 28 · viền #C5D8F2 · 'Bầu trời' Fredoka 22 #3F6FB5 · mây+mặt trời & cầu vồng 2 góc · spring" />
            <Phase t="22 %+" name="Confetti + mây + Mascot"
                   detail="28 mảnh confetti rơi 0→880 + 12 mây bốc lên 0→−840 + sway + spin · mascot xanh vẫy + mint hop lệch pha 280ms" />
            <Phase t="30 %+" name="Streak + sparkle nắng"
                   detail="3 lớp streaks nham thạch scroll dọc (cam/đất) · lấp lánh tia nắng #FFE08A twinkle quanh banner" />
            <Phase t="95–100 %" name="Reset" detail="banner scale-out, bầu trời slide back, confetti loop, núi lửa về vị trí" />

            <div style={{ height: 8 }} />
            <Note num="●" name="Palette World 9"
                  detail="trời #A6C4F2→#E4EFFC · mây #FFFFFF/#E2ECFB · mặt trời #FFF1C2/#FFD074 · cỏ đảo #9BE08C/#6FC97F · accent #3F6FB5 · CTA cam giữ nguyên" />
            <Note num="●" name="Đồng bộ cutscene"
                  detail="cùng choreography & cycle 3.0s với W1→W2 … W7→W8 (new-world-in → old-world-out) để loạt transition nhất quán" />
          </div>
        </div>
      </div>
    );
  }
  function Phase({ t, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 64, padding: '3px 8px', borderRadius: 8, background: '#E4EEFB', color: '#3F6FB5', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, textAlign: 'center', lineHeight: 1.2, border: '1.5px solid #C5D8F2' }}>{t}</div>
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
        <div style={{ width: 24, height: 24, borderRadius: 999, background: '#5A8BD0', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1, boxShadow: '0 2px 0 #3F6FB5' }}>{num}</div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12, color: '#5B4636' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: '#9B886F', marginTop: 2 }}>{detail}</div>
        </div>
      </div>
    );
  }

  window.GJWorld8Transition = World8Transition;
  window.GJWorld8TransitionCard = World8TransitionCard;
})();
