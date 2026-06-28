# 03 · Bố cục — Layout & màn chơi (game-screen, result, settings)

Hạng mục **Bố cục**: ráp các atom (file 01) + component (file 02) thành **màn hình** đúng tỉ lệ và vùng như design. Trọng tâm là **màn Game** (ưu tiên #1): HUD trên · bàn 9×9 trong giếng lõm + nền cảnh JellyMeadow · tray dưới · FAB xoay nổi.

**Design nguồn:**
- `04-screens/game-screen.jsx` (bố cục Game + `JellyMeadow` band) + `screen-1-game.card.html`
- `04-screens/board.jsx` (char-map → 9×9 clustered), `04-screens/phone-frame.jsx` (khung máy 360×800)
- `04-screens/result-screen.jsx` + `screen-3-result.card.html`
- `04-screens/settings-screen.jsx` + `screen-4-settings.card.html`
- Token kích thước: `01-tokens/04-dimensions.css` (cell 36 / board 340 / hud 56 / tray 96 / FAB 64 / cta 56).

**Kotlin hiện có:** `game/.../BoardCanvas.kt`, `EndlessScreen.kt`, `EndlessGameHolder.kt`; `app/.../EndlessGameScreen.kt`, `SettingsScreen.kt`. Claude Code tự quyết refactor/dựng lại.

**Baseline thiết bị:** portrait **360×800 dp**, gutter 16dp, touch ≥ 48dp, mọi thứ trên lưới 4dp.

---

## Prompt 1 — Khung máy & nền (phone baseline + cream + safe area)

```
Mục tiêu: nền + scaffold chung đúng baseline trước khi dựng màn.

Đọc trước: 04-screens/phone-frame.jsx; readme.md (Backgrounds: cream phẳng / radial nhẹ); CLAUDE.md (360×800, gutter 16dp).

Việc:
- Tạo một scaffold gốc (vd GjScreenScaffold) áp nền cream #FFF7EC (hoặc radial nhẹ cream→cream ấm), insets an toàn, gutter 16dp, nội dung canh theo lưới 4dp.
- Không phụ thuộc kích thước cố định 360×800 — co giãn cho màn cao hơn, nhưng giữ tỉ lệ phần tử như design.

Acceptance: nền + padding + safe area khớp tông design; chạy ổn ở vài kích thước màn.
Kiểm chứng: @Preview scaffold rỗng + một Button; so tông nền card.
```

## Prompt 2 — `BoardCanvas`: bàn 9×9 trong giếng lõm (MỘT Canvas)

```
Mục tiêu: bàn chơi vẽ TRỌN trong một Canvas, đúng giếng lõm + ô trống + khối jelly.

Đọc trước: 04-screens/board.jsx, screen-1-game.card.html; token 04-dimensions (cell 36 / gap 2 / board 340 / margin 10 / pad 8); chống-giật checklist (README mục Ràng buộc 3).

Việc:
- BoardCanvas đọc state Core (lưới 9×9 + màu/cluster) và vẽ TẤT CẢ trong một Canvas duy nhất: giếng lõm (surface-sunken + inset shadow), ô trống (cell-empty + hairline cell-line), khối jelly qua JellyBlockRenderer (file 01) gồm mắt theo trọng lực + sticker.
- KHÔNG một Composable/ô. KHÔNG cấp phát trong vòng vẽ (precompute toạ độ ô, tái dùng Paint/Path/pool).
- API đọc-state: nếu Core thiếu hàm đọc lưới/cluster thuần (pure, không Android), thêm hàm đọc ở :core — KHÔNG nhồi vẽ vào Core.

Acceptance: bàn 9×9 + giếng lõm + khối jelly khớp board.jsx/screen-1-game card; vòng vẽ allocation-free.
Kiểm chứng: @Preview bàn từ một char-map mẫu (giống board.jsx); so card; xác nhận không new object trong DrawScope.
```

## Prompt 3 — `JellyMeadow`: dải nền cảnh giữa bàn (trang trí, không che khối)

```
Mục tiêu: dải cảnh jelly mềm "ở mãi" sau bàn, đúng game-screen.jsx.

Đọc trước: 04-screens/game-screen.jsx (hàm JellyMeadow: đồi tầng, nền cỏ, hoa đung đưa, nấm, nhân vật ló, orb trôi, sparkle).

Việc:
- Vẽ band trang trí phía sau/đáy vùng bàn: đồi tầng tạo chiều sâu, vạch cỏ, hoa sway, nấm, vài nhân vật jelly nhỏ, orb trôi, sparkle. Theme mint/pink/yellow như JSX.
- Animation rất nhẹ (sway/float) — tách khỏi vòng vẽ bàn; tôn trọng reduced-motion (đứng yên).
- Band STAYS khi combo nổ — ComboPopup chỉ nổi phía trên, không thay thế band.

Acceptance: band khớp cảm giác JellyMeadow (đồi/cỏ/hoa/nấm/orb), không che khối board, đứng yên khi reduced-motion.
Kiểm chứng: @Preview vùng bàn + band; so game-screen card.
```

## Prompt 4 — Ráp màn Game: HUD + board+band + Tray + FAB

```
Mục tiêu: màn Game hoàn chỉnh đúng bố cục dọc của game-screen.jsx (ưu tiên #1).

Đọc trước: 04-screens/game-screen.jsx (GameScreen layout), screen-1-game.card.html.

Việc:
- Ráp theo thứ tự dọc: Hud (56dp) trên cùng → vùng bàn (BoardCanvas + JellyMeadow, board 340dp trong giếng) ở giữa → Tray (112dp) dưới → GravityRotateButton (64dp) nổi bên phải tray.
- Dùng đúng component file 02 + canvas file 03/Prompt2-3. Truyền score/direction/turnsLeft/pieces/selectedIndex từ một state-holder (GameUiState) — chưa cần logic thật, dữ liệu mẫu cũng được (nối Core ở file 06).
- Tách rõ: Composable vỏ (bố cục) ≠ Canvas (vẽ) ≠ state-holder.

Acceptance: màn Game khớp screen-1-game.card.html về thứ tự/tỉ lệ vùng; FAB nổi đúng chỗ; HUD/tray đúng cao.
Kiểm chứng: @Preview GameScreen dữ liệu mẫu; so card.
```

## Prompt 5 — Màn Result (điểm cuối/kỷ lục, x2 QC, hồi sinh, chơi lại, home)

```
Mục tiêu: màn Result khớp 04-screens/result-screen.jsx.

Đọc trước: result-screen.jsx, screen-3-result.card.html.

Việc:
- ResultScreen(score, best, onReviveAd, onDoubleAd, onReplay, onHome). Hiển thị điểm cuối + kỷ lục (số VN), các action: "Hồi sinh · xem QC", "x2 · xem QC", "Chơi lại", "Về Home" bằng Button đúng variant.
- Dùng Dialog/card mềm theo design; copy tiếng Việt như readme (voice).

Acceptance: bố cục + copy + nút khớp result card.
Kiểm chứng: @Preview Result với score<best và score==best(kỷ lục mới); so card.
```

## Prompt 6 — Màn Settings (âm thanh/nhạc/rung, ngôn ngữ, info)

```
Mục tiêu: màn Settings khớp 04-screens/settings-screen.jsx (giữ nối DataStore hiện có nếu có).

Đọc trước: settings-screen.jsx, screen-4-settings.card.html; app/.../data/SettingsRepository.kt.

Việc:
- SettingsScreen: toggle Âm thanh / Nhạc / Rung, chọn ngôn ngữ (vi/en), mục thông tin. Dùng component design (toggle/row mềm), copy tiếng Việt.
- Nối các toggle vào SettingsRepository hiện có (đọc/ghi); rung tôn trọng ở hiệu ứng (file 05).

Acceptance: layout + toggle + ngôn ngữ khớp settings card; thay đổi lưu qua repository.
Kiểm chứng: @Preview Settings; build; bật/tắt toggle thấy state đổi.
```
