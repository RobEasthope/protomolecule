import { type VariantProps } from "class-variance-authority";
import { createElement } from "react";

import { areThereAnyStyles, cn } from "@/utils/tailwind";
import { containerVariants } from "@/components/Container/Container.variants";

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as: string;
}

export function Container({
  as = "div",
  className,
  breakout,
  maxWidth,
  children,
  ...props
}: ContainerProps) {
  if (!children) return null;

  return createElement(
    as,
    {
      className: areThereAnyStyles(
        cn(containerVariants({ breakout, maxWidth }), className),
      ),
      ...props,
    },
    children,
  );
}

Container.displayName = "Container";
