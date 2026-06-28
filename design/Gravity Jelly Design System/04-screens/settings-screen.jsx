/* settings-screen.jsx — SETTINGS. Sound / music / vibration toggles,
   language segmented control, info rows. Exposes window.GJSettingsScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Icon } = NS;

  function Switch({ on, onToggle }) {
    return (
      <button type="button" onClick={onToggle} aria-pressed={on}
        style={{ width: 52, height: 30, borderRadius: 'var(--radius-full)', border: 'none', padding: 3, cursor: 'pointer',
          background: on ? 'var(--color-success)' : '#E2D4BD', boxShadow: 'inset 0 1px 3px rgba(120,92,52,0.18)',
          display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start', transition: 'background var(--motion-base) var(--ease-inout)' }}>
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', transition: 'all var(--motion-base) var(--ease-jelly)' }} />
      </button>
    );
  }

  function Row({ icon, label, children, last }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', minHeight: 56, padding: '0 var(--space-lg)', borderBottom: last ? 'none' : '1.5px solid var(--color-cell-line)' }}>
        <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-sunken)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={20} />
        </span>
        <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-body)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{label}</span>
        {children}
      </div>
    );
  }

  function Group({ title, children, overflowVisible }) {
    return (
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-caption)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)', margin: '0 var(--space-sm) var(--space-sm)' }}>{title}</div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: overflowVisible ? 'visible' : 'hidden' }}>{children}</div>
      </div>
    );
  }

  // Resolve the device language for the "system default" option — Vietnamese
  // only when the OS is Vietnamese, otherwise English.
  const sysLang = (typeof navigator !== 'undefined' && /^vi/i.test(navigator.language || '')) ? 'vi' : 'en';
  const sysSubLabel = sysLang === 'vi' ? 'Tiếng Việt' : 'English';

  function LangDropdown({ value, onChange }) {
    const opts = [['system', 'Theo hệ thống'], ['vi', 'Tiếng Việt'], ['en', 'English']];
    const [open, setOpen] = React.useState(false);
    const cur = opts.find((o) => o[0] === value) || opts[0];
    return (
      <div style={{ position: 'relative' }}>
        {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />}
        <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer', padding: '7px 8px 7px 14px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-sunken)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
          {cur[1]}
          <Icon name="chevron" size={16} color="var(--color-text-muted)" style={{ transform: open ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform var(--motion-fast) var(--ease-out)' }} />
        </button>
        {open && (
          <div role="listbox" style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 31, minWidth: 190, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', padding: 4, border: '1.5px solid var(--color-cell-line)' }}>
            {opts.map(([k, lbl]) => (
              <button key={k} type="button" role="option" aria-selected={value === k} onClick={() => { onChange(k); setOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', border: 'none', cursor: 'pointer', padding: '9px 12px', borderRadius: 'var(--radius-md)', background: value === k ? 'var(--color-surface-sunken)' : 'transparent', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-body)', color: 'var(--color-text)', whiteSpace: 'nowrap', textAlign: 'left' }}>
                <span>{lbl}{k === 'system' && <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{' · ' + sysSubLabel}</span>}</span>
                {value === k && <Icon name="check" size={18} color="var(--color-success)" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  function SettingsScreen({ settings = { sound: true, music: true, vibrate: false, lang: 'system' }, onToggle, onLang, onBack }) {
    const s = settings;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* header */}
        <div style={{ height: 'var(--dim-hud-h)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '0 var(--space-md)' }}>
          <button type="button" onClick={onBack} aria-label="Quay lại"
            style={{ width: 'var(--dim-icon-btn)', height: 'var(--dim-icon-btn)', borderRadius: 'var(--radius-lg)', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="back" size={24} />
          </button>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-title)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>Cài đặt</h1>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md) var(--space-lg) var(--space-xl)' }}>
          <Group title="ÂM THANH">
            <Row icon="volume" label="Âm thanh"><Switch on={s.sound} onToggle={() => onToggle('sound')} /></Row>
            <Row icon="music" label="Nhạc nền"><Switch on={s.music} onToggle={() => onToggle('music')} /></Row>
            <Row icon="vibrate" label="Rung" last><Switch on={s.vibrate} onToggle={() => onToggle('vibrate')} /></Row>
          </Group>

          <Group title="NGÔN NGỮ" overflowVisible>
            <Row icon="globe" label="Ngôn ngữ" last><LangDropdown value={s.lang} onChange={onLang} /></Row>
          </Group>

          <Group title="THÔNG TIN">
            <Row icon="info" label="Phiên bản"><span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-muted)' }}>1.0.0</span></Row>
            <Row icon="heart" label="Đánh giá game"><Icon name="chevron" size={20} color="var(--color-text-muted)" /></Row>
            <Row icon="settings" label="Chính sách bảo mật" last><Icon name="chevron" size={20} color="var(--color-text-muted)" /></Row>
          </Group>
        </div>
      </div>
    );
  }

  window.GJSettingsScreen = SettingsScreen;
})();
