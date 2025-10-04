import { type SanityReference } from "@sanity/asset-utils";
import React from "react";
import { Link } from "react-router-dom";

// Schema props
export type InternalLinkWithTitleSchemaProps = {
  _key: string;
  _type: "InternalLinkWithTitle";
  internalUID: SanityReference;
  title: string;
  to?: unknown;
};

export type InternalLinkSchemaProps = {
  _key: string;
  _type: "InternalLinkSansTitle";
  internalUID: SanityReference;
  to?: unknown;
};

// Component props
export type ReactRouterLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly homePageSlug?: string;
  readonly href: string | undefined;
};

export function ReactRouterLink({
  children,
  className,
  homePageSlug,
  href,
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
      className={className}
      to={href === homePageSlug ? "/" : `/${href}`}
      {...rest}
    >
      {children || null}
    </Link>
  );
}
