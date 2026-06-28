# Map Prompts — World 7: Hang băng (màn 61–70)

> **Tiền đề:** đã chạy/ghim `00-shared-index.md` (tokens + bảng world→màn + style block jelly) trong cùng phiên Claude Design. Mỗi prompt dưới tự đủ cho World 7. Chạy lần lượt **Phần 1 → Phần 2 → Chuyển cảnh**.

**Thông số World 7**

- Khoảng màn: **61–70** · breather = màn **66** · boss = màn **70**
- Nền/palette: trời `#D2DAF0`→`#B8ACE3`, accent `#7CE6E0`
- Cảnh: nhũ băng, tinh thể pha lê xanh–tím phát sáng, nền hang tối #1E3A4C
- Cơ chế mới: Nhiều đá + cụm khởi đầu to · Mục tiêu chính: Clear ô đích
- Cổng mở sang: **World 8 · Núi lửa** (minh hoạ cần 126★ — số thật theo cấu hình gate, xem `../level-design.md`)

---

## Phần 1 — màn 61–65 (nửa dưới)

```
Dựa trên 00-shared-index (tokens + style block jelly). Vẽ MỘT VIEWPORT của map World 7 "Hang băng", artboard 360×800dp dọc.
- NỀN biome World 7: trời gradient #D2DAF0→#B8ACE3; nhũ băng, tinh thể pha lê xanh–tím phát sáng, nền hang tối #1E3A4C; accent #7CE6E0. Chỉ gradient + hình bo tròn phẳng, không ảnh.
- ĐƯỜNG mòn surface #FFFFFF, tim đường chấm bi #EFE0C9, đoạn ĐÃ ĐI tô thêm lớp primary #FF9F68 mảnh. LEO TỪ DƯỚI LÊN. Đường CHẢY QUA mép trên & mép dưới (đây là viewport của map cuộn — KHÔNG cụt trong khung).
- 5 NODE, đánh số ĐÚNG 61, 62, 63, 64, 65 từ đáy lên. Dùng JellyBlock (luân phiên 4 màu jelly) MANG SỐ (#6A4A2E), viền 3dp, gloss đỉnh.
  · Node đã hoàn thành: + vòng cung 3 sao (#FFC23D đạt / xám nhạt chưa). · 1 node HIỆN TẠI: đĩa surface trắng viền primary #FF9F68 + vòng pulse + mascot jelly hồng có mắt + pill primary "Chơi ngay". · Node chưa tới: khối ĐÁ #C9BCA8 viền #A89A82 + ổ khoá trắng. (Phân bổ trạng thái tuỳ tiến độ minh hoạ.)
- HUD DÍNH trên (56dp, surface #FFFFFF, đổ bóng md): nút Back trái · giữa small-caps "THẾ GIỚI 7 · Hang băng" (#9B886F) + tên (Fredoka 20 #5B4636) · phải chip pill ★ tổng. HUD đè lên nội dung cuộn.
Bám đúng tokens & font hệ thống (Fredoka/Nunito). CTA luôn cam #FF9F68, KHÔNG xanh lá.
```

## Phần 2 — màn 66–70 + cổng (nửa trên)

```
Dựa trên 00-shared-index. Vẽ VIEWPORT TIẾP THEO của World 7 "Hang băng" (nối liền Phần 1), 360×800dp.
- Cùng nền biome World 7; PHÍA TRÊN blend dần sang palette World 8 (#E8A37C→#43302A) ở đoạn cổng.
- Đường tiếp tục: VÀO từ mép dưới (toạ độ x khớp node trên cùng của Phần 1), RA mép trên.
- 5 NODE số ĐÚNG: 66 = BREATHER (JellyBlock nhỏ hơn, tông nhạt, tag "Nghỉ" xám); 67, 68, 69 = thường; 70 = BOSS (to ~1.2×, hào quang accent GRAVITY tím #7E6CF0, tag "BOSS" tím). Tất cả JellyBlock có số, viền 3dp, gloss; trạng thái (sao/hiện tại/khoá) tuỳ tiến độ.
- TRÊN boss 70: CỔNG WORLD sang World 8 "Núi lửa" — banner pill surface #FFFFFF, đổ bóng md: huy hiệu tròn (success #6FCF7F + check nếu ĐỦ sao / surface chìm + ổ khoá nếu THIẾU) + small-caps "THẾ GIỚI 8" + "Núi lửa" (Fredoka 16) + chip ★ 126. Vẽ ví dụ trạng thái ĐỦ SAO (mở).
- HUD DÍNH như Phần 1.
Bám tokens hệ thống.
```

## Chuyển cảnh — sang World 8 · Núi lửa

```
Dựa trên 00-shared-index. Vẽ 1 KHUNG cutscene "vừa qua cổng World 7 → World 8", 360×800dp.
- Nửa DƯỚI: cảnh World 7 Hang băng đang trôi đi (hơi mờ chuyển động).
- Nửa TRÊN: cảnh World 8 Núi lửa hiện lên (trời #E8A37C→#43302A; đá tro đen, dòng dung nham cam phát sáng, tàn lửa bay, trời ám đỏ).
- GIỮA: banner bo 28 surface #FFFFFF "THẾ GIỚI 8 — NÚI LỬA" (Fredoka 22 #5B4636) + confetti/lấp lánh + một mascot jelly có mắt vẫy tay.
Cao trào, festive, đúng palette & font hệ thống.
```

---

**Nghiệm thu nhanh:** số node đúng 61–70 · breather ở 66 · boss ở 70 · đường chảy qua 2 mép (khớp cuộn) · màu/font đúng hệ thống · node = JellyBlock có mắt · CTA cam.

➡️ Tiếp theo: World 8 (`08-nui-lua.md`)
