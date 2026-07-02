package com.gravityjelly.app

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxHeight
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.BiasAlignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.core.CampaignLevels
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

// ── Artboard thiết kế (04-screens/world1-strip.jsx): 360×1280dp, node đều 62dp ──────────────
private const val ART_W = 360f
private const val ART_H = 1280f
private const val NODE = 62f

private enum class NodeKind { REG, BREATHER, BOSS }
private enum class NodeState { DONE, OPEN, LOCKED }

/** Vị trí node bám các khúc cua đường mòn vẽ sẵn (design NODES), đọc dưới→trên. */
private class MapNode(val id: Int, val x: Float, val y: Float, val kind: NodeKind)

private val WORLD1_NODES = listOf(
    MapNode(1, 230f, 1138f, NodeKind.REG),
    MapNode(2, 147f, 1050f, NodeKind.REG),
    MapNode(3, 233f, 964f, NodeKind.REG),
    MapNode(4, 126f, 892f, NodeKind.REG),
    MapNode(5, 239f, 802f, NodeKind.REG),
    MapNode(6, 126f, 718f, NodeKind.BREATHER),
    MapNode(7, 243f, 646f, NodeKind.REG),
    MapNode(8, 126f, 562f, NodeKind.REG),
    MapNode(9, 242f, 484f, NodeKind.REG),
    MapNode(10, 133f, 410f, NodeKind.BOSS),
)

// Màu số trên tile (design world1-strip.jsx CenterNum).
private val NumDone = Color(0xFFB67A16)
private val NumLocked = Color(0xFF8A7A63)
private val NumBoss = Color(0xFF6353D6)   // gravity-edge

/** Tổng sao World 1 cần gom để mở cổng sang Thế giới 2 (design world-gate-locked: 18★). */
private const val WORLD2_STAR_REQ = 18

/** Tổng số màn World 1 (mốc "qua đủ, không bỏ sót màn nào" để mở cổng). */
private val WORLD1_LEVEL_COUNT = CampaignLevels.ALL.count { it.world == 1 }

/** Tổng sao đã kiếm ở World 1 (dùng cho cổng + tiến độ). */
private fun earnedStarsWorld1(stars: Map<Int, Int>): Int =
    CampaignLevels.ALL.filter { it.world == 1 }.sumOf { stars[it.id] ?: 0 }

/** Số màn World 1 đã hoàn thành (sao > 0). Cổng chỉ mở khi qua ĐỦ 10 màn. */
private fun clearedWorld1(stars: Map<Int, Int>): Int =
    CampaignLevels.ALL.filter { it.world == 1 }.count { (stars[it.id] ?: 0) > 0 }

/** Node nên đưa người chơi tới khi "cày sao": màn đã qua <3★ trước, rồi node đang mở, cuối cùng L1. */
private fun grindNode(stars: Map<Int, Int>): MapNode =
    WORLD1_NODES.firstOrNull { nodeStateOf(it.id, stars) == NodeState.DONE && (stars[it.id] ?: 0) < 3 }
        ?: WORLD1_NODES.firstOrNull { nodeStateOf(it.id, stars) == NodeState.OPEN }
        ?: WORLD1_NODES.first()

/** Trạng thái node từ tiến độ thật: chỉ L1–L3 có màn ([CampaignLevels.ALL]); còn lại LOCKED (chưa có). */
private fun nodeStateOf(id: Int, stars: Map<Int, Int>): NodeState {
    val idx = CampaignLevels.ALL.indexOfFirst { it.id == id }
    if (idx < 0) return NodeState.LOCKED
    if ((stars[id] ?: 0) > 0) return NodeState.DONE
    val unlocked = idx == 0 || (stars[CampaignLevels.ALL[idx - 1].id] ?: 0) > 0
    return if (unlocked) NodeState.OPEN else NodeState.LOCKED
}

/**
 * Màn CHỌN MÀN Campaign — RE-SKIN theo `04-screens/world1-strip.jsx`: dải map cuộn dọc 360×1280,
 * nền PNG vẽ sẵn (đồng cỏ + đường mòn + cổng), 10 node thả lên đường mòn (dưới→trên): L1–L4 done có
 * sao, L5 open pulse, L6 nghỉ, L7–L9 khoá, L10 boss. Trạng thái drive từ tiến độ thật (chỉ L1–L3 có
 * màn). Chip cổng sang World 2 ở đỉnh, biển "Khởi đầu" ở đáy. Không HUD (chỉ nút Về Home nổi).
 *
 * @param stars levelId → sao đã đạt (0/chưa có = chưa xong).
 * @param onPlay chơi màn ở chỉ số trong [CampaignLevels.ALL].
 */
@Composable
fun CampaignScreen(
    stars: Map<Int, Int>,
    onPlay: (Int) -> Unit,
    onBack: () -> Unit,
    reducedMotion: Boolean = false,
    modifier: Modifier = Modifier,
) {
    BoxWithConstraints(modifier = modifier.fillMaxSize().background(GjPalette.Bg)) {
        val s = maxWidth.value / ART_W          // dp mỗi đơn-vị-design (≈1 nhờ ProvideDesignDensity)
        val artW = (ART_W * s).dp
        val artH = (ART_H * s).dp
        val scroll = rememberScrollState()
        val density = LocalDensity.current
        val scope = rememberCoroutineScope()
        val viewportPx = with(density) { maxHeight.toPx() }
        val artHpx = with(density) { artH.toPx() }
        val earned = remember(stars) { earnedStarsWorld1(stars) }
        val cleared = remember(stars) { clearedWorld1(stars) }

        // px cuộn để canh node vào giữa viewport.
        fun scrollPxFor(node: MapNode): Int =
            ((node.y / ART_H) * artHpx - viewportPx / 2f).roundToInt().coerceAtLeast(0)

        // Cuộn tới node ĐANG mở (hoặc done cuối / L1) — canh giữa màn khi vào.
        LaunchedEffect(Unit) {
            val focus = WORLD1_NODES.firstOrNull { nodeStateOf(it.id, stars) == NodeState.OPEN }
                ?: WORLD1_NODES.lastOrNull { nodeStateOf(it.id, stars) == NodeState.DONE }
                ?: WORLD1_NODES.first()
            scroll.scrollTo(scrollPxFor(focus))
        }

        Box(Modifier.fillMaxSize().verticalScroll(scroll)) {
            Box(Modifier.width(artW).height(artH)) {
                // Nền map vẽ sẵn (665×2365, tỉ lệ khớp 360×1280 → phủ vừa, không méo).
                Image(
                    painter = painterResource(R.drawable.world1_map_bg),
                    contentDescription = null,
                    modifier = Modifier.matchParentSize(),
                    contentScale = ContentScale.FillBounds,
                )

                // Cổng → World 2 (top:120, center): KHOÁ khi chưa đủ sao (hiện tiến độ), MỞ khi đủ.
                Box(
                    Modifier.fillMaxWidth().offset(y = (120f * s).dp),
                    contentAlignment = Alignment.TopCenter,
                ) {
                    WorldGate(
                        earned = earned,
                        target = WORLD2_STAR_REQ,
                        cleared = cleared,
                        totalLevels = WORLD1_LEVEL_COUNT,
                        s = s,
                        onGrind = { scope.launch { scroll.animateScrollTo(scrollPxFor(grindNode(stars))) } },
                    )
                }

                // 10 node trên đường mòn.
                WORLD1_NODES.forEach { node ->
                    val state = nodeStateOf(node.id, stars)
                    Box(
                        Modifier
                            .offset(x = ((node.x - NODE / 2f) * s).dp, y = ((node.y - NODE / 2f) * s).dp)
                            .size((NODE * s).dp)
                            // KHÔNG clip node — cung sao nhô lên trên tile cần tràn ra ngoài Box.
                            .clickable(enabled = state != NodeState.LOCKED) {
                                val idx = CampaignLevels.ALL.indexOfFirst { it.id == node.id }
                                if (idx >= 0) onPlay(idx)
                            },
                        contentAlignment = Alignment.Center,
                    ) {
                        NodeView(node, state, stars[node.id] ?: 0, s, reducedMotion)
                    }
                }

                // Biển "Khởi đầu" ở đáy (top: H-44, center).
                Box(
                    Modifier.fillMaxWidth().offset(y = ((ART_H - 44f) * s).dp),
                    contentAlignment = Alignment.TopCenter,
                ) { StartSign(s) }
            }
        }

        // Nút Về Home nổi (thay HUD — design strip không có HUD).
        Box(
            Modifier
                .align(Alignment.TopStart)
                .windowInsetsPadding(WindowInsets.safeDrawing)
                .padding((12f * s).dp)
                .size((44f * s).dp)
                .clip(CircleShape)
                .background(GjPalette.Surface)
                .border(1.5.dp, Color(0xFFE6D8BD), CircleShape)
                .clickable(onClick = onBack),
            contentAlignment = Alignment.Center,
        ) {
            Icon(GjIcons.Home, contentDescription = "Về Home", tint = GjPalette.Text, modifier = Modifier.size((22f * s).dp))
        }
    }
}

// ── Node ────────────────────────────────────────────────────────────────────────────────────
@Composable
private fun androidx.compose.foundation.layout.BoxScope.NodeView(
    node: MapNode, state: NodeState, stars: Int, s: Float, reducedMotion: Boolean,
) {
    val tile = when (state) {
        NodeState.DONE -> R.drawable.tile_completed
        NodeState.OPEN -> R.drawable.tile_unlocked
        NodeState.LOCKED -> R.drawable.tile_locked
    }
    val numColor = when {
        node.kind == NodeKind.BOSS -> NumBoss
        state == NodeState.DONE || state == NodeState.OPEN -> NumDone
        else -> NumLocked
    }
    // (vy = neo dọc theo % tile, numScale = cỡ chữ theo tile) — design CenterNum theo từng loại node.
    val vy: Float; val numScale: Float
    when {
        state == NodeState.DONE -> { vy = 0.56f; numScale = 0.36f }
        state == NodeState.OPEN -> { vy = 0.52f; numScale = 0.38f }
        node.kind == NodeKind.BOSS -> { vy = 0.33f; numScale = 0.40f }
        else -> { vy = 0.33f; numScale = 0.34f }
    }

    // Quầng pulse cho node ĐANG mở (radial tangerine, gj-strip-pulse 1800ms) — vẽ SAU tile.
    if (state == NodeState.OPEN) PulseHalo(s, reducedMotion)

    Image(
        painter = painterResource(tile),
        contentDescription = null,
        modifier = Modifier.fillMaxSize(),
    )

    // Số màn ở neo dọc vy (BiasAlignment: verticalBias = vy*2−1).
    val digits = node.id.toString().length
    val dscale = if (digits >= 3) 0.66f else if (digits == 2) 0.82f else 1f
    Text(
        text = "${node.id}",
        color = numColor,
        fontSize = (NODE * numScale * dscale * s).sp,
        fontWeight = FontWeight.Bold,
        fontFamily = MaterialTheme.typography.headlineMedium.fontFamily,
        modifier = Modifier.align(BiasAlignment(0f, vy * 2f - 1f)),
    )

    // Sao vòng cung cho node đã hoàn thành.
    if (state == NodeState.DONE) StarArc(stars, s, Modifier.align(Alignment.TopCenter))
}

@Composable
private fun androidx.compose.foundation.layout.BoxScope.PulseHalo(s: Float, reducedMotion: Boolean) {
    val scale: Float; val alpha: Float
    if (reducedMotion) {
        scale = 1f; alpha = 0.6f
    } else {
        val t = rememberInfiniteTransition(label = "strip-pulse")
        scale = t.animateFloat(
            initialValue = 1f, targetValue = 1.10f,
            animationSpec = infiniteRepeatable(tween(1800), RepeatMode.Reverse), label = "sc",
        ).value
        alpha = t.animateFloat(
            initialValue = 0.75f, targetValue = 0.35f,
            animationSpec = infiniteRepeatable(tween(1800), RepeatMode.Reverse), label = "al",
        ).value
    }
    Box(
        Modifier
            .align(Alignment.Center)
            .size((NODE * s).dp + (32f * s).dp)   // -16 mỗi phía so với node (design)
            .graphicsLayer { scaleX = scale; scaleY = scale; this.alpha = alpha }
            .background(
                Brush.radialGradient(
                    0f to Color(0x8CFF9F68),   // tangerine .55
                    0.55f to Color(0x38FF9F68), // .22
                    0.78f to Color(0x00FF9F68), // 0
                ),
                CircleShape,
            ),
    )
}

/** Ba sao vòng cung trên đỉnh tile (design StarArc: giữa cao hơn, hai bên nghiêng ±18°). */
@Composable
private fun StarArc(stars: Int, s: Float, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier.offset(y = (-8f * s).dp).width((54f * s).dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Bottom,
    ) {
        StarImg(stars >= 1, 15f, s, Modifier.offset(y = (2f * s).dp).rotate(-18f))
        StarImg(stars >= 2, 18f, s, Modifier.offset(y = (-3f * s).dp))
        StarImg(stars >= 3, 15f, s, Modifier.offset(y = (2f * s).dp).rotate(18f))
    }
}

@Composable
private fun StarImg(filled: Boolean, sizeDu: Float, s: Float, modifier: Modifier = Modifier) {
    Image(
        painter = painterResource(if (filled) R.drawable.star_on else R.drawable.star_off),
        contentDescription = null,
        modifier = modifier.size((sizeDu * s).dp),
    )
}

// ── Cổng → World 2 (nhãn compact bám design world1-strip GateChip + tiến độ sao) ──────────────
/**
 * Nhãn cổng sang Thế giới 2 đặt GỌN trên cổng vẽ ở nền map (không che cảnh). Cổng chỉ MỞ khi đạt
 * CẢ HAI điều kiện: đủ sao ([earned] ≥ [target]) VÀ qua ĐỦ 10 màn không bỏ sót ([cleared] =
 * [totalLevels]). Còn khoá → huy hiệu ổ khoá + dòng nhắc điều kiện chưa đạt, bấm nhãn để cuộn tới
 * màn nên cày (world-gate-locked). Đủ cả hai → huy hiệu tick xanh + "ĐÃ MỞ KHOÁ" (world-gate). Mọi
 * ngôi sao đều là ảnh PNG star_on (không dùng ký tự ★).
 */
@Composable
private fun WorldGate(earned: Int, target: Int, cleared: Int, totalLevels: Int, s: Float, onGrind: () -> Unit) {
    val starsShort = earned < target
    val levelsLeft = (totalLevels - cleared).coerceAtLeast(0)
    val locked = starsShort || levelsLeft > 0
    val pct = (earned.toFloat() / target).coerceIn(0f, 1f)
    val display = MaterialTheme.typography.headlineMedium.fontFamily
    val body = MaterialTheme.typography.bodyLarge.fontFamily
    val shape = RoundedCornerShape((18f * s).dp)

    Column(
        modifier = Modifier
            .width(IntrinsicSize.Max)
            .clip(shape)
            .background(Color.White)
            .border(1.5.dp, Color(0xFFE6D8BD), shape)
            .then(if (locked) Modifier.clickable(onClick = onGrind) else Modifier)
            .padding(start = (7f * s).dp, top = (6f * s).dp, end = (10f * s).dp, bottom = (8f * s).dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy((5f * s).dp),
    ) {
        // ── nhãn: huy hiệu + tên thế giới + chip earned/target ──
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy((8f * s).dp),
        ) {
            Box(
                Modifier
                    .size((30f * s).dp)
                    .clip(CircleShape)
                    .background(
                        if (locked) {
                            Brush.radialGradient(
                                0f to Color(0xFFFBF1DD), 0.6f to Color(0xFFF4E9D8), 1f to Color(0xFFE2D2B0),
                            )
                        } else {
                            Brush.radialGradient(
                                0f to Color(0xFFB7EBC0), 0.6f to Color(0xFF6FCF7F), 1f to Color(0xFF4FB063),
                            )
                        },
                    )
                    .border(2.dp, if (locked) Color(0xFFD8C8A8) else Color(0xFF4FB063), CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    if (locked) GjIcons.Lock else GjIcons.Check,
                    contentDescription = null,
                    tint = if (locked) Color(0xFF6F5C44) else Color.White,
                    modifier = Modifier.size((17f * s).dp),
                )
            }
            Column {
                Text(
                    "CỔNG · THẾ GIỚI 2",
                    color = Color(0xFF9B886F), fontSize = (8.5f * s).sp, fontWeight = FontWeight.ExtraBold,
                    letterSpacing = 0.12.em, fontFamily = body,
                )
                Text(
                    "Rừng rậm",
                    color = if (locked) Color(0xFF5B4636) else Color(0xFF3F7D49),
                    fontSize = (15f * s).sp, fontWeight = FontWeight.Bold, fontFamily = display,
                )
            }
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(999.dp))
                    .then(
                        if (locked) {
                            Modifier
                                .background(Color(0xFFF4E9D8))
                                .border(1.5.dp, Color(0xFFE6D8BD), RoundedCornerShape(999.dp))
                        } else {
                            Modifier
                                .background(Brush.verticalGradient(0f to Color(0xFFFFE6A8), 1f to Color(0xFFFFD074)))
                                .border(1.5.dp, Color(0xFFE0A21F), RoundedCornerShape(999.dp))
                        },
                    )
                    .padding(start = (6f * s).dp, top = (4f * s).dp, end = (9f * s).dp, bottom = (5f * s).dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy((3f * s).dp),
            ) {
                StarImg(true, 13f, s)
                Text(
                    "$earned/$target",
                    color = if (locked) Color(0xFF8C7458) else Color(0xFF6A4A2E),
                    fontSize = (13f * s).sp, fontWeight = FontWeight.Bold, fontFamily = display,
                )
            }
        }

        // ── thanh tiến độ sao ──
        Box(
            Modifier
                .fillMaxWidth()
                .height((7f * s).dp)
                .clip(RoundedCornerShape(999.dp))
                .background(Color(0xFFF4E9D8)),
        ) {
            Box(
                Modifier
                    .fillMaxWidth(pct)
                    .fillMaxHeight()
                    .clip(RoundedCornerShape(999.dp))
                    .background(Brush.horizontalGradient(0f to Color(0xFFFFCA66), 1f to Color(0xFFFF9F68))),
            )
        }

        // ── dòng trạng thái: nhắc điều kiện CHƯA đạt (thiếu sao trước, rồi màn còn lại) ──
        if (locked) {
            if (starsShort) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy((3f * s).dp),
                ) {
                    Text(
                        "Cần thêm ${target - earned}",
                        color = Color(0xFF6F5C44), fontSize = (11f * s).sp, fontWeight = FontWeight.ExtraBold,
                        fontFamily = body,
                    )
                    StarImg(true, 11f, s)
                    Text(
                        "để mở",
                        color = Color(0xFF6F5C44), fontSize = (11f * s).sp, fontWeight = FontWeight.ExtraBold,
                        fontFamily = body,
                    )
                }
            } else {
                // Đủ sao nhưng chưa qua hết 10 màn → còn khoá tới khi không bỏ sót màn nào.
                Text(
                    "Qua nốt $levelsLeft màn để mở",
                    color = Color(0xFF6F5C44), fontSize = (11f * s).sp, fontWeight = FontWeight.ExtraBold,
                    fontFamily = body,
                )
            }
        } else {
            Text(
                "ĐÃ MỞ KHOÁ",
                color = Color(0xFF3F7D49), fontSize = (10.5f * s).sp, fontWeight = FontWeight.ExtraBold,
                letterSpacing = 0.10.em, fontFamily = body,
            )
        }
    }
}

@Composable
private fun StartSign(s: Float) {
    Text(
        "ĐỒNG CỎ · KHỞI ĐẦU",
        color = GjPalette.Text,
        fontSize = (11f * s).sp,
        fontWeight = FontWeight.ExtraBold,
        letterSpacing = 0.12.em,
        textAlign = TextAlign.Center,
        fontFamily = MaterialTheme.typography.bodyLarge.fontFamily,
        modifier = Modifier
            .clip(RoundedCornerShape(999.dp))
            .background(GjPalette.Surface)
            .border(1.5.dp, Color(0xFFE6D8BD), RoundedCornerShape(999.dp))
            .padding(horizontal = (14f * s).dp, vertical = (6f * s).dp),
    )
}
