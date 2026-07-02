import * as React from 'react';

/**
 * ObjectiveBar — the always-on level-objective cluster shown under the 56dp
 * HUD, above the board. One component switches on `goal.kind` to cover every
 * goal_type in the catalogue, with active / near / done states.
 *
 * Sizes (dp): single-row 52 · two-row (mixed) 72 · padding 16 · radius 20
 * · shadow sm · progress track 12 · glyph 26–30 · chip 28.
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

/** Single-action tutorial goal: icon + short label + "0/1" (or "×N") chip. */
export interface TutorialGoal {
  kind: 'tutorial';
  variant: TutorialVariant;
  /** Short Vietnamese label, e.g. "Xóa 1 hàng". */
  label: string;
  /** Progress so far (for combo: highest ×N reached). Default 0. */
  current?: number;
  /** Target to reach. Default 1. */
  target?: number;
  /** Force a state for showcase; otherwise derived from progress. */
  status?: ObjectiveStatus;
}

/** REACH_SCORE goal: caption + progress bar (current / target), primary fill. */
export interface ScoreGoal {
  kind: 'score';
  score: number;
  target: number;
  status?: ObjectiveStatus;
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
}

/** MIXED goal: must satisfy BOTH — targets counter + score bar, stacked. */
export interface MixedGoal {
  kind: 'mixed';
  targets: { target: 'vine' | 'drop'; total: number; remaining: number; buried?: number };
  score: { score: number; target: number };
}

export type Goal = TutorialGoal | ScoreGoal | TargetsGoal | MixedGoal;

export interface ObjectiveBarProps {
  goal: Goal;
  /** Gravity turns-left; renders a purple chip on the right when not on the FAB. */
  rotations?: number | null;
  style?: React.CSSProperties;
}

export function ObjectiveBar(props: ObjectiveBarProps): JSX.Element;
