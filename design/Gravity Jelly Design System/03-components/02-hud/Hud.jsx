import React from 'react';
import { Icon } from '../../02-foundations/03-icon/Icon.jsx';

/**
 * Hud — the 56dp top status bar: live score on the left, a gravity-direction
 * indicator in the center, and a round pause button on the right.
 */

const ARROW = { down: '180deg', up: '0deg', left: '270deg', right: '90deg' };

function GravityIndicator({ direction = 'down' }) {
  return (
    <div
      title="Hướng trọng lực"
      style={{
        display: 'inline-flex',
        flexShrink: 0,
        alignItems: 'center',
        gap: 'var(--space-xs)',
        height: 36,
        padding: '0 var(--space-md)',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-gravity)',
        boxShadow: `0 3px 0 var(--color-gravity-edge)`,
        color: 'var(--color-text-invert)',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: `rotate(${ARROW[direction] || '180deg'})`, transition: 'transform var(--motion-medium) var(--ease-inout)' }}>
        <path d="M12 4v15M6 13l6 6 6-6" />
      </svg>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-label)', letterSpacing: 'var(--tracking-wide)', whiteSpace: 'nowrap', lineHeight: 1 }}>TRỌNG LỰC</span>
    </div>
  );
}

export function Hud({ score = 0, best = null, direction = 'down', onPause, style = {} }) {
  return (
    <div
      style={{
        height: 'var(--dim-hud-h)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-md)',
        padding: '0 var(--space-lg)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Score */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 84 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)', lineHeight: 1 }}>ĐIỂM</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-score)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)', lineHeight: 1.1 }}>{score.toLocaleString('vi-VN')}</span>
      </div>

      <GravityIndicator direction={direction} />

      {/* Pause */}
      <button
        type="button"
        onClick={onPause}
        aria-label="Tạm dừng"
        style={{
          width: 'var(--dim-icon-btn)',
          height: 'var(--dim-icon-btn)',
          borderRadius: 'var(--radius-lg)',
          border: 'var(--border-thin) solid #ECDFC9',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Icon name="pause" size={22} />
      </button>
    </div>
  );
}
