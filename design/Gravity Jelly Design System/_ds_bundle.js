/* @ds-bundle: {"format":4,"namespace":"GravityJellyDesignSystem_3e0487","components":[{"name":"JellyBlock","sourcePath":"02-foundations/01-jelly-block/JellyBlock.jsx"},{"name":"Eyes","sourcePath":"02-foundations/02-eyes/Eyes.jsx"},{"name":"Icon","sourcePath":"02-foundations/03-icon/Icon.jsx"},{"name":"Button","sourcePath":"03-components/01-button/Button.jsx"},{"name":"TrayPiece","sourcePath":"03-components/03-tray/Tray.jsx"},{"name":"Tray","sourcePath":"03-components/03-tray/Tray.jsx"},{"name":"GravityRotateButton","sourcePath":"03-components/04-gravity-rotate-button/GravityRotateButton.jsx"},{"name":"ComboPopup","sourcePath":"03-components/05-combo-popup/ComboPopup.jsx"},{"name":"Dialog","sourcePath":"03-components/06-dialog/Dialog.jsx"}],"sourceHashes":{"02-foundations/01-jelly-block/JellyBlock.jsx":"3bc9ed9fcda3","02-foundations/02-eyes/Eyes.jsx":"d4762b606971","02-foundations/03-icon/Icon.jsx":"a75a00c43bb6","03-components/01-button/Button.jsx":"ff24f7c456d7","03-components/03-tray/Tray.jsx":"e425b7cd5eed","03-components/04-gravity-rotate-button/GravityRotateButton.jsx":"09df27eb60e6","03-components/05-combo-popup/ComboPopup.jsx":"3430e5b0f130","03-components/06-dialog/Dialog.jsx":"d5e802d0a1db","04-screens/board-design.jsx":"5c92c5822ebc","04-screens/board.jsx":"5c744383c9f5","04-screens/cam-nang-illus.jsx":"e2e9c7f9d61f","04-screens/cam-nang-screen.jsx":"ec2718eadc63","04-screens/daily-reward-screen.jsx":"0309b17c4056","04-screens/home-screen.jsx":"b63e83a04e92","04-screens/leaderboard-screen.jsx":"e5f936e73b33","04-screens/missions-screen.jsx":"a2cb834bcb3d","04-screens/out-of-lives-screen.jsx":"c5661499a9aa","04-screens/pause-screen.jsx":"edd558af8897","04-screens/phone-frame.jsx":"18e22e60b390","04-screens/play/jelly-play.jsx":"06c4d9432b25","04-screens/result-screen.jsx":"775264ed1cbe","04-screens/screen-extras.jsx":"b6a2513dd24c","04-screens/settings-screen.jsx":"a5cbe4af2727","04-screens/shop-screen.jsx":"454bf4d67682","04-screens/splash-screen.jsx":"b36502be0325","04-screens/tweaks-panel.jsx":"6591467622ed","07-mechanics/mechanics-cards.js":"711cd9d74c93","07-mechanics/mechanics-kit.jsx":"f52efab2af43","07-mechanics/mechanics-widgets.jsx":"2285bf5de0e0","07-mechanics/world3-water-kit.jsx":"402befadc370","08-brand/gravity-jelly-logo.js":"597a18d35b1e","prototypes/proto-engine.js":"6887737568ba","prototypes/proto-game.jsx":"75954a4bee0a","prototypes/proto-ui.jsx":"138d35a58082"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GravityJellyDesignSystem_3e0487 = window.GravityJellyDesignSystem_3e0487 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// 02-foundations/02-eyes/Eyes.jsx
try { (() => {
/**
 * Eyes — the pair of googly jelly eyes. By default the pupils shift toward
 * the active gravity direction so every block "looks" the way it will fall.
 * Every round eye has a gray rim around the white and a white catchlight
 * inside the dark pupil, so the gaze always reads as alive.
 *
 * `expression` adds character beyond plain looking:
 *   - 'normal' : round eyes, pupils track `direction` (default)
 *   - 'happy'  : joyful closed "^ ^" arcs with a little bob — use while falling
 *   - 'focus'  : eyes front, pulsing reticle, like pulling focus on the player
 *   - 'smug'   : heavy half-lids, tilted — a contemptuous squint
 *   - 'wink'   : one eye open (front), one closed arc — a friendly wink
 *   - 'front'  : round eyes, pupils centered — looking straight at the player
 *
 * Pure presentational; scales off the parent block size.
 */

const INK = '#4A3526';

// Inject the expression keyframes once per document.
let kfInjected = false;
function ensureKeyframes() {
  if (kfInjected || typeof document === 'undefined') return;
  kfInjected = true;
  const s = document.createElement('style');
  s.setAttribute('data-gj-eyes', '');
  s.textContent = `
    @keyframes gjEyeJoy { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2.5px) } }
    @keyframes gjEyeReticle { 0% { transform: scale(1.8); opacity: 0 } 28% { opacity: .85 } 100% { transform: scale(1); opacity: 0 } }
    @keyframes gjEyeFocusPupil { 0%,100% { transform: scale(1) } 50% { transform: scale(1.16) } }
  `;
  document.head.appendChild(s);
}
function Eyes({
  direction = 'down',
  blockSize = 36,
  open = true,
  expression = 'normal',
  style = {}
}) {
  ensureKeyframes();

  // Eye + pupil geometry scales with block size.
  const eye = Math.round(blockSize * 0.26);
  const pupil = Math.round(eye * 0.52);
  const gap = Math.round(blockSize * 0.12);
  const spark = Math.max(2, Math.round(pupil * 0.34));
  const travel = (eye - pupil) / 2 - 0.5;
  const offset = {
    down: {
      x: 0,
      y: travel
    },
    up: {
      x: 0,
      y: -travel
    },
    left: {
      x: -travel,
      y: 0
    },
    right: {
      x: travel,
      y: 0
    }
  }[direction] || {
    x: 0,
    y: travel
  };
  const row = (children, extra = {}) => /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap,
      ...extra,
      ...style
    }
  }, children);

  // Shared white eyeball: gray rim around the white + dark pupil + catchlight.
  // `opts.reticle`/`opts.pulse` add the focus treatment.
  const ball = (key, off, opts = {}) => /*#__PURE__*/React.createElement("div", {
    key: key,
    style: {
      position: 'relative',
      width: eye,
      height: eye,
      background: '#FFFFFF',
      borderRadius: '50%',
      boxShadow: 'inset 0 0 0 1.5px rgba(74,53,38,0.30), inset 0 -1px 2px rgba(90,70,54,0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, opts.reticle && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      width: Math.round(eye * 0.86),
      height: Math.round(eye * 0.86),
      borderRadius: '50%',
      border: '1.5px solid rgba(74,53,38,0.5)',
      animation: 'gjEyeReticle 1.5s var(--ease-inout, ease-in-out) infinite'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: pupil,
      height: pupil,
      background: INK,
      borderRadius: '50%',
      transform: `translate(${off.x}px, ${off.y}px)`,
      transition: 'transform var(--motion-medium, 350ms) var(--ease-inout, ease)',
      animation: opts.pulse ? 'gjEyeFocusPupil 1.5s var(--ease-inout, ease-in-out) infinite' : undefined
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '14%',
      right: '14%',
      width: spark,
      height: spark,
      background: '#FFFFFF',
      borderRadius: '50%',
      opacity: 0.9
    }
  })));

  // Flattened (blinking / squashed) white.
  const shutEye = key => /*#__PURE__*/React.createElement("div", {
    key: key,
    style: {
      width: eye,
      height: Math.max(2, Math.round(eye * 0.18)),
      background: '#FFFFFF',
      borderRadius: '50%',
      boxShadow: 'inset 0 -1px 2px rgba(90,70,54,0.18)',
      transition: 'height 120ms var(--ease-out, ease)'
    }
  });

  /* ---- happy: joyful upward arcs that bob ---- */
  if (expression === 'happy') {
    const arc = key => /*#__PURE__*/React.createElement("svg", {
      key: key,
      width: eye,
      height: eye,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3.5 16.5 Q12 4.5 20.5 16.5",
      fill: "none",
      stroke: INK,
      strokeWidth: "3.4",
      strokeLinecap: "round"
    }));
    return row([arc('l'), arc('r')], {
      animation: 'gjEyeJoy 700ms var(--ease-jelly, ease-in-out) infinite'
    });
  }

  /* ---- focus: eyes front, pulsing reticle ---- */
  if (expression === 'focus') {
    return row([ball('l', {
      x: 0,
      y: 0
    }, {
      reticle: true,
      pulse: true
    }), ball('r', {
      x: 0,
      y: 0
    }, {
      reticle: true,
      pulse: true
    })]);
  }

  /* ---- smug: heavy half-lids, tilted outward ---- */
  if (expression === 'smug') {
    const half = Math.round(eye * 0.52);
    const smugEye = (key, tilt) => /*#__PURE__*/React.createElement("div", {
      key: key,
      style: {
        position: 'relative',
        width: eye,
        height: half,
        overflow: 'hidden',
        transform: `rotate(${tilt}deg)`,
        borderRadius: `0 0 ${eye}px ${eye}px`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -Math.round(eye - half),
        left: 0
      }
    }, ball('b', {
      x: 0,
      y: 0
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Math.max(2, Math.round(eye * 0.12)),
        background: INK,
        borderRadius: 2
      }
    }));
    return row([smugEye('l', 9), smugEye('r', -9)], {
      alignItems: 'flex-start'
    });
  }

  /* ---- wink: one open eye (front), one closed arc ---- */
  if (expression === 'wink') {
    const closedEye = /*#__PURE__*/React.createElement("svg", {
      key: "r",
      width: eye,
      height: eye,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3.5 15 Q12 6 20.5 15",
      fill: "none",
      stroke: INK,
      strokeWidth: "3.4",
      strokeLinecap: "round"
    }));
    return row([ball('l', {
      x: 0,
      y: 0
    }), closedEye]);
  }

  /* ---- normal / front: round eyes; pupils track gravity ('front' = centered) ---- */
  const eyeOffset = expression === 'front' ? {
    x: 0,
    y: 0
  } : offset;
  if (!open) return row([shutEye('l'), shutEye('r')]);
  return row([ball('l', eyeOffset), ball('r', eyeOffset)]);
}
Object.assign(__ds_scope, { Eyes });
})(); } catch (e) { __ds_ns.__errors.push({ path: "02-foundations/02-eyes/Eyes.jsx", error: String((e && e.message) || e) }); }

// 02-foundations/01-jelly-block/JellyBlock.jsx
try { (() => {
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
  yellow: {
    fill: 'var(--color-block-yellow)',
    edge: 'var(--color-block-yellow-edge)',
    shine: 'var(--color-block-yellow-shine)'
  },
  mint: {
    fill: 'var(--color-block-mint)',
    edge: 'var(--color-block-mint-edge)',
    shine: 'var(--color-block-mint-shine)'
  },
  pink: {
    fill: 'var(--color-block-pink)',
    edge: 'var(--color-block-pink-edge)',
    shine: 'var(--color-block-pink-shine)'
  },
  blue: {
    fill: 'var(--color-block-blue)',
    edge: 'var(--color-block-blue-edge)',
    shine: 'var(--color-block-blue-shine)'
  },
  stone: {
    fill: 'var(--color-stone)',
    edge: 'var(--color-stone-edge)',
    shine: 'var(--color-stone-shine)'
  }
};

/* Resolve the design-system asset root from wherever _ds_bundle.js was
   loaded, so block art resolves the same on component cards, the index
   click-through, prototypes — any page depth. */
const DS_ASSET_ROOT = (() => {
  try {
    const cur = typeof document !== 'undefined' && document.currentScript && document.currentScript.src || '';
    const src = cur || (typeof document !== 'undefined' ? Array.from(document.querySelectorAll('script[src]')).map(s => s.src).find(u => /_ds_bundle\.js/.test(u)) : '') || '';
    return src ? src.replace(/[^/]*_ds_bundle\.js.*$/, '') : '';
  } catch (e) {
    return '';
  }
})();
const BLOCK_IMG = {
  yellow: `${DS_ASSET_ROOT}06-svg-assets/blocks/jelly-yellow.png`,
  mint: `${DS_ASSET_ROOT}06-svg-assets/blocks/jelly-mint.png`,
  pink: `${DS_ASSET_ROOT}06-svg-assets/blocks/jelly-pink.png`,
  blue: `${DS_ASSET_ROOT}06-svg-assets/blocks/jelly-blue.png`
};
function JellyBlock({
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
  style = {}
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
    boxShadow: clearing ? `0 0 0 4px ${pal.shine}, var(--shadow-md)` : 'var(--shadow-sm)',
    transform: clearing ? `${squash} scale(1.12)` : squash,
    opacity: clearing ? 0 : 1,
    filter: clearing ? 'brightness(1.6)' : 'none',
    transition: 'transform var(--motion-fast,150ms) var(--ease-jelly,ease), opacity var(--motion-base,250ms) var(--ease-out,ease), filter var(--motion-base,250ms) var(--ease-out,ease)',
    ...style
  };

  // Stone: immovable cell — still drawn natively (no art supplied).
  if (isStone) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...base,
        background: pal.fill,
        border: `var(--border-jelly, 3px) solid ${pal.edge}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 2,
        left: '12%',
        right: '12%',
        height: '34%',
        background: pal.shine,
        borderRadius: '50%',
        opacity: 0.85,
        filter: 'blur(0.5px)',
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement(StoneFace, {
      size: size
    }));
  }

  // Coloured jelly blocks — full-bleed art, corners clipped by border-radius.
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...base,
      background: `url("${BLOCK_IMG[color] || BLOCK_IMG.yellow}") center / cover no-repeat, ${pal.fill}`
    }
  }, showEyes && /*#__PURE__*/React.createElement(__ds_scope.Eyes, {
    direction: direction,
    blockSize: size,
    open: !squashed && !blink,
    expression: expression
  }));
}

/* Stone cells get a couple of pebble notches instead of a face. */
function StoneFace({
  size
}) {
  const d = Math.round(size * 0.12);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: d,
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: d,
      height: d,
      borderRadius: '50%',
      background: 'var(--color-stone-edge)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: d,
      height: d,
      borderRadius: '50%',
      background: 'var(--color-stone-edge)'
    }
  }));
}
Object.assign(__ds_scope, { JellyBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "02-foundations/01-jelly-block/JellyBlock.jsx", error: String((e && e.message) || e) }); }

// 02-foundations/03-icon/Icon.jsx
try { (() => {
/**
 * Icon — the Gravity Jelly glyph set. Lucide-style: 24x24 viewBox,
 * 2px round stroke, no fill. Inline so the bundle stays dependency-free.
 */

const PATHS = {
  pause: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "5",
    width: "4",
    height: "14",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "5",
    width: "4",
    height: "14",
    rx: "1.5"
  })),
  play: /*#__PURE__*/React.createElement("path", {
    d: "M7 5l12 7-12 7V5z"
  }),
  settings: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
  })),
  rotate: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 12a9 9 0 1 0 3-6.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 4v4h4"
  })),
  rotateCw: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 12a9 9 0 1 1-3-6.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 4v4h-4"
  })),
  volume: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M5 9v6h4l5 4V5L9 9H5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 8.5a4 4 0 0 1 0 7M18.5 6a7 7 0 0 1 0 12"
  })),
  mute: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M5 9v6h4l5 4V5L9 9H5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 9l-6 6M15 9l6 6"
  })),
  music: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M9 18V5l11-2v13"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "18",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "16",
    r: "3"
  })),
  vibrate: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "4",
    width: "6",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 9v6M20 9v6"
  })),
  globe: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
  })),
  info: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 11v5M12 8h.01"
  })),
  close: /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  }),
  back: /*#__PURE__*/React.createElement("path", {
    d: "M15 5l-7 7 7 7"
  }),
  home: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 11l8-7 8 7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 10v9h12v-9"
  })),
  refresh: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 12a8 8 0 0 1 13.6-5.7L20 8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 4v4h-4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 12a8 8 0 0 1-13.6 5.7L4 16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 20v-4h4"
  })),
  heart: /*#__PURE__*/React.createElement("path", {
    d: "M12 20s-7-4.7-9.3-9C1.2 8.3 2.6 5 5.8 5 8 5 9.4 6.6 12 9c2.6-2.4 4-4 6.2-4 3.2 0 4.6 3.3 3.1 6-2.3 4.3-9.3 9-9.3 9z"
  }),
  star: /*#__PURE__*/React.createElement("path", {
    d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
  }),
  trophy: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M7 4h10v5a5 5 0 0 1-10 0V4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M10 20v-3M14 20v-3"
  })),
  x2: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 8l5 8M9 8l-5 8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 9a2 2 0 1 1 4 0c0 2-4 3.5-4 7h4"
  })),
  chevron: /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }),
  check: /*#__PURE__*/React.createElement("path", {
    d: "M5 12.5l4 4L19 7"
  }),
  pencil: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 20h4L18.5 9.5a2 2 0 0 0-2.8-2.8L5 17.2V20z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.5 6.5l4 4"
  }))
};
function Icon({
  name = 'info',
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: style
  }, PATHS[name] || PATHS.info);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "02-foundations/03-icon/Icon.jsx", error: String((e && e.message) || e) }); }

// 03-components/01-button/Button.jsx
try { (() => {
const {
  useState
} = React;
/**
 * Button — the jelly CTA. A rounded candy button with a thick darker
 * "edge" base that compresses on press (translateY). Variants map to the
 * palette; size 'cta' is the 56dp primary action.
 */

const VARIANTS = {
  primary: {
    fill: 'var(--color-primary)',
    edge: 'var(--color-primary-edge)',
    shine: 'var(--color-primary-shine)',
    text: 'var(--color-text-invert)'
  },
  gravity: {
    fill: 'var(--color-gravity)',
    edge: 'var(--color-gravity-edge)',
    shine: 'var(--color-gravity-shine)',
    text: 'var(--color-text-invert)'
  },
  success: {
    fill: 'var(--color-success)',
    edge: '#4FAE60',
    shine: '#9BE3A8',
    text: 'var(--color-text-invert)'
  },
  danger: {
    fill: 'var(--color-danger)',
    edge: '#D66B5E',
    shine: '#F7B4AC',
    text: 'var(--color-text-invert)'
  },
  secondary: {
    fill: 'var(--color-surface)',
    edge: '#E7D9C2',
    shine: '#FFFFFF',
    text: 'var(--color-text)'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  comingSoon = false,
  onClick,
  style = {}
}) {
  const [pressed, setPressed] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const isGhost = variant === 'ghost';
  const cta = size === 'cta';
  const off = disabled || comingSoon;
  const edgeDepth = cta ? 5 : 4;
  const base = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    width: fullWidth ? '100%' : 'auto',
    minHeight: cta ? 'var(--dim-cta-h)' : 'var(--dim-btn-h)',
    padding: cta ? '0 var(--space-2xl)' : '0 var(--space-xl)',
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--weight-semibold)',
    fontSize: cta ? 'var(--text-heading)' : 'var(--text-label)',
    color: isGhost ? 'var(--color-text)' : v.text,
    background: isGhost ? 'transparent' : v.fill,
    border: variant === 'secondary' ? `var(--border-thin) solid ${v.edge}` : 'none',
    borderRadius: cta ? 'var(--radius-xl)' : 'var(--radius-lg)',
    boxShadow: isGhost ? 'none' : `0 ${pressed && !off ? 1 : edgeDepth}px 0 ${v.edge}, var(--shadow-sm)`,
    transform: pressed && !off ? `translateY(${edgeDepth - 1}px)` : 'translateY(0)',
    transition: 'transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)',
    opacity: off ? 0.55 : 1,
    cursor: off ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    boxSizing: 'border-box',
    ...style
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: off,
    onPointerDown: () => !off && setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    onClick: off ? undefined : onClick,
    style: base
  }, !isGhost && !pressed && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: '14%',
      right: '14%',
      height: '34%',
      background: v.shine,
      opacity: 0.5,
      borderRadius: 'var(--radius-full)',
      pointerEvents: 'none'
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: cta ? 24 : 20,
    color: isGhost ? 'var(--color-text)' : v.text
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      whiteSpace: 'nowrap'
    }
  }, children), comingSoon && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-caption)',
      fontWeight: 'var(--weight-bold)',
      background: 'rgba(255,255,255,0.35)',
      borderRadius: 'var(--radius-full)',
      padding: '2px 8px',
      letterSpacing: 'var(--tracking-wide)'
    }
  }, "S\u1EAEP C\xD3"), iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: cta ? 24 : 20,
    color: isGhost ? 'var(--color-text)' : v.text
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "03-components/01-button/Button.jsx", error: String((e && e.message) || e) }); }

// 03-components/03-tray/Tray.jsx
try { (() => {
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
  return {
    top: has(r - 1, c),
    right: has(r, c + 1),
    bottom: has(r + 1, c),
    left: has(r, c - 1)
  };
}
function TrayPiece({
  piece,
  cell,
  fit = 80,
  gap = 2,
  maxCell = 22
}) {
  if (!piece) return null;
  const rows = piece.cells.map(([r]) => r);
  const cols = piece.cells.map(([, c]) => c);
  const minR = Math.min(...rows),
    maxR = Math.max(...rows);
  const minC = Math.min(...cols),
    maxC = Math.max(...cols);
  const nC = maxC - minC + 1,
    nR = maxR - minR + 1;
  // Either honor an explicit shared cell, or shrink to fit the slot box.
  const useCell = cell != null ? cell : Math.min(maxCell, Math.floor((fit - (nC - 1) * gap) / nC), Math.floor((fit - (nR - 1) * gap) / nR));
  const w = nC * useCell + (nC - 1) * gap;
  const h = nR * useCell + (nR - 1) * gap;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: w,
      height: h
    }
  }, piece.cells.map(([r, c], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      left: (c - minC) * (useCell + gap),
      top: (r - minR) * (useCell + gap)
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.JellyBlock, {
    color: piece.color,
    size: useCell,
    count: piece.count,
    showEyes: false,
    connect: cellConnect(piece.cells, r, c)
  }))));
}

// One cell size for the whole tray: driven by the largest piece present and
// clamped to a comfortable range, so slots never mix huge and tiny cells.
function sharedCellSize(pieces, fit = 80, gap = 2, min = 12, max = 22) {
  let maxDim = 1;
  pieces.forEach(p => {
    if (!p) return;
    const rs = p.cells.map(([r]) => r),
      cs = p.cells.map(([, c]) => c);
    maxDim = Math.max(maxDim, Math.max(...rs) - Math.min(...rs) + 1, Math.max(...cs) - Math.min(...cs) + 1);
  });
  return Math.max(min, Math.min(max, Math.floor((fit - (maxDim - 1) * gap) / maxDim)));
}
function Tray({
  pieces = [null, null, null],
  selectedIndex = -1,
  onSelect,
  style = {}
}) {
  const slots = [0, 1, 2];
  const cell = sharedCellSize(pieces);
  return /*#__PURE__*/React.createElement("div", {
    style: {
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
      ...style
    }
  }, slots.map(i => {
    const piece = pieces[i];
    const selected = selectedIndex === i && piece;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      onClick: () => piece && onSelect && onSelect(i),
      "aria-label": piece ? `Mảnh ${i + 1}` : 'Ô trống',
      style: {
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
        cursor: piece ? 'grab' : 'default'
      }
    }, selected && /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        top: -11,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '8px solid var(--color-primary)',
        filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.6))'
      }
    }), piece ? /*#__PURE__*/React.createElement(TrayPiece, {
      piece: piece,
      cell: cell
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        height: 52,
        borderRadius: 'var(--radius-md)',
        border: '2px dashed var(--color-cell-line)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { TrayPiece, Tray });
})(); } catch (e) { __ds_ns.__errors.push({ path: "03-components/03-tray/Tray.jsx", error: String((e && e.message) || e) }); }

// 03-components/04-gravity-rotate-button/GravityRotateButton.jsx
try { (() => {
const {
  useState
} = React;
/**
 * GravityRotateButton — the 64dp circular FAB that rotates gravity 90°.
 * Carries a badge with the remaining rotations; disables at 0. The icon
 * spins 90° on each press to reinforce the mechanic.
 */
function GravityRotateButton({
  turnsLeft = 0,
  onRotate,
  disabled = false,
  style = {}
}) {
  const [spin, setSpin] = useState(0);
  const off = disabled || turnsLeft <= 0;
  const handle = () => {
    if (off) return;
    setSpin(s => s + 90);
    onRotate && onRotate();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 'var(--dim-gravity-btn)',
      height: 'var(--dim-gravity-btn)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handle,
    disabled: off,
    "aria-label": `Xoay trọng lực, còn ${turnsLeft} lượt`,
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 'var(--radius-full)',
      border: 'none',
      background: off ? 'var(--color-stone)' : 'var(--color-gravity)',
      boxShadow: off ? 'var(--shadow-sm)' : `0 5px 0 var(--color-gravity-edge), var(--shadow-md)`,
      color: 'var(--color-text-invert)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: off ? 'not-allowed' : 'pointer',
      opacity: off ? 0.7 : 1,
      transition: 'transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 6,
      left: '24%',
      right: '24%',
      height: '24%',
      background: 'var(--color-gravity-shine)',
      opacity: 0.55,
      borderRadius: 'var(--radius-full)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      transform: `rotate(${spin}deg)`,
      transition: 'transform var(--motion-medium) var(--ease-inout)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "rotateCw",
    size: 30,
    color: "var(--color-text-invert)",
    strokeWidth: 2.4
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -6,
      right: -6,
      minWidth: 24,
      height: 24,
      padding: '0 6px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-surface)',
      border: `2px solid ${off ? 'var(--color-stone-edge)' : 'var(--color-gravity)'}`,
      color: off ? 'var(--color-text-muted)' : 'var(--color-gravity)',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-label)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-sm)',
      boxSizing: 'border-box'
    }
  }, turnsLeft));
}
Object.assign(__ds_scope, { GravityRotateButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "03-components/04-gravity-rotate-button/GravityRotateButton.jsx", error: String((e && e.message) || e) }); }

// 03-components/05-combo-popup/ComboPopup.jsx
try { (() => {
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
const TIERS = [{
  min: 9,
  word: 'CUỒNG NHIỆT!',
  color: '#FF5470',
  grad: 'linear-gradient(95deg,#FF5470,#FF9F45,#FFC24B,#FF5470)',
  num: 34,
  stars: 3
}, {
  min: 7,
  word: 'AMAZING!',
  color: '#FF7A3C',
  grad: 'linear-gradient(95deg,#FF7A3C,#FFC24B,#FF6FA5,#FF7A3C)',
  num: 32,
  stars: 2
}, {
  min: 5,
  word: 'XUẤT SẮC!',
  color: '#F0A92E',
  grad: 'linear-gradient(95deg,#FFC24B,#5FC98A,#6FA8FF,#FFC24B)',
  num: 30,
  stars: 2
}, {
  min: 4,
  word: 'HOÀN HẢO!',
  color: '#3FA86A',
  grad: 'linear-gradient(95deg,#5FC98A,#3FB6C9,#6FA8FF,#5FC98A)',
  num: 29,
  stars: 1
}, {
  min: 2,
  word: 'TUYỆT VỜI!',
  color: '#6E7BF0',
  grad: 'linear-gradient(95deg,#6FA8FF,#B98CFF,#FF6FA5,#6FA8FF)',
  num: 28,
  stars: 0
}, {
  min: 0,
  word: 'TỐT!',
  color: '#8A6BF0',
  grad: 'linear-gradient(95deg,#B98CFF,#6FA8FF,#5FC98A,#B98CFF)',
  num: 26,
  stars: 0
}];
const WHITE_OUTLINE = '0 1px 0 #fff,0 -1px 0 #fff,1px 0 0 #fff,-1px 0 0 #fff,1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff,0 3px 2px rgba(120,92,52,0.28)';

/* a small glossy jelly cube — the falling piece (no eyes, just candy). */
function MiniJelly({
  color = 'yellow',
  size = 18
}) {
  const r = Math.max(4, Math.round(size * 0.3));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: r,
      background: `var(--color-block-${color})`,
      border: `2px solid var(--color-block-${color}-edge)`,
      boxShadow: '0 2px 3px rgba(120,92,52,0.22), inset 0 -2px 0 rgba(0,0,0,0.08)',
      position: 'relative',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 1,
      left: '16%',
      right: '16%',
      height: '36%',
      borderRadius: '50%',
      background: `var(--color-block-${color}-shine)`,
      opacity: 0.9
    }
  }));
}
function ComboPopup({
  combo = 2,
  praise,
  colors,
  pieces,
  showDish = true,
  showPieces = true,
  showText = true,
  floor = 16,
  height = 120,
  label = 'COMBO',
  visible = true,
  animate = true,
  style = {}
}) {
  if (!visible) return null;
  const tier = TIERS.find(t => combo >= t.min) || TIERS[TIERS.length - 1];
  const word = praise || tier.word;
  const hasText = combo > 1 && showText;

  // how many jelly pieces rain down — more for bigger chains, min 3 on a plain clear
  const n = pieces != null ? pieces : Math.max(3, Math.min(9, combo + 2));
  const dishW = 150;
  const fh = Math.round(height - floor - 26); // fall distance

  const drops = Array.from({
    length: n
  }).map((_, i) => {
    const t = n > 1 ? i / (n - 1) : 0.5;
    const jit = (i % 2 ? 1 : -1) * (4 + i % 3 * 3);
    const x = Math.round((t - 0.5) * (dishW - 44) + jit); // spread across the dish
    const col = colors ? colors[i % colors.length] : COLORS[(i * 3 + 1) % COLORS.length];
    return {
      x,
      col,
      size: 16 + i % 3 * 3,
      r0: i * 53 % 80 - 40,
      r1: i * 29 % 22 - 11,
      delay: i * 58
    };
  });
  const anim = s => animate ? s : 'none';
  const wordLetters = [...word].map((ch, i) => ch === ' ' ? /*#__PURE__*/React.createElement("span", {
    key: i
  }, "\xA0") : /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      color: JELLY[i % JELLY.length]
    }
  }, ch));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: dishW + 24,
      height,
      pointerEvents: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, `
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
      `), hasText && /*#__PURE__*/React.createElement("div", {
    className: "gj-cb-anim",
    style: {
      position: 'absolute',
      top: 0,
      left: '50%',
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      transform: 'translateX(-50%)',
      animation: anim('gj-cb-pop 520ms cubic-bezier(.34,1.56,.64,1) both'),
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '50%',
      top: '46%',
      width: 150,
      height: 64,
      transform: 'translate(-50%,-50%)',
      borderRadius: '50%',
      background: `radial-gradient(closest-side, color-mix(in srgb, ${tier.color} 24%, transparent), transparent 72%)`,
      filter: 'blur(4px)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 1,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-extra)',
      lineHeight: 1,
      animation: anim('gj-cb-num 520ms ease-out 100ms both')
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 1,
      color: 'transparent',
      WebkitTextStroke: '3px #fff',
      paintOrder: 'stroke',
      filter: 'drop-shadow(0 3px 2px rgba(120,92,52,0.3))'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: tier.num * 0.62
    }
  }, "\xD7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: tier.num
    }
  }, combo)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 1,
      background: tier.grad,
      backgroundSize: '200% 100%',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: 'transparent',
      animation: anim('gj-cb-hue 2.4s linear infinite')
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: tier.num * 0.62,
      opacity: 0.92
    }
  }, "\xD7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: tier.num
    }
  }, combo))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-extra)',
      fontSize: Math.round(tier.num * 0.44),
      letterSpacing: '0.5px',
      lineHeight: 1,
      textShadow: WHITE_OUTLINE
    }
  }, tier.stars > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#FFC24B',
      marginRight: 3
    }
  }, "\u2726"), wordLetters, tier.stars > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#FFC24B',
      marginLeft: 3
    }
  }, "\u2726"))), showDish && showPieces && /*#__PURE__*/React.createElement("div", {
    className: "gj-cb-anim",
    style: {
      position: 'absolute',
      bottom: 2,
      left: '50%',
      transform: 'translateX(-50%)',
      width: dishW,
      height: 32,
      animation: anim('gj-dish-bob 460ms ease-out 360ms both')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: 0,
      transform: 'translateX(-50%)',
      width: dishW,
      height: 30,
      borderRadius: '50%',
      background: 'linear-gradient(180deg,#FBEFD8,#ECD9B4)',
      border: '2px solid #E2C896',
      boxShadow: '0 4px 7px rgba(120,92,52,0.22)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: 1,
      transform: 'translateX(-50%)',
      width: dishW - 26,
      height: 19,
      borderRadius: '50%',
      background: 'radial-gradient(120% 140% at 50% 18%, #E7D2A6, #D8BE8A)',
      boxShadow: 'inset 0 4px 5px rgba(120,92,52,0.28), inset 0 -2px 0 rgba(255,255,255,0.4)'
    }
  })), showPieces && drops.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'absolute',
      bottom: floor,
      left: `calc(50% + ${d.x}px)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gj-cb-anim",
    style: {
      ['--fh']: fh + 'px',
      ['--r0']: d.r0 + 'deg',
      ['--r1']: d.r1 + 'deg',
      transform: 'translateY(0) rotate(' + d.r1 + 'deg)',
      animation: anim(`gj-drop 660ms ${d.delay}ms both`)
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gj-cb-anim",
    style: {
      transformOrigin: 'bottom center',
      animation: anim(`gj-squash 660ms ${d.delay}ms both`)
    }
  }, /*#__PURE__*/React.createElement(MiniJelly, {
    color: d.col,
    size: d.size
  }))))));
}
Object.assign(__ds_scope, { ComboPopup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "03-components/05-combo-popup/ComboPopup.jsx", error: String((e && e.message) || e) }); }

// 03-components/06-dialog/Dialog.jsx
try { (() => {
/**
 * Dialog — the soft modal sheet used for pause, confirm, and info. A warm
 * scrim plus a rounded card that springs in. Title row with optional close,
 * a body, and an actions area (stack your Buttons there, usually fullWidth).
 */
function Dialog({
  open = true,
  title,
  icon = null,
  children,
  actions = null,
  onClose,
  dismissable = true,
  style = {}
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: dismissable ? onClose : undefined,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--color-overlay)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      zIndex: 50,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 312,
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-2xl)',
      padding: 'var(--space-xl)',
      boxShadow: 'var(--shadow-lg)',
      boxSizing: 'border-box',
      animation: 'gj-dialog 280ms var(--ease-jelly) both',
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes gj-dialog {
          0% { transform: scale(0.88) translateY(10px); }
          60% { transform: scale(1.02) translateY(0); }
          100% { transform: scale(1) translateY(0); }
        }`), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      marginBottom: children ? 'var(--space-md)' : 'var(--space-lg)'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-md)',
      background: 'var(--color-surface-sunken)',
      color: 'var(--color-gravity)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 22
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      flex: 1,
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-heading)',
      color: 'var(--color-text)'
    }
  }, title), dismissable && onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "\u0110\xF3ng",
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'transparent',
      color: 'var(--color-text-muted)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: 20
  }))), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--color-text-muted)',
      marginBottom: 'var(--space-lg)'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-sm)'
    }
  }, actions)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "03-components/06-dialog/Dialog.jsx", error: String((e && e.message) || e) }); }

// 04-screens/board-design.jsx
try { (() => {
/* board-design.jsx — the OFFICIAL play board (“① Game” screen).
   Meadow PNG backdrop + a unified HUD (score card · gravity D-pad · round
   pause button) + the 9×9 board in an SVG cream frame + the 3-well SVG tray
   next to a purple refresh FAB. All chrome art lives in 06-svg-assets/.

   Reuses the DS namespace (JellyBlock, Eyes) and the GJBoard grid renderer.
   Exposes window.GJBoardDesign (also aliased as window.GJGameScreen). */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    JellyBlock,
    Eyes
  } = NS;
  const Board = window.GJBoard;
  const BG_SRC = '../06-svg-assets/backgrounds/meadow-bg.webp';
  const PAL = {
    yellow: {
      fill: '#FFE3A3',
      edge: '#E8B85C',
      shine: '#FFF1CE'
    },
    mint: {
      fill: '#A3E5D9',
      edge: '#5FC3B2',
      shine: '#CBF2EB'
    },
    pink: {
      fill: '#F7A9C0',
      edge: '#E576A0',
      shine: '#FBD0DF'
    },
    blue: {
      fill: '#B3C7F7',
      edge: '#7E9CE8',
      shine: '#D6E1FB'
    }
  };

  /* ── Score card: the plain cream card with ĐIỂM label + score number. ── */
  const SCORE_SRC = '../06-svg-assets/ui/score-card.svg';
  function ScoreCard({
    score = 12480
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 80,
        aspectRatio: '1 / 1'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: SCORE_SRC,
      alt: "",
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.08em',
        color: '#9B886F',
        lineHeight: 1
      }
    }, "\u0110I\u1EC2M"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        fontWeight: 700,
        color: '#5B4636',
        lineHeight: 1.05,
        marginTop: 2,
        whiteSpace: 'nowrap'
      }
    }, score.toLocaleString('vi-VN'))));
  }

  /* ── Gravity D-pad: purple candy capsule with ← ↑ ↓ → ; the active
        direction (up) sits in a raised white disc. ── */
  function Arrow({
    dir = 'up',
    color = '#FFFFFF',
    size = 24
  }) {
    const rot = {
      up: 0,
      down: 180,
      left: 270,
      right: 90
    }[dir] || 0;
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        transform: `rotate(${rot}deg)`,
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 5v14M6 11l6-6 6 6"
    }));
  }
  function GravityPad({
    active = 'up',
    onDir,
    onRotate
  }) {
    const ghost = dir => /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onDir ? onDir(dir) : onRotate && onRotate(),
      "aria-label": `Trọng lực ${dir}`,
      style: {
        width: 26,
        height: 32,
        border: 'none',
        background: 'transparent',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0
      }
    }, /*#__PURE__*/React.createElement(Arrow, {
      dir: dir,
      color: "rgba(255,255,255,0.92)",
      size: 20
    }));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: '5px 9px',
        background: 'linear-gradient(180deg,#9183F6 0%, #7E6CF0 52%, #6353D6 100%)',
        borderRadius: 999,
        boxShadow: '0 6px 0 #4F3FB0, 0 10px 18px rgba(83,68,196,0.36), inset 0 2px 0 rgba(255,255,255,0.3)'
      }
    }, ghost('left'), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onRotate && onRotate(),
      "aria-label": `Trọng lực ${active} (đang chọn)`,
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: 'none',
        margin: '0 1px',
        background: 'radial-gradient(120% 120% at 50% 28%, #FFFFFF, #F3ECFF)',
        boxShadow: '0 4px 0 #C8BCF2, 0 4px 10px rgba(60,44,24,0.18), inset 0 2px 0 rgba(255,255,255,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0
      }
    }, /*#__PURE__*/React.createElement(Arrow, {
      dir: active,
      color: "#6353D6",
      size: 24
    })), ghost('down'), ghost('right'));
  }

  /* ── Pause button: the supplied flowered frame with a pause glyph. ── */
  function PauseCard({
    onPause
  }) {
    const bar = {
      width: 4,
      height: 14,
      borderRadius: 999,
      background: '#7E6CF0'
    };
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onPause,
      "aria-label": "T\u1EA1m d\u1EEBng",
      style: {
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: 'none',
        background: 'radial-gradient(120% 120% at 50% 28%, #FFFFFF, #F6EFE2)',
        boxShadow: '0 4px 0 #E3D4BF, 0 6px 12px rgba(120,92,52,0.22), inset 0 2px 0 rgba(255,255,255,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: bar
    }), /*#__PURE__*/React.createElement("span", {
      style: bar
    }));
  }

  /* ── Board panel: the supplied PNG frame (cream tray + leafy/flower
        corners, transparent surround) with the 9×9 grid dropped into the
        inner well. The PNG carries the frame; GJBoard draws only the grid. ── */
  const FRAME_SRC = '../06-svg-assets/ui/board-frame.svg';
  function BoardPanel({
    board,
    direction
  }) {
    const S = 332;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: S,
        height: S
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: FRAME_SRC,
      alt: "",
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '5%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Board, {
      map: board,
      direction: direction,
      cell: 31,
      gap: 2,
      pad: 0,
      style: {
        background: 'transparent',
        boxShadow: 'none',
        borderRadius: 0
      }
    })));
  }

  /* ── Tray piece (with eyes + sticker, unlike the dock helper). ── */
  function PieceView({
    piece,
    cell = 30,
    gap = 3
  }) {
    const rows = piece.cells.map(([r]) => r),
      cols = piece.cells.map(([, c]) => c);
    const minR = Math.min(...rows),
      minC = Math.min(...cols);
    const nR = Math.max(...rows) - minR + 1,
      nC = Math.max(...cols) - minC + 1;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: nC * cell + (nC - 1) * gap,
        height: nR * cell + (nR - 1) * gap,
        filter: 'drop-shadow(0 4px 5px rgba(120,92,52,0.18))'
      }
    }, piece.cells.map(([r, c], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: (c - minC) * (cell + gap),
        top: (r - minR) * (cell + gap)
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: piece.color,
      size: cell,
      showEyes: true,
      direction: "down"
    }))));
  }

  /* ── Tray dock: the supplied PNG tray (3 wells) with a piece in each well. ── */
  const TRAY_SRC = '../06-svg-assets/ui/tray.svg';
  function TrayDock({
    pieces
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        position: 'relative',
        aspectRatio: '770 / 260'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: TRAY_SRC,
      alt: "",
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '7%',
        left: '3%',
        right: '3%',
        bottom: '9%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr'
      }
    }, pieces.map((piece, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(PieceView, {
      piece: piece,
      cell: 20,
      gap: 2
    })))));
  }

  /* ── Refresh / shuffle FAB (purple candy). ── */
  function RefreshFab({
    onClick
  }) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClick,
      "aria-label": "\u0110\u1ED5i m\u1EA3nh",
      style: {
        flexShrink: 0,
        width: 60,
        height: 60,
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(180deg,#9183F6 0%, #7E6CF0 55%, #6353D6 100%)',
        boxShadow: '0 6px 0 #4F3FB0, 0 10px 18px rgba(83,68,196,0.36), inset 0 2px 0 rgba(255,255,255,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 8,
        left: '28%',
        right: '28%',
        height: '22%',
        background: 'rgba(255,255,255,0.45)',
        borderRadius: '50%'
      }
    }), /*#__PURE__*/React.createElement("svg", {
      width: "30",
      height: "30",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "2.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20 11a8 8 0 1 0-1.6 5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M20 5v6h-6"
    })));
  }

  /* ── The screen ── */
  function BoardDesign({
    score = 12480,
    gravity,
    direction,
    blockDirection = 'down',
    board,
    pieces,
    onPause,
    onRotate,
    onRefresh
  }) {
    const grav = gravity || direction || 'up';
    const map = board || ['.........', '.........', '.........', '.....PP..', '.....PP..', '...M..BB.', '.YYM.SBB.', '.YYMMSB..', 'YYYMMSPPP'];
    const trayPieces = pieces || [{
      cells: [[0, 0], [1, 0], [1, 1]],
      color: 'mint'
    }, {
      cells: [[0, 0], [0, 1], [0, 2]],
      color: 'pink'
    }, {
      cells: [[0, 0], [0, 1], [1, 0], [1, 1]],
      color: 'yellow'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: BG_SRC,
      alt: "",
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center bottom',
        display: 'block'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 6px 16px',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(ScoreCard, {
      score: score
    }), /*#__PURE__*/React.createElement(GravityPad, {
      active: grav,
      onRotate: onRotate
    }), /*#__PURE__*/React.createElement(PauseCard, {
      onPause: onPause
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 24
      }
    }, /*#__PURE__*/React.createElement(BoardPanel, {
      board: map,
      direction: blockDirection
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement(TrayDock, {
      pieces: trayPieces
    }), /*#__PURE__*/React.createElement(RefreshFab, {
      onClick: onRefresh
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 8
      }
    })));
  }
  window.GJBoardDesign = BoardDesign;
  window.GJGameScreen = BoardDesign;

  /* Chrome building blocks reused by the campaign & boss in-game boards.
     Additive export — does NOT change the canonical "① Game" (endless) screen. */
  window.GJBoardParts = {
    ScoreCard,
    GravityPad,
    PauseCard,
    BoardPanel,
    PieceView,
    TrayDock,
    RefreshFab,
    PAL,
    BG_SRC,
    SCORE_SRC
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/board-design.jsx", error: String((e && e.message) || e) }); }

// 04-screens/board.jsx
try { (() => {
/* board.jsx — Game board renderer (UI-kit helper, not a DS primitive).
   Parses a compact char map, finds same-color clusters (for the cluster
   number + merged corners), and lays out 9x9 JellyBlocks. */

(function () {
  const {
    JellyBlock
  } = window.GravityJellyDesignSystem_3e0487;
  const CODE = {
    Y: 'yellow',
    M: 'mint',
    P: 'pink',
    B: 'blue',
    S: 'stone'
  };

  // mapRows: array of 9 strings, chars in {Y,M,P,B,S,.}
  function parse(mapRows) {
    return mapRows.map(row => row.split('').map(ch => ch === '.' ? null : {
      code: ch,
      color: CODE[ch]
    }));
  }

  // flood-fill same-color (non-stone) clusters -> size + membership id
  function clusters(grid) {
    const N = grid.length;
    const id = grid.map(r => r.map(() => -1));
    const sizes = [];
    let next = 0;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (!cell || cell.code === 'S' || id[r][c] !== -1) continue;
        // BFS
        const stack = [[r, c]];
        id[r][c] = next;
        let size = 0;
        while (stack.length) {
          const [cr, cc] = stack.pop();
          size++;
          [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]].forEach(([nr, nc]) => {
            if (nr < 0 || nc < 0 || nr >= N || nc >= grid[nr].length) return;
            const n = grid[nr][nc];
            if (n && n.code === cell.code && id[nr][nc] === -1) {
              id[nr][nc] = next;
              stack.push([nr, nc]);
            }
          });
        }
        sizes[next] = size;
        next++;
      }
    }
    return {
      id,
      sizes
    };
  }
  function Board({
    map,
    direction = 'down',
    cell = 36,
    gap = 2,
    pad = 8,
    style = {}
  }) {
    const grid = React.useMemo(() => parse(map), [map]);
    const {
      id,
      sizes
    } = React.useMemo(() => clusters(grid), [grid]);
    const N = grid.length;
    const connectAt = (r, c) => {
      const same = (nr, nc) => nr >= 0 && nc >= 0 && nr < N && nc < grid[nr].length && id[nr][nc] === id[r][c] && id[r][c] !== -1;
      return {
        top: same(r - 1, c),
        right: same(r, c + 1),
        bottom: same(r + 1, c),
        left: same(r, c - 1)
      };
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${N}, ${cell}px)`,
        gridAutoRows: `${cell}px`,
        gap,
        padding: pad,
        background: 'var(--color-surface-sunken)',
        borderRadius: 12,
        boxShadow: 'inset 0 2px 6px rgba(120,92,52,0.12)',
        ...style
      }
    }, grid.map((row, r) => row.map((cellv, c) => {
      if (!cellv) {
        return /*#__PURE__*/React.createElement("div", {
          key: `${r}-${c}`,
          style: {
            width: cell,
            height: cell,
            borderRadius: Math.max(6, Math.round(cell * 0.20)),
            background: 'var(--color-cell-empty)',
            boxShadow: 'inset 0 0 0 1px var(--color-cell-line)'
          }
        });
      }
      const isStone = cellv.code === 'S';
      return /*#__PURE__*/React.createElement(JellyBlock, {
        key: `${r}-${c}`,
        color: cellv.color,
        size: cell,
        count: isStone ? null : sizes[id[r][c]],
        direction: direction,
        showEyes: !isStone,
        connect: connectAt(r, c)
      });
    })));
  }
  window.GJBoard = Board;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/board.jsx", error: String((e && e.message) || e) }); }

// 04-screens/cam-nang-illus.jsx
try { (() => {
/* cam-nang-illus.jsx — "hình thật của game" illustrations for the Handbook
   detail popup. A shared MiniBoard + SpecialBlock built straight from the DS
   JellyBlock, plus a per-mechanic demo renderer. Exposes window.GJCamNangIllus.
   Style is INLINE var(--token) to match the kit. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    JellyBlock,
    Icon
  } = NS;
  const Extras = window.GJExtras || {};
  const COL = {
    Y: 'yellow',
    M: 'mint',
    P: 'pink',
    B: 'blue',
    S: 'stone'
  };

  /* Vua Thạch (Jelly King) royal-frame art — crowned jelly panel per colour,
     gem = that colour's emblem (star/leaf/heart/drop). Supplied PNG art. */
  const VUATHACH_SRC = {
    yellow: '../06-svg-assets/ui/vuathach-yellow.jpg',
    mint: '../06-svg-assets/ui/vuathach-mint.jpg',
    pink: '../06-svg-assets/ui/vuathach-pink.jpg',
    blue: '../06-svg-assets/ui/vuathach-blue.jpg'
  };
  function VuaThach({
    color = 'blue',
    size = 52
  }) {
    return /*#__PURE__*/React.createElement("img", {
      src: VUATHACH_SRC[color] || VUATHACH_SRC.blue,
      alt: "Vua Th\u1EA1ch",
      style: {
        width: size,
        height: size,
        display: 'block',
        borderRadius: Math.round(size * 0.20),
        boxShadow: '0 2px 5px var(--color-shadow-soft)'
      }
    });
  }

  /* Thạch Hoàng Gia (Royal Jelly, cấp 1) — royal-frame PNG art per colour.
     (Repurposed from the royal art; own copy so a later Vua Thạch swap is isolated.) */
  const HOANGGIA_SRC = {
    yellow: '../06-svg-assets/ui/hoanggia-yellow.jpg',
    mint: '../06-svg-assets/ui/hoanggia-mint.jpg',
    pink: '../06-svg-assets/ui/hoanggia-pink.jpg',
    blue: '../06-svg-assets/ui/hoanggia-blue.jpg'
  };
  function HoangGia({
    color = 'pink',
    size = 52
  }) {
    return /*#__PURE__*/React.createElement("img", {
      src: HOANGGIA_SRC[color] || HOANGGIA_SRC.pink,
      alt: "Th\u1EA1ch Ho\xE0ng Gia",
      style: {
        width: size,
        height: size,
        display: 'block',
        borderRadius: Math.round(size * 0.20),
        boxShadow: '0 2px 5px var(--color-shadow-soft)'
      }
    });
  }

  /* Thạch Cầu Vồng (Rainbow Jelly) + Hoàng Đế Cầu Vồng (Rainbow Emperor) —
     supplied PNG art. kind: 'rainbow' (sparkle) | 'emperor' (crowned). */
  const RAINBOW_SRC = {
    rainbow: '../06-svg-assets/ui/rainbow.jpg',
    emperor: '../06-svg-assets/ui/rainbowemperor.jpg'
  };
  function RainbowJelly({
    kind = 'rainbow',
    size = 52
  }) {
    const src = RAINBOW_SRC[kind] || RAINBOW_SRC.rainbow;
    const alt = kind === 'emperor' ? 'Hoàng Đế Cầu Vồng' : 'Thạch Cầu Vồng';
    // both are opaque full-bleed squares now — clip corners with border-radius.
    return /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: alt,
      style: {
        width: size,
        height: size,
        display: 'block',
        borderRadius: Math.round(size * 0.20),
        boxShadow: '0 2px 5px var(--color-shadow-soft)'
      }
    });
  }

  /* one 9-or-smaller grid drawn in the sunken board well. `rows` is an array
     of strings; chars: '.' empty · Y/M/P/B/S jelly · lowercase = same block
     but dimmed (faded, for "swept away" after-states). */
  function MiniBoard({
    rows,
    cell = 20,
    glow = null,
    dimColor = null
  }) {
    const gap = Math.max(2, Math.round(cell * 0.12));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-grid',
        gap,
        padding: gap + 2,
        gridTemplateColumns: `repeat(${rows[0].length}, ${cell}px)`,
        background: 'var(--color-surface-sunken)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'inset 0 1px 3px var(--color-shadow-soft)'
      }
    }, rows.flatMap((row, y) => row.split('').map((ch, x) => {
      const key = `${y}-${x}`;
      if (ch === '.') {
        return /*#__PURE__*/React.createElement("span", {
          key: key,
          style: {
            width: cell,
            height: cell,
            borderRadius: Math.round(cell * 0.20),
            background: 'var(--color-cell-empty)',
            boxShadow: 'inset 0 0 0 1.5px var(--color-cell-line)'
          }
        });
      }
      const faded = ch === ch.toLowerCase() && ch !== ch.toUpperCase();
      const color = COL[ch.toUpperCase()] || 'yellow';
      const isGlow = glow && glow.has(key);
      return /*#__PURE__*/React.createElement("div", {
        key: key,
        style: {
          width: cell,
          height: cell,
          opacity: faded ? 0.22 : 1,
          position: 'relative',
          filter: isGlow ? 'brightness(1.12)' : 'none'
        }
      }, isGlow && /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          inset: -3,
          borderRadius: Math.round(cell * 0.4),
          boxShadow: `0 0 0 2.5px var(--color-warning), 0 0 10px var(--color-warning)`,
          pointerEvents: 'none'
        }
      }), /*#__PURE__*/React.createElement(JellyBlock, {
        color: color,
        size: cell,
        showEyes: cell >= 22
      }));
    })));
  }

  /* A power-cell: super (★ badge), rainbow (conic block), or crowned rainbow.
     `lvl` 2 adds a small "2" pip. Built to sit in a MiniBoard footprint. */
  function SpecialBlock({
    type = 'super',
    color = 'pink',
    size = 40,
    lvl = 1
  }) {
    const r = Math.round(size * 0.28);
    const rainbow = type === 'rainbow' || type === 'crown';
    const pal = {
      yellow: ['#FFE3A3', '#E8B85C'],
      mint: ['#A3E5D9', '#5FC3B2'],
      pink: ['#F7A9C0', '#E576A0'],
      blue: ['#B3C7F7', '#7E9CE8']
    }[color] || ['#F7A9C0', '#E576A0'];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: size,
        height: size,
        borderRadius: r,
        boxSizing: 'border-box',
        background: rainbow ? 'conic-gradient(from 210deg, #F7A9C0, #FFE3A3, #A3E5D9, #B3C7F7, #F7A9C0)' : pal[0],
        border: `3px solid ${rainbow ? '#E576A0' : pal[1]}`,
        boxShadow: '0 0 0 3px var(--color-warning), var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 2,
        left: '14%',
        right: '14%',
        height: '32%',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '50%',
        filter: 'blur(0.5px)'
      }
    }), !rainbow && /*#__PURE__*/React.createElement("svg", {
      width: size * 0.5,
      height: size * 0.5,
      viewBox: "0 0 24 24",
      style: {
        position: 'relative',
        filter: 'drop-shadow(0 1px 0 rgba(90,70,54,0.25))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z",
      fill: "#FFF6DD",
      stroke: "#E2A82E",
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    })), rainbow && /*#__PURE__*/React.createElement("span", {
      style: {
        width: size * 0.34,
        height: size * 0.34,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.92)',
        boxShadow: '0 0 8px rgba(255,255,255,0.9)'
      }
    })), lvl === 2 && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        width: 19,
        height: 19,
        borderRadius: '50%',
        background: 'var(--color-surface)',
        border: '2px solid var(--color-warning)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 11,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-sm)'
      }
    }, "2"), type === 'crown' && Extras.Crown && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -size * 0.42,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    }, /*#__PURE__*/React.createElement(Extras.Crown, {
      size: size * 0.6
    })));
  }

  /* the gravity-flow arrow between a before & after state */
  function Flow({
    vertical = false
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-gravity)',
        flexShrink: 0,
        padding: vertical ? '2px 0' : '0 2px'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "26",
      height: "26",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.6",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        transform: vertical ? 'rotate(90deg)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 12h13M12 6l6 6-6 6"
    })));
  }
  function Stage({
    children,
    label
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, children, label && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-muted)'
      }
    }, label));
  }
  function Wrap({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flexWrap: 'wrap'
      }
    }, children);
  }

  // small D-Pad + gravity FAB cluster for the rotate explainer
  function GravityCluster({
    dir = 'left'
  }) {
    const arrow = {
      left: '←',
      right: '→',
      up: '↑',
      down: '↓'
    };
    const cellOf = d => /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: 7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 14,
        background: d === dir ? 'var(--color-surface)' : 'transparent',
        color: d === dir ? 'var(--color-gravity)' : 'rgba(255,255,255,0.85)',
        boxShadow: d === dir ? 'var(--shadow-sm)' : 'none',
        fontFamily: 'var(--font-display)'
      }
    }, arrow[d]);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '4px 8px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-gravity)',
        boxShadow: '0 4px 0 var(--color-gravity-edge), var(--shadow-sm)'
      }
    }, cellOf('left'), cellOf('up'), cellOf('down'), cellOf('right')), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 46,
        height: 46,
        borderRadius: '50%',
        background: 'var(--color-gravity)',
        boxShadow: '0 5px 0 var(--color-gravity-edge), var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 5,
        left: '26%',
        right: '26%',
        height: '22%',
        background: 'var(--color-gravity-shine)',
        opacity: 0.6,
        borderRadius: 999
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "rotateCw",
      size: 24,
      color: "var(--color-text-invert)",
      strokeWidth: 2.4
    })));
  }

  // ── per-mechanic demos, keyed by entry id ──────────────────────────────
  const DEMOS = {
    rotate: () => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "Tr\u01B0\u1EDBc"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 18,
      rows: ['....', '.P..', 'YP..', 'YMB.']
    })), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "Xoay \u2190"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 18,
      rows: ['....', '....', 'PP..', 'YPYM', '...B'].slice(0, 4)
    }))), /*#__PURE__*/React.createElement(GravityCluster, {
      dir: "left"
    })),
    clearLine: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "\u0110\u1EA7y 1 h\xE0ng"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 20,
      rows: ['.....', 'M.P.B', 'YMPBY']
    })), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "Bi\u1EBFn m\u1EA5t + \u0111i\u1EC3m"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 20,
      rows: ['.....', 'M.P.B', '.....']
    }))),
    fall: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "Sau khi x\xF3a"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 20,
      rows: ['Y.M.', '....', 'B.P.', '....']
    })), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "R\u01A1i xu\u1ED1ng"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 20,
      rows: ['....', '....', 'Y.M.', 'B.P.']
    }))),
    sticky: () => /*#__PURE__*/React.createElement(Stage, {
      label: "C\xF9ng m\xE0u \u2192 d\xEDnh th\xE0nh c\u1EE5m"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 22,
      rows: ['.MM.', 'MMM.', '.M.S']
    })),
    super: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 13,
      rows: ['PPPP']
    }), /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 13,
      rows: ['P', 'P', 'P', 'P']
    }), /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 13,
      rows: ['PPP', 'PPP', 'PPP']
    })), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "Th\u1EA1ch Ho\xE0ng Gia"
    }, /*#__PURE__*/React.createElement(HoangGia, {
      color: "pink",
      size: 56
    }))),
    rainbow: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "3\xD73 \u0111\u1EE7 ba m\xE0u"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 18,
      rows: ['YYY', 'MMM', 'BBB']
    })), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "Th\u1EA1ch C\u1EA7u V\u1ED3ng"
    }, /*#__PURE__*/React.createElement(RainbowJelly, {
      kind: "rainbow",
      size: 62
    }))),
    superL2: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "2 Th\u1EA1ch Ho\xE0ng Gia"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(HoangGia, {
      color: "blue",
      size: 46
    }), /*#__PURE__*/React.createElement(HoangGia, {
      color: "blue",
      size: 46
    }))), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "Vua Th\u1EA1ch"
    }, /*#__PURE__*/React.createElement(VuaThach, {
      color: "blue",
      size: 62
    }))),
    rainbowSuper: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "2 k\xEDp n\u1ED5"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(RainbowJelly, {
      kind: "rainbow",
      size: 40
    }), /*#__PURE__*/React.createElement(HoangGia, {
      color: "yellow",
      size: 40
    }))), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "Ho\xE0ng \u0110\u1EBF C\u1EA7u V\u1ED3ng"
    }, /*#__PURE__*/React.createElement(RainbowJelly, {
      kind: "emperor",
      size: 62
    }))),
    blastSuper: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "Qu\xE9t to\xE0n b\xE0n"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 16,
      glow: new Set(['0-1', '1-0', '1-3', '2-1', '3-2']),
      rows: ['.P.B', 'P.MP', 'BPYP', 'MMPB']
    })), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "S\u1EA1ch m\xE0u h\u1ED3ng"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 16,
      rows: ['...B', '..M.', 'B.Y.', 'MM.B']
    }))),
    blastSuperL2: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "C\xF9ng m\xE0u + v\xF9ng 5\xD75"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 15,
      glow: new Set(['1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-1', '3-2', '3-3']),
      rows: ['BMPYB', 'BYBPM', 'MYBYP', 'PBMBY', 'YPBMP']
    })), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "Qu\xE9t s\u1EA1ch"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 15,
      rows: ['BMPYB', 'B....', 'M....', 'P....', 'YPBMP']
    }))),
    blastRainbow: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "C\xE1c m\xE0u K\u1EC0 n\xF3"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 18,
      glow: new Set(['0-1', '1-0', '1-2', '2-1']),
      rows: ['.Y.', 'M*P', '.B.'].map(r => r.replace('*', 'P'))
    })), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "Qu\xE9t s\u1EA1ch m\xE0u k\u1EC1"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 18,
      rows: ['...', '...', '...']
    }))),
    blastRainbowSuper: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "B\xE0n \u0111\u1EA7y"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 15,
      rows: ['PMBYP', 'MPSYB', 'BYPMS', 'YBMPY', 'PMYBP']
    })), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "S\u1EA1ch tr\u01A1n (c\u1EA3 \u0111\xE1)"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 15,
      rows: ['.....', '.....', '.....', '.....', '.....']
    }))),
    comboTurn: () => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-gravity)',
        color: 'var(--color-text-invert)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 22,
        boxShadow: '0 5px 0 var(--color-gravity-edge), var(--shadow-md)'
      }
    }, "Combo \xD72"), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 46,
        height: 46,
        borderRadius: '50%',
        background: 'var(--color-gravity)',
        boxShadow: '0 5px 0 var(--color-gravity-edge), var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rotateCw",
      size: 24,
      color: "var(--color-text-invert)",
      strokeWidth: 2.4
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -7,
        right: -10,
        padding: '0 6px',
        height: 22,
        borderRadius: 999,
        background: 'var(--color-success)',
        color: 'var(--color-text-invert)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }
    }, "+1")))
  };
  function Illus({
    id
  }) {
    const fn = DEMOS[id] || DEMOS.sticky;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        padding: '4px 0'
      }
    }, fn());
  }
  window.GJCamNangIllus = {
    Illus,
    MiniBoard,
    SpecialBlock,
    HoangGia,
    VuaThach,
    RainbowJelly
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/cam-nang-illus.jsx", error: String((e && e.message) || e) }); }

// 04-screens/cam-nang-screen.jsx
try { (() => {
/* cam-nang-screen.jsx — CẨM NANG (Handbook). Collectible rule book with a
   rich hero header (mascot + progress), filter tabs, a "NÊN XEM" spotlight,
   and section grids of illustrated rule CARDS (board thumbnail + title +
   desc + "Đã xem"). Tapping an unlocked card opens a teach-style popup with a
   "real game" illustration. Locked cards stay dimmed & un-tappable.
   Exposes window.GJCamNangScreen. Inline var(--token) per screen convention. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Icon,
    JellyBlock
  } = NS;
  const {
    Illus,
    MiniBoard,
    SpecialBlock,
    HoangGia,
    VuaThach,
    RainbowJelly
  } = window.GJCamNangIllus;

  // Shared card look — drawn natively (no image). White surface, soft candy
  // shadow, thin warm border. Top-right corner is squared off so the CSS
  // dog-ear fold sits crisply in it.
  const cardStyle = (extra = {}) => ({
    position: 'relative',
    background: 'var(--color-surface)',
    borderRadius: '20px 0 20px 20px',
    border: '1.5px solid rgba(150,120,80,0.16)',
    boxShadow: 'var(--shadow-md)',
    ...extra
  });

  // Pure-CSS folded page corner (dog-ear) at the top-right. The card's own
  // top-right corner is squared (radius 0) so the flap sits flush in it. The
  // flap is a clip-path triangle covering exactly the corner, shaded like the
  // paper underside (lighter at the outer corner, darker toward the crease),
  // lifting off the card with a soft down-left shadow and a bright crease line.
  function Peel({
    size = 30
  }) {
    const diag = Math.round(size * 1.414);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
        background: 'linear-gradient(225deg, #F2E1C0 0%, #E7D2AE 52%, #D6BC90 100%)',
        borderTopRightRadius: 3,
        filter: 'drop-shadow(-2px 3px 2.5px rgba(120,92,52,0.30))'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: diag,
        height: 2,
        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 28%, rgba(255,255,255,0.85) 72%, rgba(255,255,255,0) 100%)',
        borderRadius: 2,
        transformOrigin: 'top left',
        transform: 'rotate(45deg)'
      }
    }));
  }
  const ORDER = ['CƠ BẢN', 'SIÊU KHỐI', 'KÍCH NỔ', 'COMBO'];
  const GROUP_LABEL = {
    'CƠ BẢN': 'Cơ bản',
    'SIÊU KHỐI': 'Hoàng gia',
    'KÍCH NỔ': 'Kích nổ',
    COMBO: 'Mẹo'
  };
  const GROUP_JELLY = {
    'CƠ BẢN': 'mint',
    'SIÊU KHỐI': 'yellow',
    'KÍCH NỔ': 'pink',
    COMBO: 'blue'
  };
  const TABS = [{
    key: 'all',
    label: 'Tất cả',
    color: 'yellow'
  }].concat(ORDER.map(g => ({
    key: g,
    label: GROUP_LABEL[g],
    color: GROUP_JELLY[g]
  })));

  // ── small building blocks ───────────────────────────────────────────────

  // scalloped badge (Mới / Quan trọng)
  function Seal({
    children,
    tone = 'warning'
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        background: `var(--color-${tone})`,
        color: 'var(--color-text-on-block)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 12,
        lineHeight: 1.05,
        textAlign: 'center',
        boxShadow: `0 3px 0 rgba(180,140,40,0.35), var(--shadow-sm)`,
        border: '2px solid rgba(255,255,255,0.7)',
        whiteSpace: 'pre-line'
      }
    }, children);
  }
  function SeenTag() {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 12,
        color: 'var(--color-text-muted)',
        whiteSpace: 'nowrap'
      }
    }, "\u0110\xE3 xem", /*#__PURE__*/React.createElement("span", {
      style: {
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: 'var(--color-success)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12,
      color: "var(--color-text-invert)",
      strokeWidth: 3
    })));
  }
  const LockGlyph = ({
    size = 20
  }) => /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "4.5",
    y: "10.5",
    width: "15",
    height: "10",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 10.5V7a4 4 0 0 1 8 0v3.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "15",
    r: "1.3",
    fill: "currentColor",
    stroke: "none"
  }));

  // ── mascot holding a little book ─────────────────────────────────────────
  function MascotBook({
    size = 62
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        filter: 'drop-shadow(0 6px 8px rgba(120,92,52,0.22))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "pink",
      size: size,
      expression: "happy"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -6,
        bottom: 2,
        width: size * 0.5,
        height: size * 0.4,
        borderRadius: 6,
        background: 'var(--color-block-yellow)',
        border: '2.5px solid var(--color-block-yellow-edge)',
        transform: 'rotate(-8deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 3,
        top: 3,
        bottom: 3,
        width: 3,
        borderRadius: 2,
        background: 'var(--color-block-yellow-shine)'
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: size * 0.2,
      color: "var(--color-warning)",
      strokeWidth: 0,
      style: {
        fill: 'var(--color-warning)'
      }
    })));
  }

  // ── header hero card ─────────────────────────────────────────────────────
  function HeaderCard({
    count,
    total,
    onBack
  }) {
    const frac = Math.max(0, Math.min(1, total ? count / total : 0));
    return /*#__PURE__*/React.createElement("div", {
      style: cardStyle({
        padding: '14px 16px'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onBack,
      "aria-label": "Quay l\u1EA1i",
      style: {
        width: 44,
        height: 44,
        flexShrink: 0,
        borderRadius: '50%',
        border: '2px solid var(--color-cell-line)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-sm)',
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "back",
      size: 22,
      strokeWidth: 2.6
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 26,
        lineHeight: 1.02,
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, "C\u1EA9m nang"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '3px 0 0',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 13,
        color: 'var(--color-text-muted)'
      }
    }, "M\u1EB9o nh\u1ECF \u0111\u1EC3 ph\xE1 m\xE0n kh\xF3")), /*#__PURE__*/React.createElement(MascotBook, {
      size: 56
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        marginTop: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--color-surface-sunken)',
        borderRadius: 'var(--radius-full)',
        padding: '6px 10px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 12.5,
        color: 'var(--color-text-muted)',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }
    }, "\u0110\xE3 m\u1EDF ", count, "/", total), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        height: 12,
        borderRadius: 999,
        background: '#E6D7BE',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        width: `${frac * 100}%`,
        height: '100%',
        borderRadius: 999,
        background: 'linear-gradient(180deg, var(--color-gravity-shine), var(--color-gravity))',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.35)'
      }
    }))));
  }

  // ── filter tabs ──────────────────────────────────────────────────────────
  function FilterTabs({
    value,
    onChange
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        padding: '2px 2px 4px',
        margin: '0 -2px',
        scrollbarWidth: 'none'
      }
    }, TABS.map(t => {
      const active = value === t.key;
      return /*#__PURE__*/React.createElement("button", {
        key: t.key,
        type: "button",
        onClick: () => onChange(t.key),
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          flexShrink: 0,
          padding: '7px 14px 7px 8px',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          border: active ? 'none' : '2px solid var(--color-cell-line)',
          background: active ? 'var(--color-primary)' : 'var(--color-surface)',
          color: active ? 'var(--color-text-invert)' : 'var(--color-text)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 14,
          whiteSpace: 'nowrap',
          boxShadow: active ? '0 4px 0 var(--color-primary-edge), var(--shadow-sm)' : 'var(--shadow-sm)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 24,
          height: 24,
          flexShrink: 0,
          display: 'inline-flex'
        }
      }, /*#__PURE__*/React.createElement(JellyBlock, {
        color: t.color,
        size: 24
      })), t.label);
    }));
  }

  // ── section header pill ───────────────────────────────────────────────────
  function SectionHeader({
    group
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        padding: '6px 16px 6px 8px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        margin: '4px 0 12px',
        alignSelf: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 28,
        height: 28,
        display: 'inline-flex'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: GROUP_JELLY[group],
      size: 28
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 19,
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, GROUP_LABEL[group]));
  }

  // ── thumbnails (a mini board / power block per rule) ──────────────────────
  function ThumbWell({
    children,
    tint,
    h = 88
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: h,
        borderRadius: 'var(--radius-md)',
        background: tint || 'var(--color-cell-empty)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 3px var(--color-shadow-soft)'
      }
    }, children);
  }
  function Thumb({
    id,
    group
  }) {
    switch (id) {
      case 'rotate':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(MiniBoard, {
          cell: 15,
          rows: ['.Y..', '.PB.', 'YPBM']
        }));
      case 'clearLine':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(MiniBoard, {
          cell: 14,
          glow: new Set(['1-0', '1-1', '1-2', '1-3', '1-4']),
          rows: ['..Y..', 'MYPBM']
        }));
      case 'fall':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(MiniBoard, {
          cell: 15,
          rows: ['Y.M.', '....', 'B.PY']
        }));
      case 'sticky':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(MiniBoard, {
          cell: 16,
          rows: ['.MM.', 'MMM.', '.M.S']
        }));
      case 'rainbow':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(RainbowJelly, {
          kind: "rainbow",
          size: 52
        }));
      case 'super':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(HoangGia, {
          color: "pink",
          size: 52
        }));
      case 'superL2':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(VuaThach, {
          color: "blue",
          size: 52
        }));
      case 'rainbowSuper':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(RainbowJelly, {
          kind: "emperor",
          size: 52
        }));
      case 'blastSuper':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(MiniBoard, {
          cell: 13,
          glow: new Set(['0-1', '1-0', '1-3', '2-1', '3-2']),
          rows: ['.P.B', 'P.MP', 'BPYP', 'MMPB']
        }));
      case 'blastSuperL2':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(MiniBoard, {
          cell: 13,
          glow: new Set(['1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-1', '3-2', '3-3']),
          rows: ['BMPYB', 'BYBPM', 'MYBYP', 'PBMBY', 'YPBMP']
        }));
      case 'blastRainbow':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }
        }, /*#__PURE__*/React.createElement(RainbowJelly, {
          kind: "rainbow",
          size: 44
        }), /*#__PURE__*/React.createElement(MiniBoard, {
          cell: 13,
          rows: ['Y', 'M', 'B']
        })));
      case 'blastRainbowSuper':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(RainbowJelly, {
          kind: "emperor",
          size: 50
        }));
      case 'comboTurn':
        return /*#__PURE__*/React.createElement(ThumbWell, {
          tint: "var(--color-block-blue-shine)"
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-gravity)',
            color: 'var(--color-text-invert)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 18,
            boxShadow: '0 4px 0 var(--color-gravity-edge)'
          }
        }, "\xD72"), /*#__PURE__*/React.createElement("span", {
          style: {
            marginLeft: 8,
            padding: '3px 9px',
            borderRadius: 999,
            background: 'var(--color-success)',
            color: 'var(--color-text-invert)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 14
          }
        }, "+1"));
      default:
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(MiniBoard, {
          cell: 16,
          rows: ['.MM.', 'MMM.', '.M.S']
        }));
    }
  }

  // ── the "NÊN XEM" spotlight ────────────────────────────────────────────────
  function Spotlight({
    entry,
    onOpen
  }) {
    if (!entry) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: cardStyle({
        padding: '16px 18px'
      })
    }, /*#__PURE__*/React.createElement(Peel, {
      size: 30
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 4
      }
    }, /*#__PURE__*/React.createElement(Seal, {
      tone: "warning"
    }, "M\u1EDBi")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        gap: 14,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 120,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Thumb, {
      id: entry.id,
      group: entry.group
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-gravity)',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 13,
      color: "var(--color-gravity)",
      style: {
        fill: 'var(--color-gravity)'
      },
      strokeWidth: 0
    }), " N\xCAN XEM"), /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: '3px 0 4px',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 23,
        lineHeight: 1.05,
        color: 'var(--color-text)'
      }
    }, entry.title), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 12px',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 13.5,
        lineHeight: 1.3,
        color: 'var(--color-text-muted)',
        textWrap: 'pretty'
      }
    }, entry.desc), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onOpen(entry.id),
      style: {
        position: 'relative',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        cursor: 'pointer',
        padding: '10px 22px',
        background: 'var(--color-primary)',
        color: 'var(--color-text-invert)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 16,
        whiteSpace: 'nowrap',
        boxShadow: '0 5px 0 var(--color-primary-edge), var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 3,
        left: '18%',
        right: '18%',
        height: '30%',
        background: 'var(--color-primary-shine)',
        opacity: 0.5,
        borderRadius: 999
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative'
      }
    }, "Xem m\u1EB9o")))));
  }

  // ── wide "important" rule card (section hero) ─────────────────────────────
  function WideCard({
    entry,
    seen,
    onOpen
  }) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onOpen(entry.id),
      style: cardStyle({
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        border: '1.5px solid rgba(150,120,80,0.16)',
        padding: '16px 18px',
        marginBottom: 14,
        display: 'flex',
        gap: 14,
        alignItems: 'center'
      })
    }, /*#__PURE__*/React.createElement(Peel, {
      size: 30
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 4
      }
    }, /*#__PURE__*/React.createElement(Seal, {
      tone: "warning"
    }, 'Quan\ntrọng')), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 120,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Thumb, {
      id: entry.id,
      group: entry.group
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: '0 0 4px',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        lineHeight: 1.05,
        color: 'var(--color-text)'
      }
    }, entry.title), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 8px',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 13.5,
        lineHeight: 1.3,
        color: 'var(--color-text-muted)',
        textWrap: 'pretty'
      }
    }, entry.desc), seen && /*#__PURE__*/React.createElement(SeenTag, null)));
  }

  // ── 2-col rule card ────────────────────────────────────────────────────────
  function EntryCard({
    entry,
    seen,
    onOpen
  }) {
    if (!entry.unlocked) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 16px',
          background: 'var(--color-surface-sunken)',
          border: '1.5px solid rgba(150,120,80,0.14)',
          opacity: 0.85
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: 88,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-surface-sunken)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          color: 'var(--color-text-muted)'
        }
      }, /*#__PURE__*/React.createElement(LockGlyph, {
        size: 26
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 10,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 16,
          color: 'var(--color-text-muted)'
        }
      }, "Ch\u01B0a m\u1EDF kho\xE1"), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 2,
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: 12.5,
          color: 'var(--color-text-muted)'
        }
      }, "Ch\u01A1i ti\u1EBFp \u0111\u1EC3 m\u1EDF"));
    }
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onOpen(entry.id),
      style: cardStyle({
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        width: '100%',
        cursor: 'pointer',
        border: '1.5px solid rgba(150,120,80,0.16)',
        padding: '14px 16px'
      })
    }, /*#__PURE__*/React.createElement(Peel, {
      size: 26
    }), /*#__PURE__*/React.createElement(Thumb, {
      id: entry.id,
      group: entry.group
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 17,
        lineHeight: 1.08,
        color: 'var(--color-text)'
      }
    }, entry.title), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        flex: 1,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 12.5,
        lineHeight: 1.3,
        color: 'var(--color-text-muted)',
        textWrap: 'pretty'
      }
    }, entry.desc), seen && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(SeenTag, null)));
  }
  function CardGrid({
    list,
    seenSet,
    onOpen
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 8
      }
    }, list.map(e => /*#__PURE__*/React.createElement(EntryCard, {
      key: e.id,
      entry: e,
      seen: seenSet.has(e.id),
      onOpen: onOpen
    })));
  }

  // ── detail popup (teach card) ──────────────────────────────────────────────
  function DetailDialog({
    entry,
    hasNext,
    onNext,
    onClose
  }) {
    if (!entry) return null;
    const hiColor = entry.group === 'COMBO' || entry.id === 'rotate' ? 'var(--color-gravity)' : 'var(--color-primary)';
    const parts = entry.hi && entry.body.includes(entry.hi) ? entry.body.split(entry.hi) : [entry.body];
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClose,
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--color-overlay)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
        zIndex: 50,
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: {
        width: '100%',
        maxWidth: 320,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-xl)',
        boxShadow: 'var(--shadow-lg)',
        boxSizing: 'border-box',
        animation: 'gj-cn-pop 300ms var(--ease-jelly) both'
      }
    }, /*#__PURE__*/React.createElement("style", null, `@keyframes gj-cn-pop{0%{transform:scale(0.85) translateY(8px);opacity:0}60%{transform:scale(1.03) translateY(0);opacity:1}100%{transform:scale(1)}}`), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-lg)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface-sunken)',
        color: 'var(--color-gravity)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: entry.icon,
      size: 22
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        flex: 1,
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-heading)',
        color: 'var(--color-text)'
      }
    }, entry.title), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClose,
      "aria-label": "\u0110\xF3ng",
      style: {
        width: 32,
        height: 32,
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: 'transparent',
        color: 'var(--color-text-muted)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 20
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg) var(--space-md)',
        marginBottom: 'var(--space-lg)',
        minHeight: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Illus, {
      id: entry.id
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 var(--space-lg)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 'var(--text-body)',
        lineHeight: 'var(--leading-body)',
        color: 'var(--color-text)',
        textWrap: 'pretty'
      }
    }, parts[0], parts.length > 1 && /*#__PURE__*/React.createElement("strong", {
      style: {
        color: hiColor,
        fontWeight: 800
      }
    }, entry.hi), parts[1]), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: hasNext ? onNext : onClose,
      style: {
        position: 'relative',
        width: '100%',
        minHeight: 'var(--dim-cta-h)',
        border: 'none',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-gravity)',
        color: 'var(--color-text-invert)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-heading)',
        cursor: 'pointer',
        boxShadow: '0 5px 0 var(--color-gravity-edge), var(--shadow-sm)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 3,
        left: '16%',
        right: '16%',
        height: '32%',
        background: 'var(--color-gravity-shine)',
        opacity: 0.45,
        borderRadius: 999
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative'
      }
    }, hasNext ? 'Tiếp theo' : 'Đã hiểu'), hasNext && /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 22,
      color: "var(--color-text-invert)",
      style: {
        position: 'relative'
      }
    }))));
  }

  // ── screen ─────────────────────────────────────────────────────────────────
  // groups whose first unlocked entry is shown as a wide "important" hero
  const HERO_GROUP = {
    'SIÊU KHỐI': 'super'
  };
  function CamNangScreen({
    entries = [],
    unlockedCount = 0,
    defaultOpenId = null,
    onOpen,
    onBack
  }) {
    const [openId, setOpenId] = React.useState(defaultOpenId);
    const [filter, setFilter] = React.useState('all');
    const total = entries.length;
    const open = id => {
      setOpenId(id);
      onOpen && onOpen(id);
    };
    const unlocked = entries.filter(e => e.unlocked);
    const seenSet = new Set(unlocked.map(e => e.id)); // demo: unlocked = seen
    const curIdx = unlocked.findIndex(e => e.id === openId);
    const next = curIdx >= 0 && curIdx < unlocked.length - 1 ? unlocked[curIdx + 1] : null;
    const cur = entries.find(e => e.id === openId) || null;
    const spotlight = entries.find(e => e.id === 'rotate' && e.unlocked) || unlocked[0] || null;
    const visibleGroups = (filter === 'all' ? ORDER : [filter]).map(g => [g, entries.filter(e => e.group === g)]).filter(([, list]) => list.length);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'url(../06-svg-assets/backgrounds/cam-nang-bg.webp) center top / cover no-repeat, var(--color-bg)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 14px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(HeaderCard, {
      count: unlockedCount,
      total: total,
      onBack: onBack
    }), /*#__PURE__*/React.createElement(FilterTabs, {
      value: filter,
      onChange: setFilter
    }), filter === 'all' && /*#__PURE__*/React.createElement(Spotlight, {
      entry: spotlight,
      onOpen: open
    }), visibleGroups.map(([g, list]) => {
      const heroId = HERO_GROUP[g];
      const hero = heroId ? list.find(e => e.id === heroId && e.unlocked) : null;
      const rest = hero ? list.filter(e => e.id !== hero.id) : list;
      return /*#__PURE__*/React.createElement("div", {
        key: g
      }, /*#__PURE__*/React.createElement(SectionHeader, {
        group: g
      }), hero && /*#__PURE__*/React.createElement(WideCard, {
        entry: hero,
        seen: seenSet.has(hero.id),
        onOpen: open
      }), /*#__PURE__*/React.createElement(CardGrid, {
        list: rest,
        seenSet: seenSet,
        onOpen: open
      }));
    }))), /*#__PURE__*/React.createElement(DetailDialog, {
      entry: cur,
      hasNext: !!next,
      onNext: () => next && open(next.id),
      onClose: () => setOpenId(null)
    }));
  }

  // canonical 13-entry data (id matches the illustration demo keys)
  CamNangScreen.ENTRIES = [{
    id: 'rotate',
    icon: 'rotate',
    group: 'CƠ BẢN',
    title: 'Xoay trọng lực',
    desc: 'Đổi hướng rơi để mở đường mới',
    body: 'Bấm nút xoay để đổi hướng trọng lực 90°. D-Pad chỉ hướng sẽ rơi — toàn bộ khối trên bàn đổ theo.',
    hi: 'đổi hướng trọng lực 90°'
  }, {
    id: 'clearLine',
    icon: 'check',
    group: 'CƠ BẢN',
    title: 'Xóa hàng/cột',
    desc: 'Lấp đầy để dọn bàn',
    body: 'Lấp đầy trọn một hàng hoặc một cột — 9 ô, màu nào cũng được — để cả dãy biến mất và cộng điểm.',
    hi: '9 ô, màu nào cũng được'
  }, {
    id: 'fall',
    icon: 'chevron',
    group: 'CƠ BẢN',
    title: 'Trọng lực rơi',
    desc: 'Cụm jelly rơi cùng nhau',
    body: 'Sau mỗi lần xóa, các khối phía trên rơi xuống theo trọng lực, dừng khi chạm khối khác hoặc đáy bàn.',
    hi: 'rơi xuống theo trọng lực'
  }, {
    id: 'sticky',
    icon: 'heart',
    group: 'CƠ BẢN',
    title: 'Thạch dính',
    desc: 'Cùng màu sẽ dính thành cụm',
    body: 'Các khối thạch cùng màu dính lại thành một cụm. Chỉ cần một ô bị chặn, cả cụm cùng dừng.',
    hi: 'dính lại thành một cụm'
  }, {
    id: 'super',
    icon: 'star',
    group: 'SIÊU KHỐI',
    title: 'Thạch Hoàng Gia',
    desc: 'Ghép hàng, cột hoặc 3×3 cùng màu',
    body: 'Lấp đầy một hàng, một cột hoặc một khối 3×3 toàn cùng một màu để tạo ra Thạch Hoàng Gia.',
    hi: 'Thạch Hoàng Gia'
  }, {
    id: 'rainbow',
    icon: 'heart',
    group: 'SIÊU KHỐI',
    title: 'Thạch Cầu Vồng',
    desc: 'Ghép đủ ba màu → Thạch Cầu Vồng',
    body: 'Xếp khối 3×3 đủ ba màu — mỗi màu một hàng hoặc một cột — để tạo Thạch Cầu Vồng.',
    hi: 'Thạch Cầu Vồng'
  }, {
    id: 'superL2',
    icon: 'trophy',
    group: 'SIÊU KHỐI',
    title: 'Vua Thạch',
    desc: 'Ghép 2 Thạch Hoàng Gia cùng màu',
    body: 'Đặt hai Thạch Hoàng Gia cùng màu dính cạnh nhau, chúng hợp thành Vua Thạch mạnh hơn.',
    hi: 'Vua Thạch'
  }, {
    id: 'rainbowSuper',
    icon: 'trophy',
    group: 'SIÊU KHỐI',
    title: 'Hoàng Đế Cầu Vồng',
    desc: 'Ghép 2 kíp nổ khác màu',
    body: 'Ghép hai kíp nổ khác màu để tạo Hoàng Đế Cầu Vồng đội vương miện — sức mạnh tối thượng.',
    hi: 'Hoàng Đế Cầu Vồng'
  }, {
    id: 'blastSuper',
    icon: 'star',
    group: 'KÍCH NỔ',
    title: 'Nổ Thạch Hoàng Gia',
    desc: 'Quét sạch mọi ô cùng màu',
    body: 'Khi Thạch Hoàng Gia bị cuốn vào hàng hoặc cột đang xóa, nó quét sạch mọi ô cùng màu trên toàn bàn.',
    hi: 'quét sạch mọi ô cùng màu'
  }, {
    id: 'blastSuperL2',
    icon: 'trophy',
    group: 'KÍCH NỔ',
    title: 'Nổ Vua Thạch',
    desc: 'Cùng màu + cả vùng 5×5',
    body: 'Vua Thạch quét sạch toàn bộ ô cùng màu và cả vùng 5×5 quanh tâm điểm nổ.',
    hi: 'vùng 5×5 quanh tâm'
  }, {
    id: 'blastRainbow',
    icon: 'heart',
    group: 'KÍCH NỔ',
    title: 'Nổ Thạch Cầu Vồng',
    desc: 'Quét các màu đang kề nó',
    body: 'Thạch Cầu Vồng khi nổ sẽ quét sạch mọi ô thuộc các màu đang kề ngay cạnh nó.',
    hi: 'các màu đang kề'
  }, {
    id: 'blastRainbowSuper',
    icon: 'trophy',
    group: 'KÍCH NỔ',
    title: 'Nổ Hoàng Đế Cầu Vồng',
    desc: 'Xóa sạch toàn bàn (cả đá)',
    body: 'Kỹ năng tối thượng — Hoàng Đế Cầu Vồng xóa sạch toàn bàn, kể cả những khối đá cố định.',
    hi: 'xóa sạch toàn bàn'
  }, {
    id: 'comboTurn',
    icon: 'rotateCw',
    group: 'COMBO',
    title: 'Combo hồi lượt xoay',
    desc: 'Combo ×2 trở lên → +1 lượt xoay',
    body: 'Đạt combo ×2 trở lên sẽ hồi +1 lượt xoay; combo càng dài, số lượt xoay hồi lại càng nhiều.',
    hi: '+1 lượt xoay'
  }];
  window.GJCamNangScreen = CamNangScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/cam-nang-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/daily-reward-screen.jsx
try { (() => {
/* daily-reward-screen.jsx — DAILY REWARD. 7-day streak: claimed days, today
   (claimable), locked future days; streak header; Claim CTA. Exposes
   window.GJDailyRewardScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Button,
    Icon
  } = NS;
  const EX = window.GJExtras;
  const DAYS = [{
    coins: 50
  }, {
    coins: 80
  }, {
    coins: 120
  }, {
    booster: 'rotate',
    label: '+3 Xoay'
  }, {
    coins: 200
  }, {
    coins: 300
  }, {
    booster: 'gift',
    label: 'Rương lớn',
    big: true
  }];
  function DayCard({
    index,
    day,
    state
  }) {
    const claimed = state === 'claimed',
      today = state === 'today',
      locked = state === 'locked';
    const big = day.big;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        gridColumn: big ? 'span 3' : 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: big ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: big ? 'var(--space-md)' : 4,
        padding: big ? 'var(--space-md)' : '10px 4px',
        minHeight: big ? 64 : 84,
        borderRadius: 'var(--radius-lg)',
        background: today ? 'var(--color-surface)' : claimed ? 'color-mix(in srgb, var(--color-success) 14%, var(--color-surface))' : 'var(--color-surface-sunken)',
        boxShadow: today ? '0 0 0 3px var(--color-primary), var(--shadow-md)' : 'var(--shadow-sm)',
        opacity: locked ? 0.6 : 1,
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.06em',
        color: 'var(--color-text-muted)',
        position: big ? 'static' : 'absolute',
        top: 6
      }
    }, big ? 'NGÀY 7' : `NGÀY ${index + 1}`), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: big ? 0 : 14,
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, day.booster === 'gift' ? /*#__PURE__*/React.createElement(EX.Gift, {
      size: big ? 34 : 28,
      color: "var(--color-primary)"
    }) : day.booster ? /*#__PURE__*/React.createElement(Icon, {
      name: "rotateCw",
      size: 28,
      color: "var(--color-gravity)"
    }) : /*#__PURE__*/React.createElement(EX.Coin, {
      size: big ? 34 : 30
    }), big && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)'
      }
    }, day.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 11,
        color: 'var(--color-text-muted)'
      }
    }, "Ph\u1EA7n th\u01B0\u1EDFng \u0111\u1EB7c bi\u1EC7t"))), !big && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 13,
        color: 'var(--color-text)'
      }
    }, day.label || `+${day.coins}`), claimed && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'color-mix(in srgb, var(--color-success) 20%, transparent)',
        borderRadius: 'var(--radius-lg)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: 'var(--color-success)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16,
      color: "#fff"
    }))));
  }
  function DailyRewardScreen({
    streak = 4,
    onClaim,
    onClose
  }) {
    // days before `streak`-1 claimed, day index streak-1 = today, rest locked
    const stateFor = i => i < streak - 1 ? 'claimed' : i === streak - 1 ? 'today' : 'locked';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'var(--space-xl)',
        boxSizing: 'border-box',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClose,
      "aria-label": "\u0110\xF3ng",
      style: {
        position: 'absolute',
        top: 'var(--space-md)',
        right: 'var(--space-md)',
        width: 'var(--dim-icon-btn)',
        height: 'var(--dim-icon-btn)',
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--color-text-muted)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        marginBottom: 'var(--space-lg)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement(EX.Calendar, {
      size: 26,
      color: "var(--color-primary)"
    }), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-title)',
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, "Qu\xE0 m\u1ED7i ng\xE0y")), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-muted)'
      }
    }, "Chu\u1ED7i ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--color-primary)'
      }
    }, streak, " ng\xE0y"), " \xB7 quay l\u1EA1i m\u1ED7i ng\xE0y \u0111\u1EC3 nh\u1EADn nhi\u1EC1u h\u01A1n")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-xl)'
      }
    }, DAYS.map((d, i) => /*#__PURE__*/React.createElement(DayCard, {
      key: i,
      index: i,
      day: d,
      state: stateFor(i)
    }))), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "cta",
      icon: "star",
      fullWidth: true,
      onClick: onClaim
    }, "NH\u1EACN QU\xC0 H\xD4M NAY"));
  }
  window.GJDailyRewardScreen = DailyRewardScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/daily-reward-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/home-screen.jsx
try { (() => {
/* home-screen.jsx — official Home (endless-only), using the supplied game-art
   PNGs (logo, candy button surfaces, icons). Simple vertical composition over
   the meadow background; no panel behind the controls. Corner palette button
   opens the customize sheet (scene/background + score-locked music).
   Exposes window.GJHomeScreen (alias GJHomeScreenV2). */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Icon
  } = NS;
  const {
    useState
  } = React;
  const UI = '../06-svg-assets/ui/';
  const BGDIR = '../06-svg-assets/backgrounds/';
  const ART = {
    logo: UI + 'home-logo-t.png',
    play: UI + 'home-btn-play-t.png',
    creamLg: UI + 'home-btn-cream-lg-t.png',
    creamSm: UI + 'home-btn-cream-sm-t.png',
    icPlay: UI + 'ic-play-n.png',
    icGuide: UI + 'ic-guide-n.png',
    icTrophy: UI + 'ic-trophy-n.png',
    icSettings: UI + 'ic-settings-n.png',
    icPalette: UI + 'ic-palette-n.png'
  };
  const SCENES = [{
    id: 'meadow',
    name: 'Đồng cỏ',
    bg: BGDIR + 'meadow-bg.webp',
    track: 'Đồng cỏ ban mai',
    unlockAt: 0
  }, {
    id: 'forest',
    name: 'Khu rừng',
    bg: BGDIR + 'forest-bg.webp',
    track: 'Rừng thì thầm',
    unlockAt: 6000
  }, {
    id: 'waterfall',
    name: 'Thác nước',
    bg: BGDIR + 'waterfall-bg.webp',
    track: 'Thác ngọc bích',
    unlockAt: 40000
  }];
  const fmtInt = n => n.toLocaleString('vi-VN');
  // Vietnamese-safe rounded display stack (Baloo 2 has full VN coverage, avoids
  // per-glyph Fredoka→fallback mixing on horned uppercase like Ơ/Ư).
  const DISPLAY = "'Baloo 2', 'Fredoka', system-ui, sans-serif";

  /* inline SVG glyphs (no images) */
  const PlayGlyph = ({
    s = 26
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 5.5c0-1.1 1.15-1.78 2.1-1.22l9 5.4c.93.56.93 1.9 0 2.46l-9 5.4C9.15 18.1 8 17.42 8 16.32z",
    fill: "#fff"
  }));
  const PaletteGlyph = ({
    s = 30
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3C6.8 3 3 6.7 3 11.4c0 4 3 6.4 6.2 6.4 1.6 0 2.2-1 2.2-1.9 0-.5-.3-.9-.6-1.3-.3-.4-.5-.7-.5-1.2 0-.9.7-1.6 1.7-1.6h2c2.9 0 5-2.1 5-5C21 5.9 17.2 3 12 3z",
    fill: "#FFFFFF",
    stroke: "#7E6CF0",
    strokeWidth: "1.6",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7.6",
    cy: "10.4",
    r: "1.5",
    fill: "#5FC3B2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "7.2",
    r: "1.5",
    fill: "#E8B85C"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15.4",
    cy: "8.4",
    r: "1.5",
    fill: "#7E6CF0"
  }));

  /* ── Logo placeholder — supplied art, standalone ──────────────────────── */
  function LogoMark() {
    return /*#__PURE__*/React.createElement("img", {
      src: ART.logo,
      alt: "Gravity Jelly",
      style: {
        width: 250,
        maxWidth: '78%',
        height: 'auto',
        display: 'block',
        filter: 'drop-shadow(0 6px 12px rgba(60,44,24,0.28))',
        userSelect: 'none'
      }
    });
  }

  /* ── Primary CTA — pure-CSS tangerine candy button ───────────────────── */
  function PlayButton({
    label = 'CHƠI NGAY',
    disabled = false,
    onClick
  }) {
    const [press, setPress] = useState(false);
    const down = press && !disabled;
    const fill = disabled ? 'linear-gradient(180deg,#D8CDBB,#C9BCA8)' : 'linear-gradient(180deg,#FFC59A,#FF9F68)';
    const edge = disabled ? '#A89A82' : '#E97E45';
    const edgeH = down ? 2 : 6;
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: disabled ? undefined : onClick,
      disabled: disabled,
      "aria-label": label,
      onPointerDown: () => setPress(true),
      onPointerUp: () => setPress(false),
      onPointerLeave: () => setPress(false),
      style: {
        position: 'relative',
        width: 254,
        height: 68,
        borderRadius: 28,
        border: 'none',
        background: fill,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        overflow: 'hidden',
        boxShadow: disabled ? `0 ${edgeH}px 0 ${edge}, 0 5px 11px rgba(120,92,52,0.14), inset 0 2px 1px rgba(255,255,255,0.4), inset 0 -7px 10px rgba(180,90,40,0.28)` : `0 ${edgeH}px 0 ${edge}, 0 10px 20px rgba(233,126,69,0.42), 0 2px 4px rgba(233,126,69,0.3), inset 0 2px 1px rgba(255,255,255,0.65), inset 0 -8px 12px rgba(200,96,44,0.35)`,
        transform: down ? 'translateY(4px)' : 'translateY(0)',
        transition: 'transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)',
        WebkitTapHighlightColor: 'transparent'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        top: 3,
        left: '6%',
        right: '6%',
        height: '46%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0))',
        opacity: disabled ? 0.4 : 1,
        borderRadius: '24px 24px 46% 46% / 24px 24px 90% 90%',
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex',
        filter: disabled ? 'grayscale(0.6)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: ART.icPlay,
      alt: "",
      style: {
        width: 30,
        height: 30,
        objectFit: 'contain',
        filter: 'drop-shadow(0 1px 2px rgba(180,90,40,0.4))'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 23,
        color: '#fff',
        letterSpacing: '0.01em',
        textShadow: '0 2px 3px rgba(180,90,40,0.45)'
      }
    }, label));
  }

  /* ── Secondary nav — pure-CSS cream candy button ─────────────────────── */
  function NavButton({
    iconSrc,
    label,
    disabled = false,
    onClick
  }) {
    const [press, setPress] = useState(false);
    const down = press && !disabled;
    const fill = disabled ? 'linear-gradient(180deg,#EFE7D8,#E0D6C4)' : 'linear-gradient(180deg,#FFFFFF,#FFF7EC)';
    const edge = disabled ? '#C4B69E' : '#EBDCC4';
    const edgeH = down ? 2 : 5;
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: disabled ? undefined : onClick,
      disabled: disabled,
      "aria-label": label,
      onPointerDown: () => setPress(true),
      onPointerUp: () => setPress(false),
      onPointerLeave: () => setPress(false),
      style: {
        position: 'relative',
        width: 92,
        height: 84,
        borderRadius: 22,
        border: 'none',
        background: fill,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        boxShadow: `0 ${edgeH}px 0 ${edge}, 0 7px 14px rgba(120,92,52,0.2)`,
        transform: down ? 'translateY(3px)' : 'translateY(0)',
        transition: 'transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)',
        WebkitTapHighlightColor: 'transparent'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        top: 5,
        left: '24%',
        right: '24%',
        height: 11,
        background: '#fff',
        opacity: 0.8,
        borderRadius: 999,
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: iconSrc,
      alt: "",
      style: {
        position: 'relative',
        width: 38,
        height: 38,
        objectFit: 'contain',
        filter: disabled ? 'grayscale(0.6) opacity(0.7)' : 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 12.5,
        lineHeight: 1,
        color: disabled ? 'var(--color-text-muted)' : '#5B4636',
        whiteSpace: 'nowrap'
      }
    }, label));
  }

  /* ── top-left record card (KỶ LỤC + best) ─────────────────────────────── */
  function RecordCard({
    best
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 22,
        left: 16,
        zIndex: 6,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 15px 7px 9px',
        background: 'linear-gradient(180deg,#FFFFFF,#FFF7EC)',
        borderRadius: 20,
        boxShadow: '0 4px 0 #EBDCC4, 0 6px 13px rgba(120,92,52,0.18)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: ART.icTrophy,
      alt: "",
      style: {
        width: 30,
        height: 30,
        objectFit: 'contain'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.06em',
        color: 'var(--color-text-muted)'
      }
    }, "K\u1EF6 L\u1EE4C"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 20,
        color: 'var(--color-text)',
        marginTop: 3
      }
    }, fmtInt(best))));
  }

  /* ── corner customization button — cream square art + palette icon ────── */
  function CornerCustomize({
    hasNew = false,
    disabled = false,
    onClick
  }) {
    const [press, setPress] = useState(false);
    const down = press && !disabled;
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: disabled ? undefined : onClick,
      disabled: disabled,
      "aria-label": "T\xF9y ch\u1EC9nh",
      onPointerDown: () => setPress(true),
      onPointerUp: () => setPress(false),
      onPointerLeave: () => setPress(false),
      style: {
        position: 'absolute',
        top: 22,
        right: 18,
        zIndex: 6,
        width: 50,
        height: 50,
        borderRadius: 18,
        border: 'none',
        background: disabled ? 'linear-gradient(180deg,#EFE7D8,#E0D6C4)' : 'linear-gradient(180deg,#FFFFFF,#FFF7EC)',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: down ? '0 1px 0 #EBDCC4, 0 3px 8px rgba(120,92,52,0.14)' : '0 4px 0 #EBDCC4, 0 6px 13px rgba(120,92,52,0.2)',
        transform: down ? 'translateY(3px)' : 'translateY(0)',
        transition: 'transform var(--motion-fast) var(--ease-out), box-shadow var(--motion-fast) var(--ease-out)',
        WebkitTapHighlightColor: 'transparent'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        top: 5,
        left: '24%',
        right: '24%',
        height: 10,
        background: '#fff',
        opacity: 0.8,
        borderRadius: 999,
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex',
        filter: disabled ? 'grayscale(0.6) opacity(0.7)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: ART.icPalette,
      alt: "",
      style: {
        width: 30,
        height: 30,
        objectFit: 'contain'
      }
    })), hasNew && !disabled && /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 13,
        height: 13,
        borderRadius: '50%',
        background: 'var(--color-warning)',
        border: '2px solid #FFF7EC'
      }
    }));
  }

  /* ── customize bottom sheet ───────────────────────────────────────────── */
  function EqBars() {
    return /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap: 2,
        height: 15
      }
    }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "gj2-eq",
      style: {
        width: 3,
        background: 'var(--color-gravity)',
        borderRadius: 2,
        animationDelay: i * 0.18 + 's'
      }
    })));
  }
  function CustomizeSheet({
    best,
    sceneId,
    onScene,
    music,
    onMusic,
    volume,
    onVolume,
    onClose
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: onClose,
      className: "gj2-scrim",
      style: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(60,44,24,0.42)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "gj2-sheet",
      style: {
        position: 'relative',
        background: 'var(--color-bg)',
        borderRadius: '28px 28px 0 0',
        boxShadow: '0 -12px 40px rgba(60,44,24,0.3)',
        padding: '10px 16px 18px',
        maxHeight: '84%',
        overflowY: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 5,
        borderRadius: 999,
        background: '#E2D4BD',
        margin: '2px auto 10px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: 22,
        color: 'var(--color-text)'
      }
    }, "T\xF9y ch\u1EC9nh"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClose,
      "aria-label": "\u0110\xF3ng",
      style: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        background: 'var(--color-surface-sunken)',
        color: 'var(--color-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 20
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.04em',
        color: 'var(--color-text-muted)',
        margin: '0 2px 8px'
      }
    }, "C\u1EA2NH & N\u1EC0N"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        marginBottom: 20
      }
    }, SCENES.map(sc => {
      const active = sc.id === sceneId;
      return /*#__PURE__*/React.createElement("button", {
        key: sc.id,
        type: "button",
        onClick: () => onScene(sc.id),
        style: {
          position: 'relative',
          padding: 0,
          border: 'none',
          cursor: 'pointer',
          borderRadius: 16,
          overflow: 'hidden',
          background: '#FFF7EC',
          aspectRatio: '16 / 11',
          boxShadow: active ? '0 0 0 3px var(--color-gravity), 0 6px 14px rgba(120,92,52,0.24)' : '0 3px 10px rgba(120,92,52,0.2)'
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: sc.bg,
        alt: "",
        style: {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 65%',
          display: 'block'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '14px 10px 7px',
          background: 'linear-gradient(180deg,rgba(60,44,24,0),rgba(60,44,24,0.66))',
          color: '#fff',
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 13,
          textAlign: 'left'
        }
      }, sc.name), active && /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          top: 7,
          right: 7,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'var(--color-gravity)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(60,44,24,0.3)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 16,
        color: "#fff"
      })));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.04em',
        color: 'var(--color-text-muted)',
        margin: '0 2px 8px'
      }
    }, "NH\u1EA0C N\u1EC0N"), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-surface)',
        borderRadius: 20,
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }
    }, SCENES.map((sc, i) => {
      const locked = best < sc.unlockAt;
      const playing = music === sc.id;
      return /*#__PURE__*/React.createElement("button", {
        key: sc.id,
        type: "button",
        disabled: locked,
        onClick: () => !locked && onMusic(sc.id),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          minHeight: 56,
          padding: '0 14px',
          border: 'none',
          borderBottom: i < SCENES.length - 1 ? '1.5px solid var(--color-cell-line)' : 'none',
          background: playing ? 'var(--color-surface-sunken)' : 'transparent',
          cursor: locked ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          opacity: locked ? 0.62 : 1
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 34,
          height: 34,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: locked ? '#E2D4BD' : playing ? 'var(--color-gravity)' : 'var(--color-surface-sunken)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: locked ? 'settings' : 'music',
        size: 18,
        color: locked ? 'var(--color-text-muted)' : playing ? '#fff' : 'var(--color-text)'
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'block',
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 15,
          color: 'var(--color-text)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, sc.track), locked && /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'block',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 12,
          color: 'var(--color-text-muted)'
        }
      }, "\uD83D\uDD12 M\u1EDF t\u1EA1i ", fmtInt(sc.unlockAt), " \u0111i\u1EC3m")), playing && /*#__PURE__*/React.createElement(EqBars, null), !locked && !playing && /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 12,
          color: 'var(--color-gravity)'
        }
      }, "Ch\u1ECDn"));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 2px 4px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "volume",
      size: 20,
      color: "var(--color-text-muted)"
    }), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "0",
      max: "100",
      value: volume,
      onChange: e => onVolume(+e.target.value),
      style: {
        flex: 1,
        accentColor: 'var(--color-gravity)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        textAlign: 'right',
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 13,
        color: 'var(--color-text)'
      }
    }, volume))));
  }

  /* ── Home screen ──────────────────────────────────────────────────────── */
  function HomeScreen({
    best = 28640,
    playDisabled = false,
    onPlay,
    onGuide,
    onLeaderboard,
    onSettings
  }) {
    const [sceneId, setSceneId] = useState('meadow');
    const [music, setMusic] = useState('meadow');
    const [volume, setVolume] = useState(70);
    const [sheet, setSheet] = useState(false);
    const scene = SCENES.find(s => s.id === sceneId) || SCENES[0];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        background: '#FFF7EC',
        fontFamily: 'var(--font-body)'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj2-eq{0%,100%{height:5px}50%{height:15px}}
          .gj2-eq{animation:gj2-eq .9s ease-in-out infinite}
          @keyframes gj2-sheet-in{from{transform:translateY(100%)}to{transform:translateY(0)}}
          @keyframes gj2-fade-in{from{opacity:0}to{opacity:1}}
          @keyframes gj2-logo-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
          .gj2-logo{animation:gj2-logo-bob 4s ease-in-out infinite}
          .gj2-sheet{animation:gj2-sheet-in .32s cubic-bezier(.34,1.3,.64,1)}
          .gj2-scrim{animation:gj2-fade-in .25s ease}
          @media (prefers-reduced-motion: reduce){.gj2-eq,.gj2-sheet,.gj2-scrim,.gj2-logo{animation:none!important}}
        `), scene.bg && /*#__PURE__*/React.createElement("img", {
      key: scene.id,
      src: scene.bg,
      alt: "",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center bottom',
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        animation: 'gj2-fade-in .5s ease'
      }
    }), /*#__PURE__*/React.createElement(RecordCard, {
      best: best
    }), /*#__PURE__*/React.createElement(CornerCustomize, {
      onClick: () => setSheet(true)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 24px 32px',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "gj2-logo",
      style: {
        marginTop: 46,
        display: 'flex',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(LogoMark, null)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(PlayButton, {
      disabled: playDisabled,
      onClick: onPlay
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 42
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '0 2px'
      }
    }, /*#__PURE__*/React.createElement(NavButton, {
      iconSrc: ART.icGuide,
      label: "C\u1EA9m nang",
      onClick: onGuide
    }), /*#__PURE__*/React.createElement(NavButton, {
      iconSrc: ART.icTrophy,
      label: "X\u1EBFp h\u1EA1ng",
      onClick: onLeaderboard
    }), /*#__PURE__*/React.createElement(NavButton, {
      iconSrc: ART.icSettings,
      label: "C\xE0i \u0111\u1EB7t",
      onClick: onSettings
    }))), sheet && /*#__PURE__*/React.createElement(CustomizeSheet, {
      best: best,
      sceneId: sceneId,
      onScene: setSceneId,
      music: music,
      onMusic: setMusic,
      volume: volume,
      onVolume: setVolume,
      onClose: () => setSheet(false)
    }));
  }
  window.GJHomeScreen = HomeScreen;
  window.GJHomeScreenV2 = HomeScreen; // back-compat alias
  window.GJHomeParts = {
    LogoMark,
    PlayButton,
    NavButton,
    RecordCard,
    CornerCustomize,
    CustomizeSheet
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/home-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/leaderboard-screen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* leaderboard-screen.jsx — LEADERBOARD. Single GLOBAL Endless board (no
   friends system, no user avatars). Top-3 podium is the SUPPLIED PNG ART
   `06-svg-assets/backgrounds/leaderboard-podium-bg.webp` (candy podium with
   gold/silver/bronze frames baked in) — names + scores are overlaid inside
   the three empty frames. Below: rank rows, pinned tangerine "you" row with
   inline name-edit. Exposes window.GJLeaderboardScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Icon
  } = NS;
  const BG_SRC = '../06-svg-assets/backgrounds/leaderboard-podium-bg.webp';

  // ink colors matched to the art's three frame tints (gold / periwinkle / pink)
  const INK = {
    1: '#A5731A',
    2: '#5A65B6',
    3: '#C05F72'
  };

  // name + score overlaid inside one of the art's empty podium frames.
  // Coordinates are % of the art image (so they track any screen width).
  function FrameSlot({
    rank,
    name,
    score,
    style
  }) {
    const big = rank === 1;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: big ? 4 : 1,
        textAlign: 'center',
        color: INK[rank],
        ...style
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: big ? 16 : 13
      }
    }, name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: big ? 24 : 18,
        lineHeight: 1.05
      }
    }, score.toLocaleString('vi-VN')), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: big ? 11 : 10,
        letterSpacing: '0.06em',
        opacity: 0.75
      }
    }, "\u0110I\u1EC2M"));
  }

  // colored rounded-square rank badge, per row
  const BADGE = {
    4: ['#8C7CF3', '#6353D6'],
    5: ['#F3C85B', '#D9A33A'],
    6: ['#66C9B8', '#45A895'],
    7: ['#8FAAEE', '#6A88DB'],
    8: ['#F090B4', '#DC6494'],
    9: ['#FFAE7C', '#EE8248'],
    10: ['#6FD79E', '#49B679']
  };
  function RankBadge({
    rank,
    size = 46
  }) {
    const [a, b] = BADGE[rank] || ['#C9BCA8', '#A89A82'];
    return /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: 14,
        background: `linear-gradient(180deg, ${a}, ${b})`,
        boxShadow: `inset 0 2px 0 color-mix(in srgb, ${a} 55%, white), var(--shadow-sm)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: size * 0.42,
        color: '#fff',
        textShadow: '0 1px 1px rgba(0,0,0,0.14)'
      }
    }, rank);
  }
  function Row({
    rank,
    name,
    score
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: '10px 18px 10px 12px',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement(RankBadge, {
      rank: rank
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 18,
        color: 'var(--color-text)'
      }
    }, name), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 20,
        color: 'var(--color-gravity-edge)'
      }
    }, score.toLocaleString('vi-VN')));
  }
  function NameDialog({
    initial,
    onSave,
    onClose
  }) {
    const [v, setV] = React.useState(initial);
    const ref = React.useRef(null);
    React.useEffect(() => {
      const el = ref.current;
      if (el) {
        el.focus();
        el.select();
      }
    }, []);
    const trimmed = v.trim();
    const ok = trimmed.length >= 1 && trimmed.length <= 14;
    const save = () => {
      if (ok) onSave(trimmed);
    };
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClose,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        background: 'var(--color-overlay)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-lg)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: {
        width: '100%',
        maxWidth: 300,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-lg)',
        padding: 'var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-heading)',
        color: 'var(--color-text)'
      }
    }, "\u0110\u1ED5i t\xEAn"), /*#__PURE__*/React.createElement("input", {
      ref: ref,
      value: v,
      onChange: e => setV(e.target.value),
      onKeyDown: e => {
        if (e.key === 'Enter') save();
        if (e.key === 'Escape') onClose();
      },
      maxLength: 14,
      placeholder: "Nh\u1EADp t\xEAn c\u1EE7a b\u1EA1n",
      style: {
        height: 48,
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        boxShadow: 'inset 0 0 0 2px color-mix(in srgb, var(--color-text-muted) 30%, transparent)',
        background: 'var(--color-surface-sunken)',
        padding: '0 var(--space-md)',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)',
        outline: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-muted)'
      }
    }, "T\u1ED1i \u0111a 14 k\xFD t\u1EF1"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-muted)'
      }
    }, trimmed.length, "/14")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-sm)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClose,
      style: {
        flex: 1,
        height: 48,
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        cursor: 'pointer',
        background: 'var(--color-surface-sunken)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-label)',
        color: 'var(--color-text-muted)'
      }
    }, "H\u1EE7y"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: save,
      disabled: !ok,
      style: {
        flex: 1.4,
        height: 48,
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        cursor: ok ? 'pointer' : 'not-allowed',
        background: ok ? 'var(--color-primary)' : 'color-mix(in srgb, var(--color-primary) 40%, var(--color-surface))',
        boxShadow: ok ? '0 3px 0 var(--color-primary-edge)' : 'none',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-label)',
        color: '#fff'
      }
    }, "L\u01B0u"))));
  }
  function LeaderboardScreen({
    onBack
  }) {
    const [name, setName] = React.useState(() => {
      try {
        return localStorage.getItem('gj-player-name') || 'Bạn';
      } catch (e) {
        return 'Bạn';
      }
    });
    const [editing, setEditing] = React.useState(false);
    const saveName = n => {
      setName(n);
      setEditing(false);
      try {
        localStorage.setItem('gj-player-name', n);
      } catch (e) {}
    };
    const top = [{
      name: 'Mai',
      score: 214980
    }, {
      name: 'Tú',
      score: 198450
    }, {
      name: 'Khoa',
      score: 187210
    }];
    const list = [{
      name: 'Linh',
      score: 176040
    }, {
      name: 'Bảo',
      score: 168920
    }, {
      name: 'Hà',
      score: 159300
    }, {
      name: 'Nam',
      score: 151770
    }, {
      name: 'Vy',
      score: 144610
    }, {
      name: 'Quân',
      score: 136880
    }, {
      name: 'Minh',
      score: 129360
    }];
    const you = {
      rank: 1204,
      score: 42360
    };

    // last-updated timestamp (now) + next daily refresh in 24h
    const stamp = React.useMemo(() => {
      const now = new Date();
      const next = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const f = d => d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      });
      return {
        now: f(now),
        next: f(next)
      };
    }, []);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#FBEFDC',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      "aria-hidden": "false",
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        zIndex: 1,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: BG_SRC,
      alt: "",
      style: {
        display: 'block',
        width: '100%',
        height: 'auto'
      }
    }), /*#__PURE__*/React.createElement(FrameSlot, {
      rank: 1,
      name: top[0].name,
      score: top[0].score,
      style: {
        left: '35.6%',
        top: '13.5%',
        width: '29.2%',
        height: '15.5%'
      }
    }), /*#__PURE__*/React.createElement(FrameSlot, {
      rank: 2,
      name: top[1].name,
      score: top[1].score,
      style: {
        left: '5.8%',
        top: '21.5%',
        width: '25%',
        height: '10.5%'
      }
    }), /*#__PURE__*/React.createElement(FrameSlot, {
      rank: 3,
      name: top[2].name,
      score: top[2].score,
      style: {
        left: '70.7%',
        top: '23%',
        width: '22.8%',
        height: '10%'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        height: 'var(--dim-hud-h)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: '0 var(--space-md)',
        zIndex: 4
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onBack,
      "aria-label": "Quay l\u1EA1i",
      style: {
        width: 'var(--dim-icon-btn)',
        height: 'var(--dim-icon-btn)',
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--color-text)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "back",
      size: 24
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        flex: 1,
        margin: 0,
        textAlign: 'center',
        paddingRight: 'var(--dim-icon-btn)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-title)',
        color: 'var(--color-text)',
        textShadow: '0 1px 0 rgba(255,255,255,0.7)'
      }
    }, "X\u1EBFp h\u1EA1ng")), /*#__PURE__*/React.createElement("div", {
      "aria-hidden": "true",
      style: {
        flexShrink: 0,
        width: '100%',
        aspectRatio: '941 / 880'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        flexShrink: 0,
        position: 'relative',
        zIndex: 4,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        whiteSpace: 'nowrap',
        height: 36,
        padding: '0 16px',
        borderRadius: 999,
        background: 'linear-gradient(180deg, var(--color-gravity-shine), var(--color-gravity))',
        boxShadow: '0 3px 0 var(--color-gravity-edge)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 14,
        color: '#fff'
      }
    }, "\u267E\uFE0F Endless \xB7 \uD83C\uDF10 To\xE0n c\u1EA7u"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-muted)'
      }
    }, "\u0110i\u1EC3m cao nh\u1EA5t m\u1ECDi th\u1EDDi \u0111\u1EA1i")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '4px var(--space-lg) var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
        zIndex: 4
      }
    }, list.map((r, i) => /*#__PURE__*/React.createElement(Row, _extends({
      key: i,
      rank: i + 4
    }, r)))), /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        padding: '6px var(--space-lg) 8px',
        position: 'relative',
        zIndex: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: '10px 18px 10px 12px',
        borderRadius: 'var(--radius-xl)',
        background: 'color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))',
        boxShadow: 'inset 0 0 0 2px var(--color-primary), var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        minWidth: 60,
        height: 46,
        padding: '0 10px',
        borderRadius: 14,
        background: 'linear-gradient(180deg, #FFE0C6, #FFCBA6)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.6), var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 18,
        color: 'var(--color-primary-edge)'
      }
    }, you.rank), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 18,
        color: 'var(--color-text)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, name), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.06em',
        color: 'var(--color-primary-edge)',
        background: 'color-mix(in srgb, var(--color-primary) 24%, var(--color-surface))',
        borderRadius: 999,
        padding: '3px 8px'
      }
    }, "B\u1EA0N"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => setEditing(true),
      "aria-label": "\u0110\u1ED5i t\xEAn",
      style: {
        flexShrink: 0,
        width: 26,
        height: 26,
        borderRadius: '50%',
        border: 'none',
        background: 'transparent',
        color: 'var(--color-primary-edge)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pencil",
      size: 16,
      strokeWidth: 2.2
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 20,
        color: 'var(--color-primary-edge)'
      }
    }, you.score.toLocaleString('vi-VN')))), /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '2px 0 10px',
        color: 'var(--color-text-muted)',
        position: 'relative',
        zIndex: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 15,
      color: "var(--color-text-muted)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text)'
      }
    }, "C\u1EADp nh\u1EADt l\xFAc ", stamp.now)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 11,
        color: 'var(--color-text-muted)'
      }
    }, "L\xE0m m\u1EDBi m\u1ED7i 24 gi\u1EDD \xB7 d\u1EF1 ki\u1EBFn ", stamp.next)), editing && /*#__PURE__*/React.createElement(NameDialog, {
      initial: name,
      onSave: saveName,
      onClose: () => setEditing(false)
    }));
  }
  window.GJLeaderboardScreen = LeaderboardScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/leaderboard-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/missions-screen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* missions-screen.jsx — MISSIONS / ACHIEVEMENTS. Daily/Achievement tabs,
   progress bars, claimable rewards. Exposes window.GJMissionsScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Icon
  } = NS;
  const EX = window.GJExtras;
  function Bar({
    value,
    max,
    color = 'var(--color-success)'
  }) {
    const pct = Math.min(100, Math.round(value / max * 100));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 10,
        borderRadius: 999,
        background: 'var(--color-surface-sunken)',
        overflow: 'hidden',
        padding: 1.5,
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${pct}%`,
        height: '100%',
        borderRadius: 999,
        background: color
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 11,
        color: 'var(--color-text-muted)'
      }
    }, value, "/", max));
  }
  function Claim({
    amount,
    done,
    ready
  }) {
    if (done) return /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'color-mix(in srgb, var(--color-success) 22%, transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 18,
      color: "var(--color-success)"
    }));
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: !ready,
      style: {
        flexShrink: 0,
        border: 'none',
        cursor: ready ? 'pointer' : 'default',
        padding: '7px 12px',
        borderRadius: 999,
        background: ready ? 'var(--color-primary)' : 'var(--color-surface-sunken)',
        boxShadow: ready ? '0 3px 0 var(--color-primary-edge)' : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        opacity: ready ? 1 : 0.8
      }
    }, /*#__PURE__*/React.createElement(EX.Coin, {
      size: 16
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-label)',
        color: ready ? '#fff' : 'var(--color-text-muted)'
      }
    }, amount));
  }
  function MissionRow({
    glyph,
    color,
    title,
    value,
    max,
    reward,
    done,
    ready
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: 'var(--space-md)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 46,
        height: 46,
        borderRadius: 'var(--radius-md)',
        background: `color-mix(in srgb, ${color} 16%, var(--color-surface))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, glyph), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)'
      }
    }, title), /*#__PURE__*/React.createElement(Bar, {
      value: value,
      max: max,
      color: color
    })), /*#__PURE__*/React.createElement(Claim, {
      amount: reward,
      done: done,
      ready: ready
    }));
  }
  function MissionsScreen({
    tab = 'daily',
    onTab,
    onBack
  }) {
    const [t, setT] = React.useState(tab);
    const setTab = k => {
      setT(k);
      onTab && onTab(k);
    };
    const daily = [{
      glyph: /*#__PURE__*/React.createElement(Icon, {
        name: "rotateCw",
        size: 26,
        color: "var(--color-gravity)"
      }),
      color: 'var(--color-gravity)',
      title: 'Xoay trọng lực 20 lần',
      value: 20,
      max: 20,
      reward: 60,
      ready: true
    }, {
      glyph: /*#__PURE__*/React.createElement(Icon, {
        name: "star",
        size: 26,
        color: "var(--color-warning)"
      }),
      color: 'var(--color-warning)',
      title: 'Đạt 3 sao 1 màn',
      value: 1,
      max: 1,
      reward: 80,
      done: true
    }, {
      glyph: /*#__PURE__*/React.createElement(EX.Target, {
        size: 26,
        color: "var(--color-info)"
      }),
      color: 'var(--color-info)',
      title: 'Dọn 150 khối',
      value: 96,
      max: 150,
      reward: 100
    }, {
      glyph: /*#__PURE__*/React.createElement(Icon, {
        name: "play",
        size: 26,
        color: "var(--color-success)"
      }),
      color: 'var(--color-success)',
      title: 'Chơi 5 màn',
      value: 3,
      max: 5,
      reward: 50
    }];
    const achv = [{
      glyph: /*#__PURE__*/React.createElement(EX.Crown, {
        size: 26
      }),
      color: 'var(--color-warning)',
      title: 'Hạ 10 boss',
      value: 4,
      max: 10,
      reward: 300
    }, {
      glyph: /*#__PURE__*/React.createElement(Icon, {
        name: "trophy",
        size: 26,
        color: "var(--color-primary)"
      }),
      color: 'var(--color-primary)',
      title: 'Đạt màn 50',
      value: 23,
      max: 50,
      reward: 500
    }, {
      glyph: /*#__PURE__*/React.createElement(Icon, {
        name: "heart",
        size: 26,
        color: "var(--color-danger)"
      }),
      color: 'var(--color-danger)',
      title: 'Chuỗi combo ×9',
      value: 9,
      max: 9,
      reward: 250,
      ready: true
    }, {
      glyph: /*#__PURE__*/React.createElement(EX.Calendar, {
        size: 26,
        color: "var(--color-mint, var(--color-block-mint-edge))"
      }),
      color: 'var(--color-block-mint-edge)',
      title: 'Điểm danh 30 ngày',
      value: 12,
      max: 30,
      reward: 400
    }];
    const list = t === 'daily' ? daily : achv;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 'var(--dim-hud-h)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: '0 var(--space-md)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onBack,
      "aria-label": "Quay l\u1EA1i",
      style: {
        width: 'var(--dim-icon-btn)',
        height: 'var(--dim-icon-btn)',
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        background: 'transparent',
        color: 'var(--color-text)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "back",
      size: 24
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        flex: 1,
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-title)',
        color: 'var(--color-text)'
      }
    }, "Nhi\u1EC7m v\u1EE5")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        padding: 4,
        background: 'var(--color-surface-sunken)',
        borderRadius: 999,
        margin: '0 var(--space-lg) var(--space-md)'
      }
    }, [['daily', 'Hàng ngày'], ['achv', 'Thành tựu']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
      key: k,
      type: "button",
      onClick: () => setTab(k),
      style: {
        flex: 1,
        height: 38,
        border: 'none',
        cursor: 'pointer',
        borderRadius: 999,
        background: t === k ? 'var(--color-surface)' : 'transparent',
        boxShadow: t === k ? 'var(--shadow-sm)' : 'none',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-label)',
        color: t === k ? 'var(--color-text)' : 'var(--color-text-muted)'
      }
    }, l))), t === 'daily' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        margin: '0 var(--space-lg) var(--space-md)',
        padding: '8px',
        borderRadius: 'var(--radius-md)',
        background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)'
      }
    }, /*#__PURE__*/React.createElement(EX.Clock, {
      size: 16,
      color: "var(--color-primary)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text)'
      }
    }, "L\xE0m m\u1EDBi sau 08:24:11")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 var(--space-lg) var(--space-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)'
      }
    }, list.map((m, i) => /*#__PURE__*/React.createElement(MissionRow, _extends({
      key: i
    }, m)))));
  }
  window.GJMissionsScreen = MissionsScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/missions-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/out-of-lives-screen.jsx
try { (() => {
/* out-of-lives-screen.jsx — OUT OF LIVES. Sad mascot, empty hearts, refill
   countdown, refill-with-coins / watch-ad / back-to-map. Renders over a
   dimmed map via Dialog. Exposes window.GJOutOfLivesScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Button,
    JellyBlock,
    Icon,
    Dialog
  } = NS;
  const EX = window.GJExtras;
  function Hearts({
    full = 0,
    max = 5
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        justifyContent: 'center'
      }
    }, Array.from({
      length: max
    }).map((_, i) => /*#__PURE__*/React.createElement(Icon, {
      key: i,
      name: "heart",
      size: 26,
      color: i < full ? 'var(--color-danger)' : 'var(--color-cell-line)',
      strokeWidth: i < full ? 0 : 2,
      style: i < full ? {
        fill: 'var(--color-danger)'
      } : {
        fill: 'var(--color-surface-sunken)'
      }
    })));
  }
  function OutOfLivesScreen({
    countdown = '24:59',
    refillPrice = 250,
    onRefill,
    onWatchAd,
    onBack
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%',
        background: 'var(--color-bg)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        opacity: 0.35,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 40
      }
    }, [['pink', 'left'], ['mint', 'right'], ['yellow', 'down'], ['blue', 'left']].map(([c, d], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        alignSelf: i % 2 ? 'flex-end' : 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: c,
      size: 40,
      direction: d
    })))), /*#__PURE__*/React.createElement(Dialog, {
      open: true,
      title: "H\u1EBFt l\u01B0\u1EE3t ch\u01A1i!",
      icon: "heart",
      dismissable: true,
      onClose: onBack,
      style: {
        animation: 'none'
      },
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "cta",
        fullWidth: true,
        onClick: onRefill
      }, /*#__PURE__*/React.createElement(EX.Coin, {
        size: 20
      }), " H\u1ED3i \u0111\u1EA7y \xB7 ", refillPrice), /*#__PURE__*/React.createElement(Button, {
        variant: "success",
        fullWidth: true,
        onClick: onWatchAd
      }, /*#__PURE__*/React.createElement(EX.AdBadge, null), " Xem qu\u1EA3ng c\xE1o \xB7 +1 tim"), /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        icon: "home",
        fullWidth: true,
        onClick: onBack
      }, "V\u1EC1 b\u1EA3n \u0111\u1ED3"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-md)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        animation: 'gj-bob 1800ms ease-in-out infinite'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "blue",
      size: 64,
      expression: "smug",
      squashed: true
    })), /*#__PURE__*/React.createElement(Hearts, {
      full: 0
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderRadius: 999,
        background: 'var(--color-surface-sunken)'
      }
    }, /*#__PURE__*/React.createElement(EX.Clock, {
      size: 18,
      color: "var(--color-text-muted)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)'
      }
    }, "Tim m\u1EDBi sau ", countdown)))));
  }
  window.GJOutOfLivesScreen = OutOfLivesScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/out-of-lives-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/pause-screen.jsx
try { (() => {
/* pause-screen.jsx — PAUSE. Soft modal over a dimmed game: quick sound/music
   toggles, Resume CTA, Restart / Settings / Quit-to-map. Renders a faux game
   behind the Dialog. Exposes window.GJPauseScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Button,
    JellyBlock,
    Icon,
    Dialog
  } = NS;

  // a faded mini board so the pause sheet reads as in-game
  function GhostBoard() {
    const grid = [['yellow', 'mint', null, 'pink', null], ['mint', 'mint', 'blue', 'pink', 'yellow'], [null, 'blue', 'blue', null, 'yellow'], ['pink', null, 'stone', 'mint', null], ['pink', 'yellow', 'stone', 'mint', 'blue']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        filter: 'saturate(0.92)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 'var(--dim-hud-h)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-lg)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-score)',
        color: 'var(--color-text)'
      }
    }, "12 480"), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'var(--color-gravity)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 4,
        padding: 10,
        background: 'var(--color-surface-sunken)',
        borderRadius: 'var(--radius-lg)'
      }
    }, grid.flat().map((c, i) => c ? /*#__PURE__*/React.createElement(JellyBlock, {
      key: i,
      color: c,
      size: 40,
      showEyes: false
    }) : /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-cell-empty)'
      }
    })))));
  }
  function QToggle({
    icon,
    on,
    onToggle
  }) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onToggle,
      "aria-pressed": on,
      style: {
        flex: 1,
        height: 52,
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        cursor: 'pointer',
        background: on ? 'var(--color-surface-sunken)' : '#EFE3CF',
        color: on ? 'var(--color-text)' : 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        opacity: on ? 1 : 0.7
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 22
    }), !on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        width: 2,
        height: 26,
        background: 'var(--color-text-muted)',
        transform: 'rotate(45deg)',
        borderRadius: 2
      }
    }));
  }
  function PauseScreen({
    sound = true,
    music = true,
    onToggle,
    onResume,
    onRestart,
    onSettings,
    onQuit
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement(GhostBoard, null), /*#__PURE__*/React.createElement(Dialog, {
      open: true,
      title: "T\u1EA1m d\u1EEBng",
      icon: "pause",
      dismissable: false,
      style: {
        animation: 'none'
      },
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-xs)'
        }
      }, /*#__PURE__*/React.createElement(QToggle, {
        icon: "volume",
        on: sound,
        onToggle: () => onToggle && onToggle('sound')
      }), /*#__PURE__*/React.createElement(QToggle, {
        icon: "music",
        on: music,
        onToggle: () => onToggle && onToggle('music')
      })), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "cta",
        icon: "play",
        fullWidth: true,
        onClick: onResume
      }, "TI\u1EBEP T\u1EE4C"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 'var(--space-sm)'
        }
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        icon: "refresh",
        fullWidth: true,
        onClick: onRestart
      }, "Ch\u01A1i l\u1EA1i"), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        icon: "settings",
        fullWidth: true,
        onClick: onSettings
      }, "C\xE0i \u0111\u1EB7t")), /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        icon: "home",
        fullWidth: true,
        onClick: onQuit
      }, "Tho\xE1t ra b\u1EA3n \u0111\u1ED3"))
    }, "Tr\xF2 ch\u01A1i \u0111ang t\u1EA1m d\u1EEBng. Ti\u1EBFn \u0111\u1ED9 m\xE0n n\xE0y \u0111\u01B0\u1EE3c gi\u1EEF nguy\xEAn."));
  }
  window.GJPauseScreen = PauseScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/pause-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/phone-frame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* phone-frame.jsx — Android device shell (UI-kit helper).
   360dp-wide screen with a slim status bar. Children render on the cream
   canvas. Exposes window.GJPhoneFrame. */

(function () {
  function PhoneFrame({
    children,
    statusBar = true,
    style = {}
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 360,
        height: 780,
        background: '#241a12',
        borderRadius: 40,
        padding: 8,
        boxShadow: '0 24px 60px rgba(60,44,24,0.35)',
        boxSizing: 'border-box',
        ...style
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--color-bg)',
        borderRadius: 32,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-body)'
      }
    }, statusBar && /*#__PURE__*/React.createElement("div", {
      style: {
        height: 28,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 12,
        color: 'var(--color-text)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        gap: 5,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Bars, null), /*#__PURE__*/React.createElement(Wifi, null), /*#__PURE__*/React.createElement(Battery, null))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }
    }, children)));
  }
  const stroke = {
    stroke: 'var(--color-text)',
    strokeWidth: 2,
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  const Bars = () => /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "12",
    viewBox: "0 0 15 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "8",
    width: "3",
    height: "4",
    rx: "1",
    fill: "var(--color-text)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "5",
    width: "3",
    height: "7",
    rx: "1",
    fill: "var(--color-text)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "2",
    width: "3",
    height: "10",
    rx: "1",
    fill: "var(--color-text)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "12",
    y: "0",
    width: "3",
    height: "12",
    rx: "1",
    fill: "var(--color-text)",
    opacity: "0.4"
  }));
  const Wifi = () => /*#__PURE__*/React.createElement("svg", _extends({
    width: "15",
    height: "12",
    viewBox: "0 0 24 24"
  }, stroke), /*#__PURE__*/React.createElement("path", {
    d: "M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "19",
    r: "1",
    fill: "var(--color-text)",
    stroke: "none"
  }));
  const Battery = () => /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "12",
    viewBox: "0 0 26 12"
  }, /*#__PURE__*/React.createElement("rect", _extends({
    x: "1",
    y: "1",
    width: "21",
    height: "10",
    rx: "3"
  }, stroke)), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "15",
    height: "6",
    rx: "1.5",
    fill: "var(--color-success)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "23",
    y: "4",
    width: "2",
    height: "4",
    rx: "1",
    fill: "var(--color-text)"
  }));
  window.GJPhoneFrame = PhoneFrame;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/phone-frame.jsx", error: String((e && e.message) || e) }); }

// 04-screens/play/jelly-play.jsx
try { (() => {
/* jelly-play.jsx — fully playable Gravity Jelly prototype (UI-kit demo).
   Block-sudoku placement + the signature gravity-rotate slide. Reads DS
   components from the namespace. Exposes window.GJPlay. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    JellyBlock,
    GravityRotateButton,
    ComboPopup,
    Dialog,
    Button
  } = NS;
  const {
    useState,
    useRef,
    useEffect,
    useLayoutEffect,
    useCallback
  } = React;
  const N = 9;
  const COLORS = ['yellow', 'mint', 'pink', 'blue'];
  const DIRS = ['down', 'left', 'up', 'right']; // clockwise
  const MAX_CHARGES = 5;
  const uid = () => Math.random().toString(36).slice(2, 9);

  // Normalized shapes (origin 0,0). Small shapes repeated → higher draw weight.
  const SHAPES = [[[0, 0]], [[0, 0], [0, 1]], [[0, 0], [1, 0]], [[0, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [2, 0]], [[0, 0], [0, 1], [1, 0], [1, 1]], [[0, 0], [1, 0], [1, 1]], [[0, 1], [0, 0], [1, 1]], [[0, 0], [0, 1], [0, 2], [1, 1]],
  // T
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  // L
  [[0, 1], [1, 1], [2, 1], [2, 0]],
  // J
  [[0, 1], [0, 2], [1, 0], [1, 1]],
  // S
  [[0, 0], [0, 1], [1, 1], [1, 2]],
  // Z
  [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
  // plus
  [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [1, 0], [2, 0], [3, 0]]];
  // weight: index 0..6 (small) twice
  const POOL = SHAPES.concat(SHAPES.slice(0, 8));
  const randomPiece = () => {
    const cells = POOL[Math.floor(Math.random() * POOL.length)];
    return {
      cells,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  };
  const newTray = () => [randomPiece(), randomPiece(), randomPiece()];

  // ---- grid helpers ----
  const key = (r, c) => r + '-' + c;
  function colorGrid(blocks) {
    const g = Array.from({
      length: N
    }, () => Array(N).fill(null));
    blocks.forEach(b => {
      if (b.r >= 0 && b.r < N && b.c >= 0 && b.c < N) g[b.r][b.c] = b.color;
    });
    return g;
  }
  function canPlace(blocks, piece, ar, ac) {
    const g = colorGrid(blocks);
    return piece.cells.every(([r, c]) => {
      const rr = ar + r,
        cc = ac + c;
      return rr >= 0 && rr < N && cc >= 0 && cc < N && !g[rr][cc];
    });
  }
  function pieceExtent(piece) {
    const rs = piece.cells.map(([r]) => r),
      cs = piece.cells.map(([, c]) => c);
    return {
      h: Math.max(...rs) + 1,
      w: Math.max(...cs) + 1
    };
  }
  function existsPlacement(blocks, piece) {
    const {
      h,
      w
    } = pieceExtent(piece);
    for (let r = 0; r <= N - h; r++) for (let c = 0; c <= N - w; c++) if (canPlace(blocks, piece, r, c)) return true;
    return false;
  }
  function computeClears(blocks) {
    const g = colorGrid(blocks);
    const full = cells => cells.every(([r, c]) => g[r][c]);
    const clear = new Set();
    let groups = 0;
    for (let r = 0; r < N; r++) {
      const cells = Array.from({
        length: N
      }, (_, c) => [r, c]);
      if (full(cells)) {
        groups++;
        cells.forEach(([r, c]) => clear.add(key(r, c)));
      }
    }
    for (let c = 0; c < N; c++) {
      const cells = Array.from({
        length: N
      }, (_, r) => [r, c]);
      if (full(cells)) {
        groups++;
        cells.forEach(([r, c]) => clear.add(key(r, c)));
      }
    }
    for (let br = 0; br < 3; br++) for (let bc = 0; bc < 3; bc++) {
      const cells = [];
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) cells.push([br * 3 + i, bc * 3 + j]);
      if (full(cells)) {
        groups++;
        cells.forEach(([r, c]) => clear.add(key(r, c)));
      }
    }
    return {
      clearIds: blocks.filter(b => clear.has(key(b.r, b.c))).map(b => b.id),
      groups
    };
  }
  function applyGravity(blocks, dir) {
    const moved = blocks.map(b => ({
      ...b
    }));
    const grid = Array.from({
      length: N
    }, () => Array(N).fill(null));
    moved.forEach(b => {
      grid[b.r][b.c] = b;
    });
    if (dir === 'down' || dir === 'up') {
      for (let c = 0; c < N; c++) {
        const col = [];
        for (let r = 0; r < N; r++) if (grid[r][c]) col.push(grid[r][c]);
        if (dir === 'down') {
          let r = N - 1;
          for (let i = col.length - 1; i >= 0; i--) {
            col[i].r = r--;
            col[i].c = c;
          }
        } else {
          let r = 0;
          for (let i = 0; i < col.length; i++) {
            col[i].r = r++;
            col[i].c = c;
          }
        }
      }
    } else {
      for (let r = 0; r < N; r++) {
        const row = [];
        for (let c = 0; c < N; c++) if (grid[r][c]) row.push(grid[r][c]);
        if (dir === 'right') {
          let c = N - 1;
          for (let i = row.length - 1; i >= 0; i--) {
            row[i].c = c--;
            row[i].r = r;
          }
        } else {
          let c = 0;
          for (let i = 0; i < row.length; i++) {
            row[i].c = c++;
            row[i].r = r;
          }
        }
      }
    }
    return moved;
  }

  // ---- tray piece thumbnail ----
  function TrayThumb({
    piece,
    cell
  }) {
    const {
      h,
      w
    } = pieceExtent(piece);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: w * (cell + 2) - 2,
        height: h * (cell + 2) - 2
      }
    }, piece.cells.map(([r, c], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: c * (cell + 2),
        top: r * (cell + 2)
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: piece.color,
      size: cell,
      showEyes: false
    }))));
  }

  // ---- DragGhost: the piece "in hand" while dragging (follows the pointer) ----
  function DragGhost({
    piece,
    cell,
    valid
  }) {
    const {
      h,
      w
    } = pieceExtent(piece);
    const g = 2;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: w * (cell + g) - g,
        height: h * (cell + g) - g,
        transform: 'scale(1.06)',
        opacity: valid ? 0.9 : 0.8
      }
    }, piece.cells.map(([r, c], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: c * (cell + g),
        top: r * (cell + g)
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: piece.color,
      size: cell,
      showEyes: cell >= 20
    }))));
  }

  // ---- LiveJelly: a board block with its own autonomous eye life ----
  // Default: eyes track gravity. On a private random timer it glances around,
  // blinks, looks at the player, or winks — each block independent, never in
  // sync. `falling` (set briefly when gravity moves it) plays happy eyes.
  function LiveJelly({
    color,
    size,
    gravityDir,
    falling,
    clearing
  }) {
    const [ov, setOv] = useState(null);
    useEffect(() => {
      let alive = true,
        t;
      const schedule = () => {
        t = setTimeout(act, 2200 + Math.random() * 4200);
      };
      const clear = ms => setTimeout(() => {
        if (alive) setOv(null);
      }, ms);
      const act = () => {
        if (!alive) return;
        const roll = Math.random();
        if (roll < 0.38) {
          setOv({
            blink: true
          });
          clear(150);
        } else if (roll < 0.68) {
          setOv({
            direction: ['left', 'right', 'up'][Math.floor(Math.random() * 3)]
          });
          clear(820);
        } else if (roll < 0.88) {
          setOv({
            expression: 'front'
          });
          clear(1150);
        } else {
          setOv({
            expression: 'wink'
          });
          clear(520);
        }
        schedule();
      };
      schedule();
      return () => {
        alive = false;
        clearTimeout(t);
      };
    }, []);
    const expression = clearing ? 'happy' : falling ? 'happy' : ov && ov.expression || 'normal';
    const direction = clearing || falling ? gravityDir : ov && ov.direction || gravityDir;
    const blink = !!(ov && ov.blink) && !clearing && !falling;
    return /*#__PURE__*/React.createElement(JellyBlock, {
      color: color,
      size: size,
      direction: direction,
      expression: expression,
      blink: blink
    });
  }
  function GameApp() {
    const [blocks, setBlocks] = useState([]);
    const [tray, setTray] = useState(newTray);
    const [selected, setSelected] = useState(-1);
    const [dirIdx, setDirIdx] = useState(0);
    const [charges, setCharges] = useState(3);
    const [score, setScore] = useState(0);
    const [clearing, setClearing] = useState([]);
    const [combo, setCombo] = useState(null);
    const [hover, setHover] = useState(null);
    const [paused, setPaused] = useState(false);
    const [over, setOver] = useState(false);
    const [falling, setFalling] = useState(() => new Set());
    const [cell, setCell] = useState(30);
    const [drag, setDrag] = useState(null); // {x,y,piece,scale,anchor,valid}
    const busy = useRef(false);
    const boardRef = useRef(null);
    const downRef = useRef(null); // active pointer-down bookkeeping
    const draggedRef = useRef(false); // suppress the click that follows a drag
    const dir = DIRS[dirIdx];

    // responsive board cell
    const areaRef = useRef(null);
    useLayoutEffect(() => {
      const el = areaRef.current;
      if (!el || typeof ResizeObserver === 'undefined') return;
      const measure = () => {
        const avail = Math.min(el.clientWidth - 8, el.clientHeight - 16);
        setCell(Math.max(22, Math.min(46, Math.floor((avail - 16 - 12) / N))));
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    // idle blink is now per-block (LiveJelly); no global blink needed.

    const pad = 6,
      gap = 2;
    const step = cell + gap;
    const boardPx = pad * 2 + N * cell + (N - 1) * gap;
    const cellPos = i => pad + i * step;
    const resolve = useCallback((curBlocks, curTray, curCharges) => {
      const {
        clearIds,
        groups
      } = computeClears(curBlocks);
      const refill = t => t.every(p => !p) ? newTray() : t;
      const finishUp = (bl, t, ch) => {
        const placeable = t.some(p => p && existsPlacement(bl, p));
        if (!placeable && ch <= 0) setTimeout(() => setOver(true), 250);
        busy.current = false;
      };
      if (groups > 0) {
        setClearing(clearIds);
        setCombo({
          n: Math.max(2, groups + 1),
          key: Date.now()
        });
        setTimeout(() => {
          const remain = curBlocks.filter(b => !clearIds.includes(b.id));
          const newCh = Math.min(MAX_CHARGES, curCharges + groups);
          const t = refill(curTray);
          setBlocks(remain);
          setClearing([]);
          setTray(t);
          setScore(s => s + groups * 100 + clearIds.length * 5);
          setCharges(newCh);
          setTimeout(() => setCombo(null), 700);
          finishUp(remain, t, newCh);
        }, 480);
      } else {
        const t = refill(curTray);
        if (t !== curTray) setTray(t);
        finishUp(curBlocks, t, curCharges);
      }
    }, []);
    const placePiece = useCallback((piece, ar, ac, idx) => {
      if (busy.current || paused || over) return false;
      if (!piece || !canPlace(blocks, piece, ar, ac)) return false;
      busy.current = true;
      const added = piece.cells.map(([r, c]) => ({
        id: uid(),
        r: ar + r,
        c: ac + c,
        color: piece.color,
        fresh: true
      }));
      const next = blocks.concat(added);
      const t2 = tray.slice();
      t2[idx] = null;
      setBlocks(next);
      setTray(t2);
      setSelected(-1);
      setHover(null);
      setTimeout(() => setBlocks(bs => bs.map(b => b.fresh ? {
        ...b,
        fresh: false
      } : b)), 30);
      setTimeout(() => resolve(next, t2, charges), 180);
      return true;
    }, [blocks, tray, charges, paused, over, resolve]);
    const place = useCallback((ar, ac) => {
      if (selected < 0) return;
      placePiece(tray[selected], ar, ac, selected);
    }, [placePiece, tray, selected]);

    // ---- pointer drag-and-drop: lift a tray piece, drag it over the board,
    //      snap-preview the target cells, release to drop. Mouse + touch. ----
    const liftFor = scale => Math.round(cell * scale * 1.05) + 26;
    const dragAnchor = (clientX, clientY, piece, scale, rect) => {
      const ext = pieceExtent(piece);
      const pw = ext.w * step - gap,
        ph = ext.h * step - gap;
      const lift = liftFor(scale);
      const cxLocal = (clientX - rect.left) / scale;
      const cyLocal = (clientY - lift - rect.top) / scale;
      const onBoard = cxLocal >= -cell && cxLocal <= boardPx + cell && cyLocal >= -cell && cyLocal <= boardPx + cell;
      if (!onBoard) return {
        anchor: null,
        valid: false
      };
      let hc = Math.round((cxLocal - pw / 2 - pad) / step);
      let hr = Math.round((cyLocal - ph / 2 - pad) / step);
      hr = Math.max(0, Math.min(N - ext.h, hr));
      hc = Math.max(0, Math.min(N - ext.w, hc));
      return {
        anchor: [hr, hc],
        valid: canPlace(blocks, piece, hr, hc)
      };
    };
    const trayDown = (i, e) => {
      if (!tray[i] || busy.current || paused || over) return;
      downRef.current = {
        i,
        x: e.clientX,
        y: e.clientY,
        armed: false
      };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_) {}
    };
    const trayMove = e => {
      const d = downRef.current;
      if (!d) return;
      if (!d.armed) {
        if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 7) return;
        d.armed = true;
        setSelected(d.i);
      }
      const rect = boardRef.current.getBoundingClientRect();
      const scale = rect.width / boardPx;
      const piece = tray[d.i];
      const info = dragAnchor(e.clientX, e.clientY, piece, scale, rect);
      setDrag({
        x: e.clientX,
        y: e.clientY,
        piece,
        scale,
        anchor: info.anchor,
        valid: info.valid
      });
      setHover(info.anchor);
    };
    const trayUp = e => {
      const d = downRef.current;
      if (!d) return;
      downRef.current = null;
      if (!d.armed) return; // a plain tap — handled by onClick
      draggedRef.current = true;
      const rect = boardRef.current.getBoundingClientRect();
      const scale = rect.width / boardPx;
      const piece = tray[d.i];
      const info = dragAnchor(e.clientX, e.clientY, piece, scale, rect);
      setDrag(null);
      setHover(null);
      if (!(info.anchor && info.valid && placePiece(piece, info.anchor[0], info.anchor[1], d.i))) {
        setSelected(-1);
      }
    };
    const trayClick = i => {
      if (draggedRef.current) {
        draggedRef.current = false;
        return;
      }
      if (!tray[i] || busy.current || paused || over) return;
      setSelected(s => s === i ? -1 : i);
    };
    const rotateGravity = useCallback(() => {
      if (busy.current || paused || over || charges <= 0) return;
      busy.current = true;
      const ndir = (dirIdx + 1) % 4;
      const moved = applyGravity(blocks, DIRS[ndir]);
      // mark blocks that actually shifted so they play the happy "falling" eyes
      const movedIds = moved.filter(m => {
        const o = blocks.find(b => b.id === m.id);
        return o && (o.r !== m.r || o.c !== m.c);
      }).map(m => m.id);
      setDirIdx(ndir);
      setCharges(c => c - 1);
      setBlocks(moved);
      setSelected(-1);
      setHover(null);
      setFalling(new Set(movedIds));
      setTimeout(() => setFalling(new Set()), 700);
      setTimeout(() => resolve(moved, tray, charges - 1), 380);
    }, [blocks, tray, dirIdx, charges, paused, over, resolve]);
    const restart = () => {
      busy.current = false;
      setBlocks([]);
      setTray(newTray());
      setSelected(-1);
      setDirIdx(0);
      setCharges(3);
      setScore(0);
      setClearing([]);
      setCombo(null);
      setHover(null);
      setOver(false);
      setPaused(false);
    };

    // hovered anchor (clamped so the piece stays on board)
    const anchorFor = (hr, hc) => {
      const piece = tray[selected];
      if (!piece) return null;
      const {
        h,
        w
      } = pieceExtent(piece);
      return [Math.max(0, Math.min(N - h, hr)), Math.max(0, Math.min(N - w, hc))];
    };
    const onBoardMove = e => {
      if (downRef.current || selected < 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const hc = Math.floor((e.clientX - rect.left - pad) / step);
      const hr = Math.floor((e.clientY - rect.top - pad) / step);
      if (hr < 0 || hc < 0 || hr >= N || hc >= N) {
        setHover(null);
        return;
      }
      setHover(anchorFor(hr, hc));
    };
    const onBoardClick = e => {
      if (downRef.current || selected < 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const hc = Math.floor((e.clientX - rect.left - pad) / step);
      const hr = Math.floor((e.clientY - rect.top - pad) / step);
      if (hr < 0 || hc < 0 || hr >= N || hc >= N) return;
      const a = anchorFor(hr, hc);
      if (a) place(a[0], a[1]);
    };
    const clearingSet = new Set(clearing);
    const piece = selected >= 0 ? tray[selected] : null;
    const previewCells = hover && piece ? piece.cells.map(([r, c]) => [hover[0] + r, hover[1] + c]) : [];
    const previewValid = hover && piece ? canPlace(blocks, piece, hover[0], hover[1]) : false;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: 'radial-gradient(130% 80% at 50% -10%, #FFFBF3 0%, var(--color-bg) 46%, #F6EAD6 100%)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        opacity: 0.7,
        backgroundImage: 'radial-gradient(rgba(176,142,96,0.13) 1.5px, transparent 1.6px)',
        backgroundSize: '20px 20px'
      }
    }), [{
      c: 'mint',
      s: 130,
      t: '5%',
      l: '-8%'
    }, {
      c: 'pink',
      s: 100,
      t: '58%',
      l: '80%'
    }, {
      c: 'yellow',
      s: 78,
      t: '70%',
      l: '-6%'
    }, {
      c: 'blue',
      s: 110,
      t: '38%',
      l: '85%'
    }, {
      c: 'pink',
      s: 60,
      t: '14%',
      l: '74%'
    }, {
      c: 'mint',
      s: 70,
      t: '82%',
      l: '58%'
    }].map((b, i) => /*#__PURE__*/React.createElement("div", {
      key: 'blob' + i,
      style: {
        position: 'absolute',
        top: b.t,
        left: b.l,
        width: b.s,
        height: b.s,
        borderRadius: '42% 58% 56% 44% / 50% 46% 54% 50%',
        background: `var(--color-block-${b.c})`,
        opacity: 0.3,
        filter: 'blur(3px)'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        zIndex: 1,
        height: 'var(--dim-hud-h)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-lg)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-score)',
        color: 'var(--color-text)'
      }
    }, score), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => setPaused(true),
      "aria-label": "T\u1EA1m d\u1EEBng",
      style: {
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: 'none',
        background: 'var(--color-surface)',
        boxShadow: '0 4px 0 #E9D7BA, 0 8px 14px -6px var(--color-shadow-key)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 5,
        height: 16,
        borderRadius: 2,
        background: 'var(--color-gravity)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 5,
        height: 16,
        borderRadius: 2,
        background: 'var(--color-gravity)'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      ref: areaRef,
      style: {
        position: 'relative',
        zIndex: 1,
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 4px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        padding: 7,
        borderRadius: 14,
        background: 'linear-gradient(180deg,#FFFFFF 0%,#FBF1DF 100%)',
        border: '2px solid #F1E3C9',
        boxShadow: '0 8px 0 #E9D7BA, 0 20px 30px -12px var(--color-shadow-key), inset 0 3px 0 rgba(255,255,255,0.95)'
      }
    }, [['mint', {
      top: 5,
      left: 5
    }], ['pink', {
      top: 5,
      right: 5
    }], ['yellow', {
      bottom: 5,
      left: 5
    }], ['blue', {
      bottom: 5,
      right: 5
    }]].map(([col, pos], i) => /*#__PURE__*/React.createElement("div", {
      key: 'stud' + i,
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        ...pos,
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: `var(--color-block-${col})`,
        boxShadow: 'inset 0 -1px 1px rgba(0,0,0,0.12), 0 1px 1px rgba(255,255,255,0.7)',
        zIndex: 3
      }
    })), /*#__PURE__*/React.createElement("div", {
      ref: boardRef,
      onMouseMove: onBoardMove,
      onMouseLeave: () => setHover(null),
      onClick: onBoardClick,
      style: {
        position: 'relative',
        width: boardPx,
        height: boardPx,
        background: 'var(--color-surface-sunken)',
        borderRadius: 20,
        boxShadow: 'inset 0 2px 6px rgba(120,92,52,0.12)',
        cursor: selected >= 0 ? 'pointer' : 'default'
      }
    }, Array.from({
      length: N
    }).map((_, r) => Array.from({
      length: N
    }).map((_, c) => /*#__PURE__*/React.createElement("div", {
      key: key(r, c),
      style: {
        position: 'absolute',
        left: cellPos(c),
        top: cellPos(r),
        width: cell,
        height: cell,
        borderRadius: 7,
        background: 'var(--color-cell-empty)',
        boxShadow: 'inset 0 0 0 1px var(--color-cell-line)'
      }
    }))), [3, 6].map(i => /*#__PURE__*/React.createElement("div", {
      key: 'v' + i,
      style: {
        position: 'absolute',
        left: cellPos(i) - gap / 2 - 1,
        top: pad,
        width: 2,
        height: N * cell + (N - 1) * gap,
        background: 'var(--color-cell-line)',
        opacity: 0.9,
        borderRadius: 2
      }
    })), [3, 6].map(i => /*#__PURE__*/React.createElement("div", {
      key: 'h' + i,
      style: {
        position: 'absolute',
        top: cellPos(i) - gap / 2 - 1,
        left: pad,
        height: 2,
        width: N * cell + (N - 1) * gap,
        background: 'var(--color-cell-line)',
        opacity: 0.9,
        borderRadius: 2
      }
    })), previewCells.map(([r, c], i) => /*#__PURE__*/React.createElement("div", {
      key: 'p' + i,
      style: {
        position: 'absolute',
        left: cellPos(c),
        top: cellPos(r),
        width: cell,
        height: cell,
        borderRadius: 7,
        background: previewValid ? 'var(--color-success)' : 'var(--color-danger)',
        boxShadow: `inset 0 0 0 2px ${previewValid ? 'var(--color-success)' : 'var(--color-danger)'}`,
        opacity: 0.5,
        pointerEvents: 'none',
        transition: 'opacity 120ms'
      }
    })), blocks.map(b => {
      const isClearing = clearingSet.has(b.id);
      return /*#__PURE__*/React.createElement("div", {
        key: b.id,
        style: {
          position: 'absolute',
          left: cellPos(b.c),
          top: cellPos(b.r),
          transition: 'left 340ms var(--ease-jelly), top 340ms var(--ease-jelly), transform 320ms var(--ease-jelly), opacity 320ms ease',
          transform: isClearing ? 'scale(0.2)' : b.fresh ? 'scale(0.6)' : 'scale(1)',
          opacity: isClearing ? 0 : 1,
          zIndex: isClearing ? 3 : 1
        }
      }, /*#__PURE__*/React.createElement(LiveJelly, {
        color: b.color,
        size: cell,
        gravityDir: dir,
        falling: falling.has(b.id),
        clearing: isClearing
      }));
    }))), combo && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 2,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement(ComboPopup, {
      key: combo.key,
      combo: combo.n
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        zIndex: 1,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 22px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 150
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        color: 'var(--color-text)'
      }
    }, "\u0110\u1ED5i tr\u1ECDng l\u1EF1c"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        color: 'var(--color-text-muted)',
        lineHeight: 1.3
      }
    }, "Tr\u01B0\u1EE3t to\xE0n b\u1ED9 kh\u1ED1i v\u1EC1 t\u01B0\u1EDDng m\u1EDBi \u0111\u1EC3 d\u1ED3n h\xE0ng.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(GravityRotateButton, {
      turnsLeft: charges,
      onRotate: rotateGravity
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--color-gravity-edge)',
        letterSpacing: '0.05em'
      }
    }, "XOAY"))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        zIndex: 1,
        flexShrink: 0,
        height: 104,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 8,
        padding: '0 14px',
        background: 'var(--color-surface)',
        borderRadius: '26px 26px 0 0',
        boxShadow: '0 -6px 18px var(--color-shadow-soft)'
      }
    }, tray.map((p, i) => {
      const sel = selected === i && p;
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        type: "button",
        disabled: !p,
        onClick: () => trayClick(i),
        onPointerDown: e => trayDown(i, e),
        onPointerMove: trayMove,
        onPointerUp: trayUp,
        onPointerCancel: trayUp,
        style: {
          width: 92,
          height: 84,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          borderRadius: 16,
          background: sel ? 'var(--color-surface-sunken)' : 'transparent',
          boxShadow: sel ? 'inset 0 0 0 3px var(--color-primary)' : 'none',
          transform: sel ? 'translateY(-6px)' : 'none',
          opacity: p ? drag && selected === i ? 0.3 : 1 : 0.3,
          transition: 'transform 220ms var(--ease-jelly), box-shadow 140ms, opacity 140ms',
          cursor: p ? 'grab' : 'default',
          touchAction: 'none'
        }
      }, p ? /*#__PURE__*/React.createElement(TrayThumb, {
        piece: p,
        cell: Math.min(20, Math.floor(70 / Math.max(pieceExtent(p).w, pieceExtent(p).h)))
      }) : /*#__PURE__*/React.createElement("div", {
        style: {
          width: 48,
          height: 48,
          borderRadius: 10,
          border: '2px dashed var(--color-cell-line)'
        }
      }));
    })), drag && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        left: drag.x,
        top: drag.y - liftFor(drag.scale) - 10,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 60,
        filter: 'drop-shadow(0 12px 16px rgba(80,60,40,0.32))'
      }
    }, /*#__PURE__*/React.createElement(DragGhost, {
      piece: drag.piece,
      cell: Math.max(12, Math.round(cell * drag.scale)),
      valid: drag.valid
    })), document.body), /*#__PURE__*/React.createElement(Dialog, {
      open: paused,
      title: "T\u1EA1m d\u1EEBng",
      icon: "pause",
      onClose: () => setPaused(false),
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        fullWidth: true,
        onClick: () => setPaused(false)
      }, "Ti\u1EBFp t\u1EE5c"), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        fullWidth: true,
        onClick: restart
      }, "Ch\u01A1i l\u1EA1i"))
    }, "\u0110i\u1EC3m hi\u1EC7n t\u1EA1i: ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--color-text)'
      }
    }, score.toLocaleString('vi-VN'))), /*#__PURE__*/React.createElement(Dialog, {
      open: over,
      title: "H\u1EBFt n\u01B0\u1EDBc \u0111i!",
      icon: "trophy",
      dismissable: false,
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "gravity",
        fullWidth: true,
        onClick: restart,
        icon: "refresh"
      }, "Ch\u01A1i l\u1EA1i")
    }, "Kh\xF4ng c\xF2n ch\u1ED7 \u0111\u1EB7t kh\u1ED1i v\xE0 \u0111\xE3 h\u1EBFt l\u01B0\u1EE3t xoay. T\u1ED5ng \u0111i\u1EC3m: ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--color-text)'
      }
    }, score.toLocaleString('vi-VN')), "."));
  }
  window.GJPlay = GameApp;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/play/jelly-play.jsx", error: String((e && e.message) || e) }); }

// 04-screens/result-screen.jsx
try { (() => {
/* result-screen.jsx — RESULT (end of run). Final + best score, rewarded-ad
   actions (x2 score, revive), replay + home. Exposes window.GJResultScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Button,
    JellyBlock,
    Icon
  } = NS;
  function ScoreStat({
    label,
    value,
    accent
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-text-muted)'
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: accent ? 'var(--text-display)' : 'var(--text-heading)',
        color: accent ? 'var(--color-text)' : 'var(--color-text-muted)',
        lineHeight: 1
      }
    }, value.toLocaleString('vi-VN')));
  }
  function ResultScreen({
    score = 18920,
    best = 28640,
    isNewBest = false,
    onRevive,
    onReplay,
    onHome
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-xl)',
        boxShadow: 'var(--shadow-lg)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-lg)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: -52
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "pink",
      size: 64,
      count: null,
      squashed: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        marginTop: -6
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-title)',
        color: 'var(--color-text)'
      }
    }, "H\u1EBFt ch\u1ED7 \u0111\u1EB7t!"), isNewBest && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
        padding: '4px 12px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-warning)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 14
    }), " K\u1EF6 L\u1EE4C M\u1EDAI")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        width: '100%',
        alignItems: 'flex-end',
        gap: 'var(--space-md)'
      }
    }, /*#__PURE__*/React.createElement(ScoreStat, {
      label: "\u0110I\u1EC2M",
      value: score,
      accent: true
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        alignSelf: 'stretch',
        background: 'var(--color-cell-line)'
      }
    }), /*#__PURE__*/React.createElement(ScoreStat, {
      label: "K\u1EF6 L\u1EE4C",
      value: best
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      icon: "heart",
      fullWidth: true,
      onClick: onRevive
    }, "H\u1ED3i sinh \xB7 xem QC")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-md)',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      icon: "refresh",
      fullWidth: true,
      onClick: onReplay
    }, "Ch\u01A1i l\u1EA1i"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      icon: "home",
      fullWidth: true,
      onClick: onHome
    }, "V\u1EC1 Home"))));
  }
  window.GJResultScreen = ResultScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/result-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/screen-extras.jsx
try { (() => {
/* screen-extras.jsx — extra glyphs + shared bits the base Icon set doesn't
   cover (lock, clock, gift, coin, bomb, crown, target, calendar, plus,
   filled star, ad badge, coin chip, star row). Exposes window.GJExtras.
   Lucide-style 24x24, 2px round stroke to match the DS Icon. */

(function () {
  const T = '#5B4636'; // primary cocoa
  const base = (size, color, sw) => ({
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: sw || 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  });
  const Lock = ({
    size = 24,
    color = T
  }) => /*#__PURE__*/React.createElement("svg", base(size, color), /*#__PURE__*/React.createElement("rect", {
    x: "4.5",
    y: "10.5",
    width: "15",
    height: "10",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 10.5V7a4 4 0 0 1 8 0v3.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "15",
    r: "1.3",
    fill: color,
    stroke: "none"
  }));
  const Clock = ({
    size = 24,
    color = T
  }) => /*#__PURE__*/React.createElement("svg", base(size, color), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7.5V12l3 2"
  }));
  const Gift = ({
    size = 24,
    color = T
  }) => /*#__PURE__*/React.createElement("svg", base(size, color), /*#__PURE__*/React.createElement("rect", {
    x: "3.5",
    y: "9",
    width: "17",
    height: "11.5",
    rx: "2.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 13.5h17M12 9v11.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 9C12 5.5 9 4 7.5 5.5S8.5 9 12 9zM12 9c0-3.5 3-5 4.5-3.5S15.5 9 12 9z"
  }));
  const Plus = ({
    size = 24,
    color = T
  }) => /*#__PURE__*/React.createElement("svg", base(size, color, 2.4), /*#__PURE__*/React.createElement("path", {
    d: "M12 6v12M6 12h12"
  }));
  const Target = ({
    size = 24,
    color = T
  }) => /*#__PURE__*/React.createElement("svg", base(size, color), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.3",
    fill: color,
    stroke: "none"
  }));
  const Calendar = ({
    size = 24,
    color = T
  }) => /*#__PURE__*/React.createElement("svg", base(size, color), /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "5.5",
    width: "16",
    height: "15",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 10h16M8.5 3.5v4M15.5 3.5v4"
  }));
  const Bomb = ({
    size = 24,
    color = T
  }) => /*#__PURE__*/React.createElement("svg", base(size, color), /*#__PURE__*/React.createElement("circle", {
    cx: "10.5",
    cy: "14.5",
    r: "6.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 10l2.4-2.4M17.5 7.5l1.3.4M17.5 7.5l-.4-1.3M19.5 5.5l1.5-1.5"
  }));
  const Crown = ({
    size = 24,
    color = '#FFCA66'
  }) => /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3.5 18l-1-9 5 3.5L12 5l4.5 7.5 5-3.5-1 9z",
    fill: color,
    stroke: "#E2A82E",
    strokeWidth: "1.6",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 18h17",
    stroke: "#E2A82E",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }));
  const Coin = ({
    size = 24
  }) => /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12.6",
    r: "9.4",
    fill: "#E2A02A"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "11.4",
    r: "9.4",
    fill: "#FFC24B"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "11.4",
    r: "6.6",
    fill: "#FFD988"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7.4l1.5 3 3.3.5-2.4 2.3.6 3.3L12 18l-3-1.5.6-3.3-2.4-2.3 3.3-.5z",
    fill: "#E2A02A",
    opacity: "0.5"
  }));
  const FilledStar = ({
    size = 24,
    earned = true
  }) => /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 100 100"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M50 8 L61.8 35.1 L91 38 L68.5 57.8 L75.3 86.4 L50 71 L24.7 86.4 L31.5 57.8 L9 38 L38.2 35.1 Z",
    fill: earned ? '#FFCA66' : '#F4E9D8',
    stroke: earned ? '#E2A82E' : '#D8C7AC',
    strokeWidth: "6",
    strokeLinejoin: "round"
  }), earned && /*#__PURE__*/React.createElement("path", {
    d: "M40 30 L50 22 L60 30",
    fill: "none",
    stroke: "#FFF0C4",
    strokeWidth: "5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    opacity: "0.85"
  }));

  // a row of 3 stars; `earned` = how many are gold, others sunken. The middle
  // star sits a touch higher (classic match-3 win flourish).
  function Stars({
    earned = 0,
    size = 40,
    gap = 4,
    lift = true,
    animate = false
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap
      }
    }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: lift && i === 1 ? size * 0.18 : 0,
        transform: `scale(${i === 1 ? 1.18 : 1})`,
        transformOrigin: 'bottom center',
        animation: animate && i < earned ? `gj-star-pop 420ms var(--ease-jelly) ${i * 140 + 120}ms both` : 'none'
      }
    }, /*#__PURE__*/React.createElement(FilledStar, {
      size: size,
      earned: i < earned
    }))));
  }

  // "+N" coin pill used for rewards.
  function CoinChip({
    amount,
    size = 'md',
    style = {}
  }) {
    const big = size === 'lg';
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: big ? '6px 14px 6px 8px' : '4px 11px 4px 6px',
        borderRadius: 999,
        background: '#FFF3D6',
        boxShadow: 'inset 0 0 0 1.5px #FBE3AE',
        ...style
      }
    }, /*#__PURE__*/React.createElement(Coin, {
      size: big ? 24 : 19
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: big ? 18 : 15,
        color: '#B9821C',
        lineHeight: 1
      }
    }, typeof amount === 'number' ? amount.toLocaleString('vi-VN') : amount));
  }

  // small "AD" reward badge — a play triangle + AD tag, for rewarded actions.
  function AdBadge({
    style = {}
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 7px',
        borderRadius: 6,
        background: 'rgba(255,255,255,0.32)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.06em',
        color: 'currentColor',
        ...style
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "9",
      height: "9",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 5l12 7-12 7V5z",
      fill: "currentColor"
    })), "AD");
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
  window.GJExtras = {
    Lock,
    Clock,
    Gift,
    Plus,
    Target,
    Calendar,
    Bomb,
    Crown,
    Coin,
    FilledStar,
    Stars,
    CoinChip,
    AdBadge
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/screen-extras.jsx", error: String((e && e.message) || e) }); }

// 04-screens/settings-screen.jsx
try { (() => {
/* settings-screen.jsx — SETTINGS. Sound / music / vibration toggles,
   language segmented control, info rows. Exposes window.GJSettingsScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Icon
  } = NS;
  function Switch({
    on,
    onToggle
  }) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onToggle,
      "aria-pressed": on,
      style: {
        width: 52,
        height: 30,
        borderRadius: 'var(--radius-full)',
        border: 'none',
        padding: 3,
        cursor: 'pointer',
        background: on ? 'var(--color-success)' : '#E2D4BD',
        boxShadow: 'inset 0 1px 3px rgba(120,92,52,0.18)',
        display: 'flex',
        justifyContent: on ? 'flex-end' : 'flex-start',
        transition: 'background var(--motion-base) var(--ease-inout)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--motion-base) var(--ease-jelly)'
      }
    }));
  }
  function Row({
    icon,
    label,
    children,
    last
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        minHeight: 56,
        padding: '0 var(--space-lg)',
        borderBottom: last ? 'none' : '1.5px solid var(--color-cell-line)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface-sunken)',
        color: 'var(--color-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 20
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, label), children);
  }
  function Group({
    title,
    children,
    overflowVisible
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 'var(--space-lg)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-text-muted)',
        margin: '0 var(--space-sm) var(--space-sm)'
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: overflowVisible ? 'visible' : 'hidden'
      }
    }, children));
  }

  // Resolve the device language for the "system default" option — Vietnamese
  // only when the OS is Vietnamese, otherwise English.
  const sysLang = typeof navigator !== 'undefined' && /^vi/i.test(navigator.language || '') ? 'vi' : 'en';
  const sysSubLabel = sysLang === 'vi' ? 'Tiếng Việt' : 'English';
  function LangDropdown({
    value,
    onChange
  }) {
    const opts = [['system', 'Theo hệ thống'], ['vi', 'Tiếng Việt'], ['en', 'English']];
    const [open, setOpen] = React.useState(false);
    const cur = opts.find(o => o[0] === value) || opts[0];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, open && /*#__PURE__*/React.createElement("div", {
      onClick: () => setOpen(false),
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 30
      }
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => setOpen(o => !o),
      "aria-haspopup": "listbox",
      "aria-expanded": open,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        border: 'none',
        cursor: 'pointer',
        padding: '7px 8px 7px 14px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-surface-sunken)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, cur[1], /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 16,
      color: "var(--color-text-muted)",
      style: {
        transform: open ? 'rotate(-90deg)' : 'rotate(90deg)',
        transition: 'transform var(--motion-fast) var(--ease-out)'
      }
    })), open && /*#__PURE__*/React.createElement("div", {
      role: "listbox",
      style: {
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        zIndex: 31,
        minWidth: 190,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        padding: 4,
        border: '1.5px solid var(--color-cell-line)'
      }
    }, opts.map(([k, lbl]) => /*#__PURE__*/React.createElement("button", {
      key: k,
      type: "button",
      role: "option",
      "aria-selected": value === k,
      onClick: () => {
        onChange(k);
        setOpen(false);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%',
        border: 'none',
        cursor: 'pointer',
        padding: '9px 12px',
        borderRadius: 'var(--radius-md)',
        background: value === k ? 'var(--color-surface-sunken)' : 'transparent',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)',
        whiteSpace: 'nowrap',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("span", null, lbl, k === 'system' && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--color-text-muted)',
        fontWeight: 600
      }
    }, ' · ' + sysSubLabel)), value === k && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 18,
      color: "var(--color-success)"
    })))));
  }
  function SettingsScreen({
    settings = {
      sound: true,
      music: true,
      vibrate: false,
      lang: 'system'
    },
    onToggle,
    onLang,
    onBack
  }) {
    const s = settings;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 'var(--dim-hud-h)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: '0 var(--space-md)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onBack,
      "aria-label": "Quay l\u1EA1i",
      style: {
        width: 'var(--dim-icon-btn)',
        height: 'var(--dim-icon-btn)',
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        background: 'transparent',
        color: 'var(--color-text)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "back",
      size: 24
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-title)',
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, "C\xE0i \u0111\u1EB7t")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-md) var(--space-lg) var(--space-xl)'
      }
    }, /*#__PURE__*/React.createElement(Group, {
      title: "\xC2M THANH"
    }, /*#__PURE__*/React.createElement(Row, {
      icon: "volume",
      label: "\xC2m thanh"
    }, /*#__PURE__*/React.createElement(Switch, {
      on: s.sound,
      onToggle: () => onToggle('sound')
    })), /*#__PURE__*/React.createElement(Row, {
      icon: "music",
      label: "Nh\u1EA1c n\u1EC1n"
    }, /*#__PURE__*/React.createElement(Switch, {
      on: s.music,
      onToggle: () => onToggle('music')
    })), /*#__PURE__*/React.createElement(Row, {
      icon: "vibrate",
      label: "Rung",
      last: true
    }, /*#__PURE__*/React.createElement(Switch, {
      on: s.vibrate,
      onToggle: () => onToggle('vibrate')
    }))), /*#__PURE__*/React.createElement(Group, {
      title: "NG\xD4N NG\u1EEE",
      overflowVisible: true
    }, /*#__PURE__*/React.createElement(Row, {
      icon: "globe",
      label: "Ng\xF4n ng\u1EEF",
      last: true
    }, /*#__PURE__*/React.createElement(LangDropdown, {
      value: s.lang,
      onChange: onLang
    }))), /*#__PURE__*/React.createElement(Group, {
      title: "TH\xD4NG TIN"
    }, /*#__PURE__*/React.createElement(Row, {
      icon: "info",
      label: "Phi\xEAn b\u1EA3n"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: 'var(--color-text-muted)'
      }
    }, "1.0.0")), /*#__PURE__*/React.createElement(Row, {
      icon: "heart",
      label: "\u0110\xE1nh gi\xE1 game"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 20,
      color: "var(--color-text-muted)"
    })), /*#__PURE__*/React.createElement(Row, {
      icon: "settings",
      label: "Ch\xEDnh s\xE1ch b\u1EA3o m\u1EADt",
      last: true
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 20,
      color: "var(--color-text-muted)"
    })))));
  }
  window.GJSettingsScreen = SettingsScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/settings-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/shop-screen.jsx
try { (() => {
/* shop-screen.jsx — SHOP / STORE. Coin balance header, booster shelf, coin
   packs. Tabbed. Exposes window.GJShopScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Button,
    Icon
  } = NS;
  const EX = window.GJExtras;
  function Tabs({
    value,
    onChange
  }) {
    const opts = [['boosters', 'Vật phẩm'], ['coins', 'Mua xu']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        padding: 4,
        background: 'var(--color-surface-sunken)',
        borderRadius: 999,
        margin: '0 var(--space-lg) var(--space-md)'
      }
    }, opts.map(([k, l]) => /*#__PURE__*/React.createElement("button", {
      key: k,
      type: "button",
      onClick: () => onChange(k),
      style: {
        flex: 1,
        height: 38,
        border: 'none',
        cursor: 'pointer',
        borderRadius: 999,
        background: value === k ? 'var(--color-surface)' : 'transparent',
        boxShadow: value === k ? 'var(--shadow-sm)' : 'none',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-label)',
        color: value === k ? 'var(--color-text)' : 'var(--color-text-muted)'
      }
    }, l)));
  }
  function BoosterCard({
    glyph,
    color,
    name,
    desc,
    price
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: 'var(--space-md)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        height: 52,
        borderRadius: 'var(--radius-md)',
        background: `color-mix(in srgb, ${color} 16%, var(--color-surface))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, glyph), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)'
      }
    }, name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-muted)'
      }
    }, desc)), /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        border: 'none',
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: 999,
        background: 'var(--color-primary)',
        boxShadow: '0 3px 0 var(--color-primary-edge)',
        color: '#fff',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(EX.Coin, {
      size: 17
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-label)'
      }
    }, price)));
  }
  function CoinPack({
    amount,
    price,
    tag,
    best
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: 'var(--space-lg) var(--space-md) var(--space-md)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: best ? '0 0 0 3px var(--color-warning), var(--shadow-md)' : 'var(--shadow-sm)'
      }
    }, best && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -10,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.06em',
        color: 'var(--color-text)',
        background: 'var(--color-warning)',
        padding: '3px 10px',
        borderRadius: 999
      }
    }, "T\u1ED0T NH\u1EA4T"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex'
      }
    }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginLeft: i ? -10 : 0
      }
    }, /*#__PURE__*/React.createElement(EX.Coin, {
      size: tag === 'lg' ? 40 : tag === 'md' ? 32 : 26
    })))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-heading)',
        color: 'var(--color-text)',
        lineHeight: 1
      }
    }, amount.toLocaleString('vi-VN')), /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: {
        width: '100%',
        border: 'none',
        cursor: 'pointer',
        padding: '9px 0',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-success)',
        boxShadow: '0 3px 0 #4FAE60',
        color: '#fff',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-label)'
      }
    }, price));
  }
  function ShopScreen({
    balance = 1240,
    tab = 'boosters',
    onTab,
    onBack
  }) {
    const [t, setT] = React.useState(tab);
    const setTab = k => {
      setT(k);
      onTab && onTab(k);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 'var(--dim-hud-h)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: '0 var(--space-md)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onBack,
      "aria-label": "Quay l\u1EA1i",
      style: {
        width: 'var(--dim-icon-btn)',
        height: 'var(--dim-icon-btn)',
        borderRadius: 'var(--radius-lg)',
        border: 'none',
        background: 'transparent',
        color: 'var(--color-text)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "back",
      size: 24
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        flex: 1,
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-title)',
        color: 'var(--color-text)'
      }
    }, "C\u1EEDa h\xE0ng"), /*#__PURE__*/React.createElement(EX.CoinChip, {
      amount: balance,
      size: "lg"
    })), /*#__PURE__*/React.createElement(Tabs, {
      value: t,
      onChange: setTab
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 var(--space-lg) var(--space-xl)'
      }
    }, t === 'boosters' ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)'
      }
    }, /*#__PURE__*/React.createElement(BoosterCard, {
      color: "var(--color-gravity)",
      glyph: /*#__PURE__*/React.createElement(Icon, {
        name: "rotateCw",
        size: 28,
        color: "var(--color-gravity)"
      }),
      name: "Th\xEAm l\u01B0\u1EE3t xoay",
      desc: "+5 l\u01B0\u1EE3t xoay tr\u1ECDng l\u1EF1c",
      price: 120
    }), /*#__PURE__*/React.createElement(BoosterCard, {
      color: "var(--color-danger)",
      glyph: /*#__PURE__*/React.createElement(EX.Bomb, {
        size: 28,
        color: "var(--color-danger)"
      }),
      name: "Bom ph\xE1 kh\u1ED1i",
      desc: "X\xF3a 1 v\xF9ng 3\xD73",
      price: 200
    }), /*#__PURE__*/React.createElement(BoosterCard, {
      color: "var(--color-info)",
      glyph: /*#__PURE__*/React.createElement(EX.Target, {
        size: 28,
        color: "var(--color-info)"
      }),
      name: "\u0110\u1ED5i m\xE0u kh\u1ED1i",
      desc: "\u0110\u1ED5i 1 kh\u1ED1i sang m\xE0u b\u1EA1n ch\u1ECDn",
      price: 160
    }), /*#__PURE__*/React.createElement(BoosterCard, {
      color: "var(--color-success)",
      glyph: /*#__PURE__*/React.createElement(Icon, {
        name: "refresh",
        size: 28,
        color: "var(--color-success)"
      }),
      name: "X\xE1o l\u1EA1i b\xE0n",
      desc: "Tr\u1ED9n l\u1EA1i to\xE0n b\u1ED9 kh\u1ED1i",
      price: 150
    }), /*#__PURE__*/React.createElement(BoosterCard, {
      color: "var(--color-primary)",
      glyph: /*#__PURE__*/React.createElement(Icon, {
        name: "heart",
        size: 28,
        color: "var(--color-primary)"
      }),
      name: "\u0110\u1EA7y l\u01B0\u1EE3t ch\u01A1i",
      desc: "H\u1ED3i \u0111\u1EA7y 5 tim ngay",
      price: 250
    })) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-sm)'
      }
    }, /*#__PURE__*/React.createElement(CoinPack, {
      amount: 500,
      price: "22.000\u0111",
      tag: "sm"
    }), /*#__PURE__*/React.createElement(CoinPack, {
      amount: 1200,
      price: "49.000\u0111",
      tag: "md"
    }), /*#__PURE__*/React.createElement(CoinPack, {
      amount: 3000,
      price: "99.000\u0111",
      tag: "lg",
      best: true
    }), /*#__PURE__*/React.createElement(CoinPack, {
      amount: 6500,
      price: "199.000\u0111",
      tag: "lg"
    }))));
  }
  window.GJShopScreen = ShopScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/shop-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/splash-screen.jsx
try { (() => {
/* splash-screen.jsx — SPLASH / LOADING. Boot screen: logo (jelly tiles +
   wordmark), bobbing blocks, a jelly progress bar, version. Exposes
   window.GJSplashScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    JellyBlock
  } = NS;
  const WORDMARK = '../08-brand/wordmark.png';
  function SplashScreen({
    progress = 0.68,
    version = '1.0.0'
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 'var(--space-xl)',
        boxSizing: 'border-box',
        background: 'radial-gradient(120% 80% at 50% 28%, #FFFDF7 0%, var(--color-bg) 58%, #F3E3CC 100%)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        top: 70,
        left: -30,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'var(--color-block-mint-shine)',
        opacity: 0.5,
        filter: 'blur(6px)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        bottom: 120,
        right: -24,
        width: 90,
        height: 90,
        borderRadius: '50%',
        background: 'var(--color-block-pink-shine)',
        opacity: 0.55,
        filter: 'blur(6px)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        animation: 'gj-bob 1800ms var(--ease-jelly, ease-in-out) infinite'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: WORDMARK,
      alt: "Gravity Jelly",
      style: {
        display: 'block',
        width: 244,
        height: 'auto',
        userSelect: 'none',
        filter: 'drop-shadow(0 8px 14px rgba(120,92,52,0.22))'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 64,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: '0 var(--space-3xl)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: 14,
        borderRadius: 999,
        background: 'var(--color-surface-sunken)',
        boxShadow: 'inset 0 1px 3px var(--color-shadow-soft)',
        overflow: 'hidden',
        padding: 2,
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${Math.round(progress * 100)}%`,
        height: '100%',
        borderRadius: 999,
        background: 'linear-gradient(90deg, var(--color-block-mint), var(--color-block-blue))',
        boxShadow: 'var(--shadow-gloss-inset)',
        transition: 'width 400ms var(--ease-out)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-text-muted)'
      }
    }, "\u0110ANG T\u1EA2I\u2026 ", Math.round(progress * 100), "%")), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: 22,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-muted)',
        opacity: 0.7
      }
    }, "v", version));
  }
  window.GJSplashScreen = SplashScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/splash-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// 07-mechanics/mechanics-cards.js
try { (() => {
/* mechanics-cards.js — declarative registry for every "THẺ CƠ CHẾ".
   window.GJ_MECH_CARDS[id] → { group, name, subtitle, caption, kind, ... }.
   Board cards: kind 'board' (default) with before/after MiniBoard configs +
   action. Widget cards: kind = a window.GJMechW key + its props.
   Render with GJMech.renderById(id, rootEl). */

(function () {
  const grav = {
    A: 'Trọng lực',
    B: 'Cụm / Màu',
    C: 'Hazard',
    D: 'Khay',
    E: 'Mục tiêu',
    F: 'Boss',
    G: 'Meta'
  };
  const C = {
    /* ===================== A · TRỌNG LỰC ===================== */
    a1: {
      group: grav.A,
      name: 'Xoay 90°',
      subtitle: 'Cơ chế chữ ký — chạm để xoay trọng lực 90°, cả bàn đổ lại theo hướng mới',
      before: {
        rows: ['.....', '....Y', '..YMY', '.MMPB', '.PP.B'],
        direction: 'down'
      },
      action: {
        icon: 'rotate',
        label: 'Xoay ←'
      },
      after: {
        rows: ['YM...', 'MMP..', 'YMPB.', 'PPB..', 'YB...'],
        direction: 'left',
        glow: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]
      },
      caption: 'Chạm để xoay 90° — cả bàn đổ lại theo hướng mới.'
    },
    a2: {
      group: grav.A,
      name: 'Lật ngược 180°',
      subtitle: 'Lật ngược cả bàn một phát — tốn 2 lượt xoay',
      before: {
        rows: ['.....', '.....', '.PMB.', 'YPMBY', 'YPMBY'],
        direction: 'down'
      },
      action: {
        icon: 'rotate',
        label: '↑↓ 180° · −2 lượt'
      },
      after: {
        rows: ['YPMBY', 'YPMBY', '.PMB.', '.....', '.....'],
        direction: 'up'
      },
      caption: 'Lật ngược cả bàn một phát — tốn 2 lượt xoay.'
    },
    a3: {
      group: grav.A,
      name: 'Trọng lực chéo',
      subtitle: 'Dồn cả bàn về một góc — combo lạ, dùng dè',
      before: {
        rows: ['Y...M', '..P..', '.B...', '...Y.', 'M...P'],
        direction: 'down'
      },
      action: {
        icon: 'arrow',
        label: 'Dồn ↘'
      },
      after: {
        rows: ['.....', '.....', '...YP', '..MBY', '.PMBP'],
        direction: 'right'
      },
      caption: 'Dồn cả bàn về một góc — combo lạ, dùng dè.'
    },
    a4: {
      group: grav.A,
      name: 'Trọng lực điểm',
      subtitle: 'Mọi khối hút về tâm — sân khấu cho màn Vũ trụ / boss',
      before: {
        rows: ['YM.PB', 'P...M', '.....', 'M...P', 'BP.MY'],
        direction: 'down',
        deco: {
          '2,2': {
            type: 'target'
          }
        }
      },
      action: {
        icon: 'rays',
        label: 'Hút tâm'
      },
      after: {
        rows: ['.....', '.YMP.', '.B.B.', '.PMY.', '.....'],
        direction: 'down',
        deco: {
          '2,2': {
            type: 'target'
          }
        }
      },
      caption: 'Mọi khối hút về tâm — sân khấu cho màn Vũ trụ / boss.'
    },
    a5: {
      group: grav.A,
      name: 'Chia vùng',
      subtitle: 'Hai nửa bàn, hai chiều trọng lực ngược nhau',
      before: {
        rows: ['YMPBY', '.....', '.....', '.....', 'BPMYB'],
        direction: 'down',
        divider: {
          after: 2
        }
      },
      action: {
        icon: null,
        label: '↓  giữa  ↑'
      },
      after: {
        rows: ['.....', '.....', 'YMPBY', 'BPMYB', '.....'],
        direction: 'down',
        divider: {
          after: 2
        }
      },
      caption: 'Hai nửa bàn, hai chiều trọng lực ngược nhau.'
    },
    a6: {
      group: grav.A,
      name: 'Đảo tự động',
      subtitle: 'Môi trường tự đảo trọng lực theo nhịp — đặc trị màn / boss',
      before: {
        rows: ['.....', '.....', '.YMP.', 'BYMPB', 'BYMPB'],
        direction: 'down'
      },
      action: {
        icon: 'clock',
        label: 'Tự đảo sau 2 lượt',
        tone: 'warning'
      },
      after: {
        rows: ['BYMPB', 'BYMPB', '.YMP.', '.....', '.....'],
        direction: 'up'
      },
      caption: 'Môi trường tự đảo trọng lực theo nhịp — đặc trị màn / boss.'
    },
    a7: {
      group: grav.A,
      name: 'Không trọng lực',
      subtitle: 'Khối đứng yên giữa không trung vài lượt rồi mới rơi',
      before: {
        rows: ['.....', '.Y.P.', '...M.', '.B...', '.....'],
        direction: 'down',
        deco: {
          '1,1': {
            type: 'float'
          },
          '1,3': {
            type: 'float'
          },
          '2,3': {
            type: 'float'
          },
          '3,1': {
            type: 'float'
          }
        }
      },
      action: {
        icon: null,
        label: 'Zero-G · 2 lượt'
      },
      after: {
        rows: ['.....', '.....', '.....', '...M.', '.YBP.'],
        direction: 'down'
      },
      caption: 'Khối đứng yên giữa không trung vài lượt rồi mới rơi.'
    },
    a8: {
      group: grav.A,
      name: 'Combo hồi xoay',
      subtitle: 'Tạo combo lớn được thưởng thêm một lượt xoay',
      before: {
        rows: ['.P...', '.P.B.', '.PMB.', '.PMB.', '.P.B.'],
        direction: 'down',
        glow: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]]
      },
      action: {
        icon: 'star',
        label: '+1 lượt xoay'
      },
      after: {
        rows: ['.....', '...B.', '..MB.', '..MB.', '...B.'],
        direction: 'down'
      },
      caption: 'Tạo combo lớn được thưởng thêm một lượt xoay (1 → 2).'
    },
    a9: {
      group: grav.A,
      name: 'Khoá xoay',
      subtitle: 'Bị khoá xoay vài lượt — phải xoay sở bằng đặt mảnh',
      kind: 'fabLock',
      caption: 'Bị khoá xoay vài lượt — phải xoay sở bằng đặt mảnh.'
    },
    a10: {
      group: grav.A,
      name: 'Xoay cục bộ',
      subtitle: 'Chỉ một cụm đổi hướng rơi — biến thể thử nghiệm',
      before: {
        rows: ['.YY..', '.YY..', '.....', '...PB', '...PB'],
        direction: 'down',
        glow: [[0, 1], [0, 2], [1, 1], [1, 2]],
        deco: {
          '3,3': {
            type: 'dim'
          },
          '3,4': {
            type: 'dim'
          },
          '4,3': {
            type: 'dim'
          },
          '4,4': {
            type: 'dim'
          }
        }
      },
      action: {
        icon: 'rotate',
        label: 'Xoay riêng cụm'
      },
      after: {
        rows: ['.....', '.....', '.....', 'YY.PB', 'YY.PB'],
        direction: 'down'
      },
      caption: 'Chỉ một cụm đổi hướng rơi — biến thể thử nghiệm.'
    },
    /* ===================== B · CỤM / MÀU ===================== */
    b0: {
      group: grav.B,
      name: 'Hợp nhất → Thạch Hoàng Gia',
      subtitle: 'Cơ chế chủ lực — gom 9 ô cùng màu thành 1 Thạch Hoàng Gia',
      before: {
        rows: ['.....', '.MMM.', '.MMM.', '.MMM.', '.....'],
        direction: 'front',
        glow: [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3]]
      },
      action: {
        icon: 'star',
        label: 'Hợp nhất'
      },
      after: {
        rows: ['.....', '.....', '..o..', '.....', '.....'],
        superAt: [2, 2, 'mint']
      },
      caption: 'Gom 9 ô cùng màu → 1 Thạch Hoàng Gia; xóa chạm nó = nổ lớn.'
    },
    b0b: {
      group: grav.B,
      name: 'Nổ Thạch Hoàng Gia',
      subtitle: 'Thạch Hoàng Gia nổ 3×3 — combo khủng, ở boss = sát thương nặng',
      before: {
        rows: ['.....', '.YYY.', '.Y.Y.', '.YYY.', '.....'],
        direction: 'down',
        superAt: [2, 2, 'mint'],
        glow: [[1, 1], [1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2], [3, 3]]
      },
      action: {
        icon: 'bomb',
        label: 'Kích nổ',
        tone: 'danger'
      },
      after: {
        rows: ['B...P', '.....', '.....', '.....', 'Y...M'],
        direction: 'down'
      },
      caption: 'Thạch Hoàng Gia nổ 3×3 — combo khủng, ở boss = sát thương nặng.'
    },
    b1: {
      group: grav.B,
      name: 'Combo leo thang',
      subtitle: 'Xóa liên tiếp nuôi bội số combo — đứt nhịp thì reset',
      kind: 'comboMeter',
      caption: 'Xóa liên tiếp nuôi bội số combo — đứt nhịp thì reset.'
    },
    b2: {
      group: grav.B,
      name: 'Xóa toàn 1 màu',
      subtitle: 'Xóa trọn hàng toàn 1 màu → thưởng 1 Thạch Cầu Vồng + điểm hàng ×2',
      before: {
        rows: ['.....', '.....', '.....', 'PPPPP', 'BYMBY'],
        direction: 'down',
        glow: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]]
      },
      action: {
        icon: 'star',
        label: 'MÀU HOÀN HẢO · ×2 điểm',
        tone: 'success'
      },
      after: {
        rows: ['..R..', '.....', '.....', '.....', 'BYMBY'],
        direction: 'down',
        rainbow: [[0, 2]],
        glow: [[0, 2]]
      },
      afterLabel: 'PHẦN THƯỞNG',
      caption: '“Màu hoàn hảo” = xóa trọn một hàng toàn 1 màu. Thưởng: điểm hàng đó ×2 và 1 Thạch Cầu Vồng (ghép được mọi màu) rơi vào khay.'
    },
    b3: {
      group: grav.B,
      name: 'Thạch Cầu Vồng',
      subtitle: 'Cụm 3×3 (9 ô) gồm 3 màu — 3 ô mỗi màu — hợp nhất thành Thạch Cầu Vồng',
      before: {
        rows: ['.....', '.YYY.', '.MMM.', '.PPP.', '.....'],
        direction: 'down',
        glow: [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3]]
      },
      action: {
        icon: 'star',
        label: 'Hợp nhất cụm 3 màu',
        tone: 'gravity'
      },
      after: {
        rows: ['.....', '.....', '..R..', '.....', '.....'],
        direction: 'down',
        rainbow: [[2, 2]],
        glow: [[2, 2]]
      },
      caption: 'Cụm 3×3 đủ 9 ô gồm 3 màu khác nhau (3 ô mỗi màu) hợp nhất thành 1 Thạch Cầu Vồng — ghép được mọi màu.'
    },
    b4: {
      group: grav.B,
      name: 'Vua Thạch',
      subtitle: 'Gộp 2 Thạch Hoàng Gia → đại nổ cả hàng lẫn cột',
      before: {
        rows: ['.....', '.....', '.oo..', '.....', '.....'],
        supers: [[2, 1, 'mint'], [2, 2, 'mint']]
      },
      action: {
        icon: 'star',
        label: 'Gộp 2 Thạch Hoàng Gia'
      },
      after: {
        rows: ['.....', '.....', '..o..', '.....', '.....'],
        superAt: [2, 2, 'mint'],
        mega: true,
        glow: [[0, 2], [1, 2], [3, 2], [4, 2], [2, 0], [2, 1], [2, 3], [2, 4]]
      },
      caption: 'Gộp 2 Thạch Hoàng Gia → đại nổ cả hàng lẫn cột.'
    },
    b5: {
      group: grav.B,
      name: 'Cụm nặng',
      subtitle: 'Cụm to rơi mạnh, đè vỡ ô yếu / băng phía dưới',
      before: {
        rows: ['.BBB.', '.BBB.', '.....', '.....', '..M..'],
        direction: 'down',
        deco: {
          '4,2': {
            type: 'ice'
          }
        }
      },
      action: {
        icon: 'heavy',
        label: 'Cụm nặng rơi'
      },
      after: {
        rows: ['.....', '.....', '.BBB.', '.BBB.', '..M..'],
        direction: 'down',
        glow: [[4, 2]]
      },
      caption: 'Cụm to rơi mạnh, đè vỡ ô yếu / băng phía dưới.'
    },
    b6: {
      group: grav.B,
      name: 'Ô nhuộm',
      subtitle: 'Ô nhuộm biến các ô kề sang màu nó — hỗ trợ gom màu',
      before: {
        rows: ['.....', '.YMY.', '.MPM.', '.YMY.', '.....'],
        direction: 'down',
        deco: {
          '2,2': {
            type: 'dye'
          }
        }
      },
      action: {
        icon: null,
        label: 'Sóng nhuộm',
        tone: 'gravity'
      },
      after: {
        rows: ['.....', '.YPY.', '.PPP.', '.YPY.', '.....'],
        direction: 'down',
        deco: {
          '2,2': {
            type: 'dye'
          }
        }
      },
      caption: 'Ô nhuộm biến các ô kề sang màu nó — hỗ trợ gom màu.'
    },
    b7: {
      group: grav.B,
      name: 'Mầm tách màu',
      subtitle: 'Xóa cụm để lại mầm màu khác — chuỗi mục tiêu nối tiếp',
      before: {
        rows: ['.....', '.MMM.', '.MMM.', '.MMM.', '.....'],
        direction: 'down',
        glow: [[2, 2]]
      },
      action: {
        icon: 'star',
        label: 'Xóa cụm'
      },
      after: {
        rows: ['.....', '.....', '..B..', '.....', '.....'],
        direction: 'down',
        deco: {
          '2,2': {
            type: 'seed'
          }
        }
      },
      caption: 'Xóa cụm để lại mầm màu khác — chuỗi mục tiêu nối tiếp.'
    },
    /* ===================== C · HAZARD ===================== */
    cpool: {
      group: grav.C,
      name: 'Bảng modifier',
      subtitle: 'Bộ ô đặc biệt sẵn có — băng, khoá, tường, bom, đá nở, trượt…',
      kind: 'modifierPalette',
      items: [{
        ch: 'M',
        deco: {
          type: 'ice'
        },
        label: 'Ô băng'
      }, {
        ch: 'Y',
        deco: {
          type: 'lock'
        },
        label: 'Ô khoá'
      }, {
        ch: 'B',
        deco: {
          type: 'arrow'
        },
        label: 'Tường 1 chiều'
      }, {
        ch: 'P',
        deco: {
          type: 'hidden'
        },
        label: 'Ẩn preview'
      }, {
        ch: 'P',
        deco: {
          type: 'bomb'
        },
        label: 'Ô bom'
      }, {
        ch: 'S',
        deco: {
          type: 'expand'
        },
        label: 'Đá nở'
      }, {
        ch: 'M',
        deco: {
          type: 'slide'
        },
        label: 'Ô trượt'
      }, {
        ch: 'B',
        deco: {
          type: 'heavy'
        },
        label: 'Cụm nặng'
      }, {
        ch: 'Y',
        deco: {
          type: 'norotate'
        },
        label: 'Cấm xoay'
      }],
      caption: 'Kho ô modifier dùng lại khắp các màn — ghép tuỳ độ khó.'
    },
    c1: {
      group: grav.C,
      name: 'Ô xích',
      subtitle: 'Hai ô xích nối nhau — xóa cùng lúc mới ăn',
      before: {
        rows: ['.....', '.Y...', '.....', '...M.', '.....'],
        direction: 'down',
        chains: [[[1, 1], [3, 3]]],
        glow: [[1, 1], [3, 3]]
      },
      action: {
        icon: 'star',
        label: 'Xóa cùng lúc'
      },
      after: {
        rows: ['.....', '.....', '.....', '.....', '.....'],
        direction: 'down'
      },
      caption: 'Hai ô xích nối nhau — xóa cùng lúc mới ăn.'
    },
    c2: {
      group: grav.C,
      name: 'Ô đếm ngược',
      subtitle: 'Không xóa trong N lượt, ô hoá đá — ép nhịp',
      before: {
        rows: ['.YM..', '..B..', '..P..', '.MB..', '.....'],
        direction: 'down',
        deco: {
          '2,2': {
            type: 'clock',
            num: 2
          }
        }
      },
      action: {
        icon: 'clock',
        label: 'Không xóa kịp',
        tone: 'warning'
      },
      after: {
        rows: ['.YM..', '..B..', '..S..', '.MB..', '.....'],
        direction: 'down'
      },
      caption: 'Không xóa trong N lượt, ô hoá đá — ép nhịp.'
    },
    c3: {
      group: grav.C,
      name: 'Cổng dịch chuyển',
      subtitle: 'Cụm rơi vào cổng A, ra ở cổng B — câu đố trọng lực',
      before: {
        rows: ['.....', '.YM..', '.....', '.....', '.....'],
        direction: 'down',
        deco: {
          '0,0': {
            type: 'portal'
          },
          '4,4': {
            type: 'portal'
          }
        }
      },
      action: {
        icon: 'portal',
        label: 'Qua cổng'
      },
      after: {
        rows: ['.....', '.....', '.....', '...Y.', '...M.'],
        direction: 'down',
        deco: {
          '0,0': {
            type: 'portal'
          },
          '4,4': {
            type: 'portal'
          }
        }
      },
      caption: 'Cụm rơi vào cổng A, ra ở cổng B — câu đố trọng lực.'
    },
    c4: {
      group: grav.C,
      name: 'Ô keo',
      subtitle: 'Cụm dính keo không rơi dù xoay — chướng ngại cứng đầu',
      before: {
        rows: ['.....', '.YY..', '.YY..', '.....', 'P.B.M'],
        direction: 'down',
        deco: {
          '1,1': {
            type: 'sticky'
          }
        }
      },
      action: {
        icon: 'rotate',
        label: 'Xoay'
      },
      after: {
        rows: ['.....', '.YY..', '.YY..', '.....', '...PBM'.slice(0, 5)],
        direction: 'right',
        deco: {
          '1,1': {
            type: 'sticky'
          }
        }
      },
      caption: 'Cụm dính keo không rơi dù xoay — chướng ngại cứng đầu.'
    },
    c5: {
      group: grav.C,
      name: 'Ô nam châm',
      subtitle: 'Nam châm hút mảnh đặt gần lệch về phía nó',
      before: {
        rows: ['.....', '..B..', '.....', '...P.', '.....'],
        direction: 'down',
        deco: {
          '1,2': {
            type: 'magnet'
          }
        }
      },
      action: {
        icon: 'magnet',
        label: 'Lực hút',
        tone: 'danger'
      },
      after: {
        rows: ['.....', '..B..', '.....', '..P..', '.....'],
        direction: 'down',
        deco: {
          '1,2': {
            type: 'magnet'
          }
        }
      },
      caption: 'Nam châm hút mảnh đặt gần lệch về phía nó.'
    },
    c6: {
      group: grav.C,
      name: 'Ô gai',
      subtitle: 'Ô gai cấm đặt lên — phải đi vòng',
      before: {
        rows: ['..P..', '.....', '.....', '.....', '.....'],
        direction: 'down',
        deco: {
          '2,1': {
            type: 'spike'
          },
          '2,2': {
            type: 'spike'
          },
          '2,3': {
            type: 'spike'
          }
        }
      },
      action: {
        icon: null,
        label: 'Cấm đặt',
        tone: 'danger'
      },
      after: {
        rows: ['.....', '.....', '.....', '.P...', '.....'],
        direction: 'down',
        deco: {
          '2,1': {
            type: 'spike'
          },
          '2,2': {
            type: 'spike'
          },
          '2,3': {
            type: 'spike'
          }
        }
      },
      caption: 'Ô gai cấm đặt lên — phải đi vòng.'
    },
    c7: {
      group: grav.C,
      name: 'Đá rơi',
      subtitle: 'Đá tự dội từ trên mỗi vài lượt — sức ép endless / boss',
      before: {
        rows: ['.....', '.....', '.YMP.', '.YMPB', '.YMPB'],
        direction: 'down'
      },
      action: {
        icon: 'heavy',
        label: 'Sắp rơi đá',
        tone: 'warning'
      },
      after: {
        rows: ['SSSSS', '.....', '.YMP.', '.YMPB', '.YMPB'],
        direction: 'down',
        glow: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
      },
      caption: 'Đá tự dội từ trên mỗi vài lượt — sức ép endless / boss.'
    },
    c8: {
      group: grav.C,
      name: 'Ô đổi hướng',
      subtitle: 'Chạm ô đổi hướng, riêng cụm đó rơi theo hướng mới',
      before: {
        rows: ['.....', '.YY..', '.YYB.', '.....', '.....'],
        direction: 'down',
        deco: {
          '2,3': {
            type: 'arrow'
          }
        }
      },
      action: {
        icon: 'arrow',
        label: 'Đổi hướng →'
      },
      after: {
        rows: ['.....', '.....', '...YY', '...YY', '.....'],
        direction: 'right',
        deco: {
          '2,3': {
            type: 'arrow'
          }
        }
      },
      caption: 'Chạm ô đổi hướng, riêng cụm đó rơi theo hướng mới.'
    },
    /* ===================== D · KHAY ===================== */
    d1: {
      group: grav.D,
      name: 'Giữ mảnh (Hold)',
      subtitle: 'Giữ tạm một mảnh để dành — gỡ thế bí',
      kind: 'trayHold',
      before: [{
        rows: ['YY', 'Y.']
      }, {
        rows: ['MMM']
      }, {
        rows: ['.P', 'PP']
      }],
      held: {
        rows: ['BB', 'BB']
      },
      after: [{
        rows: ['MM', '.M']
      }, {
        rows: ['MMM']
      }, {
        rows: ['.P', 'PP']
      }],
      caption: 'Giữ tạm một mảnh để dành — gỡ thế bí.'
    },
    d2: {
      group: grav.D,
      name: 'Xem trước 2 đợt',
      subtitle: 'Nhìn trước đợt khay kế — lập kế hoạch xa hơn',
      kind: 'trayPreview',
      current: [{
        rows: ['YY', 'Y.']
      }, {
        rows: ['MMM']
      }, {
        rows: ['.P', 'PP']
      }],
      next: [{
        rows: ['BB']
      }, {
        rows: ['M.', 'MM']
      }, {
        rows: ['PP', 'PP']
      }],
      caption: 'Nhìn trước đợt khay kế — lập kế hoạch xa hơn.'
    },
    d3: {
      group: grav.D,
      name: 'Mảnh đá',
      subtitle: 'Khay xen mảnh đá — buộc đặt rác, tăng khó',
      kind: 'tray',
      pieces: [{
        rows: ['YY', 'Y.']
      }, {
        rows: ['SSS']
      }, {
        rows: ['.P', 'PP']
      }],
      caption: 'Khay xen mảnh đá — buộc đặt rác, tăng khó.'
    },
    d4: {
      group: grav.D,
      name: 'Mảnh hai màu',
      subtitle: 'Mảnh hai màu — gom màu thành thử thách',
      kind: 'tray',
      pieces: [{
        rows: ['MM', '.M']
      }, {
        rows: ['YP', 'YP']
      }, {
        rows: ['BB']
      }],
      caption: 'Mảnh hai màu — gom màu thành thử thách.'
    },
    d5: {
      group: grav.D,
      name: 'Khay đơn',
      subtitle: 'Phát từng mảnh một — chế độ cho cao thủ',
      kind: 'traySingle',
      piece: {
        rows: ['.Y', 'YY']
      },
      caption: 'Phát từng mảnh một — chế độ cho cao thủ.'
    },
    d6: {
      group: grav.D,
      name: 'Mảnh khổng lồ',
      subtitle: 'Thỉnh thoảng một mảnh khổng lồ — khoảnh khắc đổi nhịp',
      kind: 'trayGiant',
      giant: {
        rows: ['BBB', 'BBB']
      },
      small: [{
        rows: ['YY']
      }, {
        rows: ['PP']
      }],
      caption: 'Thỉnh thoảng một mảnh khổng lồ — khoảnh khắc đổi nhịp.'
    },
    /* ===================== E · MỤC TIÊU ===================== */
    e1: {
      group: grav.E,
      name: 'Giải cứu',
      subtitle: 'Mục tiêu rất chất riêng — điều trọng lực đưa bé jelly tới cửa ra',
      before: {
        rows: ['..p..', '.Y.B.', 'YMMB.', '.BYM.', '.....'],
        direction: 'down',
        pet: [[0, 2]],
        petExpr: 'focus',
        deco: {
          '4,2': {
            type: 'gate'
          }
        }
      },
      action: {
        icon: 'rotate',
        label: 'Mở lối'
      },
      after: {
        rows: ['.....', '.Y.B.', 'YMMB.', '.BYM.', '..p..'],
        direction: 'down',
        pet: [[4, 2]],
        petExpr: 'happy'
      },
      caption: 'Điều trọng lực đưa bé jelly tới cửa ra an toàn.'
    },
    e2: {
      group: grav.E,
      name: 'Đào mục tiêu',
      subtitle: 'Bóc từng lớp để chạm ô đích bị chôn sâu',
      before: {
        rows: ['.....', '.YYY.', '.MMM.', '.PtP.', '.....'].map(r => r.replace('t', '.')),
        direction: 'down',
        deco: {
          '3,2': {
            type: 'target'
          }
        }
      },
      action: {
        icon: 'star',
        label: 'Bóc từng lớp'
      },
      after: {
        rows: ['.....', '.....', '.....', '..t..', '.....'].map(r => r.replace('t', '.')),
        direction: 'down',
        deco: {
          '3,2': {
            type: 'target'
          }
        }
      },
      caption: 'Bóc từng lớp để chạm ô đích bị chôn sâu.'
    },
    e3: {
      group: grav.E,
      name: 'Cấm xoay',
      subtitle: 'Thử thách ngược: ghi điểm mà không được xoay',
      kind: 'goalNoRotate',
      title: 'Đạt 500 điểm',
      counter: 'KHÔNG dùng xoay',
      caption: 'Thử thách ngược: ghi điểm mà không được xoay.'
    },
    e4: {
      group: grav.E,
      name: 'Mục tiêu màu',
      subtitle: 'Chỉ tính số ô đúng màu yêu cầu được xóa',
      kind: 'goalColor',
      title: 'Xóa 12 ô MINT',
      counter: '5 / 12',
      frac: 5 / 12,
      caption: 'Chỉ tính số ô đúng màu yêu cầu được xóa.'
    },
    e5: {
      group: grav.E,
      name: 'Dọn tuyệt đối',
      subtitle: 'Dọn bàn về đúng 0 ô — thưởng cực lớn',
      before: {
        rows: ['.....', '.....', '.....', '..M..', '.YB.P'],
        direction: 'down',
        glow: [[3, 2], [4, 1], [4, 2], [4, 4]]
      },
      action: {
        icon: 'star',
        label: 'PERFECT! ×bonus',
        tone: 'success'
      },
      after: {
        rows: ['.....', '.....', '.....', '.....', '.....'],
        direction: 'down',
        deco: {
          '2,2': {
            type: 'target'
          }
        }
      },
      caption: 'Dọn bàn về đúng 0 ô — thưởng cực lớn.'
    },
    /* ===================== F · BOSS ===================== */
    f1: {
      group: grav.F,
      name: 'Boss hút trọng lực',
      subtitle: 'Boss giành quyền trọng lực, kéo cả bàn về phía nó',
      kind: 'bossBoard',
      boss: {
        mood: 'angry',
        hp: 1,
        world: 8,
        crownStrip: true
      },
      before: {
        rows: ['.....', '.....', '.YMP.', 'BYMPB', 'BYMPB'],
        direction: 'down'
      },
      action: {
        icon: 'rays',
        label: 'Boss hút',
        tone: 'gravity'
      },
      after: {
        rows: ['BYMPB', 'BYMPB', '.YMP.', '.....', '.....'],
        direction: 'up'
      },
      caption: 'Boss giành quyền trọng lực, kéo cả bàn về phía nó.'
    },
    f2: {
      group: grav.F,
      name: 'Boss đóng băng',
      subtitle: 'Boss đóng băng một vùng bàn vài lượt',
      kind: 'bossBoard',
      boss: {
        mood: 'normal',
        hp: 1
      },
      before: {
        rows: ['.....', '.YMP.', '.BYM.', '.....', '.....'],
        direction: 'down'
      },
      action: {
        icon: 'snow',
        label: 'Đóng băng · 3 lượt',
        tone: 'info'
      },
      after: {
        rows: ['.....', '.MMM.', '.MMM.', '.MMM.', '.....'],
        direction: 'down',
        deco: {
          '1,1': {
            type: 'ice'
          },
          '1,2': {
            type: 'ice'
          },
          '1,3': {
            type: 'ice'
          },
          '2,1': {
            type: 'ice'
          },
          '2,2': {
            type: 'ice'
          },
          '2,3': {
            type: 'ice'
          },
          '3,1': {
            type: 'ice'
          },
          '3,2': {
            type: 'ice'
          },
          '3,3': {
            type: 'ice'
          }
        }
      },
      caption: 'Boss đóng băng một vùng bàn vài lượt.'
    },
    f3: {
      group: grav.F,
      name: 'Boss khoá màu',
      subtitle: 'Boss khoá một màu — chặn nguồn sát thương của bạn',
      kind: 'bossLockColor',
      title: 'Cấm tạo Thạch Hoàng Gia MINT',
      counter: 'Còn 2 lượt',
      caption: 'Boss khoá một màu — chặn nguồn sát thương của bạn.'
    },
    f4: {
      group: grav.F,
      name: 'Điểm yếu boss',
      subtitle: 'Phải nổ Thạch Hoàng Gia trúng điểm yếu mới gây sát thương lớn',
      kind: 'bossBoard',
      boss: {
        mood: 'angry',
        hp: 0.35
      },
      before: {
        rows: ['.....', '..B..', '.....', '..o..', '.....'],
        direction: 'down',
        superAt: [3, 2, 'mint'],
        deco: {
          '1,2': {
            type: 'weak'
          }
        },
        glow: [[1, 2]]
      },
      action: {
        icon: 'bomb',
        label: 'Nổ trúng điểm yếu',
        tone: 'danger'
      },
      after: {
        rows: ['.....', '.....', '.....', '.....', '.....'],
        direction: 'down',
        deco: {
          '1,2': {
            type: 'target'
          }
        }
      },
      caption: 'Phải nổ Thạch Hoàng Gia trúng điểm yếu mới gây sát thương lớn.'
    },
    f5: {
      group: grav.F,
      name: 'Boss đổi pha',
      subtitle: 'Mất nửa máu, boss đổi bộ đòn sang pha 2',
      kind: 'bossPhases',
      caption: 'Mất nửa máu, boss đổi bộ đòn sang pha 2.'
    },
    f6: {
      group: grav.F,
      name: 'Boss phản công',
      subtitle: 'Boss dội đá vào đúng cột bạn vừa dọn — cẩn thận ức chế',
      kind: 'bossBoard',
      boss: {
        mood: 'angry',
        hp: 0.6
      },
      before: {
        rows: ['Y.MPB', 'Y.MPB', 'Y.MPB', 'Y.MPB', 'Y.MPB'],
        direction: 'down'
      },
      action: {
        icon: 'arrow',
        label: 'Boss nhắm cột',
        tone: 'danger'
      },
      after: {
        rows: ['YSMPB', 'YSMPB', 'YSMPB', 'YSMPB', 'YSMPB'],
        direction: 'down',
        glow: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]]
      },
      caption: 'Boss dội đá vào đúng cột bạn vừa dọn — cẩn thận ức chế.'
    },
    /* ===================== G · META ===================== */
    g1: {
      group: grav.G,
      name: 'Buff trọng lực',
      subtitle: 'Đầu chặng, chọn 1 buff — đều xoay quanh trọng lực',
      kind: 'buffChoice',
      buffs: [{
        icon: 'rotate',
        name: '+1 lượt xoay',
        desc: 'mỗi màn'
      }, {
        icon: 'star',
        name: 'Thạch Hoàng Gia ngưỡng 6',
        desc: 'gom 6 đã merge'
      }, {
        icon: 'bomb',
        name: 'Nổ to hơn',
        desc: '+1 ô bán kính'
      }],
      caption: 'Đầu chặng, chọn 1 buff — đều xoay quanh trọng lực.'
    },
    g2: {
      group: grav.G,
      name: 'Power-up',
      subtitle: 'Power-up tiêu thụ, nạp thêm bằng xem quảng cáo thưởng',
      kind: 'powerupBar',
      items: [{
        icon: 'hammer',
        name: 'Búa (phá 1 ô)',
        count: 2
      }, {
        icon: 'row',
        name: 'Xóa hàng',
        count: 1
      }, {
        icon: 'swap',
        name: 'Đổi màu',
        count: 3
      }, {
        icon: 'rotate',
        name: '+1 Xoay',
        count: 1
      }],
      caption: 'Power-up tiêu thụ, nạp thêm bằng xem quảng cáo thưởng.'
    },
    g3: {
      group: grav.G,
      name: 'Thử thách hôm nay',
      subtitle: 'Một bàn mỗi ngày, cùng seed — so tài offline',
      kind: 'dailyCard',
      date: 'Hôm nay · 27/06',
      board: ['Y.MP.', '.YMPB', 'YYM.B', '.PMBB', 'P.MYB'],
      ranks: [{
        name: 'Bạn',
        score: '18.420'
      }, {
        name: 'An',
        score: '16.900'
      }, {
        name: 'Bình',
        score: '15.110'
      }],
      caption: 'Một bàn mỗi ngày, cùng seed — so tài offline.'
    },
    g4: {
      group: grav.G,
      name: 'Streak ngày',
      subtitle: 'Chuỗi ngày chơi liên tục — giữ lửa quay lại',
      kind: 'streakWidget',
      days: [{
        done: true
      }, {
        done: true
      }, {
        done: true
      }, {
        today: true
      }, {}, {}, {}],
      caption: 'Chuỗi ngày chơi liên tục — giữ lửa quay lại.'
    }
  };
  window.GJ_MECH_CARDS = C;
  window.GJ_MECH_ORDER = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'b0', 'b0b', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'cpool', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'e1', 'e2', 'e3', 'e4', 'e5', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'g1', 'g2', 'g3', 'g4'];
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "07-mechanics/mechanics-cards.js", error: String((e && e.message) || e) }); }

// 07-mechanics/mechanics-kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* mechanics-kit.jsx — engine for the "THẺ CƠ CHẾ" (mechanic illustration cards).
   A documentation helper (no .d.ts → stays out of the bundle).

   A card HTML loads: _ds_bundle.js → screen-extras.jsx → mechanics-kit.jsx →
   mechanics-widgets.jsx → mechanics-cards.js, then calls
   GJMech.renderById('<id>', rootEl).

   Board cards are declared in the registry (mechanics-cards.js) and rendered
   here; widget cards delegate to window.GJMechW[kind]. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    JellyBlock,
    Icon,
    Eyes
  } = NS;
  const X = window.GJExtras || {};
  const CODE = {
    Y: 'yellow',
    M: 'mint',
    P: 'pink',
    B: 'blue',
    S: 'stone'
  };
  const key = (r, c) => r + ',' + c;

  /* ---- one-time shared CSS ---- */
  if (!document.getElementById('gj-mech-css')) {
    const s = document.createElement('style');
    s.id = 'gj-mech-css';
    s.textContent = `
      @keyframes gjGlow { 0%,100%{ box-shadow:0 0 0 0 rgba(255,202,102,0), var(--shadow-sm); transform:scale(1);} 50%{ box-shadow:0 0 0 4px rgba(255,202,102,.85), 0 0 14px 2px rgba(255,202,102,.55); transform:scale(1.05);} }
      @keyframes gjSuper { 0%,100%{ box-shadow:0 0 14px 3px rgba(255,236,179,.55), var(--shadow-md); transform:scale(1.08);} 50%{ box-shadow:0 0 24px 7px rgba(255,236,179,.8), var(--shadow-md); transform:scale(1.16);} }
      @keyframes gjGate { 0%,100%{ box-shadow:inset 0 0 0 2px var(--color-gravity), 0 0 0 0 rgba(126,108,240,0);} 50%{ box-shadow:inset 0 0 0 2px var(--color-gravity), 0 0 12px 2px rgba(126,108,240,.6);} }
      @keyframes gjBob { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-3px);} }
      @keyframes gjArrow { 0%,100%{ transform:translateY(0); opacity:.65;} 50%{ transform:translateY(4px); opacity:1;} }
      @keyframes gjFloat { 0%,100%{ transform:translateY(0) rotate(-2deg);} 50%{ transform:translateY(-4px) rotate(2deg);} }
      @keyframes gjSpin { to { transform:rotate(360deg);} }
      @keyframes gjPulse { 0%,100%{ transform:scale(1); opacity:.9;} 50%{ transform:scale(1.12); opacity:1;} }
      @keyframes gjBurst { 0%{ transform:scale(.3); opacity:0;} 40%{ opacity:1;} 100%{ transform:scale(1.5); opacity:0;} }
      @keyframes gjTwinkle { 0%,100%{ transform:translate(-50%,-50%) scale(.35) rotate(0deg); opacity:0;} 50%{ transform:translate(-50%,-50%) scale(1) rotate(45deg); opacity:1;} }
      .gj-glow  { animation: gjGlow 1.6s var(--ease-inout,ease) infinite; border-radius: var(--radius-md); }
      .gj-arrow { animation: gjArrow 1.4s var(--ease-inout,ease) infinite; }
      .gj-float { animation: gjFloat 2.2s var(--ease-inout,ease) infinite; }
      @media (prefers-reduced-motion: reduce){ [class^="gj-"]{ animation:none !important; } }
    `;
    document.head.appendChild(s);
  }

  /* ============== small inline glyphs the base set lacks ============== */
  const gstyle = (sw, color) => ({
    fill: 'none',
    stroke: color,
    strokeWidth: sw || 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  });
  const Glyph = {
    magnet: (s, c) => /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, gstyle(2, c)), /*#__PURE__*/React.createElement("path", {
      d: "M6 4v7a6 6 0 0 0 12 0V4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 4H3v3M18 4h3v3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 11H3M18 11h3"
    })),
    arrow: (s, c) => /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, gstyle(2.4, c)), /*#__PURE__*/React.createElement("path", {
      d: "M5 12h12M12 7l5 5-5 5"
    })),
    hidden: (s, c) => /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, gstyle(2.4, c)), /*#__PURE__*/React.createElement("path", {
      d: "M9 9a3 3 0 1 1 4 2.8c-.8.4-1 .9-1 1.7"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "17.5",
      r: "0.4",
      fill: c,
      stroke: c
    })),
    heavy: (s, c) => /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, gstyle(2.2, c)), /*#__PURE__*/React.createElement("path", {
      d: "M7 5l5 5 5-5M7 12l5 5 5-5"
    })),
    norotate: (s, c) => /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, gstyle(2, c)), /*#__PURE__*/React.createElement("path", {
      d: "M4.5 12a7.5 7.5 0 1 1 2.2 5.3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6.7 13.5l-1.2 4M5 17.5l4.2-.8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 5l14 14",
      stroke: c,
      strokeWidth: "2.4"
    })),
    dye: (s, c) => /*#__PURE__*/React.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3.5c3.6 4.4 5.5 7.2 5.5 10a5.5 5.5 0 1 1-11 0c0-2.8 1.9-5.6 5.5-10z",
      fill: c,
      stroke: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 14a3 3 0 0 0 1.5 2.5",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      opacity: ".7"
    })),
    seed: (s, c) => /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, gstyle(2, c)), /*#__PURE__*/React.createElement("path", {
      d: "M12 21v-7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 14c0-3 2.5-4.5 5-4.5C17 12.5 15 14 12 14z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 16c0-2.5-2-4-4.2-4C7.8 14.5 9.5 16 12 16z"
    })),
    sticky: (s, c) => /*#__PURE__*/React.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 5h16v7c0 1-1 1.6-2 2.2-1.3.8-1.3 2.3-2.6 3-1 .6-2 .6-3 0-1.3-.7-1.3-2.2-2.6-3C6 13.6 5 13 5 12z",
      fill: c,
      stroke: "none",
      opacity: ".85"
    })),
    spike: (s, c) => /*#__PURE__*/React.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 19l3-7 3 7 3-7 3 7 3-7 3 7z",
      fill: c,
      stroke: "none"
    })),
    portal: (s, c) => /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, gstyle(2, c)), /*#__PURE__*/React.createElement("ellipse", {
      cx: "12",
      cy: "12",
      rx: "5",
      ry: "8"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "12",
      cy: "12",
      rx: "2",
      ry: "4.5"
    })),
    snow: (s, c) => /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, gstyle(1.8, c)), /*#__PURE__*/React.createElement("path", {
      d: "M12 3v18M4 7l16 10M20 7L4 17"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2"
    })),
    chainlink: (s, c) => /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, gstyle(2, c)), /*#__PURE__*/React.createElement("rect", {
      x: "3.5",
      y: "9",
      width: "8",
      height: "6",
      rx: "3"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "12.5",
      y: "9",
      width: "8",
      height: "6",
      rx: "3"
    })),
    slide: (s, c) => /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, gstyle(2, c)), /*#__PURE__*/React.createElement("path", {
      d: "M4 8h13M4 12h10M4 16h7"
    })),
    rays: (s, c) => /*#__PURE__*/React.createElement("svg", _extends({
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, gstyle(2, c)), /*#__PURE__*/React.createElement("path", {
      d: "M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"
    }))
  };

  /* ============== board cells ============== */
  function Empty({
    cell
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: cell,
        height: cell,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-cell-empty)',
        boxShadow: 'inset 0 0 0 1px var(--color-cell-line)'
      }
    });
  }

  /* corner badge overlay on a filled cell */
  function Badge({
    glyph,
    num,
    bg,
    fg,
    cell
  }) {
    const sz = Math.round(cell * 0.42);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -4,
        right: -4,
        minWidth: sz,
        height: sz,
        padding: num != null ? '0 3px' : 0,
        borderRadius: 999,
        background: bg,
        color: fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        boxShadow: 'var(--shadow-sm)',
        zIndex: 5
      }
    }, glyph, num != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: Math.round(cell * 0.3),
        lineHeight: 1
      }
    }, num));
  }

  /* full-cell special tiles for empty positions */
  function SpecialEmpty({
    type,
    cell,
    color,
    num
  }) {
    if (type === 'gate') {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          width: cell,
          height: cell,
          borderRadius: 'var(--radius-md)',
          background: 'color-mix(in srgb, var(--color-gravity) 12%, var(--color-cell-empty))',
          animation: 'gjGate 1.5s var(--ease-inout,ease) infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-gravity)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          transform: 'rotate(90deg)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "chevron",
        size: Math.round(cell * 0.5),
        strokeWidth: 2.6
      })));
    }
    if (type === 'portal') {
      const cc = color || 'var(--color-gravity)';
      return /*#__PURE__*/React.createElement("div", {
        style: {
          width: cell,
          height: cell,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${cc} 0%, transparent 72%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          animation: 'gjSpin 3s linear infinite',
          display: 'flex',
          color: cc
        }
      }, Glyph.portal(Math.round(cell * 0.66), cc)));
    }
    if (type === 'spike') {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          width: cell,
          height: cell,
          borderRadius: 'var(--radius-md)',
          background: 'color-mix(in srgb, var(--color-danger) 16%, var(--color-cell-empty))',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          color: 'var(--color-danger)'
        }
      }, Glyph.spike(Math.round(cell * 0.8), 'var(--color-danger)'));
    }
    if (type === 'target') {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          width: cell,
          height: cell,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-cell-empty)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'gjPulse 1.6s ease infinite'
        }
      }, X.Target ? /*#__PURE__*/React.createElement(X.Target, {
        size: Math.round(cell * 0.7),
        color: "var(--color-gravity)"
      }) : null);
    }
    return /*#__PURE__*/React.createElement(Empty, {
      cell: cell
    });
  }

  /* rescue pet */
  function Pet({
    cell,
    color = 'pink',
    direction = 'down',
    expression = 'focus'
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: cell,
        height: cell,
        position: 'relative',
        animation: 'gjBob 1.8s var(--ease-inout,ease) infinite',
        zIndex: 3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: -3,
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 0 0 3px var(--color-primary-shine), 0 0 14px 2px rgba(255,159,104,.5)',
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement(JellyBlock, {
      color: color,
      size: cell,
      direction: direction,
      expression: expression
    }));
  }

  /* merged super-block — a charged, "powered-up" cell, not a plain happy block */
  function Spark({
    x,
    y,
    s,
    d
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: x,
        top: y,
        width: s,
        height: s,
        animation: `gjTwinkle 1.5s var(--ease-inout,ease) ${d}s infinite`,
        zIndex: 6,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 0c1.2 7 4.8 10.8 12 12-7.2 1.2-10.8 5-12 12-1.2-7-4.8-10.8-12-12 7.2-1.2 10.8-5 12-12z",
      fill: "#FFF6DC"
    })));
  }
  function SuperCell({
    cell,
    color = 'mint',
    mega = false
  }) {
    const flavor = ['yellow', 'mint', 'pink', 'blue'].includes(color) ? color : 'mint';
    const src = `../06-svg-assets/blocks/super-${flavor}-${mega ? 2 : 1}.svg`;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: cell,
        height: cell,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        animation: 'gjSuper 1.5s var(--ease-jelly,ease) infinite',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        filter: mega ? 'drop-shadow(0 0 11px rgba(255,202,102,.9))' : 'drop-shadow(0 0 7px rgba(255,236,179,.7))'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: src,
      width: cell,
      height: cell,
      alt: mega ? 'super block level 2' : 'super block level 1',
      style: {
        display: 'block'
      }
    })), /*#__PURE__*/React.createElement(Spark, {
      x: Math.round(cell * 0.02),
      y: Math.round(cell * 0.2),
      s: Math.round(cell * 0.3),
      d: 0
    }), /*#__PURE__*/React.createElement(Spark, {
      x: Math.round(cell * 0.86),
      y: Math.round(cell * 0.74),
      s: Math.round(cell * 0.24),
      d: 0.5
    }), mega && /*#__PURE__*/React.createElement(Spark, {
      x: Math.round(cell * 0.88),
      y: Math.round(cell * 0.1),
      s: Math.round(cell * 0.22),
      d: 0.9
    }));
  }

  /* rainbow / wild block — the merged wildcard jelly */
  function Rainbow({
    cell
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: cell,
        height: cell,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../06-svg-assets/blocks/rainbow.svg",
      width: cell,
      height: cell,
      alt: "rainbow block",
      style: {
        display: 'block',
        filter: 'drop-shadow(0 1px 2px rgba(120,92,52,.18))'
      }
    }));
  }
  function pos(r, c, cell, gap, pad) {
    return {
      x: pad + c * (cell + gap),
      y: pad + r * (cell + gap)
    };
  }

  /* the board snippet */
  function MiniBoard({
    rows,
    direction = 'down',
    cell = 40,
    gap = 4,
    pad = 8,
    glow = [],
    gate = [],
    pet = [],
    superAt = null,
    supers = [],
    mega = false,
    rainbow = [],
    petColor = 'pink',
    petExpr = 'focus',
    deco = {},
    chains = [],
    divider = null
  }) {
    const grid = rows.map(s => s.split(''));
    const cols = grid[0].length,
      N = grid.length;
    const glowSet = new Set(glow.map(([r, c]) => key(r, c)));
    const gateSet = new Set(gate.map(([r, c]) => key(r, c)));
    const petSet = new Set(pet.map(([r, c]) => key(r, c)));
    const rainSet = new Set(rainbow.map(([r, c]) => key(r, c)));
    const superMap = {};
    supers.forEach(([r, c, col]) => {
      superMap[key(r, c)] = col || 'mint';
    });
    const W = pad * 2 + cols * cell + (cols - 1) * gap;
    const H = pad * 2 + N * cell + (N - 1) * gap;
    const decoBadge = (d, cl) => {
      const map = {
        lock: [X.Lock && /*#__PURE__*/React.createElement(X.Lock, {
          size: Math.round(cl * 0.36),
          color: "#fff"
        }), 'var(--color-info)', '#fff'],
        clock: [X.Clock && /*#__PURE__*/React.createElement(X.Clock, {
          size: Math.round(cl * 0.34),
          color: "#fff"
        }), 'var(--color-warning)', '#5B4636'],
        bomb: [X.Bomb && /*#__PURE__*/React.createElement(X.Bomb, {
          size: Math.round(cl * 0.36),
          color: "#fff"
        }), 'var(--color-danger)', '#fff'],
        magnet: [Glyph.magnet(Math.round(cl * 0.4), '#fff'), 'var(--color-danger)', '#fff'],
        arrow: [Glyph.arrow(Math.round(cl * 0.44), '#fff'), 'var(--color-gravity)', '#fff'],
        hidden: [Glyph.hidden(Math.round(cl * 0.4), '#fff'), 'var(--color-text-muted)', '#fff'],
        heavy: [Glyph.heavy(Math.round(cl * 0.42), '#fff'), 'var(--color-text)', '#fff'],
        norotate: [Glyph.norotate(Math.round(cl * 0.42), '#fff'), 'var(--color-text-muted)', '#fff'],
        seed: [Glyph.seed(Math.round(cl * 0.42), '#fff'), 'var(--color-success)', '#fff'],
        slide: [Glyph.slide(Math.round(cl * 0.42), '#fff'), 'var(--color-info)', '#fff'],
        expand: [X.Plus && /*#__PURE__*/React.createElement(X.Plus, {
          size: Math.round(cl * 0.4),
          color: "#fff"
        }), 'var(--color-stone-edge)', '#fff'],
        weak: [Glyph.rays(Math.round(cl * 0.44), '#fff'), 'var(--color-danger)', '#fff']
      };
      const m = map[d.type];
      if (!m) return null;
      return /*#__PURE__*/React.createElement(Badge, {
        glyph: m[0],
        num: d.num,
        bg: m[1],
        fg: m[2],
        cell: cl
      });
    };
    const cellNode = (r, c) => {
      const k = key(r, c);
      const d = deco[k];
      if (superMap[k]) return /*#__PURE__*/React.createElement(SuperCell, {
        cell: cell,
        color: superMap[k],
        mega: mega
      });
      if (superAt && superAt[0] === r && superAt[1] === c) return /*#__PURE__*/React.createElement(SuperCell, {
        cell: cell,
        color: superAt[2] || 'mint',
        mega: mega
      });
      if (rainSet.has(k)) return /*#__PURE__*/React.createElement(Rainbow, {
        cell: cell
      });
      if (petSet.has(k)) return /*#__PURE__*/React.createElement(Pet, {
        cell: cell,
        color: petColor,
        direction: direction,
        expression: petExpr
      });
      const ch = grid[r][c];
      if (ch === '.') {
        if (d && ['gate', 'portal', 'spike', 'target'].includes(d.type)) return /*#__PURE__*/React.createElement(SpecialEmpty, {
          type: d.type,
          cell: cell,
          color: d.color,
          num: d.num
        });
        return /*#__PURE__*/React.createElement(Empty, {
          cell: cell
        });
      }
      // filled
      const isStone = ch === 'S';
      const floating = d && d.type === 'float';
      const iced = d && d.type === 'ice';
      const dimmed = d && d.type === 'dim';
      return /*#__PURE__*/React.createElement("div", {
        className: (glowSet.has(k) ? 'gj-glow ' : '') + (floating ? 'gj-float' : ''),
        style: {
          width: cell,
          height: cell,
          position: 'relative',
          opacity: dimmed ? 0.4 : 1
        }
      }, /*#__PURE__*/React.createElement(JellyBlock, {
        color: isStone ? 'stone' : CODE[ch],
        size: cell,
        direction: direction,
        showEyes: !isStone
      }), floating && /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: -3,
          borderRadius: 'var(--radius-md)',
          border: '2px dashed var(--color-gravity)',
          animation: 'gjPulse 1.5s ease infinite'
        }
      }), iced && /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--radius-md)',
          background: 'rgba(143,182,242,.5)',
          boxShadow: 'inset 0 0 0 2px rgba(214,225,251,.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, Glyph.snow(Math.round(cell * 0.6), '#fff')), d && d.type === 'dye' && /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          bottom: 1,
          right: 1
        }
      }, Glyph.dye(Math.round(cell * 0.5), 'var(--color-block-pink-edge)')), d && d.type === 'sticky' && /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, Glyph.sticky(Math.round(cell * 0.7), 'var(--color-warning)')), d && !['float', 'ice', 'dye', 'sticky', 'dim'].includes(d.type) && decoBadge(d, cell));
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridAutoRows: `${cell}px`,
        gap,
        padding: pad,
        background: 'var(--color-surface-sunken)',
        borderRadius: 16,
        boxShadow: 'inset 0 2px 6px rgba(120,92,52,.12)'
      }
    }, grid.map((row, r) => row.map((_, c) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: key(r, c)
    }, cellNode(r, c))))), chains.map((pair, i) => {
      const a = pos(pair[0][0], pair[0][1], cell, gap, pad),
        b = pos(pair[1][0], pair[1][1], cell, gap, pad);
      const ax = a.x + cell / 2,
        ay = a.y + cell / 2,
        bx = b.x + cell / 2,
        by = b.y + cell / 2;
      const len = Math.hypot(bx - ax, by - ay),
        ang = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
      return /*#__PURE__*/React.createElement("div", {
        key: 'ch' + i,
        style: {
          position: 'absolute',
          left: ax,
          top: ay - 5,
          width: len,
          height: 10,
          transformOrigin: '0 50%',
          transform: `rotate(${ang}deg)`,
          background: 'repeating-linear-gradient(90deg, var(--color-warning) 0 7px, transparent 7px 12px)',
          borderRadius: 6,
          zIndex: 6,
          opacity: .9
        }
      });
    }), divider != null && (() => {
      const y = pad + (divider.after + 1) * cell + divider.after * gap + gap / 2;
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: pad,
          right: pad,
          top: y - 2,
          height: 4,
          background: 'var(--color-gravity)',
          borderRadius: 2,
          zIndex: 6,
          boxShadow: '0 0 8px rgba(126,108,240,.5)'
        }
      });
    })());
  }

  /* ============== card chrome ============== */
  function Chip({
    group,
    name
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-sm)',
        padding: '8px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
        whiteSpace: 'nowrap'
      }
    }, group), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 20,
        lineHeight: 1.05,
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, name));
  }
  function Panel({
    label,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        width: '100%'
      }
    }, label && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
        alignSelf: 'flex-start'
      }
    }, label), children);
  }
  function GravityChip({
    icon = 'rotate',
    label,
    tone = 'gravity'
  }) {
    const bg = tone === 'warning' ? 'var(--color-warning)' : tone === 'danger' ? 'var(--color-danger)' : tone === 'success' ? 'var(--color-success)' : 'var(--color-gravity)';
    const edge = tone === 'warning' ? '#E2A82E' : tone === 'danger' ? '#D96A5E' : tone === 'success' ? '#4FB45F' : 'var(--color-gravity-edge)';
    const fg = tone === 'warning' ? 'var(--color-text)' : 'var(--color-text-invert)';
    const customGlyphs = {
      magnet: Glyph.magnet,
      arrow: Glyph.arrow,
      heavy: Glyph.heavy,
      rays: Glyph.rays,
      snow: Glyph.snow,
      portal: Glyph.portal
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: bg,
        color: fg,
        borderBottom: `3px solid ${edge}`,
        borderRadius: 'var(--radius-pill)',
        padding: '8px 16px',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 14,
        boxShadow: 'var(--shadow-sm)',
        whiteSpace: 'nowrap'
      }
    }, customGlyphs[icon] ? customGlyphs[icon](18, fg) : icon === 'bomb' && X.Bomb ? /*#__PURE__*/React.createElement(X.Bomb, {
      size: 18,
      color: fg
    }) : icon === 'clock' && X.Clock ? /*#__PURE__*/React.createElement(X.Clock, {
      size: 18,
      color: fg
    }) : icon === 'lock' && X.Lock ? /*#__PURE__*/React.createElement(X.Lock, {
      size: 18,
      color: fg
    }) : icon ? /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18,
      strokeWidth: 2.6
    }) : null, label);
  }
  function ActionNode({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "gj-arrow",
      style: {
        color: 'var(--color-gravity)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        transform: 'rotate(90deg)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 22,
      strokeWidth: 2.8
    }))), children);
  }
  function CardShell({
    group,
    name,
    caption,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 360,
        minHeight: 760,
        boxSizing: 'border-box',
        background: 'radial-gradient(120% 80% at 50% 0%, #FFFCF5 0%, var(--color-bg) 60%)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text)'
      }
    }, /*#__PURE__*/React.createElement(Chip, {
      group: group,
      name: name
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        width: '100%'
      }
    }, children), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '4px 0 0',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.4,
        textAlign: 'center',
        textWrap: 'pretty',
        color: 'var(--color-text)',
        maxWidth: 300
      }
    }, caption));
  }

  /* action descriptor → node */
  function renderAction(a) {
    if (!a) return null;
    if (React.isValidElement(a)) return a;
    if (a.kind === 'star') return /*#__PURE__*/React.createElement(GravityChip, {
      icon: "star",
      label: a.label,
      tone: a.tone
    });
    return /*#__PURE__*/React.createElement(GravityChip, {
      icon: a.icon === undefined ? 'rotate' : a.icon,
      label: a.label,
      tone: a.tone
    });
  }
  function BoardBody({
    before,
    after,
    beforeLabel = 'TRƯỚC',
    afterLabel = 'SAU',
    action
  }) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Panel, {
      label: beforeLabel
    }, /*#__PURE__*/React.createElement(MiniBoard, before)), /*#__PURE__*/React.createElement(ActionNode, null, renderAction(action)), /*#__PURE__*/React.createElement(Panel, {
      label: afterLabel
    }, /*#__PURE__*/React.createElement(MiniBoard, after)));
  }

  /* legacy convenience used by hand-written cards */
  function MechanicCard({
    group,
    name,
    before,
    after,
    action,
    caption,
    beforeLabel,
    afterLabel
  }) {
    return /*#__PURE__*/React.createElement(CardShell, {
      group: group,
      name: name,
      caption: caption
    }, /*#__PURE__*/React.createElement(Panel, {
      label: beforeLabel || 'TRƯỚC'
    }, before), /*#__PURE__*/React.createElement(ActionNode, null, action), /*#__PURE__*/React.createElement(Panel, {
      label: afterLabel || 'SAU'
    }, after));
  }
  function renderById(id, rootEl) {
    const card = (window.GJ_MECH_CARDS || {})[id];
    if (!card) {
      rootEl.innerHTML = '<p style="font-family:sans-serif;padding:20px">Unknown card: ' + id + '</p>';
      return;
    }
    let body;
    if (card.kind === 'board' || !card.kind) {
      body = /*#__PURE__*/React.createElement(BoardBody, {
        before: card.before,
        after: card.after,
        action: card.action,
        beforeLabel: card.beforeLabel,
        afterLabel: card.afterLabel
      });
    } else {
      const W = window.GJMechW || {};
      const fn = W[card.kind];
      body = fn ? fn(card, {
        MiniBoard,
        GravityChip,
        Panel,
        ActionNode,
        Glyph,
        X
      }) : /*#__PURE__*/React.createElement("p", null, "Missing widget: ", card.kind);
    }
    ReactDOM.createRoot(rootEl).render(/*#__PURE__*/React.createElement(CardShell, {
      group: card.group,
      name: card.name,
      caption: card.caption
    }, body));
  }
  window.GJMech = {
    MechanicCard,
    MiniBoard,
    GravityChip,
    ActionNode,
    CardShell,
    Panel,
    Glyph,
    Rainbow,
    SuperCell,
    Pet,
    renderById,
    renderAction,
    BoardBody
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "07-mechanics/mechanics-kit.jsx", error: String((e && e.message) || e) }); }

// 07-mechanics/mechanics-widgets.jsx
try { (() => {
/* mechanics-widgets.jsx — bespoke widget bodies for non-board mechanic cards.
   Each entry: (card, helpers) => ReactNode  (the card body; CardShell adds the
   title chip + caption). Registered on window.GJMechW. Loaded after the kit. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    JellyBlock,
    TrayPiece,
    GravityRotateButton,
    Icon,
    Eyes
  } = NS;
  const X = window.GJExtras || {};
  const CODE = {
    Y: 'yellow',
    M: 'mint',
    P: 'pink',
    B: 'blue',
    S: 'stone'
  };

  /* tiny free-standing jelly piece (no board well) */
  function Piece({
    rows,
    cell = 26,
    gap = 3
  }) {
    const grid = rows.map(s => s.split(''));
    const cols = grid[0].length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridAutoRows: `${cell}px`,
        gap
      }
    }, grid.map((row, r) => row.map((ch, c) => ch === '.' ? /*#__PURE__*/React.createElement("div", {
      key: r + '-' + c,
      style: {
        width: cell,
        height: cell
      }
    }) : /*#__PURE__*/React.createElement(JellyBlock, {
      key: r + '-' + c,
      color: CODE[ch],
      size: cell,
      direction: "down",
      showEyes: cell >= 22
    }))));
  }

  /* rainbow piece for trays */
  function RainbowPiece({
    cell = 26
  }) {
    const r = Math.round(cell * 0.28);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: cell,
        height: cell,
        borderRadius: r,
        border: '3px solid #C9A6E8',
        background: 'conic-gradient(from 210deg, var(--color-block-yellow), var(--color-block-mint), var(--color-block-blue), var(--color-block-pink), var(--color-block-yellow))',
        boxShadow: 'var(--shadow-sm)'
      }
    });
  }

  /* a tray dock shell */
  function Dock({
    children,
    style = {}
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        padding: '16px 18px',
        ...style
      }
    }, children);
  }
  function Slot({
    children,
    dashed,
    w = 78,
    h = 78,
    label
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        height: h,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-surface-sunken)',
        boxShadow: dashed ? 'none' : 'inset 0 2px 5px rgba(120,92,52,.12)',
        border: dashed ? '2px dashed var(--color-cell-line)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, children), label && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)'
      }
    }, label));
  }

  /* small labelled state pill used between/within widgets */
  function StateLabel({
    children
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
        alignSelf: 'flex-start'
      }
    }, children);
  }
  function DownArrow() {
    return /*#__PURE__*/React.createElement("div", {
      className: "gj-arrow",
      style: {
        color: 'var(--color-gravity)',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        transform: 'rotate(90deg)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 22,
      strokeWidth: 2.8
    })));
  }

  /* ===== Boss face ===== =================================================
     Boss = jelly block (giữ nhận diện) nhưng dữ dằn: mắt híp gằn, KHÔNG miệng,
     vương miện đổi theo map, giáp đá quanh cổ, hào quang bóng tối phía sau. */

  /* vương miện theo từng map — chỉ đổi màu đá quý (jewel) theo thế giới 1..10 */
  const MAP_CROWNS = {
    1: '#6FCF7F',
    // Đồng cỏ
    2: '#5FC3B2',
    // Rừng rậm
    3: '#8FB6F2',
    // Sông & Thác
    4: '#FFCA66',
    // Sa mạc
    5: '#5FC3B2',
    // Bãi biển
    6: '#B3C7F7',
    // Núi tuyết
    7: '#A99CF6',
    // Hang băng
    8: '#F08A7E',
    // Núi lửa
    9: '#8FB6F2',
    // Bầu trời
    10: '#A99CF6' // Vũ trụ
  };
  const WORLD_NAMES = {
    1: 'Đồng cỏ',
    2: 'Rừng rậm',
    3: 'Sông & Thác',
    4: 'Sa mạc',
    5: 'Bãi biển',
    6: 'Núi tuyết',
    7: 'Hang băng',
    8: 'Núi lửa',
    9: 'Bầu trời',
    10: 'Vũ trụ'
  };

  /* gold crown — gem màu = jewel (đổi theo map) */
  function CrownTop({
    size,
    jewel
  }) {
    const w = size * 0.66,
      h = size * 0.46;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -h * 0.72,
        left: '50%',
        transform: 'translateX(-50%)',
        width: w,
        height: h,
        zIndex: 4
      }
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 100 70",
      width: w,
      height: h,
      style: {
        display: 'block',
        filter: 'drop-shadow(0 3px 2px rgba(74,53,38,.35))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M11 60 L11 16 L34 38 L50 6 L66 38 L89 16 L89 60 Z",
      fill: "#FFCA66",
      stroke: "#E8B85C",
      strokeWidth: "4",
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "7",
      y: "52",
      width: "86",
      height: "15",
      rx: "6",
      fill: "#FFD27A",
      stroke: "#E8B85C",
      strokeWidth: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15 52 L34 40 L50 14 L66 40 L85 52",
      fill: "none",
      stroke: "#FFF1CE",
      strokeWidth: "2.6",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: "0.75"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "16",
      r: "5.5",
      fill: jewel,
      stroke: "#E8B85C",
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "6",
      r: "6.5",
      fill: jewel,
      stroke: "#E8B85C",
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "89",
      cy: "16",
      r: "5.5",
      fill: jewel,
      stroke: "#E8B85C",
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "59",
      r: "4.6",
      fill: jewel
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "30",
      cy: "59",
      r: "3.4",
      fill: "#FFF1CE"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "70",
      cy: "59",
      r: "3.4",
      fill: "#FFF1CE"
    })));
  }

  /* mắt gằn — tròng trắng híp dưới mí dày, đồng tử phát sáng, lông mày chếch vào */
  function FierceEye({
    flip,
    w,
    body,
    glow
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: w,
        height: w,
        transform: flip ? 'scaleX(-1)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: '#fff',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,.22)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '-52%',
        left: '-26%',
        width: '152%',
        height: '92%',
        background: body,
        transform: 'rotate(19deg)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '30%',
        top: '42%',
        width: w * 0.46,
        height: w * 0.46,
        borderRadius: '50%',
        background: '#1E1340',
        boxShadow: `0 0 ${w * 0.24}px ${glow}, inset 0 0 ${w * 0.1}px ${glow}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '12%',
        left: '16%',
        width: '36%',
        height: '36%',
        borderRadius: '50%',
        background: '#fff',
        opacity: 0.95
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '-22%',
        left: '-4%',
        width: '92%',
        height: w * 0.2,
        background: '#241742',
        borderRadius: 4,
        transform: 'rotate(19deg)',
        transformOrigin: 'right center'
      }
    }));
  }

  /* giáp đá quanh cổ + ngù vai, gem ngực = jewel */
  function BossArmor({
    size,
    jewel
  }) {
    const s = size;
    const pauldron = {
      position: 'absolute',
      bottom: s * 0.16,
      width: s * 0.32,
      height: s * 0.27,
      borderRadius: '52% 52% 44% 44%',
      background: 'linear-gradient(180deg,#DBD0BF,#A89A82)',
      border: '3px solid #8A7E68',
      boxShadow: 'var(--shadow-sm)',
      zIndex: 2
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        ...pauldron,
        left: -s * 0.13
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        ...pauldron,
        right: -s * 0.13
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: -s * 0.05,
        left: '50%',
        transform: 'translateX(-50%)',
        width: s * 0.94,
        height: s * 0.34,
        borderRadius: '38% 38% 50% 50% / 64% 64% 100% 100%',
        background: 'linear-gradient(180deg,#DBD0BF,#C9BCA8 46%,#A89A82)',
        border: '3px solid #8A7E68',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 3,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: s * 0.05,
        width: s * 0.13,
        height: s * 0.13,
        borderRadius: '50%',
        background: jewel,
        border: '2px solid #8A7E68',
        boxShadow: `0 0 ${s * 0.09}px ${jewel}, inset 0 1px 2px rgba(255,255,255,.5)`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: s * 0.05,
        left: s * 0.14,
        width: s * 0.045,
        height: s * 0.045,
        borderRadius: '50%',
        background: '#8A7E68'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: s * 0.05,
        right: s * 0.14,
        width: s * 0.045,
        height: s * 0.045,
        borderRadius: '50%',
        background: '#8A7E68'
      }
    })));
  }
  function BossFace({
    size = 116,
    hp = 1,
    mood = 'angry',
    aura = true,
    color = '#7E6CF0',
    edge = '#6353D6',
    world,
    jewel
  }) {
    const s = size;
    const wrap = s * 1.6;
    const gem = jewel || world && MAP_CROWNS[world] || '#F08A7E';
    const eyeW = s * 0.26;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: s * 0.12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: wrap,
        height: wrap,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, aura && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        width: s * 1.5,
        height: s * 1.5,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(40,24,74,.62), rgba(40,24,74,.18) 52%, transparent 72%)',
        filter: 'blur(3px)',
        animation: 'gjPulse 2.6s ease infinite'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        width: s * 1.22,
        height: s * 1.22,
        borderRadius: '50%',
        boxShadow: `0 0 0 3px rgba(99,83,214,.32), 0 0 ${s * 0.2}px ${s * 0.05}px rgba(126,108,240,.45)`
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: s,
        height: s
      }
    }, /*#__PURE__*/React.createElement(CrownTop, {
      size: s,
      jewel: gem
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        borderRadius: s * 0.3,
        background: `linear-gradient(180deg, ${color}, ${edge})`,
        border: `${Math.max(3, s * 0.035)}px solid ${edge}`,
        boxSizing: 'border-box',
        boxShadow: 'var(--shadow-md), inset 0 -7px 11px rgba(36,23,66,.4)',
        overflow: 'hidden',
        zIndex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: s * 0.06,
        left: '14%',
        right: '14%',
        height: '26%',
        background: 'linear-gradient(180deg, rgba(169,156,246,.85), rgba(169,156,246,0))',
        borderRadius: '50%'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '36%',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: s * 0.12
      }
    }, /*#__PURE__*/React.createElement(FierceEye, {
      flip: false,
      w: eyeW,
      body: edge,
      glow: gem
    }), /*#__PURE__*/React.createElement(FierceEye, {
      flip: true,
      w: eyeW,
      body: edge,
      glow: gem
    }))), /*#__PURE__*/React.createElement(BossArmor, {
      size: s,
      jewel: gem
    }))), hp != null && /*#__PURE__*/React.createElement("div", {
      style: {
        width: s,
        height: 12,
        borderRadius: 999,
        background: 'var(--color-surface-sunken)',
        boxShadow: 'inset 0 1px 3px rgba(120,92,52,.18)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: hp * 100 + '%',
        height: '100%',
        borderRadius: 999,
        background: hp > 0.5 ? 'var(--color-success)' : 'var(--color-danger)',
        transition: 'width .4s'
      }
    })));
  }

  /* ===================== WIDGETS ===================== */
  const W = {};

  /* simple tray: 3 pieces (D3 stone, D4 two-color) */
  W.tray = (card, h) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }
  }, card.note && /*#__PURE__*/React.createElement(StateLabel, null, card.note), /*#__PURE__*/React.createElement(Dock, null, card.pieces.map((p, i) => /*#__PURE__*/React.createElement(Slot, {
    key: i
  }, p.rainbow ? /*#__PURE__*/React.createElement(RainbowPiece, {
    cell: 26
  }) : /*#__PURE__*/React.createElement(Piece, {
    rows: p.rows,
    cell: 24
  })))));

  /* D1 hold: before(3 + empty hold) → after(2 + filled hold) */
  W.trayHold = card => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(StateLabel, null, "TR\u01AF\u1EDAC"), /*#__PURE__*/React.createElement(Dock, null, card.before.map((p, i) => /*#__PURE__*/React.createElement(Slot, {
    key: i
  }, p ? /*#__PURE__*/React.createElement(Piece, {
    rows: p.rows,
    cell: 22
  }) : null)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      alignSelf: 'stretch',
      background: 'var(--color-cell-line)'
    }
  }), /*#__PURE__*/React.createElement(Slot, {
    dashed: true,
    label: "HOLD"
  }, null)), /*#__PURE__*/React.createElement(DownArrow, null), /*#__PURE__*/React.createElement(StateLabel, null, "SAU"), /*#__PURE__*/React.createElement(Dock, null, card.after.map((p, i) => /*#__PURE__*/React.createElement(Slot, {
    key: i
  }, p ? /*#__PURE__*/React.createElement(Piece, {
    rows: p.rows,
    cell: 22
  }) : null)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      alignSelf: 'stretch',
      background: 'var(--color-cell-line)'
    }
  }), /*#__PURE__*/React.createElement(Slot, {
    label: "HOLD"
  }, /*#__PURE__*/React.createElement(Piece, {
    rows: card.held.rows,
    cell: 22
  }))));

  /* D2 preview two waves */
  W.trayPreview = card => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: 0.45,
      transform: 'scale(.82)'
    }
  }, /*#__PURE__*/React.createElement(StateLabel, null, "\u0110\u1EE2T SAU"), /*#__PURE__*/React.createElement(Dock, {
    style: {
      padding: '10px 14px',
      boxShadow: 'var(--shadow-sm)'
    }
  }, card.next.map((p, i) => /*#__PURE__*/React.createElement(Slot, {
    key: i,
    w: 58,
    h: 58
  }, /*#__PURE__*/React.createElement(Piece, {
    rows: p.rows,
    cell: 16
  }))))), /*#__PURE__*/React.createElement(StateLabel, null, "\u0110\u1EE2T HI\u1EC6N T\u1EA0I"), /*#__PURE__*/React.createElement(Dock, null, card.current.map((p, i) => /*#__PURE__*/React.createElement(Slot, {
    key: i
  }, /*#__PURE__*/React.createElement(Piece, {
    rows: p.rows,
    cell: 24
  })))));

  /* D5 single hardcore slot */
  W.traySingle = card => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 13,
      letterSpacing: '.08em',
      color: 'var(--color-danger)',
      background: 'color-mix(in srgb, var(--color-danger) 14%, #fff)',
      padding: '4px 14px',
      borderRadius: 999
    }
  }, "HARDCORE"), /*#__PURE__*/React.createElement(Dock, {
    style: {
      padding: '20px 26px'
    }
  }, /*#__PURE__*/React.createElement(Slot, {
    w: 96,
    h: 96
  }, /*#__PURE__*/React.createElement(Piece, {
    rows: card.piece.rows,
    cell: 26
  }))));

  /* D6 giant piece */
  W.trayGiant = card => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Dock, null, /*#__PURE__*/React.createElement(Slot, {
    w: 64,
    h: 64
  }, /*#__PURE__*/React.createElement(Piece, {
    rows: card.small[0].rows,
    cell: 18
  })), /*#__PURE__*/React.createElement(Slot, {
    w: 132,
    h: 92,
    style: {}
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      animation: 'gjPulse 1.6s ease infinite'
    }
  }, /*#__PURE__*/React.createElement(Piece, {
    rows: card.giant.rows,
    cell: 26
  }))), /*#__PURE__*/React.createElement(Slot, {
    w: 64,
    h: 64
  }, /*#__PURE__*/React.createElement(Piece, {
    rows: card.small[1].rows,
    cell: 18
  }))));

  /* B1 combo meter */
  W.comboMeter = card => {
    const {
      ComboPopup
    } = NS;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        width: '100%'
      }
    }, [{
      m: 1,
      f: 0.0,
      l: 'BẮT ĐẦU'
    }, {
      m: 2,
      f: 0.55,
      l: 'CHUỖI 2'
    }, {
      m: 3,
      f: 1,
      l: 'CHUỖI 3'
    }].map(row => /*#__PURE__*/React.createElement("div", {
      key: row.m,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: 300
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        display: 'flex',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(ComboPopup, {
      combo: row.m,
      showPieces: false,
      showDish: false,
      animate: false
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 16,
        borderRadius: 999,
        background: 'var(--color-surface-sunken)',
        boxShadow: 'inset 0 1px 3px rgba(120,92,52,.18)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: row.f * 100 + '%',
        height: '100%',
        borderRadius: 999,
        background: 'linear-gradient(90deg, var(--color-warning), var(--color-primary))'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '.04em',
        color: 'var(--color-text-muted)'
      }
    }, row.l)))));
  };

  /* goal HUD card */
  function GoalCard({
    icon,
    title,
    counter,
    frac,
    crossed
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 300,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface-sunken)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, icon), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 16,
        color: 'var(--color-text)'
      }
    }, title), counter && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 12,
        color: 'var(--color-text-muted)'
      }
    }, counter)), crossed && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 44,
        height: 44
      }
    }, /*#__PURE__*/React.createElement(GravityRotateButton, {
      turnsLeft: 0,
      disabled: true,
      style: {
        transform: 'scale(.66)',
        transformOrigin: 'center'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 4,
        borderRadius: '50%',
        boxShadow: 'inset 0 0 0 3px var(--color-danger)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '50%',
        left: 2,
        right: 2,
        height: 3,
        background: 'var(--color-danger)',
        transform: 'rotate(-38deg)'
      }
    }))), frac != null && /*#__PURE__*/React.createElement("div", {
      style: {
        height: 14,
        borderRadius: 999,
        background: 'var(--color-surface-sunken)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: frac * 100 + '%',
        height: '100%',
        borderRadius: 999,
        background: 'var(--color-success)'
      }
    })));
  }
  W.goalNoRotate = card => /*#__PURE__*/React.createElement(GoalCard, {
    icon: /*#__PURE__*/React.createElement(X.Target, {
      size: 26,
      color: "var(--color-gravity)"
    }),
    title: card.title,
    counter: card.counter,
    crossed: true
  });
  W.goalColor = card => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(GoalCard, {
    icon: /*#__PURE__*/React.createElement(JellyBlock, {
      color: "mint",
      size: 34,
      showEyes: false
    }),
    title: card.title,
    counter: card.counter,
    frac: card.frac
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, ['M', 'M', 'M', 'M', 'M'].map((c, i) => /*#__PURE__*/React.createElement(JellyBlock, {
    key: i,
    color: "mint",
    size: 30,
    clearing: i < 2
  }))));

  /* C-pool modifier palette */
  W.modifierPalette = (card, h) => {
    const {
      MiniBoard
    } = h;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12
      }
    }, card.items.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: '12px 6px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      rows: [it.ch],
      deco: it.deco ? {
        '0,0': it.deco
      } : {},
      cell: 40,
      gap: 0,
      pad: 0
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 11,
        color: 'var(--color-text)',
        textAlign: 'center',
        lineHeight: 1.2
      }
    }, it.label))));
  };

  /* F3 boss lock color */
  W.bossLockColor = card => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(BossFace, {
    mood: "angry",
    hp: 0.7
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 290,
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-md)',
      padding: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(JellyBlock, {
    color: "mint",
    size: 40,
    showEyes: false,
    style: {
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -6,
      right: -6
    }
  }, X.Lock && /*#__PURE__*/React.createElement(X.Lock, {
    size: 20,
    color: "var(--color-danger)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15,
      color: 'var(--color-text)'
    }
  }, card.title, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 12,
      color: 'var(--color-text-muted)'
    }
  }, card.counter))));

  /* F5 boss phases */
  W.bossPhases = card => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(BossFace, {
    hp: 1,
    mood: "normal",
    size: 96
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--color-text)',
      whiteSpace: 'nowrap'
    }
  }, "Pha 1"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 11,
      color: 'var(--color-text-muted)',
      whiteSpace: 'nowrap'
    }
  }, "\u0110\xF2n: m\u1ECDc d\xE2y")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      color: 'var(--color-gravity)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron",
    size: 24,
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 800,
      fontSize: 10,
      color: 'var(--color-text-muted)',
      whiteSpace: 'nowrap'
    }
  }, "\u2212\xBD m\xE1u")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(BossFace, {
    hp: 0.5,
    mood: "angry",
    size: 96
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--color-text)',
      whiteSpace: 'nowrap'
    }
  }, "Pha 2"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 11,
      color: 'var(--color-text-muted)',
      whiteSpace: 'nowrap'
    }
  }, "\u0110\xF2n: xoay")));

  /* boss board: boss face on top + before/after boards */
  W.bossBoard = (card, h) => {
    const {
      MiniBoard,
      Panel,
      ActionNode,
      GravityChip
    } = h;
    const b = card.boss || {};
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(BossFace, {
      mood: b.mood || 'angry',
      hp: b.hp != null ? b.hp : 1,
      world: b.world,
      jewel: b.jewel,
      size: 96
    }), b.crownStrip && /*#__PURE__*/React.createElement(MapCrownStrip, null), /*#__PURE__*/React.createElement(Panel, {
      label: "TR\u01AF\u1EDAC"
    }, /*#__PURE__*/React.createElement(MiniBoard, card.before)), /*#__PURE__*/React.createElement(ActionNode, null, window.GJMech.renderAction(card.action)), /*#__PURE__*/React.createElement(Panel, {
      label: "SAU"
    }, /*#__PURE__*/React.createElement(MiniBoard, card.after)));
  };

  /* vương miện theo map — dải minh hoạ 10 thế giới */
  function MapCrownStrip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-sm)',
        padding: '12px 12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
        textAlign: 'center'
      }
    }, "V\u01B0\u01A1ng mi\u1EC7n \u0111\u1ED5i theo map"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 8
      }
    }, Object.keys(MAP_CROWNS).map(wKey => {
      const w = +wKey,
        gem = MAP_CROWNS[w];
      return /*#__PURE__*/React.createElement("div", {
        key: w,
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }
      }, /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 100 70",
        width: "36",
        height: "25",
        style: {
          display: 'block',
          filter: 'drop-shadow(0 2px 1px rgba(74,53,38,.28))'
        }
      }, /*#__PURE__*/React.createElement("path", {
        d: "M11 60 L11 16 L34 38 L50 6 L66 38 L89 16 L89 60 Z",
        fill: "#FFCA66",
        stroke: "#E8B85C",
        strokeWidth: "4",
        strokeLinejoin: "round",
        strokeLinecap: "round"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "7",
        y: "52",
        width: "86",
        height: "15",
        rx: "6",
        fill: "#FFD27A",
        stroke: "#E8B85C",
        strokeWidth: "4"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "16",
        r: "5.5",
        fill: gem,
        stroke: "#E8B85C",
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "50",
        cy: "6",
        r: "6.5",
        fill: gem,
        stroke: "#E8B85C",
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "89",
        cy: "16",
        r: "5.5",
        fill: gem,
        stroke: "#E8B85C",
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "50",
        cy: "59",
        r: "4.6",
        fill: gem
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 11,
          color: 'var(--color-text)',
          lineHeight: 1
        }
      }, w), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 8.5,
          color: 'var(--color-text-muted)',
          lineHeight: 1,
          textAlign: 'center'
        }
      }, WORLD_NAMES[w]));
    })));
  }

  /* G1 buff choice */
  W.buffChoice = card => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, card.buffs.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 96,
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      borderBottom: '4px solid var(--color-gravity-edge)',
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      background: 'color-mix(in srgb, var(--color-gravity) 16%, #fff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--color-gravity)'
    }
  }, b.icon === 'rotate' ? /*#__PURE__*/React.createElement(Icon, {
    name: "rotate",
    size: 26,
    strokeWidth: 2.4
  }) : b.icon === 'star' ? /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 26,
    strokeWidth: 2.4
  }) : /*#__PURE__*/React.createElement(X.Bomb, {
    size: 26,
    color: "var(--color-gravity)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--color-text)',
      lineHeight: 1.1
    }
  }, b.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 11,
      color: 'var(--color-text-muted)',
      lineHeight: 1.25
    }
  }, b.desc))));

  /* G2 power-up bar */
  W.powerupBar = card => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      width: 320
    }
  }, card.items.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-sm)',
      padding: '8px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: 'color-mix(in srgb, var(--color-primary) 16%, #fff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--color-primary)'
    }
  }, p.icon === 'hammer' ? /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 4l6 6-3 3-6-6zM11 7l-7 7v3h3l7-7"
  })) : p.icon === 'row' ? /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "9",
    width: "18",
    height: "6",
    rx: "2"
  })) : p.icon === 'swap' ? /*#__PURE__*/React.createElement(Icon, {
    name: "refresh",
    size: 22,
    strokeWidth: 2.4
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "rotate",
    size: 22,
    strokeWidth: 2.4
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -4,
      right: -4,
      minWidth: 18,
      height: 18,
      padding: '0 4px',
      borderRadius: 999,
      background: 'var(--color-gravity)',
      color: '#fff',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 11,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, p.count)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--color-text)'
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 11,
      color: 'var(--color-primary)',
      background: 'color-mix(in srgb, var(--color-primary) 14%, #fff)',
      padding: '4px 9px',
      borderRadius: 999
    }
  }, X.AdBadge ? /*#__PURE__*/React.createElement(X.AdBadge, null) : 'QC', " +1"))));

  /* G3 daily challenge */
  W.dailyCard = (card, h) => {
    const {
      MiniBoard
    } = h;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        width: 310
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: 'var(--color-text-muted)'
      }
    }, X.Calendar && /*#__PURE__*/React.createElement(X.Calendar, {
      size: 18,
      color: "var(--color-text-muted)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '.04em',
        textTransform: 'uppercase'
      }
    }, card.date)), /*#__PURE__*/React.createElement(MiniBoard, {
      rows: card.board,
      cell: 28,
      gap: 3,
      pad: 6
    }), /*#__PURE__*/React.createElement("button", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 16,
        color: '#fff',
        background: 'var(--color-primary)',
        borderBottom: '4px solid var(--color-primary-edge)',
        border: 'none',
        borderRadius: 'var(--radius-xl)',
        padding: '12px 40px',
        boxShadow: 'var(--shadow-sm)'
      }
    }, "Ch\u01A1i")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, card.ranks.map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 13,
        color: 'var(--color-text)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 18,
        color: 'var(--color-text-muted)'
      }
    }, i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, r.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        color: 'var(--color-text-muted)'
      }
    }, r.score)))));
  };

  /* G4 streak */
  W.streakWidget = card => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 8
    }
  }, card.days.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: d.done ? 'var(--color-block-yellow)' : 'var(--color-surface-sunken)',
      border: d.today ? '3px solid var(--color-primary)' : '3px solid transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: d.today ? 'gjPulse 1.4s ease infinite' : 'none'
    }
  }, d.done ? X.FilledStar ? /*#__PURE__*/React.createElement(X.FilledStar, {
    size: 20,
    earned: true
  }) : '★' : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 13,
      color: 'var(--color-text-muted)'
    }
  }, i + 1))))), /*#__PURE__*/React.createElement("button", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 15,
      color: '#fff',
      background: 'var(--color-primary)',
      borderBottom: '4px solid var(--color-primary-edge)',
      border: 'none',
      borderRadius: 'var(--radius-xl)',
      padding: '12px 30px'
    }
  }, "\u0110i\u1EC3m danh +th\u01B0\u1EDFng"));

  /* A9 fab lock: rotate FAB available → locked + countdown */
  W.fabLock = card => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StateLabel, null, "TR\u01AF\u1EDAC"), /*#__PURE__*/React.createElement(GravityRotateButton, {
    turnsLeft: 3
  }), /*#__PURE__*/React.createElement(DownArrow, null), /*#__PURE__*/React.createElement(StateLabel, null, "SAU"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(GravityRotateButton, {
    turnsLeft: 3,
    disabled: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -8,
      right: -8,
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      background: 'var(--color-info)',
      color: '#fff',
      borderRadius: 999,
      padding: '3px 8px',
      boxShadow: 'var(--shadow-sm)'
    }
  }, X.Lock && /*#__PURE__*/React.createElement(X.Lock, {
    size: 16,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 13
    }
  }, "3"))));
  window.GJMechW = W;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "07-mechanics/mechanics-widgets.jsx", error: String((e && e.message) || e) }); }

// 07-mechanics/world3-water-kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* world3-water-kit.jsx — cơ chế "Dòng chảy / Nguồn nước" của World 3 (Sông & Thác).
   Documentation kit (no .d.ts → stays out of the bundle). Renders three
   landscape design-spec sheets. Reuses JellyBlock from the DS bundle so jelly
   stays 100% on-brand; the water cells are new tiles built from tokens + simple
   shapes only.

   A sheet HTML loads: _ds_bundle.js → world3-water-kit.jsx, then calls
   GJWater.render('<id>', rootEl).  ids: 'components' | 'stateflow' | 'tutorial'. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    JellyBlock
  } = NS;

  /* ---- water palette (teal ramp, harmonises with mint/aqua jelly) ---- */
  const AQ = {
    deep: '#12959F',
    teal: '#2FBFC7',
    mid: '#5FD2D6',
    light: '#9FE4E7',
    pale: '#D6F2F3',
    core: '#F1FCFC',
    edge: '#158A93',
    foam: '#EAFBFB',
    dry: '#C4BBAC',
    dryEdge: '#A89A82',
    dryDark: '#8A7E68'
  };
  const CODE = {
    Y: 'yellow',
    M: 'mint',
    P: 'pink',
    B: 'blue',
    S: 'stone'
  };
  const PURPLE = '#7E6CF0',
    PURPLE_EDGE = '#6353D6',
    PURPLE_SHINE = '#A99CF6';

  /* ---- one-time keyframes ---- */
  if (!document.getElementById('gj-water-css')) {
    const s = document.createElement('style');
    s.id = 'gj-water-css';
    s.textContent = `
      @keyframes gjwSource { 0%,100%{ box-shadow:0 0 0 3px ${AQ.core}, 0 0 12px 2px rgba(47,191,199,.6);} 50%{ box-shadow:0 0 0 4px ${AQ.core}, 0 0 20px 5px rgba(47,191,199,.85);} }
      @keyframes gjwNew { 0%,100%{ box-shadow:0 0 0 2px ${AQ.foam}, 0 0 10px 1px rgba(95,210,214,.6); transform:scale(1);} 50%{ box-shadow:0 0 0 3px ${AQ.foam}, 0 0 16px 3px rgba(95,210,214,.9); transform:scale(1.04);} }
      @keyframes gjwRing { 0%,100%{ transform:scale(1); opacity:.85;} 50%{ transform:scale(1.14); opacity:.35;} }
      @keyframes gjwArrow { 0%,100%{ opacity:.55;} 50%{ opacity:1;} }
      @keyframes gjwBob { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-3px);} }
      @keyframes gjwSpin { to { transform:rotate(360deg);} }
      @keyframes gjwSpark { 0%,100%{ transform:scale(.4) rotate(0); opacity:0;} 50%{ transform:scale(1) rotate(40deg); opacity:1;} }
      @keyframes gjwWaveShift { to { transform:translateX(-50%);} }
      @keyframes gjwWaveShiftV { to { transform:translateY(-50%);} }
      @keyframes gjwArrowMarch { from { background-position-x:0;} to { background-position-x:24px;} }
      @keyframes gjwTipGlow { 0%,100%{ opacity:.5; transform:scale(1);} 50%{ opacity:1; transform:scale(1.08);} }
      @keyframes gjwDash { to { stroke-dashoffset:-40;} }
      @media (prefers-reduced-motion: reduce){ [class^="gjw-"]{ animation:none !important; } }
    `;
    document.head.appendChild(s);
  }
  const font = {
    d: 'var(--font-display)',
    b: 'var(--font-body)'
  };
  const rot = {
    '→': 0,
    '↓': 90,
    '←': 180,
    '↑': -90
  };

  /* =================== small parts =================== */

  function Drop({
    size = 20,
    fill = AQ.teal,
    stroke = AQ.edge,
    shine = true
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2.5C12 2.5 4.5 11.4 4.5 16.2A7.5 7.5 0 0 0 19.5 16.2C19.5 11.4 12 2.5 12 2.5Z",
      fill: fill,
      stroke: stroke,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), shine && /*#__PURE__*/React.createElement("path", {
      d: "M9 14.2a3.4 3.4 0 0 0 1.7 2.7",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      opacity: ".8"
    }));
  }
  function Arrow({
    dir = '→',
    size = 22,
    color = '#fff',
    sw = 2.6,
    className
  }) {
    return /*#__PURE__*/React.createElement("span", {
      className: className,
      style: {
        display: 'inline-flex',
        transform: `rotate(${rot[dir]}deg)`,
        color
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: sw,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12h13M12 6l6 6-6 6"
    })));
  }
  function Foam({
    cell,
    dir
  }) {
    // two small foam bubbles at the leading (downstream) edge
    const at = {
      '→': {
        right: 3,
        top: '50%'
      },
      '←': {
        left: 3,
        top: '50%'
      },
      '↑': {
        top: 3,
        left: '50%'
      },
      '↓': {
        bottom: 3,
        left: '50%'
      }
    }[dir];
    const b = {
      position: 'absolute',
      borderRadius: '50%',
      background: AQ.foam,
      opacity: .9
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        ...b,
        width: cell * .1,
        height: cell * .1,
        ...at,
        transform: 'translate(-50%,-50%)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        ...b,
        width: cell * .07,
        height: cell * .07,
        ...at,
        transform: `translate(${dir === '→' ? '-160%' : dir === '←' ? '60%' : '-50%'}, ${dir === '↑' || dir === '↓' ? dir === '↑' ? '60%' : '-160%' : '-190%'})`,
        opacity: .7
      }
    }));
  }

  /* =================== water cells =================== */

  function WaterCell({
    type,
    dir = '→',
    cell = 88
  }) {
    const radius = Math.round(cell * 0.24);
    const base = {
      width: cell,
      height: cell,
      borderRadius: radius,
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden'
    };
    if (type === 'source') {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          width: cell,
          height: cell
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "gjw-src",
        style: {
          ...base,
          background: `radial-gradient(circle at 50% 42%, ${AQ.mid} 0%, ${AQ.teal} 46%, ${AQ.deep} 100%)`,
          boxShadow: `0 0 0 3px ${AQ.core}, 0 0 14px 3px rgba(47,191,199,.7)`,
          animation: 'gjwSource 1.9s var(--ease-inout,ease) infinite'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: '50%',
          top: '46%',
          width: cell * .6,
          height: cell * .6,
          marginLeft: -cell * .3,
          marginTop: -cell * .3,
          borderRadius: '50%',
          border: `2px solid rgba(255,255,255,.5)`,
          animation: 'gjwRing 2s ease infinite'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: '50%',
          top: '46%',
          width: cell * .34,
          height: cell * .34,
          marginLeft: -cell * .17,
          marginTop: -cell * .17,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${AQ.core} 0%, ${AQ.light} 78%)`,
          boxShadow: `inset 0 1px 2px rgba(18,149,159,.4)`
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          top: cell * .1,
          left: '30%',
          width: cell * .08,
          height: cell * .08,
          borderRadius: '50%',
          background: AQ.foam
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          top: cell * .16,
          left: '64%',
          width: cell * .06,
          height: cell * .06,
          borderRadius: '50%',
          background: AQ.foam,
          opacity: .85
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          ...(dir === '→' ? {
            right: 3,
            top: '50%',
            transform: 'translateY(-50%)'
          } : dir === '↓' ? {
            bottom: 3,
            left: '50%',
            transform: 'translateX(-50%)'
          } : dir === '←' ? {
            left: 3,
            top: '50%',
            transform: 'translateY(-50%)'
          } : {
            top: 3,
            left: '50%',
            transform: 'translateX(-50%)'
          })
        }
      }, /*#__PURE__*/React.createElement(Arrow, {
        dir: dir,
        size: cell * .3,
        color: "#fff",
        sw: 3,
        className: "gjw-arr"
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          top: -cell * .14,
          left: '50%',
          transform: 'translateX(-50%)',
          width: cell * .42,
          height: cell * .42,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3
        }
      }, /*#__PURE__*/React.createElement(Drop, {
        size: cell * .3
      })));
    }
    if (type === 'flow' || type === 'new') {
      const isNew = type === 'new';
      return /*#__PURE__*/React.createElement("div", {
        className: isNew ? 'gjw-new' : '',
        style: {
          ...base,
          background: `linear-gradient(135deg, ${AQ.light} 0%, ${AQ.mid} 100%)`,
          boxShadow: isNew ? `0 0 0 2px ${AQ.foam}, 0 0 12px 2px rgba(95,210,214,.7)` : 'inset 0 1px 3px rgba(18,149,159,.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: isNew ? 'gjwNew 1.5s var(--ease-inout,ease) infinite' : 'none'
        }
      }, /*#__PURE__*/React.createElement(Arrow, {
        dir: dir,
        size: cell * .42,
        color: AQ.deep,
        sw: 3.2
      }), /*#__PURE__*/React.createElement(Foam, {
        cell: cell,
        dir: dir
      }), isNew && /*#__PURE__*/React.createElement("svg", {
        width: cell * .3,
        height: cell * .3,
        viewBox: "0 0 24 24",
        style: {
          position: 'absolute',
          top: cell * .06,
          right: cell * .06,
          animation: 'gjwSpark 1.4s ease infinite'
        }
      }, /*#__PURE__*/React.createElement("path", {
        d: "M12 0c1 6 4 9 12 12-8 3-11 6-12 12-1-6-4-9-12-12 8-3 11-6 12-12z",
        fill: AQ.foam
      })));
    }
    if (type === 'drop') {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          ...base,
          background: `radial-gradient(circle at 50% 45%, ${AQ.pale} 0%, ${AQ.light} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          width: cell * .72,
          height: cell * .72,
          borderRadius: '50%',
          border: `2px dashed ${AQ.deep}`,
          animation: 'gjwRing 1.7s ease infinite'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          animation: 'gjwBob 1.9s var(--ease-inout,ease) infinite',
          filter: 'drop-shadow(0 2px 2px rgba(18,149,159,.35))'
        }
      }, /*#__PURE__*/React.createElement(Drop, {
        size: cell * .56,
        fill: AQ.teal,
        stroke: AQ.edge
      })));
    }
    if (type === 'broken') {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          width: cell,
          height: cell
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          ...base,
          background: `linear-gradient(160deg, ${AQ.dry} 0%, #B3A48C 100%)`,
          boxShadow: 'inset 0 2px 5px rgba(120,92,52,.24)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: '50%',
          top: '48%',
          width: cell * .3,
          height: cell * .3,
          marginLeft: -cell * .15,
          marginTop: -cell * .15,
          borderRadius: '50%',
          background: '#9C8E77',
          boxShadow: 'inset 0 1px 2px rgba(74,53,38,.4)'
        }
      }), /*#__PURE__*/React.createElement("svg", {
        width: cell,
        height: cell,
        viewBox: "0 0 100 100",
        style: {
          position: 'absolute',
          inset: 0
        },
        fill: "none",
        stroke: AQ.dryDark,
        strokeWidth: "2.4",
        strokeLinecap: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M50 50 L28 30 M50 50 L74 34 M50 50 L40 78 M50 50 L70 70",
        opacity: ".7"
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          top: -cell * .14,
          left: '50%',
          transform: 'translateX(-50%)',
          width: cell * .42,
          height: cell * .42,
          borderRadius: '50%',
          background: '#EDE5D8',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
          opacity: .8
        }
      }, /*#__PURE__*/React.createElement("svg", {
        width: cell * .3,
        height: cell * .3,
        viewBox: "0 0 24 24"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M12 2.5C12 2.5 4.5 11.4 4.5 16.2A7.5 7.5 0 0 0 19.5 16.2C19.5 11.4 12 2.5 12 2.5Z",
        fill: "#D9CFBE",
        stroke: AQ.dryEdge,
        strokeWidth: "1.6",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 5 L11 12 L13.5 12 L11.5 19",
        fill: "none",
        stroke: AQ.dryDark,
        strokeWidth: "1.6",
        strokeLinecap: "round"
      }))));
    }

    // empty
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: cell,
        height: cell,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-cell-empty)',
        boxShadow: 'inset 0 0 0 1px var(--color-cell-line)'
      }
    });
  }

  /* =================== board (9×9 etc.) =================== */

  function WaterBoard({
    rows,
    dir = '→',
    cell = 20,
    gap = 3,
    pad = 8,
    jellyDir = 'down',
    fade = [],
    newAt = [],
    trail = [],
    splash = null
  }) {
    const grid = rows.map(s => s.split(''));
    const cols = grid[0].length,
      N = grid.length;
    const K = (r, c) => r + ',' + c;
    const fadeSet = new Set(fade.map(([r, c]) => K(r, c)));
    const newSet = new Set(newAt.map(([r, c]) => K(r, c)));
    const trailSet = new Set(trail.map(([r, c]) => K(r, c)));
    const W = pad * 2 + cols * cell + (cols - 1) * gap;
    const H = pad * 2 + N * cell + (N - 1) * gap;
    const node = (r, c) => {
      const ch = grid[r][c];
      const faded = fadeSet.has(K(r, c));
      let inner;
      if (ch === '.') inner = /*#__PURE__*/React.createElement(WaterCell, {
        type: "empty",
        cell: cell
      });else if (ch === 'S') inner = /*#__PURE__*/React.createElement(WaterCell, {
        type: "source",
        dir: dir,
        cell: cell
      });else if (ch === 's') inner = /*#__PURE__*/React.createElement(WaterCell, {
        type: newSet.has(K(r, c)) ? 'new' : 'flow',
        dir: dir,
        cell: cell
      });else if (ch === 'd') inner = /*#__PURE__*/React.createElement(WaterCell, {
        type: "drop",
        cell: cell
      });else if (ch === 'x') inner = /*#__PURE__*/React.createElement(WaterCell, {
        type: "broken",
        cell: cell
      });else inner = /*#__PURE__*/React.createElement(JellyBlock, {
        color: CODE[ch] || 'yellow',
        size: cell,
        direction: jellyDir,
        showEyes: cell >= 18
      });
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          width: cell,
          height: cell,
          opacity: faded ? 0.32 : 1,
          transition: 'opacity .3s'
        }
      }, inner, trailSet.has(K(r, c)) && /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          top: '50%',
          left: -cell * .5,
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }
      }, /*#__PURE__*/React.createElement(Arrow, {
        dir: dir,
        size: cell * .8,
        color: AQ.deep,
        sw: 3,
        className: "gjw-arr"
      })));
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridAutoRows: `${cell}px`,
        gap,
        padding: pad,
        background: 'var(--color-surface-sunken)',
        borderRadius: 16,
        boxShadow: 'inset 0 2px 6px rgba(120,92,52,.12)'
      }
    }, grid.map((row, r) => row.map((_, c) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: r + '-' + c
    }, node(r, c))))), splash && (() => {
      const x = pad + splash[1] * (cell + gap) + cell / 2,
        y = pad + splash[0] * (cell + gap) + cell / 2;
      return /*#__PURE__*/React.createElement("svg", {
        width: cell * 2.4,
        height: cell * 2.4,
        viewBox: "0 0 60 60",
        style: {
          position: 'absolute',
          left: x - cell * 1.2,
          top: y - cell * 1.2,
          pointerEvents: 'none'
        }
      }, [0, 60, 120, 180, 240, 300].map(a => {
        const rad = a * Math.PI / 180;
        return /*#__PURE__*/React.createElement("circle", {
          key: a,
          cx: 30 + Math.cos(rad) * 17,
          cy: 30 + Math.sin(rad) * 17,
          r: a % 120 === 0 ? 3.4 : 2.4,
          fill: AQ.mid,
          opacity: ".85"
        });
      }));
    })());
  }

  /* =================== horizontal flow strip (push demos) =================== */

  function WaterStrip({
    cells,
    dir = '→',
    jelly = [],
    ghost = [],
    bracket = null,
    cell = 52,
    gap = 4,
    arrow = true
  }) {
    // cells: array of 'S'|'s'|'n' ; jelly: [{color, index}] sat on top of a cell
    const stride = cell + gap;
    const W = cells.length * cell + (cells.length - 1) * gap;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: cell + 14,
        display: 'flex',
        alignItems: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap
      }
    }, cells.map((ch, i) => /*#__PURE__*/React.createElement(WaterCell, {
      key: i,
      type: ch === 'S' ? 'source' : ch === 'n' ? 'new' : 'flow',
      dir: dir,
      cell: cell
    }))), ghost.map((g, i) => /*#__PURE__*/React.createElement("div", {
      key: 'g' + i,
      style: {
        position: 'absolute',
        left: g.index * stride,
        bottom: 0,
        opacity: .28
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: g.color,
      size: cell,
      direction: "down",
      showEyes: false
    }))), jelly.map((j, i) => /*#__PURE__*/React.createElement("div", {
      key: 'j' + i,
      style: {
        position: 'absolute',
        left: j.index * stride,
        bottom: 0
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: j.color,
      size: cell,
      direction: "down",
      expression: "focus"
    }))), bracket && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -12,
        left: bracket[0] * stride,
        width: (bracket[1] - bracket[0]) * stride + cell,
        height: 8,
        borderTop: `3px solid ${AQ.deep}`,
        borderLeft: `3px solid ${AQ.deep}`,
        borderRight: `3px solid ${AQ.deep}`,
        borderRadius: '6px 6px 0 0'
      }
    }), arrow && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        right: -34,
        top: '46%',
        transform: 'translateY(-50%)'
      }
    }, /*#__PURE__*/React.createElement(Arrow, {
      dir: dir,
      size: 30,
      color: AQ.deep,
      sw: 3.4,
      className: "gjw-arr"
    })));
  }

  /* =================== chrome =================== */

  function SheetHead({
    title,
    subtitle
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 46,
        height: 46,
        borderRadius: 14,
        background: `linear-gradient(160deg, ${AQ.mid}, ${AQ.deep})`,
        boxShadow: `0 0 0 3px ${AQ.core}, var(--shadow-md)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Drop, {
      size: 26,
      fill: "#fff",
      stroke: AQ.pale
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontFamily: font.d,
        fontWeight: 700,
        fontSize: 34,
        lineHeight: 1.02,
        color: 'var(--color-text)',
        letterSpacing: '-.01em',
        whiteSpace: 'nowrap'
      }
    }, title), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '4px 0 0',
        fontFamily: font.b,
        fontWeight: 700,
        fontSize: 15,
        color: AQ.deep,
        letterSpacing: '.02em'
      }
    }, subtitle))));
  }
  function Card({
    title,
    note,
    children,
    style = {}
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-surface)',
        borderRadius: 20,
        boxShadow: 'var(--shadow-md)',
        padding: '18px 18px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        ...style
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }
    }, children), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.d,
        fontWeight: 700,
        fontSize: 15,
        color: 'var(--color-text)',
        textAlign: 'center',
        lineHeight: 1.15
      }
    }, title), note && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.b,
        fontWeight: 700,
        fontSize: 12,
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        lineHeight: 1.3,
        maxWidth: 190
      }
    }, note)));
  }
  function StepChip({
    n,
    tone = AQ.deep
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 24,
        height: 24,
        padding: '0 7px',
        borderRadius: 999,
        background: tone,
        color: '#fff',
        fontFamily: font.d,
        fontWeight: 800,
        fontSize: 13,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, n);
  }
  function Legend({
    items
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        background: 'var(--color-surface)',
        borderRadius: 16,
        boxShadow: 'var(--shadow-sm)',
        padding: '12px 16px'
      }
    }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        paddingRight: 14,
        borderRight: i < items.length - 1 ? '1px solid var(--color-cell-line)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0
      }
    }, it.swatch), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.b,
        fontWeight: 700,
        fontSize: 12.5,
        color: 'var(--color-text)',
        lineHeight: 1.25,
        maxWidth: 200
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        color: AQ.deep
      }
    }, it.k), " ", it.v))));
  }
  function NoteRow({
    notes
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12
      }
    }, notes.map((t, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: '1 1 240px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: `color-mix(in srgb, ${AQ.pale} 60%, var(--color-surface))`,
        borderRadius: 14,
        padding: '12px 16px',
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 26,
        height: 26,
        flexShrink: 0,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Drop, {
      size: 16
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.b,
        fontWeight: 700,
        fontSize: 13,
        color: 'var(--color-text)',
        lineHeight: 1.3
      }
    }, t))));
  }
  function SheetShell({
    w,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        boxSizing: 'border-box',
        background: `radial-gradient(120% 70% at 50% 0%, #FBFEFE 0%, var(--color-bg) 55%)`,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        fontFamily: font.b,
        color: 'var(--color-text)'
      }
    }, children);
  }
  function ObstaclePanel({
    n,
    title,
    caption,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 11
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        alignSelf: 'stretch'
      }
    }, /*#__PURE__*/React.createElement(StepChip, {
      n: n,
      tone: AQ.teal
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.d,
        fontWeight: 700,
        fontSize: 15,
        color: 'var(--color-text)',
        lineHeight: 1.1
      }
    }, title)), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-surface-sunken)',
        borderRadius: 16,
        padding: 8
      }
    }, children), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontFamily: font.b,
        fontWeight: 700,
        fontSize: 12,
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        lineHeight: 1.35,
        maxWidth: 230
      }
    }, caption));
  }

  /* legend swatches */
  const sw = {
    source: /*#__PURE__*/React.createElement(WaterCell, {
      type: "source",
      cell: 34
    }),
    flow: /*#__PURE__*/React.createElement(WaterCell, {
      type: "flow",
      cell: 34
    }),
    new: /*#__PURE__*/React.createElement(WaterCell, {
      type: "new",
      cell: 34
    }),
    drop: /*#__PURE__*/React.createElement(WaterCell, {
      type: "drop",
      cell: 34
    }),
    broken: /*#__PURE__*/React.createElement(WaterCell, {
      type: "broken",
      cell: 34
    })
  };

  /* =================== SHEET 1 — component sheet =================== */

  function ComponentSheet() {
    return /*#__PURE__*/React.createElement(SheetShell, {
      w: 1500
    }, /*#__PURE__*/React.createElement(SheetHead, {
      title: "WORLD 3 \u2014 C\u01A0 CH\u1EBE D\xD2NG CH\u1EA2Y",
      subtitle: "Ngu\u1ED3n n\u01B0\u1EDBc \xB7 D\xF2ng ch\u1EA3y \xB7 \xD4 gi\u1ECDt n\u01B0\u1EDBc \xB7 Jelly b\u1ECB \u0111\u1EA9y"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      title: "\xD4 ngu\u1ED3n n\u01B0\u1EDBc \u2014 ACTIVE",
      note: "Sinh d\xF2ng ch\u1EA3y \xB7 badge gi\u1ECDt n\u01B0\u1EDBc = c\xF3 th\u1EC3 b\u1ECB ph\xE1"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 0 0'
      }
    }, /*#__PURE__*/React.createElement(WaterCell, {
      type: "source",
      cell: 96
    }))), /*#__PURE__*/React.createElement(Card, {
      title: "\xD4 d\xF2ng ch\u1EA3y th\u01B0\u1EDDng",
      note: "N\u01B0\u1EDBc lan ra t\u1EEB ngu\u1ED3n \xB7 \u0111\u1EA9y jelly theo m\u0169i t\xEAn"
    }, /*#__PURE__*/React.createElement(WaterCell, {
      type: "flow",
      cell: 96
    })), /*#__PURE__*/React.createElement(Card, {
      title: "\xD4 d\xF2ng ch\u1EA3y M\u1EDAI M\u1ECCC",
      note: "V\u1EEBa t\u1EA1o trong l\u01B0\u1EE3t n\xE0y \xB7 vi\u1EC1n s\xE1ng + l\u1EA5p l\xE1nh"
    }, /*#__PURE__*/React.createElement(WaterCell, {
      type: "new",
      cell: 96
    })), /*#__PURE__*/React.createElement(Card, {
      title: "\xD4 gi\u1ECDt n\u01B0\u1EDBc (TARGET)",
      note: "Clear qua \xF4 n\xE0y \u0111\u1EC3 PH\xC1 NGU\u1ED2N"
    }, /*#__PURE__*/React.createElement(WaterCell, {
      type: "drop",
      cell: 96
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr 1.4fr 1.9fr',
        gap: 16,
        alignItems: 'stretch'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Ngu\u1ED3n \u2014 BROKEN",
      note: "Mi\u1EC7ng ngu\u1ED3n kh\xF4, n\u1EE9t \xB7 h\u1EBFt glow \xB7 badge v\u1EE1"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 0 0'
      }
    }, /*#__PURE__*/React.createElement(WaterCell, {
      type: "broken",
      cell: 96
    }))), /*#__PURE__*/React.createElement(Card, {
      title: "Jelly b\u1ECB \u0111\u1EA9y 1 \xF4",
      note: "Jelly tr\xEAn \xF4 n\u01B0\u1EDBc b\u1ECB \u0111\u1EA9y 1 \xF4 theo h\u01B0\u1EDBng d\xF2ng ch\u1EA3y"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 30px 0 0'
      }
    }, /*#__PURE__*/React.createElement(WaterStrip, {
      cells: ['s', 's', 's'],
      jelly: [{
        color: 'pink',
        index: 2
      }],
      ghost: [{
        color: 'pink',
        index: 1
      }],
      cell: 52
    }))), /*#__PURE__*/React.createElement(Card, {
      title: "C\u1EE5m d\xEDnh nhau tr\xF4i c\xF9ng",
      note: "C\u1EA3 c\u1EE5m jelly d\xEDnh nhau tr\xF4i c\xF9ng nhau theo d\xF2ng"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 30px 0 0'
      }
    }, /*#__PURE__*/React.createElement(WaterStrip, {
      cells: ['s', 's', 's', 's'],
      jelly: [{
        color: 'mint',
        index: 1
      }, {
        color: 'yellow',
        index: 2
      }, {
        color: 'blue',
        index: 3
      }],
      ghost: [{
        color: 'mint',
        index: 0
      }, {
        color: 'yellow',
        index: 1
      }, {
        color: 'blue',
        index: 2
      }],
      bracket: [1, 3],
      cell: 48
    }))), /*#__PURE__*/React.createElement(Card, {
      title: "Ngu\u1ED3n lan r\u1ED9ng m\u1ED7i l\u01B0\u1EE3t",
      note: "M\u1ED7i l\u01B0\u1EE3t, d\xF2ng ch\u1EA3y m\u1ECDc th\xEAm \u0111\xFAng 1 \xF4 theo m\u0169i t\xEAn"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, [['S', 's'], ['S', 's', 'n'], ['S', 's', 's', 'n']].map((cells, i) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(WaterStrip, {
      cells: cells,
      newAt: [],
      cell: 34,
      arrow: false
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.b,
        fontWeight: 800,
        fontSize: 10.5,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)'
      }
    }, "L\u01B0\u1EE3t ", i + 1)), i < 2 && /*#__PURE__*/React.createElement(Arrow, {
      dir: "\u2192",
      size: 22,
      color: AQ.deep,
      sw: 3
    })))))), /*#__PURE__*/React.createElement(NoteRow, {
      notes: ['Nguồn nước tạo thêm 1 ô dòng chảy mỗi lượt.', 'Nguồn chỉ bị phá khi clear qua ô giọt nước.', 'Phá nguồn thì toàn bộ dòng chảy do nguồn đó tạo ra sẽ tắt.']
    }));
  }

  /* =================== SHEET 2 — state flow =================== */

  // 9×9 board strings; row 4 is the flow lane, source near left col 1, drop objective on source
  const bRow = fill => fill; // helper readability
  function stateBoards() {
    const empty = '.........';
    const lane = n => {
      // source at col1 + n flow cells to the right on row index 4
      let s = 'S'.padEnd(1) + 's'.repeat(n);
      s = ('.' + s).padEnd(9, '.'); // col0 empty, source col1
      return s;
    };
    return {
      f1: ['.........', '.........', '.........', '.........', lane(0), '.........', '.........', '.........', '.........'],
      f2: ['.........', '.........', '.........', '.........', lane(1), '.........', '.........', '.........', '.........'],
      f3: ['.........', '.........', '.........', '.........', lane(2), '.........', '.........', '.........', '.........'],
      f4: ['.........', '.........', '.........', '.........', lane(3), '.........', '.........', '.........', '.........'],
      f5: ['.........', '.........', '.........', '.........', '.x' + 'ssss'.slice(0, 3) + '...', '.........', '.........', '.........', '.........']
    };
  }
  function Frame({
    n,
    label,
    board,
    dropOnSource,
    faded,
    newAt,
    splash
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(StepChip, {
      n: n
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.d,
        fontWeight: 700,
        fontSize: 15,
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, label)), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-surface)',
        borderRadius: 18,
        boxShadow: 'var(--shadow-md)',
        padding: 10,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(WaterBoard, {
      rows: board,
      dir: "\u2192",
      cell: 20,
      gap: 3,
      pad: 7,
      fade: faded || [],
      newAt: newAt || [],
      splash: splash || null
    }), dropOnSource && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 10 + 7 + 1 * 23 + 10,
        top: 10 + 7 + 4 * 23 - 12,
        zIndex: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Drop, {
      size: 18
    })))));
  }
  function StateFlowSheet() {
    const B = stateBoards();
    return /*#__PURE__*/React.createElement(SheetShell, {
      w: 1580
    }, /*#__PURE__*/React.createElement(SheetHead, {
      title: "STATE FLOW \u2014 NGU\u1ED2N N\u01AF\u1EDAC M\u1ECCC D\u1EA6N",
      subtitle: "M\u1ED7i l\u01B0\u1EE3t t\u1EA1o th\xEAm 1 \xF4 theo h\u01B0\u1EDBng \u0111\u1EA9y"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4
      }
    }, [{
      n: 1,
      label: 'Khởi tạo',
      board: B.f1
    }, {
      n: 2,
      label: 'Sau 1 lượt',
      board: B.f2,
      newAt: [[4, 2]]
    }, {
      n: 3,
      label: 'Sau 2 lượt',
      board: B.f3,
      newAt: [[4, 3]]
    }, {
      n: 4,
      label: 'Sau 3 lượt',
      board: B.f4,
      newAt: [[4, 4]]
    }, {
      n: 5,
      label: 'Phá nguồn',
      board: B.f5,
      faded: [[4, 2], [4, 3], [4, 4]],
      splash: [4, 1]
    }].map((fr, i) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: fr.n
    }, /*#__PURE__*/React.createElement(Frame, fr), i < 4 && /*#__PURE__*/React.createElement(Arrow, {
      dir: "\u2192",
      size: 26,
      color: AQ.deep,
      sw: 3.4,
      className: "gjw-arr"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      title: "A \xB7 Jelly b\u1ECB \u0111\u1EA9y",
      note: "1 jelly tr\xEAn \xF4 d\xF2ng ch\u1EA3y b\u1ECB \u0111\u1EA9y 1 \xF4 theo m\u0169i t\xEAn",
      style: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 34px 0 6px'
      }
    }, /*#__PURE__*/React.createElement(WaterStrip, {
      cells: ['s', 's', 's'],
      jelly: [{
        color: 'pink',
        index: 2
      }],
      ghost: [{
        color: 'pink',
        index: 1
      }],
      cell: 54
    }))), /*#__PURE__*/React.createElement(Card, {
      title: "B \xB7 C\u1EE5m jelly b\u1ECB \u0111\u1EA9y",
      note: "2\u20133 jelly d\xEDnh nhau b\u1ECB \u0111\u1EA9y \u0111\u1ED3ng th\u1EDDi, tr\xF4i c\xF9ng nhau",
      style: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 34px 0 6px'
      }
    }, /*#__PURE__*/React.createElement(WaterStrip, {
      cells: ['s', 's', 's', 's'],
      jelly: [{
        color: 'mint',
        index: 1
      }, {
        color: 'yellow',
        index: 2
      }, {
        color: 'blue',
        index: 3
      }],
      ghost: [{
        color: 'mint',
        index: 0
      }, {
        color: 'yellow',
        index: 1
      }, {
        color: 'blue',
        index: 2
      }],
      bracket: [1, 3],
      cell: 48
    })))), /*#__PURE__*/React.createElement(Legend, {
      items: [{
        swatch: sw.source,
        k: 'Ô nguồn nước',
        v: '= sinh dòng chảy'
      }, {
        swatch: sw.flow,
        k: 'Ô dòng chảy',
        v: '= đẩy jelly 1 ô'
      }, {
        swatch: sw.drop,
        k: 'Ô giọt nước',
        v: '= clear để phá nguồn'
      }, {
        swatch: sw.broken,
        k: 'Phá nguồn',
        v: '= tắt toàn bộ dòng chảy'
      }]
    }));
  }

  /* =================== SHEET 3 — mini tutorial =================== */

  function Panel({
    n,
    title,
    caption,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-surface)',
        borderRadius: 22,
        boxShadow: 'var(--shadow-md)',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        alignSelf: 'stretch'
      }
    }, /*#__PURE__*/React.createElement(StepChip, {
      n: n,
      tone: AQ.teal
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.d,
        fontWeight: 700,
        fontSize: 16,
        color: 'var(--color-text)',
        lineHeight: 1.1
      }
    }, title)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, children), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontFamily: font.b,
        fontWeight: 700,
        fontSize: 13,
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        lineHeight: 1.35,
        maxWidth: 260
      }
    }, caption));
  }
  function tutBoard(n, extra = {}) {
    // 9×9, source col1 row4, n flow cells; optional jelly & drop overlays via extra rows
    let lane = '.S' + 's'.repeat(n);
    lane = lane.padEnd(9, '.');
    const rows = ['.........', '.........', '.........', '.........', lane, '.........', '.........', '.........', '.........'];
    if (extra.rows) extra.rows.forEach(([r, s]) => {
      rows[r] = s;
    });
    return rows;
  }
  function DropBadgeOnSource() {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 10 + 7 + 1 * 25 + 12,
        top: 10 + 7 + 4 * 25 - 14,
        zIndex: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Drop, {
      size: 19
    })));
  }
  function TutorialSheet() {
    const cell = 22,
      gap = 3,
      pad = 7;
    return /*#__PURE__*/React.createElement(SheetShell, {
      w: 1520
    }, /*#__PURE__*/React.createElement(SheetHead, {
      title: "C\u01A0 CH\u1EBE M\u1EDAI \u2014 NGU\u1ED2N N\u01AF\u1EDAC",
      subtitle: "D\xF2ng ch\u1EA3y m\u1ECDc d\u1EA7n \xB7 \u0110\u1EA9y jelly \xB7 Ph\xE1 ngu\u1ED3n b\u1EB1ng \xF4 gi\u1ECDt n\u01B0\u1EDBc"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      n: 1,
      title: "Ngu\u1ED3n n\u01B0\u1EDBc xu\u1EA5t hi\u1EC7n",
      caption: "Ngu\u1ED3n n\u01B0\u1EDBc t\u1EA1o d\xF2ng ch\u1EA3y \u2014 m\u0169i t\xEAn ch\u1EC9 h\u01B0\u1EDBng n\u01B0\u1EDBc lan ra."
    }, /*#__PURE__*/React.createElement(WaterBoard, {
      rows: tutBoard(1),
      dir: "\u2192",
      cell: cell,
      gap: gap,
      pad: pad
    }), /*#__PURE__*/React.createElement(DropBadgeOnSource, null)), /*#__PURE__*/React.createElement(Panel, {
      n: 2,
      title: "N\u01B0\u1EDBc m\u1ECDc th\xEAm 1 \xF4",
      caption: "M\u1ED7i l\u01B0\u1EE3t, d\xF2ng ch\u1EA3y m\u1ECDc th\xEAm \u0111\xFAng 1 \xF4 theo m\u0169i t\xEAn."
    }, /*#__PURE__*/React.createElement(WaterBoard, {
      rows: tutBoard(2, {
        rows: [[3, '.....M...']]
      }),
      dir: "\u2192",
      cell: cell,
      gap: gap,
      pad: pad,
      newAt: [[4, 3]]
    }), /*#__PURE__*/React.createElement(DropBadgeOnSource, null)), /*#__PURE__*/React.createElement(Panel, {
      n: 3,
      title: "Jelly b\u1ECB \u0111\u1EA9y",
      caption: "Jelly \u0111\u1EE9ng tr\xEAn \xF4 n\u01B0\u1EDBc s\u1EBD b\u1ECB \u0111\u1EA9y 1 \xF4 \u2014 c\u1EE5m d\xEDnh tr\xF4i c\xF9ng nhau."
    }, /*#__PURE__*/React.createElement(WaterBoard, {
      rows: tutBoard(3, {
        rows: [[4, '.SssPY..']]
      }),
      dir: "\u2192",
      cell: cell,
      gap: gap,
      pad: pad,
      trail: [[4, 4], [4, 5]]
    }), /*#__PURE__*/React.createElement(DropBadgeOnSource, null)), /*#__PURE__*/React.createElement(Panel, {
      n: 4,
      title: "Ph\xE1 ngu\u1ED3n",
      caption: "Clear qua \xF4 gi\u1ECDt n\u01B0\u1EDBc \u0111\u1EC3 ph\xE1 ngu\u1ED3n \u2014 c\u1EA3 d\xF2ng ch\u1EA3y t\u1EAFt theo."
    }, /*#__PURE__*/React.createElement(WaterBoard, {
      rows: ['.........', '.........', '.........', '.........', '.xsss....', '.........', '.........', '.........', '.........'],
      dir: "\u2192",
      cell: cell,
      gap: gap,
      pad: pad,
      fade: [[4, 2], [4, 3], [4, 4]],
      splash: [4, 1]
    }))), /*#__PURE__*/React.createElement(Legend, {
      items: [{
        swatch: sw.source,
        k: 'Nguồn nước',
        v: '= sinh dòng chảy'
      }, {
        swatch: sw.flow,
        k: 'Dòng chảy',
        v: '= đẩy jelly 1 ô'
      }, {
        swatch: sw.new,
        k: 'Mỗi lượt',
        v: '= thêm 1 ô mới'
      }, {
        swatch: sw.broken,
        k: 'Phá nguồn',
        v: '= tắt cả dòng chảy'
      }]
    }));
  }

  /* =================== continuous stream renderer =================== */

  function wavePath(w, h, amp, wl, yOff) {
    let d = `M0 ${yOff}`;
    for (let x = 0; x <= w; x += wl / 2) {
      const dir = x / (wl / 2) % 2 === 0 ? 1 : -1;
      d += ` Q ${x + wl / 4} ${yOff - dir * amp} ${x + wl / 2} ${yOff}`;
    }
    return d;
  }
  function wavePathV(w, h, amp, wl, xOff) {
    let d = `M${xOff} 0`;
    for (let y = 0; y <= h; y += wl / 2) {
      const dir = y / (wl / 2) % 2 === 0 ? 1 : -1;
      d += ` Q ${xOff - dir * amp} ${y + wl / 4} ${xOff} ${y + wl / 2}`;
    }
    return d;
  }
  function WaterRibbon({
    w,
    h,
    radius,
    tone = 'live',
    vertical = false,
    ring = true
  }) {
    const live = tone === 'live';
    const grad = !live ? vertical ? `linear-gradient(90deg, #B3A48C, ${AQ.dry}, #B3A48C)` : `linear-gradient(180deg, ${AQ.dry} 0%, #B3A48C 100%)` : vertical ? `linear-gradient(90deg, ${AQ.teal} 0%, ${AQ.light} 50%, ${AQ.teal} 100%)` : `linear-gradient(180deg, ${AQ.light} 0%, ${AQ.mid} 55%, ${AQ.teal} 100%)`;
    const shadow = live ? `inset 0 2px 5px rgba(255,255,255,.5), inset 0 -3px 6px rgba(18,149,159,.4)${ring ? `, 0 0 0 2px ${AQ.core}` : ''}` : 'inset 0 2px 5px rgba(120,92,52,.3)';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        borderRadius: radius != null ? radius : h / 2,
        background: grad,
        overflow: 'hidden',
        boxShadow: shadow
      }
    }, live && (vertical ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '200%',
        display: 'flex',
        flexDirection: 'column',
        animation: 'gjwWaveShiftV 2.4s linear infinite'
      }
    }, [0, 1].map(k => /*#__PURE__*/React.createElement("svg", {
      key: k,
      width: w,
      height: "50%",
      viewBox: `0 0 ${w} ${h}`,
      preserveAspectRatio: "none",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: wavePathV(w, h, w * 0.11, h * 0.5, w * 0.34),
      fill: "none",
      stroke: "rgba(255,255,255,.62)",
      strokeWidth: Math.max(2, w * 0.05),
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: wavePathV(w, h, w * 0.09, h * 0.42, w * 0.64),
      fill: "none",
      stroke: "rgba(255,255,255,.38)",
      strokeWidth: Math.max(1.5, w * 0.04),
      strokeLinecap: "round"
    })))) : /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '200%',
        height: '100%',
        display: 'flex',
        animation: 'gjwWaveShift 2.4s linear infinite'
      }
    }, [0, 1].map(k => /*#__PURE__*/React.createElement("svg", {
      key: k,
      width: "50%",
      height: h,
      viewBox: `0 0 ${w} ${h}`,
      preserveAspectRatio: "none",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: wavePath(w, h, h * 0.1, w * 0.5, h * 0.32),
      fill: "none",
      stroke: "rgba(255,255,255,.65)",
      strokeWidth: Math.max(2, h * 0.05),
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: wavePath(w, h, h * 0.08, w * 0.42, h * 0.62),
      fill: "none",
      stroke: "rgba(255,255,255,.4)",
      strokeWidth: Math.max(1.5, h * 0.04),
      strokeLinecap: "round"
    }))))));
  }

  // Board with ONE continuous water stream that flows along the CURRENT GRAVITY
  // direction (default ↓) and never changes. Cells are rounded SQUARES.
  // `lane` = fixed line index (col when vertical, row when horizontal);
  // `start` = source position on the moving axis; `len` = flow cells after source.
  function StreamBoard({
    cols = 9,
    rows = 9,
    cell = 34,
    gap = 4,
    pad = 9,
    dir = '↓',
    lane = 4,
    start = 1,
    len = 0,
    newTip = false,
    broken = false,
    fadeFlow = false,
    splash = null,
    jelly = [],
    ghost = [],
    bracket = null
  }) {
    const stride = cell + gap;
    const vertical = dir === '↓' || dir === '↑';
    const W = pad * 2 + cols * cell + (cols - 1) * gap;
    const H = pad * 2 + rows * cell + (rows - 1) * gap;
    const cx = c => pad + c * stride + cell / 2;
    const cy = r => pad + r * stride + cell / 2;
    const cellR = Math.round(cell * 0.24);
    // center of a cell at moving-axis index p
    const px = p => vertical ? cx(lane) : cx(p);
    const py = p => vertical ? cy(p) : cy(lane);
    const total = len + 1;
    const L = total * cell + (total - 1) * gap + cell * 0.06;
    const cross = cell * 0.86;
    const ribStyle = vertical ? {
      left: cx(lane) - cross / 2,
      top: pad + start * stride - cell * 0.03,
      width: cross,
      height: L
    } : {
      left: pad + start * stride - cell * 0.03,
      top: cy(lane) - cross / 2,
      width: L,
      height: cross
    };
    const tip = start + len;
    // leading (downstream) edge point of the stream
    const lead = {
      '↓': {
        x: px(tip),
        y: py(tip) + cell * 0.36
      },
      '↑': {
        x: px(tip),
        y: py(tip) - cell * 0.36
      },
      '→': {
        x: px(tip) + cell * 0.36,
        y: py(tip)
      },
      '←': {
        x: px(tip) - cell * 0.36,
        y: py(tip)
      }
    }[dir];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridAutoRows: `${cell}px`,
        gap,
        padding: pad,
        background: 'var(--color-surface-sunken)',
        borderRadius: 16,
        boxShadow: 'inset 0 2px 6px rgba(120,92,52,.12)'
      }
    }, Array.from({
      length: cols * rows
    }).map((_, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderRadius: cellR,
        background: 'var(--color-cell-empty)',
        boxShadow: 'inset 0 0 0 1px var(--color-cell-line)'
      }
    }))), len > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        ...ribStyle,
        opacity: fadeFlow ? 0.3 : 1,
        transition: 'opacity .3s'
      }
    }, /*#__PURE__*/React.createElement(WaterRibbon, {
      w: ribStyle.width,
      h: ribStyle.height,
      radius: cellR,
      tone: broken ? 'dry' : 'live',
      vertical: vertical
    })), len > 0 && !broken && Array.from({
      length: len
    }).map((_, k) => /*#__PURE__*/React.createElement("span", {
      key: 'a' + k,
      style: {
        position: 'absolute',
        left: px(start + 1 + k) - cell * 0.22,
        top: py(start + 1 + k) - cell * 0.22,
        zIndex: 3
      }
    }, /*#__PURE__*/React.createElement(Arrow, {
      dir: dir,
      size: cell * 0.44,
      color: "#fff",
      sw: 3,
      className: "gjw-arr"
    }))), len > 0 && !broken && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: lead.x - cell * 0.08,
        top: lead.y - cell * 0.08,
        width: cell * 0.16,
        height: cell * 0.16,
        borderRadius: '50%',
        background: AQ.foam,
        zIndex: 3
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: lead.x + cell * 0.06,
        top: lead.y + cell * 0.05,
        width: cell * 0.1,
        height: cell * 0.1,
        borderRadius: '50%',
        background: AQ.foam,
        opacity: .8,
        zIndex: 3
      }
    })), len > 0 && newTip && !broken && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: px(tip) - cell * 0.55,
        top: py(tip) - cell * 0.55,
        width: cell * 1.1,
        height: cell * 1.1,
        borderRadius: cellR * 1.4,
        boxShadow: `0 0 0 2px ${AQ.foam}, 0 0 16px 4px rgba(95,210,214,.9)`,
        animation: 'gjwTipGlow 1.4s ease infinite',
        pointerEvents: 'none',
        zIndex: 4
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: cell * 0.42,
      height: cell * 0.42,
      viewBox: "0 0 24 24",
      style: {
        position: 'absolute',
        top: -cell * 0.14,
        right: -cell * 0.06,
        animation: 'gjwSpark 1.4s ease infinite'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 0c1 6 4 9 12 12-8 3-11 6-12 12-1-6-4-9-12-12 8-3 11-6 12-12z",
      fill: AQ.foam
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: px(start),
        top: py(start),
        transform: 'translate(-50%,-50%)',
        zIndex: 5
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: cell * 0.94,
        height: cell * 0.94
      }
    }, broken ? /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        borderRadius: cellR,
        background: 'radial-gradient(circle at 50% 45%, #9C8E77 0%, #8A7E68 100%)',
        boxShadow: 'inset 0 1px 3px rgba(74,53,38,.5)'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "100%",
      height: "100%",
      viewBox: "0 0 40 40",
      style: {
        position: 'absolute',
        inset: 0
      },
      fill: "none",
      stroke: AQ.dryDark,
      strokeWidth: "2",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20 20 L9 10 M20 20 L31 12 M20 20 L15 33 M20 20 L30 30",
      opacity: ".7"
    }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "gjw-src",
      style: {
        width: '100%',
        height: '100%',
        borderRadius: cellR,
        background: `radial-gradient(circle at 50% 42%, ${AQ.core} 0%, ${AQ.mid} 44%, ${AQ.deep} 100%)`,
        boxShadow: `0 0 0 3px ${AQ.core}, 0 0 14px 3px rgba(47,191,199,.7)`,
        animation: 'gjwSource 1.9s var(--ease-inout,ease) infinite'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '66%',
        height: '66%',
        transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,.55)',
        animation: 'gjwRing 2s ease infinite'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '32%',
        height: '32%',
        transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${AQ.core} 0%, ${AQ.light} 80%)`
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -cell * 0.18,
        right: -cell * 0.18,
        width: cell * 0.5,
        height: cell * 0.5,
        borderRadius: '50%',
        background: broken ? '#EDE5D8' : '#fff',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: broken ? 0.85 : 1
      }
    }, broken ? /*#__PURE__*/React.createElement("svg", {
      width: cell * 0.32,
      height: cell * 0.32,
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2.5C12 2.5 4.5 11.4 4.5 16.2A7.5 7.5 0 0 0 19.5 16.2C19.5 11.4 12 2.5 12 2.5Z",
      fill: "#D9CFBE",
      stroke: AQ.dryEdge,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 5 L11 12 L13.5 12 L11.5 19",
      fill: "none",
      stroke: AQ.dryDark,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })) : /*#__PURE__*/React.createElement(Drop, {
      size: cell * 0.34
    })))), ghost.map((g, i) => /*#__PURE__*/React.createElement("span", {
      key: 'g' + i,
      style: {
        position: 'absolute',
        left: px(g.pos),
        top: py(g.pos),
        transform: 'translate(-50%,-50%)',
        opacity: 0.28,
        zIndex: 6
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: g.color,
      size: cell * 0.96,
      direction: "down",
      showEyes: false
    }))), jelly.map((j, i) => /*#__PURE__*/React.createElement("span", {
      key: 'j' + i,
      style: {
        position: 'absolute',
        left: px(j.pos),
        top: py(j.pos),
        transform: 'translate(-50%,-50%)',
        zIndex: 7
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: j.color,
      size: cell * 0.96,
      direction: "down",
      expression: "focus"
    }))), bracket && (vertical ? /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: px(bracket[0]) - cell * 0.72,
        top: py(bracket[0]) - cell * 0.5,
        width: cell * 0.18,
        height: (bracket[1] - bracket[0]) * stride + cell,
        borderLeft: `3px solid ${AQ.deep}`,
        borderTop: `3px solid ${AQ.deep}`,
        borderBottom: `3px solid ${AQ.deep}`,
        borderRadius: '7px 0 0 7px',
        zIndex: 8
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: px(bracket[0]) - cell * 0.5,
        top: py(bracket[0]) - cell * 0.72,
        width: (bracket[1] - bracket[0]) * stride + cell,
        height: cell * 0.18,
        borderTop: `3px solid ${AQ.deep}`,
        borderLeft: `3px solid ${AQ.deep}`,
        borderRight: `3px solid ${AQ.deep}`,
        borderRadius: '7px 7px 0 0',
        zIndex: 8
      }
    })), splash && /*#__PURE__*/React.createElement("svg", {
      width: cell * 2.6,
      height: cell * 2.6,
      viewBox: "0 0 60 60",
      style: {
        position: 'absolute',
        left: cx(splash[1]) - cell * 1.3,
        top: cy(splash[0]) - cell * 1.3,
        pointerEvents: 'none',
        zIndex: 9
      }
    }, [0, 60, 120, 180, 240, 300].map(a => {
      const rad = a * Math.PI / 180;
      return /*#__PURE__*/React.createElement("circle", {
        key: a,
        cx: 30 + Math.cos(rad) * 18,
        cy: 30 + Math.sin(rad) * 18,
        r: a % 120 === 0 ? 3.6 : 2.6,
        fill: AQ.mid,
        opacity: ".85"
      });
    })));
  }

  // Water that follows an ORTHOGONAL PATH: it keeps falling with gravity, and
  // only when the cell below is blocked does it detour one cell left/right, then
  // resume falling. `path` = ordered cells [[r,c],…] (source first). Connected
  // square water tiles bend at each elbow.
  function StreamPath({
    cols = 9,
    rows = 9,
    cell = 30,
    gap = 4,
    pad = 9,
    path = [],
    blocks = [],
    jelly = [],
    newTip = false,
    splash = null
  }) {
    const stride = cell + gap;
    const W = pad * 2 + cols * cell + (cols - 1) * gap;
    const H = pad * 2 + rows * cell + (rows - 1) * gap;
    const cx = c => pad + c * stride + cell / 2;
    const cy = r => pad + r * stride + cell / 2;
    const cellR = Math.round(cell * 0.24);
    const wsz = cell * 0.84;
    const segDir = (a, b) => b[1] > a[1] ? '→' : b[1] < a[1] ? '←' : b[0] > a[0] ? '↓' : '↑';
    const cross = cell * 0.84;
    const dPath = path.length ? 'M' + path.map(p => `${cx(p[1])} ${cy(p[0])}`).join(' L') : '';
    const gid = 'gjw-grad-' + path.map(p => p.join('')).join('_');
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridAutoRows: `${cell}px`,
        gap,
        padding: pad,
        background: 'var(--color-surface-sunken)',
        borderRadius: 16,
        boxShadow: 'inset 0 2px 6px rgba(120,92,52,.12)'
      }
    }, Array.from({
      length: cols * rows
    }).map((_, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderRadius: cellR,
        background: 'var(--color-cell-empty)',
        boxShadow: 'inset 0 0 0 1px var(--color-cell-line)'
      }
    }))), dPath && /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: gid,
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: AQ.light
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.55",
      stopColor: AQ.mid
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: AQ.teal
    }))), /*#__PURE__*/React.createElement("path", {
      d: dPath,
      fill: "none",
      stroke: AQ.core,
      strokeWidth: cross + 4,
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: dPath,
      fill: "none",
      stroke: `url(#${gid})`,
      strokeWidth: cross,
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: dPath,
      fill: "none",
      stroke: "rgba(255,255,255,.5)",
      strokeWidth: cross * 0.42,
      strokeLinejoin: "round",
      strokeLinecap: "round",
      opacity: ".35"
    }), /*#__PURE__*/React.createElement("path", {
      d: dPath,
      fill: "none",
      stroke: "rgba(255,255,255,.7)",
      strokeWidth: cross * 0.14,
      strokeLinejoin: "round",
      strokeLinecap: "round",
      strokeDasharray: `${cell * 0.5} ${cell * 0.65}`,
      style: {
        animation: 'gjwDash 1.1s linear infinite'
      }
    }), /*#__PURE__*/React.createElement("path", {
      d: dPath,
      fill: "none",
      stroke: "rgba(255,255,255,.4)",
      strokeWidth: cross * 0.09,
      strokeLinejoin: "round",
      strokeLinecap: "round",
      strokeDasharray: `${cell * 0.35} ${cell * 0.85}`,
      style: {
        animation: 'gjwDash 1.7s linear infinite'
      }
    })), blocks.map((bl, i) => /*#__PURE__*/React.createElement("span", {
      key: 'bl' + i,
      style: {
        position: 'absolute',
        left: cx(bl.pos[1]),
        top: cy(bl.pos[0]),
        transform: 'translate(-50%,-50%)',
        zIndex: 6
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: bl.color || 'stone',
      size: cell * 0.96,
      direction: "down",
      showEyes: bl.color !== 'stone'
    }))), path.slice(1).map((p, i) => {
      const idx = i + 1;
      const dir = idx < path.length - 1 ? segDir(path[idx], path[idx + 1]) : segDir(path[idx - 1], path[idx]);
      const isNew = newTip && idx === path.length - 1;
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: 'a' + idx
      }, isNew && /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: cx(p[1]) - cell * 0.55,
          top: cy(p[0]) - cell * 0.55,
          width: cell * 1.1,
          height: cell * 1.1,
          borderRadius: cellR * 1.4,
          boxShadow: `0 0 0 2px ${AQ.foam}, 0 0 14px 3px rgba(95,210,214,.85)`,
          animation: 'gjwTipGlow 1.4s ease infinite',
          pointerEvents: 'none',
          zIndex: 4
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: cx(p[1]),
          top: cy(p[0]),
          transform: 'translate(-50%,-50%)',
          zIndex: 4
        }
      }, /*#__PURE__*/React.createElement(Arrow, {
        dir: dir,
        size: cell * 0.42,
        color: "#fff",
        sw: 3,
        className: "gjw-arr"
      })), isNew && /*#__PURE__*/React.createElement("svg", {
        width: cell * 0.36,
        height: cell * 0.36,
        viewBox: "0 0 24 24",
        style: {
          position: 'absolute',
          left: cx(p[1]) + cell * 0.2,
          top: cy(p[0]) - cell * 0.5,
          animation: 'gjwSpark 1.4s ease infinite',
          zIndex: 4
        }
      }, /*#__PURE__*/React.createElement("path", {
        d: "M12 0c1 6 4 9 12 12-8 3-11 6-12 12-1-6-4-9-12-12 8-3 11-6 12-12z",
        fill: AQ.foam
      })));
    }), path.length > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: cx(path[0][1]),
        top: cy(path[0][0]),
        transform: 'translate(-50%,-50%)',
        zIndex: 5
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: cell * 0.94,
        height: cell * 0.94
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "gjw-src",
      style: {
        width: '100%',
        height: '100%',
        borderRadius: cellR,
        background: `radial-gradient(circle at 50% 42%, ${AQ.core} 0%, ${AQ.mid} 44%, ${AQ.deep} 100%)`,
        boxShadow: `0 0 0 3px ${AQ.core}, 0 0 14px 3px rgba(47,191,199,.7)`,
        animation: 'gjwSource 1.9s var(--ease-inout,ease) infinite'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '66%',
        height: '66%',
        transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,.55)',
        animation: 'gjwRing 2s ease infinite'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '32%',
        height: '32%',
        transform: 'translate(-50%,-50%)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${AQ.core} 0%, ${AQ.light} 80%)`
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -cell * 0.18,
        right: -cell * 0.18,
        width: cell * 0.5,
        height: cell * 0.5,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Drop, {
      size: cell * 0.34
    })))), jelly.map((j, i) => /*#__PURE__*/React.createElement("span", {
      key: 'j' + i,
      style: {
        position: 'absolute',
        left: cx(j.pos[1]),
        top: cy(j.pos[0]),
        transform: 'translate(-50%,-50%)',
        zIndex: 7
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: j.color,
      size: cell * 0.96,
      direction: "down",
      expression: "focus"
    }))), splash && /*#__PURE__*/React.createElement("svg", {
      width: cell * 2.4,
      height: cell * 2.4,
      viewBox: "0 0 60 60",
      style: {
        position: 'absolute',
        left: cx(splash[1]) - cell * 1.2,
        top: cy(splash[0]) - cell * 1.2,
        pointerEvents: 'none',
        zIndex: 9
      }
    }, [0, 60, 120, 180, 240, 300].map(a => {
      const r = a * Math.PI / 180;
      return /*#__PURE__*/React.createElement("circle", {
        key: a,
        cx: 30 + Math.cos(r) * 17,
        cy: 30 + Math.sin(r) * 17,
        r: a % 120 === 0 ? 3.4 : 2.4,
        fill: AQ.mid,
        opacity: ".85"
      });
    })));
  }

  /* =================== SHEET 2b — state flow (continuous stream) =================== */
  function StreamFrame({
    n,
    label,
    len,
    newTip,
    broken,
    fadeFlow,
    splash,
    cell
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9
      }
    }, /*#__PURE__*/React.createElement(StepChip, {
      n: n
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.d,
        fontWeight: 700,
        fontSize: 16,
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, label)), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-surface)',
        borderRadius: 20,
        boxShadow: 'var(--shadow-md)',
        padding: 12
      }
    }, /*#__PURE__*/React.createElement(StreamBoard, {
      cell: cell,
      dir: "\u2193",
      lane: 4,
      start: 1,
      len: len,
      newTip: newTip,
      broken: broken,
      fadeFlow: fadeFlow,
      splash: splash
    })));
  }
  function GravityPill() {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 14px 7px 10px',
        borderRadius: 999,
        background: `color-mix(in srgb, ${PURPLE} 14%, #fff)`,
        boxShadow: 'var(--shadow-sm)',
        alignSelf: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 8,
        background: `linear-gradient(160deg, ${PURPLE_SHINE}, ${PURPLE})`,
        boxShadow: `inset 0 -2px 0 ${PURPLE_EDGE}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Arrow, {
      dir: "\u2193",
      size: 16,
      color: "#fff",
      sw: 3.2
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.b,
        fontWeight: 800,
        fontSize: 13,
        color: PURPLE_EDGE,
        letterSpacing: '.01em'
      }
    }, "N\u01B0\u1EDBc ch\u1EA3y theo tr\u1ECDng l\u1EF1c \u2193 \xB7 kh\xF4ng \u0111\u1ED5i h\u01B0\u1EDBng"));
  }
  function StreamFlowSheet() {
    const cell = 30;
    return /*#__PURE__*/React.createElement(SheetShell, {
      w: 1620
    }, /*#__PURE__*/React.createElement(SheetHead, {
      title: "STATE FLOW \u2014 NGU\u1ED2N N\u01AF\u1EDAC M\u1ECCC D\u1EA6N",
      subtitle: "M\u1ED7i l\u01B0\u1EE3t t\u1EA1o th\xEAm 1 \xF4 \u2014 d\xF2ng ch\u1EA3y n\u1ED1i li\u1EC1n th\xE0nh m\u1ED9t d\u1EA3i n\u01B0\u1EDBc"
    }), /*#__PURE__*/React.createElement(GravityPill, null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
      }
    }, [{
      n: 1,
      label: 'Khởi tạo',
      len: 0
    }, {
      n: 2,
      label: 'Sau 1 lượt',
      len: 1,
      newTip: true
    }, {
      n: 3,
      label: 'Sau 2 lượt',
      len: 2,
      newTip: true
    }, {
      n: 4,
      label: 'Sau 3 lượt',
      len: 3,
      newTip: true
    }].map((fr, i) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: fr.n
    }, /*#__PURE__*/React.createElement(StreamFrame, _extends({}, fr, {
      cell: cell
    })), i < 3 && /*#__PURE__*/React.createElement(Arrow, {
      dir: "\u2192",
      size: 26,
      color: AQ.deep,
      sw: 3.4,
      className: "gjw-arr"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '0.9fr 1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--color-surface)',
        borderRadius: 20,
        boxShadow: 'var(--shadow-md)',
        padding: '16px 16px 14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        alignSelf: 'stretch'
      }
    }, /*#__PURE__*/React.createElement(StepChip, {
      n: 5,
      tone: AQ.deep
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.d,
        fontWeight: 700,
        fontSize: 16,
        color: 'var(--color-text)'
      }
    }, "Ph\xE1 ngu\u1ED3n")), /*#__PURE__*/React.createElement(StreamBoard, {
      cell: 26,
      dir: "\u2193",
      lane: 4,
      start: 1,
      len: 3,
      broken: true,
      fadeFlow: true,
      splash: [1, 4]
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: font.b,
        fontWeight: 700,
        fontSize: 12.5,
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        lineHeight: 1.35,
        maxWidth: 220
      }
    }, "Clear qua \xF4 gi\u1ECDt n\u01B0\u1EDBc \u1EDF ngu\u1ED3n \u2192 ngu\u1ED3n kh\xF4, c\u1EA3 d\u1EA3i n\u01B0\u1EDBc t\u1EAFt.")), /*#__PURE__*/React.createElement(Card, {
      title: "A \xB7 Jelly b\u1ECB \u0111\u1EA9y 1 \xF4",
      note: "Jelly \u0111\u1EE9ng tr\xEAn d\xF2ng n\u01B0\u1EDBc b\u1ECB \u0111\u1EA9y 1 \xF4 theo tr\u1ECDng l\u1EF1c \u2193",
      style: {
        justifyContent: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(StreamBoard, {
      cell: 28,
      cols: 7,
      rows: 7,
      dir: "\u2193",
      lane: 3,
      start: 0,
      len: 4,
      jelly: [{
        color: 'pink',
        pos: 4
      }],
      ghost: [{
        color: 'pink',
        pos: 3
      }]
    })), /*#__PURE__*/React.createElement(Card, {
      title: "B \xB7 C\u1EE5m jelly b\u1ECB \u0111\u1EA9y",
      note: "C\u1EE5m jelly d\xEDnh nhau tr\xF4i c\xF9ng nhau theo d\u1EA3i n\u01B0\u1EDBc",
      style: {
        justifyContent: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(StreamBoard, {
      cell: 28,
      cols: 7,
      rows: 7,
      dir: "\u2193",
      lane: 3,
      start: 0,
      len: 5,
      jelly: [{
        color: 'mint',
        pos: 3
      }, {
        color: 'yellow',
        pos: 4
      }, {
        color: 'blue',
        pos: 5
      }],
      ghost: [{
        color: 'mint',
        pos: 2
      }, {
        color: 'yellow',
        pos: 3
      }, {
        color: 'blue',
        pos: 4
      }],
      bracket: [3, 5]
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        background: 'var(--color-surface)',
        borderRadius: 22,
        boxShadow: 'var(--shadow-md)',
        padding: '18px 20px 20px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 10,
        background: `linear-gradient(160deg, ${AQ.mid}, ${AQ.deep})`,
        boxShadow: `0 0 0 2px ${AQ.core}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Drop, {
      size: 19,
      fill: "#fff",
      stroke: AQ.pale
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontFamily: font.d,
        fontWeight: 700,
        fontSize: 21,
        color: 'var(--color-text)',
        lineHeight: 1.05
      }
    }, "N\u01B0\u1EDBc g\u1EB7p v\u1EADt c\u1EA3n \u2014 lu\xF4n t\xECm \u0111\u01B0\u1EDDng xu\u1ED1ng"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '3px 0 0',
        fontFamily: font.b,
        fontWeight: 700,
        fontSize: 13,
        color: AQ.deep
      }
    }, "\xD4 d\u01B0\u1EDBi b\u1ECB ch\u1EB7n \u2192 r\u1EBD ngang 1 \xF4 r\u1ED3i ch\u1EA3y xu\u1ED1ng ti\u1EBFp, mi\u1EC5n l\xE0 c\xF2n \xF4 tr\u1ED1ng."))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(ObstaclePanel, {
      n: 1,
      title: "C\xF2n \xF4 tr\u1ED1ng",
      caption: "D\u01B0\u1EDBi ngu\u1ED3n c\xF2n \xF4 tr\u1ED1ng \u2192 n\u01B0\u1EDBc ch\u1EA3y th\u1EB3ng xu\u1ED1ng theo tr\u1ECDng l\u1EF1c."
    }, /*#__PURE__*/React.createElement(StreamPath, {
      cell: 26,
      cols: 7,
      rows: 8,
      path: [[1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3]],
      newTip: true
    })), /*#__PURE__*/React.createElement(ObstaclePanel, {
      n: 2,
      title: "B\u1ECB ch\u1EB7n \u2192 r\u1EBD ngang",
      caption: "G\u1EB7p block ch\u1EB7n ngay d\u01B0\u1EDBi \u2192 d\xF2ng ch\u1EA3y r\u1EBD sang 1 b\xEAn c\xF2n tr\u1ED1ng."
    }, /*#__PURE__*/React.createElement(StreamPath, {
      cell: 26,
      cols: 7,
      rows: 8,
      path: [[1, 3], [2, 3], [3, 3], [3, 4], [4, 4]],
      blocks: [{
        pos: [4, 3],
        color: 'stone'
      }, {
        pos: [5, 3],
        color: 'blue'
      }],
      newTip: true
    })), /*#__PURE__*/React.createElement(ObstaclePanel, {
      n: 3,
      title: "Ch\xE8n s\xE1t t\u01B0\u1EDDng \u2192 v\xF2ng r\u1ED3i xu\u1ED1ng",
      caption: "Block x\u1EBFp ch\u1ED3ng s\xE1t t\u01B0\u1EDDng, h\u1EBFt \xF4 \u0111\u1EA9y \u2192 r\u1EBD tr\xE1i r\u1ED3i ti\u1EBFp t\u1EE5c ch\u1EA3y xu\u1ED1ng."
    }, /*#__PURE__*/React.createElement(StreamPath, {
      cell: 26,
      cols: 7,
      rows: 8,
      path: [[1, 5], [2, 5], [3, 5], [3, 4], [4, 4], [5, 4], [6, 4]],
      blocks: [{
        pos: [4, 5],
        color: 'stone'
      }, {
        pos: [5, 5],
        color: 'stone'
      }, {
        pos: [4, 6],
        color: 'pink'
      }, {
        pos: [5, 6],
        color: 'yellow'
      }],
      newTip: true
    })))), /*#__PURE__*/React.createElement(Legend, {
      items: [{
        swatch: sw.source,
        k: 'Ô nguồn nước',
        v: '= sinh dòng chảy'
      }, {
        swatch: sw.flow,
        k: 'Ô dòng chảy',
        v: '= đẩy jelly 1 ô'
      }, {
        swatch: sw.drop,
        k: 'Ô giọt nước',
        v: '= clear để phá nguồn'
      }, {
        swatch: sw.broken,
        k: 'Phá nguồn',
        v: '= tắt toàn bộ dòng chảy'
      }]
    }));
  }

  /* =================== dispatch =================== */

  function render(id, rootEl) {
    const map = {
      components: ComponentSheet,
      stateflow: StateFlowSheet,
      streamflow: StreamFlowSheet,
      tutorial: TutorialSheet
    };
    const Fn = map[id];
    if (!Fn) {
      rootEl.innerHTML = '<p style="font-family:sans-serif;padding:20px">Unknown sheet: ' + id + '</p>';
      return;
    }
    ReactDOM.createRoot(rootEl).render(/*#__PURE__*/React.createElement(Fn, null));
  }
  window.GJWater = {
    render,
    WaterCell,
    WaterBoard,
    WaterStrip,
    Drop
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "07-mechanics/world3-water-kit.jsx", error: String((e && e.message) || e) }); }

// 08-brand/gravity-jelly-logo.js
try { (() => {
/* gravity-jelly-logo.js — single source of truth for the brand mark.
   Pure SVG-string builders (no React, no fonts) so the SAME art renders on
   the brand board AND rasterizes to Android PNGs via canvas.
   Mark = a CLUSTER of four cookie-outlined jelly blocks (yellow behind top,
   mint + blue behind bottom, big pink hero block with a kawaii face in front)
   wrapped by a chunky purple gravity-rotate loop (two-arrow refresh) on a warm
   cream background with a few sparkle dots. Exposes window.GJLogo. */

(function () {
  const COL = {
    yellow: {
      fill: '#FFE3A3',
      edge: '#E8B85C',
      shine: '#FFF1CE'
    },
    mint: {
      fill: '#A3E5D9',
      edge: '#5FC3B2',
      shine: '#CBF2EB'
    },
    pink: {
      fill: '#F7A9C0',
      edge: '#E576A0',
      shine: '#FBD0DF'
    },
    blue: {
      fill: '#B3C7F7',
      edge: '#7E9CE8',
      shine: '#D6E1FB'
    }
  };
  const GRAV = {
    fill: '#7E6CF0',
    edge: '#6353D6',
    shine: '#A99CF6'
  };
  const OUTLINE = '#4A3222'; // dark chocolate cookie-outline on every block + the loop
  const INK = '#3B2A1C'; // eye pupils

  // brand corner stickers (same motifs as JellyBlock): star / leaf / heart / droplet
  const STICKER = {
    yellow: 'M12 2.4l2.7 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.4 6.3 19.5l1.4-6.3L2.9 8.9l6.4-.6z',
    mint: 'M5 19c0-8 6-14 14-14 0 8-6 14-14 14zm3.5-3.5C13 14 16 11 17 7',
    pink: 'M12 20.7l-1.5-1.4C5.4 14.6 2 11.5 2 7.8 2 5.1 4.1 3 6.8 3 8.3 3 9.8 3.8 12 6 14.2 3.8 15.7 3 17.2 3 19.9 3 22 5.1 22 7.8c0 3.7-3.4 6.8-8.5 11.5z',
    blue: 'M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z'
  };

  // background gradients — warm-first to match the cream game UI
  const COLORWAYS = {
    cream: ['#FFFEFB', '#FFF7EC', '#F4E7D2'],
    sky: ['#C6E4FF', '#8FC2F6', '#73AEEF'],
    mint: ['#CFF3EA', '#94E2D2', '#74D2BE'],
    coral: ['#FFE0BC', '#FFB07A', '#FF9F68'],
    bubblegum: ['#FFD7E7', '#FBAFC8', '#F49EBC']
  };
  const PRIMARY_CW = 'cream';
  const HERO = 'pink';

  // per-colorway accents: on the warm cream bg the gravity swoosh + sparkles go
  // colored (white would vanish); on saturated bgs they stay crisp white.
  const THEME = {
    cream: {
      arc: '#7E6CF0',
      spark: '#FFB84D',
      ring: '#F0DFC4',
      ringOp: 0.6
    },
    sky: {
      arc: '#FFFFFF',
      spark: '#FFFFFF',
      haloOp: [0.20, 0.22]
    },
    mint: {
      arc: '#FFFFFF',
      spark: '#FFFFFF',
      haloOp: [0.20, 0.22]
    },
    coral: {
      arc: '#FFFFFF',
      spark: '#FFFFFF',
      haloOp: [0.20, 0.22]
    },
    bubblegum: {
      arc: '#FFFFFF',
      spark: '#FFFFFF',
      haloOp: [0.20, 0.22]
    }
  };

  /* the cute hero jelly block, centred in a `box` square, side = box*scale */
  function heroBlock(box, name, scale, mono) {
    const s = box * scale;
    const x = (box - s) / 2,
      y = (box - s) / 2 + box * 0.012;
    const c = COL[name];
    const sw = Math.max(3, s * 0.072);
    const r = s * 0.3;
    const ix = x + sw / 2,
      iy = y + sw / 2,
      is = s - sw;
    const cx = x + s / 2;
    if (mono) {
      return `<rect x="${ix.toFixed(2)}" y="${iy.toFixed(2)}" width="${is.toFixed(2)}" height="${is.toFixed(2)}" rx="${r.toFixed(2)}" ry="${r.toFixed(2)}" fill="#fff"/>`;
    }
    // face geometry
    const eyeY = y + s * 0.5;
    const eyeDX = s * 0.205,
      eyeR = s * 0.135,
      pupR = s * 0.082;
    const eye = ex => {
      const px = ex,
        py = eyeY + s * 0.012;
      return `<circle cx="${ex}" cy="${eyeY}" r="${eyeR}" fill="#fff"/>` + `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${pupR}" fill="${INK}"/>` + `<circle cx="${(px - pupR * 0.42).toFixed(2)}" cy="${(py - pupR * 0.5).toFixed(2)}" r="${(pupR * 0.42).toFixed(2)}" fill="#fff"/>`; // sparkle
    };
    const cheek = chx => `<ellipse cx="${chx}" cy="${(eyeY + s * 0.18).toFixed(2)}" rx="${(s * 0.075).toFixed(2)}" ry="${(s * 0.048).toFixed(2)}" fill="#FF9DB0" opacity="0.32"/>`;
    // brand corner sticker (heart for pink, etc.)
    const stk = STICKER[name];
    let sticker = '';
    if (stk) {
      const hs = s * 0.34;
      const sx = x + s - hs - s * 0.05,
        sy = y + s * 0.05;
      const stroked = name === 'mint';
      sticker = `<g transform="translate(${sx.toFixed(2)} ${sy.toFixed(2)}) rotate(-12 ${(hs / 2).toFixed(2)} ${(hs / 2).toFixed(2)}) scale(${(hs / 24).toFixed(4)})">` + `<path d="${stk}" fill="${stroked ? 'none' : c.shine}" stroke="${c.edge}" stroke-width="${stroked ? 2.2 : 1.6}" stroke-linejoin="round" stroke-linecap="round"/>` + `</g>`;
    }
    return `<g>` + `<rect x="${ix.toFixed(2)}" y="${iy.toFixed(2)}" width="${is.toFixed(2)}" height="${is.toFixed(2)}" rx="${r.toFixed(2)}" ry="${r.toFixed(2)}" fill="${c.fill}" stroke="${c.edge}" stroke-width="${sw.toFixed(2)}"/>` + `<ellipse cx="${cx}" cy="${(y + s * 0.25).toFixed(2)}" rx="${(s * 0.32).toFixed(2)}" ry="${(s * 0.14).toFixed(2)}" fill="${c.shine}" opacity="0.95"/>` + eye(cx - eyeDX) + eye(cx + eyeDX) + sticker + `</g>`;
  }

  /* small white gravity-rotate accent arc + arrowhead, hugging the block */
  function rotateAccent(box, color, op) {
    const cx = box / 2,
      cy = box / 2;
    const R = box * 0.4,
      sw = box * 0.032;
    const startDeg = 320,
      sweepDeg = 150; // short arc over the top-right
    const a0 = startDeg * Math.PI / 180,
      a1 = (startDeg + sweepDeg) * Math.PI / 180;
    const x0 = cx + R * Math.cos(a0),
      y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1),
      y1 = cy + R * Math.sin(a1);
    const large = Math.abs(sweepDeg) > 180 ? 1 : 0;
    const arc = `<path d="M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"/>`;
    const tang = a1 + Math.PI / 2;
    const L = sw * 1.7,
      Wp = sw * 1.2,
      perp = tang + Math.PI / 2;
    const tipx = x1 + L * Math.cos(tang),
      tipy = y1 + L * Math.sin(tang);
    const bx = x1 - L * 0.5 * Math.cos(tang),
      by = y1 - L * 0.5 * Math.sin(tang);
    const head = `<polygon points="${tipx.toFixed(2)},${tipy.toFixed(2)} ${(bx + Wp * Math.cos(perp)).toFixed(2)},${(by + Wp * Math.sin(perp)).toFixed(2)} ${(bx - Wp * Math.cos(perp)).toFixed(2)},${(by - Wp * Math.sin(perp)).toFixed(2)}" fill="${color}" opacity="${op}"/>`;
    return arc + head;
  }
  function sparkle(cx, cy, r, op, color) {
    const k = r * 0.24;
    const pts = [[0, -r], [k, -k], [r, 0], [k, k], [0, r], [-k, k], [-r, 0], [-k, -k]].map(([dx, dy]) => `${(cx + dx).toFixed(1)},${(cy + dy).toFixed(1)}`).join(' ');
    return `<polygon points="${pts}" fill="${color || '#fff'}" opacity="${op}"/>`;
  }

  /* ── NEW MARK ──────────────────────────────────────────────────────────
     A cookie-outlined candy block (dark chocolate outline, colored bottom rim,
     lighter top face, glossy highlights). `face` adds the kawaii pink face. */
  function candyBlock(cx, cy, size, name, opts = {}) {
    const c = COL[name] || COL.pink;
    const half = size / 2;
    const x = cx - half,
      y = cy - half;
    const r = size * 0.28;
    const ow = size * 0.085; // chocolate outline width
    if (opts.mono) {
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" rx="${r.toFixed(2)}" ry="${r.toFixed(2)}" fill="#fff"/>`;
    }
    const inset = ow * 0.55;
    const rim = size * 0.09; // bottom colored rim thickness
    const fx = x + inset,
      fy = y + inset;
    const fw = size - inset * 2,
      fh = size - inset * 2 - rim;
    const fr = r * 0.9;
    let s = '';
    // base = darker edge color with chocolate outline
    s += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" rx="${r.toFixed(2)}" ry="${r.toFixed(2)}" fill="${c.edge}" stroke="${OUTLINE}" stroke-width="${ow.toFixed(2)}" stroke-linejoin="round"/>`;
    // top face (lighter) — leaves the edge colour peeking at the bottom as a rim
    s += `<rect x="${fx.toFixed(2)}" y="${fy.toFixed(2)}" width="${fw.toFixed(2)}" height="${fh.toFixed(2)}" rx="${fr.toFixed(2)}" ry="${fr.toFixed(2)}" fill="${c.fill}"/>`;
    // glossy highlights top-left
    s += `<ellipse cx="${(x + size * 0.34).toFixed(2)}" cy="${(y + size * 0.26).toFixed(2)}" rx="${(size * 0.2).toFixed(2)}" ry="${(size * 0.11).toFixed(2)}" fill="${c.shine}" opacity="0.9" transform="rotate(-18 ${(x + size * 0.34).toFixed(2)} ${(y + size * 0.26).toFixed(2)})"/>`;
    s += `<circle cx="${(x + size * 0.24).toFixed(2)}" cy="${(y + size * 0.2).toFixed(2)}" r="${(size * 0.045).toFixed(2)}" fill="#fff" opacity="0.85"/>`;
    if (opts.face) s += faceFor(cx, cy, size);
    return s;
  }

  /* kawaii face: two big glossy eyes + a soft smile, centred on the block */
  function faceFor(cx, cy, size) {
    const eyeDX = size * 0.185,
      eyeY = cy + size * 0.05;
    const eyeR = size * 0.13,
      pupR = size * 0.076;
    const eye = ex => {
      const py = eyeY + size * 0.01;
      return `<circle cx="${ex.toFixed(2)}" cy="${eyeY.toFixed(2)}" r="${eyeR.toFixed(2)}" fill="#fff" stroke="#F3C0D0" stroke-width="${(size * 0.012).toFixed(2)}"/>` + `<circle cx="${ex.toFixed(2)}" cy="${py.toFixed(2)}" r="${pupR.toFixed(2)}" fill="${INK}"/>` + `<circle cx="${(ex - pupR * 0.4).toFixed(2)}" cy="${(py - pupR * 0.5).toFixed(2)}" r="${(pupR * 0.4).toFixed(2)}" fill="#fff"/>`;
    };
    const my = eyeY + size * 0.185,
      mw = size * 0.09;
    const smile = `<path d="M ${(cx - mw).toFixed(2)} ${my.toFixed(2)} Q ${cx.toFixed(2)} ${(my + size * 0.06).toFixed(2)} ${(cx + mw).toFixed(2)} ${my.toFixed(2)}" fill="none" stroke="${INK}" stroke-width="${(size * 0.032).toFixed(2)}" stroke-linecap="round"/>`;
    return eye(cx - eyeDX) + eye(cx + eyeDX) + smile;
  }

  /* chunky purple gravity-rotate LOOP — two arrows (refresh) with chocolate
     outline, centred in a `box`-sized square. Returns {brown, color}. */
  function gravityLoop(box, opts = {}) {
    const cx = box / 2,
      cy = box / 2;
    const R = box * 0.338,
      sw = box * 0.076,
      ow = box * 0.021;
    const mono = !!opts.mono;
    const D = Math.PI / 180;
    const P = a => [cx + R * Math.cos(a * D), cy + R * Math.sin(a * D)];
    const arc = (a0, a1, w, col) => {
      const [x0, y0] = P(a0),
        [x1, y1] = P(a1);
      const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
      return `<path d="M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R.toFixed(2)} ${R.toFixed(2)} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}" fill="none" stroke="${col}" stroke-width="${w.toFixed(2)}" stroke-linecap="round"/>`;
    };
    const head = (ae, extra, col) => {
      const [ex, ey] = P(ae);
      const t = [-Math.sin(ae * D), Math.cos(ae * D)]; // tangent (clockwise)
      const p = [Math.cos(ae * D), Math.sin(ae * D)]; // outward normal
      const len = sw * 1.15 + extra,
        hw = sw * 0.98 + extra;
      const tip = [ex + t[0] * len, ey + t[1] * len];
      const b = [ex - t[0] * len * 0.15, ey - t[1] * len * 0.15];
      const l = [b[0] + p[0] * hw, b[1] + p[1] * hw];
      const rr = [b[0] - p[0] * hw, b[1] - p[1] * hw];
      return `<polygon points="${tip[0].toFixed(2)},${tip[1].toFixed(2)} ${l[0].toFixed(2)},${l[1].toFixed(2)} ${rr[0].toFixed(2)},${rr[1].toFixed(2)}" fill="${col}" stroke="${col}" stroke-width="${(sw * 0.001).toFixed(2)}" stroke-linejoin="round"/>`;
    };
    // top arc left→over-top→upper-right ; bottom arc right→under-bottom→lower-left
    const A1 = [192, 336],
      A2 = [12, 156];
    if (mono) {
      return arc(A1[0], A1[1], sw, '#fff') + arc(A2[0], A2[1], sw, '#fff') + head(A1[1], 0, '#fff') + head(A2[1], 0, '#fff');
    }
    const brownW = sw + ow * 2;
    const brown = arc(A1[0], A1[1], brownW, OUTLINE) + arc(A2[0], A2[1], brownW, OUTLINE) + head(A1[1], ow, OUTLINE) + head(A2[1], ow, OUTLINE);
    const color = arc(A1[0], A1[1], sw, GRAV.fill) + arc(A2[0], A2[1], sw, GRAV.fill) + head(A1[1], 0, GRAV.fill) + head(A2[1], 0, GRAV.fill)
    // top gloss along each arc
    + arc(A1[0] + 8, A1[1] - 30, sw * 0.26, GRAV.shine).replace('/>', ' opacity="0.7"/>') + arc(A2[0] + 8, A2[1] - 30, sw * 0.26, GRAV.shine).replace('/>', ' opacity="0.7"/>');
    return {
      brown,
      color
    };
  }
  function dot(cx, cy, r, col) {
    return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${col}"/>`;
  }

  /* the mark (dots · back blocks · gravity loop · front pink hero), box square */
  function markInner(box, opts = {}) {
    const mono = !!opts.mono;
    // cluster geometry (tuned in a 432 box, scales with `box`)
    const u = box / 432;
    const yellow = [216 * u, 114 * u, 150 * u];
    const mint = [104 * u, 302 * u, 150 * u];
    const blue = [328 * u, 302 * u, 150 * u];
    const pink = [216 * u, 234 * u, 214 * u];
    if (mono) {
      const loop = gravityLoop(box, {
        mono: true
      });
      return candyBlock(yellow[0], yellow[1], yellow[2], 'yellow', {
        mono: true
      }) + candyBlock(mint[0], mint[1], mint[2], 'mint', {
        mono: true
      }) + candyBlock(blue[0], blue[1], blue[2], 'blue', {
        mono: true
      }) + loop + candyBlock(pink[0], pink[1], pink[2], 'pink', {
        mono: true
      });
    }
    const loop = gravityLoop(box);
    const dots = dot(box * 0.11, box * 0.19, box * 0.02, '#FFCA66') + dot(box * 0.85, box * 0.28, box * 0.017, '#FFCA66') + dot(box * 0.09, box * 0.34, box * 0.016, '#F7A9C0');
    return dots + candyBlock(yellow[0], yellow[1], yellow[2], 'yellow') + candyBlock(mint[0], mint[1], mint[2], 'mint') + candyBlock(blue[0], blue[1], blue[2], 'blue') + loop.brown + loop.color + candyBlock(pink[0], pink[1], pink[2], 'pink', {
      face: true
    });
  }
  function wrap(size, inner, defs) {
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${defs || ''}${inner}</svg>`;
  }
  function bgGradDefs(id, colorway) {
    const c = COLORWAYS[colorway] || COLORWAYS[PRIMARY_CW];
    return `<defs><radialGradient id="${id}" cx="50%" cy="34%" r="80%"><stop offset="0" stop-color="${c[0]}"/><stop offset="0.6" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient></defs>`;
  }
  function bokeh(size) {
    return `<circle cx="${size * 0.19}" cy="${size * 0.83}" r="${size * 0.12}" fill="#fff" opacity="0.10"/><circle cx="${size * 0.85}" cy="${size * 0.18}" r="${size * 0.08}" fill="#fff" opacity="0.10"/>`;
  }

  // ── RASTER MASTER ─────────────────────────────────────────────────────
  // The official app icon is the supplied artwork (08-brand/app-icon-master.png).
  // These builders embed that PNG so the SAME art shows everywhere and
  // rasterises to Android PNGs — no procedural redraw. Path resolves relative
  // to the HTML document embedding it (the brand pages live in 08-brand/).
  const MASTER_IMG = 'app-icon-master.png';
  // TRANSPARENT MARK — supplied icon art with NO background (4 jelly blocks +
  // purple gravity loop). Drop straight onto any coloured ground (native splash,
  // adaptive foreground, monochrome silhouette). Near-square (~1.07:1).
  const MARK_IMG = 'mark.png';
  // <img> of the transparent mark, contained in a square `size` box.
  function markImg(size, opts = {}) {
    const src = opts.src || MARK_IMG;
    return `<img src="${src}" width="${size}" height="${size}" alt="Gravity Jelly" style="display:block;width:${size}px;height:${size}px;object-fit:contain;user-select:none" draggable="false"/>`;
  }
  // OFFICIAL WORDMARK — supplied "Gravity Jelly" lettering PNG (transparent bg,
  // stacked candy type). Single source of truth for the text logo everywhere.
  const WORDMARK_IMG = 'wordmark.png';
  const WORDMARK_AR = 1443 / 891; // natural width / height ≈ 1.62
  // <img> of the wordmark. Pass {height} or {width} (px); default fills container.
  // `src` lets callers point at the file from their own directory depth.
  function wordmarkImg(opts = {}) {
    const src = opts.src || WORDMARK_IMG;
    const box = opts.height != null ? `height:${opts.height}px;width:auto;` : opts.width != null ? `width:${opts.width}px;height:auto;` : 'width:100%;height:auto;';
    return `<img src="${src}" alt="Gravity Jelly" style="display:block;${box}user-select:none" draggable="false"/>`;
  }
  function imageSVG(size, rounding, href) {
    const r = rounding != null ? size * rounding : 0;
    const src = href || MASTER_IMG;
    return `<img src="${src}" width="${size}" height="${size}" alt="Gravity Jelly" style="display:block;width:${size}px;height:${size}px;object-fit:cover;border-radius:${r}px" draggable="false"/>`;
  }

  // adaptive FOREGROUND layer — the transparent mark (background is a separate layer)
  function foregroundSVG(size /*, opts */) {
    return markImg(size);
  }

  // adaptive BACKGROUND layer — cream gradient behind the master art
  function backgroundSVG(size, opts = {}) {
    const r = opts.rounding ? size * opts.rounding : 0;
    return wrap(size, `<rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#gjbg)"/>${bokeh(size)}`, bgGradDefs('gjbg', opts.colorway));
  }

  // composed icon — the supplied artwork; rounding = corner radius fraction
  function fullIconSVG(size, opts = {}) {
    return imageSVG(size, opts.rounding != null ? opts.rounding : 0);
  }

  // monochrome / themed slot — the transparent mark desaturated to a soft silhouette
  function monochromeSVG(size) {
    return `<img src="${MARK_IMG}" width="${size}" height="${size}" alt="Gravity Jelly mono" style="display:block;width:${size}px;height:${size}px;object-fit:contain;filter:grayscale(1) brightness(1.35) contrast(0.9)" draggable="false"/>`;
  }
  window.GJLogo = {
    COL,
    COLORWAYS,
    PRIMARY_CW,
    HERO,
    INK,
    MASTER_IMG,
    MARK_IMG,
    markImg,
    WORDMARK_IMG,
    WORDMARK_AR,
    wordmarkImg,
    heroBlock,
    markInner,
    imageSVG,
    foregroundSVG,
    backgroundSVG,
    fullIconSVG,
    monochromeSVG,
    wrap
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "08-brand/gravity-jelly-logo.js", error: String((e && e.message) || e) }); }

// prototypes/proto-engine.js
try { (() => {
/* proto-engine.js — pure gameplay logic shared by the Vine (W2) and Drop (W3)
   playable prototypes. Block-fit placement + gravity-rotate slide + cascade.
   No React here — everything hangs off window.GJProtoEngine. */
(function () {
  const N = 9;
  const DIRS = ['down', 'left', 'up', 'right']; // clockwise rotate order
  const COLORS = ['yellow', 'mint', 'pink', 'blue'];

  // tray shapes (normalized, origin 0,0): I3 horizontal, V3 vertical, O4 2x2, single
  const SHAPES = [{
    name: 'I3',
    cells: [[0, 0], [0, 1], [0, 2]]
  }, {
    name: 'V3',
    cells: [[0, 0], [1, 0], [2, 0]]
  }, {
    name: 'O4',
    cells: [[0, 0], [0, 1], [1, 0], [1, 1]]
  }, {
    name: 'ONE',
    cells: [[0, 0]]
  }];
  const uid = () => Math.random().toString(36).slice(2, 9);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const inb = (r, c) => r >= 0 && r < N && c >= 0 && c < N;
  const key = (r, c) => r + '-' + c;

  // seeded RNG (mulberry32) so trays are reproducible per prototype run
  function makeRng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function randomPiece(rng) {
    const s = SHAPES[Math.floor(rng() * SHAPES.length)];
    return {
      shape: s.name,
      cells: s.cells,
      color: COLORS[Math.floor(rng() * COLORS.length)]
    };
  }
  const newTray = rng => [randomPiece(rng), randomPiece(rng), randomPiece(rng)];

  // ---- grid helpers ----
  const emptyGrid = () => Array.from({
    length: N
  }, () => Array(N).fill(null));
  function cellsToGrid(cells) {
    const g = emptyGrid();
    cells.forEach(c => {
      if (inb(c.r, c.c)) g[c.r][c.c] = c;
    });
    return g;
  }
  function gridToCells(g) {
    const out = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (g[r][c]) {
        g[r][c].r = r;
        g[r][c].c = c;
        out.push(g[r][c]);
      }
    }
    return out;
  }
  function pieceExtent(piece) {
    const rs = piece.cells.map(p => p[0]);
    const cs = piece.cells.map(p => p[1]);
    return {
      h: Math.max(...rs) + 1,
      w: Math.max(...cs) + 1
    };
  }
  function canPlaceGrid(g, piece, ar, ac) {
    return piece.cells.every(([r, c]) => {
      const rr = ar + r,
        cc = ac + c;
      return inb(rr, cc) && !g[rr][cc];
    });
  }
  function canPlace(cells, piece, ar, ac) {
    return canPlaceGrid(cellsToGrid(cells), piece, ar, ac);
  }
  function existsPlacement(cells, piece) {
    const g = cellsToGrid(cells);
    const {
      h,
      w
    } = pieceExtent(piece);
    for (let r = 0; r <= N - h; r++) for (let c = 0; c <= N - w; c++) if (canPlaceGrid(g, piece, r, c)) return true;
    return false;
  }

  // gravity-drop landing: player targets lane (pr,pc); piece slides along `dir`
  // to first contact. Returns {ar,ac} or null.
  function landing(cells, piece, dir, pr, pc) {
    const g = cellsToGrid(cells);
    const {
      h,
      w
    } = pieceExtent(piece);
    if (dir === 'down' || dir === 'up') {
      const ac = clamp(pc - (w - 1 >> 1), 0, N - w);
      if (dir === 'down') {
        for (let ar = N - h; ar >= 0; ar--) if (canPlaceGrid(g, piece, ar, ac)) return {
          ar,
          ac
        };
      } else {
        for (let ar = 0; ar <= N - h; ar++) if (canPlaceGrid(g, piece, ar, ac)) return {
          ar,
          ac
        };
      }
    } else {
      const ar = clamp(pr - (h - 1 >> 1), 0, N - h);
      if (dir === 'right') {
        for (let ac = N - w; ac >= 0; ac--) if (canPlaceGrid(g, piece, ar, ac)) return {
          ar,
          ac
        };
      } else {
        for (let ac = 0; ac <= N - w; ac++) if (canPlaceGrid(g, piece, ar, ac)) return {
          ar,
          ac
        };
      }
    }
    return null;
  }

  // full rows / cols (all 9 cells occupied, stones included)
  function fullLines(cells) {
    const g = cellsToGrid(cells);
    const rows = [],
      cols = [];
    for (let r = 0; r < N; r++) if (g[r].every(x => x)) rows.push(r);
    for (let c = 0; c < N; c++) {
      let full = true;
      for (let r = 0; r < N; r++) if (!g[r][c]) {
        full = false;
        break;
      }
      if (full) cols.push(c);
    }
    return {
      rows,
      cols
    };
  }
  function linePositions(lines) {
    const set = new Set();
    lines.rows.forEach(r => {
      for (let c = 0; c < N; c++) set.add(key(r, c));
    });
    lines.cols.forEach(c => {
      for (let r = 0; r < N; r++) set.add(key(r, c));
    });
    return set;
  }

  // ---- gravity settle with fixed obstacles ----
  function settleDown(g, isFixed) {
    const ng = emptyGrid();
    for (let c = 0; c < N; c++) {
      let start = 0;
      for (let r = 0; r <= N; r++) {
        const cell = r < N ? g[r][c] : null;
        const fixedHere = r < N && cell && isFixed(cell);
        if (r === N || fixedHere) {
          const movable = [];
          for (let rr = start; rr < r; rr++) {
            const x = g[rr][c];
            if (x && !isFixed(x)) movable.push(x);
          }
          let put = r - 1;
          for (let i = movable.length - 1; i >= 0; i--) {
            ng[put][c] = movable[i];
            put--;
          }
          if (fixedHere) ng[r][c] = cell;
          start = r + 1;
        }
      }
    }
    return ng;
  }
  function transpose(g) {
    const t = emptyGrid();
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) t[c][r] = g[r][c];
    return t;
  }
  function vflip(g) {
    const t = emptyGrid();
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) t[N - 1 - r][c] = g[r][c];
    return t;
  }
  function settle(cells, dir, isFixed) {
    isFixed = isFixed || (() => false);
    let g = cellsToGrid(cells);
    if (dir === 'down') g = settleDown(g, isFixed);else if (dir === 'up') g = vflip(settleDown(vflip(g), isFixed));else if (dir === 'right') g = transpose(settleDown(transpose(g), isFixed));else if (dir === 'left') g = transpose(vflip(settleDown(vflip(transpose(g)), isFixed)));
    return gridToCells(g);
  }
  window.GJProtoEngine = {
    N,
    DIRS,
    COLORS,
    SHAPES,
    uid,
    clamp,
    inb,
    key,
    makeRng,
    randomPiece,
    newTray,
    cellsToGrid,
    gridToCells,
    pieceExtent,
    canPlace,
    existsPlacement,
    landing,
    fullLines,
    linePositions,
    settle
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "prototypes/proto-engine.js", error: String((e && e.message) || e) }); }

// prototypes/proto-game.jsx
try { (() => {
/* proto-game.jsx — the shared playable controller. Both prototypes call
   window.GJProtoGame(config) to get a mounted React app; config supplies the
   mechanic-specific bits (initial board, clear rules, targets, growth).
   window.GJProtoGame. */
(function () {
  const E = window.GJProtoEngine;
  const U = window.GJProtoUI;
  const {
    useState,
    useRef,
    useLayoutEffect,
    useEffect
  } = React;
  const DIRS = E.DIRS;
  const CELL = 32;
  function makeGame(config) {
    return function GameApp() {
      const [, force] = useState(0);
      const rerender = () => force(n => n + 1);

      // refs hold the source of truth (async turn loop reads these), state used for render
      const rng = useRef(E.makeRng(config.seed));
      const cellsRef = useRef(config.initCells());
      const trayRef = useRef(E.newTray(rng.current));
      const dirIdxRef = useRef(0);
      const chargesRef = useRef(config.charges);
      const movesRef = useRef(0);
      const statusRef = useRef(null);
      const busy = useRef(false);
      const [cells, setCells] = useState(cellsRef.current);
      const [tray, setTray] = useState(trayRef.current);
      const [dirIdx, setDirIdx] = useState(0);
      const [charges, setCharges] = useState(config.charges);
      const [moves, setMoves] = useState(0);
      const [status, setStatus] = useState(null);
      const [targets, setTargets] = useState(config.countTargets(cellsRef.current));
      const [selected, setSelected] = useState(-1);
      const [hover, setHover] = useState(null);
      const [clearing, setClearing] = useState(new Set());
      const [combo, setCombo] = useState(null);
      const [flash, setFlash] = useState(null);
      const dir = DIRS[dirIdx];
      const delay = ms => new Promise(r => setTimeout(r, ms));

      // ---- responsive phone scaling ----
      const [scale, setScale] = useState(1);
      useLayoutEffect(() => {
        const fit = () => {
          const s = Math.min((window.innerWidth - 24) / 360, (window.innerHeight - 24) / 800, 1.15);
          setScale(s);
        };
        fit();
        window.addEventListener('resize', fit);
        return () => window.removeEventListener('resize', fit);
      }, []);
      function finalize(cs) {
        const t = config.countTargets(cs);
        setTargets(t);
        let tr = trayRef.current;
        if (tr.every(p => !p)) {
          tr = E.newTray(rng.current);
          trayRef.current = tr;
          setTray(tr);
        }
        if (t <= 0) {
          statusRef.current = 'win';
          setStatus('win');
          return;
        }
        const placeable = tr.some(p => p && E.existsPlacement(cs, p));
        if (!placeable) {
          statusRef.current = 'lose';
          setStatus('lose');
        }
      }
      async function resolveTurn(cs, isPlacement) {
        busy.current = true;
        let comboTier = 0,
          refunded = false;
        while (!statusRef.current) {
          const lines = E.fullLines(cs);
          const tot = lines.rows.length + lines.cols.length;
          if (tot === 0) break;
          comboTier += tot;
          const posSet = E.linePositions(lines);
          const clearIds = new Set();
          cs.forEach(cl => {
            if (posSet.has(cl.r + '-' + cl.c) && cl.kind !== 'stone') clearIds.add(cl.id);
          });
          setClearing(clearIds);
          setCells(cs);
          await delay(360);
          const res = config.applyClear(cs, lines);
          if (res.flash) {
            setFlash({
              msg: res.flash,
              key: Date.now()
            });
            setTimeout(() => setFlash(null), 1000);
          }
          const settled = E.settle(res.next, DIRS[dirIdxRef.current], config.isFixed);
          setClearing(new Set());
          cellsRef.current = settled;
          setCells(settled);
          if (comboTier >= 2) {
            setCombo({
              n: comboTier,
              key: Date.now()
            });
            if (!refunded) {
              chargesRef.current = chargesRef.current + 1;
              setCharges(chargesRef.current);
              refunded = true;
            }
            setTimeout(() => setCombo(null), 850);
          }
          await delay(330);
          cs = settled;
        }
        if (isPlacement && !statusRef.current) {
          const m = movesRef.current + 1;
          movesRef.current = m;
          setMoves(m);
          if (config.grows && m % 2 === 0) {
            await delay(160);
            const grown = config.growth(cs);
            cellsRef.current = grown;
            setCells(grown);
            cs = grown;
            await delay(300);
            busy.current = false;
            return resolveTurn(cs, false); // growth may complete a line
          }
        }
        finalize(cs);
        busy.current = false;
      }
      function doPlace(piece, ar, ac, idx) {
        if (busy.current || statusRef.current) return;
        const added = piece.cells.map(([r, c]) => ({
          id: E.uid(),
          kind: 'jelly',
          color: piece.color,
          r: ar + r,
          c: ac + c
        }));
        const tr = trayRef.current.slice();
        tr[idx] = null;
        trayRef.current = tr;
        setTray(tr);
        setSelected(-1);
        setHover(null);
        const next = cellsRef.current.concat(added);
        cellsRef.current = next;
        setCells(next);
        resolveTurn(next, true);
      }
      function doRotate() {
        if (busy.current || statusRef.current || chargesRef.current <= 0) return;
        const nd = (dirIdxRef.current + 1) % 4;
        dirIdxRef.current = nd;
        setDirIdx(nd);
        chargesRef.current -= 1;
        setCharges(chargesRef.current);
        setSelected(-1);
        setHover(null);
        const settled = E.settle(cellsRef.current, DIRS[nd], config.isFixed);
        cellsRef.current = settled;
        setCells(settled);
        resolveTurn(settled, false);
      }
      function restart() {
        busy.current = false;
        statusRef.current = null;
        setStatus(null);
        rng.current = E.makeRng(config.seed);
        const c = config.initCells();
        cellsRef.current = c;
        setCells(c);
        const tr = E.newTray(rng.current);
        trayRef.current = tr;
        setTray(tr);
        dirIdxRef.current = 0;
        setDirIdx(0);
        chargesRef.current = config.charges;
        setCharges(config.charges);
        movesRef.current = 0;
        setMoves(0);
        setSelected(-1);
        setHover(null);
        setClearing(new Set());
        setCombo(null);
        setTargets(config.countTargets(c));
      }
      function selectPiece(i) {
        if (busy.current || statusRef.current || !tray[i]) return;
        setSelected(s => s === i ? -1 : i);
      }
      function onCellMove(rc) {
        if (selected >= 0) setHover(rc);
      }
      function onCellClick(rc) {
        if (selected < 0 || busy.current || statusRef.current) return;
        const piece = tray[selected];
        const L = E.landing(cellsRef.current, piece, dir, rc.r, rc.c);
        if (L) doPlace(piece, L.ar, L.ac, selected);
      }

      // ---- derived render values ----
      const piece = selected >= 0 ? tray[selected] : null;
      let previewCells = [],
        previewValid = false;
      if (piece && hover) {
        const L = E.landing(cells, piece, dir, hover.r, hover.c);
        if (L) {
          previewCells = piece.cells.map(([r, c]) => [L.ar + r, L.ac + c]);
          previewValid = true;
        }
      }
      const displayCells = config.decorate ? config.decorate(cells, dir) : cells;
      const warn = config.grows && !status && movesRef.current % 2 === 1;
      const remaining = targets;
      return /*#__PURE__*/React.createElement("div", {
        style: {
          width: 360 * scale,
          height: 800 * scale
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 360,
          height: 800,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
          borderRadius: 40,
          overflow: 'hidden',
          background: config.bg,
          boxShadow: '0 30px 60px rgba(60,44,24,0.4)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--font-body,sans-serif)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '16px 18px 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          background: 'rgba(255,255,255,0.9)',
          borderRadius: 16,
          padding: '8px 14px',
          boxShadow: '0 3px 8px rgba(120,92,52,0.16)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-display,sans-serif)',
          fontWeight: 700,
          fontSize: 14,
          color: config.accent,
          letterSpacing: '0.01em',
          whiteSpace: 'nowrap',
          lineHeight: 1.1
        }
      }, config.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: '#9B886F',
          fontWeight: 700,
          whiteSpace: 'nowrap'
        }
      }, config.subtitle)), /*#__PURE__*/React.createElement("div", {
        style: {
          background: 'rgba(255,255,255,0.9)',
          borderRadius: 16,
          padding: '6px 12px',
          textAlign: 'center',
          boxShadow: '0 3px 8px rgba(120,92,52,0.16)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: '#9B886F',
          fontWeight: 800,
          letterSpacing: '0.06em'
        }
      }, "L\u01AF\u1EE2T"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'var(--font-display,sans-serif)',
          fontWeight: 700,
          fontSize: 20,
          color: '#5B4636',
          lineHeight: 1
        }
      }, moves))), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '2px 18px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#fff',
          borderRadius: 999,
          padding: '7px 14px 7px 10px',
          boxShadow: '0 3px 8px rgba(120,92,52,0.16)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          transform: 'scale(0.82)'
        }
      }, /*#__PURE__*/React.createElement(U.CellArt, {
        cell: config.goalGlyph,
        size: 26,
        dir: "down"
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-display,sans-serif)',
          fontWeight: 700,
          fontSize: 15,
          color: '#5B4636',
          whiteSpace: 'nowrap'
        }
      }, "C\xF2n: ", remaining, " ", config.goalWord)), warn && /*#__PURE__*/React.createElement("div", {
        style: {
          background: '#FFCA66',
          borderRadius: 999,
          padding: '6px 12px',
          fontFamily: 'var(--font-display,sans-serif)',
          fontWeight: 700,
          fontSize: 12,
          color: '#6A4A2E',
          boxShadow: '0 3px 0 #E3A63A',
          animation: 'gjpulse 900ms ease-in-out infinite'
        }
      }, config.warnText)), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '4px 0'
        }
      }, /*#__PURE__*/React.createElement(U.BoardView, {
        cells: displayCells,
        cell: CELL,
        dir: dir,
        previewCells: previewCells,
        previewValid: previewValid,
        clearing: clearing,
        onCellMove: onCellMove,
        onCellLeave: () => setHover(null),
        onCellClick: onCellClick
      }), combo && /*#__PURE__*/React.createElement("div", {
        key: combo.key,
        style: {
          position: 'absolute',
          top: '28%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none'
        }
      }, /*#__PURE__*/React.createElement(U.ComboPopup, {
        combo: combo.n
      })), flash && /*#__PURE__*/React.createElement("div", {
        key: flash.key,
        style: {
          position: 'absolute',
          bottom: '8%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          animation: 'gjrise 320ms cubic-bezier(.34,1.4,.5,1)',
          background: '#4E8C3F',
          color: '#fff',
          borderRadius: 999,
          padding: '8px 18px',
          fontFamily: 'var(--font-display,sans-serif)',
          fontWeight: 700,
          fontSize: 16,
          boxShadow: '0 5px 0 #356328, 0 8px 16px rgba(53,99,40,0.35)'
        }
      }, flash.msg))), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '0 20px 6px',
          textAlign: 'center',
          fontSize: 12,
          color: config.hintColor || '#7A6A54',
          fontWeight: 700,
          minHeight: 30
        }
      }, selected >= 0 ? 'Chạm vào cột trên bàn để thả khối ↓' : config.hint), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '0 20px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: restart,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#fff',
          border: 'none',
          borderRadius: 999,
          padding: '10px 16px',
          boxShadow: '0 3px 8px rgba(120,92,52,0.16)',
          cursor: 'pointer',
          fontFamily: 'var(--font-display,sans-serif)',
          fontWeight: 700,
          fontSize: 14,
          color: '#5B4636'
        }
      }, /*#__PURE__*/React.createElement("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#5B4636",
        strokeWidth: "2.4",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M4 12a8 8 0 1 1 2.3 5.6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 20v-4h4"
      })), "Ch\u01A1i l\u1EA1i"), /*#__PURE__*/React.createElement(U.RotateButton, {
        turnsLeft: charges,
        onRotate: doRotate,
        disabled: busy.current
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '0 16px 16px'
        }
      }, /*#__PURE__*/React.createElement(U.Tray, {
        tray: tray,
        selected: selected,
        onSelect: selectPiece,
        disabled: !!status
      })), /*#__PURE__*/React.createElement(U.Dialog, {
        open: status === 'win',
        tone: "win",
        title: config.winTitle,
        body: config.winBody,
        actions: /*#__PURE__*/React.createElement(U.BigButton, {
          tone: "gravity",
          onClick: restart
        }, "Ch\u01A1i l\u1EA1i")
      }), /*#__PURE__*/React.createElement(U.Dialog, {
        open: status === 'lose',
        tone: "lose",
        title: "K\u1EB8T!",
        body: "Kh\xF4ng c\xF2n ch\u1ED7 \u0111\u1EB7t kh\u1ED1i.",
        actions: /*#__PURE__*/React.createElement(U.BigButton, {
          onClick: restart
        }, "Ch\u01A1i l\u1EA1i")
      })));
    };
  }
  window.GJProtoGame = makeGame;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "prototypes/proto-game.jsx", error: String((e && e.message) || e) }); }

// prototypes/proto-ui.jsx
try { (() => {
/* proto-ui.jsx — shared presentational parts for the two mechanic prototypes.
   Reads JellyBlock from the DS bundle for jelly/stone cells; draws the special
   mechanic cells (drop / vine root / vine segment) inline. window.GJProtoUI. */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const JellyBlock = NS.JellyBlock;
  const E = window.GJProtoEngine;
  const N = E.N;
  const {
    useState,
    useEffect
  } = React;

  // ---------- special mechanic cell art ----------
  function DropCell({
    size,
    buried
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        boxSizing: 'border-box',
        background: '#5FC3B2',
        border: `3px solid #3E9E8E`,
        boxShadow: '0 2px 6px rgba(120,92,52,0.16)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: buried ? 0.9 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 2,
        left: '14%',
        right: '14%',
        height: '32%',
        background: '#CBF2EB',
        borderRadius: '50%',
        opacity: 0.8
      }
    }), /*#__PURE__*/React.createElement("svg", {
      width: size * 0.5,
      height: size * 0.5,
      viewBox: "0 0 24 24",
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z",
      fill: "#EAFBF7",
      stroke: "#3E9E8E",
      strokeWidth: "1.8",
      strokeLinejoin: "round"
    })), buried && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(90,70,54,0.34)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: size * 0.42,
      height: size * 0.42,
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M6 11V8a6 6 0 1 1 12 0v3",
      fill: "none",
      stroke: "#FFF",
      strokeWidth: "2.2",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "4.5",
      y: "11",
      width: "15",
      height: "10",
      rx: "2.4",
      fill: "#FFF"
    }))));
  }
  function VineCell({
    size,
    root,
    head,
    connect
  }) {
    connect = connect || {};
    const fill = root ? '#4E8C3F' : '#7FBE5C';
    const edge = root ? '#356328' : '#4E8C3F';
    const stem = root ? '#2C5321' : '#3C6E30';
    const leaf = '#E4F7CE';
    const t = Math.max(5, Math.round(size * 0.26)); // stem thickness
    const c0 = size / 2;
    const bar = (k, st) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: Object.assign({
        position: 'absolute',
        background: stem,
        borderRadius: t / 2
      }, st)
    });
    const conns = [];
    if (connect.up) conns.push(bar('u', {
      left: c0 - t / 2,
      top: -2,
      width: t,
      height: c0 + t / 2 + 2
    }));
    if (connect.down) conns.push(bar('d', {
      left: c0 - t / 2,
      top: c0 - t / 2,
      width: t,
      height: c0 + t / 2 + 2
    }));
    if (connect.left) conns.push(bar('l', {
      top: c0 - t / 2,
      left: -2,
      width: c0 + t / 2 + 2,
      height: t
    }));
    if (connect.right) conns.push(bar('r', {
      top: c0 - t / 2,
      left: c0 - t / 2,
      width: c0 + t / 2 + 2,
      height: t
    }));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        boxSizing: 'border-box',
        background: fill,
        border: `3px solid ${edge}`,
        boxShadow: head ? '0 0 0 3px #C6F0A6, 0 2px 8px rgba(53,99,40,0.5)' : root ? '0 2px 8px rgba(53,99,40,0.4)' : '0 2px 6px rgba(120,92,52,0.16)',
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 2,
        left: '14%',
        right: '14%',
        height: '26%',
        background: root ? '#7CB86A' : '#A9D98F',
        borderRadius: '50%',
        opacity: 0.5
      }
    }), conns, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: c0 - t * 0.62,
        top: c0 - t * 0.62,
        width: t * 1.24,
        height: t * 1.24,
        borderRadius: '50%',
        background: stem
      }
    }), /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
      }
    }, root ? /*#__PURE__*/React.createElement("g", {
      fill: leaf,
      stroke: edge,
      strokeWidth: "1"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 17c-3.4 0-5.6-2.2-5.6-5.6C9.8 11.4 12 13.6 12 17z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 17c3.4 0 5.6-2.2 5.6-5.6C14.2 11.4 12 13.6 12 17z"
    })) : head ? /*#__PURE__*/React.createElement("g", {
      fill: "none",
      stroke: leaf,
      strokeWidth: "2.1",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 16c0-3.4 1.4-6 4.6-7.4C17.4 6 15.2 4 12.4 4"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "16.6",
      cy: "8.6",
      r: "0.4"
    })) : /*#__PURE__*/React.createElement("path", {
      d: "M6.6 6.4c3.6.2 5.8 2.4 5.6 6-3.6-.2-5.8-2.4-5.6-6z",
      fill: leaf,
      stroke: edge,
      strokeWidth: "0.8",
      strokeLinejoin: "round"
    })));
  }
  function CellArt({
    cell,
    size,
    dir
  }) {
    if (cell.kind === 'jelly') return /*#__PURE__*/React.createElement(JellyBlock, {
      color: cell.color,
      size: size,
      showEyes: size >= 24,
      direction: dir
    });
    if (cell.kind === 'stone') return /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size
    });
    if (cell.kind === 'drop') return /*#__PURE__*/React.createElement(DropCell, {
      size: size,
      buried: cell.buried
    });
    if (cell.kind === 'root') return /*#__PURE__*/React.createElement(VineCell, {
      size: size,
      root: true,
      head: cell.isHead,
      connect: cell.connect
    });
    if (cell.kind === 'seg') return /*#__PURE__*/React.createElement(VineCell, {
      size: size,
      head: cell.isHead,
      connect: cell.connect
    });
    return null;
  }

  // ---------- board ----------
  function BoardView({
    cells,
    cell,
    dir,
    previewCells,
    previewValid,
    clearing,
    onCellMove,
    onCellLeave,
    onCellClick
  }) {
    const pad = 7,
      gap = 2,
      step = cell + gap;
    const boardPx = pad * 2 + N * cell + (N - 1) * gap;
    const pos = i => pad + i * step;
    const coordFrom = e => {
      const rect = e.currentTarget.getBoundingClientRect();
      const scale = rect.width / boardPx;
      const c = Math.floor(((e.clientX - rect.left) / scale - pad) / step);
      const r = Math.floor(((e.clientY - rect.top) / scale - pad) / step);
      return {
        r: E.clamp(r, 0, N - 1),
        c: E.clamp(c, 0, N - 1)
      };
    };
    const previewSet = new Set((previewCells || []).map(p => p[0] + '-' + p[1]));
    const clearingSet = clearing || new Set();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        padding: pad,
        borderRadius: 24,
        background: 'linear-gradient(180deg,#FFFFFF 0%,#FBF1DF 100%)',
        border: '2px solid #F1E3C9',
        boxShadow: '0 8px 0 #E9D7BA, 0 20px 30px -12px rgba(120,92,52,0.24), inset 0 3px 0 rgba(255,255,255,0.95)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      onMouseMove: e => onCellMove && onCellMove(coordFrom(e)),
      onMouseLeave: () => onCellLeave && onCellLeave(),
      onClick: e => onCellClick && onCellClick(coordFrom(e)),
      style: {
        position: 'relative',
        width: boardPx - pad * 2,
        height: boardPx - pad * 2,
        background: 'var(--color-surface-sunken,#F4E9D8)',
        borderRadius: 18,
        boxShadow: 'inset 0 2px 6px rgba(120,92,52,0.12)',
        cursor: 'pointer',
        margin: 0
      }
    }, Array.from({
      length: N
    }).map((_, r) => Array.from({
      length: N
    }).map((_, c) => /*#__PURE__*/React.createElement("div", {
      key: r + '-' + c,
      style: {
        position: 'absolute',
        left: pos(c) - pad,
        top: pos(r) - pad,
        width: cell,
        height: cell,
        borderRadius: Math.round(cell * 0.28),
        background: 'rgba(120,92,52,0.05)',
        boxShadow: 'inset 0 0 0 1px rgba(120,92,52,0.08)'
      }
    }))), (previewCells || []).map(([r, c], i) => /*#__PURE__*/React.createElement("div", {
      key: 'pv' + i,
      style: {
        position: 'absolute',
        left: pos(c) - pad,
        top: pos(r) - pad,
        width: cell,
        height: cell,
        borderRadius: Math.round(cell * 0.28),
        background: previewValid ? 'rgba(111,207,127,0.55)' : 'rgba(240,138,126,0.5)',
        boxShadow: `inset 0 0 0 2px ${previewValid ? '#6FCF7F' : '#F08A7E'}`,
        pointerEvents: 'none'
      }
    })), cells.map(cl => {
      const isClearing = clearingSet.has(cl.id);
      return /*#__PURE__*/React.createElement("div", {
        key: cl.id,
        style: {
          position: 'absolute',
          left: pos(cl.c) - pad,
          top: pos(cl.r) - pad,
          transition: 'left 300ms cubic-bezier(.34,1.4,.5,1), top 300ms cubic-bezier(.34,1.4,.5,1), transform 260ms ease, opacity 260ms ease',
          transform: isClearing ? 'scale(0.2)' : cl.fresh ? 'scale(0.62)' : 'scale(1)',
          opacity: isClearing ? 0 : 1,
          zIndex: isClearing ? 3 : 1
        }
      }, /*#__PURE__*/React.createElement(CellArt, {
        cell: cl,
        size: cell,
        dir: dir
      }));
    })));
  }

  // ---------- tray ----------
  function TrayThumb({
    piece,
    cell
  }) {
    const {
      h,
      w
    } = E.pieceExtent(piece);
    const g = 2;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: w * (cell + g) - g,
        height: h * (cell + g) - g
      }
    }, piece.cells.map(([r, c], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: c * (cell + g),
        top: r * (cell + g)
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: piece.color,
      size: cell,
      showEyes: false
    }))));
  }
  function Tray({
    tray,
    selected,
    onSelect,
    disabled
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 8,
        padding: '10px 12px',
        background: 'var(--color-surface,#fff)',
        borderRadius: 24,
        boxShadow: '0 6px 16px rgba(120,92,52,0.16)'
      }
    }, tray.map((p, i) => {
      const sel = selected === i && p;
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        type: "button",
        disabled: !p || disabled,
        onClick: () => onSelect(i),
        style: {
          width: 92,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          borderRadius: 16,
          background: sel ? 'var(--color-surface-sunken,#F4E9D8)' : 'transparent',
          boxShadow: sel ? 'inset 0 0 0 3px #FF9F68' : 'none',
          transform: sel ? 'translateY(-4px)' : 'none',
          opacity: p ? 1 : 0.3,
          transition: 'transform 200ms cubic-bezier(.34,1.4,.5,1), box-shadow 140ms',
          cursor: p && !disabled ? 'pointer' : 'default'
        }
      }, p ? /*#__PURE__*/React.createElement(TrayThumb, {
        piece: p,
        cell: Math.min(20, Math.floor(64 / Math.max(E.pieceExtent(p).w, E.pieceExtent(p).h)))
      }) : /*#__PURE__*/React.createElement("div", {
        style: {
          width: 44,
          height: 44,
          borderRadius: 10,
          border: '2px dashed rgba(120,92,52,0.25)'
        }
      }));
    }));
  }

  // ---------- rotate button + charges ----------
  function RotateButton({
    turnsLeft,
    onRotate,
    disabled
  }) {
    const dead = disabled || turnsLeft <= 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onRotate,
      disabled: dead,
      style: {
        position: 'relative',
        width: 60,
        height: 60,
        borderRadius: 30,
        border: 'none',
        cursor: dead ? 'default' : 'pointer',
        background: dead ? '#C9BCA8' : '#7E6CF0',
        boxShadow: dead ? '0 3px 0 #A89A82' : '0 5px 0 #6353D6',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 120ms, box-shadow 120ms'
      },
      onMouseDown: e => {
        if (!dead) {
          e.currentTarget.style.transform = 'translateY(3px)';
          e.currentTarget.style.boxShadow = '0 2px 0 #6353D6';
        }
      },
      onMouseUp: e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = dead ? '0 3px 0 #A89A82' : '0 5px 0 #6353D6';
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "30",
      height: "30",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 12a8 8 0 1 1 2.3 5.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 20v-4h4"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -6,
        right: -6,
        minWidth: 22,
        height: 22,
        padding: '0 5px',
        borderRadius: 11,
        background: '#FF9F68',
        color: '#fff',
        fontFamily: 'var(--font-display,sans-serif)',
        fontWeight: 700,
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 0 #E97E45'
      }
    }, turnsLeft)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display,sans-serif)',
        fontSize: 11,
        fontWeight: 700,
        color: '#6353D6',
        letterSpacing: '0.06em'
      }
    }, "XOAY"));
  }

  // ---------- combo popup ----------
  function ComboPopup({
    combo
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        animation: 'gjpop 700ms cubic-bezier(.34,1.56,.5,1)',
        fontFamily: 'var(--font-display,sans-serif)',
        fontWeight: 700,
        fontSize: 46,
        color: '#fff',
        textShadow: '0 3px 0 #E97E45, 0 6px 12px rgba(120,92,52,0.4)',
        WebkitTextStroke: '2px #E97E45'
      }
    }, "\xD7", combo);
  }

  // ---------- dialog ----------
  function Dialog({
    open,
    title,
    body,
    tone,
    actions
  }) {
    if (!open) return null;
    const accent = tone === 'win' ? '#6FCF7F' : tone === 'lose' ? '#F08A7E' : '#7E6CF0';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(60,44,24,0.42)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        maxWidth: 300,
        background: '#fff',
        borderRadius: 32,
        padding: '28px 24px 22px',
        textAlign: 'center',
        boxShadow: '0 24px 48px rgba(120,92,52,0.34)',
        animation: 'gjrise 300ms cubic-bezier(.34,1.4,.5,1)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 60,
        height: 60,
        borderRadius: 30,
        margin: '0 auto 14px',
        background: accent,
        boxShadow: `0 5px 0 ${accent}99`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 30
      }
    }, tone === 'win' ? '🎉' : tone === 'lose' ? '🌀' : '⏸')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display,sans-serif)',
        fontWeight: 700,
        fontSize: 24,
        color: '#5B4636',
        lineHeight: 1.1
      }
    }, title), body && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body,sans-serif)',
        fontSize: 15,
        color: '#9B886F',
        marginTop: 8,
        lineHeight: 1.4
      }
    }, body), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginTop: 20
      }
    }, actions)));
  }
  function BigButton({
    children,
    onClick,
    tone
  }) {
    const bg = tone === 'ghost' ? '#F4E9D8' : tone === 'gravity' ? '#7E6CF0' : '#FF9F68';
    const edge = tone === 'ghost' ? '#E0D2BC' : tone === 'gravity' ? '#6353D6' : '#E97E45';
    const col = tone === 'ghost' ? '#5B4636' : '#fff';
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClick,
      style: {
        width: '100%',
        height: 52,
        border: 'none',
        borderRadius: 26,
        background: bg,
        color: col,
        boxShadow: `0 4px 0 ${edge}`,
        fontFamily: 'var(--font-display,sans-serif)',
        fontWeight: 700,
        fontSize: 16,
        cursor: 'pointer'
      }
    }, children);
  }
  window.GJProtoUI = {
    BoardView,
    Tray,
    RotateButton,
    ComboPopup,
    Dialog,
    BigButton,
    CellArt
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "prototypes/proto-ui.jsx", error: String((e && e.message) || e) }); }

__ds_ns.JellyBlock = __ds_scope.JellyBlock;

__ds_ns.Eyes = __ds_scope.Eyes;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.TrayPiece = __ds_scope.TrayPiece;

__ds_ns.Tray = __ds_scope.Tray;

__ds_ns.GravityRotateButton = __ds_scope.GravityRotateButton;

__ds_ns.ComboPopup = __ds_scope.ComboPopup;

__ds_ns.Dialog = __ds_scope.Dialog;

})();
