# Prompts Map — theo từng World (Claude Design)

Bộ prompt thiết kế **màn hình bản đồ leo màn**, tách nhỏ để dễ chạy: một **index** + **mỗi world một file**, mỗi world chia **Phần 1 / Phần 2 / Chuyển cảnh** (≈5 node mỗi phần) để không bị "node quá dài".

> ⚠️ Claude Design **chỉ nhận đoạn prompt (text)** — không upload/đọc file. Nên **mỗi khối ``` trong các file này là một prompt TỰ ĐỦ** (đã nhúng sẵn dòng STYLE). Cách dùng = mở file → **copy nguyên khối ``` → dán thẳng** vào Claude Design. Các file `.md` chỉ để BẠN đọc/điều hướng, không phải để upload.

## Cách dùng

1. **Vẽ map theo world:** mở file world (vd `02-rung-ram.md`), copy từng khối — chạy lần lượt **Phần 1 → Phần 2 → Chuyển cảnh**. Xong world này sang file world kế.
2. (Làm 1 lần, khi cần) các **mẫu trạng thái dùng lại** ở `00-shared-index.md` mục B: node states, HUD, cổng khoá, thưởng sao, FTUE — cũng là các khối tự đủ, copy–dán.
3. Không cần "ghim" hay dán file context trước; mỗi prompt đã chứa STYLE riêng. (Nếu vẽ nhiều prompt liên tiếp trong CÙNG một chat Claude Design, nó vẫn nhớ ngữ cảnh — nhưng prompt vẫn tự đủ nếu sang chat mới.)

## Thứ tự & tiến độ

| File | World | Màn | Trạng thái |
|------|-------|-----|-----------|
| `01-dong-co.md` | Đồng cỏ | 1–10 | ✅ đã làm (tới 3.7) |
| `02-rung-ram.md` | Rừng rậm | 11–20 | ⏳ **đang ở đây** (đang chuyển cảnh sang 11) |
| `03-song-thac.md` | Sông & Thác | 21–30 | ☐ |
| `04-sa-mac.md` | Sa mạc | 31–40 | ☐ |
| `05-bai-bien.md` | Bãi biển | 41–50 | ☐ |
| `06-nui-tuyet.md` | Núi tuyết | 51–60 | ☐ |
| `07-hang-bang.md` | Hang băng | 61–70 | ☐ |
| `08-nui-lua.md` | Núi lửa | 71–80 | ☐ |
| `09-bau-troi.md` | Bầu trời | 81–90 | ☐ |
| `10-vu-tru.md` | Vũ trụ | 91–100 | ☐ (chứa luôn màn HẾT CHƯƠNG / end-of-content) |

## Quy ước chung

- Mỗi world đúng 10 màn; **breather = màn thứ 6**, **boss = màn thứ 10** của world.
- Mỗi artboard chỉ là **một viewport** của map cuộn dọc; đường/nền **chảy qua mép trên–dưới** để ghép liền mạch; HUD **dính** đè lên.
- Node = **JellyBlock có mắt**, tô **4 màu jelly luân phiên** (nhận diện thương hiệu — không đổi theo world). CTA luôn **cam #FF9F68**.
- Mỗi file world tự đủ; chỉ cần đã ghim `00-shared-index` trước.

> Ghi chú: số sao ở cổng trong các file world là **minh hoạ** (lấy theo data hiện tại). Số thật nên theo cấu hình gate ở `../level-design.md` (tránh để cao hơn sàn sao gây hard-block).
