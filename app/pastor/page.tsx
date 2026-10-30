import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Badge } from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import PastorLayout from "@/components/pastor/PastorLayout";
import { Notice } from "@/components/ui";
import { contactTopicLabel } from "@/lib/contact";
import { getPastorThreads } from "@/lib/data/pastor";
import { site } from "@/lib/site";
import { THREAD_STATUS_LABELS } from "@/lib/threads";

export const metadata: Metadata = { title: { absolute: "Pastor dashboard" } };

const dateFormat = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: site.timeZone,
});

export default function PastorDashboardPage() {
  return (
    <PastorLayout>
      <PageHeader
        eyebrow="Conversations"
        title="Your messages"
        description="Messages the church office has forwarded to you. Those waiting for your reply are listed first."
      />
      <Suspense fallback={<ThreadsSkeleton />}>
        <ThreadList />
      </Suspense>
    </PastorLayout>
  );
}

async function ThreadList() {
  const { data: threads, error } = await getPastorThreads();

  if (error !== null) {
    return (
      <Notice tone="error" title="Your messages couldn't be loaded">
        Refresh the page to try again.
      </Notice>
    );
  }
  if (threads.length === 0) {
    return <Notice title="No messages right now">Messages forwarded to you will appear here.</Notice>;
  }

  // Waiting on the pastor first, then most recent activity.
  const sorted = [...threads].sort(
    (a, b) => Number(b.status === "forwarded") - Number(a.status === "forwarded"),
  );

  return (
    <ul className="divide-y divide-brand-line overflow-hidden rounded-lg border border-brand-line bg-white shadow-card">
      {sorted.map((thread) => (
        <li key={thread.id}>
          <Link
            href={`/pastor/threads/${thread.id}`}
            className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 px-5 py-4 transition-colors hover:bg-brand-cream/60"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {thread.sender_name}
                <span className="font-normal text-brand-muted"> · {contactTopicLabel(thread.topic)}</span>
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-brand-muted">{thread.original_message}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <Badge className={thread.status === "forwarded" ? "bg-brand-accent text-white" : undefined}>
                {thread.status === "forwarded" ? "Needs reply" : THREAD_STATUS_LABELS[thread.status]}
              </Badge>
              <time dateTime={thread.last_activity_at} className="text-xs text-brand-muted">
                {dateFormat.format(new Date(thread.last_activity_at))}
              </time>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ThreadsSkeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-lg bg-brand-cream" />
      ))}
    </div>
  );
}
