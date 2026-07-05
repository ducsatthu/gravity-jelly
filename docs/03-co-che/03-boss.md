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
- **Mục tiêu:** MỌI boss dùng chung `GoalType.BOSS_COMBO` — **bào Khiên bằng combo** (L10, L20, L30 và W4+).
  Chiêu/chướng ngại khác nhau theo world (đá / vine / nước) nhưng điều kiện thắng luôn là combo phá Khiên.
  (`CLEAR_TARGETS` vẫn tồn tại cho màn thường như World 2/3, nhưng KHÔNG dùng cho boss nữa.)
- **"Khiên" chỉ là NHÃN hiển thị,** không phải logic riêng. Lõi là "sát thương boss" (`bossDamage`); UI đổi chữ *máu → Khiên*.
- **Chiêu boss:** mỗi boss có (hoặc không) một *đòn định kỳ* chạy mỗi `N` lượt thả, cấu hình bằng các trường `boss*EveryN` trên `Level`.

---

## 2. Khiên (Shield) — quy đổi hiển thị

Wiring: `app/.../CampaignPlayScreen.kt:250-259`.

| Đại lượng | Ý nghĩa | Công thức |
|---|---|---|
| `shieldTarget` | Khiên tối đa | `bossHpMax` (= `goal.bossHP`) |
| `shieldCurrent` | Khiên còn lại | `(bossHpMax − bossDamage).coerceAtLeast(0)` |

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

Cộng dồn ở holder: `game/.../EndlessGameHolder.kt:497-525` (peak combo nước này → `dmg = rotationRefund(comboBefore, peak)` → `bossDamage += dmg`).

> ⚠ **`before` = combo VÀO nước hiện tại** (`comboBefore` — chụp `shell.combo` TRƯỚC resolve, truyền vào
> `trackGoalEvents`), KHÔNG phải đỉnh combo cộng dồn cả màn. Lý do: mọi màn campaign bật combo timer 10s
> (`comboTimeBased`), hết giờ combo reset về 0. Nếu mốc là đỉnh cả màn, sau khi timer reset thì combo
> x3/x4/x5 nước sau vẫn đo từ đỉnh cũ ⇒ **0 sát thương** → boss gần như bất tử (bug 05/07, đã sửa). Đo từ
> combo-vào-nước ⇒ mỗi combo ≥×2 (sau khi timer đã reset) lại phá Khiên. Khoá bằng `BossComboDamageTest`.
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
| Goal | `BOSS_COMBO`, `bossHP = 11` (**combo phá Khiên** — CHUNG cơ chế với L10/L20) |
| Nguồn nền | 2 nguồn tại (1,2) & (2,6), `maxLength = 8` — **CHƯỚNG NGẠI**, không phải mục tiêu |
| Chiêu 1 | **Hồi sinh nguồn cạn mỗi 3 lượt** — `bossReviveEveryN = 3`, tell `SOURCE_REVIVE` ("Thả thác nước") |
| Chiêu 2 | **Thả thêm 1 nguồn mỗi 3 lượt** — `bossSpawnSourceEveryN = 3`, trần `bossMaxSources = 4` |
| Ngân sách xoay | 4 |
| Sao | `StarThresholds(25, 32, 39, MOVES)` — ⚠ cần chơi thử tinh chỉnh |

Logic chiêu: `reviveWaterSourcesIfDue()` (`EndlessEngine.kt:342-359`), `spawnBossSourceIfDue()` (`EndlessEngine.kt:361-380`).
**Nước = chướng ngại:** dòng chảy đẩy khối (drift/push) làm rối thế combo; cắm **Thạch Nước** (khối xanh) xoá dòng qua ô nguồn để **tạm dập** một nguồn (giảm áp lực) — KHÔNG còn là điều kiện thắng (xem [`07-world-3-nhip-nuoc.md`](../02-thiet-ke-man/07-world-3-nhip-nuoc.md)).

**Thắng:** đủ 11 sát thương combo (phá Khiên). **Thua:** kẹt khay khi áp lực dòng dâng.

> ⚠ **Đổi cơ chế (redesign 05/07 — v2).** THỐNG NHẤT mọi mốc boss dùng chung **combo phá Khiên**: L30 chuyển từ `CLEAR_TARGETS` (phá 8 nguồn) sang `BOSS_COMBO` (Khiên 11). Nước giữ nguyên làm chướng ngại. Lý do: người chơi muốn combo — công cụ chữ ký — luôn là cách hạ boss ở mọi mốc. (Bản cũ "đảo trọng lực mỗi 3 lượt" đã bỏ từ trước; code đảo trọng lực giữ LEGACY ở §11.)

---

## 8. Bảng tổng hợp 3 boss

| | W1 · L10 | W2 · L20 | W3 · L30 |
|---|---|---|---|
| Tên | Chú Sâu Đồng Cỏ | Thần Rừng | Thần Thác |
| Kind | `WORM` | `FOREST` | `WATER` |
| Goal | `BOSS_COMBO` | `BOSS_COMBO` | `BOSS_COMBO` |
| Khiên | 5 | 8 | 11 |
| Chiêu / chướng ngại | 2 đá cản | mọc dây / 4 lượt | nước đẩy khối · hồi sinh + thả nguồn / 3 lượt (≤4) |
| Tell | — (chip Cẩm nang) | `VINE_SPAWN` | `SOURCE_REVIVE` |
| Phá Khiên | combo ≥×2 (bậc−1) | combo ≥×2 (bậc−1) | combo ≥×2 (bậc−1) |
| Xoay | 3 | 4 | 4 |
| Sao (MOVES) | 14 / 19 / 24 | 19 / 26 / 33 | 25 / 32 / 39 |

> **Quy tắc chốt:** MỌI mốc boss (mọi `id % 10 == 0`, cả W4+ sau này) dùng **chung cơ chế combo phá Khiên** (`BOSS_COMBO`). Chiêu/chướng ngại theo world khác nhau, nhưng combo luôn là cách hạ Khiên. Khoá bằng `CampaignLevelsTest.moi_moc_boss_dung_chung_co_che_combo_pha_Khien`.

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
| `boss-water` | Thần Thác | W3, combo phá Khiên (11); nước đẩy khối làm rối combo, hồi sinh + thả nguồn / 3 lượt |

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

- **05/07/2026 (v2)** — **THỐNG NHẤT mọi mốc boss = combo phá Khiên.** L30 (Thần Thác) đổi từ `CLEAR_TARGETS`
  (phá 8 nguồn) sang `BOSS_COMBO` (Khiên 11); nước giữ nguyên làm chướng ngại. Sửa bug sát thương combo:
  mốc `before` = combo VÀO nước (không cộng dồn đỉnh cả màn) nên sau khi combo timer 10s reset, mỗi combo
  ≥×2 lại phá Khiên (trước đây x3/x4/x5 lặp lại ra 0 dmg → boss bất tử). Khoá bằng `BossComboDamageTest` +
  `CampaignLevelsTest.moi_moc_boss_dung_chung_co_che_combo_pha_Khien`.
- **05/07/2026** — Tạo tài liệu tổng hợp hệ Đấu trùm (gom nội dung đang phân mảnh ở `02-he-muc-tieu`, `03-campaign-vo-han`, `04-ui-ux`). Chốt theo code: W2 mọc dây **mỗi 4 lượt** (không phải 3), W3 Thần Thác = **phá 8 nguồn + hồi sinh/thả nguồn mỗi 3 lượt** (BỎ đảo trọng lực; cơ chế đảo trọng lực giữ LEGACY trong engine). Thêm nhóm Cẩm nang **Đấu trùm** (4 mục) + checklist thêm boss W4+.
