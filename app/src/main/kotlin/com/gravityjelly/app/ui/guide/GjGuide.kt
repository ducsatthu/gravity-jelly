package com.gravityjelly.app.ui.guide

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import com.gravityjelly.app.GravityDpad
import com.gravityjelly.core.Direction
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
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
import com.gravityjelly.game.GameMechanic

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

    // ── Luật nền: xóa hàng / cột ─────────────────────────────────────────────────
    val clearRow = GjGuideEntry(
        id = "clear-row", icon = GjIcons.Check, title = "Xóa hàng",
        body = body("Lấp đầy ", "MỘT HÀNG" to GjPalette.Primary, " ngang\n(9 ô bất kỳ màu)\n→ cả hàng ", "biến mất" to GjPalette.Gravity, "\nvà được tính điểm."),
        demo = { ClearRowDemo() },
    )
    val clearColumn = GjGuideEntry(
        id = "clear-column", icon = GjIcons.Check, title = "Xóa cột",
        body = body("Lấp đầy ", "MỘT CỘT" to GjPalette.Primary, " dọc\n(9 ô bất kỳ màu)\n→ cả cột ", "biến mất" to GjPalette.Gravity, "\nvà được tính điểm."),
        demo = { ClearColumnDemo() },
    )

    // ── Cơ chế chữ ký: xoay trọng lực (giới thiệu nút xoay + D-Pad) ──────────────
    val gravityRotate = GjGuideEntry(
        id = "gravity-rotate", icon = GjIcons.Rotate, title = "Xoay trọng lực",
        body = body("Nhấn ", "nút xoay" to GjPalette.Gravity, " để đổi\nhướng trọng lực 90°.\n", "D-Pad" to GjPalette.Primary, " hiện hướng hiện tại\n— cả cụm khối đổ theo!"),
        demo = { GravityRotateDemo() },
    )

    // ── Trọng lực: rơi sau khi xóa · thạch dính cụm ──────────────────────────────
    val gravityDrop = GjGuideEntry(
        id = "gravity-drop", icon = GjIcons.Chevron, title = "Trọng lực rơi",
        body = body("Sau khi xóa, các khối\nphía trên ", "RƠI XUỐNG" to GjPalette.Gravity, "\n— dừng lại ngay khi\ngặp ", "khối khác / đáy" to GjPalette.Primary, "."),
        demo = { GravityDropDemo() },
    )
    val stickyCluster = GjGuideEntry(
        id = "sticky-cluster", icon = GjIcons.Heart, title = "Thạch dính",
        body = body("Thạch ", "CÙNG MÀU" to GjPalette.Primary, " chạm nhau\nthì DÍNH thành một khối.\nMột thạch bị chặn\n→ ", "cả khối dừng lại" to GjPalette.Gravity, "!"),
        demo = { StickyClusterDemo() },
    )

    // ── Hợp nhất: siêu khối / cầu vồng ───────────────────────────────────────────
    val formSuper1 = GjGuideEntry(
        id = "form-super1", icon = GjIcons.Star, title = "Siêu khối",
        body = body("Lấp đầy 1 hàng, 1 cột,\nhoặc khối 3×3 ", "CÙNG MÀU" to GjPalette.Primary, "\n→ tạo một ", "SIÊU KHỐI" to GjPalette.Gravity, "\nsáng lấp lánh!"),
        demo = { FormSuper1Demo() },
    )
    val formRainbow = GjGuideEntry(
        id = "form-rainbow", icon = GjIcons.Heart, title = "Khối cầu vồng",
        body = body("Xếp 3×3 đủ ", "BA MÀU" to GjPalette.Primary, "\n(mỗi màu một hàng/cột)\n→ tạo ", "KHỐI CẦU VỒNG" to GjPalette.Gravity, "."),
        demo = { FormRainbowDemo() },
    )
    val formSuper2 = GjGuideEntry(
        id = "form-super2", icon = GjIcons.Trophy, title = "Siêu khối cấp 2",
        body = body("Ghép hai siêu khối\n", "CÙNG MÀU" to GjPalette.Primary, " dính nhau\n→ lên ", "SIÊU KHỐI CẤP 2" to GjPalette.Gravity, "\nmạnh hơn nhiều!"),
        demo = { FormSuper2Demo() },
    )
    val formRainbow2 = GjGuideEntry(
        id = "form-rainbow2", icon = GjIcons.Trophy, title = "Cầu vồng siêu cấp",
        body = body("Ghép hai kíp nổ\n", "KHÁC MÀU" to GjPalette.Primary, " dính nhau\n→ ", "CẦU VỒNG SIÊU CẤP" to GjPalette.Gravity, "\nđội vương miện!"),
        demo = { FormRainbow2Demo() },
    )

    // ── Kích nổ ──────────────────────────────────────────────────────────────────
    val detonateSuper1 = GjGuideEntry(
        id = "detonate-super1", icon = GjIcons.Star, title = "Nổ siêu khối",
        body = body("Cuốn siêu khối vào\nmột hàng/cột bị xóa\n→ nổ quét sạch ", "MỌI Ô CÙNG MÀU" to GjPalette.Gravity, "\ntrên toàn bàn!"),
        demo = { DetonateSuper1Demo() },
    )
    val detonateSuper2 = GjGuideEntry(
        id = "detonate-super2", icon = GjIcons.Trophy, title = "Nổ siêu khối cấp 2",
        body = body("Siêu khối cấp 2 nổ:\nquét sạch cùng màu\n+ cả ", "vùng 5×5" to GjPalette.Gravity, "\nquanh tâm!"),
        demo = { DetonateSuper2Demo() },
    )
    val detonateRainbow1 = GjGuideEntry(
        id = "detonate-rainbow1", icon = GjIcons.Heart, title = "Nổ cầu vồng",
        body = body("Cầu vồng nổ:\nquét sạch mọi ô thuộc\n", "các MÀU đang KỀ" to GjPalette.Gravity, " nó."),
        demo = { DetonateRainbow1Demo() },
    )
    val detonateRainbow2 = GjGuideEntry(
        id = "detonate-rainbow2", icon = GjIcons.Trophy, title = "Nổ cầu vồng siêu cấp",
        body = body("Kỹ năng tối thượng:\ncầu vồng siêu cấp nổ\n→ ", "XÓA SẠCH TOÀN BÀN" to GjPalette.Gravity, "\n(kể cả đá)!"),
        demo = { DetonateRainbow2Demo() },
    )

    /** Mọi mục hướng dẫn, theo thứ tự hiển thị ở trang review (cẩm nang). */
    val all: List<GjGuideEntry> = listOf(
        gravityRotate,
        clearRow, clearColumn,
        gravityDrop, stickyCluster,
        formSuper1, formRainbow, formSuper2, formRainbow2,
        detonateSuper1, detonateSuper2, detonateRainbow1, detonateRainbow2,
        comboRefill,
    )

    /** Tra mục theo [id] (null nếu không có). */
    fun byId(id: String): GjGuideEntry? = all.firstOrNull { it.id == id }

    /**
     * Map cơ chế GẶP-LẦN-ĐẦU (từ [com.gravityjelly.game.EndlessGameHolder.guideQueue]) sang mục dạy luật.
     * Combo-hồi-lượt-xoay KHÔNG ở đây — nó có path trigger riêng (xem EndlessPlayScreen).
     */
    fun forMechanic(m: GameMechanic): GjGuideEntry = when (m) {
        GameMechanic.GRAVITY_ROTATE -> gravityRotate
        GameMechanic.CLEAR_ROW -> clearRow
        GameMechanic.CLEAR_COLUMN -> clearColumn
        GameMechanic.GRAVITY_DROP -> gravityDrop
        GameMechanic.STICKY_CLUSTER -> stickyCluster
        GameMechanic.FORM_SUPER1 -> formSuper1
        GameMechanic.FORM_RAINBOW -> formRainbow
        GameMechanic.FORM_SUPER2 -> formSuper2
        GameMechanic.FORM_RAINBOW2 -> formRainbow2
        GameMechanic.DETONATE_SUPER1 -> detonateSuper1
        GameMechanic.DETONATE_SUPER2 -> detonateSuper2
        GameMechanic.DETONATE_RAINBOW1 -> detonateRainbow1
        GameMechanic.DETONATE_RAINBOW2 -> detonateRainbow2
    }
}

/** Dựng [AnnotatedString]: chuỗi [String] giữ nguyên, hoặc `text to color` để bôi đậm phần nhấn. */
private fun body(vararg parts: Any): AnnotatedString = buildAnnotatedString {
    for (p in parts) when (p) {
        is String -> append(p)
        is Pair<*, *> -> withStyle(SpanStyle(color = p.second as Color, fontWeight = FontWeight.ExtraBold)) {
            append(p.first as String)
        }
    }
}

// ── minh hoạ (HÌNH THẬT của game) ───────────────────────────────────────────────

/**
 * Giới thiệu hai điều khiển THẬT của màn chơi: [GravityRotateButton] (FAB xoay) + [GravityDpad]
 * (chỉ-thị hướng). Dùng đúng component game để người chơi nhận ra ngay trên HUD.
 */
@Composable
private fun GravityRotateDemo() {
    Row(
        verticalAlignment     = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(GjSpace.lg),
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(GjSpace.xs),
        ) {
            GravityRotateButton(turnsLeft = 3, onRotate = {})
            Text("Nút xoay", style = MaterialTheme.typography.labelSmall, color = GjPalette.TextMuted)
        }
        GjIcon(GjIcons.Chevron, contentDescription = null, modifier = Modifier.size(20.dp), tint = GjPalette.Gravity)
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(GjSpace.xs),
        ) {
            GravityDpad(direction = Direction.RIGHT)
            Text("D-Pad: hướng", style = MaterialTheme.typography.labelSmall, color = GjPalette.TextMuted)
        }
    }
}

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
