/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable canonical/filename-match-exported */
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
  preferences,
  // Disable import/no-extraneous-dependencies for this package
  // ESLint configs need devDependencies in their main exports
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "import/no-extraneous-dependencies": "off",
    },
  },
];

export default config;
