import robeasthope from "@robeasthope/eslint-config";

export default [
  ...robeasthope,
  {
    // Ignore packages without JavaScript/TypeScript code
    ignores: [
      "packages/colours/**",
      "packages/github-rulesets/**",
      "packages/tsconfig/**",
    ],
  },
];
