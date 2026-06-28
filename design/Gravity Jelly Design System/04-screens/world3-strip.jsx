/* world3-strip.jsx — Dải cuộn ĐẦY ĐỦ World 3 "Sông & Thác" (màn 21–30).
   ---------------------------------------------------------------------
   Artboard 360 × 2600dp, KHÔNG có HUD. Đọc DƯỚI→TRÊN, đường mòn liên tục
   uốn lượn, số node 21→30:
     • 21–25 node thường · 26 BREATHER · 27–29 thường · 30 BOSS
     • trên 30: CỔNG sang World 4 "Sa mạc" (chip ★ 54); nền trên cổng
       blend sang palette Sa mạc (#FBEBCB→#F4D69D)
   Biome World 3: trời #D6EEF1→#B4E0EA, suối/thác nước xanh ngọc hai bên,
   đá cuội, lau sậy, lá súng, giọt nước lấp lánh, accent #EAFAFB. Hành lang
   giữa (x 72–290) để TRỐNG cho đường + node.
   Exposes window.GJWorld3Strip.                                          */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const NODES = [
    { id: 21, x: 130, y: 2440, kind: 'reg',      state: 'done',   stars: 3, color: 'yellow' },
    { id: 22, x: 240, y: 2250, kind: 'reg',      state: 'done',   stars: 3, color: 'mint'   },
    { id: 23, x: 110, y: 2060, kind: 'reg',      state: 'done',   stars: 2, color: 'pink'   },
    { id: 24, x: 240, y: 1870, kind: 'reg',      state: 'current'                            },
    { id: 25, x: 120, y: 1680, kind: 'reg',      state: 'locked'                            },
    { id: 26, x: 240, y: 1490, kind: 'breather', state: 'locked'                            },
    { id: 27, x: 110, y: 1290, kind: 'reg',      state: 'locked'                            },
    { id: 28, x: 240, y: 1090, kind: 'reg',      state: 'locked'                            },
    { id: 29, x: 150, y:  880, kind: 'reg',      state: 'locked'                            },
    { id: 30, x: 180, y:  620, kind: 'boss',     state: 'locked'                            },
  ];

  const ENTRY = { x: 180, y: 2620 };
  const GATE  = { x: 180, y: 360  };
  const EXIT  = { x: 180, y: -40  };

  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }
  const ALL_PTS   = [ENTRY, ...NODES.map(n => ({ x: n.x, y: n.y })), GATE, EXIT];
  const FULL_PATH = pathD(ALL_PTS);
  const WALKED    = pathD([ENTRY, NODES[0], NODES[1], NODES[2]]);

  // ─── scene ────────────────────────────────────────────────────────
  function Scene() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="w3s-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"    stopColor="#F4D69D" />{/* W4 Sa mạc sâu     */}
            <stop offset="0.06" stopColor="#F8E1B4" />
            <stop offset="0.13" stopColor="#FBEBCB" />{/* W4 light          */}
            <stop offset="0.19" stopColor="#E6EFD8" />{/* blend             */}
            <stop offset="0.24" stopColor="#D6EEF1" />{/* W3 Sông&Thác top  */}
            <stop offset="0.60" stopColor="#C5E7EE" />
            <stop offset="1"    stopColor="#B4E0EA" />{/* W3 floor          */}
          </linearGradient>
          <radialGradient id="w3s-shimmer" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#EAFAFB" stopOpacity="0.55" />
            <stop offset="1" stopColor="#EAFAFB" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="w3s-fall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"   stopColor="#CFEFF3" />
            <stop offset="0.5" stopColor="#9FD9E2" />
            <stop offset="1"   stopColor="#7FC6D3" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#w3s-sky)" />

        {/* ── Top band: World 4 Sa mạc (dunes + cactus + rocks) ── */}
        <Dune y={20}  fill="#EBC987" />
        <Dune y={70}  fill="#F0D49A" />
        <Cactus x={60}  y={120} h={48} />
        <Cactus x={300} y={108} h={42} />
        <Rock x={180} y={150} r={20} c="#D9C49A" edge="#BBA376" />
        <Rock x={120} y={120} r={13} c="#E0CDA6" edge="#BBA376" />
        {[[80,60],[250,40],[300,150],[150,90]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="2" fill="#FFF4D6" opacity="0.8" />
        ))}

        {/* ── Blend zone ── */}
        <ellipse cx="40"  cy="300" rx="130" ry="50" fill="#C6E3E6" />
        <ellipse cx="320" cy="312" rx="150" ry="56" fill="#BCDEE6" />
        <ellipse cx="180" cy="368" rx="220" ry="68" fill="#B4E0EA" />

        {/* ── Wide river shimmer pools (center-back, subtle, behind path) ── */}
        {[520, 900, 1300, 1700, 2100, 2470].map((y, i) => (
          <g key={i}>
            <ellipse cx="180" cy={y} rx="250" ry="70" fill="#A6DCE5" opacity="0.45" />
            <ellipse cx="180" cy={y} rx="200" ry="48" fill="url(#w3s-shimmer)" />
          </g>
        ))}

        {/* hill/bank layers */}
        {[
          [60,500,'#A6DCE5'],[300,520,'#97D2DD'],
          [50,720,'#97D2DD'],[320,742,'#8AC9D6'],
          [60,940,'#8AC9D6'],[300,962,'#7FC0CF'],
          [40,1180,'#8AC9D6'],[320,1202,'#7FC0CF'],
          [60,1420,'#7FC0CF'],[300,1442,'#74B7C8'],
          [40,1660,'#7FC0CF'],[320,1682,'#74B7C8'],
          [60,1900,'#74B7C8'],[300,1922,'#69AEC0'],
          [40,2150,'#69AEC0'],[320,2172,'#5FA5B8'],
          [40,2380,'#5FA5B8'],[320,2402,'#579FB2'],
        ].map(([cx,cy,fill],i)=>(
          <ellipse key={i} cx={cx} cy={cy} rx="160" ry="58" fill={fill} />
        ))}
        <rect x="0" y={H - 28} width={W} height="28" fill="#579FB2" />

        {/* ── DENSE EDGE CLIFFS + WATERFALLS: vách núi đá canyon 2 bên (mép
           TRÁI x≤72 / PHẢI x≥288), thác nước ĐỔ TỪ GỜ ĐÁ xuống hồ — nước
           có núi mới thành thác. Hành lang giữa TRỐNG cho đường. ── */}
        {(() => {
          const els = [];
          // vách đá LIỀN KHỐI 2 bên + cây leo (giữa đã là sông xanh — không thêm sông bên)
          els.push(<CliffWall key="wl" side="l" />);
          els.push(<CliffWall key="wr" side="r" />);
          // đá cuội + lau sậy ở chân vách (chỉ vùng còn vách, y > 560)
          for (let row = 0, y = 380; y <= 2540; y += 220, row++) {
            if (y > 560) els.push(<Rock key={`bl-${row}`} x={row % 2 ? 82 : 76} y={y} r={12 + (row % 3) * 3} c="#C9BCA8" edge="#A89A82" />);
            if (y + 110 > 560) els.push(<Rock key={`br-${row}`} x={row % 2 ? 278 : 284} y={y + 110} r={12 + (row % 2) * 3} c="#C9BCA8" edge="#A89A82" />);
          }
          for (let row = 0, y = 320; y <= 2540; y += 240, row++) {
            if (y > 560) els.push(<Reed key={`lr-${row}`} x={78} y={y} s={24} />);
            if (y + 120 > 560) els.push(<Reed key={`rr-${row}`} x={282} y={y + 120} s={24} />);
          }
          return els;
        })()}

        {/* ── Mid-ground rocks + reeds in open pockets (opposite the path) ── */}
        {[[286,2380,18],[290,2150,20],[284,1760,18],[288,1380,20],[282,1000,18],[286,660,20]]
          .map(([x,y,r],i)=> <Rock key={`mr-${i}`} x={x} y={y} r={r} />)}
        {[[86,2300,16],[90,1920,18],[84,1540,16],[88,1160,18],[86,760,16]]
          .map(([x,y,r],i)=> <Rock key={`ml-${i}`} x={x} y={y} r={r} />)}

        {/* ── Mist bands ── */}
        {[300,560,900,1300,1700,2100,2400].map((y,i)=>(
          <ellipse key={i} cx={i%2?260:110} cy={y} rx="120" ry="13" fill="#FFFFFF" opacity="0.34" />
        ))}

        {/* ── Drifting jelly characters ── */}
        <FloatJelly x={300} y={1170} size={20} color="mint"   delay="0s"   />
        <FloatJelly x={56}  y={2000} size={22} color="yellow" delay="0.8s" />
        <FloatJelly x={300} y={2280} size={18} color="pink"   delay="1.4s" />
      </svg>
    );
  }

  function Dune({ y, fill }) {
    return (
      <path d={`M 0 ${y+30} q 90 -34 180 0 t 180 0 L 360 200 L 0 200 Z`} fill={fill} opacity="0.85" />
    );
  }
  function Cactus({ x, y, h = 44 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(120,100,40,0.22))' }}>
        <rect x={x - 5} y={y - h} width="10" height={h} rx="5" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.5" />
        <rect x={x - 16} y={y - h*0.66} width="8" height={h*0.4} rx="4" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.5" />
        <rect x={x - 16} y={y - h*0.66} width="8" height="8" rx="4" fill="#7FA86A" />
        <rect x={x + 8} y={y - h*0.78} width="8" height={h*0.5} rx="4" fill="#7FA86A" stroke="#5F8A4E" strokeWidth="1.5" />
      </g>
    );
  }
  function CliffWall({ side }) {
    // VÁCH ĐÁ LIỀN KHỐI một mép — KẾT THÚC DỨT KHOÁT ở rìa trên (yEnd), lộ sa
    // mạc phía trên. Màu đá hệ thống, vân đá ngang + cây leo rủ + rìa đá trên.
    const isL = side === 'l';
    const yEnd = 580;                              // điểm kết thúc vách (rìa)
    const insetAt = i => [74, 58, 66][i % 3];      // lượn nhẹ, không lùi
    // điểm mép trong từ rìa (yEnd) xuống đáy
    const pts = [];
    for (let y = yEnd, i = 0; y <= H + 40; y += 150, i++) {
      pts.push([isL ? insetAt(i) : W - insetAt(i), y, i]);
    }
    const outerX = isL ? -24 : W + 24;
    const innerTop = pts[0][0];
    // path: góc ngoài-trên → rìa đá trên → theo mép trong xuống đáy → đáy → đóng
    let d = `M ${outerX} ${yEnd} `;
    d += `Q ${(outerX + innerTop) / 2} ${yEnd - 14} ${innerTop} ${yEnd} `;   // rìa cong
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1], [x, y] = pts[i];
      const my = (py + y) / 2;
      d += `Q ${px} ${my} ${x} ${y} `;
    }
    d += `L ${outerX} ${H + 40} Z`;
    // vân đá ngang (texture)
    const strata = [];
    for (let y = yEnd + 40; y < H; y += 84) {
      const inset = insetAt(Math.round((y - yEnd) / 150));
      strata.push(
        <line key={`st${y}`} x1={outerX} y1={y}
              x2={isL ? inset - 10 : W - inset + 10} y2={y + 5}
              stroke="#A89A82" strokeWidth="1.6" opacity="0.30" />
      );
    }
    // rêu + CÂY LEO rủ xuống dọc mép trong
    const deco = [];
    pts.forEach(([x, y, i]) => {
      if (i % 2 === 0) {
        deco.push(<ellipse key={`mo${i}`} cx={isL ? x - 8 : x + 8} cy={y} rx="15" ry="6" fill="#6FA86F" opacity="0.5" />);
      }
      if (i % 3 === 1) {
        deco.push(<Vine key={`vn${i}`} x={isL ? x - 4 : x + 4} y={y - 6}
                        len={46 + (i % 4) * 14} dir={isL ? -1 : 1} />);
      }
    });
    return (
      <g style={{ filter: 'drop-shadow(0 0 7px rgba(90,78,60,0.18))' }}>
        <path d={d} fill="#C9BCA8" stroke="#A89A82" strokeWidth="2.5" />
        {/* rìa đá trên — gờ sáng cho cảm giác kết thúc dứt khoát */}
        <path d={`M ${outerX} ${yEnd} Q ${(outerX + innerTop) / 2} ${yEnd - 14} ${innerTop} ${yEnd}`}
              fill="none" stroke="#DBD0BF" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        {/* dải bóng trong tạo khối */}
        <path d={d} fill="none" stroke="rgba(120,108,90,0.14)" strokeWidth="12" />
        {strata}
        {deco}
      </g>
    );
  }
  function Vine({ x, y, len = 50, dir = 1 }) {
    // cây leo rủ: thân uốn + lá nhỏ + chùm ngọn
    const segs = Math.max(3, Math.round(len / 18));
    let d = `M ${x} ${y}`;
    const leaves = [];
    let cy = y;
    for (let i = 1; i <= segs; i++) {
      const ny = y + (len / segs) * i;
      const sway = (i % 2 === 0 ? 1 : -1) * 6 * dir;
      d += ` Q ${x + sway} ${(cy + ny) / 2} ${x} ${ny}`;
      leaves.push([x + sway * 0.7, (cy + ny) / 2, i % 2 ? 26 : -26]);
      cy = ny;
    }
    return (
      <g>
        <path d={d} fill="none" stroke="#5F9C66" strokeWidth="2.2" strokeLinecap="round" />
        {leaves.map(([lx, ly, rot], i) => (
          <ellipse key={i} cx={lx} cy={ly} rx="5.5" ry="3" fill="#6FA86F"
                   transform={`rotate(${rot} ${lx} ${ly})`} />
        ))}
        <circle cx={x} cy={y + len} r="3" fill="#7FB37F" />
        <circle cx={x - 3 * dir} cy={y + len - 3} r="2" fill="#8FC59A" />
      </g>
    );
  }
  function Cobble({ x, y, r = 14 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 1.5px rgba(60,80,90,0.25))' }}>
        <ellipse cx={x} cy={y} rx={r} ry={r * 0.72} fill="#B9B2A6" stroke="#9A9184" strokeWidth="1.4" />
        <ellipse cx={x - r * 0.28} cy={y - r * 0.26} rx={r * 0.32} ry={r * 0.2} fill="#D6D0C5" opacity="0.8" />
      </g>
    );
  }
  function Rock({ x, y, r = 16, c = '#AEB7B2', edge = '#8F9892' }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(60,80,90,0.22))' }}>
        <path d={`M ${x - r} ${y + r*0.5} Q ${x - r} ${y - r*0.5} ${x - r*0.3} ${y - r*0.7}
                  Q ${x + r*0.4} ${y - r*0.9} ${x + r} ${y - r*0.2}
                  Q ${x + r*1.05} ${y + r*0.5} ${x} ${y + r*0.6} Z`}
              fill={c} stroke={edge} strokeWidth="1.5" />
        <path d={`M ${x - r*0.5} ${y - r*0.3} Q ${x} ${y - r*0.6} ${x + r*0.4} ${y - r*0.3}`}
              fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
      </g>
    );
  }
  function Reed({ x, y, s = 24 }) {
    return (
      <g stroke="#5FA06A" strokeWidth="2.4" strokeLinecap="round" fill="none">
        {[-10, 0, 10].map((a, i) => (
          <path key={i} d={`M ${x + a*0.4} ${y} q ${a*0.5} ${-s*0.6} ${a*0.3} ${-s}`} />
        ))}
        {[-10, 0, 10].map((a, i) => (
          <ellipse key={`t-${i}`} cx={x + a*0.3} cy={y - s} rx="2.4" ry="5" fill="#C9A06A" stroke="none" />
        ))}
      </g>
    );
  }
  function LilyPad({ x, y, r = 16 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 1.5px rgba(40,90,80,0.18))' }}>
        <path d={`M ${x} ${y} A ${r} ${r*0.66} 0 1 1 ${x - 0.1} ${y} Z`} fill="#6FB48A" stroke="#4F946A" strokeWidth="1.2" />
        <path d={`M ${x} ${y} L ${x + r*0.9} ${y - r*0.3}`} fill="none" stroke="#B4E0EA" strokeWidth="2" />
        <ellipse cx={x - r*0.2} cy={y - r*0.18} rx={r*0.3} ry={r*0.16} fill="#8FC9A4" opacity="0.7" />
      </g>
    );
  }
  function FloatJelly({ x, y, size, color, delay }) {
    const p = {
      yellow: { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' },
      mint:   { f: '#A3E5D9', e: '#5FC3B2', s: '#CBF2EB' },
      pink:   { f: '#F7A9C0', e: '#E576A0', s: '#FBD0DF' },
    }[color] || { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' };
    return (
      <g style={{ animation: 'gj-w3s-float 3.6s ease-in-out infinite', animationDelay: delay,
                  transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 4px 3px rgba(40,90,90,0.22))' }}>
        <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={Math.round(size*0.28)}
              fill={p.f} stroke={p.e} strokeWidth="2" />
        <ellipse cx={x} cy={y - size * 0.18} rx={size * 0.34} ry={size * 0.12} fill={p.s} opacity="0.95" />
        <circle cx={x - size * 0.18} cy={y - size * 0.04} r={size * 0.07} fill="#3B2A18" />
        <circle cx={x + size * 0.18} cy={y - size * 0.04} r={size * 0.07} fill="#3B2A18" />
      </g>
    );
  }

  // ─── path ─────────────────────────────────────────────────────────
  function PathLayer() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
           style={{ position: 'absolute', inset: 0, display: 'block', pointerEvents: 'none' }}>
        <path d={FULL_PATH} fill="none" stroke="rgba(60,90,95,0.22)"
              strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,4)" />
        <path d={FULL_PATH} fill="none" stroke="#EAD8B7"
              strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#FFFFFF"
              strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        <path d={FULL_PATH} fill="none" stroke="#EFE0C9"
              strokeWidth="3.5" strokeLinecap="round" strokeDasharray="7 11" />
        <path d={WALKED} fill="none" stroke="#FF9F68"
              strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
        <path d={WALKED} fill="none" stroke="#FFC59A"
              strokeWidth="6" strokeLinecap="round" strokeDasharray="4 9" opacity="0.9" />
      </svg>
    );
  }

  // ─── stars / node primitives (shared) ────────────────────────────
  function Star({ filled = false, size = 14 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
              fill={filled ? '#FFC23D' : '#D9CDB5'} stroke={filled ? '#E0A21F' : '#B6A892'}
              strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  function StarArc({ stars = 3, size = 14, width = 64 }) {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: -size - 6, transform: 'translateX(-50%)',
        width, height: size + 8, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', pointerEvents: 'none',
      }}>
        <div style={{ transform: 'translateY(5px) rotate(-22deg)' }}><Star filled={stars >= 1} size={size} /></div>
        <div style={{ transform: 'translateY(-2px)' }}><Star filled={stars >= 2} size={size + 2} /></div>
        <div style={{ transform: 'translateY(5px) rotate(22deg)' }}><Star filled={stars >= 3} size={size} /></div>
      </div>
    );
  }
  function NumberBadge({ n, size, color = '#6A4A2E' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.36), lineHeight: 1,
        color, textShadow: '0 1px 0 rgba(255,255,255,0.55)', pointerEvents: 'none',
      }}>{n}</div>
    );
  }
  function LockGlyph({ size = 18 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
        <path d="M8 11V8.5a4 4 0 1 1 8 0V11" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="5" y="11" width="14" height="9" rx="2.5" fill="#FFFFFF" />
        <circle cx="12" cy="15" r="1.4" fill="#A89A82" />
        <rect x="11.3" y="15" width="1.4" height="3" rx="0.6" fill="#A89A82" />
      </svg>
    );
  }

  function DoneNode({ n, color, stars, size = 64 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 5px 7px rgba(40,90,95,0.24))' }}>
        <JellyBlock color={color} size={size} showEyes={false} />
        <NumberBadge n={n} size={size} />
        <StarArc stars={stars} size={14} width={size + 14} />
      </div>
    );
  }
  function LockedRegularNode({ n, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 5px rgba(40,90,95,0.20))' }}>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.36), lineHeight: 1,
          color: '#7A6A50', textShadow: '0 1px 0 rgba(255,255,255,0.40)', pointerEvents: 'none',
        }}>{n}</div>
        <StarArc stars={0} size={12} width={size + 8} />
        <div style={{
          position: 'absolute', right: -4, bottom: -4, width: 24, height: 24, borderRadius: '50%',
          background: '#8A7B62', border: '2px solid #FFFFFF', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 2px 4px rgba(40,90,95,0.32)',
        }}>
          <LockGlyph size={13} />
        </div>
      </div>
    );
  }
  function CurrentNode({ n, size = 64 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: -16, top: -16, width: size + 32, height: size + 32, borderRadius: '50%', background: 'rgba(255,159,104,0.24)', animation: 'gj-w3s-pulse 1600ms ease-out infinite' }} />
        <div style={{ position: 'absolute', left: -5, top: -5, width: size + 10, height: size + 10, borderRadius: '50%', background: 'rgba(255,159,104,0.34)', animation: 'gj-w3s-pulse 1600ms ease-out infinite', animationDelay: '320ms' }} />
        <div style={{
          position: 'relative', width: size, height: size, borderRadius: '50%', background: '#FFFFFF', border: '3px solid #FF9F68',
          boxShadow: '0 6px 14px rgba(40,90,95,0.24), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width={size - 16} height={size - 16} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A" strokeWidth="2" strokeDasharray="3 4" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#E97E45' }}>{n}</div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)', animation: 'gj-w3s-hop 1400ms ease-in-out infinite', filter: 'drop-shadow(0 4px 4px rgba(40,90,95,0.30))' }}>
          <JellyBlock color="pink" size={38} direction="down" expression="happy" />
        </div>
        <div style={{
          position: 'absolute', left: '50%', top: size + 10, transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)', color: '#FFFFFF',
          border: '2px solid #E97E45', borderBottom: '3px solid #C8662F', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          padding: '5px 14px 6px', borderRadius: 999, boxShadow: '0 6px 12px rgba(201,102,47,0.35), inset 0 2px 0 rgba(255,197,154,0.6)', whiteSpace: 'nowrap',
        }}>Chơi ngay</div>
      </div>
    );
  }
  function BreatherNode({ n, size = 48 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: -10, left: size + 8, background: '#FFFFFF', color: '#8C7458', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.10em', padding: '4px 10px', borderRadius: 999, boxShadow: '0 3px 8px rgba(40,90,95,0.20)', whiteSpace: 'nowrap' }}>NGHỈ</div>
        <div style={{ position: 'absolute', top: -6, left: size + 4, width: 10, height: 10, borderRadius: '50%', background: '#FFD074', border: '1.5px solid #E0A21F' }} />
        <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 5px rgba(40,90,95,0.22))', opacity: 0.92 }}>
          <JellyBlock color="stone" size={size} showEyes={false} />
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={`M ${size*0.30} ${size*0.45} q 4 4 8 0`} fill="none" stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${size*0.55} ${size*0.45} q 4 4 8 0`} fill="none" stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: size * 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.28), lineHeight: 1, color: '#7A6A50', textShadow: '0 1px 0 rgba(255,255,255,0.40)', pointerEvents: 'none' }}>{n}</div>
        </div>
      </div>
    );
  }
  function BossNode({ n, size = 80 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 8px 14px rgba(126,108,240,0.40))' }}>
        <div style={{ position: 'absolute', left: -28, top: -28, right: -28, bottom: -28, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(169,156,246,0.55) 0%, rgba(126,108,240,0.30) 55%, rgba(126,108,240,0) 78%)', animation: 'gj-w3s-halo 2400ms ease-in-out infinite' }} />
        <svg width={size + 56} height={size + 56} viewBox="0 0 200 200" style={{ position: 'absolute', left: -28, top: -28, pointerEvents: 'none', animation: 'gj-w3s-spin 8s linear infinite', transformOrigin: '50% 50%' }}>
          {[0,60,120,180,240,300].map(a => {
            const rad=(a*Math.PI)/180; const cx=100+Math.cos(rad)*84; const cy=100+Math.sin(rad)*84;
            return (<g key={a}><circle cx={cx} cy={cy} r="4.5" fill="#FFFFFF" opacity="0.95" /><circle cx={cx} cy={cy} r="2.5" fill="#A99CF6" /></g>);
          })}
        </svg>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: size * 0.5, height: size * 0.5, borderRadius: '50%', background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)', border: '3px solid #FFFFFF', boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LockGlyph size={Math.round(size * 0.28)} />
          </div>
        </div>
        <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)', color: '#FFFFFF', border: '2px solid #6353D6', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', padding: '4px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>BOSS</div>
        <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #EFE0C9', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 999, boxShadow: '0 3px 6px rgba(40,90,95,0.20)' }}>màn {n}</div>
      </div>
    );
  }

  function PlaceNode({ node }) {
    let inner = null, half = 32;
    if (node.kind === 'boss')          { inner = <BossNode n={node.id} size={80} />;        half = 40; }
    else if (node.kind === 'breather') { inner = <BreatherNode n={node.id} size={48} />;    half = 24; }
    else if (node.state === 'current') { inner = <CurrentNode n={node.id} size={64} />;     half = 32; }
    else if (node.state === 'done')    { inner = <DoneNode n={node.id} color={node.color} stars={node.stars} size={64} />; half = 32; }
    else                               { inner = <LockedRegularNode n={node.id} size={60} />; half = 30; }
    return (
      <div style={{ position: 'absolute', left: node.x - half, top: node.y - half, zIndex: node.kind === 'boss' ? 14 : (node.state === 'current' ? 12 : 5) }}>
        {inner}
      </div>
    );
  }

  // ─── gate to World 4 (Sa mạc) ─────────────────────────────────────
  function GateBanner() {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: GATE.y - 38, transform: 'translateX(-50%)', width: 312,
        background: '#FFFFFF', border: '1.5px solid #E6D8BD', borderRadius: 999, padding: '8px 14px 8px 8px',
        display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 28px rgba(150,120,60,0.30), 0 4px 8px rgba(120,92,52,0.14)', zIndex: 16,
      }}>
        {/* World 4 desert badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 25%, #FBE6B6 0%, #E8B85C 60%, #C8923E 100%)',
          border: '2.5px solid #C8923E', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.10), inset 0 3px 0 rgba(255,255,255,0.45), 0 2px 4px rgba(150,110,40,0.32)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 18c3-4 5-4 9 0s6 0 9-4" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="17" cy="7" r="3" fill="#FFFFFF" />
          </svg>
          <div style={{ position: 'absolute', top: -6, right: -4, background: '#FFCA66', border: '1.5px solid #E0A21F', color: '#6A4A2E', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, padding: '2px 6px', borderRadius: 999, lineHeight: 1, boxShadow: '0 2px 3px rgba(120,92,52,0.20)' }}>W4</div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.05, gap: 2 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', color: '#9B886F', whiteSpace: 'nowrap' }}>CỔNG · THẾ GIỚI 4</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#B9802E', whiteSpace: 'nowrap', lineHeight: 1.05 }}>Sa mạc</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'linear-gradient(180deg, #FFE6A8 0%, #FFD074 100%)', border: '1.5px solid #E0A21F', padding: '6px 11px 7px 8px', borderRadius: 999, boxShadow: '0 3px 6px rgba(200,150,40,0.28), inset 0 1.5px 0 rgba(255,255,255,0.6)', flexShrink: 0 }}>
          <Star filled size={14} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#6A4A2E', lineHeight: 1 }}>54</span>
        </div>
      </div>
    );
  }

  function StartSign() {
    return (
      <div style={{ position: 'absolute', left: '50%', top: H - 90, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(40,90,95,0.20)', textTransform: 'uppercase' }}>Sông &amp; Thác · tiếp tục</div>
      </div>
    );
  }

  function World3Strip() {
    return (
      <div style={{ position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden' }}>
        <style>{`
          @keyframes gj-w3s-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-w3s-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-w3s-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-w3s-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-w3s-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>
        <Scene />
        <PathLayer />
        <GateBanner />
        {NODES.map(n => <PlaceNode key={n.id} node={n} />)}
        <StartSign />
      </div>
    );
  }

  window.GJWorld3Strip = World3Strip;
})();
