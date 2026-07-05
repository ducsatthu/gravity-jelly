package com.gravityjelly.app.ui.guide

import androidx.annotation.StringRes
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
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.R
import com.gravityjelly.app.ui.components.BossCard
import com.gravityjelly.app.ui.components.BossKind
import com.gravityjelly.app.ui.components.ComboPopup
import com.gravityjelly.app.ui.components.GravityRotateButton
import com.gravityjelly.core.BossTell
import com.gravityjelly.core.BossTellKind
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.game.GameMechanic

/**
 * Nhóm cẩm nang (gom mục ở màn Cẩm nang). Nhãn hiển thị đa ngôn ngữ ở [GuideGroup.displayLabel]
 * (CamNangParts.kt); màu nhấn icon-chip theo nhóm ở [tint] (bám cam-nang-screen.jsx).
 */
enum class GuideGroup {
    BASIC,
    SUPER,
    BLAST,
    COMBO,
    FOREST,
    RIVER,
    BOSS,
}

/**
 * Một mục hướng dẫn người chơi — luật chơi hoặc thành tựu cần giải thích MỘT lần.
 *
 * Đây là model CHUNG: vừa dùng cho popup dạy-lần-đầu ([GuideTeachDialog]), vừa làm
 * nguồn cho trang Cẩm nang ([com.gravityjelly.app.CamNangScreen] lặp [GjGuide.all]). Mỗi mục có
 * [id] bền (lưu vào `seenGuides` của DataStore để biết đã xem chưa).
 *
 * Text ĐA NGÔN NGỮ: [titleRes]/[descRes]/[bodyRes] là khoá `values(-en)/strings.xml`; resolve qua các
 * extension @Composable [title]/[desc]/[body]. [bodyRes] dùng markup màu (xem [guideBody]).
 *
 * @param id       khoá bền, không đổi (vd "combo-refill").
 * @param icon     icon badge tiêu đề.
 * @param group    nhóm hiển thị ở Cẩm nang.
 * @param titleRes tiêu đề ngắn.
 * @param descRes  mô tả MỘT DÒNG cho hàng trong list Cẩm nang.
 * @param bodyRes  mô tả popup (markup màu → [AnnotatedString]).
 * @param demo     minh hoạ bằng hình thật của game (tuỳ chọn) hiện trên phần chữ.
 */
data class GjGuideEntry(
    val id: String,
    val icon: ImageVector,
    val group: GuideGroup,
    @StringRes val titleRes: Int,
    @StringRes val descRes: Int,
    @StringRes val bodyRes: Int,
    val demo: (@Composable () -> Unit)? = null,
)

/** Tiêu đề mục (đa ngôn ngữ). */
val GjGuideEntry.title: String
    @Composable get() = stringResource(titleRes)

/** Mô tả một dòng (đa ngôn ngữ). */
val GjGuideEntry.desc: String
    @Composable get() = stringResource(descRes)

/** Thân popup dạng [AnnotatedString] (markup màu, đa ngôn ngữ). */
val GjGuideEntry.body: AnnotatedString
    @Composable get() = guideBody(bodyRes)

/** Sổ tay hướng dẫn — nguồn sự thật cho popup dạy luật + trang Cẩm nang. */
object GjGuide {

    /** Combo ≥ ×2 hồi lượt xoay trọng lực (cơ chế chữ ký — xem [com.gravityjelly.core.ComboReward]). */
    val comboRefill = GjGuideEntry(
        id = "combo-refill", icon = GjIcons.RotateCw, group = GuideGroup.COMBO,
        titleRes = R.string.guide_combo_refill_title,
        descRes = R.string.guide_combo_refill_desc,
        bodyRes = R.string.guide_combo_refill_body,
        demo = { ComboRefillDemo() },
    )

    // ── Luật nền: xóa hàng / cột (cùng một luật) ─────────────────────────────────
    val clearLine = GjGuideEntry(
        id = "clear-line", icon = GjIcons.Check, group = GuideGroup.BASIC,
        titleRes = R.string.guide_clear_line_title,
        descRes = R.string.guide_clear_line_desc,
        bodyRes = R.string.guide_clear_line_body,
        demo = { ClearLineDemo() },
    )

    // ── Cơ chế chữ ký: xoay trọng lực (giới thiệu nút xoay + D-Pad) ──────────────
    val gravityRotate = GjGuideEntry(
        id = "gravity-rotate", icon = GjIcons.Rotate, group = GuideGroup.BASIC,
        titleRes = R.string.guide_gravity_rotate_title,
        descRes = R.string.guide_gravity_rotate_desc,
        bodyRes = R.string.guide_gravity_rotate_body,
        demo = { GravityRotateDemo() },
    )

    // ── Trọng lực: rơi sau khi xóa · thạch dính cụm ──────────────────────────────
    val gravityDrop = GjGuideEntry(
        id = "gravity-drop", icon = GjIcons.Chevron, group = GuideGroup.BASIC,
        titleRes = R.string.guide_gravity_drop_title,
        descRes = R.string.guide_gravity_drop_desc,
        bodyRes = R.string.guide_gravity_drop_body,
        demo = { GravityDropDemo() },
    )
    val stickyCluster = GjGuideEntry(
        id = "sticky-cluster", icon = GjIcons.Heart, group = GuideGroup.BASIC,
        titleRes = R.string.guide_sticky_cluster_title,
        descRes = R.string.guide_sticky_cluster_desc,
        bodyRes = R.string.guide_sticky_cluster_body,
        demo = { StickyClusterDemo() },
    )

    // ── Hợp nhất: siêu khối / cầu vồng ───────────────────────────────────────────
    val formSuper1 = GjGuideEntry(
        id = "form-super1", icon = GjIcons.Star, group = GuideGroup.SUPER,
        titleRes = R.string.guide_form_super1_title,
        descRes = R.string.guide_form_super1_desc,
        bodyRes = R.string.guide_form_super1_body,
        demo = { FormSuper1Demo() },
    )
    val formRainbow = GjGuideEntry(
        id = "form-rainbow", icon = GjIcons.Heart, group = GuideGroup.SUPER,
        titleRes = R.string.guide_form_rainbow_title,
        descRes = R.string.guide_form_rainbow_desc,
        bodyRes = R.string.guide_form_rainbow_body,
        demo = { FormRainbowDemo() },
    )
    val formSuper2 = GjGuideEntry(
        id = "form-super2", icon = GjIcons.Trophy, group = GuideGroup.SUPER,
        titleRes = R.string.guide_form_super2_title,
        descRes = R.string.guide_form_super2_desc,
        bodyRes = R.string.guide_form_super2_body,
        demo = { FormSuper2Demo() },
    )
    val formRainbow2 = GjGuideEntry(
        id = "form-rainbow2", icon = GjIcons.Trophy, group = GuideGroup.SUPER,
        titleRes = R.string.guide_form_rainbow2_title,
        descRes = R.string.guide_form_rainbow2_desc,
        bodyRes = R.string.guide_form_rainbow2_body,
        demo = { FormRainbow2Demo() },
    )

    // ── Giải phóng (kích hoạt siêu khối / cầu vồng) ──────────────────────────────
    val detonateSuper1 = GjGuideEntry(
        id = "detonate-super1", icon = GjIcons.Star, group = GuideGroup.BLAST,
        titleRes = R.string.guide_detonate_super1_title,
        descRes = R.string.guide_detonate_super1_desc,
        bodyRes = R.string.guide_detonate_super1_body,
        demo = { DetonateSuper1Demo() },
    )
    val detonateSuper2 = GjGuideEntry(
        id = "detonate-super2", icon = GjIcons.Trophy, group = GuideGroup.BLAST,
        titleRes = R.string.guide_detonate_super2_title,
        descRes = R.string.guide_detonate_super2_desc,
        bodyRes = R.string.guide_detonate_super2_body,
        demo = { DetonateSuper2Demo() },
    )
    val detonateRainbow1 = GjGuideEntry(
        id = "detonate-rainbow1", icon = GjIcons.Heart, group = GuideGroup.BLAST,
        titleRes = R.string.guide_detonate_rainbow1_title,
        descRes = R.string.guide_detonate_rainbow1_desc,
        bodyRes = R.string.guide_detonate_rainbow1_body,
        demo = { DetonateRainbow1Demo() },
    )
    val detonateRainbow2 = GjGuideEntry(
        id = "detonate-rainbow2", icon = GjIcons.Trophy, group = GuideGroup.BLAST,
        titleRes = R.string.guide_detonate_rainbow2_title,
        descRes = R.string.guide_detonate_rainbow2_desc,
        bodyRes = R.string.guide_detonate_rainbow2_body,
        demo = { DetonateRainbow2Demo() },
    )

    // ── Rừng rậm: dây leo + rác (World 2) — 5 mục riêng biệt ───────────────────────
    val vineIntro = GjGuideEntry(
        id = "vine-intro", icon = GjIcons.Heart, group = GuideGroup.FOREST,
        titleRes = R.string.guide_vine_intro_title,
        descRes = R.string.guide_vine_intro_desc,
        bodyRes = R.string.guide_vine_intro_body,
        demo = { VineIntroDemo() },
    )
    val vineDestroy = GjGuideEntry(
        id = "vine-destroy", icon = GjIcons.Star, group = GuideGroup.FOREST,
        titleRes = R.string.guide_vine_destroy_title,
        descRes = R.string.guide_vine_destroy_desc,
        bodyRes = R.string.guide_vine_destroy_body,
        demo = { VineDestroyDemo() },
    )
    val vineSticky = GjGuideEntry(
        id = "vine-sticky", icon = GjIcons.Heart, group = GuideGroup.FOREST,
        titleRes = R.string.guide_vine_sticky_title,
        descRes = R.string.guide_vine_sticky_desc,
        bodyRes = R.string.guide_vine_sticky_body,
        demo = { VineStickyDemo() },
    )
    val vineToTrash = GjGuideEntry(
        id = "vine-to-trash", icon = GjIcons.Heart, group = GuideGroup.FOREST,
        titleRes = R.string.guide_vine_to_trash_title,
        descRes = R.string.guide_vine_to_trash_desc,
        bodyRes = R.string.guide_vine_to_trash_body,
        demo = { VineToTrashDemo() },
    )
    val trashDestroy = GjGuideEntry(
        id = "trash-destroy", icon = GjIcons.Star, group = GuideGroup.FOREST,
        titleRes = R.string.guide_trash_destroy_title,
        descRes = R.string.guide_trash_destroy_desc,
        bodyRes = R.string.guide_trash_destroy_body,
        demo = { TrashDestroyDemo() },
    )

    // ── Sông & Thác: Dòng chảy (World 3) — 3 mục: dòng chảy · trôi theo dòng · phá nguồn ─────
    val waterFlow = GjGuideEntry(
        id = "water-flow", icon = GjIcons.Star, group = GuideGroup.RIVER,
        titleRes = R.string.guide_water_flow_title,
        descRes = R.string.guide_water_flow_desc,
        bodyRes = R.string.guide_water_flow_body,
        demo = { WaterFlowDemo() },
    )
    val waterDrift = GjGuideEntry(
        id = "water-drift", icon = GjIcons.Chevron, group = GuideGroup.RIVER,
        titleRes = R.string.guide_water_drift_title,
        descRes = R.string.guide_water_drift_desc,
        bodyRes = R.string.guide_water_drift_body,
        demo = { WaterDriftDemo() },
    )
    val waterBreak = GjGuideEntry(
        id = "water-break", icon = GjIcons.Check, group = GuideGroup.RIVER,
        titleRes = R.string.guide_water_break_title,
        descRes = R.string.guide_water_break_desc,
        bodyRes = R.string.guide_water_break_body,
        demo = { WaterBreakDemo() },
    )

    // ── Đấu trùm: cuối mỗi thế giới (World 1/2/3) — 1 mục nền + 3 mục theo trùm ─────
    /** Nền: mọi trùm có Khiên, phá bằng combo ≥ ×2 (bậc − 1 sát thương). Mở rộng khi thêm World mới. */
    val bossBasic = GjGuideEntry(
        id = "boss-basic", icon = GjIcons.Trophy, group = GuideGroup.BOSS,
        titleRes = R.string.guide_boss_basic_title,
        descRes = R.string.guide_boss_basic_desc,
        bodyRes = R.string.guide_boss_basic_body,
        demo = { BossBasicDemo() },
    )
    /** Trùm W1 "Chú Sâu Đồng Cỏ" — combo thuần, 5 Khiên, không chiêu phụ. */
    val bossWorm = GjGuideEntry(
        id = "boss-worm", icon = GjIcons.Star, group = GuideGroup.BOSS,
        titleRes = R.string.guide_boss_worm_title,
        descRes = R.string.guide_boss_worm_desc,
        bodyRes = R.string.guide_boss_worm_body,
        demo = { BossWormDemo() },
    )
    /** Trùm W2 "Thần Rừng" — 8 Khiên, mọc thêm gốc dây mỗi 4 lượt (tell "Mọc dây"). */
    val bossForest = GjGuideEntry(
        id = "boss-forest", icon = GjIcons.Heart, group = GuideGroup.BOSS,
        titleRes = R.string.guide_boss_forest_title,
        descRes = R.string.guide_boss_forest_desc,
        bodyRes = R.string.guide_boss_forest_body,
        demo = { BossForestDemo() },
    )
    /** Trùm W3 "Thần Thác" — combo phá 11 Khiên; nước là chướng ngại, mỗi 3 lượt hồi/thả nguồn (tối đa 4). */
    val bossWater = GjGuideEntry(
        id = "boss-water", icon = GjIcons.Check, group = GuideGroup.BOSS,
        titleRes = R.string.guide_boss_water_title,
        descRes = R.string.guide_boss_water_desc,
        bodyRes = R.string.guide_boss_water_body,
        demo = { BossWaterDemo() },
    )

    /** Mọi mục hướng dẫn, theo thứ tự hiển thị ở trang review (cẩm nang). */
    val all: List<GjGuideEntry> = listOf(
        gravityRotate,
        clearLine,
        gravityDrop, stickyCluster,
        formSuper1, formRainbow, formSuper2, formRainbow2,
        detonateSuper1, detonateSuper2, detonateRainbow1, detonateRainbow2,
        comboRefill,
        vineIntro, vineDestroy, vineSticky, vineToTrash, trashDestroy,
        waterFlow, waterDrift, waterBreak,
        bossBasic, bossWorm, bossForest, bossWater,
    )

    /** Tra mục theo [id] (null nếu không có). */
    fun byId(id: String): GjGuideEntry? = all.firstOrNull { it.id == id }

    /**
     * Map cơ chế GẶP-LẦN-ĐẦU (từ [com.gravityjelly.game.EndlessGameHolder.guideQueue]) sang mục dạy luật.
     * Combo-hồi-lượt-xoay KHÔNG ở đây — nó có path trigger riêng (xem EndlessPlayScreen).
     */
    fun forMechanic(m: GameMechanic): GjGuideEntry = when (m) {
        GameMechanic.GRAVITY_ROTATE -> gravityRotate
        GameMechanic.CLEAR_LINE -> clearLine
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

/** Màu nhấn icon-chip theo nhóm ở màn Cẩm nang (bám TINT của cam-nang-screen.jsx). */
val GuideGroup.tint: Color
    get() = when (this) {
        GuideGroup.BASIC -> GjPalette.Text
        GuideGroup.SUPER -> GjPalette.Warning
        GuideGroup.BLAST -> GjPalette.Primary
        GuideGroup.COMBO -> GjPalette.Gravity
        GuideGroup.FOREST -> GjPalette.Success
        GuideGroup.RIVER -> GjPalette.Info
        GuideGroup.BOSS -> GjPalette.Gravity
    }

// ── Rich-text đa ngôn ngữ: markup màu trong resource ───────────────────────────
//   Cú pháp trong strings.xml: [p]…[/p] Primary · [g]…[/g] Gravity · [w]…[/w] Warning ·
//   [s]…[/s] Success. `\n` xuống dòng. Chữ ở resource (dịch được), MÀU/CẤU TRÚC ở code.

private fun guideAccent(tag: Char): Color? = when (tag) {
    'p' -> GjPalette.Primary
    'g' -> GjPalette.Gravity
    'w' -> GjPalette.Warning
    's' -> GjPalette.Success
    else -> null
}

/** Dựng [AnnotatedString] từ resource [res] có markup màu (xem cú pháp ở trên). */
@Composable
fun guideBody(@StringRes res: Int): AnnotatedString {
    val raw = stringResource(res)
    return buildAnnotatedString {
        var i = 0
        while (i < raw.length) {
            val open = raw.indexOf('[', i)
            if (open < 0) { append(raw.substring(i)); break }
            if (open > i) append(raw.substring(i, open))
            val close = raw.indexOf(']', open)
            val tag = if (close > open) raw.substring(open + 1, close) else ""
            val color = if (tag.length == 1) guideAccent(tag[0]) else null
            if (color != null) {
                val endTag = "[/$tag]"
                val end = raw.indexOf(endTag, close + 1)
                if (end >= 0) {
                    withStyle(SpanStyle(color = color, fontWeight = FontWeight.ExtraBold)) {
                        append(raw.substring(close + 1, end))
                    }
                    i = end + endTag.length
                    continue
                }
            }
            // Không phải tag hợp lệ → giữ nguyên ký tự '['
            append(raw.substring(open, (if (close >= 0) close + 1 else raw.length)))
            i = if (close >= 0) close + 1 else raw.length
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
            Text(stringResource(R.string.guide_demo_rotate_button), style = MaterialTheme.typography.labelSmall, color = GjPalette.TextMuted)
        }
        GjIcon(GjIcons.Chevron, contentDescription = null, modifier = Modifier.size(20.dp), tint = GjPalette.Gravity)
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(GjSpace.xs),
        ) {
            GravityDpad(direction = Direction.RIGHT)
            Text(stringResource(R.string.guide_demo_dpad), style = MaterialTheme.typography.labelSmall, color = GjPalette.TextMuted)
        }
    }
}

/**
 * Combo ×2 (popup ăn mừng thật) → nút xoay trọng lực thật được +1 lượt. Dùng đúng
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

// ── Đấu trùm: minh hoạ bằng chính thẻ [BossCard] thật của màn boss ────────────────
//   Dùng đúng component in-game (mascot + thanh Khiên + chip luật/cảnh-báo) để người
//   chơi nhận ra ngay thứ họ sẽ gặp. Số liệu khớp CampaignLevels (bossHP 5/8/11, đều combo phá Khiên).

/** Nền: thẻ trùm W1 đang vỡ Khiên (3/5) — dạy khái niệm Khiên chung. */
@Composable
private fun BossBasicDemo() {
    BossCard(
        level = 10, name = stringResource(R.string.boss_name_worm), kind = BossKind.WORM,
        shieldCurrent = 3, shieldTarget = 5,
    )
}

/** Trùm W1 "Chú Sâu Đồng Cỏ" — chip luật "Combo ×2 phá khiên", không tell. */
@Composable
private fun BossWormDemo() {
    BossCard(
        level = 10, name = stringResource(R.string.boss_name_worm), kind = BossKind.WORM,
        shieldCurrent = 4, shieldTarget = 5,
    )
}

/** Trùm W2 "Thần Rừng" — chip CẢNH BÁO "Mọc dây" (sau 2 lượt). */
@Composable
private fun BossForestDemo() {
    BossCard(
        level = 20, name = stringResource(R.string.boss_name_forest), kind = BossKind.FOREST,
        shieldCurrent = 6, shieldTarget = 8,
        tell = BossTell(BossTellKind.VINE_SPAWN, turnsUntil = 2),
    )
}

/** Trùm W3 "Thần Thác" — combo phá 11 Khiên; chip CẢNH BÁO "Hồi nguồn" (mỗi 3 lượt). */
@Composable
private fun BossWaterDemo() {
    BossCard(
        level = 30, name = stringResource(R.string.boss_name_water), kind = BossKind.WATER,
        shieldCurrent = 8, shieldTarget = 11,
        tell = BossTell(BossTellKind.SOURCE_REVIVE, turnsUntil = 3),
    )
}
