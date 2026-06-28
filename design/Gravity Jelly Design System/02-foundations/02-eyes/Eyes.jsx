import React from 'react';

/**
 * Eyes — the pair of googly jelly eyes. By default the pupils shift toward
 * the active gravity direction so every block "looks" the way it will fall.
 * Every round eye has a gray rim around the white and a white catchlight
 * inside the dark pupil, so the gaze always reads as alive.
 *
 * `expression` adds character beyond plain looking:
 *   - 'normal' : round eyes, pupils track `direction` (default)
 *   - 'happy'  : joyful closed "^ ^" arcs with a little bob — use while falling
 *   - 'focus'  : eyes front, pulsing reticle, like pulling focus on the player
 *   - 'smug'   : heavy half-lids, tilted — a contemptuous squint
 *   - 'wink'   : one eye open (front), one closed arc — a friendly wink
 *   - 'front'  : round eyes, pupils centered — looking straight at the player
 *
 * Pure presentational; scales off the parent block size.
 */

const INK = '#4A3526';

// Inject the expression keyframes once per document.
let kfInjected = false;
function ensureKeyframes() {
  if (kfInjected || typeof document === 'undefined') return;
  kfInjected = true;
  const s = document.createElement('style');
  s.setAttribute('data-gj-eyes', '');
  s.textContent = `
    @keyframes gjEyeJoy { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2.5px) } }
    @keyframes gjEyeReticle { 0% { transform: scale(1.8); opacity: 0 } 28% { opacity: .85 } 100% { transform: scale(1); opacity: 0 } }
    @keyframes gjEyeFocusPupil { 0%,100% { transform: scale(1) } 50% { transform: scale(1.16) } }
  `;
  document.head.appendChild(s);
}

export function Eyes({
  direction = 'down',
  blockSize = 36,
  open = true,
  expression = 'normal',
  style = {},
}) {
  ensureKeyframes();

  // Eye + pupil geometry scales with block size.
  const eye = Math.round(blockSize * 0.26);
  const pupil = Math.round(eye * 0.52);
  const gap = Math.round(blockSize * 0.12);
  const spark = Math.max(2, Math.round(pupil * 0.34));
  const travel = (eye - pupil) / 2 - 0.5;
  const offset = {
    down:  { x: 0, y: travel },
    up:    { x: 0, y: -travel },
    left:  { x: -travel, y: 0 },
    right: { x: travel, y: 0 },
  }[direction] || { x: 0, y: travel };

  const row = (children, extra = {}) => (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap, ...extra, ...style }}>
      {children}
    </div>
  );

  // Shared white eyeball: gray rim around the white + dark pupil + catchlight.
  // `opts.reticle`/`opts.pulse` add the focus treatment.
  const ball = (key, off, opts = {}) => (
    <div key={key} style={{ position: 'relative', width: eye, height: eye, background: '#FFFFFF', borderRadius: '50%', boxShadow: 'inset 0 0 0 1.5px rgba(74,53,38,0.30), inset 0 -1px 2px rgba(90,70,54,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {opts.reticle && (
        <div style={{ position: 'absolute', width: Math.round(eye * 0.86), height: Math.round(eye * 0.86), borderRadius: '50%', border: '1.5px solid rgba(74,53,38,0.5)', animation: 'gjEyeReticle 1.5s var(--ease-inout, ease-in-out) infinite' }} />
      )}
      {/* dark pupil + white catchlight */}
      <div style={{ position: 'relative', width: pupil, height: pupil, background: INK, borderRadius: '50%', transform: `translate(${off.x}px, ${off.y}px)`, transition: 'transform var(--motion-medium, 350ms) var(--ease-inout, ease)', animation: opts.pulse ? 'gjEyeFocusPupil 1.5s var(--ease-inout, ease-in-out) infinite' : undefined }}>
        <span style={{ position: 'absolute', top: '14%', right: '14%', width: spark, height: spark, background: '#FFFFFF', borderRadius: '50%', opacity: 0.9 }} />
      </div>
    </div>
  );

  // Flattened (blinking / squashed) white.
  const shutEye = (key) => (
    <div key={key} style={{ width: eye, height: Math.max(2, Math.round(eye * 0.18)), background: '#FFFFFF', borderRadius: '50%', boxShadow: 'inset 0 -1px 2px rgba(90,70,54,0.18)', transition: 'height 120ms var(--ease-out, ease)' }} />
  );

  /* ---- happy: joyful upward arcs that bob ---- */
  if (expression === 'happy') {
    const arc = (key) => (
      <svg key={key} width={eye} height={eye} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M3.5 16.5 Q12 4.5 20.5 16.5" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      </svg>
    );
    return row([arc('l'), arc('r')], { animation: 'gjEyeJoy 700ms var(--ease-jelly, ease-in-out) infinite' });
  }

  /* ---- focus: eyes front, pulsing reticle ---- */
  if (expression === 'focus') {
    return row([ball('l', { x: 0, y: 0 }, { reticle: true, pulse: true }), ball('r', { x: 0, y: 0 }, { reticle: true, pulse: true })]);
  }

  /* ---- smug: heavy half-lids, tilted outward ---- */
  if (expression === 'smug') {
    const half = Math.round(eye * 0.52);
    const smugEye = (key, tilt) => (
      <div key={key} style={{ position: 'relative', width: eye, height: half, overflow: 'hidden', transform: `rotate(${tilt}deg)`, borderRadius: `0 0 ${eye}px ${eye}px` }}>
        <div style={{ position: 'absolute', top: -Math.round(eye - half), left: 0 }}>
          {ball('b', { x: 0, y: 0 })}
        </div>
        {/* heavy upper lid line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: Math.max(2, Math.round(eye * 0.12)), background: INK, borderRadius: 2 }} />
      </div>
    );
    return row([smugEye('l', 9), smugEye('r', -9)], { alignItems: 'flex-start' });
  }

  /* ---- wink: one open eye (front), one closed arc ---- */
  if (expression === 'wink') {
    const closedEye = (
      <svg key="r" width={eye} height={eye} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M3.5 15 Q12 6 20.5 15" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      </svg>
    );
    return row([ball('l', { x: 0, y: 0 }), closedEye]);
  }

  /* ---- normal / front: round eyes; pupils track gravity ('front' = centered) ---- */
  const eyeOffset = expression === 'front' ? { x: 0, y: 0 } : offset;
  if (!open) return row([shutEye('l'), shutEye('r')]);
  return row([ball('l', eyeOffset), ball('r', eyeOffset)]);
}
