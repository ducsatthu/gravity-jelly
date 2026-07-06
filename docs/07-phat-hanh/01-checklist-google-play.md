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
| AdMob App ID | `app/src/main/AndroidManifest.xml` (`ads.APPLICATION_ID`) | TEST `ca-app-pub-3940256099942544~3347511713` | App ID thật từ AdMob |
| AdMob Interstitial | `app/.../ads/AdsConfig.kt` `INTERSTITIAL_UNIT` | TEST `…/1033173712` | Ad unit thật |
| AdMob Rewarded | `app/.../ads/AdsConfig.kt` `REWARDED_UNIT` | TEST `…/5224354917` | Ad unit thật |
| PGS project id | `app/src/main/res/values/strings.xml` `game_services_project_id` | `000000000000` | Project id (số) từ Play Console |
| PGS leaderboard id | `app/.../games/PlayGamesManager.kt` `LEADERBOARD_ID` | `REPLACE_WITH_LEADERBOARD_ID` | Leaderboard id `CgkI…` |
| Version | `app/build.gradle.kts` | `versionCode 1`, `versionName "0.1.0"` | Bump mỗi lần lên bản |

> Nguyên tắc: **giữ id TEST cho tới sát ngày phát hành** (AdMob cấm click ad thật khi test →
> có thể bị khoá tài khoản). Chỉ đổi sang id thật ở build release cuối.

---

## 1. Tài khoản & pháp lý

- [ ] Tạo **Google Play Console developer account** (phí **$25** một lần).
- [ ] Xác minh danh tính/địa chỉ nhà phát triển (Google yêu cầu với tài khoản cá nhân mới —
      có thể mất vài ngày).
- [ ] Nếu kiếm tiền: thiết lập **payments profile** (thuế, tài khoản nhận tiền AdMob).
- [ ] Viết **Chính sách bảo mật (Privacy Policy)** và host công khai (URL cố định). BẮT BUỘC
      vì app có quảng cáo + Play Games (thu thập dữ liệu). Nêu rõ: AdMob, Play Games, định danh
      quảng cáo (AD_ID). Gắn link vào màn Cài đặt (đang có mục "Chính sách bảo mật" — nối URL thật).

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
      `productionRelease → Config: release`. **SHA-1 release: `B0:9B:7B:11:93:BE:14:64:12:F2:10:58:A8:AA:52:48:FA:27:24:C7`** (khai vào OAuth client PGS — §4).
- [x] Mật khẩu keystore để ngoài VCS: `keystore.properties` + `*.jks`/`*.keystore` đã vào `.gitignore`.
- [ ] Bật **Play App Signing** (khuyến nghị) — Google giữ app signing key, mình chỉ giữ upload key.
- [ ] Cân nhắc bật **R8/minify** cho release: `isMinifyEnabled = true` + bổ sung
      `app/proguard-rules.pro` (đang trống) giữ luật cho GMS Ads / Play Games / Compose nếu cần.
      (Tối thiểu có thể để `false` để phát hành nhanh, tối ưu sau.)
- [ ] Bump `versionCode` (mỗi bản lên Play phải tăng) + `versionName` (vd `1.0.0`).
- [ ] Kiểm tra `applicationId = com.gravityjelly.app` là **id cuối cùng** (không đổi được sau khi publish).
      Publish flavor **`production`** (`ADS_ENABLED=true`), KHÔNG phải `demo` (id có hậu tố `.demo`).
- [ ] Build **App Bundle (.aab)**, không phải APK:
      `./gradlew :app:bundleProductionRelease` → `app/build/outputs/bundle/productionRelease/*.aab`.
- [ ] Kiểm `targetSdk 35` (Play yêu cầu target SDK mới cho app mới — 35 hợp lệ 2026). `minSdk 24` OK.
- [ ] Đổi **icon/label** production nếu cần (đang dùng `@mipmap/ic_launcher`, label "Gravity Jelly").
- [ ] Chạy thử **bản release đã ký** trên máy thật (`bundletool` hoặc cài `.aab` qua internal testing)
      để chắc R8/obfuscation không làm vỡ Ads/PGS/Compose.

---

## 3. AdMob sẵn sàng

- [ ] Tạo app trong **AdMob console**, liên kết với app trên Play (cùng package name).
- [ ] Tạo **ad unit**: 1 Interstitial + 1 Rewarded → lấy id thật.
- [ ] Thay 3 id (App ID + 2 unit) theo **bảng §0**.
- [ ] Đăng **app-ads.txt** (nếu dùng domain nhà phát triển) — chống gian lận, tăng fill rate.
- [ ] **UMP / Consent (GDPR/EEA)**: tích hợp Google **User Messaging Platform** để xin đồng ý
      quảng cáo cá nhân hoá cho người dùng EU (bắt buộc để chạy ad ở EEA/UK). *Hiện code chưa có
      UMP* → cần thêm trước khi bật ad thật ở khu vực đó.
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
        (khoá dùng lại từ gravity_merge — xem §2).
  - [ ] SHA-1 **app signing key của Play** (lấy trong Play Console → App integrity) cho bản phát hành.
- [ ] Thêm **tài khoản tester** trong PGS → test được bản debug qua adb ở **sandbox** (không cần
      publish store). Emulator phải là image **"Google Play"**.
- [ ] Nộp điểm: đã tự động khi game-over Endless (`onBest → submitScore`). Kiểm hiển thị đúng.
- [ ] **Publish** cấu hình PGS (nút riêng, tách với publish app) để mọi người — không chỉ tester —
      thấy leaderboard. Có thể **reset dữ liệu điểm test** trước khi mở công khai.

---

## 5. Khai báo chính sách trong Play Console

- [ ] **Data safety form**: khai thu thập/chia sẻ dữ liệu — Ad ID (AdMob), định danh Play Games,
      dữ liệu chơi. Khai đúng mục đích (quảng cáo, phân tích).
- [ ] **Ads declaration**: app CÓ chứa quảng cáo → tick "Yes".
- [ ] **Content rating (IARC)**: điền bảng câu hỏi → nhận rating (game casual, không bạo lực).
- [ ] **Target audience & content**: chọn nhóm tuổi. Nếu **có trẻ em** → tuân thủ
      Families Policy + ad phù hợp.
- [ ] **Government apps / News**: không áp dụng.
- [ ] **Privacy policy URL**: dán link (đã chuẩn bị ở §1).
- [ ] **App access**: nếu leaderboard/tính năng cần đăng nhập, cung cấp hướng dẫn cho reviewer
      (ở đây Play Games đăng nhập tự động — ghi chú "không cần credential").
- [ ] **Financial features / Health**: không.

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
- Build/flavor/signing: `app/build.gradle.kts` (flavor `production`/`demo`, chưa có `signingConfigs`).
