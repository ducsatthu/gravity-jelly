/* board-design.jsx — the OFFICIAL play board (“① Game” screen).
   Meadow PNG backdrop + a unified HUD (score card · gravity D-pad · round
   pause button) + the 9×9 board in an SVG cream frame + the 3-well SVG tray
   next to a purple refresh FAB. All chrome art lives in 06-svg-assets/.

   Reuses the DS namespace (JellyBlock, Eyes) and the GJBoard grid renderer.
   Exposes window.GJBoardDesign (also aliased as window.GJGameScreen). */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { JellyBlock, Eyes } = NS;
  const Board = window.GJBoard;
  const BG_SRC = '../06-svg-assets/backgrounds/meadow-bg.png';

  const PAL = {
    yellow: { fill: '#FFE3A3', edge: '#E8B85C', shine: '#FFF1CE' },
    mint:   { fill: '#A3E5D9', edge: '#5FC3B2', shine: '#CBF2EB' },
    pink:   { fill: '#F7A9C0', edge: '#E576A0', shine: '#FBD0DF' },
    blue:   { fill: '#B3C7F7', edge: '#7E9CE8', shine: '#D6E1FB' },
  };

  /* ── Score card: the plain cream card with ĐIỂM label + score number. ── */
  const SCORE_SRC = '../06-svg-assets/ui/score-card.svg';
  function ScoreCard({ score = 12480 }) {
    return (
      <div style={{ position: 'relative', width: 80, aspectRatio: '1 / 1' }}>
        <img src={SCORE_SRC} alt="" aria-hidden="true"
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 800,
                         letterSpacing: '0.08em', color: '#9B886F', lineHeight: 1 }}>ĐIỂM</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
                         color: '#5B4636', lineHeight: 1.05, marginTop: 2, whiteSpace: 'nowrap' }}>
            {score.toLocaleString('vi-VN')}
          </span>
        </div>
      </div>
    );
  }

  /* ── Gravity D-pad: purple candy capsule with ← ↑ ↓ → ; the active
        direction (up) sits in a raised white disc. ── */
  function Arrow({ dir = 'up', color = '#FFFFFF', size = 24 }) {
    const rot = { up: 0, down: 180, left: 270, right: 90 }[dir] || 0;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
           style={{ transform: `rotate(${rot}deg)`, display: 'block' }}>
        <path d="M12 5v14M6 11l6-6 6 6" />
      </svg>
    );
  }

  function GravityPad({ active = 'up', onDir, onRotate }) {
    const ghost = (dir) => (
      <button type="button" onClick={() => (onDir ? onDir(dir) : onRotate && onRotate())} aria-label={`Trọng lực ${dir}`}
        style={{ width: 26, height: 32, border: 'none', background: 'transparent',
                 borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                 cursor: 'pointer', padding: 0 }}>
        <Arrow dir={dir} color="rgba(255,255,255,0.92)" size={20} />
      </button>
    );
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 1,
        padding: '5px 9px',
        background: 'linear-gradient(180deg,#9183F6 0%, #7E6CF0 52%, #6353D6 100%)',
        borderRadius: 999,
        boxShadow: '0 6px 0 #4F3FB0, 0 10px 18px rgba(83,68,196,0.36), inset 0 2px 0 rgba(255,255,255,0.3)',
      }}>
        {ghost('left')}
        {/* active = raised white disc */}
        <button type="button" onClick={() => onRotate && onRotate()} aria-label={`Trọng lực ${active} (đang chọn)`}
          style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', margin: '0 1px',
                   background: 'radial-gradient(120% 120% at 50% 28%, #FFFFFF, #F3ECFF)',
                   boxShadow: '0 4px 0 #C8BCF2, 0 4px 10px rgba(60,44,24,0.18), inset 0 2px 0 rgba(255,255,255,0.9)',
                   display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
          <Arrow dir={active} color="#6353D6" size={24} />
        </button>
        {ghost('down')}
        {ghost('right')}
      </div>
    );
  }

  /* ── Pause button: the supplied flowered frame with a pause glyph. ── */
  function PauseCard({ onPause }) {
    const bar = { width: 4, height: 14, borderRadius: 999, background: '#7E6CF0' };
    return (
      <button type="button" onClick={onPause} aria-label="Tạm dừng"
        style={{ width: 44, height: 44, borderRadius: '50%', border: 'none',
                 background: 'radial-gradient(120% 120% at 50% 28%, #FFFFFF, #F6EFE2)',
                 boxShadow: '0 4px 0 #E3D4BF, 0 6px 12px rgba(120,92,52,0.22), inset 0 2px 0 rgba(255,255,255,0.9)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                 cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
        <span style={bar}></span>
        <span style={bar}></span>
      </button>
    );
  }

  /* ── Board panel: the supplied PNG frame (cream tray + leafy/flower
        corners, transparent surround) with the 9×9 grid dropped into the
        inner well. The PNG carries the frame; GJBoard draws only the grid. ── */
  const FRAME_SRC = '../06-svg-assets/ui/board-frame.svg';
  function BoardPanel({ board, direction }) {
    const S = 332;
    return (
      <div style={{ position: 'relative', width: S, height: S }}>
        <img src={FRAME_SRC} alt="" aria-hidden="true"
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        {/* the playable well, inset to sit inside the raised lip */}
        <div style={{ position: 'absolute', top: '5%', left: '5%', right: '5%', bottom: '5%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Board map={board} direction={direction} cell={31} gap={2} pad={0}
                 style={{ background: 'transparent', boxShadow: 'none', borderRadius: 0 }} />
        </div>
      </div>
    );
  }

  /* ── Tray piece (with eyes + sticker, unlike the dock helper). ── */
  function PieceView({ piece, cell = 30, gap = 3 }) {
    const rows = piece.cells.map(([r]) => r), cols = piece.cells.map(([, c]) => c);
    const minR = Math.min(...rows), minC = Math.min(...cols);
    const nR = Math.max(...rows) - minR + 1, nC = Math.max(...cols) - minC + 1;
    return (
      <div style={{ position: 'relative', width: nC * cell + (nC - 1) * gap, height: nR * cell + (nR - 1) * gap,
                    filter: 'drop-shadow(0 4px 5px rgba(120,92,52,0.18))' }}>
        {piece.cells.map(([r, c], i) => (
          <div key={i} style={{ position: 'absolute', left: (c - minC) * (cell + gap), top: (r - minR) * (cell + gap) }}>
            <JellyBlock color={piece.color} size={cell} showEyes direction="down" />
          </div>
        ))}
      </div>
    );
  }

  /* ── Tray dock: the supplied PNG tray (3 wells) with a piece in each well. ── */
  const TRAY_SRC = '../06-svg-assets/ui/tray.svg';
  function TrayDock({ pieces }) {
    return (
      <div style={{ flex: 1, position: 'relative', aspectRatio: '770 / 260' }}>
        <img src={TRAY_SRC} alt="" aria-hidden="true"
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', top: '7%', left: '3%', right: '3%', bottom: '9%',
                      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {pieces.map((piece, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieceView piece={piece} cell={20} gap={2} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Refresh / shuffle FAB (purple candy). ── */
  function RefreshFab({ onClick }) {
    return (
      <button type="button" onClick={onClick} aria-label="Đổi mảnh"
        style={{ flexShrink: 0, width: 60, height: 60, borderRadius: '50%', border: 'none',
                 background: 'linear-gradient(180deg,#9183F6 0%, #7E6CF0 55%, #6353D6 100%)',
                 boxShadow: '0 6px 0 #4F3FB0, 0 10px 18px rgba(83,68,196,0.36), inset 0 2px 0 rgba(255,255,255,0.3)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                 position: 'relative' }}>
        <span style={{ position: 'absolute', top: 8, left: '28%', right: '28%', height: '22%',
                       background: 'rgba(255,255,255,0.45)', borderRadius: '50%' }} />
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF"
             strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 11a8 8 0 1 0-1.6 5" />
          <path d="M20 5v6h-6" />
        </svg>
      </button>
    );
  }

  /* ── The screen ── */
  function BoardDesign({
    score = 12480,
    gravity,
    direction,
    blockDirection = 'down',
    board,
    pieces,
    onPause,
    onRotate,
    onRefresh,
  }) {
    const grav = gravity || direction || 'up';
    const map = board || [
      '.........', '.........', '.........',
      '.....PP..', '.....PP..', '...M..BB.',
      '.YYM.SBB.', '.YYMMSB..', 'YYYMMSPPP',
    ];
    const trayPieces = pieces || [
      { cells: [[0, 0], [1, 0], [1, 1]], color: 'mint' },
      { cells: [[0, 0], [0, 1], [0, 2]], color: 'pink' },
      { cells: [[0, 0], [0, 1], [1, 0], [1, 1]], color: 'yellow' },
    ];

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
                    fontFamily: 'var(--font-body)' }}>
        <img src={BG_SRC} alt="" aria-hidden="true"
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center bottom', display: 'block' }} />

        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex',
                      flexDirection: 'column', padding: '12px 6px 16px', boxSizing: 'border-box' }}>
          {/* HUD — score, gravity, pause share one bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 6, marginBottom: 16 }}>
            <ScoreCard score={score} />
            <GravityPad active={grav} onRotate={onRotate} />
            <PauseCard onPause={onPause} />
          </div>

          {/* board */}
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 24 }}>
            <BoardPanel board={map} direction={blockDirection} />
          </div>

          {/* tray + refresh — kept close under the board */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
            <TrayDock pieces={trayPieces} />
            <RefreshFab onClick={onRefresh} />
          </div>

          {/* meadow breathing room below */}
          <div style={{ flex: 1, minHeight: 8 }}></div>
        </div>
      </div>
    );
  }

  window.GJBoardDesign = BoardDesign;
  window.GJGameScreen = BoardDesign;
})();
