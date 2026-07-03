# Map Prompts — World 6: Núi tuyết (màn 51–60)

> **Tiền đề:** đã chạy/ghim `00-shared-index.md` (tokens + bảng world→màn + style block jelly) trong cùng phiên Claude Design. Mỗi prompt dưới tự đủ cho World 6. Chạy lần lượt **Phần 1 → Phần 2 → Chuyển cảnh**.

**Thông số World 6**

- Khoảng màn: **51–60** · breather = màn **56** · boss = màn **60**
- Nền/palette: trời `#E8F1F8`→`#CFE0EE`, accent `#9DB8D4`
- Cảnh: đồi tuyết trắng xanh, thông phủ tuyết, bông tuyết rơi
- Cơ chế mới: Quản lý ngân sách xoay (xoay 2–3 lần đúng nhịp) · Mục tiêu chính: Dọn sạch
- Cổng mở sang: **World 7 · Hang băng** (minh hoạ cần 108★ — số thật theo cấu hình gate, xem `../level-design.md`)

---

## Phần 1 — màn 51–55 (nửa dưới)

```
Dựa trên 00-shared-index (tokens + style block jelly). Vẽ MỘT VIEWPORT của map World 6 "Núi tuyết", artboard 360×800dp dọc.
- NỀN biome World 6: trời gradient #E8F1F8→#CFE0EE; đồi tuyết trắng xanh, thông phủ tuyết, bông tuyết rơi; accent #9DB8D4. Chỉ gradient + hình bo tròn phẳng, không ảnh.
- ĐƯỜNG mòn surface #FFFFFF, tim đường chấm bi #EFE0C9, đoạn ĐÃ ĐI tô thêm lớp primary #FF9F68 mảnh. LEO TỪ DƯỚI LÊN. Đường CHẢY QUA mép trên & mép dưới (đây là viewport của map cuộn — KHÔNG cụt trong khung).
- 5 NODE, đánh số ĐÚNG 51, 52, 53, 54, 55 từ đáy lên. Dùng JellyBlock (luân phiên 4 màu jelly) MANG SỐ (#6A4A2E), viền 3dp, gloss đỉnh.
  · Node đã hoàn thành: + vòng cung 3 sao (#FFC23D đạt / xám nhạt chưa). · 1 node HIỆN TẠI: đĩa surface trắng viền primary #FF9F68 + vòng pulse + mascot jelly hồng có mắt + pill primary "Chơi ngay". · Node chưa tới: khối ĐÁ #C9BCA8 viền #A89A82 + ổ khoá trắng. (Phân bổ trạng thái tuỳ tiến độ minh hoạ.)
- HUD DÍNH trên (56dp, surface #FFFFFF, đổ bóng md): nút Back trái · giữa small-caps "THẾ GIỚI 6 · Núi tuyết" (#9B886F) + tên (Fredoka 20 #5B4636) · phải chip pill ★ tổng. HUD đè lên nội dung cuộn.
Bám đúng tokens & font hệ thống (Fredoka/Nunito). CTA luôn cam #FF9F68, KHÔNG xanh lá.
```

## Phần 2 — màn 56–60 + cổng (nửa trên)

```
Dựa trên 00-shared-index. Vẽ VIEWPORT TIẾP THEO của World 6 "Núi tuyết" (nối liền Phần 1), 360×800dp.
- Cùng nền biome World 6; PHÍA TRÊN blend dần sang palette World 7 (#D2DAF0→#B8ACE3) ở đoạn cổng.
- Đường tiếp tục: VÀO từ mép dưới (toạ độ x khớp node trên cùng của Phần 1), RA mép trên.
- 5 NODE số ĐÚNG: 56 = BREATHER (JellyBlock nhỏ hơn, tông nhạt, tag "Nghỉ" xám); 57, 58, 59 = thường; 60 = BOSS (to ~1.2×, hào quang accent GRAVITY tím #7E6CF0, tag "BOSS" tím). Tất cả JellyBlock có số, viền 3dp, gloss; trạng thái (sao/hiện tại/khoá) tuỳ tiến độ.
- TRÊN boss 60: CỔNG WORLD sang World 7 "Hang băng" — banner pill surface #FFFFFF, đổ bóng md: huy hiệu tròn (success #6FCF7F + check nếu ĐỦ sao / surface chìm + ổ khoá nếu THIẾU) + small-caps "THẾ GIỚI 7" + "Hang băng" (Fredoka 16) + chip ★ 108. Vẽ ví dụ trạng thái ĐỦ SAO (mở).
- HUD DÍNH như Phần 1.
Bám tokens hệ thống.
```

## Chuyển cảnh — sang World 7 · Hang băng

```
Dựa trên 00-shared-index. Vẽ 1 KHUNG cutscene "vừa qua cổng World 6 → World 7", 360×800dp.
- Nửa DƯỚI: cảnh World 6 Núi tuyết đang trôi đi (hơi mờ chuyển động).
- Nửa TRÊN: cảnh World 7 Hang băng hiện lên (trời #D2DAF0→#B8ACE3; nhũ băng, tinh thể pha lê xanh–tím phát sáng, nền hang tối #1E3A4C).
- GIỮA: banner bo 28 surface #FFFFFF "THẾ GIỚI 7 — HANG BĂNG" (Fredoka 22 #5B4636) + confetti/lấp lánh + một mascot jelly có mắt vẫy tay.
Cao trào, festive, đúng palette & font hệ thống.
```

---

**Nghiệm thu nhanh:** số node đúng 51–60 · breather ở 56 · boss ở 60 · đường chảy qua 2 mép (khớp cuộn) · màu/font đúng hệ thống · node = JellyBlock có mắt · CTA cam.

➡️ Tiếp theo: World 7 (`07-hang-bang.md`)
