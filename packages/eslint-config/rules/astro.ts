import { type Linter } from "eslint";
import { configs } from "eslint-plugin-astro";

export const astro = [
  ...configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    rules: {
      "astro/no-set-html-directive": "error",
    },
  } satisfies Linter.Config,
];
