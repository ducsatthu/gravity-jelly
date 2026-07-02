# Kịch bản chơi — World 1 · màn 1–10 (tutorial world)

Cập nhật 02/07/2026. **Nguồn thật** = `world-01-dong-co.md` (board/khay/giải). File này là
**playthrough beat-by-beat** cho nhóm art/UX/QA, khớp curriculum thật. Đọc kèm `goal-system-v2.md`
(hệ mục tiêu) và `guide-teach-system.md` (popup dạy-1-lần).

## Quy ước

- Toạ độ `(cột, hàng)`: cột 0–8 trái→phải, hàng 0–8 trên→xuống. Trọng lực mặc định **XUỐNG** (về hàng 8).
- Mảnh: `1`(đơn) · `I2 I3 I4 I5`(ngang) · `V3`(dọc 3) · `L3 L4 J4 T4 S4 Z4 O4 P5`. Người chơi **không tự xoay mảnh**.
- Màu: 🟡 vàng · 🟢 mint · 🩷 hồng · 🔵 xanh.
- **Triết lý (chốt):** bàn khởi đầu **TRỐNG**, người chơi **tự kéo-thả xây** cấu trúc mục tiêu từ
  khay (chỉ **L3** có preset nhỏ ngoại lệ, và **L10** có đá cản). Nhờ vậy không màn nào "thắng 1 nước".
- **Curriculum:** 1 hàng → 2 cột → 3 xoay → 4 super1 → 5 super2 → 6 cầu vồng → 7 cầu vồng super →
  8 combo×2 → 9 điểm → 10 boss.
- **Popup Guide:** L3, L4, L5, L6, L7, L8, L10 (7 màn). Tự học: L1, L2, L9.

Cơ chế nền cần nhớ:
- **Siêu khối:** 9 ô **cùng màu** nối liền → hợp nhất thành 1 siêu khối.
- **Xoay ngang dồn theo hàng:** xoay TRÁI/PHẢI làm mỗi hàng dồn ô về một biên.
- **Điểm mỗi lần xóa** = `số ô × số hàng-cột × bậc combo` (1 hàng ở ×1 = 9đ).

---

## L1 — "Hàng đầu tiên" · xóa 1 hàng · xoay 0 · ⭐ 3★≤2 nước

**Bàn mở.** Trống. **Khay:** `[I5 🟡, I4 🟢, I3 🩷]`.

**Đường đi.** Thả `I5 🟡` vào cột 0–4 (rơi xuống hàng 8) → thả `I4 🟢` vào cột 5–8 → hàng `y=8`
đủ 9 ô → **xóa hàng**. `I3` dư — dạy ngầm "không cần dùng hết khay".

**Popup.** Không (tối đa nhắc mờ *"Lấp đầy một hàng để xóa"*).

**Nhịp.** Phản hồi xóa: loé sáng + nổ nhẹ + rung. Thắng gọn trong 2 nước → tạo đà.

---

## L2 — "Cột đầu tiên" · xóa 1 cột · xoay 0 · ⭐ 3★≤3 nước

**Bàn mở.** Trống. **Khay:** `[V3 🟢, V3 🟡, V3 🩷]`.

**Đường đi.** Chồng cả 3 `V3` vào **cùng 1 cột** (ví dụ cột 0: rơi lần lượt xếp `y=6–8`, `y=3–5`,
`y=0–2`) → cột `x=0` đủ 9 ô → **xóa cột**.

**Popup.** Không.

**Nhịp.** "À, cột cũng xóa được" — người chơi tự suy ra từ L1, củng cố khái niệm dòng.

---

## L3 — "Cú xoay đầu" · thực hiện 1 cú xoay (xóa luôn 1 cột) · xoay 2 · ⭐ 3★≤1 xoay
### 🔔 Popup Guide: `gravityRotate` · ⚠ preset nhỏ ngoại lệ

**Bàn mở (ngoại lệ có preset).** Cột `x=0` lấp `y=0..8` **trừ lỗ hổng `(0,4)`** (8 ô) **+ 1 ô lạc**
tại `(8,4)` — cùng **hàng 4** với lỗ hổng. **Khay:** `[V3, I3, 1]` (dự phòng, thường không cần).

**Popup (mở màn).** Icon `RotateCw` —
*"Đây là nút **Xoay trọng lực**. Bấm để **đổi hướng bàn đổ 90°** và dồn cả cụm theo ý bạn."* → **Đã hiểu**.

**Đường đi.** Bấm **Xoay TRÁI (←)** → ô lạc `(8,4)` trượt dọc hàng 4 về `x=0` → **lấp đúng lỗ
`(0,4)`** → cột `x=0` đủ 9 ô → **xóa cột** bằng một cú "quét". Mục tiêu (đã xoay) + phần thưởng thị
giác cùng lúc → dạy **công dụng** của xoay, không chỉ vị trí nút.

**Nhịp.** Khoảnh khắc "wow" đầu của cơ chế chữ ký: một cú xoay lùa khối vào chỗ trống rồi dọn cả cột.

⚠️ **Cần chơi thử:** đảm bảo ô lạc `(8,4)` không bị trọng lực làm rơi khỏi hàng 4 lúc load màn.

---

## L4 — "Siêu khối" · tạo 1 siêu khối · xoay 1 · ⭐ 3★≤3 nước
### 🔔 Popup Guide: `makeSuper1`

**Bàn mở.** Trống. **Khay:** `[I3 🟡 ×3]` (3 mảnh cùng màu).

**Đường đi.** Xếp 3 mảnh `I3 🟡` chồng thành khối **3×3 cùng màu** (cột 0–2, hàng 6/7/8) → **9 ô 🟡
nối liền → hợp nhất thành Siêu khối 🟡** (gom + phát sáng, mắt to có vương miện).

**Popup (khi 9 ô sắp/đã gộp).** *"**9 ô cùng màu** dính nhau sẽ gộp thành **Siêu khối** — nổ mạnh hơn nhiều!"*

**Nhịp.** Dạy mục tiêu dài hạn của "gom màu"; mở đường cho combo lớn về sau.

---

## L5 — "Đại nổ" · tạo siêu khối cấp 2 · xoay 2 · ⭐ 3★≤5 nước · khó 2.5
### 🔔 Popup Guide: `makeSuper2` · ⚠ LIỆU NGHIỆM

**Bàn mở.** Trống. **Khay:** `[I3 🟡 ×6]` (2 đợt).

**Đường đi.** Xây 1 Siêu khối 🟡 (super1), rồi **lấp lại 3×3 quanh nó** (box chứa super1) → nâng
thành **Siêu khối cấp 2 → Đại nổ**: quét cùng màu toàn bàn + vùng 5×5 quanh tâm.

**Popup (khi lên cấp 2).** *"Nâng thành **Siêu khối cấp 2** → **Đại nổ**: quét cả màu trên bàn + vùng lớn!"*

**Nhịp.** Cao trào nhánh "gom màu" — đòn dọn bàn mạnh nhất người chơi vừa học.
⚠️ super1 rơi theo trọng lực sau ghép → cần chơi thử chốt trình tự đặt.

---

## L6 — "Cầu vồng 1" · tạo 1 ô cầu vồng · xoay 2 · ⭐ 3★≤3 nước · khó 2.5
### 🔔 Popup Guide: `makeRainbow`

**Bàn mở.** Trống. **Khay:** `[V3 🟡, V3 🟢, V3 🩷]`.

**Đường đi.** Xếp 3 cột `V3` ba màu **cạnh nhau** → khối 3×3 **sọc ba màu** → sinh 1 **ô Cầu vồng**
(wild) — ghép với **mọi màu**.

**Popup (khi cầu vồng hình thành).** *"Khối **ba màu** tạo ra **ô Cầu vồng** — ghép được với mọi màu!"*

**Nhịp.** Khối lấp lánh cầu vồng; giới thiệu wild block như công cụ gom màu linh hoạt.

---

## L7 — "Cầu vồng 2" · tạo 1 cầu vồng siêu cấp · xoay 2 · ⭐ 3★≤6 nước · khó 3
### 🔔 Popup Guide: `makeRainbowSuper` · ⚠ LIỆU NGHIỆM CAO

**Bàn mở.** Trống. **Khay:** `[V3 🟡, V3 🟢, V3 🩷, I3 🟡 ×3]`.

**Đường đi (dự kiến).** Tạo cầu vồng (như L6) rồi cho nó **dính vào một kíp nổ siêu khối khác màu**
→ **Cầu vồng Siêu cấp**: đòn nổ mạnh & linh hoạt nhất (ăn mọi màu, tầm quét lớn).

**Popup (khi gộp).** *"Gộp **Cầu vồng** vào Siêu khối → **Cầu vồng Siêu cấp**: đòn nổ mạnh nhất!"*

**Nhịp.** Đỉnh nhánh màu/merge; người chơi nắm đủ combo-tool trước màn combo & boss.
⚠️ **LIỆU NGHIỆM CAO:** hai kíp nổ 3×3 luôn cách ≥3 ô → khó đặt kề bằng khay thuần; có thể cần
bổ sung cơ chế `:core`. Chờ chơi thử để redesign.

---

## L8 — "Combo x2 đầu tiên" · đạt combo ×2 · xoay 2 · ⭐ 3★≤5 nước · khó 2.5
### 🔔 Popup Guide: `comboRefill`

**Bàn mở.** Trống. **Khay:** `[I4 🟡, I4 🟢, I4 🩷, I4 🔵, V3 🟡, 1 🟢]`.

**Đường đi.** Xây **2 hàng đáy** (`y=7` và `y=8`, mỗi hàng cột 0–7, cùng thiếu **cột 8**) → thả `V3`
lấp cột 8 → **xóa 2 hàng cùng một nước → combo ×2** → điểm nhân đôi + **hồi +1 lượt xoay**.

**Popup (khi combo ×2 hồi lượt).** *"Xóa **combo ×2** trở lên được **+1 lượt xoay**. Combo càng dài,
lượt hồi càng nhiều!"* (đúng nội dung `comboRefill` trong guide-teach-system).

**Nhịp.** Bội số combo nhảy lên + badge lượt xoay +1 — dạy vòng thưởng chữ ký (xoay giỏi → combo to
→ thêm xoay).

---

## L9 — "Hai trăm điểm" · đạt 200đ · xoay 2 · ⭐ 3★=360 · 2★=280 · 1★=200

**Bàn mở.** Trống. **Khay:** `[I5, I4, I5, I4, V3, V3, V3, V3]` (đa màu) → cạn thì deal RNG.

**Đường đi.** Tự xây & xóa nhiều hàng, **dồn combo** cho nhân điểm; dùng xoay tạo cascade ×3–×4 để
vượt **200** nhanh. Không popup (điểm tự khám phá; `comboRefill` đã dạy ở L8).

**Nhịp.** Bài kiểm tra tổng hợp *đặt mảnh + xoay + combo* trước boss.

---

## L10 — BOSS "Chú Sâu Đồng Cỏ" · máu 5 · xoay 3 · 2 đá cản · ⭐ 3★≤3 nhịp
### 🔔 Popup Guide: `bossCombo`

**Luật sát thương.** Mỗi lần combo **chạm mức mới ≥ ×2** gây `bậc − 1` sát thương (×2→1, ×3→2,
×4→3…). **Máu boss = 5.**

**Bàn mở.** Thanh máu boss (5) ở đỉnh. **2 đá cản** ở `(4,0)` và `(4,8)` chia bàn, buộc dùng xoay
lùa cụm tạo combo. **Khay:** `[I5, I4, I5, I4, V3 ×4]` → RNG.

**Popup (mở màn).** *"**Boss!** Tạo **combo ≥ ×2** để gây sát thương. Combo càng cao càng đau —
×3 = 2 máu, ×4 = 3 máu!"*

**Đường đi (một cách hạ boss).**
1. Xóa 1 hàng → **×1** (chưa sát thương), giữ combo.
2. Xóa tiếp → **×2 → 1 sát thương** (5→4).
3. **Xoay** lùa cụm qua đá → cascade **×3 → 2 sát thương** (4→2).
4. Combo **×4 → 3 sát thương** (2→0) → **hạ boss** ~3 nhịp → 3★. (Hoặc 5 nhịp ×2 an toàn → 1★.)

**Thua.** Kẹt khay (không đặt được mảnh) — luật thua chuẩn.

**Nhịp.** Chốt world tutorial: gộp *đặt mảnh + xoay + combo* thành cuộc "bào máu" kịch tính.

---

## Bảng tóm tắt guide & sao

| Màn | Mục tiêu | Popup Guide | Đơn vị sao | 3★ / 2★ / 1★ |
|---|---|---|---|---|
| 1 | Xóa 1 hàng | – (nhắc mờ) | Nước | 2 / 3 / 4 |
| 2 | Xóa 1 cột | – | Nước | 3 / 4 / 5 |
| 3 | Xoay (xóa cột) | `gravityRotate` | Xoay | 1 / 2 / 3 |
| 4 | Siêu khối 1 | `makeSuper1` | Nước | 3 / 4 / 5 |
| 5 | Siêu khối 2 | `makeSuper2` | Nước | 5 / 7 / 9 |
| 6 | Cầu vồng 1 | `makeRainbow` | Nước | 3 / 4 / 5 |
| 7 | Cầu vồng super | `makeRainbowSuper` ⚠ | Nước | 6 / 8 / 10 |
| 8 | Combo ×2 | `comboRefill` | Nước | 5 / 6 / 7 |
| 9 | 200 điểm | – | Điểm | 360 / 280 / 200 |
| 10 | Boss (máu 5) | `bossCombo` | Combo | 3 / 4 / 5 |

## Việc còn treo
1. **Golden test** mỗi màn: nạp preset+khay → chạy đường đi headless → assert đạt mục tiêu.
2. **⚠ cần chơi thử:** L3 (preset không settle), L5 (trình tự super1), L7 (cầu vồng super — có thể
   cần thêm cơ chế `:core`), L10 (cân chuỗi combo).
3. **`:app`:** thêm các `GjGuideEntry` mới cho `gravityRotate, makeSuper1, makeSuper2, makeRainbow,
   makeRainbowSuper, bossCombo` (combo dùng `comboRefill` đã có).
