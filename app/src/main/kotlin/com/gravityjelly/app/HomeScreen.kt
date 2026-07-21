package com.gravityjelly.app

import androidx.annotation.DrawableRes
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.drawscope.withTransform
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.theme.GjDisplayFontFamily
import com.gravityjelly.app.ui.theme.GjBodyFontFamily
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import kotlin.math.PI
import kotlin.math.floor
import kotlin.math.sin

/**
 * Màn Home — RE-SKIN 21/07 theo `04-screens/home-screen.jsx` (bản mới: single Endless, Tùy chỉnh).
 *
 *  · Nền cảnh [sceneId] dùng chung cho cả Home và in-game (bỏ home_world_N_bg riêng).
 *  · RecordCard (góc trái trên): KỶ LỤC + best score.
 *  · CornerCustomize (góc phải trên): nút palette mở sheet Tùy chỉnh.
 *  · Logo (giữa trên, bob animation).
 *  · PlayButton (giữa): "CHƠI NGAY" — CTA cam candy.
 *  · 3 NavButton (hàng dưới): Cẩm nang · Xếp hạng · Cài đặt.
 *  · CustomizeSheet (bottom sheet): chọn cảnh/nền + nhạc nền + âm lượng.
 */
@Composable
fun HomeScreen(
    onPlay: () -> Unit,
    onGuide: () -> Unit,
    onLeaderboard: () -> Unit,
    onSettings: () -> Unit,
    best: Int = 0,
    sceneId: String = "meadow",
    musicId: String = "meadow",
    bgmVolume: Int = 70,
    onSceneChange: (String) -> Unit = {},
    onMusicChange: (String) -> Unit = {},
    onVolumeChange: (Int) -> Unit = {},
    reducedMotion: Boolean = false,
    modifier: Modifier = Modifier,
) {
    val scene = Scenes.byId(sceneId)
    var sheetOpen by remember { mutableStateOf(false) }

    Box(modifier = modifier.fillMaxSize()) {
        // ── Nền cảnh full-bleed, neo đáy ──
        Image(
            painter = painterResource(scene.bgRes),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
            alignment = Alignment.BottomCenter,
        )

        // ── Hạt bay (cánh hoa / lá / giọt) — dưới nút, trên nền ──
        if (!reducedMotion) {
            PetalLayer(sceneId = sceneId, modifier = Modifier.fillMaxSize())
        }

        // ── Nội dung chính ──
        Box(
            modifier = Modifier
                .fillMaxSize()
                .windowInsetsPadding(WindowInsets.safeDrawing),
        ) {
            // RecordCard góc trái trên (home-screen.jsx RecordCard: top 22, left 16)
            RecordCard(best = best, modifier = Modifier.align(Alignment.TopStart))

            // Nút Tùy chỉnh góc phải trên (home-screen.jsx CornerCustomize: top 22, right 18)
            CornerCustomize(
                onClick = { sheetOpen = true },
                modifier = Modifier.align(Alignment.TopEnd),
            )

            // Cột chính: logo + nút chơi + nav
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 24.dp, vertical = 40.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Spacer(Modifier.height(46.dp))

                // Logo (home-screen.jsx LogoMark: width 250, maxWidth 78%, bob animation)
                LogoMark(reducedMotion = reducedMotion)

                Spacer(Modifier.weight(1f))

                // CTA "CHƠI NGAY" (home-screen.jsx PlayButton)
                PlayButton(
                    label = stringResource(R.string.home_play),
                    onClick = onPlay,
                )

                Spacer(Modifier.height(42.dp))

                // 3 nút phụ (home-screen.jsx NavButton row)
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 2.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    NavButton(
                        iconRes = R.drawable.ic_guide,
                        label = stringResource(R.string.home_guide),
                        onClick = onGuide,
                    )
                    NavButton(
                        iconRes = R.drawable.ic_trophy,
                        label = stringResource(R.string.home_leaderboard),
                        onClick = onLeaderboard,
                    )
                    NavButton(
                        iconRes = R.drawable.ic_settings,
                        label = stringResource(R.string.home_settings),
                        onClick = onSettings,
                    )
                }
            }
        }

        // ── Customize bottom sheet ──
        AnimatedVisibility(
            visible = sheetOpen,
            enter = fadeIn(tween(250)),
            exit = fadeOut(tween(200)),
        ) {
            CustomizeSheet(
                best = best,
                sceneId = sceneId,
                musicId = musicId,
                volume = bgmVolume,
                onScene = onSceneChange,
                onMusic = onMusicChange,
                onVolume = onVolumeChange,
                onClose = { sheetOpen = false },
            )
        }
    }
}

// ── RecordCard (home-screen.jsx RecordCard) ──────────────────────────────────

/** Số kiểu Việt: 12480 → "12.480". */
private fun Int.viScore(): String {
    if (this == 0) return "0"
    return toString().reversed().chunked(3).joinToString(".").reversed()
}

@Composable
private fun RecordCard(best: Int, modifier: Modifier = Modifier) {
    // home-screen.jsx: top 22, left 16, padding 7 15 7 9, borderRadius 20, cream candy card
    Row(
        modifier = modifier
            .padding(start = 16.dp, top = 22.dp)
            .drawBehind {
                val r = CornerRadius(20.dp.toPx())
                // edge (home-screen.jsx: 0 4px 0 #EBDCC4)
                drawRoundRect(Color(0xFFEBDCC4), cornerRadius = r,
                    topLeft = Offset(0f, 4.dp.toPx()), size = size)
                // face (gradient 180deg #FFFFFF → #FFF7EC)
                drawRoundRect(
                    brush = Brush.verticalGradient(listOf(Color.White, Color(0xFFFFF7EC))),
                    cornerRadius = r, size = size,
                )
            }
            .padding(start = 9.dp, end = 15.dp, top = 7.dp, bottom = 7.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Image(
            painter = painterResource(R.drawable.ic_trophy),
            contentDescription = null,
            modifier = Modifier.size(30.dp),
        )
        Column {
            Text(
                text = stringResource(R.string.home_record),
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = GjBodyFontFamily,
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 11.sp,
                    letterSpacing = 0.06.em,
                    color = GjPalette.TextMuted,
                    lineHeight = 1.em,
                ),
            )
            Text(
                text = best.viScore(),
                style = MaterialTheme.typography.titleLarge.copy(
                    fontFamily = GjDisplayFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = GjPalette.Text,
                    lineHeight = 1.2.em,
                ),
                modifier = Modifier.padding(top = 3.dp),
            )
        }
    }
}

// ── CornerCustomize (home-screen.jsx CornerCustomize) ────────────────────────

@Composable
private fun CornerCustomize(onClick: () -> Unit, modifier: Modifier = Modifier) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val yOffset by animateFloatAsState(
        targetValue = if (pressed) 3f else 0f,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
        label = "customizePress",
    )

    // home-screen.jsx: top 22, right 18, 50×50, borderRadius 18, cream candy
    Box(
        modifier = modifier
            .padding(end = 18.dp, top = 22.dp)
            .size(50.dp)
            .graphicsLayer { translationY = yOffset.dp.toPx() }
            .drawBehind {
                val r = CornerRadius(18.dp.toPx())
                val edgeH = if (pressed) 1.dp.toPx() else 4.dp.toPx()
                // edge
                drawRoundRect(Color(0xFFEBDCC4), cornerRadius = r,
                    topLeft = Offset(0f, edgeH), size = size)
                // face
                drawRoundRect(
                    brush = Brush.verticalGradient(listOf(Color.White, Color(0xFFFFF7EC))),
                    cornerRadius = r, size = size,
                )
                // highlight pill (home-screen.jsx: top 5, h10, opacity .8)
                val pillH = 10.dp.toPx()
                val pillW = size.width * 0.52f
                drawRoundRect(
                    Color(0xCCFFFFFF), cornerRadius = CornerRadius(999f),
                    topLeft = Offset((size.width - pillW) / 2f, 5.dp.toPx()),
                    size = Size(pillW, pillH),
                )
            }
            .selectable(
                selected = false, interactionSource = interaction,
                indication = null, onClick = onClick,
            ),
        contentAlignment = Alignment.Center,
    ) {
        Image(
            painter = painterResource(R.drawable.ic_palette),
            contentDescription = stringResource(R.string.home_customize),
            modifier = Modifier.size(30.dp),
        )
    }
}

// ── LogoMark (home-screen.jsx LogoMark + gj2-logo-bob) ──────────────────────

@Composable
private fun LogoMark(reducedMotion: Boolean) {
    val bob = remember { Animatable(0f) }
    LaunchedEffect(reducedMotion) {
        if (reducedMotion) return@LaunchedEffect
        bob.animateTo(
            targetValue = 1f,
            animationSpec = infiniteRepeatable(
                animation = tween(4000, easing = LinearEasing),
                repeatMode = RepeatMode.Restart,
            ),
        )
    }
    // home-screen.jsx: bob -6px, 4s ease-in-out infinite
    val offsetY = if (reducedMotion) 0f else {
        val phase = bob.value * 2f * PI.toFloat()
        -6f * sin(phase)
    }
    Image(
        painter = painterResource(R.drawable.home_logo),
        contentDescription = "Gravity Jelly",
        modifier = Modifier
            .width(250.dp)
            .graphicsLayer { translationY = offsetY.dp.toPx() },
        contentScale = ContentScale.FillWidth,
    )
}

// ── PlayButton (home-screen.jsx PlayButton — tangerine candy CTA) ───────────

// home-screen.jsx: width 254, height 68, borderRadius 28
private val PlayFillNormal = listOf(Color(0xFFFFC59A), Color(0xFFFF9F68))
private val PlayEdge = Color(0xFFE97E45)

@Composable
private fun PlayButton(label: String, onClick: () -> Unit) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val yOffset by animateFloatAsState(
        targetValue = if (pressed) 4f else 0f,
        animationSpec = spring(dampingRatio = 0.55f, stiffness = Spring.StiffnessMediumLow),
        label = "playPress",
    )

    Box(
        modifier = Modifier
            .width(254.dp)
            .height(68.dp)
            .graphicsLayer { translationY = yOffset.dp.toPx() }
            .drawBehind {
                val r = CornerRadius(28.dp.toPx())
                val edgeH = if (pressed) 2.dp.toPx() else 6.dp.toPx()
                // edge
                drawRoundRect(PlayEdge, cornerRadius = r,
                    topLeft = Offset(0f, edgeH), size = size)
                // face gradient
                drawRoundRect(
                    brush = Brush.verticalGradient(PlayFillNormal),
                    cornerRadius = r, size = size,
                )
                // gloss (home-screen.jsx: top 3, left/right 6%, height 46%, opacity 1)
                val glossL = size.width * 0.06f
                val glossW = size.width * 0.88f
                val glossH = size.height * 0.46f
                drawRoundRect(
                    brush = Brush.verticalGradient(
                        listOf(Color(0xBFFFFFFF), Color(0x00FFFFFF)),
                    ),
                    topLeft = Offset(glossL, 3.dp.toPx()),
                    size = Size(glossW, glossH),
                    cornerRadius = CornerRadius(24.dp.toPx()),
                )
            }
            .selectable(
                selected = false, interactionSource = interaction,
                indication = null, onClick = onClick,
            ),
        contentAlignment = Alignment.Center,
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(9.dp),
        ) {
            PlayIcon(Modifier.size(28.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontFamily = GjDisplayFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 23.sp,
                    color = Color.White,
                    letterSpacing = 0.01.em,
                ),
            )
        }
    }
}

// ── NavButton (home-screen.jsx NavButton — cream candy secondary) ───────────

@Composable
private fun PlayIcon(modifier: Modifier = Modifier) {
    val path = remember { Path() }
    Canvas(modifier) {
        path.rewind()
        val w = size.width
        val h = size.height
        val inset = w * 0.08f
        path.moveTo(inset, 0f)
        path.lineTo(w, h / 2f)
        path.lineTo(inset, h)
        path.close()
        // shadow
        drawPath(path, color = Color(0x40000000), style = Fill,
            blendMode = BlendMode.SrcOver)
        translate(left = -1.5f.dp.toPx(), top = -1.5f.dp.toPx()) {
            drawPath(path, color = Color.White, style = Fill)
        }
    }
}

// home-screen.jsx: width 92, height 84, borderRadius 22
private val NavFill = listOf(Color.White, Color(0xFFFFF7EC))
private val NavEdge = Color(0xFFEBDCC4)

@Composable
private fun NavButton(
    @DrawableRes iconRes: Int,
    label: String,
    onClick: () -> Unit,
) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val yOffset by animateFloatAsState(
        targetValue = if (pressed) 3f else 0f,
        animationSpec = spring(dampingRatio = 0.55f, stiffness = Spring.StiffnessMediumLow),
        label = "navPress",
    )

    Box(
        modifier = Modifier
            .size(width = 92.dp, height = 84.dp)
            .graphicsLayer { translationY = yOffset.dp.toPx() }
            .drawBehind {
                val r = CornerRadius(22.dp.toPx())
                val edgeH = if (pressed) 2.dp.toPx() else 5.dp.toPx()
                drawRoundRect(NavEdge, cornerRadius = r,
                    topLeft = Offset(0f, edgeH), size = size)
                drawRoundRect(
                    brush = Brush.verticalGradient(NavFill),
                    cornerRadius = r, size = size,
                )
                // highlight pill (home-screen.jsx: top 5, left/right 24%, h11)
                val pillW = size.width * 0.52f
                drawRoundRect(
                    Color(0xCCFFFFFF), cornerRadius = CornerRadius(999f),
                    topLeft = Offset((size.width - pillW) / 2f, 5.dp.toPx()),
                    size = Size(pillW, 11.dp.toPx()),
                )
            }
            .selectable(
                selected = false, interactionSource = interaction,
                indication = null, onClick = onClick,
            ),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Image(
                painter = painterResource(iconRes),
                contentDescription = label,
                modifier = Modifier.size(38.dp),
            )
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = GjBodyFontFamily,
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 12.5.sp,
                    color = GjPalette.Text,
                    lineHeight = 1.em,
                ),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}

// ── CustomizeSheet (home-screen.jsx CustomizeSheet) ──────────────────────────

@Composable
private fun CustomizeSheet(
    best: Int,
    sceneId: String,
    musicId: String,
    volume: Int,
    onScene: (String) -> Unit,
    onMusic: (String) -> Unit,
    onVolume: (Int) -> Unit,
    onClose: () -> Unit,
) {
    // Scrim + sheet
    Box(modifier = Modifier.fillMaxSize()) {
        // Scrim (home-screen.jsx: rgba(60,44,24,0.42))
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0x6B3C2C18))
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onClose,
                ),
        )

        // Sheet
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .clip(RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp))
                .background(GjPalette.Bg)
                .padding(horizontal = 16.dp, vertical = 10.dp),
        ) {
            // Drag handle (home-screen.jsx: 44×5, #E2D4BD)
            Box(
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .width(44.dp)
                    .height(5.dp)
                    .clip(RoundedCornerShape(999.dp))
                    .background(Color(0xFFE2D4BD)),
            )

            Spacer(Modifier.height(10.dp))

            // Header: title + close button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = stringResource(R.string.customize_title),
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontFamily = GjDisplayFontFamily,
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 22.sp,
                        color = GjPalette.Text,
                    ),
                )
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(GjPalette.SurfaceSunken)
                        .clickable(onClick = onClose),
                    contentAlignment = Alignment.Center,
                ) {
                    Text("✕", fontSize = 16.sp, color = GjPalette.Text)
                }
            }

            Spacer(Modifier.height(14.dp))

            Column(
                modifier = Modifier.verticalScroll(rememberScrollState()),
            ) {
                // ── CẢNH & NỀN section ──
                SectionLabel(stringResource(R.string.customize_scene_section))
                Spacer(Modifier.height(8.dp))

                // 2-column grid of scene thumbnails
                val scenes = Scenes.all
                for (row in scenes.chunked(2)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        for (sc in row) {
                            SceneThumbnail(
                                scene = sc,
                                active = sc.id == sceneId,
                                locked = best < sc.unlockAt,
                                onClick = { onScene(sc.id) },
                                modifier = Modifier.weight(1f),
                            )
                        }
                        if (row.size == 1) Spacer(Modifier.weight(1f))
                    }
                    Spacer(Modifier.height(10.dp))
                }

                Spacer(Modifier.height(10.dp))

                // ── NHẠC NỀN section ──
                SectionLabel(stringResource(R.string.customize_music_section))
                Spacer(Modifier.height(8.dp))

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color.White),
                ) {
                    for ((i, sc) in scenes.withIndex()) {
                        val locked = best < sc.unlockAt
                        val playing = musicId == sc.id
                        MusicRow(
                            scene = sc,
                            locked = locked,
                            playing = playing,
                            onClick = { if (!locked) onMusic(sc.id) },
                            showDivider = i < scenes.lastIndex,
                        )
                    }
                }

                Spacer(Modifier.height(16.dp))

                // ── Volume slider ──
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 2.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Text("🔊", fontSize = 18.sp)
                    Slider(
                        value = volume / 100f,
                        onValueChange = { onVolume((it * 100).toInt()) },
                        modifier = Modifier.weight(1f),
                        colors = SliderDefaults.colors(
                            thumbColor = GjPalette.Gravity,
                            activeTrackColor = GjPalette.Gravity,
                        ),
                    )
                    Text(
                        text = volume.toString(),
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontFamily = GjDisplayFontFamily,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = GjPalette.Text,
                        ),
                        modifier = Modifier.width(34.dp),
                        textAlign = TextAlign.End,
                    )
                }

                Spacer(Modifier.height(18.dp))
            }
        }
    }
}

@Composable
private fun SectionLabel(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.labelSmall.copy(
            fontFamily = GjDisplayFontFamily,
            fontWeight = FontWeight.Bold,
            fontSize = 12.sp,
            letterSpacing = 0.04.em,
            color = GjPalette.TextMuted,
        ),
        modifier = Modifier.padding(start = 2.dp),
    )
}

@Composable
private fun SceneThumbnail(
    scene: Scene,
    active: Boolean,
    locked: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    // home-screen.jsx: aspectRatio 16/11, borderRadius 16
    Box(
        modifier = modifier
            .aspectRatio(16f / 11f)
            .clip(RoundedCornerShape(16.dp))
            .then(
                if (active) Modifier.drawBehind {
                    drawRoundRect(
                        GjPalette.Gravity,
                        cornerRadius = CornerRadius(16.dp.toPx()),
                        size = Size(size.width + 6.dp.toPx(), size.height + 6.dp.toPx()),
                        topLeft = Offset(-3.dp.toPx(), -3.dp.toPx()),
                    )
                } else Modifier
            )
            .clickable(enabled = !locked, onClick = onClick),
    ) {
        Image(
            painter = painterResource(scene.bgRes),
            contentDescription = stringResource(scene.nameRes),
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
            alignment = Alignment.Center,
        )
        // Bottom gradient + name
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        listOf(Color.Transparent, Color(0xA83C2C18)),
                    ),
                )
                .padding(horizontal = 10.dp, vertical = 7.dp),
        ) {
            Text(
                text = stringResource(scene.nameRes),
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = GjDisplayFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = Color.White,
                ),
            )
        }
        // Active checkmark
        if (active) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(7.dp)
                    .size(24.dp)
                    .clip(CircleShape)
                    .background(GjPalette.Gravity),
                contentAlignment = Alignment.Center,
            ) {
                Text("✓", fontSize = 14.sp, color = Color.White, fontWeight = FontWeight.Bold)
            }
        }
        // Lock overlay
        if (locked) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0x66000000)),
                contentAlignment = Alignment.Center,
            ) {
                Text("🔒", fontSize = 24.sp)
            }
        }
    }
}

@Composable
private fun MusicRow(
    scene: Scene,
    locked: Boolean,
    playing: Boolean,
    onClick: () -> Unit,
    showDivider: Boolean,
) {
    // home-screen.jsx: minHeight 56, padding 0 14px
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(56.dp)
            .then(
                if (playing) Modifier.background(GjPalette.SurfaceSunken)
                else Modifier
            )
            .clickable(enabled = !locked, onClick = onClick)
            .padding(horizontal = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        // Circle icon
        val circleColor = when {
            locked -> Color(0xFFE2D4BD)
            playing -> GjPalette.Gravity
            else -> GjPalette.SurfaceSunken
        }
        Box(
            modifier = Modifier
                .size(34.dp)
                .clip(CircleShape)
                .background(circleColor),
            contentAlignment = Alignment.Center,
        ) {
            Text(
                text = if (locked) "⚙" else "♫",
                fontSize = 16.sp,
                color = if (playing) Color.White else GjPalette.Text,
            )
        }

        // Track name + lock hint
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = stringResource(scene.trackNameRes),
                style = MaterialTheme.typography.labelLarge.copy(
                    fontFamily = GjDisplayFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = GjPalette.Text,
                ),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            if (locked) {
                Text(
                    text = stringResource(R.string.customize_unlock_at, scene.unlockAt.viScore()),
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontFamily = GjBodyFontFamily,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        color = GjPalette.TextMuted,
                    ),
                )
            }
        }

        // Right side: playing indicator or "Chọn"
        when {
            playing -> {
                Text("♪♪♪", fontSize = 13.sp, color = GjPalette.Gravity)
            }
            !locked -> {
                Text(
                    text = stringResource(R.string.customize_select),
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontFamily = GjDisplayFontFamily,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        color = GjPalette.Gravity,
                    ),
                )
            }
        }
    }
    if (showDivider) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.5.dp)
                .padding(horizontal = 14.dp)
                .background(Color(0xFFE6DAC9)),
        )
    }
}

// ── Cánh hoa bay ────────────────────────────────────────────────────────────────

private class Mulberry32(private var seed: Int) {
    fun next(): Float {
        seed += 0x6D2B79F5
        var t = (seed xor (seed ushr 15)) * (seed or 1)
        t = (t + ((t xor (t ushr 7)) * (t or 61))) xor t
        return ((t xor (t ushr 14)).toLong() and 0xFFFFFFFFL).toFloat() / 4294967296f
    }
}

private val PetalColors = arrayOf(
    Color(0xFFFFFFFF) to Color(0xFFFBE7EF),
    Color(0xFFFBD0DF) to Color(0xFFF7A9C0),
    Color(0xFFFFF1CE) to Color(0xFFFFE3A3),
    Color(0xFFF7A9C0) to Color(0xFFE576A0),
)

private val LeafColors = arrayOf(
    Color(0xFFD8F0C0) to Color(0xFFA9D98A),
    Color(0xFFCBF2EB) to Color(0xFF5FC3B2),
    Color(0xFFBCE3A0) to Color(0xFF7FB069),
    Color(0xFFA3E5D9) to Color(0xFF4F9D5A),
)

private val DropColors = arrayOf(
    Color(0xFFFFFFFF) to Color(0xFFC5E7EE),
    Color(0xFFEAFAFB) to Color(0xFFB4E0EA),
    Color(0xFFD6EEF1) to Color(0xFF8FB6F2),
    Color(0xFFCFEFF3) to Color(0xFFA6DCE5),
)

private fun particleColors(sceneId: String): Array<Pair<Color, Color>> = when (sceneId) {
    "forest" -> LeafColors
    "waterfall" -> DropColors
    else -> PetalColors
}

private class PetalSpec(
    val wBase: Float, val baseYFrac: Float, val travelDur: Float, val delay: Float,
    val colorIdx: Int, val dir: Float, val wobAmp: Float,
    val wobFreq1: Float, val wobPhase1: Float, val wobFreq2: Float, val wobPhase2: Float,
    val rotSpeed: Float, val gustAmp: Float, val gustFreq: Float, val gustPhase: Float,
)

private const val TAU = (2.0 * PI).toFloat()
private const val BAND_TOP = 0.30f
private const val BAND_BOT = 0.70f

private fun buildPetals(count: Int, seed: Int): List<PetalSpec> {
    val r = Mulberry32(seed)
    return List(count) {
        PetalSpec(
            wBase = 13f + r.next() * 13f,
            baseYFrac = 0.06f + r.next() * 0.88f,
            travelDur = 3.5f + r.next() * 3f,
            delay = -r.next() * (3.5f + r.next() * 3f),
            colorIdx = floor(r.next() * 4).toInt().coerceIn(0, 3),
            dir = 1f,
            wobAmp = 0.10f + r.next() * 0.16f,
            wobFreq1 = 0.10f + r.next() * 0.12f,
            wobPhase1 = r.next() * TAU,
            wobFreq2 = 0.28f + r.next() * 0.30f,
            wobPhase2 = r.next() * TAU,
            rotSpeed = (if (r.next() < 0.5f) -1f else 1f) * (14f + r.next() * 30f),
            gustAmp = 6f + r.next() * 12f,
            gustFreq = 0.10f + r.next() * 0.14f,
            gustPhase = r.next() * TAU,
        )
    }
}

private const val PETAL_HALF_W = 0.5f
private const val PETAL_HALF_H = 0.675f

private fun unitPetalPath(): Path = Path().apply {
    addRoundRect(
        RoundRect(
            rect = Rect(-PETAL_HALF_W, -PETAL_HALF_H, PETAL_HALF_W, PETAL_HALF_H),
            topLeft = CornerRadius(0.5f), topRight = CornerRadius(0.5f),
            bottomRight = CornerRadius(0.5f), bottomLeft = CornerRadius(0.08f, 0.108f),
        ),
    )
}

private fun unitLeafPath(): Path = Path().apply {
    val w = PETAL_HALF_W * 0.86f
    moveTo(0f, -PETAL_HALF_H)
    quadraticBezierTo(w, -PETAL_HALF_H * 0.10f, 0.06f, PETAL_HALF_H)
    quadraticBezierTo(-w, PETAL_HALF_H * 0.10f, 0f, -PETAL_HALF_H)
    close()
}

private fun unitDropPath(): Path = Path().apply {
    val w = PETAL_HALF_W * 0.82f
    moveTo(0f, -PETAL_HALF_H)
    cubicTo(w, -PETAL_HALF_H * 0.15f, w, PETAL_HALF_H * 0.55f, 0f, PETAL_HALF_H)
    cubicTo(-w, PETAL_HALF_H * 0.55f, -w, -PETAL_HALF_H * 0.15f, 0f, -PETAL_HALF_H)
    close()
}

private fun unitParticlePath(sceneId: String): Path = when (sceneId) {
    "forest" -> unitLeafPath()
    "waterfall" -> unitDropPath()
    else -> unitPetalPath()
}

@Composable
private fun PetalLayer(sceneId: String, modifier: Modifier = Modifier) {
    val petals = remember { buildPetals(count = 12, seed = 7) }
    val petal = remember(sceneId) { unitParticlePath(sceneId) }
    val brushes = remember(sceneId) {
        particleColors(sceneId).map { (c1, c2) ->
            Brush.verticalGradient(listOf(c1, c2), startY = -PETAL_HALF_H, endY = PETAL_HALF_H)
        }
    }

    var startNanos by remember { mutableLongStateOf(0L) }
    var nowNanos by remember { mutableLongStateOf(0L) }
    LaunchedEffect(Unit) {
        while (true) {
            withFrameNanos { t ->
                if (startNanos == 0L) startNanos = t
                nowNanos = t
            }
        }
    }

    Canvas(modifier = modifier) {
        val elapsed = if (startNanos == 0L) 0f else (nowNanos - startNanos) / 1_000_000_000f
        val unit = size.width / 360f
        val bandTop = size.height * BAND_TOP
        val bandBot = size.height * BAND_BOT
        val bandHalf = (bandBot - bandTop) / 2f
        val marginX = size.width * 0.10f
        for (s in petals) {
            val phase = (elapsed - s.delay) / s.travelDur
            val p = phase - floor(phase)
            val startX = -marginX
            val endX = size.width + marginX
            var px = startX + (endX - startX) * p
            px += s.gustAmp * unit * sin(TAU * s.gustFreq * elapsed + s.gustPhase)
            val baseY = bandTop + s.baseYFrac * (bandBot - bandTop)
            val wob = sin(TAU * s.wobFreq1 * elapsed + s.wobPhase1) +
                0.5f * sin(TAU * s.wobFreq2 * elapsed + s.wobPhase2)
            val py = (baseY + wob * s.wobAmp * bandHalf).coerceIn(bandTop, bandBot)
            val alpha = when {
                p < 0.08f -> p / 0.08f
                p > 0.90f -> (1f - p) / 0.10f
                else -> 1f
            }
            if (alpha <= 0.01f) continue
            val rot = s.rotSpeed * elapsed
            val half = s.wBase * unit / 2f
            withTransform({
                translate(px, py)
                rotate(rot, pivot = Offset.Zero)
                scale(half, half, pivot = Offset.Zero)
            }) {
                drawPath(petal, brush = brushes[s.colorIdx], alpha = alpha.coerceIn(0f, 1f))
            }
        }
    }
}

// ── Preview ──────────────────────────────────────────────────────────────────

@Preview(name = "Home — new design", widthDp = 360, heightDp = 800)
@Composable
private fun HomeScreenPreview() {
    GravityJellyTheme {
        HomeScreen(
            onPlay = {},
            onGuide = {},
            onLeaderboard = {},
            onSettings = {},
            best = 28640,
        )
    }
}
