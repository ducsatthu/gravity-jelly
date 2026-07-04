# 07 · Kiểm chứng — Fidelity, token adherence, frame budget

Chạy file này **sau khi xong 01–06** (hoặc sau mỗi mốc) để đảm bảo lớp nhìn **thật sự giống design** và **không giật**. Đây là cổng chất lượng, không thêm tính năng.

**Đối chiếu với:** mọi `*.card.html` / `*.jsx` trong `design/Gravity Jelly Design System/`, token trong `01-tokens/`, checklist chống giật trong `CLAUDE.md` gốc repo.

---

## Prompt 1 — Audit token adherence (không hardcode)

```
Mục tiêu: chứng minh mọi màu/dp/motion truy ra token có tên, không literal rải rác.

Việc:
- Grep toàn :game/:app tìm literal màu (Color(0x...), #...) và dp số ngoài lớp token (Color.kt, Dimens.kt, JellyTheme.kt, GjMotion). Liệt kê mọi chỗ vi phạm.
- Sửa: thay literal bằng token; nếu thiếu token thì thêm vào lớp token (dịch 1:1 từ 01-tokens/*.css), không bịa giá trị.
- Đối chiếu giá trị token với 01-colors.css / 03-spacing-radius.css / 04-dimensions.css / 05-motion.css — sửa lệch nếu có.

Acceptance: 0 literal màu/dp/motion ngoài lớp token (trừ chỗ bất khả kháng có chú thích); token khớp css.
Kiểm chứng: dán kết quả grep trước/sau; build xanh.
```

## Prompt 2 — So mắt từng màn & component với card

```
Mục tiêu: bảng đối chiếu fidelity có dẫn chứng.

Việc:
- Với mỗi hạng mục, render @Preview/Compose tương ứng và mở card design cạnh nhau: JellyBlock, Eyes, Button, Hud, Tray, GravityRotateButton, ComboPopup, Dialog, Home, Game, Result, Settings, và 5 effect.
- Lập bảng: [Mục] | [Card nguồn] | [Khớp ✅ / Lệch ⚠️ + mô tả] | [Token liên quan].
- Sửa các Lệch ⚠️ ưu tiên: sai màu/kích thước → sai bố cục → sai motion.

Acceptance: bảng phủ hết mục ở 00-index design; mọi ⚠️ còn lại có lý do rõ (vd giới hạn Compose) hoặc đã sửa.
Kiểm chứng: nộp bảng + ảnh chụp Preview các màn chính.
```

## Prompt 3 — Frame budget & chống giật

```
Mục tiêu: xác nhận gameplay + hiệu ứng chạy mượt, allocation-free.

Đọc trước: CLAUDE.md gốc repo (checklist chống giật); 05-effects/05-particles-juice.md (lifetime ≤450ms).

Việc:
- Soát vùng vẽ (DrawScope) và frame loop (withFrameNanos): xác nhận KHÔNG new object (Paint/Path/List/Offset…) mỗi frame; particle/popup qua pool; toạ độ precompute.
- Vẽ cả bàn trong MỘT Canvas (không Composable/ô). Game-state ngoài Compose; recompose vỏ chỉ khi điểm/lượt đổi.
- Đo bằng công cụ thật (Android Studio Profiler / Perfetto / Macrobenchmark) trên một bố cục nặng (combo dài): ngân sách main-thread/khung < ~8ms; báo cáo số.

Acceptance: không cấp phát trong vòng vẽ/loop; một Canvas cho bàn; số đo frame đạt ngưỡng trên máy tầm trung.
Kiểm chứng: dán trace/số đo + danh sách điểm đã tối ưu.
```

## Prompt 4 — Hồi quy: build + test + đi hết luồng

```
Mục tiêu: chốt không vỡ gì sau toàn bộ thay đổi render.

Việc:
- ./gradlew :core:test (gồm golden resolve) + :app:assembleDebug — phải xanh.
- Chạy app đi hết: Home → Game (đặt mảnh ≥2 hướng, xoay tới hết lượt, tạo combo, chơi tới thua) → Result (hồi sinh/x2 test ad) → Settings (đổi toggle) → Home. Bật reduced-motion + tắt rung kiểm tra tôn trọng setting.
- Xác nhận deterministic: cùng seed + cùng chuỗi input ⇒ cùng điểm cuối (chạy lại 2 lần).

Acceptance: build/test xanh; đi trọn luồng không crash; deterministic giữ nguyên; setting được tôn trọng.
Kiểm chứng: nhật ký các chặng + kết quả test + xác nhận 2 lần chạy cùng seed ra cùng điểm.
```
