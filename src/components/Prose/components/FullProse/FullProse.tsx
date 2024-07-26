import type { PortableTextComponents } from "@portabletext/react";

import { Type } from "@/components/Type/Type";
import { EmailLink } from "@/components/EmailLink/EmailLink";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { RemixInternalLink } from "@/components/InternalLink/RemixInternalLink";

export type FullProseProps = Array<SanityKeyed<SanityBlock>>;

export const FullProseComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <Type as="h2" className="mb-1 font-sans text-2xl font-bold">
        {children}
      </Type>
    ),
    h3: ({ children }) => (
      <Type as="h3" className="mb-1 font-sans text-xl font-bold">
        {children}
      </Type>
    ),
    h4: ({ children }) => (
      <Type as="h4" className="mb-1 font-sans text-lg font-bold">
        {children}
      </Type>
    ),
    normal: ({ children }) => <Type as="p">{children}</Type>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-inherit">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-inherit">{children}</em>,

    // Links
    ExternalLink: ({ children, value }) => (
      <ExternalLink href={value.url}>{children}</ExternalLink>
    ),
    InternalLink: ({ children, value }) => (
      <RemixInternalLink
        href={value?.page?.slug?.current}
        homePageSlug={value?.appSettings?.homePageSlug}
      >
        {children}
      </RemixInternalLink>
    ),
    EmailLink: ({ children, value }) => (
      <EmailLink email={value?.email}>{children}</EmailLink>
    ),
  },
  types: {
    // Custom component go here
  },
};
