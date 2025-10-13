import { type Linter } from "eslint";

export const testFiles = {
  files: [
    "**/*.test.{ts,tsx,js,jsx}",
    "**/*.spec.{ts,tsx,js,jsx}",
    "**/__tests__/**/*.{ts,tsx,js,jsx}",
  ],
  rules: {
    // Relax TypeScript strict rules for test files where `any` is acceptable
    // for testing type validation and error handling
    "@typescript-eslint/no-explicit-any": "warn",

    // Allow non-null assertions in test files where preconditions are asserted
    // and the test would fail anyway if the assumption is wrong
    "@typescript-eslint/no-non-null-assertion": "warn",
  },
} satisfies Linter.Config;
