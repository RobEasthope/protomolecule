import { EmailLink } from "@/components/EmailLink/EmailLink";
import { ExternalLink } from "@/components/ExternalLink/ExternalLink";
import { ReactRouterLink } from "@/components/InternalLink/ReactRouterLink";
import { Type } from "@/components/Type/Type";
import { type PortableTextComponents } from "@portabletext/react";

// export type FullProseProps = Array<SanityKeyed<SanityBlock>>;

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
    code: ({ children }) => (
      <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm text-inherit">
        {children}
      </code>
    ),
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
    strong: ({ children }) => (
      <strong className="font-medium text-inherit">{children}</strong>
    ),
  },
  types: {
    // Custom component go here
  },
};
