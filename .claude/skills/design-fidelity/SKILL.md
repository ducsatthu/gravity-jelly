---
name: design-fidelity
description: Bắt buộc đọc thiết kế trước khi đổi/điều chỉnh giao diện hoặc hiệu ứng. Dùng khi sửa UI Compose, màn hình, animation, mắt/khối jelly, màu/typography/spacing/motion, hoặc khi thêm hiệu ứng mới. KHÔNG tự chế giá trị/hiệu ứng — bám design system trong design/Gravity Jelly Design System/.
---

# Design fidelity — luôn đọc thiết kế trước khi đụng UI

Repo này có **design system nguồn-sự-thật** ở `design/Gravity Jelly Design System/`.
Mọi thay đổi giao diện/hiệu ứng phải bám design đó. **KHÔNG tự chế** màu, kích thước,
timing, easing, hay hiệu ứng mới khi design đã quy định.

## Khi nào áp dụng (bắt buộc)
Trước khi: sửa Composable/màn hình, chỉnh layout/spacing/màu/typography, thêm hoặc đổi
**animation/hiệu ứng** (mắt jelly, squash, rơi, xoay trọng lực, xóa hàng, combo, particle…),
chỉnh icon/button/HUD/tray/dialog, hoặc khi user nói "theo thiết kế / đúng design".

## Quy trình
1. **Đọc design liên quan TRƯỚC KHI code** (đừng đoán từ trí nhớ):
   - Tokens: `01-tokens/` — `01-colors.css`, `02-typography.css`, `03-spacing-radius.css`,
     `04-dimensions.css`, `05-motion.css` (duration/easing chuẩn). Bảng token đầy đủ cũng có trong
     `_ds_manifest.json` (field `tokens`).
   - Foundations: `02-foundations/` — `01-jelly-block`, `02-eyes` (Eyes.jsx: expression normal/front/
     happy/focus/smug/wink + blink), `03-icon`.
   - Components: `03-components/` — `01-button`, `02-hud`, `03-tray`, `04-gravity-rotate-button`,
     `05-combo-popup`, `06-dialog`, `07-jelly-scene` (mỗi cái có `.jsx` + `*.card.html`).
   - Screens: `04-screens/` — `home-screen.jsx`, `game-screen.jsx`, `screen-*-*.card.html`, level map…
   - **Effects (animation): `05-effects/`** — `01-drop-squash`, `02-gravity-rotate`, `03-line-clear`,
     `04-collapse-combo`, `05-particles-juice`, và **`effects.card.html`** (keyframes + timing thật:
     chớp mắt, nháy mắt, focus, happy, fall-squash…). Đọc cả file `.md` (bảng token) lẫn keyframes.
   - Ảnh render mẫu: `screenshots/`.
2. **Map token design → token code** (đã có trong app): màu `GjPalette`, type `Type.kt`/`GjLogoFontFamily`,
   spacing `GjSpace`, radius `GjRadius`, motion (duration/easing) theo `05-motion.css`. Vẽ jelly/mắt:
   tái dùng `:game` (`drawJellyBlock`, `drawEyes` với expression + `open`, `drawSticker`) — đừng vẽ lại tay.
   Lưu ý chữ tiếng Việt KHÔNG dùng Fredoka (thiếu glyph) → display = Baloo 2 (xem memory fonts-vietnamese).
3. **Khi design KHÔNG mô tả được logic** (vd hiệu ứng idle tổ hợp): tổ hợp từ **vocabulary có sẵn của design**
   (đúng expression, đúng duration/easing token, đúng biên độ squash của effect tương ứng), KHÔNG bịa con số.
   Ghi chú rõ trong code mình tham chiếu panel/effect nào.
4. **Chống giật** vẫn bắt buộc theo CLAUDE.md: một Canvas, allocation-free, frame loop `withFrameNanos`,
   đọc state trong draw phase (redraw, không recompose), deterministic (seed, không Random toàn cục).
5. **Verify bằng máy thật**: build `./gradlew :app:installDebug`, chụp `adb exec-out screencap`, so với
   `screenshots/` hoặc `*.card.html` của design.

## Nguyên tắc
- Có con số trong design (px/dp, ms, easing, màu hex) → dùng đúng, không làm tròn tùy ý.
- Thấy lệch giữa design và code hiện tại → nêu ra, hỏi/đề xuất, đừng âm thầm đổi.
- Trong commit/diff, chú thích nguồn design (file + panel/token) cho mỗi giá trị "ma thuật".
