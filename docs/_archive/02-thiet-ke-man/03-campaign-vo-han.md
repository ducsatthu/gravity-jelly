# Level Design — Gravity Jelly (Campaign mở rộng vô hạn)

Tài liệu thiết kế chế độ **Campaign**: một hệ thống màn **co giãn từ vài chục tới vài nghìn màn**, độ khó tăng dần mãi, cảnh nền **lặp vòng** chỉ đổi nhẹ thay vì cạn kiệt chủ đề, và một **bản đồ đường đi kiểu Candy Crush**.

Bám sát cơ chế cốt lõi ở `../01-nen-tang/01-nghiep-vu.md` (xoay trọng lực, vật lý cụm cứng, combo, ngân sách xoay hữu hạn) và yêu cầu deterministic + kiến trúc 3 lớp ở `../01-nen-tang/02-ky-thuat.md`.

Bảng dữ liệu kèm theo (cùng thư mục):

- `../06-du-lieu/02-he-level-vo-han.xlsx` — **mô hình vô hạn** (đường cong tới ~5000 màn, vòng cảnh, modifier pool, goal cycle). Đây là tài liệu chính.
- `../06-du-lieu/01-thiet-ke-100-man.xlsx` — bộ 100 màn cụ thể, nay đóng vai **"loop onboarding" (vòng ribbon đầu tiên)**, không còn là toàn bộ game.

## 1. Quyết định cốt lõi: tách hai trục

Sai lầm dễ mắc là buộc **độ khó** vào **chủ đề cảnh** trên cùng một trục hữu hạn (10 world → hết ở "vũ trụ"). Khi đó muốn thêm màn là hết chỗ. Giải pháp: tách hẳn hai trục độc lập, mỗi trục suy ra từ chỉ số màn `L` bằng công thức.

1. **Trục độ khó — tăng mãi, không trần.** Một hàm `D(L)` tăng đơn điệu nhưng giảm tốc, nuôi mọi tham số sinh màn. Thêm bao nhiêu màn cũng được; khó cứ leo.
2. **Trục cảnh — lặp vòng, biến thể nhẹ.** Cảnh là một *ribbon* các biome lặp đi lặp lại; mỗi vòng phủ một lớp overlay (thời điểm trong ngày) và dịch màu (hue) nhẹ. Vài asset → vô hạn biến thể. "Vũ trụ" chỉ là một chặng trong vòng, sẽ quay lại nhiều lần với tông khác, **không phải đích đến**.

Vì cả hai đều là hàm của `L`, game **sinh màn theo công thức** thay vì vẽ tay từng màn — đó là điều cho phép vài nghìn màn.

## 2. Trục độ khó parametric

Độ khó cơ bản:

```
D(L) = 1 + log2(1 + L/8)
```

Tăng mãi nhưng giảm tốc: `D(1)≈1.0`, `D(100)≈4.8`, `D(1000)≈8.0`, `D(3000)≈9.6`, `D(5000)≈10.3`. Không có trần cứng. Cộng thêm một **sawtooth theo chương** (lên dần trong chương, dip ở breather, đỉnh ở boss) để luôn có nhịp lên-xuống dù tổng thể vẫn leo.

Từ `D` suy ra tham số màn (đều có cận trên hợp lý cho lưới 9×9):

| Tham số | Công thức (rút gọn) | Cận |
|---------|--------------------|-----|
| Số mảnh chuỗi | `4 + D·1.7` | 4 → 24 |
| Ngân sách xoay | `D / 2.2` | 0 → 6 |
| Số đá | `(D−2)·2.4` | 0 → 30 |
| Độ phủ bàn ban đầu | `8 + D·4` % | 8 → 55% |
| Số modifier đang bật | mở dần theo ngưỡng `D` | 0 → 5 |
| Biên sao (1★→3★) | `5 − D/2` | 4 → 0 |

**Chìa khoá để khó tăng mãi dù tham số chạm trần:** khi số mảnh/đá đã kịch cận, hai đòn bẩy sau vẫn tiếp tục siết — **số modifier đồng thời** tăng, và **biên sao co về 0** (về cuối phải giải gần như tối ưu mới được 3★). Nhờ vậy độ khó *cảm nhận* không bao giờ bão hoà.

## 3. Trục cảnh — vòng lặp vô hạn

Cảnh đổi **mỗi chương** (mặc định 15 màn/chương → cảnh đổi chậm, "thay đổi một chút"). Ba lớp chồng lên nhau tạo biến thể vô hạn từ ít asset:

1. **Ribbon biome (10 cảnh gốc):** Đồng cỏ → Rừng → Sông → Sa mạc → Biển → Núi tuyết → Hang băng → Núi lửa → Bầu trời → Vũ trụ → *quay lại Đồng cỏ*. Đây là 10 biome đã thiết kế ở bộ 100 màn, nay thành chu kỳ lặp.
2. **Overlay theo vòng:** mỗi lần ribbon quay hết một vòng, đổi overlay thời điểm: Ban ngày → Hoàng hôn → Ban đêm → Bình minh. "Đồng cỏ ban ngày" (vòng 1) khác hẳn "Đồng cỏ hoàng hôn" (vòng 2) mà **không cần vẽ biome mới**.
3. **Hue tint khi cạn overlay:** sau 4 vòng (cạn 4 overlay), xoay màu nền thêm 30° và lặp lại chu kỳ overlay. Cứ thế dịch màu vô hạn.

Tổ hợp: `10 biome × 4 overlay × N bước tint` = số biến thể cảnh gần như không giới hạn, chỉ từ 10 bộ asset gốc + vài lớp phủ màu. Bảng chi tiết ở sheet **"Vòng cảnh (loop)"**.

Nguyên tắc art tiết kiệm và mượt giữ nguyên: một layout nền dùng chung, overlay/tint là lớp màu rẻ; khối "có mắt" giữ nhận diện, chỉ ngả tông theo cảnh; nền là bitmap/atlas nạp sẵn, parallax 2–3 lớp, không decode trong frame (theo checklist chống giật).

## 4. Modifier pool — nguồn mới lạ vô tận

Để hàng nghìn màn không nhàm mà **không phá nguyên tắc "chỉ một cơ chế chữ ký"**, dùng một pool *modifier* — các tinh chỉnh luật nhỏ, đều xoay quanh trọng lực/đặt mảnh, mở khoá dần theo `D`:

Ô băng (xoá 2 lần), Ô khoá (mở bằng combo kề), Tường một chiều (chặn 1 hướng rơi), Ẩn mảnh kế (preview ngắn), Ô bom (xoá lan), Cụm nặng (rơi ưu tiên), Cấm một hướng xoay, Ô trượt (tự trôi), Đá nở…

Mỗi màn ở `D` cao bật vài modifier (tối đa 5), chọn deterministic theo seed. Tổ hợp modifier × tham số × mục tiêu tạo độ đa dạng tổ hợp khổng lồ. Chi tiết ngưỡng mở ở sheet **"Modifier pool"**.

## 5. Goal cycle

Mục tiêu luân phiên theo chương để đổi vị: Dọn sạch → Clear ô đích → Đạt điểm → Chuỗi combo → lặp. Boss chương đổi sang "Dọn sạch" cho đã tay. Mỗi loại có đơn vị sao riêng (số nước / điểm / số combo). Chi tiết ở sheet **"Goal cycle"**.

## 6. Cấu trúc chương & bản đồ (kiểu Candy Crush)

- **Chương = 15 màn** (cấu hình được). Mỗi chương một cảnh; nhịp trong chương: nhập (1–3) → leo (4–12) → breather (13) → khó (14) → boss (15).
- **Bản đồ là một ribbon cuộn vô tận**: node nối nhau trên đường uốn lượn, cảnh trôi dần theo chương. Toạ độ node và cảnh **tính từ `L`**, không cần dựng tay map cho vài nghìn node.
- Node: thường / breather (nhạt, dễ thở) / boss (nổi bật, ngay cổng chương sau). Trạng thái: hoàn thành (0–3★) / kế tiếp (nhấp nháy) / khoá.
- **Cổng chương mở theo sao TÍCH LŨY — cần ≥ 3/4 tổng sao tối đa (cập nhật 05/07/2026).** Mỗi world 10 màn × 3★ = 30 sao ⇒ trần tích luỹ 30/60/90; ngưỡng cổng = ⌈3/4 · trần⌉ = **W1→W2 = 23 · W2→W3 = 45 · W3→W4 = 68** (thay ~60% cũ 18/36/54). Phải qua ĐỦ 10 màn của world VÀ đạt tổng sao tích luỹ ≥ ngưỡng mới mở world kế (`CampaignScreen.gateStarReq`/`gateUnlocked`). Mỗi vài chương đổi cảnh = phần thưởng cảm xúc, hợp short-form.
- Map vẽ bằng Canvas/atlas, parallax, **không** dựng mỗi node bằng View riêng (chống giật khi cuộn).

## 7. Giải phẫu một màn & schema (không đổi)

Mỗi màn vẫn export JSON, nạp vào `:core` để chơi và để solver verify. Điểm khác: phần lớn JSON này **do generator sinh ra từ `L`**, không gõ tay.

```json
{
  "id": 742,
  "chapter": 50,
  "scene": { "biome": "Vũ trụ", "loop": 5, "overlay": "Ban ngày", "hueTint": 30 },
  "seed": 742,
  "difficulty": 8.37,
  "grid": { "size": 9, "preset": [ {"x":4,"y":8,"type":"stone"}, {"x":6,"y":7,"type":"target"} ] },
  "gravity": "down",
  "rotationBudget": 3,
  "modifiers": ["Ô băng", "Ô khoá", "Ô bom"],
  "tray": [ {"shape":"L3"}, {"shape":"T4"}, {"shape":"I2"}, "…" ],
  "goal": { "type": "clear_targets", "count": 6 },
  "stars": { "metric": "moves", "three": 21, "two": 22, "one": 22 }
}
```

`type` ô preset: `block | stone | target`. `goal.type`: `clear_all | clear_targets | reach_score | combo_chain`. `stars.metric`: `moves | score | combo`. Biên sao co dần theo `D` (ví dụ trên: 3★/2★/1★ gần như trùng → buộc giải tối ưu).

## 8. Quy trình sản xuất hàng nghìn màn

Không vẽ tay từng màn. Pipeline:

1. **Hand-author ~30–50 màn đầu** (vòng onboarding) để dạy cơ chế đúng thứ tự, kiểm soát cảm giác nhập môn.
2. **Generator từ `L`**: tính tham số bằng công thức (mục 2), dựng bàn + chuỗi mảnh + modifier theo seed. Chạy headless trên `:core` hoặc Python.
3. **Solver verify (BFS/IDA* có memo)** trên state `(lưới, hướng trọng lực, mảnh còn lại)`: giữ màn có nghiệm, lấy **min-moves** để chốt ngưỡng sao. Giới hạn ngân sách xoay khống chế bùng nổ trạng thái. Màn không giải được → đổi seed, sinh lại.
4. **Bot greedy** cho màn mục tiêu điểm/combo: ước lượng dải khả thi, đặt ngưỡng sao công bằng.
5. **Sinh theo lô** (ví dụ mỗi đợt phát hành thêm vài trăm màn), đóng gói JSON. Vì mọi thứ deterministic theo seed, có thể chỉ lưu **seed + tham số** rồi tái tạo, giảm dung lượng.
6. **Golden test**: cùng input → cùng chuỗi state, bảo vệ deterministic khi refactor `:core`.

Mở rộng về sau chỉ là: tăng trần tham số, thêm modifier mới vào pool, thêm overlay/tint mới — **không phải thiết kế lại hệ thống**.

## 9. Bám kiến trúc 3 lớp

- **`:core`** — hàm `D(L)`, công thức tham số, parser JSON, generator + solver chạy headless. Không Android. Nơi sinh & verify hàng nghìn màn.
- **`:game`** — render map ribbon (parallax, node), render gameplay, áp overlay/tint cảnh, animation chuyển chương.
- **`:app`** — điều hướng map ↔ màn, lưu tiến độ/sao (DataStore), AdMob theo sự kiện.

Luồng một chiều giữ nguyên: input → `:core` → `:game` đọc vẽ → Services nhận sự kiện. Tiến độ sao và cảnh là state ở `:app`/`:game`, không nằm trong `:core`.

## 10. Thứ tự triển khai gợi ý (sau MVP)

1. Hàm `D(L)` + công thức tham số + schema JSON + parser trong `:core`.
2. Generator + solver; sinh & verify ~30 màn onboarding.
3. Màn chơi đơn lẻ trong `:game` (nạp JSON, chơi, chấm sao).
4. Bản đồ ribbon + tiến độ sao + cổng chương.
5. Hệ cảnh: 10 biome + lớp overlay + tint; chuyển cảnh theo chương.
6. Modifier pool (mở dần); sinh theo lô vài trăm → vài nghìn màn, cân bằng bằng solver/bot, golden test.
7. **Boss (mục 11):** thêm khối `boss` vào schema + state boss trong `:core` (đồng hồ đòn, sát thương, hàng đợi đòn theo seed); solver verify boss có nghiệm; render mặt boss + thanh máu/bộ đếm + telegraph trong `:game`. Bắt đầu từ archetype A (Tham Trọng Lực) rồi mở dần B, C.

## 11. Boss chương

Mỗi chương kết ở **màn boss** (màn 15). Boss **không** là hệ thống thứ hai (không skill, không thanh máu kiểu action rời rạc) — boss là **cơ chế chữ ký bị đảo vai**: ở màn thường người chơi làm chủ trọng lực; ở boss có một thực thể *tranh* quyền điều khiển trọng lực và *phản đòn* bằng chính modifier pool. Boss tái dùng toàn bộ tài nguyên sẵn có: khối **có mắt** làm mặt boss, **modifier** (đá/băng/khoá) làm đòn phản công, **ngân sách xoay** làm tài nguyên đối kháng.

### Khung chung của một boss

Mọi boss đều có ba thành phần, đều deterministic theo seed nên solver/bot verify được:

1. **Thực thể boss** — một khối lớn có mắt chiếm vài ô (hoặc một lõi giữa bàn). Là vật cản + là "mặt" để người chơi nhắm vào.
2. **Đồng hồ đòn (threat clock)** — cứ mỗi `N` lượt của người chơi, boss thực hiện **một đòn**. Đòn được **báo trước 1 lượt** (telegraph) để đây là puzzle dự liệu, không phải hên xui.
3. **Điều kiện thắng/thua** — theo một trong hai khuôn dưới, tuỳ archetype.

Hai khuôn thắng (chọn theo kiểu boss):

- **Bào máu (DPS race).** Boss có thanh `bossHP`. Mỗi lượt người chơi xoá hàng/cột hoặc tạo combo → sát thương = `số hàng/cột xoá × hệ số combo` (combo dây dài nhân mạnh). Thắng = `bossHP → 0` trước khi bàn kẹt. Thua = không đặt được mảnh nào trong khay (luật thua chuẩn).
- **Sống sót (endurance).** Boss có `surviveTurns`. Người chơi chỉ cần **cầm cự đủ số lượt** dưới áp lực boss mà bàn không kẹt. Không cần "đánh" boss, chỉ cần không chết — hợp với boss đối kháng trọng lực, nơi mọi nỗ lực dồn vào việc giữ bàn sống.

### Pool archetype (xoay vòng theo chương)

Vì boss xuất hiện **mỗi chương**, boss cũng **procedural từ một pool nhỏ**, chọn deterministic theo chỉ số chương rồi scale cường độ theo `D(L)`. Ba archetype gốc, mỗi cái là một biến tấu của trọng lực/đặt mảnh:

| Archetype | Khuôn thắng | Đòn phản công (mỗi `N` lượt) | Mở khoá |
|-----------|------------|------------------------------|---------|
| **A. Tham Trọng Lực** | Sống sót | Tự **xoay trọng lực** sang hướng bất lợi; người chơi phải tiêu ngân sách xoay giành lại + lợi dụng hướng mới tạo combo | Boss đầu tiên (~chương 5) |
| **B. Kẻ Đổ Rác** | Bào máu | Đẩy một **dải đá/băng** vào một cạnh bàn, ép dọn; combo của bạn bào máu boss | ~chương 10 |
| **C. Lõi Giáp** | Bào máu | **Tái sinh một lớp giáp** (ô khoá) quanh lõi; phải dùng trọng lực đè vỡ từng lớp mới chạm lõi | mở theo ngưỡng `D` (~chương 15) |

Chương `c` chọn archetype `pool[c mod len]` trong các archetype đã mở. **Chồng đòn theo `D` thay vì tăng máu suông:** boss chương sau mạnh hơn không phải vì nhiều HP, mà vì làm **nhiều đòn đồng thời** — chương đầu boss chỉ xoay trọng lực; về sau vừa xoay vừa đổ rác; rất sâu thì thêm "cấm xoay vài lượt". Đây đúng là đòn bẩy *số modifier đồng thời* ở mục 2, áp cho boss.

### Cường độ scale theo `D(L)`

| Tham số boss | Công thức (rút gọn) | Cận |
|--------------|--------------------|-----|
| `bossHP` (kiểu bào máu) | `6 + D·3` | 9 → ~40 |
| `surviveTurns` (kiểu sống sót) | `8 + D·1.5` | 9 → ~24 |
| `N` — khoảng cách giữa hai đòn | `5 − D/3` (boss đánh **dày dần**) | 4 → 2 |
| Số đòn đồng thời | 1 (`D<5`) → 2 (`D<8`) → 3 | 1 → 3 |

### Đấu boss thế nào (vòng lặp người chơi)

1. **Đọc telegraph** — biết boss sắp làm gì ở lượt tới (đổi hướng nào / đổ rác cạnh nào).
2. **Đặt mảnh + (tuỳ chọn) tiêu ngân sách xoay** để chuẩn bị: né dải rác sắp tới, hoặc cố tình dồn cụm về hướng boss sắp xoay để biến đòn của boss thành combo cho mình.
3. **Gây sát thương / hoặc giữ bàn sống** tuỳ khuôn thắng.
4. **Boss act** theo đồng hồ.
5. Lặp tới khi `bossHP→0` / hết `surviveTurns` (thắng) hoặc khay không đặt được (thua).

Điểm khoá để boss "công bằng mà vẫn căng": đòn boss luôn **telegraph + deterministic**, nên luôn tồn tại nước đi tốt — solver verify được màn boss có nghiệm, y như màn thường. Boss khó vì **bắt người chơi dùng ngân sách xoay đúng lúc**, không vì ngẫu nhiên.

### Dạy trước khi đánh

14 màn trước boss của chương nên **rải dần đúng modifier mà boss sẽ phản đòn** (chương boss-đổ-băng thì màn 8–13 cho làm quen ô băng). Boss = bài kiểm tra tổng hợp của chương, không phải cơ chế lạ. Goal cycle (mục 5) đã đặt boss về "Dọn sạch" — giữ vậy cho kiểu bào máu; kiểu sống sót thì goal = "trụ đủ lượt".

### Mở rộng schema JSON

Thêm khối `boss` (chỉ có ở màn 15); thiếu khối này = màn thường.

```json
"boss": {
  "archetype": "gravity_greed",        // gravity_greed | junk_dumper | armor_core
  "winMode": "survive",                // survive | drain
  "bossHP": 24,                        // chỉ khi winMode=drain
  "surviveTurns": 16,                  // chỉ khi winMode=survive
  "threatInterval": 3,                 // N lượt giữa hai đòn
  "attacks": ["rotate_gravity"],       // chồng đòn: ["rotate_gravity","dump_junk"]
  "entity": { "cells": [{"x":4,"y":4},{"x":5,"y":4}], "hasEyes": true }
}
```

### Bám kiến trúc 3 lớp

- **`:core`** — state boss (`bossHP/surviveTurns`, đồng hồ đòn, hàng đợi đòn sinh từ seed), luật sát thương, áp đòn boss vào lưới. Headless, deterministic → solver verify boss như màn thường.
- **`:game`** — render mặt boss (mắt, biểu cảm khi trúng đòn), thanh máu/bộ đếm lượt, hiệu ứng telegraph, animation khi boss xoay trọng lực.
- **`:app`** — không đổi: vẫn lưu sao, AdMob theo sự kiện (rewarded hồi sinh ở boss là điểm doanh thu tự nhiên).

## 12. Curriculum cơ chế theo world (vòng onboarding, 100 màn)

Vòng ribbon đầu (10 world × 10 màn) là **xương sống dạy cơ chế**: mỗi world mở **đúng một cơ chế tối thiểu mới**, gắn chặt chủ đề biome, xếp từ nền tảng → modifier. Đây là thứ tự duy nhất người chơi gặp cơ chế lần đầu; sau màn 100 các cơ chế **tái tổ hợp** procedural theo `D(L)` + modifier pool (mục 4), không có cơ chế nào "mới toanh" nữa.

Nguyên tắc: **một cơ chế mới / world, không chồng hai.** World N luôn ghép cơ chế mới với mọi cơ chế đã học (màn 7–9), rồi kiểm tra ở boss (màn 10).

| World | Màn | Cơ chế tối thiểu MỚI | Vì sao hợp chủ đề | Goal | Modifier mở |
|-------|-----|----------------------|-------------------|------|-------------|
| 1 · Đồng cỏ | 1–10 | Đặt mảnh từ khay 3 + xóa hàng/cột | Sân tập phẳng, sạch | Dọn sạch | — |
| 2 · Rừng rậm | 11–20 | **Xoay trọng lực** (cơ chế chữ ký) + vật lý cụm cứng, ngân sách 1 | Cây đổ, cụm lá dồn theo hướng | Dọn sạch | — |
| 3 · Sông & Thác | 21–30 | **Combo dây chuyền (cascade)** sau xoay + ô đích | Nước chảy = phản ứng dây chuyền | Clear ô đích | — |
| 4 · Sa mạc | 31–40 | **Đá cố định** (chướng ngại tĩnh, không xóa bằng hàng) | Đá tảng giữa cát | Clear ô đích | Đá |
| 5 · Bãi biển | 41–50 | **Mục tiêu điểm trong số nước giới hạn** (goal mới) | Sóng đếm nhịp, đua điểm | Đạt điểm | — |
| 6 · Núi tuyết | 51–60 | **Ô băng** (phủ tuyết, phải xóa 2 lần) | Tuyết phủ kép | Dọn sạch | Ô băng |
| 7 · Hang băng | 61–70 | **Tường một chiều + Ô khoá** (vách băng chặn 1 hướng rơi; mở bằng combo kề) | Băng chắn lối, đóng kín | Clear ô đích | Tường 1 chiều, Ô khoá |
| 8 · Núi lửa | 71–80 | **Ô bom + Đá nở** (dung nham lan; bom xóa lan) | Phun trào, lan rộng | Đạt điểm | Ô bom, Đá nở |
| 9 · Bầu trời | 81–90 | **Ẩn mảnh kế + Ô trượt** (mây che preview; gió thổi ô tự trôi mỗi lượt) | Mây mù, gió cuốn | Hỗn hợp | Ẩn preview, Ô trượt |
| 10 · Vũ trụ | 91–100 | **Tổng hợp + Cấm một hướng xoay** (đa trọng lực, ngưỡng sao gắt) | Không-trọng-lực, hỗn loạn | Hỗn hợp (chuyên gia) | Cấm hướng xoay |

Vi cấu trúc trong một world (10 màn): **1–2** giới thiệu cơ chế mới ở dạng thuần nhất (ít nhiễu); **3–5** luyện sâu, tăng `D` nhẹ; **6** breather (cơ chế cũ, dễ thở); **7–9** ghép cơ chế mới với cơ chế world trước; **10** boss kiểm tra tổng hợp (xem mục 11).

> **Lưu ý đồng bộ:** bản này **thay** các dòng "Cơ chế mới" cũ ở W6–W9 trong `design/.../uploads/0[6-9]-*.md` (vốn chỉ ghi "nhiều đá / mật độ cao / tổng hợp" — không mở modifier, lệch chủ đề). W1–W5 và W10 giữ nguyên tinh thần. Cần cập nhật 4 file world đó để khớp khi dựng map.

---

*Bảng dữ liệu: `../06-du-lieu/02-he-level-vo-han.xlsx` (4 sheet: Đường cong vô hạn · Vòng cảnh (loop) · Modifier pool · Goal cycle). Bộ 100 màn onboarding chi tiết: `../06-du-lieu/01-thiet-ke-100-man.xlsx`.*
