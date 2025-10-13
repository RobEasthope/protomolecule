/* eslint-disable canonical/filename-match-exported */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { astro } from "./rules/astro";
import { commonjs } from "./rules/commonjs";
import { ignoredFileAndFolders } from "./rules/ignoredFileAndFolders";
import { packageJson } from "./rules/packageJson";
import { preferences } from "./rules/preferences";
import { storybook } from "./rules/storybook";
import { typescriptOverrides } from "./rules/typescriptOverrides";
import eslintConfigCanonicalAuto from "eslint-config-canonical/auto";
import pluginImportX from "eslint-plugin-import-x";

// Re-export Astro parser for proper resolution in monorepo workspaces
export { default as astroParser } from "astro-eslint-parser";
// Re-export plugins for workspace consumers
// This fixes plugin resolution when eslint-config is installed at monorepo root
// but ESLint is run from workspace subdirectories
export { default as pluginAstro } from "eslint-plugin-astro";
export { default as pluginImportX } from "eslint-plugin-import-x";
export { default as pluginJsdoc } from "eslint-plugin-jsdoc";
// @ts-expect-error - No types available for this plugin
export { default as pluginJsxA11y } from "eslint-plugin-jsx-a11y";
export { default as pluginN } from "eslint-plugin-n";
export { default as pluginPrettier } from "eslint-plugin-prettier";
// @ts-expect-error - No types available for this plugin
export { default as pluginPromise } from "eslint-plugin-promise";
export { default as pluginReact } from "eslint-plugin-react";
export { default as pluginReactHooks } from "eslint-plugin-react-hooks";
export { default as pluginRegexp } from "eslint-plugin-regexp";
export { default as pluginUnicorn } from "eslint-plugin-unicorn";
export * as typescriptEslint from "typescript-eslint";

const config: any[] = [
  // Plugin aliasing for eslint-config-canonical compatibility
  // Canonical config references "import" but package is "eslint-plugin-import-x"
  // Register under both names for backward compatibility
  // See: https://github.com/RobEasthope/protomolecule/issues/259
  {
    plugins: {
      import: pluginImportX, // Alias for canonical config compatibility
      "import-x": pluginImportX, // Standard name
    },
  },
  ignoredFileAndFolders,
  ...eslintConfigCanonicalAuto,
  packageJson,
  commonjs,
  storybook,
  typescriptOverrides,
  ...astro,
  preferences,
];

export default config;
