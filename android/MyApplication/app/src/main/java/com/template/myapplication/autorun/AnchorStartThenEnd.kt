package com.template.myapplication.autorun

import android.util.Log
import kotlinx.coroutines.delay

/**
 * 占位实现：未注入 AI 代码时仍能跑完（直接结束）。
 * AI 代码会通过 generated/GeneratedView.kt 注入，由本 flow 调用。
 */
class AnchorStartThenEnd : AutoRunFlow {

    companion object {
        private const val TAG = "AnchorStartThenEnd"
    }

    override suspend fun run() {
        Log.i(TAG, "[anchor_start_then_end] flow start")

        // 动态检查注入点是否提供了具体实现
        try {
            val cls = Class.forName("com.template.myapplication.generated.GeneratedView")
            Log.i(TAG, "[anchor_start_then_end] GeneratedView class found: $cls")
        } catch (e: ClassNotFoundException) {
            Log.w(TAG, "[anchor_start_then_end] GeneratedView not specialized; skipping")
        }

        // 模拟开播 30s 后结束；真实场景由 Generated 代码内部自行控制时序。
        delay(30_000L)

        Log.i(TAG, "[anchor_start_then_end] flow end")
    }
}
