/* world9-transition.jsx — Khung chuyển cảnh World 9 → World 10 (cuối cùng).
   ---------------------------------------------------------------------
   Cycle 3.0s. Cùng choreography đã duyệt (W1→W2 … W8→W9):
     0–18 %  Vũ trụ TRỖI LÊN nửa trên (translateY +60→0, blur fade)
             + Bầu trời LƯỚT XUỐNG nửa dưới (translateY 0→+8)
     18–32 % Banner POP IN giữa (scale spring)
     22 %+   Confetti + SAO/tinh vân BAY LÊN (lệch pha) + 2 Mascot vẫy + hop
     30 %+   Motion-blur streaks dọc · mây bốc lên
     95–100% Reset

   Nửa trên World 10 Vũ trụ (deep space): trời đêm #1C1248→#2E1F6B→#5B4BAE,
   tinh vân tím #C4A7FF/#8A6CF0, hành tinh có vành #8E7CF4/#A99CF6, sao lấp
   lánh, sao băng, dải ngân hà. Trọng tâm = HỐ TRỌNG LỰC tím (signature) hút
   nhẹ — accent gravity #7E6CF0/#6353D6/#A99CF6.
   Nửa dưới World 9 Bầu trời: hành lang trời sáng giữa + bờ mây cumulus 2 mép
   (đồng bộ strip) đang trôi đi + motion blur + mây bay.
   Banner "THẾ GIỚI 10 — Vũ trụ" (Fredoka 22 #5B4ECB).
   Exposes window.GJWorld9Transition + window.GJWorld9TransitionCard.       */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const W = 360;
  const H = 800;
  const BANNER_Y = 400;
  const CYCLE = '3000ms';

  // ─── new world rising (top) — Vũ trụ (deep space) ──────────────────
  function SpaceRising() {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w9t-in ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="w9t-space" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#1C1248" />
              <stop offset="0.5"  stopColor="#2E1F6B" />
              <stop offset="1"    stopColor="#5B4BAE" />
            </linearGradient>
            <radialGradient id="w9t-neb" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0"   stopColor="#C4A7FF" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#8A6CF0" stopOpacity="0.38" />
              <stop offset="1"   stopColor="#6353D6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="w9t-neb2" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0"   stopColor="#7FA6EE" stopOpacity="0.55" />
              <stop offset="1"   stopColor="#7FA6EE" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="w9t-hole" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0"    stopColor="#160C3A" />
              <stop offset="0.55" stopColor="#160C3A" />
              <stop offset="0.72" stopColor="#7E6CF0" />
              <stop offset="0.86" stopColor="#A99CF6" />
              <stop offset="1"    stopColor="#A99CF6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="w9t-planet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9E8CF8" />
              <stop offset="1" stopColor="#6353D6" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#w9t-space)" />

          {/* nebula clouds */}
          <ellipse cx={86} cy={120} rx={140} ry={92} fill="url(#w9t-neb)" />
          <ellipse cx={300} cy={300} rx={120} ry={80} fill="url(#w9t-neb2)" />

          {/* milky-way band sweeping across */}
          <path d="M-20 250 Q 120 180 220 230 T 380 200 L 380 290 Q 220 320 120 270 T -20 320 Z"
                fill="#7A6CCF" opacity="0.14" />

          {/* twinkling stars */}
          {[[40,60,2.0],[120,40,1.4],[180,90,2.2],[230,50,1.5],[300,120,1.8],[70,150,1.4],
            [150,160,1.6],[260,140,1.3],[20,110,1.4],[200,180,1.7],[330,160,1.5],[100,200,1.5],
            [340,70,1.8],[60,260,1.3],[280,210,1.6],[160,300,1.5],[110,330,1.7],[320,330,1.4],
            [44,330,1.5],[220,360,1.6],[300,380,1.4],[130,380,1.3]].map(([x, y, r], i) => (
            <g key={`st${i}`} style={{ animation: 'gj-w9t-tw 2200ms ease-in-out infinite', animationDelay: `${i * 0.18}s`, transformOrigin: `${x}px ${y}px` }}>
              <circle cx={x} cy={y} r={r} fill="#FFFFFF" />
              <circle cx={x} cy={y} r={r * 2.6} fill="#FFFFFF" opacity="0.16" />
            </g>
          ))}

          {/* ringed planet upper-right */}
          <g style={{ filter: 'drop-shadow(0 0 12px rgba(169,156,246,0.55))' }}>
            <circle cx={296} cy={92} r={34} fill="url(#w9t-planet)" stroke="#A99CF6" strokeWidth="2.5" />
            <ellipse cx={296} cy={92} rx={54} ry={15} fill="none" stroke="#C4B5FA" strokeWidth="3.5" opacity="0.85" transform="rotate(-20 296 92)" />
            <ellipse cx={286} cy={82} rx={11} ry={7} fill="#C4B5FA" opacity="0.55" />
            <circle cx={304} cy={100} r={5} fill="#5847BE" opacity="0.6" />
          </g>

          {/* small moon lower-left */}
          <g style={{ filter: 'drop-shadow(0 0 7px rgba(179,199,247,0.5))' }}>
            <circle cx={62} cy={310} r={17} fill="#B3C7F7" stroke="#7E9CE8" strokeWidth="2" />
            <circle cx={56} cy={304} r={4} fill="#9DB4EE" opacity="0.7" />
            <circle cx={68} cy={314} r={3} fill="#9DB4EE" opacity="0.6" />
          </g>

          {/* shooting star */}
          <g style={{ animation: 'gj-w9t-shoot 2600ms ease-in infinite' }}>
            <line x1="150" y1="120" x2="120" y2="138" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="150" y1="120" x2="132" y2="131" stroke="#C4B5FA" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
            <circle cx="150" cy="120" r="2.6" fill="#FFFFFF" />
          </g>

          {/* gravity well — signature mechanic, centre stage */}
          <GravityWell x={184} y={250} />
        </svg>
      </div>
    );
  }

  function GravityWell({ x, y }) {
    return (
      <g>
        <circle cx={x} cy={y} r={52} fill="url(#w9t-hole)" />
        {/* accretion rings spinning */}
        <g style={{ animation: 'gj-w9t-spin 7s linear infinite', transformOrigin: `${x}px ${y}px` }}>
          <ellipse cx={x} cy={y} rx={48} ry={16} fill="none" stroke="#A99CF6" strokeWidth="3" opacity="0.85" transform={`rotate(-16 ${x} ${y})`} />
          <ellipse cx={x} cy={y} rx={62} ry={21} fill="none" stroke="#7E6CF0" strokeWidth="2" opacity="0.55" transform={`rotate(-16 ${x} ${y})`} />
        </g>
        {/* infalling sparks */}
        {[0, 72, 144, 216, 288].map((a, i) => {
          const r = a * Math.PI / 180;
          return <circle key={i} cx={x + Math.cos(r) * 58} cy={y + Math.sin(r) * 20} r="2.4" fill="#FFFFFF" opacity="0.85"
                         style={{ animation: 'gj-w9t-tw 1800ms ease-in-out infinite', animationDelay: `${i * 0.25}s`, transformOrigin: `${x}px ${y}px` }} />;
        })}
        <circle cx={x} cy={y} r={20} fill="#120A30" />
        <circle cx={x - 6} cy={y - 6} r={5} fill="#3A2A7A" opacity="0.7" />
      </g>
    );
  }

  // ─── old world leaving (bottom) — Bầu trời ─────────────────────────
  function SkyLeaving() {
    return (
      <div style={{
        position: 'absolute', top: 380, left: 0, width: W, height: 420, overflow: 'hidden',
        animation: `gj-w9t-out ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`} style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <defs>
            <linearGradient id="w9t-trail" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0"   stopColor="#E4EFFC" />
              <stop offset="0.5" stopColor="#C7DCF7" />
              <stop offset="1"   stopColor="#A6C4F2" />
            </linearGradient>
            <linearGradient id="w9t-bank-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.7" stopColor="#EFF5FF" />
              <stop offset="1" stopColor="#D7E5FB" />
            </linearGradient>
            <linearGradient id="w9t-bank-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.7" stopColor="#EFF5FF" />
              <stop offset="1" stopColor="#D7E5FB" />
            </linearGradient>
            <linearGradient id="w9t-veil" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0"    stopColor="#3A2A7A" stopOpacity="0.32" />
              <stop offset="0.55" stopColor="#3A2A7A" stopOpacity="0.07" />
              <stop offset="1"    stopColor="#3A2A7A" stopOpacity="0"    />
            </linearGradient>
            <radialGradient id="w9t-sun" cx="0.78" cy="0.7" r="0.55">
              <stop offset="0"   stopColor="#FFF7DA" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#FFE08A" stopOpacity="0.32" />
              <stop offset="1"   stopColor="#FFE08A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* bright sky base */}
          <rect x="0" y="0" width={W} height="420" fill="url(#w9t-trail)" />
          <rect x="0" y="0" width={W} height="420" fill="url(#w9t-sun)" />

          {/* cloud banks on both edges (matches strip) */}
          <CloudBank side="l" />
          <CloudBank side="r" />

          {/* bright cloud-bridge corridor down the middle */}
          <path d="M150 0 L 210 0 L 214 420 L 146 420 Z" fill="#FFFFFF" opacity="0.5" />
          <line x1="180" y1="0" x2="180" y2="420" stroke="#9BB8EC" strokeWidth="3.5" strokeDasharray="7 11" />

          {/* warm sun lower-right */}
          <g style={{ filter: 'drop-shadow(0 0 14px rgba(255,224,138,0.5))' }}>
            <circle cx={290} cy={300} r={30} fill="#FFF1C2" stroke="#FFD074" strokeWidth="3" />
            {[0,45,90,135,180,225,270,315].map((a)=>{const r=a*Math.PI/180;return(
              <line key={a} x1={290+Math.cos(r)*38} y1={300+Math.sin(r)*38} x2={290+Math.cos(r)*50} y2={300+Math.sin(r)*50} stroke="#FFD074" strokeWidth="4" strokeLinecap="round" opacity="0.8" />);})}
          </g>

          {/* rainbow + clouds on the trail */}
          <SkyRainbow cx={120} cy={150} w={140} />
          <PuffCloud cx={210} cy={110} s={0.9} />
          <PuffCloud cx={120} cy={300} s={1.0} />
          <PuffCloud cx={250} cy={210} s={0.8} />

          <rect x="0" y="0" width={W} height="150" fill="url(#w9t-veil)" />
        </svg>

        {/* MOTION-BLUR streaks scrolling down */}
        <StreakLayer streaks={[[30,60],[330,60],[150,70],[212,60]]}
                     color="rgba(255,255,255,0.8)" speed="1100ms" />
        <StreakLayer streaks={[[48,80],[316,70],[120,50],[244,70]]}
                     color="rgba(214,225,251,0.7)" speed="1400ms" delay="200ms" />
        <StreakLayer streaks={[[60,70],[180,90],[290,60],[330,70]]}
                     color="rgba(191,211,244,0.6)" speed="900ms" delay="400ms" />
      </div>
    );
  }

  function SkyRainbow({ cx, cy, w }) {
    const bands = ['#F7A9C0', '#FFC061', '#FFE08A', '#9BE08C', '#8FB6F2', '#A99CF6'];
    const r0 = w / 2;
    return (
      <g opacity="0.78" style={{ filter: 'drop-shadow(0 3px 5px rgba(80,110,170,0.18))' }}>
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
  function CloudBank({ side }) {
    const isL = side === 'l';
    const fill = isL ? 'url(#w9t-bank-l)' : 'url(#w9t-bank-r)';
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
    const lobes = [];
    for (let y = 10, i = 0; y < 420; y += 92, i++) {
      const ix = inset(Math.round((y + 20) / 150));
      const r = 18 + i % 3 * 7;
      lobes.push(<circle key={`cl${i}`} cx={X(ix - r * 0.4)} cy={y} r={r} fill="#FFFFFF" opacity="0.96" />);
    }
    return (
      <g>
        <path d={d} fill={fill} />
        {lobes}
        <path d={edge} fill="none" stroke="#BCD3F4" strokeWidth="8" opacity="0.32" strokeLinecap="round" />
        <path d={edge} fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.9" strokeLinecap="round" />
      </g>
    );
  }

  function StreakLayer({ streaks, color, speed = '1100ms', delay = '0ms' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        animation: `gj-w9t-scroll ${speed} linear infinite`, animationDelay: delay,
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

  // ─── horizon seam (sky → space) ───────────────────────────────────
  function HorizonSeam() {
    return (
      <div aria-hidden="true" style={{
        position: 'absolute', top: 360, left: 0, right: 0, height: 60, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(58,42,122,0) 0%, rgba(126,108,240,0.5) 44%, rgba(220,234,251,0.7) 56%, rgba(166,196,242,0) 100%)',
        boxShadow: 'inset 0 1.5px 0 rgba(220,234,251,0.75), inset 0 -1.5px 0 rgba(126,108,240,0.4)',
        animation: 'gj-w9t-seam 2000ms ease-in-out infinite',
      }} />
    );
  }

  // ─── confetti + stars rising ──────────────────────────────────────
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
            <div key={i} style={{ position: 'absolute', left: x, top: -20, animation: `gj-w9t-fall-c ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
              <div style={{ animation: `gj-w9t-sway 1400ms ease-in-out infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%' }}>
                <div style={{ animation: `gj-w9t-spin ${dur}ms linear infinite`, animationDelay: `${delay}ms`, transformOrigin: '50% 50%', ['--rs']: `${rotStart}deg`, ['--re']: `${rotEnd}deg` }}>
                  {shape}
                </div>
              </div>
            </div>
          );
        })}

        {/* rising twinkle stars (space theme) */}
        {[[40,3400,0],[96,3000,400],[150,3600,150],[210,3200,700],
          [264,3300,250],[318,3100,900],[68,3500,1100],[180,2900,550],
          [240,3400,1300],[300,3200,350],[120,3000,800],[330,3500,500]].map(([x,dur,delay],i)=>(
          <div key={`pf${i}`} style={{ position: 'absolute', left: x, top: H + 14, animation: `gj-w9t-rise ${dur}ms linear infinite`, animationDelay: `${delay}ms`, pointerEvents: 'none' }}>
            <div style={{ animation: 'gj-w9t-sway 1700ms ease-in-out infinite', animationDelay: `${delay}ms`, filter: 'drop-shadow(0 0 4px rgba(196,181,250,0.7))' }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill={i % 2 ? '#C4B5FA' : '#FFFFFF'} /></svg>
            </div>
          </div>
        ))}

        {/* twinkling sparks near banner */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
          {[[56,350,12,0.0],[304,348,11,0.5],[44,460,10,1.0],[316,460,12,0.3],
            [36,410,9,1.4],[324,410,9,0.8],[80,348,8,1.2],[280,460,8,0.6]].map(([x,y,s,d],i)=>(
            <g key={i} style={{ animation: 'gj-w9t-tw 1800ms ease-in-out infinite', animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}>
              <path d={`M ${x} ${y-s} L ${x+s*0.28} ${y-s*0.28} L ${x+s} ${y} L ${x+s*0.28} ${y+s*0.28} L ${x} ${y+s} L ${x-s*0.28} ${y+s*0.28} L ${x-s} ${y} L ${x-s*0.28} ${y-s*0.28} Z`} fill="#C4B5FA" />
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
        background: 'linear-gradient(180deg, #FFFFFF 0%, #EFEAFE 100%)', border: '1.5px solid #C9BEF0',
        borderRadius: 28,
        boxShadow: '0 18px 36px rgba(83,68,196,0.32), 0 6px 12px rgba(120,92,52,0.14), inset 0 2px 0 rgba(255,255,255,0.85)',
        textAlign: 'center', zIndex: 5,
        animation: `gj-w9t-pop ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`, transformOrigin: '50% 60%',
      }}>
        {/* cosmos flourishes */}
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute', top: 12, left: 13 }}>
          <circle cx="14" cy="11" r="6" fill="#8E7CF4" stroke="#A99CF6" strokeWidth="1.2" />
          <ellipse cx="14" cy="11" rx="10" ry="3" fill="none" stroke="#C4B5FA" strokeWidth="1.4" transform="rotate(-20 14 11)" />
          <circle cx="4" cy="4" r="1.2" fill="#7E6CF0" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', top: 13, right: 14 }}>
          <path d="M12 2 L14 9 L21 11 L14 13 L12 21 L10 13 L3 11 L10 9 Z" fill="#A99CF6" stroke="#7E6CF0" strokeWidth="0.8" strokeLinejoin="round" />
        </svg>

        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#9B886F', marginBottom: 4 }}>CHƯƠNG CUỐI · CHÀO MỪNG ĐẾN</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.18em', color: '#7E6CF0', marginBottom: 4 }}>THẾ GIỚI 10</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#5B4ECB', lineHeight: 1.05 }}>Vũ trụ</div>
        <div style={{ margin: '8px auto 0', width: 84, height: 4, borderRadius: 999, background: 'linear-gradient(90deg, #7E6CF0 0%, #A99CF6 100%)', boxShadow: '0 2px 4px rgba(83,68,196,0.3)' }} />
      </div>
    );
  }

  // ─── mascots ──────────────────────────────────────────────────────
  function Mascots() {
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', left: 56, top: BANNER_Y + 78, zIndex: 6, animation: 'gj-w9t-hop 800ms ease-in-out infinite', filter: 'drop-shadow(0 6px 6px rgba(83,68,196,0.34))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="pink" size={62} direction="up" expression="happy" />
            <div style={{
              position: 'absolute', left: 56, top: -4, width: 22, height: 16, borderRadius: 9,
              background: 'var(--color-block-pink)', border: '2.5px solid var(--color-block-pink-edge)',
              boxShadow: 'inset 0 2px 0 var(--color-block-pink-shine)', transformOrigin: '0% 70%',
              animation: 'gj-w9t-wave 520ms ease-in-out infinite',
            }} />
            <div style={{ position: 'absolute', left: 6, top: 64, width: 50, height: 8, borderRadius: '50%', background: 'rgba(83,68,196,0.26)', filter: 'blur(2px)', animation: 'gj-w9t-msh 800ms ease-in-out infinite' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', right: 56, top: BANNER_Y + 86, zIndex: 6, animation: 'gj-w9t-hop 800ms ease-in-out infinite', animationDelay: '280ms', filter: 'drop-shadow(0 5px 5px rgba(83,68,196,0.3))' }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="yellow" size={52} direction="up" expression="happy" />
            <div style={{ position: 'absolute', left: 2, top: 54, width: 44, height: 7, borderRadius: '50%', background: 'rgba(83,68,196,0.24)', filter: 'blur(2px)', animation: 'gj-w9t-msh 800ms ease-in-out infinite', animationDelay: '280ms' }} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ─── frame ────────────────────────────────────────────────────────
  function World9Transition() {
    return (
      <div style={{
        position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-w9t-in { 0%{transform:translateY(60px);filter:blur(4px);opacity:0.7} 18%{transform:translateY(0);filter:blur(0);opacity:1} 95%{transform:translateY(0);filter:blur(0);opacity:1} 100%{transform:translateY(60px);filter:blur(4px);opacity:0.7} }
          @keyframes gj-w9t-out { 0%{transform:translateY(0);opacity:1} 18%{transform:translateY(8px);opacity:0.96} 95%{transform:translateY(28px);opacity:0.92} 100%{transform:translateY(0);opacity:1} }
          @keyframes gj-w9t-scroll { from{transform:translateY(-180px)} to{transform:translateY(180px)} }
          @keyframes gj-w9t-seam { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes gj-w9t-pop { 0%{transform:translate(-50%,24px) scale(0.55);opacity:0} 18%{transform:translate(-50%,24px) scale(0.55);opacity:0} 28%{transform:translate(-50%,-4px) scale(1.08);opacity:1} 36%{transform:translate(-50%,0) scale(1);opacity:1} 90%{transform:translate(-50%,0) scale(1);opacity:1} 96%{transform:translate(-50%,4px) scale(0.95);opacity:0} 100%{transform:translate(-50%,24px) scale(0.55);opacity:0} }
          @keyframes gj-w9t-fall-c { 0%{transform:translateY(0)} 100%{transform:translateY(880px)} }
          @keyframes gj-w9t-rise { 0%{transform:translateY(0);opacity:0} 12%{opacity:1} 88%{opacity:1} 100%{transform:translateY(-840px);opacity:0} }
          @keyframes gj-w9t-sway { 0%,100%{transform:translateX(-10px)} 50%{transform:translateX(10px)} }
          @keyframes gj-w9t-spin { from{transform:rotate(var(--rs,0deg))} to{transform:rotate(var(--re,360deg))} }
          @keyframes gj-w9t-tw { 0%,100%{opacity:0.35;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.25)} }
          @keyframes gj-w9t-shoot { 0%{opacity:0;transform:translate(40px,-24px)} 8%{opacity:1} 24%{opacity:1} 40%{opacity:0;transform:translate(-60px,36px)} 100%{opacity:0;transform:translate(-60px,36px)} }
          @keyframes gj-w9t-hop { 0%,100%{transform:translateY(0) scaleY(1)} 45%{transform:translateY(-14px) scaleY(1.04)} 55%{transform:translateY(-14px) scaleY(1.04)} }
          @keyframes gj-w9t-wave { 0%,100%{transform:rotate(-18deg)} 50%{transform:rotate(32deg)} }
          @keyframes gj-w9t-msh { 0%,100%{transform:scale(1);opacity:0.30} 45%{transform:scale(0.7);opacity:0.18} 55%{transform:scale(0.7);opacity:0.18} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <SpaceRising />
        <SkyLeaving />
        <HorizonSeam />
        <Confetti />
        <Mascots />
        <Banner />
      </div>
    );
  }

  // ─── card ─────────────────────────────────────────────────────────
  function World9TransitionCard() {
    return (
      <div style={{
        position: 'relative', width: 760, padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: '#9B886F' }}>04 · SCREENS / TRANSITION</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: '#9B886F' }}>Cycle 3.0s · World 9 → World 10</div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: '#5B4636', marginBottom: 4, lineHeight: 1.05 }}>Chuyển cảnh · Bầu trời → Vũ trụ</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#9B886F', marginBottom: 20 }}>Vũ trụ TRỖI LÊN · Bầu trời LƯỚT XUỐNG · Banner POP · Confetti + sao BAY · Mascot VẪY · chương cuối</div>

        <div style={{ display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28, alignItems: 'flex-start' }}>
          <div style={{ width: W, height: H, borderRadius: 28, overflow: 'hidden', boxShadow: '0 16px 36px rgba(60,44,24,0.32)' }}>
            <World9Transition />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
            <Phase t="0–18 %" name="Vũ trụ TRỖI LÊN"
                   detail="trời đêm #1C1248→#5B4BAE · tinh vân tím #C4A7FF/#8A6CF0 · hành tinh có vành #8E7CF4/#A99CF6 · sao lấp lánh + sao băng · HỐ TRỌNG LỰC tím quay (signature) · translateY +60→0 + blur fade" />
            <Phase t="0–18 %" name="Bầu trời lướt xuống"
                   detail="hành lang trời sáng giữa + bờ mây cumulus 2 mép (đồng bộ strip) · mặt trời + cầu vồng · translateY 0→+8 · veil tím fade = 'rời khí quyển ra vũ trụ'" />
            <Phase t="18–32 %" name="Banner POP IN"
                   detail="surface trắng→tím nhạt · bo 28 · viền #C9BEF0 · 'Vũ trụ' Fredoka 22 #5B4ECB · hành tinh + sao 2 góc · spring · nhãn 'CHƯƠNG CUỐI'" />
            <Phase t="22 %+" name="Confetti + sao + Mascot"
                   detail="28 mảnh confetti rơi 0→880 + 12 ngôi sao bốc lên 0→−840 + sway + spin · mascot hồng vẫy + vàng hop lệch pha 280ms" />
            <Phase t="30 %+" name="Streak + sparkle"
                   detail="3 lớp streaks mây/trắng scroll dọc · lấp lánh sao tím #C4B5FA twinkle quanh banner" />
            <Phase t="95–100 %" name="Reset" detail="banner scale-out, vũ trụ slide back, confetti loop, bầu trời về vị trí" />

            <div style={{ height: 8 }} />
            <Note num="●" name="Palette World 10"
                  detail="trời đêm #1C1248→#5B4BAE · tinh vân #C4A7FF/#8A6CF0 · hành tinh #8E7CF4/#A99CF6 · gravity #7E6CF0/#6353D6/#A99CF6 · accent #5B4ECB · CTA cam giữ nguyên" />
            <Note num="●" name="Đồng bộ cutscene"
                  detail="cùng choreography & cycle 3.0s với W1→W2 … W8→W9 (new-world-in → old-world-out) · đây là transition CUỐI CÙNG của loạt 10 thế giới" />
          </div>
        </div>
      </div>
    );
  }
  function Phase({ t, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 64, padding: '3px 8px', borderRadius: 8, background: '#ECE7FB', color: '#5B4ECB', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, textAlign: 'center', lineHeight: 1.2, border: '1.5px solid #C9BEF0' }}>{t}</div>
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
        <div style={{ width: 24, height: 24, borderRadius: 999, background: '#7E6CF0', color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1, boxShadow: '0 2px 0 #6353D6' }}>{num}</div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12, color: '#5B4636' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: '#9B886F', marginTop: 2 }}>{detail}</div>
        </div>
      </div>
    );
  }

  window.GJWorld9Transition = World9Transition;
  window.GJWorld9TransitionCard = World9TransitionCard;
})();
