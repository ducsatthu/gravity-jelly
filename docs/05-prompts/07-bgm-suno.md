# Prompt — Nhạc nền (BGM) cho Forest & Waterfall qua Suno

Cập nhật 21/07/2026.

Dùng để tạo 2 track nhạc nền còn thiếu trên **Suno** (suno.com). Track "Đồng cỏ ban mai"
(`bgm_world_1.mp3`) đã có — dùng làm tham chiếu tông cho 2 track mới.

---

## Thông số chung (áp dụng CẢ HAI track)

| Hạng mục | Giá trị |
|---|---|
| **Game** | Gravity Jelly — puzzle casual xếp khối, Android, offline, 1 người chơi |
| **Đối tượng** | Mọi lứa tuổi, chơi thư giãn |
| **Tông brand** | Ngọt ngào kiểu kẹo (candy-sweet), ấm áp, thân thiện, vui tươi. KHÔNG dark/epic/battle |
| **Dùng ở đâu** | Nhạc nền chạy xuyên suốt cả Home lẫn in-game (loop liên tục) |
| **Độ dài** | **60–90 giây** (Suno). Phải loop mượt — đầu và cuối khớp nhau không nghe giật |
| **Tempo** | 80–110 BPM (vừa phải, không gấp gáp, không buồn ngủ) |
| **Mixing** | Nhạc nền → EQ cắt low-end dưới 80 Hz, cắt high trên 12 kHz nhẹ; để SFX game (tiếng đặt khối, combo, xoay) luôn nổi lên trên. Không có vocal/lyrics |
| **Xuất** | MP3 320 kbps hoặc WAV → đổi tên theo quy ước: `bgm_world_2.mp3` / `bgm_world_3.mp3`, bỏ vào `app/src/main/res/raw/` |

---

## Track 1 — "Rừng thì thầm" (Forest Whisper)

**File:** `bgm_world_2.mp3`
**Cảnh:** Khu rừng — cây cổ thụ xanh rậm, ánh sáng lọt qua tán lá, lá bay nhẹ trong gió.
**Cảm xúc:** Bí ẩn nhẹ nhàng, tĩnh lặng thư thái, khám phá, an toàn — như ngồi dưới tán cây cổ thụ buổi chiều.

### Suno Prompt

```
A gentle, whimsical forest lullaby for a casual puzzle game. Soft marimba and 
wooden xylophone carry the melody over a bed of ambient rustling leaves and 
distant bird calls. Airy flute weaves in and out. Warm pad chords in the 
background. Cozy and magical, like sunlight filtering through a canopy. 
No vocals. Seamless loop.
```

### Suno Style Tags

```
lo-fi ambient, acoustic, marimba, nature sounds, whimsical, cozy, instrumental, 
game soundtrack, forest ambience, peaceful
```

### Tham khảo phong cách

- **Stardew Valley** — "Spring (The Valley Comes Alive)": marimba + guitar acoustic nhẹ nhàng
- **Animal Crossing** — "5 PM": giai điệu mộc mạc, xylophone, ukulele
- **Monument Valley** — ambient pad + glockenspiel, tối giản nhưng ấm

### Ghi chú cho Suno

- Nếu Suno tạo ra intro/build-up quá dài → dùng **Extend** rồi cắt lấy đoạn loop ổn định.
- Test loop: nối 3 bản liên tiếp trong Audacity, nghe chỗ nối — nếu giật thì cross-fade 2s ở đầu/cuối.
- **Không dùng** tiếng côn trùng to (dế, ve) — dễ gây khó chịu khi loop lâu.
- Giữ **đơn giản**: 2–3 nhạc cụ chủ đạo + pad nền. Quá nhiều layer sẽ cạnh tranh SFX game.

---

## Track 2 — "Thác ngọc bích" (Jade Cascade)

**File:** `bgm_world_3.mp3`
**Cảnh:** Thác nước — dòng nước trong xanh đổ xuống vách đá, bọt trắng, cầu vồng nhỏ trong sương.
**Cảm xúc:** Tươi mát, trong trẻo, thanh thoát, năng lượng nhẹ — như đứng trước thác nước buổi sáng, mát lạnh nhưng không lạnh lẽo.

### Suno Prompt

```
A sparkling, flowing instrumental piece for a casual puzzle game set near a 
waterfall. Gentle piano arpeggios cascade like water droplets over a soft 
synth pad. Subtle kalimba accents and light chimes add shimmer. Occasional 
deep, warm bass note anchors the harmony. Bright, refreshing, and dreamy. 
No vocals. Seamless loop.
```

### Suno Style Tags

```
ambient, piano, chillhop, kalimba, chimes, dreamy, sparkling, instrumental, 
game soundtrack, water ambience, peaceful, lo-fi
```

### Tham khảo phong cách

- **Ori and the Blind Forest** — "Naru, Embracing the Light": piano arpeggio + strings mềm, cảm xúc nhẹ
- **Alto's Odyssey** — nhạc nền flowing, synth pad + piano, tối giản nhưng đẹp
- **Zelda: Breath of the Wild** — "Hateno Village": piano thưa nhẹ, không gian thoáng

### Ghi chú cho Suno

- Arpeggio piano nên ở tầm **mid-high** (C4–C6) để gợi cảm giác nước chảy, không dùng bass piano nặng.
- Pad nền giữ **tông trưởng** (major) hoặc Lydian — tránh minor/dark.
- Chimes/bell nhỏ giọt (2–3 nốt mỗi 4 nhịp) làm accent, KHÔNG liên tục — tránh nhức đầu khi loop.
- Test volume: track này thường sáng hơn track rừng → cân lại volume để 3 track nghe cùng mức khi chuyển cảnh.

---

## So sánh 3 track (tông chung)

| Track | Cảnh | Nhạc cụ chính | Mood | Năng lượng |
|---|---|---|---|---|
| **Đồng cỏ ban mai** (đã có) | Đồng cỏ | Ukulele, glockenspiel, pad | Vui tươi, ấm áp | ★★☆ trung bình |
| **Rừng thì thầm** (mới) | Khu rừng | Marimba, flute, xylophone | Bí ẩn nhẹ, thư thái | ★★☆ trung bình–thấp |
| **Thác ngọc bích** (mới) | Thác nước | Piano arpeggio, kalimba, chimes | Tươi mát, trong trẻo | ★★★ trung bình–cao |

**Nguyên tắc:** cả 3 phải nghe như **cùng một game** — cùng tông ấm, cùng dải BPM, cùng mức phức tạp.
Track rừng hơi trầm hơn, track thác hơi sáng hơn, nhưng không ai vượt quá xa đồng cỏ.

---

## Sau khi có file

1. Đổi tên: `bgm_world_2.mp3`, `bgm_world_3.mp3`.
2. Bỏ vào `app/src/main/res/raw/`.
3. Cập nhật `Scene.kt`: thay `trackRes = R.raw.bgm_world_1` (TODO) bằng `R.raw.bgm_world_2` / `R.raw.bgm_world_3`.
4. Test trên máy: chuyển cảnh trong Tùy chỉnh, xác nhận đổi nhạc mượt + volume khớp.
5. Nghe ít nhất **5 phút liên tục** mỗi track khi chơi — nhạc nền dở chỉ lộ khi nghe lâu.

---

## Nhật ký thay đổi

- **21/07/2026** — Tạo tài liệu: prompt Suno cho BGM rừng + thác nước.
