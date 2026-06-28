import * as React from 'react';

export type JellyColor = 'yellow' | 'mint' | 'pink' | 'blue' | 'stone';
export type GravityDirection = 'down' | 'up' | 'left' | 'right';
export type EyeExpression = 'normal' | 'happy' | 'focus' | 'smug' | 'wink' | 'front';

export interface JellyConnect {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
}

/**
 * The signature grid cell: a rounded jelly cube with eyes + cluster number.
 * @startingPoint section="Foundations" subtitle="Signature jelly cell character" viewport="220x220"
 */
export interface JellyBlockProps {
  /** Jelly flavor, or 'stone' for the immovable cell. */
  color?: JellyColor;
  /** Cell size in dp (grid uses 36). */
  size?: number;
  /** Cluster size carried as data; not drawn on the block. */
  count?: number | null;
  /** Gravity direction the eyes track toward. */
  direction?: GravityDirection;
  /** Show googly eyes (false for plain fill). */
  showEyes?: boolean;
  /** Squash-on-impact state. */
  squashed?: boolean;
  /** Line-clear flash + pop-out state. */
  clearing?: boolean;
  /** Eye expression forwarded to the block's eyes (happy/focus/smug/wink/front). */
  expression?: EyeExpression;
  /** Close both eyes (a blink); combine with expression 'front' for a human blink. */
  blink?: boolean;
  /** Accepted for compatibility; no longer affects rounding (blocks stay fully rounded). */
  connect?: JellyConnect;
  style?: React.CSSProperties;
}

export function JellyBlock(props: JellyBlockProps): JSX.Element;
