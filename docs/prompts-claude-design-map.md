# Prompts cho Claude Design — Màn hình Map (bám Design System nền tảng)

Bộ prompt để **dán vào Claude Design** sinh thiết kế UI **màn hình bản đồ leo màn** (Campaign, 100 màn đầu, bản 1.0.0), **bám đúng "Gravity Jelly Design System" nền tảng** đã có (tokens + components).

> **Lưu ý quan trọng:** Bỏ qua màn campaign-map hiện tại trong design system (đang chưa ổn). Các prompt dưới đây dùng để **làm lại màn map từ đầu**, nhưng vẫn **kế thừa nguyên tokens, font, màu, và các component nền tảng** (JellyBlock, Button, HUD, Dialog…). Mọi giá trị màu/cỡ/bo/đổ bóng dưới đây lấy thẳng từ design system thật — giữ nguyên để không lệch thương hiệu.

Phạm vi: **chỉ màn hình map**. Thiết bị nền: **360 × 800 dp dọc**, gutter ngoài 16dp, vùng chạm tối thiểu 48dp.

---

## 0. Cách dùng

Bộ prompt chia **2 nhóm độc lập** — đừng chạy 1→2→3.1→3.2… như một chuỗi nối tiếp:

**NHÓM A — Nội dung map theo từng world** (đây là phần "vẽ map" chính, làm tuần tự W1 → W10):
- Prompt 1 (tokens) chạy 1 lần đầu.
- Prompt 2 = một viewport mẫu; Prompt 2B = dải đầy đủ một world. **Lặp lại cho từng world**, mỗi lần đổi tên world + khoảng màn + palette theo "BẢN ĐỒ WORLD → KHOẢNG MÀN" (Prompt 1). VD: xong W1–W2 rồi thì tiếp World 3 "Sông & Thác" node 21–30, World 4 "Sa mạc" node 31–40…

**NHÓM B — Mẫu trạng thái & component DÙNG LẠI** (Prompt 3.x): KHÔNG gắn với world cụ thể, KHÔNG phải bước kế tiếp của map. Chạy **khi cần thiết kế trạng thái đó**, một lần là đủ (áp cho mọi world):
- 3.1 node states · 3.2 HUD · 3.3/3.4 cổng (mở/khoá) · 3.5 cutscene chuyển cảnh · 3.6 thưởng sao · 3.7 FTUE → có thể làm bất cứ lúc nào, ví dụ world nào cũng dùng được (đổi tên world trong ví dụ cho khớp world bạn đang làm).
- **3.8 end-of-content (World 10 · Vũ trụ) → để CUỐI CÙNG**, chỉ làm sau khi đã thiết kế tới World 10. Nó chỉ là *trạng thái màn hình khi người chơi đạt node 100*, KHÔNG phải bước sau World 2. Bỏ qua bây giờ.

Prompt 4 = bảng 10 nền biome (làm 1 lần để chốt tông cảnh). Phần 5 = tokens rút gọn, dán lại khi mất ngữ cảnh.

**Bạn đang ở đâu:** vừa xong map W1–W2 và các mẫu 3.1–3.7. Bước hợp lý tiếp theo là **NHÓM A cho World 3** (Prompt 2B, "Sông & Thác", node 21–30), không phải 3.8.

---

## 1. PROMPT — Context & Foundation tokens (chạy đầu tiên)

```
Bối cảnh: Thiết kế lại MÀN HÌNH BẢN ĐỒ "leo màn" (level map) cho game puzzle casual Android "Gravity Jelly". PHẢI bám đúng design system "Gravity Jelly" hiện có. Bỏ qua mọi bản campaign-map cũ.

Phong cách thương hiệu "block jelly": nhân vật là KHỐI JELLY bo tròn có MẮT, viền dày, mặt trên có vệt bóng (gloss), tông kẹo ngọt, nền kem ấm, soft shadow nâu nhạt. Vui, thân thiện, sạch.

Thiết bị: điện thoại Android dọc 360 × 800 dp. Gutter 16dp. Vùng chạm ≥ 48dp.

FONT (bắt buộc):
- Display & số: "Fredoka" (rounded, 400–700).
- Body & nhãn UI: "Nunito" (600–800).
- Cỡ: tiêu đề màn 28, heading/dialog 22, số HUD 20, body 16, nhãn nút 14, caption 12, số trên khối jelly 18, logo/điểm lớn 40. Line-height tiêu đề/số 1.05. Nhãn small-caps dùng letter-spacing 0.04em.

MÀU (lấy thẳng từ design system, GIỮ NGUYÊN):
- Nền: bg kem #FFF7EC; surface trắng #FFFFFF; surface chìm #F4E9D8; scrim dialog rgba(60,44,24,0.42).
- 4 KHỐI JELLY (nhân vật thương hiệu) — fill / viền(edge) / bóng(shine):
  · Vàng #FFE3A3 / #E8B85C / #FFF1CE
  · Bạc hà (mint) #A3E5D9 / #5FC3B2 / #CBF2EB
  · Hồng #F7A9C0 / #E576A0 / #FBD0DF
  · Xanh dương #B3C7F7 / #7E9CE8 / #D6E1FB
- Đá (ô khoá/cố định): #C9BCA8 / viền #A89A82 / bóng #DBD0BF.
- Chữ: chính #5B4636 (nâu cocoa ấm); mờ #9B886F; trên nền tối/màu #FFFFFF; trên khối jelly #6A4A2E.
- CTA chính (primary): cam tangerine #FF9F68 / viền #E97E45 / bóng #FFC59A.
- Ngữ nghĩa: success #6FCF7F; warning #FFCA66; danger #F08A7E; info #8FB6F2.
- Gravity (accent cơ chế chữ ký — trọng lực): TÍM #7E6CF0 / viền #6353D6 / bóng #A99CF6.
- Đổ bóng: mềm rgba(120,92,52,0.16); đậm rgba(120,92,52,0.24).

HÌNH & ĐỘ BO:
- Lưới 4dp: spacing 2/4/8/12/16/24/32/48.
- Bo: chip 8, ô jelly 12, thẻ 20, nút/panel chính 28, sheet lớn 36, pill 999.
- Viền: mảnh 1.5, viền khối jelly 3, focus 4.
- Đổ bóng: sm 0 2 6, md 0 6 14, lg 0 12 28; ô jelly có gloss inset trên đỉnh.

COMPONENT TÁI DÙNG (đừng vẽ lại từ đầu — dùng đúng style hệ thống):
- JellyBlock: khối jelly bo tròn có mắt, viền dày 3dp, gloss đỉnh, 4 màu trên; có thể mang một CON SỐ ở giữa.
- Button (nút kẹo có cạnh 3D lún khi nhấn): variant primary | gravity | success | danger | secondary | ghost; size cta 56dp (bo 28). Nút "SẮP CÓ" làm mờ + gắn pill "SẮP CÓ".
- HUD bar trên cao 56dp.

CHUYỂN ĐỘNG: ngắn, mượt 150–450ms; nảy nhẹ kiểu jelly (ease bouncy) cho pulse/pop.

BẢN ĐỒ WORLD → KHOẢNG MÀN (BẮT BUỘC đánh số đúng, mỗi world đúng 10 màn liên tiếp):
- World 1 · Đồng cỏ: màn 1–10
- World 2 · Rừng rậm: màn 11–20
- World 3 · Sông & Thác: màn 21–30
- World 4 · Sa mạc: màn 31–40
- World 5 · Bãi biển: màn 41–50
- World 6 · Núi tuyết: màn 51–60
- World 7 · Hang băng: màn 61–70
- World 8 · Núi lửa: màn 71–80
- World 9 · Bầu trời: màn 81–90
- World 10 · Vũ trụ: màn 91–100
Trong mỗi world (vị trí 1..10): màn thứ 6 là BREATHER, màn thứ 10 là BOSS. Tức boss = 10,20,30,…,100; breather = 6,16,26,…,96. Node phải đánh đúng số thật theo bảng này, KHÔNG tự chọn số bắt đầu khác.

Ghi nhớ toàn bộ cho các prompt sau.
```

---

## 2. PROMPT — Màn map chính (mặc định)

```
Vẽ MÀN HÌNH MAP chính — khung ĐẦU GAME: WORLD 1 "Đồng cỏ", hiển thị MÀN 1–10. Artboard 360×800dp dọc, dùng đúng tokens & component đã thiết lập.

HƯỚNG: con đường đi DỌC, người chơi LEO TỪ DƯỚI LÊN. ĐÁNH SỐ CHÍNH XÁC: màn 1 ở ĐÁY, đi lên dần 2, 3, 4, 5, 6, 7, 8 (8 node trong khung nhìn). KHÔNG bắt đầu từ số khác ngoài 1.

BA LỚP (sau → trước):
A) NỀN BIOME: World 1 "Đồng cỏ": trời gradient #DEF0E1→#C6E8C9, đồi tròn xếp lớp xanh, vài cây/bụi bo tròn ở hai mép đường, hoa cúc nhỏ accent #F6D86B. Chỉ dùng gradient + hình bo tròn phẳng (không ảnh).
B) ĐƯỜNG + NODE: con đường mòn bo tròn, mềm, uốn lượn trái–phải, nền surface #FFFFFF với tim đường chấm bi (dashed) #EFE0C9; đoạn ĐÃ ĐI tô thêm lớp primary #FF9F68 mảnh. Đánh số node đúng như sau (từ đáy lên):
   - Màn 1, 2, 3: ĐÃ HOÀN THÀNH — JellyBlock bo tròn (luân phiên 4 màu jelly), MANG ĐÚNG SỐ (1,2,3) màu #6A4A2E, viền 3dp, gloss đỉnh; trên mỗi node có vòng cung 3 NGÔI SAO (ví dụ: màn 1 = 3 sao, màn 2 = 2 sao, màn 3 = 1 sao; sao đạt #FFC23D, chưa đạt xám nhạt).
   - Màn 4: NODE HIỆN TẠI (kế tiếp) — đĩa surface trắng viền primary #FF9F68, VÒNG PULSE primary, MASCOT khối jelly hồng có mắt đứng nhún trên node; dưới gắn pill primary "Chơi ngay" (Fredoka 13, chữ trắng).
   - Màn 5, 7, 8: KHOÁ — khối ĐÁ (#C9BCA8 viền #A89A82) + ổ khoá trắng, không sao, mang số 5/7/8; đường nối tới chúng vẽ mờ.
   - Màn 6: BREATHER (khoá) — JellyBlock nhỏ hơn, nhạt, số 6, tag "Nghỉ" xám.
   - (Boss của World 1 là MÀN 10, nằm cao hơn ngoài khung — không bắt buộc trong khung này.)
C) HUD TRÊN (sticky, cao 56dp, surface #FFFFFF, đổ bóng md):
   - Trái: nút icon "Quay lại" (secondary, 48dp, bo 12).
   - Giữa: small-caps "THẾ GIỚI 1 · HÀNH TRÌNH" (#9B886F, 10, letter-spacing 0.04em) + "Đồng cỏ" (Fredoka 20, #5B4636).
   - Phải: chip pill sao: sao vàng + "★ 7" (Fredoka 16).
   - Dưới HUD: thanh tiến độ (bo full, nền #F4E9D8, phần đạt gradient #FFCA66→#FF9F68) + caption "Còn 11★ để mở Rừng rậm" (Nunito 11, #9B886F).

CUỘN (QUAN TRỌNG): khung này chỉ là MỘT VIEWPORT của một bản đồ cuộn dọc dài hơn. Vì vậy:
- Con đường + nền phải CHẢY QUA MÉP: đường đi ra khỏi MÉP TRÊN (dẫn lên màn cao hơn) và đi vào từ MÉP DƯỚI (từ màn thấp hơn) — KHÔNG kết thúc cụt trong khung.
- HUD trên là lớp DÍNH (sticky) đè lên nội dung cuộn; nội dung map chạy phía sau HUD.
- Không vẽ thanh cuộn. Có thể thêm gợi ý "còn nữa" rất nhẹ (mờ dần mép trên).

Cảm giác: kẹo ngọt, chunky, soft shadow, độ sâu rõ; bám đúng màu & font hệ thống. KHÔNG dùng xanh lá cho nút CTA (CTA luôn cam #FF9F68).

[Muốn vẽ world khác: giữ nguyên bố cục, đổi tên world + nền biome + DÃY SỐ NODE theo "BẢN ĐỒ WORLD → KHOẢNG MÀN" ở Prompt 1. VD World 4 Sa mạc → node 31–40; World 9 Bầu trời → node 81–90.]
```

### 2B. PROMPT — Dải cuộn ĐẦY ĐỦ một world (tall artboard)

Prompt 2 chỉ ra một viewport (8 node). Để thấy trọn một world + cách nối sang world sau (phần dễ bị thiếu khi chỉ vẽ 1 khung), vẽ một **artboard CAO** chứa cả 10 node + cổng world.

```
Vẽ DẢI BẢN ĐỒ CUỘN ĐẦY ĐỦ của WORLD 1 "Đồng cỏ" — artboard CAO 360 × 2600dp (dọc, dài, mô phỏng nội dung cuộn), KHÔNG có HUD (HUD là lớp dính riêng).

NỘI DUNG từ DƯỚI lên TRÊN, một con đường mòn LIÊN TỤC uốn lượn, đánh số node CHÍNH XÁC 1→10:
- Đáy: đường vào từ mép dưới.
- Màn 1, 2, 3, 4, 5: node thường (JellyBlock luân phiên 4 màu, có số, 3-sao arc; tô vài node đã hoàn thành, vài node khoá đá tuỳ minh hoạ tiến độ).
- Màn 6: BREATHER (nhỏ, nhạt, tag "Nghỉ").
- Màn 7, 8, 9: node thường.
- Màn 10: BOSS (to hơn 1.2×, hào quang gravity tím #7E6CF0, tag "BOSS").
- Trên màn 10: CỔNG WORLD sang World 2 "Rừng rậm" (banner pill surface + huy hiệu + tên + chip sao yêu cầu); nền phía trên cổng CHUYỂN DẦN sang palette Rừng rậm (#CFE6CE→#B2D3AC).
- Đỉnh: đường tiếp tục đi ra mép trên (vào World 2).

NỀN: World 1 Đồng cỏ (trời #DEF0E1→#C6E8C9, đồi tròn, cây/bụi hai mép), blend mượt sang Rừng rậm ở đoạn cổng. Đường nền surface #FFFFFF, tim đường chấm bi #EFE0C9, đoạn đã đi tô primary #FF9F68.

Mục đích: kiểm tra đường nối liền mạch, nhịp 10 node, vị trí breather/boss/cổng, và cách hai world nối nhau khi cuộn. Bám đúng tokens & component hệ thống.
```

> Mẹo: muốn xem **đường khớp khi cuộn**, đảm bảo toạ độ x của node ở MÉP TRÊN của dải này trùng với node ở MÉP DƯỚI của dải world kế — để hai dải ghép lại liền mạch.

---

## 3. PROMPTS — Trạng thái & component (biến thể, DÙNG LẠI)

> Đây là **mẫu trạng thái độc lập**, không phải các bước map nối tiếp. Làm khi cần, áp cho mọi world. Ví dụ trong prompt dùng World 1→2 cho dễ hình dung — cứ đổi tên world/khoảng màn cho khớp world bạn đang thiết kế. **3.8 để cuối cùng** (cần World 10).

### 3.1 Style sheet các trạng thái NODE

```
Dựa trên tokens đã thiết lập, vẽ BẢNG COMPONENT các biến thể NODE trên nền kem #FFF7EC, mỗi mẫu có nhãn Nunito bên dưới:
1. Hoàn thành 3 sao — JellyBlock màu jelly + số, 3 sao vàng #FFC23D đầy.
2. Hoàn thành 2 sao — sao thứ 3 xám nhạt.
3. Hoàn thành 1 sao — chỉ 1 sao đầy.
4. Hiện tại — đĩa trắng viền primary #FF9F68 + vòng pulse + mascot jelly hồng có mắt + pill "Chơi ngay".
5. Khoá — khối đá #C9BCA8 viền #A89A82 + ổ khoá trắng.
6. Breather — JellyBlock nhỏ hơn, tông nhạt + tag "Nghỉ" xám.
7. Boss — JellyBlock to hơn 1.2×, hào quang/burst accent gravity tím #7E6CF0 + tag "BOSS" tím.
Tất cả viền 3dp, gloss đỉnh, đổ bóng sm. 2 hàng, cách đều. Đây là tài liệu component.
```

### 3.2 HUD trên (component)

```
Vẽ COMPONENT HUD map, full 360dp, cao 56dp, surface #FFFFFF, đổ bóng md, bo dưới 20.
- Trái: nút icon "Quay lại" 48dp (secondary, bo 12, icon #5B4636).
- Giữa: "THẾ GIỚI 1 · HÀNH TRÌNH" small-caps #9B886F 10 + "Đồng cỏ" Fredoka 20 #5B4636.
- Phải: chip pill sao: sao vàng #FFC23D + "★ 24" Fredoka 16 #5B4636, nền surface, đổ bóng sm.
- Hàng dưới: thanh tiến độ bo full, nền #F4E9D8, phần đạt gradient #FFCA66→#FF9F68; caption "Còn 6★ để mở Rừng rậm".
Vẽ trên 2 nền (Đồng cỏ sáng và Vũ trụ tối) để chứng minh chữ vẫn đọc tốt.
```

### 3.3 Cổng world — ĐỦ SAO (mở)

```
Dựa trên màn map, vẽ biến thể "tới CỔNG WORLD giữa World 1 (Đồng cỏ) và World 2 (Rừng rậm), ĐÃ ĐỦ SAO".
- Banner cổng dạng pill surface #FFFFFF, đổ bóng md, viền mảnh #EFE0C9: huy hiệu tròn success #6FCF7F + icon check trắng, cụm chữ "THẾ GIỚI 2" small-caps #9B886F + "Rừng rậm" Fredoka 16 #5B4636, và chip sao yêu cầu (sao + số).
- Đường đi xuyên qua cổng; phía trên cổng nền chuyển dần sang palette World 2 (trời #CFE6CE→#B2D3AC, cây thông xanh đậm, thân #6D4C32).
- Hiệu ứng lấp lánh nhẹ quanh cổng. Cảm giác phần thưởng, sắp sang vùng mới.
```

### 3.4 Cổng world — KHOÁ (thiếu sao)

```
Vẽ biến thể CỔNG WORLD bị KHOÁ.
- Banner cổng tông trầm hơn: huy hiệu tròn surface chìm #F4E9D8 + ổ khoá; "THẾ GIỚI 2 · Rừng rậm".
- Dòng "Cần thêm 6★ để mở" (Nunito 12 #9B886F) + thanh tiến độ sao bo full (đã 12★ / cần 18★), phần đạt gradient #FFCA66→#FF9F68.
- Nút phụ pill nhỏ "Cày sao ★" (warning #FFCA66) gợi ý quay lại màn chưa đạt 3 sao.
- Node World 2 phía trên hiện mờ/khoá.
Giữ tông vui nhưng truyền tải "chưa tới lúc".
```

### 3.5 Cutscene chuyển cảnh world (1 khung)

```
Vẽ 1 KHUNG đại diện animation "vừa qua cổng, chuyển cảnh World 1 → World 2".
- Nửa dưới: cảnh Đồng cỏ đang trôi đi (hơi mờ chuyển động).
- Nửa trên: cảnh Rừng rậm hiện lên (trời #CFE6CE→#B2D3AC, nhiều cây thông, sương).
- Giữa: banner lớn bo 28 surface #FFFFFF "THẾ GIỚI 2 — RỪNG RẬM" (Fredoka 22 #5B4636) + confetti/lấp lánh, một mascot jelly có mắt vẫy tay.
Cao trào, festive, vẫn đúng palette hệ thống.
```

### 3.6 Vừa thắng — quay lại map (thưởng sao)

```
Vẽ biến thể "VỪA HOÀN THÀNH màn, quay lại map".
- Node vừa xong chuyển sang hoàn thành, 2–3 sao vàng #FFC23D đang BAY VÀO vị trí + particle lấp lánh.
- Đường nối sang node kế đang SÁNG DẦN bằng lớp primary #FF9F68.
- Mascot jelly có mắt đang NHẢY từ node cũ sang node kế (có bóng đổ).
- Node kế bắt đầu pulse primary + pill "Chơi ngay".
- Popup nhỏ "+3 ★" bay lên (Fredoka, #5B4636).
Cảm giác tưởng thưởng, nảy nhẹ kiểu jelly.
```

### 3.7 FTUE — lần đầu vào map

```
Vẽ biến thể "LẦN ĐẦU người chơi mới vào map".
- Camera ở đáy, World 1 Đồng cỏ; chỉ node 1 sáng + pulse primary, các node trên khoá mờ.
- Lớp phủ tối nhẹ scrim rgba(60,44,24,0.42) toàn màn, KHOÉT SÁNG quanh node 1 (spotlight).
- HAND POINTER trỏ vào node 1, có gợn chạm.
- Caption dưới node 1: "Chạm để bắt đầu!" (Nunito).
- HUD: "★ 0" và "THẾ GIỚI 1 · Đồng cỏ".
Tông chào đón, thân thiện.
```

### 3.8 End-of-content — node 100 (1.0.0)

> ⚠️ **Để CUỐI CÙNG.** Chỉ làm sau khi đã thiết kế xong tới World 10. Đây là trạng thái màn hình khi người chơi hoàn thành node 100 — KHÔNG phải bước kế tiếp khi mới làm xong World 2. Nếu chưa tới World 10, BỎ QUA prompt này.

```
Vẽ biến thể "đã hoàn thành node 100 (hết nội dung 1.0.0)".
- Cảnh World 10 Vũ trụ (trời #3D3070→#221A42, sao neon, accent cyan #7CE6D6); node 100 (boss) hoàn thành 3 sao rực rỡ.
- Phía trên node 100, thay node khoá kéo dài, hiện BẢNG bo 28 surface nổi giữa các vì sao: "HẾT CHƯƠNG!" (Fredoka 22) + "Nội dung mới sắp ra mắt 🚀" (Nunito).
- Hai nút: "Chơi Endless" (Button primary cam) và "Chơi Daily" (Button secondary, có pill "SẮP CÓ" nếu chưa làm).
- Confetti nhẹ. Không vẽ node khoá vô nghĩa. Cảm giác hoàn thành, mong chờ.
```

---

## 4. PROMPT — 10 nền biome (palette thật của hệ thống)

```
Tạo BẢNG 10 NỀN MAP, mỗi nền một ô dọc nhỏ, cùng bố cục đường uốn lượn + vài node, CHỈ đổi cảnh & palette theo từng world (dùng đúng palette dưới đây — đã có trong design system). Mỗi ô ghi nhãn tên world. Mục tiêu: thấy tông chuyển mượt từ xanh tươi (1) tới tím neon vũ trụ (10). Đường/node giữ nhất quán, chỉ khác cảnh & accent.

PALETTE WORLD (trời gradient [trên→dưới] · accent):
1 Đồng cỏ #DEF0E1→#C6E8C9 · #F6D86B
2 Rừng rậm #CFE6CE→#B2D3AC · #C9A06A
3 Sông & Thác #D6EEF1→#B4E0EA · #EAFAFB
4 Sa mạc #FBEBCB→#F4D69D · #C9A36E
5 Bãi biển #D7F0EC→#BCE6DE · cát #EFE0BE
6 Núi tuyết #E8F1F8→#CFE0EE · #9DB8D4
7 Hang băng #D2DAF0→#B8ACE3 · pha lê #7CE6E0
8 Núi lửa #E8A37C→#43302A · dung nham #F4853F
9 Bầu trời #CFE3F7→#EFD6E3 · #FBE9B0
10 Vũ trụ #3D3070→#221A42 · neon #7CE6D6

Dùng gradient + hình bo tròn phẳng, không ảnh. Node vẫn dùng 4 màu jelly luân phiên (node là nhận diện thương hiệu, KHÔNG đổi theo world).
```

> Tham khảo (không cần ở 1.0.0): về sau cảnh lặp vòng vô hạn = 10 biome × overlay thời điểm (ngày/chiều/đêm/bình minh) × dịch hue — xem `level-design.md`.

---

## 5. Tokens rút gọn (dán lại khi cần)

```
THIẾT BỊ 360×800dp dọc, gutter 16, touch ≥48. FONT: display/số "Fredoka" 400–700; body "Nunito" 600–800; cỡ tiêu đề 28 / heading 22 / số HUD 20 / body 16 / nhãn 14 / caption 12 / số khối 18 / logo 40; leading số 1.05.
MÀU: bg #FFF7EC; surface #FFFFFF; surface-chìm #F4E9D8; scrim rgba(60,44,24,.42). Jelly fill/edge/shine — vàng #FFE3A3/#E8B85C/#FFF1CE · mint #A3E5D9/#5FC3B2/#CBF2EB · hồng #F7A9C0/#E576A0/#FBD0DF · xanh #B3C7F7/#7E9CE8/#D6E1FB. Đá #C9BCA8/#A89A82/#DBD0BF. Chữ #5B4636 / mờ #9B886F / invert #FFF / trên-khối #6A4A2E. Primary CTA #FF9F68/#E97E45/#FFC59A. Gravity tím #7E6CF0/#6353D6/#A99CF6. success #6FCF7F · warning #FFCA66 · danger #F08A7E · info #8FB6F2. Sao #FFC23D. Bóng mềm rgba(120,92,52,.16) / đậm .24.
HÌNH: spacing 2/4/8/12/16/24/32/48; bo chip8/ô12/thẻ20/nút28/sheet36/pill full; viền 1.5/3/4; gloss inset trên ô jelly. Motion 150–450ms, ease nảy jelly cho pulse/pop.
STYLE: khối jelly bo tròn CÓ MẮT, viền dày, gloss đỉnh; Button kẹo có cạnh 3D; CTA luôn cam, KHÔNG xanh lá. Node map tô 4 màu jelly luân phiên (= thương hiệu).
```

---

## 6. Checklist nghiệm thu

- [ ] Dùng đúng font Fredoka (số/tiêu đề) + Nunito (body); KHÔNG font lạ.
- [ ] Màu khớp tokens: nền kem, node 4 màu jelly, CTA cam #FF9F68, accent gravity tím, đá cho node khoá.
- [ ] Node = JellyBlock có mắt + viền dày + gloss; phân biệt rõ 3 trạng thái (hoàn thành+sao / hiện tại pulse+"Chơi ngay" / khoá ổ khoá) không chỉ bằng màu.
- [ ] Có node breather (nhạt) và boss (to + hào quang gravity tím).
- [ ] HUD: back / tên world / chip sao + thanh tiến độ; chữ đọc được trên nền sáng lẫn tối.
- [ ] Cổng world đủ 2 trạng thái (mở success / khoá + "Cần thêm N★").
- [ ] Có khung FTUE, cutscene chuyển cảnh, thưởng sao sau thắng, end-of-content node 100.
- [ ] Đường đi uốn lượn, leo từ dưới lên, số màn tăng dần; vùng chạm node ≥ 48dp.
- [ ] **Cuộn:** đường + nền chảy qua mép trên/dưới (không cụt trong khung); HUD dính đè lên nội dung; có dải đầy đủ một world (10 node + cổng) để kiểm tra liền mạch.
- [ ] Toạ độ x node ở mép trên dải này khớp node ở mép dưới dải kế (ghép cuộn liền mạch).
- [ ] Tổng thể thống nhất với design system block jelly nền tảng (không lặp lại lỗi của campaign-map cũ).

---

*Tham chiếu: tokens trong `design/Gravity Jelly Design System/01-tokens/`, component trong `03-components/`. Logic màn & gate: `ui-map-screen.md`, `level-design.md`. Bộ prompt này cố ý bỏ qua bản campaign-map cũ.*
