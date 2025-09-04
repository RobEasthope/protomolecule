import { EmailLink } from "./EmailLink";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("EmailLink", () => {
  it("renders email link with children", () => {
    render(<EmailLink email="test@example.com">Contact Us</EmailLink>);

    const link = screen.getByText("Contact Us");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "mailto:test@example.com");
  });

  it("renders with target='_blank' and rel='noopener noreferrer'", () => {
    render(<EmailLink email="test@example.com">Email</EmailLink>);

    const link = screen.getByText("Email");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("returns null when no email and no children", () => {
    const { container } = render(<EmailLink email={null}>{null}</EmailLink>);

    expect(container.firstChild).toBeNull();
  });

  it("renders span when email is null but children exist", () => {
    render(<EmailLink email={null}>No Email</EmailLink>);

    const element = screen.getByText("No Email");
    expect(element.tagName).toBe("SPAN");
    expect(element).not.toHaveAttribute("href");
  });

  it("applies custom className", () => {
    render(
      <EmailLink className="custom-class" email="test@example.com">
        Email Link
      </EmailLink>
    );

    const link = screen.getByText("Email Link");
    expect(link).toHaveClass("custom-class");
  });

  it("passes through additional props", () => {
    render(
      <EmailLink
        aria-label="Send email"
        data-testid="email-link"
        email="test@example.com"
      >
        Contact
      </EmailLink>
    );

    const link = screen.getByTestId("email-link");
    expect(link).toHaveAttribute("aria-label", "Send email");
  });

  it("handles empty string email", () => {
    render(<EmailLink email="">Empty Email</EmailLink>);

    const element = screen.getByText("Empty Email");
    expect(element.tagName).toBe("SPAN");
  });

  it("applies hover styles", () => {
    render(<EmailLink email="test@example.com">Hover Test</EmailLink>);

    const link = screen.getByText("Hover Test");
    expect(link).toHaveClass("hover:text-saffron");
    expect(link).toHaveClass("duration-300");
  });
});
