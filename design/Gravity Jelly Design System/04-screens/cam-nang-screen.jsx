/* cam-nang-screen.jsx — CẨM NANG (Handbook). A collectible list of the
   game's rules grouped in 4 sections; tapping an UNLOCKED entry opens a
   teach-style detail popup with a "real game" illustration. Locked entries
   stay dimmed & un-tappable. Two list layouts via `variant` ('rows'|'cards').
   Exposes window.GJCamNangScreen. Inline var(--token) per screen convention. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Icon } = NS;
  const { Illus } = window.GJCamNangIllus;

  /* group → accent tint for icon-chips */
  const TINT = {
    'CƠ BẢN': 'var(--color-text)',
    'SIÊU KHỐI': 'var(--color-warning)',
    'KÍCH NỔ': 'var(--color-primary)',
    COMBO: 'var(--color-gravity)',
  };

  // ── progress pill in the header ────────────────────────────────────────
  function ProgressPill({ count, total }) {
    const frac = Math.max(0, Math.min(1, count / total));
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 10px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-sunken)', flexShrink: 0 }}>
        <span style={{ width: 40, height: 6, borderRadius: 999, background: '#E6D7BE', overflow: 'hidden', flexShrink: 0 }}>
          <span style={{ display: 'block', width: `${frac * 100}%`, height: '100%', borderRadius: 999, background: 'var(--color-gravity)' }} />
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-caption)', color: 'var(--color-gravity)', whiteSpace: 'nowrap' }}>Đã mở {count}/{total}</span>
      </div>
    );
  }

  // ── locked placeholder ─────────────────────────────────────────────────
  function LockedRow({ last }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', minHeight: 56, padding: '0 var(--space-lg)', opacity: 0.45, borderBottom: last ? 'none' : '1.5px solid var(--color-cell-line)' }}>
        <span style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
          <LockGlyph size={19} />
        </span>
        <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-body)', color: 'var(--color-text-muted)' }}>Chưa mở khoá</span>
      </div>
    );
  }
  const LockGlyph = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="3" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /><circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" /></svg>
  );

  // ── compact row (variant 'rows') ───────────────────────────────────────
  function ItemRow({ entry, last, onOpen }) {
    if (!entry.unlocked) return <LockedRow last={last} />;
    return (
      <button type="button" onClick={() => onOpen(entry.id)}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', minHeight: 64, width: '100%', textAlign: 'left', padding: '0 var(--space-lg)', background: 'transparent', border: 'none', borderBottom: last ? 'none' : '1.5px solid var(--color-cell-line)', cursor: 'pointer' }}>
        <span style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-sunken)', color: TINT[entry.group], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={entry.icon} size={20} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>{entry.title}</span>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', lineHeight: 1.35, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.desc}</span>
        </span>
        <Icon name="chevron" size={20} color="var(--color-text-muted)" />
      </button>
    );
  }

  function GroupBlock({ title, children }) {
    return (
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 var(--space-sm) var(--space-sm)' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: TINT[title], flexShrink: 0, opacity: 0.9 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{title}</span>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>{children}</div>
      </div>
    );
  }

  // ── detail popup ───────────────────────────────────────────────────────
  function DetailDialog({ entry, hasNext, onNext, onClose }) {
    if (!entry) return null;
    const hiColor = entry.group === 'COMBO' || entry.id === 'rotate' ? 'var(--color-gravity)' : 'var(--color-primary)';
    const parts = entry.hi && entry.body.includes(entry.hi) ? entry.body.split(entry.hi) : [entry.body];
    return (
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--color-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)', zIndex: 50, boxSizing: 'border-box' }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 320, background: 'var(--color-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-lg)', boxSizing: 'border-box', animation: 'gj-cn-pop 300ms var(--ease-jelly) both' }}>
          <style>{`@keyframes gj-cn-pop{0%{transform:scale(0.85) translateY(8px);opacity:0}60%{transform:scale(1.03) translateY(0);opacity:1}100%{transform:scale(1)}}`}</style>
          {/* title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            <span style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-sunken)', color: 'var(--color-gravity)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={entry.icon} size={22} />
            </span>
            <h2 style={{ flex: 1, margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-heading)', color: 'var(--color-text)' }}>{entry.title}</h2>
            <button type="button" onClick={onClose} aria-label="Đóng" style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={20} /></button>
          </div>
          {/* illustration well */}
          <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg) var(--space-md)', marginBottom: 'var(--space-lg)', minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Illus id={entry.id} />
          </div>
          {/* description with highlight */}
          <p style={{ margin: '0 0 var(--space-lg)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', color: 'var(--color-text)', textWrap: 'pretty' }}>
            {parts[0]}
            {parts.length > 1 && <strong style={{ color: hiColor, fontWeight: 800 }}>{entry.hi}</strong>}
            {parts[1]}
          </p>
          {/* CTA */}
          <button type="button" onClick={hasNext ? onNext : onClose}
            style={{ position: 'relative', width: '100%', minHeight: 'var(--dim-cta-h)', border: 'none', borderRadius: 'var(--radius-xl)', background: 'var(--color-gravity)', color: 'var(--color-text-invert)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-heading)', cursor: 'pointer', boxShadow: '0 5px 0 var(--color-gravity-edge), var(--shadow-sm)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)' }}>
            <span style={{ position: 'absolute', top: 3, left: '16%', right: '16%', height: '32%', background: 'var(--color-gravity-shine)', opacity: 0.45, borderRadius: 999 }} />
            <span style={{ position: 'relative' }}>{hasNext ? 'Tiếp theo' : 'Đã hiểu'}</span>
            {hasNext && <Icon name="chevron" size={22} color="var(--color-text-invert)" style={{ position: 'relative' }} />}
          </button>
        </div>
      </div>
    );
  }

  const ORDER = ['CƠ BẢN', 'SIÊU KHỐI', 'KÍCH NỔ', 'COMBO'];

  function CamNangScreen({ entries = [], unlockedCount = 0, defaultOpenId = null, onOpen, onBack }) {
    const [openId, setOpenId] = React.useState(defaultOpenId);
    const total = entries.length;
    const open = (id) => { setOpenId(id); onOpen && onOpen(id); };

    // next unlocked entry after the current one (for "Tiếp theo")
    const unlocked = entries.filter((e) => e.unlocked);
    const curIdx = unlocked.findIndex((e) => e.id === openId);
    const next = curIdx >= 0 && curIdx < unlocked.length - 1 ? unlocked[curIdx + 1] : null;
    const cur = entries.find((e) => e.id === openId) || null;

    const grouped = ORDER.map((g) => [g, entries.filter((e) => e.group === g)]).filter(([, list]) => list.length);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* header */}
        <div style={{ height: 'var(--dim-hud-h)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '0 var(--space-md)' }}>
          <button type="button" onClick={onBack} aria-label="Quay lại" style={{ width: 'var(--dim-icon-btn)', height: 'var(--dim-icon-btn)', flexShrink: 0, borderRadius: 'var(--radius-lg)', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="back" size={24} />
          </button>
          <h1 style={{ flex: 1, margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-title)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>Cẩm nang</h1>
          <ProgressPill count={unlockedCount} total={total} />
        </div>

        {/* scrolling list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-sm) var(--space-lg) var(--space-xl)' }}>
          {grouped.map(([g, list]) => (
            <GroupBlock key={g} title={g}>
              {list.map((entry, i) => (
                <ItemRow key={entry.id} entry={entry} last={i === list.length - 1} onOpen={open} />
              ))}
            </GroupBlock>
          ))}
        </div>

        <DetailDialog entry={cur} hasNext={!!next} onNext={() => next && open(next.id)} onClose={() => setOpenId(null)} />
      </div>
    );
  }

  // canonical 13-entry data (id matches the illustration demo keys)
  CamNangScreen.ENTRIES = [
    { id: 'rotate', icon: 'rotate', group: 'CƠ BẢN', title: 'Xoay trọng lực', desc: 'Đổi hướng trọng lực 90°; D-Pad chỉ hướng, cả cụm đổ theo', body: 'Bấm nút xoay để đổi hướng trọng lực 90°. D-Pad chỉ hướng sẽ rơi — toàn bộ khối trên bàn đổ theo.', hi: 'đổi hướng trọng lực 90°' },
    { id: 'clearLine', icon: 'check', group: 'CƠ BẢN', title: 'Xóa hàng / cột', desc: 'Lấp đầy 1 hàng hoặc cột → biến mất + điểm', body: 'Lấp đầy trọn một hàng hoặc một cột — 9 ô, màu nào cũng được — để cả dãy biến mất và cộng điểm.', hi: '9 ô, màu nào cũng được' },
    { id: 'fall', icon: 'chevron', group: 'CƠ BẢN', title: 'Trọng lực rơi', desc: 'Khối rơi xuống, dừng khi gặp khối khác / đáy', body: 'Sau mỗi lần xóa, các khối phía trên rơi xuống theo trọng lực, dừng khi chạm khối khác hoặc đáy bàn.', hi: 'rơi xuống theo trọng lực' },
    { id: 'sticky', icon: 'heart', group: 'CƠ BẢN', title: 'Thạch dính', desc: 'Thạch cùng màu dính thành cụm; 1 ô bị chặn → cả cụm dừng', body: 'Các khối thạch cùng màu dính lại thành một cụm. Chỉ cần một ô bị chặn, cả cụm cùng dừng.', hi: 'dính lại thành một cụm' },
    { id: 'super', icon: 'star', group: 'SIÊU KHỐI', title: 'Siêu khối', desc: 'Lấp 1 hàng / cột / khối 3×3 cùng màu → siêu khối', body: 'Lấp đầy một hàng, một cột hoặc một khối 3×3 toàn cùng một màu để tạo ra siêu khối.', hi: 'siêu khối' },
    { id: 'rainbow', icon: 'heart', group: 'SIÊU KHỐI', title: 'Khối cầu vồng', desc: '3×3 đủ ba màu (mỗi màu 1 hàng / cột) → cầu vồng', body: 'Xếp khối 3×3 đủ ba màu — mỗi màu một hàng hoặc một cột — để tạo khối cầu vồng.', hi: 'khối cầu vồng' },
    { id: 'superL2', icon: 'trophy', group: 'SIÊU KHỐI', title: 'Siêu khối cấp 2', desc: 'Ghép 2 siêu khối cùng màu dính nhau → cấp 2', body: 'Đặt hai siêu khối cùng màu dính cạnh nhau, chúng hợp thành siêu khối cấp 2 mạnh hơn.', hi: 'siêu khối cấp 2' },
    { id: 'rainbowSuper', icon: 'trophy', group: 'SIÊU KHỐI', title: 'Cầu vồng siêu cấp', desc: 'Ghép 2 kíp nổ khác màu → cầu vồng siêu cấp (đội vương miện)', body: 'Ghép hai kíp nổ khác màu để tạo cầu vồng siêu cấp đội vương miện — sức mạnh tối thượng.', hi: 'cầu vồng siêu cấp' },
    { id: 'blastSuper', icon: 'star', group: 'KÍCH NỔ', title: 'Nổ siêu khối', desc: 'Cuốn vào hàng / cột bị xóa → quét sạch mọi ô cùng màu', body: 'Khi siêu khối bị cuốn vào hàng hoặc cột đang xóa, nó quét sạch mọi ô cùng màu trên toàn bàn.', hi: 'quét sạch mọi ô cùng màu' },
    { id: 'blastSuperL2', icon: 'trophy', group: 'KÍCH NỔ', title: 'Nổ siêu khối cấp 2', desc: 'Quét cùng màu + cả vùng 5×5 quanh tâm', body: 'Siêu khối cấp 2 quét sạch toàn bộ ô cùng màu và cả vùng 5×5 quanh tâm điểm nổ.', hi: 'vùng 5×5 quanh tâm' },
    { id: 'blastRainbow', icon: 'heart', group: 'KÍCH NỔ', title: 'Nổ cầu vồng', desc: 'Quét sạch mọi ô thuộc các màu đang KỀ nó', body: 'Khối cầu vồng khi nổ sẽ quét sạch mọi ô thuộc các màu đang kề ngay cạnh nó.', hi: 'các màu đang kề' },
    { id: 'blastRainbowSuper', icon: 'trophy', group: 'KÍCH NỔ', title: 'Nổ cầu vồng siêu cấp', desc: 'Kỹ năng tối thượng: xóa sạch TOÀN BÀN (kể cả đá)', body: 'Kỹ năng tối thượng — cầu vồng siêu cấp xóa sạch toàn bàn, kể cả những khối đá cố định.', hi: 'xóa sạch toàn bàn' },
    { id: 'comboTurn', icon: 'rotateCw', group: 'COMBO', title: 'Combo hồi lượt xoay', desc: 'Combo ×2 trở lên → +1 lượt xoay (combo dài hồi càng nhiều)', body: 'Đạt combo ×2 trở lên sẽ hồi +1 lượt xoay; combo càng dài, số lượt xoay hồi lại càng nhiều.', hi: '+1 lượt xoay' },
  ];

  window.GJCamNangScreen = CamNangScreen;
})();
