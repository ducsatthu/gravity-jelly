package com.gravityjelly.app.ads

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Nhịp interstitial theo mốc Campaign (mọi world):
 * - 10 màn đầu: chỉ boss L10.
 * - Từ L11: mốc giữa L16/L26/L36… + mọi boss (L20/L30/…).
 */
class AdsConfigTest {

    @Test
    fun `boss cuoi world luon hien - gom ca L10`() {
        for (boss in listOf(10, 20, 30, 40, 50, 100)) {
            assertTrue("boss L$boss phải hiện QC", AdsConfig.showsAdOnCampaignClear(boss))
        }
    }

    @Test
    fun `moc giua tu World 2 tro di - L16 L26 L36`() {
        for (mid in listOf(16, 26, 36, 46, 56)) {
            assertTrue("mốc L$mid phải hiện QC", AdsConfig.showsAdOnCampaignClear(mid))
        }
    }

    @Test
    fun `10 man dau khong co moc giua - L6 khong hien`() {
        assertFalse("L6 (id%10==6 nhưng <16) KHÔNG hiện — 10 màn đầu chỉ boss L10",
            AdsConfig.showsAdOnCampaignClear(6))
    }

    @Test
    fun `man thuong khong hien QC`() {
        for (n in listOf(1, 5, 9, 11, 15, 17, 19, 21, 25, 29)) {
            assertFalse("màn thường L$n không được hiện QC", AdsConfig.showsAdOnCampaignClear(n))
        }
    }

    @Test
    fun `10 man dau chi co dung boss L10`() {
        val qualifying = (1..10).filter { AdsConfig.showsAdOnCampaignClear(it) }
        assertEquals(listOf(10), qualifying)
    }

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
