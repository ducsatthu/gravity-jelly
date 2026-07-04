# World 1 · Đồng cỏ — Thiết kế màn thủ công (L1–L10)

Cập nhật 01/07/2026 theo **hệ mục tiêu** (`02-he-muc-tieu.md`). World 1 = **TUTORIAL WORLD**:
dạy TOÀN BỘ cơ chế chữ ký — xóa hàng/cột → xoay trọng lực → siêu khối 1&2 → cầu vồng 1&2 → combo → boss.

## Nguyên tắc thiết kế

- **KHÔNG đặt sẵn khối để người chơi chỉ xóa.** Bàn khởi đầu **TRỐNG**; người chơi **TỰ KÉO-THẢ xây**
  nên cấu trúc mục tiêu từ khay. Chỉ boss (L10) có **đá cản** (chướng ngại, không phải khối để xóa).
- **Mục tiêu = TRIGGER (hành động đã xảy ra) / điểm / boss** — luôn khả thi, kiểm chứng bằng event.
  Bỏ hẳn `clear_all` (không tự sinh/xác nhận được nghiệm — xem `02-he-muc-tieu.md §1`).
- **Cơ chế đầy đủ như Endless ở MỌI màn**: `campaignTuning.superMergeEnabled = true` (merge, combo,
  cầu vồng, siêu nổ hoạt động kể cả trước khi qua màn). Khay tutorial **đa màu** để hàng/cột vẫn xóa
  thường, không hoá siêu khối ngoài ý.
- **Sao:** đơn vị = số nước (đặt 1 mảnh) / số xoay / điểm / số nhịp combo — tuỳ màn. Solver chốt cuối.

## Quy ước đọc

- **Toạ độ:** `(cột, hàng)`, cột 0–8 trái→phải, hàng 0–8 trên→xuống. **Trọng lực = xuống** (về hàng 8).
- **Vocab mảnh (người chơi KHÔNG tự xoay):** `1`(đơn) · `I2 I3 I4 I5`(ngang) · `V3`(dọc cao 3) ·
  `L3 L4 J4 T4 S4 Z4 O4 P5`. Mỗi mảnh một màu jelly.
- **Khay (wave):** mỗi đợt 3 mảnh, đặt hết mới phát đợt sau; cạn script → deal RNG (màn điểm/boss).

---

## L1 — "Hàng đầu tiên" · `CLEAR_ROW_FIRST`

- **Board:** trống. **Khay:** `[I5(vàng), I4(mint), I3(hồng)]`. **Xoay:** 0.
- **Mục tiêu:** xóa 1 **hàng** ngang đầu tiên.
- **Giải dự kiến:** đặt I5 cột 0–4 + I4 cột 5–8 ở hàng 8 → đầy 9 ô → xóa. (I3 dư — "không cần dùng hết khay".)
- **Sao (nước):** 3★≤2 · 2★=3 · 1★=4. **Aha:** hàng loé sáng + nổ nhẹ + rung — phản hồi xóa.

## L2 — "Cột đầu tiên" · `CLEAR_COL_FIRST`

- **Board:** trống. **Khay:** `[V3(mint), V3(vàng), V3(hồng)]`. **Xoay:** 0.
- **Mục tiêu:** xóa 1 **cột** dọc đầu tiên.
- **Giải dự kiến:** chồng cả 3 V3 vào **cùng 1 cột** (rows 0–2, 3–5, 6–8) → đầy 9 ô → xóa.
- **Sao:** 3★≤3 · 2★=4 · 1★=5. **Aha:** "à, cột cũng xóa được."

## L3 — "Cú xoay đầu" · `ROTATE_FIRST` ⚠ (ngoại lệ có preset nhỏ)

- **Board:** **preset nhỏ** (ngoại lệ có chủ đích, như boss có đá — vì bàn trống thì xoay không
  thể tạo clear): cột `x=0` lấp `y=0..8` **trừ lỗ hổng `(0,4)`** (8 ô), **+ 1 ô lạc** tại `(8,4)`
  (cùng **hàng 4** với lỗ hổng). **Khay:** `[V3, I3, 1]` (dự phòng). **Xoay:** 2.
- **Mục tiêu:** thực hiện 1 **cú xoay** trọng lực 90° (trigger).
- **Giải dự kiến:** bấm **Xoay TRÁI (←)** → ô lạc `(8,4)` trượt dọc hàng 4 về `x=0` → **lấp đúng
  lỗ `(0,4)`** → cột `x=0` đủ 9 ô → **xóa cột**. Người chơi thấy *cú xoay lùa khối vào chỗ trống
  rồi xóa* — dạy **công dụng** của xoay, không chỉ nút bấm.
- **Sao (số xoay):** 3★≤1 · 2★=2 · 1★=3. **Aha:** "một cú xoay dọn cả cột!"
- ⚠️ **LIỆU NGHIỆM:** cần chơi thử xem preset có bị trọng lực làm rơi lúc load không (ô lạc `(8,4)`
  phải **giữ nguyên hàng 4** tới khi người chơi xoay). Nếu engine settle preset khi load → cần chốt
  lại thế đặt hoặc khoá gravity ban đầu.

## L4 — "Siêu khối" · `MAKE_SUPER1`

- **Board:** trống. **Khay:** `[I3(vàng) ×3]`. **Xoay:** 1.
- **Mục tiêu:** gộp 9 ô cùng màu → **siêu khối cấp 1**.
- **Giải dự kiến:** xếp 3 mảnh I3 vàng chồng thành 3×3 cùng màu (cột 0–2, hàng 6/7/8) → hợp nhất.
- **Sao:** 3★≤3 · 2★=4 · 1★=5. **Aha:** 9 ô co lại thành 1 khối mắt to có vương miện.

## L5 — "Đại nổ" · `MAKE_SUPER2` ⚠

- **Board:** trống. **Khay:** `[I3(vàng) ×6]` (2 đợt). **Xoay:** 2.
- **Mục tiêu:** tạo **siêu khối cấp 2** (đại nổ — quét cùng màu toàn bàn + vùng 5×5).
- **Giải dự kiến:** xây 1 super1, rồi lấp lại 3×3 quanh nó (box chứa super1 → cấp 2).
- **Sao:** 3★≤5 · 2★=7 · 1★=9. Khó 2.5.
- ⚠️ **LIỆU NGHIỆM:** super1 rơi theo trọng lực sau khi ghép → cần chơi thử chốt trình tự đặt.

## L6 — "Cầu vồng 1" · `MAKE_RAINBOW`

- **Board:** trống. **Khay:** `[V3(vàng), V3(mint), V3(hồng)]`. **Xoay:** 2.
- **Mục tiêu:** tạo 1 **ô cầu vồng** (wild).
- **Giải dự kiến:** xếp 3 cột V3 ba màu cạnh nhau → 3×3 **sọc ba màu** → cầu vồng.
- **Sao:** 3★≤3 · 2★=4 · 1★=5. Khó 2.5. **Aha:** khối lấp lánh cầu vồng — ghép màu nào cũng được.

## L7 — "Cầu vồng 2" · `MAKE_RAINBOW_SUPER` ⚠

- **Board:** trống. **Khay:** `[V3(vàng), V3(mint), V3(hồng), I3(vàng)×3]`. **Xoay:** 2.
- **Mục tiêu:** tạo 1 **cầu vồng siêu cấp** (gộp kíp nổ khác màu / có cầu vồng dính liền).
- **Sao:** 3★≤6 · 2★=8 · 1★=10. Khó 3.
- ⚠️ **LIỆU NGHIỆM CAO:** hai kíp nổ 3×3 tâm luôn cách ≥3 ô → khó đặt kề bằng khay thuần — có thể cần
  bổ sung cơ chế `:core` cho dễ dạy. Chờ chơi thử để redesign.

## L8 — "Combo x2 đầu tiên" · `COMBO_X2`

- **Board:** trống. **Khay:** `[I4(vàng), I4(mint), I4(hồng), I4(xanh), V3(vàng), 1(mint)]`. **Xoay:** 2.
- **Mục tiêu:** lần đầu đạt **combo ×2** (xóa ≥2 hàng/cột trong 1 nước, hoặc cascade dồn tiếp).
- **Giải dự kiến:** xây 2 hàng đáy (cột 0–7, thiếu cùng cột 8) rồi thả V3 lấp cột 8 → xóa 2 hàng cùng
  lúc → combo ×2.
- **Sao:** 3★≤5 · 2★=6 · 1★=7. Khó 2.5. **Aha:** bội số combo nhảy lên — điểm nhân đôi.

## L9 — "Hai trăm điểm" · `REACH_SCORE = 200`

- **Board:** trống. **Khay:** `[I5, I4, I5, I4, V3, V3, V3, V3]` (đa màu) → cạn thì RNG. **Xoay:** 2.
- **Mục tiêu:** đạt **200 điểm**.
- **Giải dự kiến:** tự xây & xóa nhiều hàng, dồn combo cho nhân điểm.
- **Sao (điểm):** 3★=360 · 2★=280 · 1★=200. Khó 3.

## L10 — BOSS "Chú Sâu Đồng Cỏ" · `BOSS_COMBO`, máu = 5 ⚠

Boss đầu tiên. Bào máu bằng **combo**: mỗi lần combo **chạm mức mới ≥ ×2** gây sát thương = `bậc − 1`
(×2→1, ×3→2, ×4→3…) — đúng công thức `ComboReward.rotationRefund`.

- **Board:** 2 **đá cản** (`(4,0)`, `(4,8)`) tạo thế combo. **Khay:** `[I5, I4, I5, I4, V3×4]` → RNG.
- **Xoay:** 3. **Mục tiêu:** bào đủ **5 sát thương** trước khi kẹt khay. Thua = không đặt được mảnh.
- **Sao (số nhịp combo):** 3★≤3 · 2★=4 · 1★=5. Khó 3.5.
- ⚠️ **LIỆU NGHIỆM:** chuỗi combo/ngưỡng cần chơi thử để cân.

---

## Nghiệm thu World 1

- [ ] Mỗi màn dạy **đúng 1 cơ chế mới**: hàng → cột → xoay → super1 → super2 → cầu-vồng-1 → cầu-vồng-2
      → combo×2 → điểm → boss.
- [ ] **KHÔNG preset khối để xóa** (bàn trống, tự xây); chỉ boss có 2 đá cản.
- [ ] Cơ chế đầy đủ như Endless mọi màn (`superMergeEnabled = true`).
- [ ] Mọi board + chuỗi khay **deterministic**; golden test khoá L1/L2/L4/L6/L8; solver chốt ngưỡng sao.
- [ ] ⚠ L5 / L7 / L10 cần chơi thử tinh chỉnh (khay/trình tự/ngưỡng).

➡️ Tiếp theo: World 2 · Rừng rậm (L11–L20) — **thực chiến** + cơ chế **dây leo mọc lan** (xem `02-he-muc-tieu.md §8–11`).

---

## Nhật ký thay đổi

- **04/07/2026** — Bỏ nhãn "v2" (chỉ còn 1 bản latest). File giữ vai **NGUỒN THẬT** chi tiết W1, gồm toàn bộ ghi chú ⚠ LIỆU NGHIỆM (các file tóm tắt/playthrough trỏ về đây thay vì chép lại).
