/* boss-intro-screen.jsx — BOSS INTRO. Dramatic gravity-purple stage, big
   menacing boss jelly, BOSS banner, world/level, warning, Challenge CTA.
   Exposes window.GJBossIntroScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Button, JellyBlock, Icon } = NS;
  const EX = window.GJExtras;

  function BossIntroScreen({ level = 20, world = 'Rừng rậm', onChallenge, onClose }) {
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 'var(--space-xl)', boxSizing: 'border-box', overflow: 'hidden', background: 'radial-gradient(120% 90% at 50% 30%, #6353D6 0%, #4B3FB0 55%, #2E2670 100%)' }}>
        {/* radiating shards */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} aria-hidden="true" style={{ position: 'absolute', top: '38%', left: '50%', width: 3, height: 220, background: 'linear-gradient(var(--color-gravity-shine), transparent)', opacity: 0.18, transformOrigin: 'top center', transform: `rotate(${i * 30}deg)` }} />
        ))}

        <button type="button" onClick={onClose} aria-label="Đóng" style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)', width: 'var(--dim-icon-btn)', height: 'var(--dim-icon-btn)', borderRadius: 'var(--radius-lg)', border: 'none', background: 'rgba(255,255,255,0.16)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}><Icon name="close" size={22} /></button>

        {/* banner */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', borderRadius: 999, background: 'var(--color-warning)', boxShadow: '0 4px 0 #E2A82E', marginBottom: 'var(--space-xl)', zIndex: 1 }}>
          <EX.Crown size={20} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-heading)', letterSpacing: '0.12em', color: 'var(--color-text)' }}>BOSS</span>
        </div>

        {/* boss jelly — big gravity-colored block with menacing focus eyes */}
        <div style={{ position: 'relative', zIndex: 1, animation: 'gj-bob 2200ms ease-in-out infinite' }}>
          <div style={{ position: 'absolute', inset: -18, borderRadius: '40%', background: 'var(--color-gravity-shine)', opacity: 0.3, filter: 'blur(14px)' }} />
          <JellyBlock color="stone" size={132} style={{ background: 'var(--color-gravity)', borderColor: 'var(--color-gravity-edge)' }} />
          {/* angry eyes overlaid */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ position: 'relative', width: 34, height: 34, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 2px rgba(74,53,38,0.25)' }}>
                <div style={{ width: 17, height: 17, borderRadius: '50%', background: '#4A3526' }} />
                <div style={{ position: 'absolute', top: -3, left: i ? 'auto' : -2, right: i ? -2 : 'auto', width: 30, height: 12, background: 'var(--color-gravity)', transform: `rotate(${i ? -22 : 22}deg)`, borderRadius: 2 }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-gravity-shine)' }}>MÀN {level} · {world.toUpperCase()}</div>
          <h1 style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-title)', color: '#fff' }}>Thạch Khổng Lồ</h1>
          <p style={{ margin: '6px 0 0', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'rgba(255,255,255,0.8)', maxWidth: 250 }}>Phá lớp vỏ đá trước khi hết lượt xoay. Cẩn thận — nó phản đòn!</p>
        </div>

        <div style={{ width: '100%', marginTop: 'var(--space-xl)', zIndex: 1 }}>
          <Button variant="gravity" size="cta" icon="rotateCw" fullWidth onClick={onChallenge}>THÁCH ĐẤU</Button>
        </div>
      </div>
    );
  }

  window.GJBossIntroScreen = BossIntroScreen;
})();
