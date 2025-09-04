import { type Linter } from "eslint";

export const packageJsonRules = {
  files: ["**/package.json"],
  rules: {
    "jsonc/sort-keys": "off",
  },
} satisfies Linter.Config;
