// Shim for Vue SFC imports so TypeScript resolves ``import App from './App.vue'``.
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}
