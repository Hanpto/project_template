/**
 * runGenerated.ts — Generic auto-run flow.
 *
 * This flow does NOT assume any specific export signature from the injected code.
 * Instead, it follows a universal contract:
 *
 * 1. Import the injected module (src/generated/userCode.ts)
 * 2. If the module exports a `run()` function → call it and await completion
 * 3. If no `run()` export → treat as side-effect-only import, wait for timeout
 *
 * This design decouples the flow runner from the AI-generated code's business logic,
 * making it work for ANY scenario (login, room lifecycle, media control, etc.)
 *
 * NOTE: We use `as any` casts because the injected code's actual exports are unknown
 * at template compile time — the placeholder only exports run(), but real injected
 * code may export default/main/setup/etc.
 */

export async function run(): Promise<void> {
  console.log("[run_generated] flow start — loading injected code");

  // Dynamic import of the injected code module.
  // Cast to `any` because the actual exports depend on what AI generates at injection time.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod: any = await import("../generated/userCode");

  // Universal execution: check for known entry points in priority order
  if (typeof mod.run === "function") {
    console.log("[run_generated] found run() export, executing...");
    await mod.run();
  } else if (typeof mod.default === "function") {
    console.log("[run_generated] found default export (function), executing...");
    await mod.default();
  } else if (typeof mod.main === "function") {
    console.log("[run_generated] found main() export, executing...");
    await mod.main();
  } else if (typeof mod.setup === "function") {
    console.log("[run_generated] found setup() export, executing...");
    await mod.setup();
  } else {
    // No callable entry point — the module was imported for side effects.
    // Wait a reasonable time for async operations (event listeners, etc.) to fire.
    console.warn(
      "[run_generated] No run/default/main/setup export found. " +
      "Module imported for side-effects. Waiting 10s for async operations..."
    );
    await new Promise((r) => setTimeout(r, 10_000));
  }

  console.log("[run_generated] flow end");
}
