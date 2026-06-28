import React from 'react';
import { JellyBlock } from '../../02-foundations/01-jelly-block/JellyBlock.jsx';

/**
 * JellyScene — the decorative "garden stage" that dresses the band below the
 * board: a jelly dish/plate (the surface cleared blocks tumble into), grassy
 * ground, mushrooms, plants, a swaying flower and a few resident jelly
 * characters. Fills its positioned parent (position:absolute, inset:0).
 *
 *   showDish  render the catching dish/plate (default false — the game has no dish)
 *   showCast  render the resident jelly characters (default true)
 *   band      paint a soft band background behind the scene (default true)
 */
export function JellyScene({ showDish = false, showCast = true, band = true, style = {} }) {
  const orb = (s) => <div style={{ position: 'absolute', borderRadius: '50%', boxShadow: 'inset 5px -5px 0 rgba(255,255,255,0.38)', ...s }} />;
  const blade = (s) => <div style={{ position: 'absolute', width: 6, borderRadius: '3px 3px 2px 2px', background: 'linear-gradient(180deg,var(--color-block-mint-shine),var(--color-block-mint))', transformOrigin: 'bottom center', ...s }} />;
  const bush = (left, sc, col) => (
    <div style={{ position: 'absolute', left, bottom: 14, width: 56 * sc, height: 30 * sc, filter: 'drop-shadow(0 3px 2px rgba(120,92,52,0.12))' }}>
      {orb({ left: 0, bottom: 0, width: 24 * sc, height: 24 * sc, background: `var(--color-block-${col})`, opacity: 0.92 })}
      {orb({ left: 16 * sc, bottom: 2, width: 30 * sc, height: 30 * sc, background: `var(--color-block-${col}-shine)` })}
      {orb({ left: 34 * sc, bottom: 0, width: 22 * sc, height: 22 * sc, background: `var(--color-block-${col})`, opacity: 0.92 })}
    </div>
  );
  const mushroom = (pos, w, col) => (
    <div style={{ position: 'absolute', bottom: 13, ...pos, width: w, height: w * 1.05, filter: 'drop-shadow(0 3px 2px rgba(120,92,52,0.14))' }}>
      <div style={{ position: 'absolute', left: w * 0.32, bottom: 0, width: w * 0.36, height: w * 0.5, borderRadius: '5px 5px 7px 7px', background: 'linear-gradient(180deg,#FCF1DC,#F3E3C4)' }} />
      <div style={{ position: 'absolute', left: 0, bottom: w * 0.36, width: w, height: w * 0.6, borderRadius: '50% 50% 42% 42% / 84% 84% 26% 26%', background: `linear-gradient(180deg,var(--color-block-${col}-shine),var(--color-block-${col}))`, boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.45)' }} />
      <div style={{ position: 'absolute', left: w * 0.24, bottom: w * 0.62, width: w * 0.16, height: w * 0.16, borderRadius: '50%', background: 'rgba(255,255,255,0.8)' }} />
      <div style={{ position: 'absolute', left: w * 0.56, bottom: w * 0.52, width: w * 0.12, height: w * 0.12, borderRadius: '50%', background: 'rgba(255,255,255,0.8)' }} />
    </div>
  );
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 18, background: band ? 'linear-gradient(180deg,#FFFCF5 0%, var(--color-bg) 60%)' : 'transparent', ...style }}>
      <style>{`@keyframes gj-scn-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes gj-scn-sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@media (prefers-reduced-motion: reduce){.gj-scn-fl,.gj-scn-sw{animation:none!important}}`}</style>

      {/* layered hills for depth */}
      <div style={{ position: 'absolute', left: '32%', bottom: 14, width: '46%', height: 32, borderRadius: '50% 50% 0 0 / 100% 100% 0 0', background: 'linear-gradient(180deg,#DCEFD4,#C6E4BD)' }} />
      <div style={{ position: 'absolute', left: '-8%', bottom: 14, width: '58%', height: 44, borderRadius: '50% 50% 0 0 / 100% 100% 0 0', background: 'linear-gradient(180deg,#E6F3E2,#D3EACE)' }} />
      <div style={{ position: 'absolute', right: '-10%', bottom: 14, width: '54%', height: 38, borderRadius: '50% 50% 0 0 / 100% 100% 0 0', background: 'linear-gradient(180deg,#EAF1FA,#DAE6F4)' }} />

      {/* ground + grass line */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 16, background: 'linear-gradient(180deg,#F1E4CB,#E8D6B6)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 15, height: 3, background: 'rgba(150,170,120,0.45)' }} />

      {/* grass tufts */}
      {blade({ left: '4%', bottom: 13, height: 16, transform: 'rotate(-12deg)' })}
      {blade({ left: '6%', bottom: 13, height: 22 })}
      {blade({ left: '8%', bottom: 13, height: 15, transform: 'rotate(12deg)' })}
      {blade({ left: '90%', bottom: 13, height: 14, transform: 'rotate(-10deg)' })}
      {blade({ left: '92%', bottom: 13, height: 19 })}

      {/* left plants: bush + swaying flower */}
      {bush('5%', 0.9, 'mint')}
      <div className="gj-scn-sw" style={{ position: 'absolute', left: '20%', bottom: 14, width: 26, height: 40, transformOrigin: 'bottom center', animation: 'gj-scn-sway 4.2s ease-in-out infinite', filter: 'drop-shadow(0 2px 2px rgba(120,92,52,0.12))' }}>
        <div style={{ position: 'absolute', left: 11, bottom: 0, width: 4, height: 26, borderRadius: 3, background: 'linear-gradient(180deg,var(--color-block-mint-shine),var(--color-block-mint))' }} />
        <div style={{ position: 'absolute', left: 2, bottom: 10, width: 9, height: 7, borderRadius: '0 60% 60% 60%', background: 'var(--color-block-mint)', transform: 'rotate(20deg)' }} />
        <div style={{ position: 'absolute', left: 14, bottom: 14, width: 9, height: 7, borderRadius: '60% 0 60% 60%', background: 'var(--color-block-mint)', transform: 'rotate(-20deg)' }} />
        <div style={{ position: 'absolute', left: 4, bottom: 22, width: 18, height: 16, borderRadius: '50% 50% 46% 46% / 64% 64% 36% 36%', background: 'linear-gradient(180deg,var(--color-block-pink-shine),var(--color-block-pink))', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.5)' }} />
        <div style={{ position: 'absolute', left: 10, bottom: 27, width: 6, height: 6, borderRadius: '50%', background: 'var(--color-block-yellow)' }} />
      </div>

      {/* right plants: mushrooms + bush */}
      {mushroom({ right: '20%' }, 28, 'pink')}
      {mushroom({ right: '11%' }, 20, 'yellow')}
      {bush('80%', 0.8, 'mint')}

      {/* the jelly dish / plate — the surface blocks tumble into */}
      {showDish && (
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 150, height: 34 }}>
          <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', width: 150, height: 30, borderRadius: '50%', background: 'linear-gradient(180deg,#FBEFD8,#ECD9B4)', border: '2px solid #E2C896', boxShadow: '0 4px 7px rgba(120,92,52,0.22)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 1, transform: 'translateX(-50%)', width: 124, height: 19, borderRadius: '50%', background: 'radial-gradient(120% 140% at 50% 18%, #E7D2A6, #D8BE8A)', boxShadow: 'inset 0 4px 5px rgba(120,92,52,0.28), inset 0 -2px 0 rgba(255,255,255,0.4)' }} />
        </div>
      )}

      {/* resident jelly characters flanking the dish */}
      {showCast && (
        <React.Fragment>
          <div style={{ position: 'absolute', left: '13%', bottom: 19, filter: 'drop-shadow(0 4px 3px rgba(120,92,52,0.16))' }}><JellyBlock color="pink" size={22} showEyes /></div>
          <div style={{ position: 'absolute', right: '30%', bottom: 18, filter: 'drop-shadow(0 4px 3px rgba(120,92,52,0.16))' }}><JellyBlock color="blue" size={24} showEyes /></div>
        </React.Fragment>
      )}

      {/* drifting orbs + sparkles */}
      <div className="gj-scn-fl" style={{ position: 'absolute', left: '28%', bottom: 54, animation: 'gj-scn-float 3.6s ease-in-out infinite' }}>{orb({ position: 'relative', width: 12, height: 12, background: 'var(--color-block-yellow)', opacity: 0.55 })}</div>
      <div className="gj-scn-fl" style={{ position: 'absolute', left: '84%', bottom: 50, animation: 'gj-scn-float 4.4s ease-in-out infinite' }}>{orb({ position: 'relative', width: 14, height: 14, background: 'var(--color-block-pink)', opacity: 0.5 })}</div>
      <div style={{ position: 'absolute', left: '46%', top: 10, width: 6, height: 6, borderRadius: '50%', background: 'var(--color-block-yellow-shine)', opacity: 0.7 }} />
      <div style={{ position: 'absolute', left: '70%', top: 8, width: 4, height: 4, borderRadius: '50%', background: 'var(--color-block-pink-shine)', opacity: 0.7 }} />
    </div>
  );
}
