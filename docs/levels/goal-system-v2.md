# Hệ mục tiêu v2 — bỏ "Dọn sạch", spec chi tiết màn 1–10

Cập nhật 01/07/2026. Thay thế cách chấm mục tiêu cũ trong `level-design-100-levels.xlsx`.

## 1. Vì sao bỏ "Dọn sạch" (clear-all)

Thiết kế cũ đặt gần như **mọi màn** vào mục tiêu `Dọn sạch / Xóa hết khối trên bàn`
(`GoalType.CLEAR_ALL`). Vấn đề: **hệ thống không tự sinh/xác nhận được phương án dọn sạch**.

- Dọn sạch tuyệt đối (bàn trống hoàn toàn) đòi bàn + chuỗi mảnh phải khớp *chính xác*
  đến từng ô. Với vật lý cụm cứng (cụm kẹt để lại lỗ không tự lấp) và trọng lực xoay,
  không gian trạng thái nổ tổ hợp → solver BFS/IDA* khó đảm bảo **luôn có nghiệm** và
  khó chấm sao công bằng.
- Chỉ cần một mảnh trong khay lệch hình là màn thành **bất khả thi** nhưng nhìn vẫn "hợp lệ".
- Kết quả: không xuất được bộ 100 màn deterministic đáng tin từ generate-and-test.

**Hướng mới:** mục tiêu dựa trên **hành động đã xảy ra** (trigger) hoặc **ngưỡng tích luỹ**
(điểm/combo) — luôn khả thi, luôn kiểm chứng được bằng bot, dễ chấm sao.

## 2. Taxonomy mục tiêu mới

| Nhóm | goal_type (code) | Điều kiện qua màn | Đơn vị sao | Ánh xạ `GoalType` hiện có |
|---|---|---|---|---|
| Tutorial – trigger | `CLEAR_ROW_FIRST` | Xóa 1 hàng ngang đầu tiên | Số nước | *mới* (TUTORIAL) |
| Tutorial – trigger | `CLEAR_COL_FIRST` | Xóa 1 cột dọc đầu tiên | Số nước | *mới* (TUTORIAL) |
| Tutorial – trigger | `ROTATE_FIRST` | Thực hiện 1 cú xoay trọng lực | Số nước | *mới* (TUTORIAL) |
| Tutorial – trigger | `MAKE_SUPER1` | Ghép 9 ô cùng màu → siêu khối cấp 1 | Số nước | *mới* (gần `make_mega`) |
| Tutorial – trigger | `MAKE_SUPER2` | Gộp 2 siêu khối → đại nổ (cấp 2) | Số nước | *mới* |
| Tutorial – trigger | `MAKE_RAINBOW` | Tạo ô cầu vồng (wild) đầu tiên | Số nước | TUTORIAL·RAINBOW |
| Tutorial – trigger | `MAKE_RAINBOW_SUPER` | Tạo cầu vồng super đầu tiên | Số nước | TUTORIAL·RAINBOW_SUPER |
| Tutorial – trigger | `COMBO_X2` | Đạt combo ×2 lần đầu (xóa ≥2 hàng/cột 1 nước / cascade) | Số nước | TUTORIAL·COMBO_X2 |
| Tích luỹ | `REACH_SCORE` | Đạt ngưỡng điểm | Điểm | `REACH_SCORE` ✅ |
| Boss | `BOSS_COMBO` | Bào hết máu boss bằng combo | Điểm sát thương | `BOSS_COMBO` + `bossHP` |

**Code (:core) — ĐÃ hiện thực:** `GoalType` thêm `TUTORIAL` (trường `trigger: TriggerKind{ROW, COL,
ROTATE, SUPER1, SUPER2, RAINBOW, RAINBOW_SUPER, COMBO_X2}`) và `BOSS_COMBO` (trường `bossHP`);
`StarMetric` thêm `ROTATIONS`. Chấm goal bám event stream trong `:game EndlessGameHolder.trackGoalEvents`.

## 3. Công thức nền (để hiểu ngưỡng)

- **Điểm mỗi lần xóa** = `số ô × số hàng-cột × bậc combo` (business-understanding §Vòng lặp).
  Trên bàn 9×9: xóa **1 hàng** ở combo ×1 = `9 × 1 × 1 = 9 điểm`.
- **Combo** cộng dồn qua các nước có ích; reset khi thả mảnh mà không xóa được gì.
- **Sát thương boss / hồi lượt xoay** = `bậc combo − 1` mỗi lần combo *chạm mức mới ≥ ×2*
  (×2 → 1, ×3 → 2, ×4 → 3…) — đúng công thức `ComboReward.rotationRefund` đã có trong `:core`.

## 4. Spec chi tiết màn 1–10 (World 1 · Đồng cỏ = TUTORIAL WORLD)

> **NGUỒN THẬT chi tiết từng màn = `world-01-dong-co.md`** (board/khay/giải/cờ ⚠). Mục này là bản
> tóm tắt; khi lệch, lấy `world-01-dong-co.md` làm chuẩn.

World 1 giờ **dạy toàn bộ cơ chế**. Mỗi màn dạy đúng 1 thứ. **NGUYÊN TẮC (01/07): KHÔNG đặt sẵn
khối để người chơi chỉ xóa** — bàn khởi đầu TRỐNG, người chơi **TỰ KÉO-THẢ xây** nên cấu trúc mục
tiêu từ khay (chỉ boss có đá cản). Sao thưởng làm gọn (ít nước / điểm cao / ít lượt xoay / ít nhịp).

### L1 — "Hàng đầu tiên" · `CLEAR_ROW_FIRST`
Dạy: đặt mảnh + xóa **hàng ngang**. Khay `[I5, I4, I3]` → tự xếp I5+I4 lấp đầy 1 hàng (9 ô). Xoay 0.
Qua màn = xóa 1 hàng. Sao (số nước): 3★≤2 · 2★=3 · 1★=4.

### L2 — "Cột đầu tiên" · `CLEAR_COL_FIRST`
Dạy: xóa **cột dọc**. Khay 3 mảnh dọc `[V3×3]` → chồng đầy 1 cột (9 ô). Xoay 0.
Sao: 3★≤3 · 2★=4 · 1★=5.

### L3 — "Cú xoay đầu" · `ROTATE_FIRST` ⚠ (ngoại lệ có preset nhỏ)
Dạy **cơ chế chữ ký**: xoay trọng lực 90° — và cho cú xoay **xóa luôn 1 dòng** cho "đã tay".
Bàn trống thì xoay không thể tạo clear, nên L3 dùng **preset nhỏ có chủ đích** (như boss có đá):
cột `x=0` lấp `y=0..8` trừ lỗ `(0,4)` + 1 ô lạc ở `(8,4)`. Bấm **Xoay TRÁI** → ô lạc trượt dọc
hàng 4 lấp lỗ → cột đầy → **xóa cột**. Ngân sách xoay = 2. Qua màn = thực hiện 1 cú xoay.
Sao (số xoay): 3★≤1 · 2★=2 · 1★=3. ⚠️ cần chơi thử: preset không được settle làm rơi ô lạc lúc load.

### L4 — "Siêu khối" · `MAKE_SUPER1`
Dạy **gộp 9 ô cùng màu → siêu khối cấp 1**. Khay `[I3 vàng ×3]` → tự xếp 3×3 cùng màu. Xoay 1.
Qua màn = tạo 1 siêu khối. Sao: 3★≤3 nước · 2★=4 · 1★=5.

### L5 — "Đại nổ" · `MAKE_SUPER2`
Dạy **siêu khối cấp 2 (đại nổ)**: quét cùng màu toàn bàn + vùng 5×5 (mechanics B4). Xây super1 rồi
lấp lại 3×3 quanh nó (box chứa super1 → cấp 2). Xoay 2. Sao: 3★≤5 · 2★=7 · 1★=9. Khó 2.5.
⚠️ LIỆU NGHIỆM: super1 rơi theo trọng lực sau ghép → cần chơi thử chốt trình tự đặt.

### L6 — "Cầu vồng 1" · `MAKE_RAINBOW`
Dạy **ô cầu vồng (wild)**. Khay 3 cột `[V3 vàng, V3 mint, V3 hồng]` → tự xếp 3×3 **sọc ba màu** →
cầu vồng. Xoay 2. Qua màn = tạo 1 ô cầu vồng. Sao: 3★≤3 · 2★=4 · 1★=5. Khó 2.5.

### L7 — "Cầu vồng 2" · `MAKE_RAINBOW_SUPER`
Dạy **cầu vồng siêu cấp** (gộp kíp nổ khác màu / có cầu vồng dính liền). Qua màn = tạo 1 cầu vồng
super. Xoay 2. Sao: 3★≤6 · 2★=8 · 1★=10. Khó 3.
⚠️ LIỆU NGHIỆM CAO: hai kíp nổ 3×3 tâm luôn cách ≥3 ô → khó đặt kề bằng khay thuần — có thể cần bổ
sung cơ chế `:core` cho dễ dạy. Chờ chơi thử để redesign.

### L8 — "Combo x2 đầu tiên" · `COMBO_X2`
Dạy **dồn chuỗi combo**. Tự xây 2 hàng đáy (thiếu cùng 1 cột) rồi thả 1 mảnh dọc lấp cột đó → xóa
**2 hàng cùng lúc → combo ×2**. Xoay 2. Qua màn = lần đầu combo ≥×2. Sao: 3★≤5 · 2★=6 · 1★=7. Khó 2.5.

### L9 — "Hai trăm điểm" · `REACH_SCORE = 200`
Củng cố điểm mức khó hơn. Tự xây & xóa nhiều hàng (dồn combo) đạt 200 điểm. Xoay 2.
Sao (điểm): 3★=360 · 2★=280 · 1★=200. Khó 3.

### L10 — "Boss Combo" · `BOSS_COMBO`, **máu boss = 5**
Dạy đấu boss theo **bào máu bằng combo**. Mỗi lần combo **chạm mức mới ≥ ×2** gây sát thương
= `bậc − 1` (×2→1, ×3→2, ×4→3…). Cộng dồn đủ **5 sát thương** là hạ boss.
→ Có thể hạ trong 5 nhịp ×2, hoặc nhanh hơn nếu lên ×3/×4. Có 2 đá cản để tạo thế combo.
Ngân sách xoay = 3. Thua = kẹt khay (luật thua chuẩn). Sao (số nhịp combo): 3★≤3 · 2★=4 · 1★=5.
Khó 3.5.

## 5. Chấm sao & tính khả thi

- **Tutorial (trigger):** luôn có nghiệm vì khay được dựng để hành động chắc chắn xảy ra;
  sao đo **số nước** dùng → thưởng người làm gọn. Solver chỉ cần xác nhận đường đạt trigger.
- **REACH_SCORE / BOSS_COMBO:** khả thi bằng **bot greedy** ước lượng dải điểm/combo, đặt
  ngưỡng sao ở phân vị công bằng (giống mục điểm trong level-design.md §Solver).
- Golden test khoá deterministic: cùng seed + đường giải mẫu → cùng chuỗi state.

## 6. Hệ quả cần lưu ý (ripple)

1. **World 1 đổi vai:** từ "chỉ đặt mảnh + xóa hàng/cột" → **world tutorial dạy tất cả**
   (xoay, siêu khối 1&2, cầu vồng, boss). Đã cập nhật hàng W1 ở sheet *World & Map*.
2. **Xung đột với lộ trình world cũ:** lộ trình cũ mở xoay ở W2, siêu khối ở W3, combo/ô
   đích ở W3. Nay các cơ chế này được *giới thiệu* ở W1. **Cần quyết:** W2–W10 sẽ *đào sâu/biến
   tấu* các cơ chế đã dạy (khuyến nghị), hay giữ nguyên mô tả cũ? (Ngoài phạm vi lần này.)
3. **Code `:core`/`:game` — ĐÃ hiện thực (01/07):** `campaignTuning` giờ **LUÔN bật merge**
   (`superMergeEnabled = true` mọi màn = cơ chế đầy đủ như Endless; khay tutorial đa màu nên hàng/cột
   vẫn xóa thường). Cầu vồng & cầu vồng super **đã có sẵn** trong `:core` (`RainbowFormed`, 3×3 ba màu
   sọc, gộp kíp nổ khác màu). `CampaignLevels` L1–L10 dựng theo lineup mới; chấm goal bám event stream.
   Golden test khoá L1/L2/L4/L6/L8 (xóa hàng/cột · super1 · cầu vồng · combo×2).
4. **Màn 11–100 trong Excel** vẫn để mục tiêu cũ (clear-all) — *chưa* sửa lần này. Mục tiêu mặc định
   khi rework tiếp: **hỗn hợp điểm + ô đích + boss combo**.

---

# World 2 · Rừng rậm (màn 11–20)

Cập nhật 02/07/2026 (v2 — redesign). W2 **không dạy mới** (W1 đã dạy hết) — đây là **world
thực chiến đầu tiên**. Bản sắc: **rừng rậm = dây leo siết bàn**. Cơ chế chữ ký **DÂY LEO**
có mặt trong **9/10 màn** (duy nhất L16 breather không có) — vừa là mục tiêu, vừa là trở ngại
tuỳ màn. Mỗi màn khai thác 1 khía cạnh mới của vine, KHÔNG lặp công thức.

## 8. Cơ chế chữ ký: Dây leo mọc lan (Creeping Vine)

Bản sắc "rừng rậm = rối & kẹt". Dây leo là chướng ngại **tự lan**, cộng hưởng trực tiếp với
xoay trọng lực + cụm cứng — điểm độc nhất so với Woodoku/Block Blast.

**Cấu trúc.** Mỗi dây leo có 1 **gốc** (root) + chuỗi **đốt** (segment). Gốc là *target* của
màn. `:core`: `CellType.VINE` với cờ `isRoot` (đã implement).

**Luật (deterministic — bắt buộc cho solver/Daily):**

1. **Mọc:** cứ sau mỗi `growEveryN` lượt *thả mảnh*, mỗi dây mọc thêm **1 đốt** từ **đầu dây
   (tip)** sang 1 ô kề **trống**. Thứ tự chọn ô cố định: quét 4 hướng theo thứ tự
   `[ngược hướng trọng lực → phải → theo trọng lực → trái]`, lấy ô trống đầu tiên. Tip kẹt
   (không ô trống kề) → dây *ngừng mọc* lượt đó. Hàm thuần của (state + hướng trọng lực + bộ
   đếm lượt) → không phá deterministic.
   - `growEveryN = 2` (mọc chậm, màn giới thiệu) hoặc `1` (mọc nhanh, màn áp lực).
2. **Bám cứng khi xoay:** ô dây leo **KHÔNG rơi** theo trọng lực/xoay — nó là rễ, đứng yên
   trong khi mọi thứ khác đổ. → xoay vừa lợi (gỡ cụm khác) vừa hại (mở khe trống cho dây mọc).
3. **Diệt — CHỈ THẠCH LÁ (MINT) MỚI PHÁ GỐC:** *(quy tắc áp dụng mọi nơi có vine, không
   riêng W2)*
   - Xóa hàng/cột **đi qua GỐC** → gốc chỉ bị phá nếu hàng/cột đó chứa **ít nhất 1 khối
     màu MINT (xanh lá)**. Nếu không có khối MINT → hàng vẫn clear bình thường nhưng **gốc sống
     sót**. Khi gốc bị phá → **cả dây tan** (gốc + mọi đốt).
   - **Siêu khối MINT nổ** (quét cùng màu toàn bàn / vùng 5×5): nếu vùng nổ đi qua gốc → gốc
     **bị phá** (tính là "xanh lá xoá"). Siêu khối màu khác nổ qua gốc → gốc sống sót.
   - Xóa qua **đốt thường** → chỉ đốt trên line đó mất (không cần MINT). Đốt nào **mất kết
     nối với gốc** sẽ **khô héo → biến thành ô trống** ở cuối lượt (thưởng cho việc cắt gần gốc).
4. **Tính vào clear:** đốt/gốc là ô cứng, **được tính** khi xét hàng/cột đầy → có thể chủ
   động lấp đầy hàng chứa gốc để xóa diệt dây (nhớ cần MINT trong hàng đó).
5. **Thua:** nếu dây mọc bịt bàn khiến **kẹt khay** → thua theo luật chuẩn (không cần luật riêng).

**Hệ quả thiết kế của quy tắc MINT:**
- Khối MINT trở thành **tài nguyên kép**: vừa ghi điểm vừa là "thuốc diệt rễ". Người chơi
  phải cân nhắc đặt MINT ở đâu — phí MINT cho score hay giữ cho hàng chứa gốc.
- Siêu khối MINT = **vũ khí chống vine mạnh nhất** (quét toàn bàn, phá mọi gốc gặp phải).
  Tạo mục tiêu ngầm "xây 3×3 MINT" trong các màn vine khó.
- Pool mảnh cần đảm bảo đủ MINT (không quá hiếm gây bất khả thi, không quá nhiều gây dễ).

**Mục tiêu vine =** `CLEAR_TARGETS` với target = tập hợp **gốc** ("Phá hết N gốc dây leo").

## 9. Boss L20: Thần Rừng (Vine Boss), máu = 8

Archetype **Vine Siege** — boss LÀ hiện thân của dây leo, khác hẳn boss W1 (combo thuần).

- **Bàn khởi:** 2 gốc dây leo ở hai mép `(1,8)` + `(7,8)`, mọc **nhanh N=1** (mỗi lượt mọc).
- **Đòn boss:** cứ mỗi **3 lượt** (sau ân hạn 2 lượt đầu), boss **mọc thêm 1 gốc mới** tại
  vị trí cạnh bàn ngẫu nhiên (deterministic theo seed). Gốc mới cũng mọc N=1.
  → Nếu không chặt kịp, bàn bị siết bởi mạng lưới dây leo ngày càng dày.
- **Bào máu:** combo *chạm mức mới ≥ ×2* gây `bậc − 1` sát thương (nhất quán boss L10).
  Máu = **8**.
- **Chiến thuật:** phải **xen kẽ** combo (gây sát thương) và chặt rễ bằng MINT (giữ bàn thở).
  Siêu khối MINT = đòn lật kèo (vừa ghi combo vừa quét gốc).
- **Thắng:** máu → 0. **Thua:** kẹt khay. Ngân sách xoay = 3.
- Sao (số nhịp combo): 3★ ≤4 · 2★ ≤6 · 1★ ≤8.

**Code mới cần cho boss:** `bossVineSpawnEveryN` — cứ mỗi N lượt, spawn 1 gốc mới (vị trí
deterministic từ PRNG seed). Khác `debrisPerTurn` (đó rải khối, không vine). Có thể dùng chung
hạ tầng nhưng output là `CellType.VINE` + `vineRoot=true`.

## 10. Spec chi tiết màn 11–20

Vine có mặt 9/10 màn. Mỗi màn khai thác 1 khía cạnh mới. Arc cảm xúc:
`gặp vine → vine nền → hiệu quả → xoay chiến thuật → tốc độ ↑ → thở → ưu tiên tầng →
mixed áp lực → gauntlet → boss`.

`MIXED` = phải đạt **cả hai** điều kiện (phá gốc **và** đủ điểm) mới qua màn.

| Màn | Tên | Node | goal_type | Điều kiện qua | Xoay | Vine | Sao (3/2/1) |
|---|---|---|---|---|---|---|---|
| 11 | Mầm Đầu Tiên | Thường | `CLEAR_TARGETS` | Phá 1 gốc | ⚠ | 1 gốc đáy (4,8) · chậm N=2 | TBD (bot) |
| 12 | Dây Leo Lan | Thường | `REACH_SCORE` | ⚠ điểm (bot verify) | ⚠ | 1 gốc đáy (4,8) · chậm N=2 | TBD (bot) |
| 13 | Hai Rễ | Thường | `CLEAR_TARGETS` | Phá 2 gốc | ⚠ | 2 gốc cùng hàng đáy (2,8)+(6,8) · chậm N=2 | TBD (bot) |
| 14 | Rễ Khuất | Thường | `CLEAR_TARGETS` | Phá 1 gốc | ⚠ | 1 gốc giữa bàn (4,5) + 2 đá chắn (3,6)+(5,6) · chậm N=2 | TBD (bot) |
| 15 | Rừng Nhanh | Thường | `CLEAR_TARGETS` | Phá 2 gốc | ⚠ | 2 gốc đáy (3,8)+(5,8) · **nhanh N=1** | TBD (bot) |
| 16 | Bãi Trống | Breather | `REACH_SCORE` | ⚠ điểm (bot verify) | ⚠ | **Không vine** — khoảng nghỉ giữa rừng | TBD (bot) |
| 17 | Tầng Rễ | Thường | `CLEAR_TARGETS` | Phá 2 gốc | ⚠ | 1 gốc đáy (4,8) + 1 gốc giữa (4,4) · chậm N=2 | TBD (bot) |
| 18 | Rừng & Điểm | Thường | `MIXED` | 1 gốc + ⚠ điểm | ⚠ | 1 gốc giữa (4,5) · **nhanh N=1** | TBD (bot) |
| 19 | Rừng Rậm | Thường | `CLEAR_TARGETS` | Phá 3 gốc | ⚠ | 3 gốc ba tầng (2,8)+(4,5)+(6,2) · nhanh N=1 | TBD (bot) |
| 20 | Thần Rừng | Boss | `BOSS_COMBO` | Thần Rừng (máu ⚠) | ⚠ | 2 gốc (1,8)+(7,8) · nhanh N=1 · boss spawn thêm gốc mỗi 3 lượt | TBD (bot) |

> **⚠ = cần solver xác định.** Ngưỡng điểm, ngân sách xoay, máu boss, và sao đều phải được
> tính từ bot greedy chạy trên board+pool cụ thể (xem §20 Phương pháp tính ngưỡng).

### Chi tiết thiết kế từng màn

**L11 — Mầm Đầu Tiên.** Gặp vine lần đầu. 1 gốc ở hàng đáy chính giữa, mọc chậm. Dạy: "lấp
đầy hàng chứa gốc bằng khối XANH LÁ (MINT) để diệt dây". Khay đảm bảo đủ mảnh MINT. Đây là
màn **dạy quy tắc MINT** — guide popup giải thích rõ.

**L12 — Dây Leo Lan.** Vine là **trở ngại, không phải mục tiêu**. Gốc vẫn mọc và lấn bàn,
nhưng goal là ghi điểm. Người chơi học cách **sống chung với vine**: hoặc phá gốc (tốn MINT +
nước) hoặc chấp nhận mất không gian mà tập trung score. Dạy: vine không phải lúc nào cũng cần
diệt ngay.

**L13 — Hai Rễ.** Hai gốc **cùng hàng đáy** — 1 clear hàng đáy có MINT giết cả hai. Dạy hiệu
quả: đặt MINT đúng hàng = diệt gọn.

**L14 — Rễ Khuất.** Gốc **KHÔNG ở đáy** — nằm ở giữa bàn (y=5), bên dưới có 2 đá chặn. Với
trọng lực mặc định DOWN, không thể lấp đầy hàng y=5 từ trên xuống. **Phải xoay trọng lực** để
lùa khối vào hàng chứa gốc. Turning point của W2: xoay + vine kết hợp lần đầu.

**L15 — Rừng Nhanh.** Vine mọc **nhanh (N=1)**: mỗi lượt mọc thêm 1 đốt. Áp lực thời gian —
phải hành động nhanh, đặt MINT vào hàng gốc trước khi dây siết hết bàn.

**L16 — Bãi Trống.** Breather — khoảng trống giữa rừng. Không vine, bàn thoáng, chỉ cần ghi
điểm nhẹ. Để người chơi thở trước nửa sau khó hơn.

**L17 — Tầng Rễ.** Hai gốc ở **hai tầng khác nhau** (đáy y=8 + giữa y=4). Phải chọn chặt gốc
nào trước — gốc dưới dễ tiếp cận hơn nhưng gốc trên mọc vào vùng quan trọng. Dạy: ưu tiên
chiến thuật.

**L18 — Rừng & Điểm.** Goal MIXED: phá 1 gốc ở giữa bàn **VÀ** ghi 350 điểm. Vine mọc nhanh.
Phải cân bằng: dùng MINT cho diệt gốc hay cho score? Áp lực kép.

**L19 — Rừng Rậm.** Tên world = tên màn = đỉnh cao. **3 gốc ở 3 tầng** (đáy + giữa + trên),
mọc nhanh. Gauntlet — cần xoay + MINT management tổng lực. Phải xoay trọng lực để tiếp cận
từng tầng gốc, vừa giữ board sống.

**L20 — Thần Rừng (Boss).** Boss combo + vine siege. Bắt đầu với 2 gốc mọc nhanh. Cứ 3 lượt
boss spawn thêm 1 gốc mới → mạng vine ngày càng dày. Phải xen kẽ: combo để bào máu + chặt gốc
bằng MINT để giữ bàn thở. Siêu khối MINT = đòn lật kèo.

## 11. Hệ quả cần lưu ý (W2)

1. **Code `:core` — đã có:** `CellType.VINE` + mọc deterministic + bám cứng + diệt/héo. **CẦN
   BỔ SUNG:** (a) quy tắc MINT-only khi phá gốc (trong `Resolve.kt` bước diệt vine, check có
   MINT trong hàng/cột clear); (b) Super Block MINT nổ qua gốc → phá gốc; (c) boss
   `bossVineSpawnEveryN` — spawn gốc mới theo nhịp.
2. **Quy tắc MINT áp dụng TOÀN CỤC** (mọi nơi có vine): cần cập nhật `Vine.kt` /
   `Resolve.kt` một lần, tự động áp dụng cho W2, W3+ nếu dùng lại vine.
3. **Ripple với W3 (Sông):** ô đích W3 là "giọt nước" (`CellType.TARGET`), KHÔNG phải vine →
   quy tắc MINT **không ảnh hưởng** W3. Bản sắc khác biệt: vine = chặt bằng MINT, giọt = phá
   bằng line clear thường.
4. **Cân bằng:** (a) pool mảnh phải có đủ MINT — quá hiếm → bất khả thi, quá nhiều → dễ;
   (b) `growEveryN` quá nhỏ → nghẹt bàn; (c) boss spawn gốc quá dày → bất khả thi. Cần bot
   greedy chạy thử.

---

# World 3 · Sông & Thác (màn 21–30)

Cập nhật 02/07/2026 (v3 — redesign thác nước). Bản sắc: **thác đổ = dẫn nước phá giọt**. Khác
hẳn W2 (dây leo = tĩnh + mọc + cần MINT): ở W3 nước chảy **tự nhiên như thác thật** — đổ từ
nguồn, tách khi gặp vật cản, ngập ô trống. Người chơi **xây kênh dẫn nước** tới giọt bằng cách
đặt mảnh + xoay trọng lực. Thác + giọt có mặt **9/10 màn** (trừ breather L26).

**Đối sánh W2 vs W3 — hai triết lý đối lập:**

| | W2 Rừng rậm | W3 Sông & Thác |
|---|---|---|
| Cơ chế chữ ký | Dây leo — **mọc lan** từ gốc | Thác nước — **chảy xuống** từ nguồn |
| Áp lực board | Dây mọc lấn ô → hẹp dần | Nước ngập ô trống → không đặt được |
| Target | Gốc vine — **phá bằng MINT** | Giọt nước — **phá bằng nước chạm** |
| Kiểu câu đố | **Tính toán** — đặt MINT đúng hàng | **Kỹ sư nước** — xây kênh dẫn thác tới giọt |
| Xoay trọng lực | Tiếp cận gốc từ hướng khác | **Xoay cả thác** — nước đổ từ mép mới |
| Vũ khí mạnh | Siêu khối MINT (quét gốc) | Xoay trọng lực (đổi hướng toàn bộ thác) |

## 12. Cơ chế chữ ký: Thác Nước (Waterfall Flow)

Bản sắc "sông & thác = nước tự nhiên". Thác đổ từ nguồn, chảy theo trọng lực, tách khi gặp
vật cản, ngập ô trống — người chơi trở thành **kỹ sư thủy lợi**: đặt mảnh để xây tường/kênh
dẫn nước tới giọt mục tiêu.

### 12.1. Cấu trúc

- **Nguồn thác (source):** 1–3 ô ở mép **"trên"** bàn (tính theo hướng trọng lực hiện tại).
  Nước bắt đầu chảy từ đây. Config trong level preset: `waterSources: List<Int>` = danh sách
  cột (khi gravity DOWN/UP) hoặc hàng (khi gravity LEFT/RIGHT) có nguồn.
- **Dòng chảy (flow):** nước chảy từ nguồn theo hướng trọng lực qua các ô trống, tạo **đường
  nước** (water path). Ô trên đường nước = **ngập** (flooded).
- **Giọt nước (drop):** `CellType.TARGET` — mục tiêu cần phá. Nước chạm giọt → **giọt vỡ**
  (phá luôn, không cần line clear).

### 12.2. Luật chảy (deterministic — bắt buộc cho solver/Daily)

Thuật toán tính đường nước = **BFS theo trọng lực** từ các nguồn:

1. **Chảy xuống:** từ mỗi nguồn, nước chảy theo hướng trọng lực, ô này sang ô kế tiếp.
   - Ô **TRỐNG** → nước chảy qua, ô bị **ngập** (flooded). Tiếp tục chảy xuống.
   - Ô **BLOCK / STONE / VINE** → nước bị chặn, **tách sang 2 bên** (vuông góc với trọng lực).
   - Ô **TARGET** (giọt) → nước chạm → **giọt vỡ** (phá, goal progress). Nước tiếp tục chảy
     qua (ô giọt vỡ trở thành ô trống ngập).
2. **Tách dòng:** khi gặp vật cản, nước thử 2 ô kề vuông góc (trái + phải tính theo hướng
   trọng lực). Nếu ô kề trống hoặc là TARGET → nước chảy vào đó rồi **tiếp tục xuống** từ vị
   trí mới. Nếu ô kề cũng bị chặn → nước dừng (tắc).
3. **Đa nhánh:** mỗi lần tách = 2 nhánh độc lập. Nước có thể tách nhiều lần → hình cây thác.
   Tất cả các nhánh xử lý BFS cùng lúc → deterministic (quét theo thứ tự ô cố định).
4. **Ô ngập (flooded):** ô trống mà nước chảy qua trở thành **ngập** → **KHÔNG đặt mảnh được**
   lượt kế tiếp. Thu hẹp không gian đặt = áp lực board. Ngập tính lại mỗi lượt nên thay đổi
   theo board state.
5. **Mép bàn:** nước chảy tới mép dưới (theo trọng lực) → dừng (không tràn ra ngoài).

### 12.3. Timing trong vòng lặp game

1. Người chơi đặt mảnh (chỉ đặt được trên ô KHÔNG ngập)
2. Resolve (line clear, cascade, cluster physics)
3. **Tính lại đường nước** từ nguồn: BFS theo board state mới
4. Giọt nào nằm trên đường nước → **vỡ** (emit `DropsCleared`, goal progress)
5. Cập nhật ô ngập (render gợn nước)
6. Lượt kế tiếp → người chơi thấy ô ngập mới, chọn vị trí đặt

> Đặt mảnh (xây tường) → thay đổi board → nước chảy khác → giọt mới có thể bị chạm.
> Xóa hàng (phá tường) → mở đường cho nước → ngập thêm HOẶC nước tới giọt mới.
> → Mỗi nước đi đều thay đổi cả bản đồ nước.

### 12.4. Tương tác xoay trọng lực

**Xoay = xoay cả thác.** Khi người chơi xoay trọng lực 90°:
- Nguồn thác dời sang mép mới (mép "trên" theo hướng gravity mới). Ví dụ: gravity DOWN →
  nguồn ở row 0. Xoay sang LEFT → nguồn ở col 8 (mép phải = "trên" khi gravity LEFT).
- Nước chảy theo hướng mới → **toàn bộ đường nước thay đổi**.
- Giọt trước đó ngoài tầm nước có thể **vào tầm** sau khi xoay → phá giọt bằng xoay!

> Đây là vũ khí mạnh nhất W3: xoay trọng lực = **lái cả con thác** sang hướng mới.
> Giọt ở vị trí mà nước DOWN không tới → xoay LEFT → nước chảy ngang qua giọt → vỡ.

### 12.5. Hệ quả thiết kế

- **Xây tường = dẫn nước:** đặt mảnh ở vị trí chiến lược để nước tách đúng hướng, chảy tới
  giọt. Mảnh vừa là tường dẫn nước vừa là khối xây cho line clear.
- **Xóa hàng = mở đường:** line clear phá tường → nước tràn vào vùng mới. Có thể tốt (nước
  tới giọt mới) hoặc xấu (ngập thêm vùng cần đặt).
- **Ô ngập = áp lực board:** nhiều nguồn / ít tường → nước ngập rộng → ít chỗ đặt → dễ thua.
  Phải cân bằng: xây tường (chặn nước, giữ chỗ đặt) vs để nước chảy (phá giọt).
- **Cascade tự nhiên:** nước chảy qua giọt → giọt vỡ (ô thành trống) → nước có thể chảy
  tiếp qua ô vừa trống → tới giọt kế tiếp. **Chuỗi giọt vỡ** nếu xếp đúng.

**Mục tiêu giọt =** `CLEAR_TARGETS` với target = số giọt ("Phá hết N giọt nước"). Giọt bị phá
khi **nước chạm** (không cần line clear). Line clear vẫn phá giọt nếu clear đi qua giọt (giữ
tương thích với engine hiện có).

## 13. Boss L30: Thần Thác (Gravity Chaos), máu = 10

Archetype **Hỗn loạn trọng lực** — boss kiểm soát hướng trọng lực, làm thác liên tục đổi
hướng. Khác boss W2 (Thần Rừng — vine siege, spawn gốc).

- **Bàn khởi:** 2 nguồn thác (col 3 + col 5), 2 giọt ở vị trí khó tới (2,4)+(6,4), 3 đá tạo
  địa hình. Nước ngập áp lực board ngay từ đầu.
- **Đòn boss:** cứ mỗi **3 lượt** (ân hạn 2 lượt đầu), boss **đảo hướng trọng lực 180°**
  (DOWN ↔ UP). Mọi khối **rơi ngược** → bàn đảo lộn. Thác **đổi mép nguồn** (row 0 ↔ row 8)
  → toàn bộ đường nước thay đổi, vùng ngập mới hoàn toàn.
- **Bào máu:** combo *chạm mức mới ≥ ×2* gây `bậc − 1` sát thương (nhất quán 3 boss).
  Máu = **10**.
- **Chiến thuật:** mỗi đòn đảo → cả bàn sụp → tự tạo cascade → **biến đòn boss thành combo**.
  Nhưng đảo cũng thay đổi đường nước → vùng ngập mới → phải thích ứng chỗ đặt. Giọt trên bàn
  = van giảm ngập (nước chảy qua giọt → giọt vỡ → mở đường, giảm ngập).
- **Thắng:** máu → 0. **Thua:** kẹt khay (ô ngập + khối = hết chỗ đặt).
- Ngân sách xoay = 4. Sao (combo): 3★ ≤5 · 2★ ≤7 · 1★ ≤10.

## 14. Spec chi tiết màn 21–30

Thác + giọt có mặt 9/10 màn. Mỗi màn khai thác 1 khía cạnh mới của cơ chế thác.
Arc cảm xúc:
`gặp thác → nước=áp lực → dẫn nước phá giọt → xoay thác → giọt sau đá → thở →
hai nguồn → mixed → gauntlet → boss đảo thác`.

`MIXED` = phải đạt **cả hai** điều kiện (phá giọt **và** đủ điểm) mới qua màn.

| Màn | Tên | Node | goal_type | Điều kiện qua | Xoay | Thác & Giọt | Sao (3/2/1) |
|---|---|---|---|---|---|---|---|
| 21 | Suối Nhỏ | Thường | `CLEAR_TARGETS` | Phá 2 giọt | ⚠ | 1 nguồn (col 4) · 2 giọt gần đường nước (3,6)+(5,6) | TBD (bot) |
| 22 | Nước Tràn | Thường | `REACH_SCORE` | ⚠ điểm (bot verify) | ⚠ | 1 nguồn (col 4) · 2 giọt xa (1,3)+(7,3) · ngập tạo áp lực board | TBD (bot) |
| 23 | Thác Tách | Thường | `CLEAR_TARGETS` | Phá 3 giọt | ⚠ | 1 nguồn (col 4) · 3 giọt ở 2 bên (1,7)+(4,8)+(7,7) · cần xây tường tách dòng | TBD (bot) |
| 24 | Xoay Thác | Thường | `CLEAR_TARGETS` | Phá 2 giọt | ⚠ | 1 nguồn · 2 giọt ngoài tầm nước DOWN (0,4)+(8,4) · **phải xoay** gravity để thác tới | TBD (bot) |
| 25 | Giọt Sau Đá | Thường | `CLEAR_TARGETS` | Phá 3 giọt | ⚠ | 1 nguồn · 3 giọt sau đá · nước bị đá chặn, cần xoay+xây kênh vòng qua | TBD (bot) |
| 26 | Bến Nghỉ | Breather | `REACH_SCORE` | ⚠ điểm (bot verify) | ⚠ | **Không nguồn, không giọt** — bến nghỉ ven sông | TBD (bot) |
| 27 | Hai Nguồn | Thường | `CLEAR_TARGETS` | Phá 4 giọt | ⚠ | **2 nguồn** (col 2 + col 6) · 4 giọt rải · ngập rộng hơn, quản lý 2 dòng | TBD (bot) |
| 28 | Thác & Điểm | Thường | `MIXED` | 2 giọt + ⚠ điểm | ⚠ | 2 nguồn · 2 giọt khó tới · vừa dẫn nước vừa score | TBD (bot) |
| 29 | Thác Lớn | Thường | `CLEAR_TARGETS` | Phá 5 giọt | ⚠ | 2 nguồn · 5 giọt + 4 đá · gauntlet — dẫn nước qua mê cung đá | TBD (bot) |
| 30 | Thần Thác | Boss | `BOSS_COMBO` | Thần Thác (máu ⚠) | ⚠ | 2 nguồn · 2 giọt + 3 đá · boss đảo gravity mỗi 3 lượt → thác đổi hướng | TBD (bot) |

> **⚠ = cần solver xác định.** Ngưỡng điểm, ngân sách xoay, máu boss, và sao đều phải được
> tính từ bot greedy chạy trên board+pool cụ thể (xem §20 Phương pháp tính ngưỡng).

### Chi tiết thiết kế từng màn

**L21 — Suối Nhỏ.** Gặp thác lần đầu. 1 nguồn ở giữa (col 4), nước chảy xuống qua ô trống.
2 giọt đặt **gần đường nước** — nước gần như tự chảy tới, chỉ cần xây 1–2 tường nhỏ để dẫn
đúng hướng. Guide popup giải thích: "nước chảy từ nguồn, gặp khối thì tách, chạm giọt thì
phá". Nhập môn nhẹ nhàng — hiểu cơ chế trước, khó sau.

**L22 — Nước Tràn.** Nước là **áp lực, không phải công cụ** ở màn này. 2 giọt xa đường nước
(ở góc bàn), goal là score. Nước ngập ô trống → ít chỗ đặt → phải xây tường chặn nước để giữ
chỗ. Dạy: nước ngập = mất không gian. Cân bằng giữa chặn nước (giữ chỗ) và xây cho line
clear (score).

**L23 — Thác Tách.** 3 giọt ở **2 bên** nguồn. Nước chảy thẳng xuống chỉ tới giọt giữa. Để
tới 2 giọt bên → phải **đặt khối chặn giữa đường nước** → nước tách 2 nhánh trái phải → mỗi
nhánh chảy tới 1 giọt bên. Dạy: đặt tường = dẫn nước. Lần đầu chủ động xây kênh.

**L24 — Xoay Thác.** Giọt ở vị trí mà nước DOWN **KHÔNG tới được** (ở 2 bên mép, hàng giữa).
Phải **xoay trọng lực** → thác đổi hướng → nước từ mép mới chảy qua giọt. **Turning point**
của W3: xoay = lái thác lần đầu. Aha moment khi xoay → nước đổ hướng mới → giọt vỡ.

**L25 — Giọt Sau Đá.** 3 giọt bị **đá vây xung quanh**. Nước chảy tới nhưng bị đá chặn. Phải
xoay trọng lực để tìm góc nước lọt qua kẽ đá, HOẶC xây kênh vòng qua đá dẫn nước vào. Khó
nhất nửa đầu — kết hợp xoay + xây kênh + đọc địa hình đá.

**L26 — Bến Nghỉ.** Breather — bến dừng. Không nguồn, không giọt, không ngập. Bàn thoáng, ghi
điểm nhẹ. Thở trước nửa sau khó hơn.

**L27 — Hai Nguồn.** **2 nguồn** lần đầu (col 2 + col 6). Nước ngập rộng hơn nhiều — 2 dòng
thác cùng đổ. 4 giọt rải ở 4 góc. Phải quản lý 2 luồng nước: chặn 1 luồng (giữ chỗ đặt),
dẫn luồng kia tới giọt. Áp lực board tăng mạnh.

**L28 — Thác & Điểm.** Goal MIXED: phá 2 giọt khó tới VÀ ghi 450 điểm. 2 nguồn. Áp lực kép:
xây tường dẫn nước (phá giọt) vs xây cho line clear (score). Tường dẫn nước có thể cản line
clear và ngược lại — phải tìm layout phục vụ cả hai.

**L29 — Thác Lớn.** Tên "Thác Lớn" = đỉnh cao W3. **5 giọt** rải sau **4 đá** + 2 nguồn →
bàn như mê cung. Phải dẫn nước qua kẽ đá, xoay nhiều hướng, xây nhiều kênh. Gauntlet — tổng
lực mọi kỹ năng thác.

**L30 — Thần Thác (Boss).** Boss đảo trọng lực 180° mỗi 3 lượt → **thác đổi hướng hoàn toàn**
(nguồn dời từ row 0 sang row 8). Kênh dẫn nước bạn xây bỗng trở thành vô dụng (nước chảy từ
hướng ngược). Phải **thích ứng liên tục**: (a) combo mỗi lần bàn sụp do đảo (biến đòn boss
thành vũ khí), (b) nhanh chóng xây kênh mới sau mỗi đảo, (c) 2 giọt trên bàn = van giảm ngập
(nước tới giọt → giọt vỡ → bớt ngập → thêm chỗ đặt).

## 15. Hệ quả cần lưu ý (W3)

1. **Code `:core` CẦN BỔ SUNG:**
   - (a) `WaterfallFlow` module: `calculateFlow(grid, sources, gravity) → Set<Vec>` trả về tập
     ô ngập. BFS từ nguồn theo gravity, tách khi gặp obstacle, phá TARGET gặp trên đường.
     Thuần Kotlin/JVM, deterministic, không phụ thuộc Android.
   - (b) `waterSources: List<Int>` trong `Level` config — danh sách cột/hàng nguồn.
   - (c) Tích hợp vào `EndlessEngine`: sau resolve, gọi `calculateFlow` → phá giọt gặp trên
     đường → emit `DropsCleared`. Cập nhật `floodedCells` cho `:game` biết ô nào ngập.
   - (d) `EndlessEngine.canPlace(x, y)` check thêm `!floodedCells.contains(Vec(x,y))`.
   - (e) `CellType.TARGET` đã có. Giọt vẫn rơi theo trọng lực, vẫn phá được bằng line clear
     (giữ tương thích). Thêm cách phá mới: nước chạm.
2. **Render `:game`:**
   - Ô ngập: gợn nước xanh nhạt / sóng nhẹ (overlay, không che khối bên dưới nếu có).
   - Nguồn: hiệu ứng nước đổ ở mép bàn.
   - Đường nước: animation chảy từ nguồn xuống, tách khi gặp vật cản (visual thác).
   - Giọt vỡ: splash effect khi nước chạm giọt.
3. **Boss Thần Thác** dùng `bossGravityEveryN = 3` (đã implement). Khi đảo → nguồn dời mép
   → flow tính lại → ngập mới. Giọt trên bàn boss = van giảm ngập (goal vẫn BOSS_COMBO).
4. **Tương tác cross-world:** vine (W2) = STONE-like đối với nước (nước bị chặn, tách quanh
   vine). Quy tắc MINT phá gốc vine không ảnh hưởng.
5. **Cân bằng:** (a) số nguồn + mật độ đá quyết định % ô ngập — quá ngập → bất khả thi;
   (b) giọt quá gần nguồn = quá dễ, quá xa + sau đá = có thể bất khả thi; (c) cần bot greedy
   verify mọi giọt đều reachable bằng ≤ bộ xoay cho phép.

---

# World 4 · Sa mạc (màn 31–40)

Cập nhật 02/07/2026. **Bản nháp để duyệt.** Bản sắc: **địa hình đá chia bàn**. Sau 2 world thêm cơ
chế mới (dây leo W2, dòng chảy W3), W4 cố tình dùng cơ chế **NHẸ CODE**: **đá cố định** — đã có sẵn
`CellType.STONE` trong `:core` + design system (token `stone`, card C·pool). W4 = luyện *xoay khéo
để lách địa hình*.

## 16. Cơ chế của W4: Đá cố định (Stone terrain)

**Đá** = ô xám bất động: **không rơi, không xoay, không xóa được bằng đầy hàng** (chỉ là vật cản
chiếm chỗ). Vai trò ở W4: **cắt/chia bàn** thành khoang, ép người chơi (1) đặt mảnh khéo quanh đá,
(2) **xoay trọng lực để lùa cụm vòng qua đá** tạo hàng/cột xóa được. Mật độ đá tăng dần theo màn.

Không cần code mới — chỉ preset nhiều ô `STONE` hơn. *(Tuỳ chọn tăng chất về sau: "đá nở" C-pool,
nhưng mặc định W4 dùng đá tĩnh cho nhẹ.)*

**Ô đích "Cổ vật" (`CLEAR_TARGETS`):** một số màn có **cổ vật** (viên ngọc/bình cổ) bị **đá vây
quanh** — phá bằng cách xóa hàng/cột đi qua nó, nhưng đá chắn nên phải xoay/đặt khéo mới lập được
dòng xóa. Khác W3 (giọt chôn dưới khối mềm, moi bằng cascade) — ở đây đá **không** sụp, là câu đố
*lách địa hình cứng*. Cột *Số ô đích* mang số cổ vật.

## 17. Boss L40: "Tượng Cát Cổ" (Lõi Giáp)

Archetype **Lõi Giáp** (level-design.md mục 11, archetype C) — khác W2 (Thần Rừng) & W3 (Thần Thác).
Tượng có **giáp đá**: bào máu bằng combo (mỗi lần combo chạm mức mới ≥ ×2 gây `bậc − 1` sát
thương), **nhưng cứ N lượt không bị đánh, giáp hồi +1 máu** → ép người chơi combo **đều tay**, không
được chần chừ. **Máu = ⚠ (bot).** Nhịp hồi giáp = ⚠ (bot).

## 18. Spec chi tiết màn 31–40

W4 chưa redesign kỹ (chờ W2/W3 chốt + solver sẵn sàng). Bảng dưới giữ cấu trúc thiết kế,
**mọi số liệu = ⚠ TBD**.

| Màn | Tên | Node | goal_type | Điều kiện qua | Xoay | Đá | Cổ vật | Sao (3/2/1) |
|---|---|---|---|---|---|---|---|---|
| 31 | Cát 1 | Thường | `REACH_SCORE` | ⚠ điểm | ⚠ | 2 | – | TBD (bot) |
| 32 | Cát 2 | Thường | `CLEAR_TARGETS` | Phá 2 cổ vật | ⚠ | 3 | 2 | TBD (bot) |
| 33 | Cát 3 | Thường | `REACH_SCORE` | ⚠ điểm | ⚠ | 4 | – | TBD (bot) |
| 34 | Cát 4 | Thường | `MIXED` | 2 cổ vật + ⚠ điểm | ⚠ | 4 | 2 | TBD (bot) |
| 35 | Cát 5 | Thường | `CLEAR_TARGETS` | Phá 3 cổ vật | ⚠ | 5 | 3 | TBD (bot) |
| 36 | Cát 6 | Breather | `REACH_SCORE` | ⚠ điểm | ⚠ | 2 | – | TBD (bot) |
| 37 | Cát 7 | Thường | `CLEAR_TARGETS` | Phá 3 cổ vật | ⚠ | 6 | 3 | TBD (bot) |
| 38 | Cát 8 | Thường | `REACH_SCORE` | ⚠ điểm | ⚠ | 6 | – | TBD (bot) |
| 39 | Cát 9 | Thường | `MIXED` | 3 cổ vật + ⚠ điểm | ⚠ | 6 | 3 | TBD (bot) |
| 40 | Cát 10 | Boss | `BOSS_COMBO` | Tượng Cát Cổ (máu ⚠, giáp hồi) | ⚠ | 8 | – | TBD (bot) |

> **⚠ = cần solver xác định** (xem §20).

## 19. Hệ quả W4 (nhẹ)
1. **Code:** không cần cơ chế mới — chỉ preset thêm ô `STONE`. Boss cần thêm luật "giáp hồi +1 mỗi N
   lượt không bị đánh" (một biến của `bossHP`). N = ⚠ (bot).
2. **Cân bằng:** mật độ đá quá cao dễ gây kẹt → bot greedy kiểm tra còn đường thắng; giáp boss hồi
   quá nhanh thì giảm nhịp hồi.

---

# §20. Phương pháp tính ngưỡng (Solver / Bot Greedy)

Mọi con số ⚠ trong bảng trên PHẢI được tính bằng solver chạy trên `:core`, KHÔNG ước lượng tay.

## 20.1. Solver cần gì

Solver là một **bot greedy** chạy headless trên `:core` (thuần Kotlin/JVM, không cần Android).
Input: `Level` config (board preset + pool mảnh + seed). Output: thống kê qua N lần chơi.

**Chiến lược bot:** mỗi lượt, bot đánh giá mọi vị trí đặt hợp lệ cho mỗi mảnh trong khay,
chấm heuristic (ưu tiên: line clear > combo > MINT gần gốc > giảm lỗ hổng > …), chọn nước tốt
nhất. Xoay trọng lực = thêm 4× branch (mỗi hướng). Không cần tối ưu — greedy đủ cho ước lượng.

## 20.2. Quy trình cho mỗi màn

1. **Feasibility check:** bot chạy 100 seed. Nếu tỉ lệ thắng < 80% → điều chỉnh preset/pool/xoay
   cho đến khi đạt ≥ 80%. Nếu tỉ lệ thắng 100% quá dễ → tăng khó (giảm xoay, tăng vine speed…).
2. **Phân bố kết quả:** từ 100 lần thắng, thu thập:
   - **Số nước** dùng để hoàn thành (cho CLEAR_TARGETS)
   - **Điểm đạt được** (cho REACH_SCORE)
   - **Số nhịp combo** (cho BOSS_COMBO)
   - **Số lần xoay** dùng
3. **Đặt ngưỡng:**
   - **Goal (điều kiện qua):** phân vị P75 (75% bot thắng đạt được) → đặt làm ngưỡng qua màn.
     Người chơi trung bình phải cố gắng nhưng chắc chắn có thể qua.
   - **Ngân sách xoay:** số xoay tối đa bot dùng khi thắng (P95) + 1 dự phòng.
   - **Sao 1★:** = ngưỡng qua màn (P75).
   - **Sao 2★:** P50 (trung vị — chơi khá).
   - **Sao 3★:** P25 (top 25% — chơi tốt).
   - **Máu boss:** P50 combo damage tổng ÷ 0.8 (đảm bảo bot thắng ~50%, người chơi cần khéo hơn).
4. **Golden test:** khoá 1 seed + đường giải mẫu → cùng chuỗi state (bảo vệ deterministic khi
   refactor).

## 20.3. Khi nào chạy được

| World | Cơ chế cần implement trước solver | Trạng thái |
|---|---|---|
| W1 (L1–10) | Tất cả đã có (tray script) | ✅ Chạy được ngay |
| W2 (L11–20) | MINT-only phá gốc + boss vine spawn | ⚠ Cần bổ sung |
| W3 (L21–30) | WaterfallFlow module | ❌ Chưa code |
| W4 (L31–40) | Boss giáp hồi | ⚠ Cần bổ sung |

**Ưu tiên:** implement MINT-only rule (nhỏ, trong `Resolve.kt`) → chạy solver W2 → chốt ngưỡng
W2 → implement WaterfallFlow → chạy solver W3 → W4 cuối cùng.
