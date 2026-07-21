/* home-screen.jsx — official Home (endless-only), using the supplied game-art
   PNGs (logo, candy button surfaces, icons). Simple vertical composition over
   the meadow background; no panel behind the controls. Corner palette button
   opens the customize sheet (scene/background + score-locked music).
   Exposes window.GJHomeScreen (alias GJHomeScreenV2). */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Icon } = NS;
  const { useState } = React;

  const UI = '../06-svg-assets/ui/';
  const BGDIR = '../06-svg-assets/backgrounds/';
  const ART = {
    logo: UI + 'home-logo-t.png',
    play: UI + 'home-btn-play-t.png',
    creamLg: UI + 'home-btn-cream-lg-t.png',
    creamSm: UI + 'home-btn-cream-sm-t.png',
    icPlay: UI + 'ic-play-n.png',
    icGuide: UI + 'ic-guide-n.png',
    icTrophy: UI + 'ic-trophy-n.png',
    icSettings: UI + 'ic-settings-n.png',
    icPalette: UI + 'ic-palette-n.png',
  };

  const SCENES = [
    { id: 'meadow',    name: 'Đồng cỏ',   bg: BGDIR + 'meadow-bg.webp',    track: 'Đồng cỏ ban mai', unlockAt: 0 },
    { id: 'forest',    name: 'Khu rừng',  bg: BGDIR + 'forest-bg.webp',    track: 'Rừng thì thầm',   unlockAt: 6000 },
    { id: 'waterfall', name: 'Thác nước', bg: BGDIR + 'waterfall-bg.webp', track: 'Thác ngọc bích',  unlockAt: 40000 },
  ];
  const fmtInt = (n) => n.toLocaleString('vi-VN');
  // Vietnamese-safe rounded display stack (Baloo 2 has full VN coverage, avoids
  // per-glyph Fredoka→fallback mixing on horned uppercase like Ơ/Ư).
  const DISPLAY = "'Baloo 2', 'Fredoka', system-ui, sans-serif";

  /* inline SVG glyphs (no images) */
  const PlayGlyph = ({ s = 26 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5c0-1.1 1.15-1.78 2.1-1.22l9 5.4c.93.56.93 1.9 0 2.46l-9 5.4C9.15 18.1 8 17.42 8 16.32z" fill="#fff" /></svg>
  );
  const PaletteGlyph = ({ s = 30 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3C6.8 3 3 6.7 3 11.4c0 4 3 6.4 6.2 6.4 1.6 0 2.2-1 2.2-1.9 0-.5-.3-.9-.6-1.3-.3-.4-.5-.7-.5-1.2 0-.9.7-1.6 1.7-1.6h2c2.9 0 5-2.1 5-5C21 5.9 17.2 3 12 3z" fill="#FFFFFF" stroke="#7E6CF0" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7.6" cy="10.4" r="1.5" fill="#5FC3B2" /><circle cx="11" cy="7.2" r="1.5" fill="#E8B85C" /><circle cx="15.4" cy="8.4" r="1.5" fill="#7E6CF0" />
    </svg>
  );

  /* ── Logo placeholder — supplied art, standalone ──────────────────────── */
  function LogoMark() {
    return (
      <img src={ART.logo} alt="Gravity Jelly" style={{
        width: 250, maxWidth: '78%', height: 'auto', display: 'block',
        filter: 'drop-shadow(0 6px 12px rgba(60,44,24,0.28))', userSelect: 'none',
      }} />
    );
  }

  /* ── Primary CTA — pure-CSS tangerine candy button ───────────────────── */
  function PlayButton({ label = 'CHƠI NGAY', disabled = false, onClick }) {
    const [press, setPress] = useState(false);
    const down = press && !disabled;
    const fill = disabled ? 'linear-gradient(180deg,#D8CDBB,#C9BCA8)' : 'linear-gradient(180deg,#FFC59A,#FF9F68)';
    const edge = disabled ? '#A89A82' : '#E97E45';
    const edgeH = down ? 2 : 6;
    return (
      <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled} aria-label={label}
        onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
        style={{
          position: 'relative', width: 254, height: 68, borderRadius: 28, border: 'none', background: fill,
          cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, overflow: 'hidden',
          boxShadow: disabled
            ? `0 ${edgeH}px 0 ${edge}, 0 5px 11px rgba(120,92,52,0.14), inset 0 2px 1px rgba(255,255,255,0.4), inset 0 -7px 10px rgba(180,90,40,0.28)`
            : `0 ${edgeH}px 0 ${edge}, 0 10px 20px rgba(233,126,69,0.42), 0 2px 4px rgba(233,126,69,0.3), inset 0 2px 1px rgba(255,255,255,0.65), inset 0 -8px 12px rgba(200,96,44,0.35)`,
          transform: down ? 'translateY(4px)' : 'translateY(0)',
          transition: 'transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)',
          WebkitTapHighlightColor: 'transparent',
        }}>
        <span aria-hidden="true" style={{ position: 'absolute', top: 3, left: '6%', right: '6%', height: '46%', background: 'linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0))', opacity: disabled ? 0.4 : 1, borderRadius: '24px 24px 46% 46% / 24px 24px 90% 90%', pointerEvents: 'none' }} />
        <span style={{ position: 'relative', display: 'inline-flex', filter: disabled ? 'grayscale(0.6)' : 'none' }}><img src={ART.icPlay} alt="" style={{ width: 30, height: 30, objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(180,90,40,0.4))' }} /></span>
        <span style={{ position: 'relative', fontFamily: DISPLAY, fontWeight: 700, fontSize: 23, color: '#fff', letterSpacing: '0.01em', textShadow: '0 2px 3px rgba(180,90,40,0.45)' }}>{label}</span>
      </button>
    );
  }

  /* ── Secondary nav — pure-CSS cream candy button ─────────────────────── */
  function NavButton({ iconSrc, label, disabled = false, onClick }) {
    const [press, setPress] = useState(false);
    const down = press && !disabled;
    const fill = disabled ? 'linear-gradient(180deg,#EFE7D8,#E0D6C4)' : 'linear-gradient(180deg,#FFFFFF,#FFF7EC)';
    const edge = disabled ? '#C4B69E' : '#EBDCC4';
    const edgeH = down ? 2 : 5;
    return (
      <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled} aria-label={label}
        onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
        style={{
          position: 'relative', width: 92, height: 84, borderRadius: 22, border: 'none', background: fill,
          cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          boxShadow: `0 ${edgeH}px 0 ${edge}, 0 7px 14px rgba(120,92,52,0.2)`,
          transform: down ? 'translateY(3px)' : 'translateY(0)',
          transition: 'transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)',
          WebkitTapHighlightColor: 'transparent',
        }}>
        <span aria-hidden="true" style={{ position: 'absolute', top: 5, left: '24%', right: '24%', height: 11, background: '#fff', opacity: 0.8, borderRadius: 999, pointerEvents: 'none' }} />
        <img src={iconSrc} alt="" style={{ position: 'relative', width: 38, height: 38, objectFit: 'contain', filter: disabled ? 'grayscale(0.6) opacity(0.7)' : 'none' }} />
        <span style={{ position: 'relative', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 12.5, lineHeight: 1, color: disabled ? 'var(--color-text-muted)' : '#5B4636', whiteSpace: 'nowrap' }}>{label}</span>
      </button>
    );
  }

  /* ── top-left record card (KỶ LỤC + best) ─────────────────────────────── */
  function RecordCard({ best }) {
    return (
      <div style={{
        position: 'absolute', top: 22, left: 16, zIndex: 6,
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 15px 7px 9px',
        background: 'linear-gradient(180deg,#FFFFFF,#FFF7EC)', borderRadius: 20,
        boxShadow: '0 4px 0 #EBDCC4, 0 6px 13px rgba(120,92,52,0.18)',
      }}>
        <img src={ART.icTrophy} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} />
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>KỶ LỤC</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, color: 'var(--color-text)', marginTop: 3 }}>{fmtInt(best)}</span>
        </span>
      </div>
    );
  }

  /* ── corner customization button — cream square art + palette icon ────── */
  function CornerCustomize({ hasNew = false, disabled = false, onClick }) {
    const [press, setPress] = useState(false);
    const down = press && !disabled;
    return (
      <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled} aria-label="Tùy chỉnh"
        onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
        style={{
          position: 'absolute', top: 22, right: 18, zIndex: 6, width: 50, height: 50, borderRadius: 18,
          border: 'none', background: disabled ? 'linear-gradient(180deg,#EFE7D8,#E0D6C4)' : 'linear-gradient(180deg,#FFFFFF,#FFF7EC)', padding: 0,
          cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: down ? '0 1px 0 #EBDCC4, 0 3px 8px rgba(120,92,52,0.14)' : '0 4px 0 #EBDCC4, 0 6px 13px rgba(120,92,52,0.2)',
          transform: down ? 'translateY(3px)' : 'translateY(0)',
          transition: 'transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)', WebkitTapHighlightColor: 'transparent',
        }}>
        <span aria-hidden="true" style={{ position: 'absolute', top: 5, left: '24%', right: '24%', height: 10, background: '#fff', opacity: 0.8, borderRadius: 999, pointerEvents: 'none' }} />
        <span style={{ position: 'relative', display: 'inline-flex', filter: disabled ? 'grayscale(0.6) opacity(0.7)' : 'none' }}><img src={ART.icPalette} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} /></span>
        {hasNew && !disabled && <span aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, width: 13, height: 13, borderRadius: '50%', background: 'var(--color-warning)', border: '2px solid #FFF7EC' }} />}
      </button>
    );
  }

  /* ── customize bottom sheet ───────────────────────────────────────────── */
  function EqBars() {
    return (
      <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: 15 }}>
        {[0, 1, 2].map((i) => (<span key={i} className="gj2-eq" style={{ width: 3, background: 'var(--color-gravity)', borderRadius: 2, animationDelay: (i * 0.18) + 's' }} />))}
      </span>
    );
  }

  function CustomizeSheet({ best, sceneId, onScene, music, onMusic, volume, onVolume, onClose }) {
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div onClick={onClose} className="gj2-scrim" style={{ position: 'absolute', inset: 0, background: 'rgba(60,44,24,0.42)' }} />
        <div className="gj2-sheet" style={{ position: 'relative', background: 'var(--color-bg)', borderRadius: '28px 28px 0 0', boxShadow: '0 -12px 40px rgba(60,44,24,0.3)', padding: '10px 16px 18px', maxHeight: '84%', overflowY: 'auto' }}>
          <div style={{ width: 44, height: 5, borderRadius: 999, background: '#E2D4BD', margin: '2px auto 10px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 800, fontSize: 22, color: 'var(--color-text)' }}>Tùy chỉnh</h2>
            <button type="button" onClick={onClose} aria-label="Đóng" style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'var(--color-surface-sunken)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="close" size={20} />
            </button>
          </div>

          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', color: 'var(--color-text-muted)', margin: '0 2px 8px' }}>CẢNH &amp; NỀN</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {SCENES.map((sc) => {
              const active = sc.id === sceneId;
              return (
                <button key={sc.id} type="button" onClick={() => onScene(sc.id)}
                  style={{ position: 'relative', padding: 0, border: 'none', cursor: 'pointer', borderRadius: 16, overflow: 'hidden', background: '#FFF7EC', aspectRatio: '16 / 11', boxShadow: active ? '0 0 0 3px var(--color-gravity), 0 6px 14px rgba(120,92,52,0.24)' : '0 3px 10px rgba(120,92,52,0.2)' }}>
                  <img src={sc.bg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 65%', display: 'block' }} />
                  <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 10px 7px', background: 'linear-gradient(180deg,rgba(60,44,24,0),rgba(60,44,24,0.66))', color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, textAlign: 'left' }}>{sc.name}</span>
                  {active && <span style={{ position: 'absolute', top: 7, right: 7, width: 24, height: 24, borderRadius: '50%', background: 'var(--color-gravity)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(60,44,24,0.3)' }}><Icon name="check" size={16} color="#fff" /></span>}
                </button>
              );
            })}
          </div>

          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', color: 'var(--color-text-muted)', margin: '0 2px 8px' }}>NHẠC NỀN</div>
          <div style={{ background: 'var(--color-surface)', borderRadius: 20, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            {SCENES.map((sc, i) => {
              const locked = best < sc.unlockAt;
              const playing = music === sc.id;
              return (
                <button key={sc.id} type="button" disabled={locked} onClick={() => !locked && onMusic(sc.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 14px', border: 'none', borderBottom: i < SCENES.length - 1 ? '1.5px solid var(--color-cell-line)' : 'none', background: playing ? 'var(--color-surface-sunken)' : 'transparent', cursor: locked ? 'not-allowed' : 'pointer', textAlign: 'left', opacity: locked ? 0.62 : 1 }}>
                  <span style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: locked ? '#E2D4BD' : playing ? 'var(--color-gravity)' : 'var(--color-surface-sunken)' }}>
                    <Icon name={locked ? 'settings' : 'music'} size={18} color={locked ? 'var(--color-text-muted)' : playing ? '#fff' : 'var(--color-text)'} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sc.track}</span>
                    {locked && <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, color: 'var(--color-text-muted)' }}>🔒 Mở tại {fmtInt(sc.unlockAt)} điểm</span>}
                  </span>
                  {playing && <EqBars />}
                  {!locked && !playing && <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, color: 'var(--color-gravity)' }}>Chọn</span>}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 2px 4px' }}>
            <Icon name="volume" size={20} color="var(--color-text-muted)" />
            <input type="range" min="0" max="100" value={volume} onChange={(e) => onVolume(+e.target.value)} style={{ flex: 1, accentColor: 'var(--color-gravity)' }} />
            <span style={{ width: 34, textAlign: 'right', fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, color: 'var(--color-text)' }}>{volume}</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Home screen ──────────────────────────────────────────────────────── */
  function HomeScreen({ best = 28640, playDisabled = false, onPlay, onGuide, onLeaderboard, onSettings }) {
    const [sceneId, setSceneId] = useState('meadow');
    const [music, setMusic] = useState('meadow');
    const [volume, setVolume] = useState(70);
    const [sheet, setSheet] = useState(false);
    const scene = SCENES.find((s) => s.id === sceneId) || SCENES[0];

    return (
      <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden', background: '#FFF7EC', fontFamily: 'var(--font-body)' }}>
        <style>{`
          @keyframes gj2-eq{0%,100%{height:5px}50%{height:15px}}
          .gj2-eq{animation:gj2-eq .9s ease-in-out infinite}
          @keyframes gj2-sheet-in{from{transform:translateY(100%)}to{transform:translateY(0)}}
          @keyframes gj2-fade-in{from{opacity:0}to{opacity:1}}
          @keyframes gj2-logo-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
          .gj2-logo{animation:gj2-logo-bob 4s ease-in-out infinite}
          .gj2-sheet{animation:gj2-sheet-in .32s cubic-bezier(.34,1.3,.64,1)}
          .gj2-scrim{animation:gj2-fade-in .25s ease}
          @media (prefers-reduced-motion: reduce){.gj2-eq,.gj2-sheet,.gj2-scrim,.gj2-logo{animation:none!important}}
        `}</style>

        {scene.bg && <img key={scene.id} src={scene.bg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', display: 'block', userSelect: 'none', pointerEvents: 'none', animation: 'gj2-fade-in .5s ease' }} />}

        <RecordCard best={best} />
        <CornerCustomize onClick={() => setSheet(true)} />

        <div style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px 32px', boxSizing: 'border-box' }}>
          <div className="gj2-logo" style={{ marginTop: 46, display: 'flex', justifyContent: 'center' }}><LogoMark /></div>

          <div style={{ flex: 1 }} />

          <PlayButton disabled={playDisabled} onClick={onPlay} />

          <div style={{ height: 42 }} />

          <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '0 2px' }}>
            <NavButton iconSrc={ART.icGuide} label="Cẩm nang" onClick={onGuide} />
            <NavButton iconSrc={ART.icTrophy} label="Xếp hạng" onClick={onLeaderboard} />
            <NavButton iconSrc={ART.icSettings} label="Cài đặt" onClick={onSettings} />
          </div>
        </div>

        {sheet && (
          <CustomizeSheet best={best} sceneId={sceneId} onScene={setSceneId}
            music={music} onMusic={setMusic} volume={volume} onVolume={setVolume}
            onClose={() => setSheet(false)} />
        )}
      </div>
    );
  }

  window.GJHomeScreen = HomeScreen;
  window.GJHomeScreenV2 = HomeScreen; // back-compat alias
  window.GJHomeParts = { LogoMark, PlayButton, NavButton, RecordCard, CornerCustomize, CustomizeSheet };
})();
