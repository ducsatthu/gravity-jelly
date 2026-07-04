package com.gravityjelly.app

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.data.GjSettings
import com.gravityjelly.app.i18n.AppLanguage
import com.gravityjelly.app.i18n.AppLocale
import com.gravityjelly.app.ui.components.BtnVariant
import com.gravityjelly.app.ui.components.GjButton
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.layout.GjScreenScaffold
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme

/**
 * Màn cài đặt — bám sát design system (settings-screen.jsx).
 *
 * Bố cục: header (Back + tiêu đề "Cài đặt"), rồi 3 nhóm thẻ Surface bo tròn:
 *  - ÂM THANH: toggle Âm thanh / Nhạc nền / Rung.
 *  - NGÔN NGỮ: segmented control vi/en (xem ghi chú về tính bền hoá trong thân hàm).
 *  - THÔNG TIN: các hàng tĩnh (phiên bản, đánh giá, chính sách).
 * Cuối màn có nút "Về Home" (Secondary).
 *
 * Trạng thái toggle đến từ [settings] (đọc Flow ở lớp shell). Bật/tắt ghi xuống
 * DataStore (bất đồng bộ) qua callback — luồng dữ liệu một chiều, Core không gọi ngược.
 *
 * Chữ ký public GIỮ NGUYÊN (MainActivity phụ thuộc); [onLanguage] là tham số optional
 * thêm mới có default rỗng.
 */
@Composable
fun SettingsScreen(
    settings: GjSettings,
    onSound: (Boolean) -> Unit,
    onMusic: (Boolean) -> Unit,
    onVibrate: (Boolean) -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
    onLanguage: (String) -> Unit = {},
) {
    // NGÔN NGỮ: nguồn sự thật là AppCompat per-app language (AppLocale). Đổi → tự bền hoá +
    // recreate Activity để áp ngay. State cục bộ chỉ để control phản hồi tức thì trước recreate.
    var language by remember { mutableStateOf(AppLocale.current().tag) }

    GjScreenScaffold(modifier = modifier, contentAlignment = Alignment.TopStart) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = GjSpace.sm, bottom = GjSpace.xl)
                .verticalScroll(rememberScrollState()),
        ) {
            // ── header ──────────────────────────────────────────────────────────
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(GjRadius.lg))
                        .pointerInput(Unit) { detectTapGestures(onTap = { onBack() }) },
                    contentAlignment = Alignment.Center,
                ) {
                    GjIcon(GjIcons.Back, contentDescription = stringResource(R.string.settings_back), tint = GjPalette.Text)
                }
                Text(
                    stringResource(R.string.settings_title),
                    style = MaterialTheme.typography.headlineLarge,
                    color = GjPalette.Text,
                )
            }

            Spacer(Modifier.height(GjSpace.md))

            // ── ÂM THANH ────────────────────────────────────────────────────────
            SettingGroup(title = stringResource(R.string.settings_section_audio)) {
                ToggleRow(GjIcons.Volume, stringResource(R.string.settings_sound), settings.sound, onSound)
                RowDivider()
                ToggleRow(GjIcons.Music, stringResource(R.string.settings_music), settings.music, onMusic)
                RowDivider()
                ToggleRow(GjIcons.Vibrate, stringResource(R.string.settings_vibrate), settings.vibrate, onVibrate)
            }

            // ── NGÔN NGỮ ────────────────────────────────────────────────────────
            SettingGroup(title = stringResource(R.string.settings_section_language)) {
                SettingRow(GjIcons.Globe, stringResource(R.string.settings_language)) {
                    LanguageSegmented(
                        value = language,
                        onChange = { code ->
                            language = code
                            AppLocale.set(AppLanguage.fromTag(code))
                            onLanguage(code)
                        },
                    )
                }
            }

            // ── THÔNG TIN ───────────────────────────────────────────────────────
            SettingGroup(title = stringResource(R.string.settings_section_info)) {
                SettingRow(GjIcons.Info, stringResource(R.string.settings_version)) {
                    Text(
                        "1.0.0",
                        style = MaterialTheme.typography.bodyLarge,
                        color = GjPalette.TextMuted,
                        fontWeight = FontWeight.Bold,
                    )
                }
                RowDivider()
                SettingRow(GjIcons.Heart, stringResource(R.string.settings_rate)) {
                    GjIcon(GjIcons.Chevron, modifier = Modifier.size(20.dp), tint = GjPalette.TextMuted)
                }
                RowDivider()
                SettingRow(GjIcons.Settings, stringResource(R.string.settings_privacy)) {
                    GjIcon(GjIcons.Chevron, modifier = Modifier.size(20.dp), tint = GjPalette.TextMuted)
                }
            }

            Spacer(Modifier.height(GjSpace.sm))

            GjButton(
                onClick = onBack,
                variant = BtnVariant.Secondary,
                icon = GjIcons.Home,
                fullWidth = true,
            ) { Text(stringResource(R.string.settings_home)) }
        }
    } // GjScreenScaffold
}

// ── group: nhãn nhỏ + thẻ Surface bo tròn chứa các hàng ─────────────────────────

@Composable
private fun SettingGroup(title: String, content: @Composable () -> Unit) {
    Column(modifier = Modifier.padding(bottom = GjSpace.lg)) {
        Text(
            title,
            // nhãn small-caps: 12sp bold, letter-spacing 0.04em ≈ 0.48sp (tracking-wide)
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.48.sp,
            ),
            color = GjPalette.TextMuted,
            modifier = Modifier.padding(start = GjSpace.sm, bottom = GjSpace.sm),
        )
        Surface(
            shape = RoundedCornerShape(GjRadius.lg),
            color = GjPalette.Surface,
            shadowElevation = 2.dp,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Column { content() }
        }
    }
}

// ── hàng cơ bản: icon chip trái + nhãn + control phải ───────────────────────────

@Composable
private fun SettingRow(
    icon: ImageVector,
    label: String,
    trailing: @Composable () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 56.dp)
            .padding(horizontal = GjSpace.lg, vertical = GjSpace.sm),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(GjSpace.md),
    ) {
        // icon chip 36dp, nền sunken
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(GjRadius.md))
                .background(GjPalette.SurfaceSunken),
            contentAlignment = Alignment.Center,
        ) {
            GjIcon(icon, modifier = Modifier.size(20.dp), tint = GjPalette.Text)
        }
        Text(
            label,
            style = MaterialTheme.typography.bodyLarge,
            color = GjPalette.Text,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.weight(1f),
        )
        trailing()
    }
}

// hàng toggle = hàng cơ bản với control phải là pill switch mềm
@Composable
private fun ToggleRow(
    icon: ImageVector,
    label: String,
    checked: Boolean,
    onChange: (Boolean) -> Unit,
) {
    SettingRow(icon, label) {
        SoftSwitch(checked = checked, onToggle = { onChange(!checked) })
    }
}

// đường kẻ ngăn giữa hai hàng (1.5dp, màu CellLine)
@Composable
private fun RowDivider() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 64.dp) // canh sau icon chip cho thẳng nhãn
            .height(1.5.dp)
            .background(GjPalette.CellLine),
    )
}

// ── SoftSwitch — pill toggle mềm (track 52×30, thumb 24) ────────────────────────
//   Bật: track Success; tắt: track be nhạt. Thumb trượt mượt (tween 180ms).

@Composable
private fun SoftSwitch(checked: Boolean, onToggle: () -> Unit) {
    val trackW = 52.dp
    val trackH = 30.dp
    val thumb = 24.dp
    val pad = 3.dp
    val thumbX by animateDpAsState(
        targetValue = if (checked) trackW - thumb - pad else pad,
        animationSpec = tween(durationMillis = 180),
        label = "softswitch_thumb",
    )
    Box(
        modifier = Modifier
            .width(trackW)
            .height(trackH)
            .clip(RoundedCornerShape(GjRadius.full))
            .background(if (checked) GjPalette.Success else GjPalette.SurfaceSunken)
            .pointerInput(Unit) { detectTapGestures(onTap = { onToggle() }) },
        contentAlignment = Alignment.CenterStart,
    ) {
        Box(
            modifier = Modifier
                .offset(x = thumbX)
                .size(thumb)
                .clip(RoundedCornerShape(GjRadius.full))
                .background(GjPalette.Surface),
        )
    }
}

// ── LanguageSegmented — segmented control vi/en (pill) ──────────────────────────
//   Khác design JSX (dropdown system/vi/en): theo yêu cầu Prompt 6 dùng segmented
//   vi/en cho gọn. Tô đậm ô đang chọn bằng nền Surface trên rãnh sunken.

@Composable
private fun LanguageSegmented(value: String, onChange: (String) -> Unit) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(GjRadius.full))
            .background(GjPalette.SurfaceSunken)
            .padding(3.dp),
        horizontalArrangement = Arrangement.spacedBy(2.dp),
    ) {
        SegmentChip("vi", "Tiếng Việt", value == "vi") { onChange("vi") }
        SegmentChip("en", "English", value == "en") { onChange("en") }
    }
}

@Composable
private fun SegmentChip(code: String, label: String, selected: Boolean, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(GjRadius.full))
            .background(if (selected) GjPalette.Surface else androidx.compose.ui.graphics.Color.Transparent)
            .pointerInput(code) { detectTapGestures(onTap = { onClick() }) }
            .padding(horizontal = GjSpace.md, vertical = 6.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            label,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = if (selected) GjPalette.Text else GjPalette.TextMuted,
        )
    }
}

// ── preview ─────────────────────────────────────────────────────────────────────

@Preview(name = "Settings — 360×800", widthDp = 360, heightDp = 800)
@Composable
private fun SettingsScreenPreview() {
    GravityJellyTheme {
        SettingsScreen(
            settings = GjSettings(sound = true, music = true, vibrate = false),
            onSound = {},
            onMusic = {},
            onVibrate = {},
            onBack = {},
        )
    }
}
