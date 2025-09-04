import { type Linter } from "eslint";

export const ignoredFileAndFolders = {
  ignores: [
    "**/.react-router/**",
    "**/node_modules/**",
    "pnpm-lock.yaml",
    ".vscode/*",
    "**/.vercel/*",
    "**/.astro/*",
    "**/.turbo/*",
    "**/build/*",
    "**/tsconfig.json",
    "**/dist/*",
    "storybook-static/*",
    "**/coverage/*",
  ],
} satisfies Linter.Config;
