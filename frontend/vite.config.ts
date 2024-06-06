import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://backend:5000",
        changeOrigin: true,
      },
    },
  },
});
