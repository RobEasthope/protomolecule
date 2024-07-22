import { type VariantProps } from "class-variance-authority";
import { createElement, forwardRef } from "react";

import { areThereAnyStyles, cn } from "@/utils/tailwind";
import { containerVariants } from "@/components/Container/Container.variants";

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as: string;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ as = "div", className, breakout, maxWidth, children, ...props }, ref) => {
    if (!children) return null;

    return createElement(
      as,
      {
        className: areThereAnyStyles(
          cn(containerVariants({ breakout, maxWidth }), className),
        ),
        ref,
        ...props,
      },
      children,
    );
  },
);

Container.displayName = "Container";
