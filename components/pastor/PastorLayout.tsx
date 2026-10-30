import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { pastorLogout } from "@/app/pastor/actions";
import { Button } from "@/components/ui";
import { requirePastor } from "@/lib/auth";
import { site } from "@/lib/site";

// Chrome for signed-in pastor pages: a top bar with the pastor's email and a
// logout button. Like AdminLayout, only the email reads the session.
export default function PastorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <header className="bg-brand-primary text-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/pastor" className="flex shrink-0 items-center gap-3">
            <Image src="/rcm-logo.png" alt="" width={36} height={36} className="rounded-full" />
            <span className="font-display text-base font-semibold leading-tight">
              {site.shortName}
              <span className="block font-sans text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                Pastor
              </span>
            </span>
          </Link>
          <div className="flex min-w-0 items-center gap-3">
            <Suspense fallback={<span className="h-4 w-40 animate-pulse rounded bg-white/10" aria-hidden />}>
              <PastorEmail />
            </Suspense>
            <form action={pastorLogout}>
              <Button type="submit" variant="secondary" tone="inverse" size="sm">
                Log out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}

async function PastorEmail() {
  const { email } = await requirePastor();
  return (
    <p className="hidden min-w-0 truncate text-sm text-white/80 sm:block">
      <span className="sr-only">Signed in as </span>
      {email}
    </p>
  );
}
