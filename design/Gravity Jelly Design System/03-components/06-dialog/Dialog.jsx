import React from 'react';
import { Icon } from '../../02-foundations/03-icon/Icon.jsx';

/**
 * Dialog — the soft modal sheet used for pause, confirm, and info. A warm
 * scrim plus a rounded card that springs in. Title row with optional close,
 * a body, and an actions area (stack your Buttons there, usually fullWidth).
 */
export function Dialog({
  open = true,
  title,
  icon = null,
  children,
  actions = null,
  onClose,
  dismissable = true,
  style = {},
}) {
  if (!open) return null;
  return (
    <div
      onClick={dismissable ? onClose : undefined}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--color-overlay)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
        zIndex: 50,
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 312,
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-xl)',
          boxShadow: 'var(--shadow-lg)',
          boxSizing: 'border-box',
          animation: 'gj-dialog 280ms var(--ease-jelly) both',
          ...style,
        }}
      >
        <style>{`@keyframes gj-dialog {
          0% { transform: scale(0.88) translateY(10px); }
          60% { transform: scale(1.02) translateY(0); }
          100% { transform: scale(1) translateY(0); }
        }`}</style>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: children ? 'var(--space-md)' : 'var(--space-lg)' }}>
          {icon && (
            <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-sunken)', color: 'var(--color-gravity)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={icon} size={22} />
            </span>
          )}
          <h2 style={{ flex: 1, margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-heading)', color: 'var(--color-text)' }}>{title}</h2>
          {dismissable && onClose && (
            <button type="button" onClick={onClose} aria-label="Đóng"
              style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="close" size={20} />
            </button>
          )}
        </div>

        {children && (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', lineHeight: 'var(--leading-body)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
            {children}
          </div>
        )}

        {actions && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>{actions}</div>
        )}
      </div>
    </div>
  );
}
