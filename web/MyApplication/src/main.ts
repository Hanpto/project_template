import { loadEnv } from "./env";
import { runAutoFlow } from "./autorun/autoRunCoordinator";

async function bootstrap(): Promise<void> {
  const env = loadEnv();

  // TODO(SDK-init): 在引入具体 TRTC Web SDK 后，在此处初始化。
  // 例如（伪代码，最终选型见 Open Questions）：
  //   const client = TRTC.create({ sdkAppId: env.sdkAppId, userId: env.userId, userSig: env.userSig });
  //   (window as any).__trtcClient = client;
  //
  // 当前模板不绑定具体 SDK，故此处只把环境变量挂到全局供注入代码使用。
  (globalThis as unknown as { __trtcEnv: typeof env }).__trtcEnv = env;

  if (env.autoRunFlow) {
    await runAutoFlow(env.autoRunFlow);
    return;
  }

  // 正常 dev 模式：等待用户交互（由后续注入的 generated/*.ts 渲染 UI）。
  const root = document.getElementById("app");
  if (root) {
    root.textContent = "MyApplication (manual mode). Set VITE_EVAL_AUTO_RUN_FLOW to auto-run a flow.";
  }
}

bootstrap().catch((err) => {
  console.error("[MyApplication] bootstrap failed:", err);
  // 评测工具会从 stderr / console.error 抓取失败信号。
});
