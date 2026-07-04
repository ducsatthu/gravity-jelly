# 06 · Gameplay — Nối `:core` ↔ render + input

Hạng mục **Gameplay**: làm cho lớp nhìn **phản ánh đúng state Core** và **điều khiển được** — kéo-thả mảnh, chọn trục, hard-drop preview, ngân sách xoay, combo, thua. `:core` (luật + deterministic) **giữ nguyên**; ở đây chỉ thêm **state-holder** ở `:game`/`:app` và **API đọc thuần** ở Core nếu thiếu.

**Design / spec nguồn:**
- Luật Endless: `CLAUDE.md` gốc repo + `docs/01-nen-tang/01-nghiep-vu.md`.
- Hành vi UI: `04-screens/game-screen.jsx` (preview ô đặt, chọn slot), `05-effects/*` (phản hồi).

**Kotlin hiện có:** `:core` (Grid, Placement, ClusterPhysics, LineClearing, Resolve, GravityRotation, EndlessEngine, TrayGenerator, Rng…); `game/.../EndlessGameHolder.kt`, `EndlessScreen.kt`; `app/.../EndlessGameScreen.kt`.

**Nguyên tắc:**
- **Một chiều:** input → Core cập nhật state → render đọc state → EffectController nhận sự kiện. Core KHÔNG gọi ngược.
- **Deterministic bất biến:** không đổi RNG/luật; cùng seed + cùng chuỗi input ⇒ cùng kết quả. Golden test `:core` phải vẫn xanh.
- **State-holder OO:** `GameUiState`/holder giữ trạng thái phiên (engine Core + selectedIndex + trọng lực + điểm) ngoài Compose; phát sự kiện cho EffectController (file 05).

---

## Prompt 1 — `GameSession` holder: bọc EndlessEngine + phát sự kiện

```
Mục tiêu: một state-holder phiên chơi nối Core với render/effect, một chiều.

Đọc trước: core/.../EndlessEngine.kt, Grid.kt, Placement.kt, GravityRotation.kt; CLAUDE.md (luật Endless).

Việc:
- Tạo GameSession (trong :game hoặc :app) bọc EndlessEngine: giữ grid hiện tại, khay 3 mảnh, hướng trọng lực, lượt xoay còn lại, điểm/combo. Khởi tạo bằng seed (deterministic).
- Mỗi hành động người chơi (đặt mảnh, xoay trọng lực) gọi Core để ra state mới, rồi: (a) cập nhật state cho render đọc, (b) phát sự kiện cho EffectController (onPiecePlaced/onLinesCleared/onGravityRotated/onCascadeStep) kèm state trước/sau để nội suy.
- Nếu Core thiếu hàm đọc thuần (vd liệt kê cụm + ô nghỉ trước/sau xoay) thì THÊM hàm pure ở :core (không Android) + unit test; KHÔNG nhồi UI vào Core.
- Expose state cho Compose qua immutable snapshot (StateFlow/State) — chỉ recompose vỏ khi điểm/lượt đổi.

Acceptance: GameSession chạy headless được (gọi tuần tự cho cùng kết quả với cùng seed+input); render đọc snapshot đúng.
Kiểm chứng: :core:test xanh; thêm test holder: cùng seed + cùng chuỗi input ⇒ cùng điểm/state cuối.
```

## Prompt 2 — Input: chọn mảnh, chọn trục, preview ô đặt, hard-drop

```
Mục tiêu: điều khiển đặt mảnh khớp luật + có preview như game-screen.jsx.

Đọc trước: game-screen.jsx (chọn slot + preview), core/.../Placement.kt (hardDrop 4 hướng, canPlaceAnywhere), 01-drop-squash.md.

Việc:
- Chọn mảnh ở Tray (selectedIndex) → kéo/di trên bàn: tính lateralIndex theo trục vuông góc trọng lực; hiển thị PREVIEW vị trí hard-drop (ô đích mờ/viền) đọc từ Core (Placement.hardDrop).
- Thả: nếu hợp lệ → GameSession.place qua Core, phát onPiecePlaced (kích Effect 01). Không xuyên khe; chờm biên = invalid (rung/lắc nhẹ báo lỗi, không đặt).
- Hỗ trợ đủ 4 hướng trọng lực. Mảnh đang kéo dùng JellyBlockRenderer (mắt nhìn theo trọng lực).
- Kéo-thả mượt, không cấp phát trong vòng vẽ preview.

Acceptance: preview đúng điểm chạm cho cả 4 hướng; thả hợp lệ thì đặt + chạy drop&squash; invalid thì báo, không đặt.
Kiểm chứng: chạy app đặt vài mảnh ở ≥2 hướng trọng lực; mô tả; :core:test xanh.
```

## Prompt 3 — Xoay trọng lực: ngân sách lượt + nối Effect 02

```
Mục tiêu: nút xoay tiêu lượt + bàn đổ lại đúng Core + chạy hiệu ứng 02.

Đọc trước: core/.../GravityRotation.kt, EndlessTuning.kt; 02-gravity-rotate.md; FAB (file 02/Prompt5).

Việc:
- GravityRotateButton.onRotate → nếu còn lượt: GameSession xoay qua Core (deterministic), giảm turnsLeft, phát onGravityRotated kèm map ô-cũ→ô-mới để Effect 02 nội suy.
- turnsLeft==0 → FAB xám/disable. Chu kỳ down→left→up→right; HUD mũi tên + mắt xoay (Effect 02).
- Sau xoay nếu thành dòng đầy → tự chạy line-clear + cascade (Effect 03/04).

Acceptance: mỗi lần xoay đúng 1 bước 90°, tiêu 1 lượt, hết lượt thì khoá; bàn cuối == Core; nối tiếp clear/cascade nếu có.
Kiểm chứng: chạy app xoay tới hết lượt; quan sát cascade; :core:test xanh.
```

## Prompt 4 — Xóa/cascade/combo + điểm + điều kiện thua

```
Mục tiêu: nối resolve dây chuyền + điểm + thua vào render/effect/Result.

Đọc trước: core/.../LineClearing.kt, Resolve.kt, ClusterPhysics.kt; 03/04-effects; result-screen (file 03/Prompt5).

Việc:
- Sau mỗi lần đặt/xoay: GameSession chạy resolve của Core (clear → collapse → re-check) và phát chuỗi sự kiện onLinesCleared/onCascadeStep cho EffectController theo từng nhịp; cập nhật điểm/combo từ Core.
- Khay hết 3 mảnh → phát 3 mảnh mới qua Core (Rng). Thua = không mảnh nào trong khay đặt được ở đâu (Core.canPlaceAnywhere cho cả khay) → mở Dialog game-over (non-dismissable) → Result.
- Điểm: animate số tăng; combo hiển thị ComboPopup. Tất cả con số LẤY TỪ Core (không tự cộng ở UI).

Acceptance: cascade/combo/điểm khớp Core; thua đúng lúc; Result hiện điểm/kỷ lục đúng.
Kiểm chứng: chơi tới thua một ván; số điểm == engine; :core:test xanh (gồm golden resolve).
```

## Prompt 5 — Pause + AdMob hook (sự kiện, không đổi luật)

```
Mục tiêu: gắn pause + điểm chèn quảng cáo theo sự kiện, đúng nghiệp vụ F2P, không ảnh hưởng Core.

Đọc trước: app/.../ads/AdsManager.kt, AdsConfig.kt; docs/01-nen-tang/01-nghiep-vu.md (vị trí ad: interstitial theo sự kiện, rewarded hồi sinh/x2); Dialog (file 02/Prompt7).

Việc:
- Pause Dialog (Tiếp tục / Về Home) khớp design; dừng game loop khi pause (giữ state).
- Hook AdMob: interstitial theo sự kiện (vd sau N ván/return-to-home) preload trước; rewarded cho "Hồi sinh" và "x2" ở Result. SDK init nền, preload sớm (chống giật main-thread).
- Quảng cáo là Service ở :app — KHÔNG để :core/:game biết tới ad. Tôn trọng luồng một chiều.

Acceptance: pause giữ state + resume đúng; rewarded hồi sinh/x2 hoạt động (test ad unit); interstitial preload, không khựng khi hiện.
Kiểm chứng: chạy với test ad id; pause/resume; bấm hồi sinh/x2 ở Result; xác nhận main-thread không khựng lúc load.
```
