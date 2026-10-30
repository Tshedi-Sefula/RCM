"use client";

import { useActionState } from "react";
import { forwardThread } from "@/app/admin/messages/actions";
import { inputClasses } from "@/components/admin/Field";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Pastor } from "@/lib/data/admin";

// "Forward to pastor" dropdown on an inbox message. Success redirects.
export default function ForwardForm({ threadId, pastors }: { threadId: string; pastors: Pastor[] }) {
  const [state, formAction, pending] = useActionState(forwardThread.bind(null, threadId), undefined);
  const selectId = `forward-${threadId}`;

  if (pastors.length === 0) {
    return (
      <p className="text-sm text-brand-muted">
        No pastor accounts yet. Add one in Supabase Auth and set its profile role to &quot;pastor&quot;.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="min-w-56 flex-1 sm:flex-none">
        <label htmlFor={selectId} className="text-sm font-semibold">
          Forward to pastor
        </label>
        <select
          id={selectId}
          name="pastor_id"
          required
          defaultValue=""
          className={cn(inputClasses, "sm:w-64")}
          aria-invalid={state && !state.ok ? true : undefined}
        >
          <option value="" disabled>
            Choose a pastor…
          </option>
          {pastors.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name ?? p.email ?? "Unnamed pastor"}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" size="sm" className="h-11" disabled={pending}>
        {pending ? "Forwarding…" : "Forward"}
      </Button>
      {state && !state.ok && (
        <p role="alert" className="w-full text-sm font-medium text-error">
          {state.error}
        </p>
      )}
    </form>
  );
}
