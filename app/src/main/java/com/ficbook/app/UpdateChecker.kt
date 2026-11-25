package com.ficbook.app

import android.animation.ObjectAnimator
import android.app.Activity
import android.app.Dialog
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Handler
import android.os.Looper
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.content.FileProvider
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

object UpdateChecker {

    private const val GITHUB_API = "https://api.github.com/repos/Maksidrol/ficbook-plus/releases/latest"
    private const val PREF_NAME = "update_prefs"
    private const val PREF_SKIPPED = "skipped_version"
    private val checkExecutor = Executors.newSingleThreadExecutor()
    private val downloadExecutor = Executors.newSingleThreadExecutor()
    private val mainHandler = Handler(Looper.getMainLooper())

    fun check(context: Context) {
        checkExecutor.execute {
            try {
                val conn = URL(GITHUB_API).openConnection() as HttpURLConnection
                conn.connectTimeout = 5000
                conn.readTimeout = 5000
                conn.setRequestProperty("Accept", "application/vnd.github.v3+json")
                if (conn.responseCode != 200) { conn.disconnect(); return@execute }
                val json = conn.inputStream.bufferedReader().use { it.readText() }
                conn.disconnect()

                val obj = JSONObject(json)
                val tagName = obj.getString("tag_name").trimStart('v')
                val body = obj.optString("body", "")

                val assets = obj.getJSONArray("assets")
                var apkUrl: String? = null
                for (i in 0 until assets.length()) {
                    val asset = assets.getJSONObject(i)
                    if (asset.getString("name").endsWith(".apk")) {
                        apkUrl = asset.getString("browser_download_url")
                        break
                    }
                }
                if (apkUrl == null) return@execute

                val current = context.packageManager
                    .getPackageInfo(context.packageName, 0).versionName ?: return@execute

                if (!isNewer(tagName, current)) return@execute

                val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
                if (prefs.getString(PREF_SKIPPED, null) == tagName) return@execute

                val apkUrlFinal = apkUrl
                mainHandler.post {
                    // Не показываем диалог если Activity уже закрыта
                    if (context is Activity && (context.isFinishing || context.isDestroyed)) return@post
                    showDialog(context, tagName, body, apkUrlFinal, prefs)
                }
            } catch (_: Exception) {}
        }
    }

    private fun isNewer(remote: String, current: String): Boolean {
        fun parts(v: String) = v.split(".").mapNotNull { it.toIntOrNull() }
        val r = parts(remote)
        val c = parts(current)
        for (i in 0 until maxOf(r.size, c.size)) {
            val rv = r.getOrElse(i) { 0 }
            val cv = c.getOrElse(i) { 0 }
            if (rv > cv) return true
            if (rv < cv) return false
        }
        return false
    }

    private fun showDialog(
        context: Context,
        version: String,
        notes: String,
        apkUrl: String,
        prefs: android.content.SharedPreferences
    ) {
        val dialog = Dialog(context, android.R.style.Theme_Black_NoTitleBar)
        dialog.window?.apply {
            setBackgroundDrawableResource(android.R.color.transparent)
            setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        }

        val dp = { v: Int ->
            TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), context.resources.displayMetrics).toInt()
        }

        val scrim = FrameLayout(context).apply {
            setBackgroundColor(Color.parseColor("#B3000000"))
            layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        }

        val card = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(24), dp(24), dp(24), dp(20))
            background = GradientDrawable().apply {
                setColor(Color.parseColor("#242424"))
                cornerRadius = dp(28).toFloat()
            }
        }

        val cardParams = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply {
            gravity = Gravity.CENTER
            setMargins(dp(32), 0, dp(32), 0)
        }

        card.addView(TextView(context).apply {
            text = "Доступно обновление"
            setTextColor(Color.WHITE)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 18f)
            setTypeface(null, android.graphics.Typeface.BOLD)
        })

        card.addView(View(context).apply { layoutParams = LinearLayout.LayoutParams(1, dp(6)) })

        card.addView(TextView(context).apply {
            text = "Версия $version"
            setTextColor(Color.parseColor("#D0BCFF"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
        })

        if (notes.isNotBlank()) {
            card.addView(View(context).apply { layoutParams = LinearLayout.LayoutParams(1, dp(10)) })
            card.addView(TextView(context).apply {
                text = notes.take(300)
                setTextColor(Color.parseColor("#9E9E9E"))
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
                setLineSpacing(0f, 1.4f)
            })
        }

        card.addView(View(context).apply { layoutParams = LinearLayout.LayoutParams(1, dp(20)) })

        // ── M3 прогресс-блок (скрыт до начала загрузки) ──
        val progressBlock = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            visibility = View.GONE
        }

        val progressLabel = TextView(context).apply {
            text = "Загрузка..."
            setTextColor(Color.parseColor("#9E9E9E"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
            gravity = Gravity.CENTER
        }

        // Трек прогресс-бара
        val trackHeight = dp(6)
        val trackBg = FrameLayout(context).apply {
            background = GradientDrawable().apply {
                setColor(Color.parseColor("#3D3D3D"))
                cornerRadius = trackHeight / 2f
            }
            clipToOutline = true
        }
        val progressFill = View(context).apply {
            background = GradientDrawable().apply {
                setColor(Color.parseColor("#D0BCFF"))
                cornerRadius = trackHeight / 2f
            }
            layoutParams = FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
            scaleX = 0f
            pivotX = 0f
        }
        trackBg.addView(progressFill)
        var progressAnimator: ObjectAnimator? = null

        progressBlock.addView(progressLabel, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(10)
        })
        progressBlock.addView(trackBg, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, trackHeight).apply {
            bottomMargin = dp(16)
        })

        card.addView(progressBlock, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
            bottomMargin = dp(8)
        })

        // ── Кнопки ──
        val btnUpdate = TextView(context).apply {
            text = "Обновить"
            setTextColor(Color.parseColor("#121212"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 15f)
            setTypeface(null, android.graphics.Typeface.BOLD)
            gravity = Gravity.CENTER
            setPadding(dp(16), dp(12), dp(16), dp(12))
            background = GradientDrawable().apply {
                cornerRadius = dp(24).toFloat()
                setColor(Color.parseColor("#D0BCFF"))
            }
            isClickable = true
            isFocusable = true
        }

        val secondaryRow = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }

        fun makeSecondaryBtn(label: String) = TextView(context).apply {
            text = label
            setTextColor(Color.parseColor("#9E9E9E"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
            setTypeface(null, android.graphics.Typeface.BOLD)
            gravity = Gravity.CENTER
            setPadding(dp(8), dp(8), dp(8), dp(8))
            background = GradientDrawable().apply {
                cornerRadius = dp(20).toFloat()
                setColor(Color.TRANSPARENT)
            }
            isClickable = true
            isFocusable = true
        }

        val btnSkip = makeSecondaryBtn("Пропустить")
        val btnLater = makeSecondaryBtn("Позже")

        btnSkip.setOnClickListener {
            prefs.edit().putString(PREF_SKIPPED, version).apply()
            dialog.dismiss()
        }
        val cancelled = AtomicBoolean(false)
        val btnClose = makeSecondaryBtn("Закрыть").apply {
            visibility = View.GONE
            setTextColor(Color.parseColor("#D0BCFF"))
            setOnClickListener {
                cancelled.set(true)
                dialog.dismiss()
            }
        }
        progressBlock.addView(btnClose, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))

        btnLater.setOnClickListener { dialog.dismiss() }
        btnUpdate.setOnClickListener {
            btnUpdate.visibility = View.GONE
            secondaryRow.visibility = View.GONE
            progressBlock.visibility = View.VISIBLE
            btnClose.visibility = View.VISIBLE
            downloadAndInstall(context, apkUrl, progressFill, progressLabel, dialog, cancelled,
                getAnimator = { progressAnimator },
                setAnimator = { progressAnimator = it },
                onError = {
                progressLabel.text = "Ошибка загрузки. Попробуйте позже."
                progressLabel.setTextColor(Color.parseColor("#FFB4AB"))
            })
        }

        secondaryRow.addView(btnSkip, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        secondaryRow.addView(btnLater, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))

        card.addView(btnUpdate, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
        card.addView(View(context).apply { layoutParams = LinearLayout.LayoutParams(1, dp(4)) })
        card.addView(secondaryRow)

        scrim.addView(card, cardParams)
        dialog.setContentView(scrim)
        dialog.setCanceledOnTouchOutside(false)
        dialog.show()
    }

    private fun downloadAndInstall(
        context: Context,
        url: String,
        progressFill: View,
        progressLabel: TextView,
        dialog: Dialog,
        cancelled: AtomicBoolean,
        getAnimator: () -> ObjectAnimator?,
        setAnimator: (ObjectAnimator?) -> Unit,
        onError: () -> Unit
    ) {
        downloadExecutor.execute {
            try {
                val dir = File(context.cacheDir, "updates").apply { mkdirs() }
                val file = File(dir, "update.apk")

                val conn = URL(url).openConnection() as HttpURLConnection
                try {
                    conn.connectTimeout = 15000
                    conn.readTimeout = 60000
                    conn.connect()
                    val total = conn.contentLength

                    conn.inputStream.use { input ->
                        file.outputStream().use { output ->
                            val buf = ByteArray(32768)
                            var downloaded = 0L
                            var n: Int
                            var lastUiUpdate = 0L
                            while (input.read(buf).also { n = it } != -1) {
                                if (cancelled.get()) return@execute
                                output.write(buf, 0, n)
                                downloaded += n
                                if (total > 0) {
                                    val now = System.currentTimeMillis()
                                    if (now - lastUiUpdate >= 100) {
                                        lastUiUpdate = now
                                        val scale = (downloaded.toFloat() / total).coerceIn(0f, 1f)
                                        mainHandler.post {
                                            if (progressFill.isAttachedToWindow) {
                                                getAnimator()?.cancel()
                                                val anim = ObjectAnimator.ofFloat(progressFill, "scaleX", progressFill.scaleX, scale)
                                                anim.duration = 120
                                                anim.start()
                                                setAnimator(anim)
                                                progressLabel.text = "Загрузка... ${(scale * 100).toInt()}%"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } finally {
                    conn.disconnect()
                }

                if (cancelled.get()) return@execute

                val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
                val intent = Intent(Intent.ACTION_VIEW).apply {
                    setDataAndType(uri, "application/vnd.android.package-archive")
                    flags = Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK
                }
                mainHandler.post {
                    if (context is Activity && !context.isFinishing && !context.isDestroyed) {
                        dialog.dismiss()
                        context.startActivity(intent)
                    }
                }
            } catch (_: Exception) {
                mainHandler.post {
                    if (!cancelled.get() && context is Activity && !context.isFinishing && !context.isDestroyed) {
                        onError()
                    }
                }
            }
        }
    }
}
