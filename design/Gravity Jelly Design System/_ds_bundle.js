/* @ds-bundle: {"format":4,"namespace":"GravityJellyDesignSystem_3e0487","components":[{"name":"JellyBlock","sourcePath":"02-foundations/01-jelly-block/JellyBlock.jsx"},{"name":"Eyes","sourcePath":"02-foundations/02-eyes/Eyes.jsx"},{"name":"Icon","sourcePath":"02-foundations/03-icon/Icon.jsx"},{"name":"Button","sourcePath":"03-components/01-button/Button.jsx"},{"name":"Hud","sourcePath":"03-components/02-hud/Hud.jsx"},{"name":"TrayPiece","sourcePath":"03-components/03-tray/Tray.jsx"},{"name":"Tray","sourcePath":"03-components/03-tray/Tray.jsx"},{"name":"GravityRotateButton","sourcePath":"03-components/04-gravity-rotate-button/GravityRotateButton.jsx"},{"name":"ComboPopup","sourcePath":"03-components/05-combo-popup/ComboPopup.jsx"},{"name":"Dialog","sourcePath":"03-components/06-dialog/Dialog.jsx"},{"name":"ObjectiveBar","sourcePath":"03-components/08-objective-bar/ObjectiveBar.jsx"},{"name":"BossMascot","sourcePath":"03-components/09-boss-hud/BossHud.jsx"},{"name":"ShieldBar","sourcePath":"03-components/09-boss-hud/BossHud.jsx"},{"name":"BossCard","sourcePath":"03-components/09-boss-hud/BossHud.jsx"},{"name":"BossIntroCard","sourcePath":"03-components/09-boss-hud/BossHud.jsx"},{"name":"BossToast","sourcePath":"03-components/09-boss-hud/BossHud.jsx"},{"name":"BossRule","sourcePath":"03-components/09-boss-hud/BossHud.jsx"},{"name":"BossHud","sourcePath":"03-components/09-boss-hud/BossHud.jsx"}],"sourceHashes":{"02-foundations/01-jelly-block/JellyBlock.jsx":"99d676a3206c","02-foundations/02-eyes/Eyes.jsx":"d4762b606971","02-foundations/03-icon/Icon.jsx":"1d501e149f2f","03-components/01-button/Button.jsx":"ff24f7c456d7","03-components/02-hud/Hud.jsx":"b68bb167fc30","03-components/03-tray/Tray.jsx":"e425b7cd5eed","03-components/04-gravity-rotate-button/GravityRotateButton.jsx":"09df27eb60e6","03-components/05-combo-popup/ComboPopup.jsx":"3430e5b0f130","03-components/06-dialog/Dialog.jsx":"d5e802d0a1db","03-components/08-objective-bar/ObjectiveBar.jsx":"d3ef438d707b","03-components/09-boss-hud/BossHud.jsx":"9f8f706c566a","04-screens/board-boss.jsx":"fe9ea9512869","04-screens/board-campaign.jsx":"db93679ac719","04-screens/board-design.jsx":"5163f27516da","04-screens/board.jsx":"a2c1742d1301","04-screens/boss-intro-screen.jsx":"5b7d158f2415","04-screens/cam-nang-illus.jsx":"4e6ed15b2b63","04-screens/cam-nang-screen.jsx":"54efac16eddc","04-screens/daily-reward-screen.jsx":"0309b17c4056","04-screens/home-screen.jsx":"7d45b68edee5","04-screens/leaderboard-screen.jsx":"82c8413c65d7","04-screens/level-intro-screen.jsx":"1252c538acaf","04-screens/level-win-screen.jsx":"b88ddcf6bfa8","04-screens/missions-screen.jsx":"a2cb834bcb3d","04-screens/out-of-lives-screen.jsx":"c5661499a9aa","04-screens/pause-screen.jsx":"edd558af8897","04-screens/phone-frame.jsx":"18e22e60b390","04-screens/play/jelly-play.jsx":"90bcd0f1ca70","04-screens/result-screen.jsx":"775264ed1cbe","04-screens/screen-extras.jsx":"b6a2513dd24c","04-screens/settings-screen.jsx":"a5cbe4af2727","04-screens/shop-screen.jsx":"454bf4d67682","04-screens/splash-screen.jsx":"6b0e750c020b","04-screens/tweaks-panel.jsx":"6591467622ed","04-screens/world-gate-locked.jsx":"4d32d0ac3bad","04-screens/world-gate.jsx":"6db94465e8f2","04-screens/world1-strip.jsx":"2c816bdee51c","04-screens/world10-strip.jsx":"86352e2ce593","04-screens/world2-strip.jsx":"442d24cbb43f","04-screens/world3-strip.jsx":"43895f789f0d","04-screens/world4-strip.jsx":"d3f5e8aadbec","04-screens/world5-strip.jsx":"31ce848e45ea","04-screens/world6-strip.jsx":"3479dadec253","04-screens/world7-strip.jsx":"e0b64525e7fa","04-screens/world8-strip.jsx":"444f9855082e","04-screens/world9-strip.jsx":"aea09bf6b901","07-mechanics/mechanics-cards.js":"711cd9d74c93","07-mechanics/mechanics-kit.jsx":"f52efab2af43","07-mechanics/mechanics-widgets.jsx":"59dbeacaab30","08-brand/gravity-jelly-logo.js":"6df76113eb29","prototypes/proto-engine.js":"6887737568ba","prototypes/proto-game.jsx":"75954a4bee0a","prototypes/proto-ui.jsx":"138d35a58082"},"inlinedExternals":[],"unexposedExports":[]} */

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
 * thick edge, glossy top sheen, and googly eyes that track gravity. Each
 * color carries a cute corner sticker (star / leaf / heart / droplet) so
 * blocks are recognizable by motif, not just hue. Also renders the
 * immovable "stone" cell.
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
  const r = Math.max(6, Math.round(size * 0.28));
  // Every block stays fully rounded on all four corners — never squared.
  const radius = `${r}px`;
  const squash = squashed ? 'scale(1.08, 0.86)' : 'scale(1)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: radius,
      background: pal.fill,
      border: `var(--border-jelly, 3px) solid ${pal.edge}`,
      boxShadow: clearing ? `0 0 0 4px ${pal.shine}, var(--shadow-md)` : 'var(--shadow-sm)',
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
      transition: 'transform var(--motion-fast,150ms) var(--ease-jelly,ease), opacity var(--motion-base,250ms) var(--ease-out,ease), filter var(--motion-base,250ms) var(--ease-out,ease)',
      ...style
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
  }), isStone ? /*#__PURE__*/React.createElement(StoneFace, {
    size: size
  }) : showEyes && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Eyes, {
    direction: direction,
    blockSize: size,
    open: !squashed && !blink,
    expression: expression
  }), !squashed && /*#__PURE__*/React.createElement(Sticker, {
    color: color,
    size: size
  })));
}

/* Each color carries its own cute sticker — a little decal in the top
   corner so blocks are recognizable by motif, not just hue (and friendlier
   for colorblind play). Star / clover-leaf / heart / droplet. */
function Sticker({
  color = 'yellow',
  size = 36
}) {
  const pal = PALETTE[color] || PALETTE.yellow;
  const s = Math.round(size * 0.36);
  const glyph = {
    yellow: /*#__PURE__*/React.createElement("path", {
      d: "M12 2.4l2.7 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.4 6.3 19.5l1.4-6.3L2.9 8.9l6.4-.6z"
    }),
    /* star */
    mint: /*#__PURE__*/React.createElement("path", {
      d: "M5 19c0-8 6-14 14-14 0 8-6 14-14 14zm3.5-3.5C13 14 16 11 17 7"
    }),
    /* leaf */
    pink: /*#__PURE__*/React.createElement("path", {
      d: "M12 20.7l-1.5-1.4C5.4 14.6 2 11.5 2 7.8 2 5.1 4.1 3 6.8 3 8.3 3 9.8 3.8 12 6 14.2 3.8 15.7 3 17.2 3 19.9 3 22 5.1 22 7.8c0 3.7-3.4 6.8-8.5 11.5z"
    }),
    /* heart */
    blue: /*#__PURE__*/React.createElement("path", {
      d: "M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z"
    }) /* droplet */
  }[color];
  if (!glyph) return null;
  const stroked = color === 'mint';
  return /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    style: {
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
      pointerEvents: 'none'
    }
  }, glyph);
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
  })
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

// 03-components/02-hud/Hud.jsx
try { (() => {
/**
 * Hud — the 56dp top status bar: live score on the left, a gravity-direction
 * indicator in the center, and a round pause button on the right.
 */

const ARROW = {
  down: '180deg',
  up: '0deg',
  left: '270deg',
  right: '90deg'
};
function GravityIndicator({
  direction = 'down'
}) {
  return /*#__PURE__*/React.createElement("div", {
    title: "H\u01B0\u1EDBng tr\u1ECDng l\u1EF1c",
    style: {
      display: 'inline-flex',
      flexShrink: 0,
      alignItems: 'center',
      gap: 'var(--space-xs)',
      height: 36,
      padding: '0 var(--space-md)',
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-gravity)',
      boxShadow: `0 3px 0 var(--color-gravity-edge)`,
      color: 'var(--color-text-invert)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: `rotate(${ARROW[direction] || '180deg'})`,
      transition: 'transform var(--motion-medium) var(--ease-inout)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 4v15M6 13l6 6 6-6"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--tracking-wide)',
      whiteSpace: 'nowrap',
      lineHeight: 1
    }
  }, "TR\u1ECCNG L\u1EF0C"));
}
function Hud({
  score = 0,
  best = null,
  direction = 'down',
  onPause,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--dim-hud-h)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-md)',
      padding: '0 var(--space-lg)',
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minWidth: 84
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-caption)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--color-text-muted)',
      letterSpacing: 'var(--tracking-wide)',
      lineHeight: 1
    }
  }, "\u0110I\u1EC2M"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-score)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--color-text)',
      lineHeight: 1.1
    }
  }, score.toLocaleString('vi-VN'))), /*#__PURE__*/React.createElement(GravityIndicator, {
    direction: direction
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onPause,
    "aria-label": "T\u1EA1m d\u1EEBng",
    style: {
      width: 'var(--dim-icon-btn)',
      height: 'var(--dim-icon-btn)',
      borderRadius: 'var(--radius-lg)',
      border: 'var(--border-thin) solid #ECDFC9',
      background: 'var(--color-surface)',
      color: 'var(--color-text)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "pause",
    size: 22
  })));
}
Object.assign(__ds_scope, { Hud });
})(); } catch (e) { __ds_ns.__errors.push({ path: "03-components/02-hud/Hud.jsx", error: String((e && e.message) || e) }); }

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

// 03-components/08-objective-bar/ObjectiveBar.jsx
try { (() => {
/**
 * ObjectiveBar — the always-on "what do I need to do" cluster that sits right
 * under the 56dp HUD and above the 9×9 board. One component, one `goal`
 * descriptor, covering every goal_type in the catalogue:
 *   • tutorial   — single action, "0/1" chip (or "×N" for combo)
 *   • targets    — CLEAR_TARGETS counter: target glyphs that dim as destroyed
 *                  (buried variant adds a layer-lock)
 * Every level is rated the SAME way — by moves (số nước): a `level`/`world`
 * badge anchors the left, a move-based 3-star strip sits in the footer. The
 * old score / mixed goal kinds (điểm) were removed for consistency.
 * States: active · near (gentle pulse) · done (success + tick, glow).
 * Optional gravity `rotations` chip on the right when it isn't on the FAB.
 *
 * Sizes in dp: single-row bar 52 · padding 16 · radius 20
 * · shadow sm · target/tutorial glyph 26–30 · level badge min 44.
 */

/* ---- one-time keyframes (pop / pulse), reduced-motion aware ---- */
if (typeof document !== 'undefined' && !document.getElementById('gj-objective-kf')) {
  const s = document.createElement('style');
  s.id = 'gj-objective-kf';
  s.textContent = `
    @keyframes gj-obj-pop { 0% { transform: scale(0.5) } 60% { transform: scale(1.16) } 100% { transform: scale(1) } }
    @keyframes gj-obj-nudge { 0%,100% { transform: scale(1) } 50% { transform: scale(1.06) } }
    @media (prefers-reduced-motion: reduce) { [data-gj-anim] { animation: none !important } }
  `;
  document.head.appendChild(s);
}
const CAPTION = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-caption)',
  fontWeight: 'var(--weight-bold)',
  letterSpacing: 'var(--tracking-wide)',
  color: 'var(--color-text-muted)',
  lineHeight: 1,
  whiteSpace: 'nowrap'
};
const NUM = {
  fontFamily: 'var(--font-display)',
  fontWeight: 'var(--weight-bold)',
  lineHeight: 1
};
const JPAL = {
  yellow: ['#FFE3A3', '#E8B85C'],
  mint: ['#A3E5D9', '#5FC3B2'],
  pink: ['#F7A9C0', '#E576A0'],
  blue: ['#B3C7F7', '#7E9CE8']
};

/* ── glyphs ─────────────────────────────────────────────────────────── */

// 3×3 mini grid with one row / column lit — CLEAR_ROW / CLEAR_COL.
function GridGlyph({
  axis = 'row',
  size = 26
}) {
  const cells = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const hot = axis === 'row' ? r === 1 : c === 1;
    cells.push(/*#__PURE__*/React.createElement("rect", {
      key: `${r}-${c}`,
      x: c * 8.5 + 1.5,
      y: r * 8.5 + 1.5,
      width: "6.5",
      height: "6.5",
      rx: "2",
      fill: hot ? 'var(--color-primary)' : 'var(--color-surface-sunken)',
      stroke: hot ? 'var(--color-primary-edge)' : '#E7D8BF',
      strokeWidth: "1"
    }));
  }
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 27 27",
    "aria-hidden": "true"
  }, cells);
}
const CrownMini = ({
  size = 18
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3.5 18l-1-9 5 3.5L12 5l4.5 7.5 5-3.5-1 9z",
  fill: "#FFCA66",
  stroke: "#E2A82E",
  strokeWidth: "1.6",
  strokeLinejoin: "round"
}), /*#__PURE__*/React.createElement("path", {
  d: "M3.5 18h17",
  stroke: "#E2A82E",
  strokeWidth: "1.6",
  strokeLinecap: "round"
}));

// super / rainbow / crown power-cell glyph — MAKE_SUPER1/2, RAINBOW, RAINBOW_SUPER.
function SpecialGlyph({
  type = 'super',
  color = 'pink',
  size = 30,
  lvl = 1
}) {
  const r = Math.round(size * 0.28);
  const rainbow = type === 'rainbow' || type === 'crown';
  const pal = JPAL[color] || JPAL.pink;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: r,
      boxSizing: 'border-box',
      position: 'relative',
      background: rainbow ? 'conic-gradient(from 210deg,#F7A9C0,#FFE3A3,#A3E5D9,#B3C7F7,#F7A9C0)' : pal[0],
      border: `3px solid ${rainbow ? '#E576A0' : pal[1]}`,
      boxShadow: '0 0 0 2px var(--color-warning), var(--shadow-sm)',
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
      borderRadius: '50%'
    }
  }), !rainbow && /*#__PURE__*/React.createElement("svg", {
    width: size * 0.5,
    height: size * 0.5,
    viewBox: "0 0 24 24",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z",
    fill: "#FFF6DD",
    stroke: "#E2A82E",
    strokeWidth: "1.6",
    strokeLinejoin: "round"
  })), rainbow && /*#__PURE__*/React.createElement("span", {
    style: {
      width: size * 0.32,
      height: size * 0.32,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.94)',
      boxShadow: '0 0 6px rgba(255,255,255,0.9)'
    }
  })), lvl === 2 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: -5,
      right: -5,
      minWidth: 17,
      height: 17,
      padding: '0 3px',
      boxSizing: 'border-box',
      borderRadius: 999,
      background: 'var(--color-surface)',
      border: '2px solid var(--color-warning)',
      color: '#B9821C',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 1
    }
  }, "2"), type === 'crown' && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -size * 0.44,
      left: '50%',
      transform: 'translateX(-50%)'
    }
  }, /*#__PURE__*/React.createElement(CrownMini, {
    size: size * 0.62
  })));
}

// vine root (World 2) — sprout on a mound.
function VineGlyph({
  size = 24,
  dim = false
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    style: {
      opacity: dim ? 0.3 : 1,
      transition: 'opacity var(--motion-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "12",
    cy: "20.2",
    rx: "7",
    ry: "2.3",
    fill: "#C7A97E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 20 C12 15.5 12 13 12 10.5",
    stroke: "#5FC3B2",
    strokeWidth: "2.4",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 13.5 C9 13.5 7 11.5 6.4 8.8 C9.6 8.8 11.6 10.4 12 13.5Z",
    fill: "#A3E5D9",
    stroke: "#5FC3B2",
    strokeWidth: "1.2",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 11.5 C15 11.5 17 9.5 17.6 6.8 C14.4 6.8 12.4 8.4 12 11.5Z",
    fill: "#A3E5D9",
    stroke: "#5FC3B2",
    strokeWidth: "1.2",
    strokeLinejoin: "round"
  }));
}

// water drop (World 3) — teal droplet, optional layer-lock for buried targets.
function DropGlyph({
  size = 24,
  dim = false,
  locked = false
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      opacity: dim ? 0.4 : 1,
      transition: 'opacity var(--motion-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z",
    fill: "#A3E5D9",
    stroke: "#5FC3B2",
    strokeWidth: "1.6",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.4 15.4a2.6 2.6 0 0 0 2 2.4",
    stroke: "#CBF2EB",
    strokeWidth: "1.6",
    fill: "none",
    strokeLinecap: "round"
  })), locked && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: -3,
      right: -4,
      width: 15,
      height: 15,
      borderRadius: '50%',
      background: 'var(--color-stone)',
      border: '1.5px solid var(--color-stone-edge)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "9",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#6B5B45",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "10.5",
    width: "14",
    height: "9",
    rx: "2.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 10.5V7.5a4 4 0 0 1 8 0v3"
  }))));
}

/* ── progress atoms ─────────────────────────────────────────────────── */

function ProgressChip({
  text,
  done,
  near
}) {
  return /*#__PURE__*/React.createElement("span", {
    "data-gj-anim": true,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 28,
      padding: '0 12px',
      borderRadius: 'var(--radius-full)',
      flexShrink: 0,
      boxSizing: 'border-box',
      background: done ? 'var(--color-success)' : 'var(--color-surface-sunken)',
      color: done ? 'var(--color-text-invert)' : 'var(--color-text)',
      boxShadow: done ? '0 3px 0 color-mix(in srgb, var(--color-success) 72%, #000 18%)' : 'inset 0 1px 3px rgba(120,92,52,0.14)',
      ...NUM,
      fontSize: 'var(--text-score)',
      animation: done ? 'gj-obj-pop 420ms var(--ease-jelly) both' : near ? 'gj-obj-nudge 900ms var(--ease-inout) infinite' : 'none'
    }
  }, done && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 16,
    color: "currentColor",
    strokeWidth: 3
  }), text);
}

// dimming counter of target glyphs + "còn N" pill.
function TargetCounter({
  kind,
  total,
  remaining,
  buried = 0
}) {
  const done = remaining <= 0;
  const gone = total - remaining;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      flexWrap: 'wrap'
    }
  }, Array.from({
    length: total
  }).map((_, i) => {
    const destroyed = i < gone;
    const isBuried = !destroyed && i - gone < buried;
    return kind === 'vine' ? /*#__PURE__*/React.createElement(VineGlyph, {
      key: i,
      size: 24,
      dim: destroyed
    }) : /*#__PURE__*/React.createElement(DropGlyph, {
      key: i,
      size: 24,
      dim: destroyed,
      locked: isBuried
    });
  })), /*#__PURE__*/React.createElement("span", {
    "data-gj-anim": true,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 26,
      padding: '0 11px',
      flexShrink: 0,
      borderRadius: 'var(--radius-full)',
      boxSizing: 'border-box',
      background: done ? 'var(--color-success)' : 'var(--color-surface-sunken)',
      color: done ? 'var(--color-text-invert)' : 'var(--color-text)',
      boxShadow: done ? '0 3px 0 color-mix(in srgb, var(--color-success) 72%, #000 18%)' : 'none',
      ...NUM,
      fontSize: 'var(--text-label)',
      animation: done ? 'gj-obj-pop 420ms var(--ease-jelly) both' : 'none'
    }
  }, done ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 15,
    color: "currentColor",
    strokeWidth: 3
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      ...CAPTION,
      color: 'inherit',
      fontWeight: 800
    }
  }, "c\xF2n"), done ? 'Xong' : remaining));
}

/* ── star-tier atoms (compact secondary readout — never louder than the goal) ── */

// bare mini star — gold when earned, faint cream when not.
function MiniStar({
  filled,
  size = 13
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z",
    fill: filled ? 'var(--color-warning)' : '#EFE2C7',
    stroke: filled ? '#E2A82E' : '#DECBAA',
    strokeWidth: "1.7",
    strokeLinejoin: "round"
  }));
}

// 3-milestone strip for move-limited levels — thin rail, fills up to the current tier.
function StarStrip({
  tier = 0,
  size = 14
}) {
  const fillW = tier >= 3 ? `calc(100% - ${size}px)` : tier === 2 ? '50%' : '0%';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 74,
      height: size + 4,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: size / 2,
      right: size / 2,
      top: '50%',
      height: 3,
      transform: 'translateY(-50%)',
      borderRadius: 999,
      background: 'var(--color-surface-sunken)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: size / 2,
      top: '50%',
      height: 3,
      transform: 'translateY(-50%)',
      borderRadius: 999,
      width: fillW,
      background: 'var(--color-warning)',
      transition: 'width var(--motion-medium) var(--ease-out)'
    }
  }), [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(MiniStar, {
    filled: tier >= i + 1,
    size: size
  }))));
}

// one-line caption: bold gold current tier · muted "what's next".
function StarCaption({
  now,
  next,
  passed
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      minWidth: 0,
      lineHeight: 1
    }
  }, passed && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      height: 15,
      padding: '0 5px',
      borderRadius: 'var(--radius-full)',
      background: 'color-mix(in srgb, var(--color-success) 20%, var(--color-surface))',
      color: 'var(--color-success)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 11,
    color: "currentColor",
    strokeWidth: 3.2
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 800,
      fontSize: 10,
      letterSpacing: '0.02em'
    }
  }, "QUA M\xC0N")), /*#__PURE__*/React.createElement("span", {
    style: {
      ...NUM,
      fontSize: 12,
      color: '#C88F26',
      whiteSpace: 'nowrap'
    }
  }, now), next && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#E0CDAC',
      fontSize: 12
    }
  }, "\xB7"), next && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-caption)',
      color: 'var(--color-text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, next));
}

// move-based star strip footer (tutorial + move-limited target levels).
function StripFooter({
  stars
}) {
  if (!stars) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 6,
      marginLeft: 2
    }
  }, /*#__PURE__*/React.createElement(StarStrip, {
    tier: stars.tier || 0
  }), /*#__PURE__*/React.createElement(StarCaption, {
    now: stars.now,
    next: stars.next
  }));
}

// resolve the move-based star tier + caption for a level (explicit wins; else derive from moves).
// stars are earned by moves LEFT: more spare moves ⇒ higher tier.
function movesStars(goal) {
  const s = goal.stars;
  if (s && (s.now || s.tier != null || s.next != null)) {
    const tier = s.tier != null ? s.tier : 0;
    return {
      tier,
      now: s.now || `Đang ${tier}★`,
      next: s.next != null ? s.next : goal.moves != null ? `còn ${goal.moves} nước` : null
    };
  }
  const moves = goal.moves;
  const th = goal.starMoves;
  if (moves != null && Array.isArray(th)) {
    const tier = th.filter(t => moves >= t).length;
    return {
      tier,
      now: `Đang ${tier}★`,
      next: `còn ${moves} nước`
    };
  }
  return {
    tier: 3,
    now: 'Đang 3★',
    next: moves != null ? `còn ${moves} nước` : null
  };
}

/* ── tutorial glyph picker ──────────────────────────────────────────── */

// canonical special-block art from the design system's SVG assets.
function BlockGlyph({
  src,
  size = 32
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    width: size,
    height: size,
    alt: "",
    style: {
      display: 'block',
      filter: 'drop-shadow(0 1px 2px rgba(120,92,52,0.2))'
    }
  }));
}
function TutorialGlyph({
  variant,
  blockBase
}) {
  switch (variant) {
    case 'clearRow':
      return /*#__PURE__*/React.createElement(GridGlyph, {
        axis: "row",
        size: 28
      });
    case 'clearCol':
      return /*#__PURE__*/React.createElement(GridGlyph, {
        axis: "col",
        size: 28
      });
    case 'rotate':
      return /*#__PURE__*/React.createElement("span", {
        style: {
          width: 30,
          height: 30,
          borderRadius: '50%',
          flexShrink: 0,
          background: 'color-mix(in srgb, var(--color-gravity) 16%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
        name: "rotateCw",
        size: 19,
        color: "var(--color-gravity)",
        strokeWidth: 2.4
      }));
    case 'super1':
      return /*#__PURE__*/React.createElement(BlockGlyph, {
        src: `${blockBase}super-pink-1.svg`,
        size: 32
      });
    case 'super2':
      return /*#__PURE__*/React.createElement(BlockGlyph, {
        src: `${blockBase}super-blue-2.svg`,
        size: 32
      });
    case 'rainbow':
      return /*#__PURE__*/React.createElement(BlockGlyph, {
        src: `${blockBase}rainbow.svg`,
        size: 32
      });
    case 'rainbowSuper':
      return /*#__PURE__*/React.createElement(BlockGlyph, {
        src: `${blockBase}rainbow-2.svg`,
        size: 32
      });
    case 'combo':
      return /*#__PURE__*/React.createElement("span", {
        style: {
          width: 30,
          height: 30,
          borderRadius: '50%',
          flexShrink: 0,
          background: 'color-mix(in srgb, var(--color-warning) 26%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
        name: "x2",
        size: 19,
        color: "#B9821C",
        strokeWidth: 2.4
      }));
    default:
      return null;
  }
}

/* ── current-level identity badge (số màn toàn cục + world) ── */
// anchors the left of every bar so the player always sees which màn they're on.
function LevelBadge({
  level,
  world
}) {
  if (level == null) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'stretch',
      gap: 'var(--space-md)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 44,
      padding: '3px 9px',
      borderRadius: 12,
      lineHeight: 1,
      gap: 1,
      boxSizing: 'border-box',
      background: 'var(--color-surface-sunken)',
      boxShadow: 'inset 0 1px 3px rgba(120,92,52,0.14)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...CAPTION,
      fontSize: 9
    }
  }, "M\xC0N"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...NUM,
      fontSize: 22,
      color: 'var(--color-text)'
    }
  }, level), world && /*#__PURE__*/React.createElement("span", {
    style: {
      ...CAPTION,
      fontSize: 8.5,
      maxWidth: 64,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, world)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1.5,
      alignSelf: 'stretch',
      margin: '3px 0',
      borderRadius: 2,
      background: 'var(--color-cell-line)'
    }
  }));
}

/* ── the bar shell ──────────────────────────────────────────────────── */
function Shell({
  children,
  tall,
  footer,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      minHeight: footer ? undefined : tall ? 72 : 52,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: tall ? '9px var(--space-lg)' : footer ? '7px var(--space-lg) 8px' : '0 var(--space-lg)',
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)',
      minHeight: tall ? 54 : 40
    }
  }, children), footer);
}
function derive(status, done, ratio) {
  if (status) return status;
  if (done) return 'done';
  if (ratio >= 0.7) return 'near';
  return 'active';
}
function ObjectiveBar({
  goal,
  level = null,
  world = null,
  style = {},
  blockBase = '../../06-svg-assets/blocks/'
}) {
  if (!goal) return null;
  const kind = goal.kind;
  const lead = /*#__PURE__*/React.createElement(LevelBadge, {
    level: level,
    world: world
  });

  // ---- TARGETS : dimming counter (ALWAYS shows the move-based star strip) ----
  if (kind === 'targets') {
    return /*#__PURE__*/React.createElement(Shell, {
      style: style,
      footer: /*#__PURE__*/React.createElement(StripFooter, {
        stars: movesStars(goal)
      })
    }, lead, /*#__PURE__*/React.createElement("span", {
      style: {
        ...CAPTION
      }
    }, "M\u1EE4C TI\xCAU"), /*#__PURE__*/React.createElement(TargetCounter, {
      kind: goal.target,
      total: goal.total,
      remaining: goal.remaining,
      buried: goal.buried || 0
    }));
  }

  // ---- TUTORIAL : glyph + label + chip (move-based ⇒ 3-star strip footer) ----
  const isCombo = goal.variant === 'combo';
  const cur = goal.current || 0;
  const tgt = goal.target || 1;
  const done = cur >= tgt;
  const st = derive(goal.status, done, cur / tgt);
  // single-action tutorials drop the redundant 0/1 counter — the label + done
  // tick already say it all; only combo keeps a live ×N, and any variant shows
  // the "Xong" tick once complete.
  const showChip = isCombo || done;
  return /*#__PURE__*/React.createElement(Shell, {
    style: style,
    footer: /*#__PURE__*/React.createElement(StripFooter, {
      stars: goal.stars || null
    })
  }, lead, /*#__PURE__*/React.createElement(TutorialGlyph, {
    variant: goal.variant,
    blockBase: blockBase
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-body)',
      color: 'var(--color-text)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, goal.label), showChip && /*#__PURE__*/React.createElement(ProgressChip, {
    text: done ? isCombo ? `×${tgt}` : 'Xong' : `×${cur}`,
    done: st === 'done',
    near: st === 'near'
  }));
}
Object.assign(__ds_scope, { ObjectiveBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "03-components/08-objective-bar/ObjectiveBar.jsx", error: String((e && e.message) || e) }); }

// 03-components/09-boss-hud/BossHud.jsx
try { (() => {
/**
 * Boss UI cluster — Gravity Jelly, soft casual puzzle (NOT a combat/RPG HUD).
 *
 * Each boss has its OWN supplied artwork (transparent PNG in
 * /06-svg-assets/bosses/) — never a shared circular avatar, never boxed in a
 * ring. Mascots are EYES-ONLY (no mouth, brows or teeth).
 *   • worm  — Chú Sâu Đồng Cỏ: mint caterpillar + leaf sprouts (boss-worm.png).
 *   • trash — Kẻ Đổ Rác: lumpy brown jelly bag + scraps/cubes (boss-trash.png).
 *   • water — Thần Thác: water-god column + ring + bubbles (boss-water.png).
 * BossMascot renders the PNG; a faint purple/cyan aura sits behind worm/water.
 *
 * Pieces:
 *   • BossCard      — compact in-game / pre-boss card (mascot overflows the
 *                     left, text right: name · MÀN badge · thin shield bar ·
 *                     rule/tell chip). Radius 28, soft cocoa shadow.
 *   • BossIntroCard — the large pre-level card (adds a BOSS tag + orange CTA).
 *   • BossToast     — the small warning pill.
 *   • BossMascot / ShieldBar — building blocks, exported for reuse.
 *
 * Purple (#7E6CF0) is used ONLY as tag / glow / hairline — never a full panel.
 * Progress is a "Khiên" (shield) bar, never HP hearts; copy says "phá khiên",
 * never "gây sát thương".
 */

const GRAVITY = 'var(--color-gravity)';

/* one-time keyframes — all gentle, disabled under reduced-motion */
if (typeof document !== 'undefined' && !document.getElementById('gj-bosshud-kf')) {
  const s = document.createElement('style');
  s.id = 'gj-bosshud-kf';
  s.textContent = `
    @keyframes gj-boss-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
    @keyframes gj-boss-glow { 0%,100%{opacity:.35} 50%{opacity:.8} }
    @media (prefers-reduced-motion: reduce){ [data-gj-boss]{animation:none!important} }
  `;
  document.head.appendChild(s);
}
const DISP = {
  fontFamily: 'var(--font-display)',
  lineHeight: 'var(--leading-tight)'
};
const CAP = {
  fontFamily: 'var(--font-body)',
  fontWeight: 'var(--weight-extra)',
  letterSpacing: 'var(--tracking-wide)',
  lineHeight: 1
};
const THEMES = {
  worm: {
    color: 'var(--color-block-mint)',
    edge: 'var(--color-block-mint-edge)',
    shine: 'var(--color-block-mint-shine)'
  },
  trash: {
    color: '#D9BE94',
    edge: '#B79A6E',
    shine: '#EFDFC0'
  },
  water: {
    color: 'var(--color-block-blue)',
    edge: 'var(--color-block-blue-edge)',
    shine: 'var(--color-block-blue-shine)'
  }
};

/* ---------- inline mechanic glyphs ---------- */
function Glyph({
  name,
  size = 15,
  color = 'currentColor',
  sw = 2.2
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    style: {
      display: 'block'
    }
  };
  if (name === 'shield') return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l7 2.6v5.1c0 4.9-3.1 8.1-7 9.8-3.9-1.7-7-4.9-7-9.8V5.6L12 3z"
  }));
  if (name === 'leaf') return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M5 19c0-8 6-13 14-14 1 8-5 14-14 14z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 18c3-5 6-7 9-8"
  }));
  return null;
}

/* =====================================================================
   BOSS MASCOTS — each boss rendered from its supplied PNG art (eyes-only)
   ===================================================================== */
const MASCOT_ASSET = {
  worm: {
    file: 'boss-worm.png',
    aspect: 448 / 560
  },
  water: {
    file: 'boss-water.png',
    aspect: 467 / 560
  },
  trash: {
    file: 'boss-trash.png',
    aspect: 560 / 513
  }
};
const MASCOT_H = {
  worm: 122,
  water: 130,
  trash: 106
};
const DEFAULT_ASSET_BASE = '../../06-svg-assets/bosses/';

/**
 * BossMascot — the boss silhouette, drawn from the supplied artwork.
 * `size` is the display HEIGHT in px (defaults per kind); width follows the
 * art's aspect. `assetBase` is the path to /06-svg-assets/bosses/ relative to
 * the page (default assumes a component card two levels deep) — or pass a full
 * `src`. A faint purple/cyan aura sits behind worm & water.
 */
function BossMascot({
  kind = 'worm',
  size,
  src,
  assetBase = DEFAULT_ASSET_BASE,
  style = {}
}) {
  const a = MASCOT_ASSET[kind] || MASCOT_ASSET.worm;
  const h = size || MASCOT_H[kind] || 122;
  const w = Math.round(h * a.aspect);
  const url = src || assetBase + a.file;
  const aura = kind === 'water' ? 'radial-gradient(closest-side, rgba(126,108,240,0.18), rgba(143,182,242,0.12) 60%, transparent)' : kind === 'worm' ? 'radial-gradient(closest-side, rgba(126,108,240,0.15), transparent)' : null;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: w,
      height: h,
      ...style
    }
  }, aura && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: '-8%',
      borderRadius: '50%',
      background: aura
    }
  }), /*#__PURE__*/React.createElement("img", {
    "data-gj-boss": true,
    src: url,
    alt: "",
    draggable: "false",
    style: {
      position: 'relative',
      width: w,
      height: h,
      objectFit: 'contain',
      display: 'block',
      filter: 'drop-shadow(0 5px 7px rgba(120,92,52,0.20))',
      animation: 'gj-boss-bob 2800ms ease-in-out infinite'
    }
  }));
}

/* ---------- thin shield-progress bar ---------- */
function ShieldBar({
  current = 4,
  target = 5,
  color = 'var(--color-block-mint)',
  edge = 'var(--color-block-mint-edge)',
  height = 8
}) {
  const pct = Math.max(0, Math.min(1, target ? current / target : 0));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height,
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-surface-sunken)',
      overflow: 'hidden',
      boxShadow: 'inset 0 1px 2px rgba(120,92,52,0.18)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      right: `${(1 - pct) * 100}%`,
      borderRadius: 'var(--radius-full)',
      background: `linear-gradient(180deg, color-mix(in srgb, ${color} 72%, #fff), ${edge})`,
      boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.55)',
      transition: 'right 360ms var(--ease-out)'
    }
  }));
}
function ShieldCount({
  current,
  target
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-caption)',
      color: 'var(--color-text-muted)'
    }
  }, "Khi\xEAn"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...DISP,
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--color-text)'
    }
  }, current, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-text-muted)',
      fontSize: 12
    }
  }, "/", target)));
}

/* ---------- rule / tell chip ---------- */
function chipTone(tone) {
  if (tone === 'trash') return {
    bg: 'rgba(255,202,102,0.20)',
    fg: '#9A7326',
    disc: 'var(--color-warning)',
    discFg: '#5B4636'
  };
  if (tone === 'gravity') return {
    bg: 'rgba(126,108,240,0.12)',
    fg: 'var(--color-gravity-edge)',
    disc: 'var(--color-gravity)',
    discFg: '#fff'
  };
  return {
    bg: 'rgba(126,108,240,0.12)',
    fg: 'var(--color-gravity-edge)',
    disc: 'var(--color-gravity)',
    discFg: '#fff'
  };
}
function chipGlyph(kind, color) {
  if (kind === 'gravity') return /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "rotateCw",
    size: 12,
    color: color,
    strokeWidth: 2.6
  });
  if (kind === 'trash') return /*#__PURE__*/React.createElement(Glyph, {
    name: "leaf",
    size: 12,
    color: color,
    sw: 2.4
  });
  if (kind === 'x2') return /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x2",
    size: 12,
    color: color,
    strokeWidth: 2.6
  });
  return /*#__PURE__*/React.createElement(Glyph, {
    name: "shield",
    size: 12,
    color: color,
    sw: 2.4
  });
}
function Chip({
  kind = 'x2',
  tone = 'rule',
  role = 'tell',
  label,
  size = 'md'
}) {
  const disc = size === 'lg' ? 22 : 20;
  if (role === 'rule') {
    // calm handbook look — matches BossRule, never reads as a boss action.
    // No word label: the muted purple disc + sunken pill signal "cách phá".
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '4px 12px 4px 4px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-surface-sunken)',
        boxShadow: 'inset 0 1px 2px rgba(120,92,52,0.10)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: disc,
        height: disc,
        borderRadius: '50%',
        background: 'rgba(126,108,240,0.14)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, chipGlyph(kind, 'var(--color-gravity-edge)')), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 'var(--weight-bold)',
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, label));
  }
  // tell look — coloured alert. A small pulsing dot on the disc reads as
  // "boss sắp ra chiêu" without any word label.
  const c = chipTone(tone);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '4px 12px 4px 4px',
      borderRadius: 'var(--radius-full)',
      background: c.bg
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: disc,
      height: disc,
      borderRadius: '50%',
      background: c.disc,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, chipGlyph(kind, c.discFg), /*#__PURE__*/React.createElement("span", {
    "data-gj-boss": true,
    style: {
      position: 'absolute',
      top: -1,
      right: -1,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--color-danger)',
      border: '1.5px solid var(--color-surface)',
      animation: 'gj-boss-glow 1400ms ease-in-out infinite'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-caption)',
      color: c.fg,
      whiteSpace: 'nowrap'
    }
  }, label));
}
function LevelBadge({
  level
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      ...CAP,
      fontSize: 10,
      color: 'var(--color-text-muted)',
      background: 'var(--color-surface-sunken)',
      borderRadius: 'var(--radius-full)',
      padding: '3px 9px',
      whiteSpace: 'nowrap'
    }
  }, "M\xC0N ", level);
}
function BossTag() {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '4px 11px',
      borderRadius: 'var(--radius-full)',
      background: GRAVITY,
      color: '#fff',
      boxShadow: '0 0 0 3px rgba(126,108,240,0.14), inset 0 1px 0 rgba(255,255,255,0.3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-gj-boss": true,
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#fff',
      animation: 'gj-boss-glow 1600ms ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...CAP,
      fontSize: 11
    }
  }, "BOSS"));
}

/* =====================================================================
   1) BossCard — compact in-game / pre-boss card
   ===================================================================== */
function BossCard({
  level = 10,
  name = 'Chú Sâu Đồng Cỏ',
  kind = 'worm',
  color,
  edge,
  shine,
  assetBase,
  shield = {
    current: 4,
    target: 5
  },
  chip = {
    kind: 'x2',
    tone: 'rule',
    role: 'rule',
    label: 'Combo ×2 phá khiên'
  },
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
      paddingLeft: 120,
      paddingRight: 16,
      paddingTop: 14,
      paddingBottom: 14,
      minHeight: 118,
      borderRadius: 'var(--radius-xl)',
      background: 'var(--color-surface)',
      border: '1.5px solid rgba(126,108,240,0.22)',
      boxShadow: '0 0 0 4px rgba(126,108,240,0.07), var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 10,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 2,
      top: 0,
      bottom: 0,
      width: 118,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(BossMascot, {
    kind: kind,
    assetBase: assetBase
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 12,
      right: 14
    }
  }, /*#__PURE__*/React.createElement(LevelBadge, {
    level: level
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingRight: 52
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...DISP,
      fontWeight: 700,
      fontSize: 18,
      color: 'var(--color-text)',
      lineHeight: 1.08
    }
  }, name)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(ShieldBar, {
    current: shield.current,
    target: shield.target,
    color: color || THEMES[kind].color,
    edge: edge || THEMES[kind].edge
  })), /*#__PURE__*/React.createElement(ShieldCount, {
    current: shield.current,
    target: shield.target
  })), chip && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Chip, {
    kind: chip.kind,
    tone: chip.tone,
    role: chip.role,
    label: chip.label
  })));
}

/* =====================================================================
   2) BossIntroCard — the large pre-level card
   ===================================================================== */
function BossIntroCard({
  level = 10,
  name = 'Chú Sâu Đồng Cỏ',
  kind = 'worm',
  color,
  edge,
  shine,
  assetBase,
  shield = {
    current: 4,
    target: 5
  },
  rule = {
    kind: 'x2',
    tone: 'rule',
    role: 'rule',
    label: 'Combo ×2 phá khiên'
  },
  playLabel = 'Chơi',
  onPlay,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: 20,
      borderRadius: 'var(--radius-xl)',
      background: 'var(--color-surface)',
      border: '1.5px solid rgba(126,108,240,0.30)',
      boxShadow: '0 0 0 4px rgba(126,108,240,0.09), var(--shadow-lg)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(BossTag, null), /*#__PURE__*/React.createElement("span", {
    style: {
      ...CAP,
      fontSize: 'var(--text-caption)',
      color: 'var(--color-text-muted)'
    }
  }, "M\xC0N ", level)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 128,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(BossMascot, {
    kind: kind,
    assetBase: assetBase,
    size: 132
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...CAP,
      fontSize: 10,
      color: 'var(--color-text-muted)',
      marginBottom: 4
    }
  }, "\u0110\u1ED0I TH\u1EE6"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...DISP,
      fontWeight: 700,
      fontSize: 'var(--text-heading)',
      color: 'var(--color-text)',
      lineHeight: 1.1
    }
  }, name))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(ShieldBar, {
    current: shield.current,
    target: shield.target,
    color: color || THEMES[kind].color,
    edge: edge || THEMES[kind].edge,
    height: 9
  })), /*#__PURE__*/React.createElement(ShieldCount, {
    current: shield.current,
    target: shield.target
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    kind: rule.kind,
    tone: rule.tone,
    role: rule.role,
    label: rule.label,
    size: "lg"
  })), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "cta",
    fullWidth: true,
    icon: "play",
    onClick: onPlay
  }, playLabel));
}

/* =====================================================================
   3) BossToast — WARNING pill: what the boss is about to do (a tell)
   ===================================================================== */
function BossToast({
  kind = 'trash',
  tone,
  label = 'Lượt sau: Đổ rác',
  kicker,
  style = {}
}) {
  const t = tone || (kind === 'trash' ? 'trash' : kind === 'gravity' ? 'gravity' : 'rule');
  const c = chipTone(t);
  const glyph = kind === 'gravity' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "rotateCw",
    size: 16,
    color: c.discFg,
    strokeWidth: 2.6
  }) : kind === 'shield' ? /*#__PURE__*/React.createElement(Glyph, {
    name: "shield",
    size: 16,
    color: c.discFg,
    sw: 2.4
  }) : /*#__PURE__*/React.createElement(Glyph, {
    name: "leaf",
    size: 16,
    color: c.discFg,
    sw: 2.4
  });
  return /*#__PURE__*/React.createElement("div", {
    "data-gj-boss": true,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '7px 16px 7px 7px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-surface)',
      border: `1.5px solid ${c.disc}`,
      boxShadow: 'var(--shadow-md)',
      fontFamily: 'var(--font-body)',
      animation: 'gj-boss-bob 2600ms ease-in-out infinite',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: c.disc,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, glyph, /*#__PURE__*/React.createElement("span", {
    "data-gj-boss": true,
    style: {
      position: 'absolute',
      top: -1,
      right: -1,
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--color-danger)',
      border: '1.5px solid var(--color-surface)',
      animation: 'gj-boss-glow 1400ms ease-in-out infinite'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-label)',
      color: 'var(--color-text)',
      whiteSpace: 'nowrap'
    }
  }, label));
}

/* =====================================================================
   4) BossRule — CẨM NANG item: how to break the boss's shields (a rule,
   deliberately calm + NOT a warning, so it never reads as a boss action)
   ===================================================================== */
function BossRule({
  label = 'Combo ×2 phá khiên',
  kicker,
  icon = 'x2',
  style = {}
}) {
  const glyph = icon === 'shield' ? /*#__PURE__*/React.createElement(Glyph, {
    name: "shield",
    size: 15,
    color: "var(--color-gravity-edge)",
    sw: 2.4
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x2",
    size: 14,
    color: "var(--color-gravity-edge)",
    strokeWidth: 2.6
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '7px 16px 7px 7px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-surface-sunken)',
      boxShadow: 'inset 0 1px 2px rgba(120,92,52,0.10)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: 'rgba(126,108,240,0.14)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, glyph), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-label)',
      color: 'var(--color-text)',
      whiteSpace: 'nowrap'
    }
  }, label));
}

/* Back-compat: the old cluster export now maps to the compact BossCard. */
const BossHud = BossCard;
Object.assign(__ds_scope, { BossMascot, ShieldBar, BossCard, BossIntroCard, BossToast, BossRule, BossHud });
})(); } catch (e) { __ds_ns.__errors.push({ path: "03-components/09-boss-hud/BossHud.jsx", error: String((e && e.message) || e) }); }

// 04-screens/board-boss.jsx
try { (() => {
/* board-boss.jsx — BOSS in-game board ("① Game · Boss"), the campaign
   boss-level fight (levels 10/20/30…). Same meadow board + gravity D-pad +
   tray as the play screen, plus a purple danger vignette and a full-width
   BOSS panel that carries the fight's progress readouts:
     • boss HP bar (the objective — deplete before moves run out)
     • PHA x/y phase pips
     • MOVES left (top-right stat card)
     • current STARS earned (in the boss panel header)
   The board seeds a few STONE cells = the boss's armour to smash.
   Exposes window.GJBoardBoss. */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    JellyBlock
  } = NS;
  const EX = window.GJExtras;
  const P = window.GJBoardParts;
  const BG_SRC = '../06-svg-assets/backgrounds/meadow-bg.png';
  const CARD_SRC = '../06-svg-assets/ui/score-card.svg';
  function StatCard({
    label,
    value,
    low = false
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 76,
        aspectRatio: '1 / 1',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: CARD_SRC,
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
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 24,
        fontWeight: 700,
        color: low ? '#E97E45' : '#5B4636',
        lineHeight: 1.05,
        marginTop: 1
      }
    }, value)));
  }

  /* BOSS banner pill — crown + BOSS + level, tangerine-warning like the intro. */
  function BossBanner({
    level
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 14px',
        borderRadius: 999,
        background: 'var(--color-warning)',
        boxShadow: '0 4px 0 #E2A82E'
      }
    }, /*#__PURE__*/React.createElement(EX.Crown, {
      size: 17
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 15,
        letterSpacing: '0.1em',
        color: '#5B4636',
        whiteSpace: 'nowrap'
      }
    }, "BOSS \xB7 M\xC0N ", level));
  }

  /* The mini boss face — a gravity-purple block with the same menacing eyes
     as the Boss Intro, shrunk to sit in the HP panel. */
  function BossFace({
    size = 46
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        flexShrink: 0,
        filter: 'drop-shadow(0 3px 5px rgba(46,38,112,0.4))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false,
      style: {
        background: 'var(--color-gravity)',
        borderColor: 'var(--color-gravity-edge)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: size * 0.14
      }
    }, [0, 1].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'relative',
        width: size * 0.28,
        height: size * 0.28,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 0 0 1.5px rgba(74,53,38,0.25)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: size * 0.14,
        height: size * 0.14,
        borderRadius: '50%',
        background: '#4A3526'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -size * 0.06,
        left: i ? 'auto' : -size * 0.04,
        right: i ? -size * 0.04 : 'auto',
        width: size * 0.24,
        height: size * 0.1,
        background: 'var(--color-gravity)',
        transform: `rotate(${i ? -22 : 22}deg)`,
        borderRadius: 2
      }
    })))));
  }
  function PhasePips({
    phase,
    phases
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        gap: 4,
        alignItems: 'center'
      }
    }, Array.from({
      length: phases
    }).map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: i < phase ? 'var(--color-gravity-shine)' : 'rgba(255,255,255,0.28)',
        boxShadow: i < phase ? '0 0 5px var(--color-gravity-shine)' : 'none'
      }
    })));
  }

  /* The boss panel = objective progress. Boss face · name + stars · phase,
     then the HP bar (danger-red on a sunken purple track) with numeric. */
  function BossPanel({
    name,
    hp,
    maxHp,
    phase,
    phases,
    stars
  }) {
    const pct = Math.max(0, Math.min(1, hp / maxHp));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        boxSizing: 'border-box',
        padding: '9px 13px 9px 9px',
        borderRadius: 22,
        background: 'linear-gradient(180deg, rgba(99,83,214,0.96), rgba(46,38,112,0.96))',
        boxShadow: '0 7px 16px rgba(46,38,112,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
      }
    }, /*#__PURE__*/React.createElement(BossFace, {
      size: 48
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 14,
        color: '#fff',
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, name), /*#__PURE__*/React.createElement(EX.Stars, {
      earned: stars,
      size: 15,
      gap: 2,
      lift: false
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        position: 'relative',
        height: 14,
        borderRadius: 999,
        background: 'rgba(0,0,0,0.32)',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.35)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        right: `${(1 - pct) * 100}%`,
        borderRadius: 999,
        background: 'linear-gradient(180deg,#FFB0A2,#F08A7E)',
        boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.45)',
        transition: 'right 300ms var(--ease-out, ease)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 10,
        color: '#fff',
        textShadow: '0 1px 2px rgba(46,38,112,0.8)'
      }
    }, hp.toLocaleString('vi-VN'), " / ", maxHp.toLocaleString('vi-VN'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 9,
        letterSpacing: '0.08em',
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 1
      }
    }, "PHA ", phase, "/", phases), /*#__PURE__*/React.createElement(PhasePips, {
      phase: phase,
      phases: phases
    })))));
  }
  function BoardBoss({
    level = 20,
    name = 'Thạch Khổng Lồ',
    hp = 1240,
    maxHp = 2000,
    phase = 2,
    phases = 3,
    moves = 16,
    stars = 1,
    gravity = 'up',
    blockDirection = 'down',
    board,
    pieces,
    onPause,
    onRotate,
    onRefresh
  }) {
    // stone cells = the boss armour to smash
    const map = board || ['.........', '...SSS...', '..SBBBS..', '..SBPBS..', '...MPM...', '.YYM.SBB.', '.YYMMSB..', 'BYYMMSPPP', 'BBYMMSPPP'];
    const trayPieces = pieces || [{
      cells: [[0, 0], [1, 0], [1, 1]],
      color: 'pink'
    }, {
      cells: [[0, 0], [0, 1], [0, 2]],
      color: 'blue'
    }, {
      cells: [[0, 0], [0, 1], [1, 0], [1, 1]],
      color: 'mint'
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
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(130% 62% at 50% -8%, rgba(99,83,214,0.5), rgba(99,83,214,0.14) 45%, transparent 68%)',
        pointerEvents: 'none'
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
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(P.PauseCard, {
      onPause: onPause
    }), /*#__PURE__*/React.createElement(BossBanner, {
      level: level
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "L\u01AF\u1EE2T",
      value: moves,
      low: moves <= 5
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement(BossPanel, {
      name: name,
      hp: hp,
      maxHp: maxHp,
      phase: phase,
      phases: phases,
      stars: stars
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(P.GravityPad, {
      active: gravity,
      onRotate: onRotate
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement(P.BoardPanel, {
      board: map,
      direction: blockDirection
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(P.TrayDock, {
      pieces: trayPieces
    }), /*#__PURE__*/React.createElement(P.RefreshFab, {
      onClick: onRefresh
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 6
      }
    })));
  }
  window.GJBoardBoss = BoardBoss;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/board-boss.jsx", error: String((e && e.message) || e) }); }

// 04-screens/board-campaign.jsx
try { (() => {
/* board-campaign.jsx — CAMPAIGN in-game board ("① Game · Chiến dịch").
   Same meadow backdrop, board frame, tray + refresh FAB, and the SAME 3-slot
   HUD structure as the canonical endless "① Game" / "① Game · Mục tiêu" screens
   (stat · gravity D-pad · pause), reused from window.GJBoardParts — but the
   endless SCORE slot is a LƯỢT (moves) stat card, plus two campaign-only
   readouts a level needs:
     • current STARS earned    — level badge under the HUD (score thresholds live)
     • OBJECTIVE progress bar   — a cream banner of goal chips (cleared / target)
   Exposes window.GJBoardCampaign. */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    JellyBlock
  } = NS;
  const EX = window.GJExtras;
  const P = window.GJBoardParts;
  const BG_SRC = '../06-svg-assets/backgrounds/meadow-bg.png';
  const CARD_SRC = '../06-svg-assets/ui/score-card.svg';

  /* Reuse the cream score-card art for any labelled stat (here: LƯỢT). Turns
     tangerine-warning when moves run low so the player feels the pressure. */
  function StatCard({
    label,
    value,
    low = false
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 76,
        aspectRatio: '1 / 1',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: CARD_SRC,
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
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 24,
        fontWeight: 700,
        color: low ? '#E97E45' : '#5B4636',
        lineHeight: 1.05,
        marginTop: 1
      }
    }, value)));
  }

  /* Level badge — world/level small caps + a live 3-star row (how many stars
     the current score has secured). Sits on a soft cream lozenge over grass. */
  function LevelBadge({
    level,
    world,
    stars
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        padding: '7px 16px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.9)',
        boxShadow: '0 3px 10px rgba(120,92,52,0.18), inset 0 1px 0 rgba(255,255,255,0.95)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.05em',
        color: '#9B886F',
        lineHeight: 1,
        whiteSpace: 'nowrap'
      }
    }, "M\xC0N ", level, " \xB7 ", world.toUpperCase()), /*#__PURE__*/React.createElement(EX.Stars, {
      earned: stars,
      size: 19,
      gap: 3,
      lift: false
    }));
  }
  const CHECK = /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 13l4 4 10-11"
  }));

  /* One objective: a mini jelly of the target colour + "cleared / target".
     When complete the count is swapped for a green check disc on the block. */
  function GoalItem({
    color,
    cleared,
    target
  }) {
    const done = cleared >= target;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        filter: 'drop-shadow(0 2px 3px rgba(120,92,52,0.18))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: color,
      size: 30,
      showEyes: true,
      direction: "down"
    }), done && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#6FCF7F',
        boxShadow: '0 2px 0 #4FA95F, 0 2px 5px rgba(120,92,52,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, CHECK)), !done && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 15,
        lineHeight: 1,
        color: '#5B4636',
        whiteSpace: 'nowrap'
      }
    }, cleared, "/", target));
  }
  function ObjectiveBanner({
    goals
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 20,
        boxSizing: 'border-box',
        background: 'rgba(255,247,236,0.94)',
        boxShadow: '0 5px 14px rgba(120,92,52,0.16), inset 0 1px 0 rgba(255,255,255,0.85)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        paddingRight: 9,
        borderRight: '2px solid #EADCC6',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(EX.Target, {
      size: 16,
      color: "#9B886F"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: '0.06em',
        color: '#9B886F',
        whiteSpace: 'nowrap'
      }
    }, "M\u1EE4C TI\xCAU")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }
    }, goals.map((g, i) => /*#__PURE__*/React.createElement(GoalItem, {
      key: i,
      color: g.color,
      cleared: g.cleared,
      target: g.target
    }))));
  }
  function BoardCampaign({
    level = 23,
    world = 'Sông & Thác',
    moves = 18,
    stars = 2,
    gravity = 'up',
    goals,
    blockDirection = 'down',
    board,
    pieces,
    onPause,
    onRotate,
    onRefresh
  }) {
    const g = goals || [{
      color: 'mint',
      cleared: 18,
      target: 18
    }, {
      color: 'pink',
      cleared: 7,
      target: 12
    }, {
      color: 'blue',
      cleared: 4,
      target: 10
    }];
    const map = board || ['.........', '.........', '....PP...', '....PP...', '...M..BB.', '.YYM.SBB.', '.YYMMSB..', 'BYYMMSPPP', 'BBYMMSPPP'];
    const trayPieces = pieces || [{
      cells: [[0, 0], [1, 0], [1, 1]],
      color: 'mint'
    }, {
      cells: [[0, 0], [0, 1], [0, 2]],
      color: 'pink'
    }, {
      cells: [[0, 0], [0, 1], [1, 0], [1, 1]],
      color: 'blue'
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
        padding: '12px 12px 16px',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "L\u01AF\u1EE2T",
      value: moves,
      low: moves <= 5
    }), /*#__PURE__*/React.createElement(P.GravityPad, {
      active: gravity,
      onRotate: onRotate
    }), /*#__PURE__*/React.createElement(P.PauseCard, {
      onPause: onPause
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement(LevelBadge, {
      level: level,
      world: world,
      stars: stars
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement(ObjectiveBanner, {
      goals: g
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(P.BoardPanel, {
      board: map,
      direction: blockDirection
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(P.TrayDock, {
      pieces: trayPieces
    }), /*#__PURE__*/React.createElement(P.RefreshFab, {
      onClick: onRefresh
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 6
      }
    })));
  }
  window.GJBoardCampaign = BoardCampaign;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/board-campaign.jsx", error: String((e && e.message) || e) }); }

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
  const BG_SRC = '../06-svg-assets/backgrounds/meadow-bg.png';
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
            borderRadius: Math.max(6, Math.round(cell * 0.28)),
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

// 04-screens/boss-intro-screen.jsx
try { (() => {
/* boss-intro-screen.jsx — BOSS INTRO. Dramatic gravity-purple stage, big
   menacing boss jelly, BOSS banner, world/level, warning, Challenge CTA.
   Exposes window.GJBossIntroScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Button,
    JellyBlock,
    Icon
  } = NS;
  const EX = window.GJExtras;
  function BossIntroScreen({
    level = 20,
    world = 'Rừng rậm',
    onChallenge,
    onClose
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
        overflow: 'hidden',
        background: 'radial-gradient(120% 90% at 50% 30%, #6353D6 0%, #4B3FB0 55%, #2E2670 100%)'
      }
    }, Array.from({
      length: 12
    }).map((_, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        top: '38%',
        left: '50%',
        width: 3,
        height: 220,
        background: 'linear-gradient(var(--color-gravity-shine), transparent)',
        opacity: 0.18,
        transformOrigin: 'top center',
        transform: `rotate(${i * 30}deg)`
      }
    })), /*#__PURE__*/React.createElement("button", {
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
        background: 'rgba(255,255,255,0.16)',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 20px',
        borderRadius: 999,
        background: 'var(--color-warning)',
        boxShadow: '0 4px 0 #E2A82E',
        marginBottom: 'var(--space-xl)',
        zIndex: 1
      }
    }, /*#__PURE__*/React.createElement(EX.Crown, {
      size: 20
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-heading)',
        letterSpacing: '0.12em',
        color: 'var(--color-text)'
      }
    }, "BOSS")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        zIndex: 1,
        animation: 'gj-bob 2200ms ease-in-out infinite'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: -18,
        borderRadius: '40%',
        background: 'var(--color-gravity-shine)',
        opacity: 0.3,
        filter: 'blur(14px)'
      }
    }), /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: 132,
      style: {
        background: 'var(--color-gravity)',
        borderColor: 'var(--color-gravity-edge)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16
      }
    }, [0, 1].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'relative',
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 0 0 2px rgba(74,53,38,0.25)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 17,
        height: 17,
        borderRadius: '50%',
        background: '#4A3526'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -3,
        left: i ? 'auto' : -2,
        right: i ? -2 : 'auto',
        width: 30,
        height: 12,
        background: 'var(--color-gravity)',
        transform: `rotate(${i ? -22 : 22}deg)`,
        borderRadius: 2
      }
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        marginTop: 'var(--space-xl)',
        zIndex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 'var(--text-caption)',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-gravity-shine)'
      }
    }, "M\xC0N ", level, " \xB7 ", world.toUpperCase()), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: '4px 0 0',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-title)',
        color: '#fff'
      }
    }, "Th\u1EA1ch Kh\u1ED5ng L\u1ED3"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '6px 0 0',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        color: 'rgba(255,255,255,0.8)',
        maxWidth: 250
      }
    }, "Ph\xE1 l\u1EDBp v\u1ECF \u0111\xE1 tr\u01B0\u1EDBc khi h\u1EBFt l\u01B0\u1EE3t xoay. C\u1EA9n th\u1EADn \u2014 n\xF3 ph\u1EA3n \u0111\xF2n!")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        marginTop: 'var(--space-xl)',
        zIndex: 1
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "gravity",
      size: "cta",
      icon: "rotateCw",
      fullWidth: true,
      onClick: onChallenge
    }, "TH\xC1CH \u0110\u1EA4U")));
  }
  window.GJBossIntroScreen = BossIntroScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/boss-intro-screen.jsx", error: String((e && e.message) || e) }); }

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
            borderRadius: Math.round(cell * 0.28),
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
    }, /*#__PURE__*/React.createElement(SpecialBlock, {
      type: "super",
      color: "pink",
      size: 46
    }))),
    rainbow: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "3\xD73 \u0111\u1EE7 ba m\xE0u"
    }, /*#__PURE__*/React.createElement(MiniBoard, {
      cell: 18,
      rows: ['YYY', 'MMM', 'BBB']
    })), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "Th\u1EA1ch C\u1EA7u V\u1ED3ng"
    }, /*#__PURE__*/React.createElement(SpecialBlock, {
      type: "rainbow",
      size: 46
    }))),
    superL2: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "2 Th\u1EA1ch Ho\xE0ng Gia"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(SpecialBlock, {
      type: "super",
      color: "blue",
      size: 36
    }), /*#__PURE__*/React.createElement(SpecialBlock, {
      type: "super",
      color: "blue",
      size: 36
    }))), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "Vua Th\u1EA1ch"
    }, /*#__PURE__*/React.createElement(SpecialBlock, {
      type: "super",
      color: "blue",
      size: 48,
      lvl: 2
    }))),
    rainbowSuper: () => /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement(Stage, {
      label: "2 k\xEDp n\u1ED5"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(SpecialBlock, {
      type: "rainbow",
      size: 34
    }), /*#__PURE__*/React.createElement(SpecialBlock, {
      type: "super",
      color: "yellow",
      size: 34
    }))), /*#__PURE__*/React.createElement(Flow, null), /*#__PURE__*/React.createElement(Stage, {
      label: "Ho\xE0ng \u0110\u1EBF C\u1EA7u V\u1ED3ng"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: 12
      }
    }, /*#__PURE__*/React.createElement(SpecialBlock, {
      type: "crown",
      size: 48
    })))),
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
    SpecialBlock
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
    SpecialBlock
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
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement(MiniBoard, {
          cell: 15,
          rows: ['YYY', 'MMM', 'BBB']
        }));
      case 'super':
        return /*#__PURE__*/React.createElement(ThumbWell, {
          tint: "var(--color-block-pink-shine)"
        }, /*#__PURE__*/React.createElement(SpecialBlock, {
          type: "super",
          color: "pink",
          size: 52
        }));
      case 'superL2':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 4
          }
        }, /*#__PURE__*/React.createElement(SpecialBlock, {
          type: "super",
          color: "blue",
          size: 34
        }), /*#__PURE__*/React.createElement(SpecialBlock, {
          type: "super",
          color: "blue",
          size: 34,
          lvl: 2
        })));
      case 'rainbowSuper':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement("div", {
          style: {
            paddingTop: 10
          }
        }, /*#__PURE__*/React.createElement(SpecialBlock, {
          type: "crown",
          size: 44
        })));
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
        }, /*#__PURE__*/React.createElement(SpecialBlock, {
          type: "rainbow",
          size: 38
        }), /*#__PURE__*/React.createElement(MiniBoard, {
          cell: 13,
          rows: ['Y', 'M', 'B']
        })));
      case 'blastRainbowSuper':
        return /*#__PURE__*/React.createElement(ThumbWell, null, /*#__PURE__*/React.createElement("div", {
          style: {
            paddingTop: 10
          }
        }, /*#__PURE__*/React.createElement(SpecialBlock, {
          type: "crown",
          color: "pink",
          size: 42
        })));
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
        background: 'url(../06-svg-assets/backgrounds/cam-nang-bg.png) center top / cover no-repeat, var(--color-bg)'
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
/* home-screen.jsx — HOME = painted meadow art (home-camp-bg.png, logo baked in)
   + slim top HUD (KỶ LỤC + hearts/life-regen) + twinkling sparkles over the
   arch gate, the guidebook and the ancient stone disc. Exposes window.GJHomeScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Icon
  } = NS;
  const BG_BY_WORLD = {
    1: '../06-svg-assets/backgrounds/home-world-1-bg.png',
    2: '../06-svg-assets/backgrounds/home-world-2-bg.png',
    3: '../06-svg-assets/backgrounds/home-world-3-bg.png'
  };
  const BG = BG_BY_WORLD[1];
  const PANEL = '../06-svg-assets/ui/home-panel.png';
  const BTN = '../06-svg-assets/ui/button-frame.png';
  const BTN_GREEN = '../06-svg-assets/ui/button-frame-green.png';
  const BTN_ORANGE = '../06-svg-assets/ui/button-frame-orange.png';
  const IC_CAMPAIGN = '../06-svg-assets/ui/btn-campaign.png';
  const IC_INFINITE = '../06-svg-assets/ui/btn-infinite.png';
  const IC_GUIDE = '../06-svg-assets/ui/btn-guide.png';
  const IC_SETTING = '../06-svg-assets/ui/btn-setting.png';
  const IC_LEADER = '../06-svg-assets/ui/btn-leaderboard.png';

  /* Icon button: painted PNG that depresses on press. Sized by HEIGHT (`h`, a CSS
     length) so the near-square icons fit the short panel; width follows art aspect. */
  function IconButton({
    icon,
    label,
    onClick
  }) {
    const [press, setPress] = React.useState(false);
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      onPointerDown: () => setPress(true),
      onPointerUp: () => setPress(false),
      onPointerLeave: () => setPress(false),
      "aria-label": label,
      style: {
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        transform: `scale(${press ? 0.93 : 1})`,
        transition: 'transform .12s cubic-bezier(.34,1.56,.64,1)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: icon,
      alt: "",
      style: {
        width: '100%',
        height: 'auto',
        display: 'block',
        userSelect: 'none',
        filter: 'drop-shadow(0 4px 6px rgba(120,92,52,0.3))'
      }
    }));
  }
  const STAR = 'M12 0c.9 6.6 4.4 10.1 11 11-6.6.9-10.1 4.4-11 11-.9-6.6-4.4-10.1-11-11 6.6-.9 10.1-4.4 11-11z';
  const fmt = s => {
    const m = Math.floor(s / 60),
      r = s % 60;
    return m + ':' + String(r).padStart(2, '0');
  };

  /* tiny deterministic PRNG so sparkles are stable across re-renders */
  function rng(seed) {
    return function () {
      seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* A twinkling cluster of sparkles scattered around (cx,cy) within ±rx/±ry (%). */
  function Sparkles({
    cx,
    cy,
    rx,
    ry,
    count,
    seed
  }) {
    const r = rng(seed);
    const items = [];
    for (let i = 0; i < count; i++) {
      const x = cx + (r() * 2 - 1) * rx;
      const y = cy + (r() * 2 - 1) * ry;
      const size = 7 + r() * 11;
      const delay = (r() * 2.6).toFixed(2);
      const dur = (1.5 + r() * 1.4).toFixed(2);
      const gold = r() < 0.5;
      const glow = gold ? '#FFD46B' : '#FFFFFF';
      items.push(/*#__PURE__*/React.createElement("span", {
        key: i,
        className: "gj-spk",
        style: {
          position: 'absolute',
          left: x + '%',
          top: y + '%',
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          animationDelay: delay + 's',
          animationDuration: dur + 's'
        }
      }, /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 24",
        width: size,
        height: size,
        style: {
          display: 'block',
          filter: `drop-shadow(0 0 ${Math.round(size * 0.45)}px ${glow})`
        }
      }, /*#__PURE__*/React.createElement("path", {
        d: STAR,
        fill: gold ? '#FFF1CE' : '#FFFFFF'
      }))));
    }
    return /*#__PURE__*/React.createElement("div", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
      }
    }, items);
  }

  /* Cánh hoa bay — petals drifting down across the meadow. Each petal falls
     vertically (outer) while swaying + tumbling (inner). Deterministic via seed. */
  const PETAL_COLORS = [['#FFFFFF', '#FBE7EF'],
  // white daisy
  ['#FBD0DF', '#F7A9C0'],
  // pink
  ['#FFF1CE', '#FFE3A3'],
  // butter yellow
  ['#F7A9C0', '#E576A0'] // deep pink
  ];
  function Petals({
    count = 24,
    seed = 7
  }) {
    const r = rng(seed);
    const items = [];
    for (let i = 0; i < count; i++) {
      const left = (r() * 100).toFixed(1);
      const w = 13 + r() * 13; // petal width px
      const fallDur = (5.5 + r() * 5).toFixed(2); // drift speed
      const swayDur = (1.8 + r() * 1.6).toFixed(2);
      const delay = (-r() * parseFloat(fallDur)).toFixed(2); // start mid-flight
      const [c1, c2] = PETAL_COLORS[Math.floor(r() * PETAL_COLORS.length)];
      const drift = (r() < 0.5 ? -1 : 1) * (10 + r() * 16);
      items.push(/*#__PURE__*/React.createElement("span", {
        key: i,
        className: "gj-petal-fall",
        style: {
          position: 'absolute',
          left: left + '%',
          top: 0,
          animationDuration: fallDur + 's',
          animationDelay: delay + 's',
          '--gj-drift': drift + 'px'
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "gj-petal-sway",
        style: {
          display: 'block',
          animationDuration: swayDur + 's'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'block',
          width: w,
          height: w * 1.35,
          background: `radial-gradient(120% 120% at 30% 20%, ${c1}, ${c2})`,
          borderRadius: '52% 52% 52% 8%',
          boxShadow: 'inset 0 -2px 3px rgba(0,0,0,0.08)',
          filter: 'drop-shadow(0 2px 3px rgba(90,70,54,0.28))',
          opacity: 0.96
        }
      }))));
    }
    return /*#__PURE__*/React.createElement("div", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 3
      }
    }, items);
  }
  function GateButton({
    label,
    x,
    y,
    width,
    frame = BTN,
    edge = '#0B4E7A',
    onClick
  }) {
    const [press, setPress] = React.useState(false);
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      onPointerDown: () => setPress(true),
      onPointerUp: () => setPress(false),
      onPointerLeave: () => setPress(false),
      "aria-label": label,
      style: {
        position: 'absolute',
        left: x + '%',
        top: y + '%',
        width,
        transform: `translate(-50%,-50%) scale(${press ? 0.95 : 1})`,
        transition: 'transform .1s ease',
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        filter: 'drop-shadow(0 7px 11px rgba(30,55,80,0.38))'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: frame,
      alt: "",
      style: {
        width: '100%',
        display: 'block',
        userSelect: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: '13%',
        right: '13%',
        top: 0,
        bottom: '4%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '3.3cqw',
        lineHeight: 1,
        letterSpacing: '0.02em',
        color: '#fff',
        whiteSpace: 'nowrap',
        textShadow: `0 2px 0 ${edge}, 0 0 1px ${edge}, 0 3px 6px rgba(8,45,75,0.5)`
      }
    }, label));
  }
  const fmtChip = (children, key) => /*#__PURE__*/React.createElement("div", {
    key: key,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 11px',
      background: 'rgba(255,255,255,0.9)',
      borderRadius: 999,
      boxShadow: '0 3px 9px rgba(60,44,24,0.22)',
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 14,
      color: 'var(--color-text)'
    }
  }, children);
  function Clock({
    size = 13,
    color
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "2.6",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "8.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 7.5v5l3 1.8"
    }));
  }
  function HomeScreen({
    best = 28640,
    hearts = 4,
    maxHearts = 5,
    regenSeconds = 750,
    petals = true,
    world = 1,
    onCampaign,
    onPlay,
    onGuide,
    onTools
  }) {
    const bg = BG_BY_WORLD[world] || BG;
    const [hp, setHp] = React.useState(Math.min(hearts, maxHearts));
    const [left, setLeft] = React.useState(regenSeconds);
    React.useEffect(() => {
      if (hp >= maxHearts) return;
      const id = setInterval(() => {
        setLeft(s => {
          if (s <= 1) {
            setHp(h => Math.min(h + 1, maxHearts));
            return regenSeconds;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }, [hp, maxHearts, regenSeconds]);
    const full = hp >= maxHearts;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
        background: 'linear-gradient(180deg,#8ecdf3,#bce5fb)'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-spk{0%,100%{opacity:0;transform:scale(.25) rotate(0deg)}45%{opacity:1;transform:scale(1) rotate(35deg)}55%{opacity:1;transform:scale(1) rotate(45deg)}}
          .gj-spk{display:block;animation-name:gj-spk;animation-timing-function:ease-in-out;animation-iteration-count:infinite;transform-origin:center}
          @keyframes gj-petal-fall{0%{transform:translateY(-12%) translateX(0);opacity:0}8%{opacity:1}90%{opacity:1}100%{transform:translateY(112%) translateX(var(--gj-drift,0px));opacity:0}}
          @keyframes gj-petal-sway{0%{transform:translateX(-7px) rotate(-32deg)}100%{transform:translateX(7px) rotate(34deg)}}
          .gj-petal-fall{animation-name:gj-petal-fall;animation-timing-function:linear;animation-iteration-count:infinite;will-change:transform}
          .gj-petal-sway{animation-name:gj-petal-sway;animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-direction:alternate;will-change:transform}
          @media (prefers-reduced-motion: reduce){.gj-spk{animation:none!important;opacity:.85}.gj-petal-fall,.gj-petal-sway{animation:none!important;opacity:0}}
        `), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        aspectRatio: '821 / 1916',
        containerType: 'inline-size'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: bg,
      alt: "Gravity Jelly",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none'
      }
    }), petals && /*#__PURE__*/React.createElement(Petals, {
      count: 24,
      seed: 7
    }), /*#__PURE__*/React.createElement("img", {
      src: PANEL,
      alt: "",
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        left: '6%',
        right: '6%',
        top: '72.5%',
        bottom: '2.5%',
        width: '88%',
        height: '25%',
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 8px 16px rgba(120,92,52,0.28))'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '6%',
        right: '6%',
        top: '75%',
        bottom: '5%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        width: '66cqw',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4cqw'
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: IC_CAMPAIGN,
      label: "Chi\u1EBFn d\u1ECBch",
      onClick: onCampaign
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: IC_INFINITE,
      label: "Endless",
      onClick: onPlay
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        width: '66cqw',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4cqw'
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: IC_GUIDE,
      label: "C\u1EA9m nang",
      onClick: onGuide
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: IC_LEADER,
      label: "B\u1EA3ng x\u1EBFp h\u1EA1ng",
      onClick: onTools
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: IC_SETTING,
      label: "C\xE0i \u0111\u1EB7t",
      onClick: onTools
    })))));
  }
  window.GJHomeScreen = HomeScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/home-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/leaderboard-screen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* leaderboard-screen.jsx — LEADERBOARD. Friends/Global tabs, top-3 podium
   with jelly avatars, ranked rows, highlighted current player. Exposes
   window.GJLeaderboardScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    JellyBlock,
    Icon
  } = NS;
  const EX = window.GJExtras;
  const AV = ['yellow', 'mint', 'pink', 'blue'];
  function Avatar({
    color,
    size = 44,
    expr = 'normal'
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        background: `var(--color-block-${color})`,
        border: '3px solid var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: color,
      size: size + 6,
      expression: expr,
      style: {
        borderRadius: 0,
        border: 'none',
        boxShadow: 'none'
      }
    }));
  }
  function Podium({
    rank,
    name,
    score,
    color
  }) {
    const h = rank === 1 ? 96 : rank === 2 ? 72 : 58;
    const medal = rank === 1 ? 'var(--color-warning)' : rank === 2 ? '#CFC3AE' : '#E0A878';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        width: 84,
        alignSelf: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, rank === 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -18,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    }, /*#__PURE__*/React.createElement(EX.Crown, {
      size: 24
    })), /*#__PURE__*/React.createElement(Avatar, {
      color: color,
      size: rank === 1 ? 56 : 48,
      expr: rank === 1 ? 'happy' : 'normal'
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: medal,
        border: '2px solid var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 11,
        color: 'var(--color-text)'
      }
    }, rank)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, name), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: h,
        borderRadius: '12px 12px 0 0',
        background: `linear-gradient(180deg, color-mix(in srgb, ${medal} 60%, var(--color-surface)), color-mix(in srgb, ${medal} 30%, var(--color-surface)))`,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 8,
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)'
      }
    }, score.toLocaleString('vi-VN'))));
  }
  function Row({
    rank,
    name,
    score,
    color,
    you
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: '8px var(--space-md)',
        borderRadius: 'var(--radius-lg)',
        background: you ? 'color-mix(in srgb, var(--color-primary) 16%, var(--color-surface))' : 'var(--color-surface)',
        boxShadow: you ? '0 0 0 2px var(--color-primary)' : 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        textAlign: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text-muted)'
      }
    }, rank), /*#__PURE__*/React.createElement(Avatar, {
      color: color,
      size: 40
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)'
      }
    }, you ? 'Bạn' : name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)'
      }
    }, score.toLocaleString('vi-VN')));
  }
  function LeaderboardScreen({
    tab = 'friends',
    onTab,
    onBack
  }) {
    const [t, setT] = React.useState(tab);
    const setTab = k => {
      setT(k);
      onTab && onTab(k);
    };
    const rows = [{
      name: 'Mai',
      score: 9120,
      color: 'pink'
    }, {
      name: 'Tú',
      score: 8740,
      color: 'blue'
    }, {
      name: 'Bạn',
      score: 8210,
      color: 'yellow',
      you: true
    }, {
      name: 'Khoa',
      score: 7650,
      color: 'mint'
    }, {
      name: 'Linh',
      score: 6980,
      color: 'pink'
    }];
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
    }, "X\u1EBFp h\u1EA1ng")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        padding: 4,
        background: 'var(--color-surface-sunken)',
        borderRadius: 999,
        margin: '0 var(--space-lg) var(--space-md)'
      }
    }, [['friends', 'Bạn bè'], ['global', 'Toàn cầu']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
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
    }, l))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 var(--space-lg) var(--space-xl)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 'var(--space-sm)',
        margin: 'var(--space-lg) 0 var(--space-lg)'
      }
    }, /*#__PURE__*/React.createElement(Podium, {
      rank: 2,
      name: "T\xFA",
      score: 8740,
      color: "blue"
    }), /*#__PURE__*/React.createElement(Podium, {
      rank: 1,
      name: "Mai",
      score: 9120,
      color: "pink"
    }), /*#__PURE__*/React.createElement(Podium, {
      rank: 3,
      name: "B\u1EA1n",
      score: 8210,
      color: "yellow"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)'
      }
    }, rows.map((r, i) => /*#__PURE__*/React.createElement(Row, _extends({
      key: i,
      rank: i + 1
    }, r))))));
  }
  window.GJLeaderboardScreen = LeaderboardScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/leaderboard-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/level-intro-screen.jsx
try { (() => {
/* level-intro-screen.jsx — LEVEL INTRO (updated to the new objective system).
   Pre-level soft sheet: "Màn X · <Tên>" + world chip, a bold OBJECTIVE block
   (big hero glyph + goal sentence from the catalogue), a 3-star THRESHOLD row
   (per-unit), the level's gravity ROTATION BUDGET chip + optional NEW-MECHANIC
   chip, and the BẮT ĐẦU primary CTA. Exposes window.GJLevelIntroScreen.

   goal descriptor (one of):
     { kind:'tutorial', variant, title }      // "Tạo 1 ô Thạch Cầu Vồng"
     { kind:'targets', target:'vine'|'drop', total, title } // "Phá 3 giọt nước"
     { kind:'score', target, title }          // "Đạt 450 điểm"
     { kind:'boss', name, hp, title }          // "Hạ Thần Thác — máu 10"
   stars = { unit, values:[t3,t2,t1], prefix3 }  moves/score thresholds
   mechanic = { key:'vine'|'flow'|'boss', label } */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Button,
    JellyBlock,
    Icon
  } = NS;
  const EX = window.GJExtras;
  const JPAL = {
    yellow: ['#FFE3A3', '#E8B85C'],
    mint: ['#A3E5D9', '#5FC3B2'],
    pink: ['#F7A9C0', '#E576A0'],
    blue: ['#B3C7F7', '#7E9CE8']
  };

  /* ── HERO GLYPHS (≈104dp) ─────────────────────────────────────────── */
  function SpecialHero({
    type = 'rainbow',
    color = 'pink',
    size = 104,
    lvl = 1
  }) {
    const r = Math.round(size * 0.26);
    const rainbow = type === 'rainbow' || type === 'crown';
    const pal = JPAL[color] || JPAL.pink;
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: size,
        height: size,
        borderRadius: r,
        boxSizing: 'border-box',
        position: 'relative',
        background: rainbow ? 'conic-gradient(from 210deg,#F7A9C0,#FFE3A3,#A3E5D9,#B3C7F7,#F7A9C0)' : pal[0],
        border: `4px solid ${rainbow ? '#E576A0' : pal[1]}`,
        boxShadow: '0 0 0 3px var(--color-warning), var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 4,
        left: '15%',
        right: '15%',
        height: '30%',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '50%'
      }
    }), !rainbow ? /*#__PURE__*/React.createElement("svg", {
      width: size * 0.5,
      height: size * 0.5,
      viewBox: "0 0 24 24",
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z",
      fill: "#FFF6DD",
      stroke: "#E2A82E",
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    })) : /*#__PURE__*/React.createElement("span", {
      style: {
        width: size * 0.34,
        height: size * 0.34,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.95)',
        boxShadow: '0 0 10px rgba(255,255,255,0.9)'
      }
    })), lvl === 2 && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: -6,
        right: -6,
        width: 28,
        height: 28,
        borderRadius: 999,
        background: 'var(--color-surface)',
        border: '3px solid var(--color-warning)',
        color: '#B9821C',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, "2"), type === 'crown' && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -size * 0.4,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    }, /*#__PURE__*/React.createElement(EX.Crown, {
      size: size * 0.5
    })));
  }
  function DropHero({
    size = 104,
    count
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex',
        filter: 'drop-shadow(0 6px 8px rgba(95,195,178,0.35))'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z",
      fill: "#A3E5D9",
      stroke: "#5FC3B2",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9.2 15.2a2.8 2.8 0 0 0 2.2 2.6",
      stroke: "#CBF2EB",
      strokeWidth: "1.6",
      fill: "none",
      strokeLinecap: "round"
    })), count != null && /*#__PURE__*/React.createElement(CountBadge, {
      n: count
    }));
  }
  function VineHero({
    size = 104,
    count
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex',
        filter: 'drop-shadow(0 6px 8px rgba(95,195,178,0.3))'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: "12",
      cy: "20.2",
      rx: "7.5",
      ry: "2.4",
      fill: "#C7A97E"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 20 C12 15 12 12.5 12 9.5",
      stroke: "#5FC3B2",
      strokeWidth: "2.6",
      fill: "none",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 13.5 C8.6 13.5 6.4 11.3 5.8 8.4 C9.4 8.4 11.6 10.2 12 13.5Z",
      fill: "#A3E5D9",
      stroke: "#5FC3B2",
      strokeWidth: "1.2",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 11 C15.4 11 17.6 8.8 18.2 5.9 C14.6 5.9 12.4 7.7 12 11Z",
      fill: "#A3E5D9",
      stroke: "#5FC3B2",
      strokeWidth: "1.2",
      strokeLinejoin: "round"
    })), count != null && /*#__PURE__*/React.createElement(CountBadge, {
      n: count
    }));
  }
  function ScoreHero({
    size = 104,
    target
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement(EX.FilledStar, {
      size: size,
      earned: true
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: size * 0.28,
        color: '#B9821C',
        textShadow: '0 1px 0 rgba(255,255,255,0.6)'
      }
    }, target != null ? target.toLocaleString('vi-VN') : ''));
  }
  function BossHero({
    size = 104,
    hp
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex',
        filter: 'drop-shadow(0 6px 10px rgba(46,38,112,0.4))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false,
      style: {
        background: 'var(--color-gravity)',
        borderColor: 'var(--color-gravity-edge)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: size * 0.13
      }
    }, [0, 1].map(i => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: 'relative',
        width: size * 0.26,
        height: size * 0.26,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: size * 0.13,
        height: size * 0.13,
        borderRadius: '50%',
        background: '#4A3526'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -size * 0.05,
        left: i ? 'auto' : -size * 0.03,
        right: i ? -size * 0.03 : 'auto',
        width: size * 0.22,
        height: size * 0.09,
        background: 'var(--color-gravity)',
        transform: `rotate(${i ? -22 : 22}deg)`,
        borderRadius: 2
      }
    })))), hp != null && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: -8,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        padding: '3px 9px',
        borderRadius: 999,
        background: 'var(--color-danger)',
        boxShadow: '0 3px 0 #C96155',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 13,
        color: '#fff',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "heart",
      size: 13,
      color: "#fff",
      strokeWidth: 2.4
    }), hp));
  }
  function CountBadge({
    n
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: -6,
        right: -6,
        minWidth: 30,
        height: 30,
        padding: '0 7px',
        boxSizing: 'border-box',
        borderRadius: 999,
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-md)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 17,
        color: 'var(--color-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, n);
  }
  function Hero({
    goal,
    size = 58
  }) {
    switch (goal.kind) {
      case 'targets':
        return goal.target === 'vine' ? /*#__PURE__*/React.createElement(VineHero, {
          size: size,
          count: goal.total
        }) : /*#__PURE__*/React.createElement(DropHero, {
          size: size,
          count: goal.total
        });
      case 'score':
        return /*#__PURE__*/React.createElement(ScoreHero, {
          size: size,
          target: goal.target
        });
      case 'boss':
        return /*#__PURE__*/React.createElement(BossHero, {
          size: size,
          hp: goal.hp
        });
      default:
        {
          const v = goal.variant;
          if (v === 'rainbow') return /*#__PURE__*/React.createElement(SpecialHero, {
            type: "rainbow",
            size: size
          });
          if (v === 'rainbowSuper') return /*#__PURE__*/React.createElement(SpecialHero, {
            type: "crown",
            size: size
          });
          if (v === 'super2') return /*#__PURE__*/React.createElement(SpecialHero, {
            type: "super",
            color: "blue",
            size: size,
            lvl: 2
          });
          if (v === 'super1') return /*#__PURE__*/React.createElement(SpecialHero, {
            type: "super",
            color: "pink",
            size: size
          });
          return /*#__PURE__*/React.createElement(JellyBlock, {
            color: "mint",
            size: size
          });
        }
    }
  }

  /* Compact level-board PREVIEW — the dynamic, per-level region. A miniature of
     the level's starting board (recessed well like the real 9×9), so it's clear
     each level shows its own layout here. `preview` = array of row strings:
     '.' empty · Y/M/P/B jelly · S stone. */
  const MINI_COL = {
    Y: 'yellow',
    M: 'mint',
    P: 'pink',
    B: 'blue'
  };
  function MiniBoard({
    map
  }) {
    const cell = 24,
      gap = 3,
      cols = map[0].length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gap,
        padding: 8,
        background: '#EFE1C9',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'inset 0 2px 6px rgba(120,92,52,0.22)'
      }
    }, map.flatMap((row, r) => [...row].map((ch, i) => {
      const k = r + '-' + i;
      if ('YMPB'.includes(ch)) return /*#__PURE__*/React.createElement("div", {
        key: k,
        style: {
          width: cell,
          height: cell
        }
      }, /*#__PURE__*/React.createElement(JellyBlock, {
        color: MINI_COL[ch],
        size: cell,
        showEyes: false
      }));
      if (ch === 'S') return /*#__PURE__*/React.createElement("div", {
        key: k,
        style: {
          width: cell,
          height: cell
        }
      }, /*#__PURE__*/React.createElement(JellyBlock, {
        color: "stone",
        size: cell,
        showEyes: false
      }));
      return /*#__PURE__*/React.createElement("div", {
        key: k,
        style: {
          width: cell,
          height: cell,
          borderRadius: 8,
          background: 'rgba(120,92,52,0.08)'
        }
      });
    })));
  }

  /* 3-star threshold strip — uses the game's star IMAGE assets (same as the
     level map / world strips) for a consistent star across the whole product. */
  const STAR_ON = '../06-svg-assets/ui/star-on.png';
  const STAR_OFF = '../06-svg-assets/ui/star-off.png';
  function MiniStars({
    n,
    size = 15
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        gap: 2
      }
    }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("img", {
      key: i,
      src: i < n ? STAR_ON : STAR_OFF,
      alt: "",
      "aria-hidden": "true",
      style: {
        width: size,
        height: size,
        display: 'block'
      }
    })));
  }
  function StarThresholds({
    stars
  }) {
    if (!stars) return null;
    const [t3, t2, t1] = stars.values;
    const fmt = v => typeof v === 'number' ? v.toLocaleString('vi-VN') : v;
    const rows = [[3, `${stars.prefix3 || ''}${fmt(t3)}`], [2, fmt(t2)], [1, fmt(t1)]];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 'var(--space-sm)',
        padding: 'var(--space-sm) var(--space-md)',
        background: 'var(--color-surface-sunken)',
        borderRadius: 'var(--radius-lg)',
        boxSizing: 'border-box'
      }
    }, rows.map(([n, val], i) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: n
    }, i > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 1,
        height: 22,
        background: 'var(--color-cell-line)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement(MiniStars, {
      n: n
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)',
        lineHeight: 1,
        whiteSpace: 'nowrap'
      }
    }, val, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-muted)',
        fontWeight: 700
      }
    }, " ", stars.unit))))));
  }
  const MECH = {
    vine: {
      label: 'Gốc dây leo',
      color: 'var(--color-success)',
      glyph: s => /*#__PURE__*/React.createElement("svg", {
        width: s,
        height: s,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M12 21V9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 13c-3 0-5-2-5-5 3 0 5 2 5 5zM12 11c3 0 5-2 5-5-3 0-5 2-5 5z"
      }))
    },
    flow: {
      label: 'Dòng chảy',
      color: 'var(--color-info)',
      glyph: s => /*#__PURE__*/React.createElement("svg", {
        width: s,
        height: s,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M3 8c3-2 5 2 8 0s5 2 8 0M3 14c3-2 5 2 8 0s5 2 8 0"
      }))
    },
    boss: {
      label: 'Đánh boss',
      color: 'var(--color-gravity)',
      glyph: s => /*#__PURE__*/React.createElement("svg", {
        width: s,
        height: s,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M12 3l2.5 5 5.5.5-4 4 1 5.5L12 20l-5 3 1-5.5-4-4 5.5-.5z"
      }))
    }
  };
  function Chip({
    color,
    icon,
    children
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 999,
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color,
        boxSizing: 'border-box'
      }
    }, icon, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 'var(--text-body)',
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, children));
  }
  const WORLD_ACCENT = {
    'Đồng cỏ': 'var(--color-success)',
    'Rừng rậm': 'var(--color-primary)',
    'Sông & Thác': 'var(--color-info)'
  };
  function LevelIntroScreen({
    level = 6,
    name = 'Thạch Cầu Vồng 1',
    world = 'Đồng cỏ',
    accent,
    goal = {
      kind: 'tutorial',
      variant: 'rainbow',
      title: 'Tạo 1 ô Thạch Cầu Vồng'
    },
    stars = {
      unit: 'nước',
      values: ['≤3', 4, 5]
    },
    rotations = 20,
    mechanic,
    preview,
    onStart,
    onClose
  }) {
    const isBoss = goal.kind === 'boss';
    const acc = accent || (isBoss ? 'var(--color-gravity)' : WORLD_ACCENT[world] || 'var(--color-info)');
    const board = preview || (isBoss ? ['..SSS..', '.SSSSS.', 'YY.S.BB', '.YY.BB.'] : ['..PPMM.', 'YY.PP.B', 'YYMM.BB', '.MM.YBB']);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 'var(--space-xl)',
        boxSizing: 'border-box'
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
        justifyContent: 'center',
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-xl) var(--space-xl) var(--space-lg)',
        boxShadow: 'var(--shadow-lg)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-md)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 999,
        background: `color-mix(in srgb, ${acc} 16%, transparent)`,
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 'var(--text-caption)',
        letterSpacing: 'var(--tracking-wide)',
        color: acc,
        whiteSpace: 'nowrap'
      }
    }, isBoss && /*#__PURE__*/React.createElement(EX.Crown, {
      size: 14
    }), world.toUpperCase()), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-title)',
        color: 'var(--color-text)',
        lineHeight: 1.05,
        whiteSpace: 'nowrap'
      }
    }, "M\xE0n ", level, " \xB7 ", name)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: 'var(--space-md)',
        background: isBoss ? 'color-mix(in srgb, var(--color-gravity) 10%, var(--color-surface-sunken))' : 'var(--color-surface-sunken)',
        borderRadius: 'var(--radius-xl)',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 6,
        left: 6,
        zIndex: 2,
        padding: '2px 8px',
        borderRadius: 999,
        background: 'rgba(255,247,236,0.92)',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 9,
        letterSpacing: '0.06em',
        color: 'var(--color-text-muted)',
        boxShadow: 'var(--shadow-sm)',
        whiteSpace: 'nowrap'
      }
    }, "XEM TR\u01AF\u1EDAC B\xC0N"), /*#__PURE__*/React.createElement(MiniBoard, {
      map: board
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: -18,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,247,236,0.97), rgba(255,247,236,0.6) 58%, transparent)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Hero, {
      goal: goal,
      size: 58
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement(EX.Target, {
      size: 15,
      color: "var(--color-text-muted)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 'var(--text-caption)',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-text-muted)',
        whiteSpace: 'nowrap'
      }
    }, "M\u1EE4C TI\xCAU")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-heading)',
        color: 'var(--color-text)',
        textAlign: 'center',
        lineHeight: 1.15
      }
    }, goal.title, isBoss && goal.hp != null ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--color-danger)'
      }
    }, " \u2014 m\xE1u ", goal.hp) : '')), /*#__PURE__*/React.createElement(StarThresholds, {
      stars: stars
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 'var(--space-sm)'
      }
    }, /*#__PURE__*/React.createElement(Chip, {
      color: "var(--color-gravity)",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "rotateCw",
        size: 17,
        color: "var(--color-gravity)"
      })
    }, "\u0110\u1EA3o tr\u1ECDng l\u1EF1c \xB7 ", /*#__PURE__*/React.createElement("b", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        color: 'var(--color-gravity)'
      }
    }, rotations), " l\u01B0\u1EE3t"), mechanic && MECH[mechanic.key] && /*#__PURE__*/React.createElement(Chip, {
      color: MECH[mechanic.key].color,
      icon: /*#__PURE__*/React.createElement("span", {
        style: {
          color: MECH[mechanic.key].color,
          display: 'inline-flex'
        }
      }, MECH[mechanic.key].glyph(17))
    }, mechanic.label || MECH[mechanic.key].label)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        lineHeight: 1.2
      }
    }, "S\u1ED1 l\u1EA7n \u0111\u01B0\u1EE3c \u0111\u1EA3o tr\u1ECDng l\u1EF1c trong c\u1EA3 m\xE0n")), /*#__PURE__*/React.createElement(Button, {
      variant: isBoss ? 'gravity' : 'primary',
      size: "cta",
      icon: "play",
      fullWidth: true,
      onClick: onStart
    }, "B\u1EAET \u0110\u1EA6U")));
  }
  window.GJLevelIntroScreen = LevelIntroScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/level-intro-screen.jsx", error: String((e && e.message) || e) }); }

// 04-screens/level-win-screen.jsx
try { (() => {
/* level-win-screen.jsx — LEVEL WIN. Celebration: confetti, happy mascot,
   3-star result, score, coin reward, Next / Replay / Home. Exposes
   window.GJLevelWinScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const {
    Button,
    JellyBlock,
    Icon
  } = NS;
  const EX = window.GJExtras;
  const CONFETTI = ['var(--color-block-yellow)', 'var(--color-block-mint)', 'var(--color-block-pink)', 'var(--color-block-blue)', 'var(--color-primary)'];
  function LevelWinScreen({
    level = 23,
    stars = 2,
    score = 12480,
    coins = 120,
    onNext,
    onReplay,
    onHome
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
        overflow: 'hidden'
      }
    }, Array.from({
      length: 14
    }).map((_, i) => {
      const left = (i * 53 + 12) % 100,
        size = 8 + i % 3 * 4,
        dur = 2200 + i % 5 * 320,
        delay = i % 7 * 240;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        "aria-hidden": "true",
        style: {
          position: 'absolute',
          top: -20,
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: i % 2 ? '50%' : 3,
          background: CONFETTI[i % CONFETTI.length],
          animation: `gj-confetti-fall ${dur}ms linear ${delay}ms infinite`
        }
      });
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-2xl) var(--space-xl) var(--space-xl)',
        boxShadow: 'var(--shadow-lg)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-lg)',
        position: 'relative',
        zIndex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: -64
      }
    }, /*#__PURE__*/React.createElement(EX.Stars, {
      earned: stars,
      size: 56
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        animation: 'gj-bob 1400ms var(--ease-jelly, ease-in-out) infinite'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "mint",
      size: 38,
      expression: "happy"
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--text-title)',
        color: 'var(--color-text)',
        whiteSpace: 'nowrap'
      }
    }, "Ho\xE0n th\xE0nh!")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'var(--text-caption)',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-text-muted)'
      }
    }, "M\xC0N ", level, " \xB7 S\xD4NG & TH\xC1C")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        width: '100%',
        gap: 'var(--space-md)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: 'var(--color-surface-sunken)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-text-muted)'
      }
    }, "\u0110I\u1EC2M"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 26,
        color: 'var(--color-text)',
        lineHeight: 1
      }
    }, score.toLocaleString('vi-VN'))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: 'var(--color-surface-sunken)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-text-muted)'
      }
    }, "TH\u01AF\u1EDENG"), /*#__PURE__*/React.createElement(EX.CoinChip, {
      amount: `+${coins}`,
      size: "lg"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "success",
      size: "cta",
      iconRight: "play",
      fullWidth: true,
      onClick: onNext
    }, "M\xC0N TI\u1EBEP"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-sm)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      icon: "refresh",
      fullWidth: true,
      onClick: onReplay
    }, "Ch\u01A1i l\u1EA1i"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      icon: "home",
      fullWidth: true,
      onClick: onHome
    }, "B\u1EA3n \u0111\u1ED3")))));
  }
  window.GJLevelWinScreen = LevelWinScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/level-win-screen.jsx", error: String((e && e.message) || e) }); }

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
    Hud,
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
    }))), /*#__PURE__*/React.createElement(Hud, {
      score: score,
      direction: dir,
      onPause: () => setPaused(true)
    }), /*#__PURE__*/React.createElement("div", {
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
  function SplashScreen({
    progress = 0.68,
    version = '1.0.0'
  }) {
    const tiles = [['pink', 'left', -8], ['yellow', 'down', 4], ['mint', 'right', -4], ['blue', 'down', 8]];
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-lg)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'flex-start'
      }
    }, tiles.map(([c, d, rot], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        transform: `rotate(${rot}deg)`,
        animation: `gj-bob 1500ms var(--ease-jelly, ease-in-out) ${i * 130}ms infinite`
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: c,
      size: 50,
      direction: d,
      expression: i === 1 ? 'happy' : 'normal'
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        lineHeight: 0.92
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 22,
        letterSpacing: '0.18em',
        color: 'var(--color-text-muted)'
      }
    }, "GRAVITY"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-extra)',
        fontSize: 54,
        color: 'var(--color-block-pink)',
        WebkitTextStroke: '2px var(--color-block-pink-edge)',
        textShadow: '0 4px 0 var(--color-block-pink-edge)'
      }
    }, "JELLY"))), /*#__PURE__*/React.createElement("div", {
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

// 04-screens/world-gate-locked.jsx
try { (() => {
/* world-gate-locked.jsx — Cổng World 1 → World 2 ở trạng thái CHƯA ĐỦ SAO.
   ---------------------------------------------------------------------
   Vignette content (read bottom→top):
     • bottom: orange-walked path comes up from W1
     • L10 BOSS — đã hạ nhưng chỉ 1★ (đặt setup cho "cày sao")
     • path turns white-dashed at the gate seam
     • LOCKED GATE panel (rounded surface card, tông trầm):
         - top: sunken cream badge + ổ khoá + "THẾ GIỚI 2 · Rừng rậm"
         - mid: "Cần thêm 6★ để mở" + thanh tiến độ 12 / 18 ★
         - bottom: pill nhỏ "Cày sao ★" (warning)
     • above the gate: 2 node World 2 hiện MỜ/KHOÁ (silhouette)
     • palette trên cổng: #CFE6CE → #B2D3AC + cây thông xanh đậm thân #6D4C32
   Tông vui (vẫn cam ấm + jelly cocoa), nhưng truyền "chưa tới lúc": không sparkle, không halo thắng, không pill ĐÃ MỞ.
   Exposes window.GJWorldGateLocked + window.GJWorldGateLockedCard. */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const {
    JellyBlock
  } = NS;

  // ─── geometry ─────────────────────────────────────────────────────────
  const W = 360;
  const H = 720;
  const ENTRY = {
    x: 180,
    y: 760
  };
  const L10 = {
    x: 180,
    y: 600
  };
  const SEAM = {
    x: 180,
    y: 460
  }; // where orange stops
  const GATE = {
    x: 180,
    y: 340
  }; // gate panel center
  const L11 = {
    x: 110,
    y: 220
  };
  const L12 = {
    x: 240,
    y: 90
  };
  const EXIT = {
    x: 180,
    y: -40
  };
  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }
  const FULL_PATH = pathD([ENTRY, L10, SEAM, GATE, L11, L12, EXIT]);
  const WALKED = pathD([ENTRY, L10, SEAM]);
  // The "ahead" path (above the gate, into W2) is rendered with extra-low
  // opacity to convey "unreachable yet".
  const AHEAD_FAINT = pathD([GATE, L11, L12, EXIT]);

  // ─── background ─────────────────────────────────────────────────────
  function Scene() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "wgl-sky",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#B2D3AC"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.18",
      stopColor: "#C0DCBA"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.32",
      stopColor: "#CFE6CE"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.42",
      stopColor: "#D8ECD5"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.52",
      stopColor: "#DEF0E1"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#C6E8C9"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "wgl-mute",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#5B4636",
      stopOpacity: "0.18"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.55",
      stopColor: "#5B4636",
      stopOpacity: "0.06"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#5B4636",
      stopOpacity: "0"
    }))), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: H,
      fill: "url(#wgl-sky)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "60",
      cy: "-10",
      rx: "120",
      ry: "48",
      fill: "#8AA88A",
      opacity: "0.78"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "240",
      cy: "-16",
      rx: "160",
      ry: "50",
      fill: "#7A9C7E",
      opacity: "0.78"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "350",
      cy: "8",
      rx: "100",
      ry: "42",
      fill: "#6F906F",
      opacity: "0.72"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "40",
      cy: "90",
      rx: "130",
      ry: "56",
      fill: "#9CB89A"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "320",
      cy: "100",
      rx: "140",
      ry: "58",
      fill: "#92B092"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "180",
      cy: "140",
      rx: "220",
      ry: "70",
      fill: "#A8C2A6"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 32,
      y: 88,
      h: 48,
      canopy: "#5B7A60"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 76,
      y: 66,
      h: 42,
      canopy: "#6A8A6E"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 118,
      y: 86,
      h: 46,
      canopy: "#5B7A60"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 172,
      y: 70,
      h: 40,
      canopy: "#6A8A6E"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 228,
      y: 74,
      h: 46,
      canopy: "#5B7A60"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 278,
      y: 92,
      h: 50,
      canopy: "#4F6E56"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 326,
      y: 74,
      h: 42,
      canopy: "#6A8A6E"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 20,
      y: 156,
      h: 42,
      canopy: "#5B7A60"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 62,
      y: 134,
      h: 36,
      canopy: "#6A8A6E"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 306,
      y: 158,
      h: 44,
      canopy: "#5B7A60"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 344,
      y: 138,
      h: 38,
      canopy: "#6A8A6E"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: "280",
      fill: "url(#wgl-mute)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "40",
      cy: "300",
      rx: "130",
      ry: "46",
      fill: "#A8D2A5",
      opacity: "0.92"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "320",
      cy: "310",
      rx: "150",
      ry: "50",
      fill: "#A0CC9F",
      opacity: "0.92"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "180",
      cy: "370",
      rx: "220",
      ry: "64",
      fill: "#B0D6AB"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "60",
      cy: "480",
      rx: "140",
      ry: "50",
      fill: "#BCDDB9"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "290",
      cy: "500",
      rx: "150",
      ry: "54",
      fill: "#B0D6AB"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "180",
      cy: "550",
      rx: "220",
      ry: "74",
      fill: "#B8D9B5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "50",
      cy: "640",
      rx: "150",
      ry: "58",
      fill: "#A6CFA4"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "310",
      cy: "660",
      rx: "160",
      ry: "62",
      fill: "#9CC79B"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "180",
      cy: "700",
      rx: "240",
      ry: "80",
      fill: "#A6CFA4"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: H - 26,
      width: W,
      height: "26",
      fill: "#A4CE9E"
    }), /*#__PURE__*/React.createElement(Tree, {
      x: 26,
      y: 480,
      h: 28,
      canopy: "#7FB37F"
    }), /*#__PURE__*/React.createElement(Tree, {
      x: 338,
      y: 500,
      h: 30,
      canopy: "#6FA86F"
    }), /*#__PURE__*/React.createElement(Tree, {
      x: 22,
      y: 620,
      h: 36,
      canopy: "#5F9C66"
    }), /*#__PURE__*/React.createElement(Tree, {
      x: 336,
      y: 640,
      h: 34,
      canopy: "#6FA86F"
    }), /*#__PURE__*/React.createElement(Bush, {
      x: 50,
      y: 540,
      r: 18,
      c: "#7AB07E"
    }), /*#__PURE__*/React.createElement(Bush, {
      x: 308,
      y: 560,
      r: 20,
      c: "#8BBE8D"
    }), /*#__PURE__*/React.createElement(Bush, {
      x: 48,
      y: 680,
      r: 22,
      c: "#7AB07E"
    }), /*#__PURE__*/React.createElement(Bush, {
      x: 308,
      y: 690,
      r: 20,
      c: "#8BBE8D"
    }), [[70, 510], [298, 520], [80, 600], [300, 590], [60, 700], [300, 694]].map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, [0, 72, 144, 216, 288].map(a => {
      const rad = a * Math.PI / 180;
      return /*#__PURE__*/React.createElement("circle", {
        key: a,
        cx: x + Math.cos(rad) * 3,
        cy: y + Math.sin(rad) * 3,
        r: "2.1",
        fill: "#FFFFFF",
        opacity: "0.92"
      });
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "1.6",
      fill: "#F6D86B"
    }))));
  }
  function Pine({
    x,
    y,
    h = 44,
    canopy = '#5B7A60',
    trunk = '#6D4C32'
  }) {
    const w = h * 0.68;
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 1.5px rgba(50,60,40,0.28))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - 2.5,
      y: y,
      width: "5",
      height: h * 0.35,
      rx: "1.5",
      fill: trunk
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - w} ${y} L ${x + w} ${y} L ${x} ${y - h * 0.55} Z`,
      fill: canopy
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - w * 0.82} ${y - h * 0.32} L ${x + w * 0.82} ${y - h * 0.32} L ${x} ${y - h * 0.78} Z`,
      fill: canopy
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - w * 0.62} ${y - h * 0.6} L ${x + w * 0.62} ${y - h * 0.6} L ${x} ${y - h * 1.02} Z`,
      fill: canopy
    }));
  }
  function Tree({
    x,
    y,
    h = 30,
    canopy = '#7FB37F',
    trunk = '#7B5A36'
  }) {
    const r = h * 0.6;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: x - 2.5,
      y: y,
      width: "5",
      height: h * 0.46,
      rx: "2",
      fill: trunk
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - r * 0.5,
      cy: y - r * 0.2,
      rx: r * 0.7,
      ry: r * 0.66,
      fill: canopy,
      opacity: "0.94"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x + r * 0.5,
      cy: y - r * 0.3,
      rx: r * 0.7,
      ry: r * 0.66,
      fill: canopy,
      opacity: "0.94"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y - r * 0.72,
      rx: r,
      ry: r * 0.82,
      fill: canopy
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - r * 0.32,
      cy: y - r * 0.9,
      rx: r * 0.26,
      ry: r * 0.16,
      fill: "#FFFFFF",
      opacity: "0.28"
    }));
  }
  function Bush({
    x,
    y,
    r = 16,
    c = '#8BBE8D'
  }) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
      cx: x - r * 0.55,
      cy: y,
      rx: r * 0.7,
      ry: r * 0.55,
      fill: c
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x + r * 0.55,
      cy: y,
      rx: r * 0.7,
      ry: r * 0.55,
      fill: c
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y - r * 0.22,
      rx: r * 0.8,
      ry: r * 0.6,
      fill: c
    }));
  }

  // ─── path layer ────────────────────────────────────────────────────
  function PathLayer() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "rgba(120,92,52,0.20)",
      strokeWidth: "34",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      transform: "translate(0,4)"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#EAD8B7",
      strokeWidth: "30",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "26",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#EFE0C9",
      strokeWidth: "3.5",
      strokeLinecap: "round",
      strokeDasharray: "7 11"
    }), /*#__PURE__*/React.createElement("path", {
      d: AHEAD_FAINT,
      fill: "none",
      stroke: "#FFFFFF",
      strokeOpacity: "0.35",
      strokeWidth: "26",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FF9F68",
      strokeWidth: "20",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "6",
      strokeLinecap: "round",
      strokeDasharray: "4 9",
      opacity: "0.9"
    }));
  }

  // ─── stars + helpers ───────────────────────────────────────────────
  function Star({
    filled = true,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z",
      fill: filled ? '#FFC23D' : '#D9CDB5',
      stroke: filled ? '#E0A21F' : '#B6A892',
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }));
  }
  function StarArc({
    stars = 1,
    size = 14,
    width = 80
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -size - 6,
        transform: 'translateX(-50%)',
        width,
        height: size + 8,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(-22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-3px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }
  function LockGlyph({
    size = 18,
    fill = '#FFFFFF',
    body = '#A89A82'
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M8 11V8.5a4 4 0 1 1 8 0V11",
      fill: "none",
      stroke: fill,
      strokeWidth: "2.6",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "11",
      width: "14",
      height: "9",
      rx: "2.5",
      fill: fill
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "15",
      r: "1.4",
      fill: body
    }), /*#__PURE__*/React.createElement("rect", {
      x: "11.3",
      y: "15",
      width: "1.4",
      height: "3",
      rx: "0.6",
      fill: body
    }));
  }

  // ─── L10 boss — done 1★ (sets up the "cày sao" suggestion) ────────
  function BossDone1Star({
    size = 78
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: L10.x - size / 2,
        top: L10.y - size / 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 6px 10px rgba(126,108,240,0.30))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -22,
        top: -22,
        right: -22,
        bottom: -22,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.35) 0%, rgba(126,108,240,0.18) 55%, rgba(126,108,240,0) 78%)'
      }
    }), /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: 'linear-gradient(180deg,#7E6CF0 0%, #6353D6 100%)',
        border: '3px solid #FFFFFF',
        boxShadow: '0 4px 10px rgba(83,68,196,0.4), inset 0 2px 0 rgba(255,255,255,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 18
      }
    }, "10")), /*#__PURE__*/React.createElement(StarArc, {
      stars: 1,
      size: 14,
      width: size + 18
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -36,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
        color: '#FFFFFF',
        border: '2px solid #6353D6',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: '0.16em',
        padding: '3px 12px',
        borderRadius: 999,
        boxShadow: '0 4px 8px rgba(83,68,196,0.40), inset 0 1.5px 0 rgba(255,255,255,0.45)',
        whiteSpace: 'nowrap'
      }
    }, "BOSS")));
  }

  // ─── W2 dim nodes (silhouette, locked) ─────────────────────────────
  function W2DimNode({
    n,
    x,
    y,
    size = 50
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        opacity: 0.52,
        filter: 'saturate(0.4) drop-shadow(0 3px 4px rgba(120,92,52,0.20))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.40),
        lineHeight: 1,
        color: '#5B4636',
        textShadow: '0 1px 0 rgba(255,255,255,0.35)',
        pointerEvents: 'none',
        opacity: 0.7
      }
    }, n), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -4,
        bottom: -4,
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: '#8A7B62',
        border: '2px solid #FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(120,92,52,0.32)'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: 12
    })));
  }

  // ─── LOCKED gate panel — banner + progress + Cày sao button ───────
  function LockedGatePanel({
    current = 12,
    target = 18
  }) {
    const remaining = Math.max(0, target - current);
    const pct = Math.max(0, Math.min(1, current / target));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: GATE.y - 86,
        transform: 'translateX(-50%)',
        width: 320,
        background: '#FFFFFF',
        border: '1px solid #EFE0C9',
        borderRadius: 28,
        padding: '12px 14px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 14px 28px rgba(80,68,52,0.26), 0 4px 8px rgba(120,92,52,0.12)',
        zIndex: 3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        height: 52,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'radial-gradient(circle at 35% 28%, #FBF1DD 0%, #F4E9D8 60%, #E2D2B0 100%)',
        border: '2.5px solid #D8C8A8',
        boxShadow: 'inset 0 -3px 0 rgba(120,92,52,0.18), inset 0 3px 0 rgba(255,255,255,0.5), 0 2px 3px rgba(120,92,52,0.16)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: 26,
      fill: "#6F5C44",
      body: "#D8C8A8"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.05,
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.12em',
        color: '#9B886F',
        whiteSpace: 'nowrap'
      }
    }, "TH\u1EBE GI\u1EDAI 2"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 18,
        color: '#5B4636',
        whiteSpace: 'nowrap',
        lineHeight: 1.05
      }
    }, "R\u1EEBng r\u1EADm")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        background: '#F4E9D8',
        border: '1.5px solid #E6D8BD',
        padding: '4px 9px 5px 7px',
        borderRadius: 999,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 12
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        color: '#8C7458',
        lineHeight: 1
      }
    }, target))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 12,
        color: '#9B886F',
        lineHeight: 1.2
      }
    }, "C\u1EA7n th\xEAm ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#E97E45',
        fontWeight: 800
      }
    }, remaining, "\u2605"), " \u0111\u1EC3 m\u1EDF"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 2,
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        color: '#5B4636',
        lineHeight: 1,
        whiteSpace: 'nowrap'
      }
    }, current, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#9B886F',
        fontWeight: 600
      }
    }, "/", target), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 1,
        color: '#FFC23D',
        fontSize: 12
      }
    }, "\u2605"))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 10,
        borderRadius: 999,
        background: '#F4E9D8',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 2px rgba(120,92,52,0.18)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${pct * 100}%`,
        height: '100%',
        borderRadius: 999,
        background: 'linear-gradient(90deg, #FFCA66 0%, #FF9F68 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'linear-gradient(180deg, #FFE19A 0%, #FFCA66 60%, #F2B548 100%)',
        color: '#5B4636',
        border: '2px solid #E0A21F',
        borderBottom: '3px solid #B98613',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '6px 14px 7px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(200,150,40,0.30), inset 0 1.5px 0 rgba(255,255,255,0.60)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        letterSpacing: '0.02em'
      }
    }, "C\xE0y sao \u2605"))));
  }

  // small floating "ĐANG KHOÁ" caption above the panel
  function LockedCaption() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: 250,
        transform: 'translateX(-50%)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(255,255,255,0.94)',
        border: '1px solid rgba(91,70,54,0.10)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '5px 12px 6px',
        borderRadius: 999,
        boxShadow: '0 6px 12px rgba(120,92,52,0.18)',
        zIndex: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 999,
        background: '#9B886F'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.10em',
        color: '#6F5C44'
      }
    }, "\u0110ANG KHO\xC1"));
  }

  // ─── top-level vignette ────────────────────────────────────────────
  function WorldGateLocked() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `), /*#__PURE__*/React.createElement(Scene, null), /*#__PURE__*/React.createElement(PathLayer, null), /*#__PURE__*/React.createElement(W2DimNode, {
      n: 11,
      x: L11.x,
      y: L11.y
    }), /*#__PURE__*/React.createElement(W2DimNode, {
      n: 12,
      x: L12.x,
      y: L12.y
    }), /*#__PURE__*/React.createElement(BossDone1Star, null), /*#__PURE__*/React.createElement(LockedCaption, null), /*#__PURE__*/React.createElement(LockedGatePanel, {
      current: 12,
      target: 18
    }));
  }

  // ─── documentation card ───────────────────────────────────────────
  function WorldGateLockedCard() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 760,
        padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        color: '#9B886F'
      }
    }, "04 \xB7 SCREENS / LEVEL MAP"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: '#EFE0C9'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 11,
        color: '#9B886F'
      }
    }, "Bi\u1EBFn th\u1EC3 \xB7 c\u1ED5ng CH\u01AFA \u0110\u1EE6 SAO")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 26,
        color: '#5B4636',
        marginBottom: 4,
        lineHeight: 1.05
      }
    }, "C\u1ED5ng gi\u1EEFa \u0110\u1ED3ng c\u1ECF \u2192 R\u1EEBng r\u1EADm \xB7 KHO\xC1"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 13,
        color: '#9B886F',
        marginBottom: 20
      }
    }, "L10 \u0111\xE3 h\u1EA1 ch\u1EC9 1\u2605 \xB7 12 / 18\u2605 \xB7 g\u1EE3i \xFD quay l\u1EA1i \"c\xE0y sao\""), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `${W}px 1fr`,
        gap: 28,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: W,
        height: H,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 14px 32px rgba(60,44,24,0.30)'
      }
    }, /*#__PURE__*/React.createElement(WorldGateLocked, null)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement(Note, {
      num: "A",
      name: "Banner c\u1ED5ng \u2014 t\xF4ng tr\u1EA7m",
      detail: "surface tr\u1EAFng \xB7 vi\u1EC1n m\u1EA3nh #EFE0C9 \xB7 shadow m\u1EC1m cocoa \xB7 kh\xF4ng halo, kh\xF4ng sparkle"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "B",
      name: "Huy hi\u1EC7u LOCKED",
      detail: "surface ch\xECm #F4E9D8 + vi\u1EC1n #D8C8A8 \xB7 \u1ED5 kho\xE1 n\xE2u #6F5C44 \xB7 inset shadow"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "C",
      name: "C\u1EE5m ch\u1EEF",
      detail: "TH\u1EBE GI\u1EDAI 2 small-caps Nunito 10 #9B886F \xB7 R\u1EEBng r\u1EADm Fredoka 18 #5B4636"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "D",
      name: "Chip \u2605 y\xEAu c\u1EA7u (muted)",
      detail: "n\u1EC1n #F4E9D8 \xB7 vi\u1EC1n #E6D8BD \xB7 \u2605 #FFC23D \xB7 s\u1ED1 18 cocoa nh\u1EA1t #8C7458"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "E",
      name: "D\xF2ng ti\u1EBFn \u0111\u1ED9",
      detail: "'C\u1EA7n th\xEAm 6\u2605 \u0111\u1EC3 m\u1EDF' Nunito 700 12 #9B886F \xB7 s\u1ED1 '6\u2605' #E97E45 n\u1ED5i \xB7 count 12/18\u2605 ph\u1EA3i"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "F",
      name: "Thanh ti\u1EBFn \u0111\u1ED9 bo full",
      detail: "track #F4E9D8 inset \xB7 fill gradient 90\xB0 #FFCA66 \u2192 #FF9F68 \xB7 pct = 12/18 \u2248 67%"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "G",
      name: "Pill ph\u1EE5 'C\xE0y sao \u2605'",
      detail: "gradient #FFE19A \u2192 #FFCA66 \u2192 #F2B548 (warning) \xB7 vi\u1EC1n #E0A21F \xB7 bottom-edge #B98613 3D"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "H",
      name: "\u0110\u01B0\u1EDDng v\u01B0\u1EE3t c\u1ED5ng (m\u1EDD)",
      detail: "orange d\u1EEBng \u1EDF seam d\u01B0\u1EDBi c\u1ED5ng \xB7 ph\xEDa tr\xEAn = white-dashed opacity 0.35 = 'unreachable yet'"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "I",
      name: "Node W2 silhouette",
      detail: "stone JellyBlock 50dp \xB7 opacity 0.52 + saturate 0.4 \xB7 s\u1ED1 m\u1EDD + \u1ED5 kho\xE1 nh\u1ECF"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "J",
      name: "Pill '\u0110ANG KHO\xC1'",
      detail: "ch\u1EA5m x\xE1m #9B886F (kh\xF4ng glow) \xB7 Nunito 800 11 #6F5C44 \xB7 backdrop-blur nh\u1EB9"
    }))));
  }
  function Note({
    num,
    name,
    detail
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 999,
        background: '#FFCA66',
        color: '#5B4636',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 0 #B98613'
      }
    }, num), /*#__PURE__*/React.createElement("div", {
      style: {
        lineHeight: 1.25,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 13,
        color: '#5B4636'
      }
    }, name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 11,
        color: '#9B886F',
        marginTop: 2
      }
    }, detail)));
  }
  window.GJWorldGateLocked = WorldGateLocked;
  window.GJWorldGateLockedCard = WorldGateLockedCard;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world-gate-locked.jsx", error: String((e && e.message) || e) }); }

// 04-screens/world-gate.jsx
try { (() => {
/* world-gate.jsx — "Tới cổng" variant: between W1 Đồng cỏ and W2 Rừng
   rậm, player has hit the ★ requirement. The gate is OPEN.

   Vignette content (read bottom→top):
     • bottom: orange-walked path comes up from W1
     • L10 BOSS — already cleared (3★, gravity halo intact)
     • gate banner pill — green success badge + check, world name + ★ chip
     • a soft sparkle ring drifting around the gate
     • above the gate: nền blends into Rừng rậm (#CFE6CE→#B2D3AC) with
       dark pine trees (trunk #6D4C32) — path continues into W2 dashed
       white (unlocked but not walked yet)

   Exposes window.GJWorldGate.                                            */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const {
    JellyBlock
  } = NS;

  // ─── geometry ─────────────────────────────────────────────────────────
  const W = 360;
  const H = 680;
  const ENTRY = {
    x: 180,
    y: 720
  }; // path enters from bottom
  const L10 = {
    x: 180,
    y: 560
  }; // boss already cleared
  const GATE = {
    x: 180,
    y: 320
  }; // the gate banner sits here
  const EXIT = {
    x: 180,
    y: -40
  }; // path exits top into W2

  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }

  // walked-orange: entry → L10 → just up to the gate seam.
  const WALKED = pathD([ENTRY, L10, {
    x: 180,
    y: 360
  }]);
  // unlocked-white: from the gate seam upward, into W2.
  const AHEAD = pathD([{
    x: 180,
    y: 320
  }, EXIT]);

  // ─── background (forest above, meadow below) ─────────────────────────
  function Scene() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "wg-sky",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#B2D3AC"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.18",
      stopColor: "#C0DCBA"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.32",
      stopColor: "#CFE6CE"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.42",
      stopColor: "#D8ECD5"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.52",
      stopColor: "#DEF0E1"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#C6E8C9"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "wg-gate-glow",
      cx: "0.5",
      cy: "0.48",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFF6CD",
      stopOpacity: "0.55"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.55",
      stopColor: "#FFE19A",
      stopOpacity: "0.22"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#FFE19A",
      stopOpacity: "0"
    }))), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: H,
      fill: "url(#wg-sky)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "60",
      cy: "-10",
      rx: "120",
      ry: "48",
      fill: "#7BA582",
      opacity: "0.85"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "240",
      cy: "-16",
      rx: "160",
      ry: "50",
      fill: "#6F9C76",
      opacity: "0.85"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "350",
      cy: "8",
      rx: "100",
      ry: "42",
      fill: "#5F8E68",
      opacity: "0.78"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "40",
      cy: "90",
      rx: "130",
      ry: "56",
      fill: "#8FB48E"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "320",
      cy: "100",
      rx: "140",
      ry: "58",
      fill: "#85AB85"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "180",
      cy: "140",
      rx: "220",
      ry: "70",
      fill: "#9BBE99"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 32,
      y: 88,
      h: 48,
      canopy: "#3F7D49"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 76,
      y: 66,
      h: 42,
      canopy: "#4F8C58"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 118,
      y: 86,
      h: 46,
      canopy: "#3F7D49"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 172,
      y: 70,
      h: 40,
      canopy: "#4F8C58"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 228,
      y: 74,
      h: 46,
      canopy: "#3F7D49"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 278,
      y: 92,
      h: 50,
      canopy: "#356E40"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 326,
      y: 74,
      h: 42,
      canopy: "#4F8C58"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 20,
      y: 156,
      h: 42,
      canopy: "#3F7D49"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 62,
      y: 134,
      h: 36,
      canopy: "#4F8C58"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 104,
      y: 150,
      h: 38,
      canopy: "#3F7D49"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 258,
      y: 138,
      h: 38,
      canopy: "#356E40"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 306,
      y: 158,
      h: 44,
      canopy: "#3F7D49"
    }), /*#__PURE__*/React.createElement(Pine, {
      x: 344,
      y: 138,
      h: 38,
      canopy: "#4F8C58"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "40",
      cy: "270",
      rx: "130",
      ry: "46",
      fill: "#A8D2A5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "320",
      cy: "280",
      rx: "150",
      ry: "50",
      fill: "#A0CC9F"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "180",
      cy: "320",
      rx: "220",
      ry: "64",
      fill: "#B0D6AB"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "20",
      y: "240",
      width: "320",
      height: "220",
      fill: "url(#wg-gate-glow)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "60",
      cy: "430",
      rx: "140",
      ry: "50",
      fill: "#BCDDB9"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "290",
      cy: "450",
      rx: "150",
      ry: "54",
      fill: "#B0D6AB"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "180",
      cy: "500",
      rx: "220",
      ry: "74",
      fill: "#B8D9B5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "50",
      cy: "600",
      rx: "150",
      ry: "58",
      fill: "#A6CFA4"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "310",
      cy: "620",
      rx: "160",
      ry: "62",
      fill: "#9CC79B"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "180",
      cy: "660",
      rx: "240",
      ry: "80",
      fill: "#A6CFA4"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: H - 26,
      width: W,
      height: "26",
      fill: "#A4CE9E"
    }), /*#__PURE__*/React.createElement(Tree, {
      x: 28,
      y: 430,
      h: 28,
      canopy: "#7FB37F"
    }), /*#__PURE__*/React.createElement(Tree, {
      x: 336,
      y: 446,
      h: 30,
      canopy: "#6FA86F"
    }), /*#__PURE__*/React.createElement(Tree, {
      x: 24,
      y: 580,
      h: 36,
      canopy: "#5F9C66"
    }), /*#__PURE__*/React.createElement(Tree, {
      x: 336,
      y: 596,
      h: 34,
      canopy: "#6FA86F"
    }), /*#__PURE__*/React.createElement(Bush, {
      x: 50,
      y: 500,
      r: 18,
      c: "#7AB07E"
    }), /*#__PURE__*/React.createElement(Bush, {
      x: 308,
      y: 520,
      r: 20,
      c: "#8BBE8D"
    }), /*#__PURE__*/React.createElement(Bush, {
      x: 46,
      y: 640,
      r: 22,
      c: "#7AB07E"
    }), /*#__PURE__*/React.createElement(Bush, {
      x: 310,
      y: 650,
      r: 20,
      c: "#8BBE8D"
    }), [[70, 470], [298, 490], [80, 560], [300, 560], [60, 660], [306, 648]].map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, [0, 72, 144, 216, 288].map(a => {
      const rad = a * Math.PI / 180;
      return /*#__PURE__*/React.createElement("circle", {
        key: a,
        cx: x + Math.cos(rad) * 3,
        cy: y + Math.sin(rad) * 3,
        r: "2.1",
        fill: "#FFFFFF",
        opacity: "0.92"
      });
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "1.6",
      fill: "#F6D86B"
    }))));
  }

  // Layered triangle pine (W2 forest motif). Trunk uses #6D4C32 per spec.
  function Pine({
    x,
    y,
    h = 44,
    canopy = '#3F7D49',
    trunk = '#6D4C32'
  }) {
    const w = h * 0.68;
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 1.5px rgba(50,60,40,0.30))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - 2.5,
      y: y,
      width: "5",
      height: h * 0.35,
      rx: "1.5",
      fill: trunk
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - w} ${y} L ${x + w} ${y} L ${x} ${y - h * 0.55} Z`,
      fill: canopy
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - w * 0.82} ${y - h * 0.32} L ${x + w * 0.82} ${y - h * 0.32} L ${x} ${y - h * 0.78} Z`,
      fill: canopy
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - w * 0.62} ${y - h * 0.6} L ${x + w * 0.62} ${y - h * 0.6} L ${x} ${y - h * 1.02} Z`,
      fill: canopy
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - w * 0.4} ${y - h * 0.5} L ${x - w * 0.15} ${y - h * 0.95} L ${x - w * 0.05} ${y - h * 0.92} L ${x - w * 0.30} ${y - h * 0.48} Z`,
      fill: "#FFFFFF",
      opacity: "0.18"
    }));
  }
  function Tree({
    x,
    y,
    h = 30,
    canopy = '#7FB37F',
    trunk = '#7B5A36'
  }) {
    const r = h * 0.6;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: x - 2.5,
      y: y,
      width: "5",
      height: h * 0.46,
      rx: "2",
      fill: trunk
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - r * 0.5,
      cy: y - r * 0.2,
      rx: r * 0.7,
      ry: r * 0.66,
      fill: canopy,
      opacity: "0.94"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x + r * 0.5,
      cy: y - r * 0.3,
      rx: r * 0.7,
      ry: r * 0.66,
      fill: canopy,
      opacity: "0.94"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y - r * 0.72,
      rx: r,
      ry: r * 0.82,
      fill: canopy
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - r * 0.32,
      cy: y - r * 0.9,
      rx: r * 0.26,
      ry: r * 0.16,
      fill: "#FFFFFF",
      opacity: "0.28"
    }));
  }
  function Bush({
    x,
    y,
    r = 16,
    c = '#8BBE8D'
  }) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
      cx: x - r * 0.55,
      cy: y,
      rx: r * 0.7,
      ry: r * 0.55,
      fill: c
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x + r * 0.55,
      cy: y,
      rx: r * 0.7,
      ry: r * 0.55,
      fill: c
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y - r * 0.22,
      rx: r * 0.8,
      ry: r * 0.6,
      fill: c
    }));
  }

  // ─── path layer ─────────────────────────────────────────────────────
  function PathLayer() {
    const FULL = pathD([ENTRY, L10, GATE, EXIT]);
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: FULL,
      fill: "none",
      stroke: "rgba(120,92,52,0.22)",
      strokeWidth: "34",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      transform: "translate(0,4)"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL,
      fill: "none",
      stroke: "#EAD8B7",
      strokeWidth: "30",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL,
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "26",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL,
      fill: "none",
      stroke: "#EFE0C9",
      strokeWidth: "3.5",
      strokeLinecap: "round",
      strokeDasharray: "7 11"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FF9F68",
      strokeWidth: "20",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "6",
      strokeLinecap: "round",
      strokeDasharray: "4 9",
      opacity: "0.9"
    }));
  }

  // ─── stars ──────────────────────────────────────────────────────────
  function Star({
    filled = true,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z",
      fill: filled ? '#FFC23D' : '#D9CDB5',
      stroke: filled ? '#E0A21F' : '#B6A892',
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }));
  }
  function StarArc({
    stars = 3,
    size = 14,
    width = 80
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -size - 6,
        transform: 'translateX(-50%)',
        width,
        height: size + 8,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(-22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-3px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }

  // ─── L10 boss — DONE state ──────────────────────────────────────────
  function BossDone({
    size = 80
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: L10.x - size / 2,
        top: L10.y - size / 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 8px 12px rgba(126,108,240,0.36))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -28,
        top: -28,
        right: -28,
        bottom: -28,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.50) 0%, rgba(126,108,240,0.26) 55%, rgba(126,108,240,0) 78%)',
        animation: 'gj-wg-halo 2400ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: 'linear-gradient(180deg,#FFE19A 0%, #FFB94D 100%)',
        border: '3px solid #FFFFFF',
        boxShadow: '0 4px 10px rgba(200,120,0,0.42), inset 0 2px 0 rgba(255,255,255,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: Math.round(size * 0.30),
      height: Math.round(size * 0.30),
      viewBox: "0 0 24 24",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 5h10v3a5 5 0 0 1-10 0V5z",
      fill: "#FFFFFF",
      stroke: "#E0A21F",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 6.5H4.5A1.5 1.5 0 0 0 4.5 9.5H7",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "1.8",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M17 6.5h2.5a1.5 1.5 0 0 1 0 3H17",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "1.8",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 13v3h4v-3",
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 17h8v2H8z",
      fill: "#FFFFFF"
    })))), /*#__PURE__*/React.createElement(StarArc, {
      stars: 3,
      size: 14,
      width: size + 18
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -42,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
        color: '#FFFFFF',
        border: '2px solid #6353D6',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.16em',
        padding: '3px 12px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)',
        whiteSpace: 'nowrap'
      }
    }, "BOSS \xB7 \u0110\xC3 H\u1EA0")));
  }

  // ─── sparkles around the gate ──────────────────────────────────────
  function Sparkles() {
    // 14 sparkles scattered in a wide ring around the gate banner
    const sp = [
    // [x, y, size, delay]
    [56, 230, 11, 0.0], [310, 222, 12, 0.4], [30, 290, 14, 1.1], [330, 308, 13, 0.7], [50, 360, 11, 1.5], [320, 372, 12, 0.2], [86, 200, 9, 2.0], [276, 196, 9, 0.9], [70, 408, 10, 0.5], [296, 414, 11, 1.3], [180, 188, 14, 0.0], [180, 460, 12, 1.7], [124, 250, 8, 0.3], [232, 254, 8, 1.0]];
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block',
        pointerEvents: 'none'
      }
    }, sp.map(([x, y, s, d], i) => /*#__PURE__*/React.createElement("g", {
      key: i,
      style: {
        animation: `gj-wg-tw 2400ms ease-in-out infinite`,
        animationDelay: `${d}s`,
        transformOrigin: `${x}px ${y}px`
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - s} L ${x + s * 0.28} ${y - s * 0.28}
                       L ${x + s} ${y} L ${x + s * 0.28} ${y + s * 0.28}
                       L ${x} ${y + s} L ${x - s * 0.28} ${y + s * 0.28}
                       L ${x - s} ${y} L ${x - s * 0.28} ${y - s * 0.28} Z`,
      fill: "#FFFFFF",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: s * 0.18,
      fill: "#FFE19A"
    }))));
  }

  // ─── gate banner (OPEN — success badge) ────────────────────────────
  function GateBanner() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: GATE.y - 38,
        transform: 'translateX(-50%)',
        width: 312,
        background: '#FFFFFF',
        border: '1px solid #EFE0C9',
        borderRadius: 999,
        padding: '8px 14px 8px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 12px 28px rgba(60,80,55,0.34), 0 4px 10px rgba(120,92,52,0.14)',
        zIndex: 3,
        animation: 'gj-wg-rise 1800ms ease-in-out infinite',
        transformOrigin: '50% 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'radial-gradient(circle at 35% 25%, #B7EBC0 0%, #6FCF7F 60%, #4FB063 100%)',
        border: '2.5px solid #4FB063',
        boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.10), inset 0 3px 0 rgba(255,255,255,0.45), 0 3px 6px rgba(60,150,80,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "28",
      height: "28",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "3.6",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12.5l4 4L19 7"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -8,
        top: -8,
        right: -8,
        bottom: -8,
        borderRadius: '50%',
        border: '2px dashed rgba(111,207,127,0.55)',
        animation: 'gj-wg-spin 6s linear infinite'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.05,
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.12em',
        color: '#9B886F',
        whiteSpace: 'nowrap'
      }
    }, "TH\u1EBE GI\u1EDAI 2"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 16,
        color: '#5B4636',
        whiteSpace: 'nowrap',
        lineHeight: 1.05
      }
    }, "R\u1EEBng r\u1EADm")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
        border: '1.5px solid #E0A21F',
        padding: '5px 10px 6px 8px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 14,
        color: '#6A4A2E',
        lineHeight: 1
      }
    }, "18")));
  }

  // small floating "Đã mở khoá" caption above the banner
  function UnlockedCaption() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: GATE.y - 86,
        transform: 'translateX(-50%)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(91,70,54,0.10)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '5px 12px 6px',
        borderRadius: 999,
        boxShadow: '0 6px 12px rgba(120,92,52,0.18)',
        zIndex: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 999,
        background: '#6FCF7F',
        boxShadow: '0 0 8px rgba(111,207,127,0.7)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.10em',
        color: '#3F7D49'
      }
    }, "\u0110\xC3 M\u1EDE KHO\xC1"));
  }

  // ─── top-level vignette ────────────────────────────────────────────
  function WorldGate() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-wg-halo {
            0%,100% { transform: scale(1.00); opacity: 1; }
            50%     { transform: scale(1.10); opacity: 0.85; }
          }
          @keyframes gj-wg-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes gj-wg-tw {
            0%,100% { opacity: 0.35; transform: scale(0.85); }
            50%     { opacity: 1;    transform: scale(1.15); }
          }
          @keyframes gj-wg-rise {
            0%,100% { transform: translate(-50%, 0); }
            50%     { transform: translate(-50%, -3px); }
          }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `), /*#__PURE__*/React.createElement(Scene, null), /*#__PURE__*/React.createElement(PathLayer, null), /*#__PURE__*/React.createElement(BossDone, null), /*#__PURE__*/React.createElement(Sparkles, null), /*#__PURE__*/React.createElement(UnlockedCaption, null), /*#__PURE__*/React.createElement(GateBanner, null));
  }

  // ─── documentation card ───────────────────────────────────────────
  function WorldGateCard() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 760,
        padding: '36px 32px 32px',
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        color: '#9B886F'
      }
    }, "04 \xB7 SCREENS / LEVEL MAP"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: '#EFE0C9'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 11,
        color: '#9B886F'
      }
    }, "Bi\u1EBFn th\u1EC3 \xB7 c\u1ED5ng \u0110\xC3 \u0110\u1EE6 SAO")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 26,
        color: '#5B4636',
        marginBottom: 4,
        lineHeight: 1.05
      }
    }, "C\u1ED5ng gi\u1EEFa \u0110\u1ED3ng c\u1ECF \u2192 R\u1EEBng r\u1EADm"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 13,
        color: '#9B886F',
        marginBottom: 20
      }
    }, "L10 \u0111\xE3 h\u1EA1 \xB7 18/18\u2605 \xB7 s\u1EB5n s\xE0ng b\u01B0\u1EDBc v\xE0o World 2"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `${W}px 1fr`,
        gap: 28,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: W,
        height: H,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 14px 32px rgba(60,44,24,0.30)'
      }
    }, /*#__PURE__*/React.createElement(WorldGate, null)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement(Note, {
      num: "A",
      name: "Banner c\u1ED5ng \u2014 pill surface",
      detail: "surface #FFFFFF \xB7 shadow md \xB7 vi\u1EC1n m\u1EA3nh #EFE0C9 \xB7 nh\u1ECBp rise nh\u1EB9 \xB13px"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "B",
      name: "Huy hi\u1EC7u SUCCESS",
      detail: "v\xF2ng tr\xF2n #6FCF7F gradient \xB7 vi\u1EC1n #4FB063 \xB7 check tr\u1EAFng \xB7 burst dash xoay"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "C",
      name: "C\u1EE5m ch\u1EEF",
      detail: "TH\u1EBE GI\u1EDAI 2 small-caps Nunito 10 #9B886F \xB7 R\u1EEBng r\u1EADm Fredoka 16 #5B4636"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "D",
      name: "Chip sao y\xEAu c\u1EA7u",
      detail: "gradient #FFE6A8 \u2192 #FFD074 \xB7 vi\u1EC1n #E0A21F \xB7 \u2605 #FFC23D + 18"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "E",
      name: "\u0110\u01B0\u1EDDng xuy\xEAn qua c\u1ED5ng",
      detail: "ENTRY \u2192 L10 \u2192 c\u1ED5ng = orange #FF9F68 (\u0111\xE3 \u0111i) \xB7 c\u1ED5ng \u2192 W2 = white-dashed (ch\u01B0a \u0111i)"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "F",
      name: "Palette chuy\u1EC3n d\u1EA7n",
      detail: "tr\xEAn c\u1ED5ng: #CFE6CE \u2192 #B2D3AC + th\xF4ng xanh \u0111\u1EADm #3F7D49, th\xE2n #6D4C32"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "G",
      name: "L\u1EA5p l\xE1nh quanh c\u1ED5ng",
      detail: "14 sparkles tr\u1EAFng-v\xE0ng twinkle 2.4s \xB7 c\u1EA3m gi\xE1c ph\u1EA7n th\u01B0\u1EDFng"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "H",
      name: "Pill '\u0110\xC3 M\u1EDE KHO\xC1'",
      detail: "ch\u1EA5m xanh #6FCF7F glow \xB7 Nunito 800 11 #3F7D49 \xB7 backdrop-blur nh\u1EB9"
    }), /*#__PURE__*/React.createElement(Note, {
      num: "I",
      name: "Boss L10 \u2014 \u0110\xC3 H\u1EA0",
      detail: "stone 80dp \xB7 halo gravity c\xF2n pulse \xB7 trophy v\xE0ng gi\u1EEFa \xB7 3\u2605 arc \xB7 tag BOSS \xB7 \u0110\xC3 H\u1EA0"
    }))));
  }
  function Note({
    num,
    name,
    detail
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 999,
        background: '#FF9F68',
        color: '#FFFFFF',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 0 #E97E45'
      }
    }, num), /*#__PURE__*/React.createElement("div", {
      style: {
        lineHeight: 1.25,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 13,
        color: '#5B4636'
      }
    }, name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 11,
        color: '#9B886F',
        marginTop: 2
      }
    }, detail)));
  }
  window.GJWorldGate = WorldGate;
  window.GJWorldGateCard = WorldGateCard;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world-gate.jsx", error: String((e && e.message) || e) }); }

// 04-screens/world1-strip.jsx
try { (() => {
/* world1-strip.jsx — Level-Map SCROLL STRIP for World 1 "Đồng cỏ".
   ----------------------------------------------------------------
   Pure artboard: 360 × 1080dp, NO HUD (the HUD is a separate sticky
   layer added by the screen shell). The scenery + winding road are a
   single painted PNG backdrop (06-svg-assets/backgrounds/world1-map-bg.png,
   724×2172 → exact 1:3, so no distortion at 360 wide). We no longer draw
   trees/bushes/path in SVG — we just DROP the ten level nodes onto the
   painted trail. Reads bottom→top:

     • L1 → L5  : regular nodes (L1–L4 done w/ stars, L5 stone-locked)
     • L6       : BREATHER ("NGHỈ")
     • L7 → L9  : regular nodes (stone-locked)
     • L10      : BOSS (gravity-purple halo)
     • top      : the painted locked GATE → World 2 "Rừng rậm"
                  (a compact stars-required chip labels it)

   Reuses DS tokens & JellyBlock. Exposes window.GJWorld1Strip.
   ---------------------------------------------------------------- */
(function () {
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const {
    JellyBlock
  } = NS;
  const BG_SRC = '../06-svg-assets/backgrounds/world1-map-bg-v3.png';
  const LOCK_SRC = '../06-svg-assets/ui/locked-tile.png';
  const OPEN_SRC = '../06-svg-assets/ui/unlocked-tile.png';
  const DONE_SRC = '../06-svg-assets/ui/completed-tile.png';
  const STAR_ON = '../06-svg-assets/ui/star-on.png'; // earned (yellow)
  const STAR_OFF = '../06-svg-assets/ui/star-off.png'; // empty (grey)

  // ─── Geometry ──────────────────────────────────────────────────────────
  const W = 360;
  const H = 1280; // 665×2365 backdrop scaled to 360 wide (exact 360×1280)

  // One uniform node size across every node type.
  const NODE = 62;

  // Node positions sit ON THE BENDS of the painted winding trail, bottom→top.
  // Consecutive nodes alternate left/right along each curve, so they zigzag
  // up the path across the full height. L10 sits at the top bend below the gate.
  const NODES = [{
    id: 1,
    x: 230,
    y: 1138,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'yellow'
  }, {
    id: 2,
    x: 147,
    y: 1050,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'mint'
  }, {
    id: 3,
    x: 233,
    y: 964,
    kind: 'reg',
    state: 'done',
    stars: 2,
    color: 'pink'
  }, {
    id: 4,
    x: 126,
    y: 892,
    kind: 'reg',
    state: 'done',
    stars: 1,
    color: 'blue'
  }, {
    id: 5,
    x: 239,
    y: 802,
    kind: 'reg',
    state: 'open'
  }, {
    id: 6,
    x: 126,
    y: 718,
    kind: 'breather',
    state: 'locked'
  }, {
    id: 7,
    x: 243,
    y: 646,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 8,
    x: 126,
    y: 562,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 9,
    x: 242,
    y: 484,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 10,
    x: 133,
    y: 410,
    kind: 'boss',
    state: 'locked'
  }];

  // ─── Stars ────────────────────────────────────────────────────────────
  function Star({
    filled = false,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("img", {
      src: filled ? STAR_ON : STAR_OFF,
      alt: "",
      draggable: "false",
      style: {
        width: size,
        height: size,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: filled ? 'drop-shadow(0 1px 1.5px rgba(190,120,20,0.5))' : 'drop-shadow(0 1px 1.5px rgba(120,92,52,0.32))'
      }
    });
  }
  function StarArc({
    stars = 3,
    size = 15,
    width = 46
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: Math.round(size * 0.18),
        transform: 'translateX(-50%)',
        width,
        height: size + 6,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(2px) rotate(-18deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-3px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 3
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(2px) rotate(18deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }

  // ─── Node primitives ─────────────────────────────────────────────────
  // Level number sitting IN THE CENTRE of a painted tile. `vy` is the vertical
  // anchor as a fraction of tile height (locked tiles push it up above the lock).
  function CenterNum({
    n,
    size,
    color = '#6A4A2E',
    vy = 0.5,
    scale = 0.34,
    shadow = '0 1px 0 rgba(255,255,255,0.65)'
  }) {
    // Shrink for wider numbers so up to 3 digits (→100) fit inside the node.
    const digits = String(n).length;
    const dscale = digits >= 3 ? 0.66 : digits === 2 ? 0.82 : 1;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${vy * 100}%`,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * scale * dscale),
        lineHeight: 1,
        color,
        textShadow: shadow,
        pointerEvents: 'none'
      }
    }, n);
  }
  function Tile({
    src,
    size,
    shadow
  }) {
    return /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: "",
      draggable: "false",
      style: {
        position: 'relative',
        width: size,
        height: size,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: `drop-shadow(${shadow})`
      }
    });
  }
  function DoneNode({
    n,
    stars,
    size = 60
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement(Tile, {
      src: DONE_SRC,
      size: size,
      shadow: "0 5px 7px rgba(120,92,52,0.30)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#B67A16",
      vy: 0.56,
      scale: 0.36
    }), /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 15,
      width: 54
    }));
  }

  // Unlocked-but-not-yet-played: bright yellow tile, prominent centred number, pulse.
  function OpenNode({
    n,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -16,
        top: -16,
        right: -16,
        bottom: -16,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,159,104,0.55) 0%, rgba(255,159,104,0.22) 55%, rgba(255,159,104,0) 78%)',
        animation: 'gj-strip-pulse 1800ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement(Tile, {
      src: OPEN_SRC,
      size: size,
      shadow: "0 6px 9px rgba(120,92,52,0.30)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#B67A16",
      vy: 0.52,
      scale: 0.38
    }));
  }

  // Locked cream tile — the padlock is painted at the bottom, so the number
  // sits in the empty upper area.
  function LockedRegularNode({
    n,
    size = 58
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement(Tile, {
      src: LOCK_SRC,
      size: size,
      shadow: "0 5px 7px rgba(120,92,52,0.26)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#8A7A63",
      vy: 0.33,
      scale: 0.34
    }));
  }
  function BreatherNode({
    n,
    size = 52
  }) {
    return /*#__PURE__*/React.createElement(LockedRegularNode, {
      n: n,
      size: size
    });
  }

  // ─── BOSS GATE ───────────────────────────────────────────────────────
  // Ornate framed gate node marking the world's boss level (10/20/30…).
  // Three states: locked (gold + padlock) · current (amethyst, playable)
  // · cleared (gold + ruby, beaten). Sized by width; height follows the art.
  const BOSS_SRC = {
    locked: '../06-svg-assets/ui/boss-gate-locked.png',
    current: '../06-svg-assets/ui/boss-gate-current.png',
    cleared: '../06-svg-assets/ui/boss-gate-cleared.png'
  };
  // aspect (h/w) + panel-centre anchor (fraction of image) + number colour
  const BOSS_META = {
    locked: {
      ar: 1.1118,
      vx: 0.477,
      vy: 0.423,
      num: '#8A6A2E'
    },
    current: {
      ar: 1.0404,
      vx: 0.498,
      vy: 0.502,
      num: '#6A4A2E'
    },
    cleared: {
      ar: 1.0266,
      vx: 0.500,
      vy: 0.501,
      num: '#B67A16'
    }
  };
  function BossGateNode({
    n,
    variant = 'locked',
    stars = 3,
    width = 104
  }) {
    const m = BOSS_META[variant];
    const w = width,
      h = Math.round(width * m.ar);
    const shadow = variant === 'current' ? '0 7px 14px rgba(126,108,240,0.40)' : variant === 'cleared' ? '0 7px 13px rgba(200,150,40,0.36)' : '0 7px 12px rgba(120,92,52,0.30)';
    const numSize = Math.round(w * (String(n).length >= 2 ? 0.34 : 0.42));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: w,
        height: h
      }
    }, variant === 'current' && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -18,
        top: -14,
        right: -18,
        bottom: -14,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.60) 0%, rgba(126,108,240,0.28) 55%, rgba(126,108,240,0) 80%)',
        animation: 'gj-strip-pulse 1800ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: BOSS_SRC[variant],
      alt: "",
      draggable: "false",
      style: {
        position: 'relative',
        width: w,
        height: h,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: `drop-shadow(${shadow})`
      }
    }), variant === 'cleared' && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${(m.vy - 0.30) * 100}%`
      }
    }, /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 16,
      width: 62
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: numSize,
        lineHeight: 1,
        color: m.num,
        textShadow: '0 1px 0 rgba(255,255,255,0.7)',
        pointerEvents: 'none'
      }
    }, n));
  }
  function PlaceNode({
    node
  }) {
    const half = NODE / 2;
    if (node.kind === 'boss') {
      const variant = node.state === 'done' ? 'cleared' : node.state === 'open' ? 'current' : 'locked';
      const BW = 66;
      const m = BOSS_META[variant];
      const bh = Math.round(BW * m.ar);
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          zIndex: 3,
          left: Math.round(node.x - m.vx * BW),
          top: Math.round(node.y - m.vy * bh)
        }
      }, /*#__PURE__*/React.createElement(BossGateNode, {
        n: node.id,
        variant: variant,
        stars: node.stars || 3,
        width: BW
      }));
    }
    let inner = null;
    if (node.kind === 'breather') {
      inner = /*#__PURE__*/React.createElement(BreatherNode, {
        n: node.id,
        size: NODE
      });
    } else if (node.state === 'open') {
      inner = /*#__PURE__*/React.createElement(OpenNode, {
        n: node.id,
        size: NODE
      });
    } else if (node.state === 'done') {
      inner = /*#__PURE__*/React.createElement(DoneNode, {
        n: node.id,
        color: node.color,
        stars: node.stars,
        size: NODE
      });
    } else {
      inner = /*#__PURE__*/React.createElement(LockedRegularNode, {
        n: node.id,
        size: NODE
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: node.x - half,
        top: node.y - half
      }
    }, inner);
  }

  // ─── Gate chip (labels the painted locked gate → World 2) ───────────
  function GateChip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: 132,
        transform: 'translateX(-50%)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: '#FFFFFF',
        border: '1.5px solid #E6D8BD',
        borderRadius: 999,
        padding: '5px 12px 5px 6px',
        boxShadow: '0 8px 20px rgba(120,92,52,0.28), 0 3px 6px rgba(120,92,52,0.14)',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'radial-gradient(circle at 35% 25%, #B6DDB2 0%, #6FA86F 60%, #4F8C58 100%)',
        border: '2px solid #4F8C58',
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3c-3.6 4-5 7-5 9.3a5 5 0 0 0 10 0c0-2.3-1.4-5.3-5-9.3z",
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "10.6",
      y: "16.5",
      width: "2.8",
      height: "4.2",
      rx: "1",
      fill: "#FFFFFF"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.05,
        gap: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 8.5,
        letterSpacing: '0.12em',
        color: '#9B886F'
      }
    }, "C\u1ED4NG \xB7 TH\u1EBE GI\u1EDAI 2"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: '#3F7D49',
        lineHeight: 1.05
      }
    }, "R\u1EEBng r\u1EADm")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
        border: '1.5px solid #E0A21F',
        padding: '4px 9px 5px 6px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 14,
        color: '#6A4A2E',
        lineHeight: 1
      }
    }, "18")));
  }

  // Small start marker at the very bottom.
  function StartSign() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: H - 44,
        transform: 'translateX(-50%)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        padding: '6px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(120,92,52,0.24)',
        textTransform: 'uppercase'
      }
    }, "\u0110\u1ED3ng c\u1ECF \xB7 Kh\u1EDFi \u0111\u1EA7u"));
  }

  // ─── Top-level component ─────────────────────────────────────────────
  function World1Strip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-strip-halo {
            0%,100% { transform: scale(1.00); opacity: 1; }
            50%     { transform: scale(1.12); opacity: 0.85; }
          }
          @keyframes gj-strip-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes gj-strip-pulse {
            0%,100% { transform: scale(1);    opacity: 0.75; }
            50%     { transform: scale(1.10); opacity: 0.35; }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; }
          }
        `), /*#__PURE__*/React.createElement("img", {
      src: BG_SRC,
      alt: "",
      draggable: "false",
      style: {
        position: 'absolute',
        inset: 0,
        width: W,
        height: H,
        objectFit: 'cover',
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none'
      }
    }), /*#__PURE__*/React.createElement(GateChip, null), NODES.map(n => /*#__PURE__*/React.createElement(PlaceNode, {
      key: n.id,
      node: n
    })));
  }
  window.GJWorld1Strip = World1Strip;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world1-strip.jsx", error: String((e && e.message) || e) }); }

// 04-screens/world10-strip.jsx
try { (() => {
/* world10-strip.jsx — Dải cuộn ĐẦY ĐỦ World 10 "Vũ trụ" (màn 91–100) — THẾ
   GIỚI CUỐI CÙNG.
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục =
   ĐƯỜNG SAO / dải ngân hà nối các HÀNH TINH, số node 91→100:
     • 91–95 node thường · 96 BREATHER · 97–99 thường · 100 BOSS CUỐI
     • trên 100: KHÔNG có cổng sang thế giới mới — thay bằng ĐỈNH VŨ TRỤ /
       FINALE (vương miện vàng, hào quang, "Hoàn thành hành trình")
   Biome World 10 (deep space): TRỜI ĐÊM #1C1248→#2E1F6B→#3A2A7A. GIỮA là
   DẢI NGÂN HÀ SÁNG (lavender) cho đường + node. HAI MÉP là TINH VÂN tím dày
   #5A3A9E/#3A2A7A cuộn vào trong + sao. Trên nền: hành tinh có vành, sao
   băng, sao chổi, vệ tinh, chòm sao, HỐ TRỌNG LỰC tím (signature) hút nhẹ,
   lấp lánh. Mặt trên = FINALE vàng rực. Exposes window.GJWorld10Strip.     */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const {
    JellyBlock
  } = NS;
  const NODES = [{
    id: 91,
    x: 130,
    y: 2440,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'blue'
  }, {
    id: 92,
    x: 240,
    y: 2250,
    kind: 'reg',
    state: 'done',
    stars: 2,
    color: 'pink'
  }, {
    id: 93,
    x: 110,
    y: 2060,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'mint'
  }, {
    id: 94,
    x: 240,
    y: 1870,
    kind: 'reg',
    state: 'current'
  }, {
    id: 95,
    x: 120,
    y: 1680,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 96,
    x: 240,
    y: 1490,
    kind: 'breather',
    state: 'locked'
  }, {
    id: 97,
    x: 110,
    y: 1290,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 98,
    x: 240,
    y: 1090,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 99,
    x: 150,
    y: 880,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 100,
    x: 180,
    y: 620,
    kind: 'boss',
    state: 'locked'
  }];
  const ENTRY = {
    x: 180,
    y: 2620
  };
  const FINALE = {
    x: 180,
    y: 360
  };
  const EXIT = {
    x: 180,
    y: -40
  };
  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }
  const ALL_PTS = [ENTRY, ...NODES.map(n => ({
    x: n.x,
    y: n.y
  })), FINALE, EXIT];
  const FULL_PATH = pathD(ALL_PTS);
  const WALKED = pathD([ENTRY, NODES[0], NODES[1], NODES[2]]);

  // ─── scene ────────────────────────────────────────────────────────
  function Scene() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "w10s-space",
      x1: "0",
      y1: "1",
      x2: "0",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#3A2A7A"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#241765"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.86",
      stopColor: "#1C1248"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#2A1B5E"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w10s-trail",
      x1: "0",
      y1: "0",
      x2: "1",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#6E5CC8",
      stopOpacity: "0"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#9E8CF0",
      stopOpacity: "0.5"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#6E5CC8",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w10s-bank-l",
      x1: "0",
      y1: "0",
      x2: "1",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#4A2E8E"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#3A2576"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#2A1B5E",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w10s-bank-r",
      x1: "1",
      y1: "0",
      x2: "0",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#4A2E8E"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#3A2576"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#2A1B5E",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w10s-neb",
      cx: "0.5",
      cy: "0.5",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#C4A7FF",
      stopOpacity: "0.65"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#8A6CF0",
      stopOpacity: "0.32"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#6353D6",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w10s-neb2",
      cx: "0.5",
      cy: "0.5",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#F7A9C0",
      stopOpacity: "0.4"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#F7A9C0",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w10s-finale",
      cx: "0.5",
      cy: "0.35",
      r: "0.6"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFF3CC",
      stopOpacity: "0.9"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#FFD074",
      stopOpacity: "0.4"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#FFD074",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w10s-planet",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#9E8CF8"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#6353D6"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w10s-hole",
      cx: "0.5",
      cy: "0.5",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#160C3A"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.55",
      stopColor: "#160C3A"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.72",
      stopColor: "#7E6CF0"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.86",
      stopColor: "#A99CF6"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#A99CF6",
      stopOpacity: "0"
    }))), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: H,
      fill: "url(#w10s-space)"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: "240",
      fill: "url(#w10s-finale)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 90,
      cy: 1900,
      rx: 150,
      ry: 120,
      fill: "url(#w10s-neb)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 280,
      cy: 1200,
      rx: 140,
      ry: 110,
      fill: "url(#w10s-neb2)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 110,
      cy: 760,
      rx: 130,
      ry: 100,
      fill: "url(#w10s-neb)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 260,
      cy: 2200,
      rx: 120,
      ry: 90,
      fill: "url(#w10s-neb2)"
    }), /*#__PURE__*/React.createElement(NebulaBank, {
      side: "l"
    }), /*#__PURE__*/React.createElement(NebulaBank, {
      side: "r"
    }), /*#__PURE__*/React.createElement(Starfield, null), /*#__PURE__*/React.createElement(MilkyWay, null), /*#__PURE__*/React.createElement(Planet, {
      x: 292,
      y: 1640,
      r: 40,
      ring: true
    }), /*#__PURE__*/React.createElement(Planet, {
      x: 78,
      y: 1080,
      r: 30,
      ring: false,
      moon: true
    }), /*#__PURE__*/React.createElement(Planet, {
      x: 286,
      y: 2360,
      r: 26,
      ring: true
    }), /*#__PURE__*/React.createElement(Planet, {
      x: 86,
      y: 2000,
      r: 22,
      ring: false
    }), /*#__PURE__*/React.createElement(GravityWell, {
      x: 96,
      y: 1420,
      s: 0.78
    }), /*#__PURE__*/React.createElement(GravityWell, {
      x: 272,
      y: 820,
      s: 0.62
    }), [[300, 1820, '0s'], [70, 1480, '0.9s'], [296, 980, '1.4s'], [120, 2120, '0.5s']].map(([x, y, d], i) => /*#__PURE__*/React.createElement(Comet, {
      key: `co${i}`,
      x: x,
      y: y,
      delay: d
    })), [[110, 1740, '0s'], [262, 1380, '0.7s'], [120, 940, '1.2s']].map(([x, y, d], i) => /*#__PURE__*/React.createElement(Satellite, {
      key: `sa${i}`,
      x: x,
      y: y,
      delay: d
    })), /*#__PURE__*/React.createElement(Constellation, {
      x: 60,
      y: 1640,
      pts: [[0, 0], [26, 18], [14, 46], [44, 40], [58, 12]],
      delay: "0s"
    }), /*#__PURE__*/React.createElement(Constellation, {
      x: 250,
      y: 1080,
      pts: [[0, 10], [22, 0], [38, 26], [16, 40]],
      delay: "0.6s"
    }), [[150, 2280], [120, 1560], [240, 1140], [160, 760], [200, 1940], [130, 1020], [280, 1300], [70, 700]].map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
      key: `sp${i}`
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "1.8",
      fill: "#FFFFFF",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 14,
      cy: y + 18,
      r: "1.1",
      fill: "#C4B5FA",
      opacity: "0.85"
    }))), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 1170,
      size: 20,
      color: "mint",
      delay: "0s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 56,
      y: 2000,
      size: 22,
      color: "yellow",
      delay: "0.8s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 2280,
      size: 18,
      color: "pink",
      delay: "1.4s"
    }));
  }
  function Starfield() {
    const stars = [];
    let seed = 7;
    const rnd = () => (seed = seed * 1103515245 + 12345 & 0x7fffffff) / 0x7fffffff;
    for (let i = 0; i < 150; i++) {
      const x = Math.round(rnd() * W);
      const y = Math.round(rnd() * H);
      const r = 0.7 + rnd() * 1.6;
      const tw = rnd() > 0.7;
      if (tw) {
        stars.push(/*#__PURE__*/React.createElement("g", {
          key: `sf${i}`,
          style: {
            animation: 'gj-w10s-tw 2400ms ease-in-out infinite',
            animationDelay: `${rnd() * 2}s`,
            transformOrigin: `${x}px ${y}px`
          }
        }, /*#__PURE__*/React.createElement("circle", {
          cx: x,
          cy: y,
          r: r,
          fill: rnd() > 0.85 ? '#C4B5FA' : '#FFFFFF'
        })));
      } else {
        stars.push(/*#__PURE__*/React.createElement("circle", {
          key: `sf${i}`,
          cx: x,
          cy: y,
          r: r,
          fill: "#FFFFFF",
          opacity: 0.5 + rnd() * 0.4
        }));
      }
    }
    return /*#__PURE__*/React.createElement("g", null, stars);
  }
  function MilkyWay() {
    // soft luminous band following the serpentine, drawn as a wide blurred stroke
    return /*#__PURE__*/React.createElement("g", {
      opacity: "0.5"
    }, /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "url(#w10s-trail)",
      strokeWidth: "120",
      strokeLinecap: "round",
      style: {
        filter: 'blur(14px)'
      }
    }));
  }
  function NebulaBank({
    side
  }) {
    const isL = side === 'l';
    const fill = isL ? 'url(#w10s-bank-l)' : 'url(#w10s-bank-r)';
    const X = v => isL ? v : W - v;
    const outerX = isL ? -24 : W + 24;
    const inset = i => [78, 60, 70, 62][i % 4];
    const pts = [];
    for (let y = 240, i = 0; y <= H + 40; y += 150, i++) {
      pts.push([X(inset(i)), y, i]);
    }
    let d = `M ${outerX} 240 L ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      const my = (py + y) / 2;
      d += `Q ${px} ${my} ${x} ${y} `;
    }
    d += `L ${outerX} ${H + 40} Z`;
    let edge = `M ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      edge += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    // glowing nebula lobes bulging inward
    const lobes = [];
    for (let y = 300, i = 0; y < H; y += 130, i++) {
      const ix = inset(Math.round((y - 240) / 150));
      const r = 30 + i % 3 * 14;
      lobes.push(/*#__PURE__*/React.createElement("ellipse", {
        key: `nl${i}`,
        cx: X(ix - r * 0.3),
        cy: y,
        rx: r,
        ry: r * 0.8,
        fill: "url(#w10s-neb)",
        opacity: "0.7"
      }));
    }
    // sparkle stars tucked in the bank
    const glints = [];
    for (let y = 360, i = 0; y < H; y += 220, i++) {
      glints.push(/*#__PURE__*/React.createElement("g", {
        key: `gl${i}`,
        style: {
          animation: 'gj-w10s-tw 2400ms ease-in-out infinite',
          animationDelay: `${i * 0.3}s`,
          transformOrigin: `${X(40)}px ${y}px`
        }
      }, /*#__PURE__*/React.createElement("circle", {
        cx: X(40),
        cy: y,
        r: i % 2 ? 1.8 : 2.6,
        fill: i % 3 ? '#FFFFFF' : '#C4B5FA'
      })));
    }
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: fill
    }), lobes, glints, /*#__PURE__*/React.createElement("path", {
      d: edge,
      fill: "none",
      stroke: "#7E6CF0",
      strokeWidth: "6",
      opacity: "0.30",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: edge,
      fill: "none",
      stroke: "#C4B5FA",
      strokeWidth: "2",
      opacity: "0.6",
      strokeLinecap: "round"
    }));
  }
  function Planet({
    x,
    y,
    r,
    ring,
    moon
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w10s-bob 7s ease-in-out infinite',
        transformOrigin: `${x}px ${y}px`,
        filter: 'drop-shadow(0 0 14px rgba(169,156,246,0.45))'
      }
    }, ring && /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: r * 1.6,
      ry: r * 0.42,
      fill: "none",
      stroke: "#C4B5FA",
      strokeWidth: "3.5",
      opacity: "0.8",
      transform: `rotate(-20 ${x} ${y})`
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r,
      fill: "url(#w10s-planet)",
      stroke: "#A99CF6",
      strokeWidth: "2.5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - r * 0.3,
      cy: y - r * 0.3,
      rx: r * 0.34,
      ry: r * 0.22,
      fill: "#C4B5FA",
      opacity: "0.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + r * 0.32,
      cy: y + r * 0.28,
      r: r * 0.18,
      fill: "#5847BE",
      opacity: "0.6"
    }), ring && /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: r * 1.6,
      ry: r * 0.42,
      fill: "none",
      stroke: "#8A77E6",
      strokeWidth: "1.5",
      opacity: "0.5",
      transform: `rotate(-20 ${x} ${y})`,
      strokeDasharray: "2 5"
    }), moon && /*#__PURE__*/React.createElement("circle", {
      cx: x + r + 14,
      cy: y - r * 0.5,
      r: r * 0.32,
      fill: "#B3C7F7",
      stroke: "#7E9CE8",
      strokeWidth: "1.5"
    }));
  }
  function GravityWell({
    x,
    y,
    s = 1
  }) {
    const R = 52 * s;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: R,
      fill: "url(#w10s-hole)"
    }), /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w10s-spin 7s linear infinite',
        transformOrigin: `${x}px ${y}px`
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: 48 * s,
      ry: 16 * s,
      fill: "none",
      stroke: "#A99CF6",
      strokeWidth: 3 * s,
      opacity: "0.85",
      transform: `rotate(-16 ${x} ${y})`
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: 62 * s,
      ry: 21 * s,
      fill: "none",
      stroke: "#7E6CF0",
      strokeWidth: 2 * s,
      opacity: "0.5",
      transform: `rotate(-16 ${x} ${y})`
    })), [0, 72, 144, 216, 288].map((a, i) => {
      const r = a * Math.PI / 180;
      return /*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: x + Math.cos(r) * 58 * s,
        cy: y + Math.sin(r) * 20 * s,
        r: 2.4 * s,
        fill: "#FFFFFF",
        opacity: "0.85",
        style: {
          animation: 'gj-w10s-tw 1800ms ease-in-out infinite',
          animationDelay: `${i * 0.25}s`,
          transformOrigin: `${x}px ${y}px`
        }
      });
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: 20 * s,
      fill: "#120A30"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - 6 * s,
      cy: y - 6 * s,
      r: 5 * s,
      fill: "#3A2A7A",
      opacity: "0.7"
    }));
  }
  function Comet({
    x,
    y,
    delay = '0s'
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w10s-comet 5s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`
      },
      opacity: "0.85"
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y} L ${x - 46} ${y + 30}`,
      stroke: "#C4B5FA",
      strokeWidth: "6",
      strokeLinecap: "round",
      opacity: "0.35"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y} L ${x - 34} ${y + 22}`,
      stroke: "#FFFFFF",
      strokeWidth: "2.6",
      strokeLinecap: "round",
      opacity: "0.7"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "4.5",
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "9",
      fill: "#C4B5FA",
      opacity: "0.3"
    }));
  }
  function Satellite({
    x,
    y,
    delay = '0s'
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w10s-bob 6s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`,
        filter: 'drop-shadow(0 0 6px rgba(169,156,246,0.4))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - 6,
      y: y - 6,
      width: "12",
      height: "12",
      rx: "3",
      fill: "#B6A6F8",
      stroke: "#7E6CF0",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: x - 22,
      y: y - 5,
      width: "12",
      height: "10",
      rx: "2",
      fill: "#5847BE",
      stroke: "#A99CF6",
      strokeWidth: "1.2"
    }), /*#__PURE__*/React.createElement("rect", {
      x: x + 10,
      y: y - 5,
      width: "12",
      height: "10",
      rx: "2",
      fill: "#5847BE",
      stroke: "#A99CF6",
      strokeWidth: "1.2"
    }), /*#__PURE__*/React.createElement("line", {
      x1: x - 10,
      y1: y,
      x2: x + 10,
      y2: y,
      stroke: "#A99CF6",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y - 12,
      r: "2",
      fill: "#FFE3A3"
    }), /*#__PURE__*/React.createElement("line", {
      x1: x,
      y1: y - 6,
      x2: x,
      y2: y - 11,
      stroke: "#A99CF6",
      strokeWidth: "1.2"
    }));
  }
  function Constellation({
    x,
    y,
    pts,
    delay = '0s'
  }) {
    let d = `M ${x + pts[0][0]} ${y + pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${x + pts[i][0]} ${y + pts[i][1]}`;
    return /*#__PURE__*/React.createElement("g", {
      opacity: "0.7",
      style: {
        animation: 'gj-w10s-tw 3000ms ease-in-out infinite',
        animationDelay: delay
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: "#A99CF6",
      strokeWidth: "1",
      opacity: "0.5"
    }), pts.map(([dx, dy], i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x + dx,
      cy: y + dy,
      r: i === 0 || i === pts.length - 1 ? 2.4 : 1.8,
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + dx,
      cy: y + dy,
      r: "5",
      fill: "#C4B5FA",
      opacity: "0.2"
    }))));
  }
  function FloatJelly({
    x,
    y,
    size,
    color,
    delay
  }) {
    const p = {
      yellow: {
        f: '#FFE3A3',
        e: '#E8B85C',
        s: '#FFF1CE'
      },
      mint: {
        f: '#A3E5D9',
        e: '#5FC3B2',
        s: '#CBF2EB'
      },
      pink: {
        f: '#F7A9C0',
        e: '#E576A0',
        s: '#FBD0DF'
      },
      blue: {
        f: '#B3C7F7',
        e: '#7E9CE8',
        s: '#D6E1FB'
      }
    }[color] || {
      f: '#FFE3A3',
      e: '#E8B85C',
      s: '#FFF1CE'
    };
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w10s-float 3.6s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`,
        filter: 'drop-shadow(0 0 6px rgba(169,156,246,0.5))'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: size * 0.78,
      fill: "#C4B5FA",
      opacity: "0.14"
    }), /*#__PURE__*/React.createElement("rect", {
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
      rx: Math.round(size * 0.28),
      fill: p.f,
      stroke: p.e,
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y - size * 0.18,
      rx: size * 0.34,
      ry: size * 0.12,
      fill: p.s,
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }));
  }

  // ─── path ─────────────────────────────────────────────────────────
  function PathLayer() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "rgba(20,12,48,0.5)",
      strokeWidth: "34",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      transform: "translate(0,5)"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#4A3A8E",
      strokeWidth: "30",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#6E5CC8",
      strokeWidth: "26",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#C4B5FA",
      strokeWidth: "3.5",
      strokeLinecap: "round",
      strokeDasharray: "7 11"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FF9F68",
      strokeWidth: "20",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "6",
      strokeLinecap: "round",
      strokeDasharray: "4 9",
      opacity: "0.9"
    }));
  }

  // ─── stars / node primitives (shared) ────────────────────────────
  function Star({
    filled = false,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z",
      fill: filled ? '#FFC23D' : '#5A4A9E',
      stroke: filled ? '#E0A21F' : '#8A77E6',
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }));
  }
  function StarArc({
    stars = 3,
    size = 14,
    width = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -size - 6,
        transform: 'translateX(-50%)',
        width,
        height: size + 8,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(-22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-2px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }
  function NumberBadge({
    n,
    size,
    color = '#6A4A2E'
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.34),
        lineHeight: 1,
        color,
        textShadow: '0 1px 0 rgba(255,255,255,0.55)',
        pointerEvents: 'none'
      }
    }, n);
  }
  function LockGlyph({
    size = 18
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M8 11V8.5a4 4 0 1 1 8 0V11",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "2.6",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "11",
      width: "14",
      height: "9",
      rx: "2.5",
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "15",
      r: "1.4",
      fill: "#A89A82"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "11.3",
      y: "15",
      width: "1.4",
      height: "3",
      rx: "0.6",
      fill: "#A89A82"
    }));
  }
  function DoneNode({
    n,
    color,
    stars,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 5px 10px rgba(20,12,48,0.55))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -8,
        top: -8,
        width: size + 16,
        height: size + 16,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(196,181,250,0.4), rgba(196,181,250,0))'
      }
    }), /*#__PURE__*/React.createElement(JellyBlock, {
      color: color,
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement(NumberBadge, {
      n: n,
      size: size
    }), /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 14,
      width: size + 14
    }));
  }
  function LockedRegularNode({
    n,
    size = 60
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 8px rgba(20,12,48,0.5))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.34),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n), /*#__PURE__*/React.createElement(StarArc, {
      stars: 0,
      size: 12,
      width: size + 8
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -4,
        bottom: -4,
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: '#8A7B62',
        border: '2px solid #FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(20,12,48,0.5)'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: 13
    })));
  }
  function CurrentNode({
    n,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -16,
        top: -16,
        width: size + 32,
        height: size + 32,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.30)',
        animation: 'gj-w10s-pulse 1600ms ease-out infinite'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -5,
        top: -5,
        width: size + 10,
        height: size + 10,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.40)',
        animation: 'gj-w10s-pulse 1600ms ease-out infinite',
        animationDelay: '320ms'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#FFFFFF',
        border: '3px solid #FF9F68',
        boxShadow: '0 6px 18px rgba(20,12,48,0.5), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: size - 16,
      height: size - 16,
      viewBox: "0 0 40 40",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "20",
      cy: "20",
      r: "18",
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "2",
      strokeDasharray: "3 4"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#E97E45'
      }
    }, n)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -40,
        transform: 'translateX(-50%)',
        animation: 'gj-w10s-hop 1400ms ease-in-out infinite',
        filter: 'drop-shadow(0 4px 4px rgba(20,12,48,0.5))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "pink",
      size: 38,
      direction: "down",
      expression: "happy"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: size + 10,
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)',
        color: '#FFFFFF',
        border: '2px solid #E97E45',
        borderBottom: '3px solid #C8662F',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '5px 14px 6px',
        borderRadius: 999,
        boxShadow: '0 6px 12px rgba(201,102,47,0.4), inset 0 2px 0 rgba(255,197,154,0.6)',
        whiteSpace: 'nowrap'
      }
    }, "Ch\u01A1i ngay"));
  }
  function BreatherNode({
    n,
    size = 48
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -10,
        left: size + 8,
        background: '#FFFFFF',
        color: '#8C7458',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.10em',
        padding: '4px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 8px rgba(20,12,48,0.5)',
        whiteSpace: 'nowrap'
      }
    }, "NGH\u1EC8"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -6,
        left: size + 4,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#FFD074',
        border: '1.5px solid #E0A21F'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 8px rgba(20,12,48,0.5))',
        opacity: 0.92
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.30} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.55} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: size * 0.15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.28),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n)));
  }
  function BossNode({
    n,
    size = 84
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 8px 18px rgba(126,108,240,0.55))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -30,
        top: -30,
        right: -30,
        bottom: -30,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.7) 0%, rgba(126,108,240,0.36) 55%, rgba(126,108,240,0) 78%)',
        animation: 'gj-w10s-halo 2400ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement("svg", {
      width: size + 60,
      height: size + 60,
      viewBox: "0 0 200 200",
      style: {
        position: 'absolute',
        left: -30,
        top: -30,
        pointerEvents: 'none',
        animation: 'gj-w10s-spin 8s linear infinite',
        transformOrigin: '50% 50%'
      }
    }, [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
      const rad = a * Math.PI / 180;
      const cx = 100 + Math.cos(rad) * 86;
      const cy = 100 + Math.sin(rad) * 86;
      return /*#__PURE__*/React.createElement("g", {
        key: a
      }, /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "4.5",
        fill: "#FFFFFF",
        opacity: "0.95"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "2.5",
        fill: "#A99CF6"
      }));
    })), /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)',
        border: '3px solid #FFFFFF',
        boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: Math.round(size * 0.26)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -24,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
        color: '#FFFFFF',
        border: '2px solid #6353D6',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.14em',
        padding: '4px 13px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 1.5px 0 rgba(255,255,255,0.45)',
        whiteSpace: 'nowrap'
      }
    }, "BOSS CU\u1ED0I"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: -22,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #EFE0C9',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '2px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(20,12,48,0.5)'
      }
    }, "m\xE0n ", n));
  }
  function PlaceNode({
    node
  }) {
    let inner = null,
      half = 32;
    if (node.kind === 'boss') {
      inner = /*#__PURE__*/React.createElement(BossNode, {
        n: node.id,
        size: 84
      });
      half = 42;
    } else if (node.kind === 'breather') {
      inner = /*#__PURE__*/React.createElement(BreatherNode, {
        n: node.id,
        size: 48
      });
      half = 24;
    } else if (node.state === 'current') {
      inner = /*#__PURE__*/React.createElement(CurrentNode, {
        n: node.id,
        size: 64
      });
      half = 32;
    } else if (node.state === 'done') {
      inner = /*#__PURE__*/React.createElement(DoneNode, {
        n: node.id,
        color: node.color,
        stars: node.stars,
        size: 64
      });
      half = 32;
    } else {
      inner = /*#__PURE__*/React.createElement(LockedRegularNode, {
        n: node.id,
        size: 60
      });
      half = 30;
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: node.x - half,
        top: node.y - half,
        zIndex: node.kind === 'boss' ? 14 : node.state === 'current' ? 12 : 5
      }
    }, inner);
  }

  // ─── FINALE — đỉnh vũ trụ (thay cho cổng sang thế giới mới) ────────
  function FinaleBanner() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: FINALE.y - 96,
        transform: 'translateX(-50%)',
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 16
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "300",
      height: "190",
      viewBox: "0 0 300 190",
      style: {
        position: 'absolute',
        top: -8,
        left: 0,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w10s-spin 30s linear infinite',
        transformOrigin: '150px 96px'
      }
    }, Array.from({
      length: 16
    }).map((_, i) => {
      const a = i / 16 * Math.PI * 2;
      const x1 = 150 + Math.cos(a) * 46,
        y1 = 96 + Math.sin(a) * 46;
      const x2 = 150 + Math.cos(a) * (i % 2 ? 92 : 76),
        y2 = 96 + Math.sin(a) * (i % 2 ? 92 : 76);
      return /*#__PURE__*/React.createElement("line", {
        key: i,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: "#FFD074",
        strokeWidth: "3",
        strokeLinecap: "round",
        opacity: "0.5"
      });
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 92,
        height: 92,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 28%, #FFF6D6 0%, #FFD074 55%, #E8A82E 100%)',
        border: '3px solid #FFFFFF',
        boxShadow: '0 10px 26px rgba(232,168,46,0.5), inset 0 -4px 0 rgba(200,140,30,0.4), inset 0 4px 0 rgba(255,255,255,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'gj-w10s-bob 3.4s ease-in-out infinite'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "56",
      height: "56",
      viewBox: "0 0 48 48",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M8 32 L6 16 L16 24 L24 11 L32 24 L42 16 L40 32 Z",
      fill: "#FFF1C2",
      stroke: "#C8861E",
      strokeWidth: "2",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "8",
      y: "32",
      width: "32",
      height: "6",
      rx: "2",
      fill: "#FFE08A",
      stroke: "#C8861E",
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "24",
      cy: "11",
      r: "3",
      fill: "#F7A9C0",
      stroke: "#C8861E",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "6",
      cy: "16",
      r: "2.6",
      fill: "#A3E5D9",
      stroke: "#C8861E",
      strokeWidth: "1.3"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "42",
      cy: "16",
      r: "2.6",
      fill: "#B3C7F7",
      stroke: "#C8861E",
      strokeWidth: "1.3"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "30",
      r: "2",
      fill: "#E576A0"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "30",
      cy: "30",
      r: "2",
      fill: "#7E9CE8"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        width: 270,
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF6E2 100%)',
        border: '1.5px solid #F0D69C',
        borderRadius: 24,
        padding: '12px 16px 14px',
        textAlign: 'center',
        boxShadow: '0 14px 30px rgba(20,12,48,0.5), inset 0 2px 0 rgba(255,255,255,0.85)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.16em',
        color: '#C8861E'
      }
    }, "\u0110\u1EC8NH V\u0168 TR\u1EE4 \xB7 CH\u01AF\u01A0NG CU\u1ED0I"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#5B4636',
        lineHeight: 1.05,
        marginTop: 3
      }
    }, "Ho\xE0n th\xE0nh h\xE0nh tr\xECnh"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 12,
        color: '#9B886F',
        marginTop: 4
      }
    }, "V\u01B0\u1EE3t m\xE0n 100 \u0111\u1EC3 c\u1EE9u c\u1EA3 d\u1EA3i ng\xE2n h\xE0 jelly"), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '10px auto 0',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
        border: '1.5px solid #E0A21F',
        padding: '5px 13px 6px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(200,150,40,0.3), inset 0 1.5px 0 rgba(255,255,255,0.6)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 14
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: '#6A4A2E',
        lineHeight: 1
      }
    }, "300"))));
  }
  function StartSign() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: H - 90,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#FFFFFF',
        color: '#5B4ECB',
        border: '1.5px solid #C9BEF0',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        padding: '6px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(20,12,48,0.5)',
        textTransform: 'uppercase'
      }
    }, "V\u0169 tr\u1EE5 \xB7 ch\u1EB7ng cu\u1ED1i"));
  }
  function World10Strip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: '#1C1248',
        fontFamily: 'var(--font-body)',
        color: '#EDE7FF',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-w10s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w10s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w10s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w10s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w10s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @keyframes gj-w10s-bob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes gj-w10s-comet { 0%,100%{transform:translate(0,0);opacity:0.4} 50%{transform:translate(-6px,4px);opacity:1} }
          @keyframes gj-w10s-tw    { 0%,100%{opacity:0.35;transform:scale(0.85)} 50%{opacity:1;transform:scale(1.2)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `), /*#__PURE__*/React.createElement(Scene, null), /*#__PURE__*/React.createElement(PathLayer, null), /*#__PURE__*/React.createElement(FinaleBanner, null), NODES.map(n => /*#__PURE__*/React.createElement(PlaceNode, {
      key: n.id,
      node: n
    })), /*#__PURE__*/React.createElement(StartSign, null));
  }
  window.GJWorld10Strip = World10Strip;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world10-strip.jsx", error: String((e && e.message) || e) }); }

// 04-screens/world2-strip.jsx
try { (() => {
/* world2-strip.jsx — Level-Map SCROLL STRIP for World 2 "Rừng rậm".
   ----------------------------------------------------------------
   Same approach as World 1: pure painted artboard 360 × 1280dp, NO HUD.
   The scenery + winding jungle road + locked gate are a single painted
   PNG backdrop (06-svg-assets/backgrounds/world2-map-bg-v3.png, 665×2365
   → exact 1:~3.55, scaled to 360 wide = 360×1280, no distortion). We do
   NOT draw trees/bushes/path in SVG — we just DROP the ten level nodes
   onto the painted trail. Reads bottom→top:

     • L11 → L15 : regular nodes (L11–L13 done w/ stars, L14 open, L15 locked)
     • L16       : BREATHER
     • L17 → L19 : regular nodes (stone-locked)
     • L20       : BOSS
     • top       : the painted locked GATE → World 3 "Sông & Thác"
                   (a compact stars-required chip labels it)

   Reuses DS tokens & tile art. Exposes window.GJWorld2Strip.
   ---------------------------------------------------------------- */
(function () {
  const BG_SRC = '../06-svg-assets/backgrounds/world2-map-bg-v3.png';
  const LOCK_SRC = '../06-svg-assets/ui/locked-tile.png';
  const OPEN_SRC = '../06-svg-assets/ui/unlocked-tile.png';
  const DONE_SRC = '../06-svg-assets/ui/completed-tile.png';
  const STAR_ON = '../06-svg-assets/ui/star-on.png'; // earned (yellow)
  const STAR_OFF = '../06-svg-assets/ui/star-off.png'; // empty (grey)

  // ─── Geometry ──────────────────────────────────────────────────────────
  const W = 360;
  const H = 1280; // 665×2365 backdrop scaled to 360 wide (exact 360×1280)

  // One uniform node size across every node type.
  const NODE = 62;

  // Node positions: 11 on the straight bottom, 12→20 snapped to the CURVE
  // CORNERS of the painted trail (alternating left/right bends), bottom→top.
  const NODES = [{
    id: 11,
    x: 200,
    y: 1170,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'yellow'
  },
  // straight
  {
    id: 12,
    x: 122,
    y: 1061,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'mint'
  },
  // L bend
  {
    id: 13,
    x: 238,
    y: 968,
    kind: 'reg',
    state: 'done',
    stars: 2,
    color: 'pink'
  },
  // R bend
  {
    id: 14,
    x: 125,
    y: 872,
    kind: 'reg',
    state: 'open'
  },
  // L bend
  {
    id: 15,
    x: 240,
    y: 782,
    kind: 'reg',
    state: 'locked'
  },
  // R bend
  {
    id: 16,
    x: 116,
    y: 687,
    kind: 'breather',
    state: 'locked'
  },
  // L bend
  {
    id: 17,
    x: 231,
    y: 606,
    kind: 'reg',
    state: 'locked'
  },
  // R bend
  {
    id: 18,
    x: 139,
    y: 541,
    kind: 'reg',
    state: 'locked'
  },
  // L bend
  {
    id: 19,
    x: 232,
    y: 478,
    kind: 'reg',
    state: 'locked'
  },
  // R bend
  {
    id: 20,
    x: 140,
    y: 415,
    kind: 'boss',
    state: 'locked'
  } // L bend (below gate)
  ];

  // ─── Stars ────────────────────────────────────────────────────────────
  function Star({
    filled = false,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("img", {
      src: filled ? STAR_ON : STAR_OFF,
      alt: "",
      draggable: "false",
      style: {
        width: size,
        height: size,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: filled ? 'drop-shadow(0 1px 1.5px rgba(190,120,20,0.5))' : 'drop-shadow(0 1px 1.5px rgba(120,92,52,0.32))'
      }
    });
  }
  function StarArc({
    stars = 3,
    size = 15,
    width = 46
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: Math.round(size * 0.18),
        transform: 'translateX(-50%)',
        width,
        height: size + 6,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(2px) rotate(-18deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-3px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 3
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(2px) rotate(18deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }

  // ─── Node primitives ─────────────────────────────────────────────────
  function CenterNum({
    n,
    size,
    color = '#6A4A2E',
    vy = 0.5,
    scale = 0.34,
    shadow = '0 1px 0 rgba(255,255,255,0.65)'
  }) {
    const digits = String(n).length;
    const dscale = digits >= 3 ? 0.66 : digits === 2 ? 0.82 : 1;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${vy * 100}%`,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * scale * dscale),
        lineHeight: 1,
        color,
        textShadow: shadow,
        pointerEvents: 'none'
      }
    }, n);
  }
  function Tile({
    src,
    size,
    shadow
  }) {
    return /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: "",
      draggable: "false",
      style: {
        position: 'relative',
        width: size,
        height: size,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: `drop-shadow(${shadow})`
      }
    });
  }
  function DoneNode({
    n,
    stars,
    size = 60
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement(Tile, {
      src: DONE_SRC,
      size: size,
      shadow: "0 5px 7px rgba(120,92,52,0.30)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#B67A16",
      vy: 0.56,
      scale: 0.36
    }), /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 15,
      width: 54
    }));
  }

  // Unlocked-but-not-yet-played: bright yellow tile, prominent centred number, pulse.
  function OpenNode({
    n,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -16,
        top: -16,
        right: -16,
        bottom: -16,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,159,104,0.55) 0%, rgba(255,159,104,0.22) 55%, rgba(255,159,104,0) 78%)',
        animation: 'gj-strip-pulse 1800ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement(Tile, {
      src: OPEN_SRC,
      size: size,
      shadow: "0 6px 9px rgba(120,92,52,0.30)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#B67A16",
      vy: 0.52,
      scale: 0.38
    }));
  }

  // Locked cream tile — the padlock is painted at the bottom, so the number
  // sits in the empty upper area.
  function LockedRegularNode({
    n,
    size = 58
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement(Tile, {
      src: LOCK_SRC,
      size: size,
      shadow: "0 5px 7px rgba(120,92,52,0.26)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#8A7A63",
      vy: 0.33,
      scale: 0.34
    }));
  }
  function BreatherNode({
    n,
    size = 52
  }) {
    return /*#__PURE__*/React.createElement(LockedRegularNode, {
      n: n,
      size: size
    });
  }

  // ─── BOSS GATE ───────────────────────────────────────────────────────
  // Ornate framed gate node marking the world's boss level (10/20/30…).
  // Three states: locked (gold + padlock) · current (amethyst, playable)
  // · cleared (gold + ruby, beaten). Sized by width; height follows the art.
  const BOSS_SRC = {
    locked: '../06-svg-assets/ui/boss-gate-locked.png',
    current: '../06-svg-assets/ui/boss-gate-current.png',
    cleared: '../06-svg-assets/ui/boss-gate-cleared.png'
  };
  // aspect (h/w) + panel-centre anchor (fraction of image) + number colour
  const BOSS_META = {
    locked: {
      ar: 1.1118,
      vx: 0.477,
      vy: 0.423,
      num: '#8A6A2E'
    },
    current: {
      ar: 1.0404,
      vx: 0.498,
      vy: 0.502,
      num: '#6A4A2E'
    },
    cleared: {
      ar: 1.0266,
      vx: 0.500,
      vy: 0.501,
      num: '#B67A16'
    }
  };
  function BossGateNode({
    n,
    variant = 'locked',
    stars = 3,
    width = 104
  }) {
    const m = BOSS_META[variant];
    const w = width,
      h = Math.round(width * m.ar);
    const shadow = variant === 'current' ? '0 7px 14px rgba(126,108,240,0.40)' : variant === 'cleared' ? '0 7px 13px rgba(200,150,40,0.36)' : '0 7px 12px rgba(120,92,52,0.30)';
    const numSize = Math.round(w * (String(n).length >= 2 ? 0.34 : 0.42));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: w,
        height: h
      }
    }, variant === 'current' && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -18,
        top: -14,
        right: -18,
        bottom: -14,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.60) 0%, rgba(126,108,240,0.28) 55%, rgba(126,108,240,0) 80%)',
        animation: 'gj-strip-pulse 1800ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: BOSS_SRC[variant],
      alt: "",
      draggable: "false",
      style: {
        position: 'relative',
        width: w,
        height: h,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: `drop-shadow(${shadow})`
      }
    }), variant === 'cleared' && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${(m.vy - 0.30) * 100}%`
      }
    }, /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 16,
      width: 62
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: numSize,
        lineHeight: 1,
        color: m.num,
        textShadow: '0 1px 0 rgba(255,255,255,0.7)',
        pointerEvents: 'none'
      }
    }, n));
  }
  function PlaceNode({
    node
  }) {
    const half = NODE / 2;
    if (node.kind === 'boss') {
      const variant = node.state === 'done' ? 'cleared' : node.state === 'open' ? 'current' : 'locked';
      const BW = 66;
      const m = BOSS_META[variant];
      const bh = Math.round(BW * m.ar);
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          zIndex: 3,
          left: Math.round(node.x - m.vx * BW),
          top: Math.round(node.y - m.vy * bh)
        }
      }, /*#__PURE__*/React.createElement(BossGateNode, {
        n: node.id,
        variant: variant,
        stars: node.stars || 3,
        width: BW
      }));
    }
    let inner = null;
    if (node.kind === 'breather') {
      inner = /*#__PURE__*/React.createElement(BreatherNode, {
        n: node.id,
        size: NODE
      });
    } else if (node.state === 'open') {
      inner = /*#__PURE__*/React.createElement(OpenNode, {
        n: node.id,
        size: NODE
      });
    } else if (node.state === 'done') {
      inner = /*#__PURE__*/React.createElement(DoneNode, {
        n: node.id,
        color: node.color,
        stars: node.stars,
        size: NODE
      });
    } else {
      inner = /*#__PURE__*/React.createElement(LockedRegularNode, {
        n: node.id,
        size: NODE
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: node.x - half,
        top: node.y - half
      }
    }, inner);
  }

  // ─── Gate chip (labels the painted locked gate → World 3) ───────────
  function GateChip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: 110,
        transform: 'translateX(-50%)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: '#FFFFFF',
        border: '1.5px solid #E6D8BD',
        borderRadius: 999,
        padding: '5px 12px 5px 6px',
        boxShadow: '0 8px 20px rgba(120,92,52,0.28), 0 3px 6px rgba(120,92,52,0.14)',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'radial-gradient(circle at 35% 25%, #C8ECF2 0%, #5FB7C9 60%, #3E94A8 100%)',
        border: '2px solid #3E94A8',
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 12c2.5-2 4.5-2 7 0s4.5 2 7 0",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "2.4",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 16c2.5-2 4.5-2 7 0s4.5 2 7 0",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "2.4",
      strokeLinecap: "round",
      opacity: "0.75"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.05,
        gap: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 8.5,
        letterSpacing: '0.12em',
        color: '#9B886F'
      }
    }, "C\u1ED4NG \xB7 TH\u1EBE GI\u1EDAI 3"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: '#2C7C8E',
        lineHeight: 1.05
      }
    }, "S\xF4ng & Th\xE1c")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
        border: '1.5px solid #E0A21F',
        padding: '4px 9px 5px 6px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 14,
        color: '#6A4A2E',
        lineHeight: 1
      }
    }, "36")));
  }

  // Small start marker at the very bottom.
  function StartSign() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: H - 44,
        transform: 'translateX(-50%)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        padding: '6px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(120,92,52,0.24)',
        textTransform: 'uppercase'
      }
    }, "R\u1EEBng r\u1EADm \xB7 Ti\u1EBFp t\u1EE5c"));
  }

  // ─── Top-level component ─────────────────────────────────────────────
  function World2Strip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-strip-pulse {
            0%,100% { transform: scale(1);    opacity: 0.75; }
            50%     { transform: scale(1.10); opacity: 0.35; }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; }
          }
        `), /*#__PURE__*/React.createElement("img", {
      src: BG_SRC,
      alt: "",
      draggable: "false",
      style: {
        position: 'absolute',
        inset: 0,
        width: W,
        height: H,
        objectFit: 'cover',
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none'
      }
    }), /*#__PURE__*/React.createElement(GateChip, null), NODES.map(n => /*#__PURE__*/React.createElement(PlaceNode, {
      key: n.id,
      node: n
    })));
  }
  window.GJWorld2Strip = World2Strip;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world2-strip.jsx", error: String((e && e.message) || e) }); }

// 04-screens/world3-strip.jsx
try { (() => {
/* world3-strip.jsx — Level-Map SCROLL STRIP for World 3 "Sông & Thác".
   ----------------------------------------------------------------
   Same approach as World 2: pure painted artboard 360 × 1280dp, NO HUD.
   The scenery + winding river road + locked gate are a single painted
   PNG backdrop (06-svg-assets/backgrounds/world3-map-bg.png, 665×2365
   → exact 1:~3.556, scaled to 360 wide = 360×1280, no distortion). We do
   NOT draw rocks/waterfalls/path in SVG — we just DROP the ten level nodes
   onto the painted trail. Reads bottom→top:

     • L21 → L25 : regular nodes (L21–L23 done w/ stars, L24 open, L25 locked)
     • L26       : BREATHER
     • L27 → L29 : regular nodes (stone-locked)
     • L30       : BOSS
     • top       : the painted locked GATE → World 4 "Sa mạc"
                   (a compact stars-required chip labels it)

   Reuses DS tokens & tile art. Exposes window.GJWorld3Strip.
   ---------------------------------------------------------------- */
(function () {
  const BG_SRC = '../06-svg-assets/backgrounds/world3-map-bg.png';
  const LOCK_SRC = '../06-svg-assets/ui/locked-tile.png';
  const OPEN_SRC = '../06-svg-assets/ui/unlocked-tile.png';
  const DONE_SRC = '../06-svg-assets/ui/completed-tile.png';
  const STAR_ON = '../06-svg-assets/ui/star-on.png'; // earned (yellow)
  const STAR_OFF = '../06-svg-assets/ui/star-off.png'; // empty (grey)

  // ─── Geometry ──────────────────────────────────────────────────────────
  const W = 360;
  const H = 1280; // 665×2365 backdrop scaled to 360 wide (exact 360×1280)

  // One uniform node size across every node type.
  const NODE = 62;

  // Node positions snapped to the CURVE CORNERS of the painted winding
  // trail (alternating left/right bends), bottom→top. x/y measured from the
  // painted path centerline of world3-map-bg.png.
  const NODES = [{
    id: 21,
    x: 220,
    y: 1080,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'yellow'
  },
  // first R bend
  {
    id: 22,
    x: 108,
    y: 990,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'mint'
  },
  // L bend
  {
    id: 23,
    x: 243,
    y: 890,
    kind: 'reg',
    state: 'done',
    stars: 2,
    color: 'pink'
  },
  // R bend
  {
    id: 24,
    x: 116,
    y: 800,
    kind: 'reg',
    state: 'open'
  },
  // L bend
  {
    id: 25,
    x: 250,
    y: 695,
    kind: 'reg',
    state: 'locked'
  },
  // R bend
  {
    id: 26,
    x: 112,
    y: 600,
    kind: 'breather',
    state: 'locked'
  },
  // L bend
  {
    id: 27,
    x: 248,
    y: 505,
    kind: 'reg',
    state: 'locked'
  },
  // R bend
  {
    id: 28,
    x: 112,
    y: 435,
    kind: 'reg',
    state: 'locked'
  },
  // L bend
  {
    id: 29,
    x: 248,
    y: 375,
    kind: 'reg',
    state: 'locked'
  },
  // R bend
  {
    id: 30,
    x: 118,
    y: 298,
    kind: 'boss',
    state: 'locked'
  } // last bend, closer to gate
  ];

  // ─── Stars ────────────────────────────────────────────────────────────
  function Star({
    filled = false,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("img", {
      src: filled ? STAR_ON : STAR_OFF,
      alt: "",
      draggable: "false",
      style: {
        width: size,
        height: size,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: filled ? 'drop-shadow(0 1px 1.5px rgba(190,120,20,0.5))' : 'drop-shadow(0 1px 1.5px rgba(120,92,52,0.32))'
      }
    });
  }
  function StarArc({
    stars = 3,
    size = 15,
    width = 46,
    top
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: top != null ? top : Math.round(size * 0.18),
        transform: 'translateX(-50%)',
        width,
        height: size + 6,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(2px) rotate(-18deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-3px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 3
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(2px) rotate(18deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }

  // ─── Node primitives ─────────────────────────────────────────────────
  function CenterNum({
    n,
    size,
    color = '#6A4A2E',
    vy = 0.5,
    scale = 0.34,
    shadow = '0 1px 0 rgba(255,255,255,0.65)'
  }) {
    const digits = String(n).length;
    const dscale = digits >= 3 ? 0.66 : digits === 2 ? 0.82 : 1;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${vy * 100}%`,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * scale * dscale),
        lineHeight: 1,
        color,
        textShadow: shadow,
        pointerEvents: 'none'
      }
    }, n);
  }
  function Tile({
    src,
    size,
    shadow
  }) {
    return /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: "",
      draggable: "false",
      style: {
        position: 'relative',
        width: size,
        height: size,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: `drop-shadow(${shadow})`
      }
    });
  }
  function DoneNode({
    n,
    stars,
    size = 60
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement(Tile, {
      src: DONE_SRC,
      size: size,
      shadow: "0 5px 7px rgba(120,92,52,0.30)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#B67A16",
      vy: 0.56,
      scale: 0.36
    }), /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 15,
      width: 54
    }));
  }

  // Unlocked-but-not-yet-played: bright yellow tile, prominent centred number, pulse.
  function OpenNode({
    n,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -16,
        top: -16,
        right: -16,
        bottom: -16,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,159,104,0.55) 0%, rgba(255,159,104,0.22) 55%, rgba(255,159,104,0) 78%)',
        animation: 'gj-strip-pulse 1800ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement(Tile, {
      src: OPEN_SRC,
      size: size,
      shadow: "0 6px 9px rgba(120,92,52,0.30)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#B67A16",
      vy: 0.52,
      scale: 0.38
    }));
  }

  // Locked cream tile — the padlock is painted at the bottom, so the number
  // sits in the empty upper area.
  function LockedRegularNode({
    n,
    size = 58
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement(Tile, {
      src: LOCK_SRC,
      size: size,
      shadow: "0 5px 7px rgba(120,92,52,0.26)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#8A7A63",
      vy: 0.33,
      scale: 0.34
    }));
  }
  function BreatherNode({
    n,
    size = 52
  }) {
    return /*#__PURE__*/React.createElement(LockedRegularNode, {
      n: n,
      size: size
    });
  }

  // ─── BOSS GATE ───────────────────────────────────────────────────────
  // Ornate framed gate node marking the world's boss level (10/20/30…).
  // Three states: locked (gold + padlock) · current (amethyst, playable)
  // · cleared (gold + ruby, beaten). Sized by width; height follows the art.
  const BOSS_SRC = {
    locked: '../06-svg-assets/ui/boss-gate-locked.png',
    current: '../06-svg-assets/ui/boss-gate-current.png',
    cleared: '../06-svg-assets/ui/boss-gate-cleared.png'
  };
  // aspect (h/w) + panel-centre anchor (fraction of image) + number colour
  const BOSS_META = {
    locked: {
      ar: 1.1118,
      vx: 0.477,
      vy: 0.423,
      num: '#8A6A2E'
    },
    current: {
      ar: 1.0404,
      vx: 0.498,
      vy: 0.502,
      num: '#6A4A2E'
    },
    cleared: {
      ar: 1.0266,
      vx: 0.500,
      vy: 0.501,
      num: '#B67A16'
    }
  };
  function BossGateNode({
    n,
    variant = 'locked',
    stars = 3,
    width = 104
  }) {
    const m = BOSS_META[variant];
    const w = width,
      h = Math.round(width * m.ar);
    const shadow = variant === 'current' ? '0 7px 14px rgba(126,108,240,0.40)' : variant === 'cleared' ? '0 7px 13px rgba(200,150,40,0.36)' : '0 7px 12px rgba(120,92,52,0.30)';
    const numSize = Math.round(w * (String(n).length >= 2 ? 0.34 : 0.42));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: w,
        height: h
      }
    }, variant === 'current' && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -18,
        top: -14,
        right: -18,
        bottom: -14,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.60) 0%, rgba(126,108,240,0.28) 55%, rgba(126,108,240,0) 80%)',
        animation: 'gj-strip-pulse 1800ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: BOSS_SRC[variant],
      alt: "",
      draggable: "false",
      style: {
        position: 'relative',
        width: w,
        height: h,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: `drop-shadow(${shadow})`
      }
    }), variant === 'cleared' && /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 15,
      width: 54,
      top: Math.round(h * 0.16)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: numSize,
        lineHeight: 1,
        color: m.num,
        textShadow: '0 1px 0 rgba(255,255,255,0.7)',
        pointerEvents: 'none'
      }
    }, n));
  }
  function PlaceNode({
    node
  }) {
    const half = NODE / 2;
    if (node.kind === 'boss') {
      const variant = node.state === 'done' ? 'cleared' : node.state === 'open' ? 'current' : 'locked';
      const BW = 60;
      const m = BOSS_META[variant];
      const bh = Math.round(BW * m.ar);
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          zIndex: 3,
          left: Math.round(node.x - m.vx * BW),
          top: Math.round(node.y - m.vy * bh)
        }
      }, /*#__PURE__*/React.createElement(BossGateNode, {
        n: node.id,
        variant: variant,
        stars: node.stars || 3,
        width: BW
      }));
    }
    let inner = null;
    if (node.kind === 'breather') {
      inner = /*#__PURE__*/React.createElement(BreatherNode, {
        n: node.id,
        size: NODE
      });
    } else if (node.state === 'open') {
      inner = /*#__PURE__*/React.createElement(OpenNode, {
        n: node.id,
        size: NODE
      });
    } else if (node.state === 'done') {
      inner = /*#__PURE__*/React.createElement(DoneNode, {
        n: node.id,
        color: node.color,
        stars: node.stars,
        size: NODE
      });
    } else {
      inner = /*#__PURE__*/React.createElement(LockedRegularNode, {
        n: node.id,
        size: NODE
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: node.x - half,
        top: node.y - half
      }
    }, inner);
  }

  // ─── Gate chip (labels the painted locked gate → World 4 Sa mạc) ─────
  function GateChip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: 78,
        transform: 'translateX(-50%)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: '#FFFFFF',
        border: '1.5px solid #E6D8BD',
        borderRadius: 999,
        padding: '5px 12px 5px 6px',
        boxShadow: '0 8px 20px rgba(120,92,52,0.28), 0 3px 6px rgba(120,92,52,0.14)',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'radial-gradient(circle at 35% 25%, #FBE6B6 0%, #E8B85C 60%, #C8923E 100%)',
        border: '2px solid #C8923E',
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 17c3-3.5 5-3.5 8.5 0s5.5 0 8.5-3.5",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "2.4",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "17",
      cy: "7.5",
      r: "2.6",
      fill: "#FFFFFF"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.05,
        gap: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 8.5,
        letterSpacing: '0.12em',
        color: '#9B886F'
      }
    }, "C\u1ED4NG \xB7 TH\u1EBE GI\u1EDAI 4"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: '#B9802E',
        lineHeight: 1.05
      }
    }, "Sa m\u1EA1c")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
        border: '1.5px solid #E0A21F',
        padding: '4px 9px 5px 6px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 14,
        color: '#6A4A2E',
        lineHeight: 1
      }
    }, "54")));
  }

  // Small start marker at the very bottom.
  function StartSign() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: H - 44,
        transform: 'translateX(-50%)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        padding: '6px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(120,92,52,0.24)',
        textTransform: 'uppercase'
      }
    }, "S\xF4ng & Th\xE1c \xB7 Ti\u1EBFp t\u1EE5c"));
  }

  // ─── Top-level component ─────────────────────────────────────────────
  function World3Strip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-strip-pulse {
            0%,100% { transform: scale(1);    opacity: 0.75; }
            50%     { transform: scale(1.10); opacity: 0.35; }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; }
          }
        `), /*#__PURE__*/React.createElement("img", {
      src: BG_SRC,
      alt: "",
      draggable: "false",
      style: {
        position: 'absolute',
        inset: 0,
        width: W,
        height: H,
        objectFit: 'cover',
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none'
      }
    }), /*#__PURE__*/React.createElement(GateChip, null), NODES.map(n => /*#__PURE__*/React.createElement(PlaceNode, {
      key: n.id,
      node: n
    })));
  }
  window.GJWorld3Strip = World3Strip;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world3-strip.jsx", error: String((e && e.message) || e) }); }

// 04-screens/world4-strip.jsx
try { (() => {
/* world4-strip.jsx — Level-Map SCROLL STRIP for World 4 "Sa mạc".
   ----------------------------------------------------------------
   Same approach as Worlds 1–3: pure painted artboard 360 × 1080dp, NO HUD.
   The scenery + winding sand road + locked gate are a single painted PNG
   backdrop (06-svg-assets/backgrounds/world4-map-bg.png, 724×2172 → exact
   1:3, scaled to 360 wide = 360×1080, no distortion). We do NOT draw
   dunes/cacti/path in SVG — we just DROP the ten level nodes onto the
   painted trail. Reads bottom→top:

     • L31 → L35 : regular nodes (L31–L33 done w/ stars, L34 open, L35 locked)
     • L36       : BREATHER
     • L37 → L39 : regular nodes (stone-locked)
     • L40       : BOSS
     • top       : the painted locked GATE → World 5 "Bãi biển"
                   (a compact stars-required chip labels it)

   Reuses DS tokens & tile art. Exposes window.GJWorld4Strip.
   ---------------------------------------------------------------- */
(function () {
  const BG_SRC = '../06-svg-assets/backgrounds/world4-map-bg.png';
  const LOCK_SRC = '../06-svg-assets/ui/locked-tile.png';
  const OPEN_SRC = '../06-svg-assets/ui/unlocked-tile.png';
  const DONE_SRC = '../06-svg-assets/ui/completed-tile.png';
  const STAR_ON = '../06-svg-assets/ui/star-on.png'; // earned (yellow)
  const STAR_OFF = '../06-svg-assets/ui/star-off.png'; // empty (grey)

  // ─── Geometry ──────────────────────────────────────────────────────────
  const W = 360;
  const H = 1080; // 724×2172 backdrop scaled to 360 wide (exact 360×1080)

  // One uniform node size across every node type.
  const NODE = 62;

  // Node positions snapped to the CURVE CORNERS of the painted winding
  // sand trail (alternating left/right bends), bottom→top. x/y measured from
  // the painted path centerline of world4-map-bg.png.
  const NODES = [{
    id: 31,
    x: 184,
    y: 1005,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'yellow'
  }, {
    id: 32,
    x: 216,
    y: 915,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'pink'
  }, {
    id: 33,
    x: 191,
    y: 820,
    kind: 'reg',
    state: 'done',
    stars: 2,
    color: 'mint'
  }, {
    id: 34,
    x: 166,
    y: 725,
    kind: 'reg',
    state: 'open'
  }, {
    id: 35,
    x: 166,
    y: 640,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 36,
    x: 172,
    y: 555,
    kind: 'breather',
    state: 'locked'
  }, {
    id: 37,
    x: 209,
    y: 460,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 38,
    x: 174,
    y: 360,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 39,
    x: 158,
    y: 272,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 40,
    x: 175,
    y: 205,
    kind: 'boss',
    state: 'locked'
  }];

  // ─── Stars ────────────────────────────────────────────────────────────
  function Star({
    filled = false,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("img", {
      src: filled ? STAR_ON : STAR_OFF,
      alt: "",
      draggable: "false",
      style: {
        width: size,
        height: size,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: filled ? 'drop-shadow(0 1px 1.5px rgba(190,120,20,0.5))' : 'drop-shadow(0 1px 1.5px rgba(120,92,52,0.32))'
      }
    });
  }
  function StarArc({
    stars = 3,
    size = 15,
    width = 46,
    top
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: top != null ? top : Math.round(size * 0.18),
        transform: 'translateX(-50%)',
        width,
        height: size + 6,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(2px) rotate(-18deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-3px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 3
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(2px) rotate(18deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }

  // ─── Node primitives ─────────────────────────────────────────────────
  function CenterNum({
    n,
    size,
    color = '#6A4A2E',
    vy = 0.5,
    scale = 0.34,
    shadow = '0 1px 0 rgba(255,255,255,0.65)'
  }) {
    const digits = String(n).length;
    const dscale = digits >= 3 ? 0.66 : digits === 2 ? 0.82 : 1;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${vy * 100}%`,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * scale * dscale),
        lineHeight: 1,
        color,
        textShadow: shadow,
        pointerEvents: 'none'
      }
    }, n);
  }
  function Tile({
    src,
    size,
    shadow
  }) {
    return /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: "",
      draggable: "false",
      style: {
        position: 'relative',
        width: size,
        height: size,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: `drop-shadow(${shadow})`
      }
    });
  }
  function DoneNode({
    n,
    stars,
    size = 60
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement(Tile, {
      src: DONE_SRC,
      size: size,
      shadow: "0 5px 7px rgba(120,92,52,0.30)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#B67A16",
      vy: 0.56,
      scale: 0.36
    }), /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 15,
      width: 54
    }));
  }

  // Unlocked-but-not-yet-played: bright yellow tile, prominent centred number, pulse.
  function OpenNode({
    n,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -16,
        top: -16,
        right: -16,
        bottom: -16,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,159,104,0.55) 0%, rgba(255,159,104,0.22) 55%, rgba(255,159,104,0) 78%)',
        animation: 'gj-strip-pulse 1800ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement(Tile, {
      src: OPEN_SRC,
      size: size,
      shadow: "0 6px 9px rgba(120,92,52,0.30)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#B67A16",
      vy: 0.52,
      scale: 0.38
    }));
  }

  // Locked cream tile — the padlock is painted at the bottom, so the number
  // sits in the empty upper area.
  function LockedRegularNode({
    n,
    size = 58
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size
      }
    }, /*#__PURE__*/React.createElement(Tile, {
      src: LOCK_SRC,
      size: size,
      shadow: "0 5px 7px rgba(120,92,52,0.26)"
    }), /*#__PURE__*/React.createElement(CenterNum, {
      n: n,
      size: size,
      color: "#8A7A63",
      vy: 0.33,
      scale: 0.34
    }));
  }
  function BreatherNode({
    n,
    size = 52
  }) {
    return /*#__PURE__*/React.createElement(LockedRegularNode, {
      n: n,
      size: size
    });
  }

  // ─── BOSS GATE ───────────────────────────────────────────────────────
  // Ornate framed gate node marking the world's boss level (10/20/30…).
  // Three states: locked (gold + padlock) · current (amethyst, playable)
  // · cleared (gold + ruby, beaten). Sized by width; height follows the art.
  const BOSS_SRC = {
    locked: '../06-svg-assets/ui/boss-gate-locked.png',
    current: '../06-svg-assets/ui/boss-gate-current.png',
    cleared: '../06-svg-assets/ui/boss-gate-cleared.png'
  };
  // aspect (h/w) + panel-centre anchor (fraction of image) + number colour
  const BOSS_META = {
    locked: {
      ar: 1.1118,
      vx: 0.477,
      vy: 0.423,
      num: '#8A6A2E'
    },
    current: {
      ar: 1.0404,
      vx: 0.498,
      vy: 0.502,
      num: '#6A4A2E'
    },
    cleared: {
      ar: 1.0266,
      vx: 0.500,
      vy: 0.501,
      num: '#B67A16'
    }
  };
  function BossGateNode({
    n,
    variant = 'locked',
    stars = 3,
    width = 104
  }) {
    const m = BOSS_META[variant];
    const w = width,
      h = Math.round(width * m.ar);
    const shadow = variant === 'current' ? '0 7px 14px rgba(126,108,240,0.40)' : variant === 'cleared' ? '0 7px 13px rgba(200,150,40,0.36)' : '0 7px 12px rgba(120,92,52,0.30)';
    const numSize = Math.round(w * (String(n).length >= 2 ? 0.34 : 0.42));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: w,
        height: h
      }
    }, variant === 'current' && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -18,
        top: -14,
        right: -18,
        bottom: -14,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.60) 0%, rgba(126,108,240,0.28) 55%, rgba(126,108,240,0) 80%)',
        animation: 'gj-strip-pulse 1800ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: BOSS_SRC[variant],
      alt: "",
      draggable: "false",
      style: {
        position: 'relative',
        width: w,
        height: h,
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: `drop-shadow(${shadow})`
      }
    }), variant === 'cleared' && /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 15,
      width: 54,
      top: Math.round(h * 0.16)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: numSize,
        lineHeight: 1,
        color: m.num,
        textShadow: '0 1px 0 rgba(255,255,255,0.7)',
        pointerEvents: 'none'
      }
    }, n));
  }
  function PlaceNode({
    node
  }) {
    const half = NODE / 2;
    if (node.kind === 'boss') {
      const variant = node.state === 'done' ? 'cleared' : node.state === 'open' ? 'current' : 'locked';
      const BW = 60;
      const m = BOSS_META[variant];
      const bh = Math.round(BW * m.ar);
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          zIndex: 3,
          left: Math.round(node.x - m.vx * BW),
          top: Math.round(node.y - m.vy * bh)
        }
      }, /*#__PURE__*/React.createElement(BossGateNode, {
        n: node.id,
        variant: variant,
        stars: node.stars || 3,
        width: BW
      }));
    }
    let inner = null;
    if (node.kind === 'breather') {
      inner = /*#__PURE__*/React.createElement(BreatherNode, {
        n: node.id,
        size: NODE
      });
    } else if (node.state === 'open') {
      inner = /*#__PURE__*/React.createElement(OpenNode, {
        n: node.id,
        size: NODE
      });
    } else if (node.state === 'done') {
      inner = /*#__PURE__*/React.createElement(DoneNode, {
        n: node.id,
        color: node.color,
        stars: node.stars,
        size: NODE
      });
    } else {
      inner = /*#__PURE__*/React.createElement(LockedRegularNode, {
        n: node.id,
        size: NODE
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: node.x - half,
        top: node.y - half
      }
    }, inner);
  }

  // ─── Gate chip (labels the painted locked gate → World 5 Bãi biển) ────
  function GateChip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: 96,
        transform: 'translateX(-50%)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: '#FFFFFF',
        border: '1.5px solid #CFE6EC',
        borderRadius: 999,
        padding: '5px 12px 5px 6px',
        boxShadow: '0 8px 20px rgba(60,130,150,0.28), 0 3px 6px rgba(120,92,52,0.14)',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'radial-gradient(circle at 35% 25%, #CFF0F6 0%, #6FC2D8 60%, #4296B0 100%)',
        border: '2px solid #4296B0',
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M2 16c2-3 4-3 6 0s4 0 6-3 4-2 6 1",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "2.4",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "17",
      cy: "7.5",
      r: "2.6",
      fill: "#FFFFFF"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.05,
        gap: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 8.5,
        letterSpacing: '0.12em',
        color: '#9B886F'
      }
    }, "C\u1ED4NG \xB7 TH\u1EBE GI\u1EDAI 5"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: '#2E84A6',
        lineHeight: 1.05
      }
    }, "B\xE3i bi\u1EC3n")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
        border: '1.5px solid #E0A21F',
        padding: '4px 9px 5px 6px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 14,
        color: '#6A4A2E',
        lineHeight: 1
      }
    }, "72")));
  }

  // Small start marker at the very bottom.
  function StartSign() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: H - 44,
        transform: 'translateX(-50%)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        padding: '6px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(120,92,52,0.24)',
        textTransform: 'uppercase'
      }
    }, "Sa m\u1EA1c \xB7 Ti\u1EBFp t\u1EE5c"));
  }

  // ─── Top-level component ─────────────────────────────────────────────
  function World4Strip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-strip-pulse {
            0%,100% { transform: scale(1);    opacity: 0.75; }
            50%     { transform: scale(1.10); opacity: 0.35; }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; }
          }
        `), /*#__PURE__*/React.createElement("img", {
      src: BG_SRC,
      alt: "",
      draggable: "false",
      style: {
        position: 'absolute',
        inset: 0,
        width: W,
        height: H,
        objectFit: 'cover',
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none'
      }
    }), /*#__PURE__*/React.createElement(GateChip, null), NODES.map(n => /*#__PURE__*/React.createElement(PlaceNode, {
      key: n.id,
      node: n
    })), /*#__PURE__*/React.createElement(StartSign, null));
  }
  window.GJWorld4Strip = World4Strip;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world4-strip.jsx", error: String((e && e.message) || e) }); }

// 04-screens/world5-strip.jsx
try { (() => {
/* world5-strip.jsx — Dải cuộn ĐẦY ĐỦ World 5 "Bãi biển" (màn 41–50).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn, số node 41→50:
     • 41–45 node thường · 46 BREATHER · 47–49 thường · 50 BOSS
     • trên 50: CỔNG sang World 6 "Núi tuyết" (chip ★ 80); nền trên cổng
       blend sang palette Núi tuyết (#DCEBF5→#AcCfE6 trời tuyết lạnh)
   Biome World 5 (nhìn từ trên xuống): bãi cát vàng ấm #FBEEC9→#EBD29C chạy
   dọc GIỮA (hành lang x 72–290) cho đường + node; HAI MÉP là BIỂN xanh
   #6FC4DA→#4FA9CF với bọt sóng trắng lăn vào bờ, lấp lánh, phao/thuyền/cá
   nhỏ trôi. Trên cát: cọ, dù sọc, lâu đài cát, bóng biển, sao biển, vỏ sò,
   cua, xô-xẻng, mặt trời nóng. KHÔNG cây leo / vách đá.
   Exposes window.GJWorld5Strip.                                          */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const {
    JellyBlock
  } = NS;
  const NODES = [{
    id: 41,
    x: 130,
    y: 2440,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'mint'
  }, {
    id: 42,
    x: 240,
    y: 2250,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'yellow'
  }, {
    id: 43,
    x: 110,
    y: 2060,
    kind: 'reg',
    state: 'done',
    stars: 2,
    color: 'pink'
  }, {
    id: 44,
    x: 240,
    y: 1870,
    kind: 'reg',
    state: 'current'
  }, {
    id: 45,
    x: 120,
    y: 1680,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 46,
    x: 240,
    y: 1490,
    kind: 'breather',
    state: 'locked'
  }, {
    id: 47,
    x: 110,
    y: 1290,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 48,
    x: 240,
    y: 1090,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 49,
    x: 150,
    y: 880,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 50,
    x: 180,
    y: 620,
    kind: 'boss',
    state: 'locked'
  }];
  const ENTRY = {
    x: 180,
    y: 2620
  };
  const GATE = {
    x: 180,
    y: 360
  };
  const EXIT = {
    x: 180,
    y: -40
  };
  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }
  const ALL_PTS = [ENTRY, ...NODES.map(n => ({
    x: n.x,
    y: n.y
  })), GATE, EXIT];
  const FULL_PATH = pathD(ALL_PTS);
  const WALKED = pathD([ENTRY, NODES[0], NODES[1], NODES[2]]);

  // ─── scene ────────────────────────────────────────────────────────
  function Scene() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "w5s-sand",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FBEEC9"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#F4E2B4"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#EBD29C"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w5s-sea-l",
      x1: "0",
      y1: "0",
      x2: "1",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#4FA9CF"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#6FC4DA"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#9ED9E6"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w5s-sea-r",
      x1: "1",
      y1: "0",
      x2: "0",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#4FA9CF"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#6FC4DA"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#9ED9E6"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w5s-snow",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#EDF5FC"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.55",
      stopColor: "#DBEAF4"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#E9EDE8"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w5s-sun",
      cx: "0.5",
      cy: "0.5",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFF6D6",
      stopOpacity: "0.95"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.55",
      stopColor: "#FFE38A",
      stopOpacity: "0.45"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#FFE38A",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w5s-foam",
      cx: "0.5",
      cy: "0.5",
      r: "0.6"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFFFFF",
      stopOpacity: "0.7"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#FFFFFF",
      stopOpacity: "0"
    }))), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: H,
      fill: "url(#w5s-sand)"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: "200",
      fill: "url(#w5s-snow)"
    }), /*#__PURE__*/React.createElement(IcePatch, {
      cx: 88,
      cy: 66,
      rx: 64,
      ry: 28
    }), /*#__PURE__*/React.createElement(IcePatch, {
      cx: 276,
      cy: 124,
      rx: 72,
      ry: 30
    }), /*#__PURE__*/React.createElement(SnowDrift, {
      cx: 300,
      cy: 46,
      rx: 72,
      ry: 24
    }), /*#__PURE__*/React.createElement(SnowDrift, {
      cx: 56,
      cy: 150,
      rx: 80,
      ry: 26
    }), /*#__PURE__*/React.createElement(SnowDrift, {
      cx: 180,
      cy: 26,
      rx: 94,
      ry: 22
    }), /*#__PURE__*/React.createElement(SummitTop, {
      cx: 150,
      cy: 108,
      r: 36
    }), /*#__PURE__*/React.createElement(SummitTop, {
      cx: 322,
      cy: 176,
      r: 26
    }), [[34, 58], [112, 150], [210, 78], [298, 28], [336, 128], [70, 38], [248, 162], [160, 172]].map(([x, y], i) => /*#__PURE__*/React.createElement(PineTop, {
      key: i,
      x: x,
      y: y,
      r: 10 + i % 2 * 3
    })), [[60, 100], [200, 142], [268, 60], [120, 32], [330, 90], [148, 52]].map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
      key: `sf${i}`,
      style: {
        animation: 'gj-w5s-float 3.6s ease-in-out infinite',
        animationDelay: `${i * 0.35}s`,
        transformOrigin: `${x}px ${y}px`
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "2",
      fill: "#FFFFFF",
      opacity: "0.92"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M0 188 q 90 22 180 6 t 180 14 L360 250 L0 250 Z",
      fill: "#F3E2BC"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M0 196 q 90 20 180 6 t 180 14",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "3",
      opacity: "0.6",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement(SeaEdge, {
      side: "l"
    }), /*#__PURE__*/React.createElement(SeaEdge, {
      side: "r"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "296",
      cy: "430",
      r: "120",
      fill: "url(#w5s-sun)"
    }), /*#__PURE__*/React.createElement(BeachSun, {
      x: 296,
      y: 430,
      r: 40
    }), [[286, 2380, 64], [86, 2000, 56], [288, 1600, 60], [88, 1180, 52], [286, 760, 58]].map(([x, y, h], i) => /*#__PURE__*/React.createElement(Palm, {
      key: `pl${i}`,
      x: x,
      y: y,
      h: h
    })), [[88, 2300, 1], [286, 1960, 0], [90, 1520, 1]].map(([x, y, t], i) => /*#__PURE__*/React.createElement(Umbrella, {
      key: `um${i}`,
      x: x,
      y: y,
      tilt: t
    })), [[284, 2180], [110, 1360]].map(([x, y], i) => /*#__PURE__*/React.createElement(Sandcastle, {
      key: `sc${i}`,
      x: x,
      y: y
    })), [[96, 2120, 16], [288, 1760, 14], [94, 980, 15]].map(([x, y, r], i) => /*#__PURE__*/React.createElement(BeachBall, {
      key: `bb${i}`,
      x: x,
      y: y,
      r: r
    })), [[120, 2280], [262, 2040], [98, 1700], [276, 1320], [130, 940], [250, 700]].map(([x, y], i) => /*#__PURE__*/React.createElement(Starfish, {
      key: `st${i}`,
      x: x,
      y: y,
      r: 11 + i % 2 * 2
    })), [[150, 2150], [238, 1860], [104, 1240], [266, 880]].map(([x, y], i) => /*#__PURE__*/React.createElement(Shell, {
      key: `sh${i}`,
      x: x,
      y: y
    })), [[270, 2300], [108, 1820], [262, 1180]].map(([x, y], i) => /*#__PURE__*/React.createElement(Crab, {
      key: `cr${i}`,
      x: x,
      y: y
    })), [[150, 1620], [228, 1040]].map(([x, y], i) => /*#__PURE__*/React.createElement(Bucket, {
      key: `bk${i}`,
      x: x,
      y: y
    })), [[150, 2200], [120, 1500], [240, 1100], [160, 720], [200, 1900], [130, 1000]].map(([x, y], i) => /*#__PURE__*/React.createElement("circle", {
      key: `sp${i}`,
      cx: x,
      cy: y,
      r: "1.6",
      fill: "#FFF7DC",
      opacity: "0.85"
    })), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 1170,
      size: 20,
      color: "blue",
      delay: "0s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 56,
      y: 2000,
      size: 22,
      color: "pink",
      delay: "0.8s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 2280,
      size: 18,
      color: "mint",
      delay: "1.4s"
    }));
  }

  // ── top-down snow terrain (World 6 preview) ──
  function IcePatch({
    cx,
    cy,
    rx,
    ry
  }) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry,
      fill: "#C7E2F2",
      stroke: "#FFFFFF",
      strokeWidth: "2.5",
      opacity: "0.92"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: cx - rx * 0.26,
      cy: cy - ry * 0.3,
      rx: rx * 0.4,
      ry: ry * 0.34,
      fill: "#FFFFFF",
      opacity: "0.35"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${cx - rx * 0.5} ${cy + ry * 0.1} L ${cx} ${cy - ry * 0.3} L ${cx + rx * 0.42} ${cy + ry * 0.2}`,
      fill: "none",
      stroke: "#A9CFE6",
      strokeWidth: "1",
      opacity: "0.6"
    }));
  }
  function SnowDrift({
    cx,
    cy,
    rx,
    ry
  }) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy + ry * 0.28,
      rx: rx,
      ry: ry,
      fill: "#C9DCEC",
      opacity: "0.65"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry,
      fill: "#F5FAFF"
    }));
  }
  function SummitTop({
    cx,
    cy,
    r
  }) {
    // đỉnh núi đá nhìn TỪ TRÊN — vạt đá lởm chởm + tuyết phủ giữa, gờ tỏa ra
    const n = 7;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.68 : r;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86]);
    }
    const d = 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z';
    const ip = pts.map(([x, y]) => [cx + (x - cx) * 0.5, cy + (y - cy) * 0.5]);
    const id = 'M ' + ip.map(p => p.join(' ')).join(' L ') + ' Z';
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 3px rgba(90,120,150,0.22))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "#A6B8CC",
      stroke: "#8197AE",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }), pts.map(([x, y], i) => /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: cx,
      y1: cy,
      x2: x,
      y2: y,
      stroke: "#8197AE",
      strokeWidth: "1",
      opacity: "0.5"
    })), /*#__PURE__*/React.createElement("path", {
      d: id,
      fill: "#FFFFFF",
      stroke: "#E3EDF5",
      strokeWidth: "1",
      strokeLinejoin: "round"
    }));
  }
  function PineTop({
    x,
    y,
    r = 10
  }) {
    // thông nhìn TỪ TRÊN — ngôi sao xanh nhiều cánh + tâm tuyết
    const n = 8;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.45 : r;
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    const d = 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z';
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 1px 2px rgba(90,120,150,0.20))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "#5F8A6E",
      stroke: "#4A7458",
      strokeWidth: "1",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r * 0.36,
      fill: "#FFFFFF",
      opacity: "0.92"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r * 0.13,
      fill: "#9A7A52"
    }));
  }
  function BeachSun({
    x,
    y,
    r = 40
  }) {
    return /*#__PURE__*/React.createElement("g", null, [...Array(10)].map((_, i) => {
      const a = i / 10 * Math.PI * 2;
      return /*#__PURE__*/React.createElement("line", {
        key: i,
        x1: x + Math.cos(a) * (r + 6),
        y1: y + Math.sin(a) * (r + 6),
        x2: x + Math.cos(a) * (r + 18),
        y2: y + Math.sin(a) * (r + 18),
        stroke: "#FFD86A",
        strokeWidth: "4",
        strokeLinecap: "round",
        opacity: "0.85"
      });
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r,
      fill: "#FFE9A6",
      stroke: "#FFD16A",
      strokeWidth: "2.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - r * 0.28,
      cy: y - r * 0.28,
      r: r * 0.3,
      fill: "#FFF4CE",
      opacity: "0.85"
    }));
  }
  function Palm({
    x,
    y,
    h = 56
  }) {
    // thân ĐỨNG THẲNG, hơi thuôn; tán cọ xòe ĐỀU CẢ HAI BÊN
    const fronds = [-74, -40, -10, 22];
    const leaf = 'M0 0 Q 24 -8 46 4 Q 26 1 0 7 Z';
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 3px 3px rgba(120,100,40,0.22))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 3.5} ${y} L ${x - 2} ${y - h} L ${x + 2} ${y - h} L ${x + 3.5} ${y} Z`,
      fill: "#B98A56",
      stroke: "#A2773F",
      strokeWidth: "1",
      strokeLinejoin: "round"
    }), [0.28, 0.52, 0.76].map((f, i) => /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: x - 2.8,
      y1: y - h * f,
      x2: x + 2.8,
      y2: y - h * f - 1,
      stroke: "#A2773F",
      strokeWidth: "0.9",
      opacity: "0.5"
    })), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${x} ${y - h})`
    }, fronds.map((deg, i) => /*#__PURE__*/React.createElement("path", {
      key: `r${i}`,
      d: leaf,
      fill: i % 2 ? '#57A86A' : '#67B87A',
      stroke: "#3F8A52",
      strokeWidth: "1",
      transform: `rotate(${deg})`
    })), fronds.map((deg, i) => /*#__PURE__*/React.createElement("path", {
      key: `l${i}`,
      d: leaf,
      fill: i % 2 ? '#57A86A' : '#67B87A',
      stroke: "#3F8A52",
      strokeWidth: "1",
      transform: `scale(-1,1) rotate(${deg})`
    })), /*#__PURE__*/React.createElement("circle", {
      cx: "0",
      cy: "2",
      r: "3.6",
      fill: "#C98A4E"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "-3.5",
      cy: "5",
      r: "2.6",
      fill: "#B97A3E"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "3.5",
      cy: "5",
      r: "2.6",
      fill: "#B97A3E"
    })));
  }
  function Umbrella({
    x,
    y,
    tilt = 0
  }) {
    const r = 30;
    const wedges = ['#F7A9C0', '#FFFFFF', '#8FB6F2', '#FFFFFF', '#FFE3A3', '#FFFFFF'];
    return /*#__PURE__*/React.createElement("g", {
      transform: `rotate(${tilt * 8} ${x} ${y})`,
      style: {
        filter: 'drop-shadow(0 3px 4px rgba(120,100,40,0.22))'
      }
    }, /*#__PURE__*/React.createElement("line", {
      x1: x,
      y1: y - 4,
      x2: x + 10,
      y2: y + 40,
      stroke: "#C9B07E",
      strokeWidth: "3.5",
      strokeLinecap: "round"
    }), wedges.map((c, i) => {
      const a0 = Math.PI + i / wedges.length * Math.PI;
      const a1 = Math.PI + (i + 1) / wedges.length * Math.PI;
      const x0 = x + Math.cos(a0) * r,
        y0 = y + Math.sin(a0) * r;
      const x1 = x + Math.cos(a1) * r,
        y1 = y + Math.sin(a1) * r;
      return /*#__PURE__*/React.createElement("path", {
        key: i,
        d: `M ${x} ${y} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`,
        fill: c,
        stroke: "#E576A0",
        strokeWidth: "0.8"
      });
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`,
      fill: "none",
      stroke: "#E89BB4",
      strokeWidth: "1.5",
      opacity: "0.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y - r,
      r: "2.6",
      fill: "#E576A0"
    }));
  }
  function Sandcastle({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 3px 3px rgba(150,120,60,0.22))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - 22,
      y: y - 14,
      width: "44",
      height: "16",
      rx: "3",
      fill: "#E7CE97",
      stroke: "#CDB178",
      strokeWidth: "1.5"
    }), [-20, -6, 8].map((o, i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: x + o,
      y: y - 30,
      width: "14",
      height: "20",
      rx: "3",
      fill: "#EFD9A6",
      stroke: "#CDB178",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x + o - 2} ${y - 30} L ${x + o + 7} ${y - 40} L ${x + o + 16} ${y - 30} Z`,
      fill: "#E7CE97",
      stroke: "#CDB178",
      strokeWidth: "1.3",
      strokeLinejoin: "round"
    }))), /*#__PURE__*/React.createElement("line", {
      x1: x + 15,
      y1: y - 40,
      x2: x + 15,
      y2: y - 52,
      stroke: "#9A7A52",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x + 15} ${y - 52} L ${x + 25} ${y - 49} L ${x + 15} ${y - 46} Z`,
      fill: "#F08A7E"
    }), [-18, -12, -6, 0, 6, 12, 18].map((o, i) => /*#__PURE__*/React.createElement("rect", {
      key: `cr${i}`,
      x: x + o - 1.5,
      y: y - 17,
      width: "3",
      height: "3",
      fill: "#EFD9A6"
    })));
  }
  function BeachBall({
    x,
    y,
    r = 16
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 3px 3px rgba(120,100,40,0.24))'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r,
      fill: "#FFFFFF",
      stroke: "#E8D7B6",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - r} A ${r} ${r} 0 0 1 ${x + r * 0.86} ${y + r * 0.5} L ${x} ${y} Z`,
      fill: "#F7A9C0"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - r} A ${r} ${r} 0 0 0 ${x - r * 0.86} ${y + r * 0.5} L ${x} ${y} Z`,
      fill: "#8FB6F2"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - r * 0.86} ${y + r * 0.5} A ${r} ${r} 0 0 0 ${x + r * 0.86} ${y + r * 0.5} L ${x} ${y} Z`,
      fill: "#FFE3A3"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - r * 0.3,
      cy: y - r * 0.32,
      r: r * 0.22,
      fill: "#FFFFFF",
      opacity: "0.7"
    }));
  }
  function Starfish({
    x,
    y,
    r = 12
  }) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = (-90 + i * 72) * Math.PI / 180;
      pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
      const a2 = (-90 + i * 72 + 36) * Math.PI / 180;
      pts.push([x + Math.cos(a2) * r * 0.46, y + Math.sin(a2) * r * 0.46]);
    }
    const d = 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z';
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.22))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "#FFB07F",
      stroke: "#E97E45",
      strokeWidth: "1.4",
      strokeLinejoin: "round"
    }), [0, 1, 2, 3, 4].map(i => {
      const a = (-90 + i * 72) * Math.PI / 180;
      return /*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: x + Math.cos(a) * r * 0.4,
        cy: y + Math.sin(a) * r * 0.4,
        r: "1.1",
        fill: "#FFE3A3"
      });
    }));
  }
  function Shell({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 1px 1px rgba(120,100,40,0.2))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y} a 8 8 0 1 1 0.1 0 Z`,
      fill: "#FBD8E2",
      stroke: "#E89BB4",
      strokeWidth: "1.3"
    }), [-4, 0, 4].map((o, i) => /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: x,
      y1: y,
      x2: x + o,
      y2: y - 8,
      stroke: "#E89BB4",
      strokeWidth: "1.1"
    })));
  }
  function Crab({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.22))'
      }
    }, [-1, 1].map(s => [0, 1, 2].map(i => /*#__PURE__*/React.createElement("line", {
      key: `${s}${i}`,
      x1: x + s * 8,
      y1: y + 2 + i * 2,
      x2: x + s * 18,
      y2: y - 2 + i * 5,
      stroke: "#E97E45",
      strokeWidth: "1.8",
      strokeLinecap: "round"
    }))), /*#__PURE__*/React.createElement("circle", {
      cx: x - 16,
      cy: y - 6,
      r: "4",
      fill: "#F08A7E",
      stroke: "#D9685C",
      strokeWidth: "1.2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 16,
      cy: y - 6,
      r: "4",
      fill: "#F08A7E",
      stroke: "#D9685C",
      strokeWidth: "1.2"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: "11",
      ry: "8",
      fill: "#F08A7E",
      stroke: "#D9685C",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - 4,
      cy: y - 3,
      r: "1.6",
      fill: "#3B2A18"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 4,
      cy: y - 3,
      r: "1.6",
      fill: "#3B2A18"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 3} ${y + 2} q 3 2 6 0`,
      fill: "none",
      stroke: "#9A3A30",
      strokeWidth: "1.2",
      strokeLinecap: "round"
    }));
  }
  function Bucket({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.22))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 11} ${y - 16} L ${x + 11} ${y - 16} L ${x + 8} ${y} L ${x - 8} ${y} Z`,
      fill: "#8FB6F2",
      stroke: "#6F97DE",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 11} ${y - 16} Q ${x} ${y - 28} ${x + 11} ${y - 16}`,
      fill: "none",
      stroke: "#6F97DE",
      strokeWidth: "1.8"
    }), /*#__PURE__*/React.createElement("rect", {
      x: x - 11,
      y: y - 18,
      width: "22",
      height: "3",
      rx: "1.5",
      fill: "#A9C8F6"
    }), /*#__PURE__*/React.createElement("line", {
      x1: x + 14,
      y1: y - 22,
      x2: x + 20,
      y2: y,
      stroke: "#C9B07E",
      strokeWidth: "2.4",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x + 12,
      cy: y - 24,
      rx: "5",
      ry: "4",
      fill: "#FFCA66",
      stroke: "#E0A21F",
      strokeWidth: "1.3",
      transform: `rotate(-24 ${x + 12} ${y - 24})`
    }));
  }
  function SeaEdge({
    side
  }) {
    // BIỂN một mép — mặt nước xanh, mép trong (bờ) uốn lượn có bọt trắng,
    // sóng ngang lăn, lấp lánh, vài phao/cá nhỏ trôi.
    const isL = side === 'l';
    const fill = isL ? 'url(#w5s-sea-l)' : 'url(#w5s-sea-r)';
    const X = v => isL ? v : W - v;
    const outerX = isL ? -24 : W + 24;
    // inner shoreline points (wavy)
    const inset = i => [70, 56, 64, 58][i % 4];
    const pts = [];
    for (let y = 250, i = 0; y <= H + 40; y += 150, i++) {
      pts.push([X(inset(i)), y, i]);
    }
    let d = `M ${outerX} 250 L ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      const my = (py + y) / 2;
      d += `Q ${px} ${my} ${x} ${y} `;
    }
    d += `L ${outerX} ${H + 40} Z`;
    // foam edge stroke path (just the shoreline)
    let foam = `M ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      foam += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    // horizontal wave ripples on the water
    const waves = [];
    for (let y = 320, i = 0; y < H; y += 90, i++) {
      const ix = inset(Math.round((y - 250) / 150));
      const x0 = isL ? -10 : W + 10;
      const x1 = X(ix + 12);
      waves.push(/*#__PURE__*/React.createElement("path", {
        key: `wv${i}`,
        d: `M ${x0} ${y} q ${(x1 - x0) / 4} -6 ${(x1 - x0) / 2} 0 t ${(x1 - x0) / 2} 0`,
        fill: "none",
        stroke: "#FFFFFF",
        strokeWidth: "1.6",
        opacity: "0.4",
        strokeLinecap: "round"
      }));
    }
    // sparkles
    const sparks = [];
    for (let y = 360, i = 0; y < H; y += 210, i++) {
      sparks.push(/*#__PURE__*/React.createElement("circle", {
        key: `sk${i}`,
        cx: X(28 + i % 2 * 10),
        cy: y,
        r: "1.5",
        fill: "#FFFFFF",
        opacity: "0.85"
      }));
    }
    // floating props (buoy / little fish)
    const props = [];
    [620, 1240, 1880, 2380].forEach((y, i) => {
      if (i % 2 === 0) props.push(/*#__PURE__*/React.createElement(Buoy, {
        key: `bu${i}`,
        x: X(34),
        y: y
      }));else props.push(/*#__PURE__*/React.createElement(MiniFish, {
        key: `fi${i}`,
        x: X(36),
        y: y,
        flip: !isL
      }));
    });
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: fill
    }), waves, sparks, props, /*#__PURE__*/React.createElement("path", {
      d: foam,
      fill: "none",
      stroke: "#EAD7A8",
      strokeWidth: "9",
      opacity: "0.55",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: foam,
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "4",
      opacity: "0.85",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: foam,
      fill: "none",
      stroke: "#CFEEF5",
      strokeWidth: "2",
      opacity: "0.7",
      strokeLinecap: "round",
      transform: "translate(0,4)"
    }));
  }
  function Buoy({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 2px rgba(40,90,110,0.25))'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "9",
      fill: "#FFFFFF",
      stroke: "#F08A7E",
      strokeWidth: "3"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "3.4",
      fill: "#6FC4DA"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y + 11,
      rx: "13",
      ry: "3",
      fill: "#FFFFFF",
      opacity: "0.45"
    }));
  }
  function MiniFish({
    x,
    y,
    flip
  }) {
    return /*#__PURE__*/React.createElement("g", {
      transform: flip ? `scale(-1,1) translate(${-2 * x},0)` : undefined,
      style: {
        filter: 'drop-shadow(0 1px 1px rgba(40,90,110,0.22))'
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: "9",
      ry: "5.5",
      fill: "#FFE3A3",
      stroke: "#E8B85C",
      strokeWidth: "1.3"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x + 8} ${y} l 7 -5 l 0 10 Z`,
      fill: "#FFD074",
      stroke: "#E8B85C",
      strokeWidth: "1.2",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - 4,
      cy: y - 1.5,
      r: "1.4",
      fill: "#3B2A18"
    }));
  }
  function FloatJelly({
    x,
    y,
    size,
    color,
    delay
  }) {
    const p = {
      yellow: {
        f: '#FFE3A3',
        e: '#E8B85C',
        s: '#FFF1CE'
      },
      mint: {
        f: '#A3E5D9',
        e: '#5FC3B2',
        s: '#CBF2EB'
      },
      pink: {
        f: '#F7A9C0',
        e: '#E576A0',
        s: '#FBD0DF'
      },
      blue: {
        f: '#B3C7F7',
        e: '#7E9CE8',
        s: '#D6E1FB'
      }
    }[color] || {
      f: '#FFE3A3',
      e: '#E8B85C',
      s: '#FFF1CE'
    };
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w5s-float 3.6s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`,
        filter: 'drop-shadow(0 4px 3px rgba(120,100,40,0.22))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
      rx: Math.round(size * 0.28),
      fill: p.f,
      stroke: p.e,
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y - size * 0.18,
      rx: size * 0.34,
      ry: size * 0.12,
      fill: p.s,
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }));
  }

  // ─── path ─────────────────────────────────────────────────────────
  function PathLayer() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "rgba(120,90,40,0.20)",
      strokeWidth: "34",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      transform: "translate(0,4)"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#E7D09A",
      strokeWidth: "30",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#FCF1D2",
      strokeWidth: "26",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#E6CFA0",
      strokeWidth: "3.5",
      strokeLinecap: "round",
      strokeDasharray: "7 11"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FF9F68",
      strokeWidth: "20",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "6",
      strokeLinecap: "round",
      strokeDasharray: "4 9",
      opacity: "0.9"
    }));
  }

  // ─── stars / node primitives (shared) ────────────────────────────
  function Star({
    filled = false,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z",
      fill: filled ? '#FFC23D' : '#D9CDB5',
      stroke: filled ? '#E0A21F' : '#B6A892',
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }));
  }
  function StarArc({
    stars = 3,
    size = 14,
    width = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -size - 6,
        transform: 'translateX(-50%)',
        width,
        height: size + 8,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(-22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-2px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }
  function NumberBadge({
    n,
    size,
    color = '#6A4A2E'
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        lineHeight: 1,
        color,
        textShadow: '0 1px 0 rgba(255,255,255,0.55)',
        pointerEvents: 'none'
      }
    }, n);
  }
  function LockGlyph({
    size = 18
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M8 11V8.5a4 4 0 1 1 8 0V11",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "2.6",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "11",
      width: "14",
      height: "9",
      rx: "2.5",
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "15",
      r: "1.4",
      fill: "#A89A82"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "11.3",
      y: "15",
      width: "1.4",
      height: "3",
      rx: "0.6",
      fill: "#A89A82"
    }));
  }
  function DoneNode({
    n,
    color,
    stars,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 5px 7px rgba(120,100,40,0.24))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: color,
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement(NumberBadge, {
      n: n,
      size: size
    }), /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 14,
      width: size + 14
    }));
  }
  function LockedRegularNode({
    n,
    size = 60
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 5px rgba(120,100,40,0.20))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n), /*#__PURE__*/React.createElement(StarArc, {
      stars: 0,
      size: 12,
      width: size + 8
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -4,
        bottom: -4,
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: '#8A7B62',
        border: '2px solid #FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(120,100,40,0.32)'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: 13
    })));
  }
  function CurrentNode({
    n,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -16,
        top: -16,
        width: size + 32,
        height: size + 32,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.24)',
        animation: 'gj-w5s-pulse 1600ms ease-out infinite'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -5,
        top: -5,
        width: size + 10,
        height: size + 10,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.34)',
        animation: 'gj-w5s-pulse 1600ms ease-out infinite',
        animationDelay: '320ms'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#FFFFFF',
        border: '3px solid #FF9F68',
        boxShadow: '0 6px 14px rgba(120,100,40,0.24), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: size - 16,
      height: size - 16,
      viewBox: "0 0 40 40",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "20",
      cy: "20",
      r: "18",
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "2",
      strokeDasharray: "3 4"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#E97E45'
      }
    }, n)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -40,
        transform: 'translateX(-50%)',
        animation: 'gj-w5s-hop 1400ms ease-in-out infinite',
        filter: 'drop-shadow(0 4px 4px rgba(120,100,40,0.30))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "mint",
      size: 38,
      direction: "down",
      expression: "happy"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: size + 10,
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)',
        color: '#FFFFFF',
        border: '2px solid #E97E45',
        borderBottom: '3px solid #C8662F',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '5px 14px 6px',
        borderRadius: 999,
        boxShadow: '0 6px 12px rgba(201,102,47,0.35), inset 0 2px 0 rgba(255,197,154,0.6)',
        whiteSpace: 'nowrap'
      }
    }, "Ch\u01A1i ngay"));
  }
  function BreatherNode({
    n,
    size = 48
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -10,
        left: size + 8,
        background: '#FFFFFF',
        color: '#8C7458',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.10em',
        padding: '4px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 8px rgba(120,100,40,0.20)',
        whiteSpace: 'nowrap'
      }
    }, "NGH\u1EC8"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -6,
        left: size + 4,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#FFD074',
        border: '1.5px solid #E0A21F'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 5px rgba(120,100,40,0.22))',
        opacity: 0.92
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.30} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.55} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: size * 0.15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.28),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n)));
  }
  function BossNode({
    n,
    size = 80
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 8px 14px rgba(126,108,240,0.40))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -28,
        top: -28,
        right: -28,
        bottom: -28,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.55) 0%, rgba(126,108,240,0.30) 55%, rgba(126,108,240,0) 78%)',
        animation: 'gj-w5s-halo 2400ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement("svg", {
      width: size + 56,
      height: size + 56,
      viewBox: "0 0 200 200",
      style: {
        position: 'absolute',
        left: -28,
        top: -28,
        pointerEvents: 'none',
        animation: 'gj-w5s-spin 8s linear infinite',
        transformOrigin: '50% 50%'
      }
    }, [0, 60, 120, 180, 240, 300].map(a => {
      const rad = a * Math.PI / 180;
      const cx = 100 + Math.cos(rad) * 84;
      const cy = 100 + Math.sin(rad) * 84;
      return /*#__PURE__*/React.createElement("g", {
        key: a
      }, /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "4.5",
        fill: "#FFFFFF",
        opacity: "0.95"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "2.5",
        fill: "#A99CF6"
      }));
    })), /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)',
        border: '3px solid #FFFFFF',
        boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: Math.round(size * 0.28)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -22,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
        color: '#FFFFFF',
        border: '2px solid #6353D6',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: '0.16em',
        padding: '4px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)',
        whiteSpace: 'nowrap'
      }
    }, "BOSS"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: -22,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #EFE0C9',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '2px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(120,100,40,0.20)'
      }
    }, "m\xE0n ", n));
  }
  function PlaceNode({
    node
  }) {
    let inner = null,
      half = 32;
    if (node.kind === 'boss') {
      inner = /*#__PURE__*/React.createElement(BossNode, {
        n: node.id,
        size: 80
      });
      half = 40;
    } else if (node.kind === 'breather') {
      inner = /*#__PURE__*/React.createElement(BreatherNode, {
        n: node.id,
        size: 48
      });
      half = 24;
    } else if (node.state === 'current') {
      inner = /*#__PURE__*/React.createElement(CurrentNode, {
        n: node.id,
        size: 64
      });
      half = 32;
    } else if (node.state === 'done') {
      inner = /*#__PURE__*/React.createElement(DoneNode, {
        n: node.id,
        color: node.color,
        stars: node.stars,
        size: 64
      });
      half = 32;
    } else {
      inner = /*#__PURE__*/React.createElement(LockedRegularNode, {
        n: node.id,
        size: 60
      });
      half = 30;
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: node.x - half,
        top: node.y - half,
        zIndex: node.kind === 'boss' ? 14 : node.state === 'current' ? 12 : 5
      }
    }, inner);
  }

  // ─── gate to World 6 (Núi tuyết) ──────────────────────────────────
  function GateBanner() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: GATE.y - 38,
        transform: 'translateX(-50%)',
        width: 312,
        background: '#FFFFFF',
        border: '1.5px solid #D2E2F0',
        borderRadius: 999,
        padding: '8px 14px 8px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 12px 28px rgba(90,120,160,0.30), 0 4px 8px rgba(120,92,52,0.14)',
        zIndex: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'radial-gradient(circle at 35% 25%, #FFFFFF 0%, #CFE2F2 55%, #9DBCDC 100%)',
        border: '2.5px solid #8AA9C6',
        boxShadow: 'inset 0 -3px 0 rgba(90,120,150,0.14), inset 0 3px 0 rgba(255,255,255,0.7), 0 2px 4px rgba(90,120,150,0.32)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("g", {
      stroke: "#6E92B6",
      strokeWidth: "2",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "3",
      x2: "12",
      y2: "21"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "3.5",
      y1: "7.5",
      x2: "20.5",
      y2: "16.5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "20.5",
      y1: "7.5",
      x2: "3.5",
      y2: "16.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 3 l-2.5 2.5 M12 3 l2.5 2.5 M12 21 l-2.5 -2.5 M12 21 l2.5 -2.5"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -6,
        right: -4,
        background: '#A6C2DA',
        border: '1.5px solid #8AA9C6',
        color: '#FFFFFF',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 11,
        padding: '2px 6px',
        borderRadius: 999,
        lineHeight: 1,
        boxShadow: '0 2px 3px rgba(90,120,150,0.20)'
      }
    }, "W6")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.05,
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.12em',
        color: '#9B886F',
        whiteSpace: 'nowrap'
      }
    }, "C\u1ED4NG \xB7 TH\u1EBE GI\u1EDAI 6"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#5C7C9E',
        whiteSpace: 'nowrap',
        lineHeight: 1.05
      }
    }, "N\xFAi tuy\u1EBFt")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
        border: '1.5px solid #E0A21F',
        padding: '6px 11px 7px 8px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 14
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: '#6A4A2E',
        lineHeight: 1
      }
    }, "80")));
  }
  function StartSign() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: H - 90,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        padding: '6px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(120,100,40,0.20)',
        textTransform: 'uppercase'
      }
    }, "B\xE3i bi\u1EC3n \xB7 ti\u1EBFp t\u1EE5c"));
  }
  function World5Strip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-w5s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w5s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w5s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w5s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w5s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `), /*#__PURE__*/React.createElement(Scene, null), /*#__PURE__*/React.createElement(PathLayer, null), /*#__PURE__*/React.createElement(GateBanner, null), NODES.map(n => /*#__PURE__*/React.createElement(PlaceNode, {
      key: n.id,
      node: n
    })), /*#__PURE__*/React.createElement(StartSign, null));
  }
  window.GJWorld5Strip = World5Strip;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world5-strip.jsx", error: String((e && e.message) || e) }); }

// 04-screens/world6-strip.jsx
try { (() => {
/* world6-strip.jsx — Dải cuộn ĐẦY ĐỦ World 6 "Núi tuyết" (màn 51–60).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn, số node 51→60:
     • 51–55 node thường · 56 BREATHER · 57–59 thường · 60 BOSS
     • trên 60: CỔNG sang World 7 "Hang băng" (chip ★ 100); nền trên cổng
       blend sang palette Hang băng (#2C4A63→#1E3A52 hang động băng tối)
   Biome World 6 (nhìn từ trên xuống): LỐI MÒN TUYẾT nén trắng #FCFEFF→#E4EEF6
   chạy dọc GIỮA (hành lang x 72–290) cho đường + node; HAI MÉP là RỪNG
   THÔNG phủ tuyết — bóng tuyết xanh lạnh #B8CEDD với thông top-down dày,
   đụn tuyết. Trên lối mòn: người tuyết, thông nhỏ, tảng đá phủ tuyết, ao
   băng, chùm băng nhũ, xe trượt, hòn tuyết, mặt trời mùa đông nhạt.
   Exposes window.GJWorld6Strip.                                          */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const {
    JellyBlock
  } = NS;
  const NODES = [{
    id: 51,
    x: 130,
    y: 2440,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'blue'
  }, {
    id: 52,
    x: 240,
    y: 2250,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'mint'
  }, {
    id: 53,
    x: 110,
    y: 2060,
    kind: 'reg',
    state: 'done',
    stars: 2,
    color: 'pink'
  }, {
    id: 54,
    x: 240,
    y: 1870,
    kind: 'reg',
    state: 'current'
  }, {
    id: 55,
    x: 120,
    y: 1680,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 56,
    x: 240,
    y: 1490,
    kind: 'breather',
    state: 'locked'
  }, {
    id: 57,
    x: 110,
    y: 1290,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 58,
    x: 240,
    y: 1090,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 59,
    x: 150,
    y: 880,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 60,
    x: 180,
    y: 620,
    kind: 'boss',
    state: 'locked'
  }];
  const ENTRY = {
    x: 180,
    y: 2620
  };
  const GATE = {
    x: 180,
    y: 360
  };
  const EXIT = {
    x: 180,
    y: -40
  };
  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }
  const ALL_PTS = [ENTRY, ...NODES.map(n => ({
    x: n.x,
    y: n.y
  })), GATE, EXIT];
  const FULL_PATH = pathD(ALL_PTS);
  const WALKED = pathD([ENTRY, NODES[0], NODES[1], NODES[2]]);

  // ─── scene ────────────────────────────────────────────────────────
  function Scene() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "w6s-trail",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FCFEFF"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#EEF5FB"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#E4EEF6"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w6s-forest-l",
      x1: "0",
      y1: "0",
      x2: "1",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#A6BFD2"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#BBD0DE"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#D4E2EC"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w6s-forest-r",
      x1: "1",
      y1: "0",
      x2: "0",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#A6BFD2"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#BBD0DE"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#D4E2EC"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w6s-cave",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#22405A"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.55",
      stopColor: "#1E3A52"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#2C5570"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w6s-sun",
      cx: "0.5",
      cy: "0.5",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFFDF2",
      stopOpacity: "0.95"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.55",
      stopColor: "#FFF1C9",
      stopOpacity: "0.4"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#FFF1C9",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w6s-crystal",
      cx: "0.5",
      cy: "0.4",
      r: "0.6"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#BFF4FF",
      stopOpacity: "0.9"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#7FE0F2",
      stopOpacity: "0"
    }))), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: H,
      fill: "url(#w6s-trail)"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: "200",
      fill: "url(#w6s-cave)"
    }), /*#__PURE__*/React.createElement(CaveCrystalPool, {
      cx: 88,
      cy: 70,
      rx: 60,
      ry: 26
    }), /*#__PURE__*/React.createElement(CaveCrystalPool, {
      cx: 278,
      cy: 130,
      rx: 70,
      ry: 28
    }), /*#__PURE__*/React.createElement(CaveRock, {
      cx: 300,
      cy: 48,
      r: 40
    }), /*#__PURE__*/React.createElement(CaveRock, {
      cx: 54,
      cy: 156,
      r: 44
    }), /*#__PURE__*/React.createElement(CaveRock, {
      cx: 170,
      cy: 30,
      r: 34
    }), [[150, 110, 16], [322, 178, 13], [40, 96, 12], [232, 70, 14], [108, 162, 11], [276, 36, 12]].map(([x, y, r], i) => /*#__PURE__*/React.createElement(CaveCrystal, {
      key: `cc${i}`,
      x: x,
      y: y,
      r: r
    })), [[60, 100], [200, 142], [268, 60], [120, 32], [330, 90], [148, 52]].map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
      key: `gl${i}`,
      style: {
        animation: 'gj-w6s-float 3.6s ease-in-out infinite',
        animationDelay: `${i * 0.35}s`,
        transformOrigin: `${x}px ${y}px`
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "2",
      fill: "#CFF6FF",
      opacity: "0.9"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M0 188 q 90 22 180 6 t 180 14 L360 250 L0 250 Z",
      fill: "#D6E4EE"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M0 196 q 90 20 180 6 t 180 14",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "3",
      opacity: "0.7",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement(ForestEdge, {
      side: "l"
    }), /*#__PURE__*/React.createElement(ForestEdge, {
      side: "r"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "296",
      cy: "430",
      r: "120",
      fill: "url(#w6s-sun)"
    }), /*#__PURE__*/React.createElement(WinterSun, {
      x: 296,
      y: 430,
      r: 38
    }), [[286, 2360, 1], [88, 1980, 0], [288, 1580, 1], [150, 1620, 0]].map(([x, y, t], i) => /*#__PURE__*/React.createElement(Snowman, {
      key: `sm${i}`,
      x: x,
      y: y,
      tilt: t
    })), [[86, 2200, 64], [288, 1960, 58], [88, 1180, 60], [286, 760, 62], [120, 1360, 50]].map(([x, y, h], i) => /*#__PURE__*/React.createElement(SnowPine, {
      key: `pn${i}`,
      x: x,
      y: y,
      h: h
    })), [[284, 2180], [110, 1700], [266, 880]].map(([x, y], i) => /*#__PURE__*/React.createElement(SnowBoulder, {
      key: `bd${i}`,
      x: x,
      y: y
    })), [[150, 2120], [240, 1100]].map(([x, y], i) => /*#__PURE__*/React.createElement(FrozenPond, {
      key: `fp${i}`,
      x: x,
      y: y
    })), [[96, 2300], [228, 1040]].map(([x, y], i) => /*#__PURE__*/React.createElement(Sled, {
      key: `sl${i}`,
      x: x,
      y: y
    })), [[262, 2040], [98, 1500], [276, 1320]].map(([x, y], i) => /*#__PURE__*/React.createElement(Icicles, {
      key: `ic${i}`,
      x: x,
      y: y
    })), [[270, 2280], [108, 1820], [262, 1180], [130, 940]].map(([x, y, r], i) => /*#__PURE__*/React.createElement(Snowball, {
      key: `sb${i}`,
      x: x,
      y: y,
      r: 13 + i % 2 * 3
    })), [[150, 2200], [120, 1500], [240, 1100], [160, 720], [200, 1900], [130, 1000]].map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
      key: `sp${i}`
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "1.8",
      fill: "#FFFFFF",
      opacity: "0.9"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 14,
      cy: y + 18,
      r: "1.2",
      fill: "#D8ECFA",
      opacity: "0.8"
    }))), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 1170,
      size: 20,
      color: "blue",
      delay: "0s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 56,
      y: 2000,
      size: 22,
      color: "mint",
      delay: "0.8s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 2280,
      size: 18,
      color: "pink",
      delay: "1.4s"
    }));
  }

  // ── top-down ice-cave terrain (World 7 preview) ──
  function CaveCrystalPool({
    cx,
    cy,
    rx,
    ry
  }) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry,
      fill: "#2E6E86",
      stroke: "#5FC9DE",
      strokeWidth: "2.5",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy,
      rx: rx * 0.7,
      ry: ry * 0.66,
      fill: "url(#w6s-crystal)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: cx - rx * 0.26,
      cy: cy - ry * 0.3,
      rx: rx * 0.34,
      ry: ry * 0.28,
      fill: "#CFF6FF",
      opacity: "0.4"
    }));
  }
  function CaveRock({
    cx,
    cy,
    r
  }) {
    const n = 7;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.7 : r;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86]);
    }
    const d = 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z';
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 3px rgba(8,24,40,0.4))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "#2A4A63",
      stroke: "#16344B",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }), pts.map(([x, y], i) => /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: cx,
      y1: cy,
      x2: x,
      y2: y,
      stroke: "#16344B",
      strokeWidth: "1",
      opacity: "0.5"
    })), /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy - r * 0.2,
      rx: r * 0.4,
      ry: r * 0.26,
      fill: "#3D6480",
      opacity: "0.7"
    }));
  }
  function CaveCrystal({
    x,
    y,
    r = 14
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 0 6px rgba(127,224,242,0.55))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - r} L ${x + r * 0.5} ${y - r * 0.1} L ${x + r * 0.32} ${y + r} L ${x - r * 0.32} ${y + r} L ${x - r * 0.5} ${y - r * 0.1} Z`,
      fill: "#7FE0F2",
      stroke: "#CFF6FF",
      strokeWidth: "1.4",
      strokeLinejoin: "round",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - r} L ${x} ${y + r}`,
      stroke: "#CFF6FF",
      strokeWidth: "1",
      opacity: "0.7"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - r} L ${x - r * 0.5} ${y - r * 0.1} M ${x} ${y - r} L ${x + r * 0.5} ${y - r * 0.1}`,
      stroke: "#FFFFFF",
      strokeWidth: "0.9",
      opacity: "0.6"
    }));
  }
  function WinterSun({
    x,
    y,
    r = 38
  }) {
    return /*#__PURE__*/React.createElement("g", null, [...Array(10)].map((_, i) => {
      const a = i / 10 * Math.PI * 2;
      return /*#__PURE__*/React.createElement("line", {
        key: i,
        x1: x + Math.cos(a) * (r + 6),
        y1: y + Math.sin(a) * (r + 6),
        x2: x + Math.cos(a) * (r + 16),
        y2: y + Math.sin(a) * (r + 16),
        stroke: "#FFEDB0",
        strokeWidth: "4",
        strokeLinecap: "round",
        opacity: "0.7"
      });
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r,
      fill: "#FFF6DA",
      stroke: "#FFE9A6",
      strokeWidth: "2.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - r * 0.28,
      cy: y - r * 0.28,
      r: r * 0.3,
      fill: "#FFFEF4",
      opacity: "0.85"
    }));
  }

  // side-on snow-dusted pine standing on the trail
  function SnowPine({
    x,
    y,
    h = 60
  }) {
    const w = h * 0.5;
    const tiers = [0.0, 0.32, 0.62];
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 4px 4px rgba(90,120,150,0.24))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - 3,
      y: y - 12,
      width: "6",
      height: "12",
      rx: "2",
      fill: "#9A6E44",
      stroke: "#7E5630",
      strokeWidth: "1"
    }), tiers.map((t, i) => {
      const ty = y - 12 - h * (1 - t);
      const tw = w * (1 - t * 0.5);
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, /*#__PURE__*/React.createElement("path", {
        d: `M ${x} ${ty} L ${x + tw / 2} ${ty + h * 0.32} L ${x - tw / 2} ${ty + h * 0.32} Z`,
        fill: i === 0 ? '#3F8A5E' : '#4E9A6C',
        stroke: "#357A50",
        strokeWidth: "1.2",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: `M ${x} ${ty} q ${tw * 0.22} ${h * 0.1} ${tw * 0.34} ${h * 0.18} q ${-tw * 0.34} ${-h * 0.04} ${-tw * 0.68} 0 q ${tw * 0.12} ${-h * 0.08} ${tw * 0.34} ${-h * 0.18} Z`,
        fill: "#FFFFFF",
        opacity: "0.92"
      }));
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y - 12 - h,
      r: "3",
      fill: "#FFFFFF"
    }));
  }
  function Snowman({
    x,
    y,
    tilt = 0
  }) {
    return /*#__PURE__*/React.createElement("g", {
      transform: `rotate(${tilt * 6} ${x} ${y})`,
      style: {
        filter: 'drop-shadow(0 4px 5px rgba(90,120,150,0.26))'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y - 12,
      r: "16",
      fill: "#FFFFFF",
      stroke: "#D2E2EE",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y - 34,
      r: "12",
      fill: "#FFFFFF",
      stroke: "#D2E2EE",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y - 52,
      r: "9",
      fill: "#FFFFFF",
      stroke: "#D2E2EE",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x + 5,
      cy: y - 10,
      rx: "6",
      ry: "9",
      fill: "#E6F0F8",
      opacity: "0.7"
    }), /*#__PURE__*/React.createElement("line", {
      x1: x - 11,
      y1: y - 36,
      x2: x - 22,
      y2: y - 44,
      stroke: "#9A6E44",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("line", {
      x1: x + 11,
      y1: y - 36,
      x2: x + 22,
      y2: y - 42,
      stroke: "#9A6E44",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y - 30,
      r: "1.6",
      fill: "#5B4636"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y - 36,
      r: "1.6",
      fill: "#5B4636"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - 3,
      cy: y - 54,
      r: "1.5",
      fill: "#3B2A18"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 3,
      cy: y - 54,
      r: "1.5",
      fill: "#3B2A18"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - 51} l 8 2 l -8 2 Z`,
      fill: "#FF9F68",
      stroke: "#E97E45",
      strokeWidth: "0.8",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 9} ${y - 44} q 9 5 18 0`,
      fill: "none",
      stroke: "#F08A7E",
      strokeWidth: "3.4",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("line", {
      x1: x + 8,
      y1: y - 43,
      x2: x + 11,
      y2: y - 33,
      stroke: "#F08A7E",
      strokeWidth: "3",
      strokeLinecap: "round"
    }));
  }
  function SnowBoulder({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 3px 4px rgba(90,120,150,0.24))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 20} ${y} q -4 -18 14 -22 q 10 -8 20 2 q 14 0 8 18 Z`,
      fill: "#A9B9C7",
      stroke: "#8395A6",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 18} ${y - 14} q 12 -12 26 -8 q 8 -4 8 6 q -10 4 -20 2 q -8 4 -14 0 Z`,
      fill: "#FFFFFF",
      opacity: "0.94"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x + 6,
      cy: y - 4,
      rx: "6",
      ry: "4",
      fill: "#8FA2B3",
      opacity: "0.5"
    }));
  }
  function FrozenPond({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: "34",
      ry: "16",
      fill: "#C7E2F2",
      stroke: "#FFFFFF",
      strokeWidth: "2.5",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - 9,
      cy: y - 4,
      rx: "12",
      ry: "6",
      fill: "#FFFFFF",
      opacity: "0.4"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 16} ${y + 2} L ${x} ${y - 5} L ${x + 13} ${y + 3}`,
      fill: "none",
      stroke: "#9DC4DE",
      strokeWidth: "1",
      opacity: "0.7"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 4} ${y + 6} L ${x + 8} ${y - 2}`,
      fill: "none",
      stroke: "#9DC4DE",
      strokeWidth: "1",
      opacity: "0.6"
    }));
  }
  function Sled({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 3px 3px rgba(90,120,150,0.24))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - 18,
      y: y - 8,
      width: "36",
      height: "8",
      rx: "3",
      fill: "#F08A7E",
      stroke: "#D9685C",
      strokeWidth: "1.5"
    }), [-12, -2, 8].map((o, i) => /*#__PURE__*/React.createElement("rect", {
      key: i,
      x: x + o,
      y: y - 8,
      width: "3",
      height: "8",
      rx: "1",
      fill: "#FFFFFF",
      opacity: "0.6"
    })), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 18} ${y + 2} L ${x + 16} ${y + 2} q 8 0 8 -8`,
      fill: "none",
      stroke: "#C9B07E",
      strokeWidth: "2.4",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x + 22} ${y - 6} q 10 -2 14 -12`,
      fill: "none",
      stroke: "#9A6E44",
      strokeWidth: "1.6",
      strokeLinecap: "round"
    }));
  }
  function Icicles({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 2px rgba(90,120,150,0.2))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - 16,
      y: y - 6,
      width: "32",
      height: "5",
      rx: "2.5",
      fill: "#E6F0F8",
      stroke: "#C7DCEC",
      strokeWidth: "1"
    }), [-12, -4, 4, 12].map((o, i) => {
      const len = [14, 20, 12, 17][i];
      return /*#__PURE__*/React.createElement("path", {
        key: i,
        d: `M ${x + o - 3} ${y - 1} L ${x + o + 3} ${y - 1} L ${x + o} ${y - 1 + len} Z`,
        fill: "#CFEAF7",
        stroke: "#A9D2EA",
        strokeWidth: "0.9",
        strokeLinejoin: "round",
        opacity: "0.95"
      });
    }));
  }
  function Snowball({
    x,
    y,
    r = 14
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 3px 3px rgba(90,120,150,0.22))'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r,
      fill: "#FFFFFF",
      stroke: "#D2E2EE",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - r * 0.3,
      cy: y - r * 0.32,
      r: r * 0.26,
      fill: "#FFFFFF",
      opacity: "0.9"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x + r * 0.3,
      cy: y + r * 0.3,
      rx: r * 0.4,
      ry: r * 0.26,
      fill: "#E6F0F8",
      opacity: "0.7"
    }));
  }
  function ForestEdge({
    side
  }) {
    // RỪNG THÔNG một mép — nền bóng tuyết xanh lạnh, mép trong uốn lượn có
    // gờ tuyết trắng, thông top-down dày, đụn tuyết, lấp lánh.
    const isL = side === 'l';
    const fill = isL ? 'url(#w6s-forest-l)' : 'url(#w6s-forest-r)';
    const X = v => isL ? v : W - v;
    const outerX = isL ? -24 : W + 24;
    const inset = i => [70, 56, 64, 58][i % 4];
    const pts = [];
    for (let y = 250, i = 0; y <= H + 40; y += 150, i++) {
      pts.push([X(inset(i)), y, i]);
    }
    let d = `M ${outerX} 250 L ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      const my = (py + y) / 2;
      d += `Q ${px} ${my} ${x} ${y} `;
    }
    d += `L ${outerX} ${H + 40} Z`;
    let edge = `M ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      edge += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    // top-down pines packed in the forest band
    const pines = [];
    for (let y = 300, i = 0; y < H; y += 95, i++) {
      const ix = inset(Math.round((y - 250) / 150));
      pines.push(/*#__PURE__*/React.createElement(PineTop, {
        key: `pta${i}`,
        x: X(ix - 20 - i % 3 * 10),
        y: y,
        r: 11 + i % 3 * 3
      }));
      if (i % 2 === 0) pines.push(/*#__PURE__*/React.createElement(PineTop, {
        key: `ptb${i}`,
        x: X(28 + i % 2 * 8),
        y: y + 46,
        r: 9 + i % 2 * 3
      }));
    }
    // snow drifts
    const drifts = [];
    for (let y = 360, i = 0; y < H; y += 300, i++) {
      drifts.push(/*#__PURE__*/React.createElement(SnowDrift, {
        key: `sd${i}`,
        cx: X(40),
        cy: y,
        rx: 40,
        ry: 16
      }));
    }
    // sparkles
    const sparks = [];
    for (let y = 380, i = 0; y < H; y += 210, i++) {
      sparks.push(/*#__PURE__*/React.createElement("circle", {
        key: `sk${i}`,
        cx: X(30 + i % 2 * 10),
        cy: y,
        r: "1.5",
        fill: "#FFFFFF",
        opacity: "0.85"
      }));
    }
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: fill
    }), drifts, pines, sparks, /*#__PURE__*/React.createElement("path", {
      d: edge,
      fill: "none",
      stroke: "#C7DCEC",
      strokeWidth: "9",
      opacity: "0.55",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: edge,
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "4",
      opacity: "0.9",
      strokeLinecap: "round"
    }));
  }
  function PineTop({
    x,
    y,
    r = 11
  }) {
    // thông nhìn TỪ TRÊN — ngôi sao xanh nhiều cánh + tâm tuyết
    const n = 8;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.45 : r;
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    const d = 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z';
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 3px rgba(70,100,130,0.28))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "#3F8A5E",
      stroke: "#357A50",
      strokeWidth: "1",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r * 0.4,
      fill: "#FFFFFF",
      opacity: "0.92"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r * 0.14,
      fill: "#9A6E44"
    }));
  }
  function SnowDrift({
    cx,
    cy,
    rx,
    ry
  }) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy + ry * 0.28,
      rx: rx,
      ry: ry,
      fill: "#9FB8C9",
      opacity: "0.5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry,
      fill: "#F5FAFF"
    }));
  }
  function FloatJelly({
    x,
    y,
    size,
    color,
    delay
  }) {
    const p = {
      yellow: {
        f: '#FFE3A3',
        e: '#E8B85C',
        s: '#FFF1CE'
      },
      mint: {
        f: '#A3E5D9',
        e: '#5FC3B2',
        s: '#CBF2EB'
      },
      pink: {
        f: '#F7A9C0',
        e: '#E576A0',
        s: '#FBD0DF'
      },
      blue: {
        f: '#B3C7F7',
        e: '#7E9CE8',
        s: '#D6E1FB'
      }
    }[color] || {
      f: '#FFE3A3',
      e: '#E8B85C',
      s: '#FFF1CE'
    };
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w6s-float 3.6s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`,
        filter: 'drop-shadow(0 4px 3px rgba(90,120,150,0.24))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
      rx: Math.round(size * 0.28),
      fill: p.f,
      stroke: p.e,
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y - size * 0.18,
      rx: size * 0.34,
      ry: size * 0.12,
      fill: p.s,
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }));
  }

  // ─── path ─────────────────────────────────────────────────────────
  function PathLayer() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "rgba(90,120,150,0.18)",
      strokeWidth: "34",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      transform: "translate(0,4)"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#DCE9F2",
      strokeWidth: "30",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "26",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#BFD6E6",
      strokeWidth: "3.5",
      strokeLinecap: "round",
      strokeDasharray: "7 11"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FF9F68",
      strokeWidth: "20",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "6",
      strokeLinecap: "round",
      strokeDasharray: "4 9",
      opacity: "0.9"
    }));
  }

  // ─── stars / node primitives (shared) ────────────────────────────
  function Star({
    filled = false,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z",
      fill: filled ? '#FFC23D' : '#D9CDB5',
      stroke: filled ? '#E0A21F' : '#B6A892',
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }));
  }
  function StarArc({
    stars = 3,
    size = 14,
    width = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -size - 6,
        transform: 'translateX(-50%)',
        width,
        height: size + 8,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(-22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-2px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }
  function NumberBadge({
    n,
    size,
    color = '#6A4A2E'
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        lineHeight: 1,
        color,
        textShadow: '0 1px 0 rgba(255,255,255,0.55)',
        pointerEvents: 'none'
      }
    }, n);
  }
  function LockGlyph({
    size = 18
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M8 11V8.5a4 4 0 1 1 8 0V11",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "2.6",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "11",
      width: "14",
      height: "9",
      rx: "2.5",
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "15",
      r: "1.4",
      fill: "#A89A82"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "11.3",
      y: "15",
      width: "1.4",
      height: "3",
      rx: "0.6",
      fill: "#A89A82"
    }));
  }
  function DoneNode({
    n,
    color,
    stars,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 5px 7px rgba(90,120,150,0.26))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: color,
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement(NumberBadge, {
      n: n,
      size: size
    }), /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 14,
      width: size + 14
    }));
  }
  function LockedRegularNode({
    n,
    size = 60
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 5px rgba(90,120,150,0.22))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n), /*#__PURE__*/React.createElement(StarArc, {
      stars: 0,
      size: 12,
      width: size + 8
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -4,
        bottom: -4,
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: '#8A7B62',
        border: '2px solid #FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(90,120,150,0.34)'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: 13
    })));
  }
  function CurrentNode({
    n,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -16,
        top: -16,
        width: size + 32,
        height: size + 32,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.24)',
        animation: 'gj-w6s-pulse 1600ms ease-out infinite'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -5,
        top: -5,
        width: size + 10,
        height: size + 10,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.34)',
        animation: 'gj-w6s-pulse 1600ms ease-out infinite',
        animationDelay: '320ms'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#FFFFFF',
        border: '3px solid #FF9F68',
        boxShadow: '0 6px 14px rgba(90,120,150,0.24), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: size - 16,
      height: size - 16,
      viewBox: "0 0 40 40",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "20",
      cy: "20",
      r: "18",
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "2",
      strokeDasharray: "3 4"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#E97E45'
      }
    }, n)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -40,
        transform: 'translateX(-50%)',
        animation: 'gj-w6s-hop 1400ms ease-in-out infinite',
        filter: 'drop-shadow(0 4px 4px rgba(90,120,150,0.30))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "blue",
      size: 38,
      direction: "down",
      expression: "happy"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: size + 10,
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)',
        color: '#FFFFFF',
        border: '2px solid #E97E45',
        borderBottom: '3px solid #C8662F',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '5px 14px 6px',
        borderRadius: 999,
        boxShadow: '0 6px 12px rgba(201,102,47,0.35), inset 0 2px 0 rgba(255,197,154,0.6)',
        whiteSpace: 'nowrap'
      }
    }, "Ch\u01A1i ngay"));
  }
  function BreatherNode({
    n,
    size = 48
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -10,
        left: size + 8,
        background: '#FFFFFF',
        color: '#8C7458',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.10em',
        padding: '4px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 8px rgba(90,120,150,0.22)',
        whiteSpace: 'nowrap'
      }
    }, "NGH\u1EC8"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -6,
        left: size + 4,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#FFD074',
        border: '1.5px solid #E0A21F'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 5px rgba(90,120,150,0.24))',
        opacity: 0.92
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.30} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.55} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: size * 0.15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.28),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n)));
  }
  function BossNode({
    n,
    size = 80
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 8px 14px rgba(126,108,240,0.40))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -28,
        top: -28,
        right: -28,
        bottom: -28,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.55) 0%, rgba(126,108,240,0.30) 55%, rgba(126,108,240,0) 78%)',
        animation: 'gj-w6s-halo 2400ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement("svg", {
      width: size + 56,
      height: size + 56,
      viewBox: "0 0 200 200",
      style: {
        position: 'absolute',
        left: -28,
        top: -28,
        pointerEvents: 'none',
        animation: 'gj-w6s-spin 8s linear infinite',
        transformOrigin: '50% 50%'
      }
    }, [0, 60, 120, 180, 240, 300].map(a => {
      const rad = a * Math.PI / 180;
      const cx = 100 + Math.cos(rad) * 84;
      const cy = 100 + Math.sin(rad) * 84;
      return /*#__PURE__*/React.createElement("g", {
        key: a
      }, /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "4.5",
        fill: "#FFFFFF",
        opacity: "0.95"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "2.5",
        fill: "#A99CF6"
      }));
    })), /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)',
        border: '3px solid #FFFFFF',
        boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: Math.round(size * 0.28)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -22,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
        color: '#FFFFFF',
        border: '2px solid #6353D6',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: '0.16em',
        padding: '4px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)',
        whiteSpace: 'nowrap'
      }
    }, "BOSS"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: -22,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #EFE0C9',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '2px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(90,120,150,0.22)'
      }
    }, "m\xE0n ", n));
  }
  function PlaceNode({
    node
  }) {
    let inner = null,
      half = 32;
    if (node.kind === 'boss') {
      inner = /*#__PURE__*/React.createElement(BossNode, {
        n: node.id,
        size: 80
      });
      half = 40;
    } else if (node.kind === 'breather') {
      inner = /*#__PURE__*/React.createElement(BreatherNode, {
        n: node.id,
        size: 48
      });
      half = 24;
    } else if (node.state === 'current') {
      inner = /*#__PURE__*/React.createElement(CurrentNode, {
        n: node.id,
        size: 64
      });
      half = 32;
    } else if (node.state === 'done') {
      inner = /*#__PURE__*/React.createElement(DoneNode, {
        n: node.id,
        color: node.color,
        stars: node.stars,
        size: 64
      });
      half = 32;
    } else {
      inner = /*#__PURE__*/React.createElement(LockedRegularNode, {
        n: node.id,
        size: 60
      });
      half = 30;
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: node.x - half,
        top: node.y - half,
        zIndex: node.kind === 'boss' ? 14 : node.state === 'current' ? 12 : 5
      }
    }, inner);
  }

  // ─── gate to World 7 (Hang băng) ──────────────────────────────────
  function GateBanner() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: GATE.y - 38,
        transform: 'translateX(-50%)',
        width: 312,
        background: '#FFFFFF',
        border: '1.5px solid #BFD2E0',
        borderRadius: 999,
        padding: '8px 14px 8px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 12px 28px rgba(40,70,100,0.32), 0 4px 8px rgba(120,92,52,0.14)',
        zIndex: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'radial-gradient(circle at 35% 25%, #4E7A92 0%, #2C5570 55%, #1B3A52 100%)',
        border: '2.5px solid #5F9FB8',
        boxShadow: 'inset 0 -3px 0 rgba(10,30,50,0.3), inset 0 3px 0 rgba(143,209,224,0.5), 0 2px 4px rgba(20,50,80,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "30",
      height: "30",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2 L15 9 L12 22 L9 9 Z",
      fill: "#7FE0F2",
      stroke: "#CFF6FF",
      strokeWidth: "1.4",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 2 L12 22",
      stroke: "#CFF6FF",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 6 L12 11 L19 6",
      fill: "none",
      stroke: "#9FE9F7",
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -6,
        right: -4,
        background: '#3D7E96',
        border: '1.5px solid #5F9FB8',
        color: '#FFFFFF',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 11,
        padding: '2px 6px',
        borderRadius: 999,
        lineHeight: 1,
        boxShadow: '0 2px 3px rgba(20,50,80,0.3)'
      }
    }, "W7")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.05,
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.12em',
        color: '#9B886F',
        whiteSpace: 'nowrap'
      }
    }, "C\u1ED4NG \xB7 TH\u1EBE GI\u1EDAI 7"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#2F6B83',
        whiteSpace: 'nowrap',
        lineHeight: 1.05
      }
    }, "Hang b\u0103ng")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
        border: '1.5px solid #E0A21F',
        padding: '6px 11px 7px 8px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 14
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: '#6A4A2E',
        lineHeight: 1
      }
    }, "100")));
  }
  function StartSign() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: H - 90,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        padding: '6px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(90,120,150,0.22)',
        textTransform: 'uppercase'
      }
    }, "N\xFAi tuy\u1EBFt \xB7 ti\u1EBFp t\u1EE5c"));
  }
  function World6Strip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-w6s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w6s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w6s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w6s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w6s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `), /*#__PURE__*/React.createElement(Scene, null), /*#__PURE__*/React.createElement(PathLayer, null), /*#__PURE__*/React.createElement(GateBanner, null), NODES.map(n => /*#__PURE__*/React.createElement(PlaceNode, {
      key: n.id,
      node: n
    })), /*#__PURE__*/React.createElement(StartSign, null));
  }
  window.GJWorld6Strip = World6Strip;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world6-strip.jsx", error: String((e && e.message) || e) }); }

// 04-screens/world7-strip.jsx
try { (() => {
/* world7-strip.jsx — Dải cuộn ĐẦY ĐỦ World 7 "Hang băng" (màn 61–70).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn, số node 61→70:
     • 61–65 node thường · 66 BREATHER · 67–69 thường · 70 BOSS
     • trên 70: CỔNG sang World 8 "Núi lửa" (chip ★ 120); nền trên cổng
       blend sang palette Núi lửa (#3A1810→#FF7A3D nham thạch nóng)
   Biome World 7 (nhìn TỪ TRÊN XUỐNG): HANG ĐỘNG BĂNG tối #16344B→#22405A.
   GIỮA là LỐI BĂNG phát sáng #D9F2FC→#9CCFE6 (hành lang x 72–290) cho
   đường + node; HAI MÉP là VÁCH HANG tối #1B344A→#2E516B với cụm TINH THỂ
   BĂNG #7FE0F2/#CFF6FF chĩa vào trong, măng băng, đèn hang phát sáng. Trên
   lối băng: tinh thể phát sáng, hồ băng sáng, nấm băng, măng đá băng, đèn
   hang, tảng băng, thác băng đóng. Mặt trên = NÚI LỬA (W8 preview).
   Exposes window.GJWorld7Strip.                                          */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const {
    JellyBlock
  } = NS;
  const NODES = [{
    id: 61,
    x: 130,
    y: 2440,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'mint'
  }, {
    id: 62,
    x: 240,
    y: 2250,
    kind: 'reg',
    state: 'done',
    stars: 2,
    color: 'blue'
  }, {
    id: 63,
    x: 110,
    y: 2060,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'pink'
  }, {
    id: 64,
    x: 240,
    y: 1870,
    kind: 'reg',
    state: 'current'
  }, {
    id: 65,
    x: 120,
    y: 1680,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 66,
    x: 240,
    y: 1490,
    kind: 'breather',
    state: 'locked'
  }, {
    id: 67,
    x: 110,
    y: 1290,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 68,
    x: 240,
    y: 1090,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 69,
    x: 150,
    y: 880,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 70,
    x: 180,
    y: 620,
    kind: 'boss',
    state: 'locked'
  }];
  const ENTRY = {
    x: 180,
    y: 2620
  };
  const GATE = {
    x: 180,
    y: 360
  };
  const EXIT = {
    x: 180,
    y: -40
  };
  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }
  const ALL_PTS = [ENTRY, ...NODES.map(n => ({
    x: n.x,
    y: n.y
  })), GATE, EXIT];
  const FULL_PATH = pathD(ALL_PTS);
  const WALKED = pathD([ENTRY, NODES[0], NODES[1], NODES[2]]);

  // ─── scene ────────────────────────────────────────────────────────
  function Scene() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "w7s-trail",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#E2F5FD"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#C2E4F1"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#A7D2E6"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w7s-wall-l",
      x1: "0",
      y1: "0",
      x2: "1",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#13304A"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#1E3C57"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#2E516B"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w7s-wall-r",
      x1: "1",
      y1: "0",
      x2: "0",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#13304A"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#1E3C57"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#2E516B"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w7s-volcano",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#3A1710"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.55",
      stopColor: "#2C120B"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#43251A"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w7s-crystal",
      cx: "0.5",
      cy: "0.4",
      r: "0.6"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#BFF4FF",
      stopOpacity: "0.95"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#7FE0F2",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w7s-pool",
      cx: "0.5",
      cy: "0.5",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#CFF6FF",
      stopOpacity: "0.9"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#3E94AE",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w7s-lava",
      cx: "0.5",
      cy: "0.5",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFD27A",
      stopOpacity: "0.95"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.45",
      stopColor: "#FF7A3D",
      stopOpacity: "0.9"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#E0431F",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w7s-orb",
      cx: "0.5",
      cy: "0.42",
      r: "0.55"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#DFFAFF",
      stopOpacity: "0.95"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#7FE0F2",
      stopOpacity: "0.5"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#5FC9DE",
      stopOpacity: "0"
    }))), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: H,
      fill: "url(#w7s-trail)"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: "200",
      fill: "url(#w7s-volcano)"
    }), /*#__PURE__*/React.createElement(LavaPool, {
      cx: 92,
      cy: 78,
      rx: 56,
      ry: 24
    }), /*#__PURE__*/React.createElement(LavaPool, {
      cx: 276,
      cy: 138,
      rx: 66,
      ry: 26
    }), /*#__PURE__*/React.createElement(LavaCrack, {
      d: "M0 110 Q 90 96 150 120 T 360 104"
    }), /*#__PURE__*/React.createElement(LavaCrack, {
      d: "M30 168 Q 120 150 210 176 T 360 158"
    }), /*#__PURE__*/React.createElement(VolRock, {
      cx: 300,
      cy: 52,
      r: 40
    }), /*#__PURE__*/React.createElement(VolRock, {
      cx: 54,
      cy: 158,
      r: 44
    }), /*#__PURE__*/React.createElement(VolRock, {
      cx: 176,
      cy: 34,
      r: 32
    }), [[70, 120], [200, 150], [268, 70], [126, 44], [330, 96], [150, 60]].map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
      key: `em${i}`,
      style: {
        animation: 'gj-w7s-ember 2.8s ease-in-out infinite',
        animationDelay: `${i * 0.32}s`,
        transformOrigin: `${x}px ${y}px`
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "2.4",
      fill: "#FFC061",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "4.5",
      fill: "#FF7A3D",
      opacity: "0.4"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M0 188 q 90 22 180 6 t 180 14 L360 250 L0 250 Z",
      fill: "#7FC3D8",
      opacity: "0.9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M0 196 q 90 20 180 6 t 180 14",
      fill: "none",
      stroke: "#CFF6FF",
      strokeWidth: "3",
      opacity: "0.8",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement(CaveWall, {
      side: "l"
    }), /*#__PURE__*/React.createElement(CaveWall, {
      side: "r"
    }), /*#__PURE__*/React.createElement("radialGlow", {
      x: 296,
      y: 430,
      r: 130
    }), [[286, 2360, 1], [88, 1980, 0], [288, 1580, 1], [150, 1620, 0], [98, 1180, 0]].map(([x, y, t], i) => /*#__PURE__*/React.createElement(CrystalCluster, {
      key: `gc${i}`,
      x: x,
      y: y,
      tilt: t
    })), [[150, 2120], [240, 1100], [120, 760]].map(([x, y], i) => /*#__PURE__*/React.createElement(GlowPool, {
      key: `gp${i}`,
      x: x,
      y: y
    })), [[284, 2180], [110, 1700], [266, 880]].map(([x, y], i) => /*#__PURE__*/React.createElement(IceMushroom, {
      key: `im${i}`,
      x: x,
      y: y
    })), [[96, 2300], [228, 1040], [286, 1320]].map(([x, y], i) => /*#__PURE__*/React.createElement(Stalagmites, {
      key: `st${i}`,
      x: x,
      y: y
    })), [[262, 2040], [98, 1500], [156, 940]].map(([x, y], i) => /*#__PURE__*/React.createElement(Icicles, {
      key: `ic${i}`,
      x: x,
      y: y
    })), [[270, 2280], [262, 1180]].map(([x, y], i) => /*#__PURE__*/React.createElement(IceBoulder, {
      key: `ib${i}`,
      x: x,
      y: y
    })), [[300, 1430, 9, '0s'], [70, 1320, 7, '0.6s'], [296, 700, 8, '1.1s'], [120, 1900, 7, '1.5s']].map(([x, y, r, d], i) => /*#__PURE__*/React.createElement(CaveOrb, {
      key: `co${i}`,
      x: x,
      y: y,
      r: r,
      delay: d
    })), [[150, 2200], [120, 1500], [240, 1100], [160, 720], [200, 1900], [130, 1000]].map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
      key: `sp${i}`
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "1.8",
      fill: "#FFFFFF",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 14,
      cy: y + 18,
      r: "1.2",
      fill: "#CFF6FF",
      opacity: "0.85"
    }))), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 1170,
      size: 20,
      color: "blue",
      delay: "0s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 56,
      y: 2000,
      size: 22,
      color: "mint",
      delay: "0.8s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 2280,
      size: 18,
      color: "pink",
      delay: "1.4s"
    }));
  }

  // ── top-down volcano terrain (World 8 preview) ──
  function LavaPool({
    cx,
    cy,
    rx,
    ry
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 0 10px rgba(255,122,61,0.55))'
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry,
      fill: "#7A2A14",
      stroke: "#FF7A3D",
      strokeWidth: "2.5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy,
      rx: rx * 0.74,
      ry: ry * 0.7,
      fill: "url(#w7s-lava)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: cx - rx * 0.24,
      cy: cy - ry * 0.28,
      rx: rx * 0.3,
      ry: ry * 0.24,
      fill: "#FFE6A8",
      opacity: "0.6"
    }));
  }
  function LavaCrack({
    d
  }) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: "#E0431F",
      strokeWidth: "5",
      strokeLinecap: "round",
      opacity: "0.8"
    }), /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: "#FF9F52",
      strokeWidth: "2.2",
      strokeLinecap: "round",
      opacity: "0.95"
    }));
  }
  function VolRock({
    cx,
    cy,
    r
  }) {
    const n = 7;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.7 : r;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86]);
    }
    const d = 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z';
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 3px rgba(20,6,2,0.5))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "#3A1C12",
      stroke: "#21100A",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }), pts.map(([x, y], i) => /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: cx,
      y1: cy,
      x2: x,
      y2: y,
      stroke: "#21100A",
      strokeWidth: "1",
      opacity: "0.5"
    })), /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy - r * 0.2,
      rx: r * 0.4,
      ry: r * 0.26,
      fill: "#5A3322",
      opacity: "0.7"
    }));
  }
  function radialGlow(props) {
    return RadialGlow(props);
  }
  function RadialGlow({
    x,
    y,
    r
  }) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r,
      fill: "url(#w7s-orb)",
      opacity: "0.6"
    }), /*#__PURE__*/React.createElement(CrystalCluster, {
      x: x,
      y: y,
      tilt: 0,
      big: true
    }));
  }

  // ── ice-cave decorations on the glowing trail ──
  function CrystalCluster({
    x,
    y,
    tilt = 0,
    big = false
  }) {
    const k = big ? 1.5 : 1;
    const shard = (dx, h, w, hue) => {
      const bx = x + dx;
      return /*#__PURE__*/React.createElement("path", {
        key: `${dx}-${h}`,
        d: `M ${bx} ${y - h} L ${bx + w} ${y + 4} L ${bx} ${y + 10} L ${bx - w} ${y + 4} Z`,
        fill: hue,
        stroke: "#CFF6FF",
        strokeWidth: "1.3",
        strokeLinejoin: "round"
      });
    };
    return /*#__PURE__*/React.createElement("g", {
      transform: `rotate(${tilt * 5} ${x} ${y})`,
      style: {
        filter: 'drop-shadow(0 0 8px rgba(127,224,242,0.6))'
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y + 12,
      rx: 22 * k,
      ry: 6 * k,
      fill: "#5FC9DE",
      opacity: "0.28"
    }), shard(-14 * k, 30 * k, 8 * k, '#5FC9DE'), shard(13 * k, 36 * k, 9 * k, '#5FC9DE'), shard(0, 52 * k, 11 * k, '#7FE0F2'), /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - 52 * k} L ${x} ${y + 8 * k}`,
      stroke: "#CFF6FF",
      strokeWidth: "1",
      opacity: "0.8"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - 52 * k} L ${x - 11 * k} ${y + 4} M ${x} ${y - 52 * k} L ${x + 11 * k} ${y + 4}`,
      stroke: "#FFFFFF",
      strokeWidth: "0.9",
      opacity: "0.55"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y - 36 * k,
      r: 2.4 * k,
      fill: "#FFFFFF",
      opacity: "0.9"
    }));
  }
  function GlowPool({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 0 8px rgba(95,201,222,0.5))'
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: "34",
      ry: "16",
      fill: "#2E6E86",
      stroke: "#5FC9DE",
      strokeWidth: "2.5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: "24",
      ry: "11",
      fill: "url(#w7s-pool)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - 9,
      cy: y - 4,
      rx: "11",
      ry: "5",
      fill: "#CFF6FF",
      opacity: "0.55"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 16} ${y + 2} L ${x} ${y - 5} L ${x + 13} ${y + 3}`,
      fill: "none",
      stroke: "#CFF6FF",
      strokeWidth: "1",
      opacity: "0.6"
    }));
  }
  function IceMushroom({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 3px 4px rgba(8,24,40,0.4))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - 4,
      y: y - 14,
      width: "8",
      height: "16",
      rx: "3",
      fill: "#CFEAF7",
      stroke: "#9FCFE6",
      strokeWidth: "1.2"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 18} ${y - 12} q 18 -20 36 0 q -18 7 -36 0 Z`,
      fill: "#7FE0F2",
      stroke: "#CFF6FF",
      strokeWidth: "1.4",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - 5,
      cy: y - 14,
      rx: "6",
      ry: "3",
      fill: "#FFFFFF",
      opacity: "0.6"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - 8,
      cy: y - 11,
      r: "1.3",
      fill: "#CFF6FF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 6,
      cy: y - 13,
      r: "1.1",
      fill: "#CFF6FF"
    }));
  }
  function Stalagmites({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 0 6px rgba(127,224,242,0.45))'
      }
    }, [[-12, 24, 7], [2, 34, 9], [14, 20, 6]].map(([o, h, w], i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x + o} ${y - h} L ${x + o + w} ${y + 6} L ${x + o - w} ${y + 6} Z`,
      fill: i === 1 ? '#7FE0F2' : '#5FC9DE',
      stroke: "#CFF6FF",
      strokeWidth: "1.2",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x + o} ${y - h} L ${x + o} ${y + 6}`,
      stroke: "#CFF6FF",
      strokeWidth: "0.8",
      opacity: "0.7"
    }))), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y + 7,
      rx: "18",
      ry: "4",
      fill: "#5FC9DE",
      opacity: "0.3"
    }));
  }
  function Icicles({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 2px 3px rgba(8,24,40,0.35))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - 16,
      y: y - 6,
      width: "32",
      height: "5",
      rx: "2.5",
      fill: "#CFEAF7",
      stroke: "#9FCFE6",
      strokeWidth: "1"
    }), [-12, -4, 4, 12].map((o, i) => {
      const len = [14, 20, 12, 17][i];
      return /*#__PURE__*/React.createElement("path", {
        key: i,
        d: `M ${x + o - 3} ${y - 1} L ${x + o + 3} ${y - 1} L ${x + o} ${y - 1 + len} Z`,
        fill: "#CFEAF7",
        stroke: "#7FE0F2",
        strokeWidth: "0.9",
        strokeLinejoin: "round",
        opacity: "0.95"
      });
    }));
  }
  function IceBoulder({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 3px 4px rgba(8,24,40,0.4))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 20} ${y} q -4 -18 14 -22 q 10 -8 20 2 q 14 0 8 18 Z`,
      fill: "#6FA8C4",
      stroke: "#3E6F8C",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 18} ${y - 14} q 12 -12 26 -8 q 8 -4 8 6 q -10 4 -20 2 q -8 4 -14 0 Z`,
      fill: "#CFEAF7",
      opacity: "0.9"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x + 6,
      cy: y - 4,
      rx: "6",
      ry: "4",
      fill: "#3E6F8C",
      opacity: "0.5"
    }));
  }
  function CaveOrb({
    x,
    y,
    r = 8,
    delay = '0s'
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w7s-float 3.6s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r * 2.2,
      fill: "url(#w7s-orb)",
      opacity: "0.55"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r,
      fill: "#DFFAFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - r * 0.3,
      cy: y - r * 0.3,
      r: r * 0.34,
      fill: "#FFFFFF"
    }));
  }
  function CaveWall({
    side
  }) {
    // VÁCH HANG một mép — nền đá băng tối, mép trong uốn lượn có gờ băng
    // phát sáng cyan, cụm tinh thể chĩa vào trong, đèn hang, lấp lánh.
    const isL = side === 'l';
    const fill = isL ? 'url(#w7s-wall-l)' : 'url(#w7s-wall-r)';
    const X = v => isL ? v : W - v;
    const outerX = isL ? -24 : W + 24;
    const inset = i => [70, 56, 64, 58][i % 4];
    const pts = [];
    for (let y = 250, i = 0; y <= H + 40; y += 150, i++) {
      pts.push([X(inset(i)), y, i]);
    }
    let d = `M ${outerX} 250 L ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      const my = (py + y) / 2;
      d += `Q ${px} ${my} ${x} ${y} `;
    }
    d += `L ${outerX} ${H + 40} Z`;
    let edge = `M ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      edge += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    // inward-pointing crystal spikes packed along the wall
    const spikes = [];
    for (let y = 300, i = 0; y < H; y += 104, i++) {
      const ix = inset(Math.round((y - 250) / 150));
      spikes.push(/*#__PURE__*/React.createElement(WallSpike, {
        key: `ws${i}`,
        bx: X(ix),
        y: y,
        dir: isL ? 1 : -1,
        len: 16 + i % 3 * 7
      }));
    }
    // embedded glow orbs
    const orbs = [];
    for (let y = 420, i = 0; y < H; y += 360, i++) {
      orbs.push(/*#__PURE__*/React.createElement("circle", {
        key: `wo${i}`,
        cx: X(34),
        cy: y,
        r: i % 2 ? 5 : 7,
        fill: "url(#w7s-orb)",
        opacity: "0.8"
      }));
    }
    // sparkles
    const sparks = [];
    for (let y = 380, i = 0; y < H; y += 210, i++) {
      sparks.push(/*#__PURE__*/React.createElement("circle", {
        key: `wk${i}`,
        cx: X(28 + i % 2 * 12),
        cy: y,
        r: "1.5",
        fill: "#CFF6FF",
        opacity: "0.85"
      }));
    }
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: fill
    }), orbs, spikes, sparks, /*#__PURE__*/React.createElement("path", {
      d: edge,
      fill: "none",
      stroke: "#3E94AE",
      strokeWidth: "9",
      opacity: "0.5",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: edge,
      fill: "none",
      stroke: "#CFF6FF",
      strokeWidth: "3.5",
      opacity: "0.85",
      strokeLinecap: "round"
    }));
  }
  function WallSpike({
    bx,
    y,
    dir,
    len = 18
  }) {
    // tinh thể băng chĩa vào trong lối đi (từ mép)
    const tip = bx + dir * len;
    const w = 6 + len * 0.18;
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 0 5px rgba(127,224,242,0.5))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${tip} ${y} L ${bx} ${y - w} L ${bx - dir * 6} ${y} L ${bx} ${y + w} Z`,
      fill: "#5FC9DE",
      stroke: "#CFF6FF",
      strokeWidth: "1.1",
      strokeLinejoin: "round",
      opacity: "0.92"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${tip} ${y} L ${bx} ${y}`,
      stroke: "#CFF6FF",
      strokeWidth: "0.8",
      opacity: "0.7"
    }));
  }
  function FloatJelly({
    x,
    y,
    size,
    color,
    delay
  }) {
    const p = {
      yellow: {
        f: '#FFE3A3',
        e: '#E8B85C',
        s: '#FFF1CE'
      },
      mint: {
        f: '#A3E5D9',
        e: '#5FC3B2',
        s: '#CBF2EB'
      },
      pink: {
        f: '#F7A9C0',
        e: '#E576A0',
        s: '#FBD0DF'
      },
      blue: {
        f: '#B3C7F7',
        e: '#7E9CE8',
        s: '#D6E1FB'
      }
    }[color] || {
      f: '#FFE3A3',
      e: '#E8B85C',
      s: '#FFF1CE'
    };
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w7s-float 3.6s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`,
        filter: 'drop-shadow(0 4px 4px rgba(8,24,40,0.4))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
      rx: Math.round(size * 0.28),
      fill: p.f,
      stroke: p.e,
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y - size * 0.18,
      rx: size * 0.34,
      ry: size * 0.12,
      fill: p.s,
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }));
  }

  // ─── path ─────────────────────────────────────────────────────────
  function PathLayer() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "rgba(20,50,80,0.22)",
      strokeWidth: "34",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      transform: "translate(0,4)"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#7FC3D8",
      strokeWidth: "30",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#E8F7FD",
      strokeWidth: "26",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#7FE0F2",
      strokeWidth: "3.5",
      strokeLinecap: "round",
      strokeDasharray: "7 11"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FF9F68",
      strokeWidth: "20",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "6",
      strokeLinecap: "round",
      strokeDasharray: "4 9",
      opacity: "0.9"
    }));
  }

  // ─── stars / node primitives (shared) ────────────────────────────
  function Star({
    filled = false,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z",
      fill: filled ? '#FFC23D' : '#9FB8C9',
      stroke: filled ? '#E0A21F' : '#7895A8',
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }));
  }
  function StarArc({
    stars = 3,
    size = 14,
    width = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -size - 6,
        transform: 'translateX(-50%)',
        width,
        height: size + 8,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(-22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-2px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }
  function NumberBadge({
    n,
    size,
    color = '#6A4A2E'
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        lineHeight: 1,
        color,
        textShadow: '0 1px 0 rgba(255,255,255,0.55)',
        pointerEvents: 'none'
      }
    }, n);
  }
  function LockGlyph({
    size = 18
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M8 11V8.5a4 4 0 1 1 8 0V11",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "2.6",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "11",
      width: "14",
      height: "9",
      rx: "2.5",
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "15",
      r: "1.4",
      fill: "#A89A82"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "11.3",
      y: "15",
      width: "1.4",
      height: "3",
      rx: "0.6",
      fill: "#A89A82"
    }));
  }
  function DoneNode({
    n,
    color,
    stars,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 5px 8px rgba(8,24,40,0.4))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: color,
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement(NumberBadge, {
      n: n,
      size: size
    }), /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 14,
      width: size + 14
    }));
  }
  function LockedRegularNode({
    n,
    size = 60
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 6px rgba(8,24,40,0.36))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n), /*#__PURE__*/React.createElement(StarArc, {
      stars: 0,
      size: 12,
      width: size + 8
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -4,
        bottom: -4,
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: '#8A7B62',
        border: '2px solid #FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(8,24,40,0.45)'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: 13
    })));
  }
  function CurrentNode({
    n,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -16,
        top: -16,
        width: size + 32,
        height: size + 32,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.26)',
        animation: 'gj-w7s-pulse 1600ms ease-out infinite'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -5,
        top: -5,
        width: size + 10,
        height: size + 10,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.36)',
        animation: 'gj-w7s-pulse 1600ms ease-out infinite',
        animationDelay: '320ms'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#FFFFFF',
        border: '3px solid #FF9F68',
        boxShadow: '0 6px 16px rgba(8,24,40,0.34), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: size - 16,
      height: size - 16,
      viewBox: "0 0 40 40",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "20",
      cy: "20",
      r: "18",
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "2",
      strokeDasharray: "3 4"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#E97E45'
      }
    }, n)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -40,
        transform: 'translateX(-50%)',
        animation: 'gj-w7s-hop 1400ms ease-in-out infinite',
        filter: 'drop-shadow(0 4px 4px rgba(8,24,40,0.4))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "mint",
      size: 38,
      direction: "down",
      expression: "happy"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: size + 10,
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)',
        color: '#FFFFFF',
        border: '2px solid #E97E45',
        borderBottom: '3px solid #C8662F',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '5px 14px 6px',
        borderRadius: 999,
        boxShadow: '0 6px 12px rgba(201,102,47,0.4), inset 0 2px 0 rgba(255,197,154,0.6)',
        whiteSpace: 'nowrap'
      }
    }, "Ch\u01A1i ngay"));
  }
  function BreatherNode({
    n,
    size = 48
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -10,
        left: size + 8,
        background: '#FFFFFF',
        color: '#8C7458',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.10em',
        padding: '4px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 8px rgba(8,24,40,0.34)',
        whiteSpace: 'nowrap'
      }
    }, "NGH\u1EC8"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -6,
        left: size + 4,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#FFD074',
        border: '1.5px solid #E0A21F'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 6px rgba(8,24,40,0.36))',
        opacity: 0.92
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.30} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.55} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: size * 0.15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.28),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n)));
  }
  function BossNode({
    n,
    size = 80
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 8px 16px rgba(126,108,240,0.45))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -28,
        top: -28,
        right: -28,
        bottom: -28,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.6) 0%, rgba(126,108,240,0.32) 55%, rgba(126,108,240,0) 78%)',
        animation: 'gj-w7s-halo 2400ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement("svg", {
      width: size + 56,
      height: size + 56,
      viewBox: "0 0 200 200",
      style: {
        position: 'absolute',
        left: -28,
        top: -28,
        pointerEvents: 'none',
        animation: 'gj-w7s-spin 8s linear infinite',
        transformOrigin: '50% 50%'
      }
    }, [0, 60, 120, 180, 240, 300].map(a => {
      const rad = a * Math.PI / 180;
      const cx = 100 + Math.cos(rad) * 84;
      const cy = 100 + Math.sin(rad) * 84;
      return /*#__PURE__*/React.createElement("g", {
        key: a
      }, /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "4.5",
        fill: "#FFFFFF",
        opacity: "0.95"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "2.5",
        fill: "#A99CF6"
      }));
    })), /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)',
        border: '3px solid #FFFFFF',
        boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: Math.round(size * 0.28)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -22,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
        color: '#FFFFFF',
        border: '2px solid #6353D6',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: '0.16em',
        padding: '4px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)',
        whiteSpace: 'nowrap'
      }
    }, "BOSS"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: -22,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #EFE0C9',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '2px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(8,24,40,0.34)'
      }
    }, "m\xE0n ", n));
  }
  function PlaceNode({
    node
  }) {
    let inner = null,
      half = 32;
    if (node.kind === 'boss') {
      inner = /*#__PURE__*/React.createElement(BossNode, {
        n: node.id,
        size: 80
      });
      half = 40;
    } else if (node.kind === 'breather') {
      inner = /*#__PURE__*/React.createElement(BreatherNode, {
        n: node.id,
        size: 48
      });
      half = 24;
    } else if (node.state === 'current') {
      inner = /*#__PURE__*/React.createElement(CurrentNode, {
        n: node.id,
        size: 64
      });
      half = 32;
    } else if (node.state === 'done') {
      inner = /*#__PURE__*/React.createElement(DoneNode, {
        n: node.id,
        color: node.color,
        stars: node.stars,
        size: 64
      });
      half = 32;
    } else {
      inner = /*#__PURE__*/React.createElement(LockedRegularNode, {
        n: node.id,
        size: 60
      });
      half = 30;
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: node.x - half,
        top: node.y - half,
        zIndex: node.kind === 'boss' ? 14 : node.state === 'current' ? 12 : 5
      }
    }, inner);
  }

  // ─── gate to World 8 (Núi lửa) ────────────────────────────────────
  function GateBanner() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: GATE.y - 38,
        transform: 'translateX(-50%)',
        width: 312,
        background: '#FFFFFF',
        border: '1.5px solid #E8C6B0',
        borderRadius: 999,
        padding: '8px 14px 8px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 12px 28px rgba(120,50,20,0.3), 0 4px 8px rgba(120,92,52,0.14)',
        zIndex: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'radial-gradient(circle at 35% 25%, #C8543A 0%, #93351F 55%, #5A1E10 100%)',
        border: '2.5px solid #E8703F',
        boxShadow: 'inset 0 -3px 0 rgba(40,12,6,0.4), inset 0 3px 0 rgba(255,180,120,0.5), 0 2px 4px rgba(80,30,15,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "30",
      height: "30",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 21 L9 9 L15 9 L21 21 Z",
      fill: "#5A2A18",
      stroke: "#3A1810",
      strokeWidth: "1.2",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 9 L12 3 L15 9 Z",
      fill: "#FFC061",
      stroke: "#FF7A3D",
      strokeWidth: "1.2",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10.5 21 L12 13 L13.5 21 Z",
      fill: "#FF7A3D"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -6,
        right: -4,
        background: '#A8401F',
        border: '1.5px solid #E8703F',
        color: '#FFFFFF',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 11,
        padding: '2px 6px',
        borderRadius: 999,
        lineHeight: 1,
        boxShadow: '0 2px 3px rgba(80,30,15,0.3)'
      }
    }, "W8")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.05,
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.12em',
        color: '#9B886F',
        whiteSpace: 'nowrap'
      }
    }, "C\u1ED4NG \xB7 TH\u1EBE GI\u1EDAI 8"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#B5462E',
        whiteSpace: 'nowrap',
        lineHeight: 1.05
      }
    }, "N\xFAi l\u1EEDa")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
        border: '1.5px solid #E0A21F',
        padding: '6px 11px 7px 8px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 14
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: '#6A4A2E',
        lineHeight: 1
      }
    }, "120")));
  }
  function StartSign() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: H - 90,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#FFFFFF',
        color: '#2F6B83',
        border: '1.5px solid #BFD2E0',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        padding: '6px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(8,24,40,0.34)',
        textTransform: 'uppercase'
      }
    }, "Hang b\u0103ng \xB7 ti\u1EBFp t\u1EE5c"));
  }
  function World7Strip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-w7s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w7s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w7s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w7s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w7s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @keyframes gj-w7s-ember { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-7px);opacity:1} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `), /*#__PURE__*/React.createElement(Scene, null), /*#__PURE__*/React.createElement(PathLayer, null), /*#__PURE__*/React.createElement(GateBanner, null), NODES.map(n => /*#__PURE__*/React.createElement(PlaceNode, {
      key: n.id,
      node: n
    })), /*#__PURE__*/React.createElement(StartSign, null));
  }
  window.GJWorld7Strip = World7Strip;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world7-strip.jsx", error: String((e && e.message) || e) }); }

// 04-screens/world8-strip.jsx
try { (() => {
/* world8-strip.jsx — Dải cuộn ĐẦY ĐỦ World 8 "Núi lửa" (màn 71–80).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn, số node 71→80:
     • 71–75 node thường · 76 BREATHER · 77–79 thường · 80 BOSS
     • trên 80: CỔNG sang World 9 "Bầu trời" (chip ★ 130); nền trên cổng
       blend sang palette Bầu trời (#BBD3F7→#D8E6FB trời sáng, mây trắng)
   Biome World 8 (nhìn TỪ TRÊN XUỐNG): NÚI LỬA. GIỮA là NỀN NHAM THẠCH
   ấm phát sáng #E8C9A8→#B07F52 (hành lang x 72–290) cho đường + node, có
   khe nứt dung nham phát sáng len lỏi. HAI MÉP là VÁCH ĐÁ N�ham THẠCH tối
   #3A1C12→#5A3322 với khe dung nham #FF7A3D, miệng phun lửa, gai obsidian
   chĩa vào trong, đá magma. Trên nền: hồ dung nham, miệng phun lửa, gai
   obsidian, đá núi lửa, khói/tàn lửa bốc lên, mạch nham thạch. Mặt trên =
   BẦU TRỜI (W9 preview). Exposes window.GJWorld8Strip.                   */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const {
    JellyBlock
  } = NS;
  const NODES = [{
    id: 71,
    x: 130,
    y: 2440,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'mint'
  }, {
    id: 72,
    x: 240,
    y: 2250,
    kind: 'reg',
    state: 'done',
    stars: 2,
    color: 'blue'
  }, {
    id: 73,
    x: 110,
    y: 2060,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'pink'
  }, {
    id: 74,
    x: 240,
    y: 1870,
    kind: 'reg',
    state: 'current'
  }, {
    id: 75,
    x: 120,
    y: 1680,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 76,
    x: 240,
    y: 1490,
    kind: 'breather',
    state: 'locked'
  }, {
    id: 77,
    x: 110,
    y: 1290,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 78,
    x: 240,
    y: 1090,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 79,
    x: 150,
    y: 880,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 80,
    x: 180,
    y: 620,
    kind: 'boss',
    state: 'locked'
  }];
  const ENTRY = {
    x: 180,
    y: 2620
  };
  const GATE = {
    x: 180,
    y: 360
  };
  const EXIT = {
    x: 180,
    y: -40
  };
  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }
  const ALL_PTS = [ENTRY, ...NODES.map(n => ({
    x: n.x,
    y: n.y
  })), GATE, EXIT];
  const FULL_PATH = pathD(ALL_PTS);
  const WALKED = pathD([ENTRY, NODES[0], NODES[1], NODES[2]]);

  // ─── scene ────────────────────────────────────────────────────────
  function Scene() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "w8s-trail",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#EACFAE"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#D2A878"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#BC8C5E"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w8s-wall-l",
      x1: "0",
      y1: "0",
      x2: "1",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#2C120B"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#43251A"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#5A3322"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w8s-wall-r",
      x1: "1",
      y1: "0",
      x2: "0",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#2C120B"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#43251A"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#5A3322"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w8s-sky",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#9BBEF5"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.55",
      stopColor: "#BBD3F7"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#DCEAFB"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w8s-lava",
      cx: "0.5",
      cy: "0.5",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFE6A8",
      stopOpacity: "0.95"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.45",
      stopColor: "#FF7A3D",
      stopOpacity: "0.9"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#E0431F",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w8s-sun",
      cx: "0.5",
      cy: "0.5",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFF4D2",
      stopOpacity: "0.95"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#FFE08A",
      stopOpacity: "0.6"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#FFE08A",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w8s-vent",
      cx: "0.5",
      cy: "0.42",
      r: "0.55"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFE6A8",
      stopOpacity: "0.95"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#FF7A3D",
      stopOpacity: "0.55"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#E0431F",
      stopOpacity: "0"
    }))), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: H,
      fill: "url(#w8s-trail)"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: "200",
      fill: "url(#w8s-sky)"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 286,
      cy: 56,
      r: 90,
      fill: "url(#w8s-sun)"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 286,
      cy: 56,
      r: 26,
      fill: "#FFF1C2",
      stroke: "#FFE08A",
      strokeWidth: "3"
    }), /*#__PURE__*/React.createElement(SkyCloud, {
      cx: 84,
      cy: 86,
      s: 1.1
    }), /*#__PURE__*/React.createElement(SkyCloud, {
      cx: 210,
      cy: 140,
      s: 0.9
    }), /*#__PURE__*/React.createElement(SkyCloud, {
      cx: 300,
      cy: 150,
      s: 0.8
    }), /*#__PURE__*/React.createElement(SkyCloud, {
      cx: 140,
      cy: 44,
      s: 0.7
    }), [[60, 120], [180, 70], [250, 110], [330, 90], [110, 160], [30, 60]].map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
      key: `sk${i}`
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "1.8",
      fill: "#FFFFFF",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 12,
      cy: y + 14,
      r: "1.1",
      fill: "#FFFFFF",
      opacity: "0.8"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M0 188 q 90 22 180 6 t 180 14 L360 250 L0 250 Z",
      fill: "#7A4E33",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M0 196 q 90 20 180 6 t 180 14",
      fill: "none",
      stroke: "#FFB27A",
      strokeWidth: "3",
      opacity: "0.85",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M40 214 q 40 8 80 0",
      fill: "none",
      stroke: "#FF7A3D",
      strokeWidth: "2.5",
      opacity: "0.8",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M230 220 q 40 8 80 0",
      fill: "none",
      stroke: "#FF7A3D",
      strokeWidth: "2.5",
      opacity: "0.8",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement(RockWall, {
      side: "l"
    }), /*#__PURE__*/React.createElement(RockWall, {
      side: "r"
    }), /*#__PURE__*/React.createElement(BigVent, {
      x: 296,
      y: 430
    }), /*#__PURE__*/React.createElement(GroundCracks, null), [[150, 2120], [240, 1100], [120, 760]].map(([x, y], i) => /*#__PURE__*/React.createElement(LavaPool, {
      key: `lp${i}`,
      x: x,
      y: y
    })), [[286, 2360, 1], [88, 1980, 0], [288, 1580, 1], [150, 1620, 0], [98, 1180, 0]].map(([x, y], i) => /*#__PURE__*/React.createElement(FireVent, {
      key: `fv${i}`,
      x: x,
      y: y,
      delay: `${i * 0.4}s`
    })), [[96, 2300], [228, 1040], [286, 1320]].map(([x, y], i) => /*#__PURE__*/React.createElement(Obsidian, {
      key: `ob${i}`,
      x: x,
      y: y
    })), [[284, 2180], [110, 1700], [266, 880], [270, 2280], [262, 1180]].map(([x, y], i) => /*#__PURE__*/React.createElement(MagmaRock, {
      key: `mr${i}`,
      x: x,
      y: y,
      glow: i % 2 === 0
    })), [[300, 1430, '0s'], [70, 1320, '0.6s'], [296, 700, '1.1s'], [120, 1900, '1.5s']].map(([x, y, d], i) => /*#__PURE__*/React.createElement(Smoke, {
      key: `sm${i}`,
      x: x,
      y: y,
      delay: d
    })), [[300, 1170, '0s'], [56, 2000, '0.5s'], [240, 1480, '1s'], [160, 940, '0.7s'], [320, 2080, '1.3s']].map(([x, y, d], i) => /*#__PURE__*/React.createElement(Ember, {
      key: `eb${i}`,
      x: x,
      y: y,
      delay: d
    })), [[150, 2200], [120, 1500], [240, 1100], [160, 720], [200, 1900], [130, 1000]].map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
      key: `sp${i}`
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "1.6",
      fill: "#FFE6A8",
      opacity: "0.9"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 14,
      cy: y + 18,
      r: "1.1",
      fill: "#FFC061",
      opacity: "0.8"
    }))), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 1170,
      size: 20,
      color: "yellow",
      delay: "0s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 56,
      y: 2000,
      size: 22,
      color: "pink",
      delay: "0.8s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 2280,
      size: 18,
      color: "mint",
      delay: "1.4s"
    }));
  }

  // ── sky cloud (World 9 preview) ──
  function SkyCloud({
    cx,
    cy,
    s = 1
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 3px 4px rgba(120,150,200,0.25))'
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy,
      rx: 34 * s,
      ry: 15 * s,
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: cx - 18 * s,
      cy: cy - 2 * s,
      r: 13 * s,
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: cx - 2 * s,
      cy: cy - 9 * s,
      r: 16 * s,
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: cx + 16 * s,
      cy: cy - 3 * s,
      r: 12 * s,
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy + 9 * s,
      rx: 32 * s,
      ry: 8 * s,
      fill: "#E4EEFB",
      opacity: "0.85"
    }));
  }

  // ── lava vent acting as the upper light source ──
  function BigVent({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 0 18px rgba(255,122,61,0.6))'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: 130,
      fill: "url(#w8s-vent)",
      opacity: "0.5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: "54",
      ry: "40",
      fill: "#7A2A14",
      stroke: "#FF7A3D",
      strokeWidth: "3"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: "38",
      ry: "27",
      fill: "url(#w8s-lava)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - 12,
      cy: y - 8,
      rx: "16",
      ry: "10",
      fill: "#FFE6A8",
      opacity: "0.65"
    }));
  }

  // ── glowing lava cracks down the central ground ──
  function GroundCracks() {
    const segs = ['M150 2300 q 30 -120 -10 -240 q -30 -110 20 -230', 'M232 1820 q -28 -110 14 -210 q 28 -100 -10 -200', 'M150 1380 q 30 -120 -8 -230', 'M210 980 q -24 -110 12 -210'];
    return /*#__PURE__*/React.createElement("g", {
      opacity: "0.62"
    }, segs.map((d, i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: "#E0431F",
      strokeWidth: "5",
      strokeLinecap: "round",
      opacity: "0.55"
    }), /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: "#FF9F52",
      strokeWidth: "2",
      strokeLinecap: "round",
      opacity: "0.9"
    }))));
  }

  // ── volcano decorations on the warm ground ──
  function LavaPool({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 0 9px rgba(255,122,61,0.5))'
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: "36",
      ry: "16",
      fill: "#7A2A14",
      stroke: "#FF7A3D",
      strokeWidth: "2.5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: "25",
      ry: "10",
      fill: "url(#w8s-lava)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - 9,
      cy: y - 3,
      rx: "11",
      ry: "4.5",
      fill: "#FFE6A8",
      opacity: "0.6"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 10,
      cy: y + 1,
      r: "2.4",
      fill: "#FFC061",
      opacity: "0.85"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - 4,
      cy: y + 3,
      r: "1.6",
      fill: "#FFE6A8",
      opacity: "0.8"
    }));
  }
  function FireVent({
    x,
    y,
    delay = '0s'
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 0 7px rgba(255,122,61,0.55))'
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y + 8,
      rx: "16",
      ry: "6",
      fill: "#3A1C12",
      stroke: "#E0431F",
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y + 8,
      rx: "9",
      ry: "3",
      fill: "#FF7A3D"
    }), /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w8s-flame 900ms ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y + 8}px`
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - 26} q 11 14 7 26 q -2 6 -7 9 q -5 -3 -7 -9 q -4 -12 7 -26 Z`,
      fill: "#FF7A3D",
      stroke: "#E0431F",
      strokeWidth: "1",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - 14} q 6 8 3 16 q -3 4 -3 4 q 0 0 -3 -4 q -3 -8 3 -16 Z`,
      fill: "#FFC061"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - 4} q 2 4 0 8 q -2 -4 0 -8 Z`,
      fill: "#FFE6A8"
    })));
  }
  function Obsidian({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 0 5px rgba(255,80,40,0.4))'
      }
    }, [[-12, 24, 7], [2, 36, 9], [14, 20, 6]].map(([o, h, w], i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x + o} ${y - h} L ${x + o + w} ${y + 6} L ${x + o - w} ${y + 6} Z`,
      fill: i === 1 ? '#2A1714' : '#3A2018',
      stroke: "#1A0C08",
      strokeWidth: "1.2",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x + o} ${y - h} L ${x + o} ${y + 6}`,
      stroke: "#FF7A3D",
      strokeWidth: "1",
      opacity: "0.75"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x + o - w * 0.4} ${y - h * 0.5} L ${x + o} ${y - h} L ${x + o + w * 0.3} ${y - h * 0.4}`,
      fill: "none",
      stroke: "#6E4030",
      strokeWidth: "0.8",
      opacity: "0.7"
    }))), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y + 7,
      rx: "18",
      ry: "4",
      fill: "#E0431F",
      opacity: "0.22"
    }));
  }
  function MagmaRock({
    x,
    y,
    glow = false
  }) {
    const n = 7;
    const pts = [];
    const r = 20;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.72 : r;
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.86]);
    }
    const d = 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z';
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 3px 4px rgba(20,6,2,0.45))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "#3A1C12",
      stroke: "#21100A",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }), glow && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 12} ${y - 4} q 10 6 22 -2`,
      fill: "none",
      stroke: "#FF7A3D",
      strokeWidth: "2",
      strokeLinecap: "round",
      opacity: "0.85"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 6} ${y + 6} q 8 4 16 -2`,
      fill: "none",
      stroke: "#FF9F52",
      strokeWidth: "1.4",
      strokeLinecap: "round",
      opacity: "0.8"
    })), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y - r * 0.24,
      rx: r * 0.42,
      ry: r * 0.26,
      fill: "#5A3322",
      opacity: "0.7"
    }));
  }
  function Smoke({
    x,
    y,
    delay = '0s'
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w8s-smoke 4.4s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "11",
      fill: "#9B8A7C",
      opacity: "0.32"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - 8,
      cy: y + 6,
      r: "8",
      fill: "#A89A8C",
      opacity: "0.28"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 8,
      cy: y + 4,
      r: "9",
      fill: "#8F7F71",
      opacity: "0.26"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 2,
      cy: y - 8,
      r: "7",
      fill: "#B0A294",
      opacity: "0.24"
    }));
  }
  function Ember({
    x,
    y,
    delay = '0s'
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w8s-ember 2.8s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "2.6",
      fill: "#FFC061",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "5",
      fill: "#FF7A3D",
      opacity: "0.4"
    }));
  }
  function RockWall({
    side
  }) {
    // VÁCH ĐÁ NHAM THẠCH một mép — nền đá tối, mép trong uốn lượn có khe
    // dung nham phát sáng cam, gai obsidian chĩa vào trong, miệng phun lửa.
    const isL = side === 'l';
    const fill = isL ? 'url(#w8s-wall-l)' : 'url(#w8s-wall-r)';
    const X = v => isL ? v : W - v;
    const outerX = isL ? -24 : W + 24;
    const inset = i => [70, 56, 64, 58][i % 4];
    const pts = [];
    for (let y = 250, i = 0; y <= H + 40; y += 150, i++) {
      pts.push([X(inset(i)), y, i]);
    }
    let d = `M ${outerX} 250 L ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      const my = (py + y) / 2;
      d += `Q ${px} ${my} ${x} ${y} `;
    }
    d += `L ${outerX} ${H + 40} Z`;
    let edge = `M ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      edge += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    // inward-pointing obsidian spikes packed along the wall
    const spikes = [];
    for (let y = 300, i = 0; y < H; y += 104, i++) {
      const ix = inset(Math.round((y - 250) / 150));
      spikes.push(/*#__PURE__*/React.createElement(WallSpike, {
        key: `ws${i}`,
        bx: X(ix),
        y: y,
        dir: isL ? 1 : -1,
        len: 16 + i % 3 * 7
      }));
    }
    // embedded glow vents
    const vents = [];
    for (let y = 420, i = 0; y < H; y += 360, i++) {
      vents.push(/*#__PURE__*/React.createElement("circle", {
        key: `wo${i}`,
        cx: X(34),
        cy: y,
        r: i % 2 ? 6 : 8,
        fill: "url(#w8s-vent)",
        opacity: "0.85"
      }));
    }
    // lava-vein cracks on the wall
    const veins = [];
    for (let y = 360, i = 0; y < H; y += 240, i++) {
      const vx = X(40 + i % 2 * 10);
      veins.push(/*#__PURE__*/React.createElement("path", {
        key: `wv${i}`,
        d: `M ${vx} ${y - 30} q ${isL ? 14 : -14} 20 ${isL ? -6 : 6} 44 q ${isL ? 12 : -12} 18 ${isL ? 4 : -4} 40`,
        fill: "none",
        stroke: "#FF7A3D",
        strokeWidth: "2",
        strokeLinecap: "round",
        opacity: "0.7"
      }));
    }
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: fill
    }), veins, vents, spikes, /*#__PURE__*/React.createElement("path", {
      d: edge,
      fill: "none",
      stroke: "#E0431F",
      strokeWidth: "9",
      opacity: "0.4",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: edge,
      fill: "none",
      stroke: "#FFB27A",
      strokeWidth: "3",
      opacity: "0.8",
      strokeLinecap: "round"
    }));
  }
  function WallSpike({
    bx,
    y,
    dir,
    len = 18
  }) {
    // gai obsidian chĩa vào trong lối đi (từ mép)
    const tip = bx + dir * len;
    const w = 6 + len * 0.18;
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 0 4px rgba(255,80,40,0.4))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${tip} ${y} L ${bx} ${y - w} L ${bx - dir * 6} ${y} L ${bx} ${y + w} Z`,
      fill: "#2A1714",
      stroke: "#1A0C08",
      strokeWidth: "1.1",
      strokeLinejoin: "round",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${tip} ${y} L ${bx} ${y}`,
      stroke: "#FF7A3D",
      strokeWidth: "0.9",
      opacity: "0.7"
    }));
  }
  function FloatJelly({
    x,
    y,
    size,
    color,
    delay
  }) {
    const p = {
      yellow: {
        f: '#FFE3A3',
        e: '#E8B85C',
        s: '#FFF1CE'
      },
      mint: {
        f: '#A3E5D9',
        e: '#5FC3B2',
        s: '#CBF2EB'
      },
      pink: {
        f: '#F7A9C0',
        e: '#E576A0',
        s: '#FBD0DF'
      },
      blue: {
        f: '#B3C7F7',
        e: '#7E9CE8',
        s: '#D6E1FB'
      }
    }[color] || {
      f: '#FFE3A3',
      e: '#E8B85C',
      s: '#FFF1CE'
    };
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w8s-float 3.6s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`,
        filter: 'drop-shadow(0 4px 4px rgba(80,40,20,0.4))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
      rx: Math.round(size * 0.28),
      fill: p.f,
      stroke: p.e,
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y - size * 0.18,
      rx: size * 0.34,
      ry: size * 0.12,
      fill: p.s,
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }));
  }

  // ─── path ─────────────────────────────────────────────────────────
  function PathLayer() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "rgba(60,28,18,0.24)",
      strokeWidth: "34",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      transform: "translate(0,4)"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#8A6147",
      strokeWidth: "30",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#D9B58C",
      strokeWidth: "26",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#FF9F52",
      strokeWidth: "3.5",
      strokeLinecap: "round",
      strokeDasharray: "7 11"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FF9F68",
      strokeWidth: "20",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "6",
      strokeLinecap: "round",
      strokeDasharray: "4 9",
      opacity: "0.9"
    }));
  }

  // ─── stars / node primitives (shared) ────────────────────────────
  function Star({
    filled = false,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z",
      fill: filled ? '#FFC23D' : '#D8B79A',
      stroke: filled ? '#E0A21F' : '#B58E6E',
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }));
  }
  function StarArc({
    stars = 3,
    size = 14,
    width = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -size - 6,
        transform: 'translateX(-50%)',
        width,
        height: size + 8,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(-22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-2px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }
  function NumberBadge({
    n,
    size,
    color = '#6A4A2E'
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        lineHeight: 1,
        color,
        textShadow: '0 1px 0 rgba(255,255,255,0.55)',
        pointerEvents: 'none'
      }
    }, n);
  }
  function LockGlyph({
    size = 18
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M8 11V8.5a4 4 0 1 1 8 0V11",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "2.6",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "11",
      width: "14",
      height: "9",
      rx: "2.5",
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "15",
      r: "1.4",
      fill: "#A89A82"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "11.3",
      y: "15",
      width: "1.4",
      height: "3",
      rx: "0.6",
      fill: "#A89A82"
    }));
  }
  function DoneNode({
    n,
    color,
    stars,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 5px 8px rgba(60,28,18,0.42))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: color,
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement(NumberBadge, {
      n: n,
      size: size
    }), /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 14,
      width: size + 14
    }));
  }
  function LockedRegularNode({
    n,
    size = 60
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 6px rgba(60,28,18,0.4))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n), /*#__PURE__*/React.createElement(StarArc, {
      stars: 0,
      size: 12,
      width: size + 8
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -4,
        bottom: -4,
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: '#8A7B62',
        border: '2px solid #FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(60,28,18,0.45)'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: 13
    })));
  }
  function CurrentNode({
    n,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -16,
        top: -16,
        width: size + 32,
        height: size + 32,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.26)',
        animation: 'gj-w8s-pulse 1600ms ease-out infinite'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -5,
        top: -5,
        width: size + 10,
        height: size + 10,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.36)',
        animation: 'gj-w8s-pulse 1600ms ease-out infinite',
        animationDelay: '320ms'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#FFFFFF',
        border: '3px solid #FF9F68',
        boxShadow: '0 6px 16px rgba(60,28,18,0.38), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: size - 16,
      height: size - 16,
      viewBox: "0 0 40 40",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "20",
      cy: "20",
      r: "18",
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "2",
      strokeDasharray: "3 4"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#E97E45'
      }
    }, n)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -40,
        transform: 'translateX(-50%)',
        animation: 'gj-w8s-hop 1400ms ease-in-out infinite',
        filter: 'drop-shadow(0 4px 4px rgba(60,28,18,0.4))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "yellow",
      size: 38,
      direction: "down",
      expression: "happy"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: size + 10,
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)',
        color: '#FFFFFF',
        border: '2px solid #E97E45',
        borderBottom: '3px solid #C8662F',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '5px 14px 6px',
        borderRadius: 999,
        boxShadow: '0 6px 12px rgba(201,102,47,0.4), inset 0 2px 0 rgba(255,197,154,0.6)',
        whiteSpace: 'nowrap'
      }
    }, "Ch\u01A1i ngay"));
  }
  function BreatherNode({
    n,
    size = 48
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -10,
        left: size + 8,
        background: '#FFFFFF',
        color: '#8C7458',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.10em',
        padding: '4px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 8px rgba(60,28,18,0.36)',
        whiteSpace: 'nowrap'
      }
    }, "NGH\u1EC8"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -6,
        left: size + 4,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#FFD074',
        border: '1.5px solid #E0A21F'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 6px rgba(60,28,18,0.4))',
        opacity: 0.92
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.30} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.55} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: size * 0.15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.28),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n)));
  }
  function BossNode({
    n,
    size = 80
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 8px 16px rgba(126,108,240,0.45))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -28,
        top: -28,
        right: -28,
        bottom: -28,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.6) 0%, rgba(126,108,240,0.32) 55%, rgba(126,108,240,0) 78%)',
        animation: 'gj-w8s-halo 2400ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement("svg", {
      width: size + 56,
      height: size + 56,
      viewBox: "0 0 200 200",
      style: {
        position: 'absolute',
        left: -28,
        top: -28,
        pointerEvents: 'none',
        animation: 'gj-w8s-spin 8s linear infinite',
        transformOrigin: '50% 50%'
      }
    }, [0, 60, 120, 180, 240, 300].map(a => {
      const rad = a * Math.PI / 180;
      const cx = 100 + Math.cos(rad) * 84;
      const cy = 100 + Math.sin(rad) * 84;
      return /*#__PURE__*/React.createElement("g", {
        key: a
      }, /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "4.5",
        fill: "#FFFFFF",
        opacity: "0.95"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "2.5",
        fill: "#A99CF6"
      }));
    })), /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)',
        border: '3px solid #FFFFFF',
        boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: Math.round(size * 0.28)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -22,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
        color: '#FFFFFF',
        border: '2px solid #6353D6',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: '0.16em',
        padding: '4px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)',
        whiteSpace: 'nowrap'
      }
    }, "BOSS"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: -22,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #EFE0C9',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '2px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(60,28,18,0.36)'
      }
    }, "m\xE0n ", n));
  }
  function PlaceNode({
    node
  }) {
    let inner = null,
      half = 32;
    if (node.kind === 'boss') {
      inner = /*#__PURE__*/React.createElement(BossNode, {
        n: node.id,
        size: 80
      });
      half = 40;
    } else if (node.kind === 'breather') {
      inner = /*#__PURE__*/React.createElement(BreatherNode, {
        n: node.id,
        size: 48
      });
      half = 24;
    } else if (node.state === 'current') {
      inner = /*#__PURE__*/React.createElement(CurrentNode, {
        n: node.id,
        size: 64
      });
      half = 32;
    } else if (node.state === 'done') {
      inner = /*#__PURE__*/React.createElement(DoneNode, {
        n: node.id,
        color: node.color,
        stars: node.stars,
        size: 64
      });
      half = 32;
    } else {
      inner = /*#__PURE__*/React.createElement(LockedRegularNode, {
        n: node.id,
        size: 60
      });
      half = 30;
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: node.x - half,
        top: node.y - half,
        zIndex: node.kind === 'boss' ? 14 : node.state === 'current' ? 12 : 5
      }
    }, inner);
  }

  // ─── gate to World 9 (Bầu trời) ───────────────────────────────────
  function GateBanner() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: GATE.y - 38,
        transform: 'translateX(-50%)',
        width: 312,
        background: '#FFFFFF',
        border: '1.5px solid #BFD2E0',
        borderRadius: 999,
        padding: '8px 14px 8px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 12px 28px rgba(40,80,140,0.28), 0 4px 8px rgba(120,92,52,0.14)',
        zIndex: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'radial-gradient(circle at 35% 25%, #DCEAFB 0%, #9BBEF5 55%, #6E94E0 100%)',
        border: '2.5px solid #8FB6F2',
        boxShadow: 'inset 0 -3px 0 rgba(60,90,150,0.3), inset 0 3px 0 rgba(255,255,255,0.6), 0 2px 4px rgba(60,90,150,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "30",
      height: "30",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "16",
      cy: "8",
      r: "4",
      fill: "#FFE08A",
      stroke: "#FFC23D",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 17 a4 4 0 0 1 0.4 -7.96 a5 5 0 0 1 9.4 1.2 a3.5 3.5 0 0 1 -0.3 6.76 Z",
      fill: "#FFFFFF",
      stroke: "#BBD3F7",
      strokeWidth: "1.1",
      strokeLinejoin: "round"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -6,
        right: -4,
        background: '#6E94E0',
        border: '1.5px solid #9BBEF5',
        color: '#FFFFFF',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 11,
        padding: '2px 6px',
        borderRadius: 999,
        lineHeight: 1,
        boxShadow: '0 2px 3px rgba(60,90,150,0.3)'
      }
    }, "W9")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.05,
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.12em',
        color: '#9B886F',
        whiteSpace: 'nowrap'
      }
    }, "C\u1ED4NG \xB7 TH\u1EBE GI\u1EDAI 9"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#3F6FB5',
        whiteSpace: 'nowrap',
        lineHeight: 1.05
      }
    }, "B\u1EA7u tr\u1EDDi")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
        border: '1.5px solid #E0A21F',
        padding: '6px 11px 7px 8px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 14
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: '#6A4A2E',
        lineHeight: 1
      }
    }, "130")));
  }
  function StartSign() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: H - 90,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#FFFFFF',
        color: '#B5462E',
        border: '1.5px solid #F0C3A8',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        padding: '6px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(60,28,18,0.36)',
        textTransform: 'uppercase'
      }
    }, "N\xFAi l\u1EEDa \xB7 ti\u1EBFp t\u1EE5c"));
  }
  function World8Strip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-w8s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w8s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w8s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w8s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w8s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @keyframes gj-w8s-ember { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-8px);opacity:1} }
          @keyframes gj-w8s-flame { 0%,100%{transform:scaleY(1) scaleX(1)} 50%{transform:scaleY(1.16) scaleX(0.9)} }
          @keyframes gj-w8s-smoke { 0%{transform:translateY(0) scale(0.9);opacity:0.0} 25%{opacity:0.4} 100%{transform:translateY(-30px) scale(1.3);opacity:0} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `), /*#__PURE__*/React.createElement(Scene, null), /*#__PURE__*/React.createElement(PathLayer, null), /*#__PURE__*/React.createElement(GateBanner, null), NODES.map(n => /*#__PURE__*/React.createElement(PlaceNode, {
      key: n.id,
      node: n
    })), /*#__PURE__*/React.createElement(StartSign, null));
  }
  window.GJWorld8Strip = World8Strip;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world8-strip.jsx", error: String((e && e.message) || e) }); }

// 04-screens/world9-strip.jsx
try { (() => {
/* world9-strip.jsx — Dải cuộn ĐẦY ĐỦ World 9 "Bầu trời" (màn 81–90).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn = CẦU MÂY / cầu vồng nối các ĐẢO TRỜI, số node 81→90:
     • 81–85 node thường · 86 BREATHER · 87–89 thường · 90 BOSS
     • trên 90: CỔNG sang World 10 "Vũ trụ" (chip ★ 150); nền trên cổng
       blend sang palette Vũ trụ (#2A1B5E→#3A2A7A trời đêm, sao, tinh vân)
   Biome World 9 (nhìn TỪ TRÊN/giữa mây): BẦU TRỜI. GIỮA là HÀNH LANG TRỜI
   SÁNG #DCEAFB→#BBD3F7 cho đường + node, có cầu mây trắng nối các đảo. HAI
   MÉP là BỜ MÂY cumulus dày #FFFFFF/#E4EEFB cuộn vào trong + đảo trời cỏ
   xanh trôi nổi. Trên nền: đảo trời cỏ xanh có thác mây, cầu vồng, mặt
   trời ấm (nguồn sáng), khinh khí cầu, đàn chim, lấp lánh. Mặt trên = VŨ
   TRỤ (W10 preview). Exposes window.GJWorld9Strip.                       */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const {
    JellyBlock
  } = NS;
  const NODES = [{
    id: 81,
    x: 130,
    y: 2440,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'mint'
  }, {
    id: 82,
    x: 240,
    y: 2250,
    kind: 'reg',
    state: 'done',
    stars: 2,
    color: 'blue'
  }, {
    id: 83,
    x: 110,
    y: 2060,
    kind: 'reg',
    state: 'done',
    stars: 3,
    color: 'pink'
  }, {
    id: 84,
    x: 240,
    y: 1870,
    kind: 'reg',
    state: 'current'
  }, {
    id: 85,
    x: 120,
    y: 1680,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 86,
    x: 240,
    y: 1490,
    kind: 'breather',
    state: 'locked'
  }, {
    id: 87,
    x: 110,
    y: 1290,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 88,
    x: 240,
    y: 1090,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 89,
    x: 150,
    y: 880,
    kind: 'reg',
    state: 'locked'
  }, {
    id: 90,
    x: 180,
    y: 620,
    kind: 'boss',
    state: 'locked'
  }];
  const ENTRY = {
    x: 180,
    y: 2620
  };
  const GATE = {
    x: 180,
    y: 360
  };
  const EXIT = {
    x: 180,
    y: -40
  };
  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }
  const ALL_PTS = [ENTRY, ...NODES.map(n => ({
    x: n.x,
    y: n.y
  })), GATE, EXIT];
  const FULL_PATH = pathD(ALL_PTS);
  const WALKED = pathD([ENTRY, NODES[0], NODES[1], NODES[2]]);

  // ─── scene ────────────────────────────────────────────────────────
  function Scene() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "w9s-trail",
      x1: "0",
      y1: "1",
      x2: "0",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#E4EFFC"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#C7DCF7"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#A6C4F2"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w9s-bank-l",
      x1: "0",
      y1: "0",
      x2: "1",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#EFF5FF"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#D7E5FB"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w9s-bank-r",
      x1: "1",
      y1: "0",
      x2: "0",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.7",
      stopColor: "#EFF5FF"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#D7E5FB"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w9s-space",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#241765"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.55",
      stopColor: "#33237A"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#5B4BAE"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w9s-nebula",
      cx: "0.5",
      cy: "0.5",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#C4A7FF",
      stopOpacity: "0.8"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#8A6CF0",
      stopOpacity: "0.4"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#6353D6",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("radialGradient", {
      id: "w9s-sun",
      cx: "0.5",
      cy: "0.5",
      r: "0.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFF7DA",
      stopOpacity: "0.95"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.5",
      stopColor: "#FFE08A",
      stopOpacity: "0.55"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#FFE08A",
      stopOpacity: "0"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w9s-grass",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#9BE08C"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#6FC97F"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "w9s-island",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#CDA9E8"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#9B7FD6"
    }))), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: H,
      fill: "url(#w9s-trail)"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: W,
      height: "200",
      fill: "url(#w9s-space)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 92,
      cy: 70,
      rx: 120,
      ry: 80,
      fill: "url(#w9s-nebula)"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 292,
      cy: 66,
      r: 34,
      fill: "#8E7CF4",
      stroke: "#A99CF6",
      strokeWidth: "2.5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 292,
      cy: 66,
      rx: 52,
      ry: 15,
      fill: "none",
      stroke: "#C4B5FA",
      strokeWidth: "3",
      opacity: "0.8",
      transform: "rotate(-18 292 66)"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 284,
      cy: 58,
      rx: 11,
      ry: 7,
      fill: "#B6A6F8",
      opacity: "0.7"
    }), [[40, 110, 1.9], [120, 150, 1.4], [180, 60, 2.1], [230, 130, 1.5], [330, 120, 1.8], [70, 60, 1.4], [150, 110, 1.6], [260, 70, 1.3], [20, 150, 1.4], [200, 170, 1.7], [310, 170, 1.4], [100, 40, 1.5]].map(([x, y, r], i) => /*#__PURE__*/React.createElement("g", {
      key: `st${i}`,
      style: {
        animation: 'gj-w9s-tw 2200ms ease-in-out infinite',
        animationDelay: `${i * 0.2}s`,
        transformOrigin: `${x}px ${y}px`
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r,
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: r * 2.6,
      fill: "#FFFFFF",
      opacity: "0.18"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M0 192 q 90 26 180 8 t 180 16 L360 250 L0 250 Z",
      fill: "#7FA6EE",
      opacity: "0.55"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M0 200 q 90 24 180 8 t 180 16",
      fill: "none",
      stroke: "#DCEAFB",
      strokeWidth: "3",
      opacity: "0.9",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M0 208 q 90 22 180 8 t 180 14",
      fill: "none",
      stroke: "#A99CF6",
      strokeWidth: "2",
      opacity: "0.65",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement(CloudBank, {
      side: "l"
    }), /*#__PURE__*/React.createElement(CloudBank, {
      side: "r"
    }), /*#__PURE__*/React.createElement(BigSun, {
      x: 296,
      y: 430
    }), /*#__PURE__*/React.createElement(Rainbow, {
      cx: 150,
      cy: 2120,
      w: 150,
      flip: false
    }), /*#__PURE__*/React.createElement(Rainbow, {
      cx: 240,
      cy: 1380,
      w: 130,
      flip: true
    }), /*#__PURE__*/React.createElement(Rainbow, {
      cx: 150,
      cy: 760,
      w: 140,
      flip: false
    }), [[286, 2340, 1.05], [80, 1980, 0.92], [292, 1600, 1.0], [96, 1180, 0.9], [288, 880, 0.86], [150, 2200, 0.78]].map(([x, y, s], i) => /*#__PURE__*/React.createElement(SkyIsland, {
      key: `si${i}`,
      x: x,
      y: y,
      s: s,
      delay: `${i * 0.5}s`
    })), [[300, 1430, 1.0, '0s'], [70, 1320, 0.85, '0.6s'], [296, 700, 0.9, '1.1s'], [120, 1700, 0.8, '1.5s'], [240, 1040, 0.75, '0.3s'], [60, 2080, 0.9, '0.9s']].map(([x, y, s, d], i) => /*#__PURE__*/React.createElement(DriftCloud, {
      key: `dc${i}`,
      cx: x,
      cy: y,
      s: s,
      delay: d
    })), [[100, 1500, 'pink', '0s'], [270, 1820, 'yellow', '0.7s'], [120, 980, 'mint', '1.2s']].map(([x, y, c, d], i) => /*#__PURE__*/React.createElement(Balloon, {
      key: `ba${i}`,
      x: x,
      y: y,
      color: c,
      delay: d
    })), [[60, 1240, '0s'], [300, 2060, '0.8s'], [80, 700, '1.3s'], [250, 1620, '0.4s']].map(([x, y, d], i) => /*#__PURE__*/React.createElement(Birds, {
      key: `bd${i}`,
      x: x,
      y: y,
      delay: d
    })), [[150, 2280], [120, 1560], [240, 1140], [160, 760], [200, 1940], [130, 1020], [280, 1300]].map(([x, y], i) => /*#__PURE__*/React.createElement("g", {
      key: `sp${i}`
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "1.8",
      fill: "#FFFFFF",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + 14,
      cy: y + 18,
      r: "1.1",
      fill: "#FFF4DC",
      opacity: "0.85"
    }))), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 1170,
      size: 20,
      color: "blue",
      delay: "0s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 56,
      y: 2000,
      size: 22,
      color: "pink",
      delay: "0.8s"
    }), /*#__PURE__*/React.createElement(FloatJelly, {
      x: 300,
      y: 2280,
      size: 18,
      color: "mint",
      delay: "1.4s"
    }));
  }

  // ── big warm sun acting as the upper light source ──
  function BigSun({
    x,
    y
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        filter: 'drop-shadow(0 0 16px rgba(255,224,138,0.6))'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: 130,
      fill: "url(#w9s-sun)",
      opacity: "0.55"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: 36,
      fill: "#FFF1C2",
      stroke: "#FFD074",
      strokeWidth: "3"
    }), /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w9s-spin 26s linear infinite',
        transformOrigin: `${x}px ${y}px`
      }
    }, [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
      const rad = a * Math.PI / 180;
      const x1 = x + Math.cos(rad) * 46,
        y1 = y + Math.sin(rad) * 46;
      const x2 = x + Math.cos(rad) * 60,
        y2 = y + Math.sin(rad) * 60;
      return /*#__PURE__*/React.createElement("line", {
        key: a,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stroke: "#FFD074",
        strokeWidth: "4",
        strokeLinecap: "round",
        opacity: "0.85"
      });
    })), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - 11,
      cy: y - 9,
      rx: 13,
      ry: 9,
      fill: "#FFFCEC",
      opacity: "0.7"
    }));
  }

  // ── rainbow arc ──
  function Rainbow({
    cx,
    cy,
    w,
    flip
  }) {
    const bands = ['#F7A9C0', '#FFC061', '#FFE08A', '#9BE08C', '#8FB6F2', '#A99CF6'];
    const r0 = w / 2;
    const sweep = flip ? 0 : 1;
    return /*#__PURE__*/React.createElement("g", {
      opacity: "0.78",
      style: {
        filter: 'drop-shadow(0 3px 5px rgba(80,110,170,0.18))'
      }
    }, bands.map((c, i) => {
      const r = r0 - i * 6;
      const y = cy;
      return /*#__PURE__*/React.createElement("path", {
        key: i,
        d: `M ${cx - r} ${y} A ${r} ${r} 0 0 ${sweep} ${cx + r} ${y}`,
        fill: "none",
        stroke: c,
        strokeWidth: "5",
        strokeLinecap: "round"
      });
    }), /*#__PURE__*/React.createElement(DriftCloud, {
      cx: cx - r0 + 4,
      cy: cy,
      s: 0.6,
      delay: "0s"
    }), /*#__PURE__*/React.createElement(DriftCloud, {
      cx: cx + r0 - 4,
      cy: cy,
      s: 0.6,
      delay: "0s"
    }));
  }

  // ── fluffy drifting cloud ──
  function DriftCloud({
    cx,
    cy,
    s = 1,
    delay = '0s'
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w9s-drift 7s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${cx}px ${cy}px`,
        filter: 'drop-shadow(0 4px 6px rgba(90,120,180,0.22))'
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy,
      rx: 36 * s,
      ry: 16 * s,
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: cx - 19 * s,
      cy: cy - 2 * s,
      r: 14 * s,
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: cx - 2 * s,
      cy: cy - 10 * s,
      r: 17 * s,
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: cx + 17 * s,
      cy: cy - 3 * s,
      r: 13 * s,
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: cx,
      cy: cy + 10 * s,
      rx: 34 * s,
      ry: 8 * s,
      fill: "#E2ECFB",
      opacity: "0.85"
    }));
  }

  // ── floating grass-topped sky island ──
  function SkyIsland({
    x,
    y,
    s = 1,
    delay = '0s'
  }) {
    const w = 64 * s;
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w9s-bob 5s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`,
        filter: 'drop-shadow(0 8px 10px rgba(80,110,170,0.22))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x - w / 2} ${y} Q ${x - w / 2 - 6} ${y + 26 * s} ${x - w * 0.18} ${y + 40 * s} Q ${x} ${y + 54 * s} ${x + w * 0.2} ${y + 38 * s} Q ${x + w / 2 + 6} ${y + 24 * s} ${x + w / 2} ${y} Z`,
      fill: "url(#w9s-island)",
      stroke: "#7E66C6",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y,
      rx: w / 2,
      ry: 13 * s,
      fill: "url(#w9s-grass)",
      stroke: "#56B36A",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - w * 0.16,
      cy: y - 3 * s,
      rx: w * 0.22,
      ry: 5 * s,
      fill: "#B6EDA5",
      opacity: "0.8"
    }), [-0.3, -0.05, 0.18, 0.34].map((o, i) => /*#__PURE__*/React.createElement("path", {
      key: i,
      d: `M ${x + w * o} ${y - 3 * s} q 2 -7 0 -11`,
      fill: "none",
      stroke: "#56B36A",
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - w * 0.32} ${y + 6 * s} q -3 16 1 30`,
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: 4 * s,
      strokeLinecap: "round",
      opacity: "0.75"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - w * 0.30,
      cy: y + 38 * s,
      r: 4 * s,
      fill: "#FFFFFF",
      opacity: "0.7"
    }));
  }

  // ── hot-air balloon ──
  function Balloon({
    x,
    y,
    color,
    delay = '0s'
  }) {
    const p = {
      yellow: {
        f: '#FFE3A3',
        e: '#E8B85C'
      },
      mint: {
        f: '#A3E5D9',
        e: '#5FC3B2'
      },
      pink: {
        f: '#F7A9C0',
        e: '#E576A0'
      },
      blue: {
        f: '#B3C7F7',
        e: '#7E9CE8'
      }
    }[color] || {
      f: '#FFE3A3',
      e: '#E8B85C'
    };
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w9s-bob 6s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`,
        filter: 'drop-shadow(0 6px 8px rgba(80,110,170,0.24))'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - 24} C ${x - 22} ${y - 24} ${x - 20} ${y + 4} ${x - 6} ${y + 18} L ${x + 6} ${y + 18} C ${x + 20} ${y + 4} ${x + 22} ${y - 24} ${x} ${y - 24} Z`,
      fill: p.f,
      stroke: p.e,
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x} ${y - 24} C ${x - 8} ${y - 24} ${x - 7} ${y + 6} ${x} ${y + 18} C ${x + 7} ${y + 6} ${x + 8} ${y - 24} ${x} ${y - 24} Z`,
      fill: "#FFFFFF",
      opacity: "0.4"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x - 7,
      cy: y - 16,
      rx: "4",
      ry: "6",
      fill: "#FFFFFF",
      opacity: "0.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${x - 6} ${y + 18} L ${x - 4} ${y + 27} M ${x + 6} ${y + 18} L ${x + 4} ${y + 27}`,
      stroke: p.e,
      strokeWidth: "1.2"
    }), /*#__PURE__*/React.createElement("rect", {
      x: x - 5,
      y: y + 27,
      width: "10",
      height: "7",
      rx: "2",
      fill: "#C58A52",
      stroke: "#9C6B3C",
      strokeWidth: "1.2"
    }));
  }

  // ── bird flock ──
  function Birds({
    x,
    y,
    delay = '0s'
  }) {
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w9s-fly 4s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`
      },
      opacity: "0.7"
    }, [[0, 0, 1], [18, 6, 0.8], [-16, 7, 0.8]].map(([dx, dy, sc], i) => /*#__PURE__*/React.createElement("path", {
      key: i,
      d: `M ${x + dx - 7 * sc} ${y + dy} q ${7 * sc} -6 ${7 * sc} 0 q 0 -6 ${7 * sc} 0`,
      fill: "none",
      stroke: "#5B6B8C",
      strokeWidth: "1.8",
      strokeLinecap: "round"
    })));
  }
  function CloudBank({
    side
  }) {
    // BỜ MÂY một mép — cumulus dày cuộn vào trong, mép trong uốn lượn, có
    // đảo trời nhỏ + lấp lánh nắng.
    const isL = side === 'l';
    const fill = isL ? 'url(#w9s-bank-l)' : 'url(#w9s-bank-r)';
    const X = v => isL ? v : W - v;
    const outerX = isL ? -24 : W + 24;
    const inset = i => [72, 56, 66, 58][i % 4];
    const pts = [];
    for (let y = 250, i = 0; y <= H + 40; y += 150, i++) {
      pts.push([X(inset(i)), y, i]);
    }
    let d = `M ${outerX} 250 L ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      const my = (py + y) / 2;
      d += `Q ${px} ${my} ${x} ${y} `;
    }
    d += `L ${outerX} ${H + 40} Z`;
    let edge = `M ${pts[0][0]} ${pts[0][1]} `;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1],
        [x, y] = pts[i];
      edge += `Q ${px} ${(py + y) / 2} ${x} ${y} `;
    }
    // puffy cloud lobes bulging inward along the bank
    const lobes = [];
    for (let y = 290, i = 0; y < H; y += 96, i++) {
      const ix = inset(Math.round((y - 250) / 150));
      const r = 18 + i % 3 * 7;
      lobes.push(/*#__PURE__*/React.createElement("circle", {
        key: `cl${i}`,
        cx: X(ix - r * 0.4),
        cy: y,
        r: r,
        fill: "#FFFFFF",
        opacity: "0.96"
      }));
    }
    // soft sun sparkles tucked in the bank
    const glints = [];
    for (let y = 420, i = 0; y < H; y += 300, i++) {
      glints.push(/*#__PURE__*/React.createElement("g", {
        key: `gl${i}`,
        style: {
          animation: 'gj-w9s-tw 2400ms ease-in-out infinite',
          animationDelay: `${i * 0.3}s`,
          transformOrigin: `${X(36)}px ${y}px`
        }
      }, /*#__PURE__*/React.createElement("circle", {
        cx: X(36),
        cy: y,
        r: i % 2 ? 2.2 : 3,
        fill: "#FFF4DC"
      })));
    }
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: fill
    }), lobes, glints, /*#__PURE__*/React.createElement("path", {
      d: edge,
      fill: "none",
      stroke: "#BCD3F4",
      strokeWidth: "8",
      opacity: "0.32",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: edge,
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "3",
      opacity: "0.9",
      strokeLinecap: "round"
    }));
  }
  function FloatJelly({
    x,
    y,
    size,
    color,
    delay
  }) {
    const p = {
      yellow: {
        f: '#FFE3A3',
        e: '#E8B85C',
        s: '#FFF1CE'
      },
      mint: {
        f: '#A3E5D9',
        e: '#5FC3B2',
        s: '#CBF2EB'
      },
      pink: {
        f: '#F7A9C0',
        e: '#E576A0',
        s: '#FBD0DF'
      },
      blue: {
        f: '#B3C7F7',
        e: '#7E9CE8',
        s: '#D6E1FB'
      }
    }[color] || {
      f: '#FFE3A3',
      e: '#E8B85C',
      s: '#FFF1CE'
    };
    return /*#__PURE__*/React.createElement("g", {
      style: {
        animation: 'gj-w9s-float 3.6s ease-in-out infinite',
        animationDelay: delay,
        transformOrigin: `${x}px ${y}px`,
        filter: 'drop-shadow(0 4px 4px rgba(80,110,170,0.3))'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
      rx: Math.round(size * 0.28),
      fill: p.f,
      stroke: p.e,
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y - size * 0.18,
      rx: size * 0.34,
      ry: size * 0.12,
      fill: p.s,
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x - size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x + size * 0.18,
      cy: y - size * 0.04,
      r: size * 0.07,
      fill: "#3B2A18"
    }));
  }

  // ─── path ─────────────────────────────────────────────────────────
  function PathLayer() {
    return /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      style: {
        position: 'absolute',
        inset: 0,
        display: 'block',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "rgba(90,120,180,0.20)",
      strokeWidth: "34",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      transform: "translate(0,5)"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#C9DCF5",
      strokeWidth: "30",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#EFF6FF",
      strokeWidth: "26",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: FULL_PATH,
      fill: "none",
      stroke: "#9BB8EC",
      strokeWidth: "3.5",
      strokeLinecap: "round",
      strokeDasharray: "7 11"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FF9F68",
      strokeWidth: "20",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: WALKED,
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "6",
      strokeLinecap: "round",
      strokeDasharray: "4 9",
      opacity: "0.9"
    }));
  }

  // ─── stars / node primitives (shared) ────────────────────────────
  function Star({
    filled = false,
    size = 14
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z",
      fill: filled ? '#FFC23D' : '#CBD9F0',
      stroke: filled ? '#E0A21F' : '#9FB4D8',
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }));
  }
  function StarArc({
    stars = 3,
    size = 14,
    width = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -size - 6,
        transform: 'translateX(-50%)',
        width,
        height: size + 8,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(-22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 1,
      size: size
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(-2px)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 2,
      size: size + 2
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'translateY(5px) rotate(22deg)'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: stars >= 3,
      size: size
    })));
  }
  function NumberBadge({
    n,
    size,
    color = '#6A4A2E'
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        lineHeight: 1,
        color,
        textShadow: '0 1px 0 rgba(255,255,255,0.55)',
        pointerEvents: 'none'
      }
    }, n);
  }
  function LockGlyph({
    size = 18
  }) {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M8 11V8.5a4 4 0 1 1 8 0V11",
      fill: "none",
      stroke: "#FFFFFF",
      strokeWidth: "2.6",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "11",
      width: "14",
      height: "9",
      rx: "2.5",
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "15",
      r: "1.4",
      fill: "#A89A82"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "11.3",
      y: "15",
      width: "1.4",
      height: "3",
      rx: "0.6",
      fill: "#A89A82"
    }));
  }
  function DoneNode({
    n,
    color,
    stars,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 5px 8px rgba(70,100,160,0.4))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: color,
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement(NumberBadge, {
      n: n,
      size: size
    }), /*#__PURE__*/React.createElement(StarArc, {
      stars: stars,
      size: 14,
      width: size + 14
    }));
  }
  function LockedRegularNode({
    n,
    size = 60
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 6px rgba(70,100,160,0.38))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.36),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n), /*#__PURE__*/React.createElement(StarArc, {
      stars: 0,
      size: 12,
      width: size + 8
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -4,
        bottom: -4,
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: '#8A7B62',
        border: '2px solid #FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(70,100,160,0.42)'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: 13
    })));
  }
  function CurrentNode({
    n,
    size = 64
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -16,
        top: -16,
        width: size + 32,
        height: size + 32,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.26)',
        animation: 'gj-w9s-pulse 1600ms ease-out infinite'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -5,
        top: -5,
        width: size + 10,
        height: size + 10,
        borderRadius: '50%',
        background: 'rgba(255,159,104,0.36)',
        animation: 'gj-w9s-pulse 1600ms ease-out infinite',
        animationDelay: '320ms'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#FFFFFF',
        border: '3px solid #FF9F68',
        boxShadow: '0 6px 16px rgba(70,100,160,0.36), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: size - 16,
      height: size - 16,
      viewBox: "0 0 40 40",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "20",
      cy: "20",
      r: "18",
      fill: "none",
      stroke: "#FFC59A",
      strokeWidth: "2",
      strokeDasharray: "3 4"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#E97E45'
      }
    }, n)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -40,
        transform: 'translateX(-50%)',
        animation: 'gj-w9s-hop 1400ms ease-in-out infinite',
        filter: 'drop-shadow(0 4px 4px rgba(70,100,160,0.4))'
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "blue",
      size: 38,
      direction: "down",
      expression: "happy"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: size + 10,
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)',
        color: '#FFFFFF',
        border: '2px solid #E97E45',
        borderBottom: '3px solid #C8662F',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '5px 14px 6px',
        borderRadius: 999,
        boxShadow: '0 6px 12px rgba(201,102,47,0.4), inset 0 2px 0 rgba(255,197,154,0.6)',
        whiteSpace: 'nowrap'
      }
    }, "Ch\u01A1i ngay"));
  }
  function BreatherNode({
    n,
    size = 48
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -10,
        left: size + 8,
        background: '#FFFFFF',
        color: '#8C7458',
        border: '1.5px solid #E6D8BD',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.10em',
        padding: '4px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 8px rgba(70,100,160,0.36)',
        whiteSpace: 'nowrap'
      }
    }, "NGH\u1EC8"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -6,
        left: size + 4,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#FFD074',
        border: '1.5px solid #E0A21F'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 4px 6px rgba(70,100,160,0.38))',
        opacity: 0.92
      }
    }, /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.30} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${size * 0.55} ${size * 0.45} q 4 4 8 0`,
      fill: "none",
      stroke: "#6A5A40",
      strokeWidth: "2",
      strokeLinecap: "round"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: size * 0.15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.28),
        lineHeight: 1,
        color: '#7A6A50',
        textShadow: '0 1px 0 rgba(255,255,255,0.40)',
        pointerEvents: 'none'
      }
    }, n)));
  }
  function BossNode({
    n,
    size = 80
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: size,
        height: size,
        filter: 'drop-shadow(0 8px 16px rgba(126,108,240,0.45))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -28,
        top: -28,
        right: -28,
        bottom: -28,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(169,156,246,0.6) 0%, rgba(126,108,240,0.32) 55%, rgba(126,108,240,0) 78%)',
        animation: 'gj-w9s-halo 2400ms ease-in-out infinite'
      }
    }), /*#__PURE__*/React.createElement("svg", {
      width: size + 56,
      height: size + 56,
      viewBox: "0 0 200 200",
      style: {
        position: 'absolute',
        left: -28,
        top: -28,
        pointerEvents: 'none',
        animation: 'gj-w9s-spin 8s linear infinite',
        transformOrigin: '50% 50%'
      }
    }, [0, 60, 120, 180, 240, 300].map(a => {
      const rad = a * Math.PI / 180;
      const cx = 100 + Math.cos(rad) * 84;
      const cy = 100 + Math.sin(rad) * 84;
      return /*#__PURE__*/React.createElement("g", {
        key: a
      }, /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "4.5",
        fill: "#FFFFFF",
        opacity: "0.95"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: "2.5",
        fill: "#A99CF6"
      }));
    })), /*#__PURE__*/React.createElement(JellyBlock, {
      color: "stone",
      size: size,
      showEyes: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)',
        border: '3px solid #FFFFFF',
        boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(LockGlyph, {
      size: Math.round(size * 0.28)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -22,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)',
        color: '#FFFFFF',
        border: '2px solid #6353D6',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: '0.16em',
        padding: '4px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)',
        whiteSpace: 'nowrap'
      }
    }, "BOSS"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: -22,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#FFFFFF',
        color: '#5B4636',
        border: '1.5px solid #EFE0C9',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 13,
        padding: '2px 10px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(70,100,160,0.36)'
      }
    }, "m\xE0n ", n));
  }
  function PlaceNode({
    node
  }) {
    let inner = null,
      half = 32;
    if (node.kind === 'boss') {
      inner = /*#__PURE__*/React.createElement(BossNode, {
        n: node.id,
        size: 80
      });
      half = 40;
    } else if (node.kind === 'breather') {
      inner = /*#__PURE__*/React.createElement(BreatherNode, {
        n: node.id,
        size: 48
      });
      half = 24;
    } else if (node.state === 'current') {
      inner = /*#__PURE__*/React.createElement(CurrentNode, {
        n: node.id,
        size: 64
      });
      half = 32;
    } else if (node.state === 'done') {
      inner = /*#__PURE__*/React.createElement(DoneNode, {
        n: node.id,
        color: node.color,
        stars: node.stars,
        size: 64
      });
      half = 32;
    } else {
      inner = /*#__PURE__*/React.createElement(LockedRegularNode, {
        n: node.id,
        size: 60
      });
      half = 30;
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: node.x - half,
        top: node.y - half,
        zIndex: node.kind === 'boss' ? 14 : node.state === 'current' ? 12 : 5
      }
    }, inner);
  }

  // ─── gate to World 10 (Vũ trụ) ────────────────────────────────────
  function GateBanner() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: GATE.y - 38,
        transform: 'translateX(-50%)',
        width: 312,
        background: '#FFFFFF',
        border: '1.5px solid #C9BEF0',
        borderRadius: 999,
        padding: '8px 14px 8px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 12px 28px rgba(83,68,196,0.30), 0 4px 8px rgba(120,92,52,0.14)',
        zIndex: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        flexShrink: 0,
        background: 'radial-gradient(circle at 35% 25%, #4A3A92 0%, #2E1F6B 60%, #1C1248 100%)',
        border: '2.5px solid #8E7CF4',
        boxShadow: 'inset 0 -3px 0 rgba(20,12,60,0.5), inset 0 3px 0 rgba(169,156,246,0.5), 0 2px 4px rgba(83,68,196,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "22",
      cy: "20",
      r: "9",
      fill: "#8E7CF4",
      stroke: "#A99CF6",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "22",
      cy: "20",
      rx: "15",
      ry: "4.5",
      fill: "none",
      stroke: "#C4B5FA",
      strokeWidth: "1.8",
      transform: "rotate(-20 22 20)"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "11",
      r: "1.4",
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "31",
      cy: "9",
      r: "1.1",
      fill: "#FFFFFF"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "8",
      cy: "28",
      r: "1.2",
      fill: "#FFFFFF"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -6,
        right: -4,
        background: '#6353D6',
        border: '1.5px solid #A99CF6',
        color: '#FFFFFF',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 11,
        padding: '2px 6px',
        borderRadius: 999,
        lineHeight: 1,
        boxShadow: '0 2px 3px rgba(83,68,196,0.4)'
      }
    }, "W10")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.05,
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 10,
        letterSpacing: '0.12em',
        color: '#9B886F',
        whiteSpace: 'nowrap'
      }
    }, "C\u1ED4NG \xB7 TH\u1EBE GI\u1EDAI 10"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 22,
        color: '#5B4ECB',
        whiteSpace: 'nowrap',
        lineHeight: 1.05
      }
    }, "V\u0169 tr\u1EE5")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)',
        border: '1.5px solid #E0A21F',
        padding: '6px 11px 7px 8px',
        borderRadius: 999,
        boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Star, {
      filled: true,
      size: 14
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: '#6A4A2E',
        lineHeight: 1
      }
    }, "150")));
  }
  function StartSign() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: H - 90,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#FFFFFF',
        color: '#3F6FB5',
        border: '1.5px solid #C5D8F2',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: '0.12em',
        padding: '6px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 10px rgba(70,100,160,0.34)',
        textTransform: 'uppercase'
      }
    }, "B\u1EA7u tr\u1EDDi \xB7 ti\u1EBFp t\u1EE5c"));
  }
  function World9Strip() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: W,
        height: H,
        background: 'var(--color-bg, #FFF7EC)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text, #5B4636)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("style", null, `
          @keyframes gj-w9s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w9s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w9s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w9s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w9s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @keyframes gj-w9s-bob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes gj-w9s-drift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(8px)} }
          @keyframes gj-w9s-fly   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,-5px)} }
          @keyframes gj-w9s-tw    { 0%,100%{opacity:0.4;transform:scale(0.85)} 50%{opacity:1;transform:scale(1.2)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `), /*#__PURE__*/React.createElement(Scene, null), /*#__PURE__*/React.createElement(PathLayer, null), /*#__PURE__*/React.createElement(GateBanner, null), NODES.map(n => /*#__PURE__*/React.createElement(PlaceNode, {
      key: n.id,
      node: n
    })), /*#__PURE__*/React.createElement(StartSign, null));
  }
  window.GJWorld9Strip = World9Strip;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "04-screens/world9-strip.jsx", error: String((e && e.message) || e) }); }

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
  }, "\u0110\xF2n: \u0111\u1ED5 r\xE1c")), /*#__PURE__*/React.createElement("div", {
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

// 08-brand/gravity-jelly-logo.js
try { (() => {
/* gravity-jelly-logo.js — single source of truth for the brand mark.
   Pure SVG-string builders (no React, no fonts) so the SAME art renders on
   the brand board AND rasterizes to Android PNGs via canvas.
   Mark = ONE big cute hero jelly block (kawaii face) + a small gravity-rotate
   accent, on a soft kid-friendly gradient. Exposes window.GJLogo. */

(function () {
  const COL = {
    yellow: {
      fill: '#FFE3A3',
      edge: '#E8B85C',
      shine: '#FFF6DE'
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
  const INK = '#5A4A2E'; // warm cocoa for eyes (friendlier than near-black)

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

  /* the mark (halo + hero block + accent), designed in a `box`-sized square */
  function markInner(box, opts = {}) {
    const mono = !!opts.mono;
    const cx = box / 2,
      cy = box / 2;
    if (mono) {
      return rotateAccent(box, '#fff', 0.85) + heroBlock(box, HERO, 0.6, true);
    }
    const t = THEME[opts.colorway] || THEME[PRIMARY_CW];
    let halo;
    if (t.ring) {
      halo = `<circle cx="${cx}" cy="${cy}" r="${(box * 0.40).toFixed(2)}" fill="${t.ring}" opacity="${t.ringOp}"/>`;
    } else {
      halo = `<circle cx="${cx}" cy="${cy}" r="${(box * 0.395).toFixed(2)}" fill="#fff" opacity="${t.haloOp[0]}"/>` + `<circle cx="${cx}" cy="${cy}" r="${(box * 0.345).toFixed(2)}" fill="#fff" opacity="${t.haloOp[1]}"/>`;
    }
    const accent = rotateAccent(box, t.arc, 0.9);
    const block = heroBlock(box, opts.block || HERO, 0.6, false);
    const sparkles = sparkle(box * 0.235, box * 0.235, box * 0.026, 0.95, t.spark) + sparkle(box * 0.78, box * 0.74, box * 0.02, 0.9, t.spark) + sparkle(box * 0.20, box * 0.7, box * 0.014, 0.8, t.spark);
    return halo + sparkles + accent + block;
  }
  function wrap(size, inner, defs) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${defs || ''}${inner}</svg>`;
  }
  function bgGradDefs(id, colorway) {
    const c = COLORWAYS[colorway] || COLORWAYS[PRIMARY_CW];
    return `<defs><radialGradient id="${id}" cx="50%" cy="34%" r="80%"><stop offset="0" stop-color="${c[0]}"/><stop offset="0.6" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient></defs>`;
  }
  function bokeh(size) {
    return `<circle cx="${size * 0.19}" cy="${size * 0.83}" r="${size * 0.12}" fill="#fff" opacity="0.10"/><circle cx="${size * 0.85}" cy="${size * 0.18}" r="${size * 0.08}" fill="#fff" opacity="0.10"/>`;
  }

  // adaptive FOREGROUND layer: transparent, mark centred in safe zone
  function foregroundSVG(size, opts = {}) {
    const k = size / 432;
    return wrap(size, `<g transform="scale(${k})">${markInner(432, opts)}</g>`);
  }

  // adaptive BACKGROUND layer (or full bg for store icon)
  function backgroundSVG(size, opts = {}) {
    const r = opts.rounding ? size * opts.rounding : 0;
    return wrap(size, `<rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#gjbg)"/>${bokeh(size)}`, bgGradDefs('gjbg', opts.colorway));
  }

  // composed icon (background + mark); rounding = corner radius fraction (0 = full square)
  function fullIconSVG(size, opts = {}) {
    const r = opts.rounding != null ? size * opts.rounding : 0;
    const k = size / 432;
    const bg = `<rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#gjbg2)"/>${bokeh(size)}`;
    const mark = `<g transform="scale(${k})">${markInner(432, opts)}</g>`;
    return wrap(size, bg + mark, bgGradDefs('gjbg2', opts.colorway));
  }

  // monochrome silhouette (themed icon): white mark on transparent
  function monochromeSVG(size) {
    const k = size / 432;
    return wrap(size, `<g transform="scale(${k})">${markInner(432, {
      mono: true
    })}</g>`);
  }
  window.GJLogo = {
    COL,
    COLORWAYS,
    PRIMARY_CW,
    HERO,
    INK,
    heroBlock,
    markInner,
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

__ds_ns.Hud = __ds_scope.Hud;

__ds_ns.TrayPiece = __ds_scope.TrayPiece;

__ds_ns.Tray = __ds_scope.Tray;

__ds_ns.GravityRotateButton = __ds_scope.GravityRotateButton;

__ds_ns.ComboPopup = __ds_scope.ComboPopup;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.ObjectiveBar = __ds_scope.ObjectiveBar;

__ds_ns.BossMascot = __ds_scope.BossMascot;

__ds_ns.ShieldBar = __ds_scope.ShieldBar;

__ds_ns.BossCard = __ds_scope.BossCard;

__ds_ns.BossIntroCard = __ds_scope.BossIntroCard;

__ds_ns.BossToast = __ds_scope.BossToast;

__ds_ns.BossRule = __ds_scope.BossRule;

__ds_ns.BossHud = __ds_scope.BossHud;

})();
