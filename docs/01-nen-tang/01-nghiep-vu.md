# Business Understanding — Gravity Jelly

Tài liệu hiểu nghiệp vụ cho dự án game mobile. Mục tiêu: chốt vấn đề, định vị, mô hình nội dung, doanh thu và phạm vi trước khi vào GDD/kỹ thuật. Tên "Gravity Jelly" là tên tạm.

## 1. Tổng quan

- Tên (tạm): Gravity Jelly
- Thể loại: Puzzle casual (block-fit), một người, chơi offline
- Nền tảng: Android (Google Play). Chỉ làm Android, chưa nhắm iOS.
- Mô hình: Free-to-play, doanh thu từ quảng cáo (AdMob)
- Một câu định nghĩa: Đặt khối lấp hàng như block-fit, nhưng người chơi xoay được hướng trọng lực để dồn cả cụm khối đổ theo ý mình.

## 2. Vấn đề và cơ hội

Thị trường block-fit (Woodoku, Block Blast) rất đông và đang ăn khách, nhưng lõi "đặt mảnh - xóa hàng" thuần khá khô: niềm vui chủ yếu đến từ phản hồi hình ảnh/âm thanh, ít chiều sâu quyết định, các sản phẩm na ná nhau.

Cơ hội: thêm một cơ chế chữ ký đủ lạ để nhìn 3 giây là khác Woodoku, nhưng vẫn giữ tính casual dễ chơi để không kén người. Cơ chế đó là trọng lực do người chơi điều khiển.

## 3. Định vị và khác biệt (USP)

Điểm khác biệt cốt lõi, theo thứ tự quan trọng:

1. Trọng lực xoay được. Người chơi chạm để xoay hướng trọng lực 90 độ; toàn bộ khối trên bàn đổ lại theo hướng mới. Đây là cơ chế chữ ký, tạo khoảnh khắc "dồn rồi xoay cho đổ".
2. Vật lý theo cụm cứng. Các ô dính nhau rơi nguyên cụm, không tách. Vướng tường hay vướng cụm khác thì kẹt lại, để lại lỗ hổng. Nhờ đó cú xoay là con dao hai lưỡi (gom được hàng nhưng có thể tạo lỗ mới), tạo chiều sâu chiến thuật mà block-fit thường thiếu.
3. Nhân vật khối có mắt và số. Mỗi ô là một khối lập phương kiểu đồ chơi (viền dày, có chiều sâu), có mắt nhìn theo hướng trọng lực và một con số bằng kích thước cụm (số ô đang dính nhau). Vừa tạo cá tính thương hiệu, vừa nhắc người chơi trọng lực đang hướng nào và cụm to nhỏ ra sao. Lưu ý bản quyền: chỉ mượn phong cách khối-có-số nói chung, không sao chép thiết kế nhân vật của bất kỳ IP nào.

Định hướng thiết kế: "có chất riêng một chút" — chỉ cắm đúng một cơ chế chữ ký (trọng lực), không chồng thêm hệ thống thứ hai, để giữ tính casual và tránh phình phạm vi.

## 4. Đối tượng người chơi

- Người chơi casual Android, thích puzzle giải trí ngắn, chơi lẻ không cần mạng.
- Tệp 25–34 tuổi tại Việt Nam làm thị trường ban đầu, có thể mở rộng quốc tế do luật chơi không phụ thuộc ngôn ngữ.

## 5. Mục tiêu kinh doanh

- Ra mắt một sản phẩm free-to-play khả thi thương mại trên Android.
- Doanh thu chủ yếu từ AdMob.
- Tận dụng nội dung short-form (cú xoay đổ ập rất hợp clip) để kéo cài đặt với chi phí thấp.
- Giữ codebase native gọn, dễ maintain để rút ngắn thời gian ra mắt và phát triển lâu dài.

## 6. Cơ chế cốt lõi (tóm tắt cho nghiệp vụ)

Đủ để hiểu sản phẩm, chi tiết để dành cho GDD.

- Lưới 9x9. Khay phát 3 mảnh; đặt hết thì phát tiếp.
- Kéo mảnh chọn vị trí ngang; mảnh rơi cứng theo hướng trọng lực và dừng ở điểm chạm đầu tiên (không xuyên khe).
- Xóa khi đầy hàng hoặc đầy cột. Xóa xong, vùng nối liền tới chỗ vừa xóa sụp đổ theo trọng lực, có thể tạo dây chuyền.
- **Combo cộng dồn:** mỗi hàng/cột bị xóa cộng +1 vào combo (xóa 2 hàng cùng lúc = +2, dây chuyền cộng tiếp). Combo **giữ qua các nước** miễn nước nào cũng xóa được gì đó — 2 nước xóa liên tiếp ×2, 3 nước ×3… Combo chỉ **reset về 0 khi thả một mảnh mà không xóa được hàng/cột nào**; xoay trọng lực không xóa được gì thì combo vẫn giữ nguyên. Điểm mỗi lần xóa = số ô × số hàng/cột × bậc combo.
- Nút xoay trọng lực 90 độ làm cả bàn đổ lại theo hướng mới; đây là nguồn combo lớn nhất.
- **Combo hồi lượt xoay (CHỐT — áp dụng cho MỌI cách chơi):** số lần xoay là tài nguyên hữu hạn, nhưng combo lớn sẽ hồi lại. Mỗi lần **bậc combo tăng lên một mức ≥ x2** thì hồi **+1 lượt xoay**. Nghĩa là đạt x2 → +1, đạt x3 → tổng +2, x4 → tổng +3… (hồi cộng dồn = bậc combo − 1). Tạo vòng thưởng đúng cơ chế chữ ký: xoay giỏi → combo to → có thêm lượt xoay. Vì combo cộng dồn có thể cao, cân nhắc **trần hồi mỗi chặng** để không cho xoay vô hạn. Refund là hàm thuần của chuỗi combo nên không phá deterministic.
- Thua khi không còn mảnh nào đặt được (chồng khối bịt kín lối vào).

Đề xuất quan trọng: số lần xoay là tài nguyên hữu hạn theo chặng, không cho xoay vô hạn. Việc này vừa tăng độ khó (mỗi cú xoay phải tính toán), vừa làm hệ thống dễ kiểm soát và dễ tạo màn có lời giải.

## 7. Mô hình nội dung và độ khó

Hai mô hình loại trừ nhau ở điểm ngẫu nhiên; sản phẩm dùng dạng lai.

- Endless + thang khó (khung chính): không có màn rời rạc; độ khó tăng dần trong một run bằng ô đá cố định, giới hạn số lần xoay, pool mảnh khó hơn, mốc điểm. Phục vụ retention và quảng cáo. Game ngẫu nhiên nên không có "lời giải"; chất lượng được verify bằng mô phỏng bot greedy chạy nhiều nghìn run để đo tỉ lệ sống, điểm trung bình, độ căng.
- Màn thử thách deterministic (lớp chất riêng): bàn dựng sẵn, chuỗi mảnh cố định (bỏ ngẫu nhiên), mục tiêu rõ (dọn sạch / clear ô đích / đạt X điểm trong N nước) và giới hạn xoay. Vì deterministic nên giải được bằng search (BFS/IDA* có memo trên state = lưới + hướng trọng lực + mảnh còn lại). Solver dùng để xác nhận màn có nghiệm và chấm sao độ khó theo số nước tối thiểu. Sinh màn bằng generate-and-test offline (Python), đóng gói ra JSON.
- Daily seed: cùng chuỗi mảnh cho mọi người trong ngày, làm trục so tài offline; rất hợp short-form. Điều kiện: thay random bằng PRNG có seed; physics đã deterministic nên lưu seed là tái tạo y hệt.

## 8. Mô hình doanh thu

- Interstitial: theo sự kiện (ví dụ sau mỗi vài lần thua/chặng), có thời gian chờ tối thiểu và giai đoạn ân hạn cho người mới — tránh trigger theo bộ đếm thời gian thuần (đã rút kinh nghiệm từ dự án trước là bỏ sót doanh thu).
- Rewarded: hồi sinh một lần khi thua, nhân đôi điểm cuối run, thêm lượt xoay, hoặc reroll khay.
- Không bán vật phẩm ở MVP; cân nhắc gói gỡ quảng cáo sau.

## 9. Phạm vi

MVP:
- Lưới 9x9, đặt mảnh, xóa hàng/cột, vật lý cụm cứng, combo dây chuyền.
- Trọng lực xoay với số lần hữu hạn theo chặng.
- Chế độ Endless + thang khó.
- Art khối có mắt (mỗi ô một nhân vật, viền dày), phản hồi xóa (lóe sáng, nổ, rung nhẹ), âm thanh combo.
- AdMob: interstitial theo sự kiện + rewarded hồi sinh/x2.

Sau MVP:
- Daily seed + leaderboard offline.
- Tập màn thử thách deterministic sinh bằng solver.
- Lớp roguelite nhẹ (buff đều xoay quanh trọng lực) — đang để lại để cảm nhận lõi cho sạch.

Ngoài phạm vi (chủ ý): hệ thống thứ hai phức tạp (nhân vật, skill tree, tiền tệ kép), chơi online/PvP.

## 10. Kỹ thuật (tóm tắt)

- Nền tảng: Native Android, ngôn ngữ Kotlin. Không dùng Unity, không dùng Flutter (vì chỉ làm Android, ưu tiên codebase native gọn và dễ maintain).
- Hướng render và kiến trúc chi tiết: xem tài liệu 02-ky-thuat.md.
- Yêu cầu nền bắt buộc: lớp logic lõi thuần Kotlin, deterministic, RNG có seed cố định — để bật được Daily seed và solver/sinh màn offline sau này.
- Solver/sinh màn: chạy offline (headless trên JVM bằng chính lớp lõi, hoặc Python), xuất JSON nạp vào app.

## 11. Rủi ro và giả định

- Kẹt cụm có thể gây ức chế thay vì thử thách. Giảm thiểu: cho cụm nhỏ lách, cụm lớn kẹt, với luật rõ để người chơi đoán được.
- Combo sau xoay có thể hiếm vì lỗ hổng không tự lấp. Nếu vậy, đổi nguồn combo: thưởng theo "số lỗ được lấp nhờ một cú xoay" thay vì chỉ chuỗi clear liên tiếp.
- Không gian trạng thái của solver phình do trục trọng lực và physics cụm. Giảm thiểu: giới hạn lượt xoay, chuỗi mảnh ngắn cho màn thiết kế, cắt tỉa theo heuristic ít lỗ hổng.
- Thị trường block-fit rất đông. Khác biệt phải đến từ cơ chế xoay và chất nhân vật, không từ luật xóa hàng.
- Giả định: kéo được traffic ban đầu từ kênh nội dung short-form; cần kiểm chứng bằng vài clip thử.

## 12. Chỉ số thành công

- Retention D1 / D7.
- Thời lượng và số run mỗi phiên.
- Ad impressions mỗi phiên và tỉ lệ xem rewarded.
- Tỉ lệ người chơi chủ động dùng nút xoay (đo cơ chế chữ ký có thực sự được dùng hay bị bỏ quên).
- CTR/CVR của clip short-form về cú xoay.

## 13. Lộ trình sơ bộ

1. Hoàn thiện lõi cảm giác (đặt - xóa - sụp cụm - xoay - juice) trên prototype.
2. Cân chỉnh độ khó Endless bằng bot mô phỏng.
3. Tích hợp AdMob theo sự kiện + rewarded.
4. Soft launch Android, đo retention và hành vi dùng nút xoay.
5. Thêm Daily seed và tập màn thử thách sinh bằng solver.
6. Cân nhắc lớp roguelite nhẹ.
