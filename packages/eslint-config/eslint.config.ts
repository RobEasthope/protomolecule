import { custom } from "./rules/custom";
import { ignoredFolders } from "./rules/ignoredFolders";
import { packageJson } from "./rules/packageJson";
import { storybook } from "./rules/storybook";
import { typescriptOverrides } from "./rules/typescriptOverrides";
import eslintConfigCanonicalAuto from "eslint-config-canonical/auto";

export default [
  ignoredFolders,
  ...eslintConfigCanonicalAuto,
  packageJson,
  storybook,
  typescriptOverrides,
  custom,
];
