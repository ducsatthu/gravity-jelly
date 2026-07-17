# Prompt — Thiết kế lại màn Home (sau khi gỡ Campaign)

Cập nhật 17/07/2026.

Dùng cho **AI vẽ ảnh / AI thiết kế** (Claude Design artifact, Midjourney, Nano Banana, Figma AI…)
để ra một **thiết kế tổng thể mới cho màn Home**. Bối cảnh: Campaign vừa bị gỡ
([`../08-go-bo-campaign.md`](../08-go-bo-campaign.md)) nên Home cũ (2 nút chơi) giờ chỉ còn 1 nút
Endless — bố cục cũ mất cân, cần thiết kế lại tổng thể thay vì chỉ xoá 1 nút.

**Cách dùng:** copy trọn khối trong `===== PROMPT =====` bên dưới, dán vào AI. Phần §Biến thể ở cuối
là các hướng chạy thêm nếu muốn nhiều phương án so sánh.

---

## Ghi chú trước khi chạy prompt

- Prompt **cố tình mô tả đầy đủ dự án** (thể loại, cơ chế chữ ký, brand, palette, font, thiết bị,
  ràng buộc kỹ thuật) để AI không cần hỏi lại và không tự chế lệch tông.
- Prompt **KHÔNG khoá cứng bố cục cũ** — chủ ý để AI được sáng tạo. Ràng buộc chỉ nằm ở brand +
  kỹ thuật (những thứ đổi sẽ vỡ code/asset).
- Nếu muốn AI bám sát thiết kế hiện có hơn, đính kèm ảnh `design/exports/screenshot-5-home-1080x1920.png`
  + `design/.../06-svg-assets/backgrounds/home-world-1-bg.jpg` khi chạy.

---

===== PROMPT =====

Bạn là **art director + UI designer** cho một game mobile. Hãy thiết kế lại **màn hình Home** cho
game **Gravity Jelly**. Trả về **1 thiết kế tổng thể hoàn chỉnh** (mô tả + mockup hình ảnh), sáng
tạo trong khuôn khổ brand bên dưới.

## 1. Game này là gì

**Gravity Jelly** — game **giải đố xếp khối (block-fit puzzle) casual, chơi một mình, offline**,
trên **Android**. Miễn phí, doanh thu từ quảng cáo.

**Cơ chế chữ ký (điểm độc nhất, phải toát ra được ở Home):** người chơi **XOAY được hướng trọng lực
90°** để dồn CẢ cụm khối trên bàn đổ về một phía. Không game xếp khối nào khác cho làm điều này —
đây là thứ cần "bán" ngay ở màn đầu tiên.

**Lối chơi:** bàn 9×9, khay 3 mảnh, đặt mảnh tự do (không rơi), xóa đầy hàng/cột để ghi điểm; khối
cùng màu dính thành cụm và đổ theo trọng lực; xóa liên tiếp → **combo dây chuyền** (combo lớn còn
hồi thêm lượt xoay trọng lực); gộp 9 ô cùng màu → **siêu khối** phát nổ quét sạch cả vùng.

**Chỉ có MỘT chế độ chơi: Endless (Bất tận)** — chơi tới khi hết chỗ, đua điểm cao của chính mình.
(Trước đây từng có chế độ Chiến dịch nhưng đã gỡ bỏ — đừng thiết kế gì liên quan tới màn/world/boss/
bản đồ/sao.)

## 2. Nhân vật & brand

**"Khối thạch có mắt" (block jelly)** — nhân vật của game là những **khối vuông bo góc bằng thạch,
CÓ ĐÔI MẮT sống động**, viền dày, có vệt bóng (gloss) ở đỉnh. Chúng chớp mắt, liếc nhìn, biểu cảm
theo tính cách riêng của từng màu.

**4 khối cơ bản** (tên · màu fill / viền / bóng):
- **Thạch Sao** — vàng `#FFE3A3` / `#E8B85C` / `#FFF1CE` — tính cách: vui vẻ
- **Thạch Lá** — mint `#A3E5D9` / `#5FC3B2` / `#CBF2EB` — tính cách: thư thái
- **Thạch Tim** — hồng `#F7A9C0` / `#E576A0` / `#FBD0DF` — tính cách: tinh nghịch
- **Thạch Nước** — xanh `#B3C7F7` / `#7E9CE8` / `#D6E1FB` — tính cách: nghiêm túc

**Tông thương hiệu:** ngọt ngào kiểu kẹo (candy-sweet), ấm áp, thân thiện, sạch sẽ, vui tươi. Nền
kem ấm, bóng đổ nâu nhạt mềm. **KHÔNG** dark mode, **KHÔNG** neon/sci-fi, **KHÔNG** phong cách
chiến đấu/RPG/gritty. Đối tượng: người chơi casual mọi lứa tuổi.

**Màu hệ thống:**
- Nền kem `#FFF7EC` · trắng `#FFFFFF` · nền lõm `#F4E9D8`
- Chữ: chính `#5B4636` (nâu cocoa ấm) · phụ `#9B886F` · trên nền tối `#FFFFFF`
- CTA chính: cam quýt `#FF9F68` / viền `#E97E45` / bóng `#FFC59A`
- **Tím trọng lực** (màu nhấn của cơ chế chữ ký) `#7E6CF0` / `#6353D6` / `#A99CF6`
- Ngữ nghĩa: success `#6FCF7F` · warning `#FFCA66` · danger `#F08A7E` · info `#8FB6F2`
- Bóng đổ: mềm `rgba(120,92,52,0.16)` · đậm `rgba(120,92,52,0.24)`

**Font:** display/số = **Baloo 2** (bo tròn, đủ dấu tiếng Việt) · body/nhãn = **Nunito** (600–800).
⚠ Game hỗ trợ **tiếng Việt (mặc định) + English** — mọi nhãn phải chừa chỗ cho **dấu tiếng Việt**
(chiều cao dòng thoáng, không cắt dấu) và cho chuỗi tiếng Anh dài hơn ~30%.

**Hình khối:** lưới spacing 4dp (2/4/8/12/16/24/32/48) · bo góc: chip 8 · ô thạch 12 · thẻ 20 ·
nút/panel 28 · sheet lớn 36 · viên thuốc 999 · viền: mảnh 1.5 · khối thạch 3.
**Chuyển động:** ngắn 150–450ms, nảy nhẹ kiểu thạch (bouncy ease).

## 3. Màn Home cần có gì

**Bắt buộc — 4 lối vào (không hơn):**
1. **ENDLESS** — nút chơi chính, phải là thứ đập vào mắt đầu tiên, rõ ràng là hành động số 1.
2. **Cẩm nang** — sổ tay giải thích luật chơi/cơ chế.
3. **Bảng xếp hạng** — so điểm qua Google Play Games.
4. **Cài đặt** — âm thanh, nhạc, rung, ngôn ngữ.

**Nên có:** logo/tên game; **kỷ lục điểm cao nhất** của người chơi (hiện đang KHÔNG hiện ở Home —
bạn được quyền đề xuất đưa vào nếu thấy hợp).

**KHÔNG có (đừng vẽ):** nút Chiến dịch/Campaign, bản đồ màn, sao, boss, hệ mạng/tim (lives), tiền tệ
trong game, shop, daily reward, nhiệm vụ, đăng nhập.

## 4. Ràng buộc kỹ thuật (đổi là vỡ code — phải tuân)

- **Thiết bị:** Android **dọc**, thiết kế theo khung **360 × 800 dp**. Lề ngang 16dp. Vùng chạm ≥ 48dp.
  Phải chừa vùng an toàn: thanh trạng thái trên + thanh điều hướng dưới.
- **Phải co giãn theo TỈ LỆ**, không dùng số đo cứng — game chạy trên đủ mọi cỡ máy (màn cao/thấp
  khác nhau nhiều). Nói rõ mỗi thành phần neo vào đâu (đáy/giữa/theo %).
- **Nền hiện có** là một bức tranh vẽ tay tỉ lệ **821×1916** (cao/rộng ≈ 2.33) neo ĐÁY, full bề
  ngang; phần dư phía trên là bầu trời màu phẳng. Nếu thiết kế của bạn cần nền khác, hãy nói rõ tỉ lệ
  và cách neo.
- **Hiệu năng:** game ưu tiên **mượt, không giật**. Tránh đề xuất đổ bóng/blur nhiều lớp, particle
  dày đặc, hay animation chạy liên tục toàn màn. Hiệu ứng nền nhẹ là được (hiện có: cánh hoa bay
  ngang như gió, ~12 hạt).
- Có chế độ **giảm chuyển động (reduced motion)** — nói rõ hiệu ứng nào tắt khi bật.

## 5. Việc của bạn

Đưa ra **một thiết kế tổng thể** cho Home, gồm:

1. **Ý tưởng chủ đạo** (2–3 câu): thiết kế này bán cảm giác gì? Làm sao nó khoe được cơ chế "xoay
   trọng lực" ngay ở màn đầu?
2. **Mockup hình ảnh** màn Home hoàn chỉnh, đúng khung 360×800dp (tỉ lệ 9:20), đúng brand ở §2.
3. **Bố cục**: từng thành phần nằm đâu, cỡ bao nhiêu (theo dp hoặc %), neo vào đâu, thứ tự thị giác
   từ 1 → 4.
4. **Hệ thống phân cấp**: vì sao mắt người chơi rơi vào Endless trước, rồi tới đâu.
5. **Chuyển động**: 2–4 hiệu ứng, mỗi cái kèm thời lượng + easing + lý do (bám 150–450ms, nảy nhẹ).
6. **Trạng thái**: nút lúc nhấn trông thế nào; màn hình lúc mới mở (có animation vào không).
7. **Ghi chú cho engineer**: những chỗ dễ làm sai khi dựng bằng Jetpack Compose.

**Được sáng tạo:** bố cục, cách sắp xếp, cách hiện kỷ lục, vai trò của khối thạch trên màn (chúng có
thể là nhân vật sống động chứ không chỉ là icon), cách gợi ý cơ chế xoay trọng lực, hiệu ứng nền.

**Đừng đổi:** palette, font, tông brand, nhân vật khối-thạch-có-mắt, 4 lối vào ở §3, ràng buộc §4.

===== HẾT PROMPT =====

---

## Biến thể (chạy thêm nếu muốn nhiều phương án so sánh)

Thêm MỘT trong các đoạn sau vào cuối prompt để ép hướng khác nhau, rồi so 3 bản:

| Hướng | Đoạn thêm |
|---|---|
| **A. Sân khấu nhân vật** | "Hướng bắt buộc: coi Home như một **sân khấu cho các khối thạch có mắt** — chúng là ngôi sao, tương tác với nhau, phản ứng khi người chơi chạm. Menu lùi về vai trò phụ, gọn nhất có thể." |
| **B. Khoe cơ chế** | "Hướng bắt buộc: Home phải **demo được cơ chế xoay trọng lực** — một cụm khối nhỏ trên màn tự đổ theo hướng trọng lực đang đổi (hoặc người chơi vuốt để đổi). Menu bám quanh phần demo đó." |
| **C. Tối giản ấm áp** | "Hướng bắt buộc: **tối giản** — ít phần tử nhất có thể, nhiều khoảng thở, chỉ 1 CTA to rõ + 3 icon nhỏ. Sang trọng, sạch, không rối. Sức nặng dồn vào typography + một hình ảnh chủ đạo duy nhất." |

## Sau khi có thiết kế

1. Đối chiếu token với `design/Gravity Jelly Design System/01-tokens/` (màu/spacing/radius/motion).
2. Nếu chốt: cập nhật `design/.../04-screens/home-screen.jsx` trước, rồi mới dựng
   `app/src/main/kotlin/com/gravityjelly/app/HomeScreen.kt` theo — **thiết kế là nguồn thật**
   (xem skill `design-fidelity`).
3. Text mới phải vào `res/values/strings.xml` + `values-en/strings.xml` (skill `i18n`), KHÔNG hardcode.
4. Asset nút hiện có ở `06-svg-assets/ui/btn-{infinite,guide,leaderboard,setting}.png` — nếu thiết kế
   cần asset mới, liệt kê rõ tên + tỉ lệ px.

---

## Nhật ký thay đổi

- **17/07/2026** — Tạo tài liệu: prompt thiết kế lại Home sau khi gỡ Campaign (Home cũ 2 nút chơi giờ chỉ còn Endless nên mất cân bố cục).
