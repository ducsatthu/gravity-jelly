import * as React from 'react';

export type GravityDirection = 'down' | 'up' | 'left' | 'right';
export type EyeExpression = 'normal' | 'happy' | 'focus' | 'smug' | 'wink' | 'front';

export interface EyesProps {
  /** Gravity direction the pupils track toward (expression 'normal'/'focus'). */
  direction?: GravityDirection;
  /** Parent block size in dp; eye geometry scales from it. */
  blockSize?: number;
  /** Open vs blinking (squashed) eyes. */
  open?: boolean;
  /**
   * Eye character:
   * 'normal' tracks gravity · 'happy' joyful arcs (falling) ·
   * 'focus' fronts + pulses focus on the player · 'smug' contemptuous squint ·
   * 'wink' one open eye + one closed arc · 'front' eyes centered, looking straight at the player.
   */
  expression?: EyeExpression;
  style?: React.CSSProperties;
}

export function Eyes(props: EyesProps): JSX.Element;
