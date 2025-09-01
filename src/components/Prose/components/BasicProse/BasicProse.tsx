import type { PortableTextComponents } from "@portabletext/react";

import { Type } from "@/components/Type/Type";
import { EmailLink } from "@/components/EmailLink/EmailLink";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { ReactRouterLink } from "@/components/InternalLink/ReactRouterLink";

// export type BasicProseProps = Array<SanityKeyed<SanityBlock>>;

export const BasicProseComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <Type as="p">{children}</Type>,
  },
  marks: {
    // Text highlighting
    strong: ({ children }) => (
      <strong className="font-medium text-inherit">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-inherit">{children}</em>,

    // Links
    ExternalLink: ({ children, value }) => (
      <ExternalLink href={value.url}>{children}</ExternalLink>
    ),
    InternalLink: ({ children, value }) => (
      <ReactRouterLink
        href={value?.page?.slug?.current}
        homePageSlug={value?.appSettings?.homePageSlug}
      >
        {children}
      </ReactRouterLink>
    ),
    EmailLink: ({ children, value }) => (
      <EmailLink email={value?.email}>{children}</EmailLink>
    ),
  },
};
