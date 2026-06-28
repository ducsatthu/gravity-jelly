/* level-intro-screen.jsx — LEVEL INTRO. Pre-level sheet: world + level node,
   goal, move/limit, star reward preview, Start CTA. Exposes
   window.GJLevelIntroScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Button, JellyBlock, Icon } = NS;
  const EX = window.GJExtras;

  function GoalChip({ color, count, label }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ position: 'relative' }}>
          <JellyBlock color={color} size={46} />
          <span style={{ position: 'absolute', bottom: -6, right: -6, minWidth: 22, height: 22, padding: '0 5px', boxSizing: 'border-box', borderRadius: 999, background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-text-muted)' }}>{label}</span>
      </div>
    );
  }

  function LevelIntroScreen({ level = 23, world = 'Sông & Thác', accent = 'var(--color-info)', goals, moves = 28, onStart, onClose }) {
    const g = goals || [['mint', 18, 'Dọn'], ['pink', 12, 'Dọn'], ['blue', 10, 'Dọn']];
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 'var(--space-xl)', boxSizing: 'border-box' }}>
        <button type="button" onClick={onClose} aria-label="Đóng" style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)', width: 'var(--dim-icon-btn)', height: 'var(--dim-icon-btn)', borderRadius: 'var(--radius-lg)', border: 'none', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={22} /></button>

        <div style={{ width: '100%', background: 'var(--color-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl) var(--space-xl) var(--space-lg)', boxShadow: 'var(--shadow-lg)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)' }}>
          {/* level node */}
          <div style={{ marginTop: -56, width: 84, height: 84, borderRadius: '50%', background: accent, boxShadow: `0 6px 0 color-mix(in srgb, ${accent} 70%, #000 18%), var(--shadow-md)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--color-surface)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.1em', color: 'var(--color-text-invert)', opacity: 0.85 }}>MÀN</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, color: 'var(--color-text-invert)', lineHeight: 1 }}>{level}</span>
          </div>

          <div style={{ textAlign: 'center', marginTop: -4 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)', color: accent, whiteSpace: 'nowrap' }}>{world.toUpperCase()}</div>
            <EX.Stars earned={0} size={26} style={{ marginTop: 4 }} />
          </div>

          {/* goal */}
          <div style={{ width: '100%', background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
              <EX.Target size={16} color="var(--color-text-muted)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>MỤC TIÊU</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {g.map(([c, n, l], i) => <GoalChip key={i} color={c} count={n} label={l} />)}
            </div>
          </div>

          {/* moves */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '8px 16px', borderRadius: 999, background: 'color-mix(in srgb, var(--color-gravity) 14%, transparent)' }}>
            <Icon name="rotateCw" size={18} color="var(--color-gravity)" />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-body)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{moves} lượt xoay</span>
          </div>

          <Button variant="primary" size="cta" icon="play" fullWidth onClick={onStart}>BẮT ĐẦU</Button>
        </div>
      </div>
    );
  }

  window.GJLevelIntroScreen = LevelIntroScreen;
})();
