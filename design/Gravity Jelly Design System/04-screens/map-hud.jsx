/* map-hud.jsx — Map HUD component reference card.
   Shows the sticky top HUD (back · title · ★ chip · progress strip)
   rendered on two contrasting world backgrounds so legibility of the
   surface + ink can be verified across the brightest and darkest worlds:
     • Đồng cỏ  (World 1) — light green meadow
     • Vũ trụ   (World 10) — dark cosmic purple
   Exposes window.GJMapHudCard.                                          */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { Icon } = NS;

  // ─── pieces ──────────────────────────────────────────────────────────
  function Star({ size = 14 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
              fill="#FFC23D" stroke="#E0A21F" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  function BackArrow({ size = 22, color = '#5B4636' }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
           aria-hidden="true">
        <path d="M15 5l-7 7 7 7" />
      </svg>
    );
  }

  function MapHud({ worldNumber = 1, worldName = 'Đồng cỏ',
                    totalStars = 18, target = 24,
                    nextWorldName = 'Rừng rậm' }) {
    const remaining = Math.max(0, target - totalStars);
    const pct = Math.max(0, Math.min(1, totalStars / target));
    return (
      <div style={{
        width: 360,
        background: '#FFFFFF',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 6px 14px rgba(120,92,52,0.16)',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}>
        {/* ── 56dp top bar ── */}
        <div style={{
          height: 56, display: 'flex', alignItems: 'center',
          padding: '0 14px', gap: 10,
        }}>
          {/* back button — secondary 48dp */}
          <button aria-label="Quay lại" style={{
            width: 48, height: 48, borderRadius: 12,
            background: '#F4E9D8',
            border: '1.5px solid #E6D8BD',
            boxShadow: '0 2px 0 #D8C8A8 inset',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0, color: '#5B4636',
            flexShrink: 0,
          }}>
            <BackArrow size={22} color="#5B4636" />
          </button>

          {/* centered titles */}
          <div style={{
            flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', lineHeight: 1.05, gap: 2,
          }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10,
              letterSpacing: '0.10em', color: '#9B886F', whiteSpace: 'nowrap',
            }}>{`THẾ GIỚI ${worldNumber} · HÀNH TRÌNH`}</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
              color: '#5B4636', lineHeight: 1.05, whiteSpace: 'nowrap',
            }}>{worldName}</div>
          </div>

          {/* right ★ chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#FFFFFF',
            border: '1.5px solid #EFE0C9',
            padding: '6px 12px 6px 10px', borderRadius: 999,
            boxShadow: '0 2px 6px rgba(120,92,52,0.16)',
            flexShrink: 0,
          }}>
            <Star size={16} />
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 16, color: '#5B4636', lineHeight: 1,
            }}>{totalStars}</span>
          </div>
        </div>

        {/* ── progress row ── */}
        <div style={{
          padding: '0 14px 10px',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
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
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
            color: '#9B886F', whiteSpace: 'nowrap',
          }}>
            Còn <span style={{ color: '#E97E45', fontWeight: 800 }}>{remaining}★</span>
            &nbsp;để mở <span style={{ color: '#5B4636', fontWeight: 800 }}>{nextWorldName}</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── World 1 background (Đồng cỏ — light meadow) ───────────────────
  function MeadowScene({ h = 440 }) {
    return (
      <svg width="360" height={h} viewBox={`0 0 360 ${h}`}
           style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="hud-sky-m" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"    stopColor="#DEF0E1" />
            <stop offset="0.55" stopColor="#DAEFD0" />
            <stop offset="1"    stopColor="#C6E8C9" />
          </linearGradient>
          <radialGradient id="hud-sun-m" cx="0.78" cy="0.30" r="0.5">
            <stop offset="0" stopColor="#FFF6CD" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFF6CD" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="360" height={h} fill="url(#hud-sky-m)" />
        <rect width="360" height={h} fill="url(#hud-sun-m)" />
        {/* hills */}
        <ellipse cx="50"  cy={h * 0.62}  rx="130" ry="55" fill="#B0D6AB" />
        <ellipse cx="300" cy={h * 0.66}  rx="150" ry="58" fill="#A6CFA4" />
        <ellipse cx="180" cy={h * 0.74}  rx="220" ry="78" fill="#B8D9B5" />
        <ellipse cx="80"  cy={h * 0.86}  rx="160" ry="62" fill="#9CC79B" />
        <ellipse cx="300" cy={h * 0.90}  rx="170" ry="66" fill="#94C297" />
        {/* trees */}
        <g><rect x="25" y={h*0.62} width="5" height="14" rx="2" fill="#7B5A36" /><circle cx="27" cy={h*0.60} r="14" fill="#6FA86F" /></g>
        <g><rect x="334" y={h*0.66} width="5" height="14" rx="2" fill="#7B5A36" /><circle cx="336" cy={h*0.64} r="13" fill="#7FB37F" /></g>
        <g><rect x="20" y={h*0.82} width="6" height="16" rx="2" fill="#6B4D2C" /><circle cx="23" cy={h*0.79} r="18" fill="#5F9C66" /></g>
        <g><rect x="336" y={h*0.86} width="6" height="16" rx="2" fill="#6B4D2C" /><circle cx="339" cy={h*0.83} r="18" fill="#6FA86F" /></g>
        {/* bushes + daisies */}
        <ellipse cx="60"  cy={h*0.72} rx="14" ry="9"  fill="#7AB07E" />
        <ellipse cx="304" cy={h*0.78} rx="16" ry="10" fill="#7AB07E" />
        {[ [70, 0.68], [298, 0.70], [50, 0.78], [310, 0.86], [88, 0.92] ].map(([x,t],i)=>(
          <g key={i}>
            {[0,72,144,216,288].map(a=>{
              const rad=(a*Math.PI)/180;
              return <circle key={a} cx={x+Math.cos(rad)*3} cy={h*t+Math.sin(rad)*3} r="2" fill="#FFFFFF" opacity="0.9" />;
            })}
            <circle cx={x} cy={h*t} r="1.5" fill="#F6D86B" />
          </g>
        ))}
      </svg>
    );
  }

  // ─── World 10 background (Vũ trụ — cosmic dark) ────────────────────
  function CosmosScene({ h = 440 }) {
    // a tiny deterministic star scatter
    const stars = [];
    let seed = 91;
    for (let i = 0; i < 60; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      const x = (seed % 360);
      seed = (seed * 9301 + 49297) % 233280;
      const y = (seed % h);
      seed = (seed * 9301 + 49297) % 233280;
      const r = 0.6 + ((seed % 100) / 100) * 1.4;
      seed = (seed * 9301 + 49297) % 233280;
      const op = 0.4 + ((seed % 100) / 100) * 0.55;
      stars.push({ x, y, r, op });
    }
    return (
      <svg width="360" height={h} viewBox={`0 0 360 ${h}`}
           style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="hud-sky-c" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"    stopColor="#0E0A2A" />
            <stop offset="0.45" stopColor="#1B1448" />
            <stop offset="1"    stopColor="#2D1F5C" />
          </linearGradient>
          <radialGradient id="hud-nebula" cx="0.75" cy="0.35" r="0.55">
            <stop offset="0"    stopColor="#7E6CF0" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#7E6CF0" stopOpacity="0.16" />
            <stop offset="1"    stopColor="#7E6CF0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hud-nebula2" cx="0.15" cy="0.78" r="0.5">
            <stop offset="0" stopColor="#F08A7E" stopOpacity="0.3" />
            <stop offset="1" stopColor="#F08A7E" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="360" height={h} fill="url(#hud-sky-c)" />
        <rect width="360" height={h} fill="url(#hud-nebula)" />
        <rect width="360" height={h} fill="url(#hud-nebula2)" />
        {/* stars */}
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFFFFF" opacity={s.op} />
        ))}
        {/* a few twinkles (cross sparkles) */}
        {[[280, h*0.20], [80, h*0.34], [310, h*0.55]].map(([x,y], i) => (
          <g key={i} stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.9">
            <line x1={x-5} y1={y} x2={x+5} y2={y} />
            <line x1={x} y1={y-5} x2={x} y2={y+5} />
          </g>
        ))}
        {/* a planet */}
        <g>
          <circle cx="56" cy={h*0.82} r="40" fill="url(#planet-grad)" />
          <defs>
            <radialGradient id="planet-grad" cx="0.32" cy="0.30" r="0.85">
              <stop offset="0" stopColor="#A99CF6" />
              <stop offset="0.55" stopColor="#7E6CF0" />
              <stop offset="1" stopColor="#3C2C8A" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy={h*0.82 + 4} rx="56" ry="8" fill="none"
                   stroke="#A99CF6" strokeWidth="2.5" opacity="0.55"
                   transform={`rotate(-18 60 ${h*0.82})`} />
        </g>
        {/* a comet streak */}
        <g opacity="0.7">
          <path d={`M 280 ${h*0.70} L 340 ${h*0.62}`} stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="340" cy={h*0.62} r="2.4" fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  // ─── Phone-shaped tile with HUD over a scene ───────────────────────
  function PhoneTile({ scene, label, sub, h = 440 }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
            letterSpacing: '0.12em', color: '#9B886F',
          }}>{label}</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11,
            color: '#9B886F',
          }}>{sub}</div>
        </div>
        <div style={{
          position: 'relative', width: 360, height: h,
          borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 10px 26px rgba(60,44,24,0.30)',
        }}>
          {scene}
          {/* HUD pinned to top */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
            {label.includes('VŨ TRỤ') ? (
              <MapHud worldNumber={10} worldName="Vũ trụ"
                      totalStars={228} target={240}
                      nextWorldName="Bí ẩn cuối" />
            ) : (
              <MapHud worldNumber={1} worldName="Đồng cỏ"
                      totalStars={18} target={24}
                      nextWorldName="Rừng rậm" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── card ───────────────────────────────────────────────────────────
  function MapHudCard() {
    return (
      <div style={{
        position: 'relative', width: 836, padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)',
      }}>
        {/* heading */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
            letterSpacing: '0.12em', color: '#9B886F',
          }}>04 · SCREENS / LEVEL MAP</div>
          <div style={{ flex: 1, height: 1, background: '#EFE0C9' }} />
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
            color: '#9B886F',
          }}>HUD · 360×56 + thanh tiến độ</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24,
          color: '#5B4636', marginBottom: 4, lineHeight: 1.05,
        }}>HUD bản đồ · bám dính trên cùng</div>
        <div style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
          color: '#9B886F', marginBottom: 22,
        }}>Kiểm tra độ đọc của surface #FFFFFF trên hai world tương phản nhất</div>

        {/* two phone tiles side by side */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
        }}>
          <PhoneTile
            scene={<MeadowScene />}
            label="ĐỒNG CỎ · WORLD 1"
            sub="nền sáng — green meadow"
          />
          <PhoneTile
            scene={<CosmosScene />}
            label="VŨ TRỤ · WORLD 10"
            sub="nền tối — cosmic purple"
          />
        </div>

        {/* anatomy callouts */}
        <div style={{
          marginTop: 22, padding: 16,
          background: '#FFFFFF',
          border: '1px solid #EFE0C9',
          borderRadius: 16,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
        }}>
          <Anatomy num="A" name="Nút Quay lại"
                   detail="48dp · secondary · bo 12 · icon #5B4636" />
          <Anatomy num="B" name="Tiêu đề + small-caps"
                   detail="Nunito 10 #9B886F · Fredoka 20 #5B4636" />
          <Anatomy num="C" name="Chip sao"
                   detail="surface · ★ #FFC23D · Fredoka 16" />
          <Anatomy num="D" name="Thanh tiến độ"
                   detail="nền #F4E9D8 · fill #FFCA66→#FF9F68" />
        </div>
      </div>
    );
  }

  function Anatomy({ num, name, detail }) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          width: 24, height: 24, borderRadius: 999,
          background: '#FF9F68', color: '#FFFFFF',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
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

  window.GJMapHudCard = MapHudCard;
})();
