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
- Icon legacy PNG: squircle + tròn (Mục 1) — hết cảnh báo lint icon.
- **Rà i18n toàn bộ màn (07/07):** không còn text hardcode ở code production (chỉ literal trong
  `@Preview`/comment/test, và endonym "Tiếng Việt"/"English" ở bộ chọn ngôn ngữ — cố ý không dịch).
  Key vi↔en khớp tuyệt đối (321 key dịch), 2 key config (`game_services_project_id`, `privacy_policy_url`)
  đã `translatable="false"` đúng chỗ. Không có placeholder/TODO lộ ra người chơi.

---

## 1. 🎨 Icon — PNG fallback API 24–25  *(việc #3 — ✅ XONG 07/07)*

**Adaptive icon (API 26+)** vẫn đầy đủ như trước (nền kem gradient + jelly hồng + monochrome).

**Đã sửa legacy PNG (`mipmap-*/ic_launcher.png` + `ic_launcher_round.png`):** trước đây lấp kín ô vuông
và 2 file y hệt nhau (lint `IconLauncherShape` + `IconDuplicates`). Nay **mask lại từ `design/exports/app-icon-512.png`**:
- `ic_launcher.png` = **squircle bo góc** (roundrect r≈18.75%, góc trong suốt).
- `ic_launcher_round.png` = **mask tròn** thật.
- Sinh cho cả 5 mật độ (48/72/96/144/192) bằng ImageMagick (Lanczos). Lint xác nhận **hết sạch cảnh báo icon**
  (58→40 warning). Cách sinh lại nếu đổi master:
  `magick app-icon-512.png \( -size 512x512 xc:none -fill white -draw "roundrectangle 0,0,511,511,96,96" \) -compose DstIn -composite sq.png`
  (bản tròn thay `roundrectangle...` bằng `circle 256,256 256,0`), rồi `-resize` xuống từng mật độ.

> Ghi chú: Icon 512×512 cho **Play Store listing** (khác icon trong máy) — user đã chuẩn hoá xong.

## 1b. 📢 Đồng thuận quảng cáo theo vùng (EU/EEA/UK + Hoa Kỳ)  *(code XONG — cần cấu hình AdMob)*

**Code đã có (07/07):**
- UMP xin đồng thuận ngay đầu app trước khi nạp quảng cáo (`ConsentManager.gather`) — đã có từ trước.
- **MỚI:** màn Cài đặt có nút **"Quyền riêng tư quảng cáo"** (`settings_ad_privacy`, icon Lock) →
  gọi `UserMessagingPlatform.showPrivacyOptionsForm` để người dùng ĐỔI/RÚT đồng thuận bất cứ lúc nào.
  Nút **chỉ hiện khi vùng người dùng yêu cầu** (`isPrivacyOptionsRequired`) — thoả policy Google mà
  không làm rối UI ở vùng không cần. Một form này phủ **cả GDPR (EU) lẫn US states (CCPA/CPRA)**.

**AdMob Console (Privacy & messaging):**
- [x] Thông điệp **GDPR** (EU consent) — đã thêm app Gravity Jelly + publish (07/07).
- [x] Thông điệp **US states (CCPA/CPRA)** — đã thêm app Gravity Jelly + publish (07/07).
      *(Tái dùng thông điệp của app cũ cùng publisher `pub-3372922503955749`, chỉ thêm App ID
      `~3547570752` vào danh sách app — không phải dựng lại.)*

**CÒN LẠI:**
- [ ] Kiểm tra bằng thiết bị test: điền hash vào `AdsConfig.TEST_DEVICE_HASHES` (lấy từ logcat) → app
      ép địa lý EEA để hiện form; xác nhận nút "Quyền riêng tư quảng cáo" xuất hiện ở Cài đặt và mở được form.
      **Nhớ xoá hash về rỗng trước khi build release.**
- [ ] Data safety: đã khai "Advertising ID" (AdMob) — khớp với việc dùng quảng cáo cá nhân hoá (13+).

## 2. 🔍 Xác minh thủ công trên Play Console (không phải việc code)

- [ ] `PlayGamesManager.LEADERBOARD_ID = "CgkI9pW375weEAIQAA"` khớp leaderboard id thật ở Play Console.
- [ ] `@string/game_services_project_id = 1038542031606` khớp Project ID Play Games ở Play Console.
- [ ] Khi tạo release: **upload `mapping.txt`** (ProGuard/R8 map, nằm trong AAB) để Crashlytics/Play
      giải mã crash Kotlin. (Native debug symbols cho .so vendor không sinh được — đã xác nhận, bỏ qua.)
- [ ] App content: khai **Target audience = 13+**, Data safety khai **Advertising ID** (AdMob).
- [ ] **Kiểm chứng nội dung Chính sách bảo mật:** `privacy_policy_url = https://privacypolicysite-one.vercel.app`
      (dùng ở Settings + khai Play Console). Xác nhận trang này là policy THẬT của Gravity Jelly, có nêu
      thu thập Advertising ID/AdMob + Play Games — không phải trang mẫu chung. Sửa URL nếu cần (chỉ đổi 1 chỗ ở
      `values/strings.xml`).

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

## Lint release — thống kê (0 error, 40 warning; đều không chặn)

| Nhóm | Số | Xử lý |
|------|----|-------|
| GradleDependency / NewerVersionAvailable | 20 | Bản thư viện mới hơn — nâng khi tiện, không gấp. |
| PluralsCandidate | 14 | Gợi ý dùng `<plurals>` cho chuỗi số nhiều — tinh chỉnh i18n, để sau. |
| IconLauncherShape / IconDuplicates | 0 | ✅ Đã sửa (Mục 1) — mask squircle + tròn. |
| UnusedResources | 5 → đã dọn | Đã xoá trong đợt này. |
| OldTargetApi | 1 | targetSdk 35 vẫn hợp lệ tới ~08/2026 — bỏ qua. |
| LockedOrientationActivity / DiscouragedApi | 2 | Khoá dọc là chủ đích của game — bỏ qua. |
