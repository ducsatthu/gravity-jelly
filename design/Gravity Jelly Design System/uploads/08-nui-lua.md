# Map Prompts — World 8: Núi lửa (màn 71–80)

> **Tiền đề:** đã chạy/ghim `00-shared-index.md` (tokens + bảng world→màn + style block jelly) trong cùng phiên Claude Design. Mỗi prompt dưới tự đủ cho World 8. Chạy lần lượt **Phần 1 → Phần 2 → Chuyển cảnh**.

**Thông số World 8**

- Khoảng màn: **71–80** · breather = màn **76** · boss = màn **80**
- Nền/palette: trời `#E8A37C`→`#43302A`, accent `#F4853F`
- Cảnh: đá tro đen, dòng dung nham cam phát sáng, tàn lửa bay, trời ám đỏ
- Cơ chế mới: Mật độ bàn cao, ít lượt xoay → căng · Mục tiêu chính: Đạt điểm
- Cổng mở sang: **World 9 · Bầu trời** (minh hoạ cần 144★ — số thật theo cấu hình gate, xem `../level-design.md`)

---

## Phần 1 — màn 71–75 (nửa dưới)

```
Dựa trên 00-shared-index (tokens + style block jelly). Vẽ MỘT VIEWPORT của map World 8 "Núi lửa", artboard 360×800dp dọc.
- NỀN biome World 8: trời gradient #E8A37C→#43302A; đá tro đen, dòng dung nham cam phát sáng, tàn lửa bay, trời ám đỏ; accent #F4853F. Chỉ gradient + hình bo tròn phẳng, không ảnh.
- ĐƯỜNG mòn surface #FFFFFF, tim đường chấm bi #EFE0C9, đoạn ĐÃ ĐI tô thêm lớp primary #FF9F68 mảnh. LEO TỪ DƯỚI LÊN. Đường CHẢY QUA mép trên & mép dưới (đây là viewport của map cuộn — KHÔNG cụt trong khung).
- 5 NODE, đánh số ĐÚNG 71, 72, 73, 74, 75 từ đáy lên. Dùng JellyBlock (luân phiên 4 màu jelly) MANG SỐ (#6A4A2E), viền 3dp, gloss đỉnh.
  · Node đã hoàn thành: + vòng cung 3 sao (#FFC23D đạt / xám nhạt chưa). · 1 node HIỆN TẠI: đĩa surface trắng viền primary #FF9F68 + vòng pulse + mascot jelly hồng có mắt + pill primary "Chơi ngay". · Node chưa tới: khối ĐÁ #C9BCA8 viền #A89A82 + ổ khoá trắng. (Phân bổ trạng thái tuỳ tiến độ minh hoạ.)
- HUD DÍNH trên (56dp, surface #FFFFFF, đổ bóng md): nút Back trái · giữa small-caps "THẾ GIỚI 8 · Núi lửa" (#9B886F) + tên (Fredoka 20 #5B4636) · phải chip pill ★ tổng. HUD đè lên nội dung cuộn.
Bám đúng tokens & font hệ thống (Fredoka/Nunito). CTA luôn cam #FF9F68, KHÔNG xanh lá.
```

## Phần 2 — màn 76–80 + cổng (nửa trên)

```
Dựa trên 00-shared-index. Vẽ VIEWPORT TIẾP THEO của World 8 "Núi lửa" (nối liền Phần 1), 360×800dp.
- Cùng nền biome World 8; PHÍA TRÊN blend dần sang palette World 9 (#CFE3F7→#EFD6E3) ở đoạn cổng.
- Đường tiếp tục: VÀO từ mép dưới (toạ độ x khớp node trên cùng của Phần 1), RA mép trên.
- 5 NODE số ĐÚNG: 76 = BREATHER (JellyBlock nhỏ hơn, tông nhạt, tag "Nghỉ" xám); 77, 78, 79 = thường; 80 = BOSS (to ~1.2×, hào quang accent GRAVITY tím #7E6CF0, tag "BOSS" tím). Tất cả JellyBlock có số, viền 3dp, gloss; trạng thái (sao/hiện tại/khoá) tuỳ tiến độ.
- TRÊN boss 80: CỔNG WORLD sang World 9 "Bầu trời" — banner pill surface #FFFFFF, đổ bóng md: huy hiệu tròn (success #6FCF7F + check nếu ĐỦ sao / surface chìm + ổ khoá nếu THIẾU) + small-caps "THẾ GIỚI 9" + "Bầu trời" (Fredoka 16) + chip ★ 144. Vẽ ví dụ trạng thái ĐỦ SAO (mở).
- HUD DÍNH như Phần 1.
Bám tokens hệ thống.
```

## Chuyển cảnh — sang World 9 · Bầu trời

```
Dựa trên 00-shared-index. Vẽ 1 KHUNG cutscene "vừa qua cổng World 8 → World 9", 360×800dp.
- Nửa DƯỚI: cảnh World 8 Núi lửa đang trôi đi (hơi mờ chuyển động).
- Nửa TRÊN: cảnh World 9 Bầu trời hiện lên (trời #CFE3F7→#EFD6E3; biển mây trắng, đảo mây, cầu vồng nhạt, bong bóng pastel).
- GIỮA: banner bo 28 surface #FFFFFF "THẾ GIỚI 9 — BẦU TRỜI" (Fredoka 22 #5B4636) + confetti/lấp lánh + một mascot jelly có mắt vẫy tay.
Cao trào, festive, đúng palette & font hệ thống.
```

---

**Nghiệm thu nhanh:** số node đúng 71–80 · breather ở 76 · boss ở 80 · đường chảy qua 2 mép (khớp cuộn) · màu/font đúng hệ thống · node = JellyBlock có mắt · CTA cam.

➡️ Tiếp theo: World 9 (`09-bau-troi.md`)
