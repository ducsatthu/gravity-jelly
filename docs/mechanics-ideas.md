# Mechanics Ideas — Kho ý tưởng cơ chế (Gravity Jelly)

Kho brainstorm **mọi ý tưởng cơ chế** quanh lõi (trọng lực xoay · vật lý cụm cứng · block-fit · cụm có số/màu). KHÔNG phải tất cả sẽ dùng — đây là pool để lọc. Đã có riêng: **merge-9 → siêu khối** (`_level-spec.md`).

**Nhãn:** `[lõi]` hợp ngay, nhẹ, làm modifier được · `[cao cấp]` mạnh, để late-game/boss · `[rủi ro]` căng với "casual / một cơ chế chữ ký", cân nhắc kỹ. Mọi ý đều ghi **neo** = nó dựa vào phần lõi nào.

---

## A. Biến tấu TRỌNG LỰC (sân nhà — đào sâu nhất)

- **A1. Xoay 90°** — core đã chốt. Neo: chữ ký.
- **A2. Xoay 180° (lật ngược)** — đảo cả bàn 1 phát, tốn 2 ngân sách. Neo: chữ ký. `[lõi]`
- **A3. Trọng lực chéo (về 1 góc)** — cụm dồn về góc, tạo combo lạ. Neo: chữ ký. `[cao cấp]`
- **A4. Trọng lực điểm (hút về 1 ô tâm)** — mọi cụm rơi về tâm. Rất lạ mắt. Neo: chữ ký. `[cao cấp]` boss-tier.
- **A5. Bàn chia vùng trọng lực** — nửa bàn hút xuống, nửa hút lên. Neo: chữ ký. `[rủi ro]` khó đọc.
- **A6. Đảo trọng lực tự động mỗi N lượt** — môi trường ép nhịp (dùng cho boss "Tham Trọng Lực"). Neo: chữ ký. `[lõi]`
- **A7. Zero-G tạm thời** — mảnh đứng yên chỗ đặt vài lượt rồi mới rơi (chủ đề Vũ trụ). Neo: chữ ký. `[cao cấp]`
- **A8. Hồi ngân sách xoay theo combo — ✅ CHỐT, áp dụng MỌI cách chơi.** Mỗi lần **bậc combo tăng lên mức ≥ x2** → hồi **+1 lượt xoay** (x2 = +1, x3 = tổng +2, x4 = tổng +3…; hồi cộng dồn = bậc − 1). Vòng thưởng dùng đúng cơ chế chữ ký. Cân nhắc trần hồi/chặng để tránh xoay vô hạn. Là hàm thuần của chuỗi combo → giữ deterministic. Neo: chữ ký + combo. Chi tiết: business-understanding §6.
- **A9. Khoá xoay tạm** — vài lượt cấm xoay (đòn boss / modifier căng). Neo: chữ ký. `[lõi]`
- **A10. Xoay cục bộ** — chỉ 1 cụm được chọn đổi hướng rơi, không cả bàn. Neo: chữ ký + cụm. `[rủi ro]` lệch tinh thần "cả bàn đổ".

## B. CỤM / MÀU / payoff (ngoài merge-9)

- **B1. Combo meter leo thang** — chuỗi clear liên tiếp nhân điểm tăng dần, reset khi đứt. Neo: combo. `[lõi]`
- **B2. Color-clear bonus** — xóa hàng/cột **toàn 1 màu** → thưởng đặc biệt (không cần đủ 9). Neo: màu. `[lõi]`
- **B3. Wild block (ô cầu vồng)** — ghép màu nào cũng được, giúp gom siêu khối. Neo: màu/cụm. `[lõi]`
- **B4. Siêu khối cấp 2** — gộp 2 siêu khối → "đại nổ": quét cùng màu toàn bàn + vùng 5×5 quanh tâm. Escalation. Neo: merge. `[cao cấp]`
- **B5. Cụm nặng đè vỡ** — cụm số lớn rơi đè vỡ ô yếu/băng bên dưới. Neo: cụm. `[lõi]` (đã trong pool)
- **B6. Ô nhuộm màu** — nhuộm các ô kề sang màu nó, hỗ trợ gom màu. Neo: màu. `[rủi ro]` dễ rối.
- **B7. Mầm tách màu** — xóa cụm để lại 1 mầm màu khác, nuôi chuỗi mục tiêu. Neo: màu. `[cao cấp]`

## C. Ô ĐẶC BIỆT / hazard (mở rộng modifier pool)

*Đã có trong pool:* ô băng (xóa 2 lần), ô khoá (combo kề mở), tường 1 chiều, ẩn preview, ô bom (nổ lan), đá nở, ô trượt, cụm nặng, cấm hướng xoay.

- **C1. Ô xích** — 2 ô nối nhau, phải xóa cùng lúc. Neo: block-fit. `[lõi]`
- **C2. Ô đếm ngược** — không xóa trong N lượt → hóa đá cứng. Neo: ép nhịp. `[lõi]`
- **C3. Ô cổng (portal)** — cụm rơi vào cổng A ra cổng B. Câu đố trọng lực hay. Neo: chữ ký. `[cao cấp]`
- **C4. Ô keo (sticky)** — cụm dính, không rơi tiếp dù xoay. Neo: chữ ký/cụm. `[lõi]`
- **C5. Ô nam châm** — hút mảnh đặt gần lệch về phía nó. Neo: block-fit. `[rủi ro]`
- **C6. Ô gai / cấm đặt** — không cho đặt lên, phải né. Neo: block-fit. `[lõi]`
- **C7. Đá rơi môi trường** — đá tự dội từ trên mỗi vài lượt (endless/boss). Neo: ép nhịp. `[lõi]`
- **C8. Ô đổi trọng lực cục bộ** — chạm vào, riêng cụm đó đổi hướng rơi. Neo: chữ ký. `[cao cấp]`

## D. MẢNH / KHAY (tray & piece)

- **D1. Hold 1 mảnh để dành** (như Tetris) — buff casual, giảm bí. Neo: block-fit. `[lõi]`
- **D2. Preview 2 đợt khay** — nhìn xa hơn = buff; "ẩn preview" là phản đề. Neo: block-fit. `[lõi]`
- **D3. Mảnh xám/đá trong khay** — buộc đặt rác, tăng khó. Neo: block-fit. `[lõi]`
- **D4. Mảnh 2 màu** — 1 mảnh 4 ô gồm 2 màu, gom màu khó hơn. Neo: màu. `[rủi ro]`
- **D5. Khay 1 mảnh (hardcore)** — chế độ khó: phát từng mảnh. Neo: block-fit. `[cao cấp]`
- **D6. Mảnh khổng lồ sự kiện** — thỉnh thoảng 1 mảnh 5–6 ô, đổi nhịp. Neo: block-fit. `[lõi]`

## E. MỤC TIÊU / luật thắng (goal cycle mở rộng)

*Đã có:* dọn sạch · clear ô đích · đạt điểm · combo chain · make_mega · boss · sống sót.

- **E1. Escort (giải cứu)** — đưa 1 ô jelly đặc biệt xuống cửa ra nhờ điều trọng lực. Neo: chữ ký. `[cao cấp]` rất "chất riêng".
- **E2. Đào ô đích chôn sâu** — ô mục tiêu nằm dưới nhiều lớp, phải bóc. Neo: block-fit. `[lõi]`
- **E3. Đạt điểm KHÔNG xoay** — thử thách ngược, dạy giá trị nút xoay. Neo: chữ ký. `[lõi]`
- **E4. Clear theo màu chỉ định** — chỉ xóa đủ X ô màu Y. Neo: màu. `[lõi]`
- **E5. Perfect clear** — dọn bàn về đúng 0 ô → thưởng lớn. Neo: block-fit. `[lõi]`

## F. BOSS (bổ sung đòn cho khung boss ở level-design mục 11)

- **F1. Boss hút trọng lực về phía nó** — biến thể "Tham Trọng Lực". Neo: chữ ký. `[lõi]`
- **F2. Boss đóng băng 1 vùng bàn** — vùng tạm không đặt được. Neo: hazard. `[lõi]`
- **F3. Boss khoá màu** — cấm tạo siêu khối màu X vài lượt. Neo: màu/merge. `[cao cấp]`
- **F4. Điểm yếu định vị** — phải nổ siêu khối **đúng ô điểm yếu** mới ăn damage. Neo: merge. `[cao cấp]`
- **F5. Boss nhiều pha** — mất nửa máu thì đổi bộ đòn. Neo: boss. `[cao cấp]`
- **F6. Phản công thông minh** — boss dội đá vào đúng cột bạn vừa xóa. Neo: hazard. `[rủi ro]` dễ gây ức chế.

## G. META / juice / roguelite nhẹ (sau MVP)

- **G1. Buff roguelite quanh trọng lực** — "+1 xoay/màn", "ngưỡng siêu khối 6", "nổ to hơn", "combo hồi xoay". Neo: chữ ký. `[cao cấp]`
- **G2. Power-up tiêu thụ (hợp rewarded ad)** — búa phá 1 ô · xóa 1 hàng tùy ý · đổi màu 1 cụm · +1 xoay. Neo: nhiều. `[lõi]` doanh thu.
- **G3. Daily seed challenge** — đã có kế hoạch. Neo: deterministic. `[lõi]`
- **G4. Streak ngày / chuỗi thắng** — retention. `[lõi]`

---

## Gợi ý ưu tiên (đọc nhanh)

- **Nên làm sớm, ít rủi ro:** A2, A8, A9, B1, B2, B3, C1, C2, C7, D1, D2, E2, E3, E5, G2.
- **Để dành tạo điểm nhấn (cao cấp):** A4, A7, B4, C3, E1 (escort — rất khác biệt), F4.
- **Cân nhắc kỹ vì lệch casual / một cơ chế:** A5, A10, B6, C5, D4, F6.

**Nguyên tắc lọc:** mỗi ý phải trả lời được "*nó làm cú XOAY hoặc cụm cùng màu thú vị hơn thế nào?*". Nếu không neo vào trọng lực/cụm → để ngoài, tránh phình thành hệ thống thứ hai.
