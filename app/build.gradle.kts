import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

// Firebase (Analytics/GA4 + Crashlytics) chỉ bật khi có app/google-services.json (tải từ Firebase
// console). Vắng file → KHÔNG áp plugin để dev vẫn build được; AnalyticsManager tự no-op lúc chạy.
val hasFirebaseConfig = file("google-services.json").exists()
if (hasFirebaseConfig) {
    apply(plugin = "com.google.gms.google-services")
    apply(plugin = "com.google.firebase.crashlytics")
}

// Khoá ký release đọc từ keystore.properties ở root (KHÔNG commit — xem .gitignore).
// Vắng file → release tự lùi về ký bằng debug key để dev vẫn build được (không phát hành).
// Định dạng: xem keystore.properties.example.
val keystorePropertiesFile = rootProject.file("keystore.properties")
val keystoreProperties = Properties().apply {
    if (keystorePropertiesFile.exists()) keystorePropertiesFile.inputStream().use { load(it) }
}
val hasReleaseKeystore = keystorePropertiesFile.exists()

// An toàn phát hành: nếu đang chạy task đóng gói bản release mà THIẾU keystore.properties, dừng ngay
// với lỗi rõ ràng — tránh im lặng ký bằng debug key rồi tạo ra AAB/APK không thể phát hành.
gradle.taskGraph.whenReady {
    val packagingRelease = allTasks.any { it.name == "bundleRelease" || it.name == "assembleRelease" }
    if (packagingRelease && !hasReleaseKeystore) {
        throw GradleException(
            "Thiếu keystore.properties ở thư mục gốc — không thể ký bản release. " +
                "Tạo file theo keystore.properties.example rồi chạy lại.",
        )
    }
}

android {
    namespace = "com.gravityjelly.app"
    compileSdk = 35

    defaultConfig {
        // applicationId = mã đăng ký trên Google Play (độc lập với `namespace` mã nguồn ở trên).
        applicationId = "com.ductranxuan.gravityjelly"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
        // Quảng cáo luôn bật (đã bỏ flavor demo — chỉ còn bản release-ready).
        buildConfigField("Boolean", "ADS_ENABLED", "true")

        // AdMob — MẶC ĐỊNH id TEST (an toàn cho debug: click ad test không bị khoá tài khoản).
        // buildType `release` override sang id THẬT bên dưới. App ID đọc qua @string/admob_app_id.
        resValue("string", "admob_app_id", "ca-app-pub-3940256099942544~3347511713")
        buildConfigField("String", "ADMOB_INTERSTITIAL_UNIT", "\"ca-app-pub-3940256099942544/1033173712\"")
        buildConfigField("String", "ADMOB_REWARDED_UNIT", "\"ca-app-pub-3940256099942544/5224354917\"")
    }

    signingConfigs {
        // Chỉ dựng config release khi có keystore.properties (tránh cấu hình null gây lỗi khi build).
        if (hasReleaseKeystore) {
            create("release") {
                storeFile = file(keystoreProperties.getProperty("storeFile"))
                storePassword = keystoreProperties.getProperty("storePassword")
                keyAlias = keystoreProperties.getProperty("keyAlias")
                keyPassword = keystoreProperties.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        release {
            // Có khoá thật → ký release; chưa có → lùi debug key (chỉ để build thử, không phát hành).
            signingConfig = if (hasReleaseKeystore) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
            // R8: rút gọn + tối ưu + đổi tên; shrinkResources dọn tài nguyên không dùng.
            isMinifyEnabled = true
            isShrinkResources = true
            // Native debug symbols cho .so (GMS/Firebase…) → Play giải mã crash/ANR native.
            ndk { debugSymbolLevel = "FULL" }
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
            // AdMob — id THẬT (chỉ bản phát hành). Đăng ký test device trước khi chạy release
            // trên máy mình để không click ad thật (tránh invalid traffic → khoá tài khoản).
            resValue("string", "admob_app_id", "ca-app-pub-3372922503955749~3547570752")
            buildConfigField("String", "ADMOB_INTERSTITIAL_UNIT", "\"ca-app-pub-3372922503955749/3918271696\"")
            buildConfigField("String", "ADMOB_REWARDED_UNIT", "\"ca-app-pub-3372922503955749/1911924999\"")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
        // play-services-ads 25.x đóng gói metadata Kotlin mới hơn compiler (2.0.x).
        // API AdMob ta dùng là Java thuần ⇒ bỏ qua kiểm tra phiên bản metadata để build.
        freeCompilerArgs = freeCompilerArgs + "-Xskip-metadata-version-check"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(project(":core"))
    implementation(project(":game"))

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.core.splashscreen)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.foundation)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.play.services.ads)
    implementation(libs.user.messaging.platform)
    implementation(libs.play.services.games.v2)

    // Firebase: Analytics (GA4) + Crashlytics. Deps luôn có; chỉ hoạt động khi có google-services.json.
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.analytics)
    implementation(libs.firebase.crashlytics)
    debugImplementation(libs.androidx.ui.tooling)

    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
}
