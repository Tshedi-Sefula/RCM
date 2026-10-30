"use client";

import { useEffect } from "react";
import { Button, Container } from "@/components/ui";

type ErrorStateProps = {
  error: unknown;
  retry: () => void;
  title?: string;
  // Where the secondary link goes, e.g. "/" on the site or "/admin" in the dashboard.
  homeHref?: string;
  homeLabel?: string;
};

// Fallback UI for error.tsx boundaries. Server errors arrive without their
// message in production, so this never shows error details to visitors.
export default function ErrorState({
  error,
  retry,
  title = "Something went wrong",
  homeHref = "/",
  homeLabel = "Go to the home page",
}: ErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-24 text-center">
      <div role="alert" className="mx-auto max-w-lg">
        <p className="font-display text-3xl font-semibold text-brand-primary">{title}</p>
        <p className="mt-4 text-brand-muted">
          This part of the page couldn&apos;t be loaded. It&apos;s usually temporary, so please try again.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => retry()}>Try again</Button>
          <Button href={homeHref} variant="secondary">
            {homeLabel}
          </Button>
        </div>
      </div>
    </Container>
  );
}
