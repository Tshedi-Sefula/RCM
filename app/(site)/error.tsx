"use client";

import ErrorState from "@/components/ErrorState";

// Catches render errors in public pages; the header and footer stay visible.
export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorState error={error} retry={retry} />;
}
