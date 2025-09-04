import { Type } from "./Type";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Type", () => {
  it("renders children correctly", () => {
    render(<Type as="div">Lorem ipsum</Type>);

    expect(screen.getByText("Lorem ipsum")).toBeInTheDocument();
  });

  it("renders as different HTML elements", () => {
    const { rerender } = render(<Type as="h1">Heading</Type>);

    let element = screen.getByText("Heading");
    expect(element.tagName).toBe("H1");

    rerender(<Type as="p">Paragraph</Type>);
    element = screen.getByText("Paragraph");
    expect(element.tagName).toBe("P");
  });

  it("applies custom className", () => {
    render(
      <Type as="span" className="text-lg font-bold">
        Styled text
      </Type>,
    );

    const element = screen.getByText("Styled text");
    expect(element).toHaveClass("text-lg", "font-bold");
  });
});
