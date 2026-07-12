import React from 'react';
import { Eyes } from '../02-eyes/Eyes.jsx';

/**
 * JellyBlock — the signature cell character: a rounded jelly cube with a
 * thick edge, glossy top sheen and a cute corner motif (star / leaf / heart
 * / droplet). The four coloured blocks now render from full-bleed PNG art
 * (frame, gloss and motif are baked into the image); we simply clip the
 * square corners with a matching border-radius. Googly eyes are still
 * overlaid on top so they can track gravity. The immovable "stone" cell is
 * still drawn natively.
 */

const PALETTE = {
  yellow: { fill: 'var(--color-block-yellow)', edge: 'var(--color-block-yellow-edge)', shine: 'var(--color-block-yellow-shine)' },
  mint:   { fill: 'var(--color-block-mint)',   edge: 'var(--color-block-mint-edge)',   shine: 'var(--color-block-mint-shine)' },
  pink:   { fill: 'var(--color-block-pink)',   edge: 'var(--color-block-pink-edge)',   shine: 'var(--color-block-pink-shine)' },
  blue:   { fill: 'var(--color-block-blue)',   edge: 'var(--color-block-blue-edge)',   shine: 'var(--color-block-blue-shine)' },
  stone:  { fill: 'var(--color-stone)',        edge: 'var(--color-stone-edge)',        shine: 'var(--color-stone-shine)' },
};

/* Resolve the design-system asset root from wherever _ds_bundle.js was
   loaded, so block art resolves the same on component cards, the index
   click-through, prototypes — any page depth. */
const DS_ASSET_ROOT = (() => {
  try {
    const cur = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) || '';
    const src = cur || (typeof document !== 'undefined'
      ? Array.from(document.querySelectorAll('script[src]')).map((s) => s.src).find((u) => /_ds_bundle\.js/.test(u))
      : '') || '';
    return src ? src.replace(/[^/]*_ds_bundle\.js.*$/, '') : '';
  } catch (e) {
    return '';
  }
})();

const BLOCK_IMG = {
  yellow: `${DS_ASSET_ROOT}06-svg-assets/blocks/jelly-yellow.jpg`,
  mint:   `${DS_ASSET_ROOT}06-svg-assets/blocks/jelly-mint.jpg`,
  pink:   `${DS_ASSET_ROOT}06-svg-assets/blocks/jelly-pink.jpg`,
  blue:   `${DS_ASSET_ROOT}06-svg-assets/blocks/jelly-blue.jpg`,
};

export function JellyBlock({
  color = 'yellow',
  size = 36,
  count = null,
  direction = 'down',
  showEyes = true,
  squashed = false,
  clearing = false,
  expression = 'normal',
  blink = false,
  connect = {},
  style = {},
}) {
  const pal = PALETTE[color] || PALETTE.yellow;
  const isStone = color === 'stone';
  const r = Math.max(6, Math.round(size * 0.20));
  // Every block stays fully rounded on all four corners — never squared.
  const radius = `${r}px`;

  const squash = squashed ? 'scale(1.08, 0.86)' : 'scale(1)';

  const base = {
    width: size,
    height: size,
    borderRadius: radius,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    overflow: 'hidden',
    boxShadow: clearing
      ? `0 0 0 4px ${pal.shine}, var(--shadow-md)`
      : 'var(--shadow-sm)',
    transform: clearing ? `${squash} scale(1.12)` : squash,
    opacity: clearing ? 0 : 1,
    filter: clearing ? 'brightness(1.6)' : 'none',
    transition:
      'transform var(--motion-fast,150ms) var(--ease-jelly,ease), opacity var(--motion-base,250ms) var(--ease-out,ease), filter var(--motion-base,250ms) var(--ease-out,ease)',
    ...style,
  };

  // Stone: immovable cell — still drawn natively (no art supplied).
  if (isStone) {
    return (
      <div
        style={{
          ...base,
          background: pal.fill,
          border: `var(--border-jelly, 3px) solid ${pal.edge}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: '12%',
            right: '12%',
            height: '34%',
            background: pal.shine,
            borderRadius: '50%',
            opacity: 0.85,
            filter: 'blur(0.5px)',
            pointerEvents: 'none',
          }}
        />
        <StoneFace size={size} />
      </div>
    );
  }

  // Coloured jelly blocks — full-bleed art, corners clipped by border-radius.
  return (
    <div
      style={{
        ...base,
        background: `url("${BLOCK_IMG[color] || BLOCK_IMG.yellow}") center / cover no-repeat, ${pal.fill}`,
      }}
    >
      {showEyes && (
        <Eyes direction={direction} blockSize={size} open={!squashed && !blink} expression={expression} />
      )}
    </div>
  );
}

/* Stone cells get a couple of pebble notches instead of a face. */
function StoneFace({ size }) {
  const d = Math.round(size * 0.12);
  return (
    <div style={{ display: 'flex', gap: d, opacity: 0.5 }}>
      <span style={{ width: d, height: d, borderRadius: '50%', background: 'var(--color-stone-edge)' }} />
      <span style={{ width: d, height: d, borderRadius: '50%', background: 'var(--color-stone-edge)' }} />
    </div>
  );
}
