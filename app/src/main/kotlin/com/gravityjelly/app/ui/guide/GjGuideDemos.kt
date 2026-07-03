package com.gravityjelly.app.ui.guide

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.ui.components.ComboPopup
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
import com.gravityjelly.game.gTrash
import com.gravityjelly.game.gVine
import com.gravityjelly.game.gVineRoot

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
private val Vr = gVineRoot
private val Vi = gVine
private val Tr = gTrash
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

/** Như [BeforeAfter] nhưng mỗi bàn có NHÃN dưới — để nói rõ "đầy cái gì → biến mất". */
@Composable
private fun LabeledBeforeAfter(
    beforeLabel: String,
    before: List<List<GuideCell>>,
    afterLabel: String,
    after: List<List<GuideCell>>,
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        LabeledBoard(beforeLabel, before, Modifier.weight(1f))
        GjIcon(
            icon = GjIcons.Chevron,
            contentDescription = null,
            modifier = Modifier.size(20.dp),
            tint = GjPalette.Gravity,
        )
        LabeledBoard(afterLabel, after, Modifier.weight(1f))
    }
}

@Composable
private fun LabeledBoard(label: String, rows: List<List<GuideCell>>, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        GuideMiniBoard(rows)
        Text(
            label,
            style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp),
            color = GjPalette.TextMuted,
        )
    }
}

// ── Xóa HÀNG (màn 1) — lấp đầy 1 HÀNG ngang (9 ô) → cả hàng biến mất ──────────────
@Composable
internal fun RowClearDemo() = LabeledBeforeAfter(
    beforeLabel = "Đầy 1 HÀNG",
    before = listOf(
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(J(P), J(B), J(Y), J(M), J(P)),    // HÀNG dưới đầy đủ
    ),
    afterLabel = "Biến mất",
    after = listOf(
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),                    // cả hàng biến mất
    ),
)

// ── Xóa CỘT (màn 2) — lấp đầy 1 CỘT dọc (9 ô) → cả cột biến mất ───────────────────
@Composable
internal fun ColClearDemo() = LabeledBeforeAfter(
    beforeLabel = "Đầy 1 CỘT",
    before = listOf(
        listOf(J(P), E, E),
        listOf(J(B), E, E),
        listOf(J(Y), E, E),
        listOf(J(M), E, E),
        listOf(J(P), E, E),                       // CỘT trái đầy đủ
    ),
    afterLabel = "Biến mất",
    after = listOf(
        listOf(E, E, E),
        listOf(E, E, E),
        listOf(E, E, E),
        listOf(E, E, E),
        listOf(E, E, E),                          // cả cột biến mất
    ),
)

// ── Combo ×2 (màn 8) — lấp đầy 2 HÀNG cùng một nước → nổ cả hai → ×2 hiện TRONG bàn ────
// KHÔNG dùng nhãn chữ dưới bàn: bàn-sau lồng ×2 y hệt lúc chơi (tái dùng [ComboPopup] game, thu nhỏ).
@Composable
internal fun ComboX2Demo() {
    Row(
        horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        GuideMiniBoard(
            listOf(
                listOf(E, E, E, E, E),
                listOf(J(Y), J(M), J(P), J(B), J(Y)),    // 2 HÀNG đáy đầy đủ cùng lúc
                listOf(J(P), J(B), J(Y), J(M), J(P)),
            ),
            Modifier.weight(1f),
        )
        GjIcon(
            icon = GjIcons.Chevron,
            contentDescription = null,
            modifier = Modifier.size(20.dp),
            tint = GjPalette.Gravity,
        )
        Box(Modifier.weight(1f), contentAlignment = Alignment.Center) {
            GuideMiniBoard(
                listOf(
                    listOf(E, E, E, E, E),
                    listOf(E, E, E, E, E),
                    listOf(E, E, E, E, E),               // cả hai hàng biến mất
                ),
            )
            // ×2 nảy lên GIỮA bàn như khi chơi (bong bóng gradient của game), thu nhỏ vừa bàn mini.
            Box(Modifier.wrapContentSize(unbounded = true)) {
                ComboPopup(
                    combo = 2,
                    showDish = false,
                    showPieces = false,
                    heightDp = 72.dp,
                    modifier = Modifier.graphicsLayer { scaleX = 0.5f; scaleY = 0.5f },
                )
            }
        }
    }
}

// ── 1. Xóa hàng / cột (cùng một luật) — hàng VÀ cột đầy đều biến mất ─────────────
@Composable
internal fun ClearLineDemo() = BeforeAfter(
    before = listOf(
        listOf(E, E, J(Y), E, E),
        listOf(E, E, J(M), E, E),
        listOf(J(P), J(B), J(Y), J(M), J(P)),    // HÀNG đầy
        listOf(E, E, J(B), E, E),
        listOf(E, E, J(P), E, E),                // CỘT giữa cũng đầy
    ),
    after = listOf(
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),                    // cả hàng VÀ cột đều biến mất
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
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

// ── 6. Ghép 2 khối giải phóng khác màu → cầu vồng siêu cấp ───────────────────────
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

// ── 7. Nổ siêu khối cấp 1 — quét sạch MỌI ô CÙNG MÀU siêu khối trên toàn bàn ─────
//     (kể cả ô vàng ở xa; ô khác màu — mint — KHÔNG bị quét, chỉ rơi xuống)
@Composable
internal fun DetonateSuper1Demo() = BeforeAfter(
    before = listOf(
        listOf(J(Y), E, E, E, J(Y)),             // vàng ở 4 góc XA
        listOf(E, E, J(M), E, E),
        listOf(E, J(M), S1(Y), J(M), E),         // siêu khối VÀNG, mint vây quanh
        listOf(E, E, J(M), E, E),
        listOf(J(Y), E, E, E, J(Y)),
    ),
    after = listOf(
        listOf(E, E, E, E, E),                   // mọi ô VÀNG + siêu khối biến mất
        listOf(E, E, E, E, E),
        listOf(E, E, E, E, E),
        listOf(E, E, J(M), E, E),
        listOf(E, J(M), J(M), J(M), E),          // chỉ mint còn lại, rơi xuống đáy
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

// ── 11. Dây leo mọc lan — giới thiệu (mỗi lượt mọc THÊM 1 đốt) ──────────────────
@Composable
internal fun VineIntroDemo() = LabeledBeforeAfter(
    beforeLabel = "Lượt 1",
    before = listOf(
        listOf(E, E,  E, E),
        listOf(E, Vi, E, E),                     // đã có 1 đốt
        listOf(E, Vr, E, E),                     // gốc
    ),
    afterLabel = "Lượt 2",
    after = listOf(
        listOf(E, Vi, E, E),                     // mọc THÊM 1 đốt/lượt
        listOf(E, Vi, E, E),
        listOf(E, Vr, E, E),                     // gốc vẫn ở
    ),
)

// ── 12. Cách phá dây leo — CÓ / KHÔNG có khối xanh lá (2 trường hợp) ────────────
@Composable
internal fun VineDestroyDemo() {
    Column(verticalArrangement = Arrangement.spacedBy(GjSpace.md)) {
        LabeledBeforeAfter(
            beforeLabel = "Không có xanh lá",
            before = listOf(
                listOf(E, Vi, E, E),
                listOf(J(Y), Vr, J(P), J(B)),    // hàng đầy, KHÔNG mint
            ),
            afterLabel = "Gốc sống sót!",
            after = listOf(
                listOf(E, Vi, E, E),
                listOf(E, Vr, E, E),              // gốc + dây leo còn nguyên
            ),
        )
        LabeledBeforeAfter(
            beforeLabel = "Có xanh lá ✓",
            before = listOf(
                listOf(E, Vi, E, E),
                listOf(J(Y), Vr, J(M), J(P)),    // hàng đầy, CÓ mint
            ),
            afterLabel = "Phá triệt để!",
            after = listOf(
                listOf(E, E, E, E),
                listOf(E, E, E, E),               // gốc + cả dây tan
            ),
        )
    }
}

// ── 13. Rác rừng — cắt dây leo rời gốc → hoá rác cố định ─────────────────────────
@Composable
internal fun VineToTrashDemo() = BeforeAfter(
    before = listOf(
        listOf(E, Vi, E, E),                     // đốt trên (sẽ bị cắt rời)
        listOf(J(Y), Vi, J(P), J(B)),            // hàng cắt qua (KHÔNG mint)
        listOf(E, Vr, E, E),                     // gốc
    ),
    after = listOf(
        listOf(E, Tr, E, E),                     // đốt rời → RÁC (cố định tại chỗ)
        listOf(E, E, E, E),                      // hàng đã xoá
        listOf(E, Vr, E, E),                     // gốc sống sót
    ),
)

// ── 14. Cách phá rác rừng — chỉ siêu khối mới phá được ───────────────────────────
@Composable
internal fun TrashDestroyDemo() = LabeledBeforeAfter(
    beforeLabel = "Siêu khối nổ",
    before = listOf(
        listOf(E, Tr, E),
        listOf(Tr, S1(Y), Tr),                   // siêu khối bao quanh bởi rác
        listOf(E, Tr, E),
    ),
    afterLabel = "Rác biến mất!",
    after = listOf(
        listOf(E, E, E),
        listOf(E, E, E),                          // tất cả rác bị phá
        listOf(E, E, E),
    ),
)
