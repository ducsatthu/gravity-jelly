# 00 — Index & Prompt trạng thái dùng lại

> **Quan trọng:** Claude Design **chỉ nhận đoạn prompt dạng text** — KHÔNG upload file, KHÔNG đọc được file khác. Vì vậy **mỗi prompt ở đây và trong các file world đều TỰ ĐỦ**: đã nhúng sẵn dòng STYLE. Cứ **copy nguyên khối ``` → dán thẳng** là chạy được, không phụ thuộc file nào.

File này gồm: (A) khối STYLE để bạn biết nội dung chung, (B) các prompt **trạng thái dùng lại** (đã nhúng STYLE, làm 1 lần, áp mọi world). Map theo từng world nằm ở `01-…` → `10-…`.

---

## A. Khối STYLE (đã nhúng sẵn trong mọi prompt — chỉ để tham khảo)

```
STYLE (Gravity Jelly — bám mọi prompt): game puzzle casual, phong cách "block jelly" — khối jelly bo tròn CÓ MẮT, viền dày 3dp, gloss đỉnh, kẹo ngọt, soft shadow nâu nhạt. Thiết bị Android dọc 360×800dp, gutter 16, touch ≥48. Font: Fredoka (số/tiêu đề) + Nunito (body). Màu: nền #FFF7EC, surface #FFFFFF, surface-chìm #F4E9D8; node tô LUÂN PHIÊN 4 màu jelly vàng #FFE3A3 / mint #A3E5D9 / hồng #F7A9C0 / xanh #B3C7F7 (viền sậm hơn, có số #6A4A2E); đá (node khoá) #C9BCA8 viền #A89A82; chữ #5B4636 / mờ #9B886F; CTA luôn CAM #FF9F68 (không xanh lá); accent gravity TÍM #7E6CF0 cho boss; sao #FFC23D. Bo nút28/thẻ20/ô12, viền jelly 3dp + gloss. Map CUỘN DỌC, leo từ dưới lên; mỗi artboard là MỘT VIEWPORT — đường & nền CHẢY QUA mép trên–dưới (không cụt); HUD DÍNH đè lên nội dung.
```

Bảng world→màn (để bạn tra, không cần dán): W1 1–10 · W2 11–20 · W3 21–30 · W4 31–40 · W5 41–50 · W6 51–60 · W7 61–70 · W8 71–80 · W9 81–90 · W10 91–100. Boss = 10,20,…,100; breather = 6,16,…,96.

---

## B. Prompt trạng thái DÙNG LẠI (mỗi khối tự đủ — copy nguyên khối)

### B1. Style sheet các trạng thái NODE
```
STYLE (Gravity Jelly): khối jelly bo tròn CÓ MẮT, viền 3dp, gloss, kẹo ngọt; nền #FFF7EC, surface #FFFFFF; 4 màu jelly vàng #FFE3A3 / mint #A3E5D9 / hồng #F7A9C0 / xanh #B3C7F7; đá #C9BCA8 viền #A89A82; chữ #5B4636 / trên-khối #6A4A2E; CTA cam #FF9F68; gravity tím #7E6CF0; sao #FFC23D; Fredoka (số) + Nunito (body).

Vẽ BẢNG COMPONENT các biến thể NODE map trên nền kem #FFF7EC, nhãn Nunito dưới mỗi mẫu:
1) Hoàn thành 3 sao — JellyBlock màu + số, 3 sao #FFC23D đầy.
2) Hoàn thành 2 sao — sao 3 xám nhạt.
3) Hoàn thành 1 sao.
4) Hiện tại — đĩa surface trắng viền primary #FF9F68 + vòng pulse + mascot jelly hồng có mắt + pill "Chơi ngay".
5) Khoá — khối đá #C9BCA8 viền #A89A82 + ổ khoá trắng.
6) Breather — JellyBlock nhỏ hơn, nhạt + tag "Nghỉ" xám.
7) Boss — JellyBlock to 1.2× + hào quang gravity tím #7E6CF0 + tag "BOSS".
Viền 3dp, gloss đỉnh, đổ bóng mềm. 2 hàng, cách đều.
```

### B2. HUD trên (component)
```
STYLE (Gravity Jelly): nền #FFF7EC, surface #FFFFFF; chữ #5B4636 / mờ #9B886F; CTA cam #FF9F68; sao #FFC23D; Fredoka (số/tiêu đề) + Nunito (body); thiết bị 360dp ngang.

Vẽ COMPONENT HUD map, full 360dp, cao 56dp, surface #FFFFFF, đổ bóng mềm, bo dưới 20.
- Trái: nút icon Back 48dp (secondary, bo 12).
- Giữa: small-caps "THẾ GIỚI 1 · HÀNH TRÌNH" (#9B886F 10, letter-spacing 0.04em) + "Đồng cỏ" (Fredoka 20 #5B4636).
- Phải: chip pill ★ tổng (sao #FFC23D + số Fredoka 16).
- Hàng dưới: thanh tiến độ bo full (nền #F4E9D8, phần đạt gradient #FFCA66→#FF9F68) + caption "Còn N★ để mở [world kế]".
Vẽ trên 2 nền (Đồng cỏ sáng & Vũ trụ tối) để chứng minh tương phản chữ.
```

### B3. Cổng world — KHOÁ (thiếu sao)
```
STYLE (Gravity Jelly): surface #FFFFFF, surface-chìm #F4E9D8; warning #FFCA66; CTA cam #FF9F68; sao #FFC23D; chữ #5B4636 / mờ #9B886F; Fredoka + Nunito; thẻ bo 20, pill full, soft shadow.

Vẽ COMPONENT banner CỔNG WORLD trạng thái KHOÁ: pill surface trầm, huy hiệu surface-chìm #F4E9D8 + ổ khoá, small-caps "THẾ GIỚI k · [tên world]", dòng "Cần thêm N★ để mở" + thanh tiến độ sao (gradient #FFCA66→#FF9F68), nút phụ pill "Cày sao ★" (warning #FFCA66). (Bản MỞ đã có trong từng file world, Phần 2.)
```

### B4. Vừa thắng — quay lại map (thưởng sao)
```
STYLE (Gravity Jelly): khối jelly có mắt; nền #FFF7EC; primary cam #FF9F68; sao #FFC23D; mascot jelly hồng; Fredoka + Nunito; map cuộn dọc, leo từ dưới lên.

Vẽ biến thể "VỪA HOÀN THÀNH màn, quay lại map": node vừa xong hiện 2–3 sao #FFC23D BAY VÀO + particle; đường nối sang node kế SÁNG DẦN bằng primary #FF9F68; mascot jelly có mắt NHẢY sang node kế (có bóng); node kế bắt đầu pulse + pill "Chơi ngay"; popup "+3 ★" bay lên. Nảy nhẹ kiểu jelly.
```

### B5. FTUE — lần đầu vào map
```
STYLE (Gravity Jelly): khối jelly có mắt; nền #FFF7EC trời #DEF0E1→#C6E8C9 (Đồng cỏ); primary cam #FF9F68; scrim rgba(60,44,24,0.42); Fredoka + Nunito.

Vẽ biến thể "LẦN ĐẦU vào map": World 1 Đồng cỏ ở đáy; chỉ node 1 sáng + pulse, các node trên khoá mờ; lớp phủ scrim rgba(60,44,24,0.42) toàn màn, KHOÉT SÁNG quanh node 1 (spotlight); HAND POINTER trỏ node 1 + caption "Chạm để bắt đầu!"; HUD "★ 0 · Đồng cỏ".
```

> Cutscene chuyển cảnh giữa các world nằm trong TỪNG file world (mục "Chuyển cảnh"), vì mỗi cặp world có palette riêng.

---

## C. Checklist nghiệm thu (áp cho mọi viewport)

- [ ] Font Fredoka + Nunito; màu khớp tokens (nền kem, node 4 màu jelly, CTA cam, đá cho node khoá, boss accent gravity tím).
- [ ] Node = JellyBlock có mắt + viền dày + gloss; số ĐÚNG theo bảng world→màn.
- [ ] Phân biệt rõ trạng thái (hoàn thành+sao / hiện tại pulse+"Chơi ngay" / khoá ổ khoá).
- [ ] Breather (vị trí 6) và boss (vị trí 10) đúng chỗ.
- [ ] Đường + nền CHẢY QUA mép trên/dưới (khớp cuộn); HUD dính.
- [ ] Toạ độ x node ở mép trên của một viewport khớp node ở mép dưới viewport kế (ghép liền mạch).
- [ ] Cổng world đúng (mở success / khoá + "Cần N★"); chuyển cảnh đúng palette 2 world.
