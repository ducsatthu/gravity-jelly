# Kịch bản UI — Màn hình Map (Leo màn)

Thiết kế UI cho **màn hình bản đồ leo màn** của Gravity Jelly, bản **1.0.0**, phủ **100 màn đầu** (10 world × 10 màn). Đây là màn trung tâm của Campaign: nơi người chơi thấy tiến độ, chọn màn kế, và cảm nhận hành trình thiên nhiên trôi dần.

Phạm vi tài liệu: **chỉ màn hình map** (đường đi, node, cổng world, chuyển cảnh, header/HUD, scroll, FTUE, các trạng thái). Luồng trong màn chơi (dialog mục tiêu, thắng/thua, thưởng sao) nằm ở tài liệu khác.

Tham chiếu: `../02-thiet-ke-man/03-campaign-vo-han.md` (mô hình màn, gate sao, biome), `../06-du-lieu/02-he-level-vo-han.xlsx`. Sau màn 100, nội dung mở dần ở các bản sau — 1.0.0 chỉ cần 100 màn này hoàn chỉnh.

---

## 1. Mục tiêu thiết kế

- **Thấy ngay phải làm gì:** node kế tiếp luôn nổi bật, tự cuộn tới khi mở map.
- **Cảm giác tiến lên:** đi từ dưới lên, cảnh đổi dần theo world tạo cảm giác đi xa.
- **Phần thưởng cảm xúc:** mở world mới = đổi cảnh + animation, là lý do chơi tiếp ngoài sao.
- **Nhẹ và mượt:** map có thể dài; render phải bám checklist chống giật (mục 11).

## 2. Bố cục tổng thể

Màn hình chia 3 vùng cố định trên một nền cảnh cuộn:

```
┌───────────────────────────────┐
│  HEADER / HUD (cố định trên)  │  ← sao tổng · tên world · ⚙ settings
├───────────────────────────────┤
│                               │
│        VÙNG MAP (cuộn dọc)    │  ← đường đi + node + cổng world
│        nền cảnh parallax      │     + avatar người chơi
│                               │
├───────────────────────────────┤
│  FOOTER (cố định dưới, mỏng)  │  ← nút "CHƠI" tới node kế · (Daily sau)
└───────────────────────────────┘
```

- **Hướng cuộn:** dọc, **đi từ dưới lên** (màn 1 ở đáy, màn cao hơn ở trên — ẩn dụ "leo").
- **Header & footer** nổi cố định (sticky), nền hơi mờ/đổ bóng để tách khỏi map cuộn phía sau.
- **Footer** có một nút CTA chính "CHƠI" nhảy thẳng tới node kế tiếp — phòng khi người chơi cuộn đi xa và lạc.

## 3. Đường đi & cấu trúc map

- Một **đường mòn uốn lượn** nối các node theo thứ tự 1 → 100, đi zíc-zắc trái–phải để lấp chiều ngang màn hình và tạo nhịp.
- **10 world, mỗi world 10 node**; ranh giới world là một **cổng world** (mục 7).
- Mỗi **chương = world** trong 100 màn đầu (đơn giản hoá cho 1.0.0; mô hình chương 15-màn ở `../02-thiet-ke-man/03-campaign-vo-han.md` áp dụng cho giai đoạn vô hạn về sau).
- **Avatar người chơi** (một khối-có-mắt nhỏ) đứng tại node hiện tại; khi hoàn thành màn, avatar "nhảy" sang node kế.
- Đường nối giữa hai node: **đã đi** vẽ liền nét, sáng; **chưa tới** vẽ nét mờ/đứt.

## 4. Node — giải phẫu & loại

Mỗi node là một huy hiệu tròn trên đường đi, đường kính tối thiểu **64dp** (vùng chạm ≥ 48dp). Thành phần:

- **Số màn** ở giữa (vd "27").
- **Dải 3 sao** phía trên node nếu đã hoàn thành (0–3 sao sáng).
- **Viền/đế** đổi theo loại node và world.

Bốn loại node:

| Loại | Vị trí | Hình thức | Ghi chú |
|------|--------|-----------|---------|
| Thường | đa số | tròn chuẩn | màn tiêu chuẩn |
| Breather | màn thứ 6 mỗi world | tròn, tông nhạt, icon "lá/giọt" nhẹ | dễ thở, vẫn tính sao |
| Boss | màn thứ 10 mỗi world | to hơn ~1.3×, viền nổi bật, hào quang | đặt ngay trước cổng world |
| Cổng world | giữa 2 world | biểu tượng cổng/biển báo biome kế | mục 7 |

## 5. Trạng thái node

Mỗi node ở một trong ba trạng thái, phân biệt rõ bằng thị giác (không chỉ bằng màu — kèm icon/độ sáng cho dễ tiếp cận):

| Trạng thái | Hình thức | Tương tác |
|-----------|-----------|-----------|
| **Đã hoàn thành** | node sáng đầy màu world + hiện số sao đã đạt | chạm để **chơi lại** (cày 3★) |
| **Hiện tại / kế tiếp** | node sáng nhất, **nhịp đập** (pulse) + nhãn "CHƠI", có thể có mũi tên/hand FTUE | chạm để **vào màn** |
| **Khoá** | node xám, icon **ổ khoá**, không sao | chạm → lắc nhẹ + toast "Hoàn thành màn trước để mở" |

Quy tắc mở: tuyến tính — hoàn thành node `n` mở node `n+1`. Riêng qua **cổng world** cần thêm điều kiện sao (mục 7).

## 6. Header / HUD

Thanh trên cùng, gọn, đọc lướt được:

- **Trái:** cụm **★ tổng sao** đã thu / tổng tối đa hiện mở (vd "★ 142 / 210"). Chạm → tooltip hoặc trượt tới cổng world đang khoá gần nhất.
- **Giữa:** **tên world hiện tại** + số thứ tự ("World 4 · Sa mạc"). Đổi theo vùng map đang xem khi cuộn.
- **Phải:** nút **⚙ Settings**. (Chừa chỗ cho icon âm thanh / coin / Daily ở bản sau — bố cục đừng chật.)
- 1.0.0 **chưa cần hệ thống tim/mạng**; nếu thêm sau thì đặt cạnh sao bên trái.

HUD nền bán trong suốt, có đổ bóng dưới để tách khỏi map.

## 7. Cổng world & chuyển cảnh

Cổng world là điểm nhấn cảm xúc và là "van" tiến độ.

**Điều kiện mở:** mặc định 1.0.0 dùng **mở tuyến tính** (hoàn thành boss world trước là qua); tuỳ chọn thêm **tường sao nhẹ** không vượt sàn sao để tránh hard-block. Chi tiết và bảng số ở mục 12.

**Trạng thái cổng:**

- **Đủ sao:** cổng mở/sáng, có thể đi qua; lần đầu chạm tới → **cutscene chuyển cảnh ngắn** (1–2s): cảnh world cũ trôi xuống, world mới (biome + palette mới) hiện lên, banner "World 5 · Bãi biển".
- **Thiếu sao:** cổng khoá, hiện **"Cần thêm N★ để mở"** + thanh tiến độ sao. Chạm → gợi ý các màn gần đó còn thiếu sao (highlight node có thể cày).

**Chuyển cảnh nền:** nền parallax đổi biome dần khi cuộn qua ranh giới (blend mềm), không cắt cứng. Mỗi world một palette (theo `../02-thiet-ke-man/03-campaign-vo-han.md`): Đồng cỏ → Rừng → Sông → Sa mạc → Biển → Núi tuyết → Hang băng → Núi lửa → Bầu trời → Vũ trụ.

## 8. Camera & cuộn

- **Khi mở map:** tự cuộn (animate) tới **node hiện tại**, đặt nó ở khoảng 1/3 dưới màn hình để thấy đường phía trước.
- **Vừa thắng quay lại map:** camera dừng ở node vừa xong → phát animation **sao bay vào node** + **đường nối sáng dần** sang node kế → avatar nhảy sang → node kế bắt đầu pulse. (Đây là khoảnh khắc "đã").
- **Cuộn tự do:** người chơi xem trước/ôn lại; nút footer "CHƠI" luôn đưa về node kế.
- **Parallax:** nền 2–3 lớp trôi chậm hơn lớp đường đi tạo chiều sâu.
- Cận biên: chặn cuộn quá node 100 (mục 9) và quá màn 1.

## 9. Các trạng thái màn hình (screen states)

| Tình huống | Map thể hiện |
|-----------|--------------|
| **Lần đầu vào (người mới)** | cuộn ở đáy, chỉ node 1 pulse, FTUE hand chỉ vào node 1 (mục 10) |
| **Đang chơi dở** | tự cuộn tới node kế, thế giới đã mở hiện đầy đủ sao |
| **Vừa thắng** | animation thưởng sao + mở node kế (mục 8) |
| **Vừa qua cổng world** | cutscene chuyển cảnh + banner world mới |
| **Bị chặn ở cổng (thiếu sao)** | cổng khoá + CTA "cày sao", highlight màn nên cày lại |
| **Hết nội dung 1.0.0 (đã tới node 100)** | sau node 100 hiện bảng **"Hết chương — nội dung mới sắp ra mắt"** + (tuỳ chọn) nút tới Endless/Daily. KHÔNG hiện node khoá vô nghĩa kéo dài. |

## 10. FTUE trên map (chỉ phần map)

- **Lần đầu:** map mờ nền nhẹ, **hand pointer** nhịp vào node 1 + caption ngắn "Chạm để bắt đầu". Tắt ngay khi chạm.
- **Mở node thứ 2:** lần đầu thấy đường nối sáng + avatar nhảy → micro-caption "Hoàn thành để leo tiếp".
- **Tới cổng world đầu tiên:** lần đầu chạm cổng → caption giải thích gate sao một câu.
- Mọi coachmark **chỉ hiện một lần**, lưu cờ trong DataStore. Không lặp lại gây phiền.

## 11. Render & chống giật (ràng buộc kỹ thuật)

Map có thể dài 100+ node — phải tuân checklist ở `../01-nen-tang/02-ky-thuat.md`:

- **KHÔNG** dựng mỗi node bằng một Composable/View riêng. Vẽ đường đi + node bằng **một Canvas** (hoặc danh sách ảo hoá có tái dùng), node là sprite từ **atlas** nạp sẵn.
- Nền parallax là **bitmap/atlas nạp sẵn**, không decode trong lúc cuộn.
- **Không cấp phát trong vòng cuộn/vẽ**: tái dùng Paint/Path/mảng toạ độ; object pool cho particle sao.
- Toạ độ node **tính từ chỉ số màn** (đường cong tham số), không hard-code 100 vị trí.
- Cutscene chuyển cảnh: animation nội suy có easing, cap số particle.
- Vỏ map (HUD, dialog) bằng Compose; vùng map cuộn là Canvas/AndroidView trong cây Compose — state cuộn nằm ngoài recomposition mỗi frame.

## 12. Cấu hình mở khoá world cho 100 màn (1.0.0)

Mỗi màn tối đa 3★ → mỗi world tối đa 30★, toàn map tối đa 300★.

**Ràng buộc quan trọng — sàn sao:** map đi tuyến tính, nên khi tới cổng world `k` người chơi đã hoàn thành 10·(k−1) màn. Vì 1★ = hoàn thành, **sàn sao chắc chắn có = 10·(k−1)★** (chỉ qua màn, không cày). Mọi ngưỡng gate **vượt sàn này sẽ hard-block** người chơi tuyến tính, buộc họ cày lại — rủi ro churn sớm. Đây chính là lỗi của ý "gate 60%" trước đó: 60% của 30·(k−1) = 18·(k−1) > sàn 10·(k−1) → chặn cứng.

Hai phương án, chọn theo khẩu vị rủi ro của 1.0.0:

**Phương án A — Mở tuyến tính (khuyến nghị cho 1.0.0).** Cổng mở khi **hoàn thành boss của world trước** (tức đã xong 10 màn). Không có tường sao. An toàn nhất cho retention; sao chỉ để khoe và để cày 3★ tự nguyện.

**Phương án B — Có sức ép sao nhẹ.** Thêm tường sao **nhưng ≤ sàn** để không bao giờ hard-block, ví dụ yêu cầu ≈ **1.0–1.2★/màn** của các world trước (tức ~33–40%). Cổng "đủ điều kiện gần như luôn đạt" nhưng vẫn nhắc người chơi nhặt sao.

| Vào World | Cảnh nền | Sàn sao (1★ mỗi màn) | A: Mở tuyến tính | B: Tường sao nhẹ (~1.1★/màn) |
|:--:|------|:--:|:--:|:--:|
| 1 | Đồng cỏ | 0 | Mặc định | Mặc định |
| 2 | Rừng rậm | 10 | Xong boss W1 | 10★ |
| 3 | Sông & Thác | 20 | Xong boss W2 | 22★ |
| 4 | Sa mạc | 30 | Xong boss W3 | 33★ |
| 5 | Bãi biển | 40 | Xong boss W4 | 44★ |
| 6 | Núi tuyết | 50 | Xong boss W5 | 55★ |
| 7 | Hang băng | 60 | Xong boss W6 | 66★ |
| 8 | Núi lửa | 70 | Xong boss W7 | 77★ |
| 9 | Bầu trời | 80 | Xong boss W8 | 88★ |
| 10 | Vũ trụ | 90 | Xong boss W9 | 99★ |

Ở phương án B, cột "Tường sao" luôn ≥ sàn một chút (vd 22★ > sàn 20★) nên có thể tạm chặn người chơi **chỉ 1★ tuyệt đối**, nhưng chỉ cần vài màn 2★ là qua — đủ tạo động lực mà không khoá cứng. **Để gate cấu hình được, KHÔNG hard-code; tinh chỉnh sau soft-launch theo % người chơi kẹt ở mỗi cổng.**

## 13. Tài nguyên (asset) cần cho 1.0.0

- **Nền parallax × 10 biome** (mỗi biome 2–3 lớp). Tận dụng layout chung, đổi palette/asset.
- **Sprite node**: đế node (theo world hoặc tint chung), biến thể boss, breather, node khoá (ổ khoá), node hiện tại (hào quang/pulse).
- **Dải 3 sao** (rỗng/đầy) + particle sao bay.
- **Avatar người chơi** (khối-có-mắt nhỏ) + animation nhảy.
- **Cổng world** (mở/khoá) + banner tên world.
- **Đường đi**: texture đoạn đường đã đi / chưa đi.
- **Icon HUD**: sao, settings.
- **Coachmark**: hand pointer.

## 14. Tóm tắt luồng (1 câu)

Mở map → tự cuộn tới node kế đang pulse → chạm (hoặc nút CHƠI) vào màn → thắng → quay lại map thấy sao bay vào, đường sáng, avatar nhảy sang node mới → tới boss + cổng world đủ sao → cutscene đổi cảnh sang world kế… lặp tới node 100 → màn hình "hết chương, sắp có thêm".

---

*Bản 1.0.0 chỉ cần hoàn chỉnh 100 node + 10 cảnh + cơ chế gate ở trên. Map cuộn vô tận và sinh node theo tham số (cho giai đoạn vài nghìn màn) để dành các bản sau, nhưng UI nên dựng sẵn theo hướng "toạ độ node tính từ chỉ số màn" để không phải làm lại.*
