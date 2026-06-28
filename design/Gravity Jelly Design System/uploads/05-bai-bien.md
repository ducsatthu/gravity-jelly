# Map Prompts — World 5: Bãi biển (màn 41–50)

> **Tiền đề:** đã chạy/ghim `00-shared-index.md` (tokens + bảng world→màn + style block jelly) trong cùng phiên Claude Design. Mỗi prompt dưới tự đủ cho World 5. Chạy lần lượt **Phần 1 → Phần 2 → Chuyển cảnh**.

**Thông số World 5**

- Khoảng màn: **41–50** · breather = màn **46** · boss = màn **50**
- Nền/palette: trời `#D7F0EC`→`#BCE6DE`, accent `#EFE0BE`
- Cảnh: biển xanh ngọc, sóng bọt trắng, cát sáng, dừa, sao biển
- Cơ chế mới: Mục tiêu điểm số trong số nước giới hạn · Mục tiêu chính: Đạt điểm
- Cổng mở sang: **World 6 · Núi tuyết** (minh hoạ cần 90★ — số thật theo cấu hình gate, xem `../level-design.md`)

---

## Phần 1 — màn 41–45 (nửa dưới)

```
Dựa trên 00-shared-index (tokens + style block jelly). Vẽ MỘT VIEWPORT của map World 5 "Bãi biển", artboard 360×800dp dọc.
- NỀN biome World 5: trời gradient #D7F0EC→#BCE6DE; biển xanh ngọc, sóng bọt trắng, cát sáng, dừa, sao biển; accent #EFE0BE. Chỉ gradient + hình bo tròn phẳng, không ảnh.
- ĐƯỜNG mòn surface #FFFFFF, tim đường chấm bi #EFE0C9, đoạn ĐÃ ĐI tô thêm lớp primary #FF9F68 mảnh. LEO TỪ DƯỚI LÊN. Đường CHẢY QUA mép trên & mép dưới (đây là viewport của map cuộn — KHÔNG cụt trong khung).
- 5 NODE, đánh số ĐÚNG 41, 42, 43, 44, 45 từ đáy lên. Dùng JellyBlock (luân phiên 4 màu jelly) MANG SỐ (#6A4A2E), viền 3dp, gloss đỉnh.
  · Node đã hoàn thành: + vòng cung 3 sao (#FFC23D đạt / xám nhạt chưa). · 1 node HIỆN TẠI: đĩa surface trắng viền primary #FF9F68 + vòng pulse + mascot jelly hồng có mắt + pill primary "Chơi ngay". · Node chưa tới: khối ĐÁ #C9BCA8 viền #A89A82 + ổ khoá trắng. (Phân bổ trạng thái tuỳ tiến độ minh hoạ.)
- HUD DÍNH trên (56dp, surface #FFFFFF, đổ bóng md): nút Back trái · giữa small-caps "THẾ GIỚI 5 · Bãi biển" (#9B886F) + tên (Fredoka 20 #5B4636) · phải chip pill ★ tổng. HUD đè lên nội dung cuộn.
Bám đúng tokens & font hệ thống (Fredoka/Nunito). CTA luôn cam #FF9F68, KHÔNG xanh lá.
```

## Phần 2 — màn 46–50 + cổng (nửa trên)

```
Dựa trên 00-shared-index. Vẽ VIEWPORT TIẾP THEO của World 5 "Bãi biển" (nối liền Phần 1), 360×800dp.
- Cùng nền biome World 5; PHÍA TRÊN blend dần sang palette World 6 (#E8F1F8→#CFE0EE) ở đoạn cổng.
- Đường tiếp tục: VÀO từ mép dưới (toạ độ x khớp node trên cùng của Phần 1), RA mép trên.
- 5 NODE số ĐÚNG: 46 = BREATHER (JellyBlock nhỏ hơn, tông nhạt, tag "Nghỉ" xám); 47, 48, 49 = thường; 50 = BOSS (to ~1.2×, hào quang accent GRAVITY tím #7E6CF0, tag "BOSS" tím). Tất cả JellyBlock có số, viền 3dp, gloss; trạng thái (sao/hiện tại/khoá) tuỳ tiến độ.
- TRÊN boss 50: CỔNG WORLD sang World 6 "Núi tuyết" — banner pill surface #FFFFFF, đổ bóng md: huy hiệu tròn (success #6FCF7F + check nếu ĐỦ sao / surface chìm + ổ khoá nếu THIẾU) + small-caps "THẾ GIỚI 6" + "Núi tuyết" (Fredoka 16) + chip ★ 90. Vẽ ví dụ trạng thái ĐỦ SAO (mở).
- HUD DÍNH như Phần 1.
Bám tokens hệ thống.
```

## Chuyển cảnh — sang World 6 · Núi tuyết

```
Dựa trên 00-shared-index. Vẽ 1 KHUNG cutscene "vừa qua cổng World 5 → World 6", 360×800dp.
- Nửa DƯỚI: cảnh World 5 Bãi biển đang trôi đi (hơi mờ chuyển động).
- Nửa TRÊN: cảnh World 6 Núi tuyết hiện lên (trời #E8F1F8→#CFE0EE; đồi tuyết trắng xanh, thông phủ tuyết, bông tuyết rơi).
- GIỮA: banner bo 28 surface #FFFFFF "THẾ GIỚI 6 — NÚI TUYẾT" (Fredoka 22 #5B4636) + confetti/lấp lánh + một mascot jelly có mắt vẫy tay.
Cao trào, festive, đúng palette & font hệ thống.
```

---

**Nghiệm thu nhanh:** số node đúng 41–50 · breather ở 46 · boss ở 50 · đường chảy qua 2 mép (khớp cuộn) · màu/font đúng hệ thống · node = JellyBlock có mắt · CTA cam.

➡️ Tiếp theo: World 6 (`06-nui-tuyet.md`)
