import { type Linter } from "eslint";

export const storybookRules = {
  files: ["**/*.stories.ts", "**/*.stories.tsx"],
  rules: {
    "canonical/filename-match-exported": "off",
  },
  ignores: ["**/storybook-static/**/*"],
} satisfies Linter.Config;