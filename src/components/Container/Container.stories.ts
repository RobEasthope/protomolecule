import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "./Container";

const meta = {
  title: "Base UI/Container",
  component: Container,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Container>;

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
