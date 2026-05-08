package com.template.myapplication.autorun

import android.util.Log
import kotlinx.coroutines.delay

/**
 * Generic auto-run flow.
 *
 * This flow does NOT assume any specific class/method from the injected code.
 * Instead, it uses reflection to find and call entry points:
 *
 * 1. Try to find UserCode class and call its run() method
 * 2. If UserCode doesn't have run(), try init/setup/main
 * 3. If nothing works, wait for timeout (side-effect mode)
 *
 * This design decouples the flow runner from the AI-generated code's business logic,
 * making it work for ANY scenario (login, room lifecycle, media control, etc.)
 */
class RunGenerated : AutoRunFlow {

    companion object {
        private const val TAG = "RunGenerated"
        private const val USER_CODE_CLASS = "com.template.myapplication.generated.UserCode"
    }

    override suspend fun run() {
        Log.i(TAG, "[run_generated] flow start — loading injected code")

        try {
            val cls = Class.forName(USER_CODE_CLASS)
            Log.i(TAG, "[run_generated] UserCode class found: $cls")

            // Try to get the Kotlin object INSTANCE (for `object UserCode`)
            val instance = try {
                cls.getField("INSTANCE").get(null)
            } catch (_: NoSuchFieldException) {
                // Not an object — try no-arg constructor
                try {
                    cls.getDeclaredConstructor().newInstance()
                } catch (_: Exception) {
                    null
                }
            }

            if (instance != null) {
                // Try known entry point methods in priority order
                val methodNames = listOf("run", "main", "setup", "init", "start")
                var invoked = false

                for (name in methodNames) {
                    try {
                        val method = instance.javaClass.getMethod(name)
                        Log.i(TAG, "[run_generated] found $name(), invoking...")
                        val result = method.invoke(instance)
                        // If it returns a coroutine continuation (suspend fun), we already called it
                        // For regular functions, result might be null/Unit
                        invoked = true
                        break
                    } catch (_: NoSuchMethodException) {
                        continue
                    } catch (e: Exception) {
                        Log.e(TAG, "[run_generated] $name() threw: ${e.message}", e)
                        invoked = true
                        break
                    }
                }

                if (!invoked) {
                    Log.w(TAG, "[run_generated] No entry point found on UserCode. Loaded for side-effects.")
                    delay(10_000L)
                }
            } else {
                Log.w(TAG, "[run_generated] Could not instantiate UserCode. Waiting for side-effects...")
                delay(10_000L)
            }
        } catch (e: ClassNotFoundException) {
            Log.e(TAG, "[run_generated] UserCode class not found: ${e.message}")
            delay(10_000L)
        } catch (e: Exception) {
            Log.e(TAG, "[run_generated] Unexpected error: ${e.message}", e)
        }

        Log.i(TAG, "[run_generated] flow end")
    }
}
