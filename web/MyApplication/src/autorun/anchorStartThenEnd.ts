// 占位实现：未注入 AI 代码时仍能跑完（直接结束）。
// AI 代码会以 src/generated/anchorView.ts 形式注入，由本 flow 调用其导出。

export async function run(): Promise<void> {
  console.log("[anchor_start_then_end] flow start");

  // 动态导入注入点；未注入时为空 export，不抛错。
  const view = await import("../generated/anchorView");
  if (typeof (view as { startAnchor?: () => Promise<void> }).startAnchor === "function") {
    await (view as { startAnchor: () => Promise<void> }).startAnchor();
  } else {
    console.warn("[anchor_start_then_end] generated/anchorView.ts has no startAnchor export; skipping");
  }

  // 模拟开播 30s 后结束；真实场景由 generated 代码内部自行控制时序。
  await new Promise((r) => setTimeout(r, 30_000));

  if (typeof (view as { endAnchor?: () => Promise<void> }).endAnchor === "function") {
    await (view as { endAnchor: () => Promise<void> }).endAnchor();
  }

  console.log("[anchor_start_then_end] flow end");
}
