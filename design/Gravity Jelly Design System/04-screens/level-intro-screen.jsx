/* level-intro-screen.jsx — LEVEL INTRO (updated to the new objective system).
   Pre-level soft sheet: "Màn X · <Tên>" + world chip, a bold OBJECTIVE block
   (big hero glyph + goal sentence from the catalogue), a 3-star THRESHOLD row
   (per-unit), the level's gravity ROTATION BUDGET chip + optional NEW-MECHANIC
   chip, and the BẮT ĐẦU primary CTA. Exposes window.GJLevelIntroScreen.

   goal descriptor (one of):
     { kind:'tutorial', variant, title }      // "Tạo 1 ô Cầu vồng"
     { kind:'targets', target:'vine'|'drop', total, title } // "Phá 3 giọt nước"
     { kind:'score', target, title }          // "Đạt 450 điểm"
     { kind:'boss', name, hp, title }          // "Hạ Thần Thác — máu 10"
   stars = { unit, values:[t3,t2,t1], prefix3 }  moves/score thresholds
   mechanic = { key:'vine'|'flow'|'boss', label } */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Button, JellyBlock, Icon } = NS;
  const EX = window.GJExtras;

  const JPAL = { yellow: ['#FFE3A3', '#E8B85C'], mint: ['#A3E5D9', '#5FC3B2'], pink: ['#F7A9C0', '#E576A0'], blue: ['#B3C7F7', '#7E9CE8'] };

  /* ── HERO GLYPHS (≈104dp) ─────────────────────────────────────────── */
  function SpecialHero({ type = 'rainbow', color = 'pink', size = 104, lvl = 1 }) {
    const r = Math.round(size * 0.26);
    const rainbow = type === 'rainbow' || type === 'crown';
    const pal = JPAL[color] || JPAL.pink;
    return (
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <span style={{
          width: size, height: size, borderRadius: r, boxSizing: 'border-box', position: 'relative',
          background: rainbow ? 'conic-gradient(from 210deg,#F7A9C0,#FFE3A3,#A3E5D9,#B3C7F7,#F7A9C0)' : pal[0],
          border: `4px solid ${rainbow ? '#E576A0' : pal[1]}`,
          boxShadow: '0 0 0 3px var(--color-warning), var(--shadow-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ position: 'absolute', top: 4, left: '15%', right: '15%', height: '30%', background: 'rgba(255,255,255,0.7)', borderRadius: '50%' }} />
          {!rainbow
            ? <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" style={{ position: 'relative' }}><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" fill="#FFF6DD" stroke="#E2A82E" strokeWidth="1.6" strokeLinejoin="round" /></svg>
            : <span style={{ width: size * 0.34, height: size * 0.34, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', boxShadow: '0 0 10px rgba(255,255,255,0.9)' }} />}
        </span>
        {lvl === 2 && <span style={{ position: 'absolute', bottom: -6, right: -6, width: 28, height: 28, borderRadius: 999, background: 'var(--color-surface)', border: '3px solid var(--color-warning)', color: '#B9821C', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>}
        {type === 'crown' && <span style={{ position: 'absolute', top: -size * 0.4, left: '50%', transform: 'translateX(-50%)' }}><EX.Crown size={size * 0.5} /></span>}
      </span>
    );
  }

  function DropHero({ size = 104, count }) {
    return (
      <span style={{ position: 'relative', display: 'inline-flex', filter: 'drop-shadow(0 6px 8px rgba(95,195,178,0.35))' }}>
        <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z" fill="#A3E5D9" stroke="#5FC3B2" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9.2 15.2a2.8 2.8 0 0 0 2.2 2.6" stroke="#CBF2EB" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
        {count != null && <CountBadge n={count} />}
      </span>
    );
  }
  function VineHero({ size = 104, count }) {
    return (
      <span style={{ position: 'relative', display: 'inline-flex', filter: 'drop-shadow(0 6px 8px rgba(95,195,178,0.3))' }}>
        <svg width={size} height={size} viewBox="0 0 24 24"><ellipse cx="12" cy="20.2" rx="7.5" ry="2.4" fill="#C7A97E" /><path d="M12 20 C12 15 12 12.5 12 9.5" stroke="#5FC3B2" strokeWidth="2.6" fill="none" strokeLinecap="round" /><path d="M12 13.5 C8.6 13.5 6.4 11.3 5.8 8.4 C9.4 8.4 11.6 10.2 12 13.5Z" fill="#A3E5D9" stroke="#5FC3B2" strokeWidth="1.2" strokeLinejoin="round" /><path d="M12 11 C15.4 11 17.6 8.8 18.2 5.9 C14.6 5.9 12.4 7.7 12 11Z" fill="#A3E5D9" stroke="#5FC3B2" strokeWidth="1.2" strokeLinejoin="round" /></svg>
        {count != null && <CountBadge n={count} />}
      </span>
    );
  }
  function ScoreHero({ size = 104, target }) {
    return (
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        <EX.FilledStar size={size} earned />
        <span style={{ position: 'absolute', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.28, color: '#B9821C', textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>{target != null ? target.toLocaleString('vi-VN') : ''}</span>
      </span>
    );
  }
  function BossHero({ size = 104, hp }) {
    return (
      <span style={{ position: 'relative', display: 'inline-flex', filter: 'drop-shadow(0 6px 10px rgba(46,38,112,0.4))' }}>
        <JellyBlock color="stone" size={size} showEyes={false} style={{ background: 'var(--color-gravity)', borderColor: 'var(--color-gravity-edge)' }} />
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: size * 0.13 }}>
          {[0, 1].map((i) => (
            <span key={i} style={{ position: 'relative', width: size * 0.26, height: size * 0.26, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ width: size * 0.13, height: size * 0.13, borderRadius: '50%', background: '#4A3526' }} />
              <span style={{ position: 'absolute', top: -size * 0.05, left: i ? 'auto' : -size * 0.03, right: i ? -size * 0.03 : 'auto', width: size * 0.22, height: size * 0.09, background: 'var(--color-gravity)', transform: `rotate(${i ? -22 : 22}deg)`, borderRadius: 2 }} />
            </span>
          ))}
        </span>
        {hp != null && <span style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', display: 'inline-flex', alignItems: 'center', gap: 3, padding: '3px 9px', borderRadius: 999, background: 'var(--color-danger)', boxShadow: '0 3px 0 #C96155', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: '#fff', whiteSpace: 'nowrap' }}><Icon name="heart" size={13} color="#fff" strokeWidth={2.4} />{hp}</span>}
      </span>
    );
  }
  function CountBadge({ n }) {
    return <span style={{ position: 'absolute', bottom: -6, right: -6, minWidth: 30, height: 30, padding: '0 7px', boxSizing: 'border-box', borderRadius: 999, background: 'var(--color-surface)', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>;
  }

  function Hero({ goal, size = 58 }) {
    switch (goal.kind) {
      case 'targets': return goal.target === 'vine' ? <VineHero size={size} count={goal.total} /> : <DropHero size={size} count={goal.total} />;
      case 'score': return <ScoreHero size={size} target={goal.target} />;
      case 'boss': return <BossHero size={size} hp={goal.hp} />;
      default: {
        const v = goal.variant;
        if (v === 'rainbow') return <SpecialHero type="rainbow" size={size} />;
        if (v === 'rainbowSuper') return <SpecialHero type="crown" size={size} />;
        if (v === 'super2') return <SpecialHero type="super" color="blue" size={size} lvl={2} />;
        if (v === 'super1') return <SpecialHero type="super" color="pink" size={size} />;
        return <JellyBlock color="mint" size={size} />;
      }
    }
  }

  /* Compact level-board PREVIEW — the dynamic, per-level region. A miniature of
     the level's starting board (recessed well like the real 9×9), so it's clear
     each level shows its own layout here. `preview` = array of row strings:
     '.' empty · Y/M/P/B jelly · S stone. */
  const MINI_COL = { Y: 'yellow', M: 'mint', P: 'pink', B: 'blue' };
  function MiniBoard({ map }) {
    const cell = 24, gap = 3, cols = map[0].length;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap, padding: 8, background: '#EFE1C9', borderRadius: 'var(--radius-lg)', boxShadow: 'inset 0 2px 6px rgba(120,92,52,0.22)' }}>
        {map.flatMap((row, r) => [...row].map((ch, i) => {
          const k = r + '-' + i;
          if ('YMPB'.includes(ch)) return <div key={k} style={{ width: cell, height: cell }}><JellyBlock color={MINI_COL[ch]} size={cell} showEyes={false} /></div>;
          if (ch === 'S') return <div key={k} style={{ width: cell, height: cell }}><JellyBlock color="stone" size={cell} showEyes={false} /></div>;
          return <div key={k} style={{ width: cell, height: cell, borderRadius: 8, background: 'rgba(120,92,52,0.08)' }} />;
        }))}
      </div>
    );
  }

  /* 3-star threshold strip — uses the game's star IMAGE assets (same as the
     level map / world strips) for a consistent star across the whole product. */
  const STAR_ON = '../06-svg-assets/ui/star-on.png';
  const STAR_OFF = '../06-svg-assets/ui/star-off.png';
  function MiniStars({ n, size = 15 }) {
    return <span style={{ display: 'inline-flex', gap: 2 }}>{[0, 1, 2].map((i) => <img key={i} src={i < n ? STAR_ON : STAR_OFF} alt="" aria-hidden="true" style={{ width: size, height: size, display: 'block' }} />)}</span>;
  }
  function StarThresholds({ stars }) {
    if (!stars) return null;
    const [t3, t2, t1] = stars.values;
    const fmt = (v) => (typeof v === 'number' ? v.toLocaleString('vi-VN') : v);
    const rows = [[3, `${stars.prefix3 || ''}${fmt(t3)}`], [2, fmt(t2)], [1, fmt(t1)]];
    return (
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 'var(--space-sm)', padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-lg)', boxSizing: 'border-box' }}>
        {rows.map(([n, val], i) => (
          <React.Fragment key={n}>
            {i > 0 && <span style={{ width: 1, height: 22, background: 'var(--color-cell-line)' }} />}
            <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <MiniStars n={n} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-body)', color: 'var(--color-text)', lineHeight: 1, whiteSpace: 'nowrap' }}>{val}<span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', fontWeight: 700 }}> {stars.unit}</span></span>
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  }

  const MECH = {
    vine: { label: 'Gốc dây leo', color: 'var(--color-success)', glyph: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V9" /><path d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5zM12 11c3 0 5-2 5-5-3 0-5 2-5 5z" /></svg> },
    flow: { label: 'Dòng chảy', color: 'var(--color-info)', glyph: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8c3-2 5 2 8 0s5 2 8 0M3 14c3-2 5 2 8 0s5 2 8 0" /></svg> },
    boss: { label: 'Đánh boss', color: 'var(--color-gravity)', glyph: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.5 5 5.5.5-4 4 1 5.5L12 20l-5 3 1-5.5-4-4 5.5-.5z" /></svg> },
  };
  function Chip({ color, icon, children }) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, background: `color-mix(in srgb, ${color} 15%, transparent)`, color, boxSizing: 'border-box' }}>
        {icon}
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-body)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{children}</span>
      </span>
    );
  }

  const WORLD_ACCENT = { 'Đồng cỏ': 'var(--color-success)', 'Rừng rậm': 'var(--color-primary)', 'Sông & Thác': 'var(--color-info)' };

  function LevelIntroScreen({
    level = 6, name = 'Cầu vồng 1', world = 'Đồng cỏ', accent,
    goal = { kind: 'tutorial', variant: 'rainbow', title: 'Tạo 1 ô Cầu vồng' },
    stars = { unit: 'nước', values: ['≤3', 4, 5] },
    rotations = 20, mechanic, preview, onStart, onClose,
  }) {
    const isBoss = goal.kind === 'boss';
    const acc = accent || (isBoss ? 'var(--color-gravity)' : (WORLD_ACCENT[world] || 'var(--color-info)'));
    const board = preview || (isBoss
      ? ['..SSS..', '.SSSSS.', 'YY.S.BB', '.YY.BB.']
      : ['..PPMM.', 'YY.PP.B', 'YYMM.BB', '.MM.YBB']);
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 'var(--space-xl)', boxSizing: 'border-box' }}>
        <button type="button" onClick={onClose} aria-label="Đóng" style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)', width: 'var(--dim-icon-btn)', height: 'var(--dim-icon-btn)', borderRadius: 'var(--radius-lg)', border: 'none', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}><Icon name="close" size={22} /></button>

        <div style={{ width: '100%', background: 'var(--color-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl) var(--space-xl) var(--space-lg)', boxShadow: 'var(--shadow-lg)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
          {/* title + world */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: `color-mix(in srgb, ${acc} 16%, transparent)`, fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)', color: acc, whiteSpace: 'nowrap' }}>{isBoss && <EX.Crown size={14} />}{world.toUpperCase()}</span>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-title)', color: 'var(--color-text)', lineHeight: 1.05, whiteSpace: 'nowrap' }}>Màn {level} · {name}</h2>
          </div>

          {/* OBJECTIVE block */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-md)', background: isBoss ? 'color-mix(in srgb, var(--color-gravity) 10%, var(--color-surface-sunken))' : 'var(--color-surface-sunken)', borderRadius: 'var(--radius-xl)', boxSizing: 'border-box' }}>
            {/* dynamic per-level board preview + the objective element in front */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <span style={{ position: 'absolute', top: 6, left: 6, zIndex: 2, padding: '2px 8px', borderRadius: 999, background: 'rgba(255,247,236,0.92)', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 9, letterSpacing: '0.06em', color: 'var(--color-text-muted)', boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' }}>XEM TRƯỚC BÀN</span>
              <MiniBoard map={board} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  <span aria-hidden="true" style={{ position: 'absolute', inset: -18, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,247,236,0.97), rgba(255,247,236,0.6) 58%, transparent)' }} />
                  <span style={{ position: 'relative' }}><Hero goal={goal} size={58} /></span>
                </span>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <EX.Target size={15} color="var(--color-text-muted)" />
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>MỤC TIÊU</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-heading)', color: 'var(--color-text)', textAlign: 'center', lineHeight: 1.15 }}>
              {goal.title}{isBoss && goal.hp != null ? <span style={{ color: 'var(--color-danger)' }}> — máu {goal.hp}</span> : ''}
            </span>
          </div>

          {/* star thresholds */}
          <StarThresholds stars={stars} />

          {/* rotation budget + optional new-mechanic */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-sm)' }}>
              <Chip color="var(--color-gravity)" icon={<Icon name="rotateCw" size={17} color="var(--color-gravity)" />}>Đảo trọng lực · <b style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-gravity)' }}>{rotations}</b> lượt</Chip>
              {mechanic && MECH[mechanic.key] && <Chip color={MECH[mechanic.key].color} icon={<span style={{ color: MECH[mechanic.key].color, display: 'inline-flex' }}>{MECH[mechanic.key].glyph(17)}</span>}>{mechanic.label || MECH[mechanic.key].label}</Chip>}
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.2 }}>Số lần được đảo trọng lực trong cả màn</span>
          </div>

          <Button variant={isBoss ? 'gravity' : 'primary'} size="cta" icon="play" fullWidth onClick={onStart}>BẮT ĐẦU</Button>
        </div>
      </div>
    );
  }

  window.GJLevelIntroScreen = LevelIntroScreen;
})();
