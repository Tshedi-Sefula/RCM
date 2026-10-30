import type { Metadata } from "next";
import { Suspense } from "react";
import { deleteThread } from "@/app/admin/messages/actions";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/admin/DataTable";
import DeleteButton from "@/components/admin/DeleteButton";
import ForwardForm from "@/components/admin/ForwardForm";
import PageHeader from "@/components/admin/PageHeader";
import { Notice } from "@/components/ui";
import { contactTopicLabel } from "@/lib/contact";
import { getForwardedThread, getInboxThreads, type Pastor } from "@/lib/data/admin";
import { site } from "@/lib/site";
import { THREAD_STATUS_LABELS, UUID_PATTERN } from "@/lib/threads";
import type { ContactThread } from "@/lib/types/database";

export const metadata: Metadata = { title: "Messages" };

const dateFormat = new Intl.DateTimeFormat("en-ZA", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: site.timeZone,
});

// wa.me needs the number in international form without "+"; South African
// numbers are often written locally, e.g. 082 123 4567 → 27821234567.
function whatsappUrl(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("0") ? `27${digits.slice(1)}` : digits}`;
}

const linkClass = "text-brand-primary underline underline-offset-2 hover:text-brand-accent-strong";

export default function AdminMessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Questions and prayer requests from the website's contact form. Forward each one to a pastor, who replies on the site; the sender reads the reply through their private link."
      />
      <Suspense fallback={null}>
        {searchParams.then(({ forwarded }) => (typeof forwarded === "string" ? <ForwardedNotice id={forwarded} /> : null))}
      </Suspense>
      <Suspense fallback={<MessagesSkeleton />}>
        <MessageList />
      </Suspense>
    </AdminLayout>
  );
}

async function ForwardedNotice({ id }: { id: string }) {
  if (!UUID_PATTERN.test(id)) return null;
  const forwarded = await getForwardedThread(id);
  if (!forwarded) return null;
  return (
    <p role="status" className="mb-6 rounded-lg border border-success/20 bg-success-soft px-4 py-3 font-medium text-success">
      The message from {forwarded.senderName} was forwarded to {forwarded.pastorName}.
    </p>
  );
}

async function MessageList() {
  const { data, error } = await getInboxThreads();

  if (error !== null) {
    return (
      <Notice tone="error" title="Messages couldn't be loaded">
        Refresh the page to try again.
      </Notice>
    );
  }

  const { threads, pastors } = data;
  const pastorNames = new Map(pastors.map((p) => [p.id, p.full_name ?? p.email ?? "Unnamed pastor"]));
  // New threads, plus any whose pastor's account was removed.
  const toForward = threads.filter((t) => t.status === "new" || !t.assigned_pastor_id);
  const assigned = threads.filter((t) => t.status !== "new" && t.assigned_pastor_id);

  return (
    <div className="space-y-12">
      <section aria-labelledby="to-forward">
        <h2 id="to-forward" className="mb-4 font-display text-2xl font-bold">
          To forward <span className="text-brand-muted">({toForward.length})</span>
        </h2>
        {toForward.length === 0 ? (
          <Notice title="Nothing to forward">New messages from the website&apos;s contact form will appear here.</Notice>
        ) : (
          <ul className="space-y-4">
            {toForward.map((thread) => (
              <li key={thread.id}>
                <ThreadCard thread={thread} pastors={pastors} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="with-pastors">
        <h2 id="with-pastors" className="mb-4 font-display text-2xl font-bold">
          With pastors <span className="text-brand-muted">({assigned.length})</span>
        </h2>
        {assigned.length === 0 ? (
          <Notice title="No forwarded messages">Messages you forward will be listed here until they&apos;re closed.</Notice>
        ) : (
          <ul className="divide-y divide-brand-line overflow-hidden rounded-lg border border-brand-line bg-white shadow-card">
            {assigned.map((thread) => (
              <li key={thread.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {thread.sender_name}
                    <span className="font-normal text-brand-muted"> · {contactTopicLabel(thread.topic)}</span>
                  </p>
                  <p className="text-sm text-brand-muted">
                    {pastorNames.get(thread.assigned_pastor_id!) ?? "Pastor"} · last activity{" "}
                    <time dateTime={thread.last_activity_at}>{dateFormat.format(new Date(thread.last_activity_at))}</time>
                  </p>
                </div>
                <Badge
                  className={thread.status === "forwarded" ? "bg-brand-accent-soft text-brand-accent-strong" : undefined}
                >
                  {THREAD_STATUS_LABELS[thread.status]}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ThreadCard({ thread, pastors }: { thread: ContactThread; pastors: Pastor[] }) {
  return (
    <article className="rounded-lg border border-brand-accent/40 border-l-4 border-l-brand-accent bg-white p-5 shadow-card sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold">{thread.sender_name}</h3>
            {thread.status === "new" ? (
              <Badge className="bg-brand-accent text-white">New</Badge>
            ) : (
              <Badge>Pastor removed</Badge>
            )}
            <Badge className={thread.topic === "prayer" ? "bg-brand-accent-soft text-brand-accent-strong" : undefined}>
              {contactTopicLabel(thread.topic)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-brand-muted">
            <time dateTime={thread.created_at}>{dateFormat.format(new Date(thread.created_at))}</time>
          </p>
        </div>
        <DeleteButton action={deleteThread.bind(null, thread.id)} itemName={`the message from ${thread.sender_name}`} />
      </header>

      <p className="mt-4 whitespace-pre-wrap break-words text-brand-ink">{thread.original_message}</p>

      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-brand-line pt-4 text-sm">
        {thread.sender_email && (
          <li>
            <a href={`mailto:${thread.sender_email}`} className={linkClass}>
              {thread.sender_email}
            </a>
          </li>
        )}
        {thread.sender_phone && (
          <>
            <li>
              <a href={`tel:${thread.sender_phone.replace(/[^\d+]/g, "")}`} className={linkClass}>
                {thread.sender_phone}
              </a>
            </li>
            <li>
              <a href={whatsappUrl(thread.sender_phone)} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp<span className="sr-only"> {thread.sender_name} (opens in a new tab)</span>
              </a>
            </li>
          </>
        )}
      </ul>

      <div className="mt-5 border-t border-brand-line pt-4">
        <ForwardForm threadId={thread.id} pastors={pastors} />
      </div>
    </article>
  );
}

function MessagesSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-lg bg-brand-cream" />
      ))}
    </div>
  );
}
