# Hệ dạy luật / Hướng dẫn (Guide & Teach System)

Lớp **UX onboarding** dạy người chơi các cơ chế chữ ký ngay trong lúc chơi, **một lần mỗi luật**,
và là hạ tầng **tái dùng** cho trang "Hướng dẫn / Đã đạt được" sau này.

> Cơ chế được dạy đầu tiên — *Combo hồi lượt xoay* — định nghĩa ở
> [`business-understanding.md §6`](business-understanding.md) và [`mechanics-ideas.md` A8].
> Logic thuần ở `:core` là `ComboReward.rotationRefund(before, after)`.

## Mục tiêu

- Người chơi **hiểu nhanh** rằng tạo combo (≥ ×2) sẽ **hồi lượt xoay trọng lực**, thay vì badge FAB
  âm thầm +1 ở góc khay mà không ai để ý.
- Chỉ hiện **một lần** cho mỗi luật (không làm phiền), nhưng **bền hoá** để sau xem lại được.
- Dựng **chung** để mỗi luật/thành tựu mới chỉ cần thêm một mục dữ liệu, không viết lại UI.

## Kiến trúc (tất cả ở `:app`, gói `ui/guide/`)

| Thành phần | Vai trò |
|---|---|
| `GjGuideEntry` | Model một mục: `id`, `icon`, `title`, `body` (AnnotatedString — bôi đậm phần quan trọng), `demo` (Composable tuỳ chọn). |
| `GjGuide` | Registry — nguồn sự thật. `GjGuide.all` để trang review lặp; `GjGuide.byId(id)`. Mục đầu: `comboRefill`. |
| `GuideCardContent` | Renderer chung: vẽ `demo` + `body`. Dùng CHO CẢ popup lẫn từng dòng trang Hướng dẫn tương lai. |
| `GuideTeachDialog` | Popup dạy-lần-đầu: bọc `GjDialog` chung + nút "Đã hiểu" (`dismissable=false`, bắt buộc xác nhận). |

Minh hoạ (`demo`) dùng **đúng component thật của game** — `ComboPopup` (×N rainbow) và
`GravityRotateButton` (FAB + badge) — cho người chơi nhận ra ngay vật mình vừa thấy trên bàn, thay
vì hình vẽ giả. Bám design system theo skill `design-fidelity`.

## Bền hoá

- `GjSettings.seenGuides: Set<String>` (DataStore key `seen_guides`, kiểu `stringSetPreferencesKey`).
- `SettingsRepository.markGuideSeen(id)` — cộng dồn id, idempotent.
- Mỗi luật/thành tựu = **một id** → mở rộng vô hạn, trang review chỉ cần lọc `GjGuide.all` theo `seenGuides`.

## Luồng kích hoạt (combo → popup)

Luồng một chiều, tôn trọng ranh giới 3 lớp (Core không gọi ngược UI):

1. **`:core`** — `EndlessEngine.applyComboRefund` phát `GameEvent.RotationRefunded(amount, budgetAfter)`
   **chỉ khi thật sự hồi** (`granted > 0`; không trần, không bật khi đầy budget).
2. **`:game`** — `EndlessGameHolder.detectRotationRefill(events)` thấy sự kiện đó → tăng
   `rotationRefillTick` (state Compose). Bắt ở CẢ đặt mảnh lẫn xoay; độc lập haptic (chạy cả khi tắt rung).
3. **`:app`** — `EndlessPlayScreen` quan sát `rotationRefillTick`; nếu tick > 0 **và** `comboRefill.id`
   chưa có trong `seenGuides` → **trễ ~900ms** (cho người chơi thấy combo ×N + badge tăng trước) → mở
   `GuideTeachDialog`. Bấm "Đã hiểu" → `onGuideSeen(id)` (lưu DataStore) → không hiện lại.

`seenGuides` + `onGuideSeen` được truyền `MainActivity → EndlessGameScreen → EndlessPlayScreen`.

### Điều kiện hiện / không hiện
- **Hiện**: combo bất kỳ ≥ ×2 có hồi lượt (×2, ×3, ×4…) — không cố định ×2.
- **Không hiện**: xóa đơn (×1, không dây chuyền) vì không hồi lượt; hoặc đã xem rồi (`seenGuides`).

## Nội dung mục `comboRefill`

- Tiêu đề: **Combo hồi lượt xoay**, icon `RotateCw`.
- Body (4 dòng, căn giữa, font Display/Baloo, highlight ExtraBold):
  *Xóa **combo ×2** trở lên / được **+1 lượt xoay**. / Combo càng dài / lượt hồi càng nhiều!*
  ("combo ×2" cam = Primary; "+1 lượt xoay" tím = Gravity).
- Demo: `ComboPopup(combo=2)` → mũi tên → `GravityRotateButton` + "+1".

## Mở rộng về sau

- **Thêm luật mới**: thêm một `GjGuideEntry` vào `GjGuide.all` + bắn tín hiệu trigger tương ứng (theo
  mẫu `rotationRefillTick`). KHÔNG tạo cờ boolean riêng lẻ cho từng popup.
- **Trang "Hướng dẫn / Đã đạt được"**: lặp `GjGuide.all`, render mỗi mục bằng `GuideCardContent`,
  đánh dấu mục đã/để chưa mở theo `seenGuides`.

## Lưu ý dev

- Gói build demo là **`com.gravityjelly.app.demo`** (flavor demo có suffix `.demo`). Để xem lại popup
  từ đầu khi đang chỉnh, reset cờ bằng `adb shell pm clear com.gravityjelly.app.demo` (mất best/settings
  local). Đừng nhầm sang `com.gravityjelly.app`.
