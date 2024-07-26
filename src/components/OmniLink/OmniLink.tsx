/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { EmailLinkWithTitleSchemaProps } from "@/components/_base/EmailLink/EmailLink";
import { EmailLink } from "@/components/EmailLink/EmailLink";
import type {
  ExternalLinkSchemaProps,
  ExternalLinkWithTitleSchemaProps,
} from "@/components/ExternalLink/ExternalLink";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import type {
  InternalLinkSchemaProps,
  InternalLinkWithTitleSchemaProps,
} from "@/components/InternalLink/InternalLink";
import { RemixInternalLink } from "@/components/InternalLink/RemixInternalLink";

export type SuperLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  link:
    | EmailLinkWithTitleSchemaProps
    | ExternalLinkSchemaProps
    | ExternalLinkWithTitleSchemaProps
    | InternalLinkSchemaProps
    | InternalLinkWithTitleSchemaProps
    | undefined;
  className?: string;
  children: unknown;
  onClick?: () => void;
};

export const SuperLink = ({
  link,
  className,
  children,
  onClick,
  ...rest
}: SuperLinkProps) => {
  if (!link && !children) {
    return null;
  }

  switch (link?._type) {
    case "EmailLinkWithTitle":
      return (
        <EmailLink
          email={link?.href}
          className={className}
          onClick={onClick}
          {...rest}
        >
          {children}
        </EmailLink>
      );

    case "InternalLinkWithTitle":
      return (
        <RemixInternalLink
          href={link?.href}
          className={className}
          onClick={onClick}
          {...rest}
        >
          {children}
        </RemixInternalLink>
      );

    case "ExternalLinkWithTitle":
      return (
        <ExternalLink
          href={link?.href}
          className={className}
          onClick={onClick}
          {...rest}
        >
          {children}
        </ExternalLink>
      );

    default:
      return null;
  }
};
