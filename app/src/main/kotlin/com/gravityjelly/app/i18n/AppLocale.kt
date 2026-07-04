package com.gravityjelly.app.i18n

import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat

/**
 * Ngôn ngữ ứng dụng hỗ trợ. [tag] = mã BCP-47 khớp thư mục tài nguyên (`values`, `values-en`).
 * Thêm ngôn ngữ mới = thêm một hằng ở đây + một `values-<tag>/strings.xml`.
 */
enum class AppLanguage(val tag: String) {
    VIETNAMESE("vi"),
    ENGLISH("en");

    companion object {
        /** Ngôn ngữ mặc định (khớp `res/values/strings.xml`). */
        val DEFAULT = VIETNAMESE

        fun fromTag(tag: String?): AppLanguage =
            entries.firstOrNull { tag != null && tag.startsWith(it.tag) } ?: DEFAULT
    }
}

/**
 * Chuyển ngôn ngữ toàn app qua per-app language (AndroidX AppCompat).
 *
 * [AppCompatDelegate.setApplicationLocales] tự LƯU + KHÔI PHỤC lựa chọn (autoStoreLocales,
 * khai báo ở AndroidManifest) trên mọi API ≥ 24 và tự recreate Activity để áp ngay —
 * không cần khởi động lại app. Đây là nguồn sự thật cho ngôn ngữ (không lưu trùng ở DataStore).
 */
object AppLocale {
    /** Ngôn ngữ đang áp dụng (rỗng = theo hệ thống → quy về [AppLanguage.DEFAULT]). */
    fun current(): AppLanguage {
        val locales = AppCompatDelegate.getApplicationLocales()
        return AppLanguage.fromTag(if (locales.isEmpty) null else locales[0]?.language)
    }

    /** Đổi ngôn ngữ; bền hoá + recreate Activity tự động. */
    fun set(language: AppLanguage) {
        AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags(language.tag))
    }
}
