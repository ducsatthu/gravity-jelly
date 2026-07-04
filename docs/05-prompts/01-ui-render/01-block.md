# 01 · Block — JellyBlock & Eyes (foundation atoms)

Hạng mục **Block**: khối jelly chữ ký của game — nhân vật, không chỉ ô màu. Đây là atom nền cho mọi thứ khác (board, tray, logo, scene). Làm chuẩn ở đây thì UI và hiệu ứng phía sau "ăn" theo.

**Design nguồn (đọc trước):**
- `design/Gravity Jelly Design System/02-foundations/01-jelly-block/JellyBlock.prompt.md` + `JellyBlock.jsx` + `jelly-block.card.html`
- `design/Gravity Jelly Design System/02-foundations/02-eyes/Eyes.prompt.md` + `Eyes.jsx` + `eyes.card.html`
- Token: `01-tokens/01-colors.css` (fill/edge/shine 4 màu + stone), `03-spacing-radius.css` (radius cell 12, border jelly 3).

**Kotlin hiện có liên quan:** `game/.../JellyDraw.kt`, `game/.../JellyTheme.kt`. Claude Code tự quyết giữ/refactor/dựng lại.

**Đặc tả Block (chốt từ design):**
- Hình: ô bo tròn **đủ 4 góc** (corner sticker không bẻ góc), **viền dày 3dp** màu `edge`, **gloss** (oval sáng `shine` mờ ở 1/3 trên), bên trong là **mắt googly**.
- 4 màu jelly: yellow / mint / pink / blue, mỗi màu bộ ba fill·edge·shine. `stone` = ô cố định (xám ấm, mắt "ngủ" = hai gạch ngang).
- **Corner sticker motif** (nhận diện bằng hình, không chỉ màu): yellow=ngôi sao, mint=lá, pink=tim, blue=giọt nước — sticker nhỏ ở góc.
- `count` = kích thước cụm: mang theo dạng **dữ liệu**, **không vẽ số lên khối** (theo bản design mới nhất).
- **Mắt theo trọng lực:** con ngươi trượt về hướng `direction` (down/up/left/right). Có thể nội suy mượt khi xoay (cho hiệu ứng 02).
- **Expression:** `normal | happy | focus | smug | wink | front` (forward sang Eyes). `blink` = nhắm mắt một nhịp.
- **State động:** `squashed` (squash khi va chạm) và `clearing` (flash/pop khi xóa dòng) — chỉ khai báo tham số/biến trạng thái ở đây; animation thực thi ở file 05.

---

## Prompt 1 — `JellyBlockRenderer`: vẽ khối chuẩn 4 màu + stone + gloss + viền

```
Mục tiêu: lớp vẽ khối jelly trong :game khớp 100% với design foundation JellyBlock.

Đọc trước: design/Gravity Jelly Design System/02-foundations/01-jelly-block/JellyBlock.prompt.md, JellyBlock.jsx, jelly-block.card.html; và 01-tokens/01-colors.css, 03-spacing-radius.css.

Việc:
- Trong :game, tổ chức lại phần vẽ khối thành một đối tượng có trách nhiệm rõ (vd object/class JellyBlockRenderer hoặc nhóm DrawScope extension trong JellyDraw.kt) — tách "vẽ một khối" khỏi "vẽ cả bàn".
- Một hàm vẽ khối nhận: left, top, blockSize, palette (BlockPalette), borderW, cornerRadius. Vẽ theo đúng thứ tự lớp: nền fill (bo md=12dp tỉ lệ theo cell) → gloss (oval shine mờ ~1/3 trên) → viền edge dày 3dp tỉ lệ.
- Lấy màu từ JellyTheme/GjPalette; nếu giá trị nào lệch so 01-colors.css thì sửa token cho khớp (giữ tên token).
- stone: dùng palette stone; KHÔNG mắt googly mà hai gạch ngang (mắt ngủ) — giữ/đưa về đúng card.
- TUYỆT ĐỐI allocation-free trong vùng vẽ: tái dùng, không new Paint/Path/CornerRadius mỗi lần gọi nếu tránh được (precompute theo blockSize).

Acceptance:
- 4 màu + stone vẽ ra khớp jelly-block.card.html về fill/edge/shine, độ dày viền, bo góc, vị trí gloss.
- Không còn literal màu/dp trong code vẽ — tất cả truy ra token có tên.
Kiểm chứng: build :app; thêm/cập nhật một @Preview lưới 5 khối (4 màu + stone) và so mắt với card; báo cáo sai lệch.
Không đụng :core, không thêm luật chơi.
```

## Prompt 2 — `Eyes`: con ngươi theo trọng lực + expressions + blink

```
Mục tiêu: mắt googly khớp foundation Eyes (linh hồn thương hiệu).

Đọc trước: 02-foundations/02-eyes/Eyes.prompt.md, Eyes.jsx, eyes.card.html.

Việc:
- Một hàm/đối tượng vẽ mắt nhận: tâm khối, blockSize, gravity vector (dirX,dirY float để nội suy), expression, open(blink).
- direction: con ngươi trượt về hướng trọng lực (down/up/left/right) — nhận vector float để hiệu ứng xoay nội suy được.
- expression: normal (tracks gravity) · happy (cung "^ ^", nảy nhẹ — dùng khi rơi) · focus (mắt nhìn thẳng + vòng iris) · smug (mí nửa nghiêng) · wink (một mắt nhắm) · front (tròn, ngươi giữa giữa). Tối thiểu hiện thực: normal, front, happy, blink; còn lại có thể xấp xỉ + để hook mở rộng.
- open=false: nhắm (lòng trắng dẹt, giấu ngươi) — dùng cho squash/blink.

Acceptance:
- normal: ngươi nghiêng đúng theo 4 hướng giống eyes.card.html.
- blink/squash: mắt nhắm đúng.
- Hàm vẽ allocation-free.
Kiểm chứng: @Preview một khối với 4 hướng + trạng thái blink; so card.
```

> **Mở rộng (đã hiện thực): mắt sống theo TÍNH CÁCH màu trên bàn.** Hàm vẽ mắt ở đây là nền cho
> cơ chế in-game: khối đứng yên không đông cứng nhìn trọng lực mà mỗi màu có một tính cách (tổ hợp
> đúng 6 expression trên, KHÔNG thêm expression mới). Chi tiết spec + quy tắc settle: **05-hieu-ung.md › Prompt 6**.

## Prompt 3 — Corner sticker motif (sao/lá/tim/giọt)

```
Mục tiêu: thêm sticker góc để khối nhận diện bằng hình, không chỉ màu (theo JellyBlock.prompt.md).

Đọc trước: JellyBlock.jsx (phần sticker/motif), jelly-block.card.html.

Việc:
- Mỗi JellyColor gắn một motif: yellow=ngôi sao, mint=lá, pink=tim, blue=giọt nước. Vẽ nhỏ ở một góc cố định của khối, tông sticker dùng màu shine/edge phù hợp, không che mắt.
- Đặt motif vào JellyBlockRenderer như một bước vẽ tùy chọn (param showSticker mặc định bật cho board/tray). Vẽ bằng Path tái dùng (pool theo motif), allocation-free trong vòng vẽ.
- stone: không sticker.

Acceptance: 4 màu hiện đúng 4 motif, vị trí + tỉ lệ giống card; tắt được qua tham số.
Kiểm chứng: cập nhật @Preview lưới 4 màu kèm sticker; so card.
```

## Prompt 4 — Tham số state động: `squashed` & `clearing` (chưa animate)

```
Mục tiêu: chuẩn bị API cho hiệu ứng — khối nhận trạng thái squash/clearing như tham số biến đổi hình, để file 05 chỉ việc drive giá trị.

Đọc trước: 05-effects/01-drop-squash.md, 05-effects/03-line-clear.md (chỉ để biết hình dạng biến đổi).

Việc:
- Mở rộng hàm vẽ khối nhận: squashScaleX, squashScaleY (mặc định 1,1) và clearProgress (0..1, mặc định 0).
- squash: áp scale quanh tâm khối theo trục (ngang khi gravity ngang, dọc khi gravity dọc) — chỉ biến đổi vẽ, KHÔNG tự chạy thời gian ở đây.
- clearing: clearProgress dẫn brightness/độ phồng/alpha (vd 0→1: sáng lên + scale 1.12 + mờ dần) — chỉ map giá trị, animation do controller bên ngoài cấp.
- Mắt: khi squash mạnh → blink (open=false) một nhịp.

Acceptance: gọi với squash/clear cố định ra đúng hình tĩnh từng mốc; mặc định (1,1,0) = khối thường.
Kiểm chứng: @Preview ba khối ở mốc squash 1.08/0.86 và clearProgress 0/0.5/1; so spec.
Không tự tạo coroutine/animation ở bước này.
```
