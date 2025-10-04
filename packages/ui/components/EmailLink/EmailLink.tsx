import { cn } from "@/utils/tailwind";
import React from "react";

// Schema props
export type EmailLinkWithTitleSchemaProps = {
  _key: string;
  _type: "EmailLinkWithTitle";
  email: string;
  title: string;
};

export type EmailLinkSchemaProps = {
  _key: string;
  _type: "EmailLinkSansTitle";
  email: string;
  newTab: boolean;
};

// Component props
export type EmailLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly email: null | string;
};

export function EmailLink({
  children,
  className,
  email,
  ...rest
}: EmailLinkProps) {
  if (!email && !children) {
    return null;
  }

  if (!email) {
    return <span className={className}>{children || null}</span>;
  }

  // Create accessible label if not provided by user
  const ariaLabel = rest["aria-label"] || `Send email to ${email}`;

  return (
    <a
      aria-label={ariaLabel}
      className={cn(className, "hover:text-saffron duration-300")}
      href={`mailto:${email}`}
      rel="noopener noreferrer"
      target="_blank"
      {...rest}
    >
      {children || null}
    </a>
  );
}
