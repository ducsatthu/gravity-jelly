# Cơ chế Dòng Chảy / Nguồn Nước — World 3 · Sông & Thác

Cập nhật **05/07/2026 (redesign v5)**. Tài liệu **thiết kế + kỹ thuật** cho cơ chế chữ ký World 3.
Bám design: `design/Gravity Jelly Design System/07-mechanics/world3-water-kit.jsx` (sheet **`streamflow`**
= `world3-flow-stream.card.html`: dải nước nối liền có sóng, chảy theo trọng lực ↓, rẽ vòng vật cản).

> **Trạng thái:** ĐÃ TRIỂN KHAI (v5). Code: `core/WaterFlow.kt` (thuần headless, deterministic),
> render `game/WaterDraw.kt` (`drawWaterRibbon`), màn `core/CampaignLevels.kt` (L21–30).

> **Đổi so với v4 (bỏ):** ❶ **bỏ ô giọt** (`CellType.TARGET`/`WaterDropSpec`) — phá nguồn **trực tiếp**;
> ❷ hướng chảy giờ **cố định XUỐNG** (không còn ngang, không đổi theo trọng lực) — nguồn ở **hàng trên
> cùng**; ❸ mọc **rẽ ngang** khi bị chặn (đường gấp khúc); ❹ đẩy kiểu **đoàn tàu** (xé cụm) thay vì đẩy
> cả cụm nguyên khối. Các quyết định do người chơi chốt (05/07): xuống-cố-định · phá-qua-ô-nguồn ·
> đoàn-tàu · rẽ-TRÁI-trước.

---

## 1. Tên gọi (canonical)

| Vai trò | Tên hiển thị (vi) | Tên hiển thị (en) | Định danh code |
|---|---|---|---|
| Ô phát nguồn | **Nguồn nước** | Water Source | `CellEffect.WATER_SOURCE` |
| Ô nước lan ra | **Ô dòng chảy** | Water Flow | `CellEffect.WATER_FLOW` |
| Ô mới mọc lượt này | *(trạng thái)* **Mới mọc** | New this turn | transient (mảng timestamp) |
| Nguồn đã phá | **Nguồn khô** | Broken source | cờ `WaterSource.broken` |

Cơ chế = **WaterFlow**. Text hiển thị **bắt buộc i18n** (`res/values*/strings.xml`), `:core` chỉ giữ khoá.

---

## 2. Tổng quan cơ chế (bản chốt 05/07)

Một **nguồn nước** đặt sẵn ở **hàng trên cùng**, **luôn chảy XUỐNG** (cố định, **độc lập trọng lực**).
Tóm tắt luật (chi tiết §5–§7):

1. **Mọc CÂY nhiều nhánh (§5):** mỗi lượt +1 ô từ ô nước **thấp nhất còn đi được**, ưu tiên **XUỐNG**;
   ô dưới có khối thì **DỒN TOA** (đẩy đoàn khối tới tường); ô dưới là **vật cản** (đá/khối kẹt) thì
   **RẼ NGANG** (TRÁI trước) và có thể **TÁCH NHÁNH** — chảy không ngừng ở mọi nhánh tới khi bí hết /
   chạm hàng đáy. Nước KHÔNG rẽ khi ô dưới đã là nước của chính dòng (chống lan ngang).
2. **Trôi theo dòng (§6):** khối đặt/rơi lên kênh **trôi 1 ô xuôi dòng** mỗi lượt (theo cả khúc rẽ);
   bị chặn thì đứng yên.
3. **Neo-nước — không chịu trọng lực (§6.3):** khối đang trên ô nước **không rơi** theo trọng lực (bị dòng
   giữ, không rớt khỏi dòng); là vật cản bất động cho cụm khác.
4. **Nắp = Thạch Nước (§6.4):** ô nguồn chỉ giữ nắp nếu occupant là **BLUE (Thạch Nước)**; màu khác cũng
   trôi theo dòng.
5. **Phá nguồn (§7):** **clear hàng/cột đi qua ô nguồn** VÀ dòng đó **chứa ≥1 khối BLUE** → nguồn **khô**,
   cả cây dòng chảy **tắt**. *(Cột/hàng ĐƠN SẮC hoá siêu khối, không clear → line phá nguồn phải đa màu &
   có Thạch Nước.)* Không còn "ô giọt".

Ô nguồn/dòng chảy là **lớp sàn** (`CellEffect`) dưới jelly.

### 2.1. So khớp 3 lớp kiến trúc
- **`:core`** giữ toàn bộ luật: đường dòng chảy, mọc-rẽ, đẩy đoàn tàu, phá nguồn — deterministic, headless.
- **`:game`** đọc state vẽ **dải ribbon nối liền** + animation (sóng, mới-mọc, trượt-đẩy, splash-phá).
- **`:app`** map khoá → resource, guide "Dòng chảy", goal `CLEAR_TARGETS` đếm **số nguồn bị phá**.

---

## 3. Mô hình dữ liệu

### 3.1. Lớp effect song song
```kotlin
// core/Grid.kt
enum class CellEffect { NONE, WATER_SOURCE, WATER_FLOW }   // lớp SÀN, dưới occupant
// Grid: effects: Array<Array<CellEffect>> (mặc định NONE); copy()/loadFrom() gồm cả lớp này
```
Jelly tại `(x,y)` khi `effect(x,y) != NONE` = "đứng trên nước" → ứng viên bị đẩy. "Mới mọc" + "khô" là
trạng thái transient (mảng timestamp ở animator + cờ `broken`), không phải giá trị enum.

### 3.2. State nguồn nước (giữ ở engine)
```kotlin
// core/WaterFlow.kt
data class WaterSource(
    val id: Int,
    val pos: Vec,                       // ô nguồn (cố định, ở hàng trên cùng)
    val active: Boolean = true,         // false khi đã phá
    val broken: Boolean = false,        // true = nguồn khô (render nứt)
    val flow: List<Vec> = emptyList(),  // ĐƯỜNG dòng chảy (gấp khúc), gốc → ngọn; KHÔNG gồm ô nguồn
    val maxLength: Int = 8,             // trần độ dài đường (>=0 cap; <0 vô hạn)
)
```
Hướng chảy **không** là field — luôn XUỐNG, rẽ ngang tính trong `growSource`. Không còn `dir`/`linkedDropId`.

### 3.3. Level config
```kotlin
// core/Level.kt
data class WaterSourceSpec(val id: Int, val x: Int, val y: Int, val maxLength: Int = 8)
// Level: + waterSources: List<WaterSourceSpec>   (đã BỎ waterDrops)
```
Ví dụ (L21 "Suối Nhỏ"): `waterSources = listOf(WaterSourceSpec(1, x=4, y=0, maxLength=6))`. Helper
`CampaignLevels.src(id, x, maxLength)` mặc định `y=0` (hàng trên cùng).

---

## 4. Thứ tự trong lượt (`EndlessEngine.finishTurn`)

```
1. Player đặt mảnh                            (placePieceAt)
2. resolve()  → clear hàng/cột + gravity cụm + combo cascade
3. placeTurns++, tickTrash, boss hooks (flipBossGravity…)
4. applySourceBreaks()  → quét LinesCleared: hàng/cột đi qua ô nguồn → phá nguồn (§7)
5. growWaterFlow()      → mỗi nguồn active mọc +1 ô, rẽ khi bị chặn (§5); đánh dấu NEW_THIS_TURN
6. pushJellyByFlow()    → đẩy đoàn tàu jelly trên kênh (§6) → foldResolve → applySourceBreaks lại
7. advanceStage, checkGameOver
```
- **Xoay trọng lực** (`rotateGravity`): **KHÔNG mọc** (mọc chỉ theo lượt đặt); nhưng **push vẫn áp** +
  `applySourceBreaks` (line vừa clear do xoay có thể qua ô nguồn).
- Nước cố định XUỐNG → boss "Thần Thác" đảo trọng lực **không đổi** hướng chảy; chỉ đổi cách jelly rơi.

---

## 5. Thuật toán mọc (`growSource`) — **mọc CÂY nhiều nhánh**

Mỗi lượt, **1 ô** mọc cho mỗi nguồn active. Xét **mọi ô nước** (`pos` + `flow`) chưa ở hàng đáy, chọn ô
**THẤP NHẤT còn đi được** (max `y`, hoà thì `x` nhỏ) và mọc từ nó:
1. Ưu tiên **XUỐNG**: ô dưới trống → lấn; ô dưới có **đoàn jelly** (`BLOCK`) dồn được → `shoveColumn(dir)`
   dồn cả đoàn 1 ô (sokoban) rồi lấn vào. Qua từng lượt nước **đẩy khối dồn tới tường**; cụm ngoài đoàn **xé**.
2. Xuống bị **VẬT CẢN** (đá/jelly-không-dồn — KHÔNG phải nước của chính dòng) → **rẽ TRÁI trước, phải sau**
   (dồn toa theo cả hướng rẽ). Nếu ô dưới đã là **NƯỚC** → ô đó là lòng dòng, **KHÔNG rẽ ngang** (`growDirFrom`,
   chống lan ngang vô tận).
3. Khi ngọn sâu nhất **bí hẳn**, ô thấp kế tiếp còn đi được sẽ **tách NHÁNH mới** (như dây leo mọc mầm) →
   nước chảy không ngừng ở mọi nhánh tới khi **bí hết**. Ô ở **hàng đáy** = nhánh kết thúc (không mọc thêm).
- Đánh giá THUẦN (`canGrowFrom`/`canShoveTrain`, không mutate); chỉ áp (`setEffect`+`shoveColumn`) cho ô
  thắng. `growWaterFlow` trả `pushes` → engine phát `JellyPushed`. **Bỏ `maxLength`** (vestigial). Đa nguồn: cây độc lập, không merge.
> **Chốt feedback 05/07:** nước đẩy khối dồn tới tường/đáy; bí thì đổi dòng (rẽ) & **tách nhánh** từ ô thấp
> nhất còn đi được; các nhánh chảy tiếp không ngừng khi không bị chặn — flood xuống như sông rẽ quanh đá.

---

## 6. Khối trên kênh trôi theo dòng (`pushJellyByFlow`) — drift + neo-nước

Khác `shoveColumn` (dồn ở đầu dòng khi mọc), đây xử khối **rơi/đặt lên kênh sẵn có** — khối "trôi theo current":
1. Hướng trôi tại mỗi ô = tới **ô con** trên cây (ô nước mọc sau, kề bên) → đi đúng đường nước (xuống + rẽ
   theo khúc). Ngọn (không con) → thử xuống. Ưu tiên con: xuống > trái > phải.
2. Duyệt **xuôi dòng trước** (order lớn trước) để dải trôi cùng như đoàn tàu; đích bị chặn → ĐỨNG YÊN.
3. **Neo-nước — KHÔNG chịu trọng lực (05/07):** khối đang trên ô nước (`effect != NONE`) **không rơi** theo
   `applyClusterGravity` (`ClusterPhysics.isFallingJelly` = isJelly && effect==NONE) — chỉ trôi theo dòng,
   không bị trọng lực kéo ra khỏi dòng; là vật cản bất động cho cụm khác.
4. **Nắp nguồn = THẠCH NƯỚC (05/07):** ô nguồn chỉ giữ nắp nếu occupant là **BLUE (Thạch Nước)**; màu khác
   cũng trôi theo dòng. → muốn giữ chỗ ô nguồn (để clear line phá nguồn) phải cắm 1 khối BLUE.
5. Sau đẩy: có thể lấp hàng/cột → `foldResolve`; cascade có thể clear line qua ô nguồn → phá tiếp.

---

## 7. Thuật toán phá nguồn (`breakSource` + `applySourceBreaks`)

- Kích hoạt khi có `GameEvent.LinesCleared` với **hàng == `pos.y`** hoặc **cột == `pos.x`** của một nguồn
  active (clear đi qua chính ô nguồn). Không còn ô giọt / `dropLinks`.
- **QUY TẮC THẠCH NƯỚC (05/07, giống luật MINT của dây leo):** dòng đó phải **chứa ≥1 khối BLUE (Thạch
  Nước)** mới phá được nguồn. `Resolve` bắt `bluRows/bluCols` (hàng/cột có BLUE, trước set-null) → gắn vào
  `LinesCleared.bluLines`; `applySourceBreaks` chỉ phá nguồn có `pos` nằm trên `bluLines`. Kết hợp §6.4
  (chỉ BLUE úp được nắp nguồn) → muốn phá nguồn: cắm Thạch Nước vào cột/hàng đi qua ô nguồn.
- `breakSource`: `active=false`, `broken=true`; mọi ô `flow` → `effect = NONE`; ô nguồn giữ
  `WATER_SOURCE` (render khô/nứt). Emit `GameEvent.WaterSourceBroken(id, pos)` → `:game` splash+fade,
  `:app` đếm goal.
- **Goal:** `CLEAR_TARGETS`/`MIXED` đếm `WaterSourceBroken` (mỗi nguồn = 1 target). `applySourceBreaks`
  idempotent (nguồn đã phá bị bỏ qua) → gọi nhiều lần/lượt vẫn an toàn.

---

## 8. Spec hình ảnh (bám `world3-water-kit.jsx` — KHÔNG tự chế màu/timing)

> **Render v5:** dòng chảy vẽ bằng **một DẢI ribbon nối liền** (`WaterDraw.drawWaterRibbon`) — stroke bo
> góc gradient light→teal + **sóng trắng diễu** (`gjwDash`) + **mũi tên đầy đủ** (thân+đầu, `drawWaterArrow`)
> + foam ngọn; **miệng nguồn hero** (§8.2) đè ở gốc; nguồn khô (§8.6) tile riêng. §8.3/§8.5 (tile flow rời /
> ô giọt) **KHÔNG dùng in-game** — chỉ token guide mini-board tĩnh. *(User 05/07 chốt GIỮ render ribbon này,
> đã hoàn tác bản tile-cây `drawWaterTree`.)*

### 8.1. Palette nước (`AQ`, dòng jsx 15-19) — teal ramp hoà với mint/aqua jelly
| Khoá | Hex | Dùng |
|---|---|---|
| deep | `#12959F` | lõi nguồn, mũi tên trên flow, viền đậm |
| teal | `#2FBFC7` | thân nước, giọt |
| mid | `#5FD2D6` | gradient thân, splash dot |
| light | `#9FE4E7` | gradient sáng flow |
| pale | `#D6F2F3` | nền ô giọt |
| core | `#F1FCFC` | ring sáng nguồn, viền glow |
| edge | `#158A93` | viền giọt |
| foam | `#EAFBFB` | bọt, sparkle, viền new-note |
| dry / dryEdge / dryDark | `#C4BBAC` / `#A89A82` / `#8A7E68` | nguồn khô |
| gravity purple | `#7E6CF0` / `#6353D6` / `#A99CF6` | pill "chảy theo trọng lực" (chỉ biến thể §12) |

Bo góc ô nước = `cell * 0.24` (jsx:85 — **hơi chặt hơn** jelly `0.28`). Ô giọt/khối vẫn theo cell.

### 8.2. Ô nguồn nước — ACTIVE (jsx:88-108, 680-703)
- Nền: `radial-gradient(circle at 50% 42%, core 0%, mid 44%, deep 100%)`.
- Viền + glow: `0 0 0 3px core` + `0 0 14px 3px rgba(47,191,199,.7)`.
- **Breathe** `gjwSource` 1.9s ease-inout ∞: glow nở (blur 12→20px, spread 2→5px) tại 50%.
- **Ripple ring:** vòng trắng 2px, đường kính 66% ô, `gjwRing` 2s: scale 1→1.14, opacity .85→.35.
- **Miệng nguồn:** vòng trong 32% ô, `radial(core→light)`.
- **Badge giọt:** đĩa trắng đường kính ~0.42-0.5 ô ở góc/đỉnh, `shadow-md`, icon `Drop` (teal fill,
  edge stroke) — *đánh dấu nguồn phá được*.
- 2 splash dot foam nhỏ (0.06-0.08 ô) phía trên.

### 8.3. Ô dòng chảy thường (jsx:111-124)
- Nền: `linear-gradient(135deg, light 0%, mid 100%)`, inset shadow `0 1px 3px rgba(18,149,159,.28)`.
- **Mũi tên hướng** ở tâm: size `0.42 ô`, color `deep`, stroke-width 3.2 (design **chọn mũi tên vừa**
  làm glyph chính — không phải arrow thô lớn; spec "tránh arrow lớn" được tôn trọng bằng cỡ vừa).
- **Foam** 2 bọt tròn ở mép xuôi dòng (leading edge), `foam`.

### 8.4. Ô mới mọc — NEW_THIS_TURN (jsx:111-121, 671-678)
- Nền như flow + viền sáng `0 0 0 2px foam` + glow `0 0 12px 2px rgba(95,210,214,.7)`.
- `gjwNew` 1.5s ease-inout ∞: scale 1→1.04 + glow mạnh lên tại 50%.
- **Sparkle 4 cánh** góc trên-phải, `gjwSpark` 1.4s (scale .4→1, xoay 40°, opacity 0→1).
- Biến thể "tip glow" (stream): ring `0 0 0 2px foam, 0 0 16px 4px rgba(95,210,214,.9)`, `gjwTipGlow`
  1.4s scale 1→1.08.

### 8.5. Ô giọt nước — TARGET *(BỎ khỏi gameplay v5)*
> v5 phá nguồn trực tiếp (clear line qua ô nguồn) → **không còn ô giọt**. `drawWaterDropTarget` giữ lại
> chỉ để token guide mini-board (tĩnh); in-game không vẽ ô giọt. Spec cũ (vòng target nét đứt + giọt bob).

### 8.6. Nguồn khô — BROKEN (jsx:137-156, 683-701)
- Nền: `linear-gradient(160deg, dry 0%, #B3A48C 100%)`, inset shadow `0 2px 5px rgba(120,92,52,.24)`.
- Miệng khô: vòng xám `#9C8E77` 30% ô. **Nứt:** 4 vạch từ tâm, stroke `dryDark` 2.4px opacity .7.
- Badge giọt vỡ: đĩa `#EDE5D8`, icon giọt nứt (`#D9CFBE` fill, `dryEdge` stroke) opacity .8.
- Chuỗi flow phía sau **fade** opacity → .32/.3 rồi biến mất.

### 8.7. Splash khi phá (jsx:201-211)
- 6 chấm tròn quanh vòng bán kính ~17-18px, `fill mid`, opacity .85 (chấm 0°/120°/240° to hơn).

### 8.8. Jelly bị đẩy (jsx:230-243, 705-720)
- **Ghost** vị trí cũ: JellyBlock opacity .28, `showEyes=false`.
- **Jelly** vị trí mới: `expression="focus"` (mắt tập trung — dùng `EyeExpression.FOCUS` sẵn có).
- **Bracket cụm:** khung 3px `deep` ôm cả cụm dính nhau (chỉ minh hoạ tài liệu; in-game dùng trail).

---

## 9. Spec animation (map sang `05-motion.css` + `BoardAnimator`)

| Hiệu ứng | Nguồn design | Token/thời lượng | Hiện thực `:game` |
|---|---|---|---|
| Nguồn breathe glow | `gjwSource` 1.9s | ~1900ms ease-inout ∞ | phase math per-frame (như super-pulse) |
| Ripple ring nguồn | `gjwRing` 2s | ~2000ms | vẽ vòng scale/opacity theo `now` |
| New-note mọc | `gjwNew`/`gjwTipGlow` 1.4-1.5s | dùng mảng timestamp `waterNewStart[y][x]` seed từ `ingest` | ring + sparkle 1 nhịp rồi tắt |
| Foam/flow shimmer | `gjwDash` 1.1/1.7s | highlight chạy dọc dòng | dash offset theo `now` |
| Giọt bob | `gjwBob` 1.9s | translateY -3px | offset sin theo `now` |
| **Push jelly trượt** | slide + squash | **`motion-medium` 350ms `ease-inout`** (`--t-rotate`, "gravity slide") | tái dùng `slideDX/DY[y][x]` + `squashScaleX/Y` sẵn có |
| Phá nguồn splash + fade | splash dots + opacity .3 | `motion-slow` 450ms | particle pool + fade lớp nước |

- **Chống giật (bắt buộc):** vẽ lớp nước trong **cùng 1 Canvas** (`BoardCanvas`), **trước** vòng vẽ
  jelly (jelly đè lên). Allocation-free: tái dùng `Paint`/`Path`, mảng timestamp `[y][x]` không cấp
  phát trong draw. Đọc state trong draw phase (redraw, không recompose).
- **displayGrid vs truth:** lớp nước là **truth-layer** (đọc `effects` từ engine, KHÔNG từ
  `displayGrid`). Trong lúc cascade playback vẫn vẽ chuỗi nước theo truth; nốt-mới/broken chỉ trigger
  animation ở nhịp tương ứng. Tôn trọng invariant `displayGrid=null` khi hết playback.
- Surface `effects` (+ tập newThisTurn + list broken) từ `EndlessState` → `BoardRender` qua
  `holder.sync()` (hiện chỉ copy grid+gravity — cần thêm field).

---

## 10. i18n & Guide

- Strings (vi + en): `goal_clear_targets_water` = "Phá %1$d nguồn nước"; `guide_water_flow_{title,desc,
  body}`; demo label `guidedemo_{first_turn,spread,water_active,source_dry}`. (Đã BỎ `guidedemo_water_has_drop`.)
- Cẩm nang `GuideGroup.RIVER` — **3 mục** (demo before/after hình thật): `waterFlow` (mọc-xuống + tách
  nhánh quanh đá) · `waterDrift` (khối trôi theo dòng + không rơi) · `waterBreak` (cắm Thạch Nước → clear
  → nguồn khô). Cả 3 trigger ở `levelIntroGuides(21)` (dạy lần đầu) + hiện ở trang Cẩm nang. i18n vi+en
  `guide_water_{flow,drift,break}_{title,desc,body}` + `guidedemo_{meet_obstacle,branch,block_on_flow,
  drift_down,blue_in_source,source_dry}`.
- ObjectiveBar: tái dùng `CLEAR_TARGETS`/`MIXED`, đếm **`WaterSourceBroken`** (holder `targetsCleared`;
  `initialTargets` = số nguồn). Glyph giọt (`DropGlyph`) giữ khi `world==3`.

---

## 11. Thay thế `WaterfallFlow` cũ (chốt phiên làm việc)

`core/WaterfallFlow.kt` + `EndlessEngine.recalculateWaterfall()` + `EndlessState.floodedCells` +
`Level.waterSources:List<Int>` là **phương án flood cũ** (loang nước chặn đặt mảnh, phá TARGET, **vô
hình, không đẩy jelly**). **GỠ toàn bộ**, thay bằng WaterFlow ở trên. Cần dọn: ctor `EndlessEngine`,
`LevelSetup.forLevel`, `MoveSolver`/`CampaignSolver` (chỗ dùng `floodedCells` chặn đặt), test
`WaterfallFlowTest`. Snapshot/restore thêm state nước mới.

---

## 12. Hướng chảy — ✅ ĐÃ CHỐT v5: XUỐNG cố định (05/07/2026)

Bám sheet **`streamflow`** (`world3-flow-stream.card.html`): nguồn ở **hàng trên cùng**, **luôn chảy
XUỐNG**, **không đổi hướng** kể cả khi boss đảo trọng lực (`GravityPill`: "Nước chảy theo trọng lực ↓ ·
không đổi hướng"). Bị chặn thì **rẽ ngang** (đường gấp khúc `StreamPath`). Quyết định người chơi chốt
05/07: (1) xuống-cố-định · (2) phá-qua-ô-nguồn (bỏ ô giọt) · (3) đẩy-đoàn-tàu-xé-cụm · (4) rẽ-TRÁI-trước.

*(v4 dùng hướng ngang cố định + ô giọt — đã thay hoàn toàn.)*

---

## 13. Edge cases (bắt buộc test)

| Case | Xử lý |
|---|---|
| Ô xuống bị chặn (đá/jelly/biên) | **rẽ ngang** TRÁI trước rồi phải; bí cả 3 → dừng mọc lượt đó |
| Ô đã là nước nguồn khác | không lấn (không merge) |
| Chạm `maxLength` | dừng mọc |
| Nguồn phá giữa turn | `flow` → NONE ngay; ô nguồn giữ WATER_SOURCE (khô) |
| Đẩy: đích trống | dời 1 ô xuôi dòng |
| Đẩy: đích bị chặn | rẽ TRÁI trước rồi phải; bí cả hai → đứng yên |
| Nắp trên ô nguồn | KHÔNG đẩy (cho úp nắp phá cột) |
| Cụm dính một phần trên kênh | chỉ phần trên kênh trôi (đoàn tàu) — **xé cụm** |
| Push tạo full line | `foldResolve` clear/combo (combo hồi lượt xoay áp) |
| Line qua nhiều ô nguồn (vd row 0) | phá tất cả nguồn trên line đó |
| Cột/hàng ĐƠN SẮC qua nguồn | hoá siêu khối (KHÔNG clear) → không phá; cần line đa màu |
| Boss đảo trọng lực + nước | hướng nước XUỐNG không đổi; flip trước, push sau |
| Xoay trọng lực | KHÔNG mọc; push + applySourceBreaks vẫn áp |
| Restart | tạo engine mới; snapshot/restore gồm `effects` + `WaterSource` list |

---

## 14. Kế hoạch test `:core`

Đã có: `WaterFlowTest` (14) + `EndlessWaterFlowTest` (3) — PASS.
- `growSource`: +1 ô/lượt xuống; **rẽ TRÁI trước** khi bị jelly/đá chặn, rẽ phải khi trái cũng chặn, bí cả 3 dừng; maxLength.
- `pushJellyByFlow`: 1 khối trôi xuống 1 ô; **đoàn tàu** 2 khối trôi cùng; **nắp nguồn KHÔNG bị đẩy**; đích chặn → rẽ; bí → đứng yên; ngoài kênh không đẩy.
- `breakSource` + engine: **clear cột/hàng qua ô nguồn** → `WaterSourceBroken` + nguồn khô + chuỗi tắt.
- **Determinism:** cùng input → cùng đường flow. Snapshot/restore round-trip gồm `effects` + `WaterSource`.

---

## 15. Level L21-L30 — ĐÃ hiện thực v5 + solver chốt (05/07/2026)

Nguồn ở **hàng trên cùng**, chảy XUỐNG; đa số goal **ĐIỂM** (nước = áp lực đẩy lệch, xé cấu trúc), vài
màn phá nguồn (`CLEAR_TARGETS`/`MIXED`). Đá cản buộc nước **rẽ vòng**. **MỌI màn (kể cả boss) chấm sao
theo LƯỢT** (metric MOVES). `MoveSolver` (`SolveWorld3Test`) xác nhận **số nước ngắn nhất** = ngưỡng 3★.

**Boss L30 "Thần Thác" (redesign 05/07):** BỎ đảo trọng lực. Khởi đầu **2 nguồn**; mỗi 3 lượt boss **HỒI
SINH nguồn cạn** (`bossReviveEveryN=3`) VÀ **THẢ THÊM 1 nguồn mới** từ hàng trên (`bossSpawnSourceEveryN=3`,
`bossMaxSources=4`, vị trí cột trống deterministic qua `rng`) → áp lực dòng chảy dâng dần. Goal = **phá nguồn
8 lần** (`CLEAR_TARGETS 8`). Nhận diện boss = `Level.isBoss` (id%10==0). Event spawn/revive dùng chung
`WaterSourceRevived`. (Nguồn đều ở hàng 0 → 1 lần clear row-0-có-BLUE phá HẾT nguồn trên đó cùng lúc.)

**Báo cáo solver (chạy 05/07/2026 · `SolveWorld3Test`):** MIN = lời giải tối ưu (`MoveSolver` beam+greedy) =
ngưỡng **3★**. MAX = ván **greedy dài nhất còn thắng** trong **40 seed** (`CampaignSolver.solveBatch`) — không
phải trần tuyệt đối. WinRate = tỉ lệ 40 seed greedy thắng.

| Màn | Goal | MIN (=3★) | MAX | WinRate |
|---|---|---|---|---|
| L21 Suối Nhỏ | CLEAR_TARGETS 1 | **6** | 41 | 98% |
| L22 Đôi Dòng | REACH_SCORE 70 | **10** | 23 | 95% |
| L23 Ba Dòng | REACH_SCORE 150 | **16** | 28 | 90% |
| L24 Xoay Dòng | REACH_SCORE 170 | **16** | 28 | 93% |
| L25 Chặn Nguồn | MIXED 1 + 220đ | **19** | 29 | 83% |
| L26 Bến Nghỉ (breather) | REACH_SCORE 90 | **11** | 22 | 95% |
| L27 Ba Nguồn | REACH_SCORE 360 | **22** | 33 | 95% |
| L28 Dòng Xiết | REACH_SCORE 520 | **25** | 37 | 95% |
| L29 Thác Lớn | REACH_SCORE 560 | **29** | 41 | 90% |
| L30 Thần Thác (boss: hồi sinh + thả thêm nguồn) | CLEAR_TARGETS 8 | **25** | 87 | 98% |

**Tổng World 3:** nước tối thiểu = **6** (L21) · nước tối đa = **87** (L30 — boss cứ hồi sinh/thả nguồn nên ván
dở kéo dài). Đường cong MIN tăng dần (chỉ L21/L22 <10; breather L26 dịu): 6·10·16·16·19·11·22·25·29·25.

Sao: **3★ = MIN solver** (metric MOVES cho MỌI màn, kể cả boss), 2★/1★ nới dần (~+30%/+60%). Chạy lại:
`./gradlew :core:test --tests "*SolveWorld3Test"` → `core/build/solver-w3.txt`.

---

## 16. File plan (tóm tắt, chi tiết ở phiên code)

| File | Thay đổi | Risk |
|---|---|---|
| `core/Grid.kt` | + `CellEffect`, `effects[][]`, copy/loadFrom | High |
| `core/WaterFlow.kt` (mới) | grow + push + break thuần | High |
| `core/WaterfallFlow.kt` | **GỠ** (§11) | Med |
| `core/EndlessEngine.kt` | hook `finishTurn`, `foldResolve`, event `WaterSourceBroken`, snapshot | High |
| `core/Resolve.kt` | drop có link → trigger break | Med |
| `core/Level.kt`, `LevelSetup.kt`, `CampaignLevels.kt` | spec source/drop, thread, L21-30 | Med |
| `game/BoardCanvas.kt`, `WaterDraw.kt` (mới), `BoardAnimator.kt`, `EndlessGameHolder.kt` | vẽ lớp sàn + animation + surface state | Med |
| `app/ObjectiveBar.kt`, `CampaignPlayScreen.kt`, `GjGuide.kt`, `strings.xml`×2 | goal, guide, i18n | Low |
```
