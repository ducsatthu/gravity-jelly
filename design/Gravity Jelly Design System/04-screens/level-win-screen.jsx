/* level-win-screen.jsx — LEVEL WIN. Celebration: confetti, happy mascot,
   3-star result, score, coin reward, Next / Replay / Home. Exposes
   window.GJLevelWinScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Button, JellyBlock, Icon } = NS;
  const EX = window.GJExtras;

  const CONFETTI = ['var(--color-block-yellow)', 'var(--color-block-mint)', 'var(--color-block-pink)', 'var(--color-block-blue)', 'var(--color-primary)'];

  function LevelWinScreen({ level = 23, stars = 2, score = 12480, coins = 120, onNext, onReplay, onHome }) {
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 'var(--space-xl)', boxSizing: 'border-box', overflow: 'hidden' }}>
        {/* confetti */}
        {Array.from({ length: 14 }).map((_, i) => {
          const left = (i * 53 + 12) % 100, size = 8 + (i % 3) * 4, dur = 2200 + (i % 5) * 320, delay = (i % 7) * 240;
          return <div key={i} aria-hidden="true" style={{ position: 'absolute', top: -20, left: `${left}%`, width: size, height: size, borderRadius: i % 2 ? '50%' : 3, background: CONFETTI[i % CONFETTI.length], animation: `gj-confetti-fall ${dur}ms linear ${delay}ms infinite` }} />;
        })}

        <div style={{ width: '100%', background: 'var(--color-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-2xl) var(--space-xl) var(--space-xl)', boxShadow: 'var(--shadow-lg)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)', position: 'relative', zIndex: 1 }}>
          {/* stars overlap the top */}
          <div style={{ marginTop: -64 }}>
            <EX.Stars earned={stars} size={56} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <div style={{ animation: 'gj-bob 1400ms var(--ease-jelly, ease-in-out) infinite' }}>
                <JellyBlock color="mint" size={38} expression="happy" />
              </div>
              <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-title)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>Hoàn thành!</h1>
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)' }}>MÀN {level} · SÔNG &amp; THÁC</span>
          </div>

          {/* score + reward */}
          <div style={{ display: 'flex', width: '100%', gap: 'var(--space-md)' }}>
            <div style={{ flex: 1, background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)' }}>ĐIỂM</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--color-text)', lineHeight: 1 }}>{score.toLocaleString('vi-VN')}</span>
            </div>
            <div style={{ flex: 1, background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)' }}>THƯỞNG</span>
              <EX.CoinChip amount={`+${coins}`} size="lg" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', width: '100%' }}>
            <Button variant="success" size="cta" iconRight="play" fullWidth onClick={onNext}>MÀN TIẾP</Button>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <Button variant="secondary" icon="refresh" fullWidth onClick={onReplay}>Chơi lại</Button>
              <Button variant="secondary" icon="home" fullWidth onClick={onHome}>Bản đồ</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  window.GJLevelWinScreen = LevelWinScreen;
})();
