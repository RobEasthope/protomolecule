// eslint-disable-next-line canonical/filename-match-exported
import { type StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  addons: [
    "@storybook/addon-links",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: [
    "../components/**/*.mdx",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
};
export default config;
