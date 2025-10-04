import Link from "next/link";
import React from "react";

// Component props
export type NextInternalLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly homePageSlug?: string;
  readonly href: string | undefined;
};

export function NextInternalLink({
  children,
  className,
  homePageSlug,
  href,
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
      className={className}
      href={href === homePageSlug ? "/" : `/${href}`}
      {...rest}
    >
      {children || null}
    </Link>
  );
}
