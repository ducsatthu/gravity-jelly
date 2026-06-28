/* game-screen.jsx — the primary GAME view. HUD + 9x9 board + tray + the
   floating gravity-rotate FAB. Reads DS components from the namespace and
   GJBoard from board.jsx. Exposes window.GJGameScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Hud, Tray, GravityRotateButton, ComboPopup } = NS;
  const Board = window.GJBoard;

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
    onSelectPiece
  }) {
    // Soft decorative jelly blobs that tie the cream background to the
    // colorful board — low-opacity bokeh in the four signature fills.
    const blobs = [
    { c: 'var(--color-block-pink-shine)', top: '11%', left: '-6%', size: 120 },
    { c: 'var(--color-block-mint-shine)', top: '4%', right: '-8%', size: 150 },
    { c: 'var(--color-block-yellow-shine)', top: '30%', left: '14%', size: 64 },
    { c: 'var(--color-block-blue-shine)', top: '22%', right: '10%', size: 80 }];


    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'radial-gradient(130% 80% at 50% -10%, #FFFBF3 0%, var(--color-bg) 46%, #F6EAD6 100%)' }}>
        {/* decorative backdrop */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {blobs.map((b, i) =>
          <div key={i} style={{ position: 'absolute', top: b.top, left: b.left, right: b.right, width: b.size, height: b.size, borderRadius: '42% 58% 56% 44% / 52% 44% 56% 48%', background: b.c, opacity: 0.5, filter: 'blur(2px)' }} />
          )}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Hud score={score} direction={direction} onPause={onPause} />
        </div>

        {/* Board, framed in a raised play-field panel */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 14px 8px' }}>
          <div style={{ position: 'relative', padding: 10, borderRadius: 'calc(var(--radius-2xl) + 6px)', background: 'linear-gradient(180deg, #FFFDF8 0%, #FBF2E2 100%)', boxShadow: '0 14px 30px -10px var(--color-shadow-key), 0 2px 0 rgba(255,255,255,0.7) inset', border: '1px solid rgba(255,255,255,0.8)' }}>
            {/* corner pegs */}
            {[[8, 8], [8, 'auto', 8], ['auto', 8, 'auto', 8], ['auto', 'auto', 8, 8]].map((p, i) =>
            <div key={i} style={{ position: 'absolute', top: p[0], right: p[1], bottom: p[2], left: p[3], width: 7, height: 7, borderRadius: '50%', background: 'var(--color-cell-line)', boxShadow: 'inset 0 1px 1px rgba(120,92,52,0.18)' }} />
            )}
            <Board map={board} direction={direction} cell={36} gap={2} pad={8} />
          </div>
          {combo > 1 &&
          <div style={{ position: 'absolute', top: '32%', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
              <ComboPopup key={combo + '-' + score} combo={combo} />
            </div>
          }
        </div>

        {/* Control band — gives the gap between board and tray purpose:
             labelled gravity action on the right, decorative jellies left. */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 18px 14px', overflow: 'hidden' }}>
          {/* drifting decorative jellies */}
          <div aria-hidden="true" style={{ position: 'absolute', left: 22, top: 6, width: 46, height: 46, borderRadius: '46% 54% 52% 48% / 54% 46% 54% 46%', background: 'var(--color-block-mint-shine)', opacity: 0.55 }} />
          <div aria-hidden="true" style={{ position: 'absolute', left: 70, top: 36, width: 26, height: 26, borderRadius: '48% 52% 46% 54% / 52% 48% 52% 48%', background: 'var(--color-block-yellow-shine)', opacity: 0.6 }} />
          <div aria-hidden="true" style={{ position: 'absolute', left: 132, top: 14, width: 18, height: 18, borderRadius: '50%', background: 'var(--color-block-pink-shine)', opacity: 0.6 }} />

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)' }}>MẸO</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-label)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)', maxWidth: 168, lineHeight: 1.25 }}>Chạm khối rồi đặt vào bảng để dồn cùng màu.</span>
          </div>

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <GravityRotateButton turnsLeft={turnsLeft} onRotate={onRotate} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-gravity-edge)', letterSpacing: 'var(--tracking-wide)' }}>XOAY</span>
          </div>
        </div>

        {/* Tray */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <Tray pieces={pieces} selectedIndex={selectedIndex} onSelect={onSelectPiece} />
        </div>
      </div>);

  }

  window.GJGameScreen = GameScreen;
})();