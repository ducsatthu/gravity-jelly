/* cam-nang-illus.jsx — "hình thật của game" illustrations for the Handbook
   detail popup. A shared MiniBoard + SpecialBlock built straight from the DS
   JellyBlock, plus a per-mechanic demo renderer. Exposes window.GJCamNangIllus.
   Style is INLINE var(--token) to match the kit. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { JellyBlock, Icon } = NS;
  const Extras = window.GJExtras || {};

  const COL = { Y: 'yellow', M: 'mint', P: 'pink', B: 'blue', S: 'stone' };

  /* Vua Thạch (Jelly King) royal-frame art — crowned jelly panel per colour,
     gem = that colour's emblem (star/leaf/heart/drop). Supplied PNG art. */
  const VUATHACH_SRC = {
    yellow: '../06-svg-assets/ui/vuathach-yellow.jpg',
    mint: '../06-svg-assets/ui/vuathach-mint.jpg',
    pink: '../06-svg-assets/ui/vuathach-pink.jpg',
    blue: '../06-svg-assets/ui/vuathach-blue.jpg',
  };
  function VuaThach({ color = 'blue', size = 52 }) {
    return <img src={VUATHACH_SRC[color] || VUATHACH_SRC.blue} alt="Vua Thạch" style={{ width: size, height: size, display: 'block', borderRadius: Math.round(size * 0.20), boxShadow: '0 2px 5px var(--color-shadow-soft)' }} />;
  }

  /* Thạch Hoàng Gia (Royal Jelly, cấp 1) — royal-frame PNG art per colour.
     (Repurposed from the royal art; own copy so a later Vua Thạch swap is isolated.) */
  const HOANGGIA_SRC = {
    yellow: '../06-svg-assets/ui/hoanggia-yellow.jpg',
    mint: '../06-svg-assets/ui/hoanggia-mint.jpg',
    pink: '../06-svg-assets/ui/hoanggia-pink.jpg',
    blue: '../06-svg-assets/ui/hoanggia-blue.jpg',
  };
  function HoangGia({ color = 'pink', size = 52 }) {
    return <img src={HOANGGIA_SRC[color] || HOANGGIA_SRC.pink} alt="Thạch Hoàng Gia" style={{ width: size, height: size, display: 'block', borderRadius: Math.round(size * 0.20), boxShadow: '0 2px 5px var(--color-shadow-soft)' }} />;
  }

  /* Thạch Cầu Vồng (Rainbow Jelly) + Hoàng Đế Cầu Vồng (Rainbow Emperor) —
     supplied PNG art. kind: 'rainbow' (sparkle) | 'emperor' (crowned). */
  const RAINBOW_SRC = {
    rainbow: '../06-svg-assets/ui/rainbow.jpg',
    emperor: '../06-svg-assets/ui/rainbowemperor.jpg',
  };
  function RainbowJelly({ kind = 'rainbow', size = 52 }) {
    const src = RAINBOW_SRC[kind] || RAINBOW_SRC.rainbow;
    const alt = kind === 'emperor' ? 'Hoàng Đế Cầu Vồng' : 'Thạch Cầu Vồng';
    // both are opaque full-bleed squares now — clip corners with border-radius.
    return <img src={src} alt={alt} style={{ width: size, height: size, display: 'block', borderRadius: Math.round(size * 0.20), boxShadow: '0 2px 5px var(--color-shadow-soft)' }} />;
  }

  /* one 9-or-smaller grid drawn in the sunken board well. `rows` is an array
     of strings; chars: '.' empty · Y/M/P/B/S jelly · lowercase = same block
     but dimmed (faded, for "swept away" after-states). */
  function MiniBoard({ rows, cell = 20, glow = null, dimColor = null }) {
    const gap = Math.max(2, Math.round(cell * 0.12));
    return (
      <div style={{
        display: 'inline-grid', gap, padding: gap + 2,
        gridTemplateColumns: `repeat(${rows[0].length}, ${cell}px)`,
        background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-md)',
        boxShadow: 'inset 0 1px 3px var(--color-shadow-soft)',
      }}>
        {rows.flatMap((row, y) => row.split('').map((ch, x) => {
          const key = `${y}-${x}`;
          if (ch === '.') {
            return <span key={key} style={{ width: cell, height: cell, borderRadius: Math.round(cell * 0.20), background: 'var(--color-cell-empty)', boxShadow: 'inset 0 0 0 1.5px var(--color-cell-line)' }} />;
          }
          const faded = ch === ch.toLowerCase() && ch !== ch.toUpperCase();
          const color = COL[ch.toUpperCase()] || 'yellow';
          const isGlow = glow && glow.has(key);
          return (
            <div key={key} style={{ width: cell, height: cell, opacity: faded ? 0.22 : 1, position: 'relative', filter: isGlow ? 'brightness(1.12)' : 'none' }}>
              {isGlow && <span style={{ position: 'absolute', inset: -3, borderRadius: Math.round(cell * 0.4), boxShadow: `0 0 0 2.5px var(--color-warning), 0 0 10px var(--color-warning)`, pointerEvents: 'none' }} />}
              <JellyBlock color={color} size={cell} showEyes={cell >= 22} />
            </div>
          );
        }))}
      </div>
    );
  }

  /* A power-cell: super (★ badge), rainbow (conic block), or crowned rainbow.
     `lvl` 2 adds a small "2" pip. Built to sit in a MiniBoard footprint. */
  function SpecialBlock({ type = 'super', color = 'pink', size = 40, lvl = 1 }) {
    const r = Math.round(size * 0.28);
    const rainbow = type === 'rainbow' || type === 'crown';
    const pal = {
      yellow: ['#FFE3A3', '#E8B85C'], mint: ['#A3E5D9', '#5FC3B2'],
      pink: ['#F7A9C0', '#E576A0'], blue: ['#B3C7F7', '#7E9CE8'],
    }[color] || ['#F7A9C0', '#E576A0'];
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{
          width: size, height: size, borderRadius: r, boxSizing: 'border-box',
          background: rainbow
            ? 'conic-gradient(from 210deg, #F7A9C0, #FFE3A3, #A3E5D9, #B3C7F7, #F7A9C0)'
            : pal[0],
          border: `3px solid ${rainbow ? '#E576A0' : pal[1]}`,
          boxShadow: '0 0 0 3px var(--color-warning), var(--shadow-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ position: 'absolute', top: 2, left: '14%', right: '14%', height: '32%', background: 'rgba(255,255,255,0.7)', borderRadius: '50%', filter: 'blur(0.5px)' }} />
          {!rainbow && (
            <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" style={{ position: 'relative', filter: 'drop-shadow(0 1px 0 rgba(90,70,54,0.25))' }}>
              <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" fill="#FFF6DD" stroke="#E2A82E" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          )}
          {rainbow && <span style={{ width: size * 0.34, height: size * 0.34, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', boxShadow: '0 0 8px rgba(255,255,255,0.9)' }} />}
        </div>
        {lvl === 2 && (
          <span style={{ position: 'absolute', bottom: -5, right: -5, width: 19, height: 19, borderRadius: '50%', background: 'var(--color-surface)', border: '2px solid var(--color-warning)', color: 'var(--color-text)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>2</span>
        )}
        {type === 'crown' && Extras.Crown && (
          <div style={{ position: 'absolute', top: -size * 0.42, left: '50%', transform: 'translateX(-50%)' }}><Extras.Crown size={size * 0.6} /></div>
        )}
      </div>
    );
  }

  /* the gravity-flow arrow between a before & after state */
  function Flow({ vertical = false }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gravity)', flexShrink: 0, padding: vertical ? '2px 0' : '0 2px' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ transform: vertical ? 'rotate(90deg)' : 'none' }}>
          <path d="M4 12h13M12 6l6 6-6 6" />
        </svg>
      </div>
    );
  }

  function Stage({ children, label }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        {children}
        {label && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{label}</span>}
      </div>
    );
  }

  function Wrap({ children }) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>{children}</div>;
  }

  // small D-Pad + gravity FAB cluster for the rotate explainer
  function GravityCluster({ dir = 'left' }) {
    const arrow = { left: '←', right: '→', up: '↑', down: '↓' };
    const cellOf = (d) => (
      <span style={{ width: 22, height: 22, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14,
        background: d === dir ? 'var(--color-surface)' : 'transparent', color: d === dir ? 'var(--color-gravity)' : 'rgba(255,255,255,0.85)',
        boxShadow: d === dir ? 'var(--shadow-sm)' : 'none', fontFamily: 'var(--font-display)' }}>{arrow[d]}</span>
    );
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '4px 8px', borderRadius: 'var(--radius-full)', background: 'var(--color-gravity)', boxShadow: '0 4px 0 var(--color-gravity-edge), var(--shadow-sm)' }}>
          {cellOf('left')}{cellOf('up')}{cellOf('down')}{cellOf('right')}
        </div>
        <div style={{ position: 'relative', width: 46, height: 46, borderRadius: '50%', background: 'var(--color-gravity)', boxShadow: '0 5px 0 var(--color-gravity-edge), var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ position: 'absolute', top: 5, left: '26%', right: '26%', height: '22%', background: 'var(--color-gravity-shine)', opacity: 0.6, borderRadius: 999 }} />
          <Icon name="rotateCw" size={24} color="var(--color-text-invert)" strokeWidth={2.4} />
        </div>
      </div>
    );
  }

  // ── per-mechanic demos, keyed by entry id ──────────────────────────────
  const DEMOS = {
    rotate: () => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Wrap>
          <Stage label="Trước"><MiniBoard cell={18} rows={['....', '.P..', 'YP..', 'YMB.']} /></Stage>
          <Flow />
          <Stage label="Xoay ←"><MiniBoard cell={18} rows={['....', '....', 'PP..', 'YPYM', '...B'].slice(0, 4)} /></Stage>
        </Wrap>
        <GravityCluster dir="left" />
      </div>
    ),
    clearLine: () => (
      <Wrap>
        <Stage label="Đầy 1 hàng"><MiniBoard cell={20} rows={['.....', 'M.P.B', 'YMPBY']} /></Stage>
        <Flow />
        <Stage label="Biến mất + điểm"><MiniBoard cell={20} rows={['.....', 'M.P.B', '.....']} /></Stage>
      </Wrap>
    ),
    fall: () => (
      <Wrap>
        <Stage label="Sau khi xóa"><MiniBoard cell={20} rows={['Y.M.', '....', 'B.P.', '....']} /></Stage>
        <Flow />
        <Stage label="Rơi xuống"><MiniBoard cell={20} rows={['....', '....', 'Y.M.', 'B.P.']} /></Stage>
      </Wrap>
    ),
    sticky: () => (
      <Stage label="Cùng màu → dính thành cụm">
        <MiniBoard cell={22} rows={['.MM.', 'MMM.', '.M.S']} />
      </Stage>
    ),
    super: () => (
      <Wrap>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <MiniBoard cell={13} rows={['PPPP']} />
          <MiniBoard cell={13} rows={['P', 'P', 'P', 'P']} />
          <MiniBoard cell={13} rows={['PPP', 'PPP', 'PPP']} />
        </div>
        <Flow />
        <Stage label="Thạch Hoàng Gia"><HoangGia color="pink" size={56} /></Stage>
      </Wrap>
    ),
    rainbow: () => (
      <Wrap>
        <Stage label="3×3 đủ ba màu"><MiniBoard cell={18} rows={['YYY', 'MMM', 'BBB']} /></Stage>
        <Flow />
        <Stage label="Thạch Cầu Vồng"><RainbowJelly kind="rainbow" size={62} /></Stage>
      </Wrap>
    ),
    superL2: () => (
      <Wrap>
        <Stage label="2 Thạch Hoàng Gia"><div style={{ display: 'flex', gap: 4 }}><HoangGia color="blue" size={46} /><HoangGia color="blue" size={46} /></div></Stage>
        <Flow />
        <Stage label="Vua Thạch"><VuaThach color="blue" size={62} /></Stage>
      </Wrap>
    ),
    rainbowSuper: () => (
      <Wrap>
        <Stage label="2 kíp nổ"><div style={{ display: 'flex', gap: 4 }}><RainbowJelly kind="rainbow" size={40} /><HoangGia color="yellow" size={40} /></div></Stage>
        <Flow />
        <Stage label="Hoàng Đế Cầu Vồng"><RainbowJelly kind="emperor" size={62} /></Stage>
      </Wrap>
    ),
    blastSuper: () => (
      <Wrap>
        <Stage label="Quét toàn bàn"><MiniBoard cell={16} glow={new Set(['0-1', '1-0', '1-3', '2-1', '3-2'])} rows={['.P.B', 'P.MP', 'BPYP', 'MMPB']} /></Stage>
        <Flow />
        <Stage label="Sạch màu hồng"><MiniBoard cell={16} rows={['...B', '..M.', 'B.Y.', 'MM.B']} /></Stage>
      </Wrap>
    ),
    blastSuperL2: () => (
      <Wrap>
        <Stage label="Cùng màu + vùng 5×5"><MiniBoard cell={15} glow={new Set(['1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-1', '3-2', '3-3'])} rows={['BMPYB', 'BYBPM', 'MYBYP', 'PBMBY', 'YPBMP']} /></Stage>
        <Flow />
        <Stage label="Quét sạch"><MiniBoard cell={15} rows={['BMPYB', 'B....', 'M....', 'P....', 'YPBMP']} /></Stage>
      </Wrap>
    ),
    blastRainbow: () => (
      <Wrap>
        <Stage label="Các màu KỀ nó"><MiniBoard cell={18} glow={new Set(['0-1', '1-0', '1-2', '2-1'])} rows={['.Y.', 'M*P', '.B.'].map(r => r.replace('*', 'P'))} /></Stage>
        <Flow />
        <Stage label="Quét sạch màu kề"><MiniBoard cell={18} rows={['...', '...', '...']} /></Stage>
      </Wrap>
    ),
    blastRainbowSuper: () => (
      <Wrap>
        <Stage label="Bàn đầy"><MiniBoard cell={15} rows={['PMBYP', 'MPSYB', 'BYPMS', 'YBMPY', 'PMYBP']} /></Stage>
        <Flow />
        <Stage label="Sạch trơn (cả đá)"><MiniBoard cell={15} rows={['.....', '.....', '.....', '.....', '.....']} /></Stage>
      </Wrap>
    ),
    comboTurn: () => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'var(--color-gravity)', color: 'var(--color-text-invert)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, boxShadow: '0 5px 0 var(--color-gravity-edge), var(--shadow-md)' }}>
          Combo ×2
        </div>
        <Flow />
        <div style={{ position: 'relative' }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--color-gravity)', boxShadow: '0 5px 0 var(--color-gravity-edge), var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="rotateCw" size={24} color="var(--color-text-invert)" strokeWidth={2.4} />
          </div>
          <span style={{ position: 'absolute', top: -7, right: -10, padding: '0 6px', height: 22, borderRadius: 999, background: 'var(--color-success)', color: 'var(--color-text-invert)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>+1</span>
        </div>
      </div>
    ),
  };

  function Illus({ id }) {
    const fn = DEMOS[id] || DEMOS.sticky;
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>{fn()}</div>;
  }

  window.GJCamNangIllus = { Illus, MiniBoard, SpecialBlock, HoangGia, VuaThach, RainbowJelly };
})();
