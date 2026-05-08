/**
 * autoRunCoordinator.ts — Flow dispatcher.
 *
 * Loads and executes the auto-run flow specified by the VITE_EVAL_AUTO_RUN_FLOW env var.
 * The coordinator is GENERIC — it does not contain business-logic-specific code.
 * All flows follow the same FlowModule interface: { run: () => Promise<void> }.
 *
 * Adding a new flow:
 * 1. Create src/autorun/<flowName>.ts exporting `run()`
 * 2. Add an entry to the FLOWS map below
 * 3. Declare it in INJECTION.json auto_run_flows
 */

type FlowModule = { run: () => Promise<void> };

const FLOWS: Record<string, () => Promise<FlowModule>> = {
  // Generic flow — works for ANY injected code scenario
  run_generated: () => import("./runGenerated"),

  // Legacy flow — kept for backward compatibility with existing Live/anchor cases
  anchor_start_then_end: () => import("./anchorStartThenEnd"),
};

export async function runAutoFlow(flowId: string): Promise<void> {
  const loader = FLOWS[flowId];
  if (!loader) {
    // Graceful fallback: if the requested flow doesn't exist, try run_generated
    console.warn(
      `[autoRunCoordinator] Unknown flow: "${flowId}". ` +
      `Known: ${Object.keys(FLOWS).join(", ")}. Falling back to "run_generated".`
    );
    const fallbackLoader = FLOWS["run_generated"]!;
    const mod = await fallbackLoader();
    await withTimeout(mod.run(), 60_000, flowId);
    return;
  }


  const timeoutMs = 60_000;
  const mod = await loader();
  await withTimeout(mod.run(), timeoutMs, flowId);

  console.log(`[MyApplication] auto-run flow done: ${flowId}`);
  try {
    window.close();
  } catch {
    /* ignored in non-browser env */
  }
}

async function withTimeout(
  task: Promise<void>,
  timeoutMs: number,
  flowId: string,
): Promise<void> {
  const timer = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Auto-run timeout after ${timeoutMs}ms (flow: ${flowId})`)),
      timeoutMs,
    ),
  );
  await Promise.race([task, timer]);
}
