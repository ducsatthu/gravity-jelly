# Prompts cho Claude Design — Màn hình HIỂN THỊ MỤC TIÊU (in-game + HUB)

Bộ prompt **dán vào Claude Design** để dựng các màn hiển thị **mục tiêu màn chơi** (objective),
bám đúng **"Gravity Jelly Design System"** đã có (tokens + component). Phạm vi: **tới Level 30**
(World 1 Đồng cỏ · World 2 Rừng rậm · World 3 Sông & Thác).

> Nguồn dữ liệu mục tiêu: `docs/02-thiet-ke-man/02-he-muc-tieu.md`, `docs/02-thiet-ke-man/04-world-1-dong-co.md`,
> `docs/06-du-lieu/01-thiet-ke-100-man.xlsx`.

---

## 0. Cách dùng

- **Prompt 1** (context + tokens) chạy **1 lần đầu** mỗi phiên.
- **Prompt 2** = *catalogue mục tiêu* — dữ liệu nền, dán kèm mọi prompt màn hình bên dưới.
- **Prompt A–E** = từng màn/khối UI hiển thị mục tiêu. Chạy độc lập, không phải chuỗi nối tiếp.
  Ưu tiên: **A (HUD in-game) → B (Level Intro) → C (Boss HUD) → D (Level Win) → E (node HUB)**.
- Mỗi lần Claude Design trả kết quả, xem rồi góp ý; giữ đúng tokens để không lệch thương hiệu.

---

## 1. PROMPT — Context & tokens (chạy đầu tiên)

```
Bối cảnh: Thiết kế UI cho game puzzle casual Android "Gravity Jelly" — lưới 9×9 block-fit, cơ chế
chữ ký là XOAY hướng trọng lực 90°. Tôi cần các màn/thành phần HIỂN THỊ MỤC TIÊU MÀN CHƠI (objective).
PHẢI bám đúng design system "Gravity Jelly" hiện có (đừng phát minh style mới).

Thiết bị: điện thoại Android dọc 360 × 800 dp. Gutter 16dp. Vùng chạm ≥ 48dp. Lưới 4dp.
Render bằng React (mobile dọc) để tôi duyệt; sẽ convert sang Jetpack Compose nên gom design tokens
đặt tên rõ, ghi kích thước bằng dp.

PHONG CÁCH "JELLY PASTEL MỀM": nền kem #FFF7EC, panel trắng bo góc lớn, mỗi khối là nhân vật thạch
bo tròn viền dày có mắt + vệt bóng (gloss), soft shadow nâu nhạt. Vui, dễ thương, sạch, dịu mắt.

FONT: Display & số = "Fredoka" (400–700). Body & nhãn = "Nunito" (600–800).

TOKENS MÀU (dùng đúng biến này):
- Nền/bề mặt: bg #FFF7EC · surface #FFFFFF · surface-sunken #F4E9D8 · overlay rgba(60,44,24,0.42)
  · cell-empty #FBEFDD · stone #C9BCA8.
- Khối thạch (fill / edge / shine): vàng #FFE3A3/#E8B85C/#FFF1CE · mint #A3E5D9/#5FC3B2/#CBF2EB
  · hồng #F7A9C0/#E576A0/#FBD0DF · xanh #B3C7F7/#7E9CE8/#D6E1FB.
- Ngữ nghĩa: primary(tangerine) #FF9F68 · gravity(tím) #7E6CF0 · success #6FCF7F · warning #FFCA66
  · danger #F08A7E · info #8FB6F2.
- Chữ: text #5B4636 · text-muted #9B886F · text-invert #FFFFFF.

TYPE SCALE: display 40 · title 28 · heading 22 · score 20 · body 16 · label 14 · caption 12 · on-block 18.
SPACING (4dp): 2xs2 · xs4 · sm8 · md12 · lg16 · xl24 · 2xl32. RADIUS: sm8 · md12 · lg20 · xl28 · 2xl36 · full.
SHADOW: sm 0 2 6 · md 0 6 14 · lg 0 12 28 (màu nâu nhạt). Viền jelly 3dp. Gloss inset 0 3 0 rgba(255,255,255,.55).
MOTION: fast150 · base250 · medium350 · slow450; ease-out, ease-jelly(cubic-bezier(.34,1.56,.5,1)).

COMPONENT CÓ SẴN (tái dùng, đừng vẽ lại từ đầu): JellyBlock, Eyes, Icon (Lucide-style 2dp),
Button (variant primary/gravity/success/danger/secondary/ghost; size cta56/md48; có edge 3D nén khi nhấn),
Hud (thanh 56dp: điểm · trọng lực · pause), Tray (dock 112dp), GravityRotateButton (FAB 64dp + badge
số lượt xoay còn lại), ComboPopup (badge ×1–10), Dialog (modal mềm).

KÍCH THƯỚC GAME: ô lưới 36dp, gap 2dp, bàn 340dp, HUD 56dp, tray 112dp, FAB xoay 64dp, CTA 56dp.

Xác nhận đã hiểu tokens rồi tôi gửi CATALOGUE MỤC TIÊU + từng màn cần dựng.
```

---

## 2. PROMPT — CATALOGUE MỤC TIÊU (dán kèm mọi prompt màn hình)

```
DỮ LIỆU MỤC TIÊU (tới Level 30). Mỗi màn có 1 goal_type; HUD hiển thị mục tiêu + tiến độ trực tiếp +
đơn vị sao. "Đơn vị sao" = thứ đo để chấm 3★/2★/1★.

A) MỤC TIÊU TUTORIAL — "làm 1 hành động" (World 1, mỗi màn dạy 1 thứ; popup dạy-1-lần riêng):
1. CLEAR_ROW_FIRST — "Xóa 1 hàng"      · icon: hàng ngang sáng     · tiến độ: 0/1 hàng · sao: số nước · (L1)
2. CLEAR_COL_FIRST — "Xóa 1 cột"       · icon: cột dọc sáng        · tiến độ: 0/1 cột  · sao: số nước · (L2)
3. ROTATE_FIRST    — "Xoay 1 lần"      · icon: mũi tên xoay (gravity) · tiến độ: 0/1 xoay · sao: số xoay · (L3)
4. MAKE_SUPER1     — "Tạo Siêu khối"   · icon: khối lớn có vương miện · tiến độ: 0/1 · sao: số nước · (L4)
5. MAKE_SUPER2     — "Siêu khối cấp 2" · icon: khối lớn + tia nổ    · tiến độ: 0/1 · sao: số nước · (L5)
6. MAKE_RAINBOW    — "Tạo Cầu vồng"    · icon: khối cầu vồng sọc    · tiến độ: 0/1 · sao: số nước · (L6)
7. MAKE_RAINBOW_SUPER — "Cầu vồng Super" · icon: cầu vồng + tia nổ · tiến độ: 0/1 · sao: số nước · (L7)
8. COMBO_X2        — "Đạt Combo ×2"    · icon: badge ×2            · tiến độ: cao nhất đạt ×N · sao: số nước · (L8)

B) MỤC TIÊU TÍCH LUỸ:
9. REACH_SCORE — "Đạt N điểm" · icon: ngôi sao điểm/số · tiến độ: THANH điểm hiện tại / N · sao: điểm.
   Ngưỡng qua màn (1★) theo màn: L9=200 · L22=450 · L26=300 · L28=550. (3★/2★ cao hơn — xem bảng sao.)

C) MỤC TIÊU Ô ĐÍCH (đếm số) — CLEAR_TARGETS:
10a. Phá GỐC DÂY LEO (World 2 Rừng rậm) — icon: gốc/mầm dây leo xanh · tiến độ: đếm còn N gốc ·
     lưu ý: DÂY LEO tự mọc lan mỗi lượt (đe doạ bịt bàn) → HUD cần chỉ báo "dây đang mọc". Số gốc 1–2.
10b. Phá GIỌT NƯỚC (World 3 Sông & Thác) — icon: giọt nước xanh ngọc · tiến độ: đếm còn N giọt ·
     một số giọt CHÔN SÂU (dưới lớp khối) → icon giọt mờ + khoá lớp. Số giọt 2–4.

D) MỤC TIÊU HỖN HỢP — MIXED (phải đạt CẢ HAI): "Phá X ô đích + Đạt N điểm".
   Ví dụ: L15/L19 (gốc dây + điểm), L24/L29 (giọt + điểm). HUD hiện 2 dòng tiến độ song song.

E) BOSS — BOSS_COMBO: bào máu boss bằng COMBO. Mỗi lần combo chạm mức mới ≥ ×2 gây (bậc − 1) sát
   thương (×2=1 · ×3=2 · ×4=3…). HUD cần: chân dung boss + THANH MÁU + số sát thương bay lên khi combo.
   - L10 "Chú Sâu Đồng Cỏ" — máu 5 (boss đầu, nhẹ).
   - L20 "Thần Rừng" (Vine Siege) — máu 8 (mỗi 3 lượt mọc thêm 1 gốc dây leo mới).
   - L30 "Thần Thác" — máu 10 (tự đảo hướng trọng lực/dòng mỗi 3 lượt).
   Sao (số nhịp combo để hạ): ví dụ L30 3★≤5 · 2★≤7 · 1★≤10.

HUD PHỤ luôn có (mọi màn):
- Số LƯỢT XOAY còn lại (gravity, badge trên FAB) — combo ≥×2 hồi +1 lượt xoay.
- Chỉ báo HƯỚNG TRỌNG LỰC hiện tại.
- ComboPopup ×N khi đang combo.
- (W2) chỉ báo dây leo mọc · (W3) mũi tên "dòng chảy" trên bàn.

ĐƠN VỊ SAO theo màn: Nước (số mảnh đặt) · Xoay (số cú xoay) · Điểm · Combo (số nhịp). Ngưỡng dạng 3★/2★/1★.
```

---

## 3. PROMPT A — HUD MỤC TIÊU trong game (quan trọng nhất)

```
[Dán Prompt 1 + Prompt 2 trước]

Mục tiêu: dựng THANH/CỤM HIỂN THỊ MỤC TIÊU cho màn GAME (đặt ngay dưới HUD 56dp điểm/pause, trên bàn 9×9).
Đây là nơi người chơi luôn thấy "mình cần làm gì" + tiến độ trực tiếp. Cao gợi ý 44–56dp, full-width,
panel surface bo lg, shadow sm, padding md.

Dựng ĐẦY ĐỦ các BIẾN THỂ theo goal_type trong catalogue (mỗi biến thể một card để tôi so sánh):
1. Tutorial (CLEAR_ROW/COL/ROTATE/SUPER1/SUPER2/RAINBOW/RAINBOW_SUPER/COMBO_X2): icon + nhãn ngắn +
   chip tiến độ "0/1" (hoặc "×N" cho combo). Khi đạt → chip đổi sang success + tick, micro-anim ease-jelly.
2. REACH_SCORE: nhãn "Mục tiêu" + THANH tiến độ điểm (hiện tại / N) màu primary, số điểm Fredoka; đầy → glow.
3. CLEAR_TARGETS: icon ô đích (gốc dây leo / giọt nước) + bộ đếm "còn N" dạng các icon nhỏ tắt dần khi phá.
   Biến thể giọt CHÔN SÂU: icon giọt mờ + ổ khoá lớp.
4. MIXED: 2 dòng tiến độ song song (ô đích + điểm), gọn trong cùng panel.
5. Trạng thái: đang làm / gần xong (nhấn nhá) / hoàn thành (success). 

Yêu cầu:
- Tái dùng Icon + JellyBlock + màu token; nhãn Nunito, số Fredoka.
- Gọn 1 dòng cho tutorial/score; 2 dòng cho mixed. Không che bàn.
- Kèm chỉ báo LƯỢT XOAY còn lại (gravity) nếu chưa nằm trên FAB.
Acceptance: đủ 5 nhóm biến thể + trạng thái hoàn thành; đọc rõ trên nền kem; kích thước dp ghi rõ.
Kiểm chứng: 1 artboard lưới tất cả biến thể; 1 artboard ráp vào màn GAME thật (HUD + cụm mục tiêu + bàn + tray).
```

---

## 4. PROMPT B — Màn LEVEL INTRO (mục tiêu + sao + cơ chế mới)

```
[Dán Prompt 1 + Prompt 2 trước]

Mục tiêu: màn/popup LEVEL INTRO (trước khi vào màn) — bám screen-06-level-intro có sẵn nhưng cập nhật
theo hệ mục tiêu mới. Modal mềm (Dialog) hoặc full-screen 360×800.

Thành phần:
- Tiêu đề màn: "Màn X · <Tên>" (vd "Màn 6 · Cầu vồng 1"), world chip (Đồng cỏ/Rừng rậm/Sông & Thác).
- KHỐI MỤC TIÊU nổi bật: icon lớn + câu mục tiêu theo catalogue (vd "Tạo 1 ô Cầu vồng", "Phá 3 giọt nước",
  "Đạt 450 điểm", "Hạ Thần Thác — máu 10").
- Hàng SAO: 3 ngôi sao + ngưỡng theo đơn vị (vd "3★ ≤3 nước · 2★ 4 · 1★ 5" hoặc "3★ 700 · 2★ 560 · 1★ 450đ").
- Chip NGÂN SÁCH XOAY của màn (gravity) + (nếu có) chip CƠ CHẾ MỚI (dây leo / dòng chảy / boss).
- Nút CTA "BẮT ĐẦU" (primary, cta 56dp).
Dựng 3 ví dụ: (a) tutorial L6 Cầu vồng · (b) ô đích L23 "Phá 3 giọt" · (c) boss L30 "Thần Thác".
Acceptance: khối mục tiêu + sao + ngân sách xoay rõ ràng; 3 ví dụ khác goal_type; tokens đúng.
```

---

## 5. PROMPT C — BOSS HUD (thanh máu + sát thương)

```
[Dán Prompt 1 + Prompt 2 trước]

Mục tiêu: cụm HUD BOSS cho các màn boss (L10/L20/L30) — bám screen-10-boss-intro cho phần chân dung.
Đặt trên cùng màn GAME thay cho cụm mục tiêu thường.

Thành phần:
- Chân dung boss tròn (jelly-style dễ thương nhưng "đối thủ") + tên boss.
- THANH MÁU boss: nền sunken, fill danger→warning theo % máu, số "máu/××" Fredoka; giật + nháy khi trúng đòn.
- Số SÁT THƯƠNG bay lên (−1/−2/−3) gắn với bậc combo; đồng bộ ComboPopup ×N.
- Nhãn nhắc luật: "Combo ≥ ×2 để gây sát thương".
- (Tuỳ boss) chỉ báo đòn: L20 "sắp mọc thêm gốc dây leo", L30 "sắp đảo trọng lực (đếm 3→0)".
Dựng 3 ví dụ máu: 5 (Chú Sâu Đồng Cỏ) · 8 (Thần Rừng) · 10 (Thần Thác), kèm trạng thái vừa trúng đòn.
Acceptance: thanh máu + số sát thương + nhắc luật rõ; 3 boss; đọc tốt trên nền tối/sáng.
```

---

## 6. PROMPT D — Màn LEVEL WIN (sao theo đơn vị)

```
[Dán Prompt 1 + Prompt 2 trước]

Mục tiêu: màn LEVEL WIN — bám screen-07-level-win, cập nhật để chấm sao theo ĐƠN VỊ của màn.

Thành phần:
- 3 SAO bay vào lần lượt (ease-jelly), số sao đạt tô vàng, chưa đạt xám.
- Dòng kết quả theo đơn vị sao: "Xong trong 4 nước" / "Đạt 480 điểm" / "Hạ boss trong 3 nhịp combo".
- So với ngưỡng: hiện mốc còn thiếu để lên sao kế ("thêm 40 điểm nữa để 2★").
- Điểm màn + (tuỳ) xu thưởng; nút "Màn tiếp" (primary) + "Chơi lại" (secondary).
Dựng 3 ví dụ: tutorial (đơn vị nước) · điểm · boss (đơn vị combo).
Acceptance: sao + dòng kết quả đúng đơn vị từng loại; 3 ví dụ; tokens đúng.
```

---

## 7. PROMPT E — Badge MỤC TIÊU trên node HUB (bản đồ)

```
[Dán Prompt 1 + Prompt 2 trước]

Mục tiêu: cách MỤC TIÊU hiển thị gọn trên NODE của bản đồ leo màn (HUB) — bổ sung cho map-nodes có sẵn
(7 biến thể node: 3★/2★/1★/hiện tại/khoá/breather/boss). KHÔNG vẽ lại toàn map, chỉ dựng "objective badge".

Thành phần:
- Mỗi node kèm 1 ICON MỤC TIÊU nhỏ (theo catalogue) để người chơi biết trước loại thử thách:
  xóa hàng/cột · xoay · siêu khối · cầu vồng · combo · điểm (★số) · ô đích (gốc dây/giọt) · boss (đầu lâu/chân dung).
- Node đã qua: badge + số sao đạt. Node hiện tại: pulse + "Chơi ngay". Node boss: to hơn, icon boss.
- Tuỳ chọn: chạm node → popup nhỏ preview mục tiêu + ngưỡng sao (dùng lại khối ở Prompt B thu nhỏ).
Dựng 1 dải mẫu 8–10 node W3 (21–30) minh hoạ đủ loại icon mục tiêu (ô đích, điểm, mixed, boss).
Acceptance: icon mục tiêu phân biệt rõ từng loại; khớp phong cách map-nodes; đọc tốt ở kích thước node nhỏ.
```

---

## 8. Tokens rút gọn (dán lại khi Claude Design mất ngữ cảnh)

```
Nền kem #FFF7EC · surface #FFFFFF · sunken #F4E9D8. Chữ #5B4636 / muted #9B886F.
Jelly: vàng #FFE3A3 · mint #A3E5D9 · hồng #F7A9C0 · xanh #B3C7F7 (edge đậm hơn ~15%, shine sáng hơn).
Primary #FF9F68 · Gravity(tím) #7E6CF0 · Success #6FCF7F · Warning #FFCA66 · Danger #F08A7E.
Font: Fredoka (display/số) · Nunito (body/nhãn). Type: title28 · heading22 · score20 · body16 · label14 · caption12.
Space 4dp (sm8/md12/lg16/xl24). Radius lg20/xl28/full. Shadow mềm nâu nhạt. Viền jelly 3dp. Motion 150/250/350/450, ease-jelly.
Thiết bị 360×800dp, gutter 16, chạm ≥48. Ô lưới 36 · bàn 340 · HUD 56 · tray 112 · FAB xoay 64 · CTA 56.
```

---

## Nhật ký thay đổi

- **04/07/2026** — Đồng bộ boss theo nguồn thật `../02-thiet-ke-man/02-he-muc-tieu.md`: L20 sửa "Kẻ Đổ Rác / đổ rác" → **"Thần Rừng" (Vine Siege), đòn mọc thêm gốc dây leo mỗi 3 lượt** (L10 "Chú Sâu Đồng Cỏ" máu 5 và L30 "Thần Thác" máu 10 đã khớp canonical, giữ nguyên).
