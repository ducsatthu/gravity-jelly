import React from 'react';
import { JellyBlock } from '../../02-foundations/01-jelly-block/JellyBlock.jsx';

/**
 * Tray — the 112dp bottom dock holding the 3 upcoming pieces to drag onto the
 * board. All slots share ONE cell size (driven by the largest piece present,
 * clamped 12–22dp), so the dock never mixes huge and tiny cells. Any shape
 * from 1 to 9 cells fits. The selected slot lifts and gets a focus ring.
 *
 * A piece: { cells: [[row,col], ...], color, count }
 */

function cellConnect(cells, r, c) {
  const has = (rr, cc) => cells.some(([a, b]) => a === rr && b === cc);
  return { top: has(r - 1, c), right: has(r, c + 1), bottom: has(r + 1, c), left: has(r, c - 1) };
}

export function TrayPiece({ piece, cell, fit = 80, gap = 2, maxCell = 22 }) {
  if (!piece) return null;
  const rows = piece.cells.map(([r]) => r);
  const cols = piece.cells.map(([, c]) => c);
  const minR = Math.min(...rows), maxR = Math.max(...rows);
  const minC = Math.min(...cols), maxC = Math.max(...cols);
  const nC = maxC - minC + 1, nR = maxR - minR + 1;
  // Either honor an explicit shared cell, or shrink to fit the slot box.
  const useCell = cell != null
    ? cell
    : Math.min(maxCell, Math.floor((fit - (nC - 1) * gap) / nC), Math.floor((fit - (nR - 1) * gap) / nR));
  const w = nC * useCell + (nC - 1) * gap;
  const h = nR * useCell + (nR - 1) * gap;
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      {piece.cells.map(([r, c], i) => (
        <div key={i} style={{ position: 'absolute', left: (c - minC) * (useCell + gap), top: (r - minR) * (useCell + gap) }}>
          <JellyBlock color={piece.color} size={useCell} count={piece.count} showEyes={false} connect={cellConnect(piece.cells, r, c)} />
        </div>
      ))}
    </div>
  );
}

// One cell size for the whole tray: driven by the largest piece present and
// clamped to a comfortable range, so slots never mix huge and tiny cells.
function sharedCellSize(pieces, fit = 80, gap = 2, min = 12, max = 22) {
  let maxDim = 1;
  pieces.forEach((p) => {
    if (!p) return;
    const rs = p.cells.map(([r]) => r), cs = p.cells.map(([, c]) => c);
    maxDim = Math.max(maxDim, Math.max(...rs) - Math.min(...rs) + 1, Math.max(...cs) - Math.min(...cs) + 1);
  });
  return Math.max(min, Math.min(max, Math.floor((fit - (maxDim - 1) * gap) / maxDim)));
}

export function Tray({ pieces = [null, null, null], selectedIndex = -1, onSelect, style = {} }) {
  const slots = [0, 1, 2];
  const cell = sharedCellSize(pieces);
  return (
    <div
      style={{
        height: 'var(--dim-tray-h)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 'var(--space-sm)',
        padding: 'var(--space-sm) var(--space-md) 0',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
        boxShadow: '0 -6px 18px var(--color-shadow-soft)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {slots.map((i) => {
        const piece = pieces[i];
        const selected = selectedIndex === i && piece;
        return (
          <button
            key={i}
            type="button"
            onClick={() => piece && onSelect && onSelect(i)}
            aria-label={piece ? `Mảnh ${i + 1}` : 'Ô trống'}
            style={{
              position: 'relative',
              width: 'var(--dim-tray-slot)',
              height: 'var(--dim-tray-slot)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              background: selected ? 'var(--color-surface-sunken)' : 'transparent',
              boxShadow: selected ? 'inset 0 0 0 var(--border-bold) var(--color-primary)' : 'none',
              transform: selected ? 'translateY(-6px)' : 'translateY(0)',
              opacity: piece ? 1 : 0.35,
              transition: 'transform var(--motion-base) var(--ease-jelly), box-shadow var(--motion-fast) var(--ease-out)',
              cursor: piece ? 'grab' : 'default',
            }}
          >
            {/* selection marker — sits ABOVE the dock edge so it is never
                clipped by the rounded top corners (decoration outside the border). */}
            {selected && (
              <span aria-hidden="true" style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid var(--color-primary)', filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.6))' }} />
            )}
            {piece
              ? <TrayPiece piece={piece} cell={cell} />
              : <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', border: '2px dashed var(--color-cell-line)' }} />}
          </button>
        );
      })}
    </div>
  );
}
