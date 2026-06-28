import * as React from 'react';

/**
 * The clear-celebration callout: jelly pieces tumble down and bounce into a
 * dish on every clear; a multi-colour ×N + praise word also bursts in above
 * when the clear is a chain (combo > 1).
 */
export interface ComboPopupProps {
  /** Chain length. Text shows when > 1; pass 1 for a plain single clear. */
  combo?: number;
  /** Override the auto-picked praise word (else escalates with `combo`). */
  praise?: string;
  /** Override the number of falling jelly pieces. */
  pieces?: number;
  /** Override the fall colours. */
  colors?: Array<'yellow' | 'mint' | 'pink' | 'blue'>;
  /** Render the catching dish (default true). */
  showDish?: boolean;
  /** Vertical room for the fall, in px (default 120). */
  height?: number;
  /** Caption (unused in current layout). */
  label?: string;
  /** Mount only while true; change `key` to replay. */
  visible?: boolean;
  /** Play the fall + pop animation on mount (default true). */
  animate?: boolean;
  style?: React.CSSProperties;
}

export function ComboPopup(props: ComboPopupProps): JSX.Element | null;
