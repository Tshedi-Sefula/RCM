"use client";

import { useState, useTransition, type FormEvent } from "react";
import { saveCalendarEntry } from "@/app/admin/calendar/actions";
import Field, { FormError, inputClasses, textareaClasses } from "@/components/admin/Field";
import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui";
import type { ActionResult } from "@/lib/action-result";
import { calendarCategories, shortTime } from "@/lib/calendar";
import type { CalendarCategory, CalendarEntry } from "@/lib/types/database";

const categoryOptions = Object.entries(calendarCategories) as [
  CalendarCategory,
  (typeof calendarCategories)[CalendarCategory],
][];

// "Add calendar entry" (no `entry`) or "Edit" (with one) button and its form dialog.
export default function CalendarEntryFormButton({ entry }: { entry?: CalendarEntry }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const [startDate, setStartDate] = useState(entry?.start_date ?? "");
  const editing = entry !== undefined;

  function close() {
    setOpen(false);
    setResult(undefined);
    setStartDate(entry?.start_date ?? "");
  }

  // onSubmit rather than <form action>, which would reset the inputs on error.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setResult(undefined);
    startTransition(async () => {
      const outcome = await saveCalendarEntry(formData);
      if (outcome.ok) close();
      else setResult(outcome);
    });
  }

  const errors = result?.ok === false ? (result.fieldErrors ?? {}) : {};
  const fieldId = (name: string) => `entry-${entry?.id ?? "new"}-${name}`;

  return (
    <>
      {editing ? (
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)} aria-label={`Edit ${entry.title}`}>
          Edit
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>Add calendar entry</Button>
      )}

      <Modal
        open={open}
        onClose={close}
        title={editing ? "Edit calendar entry" : "New calendar entry"}
        dismissible={!pending}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {result?.ok === false && <FormError>{result.error}</FormError>}
          {editing && <input type="hidden" name="id" value={entry.id} />}

          <Field id={fieldId("title")} label="Title" error={errors.title}>
            {(describedBy) => (
              <input
                id={fieldId("title")}
                name="title"
                required
                maxLength={200}
                defaultValue={entry?.title}
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={describedBy}
                className={inputClasses}
              />
            )}
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={fieldId("start_date")} label="Start date" error={errors.start_date}>
              {(describedBy) => (
                <input
                  id={fieldId("start_date")}
                  name="start_date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  aria-invalid={errors.start_date ? true : undefined}
                  aria-describedby={describedBy}
                  className={inputClasses}
                />
              )}
            </Field>

            <Field
              id={fieldId("end_date")}
              label="End date"
              optional
              hint="For entries spanning several days."
              error={errors.end_date}
            >
              {(describedBy) => (
                <input
                  id={fieldId("end_date")}
                  name="end_date"
                  type="date"
                  min={startDate || undefined}
                  defaultValue={entry?.end_date ?? undefined}
                  aria-invalid={errors.end_date ? true : undefined}
                  aria-describedby={describedBy}
                  className={inputClasses}
                />
              )}
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id={fieldId("start_time")}
              label="Start time"
              optional
              hint="Leave empty for an all-day entry."
              error={errors.start_time}
            >
              {(describedBy) => (
                <input
                  id={fieldId("start_time")}
                  name="start_time"
                  type="time"
                  defaultValue={entry?.start_time ? shortTime(entry.start_time) : undefined}
                  aria-invalid={errors.start_time ? true : undefined}
                  aria-describedby={describedBy}
                  className={inputClasses}
                />
              )}
            </Field>

            <Field id={fieldId("end_time")} label="End time" optional error={errors.end_time}>
              {(describedBy) => (
                <input
                  id={fieldId("end_time")}
                  name="end_time"
                  type="time"
                  defaultValue={entry?.end_time ? shortTime(entry.end_time) : undefined}
                  aria-invalid={errors.end_time ? true : undefined}
                  aria-describedby={describedBy}
                  className={inputClasses}
                />
              )}
            </Field>
          </div>

          <Field id={fieldId("location")} label="Location" optional error={errors.location}>
            {(describedBy) => (
              <input
                id={fieldId("location")}
                name="location"
                maxLength={200}
                defaultValue={entry?.location ?? undefined}
                aria-invalid={errors.location ? true : undefined}
                aria-describedby={describedBy}
                className={inputClasses}
              />
            )}
          </Field>

          <Field id={fieldId("category")} label="Category" error={errors.category}>
            {(describedBy) => (
              <select
                id={fieldId("category")}
                name="category"
                required
                defaultValue={entry?.category ?? "service"}
                aria-invalid={errors.category ? true : undefined}
                aria-describedby={describedBy}
                className={inputClasses}
              >
                {categoryOptions.map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field id={fieldId("description")} label="Description" optional>
            {(describedBy) => (
              <textarea
                id={fieldId("description")}
                name="description"
                rows={3}
                defaultValue={entry?.description ?? undefined}
                aria-describedby={describedBy}
                className={textareaClasses}
              />
            )}
          </Field>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={close} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : editing ? "Save changes" : "Add entry"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
