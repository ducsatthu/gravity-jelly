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

        /** TODO: dán leaderboardId thật từ Play Console (dạng "CgkI...") để bật BXH toàn cầu. */
        const val LEADERBOARD_ID = PLACEHOLDER
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
        return runCatching {
            PlayGames.getGamesSignInClient(activity).isAuthenticated().await()?.isAuthenticated == true
        }.getOrDefault(false)
    }

    /** Mở luồng đăng nhập Play Games; trả true nếu thành công. */
    suspend fun signIn(activity: Activity): Boolean {
        if (!configured) return false
        return runCatching {
            PlayGames.getGamesSignInClient(activity).signIn().await()?.isAuthenticated == true
        }.getOrDefault(false)
    }

    /** Nộp điểm Endless (fire-and-forget; chỉ khi đã cấu hình + điểm > 0). */
    fun submitScore(activity: Activity, score: Long) {
        if (!configured || score <= 0L) return
        runCatching { PlayGames.getLeaderboardsClient(activity).submitScore(LEADERBOARD_ID, score) }
            .onFailure { Log.w(TAG, "submitScore failed", it) }
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
            OnlineLeaderboard(entries, you)
        }.getOrElse {
            Log.w(TAG, "load failed", it)
            null
        }
    }
}

/** Task → suspend; lỗi/hủy trả null (không ném) để lời gọi tự lùi về bảng nội bộ. */
private suspend fun <T> Task<T>.await(): T? = suspendCancellableCoroutine { cont ->
    addOnSuccessListener { cont.resume(it) }
    addOnFailureListener { cont.resume(null) }
    addOnCanceledListener { cont.resume(null) }
}
