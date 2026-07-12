package com.gravityjelly.core

object PieceLibrary {

    private fun s(vararg c: Pair<Int, Int>) = Shape.of(*c)

    // ── Monomino (1 ô) ──
    val DOT = s(0 to 0)

    // ── Domino (2 ô) ──
    val I2H = s(0 to 0, 1 to 0)
    val I2V = s(0 to 0, 0 to 1)

    // ── Tromino (3 ô) ──
    val I3H = s(0 to 0, 1 to 0, 2 to 0)
    val I3V = s(0 to 0, 0 to 1, 0 to 2)
    val L3_0 = s(0 to 0, 1 to 0, 0 to 1)
    val L3_1 = s(0 to 0, 1 to 0, 1 to 1)
    val L3_2 = s(0 to 0, 0 to 1, 1 to 1)
    val L3_3 = s(1 to 0, 0 to 1, 1 to 1)

    // ── Tetromino (4 ô) ──
    val I4H = s(0 to 0, 1 to 0, 2 to 0, 3 to 0)
    val I4V = s(0 to 0, 0 to 1, 0 to 2, 0 to 3)
    val O4  = s(0 to 0, 1 to 0, 0 to 1, 1 to 1)

    val T4_0 = s(0 to 0, 1 to 0, 2 to 0, 1 to 1)
    val T4_1 = s(0 to 0, 0 to 1, 1 to 1, 0 to 2)
    val T4_2 = s(1 to 0, 0 to 1, 1 to 1, 2 to 1)
    val T4_3 = s(1 to 0, 0 to 1, 1 to 1, 1 to 2)

    val S4  = s(1 to 0, 2 to 0, 0 to 1, 1 to 1)
    val S4V = s(0 to 0, 0 to 1, 1 to 1, 1 to 2)
    val Z4  = s(0 to 0, 1 to 0, 1 to 1, 2 to 1)
    val Z4V = s(1 to 0, 0 to 1, 1 to 1, 0 to 2)

    val L4_0 = s(0 to 0, 0 to 1, 0 to 2, 1 to 2)
    val L4_1 = s(0 to 0, 1 to 0, 2 to 0, 0 to 1)
    val L4_2 = s(0 to 0, 1 to 0, 1 to 1, 1 to 2)
    val L4_3 = s(2 to 0, 0 to 1, 1 to 1, 2 to 1)

    val J4_0 = s(1 to 0, 1 to 1, 0 to 2, 1 to 2)
    val J4_1 = s(0 to 0, 0 to 1, 1 to 1, 2 to 1)
    val J4_2 = s(0 to 0, 1 to 0, 0 to 1, 0 to 2)
    val J4_3 = s(0 to 0, 1 to 0, 2 to 0, 2 to 1)

    // ── Pentomino (5 ô) ──
    val I5H  = s(0 to 0, 1 to 0, 2 to 0, 3 to 0, 4 to 0)
    val I5V  = s(0 to 0, 0 to 1, 0 to 2, 0 to 3, 0 to 4)
    val PLUS = s(1 to 0, 0 to 1, 1 to 1, 2 to 1, 1 to 2)

    /** V/L lớn — hai nhánh 3 ô chung góc (V-pentomino). Base = nhánh dọc trái + nhánh ngang dưới. */
    val V5 = s(0 to 0, 0 to 1, 0 to 2, 1 to 2, 2 to 2)
    /** T lớn — hàng ngang 3 ô + thân 2 ô rủ xuống giữa (T-pentomino). */
    val T5 = s(0 to 0, 1 to 0, 2 to 0, 1 to 1, 1 to 2)
    /** Chữ U — hàng dưới 3 ô + hai chân dựng hai đầu (U-pentomino). */
    val U5 = s(0 to 0, 2 to 0, 0 to 1, 1 to 1, 2 to 1)

    // ── Khối vuông lớn (9 ô) — chiếm trọn một vùng 3×3 ──
    val SQ9 = s(
        0 to 0, 1 to 0, 2 to 0,
        0 to 1, 1 to 1, 2 to 1,
        0 to 2, 1 to 2, 2 to 2,
    )

    // ── Khối CHÉO (ô RỜI, không liền cạnh) — "bẫy" nâng cao: tự tách khi có trọng lực cụm ──
    val D2 = s(0 to 0, 1 to 1)            // chéo 2 ô
    val D3 = s(0 to 0, 1 to 1, 2 to 2)    // chéo 3 ô

    /** Bốn hướng quay khác nhau của [base] (đối xứng thì ít hơn 4), đã canonical qua [Shape.rotateCW]. */
    private fun rot4(base: Shape): List<Shape> {
        val out = ArrayList<Shape>(4)
        var cur = base
        repeat(4) {
            if (cur !in out) out.add(cur)
            cur = cur.rotateCW()
        }
        return out
    }

    /** Các khối chéo (hình RỜI). Tách riêng để test bất biến "liền ô" bỏ qua đúng nhóm này. */
    val DIAGONAL: List<Shape> = rot4(D2) + rot4(D3)

    val ALL: List<Shape> = buildList {
        add(DOT)
        add(I2H); add(I2V)
        addAll(listOf(I3H, I3V, L3_0, L3_1, L3_2, L3_3))
        addAll(listOf(I4H, I4V, O4))
        addAll(listOf(T4_0, T4_1, T4_2, T4_3))
        addAll(listOf(S4, S4V, Z4, Z4V))
        addAll(listOf(L4_0, L4_1, L4_2, L4_3))
        addAll(listOf(J4_0, J4_1, J4_2, J4_3))
        addAll(listOf(I5H, I5V, PLUS))
        // Bổ sung cho đủ 24 kiểu theo thiết kế (design/…/03-tray): V/T/U-pentomino 4 hướng, vuông 3×3, chéo.
        addAll(rot4(V5))
        addAll(rot4(T5))
        addAll(rot4(U5))
        add(SQ9)
        addAll(DIAGONAL)
    }

    val HARD: List<Shape> = ALL.filter { it.size >= 3 }

    /**
     * Khối "ĐẶC BIỆT" (cồng kềnh/nâng cao): pentomino 5 ô, vuông 3×3, và khối chéo rời. Hiếm trong
     * bốc thường (cản combo) → được CHÈN ĐỊNH KỲ để người chơi vẫn gặp đủ 24 loại. Xem [WaveGenerator].
     */
    val SPECIAL: List<Shape> = ALL.filter { it.size >= 5 || it in DIAGONAL }

    /**
     * Khối đặc biệt gom theo KIỂU (mỗi kiểu = các hướng của nó). Chèn định kỳ bốc CÔNG BẰNG theo kiểu
     * (không theo số hướng) để mọi kiểu — kể cả 3×3 (chỉ 1 hướng) — có cơ hội ngang nhau xuất hiện.
     */
    val SPECIAL_KINDS: List<List<Shape>> = listOf(
        listOf(I5H, I5V),   // I-pentomino
        listOf(PLUS),       // chữ thập
        rot4(V5),           // V/L lớn
        rot4(T5),           // T lớn
        rot4(U5),           // chữ U
        listOf(SQ9),        // vuông 3×3
        rot4(D2),           // chéo 2
        rot4(D3),           // chéo 3
    )

    /**
     * Dựng [Piece] để bỏ vào khay. Với hầu hết hình → đơn sắc [color]. RIÊNG vuông 3×3 ([SQ9]):
     * tô **vành ngoài = [color]**, **TÂM = màu khác** (cách 2 bậc trong bảng 4 màu → luôn khác) để
     * khối 3×3 KHÔNG phải cụm 9 ô cùng màu — tránh vừa đặt đã tự merge thành Thạch Hoàng Gia. Người
     * chơi vẫn có thể tự xếp 3×3 cùng màu từ nhiều mảnh để tạo siêu khối. Deterministic, không dùng rng.
     */
    fun dealt(shape: Shape, color: JellyColor): Piece {
        if (shape !== SQ9) return Piece(shape, color)
        val entries = JellyColor.entries
        val center = entries[(color.ordinal + 2) % entries.size]
        return Piece(shape, color, shape.cells.map { if (it.x == 1 && it.y == 1) center else color })
    }
}
