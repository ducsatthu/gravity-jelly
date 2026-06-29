package com.gravityjelly.app.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
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

    /** Đánh dấu một mục hướng dẫn đã xem (cộng dồn id, idempotent). */
    suspend fun markGuideSeen(id: String) {
        dataStore.edit { p ->
            p[KEY_SEEN_GUIDES] = (p[KEY_SEEN_GUIDES] ?: emptySet()) + id
        }
    }

    private suspend inline fun edit(crossinline block: (androidx.datastore.preferences.core.MutablePreferences) -> Unit) {
        dataStore.edit { block(it) }
    }

    companion object {
        private val KEY_BEST = intPreferencesKey("best_score")
        private val KEY_SOUND = booleanPreferencesKey("sound")
        private val KEY_MUSIC = booleanPreferencesKey("music")
        private val KEY_VIBRATE = booleanPreferencesKey("vibrate")
        private val KEY_LAST_SEED = longPreferencesKey("last_seed")
        private val KEY_SEEN_GUIDES = stringSetPreferencesKey("seen_guides")
    }
}
