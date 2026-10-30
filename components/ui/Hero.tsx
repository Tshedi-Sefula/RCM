import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import Container from "./Container";
import Heading, { Eyebrow } from "./Heading";
import BrandStripe from "./BrandStripe";

type HeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  // Background photo; without one a near-black gradient is used.
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
        size === "lg" ? "min-h-[86vh] py-32" : "min-h-[42vh] py-20 sm:py-28",
      )}
    >
      {image && (
        <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      )}
      {/* Dark overlay keeps text readable over any photo. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10",
          image
            ? "bg-gradient-to-b from-brand-primary/85 via-brand-primary/60 to-brand-primary/95"
            : "bg-[radial-gradient(ellipse_at_top_right,rgb(142_27_32/0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgb(30_58_110/0.3),transparent_50%),linear-gradient(160deg,#18181c,#0f0f11)]",
        )}
      />

      <Container className={cn(align === "center" && "text-center")}>
        <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          {eyebrow && <Eyebrow className="text-brand-accent-light">{eyebrow}</Eyebrow>}
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

      <BrandStripe className="absolute inset-x-0 bottom-0" />
    </section>
  );
}
