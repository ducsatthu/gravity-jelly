# TODO trước phát hành — rà soát code 07/07/2026

Tổng hợp từ đợt rà soát release-readiness (i18n · cấu hình build/manifest · lint · tính năng khoá).
Kết luận chung: **không có blocker build/ký**; `:core` test xanh, lint release 0 error.
File này chỉ liệt kê **việc còn lại**. Phần "cách làm" chi tiết sẽ bổ sung sau.

---

## 0. Quyết định đã chốt (ghi lại để khỏi phân vân)

- **versionName GIỮ `0.1.0`** (versionCode `1`) — hiện chỉ chạy Internal testing. Khi nào lên
  Production/Closed testing mới nâng `1.0.0`. Vị trí: `app/build.gradle.kts` (defaultConfig).
- **Đối tượng người chơi: 13+ (chỉ người lớn), KHÔNG nhắm trẻ em.** → giữ nguyên quyền `AD_ID` +
  quảng cáo cá nhân hoá như hiện tại, KHÔNG vào chương trình "Designed for Families". Nhớ khai
  đúng "Target audience = 13+" ở Play Console (mục App content) cho khớp.

## ✅ Đã xử lý trong đợt này (không cần làm lại)

- BXH: bỏ toàn bộ "người chơi giả" (bot), chuyển sang đồng bộ Play Games + cache offline.
- `android:allowBackup=false` (tránh khôi phục state consent/quảng cáo sang máy khác).
- `bundleRelease`/`assembleRelease` fail rõ ràng khi thiếu `keystore.properties` (không im lặng ký debug key).
- Dọn 5 string không dùng + sửa 3 comment lỗi thời.

---

## 1. 🎨 Icon — bổ sung PNG fallback cho API 24–25  *(việc #3)*

**Hiện trạng:** Adaptive icon (Android 8.0+/API 26+) **ĐÃ ĐẦY ĐỦ và đúng** — nền kem gradient
(`drawable/ic_launcher_background.xml`) + khối jelly hồng (`drawable-*/ic_launcher_foreground.png`)
+ lớp monochrome (themed icon Android 13+). Phần lớn máy hiển thị icon này → **đẹp, không cần sửa.**

**Vấn đề (lint `IconLauncherShape` + `IconDuplicates`, 10 cảnh báo):** app có `minSdk = 24`, nên trên
Android 7.0–7.1 (API 24–25) hệ dùng **PNG fallback** `mipmap-*/ic_launcher.png` và `ic_launcher_round.png`.
Hai file này hiện:
- `ic_launcher.png` **lấp kín cả ô vuông** (không bo/không chừa lề → xấu trên launcher cũ).
- `ic_launcher_round.png` **y hệt file vuông** (không phải hình tròn) — lint báo "round icon not circular"
  và "duplicates".

**Mức độ:** KHÔNG chặn lên store, chỉ ảnh hưởng thẩm mỹ trên **thiểu số máy API 24–25**. Nên làm cho chỉn chu.

**Asset có sẵn để tái tạo:**
- `design/exports/app-icon-512.png` (512×512, RGBA)
- `design/Gravity Jelly Design System/08-brand/app-icon-master.png` (1254×1254, master gốc)

**Hướng làm (chọn 1 — sẽ bổ sung chi tiết sau):**
- **(A) Android Studio → Image Asset Studio:** New > Image Asset > Launcher Icons (Adaptive & Legacy),
  nạp foreground+background hiện có → nó tự sinh lại cả legacy vuông + tròn đúng chuẩn. Nhanh, chuẩn nhất.
- **(B) Tái tạo tay từ master:** downscale `app-icon-512.png` ra 5 mật độ (mdpi 48 / hdpi 72 / xhdpi 96 /
  xxhdpi 144 / xxxhdpi 192 px) cho `ic_launcher.png`, và bản **bo tròn** cho `ic_launcher_round.png`.
- **(C) Nâng `minSdk` lên 26:** bỏ hẳn nhu cầu legacy PNG (adaptive luôn được dùng) → mất cảnh báo,
  nhưng loại người dùng Android 7.x. **Không khuyến nghị** chỉ để né lint.

> Ghi chú: Icon 512×512 cho **Play Store listing** (khác với icon trong máy) — user báo đã chuẩn hoá xong.

## 2. 🔍 Xác minh thủ công trên Play Console (không phải việc code)

- [ ] `PlayGamesManager.LEADERBOARD_ID = "CgkI9pW375weEAIQAA"` khớp leaderboard id thật ở Play Console.
- [ ] `@string/game_services_project_id = 1038542031606` khớp Project ID Play Games ở Play Console.
- [ ] Khi tạo release: **upload `mapping.txt`** (ProGuard/R8 map, nằm trong AAB) để Crashlytics/Play
      giải mã crash Kotlin. (Native debug symbols cho .so vendor không sinh được — đã xác nhận, bỏ qua.)
- [ ] App content: khai **Target audience = 13+**, Data safety khai **Advertising ID** (AdMob).

## 3. 📝 Ghi nhớ khi viết store listing / quảng bá

- **Nút "Hồi sinh" (rewarded ad)** hiện *reseed sang ván mới* chứ chưa "chơi tiếp đúng bàn cũ"
  (`EndlessGameScreen.kt` — TODO `06-P5`: engine chưa có API continue). Luồng quảng cáo đúng, nhưng
  **đừng nhấn mạnh chữ "revive/hồi sinh nguyên bàn"** trong mô tả store để tránh hiểu nhầm.

## 4. 🧹 Việc dọn dẹp tuỳ chọn (không bắt buộc, không ảnh hưởng release)

- Các comment "Stub khung / prototype" cũ ở `:core` (`Level.kt`, `Grid.kt`) và `:game` (`GameLoop.kt`)
  mô tả kiến trúc thời đầu, không phản ánh chức năng thiếu — có thể cập nhật lời văn cho khỏi hiểu nhầm.
- `EndlessTuning.kt` (TODO `combo-refund`): chưa chốt trần hồi lượt xoay mỗi chặng — tinh chỉnh cân bằng, để sau.
- Cơ chế UI `comingSoon` (làm mờ + khoá bấm) vẫn còn trong `HomeScreen`/`GjButton` nhưng không dùng cho
  mục nào — giữ lại cho tính năng tương lai cũng được.

---

## Lint release — thống kê (0 error, 58 warning; đều không chặn)

| Nhóm | Số | Xử lý |
|------|----|-------|
| GradleDependency / NewerVersionAvailable | 20 | Bản thư viện mới hơn — nâng khi tiện, không gấp. |
| PluralsCandidate | 14 | Gợi ý dùng `<plurals>` cho chuỗi số nhiều — tinh chỉnh i18n, để sau. |
| IconLauncherShape / IconDuplicates | 15 | → **Mục 1** (icon legacy). |
| UnusedResources | 5 → đã dọn | Đã xoá trong đợt này. |
| OldTargetApi | 1 | targetSdk 35 vẫn hợp lệ tới ~08/2026 — bỏ qua. |
| LockedOrientationActivity / DiscouragedApi | 2 | Khoá dọc là chủ đích của game — bỏ qua. |
