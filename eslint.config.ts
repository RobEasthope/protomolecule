import robeasthope from "@robeasthope/eslint-config";

export default [
  ...robeasthope,
  {
    ignores: [
      // All packages have their own ESLint configs
      "packages/**",
      // CI/CD automation scripts (console logging required)
      ".github/scripts/**",
      "scripts/**",
    ],
  },
];
