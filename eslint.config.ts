import robeasthope from "@robeasthope/eslint-config";

export default [
  ...robeasthope,
  {
    // Disable ESLint formatting rules for JSON files - let Prettier handle it
    files: ["**/*.json", "**/*.jsonc"],
    rules: {
      "jsonc/array-bracket-newline": "off",
      "jsonc/array-bracket-spacing": "off",
      "jsonc/object-curly-newline": "off",
      "jsonc/object-property-newline": "off",
    },
  },
];
