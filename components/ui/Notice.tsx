import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type NoticeProps = {
  title: string;
  children?: ReactNode;
  // "error" for failed loads; "info" for empty states.
  tone?: "info" | "error";
  className?: string;
};

// Friendly message box for empty and error states.
export default function Notice({ title, children, tone = "info", className }: NoticeProps) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "rounded-lg border p-8 text-center",
        tone === "error" ? "border-error/20 bg-error-soft" : "border-dashed border-brand-line bg-white",
        className,
      )}
    >
      <p className={cn("font-display text-xl font-bold", tone === "error" && "text-error")}>{title}</p>
      {children && <div className="mt-2 text-brand-muted">{children}</div>}
    </div>
  );
}
