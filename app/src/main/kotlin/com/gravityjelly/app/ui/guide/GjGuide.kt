package com.gravityjelly.app.ui.guide

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.components.ComboPopup
import com.gravityjelly.app.ui.components.GravityRotateButton
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjSpace

/**
 * Một mục hướng dẫn người chơi — luật chơi hoặc thành tựu cần giải thích MỘT lần.
 *
 * Đây là model CHUNG: vừa dùng cho popup dạy-lần-đầu ([GuideTeachDialog]), vừa làm
 * nguồn cho trang "Hướng dẫn / Đã đạt được" sau này (lặp [GjGuide.all]). Mỗi mục có
 * [id] bền (lưu vào `seenGuides` của DataStore để biết đã xem chưa).
 *
 * @param id      khoá bền, không đổi (vd "combo-refill").
 * @param icon    icon badge tiêu đề.
 * @param title   tiêu đề ngắn.
 * @param body    mô tả NGẮN, bôi đậm phần quan trọng ([AnnotatedString]).
 * @param demo    minh hoạ bằng hình thật của game (tuỳ chọn) hiện trên phần chữ.
 */
data class GjGuideEntry(
    val id: String,
    val icon: ImageVector,
    val title: String,
    val body: AnnotatedString,
    val demo: (@Composable () -> Unit)? = null,
)

/** Sổ tay hướng dẫn — nguồn sự thật cho popup dạy luật + trang review tương lai. */
object GjGuide {

    /** Combo ≥ ×2 hồi lượt xoay trọng lực (cơ chế chữ ký — xem [com.gravityjelly.core.ComboReward]). */
    val comboRefill = GjGuideEntry(
        id    = "combo-refill",
        icon  = GjIcons.RotateCw,
        title = "Combo hồi lượt xoay",
        body  = buildAnnotatedString {
            append("Xóa ")
            withStyle(SpanStyle(color = GjPalette.Primary, fontWeight = FontWeight.ExtraBold)) {
                append("combo ×2")
            }
            append(" trở lên\nđược ")
            withStyle(SpanStyle(color = GjPalette.Gravity, fontWeight = FontWeight.ExtraBold)) {
                append("+1 lượt xoay")
            }
            append(".\nCombo càng dài\nlượt hồi càng nhiều!")
        },
        demo  = { ComboRefillDemo() },
    )

    /** Mọi mục hướng dẫn, theo thứ tự hiển thị ở trang review. */
    val all: List<GjGuideEntry> = listOf(comboRefill)

    /** Tra mục theo [id] (null nếu không có). */
    fun byId(id: String): GjGuideEntry? = all.firstOrNull { it.id == id }
}

// ── minh hoạ (HÌNH THẬT của game) ───────────────────────────────────────────────

/**
 * Combo ×2 (popup ăn mừng thật) → nút xoò trọng lực thật được +1 lượt. Dùng đúng
 * [ComboPopup] và [GravityRotateButton] của game cho người chơi nhận ra ngay vật thật.
 */
@Composable
private fun ComboRefillDemo() {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(GjSpace.xs),
    ) {
        // popup combo ×2 thật (chỉ ×N + lời khen, bỏ mảnh rơi/đĩa cho gọn)
        ComboPopup(
            combo      = 2,
            showDish   = false,
            showPieces = false,
            heightDp   = 64.dp,
        )

        // mũi tên dẫn xuống phần thưởng (chevron xoay 90°)
        GjIcon(
            icon               = GjIcons.Chevron,
            contentDescription = null,
            modifier           = Modifier.size(22.dp).rotate(90f),
            tint               = GjPalette.Gravity,
        )

        // nút xoay trọng lực thật + "+1"
        Row(
            verticalAlignment     = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
        ) {
            GravityRotateButton(turnsLeft = 4, onRotate = {})
            Text(
                text  = "+1",
                style = MaterialTheme.typography.headlineLarge.copy(
                    color      = GjPalette.Gravity,
                    fontWeight = FontWeight.ExtraBold,
                    fontSize   = 30.sp,
                ),
            )
        }
    }
}
