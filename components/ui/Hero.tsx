import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import Container from "./Container";
import Heading, { Eyebrow } from "./Heading";

type HeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  // Background photo; without one a warm navy gradient is used.
  image?: string;
  // CTAs, e.g. one or two <Button>s with tone="inverse".
  actions?: ReactNode;
  align?: "center" | "left";
  // "lg" for the home page, "md" for inner pages.
  size?: "md" | "lg";
};

export default function Hero({
  title,
  subtitle,
  eyebrow,
  image,
  actions,
  align = "center",
  size = "md",
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative isolate flex items-center overflow-hidden bg-brand-primary text-white",
        size === "lg" ? "min-h-[78vh] py-28" : "min-h-[44vh] py-20 sm:py-24",
      )}
    >
      {image && (
        <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      )}
      {/* Warm overlay keeps text readable over any photo. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10",
          image
            ? "bg-gradient-to-b from-brand-primary/80 via-brand-primary/65 to-brand-primary/90"
            : "bg-[radial-gradient(ellipse_at_top_right,rgb(201_162_39/0.28),transparent_55%),linear-gradient(160deg,#1e293b,#0f172a)]",
        )}
      />

      <Container className={cn(align === "center" && "text-center")}>
        <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          {eyebrow && <Eyebrow className="text-brand-accent">{eyebrow}</Eyebrow>}
          <Heading level={1} className="text-white">
            {title}
          </Heading>
          {subtitle && (
            <p className="mt-6 text-lg leading-relaxed text-white/85 sm:text-xl">{subtitle}</p>
          )}
          {actions && (
            <div
              className={cn(
                "mt-10 flex flex-wrap gap-4",
                align === "center" && "justify-center",
              )}
            >
              {actions}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
