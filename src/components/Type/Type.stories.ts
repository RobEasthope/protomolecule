import type { Meta, StoryObj } from "@storybook/react";
import { Type } from "./Type";

const meta = {
  title: "Base UI/Type",
  component: Type,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
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
