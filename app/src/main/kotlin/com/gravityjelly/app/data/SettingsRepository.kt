package com.gravityjelly.app.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.gravityjelly.app.ui.leaderboard.LbEntry
import com.gravityjelly.app.ui.leaderboard.LbYou
import com.gravityjelly.app.ui.leaderboard.OnlineLeaderboard
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import java.io.IOException

/** Trạng thái bền của người chơi (best + cài đặt + seed gần nhất). Mặc định an toàn cho lần đầu. */
data class GjSettings(
    val best: Int = 0,
    val sound: Boolean = true,
    val music: Boolean = true,
    val vibrate: Boolean = true,
    val lastSeed: Long = 0L,
    /** Id các mục hướng dẫn người chơi đã xem (mỗi luật/thành tựu = 1 id) — xem [com.gravityjelly.app.ui.guide.GjGuide]. */
    val seenGuides: Set<String> = emptySet(),
    /** Tên người chơi hiển thị ở Bảng xếp hạng. Rỗng = chưa đặt → dùng tên mặc định (i18n). */
    val playerName: String = "",
    /** Cảnh đang chọn (home + in-game dùng chung). Giá trị = Scene.id ("meadow"/"forest"/"waterfall"). */
    val sceneId: String = "meadow",
    /** Nhạc nền đang chọn. Giá trị = Scene.id. */
    val musicId: String = "meadow",
    /** Âm lượng nhạc nền 0–100. */
    val bgmVolume: Int = 70,
    /**
     * Ảnh chụp ván Endless đang chơi dở ([com.gravityjelly.core.EndlessEngine.encodeSave]) — lớp
     * dự phòng process death khi Bundle savedInstanceState không còn. Null = không có ván dở.
     * Xoá khi thắng/thua, Chơi lại, hoặc rời về Home.
     */
    val endlessSave: String? = null,
)

/** DataStore preferences gắn vào Context (một instance/quy trình). */
private val Context.settingsDataStore: DataStore<Preferences> by preferencesDataStore(name = "gj_settings")

/**
 * Kho lưu trữ cài đặt qua DataStore (Prompt 13).
 * Đọc qua [settings] Flow (bất đồng bộ, không chặn main); ghi qua các suspend setter.
 * Tách [dataStore] khỏi Context để test được headless (JVM) với file tạm.
 */
class SettingsRepository(private val dataStore: DataStore<Preferences>) {

    constructor(context: Context) : this(context.applicationContext.settingsDataStore)

    val settings: Flow<GjSettings> = dataStore.data
        .catch { e ->
            // file hỏng/đọc lỗi → trả mặc định thay vì crash
            if (e is IOException) emit(emptyPreferences()) else throw e
        }
        .map { p ->
            GjSettings(
                best = p[KEY_BEST] ?: 0,
                sound = p[KEY_SOUND] ?: true,
                music = p[KEY_MUSIC] ?: true,
                vibrate = p[KEY_VIBRATE] ?: true,
                lastSeed = p[KEY_LAST_SEED] ?: 0L,
                seenGuides = p[KEY_SEEN_GUIDES] ?: emptySet(),
                playerName = p[KEY_PLAYER_NAME] ?: "",
                sceneId = p[KEY_SCENE_ID] ?: "meadow",
                musicId = p[KEY_MUSIC_ID] ?: "meadow",
                bgmVolume = p[KEY_BGM_VOLUME] ?: 70,
                endlessSave = p[KEY_ENDLESS_SAVE],
            )
        }

    /** Chỉ nâng best (không bao giờ hạ). */
    suspend fun updateBest(score: Int) {
        dataStore.edit { p ->
            val cur = p[KEY_BEST] ?: 0
            if (score > cur) p[KEY_BEST] = score
        }
    }

    suspend fun setSound(value: Boolean) = edit { it[KEY_SOUND] = value }
    suspend fun setMusic(value: Boolean) = edit { it[KEY_MUSIC] = value }
    suspend fun setVibrate(value: Boolean) = edit { it[KEY_VIBRATE] = value }
    suspend fun setLastSeed(seed: Long) = edit { it[KEY_LAST_SEED] = seed }

    /** Đặt tên người chơi (Bảng xếp hạng). Cắt trắng + giới hạn 14 ký tự; rỗng → xoá về mặc định. */
    suspend fun setPlayerName(name: String) = edit {
        val trimmed = name.trim().take(14)
        if (trimmed.isEmpty()) it.remove(KEY_PLAYER_NAME) else it[KEY_PLAYER_NAME] = trimmed
    }

    /** Lưu ván Endless đang chơi dở (ghi đè bản cũ). Gọi lúc vào nền / mỗi nước đã lắng. */
    suspend fun setEndlessSave(blob: String) = edit { it[KEY_ENDLESS_SAVE] = blob }

    /** Xoá ván Endless đã lưu (thắng/thua, Chơi lại, về Home). */
    suspend fun clearEndlessSave() = edit { it.remove(KEY_ENDLESS_SAVE) }

    suspend fun setSceneId(id: String) = edit { it[KEY_SCENE_ID] = id }
    suspend fun setMusicId(id: String) = edit { it[KEY_MUSIC_ID] = id }
    suspend fun setBgmVolume(volume: Int) = edit { it[KEY_BGM_VOLUME] = volume.coerceIn(0, 100) }

    /** Đánh dấu một mục hướng dẫn đã xem (cộng dồn id, idempotent). */
    suspend fun markGuideSeen(id: String) {
        dataStore.edit { p ->
            p[KEY_SEEN_GUIDES] = (p[KEY_SEEN_GUIDES] ?: emptySet()) + id
        }
    }

    private suspend inline fun edit(crossinline block: (androidx.datastore.preferences.core.MutablePreferences) -> Unit) {
        dataStore.edit { block(it) }
    }

    // ---- Cache Bảng xếp hạng (Play Games) — để xem offline khi mất mạng ----

    /**
     * Lưu bản chụp BXH vừa tải từ Play Games để lần sau mở lúc offline vẫn có dữ liệu thật.
     * Mã hoá gọn trong preferences (mỗi dòng "score\tname"); ghi đè bản cũ mỗi lần đồng bộ.
     */
    suspend fun saveLeaderboardCache(data: OnlineLeaderboard) {
        dataStore.edit { p ->
            p[KEY_LB_ENTRIES] = data.entries.joinToString("\n") { "${it.score}\t${sanitize(it.name)}" }
            val you = data.you
            if (you != null) p[KEY_LB_YOU] = "${you.rank}\t${you.score}\t${sanitize(you.name)}"
            else p.remove(KEY_LB_YOU)
        }
    }

    /** Đọc bản cache BXH gần nhất (null nếu chưa từng đồng bộ / dữ liệu rỗng). */
    suspend fun loadLeaderboardCache(): OnlineLeaderboard? {
        val p = dataStore.data
            .catch { e -> if (e is IOException) emit(emptyPreferences()) else throw e }
            .first()
        val entries = (p[KEY_LB_ENTRIES] ?: return null).split("\n").mapNotNull { line ->
            val tab = line.indexOf('\t')
            if (tab < 0) return@mapNotNull null
            val score = line.substring(0, tab).toIntOrNull() ?: return@mapNotNull null
            LbEntry(line.substring(tab + 1), score)
        }
        if (entries.isEmpty()) return null
        val you = p[KEY_LB_YOU]?.split("\t")?.let { parts ->
            val rank = parts.getOrNull(0)?.toIntOrNull()
            val score = parts.getOrNull(1)?.toIntOrNull()
            if (rank != null && score != null) LbYou(rank, parts.getOrNull(2) ?: "", score) else null
        }
        return OnlineLeaderboard(entries, you)
    }

    companion object {
        private val KEY_BEST = intPreferencesKey("best_score")
        private val KEY_SOUND = booleanPreferencesKey("sound")
        private val KEY_MUSIC = booleanPreferencesKey("music")
        private val KEY_VIBRATE = booleanPreferencesKey("vibrate")
        private val KEY_LAST_SEED = longPreferencesKey("last_seed")
        private val KEY_SEEN_GUIDES = stringSetPreferencesKey("seen_guides")
        // (Khoá "campaign_stars" của bản cũ đã bỏ 17/07 cùng tính năng Campaign — key mồ côi trên
        // máy người chơi cũ tự vô hại, DataStore bỏ qua khoá không đọc tới; không cần migration.)
        private val KEY_PLAYER_NAME = stringPreferencesKey("player_name")
        private val KEY_SCENE_ID = stringPreferencesKey("scene_id")
        private val KEY_MUSIC_ID = stringPreferencesKey("music_id")
        private val KEY_BGM_VOLUME = intPreferencesKey("bgm_volume")
        private val KEY_ENDLESS_SAVE = stringPreferencesKey("endless_save")
        private val KEY_LB_ENTRIES = stringPreferencesKey("lb_cache_entries")
        private val KEY_LB_YOU = stringPreferencesKey("lb_cache_you")

        /** Bỏ ký tự phân tách khỏi tên trước khi mã hoá (tránh vỡ định dạng cache). */
        private fun sanitize(s: String): String = s.replace('\t', ' ').replace('\n', ' ')
    }
}
