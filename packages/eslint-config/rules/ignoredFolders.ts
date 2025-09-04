import { type Linter } from "eslint";

export const ignoredFolders = {
  ignores: [
    "**/.react-router/**",
    "**/node_modules/**",
    "pnpm-lock.yaml",
    ".vscode/*",
    "**/.vercel/*",
    "**/.astro/*",
    "**/.turbo/*",
    "**/build/*",
    "tsconfig.json",
  ],
} satisfies Linter.Config;
