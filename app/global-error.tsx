"use client";

import { useEffect } from "react";
import "./globals.css";

// Replaces the root layout when it fails, so it brings its own <html>/<body>.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-brand-surface px-4 text-center text-brand-ink">
        <title>Something went wrong</title>
        <div role="alert" className="max-w-lg">
          <h1 className="text-3xl font-bold text-brand-primary">Something went wrong</h1>
          <p className="mt-4 text-brand-muted">The site couldn&apos;t be loaded. Please try again in a moment.</p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-8 rounded-md bg-brand-accent px-6 py-3 font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
