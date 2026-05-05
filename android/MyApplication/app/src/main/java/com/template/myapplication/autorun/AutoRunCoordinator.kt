package com.template.myapplication.autorun

import android.util.Log

/**
 * 自动运行流程接口。
 */
interface AutoRunFlow {
    suspend fun run()
}

/**
 * 自动运行协调器：根据环境变量选择并执行对应的 auto-run flow。
 */
object AutoRunCoordinator {

    private const val TAG = "AutoRunCoordinator"

    private val flows: Map<String, () -> AutoRunFlow> = mapOf(
        "anchor_start_then_end" to { AnchorStartThenEnd() }
    )

    /**
     * 从 BuildConfig 或系统属性读取 flow ID 并执行。
     * 若未设置则跳过（手动模式）。
     */
    suspend fun runIfNeeded(flowId: String?) {
        if (flowId.isNullOrEmpty()) {
            Log.d(TAG, "No EVAL_AUTO_RUN_FLOW set, manual mode.")
            return
        }

        val factory = flows[flowId]
            ?: throw IllegalArgumentException("Unknown EVAL_AUTO_RUN_FLOW: $flowId. Known: ${flows.keys}")

        val flow = factory()
        flow.run()
        Log.i(TAG, "[MyApplication] auto-run flow done: $flowId")
    }
}
