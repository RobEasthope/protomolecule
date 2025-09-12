import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

// Read package.json to get dependencies
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf8"),
);

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "index.ts"),
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
      formats: ["es", "cjs"],
      name: "ProtomoleculeUI",
    },
    outDir: "dist",
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.peerDependencies || {}),
      ],
      output: {
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
