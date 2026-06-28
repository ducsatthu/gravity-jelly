import React, { useState } from 'react';
import { Icon } from '../../02-foundations/03-icon/Icon.jsx';

/**
 * GravityRotateButton — the 64dp circular FAB that rotates gravity 90°.
 * Carries a badge with the remaining rotations; disables at 0. The icon
 * spins 90° on each press to reinforce the mechanic.
 */
export function GravityRotateButton({ turnsLeft = 0, onRotate, disabled = false, style = {} }) {
  const [spin, setSpin] = useState(0);
  const off = disabled || turnsLeft <= 0;

  const handle = () => {
    if (off) return;
    setSpin((s) => s + 90);
    onRotate && onRotate();
  };

  return (
    <div style={{ position: 'relative', width: 'var(--dim-gravity-btn)', height: 'var(--dim-gravity-btn)', ...style }}>
      <button
        type="button"
        onClick={handle}
        disabled={off}
        aria-label={`Xoay trọng lực, còn ${turnsLeft} lượt`}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 'var(--radius-full)',
          border: 'none',
          background: off ? 'var(--color-stone)' : 'var(--color-gravity)',
          boxShadow: off ? 'var(--shadow-sm)' : `0 5px 0 var(--color-gravity-edge), var(--shadow-md)`,
          color: 'var(--color-text-invert)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: off ? 'not-allowed' : 'pointer',
          opacity: off ? 0.7 : 1,
          transition: 'transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)',
        }}
      >
        {/* top gloss */}
        <span style={{ position: 'absolute', top: 6, left: '24%', right: '24%', height: '24%', background: 'var(--color-gravity-shine)', opacity: 0.55, borderRadius: 'var(--radius-full)', pointerEvents: 'none' }} />
        <span style={{ display: 'inline-flex', transform: `rotate(${spin}deg)`, transition: 'transform var(--motion-medium) var(--ease-inout)' }}>
          <Icon name="rotateCw" size={30} color="var(--color-text-invert)" strokeWidth={2.4} />
        </span>
      </button>

      {/* remaining-turns badge */}
      <div
        style={{
          position: 'absolute',
          top: -6,
          right: -6,
          minWidth: 24,
          height: 24,
          padding: '0 6px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-surface)',
          border: `2px solid ${off ? 'var(--color-stone-edge)' : 'var(--color-gravity)'}`,
          color: off ? 'var(--color-text-muted)' : 'var(--color-gravity)',
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--weight-bold)',
          fontSize: 'var(--text-label)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
          boxSizing: 'border-box',
        }}
      >
        {turnsLeft}
      </div>
    </div>
  );
}
