import { type Linter } from "eslint";
import globals from "globals";

export const commonjs = {
  files: ["**/*.js", "**/*.cjs"],
  // Exclude ES modules
  ignores: ["**/*.mjs"],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.es2021,
    },
    parserOptions: {
      ecmaVersion: "latest",
    },
    sourceType: "script",
  },
} satisfies Linter.Config;
