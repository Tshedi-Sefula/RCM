"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  // Stagger siblings, e.g. delay={index * 80}.
  delay?: number;
  className?: string;
};

// Fades and lifts its children in when scrolled into view.
// Disabled for prefers-reduced-motion in app/globals.css.
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-visible={inView}
      className={cn("reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
