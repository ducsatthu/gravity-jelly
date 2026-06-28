/* splash-screen.jsx — SPLASH / LOADING. Boot screen: logo (jelly tiles +
   wordmark), bobbing blocks, a jelly progress bar, version. Exposes
   window.GJSplashScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { JellyBlock } = NS;

  function SplashScreen({ progress = 0.68, version = '1.0.0' }) {
    const tiles = [['pink', 'left', -8], ['yellow', 'down', 4], ['mint', 'right', -4], ['blue', 'down', 8]];
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 'var(--space-xl)', boxSizing: 'border-box', background: 'radial-gradient(120% 80% at 50% 28%, #FFFDF7 0%, var(--color-bg) 58%, #F3E3CC 100%)', overflow: 'hidden' }}>
        {/* soft floating blobs in the back */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 70, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'var(--color-block-mint-shine)', opacity: 0.5, filter: 'blur(6px)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 120, right: -24, width: 90, height: 90, borderRadius: '50%', background: 'var(--color-block-pink-shine)', opacity: 0.55, filter: 'blur(6px)' }} />

        {/* logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            {tiles.map(([c, d, rot], i) => (
              <div key={i} style={{ transform: `rotate(${rot}deg)`, animation: `gj-bob 1500ms var(--ease-jelly, ease-in-out) ${i * 130}ms infinite` }}>
                <JellyBlock color={c} size={50} direction={d} expression={i === 1 ? 'happy' : 'normal'} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', lineHeight: 0.92 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-semibold)', fontSize: 22, letterSpacing: '0.18em', color: 'var(--color-text-muted)' }}>GRAVITY</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-extra)', fontSize: 54, color: 'var(--color-block-pink)', WebkitTextStroke: '2px var(--color-block-pink-edge)', textShadow: '0 4px 0 var(--color-block-pink-edge)' }}>JELLY</div>
          </div>
        </div>

        {/* progress */}
        <div style={{ position: 'absolute', bottom: 64, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)', padding: '0 var(--space-3xl)' }}>
          <div style={{ width: '100%', height: 14, borderRadius: 999, background: 'var(--color-surface-sunken)', boxShadow: 'inset 0 1px 3px var(--color-shadow-soft)', overflow: 'hidden', padding: 2, boxSizing: 'border-box' }}>
            <div style={{ width: `${Math.round(progress * 100)}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--color-block-mint), var(--color-block-blue))', boxShadow: 'var(--shadow-gloss-inset)', transition: 'width 400ms var(--ease-out)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)' }}>ĐANG TẢI… {Math.round(progress * 100)}%</span>
        </div>

        <span style={{ position: 'absolute', bottom: 22, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', opacity: 0.7 }}>v{version}</span>
      </div>
    );
  }

  window.GJSplashScreen = SplashScreen;
})();
