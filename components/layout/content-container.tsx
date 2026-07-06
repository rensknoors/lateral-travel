import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface ContentContainerProps extends ComponentProps<"div"> {
  size?: "sm" | "md" | "lg" | "xl";
}

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
} as const;

const ContentContainer = ({
  className,
  size = "lg",
  ...props
}: ContentContainerProps) => (
  <div
    className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", containerSizes[size], className)}
    {...props}
  />
);

export { ContentContainer };
