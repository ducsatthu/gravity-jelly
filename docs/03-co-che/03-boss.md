# Hệ thống Đấu trùm (Boss) — Gravity Jelly

> Tài liệu ghi chép từ source code, cập nhật liên tục. Nguồn chuẩn khi lệch với các file khác.
> Cập nhật 05/07/2026.

Đấu trùm là **màn kết mỗi thế giới** (World). Mỗi 10 màn có 1 boss: **L10 · L20 · L30 …**.
Cơ chế boss thuần deterministic (cùng seed + input = cùng kết quả), headless trong `:core`;
`:app` chỉ đổi cách hiển thị (thẻ Khiên + mascot).

---

## 1. Tổng quan

Boss KHÔNG phải một thực thể riêng trên bàn — nó là **một cấu hình màn** đặc biệt:

- **Nhận diện:** `Level.isBoss get() = id % 10 == 0` (`core/.../Level.kt:116`). Mọi UI chọn thẻ boss theo cờ này, KHÔNG theo goal.
- **Mục tiêu:** dùng lại `GoalType` thường (`core/.../Level.kt`), hiện có 2 kiểu boss:
  - `BOSS_COMBO` — bào "máu"/Khiên bằng combo (L10, L20).
  - `CLEAR_TARGETS` — phá nguồn N lần (L30).
- **"Khiên" chỉ là NHÃN hiển thị,** không phải logic riêng. Lõi vẫn là "sát thương boss" (`bossDamage`) hoặc "đếm target"; UI đổi chữ *máu/mục tiêu → Khiên*.
- **Chiêu boss:** mỗi boss có (hoặc không) một *đòn định kỳ* chạy mỗi `N` lượt thả, cấu hình bằng các trường `boss*EveryN` trên `Level`.

---

## 2. Khiên (Shield) — quy đổi hiển thị

Wiring: `app/.../CampaignPlayScreen.kt:250-259`.

| Đại lượng | Ý nghĩa | Công thức |
|---|---|---|
| `shieldTarget` | Khiên tối đa | `bossHpMax` (BOSS_COMBO) · `initialTargets` (CLEAR_TARGETS) |
| `shieldCurrent` | Khiên còn lại | `(bossHpMax − bossDamage).coerceAtLeast(0)` · hoặc `targetsLeft` |

Khiên rút về **0 = hạ boss**. Thanh Khiên vẽ ở `ui/components/BossHud.kt` (`ShieldBar`, `ShieldCount`).

---

## 3. Phá Khiên bằng combo (BOSS_COMBO)

Cơ chế phá Khiên dùng CHUNG cho L10 & L20, gắn chặt hệ combo (xem [`02-combo.md`](02-combo.md)).

**Luật:** mỗi lần bậc combo chạm **mức MỚI ≥ ×2** gây `bậc − 1` sát thương.

| Combo đạt | Sát thương cộng thêm |
|---|---|
| ×2 | +1 |
| ×3 | +2 |
| ×4 | +3 |

Hàm thuần (dùng lại đúng công thức hồi lượt xoay):

```
ComboReward.rotationRefund(before, after) = max(0, after − max(before, 1))
```
`core/.../ComboReward.kt:18`

Cộng dồn ở holder: `game/.../EndlessGameHolder.kt:497-525` (peak combo → `dmg = rotationRefund(...)` → `bossDamage += dmg`).
Điều kiện thắng: `evaluateGoal()` — `EndlessGameHolder.kt:527-554` (`bossDamage >= goal.bossHP`).

> Vì "phá Khiên" = "hồi lượt xoay" cùng công thức, một combo lớn vừa hạ Khiên vừa hồi ngân sách xoay — thưởng kép, khuyến khích dựng combo to.

---

## 4. Tell — cảnh báo boss sắp ra chiêu

`core/.../Level.kt:76-77`:

```kotlin
enum class BossTellKind { VINE_SPAWN, GRAVITY_INVERT, SOURCE_REVIVE }
data class BossTell(val kind: BossTellKind, val turnsUntil: Int)
```

Sinh tell: `EndlessEngine.bossTell()` — `core/.../EndlessEngine.kt:404-412`. Thứ tự ưu tiên **revive > gravity > vine**; `turnsUntil = N − (placeTurns % N)` (1 = ngay lượt sau). Holder mirror ở `EndlessGameHolder.bossTell`. HUD hiện chip CẢNH BÁO (`TellChip`) khi có tell; ngược lại hiện chip CẨM NANG "cách phá Khiên" (`RuleChip`).

---

## 5. Boss W1 — "Chú Sâu Đồng Cỏ" (Meadow Worm)

**Màn L10** · `core/.../CampaignLevels.kt:154-166` · Kind `WORM` · mascot `boss_worm`.

| Thuộc tính | Giá trị |
|---|---|
| Tên hiển thị | Chú Sâu Đồng Cỏ / *Meadow Worm* (`boss_name_worm`) |
| Goal | `BOSS_COMBO`, `bossHP = 5` |
| Chiêu định kỳ | **không** (combo thuần → `bossTell()` = null → chip "Combo ×2 phá khiên") |
| Bàn | 2 đá cản STONE tại (4,0) & (4,8) chia đôi bàn để dựng thế combo |
| Ngân sách xoay | 3 |
| Sao | `StarThresholds(14, 19, 24, MOVES)` |

**Thắng:** tích đủ 5 sát thương. **Thua:** kẹt khay (chung mọi màn: `shell.gameOver`).
Vai trò: boss "làm quen" — dạy khái niệm Khiên + phá bằng combo, không có áp lực phụ.

---

## 6. Boss W2 — "Thần Rừng" (Forest Spirit) · Vine Siege

**Màn L20** · `core/.../CampaignLevels.kt:287-297` · Kind `FOREST` · mascot `boss_forest`.

| Thuộc tính | Giá trị |
|---|---|
| Tên hiển thị | Thần Rừng / *Forest Spirit* (`boss_name_forest`) |
| Goal | `BOSS_COMBO`, `bossHP = 8` |
| Chiêu định kỳ | **mọc thêm 1 gốc dây leo mỗi 4 lượt** — `bossVineSpawnEveryN = 4`, tell `VINE_SPAWN` ("Mọc dây") |
| Vine nền | 2 gốc tại (1,8) & (7,8); mọc nhanh `vineGrowEveryN = 1` |
| Ngân sách xoay | 4 |
| Sao | `StarThresholds(19, 26, 33, MOVES)` |

Logic chiêu: `EndlessEngine.spawnBossVineIfDue()` — `core/.../EndlessEngine.kt:382-397` (spawn gốc mới ở ô trống ngẫu nhiên qua `rng`).
Người chơi chặt dây bằng khối **MINT** (xem [`06-world-2-vine.md`](../02-thiet-ke-man/06-world-2-vine.md)) để giữ bàn thoáng, rồi combo phá Khiên.

**Thắng:** 8 sát thương. **Thua:** kẹt khay do dây phủ kín.
> ⚠ Đồng bộ tài liệu: một số file cũ ghi "mỗi 3 lượt". Code là chuẩn → **4 lượt** (`bossVineSpawnEveryN = 4`).

---

## 7. Boss W3 — "Thần Thác" (Waterfall Spirit)

**Màn L30** · `core/.../CampaignLevels.kt:412-423` · Kind `WATER` · mascot `boss_water`.

| Thuộc tính | Giá trị |
|---|---|
| Tên hiển thị | Thần Thác / *Waterfall Spirit* (`boss_name_water`) |
| Goal | `CLEAR_TARGETS`, `count = 8` (phá nguồn 8 lần) |
| Nguồn nền | 2 nguồn tại (1,2) & (2,6), `maxLength = 8` |
| Chiêu 1 | **Hồi sinh nguồn cạn mỗi 3 lượt** — `bossReviveEveryN = 3`, tell `SOURCE_REVIVE` ("Thả thác nước") |
| Chiêu 2 | **Thả thêm 1 nguồn mỗi 3 lượt** — `bossSpawnSourceEveryN = 3`, trần `bossMaxSources = 4` |
| Ngân sách xoay | 4 |
| Sao | `StarThresholds(25, 32, 39, MOVES)` |

Logic: `reviveWaterSourcesIfDue()` (`EndlessEngine.kt:342-359`), `spawnBossSourceIfDue()` (`EndlessEngine.kt:361-380`).
Phá nguồn = cắm **Thạch Nước** (khối xanh) vào hàng/cột đi qua ô nguồn rồi xoá dòng (xem [`07-world-3-nhip-nuoc.md`](../02-thiet-ke-man/07-world-3-nhip-nuoc.md)).

**Thắng:** phá nguồn đủ 8 lần. **Thua:** kẹt khay khi áp lực dòng dâng.

> ⚠ **Đổi cơ chế (redesign 05/07).** Thần Thác KHÔNG còn "đảo trọng lực mỗi 3 lượt" như bản cũ. Cơ chế đảo trọng lực vẫn còn trong engine (mục §11) nhưng **không màn nào bật**.

---

## 8. Bảng tổng hợp 3 boss

| | W1 · L10 | W2 · L20 | W3 · L30 |
|---|---|---|---|
| Tên | Chú Sâu Đồng Cỏ | Thần Rừng | Thần Thác |
| Kind | `WORM` | `FOREST` | `WATER` |
| Goal | `BOSS_COMBO` | `BOSS_COMBO` | `CLEAR_TARGETS` |
| Khiên | 5 | 8 | phá 8 nguồn |
| Chiêu | — | mọc dây / 4 lượt | hồi sinh + thả nguồn / 3 lượt (≤4) |
| Tell | — (chip Cẩm nang) | `VINE_SPAWN` | `SOURCE_REVIVE` |
| Phá Khiên | combo ≥×2 (bậc−1) | combo ≥×2 (bậc−1) | cắm Thạch Nước clear line |
| Xoay | 3 | 4 | 4 |
| Sao (MOVES) | 14 / 19 / 24 | 19 / 26 / 33 | 25 / 32 / 39 |

Cấu hình chảy qua: `LevelSetup.kt` (`campaignTuning`) → `EndlessTuning` → hooks trong `EndlessEngine.finishTurn`.

---

## 9. UI / HUD boss

**Nguồn thật:** [`04-ui-ux/01-boss-hud-objective-bar.md`](../04-ui-ux/01-boss-hud-objective-bar.md). Code: `app/.../ui/components/BossHud.kt`.

- `BossCard` — thẻ compact in-game (thay ObjectiveBar ở màn boss): mascot trái · MÀN n · tên · thanh Khiên · chip luật/tell. Cao tối thiểu 118dp.
- `BossIntroCard` — thẻ lớn màn Intro trước boss (tag BOSS, mascot, "ĐỐI THỦ", Khiên đầy, CTA "Chơi").
- Map world → theme: `bossKindForWorld(world)`, `bossNameResForWorld(world)`, `themeFor(kind)` (màu/mascot/aura).

---

## 10. Cẩm nang boss

Nhóm **Đấu trùm** (`GuideGroup.BOSS`) ở màn Cẩm nang — 4 mục, dùng chính `BossCard` thật làm demo popup:

| id | Mục | Nội dung |
|---|---|---|
| `boss-basic` | Đấu trùm & Khiên | khái niệm chung: màn ×10, Khiên, combo ≥×2 = bậc−1 |
| `boss-worm` | Chú Sâu Đồng Cỏ | W1, 5 Khiên, không chiêu |
| `boss-forest` | Thần Rừng | W2, 8 Khiên, mọc dây / 4 lượt |
| `boss-water` | Thần Thác | W3, phá 8 nguồn, hồi sinh + thả nguồn / 3 lượt |

Registry: `app/.../ui/guide/GjGuide.kt`; thumbnail motif: `CamNangParts.thumbRows`; strings: `guide_boss_*` (vi + en).

---

## 11. Chuẩn bị cho boss tương lai (W4+)

Hệ boss đã tách sạch để thêm thế giới mới với chi phí thấp. Checklist thêm 1 boss:

1. **`:core`** — thêm màn `Lx0` trong `CampaignLevels.kt` với `isBoss` tự động (id % 10 == 0); chọn `GoalType`; đặt các trường `boss*EveryN` cho chiêu.
2. **Chiêu mới** — nếu cần đòn chưa có: thêm hook `applyBoss…IfDue()` trong `EndlessEngine.finishTurn`, một trường `boss…EveryN` trên `Level` + `EndlessTuning`, và một giá trị `BossTellKind` + string `boss_tell_*`.
3. **UI** — thêm nhánh `BossKind`, mascot `boss_*`, `bossNameResForWorld`, `themeFor` trong `BossHud.kt`.
4. **Cẩm nang** — thêm 1 `GjGuideEntry` (group `BOSS`) + thumbnail + strings `guide_boss_*` (vi + en). Nhóm `BOSS` đã sẵn, không cần enum mới.

**Kho sẵn dùng trong engine (chưa gắn màn nào):**

| Cơ chế | Trường | Trạng thái |
|---|---|---|
| Đảo trọng lực 180° / N lượt | `bossGravityEveryN` → `flipBossGravityIfDue()` (`EndlessEngine.kt:326-340`), tell `GRAVITY_INVERT` | LEGACY — còn code, không bật |
| Đổ rác/đá mỗi lượt | `debrisPerTurn` | archetype dự phòng, chưa dùng |

**Draft W4 — "Tượng Cát Cổ" (Lõi Giáp):** xem [`02-he-muc-tieu.md § 17`](../02-thiet-ke-man/02-he-muc-tieu.md). Archetype boss dài hạn (Lõi Giáp / Siege / Hỗn loạn) ở [`03-campaign-vo-han.md § 11`](../02-thiet-ke-man/03-campaign-vo-han.md).

---

## 12. File liên quan

| Vai trò | File |
|---|---|
| Nhận diện + trường boss | `core/.../Level.kt` |
| Định nghĩa 3 màn boss | `core/.../CampaignLevels.kt` |
| Chiêu + tell | `core/.../EndlessEngine.kt` |
| Sát thương combo | `core/.../ComboReward.kt` |
| Cộng dồn + chấm goal | `game/.../EndlessGameHolder.kt` |
| Thẻ + mascot + wiring | `app/.../ui/components/BossHud.kt`, `app/.../CampaignPlayScreen.kt`, `app/.../CampaignIntroScreen.kt` |
| Cẩm nang boss | `app/.../ui/guide/GjGuide.kt`, `app/.../ui/guide/CamNangParts.kt` |
| Docs cơ chế nền | [`02-combo.md`](02-combo.md) · [`06-world-2-vine.md`](../02-thiet-ke-man/06-world-2-vine.md) · [`07-world-3-nhip-nuoc.md`](../02-thiet-ke-man/07-world-3-nhip-nuoc.md) |

---

## Nhật ký thay đổi

- **05/07/2026** — Tạo tài liệu tổng hợp hệ Đấu trùm (gom nội dung đang phân mảnh ở `02-he-muc-tieu`, `03-campaign-vo-han`, `04-ui-ux`). Chốt theo code: W2 mọc dây **mỗi 4 lượt** (không phải 3), W3 Thần Thác = **phá 8 nguồn + hồi sinh/thả nguồn mỗi 3 lượt** (BỎ đảo trọng lực; cơ chế đảo trọng lực giữ LEGACY trong engine). Thêm nhóm Cẩm nang **Đấu trùm** (4 mục) + checklist thêm boss W4+.
