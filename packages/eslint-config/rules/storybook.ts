import { type Linter } from "eslint";
import tseslint from "typescript-eslint";

export const storybook: Linter.Config[] = [
  {
    files: ["**/*.stories.ts", "**/*.stories.tsx"],
    ignores: ["**/storybook-static/**/*"],
    rules: {
      "canonical/filename-match-exported": "off",
    },
  } satisfies Linter.Config,
  // Disable type-aware linting for Storybook files excluded from tsconfig
  // This keeps syntax-based rules active while avoiding project reference errors
  {
    files: ["**/*.stories.ts", "**/*.stories.tsx"],
    ...tseslint.configs.disableTypeChecked,
  },
];
