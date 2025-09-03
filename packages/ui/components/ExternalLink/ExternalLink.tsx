import { cn } from "@/utils/tailwind";
import type React from "react";

// Component props
export type ExternalLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  href: string | undefined;
  className?: string;
  children: React.ReactNode;
};

export function ExternalLink({
  href,
  children,
  className,
  ...rest
}: ExternalLinkProps) {
  if (!href && !children) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("duration-300 hover:text-link", className)}
      {...rest}
    >
      {children || null}
    </a>
  );
}
