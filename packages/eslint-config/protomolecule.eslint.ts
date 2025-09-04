export { ignoredFolders } from "./rules/ignored-folders";
export { customRules } from "./rules/custom-rules";
export { packageJsonRules } from "./rules/package-json-rules";
export { storybookRules } from "./rules/storybook-rules";
export { typescriptOverrideRules } from "./rules/typescript-override-rules";
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
