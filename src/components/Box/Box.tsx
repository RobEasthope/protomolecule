import { createElement, forwardRef } from "react";

import { cn } from "@/utils/tailwind";
import { checkForStylingClasses } from "@/utils/checkForStylingClasses";

export interface BoxProps {
  as: string;
  className?: string;
  children?: React.ReactNode;
}

const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ as = "div", className, children, ...props }, ref) => {
    if (!children) return null;

    return createElement(
      as,
      {
        className: checkForStylingClasses(cn(className)),
        ref,
        ...props,
      },
      children,
    );
  },
);

Box.displayName = "Box";

export { Box };
