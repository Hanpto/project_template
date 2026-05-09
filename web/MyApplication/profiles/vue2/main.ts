// vue2 profile — expects src/generated/App.vue as the root component.
import Vue from "vue";
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

  new Vue({ render: (h) => h(App as never) }).$mount("#app");
}

bootstrap().catch((err) => {
  console.error("[MyApplication] bootstrap failed:", err);
});
