import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/admin/DataTable";
import ChatMessages from "@/components/ChatMessages";
import PastorLayout from "@/components/pastor/PastorLayout";
import PastorThreadView from "@/components/pastor/PastorThreadView";
import { Heading, Notice } from "@/components/ui";
import { contactTopicLabel } from "@/lib/contact";
import { getPastorThread } from "@/lib/data/pastor";
import { THREAD_STATUS_LABELS, UUID_PATTERN } from "@/lib/threads";

export const metadata: Metadata = { title: "Conversation" };

const linkClass = "text-brand-primary underline underline-offset-2 hover:text-brand-accent-strong";

export default function PastorThreadPage({ params }: PageProps<"/pastor/threads/[id]">) {
  return (
    <PastorLayout>
      <p className="mb-6 text-sm">
        <Link href="/pastor" className="font-semibold text-brand-accent-strong underline-offset-4 hover:underline">
          ← All messages
        </Link>
      </p>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-brand-cream" aria-hidden />}>
        {params.then(({ id }) => (
          <Conversation id={id} />
        ))}
      </Suspense>
    </PastorLayout>
  );
}

async function Conversation({ id }: { id: string }) {
  if (!UUID_PATTERN.test(id)) notFound();
  const { data, error } = await getPastorThread(id);

  if (error !== null) {
    return (
      <Notice tone="error" title="This conversation couldn't be loaded">
        Refresh the page to try again.
      </Notice>
    );
  }
  if (!data) notFound();
  const { thread, messages } = data;

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Heading level={1} size={3}>
            {thread.sender_name}
          </Heading>
          <Badge>{contactTopicLabel(thread.topic)}</Badge>
          <Badge>{THREAD_STATUS_LABELS[thread.status]}</Badge>
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {thread.sender_email && (
            <li>
              <a href={`mailto:${thread.sender_email}`} className={linkClass}>
                {thread.sender_email}
              </a>
            </li>
          )}
          {thread.sender_phone && (
            <li>
              <a href={`tel:${thread.sender_phone.replace(/[^\d+]/g, "")}`} className={linkClass}>
                {thread.sender_phone}
              </a>
            </li>
          )}
        </ul>
      </div>

      {thread.status === "closed" ? (
        <div className="overflow-hidden rounded-lg border border-brand-line bg-white shadow-card">
          <ChatMessages messages={messages} ownSide="pastor" />
          <p className="border-t border-brand-line px-4 py-3 text-sm text-brand-muted sm:px-6">
            This conversation is closed, so it no longer appears in your messages.
          </p>
        </div>
      ) : (
        <PastorThreadView threadId={thread.id} messages={messages} />
      )}
    </>
  );
}
