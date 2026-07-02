import React from 'react';
import { Icon } from '../../02-foundations/03-icon/Icon.jsx';

/**
 * ObjectiveBar — the always-on "what do I need to do" cluster that sits right
 * under the 56dp HUD and above the 9×9 board. One component, one `goal`
 * descriptor, covering every goal_type in the catalogue:
 *   • tutorial   — single action, "0/1" chip (or "×N" for combo)
 *   • score      — REACH_SCORE progress bar (current / N), primary fill
 *   • targets    — CLEAR_TARGETS counter: target glyphs that dim as destroyed
 *                  (buried variant adds a layer-lock)
 *   • mixed      — MIXED: two stacked progress rows (targets + score)
 * States: active · near (gentle pulse) · done (success + tick, glow).
 * Optional gravity `rotations` chip on the right when it isn't on the FAB.
 *
 * Sizes in dp: single-row bar 52 · two-row (mixed) 72 · padding 16 · radius 20
 * · shadow sm · progress track 12 · target/tutorial glyph 26–30.
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

function ScoreBar({ score, target, done, near, compact }) {
  const pct = Math.max(0, Math.min(1, score / target));
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: compact ? 4 : 5, gap: 10 }}>
        <span style={CAPTION}>ĐIỂM</span>
        <span style={{ ...NUM, fontSize: 'var(--text-score)', color: done ? 'var(--color-success)' : 'var(--color-primary)', whiteSpace: 'nowrap' }}>
          {score.toLocaleString('vi-VN')}
          <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-caption)' }}> / {target.toLocaleString('vi-VN')}</span>
        </span>
      </div>
      <div style={{
        height: 12, borderRadius: 'var(--radius-full)', background: 'var(--color-surface-sunken)',
        overflow: 'hidden', position: 'relative',
        boxShadow: done ? '0 0 0 2px color-mix(in srgb, var(--color-success) 55%, transparent), 0 0 12px color-mix(in srgb, var(--color-success) 60%, transparent)' : 'inset 0 1px 3px rgba(120,92,52,0.16)',
      }}>
        <div data-gj-anim style={{
          width: `${pct * 100}%`, height: '100%', borderRadius: 'var(--radius-full)',
          background: done ? 'linear-gradient(180deg,#8FE0A0,var(--color-success))' : 'linear-gradient(180deg,var(--color-primary-shine),var(--color-primary))',
          boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.5)',
          transition: 'width var(--motion-medium) var(--ease-out)',
          animation: near ? 'gj-obj-nudge 900ms var(--ease-inout) infinite' : 'none',
        }} />
      </div>
    </div>
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

/* gravity turns-left chip (when not shown on the FAB) */
function RotationsChip({ n }) {
  const low = n <= 3;
  return (
    <span title="Lượt xoay còn lại" style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, height: 30, padding: '0 10px', flexShrink: 0,
      borderRadius: 'var(--radius-full)', boxSizing: 'border-box',
      background: 'var(--color-gravity)', color: 'var(--color-text-invert)',
      boxShadow: `0 3px 0 var(--color-gravity-edge)`,
    }}>
      <Icon name="rotateCw" size={17} color="currentColor" strokeWidth={2.6} />
      <span style={{ ...NUM, fontSize: 'var(--text-score)', color: low ? '#FFE4A0' : 'inherit' }}>{n}</span>
    </span>
  );
}

/* ── tutorial glyph picker ──────────────────────────────────────────── */
function TutorialGlyph({ variant }) {
  switch (variant) {
    case 'clearRow': return <GridGlyph axis="row" size={28} />;
    case 'clearCol': return <GridGlyph axis="col" size={28} />;
    case 'rotate': return (
      <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'color-mix(in srgb, var(--color-gravity) 16%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="rotateCw" size={19} color="var(--color-gravity)" strokeWidth={2.4} />
      </span>
    );
    case 'super1': return <SpecialGlyph type="super" color="pink" size={30} />;
    case 'super2': return <SpecialGlyph type="super" color="blue" size={30} lvl={2} />;
    case 'rainbow': return <SpecialGlyph type="rainbow" size={30} />;
    case 'rainbowSuper': return <SpecialGlyph type="crown" size={30} />;
    case 'combo': return (
      <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'color-mix(in srgb, var(--color-warning) 26%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="x2" size={19} color="#B9821C" strokeWidth={2.4} />
      </span>
    );
    default: return null;
  }
}

/* ── the bar shell ──────────────────────────────────────────────────── */
function Shell({ children, tall, style }) {
  return (
    <div style={{
      width: '100%', minHeight: tall ? 72 : 52, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
      padding: tall ? '9px var(--space-lg)' : '0 var(--space-lg)',
      background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-body)', ...style,
    }}>{children}</div>
  );
}

function derive(status, done, ratio) {
  if (status) return status;
  if (done) return 'done';
  if (ratio >= 0.7) return 'near';
  return 'active';
}

export function ObjectiveBar({ goal, rotations = null, style = {} }) {
  if (!goal) return null;
  const kind = goal.kind;

  // ---- MIXED : two stacked rows ----
  if (kind === 'mixed') {
    const t = goal.targets, sc = goal.score;
    return (
      <Shell tall style={style}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <TargetCounter kind={t.target} total={t.total} remaining={t.remaining} buried={t.buried || 0} />
          </div>
          <div style={{ height: 1, background: 'var(--color-cell-line)', margin: '0 -2px' }} />
          <ScoreBar score={sc.score} target={sc.target} done={sc.score >= sc.target} compact
            near={sc.score < sc.target && sc.score / sc.target >= 0.7} />
        </div>
        {rotations != null && <RotationsChip n={rotations} />}
      </Shell>
    );
  }

  // ---- SCORE : single progress bar ----
  if (kind === 'score') {
    const done = goal.score >= goal.target;
    const st = derive(goal.status, done, goal.score / goal.target);
    return (
      <Shell style={style}>
        <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'color-mix(in srgb, var(--color-primary) 18%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="star" size={19} color="var(--color-primary)" strokeWidth={2.2} />
        </span>
        <ScoreBar score={goal.score} target={goal.target} done={st === 'done'} near={st === 'near'} />
        {rotations != null && <RotationsChip n={rotations} />}
      </Shell>
    );
  }

  // ---- TARGETS : dimming counter ----
  if (kind === 'targets') {
    return (
      <Shell style={style}>
        <span style={{ ...CAPTION }}>MỤC TIÊU</span>
        <TargetCounter kind={goal.target} total={goal.total} remaining={goal.remaining} buried={goal.buried || 0} />
        {rotations != null && <RotationsChip n={rotations} />}
      </Shell>
    );
  }

  // ---- TUTORIAL : glyph + label + chip ----
  const isCombo = goal.variant === 'combo';
  const cur = goal.current || 0;
  const tgt = goal.target || 1;
  const done = isCombo ? cur >= tgt : cur >= tgt;
  const st = derive(goal.status, done, cur / tgt);
  const chipText = isCombo ? `×${cur}` : `${cur}/${tgt}`;
  return (
    <Shell style={style}>
      <TutorialGlyph variant={goal.variant} />
      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-body)', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{goal.label}</span>
      <ProgressChip text={done ? (isCombo ? `×${tgt}` : 'Xong') : chipText} done={st === 'done'} near={st === 'near'} />
      {rotations != null && <RotationsChip n={rotations} />}
    </Shell>
  );
}
