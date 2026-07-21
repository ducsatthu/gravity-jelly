package com.gravityjelly.core

/**
 * Mã hoá/giải mã [EndlessEngine.Snapshot] thành CHUỖI bền để :app lưu qua process death
 * (savedInstanceState Bundle + DataStore). Gói TRỌN state biến đổi gồm cả [Rng] state nên
 * khôi phục cho ván ĐÚNG từng mảnh, đúng RNG — cùng seed + cùng chuỗi input tiếp theo vẫn
 * deterministic (CLAUDE.md §Deterministic).
 *
 * Định dạng có TIỀN TỐ PHIÊN BẢN [VERSION]. [decode] trả `null` khi sai phiên bản/hỏng/rỗng →
 * lớp vỏ tự khởi ván mới, KHÔNG bao giờ crash. Đổi cấu trúc [EndlessEngine.Snapshot] → bump [VERSION].
 *
 * Phân tách theo tầng, không đụng nhau: TOP `|`, ô lưới `,` với trường `:`, khay `;`, mảnh `~`,
 * toạ độ mảnh `.` với `_`.
 */
internal object EndlessSaveCodec {

    private const val VERSION = "GJ1"
    private const val FIELD_COUNT = 13

    fun encode(s: EndlessEngine.Snapshot): String = buildString {
        append(VERSION)
        append('|'); append(s.rngState.toString())
        append('|'); append(s.gravity.ordinal)
        append('|'); append(s.stage)
        append('|'); append(s.rotBudget)
        append('|'); append(s.score)
        append('|'); append(s.combo)
        append('|'); append(if (s.gameOver) 1 else 0)
        append('|'); append(s.placeTurns)
        append('|'); append(s.wavesSinceHelpful)
        append('|'); append(s.wavesSinceSpecial)
        append('|'); append(encodeGrid(s.grid))
        append('|'); append(encodeTray(s.tray))
    }

    fun decode(blob: String): EndlessEngine.Snapshot? {
        val parts = blob.split('|')
        if (parts.size != FIELD_COUNT || parts[0] != VERSION) return null
        return try {
            EndlessEngine.Snapshot(
                grid = decodeGrid(parts[11]) ?: return null,
                gravity = Direction.entries[parts[2].toInt()],
                stage = parts[3].toInt(),
                tray = decodeTray(parts[12]) ?: return null,
                rotBudget = parts[4].toInt(),
                score = parts[5].toInt(),
                combo = parts[6].toInt(),
                gameOver = parts[7] == "1",
                placeTurns = parts[8].toInt(),
                wavesSinceHelpful = parts[9].toInt(),
                wavesSinceSpecial = parts[10].toInt(),
                rngState = parts[1].toULong(),
            )
        } catch (_: Exception) {
            null   // index/parse hỏng → coi như không có bản lưu
        }
    }

    // ── grid: 81 ô row-major (y ngoài, x trong) ────────────────────────────────
    private fun encodeGrid(g: Grid): String = buildString {
        for (y in 0 until g.size) for (x in 0 until g.size) {
            if (isNotEmpty()) append(',')
            val c = g.get(x, y)
            if (c == null) {
                append('-')
            } else {
                append(c.type.ordinal); append(':')
                append(c.color?.ordinal ?: -1); append(':')
                append(c.superLevel); append(':')
                append(if (c.rainbow) 1 else 0)
            }
        }
    }

    private fun decodeGrid(str: String): Grid? {
        val toks = str.split(',')
        val g = Grid()
        if (toks.size != g.size * g.size) return null
        for (i in toks.indices) {
            val t = toks[i]
            if (t == "-") continue
            val f = t.split(':')
            if (f.size != 4) return null
            val colorOrd = f[1].toInt()
            g.set(
                i % g.size, i / g.size,
                Grid.Cell(
                    type = CellType.entries[f[0].toInt()],
                    color = if (colorOrd < 0) null else JellyColor.entries[colorOrd],
                    superLevel = f[2].toInt(),
                    rainbow = f[3] == "1",
                ),
            )
        }
        return g
    }

    // ── khay: 3 slot ('-' = ô đã đặt/null) ─────────────────────────────────────
    private fun encodeTray(tray: List<Piece?>): String =
        tray.joinToString(";") { if (it == null) "-" else encodePiece(it) }

    private fun decodeTray(str: String): List<Piece?>? {
        val slots = str.split(';')
        if (slots.size != 3) return null
        val out = ArrayList<Piece?>(3)
        for (slot in slots) {
            if (slot == "-") out.add(null)
            else out.add(decodePiece(slot) ?: return null)
        }
        return out
    }

    private fun encodePiece(p: Piece): String {
        val cells = p.shape.cells.joinToString(".") { "${it.x}_${it.y}" }
        val colors = p.cellColors?.joinToString(".") { it.ordinal.toString() } ?: "-"
        return "${p.color.ordinal}~$colors~$cells"
    }

    private fun decodePiece(str: String): Piece? {
        val f = str.split('~')
        if (f.size != 3) return null
        val cells = ArrayList<Vec>()
        for (xy in f[2].split('.')) {
            val ab = xy.split('_')
            if (ab.size != 2) return null
            cells.add(Vec(ab[0].toInt(), ab[1].toInt()))
        }
        // cellColors căn ĐÚNG thứ tự Shape.cells; [Shape.of] chuẩn hoá lại về cùng thứ tự (y,x)
        // như lúc encode nên alignment giữ nguyên.
        val cellColors = if (f[1] == "-") null
        else f[1].split('.').map { JellyColor.entries[it.toInt()] }
        return Piece(Shape.of(cells), JellyColor.entries[f[0].toInt()], cellColors)
    }
}
