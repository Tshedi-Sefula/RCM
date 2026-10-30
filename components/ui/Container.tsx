import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = ComponentProps<"div"> & {
  // "narrow" suits long-form text; "default" is the 1280px site width.
  width?: "narrow" | "default";
};

export default function Container({ width = "default", className, ...rest }: ContainerProps) {
  return (
    <div
      {...rest}
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        width === "narrow" ? "max-w-3xl" : "max-w-7xl",
        className,
      )}
    />
  );
}
