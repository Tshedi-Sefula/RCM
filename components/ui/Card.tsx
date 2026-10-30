import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentProps<"div"> & {
  // Adds a hover lift; use when the card is (or contains) a link.
  interactive?: boolean;
  padded?: boolean;
};

export default function Card({ interactive = false, padded = true, className, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card",
        padded && "p-6 sm:p-8",
        interactive &&
          "transition duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    />
  );
}
