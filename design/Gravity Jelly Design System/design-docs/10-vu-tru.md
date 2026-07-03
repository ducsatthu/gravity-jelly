# Map Prompts — World 10: Vũ trụ (màn 91–100)

> **Tiền đề:** đã chạy/ghim `00-shared-index.md` (tokens + bảng world→màn + style block jelly) trong cùng phiên Claude Design. Mỗi prompt dưới tự đủ cho World 10. Chạy lần lượt **Phần 1 → Phần 2 → Chuyển cảnh**.

**Thông số World 10**

- Khoảng màn: **91–100** · breather = màn **96** · boss = màn **100**
- Nền/palette: trời `#3D3070`→`#221A42`, accent `#7CE6D6`
- Cảnh: nền tím sâu, sao neon, hành tinh nhỏ, thiên thạch, ánh neon cyan/hồng
- Cơ chế mới: Chuyên gia: ngưỡng sao gắt, gần như không dư nước · Mục tiêu chính: Hỗn hợp
- Hết hành trình: sau boss **màn 100** là màn hình **HẾT CHƯƠNG** (end-of-content), không có cổng tiếp.

---

## Phần 1 — màn 91–95 (nửa dưới)

```
Dựa trên 00-shared-index (tokens + style block jelly). Vẽ MỘT VIEWPORT của map World 10 "Vũ trụ", artboard 360×800dp dọc.
- NỀN biome World 10: trời gradient #3D3070→#221A42; nền tím sâu, sao neon, hành tinh nhỏ, thiên thạch, ánh neon cyan/hồng; accent #7CE6D6. Chỉ gradient + hình bo tròn phẳng, không ảnh.
- ĐƯỜNG mòn surface #FFFFFF, tim đường chấm bi #EFE0C9, đoạn ĐÃ ĐI tô thêm lớp primary #FF9F68 mảnh. LEO TỪ DƯỚI LÊN. Đường CHẢY QUA mép trên & mép dưới (đây là viewport của map cuộn — KHÔNG cụt trong khung).
- 5 NODE, đánh số ĐÚNG 91, 92, 93, 94, 95 từ đáy lên. Dùng JellyBlock (luân phiên 4 màu jelly) MANG SỐ (#6A4A2E), viền 3dp, gloss đỉnh.
  · Node đã hoàn thành: + vòng cung 3 sao (#FFC23D đạt / xám nhạt chưa). · 1 node HIỆN TẠI: đĩa surface trắng viền primary #FF9F68 + vòng pulse + mascot jelly hồng có mắt + pill primary "Chơi ngay". · Node chưa tới: khối ĐÁ #C9BCA8 viền #A89A82 + ổ khoá trắng. (Phân bổ trạng thái tuỳ tiến độ minh hoạ.)
- HUD DÍNH trên (56dp, surface #FFFFFF, đổ bóng md): nút Back trái · giữa small-caps "THẾ GIỚI 10 · Vũ trụ" (#9B886F) + tên (Fredoka 20 #5B4636) · phải chip pill ★ tổng. HUD đè lên nội dung cuộn.
Bám đúng tokens & font hệ thống (Fredoka/Nunito). CTA luôn cam #FF9F68, KHÔNG xanh lá.
```

## Phần 2 — màn 96–100 + kết thúc (nửa trên)

```
Dựa trên 00-shared-index. Vẽ VIEWPORT TIẾP THEO của World 10 "Vũ trụ" (nối liền Phần 1), 360×800dp.
- Nền World 10 Vũ trụ; phía trên là không gian sâu rực rỡ để đặt bảng kết thúc.
- Đường tiếp tục vào từ mép dưới (khớp Phần 1), kết tại boss 100.
- 5 NODE số ĐÚNG: 96 = BREATHER (JellyBlock nhỏ hơn, tông nhạt, tag "Nghỉ" xám); 97, 98, 99 = thường; 100 = BOSS (to ~1.2×, hào quang accent GRAVITY tím #7E6CF0, tag "BOSS" tím). Tất cả JellyBlock có số, viền 3dp, gloss; trạng thái (sao/hiện tại/khoá) tuỳ tiến độ.
- TRÊN boss 100: BẢNG bo 28 surface #FFFFFF nổi giữa các vì sao: "HẾT CHƯƠNG!" (Fredoka 22 #5B4636) + "Nội dung mới sắp ra mắt 🚀" (Nunito) + 2 nút: "Chơi Endless" (Button primary cam) và "Chơi Daily" (Button secondary, pill "SẮP CÓ"). Confetti nhẹ. KHÔNG vẽ node khoá kéo dài.
- HUD DÍNH như Phần 1.
Bám tokens hệ thống.
```

## (World 10 không có chuyển cảnh — kết thúc ở bảng HẾT CHƯƠNG ở Phần 2.)

---

**Nghiệm thu nhanh:** số node đúng 91–100 · breather ở 96 · boss ở 100 · đường chảy qua 2 mép (khớp cuộn) · màu/font đúng hệ thống · node = JellyBlock có mắt · CTA cam.

➡️ Tiếp theo: Xong 100 màn — quay lại các mẫu trạng thái nếu cần (xem 00-shared-index).
