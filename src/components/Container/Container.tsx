import { cva, type VariantProps } from "class-variance-authority";
import { createElement, forwardRef } from "react";

import { areThereAnyStyles, cn } from "@/utils/tailwind";

const containerVariants = cva(
  // Base styles
  null,
  {
    variants: {
      breakout: {
        true: "max-w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] w-screen",
      },
      maxWidth: {
        none: "",
        auto: "max-w-auto",
        small: "max-w-lg",
        text: "max-w-prose",
        medium: "max-w-5xl",
        large: "max-w-7xl",
        full: "w-screen",
      },
    },
    defaultVariants: {
      maxWidth: null,
    },
  },
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as: string;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
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

export { Container, containerVariants };
