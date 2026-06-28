# 04 · Hub — Home & điều hướng (app shell)

Hạng mục **Hub**: màn Home (trung tâm khởi đầu) + **vỏ điều hướng** nối các màn Home → Game → Result → Settings (và Level-Map sau này). Đây là nơi người chơi vào game; phải khớp `home-screen.jsx` và luồng click-through `index.html`.

**Design nguồn:**
- `04-screens/home-screen.jsx` (logo jelly + wordmark, chip kỷ lục, Play/Settings/Daily) + `screen-2-home.card.html`
- `04-screens/index.html` (click-through Home→Game→Result→Settings — tham chiếu luồng)
- (Sau MVP) `04-screens/level-map.jsx` + `map-*` — chỉ để hook chỗ, chưa làm.

**Kotlin hiện có:** `app/.../HomeScreen.kt`, `MainActivity.kt`. Claude Code tự quyết refactor/dựng lại.

**Nguyên tắc OO:** một bộ điều hướng (sealed route + NavHost hoặc state machine) + mỗi màn nhận callback rõ ràng; Home không tự biết Game render thế nào.

---

## Prompt 1 — Logo + Home screen

```
Mục tiêu: màn Home khớp 04-screens/home-screen.jsx.

Đọc trước: home-screen.jsx (Logo: 4 khối jelly nghiêng + wordmark "GRAVITY/JELLY" pink có candy edge; chip "KỶ LỤC"; nút "CHƠI · ENDLESS" + "Cài đặt" + "Daily"); screen-2-home.card.html.

Việc:
- Logo: hàng 4 JellyBlock (pink/yellow/mint/blue) kích thước ~52dp, nghiêng nhẹ + hướng mắt khác nhau như JSX; wordmark "GRAVITY" (muted, tracking rộng) trên "JELLY" (Fredoka extra, pink fill + edge stroke + text-shadow candy).
- Chip kỷ lục: Icon trophy + "KỶ LỤC" + số VN, nền surface bo full, shadow sm.
- Actions: Button primary cta "CHƠI · ENDLESS" (icon play, fullWidth) → onPlay; hàng dưới "Cài đặt" (secondary, settings) + "Daily" (secondary, star, comingSoon) → onSettings/onDaily.
- Dùng Button/Icon/JellyBlock đã có (file 01–02). Bố cục dọc: chip trên, logo giữa (flex), actions dưới; padding xl.

Acceptance: Home khớp screen-2-home.card.html về logo, chip, 3 nút + copy; Daily ở trạng thái "SẮP CÓ" nếu chưa có.
Kiểm chứng: @Preview HomeScreen; so card.
```

## Prompt 2 — App shell + điều hướng giữa các màn

```
Mục tiêu: vỏ điều hướng nối Home ↔ Game ↔ Result ↔ Settings đúng luồng index.html.

Đọc trước: 04-screens/index.html (thứ tự click-through); MainActivity.kt hiện có.

Việc:
- Định nghĩa route kiểu sealed (Home, Game, Result, Settings; chừa chỗ LevelMap). Một bộ điều hướng (Navigation-Compose NavHost hoặc state machine gọn) trong :app — KHÔNG để màn này gọi trực tiếp màn kia.
- Luồng: Home --Play--> Game; Game --thua--> Result (overlay/route); Result --Chơi lại--> Game, --Home--> Home; Home/Game --pause/settings--> Settings --back--> nguồn.
- Mỗi màn chỉ nhận callback điều hướng (onPlay/onHome…); state chơi sống ở holder của Game, không rơi khi mở Dialog pause.

Acceptance: bấm xuyên suốt Home→Game→Result→Settings và quay lại đúng như index.html; back hệ thống xử lý hợp lý.
Kiểm chứng: chạy app (assembleDebug + thử trên thiết bị/emulator) đi hết vòng; mô tả các chặng.
```

## Prompt 3 — Chuyển cảnh giữa màn (transition mềm)

```
Mục tiêu: chuyển màn mượt theo tông design (ngắn, mềm 150–450ms), không giật.

Đọc trước: 01-tokens/05-motion.css (durations + ease); readme.md (Animation: 150–450ms).

Việc:
- Thêm transition vào điều hướng: fade/scale nhẹ (ease-out vào, ease-in ra) trong khoảng motion-base/medium. Home→Game có thể nhấn nhá nhẹ logo; Game→Result đưa Dialog game-over spring-in (ease-jelly).
- Không transition nặng/dài; tôn trọng reduced-motion (cắt còn cross-fade tối giản hoặc tức thời).

Acceptance: chuyển màn mượt, đúng thời lượng token, không khựng khung; reduced-motion gọn lại.
Kiểm chứng: chạy đi vài vòng; xác nhận thời lượng + không drop frame rõ rệt.
```
