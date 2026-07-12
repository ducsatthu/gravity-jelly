/* board-campaign.jsx — CAMPAIGN in-game board ("① Game · Chiến dịch").
   Same meadow backdrop, board frame, tray + refresh FAB, and the SAME 3-slot
   HUD structure as the canonical endless "① Game" / "① Game · Mục tiêu" screens
   (stat · gravity D-pad · pause), reused from window.GJBoardParts — but the
   endless SCORE slot is a LƯỢT (moves) stat card, plus two campaign-only
   readouts a level needs:
     • current STARS earned    — level badge under the HUD (score thresholds live)
     • OBJECTIVE progress bar   — a cream banner of goal chips (cleared / target)
   Exposes window.GJBoardCampaign. */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { JellyBlock } = NS;
  const EX = window.GJExtras;
  const P = window.GJBoardParts;
  const BG_SRC = '../06-svg-assets/backgrounds/meadow-bg.jpg';
  const CARD_SRC = '../06-svg-assets/ui/score-card.svg';

  /* Reuse the cream score-card art for any labelled stat (here: LƯỢT). Turns
     tangerine-warning when moves run low so the player feels the pressure. */
  function StatCard({ label, value, low = false }) {
    return (
      <div style={{ position: 'relative', width: 76, aspectRatio: '1 / 1', flexShrink: 0 }}>
        <img src={CARD_SRC} alt="" aria-hidden="true"
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 800,
                         letterSpacing: '0.08em', color: '#9B886F', lineHeight: 1 }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700,
                         color: low ? '#E97E45' : '#5B4636', lineHeight: 1.05, marginTop: 1 }}>{value}</span>
        </div>
      </div>
    );
  }

  /* Level badge — world/level small caps + a live 3-star row (how many stars
     the current score has secured). Sits on a soft cream lozenge over grass. */
  function LevelBadge({ level, world, stars }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    padding: '7px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 3px 10px rgba(120,92,52,0.18), inset 0 1px 0 rgba(255,255,255,0.95)' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11,
                       letterSpacing: '0.05em', color: '#9B886F', lineHeight: 1, whiteSpace: 'nowrap' }}>
          MÀN {level} · {world.toUpperCase()}
        </span>
        <EX.Stars earned={stars} size={19} gap={3} lift={false} />
      </div>
    );
  }

  const CHECK = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff"
         strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4 10-11" /></svg>
  );

  /* One objective: a mini jelly of the target colour + "cleared / target".
     When complete the count is swapped for a green check disc on the block. */
  function GoalItem({ color, cleared, target }) {
    const done = cleared >= target;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ position: 'relative', filter: 'drop-shadow(0 2px 3px rgba(120,92,52,0.18))' }}>
          <JellyBlock color={color} size={30} showEyes direction="down" />
          {done && (
            <span style={{ position: 'absolute', bottom: -4, right: -4, width: 18, height: 18,
                           borderRadius: '50%', background: '#6FCF7F',
                           boxShadow: '0 2px 0 #4FA95F, 0 2px 5px rgba(120,92,52,0.25)',
                           display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{CHECK}</span>
          )}
        </div>
        {!done && (
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
                         lineHeight: 1, color: '#5B4636', whiteSpace: 'nowrap' }}>
            {cleared}/{target}
          </span>
        )}
      </div>
    );
  }

  function ObjectiveBanner({ goals }) {
    return (
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', borderRadius: 20, boxSizing: 'border-box',
                    background: 'rgba(255,247,236,0.94)',
                    boxShadow: '0 5px 14px rgba(120,92,52,0.16), inset 0 1px 0 rgba(255,255,255,0.85)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingRight: 9,
                      borderRight: '2px solid #EADCC6', flexShrink: 0 }}>
          <EX.Target size={16} color="#9B886F" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
                         letterSpacing: '0.06em', color: '#9B886F', whiteSpace: 'nowrap' }}>MỤC TIÊU</span>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {goals.map((g, i) => <GoalItem key={i} color={g.color} cleared={g.cleared} target={g.target} />)}
        </div>
      </div>
    );
  }

  function BoardCampaign({
    level = 23,
    world = 'Sông & Thác',
    moves = 18,
    stars = 2,
    gravity = 'up',
    goals,
    blockDirection = 'down',
    board,
    pieces,
    onPause,
    onRotate,
    onRefresh,
  }) {
    const g = goals || [
      { color: 'mint', cleared: 18, target: 18 },
      { color: 'pink', cleared: 7, target: 12 },
      { color: 'blue', cleared: 4, target: 10 },
    ];
    const map = board || [
      '.........', '.........', '....PP...',
      '....PP...', '...M..BB.', '.YYM.SBB.',
      '.YYMMSB..', 'BYYMMSPPP', 'BBYMMSPPP',
    ];
    const trayPieces = pieces || [
      { cells: [[0, 0], [1, 0], [1, 1]], color: 'mint' },
      { cells: [[0, 0], [0, 1], [0, 2]], color: 'pink' },
      { cells: [[0, 0], [0, 1], [1, 0], [1, 1]], color: 'blue' },
    ];

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
                    fontFamily: 'var(--font-body)' }}>
        <img src={BG_SRC} alt="" aria-hidden="true"
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center bottom', display: 'block' }} />

        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex',
                      flexDirection: 'column', padding: '12px 12px 16px', boxSizing: 'border-box' }}>
          {/* HUD — same 3-slot structure as ① Game · Mục tiêu / endless: stat · gravity · pause */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <StatCard label="LƯỢT" value={moves} low={moves <= 5} />
            <P.GravityPad active={gravity} onRotate={onRotate} />
            <P.PauseCard onPause={onPause} />
          </div>

          {/* level + live stars */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <LevelBadge level={level} world={world} stars={stars} />
          </div>

          {/* objectives progress */}
          <div style={{ marginTop: 10 }}>
            <ObjectiveBanner goals={g} />
          </div>

          {/* board */}
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginTop: 12 }}>
            <P.BoardPanel board={map} direction={blockDirection} />
          </div>

          {/* tray + refresh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <P.TrayDock pieces={trayPieces} />
            <P.RefreshFab onClick={onRefresh} />
          </div>

          <div style={{ flex: 1, minHeight: 6 }}></div>
        </div>
      </div>
    );
  }

  window.GJBoardCampaign = BoardCampaign;
})();
