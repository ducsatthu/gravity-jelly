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
)

/** Dữ liệu thô lấy từ PGS (trước khi tách top/rest cho UI). */
data class OnlineLeaderboard(val entries: List<LbEntry>, val you: LbYou?)

/** Dựng trạng thái NỘI BỘ (offline) từ roster bot + điểm/tên thật của người chơi. */
fun offlineState(best: Int, playerName: String, configured: Boolean, signedIn: Boolean) = LeaderboardUiState(
    source = LbSource.OFFLINE,
    top = LB_BOTS.take(3),
    rest = LB_BOTS.drop(3),
    you = LbYou(playerRank(best), playerName, best),
    configured = configured,
    signedIn = signedIn,
)

/**
 * Roster nội bộ (deterministic) — dùng làm mốc cho Bảng xếp hạng offline.
 * Đây là các "bot" điểm cao cố định; điểm thật của người chơi (best) được chèn
 * vào để tính hạng. Không phải dữ liệu online (game chơi offline, không backend).
 * Tên/điểm bám leaderboard-screen.jsx.
 */
val LB_BOTS: List<LbEntry> = listOf(
    LbEntry("Mai", 214980),
    LbEntry("Tú", 198450),
    LbEntry("Khoa", 187210),
    LbEntry("Linh", 176040),
    LbEntry("Bảo", 168920),
    LbEntry("Hà", 159300),
    LbEntry("Nam", 151770),
    LbEntry("Vy", 144610),
    LbEntry("Quân", 136880),
    LbEntry("Minh", 129360),
)

/** Hạng của người chơi = số bot có điểm cao hơn + 1 (best cao hơn tất cả → hạng 1). */
fun playerRank(best: Int): Int = LB_BOTS.count { it.score > best } + 1

/** Định dạng điểm theo locale hiện hành (vi: dấu chấm ngăn nghìn). */
fun formatScore(n: Int): String = NumberFormat.getIntegerInstance().format(n)
