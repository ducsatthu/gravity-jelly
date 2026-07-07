package com.gravityjelly.app.games

import android.app.Activity
import android.content.Context
import android.util.Log
import com.google.android.gms.games.PlayGames
import com.google.android.gms.games.PlayGamesSdk
import com.google.android.gms.games.leaderboard.LeaderboardVariant
import com.google.android.gms.tasks.Task
import com.gravityjelly.app.ui.leaderboard.LbEntry
import com.gravityjelly.app.ui.leaderboard.LbYou
import com.gravityjelly.app.ui.leaderboard.OnlineLeaderboard
import kotlin.coroutines.resume
import kotlinx.coroutines.suspendCancellableCoroutine

/**
 * Lớp bọc Google Play Games Services (leaderboard toàn cầu). Service ở `:app` (§kiến trúc 3 lớp):
 * Core/Render không biết PGS tồn tại — chỉ shell gọi.
 *
 * **Chế độ placeholder:** khi [LEADERBOARD_ID] còn là placeholder → [configured] = false → KHÔNG
 * đụng SDK (không init, không đăng nhập) → app chạy bảng nội bộ, không crash. Dán id thật vào
 * [LEADERBOARD_ID] (và project id ở string `game_services_project_id`) để bật.
 *
 * Mọi lời gọi mạng bọc try/catch → lỗi/không mạng trả null/false, UI tự lùi về bảng nội bộ.
 */
class PlayGamesManager(private val appContext: Context) {

    companion object {
        private const val TAG = "PlayGames"
        private const val PLACEHOLDER = "REPLACE_WITH_LEADERBOARD_ID"

        /** Leaderboard "Endless" từ Play Games Services (project id 1038542031606). */
        const val LEADERBOARD_ID = "CgkI9pW375weEAIQAA"
    }

    /** PGS đã cấu hình id thật chưa. false → chạy bảng nội bộ. */
    val configured: Boolean get() = LEADERBOARD_ID != PLACEHOLDER && LEADERBOARD_ID.isNotBlank()

    private var initialized = false

    /** Init SDK một lần (chỉ khi đã cấu hình). An toàn gọi lặp. */
    fun initialize() {
        if (!configured || initialized) return
        runCatching { PlayGamesSdk.initialize(appContext) }
            .onSuccess { initialized = true }
            .onFailure { Log.w(TAG, "init failed", it) }
    }

    /** Đã đăng nhập Play Games chưa (im lặng, không mở UI). */
    suspend fun isAuthenticated(activity: Activity): Boolean {
        if (!configured) return false
        val ok = PlayGames.getGamesSignInClient(activity).isAuthenticated().await("isAuthenticated")
            ?.isAuthenticated == true
        Log.i(TAG, "isAuthenticated -> $ok")
        return ok
    }

    /** Mở luồng đăng nhập Play Games; trả true nếu thành công. */
    suspend fun signIn(activity: Activity): Boolean {
        if (!configured) return false
        val ok = PlayGames.getGamesSignInClient(activity).signIn().await("signIn")
            ?.isAuthenticated == true
        // ok=false ở đây = Google TỪ CHỐI xác thực (thường do SHA-1 chưa khai / account chưa là
        // tester / PGS config chưa publish). Xem dòng "signIn failed" phía trên trong logcat để biết lý do.
        Log.i(TAG, "signIn -> authenticated=$ok")
        return ok
    }

    /** Nộp điểm Endless (fire-and-forget; chỉ khi đã cấu hình + điểm > 0). */
    fun submitScore(activity: Activity, score: Long) {
        if (!configured || score <= 0L) return
        runCatching { PlayGames.getLeaderboardsClient(activity).submitScore(LEADERBOARD_ID, score) }
            .onFailure { Log.w(TAG, "submitScore failed", it) }
    }

    /**
     * Nộp điểm và **chờ** server nhận xong (để [load] ngay sau đó thấy điểm mới). Dùng khi mở BXH
     * lúc đã đăng nhập — bảo đảm best đặt TRƯỚC khi đăng nhập (submitScore lúc đó no-op) vẫn lên server.
     * Trả true nếu gửi xong. PGS luôn giữ điểm cao nhất nên gọi lặp vô hại.
     */
    suspend fun submitScoreAwait(activity: Activity, score: Long): Boolean {
        if (!configured || score <= 0L) return false
        return runCatching {
            PlayGames.getLeaderboardsClient(activity)
                .submitScoreImmediate(LEADERBOARD_ID, score).await() != null
        }.getOrDefault(false)
    }

    /** Lấy top 10 + điểm/hạng của người chơi. Trả null nếu chưa cấu hình / lỗi / chưa đăng nhập. */
    suspend fun load(activity: Activity): OnlineLeaderboard? {
        if (!configured) return null
        return runCatching {
            val client = PlayGames.getLeaderboardsClient(activity)
            val topData = client.loadTopScores(
                LEADERBOARD_ID,
                LeaderboardVariant.TIME_SPAN_ALL_TIME,
                LeaderboardVariant.COLLECTION_PUBLIC,
                10,
            ).await()?.get()
            val entries = buildList {
                topData?.scores?.let { buffer ->
                    for (s in buffer) add(LbEntry(s.scoreHolderDisplayName ?: "?", s.rawScore.coerceAtMost(Int.MAX_VALUE.toLong()).toInt()))
                    buffer.release()
                }
            }
            val youScore = client.loadCurrentPlayerLeaderboardScore(
                LEADERBOARD_ID,
                LeaderboardVariant.TIME_SPAN_ALL_TIME,
                LeaderboardVariant.COLLECTION_PUBLIC,
            ).await()?.get()
            val you = youScore?.let {
                LbYou(it.rank.toInt().coerceAtLeast(0), it.scoreHolderDisplayName ?: "", it.rawScore.toInt())
            }
            Log.i(TAG, "load -> entries=${entries.size}, you=${you?.let { "rank=${it.rank} score=${it.score}" } ?: "null"}")
            OnlineLeaderboard(entries, you)
        }.getOrElse {
            Log.w(TAG, "load failed", it)
            null
        }
    }
}

/**
 * Task → suspend; lỗi/hủy trả null (không ném) để lời gọi tự lùi về bảng nội bộ.
 * [tag] != null → log nguyên nhân lỗi (dùng cho đăng nhập: lộ lý do SHA-1/OAuth thật ra logcat).
 */
private suspend fun <T> Task<T>.await(tag: String? = null): T? = suspendCancellableCoroutine { cont ->
    addOnSuccessListener { cont.resume(it) }
    addOnFailureListener { e ->
        if (tag != null) Log.w("PlayGames", "$tag failed: ${e.message}", e)
        cont.resume(null)
    }
    addOnCanceledListener {
        if (tag != null) Log.w("PlayGames", "$tag canceled (người dùng huỷ hoặc hệ thống chặn)")
        cont.resume(null)
    }
}
