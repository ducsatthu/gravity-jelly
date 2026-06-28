/* map-ftue.jsx — FTUE "LẦN ĐẦU vào map" (B5).
   ---------------------------------------------------------------------
   World 1 Đồng cỏ ở đáy. Chỉ NODE 1 sáng + pulse; các node trên khoá mờ.
   Lớp phủ scrim rgba(60,44,24,0.42) toàn màn, KHOÉT SÁNG (spotlight) quanh
   node 1 bằng kỹ thuật box-shadow spread. HAND POINTER trỏ node 1 + caption
   "Chạm để bắt đầu!". HUD "★ 0 · Đồng cỏ" dính trên, nổi trên scrim.
   Exposes window.GJMapFTUE + window.GJMapFTUECard.                       */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const W = 360;
  const H = 800;

  // node 1 spotlight target (bottom, centered-ish)
  const N1 = { x: 180, y: 596 };
  // locked nodes climbing up
  const NODES_UP = [
    { id: 2, x: 110, y: 470 },
    { id: 3, x: 244, y: 356 },
    { id: 4, x: 110, y: 250 },
    { id: 5, x: 228, y: 132 },
  ];

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
  const EXIT  = { x: 180, y: -40 };
  const FULL_PATH = pathD([ENTRY, N1, ...NODES_UP, EXIT]);

  // ─── meadow scene ─────────────────────────────────────────────────
  function Scene() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="ft-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"    stopColor="#DEF0E1" />
            <stop offset="0.55" stopColor="#DAEFD0" />
            <stop offset="1"    stopColor="#C6E8C9" />
          </linearGradient>
          <radialGradient id="ft-sun" cx="0.78" cy="0.30" r="0.5">
            <stop offset="0" stopColor="#FFF6CD" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFF6CD" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="url(#ft-sky)" />
        <rect x="0" y="0" width={W} height={H} fill="url(#ft-sun)" />

        <ellipse cx="50"  cy="150" rx="140" ry="50" fill="#BCDDB9" />
        <ellipse cx="310" cy="170" rx="150" ry="54" fill="#B0D6AB" />
        <ellipse cx="180" cy="220" rx="220" ry="72" fill="#B8D9B5" />
        <ellipse cx="60"  cy="360" rx="150" ry="58" fill="#B0D6AB" />
        <ellipse cx="300" cy="380" rx="160" ry="62" fill="#A6CFA4" />
        <ellipse cx="180" cy="440" rx="220" ry="78" fill="#B0D6AB" />
        <ellipse cx="40"  cy="580" rx="160" ry="60" fill="#A0CC9F" />
        <ellipse cx="320" cy="600" rx="160" ry="62" fill="#94C297" />
        <ellipse cx="180" cy="660" rx="240" ry="80" fill="#9CC79B" />
        <ellipse cx="60"  cy="760" rx="170" ry="64" fill="#94C297" />
        <ellipse cx="300" cy="780" rx="170" ry="66" fill="#85B988" />
        <rect x="0" y={H - 24} width={W} height="24" fill="#A4CE9E" />

        <Tree x={28}  y={170} h={28} canopy="#7FB37F" />
        <Tree x={338} y={190} h={30} canopy="#6FA86F" />
        <Tree x={24}  y={380} h={36} canopy="#5F9C66" />
        <Tree x={336} y={400} h={34} canopy="#6FA86F" />
        <Tree x={28}  y={600} h={40} canopy="#5F9C66" />
        <Tree x={336} y={620} h={42} canopy="#6FA86F" />
        <Tree x={24}  y={740} h={40} canopy="#6FA86F" />
        <Tree x={336} y={760} h={42} canopy="#5F9C66" />

        <Bush x={50}  y={240} r={18} c="#7AB07E" />
        <Bush x={310} y={260} r={20} c="#8BBE8D" />
        <Bush x={50}  y={460} r={22} c="#7AB07E" />
        <Bush x={310} y={480} r={20} c="#8BBE8D" />
        <Bush x={46}  y={660} r={22} c="#7AB07E" />
        <Bush x={310} y={680} r={20} c="#8BBE8D" />

        {[[70,200],[298,230],[80,420],[300,440],[60,640],[300,660],[80,760]].map(([x,y],i)=>(
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

  // ─── path ─────────────────────────────────────────────────────────
  function PathLayer() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block',
                    pointerEvents: 'none' }}>
        <path d={FULL_PATH} fill="none" stroke="rgba(120,92,52,0.20)"
              strokeWidth="34" strokeLinecap="round" strokeLinejoin="round"
              transform="translate(0,4)" />
        <path d={FULL_PATH} fill="none" stroke="#EAD8B7"
              strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#FFFFFF"
              strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#EFE0C9"
              strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 11" />
      </svg>
    );
  }

  // ─── locked node (stone + lock) ──────────────────────────────────
  function LockGlyph({ size = 16 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
        <path d="M8 11V8.5a4 4 0 1 1 8 0V11" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="5" y="11" width="14" height="9" rx="2.5" fill="#FFFFFF" />
        <circle cx="12" cy="15" r="1.4" fill="#A89A82" />
        <rect x="11.3" y="15" width="1.4" height="3" rx="0.6" fill="#A89A82" />
      </svg>
    );
  }
  function LockedNode({ n, x, y, size = 58 }) {
    return (
      <div style={{
        position: 'absolute', left: x - size / 2, top: y - size / 2,
        filter: 'drop-shadow(0 4px 5px rgba(120,92,52,0.20))',
      }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <JellyBlock color="stone" size={size} showEyes={false} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <LockGlyph size={Math.round(size * 0.40)} />
          </div>
          <div style={{
            position: 'absolute', right: -6, bottom: -6,
            minWidth: 22, height: 22, padding: '0 6px', borderRadius: 999,
            background: '#8A7B62', border: '2px solid #FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFFFFF', fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 11, lineHeight: 1, boxShadow: '0 2px 4px rgba(120,92,52,0.32)',
          }}>{n}</div>
        </div>
      </div>
    );
  }

  // ─── node 1 — current/playable (bright) ─────────────────────────
  function Node1Current() {
    const disc = 66;
    return (
      <div style={{
        position: 'absolute', left: N1.x - disc / 2, top: N1.y - disc / 2,
        zIndex: 30,
      }}>
        <div style={{ position: 'relative' }}>
          {/* pulse rings */}
          <div style={{
            position: 'absolute', left: -18, top: -18,
            width: disc + 36, height: disc + 36, borderRadius: '50%',
            background: 'rgba(255,159,104,0.28)',
            animation: 'gj-ft-pulse 1600ms ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', left: -6, top: -6,
            width: disc + 12, height: disc + 12, borderRadius: '50%',
            background: 'rgba(255,159,104,0.38)',
            animation: 'gj-ft-pulse 1600ms ease-out infinite',
            animationDelay: '320ms',
          }} />
          {/* disc */}
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
              fontSize: 26, color: '#E97E45',
            }}>1</div>
          </div>
          {/* mascot perched on top */}
          <div style={{
            position: 'absolute', left: '50%', top: -40,
            transform: 'translateX(-50%)',
            animation: 'gj-ft-hop 1400ms ease-in-out infinite',
            filter: 'drop-shadow(0 4px 4px rgba(120,92,52,0.30))',
          }}>
            <JellyBlock color="pink" size={40} direction="down" expression="happy" />
          </div>
        </div>
      </div>
    );
  }

  // ─── scrim with spotlight cutout (box-shadow spread) ────────────
  function ScrimSpotlight() {
    const r = 78; // spotlight radius around node 1
    return (
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
      }}>
        {/* the hole: transparent circle, huge box-shadow paints the scrim */}
        <div style={{
          position: 'absolute',
          left: N1.x - r, top: N1.y - r,
          width: r * 2, height: r * 2, borderRadius: '50%',
          background: 'transparent',
          boxShadow: '0 0 0 9999px rgba(60,44,24,0.42)',
          animation: 'gj-ft-spot 1600ms ease-in-out infinite',
        }} />
        {/* soft warm rim around the hole */}
        <div style={{
          position: 'absolute',
          left: N1.x - r, top: N1.y - r,
          width: r * 2, height: r * 2, borderRadius: '50%',
          boxShadow: 'inset 0 0 24px rgba(255,246,205,0.45)',
        }} />
      </div>
    );
  }

  // ─── hand pointer + caption ──────────────────────────────────────
  function HandPointer() {
    return (
      <div style={{
        position: 'absolute', left: N1.x + 22, top: N1.y + 16,
        zIndex: 32,
        animation: 'gj-ft-tap 1400ms ease-in-out infinite',
        transformOrigin: '20% 20%',
        filter: 'drop-shadow(0 4px 5px rgba(60,44,24,0.35))',
      }}>
        {/* tap ripple */}
        <div style={{
          position: 'absolute', left: -26, top: -26,
          width: 40, height: 40, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.85)',
          animation: 'gj-ft-ripple 1400ms ease-out infinite',
        }} />
        {/* hand */}
        <svg width="48" height="56" viewBox="0 0 48 56" aria-hidden="true">
          <g>
            <path d="M18 6c2.4 0 4 1.7 4 4v14l3-1.5c2-1 4 0 5 2l5 11c1.3 3 .4 6.6-2.2 8.6l-3 2.3c-2 1.5-4.4 2.3-6.9 2.3H17c-3 0-5.8-1.5-7.5-4l-5-7.3c-1.3-2-1-4.6.8-6.1 1.7-1.5 4.3-1.4 6 .2L14 38V10c0-2.3 1.7-4 4-4z"
                  fill="#FFFFFF" stroke="#5B4636" strokeWidth="2" strokeLinejoin="round" />
            <path d="M18 12v22" stroke="#E8D8BF" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  function Caption() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: N1.y + 96,
        transform: 'translateX(-50%)',
        zIndex: 32,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: '#FFFFFF',
        border: '1.5px solid #FFE0B8',
        padding: '10px 18px', borderRadius: 999,
        boxShadow: '0 10px 22px rgba(0,0,0,0.30), inset 0 1.5px 0 rgba(255,255,255,0.8)',
        whiteSpace: 'nowrap',
        animation: 'gj-ft-capbob 1400ms ease-in-out infinite',
      }}>
        <span style={{
          width: 10, height: 10, borderRadius: 999, background: '#FF9F68',
          boxShadow: '0 0 8px rgba(255,159,104,0.7)',
        }} />
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
          color: '#5B4636', lineHeight: 1.05,
        }}>Chạm để bắt đầu!</span>
      </div>
    );
  }

  // ─── sticky HUD (★ 0 · Đồng cỏ) — above scrim ───────────────────
  function Star({ size = 16 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
              fill="#FFC23D" stroke="#E0A21F" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  function BackArrow() {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="#5B4636" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 5l-7 7 7 7" />
      </svg>
    );
  }
  function Hud() {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40,
        height: 56, background: '#FFFFFF',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 6px 14px rgba(120,92,52,0.16)',
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
      }}>
        <button aria-label="Quay lại" style={{
          width: 48, height: 48, borderRadius: 12,
          background: '#F4E9D8', border: '1.5px solid #E6D8BD',
          boxShadow: '0 2px 0 #D8C8A8 inset',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0, flexShrink: 0,
        }}>
          <BackArrow />
        </button>
        <div style={{
          flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', lineHeight: 1.05, gap: 2,
        }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10,
            letterSpacing: '0.10em', color: '#9B886F', whiteSpace: 'nowrap',
          }}>THẾ GIỚI 1 · HÀNH TRÌNH</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
            color: '#5B4636', lineHeight: 1.05, whiteSpace: 'nowrap',
          }}>Đồng cỏ</div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#FFFFFF', border: '1.5px solid #EFE0C9',
          padding: '6px 12px 6px 10px', borderRadius: 999,
          boxShadow: '0 2px 6px rgba(120,92,52,0.16)', flexShrink: 0,
        }}>
          <Star size={16} />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
            color: '#5B4636', lineHeight: 1,
          }}>0</span>
        </div>
      </div>
    );
  }

  // ─── frame ────────────────────────────────────────────────────────
  function MapFTUE() {
    return (
      <div style={{
        position: 'relative', width: W, height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes gj-ft-pulse {
            0%   { transform: scale(0.9);  opacity: 0.85; }
            70%  { transform: scale(1.5);  opacity: 0;    }
            100% { transform: scale(1.5);  opacity: 0;    }
          }
          @keyframes gj-ft-hop {
            0%,100% { transform: translateX(-50%) translateY(0); }
            50%     { transform: translateX(-50%) translateY(-6px); }
          }
          @keyframes gj-ft-spot {
            0%,100% { box-shadow: 0 0 0 9999px rgba(60,44,24,0.42); }
            50%     { box-shadow: 0 0 0 9999px rgba(60,44,24,0.38); }
          }
          @keyframes gj-ft-tap {
            0%,100% { transform: translate(0,0) scale(1); }
            45%     { transform: translate(-8px,-8px) scale(0.9); }
            55%     { transform: translate(-8px,-8px) scale(0.9); }
          }
          @keyframes gj-ft-ripple {
            0%   { transform: scale(0.5); opacity: 0; }
            30%  { opacity: 0.9; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          @keyframes gj-ft-capbob {
            0%,100% { transform: translateX(-50%) translateY(0); }
            50%     { transform: translateX(-50%) translateY(-4px); }
          }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        <Scene />
        <PathLayer />

        {/* locked nodes (will be dimmed by scrim) */}
        {NODES_UP.map(n => <LockedNode key={n.id} n={n.id} x={n.x} y={n.y} />)}

        {/* scrim with spotlight hole over node 1 */}
        <ScrimSpotlight />

        {/* node 1 bright on top of scrim */}
        <Node1Current />

        {/* hand pointer + caption */}
        <HandPointer />
        <Caption />

        {/* sticky HUD above everything */}
        <Hud />
      </div>
    );
  }

  // ─── documentation card ────────────────────────────────────────
  function MapFTUECard() {
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
          }}>B5 · FTUE lần đầu</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26,
          color: '#5B4636', marginBottom: 4, lineHeight: 1.05,
        }}>FTUE · lần đầu vào bản đồ</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
          color: '#9B886F', marginBottom: 20,
        }}>Spotlight node 1 · scrim toàn màn · hand pointer · "Chạm để bắt đầu!"</div>

        <div style={{
          display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 28,
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: W, height: H, borderRadius: 28, overflow: 'hidden',
            boxShadow: '0 16px 36px rgba(60,44,24,0.32)',
          }}>
            <MapFTUE />
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 14,
            paddingTop: 6,
          }}>
            <Note num="A" name="Scrim toàn màn + spotlight"
                  detail="circle trong suốt + box-shadow spread 9999px rgba(60,44,24,0.42) · KHOÉT SÁNG quanh node 1 · scrim breathe 0.42↔0.38" />
            <Note num="B" name="Rim ấm quanh hố"
                  detail="inset box-shadow #FFF6CD 0.45 — viền vàng mềm để vùng sáng hoà vào cảnh" />
            <Note num="C" name="Node 1 — hiện tại (sáng)"
                  detail="đĩa trắng viền primary #FF9F68 · 2 vòng pulse 1.6s lệch pha · mascot pink hop · zIndex trên scrim" />
            <Note num="D" name="Node 2–5 — khoá mờ"
                  detail="stone JellyBlock + ổ khoá · nằm DƯỚI scrim nên tối đi · vẫn thấy lờ mờ để gợi 'còn nhiều màn'" />
            <Note num="E" name="Hand pointer"
                  detail="bàn tay trắng viền cocoa trỏ node 1 · tap −8px 1.4s + ripple ring trắng 1.4s" />
            <Note num="F" name="Caption 'Chạm để bắt đầu!'"
                  detail="pill trắng viền #FFE0B8 · Fredoka 18 #5B4636 · chấm orange glow · bob nhẹ ±4px" />
            <Note num="G" name="HUD dính '★ 0 · Đồng cỏ'"
                  detail="56dp surface trắng · Back + tiêu đề + chip ★ 0 · zIndex 40 trên scrim (chrome luôn rõ)" />
            <Note num="H" name="Đường chảy 2 mép"
                  detail="path vào từ đáy, qua node 1→5, ra mép trên — đúng quy ước map cuộn" />
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
          flexShrink: 0, boxShadow: '0 2px 0 #E97E45',
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

  window.GJMapFTUE = MapFTUE;
  window.GJMapFTUECard = MapFTUECard;
})();
