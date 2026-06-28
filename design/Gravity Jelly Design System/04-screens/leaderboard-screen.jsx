/* leaderboard-screen.jsx — LEADERBOARD. Friends/Global tabs, top-3 podium
   with jelly avatars, ranked rows, highlighted current player. Exposes
   window.GJLeaderboardScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { JellyBlock, Icon } = NS;
  const EX = window.GJExtras;

  const AV = ['yellow', 'mint', 'pink', 'blue'];

  function Avatar({ color, size = 44, expr = 'normal' }) {
    return <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', background: `var(--color-block-${color})`, border: '3px solid var(--color-surface)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <JellyBlock color={color} size={size + 6} expression={expr} style={{ borderRadius: 0, border: 'none', boxShadow: 'none' }} />
    </div>;
  }

  function Podium({ rank, name, score, color }) {
    const h = rank === 1 ? 96 : rank === 2 ? 72 : 58;
    const medal = rank === 1 ? 'var(--color-warning)' : rank === 2 ? '#CFC3AE' : '#E0A878';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 84, alignSelf: 'flex-end' }}>
        <div style={{ position: 'relative' }}>
          {rank === 1 && <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)' }}><EX.Crown size={24} /></div>}
          <Avatar color={color} size={rank === 1 ? 56 : 48} expr={rank === 1 ? 'happy' : 'normal'} />
          <span style={{ position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: '50%', background: medal, border: '2px solid var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, color: 'var(--color-text)' }}>{rank}</span>
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-caption)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{name}</span>
        <div style={{ width: '100%', height: h, borderRadius: '12px 12px 0 0', background: `linear-gradient(180deg, color-mix(in srgb, ${medal} 60%, var(--color-surface)), color-mix(in srgb, ${medal} 30%, var(--color-surface)))`, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8, boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>{score.toLocaleString('vi-VN')}</span>
        </div>
      </div>
    );
  }

  function Row({ rank, name, score, color, you }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: '8px var(--space-md)', borderRadius: 'var(--radius-lg)', background: you ? 'color-mix(in srgb, var(--color-primary) 16%, var(--color-surface))' : 'var(--color-surface)', boxShadow: you ? '0 0 0 2px var(--color-primary)' : 'var(--shadow-sm)' }}>
        <span style={{ width: 22, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-body)', color: 'var(--color-text-muted)' }}>{rank}</span>
        <Avatar color={color} size={40} />
        <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>{you ? 'Bạn' : name}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>{score.toLocaleString('vi-VN')}</span>
      </div>
    );
  }

  function LeaderboardScreen({ tab = 'friends', onTab, onBack }) {
    const [t, setT] = React.useState(tab);
    const setTab = (k) => { setT(k); onTab && onTab(k); };
    const rows = [
      { name: 'Mai', score: 9120, color: 'pink' },
      { name: 'Tú', score: 8740, color: 'blue' },
      { name: 'Bạn', score: 8210, color: 'yellow', you: true },
      { name: 'Khoa', score: 7650, color: 'mint' },
      { name: 'Linh', score: 6980, color: 'pink' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ height: 'var(--dim-hud-h)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '0 var(--space-md)' }}>
          <button type="button" onClick={onBack} aria-label="Quay lại" style={{ width: 'var(--dim-icon-btn)', height: 'var(--dim-icon-btn)', borderRadius: 'var(--radius-lg)', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="back" size={24} /></button>
          <h1 style={{ flex: 1, margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-title)', color: 'var(--color-text)' }}>Xếp hạng</h1>
        </div>

        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--color-surface-sunken)', borderRadius: 999, margin: '0 var(--space-lg) var(--space-md)' }}>
          {[['friends', 'Bạn bè'], ['global', 'Toàn cầu']].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setTab(k)} style={{ flex: 1, height: 38, border: 'none', cursor: 'pointer', borderRadius: 999, background: t === k ? 'var(--color-surface)' : 'transparent', boxShadow: t === k ? 'var(--shadow-sm)' : 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-label)', color: t === k ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{l}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-lg) var(--space-xl)' }}>
          {/* podium top 3: order 2,1,3 */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 'var(--space-sm)', margin: 'var(--space-lg) 0 var(--space-lg)' }}>
            <Podium rank={2} name="Tú" score={8740} color="blue" />
            <Podium rank={1} name="Mai" score={9120} color="pink" />
            <Podium rank={3} name="Bạn" score={8210} color="yellow" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {rows.map((r, i) => <Row key={i} rank={i + 1} {...r} />)}
          </div>
        </div>
      </div>
    );
  }

  window.GJLeaderboardScreen = LeaderboardScreen;
})();
