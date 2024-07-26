import "./prose.css";

import type { PortableTextComponents } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { TypedObject } from "sanity";

import { Box } from "@/components/base/Box/Box";
import { cn } from "@/utils/tailwind";

export type ProseProps = {
  as: string;
  className?: string;
  content: TypedObject | TypedObject[];
  components: unknown;
};

export function Prose({
  as = "div",
  content,
  components,
  className,
}: ProseProps) {
  if (!content) {
    return null;
  }

  return (
    <Box as={as} className={cn("prose", "text-ink", className)}>
      <PortableText
        value={content}
        components={components as PortableTextComponents}
      />
    </Box>
  );
}
