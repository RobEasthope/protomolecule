import { render, screen } from "@testing-library/react";
import { Type } from "./Type";
import { expect, test } from "vitest";

test("renders children", () => {
  render(<Type as="div">Lorem ipsum</Type>);

  expect(screen.queryAllByText(/Lorem ipsum/i)).toBeDefined();
});
