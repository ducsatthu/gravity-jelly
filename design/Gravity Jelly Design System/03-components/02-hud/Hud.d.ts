import * as React from 'react';

export type GravityDirection = 'down' | 'up' | 'left' | 'right';

/**
 * The 56dp game top bar: score, gravity-direction indicator, pause.
 */
export interface HudProps {
  /** Current score (formatted with thousands separators). */
  score?: number;
  /** Optional best score. */
  best?: number | null;
  /** Active gravity direction (rotates the indicator arrow). */
  direction?: GravityDirection;
  onPause?: () => void;
  style?: React.CSSProperties;
}

export function Hud(props: HudProps): JSX.Element;
