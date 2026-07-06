package com.gravityjelly.app.ads

import android.app.Activity
import android.util.Log
import com.google.android.ump.ConsentDebugSettings
import com.google.android.ump.ConsentInformation
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform

/**
 * UMP (User Messaging Platform) — xin đồng thuận quảng cáo cho GDPR/EEA/UK/CH.
 *
 * BẮT BUỘC chạy TRƯỚC khi khởi tạo/nạp AdMob: cập nhật thông tin consent → hiện form nếu
 * cần → chỉ khi [ConsentInformation.canRequestAds] mới cho phép load ad. Người dùng ngoài
 * khu vực yêu cầu đồng thuận thường được bỏ qua form (canRequestAds = true ngay).
 *
 * Sau khi consent xong, GMA SDK tự phục vụ quảng cáo phù hợp (cá nhân hoá / không) theo lựa
 * chọn của người dùng — code không cần xử lý thêm ở tầng AdRequest.
 */
class ConsentManager(activity: Activity) {

    private val consentInformation: ConsentInformation =
        UserMessagingPlatform.getConsentInformation(activity)

    /** Có được phép request ad theo trạng thái consent hiện tại hay không. */
    val canRequestAds: Boolean get() = consentInformation.canRequestAds()

    /**
     * Thu thập consent. [onResult] được gọi đúng một lần (trên main thread) với việc app có
     * được phép request ad hay không, để nơi gọi quyết định init/nạp AdMob.
     */
    fun gather(activity: Activity, onResult: (canRequestAds: Boolean) -> Unit) {
        val paramsBuilder = ConsentRequestParameters.Builder()
        if (AdsConfig.TEST_DEVICE_HASHES.isNotEmpty()) {
            // Chỉ dùng khi dev: ép địa lý EEA để test form đồng thuận trên thiết bị đã đăng ký.
            val debug = ConsentDebugSettings.Builder(activity)
                .setDebugGeography(ConsentDebugSettings.DebugGeography.DEBUG_GEOGRAPHY_EEA)
            AdsConfig.TEST_DEVICE_HASHES.forEach { debug.addTestDeviceHashedId(it) }
            paramsBuilder.setConsentDebugSettings(debug.build())
        }
        val params = paramsBuilder.build()

        consentInformation.requestConsentInfoUpdate(
            activity,
            params,
            {
                // Thông tin cập nhật xong → hiện form nếu bắt buộc, rồi báo kết quả.
                UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity) { formError ->
                    if (formError != null) {
                        Log.w(TAG, "consent form: ${formError.errorCode} ${formError.message}")
                    }
                    onResult(consentInformation.canRequestAds())
                }
            },
            { requestError ->
                // Lỗi mạng… → theo trạng thái hiện có (thường canRequestAds=false → bỏ ad phiên này).
                Log.w(TAG, "consent update failed: ${requestError.errorCode} ${requestError.message}")
                onResult(consentInformation.canRequestAds())
            },
        )
    }

    companion object {
        private const val TAG = "ConsentManager"
    }
}
