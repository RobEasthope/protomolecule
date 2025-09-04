import {
  ignoredFolders,
  customRules,
  packageJsonRules,
  storybookRules,
  typescriptOverrideRules,
} from "./protomolecule.eslintSource";
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
