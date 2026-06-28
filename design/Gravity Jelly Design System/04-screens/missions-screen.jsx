/* missions-screen.jsx — MISSIONS / ACHIEVEMENTS. Daily/Achievement tabs,
   progress bars, claimable rewards. Exposes window.GJMissionsScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Icon } = NS;
  const EX = window.GJExtras;

  function Bar({ value, max, color = 'var(--color-success)' }) {
    const pct = Math.min(100, Math.round((value / max) * 100));
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 10, borderRadius: 999, background: 'var(--color-surface-sunken)', overflow: 'hidden', padding: 1.5, boxSizing: 'border-box' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: color }} />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, color: 'var(--color-text-muted)' }}>{value}/{max}</span>
      </div>
    );
  }

  function Claim({ amount, done, ready }) {
    if (done) return <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-success) 22%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="check" size={18} color="var(--color-success)" /></span>;
    return <button type="button" disabled={!ready} style={{ flexShrink: 0, border: 'none', cursor: ready ? 'pointer' : 'default', padding: '7px 12px', borderRadius: 999, background: ready ? 'var(--color-primary)' : 'var(--color-surface-sunken)', boxShadow: ready ? '0 3px 0 var(--color-primary-edge)' : 'none', display: 'inline-flex', alignItems: 'center', gap: 4, opacity: ready ? 1 : 0.8 }}>
      <EX.Coin size={16} /><span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-label)', color: ready ? '#fff' : 'var(--color-text-muted)' }}>{amount}</span>
    </button>;
  }

  function MissionRow({ glyph, color, title, value, max, reward, done, ready }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: `color-mix(in srgb, ${color} 16%, var(--color-surface))`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{glyph}</div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>{title}</span>
          <Bar value={value} max={max} color={color} />
        </div>
        <Claim amount={reward} done={done} ready={ready} />
      </div>
    );
  }

  function MissionsScreen({ tab = 'daily', onTab, onBack }) {
    const [t, setT] = React.useState(tab);
    const setTab = (k) => { setT(k); onTab && onTab(k); };
    const daily = [
      { glyph: <Icon name="rotateCw" size={26} color="var(--color-gravity)" />, color: 'var(--color-gravity)', title: 'Xoay trọng lực 20 lần', value: 20, max: 20, reward: 60, ready: true },
      { glyph: <Icon name="star" size={26} color="var(--color-warning)" />, color: 'var(--color-warning)', title: 'Đạt 3 sao 1 màn', value: 1, max: 1, reward: 80, done: true },
      { glyph: <EX.Target size={26} color="var(--color-info)" />, color: 'var(--color-info)', title: 'Dọn 150 khối', value: 96, max: 150, reward: 100 },
      { glyph: <Icon name="play" size={26} color="var(--color-success)" />, color: 'var(--color-success)', title: 'Chơi 5 màn', value: 3, max: 5, reward: 50 },
    ];
    const achv = [
      { glyph: <EX.Crown size={26} />, color: 'var(--color-warning)', title: 'Hạ 10 boss', value: 4, max: 10, reward: 300 },
      { glyph: <Icon name="trophy" size={26} color="var(--color-primary)" />, color: 'var(--color-primary)', title: 'Đạt màn 50', value: 23, max: 50, reward: 500 },
      { glyph: <Icon name="heart" size={26} color="var(--color-danger)" />, color: 'var(--color-danger)', title: 'Chuỗi combo ×9', value: 9, max: 9, reward: 250, ready: true },
      { glyph: <EX.Calendar size={26} color="var(--color-mint, var(--color-block-mint-edge))" />, color: 'var(--color-block-mint-edge)', title: 'Điểm danh 30 ngày', value: 12, max: 30, reward: 400 },
    ];
    const list = t === 'daily' ? daily : achv;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ height: 'var(--dim-hud-h)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '0 var(--space-md)' }}>
          <button type="button" onClick={onBack} aria-label="Quay lại" style={{ width: 'var(--dim-icon-btn)', height: 'var(--dim-icon-btn)', borderRadius: 'var(--radius-lg)', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="back" size={24} /></button>
          <h1 style={{ flex: 1, margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-title)', color: 'var(--color-text)' }}>Nhiệm vụ</h1>
        </div>

        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--color-surface-sunken)', borderRadius: 999, margin: '0 var(--space-lg) var(--space-md)' }}>
          {[['daily', 'Hàng ngày'], ['achv', 'Thành tựu']].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setTab(k)} style={{ flex: 1, height: 38, border: 'none', cursor: 'pointer', borderRadius: 999, background: t === k ? 'var(--color-surface)' : 'transparent', boxShadow: t === k ? 'var(--shadow-sm)' : 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-label)', color: t === k ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{l}</button>
          ))}
        </div>

        {t === 'daily' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '0 var(--space-lg) var(--space-md)', padding: '8px', borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }}>
            <EX.Clock size={16} color="var(--color-primary)" />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'var(--color-text)' }}>Làm mới sau 08:24:11</span>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-lg) var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {list.map((m, i) => <MissionRow key={i} {...m} />)}
        </div>
      </div>
    );
  }

  window.GJMissionsScreen = MissionsScreen;
})();
