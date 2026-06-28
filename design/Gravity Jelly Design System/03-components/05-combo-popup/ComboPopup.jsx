import React from 'react';

/**
 * ComboPopup — the clear-celebration callout. On every clear a few little
 * jelly pieces TUMBLE DOWN and bounce into a dish at the bottom (the dish
 * "catches" the jelly you broke). When the clear is a chain (combo > 1) a big
 * multi-colour ×N + praise word also bursts in above. Pieces fall and the
 * text appears even for a plain single clear — pass combo={1}.
 *
 * Render only while `visible`; remount with a changing `key` to replay it.
 *   combo    chain length (text shows when > 1; more/denser jelly as it grows)
 *   pieces   override the number of falling jelly pieces
 *   colors   override the fall colours (array of 'yellow'|'mint'|'pink'|'blue')
 *   showDish render the catching dish (default true)
 *   height   vertical room for the fall (default 120)
 */
const COLORS = ['yellow', 'mint', 'pink', 'blue'];
const JELLY = ['#FF6FA5', '#FF9F45', '#FFC24B', '#5FC98A', '#3FB6C9', '#6FA8FF', '#B98CFF'];

const TIERS = [
  { min: 9, word: 'CUỒNG NHIỆT!', color: '#FF5470', grad: 'linear-gradient(95deg,#FF5470,#FF9F45,#FFC24B,#FF5470)', num: 34, stars: 3 },
  { min: 7, word: 'AMAZING!',     color: '#FF7A3C', grad: 'linear-gradient(95deg,#FF7A3C,#FFC24B,#FF6FA5,#FF7A3C)', num: 32, stars: 2 },
  { min: 5, word: 'XUẤT SẮC!',    color: '#F0A92E', grad: 'linear-gradient(95deg,#FFC24B,#5FC98A,#6FA8FF,#FFC24B)', num: 30, stars: 2 },
  { min: 4, word: 'HOÀN HẢO!',    color: '#3FA86A', grad: 'linear-gradient(95deg,#5FC98A,#3FB6C9,#6FA8FF,#5FC98A)', num: 29, stars: 1 },
  { min: 2, word: 'TUYỆT VỜI!',   color: '#6E7BF0', grad: 'linear-gradient(95deg,#6FA8FF,#B98CFF,#FF6FA5,#6FA8FF)', num: 28, stars: 0 },
  { min: 0, word: 'TỐT!',         color: '#8A6BF0', grad: 'linear-gradient(95deg,#B98CFF,#6FA8FF,#5FC98A,#B98CFF)', num: 26, stars: 0 },
];

const WHITE_OUTLINE = '0 1px 0 #fff,0 -1px 0 #fff,1px 0 0 #fff,-1px 0 0 #fff,1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff,0 3px 2px rgba(120,92,52,0.28)';

/* a small glossy jelly cube — the falling piece (no eyes, just candy). */
function MiniJelly({ color = 'yellow', size = 18 }) {
  const r = Math.max(4, Math.round(size * 0.3));
  return (
    <div style={{ width: size, height: size, borderRadius: r, background: `var(--color-block-${color})`, border: `2px solid var(--color-block-${color}-edge)`, boxShadow: '0 2px 3px rgba(120,92,52,0.22), inset 0 -2px 0 rgba(0,0,0,0.08)', position: 'relative', boxSizing: 'border-box' }}>
      <span style={{ position: 'absolute', top: 1, left: '16%', right: '16%', height: '36%', borderRadius: '50%', background: `var(--color-block-${color}-shine)`, opacity: 0.9 }} />
    </div>
  );
}

export function ComboPopup({ combo = 2, praise, colors, pieces, showDish = true, showPieces = true, showText = true, floor = 16, height = 120, label = 'COMBO', visible = true, animate = true, style = {} }) {
  if (!visible) return null;
  const tier = TIERS.find((t) => combo >= t.min) || TIERS[TIERS.length - 1];
  const word = praise || tier.word;
  const hasText = combo > 1 && showText;

  // how many jelly pieces rain down — more for bigger chains, min 3 on a plain clear
  const n = pieces != null ? pieces : Math.max(3, Math.min(9, combo + 2));
  const dishW = 150;
  const fh = Math.round(height - floor - 26);  // fall distance

  const drops = Array.from({ length: n }).map((_, i) => {
    const t = n > 1 ? i / (n - 1) : 0.5;
    const jit = (i % 2 ? 1 : -1) * (4 + (i % 3) * 3);
    const x = Math.round((t - 0.5) * (dishW - 44) + jit);   // spread across the dish
    const col = colors ? colors[i % colors.length] : COLORS[(i * 3 + 1) % COLORS.length];
    return {
      x, col,
      size: 16 + (i % 3) * 3,
      r0: ((i * 53) % 80) - 40,
      r1: ((i * 29) % 22) - 11,
      delay: i * 58,
    };
  });

  const anim = (s) => (animate ? s : 'none');
  const wordLetters = [...word].map((ch, i) => (ch === ' ' ? <span key={i}>&nbsp;</span> : <span key={i} style={{ color: JELLY[i % JELLY.length] }}>{ch}</span>));

  return (
    <div style={{ position: 'relative', width: dishW + 24, height, pointerEvents: 'none', ...style }}>
      <style>{`
        @keyframes gj-cb-pop{0%{transform:translateX(-50%) scale(.3) rotate(-8deg);opacity:0}45%{transform:translateX(-50%) scale(1.16) rotate(3deg);opacity:1}70%{transform:translateX(-50%) scale(.96) rotate(-1deg)}100%{transform:translateX(-50%) scale(1) rotate(0);opacity:1}}
        @keyframes gj-cb-num{0%{transform:scale(1)}40%{transform:scale(1.2)}100%{transform:scale(1)}}
        @keyframes gj-cb-hue{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes gj-drop{
          0%{transform:translateY(calc(-1 * var(--fh))) rotate(var(--r0));opacity:0;animation-timing-function:cubic-bezier(.55,0,.9,.45)}
          9%{opacity:1}
          60%{transform:translateY(0) rotate(var(--r1));animation-timing-function:ease-out}
          73%{transform:translateY(-13px) rotate(var(--r1));animation-timing-function:ease-in}
          85%{transform:translateY(0) rotate(var(--r1));animation-timing-function:ease-out}
          93%{transform:translateY(-4px) rotate(var(--r1))}
          100%{transform:translateY(0) rotate(var(--r1))}
        }
        @keyframes gj-squash{0%,57%{transform:scaleY(1) scaleX(1)}63%{transform:scaleY(.68) scaleX(1.2)}73%{transform:scaleY(1.08) scaleX(.92)}85%{transform:scaleY(.95) scaleX(1.05)}100%{transform:scaleY(1) scaleX(1)}}
        @keyframes gj-dish-bob{0%{transform:translateX(-50%) translateY(0)}30%{transform:translateX(-50%) translateY(2px)}100%{transform:translateX(-50%) translateY(0)}}
        @media (prefers-reduced-motion: reduce){.gj-cb-anim{animation:none!important}}
      `}</style>

      {/* combo text — only on a chain */}
      {hasText && (
        <div className="gj-cb-anim" style={{ position: 'absolute', top: 0, left: '50%', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 1, transform: 'translateX(-50%)', animation: anim('gj-cb-pop 520ms cubic-bezier(.34,1.56,.64,1) both'), whiteSpace: 'nowrap' }}>
          {/* soft glow for legibility */}
          <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '46%', width: 150, height: 64, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(closest-side, color-mix(in srgb, ${tier.color} 24%, transparent), transparent 72%)`, filter: 'blur(4px)' }} />
          {/* rainbow ×N with white cartoon outline */}
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline', gap: 1, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-extra)', lineHeight: 1, animation: anim('gj-cb-num 520ms ease-out 100ms both') }}>
            <span aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'inline-flex', alignItems: 'baseline', gap: 1, color: 'transparent', WebkitTextStroke: '3px #fff', paintOrder: 'stroke', filter: 'drop-shadow(0 3px 2px rgba(120,92,52,0.3))' }}>
              <span style={{ fontSize: tier.num * 0.62 }}>×</span><span style={{ fontSize: tier.num }}>{combo}</span>
            </span>
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline', gap: 1, background: tier.grad, backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent', animation: anim('gj-cb-hue 2.4s linear infinite') }}>
              <span style={{ fontSize: tier.num * 0.62, opacity: 0.92 }}>×</span><span style={{ fontSize: tier.num }}>{combo}</span>
            </span>
          </span>
          {/* per-letter coloured praise word */}
          <span style={{ display: 'inline-flex', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-extra)', fontSize: Math.round(tier.num * 0.44), letterSpacing: '0.5px', lineHeight: 1, textShadow: WHITE_OUTLINE }}>
            {tier.stars > 0 && <span style={{ color: '#FFC24B', marginRight: 3 }}>✦</span>}
            {wordLetters}
            {tier.stars > 0 && <span style={{ color: '#FFC24B', marginLeft: 3 }}>✦</span>}
          </span>
        </div>
      )}

      {/* the dish that catches the jelly (skip when dropping into an existing scene) */}
      {showDish && showPieces && (
        <div className="gj-cb-anim" style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: dishW, height: 32, animation: anim('gj-dish-bob 460ms ease-out 360ms both') }}>
          <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', width: dishW, height: 30, borderRadius: '50%', background: 'linear-gradient(180deg,#FBEFD8,#ECD9B4)', border: '2px solid #E2C896', boxShadow: '0 4px 7px rgba(120,92,52,0.22)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 1, transform: 'translateX(-50%)', width: dishW - 26, height: 19, borderRadius: '50%', background: 'radial-gradient(120% 140% at 50% 18%, #E7D2A6, #D8BE8A)', boxShadow: 'inset 0 4px 5px rgba(120,92,52,0.28), inset 0 -2px 0 rgba(255,255,255,0.4)' }} />
        </div>
      )}

      {/* falling jelly pieces — happen on EVERY clear */}
      {showPieces && drops.map((d, i) => (
        <div key={i} style={{ position: 'absolute', bottom: floor, left: `calc(50% + ${d.x}px)` }}>
          <div className="gj-cb-anim" style={{ ['--fh']: fh + 'px', ['--r0']: d.r0 + 'deg', ['--r1']: d.r1 + 'deg', transform: 'translateY(0) rotate(' + d.r1 + 'deg)', animation: anim(`gj-drop 660ms ${d.delay}ms both`) }}>
            <div className="gj-cb-anim" style={{ transformOrigin: 'bottom center', animation: anim(`gj-squash 660ms ${d.delay}ms both`) }}>
              <MiniJelly color={d.col} size={d.size} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
