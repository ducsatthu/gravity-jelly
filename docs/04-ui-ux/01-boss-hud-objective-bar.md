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
- Thẻ radius **xl(28)**, nền trắng, viền 1.5 tím@0.22, bóng cocoa mềm, **cao TỐI THIỂU 118dp CO GIÃN**
  theo nội dung (design `minHeight:118`) — chip/nội dung không bị bó.
- **Mascot tràn trái** (vùng 118×118dp **cố định**, KHÔNG fillMaxHeight → thẻ không giãn vô hạn đẩy mất
  bàn): PNG riêng từng boss (mắt-only, không miệng/lông mày), bob nhẹ.
- Góc phải-trên: nhãn `MÀN n`.
- Tên boss (display 18) · thanh **Khiên** + số `Khiên cur/tgt` · chip **CẨM NANG "Combo ×2 phá khiên"**.

**Mascot PNG:** copy từ `design/.../06-svg-assets/bosses/boss-*.png` sang `app/src/main/res/drawable-nodpi/`:
`boss_worm.png` · `boss_forest.png` · `boss_water.png`.

**3 boss theo world** (`bossKindForWorld`/`bossNameForWorld`):

| World | Boss | kind | Mascot | Màu thanh Khiên |
|---|---|---|---|---|
| 1 (L10) | Chú Sâu Đồng Cỏ | WORM | `boss_worm` (mint + lá) | mint |
| 2 (L20) | Thần Rừng | FOREST | `boss_forest` (thần rừng thân cây + vương miện lá) | nâu `#D9BE94` |
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

### W2 boss = Thần Rừng
L20 = **"Thần Rừng"** (spawn dây leo mỗi 3 lượt). Đồng bộ **tên + tell + kind + art** theo core/design:
`bossNameForWorld(2) = "Thần Rừng"` · `BossKind.FOREST` · tell "Mọc dây" · mascot `R.drawable.boss_forest`
(art thần rừng thân cây + vương miện lá, copy từ design `06-svg-assets/bosses/boss-forest.png`). Màu thanh
Khiên tạm giữ nâu ấm `#D9BE94` theo design — đổi sang xanh lá nếu muốn. Lưu ý: `debrisPerTurn` là cơ chế
đổ đá/rác riêng (archetype boss dự phòng), vẫn còn trong engine nhưng L20 (Thần Rừng) KHÔNG dùng.

### REDESIGN chip (03/07) — BỎ chữ kicker + tell dot
Bản trước (chip có chữ "CẨM NANG"/"CẢNH BÁO" bên cạnh nhãn) bị **cắt chữ** trên card in-game HẸP
(mascot 118dp): kicker chiếm ~55dp khiến nhãn dài ("Sau N lượt: Đảo trọng lực") tràn/cắt; và font
weight 700 qua `labelSmall` rơi fallback (mỏng). User **thiết kế lại** `BossHud.jsx Chip` → Kotlin bám theo:
- **BỎ hẳn chữ kicker.** Chip = đĩa + nhãn. Rule: nền chìm + đĩa tím nhạt (icon ×2). Tell: nền tone +
  đĩa đặc + **CHẤM ĐỎ nhấp nháy** góc đĩa (opacity 0.35↔0.85, 1400ms) thay chữ "CẢNH BÁO".
- Gộp `BossChip(bg, discBg, labelColor, label, dot, discIcon)`; `RuleChip`/`TellChip` gọi lại.
- Nhãn: **Nunito** (`GjBodyFontFamily` pin tường minh) weight Bold, `--text-caption` 12sp, nowrap,
  `lineHeight 1.25em` (đủ dấu tiếng Việt). Bỏ kicker → dư ~55dp → HẾT cắt. Giữ auto-thu-nhỏ
  (TextMeasurer 12→9sp) làm phao cho máy rất hẹp.
- **Pill ÔM CHỮ (compact) như design, KHÔNG cắt:** đo bề rộng cột bằng `BoxWithConstraints(Modifier
  .fillMaxWidth())` (ép full-width → `constraints.maxWidth` = bề rộng THẬT, không bị wrap-content báo
  nhỏ như bản lỗi trước); tính chỗ nhãn còn lại = cột − padding − đĩa − gap − 6dp thở; autosize
  12→10sp vừa đó; chặn CỨNG nhãn bằng `Modifier.widthIn(max)` + `softWrap=false`. Pill (Row bên trong)
  vẫn wrap-content ôm chữ, neo trái.
Verify Pixel 9 + **Samsung S22 (density 510)** L30 in-game: pill ôm sát "Sau 3 lượt: Đảo trọng lực"
hiện ĐỦ, không cắt, ~12sp, đĩa + chấm đỏ đúng. `Type.kt` export `GjBodyFontFamily` (Nunito).

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
  - Bug cũ: mascot `fillMaxHeight` làm thẻ giãn hết màn đẩy mất bàn. Fix: thẻ `heightIn(min=118)` co giãn +
    mascot `height(118)` cố định (không fillMaxHeight) → chip không bị bó mà bàn vẫn nguyên. Verify Samsung.
- L9 score in-game: ObjectiveBar điểm "ĐIỂM 0/200" + track — không regress.
