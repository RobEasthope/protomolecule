import { Prose } from "./Prose";
import { render, screen } from "@testing-library/react";

describe("Prose", () => {
  const mockContent = [
    {
      _key: "block1",
      _type: "block",
      children: [
        {
          _key: "span1",
          _type: "span",
          marks: [],
          text: "This is test content",
        },
      ],
      markDefs: [],
      style: "normal",
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
      <Prose as="div" components={mockComponents} content={mockContent} />,
    );

    expect(screen.getByText("This is test content")).toBeInTheDocument();
  });

  it("returns null when content is null", () => {
    const { container } = render(
      <Prose
        as="div"
        components={mockComponents}
        // @ts-expect-error Testing null content
        content={null}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("returns null when content is undefined", () => {
    const { container } = render(
      <Prose
        as="div"
        components={mockComponents}
        // @ts-expect-error Testing undefined content
        content={undefined}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("applies custom className", () => {
    render(
      <Prose
        as="div"
        className="custom-prose"
        components={mockComponents}
        content={mockContent}
      />,
    );

    const container = screen.getByText("This is test content").closest("div");
    expect(container).toHaveClass("custom-prose");
  });

  it("renders as different HTML elements", () => {
    const { rerender } = render(
      <Prose as="article" components={mockComponents} content={mockContent} />,
    );

    let container = screen.getByText("This is test content").closest("article");
    expect(container?.tagName).toBe("ARTICLE");

    rerender(
      <Prose as="section" components={mockComponents} content={mockContent} />,
    );

    container = screen.getByText("This is test content").closest("section");
    expect(container?.tagName).toBe("SECTION");
  });

  it("applies default prose styles", () => {
    render(
      <Prose as="div" components={mockComponents} content={mockContent} />,
    );

    const container = screen.getByText("This is test content").closest("div");
    expect(container).toHaveClass("prose");
    expect(container).toHaveClass("text-ink");
  });

  it("handles single block content", () => {
    const singleBlock = mockContent[0];
    render(
      <Prose as="div" components={mockComponents} content={singleBlock} />,
    );

    expect(screen.getByText("This is test content")).toBeInTheDocument();
  });

  it("handles multiple blocks", () => {
    const multipleBlocks = [
      ...mockContent,
      {
        _key: "block2",
        _type: "block",
        children: [
          {
            _key: "span2",
            _type: "span",
            marks: [],
            text: "Second block",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ];

    render(
      <Prose as="div" components={mockComponents} content={multipleBlocks} />,
    );

    expect(screen.getByText("This is test content")).toBeInTheDocument();
    expect(screen.getByText("Second block")).toBeInTheDocument();
  });

  it("handles empty array content", () => {
    render(<Prose as="div" components={mockComponents} content={[]} />);

    const container = document.querySelector(".prose");
    expect(container).toBeInTheDocument();
  });
});
