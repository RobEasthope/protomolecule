import { EmailLink } from "@/components/EmailLink/EmailLink";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { RemixInternalLink } from "@/components/InternalLink/RemixInternalLink";
import React from "react";

export type SuperLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  link: {
    _type: string;
    href: string;
  };
  className?: string;
  children: React.ReactNode;
};

export const SuperLink = ({
  link,
  className,
  children,
  ...rest
}: SuperLinkProps) => {
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
