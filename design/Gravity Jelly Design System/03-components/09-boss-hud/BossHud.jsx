import React from 'react';
import { Icon } from '../../02-foundations/03-icon/Icon.jsx';

/**
 * BossHud — the boss-fight HUD cluster that sits at the TOP of the GAME screen
 * on boss levels (L10/L20/L30…), replacing the normal ObjectiveBar. A dark,
 * self-contained gravity-purple panel so it reads on both the light meadow and
 * darker biome backdrops. Contains:
 *   • round boss portrait (jelly-style, cute-but-opponent) + name
 *   • HP bar — sunken track, fill danger→warning by % HP, "MÁU n/××" (Fredoka);
 *     JERKS + FLASHES when the boss takes a hit
 *   • floating damage numbers (−1/−2/−3) tied to the combo tier, in sync with
 *     ComboPopup ×N (a small ×N rides along)
 *   • rule reminder: "Combo ≥ ×2 để gây sát thương"
 *   • optional per-boss TELL indicator (L20 "sắp đổ rác", L30 "sắp đảo trọng
 *     lực" with a 3→0 countdown)
 *
 * Drive the hit animation by incrementing `hitToken` (and setting `lastHit`);
 * the panel plays the jerk/flash and floats a −damage. Sizes (dp): panel ~112
 * · portrait 64 · HP track 16 · radius lg 20.
 *
 * Damage tiers (combo → damage): ×2–3 → 1 · ×4–6 → 2 · ×7+ → 3. combo < 2 = 0.
 */

export function comboDamage(combo) {
  if (combo >= 7) return 3;
  if (combo >= 4) return 2;
  if (combo >= 2) return 1;
  return 0;
}

/* one-time keyframes */
if (typeof document !== 'undefined' && !document.getElementById('gj-bosshud-kf')) {
  const s = document.createElement('style');
  s.id = 'gj-bosshud-kf';
  s.textContent = `
    @keyframes gj-boss-shake { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-4px) rotate(-2deg)} 30%{transform:translateX(4px) rotate(2deg)} 45%{transform:translateX(-3px)} 60%{transform:translateX(3px)} 80%{transform:translateX(-1px)} }
    @keyframes gj-boss-flash { 0%{opacity:0} 20%{opacity:0.85} 100%{opacity:0} }
    @keyframes gj-dmg-float { 0%{transform:translate(-50%,4px) scale(.6);opacity:0} 22%{transform:translate(-50%,-10px) scale(1.15);opacity:1} 100%{transform:translate(-50%,-46px) scale(1);opacity:0} }
    @keyframes gj-boss-ring { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.12);opacity:.15} }
    @media (prefers-reduced-motion: reduce){ [data-gj-boss]{animation:none!important} }
  `;
  document.head.appendChild(s);
}

const DISP = { fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1 };
const CAP = { fontFamily: 'var(--font-body)', fontWeight: 800, letterSpacing: 'var(--tracking-wide)', lineHeight: 1 };

/* Round boss portrait — a circular jelly with a top gloss + menacing eyes.
   `color`/`edge` theme the body per boss; brows make it an opponent. */
function Portrait({ size = 64, color = 'var(--color-gravity)', edge = 'var(--color-gravity-edge)', shine = 'var(--color-gravity-shine)', hurt }) {
  const eye = size * 0.26;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, width: size, height: size }}>
      {/* pulsing danger ring */}
      <span data-gj-boss aria-hidden="true" style={{ position: 'absolute', inset: -5, borderRadius: '50%', background: 'var(--color-danger)', opacity: 0.4, animation: 'gj-boss-ring 1800ms ease-in-out infinite' }} />
      <span style={{ position: 'relative', width: size, height: size, borderRadius: '50%', boxSizing: 'border-box', background: color, border: `3px solid ${edge}`, boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.14), var(--shadow-md)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ position: 'absolute', top: size * 0.08, left: '20%', right: '20%', height: '26%', borderRadius: '50%', background: shine, opacity: 0.85 }} />
        {/* eyes */}
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: size * 0.12, marginTop: size * 0.06 }}>
          {[0, 1].map((i) => (
            <span key={i} style={{ position: 'relative', width: eye, height: eye, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1.5px rgba(74,53,38,0.22)' }}>
              <span style={{ width: eye * 0.5, height: eye * 0.5, borderRadius: '50%', background: '#4A3526', transform: hurt ? 'translateY(1px)' : 'none' }} />
              {/* angry brow */}
              <span style={{ position: 'absolute', top: -eye * 0.22, left: i ? 'auto' : -eye * 0.16, right: i ? -eye * 0.16 : 'auto', width: eye * 0.9, height: eye * 0.36, background: edge, transform: `rotate(${i ? -24 : 24}deg)`, borderRadius: 2 }} />
            </span>
          ))}
        </span>
        {/* grimace */}
        <span style={{ position: 'absolute', bottom: size * 0.16, left: '50%', transform: 'translateX(-50%)', width: size * 0.32, height: size * 0.12, borderBottom: `2.5px solid rgba(74,53,38,0.5)`, borderRadius: hurt ? '50%/100% 100% 0 0' : '0 0 50%/0 0 100% 100%' }} />
      </span>
    </span>
  );
}

/* the danger→warning HP fill */
function hpColor(pct) {
  // full = deep danger red; drains toward warning as the boss weakens
  return `color-mix(in srgb, var(--color-danger) ${Math.round(pct * 100)}%, var(--color-warning))`;
}

const TRASH_GLYPH = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M10 11v6M14 11v6" /></svg>
);

function TellPill({ tell }) {
  if (!tell) return null;
  const isGrav = tell.kind === 'gravity';
  const label = tell.label || (isGrav ? 'Sắp đảo trọng lực' : 'Sắp đổ rác');
  return (
    <span data-gj-boss style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 6px 4px 10px', borderRadius: 'var(--radius-full)', background: isGrav ? 'var(--color-gravity)' : 'var(--color-warning)', color: isGrav ? '#fff' : 'var(--color-text)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.25)', animation: 'gj-boss-ring 1400ms ease-in-out infinite' }}>
      {isGrav ? <Icon name="rotateCw" size={15} color="currentColor" strokeWidth={2.4} /> : <span style={{ display: 'inline-flex', color: 'currentColor' }}>{TRASH_GLYPH}</span>}
      <span style={{ ...CAP, fontSize: 'var(--text-caption)', color: 'inherit', whiteSpace: 'nowrap' }}>{label}</span>
      {isGrav && tell.countdown != null && (
        <span style={{ minWidth: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', color: 'var(--color-gravity)', ...DISP, fontWeight: 800, fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{tell.countdown}</span>
      )}
    </span>
  );
}

export function BossHud({
  level = 10,
  name = 'Chú Sâu Đồng Cỏ',
  hp = 5,
  maxHp = 5,
  color = 'var(--color-gravity)',
  edge = 'var(--color-gravity-edge)',
  shine = 'var(--color-gravity-shine)',
  hitToken = 0,
  lastHit = { damage: 1, combo: 2 },
  tell = null,
  rule = true,
  style = {},
}) {
  const [flash, setFlash] = React.useState(false);
  const [floats, setFloats] = React.useState([]);

  React.useEffect(() => {
    if (!hitToken) return;
    setFlash(true);
    const id = hitToken + '-' + Math.random().toString(36).slice(2, 6);
    setFloats((f) => [...f, { id, ...lastHit }]);
    const t1 = setTimeout(() => setFlash(false), 400);
    const t2 = setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [hitToken]);

  const pct = Math.max(0, Math.min(1, hp / maxHp));

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px 9px', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(180deg, rgba(75,63,176,0.97), rgba(46,38,112,0.97))', boxShadow: '0 8px 18px rgba(46,38,112,0.42), inset 0 1px 0 rgba(255,255,255,0.22)', fontFamily: 'var(--font-body)', ...style }}>
      {/* top row: portrait + name + HP */}
      <div data-gj-boss style={{ display: 'flex', alignItems: 'center', gap: 12, animation: flash ? 'gj-boss-shake 400ms ease-in-out' : 'none' }}>
        <div style={{ position: 'relative' }}>
          <Portrait color={color} edge={edge} shine={shine} hurt={flash} />
          {/* floating damage numbers */}
          {floats.map((fl) => (
            <span key={fl.id} data-gj-boss style={{ position: 'absolute', top: -8, left: '50%', display: 'inline-flex', alignItems: 'baseline', gap: 2, whiteSpace: 'nowrap', pointerEvents: 'none', animation: 'gj-dmg-float 1000ms cubic-bezier(.3,1.4,.6,1) forwards' }}>
              <span style={{ ...DISP, fontWeight: 800, fontSize: 26, color: '#FFE24D', textShadow: '0 0 1px #B9821C, 0 2px 3px rgba(46,38,112,0.6), 0 0 8px rgba(255,196,75,0.7)' }}>−{fl.damage}</span>
              {fl.combo >= 2 && <span style={{ ...DISP, fontWeight: 800, fontSize: 13, color: '#fff', opacity: 0.9 }}>×{fl.combo}</span>}
            </span>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
            <span style={{ ...DISP, fontWeight: 800, fontSize: 17, color: '#fff', whiteSpace: 'nowrap' }}>{name}</span>
            <span style={{ ...CAP, fontSize: 10, color: 'var(--color-gravity-shine)', flexShrink: 0, whiteSpace: 'nowrap' }}>MÀN {level}</span>
          </div>
          {/* HP bar */}
          <div style={{ position: 'relative', height: 16, borderRadius: 'var(--radius-full)', background: 'rgba(0,0,0,0.34)', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)' }}>
            <div data-gj-boss style={{ position: 'absolute', inset: 0, right: `${(1 - pct) * 100}%`, borderRadius: 'var(--radius-full)', background: `linear-gradient(180deg, color-mix(in srgb, ${hpColor(pct)} 78%, #fff 24%), ${hpColor(pct)})`, boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.4)', transition: 'right 320ms var(--ease-out), background 320ms linear' }} />
            {/* white hit-flash overlay */}
            <div data-gj-boss aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: 'var(--radius-full)', opacity: 0, animation: flash ? 'gj-boss-flash 400ms ease-out' : 'none' }} />
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, whiteSpace: 'nowrap' }}>
              <Icon name="heart" size={11} color="#fff" strokeWidth={2.6} />
              <span style={{ ...DISP, fontWeight: 800, fontSize: 12, color: '#fff', textShadow: '0 1px 2px rgba(46,38,112,0.9)' }}>{hp}<span style={{ opacity: 0.75, fontSize: 10 }}> / {maxHp}</span></span>
            </span>
          </div>
        </div>
      </div>

      {/* bottom row: tell + rule reminder */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9, minHeight: 22 }}>
        <TellPill tell={tell} />
        {rule && (
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.82)' }}>
            <span style={{ width: 15, height: 15, borderRadius: '50%', background: 'rgba(255,255,255,0.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="info" size={11} color="#fff" strokeWidth={2.4} />
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>
              Combo ≥ <b style={{ ...DISP, fontWeight: 800, fontSize: 13, color: '#FFE24D' }}>×2</b> để gây sát thương
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
