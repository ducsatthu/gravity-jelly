# Architecture — Gravity Jelly (Android Native, Kotlin)

Tài liệu kiến trúc dự án. Đầu vào: [`01-nghiep-vu.md`](01-nghiep-vu.md) và [`02-ky-thuat.md`](02-ky-thuat.md). Mục tiêu: chốt **cấu trúc dự án**, **tiêu chuẩn code**, và **rules** trước khi viết dòng code đầu tiên. Chưa triển khai code ở đây.

Bốn ràng buộc xếp theo ưu tiên (kim chỉ nam cho mọi quyết định bên dưới): **triển khai nhanh → dễ maintain → bền lâu dài → mượt không giật**.

---

## 1. Nguyên tắc kiến trúc

### 1.1. Clean Architecture ánh xạ vào 3 module

Dự án áp dụng Clean Architecture ở dạng **tinh gọn, đủ dùng** — không bê nguyên 4 vòng tròn hàn lâm, mà ánh xạ luật "dependency hướng vào trong" lên đúng 3 module Gradle đã chốt.

```
        ┌─────────────────────────────────────────────┐
        │  :app   (Frameworks & Drivers / Presentation)│
        │  Compose UI, Navigation, Services, DI         │
        └───────────────┬──────────────┬───────────────┘
                        │              │
                        ▼              ▼
        ┌───────────────────────┐     │
        │  :game (Presentation) │     │
        │  Render, GameLoop,     │     │
        │  Animation, Input      │     │
        └───────────┬───────────┘     │
                    │                  │
                    ▼                  ▼
        ┌─────────────────────────────────────────────┐
        │  :core  (Domain + Use Cases)                  │
        │  Pure Kotlin/JVM · luật chơi · deterministic  │
        │  KHÔNG import Android                          │
        └─────────────────────────────────────────────┘
```

| Vòng Clean Architecture | Module | Nội dung |
|---|---|---|
| Entities (Domain) | `:core` | Model lưới, mảnh, cụm, hướng trọng lực, GameState bất biến |
| Use Cases (Application) | `:core` | Hard-drop, cluster gravity, resolve cascade, scoring, lose check, rotate gravity, RNG seed |
| Interface Adapters (Presentation) | `:game` | GameLoop, Renderer, Animation, Particle, Input mapping (đọc state Core → vẽ) |
| Frameworks & Drivers | `:app` | Compose UI, Navigation, AdMob, Play Games, DataStore, DI, lắp ráp |

> **Quy tắc vàng:** dependency chỉ chảy **vào trong** (`:app → :game → :core`, và `:app → :core`). `:core` không biết gì về `:game`/`:app`. Không có chiều ngược lại.

### 1.2. Luồng dữ liệu một chiều (Unidirectional Data Flow)

```
Input (gesture/nút)
   → :game map thành Core Action
      → :core reduce(state, action) = state mới + chuỗi state trung gian (StepResult)
         → :game đọc StepResult để nội suy/animate và vẽ lên Canvas
            → :app nhận domain event (ghi điểm, trigger ad, lưu DataStore)
```

`:core` **không bao giờ** gọi ngược `:game`/`:app`. Nó nhận `Action` vào, trả `State`/`Event` ra. Side-effect (ad, lưu trữ, âm thanh) do lớp ngoài quan sát state/event mà thực hiện.

### 1.3. Vì sao biên giới này quan trọng

- **Test & solver:** `:core` chạy headless trên JVM → unit test nhanh, golden test bảo vệ determinism, và là nền cho solver (BFS/IDA*) + bot cân bằng Endless.
- **Thay render không đụng luật:** nếu sau này phải escalate sang SurfaceView/LibGDX (phương án dự phòng), chỉ thay `:game`, `:core` đứng yên.
- **Daily seed:** determinism trong `:core` là điều kiện đủ để tái tạo y hệt một run từ seed.

---

## 2. Cấu trúc dự án

### 2.1. Cây thư mục cấp gốc

```
gravity-jelly/
├── settings.gradle.kts              # khai báo 3 module + dependency resolution
├── build.gradle.kts                 # root build, áp convention plugin
├── gradle.properties                # JVM args, AndroidX, config cache
├── gradle/
│   └── libs.versions.toml           # Version Catalog — nguồn version DUY NHẤT
├── build-logic/                     # Convention plugins (Gradle composite build)
│   └── convention/
│       └── src/main/kotlin/         # *.gradle.kts dùng chung cho các module
├── config/
│   ├── detekt/detekt.yml            # rule tĩnh
│   └── ktlint/                      # format
├── docs/                            # tài liệu (đánh số theo nhóm; file này ở 01-nen-tang/)
│   ├── 00-muc-luc.md                # mục lục tổng
│   ├── 01-nen-tang/                 # nghiệp vụ · kỹ thuật · kiến trúc
│   ├── 02-thiet-ke-man/             # schema · hệ mục tiêu · world specs
│   ├── 03-co-che/                   # kho ý tưởng · combo
│   ├── 04-ui-ux/                    # component in-game · map · guide
│   ├── 05-prompts/                  # prompt Claude Design/Code (artifact)
│   └── 06-du-lieu/                  # spreadsheet thiết kế màn
├── core/                            # :core — pure Kotlin/JVM
├── game/                            # :game — render + game loop (Android lib)
└── app/                             # :app — application (Android app)
```

### 2.2. `:core` — Domain + Use Cases (pure Kotlin/JVM, KHÔNG Android)

Module `java-library` / `kotlin("jvm")` thuần. **Tuyệt đối không** có dependency Android (kiểm tra: không `android.*`, không `androidx.*`, không `compose`).

```
core/
├── build.gradle.kts                 # kotlin("jvm") — KHÔNG android plugin
└── src/
    ├── main/kotlin/com/ductranxuan/gravityjelly/core/
    │   ├── model/                   # Entities — dữ liệu bất biến (immutable)
    │   │   ├── Grid.kt              # lưới 9x9, truy cập theo (row, col)
    │   │   ├── Cell.kt              # ô: trống / khối / đá cố định
    │   │   ├── Piece.kt             # hình mảnh + biến thể
    │   │   ├── Tray.kt              # khay 3 mảnh
    │   │   ├── Cluster.kt           # cụm khối dính nhau (connected component)
    │   │   ├── GravityDirection.kt  # UP / DOWN / LEFT / RIGHT
    │   │   ├── Position.kt          # toạ độ lưới (value class)
    │   │   ├── GameState.kt         # snapshot toàn cục bất biến
    │   │   └── GameConfig.kt        # tham số chặng (cỡ lưới, lượt xoay, pool mảnh)
    │   ├── action/
    │   │   └── GameAction.kt        # input chuẩn hoá: PlacePiece, RotateGravity, ...
    │   ├── event/
    │   │   └── GameEvent.kt         # domain event ra ngoài: LineCleared, Combo, GameOver
    │   ├── logic/                   # Use Cases — hàm thuần, không state ẩn
    │   │   ├── HardDrop.kt          # rơi cứng 4 hướng, dừng ở điểm chạm đầu
    │   │   ├── ClusterGravity.kt    # connected-component gravity, cụm cứng
    │   │   ├── ResolveCascade.kt    # xóa hàng/cột → sụp cụm → combo dây chuyền
    │   │   ├── Scoring.kt           # tính điểm + combo
    │   │   ├── LoseCondition.kt     # hết nước đặt được
    │   │   ├── RotateGravity.kt     # xoay 90° → đổ lại cả bàn
    │   │   └── PieceSpawner.kt      # phát khay từ RNG seed
    │   ├── rng/
    │   │   └── SeededRng.kt         # PRNG seed được — nguồn ngẫu nhiên DUY NHẤT
    │   ├── engine/
    │   │   ├── GameReducer.kt       # reduce(state, action): StepResult — trái tim deterministic
    │   │   └── StepResult.kt        # state cuối + chuỗi state trung gian + events
    │   └── headless/                # tiện ích cho solver/bot (không bắt buộc ở MVP)
    │       └── Simulator.kt         # chạy chuỗi action không cần thiết bị
    └── test/kotlin/com/ductranxuan/gravityjelly/core/
        ├── logic/                   # unit test từng use case
        └── golden/                  # golden test: input → chuỗi state cố định
```

**Vai trò trung tâm — `GameReducer`:** `reduce(state, action)` là hàm thuần, trả về `StepResult` gồm (1) state cuối, (2) **chuỗi state trung gian** để `:game` nội suy animation, (3) danh sách `GameEvent`. Đây là API duy nhất `:game` cần để chạy gameplay.

### 2.3. `:game` — Presentation gameplay (Android library)

```
game/
├── build.gradle.kts                 # com.android.library + compose
└── src/main/kotlin/com/ductranxuan/gravityjelly/game/
    ├── loop/
    │   ├── GameLoop.kt              # ticker withFrameNanos, fixed-timestep + accumulator
    │   └── FrameClock.kt            # bọc nguồn thời gian (test thay được)
    ├── engine/
    │   └── GameEngine.kt            # giữ tham chiếu Core state, đẩy action, expose render state
    ├── render/
    │   ├── BoardRenderer.kt         # vẽ CẢ bàn trong MỘT Canvas
    │   ├── DrawResources.kt         # Paint/Path/mảng toạ độ dựng SẴN, tái dùng
    │   └── Camera.kt                # map toạ độ lưới ↔ pixel
    ├── animation/
    │   ├── Tween.kt                 # nội suy có easing
    │   └── Easing.kt
    ├── particle/
    │   └── ParticlePool.kt          # object pool — không cấp phát trong loop
    ├── audio/
    │   └── SoundBank.kt             # preload SFX, không decode trong frame
    ├── input/
    │   └── GestureMapper.kt         # kéo-thả/nút xoay → Core GameAction
    └── ui/
        └── GameSurface.kt           # Composable bọc Canvas (điểm nối với :app)
```

`:game` **đọc** state Core để vẽ, **không** chứa luật chơi. Game state nằm trong `GameEngine` (ngoài Compose); Compose chỉ recompose lớp vỏ khi state UI đổi.

### 2.4. `:app` — Frameworks & Drivers (Android application)

```
app/
├── build.gradle.kts                 # com.android.application + compose + hilt(tuỳ chọn)
└── src/main/kotlin/com/ductranxuan/gravityjelly/app/
    ├── GravityJellyApp.kt           # Application — init SDK ở luồng nền
    ├── MainActivity.kt              # host Compose, edge-to-edge
    ├── navigation/
    │   └── AppNavHost.kt            # điều hướng: Home → Game → Settings → Store
    ├── ui/
    │   ├── home/                    # màn chính, chọn chế độ
    │   ├── game/                    # GameScreen: HUD overlay + GameSurface(:game)
    │   ├── settings/
    │   ├── result/                  # màn kết thúc run (rewarded x2, hồi sinh)
    │   ├── components/              # nút, dialog dùng chung
    │   └── theme/                   # màu, typography, shape
    ├── service/                     # Data layer — tích hợp ngoài
    │   ├── ads/
    │   │   ├── AdManager.kt         # preload interstitial/rewarded, cooldown, ân hạn
    │   │   └── AdEventTrigger.kt    # trigger theo sự kiện (không theo timer thuần)
    │   ├── playgames/
    │   │   └── LeaderboardService.kt# Daily leaderboard (sau MVP)
    │   └── storage/
    │       ├── SettingsStore.kt     # DataStore: cài đặt
    │       └── ProgressStore.kt     # DataStore: điểm cao, seed, tiến độ nhẹ
    └── di/
        └── AppModule.kt             # lắp ráp :core + :game + services
```

### 2.5. Bảng dependency module (bắt buộc tuân thủ)

| Module | Được phép phụ thuộc | TUYỆT ĐỐI KHÔNG |
|---|---|---|
| `:core` | (không gì cả — chỉ stdlib Kotlin) | Android, Compose, `:game`, `:app` |
| `:game` | `:core` | `:app` |
| `:app` | `:game`, `:core` | — |

---

## 3. Tiêu chuẩn code

### 3.1. Ngôn ngữ & style

- **Kotlin official code style.** Format bằng **ktlint**, phân tích tĩnh bằng **detekt** — chạy trong CI, fail build nếu vi phạm.
- Tài liệu dự án viết **tiếng Việt**; **code (tên class/hàm/biến) và KDoc viết tiếng Anh** để chuẩn quốc tế và dễ tra cứu API.
- Không cảnh báo compiler bị bỏ qua; bật `-Xexplicit-api=strict` cho `:core` (public API phải khai báo rõ kiểu trả về và visibility).

### 3.2. Quy ước đặt tên

| Đối tượng | Quy ước | Ví dụ |
|---|---|---|
| Package | lowercase, không gạch dưới | `com.ductranxuan.gravityjelly.core.logic` |
| Class / Object / Interface | PascalCase | `GameReducer`, `ParticlePool` |
| Hàm / biến | camelCase | `reduce()`, `gravityDir` |
| Hằng số | UPPER_SNAKE_CASE | `GRID_SIZE`, `MAX_ROTATIONS` |
| File Composable | PascalCase, file = tên hàm chính | `GameScreen.kt` |
| Test | `methodName_condition_expectedResult` | `hardDrop_blockedByWall_stopsAtContact` |

### 3.3. Bất biến (immutability) & mô hình hoá

- Model trong `:core` là **immutable** (`val`, `data class`, `value class` cho id/toạ độ). State mới sinh ra bằng `copy`, không mutate tại chỗ → nền cho determinism và golden test.
- Dùng `enum class`/`sealed interface` cho tập đóng (`GravityDirection`, `GameAction`, `GameEvent`) → `when` vét cạn, compiler bắt thiếu nhánh.
- Use case trong `:core/logic` là **hàm thuần**: cùng input → cùng output, không đọc clock/IO/Random toàn cục.

### 3.4. Quy tắc determinism (yêu cầu cứng)

- Mọi ngẫu nhiên đi qua **một** `SeededRng` truyền tường minh vào use case. **Cấm** `kotlin.random.Random.Default`, `Math.random()`, `System.nanoTime()` trong `:core`.
- **Cấm** phụ thuộc thứ tự iteration không ổn định: không lặp trên `HashMap`/`HashSet` để sinh state. Dùng `List`/`LinkedHashMap` hoặc duyệt lưới theo thứ tự (row, col) cố định.
- Connected-component (cluster) phải duyệt theo thứ tự xác định (ví dụ BFS từ ô nhỏ nhất theo (row, col)).
- Golden test khoá chuỗi state: refactor mà lệch chuỗi = test đỏ.

### 3.5. Tiêu chuẩn chống giật (bắt buộc khi viết `:game`)

- Vẽ **cả bàn trong MỘT Canvas**. Cấm render mỗi ô bằng một Composable/View riêng.
- **Cấm cấp phát trong vòng lặp vẽ/sim.** `Paint`/`Path`/mảng toạ độ dựng sẵn ngoài loop; particle & popup qua object pool; tránh autoboxing, tránh tạo lambda/chuỗi mỗi frame.
- Không drive animation từng frame bằng recomposition. Sim ở `GameEngine` (ngoài Compose), frame ticker `withFrameNanos` cập nhật rồi yêu cầu vẽ lại Canvas qua snapshot/biến đếm.
- **Fixed-timestep** sim (vd 60Hz logic) tách khỏi render; render **nội suy có easing** giữa hai bước.
- Preload ad/bitmap/atlas/SFX trước; init SDK ở luồng nền. Ngân sách main-thread mỗi frame **< ~8ms**.
- Tối ưu theo **số đo** (Android Studio Profiler, Perfetto/Systrace, Macrobenchmark), không đoán.

### 3.6. Concurrency & side-effect

- `:core` là synchronous thuần, không coroutine, không thread.
- IO (DataStore, AdMob, Play Games) ở `:app` chạy trên coroutine với `Dispatcher` thích hợp; **không** chặn main thread.
- Side-effect chỉ xảy ra ở `:app` (và audio ở `:game`), kích hoạt khi quan sát `GameEvent` — không nhúng vào `:core`.

### 3.7. Quản lý dependency

- **Version Catalog** (`gradle/libs.versions.toml`) là nơi khai báo version **duy nhất**. Cấm hardcode version trong `build.gradle.kts` của module.
- Logic build chung gom vào **convention plugins** (`build-logic/`) — không copy-paste cấu hình giữa các module.
- Thêm dependency mới phải cân nhắc ràng buộc "codebase gọn"; `:core` lý tưởng **zero dependency** ngoài stdlib.

### 3.8. Test

- `:core`: unit test toàn diện (hard-drop 4 hướng, cluster gravity, cascade, lose) + **golden test** cho resolve. Mục tiêu coverage logic cao, ưu tiên đúng đắn hơn con số.
- `:game`: test phần map input → action và logic loop tách được; render kiểm bằng benchmark frame timing.
- Benchmark frame timing trên máy tầm trung trước mỗi mốc phát hành.

---

## 4. Rules (luật cứng của dự án)

Các luật sau **override** thói quen mặc định. Vi phạm = chặn merge.

1. **Biên module một chiều.** `:core` không import Android/Compose và không phụ thuộc `:game`/`:app`. `:game` không phụ thuộc `:app`. Kiểm tra trong CI.
2. **Luật chơi chỉ ở `:core`.** `:game`/`:app` không được chứa logic gameplay (đặt mảnh, xóa hàng, gravity, scoring). Nếu thấy `if` về luật chơi ngoài `:core` → sai chỗ.
3. **Determinism là bất khả xâm phạm.** Cùng seed + cùng chuỗi action → cùng kết quả. Mọi random qua `SeededRng`. Cấm Random toàn cục, clock, thứ tự iteration không ổn định trong `:core`.
4. **Một Canvas cho gameplay.** Không một-Composable-mỗi-ô.
5. **Allocation-free trong loop.** Không cấp phát object/list/lambda trong vòng lặp vẽ/sim.
6. **State ngoài Compose.** Game state sống trong `GameEngine`; Compose chỉ recompose vỏ khi state UI đổi.
7. **Side-effect ở rìa.** Ad/lưu trữ/leaderboard chỉ ở `:app`, kích theo `GameEvent`. `:core` không gọi ra ngoài.
8. **Ad theo sự kiện, không theo timer thuần.** Interstitial có cooldown + ân hạn người mới (rút kinh nghiệm dự án trước). Preload trước, không load lúc vừa thua.
9. **Version tập trung.** Mọi version trong Version Catalog; cấu hình build chung qua convention plugins.
10. **Đo trước khi tối ưu.** Quyết định hiệu năng dựa trên Profiler/Perfetto/Macrobenchmark, không phỏng đoán. Escalate SurfaceView/LibGDX **chỉ khi** profiling cho thấy main-thread bị ép.
11. **Docs tiếng Việt, code tiếng Anh.** Cập nhật docs giữ tiếng Việt; định danh trong code dùng tiếng Anh.
12. **Đúng phạm vi MVP.** Không thêm hệ thống thứ hai (skill tree, tiền tệ kép), không online/PvP. Daily/solver/roguelite là sau-MVP, thiết kế biên để bật được nhưng chưa làm.

---

## 5. Bản đồ truy vết tài liệu → kiến trúc

| Yêu cầu nguồn | Hiện thực trong kiến trúc |
|---|---|
| Trọng lực xoay 90°, cụm cứng | `:core/logic/RotateGravity`, `ClusterGravity` |
| Lưới 9x9, khay 3 mảnh, xóa hàng/cột, combo | `:core/model/Grid`,`Tray` + `logic/ResolveCascade`,`Scoring` |
| Determinism / Daily seed | `:core/rng/SeededRng`, `engine/GameReducer`, golden test |
| Solver/bot headless | `:core/headless/Simulator` (tái dùng `:core` trên JVM) |
| Render mượt, không giật | `:game/loop`,`render`,`animation`,`particle` + §3.5 |
| AdMob theo sự kiện, rewarded | `:app/service/ads` + Rule 8 |
| Lưu điểm/seed/cài đặt | `:app/service/storage` (DataStore) |
| Điều hướng màn hình, HUD | `:app/navigation`, `:app/ui` + `:game/ui/GameSurface` |

---

> Tài liệu này định khung **trước khi code**. Khi bắt đầu hiện thực theo lộ trình (`02-ky-thuat.md` §10), mỗi bước phải soi lại Mục 4 (Rules) như checklist review.
