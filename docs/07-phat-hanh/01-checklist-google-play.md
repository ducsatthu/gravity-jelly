# Checklist phát hành Google Play — Gravity Jelly

> Cập nhật 05/07/2026. Danh sách việc để đưa app **lên Google Play** với **AdMob** và
> **Play Games Services (Bảng xếp hạng)** chuẩn sẵn sàng. Đánh dấu `[x]` khi xong.
>
> Trạng thái hiện tại (05/07): code chạy được, AdMob + PGS đã tích hợp nhưng **đang dùng
> id TEST/placeholder** và **release chưa ký bằng khoá thật**. Đây là các việc còn lại.

---

## 0. Bảng "phải đổi trước khi phát hành" (id thật thay placeholder)

| Hạng mục | File / vị trí | Giá trị hiện tại | Cần thay |
|---|---|---|---|
| AdMob App ID | `app/build.gradle.kts` `resValue admob_app_id` (theo build type) | ✅ release=`…3372922503955749~3547570752`, debug=TEST | Đã điền |
| AdMob Interstitial | `app/build.gradle.kts` `ADMOB_INTERSTITIAL_UNIT` | ✅ release=`…/3918271696`, debug=TEST | Đã điền |
| AdMob Rewarded | `app/build.gradle.kts` `ADMOB_REWARDED_UNIT` | ✅ release=`…/1911924999`, debug=TEST | Đã điền |
| PGS project id | `app/src/main/res/values/strings.xml` `game_services_project_id` | `000000000000` | Project id (số) từ Play Console |
| PGS leaderboard id | `app/.../games/PlayGamesManager.kt` `LEADERBOARD_ID` | `REPLACE_WITH_LEADERBOARD_ID` | Leaderboard id `CgkI…` |
| Version | `app/build.gradle.kts` | `versionCode 1`, `versionName "0.1.0"` | Bump mỗi lần lên bản |

> **applicationId (mã Play):** `com.ductranxuan.gravityjelly` — đã chốt trong `app/build.gradle.kts`
> (đã **bỏ flavor demo** — chỉ còn biến thể `debug`/`release`). Đây là id đăng ký trên Play, **không đổi
> được sau khi publish**. Lưu ý: `namespace` mã nguồn vẫn là `com.gravityjelly.app` (độc lập, không
> ảnh hưởng Play). Vân tay khoá ký (dùng khai OAuth PGS + Play App Signing):
> - **SHA-1:** `B0:9B:7B:11:93:BE:14:64:12:F2:10:58:A8:AA:52:48:FA:27:24:C7`
> - **SHA-256:** `1B:FA:EF:29:A2:F5:C1:FF:86:85:3C:1E:7E:4C:65:99:E9:0D:E0:03:BA:13:F0:AF:56:60:A9:A4:8B:2F:E5:E0`

> Nguyên tắc: **giữ id TEST cho tới sát ngày phát hành** (AdMob cấm click ad thật khi test →
> có thể bị khoá tài khoản). Chỉ đổi sang id thật ở build release cuối.

---

## 1. Tài khoản & pháp lý

- [x] Tạo **Google Play Console developer account** (đã có — đã tạo được app + import Data safety).
- [ ] Xác minh danh tính/địa chỉ nhà phát triển (nếu Google còn yêu cầu — kiểm tra banner trong Console).
- [ ] Nếu kiếm tiền: thiết lập **payments profile** (thuế, tài khoản nhận tiền AdMob).
- [x] Viết **Chính sách bảo mật (Privacy Policy)** và host công khai. Site tĩnh song ngữ (vi/en)
      ở `privacy_policy_site/` (nêu AdMob, Play Games, AD_ID, dữ liệu cục bộ). Đã deploy Vercel
      (project riêng của Gravity Jelly): **URL cố định `https://privacypolicysite-one.vercel.app`**.
      Redeploy: `cd privacy_policy_site && ./deploy.sh` (cần `.env` chứa `VERCEL_TOKEN`, đã gitignore).
- [x] Nối URL vào **màn Cài đặt** trong app (mục "Chính sách bảo mật" mở URL thật — đã code).
- [ ] Dán URL vào **Play Console → App content → Privacy policy** + **AdMob → App settings → Privacy policy URL**.

---

## 2. Cấu hình build để phát hành

- [x] **Upload keystore** (release key): **dùng lại** khoá của dự án anh em
      `../gravity_merge/gravity_merge_release.jks` (alias `gravity_merge`).
      → cất **an toàn** (mất là không update app được, trừ khi dùng Play App Signing reset).
      Lưu ý: 1 upload key ký được nhiều app khác package — với **Play App Signing** mỗi app vẫn có
      app-signing key riêng nên chia sẻ upload key giữa 2 game không sao.
- [x] `signingConfigs.release` đã wire sẵn trong `app/build.gradle.kts` (đọc `keystore.properties`).
- [x] Đã tạo `keystore.properties` ở root (copy từ `../gravity_merge/app/android/key.properties`,
      cùng định dạng `storeFile/storePassword/keyAlias/keyPassword`). `signingReport` xác nhận
      `release → Config: release`. **SHA-1 release: `B0:9B:7B:11:93:BE:14:64:12:F2:10:58:A8:AA:52:48:FA:27:24:C7`** (khai vào OAuth client PGS — §4).
- [x] Mật khẩu keystore để ngoài VCS: `keystore.properties` + `*.jks`/`*.keystore` đã vào `.gitignore`.
- [ ] Bật **Play App Signing** (khuyến nghị) — Google giữ app signing key, mình chỉ giữ upload key.
- [x] **R8/minify + shrinkResources** đã bật cho release (`isMinifyEnabled=true`, `isShrinkResources=true`)
      + `app/proguard-rules.pro` (keep GMA Ads / UMP / Play Games + giữ line numbers cho crash).
      Đã build & verify `assembleRelease` OK — APK ký release đúng (`com.ductranxuan.gravityjelly`,
      SHA-256 khớp). **Nhớ upload `app/build/outputs/mapping/release/mapping.txt` lên Play**
      (App bundle explorer) để deobfuscate stacktrace crash.
- [ ] Bump `versionCode` (mỗi bản lên Play phải tăng) + `versionName` (vd `1.0.0`).
- [x] `applicationId = com.ductranxuan.gravityjelly` (id đăng ký trên Play — **không đổi được sau khi publish**).
      Đã **bỏ flavor demo** — chỉ còn `debug`/`release` (`ADS_ENABLED=true` mặc định).
- [ ] Build **App Bundle (.aab)**, không phải APK:
      `./gradlew :app:bundleRelease` → `app/build/outputs/bundle/release/*.aab`.
- [ ] Kiểm `targetSdk 35` (Play yêu cầu target SDK mới cho app mới — 35 hợp lệ 2026). `minSdk 24` OK.
- [ ] Đổi **icon/label** production nếu cần (đang dùng `@mipmap/ic_launcher`, label "Gravity Jelly").
- [ ] Chạy thử **bản release đã ký** trên máy thật (`bundletool` hoặc cài `.aab` qua internal testing)
      để chắc R8/obfuscation không làm vỡ Ads/PGS/Compose.

---

## 3. AdMob sẵn sàng

- [ ] Tạo app trong **AdMob console**, liên kết với app trên Play (cùng package name).
- [x] Tạo **ad unit**: 1 Interstitial + 1 Rewarded → lấy id thật.
- [x] Điền 3 id thật (App ID + 2 unit) — **release** dùng id thật, **debug** vẫn TEST (tránh khoá tài khoản).
      Verify APK: release nhúng `~3547570752`, debug nhúng TEST `~3347511713`.
- [x] Đăng **app-ads.txt** — live tại `https://privacypolicysite-one.vercel.app/app-ads.txt` (pub `3372922503955749`).
- [x] **UMP / Consent (GDPR/EEA)** đã tích hợp: `ads/ConsentManager.kt` chạy TRƯỚC khi init AdMob
      (`MainActivity`), chỉ khi `canRequestAds()` mới `ads.initialize()`. Ngoài EEA bỏ qua form.
      Còn phải làm trên **AdMob console → Privacy & messaging**: tạo **GDPR** (và **IDFA/ATT** không cần
      cho Android) + **consent form** thì form mới hiện thật. Test: điền `AdsConfig.TEST_DEVICE_HASHES`
      (lấy hash từ logcat) để ép geography EEA — nhớ **xoá rỗng trước khi phát hành**.
- [ ] Khai **App ID** đúng chỗ manifest (đã có, chỉ đổi giá trị). SDK tự thêm quyền
      `com.google.android.gms.permission.AD_ID` → nhớ khai ở **Data safety** (§5).
- [ ] Test bằng **test device id** (không click ad thật) trước khi release. Sau release, theo dõi
      **invalid traffic** để tránh bị khoá.
- [ ] Kiểm chính sách nội dung ad: **Target audience** (§5) — nếu nhắm trẻ em phải dùng
      ad phù hợp gia đình / tắt ad cá nhân hoá.

---

## 4. Google Play Games Services — Bảng xếp hạng

- [ ] Trong Play Console → **Play Games Services → Setup and management → Configuration**:
      tạo cấu hình PGS cho app.
- [ ] Tạo **Leaderboard** "Endless — All time" → lấy **leaderboard id** (`CgkI…`).
- [ ] Lấy **project id** (số) của PGS → thay string `game_services_project_id`.
- [ ] Thay `LEADERBOARD_ID` trong `PlayGamesManager.kt` (bảng §0). Khi đã cấu hình,
      `configured=true` → app tự bật nhánh online (đăng nhập + top10 + hạng của bạn),
      offline vẫn lùi bảng nội bộ.
- [ ] **Credentials**: tạo OAuth2 client (Android) trong Google Cloud project được PGS liên kết;
      khai **SHA-1**:
  - [ ] SHA-1 **upload key** (bản dev/test cài qua adb): `B0:9B:7B:11:93:BE:14:64:12:F2:10:58:A8:AA:52:48:FA:27:24:C7`
        (khoá dùng lại từ gravity_merge — xem §2). Package name khai kèm = `com.ductranxuan.gravityjelly`.
        SHA-256: `1B:FA:EF:29:A2:F5:C1:FF:86:85:3C:1E:7E:4C:65:99:E9:0D:E0:03:BA:13:F0:AF:56:60:A9:A4:8B:2F:E5:E0`.
  - [ ] SHA-1 **app signing key của Play** (lấy trong Play Console → App integrity) cho bản phát hành.
- [ ] Thêm **tài khoản tester** trong PGS → test được bản debug qua adb ở **sandbox** (không cần
      publish store). Emulator phải là image **"Google Play"**.
- [ ] Nộp điểm: đã tự động khi game-over Endless (`onBest → submitScore`). Kiểm hiển thị đúng.
- [ ] **Publish** cấu hình PGS (nút riêng, tách với publish app) để mọi người — không chỉ tester —
      thấy leaderboard. Có thể **reset dữ liệu điểm test** trước khi mở công khai.

---

## 5. Khai báo chính sách trong Play Console

- [x] **Data safety form**: ĐÃ import `data-safety-import.csv` (06/07). Khai Ad ID (AdMob), User ID
      (Play Games), App activity + Diagnostics/Crash (Firebase GA4 + Crashlytics), app-instance id.
- [x] **Ads declaration**: app CÓ chứa quảng cáo → "Yes". *(App content xong 06/07)*
- [x] **Content rating (IARC)**: đã điền bảng câu hỏi → rating casual.
- [x] **Target audience & content**: đã chọn nhóm tuổi.
- [x] **Government apps / News**: không áp dụng.
- [x] **Privacy policy URL**: đã dán `https://privacypolicysite-one.vercel.app`.
- [x] **App access**: All functionality available without special access.
- [x] **Financial features / Health**: không.

---

## 6. Store listing (trang cửa hàng)

- [ ] **Tên app** (≤30 ký tự) + **mô tả ngắn** (≤80) + **mô tả đầy đủ** — chuẩn bị **vi + en**
      (app đã đa ngôn ngữ → listing cũng nên 2 thứ tiếng).
- [ ] **Icon** 512×512 (PNG).
- [ ] **Feature graphic** 1024×500.
- [ ] **Screenshots điện thoại** (≥ 2, khuyến nghị 4–8): Home, Endless, Campaign, Boss, **Bảng xếp hạng**.
- [ ] (Tuỳ chọn) **video** YouTube giới thiệu.
- [ ] Chọn **category** (Game → Puzzle) + tags.
- [ ] Thông tin liên hệ nhà phát triển (email).

---

## 7. Kiểm thử & lộ trình phát hành

- [ ] Upload `.aab` lên **Internal testing** trước → cài qua link, kiểm end-to-end trên máy thật:
      Ads thật (test device), PGS online (tài khoản tester), i18n vi/en, in-app language.
- [ ] ⚠️ **Yêu cầu closed testing của Google** (tài khoản cá nhân đăng ký sau 11/2023):
      cần **≥12 tester** tham gia **≥14 ngày** ở track **Closed testing** trước khi được mở
      **Production**. Lên kế hoạch sớm.
- [ ] Sau closed testing đạt yêu cầu → gửi **Production review** (Google duyệt vài giờ→vài ngày).
- [ ] Cân nhắc **staged rollout** (5% → 100%) để bắt crash sớm.

---

## 8. Sau phát hành

- [ ] Theo dõi **Android vitals** (ANR, crash), **AdMob** (fill rate, invalid traffic),
      **PGS** (số người đăng nhập, phân bố điểm — chỉnh roster/ngưỡng nếu cần).
- [ ] Chuẩn bị quy trình **update**: bump `versionCode`, build `.aab` mới, cùng upload key.
- [ ] Backup keystore + `keystore.properties` ở nơi an toàn (mất = không update được).

---

### Tham chiếu code liên quan
- AdMob: `app/src/main/kotlin/com/gravityjelly/app/ads/AdsConfig.kt`, `AdsManager.kt`; manifest meta `ads.APPLICATION_ID`.
- Play Games: `app/src/main/kotlin/com/gravityjelly/app/games/PlayGamesManager.kt`; manifest meta `games.APP_ID`; string `game_services_project_id`.
- Bảng xếp hạng UI: `app/src/main/kotlin/com/gravityjelly/app/LeaderboardScreen.kt` + `ui/leaderboard/`.
- Build/signing: `app/build.gradle.kts` (chỉ `debug`/`release`, `signingConfigs.release` từ keystore.properties, R8 bật).
