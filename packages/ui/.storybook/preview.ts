import { type Preview } from "@storybook/react-vite";
// eslint-disable-next-line import/no-unassigned-import
import "../styles/app.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
};

export default preview;
