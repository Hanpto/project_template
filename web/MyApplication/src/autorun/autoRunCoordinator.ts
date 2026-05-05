type FlowModule = { run: () => Promise<void> };

const FLOWS: Record<string, () => Promise<FlowModule>> = {
  anchor_start_then_end: () => import("./anchorStartThenEnd"),
};

export async function runAutoFlow(flowId: string): Promise<void> {
  const loader = FLOWS[flowId];
  if (!loader) {
    throw new Error(`Unknown EVAL_AUTO_RUN_FLOW: ${flowId}. Known: ${Object.keys(FLOWS).join(", ")}`);
  }

  // 60s 全局超时 —— 与 INJECTION.json.auto_run_flows[*].timeout_sec 对齐。
  const timeoutMs = 60_000;
  const timer = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Auto-run timeout after ${timeoutMs}ms`)), timeoutMs),
  );

  const mod = await loader();
  await Promise.race([mod.run(), timer]);

  // 跑完正常退出（评测工具会捕获该信号；浏览器环境 close() 可能被拦截，留 console 信号即可）。
  console.log(`[MyApplication] auto-run flow done: ${flowId}`);
  try {
    window.close();
  } catch {
    /* ignored */
  }
}
