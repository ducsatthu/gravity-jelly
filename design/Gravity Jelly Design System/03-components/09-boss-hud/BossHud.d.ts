import * as React from 'react';

/**
 * Boss UI cluster — Gravity Jelly (soft casual puzzle, NOT a combat/RPG HUD).
 *
 * Each boss has its OWN silhouette jelly mascot (never a shared circular avatar,
 * never boxed in a ring). Mascots are EYES-ONLY (no mouth/brows/teeth) — worm
 * (mint caterpillar + leaf sprouts), trash (lumpy brown bag + scraps/smell
 * clouds), water (waterfall-god column + streams + spinning ring).
 *
 * Pieces: BossCard (compact in-game/pre-boss card) · BossIntroCard (large
 * pre-level card + BOSS tag + orange CTA) · BossToast (warning pill) ·
 * BossMascot / ShieldBar (building blocks). Purple only as tag/glow/hairline;
 * progress is a "Khiên" (shield) bar, never HP hearts.
 */

export type BossKind = 'worm' | 'trash' | 'water';
export type ChipTone = 'rule' | 'trash' | 'gravity';
export type ChipKind = 'x2' | 'shield' | 'leaf' | 'gravity';

export interface ShieldProgress {
  /** Shields broken so far. */
  current: number;
  /** Total shields to break. */
  target: number;
}

export interface BossChip {
  kind: ChipKind;
  tone: ChipTone;
  /** 'rule' → calm guide look (how to break shields; muted purple disc) ·
   *  'tell' → coloured alert with a pulsing dot (what the boss is about to do).
   *  No word label — the icon + colour carry the meaning. Default 'tell'. */
  role?: 'rule' | 'tell';
  label: string;
}

export interface BossThemeProps {
  /** 'worm' · 'trash' · 'water' — selects the silhouette + default palette. */
  kind?: BossKind;
  /** Override the jelly body fill / edge / gloss. */
  color?: string;
  edge?: string;
  shine?: string;
}

export interface BossMascotProps {
  /** 'worm' · 'trash' · 'water' — selects which supplied artwork to draw. */
  kind?: BossKind;
  /** Display HEIGHT in px (width follows the art's aspect). Defaults per kind. */
  size?: number;
  /** Full image URL override. */
  src?: string;
  /** Path to /06-svg-assets/bosses/ relative to the page. Defaults to a
   *  component card two levels deep ('../../06-svg-assets/bosses/'). */
  assetBase?: string;
  style?: React.CSSProperties;
}

/** One boss silhouette, drawn from the supplied PNG art (no ring frame). */
export function BossMascot(props: BossMascotProps): JSX.Element;

export interface ShieldBarProps {
  current?: number;
  target?: number;
  color?: string;
  edge?: string;
  height?: number;
}

/** Thin shield-progress bar (sunken track, boss-coloured fill). */
export function ShieldBar(props: ShieldBarProps): JSX.Element;

export interface BossCardProps extends BossThemeProps {
  level?: number;
  name?: string;
  /** Path to /06-svg-assets/bosses/ relative to the page. */
  assetBase?: string;
  shield?: ShieldProgress;
  /** Rule / tell chip (null to hide). */
  chip?: BossChip | null;
  style?: React.CSSProperties;
}

/** Compact in-game / pre-boss card — mascot overflows the left, text right. */
export function BossCard(props: BossCardProps): JSX.Element;

/** Alias of BossCard (kept for back-compat with the old cluster export). */
export const BossHud: typeof BossCard;

export interface BossIntroCardProps extends BossThemeProps {
  level?: number;
  name?: string;
  /** Path to /06-svg-assets/bosses/ relative to the page. */
  assetBase?: string;
  shield?: ShieldProgress;
  /** The rule chip, e.g. { kind:'x2', tone:'rule', label:'Combo ×2 phá khiên' }. */
  rule?: BossChip;
  playLabel?: string;
  onPlay?: () => void;
  style?: React.CSSProperties;
}

/** Large pre-level boss intro card (BOSS tag + orange CTA). */
export function BossIntroCard(props: BossIntroCardProps): JSX.Element;

export interface BossToastProps {
  /** Mechanic icon: 'trash' (leaf) · 'gravity' (rotate) · 'shield'. */
  kind?: 'trash' | 'gravity' | 'shield';
  tone?: ChipTone;
  label?: string;
  /** Deprecated — no word kicker is rendered any more. */
  kicker?: string;
  style?: React.CSSProperties;
}

/**
 * BossToast — a WARNING pill: what the boss is about to do (a tell), e.g.
 * "Lượt sau: Đổ rác" / "Sau 2 lượt: Đảo trọng lực". Alert-styled (coloured
 * border + gentle bob + a small pulsing danger dot on the icon disc) so it
 * reads as a warning WITHOUT a "CẢNH BÁO" label. Do NOT put shield rules here.
 */
export function BossToast(props: BossToastProps): JSX.Element;

export interface BossRuleProps {
  label?: string;
  /** Deprecated — no word kicker is rendered any more. */
  kicker?: string;
  /** Leading glyph: 'x2' (combo) or 'shield'. */
  icon?: 'x2' | 'shield';
  style?: React.CSSProperties;
}

/**
 * BossRule — a CẨM NANG (guide) item: HOW to break the boss's shields, e.g.
 * "Combo ×2 phá khiên". Deliberately calm (sunken surface, no alert border, no
 * bob) so it never reads as a boss action — the independent counterpart to
 * BossToast.
 */
export function BossRule(props: BossRuleProps): JSX.Element;
