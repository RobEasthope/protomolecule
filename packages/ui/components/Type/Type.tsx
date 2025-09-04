import { cn } from "@/utils/tailwind";
import { cva, type VariantProps } from "class-variance-authority";
import { createElement } from "react";

const typeVariants = cva(
  // Root/base styles
  null,
  {
    defaultVariants: {
      variant: "base",
    },
    variants: {
      variant: {
        // General
        base: "text-base",
      },
    },
  },
);

export type TypeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof typeVariants> & {
    readonly as: // All valid HTML text elements
    | "dd"
      | "div"
      | "dt"
      | "figcaption"
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "h5"
      | "h6"
      | "li"
      | "p"
      | "q"
      | "small"
      | "span";
  };

export function Type({
  as = "p",
  children,
  className,
  variant = "base",
  ...rest
}: TypeProps) {
  if (!children) {
    return null;
  }

  return createElement(
    as,
    {
      className: cn(typeVariants({ variant }), className),
      ...rest,
    },
    children,
  );
}
