import { Link } from "@remix-run/react";
import { SanityReference } from "@sanity/asset-utils";
import React from "react";

import { cn } from "@/utils/tailwind";

// Schema props
export type InternalLinkWithTitleSchemaProps = {
  _type: "InternalLinkWithTitle";
  _key: string;
  internalUID: SanityReference;
  to?: unknown;
  title: string;
};

export type InternalLinkSchemaProps = {
  _type: "InternalLinkSansTitle";
  _key: string;
  internalUID: SanityReference;
  to?: unknown;
};

// Component props
export type InternalLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  href: string | undefined;
  className?: string;
  children: React.ReactNode;
  homePageSlug?: string;
};

export function InternalLink({
  href,
  children,
  className,
  homePageSlug,
  ...rest
}: InternalLinkProps) {
  if (!href && !children) {
    return null;
  }

  if (!href) {
    return <span className={className}>{children || null}</span>;
  }

  return (
    <Link
      to={href === homePageSlug ? "/" : `/${href}`}
      role="link"
      tabIndex={0}
      className={cn(className, "hover:text-saffron duration-300")}
      {...rest}
    >
      {children || null}
    </Link>
  );
}
