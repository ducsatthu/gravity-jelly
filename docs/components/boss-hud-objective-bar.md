# In-game: ObjectiveBar & Boss HUD (thẻ "Khiên")

Cập nhật 03/07/2026. Tài liệu cụm hiển thị **dưới HUD 56dp, trên bàn 9×9** khi chơi Campaign:
màn thường dùng `ObjectiveBar`, màn **BOSS** (L10/L20/L30…) dùng **`BossCard`** (thẻ Khiên).

Nguồn thiết kế (sự-thật):
- `design/Gravity Jelly Design System/03-components/08-objective-bar/ObjectiveBar.jsx`
- `design/Gravity Jelly Design System/03-components/09-boss-hud/BossHud.jsx` (**redesign 03/07**)
- Card ráp: `03-components/09-boss-hud/boss-hud.card.html`, `04-screens/screen-1e-game-objective.card.html`

## 1) Boss HUD — `BossCard` (thay `ObjectiveBar` ở màn boss)

File: `app/src/main/kotlin/com/gravityjelly/app/ui/components/BossHud.kt`.
Lắp ở `CampaignPlayScreen` slot `objective`: `if (goal.type == BOSS_COMBO) BossCard(...) else ObjectiveBar(...)`.

**Đổi hướng lớn so với bản cũ:** bỏ HUD kiểu combat (máu/tim đỏ + số sát thương bay). Boss casual =
thẻ mềm, tiến độ là **thanh Khiên** (KHÔNG máu/tim), chữ dùng **"phá khiên"** (KHÔNG "gây sát thương").
Tím `#7E6CF0` chỉ dùng viền/quầng/hairline — không tô kín panel.

Bố cục (bám `BossCard` trong BossHud.jsx):
- Thẻ radius **xl(28)**, nền trắng, viền 1.5 tím@0.22, bóng cocoa mềm, **cao cố định 118dp**.
- **Mascot tràn trái** (vùng rộng 118dp): PNG riêng từng boss (mắt-only, không miệng/lông mày), bob nhẹ.
- Góc phải-trên: nhãn `MÀN n`.
- Tên boss (display 18) · thanh **Khiên** + số `Khiên cur/tgt` · chip **CẨM NANG "Combo ×2 phá khiên"**.

**Mascot PNG:** copy từ `design/.../06-svg-assets/bosses/boss-*.png` sang `app/src/main/res/drawable-nodpi/`:
`boss_worm.png` · `boss_trash.png` · `boss_water.png`.

**3 boss theo world** (`bossKindForWorld`/`bossNameForWorld`):

| World | Boss | kind | Mascot | Màu thanh Khiên |
|---|---|---|---|---|
| 1 (L10) | Chú Sâu Đồng Cỏ | WORM | `boss_worm` (mint + lá) | mint |
| 2 (L20) | Kẻ Đổ Rác | TRASH | `boss_trash` (túi nâu) | nâu `#D9BE94` |
| 3 (L30) | Thần Thác | WATER | `boss_water` (cột nước) | blue |

**Số liệu sống** (từ `EndlessGameHolder`): `shieldCurrent = (bossHpMax − bossHpDamage)` = khiên **còn lại**
(rút về 0 khi hạ boss), `shieldTarget = bossHpMax`. Cơ chế combo→sát-thương của `:core` GIỮ NGUYÊN
(chỉ đổi nhãn hiển thị máu→Khiên). **Khiên theo mock (03/07):** L10 = **5** · L20 = **8** · L30 = **10**
(`Goal.bossHP` trong `CampaignLevels`). ⚠ Ngưỡng sao COMBO (nhịp) giữ nguyên — có thể cần retune theo khiên mới.

### Chip tell (03/07) — "boss sắp ra chiêu" + đếm ngược
`BossCard`/`BossIntroCard` nhận `tell: BossTell?`:
- `tell == null` (W1 Chú Sâu — combo thuần) → chip **CẨM NANG** "Combo ×2 phá khiên" (rule, calm).
- `tell != null` → chip **CẢNH BÁO** (tone màu): nhãn "Lượt sau: …" (khi còn 1) / "Sau N lượt: …".
  - W2 **Thần Rừng** (`bossVineSpawnEveryN`) → `VINE_SPAWN`, glyph lá, tone warm, "Mọc dây".
  - W3 **Thần Thác** (`bossGravityEveryN`) → `GRAVITY_INVERT`, glyph xoay, tone gravity, "Đảo trọng lực".

Nguồn tell = `:core`:
- `EndlessEngine.bossTell(): BossTell?` — `turnsUntil = N − (placeTurns % N)`, bắn khi `placeTurns % N == 0`.
  `BossTell(kind, turnsUntil)` + `enum BossTellKind {VINE_SPAWN, GRAVITY_INVERT}` ở `Level.kt`. Test: `BossTellTest`.
- `EndlessGameHolder.bossTell` mirror state, refresh trong `sync()` → BossCard đọc, recompose khi đổi lượt.
- In-game truyền `holder.bossTell`; màn Intro truyền `bossIntroTell(level)` (preview = sau đúng N lượt).

### ⚠ Lệch design ↔ core (W2 boss)
Mock boss-hud gọi W2 = "Kẻ Đổ Rác" (đổ rác, mascot `boss_trash`). Nhưng `:core` L20 THỰC TẾ = **"Thần Rừng"**
(spawn dây leo mỗi 3 lượt, KHÔNG đổ rác). Đã lấy **tên + tell theo core** ("Thần Rừng" · "Mọc dây") cho
đúng gameplay; mascot tạm dùng `boss_trash` (cần art "Thần Rừng" riêng sau). `debrisPerTurn`/"Kẻ Đổ Rác"
vẫn còn trong engine nhưng L20 không dùng.

## 1b) BossIntroCard (màn Level-Intro boss) — `CampaignIntroScreen`
Màn boss (`goal.type == BOSS_COMBO`) render **`BossIntroCard`** (BossHud.kt) thay khối tím + ♥HP cũ:
tag BOSS · MÀN n · mascot lớn (120dp) + "ĐỐI THỦ"/tên · thanh Khiên (đầy) + `Khiên n/n` · chip luật/tell ·
slot `extra` (dải 3 sao nhịp + ngân sách xoay) · CTA "Chơi". Màn thường giữ nguyên sheet cũ.

## 2) ObjectiveBar (màn thường)

File: `app/src/main/kotlin/com/gravityjelly/app/ui/components/ObjectiveBar.kt`.

### RESKIN 03/07 — CHẤM SAO THỐNG NHẤT THEO NƯỚC + badge MÀN
Design mới (`ObjectiveBar.jsx` sửa 03/07) **bỏ chấm-sao-theo-điểm**: mọi màn campaign chấm sao **theo số
nước** (design "unified to số nước"). Điểm/đích chỉ còn là **điều kiện THẮNG**, không chấm sao.
- **Badge MÀN** neo trái mọi bar (`LevelBadge`): ô "MÀN `<level.id>`" + tên world (`WorldTheme.name`) +
  gạch dọc. minWidth 44 · radius 12 · nền surface-sunken · MÀN 9sp · số 22sp · world 8.5sp.
- **Footer sao sống** (`StripFooter` = `StarStrip` 3 sao + caption) trên MỌI nhánh — tier từ
  `liveStarsFor(stars, movesUsed, rotationsUsed)` = `StarThresholds.tierFor(movesUsed)` (dùng chung với
  lúc chấm sao thắng). Caption "Đang N★ · Còn X nước giữ N★".
- Nhánh nội dung theo `Goal.type`: **tutorial** (single-action bỏ chip "0/1", chỉ tick "Xong"; combo giữ
  `×2`) · **targets** (dãy glyph mờ dần + pill "còn N") · **REACH_SCORE**/**MIXED** (thanh điểm =
  MỤC TIÊU thắng, **KHÔNG coin sao**). Boss → `BossCard`.
- **Đã gỡ:** `scoreStars` param, `StarCoin`/`StarCoinRail` (coin sao trên thanh điểm), `StarCaption`
  theo-điểm. `ScoreBar` giờ chỉ là thanh tiến độ mục tiêu.
- **Core đồng bộ:** L9/L12/L16 (REACH_SCORE) + L18 (MIXED) đổi `metric` SCORE→**MOVES**, ngưỡng = MoveSolver
  min (L9=37·L12=26·L16=30·L18=29). Xem [[star-thresholds-solver]] / `MoveSolver.kt`.

## Kiểm thử (03/07, emulator Pixel-class `sdk_gphone16k`)
- Boss L10 in-game: BossCard hiện đúng (worm tràn trái · "Chú Sâu Đồng Cỏ · MÀN 10" · Khiên 5/5 mint ·
  chip "CẨM NANG Combo ×2 phá khiên"), bàn 9×9 + giáp đá hiện lại đầy đủ.
  - Bug đã sửa: mascot `fillMaxHeight` làm thẻ giãn hết màn đẩy mất bàn → chốt thẻ cao cố định 118dp.
- L9 score in-game: ObjectiveBar điểm "ĐIỂM 0/200" + track — không regress.
