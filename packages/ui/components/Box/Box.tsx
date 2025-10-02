import { cn } from "../../utils/tailwind";
import { createElement } from "react";

export type BoxProps = {
  readonly as: string;
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly ref?: React.Ref<HTMLDivElement>;
};

/**
 * @deprecated Box component is deprecated. Use standard HTML elements instead.
 *
 * For static elements:
 * ```tsx
 * {children && <div className={cn("...")}>{children}</div>}
 * ```
 *
 * For dynamic elements:
 * ```tsx
 * {children && createElement(as, { className: cn("...") }, children)}
 * ```
 * @see https://github.com/RobEasthope/protomolecule/issues/187
 */
export function Box({
  as = "div",
  children,
  className,
  ref,
  ...props
}: BoxProps) {
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
}
