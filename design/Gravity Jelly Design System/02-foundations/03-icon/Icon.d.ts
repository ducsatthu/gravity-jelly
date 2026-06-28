import * as React from 'react';

export type IconName =
  | 'pause' | 'play' | 'settings' | 'rotate' | 'rotateCw' | 'volume' | 'mute'
  | 'music' | 'vibrate' | 'globe' | 'info' | 'close' | 'back'
  | 'home' | 'refresh' | 'heart' | 'star' | 'trophy' | 'x2' | 'chevron';

export interface IconProps {
  /** Glyph name from the Gravity Jelly set. */
  name?: IconName;
  /** Square size in dp. */
  size?: number;
  /** Stroke color (defaults to currentColor). */
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export function Icon(props: IconProps): JSX.Element;
