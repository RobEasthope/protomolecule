import robeasthope from "@robeasthope/eslint-config";

export default [
  ...robeasthope,
  {
    ignores: [
      // Packages without JavaScript/TypeScript code
      "packages/colours/**",
      "packages/github-rulesets/**",
      "packages/tsconfig/**",
      // CI/CD automation scripts (console logging required)
      ".github/scripts/**",
      "scripts/**",
    ],
  },
];
