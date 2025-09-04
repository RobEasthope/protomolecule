import { type Linter } from "eslint";

export const storybook = {
  files: ["**/*.stories.ts", "**/*.stories.tsx"],
  ignores: ["**/storybook-static/**/*"],
  rules: {
    "canonical/filename-match-exported": "off",
  },
} satisfies Linter.Config;
