import { EmailLink } from "@/components/EmailLink/EmailLink";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { ReactRouterLink } from "@/components/InternalLink/ReactRouterLink";
import { Type } from "@/components/Type/Type";
import { type PortableTextComponents } from "@portabletext/react";

// export type BasicProseProps = Array<SanityKeyed<SanityBlock>>;

export const BasicProseComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <Type as="p">{children}</Type>,
  },
  marks: {
    em: ({ children }) => <em className="text-inherit italic">{children}</em>,
    EmailLink: ({ children, value }) => (
      <EmailLink email={value?.email}>{children}</EmailLink>
    ),

    // Links
    ExternalLink: ({ children, value }) => (
      <ExternalLink href={value.url}>{children}</ExternalLink>
    ),
    InternalLink: ({ children, value }) => (
      <ReactRouterLink
        homePageSlug={value?.appSettings?.homePageSlug}
        href={value?.page?.slug?.current}
      >
        {children}
      </ReactRouterLink>
    ),
    // Text highlighting
    strong: ({ children }) => (
      <strong className="font-medium text-inherit">{children}</strong>
    ),
  },
};
