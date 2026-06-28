/* world3-transition.jsx — Khung chuyển cảnh World 3 → World 4.
   ---------------------------------------------------------------------
   Cycle 3.0s. Cùng choreography đã duyệt (W1→W2, W2→W3):
     0–18 %  Sa mạc TRỖI LÊN nửa trên (translateY +60→0, blur fade)
             + Hẻm Sông&Thác LƯỚT XUỐNG nửa dưới (translateY 0→+8)
     18–32 % Banner POP IN giữa (scale spring)
     22 %+   Confetti RƠI (lệch pha) + 2 Mascot vẫy + hop
     30 %+   Motion-blur streaks dọc · sương + cát bay lấp lánh
     95–100% Reset

   Nửa trên World 4 Sa mạc: trời #FBEBCB→#F4D69D, đụn cát vàng, xương rồng,
   đá tảng, cây cọ khô, mặt trời nóng, hạt cát/lấp lánh bay.
   Nửa dưới World 3: hẻm vách đá 2 bên + sông xanh giữa (đồng bộ strip mới,
   KHÔNG thác) đang trôi đi + motion blur.
   Banner "THẾ GIỚI 4 — SA MẠC" (Fredoka 22 #5B4636).
   Exposes window.GJWorld3Transition + window.GJWorld3TransitionCard.       */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const W = 360;
  const H = 800;
  const BANNER_Y = 400;
  const CYCLE = '3000ms';

  // ─── new world rising (top) — Sa mạc ──────────────────────────────
  function DesertRising() {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w3t-in ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="w3t-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#F4D69D" />
              <stop offset="0.34" stopColor="#F8E1B4" />
              <stop offset="0.72" stopColor="#FBEBCB" />
              <stop offset="1"    stopColor="#FAEFD6" />
            </linearGradient>
            <radialGradient id="w3t-sun" cx="0.74" cy="0.30" r="0.42">
              <stop offset="0"   stopColor="#FFF6D6" stopOpacity="0.95" />
              <stop offset="0.5" stopColor="#FFEDB0" stopOpacity="0.45" />
              <stop offset="1"   stopColor="#FFEDB0" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="w3t-dune" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F0D49A" />
              <stop offset="1" stopColor="#E6C386" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#w3t-sky)" />
          {/* sun */}
          <circle cx="266" cy="118" r="40" fill="#FFF1C4" opacity="0.9" />
          <circle cx="266" cy="118" r="26" fill="#FFE9A6" />
          <rect x="0" y="0" width={W} height="420" fill="url(#w3t-sun)" />

          {/* layered dunes */}
          <path d="M0 250 q 90 -42 180 -8 t 180 -14 L360 420 L0 420 Z" fill="#F0D49A" opacity="0.7" />
          <path d="M0 300 q 100 -40 190 -6 t 170 -16 L360 420 L0 420 Z" fill="url(#w3t-dune)" />
          <path d="M0 356 q 120 -34 200 -2 t 160 -10 L360 420 L0 420 Z" fill="#DCB877" />

          {/* dry palm trees */}
          <DryPalm x={56}  y={300} h={66} />
          <DryPalm x={312} y={290} h={58} />

          {/* cacti */}
          <Cactus x={120} y={350} h={50} />
          <Cactus x={246} y={360} h={42} />

          {/* boulders */}
          <Boulder x={180} y={372} r={22} />
          <Boulder x={88}  y={384} r={15} />
          <Boulder x={290} y={388} r={17} />

          {/* sand sparkles */}
          {[[60,210],[150,150],[210,200],[330,170],[110,250],[260,240],[40,300],[300,320]]
            .map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="1.6" fill="#FFF6D6" opacity="0.85" />
          ))}
        </svg>

        {/* heat-shimmer haze bands */}
        <Haze x={120} y={250} w={170} delay="0s"   dir={1} />
        <Haze x={280} y={300} w={180} delay="0.7s" dir={-1} />
        <Haze x={ 70} y={350} w={150} delay="1.3s" dir={1} />
      </div>
    );
  }

  function DryPalm({ x, y, h = 60 }) {
    const fronds = [-50, -22, 0, 22, 50];
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(150,110,40,0.22))' }}>
        <path d={`M ${x - 3} ${y} Q ${x + 6} ${y - h * 0.5} ${x - 2} ${y - h}`}
              fill="none" stroke="#A9824C" strokeWidth="6" strokeLinecap="round" />
        {fronds.map((a, i) => {
          const rad = ((a - 90) * Math.PI) / 180;
          const ex = x - 2 + Math.cos(rad) * 30;
          const ey = y - h + Math.sin(rad) * 30;
          return (
            <path key={i} d={`M ${x - 2} ${y - h} Q ${(x - 2 + ex) / 2 + (a > 0 ? 6 : -6)} ${(y - h + ey) / 2 - 6} ${ex} ${ey}`}
                  fill="none" stroke="#8FA85E" strokeWidth="4" strokeLinecap="round" />
          );
        })}
      </g>
    );
  }
  function Cactus({ x, y, h = 44 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.22))' }}>
        <rect x={x - 5} y={y - h} width="10" height={h} rx="5" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.5" />
        <rect x={x - 16} y={y - h * 0.66} width="8" height={h * 0.4} rx="4" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.5" />
        <rect x={x - 16} y={y - h * 0.66} width="8" height="8" rx="4" fill="#7FA86A" />
        <rect x={x + 8} y={y - h * 0.78} width="8" height={h * 0.5} rx="4" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.5" />
      </g>
    );
  }
  function Boulder({ x, y, r = 18 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(150,120,60,0.22))' }}>
        <path d={`M ${x - r} ${y + r*0.5} Q ${x - r} ${y - r*0.5} ${x - r*0.3} ${y - r*0.7}
                  Q ${x + r*0.4} ${y - r*0.9} ${x + r} ${y - r*0.2}
                  Q ${x + r*1.05} ${y + r*0.5} ${x} ${y + r*0.6} Z`}
              fill="#D9C49A" stroke="#BBA376" strokeWidth="1.5" />
        <path d={`M ${x - r*0.5} ${y - r*0.3} Q ${x} ${y - r*0.6} ${x + r*0.4} ${y - r*0.3}`}
              fill="none" stroke="#FFF1D6" strokeWidth="1.5" opacity="0.5" />
      </g>
    );
  }
  function Haze({ x, y, w, delay, dir = 1 }) {
    return (
      <div style={{
        position: 'absolute', left: x - w / 2, top: y, width: w, height: 16, pointerEvents: 'none',
        animation: `gj-w3t-haze-${dir > 0 ? 'r' : 'l'} 4200ms ease-in-out infinite`, animationDelay: delay,
      }}>
        <svg width={w} height="16" viewBox={`0 0 ${w} 16`}>
          <ellipse cx={w * 0.30} cy="8" rx={w * 0.28} ry="6" fill="#FFF6D6" opacity="0.4" />
          <ellipse cx={w * 0.58} cy="7" rx={w * 0.30} ry="6" fill="#FFF6D6" opacity="0.34" />
          <ellipse cx={w * 0.80} cy="8" rx={w * 0.22} ry="5" fill="#FFF6D6" opacity="0.3" />
        </svg>
      </div>
    );
  }

  // ─── old world leaving (bottom) — Sông & Thác canyon ──────────────
  function CanyonLeaving() {
    return (
      <div style={{
        position: 'absolute', top: 380, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w3t-out ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <defs>
            <linearGradient id="w3t-river" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#D6EEF1" />
              <stop offset="0.55" stopColor="#C5E7EE" />
              <stop offset="1"    stopColor="#B4E0EA" />
            </linearGradient>
            <linearGradient id="w3t-veil" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0"    stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="1"    stopColor="#FFFFFF" stopOpacity="0"    />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#w3t-river)" />

          {/* river down the middle */}
          <path d="M150 0 Q 130 120 175 240 T 196 420 L 230 420 Q 210 260 235 120 T 220 0 Z"
                fill="#A6DCE5" opacity="0.85" />
          <path d="M170 0 Q 158 140 188 280 T 200 420 L 214 420 Q 198 260 216 120 T 200 0 Z"
                fill="#CFEFF3" opacity="0.7" />
          {[60,150,250,350].map((y,i)=>(
            <path key={i} d={`M 158 ${y} q 24 -8 48 0`} fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
          ))}

          {/* canyon walls both sides (stone) */}
          <CanyonWall side="l" />
          <CanyonWall side="r" />

          <rect x="0" y="0" width={W} height="150" fill="url(#w3t-veil)" />
        </svg>

        {/* MOTION-BLUR streaks scrolling down */}
        <StreakLayer streaks={[[30,60],[70,50],[300,60],[336,50],[150,70],[212,60]]}
                     color="rgba(255,255,255,0.5)" speed="1100ms" />
        <StreakLayer streaks={[[48,80],[320,70],[120,50],[244,70],[40,60]]}
                     color="rgba(166,220,229,0.55)" speed="1400ms" delay="200ms" />
        <StreakLayer streaks={[[60,70],[180,90],[290,60],[330,70]]}
                     color="rgba(201,188,168,0.5)" speed="900ms" delay="400ms" />
      </div>
    );
  }

  function CanyonWall({ side }) {
    // Khớp đoạn cuối level map: vách đá liền khối, mép trong uốn lượn nhẹ,
    // vân đá ngang + rêu + cây leo rủ — màu đá hệ thống #C9BCA8/#A89A82.
    const isL = side === 'l';
    const outerX = isL ? -20 : W + 20;
    const X = v => (isL ? v : W - v);            // map inset → toạ độ theo bên
    // mép trong uốn lượn (3 bend) suốt panel
    const pts = [[X(64), 0], [X(54), 100], [X(66), 210], [X(52), 320], [X(62), 420]];
    let d = `M ${outerX} 0 L ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1], [x, y] = pts[i];
      d += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    d += `L ${outerX} 420 Z`;
    return (
      <g style={{ filter: 'drop-shadow(0 0 6px rgba(90,78,60,0.18))' }}>
        <path d={d} fill="#C9BCA8" stroke="#A89A82" strokeWidth="2.5" />
        <path d={d} fill="none" stroke="rgba(120,108,90,0.14)" strokeWidth="11" />
        {/* vân đá ngang */}
        {[40, 110, 180, 250, 320, 390].map((y, i) => (
          <line key={i} x1={outerX} y1={y} x2={X(54)} y2={y + 4}
                stroke="#A89A82" strokeWidth="1.5" opacity="0.28" />
        ))}
        {/* rêu lốm đốm trên mép trong */}
        {pts.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
          <ellipse key={i} cx={isL ? x - 7 : x + 7} cy={y} rx="13" ry="5" fill="#6FA86F" opacity="0.5" />
        ))}
        {/* cây leo rủ */}
        {[[X(56), 64, 42], [X(58), 250, 50], [X(54), 360, 34]].map(([x, y, len], i) => {
          const dir = isL ? -1 : 1;
          let vd = `M ${x} ${y}`;
          const segs = Math.max(3, Math.round(len / 18));
          let cy = y;
          const leaves = [];
          for (let k = 1; k <= segs; k++) {
            const ny = y + (len / segs) * k;
            const sway = (k % 2 === 0 ? 1 : -1) * 6 * dir;
            vd += ` Q ${x + sway} ${(cy + ny) / 2} ${x} ${ny}`;
            leaves.push([x + sway * 0.7, (cy + ny) / 2, k % 2 ? 26 : -26]);
            cy = ny;
          }
          return (
            <g key={i}>
              <path d={vd} fill="none" stroke="#5F9C66" strokeWidth="2.2" strokeLinecap="round" />
              {leaves.map(([lx, ly, rot], j) => (
                <ellipse key={j} cx={lx} cy={ly} rx="5" ry="2.8" fill="#6FA86F"
                         transform={`rotate(${rot} ${lx} ${ly})`} />
              ))}
              <circle cx={x} cy={y + len} r="3" fill="#7FB37F" />
            </g>
          );
        })}
      </g>
    );
  }

  function StreakLayer({ streaks, color, speed = '1100ms', delay = '0ms' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        animation: `gj-w3t-scroll ${speed} linear infinite`, animationDelay: delay,
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
        background: 'linear-gradient(180deg, rgba(250,239,214,0) 0%, rgba(255,246,214,0.6) 42%, rgba(214,238,241,0.6) 56%, rgba(180,224,234,0) 100%)',
        boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1.5px 0 rgba(255,255,255,0.35)',
        animation: 'gj-w3t-seam 2000ms ease-in-out infinite',
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
            <div key={i} style={{ position: 'absolute', left: x, top: -20, animation: `gj-w3t-fall-c ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
              <div style={{ animation: `gj-w3t-sway 1400ms ease-in-out infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%' }}>
                <div style={{ animation: `gj-w3t-spin ${dur}ms linear infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%', ['--rs']: `${rotStart}deg`, ['--re']: `${rotEnd}deg` }}>
                  {shape}
                </div>
              </div>
            </div>
          );
        })}

        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
          {[[56,350,12,0.0],[304,348,11,0.5],[44,460,10,1.0],[316,460,12,0.3],
            [36,410,9,1.4],[324,410,9,0.8],[80,348,8,1.2],[280,460,8,0.6]].map(([x,y,s,d],i)=>(
            <g key={i} style={{ animation: 'gj-w3t-tw 1800ms ease-in-out infinite', animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}>
              <path d={`M ${x} ${y-s} L ${x+s*0.28} ${y-s*0.28} L ${x+s} ${y} L ${x+s*0.28} ${y+s*0.28} L ${x} ${y+s} L ${x-s*0.28} ${y+s*0.28} L ${x-s} ${y} L ${x-s*0.28} ${y-s*0.28} Z`} fill="#FFF1C4" />
              <circle cx={x} cy={y} r={s*0.18} fill="#FFF6E0" />
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
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FEF7EA 100%)', border: '1.5px solid #F0DEB8',
        borderRadius: 28,
        boxShadow: '0 18px 36px rgba(150,110,40,0.26), 0 6px 12px rgba(120,92,52,0.14), inset 0 2px 0 rgba(255,255,255,0.85)',
        textAlign: 'center', zIndex: 5,
        animation: `gj-w3t-pop ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`, transformOrigin: '50% 60%',
      }}>
        {/* sun flourishes */}
        <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 12, left: 16 }}>
          <circle cx="12" cy="12" r="5" fill="#FFCA66" stroke="#E0A21F" strokeWidth="1.4" />
          {[0,45,90,135,180,225,270,315].map(a=>{const r=(a*Math.PI)/180;return <line key={a} x1={12+Math.cos(r)*7} y1={12+Math.sin(r)*7} x2={12+Math.cos(r)*9.5} y2={12+Math.sin(r)*9.5} stroke="#E0A21F" strokeWidth="1.6" strokeLinecap="round" />;})}
        </svg>
        <svg width="20" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 13, right: 16 }}>
          <rect x="9" y="6" width="6" height="14" rx="3" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.3" />
          <rect x="3" y="10" width="5" height="6" rx="2.5" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.3" />
          <rect x="16" y="9" width="5" height="7" rx="2.5" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.3" />
        </svg>

        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#9B886F', marginBottom: 4 }}>CHÀO MỪNG ĐẾN</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#B9802E', marginBottom: 4 }}>THẾ GIỚI 4</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#5B4636', lineHeight: 1.05 }}>Sa mạc</div>
        <div style={{ margin: '8px auto 0', width: 84, height: 4, borderRadius: 999, background: 'linear-gradient(90deg, #FFCA66 0%, #FF9F68 100%)', boxShadow: '0 2px 4px rgba(200,150,40,0.30)' }} />
      </div>
    );
  }

  // ─── mascots ──────────────────────────────────────────────────────
  function Mascots() {
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', left: 56, top: BANNER_Y + 78, zIndex: 6, animation: 'gj-w3t-hop 800ms ease-in-out infinite', filter: 'drop-shadow(0 6px 6px rgba(120,92,52,0.32))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="yellow" size={62} direction="up" expression="happy" />
            <div style={{
              position: 'absolute', left: 56, top: -4, width: 22, height: 16, borderRadius: 9,
              background: 'var(--color-block-yellow)', border: '2.5px solid var(--color-block-yellow-edge)',
              boxShadow: 'inset 0 2px 0 var(--color-block-yellow-shine)', transformOrigin: '0% 70%',
              animation: 'gj-w3t-wave 520ms ease-in-out infinite',
            }} />
            <div style={{ position: 'absolute', left: 6, top: 64, width: 50, height: 8, borderRadius: '50%', background: 'rgba(120,92,52,0.25)', filter: 'blur(2px)', animation: 'gj-w3t-msh 800ms ease-in-out infinite' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', right: 56, top: BANNER_Y + 86, zIndex: 6, animation: 'gj-w3t-hop 800ms ease-in-out infinite', animationDelay: '280ms', filter: 'drop-shadow(0 5px 5px rgba(120,92,52,0.28))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="pink" size={52} direction="up" expression="happy" />
            <div style={{ position: 'absolute', left: 2, top: 54, width: 44, height: 7, borderRadius: '50%', background: 'rgba(120,92,52,0.22)', filter: 'blur(2px)', animation: 'gj-w3t-msh 800ms ease-in-out infinite', animationDelay: '280ms' }} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ─── frame ────────────────────────────────────────────────────────
  function World3Transition() {
    return (
      <div style={{
        position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-w3t-in { 0%{transform:translateY(60px);filter:blur(4px);opacity:0.7} 18%{transform:translateY(0);filter:blur(0);opacity:1} 95%{transform:translateY(0);filter:blur(0);opacity:1} 100%{transform:translateY(60px);filter:blur(4px);opacity:0.7} }
          @keyframes gj-w3t-out { 0%{transform:translateY(0);opacity:1} 18%{transform:translateY(8px);opacity:0.96} 95%{transform:translateY(28px);opacity:0.92} 100%{transform:translateY(0);opacity:1} }
          @keyframes gj-w3t-scroll { from{transform:translateY(-180px)} to{transform:translateY(180px)} }
          @keyframes gj-w3t-seam { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes gj-w3t-haze-r { 0%,100%{transform:translateX(-16px);opacity:0.4} 50%{transform:translateX(16px);opacity:0.85} }
          @keyframes gj-w3t-haze-l { 0%,100%{transform:translateX(16px);opacity:0.4} 50%{transform:translateX(-16px);opacity:0.85} }
          @keyframes gj-w3t-pop { 0%{transform:translate(-50%,24px) scale(0.55);opacity:0} 18%{transform:translate(-50%,24px) scale(0.55);opacity:0} 28%{transform:translate(-50%,-4px) scale(1.08);opacity:1} 36%{transform:translate(-50%,0) scale(1);opacity:1} 90%{transform:translate(-50%,0) scale(1);opacity:1} 96%{transform:translate(-50%,4px) scale(0.95);opacity:0} 100%{transform:translate(-50%,24px) scale(0.55);opacity:0} }
          @keyframes gj-w3t-fall-c { 0%{transform:translateY(0)} 100%{transform:translateY(880px)} }
          @keyframes gj-w3t-sway { 0%,100%{transform:translateX(-10px)} 50%{transform:translateX(10px)} }
          @keyframes gj-w3t-spin { from{transform:rotate(var(--rs,0deg))} to{transform:rotate(var(--re,360deg))} }
          @keyframes gj-w3t-tw { 0%,100%{opacity:0.35;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.25)} }
          @keyframes gj-w3t-hop { 0%,100%{transform:translateY(0) scaleY(1)} 45%{transform:translateY(-14px) scaleY(1.04)} 55%{transform:translateY(-14px) scaleY(1.04)} }
          @keyframes gj-w3t-wave { 0%,100%{transform:rotate(-18deg)} 50%{transform:rotate(32deg)} }
          @keyframes gj-w3t-msh { 0%,100%{transform:scale(1);opacity:0.30} 45%{transform:scale(0.7);opacity:0.18} 55%{transform:scale(0.7);opacity:0.18} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <DesertRising />
        <CanyonLeaving />
        <HorizonSeam />
        <Confetti />
        <Mascots />
        <Banner />
      </div>
    );
  }

  // ─── card ─────────────────────────────────────────────────────────
  function World3TransitionCard() {
    return (
      <div style={{
        position: 'relative', width: 760, padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#9B886F' }}>04 · SCREENS / TRANSITION</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: '#9B886F' }}>Cycle 3.0s · World 3 → World 4</div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: '#5B4636', marginBottom: 4, lineHeight: 1.05 }}>Chuyển cảnh · Sông &amp; Thác → Sa mạc</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#9B886F', marginBottom: 20 }}>Sa mạc TRỖI LÊN · Hẻm sông LƯỚT XUỐNG · Banner POP · Confetti RƠI · Mascot VẪY</div>

        <div style={{ display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28, alignItems: 'flex-start' }}>
          <div style={{ width: W, height: H, borderRadius: 28, overflow: 'hidden', boxShadow: '0 16px 36px rgba(60,44,24,0.32)' }}>
            <World3Transition />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
            <Phase t="0–18 %" name="Sa mạc TRỖI LÊN"
                   detail="trời #FBEBCB→#F4D69D · mặt trời nóng · đụn cát vàng nhiều lớp · xương rồng, đá tảng, cây cọ khô · translateY +60→0 + blur fade" />
            <Phase t="0–18 %" name="Hẻm Sông & Thác lướt xuống"
                   detail="vách đá 2 bên + sông xanh giữa (đồng bộ strip mới, không thác) · translateY 0→+8 · veil trắng fade = 'dissolving'" />
            <Phase t="18–32 %" name="Banner POP IN"
                   detail="surface trắng→kem · bo 28 · viền #F0DEB8 · 'Sa mạc' Fredoka 22 #5B4636 · mặt trời + xương rồng 2 góc · spring" />
            <Phase t="22 %+" name="Confetti RƠI + Mascot"
                   detail="28 mảnh translateY 0→880 + sway + spin · mascot vàng vẫy + hồng hop lệch pha 280ms" />
            <Phase t="30 %+" name="Heat-shimmer + cát bay"
                   detail="3 lớp streaks scroll dọc · haze sa mạc drift ngang · hạt cát/lấp lánh vàng twinkle" />
            <Phase t="95–100 %" name="Reset" detail="banner scale-out, desert slide back, confetti loop, canyon về vị trí" />

            <div style={{ height: 8 }} />
            <Note num="●" name="Palette World 4"
                  detail="trời/cát #FBEBCB→#F4D69D · đụn #E6C386→#DCB877 · xương rồng #7FA86A · accent nắng #FFF6D6 · CTA cam giữ nguyên" />
            <Note num="●" name="Đồng bộ cutscene"
                  detail="cùng choreography & cycle 3.0s với W1→W2, W2→W3 (new-world-in → old-world-out) để loạt transition nhất quán" />
          </div>
        </div>
      </div>
    );
  }
  function Phase({ t, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 64, padding: '3px 8px', borderRadius: 8, background: '#FBE6BC', color: '#B9802E', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, textAlign: 'center', lineHeight: 1.2, border: '1.5px solid #E8C98C' }}>{t}</div>
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
        <div style={{ width: 24, height: 24, borderRadius: 999, background: '#E8B85C', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1, boxShadow: '0 2px 0 #C8923E' }}>{num}</div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12, color: '#5B4636' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: '#9B886F', marginTop: 2 }}>{detail}</div>
        </div>
      </div>
    );
  }

  window.GJWorld3Transition = World3Transition;
  window.GJWorld3TransitionCard = World3TransitionCard;
})();
