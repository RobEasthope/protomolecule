import { createElement } from "react";

import { cn } from "@/utils/tailwind";

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
      className: cn(className),
      ref,
      ...props,
    },
    children,
  );
};

Box.displayName = "Box";

export { Box };
