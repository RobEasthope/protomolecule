import { EmailLink } from "@/components/EmailLink/EmailLink";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { RemixInternalLink } from "@/components/InternalLink/RemixInternalLink";
import React from "react";

export type OmniLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  link: {
    _type: string;
    href: string;
  };
  className?: string;
  children: React.ReactNode;
};

export const OmniLink = ({
  link,
  className,
  children,
  ...rest
}: OmniLinkProps) => {
  if (!link && !children) {
    return null;
  }

  switch (link?._type) {
    case "EmailLinkWithTitle":
      return (
        <EmailLink email={link?.href} className={className} {...rest}>
          {children}
        </EmailLink>
      );

    case "ExternalLinkWithTitle":
      return (
        <ExternalLink href={link?.href} className={className} {...rest}>
          {children}
        </ExternalLink>
      );

    case "InternalLinkWithTitle":
      return (
        <RemixInternalLink href={link?.href} className={className} {...rest}>
          {children}
        </RemixInternalLink>
      );

    default:
      return null;
  }
};
