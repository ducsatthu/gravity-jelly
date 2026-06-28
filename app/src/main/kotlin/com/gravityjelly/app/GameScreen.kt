package com.gravityjelly.app

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import com.gravityjelly.app.ui.components.ComboPopup
import com.gravityjelly.app.ui.components.GjHud
import com.gravityjelly.app.ui.components.GjTray
import com.gravityjelly.app.ui.components.GravityRotateButton
import com.gravityjelly.app.ui.layout.GjScreenScaffold
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.core.Direction
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.PieceLibrary
import com.gravityjelly.game.BoardCanvas
import com.gravityjelly.game.EndlessGameHolder
import com.gravityjelly.game.JellyMeadow
import com.gravityjelly.game.MeadowLayer
import com.gravityjelly.game.PieceThumbnail
import com.gravityjelly.game.rememberGameDriver

/**
 * Màn Game — ráp design-faithful theo `04-screens/game-screen.jsx` (ưu tiên #1).
 *
 * Thứ tự dọc: **Hud (56dp)** → **vùng bàn** (slot [board], 1:1 trong giếng) →
 * **dải điều khiển** (JellyMeadow + ComboPopup nổi trên) → **FAB xoay + nhãn XOAY** →
 * **Tray (112dp)**.
 *
 * Đây là lớp **vỏ bố cục** thuần: KHÔNG chứa luật chơi, KHÔNG tự vẽ bàn — bàn do
 * [board] slot cung cấp ([BoardCanvas] nối holder ở nơi gọi). Dữ liệu (score/
 * direction/turnsLeft/pieces/selectedIndex) truyền vào; nối input thật ở file 06.
 *
 * @param board slot vẽ bàn — nhận Modifier đã định cỡ (fillMaxWidth + aspectRatio 1).
 * @param comboBurst mức combo đang nổ (0 = không). >0 → chữ ×N mở ra PHÍA TRÊN band +
 *   jelly block RƠI TỪ BOARD xuống vườn (đúng game-screen.jsx: 2 ComboPopup tách lớp).
 */
@Composable
fun GameScreen(
    score: Int,
    direction: Direction,
    turnsLeft: Int,
    pieces: List<Piece?>,
    selectedIndex: Int,
    onPause: () -> Unit,
    onSelectPiece: (Int) -> Unit,
    onRotate: () -> Unit,
    modifier: Modifier = Modifier,
    showMeadow: Boolean = true,
    comboBurst: Int = 0,
    // false → band KHÔNG vẽ chữ ×N (lớp vỏ tự đặt overlay ăn mừng TẠI vùng resolve trên bàn).
    // Mảnh jelly rơi vào đĩa vườn VẪN giữ (hiệu ứng "vỡ jelly rơi xuống vườn", không đổi).
    showComboText: Boolean = true,
    traySlotModifier: (Int) -> Modifier = { Modifier },
    board: @Composable (Modifier) -> Unit,
) {
    GjScreenScaffold(modifier = modifier, applyGutter = false) {
        // Lớp nền riêng của màn game (game-screen.jsx §decorative backdrop):
        // 4 blob jelly mờ ở các góc, buộc nền kem nối với bàn màu sắc.
        Box(modifier = Modifier.fillMaxSize().drawBehind { drawGameBlobs() })

        Column(modifier = Modifier.fillMaxSize()) {

            // ── HUD ───────────────────────────────────────────────────────────
            GjHud(
                score     = score,
                direction = direction,
                onPause   = onPause,
                modifier  = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = GjSpace.lg, vertical = GjSpace.sm),
            )

            // ── Vùng bàn (giếng lõm 1:1, gutter ngang 16dp) ───────────────────
            Box(
                modifier         = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center,
            ) {
                // Khung khay kẹo (game-screen.jsx) bọc giếng lõm: panel trắng→kem,
                // viền, cạnh 3D đáy, sheen đỉnh, 4 stud góc. Giếng (BoardCanvas) nằm trong.
                BoardFrame(
                    modifier = Modifier
                        .fillMaxWidth()
                        // Gutter PHẢI đặt trước aspectRatio: padding(horizontal) chỉ co bề
                        // rộng, nếu đặt sau 1:1 thì khung/giếng thành hình chữ nhật cao
                        // (well to hơn lưới, không vuông). Co bề rộng trước → vuông thật.
                        .padding(horizontal = GjSpace.lg)
                        .aspectRatio(1f),
                ) { inner -> board(inner) }
            }

            // ── Dải điều khiển: combo zone (cao cố định để combo không reflow bàn;
            //    overflow "visible": chữ pop LÊN trên, mảnh RƠI từ board xuống) ─────
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp),
            ) {
                // Khay "đĩa jelly" rộng BẰNG BOARD (gutter ngang 16dp như board frame) +
                // bo góc 18dp (JellyScene §band borderRadius:18), KHÔNG full-width.
                val meadowMod = Modifier
                    .fillMaxSize()
                    .padding(horizontal = GjSpace.lg)
                    .clip(RoundedCornerShape(18.dp))

                // Vẽ vườn THÀNH 2 LỚP để mảnh combo rơi KHUẤT SAU nấm/cây:
                //   backdrop (nền+đồi+đất) → mảnh rơi → prop (cỏ/bụi/hoa/jelly/nấm/orb).
                if (showMeadow) JellyMeadow(modifier = meadowMod, layer = MeadowLayer.BACKDROP)

                // (1) jelly block RƠI TỪ BOARD xuống vườn — heightDp 172 > band 100 nên mảnh
                //     bắt đầu rơi từ vùng board phía trên; nằm GIỮA backdrop & prop → bị nấm/cây che.
                if (comboBurst >= 2) {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.BottomCenter) {
                        ComboPopup(
                            combo    = comboBurst,
                            visible  = true,
                            showDish = false,
                            showText = false,
                            heightDp = 172.dp,
                        )
                    }
                }

                if (showMeadow) JellyMeadow(modifier = meadowMod, layer = MeadowLayer.PROPS)

                // (2) chữ ×N + lời khen MỞ RA PHÍA TRÊN band (top:-26). showPieces=false.
                // Bỏ qua khi [showComboText]=false (live game đặt overlay tại vùng resolve trên bàn).
                if (comboBurst >= 2 && showComboText) {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.TopCenter) {
                        ComboPopup(
                            combo      = comboBurst,
                            visible    = true,
                            showDish   = false,
                            showPieces = false,
                            modifier   = Modifier.offset(y = (-26).dp),
                        )
                    }
                }
            }

            // ── Hàng FAB: cụm jelly ló (trái) · nút xoay + nhãn XOAY (phải) ────
            Row(
                modifier              = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = GjSpace.lg, vertical = GjSpace.xs),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment     = Alignment.Bottom,
            ) {
                JellyPile()
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    GravityRotateButton(turnsLeft = turnsLeft, onRotate = onRotate)
                    Text(
                        text  = "XOAY",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight    = FontWeight.SemiBold,
                            letterSpacing = 0.04.em,
                        ),
                        color = GjPalette.GravityEdge,
                    )
                }
            }

            // ── Tray 3 mảnh ───────────────────────────────────────────────────
            GjTray(
                pieces        = pieces,
                selectedIndex = selectedIndex,
                onSelect      = onSelectPiece,
                modifier      = Modifier.fillMaxWidth(),
                slotModifier  = traySlotModifier,
            )
        }
    }
}

// ── Khung khay kẹo quanh board (game-screen.jsx §board frame) ───────────────────

private val PanelTop   = Color(0xFFFFFFFF)
private val PanelBot   = Color(0xFFFBF1DF)
private val FrameEdge  = Color(0xFFE9D7BA)   // cạnh 3D đáy: boxShadow 0 5px 0
private val FrameBdr   = Color(0xFFF1E3C9)   // viền 1.5px
private val SheenWhite = Color(0x73FFFFFF)   // sheen đỉnh rgba(255,255,255,0.45)
private val BoardLip   = 4.dp                // bề dày cạnh 3D lộ ở đáy panel

/**
 * Khung khay kẹo bóng (echo JellyBlock): panel gradient trắng→kem, viền mảnh, cạnh 3D
 * lộ ở đáy, vệt sáng đỉnh, 4 stud jelly ở góc. [content] = giếng lõm (BoardCanvas) đặt
 * trong với padding đều để lưới vẫn vuông; nhận Modifier để tự đo bounds cho kéo-thả.
 */
@Composable
private fun BoardFrame(
    modifier: Modifier,
    content: @Composable (Modifier) -> Unit,
) {
    Box(
        modifier = modifier.drawBehind { drawBoardFrame() },
        contentAlignment = Alignment.Center,
    ) {
        // Khung khay padding 6dp (game-screen.jsx: padding 6) để lưới gần kín như design.
        // Dồn nửa lip xuống đáy (top = base−lip/2, bottom = base+lip/2) → giếng canh giữa
        // trong panel trắng (gap trắng trên = dưới), vẫn VUÔNG (tổng pad dọc = ngang).
        val base = 6.dp
        content(
            Modifier
                .fillMaxSize()
                .padding(
                    start  = base,
                    end    = base,
                    top    = base - BoardLip / 2,
                    bottom = base + BoardLip / 2,
                ),
        )
    }
}

/** Vẽ panel + cạnh + viền + sheen + stud. Lớp tĩnh (chỉ vẽ lại khi recompose, không mỗi vsync). */
private fun DrawScope.drawBoardFrame() {
    val lip   = BoardLip.toPx()
    val r     = CornerRadius(10.dp.toPx())
    val w     = size.width
    val panelH = size.height - lip

    // bóng đổ mềm dưới khung
    drawRoundRect(Color(0x1F785C34), topLeft = Offset(0f, 6.dp.toPx()), size = Size(w, panelH), cornerRadius = r)
    // cạnh 3D (lộ 4dp ở đáy)
    drawRoundRect(FrameEdge, size = size, cornerRadius = r)
    // panel trắng→kem
    drawRoundRect(
        brush = Brush.verticalGradient(listOf(PanelTop, PanelBot), startY = 0f, endY = panelH),
        size = Size(w, panelH), cornerRadius = r,
    )
    // viền mảnh
    drawRoundRect(FrameBdr, size = Size(w, panelH), cornerRadius = r, style = Stroke(1.5.dp.toPx()))
    // sheen đỉnh
    drawOval(SheenWhite, topLeft = Offset(w * 0.2f, 3.dp.toPx()), size = Size(w * 0.6f, 12.dp.toPx()))
    // 4 stud jelly góc (pink TL · mint TR · yellow BL · blue BR) — inset 5dp (≈ design
    // top/left:4) để nằm trọn ở góc panel, rõ vòng tròn; giếng bo góc 12dp nên không bị che.
    val si = 5.dp.toPx(); val sr = 3.dp.toPx()
    drawCircle(GjPalette.BlockPink,   sr, Offset(si,     si))
    drawCircle(GjPalette.BlockMint,   sr, Offset(w - si, si))
    drawCircle(GjPalette.BlockYellow, sr, Offset(si,     panelH - si))
    drawCircle(GjPalette.BlockBlue,   sr, Offset(w - si, panelH - si))
}

// ── Nền blob jelly mờ ở 4 góc (game-screen.jsx §blobs) ──────────────────────────

private fun DrawScope.drawGameBlobs() {
    fun blob(cxF: Float, cyF: Float, rDp: Float, color: Color) {
        val c   = Offset(size.width * cxF, size.height * cyF)
        val rad = rDp.dp.toPx()
        drawCircle(
            brush  = Brush.radialGradient(
                listOf(color.copy(alpha = 0.50f), color.copy(alpha = 0f)),
                center = c, radius = rad,
            ),
            radius = rad, center = c,
        )
    }
    blob(0.04f, 0.12f, 62f, GjPalette.BlockPinkShine)
    blob(0.99f, 0.06f, 78f, GjPalette.BlockMintShine)
    blob(0.22f, 0.33f, 34f, GjPalette.BlockYellowShine)
    blob(0.93f, 0.24f, 42f, GjPalette.BlockBlueShine)
}

/**
 * Cụm nhân vật jelly nhỏ "ló lên" cạnh trái hàng FAB (trang trí).
 *
 * Bám đúng game-screen.jsx §"a little pile of jelly characters": container 128×56,
 * 3 khối CHỒNG nhau, nghiêng nhẹ, khối pink TO hơn và nằm TRƯỚC (vẽ sau cùng).
 * Toạ độ (left/bottom/size) lấy thẳng từ JSX:
 *   yellow size40 left4  bottom0 rot-9
 *   pink   size46 left36 bottom3 rot5  (z trên)
 *   mint   size38 left80 bottom0 rot11
 */
@Composable
private fun JellyPile() {
    Box(Modifier.size(width = 128.dp, height = 56.dp)) {
        // vẽ yellow + mint trước, pink sau cùng để nó nằm phía trước (z cao nhất)
        PileJelly(JellyColor.YELLOW, blockDp = 40f, leftDp = 4f,  bottomDp = 0f, rot = -9f)
        PileJelly(JellyColor.MINT,   blockDp = 38f, leftDp = 80f, bottomDp = 0f, rot = 11f)
        PileJelly(JellyColor.PINK,   blockDp = 46f, leftDp = 36f, bottomDp = 3f, rot = 5f)
    }
}

/**
 * Một khối jelly đơn (DOT) trong [JellyPile], render qua [PieceThumbnail] với mắt + sticker.
 * [blockDp] = cỡ khối mong muốn (theo JSX); [leftDp]/[bottomDp] = vị trí trong container 128×56.
 *
 * PieceThumbnail vẽ khối = cellDp·(1−GAP_FRAC) canh giữa hộp Canvas; chọn cellDp=blockDp/0.94 để
 * khối đạt đúng cỡ, hộp = cell+4 (khối lùi vào ~2dp mỗi cạnh, chừa biên cho viền + xoay không bị cắt).
 */
@Composable
private fun PileJelly(color: JellyColor, blockDp: Float, leftDp: Float, bottomDp: Float, rot: Float) {
    val cellDp = blockDp / 0.94f          // bù GAP_FRAC=0.06 trong drawPieceShape
    val boxDp  = cellDp + 4f
    // khối nằm lùi 2dp trong hộp → bù vào offset để TL khối trùng (leftDp, top thiết kế)
    val topDp  = 56f - blockDp - bottomDp
    PieceThumbnail(
        piece    = Piece(PieceLibrary.DOT, color),
        cellDp   = cellDp,
        modifier = Modifier
            .offset(x = (leftDp - 2f).dp, y = (topDp - 2f).dp)
            .size(boxDp.dp)
            .rotate(rot),
    )
}

// ── preview (dữ liệu mẫu qua EndlessGameHolder cho bàn sống) ────────────────────

@Preview(name = "GameScreen — dữ liệu mẫu", widthDp = 360, heightDp = 800)
@Composable
private fun GameScreenPreview() {
    GravityJellyTheme {
        val holder     = remember { EndlessGameHolder(seed = 12345L) }
        val renderTick = rememberGameDriver(holder.animator)
        val shell      = holder.shell
        GameScreen(
            score         = shell.score,
            direction     = holder.boardRender.gravity,
            turnsLeft     = shell.budget,
            pieces        = shell.tray.map { it as Piece? },
            selectedIndex = 0,
            onPause       = {},
            onSelectPiece = {},
            onRotate      = { holder.rotate(cw = true) },
            comboBurst    = 3,
            board         = { m ->
                BoardCanvas(
                    render     = { holder.boardRender },
                    renderTick = renderTick.value,
                    animator   = holder.animator,
                    modifier   = m,
                )
            },
        )
    }
}
