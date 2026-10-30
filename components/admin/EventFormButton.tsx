"use client";

import Image from "next/image";
import { useState, useTransition, type FormEvent } from "react";
import { saveEvent } from "@/app/admin/events/actions";
import Field, { FormError, inputClasses, textareaClasses } from "@/components/admin/Field";
import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui";
import type { ActionResult } from "@/lib/action-result";
import { toDateTimeInputValue } from "@/lib/dates";
import { isOptimizableImage } from "@/lib/media";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKETS, type ChurchEvent } from "@/lib/types/database";
import { IMAGE_ACCEPT, newImagePath, validateImage } from "@/lib/uploads";

// Uploads the chosen poster to Storage (if any), then hands the form to the
// Server Action with the file swapped for its object path.
async function submitEvent(formData: FormData): Promise<ActionResult> {
  const poster = formData.get("poster");
  formData.delete("poster");

  if (poster instanceof File && poster.size > 0) {
    const problem = validateImage(poster);
    if (problem) return { ok: false, error: problem, fieldErrors: { poster: problem } };

    const path = newImagePath(poster);
    const { error } = await createClient()
      .storage.from(STORAGE_BUCKETS.eventPosters)
      .upload(path, poster, { contentType: poster.type, cacheControl: "31536000" });
    if (error) {
      const message = "The poster couldn't be uploaded. Try again, or save without it.";
      return { ok: false, error: message, fieldErrors: { poster: message } };
    }
    formData.set("poster_path", path);
  }

  return saveEvent(formData);
}

// "Create new event" (no `event`) or "Edit" (with one) button and its form dialog.
export default function EventFormButton({ event }: { event?: ChurchEvent }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const editing = event !== undefined;

  function close() {
    setOpen(false);
    setResult(undefined);
  }

  // onSubmit rather than <form action>, which would reset the inputs on error.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setResult(undefined);
    startTransition(async () => {
      const outcome = await submitEvent(formData);
      if (outcome.ok) close();
      else setResult(outcome);
    });
  }

  const errors = result?.ok === false ? (result.fieldErrors ?? {}) : {};
  const fieldId = (name: string) => `event-${event?.id ?? "new"}-${name}`;

  return (
    <>
      {editing ? (
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)} aria-label={`Edit ${event.title}`}>
          Edit
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>Create new event</Button>
      )}

      <Modal open={open} onClose={close} title={editing ? "Edit event" : "New event"} dismissible={!pending}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {result?.ok === false && <FormError>{result.error}</FormError>}
          {editing && <input type="hidden" name="id" value={event.id} />}

          <Field id={fieldId("title")} label="Title" error={errors.title}>
            {(describedBy) => (
              <input
                id={fieldId("title")}
                name="title"
                required
                maxLength={200}
                defaultValue={event?.title}
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={describedBy}
                className={inputClasses}
              />
            )}
          </Field>

          <Field
            id={fieldId("event_date")}
            label="Date and time"
            hint="South African time."
            error={errors.event_date}
          >
            {(describedBy) => (
              <input
                id={fieldId("event_date")}
                name="event_date"
                type="datetime-local"
                required
                defaultValue={event ? toDateTimeInputValue(event.event_date) : undefined}
                aria-invalid={errors.event_date ? true : undefined}
                aria-describedby={describedBy}
                className={inputClasses}
              />
            )}
          </Field>

          <Field id={fieldId("location")} label="Location" optional>
            {(describedBy) => (
              <input
                id={fieldId("location")}
                name="location"
                defaultValue={event?.location ?? undefined}
                aria-describedby={describedBy}
                className={inputClasses}
              />
            )}
          </Field>

          <Field id={fieldId("description")} label="Description" optional>
            {(describedBy) => (
              <textarea
                id={fieldId("description")}
                name="description"
                rows={4}
                defaultValue={event?.description ?? undefined}
                aria-describedby={describedBy}
                className={textareaClasses}
              />
            )}
          </Field>

          <Field
            id={fieldId("poster")}
            label={event?.poster_url ? "Replace poster" : "Poster"}
            optional
            hint="JPEG, PNG, WebP or AVIF, up to 10 MB."
            error={errors.poster}
          >
            {(describedBy) => (
              <>
                {event?.poster_url && (
                  <div className="mt-2 flex items-center gap-4 rounded-lg border border-brand-line bg-brand-surface p-3">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-brand-cream">
                      <Image
                        src={event.poster_url}
                        alt="Current poster"
                        fill
                        sizes="64px"
                        unoptimized={!isOptimizableImage(event.poster_url)}
                        className="object-cover"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="remove_poster"
                        className="size-4 rounded border-brand-line accent-brand-primary"
                      />
                      Remove current poster
                    </label>
                  </div>
                )}
                <input
                  id={fieldId("poster")}
                  name="poster"
                  type="file"
                  accept={IMAGE_ACCEPT}
                  aria-invalid={errors.poster ? true : undefined}
                  aria-describedby={describedBy}
                  className="mt-2 block w-full text-sm text-brand-muted file:mr-4 file:rounded-full file:border-0 file:bg-brand-cream file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-ink hover:file:bg-brand-accent-soft"
                />
              </>
            )}
          </Field>

          <label className="flex items-start gap-3 rounded-lg border border-brand-line p-4">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={event?.is_featured}
              className="mt-0.5 size-4 rounded border-brand-line accent-brand-primary"
            />
            <span>
              <span className="block text-sm font-semibold">Featured event</span>
              <span className="block text-sm text-brand-muted">Highlight this event on the website.</span>
            </span>
          </label>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={close} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : editing ? "Save changes" : "Create event"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
