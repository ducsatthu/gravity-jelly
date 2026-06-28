package com.gravityjelly.app.data

import androidx.datastore.preferences.core.PreferenceDataStoreFactory
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import java.io.File

class SettingsRepositoryTest {

    @get:Rule
    val tmp = TemporaryFolder()

    private fun newFile(): File = File(tmp.newFolder(), "settings.preferences_pb")

    // ── lần đầu: mặc định an toàn, không crash ──

    @Test
    fun firstRun_returnsSafeDefaults() = runTest {
        val store = PreferenceDataStoreFactory.create(scope = backgroundScope) { newFile() }
        val s = SettingsRepository(store).settings.first()
        assertEquals(0, s.best)
        assertTrue(s.sound)
        assertTrue(s.music)
        assertTrue(s.vibrate)
        assertEquals(0L, s.lastSeed)
    }

    // ── best chỉ tăng ──

    @Test
    fun updateBest_onlyIncreases() = runTest {
        val store = PreferenceDataStoreFactory.create(scope = backgroundScope) { newFile() }
        val repo = SettingsRepository(store)
        repo.updateBest(100)
        assertEquals(100, repo.settings.first().best)
        repo.updateBest(50) // thấp hơn → giữ nguyên
        assertEquals(100, repo.settings.first().best)
        repo.updateBest(250)
        assertEquals(250, repo.settings.first().best)
    }

    // ── cài đặt ghi/đọc ──

    @Test
    fun settings_writeAndRead() = runTest {
        val store = PreferenceDataStoreFactory.create(scope = backgroundScope) { newFile() }
        val repo = SettingsRepository(store)
        repo.setSound(false)
        repo.setMusic(false)
        repo.setVibrate(false)
        repo.setLastSeed(42L)
        val s = repo.settings.first()
        assertFalse(s.sound)
        assertFalse(s.music)
        assertFalse(s.vibrate)
        assertEquals(42L, s.lastSeed)
    }

    // ── bền qua "phiên": instance DataStore mới trên cùng file ──

    @OptIn(ExperimentalCoroutinesApi::class)
    @Test
    fun bestScore_persistsAcrossSessions() = runTest {
        val file = newFile()

        // phiên 1
        val scope1 = CoroutineScope(UnconfinedTestDispatcher(testScheduler) + Job())
        val store1 = PreferenceDataStoreFactory.create(scope = scope1) { file }
        SettingsRepository(store1).updateBest(1234)
        SettingsRepository(store1).settings.first() // chắc chắn đã flush xuống đĩa
        scope1.cancel()
        advanceUntilIdle()

        // phiên 2 (mở lại): best phải còn
        val store2 = PreferenceDataStoreFactory.create(scope = backgroundScope) { file }
        assertEquals(1234, SettingsRepository(store2).settings.first().best)
    }
}
