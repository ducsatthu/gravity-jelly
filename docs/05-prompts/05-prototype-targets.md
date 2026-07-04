# Prompts cho Claude Design — PROTOTYPE CHƠI ĐƯỢC: Dây leo (W2) & Giọt nước (W3)

Hai prompt dựng **prototype tương tác** (React, chơi thử bằng chuột/ngón) để **cảm nhận cách chơi**
màn *Phá gốc dây leo* (World 2) và *Phá giọt nước* (World 3). Mục tiêu: hiểu vòng lặp gameplay, **chưa
cần đẹp hoàn chỉnh** — ưu tiên **chơi được + đúng luật**. Bám nhẹ tokens Gravity Jelly cho dễ nhìn.

> Luật gốc chung (cả 2): **đặt mảnh từ khay → lấp đầy hàng/cột thì XÓA → xoay trọng lực 90° để dồn
> cả bàn → xóa xong khối trên SỤP theo trọng lực tạo CASCADE**. "Ô đích" (gốc dây / giọt nước) bị
> **phá khi có hàng/cột xóa đi qua nó**. Thắng = phá hết ô đích. Thua = không còn chỗ đặt mảnh.

Chạy **từng prompt riêng** (mỗi cái là 1 prototype độc lập). Có thể chạy Prompt 0 trước cho tokens.

> ⚠️ **LỊCH SỬ — luật vine ở đây là bản PROTOTYPE ĐỜI ĐẦU (đã dùng), ĐÃ LỖI THỜI.** Cơ chế vine
> hiện tại đã tiến hoá (mô hình 5 phần, MINT-only phá gốc, cắt rời → **rác đếm ngược** chứ không
> biến mất, mỗi gốc **1 mầm/lượt**, hoãn mọc sau nhát cắt). Logic chính thức: `../../02-thiet-ke-man/06-world-2-vine.md`
> + `../../02-thiet-ke-man/02-he-muc-tieu.md §8`. Đừng đọc phần dưới như spec hiện hành.

---

## Prompt 0 — Tokens & khung chung (tuỳ chọn, dán trước cho đẹp)

```
Tôi cần một PROTOTYPE game puzzle CHƠI ĐƯỢC bằng React (mobile dọc ~360×800), tương tác bằng chuột.
Ưu tiên LOGIC ĐÚNG + chơi được, thẩm mỹ vừa đủ. Style "jelly pastel": nền kem #FFF7EC, ô bo tròn viền
dày, 4 màu khối vàng #FFE3A3 / mint #A3E5D9 / hồng #F7A9C0 / xanh #B3C7F7, chữ #5B4636, accent tím
"gravity" #7E6CF0, success #6FCF7F, danger #F08A7E. Font rounded (Fredoka/Nunito nếu có).
Lưới 9×9, ô ~34px. Tôi sẽ mô tả LUẬT cụ thể ở prompt sau — hãy hiện thực đúng luật đó, có thể chơi vài
nước để kiểm chứng. Cho tôi state hiển thị: lượt đã đi, mục tiêu còn lại, nút Xoay + số lượt xoay, nút Chơi lại.
```

---

## PROMPT VINE — Prototype "Phá gốc Dây leo" (World 2)

```
Dựng một PROTOTYPE React CHƠI ĐƯỢC cho màn puzzle "Phá gốc Dây leo". Mobile dọc, tương tác chuột.

BÀN & ĐIỀU KHIỂN
- Lưới 9×9 (ô 34px, gap 2px), toạ độ (cột 0–8, hàng 0–8), trọng lực mặc định = XUỐNG (về hàng 8).
- Khay 3 mảnh dưới bàn. Mảnh dùng: I3 ngang (3 ô), V3 dọc (3 ô), O4 (2×2), 1 (1 ô). Mỗi mảnh 1 màu.
- Tương tác: CLICK 1 mảnh trong khay để chọn → CLICK 1 cột trên bàn để thả (mảnh rơi theo trọng lực,
  dừng ở điểm chạm đầu tiên, KHÔNG xuyên khe). Đặt hết 3 mảnh → phát khay mới (ngẫu nhiên có seed cố định).
- Nút "XOAY ↺": đổi hướng trọng lực 90° (xoay vòng: xuống→trái→lên→phải). Cả bàn dồn lại theo hướng mới.
  Có SỐ LƯỢT XOAY còn lại (bắt đầu = 2). Combo ≥ ×2 hồi +1 lượt xoay.

LUẬT XÓA & CASCADE (giống block-fit + trọng lực)
- Khi một HÀNG hoặc CỘT đầy đủ 9 ô → xóa hàng/cột đó. Xóa nhiều dòng cùng lúc / xóa liên tiếp qua các
  nước = COMBO ×2, ×3… (hiện popup ×N). Sau khi xóa, các ô còn lại SỤP theo trọng lực → có thể tạo dây chuyền.

CƠ CHẾ DÂY LEO (điểm mấu chốt của màn này)
- Bàn khởi đầu có 2 GỐC DÂY LEO (ô màu xanh lá đậm, có viền nhấn + icon mầm), ví dụ ở (2,8) và (6,8).
  Mỗi gốc là đầu một CHUỖI ĐỐT dây leo (ban đầu chỉ có gốc, chưa có đốt).
- MỌC: cứ mỗi 2 LƯỢT đặt mảnh, MỖI dây mọc thêm 1 ĐỐT (ô xanh lá nhạt hơn gốc) từ ĐẦU DÂY (đốt mới
  nhất, ban đầu là gốc) sang 1 ô TRỐNG kề, theo thứ tự hướng cố định: TRÊN → PHẢI → XUỐNG → TRÁI (lấy ô
  trống đầu tiên). Nếu không có ô trống kề → dây ngừng mọc lượt đó. (Deterministic.)
- BÁM CỨNG: ô dây leo (gốc + đốt) KHÔNG rơi khi xoay trọng lực và không sụp khi cascade — nó đứng yên
  như rễ. (Mọi thứ khác vẫn đổ.)
- Đốt/gốc VẪN tính là ô đầy khi xét hàng/cột đủ 9 để xóa.
- DIỆT:
  • Nếu hàng/cột bị xóa ĐI QUA một GỐC → CẢ DÂY của gốc đó biến mất (gốc + mọi đốt).
  • Nếu xóa đi qua một ĐỐT thường (không phải gốc) → chỉ đốt đó mất; đốt nào mất kết nối với gốc thì
    "khô héo" thành ô trống ở cuối lượt.

MỤC TIÊU / THẮNG THUA
- MỤC TIÊU: phá hết 2 GỐC. HUD hiện "Còn: 2 gốc" (đếm giảm).
- THẮNG: 0 gốc còn lại → hiện "HOÀN THÀNH".
- THUA: không đặt được mảnh nào trong khay (dây mọc bịt bàn) → hiện "KẸT — Chơi lại".

HIỂN THỊ / KIỂM CHỨNG
- HUD trên: mục tiêu (còn N gốc) · bộ đếm LƯỢT đã đi · cảnh báo nhỏ "sắp mọc" ở lượt trước khi mọc.
- Nút Xoay + badge số lượt. Nút "Chơi lại". Popup combo ×N khi xóa.
- Cho người chơi thấy RÕ: dây mọc dần, và khi xóa 1 hàng qua gốc thì cả dây tan.
- Gợi ý thế mở màn dễ thắng: 2 gốc ở hàng đáy (2,8) và (6,8); người chơi lấp đầy hàng 8 để xóa → diệt
  cả 2 gốc cùng lúc (combo). Đảm bảo có đường thắng trong ~4–6 nước trước khi dây mọc quá nhiều.

Hãy hiện thực ĐÚNG các luật trên, chơi thử vài nước để chắc nó chạy, rồi giao prototype cho tôi bấm thử.
```

---

## PROMPT DROP — Prototype "Phá Giọt nước" (World 3)

```
Dựng một PROTOTYPE React CHƠI ĐƯỢC cho màn puzzle "Phá Giọt nước". Mobile dọc, tương tác chuột.
Cùng khung block-fit + trọng lực xoay như trên (đặt mảnh, xóa hàng/cột đầy, xoay 90°, cascade, combo).

BÀN & ĐIỀU KHIỂN: y hệt prototype Dây leo (lưới 9×9, khay 3 mảnh I3/V3/O4/1, click chọn → click cột
để thả, nút XOAY + số lượt = 3, combo hồi xoay, popup ×N).

CƠ CHẾ GIỌT NƯỚC (điểm mấu chốt)
- Bàn có 3 GIỌT NƯỚC (ô màu xanh ngọc, icon giọt) là Ô ĐÍCH cần phá. Giọt là ô thường về vật lý:
  RƠI theo trọng lực và SỤP khi cascade (khác dây leo — dây leo bám cứng, giọt thì trôi theo nước).
- DIỆT GIỌT: khi một HÀNG/CỘT bị xóa ĐI QUA giọt → giọt bị phá (đếm giảm).
- GIỌT CHÔN SÂU: 1 giọt bị CHÔN — phía trên nó (cùng cột) có sẵn vài ô KHỐI/ĐÁ đè lên (đá = ô xám
  không xóa bằng đầy hàng, chỉ dịch khi cascade). Muốn phá giọt chôn: phải xóa các hàng chung quanh để
  CASCADE làm khối trên sụp/đổi chỗ, đưa giọt lên vị trí có thể nằm trong một hàng/cột xóa được.
  → Dạy dùng cascade (nước chảy) để "moi" giọt ra.

(TUỲ CHỌN — DÒNG CHẢY) Nếu muốn thêm chất World 3: đánh dấu 1 HÀNG là "dòng chảy" (mũi tên →). Sau mỗi
lượt, mọi ô nằm trên hàng đó DỊCH 1 Ô sang phải (ô ra mép thì dừng, rồi chịu trọng lực). Dùng để đẩy
giọt tới chỗ xóa. NẾU thấy rối, BỎ phần dòng chảy — cốt lõi màn vẫn là phá giọt bằng xóa + cascade.

MỤC TIÊU / THẮNG THUA
- MỤC TIÊU: phá hết 3 GIỌT. HUD "Còn: 3 giọt" (đếm giảm; giọt chôn hiện icon mờ + ổ khoá cho tới khi lộ).
- THẮNG: 0 giọt → "HOÀN THÀNH". THUA: không đặt được mảnh → "KẸT — Chơi lại".

HIỂN THỊ / KIỂM CHỨNG
- HUD: còn N giọt · lượt đã đi · nút Xoay + badge · nút Chơi lại · popup combo ×N.
- Thể hiện rõ: (1) xóa hàng qua giọt lộ → giọt vỡ; (2) giọt chôn cần cascade để lộ rồi mới phá được.
- Gợi ý thế mở màn: 2 giọt để lộ ở hàng 8 (dễ phá bằng lấp đầy hàng), 1 giọt chôn ở (4,6) với 2 ô đá
  đè trên (4,4)(4,5); người chơi xóa hàng 7/8 để cascade hạ giọt xuống rồi phá. Đảm bảo có đường thắng ~5–7 nước.

Hãy hiện thực ĐÚNG luật trên, chơi thử vài nước, rồi giao prototype cho tôi bấm thử.
```

---

## Ghi chú khi duyệt prototype

- **So sánh cảm giác:** Dây leo = *đua với thời gian* (dây mọc, bám cứng, cắt gốc). Giọt nước = *câu đố
  vị trí* (không sức ép, dùng cascade moi giọt chôn). Hai màn khác "vị" dù cùng luật "xóa qua ô đích".
- Nếu prototype cho thấy dây leo mọc quá nhanh → chỉnh "mỗi 3 lượt mọc 1 đốt". Nếu giọt chôn quá khó →
  giảm số lớp đá đè.
- Chốt xong cảm giác từ prototype, mình sẽ cập nhật lại `../../02-thiet-ke-man/02-he-muc-tieu.md` + `:core` cho khớp.
```
