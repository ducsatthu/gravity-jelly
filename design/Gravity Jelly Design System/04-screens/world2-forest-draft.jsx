/* world2-forest-draft.jsx — BẢN DRAFT riêng (KHÔNG đụng World 1/2 hiện tại).
   ---------------------------------------------------------------------
   v2 — bám sát ảnh tham khảo "RỪNG RẬM":
     • CON ĐƯỜNG: dải KEM/ngà, KHÔNG viền cam, chấm bi tan ở giữa; MỖI node
       đứng trên 1 BỆ TRÒN (đĩa kem oval) có vành tan + bóng đổ.
     • RỪNG NHIỀU LỚP CÓ BÓNG: thông tầng (tam giác xếp lớp), thân cây gỗ to
       ở mép, cây tròn, dương xỉ/lá — TẤT CẢ đổ bóng xuống đất; mép rừng tối,
       giữa là khoảng trống xanh nhạt; mây ở đáy.
   Node vẫn dùng ĐÚNG BẢNG 7 BIẾN THỂ hệ thống:
     11 done3★ · 12 done2★ · 13 done1★ · 14 HIỆN TẠI · 15 khoá ·
     16 BREATHER · 17–19 khoá · 20 BOSS.
   Artboard 360 × 2600dp, KHÔNG HUD. Đọc DƯỚI→TRÊN.
   Exposes window.GJWorld2ForestDraft.                                    */
(function () {
  const W = 360;
  const H = 2600;
  const NS = window.GravityJellyDesignSystem_3e0487 || {};
  const { JellyBlock } = NS;

  const NODES = [
  { id: 11, x: 130, y: 2440, kind: 'reg', state: 'done', stars: 3, color: 'yellow' },
  { id: 12, x: 240, y: 2250, kind: 'reg', state: 'done', stars: 2, color: 'mint' },
  { id: 13, x: 110, y: 2060, kind: 'reg', state: 'done', stars: 1, color: 'pink' },
  { id: 14, x: 240, y: 1870, kind: 'reg', state: 'current' },
  { id: 15, x: 120, y: 1680, kind: 'reg', state: 'locked' },
  { id: 16, x: 240, y: 1490, kind: 'breather', state: 'locked' },
  { id: 17, x: 110, y: 1290, kind: 'reg', state: 'locked' },
  { id: 18, x: 240, y: 1090, kind: 'reg', state: 'locked' },
  { id: 19, x: 150, y: 880, kind: 'reg', state: 'locked' },
  { id: 20, x: 180, y: 620, kind: 'boss', state: 'locked' }];


  const ENTRY = { x: 180, y: 2620 };
  const TOP = { x: 180, y: 300 };
  const EXIT = { x: 180, y: -40 };

  function pathD(points) {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],b = points[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  }
  const ALL_PTS = [ENTRY, ...NODES.map((n) => ({ x: n.x, y: n.y })), TOP, EXIT];
  const FULL_PATH = pathD(ALL_PTS);

  // ─── scene: RỪNG RẬM nhiều lớp ────────────────────────────────────
  function Scene() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <linearGradient id="w2d-clear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#CFE6CE" />
            <stop offset="1" stopColor="#B2D3AC" />
          </linearGradient>
          <radialGradient id="w2d-sun" cx="0.5" cy="0.36" r="0.5">
            <stop offset="0" stopColor="#FBFFE6" stopOpacity="0.5" />
            <stop offset="1" stopColor="#FBFFE6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="w2d-mist-t" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.34" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="w2d-mist-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.34" />
          </linearGradient>
          <radialGradient id="w2d-water" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#A7E0E6" />
            <stop offset="0.6" stopColor="#6FC2D8" />
            <stop offset="1" stopColor="#4FA9CF" />
          </radialGradient>
          <linearGradient id="w2d-meadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C8E89E" stopOpacity="0" />
            <stop offset="1" stopColor="#C8E89E" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#w2d-clear)" />

        {/* gò đất nhấp nhô (undulating ground mounds) */}
        {[[60, 640, 150, 60], [300, 900, 150, 62], [70, 1280, 160, 64], [300, 1640, 160, 66], [70, 2000, 160, 66], [300, 2320, 170, 70]].
        map(([cx, cy, rx, ry], i) =>
        <ellipse key={`md${i}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#AFD0A0" opacity="0.5" />
        )}

        <rect x="40" y="400" width="280" height="1700" fill="url(#w2d-sun)" />

        {/* far treeline (rừng sâu) — mờ + nhỏ tạo độ xa */}
        <g opacity="0.5">
          {[[40, 120, 72, true], [122, 78, 54, true], [250, 70, 58, true], [330, 132, 66, true], [30, 320, 60, true], [336, 340, 64, true]].
          map(([x, y, h, dk], i) => <PineTree key={`far${i}`} x={x} y={y} h={h} dark={dk} />)}
        </g>

        {/* dense dark forest walls hugging both edges */}
        <EdgeForest side="l" />
        <EdgeForest side="r" />

        {/* dây leo (vines) buông từ đỉnh artboard */}
        <Vine x={44} len={300} dir={1} />
        <Vine x={150} len={196} dir={-1} />
        <Vine x={322} len={344} dir={-1} />
        <Vine x={252} len={172} dir={1} />

        {/* big tree trunks at the edges */}
        <BigTrunk x={66} y={540} h={210} />
        <BigTrunk x={298} y={300} h={200} />
        <BigTrunk x={300} y={820} h={210} />
        <BigTrunk x={58} y={1320} h={200} />
        <BigTrunk x={302} y={1640} h={210} />
        <BigTrunk x={60} y={2080} h={200} />
        <BigTrunk x={300} y={2380} h={210} />

        {/* tall layered PINES along edges (with ground shadow) */}
        {[
        [78, 560, 104, true], [292, 360, 120, true], [70, 900, 110, true],
        [298, 700, 126, false], [82, 1180, 112, true], [292, 1080, 122, true],
        [70, 1480, 116, false], [300, 1420, 128, true], [80, 1760, 114, true],
        [294, 1720, 124, false], [72, 2060, 118, true], [300, 2040, 128, true],
        [82, 2340, 116, true], [294, 2320, 126, false], [76, 2560, 110, true]].
        map(([x, y, h, dk], i) => <PineTree key={`pn${i}`} x={x} y={y} h={h} dark={dk} />)}

        {/* round lush trees mixed in for variety */}
        {[[300, 540, 72], [62, 740, 76], [298, 980, 70], [64, 1620, 80], [300, 1900, 78], [66, 2240, 82]].
        map(([x, y, h], i) => <LushTree key={`lt${i}`} x={x} y={y} h={h} />)}

        {/* leafy plants / ferns at the clearing edges */}
        {[[96, 1160, 34], [284, 1300, 30], [90, 1560, 32], [288, 1760, 30], [92, 2100, 34], [286, 2300, 30], [98, 760, 30]].
        map(([x, y, s], i) => <LeafyPlant key={`lp${i}`} x={x} y={y} s={s} />)}

        {/* low bushes at tree bases */}
        {[[104, 600], [276, 640], [100, 980], [280, 1120], [104, 1380], [276, 1540],
        [100, 1820], [282, 2000], [104, 2260], [278, 2420]].
        map(([x, y], i) => <Bush key={`bs${i}`} x={x} y={y} r={16 + i % 3 * 4} />)}

        {/* mushroom clusters */}
        <Mushroom x={108} y={1180} w={26} color="purple" />
        <Mushroom x={124} y={1194} w={17} color="pink" />
        <Mushroom x={280} y={1900} w={24} color="pink" />
        <Mushroom x={104} y={2300} w={28} color="mint" />

        {/* pebbles */}
        {[[290, 560, 13], [98, 1010, 14], [284, 1460, 11], [102, 1780, 13], [288, 2280, 14]].
        map(([x, y, r], i) => <Pebble key={`pb${i}`} x={x} y={y} r={r} />)}

        {/* grass tufts in the clearing */}
        {[[150, 700], [220, 760], [160, 980], [248, 1180], [158, 1380], [232, 1560],
        [150, 1820], [240, 2000], [160, 2240], [232, 2440], [186, 2560], [196, 1100]].
        map(([x, y], i) => <GrassTuft key={`gt${i}`} x={x} y={y} />)}

        {/* daisies + a few colored forest flowers */}
        {[[150, 660], [236, 720], [156, 940], [250, 1140], [154, 1340], [236, 1520],
        [152, 1780], [244, 1960], [158, 2200], [236, 2400]].
        map(([x, y], i) => <Daisy key={`ds${i}`} x={x} y={y} />)}
        <SmallFlower x={120} y={2000} c="#F08A7E" />
        <SmallFlower x={286} y={1180} c="#FFB14D" />
        <SmallFlower x={110} y={1540} c="#F08A7E" />

        {/* WORLD 3 water hint near the top (node 20 sát vùng nước) */}
        <g opacity="0.92">
          <ellipse cx="132" cy="118" rx="108" ry="44" fill="url(#w2d-water)" />
          <ellipse cx="132" cy="106" rx="82" ry="28" fill="#BFEAF0" opacity="0.5" />
          {[94, 116, 138].map((y, i) =>
          <path key={`wv${i}`} d={`M 44 ${y} q 22 -6 44 0 t 44 0 t 44 0`} fill="none" stroke="#FFFFFF" strokeWidth="1.8" opacity={0.5 - i * 0.12} strokeLinecap="round" />
          )}
        </g>

        {/* WORLD 1 grass/meadow transition at the bottom (node 11) */}
        <rect x="0" y={H - 240} width={W} height="240" fill="url(#w2d-meadow)" />
        {[[150, 2520], [212, 2560], [120, 2582], [250, 2540]].map(([x, y], i) =>
        <GrassTuft key={`mg${i}`} x={x} y={y} c="#86C76A" />
        )}
        <Daisy x={140} y={2542} />
        <Daisy x={252} y={2576} />

        {/* dappled light through canopy (lốm đốm sáng) */}
        {[[140, 820], [250, 1180], [120, 1520], [244, 1880], [150, 2160], [232, 900]].map(([x, y], i) =>
        <ellipse key={`dp${i}`} cx={x} cy={y} rx={26 - i * 2} ry={14 - i} fill="#FBFFE0" opacity="0.28" />
        )}

        {/* sương rừng sâu (mist) hai đầu artboard */}
        <rect x="0" y="0" width={W} height="220" fill="url(#w2d-mist-t)" />
        <rect x="0" y={H - 260} width={W} height="260" fill="url(#w2d-mist-b)" />

        {/* soft clouds at the very bottom */}
        <Cloud x={70} y={2540} s={1.0} />
        <Cloud x={296} y={2560} s={0.9} />

        {/* drifting jelly characters */}
        <FloatJelly x={300} y={1180} size={20} color="mint" delay="0s" />
        <FloatJelly x={62} y={2010} size={22} color="yellow" delay="0.8s" />
        <FloatJelly x={300} y={2290} size={18} color="pink" delay="1.4s" />
      </svg>);

  }

  function EdgeForest({ side }) {
    const isL = side === 'l';
    const X = (v) => isL ? v : W - v;
    const els = [];
    for (let y = -30, i = 0; y < H + 80; y += 130, i++) {
      const c = i % 3 === 0 ? '#2A6836' : i % 3 === 1 ? '#316F3C' : '#387943';
      els.push(<circle key={`a${i}`} cx={X(16 + i % 2 * 22)} cy={y} r={98} fill={c} />);
      els.push(<circle key={`b${i}`} cx={X(70 + (i % 2 ? -18 : 0))} cy={y + 58} r={64} fill={i % 2 ? '#316F3C' : '#387943'} />);
    }
    for (let y = 20, i = 0; y < H; y += 168, i++) {
      els.push(<circle key={`f${i}`} cx={X(58)} cy={y} r={40} fill="#4E9551" />);
      els.push(<ellipse key={`h${i}`} cx={X(48)} cy={y - 24} rx={18} ry={10} fill="#6FB36E" opacity="0.5" />);
    }
    return <g>{els}</g>;
  }

  function PineTree({ x, y, h = 104, dark = false }) {
    const w = h * 0.46;
    const back = dark ? '#2C6A38' : '#357640';
    const mid = dark ? '#357640' : '#3F8048';
    const front = dark ? '#3F8048' : '#4E9551';
    const hi = dark ? '#4E9551' : '#62A766';
    const tiers = 4;const items = [];
    for (let i = 0; i < tiers; i++) {
      const ty = y - h * 0.16 - i * (h * 0.23);
      const tw = w * (1 - i * 0.19);
      const th = h * 0.30;
      items.push(
        <g key={i}>
          <path d={`M ${x} ${ty - th} L ${x + tw} ${ty} L ${x - tw} ${ty} Z`} fill={i % 2 ? mid : front} stroke={back} strokeWidth="1" strokeLinejoin="round" />
          <path d={`M ${x} ${ty - th} L ${x - tw * 0.5} ${ty - th * 0.04} L ${x} ${ty - th * 0.12} Z`} fill={hi} opacity="0.45" />
        </g>
      );
    }
    return (
      <g style={{ filter: 'drop-shadow(0 4px 4px rgba(40,70,30,0.22))' }}>
        <ellipse cx={x} cy={y + 2} rx={w * 0.98} ry={w * 0.30} fill="rgba(40,70,30,0.20)" />
        <rect x={x - 3.5} y={y - 3} width="7" height={h * 0.16} rx="3" fill="#7A5530" stroke="#5E3F20" strokeWidth="1.2" />
        {items}
      </g>);

  }

  function LushTree({ x, y, h = 64, dark = false }) {
    const r = h * 0.6;
    const back = dark ? '#357640' : '#4E9551';
    const main = dark ? '#3F8048' : '#5DA858';
    const front = dark ? '#4E9551' : '#6FB36E';
    const hi = dark ? '#5DA858' : '#8CC97E';
    return (
      <g style={{ filter: 'drop-shadow(0 5px 5px rgba(40,70,30,0.22))' }}>
        <ellipse cx={x} cy={y + 2} rx={r * 0.95} ry={r * 0.30} fill="rgba(40,70,30,0.20)" />
        <rect x={x - 4} y={y - h * 0.26} width="8" height={h * 0.40} rx="4" fill="#8A6239" stroke="#6B4A28" strokeWidth="1.5" />
        <g fill={back}>
          <circle cx={x - r * 0.56} cy={y - h * 0.56} r={r * 0.66} />
          <circle cx={x + r * 0.56} cy={y - h * 0.60} r={r * 0.66} />
          <circle cx={x} cy={y - h * 0.98} r={r * 0.82} />
          <circle cx={x} cy={y - h * 0.56} r={r * 0.72} />
        </g>
        <g fill={main}>
          <circle cx={x - r * 0.50} cy={y - h * 0.60} r={r * 0.50} />
          <circle cx={x + r * 0.50} cy={y - h * 0.64} r={r * 0.50} />
          <circle cx={x} cy={y - h * 1.02} r={r * 0.66} />
          <circle cx={x} cy={y - h * 0.62} r={r * 0.58} />
        </g>
        <g fill={front}>
          <circle cx={x - r * 0.28} cy={y - h * 0.86} r={r * 0.34} />
          <circle cx={x + r * 0.10} cy={y - h * 1.04} r={r * 0.34} />
        </g>
        <ellipse cx={x - r * 0.22} cy={y - h * 1.12} rx={r * 0.28} ry={r * 0.16} fill={hi} opacity="0.8" />
      </g>);

  }

  function BigTrunk({ x, y, h = 200 }) {
    return (
      <g>
        <ellipse cx={x} cy={y} rx="24" ry="9" fill="rgba(40,70,30,0.22)" />
        <rect x={x - 14} y={y - h} width="28" height={h} rx="8" fill="#6B4828" stroke="#523619" strokeWidth="2" />
        <path d={`M ${x - 6} ${y - h * 0.72} q -4 ${h * 0.25} 0 ${h * 0.46}`} fill="none" stroke="#523619" strokeWidth="1.6" opacity="0.5" />
        <path d={`M ${x + 7} ${y - h * 0.52} q -4 ${h * 0.18} 0 ${h * 0.32}`} fill="none" stroke="#523619" strokeWidth="1.6" opacity="0.5" />
        <ellipse cx={x - 4} cy={y - h * 0.5} rx="3" ry="5" fill="#523619" opacity="0.5" />
      </g>);

  }

  function LeafyPlant({ x, y, s = 30, dark = false }) {
    const leaves = [-58, -30, -2, 26, 54];
    const c1 = dark ? '#3F8048' : '#4E9551',c2 = dark ? '#4E9551' : '#5DA858',hi = dark ? '#5DA858' : '#6FB36E';
    return (
      <g style={{ filter: 'drop-shadow(0 3px 2px rgba(40,70,30,0.20))' }}>
        <ellipse cx={x} cy={y} rx={s * 0.5} ry={s * 0.16} fill="rgba(40,70,30,0.16)" />
        {leaves.map((a, i) =>
        <path key={i} d={`M ${x} ${y} Q ${x - 6} ${y - s * 0.66} ${x} ${y - s} Q ${x + 6} ${y - s * 0.66} ${x} ${y} Z`} fill={i % 2 ? c1 : c2} stroke="#357640" strokeWidth="0.8" transform={`rotate(${a} ${x} ${y})`} />
        )}
        <path d={`M ${x} ${y} Q ${x - 5} ${y - s * 0.66} ${x} ${y - s} Q ${x + 5} ${y - s * 0.66} ${x} ${y} Z`} fill={hi} />
      </g>);

  }

  function Bush({ x, y, r = 16 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 3px 3px rgba(40,70,30,0.18))' }}>
        <ellipse cx={x} cy={y + r * 0.4} rx={r * 0.95} ry={r * 0.26} fill="rgba(40,70,30,0.16)" />
        <g fill="#3F8048">
          <ellipse cx={x - r * 0.55} cy={y} rx={r * 0.72} ry={r * 0.56} />
          <ellipse cx={x + r * 0.55} cy={y} rx={r * 0.72} ry={r * 0.56} />
          <ellipse cx={x} cy={y - r * 0.24} rx={r * 0.86} ry={r * 0.62} />
        </g>
        <g fill="#5DA858">
          <ellipse cx={x - r * 0.4} cy={y - r * 0.06} rx={r * 0.5} ry={r * 0.38} />
          <ellipse cx={x + r * 0.4} cy={y - r * 0.08} rx={r * 0.5} ry={r * 0.38} />
          <ellipse cx={x} cy={y - r * 0.34} rx={r * 0.6} ry={r * 0.44} />
        </g>
        <ellipse cx={x - r * 0.2} cy={y - r * 0.46} rx={r * 0.18} ry={r * 0.1} fill="#8CC97E" opacity="0.6" />
      </g>);

  }
  function GrassTuft({ x, y, c = '#7FC06C' }) {
    return (
      <g stroke={c} strokeWidth="2.6" strokeLinecap="round" fill="none">
        {[-7, -2.5, 2.5, 7].map((a, i) =>
        <path key={i} d={`M ${x + a} ${y} q ${a * 0.4} ${-9} ${a * 0.32} ${-15}`} />
        )}
      </g>);

  }
  function Pebble({ x, y, r = 12 }) {
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(40,70,30,0.20))' }}>
        <ellipse cx={x} cy={y} rx={r} ry={r * 0.72} fill="#BCB6AB" stroke="#9C9488" strokeWidth="1.5" />
        <ellipse cx={x - r * 0.3} cy={y - r * 0.26} rx={r * 0.4} ry={r * 0.22} fill="#D6D1C7" opacity="0.75" />
      </g>);

  }
  function Daisy({ x, y }) {
    return (
      <g style={{ filter: 'drop-shadow(0 1px 1px rgba(40,70,30,0.15))' }}>
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const rad = a * Math.PI / 180;
          return <ellipse key={a} cx={x + Math.cos(rad) * 4} cy={y + Math.sin(rad) * 4} rx="2.6" ry="1.8" fill="#FFFFFF" transform={`rotate(${a} ${x + Math.cos(rad) * 4} ${y + Math.sin(rad) * 4})`} />;
        })}
        <circle cx={x} cy={y} r="2.4" fill="#FFCA4D" />
      </g>);

  }
  function SmallFlower({ x, y, c = '#F08A7E' }) {
    return (
      <g>
        {[0, 72, 144, 216, 288].map((a) => {const r = a * Math.PI / 180;return <circle key={a} cx={x + Math.cos(r) * 3} cy={y + Math.sin(r) * 3} r="2.2" fill={c} />;})}
        <circle cx={x} cy={y} r="1.7" fill="#FFD24D" />
      </g>);

  }
  function Mushroom({ x, y, w = 22, color = 'pink' }) {
    const pal = {
      pink: { fill: '#F7A9C0', shine: '#FBD0DF', edge: '#E576A0' },
      yellow: { fill: '#FFE3A3', shine: '#FFF1CE', edge: '#E8B85C' },
      mint: { fill: '#A3E5D9', shine: '#CBF2EB', edge: '#5FC3B2' },
      purple: { fill: '#B7A8F4', shine: '#D9D0FB', edge: '#8E7CF4' }
    }[color] || { fill: '#F7A9C0', shine: '#FBD0DF', edge: '#E576A0' };
    return (
      <g style={{ filter: 'drop-shadow(0 3px 2px rgba(40,70,30,0.20))' }}>
        <rect x={x - w * 0.18} y={y - w * 0.08} width={w * 0.36} height={w * 0.55} rx={w * 0.16} fill="#FCF1DC" stroke="#E2C896" strokeWidth="1.2" />
        <ellipse cx={x} cy={y - w * 0.12} rx={w * 0.58} ry={w * 0.42} fill={pal.fill} stroke={pal.edge} strokeWidth="1.6" />
        <ellipse cx={x - w * 0.16} cy={y - w * 0.27} rx={w * 0.24} ry={w * 0.12} fill={pal.shine} opacity="0.92" />
        <circle cx={x - w * 0.20} cy={y - w * 0.10} r={w * 0.08} fill="#FFFFFF" opacity="0.9" />
        <circle cx={x + w * 0.18} cy={y - w * 0.18} r={w * 0.06} fill="#FFFFFF" opacity="0.9" />
      </g>);

  }
  function Cloud({ x, y, s = 1 }) {
    return (
      <g opacity="0.95">
        <ellipse cx={x} cy={y} rx={42 * s} ry={16 * s} fill="#FFFFFF" />
        <ellipse cx={x - 24 * s} cy={y + 4 * s} rx={24 * s} ry={12 * s} fill="#FFFFFF" />
        <ellipse cx={x + 26 * s} cy={y + 5 * s} rx={22 * s} ry={11 * s} fill="#FFFFFF" />
      </g>);

  }
  function FloatJelly({ x, y, size, color, delay }) {
    const p = {
      yellow: { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' },
      mint: { f: '#A3E5D9', e: '#5FC3B2', s: '#CBF2EB' },
      pink: { f: '#F7A9C0', e: '#E576A0', s: '#FBD0DF' },
      blue: { f: '#B3C7F7', e: '#7E9CE8', s: '#D6E1FB' }
    }[color] || { f: '#FFE3A3', e: '#E8B85C', s: '#FFF1CE' };
    return (
      <g style={{ animation: 'gj-fd-float 3.6s ease-in-out infinite', animationDelay: delay,
        transformOrigin: `${x}px ${y}px`, filter: 'drop-shadow(0 4px 3px rgba(40,70,30,0.22))' }}>
        <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={Math.round(size * 0.28)}
        fill={p.f} stroke={p.e} strokeWidth="2" />
        <ellipse cx={x} cy={y - size * 0.18} rx={size * 0.34} ry={size * 0.12} fill={p.s} opacity="0.95" />
        <circle cx={x - size * 0.18} cy={y - size * 0.04} r={size * 0.07} fill="#3B2A18" />
        <circle cx={x + size * 0.18} cy={y - size * 0.04} r={size * 0.07} fill="#3B2A18" />
      </g>);

  }

  function Vine({ x, len = 280, dir = 1 }) {
    const d = `M ${x} -6 C ${x + dir * 20} ${len * 0.3}, ${x - dir * 16} ${len * 0.62}, ${x + dir * 8} ${len}`;
    const leaves = [0.4, 0.62, 0.82];
    return (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(40,70,30,0.18))' }}>
        <path d={d} fill="none" stroke="#4E9551" strokeWidth="4" strokeLinecap="round" />
        {leaves.map((t, i) => {
          const ly = len * t;const lx = x + dir * (i % 2 ? -11 : 12);
          return <ellipse key={i} cx={lx} cy={ly} rx="8" ry="4.5" fill={i % 2 ? '#5DA858' : '#6FB36E'} transform={`rotate(${dir * 38} ${lx} ${ly})`} />;
        })}
        <ellipse cx={x + dir * 8} cy={len + 1} rx="9" ry="5" fill="#6FB36E" transform={`rotate(${dir * 30} ${x + dir * 8} ${len})`} />
      </g>);

  }

  // đá cuội jelly (bo tròn mềm) ở các khúc cua đường mòn
  function JellyRock({ x, y, w, h }) {
    return (
      <div style={{
        position: 'absolute', left: x, top: y, width: w, height: h,
        background: 'linear-gradient(165deg,#DBD0BF 0%,#C9BCA8 52%,#B3A289 100%)',
        border: '3px solid #A89A82',
        borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
        boxShadow: '0 7px 11px rgba(40,70,30,0.28), inset 0 4px 0 rgba(255,255,255,0.45), inset 0 -5px 0 rgba(120,100,70,0.22)',
        zIndex: 4
      }}>
        <div style={{ position: 'absolute', left: '22%', top: '20%', width: '36%', height: '26%', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
      </div>);

  }
  function Rocks() {
    const R = [
    [264, 700, 52, 40], [92, 1000, 44, 34], [268, 1340, 56, 44],
    [92, 1740, 46, 36], [266, 2120, 52, 42], [120, 2300, 40, 32]];
    return (
      <React.Fragment>
        {R.map(([x, y, w, h], i) => <JellyRock key={i} x={x} y={y} w={w} h={h} />)}
      </React.Fragment>);

  }

  // ─── path: lòng đường TRẮNG + vết rêu + chấm bi beige sậm ─────────
  function PathLayer() {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{ position: 'absolute', inset: 0, display: 'block', pointerEvents: 'none' }}>
        {/* bóng đổ */}
        <path d={FULL_PATH} fill="none" stroke="rgba(40,70,30,0.24)"
        strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,7)" />
        {/* vành kem */}
        <path d={FULL_PATH} fill="none" stroke="#EADBB6"
        strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" />
        {/* lòng đường TRẮNG */}
        <path d={FULL_PATH} fill="none" stroke="#FFFFFF"
        strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        {/* vết rêu loang trên đường */}
        <path d={FULL_PATH} fill="none" stroke="#86C06A"
        strokeWidth="26" strokeLinecap="round" strokeDasharray="12 70" opacity="0.20" />
        {/* tim đường chấm bi beige sậm */}
        <path d={FULL_PATH} fill="none" stroke="#D8C49A"
        strokeWidth="7" strokeLinecap="round" strokeDasharray="0.5 30" />
      </svg>);

  }

  // ─── stars / node primitives (BẢNG 7 BIẾN THỂ hệ thống) ───────────
  function Star({ filled = false, size = 14 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z"
        fill={filled ? '#FFC23D' : '#D9CDB5'} stroke={filled ? '#E0A21F' : '#B6A892'}
        strokeWidth="1.6" strokeLinejoin="round" />
      </svg>);

  }
  function StarArc({ stars = 3, size = 14, width = 64 }) {
    return (
      <div style={{
        position: 'absolute', left: '50%', top: -size - 6, transform: 'translateX(-50%)',
        width, height: size + 8, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', pointerEvents: 'none'
      }}>
        <div style={{ transform: 'translateY(5px) rotate(-22deg)' }}><Star filled={stars >= 1} size={size} /></div>
        <div style={{ transform: 'translateY(-2px)' }}><Star filled={stars >= 2} size={size + 2} /></div>
        <div style={{ transform: 'translateY(5px) rotate(22deg)' }}><Star filled={stars >= 3} size={size} /></div>
      </div>);

  }
  function NumberBadge({ n, size, color = '#6A4A2E' }) {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.40), lineHeight: 1,
        color, textShadow: '0 1px 0 rgba(255,255,255,0.55)', pointerEvents: 'none'
      }}>{n}</div>);

  }
  function LockGlyph({ size = 18 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
        <path d="M8 11V8.5a4 4 0 1 1 8 0V11" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="5" y="11" width="14" height="9" rx="2.5" fill="#FFFFFF" />
        <circle cx="12" cy="15" r="1.4" fill="#A89A82" />
        <rect x="11.3" y="15" width="1.4" height="3" rx="0.6" fill="#A89A82" />
      </svg>);

  }

  function DoneNode({ n, color, stars, size = 64 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 5px 7px rgba(40,70,30,0.26))' }}>
        <JellyBlock color={color} size={size} showEyes={false} />
        <NumberBadge n={n} size={size} />
        <StarArc stars={stars} size={14} width={size + 14} />
      </div>);

  }
  function LockedRegularNode({ n, size = 60 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 5px rgba(40,70,30,0.22))' }}>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.40), lineHeight: 1,
          color: '#7A6A50', textShadow: '0 1px 0 rgba(255,255,255,0.40)', pointerEvents: 'none'
        }}>{n}</div>
        <StarArc stars={0} size={12} width={size + 8} />
        <div style={{
          position: 'absolute', right: -4, bottom: -4, width: 24, height: 24, borderRadius: '50%',
          background: '#8A7B62', border: '2px solid #FFFFFF', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 2px 4px rgba(40,70,30,0.34)'
        }}>
          <LockGlyph size={13} />
        </div>
      </div>);

  }
  function CurrentNode({ n, size = 64 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: -16, top: -16, width: size + 32, height: size + 32, borderRadius: '50%', background: 'rgba(255,159,104,0.24)', animation: 'gj-fd-pulse 1600ms ease-out infinite' }} />
        <div style={{ position: 'absolute', left: -5, top: -5, width: size + 10, height: size + 10, borderRadius: '50%', background: 'rgba(255,159,104,0.34)', animation: 'gj-fd-pulse 1600ms ease-out infinite', animationDelay: '320ms' }} />
        <div style={{
          position: 'relative', width: size, height: size, borderRadius: '50%', background: '#FFFFFF', border: '3px solid #FF9F68',
          boxShadow: '0 6px 14px rgba(40,70,30,0.26), inset 0 -4px 0 rgba(255,159,104,0.16), inset 0 3px 0 rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width={size - 16} height={size - 16} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#FFC59A" strokeWidth="2" strokeDasharray="3 4" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#E97E45' }}>{n}</div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)', animation: 'gj-fd-hop 1400ms ease-in-out infinite', filter: 'drop-shadow(0 4px 4px rgba(40,70,30,0.30))' }}>
          <JellyBlock color="pink" size={38} direction="down" expression="happy" />
        </div>
        <div style={{
          position: 'absolute', left: '50%', top: size + 10, transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, #FFB07F 0%, #FF9F68 60%, #F58A4E 100%)', color: '#FFFFFF',
          border: '2px solid #E97E45', borderBottom: '3px solid #C8662F', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
          padding: '5px 14px 6px', borderRadius: 999, boxShadow: '0 6px 12px rgba(201,102,47,0.35), inset 0 2px 0 rgba(255,197,154,0.6)', whiteSpace: 'nowrap'
        }}>Chơi ngay</div>
      </div>);

  }
  function BreatherNode({ n, size = 48 }) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: -10, left: size + 8, background: '#FFFFFF', color: '#8C7458', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.10em', padding: '4px 10px', borderRadius: 999, boxShadow: '0 3px 8px rgba(40,70,30,0.22)', whiteSpace: 'nowrap' }}>NGHỈ</div>
        <div style={{ position: 'absolute', top: -6, left: size + 4, width: 10, height: 10, borderRadius: '50%', background: '#FFD074', border: '1.5px solid #E0A21F' }} />
        <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 4px 5px rgba(40,70,30,0.24))', opacity: 0.92 }}>
          <JellyBlock color="stone" size={size} showEyes={false} />
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={`M ${size * 0.30} ${size * 0.45} q 4 4 8 0`} fill="none" stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${size * 0.55} ${size * 0.45} q 4 4 8 0`} fill="none" stroke="#6A5A40" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: size * 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.28), lineHeight: 1, color: '#7A6A50', textShadow: '0 1px 0 rgba(255,255,255,0.40)', pointerEvents: 'none' }}>{n}</div>
        </div>
      </div>);

  }
  function BossNode({ n, size = 80 }) {
    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 8px 14px rgba(126,108,240,0.40))' }}>
        <div style={{ position: 'absolute', left: -28, top: -28, right: -28, bottom: -28, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(169,156,246,0.55) 0%, rgba(126,108,240,0.30) 55%, rgba(126,108,240,0) 78%)', animation: 'gj-fd-halo 2400ms ease-in-out infinite' }} />
        <svg width={size + 56} height={size + 56} viewBox="0 0 200 200" style={{ position: 'absolute', left: -28, top: -28, pointerEvents: 'none', animation: 'gj-fd-spin 8s linear infinite', transformOrigin: '50% 50%' }}>
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const rad = a * Math.PI / 180;const cx = 100 + Math.cos(rad) * 84;const cy = 100 + Math.sin(rad) * 84;
            return <g key={a}><circle cx={cx} cy={cy} r="4.5" fill="#FFFFFF" opacity="0.95" /><circle cx={cx} cy={cy} r="2.5" fill="#A99CF6" /></g>;
          })}
        </svg>
        <JellyBlock color="stone" size={size} showEyes={false} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: size * 0.5, height: size * 0.5, borderRadius: '50%', background: 'linear-gradient(180deg,#8E7CF4 0%, #6353D6 100%)', border: '3px solid #FFFFFF', boxShadow: '0 4px 10px rgba(83,68,196,0.5), inset 0 2px 0 rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LockGlyph size={Math.round(size * 0.28)} />
          </div>
        </div>
        <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(180deg, #8E7CF4 0%, #7E6CF0 60%, #5F4ECB 100%)', color: '#FFFFFF', border: '2px solid #6353D6', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', padding: '4px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(83,68,196,0.45), inset 0 1.5px 0 rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>BOSS</div>
      </div>);

  }

  // bệ tròn (đĩa kem) dưới mỗi node
  function Pedestal({ x, top, w, z }) {
    return (
      <div style={{
        position: 'absolute', left: x - w / 2, top, width: w, height: w * 0.42, borderRadius: '50%',
        background: 'radial-gradient(125% 150% at 50% 22%, #FCF4DF 0%, #F3E5C0 62%, #E7D3A4 100%)',
        border: '2px solid #E2CE9C',
        boxShadow: '0 9px 14px rgba(40,70,30,0.30), inset 0 2px 0 rgba(255,255,255,0.8)',
        zIndex: z
      }} />);

  }

  function PlaceNode({ node }) {
    let inner = null,half = 32,z = 5;
    if (node.kind === 'boss') {inner = <BossNode n={node.id} size={80} />;half = 40;z = 14;} else
    if (node.kind === 'breather') {inner = <BreatherNode n={node.id} size={48} />;half = 24;} else
    if (node.state === 'current') {inner = <CurrentNode n={node.id} size={64} />;half = 32;z = 12;} else
    if (node.state === 'done') {inner = <DoneNode n={node.id} color={node.color} stars={node.stars} size={64} />;half = 32;} else
    {inner = <LockedRegularNode n={node.id} size={60} />;half = 30;}
    const pedW = half * 2 * 1.5;
    return (
      <React.Fragment>
        <Pedestal x={node.x} top={node.y + half * 0.34} w={pedW} z={z - 1} />
        <div style={{ position: 'absolute', left: node.x - half, top: node.y - half, zIndex: z }}>
          {inner}
        </div>
      </React.Fragment>);

  }

  // ─── BẢNG GỖ tên thế giới (góc trên) ──────────────────────────────
  function WoodenSign() {
    return (
      <div style={{ position: 'absolute', right: 18, top: 132, width: 150, zIndex: 16, filter: 'drop-shadow(0 8px 12px rgba(30,50,20,0.40))' }}>
        <div style={{ position: 'absolute', left: 26, top: 58, width: 12, height: 56, background: 'linear-gradient(90deg,#7A4E24,#9C6A35,#7A4E24)', borderRadius: 3 }} />
        <div style={{ position: 'absolute', right: 26, top: 58, width: 12, height: 56, background: 'linear-gradient(90deg,#7A4E24,#9C6A35,#7A4E24)', borderRadius: 3 }} />
        <div style={{
          position: 'relative', padding: '12px 12px 14px', borderRadius: 14,
          background: 'linear-gradient(180deg,#C58A4C 0%,#B07A42 55%,#9E6C38 100%)',
          border: '4px solid #7A4E24',
          boxShadow: 'inset 0 3px 0 rgba(255,225,180,0.5), inset 0 -3px 0 rgba(80,50,20,0.4)'
        }}>
          <div style={{ position: 'absolute', left: 8, right: 8, top: '46%', height: 2, background: 'rgba(120,76,36,0.5)', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: 8, right: 8, top: '70%', height: 2, background: 'rgba(120,76,36,0.35)', borderRadius: 2 }} />
          {[[6, 6], [6, 6], [6, 6], [6, 6]].map((_, i) =>
          <div key={i} style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: '#E8C277', border: '1px solid #7A4E24', top: i < 2 ? 6 : 'auto', bottom: i >= 2 ? 6 : 'auto', left: i % 2 ? 'auto' : 6, right: i % 2 ? 6 : 'auto' }} />
          )}
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#FFF7EC', textShadow: '0 2px 0 rgba(90,55,20,0.55)' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.14em', color: '#FFE9C6', opacity: 0.95 }}>THẾ GIỚI 2</div>
            <div style={{ fontSize: 22, lineHeight: 1.05, marginTop: 2 }}>Rừng rậm</div>
          </div>
          <svg width="30" height="22" viewBox="0 0 30 22" style={{ position: 'absolute', left: -10, bottom: -8 }}>
            <path d="M2 20 Q 10 6 26 2" fill="none" stroke="#4E9551" strokeWidth="3" strokeLinecap="round" />
            {[[10, 12], [16, 8], [22, 5]].map(([cx, cy], i) =>
            <ellipse key={i} cx={cx} cy={cy} rx="5" ry="3" fill="#5DA858" transform={`rotate(-30 ${cx} ${cy})`} />
            )}
          </svg>
        </div>
      </div>);

  }

  function StartSign() {
    return (
      <div style={{ position: 'absolute', left: '50%', top: H - 80, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 16 }}>
        <div style={{ background: '#FFFFFF', color: '#5B4636', border: '1.5px solid #E6D8BD', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', padding: '6px 14px', borderRadius: 999, boxShadow: '0 4px 10px rgba(40,70,30,0.24)', textTransform: 'uppercase' }}>Rừng rậm · tiếp tục</div>
      </div>);

  }

  function World2ForestDraft() {
    return (
      <div style={{ position: 'relative', width: W, height: H, background: 'var(--color-bg, #FFF7EC)', fontFamily: 'var(--font-body)', color: 'var(--color-text, #5B4636)', overflow: 'hidden' }}>
        <style>{`
          @keyframes gj-fd-pulse { 0%{transform:scale(0.9);opacity:0.8} 70%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0} }
          @keyframes gj-fd-hop   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-6px)} }
          @keyframes gj-fd-halo  { 0%,100%{transform:scale(1.00);opacity:1} 50%{transform:scale(1.12);opacity:0.85} }
          @keyframes gj-fd-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes gj-fd-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
        `}</style>
        <Scene />
        <PathLayer />
        <Rocks />
        <WoodenSign />
        {NODES.map((n) => <PlaceNode key={n.id} node={n} />)}
        <StartSign />
      </div>);

  }

  window.GJWorld2ForestDraft = World2ForestDraft;
})();
