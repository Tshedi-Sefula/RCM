import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClasses =
  "mt-1.5 block h-11 w-full rounded-lg border border-brand-line bg-white px-3.5 text-brand-ink transition focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30 aria-invalid:border-error";

export const textareaClasses = cn(inputClasses, "h-auto min-h-28 py-2.5 leading-relaxed");

type FieldProps = {
  // The control's id; also used to wire up the hint and error.
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  // Receives the aria-describedby value to put on the control.
  children: (describedBy: string | undefined) => ReactNode;
};

// Label + control + hint/error for admin forms.
export default function Field({ id, label, optional, hint, error, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional && <span className="ml-1 font-normal text-brand-muted">(optional)</span>}
      </label>
      {children(describedBy)}
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-brand-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormError({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p role="alert" className={cn("rounded-lg bg-error-soft px-4 py-3 text-sm font-medium text-error", className)}>
      {children}
    </p>
  );
}
