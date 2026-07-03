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
import androidx.compose.foundation.layout.asPaddingValues
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
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

// World 2 · Rừng rậm — node bám đường mòn vẽ sẵn (design world2-strip.jsx NODES).
private val WORLD2_NODES = listOf(
    MapNode(11, 200f, 1132f, NodeKind.REG),   // nâng lên (ngang node đầu W1) tránh đè biển "← ĐỒNG CỎ" ở đáy
    MapNode(12, 122f, 1061f, NodeKind.REG),
    MapNode(13, 238f, 968f, NodeKind.REG),
    MapNode(14, 125f, 872f, NodeKind.REG),
    MapNode(15, 240f, 782f, NodeKind.REG),
    MapNode(16, 116f, 687f, NodeKind.BREATHER),
    MapNode(17, 231f, 606f, NodeKind.REG),
    MapNode(18, 139f, 541f, NodeKind.REG),
    MapNode(19, 232f, 478f, NodeKind.REG),
    MapNode(20, 140f, 415f, NodeKind.BOSS),
)

// World 3 · Sông & Thác — node bám đường mòn vẽ sẵn (design world3-strip.jsx NODES).
private val WORLD3_NODES = listOf(
    MapNode(21, 220f, 1080f, NodeKind.REG),
    MapNode(22, 108f, 990f, NodeKind.REG),
    MapNode(23, 243f, 890f, NodeKind.REG),
    MapNode(24, 116f, 800f, NodeKind.REG),
    MapNode(25, 250f, 695f, NodeKind.REG),
    MapNode(26, 112f, 600f, NodeKind.BREATHER),
    MapNode(27, 248f, 505f, NodeKind.REG),
    MapNode(28, 112f, 435f, NodeKind.REG),
    MapNode(29, 248f, 375f, NodeKind.REG),
    MapNode(30, 118f, 298f, NodeKind.BOSS),
)

// Màu số trên tile (design world1-strip.jsx CenterNum).
private val NumDone = Color(0xFFB67A16)
private val NumLocked = Color(0xFF8A7A63)
private val NumBoss = Color(0xFF6353D6)   // gravity-edge

/** Mô tả một dải bản đồ world (node + nền + cổng sang world kế). Artboard 360×1280 cho mọi world. */
private class WorldMap(
    val world: Int,
    val nodes: List<MapNode>,
    val bg: Int,
    val nextWorld: Int,
    val nextName: String,
    val gateStarReq: Int,
    val startSign: String,
)

/** Bản đồ theo world (design world1-strip / world2-strip; ngưỡng sao cổng theo GateChip). */
private fun worldMap(world: Int): WorldMap = when (world) {
    3 -> WorldMap(3, WORLD3_NODES, R.drawable.world3_map_bg, 4, "Sa mạc", 54, "SÔNG & THÁC · TIẾP TỤC")
    2 -> WorldMap(2, WORLD2_NODES, R.drawable.world2_map_bg, 3, "Sông & Thác", 36, "RỪNG RẬM · TIẾP TỤC")
    else -> WorldMap(1, WORLD1_NODES, R.drawable.world1_map_bg, 2, "Rừng rậm", 18, "ĐỒNG CỎ · KHỞI ĐẦU")
}

/** Số màn của một world trong [CampaignLevels.ALL]. */
private fun levelCount(world: Int): Int = CampaignLevels.ALL.count { it.world == world }

/**
 * World người chơi đang Ở = world MỞ KHOÁ cao nhất (dùng chung luật cổng với bản đồ [gateUnlocked]:
 * qua đủ 10 màn + đủ sao cổng). KHÔNG nhảy sang world kế khi cổng còn khoá (dù đã đánh hết màn nhưng
 * chưa đủ sao). Dùng cho nền Home/Endless đổi cảnh theo tiến độ (Đồng cỏ → Rừng rậm → Sông & Thác).
 */
internal fun campaignCurrentWorld(stars: Map<Int, Int>): Int {
    val maxWorld = CampaignLevels.ALL.maxOf { it.world }
    var w = 1
    while (w < maxWorld && levelCount(w + 1) > 0 && gateUnlocked(w, stars)) w++
    return w
}

/**
 * Tổng sao TÍCH LŨY từ World 1 tới hết [world] (GỒM cả sao mọi world trước) — dùng cho ngưỡng cổng.
 * Ngưỡng cổng vượt sức 1 world (mỗi world tối đa 30 sao): cổng W2=36, W3=54 nên BẮT BUỘC cộng dồn
 * sao world trước (user 03/07: "qua cổng tính theo tổng sao tích luỹ, gồm cả sao thế giới trước";
 * vd cổng sang W3 cần 36 mà hết W1 chỉ 30). = 60% của trần tích luỹ 30/60/90.
 */
private fun cumulativeStars(world: Int, stars: Map<Int, Int>): Int =
    CampaignLevels.ALL.filter { it.world <= world }.sumOf { stars[it.id] ?: 0 }

/** Số màn [world] đã hoàn thành (sao > 0). Cổng chỉ mở khi qua ĐỦ mọi màn của world. */
private fun clearedCount(world: Int, stars: Map<Int, Int>): Int =
    CampaignLevels.ALL.filter { it.world == world }.count { (stars[it.id] ?: 0) > 0 }

/** Cổng world này đã MỞ chưa: đủ sao TÍCH LŨY + qua hết mọi màn world này (và world thực sự có màn). */
private fun gateUnlocked(world: Int, stars: Map<Int, Int>): Boolean {
    val n = levelCount(world)
    return n > 0 && clearedCount(world, stars) == n && cumulativeStars(world, stars) >= worldMap(world).gateStarReq
}

/** Node nên đưa người chơi tới khi "cày sao": màn đã qua <3★ trước, rồi node đang mở, cuối cùng đầu dải. */
private fun grindNode(nodes: List<MapNode>, stars: Map<Int, Int>): MapNode =
    nodes.firstOrNull { nodeStateOf(it.id, stars) == NodeState.DONE && (stars[it.id] ?: 0) < 3 }
        ?: nodes.firstOrNull { nodeStateOf(it.id, stars) == NodeState.OPEN }
        ?: nodes.first()

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

        // World đang xem: mặc định = world của node ĐANG mở (màn kế tiếp), fallback world đã qua cuối.
        val defaultWorld = remember(stars) {
            CampaignLevels.ALL.firstOrNull { nodeStateOf(it.id, stars) == NodeState.OPEN }?.world
                ?: CampaignLevels.ALL.lastOrNull { nodeStateOf(it.id, stars) == NodeState.DONE }?.world
                ?: 1
        }
        var selectedWorld by remember { mutableStateOf(defaultWorld) }
        val map = worldMap(selectedWorld)
        // Sao hiển thị ở cổng = TÍCH LŨY tới world này (khớp ngưỡng cổng cộng dồn ở gateUnlocked).
        val earned = remember(stars, selectedWorld) { cumulativeStars(selectedWorld, stars) }
        val cleared = remember(stars, selectedWorld) { clearedCount(selectedWorld, stars) }
        val canAdvance = gateUnlocked(selectedWorld, stars) && levelCount(map.nextWorld) > 0

        // px cuộn để canh node vào giữa viewport.
        fun scrollPxFor(node: MapNode): Int =
            ((node.y / ART_H) * artHpx - viewportPx / 2f).roundToInt().coerceAtLeast(0)

        // Cuộn tới node ĐANG mở (hoặc done cuối / đầu dải) khi vào / khi đổi world.
        LaunchedEffect(selectedWorld) {
            val focus = map.nodes.firstOrNull { nodeStateOf(it.id, stars) == NodeState.OPEN }
                ?: map.nodes.lastOrNull { nodeStateOf(it.id, stars) == NodeState.DONE }
                ?: map.nodes.first()
            scroll.scrollTo(scrollPxFor(focus))
        }

        Box(Modifier.fillMaxSize().verticalScroll(scroll)) {
            Box(Modifier.width(artW).height(artH)) {
                // Nền map vẽ sẵn (665×2365, tỉ lệ khớp 360×1280 → phủ vừa, không méo).
                Image(
                    painter = painterResource(map.bg),
                    contentDescription = null,
                    modifier = Modifier.matchParentSize(),
                    contentScale = ContentScale.FillBounds,
                )

                // Cổng → world kế (top:120, center): KHOÁ khi chưa đủ sao; MỞ + có màn → bấm sang world kế.
                Box(
                    Modifier.fillMaxWidth().offset(y = (120f * s).dp),
                    contentAlignment = Alignment.TopCenter,
                ) {
                    WorldGate(
                        nextWorld = map.nextWorld,
                        nextName = map.nextName,
                        earned = earned,
                        target = map.gateStarReq,
                        cleared = cleared,
                        totalLevels = levelCount(selectedWorld),
                        canAdvance = canAdvance,
                        s = s,
                        onGrind = { scope.launch { scroll.animateScrollTo(scrollPxFor(grindNode(map.nodes, stars))) } },
                        onEnter = { if (canAdvance) selectedWorld = map.nextWorld },
                    )
                }

                // 10 node trên đường mòn của world đang xem. Node BOSS (10/20/…) có cổng riêng.
                map.nodes.forEach { node ->
                    val state = nodeStateOf(node.id, stars)
                    val idx = CampaignLevels.ALL.indexOfFirst { it.id == node.id }
                    val onClick = { if (state != NodeState.LOCKED && idx >= 0) onPlay(idx) }
                    if (node.kind == NodeKind.BOSS) {
                        BossNode(node, state, stars[node.id] ?: 0, s, reducedMotion, onClick)
                    } else {
                        Box(
                            Modifier
                                .offset(x = ((node.x - NODE / 2f) * s).dp, y = ((node.y - NODE / 2f) * s).dp)
                                .size((NODE * s).dp)
                                // KHÔNG clip node — cung sao trong tile cần tràn ra ngoài Box.
                                .clickable(enabled = state != NodeState.LOCKED, onClick = onClick),
                            contentAlignment = Alignment.Center,
                        ) {
                            NodeView(node, state, stars[node.id] ?: 0, s, reducedMotion)
                        }
                    }
                }

                // Biển đáy: world > 1 → chip "← về world trước" (bấm quay lại); world 1 → biển khởi đầu.
                // NÂNG khỏi thanh điều hướng hệ thống (safeDrawing bottom + 12dp) để KHÔNG bị che (Pixel 9
                // gesture/3-nút): sign vốn ở đáy art trùng mép dưới màn → cuộn tới đáy sẽ lọt vào vùng nav.
                val navBottom = WindowInsets.safeDrawing.asPaddingValues().calculateBottomPadding()
                Box(
                    Modifier
                        .fillMaxWidth()
                        .offset(y = ((ART_H - 44f) * s).dp - navBottom - 12.dp),
                    contentAlignment = Alignment.TopCenter,
                ) {
                    if (selectedWorld > 1) {
                        StartSign("← ${WorldTheme.name(selectedWorld - 1).uppercase()}", s) { selectedWorld -= 1 }
                    } else {
                        StartSign(map.startSign, s)
                    }
                }
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

    // Sao vòng cung cho node đã hoàn thành — nằm TRONG tile, sát mép trên (design StarArc top≈size*0.18).
    if (state == NodeState.DONE) {
        StarArc(stars, s, modifier = Modifier.align(Alignment.TopCenter).offset(y = (3f * s).dp))
    }
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

/**
 * Ba sao vòng cung (design StarArc: giữa cao hơn, hai bên nghiêng ±18°). Vị trí dọc do NƠI GỌI đặt
 * qua [modifier] (offset) để đặt sao SÁT vào trong node. [starSize] = cỡ sao bên (giữa = +3), [width]
 * = bề ngang cung (khoảng cách 3 sao).
 */
@Composable
private fun StarArc(
    stars: Int,
    s: Float,
    starSize: Float = 15f,
    width: Float = 54f,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier.width((width * s).dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Bottom,
    ) {
        StarImg(stars >= 1, starSize, s, Modifier.offset(y = (2f * s).dp).rotate(-18f))
        StarImg(stars >= 2, starSize + 3f, s, Modifier.offset(y = (-3f * s).dp))
        StarImg(stars >= 3, starSize, s, Modifier.offset(y = (2f * s).dp).rotate(18f))
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

// ── Node BOSS (cổng boss riêng cho màn 10/20/…) — design world*-strip BossGateNode ────────────
// Bề ngang cổng boss. Giảm ~ cỡ node thường (NODE=62) cho đồng bộ với các node kề (khung ornate
// đọc to hơn con số nên để hơi nhỏ hơn tile thường). Đổi 1 giá trị này scale cả khung/số/sao.
private const val BOSS_W = 58f

private enum class BossVariant { LOCKED, CURRENT, CLEARED }

/**
 * ar = cao/rộng ảnh · vx,vy = neo TÂM PANEL theo % ảnh (định vị cổng trên đường mòn) · num = màu số.
 * [numY] = tâm SỐ theo % chiều cao khung (đặt trong panel, tránh crest/khoá) · [starY] = mép trên
 * cung SAO theo % chiều cao (chỉ cleared — crown sao trên đỉnh crest).
 */
private class BossMeta(
    val ar: Float, val vx: Float, val vy: Float, val num: Color,
    val numY: Float, val starY: Float,
)

private fun bossMeta(v: BossVariant): BossMeta = when (v) {
    // numY nhích xuống panel (crest chiếm đỉnh); locked panel cao hơn chút vì có ổ khoá ở đáy.
    BossVariant.LOCKED -> BossMeta(1.1118f, 0.477f, 0.423f, Color(0xFF8A6A2E), numY = 0.50f, starY = 0f)
    BossVariant.CURRENT -> BossMeta(1.0404f, 0.498f, 0.502f, Color(0xFF6A4A2E), numY = 0.54f, starY = 0f)
    BossVariant.CLEARED -> BossMeta(1.0266f, 0.500f, 0.501f, Color(0xFFB67A16), numY = 0.56f, starY = -0.04f)
}

private fun bossDrawable(v: BossVariant): Int = when (v) {
    BossVariant.LOCKED -> R.drawable.boss_gate_locked
    BossVariant.CURRENT -> R.drawable.boss_gate_current
    BossVariant.CLEARED -> R.drawable.boss_gate_cleared
}

/**
 * Cổng boss (màn cuối world): khung riêng 3 trạng thái (khoá vàng · hiện tại tím pulse · đã hạ +
 * sao). Neo TÂM PANEL (vx,vy) vào (node.x,node.y) như design PlaceNode; số + sao nằm TRONG khung.
 */
@Composable
private fun BossNode(
    node: MapNode, state: NodeState, stars: Int, s: Float, reducedMotion: Boolean, onClick: () -> Unit,
) {
    val variant = when (state) {
        NodeState.DONE -> BossVariant.CLEARED
        NodeState.OPEN -> BossVariant.CURRENT
        else -> BossVariant.LOCKED
    }
    val m = bossMeta(variant)
    val bw = BOSS_W
    val bh = bw * m.ar
    Box(
        Modifier
            .offset(x = ((node.x - m.vx * bw) * s).dp, y = ((node.y - m.vy * bh) * s).dp)
            .size(width = (bw * s).dp, height = (bh * s).dp)
            .clickable(enabled = state != NodeState.LOCKED, onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        if (variant == BossVariant.CURRENT) BossPulseHalo(bw, bh, s, reducedMotion)
        Image(
            painter = painterResource(bossDrawable(variant)),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
        )
        // Số màn ở TÂM panel (neo theo numY để không dính crest/khoá).
        Text(
            text = "${node.id}",
            color = m.num,
            fontSize = (bw * 0.32f * s).sp,
            fontWeight = FontWeight.Bold,
            fontFamily = MaterialTheme.typography.headlineMedium.fontFamily,
            modifier = Modifier.align(Alignment.TopCenter).offset(y = ((m.numY * bh - bw * 0.20f) * s).dp),
        )
        // Cung SAO crown trên đỉnh crest (chỉ khi đã hạ boss) — sát nhau, nằm trên số.
        if (variant == BossVariant.CLEARED) {
            StarArc(
                stars, s, starSize = 14f, width = 48f,
                modifier = Modifier.align(Alignment.TopCenter).offset(y = (m.starY * bh * s).dp),
            )
        }
    }
}

/** Quầng pulse tím (amethyst) quanh cổng boss ĐANG mở — bám gj-strip-pulse 1800ms. */
@Composable
private fun androidx.compose.foundation.layout.BoxScope.BossPulseHalo(
    bw: Float, bh: Float, s: Float, reducedMotion: Boolean,
) {
    val scale: Float; val alpha: Float
    if (reducedMotion) {
        scale = 1f; alpha = 0.6f
    } else {
        val t = rememberInfiniteTransition(label = "boss-pulse")
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
            .size(width = ((bw + 36f) * s).dp, height = ((bh + 28f) * s).dp)
            .graphicsLayer { scaleX = scale; scaleY = scale; this.alpha = alpha }
            .background(
                Brush.radialGradient(
                    0f to Color(0x99A99CF6),    // amethyst .60
                    0.55f to Color(0x477E6CF0), // gravity .28
                    0.80f to Color(0x007E6CF0), // 0
                ),
                CircleShape,
            ),
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
private fun WorldGate(
    nextWorld: Int,
    nextName: String,
    earned: Int,
    target: Int,
    cleared: Int,
    totalLevels: Int,
    canAdvance: Boolean,
    s: Float,
    onGrind: () -> Unit,
    onEnter: () -> Unit,
) {
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
            .then(
                when {
                    locked -> Modifier.clickable(onClick = onGrind)
                    canAdvance -> Modifier.clickable(onClick = onEnter)
                    else -> Modifier
                },
            )
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
                    "CỔNG · THẾ GIỚI $nextWorld",
                    color = Color(0xFF9B886F), fontSize = (8.5f * s).sp, fontWeight = FontWeight.ExtraBold,
                    letterSpacing = 0.12.em, fontFamily = body,
                )
                Text(
                    nextName,
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
                if (canAdvance) "VÀO THẾ GIỚI →" else "ĐÃ MỞ KHOÁ",
                color = Color(0xFF3F7D49), fontSize = (10.5f * s).sp, fontWeight = FontWeight.ExtraBold,
                letterSpacing = 0.10.em, fontFamily = body,
            )
        }
    }
}

@Composable
private fun StartSign(label: String, s: Float, onClick: (() -> Unit)? = null) {
    Text(
        label,
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
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
            .padding(horizontal = (14f * s).dp, vertical = (6f * s).dp),
    )
}
