// 严格读取并校验环境变量。命中缺失立即抛错，不静默 fallback —— 这是评测工具反作弊的硬约束。

export interface TrtcTestEnv {
  sdkAppId: number;
  userId: string;
  userSig: string;
  autoRunFlow: string | null;
}

function requireEnv(key: string): string {
  const v = import.meta.env[key];
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`Missing required env: ${key}. See .env.example.`);
  }
  return v;
}

export function loadEnv(): TrtcTestEnv {
  const sdkAppIdRaw = requireEnv("VITE_TRTC_TEST_SDKAPPID");
  const sdkAppId = Number.parseInt(sdkAppIdRaw, 10);
  if (!Number.isInteger(sdkAppId) || sdkAppId <= 0) {
    throw new Error(`VITE_TRTC_TEST_SDKAPPID must be a positive integer, got: ${sdkAppIdRaw}`);
  }
  return {
    sdkAppId,
    userId: requireEnv("VITE_TRTC_TEST_USERID"),
    userSig: requireEnv("VITE_TRTC_TEST_USERSIG"),
    autoRunFlow: import.meta.env.VITE_EVAL_AUTO_RUN_FLOW || null,
  };
}
