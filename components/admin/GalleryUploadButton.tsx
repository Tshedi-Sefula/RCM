"use client";

import { useState, useTransition, type FormEvent } from "react";
import { addGalleryImages } from "@/app/admin/gallery/actions";
import Field, { FormError, inputClasses } from "@/components/admin/Field";
import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui";
import type { ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKETS } from "@/lib/types/database";
import {
  CAPTION_MAX_LENGTH,
  GALLERY_MAX_FILES,
  IMAGE_ACCEPT,
  newImagePath,
  validateImage,
} from "@/lib/uploads";

// Parallel uploads at a time; enough to be quick without flooding a phone connection.
const UPLOAD_CONCURRENCY = 3;

type Progress = { done: number; total: number };

// Uploads every chosen photo to Storage, then hands their object paths to
// the Server Action. All or nothing: if any upload fails, the others are
// removed again so a retry doesn't leave duplicates behind.
async function submitPhotos(formData: FormData, onProgress: (progress: Progress) => void): Promise<ActionResult> {
  const files = formData.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
  formData.delete("photos");

  if (files.length === 0) {
    const message = "Choose at least one photo.";
    return { ok: false, error: message, fieldErrors: { photos: message } };
  }
  if (files.length > GALLERY_MAX_FILES) {
    const message = `Upload up to ${GALLERY_MAX_FILES} photos at a time.`;
    return { ok: false, error: message, fieldErrors: { photos: message } };
  }
  for (const file of files) {
    const problem = validateImage(file);
    if (problem) {
      const message = `${file.name}: ${problem}`;
      return { ok: false, error: message, fieldErrors: { photos: message } };
    }
  }

  const storage = createClient().storage.from(STORAGE_BUCKETS.gallery);
  const uploaded: string[] = [];
  const failed: string[] = [];
  let next = 0;
  onProgress({ done: 0, total: files.length });

  async function worker() {
    while (next < files.length) {
      const file = files[next++];
      const path = newImagePath(file);
      const { error } = await storage.upload(path, file, { contentType: file.type, cacheControl: "31536000" });
      if (error) failed.push(file.name);
      else uploaded.push(path);
      onProgress({ done: uploaded.length + failed.length, total: files.length });
    }
  }
  await Promise.all(Array.from({ length: Math.min(UPLOAD_CONCURRENCY, files.length) }, worker));

  if (failed.length > 0) {
    if (uploaded.length > 0) await storage.remove(uploaded);
    const message = `${failed.join(", ")} couldn't be uploaded, so nothing was added. Try again.`;
    return { ok: false, error: message, fieldErrors: { photos: message } };
  }

  for (const path of uploaded) formData.append("image_path", path);
  return addGalleryImages(formData);
}

// "Upload photos" button and its form dialog.
export default function GalleryUploadButton() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ActionResult>();
  const [progress, setProgress] = useState<Progress>();
  const [fileCount, setFileCount] = useState(0);
  const [pending, startTransition] = useTransition();

  function close() {
    setOpen(false);
    setResult(undefined);
    setProgress(undefined);
    setFileCount(0);
  }

  // onSubmit rather than <form action>, which would reset the inputs on error.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setResult(undefined);
    startTransition(async () => {
      const outcome = await submitPhotos(formData, setProgress);
      setProgress(undefined);
      if (outcome.ok) close();
      else setResult(outcome);
    });
  }

  const errors = result?.ok === false ? (result.fieldErrors ?? {}) : {};
  const plural = fileCount === 1 ? "photo" : "photos";

  let submitLabel = fileCount > 0 ? `Upload ${fileCount} ${plural}` : "Upload";
  if (pending) {
    submitLabel =
      progress && progress.done < progress.total ? `Uploading ${progress.done + 1} of ${progress.total}…` : "Saving…";
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Upload photos</Button>

      <Modal open={open} onClose={close} title="Upload photos" dismissible={!pending}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {result?.ok === false && <FormError>{result.error}</FormError>}

          <Field
            id="gallery-photos"
            label="Photos"
            hint={`Choose one or more. JPEG, PNG, WebP or AVIF, up to 10 MB each, ${GALLERY_MAX_FILES} at a time.`}
            error={errors.photos}
          >
            {(describedBy) => (
              <input
                id="gallery-photos"
                name="photos"
                type="file"
                accept={IMAGE_ACCEPT}
                multiple
                required
                onChange={(e) => setFileCount(e.target.files?.length ?? 0)}
                aria-invalid={errors.photos ? true : undefined}
                aria-describedby={describedBy}
                className="mt-2 block w-full text-sm text-brand-muted file:mr-4 file:rounded-full file:border-0 file:bg-brand-cream file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-ink hover:file:bg-brand-accent-soft"
              />
            )}
          </Field>

          <Field
            id="gallery-caption"
            label="Caption"
            optional
            hint={
              fileCount > 1
                ? `This caption will be added to all ${fileCount} photos. To caption them differently, upload them separately.`
                : "Shown under the photo. If you choose several photos, they all get this caption."
            }
            error={errors.caption}
          >
            {(describedBy) => (
              <input
                id="gallery-caption"
                name="caption"
                maxLength={CAPTION_MAX_LENGTH}
                aria-invalid={errors.caption ? true : undefined}
                aria-describedby={describedBy}
                className={inputClasses}
              />
            )}
          </Field>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={close} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
