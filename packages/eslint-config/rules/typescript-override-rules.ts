import { type Linter } from "eslint";

export const typescriptOverrideRules = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    "react/no-unused-prop-types": "off",
    "react/prop-types": "off",
  },
} satisfies Linter.Config;