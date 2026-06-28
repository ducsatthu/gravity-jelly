import * as React from 'react';
import { JellyColor } from '../../02-foundations/01-jelly-block/JellyBlock';

export interface TrayPieceModel {
  /** Occupied cells as [row, col] pairs (any origin; auto-normalized). */
  cells: [number, number][];
  color: JellyColor;
  /** Cluster size carried as data (not drawn). */
  count?: number;
}

/**
 * The 112dp bottom dock of 3 draggable upcoming pieces. Slots auto-scale each
 * piece to fit, so any shape from 4 to 6 cells (incl. a 1×6 bar) displays.
 */
export interface TrayProps {
  /** Exactly 3 entries; null = already-placed/empty slot. */
  pieces?: (TrayPieceModel | null)[];
  /** Index of the lifted/selected piece, or -1. */
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  style?: React.CSSProperties;
}

export function Tray(props: TrayProps): JSX.Element;

export interface TrayPieceProps {
  piece: TrayPieceModel | null;
  /** Force a fixed cell size (px) — Tray passes its shared size. */
  cell?: number;
  /** Target box (px) the piece is scaled to fit when `cell` is unset. Default 80. */
  fit?: number;
  /** Gap between cells in px. Default 2. */
  gap?: number;
  /** Cap on auto-fit cell size in px so small pieces don't balloon. Default 22. */
  maxCell?: number;
}

/** Renders a single piece, auto-scaled to fit `fit`. Used inside Tray. */
export function TrayPiece(props: TrayPieceProps): JSX.Element;
