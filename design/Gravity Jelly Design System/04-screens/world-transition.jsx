/* world-transition.jsx — Khung chuyển cảnh World 1 → World 2.
   ---------------------------------------------------------------------
   Cycle 3.0s. Choreography (ai làm gì khi):

     0–18 %  Rừng rậm TRỖI LÊN từ nửa dưới (translateY +60 → 0, blur fade)
             + cảnh đồng cỏ bắt đầu LƯỚT XUỐNG (translateY 0 → +30)
     18–32 % Banner POP IN ở giữa: scale 0.6 → 1.08 → 1.0 (spring),
             opacity 0 → 1; seam horizon sáng lên rồi giữ
     22 % +  Confetti BẮT ĐẦU RƠI từ trên xuống (lệch pha 0-1.2s),
             rotate + sway nhẹ ngang, lap lại liên tục
     22 % +  Mascot pink vẫy tay liên tục + hop ±14dp, friend mint hop
             lệch pha 280ms
     30 % +  Motion-blur streaks chạy DỌC LIÊN TỤC ở meadow (translateY
             -120 → +120), 3 lớp lệch pha
     30 % +  Mist drift NGANG ở forest band (translateX ±20dp)
     30 % +  Fireflies pulse + drift nhẹ (opacity 0.4 → 1)
     95–100% Reset mượt: banner scale-out + opacity 0

   Layout (360 × 800):
     y   0 – 380  Forest rising (W2 sky + pines + mist + fireflies)
     y 360 – 440  Horizon seam (warm glow band)
     y 380 – 800  Meadow leaving (motion-blur streaks scroll DOWN)
     y 320 – 480  Banner + Mascot row, anchored AT FRAME CENTER
                  Banner trung tâm: left = (W - 280)/2 = 40
                  Mascot pink ở GIỮA-PHẢI banner (bên cạnh)
                  Friend mint ở GIỮA-TRÁI banner (đối xứng)

   Exposes window.GJWorldTransition + window.GJWorldTransitionCard.   */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const W = 360;
  const H = 800;
  const BANNER_Y = 400;          // banner vertical center
  const CYCLE = '3000ms';

  // ─── new world rising (top half) ─────────────────────────────────
  function ForestRising() {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: W, height: 420, overflow: 'hidden',
        animation: `gj-wt-forest-in ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`}
             style={{ display: 'block' }}>
          <defs>
            <linearGradient id="wt-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#A8C9A1" />
              <stop offset="0.22" stopColor="#B2D3AC" />
              <stop offset="0.55" stopColor="#C3DEBE" />
              <stop offset="1"    stopColor="#CFE6CE" />
            </linearGradient>
            <radialGradient id="wt-spot" cx="0.5" cy="0.55" r="0.55">
              <stop offset="0"    stopColor="#FFF6CD" stopOpacity="0.45" />
              <stop offset="0.55" stopColor="#FFE19A" stopOpacity="0.18" />
              <stop offset="1"    stopColor="#FFE19A" stopOpacity="0"    />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#wt-sky)" />
          <rect x="0" y="160" width={W} height="260" fill="url(#wt-spot)" />

          {/* far pines (silhouette) */}
          <g opacity="0.55">
            <Pine x={26}  y={172} h={36} canopy="#7A9C7E" trunk="#5A3F23" />
            <Pine x={66}  y={166} h={32} canopy="#7A9C7E" trunk="#5A3F23" />
            <Pine x={108} y={172} h={36} canopy="#7A9C7E" trunk="#5A3F23" />
            <Pine x={148} y={166} h={34} canopy="#7A9C7E" trunk="#5A3F23" />
            <Pine x={210} y={170} h={36} canopy="#7A9C7E" trunk="#5A3F23" />
            <Pine x={252} y={166} h={34} canopy="#7A9C7E" trunk="#5A3F23" />
            <Pine x={300} y={172} h={36} canopy="#7A9C7E" trunk="#5A3F23" />
            <Pine x={340} y={166} h={32} canopy="#7A9C7E" trunk="#5A3F23" />
          </g>

          {/* mid pines */}
          <g>
            <Pine x={16}  y={240} h={56} canopy="#4F8C58" trunk="#6D4C32" />
            <Pine x={62}  y={232} h={46} canopy="#3F7D49" trunk="#6D4C32" />
            <Pine x={110} y={246} h={54} canopy="#4F8C58" trunk="#6D4C32" />
            <Pine x={154} y={238} h={48} canopy="#356E40" trunk="#6D4C32" />
            <Pine x={206} y={242} h={50} canopy="#3F7D49" trunk="#6D4C32" />
            <Pine x={250} y={236} h={46} canopy="#4F8C58" trunk="#6D4C32" />
            <Pine x={296} y={244} h={56} canopy="#3F7D49" trunk="#6D4C32" />
            <Pine x={344} y={236} h={48} canopy="#4F8C58" trunk="#6D4C32" />
          </g>

          {/* near pines */}
          <g>
            <Pine x={26}  y={326} h={72} canopy="#356E40" trunk="#5A3F23" />
            <Pine x={86}  y={332} h={68} canopy="#3F7D49" trunk="#6D4C32" />
            <Pine x={142} y={326} h={76} canopy="#2E6238" trunk="#5A3F23" />
            <Pine x={222} y={336} h={70} canopy="#3F7D49" trunk="#6D4C32" />
            <Pine x={280} y={326} h={74} canopy="#356E40" trunk="#5A3F23" />
            <Pine x={332} y={332} h={68} canopy="#3F7D49" trunk="#6D4C32" />
          </g>
        </svg>

        {/* MIST clouds drifting horizontally — animated divs */}
        <Mist x={120} y={210} w={170} delay="0s"   dir={1} />
        <Mist x={280} y={250} w={180} delay="0.8s" dir={-1} />
        <Mist x={ 60} y={300} w={150} delay="1.4s" dir={1} />
        <Mist x={220} y={332} w={170} delay="0.4s" dir={-1} />

        {/* FIREFLIES — twinkling specks */}
        {[ [60,150],[140,118],[212,150],[296,118],[180,200],
           [330,210],[ 40,260],[330,300],[100,260],[260,200] ].map(([x,y],i)=>(
          <div key={i} style={{
            position: 'absolute', left: x - 2, top: y - 2,
            width: 4, height: 4, borderRadius: '50%',
            background: i % 2 === 0 ? '#FFE19A' : '#FFF1CE',
            boxShadow: '0 0 8px rgba(255,225,154,0.85)',
            animation: 'gj-wt-firefly 1800ms ease-in-out infinite',
            animationDelay: `${(i * 180) % 1800}ms`,
          }} />
        ))}
      </div>
    );
  }

  function Mist({ x, y, w, delay, dir = 1 }) {
    return (
      <div style={{
        position: 'absolute', left: x - w / 2, top: y,
        width: w, height: 18, pointerEvents: 'none',
        animation: `gj-wt-mist-${dir > 0 ? 'r' : 'l'} 4400ms ease-in-out infinite`,
        animationDelay: delay,
      }}>
        <svg width={w} height="18" viewBox={`0 0 ${w} 18`}>
          <ellipse cx={w * 0.30} cy="9" rx={w * 0.28} ry="8" fill="#FFFFFF" opacity="0.55" />
          <ellipse cx={w * 0.55} cy="8" rx={w * 0.30} ry="8" fill="#FFFFFF" opacity="0.50" />
          <ellipse cx={w * 0.78} cy="9" rx={w * 0.22} ry="7" fill="#FFFFFF" opacity="0.45" />
        </svg>
      </div>
    );
  }

  function Pine({ x, y, h, canopy, trunk }) {
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

  // ─── old world leaving (bottom half) ─────────────────────────────
  function MeadowLeaving() {
    return (
      <div style={{
        position: 'absolute', top: 380, left: 0,
        width: W, height: 420, overflow: 'hidden',
        animation: `gj-wt-meadow-out ${CYCLE} cubic-bezier(0.22,1,0.36,1) infinite`,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`}
             style={{ position: 'absolute', inset: 0, display: 'block' }}>
          <defs>
            <linearGradient id="wt-meadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0"    stopColor="#D8EBCF" />
              <stop offset="0.55" stopColor="#CCE6BF" />
              <stop offset="1"    stopColor="#B6DAB0" />
            </linearGradient>
            <linearGradient id="wt-meadow-veil" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0"    stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="1"    stopColor="#FFFFFF" stopOpacity="0"    />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={W} height="420" fill="url(#wt-meadow)" />

          <ellipse cx="40"  cy="80"  rx="160" ry="40" fill="#B5D7B0" />
          <ellipse cx="320" cy="100" rx="160" ry="42" fill="#A6CFA4" />
          <ellipse cx="180" cy="160" rx="220" ry="58" fill="#A0CC9F" />
          <ellipse cx="60"  cy="240" rx="160" ry="46" fill="#94C297" />
          <ellipse cx="300" cy="260" rx="170" ry="48" fill="#8BBE8D" />
          <ellipse cx="180" cy="340" rx="240" ry="62" fill="#94C297" />
          <rect x="0" y="400" width={W} height="20" fill="#85B988" />

          {/* trees */}
          <g transform="scale(1,0.85)">
            <g transform="translate(28,128)"><rect x="-2" y="0" width="5" height="14" rx="2" fill="#7B5A36" /><circle r="14" fill="#7FB37F" /></g>
            <g transform="translate(334,138)"><rect x="-2" y="0" width="5" height="14" rx="2" fill="#7B5A36" /><circle r="13" fill="#6FA86F" /></g>
            <g transform="translate(20,300)"><rect x="-2" y="0" width="6" height="16" rx="2" fill="#6B4D2C" /><circle r="18" fill="#5F9C66" /></g>
            <g transform="translate(338,320)"><rect x="-2" y="0" width="6" height="16" rx="2" fill="#6B4D2C" /><circle r="18" fill="#6FA86F" /></g>
          </g>

          {/* fading top veil */}
          <rect x="0" y="0" width={W} height="160" fill="url(#wt-meadow-veil)" />
        </svg>

        {/* MOTION-BLUR streaks — 3 layers, each scrolls downward at different speeds */}
        <StreakLayer
          streaks={[
            [12, 60], [78, 50], [162, 60], [198, 90],
            [296, 60], [344, 50], [56, 70],
          ]}
          color="rgba(255,255,255,0.55)"
          speed="1100ms"
        />
        <StreakLayer
          streaks={[
            [36, 80], [120, 70], [232, 50],
            [268, 70], [322, 80], [232, 60],
          ]}
          color="rgba(149,210,165,0.55)"
          speed="1400ms"
          delay="200ms"
        />
        <StreakLayer
          streaks={[
            [50, 70], [180, 90], [260, 60], [310, 70], [90, 80],
          ]}
          color="rgba(255,243,205,0.55)"
          speed="900ms"
          delay="400ms"
        />
      </div>
    );
  }

  // a band of vertical streaks that translate downward continuously
  function StreakLayer({ streaks, color, speed = '1100ms', delay = '0ms' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        animation: `gj-wt-scroll ${speed} linear infinite`,
        animationDelay: delay,
      }}>
        <svg width={W} height="420" viewBox={`0 0 ${W} 420`}
             style={{ position: 'absolute', inset: 0 }}>
          {streaks.map(([x, len], i) => (
            <rect key={i} x={x - 2} y={(i * 53) % 360} width="4" height={len}
                  rx="2" fill={color} />
          ))}
          {/* duplicate band below for seamless wrap */}
          {streaks.map(([x, len], i) => (
            <rect key={`b-${i}`} x={x - 2} y={(i * 53) % 360 + 360} width="4" height={len}
                  rx="2" fill={color} />
          ))}
        </svg>
      </div>
    );
  }

  // ─── horizon seam ─────────────────────────────────────────────────
  function HorizonSeam() {
    return (
      <div aria-hidden="true" style={{
        position: 'absolute', top: 360, left: 0, right: 0, height: 60,
        pointerEvents: 'none',
        background:
          'linear-gradient(180deg, rgba(207,230,206,0) 0%, rgba(255,246,205,0.62) 40%, rgba(255,255,255,0.62) 50%, rgba(216,235,207,0) 100%)',
        boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.6), inset 0 -1.5px 0 rgba(255,255,255,0.4)',
        animation: 'gj-wt-seam 2000ms ease-in-out infinite',
      }} />
    );
  }

  // ─── confetti FALLING ─────────────────────────────────────────────
  // 28 pieces released from above the frame, each translates DOWN through
  // the frame with sway and rotation; lệch pha so they cascade.
  function Confetti() {
    const COLORS = ['#FFE3A3', '#A3E5D9', '#F7A9C0', '#B3C7F7', '#FF9F68', '#7E6CF0'];
    const items = [
      // [x, size, kind, colorIdx, delay-ms, dur-ms]
      [ 28,  10, 'rect', 0, 0,    3200],
      [ 64,  12, 'tri',  2, 350,  3000],
      [104,  11, 'rect', 4, 700,  3400],
      [144,  10, 'circ', 1, 250,  3100],
      [184,  12, 'rect', 3, 850,  3200],
      [224,  11, 'tri',  5, 200,  2900],
      [264,  10, 'rect', 0, 600,  3300],
      [304,  12, 'rect', 4, 100,  3100],
      [344,  10, 'tri',  1, 700,  3000],
      [ 44,  9,  'circ', 5, 1100, 3200],
      [ 84,  11, 'tri',  3, 450,  3300],
      [124,  10, 'rect', 2, 950,  3000],
      [164,  9,  'circ', 0, 550,  3100],
      [204,  11, 'rect', 5, 150,  2900],
      [244,  12, 'tri',  4, 800,  3200],
      [284,  10, 'rect', 2, 350,  3300],
      [324,  11, 'tri',  3, 1000, 3000],
      [ 16,  10, 'rect', 1, 200,  3100],
      [ 56,  9,  'tri',  4, 1200, 3200],
      [128,  11, 'rect', 0, 50,   3300],
      [192,  10, 'circ', 2, 900,  3000],
      [256,  11, 'rect', 5, 500,  3100],
      [296,  12, 'tri',  3, 100,  3200],
      [336,  10, 'rect', 4, 750,  3000],
      [ 32,  11, 'tri',  2, 1400, 3300],
      [108,  10, 'rect', 5, 1300, 3000],
      [216,  12, 'tri',  1, 0,    3200],
      [288,  10, 'circ', 4, 250,  3100],
    ];
    return (
      <React.Fragment>
        {items.map(([x, s, kind, ci, delay, dur], i) => {
          const fill = COLORS[ci];
          const rotStart = (i % 2 === 0 ? -1 : 1) * 120;
          const rotEnd   = rotStart + (i % 2 === 0 ? 540 : -540);
          let shape;
          if (kind === 'rect') {
            shape = (
              <div style={{
                width: s, height: s * 1.2, borderRadius: Math.max(2, s * 0.18),
                background: fill,
                border: '0.5px solid rgba(120,92,52,0.18)',
              }} />
            );
          } else if (kind === 'tri') {
            shape = (
              <svg width={s * 1.4} height={s * 1.2} viewBox="0 0 24 24"
                   style={{ display: 'block' }}>
                <path d="M12 2 L22 20 L2 20 Z" fill={fill}
                      stroke="rgba(120,92,52,0.18)" strokeWidth="0.8"
                      strokeLinejoin="round" />
              </svg>
            );
          } else {
            shape = (
              <div style={{
                width: s, height: s, borderRadius: '50%',
                background: fill,
                border: '0.5px solid rgba(120,92,52,0.18)',
              }} />
            );
          }
          return (
            <div key={i} style={{
              position: 'absolute', left: x, top: -20,
              animation: `gj-wt-fall ${dur}ms linear infinite`,
              animationDelay: `${delay}ms`,
              pointerEvents: 'none',
            }}>
              <div style={{
                animation: `gj-wt-sway 1400ms ease-in-out infinite`,
                animationDelay: `${delay}ms`,
                transformOrigin: '50% 50%',
                ['--rot-start']: `${rotStart}deg`,
                ['--rot-end']: `${rotEnd}deg`,
              }}>
                <div style={{
                  animation: `gj-wt-spin ${dur}ms linear infinite`,
                  animationDelay: `${delay}ms`,
                  transformOrigin: '50% 50%',
                }}>
                  {shape}
                </div>
              </div>
            </div>
          );
        })}

        {/* Sparkles cluster around the banner */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
             style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
          {[ [56, 350, 12, 0.0], [304, 348, 11, 0.5], [44, 460, 10, 1.0],
             [316, 460, 12, 0.3], [36, 410, 9, 1.4], [324, 410, 9, 0.8],
             [80, 348, 8, 1.2], [280, 460, 8, 0.6] ].map(([x, y, s, d], i) => (
            <g key={i} style={{
              animation: 'gj-wt-tw 1800ms ease-in-out infinite',
              animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px`,
            }}>
              <path d={`M ${x} ${y - s} L ${x + s * 0.28} ${y - s * 0.28}
                         L ${x + s} ${y} L ${x + s * 0.28} ${y + s * 0.28}
                         L ${x} ${y + s} L ${x - s * 0.28} ${y + s * 0.28}
                         L ${x - s} ${y} L ${x - s * 0.28} ${y - s * 0.28} Z`}
                    fill="#FFFFFF" />
              <circle cx={x} cy={y} r={s * 0.18} fill="#FFE19A" />
            </g>
          ))}
        </svg>
      </React.Fragment>
    );
  }

  // ─── celebration banner (centered, big pop-in) ───────────────────
  function Banner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: BANNER_Y - 64,
        width: 280, padding: '14px 18px 16px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8EC 100%)',
        border: '1.5px solid #EFE0C9',
        borderRadius: 28,
        boxShadow:
          '0 18px 36px rgba(60,80,55,0.30), 0 6px 12px rgba(120,92,52,0.16), inset 0 2px 0 rgba(255,255,255,0.85)',
        textAlign: 'center', zIndex: 5,
        animation: `gj-wt-pop ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`,
        transformOrigin: '50% 60%',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" style={{
          position: 'absolute', top: 10, left: 14,
        }}>
          <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" fill="#9CC79B" stroke="#4F8C58" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" style={{
          position: 'absolute', top: 10, right: 14, transform: 'scaleX(-1)',
        }}>
          <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" fill="#9CC79B" stroke="#4F8C58" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>

        <div style={{
          fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
          letterSpacing: '0.18em', color: '#9B886F',
          marginBottom: 4,
        }}>CHÀO MỪNG ĐẾN</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
          letterSpacing: '0.18em', color: '#3F7D49',
          marginBottom: 4,
        }}>THẾ GIỚI 2</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
          color: '#5B4636', lineHeight: 1.05,
        }}>Rừng rậm</div>

        <div style={{
          margin: '8px auto 0', width: 84, height: 4, borderRadius: 999,
          background: 'linear-gradient(90deg, #FFCA66 0%, #FF9F68 100%)',
          boxShadow: '0 2px 4px rgba(200,150,40,0.30)',
        }} />
      </div>
    );
  }

  // ─── mascots arranged symmetrically around the banner ───────────
  // Pink mascot on the LEFT of banner, waving; mint friend on RIGHT,
  // bouncing in counter-pose. Both anchored below banner bottom.
  function Mascots() {
    return (
      <React.Fragment>
        {/* PINK — left side, below banner */}
        <div style={{
          position: 'absolute', left: 56, top: BANNER_Y + 78,
          zIndex: 6,
          animation: 'gj-wt-hop 800ms ease-in-out infinite',
          filter: 'drop-shadow(0 6px 6px rgba(120,92,52,0.32))',
        }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="pink" size={62} direction="up" expression="happy" />
            {/* waving arm */}
            <div style={{
              position: 'absolute', left: 56, top: -4,
              width: 22, height: 16, borderRadius: 9,
              background: 'var(--color-block-pink)',
              border: '2.5px solid var(--color-block-pink-edge)',
              boxShadow: 'inset 0 2px 0 var(--color-block-pink-shine)',
              transformOrigin: '0% 70%',
              animation: 'gj-wt-wave 520ms ease-in-out infinite',
            }} />
            {/* tiny ground shadow under the mascot */}
            <div style={{
              position: 'absolute', left: 6, top: 64,
              width: 50, height: 8, borderRadius: '50%',
              background: 'rgba(120,92,52,0.25)', filter: 'blur(2px)',
              animation: 'gj-wt-mshadow 800ms ease-in-out infinite',
            }} />
          </div>
        </div>

        {/* MINT — right side, below banner */}
        <div style={{
          position: 'absolute', right: 56, top: BANNER_Y + 86,
          zIndex: 6,
          animation: 'gj-wt-hop 800ms ease-in-out infinite',
          animationDelay: '280ms',
          filter: 'drop-shadow(0 5px 5px rgba(120,92,52,0.28))',
        }}>
          <div style={{ position: 'relative' }}>
            <JellyBlock color="mint" size={52} direction="up" expression="happy" />
            <div style={{
              position: 'absolute', left: 2, top: 54,
              width: 44, height: 7, borderRadius: '50%',
              background: 'rgba(120,92,52,0.22)', filter: 'blur(2px)',
              animation: 'gj-wt-mshadow 800ms ease-in-out infinite',
              animationDelay: '280ms',
            }} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ─── frame ───────────────────────────────────────────────────────
  function WorldTransition() {
    return (
      <div style={{
        position: 'relative', width: W, height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden',
      }}>
        <style>{`
          /* Forest rises from below, then settles */
          @keyframes gj-wt-forest-in {
            0%   { transform: translateY(60px); filter: blur(4px); opacity: 0.7; }
            18%  { transform: translateY(0);    filter: blur(0);   opacity: 1; }
            95%  { transform: translateY(0);    filter: blur(0);   opacity: 1; }
            100% { transform: translateY(60px); filter: blur(4px); opacity: 0.7; }
          }
          /* Meadow gently slides DOWN while we leave */
          @keyframes gj-wt-meadow-out {
            0%   { transform: translateY(0);    opacity: 1;    }
            18%  { transform: translateY(8px);  opacity: 0.96; }
            95%  { transform: translateY(28px); opacity: 0.92; }
            100% { transform: translateY(0);    opacity: 1;    }
          }
          /* Vertical scroll for motion-blur layers */
          @keyframes gj-wt-scroll {
            from { transform: translateY(-180px); }
            to   { transform: translateY( 180px); }
          }
          /* Seam glow brightens */
          @keyframes gj-wt-seam {
            0%,100% { opacity: 0.6; }
            50%     { opacity: 1;   }
          }

          /* Mist drift horizontal */
          @keyframes gj-wt-mist-r {
            0%,100% { transform: translateX(-18px); opacity: 0.4; }
            50%     { transform: translateX( 18px); opacity: 0.9; }
          }
          @keyframes gj-wt-mist-l {
            0%,100% { transform: translateX( 18px); opacity: 0.4; }
            50%     { transform: translateX(-18px); opacity: 0.9; }
          }
          /* Fireflies */
          @keyframes gj-wt-firefly {
            0%,100% { opacity: 0.35; transform: scale(0.85); }
            50%     { opacity: 1;    transform: scale(1.3);  }
          }

          /* Banner pops in with spring */
          @keyframes gj-wt-pop {
            0%   { transform: translate(-50%, 24px) scale(0.55); opacity: 0; }
            18%  { transform: translate(-50%, 24px) scale(0.55); opacity: 0; }
            28%  { transform: translate(-50%, -4px) scale(1.08); opacity: 1; }
            36%  { transform: translate(-50%,  0)   scale(1.00); opacity: 1; }
            90%  { transform: translate(-50%,  0)   scale(1.00); opacity: 1; }
            96%  { transform: translate(-50%,  4px) scale(0.95); opacity: 0; }
            100% { transform: translate(-50%, 24px) scale(0.55); opacity: 0; }
          }

          /* Confetti: falls from top of frame to bottom */
          @keyframes gj-wt-fall {
            0%   { transform: translateY(0);    }
            100% { transform: translateY(880px); }
          }
          /* sway left-right while falling */
          @keyframes gj-wt-sway {
            0%,100% { transform: translateX(-10px); }
            50%     { transform: translateX( 10px); }
          }
          /* spin while falling */
          @keyframes gj-wt-spin {
            from { transform: rotate(var(--rot-start, 0deg)); }
            to   { transform: rotate(var(--rot-end, 360deg)); }
          }

          /* Sparkle twinkle */
          @keyframes gj-wt-tw {
            0%,100% { opacity: 0.35; transform: scale(0.8); }
            50%     { opacity: 1;    transform: scale(1.25); }
          }

          /* Mascot hop — larger and snappier */
          @keyframes gj-wt-hop {
            0%,100% { transform: translateY(0)   scaleY(1);    }
            45%     { transform: translateY(-14px) scaleY(1.04); }
            55%     { transform: translateY(-14px) scaleY(1.04); }
          }
          /* Hand wave */
          @keyframes gj-wt-wave {
            0%,100% { transform: rotate(-18deg); }
            50%     { transform: rotate( 32deg); }
          }
          /* Mascot shadow shrinks on jump */
          @keyframes gj-wt-mshadow {
            0%,100% { transform: scale(1);    opacity: 0.30; }
            45%     { transform: scale(0.7);  opacity: 0.18; }
            55%     { transform: scale(0.7);  opacity: 0.18; }
          }

          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <ForestRising />
        <MeadowLeaving />
        <HorizonSeam />
        <Confetti />
        <Mascots />
        <Banner />
      </div>
    );
  }

  // ─── card ────────────────────────────────────────────────────────
  function WorldTransitionCard() {
    return (
      <div style={{
        position: 'relative', width: 760, padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
            letterSpacing: '0.12em', color: '#9B886F',
          }}>04 · SCREENS / TRANSITION</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
            color: '#9B886F',
          }}>Cycle 3.0s · 7 luồng motion</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26,
          color: '#5B4636', marginBottom: 4, lineHeight: 1.05,
        }}>Chuyển cảnh · Đồng cỏ → Rừng rậm</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
          color: '#9B886F', marginBottom: 20,
        }}>Forest TRỖI LÊN · Meadow LƯỚT XUỐNG · Banner POP · Confetti RƠI · Mascot VẪY + HOP</div>

        <div style={{
          display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28,
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: W, height: H, borderRadius: 28, overflow: 'hidden',
            boxShadow: '0 16px 36px rgba(60,44,24,0.32)',
          }}>
            <WorldTransition />
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12,
            paddingTop: 6,
          }}>
            <Phase t="0–18 %" name="Forest TRỖI LÊN · Meadow lướt xuống"
                   detail="forest translateY +60 → 0 + blur 4px → 0; meadow translateY 0 → +8 (rời nhẹ)" />
            <Phase t="18–32 %" name="Banner POP IN"
                   detail="scale 0.55 → 1.08 → 1.00 · opacity 0 → 1 · cubic-bezier(0.34,1.56,0.50,1) spring" />
            <Phase t="22 %+" name="Confetti BẮT ĐẦU RƠI"
                   detail="28 mảnh translateY 0 → 880px linear; cộng sway ngang 1.4s + spin ±540° lệch pha 0–1.4s" />
            <Phase t="22 %+" name="Mascot vẫy + hop"
                   detail="pink 62dp hop −14dp 800ms · arm rotate −18°/+32° 520ms · mint 52dp lệch pha 280ms" />
            <Phase t="30 %+" name="Motion-blur scroll"
                   detail="3 lớp streaks translateY −180 → +180px linear · speeds 900/1100/1400ms · delays 0/200/400ms" />
            <Phase t="30 %+" name="Mist drift + Fireflies"
                   detail="4 mist clouds X ±18px 4.4s lệch hướng · 10 fireflies scale 0.85→1.3 + opacity twinkle 1.8s" />
            <Phase t="95–100 %" name="Reset"
                   detail="banner scale-out, forest slide back down, confetti loops từ top, meadow về vị trí" />

            <div style={{ height: 8 }} />
            <Note num="●" name="Layout"
                  detail="Forest y 0–380 · Seam 360–420 · Meadow 380–800 · Banner ở x=180 (center) y=336–464 · Mascot pink trái 32dp, mint phải 32dp — đối xứng" />
            <Note num="●" name="Z-order"
                  detail="Scene (0) → Confetti (1) → Mascot (4) → Banner (5) → Sparkles around banner (4)" />
          </div>
        </div>
      </div>
    );
  }

  function Phase({ t, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          minWidth: 64, padding: '3px 8px', borderRadius: 8,
          background: '#FFE6A8', color: '#6A4A2E',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
          textAlign: 'center', lineHeight: 1.2,
          border: '1.5px solid #E0A21F',
        }}>{t}</div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 13,
            color: '#5B4636',
          }}>{name}</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11,
            color: '#9B886F', marginTop: 2,
          }}>{detail}</div>
        </div>
      </div>
    );
  }

  function Note({ num, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          width: 24, height: 24, borderRadius: 999,
          background: '#FF9F68', color: '#FFFFFF',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, lineHeight: 1,
          boxShadow: '0 2px 0 #E97E45',
        }}>{num}</div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12,
            color: '#5B4636',
          }}>{name}</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11,
            color: '#9B886F', marginTop: 2,
          }}>{detail}</div>
        </div>
      </div>
    );
  }

  window.GJWorldTransition = WorldTransition;
  window.GJWorldTransitionCard = WorldTransitionCard;
})();
