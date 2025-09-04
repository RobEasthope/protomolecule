import {
  baseConfig,
  customRules,
  packageJsonConfig,
  storybookConfig,
} from "./protomolecule.eslintSource";
import auto from "eslint-config-canonical/auto";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...auto,
  baseConfig,
  packageJsonConfig,
  storybookConfig,
  customRules,
] as const;
