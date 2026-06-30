package com.gravityjelly.app.ui.guide

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.components.GjDialog
import com.gravityjelly.app.ui.theme.GravityJellyTheme

/**
 * Popup dạy MỘT [GjGuideEntry] lần đầu người chơi gặp cơ chế đó. Bọc [GjDialog] chung:
 * icon + tiêu đề của mục, thân = [GuideCardContent], một nút "Đã hiểu" để xác nhận.
 *
 * Bắt buộc xác nhận ([dismissable] = false) → không lỡ đóng bằng cách chạm ra ngoài;
 * người gọi chịu trách nhiệm lưu [entry].id vào `seenGuides` trong [onDismiss].
 */
@Composable
fun GuideTeachDialog(
    entry: GjGuideEntry,
    open: Boolean,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier,
    confirmLabel: String = "Đã hiểu",
) {
    GjDialog(
        open        = open,
        title       = entry.title,
        icon        = entry.icon,
        dismissable = false,
        modifier    = modifier,
        content     = { GuideCardContent(entry) },
        actions     = {
            GjButton(
                onClick   = onDismiss,
                variant   = BtnVariant.Gravity,
                fullWidth = true,
            ) { Text(confirmLabel) }
        },
    )
}

// ── preview ───────────────────────────────────────────────────────────────────

@Preview(name = "GuideTeachDialog — combo refill", widthDp = 360, heightDp = 460)
@Composable
private fun GuideTeachDialogPreview() {
    GravityJellyTheme {
        Box(Modifier.fillMaxSize()) {
            GuideTeachDialog(entry = GjGuide.comboRefill, open = true, onDismiss = {})
        }
    }
}
