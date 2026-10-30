"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  // While false, Escape and backdrop clicks are ignored (e.g. mid-save).
  dismissible?: boolean;
  className?: string;
};

// Native <dialog> shown with showModal(), so focus trapping, Escape and the
// backdrop come from the browser. `open` drives it; `onClose` keeps the
// parent's state in sync however it was closed.
export default function Modal({ open, onClose, title, children, dismissible = true, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        if (!dismissible) event.preventDefault();
      }}
      // A click on the dialog element itself (not its content) is the backdrop.
      onClick={(event) => {
        if (dismissible && event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-brand-line bg-white p-0 text-brand-ink shadow-card-hover backdrop:bg-brand-ink/50",
        className,
      )}
    >
      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-display text-2xl font-semibold leading-tight">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={!dismissible}
              aria-label="Close"
              className="-mr-2 -mt-1 rounded-full p-2 text-brand-muted transition hover:bg-brand-cream hover:text-brand-ink disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
