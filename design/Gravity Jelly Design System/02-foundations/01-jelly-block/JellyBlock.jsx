import React from 'react';
import { Eyes } from '../02-eyes/Eyes.jsx';

/**
 * JellyBlock — the signature cell character: a rounded jelly cube with a
 * thick edge, glossy top sheen, and googly eyes that track gravity. Each
 * color carries a cute corner sticker (star / leaf / heart / droplet) so
 * blocks are recognizable by motif, not just hue. Also renders the
 * immovable "stone" cell.
 */

const PALETTE = {
  yellow: { fill: 'var(--color-block-yellow)', edge: 'var(--color-block-yellow-edge)', shine: 'var(--color-block-yellow-shine)' },
  mint:   { fill: 'var(--color-block-mint)',   edge: 'var(--color-block-mint-edge)',   shine: 'var(--color-block-mint-shine)' },
  pink:   { fill: 'var(--color-block-pink)',   edge: 'var(--color-block-pink-edge)',   shine: 'var(--color-block-pink-shine)' },
  blue:   { fill: 'var(--color-block-blue)',   edge: 'var(--color-block-blue-edge)',   shine: 'var(--color-block-blue-shine)' },
  stone:  { fill: 'var(--color-stone)',        edge: 'var(--color-stone-edge)',        shine: 'var(--color-stone-shine)' },
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
  const r = Math.max(6, Math.round(size * 0.28));
  // Every block stays fully rounded on all four corners — never squared.
  const radius = `${r}px`;

  const squash = squashed ? 'scale(1.08, 0.86)' : 'scale(1)';

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: pal.fill,
        border: `var(--border-jelly, 3px) solid ${pal.edge}`,
        boxShadow: clearing
          ? `0 0 0 4px ${pal.shine}, var(--shadow-md)`
          : 'var(--shadow-sm)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Math.round(size * 0.04),
        boxSizing: 'border-box',
        overflow: 'hidden',
        transform: clearing ? `${squash} scale(1.12)` : squash,
        opacity: clearing ? 0 : 1,
        filter: clearing ? 'brightness(1.6)' : 'none',
        transition:
          'transform var(--motion-fast,150ms) var(--ease-jelly,ease), opacity var(--motion-base,250ms) var(--ease-out,ease), filter var(--motion-base,250ms) var(--ease-out,ease)',
        ...style,
      }}
    >
      {/* glossy top sheen */}
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
      {isStone ? (
        <StoneFace size={size} />
      ) : (
        showEyes && (
          <>
            <Eyes direction={direction} blockSize={size} open={!squashed && !blink} expression={expression} />
            {!squashed && <Sticker color={color} size={size} />}
          </>
        )
      )}
    </div>
  );
}

/* Each color carries its own cute sticker — a little decal in the top
   corner so blocks are recognizable by motif, not just hue (and friendlier
   for colorblind play). Star / clover-leaf / heart / droplet. */
function Sticker({ color = 'yellow', size = 36 }) {
  const pal = PALETTE[color] || PALETTE.yellow;
  const s = Math.round(size * 0.36);
  const glyph = {
    yellow: <path d="M12 2.4l2.7 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.4 6.3 19.5l1.4-6.3L2.9 8.9l6.4-.6z" />,                 /* star */
    mint:   <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zm3.5-3.5C13 14 16 11 17 7" />,                                    /* leaf */
    pink:   <path d="M12 20.7l-1.5-1.4C5.4 14.6 2 11.5 2 7.8 2 5.1 4.1 3 6.8 3 8.3 3 9.8 3.8 12 6 14.2 3.8 15.7 3 17.2 3 19.9 3 22 5.1 22 7.8c0 3.7-3.4 6.8-8.5 11.5z" />,  /* heart */
    blue:   <path d="M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z" />,                                              /* droplet */
  }[color];
  if (!glyph) return null;
  const stroked = color === 'mint';
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: Math.round(size * 0.07),
        right: Math.round(size * 0.07),
        transform: 'rotate(-12deg)',
        fill: stroked ? 'none' : pal.shine,
        stroke: pal.edge,
        strokeWidth: stroked ? 2.2 : 1.6,
        strokeLinejoin: 'round',
        strokeLinecap: 'round',
        filter: 'drop-shadow(0 1px 0.5px rgba(90,70,54,0.25))',
        pointerEvents: 'none',
      }}
    >
      {glyph}
    </svg>
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
