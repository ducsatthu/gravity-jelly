# Hệ thống Combo — Gravity Jelly

> Tài liệu ghi chép từ source code, cập nhật liên tục.

---

## 1. Tổng quan

Combo là bộ đếm `Int` tích luỹ qua các nhịp resolve và nước đi. Combo ảnh hưởng đến:
- **Điểm** (nhân trực tiếp)
- **Hồi lượt xoay** (cơ chế chữ ký)
- **Sát thương boss** (phá khiên)

---

## 2. Cơ chế tích luỹ combo (Resolve cascade)

Mỗi lần resolve (`Resolve.kt`) chạy vòng lặp 3 pha, combo **cộng dồn** liên tục:

| Pha | Điều kiện | Combo cộng thêm |
|-----|-----------|-----------------|
| **Pha 0** — Hàng/cột đơn sắc → Siêu khối | 9 ô cùng màu trên 1 hàng/cột | **+1** |
| **Pha 1** — Merge 3×3 | 3×3 cùng màu → Siêu khối, hoặc 3×3 ba màu → Cầu vồng | **+1** |
| **Pha 2** — Xóa hàng/cột đầy | Không có detonation | **+số_hàng_xóa** |
| **Pha 2** — Xóa + Nổ siêu khối | Có detonation | **+Σ detonation bonus** |

**Detonation bonus** (`SuperBlock.kt:detonationComboBonus`):
| Loại | Bonus |
|------|-------|
| Siêu khối cấp 1 | +2 |
| Siêu khối cấp 2 | +5 |
| Cầu vồng thường | +2 × số_màu_kề |
| Cầu vồng siêu cấp | +9 |

Vòng lặp chạy tới khi **không còn pha nào kích hoạt** → kết thúc 1 nhịp resolve. Combo endCombo trả về cho engine.

---

## 3. Combo qua nước (Cross-move combo)

**Nguồn:** `EndlessEngine.finishTurn()` dòng 226.

```
combo = if (cleared || formedSuper) resolveResult.endCombo else 0
```

- Nước **có ích** (xóa hàng HOẶC ghép siêu khối): combo **GIỮ** và tiếp tục cộng dồn.
- Nước **vô ích** (không xóa, không ghép): combo **RESET về 0**.
- Xoay trọng lực (`rotateGravity()`): combo = endCombo (KHÔNG reset, kể cả không xóa gì — vì xoay tiêu ngân sách, đáng giữ combo).

---

## 4. Combo hồi lượt xoay (Rotation Refund)

**Nguồn:** `ComboReward.kt` — cơ chế chữ ký, dùng CHUNG mọi mode.

**Luật:** Mỗi **tier combo MỚI** đạt ≥ x2 → +1 lượt xoay.

```
rotationRefund(before, after) = max(0, after - max(before, 1))
```

| Ví dụ | Hồi |
|-------|------|
| x0 → x2 | +1 |
| x0 → x3 | +2 |
| x0 → x4 | +3 |
| x3 → x5 (cross-move) | +2 (chỉ tier mới) |

Cấu hình: `EndlessTuning.comboRefundsRotation` (mặc định `true`), cap bởi `rotationBudgetCap`.

---

## 5. Combo nhân điểm (Scoring Multiplier)

**Nguồn:** `LineClearing.Scoring`.

```
clearScore = cellsCleared × linesCleared × comboLevel
mergeScore = cellsMerged × comboLevel × mult  (mult=2 cho hàng đơn sắc)
```

Combo nhân **trực tiếp** vào điểm — x5 combo = 5× điểm cơ bản.

---

## 6. Combo sát thương boss (Boss Shield Damage)

**Nguồn:** `EndlessGameHolder` — dùng cùng công thức `ComboReward.rotationRefund`.

- Mỗi tier combo mới ≥ x2 → +1 sát thương khiên.
- HUD hiện "Combo ×2 phá khiên" (`BossHud.kt`).
- Boss levels: L10 (bossHP=5), L20 (bossHP=8), L30 (bossHP=10).

Solver (`CampaignSolver.calcComboDamage`) dùng công thức tương đương nhưng tính tổng `(tier−1)` cho mỗi tier mới để ước lượng quadratic.

---

## 7. Combo từ sự kiện boss

Boss có thể **gián tiếp tạo combo** cho người chơi:

- **Boss đảo trọng lực** (Thần Thác, L30): `flipBossGravityIfDue()` → đổ ngược bàn → `foldResolve()` → cascade có thể tăng combo.
- **Boss spawn dây** (Thần Rừng, L20): gốc mới mọc → `foldResolve()` → nếu dây lấp đầy hàng → combo.
- **Boss đổ rác** (L20): rác chèn → `foldResolve()` → cascade → combo.

Các sự kiện boss chạy **sau** `finishTurn()` → combo đã được set từ nước đi trước, `foldResolve` chỉ tăng thêm (không reset).

---

## 8. Combo UI

**ComboPopup** (`ComboPopup.kt`) — 6 bậc hiển thị:

| Min combo | Lời khen | Sao |
|-----------|----------|-----|
| 9 | CUỒNG NHIỆT! | ★★★ |
| 7 | AMAZING! | ★★ |
| 5 | XUẤT SẮC! | ★★ |
| 4 | HOÀN HẢO! | ★ |
| 2 | TUYỆT VỜI! | — |
| 0 | TỐT! | — |

- Popup vị trí tại ô resolve (không fixed HUD).
- Giữ 1300ms, fade 700ms.
- Haptic ≥ x3: `LongPress`.

---

## 9. Combo theo thời gian (Timed Combo) — ĐÃ IMPLEMENT

> Trạng thái: **đã implement** (03/07/2026).

### 9.1 Luật

- Sau nước đi **có ích** (clear/merge), bắt đầu **bộ đếm 10 giây**.
- Trong 10s, nếu người chơi thực hiện nước đi có ích tiếp theo → combo **GIỮ** và timer reset.
- Nước đi **vô ích** trong 10s **KHÔNG** reset combo (khác với cơ chế cũ).
- Hết 10s mà chưa có nước có ích → combo **RESET về 0**.
- Hiệu ứng: người chơi nhanh tay vẫn duy trì combo dù xen kẽ nước vô ích.

### 9.2 Kiến trúc (giữ deterministic)

- `:core` — **KHÔNG biết thời gian thực**. `EndlessTuning.comboTimeBased = true` → `finishTurn()` giữ combo khi nước vô ích. `resetCombo()` public trả `GameEvent.ComboExpired`.
- `:game` — `BoardRender.comboTimerStartNanos/Duration` lưu mốc timer cho Canvas.
- `:app` — `LaunchedEffect(comboTimerTick)` delay 10s rồi gọi `holder.expireComboTimer()`.
- `EndlessGameHolder.startComboTimerIfProductive()` phát hiện nước có ích → reset timer.
- Solver/replay: `comboTimeBased = false` (mặc định) → combo vẫn reset kiểu cũ.

### 9.3 Hào quang countdown (Board Aura)

- Viền hào quang **4 màu** (VÀNG/MINT/HỒNG/XANH) chạy quanh giếng bàn (rounded rect).
- Tốc độ quay: nhanh khi mới bắt đầu, chậm dần khi cạn (speedScale 0.3→1.0).
- Alpha giảm dần từ 1.0 → 0.15 theo phần trăm thời gian đã qua.
- 2 lớp: bloom mờ (2.5% chiều ngang) + nét sắc (1%), giống viền siêu khối.
- Khi combo productive mới → timer reset → aura bật lại mạnh.
- `drawComboTimerAura()` trong `BoardCanvas.kt`.

---

## Bảng tóm tắt các cơ chế

| # | Cơ chế | Module | File chính | Trạng thái |
|---|--------|--------|-----------|------------|
| 1 | Cascade combo (3 pha) | `:core` | `Resolve.kt` | ✅ Đã implement |
| 2 | Cross-move combo | `:core` | `EndlessEngine.kt` | ✅ Đã implement |
| 3 | Combo hồi xoay | `:core` | `ComboReward.kt` | ✅ Đã implement |
| 4 | Combo nhân điểm | `:core` | `LineClearing.kt` | ✅ Đã implement |
| 5 | Boss shield damage | `:app` | `EndlessGameHolder.kt` | ✅ Đã implement |
| 6 | Detonation bonus | `:core` | `SuperBlock.kt` | ✅ Đã implement |
| 7 | Boss cascade gián tiếp | `:core` | `EndlessEngine.kt` | ✅ Đã implement |
| 8 | Timed combo (10s) | `:core`+`:app` | `EndlessTuning`+`EndlessPlayScreen` | ✅ Đã implement |
| 9 | Board aura countdown | `:game` | `BoardCanvas.kt` | ✅ Đã implement |
