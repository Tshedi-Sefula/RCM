"use client";

import { useState, useTransition, type ReactNode } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui";
import type { ActionResult } from "@/lib/action-result";

type DeleteButtonProps = {
  // A Server Action with the row's id already bound.
  action: () => Promise<ActionResult>;
  // Shown in the button's accessible name and the dialog, e.g. the title.
  itemName: string;
  children?: ReactNode;
};

// Delete button that asks for confirmation first.
export default function DeleteButton({ action, itemName, children }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function confirm() {
    setError(undefined);
    startTransition(async () => {
      const result = await action();
      if (result.ok) setOpen(false);
      else setError(result.error);
    });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${itemName}`}
        className="text-error hover:bg-error-soft"
      >
        Delete
      </Button>
      <ConfirmDialog
        open={open}
        title="Delete this item?"
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        onConfirm={confirm}
        onCancel={() => {
          setOpen(false);
          setError(undefined);
        }}
        pending={pending}
        error={error}
      >
        <p>
          <span className="font-semibold text-brand-ink">{itemName}</span> will be removed from the website.
          This can&apos;t be undone.
        </p>
        {children}
      </ConfirmDialog>
    </>
  );
}
