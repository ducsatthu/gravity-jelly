import React from 'react';
import { Icon } from '../../02-foundations/03-icon/Icon.jsx';

/**
 * ObjectiveBar — the always-on "what do I need to do" cluster that sits right
 * under the 56dp HUD and above the 9×9 board. One component, one `goal`
 * descriptor, covering every goal_type in the catalogue:
 *   • tutorial   — single action, "0/1" chip (or "×N" for combo)
 *   • targets    — CLEAR_TARGETS counter: target glyphs that dim as destroyed
 *                  (buried variant adds a layer-lock)
 * Every level is rated the SAME way — by moves (số nước): a `level`/`world`
 * badge anchors the left, a move-based 3-star strip sits in the footer. The
 * old score / mixed goal kinds (điểm) were removed for consistency.
 * States: active · near (gentle pulse) · done (success + tick, glow).
 * Optional gravity `rotations` chip on the right when it isn't on the FAB.
 *
 * Sizes in dp: single-row bar 52 · padding 16 · radius 20
 * · shadow sm · target/tutorial glyph 26–30 · level badge min 44.
 */

/* ---- one-time keyframes (pop / pulse), reduced-motion aware ---- */
if (typeof document !== 'undefined' && !document.getElementById('gj-objective-kf')) {
  const s = document.createElement('style');
  s.id = 'gj-objective-kf';
  s.textContent = `
    @keyframes gj-obj-pop { 0% { transform: scale(0.5) } 60% { transform: scale(1.16) } 100% { transform: scale(1) } }
    @keyframes gj-obj-nudge { 0%,100% { transform: scale(1) } 50% { transform: scale(1.06) } }
    @media (prefers-reduced-motion: reduce) { [data-gj-anim] { animation: none !important } }
  `;
  document.head.appendChild(s);
}

const CAPTION = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-bold)',
  letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)', lineHeight: 1, whiteSpace: 'nowrap',
};
const NUM = { fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-bold)', lineHeight: 1 };

const JPAL = {
  yellow: ['#FFE3A3', '#E8B85C'], mint: ['#A3E5D9', '#5FC3B2'],
  pink: ['#F7A9C0', '#E576A0'], blue: ['#B3C7F7', '#7E9CE8'],
};

/* ── glyphs ─────────────────────────────────────────────────────────── */

// 3×3 mini grid with one row / column lit — CLEAR_ROW / CLEAR_COL.
function GridGlyph({ axis = 'row', size = 26 }) {
  const cells = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const hot = axis === 'row' ? r === 1 : c === 1;
    cells.push(
      <rect key={`${r}-${c}`} x={c * 8.5 + 1.5} y={r * 8.5 + 1.5} width="6.5" height="6.5" rx="2"
        fill={hot ? 'var(--color-primary)' : 'var(--color-surface-sunken)'}
        stroke={hot ? 'var(--color-primary-edge)' : '#E7D8BF'} strokeWidth="1" />
    );
  }
  return <svg width={size} height={size} viewBox="0 0 27 27" aria-hidden="true">{cells}</svg>;
}

const CrownMini = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3.5 18l-1-9 5 3.5L12 5l4.5 7.5 5-3.5-1 9z" fill="#FFCA66" stroke="#E2A82E" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M3.5 18h17" stroke="#E2A82E" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// super / rainbow / crown power-cell glyph — MAKE_SUPER1/2, RAINBOW, RAINBOW_SUPER.
function SpecialGlyph({ type = 'super', color = 'pink', size = 30, lvl = 1 }) {
  const r = Math.round(size * 0.28);
  const rainbow = type === 'rainbow' || type === 'crown';
  const pal = JPAL[color] || JPAL.pink;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <span style={{
        width: size, height: size, borderRadius: r, boxSizing: 'border-box', position: 'relative',
        background: rainbow ? 'conic-gradient(from 210deg,#F7A9C0,#FFE3A3,#A3E5D9,#B3C7F7,#F7A9C0)' : pal[0],
        border: `3px solid ${rainbow ? '#E576A0' : pal[1]}`,
        boxShadow: '0 0 0 2px var(--color-warning), var(--shadow-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ position: 'absolute', top: 2, left: '14%', right: '14%', height: '32%', background: 'rgba(255,255,255,0.7)', borderRadius: '50%' }} />
        {!rainbow && (
          <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" style={{ position: 'relative' }}>
            <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" fill="#FFF6DD" stroke="#E2A82E" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        )}
        {rainbow && <span style={{ width: size * 0.32, height: size * 0.32, borderRadius: '50%', background: 'rgba(255,255,255,0.94)', boxShadow: '0 0 6px rgba(255,255,255,0.9)' }} />}
      </span>
      {lvl === 2 && (
        <span style={{ position: 'absolute', bottom: -5, right: -5, minWidth: 17, height: 17, padding: '0 3px', boxSizing: 'border-box', borderRadius: 999, background: 'var(--color-surface)', border: '2px solid var(--color-warning)', color: '#B9821C', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>2</span>
      )}
      {type === 'crown' && (
        <span style={{ position: 'absolute', top: -size * 0.44, left: '50%', transform: 'translateX(-50%)' }}><CrownMini size={size * 0.62} /></span>
      )}
    </span>
  );
}

// vine root (World 2) — sprout on a mound.
function VineGlyph({ size = 24, dim = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      style={{ opacity: dim ? 0.3 : 1, transition: 'opacity var(--motion-base) var(--ease-out)' }}>
      <ellipse cx="12" cy="20.2" rx="7" ry="2.3" fill="#C7A97E" />
      <path d="M12 20 C12 15.5 12 13 12 10.5" stroke="#5FC3B2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M12 13.5 C9 13.5 7 11.5 6.4 8.8 C9.6 8.8 11.6 10.4 12 13.5Z" fill="#A3E5D9" stroke="#5FC3B2" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M12 11.5 C15 11.5 17 9.5 17.6 6.8 C14.4 6.8 12.4 8.4 12 11.5Z" fill="#A3E5D9" stroke="#5FC3B2" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

// water drop (World 3) — teal droplet, optional layer-lock for buried targets.
function DropGlyph({ size = 24, dim = false, locked = false }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', opacity: dim ? 0.4 : 1, transition: 'opacity var(--motion-base) var(--ease-out)' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z" fill="#A3E5D9" stroke="#5FC3B2" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9.4 15.4a2.6 2.6 0 0 0 2 2.4" stroke="#CBF2EB" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
      {locked && (
        <span style={{ position: 'absolute', bottom: -3, right: -4, width: 15, height: 15, borderRadius: '50%', background: 'var(--color-stone)', border: '1.5px solid var(--color-stone-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#6B5B45" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10.5" width="14" height="9" rx="2.4" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></svg>
        </span>
      )}
    </span>
  );
}

/* ── progress atoms ─────────────────────────────────────────────────── */

function ProgressChip({ text, done, near }) {
  return (
    <span data-gj-anim style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, height: 28, padding: '0 12px',
      borderRadius: 'var(--radius-full)', flexShrink: 0, boxSizing: 'border-box',
      background: done ? 'var(--color-success)' : 'var(--color-surface-sunken)',
      color: done ? 'var(--color-text-invert)' : 'var(--color-text)',
      boxShadow: done ? '0 3px 0 color-mix(in srgb, var(--color-success) 72%, #000 18%)' : 'inset 0 1px 3px rgba(120,92,52,0.14)',
      ...NUM, fontSize: 'var(--text-score)',
      animation: done ? 'gj-obj-pop 420ms var(--ease-jelly) both' : near ? 'gj-obj-nudge 900ms var(--ease-inout) infinite' : 'none',
    }}>
      {done && <Icon name="check" size={16} color="currentColor" strokeWidth={3} />}
      {text}
    </span>
  );
}

// dimming counter of target glyphs + "còn N" pill.
function TargetCounter({ kind, total, remaining, buried = 0 }) {
  const done = remaining <= 0;
  const gone = total - remaining;
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
        {Array.from({ length: total }).map((_, i) => {
          const destroyed = i < gone;
          const isBuried = !destroyed && (i - gone) < buried;
          return kind === 'vine'
            ? <VineGlyph key={i} size={24} dim={destroyed} />
            : <DropGlyph key={i} size={24} dim={destroyed} locked={isBuried} />;
        })}
      </div>
      <span data-gj-anim style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, height: 26, padding: '0 11px', flexShrink: 0,
        borderRadius: 'var(--radius-full)', boxSizing: 'border-box',
        background: done ? 'var(--color-success)' : 'var(--color-surface-sunken)',
        color: done ? 'var(--color-text-invert)' : 'var(--color-text)',
        boxShadow: done ? '0 3px 0 color-mix(in srgb, var(--color-success) 72%, #000 18%)' : 'none',
        ...NUM, fontSize: 'var(--text-label)',
        animation: done ? 'gj-obj-pop 420ms var(--ease-jelly) both' : 'none',
      }}>
        {done ? <Icon name="check" size={15} color="currentColor" strokeWidth={3} /> : <span style={{ ...CAPTION, color: 'inherit', fontWeight: 800 }}>còn</span>}
        {done ? 'Xong' : remaining}
      </span>
    </div>
  );
}

/* ── star-tier atoms (compact secondary readout — never louder than the goal) ── */

// bare mini star — gold when earned, faint cream when not.
function MiniStar({ filled, size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"
        fill={filled ? 'var(--color-warning)' : '#EFE2C7'}
        stroke={filled ? '#E2A82E' : '#DECBAA'} strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

// 3-milestone strip for move-limited levels — thin rail, fills up to the current tier.
function StarStrip({ tier = 0, size = 14 }) {
  const fillW = tier >= 3 ? `calc(100% - ${size}px)` : tier === 2 ? '50%' : '0%';
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 74, height: size + 4, flexShrink: 0 }}>
      <div style={{ position: 'absolute', left: size / 2, right: size / 2, top: '50%', height: 3, transform: 'translateY(-50%)', borderRadius: 999, background: 'var(--color-surface-sunken)' }} />
      <div style={{ position: 'absolute', left: size / 2, top: '50%', height: 3, transform: 'translateY(-50%)', borderRadius: 999, width: fillW, background: 'var(--color-warning)', transition: 'width var(--motion-medium) var(--ease-out)' }} />
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ position: 'relative', zIndex: 1, display: 'flex' }}><MiniStar filled={tier >= i + 1} size={size} /></span>
      ))}
    </div>
  );
}

// one-line caption: bold gold current tier · muted "what's next".
function StarCaption({ now, next, passed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0, lineHeight: 1 }}>
      {passed && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, height: 15, padding: '0 5px', borderRadius: 'var(--radius-full)', background: 'color-mix(in srgb, var(--color-success) 20%, var(--color-surface))', color: 'var(--color-success)', flexShrink: 0 }}>
          <Icon name="check" size={11} color="currentColor" strokeWidth={3.2} />
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.02em' }}>QUA MÀN</span>
        </span>
      )}
      <span style={{ ...NUM, fontSize: 12, color: '#C88F26', whiteSpace: 'nowrap' }}>{now}</span>
      {next && <span style={{ color: '#E0CDAC', fontSize: 12 }}>·</span>}
      {next && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{next}</span>}
    </div>
  );
}

// move-based star strip footer (tutorial + move-limited target levels).
function StripFooter({ stars }) {
  if (!stars) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, marginLeft: 2 }}>
      <StarStrip tier={stars.tier || 0} />
      <StarCaption now={stars.now} next={stars.next} />
    </div>
  );
}

// resolve the move-based star tier + caption for a level (explicit wins; else derive from moves).
// stars are earned by moves LEFT: more spare moves ⇒ higher tier.
function movesStars(goal) {
  const s = goal.stars;
  if (s && (s.now || s.tier != null || s.next != null)) {
    const tier = s.tier != null ? s.tier : 0;
    return {
      tier,
      now: s.now || `Đang ${tier}★`,
      next: s.next != null ? s.next : (goal.moves != null ? `còn ${goal.moves} nước` : null),
    };
  }
  const moves = goal.moves;
  const th = goal.starMoves;
  if (moves != null && Array.isArray(th)) {
    const tier = th.filter((t) => moves >= t).length;
    return { tier, now: `Đang ${tier}★`, next: `còn ${moves} nước` };
  }
  return { tier: 3, now: 'Đang 3★', next: moves != null ? `còn ${moves} nước` : null };
}

/* ── tutorial glyph picker ──────────────────────────────────────────── */

// canonical special-block art from the design system's SVG assets.
function BlockGlyph({ src, size = 32, radius = 0 }) {
  return (
    <span style={{ width: size, height: size, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={src} width={size} height={size} alt="" style={{ display: 'block', borderRadius: radius || undefined, filter: 'drop-shadow(0 1px 2px rgba(120,92,52,0.2))' }} />
    </span>
  );
}

function TutorialGlyph({ variant, blockBase }) {
  switch (variant) {
    case 'clearRow': return <GridGlyph axis="row" size={28} />;
    case 'clearCol': return <GridGlyph axis="col" size={28} />;
    case 'rotate': return (
      <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'color-mix(in srgb, var(--color-gravity) 16%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="rotateCw" size={19} color="var(--color-gravity)" strokeWidth={2.4} />
      </span>
    );
    case 'super1': return <BlockGlyph src={`${blockBase.replace('blocks/', 'ui/')}hoanggia-pink.jpg`} size={32} radius={6} />;
    case 'super2': return <BlockGlyph src={`${blockBase}super-blue-2.svg`} size={32} />;
    case 'rainbow': return <BlockGlyph src={`${blockBase}rainbow.svg`} size={32} />;
    case 'rainbowSuper': return <BlockGlyph src={`${blockBase}rainbow-2.svg`} size={32} />;
    case 'combo': return (
      <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'color-mix(in srgb, var(--color-warning) 26%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="x2" size={19} color="#B9821C" strokeWidth={2.4} />
      </span>
    );
    default: return null;
  }
}

/* ── current-level identity badge (số màn toàn cục + world) ── */
// anchors the left of every bar so the player always sees which màn they're on.
function LevelBadge({ level, world }) {
  if (level == null) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 'var(--space-md)', flexShrink: 0 }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minWidth: 44, padding: '3px 9px', borderRadius: 12, lineHeight: 1, gap: 1, boxSizing: 'border-box',
        background: 'var(--color-surface-sunken)', boxShadow: 'inset 0 1px 3px rgba(120,92,52,0.14)',
      }}>
        <span style={{ ...CAPTION, fontSize: 9 }}>MÀN</span>
        <span style={{ ...NUM, fontSize: 22, color: 'var(--color-text)' }}>{level}</span>
        {world && <span style={{ ...CAPTION, fontSize: 8.5, maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis' }}>{world}</span>}
      </div>
      <div style={{ width: 1.5, alignSelf: 'stretch', margin: '3px 0', borderRadius: 2, background: 'var(--color-cell-line)' }} />
    </div>
  );
}

/* ── the bar shell ──────────────────────────────────────────────────── */
function Shell({ children, tall, footer, style }) {
  return (
    <div style={{
      width: '100%', minHeight: footer ? undefined : (tall ? 72 : 52), boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: tall ? '9px var(--space-lg)' : (footer ? '7px var(--space-lg) 8px' : '0 var(--space-lg)'),
      background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-body)', ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', minHeight: tall ? 54 : 40 }}>{children}</div>
      {footer}
    </div>
  );
}

function derive(status, done, ratio) {
  if (status) return status;
  if (done) return 'done';
  if (ratio >= 0.7) return 'near';
  return 'active';
}

export function ObjectiveBar({ goal, level = null, world = null, style = {}, blockBase = '../../06-svg-assets/blocks/' }) {
  if (!goal) return null;
  const kind = goal.kind;
  const lead = <LevelBadge level={level} world={world} />;

  // ---- TARGETS : dimming counter (ALWAYS shows the move-based star strip) ----
  if (kind === 'targets') {
    return (
      <Shell style={style} footer={<StripFooter stars={movesStars(goal)} />}>
        {lead}
        <span style={{ ...CAPTION }}>MỤC TIÊU</span>
        <TargetCounter kind={goal.target} total={goal.total} remaining={goal.remaining} buried={goal.buried || 0} />
      </Shell>
    );
  }

  // ---- TUTORIAL : glyph + label + chip (move-based ⇒ 3-star strip footer) ----
  const isCombo = goal.variant === 'combo';
  const cur = goal.current || 0;
  const tgt = goal.target || 1;
  const done = cur >= tgt;
  const st = derive(goal.status, done, cur / tgt);
  // single-action tutorials drop the redundant 0/1 counter — the label + done
  // tick already say it all; only combo keeps a live ×N, and any variant shows
  // the "Xong" tick once complete.
  const showChip = isCombo || done;
  return (
    <Shell style={style} footer={<StripFooter stars={goal.stars || null} />}>
      {lead}
      <TutorialGlyph variant={goal.variant} blockBase={blockBase} />
      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-body)', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{goal.label}</span>
      {showChip && <ProgressChip text={done ? (isCombo ? `×${tgt}` : 'Xong') : `×${cur}`} done={st === 'done'} near={st === 'near'} />}
    </Shell>
  );
}
