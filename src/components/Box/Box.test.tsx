import { render, screen } from '@testing-library/react';
import { Box } from './Box';
import { expect, test } from 'vitest';

test('renders children', () => {
  render(<Box as="div">Lorem ipsum</Box>);

  expect(screen.queryAllByText(/Lorem ipsum/i)).toBeDefined();
});
