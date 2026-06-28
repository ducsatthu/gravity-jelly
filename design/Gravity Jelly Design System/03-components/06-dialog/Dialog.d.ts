import * as React from 'react';
import { IconName } from '../../02-foundations/03-icon/Icon';

/**
 * Soft modal sheet for pause / confirm / info. Renders over the nearest
 * positioned ancestor (the phone frame), so give that frame position: relative.
 */
export interface DialogProps {
  open?: boolean;
  title?: React.ReactNode;
  /** Optional leading icon glyph. */
  icon?: IconName | null;
  /** Body content. */
  children?: React.ReactNode;
  /** Action area — stack Buttons here (usually fullWidth). */
  actions?: React.ReactNode;
  onClose?: () => void;
  /** Allow scrim tap + close button to dismiss. */
  dismissable?: boolean;
  style?: React.CSSProperties;
}

export function Dialog(props: DialogProps): JSX.Element | null;
