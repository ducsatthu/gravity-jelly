/* cam-nang-screen.jsx — CẨM NANG (Handbook). Collectible rule book with a
   rich hero header (mascot + progress), filter tabs, a "NÊN XEM" spotlight,
   and section grids of illustrated rule CARDS (board thumbnail + title +
   desc + "Đã xem"). Tapping an unlocked card opens a teach-style popup with a
   "real game" illustration. Locked cards stay dimmed & un-tappable.
   Exposes window.GJCamNangScreen. Inline var(--token) per screen convention. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Icon, JellyBlock } = NS;
  const { Illus, MiniBoard, SpecialBlock } = window.GJCamNangIllus;

  // Shared card look — drawn natively (no image). White surface, soft candy
  // shadow, thin warm border. Top-right corner is squared off so the CSS
  // dog-ear fold sits crisply in it.
  const cardStyle = (extra = {}) => ({
    position: 'relative',
    background: 'var(--color-surface)',
    borderRadius: '20px 0 20px 20px',
    border: '1.5px solid rgba(150,120,80,0.16)',
    boxShadow: 'var(--shadow-md)',
    ...extra,
  });

  // Pure-CSS folded page corner (dog-ear) at the top-right. The card's own
  // top-right corner is squared (radius 0) so the flap sits flush in it. The
  // flap is a clip-path triangle covering exactly the corner, shaded like the
  // paper underside (lighter at the outer corner, darker toward the crease),
  // lifting off the card with a soft down-left shadow and a bright crease line.
  function Peel({ size = 30 }) {
    const diag = Math.round(size * 1.414);
    return (
      <div style={{ position: 'absolute', top: 0, right: 0, width: size, height: size, pointerEvents: 'none', zIndex: 3 }}>
        {/* folded flap — underside of the page, lifting off the card */}
        <div style={{
          position: 'absolute', inset: 0,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
          background: 'linear-gradient(225deg, #F2E1C0 0%, #E7D2AE 52%, #D6BC90 100%)',
          borderTopRightRadius: 3,
          filter: 'drop-shadow(-2px 3px 2.5px rgba(120,92,52,0.30))',
        }} />
        {/* crease highlight running along the fold diagonal (top-left → bottom-right) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: diag, height: 2,
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 28%, rgba(255,255,255,0.85) 72%, rgba(255,255,255,0) 100%)',
          borderRadius: 2, transformOrigin: 'top left', transform: 'rotate(45deg)',
        }} />
      </div>
    );
  }

  const ORDER = ['CƠ BẢN', 'SIÊU KHỐI', 'KÍCH NỔ', 'COMBO'];
  const GROUP_LABEL = { 'CƠ BẢN': 'Cơ bản', 'SIÊU KHỐI': 'Siêu khối', 'KÍCH NỔ': 'Kích nổ', COMBO: 'Mẹo' };
  const GROUP_JELLY = { 'CƠ BẢN': 'mint', 'SIÊU KHỐI': 'yellow', 'KÍCH NỔ': 'pink', COMBO: 'blue' };
  const TABS = [{ key: 'all', label: 'Tất cả', color: 'yellow' }].concat(
    ORDER.map((g) => ({ key: g, label: GROUP_LABEL[g], color: GROUP_JELLY[g] }))
  );

  // ── small building blocks ───────────────────────────────────────────────

  // scalloped badge (Mới / Quan trọng)
  function Seal({ children, tone = 'warning' }) {
    return (
      <span style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '6px 12px', borderRadius: 'var(--radius-full)',
        background: `var(--color-${tone})`, color: 'var(--color-text-on-block)',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, lineHeight: 1.05, textAlign: 'center',
        boxShadow: `0 3px 0 rgba(180,140,40,0.35), var(--shadow-sm)`,
        border: '2px solid rgba(255,255,255,0.7)', whiteSpace: 'pre-line',
      }}>{children}</span>
    );
  }

  function SeenTag() {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
        Đã xem
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="check" size={12} color="var(--color-text-invert)" strokeWidth={3} />
        </span>
      </span>
    );
  }

  const LockGlyph = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="3" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /><circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" /></svg>
  );

  // ── mascot holding a little book ─────────────────────────────────────────
  function MascotBook({ size = 62 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, filter: 'drop-shadow(0 6px 8px rgba(120,92,52,0.22))' }}>
        <JellyBlock color="pink" size={size} expression="happy" />
        {/* little candy book tucked in front */}
        <div style={{
          position: 'absolute', right: -6, bottom: 2, width: size * 0.5, height: size * 0.4,
          borderRadius: 6, background: 'var(--color-block-yellow)', border: '2.5px solid var(--color-block-yellow-edge)',
          transform: 'rotate(-8deg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <span style={{ position: 'absolute', left: 3, top: 3, bottom: 3, width: 3, borderRadius: 2, background: 'var(--color-block-yellow-shine)' }} />
          <Icon name="star" size={size * 0.2} color="var(--color-warning)" strokeWidth={0} style={{ fill: 'var(--color-warning)' }} />
        </div>
      </div>
    );
  }

  // ── header hero card ─────────────────────────────────────────────────────
  function HeaderCard({ count, total, onBack }) {
    const frac = Math.max(0, Math.min(1, total ? count / total : 0));
    return (
      <div style={cardStyle({ padding: '14px 16px' })}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <button type="button" onClick={onBack} aria-label="Quay lại" style={{
            width: 44, height: 44, flexShrink: 0, borderRadius: '50%', border: '2px solid var(--color-cell-line)',
            background: 'var(--color-surface)', color: 'var(--color-text)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', marginTop: 2,
          }}><Icon name="back" size={22} strokeWidth={2.6} /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, lineHeight: 1.02, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>Cẩm nang</h1>
            <p style={{ margin: '3px 0 0', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: 'var(--color-text-muted)' }}>Mẹo nhỏ để phá màn khó</p>
          </div>
          <MascotBook size={56} />
        </div>
        {/* progress */}
        <div style={{ position: 'relative', marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-full)', padding: '6px 10px' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12.5, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>Đã mở {count}/{total}</span>
          <span style={{ flex: 1, height: 12, borderRadius: 999, background: '#E6D7BE', overflow: 'hidden' }}>
            <span style={{ display: 'block', width: `${frac * 100}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(180deg, var(--color-gravity-shine), var(--color-gravity))', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.35)' }} />
          </span>
        </div>
      </div>
    );
  }

  // ── filter tabs ──────────────────────────────────────────────────────────
  function FilterTabs({ value, onChange }) {
    return (
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 2px 4px', margin: '0 -2px', scrollbarWidth: 'none' }}>
        {TABS.map((t) => {
          const active = value === t.key;
          return (
            <button key={t.key} type="button" onClick={() => onChange(t.key)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0,
              padding: '7px 14px 7px 8px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
              border: active ? 'none' : '2px solid var(--color-cell-line)',
              background: active ? 'var(--color-primary)' : 'var(--color-surface)',
              color: active ? 'var(--color-text-invert)' : 'var(--color-text)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap',
              boxShadow: active ? '0 4px 0 var(--color-primary-edge), var(--shadow-sm)' : 'var(--shadow-sm)',
            }}>
              <span style={{ width: 24, height: 24, flexShrink: 0, display: 'inline-flex' }}><JellyBlock color={t.color} size={24} /></span>
              {t.label}
            </button>
          );
        })}
      </div>
    );
  }

  // ── section header pill ───────────────────────────────────────────────────
  function SectionHeader({ group }) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '6px 16px 6px 8px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', margin: '4px 0 12px', alignSelf: 'flex-start' }}>
        <span style={{ width: 28, height: 28, display: 'inline-flex' }}><JellyBlock color={GROUP_JELLY[group]} size={28} /></span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{GROUP_LABEL[group]}</span>
      </div>
    );
  }

  // ── thumbnails (a mini board / power block per rule) ──────────────────────
  function ThumbWell({ children, tint, h = 88 }) {
    return (
      <div style={{ height: h, borderRadius: 'var(--radius-md)', background: tint || 'var(--color-cell-empty)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: 'inset 0 1px 3px var(--color-shadow-soft)' }}>{children}</div>
    );
  }

  function Thumb({ id, group }) {
    switch (id) {
      case 'rotate':
        return <ThumbWell><MiniBoard cell={15} rows={['.Y..', '.PB.', 'YPBM']} /></ThumbWell>;
      case 'clearLine':
        return <ThumbWell><MiniBoard cell={14} glow={new Set(['1-0', '1-1', '1-2', '1-3', '1-4'])} rows={['..Y..', 'MYPBM']} /></ThumbWell>;
      case 'fall':
        return <ThumbWell><MiniBoard cell={15} rows={['Y.M.', '....', 'B.PY']} /></ThumbWell>;
      case 'sticky':
        return <ThumbWell><MiniBoard cell={16} rows={['.MM.', 'MMM.', '.M.S']} /></ThumbWell>;
      case 'rainbow':
        return <ThumbWell><MiniBoard cell={15} rows={['YYY', 'MMM', 'BBB']} /></ThumbWell>;
      case 'super':
        return <ThumbWell tint="var(--color-block-pink-shine)"><SpecialBlock type="super" color="pink" size={52} /></ThumbWell>;
      case 'superL2':
        return <ThumbWell><div style={{ display: 'flex', gap: 4 }}><SpecialBlock type="super" color="blue" size={34} /><SpecialBlock type="super" color="blue" size={34} lvl={2} /></div></ThumbWell>;
      case 'rainbowSuper':
        return <ThumbWell><div style={{ paddingTop: 10 }}><SpecialBlock type="crown" size={44} /></div></ThumbWell>;
      case 'blastSuper':
        return <ThumbWell><MiniBoard cell={13} glow={new Set(['0-1', '1-0', '1-3', '2-1', '3-2'])} rows={['.P.B', 'P.MP', 'BPYP', 'MMPB']} /></ThumbWell>;
      case 'blastSuperL2':
        return <ThumbWell><MiniBoard cell={13} glow={new Set(['1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-1', '3-2', '3-3'])} rows={['BMPYB', 'BYBPM', 'MYBYP', 'PBMBY', 'YPBMP']} /></ThumbWell>;
      case 'blastRainbow':
        return <ThumbWell><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><SpecialBlock type="rainbow" size={38} /><MiniBoard cell={13} rows={['Y', 'M', 'B']} /></div></ThumbWell>;
      case 'blastRainbowSuper':
        return <ThumbWell><div style={{ paddingTop: 10 }}><SpecialBlock type="crown" color="pink" size={42} /></div></ThumbWell>;
      case 'comboTurn':
        return (
          <ThumbWell tint="var(--color-block-blue-shine)">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-gravity)', color: 'var(--color-text-invert)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, boxShadow: '0 4px 0 var(--color-gravity-edge)' }}>×2</div>
            <span style={{ marginLeft: 8, padding: '3px 9px', borderRadius: 999, background: 'var(--color-success)', color: 'var(--color-text-invert)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14 }}>+1</span>
          </ThumbWell>
        );
      default:
        return <ThumbWell><MiniBoard cell={16} rows={['.MM.', 'MMM.', '.M.S']} /></ThumbWell>;
    }
  }

  // ── the "NÊN XEM" spotlight ────────────────────────────────────────────────
  function Spotlight({ entry, onOpen }) {
    if (!entry) return null;
    return (
      <div style={cardStyle({ padding: '16px 18px' })}>
        <Peel size={30} />
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 4 }}><Seal tone="warning">Mới</Seal></div>
        <div style={{ position: 'relative', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 120, flexShrink: 0 }}><Thumb id={entry.id} group={entry.group} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, letterSpacing: 'var(--tracking-wide)', color: 'var(--color-gravity)', whiteSpace: 'nowrap' }}>
              <Icon name="star" size={13} color="var(--color-gravity)" style={{ fill: 'var(--color-gravity)' }} strokeWidth={0} /> NÊN XEM
            </div>
            <h3 style={{ margin: '3px 0 4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 23, lineHeight: 1.05, color: 'var(--color-text)' }}>{entry.title}</h3>
            <p style={{ margin: '0 0 12px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, lineHeight: 1.3, color: 'var(--color-text-muted)', textWrap: 'pretty' }}>{entry.desc}</p>
            <button type="button" onClick={() => onOpen(entry.id)} style={{
              position: 'relative', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer',
              padding: '10px 22px', background: 'var(--color-primary)', color: 'var(--color-text-invert)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap',
              boxShadow: '0 5px 0 var(--color-primary-edge), var(--shadow-sm)',
            }}>
              <span style={{ position: 'absolute', top: 3, left: '18%', right: '18%', height: '30%', background: 'var(--color-primary-shine)', opacity: 0.5, borderRadius: 999 }} />
              <span style={{ position: 'relative' }}>Xem mẹo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── wide "important" rule card (section hero) ─────────────────────────────
  function WideCard({ entry, seen, onOpen }) {
    return (
      <button type="button" onClick={() => onOpen(entry.id)} style={cardStyle({
        width: '100%', textAlign: 'left', cursor: 'pointer', border: '1.5px solid rgba(150,120,80,0.16)',
        padding: '16px 18px', marginBottom: 14,
        display: 'flex', gap: 14, alignItems: 'center',
      })}>
        <Peel size={30} />
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 4 }}><Seal tone="warning">{'Quan\ntrọng'}</Seal></div>
        <div style={{ width: 120, flexShrink: 0 }}><Thumb id={entry.id} group={entry.group} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, lineHeight: 1.05, color: 'var(--color-text)' }}>{entry.title}</h3>
          <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, lineHeight: 1.3, color: 'var(--color-text-muted)', textWrap: 'pretty' }}>{entry.desc}</p>
          {seen && <SeenTag />}
        </div>
      </button>
    );
  }

  // ── 2-col rule card ────────────────────────────────────────────────────────
  function EntryCard({ entry, seen, onOpen }) {
    if (!entry.unlocked) {
      return (
        <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', padding: '14px 16px', background: 'var(--color-surface-sunken)', border: '1.5px solid rgba(150,120,80,0.14)', opacity: 0.85 }}>
          <div style={{ height: 88, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-sunken)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
            <LockGlyph size={26} />
          </div>
          <div style={{ marginTop: 10, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--color-text-muted)' }}>Chưa mở khoá</div>
          <div style={{ marginTop: 2, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-text-muted)' }}>Chơi tiếp để mở</div>
        </div>
      );
    }
    return (
      <button type="button" onClick={() => onOpen(entry.id)} style={cardStyle({
        display: 'flex', flexDirection: 'column', textAlign: 'left', width: '100%', cursor: 'pointer',
        border: '1.5px solid rgba(150,120,80,0.16)', padding: '14px 16px',
      })}>
        <Peel size={26} />
        <Thumb id={entry.id} group={entry.group} />
        <div style={{ marginTop: 10, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, lineHeight: 1.08, color: 'var(--color-text)' }}>{entry.title}</div>
        <div style={{ marginTop: 3, flex: 1, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, lineHeight: 1.3, color: 'var(--color-text-muted)', textWrap: 'pretty' }}>{entry.desc}</div>
        {seen && <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}><SeenTag /></div>}
      </button>
    );
  }

  function CardGrid({ list, seenSet, onOpen }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
        {list.map((e) => <EntryCard key={e.id} entry={e} seen={seenSet.has(e.id)} onOpen={onOpen} />)}
      </div>
    );
  }

  // ── detail popup (teach card) ──────────────────────────────────────────────
  function DetailDialog({ entry, hasNext, onNext, onClose }) {
    if (!entry) return null;
    const hiColor = entry.group === 'COMBO' || entry.id === 'rotate' ? 'var(--color-gravity)' : 'var(--color-primary)';
    const parts = entry.hi && entry.body.includes(entry.hi) ? entry.body.split(entry.hi) : [entry.body];
    return (
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--color-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)', zIndex: 50, boxSizing: 'border-box' }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 320, background: 'var(--color-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-lg)', boxSizing: 'border-box', animation: 'gj-cn-pop 300ms var(--ease-jelly) both' }}>
          <style>{`@keyframes gj-cn-pop{0%{transform:scale(0.85) translateY(8px);opacity:0}60%{transform:scale(1.03) translateY(0);opacity:1}100%{transform:scale(1)}}`}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            <span style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-sunken)', color: 'var(--color-gravity)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={entry.icon} size={22} />
            </span>
            <h2 style={{ flex: 1, margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-heading)', color: 'var(--color-text)' }}>{entry.title}</h2>
            <button type="button" onClick={onClose} aria-label="Đóng" style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={20} /></button>
          </div>
          <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg) var(--space-md)', marginBottom: 'var(--space-lg)', minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Illus id={entry.id} />
          </div>
          <p style={{ margin: '0 0 var(--space-lg)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', color: 'var(--color-text)', textWrap: 'pretty' }}>
            {parts[0]}
            {parts.length > 1 && <strong style={{ color: hiColor, fontWeight: 800 }}>{entry.hi}</strong>}
            {parts[1]}
          </p>
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

  // ── screen ─────────────────────────────────────────────────────────────────
  // groups whose first unlocked entry is shown as a wide "important" hero
  const HERO_GROUP = { 'SIÊU KHỐI': 'super' };

  function CamNangScreen({ entries = [], unlockedCount = 0, defaultOpenId = null, onOpen, onBack }) {
    const [openId, setOpenId] = React.useState(defaultOpenId);
    const [filter, setFilter] = React.useState('all');
    const total = entries.length;
    const open = (id) => { setOpenId(id); onOpen && onOpen(id); };

    const unlocked = entries.filter((e) => e.unlocked);
    const seenSet = new Set(unlocked.map((e) => e.id)); // demo: unlocked = seen
    const curIdx = unlocked.findIndex((e) => e.id === openId);
    const next = curIdx >= 0 && curIdx < unlocked.length - 1 ? unlocked[curIdx + 1] : null;
    const cur = entries.find((e) => e.id === openId) || null;

    const spotlight = entries.find((e) => e.id === 'rotate' && e.unlocked) || unlocked[0] || null;

    const visibleGroups = (filter === 'all' ? ORDER : [filter])
      .map((g) => [g, entries.filter((e) => e.group === g)])
      .filter(([, list]) => list.length);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'url(../06-svg-assets/backgrounds/cam-nang-bg.png) center top / cover no-repeat, var(--color-bg)' }}>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div style={{ padding: '12px 14px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <HeaderCard count={unlockedCount} total={total} onBack={onBack} />
            <FilterTabs value={filter} onChange={setFilter} />
            {filter === 'all' && <Spotlight entry={spotlight} onOpen={open} />}

            {visibleGroups.map(([g, list]) => {
              const heroId = HERO_GROUP[g];
              const hero = heroId ? list.find((e) => e.id === heroId && e.unlocked) : null;
              const rest = hero ? list.filter((e) => e.id !== hero.id) : list;
              return (
                <div key={g}>
                  <SectionHeader group={g} />
                  {hero && <WideCard entry={hero} seen={seenSet.has(hero.id)} onOpen={open} />}
                  <CardGrid list={rest} seenSet={seenSet} onOpen={open} />
                </div>
              );
            })}
          </div>
        </div>

        <DetailDialog entry={cur} hasNext={!!next} onNext={() => next && open(next.id)} onClose={() => setOpenId(null)} />
      </div>
    );
  }

  // canonical 13-entry data (id matches the illustration demo keys)
  CamNangScreen.ENTRIES = [
    { id: 'rotate', icon: 'rotate', group: 'CƠ BẢN', title: 'Xoay trọng lực', desc: 'Đổi hướng rơi để mở đường mới', body: 'Bấm nút xoay để đổi hướng trọng lực 90°. D-Pad chỉ hướng sẽ rơi — toàn bộ khối trên bàn đổ theo.', hi: 'đổi hướng trọng lực 90°' },
    { id: 'clearLine', icon: 'check', group: 'CƠ BẢN', title: 'Xóa hàng/cột', desc: 'Lấp đầy để dọn bàn', body: 'Lấp đầy trọn một hàng hoặc một cột — 9 ô, màu nào cũng được — để cả dãy biến mất và cộng điểm.', hi: '9 ô, màu nào cũng được' },
    { id: 'fall', icon: 'chevron', group: 'CƠ BẢN', title: 'Trọng lực rơi', desc: 'Cụm jelly rơi cùng nhau', body: 'Sau mỗi lần xóa, các khối phía trên rơi xuống theo trọng lực, dừng khi chạm khối khác hoặc đáy bàn.', hi: 'rơi xuống theo trọng lực' },
    { id: 'sticky', icon: 'heart', group: 'CƠ BẢN', title: 'Thạch dính', desc: 'Cùng màu sẽ dính thành cụm', body: 'Các khối thạch cùng màu dính lại thành một cụm. Chỉ cần một ô bị chặn, cả cụm cùng dừng.', hi: 'dính lại thành một cụm' },
    { id: 'super', icon: 'star', group: 'SIÊU KHỐI', title: 'Siêu khối', desc: 'Ghép hàng, cột hoặc 3×3 cùng màu', body: 'Lấp đầy một hàng, một cột hoặc một khối 3×3 toàn cùng một màu để tạo ra siêu khối.', hi: 'siêu khối' },
    { id: 'rainbow', icon: 'heart', group: 'SIÊU KHỐI', title: 'Khối cầu vồng', desc: 'Ghép đủ ba màu → cầu vồng', body: 'Xếp khối 3×3 đủ ba màu — mỗi màu một hàng hoặc một cột — để tạo khối cầu vồng.', hi: 'khối cầu vồng' },
    { id: 'superL2', icon: 'trophy', group: 'SIÊU KHỐI', title: 'Siêu khối cấp 2', desc: 'Ghép 2 siêu khối cùng màu', body: 'Đặt hai siêu khối cùng màu dính cạnh nhau, chúng hợp thành siêu khối cấp 2 mạnh hơn.', hi: 'siêu khối cấp 2' },
    { id: 'rainbowSuper', icon: 'trophy', group: 'SIÊU KHỐI', title: 'Cầu vồng siêu cấp', desc: 'Ghép 2 kíp nổ khác màu', body: 'Ghép hai kíp nổ khác màu để tạo cầu vồng siêu cấp đội vương miện — sức mạnh tối thượng.', hi: 'cầu vồng siêu cấp' },
    { id: 'blastSuper', icon: 'star', group: 'KÍCH NỔ', title: 'Nổ siêu khối', desc: 'Quét sạch mọi ô cùng màu', body: 'Khi siêu khối bị cuốn vào hàng hoặc cột đang xóa, nó quét sạch mọi ô cùng màu trên toàn bàn.', hi: 'quét sạch mọi ô cùng màu' },
    { id: 'blastSuperL2', icon: 'trophy', group: 'KÍCH NỔ', title: 'Nổ siêu khối cấp 2', desc: 'Cùng màu + cả vùng 5×5', body: 'Siêu khối cấp 2 quét sạch toàn bộ ô cùng màu và cả vùng 5×5 quanh tâm điểm nổ.', hi: 'vùng 5×5 quanh tâm' },
    { id: 'blastRainbow', icon: 'heart', group: 'KÍCH NỔ', title: 'Nổ cầu vồng', desc: 'Quét các màu đang kề nó', body: 'Khối cầu vồng khi nổ sẽ quét sạch mọi ô thuộc các màu đang kề ngay cạnh nó.', hi: 'các màu đang kề' },
    { id: 'blastRainbowSuper', icon: 'trophy', group: 'KÍCH NỔ', title: 'Nổ cầu vồng siêu cấp', desc: 'Xóa sạch toàn bàn (cả đá)', body: 'Kỹ năng tối thượng — cầu vồng siêu cấp xóa sạch toàn bàn, kể cả những khối đá cố định.', hi: 'xóa sạch toàn bàn' },
    { id: 'comboTurn', icon: 'rotateCw', group: 'COMBO', title: 'Combo hồi lượt xoay', desc: 'Combo ×2 trở lên → +1 lượt xoay', body: 'Đạt combo ×2 trở lên sẽ hồi +1 lượt xoay; combo càng dài, số lượt xoay hồi lại càng nhiều.', hi: '+1 lượt xoay' },
  ];

  window.GJCamNangScreen = CamNangScreen;
})();
