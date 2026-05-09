import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";

export default defineConfig({
  plugins: [vue2()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
  build: {
    target: "es2020",
    sourcemap: true,
  },
});
