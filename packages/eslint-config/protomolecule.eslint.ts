import {
  ignoredFolders,
  customRules,
  packageJsonConfig,
  storybookRules,
} from "./protomolecule.eslintSource";
import eslintConfigCanonicalAuto from "eslint-config-canonical/auto";
import tseslint from "typescript-eslint";

export default [
  ignoredFolders,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...eslintConfigCanonicalAuto,
  packageJsonConfig,
  storybookRules,
  customRules,
] as const;
