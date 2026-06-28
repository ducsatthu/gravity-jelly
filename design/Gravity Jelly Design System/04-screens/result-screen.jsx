/* result-screen.jsx — RESULT (end of run). Final + best score, rewarded-ad
   actions (x2 score, revive), replay + home. Exposes window.GJResultScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Button, JellyBlock, Icon } = NS;

  function ScoreStat({ label, value, accent }) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: accent ? 'var(--text-display)' : 'var(--text-heading)', color: accent ? 'var(--color-text)' : 'var(--color-text-muted)', lineHeight: 1 }}>{value.toLocaleString('vi-VN')}</span>
      </div>
    );
  }

  function ResultScreen({ score = 18920, best = 28640, isNewBest = false, onRevive, onReplay, onHome }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', background: 'var(--color-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-lg)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)' }}>
          {/* mascot */}
          <div style={{ marginTop: -52 }}>
            <JellyBlock color="pink" size={64} count={null} squashed />
          </div>

          <div style={{ textAlign: 'center', marginTop: -6 }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-title)', color: 'var(--color-text)' }}>Hết chỗ đặt!</h1>
            {isNewBest && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-warning)', color: 'var(--color-text)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-caption)' }}>
                <Icon name="star" size={14} /> KỶ LỤC MỚI
              </div>
            )}
          </div>

          {/* scores */}
          <div style={{ display: 'flex', width: '100%', alignItems: 'flex-end', gap: 'var(--space-md)' }}>
            <ScoreStat label="ĐIỂM" value={score} accent />
            <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--color-cell-line)' }} />
            <ScoreStat label="KỶ LỤC" value={best} />
          </div>

          {/* rewarded-ad action — revive only (x2 score feature removed) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', width: '100%' }}>
            <Button variant="danger" icon="heart" fullWidth onClick={onRevive}>Hồi sinh · xem QC</Button>
          </div>

          {/* nav */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', width: '100%' }}>
            <Button variant="secondary" icon="refresh" fullWidth onClick={onReplay}>Chơi lại</Button>
            <Button variant="ghost" icon="home" fullWidth onClick={onHome}>Về Home</Button>
          </div>
        </div>
      </div>
    );
  }

  window.GJResultScreen = ResultScreen;
})();
