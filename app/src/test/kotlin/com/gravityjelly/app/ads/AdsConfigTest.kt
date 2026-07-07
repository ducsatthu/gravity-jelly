package com.gravityjelly.app.ads

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
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
}
