import {
  baseConfig,
  customRules,
  packageJsonConfig,
  storybookConfig,
} from "./protomolecule.eslintSource";
import eslintConfigCanonicalAuto from "eslint-config-canonical/auto";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...eslintConfigCanonicalAuto,
  baseConfig,
  packageJsonConfig,
  storybookConfig,
  customRules,
] as const;
