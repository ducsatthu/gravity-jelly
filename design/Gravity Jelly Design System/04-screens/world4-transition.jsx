/* world4-transition.jsx — Khung chuyển cảnh World 4 → World 5.
   ---------------------------------------------------------------------
   Cycle 3.0s. Cùng choreography đã duyệt (W1→W2, W2→W3, W3→W4):
     0–18 %  Bãi biển TRỖI LÊN nửa trên (translateY +60→0, blur fade)
             + Hẻm Sa mạc LƯỚT XUỐNG nửa dưới (translateY 0→+8)
     18–32 % Banner POP IN giữa (scale spring)
     22 %+   Confetti RƠI (lệch pha) + 2 Mascot vẫy + hop
     30 %+   Motion-blur streaks dọc · bụi cát + lấp lánh
     95–100% Reset

   Nửa trên World 5 Bãi biển: trời #9FD8EC→#CDEFF7, mặt trời, biển xanh
   #6FC4DA→#4FA9CF + sóng bọt, bãi cát vàng, cây cọ, bóng biển + sao biển
   + vỏ sò, lấp lánh bay.
   Nửa dưới World 4: hẻm vách sa thạch 2 bên + đường cát giữa (đồng bộ strip)
   đang trôi đi + motion blur + bụi cát.
   Banner "THẾ GIỚI 5 — BÃI BIỂN" (Fredoka 22 #5B4636).
   Exposes window.GJWorld4Transition + window.GJWorld4TransitionCard.       */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const W = 360;
  const H = 800;
  const BANNER_Y = 400;
  const CYCLE = '3000ms';

  // ─── new world rising (top) — Bãi biển ────────────────────────────
  function BeachRising() {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w4t-in ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="w4t-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#9FD8EC" />
              <stop offset="0.5"  stopColor="#BCE7F2" />
              <stop offset="1"    stopColor="#D6F1F8" />
            </linearGradient>
            <radialGradient id="w4t-sun" cx="0.78" cy="0.26" r="0.4">
              <stop offset="0"   stopColor="#FFFBE6" stopOpacity="0.95" />
              <stop offset="0.5" stopColor="#FFF0B8" stopOpacity="0.42" />
              <stop offset="1"   stopColor="#FFF0B8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="w4t-sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6FC4DA" />
              <stop offset="1" stopColor="#4FA9CF" />
            </linearGradient>
            <linearGradient id="w4t-sand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F6E4BC" />
              <stop offset="1" stopColor="#EBD29C" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#w4t-sky)" />
          {/* sun */}
          <circle cx="284" cy="92" r="34" fill="#FFF3C2" opacity="0.9" />
          <circle cx="284" cy="92" r="23" fill="#FFE9A6" />
          <rect x="0" y="0" width={W} height="420" fill="url(#w4t-sun)" />

          {/* sea band (horizon) */}
          <rect x="0" y="214" width={W} height="92" fill="url(#w4t-sea)" />
          {[232, 256, 280].map((y, i) => (
            <path key={i} d={`M 0 ${y} q 30 -7 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`}
                  fill="none" stroke="#FFFFFF" strokeWidth="2" opacity={0.5 - i * 0.1} strokeLinecap="round" />
          ))}

          {/* beach sand foreground */}
          <path d="M0 300 q 90 18 180 6 t 180 12 L360 420 L0 420 Z" fill="url(#w4t-sand)" />
          {/* foam line (sea ↔ sand) */}
          <path d="M0 304 q 90 18 180 6 t 180 12" fill="none" stroke="#FFFFFF" strokeWidth="3.5" opacity="0.75" strokeLinecap="round" />
          <path d="M0 312 q 90 16 180 6 t 180 11" fill="none" stroke="#CFEAF2" strokeWidth="2" opacity="0.6" strokeLinecap="round" />

          {/* palm trees (side view) */}
          <PalmSide x={58}  y={360} h={70} />
          <PalmSide x={312} y={348} h={60} />

          {/* beach props */}
          <BeachBall x={182} y={388} r={16} />
          <Starfish x={120} y={398} r={13} />
          <Shell x={250} y={400} />
          <Shell x={86}  y={404} />

          {/* sea sparkles + sand sparkles */}
          {[[60,238],[150,262],[210,246],[300,266],[110,232],[256,258]].map(([x,y],i)=>(
            <circle key={`sp${i}`} cx={x} cy={y} r="1.6" fill="#FFFFFF" opacity="0.8" />
          ))}
          {[[40,360],[330,380],[160,406],[290,372]].map(([x,y],i)=>(
            <circle key={`sa${i}`} cx={x} cy={y} r="1.4" fill="#FFF6D6" opacity="0.8" />
          ))}
        </svg>
      </div>
    );
  }

  function PalmSide({ x, y, h = 60 }) {
    const fronds = [-54, -26, 0, 26, 54];
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.22))' }}>
        <path d={`M ${x - 3} ${y} Q ${x + 8} ${y - h * 0.5} ${x - 2} ${y - h}`}
              fill="none" stroke="#B98A56" strokeWidth="6" strokeLinecap="round" />
        {fronds.map((a, i) => {
          const rad = ((a - 90) * Math.PI) / 180;
          const ex = x - 2 + Math.cos(rad) * 34;
          const ey = y - h + Math.sin(rad) * 34 + 10;
          return (
            <path key={i} d={`M ${x - 2} ${y - h} Q ${(x - 2 + ex) / 2 + (a > 0 ? 8 : -8)} ${(y - h + ey) / 2 - 10} ${ex} ${ey}`}
                  fill="none" stroke={i % 2 ? '#57A86A' : '#67B87A'} strokeWidth="5" strokeLinecap="round" />
          );
        })}
        <circle cx={x - 2} cy={y - h} r="4" fill="#C98A4E" />
        <circle cx={x + 4} cy={y - h + 5} r="3" fill="#B97A3E" />
      </g>
    );
  }
  function BeachBall({ x, y, r = 16 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 3px rgba(120,100,40,0.24))' }}>
        <circle cx={x} cy={y} r={r} fill="#FFFFFF" stroke="#E8D7B6" strokeWidth="1.5" />
        <path d={`M ${x} ${y - r} A ${r} ${r} 0 0 1 ${x + r * 0.86} ${y + r * 0.5} L ${x} ${y} Z`} fill="#F7A9C0" />
        <path d={`M ${x} ${y - r} A ${r} ${r} 0 0 0 ${x - r * 0.86} ${y + r * 0.5} L ${x} ${y} Z`} fill="#8FB6F2" />
        <path d={`M ${x - r * 0.86} ${y + r * 0.5} A ${r} ${r} 0 0 0 ${x + r * 0.86} ${y + r * 0.5} L ${x} ${y} Z`} fill="#FFE3A3" />
        <circle cx={x - r * 0.3} cy={y - r * 0.32} r={r * 0.22} fill="#FFFFFF" opacity="0.7" />
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
        {[0,1,2,3,4].map(i=>{const a=(-90+i*72)*Math.PI/180;return <circle key={i} cx={x+Math.cos(a)*r*0.4} cy={y+Math.sin(a)*r*0.4} r="1.1" fill="#FFE3A3" />;})}
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

  // ─── old world leaving (bottom) — Sa mạc canyon ───────────────────
  function DesertLeaving() {
    return (
      <div style={{
        position: 'absolute', top: 380, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w4t-out ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <defs>
            <linearGradient id="w4t-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#F6DCA6" />
              <stop offset="0.55" stopColor="#EFCB85" />
              <stop offset="1"    stopColor="#E4C07C" />
            </linearGradient>
            <linearGradient id="w4t-veil" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0"    stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="1"    stopColor="#FFFFFF" stopOpacity="0"    />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#w4t-floor)" />

          {/* sandy road down the middle */}
          <path d="M150 0 L 210 0 L 214 420 L 146 420 Z" fill="#E0C089" />
          <path d="M156 0 L 204 0 L 207 420 L 153 420 Z" fill="#FBEEC9" />
          <line x1="180" y1="0" x2="180" y2="420" stroke="#E6CFA0" strokeWidth="3.5" strokeDasharray="7 11" />

          {/* canyon walls both sides (sandstone) */}
          <SandWall side="l" />
          <SandWall side="r" />

          <rect x="0" y="0" width={W} height="150" fill="url(#w4t-veil)" />
        </svg>

        {/* MOTION-BLUR streaks scrolling down */}
        <StreakLayer streaks={[[30,60],[70,50],[300,60],[336,50],[150,70],[212,60]]}
                     color="rgba(255,255,255,0.5)" speed="1100ms" />
        <StreakLayer streaks={[[48,80],[320,70],[120,50],[244,70],[40,60]]}
                     color="rgba(228,192,124,0.55)" speed="1400ms" delay="200ms" />
        <StreakLayer streaks={[[60,70],[180,90],[290,60],[330,70]]}
                     color="rgba(201,154,88,0.5)" speed="900ms" delay="400ms" />
      </div>
    );
  }

  function SandWall({ side }) {
    // Khớp đoạn cuối level map: vách sa thạch liền khối, mép trong uốn lượn,
    // vân đá ngang + cỏ khô + xương rồng nhỏ rủ — màu #E0C089/#C49A58.
    const isL = side === 'l';
    const outerX = isL ? -20 : W + 20;
    const X = v => (isL ? v : W - v);
    const pts = [[X(64), 0], [X(54), 100], [X(66), 210], [X(52), 320], [X(62), 420]];
    let d = `M ${outerX} 0 L ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1], [x, y] = pts[i];
      d += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    d += `L ${outerX} 420 Z`;
    return (
      <g style={{ filter: 'drop-shadow(0 0 6px rgba(150,110,50,0.18))' }}>
        <path d={d} fill="#E0C089" stroke="#C49A58" strokeWidth="2.5" />
        <path d={d} fill="none" stroke="rgba(150,110,50,0.14)" strokeWidth="11" />
        {/* vân sa thạch ngang */}
        {[40, 100, 160, 220, 280, 340, 400].map((y, i) => (
          <line key={i} x1={outerX} y1={y} x2={X(54)} y2={y + 4}
                stroke="#C49A58" strokeWidth="1.5" opacity="0.3" />
        ))}
        {/* cỏ khô + xương rồng nhỏ trên mép trong */}
        {pts.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
          <g key={`t${i}`} stroke="#C9A86A" strokeWidth="2" strokeLinecap="round" fill="none">
            {[-10, -3, 4, 11].map((a, j) => (
              <path key={j} d={`M ${(isL ? x - 6 : x + 6) + a*0.3} ${y} q ${a*0.6} -11 ${a*0.5} -19`} />
            ))}
          </g>
        ))}
        {[[X(58), 150], [X(56), 360]].map(([x, y], i) => (
          <g key={`c${i}`}>
            <rect x={(isL ? x - 4 : x - 2)} y={y - 18} width="7" height="20" rx="3.5" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.3" />
            <circle cx={isL ? x - 0.5 : x + 1.5} cy={y - 18} r="2.6" fill="#FFCA66" />
          </g>
        ))}
      </g>
    );
  }

  function StreakLayer({ streaks, color, speed = '1100ms', delay = '0ms' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        animation: `gj-w4t-scroll ${speed} linear infinite`, animationDelay: delay,
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
        background: 'linear-gradient(180deg, rgba(214,241,248,0) 0%, rgba(207,234,242,0.6) 42%, rgba(246,228,188,0.6) 56%, rgba(235,210,156,0) 100%)',
        boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1.5px 0 rgba(255,255,255,0.35)',
        animation: 'gj-w4t-seam 2000ms ease-in-out infinite',
      }} />
    );
  }

  // ─── confetti + sparkles ──────────────────────────────────────────
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
            <div key={i} style={{ position: 'absolute', left: x, top: -20, animation: `gj-w4t-fall-c ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
              <div style={{ animation: `gj-w4t-sway 1400ms ease-in-out infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%' }}>
                <div style={{ animation: `gj-w4t-spin ${dur}ms linear infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%', ['--rs']: `${rotStart}deg`, ['--re']: `${rotEnd}deg` }}>
                  {shape}
                </div>
              </div>
            </div>
          );
        })}

        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
          {[[56,350,12,0.0],[304,348,11,0.5],[44,460,10,1.0],[316,460,12,0.3],
            [36,410,9,1.4],[324,410,9,0.8],[80,348,8,1.2],[280,460,8,0.6]].map(([x,y,s,d],i)=>(
            <g key={i} style={{ animation: 'gj-w4t-tw 1800ms ease-in-out infinite', animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}>
              <path d={`M ${x} ${y-s} L ${x+s*0.28} ${y-s*0.28} L ${x+s} ${y} L ${x+s*0.28} ${y+s*0.28} L ${x} ${y+s} L ${x-s*0.28} ${y+s*0.28} L ${x-s} ${y} L ${x-s*0.28} ${y-s*0.28} Z`} fill="#EAFBFF" />
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
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F4FBFD 100%)', border: '1.5px solid #CFE6EC',
        borderRadius: 28,
        boxShadow: '0 18px 36px rgba(60,130,150,0.26), 0 6px 12px rgba(120,92,52,0.14), inset 0 2px 0 rgba(255,255,255,0.85)',
        textAlign: 'center', zIndex: 5,
        animation: `gj-w4t-pop ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`, transformOrigin: '50% 60%',
      }}>
        {/* sun + palm flourishes */}
        <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 12, left: 16 }}>
          <circle cx="12" cy="12" r="5" fill="#FFCA66" stroke="#E0A21F" strokeWidth="1.4" />
          {[0,45,90,135,180,225,270,315].map(a=>{const r=(a*Math.PI)/180;return <line key={a} x1={12+Math.cos(r)*7} y1={12+Math.sin(r)*7} x2={12+Math.cos(r)*9.5} y2={12+Math.sin(r)*9.5} stroke="#E0A21F" strokeWidth="1.6" strokeLinecap="round" />;})}
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 13, right: 15 }}>
          <path d="M12 21 Q 11 14 12 8" fill="none" stroke="#B98A56" strokeWidth="2" strokeLinecap="round" />
          {[-46,-16,16,46].map((a,i)=>(<path key={i} d="M12 8 Q 18 6 24 9" fill="none" stroke={i%2?'#57A86A':'#67B87A'} strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} 12 8)`} />))}
        </svg>

        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#9B886F', marginBottom: 4 }}>CHÀO MỪNG ĐẾN</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#2E84A6', marginBottom: 4 }}>THẾ GIỚI 5</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#5B4636', lineHeight: 1.05 }}>Bãi biển</div>
        <div style={{ margin: '8px auto 0', width: 84, height: 4, borderRadius: 999, background: 'linear-gradient(90deg, #6FC4DA 0%, #2E84A6 100%)', boxShadow: '0 2px 4px rgba(50,110,130,0.30)' }} />
      </div>
    );
  }

  // ─── mascots ──────────────────────────────────────────────────────
  function Mascots() {
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', left: 56, top: BANNER_Y + 78, zIndex: 6, animation: 'gj-w4t-hop 800ms ease-in-out infinite', filter: 'drop-shadow(0 6px 6px rgba(120,92,52,0.32))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="blue" size={62} direction="up" expression="happy" />
            <div style={{
              position: 'absolute', left: 56, top: -4, width: 22, height: 16, borderRadius: 9,
              background: 'var(--color-block-blue)', border: '2.5px solid var(--color-block-blue-edge)',
              boxShadow: 'inset 0 2px 0 var(--color-block-blue-shine)', transformOrigin: '0% 70%',
              animation: 'gj-w4t-wave 520ms ease-in-out infinite',
            }} />
            <div style={{ position: 'absolute', left: 6, top: 64, width: 50, height: 8, borderRadius: '50%', background: 'rgba(120,92,52,0.25)', filter: 'blur(2px)', animation: 'gj-w4t-msh 800ms ease-in-out infinite' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', right: 56, top: BANNER_Y + 86, zIndex: 6, animation: 'gj-w4t-hop 800ms ease-in-out infinite', animationDelay: '280ms', filter: 'drop-shadow(0 5px 5px rgba(120,92,52,0.28))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="mint" size={52} direction="up" expression="happy" />
            <div style={{ position: 'absolute', left: 2, top: 54, width: 44, height: 7, borderRadius: '50%', background: 'rgba(120,92,52,0.22)', filter: 'blur(2px)', animation: 'gj-w4t-msh 800ms ease-in-out infinite', animationDelay: '280ms' }} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ─── frame ────────────────────────────────────────────────────────
  function World4Transition() {
    return (
      <div style={{
        position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-w4t-in { 0%{transform:translateY(60px);filter:blur(4px);opacity:0.7} 18%{transform:translateY(0);filter:blur(0);opacity:1} 95%{transform:translateY(0);filter:blur(0);opacity:1} 100%{transform:translateY(60px);filter:blur(4px);opacity:0.7} }
          @keyframes gj-w4t-out { 0%{transform:translateY(0);opacity:1} 18%{transform:translateY(8px);opacity:0.96} 95%{transform:translateY(28px);opacity:0.92} 100%{transform:translateY(0);opacity:1} }
          @keyframes gj-w4t-scroll { from{transform:translateY(-180px)} to{transform:translateY(180px)} }
          @keyframes gj-w4t-seam { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes gj-w4t-pop { 0%{transform:translate(-50%,24px) scale(0.55);opacity:0} 18%{transform:translate(-50%,24px) scale(0.55);opacity:0} 28%{transform:translate(-50%,-4px) scale(1.08);opacity:1} 36%{transform:translate(-50%,0) scale(1);opacity:1} 90%{transform:translate(-50%,0) scale(1);opacity:1} 96%{transform:translate(-50%,4px) scale(0.95);opacity:0} 100%{transform:translate(-50%,24px) scale(0.55);opacity:0} }
          @keyframes gj-w4t-fall-c { 0%{transform:translateY(0)} 100%{transform:translateY(880px)} }
          @keyframes gj-w4t-sway { 0%,100%{transform:translateX(-10px)} 50%{transform:translateX(10px)} }
          @keyframes gj-w4t-spin { from{transform:rotate(var(--rs,0deg))} to{transform:rotate(var(--re,360deg))} }
          @keyframes gj-w4t-tw { 0%,100%{opacity:0.35;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.25)} }
          @keyframes gj-w4t-hop { 0%,100%{transform:translateY(0) scaleY(1)} 45%{transform:translateY(-14px) scaleY(1.04)} 55%{transform:translateY(-14px) scaleY(1.04)} }
          @keyframes gj-w4t-wave { 0%,100%{transform:rotate(-18deg)} 50%{transform:rotate(32deg)} }
          @keyframes gj-w4t-msh { 0%,100%{transform:scale(1);opacity:0.30} 45%{transform:scale(0.7);opacity:0.18} 55%{transform:scale(0.7);opacity:0.18} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <BeachRising />
        <DesertLeaving />
        <HorizonSeam />
        <Confetti />
        <Mascots />
        <Banner />
      </div>
    );
  }

  // ─── card ─────────────────────────────────────────────────────────
  function World4TransitionCard() {
    return (
      <div style={{
        position: 'relative', width: 760, padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#9B886F' }}>04 · SCREENS / TRANSITION</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: '#9B886F' }}>Cycle 3.0s · World 4 → World 5</div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: '#5B4636', marginBottom: 4, lineHeight: 1.05 }}>Chuyển cảnh · Sa mạc → Bãi biển</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#9B886F', marginBottom: 20 }}>Bãi biển TRỖI LÊN · Hẻm sa mạc LƯỚT XUỐNG · Banner POP · Confetti RƠI · Mascot VẪY</div>

        <div style={{ display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28, alignItems: 'flex-start' }}>
          <div style={{ width: W, height: H, borderRadius: 28, overflow: 'hidden', boxShadow: '0 16px 36px rgba(60,44,24,0.32)' }}>
            <World4Transition />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
            <Phase t="0–18 %" name="Bãi biển TRỖI LÊN"
                   detail="trời #9FD8EC→#CDEFF7 · mặt trời · biển xanh #6FC4DA→#4FA9CF + sóng bọt · bãi cát + cây cọ · translateY +60→0 + blur fade" />
            <Phase t="0–18 %" name="Hẻm Sa mạc lướt xuống"
                   detail="vách sa thạch 2 bên + đường cát giữa (đồng bộ strip) · translateY 0→+8 · veil trắng fade = 'dissolving'" />
            <Phase t="18–32 %" name="Banner POP IN"
                   detail="surface trắng→xanh nhạt · bo 28 · viền #CFE6EC · 'Bãi biển' Fredoka 22 #5B4636 · mặt trời + cọ 2 góc · spring" />
            <Phase t="22 %+" name="Confetti RƠI + Mascot"
                   detail="28 mảnh translateY 0→880 + sway + spin · mascot xanh dương vẫy + bạc hà hop lệch pha 280ms" />
            <Phase t="30 %+" name="Sparkle biển + bụi cát"
                   detail="3 lớp streaks scroll dọc · lấp lánh biển #EAFBFF twinkle · hạt cát vàng" />
            <Phase t="95–100 %" name="Reset" detail="banner scale-out, beach slide back, confetti loop, canyon về vị trí" />

            <div style={{ height: 8 }} />
            <Note num="●" name="Palette World 5"
                  detail="trời #9FD8EC→#CDEFF7 · biển #6FC4DA→#4FA9CF · cát #F6E4BC→#EBD29C · cọ #57A86A · accent xanh #2E84A6 · CTA cam giữ nguyên" />
            <Note num="●" name="Đồng bộ cutscene"
                  detail="cùng choreography & cycle 3.0s với W1→W2, W2→W3, W3→W4 (new-world-in → old-world-out) để loạt transition nhất quán" />
          </div>
        </div>
      </div>
    );
  }
  function Phase({ t, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 64, padding: '3px 8px', borderRadius: 8, background: '#D5EEF4', color: '#2E84A6', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, textAlign: 'center', lineHeight: 1.2, border: '1.5px solid #AcD7E2' }}>{t}</div>
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
        <div style={{ width: 24, height: 24, borderRadius: 999, background: '#5BB4CB', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1, boxShadow: '0 2px 0 #3F9CC4' }}>{num}</div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12, color: '#5B4636' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: '#9B886F', marginTop: 2 }}>{detail}</div>
        </div>
      </div>
    );
  }

  window.GJWorld4Transition = World4Transition;
  window.GJWorld4TransitionCard = World4TransitionCard;
})();
