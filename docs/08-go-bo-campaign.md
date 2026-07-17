# Gỡ bỏ tính năng Campaign

Cập nhật 17/07/2026 — **ĐÃ THỰC THI**. Ghi lại quyết định, phạm vi đã gỡ và layout Home mới.
Các mục §3–§6 mô tả những gì đã làm; §7 là cách kiểm chứng; §9 là seam cho việc sau.

> **Trạng thái build sau khi gỡ:** `./gradlew :core:test :game:testDebugUnitTest
> :app:testDebugUnitTest assembleDebug` → **BUILD SUCCESSFUL**, toàn bộ test xanh (kể cả
> `PlaybackSyncTest` ~27.000 nước không lệch). Chưa chơi thật trên máy — xem §7 mục 4.

## 1. Lý do

Feedback về Campaign (chế độ chơi theo World/Level/Boss có cốt truyện, L1–L30 qua World 1–3)
chưa đủ tốt và người chơi rất ít khi chơi. Quyết định **gỡ bỏ hoàn toàn Campaign** khỏi MVP,
chỉ giữ **Endless** làm chế độ chơi duy nhất. Đây là thay đổi kiến trúc lớn nhưng có ranh giới
sạch: `EndlessEngine` (`:core`) là engine dùng chung cho cả hai chế độ; Campaign chỉ là một
nhánh cấu hình (`Level` truyền vào qua `EndlessEngine.forLevel(level)` / `EndlessGameHolder(level=...)`)
chồng lên engine đó. Xoá nhánh này không đụng tới luồng Endless.

## 2. Quyết định đã chốt

| Chủ đề | Quyết định |
|---|---|
| Cơ chế engine World 2/3 (Vine dây leo, WaterFlow dòng chảy, boss debris/gravity-flip) | **Xoá sạch** cùng Campaign (hiện chỉ Campaign kích hoạt các field này, Endless luôn để mặc định tắt) |
| Nền theo world (Home/Endless) | Bỏ phụ thuộc `campaignStars`; **tạm khoá `world = 1`** (Đồng cỏ). Giữ `WorldTheme.kt` + asset world 2/3 làm **seam** cho hệ *mở-khoá-theme-theo-điểm-Endless* sẽ thiết kế sau (ngoài phạm vi lần gỡ này) |
| Layout Home | Bỏ nút "Chiến dịch"; hàng trên chỉ còn **1 nút Endless canh giữa**; hàng dưới giữ nguyên (Cẩm nang / Bảng xếp hạng / Cài đặt) — xem §5 |
| Docs thiết kế Campaign | **Chuyển vào `docs/_archive/`** (không xoá), giữ công sức thiết kế 30 màn/3 world/3 boss để tái dùng nếu sau này làm lại |

**Ranh giới an toàn — KHÔNG đụng khi thực thi** (Endless + component dùng chung):
`EndlessEngine` (giữ, chỉ bỏ nhánh campaign), `SuperBlock.kt`, `ComboReward.kt`, `ResultScreen.kt`,
`EndlessGameScreen.kt`, guide combo/gravity/super/rainbow, `BoardCanvas`, `DragPieceOverlay`,
`GuideTeachDialog`, `ComboX2Demo`, `WorldTheme.kt` (giữ), asset nền world 2/3 (giữ).

## 3. Phạm vi xoá thẳng (file 100% Campaign)

**`:core`**
- `CampaignLevels.kt`, `CampaignSolver.kt`, `MoveSolver.kt`, `Level.kt`, `LevelSetup.kt`
- `Vine.kt`, `WaterFlow.kt`
- Test: `CampaignLevelsTest`, `CampaignSolverTest`, `MoveSolverTest`, `SolveWorld3Test`,
  `BossDebrisTest`, `BossTellTest`, `VineTest`, `WaterFlowTest`

**⚠ SỬA 17/07:** `WaveGenerator.kt`/`WaveGeneratorTest.kt` **KHÔNG PHẢI** cơ chế World 3 — đây là
logic **chống-hạn-khay (anti-drought)** dùng cho MỌI ván Endless (`EndlessEngine.deal()` gọi
`WaveGenerator.deal()`, cấu hình qua `EndlessTuning.antiDrought`), đang có sửa đổi dang dở (xem
memory `tray-anti-drought`). **GIỮ NGUYÊN**, không đụng.

**`:game`**
- Test: `BossComboDamageTest.kt`

**`:app`**
- `CampaignScreen.kt`, `CampaignIntroScreen.kt`, `CampaignPlayScreen.kt`, `LevelWinScreen.kt`, `LevelFailScreen.kt`
- `i18n/LevelText.kt`, `ui/components/ObjectiveBar.kt`, `ui/components/BossHud.kt`
- Test: `ads/AdsConfigTest.kt` (chỉ test `showsAdOnCampaignClear`; nếu có case Endless thì trim thay vì xoá)

**Assets** (đã xoá, **−4.9MB**) — `res/drawable-nodpi/`: `btn_campaign.png`, `world{1,2,3}_map_bg.webp`,
`tile_{completed,locked,unlocked}.webp`, `boss_gate_{locked,current,cleared}.webp`,
`boss_{worm,forest,water}.png`, `star_on.webp`, `star_off.webp`.
`res/raw/`: `sfx_campaign_node_tap.ogg`, `sfx_level_{win,fail}.ogg`, `sfx_confetti.ogg`,
`sfx_boss_{gravity_flip,tell,defeated}.ogg`, `sfx_w3_drop_clear.ogg`, `sfx_star_reveal.ogg`,
`sfx_objective_done.ogg`.
**Giữ:** `home_world_{2,3}_bg.webp`, `ingame_world_{2,3}_bg.webp` (seam theme tương lai), `home_panel.png`.

**Strings** — đã xoá **181 key** khỏi CẢ `values/strings.xml` (325 → 144) lẫn `values-en/strings.xml`
(323 → 142), cùng 11 comment-header rỗng mỗi file. Cách làm: **quét tham chiếu thật**
(`R.string.X` + `@string/X` trong `.kt`/`.xml`) rồi xoá key không còn ai gọi — an toàn hơn xoá theo
pattern tên. Nhóm đã xoá: `home_campaign`, `campaign_*`, `campaignintro_*`, `campaignplay_*`,
`goal_*`, `levelwin_*`, `levelfail_*`, `boss_*`, `objective_*`, `level_1..30_name`, `guide_boss_*`,
`guide_vine_*`, `guide_water_*`, `guide_trash_*`, `camnangparts_group_{forest,river,boss}`,
`guidedemo_*` (của demo vine/water/trash). **Giữ:** `home_endless`, `world_1..10_name` (vẫn được
`WorldTheme.nameRes` dùng — seam theme). Đã đối chiếu: 2 file **không lệch key**.

## 4. Phạm vi refactor (file dùng chung — chỉ bỏ nhánh Campaign)

- **`core/EndlessTuning.kt`** — bỏ field `vineGrowEveryN`, `debrisPerTurn`, `bossGravityEveryN`,
  `bossReviveEveryN`, `bossSpawnSourceEveryN`, `bossMaxSources`, `bossVineSpawnEveryN`.
- **`core/EndlessEngine.kt`** — xoá `forLevel(level)` + logic vine/water/debris/boss-gravity gọi
  vào các file đã xoá; bỏ import `Level`/`Vine`/`WaterFlow`. Giữ nguyên đường Endless
  (`EndlessEngine(seed, budget, tuning)`).
- **`game/EndlessGameHolder.kt`** — bỏ param `level: Level? = null` và toàn bộ field/hàm chỉ có
  nghĩa khi `level != null`: `goal`, `starThresholds`, `movesUsed`, `levelComplete`, `starsEarned`,
  `rotationsUsed`, `trig*`, `bossDamage/bossHpDamage/bossHpMax`, `targetsCleared/initialTargets`,
  `bossTell`, `trackGoalEvents()`, `evaluateGoal()`, `computeStars()`, `hasBlocks()`, nhánh
  `isComboTimeBased` theo level. Constructor rút về `EndlessGameHolder(seed, initialBudget, tuning)`.
  Giữ nguyên animator/drag/preview/guide-queue/combo-timer (core Endless).
- **`app/MainActivity.kt`** — bỏ `Route.Campaign/CampaignIntro/CampaignPlay` (sealed +
  `routeKey/routeFromKey`), wiring `onPlayCampaign`, `onWin`+`saveCampaignStar`+`logLevelComplete`,
  nhánh back `CampaignPlay`, import `CampaignLevels`. Thay
  `val currentWorld = campaignCurrentWorld(...)` → `val currentWorld = 1` (hằng số tạm; TODO seam
  lấy từ theme mở-khoá-Endless sau này).
- **`app/HomeScreen.kt`** — bỏ param `onPlayCampaign`, bỏ nút `btn_campaign`; hàng trên chỉ còn 1
  nút Endless canh giữa. Rà lại `BTN_ROW_SCALE`/`contentW` cho cân 1 nút (xem §5).
- **`app/GameScreen.kt`** — bỏ param `objective: (@Composable () -> Unit)? = null` + nhánh
  `if (objective != null)`.
- **`app/WorldTheme.kt`** — giữ nguyên; chỉ thêm ghi chú seam cho hệ theme-Endless tương lai.
- **`app/data/SettingsRepository.kt`** — bỏ field `campaignStars`, `saveCampaignStar()`,
  `KEY_CAMPAIGN_STARS`, `decodeStars()`. Key DataStore mồ côi ở máy cũ tự vô hại, không cần migration.
- **`app/ads/AdsConfig.kt`** — bỏ `showsAdOnCampaignClear()`. Giữ `showsAdOnEndlessGameOver()`.
- **`app/ads/AdsManager.kt`** — sửa docstring `showInterstitial()` (bỏ nhắc Campaign). Giữ hàm.
- **`app/analytics/AnalyticsManager.kt`** — bỏ `logLevelComplete()`, bỏ mode `"campaign"` trong
  `logGameStart`.
- **`app/audio/GjSfx.kt` + `GjAudioManager.kt`** — bỏ cue `SFX_CAMPAIGN_NODE_TAP`,
  `SFX_LEVEL_WIN/FAIL`, `SFX_CONFETTI`, `SFX_BOSS_GRAVITY_FLIP/TELL/DEFEATED` + nhánh mapping
  `BOSS_GRAVITY_FLIP`. Giữ `SFX_NEW_BEST`.
- **`app/ui/guide/GjGuide.kt`** (+ `CamNangParts.kt` nếu tham chiếu) — bỏ `GuideGroup.FOREST/RIVER/BOSS`
  và entry `vine*/water*/trash*/boss*`. Giữ nhóm combo/gravity/super/rainbow.

### 4b. Phát sinh khi thực thi (ngoài plan ban đầu)

Những thứ plan không lường trước, phát hiện lúc làm — ghi lại để hiểu diff:

- **`core/Grid.kt`** — `CellType` rút từ `{EMPTY, BLOCK, STONE, TARGET, VINE, TRASH}` về
  `{EMPTY, BLOCK, STONE}`; bỏ `CellEffect` (lớp sàn nước), `Grid.Cell.vineRoot`/`trashCountdown`/
  `isVineRoot`, `Grid.effect()`/`setEffect()`/mảng `effects`, `countTargetCells()`.
- **`core/Resolve.kt`** — bỏ `ResolveEvent.VineRootsCleared`/`DropsCleared`; `LinesCleared` bỏ 2
  field `survivingRoots`/`bluLines`. Thân `resolve()` PHA 2 gọn hẳn: bỏ luật MINT-phá-gốc, giọt vỡ,
  quy tắc "dòng có Thạch Nước mới phá được nguồn", `wiltDisconnectedVines()`.
- **`core/ClusterPhysics.kt`** — `isJelly()` chỉ còn loại `STONE`; bỏ `isFallingJelly()` +
  `findGravityClusters()` (khái niệm "jelly neo-nước không rơi" chỉ có ở W3).
- **`core/LineClearing.kt`** — `isFilled()` rút về `!grid.isEmpty(x,y)` (bỏ luật TRASH-countdown).
- **`core/SuperBlock.kt`** — bỏ luật "dây leo miễn nhiễm nổ trừ gốc bị MINT super quét".
- **`core/EndlessEngine.kt`** — bỏ luôn param `preset` + `trayScript` (chỉ Campaign dùng: dựng bàn
  sẵn + khay kịch bản) và field `waveIdx`/`placesSinceGrow`; `Snapshot` gọn theo.
- **`game/BoardAnimator.kt`** — bỏ `waterPending()`, `waterNewStart[][]`, `CascadePhase.pushMoves`,
  `buildPushBeat()`, `activatePush()`, `drawWaterNew()`, hằng `WATER_*`.
- **`game/BoardCanvas.kt`** — bỏ `BoardRender.waterSources`, nhánh vẽ `VINE`/`TARGET`/`TRASH`, lớp
  ribbon nước.
- **`game/WaterDraw.kt`** — **xoá cả file** (311 dòng: vẽ dải nước/nguồn/giọt).
- **`game/JellyDraw.kt`** — xoá `drawVineCell` + `drawVineRoot/Segment/Tip/Leaf`, `drawTrashCell`,
  `drawDebrisCell` + toàn bộ palette VINE/CUT/DEBRIS (~370 dòng).
- **`game/GuideDemo.kt`** — `GuideCellKind` bỏ `VINE/TRASH/WATER_*`; bỏ `gVine*/gTrash/gWater*`,
  `GuideCell.dir`, `drawGuideWaterRibbon()`.
- **`game/GameSfx.kt`** — bỏ `DROP_CLEAR`/`BOSS_GRAVITY_FLIP` (không còn ai phát sau khi gỡ holder).
- **Test đã xoá thêm:** `core/EndlessWaterFlowTest.kt`, `game/WaterPlaybackTest.kt`; sửa
  `game/SuperPlaybackTest.kt` (bỏ 2 nhánh map `VineRootsCleared`/`DropsCleared`).
- **`app/ui/guide/CamNangParts.kt`** — ngoài `displayLabel`/`jelly`, còn phải bỏ cụm thumbnail boss
  (`bossArtRes`, `BossArtThumbContent`, `BossShieldThumbContent`, `ShieldGlyph`) + các lưới
  thumbnail vine/water/trash trong `thumbRows()`.
- **`app/ui/guide/GjGuideDemos.kt`** — xoá 8 demo `Vine*/Water*/Trash*` (~136 dòng) + shorthand.
- **`AdsConfigTest.kt`** — trim (giữ case Endless + retry-backoff) thay vì xoá cả file, đúng nhánh
  dự phòng của plan.

**Dead code còn lại có chủ đích:** `AdsManager.showInterstitial()` giờ KHÔNG có caller (nhịp
theo-mốc vốn của Campaign) — giữ lại theo plan cho chế độ chơi tương lai, đã ghi rõ ở docstring.
(`AdsManager.onGameOver()` cũng không caller nhưng đã vậy từ TRƯỚC lần gỡ này — không phải hệ quả.)

## 5. Layout Home mới

Thiết kế hiện tại (`design/.../04-screens/home-screen.jsx`): panel kem 2 hàng — hàng trên 2 nút
(**Chiến dịch** + Endless), hàng dưới 3 nút (Cẩm nang / Bảng xếp hạng / Cài đặt).

**Layout mới:** hàng trên chỉ còn **1 nút Endless, to, canh giữa** (thay thế cụm 2 icon song song
bằng 1 CTA chính — đúng thực tế chỉ còn 1 chế độ chơi). Hàng dưới **giữ nguyên** 3 nút phụ.

```
┌──────────────────────────────┐
│                               │
│        [  ▶ Endless  ]       │   ← hàng trên: 1 nút to, canh giữa
│                               │
│  [Cẩm nang] [BXH] [Cài đặt]  │   ← hàng dưới: giữ nguyên 3 nút
│                               │
└──────────────────────────────┘
```

Đã làm:
- `HomeScreen.kt`: bỏ `onPlayCampaign` + icon `btn_campaign`; `HomeMenu` hàng trên từ `Row` 2 phần
  tử → **1 `IconButton` Endless canh giữa**, rộng `contentW × BTN_HERO_FRAC`. Thêm knob
  **`BTN_HERO_FRAC = 0.62f`** (nút chủ đạo: to hơn nút phụ hàng dưới ~1/3 contentW mỗi nút, không
  tràn hết bề ngang panel). Hàng dưới giữ nguyên `weight(1f)` chia đều.
- `MainActivity.kt`: `currentWorld = 1` (hằng số tạm) — nền Home/Endless khoá world 1 (Đồng cỏ);
  asset world 2/3 giữ lại làm seam cho hệ mở-khoá-theme-theo-điểm-Endless (§9).
- strings: giữ `home_endless`, bỏ `home_campaign`.

⚠ **Còn lại:** `design/.../04-screens/home-screen.jsx` **chưa đồng bộ** (vẫn có `IC_CAMPAIGN` + hàng
trên 2 nút). Cần sửa khi đụng lại design system — xem §6.

> **Chưa nhìn trên máy thật.** `BTN_HERO_FRAC = 0.62f` là ước lượng theo tỉ lệ, chưa qua mắt người.
> Nếu nút Endless trông quá to/nhỏ, chỉnh đúng hằng số này (knob duy nhất) rồi báo lại.

## 6. Docs → `docs/_archive/`

**Đã di chuyển** (giữ lịch sử, không xoá — chỉ mục ở [`_archive/README.md`](_archive/README.md)):
`02-thiet-ke-man/` → `_archive/02-thiet-ke-man/` · `05-prompts/02-map/` → `_archive/05-prompts-02-map/` ·
`06-du-lieu/` → `_archive/06-du-lieu/` · `03-co-che/03-boss.md` → `_archive/03-boss.md` ·
`04-ui-ux/01-boss-hud-objective-bar.md` → `_archive/04-boss-hud-objective-bar.md` ·
`04-ui-ux/04-man-ban-do.md` → `_archive/04-man-ban-do.md` · `05-prompts/03-objectives.md` →
`_archive/05-objectives.md` · `05-prompts/05-prototype-targets.md` → `_archive/05-prototype-targets.md`.
(Dùng `git mv` nên lịch sử file được giữ.)

**Đã cập nhật mention:** `00-muc-luc.md` (viết lại: bỏ nhóm 02/06, rút bảng "Đọc nhanh", trỏ `_archive`) ·
`03-co-che/02-combo.md` (bỏ §6 sát-thương-boss + §7 combo-từ-sự-kiện-boss, đánh số lại §6/§7, sửa
bảng tóm tắt) · `07-phat-hanh/02-thiet-lap-tung-buoc.md` (danh sách screenshot store) ·
`release-notes.txt` + `store-listing{,-vi,-en}` (bỏ copy Campaign/Boss/World) · `README.md`
(tham chiếu thiết kế + "việc tiếp theo").

⚠ **CHƯA làm — việc còn lại của §6:** `design/Gravity Jelly Design System/CLAUDE.md` chưa ghi chú
"tạm gác" cho cụm Campaign/Boss (`board-campaign.jsx`, `board-boss.jsx`, `03-components/09-boss-hud/`,
`08-objective-bar/`) và `04-screens/home-screen.jsx` chưa bỏ nút Chiến dịch. Artifact design KHÔNG
xoá — chỉ cần đánh dấu không-còn-dùng để lần sau không bị bám nhầm làm nguồn thật.

## 7. Verification

| # | Hạng mục | Trạng thái |
|---|---|---|
| 1 | **Build + test**: `./gradlew :core:test :game:testDebugUnitTest :app:testDebugUnitTest assembleDebug` | ✅ BUILD SUCCESSFUL, test xanh (gồm `PlaybackSyncTest` ~27.000 nước không lệch) |
| 2 | **Grep sạch** `campaign\|forLevel\|MoveSolver\|ObjectiveBar\|BossHud\|LevelText\|vineGrow\|waterSource\|CellEffect` ở `app/ core/ game/` | ✅ chỉ còn trong comment ghi chủ đích |
| 3 | **i18n**: đối chiếu key vi ↔ en | ✅ không lệch (144 vs 142; 2 key thừa ở vi là `game_services_project_id`/`privacy_policy_url` — cấu hình, không dịch, vốn đã vậy) |
| 4 | **Chơi thật trên máy** | ⬜ **CHƯA** — cần user chơi & feedback (quy ước dự án: không tự mô phỏng playtest) |
| 5 | **DataStore**: cài đè bản cũ có `campaign_stars` | ⬜ **CHƯA** — cần thử trên máy đã cài bản trước |

**Cần kiểm khi chơi thật (mục 4–5):** Home hiện đúng 1 nút Endless canh giữa + 3 nút dưới, cỡ nút
nhìn cân (`BTN_HERO_FRAC`) · bấm Endless chơi trọn ván (đặt mảnh · xoay trọng lực · cascade combo ·
siêu khối · game-over → ResultScreen → interstitial theo `showsAdOnEndlessGameOver`) · Cẩm nang mở
được, không còn mục vine/water/boss, không vỡ layout · back từ Home thoát app · đổi ngôn ngữ vi↔en
không vỡ chuỗi · cài đè bản cũ không crash.

## 8. Thứ tự đã thực thi

`:core` (Grid/Resolve/ClusterPhysics/LineClearing/SuperBlock → EndlessTuning/EndlessEngine → xoá
file + test) → `:game` (EndlessGameHolder → BoardCanvas/BoardAnimator/JellyDraw/GuideDemo → xoá
WaterDraw + test) → `:app` (xoá màn → MainActivity → HomeScreen/GameScreen →
Settings/Ads/Analytics/Audio → Guide/CamNang) → strings → assets → docs → *(design system: còn)*.
Build & test xanh sau mỗi module.

## 9. Định hướng tương lai (ngoài phạm vi lần gỡ này)

`WorldTheme.kt` và asset nền world 2/3 được giữ lại làm nền cho một hệ **mở-khoá-theme-theo-điểm-Endless**
— đổi nền Home/Endless theo mốc điểm số/độ khó đạt được ở Endless, thay vì theo tiến độ Campaign
cũ. Thiết kế tiêu chí mốc cụ thể là việc của một task riêng, chưa chốt trong tài liệu này.

**Seam đã chừa sẵn** (chỉ cần thay 1 chỗ khi làm):
- `MainActivity.kt` — `val currentWorld = 1` (có TODO trỏ về mục này). Đổi hằng số này thành giá trị
  suy từ state mới là xong; `HomeScreen`/`GameScreen` đã nhận `world` qua param sẵn.
- `WorldTheme.kt` — `homeBackground/ingameBackground/homeSky/nameRes/accent` đã map world → res,
  fallback world 1 khi thiếu art. Không cần sửa.
- Asset `home_world_{2,3}_bg.webp` + `ingame_world_{2,3}_bg.webp` + string `world_1..10_name` còn nguyên.
- `SettingsRepository` — nơi thêm field mới (vd `unlockedThemes`/`selectedTheme`) + key DataStore.

## 10. Việc còn lại

| Việc | Thuộc §|
|---|---|
| **Chơi thật trên máy** + feedback (Home layout, cỡ nút `BTN_HERO_FRAC`, Endless trọn ván, Cẩm nang, đổi ngôn ngữ) | §7 mục 4 |
| **Cài đè bản cũ** (có `campaign_stars`) xác nhận không crash | §7 mục 5 |
| **Đồng bộ design system**: `home-screen.jsx` bỏ nút Chiến dịch; `design/.../CLAUDE.md` ghi chú "tạm gác" cụm Campaign/Boss | §6 |
| Hệ mở-khoá-theme theo mốc điểm Endless | §9 |

---

## Nhật ký thay đổi

- **17/07/2026** — **Thực thi xong** phần code/strings/assets/docs: 3 module build + test xanh, gỡ 181 string key (vi+en), −4.9MB asset, docs Campaign vào `_archive/`. Bổ sung §4b (phát sinh ngoài plan), §7 bảng trạng thái verification, §9 seam, §10 việc còn lại. Còn: chơi thật trên máy + đồng bộ design system.
- **17/07/2026** — Tạo tài liệu, ghi lại quyết định gỡ bỏ Campaign + phạm vi + layout Home mới.
