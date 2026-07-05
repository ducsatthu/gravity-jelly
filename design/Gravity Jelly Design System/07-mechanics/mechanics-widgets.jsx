/* mechanics-widgets.jsx — bespoke widget bodies for non-board mechanic cards.
   Each entry: (card, helpers) => ReactNode  (the card body; CardShell adds the
   title chip + caption). Registered on window.GJMechW. Loaded after the kit. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { JellyBlock, TrayPiece, GravityRotateButton, Icon, Eyes } = NS;
  const X = window.GJExtras || {};
  const CODE = { Y: 'yellow', M: 'mint', P: 'pink', B: 'blue', S: 'stone' };

  /* tiny free-standing jelly piece (no board well) */
  function Piece({ rows, cell = 26, gap = 3 }) {
    const grid = rows.map((s) => s.split(''));
    const cols = grid[0].length;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gridAutoRows: `${cell}px`, gap }}>
        {grid.map((row, r) => row.map((ch, c) => ch === '.'
          ? <div key={r + '-' + c} style={{ width: cell, height: cell }} />
          : <JellyBlock key={r + '-' + c} color={CODE[ch]} size={cell} direction="down" showEyes={cell >= 22} />))}
      </div>
    );
  }

  /* rainbow piece for trays */
  function RainbowPiece({ cell = 26 }) {
    const r = Math.round(cell * 0.28);
    return <div style={{ width: cell, height: cell, borderRadius: r, border: '3px solid #C9A6E8', background: 'conic-gradient(from 210deg, var(--color-block-yellow), var(--color-block-mint), var(--color-block-blue), var(--color-block-pink), var(--color-block-yellow))', boxShadow: 'var(--shadow-sm)' }} />;
  }

  /* a tray dock shell */
  function Dock({ children, style = {} }) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '16px 18px', ...style }}>{children}</div>;
  }
  function Slot({ children, dashed, w = 78, h = 78, label }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ width: w, height: h, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-sunken)', boxShadow: dashed ? 'none' : 'inset 0 2px 5px rgba(120,92,52,.12)', border: dashed ? '2px dashed var(--color-cell-line)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
        {label && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{label}</span>}
      </div>
    );
  }

  /* small labelled state pill used between/within widgets */
  function StateLabel({ children }) {
    return <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--color-text-muted)', alignSelf: 'flex-start' }}>{children}</span>;
  }
  function DownArrow() {
    return <div className="gj-arrow" style={{ color: 'var(--color-gravity)', display: 'flex' }}><span style={{ display: 'flex', transform: 'rotate(90deg)' }}><Icon name="chevron" size={22} strokeWidth={2.8} /></span></div>;
  }

  /* ===== Boss face ===== =================================================
     Boss = jelly block (giữ nhận diện) nhưng dữ dằn: mắt híp gằn, KHÔNG miệng,
     vương miện đổi theo map, giáp đá quanh cổ, hào quang bóng tối phía sau. */

  /* vương miện theo từng map — chỉ đổi màu đá quý (jewel) theo thế giới 1..10 */
  const MAP_CROWNS = {
    1:  '#6FCF7F', // Đồng cỏ
    2:  '#5FC3B2', // Rừng rậm
    3:  '#8FB6F2', // Sông & Thác
    4:  '#FFCA66', // Sa mạc
    5:  '#5FC3B2', // Bãi biển
    6:  '#B3C7F7', // Núi tuyết
    7:  '#A99CF6', // Hang băng
    8:  '#F08A7E', // Núi lửa
    9:  '#8FB6F2', // Bầu trời
    10: '#A99CF6', // Vũ trụ
  };
  const WORLD_NAMES = {
    1: 'Đồng cỏ', 2: 'Rừng rậm', 3: 'Sông & Thác', 4: 'Sa mạc', 5: 'Bãi biển',
    6: 'Núi tuyết', 7: 'Hang băng', 8: 'Núi lửa', 9: 'Bầu trời', 10: 'Vũ trụ',
  };

  /* gold crown — gem màu = jewel (đổi theo map) */
  function CrownTop({ size, jewel }) {
    const w = size * 0.66, h = size * 0.46;
    return (
      <div style={{ position: 'absolute', top: -h * 0.72, left: '50%', transform: 'translateX(-50%)', width: w, height: h, zIndex: 4 }}>
        <svg viewBox="0 0 100 70" width={w} height={h} style={{ display: 'block', filter: 'drop-shadow(0 3px 2px rgba(74,53,38,.35))' }}>
          <path d="M11 60 L11 16 L34 38 L50 6 L66 38 L89 16 L89 60 Z" fill="#FFCA66" stroke="#E8B85C" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
          <rect x="7" y="52" width="86" height="15" rx="6" fill="#FFD27A" stroke="#E8B85C" strokeWidth="4" />
          <path d="M15 52 L34 40 L50 14 L66 40 L85 52" fill="none" stroke="#FFF1CE" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
          <circle cx="11" cy="16" r="5.5" fill={jewel} stroke="#E8B85C" strokeWidth="2" />
          <circle cx="50" cy="6" r="6.5" fill={jewel} stroke="#E8B85C" strokeWidth="2" />
          <circle cx="89" cy="16" r="5.5" fill={jewel} stroke="#E8B85C" strokeWidth="2" />
          <circle cx="50" cy="59" r="4.6" fill={jewel} />
          <circle cx="30" cy="59" r="3.4" fill="#FFF1CE" />
          <circle cx="70" cy="59" r="3.4" fill="#FFF1CE" />
        </svg>
      </div>
    );
  }

  /* mắt gằn — tròng trắng híp dưới mí dày, đồng tử phát sáng, lông mày chếch vào */
  function FierceEye({ flip, w, body, glow }) {
    return (
      <div style={{ position: 'relative', width: w, height: w, transform: flip ? 'scaleX(-1)' : 'none' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.22)' }}>
          {/* mí trên dày (màu thân) hạ xuống tạo ánh nhìn gằn */}
          <div style={{ position: 'absolute', top: '-52%', left: '-26%', width: '152%', height: '92%', background: body, transform: 'rotate(19deg)' }} />
          {/* đồng tử phát sáng */}
          <div style={{ position: 'absolute', left: '30%', top: '42%', width: w * 0.46, height: w * 0.46, borderRadius: '50%', background: '#1E1340', boxShadow: `0 0 ${w * 0.24}px ${glow}, inset 0 0 ${w * 0.1}px ${glow}` }}>
            <div style={{ position: 'absolute', top: '12%', left: '16%', width: '36%', height: '36%', borderRadius: '50%', background: '#fff', opacity: 0.95 }} />
          </div>
        </div>
        {/* lông mày gằn */}
        <div style={{ position: 'absolute', top: '-22%', left: '-4%', width: '92%', height: w * 0.2, background: '#241742', borderRadius: 4, transform: 'rotate(19deg)', transformOrigin: 'right center' }} />
      </div>
    );
  }

  /* giáp đá quanh cổ + ngù vai, gem ngực = jewel */
  function BossArmor({ size, jewel }) {
    const s = size;
    const pauldron = {
      position: 'absolute', bottom: s * 0.16, width: s * 0.32, height: s * 0.27,
      borderRadius: '52% 52% 44% 44%', background: 'linear-gradient(180deg,#DBD0BF,#A89A82)',
      border: '3px solid #8A7E68', boxShadow: 'var(--shadow-sm)', zIndex: 2,
    };
    return (
      <React.Fragment>
        <div style={{ ...pauldron, left: -s * 0.13 }} />
        <div style={{ ...pauldron, right: -s * 0.13 }} />
        {/* gorget / yếm giáp */}
        <div style={{ position: 'absolute', bottom: -s * 0.05, left: '50%', transform: 'translateX(-50%)', width: s * 0.94, height: s * 0.34, borderRadius: '38% 38% 50% 50% / 64% 64% 100% 100%', background: 'linear-gradient(180deg,#DBD0BF,#C9BCA8 46%,#A89A82)', border: '3px solid #8A7E68', boxShadow: 'var(--shadow-sm)', zIndex: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden' }}>
          <div style={{ marginTop: s * 0.05, width: s * 0.13, height: s * 0.13, borderRadius: '50%', background: jewel, border: '2px solid #8A7E68', boxShadow: `0 0 ${s * 0.09}px ${jewel}, inset 0 1px 2px rgba(255,255,255,.5)` }} />
          {/* rivets */}
          <div style={{ position: 'absolute', bottom: s * 0.05, left: s * 0.14, width: s * 0.045, height: s * 0.045, borderRadius: '50%', background: '#8A7E68' }} />
          <div style={{ position: 'absolute', bottom: s * 0.05, right: s * 0.14, width: s * 0.045, height: s * 0.045, borderRadius: '50%', background: '#8A7E68' }} />
        </div>
      </React.Fragment>
    );
  }

  function BossFace({ size = 116, hp = 1, mood = 'angry', aura = true, color = '#7E6CF0', edge = '#6353D6', world, jewel }) {
    const s = size;
    const wrap = s * 1.6;
    const gem = jewel || (world && MAP_CROWNS[world]) || '#F08A7E';
    const eyeW = s * 0.26;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: s * 0.12 }}>
        <div style={{ position: 'relative', width: wrap, height: wrap, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* hào quang bóng tối */}
          {aura && (
            <React.Fragment>
              <div style={{ position: 'absolute', width: s * 1.5, height: s * 1.5, borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,24,74,.62), rgba(40,24,74,.18) 52%, transparent 72%)', filter: 'blur(3px)', animation: 'gjPulse 2.6s ease infinite' }} />
              <div style={{ position: 'absolute', width: s * 1.22, height: s * 1.22, borderRadius: '50%', boxShadow: `0 0 0 3px rgba(99,83,214,.32), 0 0 ${s * 0.2}px ${s * 0.05}px rgba(126,108,240,.45)` }} />
            </React.Fragment>
          )}
          {/* nhóm boss: vương miện + khối jelly + giáp */}
          <div style={{ position: 'relative', width: s, height: s }}>
            <CrownTop size={s} jewel={gem} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: s * 0.3, background: `linear-gradient(180deg, ${color}, ${edge})`, border: `${Math.max(3, s * 0.035)}px solid ${edge}`, boxSizing: 'border-box', boxShadow: 'var(--shadow-md), inset 0 -7px 11px rgba(36,23,66,.4)', overflow: 'hidden', zIndex: 1 }}>
              {/* gloss đỉnh */}
              <div style={{ position: 'absolute', top: s * 0.06, left: '14%', right: '14%', height: '26%', background: 'linear-gradient(180deg, rgba(169,156,246,.85), rgba(169,156,246,0))', borderRadius: '50%' }} />
              {/* mắt gằn — KHÔNG miệng */}
              <div style={{ position: 'absolute', top: '36%', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: s * 0.12 }}>
                <FierceEye flip={false} w={eyeW} body={edge} glow={gem} />
                <FierceEye flip={true} w={eyeW} body={edge} glow={gem} />
              </div>
            </div>
            <BossArmor size={s} jewel={gem} />
          </div>
        </div>
        {hp != null && (
          <div style={{ width: s, height: 12, borderRadius: 999, background: 'var(--color-surface-sunken)', boxShadow: 'inset 0 1px 3px rgba(120,92,52,.18)', overflow: 'hidden' }}>
            <div style={{ width: (hp * 100) + '%', height: '100%', borderRadius: 999, background: hp > 0.5 ? 'var(--color-success)' : 'var(--color-danger)', transition: 'width .4s' }} />
          </div>
        )}
      </div>
    );
  }

  /* ===================== WIDGETS ===================== */
  const W = {};

  /* simple tray: 3 pieces (D3 stone, D4 two-color) */
  W.tray = (card, h) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {card.note && <StateLabel>{card.note}</StateLabel>}
      <Dock>
        {card.pieces.map((p, i) => (
          <Slot key={i}>{p.rainbow ? <RainbowPiece cell={26} /> : <Piece rows={p.rows} cell={24} />}</Slot>
        ))}
      </Dock>
    </div>
  );

  /* D1 hold: before(3 + empty hold) → after(2 + filled hold) */
  W.trayHold = (card) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>
      <StateLabel>TRƯỚC</StateLabel>
      <Dock>
        {card.before.map((p, i) => <Slot key={i}>{p ? <Piece rows={p.rows} cell={22} /> : null}</Slot>)}
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--color-cell-line)' }} />
        <Slot dashed label="HOLD">{null}</Slot>
      </Dock>
      <DownArrow />
      <StateLabel>SAU</StateLabel>
      <Dock>
        {card.after.map((p, i) => <Slot key={i}>{p ? <Piece rows={p.rows} cell={22} /> : null}</Slot>)}
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--color-cell-line)' }} />
        <Slot label="HOLD"><Piece rows={card.held.rows} cell={22} /></Slot>
      </Dock>
    </div>
  );

  /* D2 preview two waves */
  W.trayPreview = (card) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ opacity: 0.45, transform: 'scale(.82)' }}>
        <StateLabel>ĐỢT SAU</StateLabel>
        <Dock style={{ padding: '10px 14px', boxShadow: 'var(--shadow-sm)' }}>
          {card.next.map((p, i) => <Slot key={i} w={58} h={58}><Piece rows={p.rows} cell={16} /></Slot>)}
        </Dock>
      </div>
      <StateLabel>ĐỢT HIỆN TẠI</StateLabel>
      <Dock>
        {card.current.map((p, i) => <Slot key={i}><Piece rows={p.rows} cell={24} /></Slot>)}
      </Dock>
    </div>
  );

  /* D5 single hardcore slot */
  W.traySingle = (card) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, letterSpacing: '.08em', color: 'var(--color-danger)', background: 'color-mix(in srgb, var(--color-danger) 14%, #fff)', padding: '4px 14px', borderRadius: 999 }}>HARDCORE</span>
      <Dock style={{ padding: '20px 26px' }}>
        <Slot w={96} h={96}><Piece rows={card.piece.rows} cell={26} /></Slot>
      </Dock>
    </div>
  );

  /* D6 giant piece */
  W.trayGiant = (card) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <Dock>
        <Slot w={64} h={64}><Piece rows={card.small[0].rows} cell={18} /></Slot>
        <Slot w={132} h={92} style={{}}>
          <div style={{ animation: 'gjPulse 1.6s ease infinite' }}><Piece rows={card.giant.rows} cell={26} /></div>
        </Slot>
        <Slot w={64} h={64}><Piece rows={card.small[1].rows} cell={18} /></Slot>
      </Dock>
    </div>
  );

  /* B1 combo meter */
  W.comboMeter = (card) => {
    const { ComboPopup } = NS;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: '100%' }}>
        {[{ m: 1, f: 0.0, l: 'BẮT ĐẦU' }, { m: 2, f: 0.55, l: 'CHUỖI 2' }, { m: 3, f: 1, l: 'CHUỖI 3' }].map((row) => (
          <div key={row.m} style={{ display: 'flex', alignItems: 'center', gap: 14, width: 300 }}>
            <div style={{ width: 56, display: 'flex', justifyContent: 'center' }}><ComboPopup combo={row.m} showPieces={false} showDish={false} animate={false} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ height: 16, borderRadius: 999, background: 'var(--color-surface-sunken)', boxShadow: 'inset 0 1px 3px rgba(120,92,52,.18)', overflow: 'hidden' }}>
                <div style={{ width: (row.f * 100) + '%', height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--color-warning), var(--color-primary))' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '.04em', color: 'var(--color-text-muted)' }}>{row.l}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  /* goal HUD card */
  function GoalCard({ icon, title, counter, frac, crossed }) {
    return (
      <div style={{ width: 300, background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>{title}</div>
            {counter && <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, color: 'var(--color-text-muted)' }}>{counter}</div>}
          </div>
          {crossed && <div style={{ position: 'relative', width: 44, height: 44 }}>
            <GravityRotateButton turnsLeft={0} disabled style={{ transform: 'scale(.66)', transformOrigin: 'center' }} />
            <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', boxShadow: 'inset 0 0 0 3px var(--color-danger)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 2, right: 2, height: 3, background: 'var(--color-danger)', transform: 'rotate(-38deg)' }} />
          </div>}
        </div>
        {frac != null && <div style={{ height: 14, borderRadius: 999, background: 'var(--color-surface-sunken)', overflow: 'hidden' }}><div style={{ width: (frac * 100) + '%', height: '100%', borderRadius: 999, background: 'var(--color-success)' }} /></div>}
      </div>
    );
  }
  W.goalNoRotate = (card) => <GoalCard icon={<X.Target size={26} color="var(--color-gravity)" />} title={card.title} counter={card.counter} crossed />;
  W.goalColor = (card) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <GoalCard icon={<JellyBlock color="mint" size={34} showEyes={false} />} title={card.title} counter={card.counter} frac={card.frac} />
      <div style={{ display: 'flex', gap: 6 }}>{['M', 'M', 'M', 'M', 'M'].map((c, i) => <JellyBlock key={i} color="mint" size={30} clearing={i < 2} />)}</div>
    </div>
  );

  /* C-pool modifier palette */
  W.modifierPalette = (card, h) => {
    const { MiniBoard } = h;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {card.items.map((it, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '12px 6px' }}>
            <div style={{ position: 'relative' }}>
              <MiniBoard rows={[it.ch]} deco={it.deco ? { '0,0': it.deco } : {}} cell={40} gap={0} pad={0} />
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-text)', textAlign: 'center', lineHeight: 1.2 }}>{it.label}</span>
          </div>
        ))}
      </div>
    );
  };

  /* F3 boss lock color */
  W.bossLockColor = (card) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <BossFace mood="angry" hp={0.7} />
      <div style={{ width: 290, background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <JellyBlock color="mint" size={40} showEyes={false} style={{ opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: -6, right: -6 }}>{X.Lock && <X.Lock size={20} color="var(--color-danger)" />}</div>
        </div>
        <div style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>{card.title}<div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, color: 'var(--color-text-muted)' }}>{card.counter}</div></div>
      </div>
    </div>
  );

  /* F5 boss phases */
  W.bossPhases = (card) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <BossFace hp={1} mood="normal" size={96} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>Pha 1</span>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Đòn: mọc dây</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'var(--color-gravity)', flexShrink: 0 }}>
        <Icon name="chevron" size={24} strokeWidth={3} />
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>−½ máu</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <BossFace hp={0.5} mood="angry" size={96} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>Pha 2</span>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Đòn: xoay</span>
      </div>
    </div>
  );

  /* boss board: boss face on top + before/after boards */
  W.bossBoard = (card, h) => {
    const { MiniBoard, Panel, ActionNode, GravityChip } = h;
    const b = card.boss || {};
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
        <BossFace mood={b.mood || 'angry'} hp={b.hp != null ? b.hp : 1} world={b.world} jewel={b.jewel} size={96} />
        {b.crownStrip && <MapCrownStrip />}
        <Panel label="TRƯỚC"><MiniBoard {...card.before} /></Panel>
        <ActionNode>{window.GJMech.renderAction(card.action)}</ActionNode>
        <Panel label="SAU"><MiniBoard {...card.after} /></Panel>
      </div>
    );
  };

  /* vương miện theo map — dải minh hoạ 10 thế giới */
  function MapCrownStrip() {
    return (
      <div style={{ width: '100%', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', padding: '12px 12px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--color-text-muted)', textAlign: 'center' }}>Vương miện đổi theo map</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {Object.keys(MAP_CROWNS).map((wKey) => {
            const w = +wKey, gem = MAP_CROWNS[w];
            return (
              <div key={w} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <svg viewBox="0 0 100 70" width="36" height="25" style={{ display: 'block', filter: 'drop-shadow(0 2px 1px rgba(74,53,38,.28))' }}>
                  <path d="M11 60 L11 16 L34 38 L50 6 L66 38 L89 16 L89 60 Z" fill="#FFCA66" stroke="#E8B85C" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                  <rect x="7" y="52" width="86" height="15" rx="6" fill="#FFD27A" stroke="#E8B85C" strokeWidth="4" />
                  <circle cx="11" cy="16" r="5.5" fill={gem} stroke="#E8B85C" strokeWidth="2" />
                  <circle cx="50" cy="6" r="6.5" fill={gem} stroke="#E8B85C" strokeWidth="2" />
                  <circle cx="89" cy="16" r="5.5" fill={gem} stroke="#E8B85C" strokeWidth="2" />
                  <circle cx="50" cy="59" r="4.6" fill={gem} />
                </svg>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: 'var(--color-text)', lineHeight: 1 }}>{w}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 8.5, color: 'var(--color-text-muted)', lineHeight: 1, textAlign: 'center' }}>{WORLD_NAMES[w]}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* G1 buff choice */
  W.buffChoice = (card) => (
    <div style={{ display: 'flex', gap: 12 }}>
      {card.buffs.map((b, i) => (
        <div key={i} style={{ width: 96, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', borderBottom: '4px solid var(--color-gravity-edge)', padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-gravity) 16%, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gravity)' }}>{b.icon === 'rotate' ? <Icon name="rotate" size={26} strokeWidth={2.4} /> : b.icon === 'star' ? <Icon name="star" size={26} strokeWidth={2.4} /> : <X.Bomb size={26} color="var(--color-gravity)" />}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--color-text)', lineHeight: 1.1 }}>{b.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.25 }}>{b.desc}</div>
        </div>
      ))}
    </div>
  );

  /* G2 power-up bar */
  W.powerupBar = (card) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 320 }}>
      {card.items.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface)', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-sm)', padding: '8px 12px' }}>
          <div style={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-primary) 16%, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            {p.icon === 'hammer' ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4l6 6-3 3-6-6zM11 7l-7 7v3h3l7-7" /></svg> : p.icon === 'row' ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="9" width="18" height="6" rx="2" /></svg> : p.icon === 'swap' ? <Icon name="refresh" size={22} strokeWidth={2.4} /> : <Icon name="rotate" size={22} strokeWidth={2.4} />}
            <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, padding: '0 4px', borderRadius: 999, background: 'var(--color-gravity)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.count}</span>
          </div>
          <div style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>{p.name}</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, color: 'var(--color-primary)', background: 'color-mix(in srgb, var(--color-primary) 14%, #fff)', padding: '4px 9px', borderRadius: 999 }}>{X.AdBadge ? <X.AdBadge /> : 'QC'} +1</span>
        </div>
      ))}
    </div>
  );

  /* G3 daily challenge */
  W.dailyCard = (card, h) => {
    const { MiniBoard } = h;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: 310 }}>
        <div style={{ width: '100%', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)' }}>{X.Calendar && <X.Calendar size={18} color="var(--color-text-muted)" />}<span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '.04em', textTransform: 'uppercase' }}>{card.date}</span></div>
          <MiniBoard rows={card.board} cell={28} gap={3} pad={6} />
          <button style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#fff', background: 'var(--color-primary)', borderBottom: '4px solid var(--color-primary-edge)', border: 'none', borderRadius: 'var(--radius-xl)', padding: '12px 40px', boxShadow: 'var(--shadow-sm)' }}>Chơi</button>
        </div>
        <div style={{ width: '100%', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {card.ranks.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: 'var(--color-text)' }}>
              <span style={{ width: 18, color: 'var(--color-text-muted)' }}>{i + 1}</span>
              <span style={{ flex: 1 }}>{r.name}</span>
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}>{r.score}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* G4 streak */
  W.streakWidget = (card) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {card.days.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: d.done ? 'var(--color-block-yellow)' : 'var(--color-surface-sunken)', border: d.today ? '3px solid var(--color-primary)' : '3px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: d.today ? 'gjPulse 1.4s ease infinite' : 'none' }}>
              {d.done ? (X.FilledStar ? <X.FilledStar size={20} earned /> : '★') : <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--color-text-muted)' }}>{i + 1}</span>}
            </div>
          </div>
        ))}
      </div>
      <button style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: '#fff', background: 'var(--color-primary)', borderBottom: '4px solid var(--color-primary-edge)', border: 'none', borderRadius: 'var(--radius-xl)', padding: '12px 30px' }}>Điểm danh +thưởng</button>
    </div>
  );

  /* A9 fab lock: rotate FAB available → locked + countdown */
  W.fabLock = (card) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <StateLabel>TRƯỚC</StateLabel>
      <GravityRotateButton turnsLeft={3} />
      <DownArrow />
      <StateLabel>SAU</StateLabel>
      <div style={{ position: 'relative' }}>
        <GravityRotateButton turnsLeft={3} disabled />
        <div style={{ position: 'absolute', top: -8, right: -8, display: 'flex', alignItems: 'center', gap: 3, background: 'var(--color-info)', color: '#fff', borderRadius: 999, padding: '3px 8px', boxShadow: 'var(--shadow-sm)' }}>
          {X.Lock && <X.Lock size={16} color="#fff" />}
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13 }}>3</span>
        </div>
      </div>
    </div>
  );

  window.GJMechW = W;
})();
