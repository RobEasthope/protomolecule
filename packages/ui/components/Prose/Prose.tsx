import { cn } from "@/utils/tailwind";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
// eslint-disable-next-line import/no-unassigned-import
import "./prose.css";

export type ProseProps = React.HTMLAttributes<HTMLDivElement> & {
  readonly as?: string;
  readonly asChild?: boolean;
};

const Prose = React.forwardRef<HTMLDivElement, ProseProps>(
  ({ as = "div", asChild = false, children, className, ...props }, ref) => {
    if (!children) {
      return null;
    }

    const Comp = asChild ? Slot : as;
    return (
      <Comp
        className={cn(
          "prose text-typography text-base print:text-[11pt]",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Prose.displayName = "Prose";

export { Prose };
