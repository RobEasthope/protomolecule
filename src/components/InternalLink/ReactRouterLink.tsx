import { Link } from "react-router-dom";
import { SanityReference } from "@sanity/asset-utils";
import React from "react";

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
export type ReactRouterLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  href: string | undefined;
  className?: string;
  children: React.ReactNode;
  homePageSlug?: string;
};

export function ReactRouterLink({
  href,
  children,
  className,
  homePageSlug,
  ...rest
}: ReactRouterLinkProps) {
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
      className={className}
      {...rest}
    >
      {children || null}
    </Link>
  );
}
