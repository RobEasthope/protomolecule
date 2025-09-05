import { cn } from "@/utils/tailwind";
import type React from "react";

// Component props
export type ExternalLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly href: string | undefined;
};

export function ExternalLink({
  children,
  className,
  href,
  ...rest
}: ExternalLinkProps) {
  if (!href && !children) {
    return null;
  }

  return (
    <a
      className={cn("hover:text-link duration-300", className)}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      {...rest}
    >
      {children || null}
    </a>
  );
}
