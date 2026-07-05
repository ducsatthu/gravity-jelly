# Docs — Gravity Jelly

Mục lục tổng cho toàn bộ tài liệu dự án.
Cập nhật 04/07/2026.

> **Cấu trúc:** mọi thư mục và file đánh số theo nhóm để dễ định vị.
> `01-nen-tang` → `06-du-lieu`. File đánh dấu ✅ = đã implement trong code; không dấu = thiết kế chờ implement hoặc tầm nhìn dài hạn.

```
docs/
  00-muc-luc.md            ← file này
  01-nen-tang/             nghiệp vụ · kỹ thuật · kiến trúc
  02-thiet-ke-man/         schema · hệ mục tiêu · campaign · world specs
  03-co-che/               kho ý tưởng cơ chế · combo · boss
  04-ui-ux/                component in-game · map · guide · khay
  05-prompts/              prompt Claude Design/Code (artifact tạo UI/map)
  06-du-lieu/              spreadsheet thiết kế màn
  07-phat-hanh/            checklist phát hành Google Play (signing · AdMob · PGS · listing)
```

---

## 1. Nền tảng (`01-nen-tang/`)

| File | Mô tả |
|---|---|
| [01-nghiep-vu.md](01-nen-tang/01-nghiep-vu.md) | Hiểu nghiệp vụ gốc: USP, cơ chế cốt lõi, mô hình doanh thu, phạm vi MVP |
| [02-ky-thuat.md](01-nen-tang/02-ky-thuat.md) | Quyết định kỹ thuật: Native Kotlin, Compose + Canvas, game loop, checklist chống giật |
| [03-kien-truc.md](01-nen-tang/03-kien-truc.md) | Kiến trúc 3 lớp `:core`/`:game`/`:app`, luồng dữ liệu 1 chiều, rules cứng |

---

## 2. Thiết kế màn — Campaign (`02-thiet-ke-man/`)

### 2a. Hệ thống & schema

| File | Mô tả |
|---|---|
| [01-schema-man.md](02-thiet-ke-man/01-schema-man.md) | Schema chuẩn cho mọi file thiết kế màn: format, vocab, quy ước tọa độ, bảng curriculum 10 world |
| [02-he-muc-tieu.md](02-thiet-ke-man/02-he-muc-tieu.md) | **File chiến lược quan trọng nhất.** Hệ mục tiêu, taxonomy 8 GoalType, spec W1→W3 + draft W4, phương pháp solver |
| [03-campaign-vo-han.md](02-thiet-ke-man/03-campaign-vo-han.md) | Mô hình Campaign vô hạn (trục D, modifier pool, vòng cảnh, boss archetype, pipeline sinh màn). Tầm nhìn dài hạn |

### 2b. World 1 — Đồng cỏ (L1–L10) ✅

| File | Mô tả | Vai trò |
|---|---|---|
| [04-world-1-dong-co.md](02-thiet-ke-man/04-world-1-dong-co.md) | Spec chi tiết 10 màn W1 (tutorial world) | **NGUỒN THẬT** — khi lệch với 02-he-muc-tieu, lấy file này |
| [05-world-1-kich-ban.md](02-thiet-ke-man/05-world-1-kich-ban.md) | Playthrough beat-by-beat L1–L10 cho art/UX/QA | Bản diễn giải dễ đọc; nguồn thật vẫn là 04-world-1 |

**Curriculum W1:** L1 xóa hàng → L2 xóa cột → L3 xoay → L4 super1 → L5 super2 → L6 cầu vồng → L7 cầu vồng super → L8 combo×2 → L9 điểm → L10 Boss Chú Sâu (HP 5)

### 2c. World 2 — Rừng rậm (L11–L20) ✅

| File | Mô tả |
|---|---|
| [06-world-2-vine.md](02-thiet-ke-man/06-world-2-vine.md) | **Kỹ thuật vine 5 phần:** rễ/trồi/cành/countdown/rác. Luật mọc, chống ghép nhánh, MINT-only phá gốc. Khớp code `Vine.kt` |
| [02-he-muc-tieu.md § W2](02-thiet-ke-man/02-he-muc-tieu.md) | Spec 10 màn L11–L20 + Boss Thần Rừng (HP 8, spawn gốc mới mỗi 4 lượt) |

**Cơ chế chữ ký:** Dây leo mọc lan, bám cứng, chỉ MINT phá gốc → cả dây chết.

### 2d. World 3 — Sông & Thác (L21–L30) 🔧 (đang thiết kế cơ chế Dòng chảy)

| File | Mô tả |
|---|---|
| [07-world-3-nhip-nuoc.md](02-thiet-ke-man/07-world-3-nhip-nuoc.md) | **Thiết kế + kỹ thuật cơ chế Dòng chảy / Nguồn nước:** lớp effect sàn, mọc 1 nốt/lượt, đẩy cụm jelly, phá nguồn qua ô giọt. Bám `world3-water-kit.jsx`. Thay phương án flood cũ (`WaterfallFlow.kt`) |
| [02-he-muc-tieu.md § W3](02-thiet-ke-man/02-he-muc-tieu.md) | Spec 10 màn L21–L30 + Boss Thần Thác (phá 8 nguồn; hồi sinh + thả nguồn mỗi 3 lượt) |

**Cơ chế chữ ký (mới):** Nguồn nước hướng cố định mọc thêm 1 ô/lượt, đẩy jelly đứng trên nước; clear qua ô giọt → phá nguồn, tắt cả dòng chảy. Waterfall flood cũ bị thay. ⚠ Còn 1 điểm chốt: hướng cố định vs theo trọng lực (§12).

### 2e. World 4–10 (chưa implement)

| File | Mô tả |
|---|---|
| [02-he-muc-tieu.md § W4](02-thiet-ke-man/02-he-muc-tieu.md) | Draft W4 Sa mạc: đá cố định (STONE), Boss Tượng Cát Cổ. Chỉ bản nháp |
| [03-campaign-vo-han.md](02-thiet-ke-man/03-campaign-vo-han.md) | Curriculum W5–W10 ở mức tổng (mỗi world 1 cơ chế mới). Pipeline sinh màn vô hạn |

---

## 3. Cơ chế (`03-co-che/`)

| File | Mô tả |
|---|---|
| [01-kho-y-tuong.md](03-co-che/01-kho-y-tuong.md) | Kho 48+ ý tưởng cơ chế, phân nhóm A–G, gắn nhãn [lõi]/[cao cấp]/[rủi ro]. Evergreen |
| [02-combo.md](03-co-che/02-combo.md) | ✅ Hệ combo: timer 10s, hào quang 4 màu chạy quanh bàn, combo hồi lượt xoay |
| [03-boss.md](03-co-che/03-boss.md) | ✅ Hệ Đấu trùm: Khiên, phá bằng combo (bậc−1), tell, 3 boss W1–W3, checklist thêm boss W4+ |

---

## 4. UI/UX — Thiết kế & Hiện thực (`04-ui-ux/`)

| File | Mô tả |
|---|---|
| [01-boss-hud-objective-bar.md](04-ui-ux/01-boss-hud-objective-bar.md) | ✅ ObjectiveBar (score/targets/mixed/tutorial) + BossCard (thẻ Khiên). Bám design 03/07 |
| [02-guide-teach.md](04-ui-ux/02-guide-teach.md) | ✅ Hệ dạy luật: GjGuide registry, GuideTeachDialog, seenGuides DataStore |
| [03-khay-co-o.md](04-ui-ux/03-khay-co-o.md) | ✅ Ghi chú kỹ thuật: cỡ ô khay tính riêng từng mảnh thay vì chung |
| [04-man-ban-do.md](04-ui-ux/04-man-ban-do.md) | Thiết kế màn hình bản đồ leo màn: cuộn dọc, node, camera, FTUE, render chống giật (chưa implement) |

---

## 5. Prompts — artifact tạo UI/Map (`05-prompts/`)

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

### 5b. Prompt Map Design (`05-prompts/02-map/`)

| File | Chủ đề | Trạng thái |
|---|---|---|
| [00-tong-quan.md](05-prompts/02-map/00-tong-quan.md) | Index + tiến độ 10 world | W1 ✅, W2 đang làm |
| [01-mau-chung.md](05-prompts/02-map/01-mau-chung.md) | Style chung + 5 prompt trạng thái dùng lại + checklist | Dùng chung |
| [02-world-1-dong-co.md](05-prompts/02-map/02-world-1-dong-co.md) | W1 Đồng cỏ — node 1–10 + cổng | ✅ |
| [03-world-2-rung-ram.md](05-prompts/02-map/03-world-2-rung-ram.md) | W2 Rừng rậm | Đang làm |
| [04-world-3-song-thac.md](05-prompts/02-map/04-world-3-song-thac.md) | W3 Sông & Thác | Chưa |
| [05-world-4-sa-mac.md](05-prompts/02-map/05-world-4-sa-mac.md) | W4 Sa mạc | Chưa |
| [06-world-5-bai-bien.md](05-prompts/02-map/06-world-5-bai-bien.md) | W5 Bãi biển | Chưa |
| [07-world-6-nui-tuyet.md](05-prompts/02-map/07-world-6-nui-tuyet.md) | W6 Núi tuyết | Chưa |
| [08-world-7-hang-bang.md](05-prompts/02-map/08-world-7-hang-bang.md) | W7 Hang băng | Chưa |
| [09-world-8-nui-lua.md](05-prompts/02-map/09-world-8-nui-lua.md) | W8 Núi lửa | Chưa |
| [10-world-9-bau-troi.md](05-prompts/02-map/10-world-9-bau-troi.md) | W9 Bầu trời | Chưa |
| [11-world-10-vu-tru.md](05-prompts/02-map/11-world-10-vu-tru.md) | W10 Vũ trụ | Chưa |

### 5c. Prompt lẻ (Claude Design)

| File | Mô tả |
|---|---|
| [03-objectives.md](05-prompts/03-objectives.md) | ✅ phần lớn. Prompt thiết kế HUD mục tiêu, Level Intro, Boss HUD, Level Win, Badge. Phạm vi L1–L30 |
| [04-the-co-che.md](05-prompts/04-the-co-che.md) | Prompt vẽ mockup "thẻ cơ chế" Trước/Sau cho từng ý tưởng ở `03-co-che/01-kho-y-tuong.md` |
| [05-prototype-targets.md](05-prompts/05-prototype-targets.md) | Prompt prototype tương tác React cho vine (W2) và giọt nước (W3). Đã dùng |

---

## 6. Dữ liệu & Spreadsheet (`06-du-lieu/`)

| File | Mô tả |
|---|---|
| [01-thiet-ke-100-man.xlsx](06-du-lieu/01-thiet-ke-100-man.xlsx) | Bảng tính thiết kế 100 màn (vòng onboarding) |
| [02-he-level-vo-han.xlsx](06-du-lieu/02-he-level-vo-han.xlsx) | Bảng tính hệ thống level vô hạn (đường cong, vòng cảnh, modifier, goal cycle) |

---

## 7. Phát hành (`07-phat-hanh/`)

| File | Mô tả |
|---|---|
| [01-checklist-google-play.md](07-phat-hanh/01-checklist-google-play.md) | Checklist đưa app lên Google Play: ký release, AdMob, Play Games (leaderboard), data safety, store listing, closed testing. Có bảng placeholder→file cần đổi id thật |

---

## Đọc nhanh theo ngữ cảnh

| Bạn đang làm gì? | Đọc |
|---|---|
| **Implement màn W1** | `02-thiet-ke-man/04-world-1-dong-co.md` (nguồn thật) → `02-thiet-ke-man/01-schema-man.md` (schema) |
| **Implement màn W2** | `02-thiet-ke-man/02-he-muc-tieu.md § W2` + `02-thiet-ke-man/06-world-2-vine.md` |
| **Implement màn W3** | `02-thiet-ke-man/02-he-muc-tieu.md § W3` |
| **Thiết kế màn W4+** | `02-thiet-ke-man/02-he-muc-tieu.md § W4` + `02-thiet-ke-man/03-campaign-vo-han.md` (vô hạn) + `03-co-che/01-kho-y-tuong.md` |
| **Sửa UI/component** | `05-prompts/01-ui-render/00-tong-quan.md` → file 01–07 + `design/Gravity Jelly Design System/` |
| **Làm map Campaign** | `04-ui-ux/04-man-ban-do.md` + `05-prompts/02-map/00-tong-quan.md` → world cụ thể |
| **Hiểu cơ chế boss** | `03-co-che/03-boss.md` (hệ Đấu trùm — nguồn thật) |
| **Sửa ObjectiveBar/Boss HUD** | `04-ui-ux/01-boss-hud-objective-bar.md` + `05-prompts/03-objectives.md` |
| **Sửa combo** | `03-co-che/02-combo.md` (+ `03-co-che/01-kho-y-tuong.md` A8) |
| **Thêm cơ chế mới** | `03-co-che/01-kho-y-tuong.md` → `05-prompts/04-the-co-che.md` → `02-thiet-ke-man/01-schema-man.md` |
| **Hiểu nghiệp vụ/kiến trúc** | `01-nen-tang/01-nghiep-vu.md` + `01-nen-tang/03-kien-truc.md` |
| **Kiểm chứng fidelity** | `05-prompts/01-ui-render/07-kiem-chung.md` |
| **Chuẩn bị phát hành** | `07-phat-hanh/01-checklist-google-play.md` (ký release, AdMob, Play Games, store listing) |

---

## Nhật ký thay đổi

- **05/07/2026** — Thêm nhóm [`07-phat-hanh/`](07-phat-hanh/01-checklist-google-play.md): checklist phát hành Google Play (ký release, AdMob/PGS id thật, data safety, closed testing). Kèm bảng "placeholder→file cần đổi".
- **05/07/2026** — Thêm [`03-co-che/03-boss.md`](03-co-che/03-boss.md) (hệ Đấu trùm tổng hợp) + nhóm Cẩm nang **Đấu trùm** (4 mục). Sửa dữ liệu boss lỗi thời trong INDEX: W2 spawn gốc **mỗi 4 lượt** (không phải 3); W3 Thần Thác = **phá 8 nguồn + hồi sinh/thả nguồn mỗi 3 lượt** (BỎ đảo trọng lực HP 10 của bản cũ).
- **04/07/2026** — Tái cấu trúc toàn bộ `docs/`: đánh số 6 nhóm `01`–`06`, đổi tên file gọn, xoá `_archive/`, cập nhật toàn bộ link nội bộ + tham chiếu trong code/README/CLAUDE. Thống nhất quy ước: **mỗi tài liệu chỉ 1 bản latest**, bỏ nhãn phiên bản "v1/v2" khó hiểu; mọi thay đổi ghi ở mục **Nhật ký thay đổi** cuối từng file.
- **04/07/2026** — Sửa lệch dữ liệu boss thừa hưởng từ INDEX cũ: Thần Thác (L30) HP 5 → **HP 10** cho khớp `02-thiet-ke-man/02-he-muc-tieu.md`.
