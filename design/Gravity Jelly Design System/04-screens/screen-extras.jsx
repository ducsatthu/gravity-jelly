/* screen-extras.jsx — extra glyphs + shared bits the base Icon set doesn't
   cover (lock, clock, gift, coin, bomb, crown, target, calendar, plus,
   filled star, ad badge, coin chip, star row). Exposes window.GJExtras.
   Lucide-style 24x24, 2px round stroke to match the DS Icon. */

(function () {
  const T = '#5B4636';            // primary cocoa
  const base = (size, color, sw) => ({
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: sw || 2, strokeLinecap: 'round', strokeLinejoin: 'round',
  });

  const Lock = ({ size = 24, color = T }) => (
    <svg {...base(size, color)}><rect x="4.5" y="10.5" width="15" height="10" rx="3" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /><circle cx="12" cy="15" r="1.3" fill={color} stroke="none" /></svg>
  );
  const Clock = ({ size = 24, color = T }) => (
    <svg {...base(size, color)}><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></svg>
  );
  const Gift = ({ size = 24, color = T }) => (
    <svg {...base(size, color)}><rect x="3.5" y="9" width="17" height="11.5" rx="2.5" /><path d="M3.5 13.5h17M12 9v11.5" /><path d="M12 9C12 5.5 9 4 7.5 5.5S8.5 9 12 9zM12 9c0-3.5 3-5 4.5-3.5S15.5 9 12 9z" /></svg>
  );
  const Plus = ({ size = 24, color = T }) => (
    <svg {...base(size, color, 2.4)}><path d="M12 6v12M6 12h12" /></svg>
  );
  const Target = ({ size = 24, color = T }) => (
    <svg {...base(size, color)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.3" fill={color} stroke="none" /></svg>
  );
  const Calendar = ({ size = 24, color = T }) => (
    <svg {...base(size, color)}><rect x="4" y="5.5" width="16" height="15" rx="3" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></svg>
  );
  const Bomb = ({ size = 24, color = T }) => (
    <svg {...base(size, color)}><circle cx="10.5" cy="14.5" r="6.5" /><path d="M15 10l2.4-2.4M17.5 7.5l1.3.4M17.5 7.5l-.4-1.3M19.5 5.5l1.5-1.5" /></svg>
  );
  const Crown = ({ size = 24, color = '#FFCA66' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"><path d="M3.5 18l-1-9 5 3.5L12 5l4.5 7.5 5-3.5-1 9z" fill={color} stroke="#E2A82E" strokeWidth="1.6" strokeLinejoin="round" /><path d="M3.5 18h17" stroke="#E2A82E" strokeWidth="1.6" strokeLinecap="round" /></svg>
  );
  const Coin = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12.6" r="9.4" fill="#E2A02A" /><circle cx="12" cy="11.4" r="9.4" fill="#FFC24B" /><circle cx="12" cy="11.4" r="6.6" fill="#FFD988" /><path d="M12 7.4l1.5 3 3.3.5-2.4 2.3.6 3.3L12 18l-3-1.5.6-3.3-2.4-2.3 3.3-.5z" fill="#E2A02A" opacity="0.5" /></svg>
  );
  const FilledStar = ({ size = 24, earned = true }) => (
    <svg width={size} height={size} viewBox="0 0 100 100"><path d="M50 8 L61.8 35.1 L91 38 L68.5 57.8 L75.3 86.4 L50 71 L24.7 86.4 L31.5 57.8 L9 38 L38.2 35.1 Z" fill={earned ? '#FFCA66' : '#F4E9D8'} stroke={earned ? '#E2A82E' : '#D8C7AC'} strokeWidth="6" strokeLinejoin="round" />{earned && <path d="M40 30 L50 22 L60 30" fill="none" stroke="#FFF0C4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />}</svg>
  );

  // a row of 3 stars; `earned` = how many are gold, others sunken. The middle
  // star sits a touch higher (classic match-3 win flourish).
  function Stars({ earned = 0, size = 40, gap = 4, lift = true, animate = false }) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ marginBottom: lift && i === 1 ? size * 0.18 : 0, transform: `scale(${i === 1 ? 1.18 : 1})`, transformOrigin: 'bottom center', animation: animate && i < earned ? `gj-star-pop 420ms var(--ease-jelly) ${i * 140 + 120}ms both` : 'none' }}>
            <FilledStar size={size} earned={i < earned} />
          </div>
        ))}
      </div>
    );
  }

  // "+N" coin pill used for rewards.
  function CoinChip({ amount, size = 'md', style = {} }) {
    const big = size === 'lg';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: big ? '6px 14px 6px 8px' : '4px 11px 4px 6px', borderRadius: 999, background: '#FFF3D6', boxShadow: 'inset 0 0 0 1.5px #FBE3AE', ...style }}>
        <Coin size={big ? 24 : 19} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: big ? 18 : 15, color: '#B9821C', lineHeight: 1 }}>{typeof amount === 'number' ? amount.toLocaleString('vi-VN') : amount}</span>
      </span>
    );
  }

  // small "AD" reward badge — a play triangle + AD tag, for rewarded actions.
  function AdBadge({ style = {} }) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 6, background: 'rgba(255,255,255,0.32)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, letterSpacing: '0.06em', color: 'currentColor', ...style }}>
        <svg width="9" height="9" viewBox="0 0 24 24"><path d="M7 5l12 7-12 7V5z" fill="currentColor" /></svg>AD
      </span>
    );
  }

  // keyframes used by Stars + a couple screens
  if (typeof document !== 'undefined' && !document.querySelector('[data-gj-extras]')) {
    const s = document.createElement('style');
    s.setAttribute('data-gj-extras', '');
    s.textContent = `
      @keyframes gj-star-pop { 0% { transform: scale(0) rotate(-30deg); opacity: 0 } 60% { transform: scale(1.3) rotate(8deg); opacity: 1 } 100% { transform: scale(1) rotate(0) } }
      @keyframes gj-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
      @keyframes gj-pop-in { 0% { transform: scale(0.8); opacity: 0 } 60% { transform: scale(1.05) } 100% { transform: scale(1); opacity: 1 } }
      @keyframes gj-confetti-fall { 0% { transform: translateY(-20px) rotate(0); opacity: 0 } 12% { opacity: 1 } 100% { transform: translateY(340px) rotate(320deg); opacity: 0 } }
      @media (prefers-reduced-motion: reduce) { [style*="gj-"] { animation: none !important } }
    `;
    document.head.appendChild(s);
  }

  window.GJExtras = { Lock, Clock, Gift, Plus, Target, Calendar, Bomb, Crown, Coin, FilledStar, Stars, CoinChip, AdBadge };
})();
