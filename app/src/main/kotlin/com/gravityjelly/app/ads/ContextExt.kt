package com.gravityjelly.app.ads

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper

/** Tìm Activity từ một Context (cần cho show ad full-screen). */
fun Context.findActivity(): Activity? {
    var ctx = this
    while (ctx is ContextWrapper) {
        if (ctx is Activity) return ctx
        ctx = ctx.baseContext
    }
    return null
}
