package com.gravityjelly.app.ui.icons

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.addPathNodes
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

// ── private helpers ───────────────────────────────────────────────────────────

// SVG <rect x l y t width w height h rx r> → path string (rounded rect)
private fun rrectPath(l: Float, t: Float, r: Float, b: Float, rx: Float): String {
    val x0 = l + rx; val x1 = r - rx; val y0 = t + rx; val y1 = b - rx
    return "M $x0 $t H $x1 Q $r $t $r $y0 V $y1 Q $r $b $x1 $b H $x0 Q $l $b $l $y1 V $y0 Q $l $t $x0 $t Z"
}

// SVG <circle cx cy r> → two-semicircle path string
private fun circlePath(cx: Float, cy: Float, r: Float): String {
    val right = cx + r; val left = cx - r
    return "M $right $cy A $r $r 0 1 0 $left $cy A $r $r 0 1 0 $right $cy"
}

// Build a 24×24 stroke-only ImageVector from one or more SVG path strings
private fun strokeIcon(vararg pathData: String): ImageVector {
    val builder = ImageVector.Builder(
        defaultWidth   = 24.dp,
        defaultHeight  = 24.dp,
        viewportWidth  = 24f,
        viewportHeight = 24f,
    )
    for (d in pathData) {
        builder.addPath(
            pathData        = addPathNodes(d),
            fill            = null,
            stroke          = SolidColor(Color.Black),
            strokeLineWidth = 2f,
            strokeLineCap   = StrokeCap.Round,
            strokeLineJoin  = StrokeJoin.Round,
        )
    }
    return builder.build()
}

// ── GjIcons ───────────────────────────────────────────────────────────────────

/**
 * Gravity Jelly icon set — 21 glyphs, Lucide-style (24×24, 2px round stroke, fill=none).
 * Vẽ inline bằng [ImageVector] + [addPathNodes]; không kéo thư viện Lucide.
 */
object GjIcons {

    val Pause: ImageVector by lazy {
        strokeIcon(
            rrectPath(6f, 5f, 10f, 19f, 1.5f),
            rrectPath(14f, 5f, 18f, 19f, 1.5f),
        )
    }

    val Play: ImageVector by lazy {
        strokeIcon("M7 5l12 7-12 7V5z")
    }

    val Settings: ImageVector by lazy {
        strokeIcon(
            circlePath(12f, 12f, 3f),
            "M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1",
        )
    }

    val Rotate: ImageVector by lazy {
        strokeIcon(
            "M3 12a9 9 0 1 0 3-6.7",
            "M3 4v4h4",
        )
    }

    val RotateCw: ImageVector by lazy {
        strokeIcon(
            "M21 12a9 9 0 1 1-3-6.7",
            "M21 4v4h-4",
        )
    }

    val Volume: ImageVector by lazy {
        strokeIcon(
            "M5 9v6h4l5 4V5L9 9H5z",
            "M16 8.5a4 4 0 0 1 0 7M18.5 6a7 7 0 0 1 0 12",
        )
    }

    val Mute: ImageVector by lazy {
        strokeIcon(
            "M5 9v6h4l5 4V5L9 9H5z",
            "M21 9l-6 6M15 9l6 6",
        )
    }

    val Music: ImageVector by lazy {
        strokeIcon(
            "M9 18V5l11-2v13",
            circlePath(6f, 18f, 3f),
            circlePath(17f, 16f, 3f),
        )
    }

    val Vibrate: ImageVector by lazy {
        strokeIcon(
            rrectPath(9f, 4f, 15f, 20f, 2f),
            "M4 9v6M20 9v6",
        )
    }

    val Globe: ImageVector by lazy {
        strokeIcon(
            circlePath(12f, 12f, 9f),
            "M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18",
        )
    }

    val Info: ImageVector by lazy {
        strokeIcon(
            circlePath(12f, 12f, 9f),
            "M12 11v5M12 8h.01",
        )
    }

    val Close: ImageVector by lazy {
        strokeIcon("M6 6l12 12M18 6L6 18")
    }

    val Back: ImageVector by lazy {
        strokeIcon("M15 5l-7 7 7 7")
    }

    val Home: ImageVector by lazy {
        strokeIcon(
            "M4 11l8-7 8 7",
            "M6 10v9h12v-9",
        )
    }

    val Refresh: ImageVector by lazy {
        strokeIcon(
            "M4 12a8 8 0 0 1 13.6-5.7L20 8",
            "M20 4v4h-4",
            "M20 12a8 8 0 0 1-13.6 5.7L4 16",
            "M4 20v-4h4",
        )
    }

    val Heart: ImageVector by lazy {
        strokeIcon("M12 20s-7-4.7-9.3-9C1.2 8.3 2.6 5 5.8 5 8 5 9.4 6.6 12 9c2.6-2.4 4-4 6.2-4 3.2 0 4.6 3.3 3.1 6-2.3 4.3-9.3 9-9.3 9z")
    }

    val Star: ImageVector by lazy {
        strokeIcon("M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z")
    }

    val Trophy: ImageVector by lazy {
        strokeIcon(
            "M7 4h10v5a5 5 0 0 1-10 0V4z",
            "M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M10 20v-3M14 20v-3",
        )
    }

    val X2: ImageVector by lazy {
        strokeIcon(
            "M4 8l5 8M9 8l-5 8",
            "M14 9a2 2 0 1 1 4 0c0 2-4 3.5-4 7h4",
        )
    }

    val Chevron: ImageVector by lazy {
        strokeIcon("M9 6l6 6-6 6")
    }

    val Check: ImageVector by lazy {
        strokeIcon("M5 12.5l4 4L19 7")
    }
}

// ── composable ────────────────────────────────────────────────────────────────

/**
 * Hiển thị một glyph từ [GjIcons]. Mặc định 24dp × 24dp; override bằng [modifier].
 * Màu mặc định là [LocalContentColor]; truyền [tint] để ghi đè.
 */
@Composable
fun GjIcon(
    icon: ImageVector,
    contentDescription: String? = null,
    modifier: Modifier = Modifier,
    tint: Color = LocalContentColor.current,
) {
    Icon(
        imageVector = icon,
        contentDescription = contentDescription,
        modifier = modifier,
        tint = tint,
    )
}

// ── preview ───────────────────────────────────────────────────────────────────

@Preview(name = "Icons — all 21 glyphs", widthDp = 280, heightDp = 180)
@Composable
private fun GjIconsPreview() {
    val ink = Color(0xFF5B4636)
    val allIcons = listOf(
        GjIcons.Pause, GjIcons.Play, GjIcons.Settings,
        GjIcons.Rotate, GjIcons.RotateCw, GjIcons.Volume, GjIcons.Mute,
        GjIcons.Music, GjIcons.Vibrate, GjIcons.Globe, GjIcons.Info,
        GjIcons.Close, GjIcons.Back, GjIcons.Home,
        GjIcons.Refresh, GjIcons.Heart, GjIcons.Star, GjIcons.Trophy,
        GjIcons.X2, GjIcons.Chevron, GjIcons.Check,
    )
    Column(
        Modifier
            .background(Color(0xFFFFF7EC))
            .padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        allIcons.chunked(7).forEach { row ->
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
            ) {
                row.forEach { icon ->
                    Box(contentAlignment = Alignment.Center) {
                        GjIcon(
                            icon = icon,
                            modifier = Modifier.size(28.dp),
                            tint = ink,
                        )
                    }
                }
            }
        }
    }
}
