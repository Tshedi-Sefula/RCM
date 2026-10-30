import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import Container from "./Container";

type Tone = "surface" | "white" | "cream" | "primary";

const tones: Record<Tone, string> = {
  surface: "bg-brand-surface",
  white: "bg-white",
  cream: "bg-brand-cream",
  primary: "bg-brand-primary text-white",
};

const spacing = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32",
};

type SectionProps = ComponentProps<"section"> & {
  // Alternate tones between sections for visual rhythm.
  tone?: Tone;
  spacing?: keyof typeof spacing;
  // Wraps children in a Container. Set false to control width yourself.
  contained?: boolean;
  containerWidth?: ComponentProps<typeof Container>["width"];
};

export default function Section({
  tone = "surface",
  spacing: space = "md",
  contained = true,
  containerWidth,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section {...rest} className={cn(tones[tone], spacing[space], className)}>
      {contained ? <Container width={containerWidth}>{children}</Container> : children}
    </section>
  );
}
