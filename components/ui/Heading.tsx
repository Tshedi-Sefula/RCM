import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Level = 1 | 2 | 3 | 4;

const sizes: Record<Level, string> = {
  1: "text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02]",
  2: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight",
  3: "text-xl sm:text-2xl font-bold leading-snug",
  4: "text-lg font-semibold leading-snug",
};

type HeadingProps = ComponentProps<"h2"> & {
  // Semantic level (h1–h4).
  level?: Level;
  // Visual size, when it should differ from the semantic level.
  size?: Level;
};

// h1–h3 use the display font; h4 uses the body font for compact UI labels.
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
      className={cn(
        "mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-accent sm:text-sm",
        "before:h-0.5 before:w-8 before:bg-current",
        className,
      )}
    />
  );
}
