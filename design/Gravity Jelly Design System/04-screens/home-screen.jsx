/* home-screen.jsx — HOME = painted meadow art (home-camp-bg.png, logo baked in)
   + slim top HUD (KỶ LỤC + hearts/life-regen) + twinkling sparkles over the
   arch gate, the guidebook and the ancient stone disc. Exposes window.GJHomeScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Icon } = NS;

  const BG = '../06-svg-assets/backgrounds/home-world-1-bg.png';
  const BTN = '../06-svg-assets/ui/button-frame.png';
  const BTN_GREEN = '../06-svg-assets/ui/button-frame-green.png';
  const BTN_ORANGE = '../06-svg-assets/ui/button-frame-orange.png';

  const IC_CAMPAIGN = '../06-svg-assets/ui/btn-campaign.png';
  const IC_INFINITE = '../06-svg-assets/ui/btn-infinite.png';
  const IC_GUIDE = '../06-svg-assets/ui/btn-guide.png';
  const IC_SETTING = '../06-svg-assets/ui/btn-setting.png';
  const IC_LEADER = '../06-svg-assets/ui/btn-leaderboard.png';

  /* Icon button: painted PNG that depresses on press. Sized by HEIGHT (`h`, a CSS
     length) so the near-square icons fit the short panel; width follows art aspect. */
  function IconButton({ icon, label, onClick, h }) {
    const [press, setPress] = React.useState(false);
    return (
      <button
        onClick={onClick}
        onPointerDown={() => setPress(true)}
        onPointerUp={() => setPress(false)}
        onPointerLeave={() => setPress(false)}
        aria-label={label}
        style={{
          height: h, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, border: 'none', background: 'none', cursor: 'pointer',
          transform: `scale(${press ? 0.93 : 1})`,
          transition: 'transform .12s cubic-bezier(.34,1.56,.64,1)',
        }}
      >
        <img src={icon} alt="" style={{
          height: '100%', width: 'auto', display: 'block', userSelect: 'none',
          filter: 'drop-shadow(0 4px 6px rgba(120,92,52,0.3))',
        }} />
      </button>
    );
  }
  const STAR = 'M12 0c.9 6.6 4.4 10.1 11 11-6.6.9-10.1 4.4-11 11-.9-6.6-4.4-10.1-11-11 6.6-.9 10.1-4.4 11-11z';

  const fmt = (s) => {
    const m = Math.floor(s / 60), r = s % 60;
    return m + ':' + String(r).padStart(2, '0');
  };

  /* tiny deterministic PRNG so sparkles are stable across re-renders */
  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* A twinkling cluster of sparkles scattered around (cx,cy) within ±rx/±ry (%). */
  function Sparkles({ cx, cy, rx, ry, count, seed }) {
    const r = rng(seed);
    const items = [];
    for (let i = 0; i < count; i++) {
      const x = cx + (r() * 2 - 1) * rx;
      const y = cy + (r() * 2 - 1) * ry;
      const size = 7 + r() * 11;
      const delay = (r() * 2.6).toFixed(2);
      const dur = (1.5 + r() * 1.4).toFixed(2);
      const gold = r() < 0.5;
      const glow = gold ? '#FFD46B' : '#FFFFFF';
      items.push(
        <span key={i} className="gj-spk" style={{
          position: 'absolute', left: x + '%', top: y + '%',
          width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
          animationDelay: delay + 's', animationDuration: dur + 's',
        }}>
          <svg viewBox="0 0 24 24" width={size} height={size}
            style={{ display: 'block', filter: `drop-shadow(0 0 ${Math.round(size * 0.45)}px ${glow})` }}>
            <path d={STAR} fill={gold ? '#FFF1CE' : '#FFFFFF'} />
          </svg>
        </span>
      );
    }
    return (
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>{items}</div>
    );
  }

  /* Cánh hoa bay — petals drifting down across the meadow. Each petal falls
     vertically (outer) while swaying + tumbling (inner). Deterministic via seed. */
  const PETAL_COLORS = [
    ['#FFFFFF', '#FBE7EF'], // white daisy
    ['#FBD0DF', '#F7A9C0'], // pink
    ['#FFF1CE', '#FFE3A3'], // butter yellow
    ['#F7A9C0', '#E576A0'], // deep pink
  ];
  function Petals({ count = 24, seed = 7 }) {
    const r = rng(seed);
    const items = [];
    for (let i = 0; i < count; i++) {
      const left = (r() * 100).toFixed(1);
      const w = 13 + r() * 13;                     // petal width px
      const fallDur = (5.5 + r() * 5).toFixed(2);  // drift speed
      const swayDur = (1.8 + r() * 1.6).toFixed(2);
      const delay = (-r() * parseFloat(fallDur)).toFixed(2); // start mid-flight
      const [c1, c2] = PETAL_COLORS[Math.floor(r() * PETAL_COLORS.length)];
      const drift = (r() < 0.5 ? -1 : 1) * (10 + r() * 16);
      items.push(
        <span key={i} className="gj-petal-fall" style={{
          position: 'absolute', left: left + '%', top: 0,
          animationDuration: fallDur + 's', animationDelay: delay + 's',
          '--gj-drift': drift + 'px',
        }}>
          <span className="gj-petal-sway" style={{ display: 'block', animationDuration: swayDur + 's' }}>
            <span style={{
              display: 'block', width: w, height: w * 1.35,
              background: `radial-gradient(120% 120% at 30% 20%, ${c1}, ${c2})`,
              borderRadius: '52% 52% 52% 8%',
              boxShadow: 'inset 0 -2px 3px rgba(0,0,0,0.08)',
              filter: 'drop-shadow(0 2px 3px rgba(90,70,54,0.28))',
              opacity: 0.96,
            }} />
          </span>
        </span>
      );
    }
    return (
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 3 }}>{items}</div>
    );
  }
  function GateButton({ label, x, y, width, frame = BTN, edge = '#0B4E7A', onClick }) {
    const [press, setPress] = React.useState(false);
    return (
      <button
        onClick={onClick}
        onPointerDown={() => setPress(true)}
        onPointerUp={() => setPress(false)}
        onPointerLeave={() => setPress(false)}
        aria-label={label}
        style={{
          position: 'absolute', left: x + '%', top: y + '%', width,
          transform: `translate(-50%,-50%) scale(${press ? 0.95 : 1})`,
          transition: 'transform .1s ease',
          padding: 0, border: 'none', background: 'none', cursor: 'pointer',
          filter: 'drop-shadow(0 7px 11px rgba(30,55,80,0.38))',
        }}
      >
        <img src={frame} alt="" style={{ width: '100%', display: 'block', userSelect: 'none' }} />
        <span style={{
          position: 'absolute', left: '13%', right: '13%', top: 0, bottom: '4%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: '3.3cqw', lineHeight: 1, letterSpacing: '0.02em',
          color: '#fff', whiteSpace: 'nowrap',
          textShadow: `0 2px 0 ${edge}, 0 0 1px ${edge}, 0 3px 6px rgba(8,45,75,0.5)`,
        }}>{label}</span>
      </button>
    );
  }

  const fmtChip = (children, key) => (
    <div key={key} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px',
      background: 'rgba(255,255,255,0.9)', borderRadius: 999,
      boxShadow: '0 3px 9px rgba(60,44,24,0.22)', whiteSpace: 'nowrap',
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--color-text)',
    }}>{children}</div>
  );

  function Clock({ size = 13, color }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v5l3 1.8" />
      </svg>
    );
  }

  function HomeScreen({
    best = 28640, hearts = 4, maxHearts = 5, regenSeconds = 750, petals = true,
    onCampaign, onPlay, onGuide, onTools,
  }) {
    const [hp, setHp] = React.useState(Math.min(hearts, maxHearts));
    const [left, setLeft] = React.useState(regenSeconds);

    React.useEffect(() => {
      if (hp >= maxHearts) return;
      const id = setInterval(() => {
        setLeft((s) => {
          if (s <= 1) { setHp((h) => Math.min(h + 1, maxHearts)); return regenSeconds; }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }, [hp, maxHearts, regenSeconds]);

    const full = hp >= maxHearts;

    return (
      <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden', fontFamily: 'var(--font-body)', background: 'linear-gradient(180deg,#8ecdf3,#bce5fb)' }}>
        <style>{`
          @keyframes gj-spk{0%,100%{opacity:0;transform:scale(.25) rotate(0deg)}45%{opacity:1;transform:scale(1) rotate(35deg)}55%{opacity:1;transform:scale(1) rotate(45deg)}}
          .gj-spk{display:block;animation-name:gj-spk;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:center}
          @keyframes gj-petal-fall{0%{transform:translateY(-12%) translateX(0);opacity:0}8%{opacity:1}90%{opacity:1}100%{transform:translateY(112%) translateX(var(--gj-drift,0px));opacity:0}}
          @keyframes gj-petal-sway{0%{transform:translateX(-7px) rotate(-32deg)}100%{transform:translateX(7px) rotate(34deg)}}
          .gj-petal-fall{animation-name:gj-petal-fall;animation-timing-function:linear;animation-iteration-count:infinite;will-change:transform}
          .gj-petal-sway{animation-name:gj-petal-sway;animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-direction:alternate;will-change:transform}
          @media (prefers-reduced-motion: reduce){.gj-spk{animation:none!important;opacity:.85}.gj-petal-fall,.gj-petal-sway{animation:none!important;opacity:0}}
        `}</style>

        {/* STAGE: the background image box, pinned to the BOTTOM at full width.
           Top overflow (sky) is the spare area for taller screens. All home
           elements live inside here so their %-positions track the art. */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', aspectRatio: '821 / 1916', containerType: 'inline-size' }}>
          <img src={BG} alt="Gravity Jelly" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', userSelect: 'none', pointerEvents: 'none' }} />

          {/* Sparkles tạm thời ẩn — nền mới chưa có landmark tương ứng.
          {sparkle && (
            <React.Fragment>
              <Sparkles cx={50} cy={50} rx={12} ry={9} count={9} seed={11} />
            </React.Fragment>
          )}
          */}

          {/* Cánh hoa bay bay khắp màn hình */}
          {petals && <Petals count={24} seed={7} />}

          {/* menu 2 hàng trong panel kem — hàng trên 2 nút chơi chính (to hơn) */}
          <div style={{
            position: 'absolute', left: '12%', right: '12%', top: '77.5%', bottom: '4.9%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2cqw',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4cqw' }}>
              <IconButton icon={IC_CAMPAIGN} label="Chiến dịch" onClick={onCampaign} h="18.4cqw" />
              <IconButton icon={IC_INFINITE} label="Endless" onClick={onPlay} h="18.4cqw" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3.5cqw' }}>
              <IconButton icon={IC_GUIDE} label="Cẩm nang" onClick={onGuide} h="15.2cqw" />
              <IconButton icon={IC_LEADER} label="Bảng xếp hạng" onClick={onTools} h="15.2cqw" />
              <IconButton icon={IC_SETTING} label="Cài đặt" onClick={onTools} h="15.2cqw" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  window.GJHomeScreen = HomeScreen;
})();
