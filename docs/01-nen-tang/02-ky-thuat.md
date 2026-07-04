# Technical Approach — Gravity Jelly (Android Native)

Tài liệu định hướng kỹ thuật, làm đầu vào cho bản system design vẽ bằng Claude Design. Bốn ràng buộc xếp theo ưu tiên: triển khai nhanh, dễ maintain, bền cho phát triển lâu dài, và hiệu ứng mượt không giật.

## 1. Quyết định nền tảng

Native Android, Kotlin. Không Unity, không Flutter.

Lý do: dự án chỉ làm Android nên lợi thế đa nền của Flutter/Unity không còn giá trị, trong khi đi native cho codebase gọn, ít dependency, dễ maintain dài hạn và tích hợp AdMob/Play Games theo SDK chuẩn. Với game 2D casual nhẹ (lưới 9x9, vài tween, ít particle) thì hiệu năng không phải vấn đề — engine nào cũng đạt 60fps; yếu tố quyết định độ mượt là cách viết game loop và render, không phải engine.

## 2. Lựa chọn render

Khuyến nghị: Kotlin + Jetpack Compose cho lớp vỏ (menu, settings, store, dialog, HUD) và một Canvas riêng cho gameplay, chạy bằng vòng lặp khung hình tự quản (withFrameNanos).

Vì sao đủ và hợp nhất với bốn ràng buộc:
- Nhanh và dễ maintain: một stack Kotlin duy nhất, UI hiện đại khai báo, không phải dựng hệ engine nặng. Menu/store/HUD làm rất nhanh bằng Compose.
- Đủ mượt: game này tải nhẹ; sim mỗi frame là vài chục phép tính trên lưới 9x9, draw là vài chục hình. Vẽ thẳng lên Canvas trong một frame loop, không qua recomposition, là đủ 60fps ổn định.
- Lâu dài: lớp lõi tách thuần Kotlin (mục 3) nên không bị khóa vào Compose; nếu sau này hiệu ứng phình to có thể đổi riêng lớp render mà không đụng logic.

Điều kiện bắt buộc để không giật với Compose: KHÔNG drive animation từng frame bằng recomposition. Game state nằm ngoài Compose (trong một engine object), một frame ticker (withFrameNanos) cập nhật sim và yêu cầu vẽ lại Canvas qua một biến đếm/snapshot; Compose chỉ recompose lớp vỏ khi state UI đổi (điểm, số lượt xoay), không phải mỗi frame.

Phương án dự phòng (chỉ dùng khi profiling cho thấy main-thread bị ép): chuyển riêng phần gameplay sang SurfaceView với render thread riêng, hoặc dùng LibGDX (đọc "líp-gi-đi-ếch") như một engine 2D Kotlin có sẵn game loop/particle/audio. Không khởi đầu bằng hai cái này vì thêm phức tạp threading/pipeline mà game chưa cần.

## 3. Kiến trúc 3 lớp

Ranh giới rõ giữa ba lớp là quyết định kiến trúc quan trọng nhất của dự án, vì nó vừa giúp maintain vừa là điều kiện cho solver/Daily sau này.

### Core (thuần Kotlin, deterministic, không phụ thuộc Android)
- Chứa toàn bộ luật chơi: model lưới, danh sách mảnh, hard-drop, physics cụm (connected-component gravity), resolve cascade (xóa hàng/cột rồi sụp cụm theo combo), tính điểm, điều kiện thua, hệ trọng lực 4 hướng, RNG có seed.
- Không import bất kỳ API Android nào. Là một module Gradle riêng (`:core`) chạy được trên JVM thuần.
- Lợi ích kép: unit-test nhanh và đầy đủ; chạy headless để làm solver/sinh màn và mô phỏng bot cân bằng độ khó mà không cần thiết bị.
- Deterministic là yêu cầu cứng: cùng seed + cùng chuỗi input phải cho cùng kết quả. Mọi ngẫu nhiên đi qua một PRNG seed được, không dùng Random toàn cục, không phụ thuộc thời gian thực hay thứ tự iteration không ổn định.

### Render (đọc state để vẽ, không chứa luật chơi)
- Một game-engine object giữ tham chiếu state Core, chạy fixed-timestep simulation và quản lý lớp animation/particle (vị trí nội suy, hiệu ứng xóa, rung).
- Vẽ lên Canvas: nền lưới, các khối (mỗi ô một nhân vật có mắt), preview điểm rơi và hàng sắp xóa, particle, popup combo.
- Compose dựng vỏ và overlay HUD; gameplay là một Canvas/AndroidView trong cây Compose.

### Services (tích hợp ngoài)
- Quảng cáo: Google AdMob SDK. Preload interstitial và rewarded; init SDK lazy lúc khởi động nền; hiển thị theo sự kiện (sau vài lần thua/chặng) với cooldown và ân hạn người mới.
- Play Games Services: leaderboard cho Daily (sau MVP).
- Lưu trữ: DataStore cho điểm cao, seed, cài đặt, tiến độ nhẹ. Room chỉ khi cần lưu tập màn/tiến độ phức tạp. MVP không cần backend.

Luồng dữ liệu một chiều: input người chơi -> Core cập nhật state -> Render đọc state để vẽ -> Services nhận sự kiện (ghi điểm, gọi ad). Core không bao giờ gọi ngược Render/Services.

## 4. Game loop và độ mượt

- Fixed-timestep simulation tách khỏi render. Sim chạy bước cố định (ví dụ 60Hz logic), render nội suy vị trí giữa hai bước để hình ảnh mượt kể cả khi frame dao động. Tách hai cái này vừa cho mượt vừa giữ deterministic cho solver/Daily.
- Vòng lặp khung hình theo vsync bằng withFrameNanos (Compose) hoặc Choreographer; không tự ý sleep/loop riêng gây lệch nhịp màn hình.
- Animation rơi/đổ dùng nội suy có easing; cú xoay trọng lực làm cả bàn trượt về vị trí mới deterministic, render chỉ nội suy đường đi.

## 5. Chống giật, lag (checklist bắt buộc)

Đây là phần đảm bảo "hiệu ứng nhưng không giật".
- Vẽ cả bàn trong MỘT Canvas. Tuyệt đối không render mỗi ô bằng một Composable/View riêng — đây là nguyên nhân giật phổ biến nhất.
- Không cấp phát trong vòng lặp vẽ. Tránh tạo object/list/lambda mỗi frame để khỏi kích GC gây khựng. Tái dùng Paint, Path, mảng tọa độ; dùng object pool cho particle và popup.
- Vẽ allocation-free: dựng sẵn Paint và Path ngoài loop; tránh autoboxing và tạo chuỗi mỗi frame.
- Bật hardware acceleration (mặc định có ở View/Compose Canvas). Particle/asset dùng bitmap/atlas nạp sẵn, không decode trong frame.
- Giới hạn particle và số animation đồng thời (cap rõ ràng). Game này không cần nhiều; ít mà gọn giúp mượt cả trên máy yếu.
- Preload quảng cáo trước khi cần; không gọi load lúc người chơi vừa thua để tránh đứng khung hình. SDK init ở luồng nền.
- Giữ ngân sách main-thread mỗi frame dưới ~8ms để có biên an toàn cho 60fps; nếu vượt, chuyển render sang SurfaceView/render thread (phương án dự phòng mục 2).
- Đo bằng công cụ thật: Android Studio Profiler, Perfetto/Systrace cho jank, và Macrobenchmark cho startup/scroll/frame timing. Quyết định tối ưu dựa trên số đo, không đoán.

## 6. Nội dung deterministic (nền cho Daily và solver)

- Thay mọi ngẫu nhiên bằng PRNG seed được trong Core. Lưu seed là tái tạo y hệt một run.
- Daily: phát seed theo ngày, cùng chuỗi mảnh cho mọi người; leaderboard offline qua Play Games.
- Solver/sinh màn deterministic: chạy headless trên JVM bằng chính `:core` (BFS/IDA* có memo trên state = lưới + hướng trọng lực + mảnh còn lại), xuất tập màn ra JSON đóng gói trong app. Giới hạn số lượt xoay mỗi màn để khống chế bùng nổ không gian trạng thái.
- Cân bằng Endless: bot greedy chạy nhiều nghìn run trên `:core` để đo tỉ lệ sống, điểm trung bình, độ căng; chỉnh tham số khó dựa trên số đo.

## 7. Cấu trúc module (gợi ý)

- `:core` — thuần Kotlin/JVM, không Android: luật chơi, physics, resolve, RNG seed, model màn. Có test và chạy được headless cho solver/bot.
- `:game` — lớp render và game loop (Compose Canvas + engine object, animation, particle, audio, input).
- `:app` — vỏ ứng dụng: điều hướng màn hình, Services (AdMob, Play Games, DataStore), lắp ráp `:core` + `:game`.

Phân tách này cho phép thay/đổi lớp render hoặc lớp service mà không đụng luật chơi, và là điều kiện để tái dùng `:core` cho công cụ offline.

## 8. Kiểm thử và chất lượng

- Unit test `:core` toàn diện: hard-drop 4 hướng, physics cụm, cascade, điều kiện thua.
- Golden test cho resolve: cùng input -> cùng chuỗi state, bảo vệ tính deterministic khi refactor.
- Benchmark frame timing trên máy tầm trung trước mỗi mốc phát hành.

## 9. Rủi ro kỹ thuật

- Giật do recomposition nếu lỡ render gameplay bằng Compose state thay vì Canvas loop. Giảm thiểu: tách state ra ngoài Compose, vẽ một Canvas, review nghiêm điểm này.
- GC khựng do cấp phát trong loop. Giảm thiểu: object pool, allocation-free draw, đo bằng profiler.
- Bùng nổ không gian trạng thái của solver do trục trọng lực. Giảm thiểu: giới hạn lượt xoay, chuỗi mảnh ngắn cho màn thiết kế, cắt tỉa heuristic ít lỗ hổng.
- Lệch tính deterministic do thứ tự iteration hoặc Random toàn cục. Giảm thiểu: PRNG seed tập trung, golden test.

## 10. Lộ trình kỹ thuật ngắn

1. Dựng `:core` thuần Kotlin từ logic prototype (physics cụm + resolve + hard-drop 4 hướng + RNG seed) kèm unit test.
2. Dựng `:game`: Canvas loop, animation rơi/đổ nội suy, hiệu ứng xóa, input kéo-thả và nút xoay.
3. Lắp `:app`: điều hướng, DataStore, AdMob preload theo sự kiện.
4. Profiling frame timing, áp checklist chống giật; escalate SurfaceView nếu cần.
5. Bật PRNG seed cố định, làm bot cân bằng Endless trên `:core`.
6. Sau MVP: Daily seed + leaderboard, solver/sinh màn offline, lớp roguelite nhẹ.
