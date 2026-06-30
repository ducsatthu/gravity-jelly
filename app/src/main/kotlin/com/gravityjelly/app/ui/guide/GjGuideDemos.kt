package com.gravityjelly.app.ui.guide

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.core.JellyColor
import com.gravityjelly.game.GuideCell
import com.gravityjelly.game.GuideMiniBoard
import com.gravityjelly.game.gEmpty
import com.gravityjelly.game.gJelly
import com.gravityjelly.game.gRainbow
import com.gravityjelly.game.gRainbow2
import com.gravityjelly.game.gStone
import com.gravityjelly.game.gSuper1
import com.gravityjelly.game.gSuper2

/**
 * Minh hoạ "TRƯỚC → SAU" cho từng cơ chế trong popup dạy luật / cẩm nang. Dùng [GuideMiniBoard] của
 * :game (vẽ khối jelly thật) nên người chơi nhận ra ngay vật thật. Mỗi demo = bàn-trước, mũi tên,
 * bàn-sau cùng kích thước. KHÔNG tự chế hình khối — bám draw-funcs board (xem skill design-fidelity).
 */

// ── shorthand dựng lưới gọn ──────────────────────────────────────────────────────
private val E = gEmpty
private val St = gStone
private val Rb = gRainbow
private val Rb2 = gRainbow2
private fun J(c: JellyColor) = gJelly(c)
private fun S1(c: JellyColor) = gSuper1(c)
private fun S2(c: JellyColor) = gSuper2(c)
private val Y = JellyColor.YELLOW
private val M = JellyColor.MINT
private val P = JellyColor.PINK
private val B = JellyColor.BLUE

/** Bố cục chung: bàn-trước · mũi tên (Chevron mặc định trỏ phải) · bàn-sau, hai bàn cùng bề rộng. */
@Composable
private fun BeforeAfter(
    before: List<List<GuideCell>>,
    after: List<List<GuideCell>>,
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        GuideMiniBoard(before, Modifier.weight(1f))
        GjIcon(
            icon = GjIcons.Chevron,
            contentDescription = null,
            modifier = Modifier.size(20.dp),
            tint = GjPalette.Gravity,
        )
        GuideMiniBoard(after, Modifier.weight(1f))
    }
}

// ── 1. Xóa hàng ──────────────────────────────────────────────────────────────────
@Composable
internal fun ClearRowDemo() = BeforeAfter(
    before = listOf(
        listOf(E, E, E, E, E),
        listOf(J(P), E, E, E, J(B)),
        listOf(J(Y), J(M), J(P), J(B), J(Y)),  // hàng đáy đầy
    ),
    after = listOf(
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(J(P), E, E, E, J(B)),            // hàng đầy biến mất, 2 ô lẻ rơi xuống
    ),
)

// ── 2. Xóa cột ───────────────────────────────────────────────────────────────────
@Composable
internal fun ClearColumnDemo() = BeforeAfter(
    before = listOf(
        listOf(E, J(Y), E),
        listOf(E, J(M), E),
        listOf(E, J(P), E),
        listOf(J(B), J(B), E),
        listOf(E, J(Y), E),                      // cột giữa đầy
    ),
    after = listOf(
        listOf(E, E, E),
        listOf(E, E, E),
        listOf(E, E, E),
        listOf(E, E, E),
        listOf(J(B), E, E),                      // cột giữa biến mất, ô lẻ rơi xuống
    ),
)

// ── Trọng lực rơi — rơi tới khi gặp khối khác / đáy ──────────────────────────────
@Composable
internal fun GravityDropDemo() = BeforeAfter(
    before = listOf(
        listOf(E, E, J(Y)),
        listOf(E, E, E),
        listOf(J(M), E, E),
        listOf(E, E, E),
        listOf(E, E, J(B)),                      // khối chặn ở đáy cột phải
    ),
    after = listOf(
        listOf(E, E, E),
        listOf(E, E, E),
        listOf(E, E, E),
        listOf(E, E, J(Y)),                      // vàng rơi, DỪNG ngay trên khối xanh
        listOf(J(M), E, J(B)),                   // mint rơi tới đáy
    ),
)

// ── Thạch dính cụm — cả khối dừng nếu 1 thạch bị chặn ────────────────────────────
@Composable
internal fun StickyClusterDemo() = BeforeAfter(
    before = listOf(
        listOf(E, J(M), J(M), E),                // cụm mint chữ L (3 ô dính nhau)
        listOf(E, J(M), E, E),
        listOf(E, E, St, E),                     // đá chặn dưới ô phải của cụm
        listOf(E, E, E, E),
        listOf(E, E, E, E),
    ),
    after = listOf(
        listOf(E, E, E, E),
        listOf(E, J(M), J(M), E),                // cả cụm chỉ rơi 1 ô rồi DỪNG…
        listOf(E, J(M), St, E),                  // …vì ô phải chạm đá (dù cột trái còn trống)
        listOf(E, E, E, E),
        listOf(E, E, E, E),
    ),
)

// ── 3. Siêu khối: BA cách tạo (hàng / cột / 3×3 cùng màu) → 1 siêu khối ──────────
@Composable
internal fun FormSuper1Demo() {
    Row(
        horizontalArrangement = Arrangement.spacedBy(GjSpace.xs),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Super1Source(
            "Hàng",
            listOf(listOf(E, E, E), listOf(J(Y), J(Y), J(Y)), listOf(E, E, E)),
        )
        Super1Source(
            "Cột",
            listOf(listOf(E, J(M), E), listOf(E, J(M), E), listOf(E, J(M), E)),
        )
        Super1Source(
            "3×3",
            listOf(listOf(J(P), J(P), J(P)), listOf(J(P), J(P), J(P)), listOf(J(P), J(P), J(P))),
        )
        GjIcon(GjIcons.Chevron, contentDescription = null, modifier = Modifier.size(18.dp), tint = GjPalette.Gravity)
        GuideMiniBoard(
            listOf(listOf(E, E, E), listOf(E, S1(Y), E), listOf(E, E, E)),
            Modifier.width(46.dp),
        )
    }
}

/** Một "nguồn" tạo siêu khối: mini-board nhỏ + nhãn cách tạo (Hàng / Cột / 3×3). */
@Composable
private fun Super1Source(label: String, rows: List<List<GuideCell>>) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(3.dp),
    ) {
        GuideMiniBoard(rows, Modifier.width(46.dp))
        Text(
            label,
            style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp),
            color = GjPalette.TextMuted,
        )
    }
}

// ── 4. 3×3 ba màu → cầu vồng ──────────────────────────────────────────────────────
@Composable
internal fun FormRainbowDemo() = BeforeAfter(
    before = listOf(
        listOf(J(P), J(M), J(B)),
        listOf(J(P), J(M), J(B)),
        listOf(J(P), J(M), J(B)),
    ),
    after = listOf(
        listOf(E, E, E),
        listOf(E, Rb, E),
        listOf(E, E, E),
    ),
)

// ── 5. Ghép 2 siêu khối cùng màu → cấp 2 ─────────────────────────────────────────
@Composable
internal fun FormSuper2Demo() = BeforeAfter(
    before = listOf(
        listOf(E, E, E),
        listOf(S1(Y), S1(Y), E),
        listOf(E, E, E),
    ),
    after = listOf(
        listOf(E, E, E),
        listOf(E, S2(Y), E),
        listOf(E, E, E),
    ),
)

// ── 6. Ghép 2 kíp nổ khác màu → cầu vồng siêu cấp ────────────────────────────────
@Composable
internal fun FormRainbow2Demo() = BeforeAfter(
    before = listOf(
        listOf(E, E, E),
        listOf(S1(Y), S1(B), E),
        listOf(E, E, E),
    ),
    after = listOf(
        listOf(E, E, E),
        listOf(E, Rb2, E),
        listOf(E, E, E),
    ),
)

// ── 7. Nổ siêu khối cấp 1 — quét sạch cùng màu toàn bàn ──────────────────────────
@Composable
internal fun DetonateSuper1Demo() = BeforeAfter(
    before = listOf(
        listOf(E, J(Y), E, E, E),
        listOf(E, E, E, J(Y), E),
        listOf(J(M), E, E, E, J(B)),
        listOf(E, E, J(Y), E, E),
        listOf(J(M), J(B), S1(Y), J(P), J(B)),   // siêu khối bị cuốn vào hàng xóa
    ),
    after = listOf(
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(J(M), E, E, E, J(B)),             // chỉ ô khác màu còn sót
    ),
)

// ── 8. Nổ siêu khối cấp 2 — cùng màu + vùng 5×5 ──────────────────────────────────
@Composable
internal fun DetonateSuper2Demo() = BeforeAfter(
    before = listOf(
        listOf(J(P), E, E, E, E, E, J(P)),       // góc xa NGOÀI 5×5 → sống sót
        listOf(E, E, J(M), J(Y), J(M), E, E),
        listOf(E, J(B), J(Y), S2(Y), J(Y), J(B), E),
        listOf(E, E, J(M), J(Y), J(M), E, E),
        listOf(J(P), E, E, E, E, E, J(P)),
    ),
    after = listOf(
        listOf(E, E, E, E, E, E, E),
        listOf(E, E, E, E, E, E, E),
        listOf(E, E, E, E, E, E, E),
        listOf(J(P), E, E, E, E, E, J(P)),       // chỉ góc xa rơi xuống còn lại
        listOf(J(P), E, E, E, E, E, J(P)),
    ),
)

// ── 9. Nổ cầu vồng — quét các màu đang KỀ ────────────────────────────────────────
@Composable
internal fun DetonateRainbow1Demo() = BeforeAfter(
    before = listOf(
        listOf(J(B), E, E, E, J(B)),             // xanh KHÔNG kề → sống sót
        listOf(E, E, J(M), E, E),                // mint kề trên
        listOf(J(P), E, Rb, E, J(P)),
        listOf(E, E, J(P), E, E),                // hồng kề dưới
        listOf(J(M), E, J(B), E, J(M)),
    ),
    after = listOf(
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(J(B), E, J(B), E, J(B)),          // chỉ xanh (không kề) còn lại
    ),
)

// ── 10. Nổ cầu vồng siêu cấp — xóa sạch toàn bàn ─────────────────────────────────
@Composable
internal fun DetonateRainbow2Demo() = BeforeAfter(
    before = listOf(
        listOf(J(M), J(B), J(P), J(Y), J(M)),
        listOf(J(Y), J(P), St, J(B), J(P)),
        listOf(J(B), J(M), Rb2, J(Y), J(M)),
        listOf(J(P), J(Y), J(M), J(B), J(Y)),
        listOf(J(M), J(B), J(P), J(Y), J(B)),
    ),
    after = listOf(
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),                   // sạch trơn — kể cả đá
    ),
)
