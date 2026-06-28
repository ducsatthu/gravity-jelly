# Gravity Jelly — Android scaffold

Khung dự án Android native (Kotlin) theo kiến trúc 3 lớp trong `CLAUDE.md`. Đây là **bộ xương để code bám vào**, phần lớn là stub có `TODO`; luật chơi/visual sẽ thêm dần.

## Mở & build

1. Mở thư mục này bằng **Android Studio** (Giraffe trở lên). Studio sẽ tự sync Gradle.
2. **Gradle wrapper jar chưa kèm** (file nhị phân). Sinh bằng một trong hai cách:
   - Android Studio: bấm Sync — nó tự tạo, hoặc
   - Terminal có Gradle 8.9: chạy `gradle wrapper --gradle-version 8.9`.
3. Cần **JDK 17** và **Android SDK 35**. Tạo `local.properties` trỏ `sdk.dir` (Studio tự làm).
4. Chạy app: module `:app` → Run. Hiện một bàn 9×9 trống (placeholder) vẽ bằng `:game`.

Kiểm thử `:core` (không cần thiết bị): `./gradlew :core:test`.

## Cấu trúc module (luồng một chiều: input → core → game → services)

| Module | Loại | Vai trò |
|--------|------|---------|
| `:core` | Kotlin/JVM thuần | Luật chơi, model lưới 9×9, `Rng` seed (SplitMix64), `Level` (khớp JSON schema). Headless cho solver/bot. Có unit test. KHÔNG import Android. |
| `:game` | Android library + Compose | `GameClock`/`rememberRenderTicker` (vòng lặp `withFrameNanos`, fixed-timestep) + `BoardCanvas` (vẽ cả bàn trong MỘT Canvas, allocation-free). Đọc state Core để vẽ. |
| `:app` | Android application | Vỏ: `MainActivity`, Compose **theme dịch từ design tokens**, lắp `:core`+`:game`. Sau này: điều hướng Home/Map/Game/Settings, DataStore, AdMob. |

## Theme = design system tokens

`app/src/main/kotlin/.../ui/theme/` dịch 1:1 từ `design/Gravity Jelly Design System/01-tokens/`:

- `Color.kt` ← 01-colors.css (kem #FFF7EC, 4 khối jelly, primary cam #FF9F68, gravity tím #7E6CF0…).
- `Type.kt` ← 02-typography.css (cấp bậc cỡ chữ; **TODO** thêm font Fredoka/Nunito vào `res/font`).
- `Dimens.kt` ← 03-spacing-radius + 04-dimensions. `Shape.kt` ← radius. `Theme.kt` gói lại.

## Việc tiếp theo (gợi ý)

1. `:core` — hiện thực hard-drop 4 hướng, physics cụm (connected-component gravity), resolve cascade, điều kiện thua + unit/golden test (xem `TODO(core)`).
2. `:core` — parser JSON màn + generator + solver (BFS/IDA*) chạy headless.
3. `:game` — vẽ khối-có-mắt, preview rơi, particle xóa (object pool), nội suy alpha; cú xoay trọng lực.
4. `:app` — điều hướng + màn Map (Compose vỏ + Canvas đường/node), DataStore tiến độ sao, AdMob preload theo sự kiện.

Tham chiếu thiết kế: `docs/level-design.md`, `docs/ui-map-screen.md`, `docs/prompts-map/`, và `design/`.
