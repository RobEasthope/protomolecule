import { Box } from "@/components/Box/Box";
import { cn } from "@/utils/tailwind";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { type TypedObject } from "sanity";

export type ProseProps = {
  readonly as: string;
  readonly className?: string;
  readonly components: unknown;
  readonly content: TypedObject | TypedObject[];
};

export function Prose({
  as = "div",
  className,
  components,
  content,
}: ProseProps) {
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
