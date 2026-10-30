"use client";

import { useSearchParams } from "next/navigation";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { submitContactMessage } from "@/app/(site)/contact/actions";
import Button from "@/components/ui/Button";
import type { ActionResult } from "@/lib/action-result";
import { CONTACT_LIMITS, CONTACT_TOPICS, isContactTopic } from "@/lib/contact";
import type { ContactTopic } from "@/lib/types/database";

const inputClass =
  "mt-1.5 w-full rounded-md border border-brand-line bg-white px-3.5 py-2.5 transition focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20 aria-invalid:border-error";

// Reads ?topic=prayer etc. so "Request Prayer" links open with it chosen.
// useSearchParams needs a Suspense boundary; render <ContactForm /> as its fallback.
export function ContactFormWithTopic() {
  const topic = useSearchParams().get("topic");
  return <ContactForm defaultTopic={isContactTopic(topic) ? topic : undefined} />;
}

export default function ContactForm({ defaultTopic = "general" }: { defaultTopic?: ContactTopic }) {
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const errors = result && !result.ok ? (result.fieldErrors ?? {}) : {};

  // onSubmit rather than <form action>, which would reset the inputs on error.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setResult(await submitContactMessage(formData));
    });
  }

  if (result?.ok) {
    return (
      <div role="status" className="rounded-lg border border-success/20 bg-success-soft p-8 text-center">
        <p className="text-xl font-bold text-success">Thank you, your message has been sent.</p>
        <p className="mt-2 text-brand-muted">Someone from the church will get back to you soon.</p>
        <Button variant="secondary" size="sm" className="mt-6" onClick={() => setResult(undefined)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <Field label="What is your message about?" id="topic" error={errors.topic}>
        <select id="topic" name="topic" defaultValue={defaultTopic} className={inputClass} aria-invalid={!!errors.topic}>
          {CONTACT_TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Name" id="name" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_LIMITS.name}
          className={inputClass}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" id="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.email}
            className={inputClass}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : "contact-hint"}
          />
        </Field>
        <Field label="Phone or WhatsApp" id="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={CONTACT_LIMITS.phone}
            className={inputClass}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : "contact-hint"}
          />
        </Field>
      </div>
      <p id="contact-hint" className="-mt-2 text-sm text-brand-muted">
        Give us at least one way to reply.
      </p>

      <Field label="Message" id="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={CONTACT_LIMITS.message}
          className={inputClass}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
      </Field>

      {/* Honeypot for bots; hidden from people and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {result && !result.ok && (
        <p role="alert" className="rounded-md bg-error-soft p-3 text-sm text-error">
          {result.error}
        </p>
      )}

      <p className="text-sm text-brand-muted">
        Prayer requests are kept private and seen only by the church&apos;s leadership team.
      </p>
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
