/* map-just-completed.jsx — Biến thể "VỪA HOÀN THÀNH màn, quay lại map".
   ---------------------------------------------------------------------
   Kịch bản animation (cycle 2.6s, lặp):
     0–8%   chuẩn bị: mascot fade in tại L4, mọi thứ ở vạch xuất phát
     8–45%  ACTION (~1s):
              · 3 sao vàng BAY OUT khỏi L4, arc vào 3 slot trên arc
              · Đường L4→L5 SÁNG DẦN bằng orange (0→100% pathLength)
              · Leading-edge glow CHẠY THEO leading edge của lửa cam
              · Mascot pink JellyBlock có mắt NHẢY từ L4 sang L5 theo
                offset-path bezier, bóng đổ đi cùng dưới đường
              · "+3 ★" pop in tại L4
     45–80% HELD: mascot ở L5 (đứng yên), sao đã vào arc, đường đã lit,
              popup "+3 ★" lửng lơ rồi bay lên & mờ dần
     80–95% L5 pulse + pill "Chơi ngay" tiếp tục, mọi thứ giữ trạng thái
     95–100% reset: mascot/popup fade, sao/đường fade, quay về điểm 0%
   Exposes window.GJMapJustCompleted + window.GJMapJustCompletedCard.   */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  // ─── geometry ─────────────────────────────────────────────────────
  const W = 360;
  const H = 680;

  const L3 = { x: 110, y: 600 };  // already done
  const L4 = { x: 240, y: 420 };  // JUST FINISHED — focus
  const L5 = { x: 110, y: 220 };  // NEXT — pulsing

  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }

  const ENTRY = { x: 180, y: H + 40 };
  const EXIT  = { x: 180, y: -40    };
  const FULL_PATH = pathD([ENTRY, L3, L4, L5, EXIT]);
  const WALKED    = pathD([ENTRY, L3, L4]);
  const SEG_45    = pathD([L4, L5]);

  // Cycle duration (sync all motions to this).
  const CYCLE = '2600ms';

  // ─── meadow background ──────────────────────────────────────────
  function Scene() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="jc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"    stopColor="#DEF0E1" />
            <stop offset="0.55" stopColor="#DAEFD0" />
            <stop offset="1"    stopColor="#C6E8C9" />
          </linearGradient>
          <radialGradient id="jc-sun" cx="0.78" cy="0.36" r="0.5">
            <stop offset="0" stopColor="#FFF6CD" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFF6CD" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="jc-l4-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0"    stopColor="#FFE19A" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#FFE19A" stopOpacity="0.18" />
            <stop offset="1"    stopColor="#FFE19A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#jc-sky)" />
        <rect x="0" y="0" width={W} height={H} fill="url(#jc-sun)" />

        <ellipse cx="50"  cy="130" rx="140" ry="50" fill="#BCDDB9" />
        <ellipse cx="310" cy="150" rx="150" ry="54" fill="#B0D6AB" />
        <ellipse cx="180" cy="200" rx="220" ry="72" fill="#B8D9B5" />
        <ellipse cx="60"  cy="330" rx="150" ry="58" fill="#B0D6AB" />
        <ellipse cx="300" cy="350" rx="160" ry="62" fill="#A6CFA4" />
        <ellipse cx="180" cy="400" rx="220" ry="78" fill="#B0D6AB" />
        <ellipse cx="40"  cy="520" rx="160" ry="60" fill="#A0CC9F" />
        <ellipse cx="320" cy="540" rx="160" ry="62" fill="#94C297" />
        <ellipse cx="180" cy="600" rx="240" ry="80" fill="#9CC79B" />
        <rect x="0" y={H - 26} width={W} height="26" fill="#A4CE9E" />

        <ellipse cx={L4.x} cy={L4.y} rx="100" ry="100" fill="url(#jc-l4-glow)" />

        <Tree x={28}  y={150} h={28} canopy="#7FB37F" />
        <Tree x={338} y={170} h={30} canopy="#6FA86F" />
        <Tree x={24}  y={360} h={36} canopy="#5F9C66" />
        <Tree x={336} y={380} h={34} canopy="#6FA86F" />
        <Tree x={28}  y={560} h={40} canopy="#5F9C66" />
        <Tree x={336} y={580} h={42} canopy="#6FA86F" />

        <Bush x={50}  y={210} r={18} c="#7AB07E" />
        <Bush x={310} y={230} r={20} c="#8BBE8D" />
        <Bush x={50}  y={420} r={22} c="#7AB07E" />
        <Bush x={310} y={440} r={20} c="#8BBE8D" />
        <Bush x={46}  y={620} r={22} c="#7AB07E" />
        <Bush x={310} y={640} r={20} c="#8BBE8D" />

        {[[70,170],[298,200],[80,380],[300,400],[60,540],[300,560]].map(([x,y],i)=>(
          <g key={i}>
            {[0,72,144,216,288].map(a=>{
              const rad=(a*Math.PI)/180;
              return <circle key={a} cx={x+Math.cos(rad)*3} cy={y+Math.sin(rad)*3} r="2" fill="#FFFFFF" opacity="0.92" />;
            })}
            <circle cx={x} cy={y} r="1.6" fill="#F6D86B" />
          </g>
        ))}
      </svg>
    );
  }

  function Tree({ x, y, h = 30, canopy = '#7FB37F', trunk = '#7B5A36' }) {
    const r = h * 0.6;
    return (
      <g>
        <rect x={x - 2.5} y={y} width="5" height={h * 0.46} rx="2" fill={trunk} />
        <ellipse cx={x - r * 0.5} cy={y - r * 0.2} rx={r * 0.7} ry={r * 0.66} fill={canopy} opacity="0.94" />
        <ellipse cx={x + r * 0.5} cy={y - r * 0.3} rx={r * 0.7} ry={r * 0.66} fill={canopy} opacity="0.94" />
        <ellipse cx={x} cy={y - r * 0.72} rx={r} ry={r * 0.82} fill={canopy} />
      </g>
    );
  }
  function Bush({ x, y, r = 16, c = '#8BBE8D' }) {
    return (
      <g>
        <ellipse cx={x - r * 0.55} cy={y} rx={r * 0.7} ry={r * 0.55} fill={c} />
        <ellipse cx={x + r * 0.55} cy={y} rx={r * 0.7} ry={r * 0.55} fill={c} />
        <ellipse cx={x} cy={y - r * 0.22} rx={r * 0.8} ry={r * 0.6} fill={c} />
      </g>
    );
  }

  // ─── path layer: walked (L3→L4) + LIGHTING UP L4→L5 + traveling glow
  // ─────────────────────────────────────────────────────────────────
  function PathLayer() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block',
                    pointerEvents: 'none' }}>
        <defs>
          <path id="jc-seg45-path" d={SEG_45} />
        </defs>

        {/* shadow under road */}
        <path d={FULL_PATH} fill="none" stroke="rgba(120,92,52,0.22)"
              strokeWidth="34" strokeLinecap="round" strokeLinejoin="round"
              transform="translate(0,4)" />
        <path d={FULL_PATH} fill="none" stroke="#EAD8B7"
              strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#FFFFFF"
              strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#EFE0C9"
              strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 11" />

        {/* walked orange (entry → L4) — static, đã đi lịch sử */}
        <path d={WALKED} fill="none" stroke="#FF9F68"
              strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"
              opacity="0.95" />
        <path d={WALKED} fill="none" stroke="#FFC59A"
              strokeWidth="6" strokeLinecap="round" strokeDasharray="4 9" />

        {/* LIGHTING UP — L4 → L5, animated fill 0 → 100% rồi giữ rồi rút  */}
        <path d={SEG_45} fill="none" stroke="#FF9F68"
              strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"
              pathLength="100" strokeDasharray="0 100" opacity="0.95">
          <animate attributeName="stroke-dasharray"
                   values="0 100; 0 100; 100 100; 100 100; 0 100"
                   keyTimes="0; 0.08; 0.45; 0.85; 1"
                   dur={CYCLE} repeatCount="indefinite"
                   calcMode="spline"
                   keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.4 0 0.6 1" />
        </path>
        <path d={SEG_45} fill="none" stroke="#FFC59A"
              strokeWidth="6" strokeLinecap="round"
              pathLength="100" strokeDasharray="0 100" opacity="0.9">
          <animate attributeName="stroke-dasharray"
                   values="0 100; 0 100; 100 100; 100 100; 0 100"
                   keyTimes="0; 0.08; 0.45; 0.85; 1"
                   dur={CYCLE} repeatCount="indefinite"
                   calcMode="spline"
                   keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.4 0 0.6 1" />
        </path>
        {/* shimmer dashes drifting along the path */}
        <path d={SEG_45} fill="none" stroke="#FFFFFF"
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray="3 6" opacity="0.7">
          <animate attributeName="stroke-dashoffset"
                   from="9" to="0"
                   dur="900ms" repeatCount="indefinite" />
        </path>

        {/* leading-edge glow CHẠY THEO leading edge của lửa cam */}
        <g>
          <circle cx="0" cy="0" r="16" fill="#FFE19A" opacity="0.55" />
          <circle cx="0" cy="0" r="9"  fill="#FFFFFF" opacity="0.95" />
          <circle cx="0" cy="0" r="5"  fill="#FFC23D" />
          <animateMotion dur={CYCLE} repeatCount="indefinite"
                         keyPoints="0; 0; 1; 1; 0"
                         keyTimes="0; 0.08; 0.45; 0.85; 1"
                         calcMode="spline"
                         keySplines="0.5 0 0.5 1; 0.25 0.1 0.25 1; 0.5 0 0.5 1; 0.4 0 0.6 1">
            <mpath href="#jc-seg45-path" />
          </animateMotion>
          {/* fade in/out: hidden before fill starts and during reset */}
          <animate attributeName="opacity"
                   values="0; 0; 1; 1; 0; 0"
                   keyTimes="0; 0.07; 0.10; 0.85; 0.95; 1"
                   dur={CYCLE} repeatCount="indefinite" />
        </g>
      </svg>
    );
  }

  // ─── stars ──────────────────────────────────────────────────────
  function Star({ filled = true, size = 14, fill = '#FFC23D', edge = '#E0A21F' }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
              fill={filled ? fill : '#D9CDB5'}
              stroke={filled ? edge : '#B6A892'}
              strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  function StarArc({ stars = 0, size = 14, width = 80 }) {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: -size - 6,
        transform: 'translateX(-50%)', width, height: size + 8,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        pointerEvents: 'none',
      }}>
        <div style={{ transform: 'translateY(5px) rotate(-22deg)' }}>
          <Star filled={stars >= 1} size={size} />
        </div>
        <div style={{ transform: 'translateY(-3px)' }}>
          <Star filled={stars >= 2} size={size + 2} />
        </div>
        <div style={{ transform: 'translateY(5px) rotate(22deg)' }}>
          <Star filled={stars >= 3} size={size} />
        </div>
      </div>
    );
  }

  function NumberBadge({ n, size, color = '#6A4A2E' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: Math.round(size * 0.42), lineHeight: 1, color,
        textShadow: '0 1px 0 rgba(255,255,255,0.55)', pointerEvents: 'none',
      }}>{n}</div>
    );
  }

  // ─── L3: reference done node ─────────────────────────────────
  function L3Done() {
    const size = 50;
    return (
      <div style={{
        position: 'absolute', left: L3.x - size / 2, top: L3.y - size / 2,
        filter: 'drop-shadow(0 4px 5px rgba(120,92,52,0.20))',
      }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <JellyBlock color="pink" size={size} showEyes={false} />
          <NumberBadge n={3} size={size} />
          <StarArc stars={3} size={11} width={size + 8} />
        </div>
      </div>
    );
  }

  // ─── L4: just-finished node — empty star arc waiting for stars ──
  function L4JustDone() {
    const size = 64;
    return (
      <div style={{
        position: 'absolute', left: L4.x - size / 2, top: L4.y - size / 2,
      }}>
        <div style={{
          position: 'relative', width: size, height: size,
          filter: 'drop-shadow(0 6px 8px rgba(120,92,52,0.28))',
          animation: 'gj-jc-pop 1400ms ease-in-out infinite',
          transformOrigin: '50% 50%',
        }}>
          <JellyBlock color="blue" size={size} showEyes={false} />
          <NumberBadge n={4} size={size} />
          <StarArc stars={0} size={14} width={size + 14} />
        </div>
      </div>
    );
  }

  // ─── 3 yellow stars FLYING OUT of L4 into the arc slots ─────────
  // Each star is positioned at its TARGET in the arc; CSS keyframes
  // translate it from L4 origin (below+inside) to the slot, with a
  // squash-pop on landing and a fade-out for the cycle reset.
  function FlyingStars() {
    const TARGETS = [
      { x: L4.x - 30, y: L4.y - 30, rot: -22, key: 'a', dx:  30, dy: 28 },
      { x: L4.x,      y: L4.y - 36, rot:   0, key: 'b', dx:   0, dy: 36 },
      { x: L4.x + 30, y: L4.y - 30, rot:  22, key: 'c', dx: -30, dy: 28 },
    ];
    return (
      <React.Fragment>
        {/* static dashed trails — show flight paths */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
             style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {TARGETS.map((t, i) => {
            const ox = L4.x, oy = L4.y - 5;
            const mx = (ox + t.x) / 2 + (i - 1) * 10;
            const my = (oy + t.y) / 2 + 6;
            const trailD = `M ${ox} ${oy} Q ${mx} ${my} ${t.x} ${t.y}`;
            return <path key={`trail-${t.key}`} d={trailD} fill="none"
                         stroke="#FFD074" strokeWidth="2" strokeLinecap="round"
                         strokeDasharray="2 6" opacity="0.55">
                <animate attributeName="opacity"
                  values="0; 0; 0.55; 0.55; 0"
                  keyTimes="0; 0.08; 0.30; 0.85; 1"
                  dur={CYCLE} repeatCount="indefinite" />
            </path>;
          })}
        </svg>

        {/* animated star sprites */}
        {TARGETS.map((t, i) => (
          <div key={t.key} style={{
            position: 'absolute', left: t.x - 14, top: t.y - 14,
            width: 28, height: 28, pointerEvents: 'none',
            animation: `gj-jc-fly-${t.key} ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`,
            animationDelay: `${i * 80}ms`,
          }}>
            <div style={{
              position: 'absolute', inset: -10, borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(255,225,154,0.7) 0%, rgba(255,225,154,0) 70%)',
              pointerEvents: 'none',
            }} />
            <svg width="28" height="28" viewBox="0 0 24 24"
                 style={{ position: 'relative' }}>
              <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
                    fill="#FFC23D" stroke="#E0A21F" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </React.Fragment>
    );
  }

  // ─── sparkle particles around L4 ─────────────────────────────
  function SparkleParticles() {
    const pts = [
      [L4.x - 52, L4.y - 14, 10, 0.0],
      [L4.x + 58, L4.y - 8,  11, 0.5],
      [L4.x - 40, L4.y + 32, 9,  1.0],
      [L4.x + 38, L4.y + 38, 10, 0.3],
      [L4.x - 62, L4.y + 52, 8,  1.4],
      [L4.x + 66, L4.y + 52, 9,  0.7],
      [L4.x - 18, L4.y + 66, 8,  0.9],
      [L4.x + 22, L4.y - 64, 10, 1.2],
      [L4.x -  6, L4.y + 80, 7,  0.6],
    ];
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {pts.map(([x, y, s, d], i) => (
          <g key={i} style={{
            animation: 'gj-jc-tw 2200ms ease-in-out infinite',
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
    );
  }

  // ─── L5: NEXT node — pulse + "Chơi ngay" pill ──────────────────
  function L5Next() {
    const disc = 60;
    return (
      <div style={{
        position: 'absolute', left: L5.x - disc / 2, top: L5.y - disc / 2,
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', left: -14, top: -14,
            width: disc + 28, height: disc + 28, borderRadius: '50%',
            background: 'rgba(255,159,104,0.22)',
            animation: 'gj-jc-pulse 1600ms ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', left: -4, top: -4,
            width: disc + 8, height: disc + 8, borderRadius: '50%',
            background: 'rgba(255,159,104,0.32)',
            animation: 'gj-jc-pulse 1600ms ease-out infinite',
            animationDelay: '300ms',
          }} />
          <div style={{
            position: 'relative', width: disc, height: disc, borderRadius: '50%',
            background: '#FFFFFF',
            border: '3px solid #FF9F68',
            boxShadow:
              '0 6px 14px rgba(120,92,52,0.24), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={disc - 16} height={disc - 16} viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A"
                      strokeWidth="2" strokeDasharray="3 4" />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 22, color: '#E97E45',
            }}>5</div>
          </div>
          <div style={{
            position: 'absolute', left: '50%', top: disc + 10,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)',
            color: '#FFFFFF',
            border: '2px solid #E97E45',
            borderBottom: '3px solid #C8662F',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
            padding: '5px 14px 6px', borderRadius: 999,
            boxShadow: '0 6px 12px rgba(201,102,47,0.35), inset 0 2px 0 rgba(255,197,154,0.6)',
            whiteSpace: 'nowrap',
          }}>Chơi ngay</div>
        </div>
      </div>
    );
  }

  // ─── mascot JUMPING from L4 to L5 along the road (offset-path) ─
  // Mascot perches ABOVE the node disc (not centered on it) so it never
  // hides the level number. Path runs L4_top → L5_top:
  //   L4_top ≈ (L4.x, L4.y - 38)   (just above the 64dp jelly)
  //   L5_top ≈ (L5.x, L5.y - 38)   (just above the 60dp disc)
  // Eyes face direction of travel (UP — mascot is climbing).
  function MascotJumping() {
    const L4t = { x: L4.x, y: L4.y - 38 };
    const L5t = { x: L5.x, y: L5.y - 38 };
    const mp = `M ${L4t.x} ${L4t.y} C ${L4t.x} ${(L4t.y + L5t.y) / 2}, ${L5t.x} ${(L4t.y + L5t.y) / 2}, ${L5t.x} ${L5t.y}`;
    // Shadow follows L4→L5 along the road surface itself (lower path).
    const sp = `M ${L4.x} ${L4.y + 18} C ${L4.x} ${(L4.y + L5.y) / 2 + 18}, ${L5.x} ${(L4.y + L5.y) / 2 + 18}, ${L5.x} ${L5.y + 18}`;
    return (
      <React.Fragment>
        {/* shadow on the road */}
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: 36, height: 8,
          borderRadius: '50%',
          background: 'rgba(120,92,52,0.32)', filter: 'blur(2px)',
          offsetPath: `path("${sp}")`,
          offsetAnchor: 'center',
          offsetRotate: '0deg',
          offsetDistance: '0%',
          animation: `gj-jc-trav ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`,
          willChange: 'offset-distance',
        }} />
        {/* mascot body — travels above the disc, hops vertically on top */}
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: 40, height: 40,
          offsetPath: `path("${mp}")`,
          offsetAnchor: 'center',
          offsetRotate: '0deg',
          offsetDistance: '0%',
          animation: `gj-jc-mascot ${CYCLE} cubic-bezier(0.34,1.56,0.50,1) infinite`,
          willChange: 'offset-distance, opacity',
          filter: 'drop-shadow(0 4px 4px rgba(120,92,52,0.28))',
          zIndex: 4,
        }}>
          <div style={{
            width: '100%', height: '100%',
            animation: 'gj-jc-mhop 520ms ease-in-out infinite',
            transformOrigin: '50% 80%',
          }}>
            <JellyBlock color="pink" size={40} direction="up" expression="happy" />
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ─── top caption ────────────────────────────────────────────
  function CompleteCaption() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: 12,
        transform: 'translateX(-50%)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(255,255,255,0.94)',
        border: '1px solid rgba(91,70,54,0.10)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '5px 12px 6px', borderRadius: 999,
        boxShadow: '0 6px 12px rgba(120,92,52,0.18)',
        zIndex: 5,
      }}>
        <span style={{
          width: 16, height: 16, borderRadius: 999,
          background: '#6FCF7F', border: '1.5px solid #4FB063',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10,
        }}>✓</span>
        <span style={{
          fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
          letterSpacing: '0.10em', color: '#3F7D49',
        }}>VỪA HOÀN THÀNH MÀN 4</span>
      </div>
    );
  }

  // ─── frame ─────────────────────────────────────────────────
  function MapJustCompleted() {
    return (
      <div style={{
        position: 'relative', width: W, height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden',
      }}>
        <style>{`
          /* 3 stars FLY OUT from L4 origin to their arc target slots */
          @keyframes gj-jc-fly-a {
            0%   { transform: translate( 30px, 28px) scale(0.30) rotate(-180deg); opacity: 0; }
            6%   { transform: translate( 30px, 28px) scale(0.30) rotate(-180deg); opacity: 0; }
            12%  { transform: translate( 30px, 28px) scale(0.55) rotate(-160deg); opacity: 1; }
            38%  { transform: translate(  0px,  0px) scale(1.20) rotate( -22deg); opacity: 1; }
            46%  { transform: translate(  0px,  0px) scale(0.92) rotate( -22deg); opacity: 1; }
            55%  { transform: translate(  0px,  0px) scale(1.06) rotate( -22deg); opacity: 1; }
            85%  { transform: translate(  0px,  0px) scale(1.00) rotate( -22deg); opacity: 1; }
            95%  { transform: translate(  0px,  0px) scale(0.85) rotate( -22deg); opacity: 0; }
            100% { transform: translate( 30px, 28px) scale(0.30) rotate(-180deg); opacity: 0; }
          }
          @keyframes gj-jc-fly-b {
            0%   { transform: translate( 0px, 36px) scale(0.30) rotate(-180deg); opacity: 0; }
            6%   { transform: translate( 0px, 36px) scale(0.30) rotate(-180deg); opacity: 0; }
            12%  { transform: translate( 0px, 36px) scale(0.55) rotate(-160deg); opacity: 1; }
            38%  { transform: translate( 0px,  0px) scale(1.20) rotate(   0deg); opacity: 1; }
            46%  { transform: translate( 0px,  0px) scale(0.92) rotate(   0deg); opacity: 1; }
            55%  { transform: translate( 0px,  0px) scale(1.06) rotate(   0deg); opacity: 1; }
            85%  { transform: translate( 0px,  0px) scale(1.00) rotate(   0deg); opacity: 1; }
            95%  { transform: translate( 0px,  0px) scale(0.85) rotate(   0deg); opacity: 0; }
            100% { transform: translate( 0px, 36px) scale(0.30) rotate(-180deg); opacity: 0; }
          }
          @keyframes gj-jc-fly-c {
            0%   { transform: translate(-30px, 28px) scale(0.30) rotate( 180deg); opacity: 0; }
            6%   { transform: translate(-30px, 28px) scale(0.30) rotate( 180deg); opacity: 0; }
            12%  { transform: translate(-30px, 28px) scale(0.55) rotate( 160deg); opacity: 1; }
            38%  { transform: translate(  0px,  0px) scale(1.20) rotate(  22deg); opacity: 1; }
            46%  { transform: translate(  0px,  0px) scale(0.92) rotate(  22deg); opacity: 1; }
            55%  { transform: translate(  0px,  0px) scale(1.06) rotate(  22deg); opacity: 1; }
            85%  { transform: translate(  0px,  0px) scale(1.00) rotate(  22deg); opacity: 1; }
            95%  { transform: translate(  0px,  0px) scale(0.85) rotate(  22deg); opacity: 0; }
            100% { transform: translate(-30px, 28px) scale(0.30) rotate( 180deg); opacity: 0; }
          }

          /* Mascot TRAVELS along the L4→L5 bezier; opacity fades for reset */
          @keyframes gj-jc-mascot {
            0%   { offset-distance:   0%; opacity: 0; }
            6%   { offset-distance:   0%; opacity: 1; }
            10%  { offset-distance:   0%; opacity: 1; }
            45%  { offset-distance: 100%; opacity: 1; }
            85%  { offset-distance: 100%; opacity: 1; }
            93%  { offset-distance: 100%; opacity: 0; }
            100% { offset-distance:   0%; opacity: 0; }
          }
          @keyframes gj-jc-trav {
            0%   { offset-distance:   0%; opacity: 0.35; }
            6%   { offset-distance:   0%; opacity: 0.35; }
            10%  { offset-distance:   0%; opacity: 0.35; }
            45%  { offset-distance: 100%; opacity: 0.35; }
            85%  { offset-distance: 100%; opacity: 0.35; }
            93%  { offset-distance: 100%; opacity: 0;    }
            100% { offset-distance:   0%; opacity: 0;    }
          }
          /* the body hops vertically on top of offset-path translation */
          @keyframes gj-jc-mhop {
            0%,100% { transform: translateY(0)    scaleY(1);    }
            45%     { transform: translateY(-12px) scaleY(1.04); }
            55%     { transform: translateY(-12px) scaleY(1.04); }
          }

          /* sparkle twinkle (looser timing, lệch pha) */
          @keyframes gj-jc-tw {
            0%,100% { opacity: 0.4;  transform: scale(0.85); }
            50%     { opacity: 1;    transform: scale(1.18); }
          }
          @keyframes gj-jc-pop {
            0%,100% { transform: scale(1.00); }
            50%     { transform: scale(1.06); }
          }
          @keyframes gj-jc-pulse {
            0%   { transform: scale(0.95); opacity: 0.75; }
            70%  { transform: scale(1.45); opacity: 0;    }
            100% { transform: scale(1.45); opacity: 0;    }
          }

          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <Scene />
        <PathLayer />

        <L3Done />
        <L4JustDone />
        <L5Next />

        <FlyingStars />
        <SparkleParticles />

        <MascotJumping />

        <CompleteCaption />
      </div>
    );
  }

  // ─── documentation card ───────────────────────────────────
  function MapJustCompletedCard() {
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
          }}>04 · SCREENS / LEVEL MAP</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
            color: '#9B886F',
          }}>Biến thể · vừa hoàn thành màn · cycle 2.6s</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26,
          color: '#5B4636', marginBottom: 4, lineHeight: 1.05,
        }}>Vừa hoàn thành màn · quay về bản đồ</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
          color: '#9B886F', marginBottom: 20,
        }}>Sao thực sự BAY · đường thực sự SÁNG DẦN · mascot thực sự ĐI L4 → L5</div>

        <div style={{
          display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28,
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: W, height: H, borderRadius: 28, overflow: 'hidden',
            boxShadow: '0 16px 36px rgba(60,44,24,0.32)',
          }}>
            <MapJustCompleted />
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12,
            paddingTop: 6,
          }}>
            <Phase t="0–8 %"  name="Chuẩn bị"
                   detail="mascot fade vào L4 · path L4→L5 còn trống · sao + popup ẩn" />
            <Phase t="8–45 %" name="ACTION (~960ms)"
                   detail="3 sao bay từ L4 ra arc (cubic-bezier jelly) · path orange fill 0→100% · leading glow chạy theo · mascot offset-path L4_top→L5_top, eyes hướng UP" />
            <Phase t="45–80 %" name="HELD (~910ms)"
                   detail="mascot đứng perched trên L5 (bounce 520ms) · path đã lit · 3★ đã trong arc" />
            <Phase t="80–95 %" name="L5 active"
                   detail="pulse ring + 'Chơi ngay' pill nổi bật để CTA tiếp tục" />
            <Phase t="95–100 %" name="Reset"
                   detail="mascot/popup fade · path retract · sao về origin ẩn · cycle restart" />

            <div style={{ height: 8 }} />
            <Note num="●" name="Sao bay ra"
                  detail="vị trí HTML đặt tại target slot · keyframes translate từ origin (L4 center) → (0,0) · scale 0.3→1.2→1 + rotate -180°→slot rot · stagger 80ms" />
            <Note num="●" name="Mascot offset-path"
                  detail="L4_top → L5_top (trên đỉnh disc) — không che số · 40dp · direction='up' (mắt nhìn hướng đi) · child hops 520ms" />
            <Note num="●" name="Path sáng dần"
                  detail="strokeDasharray '0 100' → '100 100' qua &lt;animate&gt; SVG · pathLength 100 + spline easing · shimmer 900ms drift độc lập" />
            <Note num="●" name="Leading-edge glow"
                  detail="&lt;animateMotion&gt; gắn &lt;mpath&gt; ref đường L4→L5 · keyTimes khớp với path fill timing" />
          </div>
        </div>
      </div>
    );
  }

  function Phase({ t, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          minWidth: 60, padding: '3px 8px', borderRadius: 8,
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

  window.GJMapJustCompleted = MapJustCompleted;
  window.GJMapJustCompletedCard = MapJustCompletedCard;
})();
