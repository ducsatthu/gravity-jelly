import * as React from 'react';
import { IconName } from '../../02-foundations/03-icon/Icon';

export type ButtonVariant = 'primary' | 'gravity' | 'success' | 'danger' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'cta';

/**
 * Jelly candy button with a 3D press. Primary action uses size="cta" (56dp).
 * @startingPoint section="Components" subtitle="Jelly CTA button + variants" viewport="320x220"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Color treatment. 'ghost' is text-only. */
  variant?: ButtonVariant;
  /** 'cta' = 56dp primary; 'md' = 48dp standard. */
  size?: ButtonSize;
  /** Leading icon name. */
  icon?: IconName | null;
  /** Trailing icon name. */
  iconRight?: IconName | null;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Dim + show a "SẮP CÓ" (coming soon) pill; also disables. */
  comingSoon?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
