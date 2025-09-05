import { ReactRouterLink } from "./ReactRouterLink";
import { render, screen } from "@testing-library/react";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    [key: string]: unknown;
    readonly children: React.ReactNode;
    readonly to: string;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("ReactRouterLink", () => {
  it("renders null when no href and no children", () => {
    const { container } = render(
      <ReactRouterLink href={undefined}>{null}</ReactRouterLink>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders a span when no href but has children", () => {
    render(
      <ReactRouterLink className="test-class" href={undefined}>
        Test Content
      </ReactRouterLink>,
    );
    const span = screen.getByText("Test Content");
    expect(span.tagName).toBe("SPAN");
    expect(span.className).toBe("test-class");
  });

  it("renders a Link with correct href for regular pages", () => {
    render(
      <ReactRouterLink className="link-class" href="about">
        About Page
      </ReactRouterLink>,
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/about");
    expect(link.className).toBe("link-class");
    expect(link.textContent).toBe("About Page");
  });

  it("renders a Link with root href when href matches homePageSlug", () => {
    render(
      <ReactRouterLink className="home-link" homePageSlug="home" href="home">
        Home
      </ReactRouterLink>,
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/");
    expect(link.textContent).toBe("Home");
  });

  it("passes through additional props to Link", () => {
    render(
      <ReactRouterLink
        aria-label="Contact us"
        data-testid="custom-link"
        href="contact"
      >
        Contact
      </ReactRouterLink>,
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("data-testid")).toBe("custom-link");
    expect(link.getAttribute("aria-label")).toBe("Contact us");
    expect(link.getAttribute("tabindex")).toBe("0");
  });

  it("handles undefined homePageSlug correctly", () => {
    render(
      <ReactRouterLink homePageSlug={undefined} href="home">
        Home Link
      </ReactRouterLink>,
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/home");
  });

  it("applies className correctly", () => {
    render(
      <ReactRouterLink
        className="text-blue-500 hover:text-blue-700"
        href="services"
      >
        Services
      </ReactRouterLink>,
    );
    const link = screen.getByRole("link");
    expect(link.className).toBe("text-blue-500 hover:text-blue-700");
  });
});
