import Link from "next/link";
import React from "react";

// Component props
export type NextInternalLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  href: string | undefined;
  className?: string;
  children: React.ReactNode;
  homePageSlug?: string;
};

export function NextInternalLink({
  href,
  children,
  className,
  homePageSlug,
  ...rest
}: NextInternalLinkProps) {
  if (!href && !children) {
    return null;
  }

  if (!href) {
    return <span className={className}>{children || null}</span>;
  }

  return (
    <Link
    href={href === homePageSlug ? "/" : `/${href}`}
      className={className}
      role="link"
      tabIndex={0}
      {...rest}
    >
      {children || null}
    </Link>
  );
}
