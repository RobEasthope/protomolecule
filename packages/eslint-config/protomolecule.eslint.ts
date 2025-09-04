import { customRules } from "./rules/custom-rules";
import { ignoredFolders } from "./rules/ignored-folders";
import { packageJsonRules } from "./rules/package-json-rules";
import { storybookRules } from "./rules/storybook-rules";
import { typescriptOverrideRules } from "./rules/typescript-override-rules";
import eslintConfigCanonicalAuto from "eslint-config-canonical/auto";
import tseslint from "typescript-eslint";

export default [
  ignoredFolders,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...eslintConfigCanonicalAuto,
  packageJsonRules,
  storybookRules,
  typescriptOverrideRules,
  customRules,
] as const;
