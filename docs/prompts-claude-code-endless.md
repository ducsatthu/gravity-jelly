# Prompts cho Claude Code — Endless (MVP)

Chuỗi prompt để Claude Code hiện thực **chế độ Endless** trên khung scaffold (`:core` / `:game` / `:app`). Endless là lõi MVP — làm trước Campaign/Daily.

## Cách dùng

- Chạy Claude Code **trong repo** `gravity-jelly`. Mỗi mục `Prompt N` là một lần giao việc — **copy nguyên khối ```, dán vào Claude Code**, chạy lần lượt theo thứ tự.
- Mỗi prompt là một chunk cỡ-một-PR, **có acceptance criteria + test**. Đừng gộp nhiều prompt.
- Claude Code tự đọc `CLAUDE.md`, `docs/technical-approach.md`, `docs/business-understanding.md` — các prompt giả định điều đó.

## Ràng buộc xuyên suốt (Claude Code phải tuân)

- **Kiến trúc 3 lớp + luồng một chiều:** logic ở `:core` (thuần Kotlin, không Android); `:game` chỉ đọc state để vẽ; `:app` lắp ráp + services. Core KHÔNG gọi ngược.
- **Deterministic là yêu cầu cứng:** mọi ngẫu nhiên qua `com.gravityjelly.core.Rng` (đã có, SplitMix64 seed). Không `Random` toàn cục, không phụ thuộc thời gian thực hay thứ tự iteration không ổn định. Cùng seed + cùng input ⇒ cùng state.
- **Chống giật:** vẽ cả bàn trong MỘT Canvas; không cấp phát trong vòng vẽ; object pool cho particle/popup; animation nội suy tách khỏi fixed-timestep sim.
- **Test:** mỗi prompt `:core` phải có unit test; logic resolve phải có **golden test** (cùng input → cùng chuỗi state). Lệnh: `./gradlew :core:test`.
- Tiếng Việt cho doc/comment quan trọng; giữ ranh giới module.

## Luật Endless (chuẩn để bám)

- Lưới **9×9**. Khay **3 mảnh**; đặt hết 3 thì phát tiếp 3 (qua `Rng`).
- **Đặt mảnh:** người chơi chọn vị trí theo trục vuông góc trọng lực; mảnh **hard-drop theo hướng trọng lực**, dừng ở điểm chạm đầu tiên — **không xuyên khe**.
- **Xóa** khi một **hàng HOẶC cột đầy**. Xóa nhiều hàng/cột cùng lúc được.
- **Vật lý cụm:** "cụm" = thành phần liên thông các ô đầy theo 4 hướng kề. Sau khi xóa, các cụm **rơi nguyên khối (rigid)** theo trọng lực, dừng khi chạm tường/cụm khác — để lại lỗ hổng (không tách cụm).
- **Combo cộng dồn:** mỗi hàng/cột bị xóa cộng +1 vào combo (xóa 2 hàng cùng lúc = +2), dây chuyền (xóa → cụm sụp → xóa lại) cộng tiếp. Combo **bền qua các nước**: 2 nước xóa liên tiếp ×2, 3 nước ×3… Chỉ **reset về 0 khi thả mảnh mà không xóa được gì**; xoay trọng lực không xóa được gì → giữ nguyên combo. Điểm mỗi lần xóa = số ô × số hàng/cột × bậc combo.
- **Xoay trọng lực 90°:** cả bàn đổ lại theo hướng mới (deterministic) → nguồn combo lớn nhất. **Ngân sách xoay hữu hạn** theo chặng.
- **Thua:** không còn mảnh nào trong khay đặt được ở bất kỳ đâu.
- **Số trên khối** = kích thước cụm chứa ô đó (cosmetic, nhắc người chơi). 4 màu jelly là cosmetic, KHÔNG ảnh hưởng luật xóa.

---

# Phase 0 — Chuẩn bị

```
Đọc CLAUDE.md và docs/technical-approach.md. Xác nhận build được khung hiện tại:
1) Sinh Gradle wrapper nếu thiếu (gradle wrapper --gradle-version 8.9 hoặc tương đương).
2) Chạy ./gradlew :core:test và ./gradlew :app:assembleDebug. Sửa lỗi cấu hình nếu có (version catalog, plugin, JDK 17, compileSdk 35) NHƯNG không đổi kiến trúc.
3) Báo lại trạng thái build + test xanh trước khi sang Phase 1.
Không thêm tính năng ở bước này.
```

---

# Phase 1 — `:core` (luật chơi, headless, có test)

### Prompt 1 — Mảnh & khay (tray) seeded
```
Trong :core, thêm mô hình MẢNH cho Endless. Yêu cầu:
- Tạo `Piece`/`Shape`: một polyomino = tập ô offset (List<IntOffset-like>, dùng data class thuần Kotlin, KHÔNG import Android). Kèm `color: JellyColor`.
- Định nghĩa một BỘ MẢNH cơ bản (giống block-fit): các mảnh 1..5 ô phổ biến (đơn, đôi, L, T, vuông 2x2, I dài 3-4, …). Đặt trong một bảng hằng `PieceLibrary`.
- `TrayGenerator(rng: Rng)`: phát 3 mảnh mỗi lượt từ bộ mảnh, deterministic qua Rng (có thể nhận "pool/độ khó" sau này — để tham số mở).
- Hàm tiện ích: kích thước, các ô tuyệt đối khi đặt tại (x,y), xoay hình học của mảnh nếu cần (tuỳ chọn).
Test: cùng seed → cùng chuỗi 3-mảnh qua nhiều lượt; bộ mảnh hợp lệ (không trùng ô, liên thông).
Không đụng :game/:app.
```

### Prompt 2 — Đặt mảnh + hard-drop 4 hướng
```
Trong :core, thêm logic ĐẶT MẢNH lên Grid theo Endless:
- `hardDrop(grid, piece, lateralIndex, gravity: Direction): PlacementResult` — chọn vị trí theo trục vuông góc trọng lực (lateralIndex), mảnh rơi theo gravity tới điểm chạm đầu tiên, KHÔNG xuyên khe; trả về vị trí cuối + ô chiếm, hoặc invalid nếu không đặt được.
- `canPlaceAnywhere(grid, piece, gravity): Boolean` (phục vụ điều kiện thua sau này).
- `place(grid, piece, finalCells)` ghi khối vào Grid (gán JellyColor của mảnh).
Hỗ trợ ĐỦ 4 hướng trọng lực (DOWN/UP/LEFT/RIGHT) dùng Direction đã có.
Test: hard-drop dừng đúng điểm chạm cho cả 4 hướng; không xuyên khe; mảnh chờm biên = invalid; canPlaceAnywhere đúng ở bàn đầy/û trống.
```

### Prompt 3 — Xóa hàng/cột + điểm cơ bản
```
Trong :core, thêm phát hiện & xóa dòng:
- `findFullLines(grid): rows đầy + cols đầy`. Xóa đồng thời mọi hàng/cột đầy trong một bước.
- `Scoring.clearScore(cellsCleared, linesCleared, comboLevel)` = số ô × số hàng/cột × bậc combo (combo truyền vào từ Prompt 5).
Test: xóa 1 hàng, 1 cột, nhiều hàng+cột cùng lúc; ô giao điểm chỉ tính một lần; điểm đúng công thức.
```

### Prompt 4 — Vật lý cụm (rigid cluster gravity), deterministic
```
Trong :core, thêm `applyClusterGravity(grid, gravity): Boolean` (trả về có gì di chuyển không):
- "Cụm" = thành phần liên thông các ô ĐẦY theo 4-kề.
- Mỗi cụm rơi NGUYÊN KHỐI theo gravity tới khi bất kỳ ô nào chạm tường hoặc cụm khác; cụm khác nhau rơi độc lập, để lại lỗ.
- Mô phỏng ỔN ĐỊNH & DETERMINISTIC: lặp bước-1-ô, mỗi vòng xác định cụm nào còn có thể tịnh tiến 1 ô theo gravity (mọi ô đích trống hoặc thuộc chính cụm đó) rồi di chuyển; lặp tới khi không cụm nào nhúc nhích. Thứ tự xử lý phải cố định (vd sort cụm theo cạnh dẫn đầu) để không lệch deterministic.
Test: cụm đơn rơi đúng; hai cụm tách nhau rơi độc lập tạo lỗ; cụm chữ L kẹt đúng; KHÔNG xuyên nhau; chạy 2 lần cùng input cho cùng kết quả (golden).
```

### Prompt 5 — Resolve cascade + combo (golden test)
```
Trong :core, ghép thành vòng RESOLVE:
- `resolve(grid, gravity, startCombo): ResolveResult` = lặp { xóa hàng/cột đầy → applyConnectedGravity (sụp cục bộ vùng nối liền) → } cho tới khi không còn gì để xóa. **Combo cộng dồn:** bắt đầu từ `startCombo` (engine giữ qua các nước), mỗi hàng/cột xóa cộng +1 (xóa 2 hàng cùng lúc = +2), dây chuyền cộng tiếp; điểm nhân theo bậc combo (x2, x3, …).
- Trả về chuỗi sự kiện theo thứ tự + `endCombo` + cờ `cleared` để engine quyết reset/giữ combo (reset 0 khi thả mảnh không xóa được gì; xoay không xóa được gì thì giữ).
Test + GOLDEN TEST: dựng vài bàn cố định → so khớp CHÍNH XÁC chuỗi state/sự kiện qua resolve (bảo vệ deterministic khi refactor). Bao gồm case đa hàng cùng lúc (×N) và combo cộng dồn qua nhiều nước.
```

### Prompt 6 — Xoay trọng lực 90° + ngân sách
```
Trong :core, thêm cú xoay trọng lực:
- `rotateGravity(state, cw: Boolean)`: đổi Direction 90°, rồi applyClusterGravity + resolve theo hướng mới; trừ 1 ngân sách xoay. Đây là nguồn combo lớn.
- Quản lý `rotationBudget` trong state; chặn xoay khi hết.
Test: sau xoay, bàn đổ đúng hướng mới deterministic; budget giảm đúng; xoay 4 lần CW về hướng đầu (nếu bàn trống) → trạng thái hợp lệ; combo sau xoay được tính.
```

### Prompt 7 — Điều kiện thua + EndlessEngine (reducer)
```
Trong :core, tổng hợp thành ENGINE Endless deterministic, headless:
- `EndlessState` (immutable hoặc copy-on-write): grid, gravity, tray (3 mảnh), rotationBudget, score, combo, seed/rng, stage, isGameOver.
- `EndlessEngine` với các input rời rạc: PlacePiece(trayIndex, lateralIndex), RotateGravity(cw), (nội bộ) DealTray. Mỗi input → state mới qua resolve; KHÔNG side-effect.
- `isGameOver` = không mảnh nào trong khay đặt được ở bất kỳ vị trí/khi đã hết xoay hữu ích.
- Phát danh sách sự kiện cho lớp render.
Test + GOLDEN: chạy một KỊCH BẢN input cố định với seed cố định → khớp chính xác điểm, chuỗi state, thời điểm game over. Đây là hợp đồng deterministic của Endless.
```

### Prompt 8 — Thang khó Endless + bot cân bằng (tuỳ chọn)
```
Trong :core, thêm tham số THANG KHÓ Endless (tăng dần trong một run):
- Theo mốc điểm/lượt: tăng ô đá cố định rải vào bàn (qua Rng), siết ngân sách xoay, đổi pool mảnh khó hơn. Tham số hoá trong một `EndlessTuning`.
- Viết một `GreedyBot` headless chạy nhiều nghìn run trên EndlessEngine, in tỉ lệ sống / điểm trung bình / độ dài run để cân bằng (chạy như một test/CLI, không vào app).
Test: tuning thay đổi độ khó có thể đo được; bot chạy ổn định, kết quả deterministic theo seed.
```

---

# Phase 2 — `:game` (render + input + animation)

### Prompt 9 — Vẽ state bàn trên MỘT Canvas
```
Trong :game, mở rộng BoardCanvas để vẽ EndlessState từ :core:
- Vẽ mỗi ô đầy là KHỐI JELLY có mắt (4 màu theo JellyColor), viền dày, gloss đỉnh; vẽ SỐ = kích thước cụm chứa ô (tính từ :core, đừng tính lại mỗi frame nếu tránh được).
- Vẽ ô đá (stone) khác biệt; ô trống dùng cellEmpty/cellLine.
- TẤT CẢ trong một Canvas. Allocation-free: tái dùng Paint/Path/mảng; không tạo object trong khối draw. Màu lấy từ tokens (app theme hoặc hằng trong :game).
Yêu cầu: không render mỗi ô bằng Composable riêng. Có @Preview dựng state mẫu.
```

### Prompt 10 — Input kéo-thả + nút xoay
```
Trong :game, thêm tương tác Endless:
- Khay 3 mảnh (Composable vỏ); kéo một mảnh lên bàn → hiện GHOST PREVIEW vị trí hard-drop (gọi :core hardDrop để tính), thả → gửi input PlacePiece tới engine.
- Nút XOAY trọng lực (FAB 64dp) hiển thị ngân sách còn lại; bấm → input RotateGravity. Disable khi hết budget.
- State game nằm NGOÀI Compose (engine giữ ở một holder/ViewModel-like ở :app hoặc :game); Compose chỉ recompose lớp vỏ khi điểm/budget đổi, không mỗi frame.
Test thủ công + @Preview; đảm bảo preview ghost đúng điểm rơi.
```

### Prompt 11 — Animation (nội suy, pool)
```
Trong :game, thêm animation đọc chuỗi sự kiện resolve từ :core:
- drop squash khi đặt; line-clear flash; cluster collapse nội suy có easing; gravity-rotate slide cả bàn về vị trí mới; combo popup.
- Dùng fixed-timestep sim (GameClock đã có) + render nội suy theo alpha; object pool cho particle/popup; cap số particle.
- Tôn trọng ngân sách main-thread; không cấp phát trong vòng vẽ.
Tham chiếu design/05-effects/* để khớp cảm giác. Có @Preview cho từng hiệu ứng nếu được.
```

---

# Phase 3 — `:app` (lắp ráp Endless chơi được)

### Prompt 12 — Màn Endless wiring + Game Over
```
Trong :app, dựng MÀN ENDLESS chơi được end-to-end:
- Một holder (ViewModel/StateHolder) giữ EndlessEngine; expose state cho UI; xử lý DealTray khi hết 3 mảnh.
- Layout: HUD trên (điểm + best + ngân sách xoay) · BoardCanvas (:game) · khay 3 mảnh · nút xoay. Dùng GravityJellyTheme + tokens.
- Game Over dialog: điểm cuối + best, nút Chơi lại (reset engine với seed mới) + Về Home.
- Bám luồng một chiều: UI gửi input → engine → state → UI vẽ.
Acceptance: chơi được trọn vòng (đặt mảnh → xóa → combo → xoay → thua → chơi lại). Build :app:assembleDebug xanh.
```

### Prompt 13 — Lưu trữ (DataStore)
```
Trong :app, thêm DataStore (preferences):
- Lưu best score, cài đặt (âm thanh/nhạc/rung), seed gần nhất nếu cần.
- Đọc/ghi bất đồng bộ, không chặn main thread; cập nhật best khi game over.
Test: best score bền qua phiên; không crash khi lần đầu (giá trị mặc định).
```

### Prompt 14 — AdMob (làm sau cùng)
```
Trong :app, tích hợp AdMob theo docs (business §8, technical §Services):
- Init SDK lazy ở luồng nền; PRELOAD interstitial + rewarded trước khi cần.
- Interstitial THEO SỰ KIỆN (sau vài lần thua/chặng) + cooldown + ân hạn người mới — KHÔNG theo bộ đếm thời gian thuần.
- Rewarded: hồi sinh 1 lần khi thua / nhân đôi điểm cuối / thêm lượt xoay / reroll khay.
- Không gọi load lúc vừa thua (tránh đứng khung hình).
Dùng test ad unit id khi dev. Acceptance: ad hiện đúng sự kiện, preload sẵn, không giật khi hiển thị.
```

---

## Thứ tự & ghi chú

1→8 (core, có test) → 9→11 (game) → 12 (chơi được) → 13 (lưu) → 14 (ads). Có thể chơi thử ngay sau **Prompt 12**.

Sau khi Endless ổn: quay lại Campaign (parser JSON màn + solver) và Daily seed — đã thiết kế ở `docs/level-design.md`. Mỗi prompt nên kết thúc bằng việc chạy `./gradlew :core:test` (và `:app:assembleDebug` cho phase app) và báo kết quả.
