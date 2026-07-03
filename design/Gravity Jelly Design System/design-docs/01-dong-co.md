# Map Prompts — World 1: Đồng cỏ (màn 1–10)

> **Tiền đề:** đã chạy/ghim `00-shared-index.md` (tokens + bảng world→màn + style block jelly) trong cùng phiên Claude Design. Mỗi prompt dưới tự đủ cho World 1. Chạy lần lượt **Phần 1 → Phần 2 → Chuyển cảnh**.

**Thông số World 1**

- Khoảng màn: **1–10** · breather = màn **6** · boss = màn **10**
- Nền/palette: trời `#DEF0E1`→`#C6E8C9`, accent `#F6D86B`
- Cảnh: đồi tròn xanh xếp lớp, cây tán tròn, bụi cỏ, hoa cúc trắng–vàng ở hai mép đường
- Cơ chế mới: Đặt mảnh + xóa hàng/cột (dạy cơ bản) · Mục tiêu chính: Dọn sạch
- Cổng mở sang: **World 2 · Rừng rậm** (minh hoạ cần 18★ — số thật theo cấu hình gate, xem `../level-design.md`)

---

## Phần 1 — màn 1–5 (nửa dưới)

```
Dựa trên 00-shared-index (tokens + style block jelly). Vẽ MỘT VIEWPORT của map World 1 "Đồng cỏ", artboard 360×800dp dọc.
- NỀN biome World 1: trời gradient #DEF0E1→#C6E8C9; đồi tròn xanh xếp lớp, cây tán tròn, bụi cỏ, hoa cúc trắng–vàng ở hai mép đường; accent #F6D86B. Chỉ gradient + hình bo tròn phẳng, không ảnh.
- ĐƯỜNG mòn surface #FFFFFF, tim đường chấm bi #EFE0C9, đoạn ĐÃ ĐI tô thêm lớp primary #FF9F68 mảnh. LEO TỪ DƯỚI LÊN. Đường CHẢY QUA mép trên & mép dưới (đây là viewport của map cuộn — KHÔNG cụt trong khung).
- 5 NODE, đánh số ĐÚNG 1, 2, 3, 4, 5 từ đáy lên. Dùng JellyBlock (luân phiên 4 màu jelly) MANG SỐ (#6A4A2E), viền 3dp, gloss đỉnh.
  · Node đã hoàn thành: + vòng cung 3 sao (#FFC23D đạt / xám nhạt chưa). · 1 node HIỆN TẠI: đĩa surface trắng viền primary #FF9F68 + vòng pulse + mascot jelly hồng có mắt + pill primary "Chơi ngay". · Node chưa tới: khối ĐÁ #C9BCA8 viền #A89A82 + ổ khoá trắng. (Phân bổ trạng thái tuỳ tiến độ minh hoạ.)
- HUD DÍNH trên (56dp, surface #FFFFFF, đổ bóng md): nút Back trái · giữa small-caps "THẾ GIỚI 1 · Đồng cỏ" (#9B886F) + tên (Fredoka 20 #5B4636) · phải chip pill ★ tổng. HUD đè lên nội dung cuộn.
Bám đúng tokens & font hệ thống (Fredoka/Nunito). CTA luôn cam #FF9F68, KHÔNG xanh lá.
```

## Phần 2 — màn 6–10 + cổng (nửa trên)

```
Dựa trên 00-shared-index. Vẽ VIEWPORT TIẾP THEO của World 1 "Đồng cỏ" (nối liền Phần 1), 360×800dp.
- Cùng nền biome World 1; PHÍA TRÊN blend dần sang palette World 2 (#CFE6CE→#B2D3AC) ở đoạn cổng.
- Đường tiếp tục: VÀO từ mép dưới (toạ độ x khớp node trên cùng của Phần 1), RA mép trên.
- 5 NODE số ĐÚNG: 6 = BREATHER (JellyBlock nhỏ hơn, tông nhạt, tag "Nghỉ" xám); 7, 8, 9 = thường; 10 = BOSS (to ~1.2×, hào quang accent GRAVITY tím #7E6CF0, tag "BOSS" tím). Tất cả JellyBlock có số, viền 3dp, gloss; trạng thái (sao/hiện tại/khoá) tuỳ tiến độ.
- TRÊN boss 10: CỔNG WORLD sang World 2 "Rừng rậm" — banner pill surface #FFFFFF, đổ bóng md: huy hiệu tròn (success #6FCF7F + check nếu ĐỦ sao / surface chìm + ổ khoá nếu THIẾU) + small-caps "THẾ GIỚI 2" + "Rừng rậm" (Fredoka 16) + chip ★ 18. Vẽ ví dụ trạng thái ĐỦ SAO (mở).
- HUD DÍNH như Phần 1.
Bám tokens hệ thống.
```

## Chuyển cảnh — sang World 2 · Rừng rậm

```
Dựa trên 00-shared-index. Vẽ 1 KHUNG cutscene "vừa qua cổng World 1 → World 2", 360×800dp.
- Nửa DƯỚI: cảnh World 1 Đồng cỏ đang trôi đi (hơi mờ chuyển động).
- Nửa TRÊN: cảnh World 2 Rừng rậm hiện lên (trời #CFE6CE→#B2D3AC; rừng thông và cây tán tròn dày, thân nâu #6D4C32, dương xỉ, sương mờ).
- GIỮA: banner bo 28 surface #FFFFFF "THẾ GIỚI 2 — RỪNG RẬM" (Fredoka 22 #5B4636) + confetti/lấp lánh + một mascot jelly có mắt vẫy tay.
Cao trào, festive, đúng palette & font hệ thống.
```

---

**Nghiệm thu nhanh:** số node đúng 1–10 · breather ở 6 · boss ở 10 · đường chảy qua 2 mép (khớp cuộn) · màu/font đúng hệ thống · node = JellyBlock có mắt · CTA cam.

➡️ Tiếp theo: World 2 (`02-rung-ram.md`)
