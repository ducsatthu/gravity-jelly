/* leaderboard-screen.jsx — LEADERBOARD. Single GLOBAL Endless board (no
   friends system, no user avatars). 3D candy podium (laurel + rank number,
   crown on #1, confetti / stars / leaves flourish), colored rounded-square
   rank badges, purple scores, and a pinned tangerine "you" row with inline
   name-edit. Exposes window.GJLeaderboardScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Icon } = NS;
  const EX = window.GJExtras;

  // ---- podium metal palettes (gold / silver / bronze) ----
  const METAL = {
    1: { top: '#FFE79A', bot: '#FFCB4E', edge: '#EBB43C', ink: '#8A5A12', laurel: '#C98A1E' },
    2: { top: '#ECE7DB', bot: '#CFC7B6', edge: '#BDB4A1', ink: '#6E6555', laurel: '#8C8474' },
    3: { top: '#F6CFA6', bot: '#E7A876', edge: '#D5945F', ink: '#8A4E23', laurel: '#B06B34' },
  };

  // laurel wreath framing the rank number: two symmetric branches curving up
  // around the number (matches the DS's hand-drawn glyph vocabulary)
  function Laurel({ size = 62, color, children }) {
    // left-branch leaf positions [x, y, rotation] along an upward curve; right = mirror
    const pts = [[11, 25, 65], [8, 21, 45], [6.4, 16.5, 15], [7, 12, -12], [9, 8, -35]];
    const leaf = (x, y, rot, key) => <ellipse key={key} cx={x} cy={y} rx="2.8" ry="1.5" transform={`rotate(${rot} ${x} ${y})`} fill={color} />;
    return (
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} viewBox="0 0 32 32" style={{ position: 'absolute', inset: 0 }}>
          <path d="M11 26C7 22 5.5 17 8 8" fill="none" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
          <path d="M21 26C25 22 26.5 17 24 8" fill="none" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
          {pts.map(([x, y, r], i) => leaf(x, y, r, 'l' + i))}
          {pts.map(([x, y, r], i) => leaf(32 - x, y, -r, 'r' + i))}
        </svg>
        <span style={{ position: 'relative', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.44, lineHeight: 1 }}>{children}</span>
      </div>
    );
  }

  function Podium({ rank, name, score }) {
    const h = rank === 1 ? 176 : rank === 2 ? 132 : 116;
    const m = METAL[rank];
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'flex-end', position: 'relative' }}>
        {rank === 1 && <div style={{ position: 'absolute', top: -30, zIndex: 3, animation: 'gj-bob 2600ms var(--ease-inout, ease-in-out) infinite' }}><EX.Crown size={40} /></div>}
        <div style={{ width: '100%', height: h, borderRadius: '18px 18px 0 0', paddingTop: rank === 1 ? 18 : 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          background: `linear-gradient(180deg, ${m.top} 0%, ${m.bot} 68%)`,
          borderTop: `3px solid color-mix(in srgb, ${m.top} 70%, white)`,
          boxShadow: `inset 0 -10px 18px -8px ${m.edge}, inset 3px 0 0 color-mix(in srgb, ${m.top} 80%, white), inset -3px 0 0 ${m.edge}, var(--shadow-md)` }}>
          <div style={{ color: m.ink }}><Laurel size={rank === 1 ? 66 : 56} color={m.laurel}>{rank}</Laurel></div>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: rank === 1 ? 'var(--text-body)' : 'var(--text-caption)', color: m.ink, whiteSpace: 'nowrap' }}>{name}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: rank === 1 ? 22 : 18, color: m.ink, lineHeight: 1.1 }}>{score.toLocaleString('vi-VN')}</span>
        </div>
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

  // scattered decoration in the podium header
  function Confetti() {
    const bits = [
      { l: '12%', t: 46, c: '#F090B4', r: 20, w: 10, h: 10, br: 3 },
      { l: '20%', t: 74, c: '#FFCA66', r: -15, w: 10, h: 10, br: 3 },
      { l: '33%', t: 30, c: '#66C9B8', r: 40, w: 9, h: 9, br: 2 },
      { l: '68%', t: 30, c: '#8FAAEE', r: 25, w: 9, h: 9, br: 2 },
      { l: '80%', t: 66, c: '#F3C85B', r: -20, w: 10, h: 10, br: 3 },
      { l: '88%', t: 44, c: '#F090B4', r: 15, w: 9, h: 9, br: 2 },
    ];
    return (
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {bits.map((b, i) => <span key={i} style={{ position: 'absolute', left: b.l, top: b.t, width: b.w, height: b.h, borderRadius: b.br, background: b.c, transform: `rotate(${b.r}deg)`, opacity: 0.9 }} />)}
        <div style={{ position: 'absolute', left: '26%', top: 58 }}><EX.FilledStar size={22} /></div>
        <div style={{ position: 'absolute', right: '25%', top: 40 }}><EX.FilledStar size={26} /></div>
        <span style={{ position: 'absolute', left: '9%', top: 30, color: '#FFF', fontSize: 14, fontWeight: 800 }}>✦</span>
        <span style={{ position: 'absolute', right: '10%', top: 70, color: '#CFC3AE', fontSize: 12, fontWeight: 800 }}>✦</span>
      </div>
    );
  }

  function Leaf({ flip }) {
    return (
      <svg width="70" height="60" viewBox="0 0 70 60" aria-hidden="true" style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
        <path d="M4 56C4 30 24 8 54 4c2 26-16 48-50 52z" fill="#8FD08A" />
        <path d="M14 50C22 34 34 24 48 16" stroke="#63B368" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M20 44C14 30 30 14 52 12c0 20-14 34-32 32z" fill="#A6DCA0" opacity="0.7" />
      </svg>
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
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg, #FFF7EC)' }}>
        <div style={{ height: 'var(--dim-hud-h)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '0 var(--space-md)', position: 'relative', zIndex: 4 }}>
          <button type="button" onClick={onBack} aria-label="Quay lại" style={{ width: 'var(--dim-icon-btn)', height: 'var(--dim-icon-btn)', borderRadius: 'var(--radius-lg)', border: 'none', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="back" size={24} /></button>
          <h1 style={{ flex: 1, margin: 0, textAlign: 'center', paddingRight: 'var(--dim-icon-btn)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-title)', color: 'var(--color-text)' }}>Xếp hạng</h1>
        </div>

        {/* board identity */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '4px var(--space-lg) var(--space-sm)', position: 'relative', zIndex: 4 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', height: 42, padding: '0 18px', borderRadius: 999, background: 'linear-gradient(180deg, var(--color-gravity-shine), var(--color-gravity))', boxShadow: '0 3px 0 var(--color-gravity-edge)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#fff' }}>♾️ Endless · 🌐 Toàn cầu</span>
        </div>
        <p style={{ margin: '0 var(--space-lg) 6px', textAlign: 'center', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', position: 'relative', zIndex: 4 }}>Điểm cao nhất mọi thời đại</p>

        {/* podium */}
        <div style={{ position: 'relative', padding: '0 var(--space-lg)', marginBottom: 6 }}>
          {/* clouds */}
          <div aria-hidden="true" style={{ position: 'absolute', left: -10, bottom: 40, width: 90, height: 46, borderRadius: 999, background: '#DCEBFB', filter: 'blur(2px)', opacity: 0.8 }} />
          <div aria-hidden="true" style={{ position: 'absolute', right: -6, bottom: 54, width: 70, height: 40, borderRadius: 999, background: '#DCEBFB', filter: 'blur(2px)', opacity: 0.7 }} />
          <Confetti />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, position: 'relative', paddingTop: 46 }}>
            <Podium rank={2} name={top[1].name} score={top[1].score} />
            <Podium rank={1} name={top[0].name} score={top[0].score} />
            <Podium rank={3} name={top[2].name} score={top[2].score} />
          </div>
          {/* leaves flanking the podium base (behind the bars) */}
          <div aria-hidden="true" style={{ position: 'absolute', left: -22, bottom: -12, zIndex: 0 }}><Leaf /></div>
          <div aria-hidden="true" style={{ position: 'absolute', right: -22, bottom: -12, zIndex: 0 }}><Leaf flip /></div>
        </div>

        {/* ranked list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px var(--space-lg) var(--space-md)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map((r, i) => <Row key={i} rank={i + 4} {...r} />)}
        </div>

        {/* pinned: your global rank + rename */}
        <div style={{ flexShrink: 0, padding: '6px var(--space-lg) 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: '10px 18px 10px 12px', borderRadius: 'var(--radius-xl)', background: 'color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))', boxShadow: 'inset 0 0 0 2px var(--color-primary)' }}>
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
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '2px 0 10px', color: 'var(--color-text-muted)' }}>
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
