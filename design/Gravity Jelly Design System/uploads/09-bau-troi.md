# Map Prompts — World 9: Bầu trời (màn 81–90)

> **Tiền đề:** đã chạy/ghim `00-shared-index.md` (tokens + bảng world→màn + style block jelly) trong cùng phiên Claude Design. Mỗi prompt dưới tự đủ cho World 9. Chạy lần lượt **Phần 1 → Phần 2 → Chuyển cảnh**.

**Thông số World 9**

- Khoảng màn: **81–90** · breather = màn **86** · boss = màn **90**
- Nền/palette: trời `#CFE3F7`→`#EFD6E3`, accent `#FBE9B0`
- Cảnh: biển mây trắng, đảo mây, cầu vồng nhạt, bong bóng pastel
- Cơ chế mới: Tổng hợp mọi cơ chế (đá + ô đích + điểm) · Mục tiêu chính: Hỗn hợp
- Cổng mở sang: **World 10 · Vũ trụ** (minh hoạ cần 162★ — số thật theo cấu hình gate, xem `../level-design.md`)

---

## Phần 1 — màn 81–85 (nửa dưới)

```
Dựa trên 00-shared-index (tokens + style block jelly). Vẽ MỘT VIEWPORT của map World 9 "Bầu trời", artboard 360×800dp dọc.
- NỀN biome World 9: trời gradient #CFE3F7→#EFD6E3; biển mây trắng, đảo mây, cầu vồng nhạt, bong bóng pastel; accent #FBE9B0. Chỉ gradient + hình bo tròn phẳng, không ảnh.
- ĐƯỜNG mòn surface #FFFFFF, tim đường chấm bi #EFE0C9, đoạn ĐÃ ĐI tô thêm lớp primary #FF9F68 mảnh. LEO TỪ DƯỚI LÊN. Đường CHẢY QUA mép trên & mép dưới (đây là viewport của map cuộn — KHÔNG cụt trong khung).
- 5 NODE, đánh số ĐÚNG 81, 82, 83, 84, 85 từ đáy lên. Dùng JellyBlock (luân phiên 4 màu jelly) MANG SỐ (#6A4A2E), viền 3dp, gloss đỉnh.
  · Node đã hoàn thành: + vòng cung 3 sao (#FFC23D đạt / xám nhạt chưa). · 1 node HIỆN TẠI: đĩa surface trắng viền primary #FF9F68 + vòng pulse + mascot jelly hồng có mắt + pill primary "Chơi ngay". · Node chưa tới: khối ĐÁ #C9BCA8 viền #A89A82 + ổ khoá trắng. (Phân bổ trạng thái tuỳ tiến độ minh hoạ.)
- HUD DÍNH trên (56dp, surface #FFFFFF, đổ bóng md): nút Back trái · giữa small-caps "THẾ GIỚI 9 · Bầu trời" (#9B886F) + tên (Fredoka 20 #5B4636) · phải chip pill ★ tổng. HUD đè lên nội dung cuộn.
Bám đúng tokens & font hệ thống (Fredoka/Nunito). CTA luôn cam #FF9F68, KHÔNG xanh lá.
```

## Phần 2 — màn 86–90 + cổng (nửa trên)

```
Dựa trên 00-shared-index. Vẽ VIEWPORT TIẾP THEO của World 9 "Bầu trời" (nối liền Phần 1), 360×800dp.
- Cùng nền biome World 9; PHÍA TRÊN blend dần sang palette World 10 (#3D3070→#221A42) ở đoạn cổng.
- Đường tiếp tục: VÀO từ mép dưới (toạ độ x khớp node trên cùng của Phần 1), RA mép trên.
- 5 NODE số ĐÚNG: 86 = BREATHER (JellyBlock nhỏ hơn, tông nhạt, tag "Nghỉ" xám); 87, 88, 89 = thường; 90 = BOSS (to ~1.2×, hào quang accent GRAVITY tím #7E6CF0, tag "BOSS" tím). Tất cả JellyBlock có số, viền 3dp, gloss; trạng thái (sao/hiện tại/khoá) tuỳ tiến độ.
- TRÊN boss 90: CỔNG WORLD sang World 10 "Vũ trụ" — banner pill surface #FFFFFF, đổ bóng md: huy hiệu tròn (success #6FCF7F + check nếu ĐỦ sao / surface chìm + ổ khoá nếu THIẾU) + small-caps "THẾ GIỚI 10" + "Vũ trụ" (Fredoka 16) + chip ★ 162. Vẽ ví dụ trạng thái ĐỦ SAO (mở).
- HUD DÍNH như Phần 1.
Bám tokens hệ thống.
```

## Chuyển cảnh — sang World 10 · Vũ trụ

```
Dựa trên 00-shared-index. Vẽ 1 KHUNG cutscene "vừa qua cổng World 9 → World 10", 360×800dp.
- Nửa DƯỚI: cảnh World 9 Bầu trời đang trôi đi (hơi mờ chuyển động).
- Nửa TRÊN: cảnh World 10 Vũ trụ hiện lên (trời #3D3070→#221A42; nền tím sâu, sao neon, hành tinh nhỏ, thiên thạch, ánh neon cyan/hồng).
- GIỮA: banner bo 28 surface #FFFFFF "THẾ GIỚI 10 — VŨ TRỤ" (Fredoka 22 #5B4636) + confetti/lấp lánh + một mascot jelly có mắt vẫy tay.
Cao trào, festive, đúng palette & font hệ thống.
```

---

**Nghiệm thu nhanh:** số node đúng 81–90 · breather ở 86 · boss ở 90 · đường chảy qua 2 mép (khớp cuộn) · màu/font đúng hệ thống · node = JellyBlock có mắt · CTA cam.

➡️ Tiếp theo: World 10 (`10-vu-tru.md`)
