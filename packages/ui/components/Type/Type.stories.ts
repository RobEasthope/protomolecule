import { Type } from "./Type";
import { type Meta, type StoryObj } from "@storybook/react-vite";

const meta = {
  component: Type,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Base UI/Type",
} satisfies Meta<typeof Type>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    as: "p",
    children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
};

export const NoChildren: Story = {
  args: {
    as: "p",
    children: null,
  },
};
