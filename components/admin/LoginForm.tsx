"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { Button } from "@/components/ui";

const inputClasses =
  "mt-1.5 block h-11 w-full rounded-lg border border-brand-line bg-white px-3.5 text-brand-ink transition focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state?.error && (
        <p role="alert" className="rounded-lg bg-error-soft px-4 py-3 text-sm font-medium text-error">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.email}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClasses}
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
