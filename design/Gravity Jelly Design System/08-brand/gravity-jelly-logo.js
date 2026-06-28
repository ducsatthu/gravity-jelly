/* gravity-jelly-logo.js — single source of truth for the brand mark.
   Pure SVG-string builders (no React, no fonts) so the SAME art renders on
   the brand board AND rasterizes to Android PNGs via canvas.
   Mark = ONE big cute hero jelly block (kawaii face) + a small gravity-rotate
   accent, on a soft kid-friendly gradient. Exposes window.GJLogo. */

(function () {
  const COL = {
    yellow: { fill: '#FFE3A3', edge: '#E8B85C', shine: '#FFF6DE' },
    mint: { fill: '#A3E5D9', edge: '#5FC3B2', shine: '#CBF2EB' },
    pink: { fill: '#F7A9C0', edge: '#E576A0', shine: '#FBD0DF' },
    blue: { fill: '#B3C7F7', edge: '#7E9CE8', shine: '#D6E1FB' },
  };
  const INK = '#5A4A2E';            // warm cocoa for eyes (friendlier than near-black)

  // brand corner stickers (same motifs as JellyBlock): star / leaf / heart / droplet
  const STICKER = {
    yellow: 'M12 2.4l2.7 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.4 6.3 19.5l1.4-6.3L2.9 8.9l6.4-.6z',
    mint: 'M5 19c0-8 6-14 14-14 0 8-6 14-14 14zm3.5-3.5C13 14 16 11 17 7',
    pink: 'M12 20.7l-1.5-1.4C5.4 14.6 2 11.5 2 7.8 2 5.1 4.1 3 6.8 3 8.3 3 9.8 3.8 12 6 14.2 3.8 15.7 3 17.2 3 19.9 3 22 5.1 22 7.8c0 3.7-3.4 6.8-8.5 11.5z',
    blue: 'M12 3.2c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z',
  };

  // background gradients — warm-first to match the cream game UI
  const COLORWAYS = {
    cream: ['#FFFEFB', '#FFF7EC', '#F4E7D2'],
    sky: ['#C6E4FF', '#8FC2F6', '#73AEEF'],
    mint: ['#CFF3EA', '#94E2D2', '#74D2BE'],
    coral: ['#FFE0BC', '#FFB07A', '#FF9F68'],
    bubblegum: ['#FFD7E7', '#FBAFC8', '#F49EBC'],
  };
  const PRIMARY_CW = 'cream';
  const HERO = 'pink';

  // per-colorway accents: on the warm cream bg the gravity swoosh + sparkles go
  // colored (white would vanish); on saturated bgs they stay crisp white.
  const THEME = {
    cream:     { arc: '#7E6CF0', spark: '#FFB84D', ring: '#F0DFC4', ringOp: 0.6 },
    sky:       { arc: '#FFFFFF', spark: '#FFFFFF', haloOp: [0.20, 0.22] },
    mint:      { arc: '#FFFFFF', spark: '#FFFFFF', haloOp: [0.20, 0.22] },
    coral:     { arc: '#FFFFFF', spark: '#FFFFFF', haloOp: [0.20, 0.22] },
    bubblegum: { arc: '#FFFFFF', spark: '#FFFFFF', haloOp: [0.20, 0.22] },
  };

  /* the cute hero jelly block, centred in a `box` square, side = box*scale */
  function heroBlock(box, name, scale, mono) {
    const s = box * scale;
    const x = (box - s) / 2, y = (box - s) / 2 + box * 0.012;
    const c = COL[name];
    const sw = Math.max(3, s * 0.072);
    const r = s * 0.3;
    const ix = x + sw / 2, iy = y + sw / 2, is = s - sw;
    const cx = x + s / 2;
    if (mono) {
      return `<rect x="${ix.toFixed(2)}" y="${iy.toFixed(2)}" width="${is.toFixed(2)}" height="${is.toFixed(2)}" rx="${r.toFixed(2)}" ry="${r.toFixed(2)}" fill="#fff"/>`;
    }
    // face geometry
    const eyeY = y + s * 0.5;
    const eyeDX = s * 0.205, eyeR = s * 0.135, pupR = s * 0.082;
    const eye = (ex) => {
      const px = ex, py = eyeY + s * 0.012;
      return `<circle cx="${ex}" cy="${eyeY}" r="${eyeR}" fill="#fff"/>`
        + `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${pupR}" fill="${INK}"/>`
        + `<circle cx="${(px - pupR * 0.42).toFixed(2)}" cy="${(py - pupR * 0.5).toFixed(2)}" r="${(pupR * 0.42).toFixed(2)}" fill="#fff"/>`; // sparkle
    };
    const cheek = (chx) => `<ellipse cx="${chx}" cy="${(eyeY + s * 0.18).toFixed(2)}" rx="${(s * 0.075).toFixed(2)}" ry="${(s * 0.048).toFixed(2)}" fill="#FF9DB0" opacity="0.32"/>`;
    // brand corner sticker (heart for pink, etc.)
    const stk = STICKER[name];
    let sticker = '';
    if (stk) {
      const hs = s * 0.34;
      const sx = x + s - hs - s * 0.05, sy = y + s * 0.05;
      const stroked = name === 'mint';
      sticker = `<g transform="translate(${sx.toFixed(2)} ${sy.toFixed(2)}) rotate(-12 ${(hs / 2).toFixed(2)} ${(hs / 2).toFixed(2)}) scale(${(hs / 24).toFixed(4)})">`
        + `<path d="${stk}" fill="${stroked ? 'none' : c.shine}" stroke="${c.edge}" stroke-width="${stroked ? 2.2 : 1.6}" stroke-linejoin="round" stroke-linecap="round"/>`
        + `</g>`;
    }
    return `<g>`
      + `<rect x="${ix.toFixed(2)}" y="${iy.toFixed(2)}" width="${is.toFixed(2)}" height="${is.toFixed(2)}" rx="${r.toFixed(2)}" ry="${r.toFixed(2)}" fill="${c.fill}" stroke="${c.edge}" stroke-width="${sw.toFixed(2)}"/>`
      + `<ellipse cx="${cx}" cy="${(y + s * 0.25).toFixed(2)}" rx="${(s * 0.32).toFixed(2)}" ry="${(s * 0.14).toFixed(2)}" fill="${c.shine}" opacity="0.95"/>`
      + eye(cx - eyeDX) + eye(cx + eyeDX)
      + sticker
      + `</g>`;
  }

  /* small white gravity-rotate accent arc + arrowhead, hugging the block */
  function rotateAccent(box, color, op) {
    const cx = box / 2, cy = box / 2;
    const R = box * 0.4, sw = box * 0.032;
    const startDeg = 320, sweepDeg = 150;        // short arc over the top-right
    const a0 = startDeg * Math.PI / 180, a1 = (startDeg + sweepDeg) * Math.PI / 180;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const large = Math.abs(sweepDeg) > 180 ? 1 : 0;
    const arc = `<path d="M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"/>`;
    const tang = a1 + Math.PI / 2;
    const L = sw * 1.7, Wp = sw * 1.2, perp = tang + Math.PI / 2;
    const tipx = x1 + L * Math.cos(tang), tipy = y1 + L * Math.sin(tang);
    const bx = x1 - L * 0.5 * Math.cos(tang), by = y1 - L * 0.5 * Math.sin(tang);
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
    const cx = box / 2, cy = box / 2;
    if (mono) {
      return rotateAccent(box, '#fff', 0.85) + heroBlock(box, HERO, 0.6, true);
    }
    const t = THEME[opts.colorway] || THEME[PRIMARY_CW];
    let halo;
    if (t.ring) {
      halo = `<circle cx="${cx}" cy="${cy}" r="${(box * 0.40).toFixed(2)}" fill="${t.ring}" opacity="${t.ringOp}"/>`;
    } else {
      halo = `<circle cx="${cx}" cy="${cy}" r="${(box * 0.395).toFixed(2)}" fill="#fff" opacity="${t.haloOp[0]}"/>`
        + `<circle cx="${cx}" cy="${cy}" r="${(box * 0.345).toFixed(2)}" fill="#fff" opacity="${t.haloOp[1]}"/>`;
    }
    const accent = rotateAccent(box, t.arc, 0.9);
    const block = heroBlock(box, opts.block || HERO, 0.6, false);
    const sparkles = sparkle(box * 0.235, box * 0.235, box * 0.026, 0.95, t.spark)
      + sparkle(box * 0.78, box * 0.74, box * 0.02, 0.9, t.spark)
      + sparkle(box * 0.20, box * 0.7, box * 0.014, 0.8, t.spark);
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
    return wrap(size, `<g transform="scale(${k})">${markInner(432, { mono: true })}</g>`);
  }

  window.GJLogo = { COL, COLORWAYS, PRIMARY_CW, HERO, INK, heroBlock, markInner, foregroundSVG, backgroundSVG, fullIconSVG, monochromeSVG, wrap };
})();
