import { Prose } from "./Prose";
import { render, screen } from "@testing-library/react";

describe("Prose", () => {
  it("renders children correctly", () => {
    render(<Prose>Lorem ipsum dolor sit amet</Prose>);

    expect(screen.getByText("Lorem ipsum dolor sit amet")).toBeInTheDocument();
  });

  it("applies default prose classes", () => {
    render(<Prose>Content</Prose>);

    const element = screen.getByText("Content");
    expect(element).toHaveClass("prose");
    expect(element).toHaveClass("text-typography");
    expect(element).toHaveClass("text-base");
  });

  it("applies custom className", () => {
    render(<Prose className="custom-prose">Content</Prose>);

    const element = screen.getByText("Content");
    expect(element).toHaveClass("custom-prose");
    expect(element).toHaveClass("prose");
  });

  it("renders as different HTML elements", () => {
    const { rerender } = render(<Prose as="article">Article content</Prose>);

    let element = screen.getByText("Article content");
    expect(element.tagName).toBe("ARTICLE");

    rerender(<Prose as="section">Section content</Prose>);
    element = screen.getByText("Section content");
    expect(element.tagName).toBe("SECTION");
  });

  it("renders as div by default", () => {
    render(<Prose>Default element</Prose>);

    const element = screen.getByText("Default element");
    expect(element.tagName).toBe("DIV");
  });

  it("returns null when no children provided", () => {
    const { container } = render(<Prose />);

    expect(container.firstChild).toBeNull();
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Prose ref={ref}>Content with ref</Prose>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("uses Slot component when asChild is true", () => {
    render(
      <Prose asChild>
        <span>Slotted content</span>
      </Prose>,
    );

    const element = screen.getByText("Slotted content");
    expect(element.tagName).toBe("SPAN");
    expect(element).toHaveClass("prose");
  });

  it("passes through additional props", () => {
    render(
      <Prose aria-label="Test prose" data-testid="prose-component">
        Content
      </Prose>,
    );

    const element = screen.getByTestId("prose-component");
    expect(element).toHaveAttribute("aria-label", "Test prose");
  });

  it("handles complex children", () => {
    render(
      <Prose>
        <h1>Heading</h1>
        <p>Paragraph text</p>
        <ul>
          <li>List item</li>
        </ul>
      </Prose>,
    );

    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("Paragraph text")).toBeInTheDocument();
    expect(screen.getByText("List item")).toBeInTheDocument();
  });
});
