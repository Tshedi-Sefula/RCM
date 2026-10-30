import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center justify-center px-4 py-24 text-center">
      <div className="max-w-lg">
        <Image src="/logo.svg" alt="" width={56} height={56} className="mx-auto" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-strong">
          {site.shortName}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brand-primary">Page not found</h1>
        <p className="mt-4 text-brand-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Go to the home page</Button>
          <Button href="/events" variant="secondary">
            See upcoming events
          </Button>
        </div>
      </div>
    </main>
  );
}
