import { Box } from "./Box";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Box", () => {
  it("renders children correctly", () => {
    render(<Box as="div">Lorem ipsum</Box>);

    expect(screen.getByText("Lorem ipsum")).toBeInTheDocument();
  });

  it("returns null when no children provided", () => {
    const { container } = render(<Box as="div">{null}</Box>);

    expect(container.firstChild).toBeNull();
  });

  it("applies custom className", () => {
    render(
      <Box as="span" className="text-red-500">
        Styled text
      </Box>,
    );

    const element = screen.getByText("Styled text");
    expect(element).toHaveClass("text-red-500");
  });

  it("renders as different HTML elements", () => {
    const { rerender } = render(<Box as="section">Section content</Box>);

    let element = screen.getByText("Section content");
    expect(element.tagName).toBe("SECTION");

    rerender(<Box as="article">Article content</Box>);
    element = screen.getByText("Article content");
    expect(element.tagName).toBe("ARTICLE");
  });

  it("accepts ref prop", () => {
    const ref = { current: null };
    render(
      <Box as="div" ref={ref}>
        With ref
      </Box>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
