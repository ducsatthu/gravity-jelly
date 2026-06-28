import * as React from 'react';

/**
 * The 64dp circular FAB that rotates gravity 90°, with a remaining-rotations badge.
 * @startingPoint section="Components" subtitle="Signature gravity rotate FAB" viewport="160x160"
 */
export interface GravityRotateButtonProps {
  /** Rotations left this stage; disables the button at 0. */
  turnsLeft?: number;
  /** Called on a valid press (after the icon spins 90°). */
  onRotate?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function GravityRotateButton(props: GravityRotateButtonProps): JSX.Element;
