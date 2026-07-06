# ── App ProGuard/R8 rules ───────────────────────────────────────────────────
# Bật cùng isMinifyEnabled=true cho release. Đa số thư viện Google (GMA Ads,
# Play Games v2, UMP) và Jetpack Compose đã đóng gói consumer-rules riêng, nên
# file này chỉ giữ những phần R8 không tự suy ra được.

# Giữ số dòng để stacktrace crash (Play Console) map ngược được về nguồn.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Giữ annotation & generic signatures (Compose, coroutines, reflection nội bộ GMS).
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# ── Google Mobile Ads (AdMob) + UMP ────────────────────────────────────────
# SDK có consumer-rules; thêm keep phòng hờ cho lớp API truy cập động.
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.android.ump.** { *; }
-dontwarn com.google.android.gms.ads.**
-dontwarn com.google.android.ump.**

# ── Google Play Games Services v2 ──────────────────────────────────────────
-keep class com.google.android.gms.games.** { *; }
-dontwarn com.google.android.gms.games.**

# ── App: enum của :core dùng qua when/valueOf — giữ tên cho an toàn ─────────
-keepclassmembers enum com.gravityjelly.** { *; }
