# GeckoView contains native libraries - keep them
-keep class org.mozilla.geckoview.** { *; }
-dontwarn org.mozilla.geckoview.**

# SplashScreen
-keep class androidx.core.splashscreen.** { *; }

# Keep application class
-keep class com.ficbook.app.App { *; }
