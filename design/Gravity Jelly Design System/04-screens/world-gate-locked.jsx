/* world-gate-locked.jsx — Cổng World 1 → World 2 ở trạng thái CHƯA ĐỦ SAO.
   ---------------------------------------------------------------------
   Vignette content (read bottom→top):
     • bottom: orange-walked path comes up from W1
     • L10 BOSS — đã hạ nhưng chỉ 1★ (đặt setup cho "cày sao")
     • path turns white-dashed at the gate seam
     • LOCKED GATE panel (rounded surface card, tông trầm):
         - top: sunken cream badge + ổ khoá + "THẾ GIỚI 2 · Rừng rậm"
         - mid: "Cần thêm 6★ để mở" + thanh tiến độ 12 / 18 ★
         - bottom: pill nhỏ "Cày sao ★" (warning)
     • above the gate: 2 node World 2 hiện MỜ/KHOÁ (silhouette)
     • palette trên cổng: #CFE6CE → #B2D3AC + cây thông xanh đậm thân #6D4C32
   Tông vui (vẫn cam ấm + jelly cocoa), nhưng truyền "chưa tới lúc": không sparkle, không halo thắng, không pill ĐÃ MỞ.
   Exposes window.GJWorldGateLocked + window.GJWorldGateLockedCard. */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  // ─── geometry ─────────────────────────────────────────────────────────
  const W = 360;
  const H = 720;

  const ENTRY = { x: 180, y: 760  };
  const L10   = { x: 180, y: 600  };
  const SEAM  = { x: 180, y: 460  }; // where orange stops
  const GATE  = { x: 180, y: 340  }; // gate panel center
  const L11   = { x: 110, y: 220  };
  const L12   = { x: 240, y:  90  };
  const EXIT  = { x: 180, y: -40  };

  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }

  const FULL_PATH  = pathD([ENTRY, L10, SEAM, GATE, L11, L12, EXIT]);
  const WALKED     = pathD([ENTRY, L10, SEAM]);
  // The "ahead" path (above the gate, into W2) is rendered with extra-low
  // opacity to convey "unreachable yet".
  const AHEAD_FAINT = pathD([GATE, L11, L12, EXIT]);

  // ─── background ─────────────────────────────────────────────────────
  function Scene() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="wgl-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"     stopColor="#B2D3AC" />
            <stop offset="0.18"  stopColor="#C0DCBA" />
            <stop offset="0.32"  stopColor="#CFE6CE" />
            <stop offset="0.42"  stopColor="#D8ECD5" />
            <stop offset="0.52"  stopColor="#DEF0E1" />
            <stop offset="1"     stopColor="#C6E8C9" />
          </linearGradient>
          {/* cool wash over the W2 area to mute energy (locked vibe) */}
          <linearGradient id="wgl-mute" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"    stopColor="#5B4636" stopOpacity="0.18" />
            <stop offset="0.55" stopColor="#5B4636" stopOpacity="0.06" />
            <stop offset="1"    stopColor="#5B4636" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#wgl-sky)" />

        {/* W2 forest canopy — slightly desaturated greens */}
        <ellipse cx="60"  cy="-10" rx="120" ry="48" fill="#8AA88A" opacity="0.78" />
        <ellipse cx="240" cy="-16" rx="160" ry="50" fill="#7A9C7E" opacity="0.78" />
        <ellipse cx="350" cy="8"   rx="100" ry="42" fill="#6F906F" opacity="0.72" />

        <ellipse cx="40"  cy="90"  rx="130" ry="56" fill="#9CB89A" />
        <ellipse cx="320" cy="100" rx="140" ry="58" fill="#92B092" />
        <ellipse cx="180" cy="140" rx="220" ry="70" fill="#A8C2A6" />

        {/* dark pine trees of W2 — toned down */}
        <Pine x={32}  y={88}  h={48} canopy="#5B7A60" />
        <Pine x={76}  y={66}  h={42} canopy="#6A8A6E" />
        <Pine x={118} y={86}  h={46} canopy="#5B7A60" />
        <Pine x={172} y={70}  h={40} canopy="#6A8A6E" />
        <Pine x={228} y={74}  h={46} canopy="#5B7A60" />
        <Pine x={278} y={92}  h={50} canopy="#4F6E56" />
        <Pine x={326} y={74}  h={42} canopy="#6A8A6E" />
        <Pine x={20}  y={156} h={42} canopy="#5B7A60" />
        <Pine x={62}  y={134} h={36} canopy="#6A8A6E" />
        <Pine x={306} y={158} h={44} canopy="#5B7A60" />
        <Pine x={344} y={138} h={38} canopy="#6A8A6E" />

        {/* mute overlay across the W2 zone (top half) */}
        <rect x="0" y="0" width={W} height="280" fill="url(#wgl-mute)" />

        {/* blend zone hills */}
        <ellipse cx="40"  cy="300" rx="130" ry="46" fill="#A8D2A5" opacity="0.92" />
        <ellipse cx="320" cy="310" rx="150" ry="50" fill="#A0CC9F" opacity="0.92" />
        <ellipse cx="180" cy="370" rx="220" ry="64" fill="#B0D6AB" />

        {/* meadow lower */}
        <ellipse cx="60"  cy="480" rx="140" ry="50" fill="#BCDDB9" />
        <ellipse cx="290" cy="500" rx="150" ry="54" fill="#B0D6AB" />
        <ellipse cx="180" cy="550" rx="220" ry="74" fill="#B8D9B5" />

        <ellipse cx="50"  cy="640" rx="150" ry="58" fill="#A6CFA4" />
        <ellipse cx="310" cy="660" rx="160" ry="62" fill="#9CC79B" />
        <ellipse cx="180" cy="700" rx="240" ry="80" fill="#A6CFA4" />

        <rect x="0" y={H - 26} width={W} height="26" fill="#A4CE9E" />

        {/* meadow trees + bushes */}
        <Tree x={26}  y={480} h={28} canopy="#7FB37F" />
        <Tree x={338} y={500} h={30} canopy="#6FA86F" />
        <Tree x={22}  y={620} h={36} canopy="#5F9C66" />
        <Tree x={336} y={640} h={34} canopy="#6FA86F" />

        <Bush x={50}  y={540} r={18} c="#7AB07E" />
        <Bush x={308} y={560} r={20} c="#8BBE8D" />
        <Bush x={48}  y={680} r={22} c="#7AB07E" />
        <Bush x={308} y={690} r={20} c="#8BBE8D" />

        {[[70,510],[298,520],[80,600],[300,590],[60,700],[300,694]].map(([x,y],i)=>(
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

  function Pine({ x, y, h = 44, canopy = '#5B7A60', trunk = '#6D4C32' }) {
    const w = h * 0.68;
    return (
      <g style={{ filter: 'drop-shadow(0 2px 1.5px rgba(50,60,40,0.28))' }}>
        <rect x={x - 2.5} y={y} width="5" height={h * 0.35} rx="1.5" fill={trunk} />
        <path d={`M ${x - w} ${y} L ${x + w} ${y} L ${x} ${y - h * 0.55} Z`} fill={canopy} />
        <path d={`M ${x - w * 0.82} ${y - h * 0.32} L ${x + w * 0.82} ${y - h * 0.32} L ${x} ${y - h * 0.78} Z`} fill={canopy} />
        <path d={`M ${x - w * 0.62} ${y - h * 0.6} L ${x + w * 0.62} ${y - h * 0.6} L ${x} ${y - h * 1.02} Z`} fill={canopy} />
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

  // ─── path layer ────────────────────────────────────────────────────
  function PathLayer() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block',
                    pointerEvents: 'none' }}>
        {/* shadow under entire path */}
        <path d={FULL_PATH} fill="none" stroke="rgba(120,92,52,0.20)"
              strokeWidth="34" strokeLinecap="round" strokeLinejoin="round"
              transform="translate(0,4)" />
        {/* cream border */}
        <path d={FULL_PATH} fill="none" stroke="#EAD8B7"
              strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        {/* main white */}
        <path d={FULL_PATH} fill="none" stroke="#FFFFFF"
              strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        {/* center dashed */}
        <path d={FULL_PATH} fill="none" stroke="#EFE0C9"
              strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 11" />
        {/* AHEAD (above gate) — faint overlay to convey "not yet" */}
        <path d={AHEAD_FAINT} fill="none" stroke="#FFFFFF" strokeOpacity="0.35"
              strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        {/* walked orange overlay (entry → L10 → seam) */}
        <path d={WALKED} fill="none" stroke="#FF9F68"
              strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"
              opacity="0.95" />
        <path d={WALKED} fill="none" stroke="#FFC59A"
              strokeWidth="6" strokeLinecap="round" strokeDasharray="4 9"
              opacity="0.9" />
      </svg>
    );
  }

  // ─── stars + helpers ───────────────────────────────────────────────
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

  function StarArc({ stars = 1, size = 14, width = 80 }) {
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

  function LockGlyph({ size = 18, fill = '#FFFFFF', body = '#A89A82' }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
           style={{ display: 'block' }}>
        <path d="M8 11V8.5a4 4 0 1 1 8 0V11" fill="none" stroke={fill}
              strokeWidth="2.6" strokeLinecap="round" />
        <rect x="5" y="11" width="14" height="9" rx="2.5" fill={fill} />
        <circle cx="12" cy="15" r="1.4" fill={body} />
        <rect x="11.3" y="15" width="1.4" height="3" rx="0.6" fill={body} />
      </svg>
    );
  }

  // ─── L10 boss — done 1★ (sets up the "cày sao" suggestion) ────────
  function BossDone1Star({ size = 78 }) {
    return (
      <div style={{
        position: 'absolute', left: L10.x - size / 2, top: L10.y - size / 2,
      }}>
        <div style={{ position: 'relative', width: size, height: size,
                      filter: 'drop-shadow(0 6px 10px rgba(126,108,240,0.30))' }}>
          {/* halo (subdued — single-star clear) */}
          <div style={{
            position: 'absolute', left: -22, top: -22, right: -22, bottom: -22,
            borderRadius: '50%',
            background:
              'radial-gradient(closest-side, rgba(169,156,246,0.35) 0%, rgba(126,108,240,0.18) 55%, rgba(126,108,240,0) 78%)',
          }} />
          <JellyBlock color="stone" size={size} showEyes={false} />
          {/* center: small trophy disc, less golden than 3★ version */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: size * 0.5, height: size * 0.5, borderRadius: '50%',
              background: 'linear-gradient(180deg,#7E6CF0 0%, #6353D6 100%)',
              border: '3px solid #FFFFFF',
              boxShadow: '0 4px 10px rgba(83,68,196,0.4), inset 0 2px 0 rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
            }}>10</div>
          </div>
          {/* 1★ arc */}
          <StarArc stars={1} size={14} width={size + 18} />
          {/* BOSS tag (đã hạ, nhưng giữ tag tím) */}
          <div style={{
            position: 'absolute', top: -36, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
            color: '#FFFFFF',
            border: '2px solid #6353D6',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
            letterSpacing: '0.16em', padding: '3px 12px', borderRadius: 999,
            boxShadow: '0 4px 8px rgba(83,68,196,0.40), inset 0 1.5px 0 rgba(255,255,255,0.45)',
            whiteSpace: 'nowrap',
          }}>BOSS</div>
        </div>
      </div>
    );
  }

  // ─── W2 dim nodes (silhouette, locked) ─────────────────────────────
  function W2DimNode({ n, x, y, size = 50 }) {
    return (
      <div style={{
        position: 'absolute', left: x - size / 2, top: y - size / 2,
        opacity: 0.52,
        filter: 'saturate(0.4) drop-shadow(0 3px 4px rgba(120,92,52,0.20))',
      }}>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: Math.round(size * 0.40), lineHeight: 1, color: '#5B4636',
          textShadow: '0 1px 0 rgba(255,255,255,0.35)', pointerEvents: 'none',
          opacity: 0.7,
        }}>{n}</div>
        <div style={{
          position: 'absolute', right: -4, bottom: -4,
          width: 22, height: 22, borderRadius: '50%',
          background: '#8A7B62', border: '2px solid #FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(120,92,52,0.32)',
        }}>
          <LockGlyph size={12} />
        </div>
      </div>
    );
  }

  // ─── LOCKED gate panel — banner + progress + Cày sao button ───────
  function LockedGatePanel({ current = 12, target = 18 }) {
    const remaining = Math.max(0, target - current);
    const pct = Math.max(0, Math.min(1, current / target));
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 86,
        transform: 'translateX(-50%)',
        width: 320,
        background: '#FFFFFF',
        border: '1px solid #EFE0C9',
        borderRadius: 28,
        padding: '12px 14px 14px',
        display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: '0 14px 28px rgba(80,68,52,0.26), 0 4px 8px rgba(120,92,52,0.12)',
        zIndex: 3,
      }}>
        {/* ── banner row: badge + title ─────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {/* sunken cream badge with lock */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
            background: 'radial-gradient(circle at 35% 28%, #FBF1DD 0%, #F4E9D8 60%, #E2D2B0 100%)',
            border: '2.5px solid #D8C8A8',
            boxShadow: 'inset 0 -3px 0 rgba(120,92,52,0.18), inset 0 3px 0 rgba(255,255,255,0.5), 0 2px 3px rgba(120,92,52,0.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <LockGlyph size={26} fill="#6F5C44" body="#D8C8A8" />
          </div>
          {/* text */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
                        lineHeight: 1.05, gap: 2 }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10,
              letterSpacing: '0.12em', color: '#9B886F', whiteSpace: 'nowrap',
            }}>THẾ GIỚI 2</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
              color: '#5B4636', whiteSpace: 'nowrap', lineHeight: 1.05,
            }}>Rừng rậm</div>
          </div>
          {/* small target chip — muted */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            background: '#F4E9D8', border: '1.5px solid #E6D8BD',
            padding: '4px 9px 5px 7px', borderRadius: 999,
            flexShrink: 0,
          }}>
            <Star filled size={12} />
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
              color: '#8C7458', lineHeight: 1,
            }}>{target}</span>
          </div>
        </div>

        {/* ── progress row: caption + bar + count ───────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            gap: 8,
          }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
              color: '#9B886F', lineHeight: 1.2,
            }}>
              Cần thêm <span style={{ color: '#E97E45', fontWeight: 800 }}>{remaining}★</span> để mở
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'baseline', gap: 2,
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
              color: '#5B4636', lineHeight: 1, whiteSpace: 'nowrap',
            }}>
              {current}
              <span style={{ color: '#9B886F', fontWeight: 600 }}>/{target}</span>
              <span style={{ marginLeft: 1, color: '#FFC23D', fontSize: 12 }}>★</span>
            </div>
          </div>
          <div style={{
            height: 10, borderRadius: 999, background: '#F4E9D8',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 2px rgba(120,92,52,0.18)',
          }}>
            <div style={{
              width: `${pct * 100}%`, height: '100%', borderRadius: 999,
              background: 'linear-gradient(90deg, #FFCA66 0%, #FF9F68 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)',
            }} />
          </div>
        </div>

        {/* ── Cày sao ★ pill button ──────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button type="button" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(180deg, #FFE19A 0%, #FFCA66 60%, #F2B548 100%)',
            color: '#5B4636',
            border: '2px solid #E0A21F',
            borderBottom: '3px solid #B98613',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
            padding: '6px 14px 7px', borderRadius: 999,
            boxShadow: '0 4px 10px rgba(200,150,40,0.30), inset 0 1.5px 0 rgba(255,255,255,0.60)',
            cursor: 'pointer',
          }}>
            <Star filled size={13} />
            <span style={{ letterSpacing: '0.02em' }}>Cày sao ★</span>
          </button>
        </div>
      </div>
    );
  }

  // small floating "ĐANG KHOÁ" caption above the panel
  function LockedCaption() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: 250,
        transform: 'translateX(-50%)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(255,255,255,0.94)',
        border: '1px solid rgba(91,70,54,0.10)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '5px 12px 6px', borderRadius: 999,
        boxShadow: '0 6px 12px rgba(120,92,52,0.18)',
        zIndex: 4,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: 999, background: '#9B886F',
        }} />
        <span style={{
          fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
          letterSpacing: '0.10em', color: '#6F5C44',
        }}>ĐANG KHOÁ</span>
      </div>
    );
  }

  // ─── top-level vignette ────────────────────────────────────────────
  function WorldGateLocked() {
    return (
      <div style={{
        position: 'relative', width: W, height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden',
      }}>
        <style>{`
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <Scene />
        <PathLayer />

        {/* W2 nodes (locked silhouettes) above the gate */}
        <W2DimNode n={11} x={L11.x} y={L11.y} />
        <W2DimNode n={12} x={L12.x} y={L12.y} />

        {/* L10 boss done with 1★ */}
        <BossDone1Star />

        {/* the locked gate panel */}
        <LockedCaption />
        <LockedGatePanel current={12} target={18} />
      </div>
    );
  }

  // ─── documentation card ───────────────────────────────────────────
  function WorldGateLockedCard() {
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
          }}>Biến thể · cổng CHƯA ĐỦ SAO</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26,
          color: '#5B4636', marginBottom: 4, lineHeight: 1.05,
        }}>Cổng giữa Đồng cỏ → Rừng rậm · KHOÁ</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
          color: '#9B886F', marginBottom: 20,
        }}>L10 đã hạ chỉ 1★ · 12 / 18★ · gợi ý quay lại "cày sao"</div>

        <div style={{
          display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28,
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: W, height: H, borderRadius: 24, overflow: 'hidden',
            boxShadow: '0 14px 32px rgba(60,44,24,0.30)',
          }}>
            <WorldGateLocked />
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 14,
            paddingTop: 6,
          }}>
            <Note num="A" name="Banner cổng — tông trầm"
                  detail="surface trắng · viền mảnh #EFE0C9 · shadow mềm cocoa · không halo, không sparkle" />
            <Note num="B" name="Huy hiệu LOCKED"
                  detail="surface chìm #F4E9D8 + viền #D8C8A8 · ổ khoá nâu #6F5C44 · inset shadow" />
            <Note num="C" name="Cụm chữ"
                  detail="THẾ GIỚI 2 small-caps Nunito 10 #9B886F · Rừng rậm Fredoka 18 #5B4636" />
            <Note num="D" name="Chip ★ yêu cầu (muted)"
                  detail="nền #F4E9D8 · viền #E6D8BD · ★ #FFC23D · số 18 cocoa nhạt #8C7458" />
            <Note num="E" name="Dòng tiến độ"
                  detail="'Cần thêm 6★ để mở' Nunito 700 12 #9B886F · số '6★' #E97E45 nổi · count 12/18★ phải" />
            <Note num="F" name="Thanh tiến độ bo full"
                  detail="track #F4E9D8 inset · fill gradient 90° #FFCA66 → #FF9F68 · pct = 12/18 ≈ 67%" />
            <Note num="G" name="Pill phụ 'Cày sao ★'"
                  detail="gradient #FFE19A → #FFCA66 → #F2B548 (warning) · viền #E0A21F · bottom-edge #B98613 3D" />
            <Note num="H" name="Đường vượt cổng (mờ)"
                  detail="orange dừng ở seam dưới cổng · phía trên = white-dashed opacity 0.35 = 'unreachable yet'" />
            <Note num="I" name="Node W2 silhouette"
                  detail="stone JellyBlock 50dp · opacity 0.52 + saturate 0.4 · số mờ + ổ khoá nhỏ" />
            <Note num="J" name="Pill 'ĐANG KHOÁ'"
                  detail="chấm xám #9B886F (không glow) · Nunito 800 11 #6F5C44 · backdrop-blur nhẹ" />
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
          background: '#FFCA66', color: '#5B4636',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 0 #B98613',
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

  window.GJWorldGateLocked = WorldGateLocked;
  window.GJWorldGateLockedCard = WorldGateLockedCard;
})();
