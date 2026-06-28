import React, { useState } from 'react';
import { Icon } from '../../02-foundations/03-icon/Icon.jsx';

/**
 * Button — the jelly CTA. A rounded candy button with a thick darker
 * "edge" base that compresses on press (translateY). Variants map to the
 * palette; size 'cta' is the 56dp primary action.
 */

const VARIANTS = {
  primary:   { fill: 'var(--color-primary)',     edge: 'var(--color-primary-edge)',     shine: 'var(--color-primary-shine)',     text: 'var(--color-text-invert)' },
  gravity:   { fill: 'var(--color-gravity)',      edge: 'var(--color-gravity-edge)',      shine: 'var(--color-gravity-shine)',      text: 'var(--color-text-invert)' },
  success:   { fill: 'var(--color-success)',      edge: '#4FAE60',                        shine: '#9BE3A8',                         text: 'var(--color-text-invert)' },
  danger:    { fill: 'var(--color-danger)',       edge: '#D66B5E',                        shine: '#F7B4AC',                         text: 'var(--color-text-invert)' },
  secondary: { fill: 'var(--color-surface)',      edge: '#E7D9C2',                        shine: '#FFFFFF',                         text: 'var(--color-text)' },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  comingSoon = false,
  onClick,
  style = {},
}) {
  const [pressed, setPressed] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const isGhost = variant === 'ghost';
  const cta = size === 'cta';
  const off = disabled || comingSoon;
  const edgeDepth = cta ? 5 : 4;

  const base = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    width: fullWidth ? '100%' : 'auto',
    minHeight: cta ? 'var(--dim-cta-h)' : 'var(--dim-btn-h)',
    padding: cta ? '0 var(--space-2xl)' : '0 var(--space-xl)',
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--weight-semibold)',
    fontSize: cta ? 'var(--text-heading)' : 'var(--text-label)',
    color: isGhost ? 'var(--color-text)' : v.text,
    background: isGhost ? 'transparent' : v.fill,
    border: variant === 'secondary' ? `var(--border-thin) solid ${v.edge}` : 'none',
    borderRadius: cta ? 'var(--radius-xl)' : 'var(--radius-lg)',
    boxShadow: isGhost
      ? 'none'
      : `0 ${pressed && !off ? 1 : edgeDepth}px 0 ${v.edge}, var(--shadow-sm)`,
    transform: pressed && !off ? `translateY(${edgeDepth - 1}px)` : 'translateY(0)',
    transition: 'transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)',
    opacity: off ? 0.55 : 1,
    cursor: off ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    boxSizing: 'border-box',
    ...style,
  };

  return (
    <button
      type="button"
      disabled={off}
      onPointerDown={() => !off && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={off ? undefined : onClick}
      style={base}
    >
      {!isGhost && !pressed && (
        <span style={{ position: 'absolute', top: 3, left: '14%', right: '14%', height: '34%', background: v.shine, opacity: 0.5, borderRadius: 'var(--radius-full)', pointerEvents: 'none' }} />
      )}
      {icon && <Icon name={icon} size={cta ? 24 : 20} color={isGhost ? 'var(--color-text)' : v.text} />}
      <span style={{ position: 'relative', whiteSpace: 'nowrap' }}>{children}</span>
      {comingSoon && (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-bold)', background: 'rgba(255,255,255,0.35)', borderRadius: 'var(--radius-full)', padding: '2px 8px', letterSpacing: 'var(--tracking-wide)' }}>SẮP CÓ</span>
      )}
      {iconRight && <Icon name={iconRight} size={cta ? 24 : 20} color={isGhost ? 'var(--color-text)' : v.text} />}
    </button>
  );
}
