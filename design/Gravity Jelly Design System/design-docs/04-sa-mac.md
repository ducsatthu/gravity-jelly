# Map Prompts — World 4: Sa mạc (màn 31–40)

> **Tiền đề:** đã chạy/ghim `00-shared-index.md` (tokens + bảng world→màn + style block jelly) trong cùng phiên Claude Design. Mỗi prompt dưới tự đủ cho World 4. Chạy lần lượt **Phần 1 → Phần 2 → Chuyển cảnh**.

**Thông số World 4**

- Khoảng màn: **31–40** · breather = màn **36** · boss = màn **40**
- Nền/palette: trời `#FBEBCB`→`#F4D69D`, accent `#C9A36E`
- Cảnh: đụn cát vàng, xương rồng, đá tảng, vài cây cọ khô
- Cơ chế mới: Đá cố định làm chướng ngại · Mục tiêu chính: Clear ô đích
- Cổng mở sang: **World 5 · Bãi biển** (minh hoạ cần 72★ — số thật theo cấu hình gate, xem `../level-design.md`)

---

## Phần 1 — màn 31–35 (nửa dưới)

```
Dựa trên 00-shared-index (tokens + style block jelly). Vẽ MỘT VIEWPORT của map World 4 "Sa mạc", artboard 360×800dp dọc.
- NỀN biome World 4: trời gradient #FBEBCB→#F4D69D; đụn cát vàng, xương rồng, đá tảng, vài cây cọ khô; accent #C9A36E. Chỉ gradient + hình bo tròn phẳng, không ảnh.
- ĐƯỜNG mòn surface #FFFFFF, tim đường chấm bi #EFE0C9, đoạn ĐÃ ĐI tô thêm lớp primary #FF9F68 mảnh. LEO TỪ DƯỚI LÊN. Đường CHẢY QUA mép trên & mép dưới (đây là viewport của map cuộn — KHÔNG cụt trong khung).
- 5 NODE, đánh số ĐÚNG 31, 32, 33, 34, 35 từ đáy lên. Dùng JellyBlock (luân phiên 4 màu jelly) MANG SỐ (#6A4A2E), viền 3dp, gloss đỉnh.
  · Node đã hoàn thành: + vòng cung 3 sao (#FFC23D đạt / xám nhạt chưa). · 1 node HIỆN TẠI: đĩa surface trắng viền primary #FF9F68 + vòng pulse + mascot jelly hồng có mắt + pill primary "Chơi ngay". · Node chưa tới: khối ĐÁ #C9BCA8 viền #A89A82 + ổ khoá trắng. (Phân bổ trạng thái tuỳ tiến độ minh hoạ.)
- HUD DÍNH trên (56dp, surface #FFFFFF, đổ bóng md): nút Back trái · giữa small-caps "THẾ GIỚI 4 · Sa mạc" (#9B886F) + tên (Fredoka 20 #5B4636) · phải chip pill ★ tổng. HUD đè lên nội dung cuộn.
Bám đúng tokens & font hệ thống (Fredoka/Nunito). CTA luôn cam #FF9F68, KHÔNG xanh lá.
```

## Phần 2 — màn 36–40 + cổng (nửa trên)

```
Dựa trên 00-shared-index. Vẽ VIEWPORT TIẾP THEO của World 4 "Sa mạc" (nối liền Phần 1), 360×800dp.
- Cùng nền biome World 4; PHÍA TRÊN blend dần sang palette World 5 (#D7F0EC→#BCE6DE) ở đoạn cổng.
- Đường tiếp tục: VÀO từ mép dưới (toạ độ x khớp node trên cùng của Phần 1), RA mép trên.
- 5 NODE số ĐÚNG: 36 = BREATHER (JellyBlock nhỏ hơn, tông nhạt, tag "Nghỉ" xám); 37, 38, 39 = thường; 40 = BOSS (to ~1.2×, hào quang accent GRAVITY tím #7E6CF0, tag "BOSS" tím). Tất cả JellyBlock có số, viền 3dp, gloss; trạng thái (sao/hiện tại/khoá) tuỳ tiến độ.
- TRÊN boss 40: CỔNG WORLD sang World 5 "Bãi biển" — banner pill surface #FFFFFF, đổ bóng md: huy hiệu tròn (success #6FCF7F + check nếu ĐỦ sao / surface chìm + ổ khoá nếu THIẾU) + small-caps "THẾ GIỚI 5" + "Bãi biển" (Fredoka 16) + chip ★ 72. Vẽ ví dụ trạng thái ĐỦ SAO (mở).
- HUD DÍNH như Phần 1.
Bám tokens hệ thống.
```

## Chuyển cảnh — sang World 5 · Bãi biển

```
Dựa trên 00-shared-index. Vẽ 1 KHUNG cutscene "vừa qua cổng World 4 → World 5", 360×800dp.
- Nửa DƯỚI: cảnh World 4 Sa mạc đang trôi đi (hơi mờ chuyển động).
- Nửa TRÊN: cảnh World 5 Bãi biển hiện lên (trời #D7F0EC→#BCE6DE; biển xanh ngọc, sóng bọt trắng, cát sáng, dừa, sao biển).
- GIỮA: banner bo 28 surface #FFFFFF "THẾ GIỚI 5 — BÃI BIỂN" (Fredoka 22 #5B4636) + confetti/lấp lánh + một mascot jelly có mắt vẫy tay.
Cao trào, festive, đúng palette & font hệ thống.
```

---

**Nghiệm thu nhanh:** số node đúng 31–40 · breather ở 36 · boss ở 40 · đường chảy qua 2 mép (khớp cuộn) · màu/font đúng hệ thống · node = JellyBlock có mắt · CTA cam.

➡️ Tiếp theo: World 5 (`05-bai-bien.md`)
