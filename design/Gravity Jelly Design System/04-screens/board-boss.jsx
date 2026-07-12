/* board-boss.jsx — BOSS in-game board ("① Game · Boss"), the campaign
   boss-level fight (levels 10/20/30…). Same meadow board + gravity D-pad +
   tray as the play screen, plus a purple danger vignette and a full-width
   BOSS panel that carries the fight's progress readouts:
     • boss HP bar (the objective — deplete before moves run out)
     • PHA x/y phase pips
     • MOVES left (top-right stat card)
     • current STARS earned (in the boss panel header)
   The board seeds a few STONE cells = the boss's armour to smash.
   Exposes window.GJBoardBoss. */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { JellyBlock } = NS;
  const EX = window.GJExtras;
  const P = window.GJBoardParts;
  const BG_SRC = '../06-svg-assets/backgrounds/meadow-bg.jpg';
  const CARD_SRC = '../06-svg-assets/ui/score-card.svg';

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

  /* BOSS banner pill — crown + BOSS + level, tangerine-warning like the intro. */
  function BossBanner({ level }) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px',
                    borderRadius: 999, background: 'var(--color-warning)', boxShadow: '0 4px 0 #E2A82E' }}>
        <EX.Crown size={17} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
                       letterSpacing: '0.1em', color: '#5B4636', whiteSpace: 'nowrap' }}>BOSS · MÀN {level}</span>
      </div>
    );
  }

  /* The mini boss face — a gravity-purple block with the same menacing eyes
     as the Boss Intro, shrunk to sit in the HP panel. */
  function BossFace({ size = 46 }) {
    return (
      <div style={{ position: 'relative', flexShrink: 0, filter: 'drop-shadow(0 3px 5px rgba(46,38,112,0.4))' }}>
        <JellyBlock color="stone" size={size} showEyes={false}
                    style={{ background: 'var(--color-gravity)', borderColor: 'var(--color-gravity-edge)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: size * 0.14 }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ position: 'relative', width: size * 0.28, height: size * 0.28,
                                  borderRadius: '50%', background: '#fff', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center',
                                  boxShadow: 'inset 0 0 0 1.5px rgba(74,53,38,0.25)' }}>
              <div style={{ width: size * 0.14, height: size * 0.14, borderRadius: '50%', background: '#4A3526' }} />
              <div style={{ position: 'absolute', top: -size * 0.06,
                            left: i ? 'auto' : -size * 0.04, right: i ? -size * 0.04 : 'auto',
                            width: size * 0.24, height: size * 0.1, background: 'var(--color-gravity)',
                            transform: `rotate(${i ? -22 : 22}deg)`, borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function PhasePips({ phase, phases }) {
    return (
      <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
        {Array.from({ length: phases }).map((_, i) => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: '50%',
                                  background: i < phase ? 'var(--color-gravity-shine)' : 'rgba(255,255,255,0.28)',
                                  boxShadow: i < phase ? '0 0 5px var(--color-gravity-shine)' : 'none' }} />
        ))}
      </span>
    );
  }

  /* The boss panel = objective progress. Boss face · name + stars · phase,
     then the HP bar (danger-red on a sunken purple track) with numeric. */
  function BossPanel({ name, hp, maxHp, phase, phases, stars }) {
    const pct = Math.max(0, Math.min(1, hp / maxHp));
    return (
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, boxSizing: 'border-box',
                    padding: '9px 13px 9px 9px', borderRadius: 22,
                    background: 'linear-gradient(180deg, rgba(99,83,214,0.96), rgba(46,38,112,0.96))',
                    boxShadow: '0 7px 16px rgba(46,38,112,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
        <BossFace size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
                           color: '#fff', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
            <EX.Stars earned={stars} size={15} gap={2} lift={false} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative', height: 14, borderRadius: 999,
                          background: 'rgba(0,0,0,0.32)', overflow: 'hidden',
                          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.35)' }}>
              <div style={{ position: 'absolute', inset: 0, right: `${(1 - pct) * 100}%`,
                            borderRadius: 999, background: 'linear-gradient(180deg,#FFB0A2,#F08A7E)',
                            boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.45)',
                            transition: 'right 300ms var(--ease-out, ease)' }} />
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                             justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700,
                             fontSize: 10, color: '#fff', textShadow: '0 1px 2px rgba(46,38,112,0.8)' }}>
                {hp.toLocaleString('vi-VN')} / {maxHp.toLocaleString('vi-VN')}
              </span>
            </div>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 9,
                             letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>PHA {phase}/{phases}</span>
              <PhasePips phase={phase} phases={phases} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function BoardBoss({
    level = 20,
    name = 'Thạch Khổng Lồ',
    hp = 1240,
    maxHp = 2000,
    phase = 2,
    phases = 3,
    moves = 16,
    stars = 1,
    gravity = 'up',
    blockDirection = 'down',
    board,
    pieces,
    onPause,
    onRotate,
    onRefresh,
  }) {
    // stone cells = the boss armour to smash
    const map = board || [
      '.........', '...SSS...', '..SBBBS..',
      '..SBPBS..', '...MPM...', '.YYM.SBB.',
      '.YYMMSB..', 'BYYMMSPPP', 'BBYMMSPPP',
    ];
    const trayPieces = pieces || [
      { cells: [[0, 0], [1, 0], [1, 1]], color: 'pink' },
      { cells: [[0, 0], [0, 1], [0, 2]], color: 'blue' },
      { cells: [[0, 0], [0, 1], [1, 0], [1, 1]], color: 'mint' },
    ];

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
                    fontFamily: 'var(--font-body)' }}>
        <img src={BG_SRC} alt="" aria-hidden="true"
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center bottom', display: 'block' }} />
        {/* boss danger vignette — purple pull from the top */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0,
              background: 'radial-gradient(130% 62% at 50% -8%, rgba(99,83,214,0.5), rgba(99,83,214,0.14) 45%, transparent 68%)',
              pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex',
                      flexDirection: 'column', padding: '12px 6px 16px', boxSizing: 'border-box' }}>
          {/* header — pause · BOSS banner · moves */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <P.PauseCard onPause={onPause} />
            <BossBanner level={level} />
            <StatCard label="LƯỢT" value={moves} low={moves <= 5} />
          </div>

          {/* boss HP / phase — the objective */}
          <div style={{ marginTop: 10 }}>
            <BossPanel name={name} hp={hp} maxHp={maxHp} phase={phase} phases={phases} stars={stars} />
          </div>

          {/* gravity control */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <P.GravityPad active={gravity} onRotate={onRotate} />
          </div>

          {/* board (with stone armour) */}
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
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

  window.GJBoardBoss = BoardBoss;
})();
