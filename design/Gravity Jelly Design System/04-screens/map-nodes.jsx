/* map-nodes.jsx — Component reference table for level-map NODE variants.
   Renders a 2-row grid (4 + 3) on a cream board, each variant labelled in
   Nunito below. The 7 variants:
     1) Done 3★   2) Done 2★   3) Done 1★   4) Current
     5) Locked    6) Breather  7) Boss
   Documentation card — not a screen. Exposes window.GJMapNodesTable.        */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  // ─── stars ───────────────────────────────────────────────────────────
  function Star({ filled = false, size = 14 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
              fill={filled ? '#FFC23D' : '#D9CDB5'}
              stroke={filled ? '#E0A21F' : '#B6A892'}
              strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  function StarArc({ stars = 3, size = 14, width = 70 }) {
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
        <div style={{ transform: 'translateY(-2px)' }}>
          <Star filled={stars >= 2} size={size + 2} />
        </div>
        <div style={{ transform: 'translateY(5px) rotate(22deg)' }}>
          <Star filled={stars >= 3} size={size} />
        </div>
      </div>
    );
  }

  function LockGlyph({ size = 16, color = '#FFFFFF' }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
           style={{ display: 'block' }}>
        <path d="M8 11V8.5a4 4 0 1 1 8 0V11" fill="none" stroke={color}
              strokeWidth="2.6" strokeLinecap="round" />
        <rect x="5" y="11" width="14" height="9" rx="2.5" fill={color} />
        <circle cx="12" cy="15" r="1.4" fill="#A89A82" />
        <rect x="11.3" y="15" width="1.4" height="3" rx="0.6" fill="#A89A82" />
      </svg>
    );
  }

  // ─── node variants ───────────────────────────────────────────────────
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

  function DoneNode({ n, color, stars, size = 64 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size,
                    filter: 'drop-shadow(0 5px 7px rgba(120,92,52,0.22))' }}>
        <JellyBlock color={color} size={size} showEyes={false} />
        <NumberBadge n={n} size={size} />
        <StarArc stars={stars} size={14} width={size + 14} />
      </div>
    );
  }

  function CurrentNode({ n = 5 }) {
    // White disc with primary border + pulse rings + a hopping pink jelly
    // mascot (with eyes) + "Chơi ngay" pill below.
    const disc = 64;
    return (
      <div style={{ position: 'relative' }}>
        {/* outer pulse rings */}
        <div style={{
          position: 'absolute', left: -16, top: -16,
          width: disc + 32, height: disc + 32, borderRadius: '50%',
          background: 'rgba(255,159,104,0.22)',
          animation: 'gj-nt-pulse 1600ms ease-out infinite',
        }} />
        <div style={{
          position: 'absolute', left: -6, top: -6,
          width: disc + 12, height: disc + 12, borderRadius: '50%',
          background: 'rgba(255,159,104,0.32)',
          animation: 'gj-nt-pulse 1600ms ease-out infinite',
          animationDelay: '300ms',
        }} />
        {/* the disc */}
        <div style={{
          position: 'relative', width: disc, height: disc, borderRadius: '50%',
          background: '#FFFFFF',
          border: '3px solid #FF9F68',
          boxShadow:
            '0 6px 14px rgba(120,92,52,0.24), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* dashed inner ring */}
          <svg width={disc - 16} height={disc - 16} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A"
                    strokeWidth="2" strokeDasharray="3 4" />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 24, color: '#E97E45',
          }}>{n}</div>
        </div>
        {/* mascot jelly perched on top, with eyes */}
        <div style={{
          position: 'absolute', left: '50%', top: -38,
          transform: 'translateX(-50%)',
          animation: 'gj-nt-bounce 1400ms ease-in-out infinite',
          filter: 'drop-shadow(0 4px 4px rgba(120,92,52,0.28))',
        }}>
          <JellyBlock color="pink" size={38} direction="down" expression="happy" />
        </div>
        {/* shadow under the mascot */}
        <div style={{
          position: 'absolute', left: '50%', top: 6,
          transform: 'translate(-50%, 0)',
          width: 28, height: 6, borderRadius: '50%',
          background: 'rgba(120,92,52,0.22)', filter: 'blur(2px)',
          animation: 'gj-nt-shadow 1400ms ease-in-out infinite',
        }} />
        {/* "Chơi ngay" pill */}
        <div style={{
          position: 'absolute', left: '50%', top: disc + 12,
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
    );
  }

  function LockedNode({ n = 7, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size,
                    filter: 'drop-shadow(0 4px 5px rgba(120,92,52,0.20))' }}>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <LockGlyph size={Math.round(size * 0.40)} color="#FFFFFF" />
        </div>
        {/* small empty 3-star arc to show the level is rated 0 yet */}
        <StarArc stars={0} size={12} width={size + 6} />
        {/* tiny number chip on the lower-right corner */}
        <div style={{
          position: 'absolute', right: -6, bottom: -6,
          minWidth: 22, height: 22, padding: '0 6px', borderRadius: 999,
          background: '#8A7B62', border: '2px solid #FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFFFFF',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
          lineHeight: 1, boxShadow: '0 2px 4px rgba(120,92,52,0.32)',
        }}>{n}</div>
      </div>
    );
  }

  function BreatherNode({ n = 6, size = 46 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'relative', width: size, height: size,
                      filter: 'drop-shadow(0 4px 5px rgba(120,92,52,0.22))',
                      opacity: 0.94 }}>
          {/* lighter jelly tint by overlaying a faded yellow on stone */}
          <JellyBlock color="yellow" size={size} showEyes={false}
                      style={{ opacity: 0.88 }} />
          {/* sleeping eye arcs */}
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
               style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={`M ${size * 0.30} ${size * 0.42} q 4 4 8 0`} fill="none"
                  stroke="#6A4A2E" strokeWidth="2.2" strokeLinecap="round" />
            <path d={`M ${size * 0.55} ${size * 0.42} q 4 4 8 0`} fill="none"
                  stroke="#6A4A2E" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: size * 0.14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: Math.round(size * 0.30), lineHeight: 1, color: '#6A4A2E',
            textShadow: '0 1px 0 rgba(255,255,255,0.55)', pointerEvents: 'none',
          }}>{n}</div>
        </div>
        {/* "Nghỉ" tag — grey/cream chip */}
        <div style={{
          position: 'absolute', top: -8, left: size + 8,
          background: '#F4E9D8', color: '#8C7458',
          border: '1.5px solid #E6D8BD',
          fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10,
          letterSpacing: '0.10em', padding: '3px 9px', borderRadius: 999,
          boxShadow: '0 2px 5px rgba(120,92,52,0.18)', whiteSpace: 'nowrap',
        }}>NGHỈ</div>
      </div>
    );
  }

  function BossNode({ n = 10, size = 80 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size,
                    filter: 'drop-shadow(0 8px 14px rgba(126,108,240,0.40))' }}>
        {/* radial halo */}
        <div style={{
          position: 'absolute', left: -26, top: -26, right: -26, bottom: -26,
          borderRadius: '50%',
          background:
            'radial-gradient(closest-side, rgba(169,156,246,0.55) 0%, rgba(126,108,240,0.30) 55%, rgba(126,108,240,0) 78%)',
          animation: 'gj-nt-halo 2400ms ease-in-out infinite',
        }} />
        {/* spark burst ring */}
        <svg width={size + 56} height={size + 56} viewBox="0 0 200 200"
             style={{ position: 'absolute', left: -28, top: -28, pointerEvents: 'none',
                      animation: 'gj-nt-spin 8s linear infinite',
                      transformOrigin: '50% 50%' }}>
          {[0, 60, 120, 180, 240, 300].map(a => {
            const rad = (a * Math.PI) / 180;
            const cx = 100 + Math.cos(rad) * 84;
            const cy = 100 + Math.sin(rad) * 84;
            return (
              <g key={a}>
                <circle cx={cx} cy={cy} r="4.6" fill="#FFFFFF" opacity="0.95" />
                <circle cx={cx} cy={cy} r="2.6" fill="#A99CF6" />
              </g>
            );
          })}
        </svg>
        {/* stone block — same edge/gloss as the rest of the system */}
        <JellyBlock color="stone" size={size} showEyes={false} />
        {/* central gravity disc with lock */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: size * 0.5, height: size * 0.5, borderRadius: '50%',
            background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)',
            border: '3px solid #FFFFFF',
            boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LockGlyph size={Math.round(size * 0.26)} color="#FFFFFF" />
          </div>
        </div>
        {/* BOSS tag (gravity purple) */}
        <div style={{
          position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
          color: '#FFFFFF',
          border: '2px solid #6353D6',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          letterSpacing: '0.16em', padding: '4px 14px', borderRadius: 999,
          boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)',
          whiteSpace: 'nowrap',
        }}>BOSS</div>
        {/* number under the boss */}
        <div style={{
          position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
          background: '#FFFFFF', color: '#5B4636',
          border: '1.5px solid #EFE0C9',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          padding: '2px 10px', borderRadius: 999,
          boxShadow: '0 3px 6px rgba(120,92,52,0.18)',
        }}>màn {n}</div>
      </div>
    );
  }

  // ─── cell + grid ─────────────────────────────────────────────────────
  function Cell({ idx, title, sub, children, h = 200 }) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-start',
        width: 168, height: h, padding: '0 8px',
      }}>
        {/* node lives in a fixed-height showcase area so labels stay aligned */}
        <div style={{
          flex: 1, width: '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {children}
        </div>
        <div style={{
          marginTop: 6, textAlign: 'center', lineHeight: 1.18,
          fontFamily: 'var(--font-body)', color: '#5B4636',
        }}>
          <div style={{
            fontWeight: 800, fontSize: 10, letterSpacing: '0.10em',
            color: '#9B886F',
          }}>{`0${idx}`.slice(-2)}</div>
          <div style={{ fontWeight: 800, fontSize: 13, marginTop: 2 }}>{title}</div>
          {sub && <div style={{ fontWeight: 600, fontSize: 11, color: '#9B886F', marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
    );
  }

  function MapNodesTable() {
    return (
      <div style={{
        position: 'relative', width: 760, padding: '36px 28px 32px',
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        <style>{`
          @keyframes gj-nt-pulse  {
            0%   { transform: scale(0.95); opacity: 0.75; }
            70%  { transform: scale(1.45); opacity: 0;    }
            100% { transform: scale(1.45); opacity: 0;    }
          }
          @keyframes gj-nt-bounce {
            0%,100% { transform: translate(-50%, 0); }
            50%     { transform: translate(-50%, -6px); }
          }
          @keyframes gj-nt-shadow {
            0%,100% { width: 28px; opacity: 0.22; }
            50%     { width: 18px; opacity: 0.32; }
          }
          @keyframes gj-nt-halo {
            0%,100% { transform: scale(1.00); opacity: 1;    }
            50%     { transform: scale(1.12); opacity: 0.88; }
          }
          @keyframes gj-nt-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>

        {/* heading */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
            letterSpacing: '0.12em', color: '#9B886F',
          }}>04 · SCREENS / LEVEL MAP</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
            color: '#9B886F',
          }}>7 biến thể · nền #FFF7EC</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24,
          color: '#5B4636', marginBottom: 4, lineHeight: 1.05,
        }}>Bảng node · level map</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
          color: '#9B886F', marginBottom: 22,
        }}>Hoàn thành (3/2/1★) · Hiện tại · Khoá · Breather · Boss</div>

        {/* row 1 — 4 cells */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0, marginBottom: 12,
        }}>
          <Cell idx={1} title="Hoàn thành" sub="3 sao">
            <DoneNode n={1} color="yellow" stars={3} />
          </Cell>
          <Cell idx={2} title="Hoàn thành" sub="2 sao">
            <DoneNode n={2} color="mint" stars={2} />
          </Cell>
          <Cell idx={3} title="Hoàn thành" sub="1 sao">
            <DoneNode n={3} color="pink" stars={1} />
          </Cell>
          <Cell idx={4} title="Hiện tại" sub="Đang chơi" h={220}>
            <CurrentNode n={5} />
          </Cell>
        </div>

        {/* row 2 — 3 cells, centered */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0, paddingLeft: 84,
        }}>
          <Cell idx={5} title="Khoá" sub="Chưa mở">
            <LockedNode n={7} />
          </Cell>
          <Cell idx={6} title="Breather" sub="Màn nghỉ · vị trí 6">
            <BreatherNode n={6} />
          </Cell>
          <Cell idx={7} title="Boss" sub="Cuối world · vị trí 10" h={220}>
            <BossNode n={10} />
          </Cell>
        </div>

        {/* footer note */}
        <div style={{
          marginTop: 18, paddingTop: 14, borderTop: '1px dashed #E6D8BD',
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11,
          color: '#9B886F', letterSpacing: '0.02em', lineHeight: 1.55,
        }}>
          Tất cả khối jelly dùng border 3dp, gloss inset trên đỉnh, shadow-sm.
          Token bám: <b style={{ color: '#5B4636' }}>--color-block-*</b>,&nbsp;
          <b style={{ color: '#5B4636' }}>--color-stone</b>,&nbsp;
          <b style={{ color: '#5B4636' }}>--color-primary</b>,&nbsp;
          <b style={{ color: '#5B4636' }}>--color-gravity</b>.&nbsp;
          Sao đầy <b style={{ color: '#E0A21F' }}>#FFC23D</b>, sao trống xám <b>#D9CDB5</b>.
        </div>
      </div>
    );
  }

  window.GJMapNodesTable = MapNodesTable;
})();
