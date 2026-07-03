import React from 'react';
import { Icon } from '../../02-foundations/03-icon/Icon.jsx';
import { Button } from '../01-button/Button.jsx';

/**
 * Boss UI cluster — Gravity Jelly, soft casual puzzle (NOT a combat/RPG HUD).
 *
 * Each boss has its OWN supplied artwork (transparent PNG in
 * /06-svg-assets/bosses/) — never a shared circular avatar, never boxed in a
 * ring. Mascots are EYES-ONLY (no mouth, brows or teeth).
 *   • worm  — Chú Sâu Đồng Cỏ: mint caterpillar + leaf sprouts (boss-worm.png).
 *   • trash — Kẻ Đổ Rác: lumpy brown jelly bag + scraps/cubes (boss-trash.png).
 *   • water — Thần Thác: water-god column + ring + bubbles (boss-water.png).
 * BossMascot renders the PNG; a faint purple/cyan aura sits behind worm/water.
 *
 * Pieces:
 *   • BossCard      — compact in-game / pre-boss card (mascot overflows the
 *                     left, text right: name · MÀN badge · thin shield bar ·
 *                     rule/tell chip). Radius 28, soft cocoa shadow.
 *   • BossIntroCard — the large pre-level card (adds a BOSS tag + orange CTA).
 *   • BossToast     — the small warning pill.
 *   • BossMascot / ShieldBar — building blocks, exported for reuse.
 *
 * Purple (#7E6CF0) is used ONLY as tag / glow / hairline — never a full panel.
 * Progress is a "Khiên" (shield) bar, never HP hearts; copy says "phá khiên",
 * never "gây sát thương".
 */

const GRAVITY = 'var(--color-gravity)';

/* one-time keyframes — all gentle, disabled under reduced-motion */
if (typeof document !== 'undefined' && !document.getElementById('gj-bosshud-kf')) {
  const s = document.createElement('style');
  s.id = 'gj-bosshud-kf';
  s.textContent = `
    @keyframes gj-boss-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
    @keyframes gj-boss-glow { 0%,100%{opacity:.35} 50%{opacity:.8} }
    @media (prefers-reduced-motion: reduce){ [data-gj-boss]{animation:none!important} }
  `;
  document.head.appendChild(s);
}

const DISP = { fontFamily: 'var(--font-display)', lineHeight: 'var(--leading-tight)' };
const CAP = { fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-extra)', letterSpacing: 'var(--tracking-wide)', lineHeight: 1 };

const THEMES = {
  worm:  { color: 'var(--color-block-mint)', edge: 'var(--color-block-mint-edge)', shine: 'var(--color-block-mint-shine)' },
  trash: { color: '#D9BE94', edge: '#B79A6E', shine: '#EFDFC0' },
  water: { color: 'var(--color-block-blue)', edge: 'var(--color-block-blue-edge)', shine: 'var(--color-block-blue-shine)' },
};

/* ---------- inline mechanic glyphs ---------- */
function Glyph({ name, size = 15, color = 'currentColor', sw = 2.2 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { display: 'block' } };
  if (name === 'shield') return <svg {...common}><path d="M12 3l7 2.6v5.1c0 4.9-3.1 8.1-7 9.8-3.9-1.7-7-4.9-7-9.8V5.6L12 3z" /></svg>;
  if (name === 'leaf') return <svg {...common}><path d="M5 19c0-8 6-13 14-14 1 8-5 14-14 14z" /><path d="M6 18c3-5 6-7 9-8" /></svg>;
  return null;
}

/* =====================================================================
   BOSS MASCOTS — each boss rendered from its supplied PNG art (eyes-only)
   ===================================================================== */
const MASCOT_ASSET = {
  worm:  { file: 'boss-worm.png',  aspect: 448 / 560 },
  water: { file: 'boss-water.png', aspect: 467 / 560 },
  trash: { file: 'boss-trash.png', aspect: 560 / 513 },
};
const MASCOT_H = { worm: 122, water: 130, trash: 106 };
const DEFAULT_ASSET_BASE = '../../06-svg-assets/bosses/';

/**
 * BossMascot — the boss silhouette, drawn from the supplied artwork.
 * `size` is the display HEIGHT in px (defaults per kind); width follows the
 * art's aspect. `assetBase` is the path to /06-svg-assets/bosses/ relative to
 * the page (default assumes a component card two levels deep) — or pass a full
 * `src`. A faint purple/cyan aura sits behind worm & water.
 */
export function BossMascot({ kind = 'worm', size, src, assetBase = DEFAULT_ASSET_BASE, style = {} }) {
  const a = MASCOT_ASSET[kind] || MASCOT_ASSET.worm;
  const h = size || MASCOT_H[kind] || 122;
  const w = Math.round(h * a.aspect);
  const url = src || (assetBase + a.file);
  const aura = kind === 'water'
    ? 'radial-gradient(closest-side, rgba(126,108,240,0.18), rgba(143,182,242,0.12) 60%, transparent)'
    : kind === 'worm'
      ? 'radial-gradient(closest-side, rgba(126,108,240,0.15), transparent)'
      : null;
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: w, height: h, ...style }}>
      {aura && <span aria-hidden="true" style={{ position: 'absolute', inset: '-8%', borderRadius: '50%', background: aura }} />}
      <img data-gj-boss src={url} alt="" draggable="false" style={{ position: 'relative', width: w, height: h, objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 5px 7px rgba(120,92,52,0.20))', animation: 'gj-boss-bob 2800ms ease-in-out infinite' }} />
    </span>
  );
}

/* ---------- thin shield-progress bar ---------- */
export function ShieldBar({ current = 4, target = 5, color = 'var(--color-block-mint)', edge = 'var(--color-block-mint-edge)', height = 8 }) {
  const pct = Math.max(0, Math.min(1, target ? current / target : 0));
  return (
    <div style={{ position: 'relative', height, borderRadius: 'var(--radius-full)', background: 'var(--color-surface-sunken)', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(120,92,52,0.18)' }}>
      <div style={{ position: 'absolute', inset: 0, right: `${(1 - pct) * 100}%`, borderRadius: 'var(--radius-full)', background: `linear-gradient(180deg, color-mix(in srgb, ${color} 72%, #fff), ${edge})`, boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.55)', transition: 'right 360ms var(--ease-out)' }} />
    </div>
  );
}

function ShieldCount({ current, target }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>Khiên</span>
      <span style={{ ...DISP, fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>{current}<span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>/{target}</span></span>
    </span>
  );
}

/* ---------- rule / tell chip ---------- */
function chipTone(tone) {
  if (tone === 'trash') return { bg: 'rgba(255,202,102,0.20)', fg: '#9A7326', disc: 'var(--color-warning)', discFg: '#5B4636' };
  if (tone === 'gravity') return { bg: 'rgba(126,108,240,0.12)', fg: 'var(--color-gravity-edge)', disc: 'var(--color-gravity)', discFg: '#fff' };
  return { bg: 'rgba(126,108,240,0.12)', fg: 'var(--color-gravity-edge)', disc: 'var(--color-gravity)', discFg: '#fff' };
}

function chipGlyph(kind, color) {
  if (kind === 'gravity') return <Icon name="rotateCw" size={12} color={color} strokeWidth={2.6} />;
  if (kind === 'trash') return <Glyph name="leaf" size={12} color={color} sw={2.4} />;
  if (kind === 'x2') return <Icon name="x2" size={12} color={color} strokeWidth={2.6} />;
  return <Glyph name="shield" size={12} color={color} sw={2.4} />;
}

function Chip({ kind = 'x2', tone = 'rule', role = 'tell', label, size = 'md' }) {
  const disc = size === 'lg' ? 22 : 20;
  if (role === 'rule') {
    // calm handbook look — matches BossRule, never reads as a boss action.
    // No word label: the muted purple disc + sunken pill signal "cách phá".
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px 4px 4px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-sunken)', boxShadow: 'inset 0 1px 2px rgba(120,92,52,0.10)' }}>
        <span style={{ width: disc, height: disc, borderRadius: '50%', background: 'rgba(126,108,240,0.14)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{chipGlyph(kind, 'var(--color-gravity-edge)')}</span>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-caption)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{label}</span>
      </span>
    );
  }
  // tell look — coloured alert. A small pulsing dot on the disc reads as
  // "boss sắp ra chiêu" without any word label.
  const c = chipTone(tone);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px 4px 4px', borderRadius: 'var(--radius-full)', background: c.bg }}>
      <span style={{ position: 'relative', width: disc, height: disc, borderRadius: '50%', background: c.disc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {chipGlyph(kind, c.discFg)}
        <span data-gj-boss style={{ position: 'absolute', top: -1, right: -1, width: 7, height: 7, borderRadius: '50%', background: 'var(--color-danger)', border: '1.5px solid var(--color-surface)', animation: 'gj-boss-glow 1400ms ease-in-out infinite' }} />
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-caption)', color: c.fg, whiteSpace: 'nowrap' }}>{label}</span>
    </span>
  );
}

function LevelBadge({ level }) {
  return (
    <span style={{ ...CAP, fontSize: 10, color: 'var(--color-text-muted)', background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-full)', padding: '3px 9px', whiteSpace: 'nowrap' }}>MÀN {level}</span>
  );
}

function BossTag() {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 'var(--radius-full)', background: GRAVITY, color: '#fff', boxShadow: '0 0 0 3px rgba(126,108,240,0.14), inset 0 1px 0 rgba(255,255,255,0.3)' }}>
      <span data-gj-boss style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'gj-boss-glow 1600ms ease-in-out infinite' }} />
      <span style={{ ...CAP, fontSize: 11 }}>BOSS</span>
    </span>
  );
}

/* =====================================================================
   1) BossCard — compact in-game / pre-boss card
   ===================================================================== */
export function BossCard({
  level = 10,
  name = 'Chú Sâu Đồng Cỏ',
  kind = 'worm',
  color, edge, shine,
  assetBase,
  shield = { current: 4, target: 5 },
  chip = { kind: 'x2', tone: 'rule', role: 'rule', label: 'Combo ×2 phá khiên' },
  style = {},
}) {
  return (
    <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box', paddingLeft: 120, paddingRight: 16, paddingTop: 14, paddingBottom: 14, minHeight: 118, borderRadius: 'var(--radius-xl)', background: 'var(--color-surface)', border: '1.5px solid rgba(126,108,240,0.22)', boxShadow: '0 0 0 4px rgba(126,108,240,0.07), var(--shadow-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, fontFamily: 'var(--font-body)', ...style }}>
      <span style={{ position: 'absolute', left: 2, top: 0, bottom: 0, width: 118, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <BossMascot kind={kind} assetBase={assetBase} />
      </span>
      <span style={{ position: 'absolute', top: 12, right: 14 }}><LevelBadge level={level} /></span>
      <div style={{ paddingRight: 52 }}>
        <span style={{ ...DISP, fontWeight: 700, fontSize: 18, color: 'var(--color-text)', lineHeight: 1.08 }}>{name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1 }}><ShieldBar current={shield.current} target={shield.target} color={color || THEMES[kind].color} edge={edge || THEMES[kind].edge} /></div>
        <ShieldCount current={shield.current} target={shield.target} />
      </div>
      {chip && <div><Chip kind={chip.kind} tone={chip.tone} role={chip.role} label={chip.label} /></div>}
    </div>
  );
}

/* =====================================================================
   2) BossIntroCard — the large pre-level card
   ===================================================================== */
export function BossIntroCard({
  level = 10,
  name = 'Chú Sâu Đồng Cỏ',
  kind = 'worm',
  color, edge, shine,
  assetBase,
  shield = { current: 4, target: 5 },
  rule = { kind: 'x2', tone: 'rule', role: 'rule', label: 'Combo ×2 phá khiên' },
  playLabel = 'Chơi',
  onPlay,
  style = {},
}) {
  return (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: 20, borderRadius: 'var(--radius-xl)', background: 'var(--color-surface)', border: '1.5px solid rgba(126,108,240,0.30)', boxShadow: '0 0 0 4px rgba(126,108,240,0.09), var(--shadow-lg)', fontFamily: 'var(--font-body)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <BossTag />
        <span style={{ ...CAP, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>MÀN {level}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 128, flexShrink: 0 }}>
          <BossMascot kind={kind} assetBase={assetBase} size={132} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ ...CAP, fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>ĐỐI THỦ</div>
          <div style={{ ...DISP, fontWeight: 700, fontSize: 'var(--text-heading)', color: 'var(--color-text)', lineHeight: 1.1 }}>{name}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1 }}><ShieldBar current={shield.current} target={shield.target} color={color || THEMES[kind].color} edge={edge || THEMES[kind].edge} height={9} /></div>
        <ShieldCount current={shield.current} target={shield.target} />
      </div>

      <div style={{ marginBottom: 18 }}>
        <Chip kind={rule.kind} tone={rule.tone} role={rule.role} label={rule.label} size="lg" />
      </div>

      <Button variant="primary" size="cta" fullWidth icon="play" onClick={onPlay}>{playLabel}</Button>
    </div>
  );
}

/* =====================================================================
   3) BossToast — WARNING pill: what the boss is about to do (a tell)
   ===================================================================== */
export function BossToast({ kind = 'trash', tone, label = 'Lượt sau: Đổ rác', kicker, style = {} }) {
  const t = tone || (kind === 'trash' ? 'trash' : kind === 'gravity' ? 'gravity' : 'rule');
  const c = chipTone(t);
  const glyph = kind === 'gravity'
    ? <Icon name="rotateCw" size={16} color={c.discFg} strokeWidth={2.6} />
    : kind === 'shield'
      ? <Glyph name="shield" size={16} color={c.discFg} sw={2.4} />
      : <Glyph name="leaf" size={16} color={c.discFg} sw={2.4} />;
  return (
    <div data-gj-boss style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 16px 7px 7px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface)', border: `1.5px solid ${c.disc}`, boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-body)', animation: 'gj-boss-bob 2600ms ease-in-out infinite', ...style }}>
      <span style={{ position: 'relative', width: 30, height: 30, borderRadius: '50%', background: c.disc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {glyph}
        <span data-gj-boss style={{ position: 'absolute', top: -1, right: -1, width: 8, height: 8, borderRadius: '50%', background: 'var(--color-danger)', border: '1.5px solid var(--color-surface)', animation: 'gj-boss-glow 1400ms ease-in-out infinite' }} />
      </span>
      <span style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-label)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

/* =====================================================================
   4) BossRule — CẨM NANG item: how to break the boss's shields (a rule,
   deliberately calm + NOT a warning, so it never reads as a boss action)
   ===================================================================== */
export function BossRule({ label = 'Combo ×2 phá khiên', kicker, icon = 'x2', style = {} }) {
  const glyph = icon === 'shield'
    ? <Glyph name="shield" size={15} color="var(--color-gravity-edge)" sw={2.4} />
    : <Icon name="x2" size={14} color="var(--color-gravity-edge)" strokeWidth={2.6} />;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 16px 7px 7px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-sunken)', boxShadow: 'inset 0 1px 2px rgba(120,92,52,0.10)', fontFamily: 'var(--font-body)', ...style }}>
      <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(126,108,240,0.14)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{glyph}</span>
      <span style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-label)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

/* Back-compat: the old cluster export now maps to the compact BossCard. */
export const BossHud = BossCard;
