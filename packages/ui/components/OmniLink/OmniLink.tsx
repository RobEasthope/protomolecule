import { EmailLink } from "@/components/EmailLink/EmailLink";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { ReactRouterLink } from "@/components/InternalLink/ReactRouterLink";
import React from "react";

/**
 * Discriminated union type for different link types supported by OmniLink
 */
export type OmniLinkData =
  | {
      _type: "EmailLinkWithTitle";
      href: string;
    }
  | {
      _type: "ExternalLinkWithTitle";
      href: string;
    }
  | {
      _type: "InternalLinkWithTitle";
      href: string;
    };

export type OmniLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly link: OmniLinkData;
};

export function OmniLink({
  children,
  className,
  link,
  ...rest
}: OmniLinkProps) {
  if (!link && !children) {
    return null;
  }

  switch (link?._type) {
    case "EmailLinkWithTitle":
      return (
        <EmailLink className={className} email={link?.href} {...rest}>
          {children}
        </EmailLink>
      );

    case "ExternalLinkWithTitle":
      return (
        <ExternalLink className={className} href={link?.href} {...rest}>
          {children}
        </ExternalLink>
      );

    case "InternalLinkWithTitle":
      return (
        <ReactRouterLink className={className} href={link?.href} {...rest}>
          {children}
        </ReactRouterLink>
      );

    default:
      return null;
  }
}
