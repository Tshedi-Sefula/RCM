"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { isOptimizableImage } from "@/lib/media";

export type LightboxImage = { src: string; alt: string; caption?: string | null };

type LightboxProps = {
  images: LightboxImage[];
  // Index of the open image, or null when closed.
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

// Full-screen image viewer built on <dialog>, which handles focus trapping,
// Escape to close and the page-blocking backdrop. Arrow keys move between images.
export default function Lightbox({ images, index, onIndexChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const image = open ? images[index] : null;
  const count = images.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const step = (delta: number) => {
    if (index === null) return;
    onIndexChange((index + delta + count) % count);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label={image ? image.alt : "Image viewer"}
      onClose={() => onIndexChange(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      // Clicking the backdrop (the dialog itself, outside the content) closes it.
      onClick={(e) => {
        if (e.target === e.currentTarget) onIndexChange(null);
      }}
      className="m-0 h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 text-white backdrop:bg-black/90"
    >
      {image && (
        <div
          className="flex h-full flex-col items-center justify-center gap-4 p-4 sm:p-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) onIndexChange(null);
          }}
        >
          <div className="relative h-full max-h-[80vh] w-full max-w-5xl">
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              unoptimized={!isOptimizableImage(image.src)}
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <p className="max-w-3xl text-center text-sm text-white/85">
            {image.caption && <span>{image.caption} · </span>}
            {index! + 1} of {count}
          </p>

          <button
            type="button"
            onClick={() => onIndexChange(null)}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:left-4"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:right-4"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
