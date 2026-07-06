# Hướng dẫn thiết lập phát hành — runbook từng bước

> Cập nhật 06/07/2026. Đây là **sổ tay thao tác**: làm lần lượt từ trên xuống. Mọi giá trị thật của
> dự án đã điền sẵn — chỉ việc copy-paste vào Console. Các form khai báo (Data safety, content
> rating, target audience…) đã **soạn sẵn câu trả lời** ở §5.
>
> Khác với [`01-checklist-google-play.md`](01-checklist-google-play.md) (danh sách việc dạng tick):
> file này đi kèm **thao tác cụ thể + giá trị điền + câu trả lời mẫu**. Đọc song song hai file.
>
> ⚠️ Các mục khai báo pháp lý (§5) là **cam kết của bạn** — mình soạn theo đúng hành vi app hiện
> tại (AdMob + Play Games + Firebase Analytics/Crashlytics, không IAP), bạn **đọc xác nhận** trước khi nộp.

---

## 0. Thông số dự án — điền sẵn (copy dùng ngay)

| Trường | Giá trị | Dùng ở đâu |
|---|---|---|
| **Tên app** | Gravity Jelly | Play listing, AdMob, PGS |
| **applicationId (package Play)** | `com.ductranxuan.gravityjelly` | Play Console, AdMob, OAuth client |
| Package mã nguồn (namespace) | `com.gravityjelly.app` | *nội bộ, không khai lên Play* |
| Nhà phát triển | Duc Tran Xuan | mọi nơi |
| Email liên hệ | ductranxuan.29710@gmail.com | listing, hỗ trợ |
| **Privacy Policy URL** | `https://privacypolicysite-one.vercel.app` | Play, AdMob, in-app |
| **app-ads.txt URL** | `https://privacypolicysite-one.vercel.app/app-ads.txt` | AdMob verify |
| **AdMob Publisher ID** | `pub-3372922503955749` | app-ads.txt, link AdMob |
| **SHA-1 (khoá ký)** | `B0:9B:7B:11:93:BE:14:64:12:F2:10:58:A8:AA:52:48:FA:27:24:C7` | OAuth client PGS |
| **SHA-256 (khoá ký)** | `1B:FA:EF:29:A2:F5:C1:FF:86:85:3C:1E:7E:4C:65:99:E9:0D:E0:03:BA:13:F0:AF:56:60:A9:A4:8B:2F:E5:E0` | OAuth client PGS, đối chiếu |
| Keystore | `../gravity_merge/gravity_merge_release.jks` (alias `gravity_merge`) | ký release (mượn) |
| minSdk / targetSdk / compileSdk | 24 / 35 / 35 | — |
| versionCode / versionName | 1 / 0.1.0 | bump khi phát hành |
| Biến thể build | Chỉ `debug` / `release` (đã bỏ flavor demo; `ADS_ENABLED=true` mặc định) | — |
| Danh mục | Game → Puzzle | listing |
| Ngôn ngữ | vi (mặc định) + en | listing 2 thứ tiếng |
| Kiếm tiền | Chỉ quảng cáo (AdMob). **Không** IAP | Data safety, Ads |
| Tracking | **Google Analytics (GA4) + Crashlytics** qua Firebase (gate theo consent) | Data safety, §3B |

> Ghi chú SHA: đây là **upload key** (mượn từ gravity_merge). Sau khi bật **Play App Signing** (§2),
> Google cấp thêm **app-signing key** riêng — lấy SHA-1/256 của nó trong Play Console và **khai cả hai**
> vào OAuth client PGS, nếu không bản production sẽ không đăng nhập Play Games được.

---

## 1. Tài khoản Google Play Console

1. Vào <https://play.google.com/console> → đăng ký **developer account** (phí **$25** một lần).
2. Chọn loại tài khoản **Cá nhân** (Individual) → khai tên `Duc Tran Xuan`.
3. **Xác minh danh tính** (CMND/CCCD + địa chỉ) — Google có thể mất **vài ngày** duyệt. Làm sớm nhất.
4. Nếu nhận tiền quảng cáo qua AdMob: thiết lập **payments profile** (đã có nếu dùng chung tài khoản
   AdMob của gravity_merge).

**Hỏi–đáp**
- *Có cần công ty / mã số thuế không?* Không, tài khoản cá nhân đủ để phát hành + nhận tiền AdMob.
- *Bao lâu mới publish được?* Sau khi tài khoản cá nhân đăng ký (sau 11/2023) còn vướng **yêu cầu
  closed testing** (§8) — lên kế hoạch ~2 tuần trước ngày muốn lên Production.

---

## 2. Tạo app + bật Play App Signing

1. Play Console → **Create app**.
   - App name: `Gravity Jelly`
   - Default language: `Tiếng Việt` (thêm English ở listing sau)
   - App or game: **Game**
   - Free or paid: **Free**
   - Tích các cam kết (Developer Program Policies, US export laws).
2. Sau khi tạo, package name sẽ **chốt khi upload bundle đầu tiên** = `com.ductranxuan.gravityjelly`
   (không đổi được về sau).
3. **Play App Signing**: mặc định bật khi upload `.aab`. Google giữ *app-signing key*, bạn chỉ giữ
   *upload key* (khoá đang mượn). Sau lần upload đầu:
   - Vào **Test and release → App integrity → App signing** → copy **SHA-1 và SHA-256 của
     "App signing key certificate"**. Đây là khoá dùng cho bản người dùng tải về.
   - Cần cho §4 (OAuth PGS). **Khai cả upload lẫn app-signing** SHA.

**Hỏi–đáp**
- *Có nên dùng Play App Signing không?* **Có** (khuyến nghị) — mất upload key vẫn reset được.
- *Mượn khoá gravity_merge có sao không?* Không. Một upload key ký được nhiều app khác package;
  app-signing key do Google cấp riêng từng app.

---

## 3. AdMob

1. <https://apps.admob.com> (dùng **cùng tài khoản** đang có pub `pub-3372922503955749`) → **Apps →
   Add app** → chọn "Đã có trên Google Play" (hoặc chưa, link sau) → package
   `com.ductranxuan.gravityjelly`.
2. ✅ **Đã tạo** 2 ad unit + lấy id thật (đã điền vào code — build type `release`):
   - App ID: `ca-app-pub-3372922503955749~3547570752`
   - `GJ Interstitial`: `ca-app-pub-3372922503955749/3918271696`
   - `GJ Rewarded`: `ca-app-pub-3372922503955749/1911924999`
3. ✅ **Đã wire theo build type**: `release` = id THẬT, `debug` = id TEST (an toàn — click ad test không
   bị khoá). Khi test bản **release** trên máy mình: đăng ký **test device** trong AdMob trước, đừng
   click ad thật (invalid traffic → khoá tài khoản).
4. **app-ads.txt**: đã đăng sẵn tại `https://privacypolicysite-one.vercel.app/app-ads.txt`.
   Để AdMob crawl được, khai **website nhà phát triển** = `https://privacypolicysite-one.vercel.app`
   trong **Play listing → Store settings** (và/hoặc trang developer). AdMob → **App settings →
   app-ads.txt** sẽ báo "Verified" sau vài ngày crawl.
5. **Privacy & messaging (UMP)** — bắt buộc để form đồng thuận EU hiện thật:
   - AdMob → **Privacy & messaging → GDPR** → *Create message* → chọn app → publish.
   - (Tuỳ chọn) **US states** messaging nếu muốn.
   - Code đã sẵn sàng gọi form (`ConsentManager`); chỉ cần message tồn tại.

**Hỏi–đáp**
- *AD_ID permission?* SDK Ads tự thêm `com.google.android.gms.permission.AD_ID` → phải khai ở
  Data safety (§5). Đã có sẵn trong build.
- *Publisher ID khác app ID?* `pub-3372922503955749` = **tài khoản** (chung cả 2 game); mỗi app có
  App ID `~XXXX` riêng. app-ads.txt chỉ khai publisher nên **dùng chung được**.
- *Test cách nào cho an toàn?* Giữ id TEST khi dev. Trước release, thêm **test device id** trong
  AdMob để không tự click ad thật (bị khoá tài khoản).

---

## 3B. Firebase — Analytics (GA4) + Crashlytics

Code đã tích hợp sẵn (`analytics/AnalyticsManager.kt`, gate theo consent). Chỉ cần tạo project Firebase
và thả file cấu hình vào:

1. <https://console.firebase.google.com> → **Add project** (có thể liên kết với **cùng tài khoản
   Google Analytics** để dữ liệu GA4 gom chung; hoặc tạo GA4 property mới khi được hỏi).
2. Trong project → **Add app → Android**:
   - **Package name:** `com.ductranxuan.gravityjelly` (BẮT BUỘC khớp — nếu không app không nhận cấu hình).
   - App nickname: `Gravity Jelly`.
   - (Tuỳ chọn) **SHA-1**: khai để bật Firebase Auth/Dynamic Links — Analytics/Crashlytics **không cần**.
3. **Tải `google-services.json`** → đặt vào **`app/google-services.json`** (đã gitignore — xem dưới).
   - Có file → Gradle **tự áp** plugin `google-services` + `firebase-crashlytics` (build.gradle.kts
     kiểm tra `file("google-services.json").exists()`). Vắng file → bỏ qua, dev vẫn build được.
4. **Bật Crashlytics**: Firebase console → **Crashlytics** → làm theo hướng dẫn (chạy app 1 lần +
   ép 1 crash test để dashboard nhận). Upload **mapping.txt** (§8) để deobfuscate.
5. **GA4**: sự kiện đã gửi sẵn — `screen_view`, `game_start`, `game_over`, `post_score`,
   `level_end` (kèm stars), `ad_shown`. Xem realtime ở **Firebase → Analytics → Realtime** hoặc
   **GA4 property**.

**Quan trọng — quyền riêng tư & consent**
- Manifest đặt thu thập **MẶC ĐỊNH TẮT**; `AnalyticsManager.setCollectionEnabled(canRequestAds)` bật
  lại **sau khi** UMP trả kết quả đồng thuận. Ngoài EEA thường bật ngay.
- Thêm Firebase = **tăng thu thập dữ liệu** → đã cập nhật **Privacy Policy** (đã redeploy) và phải
  khai ở **Data safety** (§5.5).

**Bảo mật:** `google-services.json` chứa key nhận diện project (không phải secret nghiêm trọng nhưng)
→ đã thêm vào `.gitignore`. Backup riêng; mỗi máy dev tự tải lại từ Firebase console.

---

## 4. Google Play Games Services — Bảng xếp hạng

1. Play Console → **Grow → Play Games Services → Setup and management → Configuration** → *Create*.
2. **Credentials → Add credential → Android**:
   - Package: `com.ductranxuan.gravityjelly`
   - Khai **SHA-1** cả hai khoá: upload (`B0:9B:…:24:C7`) **và** app-signing key (lấy ở §2).
   - Việc này tạo/liên kết **OAuth2 client** trong Google Cloud project của PGS.
3. **Leaderboards → Create leaderboard**:
   - Tên: `Endless — All time` (hiển thị: "Điểm cao nhất Endless")
   - Score format: **Numeric**, ordering **Larger is better**.
   - Copy **Leaderboard ID** dạng `CgkI…`.
4. **Project id**: lấy số project PGS (Configuration) → sẽ thay vào `game_services_project_id` (§7).
5. **Testers**: thêm email tester → test bản debug qua adb ở **sandbox** (chưa cần publish). Emulator
   phải là image **Google Play** (có Play Store).
6. **Publish** cấu hình PGS (nút riêng, tách với publish app) để mọi người thấy leaderboard. Có thể
   **reset điểm test** trước khi mở công khai.

**Hỏi–đáp**
- *Không đăng nhập PGS thì sao?* App tự lùi **bảng xếp hạng nội bộ offline** (đã code). PGS là tuỳ chọn.
- *Nộp điểm ở đâu trong code?* Tự động khi game-over Endless (`onBest → submitScore`, xem
  `PlayGamesManager.kt`). Bật nhánh online khi `LEADERBOARD_ID` là id thật.

---

## 5. Các form khai báo trong Play Console — CÂU TRẢ LỜI SOẠN SẴN

> Vào **Policy → App content**. Dưới đây là đáp án đúng theo app hiện tại (AdMob + Play Games +
> Firebase Analytics/Crashlytics, không IAP, không thu thập dữ liệu định danh cá nhân phía mình).
> Xác nhận rồi nộp.

### 5.1 App access
- **All functionality is available without special access** ✅
- Ghi chú cho reviewer (nếu hỏi về leaderboard): *"Đăng nhập Google Play Games là tuỳ chọn và tự
  động, không cần tài khoản/mật khẩu riêng. Toàn bộ game chơi được không cần đăng nhập."*

### 5.2 Ads
- **Yes, my app contains ads** ✅ (AdMob: interstitial + rewarded)

### 5.3 Content rating (IARC questionnaire)
- Category: **Game**
- Violence / Bạo lực: **No**
- Sexuality / Tình dục: **No**
- Language / Ngôn từ thô tục: **No**
- Controlled substances / Chất kích thích: **No**
- Gambling / Cờ bạc (mô phỏng): **No**
- User-generated content / Chia sẻ nội dung người dùng: **No**
- Users can communicate / Người dùng liên lạc với nhau: **No**
- Shares user location: **No**
- Digital purchases / Mua hàng số: **No** (không IAP)
- Contains ads: **Yes**
→ Kết quả kỳ vọng: **Everyone / PEGI 3** (game giải đố nhẹ).

### 5.4 Target audience & content
- Nhóm tuổi mục tiêu đề xuất: **13+** (tránh ràng buộc Families/COPPA phức tạp; vẫn dùng ad bình
  thường). *Nếu bạn muốn nhắm cả trẻ em <13:* phải theo **Families Policy** + chỉ dùng ad phù hợp
  gia đình (tắt cá nhân hoá) → cân nhắc kỹ, sẽ giới hạn doanh thu ad.
- Appeal to children? Nếu chọn 13+: **No / not primarily**.

### 5.5 Data safety — bảng khai chi tiết

**Nguyên tắc:** dữ liệu game (điểm, sao, seed, cài đặt) **lưu cục bộ, không rời máy → KHÔNG khai**.
Chỉ khai phần AdMob và Play Games.

| Câu hỏi | Trả lời |
|---|---|
| App thu thập/chia sẻ dữ liệu? | **Yes** (qua AdMob & Play Games) |
| **Device or other IDs** (Advertising ID) | Collected **Yes**, Shared **Yes** |
| — Mục đích | Advertising/marketing, Analytics, Fraud prevention |
| — Bắt buộc? | Optional (người EU có thể từ chối qua UMP) |
| — Xử lý bởi | Google AdMob |
| **User IDs** (Play Games gamer ID) | Collected **Yes**, Shared **Yes** *(chỉ khi user đăng nhập PGS)* |
| — Mục đích | App functionality (bảng xếp hạng) |
| — Bắt buộc? | Optional |
| **App activity** (sự kiện GA4: màn hình, ván chơi, điểm) | Collected **Yes**, Shared **No** (Firebase Analytics, Google là processor) |
| — Mục đích | Analytics |
| **Diagnostics / Crash logs** (Crashlytics) | Collected **Yes**, Shared **No** |
| — Mục đích | Analytics (chẩn đoán lỗi) |
| **App info & performance** (phiên bản app/OS, kiểu máy) | Collected **Yes**, Shared **No** (Firebase) |
| **Device or other IDs** (app-instance id của Firebase) | Collected **Yes**, Shared **No** |
| Dữ liệu **mã hoá khi truyền**? | **Yes** (HTTPS bởi SDK Google) |
| Người dùng **yêu cầu xoá** được? | **Yes** — reset Advertising ID ở cài đặt máy; xoá dữ liệu Play Games trong tài khoản Google; từ chối consent (EEA) để không thu thập analytics |
| Tên, email, vị trí (chính xác), ảnh, danh bạ… | **Không thu thập** |

> App có **Firebase Analytics (GA4) + Crashlytics** — khai đủ như bảng trên. Thu thập bị **tắt tới
> khi có đồng thuận** (UMP) ở khu vực yêu cầu. Không có SDK analytics nào khác.
>
> **"Shared"**: chỉ Advertising ID (AdMob) coi là *shared* (có thể tới đối tác quảng cáo). Dữ liệu
> Firebase/Play Games do Google xử lý **thay mặt** nhà phát triển (processor) → **Collected Yes, Shared No**.
>
> 📄 **File CSV IMPORT sẵn**: [`data-safety-import.csv`](data-safety-import.csv) — đã điền theo đúng
> **template chính chủ của Google** (`data_safety_sample.csv`). Play Console → App content → Data
> safety → **Import** → chọn file này. Đã điền: có thu thập + mã hoá khi truyền + không tạo tài khoản
> + 5 loại dữ liệu (User ID/Play Games, Crash logs, Diagnostics, App activity/GA4, Device or other
> IDs) kèm mục đích & thu thập/chia sẻ.
> ⚠️ **Xác nhận 1 ô trước khi nộp:** "cho phép yêu cầu xoá dữ liệu" đang để **Có** + URL = privacy
> policy (mô tả cách reset Ad ID/gỡ app). Nếu Google đòi cơ chế xoá chính thức hơn, chỉnh lại ô này.

### 5.6 Các mục còn lại
- **Government apps / News**: No.
- **Financial features**: No.
- **Health**: No.
- **Privacy policy URL**: `https://privacypolicysite-one.vercel.app`

---

## 6. Store listing (trang cửa hàng) — nội dung gợi ý

Chuẩn bị **cả vi + en** (app đã đa ngôn ngữ).

**Tên (≤30):** `Gravity Jelly`

**Mô tả ngắn (≤80):**
- vi: `Xếp thạch, xoay trọng lực để dồn khối và tạo combo dây chuyền!`
- en: `Fit jelly blocks, rotate gravity to slam clusters and chain big combos!`

**Mô tả đầy đủ (gợi ý ý chính — bạn trau chuốt):**
- Cơ chế chữ ký: **xoay hướng trọng lực 90°** dồn cả cụm khối.
- Endless + thang khó; combo dây chuyền hồi lượt xoay; siêu khối nổ.
- Chơi offline, một người; bảng xếp hạng (Play Games).
- Miễn phí (có quảng cáo).

**Tài nguyên đồ hoạ cần nộp:**
| Asset | Kích thước |
|---|---|
| App icon | 512×512 PNG |
| Feature graphic | 1024×500 |
| Screenshots điện thoại (≥2, nên 4–8) | Home, Endless, Campaign, Boss, **Bảng xếp hạng** |
| (Tuỳ chọn) video YouTube | — |

- **Category:** Game → Puzzle. **Tags:** puzzle, casual, brain.
- **Contact:** ductranxuan.29710@gmail.com.
- **Website:** `https://privacypolicysite-one.vercel.app` (giúp AdMob verify app-ads.txt — §3).

---

## 7. Đổi placeholder → id thật (sát ngày phát hành)

Chỉ làm ở **build release cuối** (giữ id TEST khi dev để không bị khoá AdMob):

| Đổi gì | File | Từ | Sang |
|---|---|---|---|
| AdMob App ID | `app/build.gradle.kts` `resValue admob_app_id` | ✅ tách theo build type | release=`~3547570752`, debug=TEST |
| Interstitial | `app/build.gradle.kts` `ADMOB_INTERSTITIAL_UNIT` | ✅ | release=`/3918271696` |
| Rewarded | `app/build.gradle.kts` `ADMOB_REWARDED_UNIT` | ✅ | release=`/1911924999` |
| PGS project id | `app/src/main/res/values/strings.xml` `game_services_project_id` | `000000000000` | project id thật |
| PGS leaderboard id | `app/.../games/PlayGamesManager.kt` `LEADERBOARD_ID` | `REPLACE_WITH_LEADERBOARD_ID` | `CgkI…` |
| Version | `app/build.gradle.kts` | `versionCode 1 / 0.1.0` | tăng mỗi bản (vd `1 / 1.0.0`) |
| UMP test hash | `app/.../ads/AdsConfig.kt` `TEST_DEVICE_HASHES` | (điền khi test) | **để rỗng** khi phát hành |

---

## 8. Build & upload

1. Tạo file `keystore.properties` ở root nếu chưa có (đã hướng dẫn — mượn từ gravity_merge). Kiểm:
   ```bash
   ./gradlew :app:signingReport   # variant release phải là Config: release
   ```
2. Build **App Bundle** (KHÔNG phải APK):
   ```bash
   ./gradlew :app:bundleRelease
   # ra: app/build/outputs/bundle/release/app-release.aab
   ```
3. Play Console → **Test and release → Internal testing → Create release** → upload `.aab`.
   - Upload luôn **mapping file**: `app/build/outputs/mapping/release/mapping.txt`
     (Play tự lấy từ bundle, nếu không thì thêm tay ở **App bundle explorer**) → để deobfuscate crash R8.
4. Cài qua link internal testing → test end-to-end trên **máy thật**: ad (test device), PGS đăng nhập
   (tài khoản tester), i18n vi/en, đổi ngôn ngữ trong app, UMP form (thêm test hash).
5. ⚠️ **Closed testing bắt buộc** (tài khoản cá nhân đăng ký sau 11/2023): cần **≥12 tester** tham gia
   **≥14 ngày** ở track **Closed testing** trước khi mở **Production**. Rủ đủ người sớm.
6. Đạt yêu cầu → **Production → staged rollout** (5% → 100%) để bắt crash sớm.

---

## 9. Sau phát hành

- Theo dõi **Android vitals** (ANR/crash), **AdMob** (fill rate, invalid traffic), **PGS** (số người
  đăng nhập, phân bố điểm — chỉnh roster/ngưỡng nếu cần).
- **Update**: bump `versionCode`, build `.aab` mới, cùng **upload key**. R8 mapping mỗi bản nhớ upload.
- **Backup** an toàn: `../gravity_merge/gravity_merge_release.jks` + `keystore.properties` + token Vercel.
  Mất keystore = không update app được (trừ khi reset qua Play App Signing).

---

## Phụ lục — trạng thái ĐÃ LÀM ở phía code/hạ tầng (không cần bạn làm lại)

| Việc | Trạng thái |
|---|---|
| applicationId `com.ductranxuan.gravityjelly` | ✅ chốt trong build.gradle.kts |
| Ký release (keystore mượn) + signingConfigs | ✅ verify `Config: release` |
| Privacy Policy (song ngữ) + deploy Vercel | ✅ live `privacypolicysite-one.vercel.app` |
| app-ads.txt | ✅ live `/app-ads.txt` |
| UMP consent (`ConsentManager`) | ✅ chạy trước init AdMob |
| Firebase Analytics (GA4) + Crashlytics (`AnalyticsManager`) | ✅ code + event + gate consent; **google-services.json đã thêm** (§3B) |
| AdMob id thật (App ID + Interstitial + Rewarded) | ✅ release=thật, debug=TEST (theo build type) |
| R8/minify + shrinkResources + proguard | ✅ `assembleRelease` OK |
| Bỏ flavor demo (chỉ `debug`/`release`) | ✅ ADS_ENABLED=true mặc định |
| Link privacy trong màn Cài đặt | ✅ mở URL thật |
| Bảng xếp hạng (online PGS + offline fallback) | ✅ chờ id thật để bật online |

**Việc còn lại thuần trên Console/tài khoản của bạn:** §1–§6 ở trên + đổi id thật (§7) + build/upload
(§8). Phần code đã sẵn sàng.
