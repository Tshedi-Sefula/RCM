import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";
// `inverse` adapts secondary/ghost for dark backgrounds (hero, footer).
type Tone = "default" | "inverse";

// Slightly rounded corners, matching the reference site's 6–8px radius.
const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-wide transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-base sm:text-lg",
};

const variants: Record<Variant, Record<Tone, string>> = {
  primary: {
    default:
      "bg-brand-accent text-white shadow-sm hover:-translate-y-0.5 hover:bg-brand-accent-strong hover:shadow-md active:translate-y-0",
    // On dark surfaces a white fill reads stronger than maroon.
    inverse:
      "bg-white text-brand-ink shadow-sm hover:-translate-y-0.5 hover:bg-brand-accent hover:text-white hover:shadow-md active:translate-y-0",
  },
  secondary: {
    default:
      "border border-brand-ink/80 text-brand-ink hover:bg-brand-ink hover:text-white",
    inverse: "border border-white/60 text-white hover:border-white hover:bg-white hover:text-brand-ink",
  },
  ghost: {
    default: "text-brand-primary hover:bg-brand-primary/5",
    inverse: "text-white hover:bg-white/10",
  },
};

type StyleProps = { variant?: Variant; size?: Size; tone?: Tone; className?: string };

export function buttonClasses({
  variant = "primary",
  size = "md",
  tone = "default",
  className,
}: StyleProps = {}) {
  return cn(base, sizes[size], variants[variant][tone], className);
}

type ButtonAsButton = StyleProps & ComponentProps<"button"> & { href?: undefined };
type ButtonAsLink = StyleProps & ComponentProps<typeof Link> & { href: string; external?: boolean };

// Renders a <Link> when `href` is given, otherwise a <button>.
// Pass `external` to open the link in a new tab.
export default function Button(props: ButtonAsButton | ButtonAsLink) {
  if (props.href !== undefined) {
    const { variant, size, tone, className, external, ...rest } = props;
    const classes = buttonClasses({ variant, size, tone, className });
    if (external) {
      return <a {...(rest as ComponentProps<"a">)} className={classes} target="_blank" rel="noopener noreferrer" />;
    }
    return <Link {...rest} className={classes} />;
  }

  const { variant, size, tone, className, type = "button", ...rest } = props;
  return <button type={type} {...rest} className={buttonClasses({ variant, size, tone, className })} />;
}
