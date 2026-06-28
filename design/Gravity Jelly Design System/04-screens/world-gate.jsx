/* world-gate.jsx — "Tới cổng" variant: between W1 Đồng cỏ and W2 Rừng
   rậm, player has hit the ★ requirement. The gate is OPEN.

   Vignette content (read bottom→top):
     • bottom: orange-walked path comes up from W1
     • L10 BOSS — already cleared (3★, gravity halo intact)
     • gate banner pill — green success badge + check, world name + ★ chip
     • a soft sparkle ring drifting around the gate
     • above the gate: nền blends into Rừng rậm (#CFE6CE→#B2D3AC) with
       dark pine trees (trunk #6D4C32) — path continues into W2 dashed
       white (unlocked but not walked yet)

   Exposes window.GJWorldGate.                                            */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  // ─── geometry ─────────────────────────────────────────────────────────
  const W = 360;
  const H = 680;

  const ENTRY = { x: 180, y: 720  };  // path enters from bottom
  const L10   = { x: 180, y: 560  };  // boss already cleared
  const GATE  = { x: 180, y: 320  };  // the gate banner sits here
  const EXIT  = { x: 180, y: -40  };  // path exits top into W2

  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }

  // walked-orange: entry → L10 → just up to the gate seam.
  const WALKED = pathD([ENTRY, L10, { x: 180, y: 360 }]);
  // unlocked-white: from the gate seam upward, into W2.
  const AHEAD  = pathD([{ x: 180, y: 320 }, EXIT]);

  // ─── background (forest above, meadow below) ─────────────────────────
  function Scene() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="wg-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"     stopColor="#B2D3AC" />{/* W2 rừng rậm sâu  */}
            <stop offset="0.18"  stopColor="#C0DCBA" />
            <stop offset="0.32"  stopColor="#CFE6CE" />{/* W2 light          */}
            <stop offset="0.42"  stopColor="#D8ECD5" />{/* blend             */}
            <stop offset="0.52"  stopColor="#DEF0E1" />{/* W1 đồng cỏ        */}
            <stop offset="1"     stopColor="#C6E8C9" />
          </linearGradient>
          <radialGradient id="wg-gate-glow" cx="0.5" cy="0.48" r="0.5">
            <stop offset="0"    stopColor="#FFF6CD" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#FFE19A" stopOpacity="0.22" />
            <stop offset="1"    stopColor="#FFE19A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#wg-sky)" />

        {/* ── World 2 canopy band (top — dark forest) ── */}
        <ellipse cx="60"  cy="-10" rx="120" ry="48" fill="#7BA582" opacity="0.85" />
        <ellipse cx="240" cy="-16" rx="160" ry="50" fill="#6F9C76" opacity="0.85" />
        <ellipse cx="350" cy="8"   rx="100" ry="42" fill="#5F8E68" opacity="0.78" />

        <ellipse cx="40"  cy="90"  rx="130" ry="56" fill="#8FB48E" />
        <ellipse cx="320" cy="100" rx="140" ry="58" fill="#85AB85" />
        <ellipse cx="180" cy="140" rx="220" ry="70" fill="#9BBE99" />

        {/* dark pine trees of W2 — trunk #6D4C32 */}
        <Pine x={32}  y={88}  h={48} canopy="#3F7D49" />
        <Pine x={76}  y={66}  h={42} canopy="#4F8C58" />
        <Pine x={118} y={86}  h={46} canopy="#3F7D49" />
        <Pine x={172} y={70}  h={40} canopy="#4F8C58" />
        <Pine x={228} y={74}  h={46} canopy="#3F7D49" />
        <Pine x={278} y={92}  h={50} canopy="#356E40" />
        <Pine x={326} y={74}  h={42} canopy="#4F8C58" />

        <Pine x={20}  y={156} h={42} canopy="#3F7D49" />
        <Pine x={62}  y={134} h={36} canopy="#4F8C58" />
        <Pine x={104} y={150} h={38} canopy="#3F7D49" />
        <Pine x={258} y={138} h={38} canopy="#356E40" />
        <Pine x={306} y={158} h={44} canopy="#3F7D49" />
        <Pine x={344} y={138} h={38} canopy="#4F8C58" />

        {/* ── blend zone (mid) — soft hills ── */}
        <ellipse cx="40"  cy="270" rx="130" ry="46" fill="#A8D2A5" />
        <ellipse cx="320" cy="280" rx="150" ry="50" fill="#A0CC9F" />
        <ellipse cx="180" cy="320" rx="220" ry="64" fill="#B0D6AB" />

        {/* gate warm glow underlay */}
        <rect x="20" y="240" width="320" height="220" fill="url(#wg-gate-glow)" />

        {/* ── meadow lower band ── */}
        <ellipse cx="60"  cy="430" rx="140" ry="50" fill="#BCDDB9" />
        <ellipse cx="290" cy="450" rx="150" ry="54" fill="#B0D6AB" />
        <ellipse cx="180" cy="500" rx="220" ry="74" fill="#B8D9B5" />

        <ellipse cx="50"  cy="600" rx="150" ry="58" fill="#A6CFA4" />
        <ellipse cx="310" cy="620" rx="160" ry="62" fill="#9CC79B" />
        <ellipse cx="180" cy="660" rx="240" ry="80" fill="#A6CFA4" />

        <rect x="0" y={H - 26} width={W} height="26" fill="#A4CE9E" />

        {/* meadow trees */}
        <Tree x={28}  y={430} h={28} canopy="#7FB37F" />
        <Tree x={336} y={446} h={30} canopy="#6FA86F" />
        <Tree x={24}  y={580} h={36} canopy="#5F9C66" />
        <Tree x={336} y={596} h={34} canopy="#6FA86F" />

        <Bush x={50}  y={500} r={18} c="#7AB07E" />
        <Bush x={308} y={520} r={20} c="#8BBE8D" />
        <Bush x={46}  y={640} r={22} c="#7AB07E" />
        <Bush x={310} y={650} r={20} c="#8BBE8D" />

        {[ [70,470],[298,490],[80,560],[300,560],[60,660],[306,648] ].map(([x,y],i)=>(
          <g key={i}>
            {[0,72,144,216,288].map(a=>{
              const rad=(a*Math.PI)/180;
              return <circle key={a} cx={x+Math.cos(rad)*3} cy={y+Math.sin(rad)*3} r="2.1" fill="#FFFFFF" opacity="0.92" />;
            })}
            <circle cx={x} cy={y} r="1.6" fill="#F6D86B" />
          </g>
        ))}
      </svg>
    );
  }

  // Layered triangle pine (W2 forest motif). Trunk uses #6D4C32 per spec.
  function Pine({ x, y, h = 44, canopy = '#3F7D49', trunk = '#6D4C32' }) {
    const w = h * 0.68;
    return (
      <g style={{ filter: 'drop-shadow(0 2px 1.5px rgba(50,60,40,0.30))' }}>
        {/* trunk */}
        <rect x={x - 2.5} y={y} width="5" height={h * 0.35} rx="1.5" fill={trunk} />
        {/* three stacked triangle tiers (bottom to top) */}
        <path d={`M ${x - w} ${y} L ${x + w} ${y} L ${x} ${y - h * 0.55} Z`} fill={canopy} />
        <path d={`M ${x - w * 0.82} ${y - h * 0.32} L ${x + w * 0.82} ${y - h * 0.32} L ${x} ${y - h * 0.78} Z`} fill={canopy} />
        <path d={`M ${x - w * 0.62} ${y - h * 0.6} L ${x + w * 0.62} ${y - h * 0.6} L ${x} ${y - h * 1.02} Z`} fill={canopy} />
        {/* gloss strip */}
        <path d={`M ${x - w * 0.4} ${y - h * 0.5} L ${x - w * 0.15} ${y - h * 0.95} L ${x - w * 0.05} ${y - h * 0.92} L ${x - w * 0.30} ${y - h * 0.48} Z`}
              fill="#FFFFFF" opacity="0.18" />
      </g>
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
        <ellipse cx={x - r * 0.32} cy={y - r * 0.9} rx={r * 0.26} ry={r * 0.16}
                 fill="#FFFFFF" opacity="0.28" />
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

  // ─── path layer ─────────────────────────────────────────────────────
  function PathLayer() {
    const FULL = pathD([ENTRY, L10, GATE, EXIT]);
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block',
                    pointerEvents: 'none' }}>
        {/* shadow under */}
        <path d={FULL} fill="none" stroke="rgba(120,92,52,0.22)"
              strokeWidth="34" strokeLinecap="round" strokeLinejoin="round"
              transform="translate(0,4)" />
        <path d={FULL} fill="none" stroke="#EAD8B7"
              strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL} fill="none" stroke="#FFFFFF"
              strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL} fill="none" stroke="#EFE0C9"
              strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 11" />
        {/* walked orange overlay */}
        <path d={WALKED} fill="none" stroke="#FF9F68"
              strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"
              opacity="0.95" />
        <path d={WALKED} fill="none" stroke="#FFC59A"
              strokeWidth="6" strokeLinecap="round" strokeDasharray="4 9"
              opacity="0.9" />
      </svg>
    );
  }

  // ─── stars ──────────────────────────────────────────────────────────
  function Star({ filled = true, size = 14 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
              fill={filled ? '#FFC23D' : '#D9CDB5'}
              stroke={filled ? '#E0A21F' : '#B6A892'}
              strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  function StarArc({ stars = 3, size = 14, width = 80 }) {
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

  // ─── L10 boss — DONE state ──────────────────────────────────────────
  function BossDone({ size = 80 }) {
    return (
      <div style={{
        position: 'absolute', left: L10.x - size / 2, top: L10.y - size / 2,
      }}>
        <div style={{ position: 'relative', width: size, height: size,
                      filter: 'drop-shadow(0 8px 12px rgba(126,108,240,0.36))' }}>
          {/* halo */}
          <div style={{
            position: 'absolute', left: -28, top: -28, right: -28, bottom: -28,
            borderRadius: '50%',
            background:
              'radial-gradient(closest-side, rgba(169,156,246,0.50) 0%, rgba(126,108,240,0.26) 55%, rgba(126,108,240,0) 78%)',
            animation: 'gj-wg-halo 2400ms ease-in-out infinite',
          }} />
          <JellyBlock color="stone" size={size} showEyes={false} />
          {/* central trophy disc */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: size * 0.5, height: size * 0.5, borderRadius: '50%',
              background: 'linear-gradient(180deg,#FFE19A 0%, #FFB94D 100%)',
              border: '3px solid #FFFFFF',
              boxShadow: '0 4px 10px rgba(200,120,0,0.42), inset 0 2px 0 rgba(255,255,255,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* trophy/crown glyph (simple cup) */}
              <svg width={Math.round(size * 0.30)} height={Math.round(size * 0.30)}
                   viewBox="0 0 24 24" fill="none">
                <path d="M7 5h10v3a5 5 0 0 1-10 0V5z" fill="#FFFFFF" stroke="#E0A21F" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M7 6.5H4.5A1.5 1.5 0 0 0 4.5 9.5H7" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M17 6.5h2.5a1.5 1.5 0 0 1 0 3H17" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M10 13v3h4v-3" fill="#FFFFFF" />
                <path d="M8 17h8v2H8z" fill="#FFFFFF" />
              </svg>
            </div>
          </div>
          {/* 3★ arc */}
          <StarArc stars={3} size={14} width={size + 18} />
          {/* BOSS tag */}
          <div style={{
            position: 'absolute', top: -42, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
            color: '#FFFFFF',
            border: '2px solid #6353D6',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
            letterSpacing: '0.16em', padding: '3px 12px', borderRadius: 999,
            boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)',
            whiteSpace: 'nowrap',
          }}>BOSS · ĐÃ HẠ</div>
        </div>
      </div>
    );
  }

  // ─── sparkles around the gate ──────────────────────────────────────
  function Sparkles() {
    // 14 sparkles scattered in a wide ring around the gate banner
    const sp = [
      // [x, y, size, delay]
      [ 56, 230, 11, 0.0], [310, 222, 12, 0.4], [ 30, 290, 14, 1.1],
      [330, 308, 13, 0.7], [ 50, 360, 11, 1.5], [320, 372, 12, 0.2],
      [ 86, 200, 9,  2.0], [276, 196,  9, 0.9], [ 70, 408, 10, 0.5],
      [296, 414, 11, 1.3], [180, 188, 14, 0.0], [180, 460, 12, 1.7],
      [124, 250, 8,  0.3], [232, 254,  8, 1.0],
    ];
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block',
                    pointerEvents: 'none' }}>
        {sp.map(([x, y, s, d], i) => (
          <g key={i} style={{
            animation: `gj-wg-tw 2400ms ease-in-out infinite`,
            animationDelay: `${d}s`,
            transformOrigin: `${x}px ${y}px`,
          }}>
            {/* 4-point sparkle */}
            <path d={`M ${x} ${y - s} L ${x + s * 0.28} ${y - s * 0.28}
                       L ${x + s} ${y} L ${x + s * 0.28} ${y + s * 0.28}
                       L ${x} ${y + s} L ${x - s * 0.28} ${y + s * 0.28}
                       L ${x - s} ${y} L ${x - s * 0.28} ${y - s * 0.28} Z`}
                  fill="#FFFFFF" opacity="0.95" />
            <circle cx={x} cy={y} r={s * 0.18} fill="#FFE19A" />
          </g>
        ))}
      </svg>
    );
  }

  // ─── gate banner (OPEN — success badge) ────────────────────────────
  function GateBanner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 38,
        transform: 'translateX(-50%)',
        width: 312,
        background: '#FFFFFF',
        border: '1px solid #EFE0C9',
        borderRadius: 999,
        padding: '8px 14px 8px 8px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 12px 28px rgba(60,80,55,0.34), 0 4px 10px rgba(120,92,52,0.14)',
        zIndex: 3,
        animation: 'gj-wg-rise 1800ms ease-in-out infinite',
        transformOrigin: '50% 50%',
      }}>
        {/* success badge with checkmark */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #B7EBC0 0%, #6FCF7F 60%, #4FB063 100%)',
          border: '2.5px solid #4FB063',
          boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.10), inset 0 3px 0 rgba(255,255,255,0.45), 0 3px 6px rgba(60,150,80,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
               stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"
               aria-hidden="true">
            <path d="M5 12.5l4 4L19 7" />
          </svg>
          {/* burst ring around the badge */}
          <div style={{
            position: 'absolute', left: -8, top: -8, right: -8, bottom: -8,
            borderRadius: '50%',
            border: '2px dashed rgba(111,207,127,0.55)',
            animation: 'gj-wg-spin 6s linear infinite',
          }} />
        </div>

        {/* text */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
                      lineHeight: 1.05, gap: 2 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10,
            letterSpacing: '0.12em', color: '#9B886F', whiteSpace: 'nowrap',
          }}>THẾ GIỚI 2</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
            color: '#5B4636', whiteSpace: 'nowrap', lineHeight: 1.05,
          }}>Rừng rậm</div>
        </div>

        {/* required ★ chip — now met */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
          border: '1.5px solid #E0A21F',
          padding: '5px 10px 6px 8px', borderRadius: 999,
          boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)',
          flexShrink: 0,
        }}>
          <Star filled size={13} />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
            color: '#6A4A2E', lineHeight: 1,
          }}>18</span>
        </div>
      </div>
    );
  }

  // small floating "Đã mở khoá" caption above the banner
  function UnlockedCaption() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 86,
        transform: 'translateX(-50%)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(91,70,54,0.10)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '5px 12px 6px', borderRadius: 999,
        boxShadow: '0 6px 12px rgba(120,92,52,0.18)',
        zIndex: 4,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: 999, background: '#6FCF7F',
          boxShadow: '0 0 8px rgba(111,207,127,0.7)',
        }} />
        <span style={{
          fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
          letterSpacing: '0.10em', color: '#3F7D49',
        }}>ĐÃ MỞ KHOÁ</span>
      </div>
    );
  }

  // ─── top-level vignette ────────────────────────────────────────────
  function WorldGate() {
    return (
      <div style={{
        position: 'relative', width: W, height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-wg-halo {
            0%,100% { transform: scale(1.00); opacity: 1; }
            50%     { transform: scale(1.10); opacity: 0.85; }
          }
          @keyframes gj-wg-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes gj-wg-tw {
            0%,100% { opacity: 0.35; transform: scale(0.85); }
            50%     { opacity: 1;    transform: scale(1.15); }
          }
          @keyframes gj-wg-rise {
            0%,100% { transform: translate(-50%, 0); }
            50%     { transform: translate(-50%, -3px); }
          }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <Scene />
        <PathLayer />
        <BossDone />
        <Sparkles />
        <UnlockedCaption />
        <GateBanner />
      </div>
    );
  }

  // ─── documentation card ───────────────────────────────────────────
  function WorldGateCard() {
    return (
      <div style={{
        position: 'relative', width: 760, padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        {/* heading row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
            letterSpacing: '0.12em', color: '#9B886F',
          }}>04 · SCREENS / LEVEL MAP</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
            color: '#9B886F',
          }}>Biến thể · cổng ĐÃ ĐỦ SAO</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26,
          color: '#5B4636', marginBottom: 4, lineHeight: 1.05,
        }}>Cổng giữa Đồng cỏ → Rừng rậm</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
          color: '#9B886F', marginBottom: 20,
        }}>L10 đã hạ · 18/18★ · sẵn sàng bước vào World 2</div>

        <div style={{
          display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28,
          alignItems: 'flex-start',
        }}>
          {/* the vignette tile */}
          <div style={{
            width: W, height: H, borderRadius: 24, overflow: 'hidden',
            boxShadow: '0 14px 32px rgba(60,44,24,0.30)',
          }}>
            <WorldGate />
          </div>

          {/* anatomy list to the right */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 14,
            paddingTop: 6,
          }}>
            <Note num="A" name="Banner cổng — pill surface"
                  detail="surface #FFFFFF · shadow md · viền mảnh #EFE0C9 · nhịp rise nhẹ ±3px" />
            <Note num="B" name="Huy hiệu SUCCESS"
                  detail="vòng tròn #6FCF7F gradient · viền #4FB063 · check trắng · burst dash xoay" />
            <Note num="C" name="Cụm chữ"
                  detail="THẾ GIỚI 2 small-caps Nunito 10 #9B886F · Rừng rậm Fredoka 16 #5B4636" />
            <Note num="D" name="Chip sao yêu cầu"
                  detail="gradient #FFE6A8 → #FFD074 · viền #E0A21F · ★ #FFC23D + 18" />
            <Note num="E" name="Đường xuyên qua cổng"
                  detail="ENTRY → L10 → cổng = orange #FF9F68 (đã đi) · cổng → W2 = white-dashed (chưa đi)" />
            <Note num="F" name="Palette chuyển dần"
                  detail="trên cổng: #CFE6CE → #B2D3AC + thông xanh đậm #3F7D49, thân #6D4C32" />
            <Note num="G" name="Lấp lánh quanh cổng"
                  detail="14 sparkles trắng-vàng twinkle 2.4s · cảm giác phần thưởng" />
            <Note num="H" name="Pill 'ĐÃ MỞ KHOÁ'"
                  detail="chấm xanh #6FCF7F glow · Nunito 800 11 #3F7D49 · backdrop-blur nhẹ" />
            <Note num="I" name="Boss L10 — ĐÃ HẠ"
                  detail="stone 80dp · halo gravity còn pulse · trophy vàng giữa · 3★ arc · tag BOSS · ĐÃ HẠ" />
          </div>
        </div>
      </div>
    );
  }

  function Note({ num, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          width: 26, height: 26, borderRadius: 999,
          background: '#FF9F68', color: '#FFFFFF',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 0 #E97E45',
        }}>{num}</div>
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

  window.GJWorldGate = WorldGate;
  window.GJWorldGateCard = WorldGateCard;
})();
