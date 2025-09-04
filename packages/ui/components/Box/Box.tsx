import { cn } from "@/utils/tailwind";
import { createElement } from "react";

export type BoxProps = {
  readonly as: string;
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly ref?: React.Ref<HTMLDivElement>;
};

const Box = ({ as = "div", children, className, ref, ...props }: BoxProps) => {
  if (!children) {
    return null;
  }

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
