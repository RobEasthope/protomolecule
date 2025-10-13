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
    "func-style": ["error", "declaration"],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.test.{ts,tsx,js,jsx}",
          "**/*.spec.{ts,tsx,js,jsx}",
          "**/__tests__/**/*",
          "**/*.config.{ts,js,mjs,cjs}",
          "**/index.{ts,tsx,js,jsx}",
          ".changeset/**",
          ".github/scripts/**",
          "scripts/**",
        ],
        packageDir: ["./", "../", "../../"],
      },
    ],
    "no-console": ["warn", { allow: ["error", "debug", "warn", "log"] }],
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
