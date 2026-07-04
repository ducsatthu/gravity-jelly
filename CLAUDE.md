# CLAUDE.md

Hướng dẫn cho Claude khi làm việc trong repo này.

## Dự án

**Gravity Jelly** (tên tạm) — game puzzle casual block-fit cho Android, một người, chơi offline. Cơ chế chữ ký: người chơi **xoay được hướng trọng lực 90°** để dồn cả cụm khối đổ theo ý mình. Free-to-play, doanh thu từ AdMob.

Trạng thái hiện tại (cập nhật 01/07/2026 — **latest**): **đã có code, đang phát triển MVP**. Ba module `:core` / `:game` / `:app` đã dựng; chơi được trọn vòng Home ⇄ Endless. Đã có: màn Home (nền `home_world_1_bg`, menu 5 icon PNG, hiệu ứng cánh hoa bay), màn Endless (board 9×9, khay 3 mảnh, đặt mảnh tự do, physics cụm, cascade combo, xoay trọng lực, siêu khối nổ v2, combo hồi lượt xoay), màn Cài đặt, màn Cẩm nang + hệ Guide dạy luật, DataStore lưu best/seed/settings/seenGuides. Tài liệu định hướng gốc vẫn ở `docs/01-nen-tang/01-nghiep-vu.md` (nghiệp vụ) và `docs/01-nen-tang/02-ky-thuat.md` (kỹ thuật); mục lục tổng ở `docs/00-muc-luc.md`.

## Nền tảng & quyết định kỹ thuật chốt

- **Native Android, Kotlin.** KHÔNG Unity, KHÔNG Flutter (chỉ làm Android → ưu tiên codebase native gọn, dễ maintain).
- **Render:** Jetpack Compose cho lớp vỏ (menu, settings, store, dialog, HUD) + một **Canvas riêng** cho gameplay chạy bằng frame loop tự quản (`withFrameNanos`).
- **Ràng buộc, theo ưu tiên:** triển khai nhanh → dễ maintain → bền lâu dài → hiệu ứng mượt không giật.

## Kiến trúc 3 lớp (quyết định quan trọng nhất)

Ranh giới rõ giữa ba lớp là điều kiện cho solver/Daily sau này. Luồng dữ liệu **một chiều**: input → Core cập nhật state → Render đọc state để vẽ → Services nhận sự kiện. Core KHÔNG bao giờ gọi ngược Render/Services.

- **`:core`** — thuần Kotlin/JVM, không import API Android. Toàn bộ luật chơi: model lưới 9x9, hard-drop 4 hướng, physics cụm (connected-component gravity), resolve cascade, tính điểm, điều kiện thua, trọng lực 4 hướng, **RNG có seed**. Chạy headless được cho solver/bot. Có unit test đầy đủ.
- **`:game`** — lớp render + game loop (Compose Canvas + engine object, animation, particle, audio, input). Đọc state Core để vẽ, không chứa luật chơi.
- **`:app`** — vỏ ứng dụng: điều hướng màn hình, Services (AdMob, Play Games, DataStore), lắp ráp `:core` + `:game`.

## Yêu cầu cứng: Deterministic

Cùng seed + cùng chuỗi input PHẢI cho cùng kết quả. Mọi ngẫu nhiên đi qua một **PRNG seed được** trong Core — KHÔNG dùng `Random` toàn cục, KHÔNG phụ thuộc thời gian thực hay thứ tự iteration không ổn định. Đây là nền cho Daily seed và solver/sinh màn offline.

## Chống giật (checklist bắt buộc khi viết gameplay)

- Vẽ cả bàn trong **MỘT Canvas**. Tuyệt đối không render mỗi ô bằng một Composable/View riêng (nguyên nhân giật phổ biến nhất).
- KHÔNG drive animation từng frame bằng recomposition. Game state nằm ngoài Compose; Compose chỉ recompose lớp vỏ khi state UI đổi (điểm, lượt xoay).
- KHÔNG cấp phát trong vòng lặp vẽ. Tái dùng `Paint`/`Path`/mảng tọa độ; object pool cho particle/popup; vẽ allocation-free.
- Fixed-timestep simulation tách khỏi render; render nội suy có easing. Vòng lặp theo vsync (`withFrameNanos`/Choreographer).
- Preload quảng cáo trước khi cần; SDK init ở luồng nền. Giữ ngân sách main-thread mỗi frame < ~8ms.
- Phương án dự phòng (chỉ khi profiling cho thấy main-thread bị ép): SurfaceView + render thread riêng, hoặc LibGDX.
- Đo bằng công cụ thật: Android Studio Profiler, Perfetto/Systrace, Macrobenchmark. Tối ưu theo số đo, không đoán.

## Phạm vi MVP

Lưới 9x9, đặt mảnh (khay 3 mảnh), xóa hàng/cột, physics cụm cứng, combo dây chuyền; trọng lực xoay với **số lần hữu hạn theo chặng**; chế độ Endless + thang khó; art khối có mắt; AdMob (interstitial theo sự kiện + rewarded hồi sinh/x2).

**Sau MVP:** Daily seed + leaderboard offline; tập màn thử thách deterministic sinh bằng solver (BFS/IDA* trên `:core`, xuất JSON); lớp roguelite nhẹ.

**Ngoài phạm vi (chủ ý):** hệ thống thứ hai phức tạp (skill tree, tiền tệ kép), online/PvP.

## Kiểm thử

- Unit test `:core` toàn diện: hard-drop 4 hướng, physics cụm, cascade, điều kiện thua.
- **Golden test** cho resolve: cùng input → cùng chuỗi state, bảo vệ deterministic khi refactor.
- Benchmark frame timing trên máy tầm trung trước mỗi mốc phát hành.

## Quy ước

- Tài liệu dự án viết bằng tiếng Việt — giữ nguyên ngôn ngữ này khi cập nhật docs.
- Khi thêm code, tôn trọng ranh giới 3 module và luồng một chiều ở trên.
