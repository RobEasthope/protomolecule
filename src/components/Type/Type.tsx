import { createElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, stylesCheck } from "@/utils/tailwind";

const typeVariants = cva(
  // Base styles
  null,
  {
    variants: {
      variant: {
        // General
        base: "text-base print:text-[11pt]",
        "section-heading": "text-2xl leading-none print:text-[14pt]",

        // Landing
        "landing-heading": "text-xl leading-tight",

        // Project
        "work-heading": "text-2xl leading-none",

        // Project index
        "work-thumbnail-subheading": "text-sm italic",

        // CV
        "cv-name": "text-lg print:text-[14pt]",
        "gig-heading": "font-bold print:text-[12pt]",
        "gig-subheading": "italic",

        // Navigation
        "header-links": "",

        // Footer
        copyright: "text-sm",
      },
    },
    defaultVariants: {
      variant: "base",
    },
  },
);

export interface TypeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof typeVariants> {
  as: // All valid HTML text elements
  | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "dt"
    | "dd"
    | "span"
    | "small"
    | "div"
    | "figcaption"
    | "q"
    | "li";
}

export function Type({
  as = "p",
  variant = "base",
  className,
  children,
  ...rest
}: TypeProps) {
  if (!children) {
    return null;
  }

  return createElement(
    as,
    {
      className: stylesCheck(cn(typeVariants({ variant }), className)),
      ...rest,
    },
    children,
  );
}
