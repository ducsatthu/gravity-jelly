# Docs — Gravity Jelly

Mục lục tổng cho toàn bộ tài liệu dự án.
Cập nhật 17/07/2026.

> **Cấu trúc:** mọi thư mục và file đánh số theo nhóm để dễ định vị.
> File đánh dấu ✅ = đã implement trong code; không dấu = thiết kế chờ implement hoặc tầm nhìn dài hạn.

```
docs/
  00-muc-luc.md            ← file này
  01-nen-tang/             nghiệp vụ · kỹ thuật · kiến trúc
  03-co-che/               kho ý tưởng cơ chế · combo
  04-ui-ux/                guide · khay
  05-prompts/              prompt Claude Design/Code (artifact tạo UI)
  07-phat-hanh/            checklist + runbook phát hành Google Play (signing · AdMob · PGS · listing · đáp án form)
  08-go-bo-campaign.md     ✅ gỡ bỏ tính năng Campaign (quyết định · phạm vi · layout Home mới)
  _archive/                thiết kế Campaign đã tạm gác 17/07 (giữ để tái dùng — xem _archive/README.md)
```

> **17/07/2026 — tính năng Campaign đã GỠ.** Endless là chế độ chơi duy nhất. Nhóm `02-thiet-ke-man/`,
> `05-prompts/02-map/`, `06-du-lieu/`, docs boss/map/objective đã chuyển vào [`_archive/`](_archive/README.md).
> Lý do + phạm vi: [`08-go-bo-campaign.md`](08-go-bo-campaign.md).

---

## 1. Nền tảng (`01-nen-tang/`)

| File | Mô tả |
|---|---|
| [01-nghiep-vu.md](01-nen-tang/01-nghiep-vu.md) | Hiểu nghiệp vụ gốc: USP, cơ chế cốt lõi, mô hình doanh thu, phạm vi MVP |
| [02-ky-thuat.md](01-nen-tang/02-ky-thuat.md) | Quyết định kỹ thuật: Native Kotlin, Compose + Canvas, game loop, checklist chống giật |
| [03-kien-truc.md](01-nen-tang/03-kien-truc.md) | Kiến trúc 3 lớp `:core`/`:game`/`:app`, luồng dữ liệu 1 chiều, rules cứng |

---

## 3. Cơ chế (`03-co-che/`)

| File | Mô tả |
|---|---|
| [01-kho-y-tuong.md](03-co-che/01-kho-y-tuong.md) | Kho 48+ ý tưởng cơ chế, phân nhóm A–G, gắn nhãn [lõi]/[cao cấp]/[rủi ro]. Evergreen |
| [02-combo.md](03-co-che/02-combo.md) | ✅ Hệ combo: timer 10s, hào quang 4 màu chạy quanh bàn, combo hồi lượt xoay |

---

## 4. UI/UX — Thiết kế & Hiện thực (`04-ui-ux/`)

| File | Mô tả |
|---|---|
| [02-guide-teach.md](04-ui-ux/02-guide-teach.md) | ✅ Hệ dạy luật: GjGuide registry, GuideTeachDialog, seenGuides DataStore |
| [03-khay-co-o.md](04-ui-ux/03-khay-co-o.md) | ✅ Ghi chú kỹ thuật: cỡ ô khay tính riêng từng mảnh thay vì chung |

---

## 5. Prompts — artifact tạo UI (`05-prompts/`)

### 5a. Prompt UI/Render (`05-prompts/01-ui-render/`) ✅ phần lớn

| File | Chủ đề | Trạng thái |
|---|---|---|
| [00-tong-quan.md](05-prompts/01-ui-render/00-tong-quan.md) | Master guide: nguồn chân lý, tokens Kotlin, 6 ràng buộc, phương pháp kiểm chứng | Hiện hành |
| [01-block.md](05-prompts/01-ui-render/01-block.md) | JellyBlock & Eyes: vẽ khối, mắt googly, corner sticker, squash/clearing | ✅ |
| [02-ui.md](05-prompts/01-ui-render/02-ui.md) | Icon, Button, HUD, Tray, GravityRotateButton, ComboPopup, Dialog | ✅ |
| [03-bo-cuc.md](05-prompts/01-ui-render/03-bo-cuc.md) | Bố cục: scaffold, BoardCanvas, JellyMeadow, ráp màn Game/Result/Settings | ✅ |
| [04-hub.md](05-prompts/01-ui-render/04-hub.md) | Home & điều hướng. **Home đã RE-SKIN** — dùng MEMORY/design system thay vì prompt cũ | Một phần cũ |
| [05-hieu-ung.md](05-prompts/01-ui-render/05-hieu-ung.md) | 5 effect spec + mắt sống theo tính cách màu | ✅ |
| [06-gameplay.md](05-prompts/01-ui-render/06-gameplay.md) | Nối `:core` ↔ render + input: GameSession, kéo-thả, xoay, cascade, pause | ✅ |
| [07-kiem-chung.md](05-prompts/01-ui-render/07-kiem-chung.md) | Kiểm chứng: audit token, fidelity, frame budget, hồi quy | Gate |

### 5b. Prompt lẻ (Claude Design)

| File | Mô tả |
|---|---|
| [04-the-co-che.md](05-prompts/04-the-co-che.md) | Prompt vẽ mockup "thẻ cơ chế" Trước/Sau cho từng ý tưởng ở `03-co-che/01-kho-y-tuong.md` |
| [06-home-redesign.md](05-prompts/06-home-redesign.md) | 🆕 **Prompt thiết kế lại màn Home** cho AI vẽ ảnh — đủ context dự án (cơ chế chữ ký · brand · palette · font · ràng buộc kỹ thuật) + 3 biến thể hướng. Dùng sau khi gỡ Campaign (Home còn 1 nút chơi → mất cân bố cục) |

---

## 7. Phát hành (`07-phat-hanh/`)

| File | Mô tả |
|---|---|
| [01-checklist-google-play.md](07-phat-hanh/01-checklist-google-play.md) | Checklist đưa app lên Google Play: ký release, AdMob, Play Games (leaderboard), data safety, store listing, closed testing. Có bảng placeholder→file cần đổi id thật |
| [02-thiet-lap-tung-buoc.md](07-phat-hanh/02-thiet-lap-tung-buoc.md) | **Runbook thiết lập**: thao tác từng bước Play Console/AdMob/PGS với **giá trị dự án điền sẵn** (applicationId, SHA, URL privacy, publisher) + **câu trả lời soạn sẵn** cho mọi form khai báo (Data safety, content rating, target audience, app access) |
| [03-todo-truoc-phat-hanh.md](07-phat-hanh/03-todo-truoc-phat-hanh.md) | **TODO còn lại** (rà soát 07/07): quyết định đã chốt (version 0.1.0 · 13+), icon PNG fallback API 24–25, xác minh id Play Games + upload mapping.txt, ghi nhớ store listing, bảng lint |

---

## 8. Gỡ bỏ Campaign (`08-go-bo-campaign.md`)

| File | Mô tả |
|---|---|
| [08-go-bo-campaign.md](08-go-bo-campaign.md) | ✅ **Đã thực thi 17/07.** Quyết định + phạm vi gỡ bỏ hoàn toàn tính năng Campaign (feedback chưa đủ tốt, ít chơi): xoá/refactor `:core`/`:game`/`:app`, layout Home mới (1 nút Endless canh giữa), seam theme-Endless tương lai |
| [_archive/README.md](_archive/README.md) | Chỉ mục tài liệu thiết kế Campaign đã lưu trữ (30 màn · 3 world · boss · map · hệ mục tiêu) |

---

## Đọc nhanh theo ngữ cảnh

| Bạn đang làm gì? | Đọc |
|---|---|
| **Sửa UI/component** | `05-prompts/01-ui-render/00-tong-quan.md` → file 01–07 + `design/Gravity Jelly Design System/` |
| **Sửa combo** | `03-co-che/02-combo.md` (+ `03-co-che/01-kho-y-tuong.md` A8) |
| **Sửa Home / layout menu** | `08-go-bo-campaign.md §5` (layout hiện tại) + `design/.../04-screens/home-screen.jsx` |
| **Thiết kế lại Home** | `05-prompts/06-home-redesign.md` (prompt cho AI vẽ ảnh) |
| **Thêm cơ chế mới** | `03-co-che/01-kho-y-tuong.md` → `05-prompts/04-the-co-che.md` |
| **Hệ dạy luật / Cẩm nang** | `04-ui-ux/02-guide-teach.md` |
| **Hiểu nghiệp vụ/kiến trúc** | `01-nen-tang/01-nghiep-vu.md` + `01-nen-tang/03-kien-truc.md` |
| **Kiểm chứng fidelity** | `05-prompts/01-ui-render/07-kiem-chung.md` |
| **Chuẩn bị phát hành** | `07-phat-hanh/01-checklist-google-play.md` (checklist) + `02-thiet-lap-tung-buoc.md` (runbook điền sẵn + đáp án form) |
| **Tìm thiết kế Campaign cũ** | `_archive/README.md` (⚠ không còn khớp code) |

---

## Nhật ký thay đổi

- **17/07/2026** — **Gỡ bỏ tính năng Campaign** ([`08-go-bo-campaign.md`](08-go-bo-campaign.md)): Endless thành chế độ chơi duy nhất. Docs Campaign (`02-thiet-ke-man/`, `05-prompts/02-map/`, `06-du-lieu/`, boss/map/objective) chuyển vào [`_archive/`](_archive/README.md); mục lục rút còn nhóm 01/03/04/05/07/08.
- **06/07/2026** — Thêm [`07-phat-hanh/02-thiet-lap-tung-buoc.md`](07-phat-hanh/02-thiet-lap-tung-buoc.md): runbook thiết lập từng bước với giá trị dự án điền sẵn (applicationId `com.ductranxuan.gravityjelly`, SHA, URL privacy `privacypolicysite-one.vercel.app`, publisher) + **đáp án soạn sẵn** cho Data safety / content rating / target audience / app access. Phản ánh việc đã làm: UMP, R8, app-ads.txt, link privacy in-app.
- **05/07/2026** — Thêm nhóm [`07-phat-hanh/`](07-phat-hanh/01-checklist-google-play.md): checklist phát hành Google Play (ký release, AdMob/PGS id thật, data safety, closed testing). Kèm bảng "placeholder→file cần đổi".
- **05/07/2026** — Thêm `03-co-che/03-boss.md` (hệ Đấu trùm tổng hợp) + nhóm Cẩm nang **Đấu trùm** (4 mục). *(Đã chuyển `_archive/03-boss.md` ngày 17/07.)*
- **04/07/2026** — Tái cấu trúc toàn bộ `docs/`: đánh số 6 nhóm `01`–`06`, đổi tên file gọn, xoá `_archive/`, cập nhật toàn bộ link nội bộ + tham chiếu trong code/README/CLAUDE. Thống nhất quy ước: **mỗi tài liệu chỉ 1 bản latest**, bỏ nhãn phiên bản "v1/v2" khó hiểu; mọi thay đổi ghi ở mục **Nhật ký thay đổi** cuối từng file.
