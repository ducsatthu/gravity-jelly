/* home-screen.jsx — HOME. Logo (jelly characters + wordmark), best score,
   Play CTA, Settings + Daily. Exposes window.GJHomeScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Button, JellyBlock, Icon } = NS;

  function Logo() {
    const tile = (color, count, dir, rot, mt) => (
      <div style={{ transform: `rotate(${rot}deg)`, marginTop: mt }}>
        <JellyBlock color={color} size={52} count={count} direction={dir} />
      </div>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          {tile('pink', 2, 'left', -8, 8)}
          {tile('yellow', 4, 'down', 4, 0)}
          {tile('mint', 3, 'right', -4, 10)}
          {tile('blue', 5, 'down', 8, 2)}
        </div>
        <div style={{ textAlign: 'center', lineHeight: 0.92 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-semibold)', fontSize: 24, letterSpacing: '0.18em', color: 'var(--color-text-muted)' }}>GRAVITY</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-extra)', fontSize: 56, color: 'var(--color-block-pink)', WebkitTextStroke: '2px var(--color-block-pink-edge)', textShadow: '0 4px 0 var(--color-block-pink-edge)' }}>JELLY</div>
        </div>
      </div>
    );
  }

  function HomeScreen({ best = 28640, onPlay, onSettings, onDaily }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--space-xl)', boxSizing: 'border-box' }}>
        {/* best score chip */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '8px 16px', background: 'var(--color-surface)', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-sm)', color: 'var(--color-text)' }}>
            <Icon name="trophy" size={18} color="var(--color-warning)" />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)' }}>KỶ LỤC</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-body)' }}>{best.toLocaleString('vi-VN')}</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo />
        </div>

        {/* actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <Button variant="primary" size="cta" icon="play" fullWidth onClick={onPlay}>CHƠI · ENDLESS</Button>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <Button variant="secondary" icon="settings" fullWidth onClick={onSettings}>Cài đặt</Button>
            <Button variant="secondary" icon="star" fullWidth onClick={onDaily}>Daily</Button>
          </div>
        </div>
      </div>
    );
  }

  window.GJHomeScreen = HomeScreen;
})();
