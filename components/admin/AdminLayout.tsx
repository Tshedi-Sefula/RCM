import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import { Button } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { site } from "@/lib/site";

// Dashboard chrome for every signed-in admin page: sidebar nav, header with
// the admin's email and a logout button. The shell itself is static; only
// the email reads the session, so it streams in behind its own boundary.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col md:flex-row">
      <aside className="bg-brand-primary text-white md:sticky md:top-0 md:flex md:h-dvh md:w-64 md:shrink-0 md:flex-col">
        <div className="px-4 pt-4 md:px-5 md:pt-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={36} height={36} />
            <span className="font-display text-base font-semibold leading-tight">
              {site.shortName}
              <span className="block font-sans text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                Admin
              </span>
            </span>
          </Link>
        </div>
        <div className="px-3 py-3 md:mt-6 md:flex-1 md:px-3">
          <AdminNav />
        </div>
        <div className="hidden border-t border-white/10 px-5 py-4 md:block">
          <Link href="/" className="text-sm text-white/80 hover:text-brand-accent">
            ← View website
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-end gap-3 border-b border-brand-line bg-white px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<span className="h-4 w-40 animate-pulse rounded bg-brand-cream" aria-hidden />}>
            <AdminEmail />
          </Suspense>
          <form action={logout}>
            <Button type="submit" variant="secondary" size="sm">
              Log out
            </Button>
          </form>
        </header>
        <main id="main" className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

async function AdminEmail() {
  const { email } = await requireAdmin();
  return (
    <p className="min-w-0 truncate text-sm text-brand-muted">
      <span className="sr-only">Signed in as </span>
      {email}
    </p>
  );
}
