"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typescriptOverrides = exports.storybookConfig = exports.packageJsonConfig = exports.customRules = exports.baseConfig = void 0;
exports.baseConfig = {
    ignores: [
        "**/.react-router/**",
        "data/**",
        "**/map-styles/*.json",
        "**/node_modules/**",
        "pnpm-lock.yaml",
        ".vscode/*",
        "**/.vercel/*",
        "**/.astro/*",
        "**/.turbo/*",
        "**/build/*",
        ".repomix/*",
        "**/database.types.ts",
    ],
};
// Custom config for the monorepo
exports.customRules = {
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
};
// Override jsonc/sort-keys rule so it isn't set on package.json
exports.packageJsonConfig = {
    files: ["**/package.json"],
    rules: {
        "jsonc/sort-keys": "off",
    },
};
exports.storybookConfig = {
    files: ["**/*.stories.ts", "**/*.stories.tsx"],
    rules: {
        "canonical/filename-match-exported": "off",
    },
};
// Override prop-types rules for TypeScript files since we use TypeScript interfaces
exports.typescriptOverrides = {
    files: ["**/*.{ts,tsx}"],
    rules: {
        "react/no-unused-prop-types": "off",
        "react/prop-types": "off",
    },
};
