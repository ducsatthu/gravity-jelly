/* phone-frame.jsx — Android device shell (UI-kit helper).
   360dp-wide screen with a slim status bar. Children render on the cream
   canvas. Exposes window.GJPhoneFrame. */

(function () {
  function PhoneFrame({ children, statusBar = true, style = {} }) {
    return (
      <div
        style={{
          width: 360,
          height: 780,
          background: '#241a12',
          borderRadius: 40,
          padding: 8,
          boxShadow: '0 24px 60px rgba(60,44,24,0.35)',
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'var(--color-bg)',
            borderRadius: 32,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'var(--font-body)',
          }}
        >
          {statusBar && (
            <div style={{ height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: 'var(--color-text)' }}>
              <span>9:41</span>
              <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
                <Bars /><Wifi /><Battery />
              </span>
            </div>
          )}
          <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>{children}</div>
        </div>
      </div>
    );
  }

  const stroke = { stroke: 'var(--color-text)', strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const Bars = () => (<svg width="15" height="12" viewBox="0 0 15 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="var(--color-text)"/><rect x="4" y="5" width="3" height="7" rx="1" fill="var(--color-text)"/><rect x="8" y="2" width="3" height="10" rx="1" fill="var(--color-text)"/><rect x="12" y="0" width="3" height="12" rx="1" fill="var(--color-text)" opacity="0.4"/></svg>);
  const Wifi = () => (<svg width="15" height="12" viewBox="0 0 24 24" {...stroke}><path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1" fill="var(--color-text)" stroke="none"/></svg>);
  const Battery = () => (<svg width="22" height="12" viewBox="0 0 26 12"><rect x="1" y="1" width="21" height="10" rx="3" {...stroke}/><rect x="3" y="3" width="15" height="6" rx="1.5" fill="var(--color-success)"/><rect x="23" y="4" width="2" height="4" rx="1" fill="var(--color-text)"/></svg>);

  window.GJPhoneFrame = PhoneFrame;
})();
