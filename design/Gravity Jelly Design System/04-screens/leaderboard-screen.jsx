/* leaderboard-screen.jsx — LEADERBOARD. Single GLOBAL Endless board (no
   friends system, no user avatars). Top-3 podium is the SUPPLIED PNG ART
   `06-svg-assets/backgrounds/leaderboard-podium-bg.jpg` (candy podium with
   gold/silver/bronze frames baked in) — names + scores are overlaid inside
   the three empty frames. Below: rank rows, pinned tangerine "you" row with
   inline name-edit. Exposes window.GJLeaderboardScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Icon } = NS;
  const BG_SRC = '../06-svg-assets/backgrounds/leaderboard-podium-bg.jpg';

  // ink colors matched to the art's three frame tints (gold / periwinkle / pink)
  const INK = {
    1: '#A5731A',
    2: '#5A65B6',
    3: '#C05F72',
  };

  // name + score overlaid inside one of the art's empty podium frames.
  // Coordinates are % of the art image (so they track any screen width).
  function FrameSlot({ rank, name, score, style }) {
    const big = rank === 1;
    return (
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: big ? 4 : 1, textAlign: 'center', color: INK[rank], ...style }}>
        <span style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: big ? 16 : 13 }}>{name}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: big ? 24 : 18, lineHeight: 1.05 }}>{score.toLocaleString('vi-VN')}</span>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: big ? 11 : 10, letterSpacing: '0.06em', opacity: 0.75 }}>ĐIỂM</span>
      </div>
    );
  }

  // colored rounded-square rank badge, per row
  const BADGE = {
    4: ['#8C7CF3', '#6353D6'], 5: ['#F3C85B', '#D9A33A'], 6: ['#66C9B8', '#45A895'],
    7: ['#8FAAEE', '#6A88DB'], 8: ['#F090B4', '#DC6494'], 9: ['#FFAE7C', '#EE8248'], 10: ['#6FD79E', '#49B679'],
  };
  function RankBadge({ rank, size = 46 }) {
    const [a, b] = BADGE[rank] || ['#C9BCA8', '#A89A82'];
    return (
      <span style={{ flexShrink: 0, width: size, height: size, borderRadius: 14, background: `linear-gradient(180deg, ${a}, ${b})`, boxShadow: `inset 0 2px 0 color-mix(in srgb, ${a} 55%, white), var(--shadow-sm)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.42, color: '#fff', textShadow: '0 1px 1px rgba(0,0,0,0.14)' }}>{rank}</span>
    );
  }

  function Row({ rank, name, score }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: '10px 18px 10px 12px', borderRadius: 'var(--radius-xl)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}>
        <RankBadge rank={rank} />
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 18, color: 'var(--color-text)' }}>{name}</span>
        <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--color-gravity-edge)' }}>{score.toLocaleString('vi-VN')}</span>
      </div>
    );
  }

  function NameDialog({ initial, onSave, onClose }) {
    const [v, setV] = React.useState(initial);
    const ref = React.useRef(null);
    React.useEffect(() => { const el = ref.current; if (el) { el.focus(); el.select(); } }, []);
    const trimmed = v.trim();
    const ok = trimmed.length >= 1 && trimmed.length <= 14;
    const save = () => { if (ok) onSave(trimmed); };
    return (
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'var(--color-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-lg)' }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 300, background: 'var(--color-surface)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-heading)', color: 'var(--color-text)' }}>Đổi tên</h2>
          <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') onClose(); }} maxLength={14} placeholder="Nhập tên của bạn"
            style={{ height: 48, borderRadius: 'var(--radius-lg)', border: 'none', boxShadow: 'inset 0 0 0 2px color-mix(in srgb, var(--color-text-muted) 30%, transparent)', background: 'var(--color-surface-sunken)', padding: '0 var(--space-md)', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-body)', color: 'var(--color-text)', outline: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: -4 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>Tối đa 14 ký tự</span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{trimmed.length}/14</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, height: 48, borderRadius: 'var(--radius-lg)', border: 'none', cursor: 'pointer', background: 'var(--color-surface-sunken)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-label)', color: 'var(--color-text-muted)' }}>Hủy</button>
            <button type="button" onClick={save} disabled={!ok} style={{ flex: 1.4, height: 48, borderRadius: 'var(--radius-lg)', border: 'none', cursor: ok ? 'pointer' : 'not-allowed', background: ok ? 'var(--color-primary)' : 'color-mix(in srgb, var(--color-primary) 40%, var(--color-surface))', boxShadow: ok ? '0 3px 0 var(--color-primary-edge)' : 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-label)', color: '#fff' }}>Lưu</button>
          </div>
        </div>
      </div>
    );
  }

  function LeaderboardScreen({ onBack }) {
    const [name, setName] = React.useState(() => {
      try { return localStorage.getItem('gj-player-name') || 'Bạn'; } catch (e) { return 'Bạn'; }
    });
    const [editing, setEditing] = React.useState(false);
    const saveName = (n) => {
      setName(n); setEditing(false);
      try { localStorage.setItem('gj-player-name', n); } catch (e) {}
    };

    const top = [
      { name: 'Mai', score: 214980 },
      { name: 'Tú', score: 198450 },
      { name: 'Khoa', score: 187210 },
    ];
    const list = [
      { name: 'Linh', score: 176040 },
      { name: 'Bảo', score: 168920 },
      { name: 'Hà', score: 159300 },
      { name: 'Nam', score: 151770 },
      { name: 'Vy', score: 144610 },
      { name: 'Quân', score: 136880 },
      { name: 'Minh', score: 129360 },
    ];
    const you = { rank: 1204, score: 42360 };

    // last-updated timestamp (now) + next daily refresh in 24h
    const stamp = React.useMemo(() => {
      const now = new Date();
      const next = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const f = (d) => d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
      return { now: f(now), next: f(next) };
    }, []);

    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', background: '#FBEFDC', overflow: 'hidden' }}>
        {/* supplied candy-podium art, width-fit + top-anchored; the top-3
            name/score slots live INSIDE this wrapper so %-coordinates map
            straight onto the image regardless of screen width */}
        <div aria-hidden="false" style={{ position: 'absolute', left: 0, top: 0, right: 0, zIndex: 1, pointerEvents: 'none' }}>
          <img src={BG_SRC} alt="" style={{ display: 'block', width: '100%', height: 'auto' }} />
          <FrameSlot rank={1} name={top[0].name} score={top[0].score} style={{ left: '35.6%', top: '13.5%', width: '29.2%', height: '15.5%' }} />
          <FrameSlot rank={2} name={top[1].name} score={top[1].score} style={{ left: '5.8%', top: '21.5%', width: '25%', height: '10.5%' }} />
          <FrameSlot rank={3} name={top[2].name} score={top[2].score} style={{ left: '70.7%', top: '23%', width: '22.8%', height: '10%' }} />
        </div>

        {/* header over the art */}
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 'var(--dim-hud-h)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '0 var(--space-md)', zIndex: 4 }}>
          <button type="button" onClick={onBack} aria-label="Quay lại" style={{ width: 'var(--dim-icon-btn)', height: 'var(--dim-icon-btn)', borderRadius: 'var(--radius-lg)', border: 'none', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="back" size={24} /></button>
          <h1 style={{ flex: 1, margin: 0, textAlign: 'center', paddingRight: 'var(--dim-icon-btn)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-title)', color: 'var(--color-text)', textShadow: '0 1px 0 rgba(255,255,255,0.7)' }}>Xếp hạng</h1>
        </div>

        {/* spacer reserving the podium art region (podium base ends at
            image y 880/2091 → height = width × 880/941) */}
        <div aria-hidden="true" style={{ flexShrink: 0, width: '100%', aspectRatio: '941 / 880' }}></div>

        {/* board identity */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0, position: 'relative', zIndex: 4, marginBottom: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', height: 36, padding: '0 16px', borderRadius: 999, background: 'linear-gradient(180deg, var(--color-gravity-shine), var(--color-gravity))', boxShadow: '0 3px 0 var(--color-gravity-edge)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: '#fff' }}>♾️ Endless · 🌐 Toàn cầu</span>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>Điểm cao nhất mọi thời đại</span>
        </div>

        {/* ranked list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px var(--space-lg) var(--space-md)', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 4 }}>
          {list.map((r, i) => <Row key={i} rank={i + 4} {...r} />)}
        </div>

        {/* pinned: your global rank + rename */}
        <div style={{ flexShrink: 0, padding: '6px var(--space-lg) 8px', position: 'relative', zIndex: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: '10px 18px 10px 12px', borderRadius: 'var(--radius-xl)', background: 'color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))', boxShadow: 'inset 0 0 0 2px var(--color-primary), var(--shadow-sm)' }}>
            <span style={{ flexShrink: 0, minWidth: 60, height: 46, padding: '0 10px', borderRadius: 14, background: 'linear-gradient(180deg, #FFE0C6, #FFCBA6)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.6), var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--color-primary-edge)' }}>{you.rank}</span>
            <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 18, color: 'var(--color-text)' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
              <span style={{ flexShrink: 0, fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.06em', color: 'var(--color-primary-edge)', background: 'color-mix(in srgb, var(--color-primary) 24%, var(--color-surface))', borderRadius: 999, padding: '3px 8px' }}>BẠN</span>
              <button type="button" onClick={() => setEditing(true)} aria-label="Đổi tên" style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--color-primary-edge)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="pencil" size={16} strokeWidth={2.2} /></button>
            </span>
            <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--color-primary-edge)' }}>{you.score.toLocaleString('vi-VN')}</span>
          </div>
        </div>

        {/* footer note */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '2px 0 10px', color: 'var(--color-text-muted)', position: 'relative', zIndex: 4 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="info" size={15} color="var(--color-text-muted)" />
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-caption)', color: 'var(--color-text)' }}>Cập nhật lúc {stamp.now}</span>
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-text-muted)' }}>Làm mới mỗi 24 giờ · dự kiến {stamp.next}</span>
        </div>

        {editing && <NameDialog initial={name} onSave={saveName} onClose={() => setEditing(false)} />}
      </div>
    );
  }

  window.GJLeaderboardScreen = LeaderboardScreen;
})();
