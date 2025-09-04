import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ExternalLink } from "./ExternalLink";

describe("ExternalLink", () => {
  it("renders external link with children", () => {
    render(<ExternalLink href="https://example.com">Visit Site</ExternalLink>);

    const link = screen.getByText("Visit Site");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it('renders with target="_blank" and rel="noopener noreferrer"', () => {
    render(<ExternalLink href="https://example.com">External</ExternalLink>);

    const link = screen.getByText("External");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("returns null when no href and no children", () => {
    const { container } = render(
      <ExternalLink href={undefined}>{null}</ExternalLink>,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders link with undefined href but with children", () => {
    render(<ExternalLink href={undefined}>No Link</ExternalLink>);

    const link = screen.getByText("No Link");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).not.toHaveAttribute("href");
  });

  it("applies custom className", () => {
    render(
      <ExternalLink href="https://example.com" className="custom-class">
        Styled Link
      </ExternalLink>,
    );

    const link = screen.getByText("Styled Link");
    expect(link).toHaveClass("custom-class");
  });

  it("applies default hover styles", () => {
    render(<ExternalLink href="https://example.com">Hover Test</ExternalLink>);

    const link = screen.getByText("Hover Test");
    expect(link).toHaveClass("hover:text-link");
    expect(link).toHaveClass("duration-300");
  });

  it("passes through additional props", () => {
    render(
      <ExternalLink
        href="https://example.com"
        data-testid="external-link"
        aria-label="Visit external site"
      >
        Link
      </ExternalLink>,
    );

    const link = screen.getByTestId("external-link");
    expect(link).toHaveAttribute("aria-label", "Visit external site");
  });

  it("handles empty string href", () => {
    render(<ExternalLink href="">Empty Href</ExternalLink>);

    const link = screen.getByText("Empty Href");
    expect(link).toHaveAttribute("href", "");
  });

  it("handles protocol-relative URLs", () => {
    render(<ExternalLink href="//example.com">Protocol Relative</ExternalLink>);

    const link = screen.getByText("Protocol Relative");
    expect(link).toHaveAttribute("href", "//example.com");
  });
});
