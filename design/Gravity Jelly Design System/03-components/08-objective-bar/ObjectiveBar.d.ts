import * as React from 'react';

/**
 * ObjectiveBar — the always-on level-objective cluster shown under the 56dp
 * HUD, above the board. One component switches on `goal.kind` (tutorial |
 * targets) with active / near / done states. Every level is rated the same
 * way — by moves (số nước) — with a current-level badge on the left and a
 * move-based 3-star strip in the footer. (The score / mixed — điểm — kinds
 * were removed for consistency across all levels.)
 *
 * Sizes (dp): single-row 52 · padding 16 · radius 20 · shadow sm
 * · glyph 26–30 · chip 28 · level badge min 44.
 */

export type ObjectiveStatus = 'active' | 'near' | 'done';

export type TutorialVariant =
  | 'clearRow'      // CLEAR_ROW_FIRST — 3×3 grid, lit row
  | 'clearCol'      // CLEAR_COL_FIRST — 3×3 grid, lit column
  | 'rotate'        // ROTATE_FIRST    — gravity rotate glyph
  | 'super1'        // MAKE_SUPER1     — super block (★)
  | 'super2'        // MAKE_SUPER2     — super block, lvl 2 pip
  | 'rainbow'       // MAKE_RAINBOW    — rainbow block
  | 'rainbowSuper'  // MAKE_RAINBOW_SUPER — crowned rainbow
  | 'combo';        // COMBO_X2        — chip shows "×N" (highest reached)

/** Star tier + caption for a level (rated by moves left — số nước). */
export interface StarInfo {
  /** Current tier 0–3. */
  tier?: number;
  /** Bold current-tier caption, e.g. "Đang 3★". */
  now?: string;
  /** Muted "what's next" caption, e.g. "còn 6 nước". */
  next?: string;
}

/** Single-action tutorial goal: icon + short label + "0/1" (or "×N") chip. */
export interface TutorialGoal {
  kind: 'tutorial';
  variant: TutorialVariant;
  /** Short Vietnamese label, e.g. "Xóa 1 hàng". */
  label: string;
  /** Progress so far (for combo: highest ×N reached). Default 0. */
  current?: number;
  /** Target to reach. Default 1. Single-action variants drop the counter chip
   *  (label + done tick say it all); only `combo` keeps a live ×N. */
  target?: number;
  /** Force a state for showcase; otherwise derived from progress. */
  status?: ObjectiveStatus;
  /** Move-based star readout for the footer strip. */
  stars?: StarInfo;
}

/** CLEAR_TARGETS goal: a row of target glyphs that dim as destroyed + "còn N". */
export interface TargetsGoal {
  kind: 'targets';
  /** Which target cell: vine root (W2) or water drop (W3). */
  target: 'vine' | 'drop';
  /** Total targets on the level. */
  total: number;
  /** How many still remain. */
  remaining: number;
  /** How many of the remaining are buried (dim + layer-lock). Default 0. */
  buried?: number;
  /** Move-based star readout for the footer strip. */
  stars?: StarInfo;
}

export type Goal = TutorialGoal | TargetsGoal;

export interface ObjectiveBarProps {
  goal: Goal;
  /** Current global level number (1–100) — shown in the left badge. */
  level?: number | null;
  /** World name (e.g. "Rừng rậm") — small-caps under the level number. */
  world?: string | null;
  style?: React.CSSProperties;
}

export function ObjectiveBar(props: ObjectiveBarProps): JSX.Element;
