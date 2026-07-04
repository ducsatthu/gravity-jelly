---
name: i18n
description: Bắt buộc khi thêm/sửa BẤT KỲ chuỗi text hiển thị cho người chơi (Compose Text, contentDescription, nhãn nút/dialog/HUD, tên màn/khối/thế giới, nội dung Cẩm nang). KHÔNG hardcode tiếng Việt trong code — mọi text phải nằm trong file ngôn ngữ (res/values*/strings.xml) và lấy qua stringResource. Áp dụng cho mọi function có text người dùng nhìn thấy.
---

# Đa ngôn ngữ (i18n) — không hardcode text, luôn qua file ngôn ngữ

Game hỗ trợ **vi (mặc định)** + **en**, chuyển ngôn ngữ ngay trong app (per-app language,
AndroidX AppCompat). Mọi chuỗi **người chơi nhìn thấy** PHẢI nằm trong resource, KHÔNG viết
thẳng tiếng Việt trong code Kotlin.

## Nguồn ngôn ngữ (nguồn sự thật)
- `app/src/main/res/values/strings.xml` — **tiếng Việt** (mặc định, luôn khớp key với bản en).
- `app/src/main/res/values-en/strings.xml` — **tiếng Anh**.
- Thêm ngôn ngữ mới = thêm `AppLanguage` (`app/.../i18n/AppLocale.kt`) + `values-<tag>/strings.xml`.

## Quy tắc CỨNG khi viết code có text
1. **Không hardcode** chuỗi hiển thị. Trong `@Composable` dùng:
   `Text(stringResource(R.string.<key>))`, `contentDescription = stringResource(R.string.<key>)`.
   Import: `androidx.compose.ui.res.stringResource` (+ `com.gravityjelly.app.R` nếu khác package).
2. **Đặt key** rõ theo màn/khối: `<prefix>_<mô_tả_snake>` (vd `settings_title`, `home_endless`,
   `boss_shield`). Prefix theo file/màn để tránh trùng.
3. **Thêm CẢ HAI** `values/strings.xml` (vi) và `values-en/strings.xml` (en) cùng lúc, cùng key.
   Thiếu key ở `values-en` → tự fallback về vi (không lỗi) nhưng phải dịch đủ.
4. **Tham số/nội suy**: dùng placeholder định vị `%1$s` / `%1$d` trong resource, gọi
   `stringResource(R.string.key, arg1, arg2)`. KHÔNG nối chuỗi `"...$x..."` cho text hiển thị.
5. **Ngoài @Composable** (data class, factory không-composable): KHÔNG nhét text vào đó. Hoặc
   (a) đổi hàm thành `@Composable` nếu mọi caller là composable, hoặc (b) **resolve ở call-site
   composable rồi truyền chuỗi đã dịch xuống** như tham số.
6. **`:core` (Kotlin/JVM thuần, không có API Android)**: KHÔNG chứa text hiển thị. Core chỉ giữ
   **khoá ổn định** (vd `Level.id` → `R.string.level_<id>_name`); `:app` resolve qua `stringResource`.
   Xem `LevelText.kt` / resolver ở `:app` cho mẫu tra khoá → resource.
7. **Rich-text nhiều màu** (AnnotatedString, vd Cẩm nang `GjGuide`): lưu MỘT resource có **markup
   tag màu** `[p]…[/p]` (Primary) · `[g]…[/g]` (Gravity) · `[w]…[/w]` (Warning) · `[s]…[/s]` (Success),
   `\n` xuống dòng; dựng AnnotatedString bằng helper `guideBody(@StringRes res)`. Cấu trúc/màu ở code,
   chữ ở resource — dịch chỉ sửa resource.
8. **Chuyển ngôn ngữ**: qua `AppLocale.set(AppLanguage.X)` — tự lưu + recreate Activity. KHÔNG tự
   lưu ngôn ngữ ở DataStore/nơi khác (tránh hai nguồn sự thật).

## KHÔNG cần đưa vào resource (giữ literal)
- Comment / KDoc (dự án viết comment tiếng Việt — giữ nguyên).
- Chuỗi trong hàm `@Preview` (không ship).
- `error()` / `require()` / log / analytics / thông điệp dev.
- Khoá map/enum/route, `label = "..."` của animation.
- Endonym ngôn ngữ trong bộ chọn ("Tiếng Việt", "English") và tên thương hiệu ("Gravity Jelly").
- Con số/ký hiệu thuần (version "1.0.0", "×2", "%").

## Checklist trước khi xong một thay đổi UI có text
- [ ] Không còn literal tiếng Việt hiển thị trong code (`grep` ký tự có dấu trong `"..."`, trừ comment).
- [ ] Mỗi key mới có ở **cả** `values` và `values-en`.
- [ ] Nội suy dùng `%1$s/%1$d`, không nối chuỗi.
- [ ] `:core` không thêm text hiển thị; nếu cần, thêm resource ở `:app` + resolver theo khoá.
- [ ] Build sạch: `./gradlew :app:compileProductionDebugKotlin :app:processProductionDebugResources`.

## Liên quan
- Đổi UI/hiệu ứng: đọc kèm skill **design-fidelity** (bám design system, không tự chế giá trị).
