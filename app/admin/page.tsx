import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, Eyebrow, Heading } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { getDashboardCounts, type DashboardCounts } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Admin dashboard" };

const stats: { key: keyof DashboardCounts; label: string; href: string }[] = [
  { key: "upcomingEvents", label: "Upcoming events", href: "/admin/events" },
  { key: "calendarEntries", label: "Calendar entries", href: "/admin/calendar" },
  { key: "galleryImages", label: "Gallery images", href: "/admin/gallery" },
  { key: "streamVideos", label: "Stream videos", href: "/admin/streams" },
];

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <Eyebrow>Dashboard</Eyebrow>
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </AdminLayout>
  );
}

async function Dashboard() {
  const [{ email }, counts] = await Promise.all([requireAdmin(), getDashboardCounts()]);

  return (
    <>
      <Heading level={1} size={2}>
        Welcome back
      </Heading>
      <p className="mt-2 text-brand-muted">
        Signed in as <span className="font-medium text-brand-ink">{email}</span>. Here&apos;s what&apos;s on the
        site right now.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.key}>
            <Link href={stat.href} className="block h-full rounded-2xl">
              <Card interactive className="h-full">
                <p className="font-display text-4xl font-semibold">{counts[stat.key] ?? "—"}</p>
                <p className="mt-1 text-sm font-medium text-brand-muted">{stat.label}</p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      {Object.values(counts).includes(null) && (
        <p role="alert" className="mt-4 text-sm text-error">
          Some counts couldn&apos;t be loaded. Refresh to try again.
        </p>
      )}
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-hidden>
      <div className="h-10 w-64 animate-pulse rounded bg-brand-cream" />
      <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-brand-cream" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.key} className="h-32 animate-pulse rounded-2xl bg-brand-cream" />
        ))}
      </div>
    </div>
  );
}
