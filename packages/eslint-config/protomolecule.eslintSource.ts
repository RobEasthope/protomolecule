// Base config that ignores react-router types folders
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
  ],
} satisfies Linter.Config;

// Custom config for the monorepo
export const customRules = {
  files: ["**/*.{ts,tsx,js,jsx,mjs}"],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    "canonical/id-match": "off",
    "func-style": ["error", "declaration"],
    "no-console": ["error", { allow: ["error", "debug", "warn"] }],
    "perfectionist/sort-modules": "off",
    "prettier/prettier": [
      "error",
      {
        plugins: ["prettier-plugin-tailwindcss"],
        singleQuote: false,
        tailwindFunctions: ["cn", "clsx"],
      },
    ],
    quotes: ["warn", "double"],
    "react/forbid-component-props": "off",
    "react/function-component-definition": "off",
    "unicorn/numeric-separators-style": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
} satisfies Linter.Config;

// Override jsonc/sort-keys rule so it isn't set on package.json
export const packageJsonRules = {
  files: ["**/package.json"],
  rules: {
    "jsonc/sort-keys": "off",
  },
} satisfies Linter.Config;

export const storybookRules = {
  files: ["**/*.stories.ts", "**/*.stories.tsx"],
  rules: {
    "canonical/filename-match-exported": "off",
  },
  ignores: ["**/storybook-static/**/*"],
} satisfies Linter.Config;

// Override prop-types rules for TypeScript files since we use TypeScript interfaces
export const typescriptOverrideRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    "react/no-unused-prop-types": "off",
    "react/prop-types": "off",
  },
} satisfies Linter.Config;
