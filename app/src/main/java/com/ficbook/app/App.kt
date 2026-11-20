package com.ficbook.app

import android.app.Application
import android.app.ActivityManager
import android.content.Context
import android.os.Build
import android.os.Process
import org.mozilla.geckoview.GeckoRuntime
import org.mozilla.geckoview.GeckoRuntimeSettings

class App : Application() {

    companion object {
        lateinit var runtime: GeckoRuntime
            private set
    }

    override fun onCreate() {
        super.onCreate()
        if (!isMainProcess()) return
        runtime = GeckoRuntime.create(
            this,
            GeckoRuntimeSettings.Builder()
                .javaScriptEnabled(true)
                .remoteDebuggingEnabled(false)
                .consoleOutput(false)
                .preferredColorScheme(GeckoRuntimeSettings.COLOR_SCHEME_DARK)
                .inputAutoZoomEnabled(false)
                .doubleTapZoomingEnabled(false)
                .loginAutofillEnabled(false)
                .translationsOfferPopup(false)
                .lowMemoryDetection(true)
                .build()
        )
    }

    private fun isMainProcess(): Boolean {
        // На Android 9+ читаем имя процесса напрямую — надёжно на всех версиях
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            return getProcessName() == packageName
        }
        // До Android 9 — через /proc/self/cmdline
        return try {
            val cmdline = java.io.File("/proc/self/cmdline").readBytes()
            val name = String(cmdline).trimEnd('\u0000')
            name == packageName
        } catch (e: Exception) {
            // Fallback — ActivityManager (ненадёжен на 11+, но мы уже выше обработали)
            val pid = Process.myPid()
            val manager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            manager.runningAppProcesses
                ?.firstOrNull { it.pid == pid }
                ?.processName == packageName
        }
    }
}
