import { cn } from "@/lib/cn";

// Thin maroon-and-navy rule echoing the two strokes of the logo's "R".
export default function BrandStripe({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex h-1", className)}>
      <span className="flex-[3] bg-brand-accent" />
      <span className="flex-1 bg-brand-navy" />
    </div>
  );
}
