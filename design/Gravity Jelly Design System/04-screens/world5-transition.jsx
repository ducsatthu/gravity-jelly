/* world5-transition.jsx — Khung chuyển cảnh World 5 → World 6.
   ---------------------------------------------------------------------
   Cycle 3.0s. Cùng choreography đã duyệt (W1→W2 … W4→W5):
     0–18 %  Núi tuyết TRỖI LÊN nửa trên (translateY +60→0, blur fade)
             + Bãi biển LƯỚT XUỐNG nửa dưới (translateY 0→+8)
     18–32 % Banner POP IN giữa (scale spring)
     22 %+   Confetti RƠI (lệch pha) + 2 Mascot vẫy + hop
     30 %+   Motion-blur streaks dọc · bông tuyết bay + lấp lánh băng
     95–100% Reset

   Nửa trên World 6 Núi tuyết: trời lạnh #DCEBF5→#F2F8FD, mặt trời mờ,
   dãy núi tuyết #A6B8CC/#8197AE + chóp tuyết trắng, hồ băng #C7E2F2,
   nền tuyết #F5FAFF, thông phủ tuyết, người tuyết, bông tuyết rơi.
   Nửa dưới World 5: dải cát giữa + biển 2 mép (đồng bộ strip) đang trôi đi
   + motion blur sóng/bọt + bụi cát.
   Banner "THẾ GIỚI 6 — Núi tuyết" (Fredoka 22 #5B4636).
   Exposes window.GJWorld5Transition + window.GJWorld5TransitionCard.      */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const W = 360;
  const H = 800;
  const BANNER_Y = 400;
  const CYCLE = '3000ms';

  // ─── new world rising (top) — Núi tuyết ───────────────────────────
  function SnowRising() {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w5t-in ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="w5t-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#DCEBF5" />
              <stop offset="0.55" stopColor="#E8F2FA" />
              <stop offset="1"    stopColor="#F4FAFE" />
            </linearGradient>
            <radialGradient id="w5t-sun" cx="0.76" cy="0.24" r="0.42">
              <stop offset="0"   stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="0.5" stopColor="#EAF3FB" stopOpacity="0.45" />
              <stop offset="1"   stopColor="#EAF3FB" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="w5t-rangeBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C7D6E6" />
              <stop offset="1" stopColor="#B6C8DC" />
            </linearGradient>
            <linearGradient id="w5t-range" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#A6B8CC" />
              <stop offset="1" stopColor="#8FA3BB" />
            </linearGradient>
            <linearGradient id="w5t-lake" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#D2EBF6" />
              <stop offset="1" stopColor="#AfD6EC" />
            </linearGradient>
            <linearGradient id="w5t-snowground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#E3EEF7" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#w5t-sky)" />
          {/* pale winter sun */}
          <circle cx="278" cy="86" r="30" fill="#FBFEFF" opacity="0.95" />
          <circle cx="278" cy="86" r="20" fill="#EAF3FB" />
          <rect x="0" y="0" width={W} height="420" fill="url(#w5t-sun)" />

          {/* back range */}
          <path d="M-10 214 L 64 150 L 132 200 L 196 138 L 268 196 L 336 150 L 370 196 L 370 250 L -10 250 Z"
                fill="url(#w5t-rangeBack)" opacity="0.9" />

          {/* front snow peaks */}
          <SnowPeak baseY={250} cx={70}  w={120} h={120} />
          <SnowPeak baseY={250} cx={196} w={150} h={150} />
          <SnowPeak baseY={250} cx={312} w={118} h={110} />

          {/* frozen lake band */}
          <rect x="0" y="244" width={W} height="40" fill="url(#w5t-lake)" />
          {[256, 270].map((y, i) => (
            <line key={i} x1="0" y1={y} x2={W} y2={y} stroke="#FFFFFF" strokeWidth="1.6" opacity={0.5 - i * 0.15} strokeLinecap="round" />
          ))}
          {[[60,252],[150,264],[230,254],[300,268]].map(([x,y],i)=>(
            <circle key={`ic${i}`} cx={x} cy={y} r="1.6" fill="#FFFFFF" opacity="0.85" />
          ))}

          {/* snow ground foreground */}
          <path d="M0 280 q 90 16 180 4 t 180 12 L360 420 L0 420 Z" fill="url(#w5t-snowground)" />
          <path d="M0 284 q 90 16 180 4 t 180 12" fill="none" stroke="#FFFFFF" strokeWidth="3.5" opacity="0.85" strokeLinecap="round" />
          <path d="M0 292 q 90 14 180 4 t 180 11" fill="none" stroke="#CFE0EF" strokeWidth="2" opacity="0.6" strokeLinecap="round" />

          {/* snow drifts */}
          <ellipse cx="44" cy="402" rx="78" ry="20" fill="#FFFFFF" opacity="0.85" />
          <ellipse cx="320" cy="408" rx="70" ry="18" fill="#FFFFFF" opacity="0.85" />

          {/* pine trees (side view, snow-capped) */}
          <PineSide x={58}  y={372} h={74} />
          <PineSide x={104} y={384} h={52} />
          <PineSide x={316} y={364} h={66} />

          {/* snowman + snowballs */}
          <Snowman x={186} y={394} />
          <circle cx="128" cy="404" r="9" fill="#FFFFFF" stroke="#D5E4F0" strokeWidth="1.5" />
          <circle cx="252" cy="406" r="7" fill="#FFFFFF" stroke="#D5E4F0" strokeWidth="1.5" />

          {/* frost sparkles on snow */}
          {[[40,358],[330,382],[160,402],[286,372],[210,360]].map(([x,y],i)=>(
            <circle key={`fr${i}`} cx={x} cy={y} r="1.4" fill="#FFFFFF" opacity="0.9" />
          ))}
        </svg>
      </div>
    );
  }

  function SnowPeak({ baseY, cx, w, h }) {
    const half = w / 2;
    const topY = baseY - h;
    const capY = topY + h * 0.34;
    const capL = cx - half * 0.34;
    const capR = cx + half * 0.34;
    return (
      <g style={{ filter: 'drop-shadow(0 3px 4px rgba(90,120,150,0.20))' }}>
        <path d={`M ${cx - half} ${baseY} L ${cx} ${topY} L ${cx + half} ${baseY} Z`}
              fill="url(#w5t-range)" stroke="#8197AE" strokeWidth="2" strokeLinejoin="round" />
        {/* snow cap */}
        <path d={`M ${cx} ${topY} L ${capR} ${capY} Q ${cx + half * 0.12} ${capY + 8} ${cx} ${capY + 2}
                  Q ${cx - half * 0.12} ${capY + 10} ${capL} ${capY} Z`}
              fill="#FFFFFF" stroke="#E3EDF5" strokeWidth="1" strokeLinejoin="round" />
        {/* shaded face */}
        <path d={`M ${cx} ${topY} L ${cx + half} ${baseY} L ${cx + half * 0.2} ${baseY} Z`}
              fill="#8FA3BB" opacity="0.5" />
      </g>
    );
  }

  function PineSide({ x, y, h = 60 }) {
    const w = h * 0.5;
    const tiers = [0, 0.32, 0.6];
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(90,120,150,0.20))' }}>
        {/* trunk */}
        <rect x={x - 3} y={y - h * 0.12} width="6" height={h * 0.18} rx="2" fill="#9A7A52" />
        {tiers.map((t, i) => {
          const ty = y - h + h * t;
          const tw = w * (0.6 + t);
          return (
            <g key={i}>
              <path d={`M ${x} ${ty} L ${x + tw / 2} ${ty + h * 0.32} L ${x - tw / 2} ${ty + h * 0.32} Z`}
                    fill={i === 0 ? '#5F8A6E' : '#4F7B5E'} stroke="#3F6A4E" strokeWidth="1" strokeLinejoin="round" />
              {/* snow on the tier */}
              <path d={`M ${x} ${ty} L ${x + tw / 4} ${ty + h * 0.14} Q ${x} ${ty + h * 0.05} ${x - tw / 4} ${ty + h * 0.14} Z`}
                    fill="#FFFFFF" opacity="0.92" />
            </g>
          );
        })}
        <circle cx={x} cy={y - h - 1} r="2.4" fill="#FFFFFF" />
      </g>
    );
  }

  function Snowman({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 3px rgba(90,120,150,0.22))' }}>
        <ellipse cx={x} cy={y + 12} rx="22" ry="6" fill="#D7E5F1" opacity="0.6" />
        <circle cx={x} cy={y} r="15" fill="#FFFFFF" stroke="#D5E4F0" strokeWidth="1.5" />
        <circle cx={x} cy={y - 20} r="11" fill="#FFFFFF" stroke="#D5E4F0" strokeWidth="1.5" />
        <circle cx={x} cy={y - 35} r="8" fill="#FFFFFF" stroke="#D5E4F0" strokeWidth="1.5" />
        {/* face */}
        <circle cx={x - 3} cy={y - 37} r="1.3" fill="#3B2A18" />
        <circle cx={x + 3} cy={y - 37} r="1.3" fill="#3B2A18" />
        <path d={`M ${x} ${y - 34} l 7 2 l -7 1 Z`} fill="#FF9F68" />
        {/* hat */}
        <rect x={x - 9} y={y - 47} width="18" height="3.5" rx="1.5" fill="#6353D6" />
        <rect x={x - 6} y={y - 56} width="12" height="11" rx="2" fill="#7E6CF0" />
        {/* buttons + arms */}
        <circle cx={x} cy={y - 4} r="1.4" fill="#6353D6" />
        <circle cx={x} cy={y + 3} r="1.4" fill="#6353D6" />
        <line x1={x - 11} y1={y - 21} x2={x - 22} y2={y - 27} stroke="#9A7A52" strokeWidth="2" strokeLinecap="round" />
        <line x1={x + 11} y1={y - 21} x2={x + 22} y2={y - 27} stroke="#9A7A52" strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  }

  // ─── old world leaving (bottom) — Bãi biển ────────────────────────
  function BeachLeaving() {
    return (
      <div style={{
        position: 'absolute', top: 380, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w5t-out ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <defs>
            <linearGradient id="w5t-sand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#FBEEC9" />
              <stop offset="0.5"  stopColor="#F4E2B4" />
              <stop offset="1"    stopColor="#EBD29C" />
            </linearGradient>
            <linearGradient id="w5t-sea-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4FA9CF" />
              <stop offset="0.7" stopColor="#6FC4DA" />
              <stop offset="1" stopColor="#9ED9E6" />
            </linearGradient>
            <linearGradient id="w5t-sea-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#4FA9CF" />
              <stop offset="0.7" stopColor="#6FC4DA" />
              <stop offset="1" stopColor="#9ED9E6" />
            </linearGradient>
            <linearGradient id="w5t-veil" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0"    stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="1"    stopColor="#FFFFFF" stopOpacity="0"    />
            </linearGradient>
          </defs>

          {/* sand corridor base */}
          <rect x="0" y="0" width={W} height="420" fill="url(#w5t-sand)" />

          {/* sea on both edges (matches strip) */}
          <SeaEdge side="l" />
          <SeaEdge side="r" />

          {/* sandy walking path down the middle */}
          <path d="M150 0 L 210 0 L 214 420 L 146 420 Z" fill="#E7D09A" opacity="0.55" />
          <line x1="180" y1="0" x2="180" y2="420" stroke="#E6CFA0" strokeWidth="3.5" strokeDasharray="7 11" />

          {/* a couple beach props on the sand */}
          <Palm x={120} y={150} h={56} />
          <Palm x={246} y={300} h={50} />
          <Starfish x={150} y={250} r={11} />
          <Shell x={210} y={120} />

          <rect x="0" y="0" width={W} height="150" fill="url(#w5t-veil)" />
        </svg>

        {/* MOTION-BLUR streaks scrolling down */}
        <StreakLayer streaks={[[30,60],[330,60],[150,70],[212,60]]}
                     color="rgba(255,255,255,0.55)" speed="1100ms" />
        <StreakLayer streaks={[[48,80],[316,70],[120,50],[244,70]]}
                     color="rgba(111,196,218,0.55)" speed="1400ms" delay="200ms" />
        <StreakLayer streaks={[[60,70],[180,90],[290,60],[330,70]]}
                     color="rgba(235,210,156,0.5)" speed="900ms" delay="400ms" />
      </div>
    );
  }

  function SeaEdge({ side }) {
    const isL = side === 'l';
    const fill = isL ? 'url(#w5t-sea-l)' : 'url(#w5t-sea-r)';
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
    let foam = `M ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1], [x, y] = pts[i];
      foam += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    const waves = [];
    for (let y = 40, i = 0; y < 420; y += 84, i++) {
      const x0 = isL ? -10 : W + 10; const x1 = X(64);
      waves.push(
        <path key={`wv${i}`} d={`M ${x0} ${y} q ${(x1 - x0) / 4} -6 ${(x1 - x0) / 2} 0 t ${(x1 - x0) / 2} 0`}
              fill="none" stroke="#FFFFFF" strokeWidth="1.6" opacity="0.4" strokeLinecap="round" />
      );
    }
    return (
      <g>
        <path d={d} fill={fill} />
        {waves}
        <path d={foam} fill="none" stroke="#EAD7A8" strokeWidth="9" opacity="0.55" strokeLinecap="round" />
        <path d={foam} fill="none" stroke="#FFFFFF" strokeWidth="4" opacity="0.85" strokeLinecap="round" />
        <path d={foam} fill="none" stroke="#CFEEF5" strokeWidth="2" opacity="0.7" strokeLinecap="round" transform="translate(0,4)" />
      </g>
    );
  }

  function Palm({ x, y, h = 56 }) {
    const fronds = [-74, -40, -10, 22];
    const leaf = 'M0 0 Q 24 -8 46 4 Q 26 1 0 7 Z';
    return (
      <g style={{ filter: 'drop-shadow(0 3px 3px rgba(120,100,40,0.22))' }}>
        <path d={`M ${x - 3.5} ${y} L ${x - 2} ${y - h} L ${x + 2} ${y - h} L ${x + 3.5} ${y} Z`} fill="#B98A56" stroke="#A2773F" strokeWidth="1" strokeLinejoin="round" />
        <g transform={`translate(${x} ${y - h})`}>
          {fronds.map((deg, i) => (
            <path key={`r${i}`} d={leaf} fill={i % 2 ? '#57A86A' : '#67B87A'} stroke="#3F8A52" strokeWidth="1" transform={`rotate(${deg})`} />
          ))}
          {fronds.map((deg, i) => (
            <path key={`l${i}`} d={leaf} fill={i % 2 ? '#57A86A' : '#67B87A'} stroke="#3F8A52" strokeWidth="1" transform={`scale(-1,1) rotate(${deg})`} />
          ))}
          <circle cx="0" cy="2" r="3.6" fill="#C98A4E" />
        </g>
      </g>
    );
  }
  function Starfish({ x, y, r = 12 }) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = (-90 + i * 72) * Math.PI / 180;
      pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
      const a2 = (-90 + i * 72 + 36) * Math.PI / 180;
      pts.push([x + Math.cos(a2) * r * 0.46, y + Math.sin(a2) * r * 0.46]);
    }
    const d = 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z';
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.22))' }}>
        <path d={d} fill="#FFB07F" stroke="#E97E45" strokeWidth="1.4" strokeLinejoin="round" />
      </g>
    );
  }
  function Shell({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 1px 1px rgba(120,100,40,0.2))' }}>
        <path d={`M ${x} ${y} a 8 8 0 1 1 0.1 0 Z`} fill="#FBD8E2" stroke="#E89BB4" strokeWidth="1.3" />
        {[-4,0,4].map((o,i)=>(
          <line key={i} x1={x} y1={y} x2={x + o} y2={y - 8} stroke="#E89BB4" strokeWidth="1.1" />
        ))}
      </g>
    );
  }

  function StreakLayer({ streaks, color, speed = '1100ms', delay = '0ms' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        animation: `gj-w5t-scroll ${speed} linear infinite`, animationDelay: delay,
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

  // ─── horizon seam ─────────────────────────────────────────────────
  function HorizonSeam() {
    return (
      <div aria-hidden="true" style={{
        position: 'absolute', top: 360, left: 0, right: 0, height: 60, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(244,250,254,0) 0%, rgba(227,238,247,0.6) 42%, rgba(251,238,201,0.6) 56%, rgba(235,210,156,0) 100%)',
        boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.6), inset 0 -1.5px 0 rgba(255,255,255,0.35)',
        animation: 'gj-w5t-seam 2000ms ease-in-out infinite',
      }} />
    );
  }

  // ─── confetti + snow sparkles ─────────────────────────────────────
  function Confetti() {
    const COLORS = ['#FFE3A3', '#A3E5D9', '#F7A9C0', '#B3C7F7', '#FF9F68', '#7E6CF0'];
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
            <div key={i} style={{ position: 'absolute', left: x, top: -20, animation: `gj-w5t-fall-c ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
              <div style={{ animation: `gj-w5t-sway 1400ms ease-in-out infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%' }}>
                <div style={{ animation: `gj-w5t-spin ${dur}ms linear infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%', ['--rs']: `${rotStart}deg`, ['--re']: `${rotEnd}deg` }}>
                  {shape}
                </div>
              </div>
            </div>
          );
        })}

        {/* falling snowflakes (winter theme) */}
        {[[40,10,3400,0],[96,8,3000,400],[150,11,3600,150],[210,9,3200,700],
          [264,10,3300,250],[318,8,3100,900],[68,9,3500,1100],[180,8,2900,550],
          [240,11,3400,1300],[300,9,3200,350]].map(([x,s,dur,delay],i)=>(
          <div key={`sn${i}`} style={{ position: 'absolute', left: x, top: -16, animation: `gj-w5t-fall-c ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
            <div style={{ animation: 'gj-w5t-sway 1700ms ease-in-out infinite', animationDelay: `${delay}ms` }}>
              <svg width={s*2} height={s*2} viewBox="0 0 24 24" style={{ display: 'block' }}>
                <g stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.95">
                  <line x1="12" y1="3" x2="12" y2="21" />
                  <line x1="4" y1="7.5" x2="20" y2="16.5" />
                  <line x1="20" y1="7.5" x2="4" y2="16.5" />
                </g>
              </svg>
            </div>
          </div>
        ))}

        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
          {[[56,350,12,0.0],[304,348,11,0.5],[44,460,10,1.0],[316,460,12,0.3],
            [36,410,9,1.4],[324,410,9,0.8],[80,348,8,1.2],[280,460,8,0.6]].map(([x,y,s,d],i)=>(
            <g key={i} style={{ animation: 'gj-w5t-tw 1800ms ease-in-out infinite', animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}>
              <path d={`M ${x} ${y-s} L ${x+s*0.28} ${y-s*0.28} L ${x+s} ${y} L ${x+s*0.28} ${y+s*0.28} L ${x} ${y+s} L ${x-s*0.28} ${y+s*0.28} L ${x-s} ${y} L ${x-s*0.28} ${y-s*0.28} Z`} fill="#EAF6FF" />
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
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F2F8FD 100%)', border: '1.5px solid #D2E2F0',
        borderRadius: 28,
        boxShadow: '0 18px 36px rgba(90,120,160,0.26), 0 6px 12px rgba(120,92,52,0.14), inset 0 2px 0 rgba(255,255,255,0.85)',
        textAlign: 'center', zIndex: 5,
        animation: `gj-w5t-pop ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`, transformOrigin: '50% 60%',
      }}>
        {/* snowflake flourishes */}
        <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 12, left: 16 }}>
          <g stroke="#6E92B6" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="3.5" y1="7.5" x2="20.5" y2="16.5" />
            <line x1="20.5" y1="7.5" x2="3.5" y2="16.5" />
            <path d="M12 3 l-2.5 2.5 M12 3 l2.5 2.5 M12 21 l-2.5 -2.5 M12 21 l2.5 -2.5" />
          </g>
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 13, right: 15 }}>
          <path d="M12 21 L 12 9" fill="none" stroke="#9A7A52" strokeWidth="2" strokeLinecap="round" />
          {[0, 0.34, 0.62].map((t, i) => (
            <path key={i} d={`M12 ${9 + t * 11} l -6 ${-2 - t * 2} M12 ${9 + t * 11} l 6 ${-2 - t * 2}`} fill="none" stroke={i % 2 ? '#4F7B5E' : '#5F8A6E'} strokeWidth="2" strokeLinecap="round" />
          ))}
        </svg>

        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#9B886F', marginBottom: 4 }}>CHÀO MỪNG ĐẾN</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#5C7C9E', marginBottom: 4 }}>THẾ GIỚI 6</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#5B4636', lineHeight: 1.05 }}>Núi tuyết</div>
        <div style={{ margin: '8px auto 0', width: 84, height: 4, borderRadius: 999, background: 'linear-gradient(90deg, #A6C2DA 0%, #5C7C9E 100%)', boxShadow: '0 2px 4px rgba(90,120,150,0.30)' }} />
      </div>
    );
  }

  // ─── mascots ──────────────────────────────────────────────────────
  function Mascots() {
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', left: 56, top: BANNER_Y + 78, zIndex: 6, animation: 'gj-w5t-hop 800ms ease-in-out infinite', filter: 'drop-shadow(0 6px 6px rgba(120,92,52,0.32))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="blue" size={62} direction="up" expression="happy" />
            <div style={{
              position: 'absolute', left: 56, top: -4, width: 22, height: 16, borderRadius: 9,
              background: 'var(--color-block-blue)', border: '2.5px solid var(--color-block-blue-edge)',
              boxShadow: 'inset 0 2px 0 var(--color-block-blue-shine)', transformOrigin: '0% 70%',
              animation: 'gj-w5t-wave 520ms ease-in-out infinite',
            }} />
            <div style={{ position: 'absolute', left: 6, top: 64, width: 50, height: 8, borderRadius: '50%', background: 'rgba(120,92,52,0.25)', filter: 'blur(2px)', animation: 'gj-w5t-msh 800ms ease-in-out infinite' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', right: 56, top: BANNER_Y + 86, zIndex: 6, animation: 'gj-w5t-hop 800ms ease-in-out infinite', animationDelay: '280ms', filter: 'drop-shadow(0 5px 5px rgba(120,92,52,0.28))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="pink" size={52} direction="up" expression="happy" />
            <div style={{ position: 'absolute', left: 2, top: 54, width: 44, height: 7, borderRadius: '50%', background: 'rgba(120,92,52,0.22)', filter: 'blur(2px)', animation: 'gj-w5t-msh 800ms ease-in-out infinite', animationDelay: '280ms' }} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ─── frame ────────────────────────────────────────────────────────
  function World5Transition() {
    return (
      <div style={{
        position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-w5t-in { 0%{transform:translateY(60px);filter:blur(4px);opacity:0.7} 18%{transform:translateY(0);filter:blur(0);opacity:1} 95%{transform:translateY(0);filter:blur(0);opacity:1} 100%{transform:translateY(60px);filter:blur(4px);opacity:0.7} }
          @keyframes gj-w5t-out { 0%{transform:translateY(0);opacity:1} 18%{transform:translateY(8px);opacity:0.96} 95%{transform:translateY(28px);opacity:0.92} 100%{transform:translateY(0);opacity:1} }
          @keyframes gj-w5t-scroll { from{transform:translateY(-180px)} to{transform:translateY(180px)} }
          @keyframes gj-w5t-seam { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes gj-w5t-pop { 0%{transform:translate(-50%,24px) scale(0.55);opacity:0} 18%{transform:translate(-50%,24px) scale(0.55);opacity:0} 28%{transform:translate(-50%,-4px) scale(1.08);opacity:1} 36%{transform:translate(-50%,0) scale(1);opacity:1} 90%{transform:translate(-50%,0) scale(1);opacity:1} 96%{transform:translate(-50%,4px) scale(0.95);opacity:0} 100%{transform:translate(-50%,24px) scale(0.55);opacity:0} }
          @keyframes gj-w5t-fall-c { 0%{transform:translateY(0)} 100%{transform:translateY(880px)} }
          @keyframes gj-w5t-sway { 0%,100%{transform:translateX(-10px)} 50%{transform:translateX(10px)} }
          @keyframes gj-w5t-spin { from{transform:rotate(var(--rs,0deg))} to{transform:rotate(var(--re,360deg))} }
          @keyframes gj-w5t-tw { 0%,100%{opacity:0.35;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.25)} }
          @keyframes gj-w5t-hop { 0%,100%{transform:translateY(0) scaleY(1)} 45%{transform:translateY(-14px) scaleY(1.04)} 55%{transform:translateY(-14px) scaleY(1.04)} }
          @keyframes gj-w5t-wave { 0%,100%{transform:rotate(-18deg)} 50%{transform:rotate(32deg)} }
          @keyframes gj-w5t-msh { 0%,100%{transform:scale(1);opacity:0.30} 45%{transform:scale(0.7);opacity:0.18} 55%{transform:scale(0.7);opacity:0.18} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <SnowRising />
        <BeachLeaving />
        <HorizonSeam />
        <Confetti />
        <Mascots />
        <Banner />
      </div>
    );
  }

  // ─── card ─────────────────────────────────────────────────────────
  function World5TransitionCard() {
    return (
      <div style={{
        position: 'relative', width: 760, padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#9B886F' }}>04 · SCREENS / TRANSITION</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: '#9B886F' }}>Cycle 3.0s · World 5 → World 6</div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: '#5B4636', marginBottom: 4, lineHeight: 1.05 }}>Chuyển cảnh · Bãi biển → Núi tuyết</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#9B886F', marginBottom: 20 }}>Núi tuyết TRỖI LÊN · Bãi biển LƯỚT XUỐNG · Banner POP · Confetti + bông tuyết RƠI · Mascot VẪY</div>

        <div style={{ display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28, alignItems: 'flex-start' }}>
          <div style={{ width: W, height: H, borderRadius: 28, overflow: 'hidden', boxShadow: '0 16px 36px rgba(60,44,24,0.32)' }}>
            <World5Transition />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
            <Phase t="0–18 %" name="Núi tuyết TRỖI LÊN"
                   detail="trời lạnh #DCEBF5→#F4FAFE · mặt trời mờ · dãy núi tuyết #A6B8CC/#8197AE + chóp tuyết · hồ băng #C7E2F2 · nền tuyết #F5FAFF · translateY +60→0 + blur fade" />
            <Phase t="0–18 %" name="Bãi biển lướt xuống"
                   detail="dải cát giữa + biển 2 mép #6FC4DA→#4FA9CF (đồng bộ strip) · translateY 0→+8 · veil trắng fade = 'dissolving'" />
            <Phase t="18–32 %" name="Banner POP IN"
                   detail="surface trắng→xanh nhạt · bo 28 · viền #D2E2F0 · 'Núi tuyết' Fredoka 22 #5B4636 · bông tuyết + thông 2 góc · spring" />
            <Phase t="22 %+" name="Confetti + bông tuyết + Mascot"
                   detail="28 mảnh confetti + 10 bông tuyết translateY 0→880 + sway + spin · mascot xanh dương vẫy + hồng hop lệch pha 280ms" />
            <Phase t="30 %+" name="Sparkle băng + bụi cát"
                   detail="3 lớp streaks scroll dọc · lấp lánh băng #EAF6FF twinkle · hạt cát vàng" />
            <Phase t="95–100 %" name="Reset" detail="banner scale-out, núi tuyết slide back, confetti loop, bãi biển về vị trí" />

            <div style={{ height: 8 }} />
            <Note num="●" name="Palette World 6"
                  detail="trời #DCEBF5→#F4FAFE · núi #A6B8CC/#8197AE · băng #C7E2F2 · tuyết #F5FAFF · thông #5F8A6E · accent #5C7C9E · CTA cam giữ nguyên" />
            <Note num="●" name="Đồng bộ cutscene"
                  detail="cùng choreography & cycle 3.0s với W1→W2 … W4→W5 (new-world-in → old-world-out) để loạt transition nhất quán" />
          </div>
        </div>
      </div>
    );
  }
  function Phase({ t, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 64, padding: '3px 8px', borderRadius: 8, background: '#DCE9F4', color: '#5C7C9E', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, textAlign: 'center', lineHeight: 1.2, border: '1.5px solid #BcD2E4' }}>{t}</div>
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
        <div style={{ width: 24, height: 24, borderRadius: 999, background: '#7E9CC2', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1, boxShadow: '0 2px 0 #5C7C9E' }}>{num}</div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12, color: '#5B4636' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: '#9B886F', marginTop: 2 }}>{detail}</div>
        </div>
      </div>
    );
  }

  window.GJWorld5Transition = World5Transition;
  window.GJWorld5TransitionCard = World5TransitionCard;
})();
