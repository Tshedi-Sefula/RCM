"use client";

import type { ReactNode } from "react";
import Modal from "@/components/admin/Modal";
import { FormError } from "@/components/admin/Field";
import { Button } from "@/components/ui";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  pendingLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  pending?: boolean;
  error?: string;
};

// "Are you sure?" step for destructive actions. Can't be dismissed mid-action.
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  pendingLabel = "Working…",
  onConfirm,
  onCancel,
  pending = false,
  error,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} dismissible={!pending} className="max-w-md">
      <div className="text-brand-muted">{children}</div>
      {error && <FormError className="mt-4">{error}</FormError>}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={pending} className="bg-error text-white hover:bg-[#991b1b]">
          {pending ? pendingLabel : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
