// Root build file. Plugins declared here (apply false) and applied in modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.android.library) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.jvm) apply false
    alias(libs.plugins.kotlin.compose) apply false
    // Firebase (Analytics/GA4 + Crashlytics) — áp dụng CÓ ĐIỀU KIỆN ở :app khi có google-services.json.
    alias(libs.plugins.google.services) apply false
    alias(libs.plugins.firebase.crashlytics) apply false
}
