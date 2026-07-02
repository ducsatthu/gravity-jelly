import * as React from 'react';

/**
 * BossHud — the boss-fight HUD cluster shown at the TOP of the GAME screen on
 * boss levels (L10/L20/L30…), replacing the normal ObjectiveBar. A dark,
 * self-contained gravity-purple panel that reads on light and dark backdrops.
 *
 * Contents: round boss portrait + name · HP bar (danger→warning by % HP, jerks
 * + flashes when hit) · floating −damage numbers tied to the combo tier (in
 * sync with ComboPopup ×N) · rule reminder "Combo ≥ ×2 để gây sát thương" ·
 * optional per-boss tell (trash dump / gravity flip with 3→0 countdown).
 *
 * Sizes (dp): panel ~112 · portrait 64 · HP track 16 · radius xl.
 */

export interface BossTell {
  /** 'trash' → "Sắp đổ rác" (L20) · 'gravity' → "Sắp đảo trọng lực" (L30). */
  kind: 'trash' | 'gravity';
  /** Override the default label. */
  label?: string;
  /** For gravity: the 3→0 countdown number shown in the pill. */
  countdown?: number;
}

export interface BossHit {
  /** Damage dealt (1/2/3) — usually comboDamage(combo). */
  damage: number;
  /** The combo multiplier that landed the hit (rides along as ×N). */
  combo: number;
}

export interface BossHudProps {
  level?: number;
  name?: string;
  /** Current HP (small integer — hits, e.g. 5/8/10). */
  hp?: number;
  maxHp?: number;
  /** Portrait body theming per boss. */
  color?: string;
  edge?: string;
  shine?: string;
  /** Increment to trigger the jerk/flash + a floating −damage. */
  hitToken?: number;
  /** The hit to float when hitToken changes. */
  lastHit?: BossHit;
  tell?: BossTell | null;
  /** Show the "Combo ≥ ×2 để gây sát thương" reminder. Default true. */
  rule?: boolean;
  style?: React.CSSProperties;
}

/** Maps a combo multiplier to boss damage: ×2–3→1, ×4–6→2, ×7+→3, else 0. */
export function comboDamage(combo: number): number;

export function BossHud(props: BossHudProps): JSX.Element;
