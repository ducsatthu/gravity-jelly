/* out-of-lives-screen.jsx — OUT OF LIVES. Sad mascot, empty hearts, refill
   countdown, refill-with-coins / watch-ad / back-to-map. Renders over a
   dimmed map via Dialog. Exposes window.GJOutOfLivesScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Button, JellyBlock, Icon, Dialog } = NS;
  const EX = window.GJExtras;

  function Hearts({ full = 0, max = 5 }) {
    return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {Array.from({ length: max }).map((_, i) => (
          <Icon key={i} name="heart" size={26} color={i < full ? 'var(--color-danger)' : 'var(--color-cell-line)'} strokeWidth={i < full ? 0 : 2}
            style={i < full ? { fill: 'var(--color-danger)' } : { fill: 'var(--color-surface-sunken)' }} />
        ))}
      </div>
    );
  }

  function OutOfLivesScreen({ countdown = '24:59', refillPrice = 250, onRefill, onWatchAd, onBack }) {
    return (
      <div style={{ position: 'relative', height: '100%', background: 'var(--color-bg)' }}>
        {/* faint map hint behind */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.35, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', padding: 40 }}>
          {[['pink', 'left'], ['mint', 'right'], ['yellow', 'down'], ['blue', 'left']].map(([c, d], i) => (
            <div key={i} style={{ alignSelf: i % 2 ? 'flex-end' : 'flex-start' }}><JellyBlock color={c} size={40} direction={d} /></div>
          ))}
        </div>

        <Dialog open title="Hết lượt chơi!" icon="heart" dismissable
          onClose={onBack} style={{ animation: 'none' }}
          actions={
            <>
              <Button variant="primary" size="cta" fullWidth onClick={onRefill}>
                <EX.Coin size={20} /> Hồi đầy · {refillPrice}
              </Button>
              <Button variant="success" fullWidth onClick={onWatchAd}>
                <EX.AdBadge /> Xem quảng cáo · +1 tim
              </Button>
              <Button variant="ghost" icon="home" fullWidth onClick={onBack}>Về bản đồ</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{ animation: 'gj-bob 1800ms ease-in-out infinite' }}><JellyBlock color="blue" size={64} expression="smug" squashed /></div>
            <Hearts full={0} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'var(--color-surface-sunken)' }}>
              <EX.Clock size={18} color="var(--color-text-muted)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>Tim mới sau {countdown}</span>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }

  window.GJOutOfLivesScreen = OutOfLivesScreen;
})();
