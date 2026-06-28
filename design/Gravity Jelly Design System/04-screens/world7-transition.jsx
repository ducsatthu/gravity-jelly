/* world7-transition.jsx — Khung chuyển cảnh World 7 → World 8.
   ---------------------------------------------------------------------
   Cycle 3.0s. Cùng choreography đã duyệt (W1→W2 … W6→W7):
     0–18 %  Núi lửa TRỖI LÊN nửa trên (translateY +60→0, blur fade)
             + Hang băng LƯỚT XUỐNG nửa dưới (translateY 0→+8)
     18–32 % Banner POP IN giữa (scale spring)
     22 %+   Tàn lửa + confetti BAY (lệch pha) + 2 Mascot vẫy + hop
     30 %+   Motion-blur streaks dọc · tàn lửa bốc lên
     95–100% Reset

   Nửa trên World 8 Núi lửa (aerial top-down): nền nham thạch tối
   #3A1710→#2C120B→#43251A, hồ dung nham phát sáng #FF7A3D/#FFD27A/#E0431F,
   khe nứt nham thạch #E0431F/#FF9F52, đá núi lửa #3A1C12/#21100A, tàn lửa
   #FFC061/#FF7A3D bốc lên.
   Nửa dưới World 7 Hang băng: lối băng phát sáng giữa + vách hang băng 2
   mép (đồng bộ strip) đang trôi đi + motion blur băng + tinh thể.
   Banner "THẾ GIỚI 8 — Núi lửa" (Fredoka 22 #B5462E).
   Exposes window.GJWorld7Transition + window.GJWorld7TransitionCard.     */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const W = 360;
  const H = 800;
  const BANNER_Y = 400;
  const CYCLE = '3000ms';

  // ─── new world rising (top) — Núi lửa (aerial volcano) ─────────────
  function VolcanoRising() {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w7t-in ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="w7t-vol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#3A1710" />
              <stop offset="0.5"  stopColor="#2C120B" />
              <stop offset="1"    stopColor="#43251A" />
            </linearGradient>
            <radialGradient id="w7t-vglow" cx="0.5" cy="0.42" r="0.62">
              <stop offset="0"   stopColor="#FF7A3D" stopOpacity="0.32" />
              <stop offset="0.6" stopColor="#E0431F" stopOpacity="0.12" />
              <stop offset="1"   stopColor="#E0431F" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="w7t-lava" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0"    stopColor="#FFE6A8" stopOpacity="0.95" />
              <stop offset="0.45" stopColor="#FF7A3D" stopOpacity="0.92" />
              <stop offset="1"    stopColor="#E0431F" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#w7t-vol)" />
          <rect x="0" y="0" width={W} height="420" fill="url(#w7t-vglow)" />

          {/* glowing lava pools (aerial) */}
          <LavaPool cx={92}  cy={104} rx={64} ry={28} />
          <LavaPool cx={284} cy={188} rx={72} ry={30} />
          <LavaPool cx={196} cy={300} rx={86} ry={32} />

          {/* glowing lava cracks */}
          <LavaCrack d="M0 150 Q 90 132 160 158 T 360 142" />
          <LavaCrack d="M20 244 Q 120 224 220 252 T 360 232" />
          <LavaCrack d="M0 356 Q 110 338 200 364 T 360 346" />

          {/* dark volcanic rocks */}
          <VolRock cx={306} cy={70}  r={42} />
          <VolRock cx={48}  cy={200} r={46} />
          <VolRock cx={168} cy={48}  r={34} />
          <VolRock cx={312} cy={330} r={40} />
          <VolRock cx={56}  cy={356} r={38} />

          {/* glowing embers rising */}
          {[[64,120],[210,160],[272,80],[126,52],[332,110],[154,76],
            [300,260],[90,360],[210,392],[40,128],[236,96],[280,300]].map(([x,y],i)=>(
            <g key={`em${i}`} style={{ animation: 'gj-w7t-ember 2.8s ease-in-out infinite', animationDelay: `${i*0.26}s`, transformOrigin: `${x}px ${y}px` }}>
              <circle cx={x} cy={y} r="2.6" fill="#FFC061" opacity="0.95" />
              <circle cx={x} cy={y} r="5" fill="#FF7A3D" opacity="0.4" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  function LavaPool({ cx, cy, rx, ry }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 10px rgba(255,122,61,0.55))' }}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#7A2A14" stroke="#FF7A3D" strokeWidth="2.5" />
        <ellipse cx={cx} cy={cy} rx={rx * 0.72} ry={ry * 0.68} fill="url(#w7t-lava)" />
        <ellipse cx={cx - rx * 0.24} cy={cy - ry * 0.28} rx={rx * 0.3} ry={ry * 0.24} fill="#FFE6A8" opacity="0.6" />
      </g>
    );
  }
  function LavaCrack({ d }) {
    return (
      <g>
        <path d={d} fill="none" stroke="#E0431F" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <path d={d} fill="none" stroke="#FF9F52" strokeWidth="2.2" strokeLinecap="round" opacity="0.95" />
      </g>
    );
  }
  function VolRock({ cx, cy, r }) {
    const n = 7; const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.7 : r;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86]);
    }
    const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ') + ' Z';
    return (
      <g style={{ filter: 'drop-shadow(0 2px 3px rgba(20,6,2,0.5))' }}>
        <path d={d} fill="#3A1C12" stroke="#21100A" strokeWidth="1.5" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#21100A" strokeWidth="1" opacity="0.5" />
        ))}
        <ellipse cx={cx} cy={cy - r * 0.2} rx={r * 0.4} ry={r * 0.26} fill="#5A3322" opacity="0.7" />
      </g>
    );
  }

  // ─── old world leaving (bottom) — Hang băng ───────────────────────
  function CaveLeaving() {
    return (
      <div style={{
        position: 'absolute', top: 380, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w7t-out ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <defs>
            <linearGradient id="w7t-trail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"   stopColor="#E2F5FD" />
              <stop offset="0.5" stopColor="#C2E4F1" />
              <stop offset="1"   stopColor="#A7D2E6" />
            </linearGradient>
            <linearGradient id="w7t-wall-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#13304A" />
              <stop offset="0.7" stopColor="#1E3C57" />
              <stop offset="1" stopColor="#2E516B" />
            </linearGradient>
            <linearGradient id="w7t-wall-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#13304A" />
              <stop offset="0.7" stopColor="#1E3C57" />
              <stop offset="1" stopColor="#2E516B" />
            </linearGradient>
            <linearGradient id="w7t-veil" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0"    stopColor="#3A1710" stopOpacity="0.22" />
              <stop offset="0.55" stopColor="#3A1710" stopOpacity="0.05" />
              <stop offset="1"    stopColor="#3A1710" stopOpacity="0"    />
            </linearGradient>
            <radialGradient id="w7t-orb" cx="0.5" cy="0.42" r="0.55">
              <stop offset="0" stopColor="#DFFAFF" stopOpacity="0.95" />
              <stop offset="0.5" stopColor="#7FE0F2" stopOpacity="0.5" />
              <stop offset="1" stopColor="#5FC9DE" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="w7t-pool" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#CFF6FF" stopOpacity="0.9" />
              <stop offset="1" stopColor="#3E94AE" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* glowing ice trail base */}
          <rect x="0" y="0" width={W} height="420" fill="url(#w7t-trail)" />

          {/* ice-cave walls on both edges (matches strip) */}
          <CaveWall side="l" />
          <CaveWall side="r" />

          {/* glowing ice corridor down the middle */}
          <path d="M150 0 L 210 0 L 214 420 L 146 420 Z" fill="#E8F7FD" opacity="0.6" />
          <line x1="180" y1="0" x2="180" y2="420" stroke="#7FE0F2" strokeWidth="3.5" strokeDasharray="7 11" />

          {/* a couple ice props on the trail */}
          <CrystalCluster x={120} y={150} />
          <GlowPool x={244} y={300} />
          <IceBoulder x={142} y={250} />
          <GlowPool x={214} y={110} />

          <rect x="0" y="0" width={W} height="150" fill="url(#w7t-veil)" />
        </svg>

        {/* MOTION-BLUR streaks scrolling down */}
        <StreakLayer streaks={[[30,60],[330,60],[150,70],[212,60]]}
                     color="rgba(232,247,253,0.7)" speed="1100ms" />
        <StreakLayer streaks={[[48,80],[316,70],[120,50],[244,70]]}
                     color="rgba(127,224,242,0.6)" speed="1400ms" delay="200ms" />
        <StreakLayer streaks={[[60,70],[180,90],[290,60],[330,70]]}
                     color="rgba(167,210,230,0.5)" speed="900ms" delay="400ms" />
      </div>
    );
  }

  function CaveWall({ side }) {
    const isL = side === 'l';
    const fill = isL ? 'url(#w7t-wall-l)' : 'url(#w7t-wall-r)';
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
    const orbs = [];
    for (let y = 60, i = 0; y < 420; y += 150, i++) {
      orbs.push(<circle key={`wo${i}`} cx={X(34)} cy={y} r={i % 2 ? 5 : 7} fill="url(#w7t-orb)" opacity="0.8" />);
    }
    return (
      <g>
        <path d={d} fill={fill} />
        {orbs}
        {spikes}
        <path d={edge} fill="none" stroke="#3E94AE" strokeWidth="9" opacity="0.5" strokeLinecap="round" />
        <path d={edge} fill="none" stroke="#CFF6FF" strokeWidth="3.5" opacity="0.85" strokeLinecap="round" />
      </g>
    );
  }
  function WallSpike({ bx, y, dir, len = 18 }) {
    const tip = bx + dir * len;
    const w = 6 + len * 0.18;
    return (
      <g style={{ filter: 'drop-shadow(0 0 5px rgba(127,224,242,0.5))' }}>
        <path d={`M ${tip} ${y} L ${bx} ${y - w} L ${bx - dir * 6} ${y} L ${bx} ${y + w} Z`}
              fill="#5FC9DE" stroke="#CFF6FF" strokeWidth="1.1" strokeLinejoin="round" opacity="0.92" />
        <path d={`M ${tip} ${y} L ${bx} ${y}`} stroke="#CFF6FF" strokeWidth="0.8" opacity="0.7" />
      </g>
    );
  }
  function CrystalCluster({ x, y }) {
    const shard = (dx, h, w, hue) => {
      const bx = x + dx;
      return (
        <path key={`${dx}-${h}`} d={`M ${bx} ${y - h} L ${bx + w} ${y + 4} L ${bx} ${y + 10} L ${bx - w} ${y + 4} Z`}
              fill={hue} stroke="#CFF6FF" strokeWidth="1.3" strokeLinejoin="round" />);
    };
    return (
      <g style={{ filter: 'drop-shadow(0 0 8px rgba(127,224,242,0.6))' }}>
        <ellipse cx={x} cy={y + 12} rx="22" ry="6" fill="#5FC9DE" opacity="0.28" />
        {shard(-14, 30, 8, '#5FC9DE')}
        {shard(13, 36, 9, '#5FC9DE')}
        {shard(0, 52, 11, '#7FE0F2')}
        <path d={`M ${x} ${y - 52} L ${x} ${y + 8}`} stroke="#CFF6FF" strokeWidth="1" opacity="0.8" />
        <circle cx={x} cy={y - 36} r="2.4" fill="#FFFFFF" opacity="0.9" />
      </g>
    );
  }
  function GlowPool({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 0 8px rgba(95,201,222,0.5))' }}>
        <ellipse cx={x} cy={y} rx="34" ry="16" fill="#2E6E86" stroke="#5FC9DE" strokeWidth="2.5" />
        <ellipse cx={x} cy={y} rx="24" ry="11" fill="url(#w7t-pool)" />
        <ellipse cx={x - 9} cy={y - 4} rx="11" ry="5" fill="#CFF6FF" opacity="0.55" />
      </g>
    );
  }
  function IceBoulder({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 4px rgba(8,24,40,0.4))' }}>
        <path d={`M ${x - 20} ${y} q -4 -18 14 -22 q 10 -8 20 2 q 14 0 8 18 Z`} fill="#6FA8C4" stroke="#3E6F8C" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={`M ${x - 18} ${y - 14} q 12 -12 26 -8 q 8 -4 8 6 q -10 4 -20 2 q -8 4 -14 0 Z`} fill="#CFEAF7" opacity="0.9" />
      </g>
    );
  }

  function StreakLayer({ streaks, color, speed = '1100ms', delay = '0ms' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        animation: `gj-w7t-scroll ${speed} linear infinite`, animationDelay: delay,
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

  // ─── horizon seam (ice → volcano) ─────────────────────────────────
  function HorizonSeam() {
    return (
      <div aria-hidden="true" style={{
        position: 'absolute', top: 360, left: 0, right: 0, height: 60, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(58,23,16,0) 0%, rgba(255,122,61,0.55) 46%, rgba(255,197,154,0.6) 56%, rgba(226,245,253,0) 100%)',
        boxShadow: 'inset 0 1.5px 0 rgba(255,214,160,0.6), inset 0 -1.5px 0 rgba(207,246,255,0.4)',
        animation: 'gj-w7t-seam 2000ms ease-in-out infinite',
      }} />
    );
  }

  // ─── embers + confetti rising ─────────────────────────────────────
  function Confetti() {
    const COLORS = ['#FFE3A3', '#FFC061', '#F7A9C0', '#FF9F68', '#FFD27A', '#F08A7E'];
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
          if (kind === 'rect') shape = <div style={{ width: s, height: s*1.2, borderRadius: Math.max(2,s*0.18), background: fill, border: '0.5px solid rgba(120,60,20,0.2)' }} />;
          else if (kind === 'tri') shape = (<svg width={s*1.4} height={s*1.2} viewBox="0 0 24 24" style={{display:'block'}}><path d="M12 2 L22 20 L2 20 Z" fill={fill} stroke="rgba(120,60,20,0.2)" strokeWidth="0.8" strokeLinejoin="round" /></svg>);
          else shape = <div style={{ width: s, height: s, borderRadius: '50%', background: fill, border: '0.5px solid rgba(120,60,20,0.2)' }} />;
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: -20, animation: `gj-w7t-fall-c ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
              <div style={{ animation: `gj-w7t-sway 1400ms ease-in-out infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%' }}>
                <div style={{ animation: `gj-w7t-spin ${dur}ms linear infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%', ['--rs']: `${rotStart}deg`, ['--re']: `${rotEnd}deg` }}>
                  {shape}
                </div>
              </div>
            </div>
          );
        })}

        {/* rising embers (volcano theme) */}
        {[[40,3400,0],[96,3000,400],[150,3600,150],[210,3200,700],
          [264,3300,250],[318,3100,900],[68,3500,1100],[180,2900,550],
          [240,3400,1300],[300,3200,350],[120,3000,800],[330,3500,500]].map(([x,dur,delay],i)=>(
          <div key={`em${i}`} style={{ position: 'absolute', left: x, top: H + 10, animation: `gj-w7t-rise ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
            <div style={{ animation: 'gj-w7t-sway 1700ms ease-in-out infinite', animationDelay: `${delay}ms`, filter: 'drop-shadow(0 0 4px rgba(255,122,61,0.7))' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #FFE6A8 0%, #FF9F52 55%, #E0431F 100%)' }} />
            </div>
          </div>
        ))}

        {/* twinkling sparks near banner */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
          {[[56,350,12,0.0],[304,348,11,0.5],[44,460,10,1.0],[316,460,12,0.3],
            [36,410,9,1.4],[324,410,9,0.8],[80,348,8,1.2],[280,460,8,0.6]].map(([x,y,s,d],i)=>(
            <g key={i} style={{ animation: 'gj-w7t-tw 1800ms ease-in-out infinite', animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}>
              <path d={`M ${x} ${y-s} L ${x+s*0.28} ${y-s*0.28} L ${x+s} ${y} L ${x+s*0.28} ${y+s*0.28} L ${x} ${y+s} L ${x-s*0.28} ${y+s*0.28} L ${x-s} ${y} L ${x-s*0.28} ${y-s*0.28} Z`} fill="#FFD27A" />
              <circle cx={x} cy={y} r={s*0.18} fill="#FFF4DC" />
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
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FBEDE4 100%)', border: '1.5px solid #E8C6B0',
        borderRadius: 28,
        boxShadow: '0 18px 36px rgba(120,50,20,0.32), 0 6px 12px rgba(120,92,52,0.14), inset 0 2px 0 rgba(255,255,255,0.85)',
        textAlign: 'center', zIndex: 5,
        animation: `gj-w7t-pop ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`, transformOrigin: '50% 60%',
      }}>
        {/* volcano flourishes */}
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', top: 12, left: 14 }}>
          <path d="M3 21 L9 9 L15 9 L21 21 Z" fill="#5A2A18" stroke="#3A1810" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M9 9 L12 3 L15 9 Z" fill="#FFC061" stroke="#FF7A3D" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M10.5 21 L12 13 L13.5 21 Z" fill="#FF7A3D" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 13, right: 15 }}>
          <g fill="#FF9F52" stroke="#E0431F" strokeWidth="1.2" strokeLinejoin="round">
            <circle cx="12" cy="14" r="6" fill="#FFC061" />
            <path d="M12 8 q -4 -5 0 -6 q 4 4 0 6 Z" fill="#FF7A3D" />
          </g>
        </svg>

        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#9B886F', marginBottom: 4 }}>CHÀO MỪNG ĐẾN</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#C8662F', marginBottom: 4 }}>THẾ GIỚI 8</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#B5462E', lineHeight: 1.05 }}>Núi lửa</div>
        <div style={{ margin: '8px auto 0', width: 84, height: 4, borderRadius: 999, background: 'linear-gradient(90deg, #FFC061 0%, #E0431F 100%)', boxShadow: '0 2px 4px rgba(120,50,20,0.32)' }} />
      </div>
    );
  }

  // ─── mascots ──────────────────────────────────────────────────────
  function Mascots() {
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', left: 56, top: BANNER_Y + 78, zIndex: 6, animation: 'gj-w7t-hop 800ms ease-in-out infinite', filter: 'drop-shadow(0 6px 6px rgba(120,50,20,0.34))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="pink" size={62} direction="up" expression="happy" />
            <div style={{
              position: 'absolute', left: 56, top: -4, width: 22, height: 16, borderRadius: 9,
              background: 'var(--color-block-pink)', border: '2.5px solid var(--color-block-pink-edge)',
              boxShadow: 'inset 0 2px 0 var(--color-block-pink-shine)', transformOrigin: '0% 70%',
              animation: 'gj-w7t-wave 520ms ease-in-out infinite',
            }} />
            <div style={{ position: 'absolute', left: 6, top: 64, width: 50, height: 8, borderRadius: '50%', background: 'rgba(120,50,20,0.28)', filter: 'blur(2px)', animation: 'gj-w7t-msh 800ms ease-in-out infinite' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', right: 56, top: BANNER_Y + 86, zIndex: 6, animation: 'gj-w7t-hop 800ms ease-in-out infinite', animationDelay: '280ms', filter: 'drop-shadow(0 5px 5px rgba(120,50,20,0.30))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="yellow" size={52} direction="up" expression="happy" />
            <div style={{ position: 'absolute', left: 2, top: 54, width: 44, height: 7, borderRadius: '50%', background: 'rgba(120,50,20,0.26)', filter: 'blur(2px)', animation: 'gj-w7t-msh 800ms ease-in-out infinite', animationDelay: '280ms' }} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ─── frame ────────────────────────────────────────────────────────
  function World7Transition() {
    return (
      <div style={{
        position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-w7t-in { 0%{transform:translateY(60px);filter:blur(4px);opacity:0.7} 18%{transform:translateY(0);filter:blur(0);opacity:1} 95%{transform:translateY(0);filter:blur(0);opacity:1} 100%{transform:translateY(60px);filter:blur(4px);opacity:0.7} }
          @keyframes gj-w7t-out { 0%{transform:translateY(0);opacity:1} 18%{transform:translateY(8px);opacity:0.96} 95%{transform:translateY(28px);opacity:0.92} 100%{transform:translateY(0);opacity:1} }
          @keyframes gj-w7t-scroll { from{transform:translateY(-180px)} to{transform:translateY(180px)} }
          @keyframes gj-w7t-seam { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes gj-w7t-pop { 0%{transform:translate(-50%,24px) scale(0.55);opacity:0} 18%{transform:translate(-50%,24px) scale(0.55);opacity:0} 28%{transform:translate(-50%,-4px) scale(1.08);opacity:1} 36%{transform:translate(-50%,0) scale(1);opacity:1} 90%{transform:translate(-50%,0) scale(1);opacity:1} 96%{transform:translate(-50%,4px) scale(0.95);opacity:0} 100%{transform:translate(-50%,24px) scale(0.55);opacity:0} }
          @keyframes gj-w7t-fall-c { 0%{transform:translateY(0)} 100%{transform:translateY(880px)} }
          @keyframes gj-w7t-rise { 0%{transform:translateY(0);opacity:0} 12%{opacity:1} 88%{opacity:1} 100%{transform:translateY(-840px);opacity:0} }
          @keyframes gj-w7t-sway { 0%,100%{transform:translateX(-10px)} 50%{transform:translateX(10px)} }
          @keyframes gj-w7t-spin { from{transform:rotate(var(--rs,0deg))} to{transform:rotate(var(--re,360deg))} }
          @keyframes gj-w7t-tw { 0%,100%{opacity:0.35;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.25)} }
          @keyframes gj-w7t-ember { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-7px);opacity:1} }
          @keyframes gj-w7t-hop { 0%,100%{transform:translateY(0) scaleY(1)} 45%{transform:translateY(-14px) scaleY(1.04)} 55%{transform:translateY(-14px) scaleY(1.04)} }
          @keyframes gj-w7t-wave { 0%,100%{transform:rotate(-18deg)} 50%{transform:rotate(32deg)} }
          @keyframes gj-w7t-msh { 0%,100%{transform:scale(1);opacity:0.30} 45%{transform:scale(0.7);opacity:0.18} 55%{transform:scale(0.7);opacity:0.18} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <VolcanoRising />
        <CaveLeaving />
        <HorizonSeam />
        <Confetti />
        <Mascots />
        <Banner />
      </div>
    );
  }

  // ─── card ─────────────────────────────────────────────────────────
  function World7TransitionCard() {
    return (
      <div style={{
        position: 'relative', width: 760, padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#9B886F' }}>04 · SCREENS / TRANSITION</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: '#9B886F' }}>Cycle 3.0s · World 7 → World 8</div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: '#5B4636', marginBottom: 4, lineHeight: 1.05 }}>Chuyển cảnh · Hang băng → Núi lửa</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#9B886F', marginBottom: 20 }}>Núi lửa TRỖI LÊN · Hang băng LƯỚT XUỐNG · Banner POP · Confetti + tàn lửa BAY · Mascot VẪY</div>

        <div style={{ display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28, alignItems: 'flex-start' }}>
          <div style={{ width: W, height: H, borderRadius: 28, overflow: 'hidden', boxShadow: '0 16px 36px rgba(60,44,24,0.32)' }}>
            <World7Transition />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
            <Phase t="0–18 %" name="Núi lửa TRỖI LÊN"
                   detail="nền nham thạch (aerial) #3A1710→#43251A · hồ dung nham phát sáng #FF7A3D/#FFD27A · khe nứt #E0431F/#FF9F52 · đá núi lửa #3A1C12 · tàn lửa bốc lên · translateY +60→0 + blur fade" />
            <Phase t="0–18 %" name="Hang băng lướt xuống"
                   detail="lối băng phát sáng giữa + vách hang băng 2 mép (đồng bộ strip) · translateY 0→+8 · veil cam nóng fade = 'tiến vào nham thạch'" />
            <Phase t="18–32 %" name="Banner POP IN"
                   detail="surface trắng→cam đất · bo 28 · viền #E8C6B0 · 'Núi lửa' Fredoka 22 #B5462E · núi lửa + mặt trời lửa 2 góc · spring" />
            <Phase t="22 %+" name="Confetti + tàn lửa + Mascot"
                   detail="28 mảnh confetti rơi 0→880 + 12 tàn lửa bốc lên 0→−840 + sway + spin · mascot hồng vẫy + vàng hop lệch pha 280ms" />
            <Phase t="30 %+" name="Streak + sparkle lửa"
                   detail="3 lớp streaks băng scroll dọc (trắng/xanh) · lấp lánh tia lửa #FFD27A twinkle quanh banner" />
            <Phase t="95–100 %" name="Reset" detail="banner scale-out, núi lửa slide back, confetti loop, hang băng về vị trí" />

            <div style={{ height: 8 }} />
            <Note num="●" name="Palette World 8"
                  detail="nham thạch #3A1710→#43251A · dung nham #FF7A3D/#FFD27A/#E0431F · đá #3A1C12/#21100A · accent #B5462E · CTA cam giữ nguyên" />
            <Note num="●" name="Đồng bộ cutscene"
                  detail="cùng choreography & cycle 3.0s với W1→W2 … W6→W7 (new-world-in → old-world-out) để loạt transition nhất quán" />
          </div>
        </div>
      </div>
    );
  }
  function Phase({ t, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 64, padding: '3px 8px', borderRadius: 8, background: '#FBE0CF', color: '#C8662F', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, textAlign: 'center', lineHeight: 1.2, border: '1.5px solid #F0C3A8' }}>{t}</div>
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
        <div style={{ width: 24, height: 24, borderRadius: 999, background: '#E0703F', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1, boxShadow: '0 2px 0 #B5462E' }}>{num}</div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12, color: '#5B4636' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: '#9B886F', marginTop: 2 }}>{detail}</div>
        </div>
      </div>
    );
  }

  window.GJWorld7Transition = World7Transition;
  window.GJWorld7TransitionCard = World7TransitionCard;
})();
