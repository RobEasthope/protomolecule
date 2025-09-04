import { cn } from "@/utils/tailwind";
import { cva, type VariantProps } from "class-variance-authority";
import { createElement } from "react";

const containerVariants = cva(
  // Base styles
  null,
  {
    defaultVariants: {
      maxWidth: null,
    },
    variants: {
      breakout: {
        true: "max-w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] w-screen",
      },
      maxWidth: {
        auto: "max-w-auto",
        full: "w-screen",
        large: "max-w-7xl",
        medium: "max-w-5xl",
        none: "",
        small: "max-w-lg",
        text: "max-w-prose",
      },
    },
  },
);

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof containerVariants> & {
    readonly as: string;
  };

export function Container({
  as = "div",
  breakout,
  children,
  className,
  maxWidth,
  ...props
}: ContainerProps) {
  if (!children) {
    return null;
  }

  return createElement(
    as,
    {
      className: cn(containerVariants({ breakout, maxWidth }), className),
      ...props,
    },
    children,
  );
}

Container.displayName = "Container";
