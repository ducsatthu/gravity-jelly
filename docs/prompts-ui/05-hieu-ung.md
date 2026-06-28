# 05 · Hiệu ứng — 5 effect spec → Compose

Hạng mục **Hiệu ứng**: hiện thực **đúng 5 spec motion** trong `05-effects/`, driven bởi **state Core** (không tự bịa luật), allocation-free, tách khỏi fixed-timestep. Đây là phần "juice" làm game đã tay — nhưng phải bám checklist chống giật.

**Design nguồn (mỗi file là spec có bảng token + sequence + gợi ý Compose):**
- `05-effects/01-drop-squash.md` · `02-gravity-rotate.md` · `03-line-clear.md` · `04-collapse-combo.md` · `05-particles-juice.md`
- `05-effects/effects.card.html` (demo động cả 4 — để so mắt)
- Token motion: `01-tokens/05-motion.css` (fast 150 / base 250 / medium 350 / slow 450; ease-out, ease-in, ease-inout, ease-jelly).

**Kotlin hiện có:** `game/.../BoardAnimator.kt`, `Anim.kt`, `ParticleSystem.kt`, `GameLoop.kt`, `EffectPreviews.kt`. Claude Code tự quyết refactor/dựng lại.

**Kiến trúc OO bắt buộc:**
- Một `EffectController` điều phối: nhận **sự kiện thay đổi state từ Core** (đặt mảnh, xóa dòng, xoay trọng lực, cascade) và lập lịch animation tương ứng; BoardCanvas đọc giá trị nội suy để vẽ.
- Animation **nội suy** tách khỏi mô phỏng: Core cho state rời rạc (trước/sau); EffectController lerp giữa hai mốc theo thời gian (`withFrameNanos`).
- `ParticlePool` cấp phát sẵn, tái dùng — KHÔNG new trong vòng vẽ/loop.
- Mọi thời lượng/easing từ token (thêm `GjMotion`/`GjEase` dịch từ `05-motion.css` nếu chưa có).
- Tôn trọng reduced-motion + Settings rung ở mọi prompt.

> Thứ tự đúng của một lượt: đặt mảnh → **(01) drop&squash** → kiểm dòng đầy → **(03) line-clear** → **(04) collapse&combo** (lặp cascade) ; xoay trọng lực → **(02) gravity-rotate** → có thể kéo theo 03/04. **(05)** là lớp dùng chung. **(06)** mắt sống theo tính cách màu là lớp idle phủ lên khi bàn yên giữa các lượt.

---

## Prompt 0 — Token motion + khung EffectController

```
Mục tiêu: nền tảng để 5 hiệu ứng cắm vào — token + controller + pipeline đọc-state.

Đọc trước: 01-tokens/05-motion.css; 05-effects/05-particles-juice.md; checklist chống giật (README).

Việc:
- Thêm token motion: GjMotion (fast=150, base=250, medium=350, slow=450 ms) + GjEase (inout, out, in, jelly = các cubic-bezier đúng số trong 05-motion.css) → AnimationSpec/Easing tái dùng.
- Tạo EffectController: API nhận sự kiện từ lớp gameplay (onPiecePlaced, onLinesCleared, onGravityRotated, onCascadeStep…) và giữ các animation đang chạy; cung cấp giá trị nội suy cho BoardCanvas (offset cụm, scale squash, clearProgress, danh sách particle sống).
- Vòng cập nhật bằng withFrameNanos (fixed-timestep cho sim nếu cần; render nội suy có easing), không cấp phát trong vòng.
- Tích hợp cờ reduced-motion + vibration (đọc từ Settings) như tham số toàn cục của controller.

Acceptance: controller biên dịch, BoardCanvas đọc được giá trị nội suy; chưa cần hiệu ứng cụ thể.
Kiểm chứng: build; @Preview/loop trống chạy 60fps không cấp phát (kiểm tra không new trong frame loop).
```

## Prompt 1 — Effect 01: Drop & Squash (mảnh/cụm rơi cứng + squash)

```
Mục tiêu: khớp 05-effects/01-drop-squash.md.

Đọc trước: 01-drop-squash.md (bảng + transform sequence + gợi ý Compose).

Việc:
- Khi đặt mảnh / cụm rơi: translate theo hướng trọng lực từ vị trí đầu tới điểm chạm, 250ms ease-in (tăng tốc).
- Khi chạm: squash scale(1.08, 0.86) 150ms ease-jelly → relax về (1,1) 150ms ease-out. CHỈ ô va chạm bị squash.
- Trục squash theo trọng lực (ngang khi gravity ngang). Mắt blink (open=false) trong khung squash rồi mở nhìn theo trọng lực.
- Drive qua tham số squash/clear của JellyBlockRenderer (file 01 / Prompt4). Haptic: tick nhẹ khi đặt (tôn trọng setting).

Acceptance: rơi + squash + relax đúng thời lượng/easing; chỉ ô va chạm squash; mắt blink đúng nhịp; allocation-free.
Kiểm chứng: cập nhật EffectPreviews cho drop&squash; so effects.card.html.
```

## Prompt 2 — Effect 02: Gravity Rotate (xoay trọng lực 90°)

```
Mục tiêu: khớp 05-effects/02-gravity-rotate.md.

Đọc trước: 02-gravity-rotate.md.

Việc:
- Khi xoay: lấy state Core SAU khi re-flow (vị trí nghỉ mới của mọi cụm non-stone) và lerp translate(x,y) từng cụm tới ô mới trong 350ms ease-inout — tất cả cụm di chuyển CÙNG nhau, mượt, không stagger. Stone KHÔNG di chuyển.
- Song song 350ms: con ngươi tween về vector trọng lực mới; mũi tên pill HUD quay 90° cùng chiều.
- Chu kỳ hướng: down → left → up → right. Sau khi cụm yên, nếu thành hàng/cột đầy → kích Effect 03 ngay.
- KHÔNG tự tính re-flow trong :game — lấy từ Core (deterministic). :game chỉ nội suy giữa state cũ/mới.

Acceptance: cụm trượt đồng loạt tới đúng ô Core tính; mắt + mũi tên xoay song song; stone đứng yên; nối tiếp 03 nếu có dòng đầy.
Kiểm chứng: EffectPreviews/loop xoay một bố cục mẫu; so card; xác nhận vị trí cuối == state Core.
```

## Prompt 3 — Effect 03: Line Clear (xóa hàng/cột + particle burst)

```
Mục tiêu: khớp 05-effects/03-line-clear.md.

Đọc trước: 03-line-clear.md; 05-particles-juice.md (burst).

Việc:
- Khi hàng/cột đầy (Core báo): mỗi khối theo trạng thái clearing — flash brightness(1.6) + ring shine 4dp (150ms ease-out) → pop scale(1.12) + alpha→0 (250ms ease-out).
- Particle: 4–6 chấm màu shine của khối, văng ~16dp, drift lệch trọng lực, fade 250ms ease-out — qua ParticlePool.
- Stagger ~20ms/khối dọc theo dòng (đọc thành "quét").
- Haptic: một tick (tôn trọng setting). Sau khi dòng trống → cụm rơi (Effect 04).
- Score float "+N" nổi lên ~20dp rồi mờ (từ 05-particles-juice).

Acceptance: flash→pop→vanish + burst + stagger + haptic + score float đúng spec; particle qua pool (không new trong vòng).
Kiểm chứng: EffectPreviews line-clear một hàng; so effects.card.html.
```

## Prompt 4 — Effect 04: Collapse & Combo (sụp cụm + combo dây chuyền)

```
Mục tiêu: khớp 05-effects/04-collapse-combo.md.

Đọc trước: 04-collapse-combo.md; ComboPopup (file 02 / Prompt6).

Việc:
- Sau khi line-clear làm trống ô: mọi cụm trôi tới ô nghỉ mới (Core tính) trong 350ms ease-inout.
- Re-check dòng (từ Core). Nếu có dòng mới đầy → combo += 1, bắn ComboPopup (×2, ×3…) trên gốc chuỗi, lặp về Effect 03.
- ComboPopup: scale 0.4→1.18→1.0, float lên ~26dp, fade (~900ms). Điểm tăng dần (animate số); combo thưởng bonus.
- Cap mỗi nhịp settle ≤ 450ms để combo dài vẫn nhanh. Vòng lặp dạng suspend: collapse() → detectLines() → if(any){combo++; showCombo; clear()} tới khi ổn định. Tất cả dữ liệu dòng/cụm LẤY TỪ Core.
- Combo ≥3: double-tick haptic (tôn trọng setting).

Acceptance: cascade lặp đúng, ComboPopup leo theo combo, settle ≤450ms/nhịp, điểm animate; trạng thái cuối == Core.
Kiểm chứng: EffectPreviews/loop dựng một combo 2–3 nhịp; so card.
```

## Prompt 5 — Effect 05: Particles & Juice (lớp dùng chung + haptics + reduced-motion)

```
Mục tiêu: chuẩn hoá lớp juice dùng chung khớp 05-effects/05-particles-juice.md.

Đọc trước: 05-particles-juice.md.

Việc:
- ParticleLayer trên bàn đọc một hàng đợi emitter ngắn hạn (burst, score float) — toàn bộ qua ParticlePool, lifetime ≤ 450ms, không che bàn lâu.
- Press/grab feedback toàn cục: Button nén (file 02) ; mảnh tray khi grab lift translateY(-6) + scale 1.04 ease-jelly.
- Haptics tập trung một chỗ (LocalHapticFeedback): đặt mảnh = tick nhẹ; xóa = tick vừa; combo≥3 = double — tất cả qua cờ vibration của Settings.
- Reduced-motion: bỏ particle + float, giữ chuyển state tức thời; mọi thời lượng trong 150–450ms, easing từ token.

Acceptance: particle/float/haptic thống nhất, tôn trọng vibration + reduced-motion; pool tái dùng (không rò cấp phát).
Kiểm chứng: bật reduced-motion thấy cắt particle nhưng state vẫn đúng; xác nhận pool không new trong vòng vẽ.
```

## Prompt 6 — Mắt sống theo TÍNH CÁCH màu (idle in-game) · ĐÃ hiện thực

```
Mục tiêu: khối đứng yên trên bàn không đông cứng nhìn trọng lực — mỗi MÀU một tính cách,
khối "sống" giữa các lượt. Tổ hợp ĐÚNG 6 expression của design (normal/front/happy/focus/smug/wink
+ blink) — KHÔNG bịa expression/hiệu ứng mới.

Đọc trước: 02-foundations/02-eyes/Eyes.jsx; 05-effects/effects.card.html (lấy timing thật).

Mapping 4 tính cách (do người chơi chốt):
- VÀNG — vui nhộn  : hay wink chào + thỉnh thoảng happy "^ ^".
- MINT — thư thái  : chớp mắt dày (double-blink nhiều), nhìn thẳng, liếc chậm theo hướng cardinal.
- HỒNG — tinh nghịch: wink + happy dày hơn vàng.
- XANH — nghiêm túc : thỉnh thoảng smug squint / focus reticle, ít chớp.

Quy tắc gravity↔tính cách (do người chơi chốt):
- Vừa có sự kiện (đặt/xoay/xóa) → settle=1: mắt nhìn theo trọng lực (giữ đúng design Eyes.jsx —
  "block nhìn về hướng nó sẽ đổ"). Giữ ~1.2s rồi ramp ~0.8s về 0: con ngươi trượt về giữa rồi
  tính cách tiếp quản. Sự kiện mới → snap lại nhìn trọng lực.
- Mỗi ô lệch pha deterministic theo (x,y,color) ⇒ không chớp/nháy đồng loạt; KHÔNG Random toàn cục.

Ràng buộc:
- Thời lượng hành vi lấy ĐÚNG effects.card.html (nhắm 130ms, wink 420ms, happy bob 700ms,
  glance ramp 320ms, double-blink). Chu kỳ idle 3–7s theo quy ước LivingJelly (số ở card là nhịp DEMO).
- Allocation-free: kết quả mắt ghi vào một EyeRender tái dùng; chỉ số học + hash trong vòng vẽ.
- Tắt/giảm không bắt buộc cho reduced-motion (chỉ chuyển con ngươi/mí, không particle) — nhưng có thể
  cân nhắc làm dịu nếu user thấy "đảo mắt" nhiều.

Hiện thực (game/): JellyPersonality.kt (EyeRender + resolveBoardEye, 4 tính cách),
BoardAnimator.settleFactor + lastEventNanos, drawJellyCell thêm param eyeOpen, BoardCanvas gọi
resolveBoardEye mỗi ô BLOCK. Preview/không-animator giữ settle=1 ⇒ y hệt bản cũ.

Acceptance: bàn yên ~1–2s thì mắt rời hướng trọng lực, sống theo đúng tính cách từng màu; có sự kiện
thì snap lại nhìn trọng lực; allocation-free; deterministic.
Kiểm chứng: build :app:installDebug; chơi thật, quan sát 4 màu sau khi đặt mảnh ~1–2s; tinh chỉnh
chu kỳ trong JellyPersonality.kt theo feedback (theo quy ước không tự mô phỏng chơi).
```
