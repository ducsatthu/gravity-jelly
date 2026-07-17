package com.gravityjelly.app.ads

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Nhịp interstitial của Endless (chế độ chơi duy nhất) + backoff nạp lại khi mất mạng.
 * (Nhịp theo mốc Campaign đã gỡ 17/07 cùng tính năng — xem docs/08-go-bo-campaign.md.)
 */
class AdsConfigTest {

    // ---- Endless: hiện QC sau MỌI ván (onEndlessGameOver) ----

    @Test
    fun `endless hien QC sau moi van thua`() {
        // Khác loss-gate của onGameOver: không ân hạn, không đếm-thua, không cooldown.
        for (n in 1..20) {
            assertTrue("ván Endless thứ $n phải hiện QC", AdsConfig.showsAdOnEndlessGameOver(n))
        }
    }

    @Test
    fun `endless khong ap an han nhu loss-gate`() {
        // Ngay ván đầu (1) đã hiện — trái với GRACE_GAMES của loss-gate cũ.
        assertTrue(AdsConfig.showsAdOnEndlessGameOver(1))
        assertTrue(AdsConfig.showsAdOnEndlessGameOver(AdsConfig.GRACE_GAMES))
    }

    // ---- Retry backoff khi load hụt (mất mạng) ----

    @Test
    fun `retry theo backoff tang dan dung so nac`() {
        assertEquals(listOf(2_000L, 5_000L, 15_000L, 30_000L),
            (0 until AdsConfig.MAX_LOAD_RETRIES).map { AdsConfig.retryDelayMs(it) })
    }

    @Test
    fun `het ngan sach retry thi dung`() {
        assertNull("attempt = MAX phải dừng", AdsConfig.retryDelayMs(AdsConfig.MAX_LOAD_RETRIES))
        assertNull("vượt MAX cũng dừng", AdsConfig.retryDelayMs(AdsConfig.MAX_LOAD_RETRIES + 5))
    }

    @Test
    fun `attempt am duoc coi la khong retry`() {
        assertNull(AdsConfig.retryDelayMs(-1))
    }

    @Test
    fun `so nac delay khop so lan retry toi da`() {
        // Bảo vệ khi ai đó đổi mảng/hằng số lệch nhau (index-out-of-bounds ở production).
        assertEquals(AdsConfig.MAX_LOAD_RETRIES, AdsConfig.RETRY_DELAYS_MS.size)
    }
}
