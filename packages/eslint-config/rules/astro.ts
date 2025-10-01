import { type Linter } from "eslint";
import { configs } from "eslint-plugin-astro";

export const astro = [
  ...configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    rules: {
      "astro/no-set-html-directive": "error",
      // Allow Astro virtual imports (astro:*) while still checking other imports
      "import/no-unresolved": [
        "error",
        {
          ignore: [
            "^astro:", // Astro virtual modules (astro:content, astro:assets, etc.)
          ],
        },
      ],
    },
  } satisfies Linter.Config,
];
