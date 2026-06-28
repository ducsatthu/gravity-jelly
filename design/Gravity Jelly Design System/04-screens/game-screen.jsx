/* game-screen.jsx — the primary GAME view. HUD + 9x9 board + tray + the
   floating gravity-rotate FAB. Reads DS components from the namespace and
   GJBoard from board.jsx. Exposes window.GJGameScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Hud, Tray, GravityRotateButton, ComboPopup, JellyBlock } = NS;
  const Board = window.GJBoard;

  // JellyMeadow — a soft, layered jelly landscape that permanently dresses the
  // middle band: depth hills, a grassy ground, a swaying flower, mushrooms, a
  // peeking critter and drifting orbs. It STAYS when a combo fires — the
  // ComboPopup simply floats above it on a soft glow, never replacing it.
  function JellyMeadow() {
    const orb = (s) => <div style={{ position: 'absolute', borderRadius: '50%', boxShadow: 'inset 5px -5px 0 rgba(255,255,255,0.38)', ...s }} />;
    const blade = (s) => <div style={{ position: 'absolute', width: 6, borderRadius: '3px 3px 2px 2px', background: 'linear-gradient(180deg,var(--color-block-mint-shine),var(--color-block-mint))', transformOrigin: 'bottom center', ...s }} />;
    const bush = (left, sc, col) => (
      <div style={{ position: 'absolute', left, bottom: 14, width: 56 * sc, height: 30 * sc, filter: 'drop-shadow(0 3px 2px rgba(120,92,52,0.12))' }}>
        {orb({ left: 0, bottom: 0, width: 24 * sc, height: 24 * sc, background: `var(--color-block-${col})`, opacity: 0.92 })}
        {orb({ left: 16 * sc, bottom: 2, width: 30 * sc, height: 30 * sc, background: `var(--color-block-${col}-shine)` })}
        {orb({ left: 34 * sc, bottom: 0, width: 22 * sc, height: 22 * sc, background: `var(--color-block-${col})`, opacity: 0.92 })}
      </div>
    );
    const mushroom = (left, w, col) => (
      <div style={{ position: 'absolute', left, bottom: 13, width: w, height: w * 1.05, filter: 'drop-shadow(0 3px 2px rgba(120,92,52,0.14))' }}>
        <div style={{ position: 'absolute', left: w * 0.32, bottom: 0, width: w * 0.36, height: w * 0.5, borderRadius: '5px 5px 7px 7px', background: 'linear-gradient(180deg,#FCF1DC,#F3E3C4)' }} />
        <div style={{ position: 'absolute', left: 0, bottom: w * 0.36, width: w, height: w * 0.6, borderRadius: '50% 50% 42% 42% / 84% 84% 26% 26%', background: `linear-gradient(180deg,var(--color-block-${col}-shine),var(--color-block-${col}))`, boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.45)' }} />
        <div style={{ position: 'absolute', left: w * 0.24, bottom: w * 0.62, width: w * 0.16, height: w * 0.16, borderRadius: '50%', background: 'rgba(255,255,255,0.8)' }} />
        <div style={{ position: 'absolute', left: w * 0.56, bottom: w * 0.52, width: w * 0.12, height: w * 0.12, borderRadius: '50%', background: 'rgba(255,255,255,0.8)' }} />
      </div>
    );
    return (
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 18 }}>
        <style>{`@keyframes gj-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes gj-sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@media (prefers-reduced-motion: reduce){.gj-fl,.gj-sw{animation:none!important}}`}</style>

        {/* layered hills for depth */}
        <div style={{ position: 'absolute', left: '32%', bottom: 14, width: '46%', height: 32, borderRadius: '50% 50% 0 0 / 100% 100% 0 0', background: 'linear-gradient(180deg,#DCEFD4,#C6E4BD)' }} />
        <div style={{ position: 'absolute', left: '-8%', bottom: 14, width: '58%', height: 44, borderRadius: '50% 50% 0 0 / 100% 100% 0 0', background: 'linear-gradient(180deg,#E6F3E2,#D3EACE)' }} />
        <div style={{ position: 'absolute', right: '-10%', bottom: 14, width: '54%', height: 38, borderRadius: '50% 50% 0 0 / 100% 100% 0 0', background: 'linear-gradient(180deg,#EAF1FA,#DAE6F4)' }} />

        {/* ground + grass line */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 16, background: 'linear-gradient(180deg,#F1E4CB,#E8D6B6)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 15, height: 3, background: 'rgba(150,170,120,0.45)' }} />

        {/* grass tufts */}
        {blade({ left: '3%', bottom: 13, height: 16, transform: 'rotate(-12deg)' })}
        {blade({ left: '5%', bottom: 13, height: 22 })}
        {blade({ left: '7%', bottom: 13, height: 15, transform: 'rotate(12deg)' })}
        {blade({ left: '60%', bottom: 13, height: 14, transform: 'rotate(-10deg)' })}
        {blade({ left: '61.5%', bottom: 13, height: 19 })}

        {/* left bush + swaying flower */}
        {bush('9%', 1, 'mint')}
        <div className="gj-sw" style={{ position: 'absolute', left: '24%', bottom: 14, width: 26, height: 40, transformOrigin: 'bottom center', animation: 'gj-sway 4.2s ease-in-out infinite', filter: 'drop-shadow(0 2px 2px rgba(120,92,52,0.12))' }}>
          <div style={{ position: 'absolute', left: 11, bottom: 0, width: 4, height: 26, borderRadius: 3, background: 'linear-gradient(180deg,var(--color-block-mint-shine),var(--color-block-mint))' }} />
          <div style={{ position: 'absolute', left: 2, bottom: 10, width: 9, height: 7, borderRadius: '0 60% 60% 60%', background: 'var(--color-block-mint)', transform: 'rotate(20deg)' }} />
          <div style={{ position: 'absolute', left: 14, bottom: 14, width: 9, height: 7, borderRadius: '60% 0 60% 60%', background: 'var(--color-block-mint)', transform: 'rotate(-20deg)' }} />
          <div style={{ position: 'absolute', left: 4, bottom: 22, width: 18, height: 16, borderRadius: '50% 50% 46% 46% / 64% 64% 36% 36%', background: 'linear-gradient(180deg,var(--color-block-pink-shine),var(--color-block-pink))', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.5)' }} />
          <div style={{ position: 'absolute', left: 10, bottom: 27, width: 6, height: 6, borderRadius: '50%', background: 'var(--color-block-yellow)' }} />
        </div>

        {/* the jelly cast — real game characters dotted through the scene so the
           band reads as a populated little world (they flank the combo centre). */}
        <div style={{ position: 'absolute', left: '19%', bottom: 21, filter: 'drop-shadow(0 4px 3px rgba(120,92,52,0.16))' }}><JellyBlock color="pink" size={23} showEyes /></div>
        <div style={{ position: 'absolute', left: '37%', bottom: 19, filter: 'drop-shadow(0 5px 3px rgba(120,92,52,0.18))' }}><JellyBlock color="mint" size={28} showEyes /></div>
        <div style={{ position: 'absolute', left: '57%', bottom: 20, filter: 'drop-shadow(0 4px 3px rgba(120,92,52,0.16))' }}><JellyBlock color="blue" size={25} showEyes /></div>

        {/* right mushrooms + bush */}
        {mushroom('66%', 30, 'pink')}
        {mushroom('77%', 22, 'yellow')}
        {bush('86%', 0.85, 'mint')}

        {/* drifting orbs */}
        <div className="gj-fl" style={{ position: 'absolute', left: '30%', bottom: 52, animation: 'gj-float 3.6s ease-in-out infinite' }}>{orb({ position: 'relative', width: 12, height: 12, background: 'var(--color-block-yellow)', opacity: 0.55 })}</div>
        <div className="gj-fl" style={{ position: 'absolute', left: '84%', bottom: 50, animation: 'gj-float 4.4s ease-in-out infinite' }}>{orb({ position: 'relative', width: 14, height: 14, background: 'var(--color-block-pink)', opacity: 0.5 })}</div>

        {/* sparkles */}
        <div style={{ position: 'absolute', left: '46%', top: 10, width: 6, height: 6, borderRadius: '50%', background: 'var(--color-block-yellow-shine)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', left: '70%', top: 8, width: 4, height: 4, borderRadius: '50%', background: 'var(--color-block-pink-shine)', opacity: 0.7 }} />
      </div>
    );
  }

  function GameScreen({
    score = 12480,
    direction = 'down',
    turnsLeft = 3,
    board,
    pieces,
    selectedIndex = 0,
    combo = 0,
    onPause,
    onRotate,
    onSelectPiece,
  }) {
    // Measure the board area and compute a cell size so the 9x9 grid always
    // fits as a perfect square inside the frame (no overflow / clipping).
    const areaRef = React.useRef(null);
    const [cell, setCell] = React.useState(30);
    React.useLayoutEffect(() => {
      const el = areaRef.current;
      if (!el || typeof ResizeObserver === 'undefined') return;
      const measure = () => {
        const w = el.clientWidth - 8;    // slim horizontal padding
        const h = el.clientHeight - 16;  // vertical padding
        const avail = Math.min(w, h);
        const c = Math.floor((avail - 15 - 26) / 9); // 15 frame chrome (pad6+border1.5), 26 board pad(5)+gaps(16)
        setCell(Math.max(20, Math.min(46, c)));
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    // Transient combo burst — the popup + falling jelly is an EVENT, not a
    // fixed decoration: it appears, plays, then fades out. Fire it from the
    // XOAY/gravity button to preview (cycles through tiers), and once on mount
    // from the `combo` prop so the card demonstrates it.
    const [burst, setBurst] = React.useState(null);
    const timerRef = React.useRef(null);
    const seqRef = React.useRef(0);
    const idxRef = React.useRef(0);
    const fireCombo = React.useCallback((c) => {
      const id = ++seqRef.current;
      setBurst({ id, combo: c });
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setBurst((b) => (b && b.id === id ? null : b));
      }, 2000);
    }, []);
    React.useEffect(() => {
      if (combo > 0) fireCombo(combo);
      return () => clearTimeout(timerRef.current);
    }, []); // once on mount
    const handleRotate = () => {
      if (onRotate) onRotate();
      const seq = [1, 2, 3, 5, 9]; // a plain clear, then escalating combos
      const c = seq[idxRef.current % seq.length];
      idxRef.current += 1;
      fireCombo(c);
    };

    // Soft decorative jelly blobs that tie the cream background to the
    // colorful board — low-opacity bokeh in the four signature fills.
    const blobs = [
      { c: 'var(--color-block-pink-shine)',   top: '11%', left: '-6%',  size: 120 },
      { c: 'var(--color-block-mint-shine)',   top: '4%',  right: '-8%', size: 150 },
      { c: 'var(--color-block-yellow-shine)', top: '30%', left: '14%',  size: 64 },
      { c: 'var(--color-block-blue-shine)',   top: '22%', right: '10%', size: 80 },
    ];

    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'radial-gradient(130% 80% at 50% -10%, #FFFBF3 0%, var(--color-bg) 46%, #F6EAD6 100%)' }}>
        {/* decorative backdrop */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {blobs.map((b, i) => (
            <div key={i} style={{ position: 'absolute', top: b.top, left: b.left, right: b.right, width: b.size, height: b.size, borderRadius: '42% 58% 56% 44% / 52% 44% 56% 48%', background: b.c, opacity: 0.5, filter: 'blur(2px)' }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Hud score={score} direction={direction} onPause={onPause} />
        </div>

        {/* Board, framed as a glossy jelly tray (echoes the JellyBlock look:
            squishy radius, top sheen, thick candy edge, colored corner studs). */}
        <div ref={areaRef} style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 4px 12px' }}>
          <div style={{ position: 'relative', padding: 6, borderRadius: 10, background: 'linear-gradient(180deg, #FFFFFF 0%, #FBF1DF 100%)', border: '1.5px solid #F1E3C9', boxShadow: '0 5px 0 #E9D7BA, 0 16px 26px -12px var(--color-shadow-key), inset 0 2px 0 rgba(255,255,255,0.95)' }}>
            {/* glossy top sheen, like a jelly block */}
            <div aria-hidden="true" style={{ position: 'absolute', top: 3, left: '20%', right: '20%', height: 12, background: 'rgba(255,255,255,0.45)', borderRadius: '50%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 2 }} />
            {/* decorative jelly corner studs */}
            {[['pink', { top: 4, left: 4 }], ['mint', { top: 4, right: 4 }], ['yellow', { bottom: 4, left: 4 }], ['blue', { bottom: 4, right: 4 }]].map(([col, pos], i) =>
              <div key={i} aria-hidden="true" style={{ position: 'absolute', ...pos, width: 6, height: 6, borderRadius: '50%', background: `var(--color-block-${col})`, boxShadow: 'inset 0 -1px 1px rgba(0,0,0,0.12), 0 1px 1px rgba(255,255,255,0.7)', zIndex: 3 }} />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Board map={board} direction={direction} cell={cell} gap={2} pad={5} />
            </div>
          </div>
        </div>

        {/* Control band — combo zone fills the gap below the board; the
            labelled gravity action sits to the right, jelly characters left. */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2, padding: '2px 18px 12px' }}>
          {/* Combo zone — fixed height so showing the popup never reflows the
              board (blocks stay put on every device). */}
          <div style={{ position: 'relative', height: 100, overflow: 'visible' }}>
            <style>{`@keyframes gj-combo-life{0%,66%{opacity:1}100%{opacity:0}}`}</style>
            {/* falling jelly tumbles down from the board into the meadow's dish,
                rendered BEHIND the scene props, then the whole burst fades out. */}
            {burst && (
              <div key={'fall-' + burst.id} style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', animation: 'gj-combo-life 2s ease-out forwards', pointerEvents: 'none' }}>
                <ComboPopup combo={Math.max(1, burst.combo)} pieces={burst.combo > 1 ? undefined : 4} showDish={false} showText={false} floor={20} height={172} />
              </div>
            )}
            <JellyMeadow />
            {/* combo text pops in above the band, holds, then fades out. */}
            {burst && burst.combo > 1 && (
              <div key={'txt-' + burst.id} style={{ position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)', zIndex: 3, animation: 'gj-combo-life 2s ease-out forwards', pointerEvents: 'none' }}>
                <ComboPopup combo={burst.combo} showDish={false} showPieces={false} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* a little pile of jelly characters peeking up — playful, on-brand */}
            <div style={{ position: 'relative', width: 128, height: 56 }}>
              <div style={{ position: 'absolute', left: 4, bottom: 0, transform: 'rotate(-9deg)' }}><JellyBlock color="yellow" size={40} direction="down" /></div>
              <div style={{ position: 'absolute', left: 36, bottom: 3, transform: 'rotate(5deg)', zIndex: 2 }}><JellyBlock color="pink" size={46} direction="down" /></div>
              <div style={{ position: 'absolute', left: 80, bottom: 0, transform: 'rotate(11deg)' }}><JellyBlock color="mint" size={38} direction="down" /></div>
            </div>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <GravityRotateButton turnsLeft={turnsLeft} onRotate={handleRotate} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-gravity-edge)', letterSpacing: 'var(--tracking-wide)' }}>XOAY</span>
            </div>
          </div>
        </div>

        {/* Tray */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <Tray pieces={pieces} selectedIndex={selectedIndex} onSelect={onSelectPiece} />
        </div>
      </div>
    );
  }

  window.GJGameScreen = GameScreen;
})();
