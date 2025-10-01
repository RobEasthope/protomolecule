/* eslint-disable canonical/filename-match-exported */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { astro } from "./rules/astro";
import { ignoredFileAndFolders } from "./rules/ignoredFileAndFolders";
import { packageJson } from "./rules/packageJson";
import { preferences } from "./rules/preferences";
import { storybook } from "./rules/storybook";
import { typescriptOverrides } from "./rules/typescriptOverrides";
import eslintConfigCanonicalAuto from "eslint-config-canonical/auto";

const config: any[] = [
  ignoredFileAndFolders,
  ...eslintConfigCanonicalAuto,
  packageJson,
  storybook,
  typescriptOverrides,
  ...astro,
  preferences,
];

export default config;
