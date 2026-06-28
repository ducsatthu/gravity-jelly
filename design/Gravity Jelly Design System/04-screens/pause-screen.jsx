/* pause-screen.jsx — PAUSE. Soft modal over a dimmed game: quick sound/music
   toggles, Resume CTA, Restart / Settings / Quit-to-map. Renders a faux game
   behind the Dialog. Exposes window.GJPauseScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Button, JellyBlock, Icon, Dialog } = NS;

  // a faded mini board so the pause sheet reads as in-game
  function GhostBoard() {
    const grid = [
      ['yellow', 'mint', null, 'pink', null],
      ['mint', 'mint', 'blue', 'pink', 'yellow'],
      [null, 'blue', 'blue', null, 'yellow'],
      ['pink', null, 'stone', 'mint', null],
      ['pink', 'yellow', 'stone', 'mint', 'blue'],
    ];
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', filter: 'saturate(0.92)' }}>
        <div style={{ height: 'var(--dim-hud-h)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-lg)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-score)', color: 'var(--color-text)' }}>12 480</span>
          <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-gravity)' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, padding: 10, background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-lg)' }}>
            {grid.flat().map((c, i) => c ? <JellyBlock key={i} color={c} size={40} showEyes={false} /> : <div key={i} style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-cell-empty)' }} />)}
          </div>
        </div>
      </div>
    );
  }

  function QToggle({ icon, on, onToggle }) {
    return (
      <button type="button" onClick={onToggle} aria-pressed={on} style={{ flex: 1, height: 52, borderRadius: 'var(--radius-lg)', border: 'none', cursor: 'pointer', background: on ? 'var(--color-surface-sunken)' : '#EFE3CF', color: on ? 'var(--color-text)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', opacity: on ? 1 : 0.7 }}>
        <Icon name={icon} size={22} />
        {!on && <span style={{ position: 'absolute', width: 2, height: 26, background: 'var(--color-text-muted)', transform: 'rotate(45deg)', borderRadius: 2 }} />}
      </button>
    );
  }

  function PauseScreen({ sound = true, music = true, onToggle, onResume, onRestart, onSettings, onQuit }) {
    return (
      <div style={{ position: 'relative', height: '100%' }}>
        <GhostBoard />
        <Dialog open title="Tạm dừng" icon="pause" dismissable={false} style={{ animation: 'none' }}
          actions={
            <>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                <QToggle icon="volume" on={sound} onToggle={() => onToggle && onToggle('sound')} />
                <QToggle icon="music" on={music} onToggle={() => onToggle && onToggle('music')} />
              </div>
              <Button variant="primary" size="cta" icon="play" fullWidth onClick={onResume}>TIẾP TỤC</Button>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <Button variant="secondary" icon="refresh" fullWidth onClick={onRestart}>Chơi lại</Button>
                <Button variant="secondary" icon="settings" fullWidth onClick={onSettings}>Cài đặt</Button>
              </div>
              <Button variant="ghost" icon="home" fullWidth onClick={onQuit}>Thoát ra bản đồ</Button>
            </>
          }
        >
          Trò chơi đang tạm dừng. Tiến độ màn này được giữ nguyên.
        </Dialog>
      </div>
    );
  }

  window.GJPauseScreen = PauseScreen;
})();
