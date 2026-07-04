/* gravity-jelly-logo.js — single source of truth for the brand mark.
   Pure SVG-string builders (no React, no fonts) so the SAME art renders on
   the brand board AND rasterizes to Android PNGs via canvas.
   Mark = a CLUSTER of four cookie-outlined jelly blocks (yellow behind top,
   mint + blue behind bottom, big pink hero block with a kawaii face in front)
   wrapped by a chunky purple gravity-rotate loop (two-arrow refresh) on a warm
   cream background with a few sparkle dots. Exposes window.GJLogo. */

(function () {
  const COL = {
    yellow: { fill: '#FFE3A3', edge: '#E8B85C', shine: '#FFF1CE' },
    mint: { fill: '#A3E5D9', edge: '#5FC3B2', shine: '#CBF2EB' },
    pink: { fill: '#F7A9C0', edge: '#E576A0', shine: '#FBD0DF' },
    blue: { fill: '#B3C7F7', edge: '#7E9CE8', shine: '#D6E1FB' },
  };
  const GRAV = { fill: '#7E6CF0', edge: '#6353D6', shine: '#A99CF6' };
  const OUTLINE = '#4A3222';        // dark chocolate cookie-outline on every block + the loop
  const INK = '#3B2A1C';            // eye pupils

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

  /* ── NEW MARK ──────────────────────────────────────────────────────────
     A cookie-outlined candy block (dark chocolate outline, colored bottom rim,
     lighter top face, glossy highlights). `face` adds the kawaii pink face. */
  function candyBlock(cx, cy, size, name, opts = {}) {
    const c = COL[name] || COL.pink;
    const half = size / 2;
    const x = cx - half, y = cy - half;
    const r = size * 0.28;
    const ow = size * 0.085;                 // chocolate outline width
    if (opts.mono) {
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" rx="${r.toFixed(2)}" ry="${r.toFixed(2)}" fill="#fff"/>`;
    }
    const inset = ow * 0.55;
    const rim = size * 0.09;                  // bottom colored rim thickness
    const fx = x + inset, fy = y + inset;
    const fw = size - inset * 2, fh = size - inset * 2 - rim;
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
    const eyeDX = size * 0.185, eyeY = cy + size * 0.05;
    const eyeR = size * 0.13, pupR = size * 0.076;
    const eye = (ex) => {
      const py = eyeY + size * 0.01;
      return `<circle cx="${ex.toFixed(2)}" cy="${eyeY.toFixed(2)}" r="${eyeR.toFixed(2)}" fill="#fff" stroke="#F3C0D0" stroke-width="${(size * 0.012).toFixed(2)}"/>`
        + `<circle cx="${ex.toFixed(2)}" cy="${py.toFixed(2)}" r="${pupR.toFixed(2)}" fill="${INK}"/>`
        + `<circle cx="${(ex - pupR * 0.4).toFixed(2)}" cy="${(py - pupR * 0.5).toFixed(2)}" r="${(pupR * 0.4).toFixed(2)}" fill="#fff"/>`;
    };
    const my = eyeY + size * 0.185, mw = size * 0.09;
    const smile = `<path d="M ${(cx - mw).toFixed(2)} ${my.toFixed(2)} Q ${cx.toFixed(2)} ${(my + size * 0.06).toFixed(2)} ${(cx + mw).toFixed(2)} ${my.toFixed(2)}" fill="none" stroke="${INK}" stroke-width="${(size * 0.032).toFixed(2)}" stroke-linecap="round"/>`;
    return eye(cx - eyeDX) + eye(cx + eyeDX) + smile;
  }

  /* chunky purple gravity-rotate LOOP — two arrows (refresh) with chocolate
     outline, centred in a `box`-sized square. Returns {brown, color}. */
  function gravityLoop(box, opts = {}) {
    const cx = box / 2, cy = box / 2;
    const R = box * 0.338, sw = box * 0.076, ow = box * 0.021;
    const mono = !!opts.mono;
    const D = Math.PI / 180;
    const P = (a) => [cx + R * Math.cos(a * D), cy + R * Math.sin(a * D)];
    const arc = (a0, a1, w, col) => {
      const [x0, y0] = P(a0), [x1, y1] = P(a1);
      const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
      return `<path d="M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R.toFixed(2)} ${R.toFixed(2)} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}" fill="none" stroke="${col}" stroke-width="${w.toFixed(2)}" stroke-linecap="round"/>`;
    };
    const head = (ae, extra, col) => {
      const [ex, ey] = P(ae);
      const t = [-Math.sin(ae * D), Math.cos(ae * D)];   // tangent (clockwise)
      const p = [Math.cos(ae * D), Math.sin(ae * D)];      // outward normal
      const len = sw * 1.15 + extra, hw = sw * 0.98 + extra;
      const tip = [ex + t[0] * len, ey + t[1] * len];
      const b = [ex - t[0] * len * 0.15, ey - t[1] * len * 0.15];
      const l = [b[0] + p[0] * hw, b[1] + p[1] * hw];
      const rr = [b[0] - p[0] * hw, b[1] - p[1] * hw];
      return `<polygon points="${tip[0].toFixed(2)},${tip[1].toFixed(2)} ${l[0].toFixed(2)},${l[1].toFixed(2)} ${rr[0].toFixed(2)},${rr[1].toFixed(2)}" fill="${col}" stroke="${col}" stroke-width="${(sw * 0.001).toFixed(2)}" stroke-linejoin="round"/>`;
    };
    // top arc left→over-top→upper-right ; bottom arc right→under-bottom→lower-left
    const A1 = [192, 336], A2 = [12, 156];
    if (mono) {
      return arc(A1[0], A1[1], sw, '#fff') + arc(A2[0], A2[1], sw, '#fff')
        + head(A1[1], 0, '#fff') + head(A2[1], 0, '#fff');
    }
    const brownW = sw + ow * 2;
    const brown = arc(A1[0], A1[1], brownW, OUTLINE) + arc(A2[0], A2[1], brownW, OUTLINE)
      + head(A1[1], ow, OUTLINE) + head(A2[1], ow, OUTLINE);
    const color = arc(A1[0], A1[1], sw, GRAV.fill) + arc(A2[0], A2[1], sw, GRAV.fill)
      + head(A1[1], 0, GRAV.fill) + head(A2[1], 0, GRAV.fill)
      // top gloss along each arc
      + arc(A1[0] + 8, A1[1] - 30, sw * 0.26, GRAV.shine).replace('/>', ' opacity="0.7"/>')
      + arc(A2[0] + 8, A2[1] - 30, sw * 0.26, GRAV.shine).replace('/>', ' opacity="0.7"/>');
    return { brown, color };
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
      const loop = gravityLoop(box, { mono: true });
      return candyBlock(yellow[0], yellow[1], yellow[2], 'yellow', { mono: true })
        + candyBlock(mint[0], mint[1], mint[2], 'mint', { mono: true })
        + candyBlock(blue[0], blue[1], blue[2], 'blue', { mono: true })
        + loop
        + candyBlock(pink[0], pink[1], pink[2], 'pink', { mono: true });
    }

    const loop = gravityLoop(box);
    const dots = dot(box * 0.11, box * 0.19, box * 0.02, '#FFCA66')
      + dot(box * 0.85, box * 0.28, box * 0.017, '#FFCA66')
      + dot(box * 0.09, box * 0.34, box * 0.016, '#F7A9C0');

    return dots
      + candyBlock(yellow[0], yellow[1], yellow[2], 'yellow')
      + candyBlock(mint[0], mint[1], mint[2], 'mint')
      + candyBlock(blue[0], blue[1], blue[2], 'blue')
      + loop.brown + loop.color
      + candyBlock(pink[0], pink[1], pink[2], 'pink', { face: true });
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
  function imageSVG(size, rounding, href) {
    const r = rounding != null ? size * rounding : 0;
    const src = href || MASTER_IMG;
    return `<img src="${src}" width="${size}" height="${size}" alt="Gravity Jelly" style="display:block;width:${size}px;height:${size}px;object-fit:cover;border-radius:${r}px" draggable="false"/>`;
  }

  // adaptive FOREGROUND layer — the supplied artwork (already on cream)
  function foregroundSVG(size /*, opts */) {
    return imageSVG(size, 0);
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

  // monochrome / themed slot — the master art desaturated to a soft silhouette
  function monochromeSVG(size) {
    return `<img src="${MASTER_IMG}" width="${size}" height="${size}" alt="Gravity Jelly mono" style="display:block;width:${size}px;height:${size}px;object-fit:cover;filter:grayscale(1) brightness(1.35) contrast(0.9)" draggable="false"/>`;
  }

  window.GJLogo = { COL, COLORWAYS, PRIMARY_CW, HERO, INK, MASTER_IMG, heroBlock, markInner, imageSVG, foregroundSVG, backgroundSVG, fullIconSVG, monochromeSVG, wrap };
})();
