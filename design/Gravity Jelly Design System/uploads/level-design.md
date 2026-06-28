# Level Design — Gravity Jelly (Campaign 100 màn + Map)

Tài liệu thiết kế chế độ **Campaign**: 100 màn deterministic từ dễ tới khó, một **bản đồ đường đi kiểu Candy Crush**, và một **bộ khung cảnh nền hành trình thiên nhiên** đổi dần theo world, mở khoá tuần tự.

Tài liệu này bám sát cơ chế cốt lõi ở `business-understanding.md` (xoay trọng lực, vật lý cụm cứng, combo dây chuyền, ngân sách xoay hữu hạn) và yêu cầu deterministic + kiến trúc 3 lớp ở `technical-approach.md`. Bảng dữ liệu chi tiết từng màn nằm ở `level-design-100-levels.xlsx` (cùng thư mục).

## 1. Nguyên tắc thiết kế

Campaign là "lớp chất riêng" deterministic chạy song song với Endless. Mỗi màn là một câu đố dựng sẵn có lời giải, không phải run ngẫu nhiên. Bốn nguyên tắc:

1. **Mỗi màn có nghiệm, được solver xác nhận.** Bàn dựng sẵn + chuỗi mảnh cố định + ngân sách xoay hữu hạn ⇒ không gian trạng thái đủ nhỏ để BFS/IDA* trên `:core` tìm lời giải và đo số nước tối thiểu.
2. **Dạy một cơ chế mỗi lúc.** Người chơi không bị ném vào đủ thứ; mỗi world mở thêm đúng một lớp cơ chế mới rồi mới chồng lên.
3. **Đường cong khó tăng đều, có nhịp nghỉ.** Tăng dần trong mỗi world, một màn "breather" dễ thở ở giữa, một màn "boss" căng cuối world — đúng nhịp giữ chân kiểu match-3.
4. **Tái dùng đúng một engine màn.** Cùng định dạng dữ liệu (bàn + chuỗi mảnh + mục tiêu + ngân sách xoay) dùng chung cho Campaign và Daily Challenge. Làm xong Campaign là gần như có sẵn Daily.

## 2. Cấu trúc 10 world × 10 màn

100 màn chia thành 10 world, mỗi world là một cảnh nền thiên nhiên và **giới thiệu một cơ chế chữ ký mới**:

| World | Cảnh nền | Màn | Cơ chế mới | Mục tiêu chính | Xoay |
|------|----------|-----|-----------|----------------|:---:|
| W1 | Đồng cỏ | 1–10 | Đặt mảnh + xóa hàng/cột (cơ bản) | Dọn sạch | 0 |
| W2 | Rừng rậm | 11–20 | Vật lý cụm kẹt + cú xoay đầu tiên | Dọn sạch | 1 |
| W3 | Sông & Thác | 21–30 | Combo dây chuyền + ô đích (giọt nước) | Clear ô đích | 1–2 |
| W4 | Sa mạc | 31–40 | Đá cố định làm chướng ngại | Clear ô đích | 1–2 |
| W5 | Bãi biển | 41–50 | Mục tiêu điểm trong số nước giới hạn | Đạt điểm | 2 |
| W6 | Núi tuyết | 51–60 | Quản lý ngân sách xoay (2–3 lần đúng nhịp) | Dọn sạch | 2–3 |
| W7 | Hang băng | 61–70 | Nhiều đá + cụm khởi đầu to | Clear ô đích | 1–2 |
| W8 | Núi lửa | 71–80 | Mật độ bàn cao, ít xoay → căng | Đạt điểm | 0–1 |
| W9 | Bầu trời | 81–90 | Tổng hợp mọi cơ chế | Hỗn hợp | 2–3 |
| W10 | Vũ trụ | 91–100 | Chuyên gia, ngưỡng sao gắt | Hỗn hợp | 1–2 |

Lưới vẫn là **9×9 cố định**; độ khó đến từ độ phủ bàn ban đầu, độ khó chuỗi mảnh, số đá, số ô đích, độ chặt của ngân sách xoay, và ngưỡng sao — không đổi kích thước lưới.

## 3. Bản đồ đường đi (kiểu Candy Crush)

Một **bản đồ dọc cuộn** đi xuyên qua cảnh thiên nhiên. Người chơi đi từ node này sang node kế tiếp trên một con đường uốn lượn; mỗi node là một màn.

Quy ước node:

- **Node thường** — màn chuẩn. Hiện 0–3 sao đã đạt.
- **Node breather** (vị trí thứ 6 mỗi world) — màu nhạt, dễ thở, để người chơi "thắng cho sướng" giữa đoạn khó.
- **Node boss** (vị trí thứ 10 mỗi world) — to hơn, viền nổi bật, đặt ngay cổng sang world sau; thường siết ngân sách xoay xuống 1 và thêm mục tiêu.
- **Cổng world** — giữa hai world là một mốc chuyển cảnh: nền đổi biome, có animation mở khoá.

Trạng thái node: **đã hoàn thành** (hiện số sao), **đang mở / kế tiếp** (node nhấp nháy "chơi ngay"), **khoá** (xám, ổ khoá). Đi tuyến tính: hoàn thành node n mở node n+1.

Map nên là một ảnh nền dài (parallax nhẹ 2–3 lớp) với toạ độ node nạp từ dữ liệu, **không** dựng mỗi node bằng một View nặng. Bám checklist chống giật: vẽ map bằng Canvas/ành atlas, không cấp phát trong lúc cuộn.

## 4. Bộ khung cảnh nền — hành trình thiên nhiên

Nền **đổi dần theo world** tạo cảm giác đi xa dần, mỗi world một palette riêng và mở khoá tuần tự:

1. **Đồng cỏ** — xanh lá tươi, trời sáng. Khởi đầu ấm áp, thân thiện.
2. **Rừng rậm** — xanh đậm + nâu, tán cây.
3. **Sông & Thác** — xanh nước + ngọc, có giọt nước (gợi ô đích).
4. **Sa mạc** — vàng cát + cam, đá tảng (gợi chướng ngại).
5. **Bãi biển** — xanh ngọc + cát sáng, sóng.
6. **Núi tuyết** — trắng xanh lạnh, tuyết rơi.
7. **Hang băng** — xanh băng + tím, nhũ băng.
8. **Núi lửa** — đỏ cam + đen tro, dung nham (cao trào).
9. **Bầu trời** — xanh trời + hồng pastel, mây.
10. **Vũ trụ** — tím đậm + neon, sao (đỉnh hành trình).

Nguyên tắc dựng art tiết kiệm và mượt:

- **Một layout nền dùng chung, chỉ thay bộ asset/palette theo world.** Giảm công vẽ, giữ nhịp ra màn nhanh.
- **Khối "có mắt" giữ thiết kế nhất quán**, chỉ đổi tông màu nhẹ theo world cho hợp nền — không đổi luật chơi, không đổi nhận diện nhân vật.
- **Mở khoá cảnh nền = phần thưởng cảm xúc.** Qua boss world n → cутscene ngắn chuyển sang nền world n+1. Đây là động lực tiến độ ngoài sao.
- Nền là bitmap/atlas nạp sẵn, parallax 2–3 lớp, **không decode trong frame** (theo checklist chống giật ở technical-approach.md).

## 5. Đường cong khó

Độ khó tăng tuyến tính từ ~1.0 (W1) đến ~5.0 (W10), với nhịp trong mỗi world:

- **Node 1–2:** giới thiệu cơ chế mới của world ở mức nhẹ.
- **Node 3–5:** tăng dần (thêm mảnh, thêm đá/ô đích, phủ bàn dày hơn).
- **Node 6 (breather):** tụt nhẹ một bậc, +1 lượt xoay, ít đá hơn — cho thở.
- **Node 7–9:** đoạn khó nhất phần thân.
- **Node 10 (boss):** đỉnh world — nhiều mảnh nhất, siết xoay −1, có thể thêm mục tiêu.

Các đòn bẩy khó (xem cột tương ứng trong file xlsx): **số mảnh chuỗi** (5 → 17), **ngân sách xoay** (càng ít càng khó khi vẫn cần xoay), **số đá**, **số ô đích**, **độ phủ bàn ban đầu** (10% → ~46%), và **ngưỡng sao** (càng về sau càng sát min-moves).

Cân bằng cuối cùng dựa **số đo, không đoán**: chạy solver trên `:core` để lấy min-moves thật của từng màn, và (với màn mục tiêu điểm) chạy bot greedy để ước lượng điểm khả thi, rồi chốt ngưỡng sao.

## 6. Giải phẫu một màn & schema dữ liệu

Mỗi màn export ra JSON, đóng gói trong app, nạp vào `:core` để chơi và để solver verify. Một màn gồm: bàn dựng sẵn, chuỗi mảnh cố định, mục tiêu, ngân sách xoay, ngưỡng sao.

```json
{
  "id": 34,
  "world": 4,
  "name": "Cát 4",
  "seed": 340004,
  "grid": {
    "size": 9,
    "preset": [
      {"x": 2, "y": 8, "type": "block"},
      {"x": 3, "y": 8, "type": "block"},
      {"x": 4, "y": 8, "type": "stone"},
      {"x": 6, "y": 7, "type": "target"}
    ]
  },
  "gravity": "down",
  "rotationBudget": 2,
  "tray": [
    {"shape": "L3"}, {"shape": "I2"}, {"shape": "O4"},
    {"shape": "T4"}, {"shape": "I3"}, {"shape": "L3"},
    {"shape": "S4"}, {"shape": "O1"}, {"shape": "I2"}
  ],
  "goal": { "type": "clear_targets", "count": 4 },
  "stars": { "metric": "moves", "three": 11, "two": 13, "one": 15 },
  "difficulty": 3.0
}
```

Ghi chú schema:

- `type` của ô preset: `block` (khối thường, xoá được), `stone` (đá cố định — chướng ngại, không xoá bằng nước thường), `target` (ô đích phải phá để hoàn thành).
- `tray` là **chuỗi cố định theo thứ tự** (bỏ ngẫu nhiên) — nền tảng để màn deterministic và solver giải được.
- `goal.type` ∈ `clear_all` (dọn sạch) | `clear_targets` (phá hết ô đích) | `reach_score` (đạt điểm trong số nước = độ dài tray).
- `stars.metric` ∈ `moves` (ít nước hơn = nhiều sao) | `score` (điểm cao hơn = nhiều sao). Với `moves`: 3★ = min-moves của solver, 2★ = +2, 1★ = +4 (hoàn thành là đậu).
- `seed` phục vụ tính deterministic của hiệu ứng/RNG phụ; logic chính đã cố định bởi tray + preset.

Toàn bộ trường trên có sẵn dưới dạng cột trong `level-design-100-levels.xlsx` để chỉnh tay trước khi sinh JSON.

## 7. Hệ thống sao & mở khoá world

- Mỗi màn cho **0–3 sao**. Sao là tiền tệ tiến độ duy nhất (giữ hệ thống gọn, đúng tinh thần "không hệ thống thứ hai phức tạp").
- **Cổng world** mở khi đạt mốc sao tích luỹ (gợi ý ~60% tổng sao đến hết world trước, ví dụ cần ≥ 18 sao để mở W2). Cho phép người chơi bỏ vài sao khó nhưng vẫn đi tiếp, đồng thời tạo lý do quay lại "cày 3 sao".
- Mở world = mở **cảnh nền mới** + cutscene chuyển cảnh: thưởng cảm xúc, khớp với điểm "tận dụng short-form" trong business doc (chuyển cảnh đẹp rất hợp clip).
- Gắn rewarded ad đúng tinh thần MVP: hồi 1 nước / thêm 1 lượt xoay / reroll mảnh kế — không bán lời giải.

## 8. Quy trình sản xuất 100 màn

1. **Chỉnh tham số** trong `level-design-100-levels.xlsx` (đã có sẵn curve gợi ý cho cả 100 màn).
2. **Sinh màn (generate-and-test)** headless trên JVM bằng `:core` hoặc Python: dựng bàn + chuỗi mảnh theo tham số, thử nhiều biến thể.
3. **Solver verify**: BFS/IDA* có memo trên state = `(lưới, hướng trọng lực, mảnh còn lại)`; giữ màn có nghiệm, lấy **min-moves** để chốt ngưỡng 3★. Giới hạn ngân sách xoay để khống chế bùng nổ trạng thái.
4. **Bot greedy** cho màn mục tiêu điểm: ước lượng dải điểm khả thi để đặt ngưỡng sao công bằng.
5. **Export JSON** đóng gói trong app.
6. **Golden test**: cùng input → cùng chuỗi state, bảo vệ deterministic khi refactor `:core`.

## 9. Bám kiến trúc 3 lớp

- **`:core`** — model màn (parse JSON), luật chơi, solver/generator chạy headless. Không Android. Đây là nơi verify 100 màn.
- **`:game`** — render map (Canvas, parallax, node), render gameplay màn, animation chuyển cảnh world.
- **`:app`** — điều hướng map ↔ màn, lưu tiến độ/sao bằng DataStore, gọi AdMob theo sự kiện.

Luồng một chiều giữ nguyên: input → `:core` cập nhật state → `:game` đọc để vẽ → `:app`/Services nhận sự kiện. Map và tiến độ sao là state UI ở `:app`, không nằm trong `:core`.

## 10. Phụ thuộc & thứ tự triển khai gợi ý

Campaign nằm **sau MVP** (sau khi lõi cảm giác + Endless + AdMob đã chạy). Thứ tự:

1. Định dạng JSON màn + parser trong `:core` (mục 6).
2. Solver + generator headless; sinh và verify thử ~10 màn W1–W2.
3. Màn chơi đơn lẻ trong `:game` (nạp 1 JSON, chơi, chấm sao).
4. Bản đồ + tiến độ sao + mở khoá world trong `:app` + `:game`.
5. Bộ cảnh nền 10 world + cutscene chuyển cảnh.
6. Sinh đủ 100 màn, cân bằng bằng solver/bot, golden test.

---

*Bảng dữ liệu chi tiết 100 màn: `level-design-100-levels.xlsx` (sheet "100 Màn" + sheet "World & Map").*
