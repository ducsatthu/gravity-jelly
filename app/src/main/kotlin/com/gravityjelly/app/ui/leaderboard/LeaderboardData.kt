package com.gravityjelly.app.ui.leaderboard

import java.text.NumberFormat

/** Một dòng xếp hạng: tên hiển thị + điểm Endless. */
data class LbEntry(val name: String, val score: Int)

/** Hàng "của bạn": hạng + tên + điểm (rank ≤ 0 = chưa có điểm/không rõ hạng). */
data class LbYou(val rank: Int, val name: String, val score: Int)

/** Nguồn dữ liệu đang hiển thị. */
enum class LbSource { LOADING, ONLINE, OFFLINE }

/**
 * Trạng thái UI Bảng xếp hạng (nguồn-bất-khả-tri: online PGS hoặc nội bộ).
 * [configured] = PGS đã điền LEADERBOARD_ID thật chưa; [signedIn] = đã đăng nhập Play Games.
 */
data class LeaderboardUiState(
    val source: LbSource,
    val top: List<LbEntry>,   // hạng 1..3
    val rest: List<LbEntry>,  // hạng 4..N
    val you: LbYou?,
    val configured: Boolean = false,
    val signedIn: Boolean = false,
    /**
     * Server ĐÃ nhận điểm của người chơi nhưng trả `rank = 0` ⇒ họ bị loại khỏi
     * COLLECTION_PUBLIC vì hồ sơ Play Games đang ẩn. Điểm không mất, chỉ không được xếp hạng.
     */
    val profileHidden: Boolean = false,
)

/** Dữ liệu thô lấy từ PGS (trước khi tách top/rest cho UI). */
data class OnlineLeaderboard(val entries: List<LbEntry>, val you: LbYou?)

/**
 * Dựng trạng thái OFFLINE từ **bản cache PGS gần nhất** (nếu có) + điểm/tên thật của người chơi.
 * KHÔNG còn "bot" giả — mọi thứ hiển thị đều là dữ liệu Play Games thật đã đồng bộ. Chưa từng
 * đồng bộ (mới cài, chưa nối mạng) → danh sách rỗng, chỉ hiện hàng "của bạn".
 */
fun offlineState(
    cached: OnlineLeaderboard?,
    best: Int,
    playerName: String,
    configured: Boolean,
    signedIn: Boolean,
): LeaderboardUiState {
    val entries = cached?.entries ?: emptyList()
    return LeaderboardUiState(
        source = LbSource.OFFLINE,
        top = entries.take(3),
        rest = entries.drop(3),
        you = offlineYou(cached, best, playerName),
        configured = configured,
        signedIn = signedIn,
    )
}

/**
 * Hàng "của bạn" khi offline. Ưu tiên hạng thật từ cache nếu best **chưa vượt** điểm đã đồng bộ
 * (hạng không đổi so với lần nối mạng gần nhất); nếu vừa lập điểm cao hơn → hạng chưa rõ (0 →
 * hiện "—") tới khi nối mạng đồng bộ lại. Điểm hiển thị luôn là best thật cao nhất.
 */
private fun offlineYou(cached: OnlineLeaderboard?, best: Int, playerName: String): LbYou {
    val you = cached?.you
    val rank = when {
        you == null -> 0
        best <= you.score -> you.rank
        else -> 0
    }
    val name = you?.name?.ifBlank { playerName } ?: playerName
    return LbYou(rank, name, maxOf(best, you?.score ?: 0))
}

/** Định dạng điểm theo locale hiện hành (vi: dấu chấm ngăn nghìn). */
fun formatScore(n: Int): String = NumberFormat.getIntegerInstance().format(n)
