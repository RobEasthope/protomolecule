import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Container } from "./Container";

describe("Container", () => {
  it("renders children correctly", () => {
    render(<Container as="div">Lorem ipsum</Container>);
    
    expect(screen.getByText("Lorem ipsum")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Container as="section" className="custom-class">
        Content
      </Container>
    );
    
    const container = screen.getByText("Content");
    expect(container).toHaveClass("custom-class");
  });

  it("renders as different HTML elements", () => {
    const { rerender } = render(<Container as="article">Article content</Container>);
    
    let element = screen.getByText("Article content");
    expect(element.tagName).toBe("ARTICLE");
    
    rerender(<Container as="main">Main content</Container>);
    element = screen.getByText("Main content");
    expect(element.tagName).toBe("MAIN");
  });

  it("applies maxWidth variant", () => {
    render(
      <Container as="div" maxWidth="small">
        Small container
      </Container>
    );
    
    const container = screen.getByText("Small container");
    expect(container).toHaveClass("max-w-lg");
  });

  it("applies breakout variant", () => {
    render(
      <Container as="div" breakout>
        Breakout container
      </Container>
    );
    
    const container = screen.getByText("Breakout container");
    expect(container).toHaveClass("w-screen");
  });
});
