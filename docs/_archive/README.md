# Lưu trữ — thiết kế Campaign (tạm gác)

**Toàn bộ thư mục này là tài liệu thiết kế của tính năng Campaign đã GỠ ngày 17/07/2026** vì
feedback chưa đủ tốt và người chơi ít khi chơi. Xem quyết định + phạm vi gỡ đầy đủ ở
[`../08-go-bo-campaign.md`](../08-go-bo-campaign.md).

Giữ lại (không xoá) để tái dùng nếu sau này quyết định làm lại Campaign — công sức thiết kế 30 màn /
3 world / 3 boss / hệ mục tiêu vẫn còn nguyên giá trị.

> ⚠️ **Tài liệu ở đây KHÔNG còn phản ánh code.** Code tương ứng (`CampaignLevels.kt`, `Level.kt`,
> `Vine.kt`, `WaterFlow.kt`, `CampaignScreen.kt`, `ObjectiveBar.kt`, `BossHud.kt`…) đã bị xoá khỏi
> repo. Đừng đọc như nguồn thật cho code hiện tại — chỉ dùng làm tham chiếu thiết kế.

## Nội dung

| Đường dẫn | Mô tả |
|---|---|
| `02-thiet-ke-man/` | Toàn bộ nhóm thiết kế màn: schema màn · hệ mục tiêu (8 GoalType) · Campaign vô hạn · spec World 1 (Đồng cỏ) · kịch bản W1 · cơ chế Vine (W2) · cơ chế Dòng chảy (W3) |
| `05-prompts-02-map/` | Bộ prompt Claude Design vẽ **bản đồ Campaign** 10 world (mẫu chung + W1–W10) |
| `03-boss.md` | Hệ Đấu trùm: Khiên, phá bằng combo, tell, 3 boss W1–W3, checklist thêm boss |
| `04-boss-hud-objective-bar.md` | Đặc tả ObjectiveBar + BossCard (thẻ Khiên) in-game |
| `04-man-ban-do.md` | Thiết kế màn bản đồ leo màn (cuộn dọc, node, camera, FTUE) |
| `05-objectives.md` | Prompt thiết kế HUD mục tiêu · Level Intro · Boss HUD · Level Win · Badge (L1–L30) |
| `05-prototype-targets.md` | Prompt prototype React cho vine (W2) + giọt nước (W3) |
| `06-du-lieu/` | Spreadsheet: thiết kế 100 màn · hệ level vô hạn (đường cong, modifier, goal cycle) |

## Nếu muốn khôi phục

Code đã xoá vẫn nằm trong lịch sử git — commit cuối còn đầy đủ Campaign là commit **ngay trước**
commit gỡ (tìm bằng `git log --oneline -- core/src/main/kotlin/com/gravityjelly/core/CampaignLevels.kt`).
Lưu ý engine đã refactor sau khi gỡ (bỏ `CellType.VINE/TARGET/TRASH`, `CellEffect`, `preset`,
`trayScript`, nhánh `level` của `EndlessGameHolder`…) nên khôi phục KHÔNG phải là revert đơn thuần.
