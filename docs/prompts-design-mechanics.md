# Claude Design Prompts — Minh hoạ CƠ CHẾ (chưa theo màn)

Bộ prompt để vẽ **mockup minh hoạ từng cơ chế** trong `mechanics-ideas.md` bằng Claude Design, nhằm tinh chỉnh cảm giác/giao diện. Mỗi cơ chế = **một thẻ Trước → Sau**, không gắn level cụ thể.

## Cách dùng

1. **Chạy/ghim `00-shared-index.md` một lần đầu phiên** (tokens + style block jelly + màu). Mọi prompt dưới mở đầu ngầm "Dựa trên 00-shared-index…".
2. Mỗi mục dưới là **một prompt độc lập** theo **MẪU THẺ CƠ CHẾ** (định nghĩa ngay dưới). Chỉ cần dán phần trong khối ```…``` kèm câu mở đầu "Dựa trên 00-shared-index, theo MẪU THẺ CƠ CHẾ:".

---

## MẪU THẺ CƠ CHẾ (dán 1 lần để Design ghi nhớ)

```
Định nghĩa MẪU "THẺ CƠ CHẾ" để tái dùng cho mọi cơ chế:
- Artboard 360×760dp dọc, nền kem #FFF7EC, gutter 16.
- ĐẦU: chip pill surface #FFFFFF (bóng sm) — nhãn small-caps nhóm (#9B886F 10, ls .04em) + TÊN CƠ CHẾ (Fredoka 20 #5B4636).
- THÂN: 2 PANEL "board-snippet" xếp dọc, mỗi panel là một lưới con (mặc định 5×5) ô 44dp:
  · Nhãn panel small-caps "TRƯỚC" / "SAU" (#9B886F).
  · Ô có khối = JellyBlock chuẩn (mắt googly nhìn theo trọng lực, viền edge 3dp, gloss đỉnh, corner sticker: vàng=sao · mint=lá · hồng=tim · xanh=giọt). KHÔNG vẽ số lên khối.
  · Ô trống = surface chìm #F4E9D8 bo 12. Đá = #C9BCA8 viền #A89A82, mắt "ngủ" (2 gạch).
- GIỮA 2 panel: mũi tên xuống + icon HÀNH ĐỘNG (nút Gravity tím #7E6CF0 cho thao tác xoay; biểu tượng khác tuỳ cơ chế).
- ĐÁY: caption Nunito 14 #5B4636, 1 câu mô tả cơ chế.
- Bám tokens & font hệ thống (Fredoka/Nunito), motion nảy jelly. Mắt khối luôn nhìn theo hướng trọng lực của panel đó.
Ghi nhớ MẪU này cho các prompt cơ chế tiếp theo.
```

---

# A · Biến tấu TRỌNG LỰC

### A1 · Xoay 90° (cơ chế chữ ký)
```
THẺ CƠ CHẾ "Xoay trọng lực 90°" (nhóm Trọng lực).
TRƯỚC: trọng lực XUỐNG; vài cụm jelly lệch phải, đáy còn lỗ. Mắt khối nhìn xuống.
HÀNH ĐỘNG: nút Gravity tím "xoay ←".
SAU: trọng lực TRÁI; cả cụm đổ sang trái, lấp đầy một cột bên trái đang loé sáng (sắp xóa). Mắt khối nhìn sang trái.
Caption: "Chạm để xoay 90° — cả bàn đổ lại theo hướng mới."
```

### A2 · Xoay 180° (lật ngược)
```
THẺ CƠ CHẾ "Lật ngược 180°" (nhóm Trọng lực).
TRƯỚC: trọng lực xuống, khối dồn đáy. HÀNH ĐỘNG: nút Gravity tím "↑↓ 180°" + nhãn "−2 lượt".
SAU: trọng lực lên, toàn bộ khối rơi ngược lên trần. Mắt nhìn lên.
Caption: "Lật ngược cả bàn một phát — tốn 2 lượt xoay."
```

### A3 · Trọng lực chéo (về 1 góc)
```
THẺ CƠ CHẾ "Trọng lực chéo" (nhóm Trọng lực · cao cấp).
TRƯỚC: khối rải khắp bàn. HÀNH ĐỘNG: icon mũi tên chéo tím xuống-phải.
SAU: mọi cụm dồn về GÓC dưới-phải thành khối đặc, góc còn lại trống.
Caption: "Dồn cả bàn về một góc — combo lạ, dùng dè."
```

### A4 · Trọng lực điểm (hút về tâm)
```
THẺ CƠ CHẾ "Trọng lực điểm" (nhóm Trọng lực · cao cấp/boss).
TRƯỚC: khối rải rìa bàn, giữa có 1 ô tâm phát sáng tím. HÀNH ĐỘNG: icon xoáy hút tím.
SAU: các cụm bị hút co cụm quanh tâm, tạo vòng khối đồng tâm.
Caption: "Mọi khối hút về tâm — sân khấu cho màn Vũ trụ/boss."
```

### A5 · Bàn chia vùng trọng lực
```
THẺ CƠ CHẾ "Chia vùng trọng lực" (nhóm Trọng lực · rủi ro).
TRƯỚC: vạch ngăn giữa bàn; nửa trên nhãn "↓", nửa dưới nhãn "↑".
SAU: khối nửa trên rơi xuống vạch, khối nửa dưới rơi lên vạch — dồn về đường giữa.
Caption: "Hai nửa bàn, hai chiều trọng lực ngược nhau."
```

### A6 · Đảo trọng lực tự động mỗi N lượt
```
THẺ CƠ CHẾ "Đảo tự động" (nhóm Trọng lực).
TRƯỚC: HUD đồng hồ "2 lượt nữa đảo"; trọng lực xuống. HÀNH ĐỘNG: chuông cảnh báo tím (telegraph).
SAU: trọng lực tự đảo lên, khối rơi ngược — người chơi không bấm.
Caption: "Môi trường tự đảo trọng lực theo nhịp — đặc trị màn/boss."
```

### A7 · Zero-G tạm thời
```
THẺ CƠ CHẾ "Không trọng lực" (nhóm Trọng lực · cao cấp · Vũ trụ).
TRƯỚC: vài khối LƠ LỬNG đúng chỗ đặt, viền nhấp nháy tím, nhãn "Zero-G: 2 lượt".
SAU: hết Zero-G, mọi khối rơi xuống cùng lúc, va chạm squash.
Caption: "Khối đứng yên giữa không trung vài lượt rồi mới rơi."
```

### A8 · Combo hồi ngân sách xoay
```
THẺ CƠ CHẾ "Combo hồi lượt xoay" (nhóm Trọng lực).
TRƯỚC: HUD lượt xoay "1", một combo x3 đang nổ. HÀNH ĐỘNG: tia sáng bay từ combo về nút Gravity.
SAU: HUD lượt xoay "2" (+1), nút Gravity sáng bật lại.
Caption: "Tạo combo lớn được thưởng thêm một lượt xoay."
```

### A9 · Khoá xoay tạm
```
THẺ CƠ CHẾ "Khoá xoay" (nhóm Trọng lực).
TRƯỚC: nút Gravity bình thường. HÀNH ĐỘNG: ổ khoá băng phủ lên nút, nhãn "Khoá: 3 lượt".
SAU: nút Gravity xám mờ + ổ khoá, đồng hồ đếm "3".
Caption: "Bị khoá xoay vài lượt — phải xoay sở bằng đặt mảnh."
```

### A10 · Xoay cục bộ (1 cụm)
```
THẺ CƠ CHẾ "Xoay cục bộ" (nhóm Trọng lực · rủi ro).
TRƯỚC: 1 cụm được chọn viền sáng tím, các cụm khác mờ. HÀNH ĐỘNG: vòng xoay tím quanh riêng cụm đó.
SAU: chỉ cụm đó đổi hướng/đổ, phần còn lại giữ nguyên.
Caption: "Chỉ một cụm đổi hướng rơi — biến thể thử nghiệm."
```

# B · CỤM / MÀU / payoff

### B0 · Merge-9 → Siêu khối (cơ chế chủ lực)
```
THẺ CƠ CHẾ "Hợp nhất → Siêu khối" (nhóm Cụm/Màu).
TRƯỚC: một khối 3×3 gồm 9 ô MINT dính liền, đang loé viền.
HÀNH ĐỘNG: tia hội tụ + icon ngôi sao nổ.
SAU: 9 ô thu về 1 SIÊU KHỐI mint mắt to phát sáng (chiếm 1 ô), 8 ô quanh trống ra.
Caption: "Gom 9 ô cùng màu → 1 siêu khối; xóa chạm nó = nổ lớn."
```

### B0b · Siêu khối phát nổ
```
THẺ CƠ CHẾ "Nổ siêu khối" (nhóm Cụm/Màu).
TRƯỚC: siêu khối mint giữa bàn, một hàng kề sắp xóa. HÀNH ĐỘNG: ngòi nổ sáng.
SAU: vụ nổ lan ra TẤT CẢ ô MINT khắp bàn (cùng màu cùng loé/biến mất), particle bay, ô trống loé.
Caption: "Siêu khối nổ quét sạch MỌI ô cùng màu trên bàn — combo khủng, ở boss = sát thương nặng."
```

### B1 · Combo meter leo thang
```
THẺ CƠ CHẾ "Combo leo thang" (nhóm Cụm/Màu).
TRƯỚC: thanh combo trống, x1. SAU: chuỗi 3 lần xóa liên tiếp, thanh combo đầy dần x1→x2→x3, số điểm nhân lên bay.
Caption: "Xóa liên tiếp nuôi bội số combo — đứt nhịp thì reset."
```

### B2 · Color-clear bonus
```
THẺ CƠ CHẾ "Xóa toàn 1 màu" (nhóm Cụm/Màu).
TRƯỚC: một hàng đầy 9 ô TOÀN MÀU HỒNG. HÀNH ĐỘNG: hào quang tim hồng.
SAU: hàng nổ với hiệu ứng đặc biệt (sao hồng), popup "MÀU HOÀN HẢO +bonus".
Caption: "Xóa nguyên hàng cùng một màu được thưởng đặc biệt."
```

### B3 · Wild block (cầu vồng)
```
THẺ CƠ CHẾ "Khối cầu vồng" (nhóm Cụm/Màu).
TRƯỚC: cụm 8 ô vàng thiếu 1 ô; trong khay có 1 khối CẦU VỒNG (gradient 4 màu, mắt to).
SAU: đặt khối cầu vồng vào → nó hoá vàng, cụm đủ 9 → thành siêu khối vàng.
Caption: "Khối cầu vồng ghép được mọi màu — chốt đủ 9 để merge."
```

### B4 · Siêu khối cấp 2 (đại nổ)
```
THẺ CƠ CHẾ "Siêu khối cấp 2" (nhóm Cụm/Màu · cao cấp).
TRƯỚC: hai siêu khối cùng màu kề nhau, viền rung. HÀNH ĐỘNG: hai ngôi sao gộp.
SAU: thành 1 đại-siêu-khối; nổ quét SẠCH mọi ô cùng màu trên bàn + thêm vùng 5×5 quanh tâm.
Caption: "Gộp 2 siêu khối → đại nổ: quét cùng màu toàn bàn + vùng 5×5."
```

### B5 · Cụm nặng đè vỡ
```
THẺ CƠ CHẾ "Cụm nặng" (nhóm Cụm/Màu).
TRƯỚC: một cụm lớn (xanh) treo trên một ô băng. HÀNH ĐỘNG: mũi tên trọng lực + icon "nặng".
SAU: cụm rơi đè VỠ ô băng bên dưới (nứt), tiếp tục lún xuống.
Caption: "Cụm to rơi mạnh, đè vỡ ô yếu/băng phía dưới."
```

### B6 · Ô nhuộm màu
```
THẺ CƠ CHẾ "Ô nhuộm" (nhóm Cụm/Màu · rủi ro).
TRƯỚC: 1 ô đặc biệt phát màu hồng, quanh là ô vàng/mint. HÀNH ĐỘNG: sóng nhuộm lan.
SAU: các ô kề bị nhuộm sang hồng, gom thành cụm hồng lớn.
Caption: "Ô nhuộm biến các ô kề sang màu nó — hỗ trợ gom màu."
```

### B7 · Mầm tách màu
```
THẺ CƠ CHẾ "Mầm tách màu" (nhóm Cụm/Màu · cao cấp).
TRƯỚC: cụm mint sắp xóa, trong có 1 ô lõi sáng. SAU: xóa xong để lại 1 "mầm" màu XANH ở chỗ lõi → nuôi mục tiêu màu mới.
Caption: "Xóa cụm để lại mầm màu khác — chuỗi mục tiêu nối tiếp."
```

# C · Ô ĐẶC BIỆT / hazard

### C-pool · Bảng modifier sẵn có (1 thẻ tổng)
```
Vẽ BẢNG COMPONENT 9 ô modifier đã có (mỗi ô 1 mẫu JellyBlock + nhãn Nunito dưới), nền kem:
Ô băng (lớp băng phủ, nứt 1 nửa) · Ô khoá (xích/ổ khoá) · Tường 1 chiều (mũi tên chặn) · Ẩn preview (dấu ?) · Ô bom (ngòi nổ) · Đá nở (đá có dấu +) · Ô trượt (vệt trượt) · Cụm nặng (mũi tên nặng) · Cấm hướng xoay (nút gravity gạch chéo).
Viền 3dp, gloss, đổ bóng sm; 3×3, cách đều. Bám tokens.
```

### C1 · Ô xích (2 ô nối)
```
THẺ CƠ CHẾ "Ô xích" (nhóm Hazard).
TRƯỚC: 2 ô nối bằng xích sáng, ở 2 chỗ khác nhau. SAU: phải xóa cả hai cùng lúc thì xích đứt, cả hai biến mất.
Caption: "Hai ô xích nối nhau — xóa cùng lúc mới ăn."
```

### C2 · Ô đếm ngược
```
THẺ CƠ CHẾ "Ô đếm ngược" (nhóm Hazard).
TRƯỚC: 1 ô mang đồng hồ "2". SAU: không xóa kịp, ô hoá ĐÁ cứng (xám, mắt ngủ), chặn chỗ.
Caption: "Không xóa trong N lượt, ô hoá đá — ép nhịp."
```

### C3 · Ô cổng (portal)
```
THẺ CƠ CHẾ "Cổng dịch chuyển" (nhóm Hazard · cao cấp).
TRƯỚC: cổng A (xoáy tím) ở trên-trái, cổng B (xoáy tím) ở dưới-phải; một cụm đang rơi về cổng A.
SAU: cụm chui cổng A, HIỆN RA từ cổng B rồi rơi tiếp.
Caption: "Cụm rơi vào cổng A, ra ở cổng B — câu đố trọng lực."
```

### C4 · Ô keo (sticky)
```
THẺ CƠ CHẾ "Ô keo" (nhóm Hazard).
TRƯỚC: 1 cụm dính vào mảng keo (bóng dính) giữa bàn. HÀNH ĐỘNG: nút Gravity xoay.
SAU: cả bàn đổ, nhưng cụm keo GIỮ NGUYÊN chỗ, không rơi theo.
Caption: "Cụm dính keo không rơi dù xoay — chướng ngại cứng đầu."
```

### C5 · Ô nam châm
```
THẺ CƠ CHẾ "Ô nam châm" (nhóm Hazard · rủi ro).
TRƯỚC: 1 ô nam châm phát từ trường; mảnh đang kéo gần đó. SAU: mảnh bị HÚT lệch 1 ô về phía nam châm khi thả.
Caption: "Nam châm hút mảnh đặt gần lệch về phía nó."
```

### C6 · Ô gai / cấm đặt
```
THẺ CƠ CHẾ "Ô gai" (nhóm Hazard).
TRƯỚC: vài ô gai (đỏ danger #F08A7E, chông). SAU: mảnh kéo qua vùng gai hiện viền đỏ "không đặt được", phải né.
Caption: "Ô gai cấm đặt lên — phải đi vòng."
```

### C7 · Đá rơi môi trường
```
THẺ CƠ CHẾ "Đá rơi" (nhóm Hazard).
TRƯỚC: đỉnh bàn có cảnh báo "sắp rơi đá" (telegraph). SAU: một dải đá xám rơi từ trên xuống lấp hàng trên, ép dọn.
Caption: "Đá tự dội từ trên mỗi vài lượt — sức ép endless/boss."
```

### C8 · Ô đổi trọng lực cục bộ
```
THẺ CƠ CHẾ "Ô đổi hướng" (nhóm Hazard · cao cấp).
TRƯỚC: 1 ô mũi tên tím (chỉ sang phải); một cụm chạm vào nó. SAU: riêng cụm đó đổi hướng rơi sang phải, lệch khỏi phần còn lại.
Caption: "Chạm ô đổi hướng, riêng cụm đó rơi theo hướng mới."
```

# D · MẢNH / KHAY

### D1 · Hold một mảnh
```
THẺ CƠ CHẾ "Giữ mảnh (Hold)" (nhóm Khay).
TRƯỚC: khay 3 mảnh + ô HOLD trống. HÀNH ĐỘNG: kéo 1 mảnh vào ô Hold.
SAU: mảnh nằm trong ô Hold chờ dùng sau; khay phát mảnh thế chỗ.
Caption: "Giữ tạm một mảnh để dành — gỡ thế bí."
```

### D2 · Preview 2 đợt khay
```
THẺ CƠ CHẾ "Xem trước 2 đợt" (nhóm Khay).
Vẽ HUD khay: hàng hiện tại 3 mảnh rõ nét + hàng "đợt sau" 3 mảnh mờ nhỏ phía trên.
Caption: "Nhìn trước đợt khay kế — lập kế hoạch xa hơn."
```

### D3 · Mảnh đá trong khay
```
THẺ CƠ CHẾ "Mảnh đá" (nhóm Khay).
TRƯỚC: khay gồm 2 mảnh jelly màu + 1 MẢNH ĐÁ xám (bắt buộc đặt). SAU: đặt mảnh đá xuống tạo chướng ngại cố định trên bàn.
Caption: "Khay xen mảnh đá — buộc đặt rác, tăng khó."
```

### D4 · Mảnh 2 màu
```
THẺ CƠ CHẾ "Mảnh hai màu" (nhóm Khay · rủi ro).
Vẽ khay có 1 mảnh 4 ô gồm 2 màu (2 vàng + 2 hồng). SAU: đặt xuống tách thành 2 nhóm màu khác nhau, khó gom đủ 9.
Caption: "Mảnh hai màu — gom màu thành thử thách."
```

### D5 · Khay 1 mảnh (hardcore)
```
THẺ CƠ CHẾ "Khay đơn" (nhóm Khay · cao cấp).
Vẽ HUD chế độ khó: chỉ MỘT ô mảnh thay vì ba, nhãn "HARDCORE".
Caption: "Phát từng mảnh một — chế độ cho cao thủ."
```

### D6 · Mảnh khổng lồ sự kiện
```
THẺ CƠ CHẾ "Mảnh khổng lồ" (nhóm Khay).
TRƯỚC: khay xuất hiện 1 mảnh CỠ LỚN (6 ô, mắt to, lấp lánh sự kiện). SAU: đặt xuống choán mảng lớn, đổi nhịp ván.
Caption: "Thỉnh thoảng một mảnh khổng lồ — khoảnh khắc đổi nhịp."
```

# E · MỤC TIÊU / luật thắng

### E1 · Escort (giải cứu)
```
THẺ CƠ CHẾ "Giải cứu" (nhóm Mục tiêu · cao cấp · rất chất riêng).
TRƯỚC: một ô JELLY THÚ đặc biệt (mắt to, biểu cảm lo) kẹt trên cao; cửa ra sáng ở đáy.
HÀNH ĐỘNG: nút Gravity xoay để mở lối.
SAU: bé jelly trượt theo trọng lực xuống tới cửa ra, biểu cảm vui, pháo hoa.
Caption: "Điều trọng lực đưa bé jelly tới cửa ra an toàn."
```

### E2 · Đào ô đích chôn sâu
```
THẺ CƠ CHẾ "Đào mục tiêu" (nhóm Mục tiêu).
TRƯỚC: ô đích (vòng tròn target) bị chôn dưới 3 lớp khối. SAU: xóa dần các lớp, ô đích lộ ra và được dọn, loé sáng.
Caption: "Bóc từng lớp để chạm ô đích bị chôn sâu."
```

### E3 · Đạt điểm KHÔNG xoay
```
THẺ CƠ CHẾ "Cấm xoay" (nhóm Mục tiêu).
Vẽ HUD mục tiêu "Đạt 500đ — KHÔNG dùng xoay", nút Gravity bị gạch chéo mờ; bàn đang ghi điểm bằng đặt mảnh thuần.
Caption: "Thử thách ngược: ghi điểm mà không được xoay."
```

### E4 · Clear theo màu chỉ định
```
THẺ CƠ CHẾ "Mục tiêu màu" (nhóm Mục tiêu).
Vẽ HUD "Xóa 12 ô MINT" + bộ đếm 5/12; vài ô mint trên bàn đang loé khi bị xóa, đếm tăng.
Caption: "Chỉ tính số ô đúng màu yêu cầu được xóa."
```

### E5 · Perfect clear
```
THẺ CƠ CHẾ "Dọn tuyệt đối" (nhóm Mục tiêu).
TRƯỚC: bàn còn vài khối cuối. SAU: nước cuối dọn SẠCH về 0 ô, toàn bàn loé vàng, popup lớn "PERFECT! ×bonus".
Caption: "Dọn bàn về đúng 0 ô — thưởng cực lớn."
```

# F · BOSS (đòn bổ sung cho khung boss · level-design mục 11)

### F1 · Boss hút trọng lực
```
THẺ CƠ CHẾ "Boss hút trọng lực" (nhóm Boss).
TRƯỚC: mặt boss jelly có mắt ở một cạnh, hào quang gravity tím; bàn trọng lực xuống.
HÀNH ĐỘNG: boss phát lực hút (telegraph chuông).
SAU: trọng lực bị kéo về phía boss, khối dồn về cạnh boss.
Caption: "Boss giành quyền trọng lực, kéo cả bàn về phía nó."
```

### F2 · Boss đóng băng vùng
```
THẺ CƠ CHẾ "Boss đóng băng" (nhóm Boss).
TRƯỚC: boss trên đỉnh; telegraph vùng băng. SAU: một mảng 3×3 phủ băng xanh nhạt, tạm không đặt được, nhãn "tan sau 3 lượt".
Caption: "Boss đóng băng một vùng bàn vài lượt."
```

### F3 · Boss khoá màu
```
THẺ CƠ CHẾ "Boss khoá màu" (nhóm Boss · cao cấp).
Vẽ HUD boss "Cấm tạo siêu khối MINT (2 lượt)"; biểu tượng màu mint bị ổ khoá; siêu khối mint mờ không kích được.
Caption: "Boss khoá một màu — chặn nguồn sát thương của bạn."
```

### F4 · Điểm yếu định vị
```
THẺ CƠ CHẾ "Điểm yếu boss" (nhóm Boss · cao cấp · nối merge).
TRƯỚC: thân boss có 1 Ô ĐIỂM YẾU sáng nhấp nháy; người chơi có 1 siêu khối sẵn.
SAU: nổ siêu khối ĐÚNG ô điểm yếu → boss trúng đòn lớn, thanh máu tụt mạnh, mặt boss nhăn.
Caption: "Phải nổ siêu khối trúng điểm yếu mới gây sát thương lớn."
```

### F5 · Boss nhiều pha
```
THẺ CƠ CHẾ "Boss đổi pha" (nhóm Boss · cao cấp).
Vẽ 2 trạng thái boss cạnh nhau: Pha 1 (máu đầy, biểu cảm thường, đòn "đổ rác") → mũi tên "mất nửa máu" → Pha 2 (máu nửa, mắt giận, đòn "xoay trọng lực").
Caption: "Mất nửa máu, boss đổi bộ đòn sang pha 2."
```

### F6 · Phản công thông minh
```
THẺ CƠ CHẾ "Boss phản công" (nhóm Boss · rủi ro).
TRƯỚC: người chơi vừa xóa cột 4 (loé). HÀNH ĐỘNG: boss nhắm cột 4. SAU: boss dội đá đúng cột 4 vừa trống.
Caption: "Boss dội đá vào đúng cột bạn vừa dọn — cẩn thận ức chế."
```

# G · META / juice / power-up

### G1 · Buff roguelite (chọn 1 trong 3)
```
THẺ CƠ CHẾ "Buff trọng lực" (nhóm Meta · cao cấp).
Vẽ màn CHỌN BUFF: 3 thẻ bài jelly úp-mở — "+1 lượt xoay/màn" · "Siêu khối ngưỡng 6" · "Nổ to hơn +1 ô". Mỗi thẻ icon + tên Fredoka + mô tả Nunito.
Caption: "Đầu chặng, chọn 1 buff — đều xoay quanh trọng lực."
```

### G2 · Power-up tiêu thụ (rewarded ad)
```
Vẽ THANH POWER-UP đáy HUD: 4 nút pill — Búa (phá 1 ô) · Xóa hàng (chọn 1 hàng) · Đổi màu (1 cụm) · +1 Xoay. Mỗi nút icon + badge số lượng + nhãn "Xem QC +1" (rewarded).
Caption: "Power-up tiêu thụ, nạp thêm bằng xem quảng cáo thưởng."
```

### G3 · Daily seed challenge
```
Vẽ thẻ "THỬ THÁCH HÔM NAY": cùng một bàn seed cho mọi người, nhãn ngày, nút "Chơi" cam, bảng xếp hạng bạn bè offline mini bên dưới.
Caption: "Một bàn mỗi ngày, cùng seed — so tài offline."
```

### G4 · Streak ngày
```
Vẽ widget chuỗi ngày: 7 ô tròn jelly, ô đã điểm danh tô màu + sao, ô hôm nay pulse "Điểm danh +thưởng".
Caption: "Chuỗi ngày chơi liên tục — giữ lửa quay lại."
```

---

*Pool ý tưởng nguồn: `mechanics-ideas.md`. Tokens & style: `design/Gravity Jelly Design System/uploads/00-shared-index.md`. Khi chốt cơ chế nào, có thể gắn vào màn cụ thể ở `docs/levels/`.*
