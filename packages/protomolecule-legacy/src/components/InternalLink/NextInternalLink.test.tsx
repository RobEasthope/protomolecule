import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextInternalLink } from "./NextInternalLink";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("NextInternalLink", () => {
  it("renders null when no href and no children", () => {
    const { container } = render(
      <NextInternalLink href={undefined}>
        {null}
      </NextInternalLink>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders a span when no href but has children", () => {
    render(
      <NextInternalLink href={undefined} className="test-class">
        Test Content
      </NextInternalLink>
    );
    const span = screen.getByText("Test Content");
    expect(span.tagName).toBe("SPAN");
    expect(span.className).toBe("test-class");
  });

  it("renders a Link with correct href for regular pages", () => {
    render(
      <NextInternalLink href="about" className="link-class">
        About Page
      </NextInternalLink>
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/about");
    expect(link.className).toBe("link-class");
    expect(link.textContent).toBe("About Page");
  });

  it("renders a Link with root href when href matches homePageSlug", () => {
    render(
      <NextInternalLink href="home" homePageSlug="home" className="home-link">
        Home
      </NextInternalLink>
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/");
    expect(link.textContent).toBe("Home");
  });

  it("passes through additional props to Link", () => {
    render(
      <NextInternalLink 
        href="contact" 
        data-testid="custom-link"
        aria-label="Contact us"
      >
        Contact
      </NextInternalLink>
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("data-testid")).toBe("custom-link");
    expect(link.getAttribute("aria-label")).toBe("Contact us");
    expect(link.getAttribute("tabindex")).toBe("0");
  });

  it("handles undefined homePageSlug correctly", () => {
    render(
      <NextInternalLink href="home" homePageSlug={undefined}>
        Home Link
      </NextInternalLink>
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/home");
  });

  it("applies className correctly", () => {
    render(
      <NextInternalLink 
        href="services" 
        className="text-blue-500 hover:text-blue-700"
      >
        Services
      </NextInternalLink>
    );
    const link = screen.getByRole("link");
    expect(link.className).toBe("text-blue-500 hover:text-blue-700");
  });

  it("handles empty string href", () => {
    render(
      <NextInternalLink href="" className="empty-href">
        Empty Href Link
      </NextInternalLink>
    );
    const span = screen.getByText("Empty Href Link");
    expect(span.tagName).toBe("SPAN");
    expect(span.className).toBe("empty-href");
  });

  it("renders children correctly when they are React elements", () => {
    render(
      <NextInternalLink href="products">
        <span>Products</span>
        <span> Page</span>
      </NextInternalLink>
    );
    const link = screen.getByRole("link");
    expect(link.textContent).toBe("Products Page");
  });
});