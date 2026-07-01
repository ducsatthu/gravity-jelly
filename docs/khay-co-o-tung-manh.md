# Khay 3 mảnh — cỡ ô tính riêng từng mảnh

**Ngày:** 2026-07-01
**File chạm:** `app/src/main/kotlin/com/gravityjelly/app/GameScreen.kt` (`GameTray`, `Piece.trayCellDp`)

## Vấn đề

Khay dưới màn chơi (`GameTray`) trước đây tính **một cỡ ô dùng chung** cho cả 3 giếng,
lấy theo mảnh có kích thước lớn nhất:

```kotlin
// CŨ
private fun List<Piece?>.trayCellDp(): Float {
    var maxDim = 1
    for (p in this) if (p != null) maxDim = maxOf(maxDim, p.shape.width, p.shape.height)
    return ((64f - (maxDim - 1) * 2f) / maxDim).coerceIn(12f, 22f)
}
```

Hệ quả: chỉ cần **một** mảnh dài/rộng (I4, I5, PLUS…) là `maxDim` toàn khay tăng, cỡ ô
chung nhỏ lại → **cả 3 mảnh** trong khay đều bị thu nhỏ, kể cả 2 mảnh bình thường.

## Quyết định

Tính cỡ ô **riêng cho từng mảnh** — mỗi mảnh tự quyết cỡ ô của nó theo chiều dài nhất
của chính nó. Mảnh bình thường giữ nguyên cỡ ô; chỉ mảnh dài/rộng hơn bình thường mới
thu nhỏ ô của riêng nó.

```kotlin
// MỚI
private fun Piece.trayCellDp(): Float {
    val maxDim = maxOf(shape.width, shape.height)
    return ((64f - (maxDim - 1) * 2f) / maxDim).coerceIn(12f, 22f)
}
```

`GameTray` gọi `piece.trayCellDp()` tại chỗ cho từng giếng thay vì tính một `cellDp`
chung cho cả `Row`.

## Không dịch chuyển layout

Vị trí và kích thước 3 giếng **không đổi**: mỗi giếng vẫn là `Box` `weight(1f)` +
`fillMaxHeight()`, `contentAlignment = Center`, mảnh vẽ trong `PieceThumbnail` canh giữa
giếng. Thay đổi chỉ nằm ở cỡ ô vẽ **bên trong** giếng, nên khay và các mảnh khác đứng yên.

## Lưu ý về design

Đây là chủ ý **đi ngược** spec gốc `04-screens` (`sharedCellSize` trong `Tray.jsx` muốn
cả khay đồng cỡ ô) theo yêu cầu người chơi: mảnh lớn không được ép hai mảnh còn lại co
theo. `GjTray` (`app/.../ui/components/GjTray.kt`) vẫn còn `sharedCellDp` dùng chung nhưng
hiện chỉ xuất hiện trong `@Preview`, không phải khay thật khi chơi — nếu sau này dùng lại
`GjTray` làm khay chính thì cần đồng bộ cùng cách tính riêng-từng-mảnh này.
