# Prompt cho Claude Design — Gravity Jelly

Copy toàn bộ phần dưới dán vào claude.ai/design.

---

Thiết kế giao diện cho một game puzzle casual Android tên **Gravity Jelly**, dựng các màn hình dưới dạng app mobile dọc, render bằng React để tôi xem và chốt thiết kế. Thiết kế này sẽ được convert sang Android (Jetpack Compose) nên cần gọn, dùng token màu/khoảng cách/bo góc/typography đặt tên rõ ràng, và ghi kích thước các thành phần chính bằng dp.

GAME LÀ GÌ: đặt khối lấp đầy hàng/cột trên lưới 9x9 kiểu block-fit, nhưng có cơ chế chữ ký là người chơi xoay được hướng trọng lực 90 độ để dồn cả cụm khối đổ theo hướng mới. Khối dính nhau rơi nguyên cụm. Xóa khi đầy một hàng hoặc một cột; xóa xong các cụm còn lại sụp theo trọng lực tạo combo dây chuyền. Thua khi không còn chỗ đặt mảnh. Số lần xoay trọng lực là hữu hạn theo chặng, hiển thị rõ trên HUD.

KHUNG MÁY: điện thoại Android dọc, baseline 360 × 800 dp, an toàn cho cả màn cao hơn. Mọi kích thước theo lưới bội số 4dp, vùng chạm tối thiểu 48dp.

PHONG CÁCH "JELLY PASTEL MỀM": nền kem sáng #FFF7EC, panel mềm bo góc lớn. Mỗi ô là một nhân vật "thạch" lập phương bo tròn, viền dày, bóng mềm, có đôi mắt nhìn theo hướng trọng lực và một con số bằng kích thước cụm. Bốn màu thạch: vàng #FFE3A3, mint #A3E5D9, hồng #F7A9C0, xanh #B3C7F7; ô đá cố định màu xám ấm trung tính. Tông dễ thương, casual, dịu mắt; font bo tròn, đậm vừa. Lưu ý: không sao chép thiết kế nhân vật của bất kỳ game nào khác, chỉ mượn phong cách khối-có-số nói chung.

CÁC MÀN CẦN THIẾT KẾ (làm theo thứ tự này, cho tôi xem từng màn để góp ý):

1) GAME (quan trọng nhất) — lưới 9x9 ở giữa với các khối thạch có mắt và số; HUD trên cùng cao 56dp hiển thị điểm hiện tại và nút tạm dừng; chỉ báo hướng trọng lực hiện tại; khay 3 mảnh ở dưới cao khoảng 96dp để kéo-thả đặt vào lưới; nút Xoay trọng lực hình tròn 64dp nổi ở góc phải khay kèm số lượt xoay còn lại. Gợi ý kích thước: ô lưới 36dp, khoảng cách giữa ô 2dp nên cả bàn khoảng 340dp (9×36 + 8×2), canh giữa, lề ngoài 10dp.

2) HOME — tên/logo game, nút Chơi (chế độ Endless) nổi bật cao 56dp bo góc 28dp, nút phụ Settings và Daily (làm mờ kèm nhãn "sắp có"), hiển thị điểm cao.

3) RESULT (màn kết thúc run) — điểm cuối và điểm cao; nút "Xem quảng cáo để x2 điểm" và nút "Hồi sinh" (gắn rewarded ad); nút Chơi lại và Về Home.

4) SETTINGS — bật/tắt âm thanh, nhạc, rung; chọn ngôn ngữ; mục thông tin.

HIỆU ỨNG CẦN THỂ HIỆN HOẶC MÔ TẢ (để chốt cảm giác chuyển động): mảnh rơi cứng theo hướng trọng lực, dừng ở điểm chạm đầu, squash nhẹ khi chạm; xoay trọng lực 90 độ làm cả bàn trượt mượt về vị trí mới và mắt khối xoay theo; xóa hàng/cột thì lóe sáng rồi khối nổ biến mất, có particle nhỏ và rung nhẹ; sụp cụm sau khi xóa tạo combo với popup combo (x2, x3...) bật lên rồi mờ dần. Mọi chuyển động dùng easing mượt ease-in-out, thời lượng ngắn 150–450ms.

ĐỂ DỄ CONVERT SANG COMPOSE: gom toàn bộ màu, spacing, bo góc, cỡ chữ thành design tokens đặt tên rõ ràng (ví dụ color/block-yellow, space/md, radius/lg, text/title); ghi kích thước thành phần chính bằng dp; layout dùng spacing theo lưới 4dp, không hardcode pixel lẻ. Giữ đúng một cơ chế chữ ký là trọng lực, không thêm hệ thống phụ phức tạp.

TỔ CHỨC FILE (bắt buộc tuân thủ để dễ đọc, dễ tìm, dễ update):
- Đặt tên folder và file có tiền tố số thứ tự 2 chữ số (01-, 02-, 03-...) theo đúng thứ tự đọc/phụ thuộc, để nhìn là biết ngay trình tự. Tên dùng kebab-case.
- Cấu trúc thư mục theo các nhóm đánh số sau:
  - 01-tokens/ → 01-colors, 02-typography, 03-spacing-radius, 04-dimensions (kích thước dp: ô lưới, bàn, khay, nút, HUD), 05-motion (duration + easing).
  - 02-foundations/ → khối jelly cơ bản, đôi mắt, atom dùng chung.
  - 03-components/ → 01-button, 02-hud, 03-tray, 04-gravity-rotate-button, 05-combo-popup, 06-dialog...
  - 04-screens/ → 01-game, 02-home, 03-result, 04-settings (đánh số theo độ ưu tiên/luồng chơi).
  - 05-effects/ → đặc tả từng hiệu ứng (rơi/squash, xoay trọng lực, xóa hàng, sụp cụm/combo, particle) kèm duration và easing.
- Tạo một file index ở gốc tên 00-index (00-index.md) làm mục lục: liệt kê mọi folder và file theo đúng thứ tự số, mỗi mục một dòng gồm số thứ tự, tên, mô tả ngắn một câu, và trạng thái (xong / đang làm / dự kiến).
- Mỗi lần thêm, đổi tên hay sửa file thì cập nhật ngay 00-index cho khớp; index luôn là nguồn tra cứu thứ tự duy nhất.
