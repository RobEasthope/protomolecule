import { type Linter } from "eslint";

export const preferences = {
  files: ["**/*.{ts,tsx,js,jsx,mjs}"],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    "canonical/filename-match-regex": "off",
    "canonical/id-match": "off",
    // Allow arrow functions for exported const with type annotations (React Router v7, Remix patterns)
    // e.g., `export const links: Route.LinksFunction = () => [...]`
    // See: https://github.com/RobEasthope/protomolecule/issues/299
    "func-style": [
      "error",
      "declaration",
      { allowArrowFunctions: true, overrides: { namedExports: "expression" } },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.test.{ts,tsx,js,jsx}",
          "**/*.spec.{ts,tsx,js,jsx}",
          "**/__tests__/**/*",
          "**/*.config.{ts,js,mjs,cjs}",
          ".changeset/**",
          ".github/scripts/**",
          "scripts/**",
        ],
        // Allow importing from @react-router/dev and similar framework dev packages
        // These are in devDependencies but required for route configuration at build time
        // See: https://github.com/RobEasthope/protomolecule/issues/299
        includeInternal: false,
        includeTypes: true,
        packageDir: ["./", "../", "../../"],
        // Allow importing from peerDependencies (for shared configs like eslint-config)
        peerDependencies: true,
      },
    ],
    // Allow CSS file imports (standard pattern in Vite, Next.js, React Router, Remix, Astro)
    // See: https://github.com/RobEasthope/protomolecule/issues/299
    "import/no-unassigned-import": [
      "error",
      {
        allow: ["**/*.css", "**/*.scss", "**/*.sass", "**/*.less", "**/*.pcss"],
      },
    ],
    "no-console": ["warn", { allow: ["error", "debug", "warn", "log"] }],
    // Allow empty patterns with type annotations (React Router v7, Remix, SvelteKit patterns)
    // e.g., `export function meta({}: Route.MetaArgs) { ... }`
    // The empty destructuring satisfies the type system even when arguments aren't used
    // See: https://github.com/RobEasthope/protomolecule/issues/299
    "no-empty-pattern": "off",
    "perfectionist/sort-modules": "off",
    "prettier/prettier": [
      "error",
      {
        plugins: ["prettier-plugin-tailwindcss"],
        singleQuote: false,
        tailwindFunctions: ["cn", "clsx"],
      },
    ],

    quotes: ["warn", "double", { avoidEscape: true }],
    "react/forbid-component-props": "off",
    "react/function-component-definition": "off",
    "regexp/no-unused-capturing-group": "off",
    "require-unicode-regexp": "off",
    "unicorn/better-regex": "off",
    "unicorn/numeric-separators-style": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
} satisfies Linter.Config;
