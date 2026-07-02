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

Cập nhật 01/07/2026. W2 **không dạy mới** (W1 đã dạy hết) — đây là **world thực chiến đầu
tiên**: luyện xoay + vật lý cụm kẹt cho nhuyễn, dưới áp lực của **cơ chế chữ ký mới của
world: DÂY LEO mọc lan**. Kết world bằng **boss Kẻ Đổ Rác**.

## 8. Cơ chế mới: Dây leo mọc lan (Creeping Vine)

Bản sắc "rừng rậm = rối & kẹt". Dây leo là chướng ngại **tự lan**, cộng hưởng trực tiếp với
xoay trọng lực + cụm cứng — điểm độc nhất so với Woodoku/Block Blast.

**Cấu trúc.** Mỗi dây leo có 1 **gốc** (root) + chuỗi **đốt** (segment). Gốc là *target* của
màn. Đề xuất `:core`: thêm `CellType.VINE` với cờ `isRoot`.

**Luật (deterministic — bắt buộc cho solver/Daily):**

1. **Mọc:** cứ sau mỗi `growEveryN` lượt *thả mảnh*, mỗi dây mọc thêm **1 đốt** từ **đầu dây
   (tip)** sang 1 ô kề **trống**. Thứ tự chọn ô cố định: quét 4 hướng theo thứ tự
   `[ngược hướng trọng lực → phải → theo trọng lực → trái]`, lấy ô trống đầu tiên. Tip kẹt
   (không ô trống kề) → dây *ngừng mọc* lượt đó. Hàm thuần của (state + hướng trọng lực + bộ
   đếm lượt) → không phá deterministic.
   - `growEveryN = 2` (mọc chậm, màn giới thiệu) hoặc `1` (mọc nhanh, màn áp lực).
2. **Bám cứng khi xoay:** ô dây leo **KHÔNG rơi** theo trọng lực/xoay — nó là rễ, đứng yên
   trong khi mọi thứ khác đổ. → xoay vừa lợi (gỡ cụm khác) vừa hại (mở khe trống cho dây mọc).
3. **Diệt:**
   - Xóa hàng/cột **đi qua GỐC** → **cả dây tan** (gốc + mọi đốt). Đây là cách hoàn thành mục tiêu.
   - Xóa qua **đốt thường** → chỉ đốt trên line đó mất. Đốt nào **mất kết nối với gốc** sẽ
     **khô héo → biến thành ô trống** ở cuối lượt (thưởng cho việc cắt gần gốc).
4. **Tính vào clear:** đốt/gốc là ô cứng, **được tính** khi xét hàng/cột đầy → có thể chủ
   động lấp đầy hàng chứa gốc để xóa diệt dây.
5. **Thua:** nếu dây mọc bịt bàn khiến **kẹt khay** → thua theo luật chuẩn (không cần luật riêng).

**Mục tiêu vine =** `CLEAR_TARGETS` với target = tập hợp **gốc** ("Phá hết N gốc dây leo").
Cột *Số ô đích* trong Excel mang **số gốc**.

## 9. Boss L20: Kẻ Đổ Rác (DPS race), máu = 8

- Mỗi lượt (sau khi bạn thả mảnh + resolve), boss **rải một dải lá mục/cành khô** (ô rác cứng)
  chèn vào một cạnh bàn theo **kịch bản cố định** → dồn bàn, ép dọn nhanh. *Ân hạn 2 lượt đầu*
  không đổ để bạn setup. Rác rơi/xoay như ô thường (khác dây leo), xóa được như ô thường.
- **Bào máu:** giữ **nhất quán với boss L10** — mỗi lần combo *chạm mức mới ≥ ×2* gây sát
  thương = `bậc − 1` (×2→1, ×3→2, ×4→3…). Máu boss = **8**.
- **Thắng:** máu → 0 trước khi kẹt khay. **Thua:** kẹt khay. Ngân sách xoay = 3.
- Sao (số nhịp combo để hạ): 3★ ≤4 · 2★ ≤6 · 1★ ≤8 (hạ bằng toàn ×2 = 8 nhịp).

## 10. Spec chi tiết màn 11–20

Ngưỡng điểm nối tiếp W1 (kết ở 200) → leo 250…400. Khó ~2.0 → 3.5, "thở" ở L16, boss L20.
`MIXED` = phải đạt **cả hai** điều kiện (phá gốc **và** đủ điểm) mới qua màn.

| Màn | Tên | Node | goal_type | Điều kiện qua | Xoay | Gốc dây | Sao (3/2/1) | Khó |
|---|---|---|---|---|---|---|---|---|
| 11 | Rừng 1 | Thường | `REACH_SCORE` | 250 điểm | 1 | – | 450/320/250 | 2.0 |
| 12 | Rừng 2 | Thường | `REACH_SCORE` | 300 điểm | 1 | – | 520/400/300 | 2.0 |
| 13 | Rừng 3 | Thường | `CLEAR_TARGETS` | Phá 1 gốc (mọc chậm N=2) | 1 | 1 | 6/8/10 nước | 2.5 |
| 14 | Rừng 4 | Thường | `CLEAR_TARGETS` | Phá 2 gốc | 1 | 2 | 8/10/12 nước | 2.5 |
| 15 | Rừng 5 | Thường | `MIXED` | 1 gốc + 300 điểm | 2 | 1 | 480/380/300 | 3.0 |
| 16 | Rừng 6 | Breather | `MAKE_SUPER1` | Ghép 1 siêu khối | 2 | – | 3/4/5 nước | 1.5 |
| 17 | Rừng 7 | Thường | `CLEAR_TARGETS` | Phá 2 gốc (mọc nhanh N=1) | 2 | 2 | 9/11/13 nước | 3.0 |
| 18 | Rừng 8 | Thường | `REACH_SCORE` | 400 điểm | 2 | – | 620/500/400 | 3.0 |
| 19 | Rừng 9 | Thường | `MIXED` | 2 gốc + 350 điểm | 2 | 2 | 560/450/350 | 3.5 |
| 20 | Rừng 10 | Boss | `BOSS_COMBO` | Kẻ Đổ Rác (máu 8) | 3 | – | 4/6/8 combo | 3.5 |

## 11. Hệ quả cần lưu ý (W2)

1. **Code `:core` mới cần có trước khi chơi được:** `CellType.VINE` + bước mọc deterministic +
   tương tác diệt/bám-cứng-khi-xoay; và cho boss: bước "đổ rác" theo kịch bản + thanh `bossHP`.
   Render dây leo/rác trong `:game`. Thêm cờ `growEveryN`, `debrisScript` vào `campaignTuning`.
2. **Ripple với W3 (Sông):** khung cũ cho W3 sở hữu "ô đích + cascade". Nay ô đích đã xuất hiện
   ở W2 dưới dạng *gốc dây leo*. **Cần quyết** bản sắc mới cho W3 (gợi ý: ô đích "giọt nước"
   kiểu khác + nhấn cascade dài) — ngoài phạm vi lần này.
3. **Cân bằng dây leo** là rủi ro lớn nhất: `growEveryN` quá nhỏ → nghẹt bàn ức chế. Cần bot
   greedy chạy thử để chốt nhịp mọc + độ phủ ban đầu cho từng màn.

---

# World 3 · Sông & Thác (màn 21–30)

Cập nhật 02/07/2026. **Bản nháp để duyệt.** Bản sắc: **nước chảy = phản ứng dây chuyền**. W3 giải
quyết ripple đã nêu (ô đích xuất hiện sớm ở W2) bằng cách cho ô đích một *vai trò khác*: **giọt
nước** phải được **cascade cuốn trôi**, kèm cơ chế chữ ký mới **DÒNG CHẢY**.

## 12. Cơ chế mới: Dòng chảy (Current / ô trượt)

Thác đổ = có "dòng". Một hoặc hai **dải dòng chảy** (hàng/cột đánh dấu) đẩy mọi ô nằm trên đó
**trôi 1 bước theo hướng dòng sau mỗi lượt** người chơi. Xoay trọng lực để **lái dòng** → dựng
cascade dài hoặc đẩy giọt nước tới chỗ xóa.

**Luật (deterministic):**
1. **Trôi:** sau mỗi lượt thả mảnh + resolve, mọi ô trên dải dòng dịch 1 ô theo hướng dòng; ô ra
   khỏi mép dải thì dừng (nhập vào phần bàn thường, rồi chịu trọng lực). Hàm thuần của state → ok.
2. **Tương tác xoay:** khi xoay trọng lực, dòng vẫn theo hướng *cố định của dải* (dòng không xoay)
   → tạo thế "trọng lực một đằng, dòng một nẻo" = câu đố đặc trưng W3.
3. **Cường độ:** `flowLanes` = 1 (giới thiệu) → 2 (mạnh). Cờ trong `campaignTuning`.

**Ô đích "giọt nước" (`CLEAR_TARGETS`):** phá bằng cách xóa hàng/cột đi qua nó. Một số màn **chôn
sâu** (E2): giọt nằm dưới lớp khối/đá → phải cascade nhiều tầng mới lộ & xóa được.

> **Phương án nhẹ code (nếu muốn):** bỏ "dòng chảy", giữ W3 = *cascade dài + ô đích giọt nước
> (có chôn sâu)*. Vẫn thuần cơ chế lõi, không cần `:core` mới. Dòng chảy là phần tăng "chất" —
> đánh dấu ⚠ để bạn chọn khi duyệt.

## 13. Boss L30: "Thần Thác" (Tham Trọng Lực), máu = 10

Archetype **Tham Trọng Lực** (mechanics A6/F1) — khác boss W2 (Kẻ Đổ Rác). Boss **tự đảo hướng
trọng lực/dòng mỗi 3 lượt**, ép người chơi tiêu ngân sách xoay giành lại nhịp + biến đòn của boss
thành combo cho mình. Bào máu bằng combo: mỗi lần combo *chạm mức mới ≥ ×2* gây `bậc − 1` sát
thương. **Máu = 10.** Sao (số nhịp combo): 3★ ≤5 · 2★ ≤7 · 1★ ≤10 (toàn ×2 = 10 nhịp).

## 14. Spec chi tiết màn 21–30

Điểm nối tiếp W2 (kết ~400) → leo 450…550. Ô đích 2→4. Khó ~2.5 → 4.0, "thở" ở L26, boss L30.
`MIXED` = phá đủ giọt **và** đủ điểm.

| Màn | Tên | Node | goal_type | Điều kiện qua | Xoay | Giọt | Sao (3/2/1) | Khó |
|---|---|---|---|---|---|---|---|---|
| 21 | Sông 1 | Thường | `CLEAR_TARGETS` | Phá 2 giọt (dòng nhẹ 1 dải) | 2 | 2 | 7/9/11 nước | 2.5 |
| 22 | Sông 2 | Thường | `REACH_SCORE` | 450 điểm (cascade dòng) | 2 | – | 700/560/450 | 2.5 |
| 23 | Sông 3 | Thường | `CLEAR_TARGETS` | Phá 3 giọt | 2 | 3 | 8/10/12 nước | 3.0 |
| 24 | Sông 4 | Thường | `MIXED` | 2 giọt + 400 điểm | 2 | 2 | 640/520/400 | 3.0 |
| 25 | Sông 5 | Thường | `CLEAR_TARGETS` | Phá 3 giọt **chôn sâu** (E2) | 3 | 3 | 10/12/14 nước | 3.5 |
| 26 | Sông 6 | Breather | `REACH_SCORE` | 300 điểm (thở) | 2 | – | 480/380/300 | 2.0 |
| 27 | Sông 7 | Thường | `CLEAR_TARGETS` | Phá 4 giọt (dòng mạnh 2 dải) | 3 | 4 | 11/13/15 nước | 3.5 |
| 28 | Sông 8 | Thường | `REACH_SCORE` | 550 điểm | 3 | – | 850/700/550 | 3.5 |
| 29 | Sông 9 | Thường | `MIXED` | 3 giọt + 450 điểm | 3 | 3 | 720/580/450 | 4.0 |
| 30 | Sông 10 | Boss | `BOSS_COMBO` | Thần Thác (máu 10) | 4 | – | 5/7/10 combo | 4.0 |

## 15. Hệ quả W3 (cần lưu ý)
1. **Code `:core`:** nếu giữ dòng chảy → thêm dải `flowLanes` + bước trôi deterministic + render.
   Ô đích chôn sâu chỉ cần preset (ô đích dưới lớp khối) — engine đã hỗ trợ.
2. **Boss Thần Thác** cần đòn "đảo trọng lực mỗi N lượt" (A6) — đã có nền `GravityRotation`, chỉ
   cần lịch tự động + thanh `bossHP` (dùng chung với boss W2).
3. **Cân bằng:** cường độ dòng + số giọt chôn sâu cần bot greedy chạy thử.
