import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Level = 1 | 2 | 3 | 4;

const sizes: Record<Level, string> = {
  1: "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]",
  2: "text-3xl sm:text-4xl font-semibold tracking-tight leading-tight",
  3: "text-xl sm:text-2xl font-semibold leading-snug",
  4: "text-lg font-semibold leading-snug",
};

type HeadingProps = ComponentProps<"h2"> & {
  // Semantic level (h1–h4).
  level?: Level;
  // Visual size, when it should differ from the semantic level.
  size?: Level;
};

// h1–h3 use the display serif; h4 uses the body sans for compact UI labels.
export default function Heading({ level = 2, size, className, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  const visual = size ?? level;
  return (
    <Tag
      {...rest}
      className={cn(visual === 4 ? "font-sans" : "font-display", sizes[visual], "text-balance", className)}
    />
  );
}

// Small uppercase label shown above section headings.
export function Eyebrow({ className, ...rest }: ComponentProps<"p">) {
  return (
    <p
      {...rest}
      className={cn("mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-strong", className)}
    />
  );
}
