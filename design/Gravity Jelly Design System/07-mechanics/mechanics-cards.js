/* mechanics-cards.js — declarative registry for every "THẺ CƠ CHẾ".
   window.GJ_MECH_CARDS[id] → { group, name, subtitle, caption, kind, ... }.
   Board cards: kind 'board' (default) with before/after MiniBoard configs +
   action. Widget cards: kind = a window.GJMechW key + its props.
   Render with GJMech.renderById(id, rootEl). */

(function () {
  const grav = { A: 'Trọng lực', B: 'Cụm / Màu', C: 'Hazard', D: 'Khay', E: 'Mục tiêu', F: 'Boss', G: 'Meta' };

  const C = {
    /* ===================== A · TRỌNG LỰC ===================== */
    a1: {
      group: grav.A, name: 'Xoay 90°', subtitle: 'Cơ chế chữ ký — chạm để xoay trọng lực 90°, cả bàn đổ lại theo hướng mới',
      before: { rows: ['.....', '....Y', '..YMY', '.MMPB', '.PP.B'], direction: 'down' },
      action: { icon: 'rotate', label: 'Xoay ←' },
      after: { rows: ['YM...', 'MMP..', 'YMPB.', 'PPB..', 'YB...'], direction: 'left', glow: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] },
      caption: 'Chạm để xoay 90° — cả bàn đổ lại theo hướng mới.',
    },
    a2: {
      group: grav.A, name: 'Lật ngược 180°', subtitle: 'Lật ngược cả bàn một phát — tốn 2 lượt xoay',
      before: { rows: ['.....', '.....', '.PMB.', 'YPMBY', 'YPMBY'], direction: 'down' },
      action: { icon: 'rotate', label: '↑↓ 180° · −2 lượt' },
      after: { rows: ['YPMBY', 'YPMBY', '.PMB.', '.....', '.....'], direction: 'up' },
      caption: 'Lật ngược cả bàn một phát — tốn 2 lượt xoay.',
    },
    a3: {
      group: grav.A, name: 'Trọng lực chéo', subtitle: 'Dồn cả bàn về một góc — combo lạ, dùng dè',
      before: { rows: ['Y...M', '..P..', '.B...', '...Y.', 'M...P'], direction: 'down' },
      action: { icon: 'arrow', label: 'Dồn ↘' },
      after: { rows: ['.....', '.....', '...YP', '..MBY', '.PMBP'], direction: 'right' },
      caption: 'Dồn cả bàn về một góc — combo lạ, dùng dè.',
    },
    a4: {
      group: grav.A, name: 'Trọng lực điểm', subtitle: 'Mọi khối hút về tâm — sân khấu cho màn Vũ trụ / boss',
      before: { rows: ['YM.PB', 'P...M', '.....', 'M...P', 'BP.MY'], direction: 'down', deco: { '2,2': { type: 'target' } } },
      action: { icon: 'rays', label: 'Hút tâm' },
      after: { rows: ['.....', '.YMP.', '.B.B.', '.PMY.', '.....'], direction: 'down', deco: { '2,2': { type: 'target' } } },
      caption: 'Mọi khối hút về tâm — sân khấu cho màn Vũ trụ / boss.',
    },
    a5: {
      group: grav.A, name: 'Chia vùng', subtitle: 'Hai nửa bàn, hai chiều trọng lực ngược nhau',
      before: { rows: ['YMPBY', '.....', '.....', '.....', 'BPMYB'], direction: 'down', divider: { after: 2 } },
      action: { icon: null, label: '↓  giữa  ↑' },
      after: { rows: ['.....', '.....', 'YMPBY', 'BPMYB', '.....'], direction: 'down', divider: { after: 2 } },
      caption: 'Hai nửa bàn, hai chiều trọng lực ngược nhau.',
    },
    a6: {
      group: grav.A, name: 'Đảo tự động', subtitle: 'Môi trường tự đảo trọng lực theo nhịp — đặc trị màn / boss',
      before: { rows: ['.....', '.....', '.YMP.', 'BYMPB', 'BYMPB'], direction: 'down' },
      action: { icon: 'clock', label: 'Tự đảo sau 2 lượt', tone: 'warning' },
      after: { rows: ['BYMPB', 'BYMPB', '.YMP.', '.....', '.....'], direction: 'up' },
      caption: 'Môi trường tự đảo trọng lực theo nhịp — đặc trị màn / boss.',
    },
    a7: {
      group: grav.A, name: 'Không trọng lực', subtitle: 'Khối đứng yên giữa không trung vài lượt rồi mới rơi',
      before: { rows: ['.....', '.Y.P.', '...M.', '.B...', '.....'], direction: 'down', deco: { '1,1': { type: 'float' }, '1,3': { type: 'float' }, '2,3': { type: 'float' }, '3,1': { type: 'float' } } },
      action: { icon: null, label: 'Zero-G · 2 lượt' },
      after: { rows: ['.....', '.....', '.....', '...M.', '.YBP.'], direction: 'down' },
      caption: 'Khối đứng yên giữa không trung vài lượt rồi mới rơi.',
    },
    a8: {
      group: grav.A, name: 'Combo hồi xoay', subtitle: 'Tạo combo lớn được thưởng thêm một lượt xoay',
      before: { rows: ['.P...', '.P.B.', '.PMB.', '.PMB.', '.P.B.'], direction: 'down', glow: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]] },
      action: { icon: 'star', label: '+1 lượt xoay' },
      after: { rows: ['.....', '...B.', '..MB.', '..MB.', '...B.'], direction: 'down' },
      caption: 'Tạo combo lớn được thưởng thêm một lượt xoay (1 → 2).',
    },
    a9: {
      group: grav.A, name: 'Khoá xoay', subtitle: 'Bị khoá xoay vài lượt — phải xoay sở bằng đặt mảnh',
      kind: 'fabLock',
      caption: 'Bị khoá xoay vài lượt — phải xoay sở bằng đặt mảnh.',
    },
    a10: {
      group: grav.A, name: 'Xoay cục bộ', subtitle: 'Chỉ một cụm đổi hướng rơi — biến thể thử nghiệm',
      before: { rows: ['.YY..', '.YY..', '.....', '...PB', '...PB'], direction: 'down', glow: [[0, 1], [0, 2], [1, 1], [1, 2]], deco: { '3,3': { type: 'dim' }, '3,4': { type: 'dim' }, '4,3': { type: 'dim' }, '4,4': { type: 'dim' } } },
      action: { icon: 'rotate', label: 'Xoay riêng cụm' },
      after: { rows: ['.....', '.....', '.....', 'YY.PB', 'YY.PB'], direction: 'down' },
      caption: 'Chỉ một cụm đổi hướng rơi — biến thể thử nghiệm.',
    },

    /* ===================== B · CỤM / MÀU ===================== */
    b0: {
      group: grav.B, name: 'Hợp nhất → Siêu khối', subtitle: 'Cơ chế chủ lực — gom 9 ô cùng màu thành 1 siêu khối',
      before: { rows: ['.....', '.MMM.', '.MMM.', '.MMM.', '.....'], direction: 'front', glow: [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3]] },
      action: { icon: 'star', label: 'Hợp nhất' },
      after: { rows: ['.....', '.....', '..o..', '.....', '.....'], superAt: [2, 2, 'mint'] },
      caption: 'Gom 9 ô cùng màu → 1 siêu khối; xóa chạm nó = nổ lớn.',
    },
    b0b: {
      group: grav.B, name: 'Nổ siêu khối', subtitle: 'Siêu khối nổ 3×3 — combo khủng, ở boss = sát thương nặng',
      before: { rows: ['.....', '.YYY.', '.Y.Y.', '.YYY.', '.....'], direction: 'down', superAt: [2, 2, 'mint'], glow: [[1, 1], [1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2], [3, 3]] },
      action: { icon: 'bomb', label: 'Kích nổ', tone: 'danger' },
      after: { rows: ['B...P', '.....', '.....', '.....', 'Y...M'], direction: 'down' },
      caption: 'Siêu khối nổ 3×3 — combo khủng, ở boss = sát thương nặng.',
    },
    b1: {
      group: grav.B, name: 'Combo leo thang', subtitle: 'Xóa liên tiếp nuôi bội số combo — đứt nhịp thì reset',
      kind: 'comboMeter',
      caption: 'Xóa liên tiếp nuôi bội số combo — đứt nhịp thì reset.',
    },
    b2: {
      group: grav.B, name: 'Xóa toàn 1 màu', subtitle: 'Xóa trọn hàng toàn 1 màu → thưởng 1 Khối Cầu Vồng + điểm hàng ×2',
      before: { rows: ['.....', '.....', '.....', 'PPPPP', 'BYMBY'], direction: 'down', glow: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]] },
      action: { icon: 'star', label: 'MÀU HOÀN HẢO · ×2 điểm', tone: 'success' },
      after: { rows: ['..R..', '.....', '.....', '.....', 'BYMBY'], direction: 'down', rainbow: [[0, 2]], glow: [[0, 2]] },
      afterLabel: 'PHẦN THƯỞNG',
      caption: '“Màu hoàn hảo” = xóa trọn một hàng toàn 1 màu. Thưởng: điểm hàng đó ×2 và 1 Khối Cầu Vồng (ghép được mọi màu) rơi vào khay.',
    },
    b3: {
      group: grav.B, name: 'Khối cầu vồng', subtitle: 'Cụm 3×3 (9 ô) gồm 3 màu — 3 ô mỗi màu — hợp nhất thành Khối Cầu Vồng',
      before: { rows: ['.....', '.YYY.', '.MMM.', '.PPP.', '.....'], direction: 'down', glow: [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3]] },
      action: { icon: 'star', label: 'Hợp nhất cụm 3 màu', tone: 'gravity' },
      after: { rows: ['.....', '.....', '..R..', '.....', '.....'], direction: 'down', rainbow: [[2, 2]], glow: [[2, 2]] },
      caption: 'Cụm 3×3 đủ 9 ô gồm 3 màu khác nhau (3 ô mỗi màu) hợp nhất thành 1 Khối Cầu Vồng — ghép được mọi màu.',
    },
    b4: {
      group: grav.B, name: 'Siêu khối cấp 2', subtitle: 'Gộp 2 siêu khối → đại nổ cả hàng lẫn cột',
      before: { rows: ['.....', '.....', '.oo..', '.....', '.....'], supers: [[2, 1, 'mint'], [2, 2, 'mint']] },
      action: { icon: 'star', label: 'Gộp 2 siêu khối' },
      after: { rows: ['.....', '.....', '..o..', '.....', '.....'], superAt: [2, 2, 'mint'], mega: true, glow: [[0, 2], [1, 2], [3, 2], [4, 2], [2, 0], [2, 1], [2, 3], [2, 4]] },
      caption: 'Gộp 2 siêu khối → đại nổ cả hàng lẫn cột.',
    },
    b5: {
      group: grav.B, name: 'Cụm nặng', subtitle: 'Cụm to rơi mạnh, đè vỡ ô yếu / băng phía dưới',
      before: { rows: ['.BBB.', '.BBB.', '.....', '.....', '..M..'], direction: 'down', deco: { '4,2': { type: 'ice' } } },
      action: { icon: 'heavy', label: 'Cụm nặng rơi' },
      after: { rows: ['.....', '.....', '.BBB.', '.BBB.', '..M..'], direction: 'down', glow: [[4, 2]] },
      caption: 'Cụm to rơi mạnh, đè vỡ ô yếu / băng phía dưới.',
    },
    b6: {
      group: grav.B, name: 'Ô nhuộm', subtitle: 'Ô nhuộm biến các ô kề sang màu nó — hỗ trợ gom màu',
      before: { rows: ['.....', '.YMY.', '.MPM.', '.YMY.', '.....'], direction: 'down', deco: { '2,2': { type: 'dye' } } },
      action: { icon: null, label: 'Sóng nhuộm', tone: 'gravity' },
      after: { rows: ['.....', '.YPY.', '.PPP.', '.YPY.', '.....'], direction: 'down', deco: { '2,2': { type: 'dye' } } },
      caption: 'Ô nhuộm biến các ô kề sang màu nó — hỗ trợ gom màu.',
    },
    b7: {
      group: grav.B, name: 'Mầm tách màu', subtitle: 'Xóa cụm để lại mầm màu khác — chuỗi mục tiêu nối tiếp',
      before: { rows: ['.....', '.MMM.', '.MMM.', '.MMM.', '.....'], direction: 'down', glow: [[2, 2]] },
      action: { icon: 'star', label: 'Xóa cụm' },
      after: { rows: ['.....', '.....', '..B..', '.....', '.....'], direction: 'down', deco: { '2,2': { type: 'seed' } } },
      caption: 'Xóa cụm để lại mầm màu khác — chuỗi mục tiêu nối tiếp.',
    },

    /* ===================== C · HAZARD ===================== */
    cpool: {
      group: grav.C, name: 'Bảng modifier', subtitle: 'Bộ ô đặc biệt sẵn có — băng, khoá, tường, bom, đá nở, trượt…',
      kind: 'modifierPalette',
      items: [
        { ch: 'M', deco: { type: 'ice' }, label: 'Ô băng' },
        { ch: 'Y', deco: { type: 'lock' }, label: 'Ô khoá' },
        { ch: 'B', deco: { type: 'arrow' }, label: 'Tường 1 chiều' },
        { ch: 'P', deco: { type: 'hidden' }, label: 'Ẩn preview' },
        { ch: 'P', deco: { type: 'bomb' }, label: 'Ô bom' },
        { ch: 'S', deco: { type: 'expand' }, label: 'Đá nở' },
        { ch: 'M', deco: { type: 'slide' }, label: 'Ô trượt' },
        { ch: 'B', deco: { type: 'heavy' }, label: 'Cụm nặng' },
        { ch: 'Y', deco: { type: 'norotate' }, label: 'Cấm xoay' },
      ],
      caption: 'Kho ô modifier dùng lại khắp các màn — ghép tuỳ độ khó.',
    },
    c1: {
      group: grav.C, name: 'Ô xích', subtitle: 'Hai ô xích nối nhau — xóa cùng lúc mới ăn',
      before: { rows: ['.....', '.Y...', '.....', '...M.', '.....'], direction: 'down', chains: [[[1, 1], [3, 3]]], glow: [[1, 1], [3, 3]] },
      action: { icon: 'star', label: 'Xóa cùng lúc' },
      after: { rows: ['.....', '.....', '.....', '.....', '.....'], direction: 'down' },
      caption: 'Hai ô xích nối nhau — xóa cùng lúc mới ăn.',
    },
    c2: {
      group: grav.C, name: 'Ô đếm ngược', subtitle: 'Không xóa trong N lượt, ô hoá đá — ép nhịp',
      before: { rows: ['.YM..', '..B..', '..P..', '.MB..', '.....'], direction: 'down', deco: { '2,2': { type: 'clock', num: 2 } } },
      action: { icon: 'clock', label: 'Không xóa kịp', tone: 'warning' },
      after: { rows: ['.YM..', '..B..', '..S..', '.MB..', '.....'], direction: 'down' },
      caption: 'Không xóa trong N lượt, ô hoá đá — ép nhịp.',
    },
    c3: {
      group: grav.C, name: 'Cổng dịch chuyển', subtitle: 'Cụm rơi vào cổng A, ra ở cổng B — câu đố trọng lực',
      before: { rows: ['.....', '.YM..', '.....', '.....', '.....'], direction: 'down', deco: { '0,0': { type: 'portal' }, '4,4': { type: 'portal' } } },
      action: { icon: 'portal', label: 'Qua cổng' },
      after: { rows: ['.....', '.....', '.....', '...Y.', '...M.'], direction: 'down', deco: { '0,0': { type: 'portal' }, '4,4': { type: 'portal' } } },
      caption: 'Cụm rơi vào cổng A, ra ở cổng B — câu đố trọng lực.',
    },
    c4: {
      group: grav.C, name: 'Ô keo', subtitle: 'Cụm dính keo không rơi dù xoay — chướng ngại cứng đầu',
      before: { rows: ['.....', '.YY..', '.YY..', '.....', 'P.B.M'], direction: 'down', deco: { '1,1': { type: 'sticky' } } },
      action: { icon: 'rotate', label: 'Xoay' },
      after: { rows: ['.....', '.YY..', '.YY..', '.....', '...PBM'.slice(0, 5)], direction: 'right', deco: { '1,1': { type: 'sticky' } } },
      caption: 'Cụm dính keo không rơi dù xoay — chướng ngại cứng đầu.',
    },
    c5: {
      group: grav.C, name: 'Ô nam châm', subtitle: 'Nam châm hút mảnh đặt gần lệch về phía nó',
      before: { rows: ['.....', '..B..', '.....', '...P.', '.....'], direction: 'down', deco: { '1,2': { type: 'magnet' } } },
      action: { icon: 'magnet', label: 'Lực hút', tone: 'danger' },
      after: { rows: ['.....', '..B..', '.....', '..P..', '.....'], direction: 'down', deco: { '1,2': { type: 'magnet' } } },
      caption: 'Nam châm hút mảnh đặt gần lệch về phía nó.',
    },
    c6: {
      group: grav.C, name: 'Ô gai', subtitle: 'Ô gai cấm đặt lên — phải đi vòng',
      before: { rows: ['..P..', '.....', '.....', '.....', '.....'], direction: 'down', deco: { '2,1': { type: 'spike' }, '2,2': { type: 'spike' }, '2,3': { type: 'spike' } } },
      action: { icon: null, label: 'Cấm đặt', tone: 'danger' },
      after: { rows: ['.....', '.....', '.....', '.P...', '.....'], direction: 'down', deco: { '2,1': { type: 'spike' }, '2,2': { type: 'spike' }, '2,3': { type: 'spike' } } },
      caption: 'Ô gai cấm đặt lên — phải đi vòng.',
    },
    c7: {
      group: grav.C, name: 'Đá rơi', subtitle: 'Đá tự dội từ trên mỗi vài lượt — sức ép endless / boss',
      before: { rows: ['.....', '.....', '.YMP.', '.YMPB', '.YMPB'], direction: 'down' },
      action: { icon: 'heavy', label: 'Sắp rơi đá', tone: 'warning' },
      after: { rows: ['SSSSS', '.....', '.YMP.', '.YMPB', '.YMPB'], direction: 'down', glow: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
      caption: 'Đá tự dội từ trên mỗi vài lượt — sức ép endless / boss.',
    },
    c8: {
      group: grav.C, name: 'Ô đổi hướng', subtitle: 'Chạm ô đổi hướng, riêng cụm đó rơi theo hướng mới',
      before: { rows: ['.....', '.YY..', '.YYB.', '.....', '.....'], direction: 'down', deco: { '2,3': { type: 'arrow' } } },
      action: { icon: 'arrow', label: 'Đổi hướng →' },
      after: { rows: ['.....', '.....', '...YY', '...YY', '.....'], direction: 'right', deco: { '2,3': { type: 'arrow' } } },
      caption: 'Chạm ô đổi hướng, riêng cụm đó rơi theo hướng mới.',
    },

    /* ===================== D · KHAY ===================== */
    d1: {
      group: grav.D, name: 'Giữ mảnh (Hold)', subtitle: 'Giữ tạm một mảnh để dành — gỡ thế bí', kind: 'trayHold',
      before: [{ rows: ['YY', 'Y.'] }, { rows: ['MMM'] }, { rows: ['.P', 'PP'] }],
      held: { rows: ['BB', 'BB'] },
      after: [{ rows: ['MM', '.M'] }, { rows: ['MMM'] }, { rows: ['.P', 'PP'] }],
      caption: 'Giữ tạm một mảnh để dành — gỡ thế bí.',
    },
    d2: {
      group: grav.D, name: 'Xem trước 2 đợt', subtitle: 'Nhìn trước đợt khay kế — lập kế hoạch xa hơn', kind: 'trayPreview',
      current: [{ rows: ['YY', 'Y.'] }, { rows: ['MMM'] }, { rows: ['.P', 'PP'] }],
      next: [{ rows: ['BB'] }, { rows: ['M.', 'MM'] }, { rows: ['PP', 'PP'] }],
      caption: 'Nhìn trước đợt khay kế — lập kế hoạch xa hơn.',
    },
    d3: {
      group: grav.D, name: 'Mảnh đá', subtitle: 'Khay xen mảnh đá — buộc đặt rác, tăng khó', kind: 'tray',
      pieces: [{ rows: ['YY', 'Y.'] }, { rows: ['SSS'] }, { rows: ['.P', 'PP'] }],
      caption: 'Khay xen mảnh đá — buộc đặt rác, tăng khó.',
    },
    d4: {
      group: grav.D, name: 'Mảnh hai màu', subtitle: 'Mảnh hai màu — gom màu thành thử thách', kind: 'tray',
      pieces: [{ rows: ['MM', '.M'] }, { rows: ['YP', 'YP'] }, { rows: ['BB'] }],
      caption: 'Mảnh hai màu — gom màu thành thử thách.',
    },
    d5: {
      group: grav.D, name: 'Khay đơn', subtitle: 'Phát từng mảnh một — chế độ cho cao thủ', kind: 'traySingle',
      piece: { rows: ['.Y', 'YY'] },
      caption: 'Phát từng mảnh một — chế độ cho cao thủ.',
    },
    d6: {
      group: grav.D, name: 'Mảnh khổng lồ', subtitle: 'Thỉnh thoảng một mảnh khổng lồ — khoảnh khắc đổi nhịp', kind: 'trayGiant',
      giant: { rows: ['BBB', 'BBB'] },
      small: [{ rows: ['YY'] }, { rows: ['PP'] }],
      caption: 'Thỉnh thoảng một mảnh khổng lồ — khoảnh khắc đổi nhịp.',
    },

    /* ===================== E · MỤC TIÊU ===================== */
    e1: {
      group: grav.E, name: 'Giải cứu', subtitle: 'Mục tiêu rất chất riêng — điều trọng lực đưa bé jelly tới cửa ra',
      before: { rows: ['..p..', '.Y.B.', 'YMMB.', '.BYM.', '.....'], direction: 'down', pet: [[0, 2]], petExpr: 'focus', deco: { '4,2': { type: 'gate' } } },
      action: { icon: 'rotate', label: 'Mở lối' },
      after: { rows: ['.....', '.Y.B.', 'YMMB.', '.BYM.', '..p..'], direction: 'down', pet: [[4, 2]], petExpr: 'happy' },
      caption: 'Điều trọng lực đưa bé jelly tới cửa ra an toàn.',
    },
    e2: {
      group: grav.E, name: 'Đào mục tiêu', subtitle: 'Bóc từng lớp để chạm ô đích bị chôn sâu',
      before: { rows: ['.....', '.YYY.', '.MMM.', '.PtP.', '.....'].map((r) => r.replace('t', '.')), direction: 'down', deco: { '3,2': { type: 'target' } } },
      action: { icon: 'star', label: 'Bóc từng lớp' },
      after: { rows: ['.....', '.....', '.....', '..t..', '.....'].map((r) => r.replace('t', '.')), direction: 'down', deco: { '3,2': { type: 'target' } } },
      caption: 'Bóc từng lớp để chạm ô đích bị chôn sâu.',
    },
    e3: {
      group: grav.E, name: 'Cấm xoay', subtitle: 'Thử thách ngược: ghi điểm mà không được xoay', kind: 'goalNoRotate',
      title: 'Đạt 500 điểm', counter: 'KHÔNG dùng xoay',
      caption: 'Thử thách ngược: ghi điểm mà không được xoay.',
    },
    e4: {
      group: grav.E, name: 'Mục tiêu màu', subtitle: 'Chỉ tính số ô đúng màu yêu cầu được xóa', kind: 'goalColor',
      title: 'Xóa 12 ô MINT', counter: '5 / 12', frac: 5 / 12,
      caption: 'Chỉ tính số ô đúng màu yêu cầu được xóa.',
    },
    e5: {
      group: grav.E, name: 'Dọn tuyệt đối', subtitle: 'Dọn bàn về đúng 0 ô — thưởng cực lớn',
      before: { rows: ['.....', '.....', '.....', '..M..', '.YB.P'], direction: 'down', glow: [[3, 2], [4, 1], [4, 2], [4, 4]] },
      action: { icon: 'star', label: 'PERFECT! ×bonus', tone: 'success' },
      after: { rows: ['.....', '.....', '.....', '.....', '.....'], direction: 'down', deco: { '2,2': { type: 'target' } } },
      caption: 'Dọn bàn về đúng 0 ô — thưởng cực lớn.',
    },

    /* ===================== F · BOSS ===================== */
    f1: {
      group: grav.F, name: 'Boss hút trọng lực', subtitle: 'Boss giành quyền trọng lực, kéo cả bàn về phía nó', kind: 'bossBoard',
      boss: { mood: 'angry', hp: 1, world: 8, crownStrip: true },
      before: { rows: ['.....', '.....', '.YMP.', 'BYMPB', 'BYMPB'], direction: 'down' },
      action: { icon: 'rays', label: 'Boss hút', tone: 'gravity' },
      after: { rows: ['BYMPB', 'BYMPB', '.YMP.', '.....', '.....'], direction: 'up' },
      caption: 'Boss giành quyền trọng lực, kéo cả bàn về phía nó.',
    },
    f2: {
      group: grav.F, name: 'Boss đóng băng', subtitle: 'Boss đóng băng một vùng bàn vài lượt', kind: 'bossBoard',
      boss: { mood: 'normal', hp: 1 },
      before: { rows: ['.....', '.YMP.', '.BYM.', '.....', '.....'], direction: 'down' },
      action: { icon: 'snow', label: 'Đóng băng · 3 lượt', tone: 'info' },
      after: { rows: ['.....', '.MMM.', '.MMM.', '.MMM.', '.....'], direction: 'down', deco: { '1,1': { type: 'ice' }, '1,2': { type: 'ice' }, '1,3': { type: 'ice' }, '2,1': { type: 'ice' }, '2,2': { type: 'ice' }, '2,3': { type: 'ice' }, '3,1': { type: 'ice' }, '3,2': { type: 'ice' }, '3,3': { type: 'ice' } } },
      caption: 'Boss đóng băng một vùng bàn vài lượt.',
    },
    f3: {
      group: grav.F, name: 'Boss khoá màu', subtitle: 'Boss khoá một màu — chặn nguồn sát thương của bạn', kind: 'bossLockColor',
      title: 'Cấm tạo siêu khối MINT', counter: 'Còn 2 lượt',
      caption: 'Boss khoá một màu — chặn nguồn sát thương của bạn.',
    },
    f4: {
      group: grav.F, name: 'Điểm yếu boss', subtitle: 'Phải nổ siêu khối trúng điểm yếu mới gây sát thương lớn', kind: 'bossBoard',
      boss: { mood: 'angry', hp: 0.35 },
      before: { rows: ['.....', '..B..', '.....', '..o..', '.....'], direction: 'down', superAt: [3, 2, 'mint'], deco: { '1,2': { type: 'weak' } }, glow: [[1, 2]] },
      action: { icon: 'bomb', label: 'Nổ trúng điểm yếu', tone: 'danger' },
      after: { rows: ['.....', '.....', '.....', '.....', '.....'], direction: 'down', deco: { '1,2': { type: 'target' } } },
      caption: 'Phải nổ siêu khối trúng điểm yếu mới gây sát thương lớn.',
    },
    f5: {
      group: grav.F, name: 'Boss đổi pha', subtitle: 'Mất nửa máu, boss đổi bộ đòn sang pha 2', kind: 'bossPhases',
      caption: 'Mất nửa máu, boss đổi bộ đòn sang pha 2.',
    },
    f6: {
      group: grav.F, name: 'Boss phản công', subtitle: 'Boss dội đá vào đúng cột bạn vừa dọn — cẩn thận ức chế', kind: 'bossBoard',
      boss: { mood: 'angry', hp: 0.6 },
      before: { rows: ['Y.MPB', 'Y.MPB', 'Y.MPB', 'Y.MPB', 'Y.MPB'], direction: 'down' },
      action: { icon: 'arrow', label: 'Boss nhắm cột', tone: 'danger' },
      after: { rows: ['YSMPB', 'YSMPB', 'YSMPB', 'YSMPB', 'YSMPB'], direction: 'down', glow: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]] },
      caption: 'Boss dội đá vào đúng cột bạn vừa dọn — cẩn thận ức chế.',
    },

    /* ===================== G · META ===================== */
    g1: {
      group: grav.G, name: 'Buff trọng lực', subtitle: 'Đầu chặng, chọn 1 buff — đều xoay quanh trọng lực', kind: 'buffChoice',
      buffs: [
        { icon: 'rotate', name: '+1 lượt xoay', desc: 'mỗi màn' },
        { icon: 'star', name: 'Siêu khối ngưỡng 6', desc: 'gom 6 đã merge' },
        { icon: 'bomb', name: 'Nổ to hơn', desc: '+1 ô bán kính' },
      ],
      caption: 'Đầu chặng, chọn 1 buff — đều xoay quanh trọng lực.',
    },
    g2: {
      group: grav.G, name: 'Power-up', subtitle: 'Power-up tiêu thụ, nạp thêm bằng xem quảng cáo thưởng', kind: 'powerupBar',
      items: [
        { icon: 'hammer', name: 'Búa (phá 1 ô)', count: 2 },
        { icon: 'row', name: 'Xóa hàng', count: 1 },
        { icon: 'swap', name: 'Đổi màu', count: 3 },
        { icon: 'rotate', name: '+1 Xoay', count: 1 },
      ],
      caption: 'Power-up tiêu thụ, nạp thêm bằng xem quảng cáo thưởng.',
    },
    g3: {
      group: grav.G, name: 'Thử thách hôm nay', subtitle: 'Một bàn mỗi ngày, cùng seed — so tài offline', kind: 'dailyCard',
      date: 'Hôm nay · 27/06',
      board: ['Y.MP.', '.YMPB', 'YYM.B', '.PMBB', 'P.MYB'],
      ranks: [{ name: 'Bạn', score: '18.420' }, { name: 'An', score: '16.900' }, { name: 'Bình', score: '15.110' }],
      caption: 'Một bàn mỗi ngày, cùng seed — so tài offline.',
    },
    g4: {
      group: grav.G, name: 'Streak ngày', subtitle: 'Chuỗi ngày chơi liên tục — giữ lửa quay lại', kind: 'streakWidget',
      days: [{ done: true }, { done: true }, { done: true }, { today: true }, {}, {}, {}],
      caption: 'Chuỗi ngày chơi liên tục — giữ lửa quay lại.',
    },
  };

  window.GJ_MECH_CARDS = C;
  window.GJ_MECH_ORDER = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'b0', 'b0b', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'cpool', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'e1', 'e2', 'e3', 'e4', 'e5', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'g1', 'g2', 'g3', 'g4'];
})();
