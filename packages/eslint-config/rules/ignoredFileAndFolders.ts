import { type Linter } from "eslint";

export const ignoredFileAndFolders = {
  ignores: [
    "**/.react-router/**",
    "**/node_modules/**",
    "pnpm-lock.yaml",
    "**/.vscode/*",
    "**/.claude/*",
    "**/.vercel/*",
    "**/.astro/*",
    "**/.turbo/*",
    "**/build/*",
    "**/tsconfig.json",
    "**/dist/*",
    "**/storybook-static/*",
    "**/coverage/*",
    "**/eslint.config.ts",
    "**/eslint.config.mjs",
    // Packages without JavaScript/TypeScript code
    "**/packages/colours/**",
    "**/packages/github-rulesets/**",
    "**/packages/tsconfig/**",
  ],
} satisfies Linter.Config;
