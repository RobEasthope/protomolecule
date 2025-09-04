import { customRules } from "./rules/custom";
import { ignoredFolders } from "./rules/ignoredFolders";
import { packageJsonRules } from "./rules/package-json-rules";
import { storybookRules } from "./rules/storybook";
import { typescriptOverrideRules } from "./rules/typescriptOverrides";
import eslintConfigCanonicalAuto from "eslint-config-canonical/auto";
import tseslint from "typescript-eslint";

export default tseslint.config([
  ignoredFolders,
  ...eslintConfigCanonicalAuto,
  packageJsonRules,
  storybookRules,
  typescriptOverrideRules,
  customRules,
]) as unknown;
