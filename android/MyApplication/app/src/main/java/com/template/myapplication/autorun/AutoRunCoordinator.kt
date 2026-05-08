package com.template.myapplication.autorun

import android.util.Log

/**
 * Auto-run flow interface.
 */
interface AutoRunFlow {
    suspend fun run()
}

/**
 * Auto-run flow dispatcher: selects and executes the flow specified by system property or intent.
 * If flow ID is unknown, gracefully falls back to "run_generated".
 */
object AutoRunCoordinator {

    private const val TAG = "AutoRunCoordinator"

    private val flows: Map<String, () -> AutoRunFlow> = mapOf(
        // Generic flow — works for ANY injected code scenario
        "run_generated" to { RunGenerated() },
        // Legacy flow — kept for backward compatibility with existing Live/anchor cases
        "anchor_start_then_end" to { AnchorStartThenEnd() },
    )

    /**
     * Execute the specified flow ID.
     * If flowId is null/empty, skip (manual mode).
     * If flowId is unknown, gracefully fall back to "run_generated".
     */
    suspend fun runIfNeeded(flowId: String?) {
        if (flowId.isNullOrEmpty()) {
            Log.d(TAG, "No EVAL_AUTO_RUN_FLOW set, manual mode.")
            return
        }

        val factory = flows[flowId]
        if (factory == null) {
            // Graceful fallback: unknown flow → use run_generated
            Log.w(TAG, "Unknown flow: '$flowId'. Known: ${flows.keys}. Falling back to 'run_generated'.")
            val fallbackFactory = flows["run_generated"]!!
            val flow = fallbackFactory()
            flow.run()
            Log.i(TAG, "[MyApplication] auto-run flow done (fallback): $flowId")
            return
        }

        val flow = factory()
        flow.run()
        Log.i(TAG, "[MyApplication] auto-run flow done: $flowId")
    }
}
