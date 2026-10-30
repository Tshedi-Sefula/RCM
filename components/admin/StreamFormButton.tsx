"use client";

import { useState, useTransition, type FormEvent } from "react";
import { saveStreamVideo } from "@/app/admin/streams/actions";
import Field, { FormError, inputClasses } from "@/components/admin/Field";
import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui";
import type { ActionResult } from "@/lib/action-result";
import { streamWatchUrl } from "@/lib/media";
import type { StreamPlatform, StreamVideo } from "@/lib/types/database";

const sourceCopy: Record<StreamPlatform, { label: string; hint: string; placeholder: string }> = {
  youtube: {
    label: "YouTube link or video ID",
    hint: "Paste the link from YouTube's Share button, or just the 11-character video ID.",
    placeholder: "https://www.youtube.com/watch?v=…",
  },
  facebook: {
    label: "Facebook video link",
    hint: "Paste the full facebook.com link to the video. The video must be public.",
    placeholder: "https://www.facebook.com/…/videos/…",
  },
};

// "Add stream" (no `stream`) or "Edit" (with one) button and its form dialog.
export default function StreamFormButton({ stream }: { stream?: StreamVideo }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ActionResult>();
  const [pending, startTransition] = useTransition();
  const [platform, setPlatform] = useState<StreamPlatform>(stream?.platform ?? "youtube");
  const editing = stream !== undefined;

  function close() {
    setOpen(false);
    setResult(undefined);
    setPlatform(stream?.platform ?? "youtube");
  }

  // onSubmit rather than <form action>, which would reset the inputs on error.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setResult(undefined);
    startTransition(async () => {
      const outcome = await saveStreamVideo(formData);
      if (outcome.ok) close();
      else setResult(outcome);
    });
  }

  const errors = result?.ok === false ? (result.fieldErrors ?? {}) : {};
  const fieldId = (name: string) => `stream-${stream?.id ?? "new"}-${name}`;
  const copy = sourceCopy[platform];
  // Show the stored YouTube ID as a full link, which is easier to recognise.
  const sourceDefault = stream
    ? stream.platform === "youtube"
      ? (streamWatchUrl("youtube", stream.video_id_or_url) ?? stream.video_id_or_url)
      : stream.video_id_or_url
    : undefined;

  return (
    <>
      {editing ? (
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)} aria-label={`Edit ${stream.title}`}>
          Edit
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>Add stream</Button>
      )}

      <Modal open={open} onClose={close} title={editing ? "Edit stream" : "New stream"} dismissible={!pending}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {result?.ok === false && <FormError>{result.error}</FormError>}
          {editing && <input type="hidden" name="id" value={stream.id} />}

          <Field id={fieldId("title")} label="Title" error={errors.title}>
            {(describedBy) => (
              <input
                id={fieldId("title")}
                name="title"
                required
                maxLength={200}
                defaultValue={stream?.title}
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={describedBy}
                className={inputClasses}
              />
            )}
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={fieldId("platform")} label="Platform" error={errors.platform}>
              {(describedBy) => (
                <select
                  id={fieldId("platform")}
                  name="platform"
                  required
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as StreamPlatform)}
                  aria-invalid={errors.platform ? true : undefined}
                  aria-describedby={describedBy}
                  className={inputClasses}
                >
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                </select>
              )}
            </Field>

            <Field id={fieldId("stream_date")} label="Stream date" optional error={errors.stream_date}>
              {(describedBy) => (
                <input
                  id={fieldId("stream_date")}
                  name="stream_date"
                  type="date"
                  defaultValue={stream?.stream_date ?? undefined}
                  aria-invalid={errors.stream_date ? true : undefined}
                  aria-describedby={describedBy}
                  className={inputClasses}
                />
              )}
            </Field>
          </div>

          <Field id={fieldId("video_id_or_url")} label={copy.label} hint={copy.hint} error={errors.video_id_or_url}>
            {(describedBy) => (
              <input
                id={fieldId("video_id_or_url")}
                name="video_id_or_url"
                required
                defaultValue={sourceDefault}
                placeholder={copy.placeholder}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={errors.video_id_or_url ? true : undefined}
                aria-describedby={describedBy}
                className={inputClasses}
              />
            )}
          </Field>

          <label className="flex items-start gap-3 rounded-lg border border-brand-line p-4">
            <input
              type="checkbox"
              name="is_memorable"
              defaultChecked={stream?.is_memorable}
              className="mt-0.5 size-4 rounded border-brand-line accent-brand-primary"
            />
            <span>
              <span className="block text-sm font-semibold">Memorable stream</span>
              <span className="block text-sm text-brand-muted">
                The newest memorable stream is the one shown on the home page.
              </span>
            </span>
          </label>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={close} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : editing ? "Save changes" : "Add stream"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
