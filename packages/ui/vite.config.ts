/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="vitest" />
/// <reference types="vite/client" />

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@/components": path.resolve(__dirname, "./components"),
      "@/utils": path.resolve(__dirname, "./utils"),
    },
  },
  test: {
    cache: {
      dir: ".vitest",
    },
    coverage: {
      exclude: [
        "node_modules/",
        "**/*.stories.tsx",
        "**/*.stories.ts",
        "*.config.*",
      ],
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    css: {
      include: [/\.css$/u],
    },
    environment: "happy-dom",
    globals: true,
    include: [
      "components/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "utils/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    passWithNoTests: true,
    pool: "vmThreads",
    poolOptions: {
      vmThreads: {
        maxThreads: 4,
        minThreads: 1,
      },
    },
    setupFiles: "./test-setup.ts",
  },
});
