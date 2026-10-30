import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SocialLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  // Brand colour on hover/focus, e.g. "hover:text-spotify focus-visible:text-spotify".
  brandClassName: string;
  className?: string;
};

// Circular icon button that opens in a new tab. Inherits the surrounding
// text colour at rest and turns the platform's brand colour on hover/focus.
export default function SocialLink({ href, label, icon, brandClassName, className }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10",
        brandClassName,
        className,
      )}
    >
      {icon}
    </a>
  );
}
