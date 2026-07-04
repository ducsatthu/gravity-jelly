# Cơ chế Dây Leo (Vine) — World 2 · Rừng rậm

Cập nhật 03/07/2026. Tài liệu kỹ thuật + thiết kế cho cơ chế chữ ký World 2.

## Tổng quan

Dây leo là chướng ngại vật **mọc lan** trên bàn, bám cứng (không rơi theo trọng lực).
Người chơi phải xóa dòng đi qua **gốc** (có khối MINT trên dòng) để diệt dây.
Cơ chế thuần deterministic (cùng seed + input = cùng kết quả), headless trong `:core`.

**Source code:** `core/src/main/kotlin/com/gravityjelly/core/Vine.kt`

## Mô hình 5 phần

Dây leo gồm 5 trạng thái rời rạc, mỗi phần có hành vi riêng:

### 1. Rễ (Root)

- Ô `CellType.VINE` với `vineRoot = true`.
- **Bám cứng** — không rơi theo trọng lực/xoay.
- **Rễ mọc 3 hướng** — `[ngược trọng lực, phải, trái]` (`rootGrowOrder`). Rễ **KHÔNG bao giờ đâm mầm
  xuôi chiều trọng lực**. (Trồi/cành thì mọc đủ 4 hướng — xem bước 2/3.)
- Mỗi cây (một gốc) nuôi **tối đa 4 mầm** (`MAX_SPROUTS_PER_ROOT = 4`) — cap độ rậm. "Mầm" = số ngọn
  (tip/lá) đang phát triển. Rễ phân nhánh mới hay cành đâm nhánh phụ chỉ khi **số mầm hiện có < 4**.
- **Mỗi lượt cả dây của 1 gốc chỉ sinh tối đa 1 mầm mới** (`MAX_GROW_PER_TURN = 1`), tính chung cả
  trồi/cành/rễ. KHÔNG có burst lượt đầu (gốc trần cũng chỉ 1 mầm/lượt).
- **Phá gốc:** xóa dòng đi qua gốc **có ≥1 khối MINT** trên dòng → gốc bị xóa (`destroyVineOfRoot`).
  Dòng xóa qua gốc **KHÔNG có MINT** → gốc sống sót (surviving root, skip trong animation).
- Khi gốc bị phá: chỉ xóa ô gốc. Các đốt cành/trồi mất kết nối → chuyển sang **Cành countdown** (bước 4).

### 2. Trồi (Shoot / Tip)

- Ô `CellType.VINE` **lá** — không có ô con trong cây (đầu ngọn một nhánh). **Mỗi lá là một tip
  độc lập**: sau mỗi lần rẽ nhánh, *cả hai* ngọn con đều là tip riêng, tự nối dài, quản lý riêng.
- Mỗi lượt mọc, trồi tìm **ô trống kề gần nhất** theo thứ tự ưu tiên **đủ 4 hướng**:
  `[ngược trọng lực, phải, theo trọng lực, trái]` (hàm `branchGrowOrder`).
- Trồi **ưu tiên mọc trước** cành. Nối dài tip **không** tạo mầm mới → không tính vào cap 4.

### 3. Cành (Branch)

- Ô `CellType.VINE` có con trong cây (không phải tip, không phải gốc). Ô nào rẽ ≥2 con là **điểm
  tách nhánh** — đóng vai như một "sub-rễ", mỗi nhánh con là một luồng độc lập.
- **Bám cứng** — không rơi.
- **Chỉ khi mọi tip bị chặn**, cành mới **phát sinh mầm phụ** (side shoot, đủ 4 hướng) sang ô trống kề.
- Đâm nhánh phụ **tạo mầm mới** → tính vào cap 4 (chỉ được nếu số mầm hiện có < 4).
- Ưu tiên mọc **sau trồi**, trước rễ (tip → cành → rễ).

### 4. Cành có countdown (Wilting)

- Ô `CellType.TRASH` với `trashCountdown > 0`.
- Xuất hiện khi cành/trồi **mất kết nối gốc** (hàm `wiltDisconnectedVines`).
- Bắt đầu đếm ngược = `WILT_COUNTDOWN = 10` lượt.
- Mỗi lượt thả mảnh: countdown giảm 1 (hàm `tickTrashCountdown`).
- **Đếm là "đầy"** cho line clear → có thể bị phá bằng xóa hàng/cột đầy.
- **Bám cứng** — không rơi. Chặn khối thường rơi qua.
- Render: khối dây leo bị cắt + badge số đếm ngược (`drawTrashCell`).

### 5. Rác chết (Dead Debris)

- Ô `CellType.TRASH` với `trashCountdown = 0`.
- **KHÔNG đếm là "đầy"** → chặn line clear (hàng chứa rác chết không bao giờ "đầy").
- Chỉ bị phá bởi **siêu khối / cầu vồng nổ** (`expandDetonations`).
- Render: lá khô + củi khô (`drawDebrisCell`, bám `block-debris.svg`).

## Quy tắc mọc (`growVines`)

### Thứ tự ưu tiên mỗi lượt

1. **Trồi (tip)** — nối dài lá hiện có (đủ 4 hướng). **Không** tạo mầm mới → không tính cap.
2. **Cành (thân)** — đâm mầm phụ (side shoot, đủ 4 hướng) khi tip bí. Tạo mầm mới → tính cap.
3. **Rễ** — phân nhánh mới (3 hướng, tránh trọng lực) khi tip+cành đều bí. Tạo mầm mới → tính cap.

Sắp xếp deterministic trong mỗi nhóm theo `(y, x)`. **Mỗi lượt CHỈ 1 mầm cho cả dây của 1 gốc**
(`MAX_GROW_PER_TURN = 1`): duyệt ứng viên theo ưu tiên trên, ứng viên **đầu tiên** mọc được 1 ô là
DỪNG. Ứng viên nào **tạo mầm mới** (cành/rễ) chỉ hợp lệ khi số mầm hiện có `< MAX_SPROUTS_PER_ROOT`.

### Giới hạn

| Hằng số | Giá trị | Ý nghĩa |
|---|---|---|
| `vineMaxSprouts` | 4 (`DEFAULT_VINE_MAX_SPROUTS`) | Số **mầm** (ngọn/tip) tối đa mỗi gốc — cap độ rậm. **Cấu hình theo màn** qua `Level.vineMaxSprouts` → `EndlessTuning.vineMaxSprouts` → `growVines(grid, gravity, maxSprouts)` |
| `MAX_GROW_PER_TURN` | 1 | Số mầm mới tối đa mỗi lượt cho CẢ dây của 1 gốc (kể cả lượt đầu gốc trần) |
| `WILT_COUNTDOWN` | 10 | Số lượt đếm ngược trước khi thành rác chết |

### Nhịp mọc

Vine mọc mỗi `vineGrowEveryN` lượt thả (cấu hình trong `EndlessTuning` / `Level`).
Ví dụ `vineGrowEveryN = 2` → mọc sau mỗi 2 lượt.

## Chống ghép nhánh (Anti-merge)

Hàm `wouldLoopOrMerge` kiểm tra mỗi ô mới trước khi mọc. Ô mới **chỉ được kề**:
- Ô cha (parent — trồi hoặc cành đang mọc).
- Ô gốc (root — nút chia chung).

Cấm kề:
- Ô vine **cùng cây** nhưng không phải cha → tạo vòng tròn (loop) / ghép 2 cành cùng gốc.
- Ô vine **cây khác** (không có trong `member` của cây đang xét) → ghép hai dây độc lập.
- Ô **TRASH** (countdown hoặc chết) → "hồi sinh" nhánh chết.

**Hệ quả:** mỗi nhánh luôn là đường thẳng/cong đơn (không vòng), mỗi lá là 1 tip độc lập.
Hai cành cùng gốc không bao giờ ghép dù 2 ô sát nhau; hai dây từ hai gốc khác nhau luôn tách biệt.

## Dựng cây (`buildTree`)

BFS từ gốc, duyệt `Direction.entries` cố định → deterministic. Trả về **tập mọi ô thuộc cây** (`member`)
và **map cha→các con** (`children`). Từ đó suy ra:
- **Lá** (ô không có con) = **tip** độc lập.
- Ô **có con** = **cành**; ô rẽ ≥2 con = **điểm tách nhánh** (mỗi con một luồng độc lập).

Không còn khái niệm "branch ID" gán tại ô-kề-gốc như bản cũ — nay mỗi lá tự là một ngọn, nên sau khi
rẽ nhánh cả hai ngọn con đều được nối dài độc lập (thay vì chỉ ngọn xa nhất được coi là tip).

## Phá dây

### Phá gốc (có MINT)

1. Dòng xóa đi qua gốc + có ≥1 MINT trên dòng → `destroyVineOfRoot`: **chỉ xóa ô gốc**.
2. `wiltDisconnectedVines`: tất cả đốt mất kết nối gốc → `TRASH` với `trashCountdown = WILT_COUNTDOWN`.
3. Mỗi lượt: `tickTrashCountdown` giảm 1. Khi = 0 → rác chết.

### Cắt giữa (không phá gốc)

1. Dòng xóa đi qua đốt (không phải gốc, hoặc gốc không có MINT) → đốt bị xóa.
2. Đốt phía trên đoạn cắt mất kết nối gốc → `wiltDisconnectedVines` → TRASH countdown.
3. Gốc + đốt dưới vẫn sống, tiếp tục mọc (từ lượt sau — xem "Hoãn mọc sau nhát cắt").

### Hoãn mọc sau nhát cắt (`growVinesIfDue`)

**Lượt nào có nhát cắt dây** (phá gốc hoặc đốt héo → phát `VineRootsCleared`) thì **dây KHÔNG mọc
trong chính lượt đó**, và nhịp mọc được đặt lại (`placesSinceGrow = 0`). Người chơi phải được hưởng
thành quả nhát cắt: nếu để dây mọc ngay, gốc/thân còn sống sẽ đẻ mầm mới lấp lại **đúng các ô vừa mở**
trong cùng lượt → ô "mầm sắp tới" bị chặn oan, rồi lượt sau hoá cành đếm ngược. Cắt xong ⇒ dây tạm
ngưng, chờ đủ `vineGrowEveryN` lượt (không-cắt) mới mọc lại. Lượt không cắt vẫn mọc bình thường.

## Tương tác với các hệ khác

| Hệ | Tương tác |
|---|---|
| Trọng lực / xoay | Vine + TRASH bám cứng, KHÔNG rơi. Chặn khối thường rơi qua. |
| Line clear | VINE đếm vào dòng đầy. TRASH countdown > 0 cũng đếm. TRASH countdown = 0 KHÔNG đếm. |
| Siêu khối nổ | Phá được TRASH (cả countdown > 0 lẫn = 0). Phá gốc nếu MINT super. |
| Physics cụm | `isJelly` trả false cho VINE và TRASH → không thuộc cụm, không rơi. |
| Animation | Surviving roots (gốc trên line không MINT) skip trong clear animation (`BoardAnimator`). |

## Render

| Phần | Hàm vẽ | Mô tả |
|---|---|---|
| Gốc | `drawVineRoot` | Khung vuông viền xanh đậm + thân cây |
| Trồi (tip) | `drawVineTip` | Đốt xanh với lá non / mầm ở đầu |
| Cành | `drawVineSegment` | Đốt xanh, nối thân giữa các ô kề |
| Cành countdown | `drawTrashCell` | Khối dây cắt + badge vàng số đếm ngược |
| Rác chết | `drawDebrisCell` | Lá khô + củi khô (bám `block-debris.svg`) |

## File liên quan

| File | Module | Vai trò |
|---|---|---|
| `Vine.kt` | `:core` | Toàn bộ logic vine: grow, wilt, destroy, tick |
| `Grid.kt` | `:core` | `Cell.vineRoot`, `Cell.trashCountdown`, `CellType.VINE/TRASH` |
| `LineClearing.kt` | `:core` | `isFilled`: TRASH countdown > 0 đếm đầy, = 0 không |
| `Resolve.kt` | `:core` | MINT rule, surviving roots, wilt sau clear |
| `EndlessEngine.kt` | `:core` | Nhịp mọc (`vineGrowEveryN`), tick trash, events |
| `VineTest.kt` | `:core` test | Unit test đầy đủ: grow, wilt, anti-merge, countdown, MINT |
| `JellyDraw.kt` | `:game` | `drawTrashCell`, `drawDebrisCell` |
| `BoardAnimator.kt` | `:game` | Surviving roots skip animation |
| `BoardCanvas.kt` | `:game` | Render TRASH conditional (countdown > 0 vs = 0) |
| `CampaignLevels.kt` | `:core` | Cấu hình vine cho L11–L20 |
