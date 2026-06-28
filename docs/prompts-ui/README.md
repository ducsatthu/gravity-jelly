# Prompts cho Claude Code — UI / Render bám Design System

Bộ prompt để Claude Code hiện thực **lớp nhìn (`:game` + `:app`)** của Gravity Jelly cho **khớp với Design System** đã thiết kế sẵn bằng React/JSX — gồm cả **hiệu ứng** và **gameplay**. Logic ở `:core` đã có và **giữ nguyên**; bộ này chỉ lo *render đúng như design*.

> Lý do tồn tại: hiện `:core` (luật chơi) khá đầy đủ, nhưng lớp render Kotlin **chưa bám design** — component, bố cục, độ "juicy" của khối, và 5 hiệu ứng phần lớn chưa giống các file design. Bộ prompt này đưa lớp nhìn về đúng nguồn chân lý là `design/Gravity Jelly Design System/`.

## Nguồn chân lý (Claude Code PHẢI đọc trước khi code)

Mọi giá trị, màu, kích thước, motion, hành vi component lấy **trực tiếp** từ:

```
design/Gravity Jelly Design System/
├── 00-index.md                      ← mục lục, thứ tự đọc
├── readme.md                        ← foundation: voice, màu, type, vibe
├── CLAUDE.md                        ← brand + token chốt (màu/dp/radius)
├── 01-tokens/                       ← colors, typography, spacing-radius, dimensions, motion (.css)
│   └── cards/*.card.html            ← specimen để so mắt
├── 02-foundations/                  ← JellyBlock, Eyes, Icon (.jsx + .prompt.md + .card.html)
├── 03-components/                   ← Button, Hud, Tray, GravityRotateButton, ComboPopup, Dialog
├── 04-screens/                      ← game / home / result / settings / level-map (.jsx + .card.html)
└── 05-effects/                      ← 5 spec motion (.md) + effects.card.html
```

Quy ước design: mỗi atom/component có **`*.prompt.md`** (đặc tả hành vi + props) và **`*.card.html`** (specimen để so mắt). Khi prompt nói "khớp card", nghĩa là mở `*.card.html` tương ứng và so trực quan.

## Token đã dịch sẵn sang Kotlin (tái dùng, đừng hardcode lại)

- Màu: `app/.../ui/theme/Color.kt` (`GjPalette`) và `game/.../JellyTheme.kt` (`BlockPalette`).
- Spacing / radius / dimensions: `app/.../ui/theme/Dimens.kt` (`GjSpace`, `GjRadius`, `GjBorder`, `GjDimens`).
- Helper vẽ khối: `game/.../JellyDraw.kt`, theme khối: `game/.../JellyTheme.kt`.

Nếu thiếu token (vd motion easing, type scale) thì **thêm object token mới** dịch 1:1 từ `01-tokens/*.css` — KHÔNG rải hằng số ma thuật trong code vẽ.

## Cách dùng

- Chạy Claude Code **trong repo** `gravity-jelly`. Mỗi mục `Prompt N` là một lần giao việc — **copy nguyên khối ```` ``` ````, dán vào Claude Code**, chạy lần lượt.
- Mỗi prompt là một chunk **cỡ-một-PR**, có **Acceptance** + **Kiểm chứng**. Đừng gộp nhiều prompt vào một lần.
- Thứ tự chạy theo phụ thuộc (file đánh số): **01 Block → 02 UI → 03 Bố cục → 04 Hub → 05 Hiệu ứng → 06 Gameplay → 07 Kiểm chứng**. Trong mỗi file, chạy Prompt theo số.
- **Claude Code tự quyết** giữ/sửa hay dựng lại từng file render cũ — miễn đạt mục tiêu fidelity + Acceptance của prompt. Không bắt buộc bảo toàn code render hiện có.

## Ràng buộc xuyên suốt (mọi prompt phải tuân)

1. **Kiến trúc 3 lớp + luồng một chiều.** Luật chơi chỉ ở `:core` (thuần Kotlin). `:game` **chỉ đọc** state Core để vẽ — KHÔNG thêm luật chơi vào `:game`/`:app`. `:core` KHÔNG gọi ngược. Nếu thấy thiếu API đọc-state ở Core, **thêm hàm thuần đọc** (pure, không Android), không nhồi UI logic vào Core.
2. **Deterministic giữ nguyên.** Không đụng RNG/luật ở `:core`. Render chỉ là hàm của (state Core + thời gian animation). Cùng state ⇒ cùng khung hình tĩnh.
3. **Chống giật (bắt buộc).** Vẽ cả bàn trong **MỘT Canvas**. KHÔNG một Composable/View cho mỗi ô. KHÔNG cấp phát trong vòng vẽ (tái dùng `Paint`/`Path`/mảng; object pool cho particle/popup). Game-state nằm **ngoài** Compose; chỉ recompose lớp vỏ khi state UI đổi (điểm, lượt xoay). Game loop theo vsync (`withFrameNanos`). Ngân sách main-thread/khung < ~8ms.
4. **Bám token, không hardcode.** Mọi màu/khoảng cách/bo góc/độ dài motion lấy từ token (`GjPalette`/`GjSpace`/…); nếu chưa có thì thêm token mới dịch từ `01-tokens/`.
5. **Hướng đối tượng.** Mỗi hạng mục là một đối tượng/lớp có trách nhiệm rõ: vd `JellyBlockRenderer`, `EffectController`, `ParticlePool`, các state-holder (`GameUiState`, `HomeUiState`) — không gom mọi thứ vào một `@Composable` khổng lồ. Tách *vẽ* (DrawScope helper) khỏi *điều phối* (controller/state) khỏi *bố cục* (Composable vỏ).
6. **Reduced-motion & Settings.** Tôn trọng cờ rung (vibration) và reduced-motion: bỏ particle/float, giữ chuyển state tức thời.
7. **Tiếng Việt** cho copy UI và comment quan trọng; số kiểu VN (`12.480`). Emoji: không dùng — tính cách đến từ nhân vật jelly + motion.

## Phương pháp kiểm chứng fidelity (dùng ở mọi prompt)

Sau mỗi prompt, Claude Code phải tự kiểm theo thứ tự:

1. **Build + test:** `./gradlew :app:assembleDebug` xanh; `./gradlew :core:test` vẫn xanh (không được làm hỏng Core).
2. **So card design:** mở `*.card.html`/`*.jsx` của hạng mục, đối chiếu màu/kích thước/khoảng cách/bo góc/hành vi với token. Liệt kê sai lệch còn lại (nếu có) ở cuối báo cáo.
3. **Token adherence:** grep đảm bảo không có literal màu/dp rải rác ngoài lớp token; mọi giá trị truy ra một token có tên.
4. **Ảnh chụp (khi đụng màn hình/hiệu ứng):** chụp Preview/Compose của màn/hiệu ứng tương ứng (dùng `@Preview` đã có như `EffectPreviews.kt`) và mô tả khác biệt so với card.
5. **Frame budget (khi đụng gameplay/hiệu ứng):** xác nhận vòng vẽ allocation-free (không tạo object trong `DrawScope`/`withFrameNanos`).

Báo cáo cuối mỗi prompt: *(a)* tệp đã đổi, *(b)* token dùng, *(c)* sai lệch so design còn lại, *(d)* kết quả build/test.

## Bản đồ file ↔ hạng mục người dùng yêu cầu

| File | Hạng mục | Design nguồn |
|---|---|---|
| `01-block.md` | **Block** | `02-foundations/01-jelly-block`, `02-eyes` |
| `02-ui.md` | **UI** | `02-foundations/03-icon`, `03-components/*` |
| `03-bo-cuc.md` | **Bố cục** | `04-screens/game-screen.jsx`, `phone-frame.jsx`, result/settings |
| `04-hub.md` | **Hub** | `04-screens/home-screen.jsx`, `index.html` |
| `05-hieu-ung.md` | **Hiệu ứng** | `05-effects/01..05` |
| `06-gameplay.md` | **Gameplay** | nối `:core` ↔ render + input |
| `07-kiem-chung.md` | Verify | toàn bộ card + frame budget |
