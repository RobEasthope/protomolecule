import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Prose } from "./Prose";

describe("Prose", () => {
  const mockContent = [
    {
      _type: "block",
      _key: "block1",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "span1",
          text: "This is test content",
          marks: [],
        },
      ],
      markDefs: [],
    },
  ];

  const mockComponents = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p>{children}</p>
      ),
    },
  };

  it("renders portable text content", () => {
    render(
      <Prose as="div" content={mockContent} components={mockComponents} />,
    );

    expect(screen.getByText("This is test content")).toBeInTheDocument();
  });

  it("returns null when content is null", () => {
    const { container } = render(
      <Prose
        as="div"
        // @ts-expect-error Testing null content
        content={null}
        components={mockComponents}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("returns null when content is undefined", () => {
    const { container } = render(
      <Prose
        as="div"
        // @ts-expect-error Testing undefined content
        content={undefined}
        components={mockComponents}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("applies custom className", () => {
    render(
      <Prose
        as="div"
        content={mockContent}
        components={mockComponents}
        className="custom-prose"
      />,
    );

    const container = screen.getByText("This is test content").closest("div");
    expect(container).toHaveClass("custom-prose");
  });

  it("renders as different HTML elements", () => {
    const { rerender } = render(
      <Prose as="article" content={mockContent} components={mockComponents} />,
    );

    let container = screen.getByText("This is test content").closest("article");
    expect(container?.tagName).toBe("ARTICLE");

    rerender(
      <Prose as="section" content={mockContent} components={mockComponents} />,
    );

    container = screen.getByText("This is test content").closest("section");
    expect(container?.tagName).toBe("SECTION");
  });

  it("applies default prose styles", () => {
    render(
      <Prose as="div" content={mockContent} components={mockComponents} />,
    );

    const container = screen.getByText("This is test content").closest("div");
    expect(container).toHaveClass("prose");
    expect(container).toHaveClass("text-ink");
  });

  it("handles single block content", () => {
    const singleBlock = mockContent[0];
    render(
      <Prose as="div" content={singleBlock} components={mockComponents} />,
    );

    expect(screen.getByText("This is test content")).toBeInTheDocument();
  });

  it("handles multiple blocks", () => {
    const multipleBlocks = [
      ...mockContent,
      {
        _type: "block",
        _key: "block2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "span2",
            text: "Second block",
            marks: [],
          },
        ],
        markDefs: [],
      },
    ];

    render(
      <Prose as="div" content={multipleBlocks} components={mockComponents} />,
    );

    expect(screen.getByText("This is test content")).toBeInTheDocument();
    expect(screen.getByText("Second block")).toBeInTheDocument();
  });

  it("handles empty array content", () => {
    render(<Prose as="div" content={[]} components={mockComponents} />);

    const container = document.querySelector(".prose");
    expect(container).toBeInTheDocument();
  });
});
