import { type Linter } from "eslint";

export const customRules = {
  files: ["**/*.{ts,tsx,js,jsx,mjs}"],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    "canonical/id-match": "off",
    "func-style": ["error", "declaration"],
    "no-console": ["error", { allow: ["error", "debug", "warn"] }],
    "perfectionist/sort-modules": "off",
    "prettier/prettier": [
      "error",
      {
        plugins: ["prettier-plugin-tailwindcss"],
        singleQuote: false,
        tailwindFunctions: ["cn", "clsx"],
      },
    ],
    quotes: ["warn", "double"],
    "react/forbid-component-props": "off",
    "react/function-component-definition": "off",
    "unicorn/numeric-separators-style": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
} satisfies Linter.Config;
