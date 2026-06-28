# World 1 · Đồng cỏ — Thiết kế màn thủ công (L1–L10)

Đặc tả **từng màn cụ thể** (không generic). Bám core loop ở `../business-understanding.md` và curriculum mục 12 ở `../level-design.md`. World 1 dạy nền tảng: **đặt mảnh từ khay 3 → rơi cứng theo trọng lực → xóa hàng/cột → sụp cụm (combo)**. **Chưa mở xoay trọng lực** (nút xoay khoá, `rotationBudget = 0`) — để cú xoay ở World 2 thành khoảnh khắc "wow". Không modifier.

## Quy ước đọc

- **Toạ độ:** `(cột, hàng)`, cột 0–8 trái→phải, hàng 0–8 trên→xuống. **Trọng lực mặc định = xuống** (mảnh rơi về hàng 8).
- **Vocab mảnh (polyomino, người chơi KHÔNG tự xoay):** `1`(đơn) · `I2 I3 I4 I5`(thẳng ngang) · `V3`(thẳng dọc cao 3) · `L3 L4 J4` · `T4` · `S4 Z4` · `O4`(2×2) · `P5`(chữ thập). Mỗi mảnh là một màu jelly.
- **Khay (wave):** mỗi đợt phát đúng 3 mảnh, đặt hết 3 mới phát đợt sau. Liệt kê theo thứ tự **deterministic**.
- **Ngưỡng sao:** đơn vị = **số nước** (đặt 1 mảnh = 1 nước). Số ghi là *ứng viên thiết kế*; **solver chốt** min-moves cuối.
- **Điểm dạy:** một cơ chế mới duy nhất / màn. **Aha:** khoảnh khắc cảm xúc cần thấy.

---

## L1 — "Hàng đầu tiên" · dạy: đặt mảnh + xóa hàng

- **Board:** trống.
- **Khay:** Wave 1 `[I5(vàng), I4(mint), I3(hồng)]`.
- **Trọng lực:** xuống · **rotationBudget:** 0.
- **Mục tiêu:** `clear_all` — xóa 1 hàng để dọn sạch.
- **Cách giải dự kiến:** đặt I5 cột 0–4 và I4 cột 5–8 ở đáy → đầy hàng 8 → xóa. (I3 dư, dạy "không cần dùng hết khay".)
- **Sao (nước):** 3★ = 2 · 2★ = 3 · 1★ = 3.
- **Aha:** hàng đầy loé sáng + nổ nhẹ + rung. Dạy phản hồi xóa.

## L2 — "Cây cột" · dạy: xóa cột

- **Board:** trống.
- **Khay:** Wave 1 `[V3(xanh), V3(vàng), V3(mint)]`.
- **Mục tiêu:** `clear_all` — xóa 1 cột.
- **Giải dự kiến:** thả cả 3 V3 vào **cùng cột 4** → chồng cao 9 → đầy cột → xóa.
- **Sao:** 3★ = 3 · 2★ = 4 · 1★ = 4.
- **Aha:** "à, cột cũng xóa được, không chỉ hàng."

## L3 — "Xếp chồng" · dạy: nhiều mảnh nhỏ ghép thành hàng

- **Board:** preset đáy có sẵn 3 ô chặn: `(0,8) (1,8) (2,8)` (đá-mềm cùng màu, vẫn xóa được).
- **Khay:** Wave 1 `[I3, I3, V3]` · Wave 2 `[O4, I2, 1]`.
- **Mục tiêu:** `clear_targets` — xóa 2 hàng (hàng 8 và 7).
- **Giải dự kiến:** lấp nốt 6 ô còn trống hàng 8, rồi xây hàng 7.
- **Sao:** 3★ = 4 · 2★ = 5 · 1★ = 6.
- **Aha:** ghép nhiều mảnh khác hình vào một hàng.

## L4 — "Đổ dây chuyền" · dạy: combo cascade sau xóa

- **Board:** preset tạo "trần treo": cụm ở hàng 6–7 đặt sao cho **khi xóa hàng 8, mọi thứ sụp xuống và làm đầy hàng 7 → xóa tiếp**.
  - Preset: hàng 7 đầy 8/9 ô (thiếu `(4,7)`); hàng 8 đầy 8/9 ô (thiếu `(4,8)`).
- **Khay:** Wave 1 `[V3(màu A), I2, 1]`.
- **Mục tiêu:** `combo_chain` — đạt combo ≥2 trong 1 nước.
- **Giải dự kiến:** thả V3 vào cột 4 → lấp `(4,8)`+`(4,7)` (và 1 dư trên) → hàng 8 xóa → hàng 7 sụp đầy → xóa tiếp = combo x2.
- **Sao:** 3★ = 1 · 2★ = 2 · 1★ = 2.
- **Aha:** một nước, hai hàng đổ liên tiếp — bội số combo nhảy lên.

## L5 — "Cụm dính" · dạy: cụm rơi nguyên khối, để lại lỗ

- **Board:** preset một cụm hình L cỡ 5 ở giữa (treo), và đáy gần đầy để khi xóa thì cụm L rơi **nguyên khối**, kẹt lệch tạo 1 lỗ.
- **Khay:** Wave 1 `[I4, L3, I2]`.
- **Mục tiêu:** `clear_all`.
- **Giải dự kiến:** phải tính hướng cụm L rơi để bịt lỗ trước khi lấp hàng.
- **Sao:** 3★ = 3 · 2★ = 4 · 1★ = 5.
- **Aha:** thấy con số trên cụm = 5 (cụm 5 ô dính) và nó rơi cả khối — dạy đọc "số cụm".

## L6 — BREATHER "Nghỉ chân" · củng cố, dễ thở

- **Board:** trống, rộng rãi.
- **Khay:** Wave 1 `[O4, O4, I5]` · Wave 2 `[I4, I4, I2]` (mảnh to, dễ lấp).
- **Mục tiêu:** `reach_score` mức thấp — xóa bất kỳ 3 hàng.
- **Sao:** rộng tay, 3★ dễ đạt. 3★ = 5 · 2★ = 6 · 1★ = 7.
- **Aha:** thở phào, không áp lực — nhịp xuống của sawtooth.

## L7 — "Tính trước" · dạy: thứ tự khay quan trọng

- **Board:** preset chật vừa: đáy có vài cụm lệch, chỉ còn vài lối đặt.
- **Khay:** Wave 1 `[T4, S4, Z4]` (mảnh khó lắp) · Wave 2 `[I3, V3, 1]`.
- **Mục tiêu:** `clear_targets` — xóa 2 hàng.
- **Giải dự kiến:** đặt S4/Z4 đúng khe trước, sai thứ tự → kẹt.
- **Sao:** 3★ = 4 · 2★ = 5 · 1★ = 6.
- **Aha:** đặt sai một mảnh là tự bịt lối — bắt đầu phải nghĩ.

## L8 — "Combo đôi" · dạy: xóa hàng + cột cùng lúc

- **Board:** preset gần đầy hình chữ thập thiếu giao điểm `(4,4)` — đặt 1 ô vào đó xóa **đồng thời** hàng 4 và cột 4.
- **Khay:** Wave 1 `[1, I2, I3]`.
- **Mục tiêu:** `combo_chain` ≥2 (hàng+cột) trong 1 nước.
- **Giải dự kiến:** thả `1` vào `(4,4)`.
- **Sao:** 3★ = 1 · 2★ = 2 · 1★ = 3.
- **Aha:** một ô bé xíu, nổ chữ thập — phần thưởng "đặt đúng chỗ vàng".

## L9 — "Sát nút" · dạy: dọn để khỏi bị bịt (áp lực trước boss)

- **Board:** preset phủ ~60%, lối đặt hẹp, dễ thua nếu tham.
- **Khay:** Wave 1 `[L4, J4, P5]` · Wave 2 `[T4, I2, 1]`.
- **Mục tiêu:** `clear_all`.
- **Giải dự kiến:** ưu tiên xóa sớm để mở chỗ, không xây cao.
- **Sao:** 3★ = 5 · 2★ = 6 · 1★ = 7.
- **Aha:** cảm giác "suýt kẹt" rồi gỡ được — căng đúng liều.

## L10 — BOSS "Chú Sâu Đồng Cỏ" · boss nhập môn (archetype B · Kẻ Đổ Rác, bản nhẹ)

Boss đầu tiên, **chưa cần xoay trọng lực** (chưa học). Dùng khuôn **bào máu** đơn giản.

- **Boss:** mặt sâu jelly có mắt ở đỉnh bàn. `archetype: junk_dumper · winMode: drain · bossHP: 6 · threatInterval: 4 · attacks: [dump_junk]`.
- **Board:** trống.
- **Khay:** chuỗi cố định, lặp `[I5, I4, V3] → [I3, O4, I2] → …` (deterministic).
- **Sát thương:** mỗi **hàng/cột xóa = 1 dmg**; combo x2 = 2 dmg.
- **Đòn boss:** mỗi 4 nước, **báo trước 1 nước** rồi thả 1 dải đá (rác) vào hàng trên cùng, ép dọn.
- **Mục tiêu:** `bossHP → 0` trước khi bàn kẹt. Thua = không đặt được mảnh.
- **Sao:** theo số nước hạ boss. 3★ = 6 · 2★ = 8 · 1★ = 10.
- **Aha:** thanh máu boss tụt theo mỗi cú xóa, sâu nhăn mặt khi trúng — capstone đã tay của World 1.

---

## Nghiệm thu World 1

- [ ] Mỗi màn dạy **đúng 1 cơ chế mới**, không nhảy cóc.
- [ ] L1–L3 cực dễ (onboarding), L4 combo, L5 cụm, L6 thở, L7–L9 leo, L10 boss.
- [ ] `rotationBudget = 0` toàn world (nút xoay khoá, có teaser "Sắp mở" ở L9–L10).
- [ ] Mọi board + chuỗi khay **deterministic**; solver verify có nghiệm + chốt ngưỡng sao.
- [ ] Boss L10 không đòi xoay trọng lực.

➡️ Tiếp theo: World 2 · Rừng rậm (L11–L20) — mở **xoay trọng lực** (cơ chế chữ ký).
