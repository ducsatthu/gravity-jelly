/* world2-transition.jsx — Khung chuyển cảnh World 2 → World 3.
   ---------------------------------------------------------------------
   Cycle 3.0s. Cùng choreography đã duyệt ở cutscene W1→W2:
     0–18 %  Sông & Thác TRỖI LÊN nửa trên (translateY +60→0, blur fade)
             + Rừng rậm LƯỚT XUỐNG nửa dưới (translateY 0→+8)
     18–32 % Banner POP IN giữa (scale 0.55→1.08→1, spring)
     22 %+   Confetti RƠI từ trên xuống (lệch pha) + Mascot vẫy + hop
     30 %+   Motion-blur streaks scroll dọc · sương + giọt nước lấp lánh
     95–100% Reset

   Nửa trên World 3 Sông & Thác: trời #D6EEF1→#B4E0EA, thác nước xanh
   ngọc hai bên, suối/hồ, đá cuội, lau sậy, giọt nước lấp lánh, sương.
   Nửa dưới World 2 Rừng rậm trôi đi (thông + cây tán tròn + motion blur).
   Banner "THẾ GIỚI 3 — Sông & Thác" (Fredoka 22 #5B4636).
   Exposes window.GJWorld2Transition + window.GJWorld2TransitionCard.    */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const W = 360;
  const H = 800;
  const BANNER_Y = 400;
  const CYCLE = '3000ms';

  // ─── new world rising (top) — Sông & Thác ─────────────────────────
  function RiverRising() {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w2t-in ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="w2t-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#B4E0EA" />
              <stop offset="0.32" stopColor="#C6E6EC" />
              <stop offset="0.7"  stopColor="#D6EEF1" />
              <stop offset="1"    stopColor="#DCEFEC" />
            </linearGradient>
            <radialGradient id="w2t-spot" cx="0.5" cy="0.55" r="0.55">
              <stop offset="0"    stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="0.6"  stopColor="#EAF7F9" stopOpacity="0.18" />
              <stop offset="1"    stopColor="#EAF7F9" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="w2t-fall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"   stopColor="#CFEFF3" />
              <stop offset="0.5" stopColor="#9FD9E2" />
              <stop offset="1"   stopColor="#7FC6D3" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#w2t-sky)" />
          <rect x="0" y="150" width={W} height="270" fill="url(#w2t-spot)" />

          {/* cliffs + waterfalls both sides */}
          <Cliff x={0}   y={120} w={92}  flip={false} />
          <Cliff x={268} y={120} w={92}  flip={true} />
          <Waterfall x={58}  topY={150} botY={392} w={26} />
          <Waterfall x={302} topY={150} botY={392} w={26} />

          {/* teal pool at the base */}
          <ellipse cx="180" cy="392" rx="220" ry="46" fill="#8FD0DB" opacity="0.9" />
          <ellipse cx="120" cy="384" rx="120" ry="26" fill="#A6DCE5" opacity="0.8" />
          <ellipse cx="250" cy="388" rx="120" ry="24" fill="#A6DCE5" opacity="0.7" />
          {/* ripples */}
          {[366, 380, 394].map((y, i) => (
            <path key={i} d={`M 40 ${y} q 70 -10 140 0 t 140 0`} fill="none"
                  stroke="#FFFFFF" strokeWidth="2" opacity={0.5 - i * 0.1} />
          ))}

          {/* cobbles */}
          <Cobble x={120} y={360} r={15} />
          <Cobble x={210} y={372} r={18} />
          <Cobble x={170} y={356} r={12} />
          <Cobble x={250} y={360} r={13} />

          {/* reeds */}
          <Reed x={96}  y={360} s={28} />
          <Reed x={140} y={350} s={24} />
          <Reed x={232} y={356} s={26} />
          <Reed x={276} y={362} s={24} />

          {/* sparkle water drops rising */}
          {[[80,150,'#FFFFFF'],[150,120,'#EAF7F9'],[210,150,'#FFFFFF'],
            [290,118,'#EAF7F9'],[180,200,'#FFFFFF'],[330,210,'#FFFFFF'],
            [50,250,'#EAF7F9'],[300,300,'#EAF7F9']].map(([x,y,c],i)=>(
            <path key={i} d={`M ${x} ${y-5} L ${x+1.8} ${y} L ${x} ${y+5} L ${x-1.8} ${y} Z`}
                  fill={c} opacity="0.92" />
          ))}
        </svg>

        {/* MIST drifting */}
        <Mist x={120} y={220} w={170} delay="0s"   dir={1} />
        <Mist x={280} y={258} w={180} delay="0.8s" dir={-1} />
        <Mist x={ 70} y={308} w={150} delay="1.4s" dir={1} />
      </div>
    );
  }

  function Cliff({ x, y, w, flip }) {
    const dir = flip ? -1 : 1;
    const x0 = flip ? x + w : x;
    return (
      <g>
        <path d={`M ${x0} ${y} L ${x0 + dir*w} ${y + 10} L ${x0 + dir*w} 420 L ${x0} 420 Z`}
              fill="#A8C2A6" />
        <path d={`M ${x0 + dir*w} ${y + 10} q ${dir*8} 30 ${dir*2} 60 q ${-dir*6} 28 ${dir*4} 56`}
              fill="none" stroke="#8FAE8E" strokeWidth="2" opacity="0.6" />
        {/* mossy top */}
        <ellipse cx={x0 + dir*w*0.5} cy={y + 8} rx={w*0.5} ry="10" fill="#6FA86F" />
        <ellipse cx={x0 + dir*w*0.5} cy={y + 4} rx={w*0.4} ry="8" fill="#5F9C66" />
      </g>
    );
  }
  function Waterfall({ x, topY, botY, w = 24 }) {
    return (
      <g>
        <rect x={x - w/2} y={topY} width={w} height={botY - topY} rx={w*0.3} fill="url(#w2t-fall)" />
        {/* falling streaks */}
        {[-0.28, 0, 0.28].map((o, i) => (
          <line key={i} x1={x + o*w} y1={topY + 6} x2={x + o*w} y2={botY - 8}
                stroke="#FFFFFF" strokeWidth="2" opacity="0.5"
                style={{ animation: `gj-w2t-fall-anim 700ms linear infinite`, animationDelay: `${i*120}ms` }} />
        ))}
        {/* foam at top + bottom */}
        <ellipse cx={x} cy={topY} rx={w*0.7} ry="6" fill="#FFFFFF" opacity="0.85" />
        <ellipse cx={x} cy={botY} rx={w*0.9} ry="8" fill="#FFFFFF" opacity="0.8" />
        <ellipse cx={x} cy={botY+2} rx={w*1.2} ry="5" fill="#FFFFFF" opacity="0.5" />
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
  function Mist({ x, y, w, delay, dir = 1 }) {
    return (
      <div style={{
        position: 'absolute', left: x - w / 2, top: y, width: w, height: 18, pointerEvents: 'none',
        animation: `gj-w2t-mist-${dir > 0 ? 'r' : 'l'} 4400ms ease-in-out infinite`, animationDelay: delay,
      }}>
        <svg width={w} height="18" viewBox={`0 0 ${w} 18`}>
          <ellipse cx={w * 0.30} cy="9" rx={w * 0.28} ry="8" fill="#FFFFFF" opacity="0.55" />
          <ellipse cx={w * 0.55} cy="8" rx={w * 0.30} ry="8" fill="#FFFFFF" opacity="0.50" />
          <ellipse cx={w * 0.78} cy="9" rx={w * 0.22} ry="7" fill="#FFFFFF" opacity="0.45" />
        </svg>
      </div>
    );
  }

  // ─── old world leaving (bottom) — Rừng rậm ───────────────────────
  function ForestLeaving() {
    return (
      <div style={{
        position: 'absolute', top: 380, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w2t-out ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <defs>
            <linearGradient id="w2t-forest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#CFE6CE" />
              <stop offset="0.55" stopColor="#C2DDBC" />
              <stop offset="1"    stopColor="#B2D3AC" />
            </linearGradient>
            <linearGradient id="w2t-veil" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0"    stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="1"    stopColor="#FFFFFF" stopOpacity="0"    />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#w2t-forest)" />
          <ellipse cx="40"  cy="80"  rx="160" ry="40" fill="#A8CFA2" />
          <ellipse cx="320" cy="100" rx="160" ry="42" fill="#9CC79B" />
          <ellipse cx="180" cy="160" rx="220" ry="58" fill="#A2CB9E" />
          <ellipse cx="60"  cy="250" rx="160" ry="46" fill="#8FBE8C" />
          <ellipse cx="300" cy="270" rx="170" ry="48" fill="#86B586" />
          <ellipse cx="180" cy="350" rx="240" ry="62" fill="#8FBE8C" />
          <rect x="0" y="400" width={W} height="20" fill="#79AC79" />

          {/* pines + round trees (squashed slightly — whoosh) */}
          <g transform="scale(1,0.9)">
            <Pine x={26}  y={150} h={56} canopy="#356E40" />
            <Pine x={64}  y={130} h={44} canopy="#3F7D49" />
            <Pine x={300} y={150} h={54} canopy="#2E6238" />
            <Pine x={336} y={132} h={46} canopy="#3F7D49" />
            <Pine x={24}  y={330} h={64} canopy="#2E6238" />
            <Pine x={338} y={344} h={62} canopy="#356E40" />
            <RoundTree x={92}  y={300} h={40} canopy="#5F9C66" />
            <RoundTree x={280} y={320} h={42} canopy="#6FA86F" />
          </g>

          <rect x="0" y="0" width={W} height="160" fill="url(#w2t-veil)" />
        </svg>

        {/* MOTION-BLUR streaks scrolling down */}
        <StreakLayer streaks={[[12,60],[78,50],[162,60],[198,90],[296,60],[344,50],[56,70]]}
                     color="rgba(255,255,255,0.5)" speed="1100ms" />
        <StreakLayer streaks={[[36,80],[120,70],[232,50],[268,70],[322,80],[232,60]]}
                     color="rgba(149,210,165,0.5)" speed="1400ms" delay="200ms" />
        <StreakLayer streaks={[[50,70],[180,90],[260,60],[310,70],[90,80]]}
                     color="rgba(214,238,241,0.5)" speed="900ms" delay="400ms" />
      </div>
    );
  }

  function StreakLayer({ streaks, color, speed = '1100ms', delay = '0ms' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        animation: `gj-w2t-scroll ${speed} linear infinite`, animationDelay: delay,
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

  function Pine({ x, y, h, canopy, trunk = '#6D4C32' }) {
    const w = h * 0.66;
    return (
      <g style={{ filter: 'drop-shadow(0 2px 1.5px rgba(50,60,40,0.30))' }}>
        <rect x={x - 2.5} y={y} width="5" height={h * 0.35} rx="1.5" fill={trunk} />
        <path d={`M ${x - w} ${y} L ${x + w} ${y} L ${x} ${y - h * 0.55} Z`} fill={canopy} />
        <path d={`M ${x - w * 0.82} ${y - h * 0.32} L ${x + w * 0.82} ${y - h * 0.32} L ${x} ${y - h * 0.78} Z`} fill={canopy} />
        <path d={`M ${x - w * 0.62} ${y - h * 0.6} L ${x + w * 0.62} ${y - h * 0.6} L ${x} ${y - h * 1.02} Z`} fill={canopy} />
      </g>
    );
  }
  function RoundTree({ x, y, h = 40, canopy = '#5F9C66', trunk = '#6D4C32' }) {
    const r = h * 0.6;
    return (
      <g>
        <rect x={x - 3} y={y} width="6" height={h * 0.5} rx="3" fill={trunk} />
        <ellipse cx={x - r * 0.5} cy={y - r * 0.2} rx={r * 0.72} ry={r * 0.66} fill={canopy} opacity="0.95" />
        <ellipse cx={x + r * 0.5} cy={y - r * 0.3} rx={r * 0.72} ry={r * 0.66} fill={canopy} opacity="0.95" />
        <ellipse cx={x} cy={y - r * 0.74} rx={r} ry={r * 0.82} fill={canopy} />
      </g>
    );
  }

  // ─── horizon seam ─────────────────────────────────────────────────
  function HorizonSeam() {
    return (
      <div aria-hidden="true" style={{
        position: 'absolute', top: 360, left: 0, right: 0, height: 60, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(207,230,206,0) 0%, rgba(234,247,249,0.62) 40%, rgba(255,255,255,0.62) 50%, rgba(178,211,172,0) 100%)',
        boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.6), inset 0 -1.5px 0 rgba(255,255,255,0.4)',
        animation: 'gj-w2t-seam 2000ms ease-in-out infinite',
      }} />
    );
  }

  // ─── confetti + sparkles ─────────────────────────────────────────
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
            <div key={i} style={{ position: 'absolute', left: x, top: -20, animation: `gj-w2t-fall-c ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
              <div style={{ animation: `gj-w2t-sway 1400ms ease-in-out infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%' }}>
                <div style={{ animation: `gj-w2t-spin ${dur}ms linear infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%', ['--rs']: `${rotStart}deg`, ['--re']: `${rotEnd}deg` }}>
                  {shape}
                </div>
              </div>
            </div>
          );
        })}

        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
          {[[56,350,12,0.0],[304,348,11,0.5],[44,460,10,1.0],[316,460,12,0.3],
            [36,410,9,1.4],[324,410,9,0.8],[80,348,8,1.2],[280,460,8,0.6]].map(([x,y,s,d],i)=>(
            <g key={i} style={{ animation: 'gj-w2t-tw 1800ms ease-in-out infinite', animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}>
              <path d={`M ${x} ${y-s} L ${x+s*0.28} ${y-s*0.28} L ${x+s} ${y} L ${x+s*0.28} ${y+s*0.28} L ${x} ${y+s} L ${x-s*0.28} ${y+s*0.28} L ${x-s} ${y} L ${x-s*0.28} ${y-s*0.28} Z`} fill="#FFFFFF" />
              <circle cx={x} cy={y} r={s*0.18} fill="#EAF7F9" />
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
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F4FBFC 100%)', border: '1.5px solid #CFE6EC',
        borderRadius: 28,
        boxShadow: '0 18px 36px rgba(50,110,130,0.28), 0 6px 12px rgba(60,90,95,0.14), inset 0 2px 0 rgba(255,255,255,0.85)',
        textAlign: 'center', zIndex: 5,
        animation: `gj-w2t-pop ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`, transformOrigin: '50% 60%',
      }}>
        {/* water-drop flourishes */}
        <svg width="20" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 12, left: 16 }}>
          <path d="M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z" fill="#9FD9E2" stroke="#3E94A8" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <svg width="20" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 12, right: 16, transform: 'scaleX(-1)' }}>
          <path d="M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z" fill="#9FD9E2" stroke="#3E94A8" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>

        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#9B886F', marginBottom: 4 }}>CHÀO MỪNG ĐẾN</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#2C7C8E', marginBottom: 4 }}>THẾ GIỚI 3</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#5B4636', lineHeight: 1.05 }}>Sông &amp; Thác</div>
        <div style={{ margin: '8px auto 0', width: 84, height: 4, borderRadius: 999, background: 'linear-gradient(90deg, #FFCA66 0%, #FF9F68 100%)', boxShadow: '0 2px 4px rgba(200,150,40,0.30)' }} />
      </div>
    );
  }

  // ─── mascots ──────────────────────────────────────────────────────
  function Mascots() {
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', left: 56, top: BANNER_Y + 78, zIndex: 6, animation: 'gj-w2t-hop 800ms ease-in-out infinite', filter: 'drop-shadow(0 6px 6px rgba(120,92,52,0.32))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="pink" size={62} direction="up" expression="happy" />
            <div style={{
              position: 'absolute', left: 56, top: -4, width: 22, height: 16, borderRadius: 9,
              background: 'var(--color-block-pink)', border: '2.5px solid var(--color-block-pink-edge)',
              boxShadow: 'inset 0 2px 0 var(--color-block-pink-shine)', transformOrigin: '0% 70%',
              animation: 'gj-w2t-wave 520ms ease-in-out infinite',
            }} />
            <div style={{ position: 'absolute', left: 6, top: 64, width: 50, height: 8, borderRadius: '50%', background: 'rgba(120,92,52,0.25)', filter: 'blur(2px)', animation: 'gj-w2t-msh 800ms ease-in-out infinite' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', right: 56, top: BANNER_Y + 86, zIndex: 6, animation: 'gj-w2t-hop 800ms ease-in-out infinite', animationDelay: '280ms', filter: 'drop-shadow(0 5px 5px rgba(120,92,52,0.28))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="blue" size={52} direction="up" expression="happy" />
            <div style={{ position: 'absolute', left: 2, top: 54, width: 44, height: 7, borderRadius: '50%', background: 'rgba(120,92,52,0.22)', filter: 'blur(2px)', animation: 'gj-w2t-msh 800ms ease-in-out infinite', animationDelay: '280ms' }} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ─── frame ────────────────────────────────────────────────────────
  function World2Transition() {
    return (
      <div style={{
        position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-w2t-in { 0%{transform:translateY(60px);filter:blur(4px);opacity:0.7} 18%{transform:translateY(0);filter:blur(0);opacity:1} 95%{transform:translateY(0);filter:blur(0);opacity:1} 100%{transform:translateY(60px);filter:blur(4px);opacity:0.7} }
          @keyframes gj-w2t-out { 0%{transform:translateY(0);opacity:1} 18%{transform:translateY(8px);opacity:0.96} 95%{transform:translateY(28px);opacity:0.92} 100%{transform:translateY(0);opacity:1} }
          @keyframes gj-w2t-scroll { from{transform:translateY(-180px)} to{transform:translateY(180px)} }
          @keyframes gj-w2t-seam { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes gj-w2t-mist-r { 0%,100%{transform:translateX(-18px);opacity:0.4} 50%{transform:translateX(18px);opacity:0.9} }
          @keyframes gj-w2t-mist-l { 0%,100%{transform:translateX(18px);opacity:0.4} 50%{transform:translateX(-18px);opacity:0.9} }
          @keyframes gj-w2t-fall-anim { from{transform:translateY(-12px);opacity:0.2} 50%{opacity:0.6} to{transform:translateY(12px);opacity:0.2} }
          @keyframes gj-w2t-pop { 0%{transform:translate(-50%,24px) scale(0.55);opacity:0} 18%{transform:translate(-50%,24px) scale(0.55);opacity:0} 28%{transform:translate(-50%,-4px) scale(1.08);opacity:1} 36%{transform:translate(-50%,0) scale(1);opacity:1} 90%{transform:translate(-50%,0) scale(1);opacity:1} 96%{transform:translate(-50%,4px) scale(0.95);opacity:0} 100%{transform:translate(-50%,24px) scale(0.55);opacity:0} }
          @keyframes gj-w2t-fall-c { 0%{transform:translateY(0)} 100%{transform:translateY(880px)} }
          @keyframes gj-w2t-sway { 0%,100%{transform:translateX(-10px)} 50%{transform:translateX(10px)} }
          @keyframes gj-w2t-spin { from{transform:rotate(var(--rs,0deg))} to{transform:rotate(var(--re,360deg))} }
          @keyframes gj-w2t-tw { 0%,100%{opacity:0.35;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.25)} }
          @keyframes gj-w2t-hop { 0%,100%{transform:translateY(0) scaleY(1)} 45%{transform:translateY(-14px) scaleY(1.04)} 55%{transform:translateY(-14px) scaleY(1.04)} }
          @keyframes gj-w2t-wave { 0%,100%{transform:rotate(-18deg)} 50%{transform:rotate(32deg)} }
          @keyframes gj-w2t-msh { 0%,100%{transform:scale(1);opacity:0.30} 45%{transform:scale(0.7);opacity:0.18} 55%{transform:scale(0.7);opacity:0.18} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <RiverRising />
        <ForestLeaving />
        <HorizonSeam />
        <Confetti />
        <Mascots />
        <Banner />
      </div>
    );
  }

  // ─── card ─────────────────────────────────────────────────────────
  function World2TransitionCard() {
    return (
      <div style={{
        position: 'relative', width: 760, padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#9B886F' }}>04 · SCREENS / TRANSITION</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: '#9B886F' }}>Cycle 3.0s · World 2 → World 3</div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: '#5B4636', marginBottom: 4, lineHeight: 1.05 }}>Chuyển cảnh · Rừng rậm → Sông &amp; Thác</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#9B886F', marginBottom: 20 }}>Thác nước TRỖI LÊN · Rừng LƯỚT XUỐNG · Banner POP · Confetti RƠI · Mascot VẪY</div>

        <div style={{ display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28, alignItems: 'flex-start' }}>
          <div style={{ width: W, height: H, borderRadius: 28, overflow: 'hidden', boxShadow: '0 16px 36px rgba(60,44,24,0.32)' }}>
            <World2Transition />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
            <Phase t="0–18 %" name="Sông & Thác TRỖI LÊN"
                   detail="trời #D6EEF1→#B4E0EA · 2 thác nước xanh ngọc + vách rêu · hồ teal + gợn sóng · đá cuội, lau sậy · translateY +60→0 + blur fade" />
            <Phase t="0–18 %" name="Rừng rậm lướt xuống"
                   detail="thông + cây tán tròn (squash whoosh) · translateY 0→+8 · veil trắng fade lên = 'dissolving'" />
            <Phase t="18–32 %" name="Banner POP IN"
                   detail="surface trắng→xanh nhạt · bo 28 · viền #CFE6EC · 'Sông & Thác' Fredoka 22 #5B4636 · giọt nước 2 góc · spring" />
            <Phase t="22 %+" name="Confetti RƠI + Mascot"
                   detail="28 mảnh translateY 0→880 + sway + spin · mascot pink vẫy + mint→blue hop lệch pha 280ms" />
            <Phase t="30 %+" name="Motion-blur + sương + giọt nước"
                   detail="3 lớp streaks scroll dọc · mist drift ngang · thác có streak trắng rơi 700ms · sparkle nước twinkle" />
            <Phase t="95–100 %" name="Reset" detail="banner scale-out, river slide back, confetti loop, forest về vị trí" />

            <div style={{ height: 8 }} />
            <Note num="●" name="Palette World 3"
                  detail="thác/nước #7FC6D3→#CFEFF3 · trời #D6EEF1→#B4E0EA · vách rêu xanh · accent giọt nước trắng/#EAF7F9" />
            <Note num="●" name="Đồng bộ cutscene"
                  detail="cùng choreography & cycle 3.0s với W1→W2 (forest-in→river-in, meadow-out→forest-out) để loạt transition nhất quán" />
          </div>
        </div>
      </div>
    );
  }
  function Phase({ t, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 64, padding: '3px 8px', borderRadius: 8, background: '#CFEAF0', color: '#2C7C8E', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, textAlign: 'center', lineHeight: 1.2, border: '1.5px solid #8FC9D6' }}>{t}</div>
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
        <div style={{ width: 24, height: 24, borderRadius: 999, background: '#5FB7C9', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1, boxShadow: '0 2px 0 #3E94A8' }}>{num}</div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12, color: '#5B4636' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: '#9B886F', marginTop: 2 }}>{detail}</div>
        </div>
      </div>
    );
  }

  window.GJWorld2Transition = World2Transition;
  window.GJWorld2TransitionCard = World2TransitionCard;
})();
