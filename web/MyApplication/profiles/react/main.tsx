// react profile — expects src/generated/App.tsx as the root component.
import React from "react";
import { createRoot } from "react-dom/client";
import { loadEnv } from "./env";
import { runAutoFlow } from "./autorun/autoRunCoordinator";
import App from "./generated/App";

async function bootstrap(): Promise<void> {
  const env = loadEnv();
  (globalThis as unknown as { __trtcEnv: typeof env }).__trtcEnv = env;

  if (env.autoRunFlow) {
    await runAutoFlow(env.autoRunFlow);
    return;
  }

  const root = document.getElementById("app");
  if (!root) {
    console.error("[react] #app element missing in index.html");
    return;
  }
  createRoot(root).render(React.createElement(App));
}

bootstrap().catch((err) => {
  console.error("[MyApplication] bootstrap failed:", err);
});
