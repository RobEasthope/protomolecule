import { createElement } from "react";

import { cn } from "@/utils/tailwind";
import { checkForStylingClasses } from "@/utils/checkForStylingClasses";

export interface BoxProps {
  as: string;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

const Box = ({ as = "div", className, children, ref, ...props }: BoxProps) => {
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
};

Box.displayName = "Box";

export { Box };
