"use client";

import { useActionState, useSyncExternalStore } from "react";
import { staffLogin, type LoginState } from "@/app/login/actions";
import { inputClasses } from "@/components/admin/Field";
import { Button } from "@/components/ui";
import { EMAIL_MAX, LOCKOUT_MS, MAX_ATTEMPTS, PASSWORD_MAX, PASSWORD_MIN } from "@/lib/login";

// Failed attempts live in localStorage so a reload doesn't reset the lockout.
// It only slows down someone at the keyboard; Supabase Auth's rate limits
// cover direct requests to the API.
const LOCKOUT_KEY = "rcm-login-lockout";
const LOCKOUT_EVENT = "rcm-login-lockout";

type Lockout = { failures: number; lockedUntil: number };

function readLockout(): Lockout {
  try {
    const value = JSON.parse(localStorage.getItem(LOCKOUT_KEY) ?? "null");
    if (typeof value?.failures === "number" && typeof value?.lockedUntil === "number") return value;
  } catch {
    // Storage blocked or corrupt: no lockout.
  }
  return { failures: 0, lockedUntil: 0 };
}

function writeLockout(lockout: Lockout) {
  try {
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify(lockout));
  } catch {
    // Storage blocked: the lockout can't persist.
  }
  window.dispatchEvent(new Event(LOCKOUT_EVENT));
}

function recordFailure() {
  const { failures, lockedUntil } = readLockout();
  // Attempts made after an earlier lockout expired start a fresh count.
  const count = (lockedUntil && lockedUntil <= Date.now() ? 0 : failures) + 1;
  writeLockout(
    count >= MAX_ATTEMPTS
      ? { failures: 0, lockedUntil: Date.now() + LOCKOUT_MS }
      : { failures: count, lockedUntil: 0 },
  );
}

// Re-reads every second so the countdown ticks, and on changes from this or
// another tab.
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(LOCKOUT_EVENT, onChange);
  const timer = window.setInterval(onChange, 1000);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LOCKOUT_EVENT, onChange);
    window.clearInterval(timer);
  };
}

function secondsLeft() {
  return Math.max(0, Math.ceil((readLockout().lockedUntil - Date.now()) / 1000));
}

async function loginAndCount(prev: LoginState, formData: FormData): Promise<LoginState> {
  // On success the action redirects and never returns here.
  const result = await staffLogin(prev, formData);
  if (result?.error) recordFailure();
  return result;
}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAndCount, undefined);
  const lockedFor = useSyncExternalStore(subscribe, secondsLeft, () => 0);
  const locked = lockedFor > 0;

  return (
    <form action={formAction} className="space-y-5">
      {locked ? (
        <p role="alert" className="rounded-lg bg-error-soft px-4 py-3 text-sm font-medium text-error">
          Too many failed attempts. Try again in {lockedFor} second{lockedFor === 1 ? "" : "s"}.
        </p>
      ) : (
        state?.error && (
          <p role="alert" className="rounded-lg bg-error-soft px-4 py-3 text-sm font-medium text-error">
            {state.error}
          </p>
        )
      )}

      <fieldset disabled={locked || pending} className="space-y-5">
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
            maxLength={EMAIL_MAX}
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
            minLength={PASSWORD_MIN}
            maxLength={PASSWORD_MAX}
            className={inputClasses}
          />
        </div>

        <Button type="submit" className="w-full">
          {pending ? "Signing in…" : "Sign In"}
        </Button>
      </fieldset>
    </form>
  );
}
