// vue3 profile — expects src/generated/App.vue as the root component.
// code_injector promotes the first injected .vue to App.vue via Layer C.
import { createApp } from "vue";
import { loadEnv } from "./env";
import { runAutoFlow } from "./autorun/autoRunCoordinator";
import App from "./generated/App.vue";

async function bootstrap(): Promise<void> {
  const env = loadEnv();
  (globalThis as unknown as { __trtcEnv: typeof env }).__trtcEnv = env;

  if (env.autoRunFlow) {
    await runAutoFlow(env.autoRunFlow);
    return;
  }

  const root = document.getElementById("app");
  if (!root) {
    console.error("[vue3] #app element missing in index.html");
    return;
  }
  createApp(App).mount(root);
}

bootstrap().catch((err) => {
  console.error("[MyApplication] bootstrap failed:", err);
});
