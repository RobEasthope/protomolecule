import { Box } from "@/components/Box/Box";
import { cn } from "@/utils/tailwind";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { type TypedObject } from "sanity";

export type SanityProseProps = {
  readonly as: string;
  readonly className?: string;
  readonly components: unknown;
  readonly content: TypedObject | TypedObject[];
};

export function SanityProse({
  as = "div",
  className,
  components,
  content,
}: SanityProseProps) {
  if (!content) {
    return null;
  }

  return (
    <Box as={as} className={cn("prose", "text-ink", className)}>
      <PortableText
        components={components as PortableTextComponents}
        value={content}
      />
    </Box>
  );
}
