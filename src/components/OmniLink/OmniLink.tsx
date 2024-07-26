import { EmailLink } from "@/components/EmailLink/EmailLink";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { RemixInternalLink } from "@/components/InternalLink/RemixInternalLink";

export type SuperLinkProps = React.HTMLAttributes<HTMLAnchorElement> & {
  link: {
    _type: string;
    href: string;
  };
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
