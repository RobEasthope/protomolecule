import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReactRouterLink } from "./ReactRouterLink";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("ReactRouterLink", () => {
  it("renders null when no href and no children", () => {
    const { container } = render(
      <ReactRouterLink href={undefined}>
        {null}
      </ReactRouterLink>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders a span when no href but has children", () => {
    render(
      <ReactRouterLink href={undefined} className="test-class">
        Test Content
      </ReactRouterLink>
    );
    const span = screen.getByText("Test Content");
    expect(span.tagName).toBe("SPAN");
    expect(span.className).toBe("test-class");
  });

  it("renders a Link with correct href for regular pages", () => {
    render(
      <ReactRouterLink href="about" className="link-class">
        About Page
      </ReactRouterLink>
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/about");
    expect(link.className).toBe("link-class");
    expect(link.textContent).toBe("About Page");
  });

  it("renders a Link with root href when href matches homePageSlug", () => {
    render(
      <ReactRouterLink href="home" homePageSlug="home" className="home-link">
        Home
      </ReactRouterLink>
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/");
    expect(link.textContent).toBe("Home");
  });

  it("passes through additional props to Link", () => {
    render(
      <ReactRouterLink 
        href="contact" 
        data-testid="custom-link"
        aria-label="Contact us"
      >
        Contact
      </ReactRouterLink>
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("data-testid")).toBe("custom-link");
    expect(link.getAttribute("aria-label")).toBe("Contact us");
    expect(link.getAttribute("tabindex")).toBe("0");
  });

  it("handles undefined homePageSlug correctly", () => {
    render(
      <ReactRouterLink href="home" homePageSlug={undefined}>
        Home Link
      </ReactRouterLink>
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/home");
  });

  it("applies className correctly", () => {
    render(
      <ReactRouterLink 
        href="services" 
        className="text-blue-500 hover:text-blue-700"
      >
        Services
      </ReactRouterLink>
    );
    const link = screen.getByRole("link");
    expect(link.className).toBe("text-blue-500 hover:text-blue-700");
  });
});