package com.ficbook.app

import android.app.AlertDialog
import android.content.ActivityNotFoundException
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.widget.EditText
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import org.mozilla.geckoview.AllowOrDeny
import org.mozilla.geckoview.GeckoResult
import org.mozilla.geckoview.GeckoSession
import org.mozilla.geckoview.GeckoView
import org.mozilla.geckoview.WebExtensionController

class MainActivity : ComponentActivity() {

    private var session: GeckoSession? = null
    private var geckoView: GeckoView? = null
    private var canGoBack = false
    @Volatile private var currentUrl: String = HOME_URL
    private val handler = Handler(Looper.getMainLooper())
    private var destroyed = false
    private var splashDone = false
    @Volatile private var inAuthFlow = false
    private val authFlowTimeout = Runnable { inAuthFlow = false }

    companion object {
        private const val EXTENSION_ID = "ficbook-reader@app"
        private const val EXTENSION_PATH = "resource://android/assets/ficbook_extension/"
        private const val HOME_URL = "https://ficbook.net"
        private const val AUTH_FLOW_TIMEOUT_MS = 5 * 60 * 1000L
    }

    private fun <T> GeckoResult<T>.completeOnce(value: T) {
        try { complete(value) } catch (_: Throwable) {}
    }

    private fun openExternally(uri: String): Boolean {
        return try {
            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(uri)))
            true
        } catch (_: ActivityNotFoundException) {
            false
        } catch (_: Exception) {
            false
        }
    }

    private fun isFicbookUrl(uri: String): Boolean {
        return try {
            val host = Uri.parse(uri).host ?: return false
            host == "ficbook.net" || host.endsWith(".ficbook.net")
        } catch (_: Exception) {
            false
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        val splash = installSplashScreen()
        splash.setKeepOnScreenCondition { !splashDone }
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)

        val gv = GeckoView(this)
        geckoView = gv
        gv.coverUntilFirstPaint(Color.parseColor("#141414"))

        val root = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor("#141414"))
            addView(gv, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        }
        setContentView(root)

        ViewCompat.setOnApplyWindowInsetsListener(root) { view, insets ->
            val statusBar = insets.getInsets(WindowInsetsCompat.Type.statusBars())
            view.setPadding(0, statusBar.top, 0, 0)
            insets
        }

        val s = GeckoSession()
        session = s

        s.navigationDelegate = object : GeckoSession.NavigationDelegate {
            override fun onCanGoBack(session: GeckoSession, canGoBack: Boolean) {
                this@MainActivity.canGoBack = canGoBack
            }
            override fun onLocationChange(
                session: GeckoSession,
                url: String?,
                perms: List<GeckoSession.PermissionDelegate.ContentPermission>,
                hasUserGesture: Boolean
            ) {
                url?.let {
                    currentUrl = it
                    val path = try { Uri.parse(it).path ?: "" } catch (_: Exception) { "" }
                    if (isFicbookUrl(it)) {
                        if (path.startsWith("/social_login/")) {
                            // Начало OAuth — разрешаем внешние домены
                            inAuthFlow = true
                            handler.removeCallbacks(authFlowTimeout)
                            handler.postDelayed(authFlowTimeout, AUTH_FLOW_TIMEOUT_MS)
                        } else if (inAuthFlow) {
                            // Вернулись на ficbook.net — OAuth завершён
                            inAuthFlow = false
                            handler.removeCallbacks(authFlowTimeout)
                        }
                    }
                }
            }
            override fun onLoadRequest(
                session: GeckoSession,
                request: GeckoSession.NavigationDelegate.LoadRequest
            ): GeckoResult<AllowOrDeny> {
                val uri = request.uri
                if (!uri.startsWith("http://") && !uri.startsWith("https://")) {
                    return GeckoResult.fromValue(AllowOrDeny.ALLOW)
                }
                if (isFicbookUrl(uri)) {
                    val path = try { Uri.parse(uri).path ?: "" } catch (_: Exception) { "" }
                    if (path.startsWith("/social_login/")) {
                        inAuthFlow = true
                        handler.removeCallbacks(authFlowTimeout)
                        handler.postDelayed(authFlowTimeout, AUTH_FLOW_TIMEOUT_MS)
                    }
                    return GeckoResult.fromValue(AllowOrDeny.ALLOW)
                }
                if (inAuthFlow) {
                    return GeckoResult.fromValue(AllowOrDeny.ALLOW)
                }
                openExternally(uri)
                return GeckoResult.fromValue(AllowOrDeny.DENY)
            }
            override fun onNewSession(
                session: GeckoSession,
                uri: String
            ): GeckoResult<GeckoSession>? {
                if (uri.startsWith("http://") || uri.startsWith("https://")) {
                    if (!isFicbookUrl(uri) && !inAuthFlow) {
                        openExternally(uri)
                    } else {
                        session.loadUri(uri)
                    }
                }
                return null
            }
        }

        // Fallback: снимаем Splash Screen через 5 секунд если onPageStop не пришёл
        handler.postDelayed({ if (!destroyed) splashDone = true }, 5000)

        s.progressDelegate = object : GeckoSession.ProgressDelegate {
            private var updateChecked = false
            override fun onPageStop(session: GeckoSession, success: Boolean) {
                handler.post {
                    if (!destroyed) {
                        splashDone = true
                        if (!updateChecked) {
                            updateChecked = true
                            handler.postDelayed({
                                if (!destroyed) UpdateChecker.check(this@MainActivity)
                            }, 3000)
                        }
                    }
                }
            }
        }

        s.contentDelegate = object : GeckoSession.ContentDelegate {
            override fun onCrash(session: GeckoSession) {
                handler.post {
                    if (!destroyed) {
                        session.open(App.runtime)
                        session.loadUri(currentUrl)
                    }
                }
            }
            override fun onKill(session: GeckoSession) {
                handler.post {
                    if (!destroyed) {
                        session.open(App.runtime)
                        session.loadUri(currentUrl)
                    }
                }
            }
        }

        s.promptDelegate = object : GeckoSession.PromptDelegate {
            override fun onAlertPrompt(
                session: GeckoSession,
                prompt: GeckoSession.PromptDelegate.AlertPrompt
            ): GeckoResult<GeckoSession.PromptDelegate.PromptResponse> {
                val result = GeckoResult<GeckoSession.PromptDelegate.PromptResponse>()
                runOnUiThread {
                    if (destroyed) { result.completeOnce(prompt.dismiss()); return@runOnUiThread }
                    AlertDialog.Builder(this@MainActivity)
                        .setMessage(prompt.message)
                        .setPositiveButton(android.R.string.ok) { _, _ -> result.completeOnce(prompt.dismiss()) }
                        .setOnCancelListener { result.completeOnce(prompt.dismiss()) }
                        .show()
                }
                return result
            }
            override fun onButtonPrompt(
                session: GeckoSession,
                prompt: GeckoSession.PromptDelegate.ButtonPrompt
            ): GeckoResult<GeckoSession.PromptDelegate.PromptResponse> {
                val result = GeckoResult<GeckoSession.PromptDelegate.PromptResponse>()
                runOnUiThread {
                    if (destroyed) { result.completeOnce(prompt.dismiss()); return@runOnUiThread }
                    AlertDialog.Builder(this@MainActivity)
                        .setMessage(prompt.message)
                        .setPositiveButton(android.R.string.ok) { _, _ ->
                            result.completeOnce(prompt.confirm(GeckoSession.PromptDelegate.ButtonPrompt.Type.POSITIVE))
                        }
                        .setNegativeButton(android.R.string.cancel) { _, _ ->
                            result.completeOnce(prompt.confirm(GeckoSession.PromptDelegate.ButtonPrompt.Type.NEGATIVE))
                        }
                        .setOnCancelListener {
                            result.completeOnce(prompt.confirm(GeckoSession.PromptDelegate.ButtonPrompt.Type.NEGATIVE))
                        }
                        .show()
                }
                return result
            }
            override fun onTextPrompt(
                session: GeckoSession,
                prompt: GeckoSession.PromptDelegate.TextPrompt
            ): GeckoResult<GeckoSession.PromptDelegate.PromptResponse> {
                val result = GeckoResult<GeckoSession.PromptDelegate.PromptResponse>()
                runOnUiThread {
                    if (destroyed) { result.completeOnce(prompt.dismiss()); return@runOnUiThread }
                    val input = EditText(this@MainActivity).apply {
                        setText(prompt.defaultValue ?: "")
                    }
                    AlertDialog.Builder(this@MainActivity)
                        .setMessage(prompt.message)
                        .setView(input)
                        .setPositiveButton(android.R.string.ok) { _, _ ->
                            result.completeOnce(prompt.confirm(input.text.toString()))
                        }
                        .setNegativeButton(android.R.string.cancel) { _, _ ->
                            result.completeOnce(prompt.dismiss())
                        }
                        .setOnCancelListener { result.completeOnce(prompt.dismiss()) }
                        .show()
                }
                return result
            }
            override fun onBeforeUnloadPrompt(
                session: GeckoSession,
                prompt: GeckoSession.PromptDelegate.BeforeUnloadPrompt
            ): GeckoResult<GeckoSession.PromptDelegate.PromptResponse> {
                val result = GeckoResult<GeckoSession.PromptDelegate.PromptResponse>()
                runOnUiThread {
                    if (destroyed) { result.completeOnce(prompt.confirm(AllowOrDeny.ALLOW)); return@runOnUiThread }
                    AlertDialog.Builder(this@MainActivity)
                        .setMessage("Покинуть страницу?")
                        .setPositiveButton("Покинуть") { _, _ -> result.completeOnce(prompt.confirm(AllowOrDeny.ALLOW)) }
                        .setNegativeButton("Остаться") { _, _ -> result.completeOnce(prompt.confirm(AllowOrDeny.DENY)) }
                        .setOnCancelListener { result.completeOnce(prompt.confirm(AllowOrDeny.DENY)) }
                        .show()
                }
                return result
            }
        }

        val startUrl = savedInstanceState?.getString("url") ?: HOME_URL

        App.runtime.webExtensionController.setAddonManagerDelegate(
            object : WebExtensionController.AddonManagerDelegate {}
        )

        s.open(App.runtime)
        gv.setSession(s)

        App.runtime.webExtensionController
            .ensureBuiltIn(EXTENSION_PATH, EXTENSION_ID)
            .accept(
                { _ ->
                    runOnUiThread { s.loadUri(startUrl) }
                },
                { e ->
                    android.util.Log.e("Ficbook", "Extension failed: ${e?.message}")
                    runOnUiThread { s.loadUri(startUrl) }
                }
            )

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (canGoBack) {
                    session?.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    override fun onPause() {
        super.onPause()
        session?.setActive(false)
    }

    override fun onResume() {
        super.onResume()
        session?.setActive(true)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putString("url", currentUrl)
    }

    override fun onDestroy() {
        destroyed = true
        inAuthFlow = false
        handler.removeCallbacksAndMessages(null)
        super.onDestroy()
        session?.close()
        session = null
        geckoView = null
    }
}
