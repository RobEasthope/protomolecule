import {
    baseConfig,
    customRules,
    packageJsonConfig,
    storybookConfig,
  } from "@repo/eslint/eslint.pkgConfig";
  import auto from "eslint-config-canonical/auto";
  import tseslint from "typescript-eslint";
  
  export default tseslint.config([
    baseConfig,
    ...auto,
    packageJsonConfig,
    storybookConfig,
    customRules,
  ]) as unknown;