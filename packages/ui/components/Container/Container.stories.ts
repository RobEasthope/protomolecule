import { Container } from "./Container";
import { type Meta, type StoryObj } from "@storybook/react-vite";

const meta = {
  component: Container,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Base UI/Container",
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
