# Docs — Gravity Jelly

Mục lục tổng cho toàn bộ tài liệu dự án.
Cập nhật 03/07/2026.

> **Quy ước:** file đánh dấu ✅ = đã implement trong code. File không dấu = thiết kế chờ implement hoặc tầm nhìn dài hạn.
> File cũ / bị thay thế nằm trong `_archive/`.

---

## 1. Nền tảng (ít thay đổi)

| File | Mô tả |
|---|---|
| [business-understanding.md](business-understanding.md) | Hiểu nghiệp vụ gốc: USP, cơ chế cốt lõi, mô hình doanh thu, phạm vi MVP |
| [technical-approach.md](technical-approach.md) | Quyết định kỹ thuật: Native Kotlin, Compose + Canvas, game loop, checklist chống giật |
| [architecture.md](architecture.md) | Kiến trúc 3 lớp `:core`/`:game`/`:app`, luồng dữ liệu 1 chiều, 12 rules cứng |

---

## 2. Level Design — Chiến dịch (Campaign)

### 2a. Hệ thống & schema

| File | Mô tả |
|---|---|
| [levels/_level-spec.md](levels/_level-spec.md) | Schema chuẩn cho mọi file thiết kế màn: format, vocab, quy ước tọa độ, bảng curriculum 10 world |
| [levels/goal-system-v2.md](levels/goal-system-v2.md) | **File chiến lược quan trọng nhất.** Hệ mục tiêu v2, taxonomy 8 GoalType, spec W1→W3 + draft W4, phương pháp solver |
| [level-design.md](level-design.md) | Mô hình Campaign vô hạn (trục D, modifier pool, vòng cảnh, boss archetype, pipeline sinh màn). Tầm nhìn dài hạn |

### 2b. World 1 — Đồng cỏ (L1–L10) ✅

| File | Mô tả | Vai trò |
|---|---|---|
| [levels/world-01-dong-co.md](levels/world-01-dong-co.md) | Spec chi tiết 10 màn W1 (tutorial world) | **NGUỒN THẬT** — khi lệch với goal-system-v2, lấy file này |
| [levels/kich-ban-choi-1-10.md](levels/kich-ban-choi-1-10.md) | Playthrough beat-by-beat L1–L10 cho art/UX/QA | Bản diễn giải dễ đọc; nguồn thật vẫn là world-01 |

**Curriculum W1:** L1 xóa hàng → L2 xóa cột → L3 xoay → L4 super1 → L5 super2 → L6 cầu vồng → L7 cầu vồng super → L8 combo×2 → L9 điểm → L10 Boss Chú Sâu (HP 5)

### 2c. World 2 — Rừng rậm (L11–L20) ✅

| File | Mô tả |
|---|---|
| [levels/vine-mechanic.md](levels/vine-mechanic.md) | **Kỹ thuật vine 5 phần:** rễ/trồi/cành/countdown/rác. Luật mọc, chống ghép nhánh, MINT-only phá gốc. Khớp code `Vine.kt` |
| [levels/goal-system-v2.md § W2](levels/goal-system-v2.md) | Spec 10 màn L11–L20 + Boss Thần Rừng (HP 8, spawn gốc mới mỗi 3 lượt) |

**Cơ chế chữ ký:** Dây leo mọc lan, bám cứng, chỉ MINT phá gốc → cả dây chết.

### 2d. World 3 — Sông & Thác (L21–L30) ✅ (phương án nhẹ)

| File | Mô tả |
|---|---|
| [levels/goal-system-v2.md § W3](levels/goal-system-v2.md) | Spec 10 màn L21–L30 + Boss Thần Thác (đảo gravity 180° mỗi 3 lượt, HP 5) |

**Cơ chế hiện tại:** giọt nước = `CellType.TARGET` (rơi theo trọng lực). Waterfall BFS flow chưa code — ngưỡng chờ playtest.

### 2e. World 4–10 (chưa implement)

| File | Mô tả |
|---|---|
| [levels/goal-system-v2.md § W4](levels/goal-system-v2.md) | Draft W4 Sa mạc: đá cố định (STONE), Boss Tượng Cát Cổ. Chỉ bản nháp |
| [level-design.md](level-design.md) | Curriculum W5–W10 ở mức tổng (mỗi world 1 cơ chế mới). Pipeline sinh màn vô hạn |

---

## 3. Cơ chế & Brainstorm

| File | Mô tả |
|---|---|
| [mechanics-ideas.md](mechanics-ideas.md) | Kho 48+ ý tưởng cơ chế, phân nhóm A–G, gắn nhãn [lõi]/[cao cấp]/[rủi ro]. Evergreen |
| [prompts-design-mechanics.md](prompts-design-mechanics.md) | Prompt Claude Design vẽ mockup "thẻ cơ chế" Trước/Sau cho từng ý tưởng |
| [prompts-claude-design-prototype-targets.md](prompts-claude-design-prototype-targets.md) | Prompt prototype tương tác React cho vine (W2) và giọt nước (W3). Đã dùng |

---

## 4. UI/UX — Thiết kế & Hiện thực

### 4a. In-game components

| File | Mô tả |
|---|---|
| [components/boss-hud-objective-bar.md](components/boss-hud-objective-bar.md) | ✅ ObjectiveBar (score/targets/mixed/tutorial) + BossCard (thẻ Khiên). Bám design 03/07 |
| [guide-teach-system.md](guide-teach-system.md) | ✅ Hệ dạy luật: GjGuide registry, GuideTeachDialog, seenGuides DataStore |
| [khay-co-o-tung-manh.md](khay-co-o-tung-manh.md) | ✅ Ghi chú kỹ thuật: cỡ ô khay tính riêng từng mảnh thay vì chung |

### 4b. Campaign map (chưa implement)

| File | Mô tả |
|---|---|
| [ui-map-screen.md](ui-map-screen.md) | Thiết kế màn hình bản đồ leo màn: cuộn dọc, node, camera, FTUE, render chống giật |

### 4c. Prompt UI/Render (bộ 7 file) ✅ phần lớn

| File | Chủ đề | Trạng thái |
|---|---|---|
| [prompts-ui/README.md](prompts-ui/README.md) | Master guide: nguồn chân lý, tokens Kotlin, 6 ràng buộc, phương pháp kiểm chứng | Hiện hành |
| [prompts-ui/01-block.md](prompts-ui/01-block.md) | JellyBlock & Eyes: vẽ khối, mắt googly, corner sticker, squash/clearing | ✅ |
| [prompts-ui/02-ui.md](prompts-ui/02-ui.md) | Icon, Button, HUD, Tray, GravityRotateButton, ComboPopup, Dialog | ✅ |
| [prompts-ui/03-bo-cuc.md](prompts-ui/03-bo-cuc.md) | Bố cục: scaffold, BoardCanvas, JellyMeadow, ráp màn Game/Result/Settings | ✅ |
| [prompts-ui/04-hub.md](prompts-ui/04-hub.md) | Home & điều hướng. **Home đã RE-SKIN** — dùng MEMORY/design system thay vì prompt cũ | Một phần cũ |
| [prompts-ui/05-hieu-ung.md](prompts-ui/05-hieu-ung.md) | 5 effect spec + mắt sống theo tính cách màu | ✅ |
| [prompts-ui/06-gameplay.md](prompts-ui/06-gameplay.md) | Nối `:core` ↔ render + input: GameSession, kéo-thả, xoay, cascade, pause | ✅ |
| [prompts-ui/07-kiem-chung.md](prompts-ui/07-kiem-chung.md) | Kiểm chứng: audit token, fidelity, frame budget, hồi quy | Gate |

### 4d. Prompt Map Design (bộ 12 file)

| File | Chủ đề | Trạng thái |
|---|---|---|
| [prompts-map/README.md](prompts-map/README.md) | Index + tiến độ 10 world | W1 ✅, W2 đang làm |
| [prompts-map/00-shared-index.md](prompts-map/00-shared-index.md) | Style chung + 5 prompt trạng thái dùng lại + checklist | Dùng chung |
| [prompts-map/01-dong-co.md](prompts-map/01-dong-co.md) | W1 Đồng cỏ — node 1–10 + cổng | ✅ |
| [prompts-map/02-rung-ram.md](prompts-map/02-rung-ram.md) | W2 Rừng rậm | Đang làm |
| [prompts-map/03-song-thac.md](prompts-map/03-song-thac.md) | W3 Sông & Thác | Chưa |
| [prompts-map/04-sa-mac.md](prompts-map/04-sa-mac.md) | W4 Sa mạc | Chưa |
| [prompts-map/05-bai-bien.md](prompts-map/05-bai-bien.md) | W5 Bãi biển | Chưa |
| [prompts-map/06-nui-tuyet.md](prompts-map/06-nui-tuyet.md) | W6 Núi tuyết | Chưa |
| [prompts-map/07-hang-bang.md](prompts-map/07-hang-bang.md) | W7 Hang băng | Chưa |
| [prompts-map/08-nui-lua.md](prompts-map/08-nui-lua.md) | W8 Núi lửa | Chưa |
| [prompts-map/09-bau-troi.md](prompts-map/09-bau-troi.md) | W9 Bầu trời | Chưa |
| [prompts-map/10-vu-tru.md](prompts-map/10-vu-tru.md) | W10 Vũ trụ | Chưa |

### 4e. Prompt Objectives Design

| File | Mô tả |
|---|---|
| [prompts-claude-design-objectives.md](prompts-claude-design-objectives.md) | ✅ phần lớn. Prompt thiết kế HUD mục tiêu, Level Intro, Boss HUD, Level Win, Badge. Phạm vi L1–L30 |

---

## 5. Dữ liệu & Spreadsheet

| File | Mô tả |
|---|---|
| [level-design-100-levels.xlsx](level-design-100-levels.xlsx) | Bảng tính thiết kế 100 màn |
| [level-system-infinite.xlsx](level-system-infinite.xlsx) | Bảng tính hệ thống level vô hạn |

---

## 6. Archive (file cũ / đã thay thế)

| File | Lý do archive |
|---|---|
| [_archive/prompts-claude-code-endless.md](_archive/prompts-claude-code-endless.md) | 14 prompt Endless đã implement xong. Một số chi tiết đã thay đổi (hard-drop → đặt tự do, bỏ số trên khối). Vẫn có giá trị tham chiếu luật Endless |
| [_archive/prompts-claude-design-map.md](_archive/prompts-claude-design-map.md) | Thay thế bởi `prompts-map/` (tách từng world riêng) |
| [_archive/claude-design-brief.md](_archive/claude-design-brief.md) | Prompt gốc cho Claude Design. Design system thực tế đã phát triển xa hơn; tokens nền tảng vẫn đúng |

---

## Đọc nhanh theo ngữ cảnh

| Bạn đang làm gì? | Đọc |
|---|---|
| **Implement màn W1** | `levels/world-01-dong-co.md` (nguồn thật) → `levels/_level-spec.md` (schema) |
| **Implement màn W2** | `levels/goal-system-v2.md § W2` + `levels/vine-mechanic.md` |
| **Implement màn W3** | `levels/goal-system-v2.md § W3` |
| **Thiết kế màn W4+** | `levels/goal-system-v2.md § W4` + `level-design.md` (vô hạn) + `mechanics-ideas.md` |
| **Sửa UI/component** | `prompts-ui/README.md` → file cụ thể 01–07 + `design/Gravity Jelly Design System/` |
| **Làm map Campaign** | `ui-map-screen.md` + `prompts-map/README.md` → world cụ thể |
| **Sửa ObjectiveBar/Boss** | `components/boss-hud-objective-bar.md` + `prompts-claude-design-objectives.md` |
| **Thêm cơ chế mới** | `mechanics-ideas.md` → `prompts-design-mechanics.md` → `levels/_level-spec.md` |
| **Hiểu nghiệp vụ/kiến trúc** | `business-understanding.md` + `architecture.md` |
| **Kiểm chứng fidelity** | `prompts-ui/07-kiem-chung.md` |
