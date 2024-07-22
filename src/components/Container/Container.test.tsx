import { render, screen } from "@testing-library/react";
import { Container } from "./Container";
import { expect, test } from "vitest";

test("renders children", () => {
  render(<Container as="div">Lorem ipsum</Container>);

  expect(screen.queryAllByText(/Lorem ipsum/i)).toBeDefined();
});
