import { Box } from "./Box";
import { type Meta, type StoryObj } from "@storybook/react-vite";

const meta = {
  component: Box,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Base UI/Box",
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    as: "section",
    children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
};

export const NoChildren: Story = {
  args: {
    as: "div",
    children: null,
  },
};
