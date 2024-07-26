import Link from "next/link";
import React from "react";

// Component props
export type InternalLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  href: string | null;
  className?: string;
  children: React.ReactNode;
};

export const InternalLink = ({
  href,
  children,
  className,
  ...rest
}: InternalLinkProps) => {
  if (!href && !children) {
    return null;
  }

  if (!href) {
    return <span className={className}>{children || null}</span>;
  }

  return (
    <Link
      href={href === "home" ? "/" : `/${href}`}
      className={className}
      role="link"
      tabIndex={0}
      {...rest}
    >
      {children || null}
    </Link>
  );
};