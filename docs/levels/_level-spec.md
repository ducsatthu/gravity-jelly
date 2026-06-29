# Level Spec — Format chuẩn cho thiết kế màn thủ công

Schema dùng chung cho mọi file `world-XX-*.md`. Mọi màn đặc tả theo **đúng các trường dưới**, theo thứ tự này. Bám core loop `../business-understanding.md`.

## Quyết định đã chốt (ảnh hưởng format)

- **Màu là chiến thuật.** Mỗi mảnh khay mang **1 trong 4 màu** jelly (Vàng/Mint/Hồng/Xanh). Người chơi chủ động **gom ô cùng màu, dính liền** để tạo siêu khối. Màu KHÔNG còn chỉ trang trí.
- **Hàng/cột đầy ĐƠN SẮC** (9 ô cùng màu) → **SIÊU KHỐI tại tâm đường** (KHÔNG xóa) — ưu tiên xử lý
  **TRƯỚC** xóa thường; **thưởng ×2 điểm**. Có super-1 trong đường → cấp 2. *(Ghi đè thẻ B2 cũ: B2 từng
  quy định hàng đơn sắc → Khối Cầu Vồng + ×2 điểm; nay đổi sang ghép siêu khối + ×2 điểm.)*
- **Tính điểm nền = xóa hàng/cột đầy** (mixed màu) như khối cổ điển — xử lý sau PHA siêu-khối-đơn-sắc.
- **Merge (sau khi không còn dòng đầy):**
  - **3×3 cùng màu** → **SIÊU KHỐI cấp 1** (mắt to, phát sáng) → bị cuốn vào lần xóa kế → **quét sạch MỌI ô cùng màu trên toàn bàn** (dây chuyền).
  - **3×3 ba màu — mỗi màu 1 cột HOẶC 1 hàng** → **KHỐI CẦU VỒNG**. Khi bị cuốn vào xóa → **nổ quét sạch các MÀU đang KỀ (4-kề) cầu vồng** trên toàn bàn (kề ít màu thì quét ít); animation **highlight các ô sắp quét rồi mới quét**, cầu vồng biến mất cuối.
  - **SIÊU KHỐI cấp 2** — hình thành 1 trong 3 cách: **(a)** ≥2 siêu-khối-1 cùng màu dính liền; **(b)** ô vuông **3×3 đồng màu có chứa ≥1 siêu-khối-1**; **(c)** hàng/cột đơn sắc chứa ≥1 super-1. Khi bị cuốn vào xóa: **quét sạch cùng màu toàn bàn + thêm vùng 5×5 quanh tâm**.
  - 3×3 lộn xộn khác (không mono, không sọc-3-màu) → KHÔNG làm gì. Trọng lực vẫn là cơ chế chữ ký; siêu khối là **tầng thưởng của hệ cụm**, không phải match-3 thứ hai.
- **Điểm & combo khi GHÉP:** mỗi lần ghép (siêu khối/cầu vồng) **combo +1** và cộng điểm = **số ô × combo** (×2 nếu là hàng/cột đơn sắc). Trước đây ghép không tính điểm/combo — nay có.

## Quy ước toạ độ & vocab (không lặp lại trong từng màn)

- `(cột, hàng)`, 0–8, gốc trên-trái. Trọng lực mặc định = **xuống** (về hàng 8).
- Màu viết tắt: **V**=Vàng · **M**=Mint · **H**=Hồng · **X**=Xanh.
- Vocab mảnh (người chơi KHÔNG tự xoay): `1 · I2 I3 I4 I5 · V3(dọc cao 3) · L3 L4 J4 · T4 · S4 Z4 · O4(2×2) · P5(chữ thập)`. Mảnh ghi kèm màu: `I4·M`, `O4·H`…
- Loại ô preset: `block(màu) · stone(đá, không màu) · target(ô đích) · lock(ô khoá) · ice(ô băng)`.

## Các trường của MỘT màn

| Trường | Bắt buộc | Ghi chú |
|--------|----------|---------|
| **ID · Tên** | ✓ | số màn + tên gợi cảm xúc |
| **Dạy** | ✓ | **đúng 1** cơ chế/biến tấu mới của màn |
| **Aha** | ✓ | khoảnh khắc cảm xúc phải thấy |
| **Board** | ✓ | preset: list `(x,y,loại,màu)`; "trống" nếu rỗng |
| **Trọng lực · rotationBudget** | ✓ | hướng đầu + số lần xoay cho phép (0 = khoá) |
| **Merge** | ✓ | `off` hoặc `on` (hình thành khi **3×3 cùng màu**; dòng đầy xóa trước); nổ cấp 1 = quét cùng màu toàn bàn, cấp 2 = cùng màu + 5×5 |
| **Khay (waves)** | ✓ | từng đợt 3 mảnh **kèm màu**, theo thứ tự deterministic |
| **Mục tiêu** | ✓ | `clear_all · clear_targets(n) · reach_score(s) · combo_chain(n) · make_mega(màu,k) · boss(...)` |
| **Giải dự kiến** | ✓ | 1–2 câu đường giải chính (để solver đối chiếu) |
| **Sao** | ✓ | metric (`moves·score·combo`) + ngưỡng 3★/2★/1★ — *ứng viên, solver chốt* |
| **Color goal** | tùy | khi màn yêu cầu màu cụ thể, vd "1 siêu khối Vàng" |
| **Boss** | chỉ màn 10 | `archetype · winMode · bossHP/surviveTurns · threatInterval · attacks` |

## Vị trí mở khoá theo world (curriculum cập nhật)

Màu phát ra từ W1 (chỉ trực quan tới khi merge mở). **Mỗi world vẫn đúng 1 cơ chế mới:**

| World | Cơ chế mới chốt |
|-------|------------------|
| 1 Đồng cỏ | đặt mảnh + xóa hàng/cột (merge **off**, màu trực quan) |
| 2 Rừng rậm | **xoay trọng lực** (cơ chế chữ ký) |
| 3 Sông & Thác | combo cascade **+ mở SIÊU KHỐI** (gom 9 cùng màu → nổ) ⟵ *điểm vào sớm của merge* |
| 4 Sa mạc | đá cố định (chướng ngại tĩnh) |
| 5 Bãi biển | goal điểm số trong số nước giới hạn |
| 6 Núi tuyết | ô băng (xóa 2 lần) |
| 7 Hang băng | tường một chiều + ô khoá |
| 8 Núi lửa | ô bom + đá nở |
| 9 Bầu trời | ẩn preview + ô trượt |
| 10 Vũ trụ | tổng hợp + cấm một hướng xoay |

> Siêu khối mở ở **W3** (sau khi đã có xoay W2 + combo) — sớm nhưng đủ nền tảng. Từ W3 trở đi, **siêu khối là nguồn sát thương boss chính**.

---

## Màn mẫu A — L1 "Hàng đầu tiên" (format mới, merge off)

- **Dạy:** đặt mảnh + xóa hàng. **Aha:** hàng đầy loé sáng + nổ + rung.
- **Board:** trống.
- **Trọng lực:** xuống · **rotationBudget:** 0 · **Merge:** off.
- **Khay:** W1 `[I5·V, I4·M, I3·H]`.
- **Mục tiêu:** `clear_all`.
- **Giải dự kiến:** I5·V cột 0–4 + I4·M cột 5–8 ở đáy → đầy hàng 8 → xóa (I3 dư).
- **Sao (moves):** 3★=2 · 2★=3 · 1★=3.

## Màn mẫu B — L21 "Giọt nước lớn" (W3, mở SIÊU KHỐI)

- **Dạy:** gom 9 ô **cùng màu** → siêu khối → nổ. **Aha:** 9 khối Mint nhập thành 1 quả cầu mắt to rồi nổ tung **quét sạch mọi khối Mint** trên bàn.
- **Board:** preset 6 ô Mint dính nhau ở đáy-trái: `(0,8)(1,8)(2,8)(0,7)(1,7)(2,7)` đều `block·M`.
- **Trọng lực:** xuống · **rotationBudget:** 1 · **Merge:** on.
- **Khay:** W1 `[V3·M, I3·M, L3·H]`.
- **Color goal:** tạo **1 siêu khối Mint**.
- **Mục tiêu:** `make_mega(M, 1)` rồi kích nổ để `clear_targets`.
- **Giải dự kiến:** thêm 3 ô Mint cho khối Mint đạt 9 (3×3) → hợp nhất; xóa 1 hàng chạm nó → quét sạch mọi ô Mint (gồm ô đích).
- **Sao (moves):** 3★=3 · 2★=4 · 1★=5.

---

Khi format này ổn, tôi áp cho **toàn bộ** rồi viết tiếp World 2 → World 10.
