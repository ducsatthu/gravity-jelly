# 00 — Shared Index (dùng chung cho mọi world)

File nền tảng dùng cho **tất cả** file world. Chạy/ghim file này **một lần đầu phiên** Claude Design, rồi mới mở từng `world-XX`. Mọi prompt world đều mở đầu bằng "Dựa trên 00-shared-index…".

Bám đúng **Gravity Jelly Design System** (`design/Gravity Jelly Design System/01-tokens` + `03-components`). Bỏ qua bản campaign-map cũ.

---

## A. PROMPT — Context & Foundation tokens (chạy đầu tiên, 1 lần)

```
Bối cảnh: Thiết kế MÀN HÌNH BẢN ĐỒ "leo màn" (level map) cho game puzzle casual Android "Gravity Jelly". PHẢI bám design system "Gravity Jelly" hiện có. Bỏ qua bản campaign-map cũ.

Phong cách "block jelly": nhân vật là KHỐI JELLY bo tròn CÓ MẮT, viền dày, mặt trên có vệt bóng (gloss), tông kẹo ngọt, nền kem ấm, soft shadow nâu nhạt. Vui, thân thiện, sạch.

Thiết bị: Android dọc 360×800dp. Gutter 16dp. Touch ≥48dp.

FONT: display & số = "Fredoka" (400–700); body & nhãn = "Nunito" (600–800). Cỡ: tiêu đề 28 / heading 22 / số HUD 20 / body 16 / nhãn 14 / caption 12 / số trên khối 18 / logo 40. Leading số 1.05. Nhãn small-caps letter-spacing 0.04em.

MÀU (giữ nguyên):
- Nền bg #FFF7EC; surface #FFFFFF; surface-chìm #F4E9D8; scrim rgba(60,44,24,0.42).
- 4 KHỐI JELLY fill/edge/shine: vàng #FFE3A3/#E8B85C/#FFF1CE · mint #A3E5D9/#5FC3B2/#CBF2EB · hồng #F7A9C0/#E576A0/#FBD0DF · xanh #B3C7F7/#7E9CE8/#D6E1FB.
- Đá (khoá/cố định) #C9BCA8 / viền #A89A82 / bóng #DBD0BF.
- Chữ #5B4636 · mờ #9B886F · invert #FFFFFF · trên-khối #6A4A2E.
- CTA primary cam #FF9F68 / viền #E97E45 / bóng #FFC59A.
- success #6FCF7F · warning #FFCA66 · danger #F08A7E · info #8FB6F2 · sao #FFC23D.
- Gravity (accent cơ chế chữ ký) TÍM #7E6CF0 / viền #6353D6 / bóng #A99CF6.
- Bóng mềm rgba(120,92,52,0.16) / đậm rgba(120,92,52,0.24).

HÌNH: spacing 4dp (2/4/8/12/16/24/32/48); bo chip8/ô12/thẻ20/nút28/sheet36/pill full; viền 1.5/3/4; ô jelly có gloss inset đỉnh. Motion 150–450ms, ease nảy jelly cho pulse/pop.

COMPONENT (tái dùng, đừng vẽ lại): JellyBlock (khối có mắt, viền 3dp, gloss, 4 màu, có thể mang số); Button (nút kẹo cạnh 3D lún khi nhấn, primary/gravity/success/danger/secondary/ghost, size cta 56dp bo28; "SẮP CÓ" làm mờ + pill); HUD bar trên 56dp.

BẢN ĐỒ WORLD → KHOẢNG MÀN (đánh số ĐÚNG, mỗi world đúng 10 màn liên tiếp; trong world: màn thứ 6 = BREATHER, thứ 10 = BOSS):
W1 Đồng cỏ 1–10 · W2 Rừng rậm 11–20 · W3 Sông & Thác 21–30 · W4 Sa mạc 31–40 · W5 Bãi biển 41–50 · W6 Núi tuyết 51–60 · W7 Hang băng 61–70 · W8 Núi lửa 71–80 · W9 Bầu trời 81–90 · W10 Vũ trụ 91–100. (Boss = 10,20,…,100; breather = 6,16,…,96.)

QUY ƯỚC CUỘN: map là dải dọc dài; mỗi artboard chỉ là MỘT VIEWPORT. Đường + nền phải CHẢY QUA mép trên & dưới (không cụt). HUD là lớp DÍNH đè lên nội dung cuộn. Không vẽ thanh cuộn.

Ghi nhớ toàn bộ cho các prompt world & trạng thái tiếp theo.
```

---

## B. PROMPTS — Trạng thái & component DÙNG LẠI (làm 1 lần, áp mọi world)

Không gắn world cụ thể. Đổi tên world trong ví dụ cho khớp world đang làm. **End-of-content nằm trong file `10-vu-tru.md` (Phần 2)** — chỉ làm ở cuối.

### B1. Style sheet các trạng thái NODE
```
Dựa trên 00-shared-index. Vẽ BẢNG COMPONENT các biến thể NODE trên nền kem #FFF7EC, nhãn Nunito dưới mỗi mẫu:
1) Hoàn thành 3 sao — JellyBlock màu + số, 3 sao #FFC23D đầy.
2) Hoàn thành 2 sao — sao 3 xám nhạt.
3) Hoàn thành 1 sao.
4) Hiện tại — đĩa trắng viền primary #FF9F68 + vòng pulse + mascot jelly hồng có mắt + pill "Chơi ngay".
5) Khoá — khối đá #C9BCA8 viền #A89A82 + ổ khoá trắng.
6) Breather — JellyBlock nhỏ hơn, nhạt + tag "Nghỉ" xám.
7) Boss — JellyBlock to 1.2× + hào quang gravity tím #7E6CF0 + tag "BOSS".
Viền 3dp, gloss đỉnh, đổ bóng sm. 2 hàng, cách đều.
```

### B2. HUD trên (component)
```
Dựa trên 00-shared-index. Vẽ COMPONENT HUD map, full 360dp, cao 56dp, surface #FFFFFF, đổ bóng md, bo dưới 20.
- Trái: nút icon Back 48dp (secondary, bo 12).
- Giữa: small-caps "THẾ GIỚI 1 · HÀNH TRÌNH" (#9B886F 10, ls 0.04em) + "Đồng cỏ" (Fredoka 20 #5B4636).
- Phải: chip pill ★ tổng (sao #FFC23D + số Fredoka 16).
- Hàng dưới: thanh tiến độ bo full (nền #F4E9D8, phần đạt gradient #FFCA66→#FF9F68) + caption "Còn N★ để mở [world kế]".
Vẽ trên 2 nền (Đồng cỏ sáng & Vũ trụ tối) để chứng minh tương phản chữ.
```

### B3. Cổng world — KHOÁ (thiếu sao)
```
Dựa trên 00-shared-index. Vẽ COMPONENT banner CỔNG WORLD trạng thái KHOÁ: pill surface trầm, huy hiệu surface-chìm #F4E9D8 + ổ khoá, small-caps "THẾ GIỚI k · [tên]", dòng "Cần thêm N★ để mở" + thanh tiến độ sao (gradient #FFCA66→#FF9F68), nút phụ pill "Cày sao ★" (warning). (Bản MỞ đã có trong từng file world, Phần 2.)
```

### B4. Vừa thắng — quay lại map (thưởng sao)
```
Dựa trên 00-shared-index. Vẽ biến thể "VỪA HOÀN THÀNH màn, quay lại map": node vừa xong hiện 2–3 sao #FFC23D BAY VÀO + particle; đường nối sang node kế SÁNG DẦN bằng primary #FF9F68; mascot jelly có mắt NHẢY sang node kế (có bóng); node kế bắt đầu pulse + pill "Chơi ngay"; popup "+3 ★" bay lên. Nảy nhẹ kiểu jelly.
```

### B5. FTUE — lần đầu vào map
```
Dựa trên 00-shared-index. Vẽ biến thể "LẦN ĐẦU vào map": World 1 Đồng cỏ ở đáy; chỉ node 1 sáng + pulse, các node trên khoá mờ; lớp phủ scrim rgba(60,44,24,0.42) toàn màn, KHOÉT SÁNG quanh node 1; HAND POINTER trỏ node 1 + caption "Chạm để bắt đầu!"; HUD "★ 0 · Đồng cỏ".
```

> Cutscene chuyển cảnh giữa các world nằm trong TỪNG file world (mục "Chuyển cảnh"), vì mỗi cặp world có palette riêng.

---

## C. Tokens rút gọn (dán lại khi mất ngữ cảnh)

```
360×800dp dọc, gutter 16, touch ≥48. Font Fredoka (số/tiêu đề) + Nunito (body). Cỡ 28/22/20/16/14/12, số khối 18.
Màu: bg #FFF7EC, surface #FFFFFF, chìm #F4E9D8. Jelly vàng #FFE3A3 / mint #A3E5D9 / hồng #F7A9C0 / xanh #B3C7F7 (edge sậm hơn). Đá #C9BCA8/#A89A82. Chữ #5B4636 / mờ #9B886F / trên-khối #6A4A2E. CTA cam #FF9F68. Gravity tím #7E6CF0. Sao #FFC23D. Bóng nâu nhạt.
Bo nút28/thẻ20/ô12/pill full; viền jelly 3dp + gloss đỉnh; motion nảy jelly.
Node map = JellyBlock có mắt, tô 4 màu jelly LUÂN PHIÊN (nhận diện thương hiệu, KHÔNG đổi theo world). CTA luôn cam, KHÔNG xanh lá. Map cuộn dọc, đường chảy qua 2 mép, HUD dính.
```

---

## D. Checklist nghiệm thu (áp cho mọi viewport)

- [ ] Font Fredoka + Nunito; KHÔNG font lạ.
- [ ] Màu khớp tokens: nền kem, node 4 màu jelly, CTA cam, đá cho node khoá, accent gravity tím cho boss.
- [ ] Node = JellyBlock có mắt + viền dày + gloss; số ĐÚNG theo bảng world→màn.
- [ ] Phân biệt rõ trạng thái (hoàn thành+sao / hiện tại pulse+"Chơi ngay" / khoá ổ khoá) — không chỉ bằng màu.
- [ ] Có breather (vị trí 6) và boss (vị trí 10) đúng chỗ.
- [ ] Đường + nền CHẢY QUA mép trên/dưới (khớp cuộn); HUD dính.
- [ ] Toạ độ x node ở mép trên của một viewport khớp node ở mép dưới viewport kế (ghép liền mạch).
- [ ] Cổng world đúng (mở success / khoá + "Cần N★"); chuyển cảnh đúng palette 2 world.
- [ ] Thống nhất design system block jelly nền tảng; không lặp lỗi campaign-map cũ.
