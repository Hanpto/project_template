package com.template.myapplication

/**
 * 严格读取并校验环境变量/BuildConfig。
 * 命中缺失立即抛错，不静默 fallback —— 这是评测工具反作弊的硬约束。
 */
data class TrtcTestEnv(
    val sdkAppId: Int,
    val userId: String,
    val userSig: String,
    val autoRunFlow: String?
)

object Env {

    fun load(): TrtcTestEnv {
        val sdkAppIdRaw = System.getProperty("TRTC_TEST_SDKAPPID")
            ?: System.getenv("TRTC_TEST_SDKAPPID")
            ?: throw IllegalStateException("Missing required env: TRTC_TEST_SDKAPPID")

        val sdkAppId = sdkAppIdRaw.toIntOrNull()
            ?: throw IllegalStateException("TRTC_TEST_SDKAPPID must be a positive integer, got: $sdkAppIdRaw")
        require(sdkAppId > 0) { "TRTC_TEST_SDKAPPID must be positive, got: $sdkAppId" }

        val userId = System.getProperty("TRTC_TEST_USERID")
            ?: System.getenv("TRTC_TEST_USERID")
            ?: throw IllegalStateException("Missing required env: TRTC_TEST_USERID")
        require(userId.isNotEmpty()) { "TRTC_TEST_USERID must not be empty" }

        val userSig = System.getProperty("TRTC_TEST_USERSIG")
            ?: System.getenv("TRTC_TEST_USERSIG")
            ?: throw IllegalStateException("Missing required env: TRTC_TEST_USERSIG")
        require(userSig.isNotEmpty()) { "TRTC_TEST_USERSIG must not be empty" }

        val autoRunFlow = (System.getProperty("EVAL_AUTO_RUN_FLOW")
            ?: System.getenv("EVAL_AUTO_RUN_FLOW"))
            ?.takeIf { it.isNotEmpty() }

        return TrtcTestEnv(
            sdkAppId = sdkAppId,
            userId = userId,
            userSig = userSig,
            autoRunFlow = autoRunFlow
        )
    }
}
