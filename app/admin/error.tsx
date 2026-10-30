"use client";

import ErrorState from "@/components/ErrorState";

export default function AdminError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <main id="main" className="flex flex-1 items-center">
      <ErrorState error={error} retry={retry} homeHref="/admin" homeLabel="Back to the dashboard" />
    </main>
  );
}
