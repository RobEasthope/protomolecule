import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta = {
  title: 'Base UI/Box',
  component: Box,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    as: 'section',
    children: 'Box',
  },
};

export const NoChildren: Story = {
  args: {
    as: 'div',
    children: null,
  },
};
