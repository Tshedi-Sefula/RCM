"use client";

import { useState, useTransition } from "react";
import { setMessageRead } from "@/app/admin/messages/actions";
import { Button } from "@/components/ui";

// Toggles a contact message between read and unread.
export default function MarkReadButton({ id, isRead }: { id: string; isRead: boolean }) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function toggle() {
    setError(undefined);
    startTransition(async () => {
      const result = await setMessageRead(id, !isRead);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={toggle} disabled={pending}>
        {pending ? "Saving…" : isRead ? "Mark as unread" : "Mark as read"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </>
  );
}
