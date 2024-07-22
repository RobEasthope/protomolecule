import { cva } from "class-variance-authority";

export const containerVariants = cva(
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
