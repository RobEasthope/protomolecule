import { OmniLink } from "./OmniLink";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

// Mock React Router Link
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: vi.fn(({ children, to, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    )),
  };
});

describe("OmniLink", () => {
  it("renders EmailLink for EmailLinkWithTitle type", () => {
    render(
      <OmniLink
        link={{ _type: "EmailLinkWithTitle", href: "test@example.com" }}
      >
        Email Me
      </OmniLink>,
    );

    const link = screen.getByText("Email Me");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "mailto:test@example.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders ExternalLink for ExternalLinkWithTitle type", () => {
    render(
      <OmniLink
        link={{ _type: "ExternalLinkWithTitle", href: "https://example.com" }}
      >
        External Site
      </OmniLink>,
    );

    const link = screen.getByText("External Site");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders ReactRouterLink for InternalLinkWithTitle type", () => {
    render(
      <BrowserRouter>
        <OmniLink link={{ _type: "InternalLinkWithTitle", href: "about" }}>
          About Page
        </OmniLink>
      </BrowserRouter>,
    );

    const link = screen.getByText("About Page");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/about");
  });

  it("returns null when no link and no children", () => {
    const { container } = render(
      // @ts-expect-error Testing undefined link prop
      <OmniLink link={undefined}>{null}</OmniLink>,
    );

    expect(container.firstChild).toBeNull();
  });

  it("returns null for unknown link type", () => {
    const { container } = render(
      <OmniLink link={{ _type: "UnknownType", href: "https://example.com" }}>
        Unknown
      </OmniLink>,
    );

    expect(container.firstChild).toBeNull();
  });

  it("passes className to child components", () => {
    render(
      <OmniLink
        className="custom-class"
        link={{ _type: "ExternalLinkWithTitle", href: "https://example.com" }}
      >
        Styled Link
      </OmniLink>,
    );

    const link = screen.getByText("Styled Link");
    expect(link).toHaveClass("custom-class");
  });

  it("passes additional props to child components", () => {
    render(
      <OmniLink
        aria-label="Test link"
        data-testid="omni-link"
        link={{ _type: "ExternalLinkWithTitle", href: "https://example.com" }}
      >
        Props Test
      </OmniLink>,
    );

    const link = screen.getByTestId("omni-link");
    expect(link).toHaveAttribute("aria-label", "Test link");
  });

  it("handles missing href in link object", () => {
    render(
      <OmniLink
        // @ts-expect-error Testing undefined href
        link={{ _type: "ExternalLinkWithTitle", href: undefined }}
      >
        No Href
      </OmniLink>,
    );

    const link = screen.getByText("No Href");
    expect(link).toBeInTheDocument();
  });

  it("handles empty children", () => {
    render(
      <OmniLink
        link={{ _type: "ExternalLinkWithTitle", href: "https://example.com" }}
      >
        {null}
      </OmniLink>,
    );

    const link = document.querySelector("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});
