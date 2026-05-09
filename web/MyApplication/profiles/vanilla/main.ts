// vanilla profile — no framework runtime, injected code lives at
// src/generated/index.ts (by convention; code_injector default-routes the
// first unnamed .ts block there).
import { loadEnv } from "./env";
import { runAutoFlow } from "./autorun/autoRunCoordinator";

async function bootstrap(): Promise<void> {
  const env = loadEnv();
  (globalThis as unknown as { __trtcEnv: typeof env }).__trtcEnv = env;

  if (env.autoRunFlow) {
    await runAutoFlow(env.autoRunFlow);
    return;
  }

  // Dynamic import so a missing entry surfaces as a single clear error line
  // in runtime.log rather than a build failure.
  try {
    const mod = await import("./generated/index");
    // Convention: if the injected module exports a `run` function, call it.
    if (typeof (mod as { run?: () => Promise<void> | void }).run === "function") {
      const r = (mod as { run: () => Promise<void> | void }).run();
      if (r && typeof (r as Promise<void>).then === "function") await r;
    }
  } catch (e) {
    console.error("[vanilla] failed to load ./generated/index:", e);
  }
}

bootstrap().catch((err) => {
  console.error("[MyApplication] bootstrap failed:", err);
});
