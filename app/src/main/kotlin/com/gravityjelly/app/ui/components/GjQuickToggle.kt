package com.gravityjelly.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.gravityjelly.app.R
import com.gravityjelly.app.audio.GjSfx
import com.gravityjelly.app.audio.LocalGjAudio
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace

// off-state fill riêng của quick-toggle — pause-screen.jsx QToggle: background '#EFE3CF'
private val QToggleOffBg = Color(0xFFEFE3CF)

/**
 * Toggle nhanh trong overlay Tạm dừng — bám `pause-screen.jsx` (component `QToggle`).
 *
 * Ô vuông cao 52dp, radius-lg (20dp). Khi [on]: nền surface-sunken, icon màu text, opacity 1.
 * Khi tắt: nền `#EFE3CF`, icon màu text-muted, opacity 0.7, và một **gạch chéo** 2×26dp xoay 45°
 * (báo trạng thái tắt) — đúng như design vẽ.
 *
 * [label] chỉ dùng cho a11y (contentDescription).
 */
@Composable
fun GjQuickToggle(
    icon: ImageVector,
    label: String,
    on: Boolean,
    onToggle: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val audio = LocalGjAudio.current
    val tint = if (on) GjPalette.Text else GjPalette.TextMuted
    Box(
        modifier = modifier
            .height(52.dp)
            .clip(RoundedCornerShape(GjRadius.lg))
            .background(if (on) GjPalette.SurfaceSunken else QToggleOffBg)
            .alpha(if (on) 1f else 0.7f)
            .clickable(
                onClick           = {
                    audio?.play(if (on) GjSfx.SFX_TOGGLE_OFF else GjSfx.SFX_TOGGLE_ON)
                    onToggle()
                },
                interactionSource = remember { MutableInteractionSource() },
                indication        = null,
            ),
        contentAlignment = Alignment.Center,
    ) {
        GjIcon(
            icon               = icon,
            contentDescription = label,
            modifier           = Modifier.size(22.dp),
            tint               = tint,
        )
        // gạch chéo "tắt" — 2×26dp, xoay 45°, bo nhẹ (design: rotate(45deg), borderRadius 2)
        if (!on) {
            Box(
                modifier = Modifier
                    .graphicsLayer { rotationZ = 45f }
                    .size(width = 2.dp, height = 26.dp)
                    .clip(RoundedCornerShape(1.dp))
                    .background(GjPalette.TextMuted),
            )
        }
    }
}

/**
 * Hàng hai toggle nhanh Âm thanh · Nhạc trong overlay Tạm dừng — bám hàng đầu của `actions`
 * trong `pause-screen.jsx` (gap space-sm, mỗi ô flex:1).
 */
@Composable
fun GjPauseToggleRow(
    sound: Boolean,
    music: Boolean,
    onSound: (Boolean) -> Unit,
    onMusic: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier              = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
    ) {
        GjQuickToggle(GjIcons.Volume, stringResource(R.string.quicktoggle_sound), sound, { onSound(!sound) }, Modifier.weight(1f))
        GjQuickToggle(GjIcons.Music,  stringResource(R.string.quicktoggle_music), music, { onMusic(!music) }, Modifier.weight(1f))
    }
}
